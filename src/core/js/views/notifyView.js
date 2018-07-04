define([
    'core/js/adapt'
], function(Adapt) {

    var NotifyView = Backbone.View.extend({

        className: function() {
            var classes = 'notify ';
            classes += (this.model.get('_classes') || '');
            return classes;
        },

        disableAnimation: false,

        escapeKeyAttached: false,

        isOpen: false,

        initialize: function() {
            this.disableAnimation = Adapt.config.has('_disableAnimation') ? Adapt.config.get('_disableAnimation') : false;

            this.setupEventListeners();

            //include accessibility globals in notify model
            this.model.set('_globals', Adapt.course.get('_globals'));
            this.render();
        },

        setupEventListeners: function() {
            this.listenTo(Adapt, {
                'remove page:scrollTo': this.closeNotify,
                'notify:resize': this.resetNotifySize,
                'notify:cancel': this.cancelNotify,
                'notify:close': this.closeNotify,
                'device:resize': this.resetNotifySize,
                'accessibility:toggle': this.onAccessibilityToggle
            });

            this._onKeyUp = _.bind(this.onKeyUp, this);
            this.setupEscapeKey();
        },

        setupEscapeKey: function() {
            var hasAccessibility = Adapt.config.has('_accessibility') && Adapt.config.get('_accessibility')._isActive;

            if (!hasAccessibility && ! this.escapeKeyAttached) {
                $(window).on('keyup', this._onKeyUp);
                this.escapeKeyAttached = true;
            } else {
                $(window).off('keyup', this._onKeyUp);
                this.escapeKeyAttached = false;
            }
        },

        onAccessibilityToggle: function() {
            this.setupEscapeKey();
        },

        onKeyUp: function(event) {
            if (event.which != 27) return;
            event.preventDefault();

            this.cancelNotify();
        },

        events: {
            'click .js-notify-btn-alert':'onAlertButtonClicked',
            'click .js-notify-btn-prompt': 'onPromptButtonClicked',
            'click .js-notify-close-btn': 'onCloseButtonClicked',
            'click .js-notify-shadow-click': 'onShadowClicked'
        },

        render: function() {
            var data = this.model.toJSON();
            var template = Handlebars.templates['notify'];

            //hide notify container
            this.$el.addClass('u-visibility-hidden');
            //attach popup + shadow
            this.$el.html(template(data)).prependTo('body');
            //hide popup
            this.$('.notify__popup').addClass('u-visibility-hidden');
            //show notify container
            this.$el.removeClass('u-visibility-hidden');

            this.showNotify();
            return this;
        },

        onAlertButtonClicked: function(event) {
            event.preventDefault();
            //tab index preservation, notify must close before subsequent callback is triggered
            this.closeNotify();
            Adapt.trigger(this.model.get('_callbackEvent'), this);
        },

        onPromptButtonClicked: function(event) {
            event.preventDefault();
            //tab index preservation, notify must close before subsequent callback is triggered
            this.closeNotify();
            Adapt.trigger($(event.currentTarget).attr('data-event'));
        },

        onCloseButtonClicked: function(event) {
            event.preventDefault();
            //tab index preservation, notify must close before subsequent callback is triggered
            this.cancelNotify();
        },

        onShadowClicked: function(event) {
            event.preventDefault();
            if (this.model.get("_closeOnShadowClick") === false) return;
            this.cancelNotify();
        },

        cancelNotify: function() {
            if (this.model.get("_isCancellable") === false) return;
            //tab index preservation, notify must close before subsequent callback is triggered
            this.closeNotify();
            Adapt.trigger('notify:cancelled');
        },

        resetNotifySize: function() {
            $('.notify__popup').removeAttr('style');

            this.resizeNotify();
        },

        resizeNotify: function() {
            var windowHeight = $(window).height();
            var notifyHeight = this.$('.notify__popup').outerHeight();

            if (notifyHeight > windowHeight) {
                this.$('.notify__popup').css({
                    'height':'100%',
                    'top':0,
                    'overflow-y': 'scroll',
                    '-webkit-overflow-scrolling': 'touch'
                });
            } else {
                this.$('.notify__popup').css({
                    'margin-top': -(notifyHeight/2)
                });
            }
        },

        showNotify: function() {
            this.isOpen = true;
            this.addSubView();

            Adapt.trigger('notify:opened', this);

            this.$el.imageready( _.bind(loaded, this));

            function loaded() {
                if (this.disableAnimation) {
                    this.$('.notify__shadow').css('display', 'block');
                } else {

                    this.$('.notify__shadow').velocity({ opacity: 0 }, {duration:0}).velocity({ opacity: 1 }, {duration:400, begin: _.bind(function() {
                        this.$('.notify-shadow').css('display', 'block');
                    }, this)});

                }

                this.resizeNotify();

                if (this.disableAnimation) {

                    this.$('.notify__popup').removeClass('u-visibility-hidden');
                    complete.call(this);

                } else {

                    this.$('.notify__popup').velocity({ opacity: 0 }, {duration:0}).velocity({ opacity: 1 }, { duration:400, begin: _.bind(function() {
                        this.$('.notify__popup').removeClass('u-visibility-hidden');
                        complete.call(this);
                    }, this) });

                }

                function complete() {
                    //allows popup manager to control focus
                    Adapt.trigger('popup:opened', this.$('.notify__popup'));
                    $('body').scrollDisable();
                    $('html').addClass('notify');

                    //set focus to first accessible element
                    this.$('.notify__popup').a11y_focus();
                }
            }

        },

        addSubView: function() {

            this.subView = this.model.get("_view");
            if (!this.subView) return;

            this.$(".notify__content-inner").append(this.subView.$el);

        },

        closeNotify: function (event) {
            //prevent from being invoked multiple times - see https://github.com/adaptlearning/adapt_framework/issues/1659
            if (!this.isOpen) return;
            this.isOpen = false;

            if (this.disableAnimation) {

                this.$('.notify__popup').addClass('u-visibility-hidden');
                this.$el.addClass('u-visibility-hidden');

                this.remove();

            } else {

                this.$('.notify__popup').velocity({ opacity: 0 }, {duration:400, complete: _.bind(function() {
                    this.$('.notify__popup').addClass('u-visibility-hidden');
                }, this)});

                this.$('.notify__shadow').velocity({ opacity: 0 }, {duration:400, complete:_.bind(function() {
                    this.$el.addClass('u-visibility-hidden');
                    this.remove();
                }, this)});
            }

            $('body').scrollEnable();
            $('html').removeClass('notify');

            Adapt.trigger('popup:closed');
            Adapt.trigger('notify:closed');
        },

        remove: function() {
            this.removeSubView();
            Backbone.View.prototype.remove.apply(this, arguments);
        },

        removeSubView: function() {

            if (!this.subView) return;
            this.subView.remove();
            this.subView = null;

        }

    });

    return NotifyView;

});