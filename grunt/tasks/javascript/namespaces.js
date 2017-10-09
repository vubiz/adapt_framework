var _ = require("underscore");

/**
 * For correcting requirejs namespaces in javascript files
 */

function indexOfRegExp(str, regexp, startAt) {
    var beginAt = str.slice(startAt).search(regexp);
    if (beginAt === -1) return -1;
    return startAt+beginAt;
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function replaceNamespaceInDirectRequire(contents, namespace, withNamespace, callback) {

    var escapedNamespace = escapeRegExp(namespace);

    var rex = new RegExp("require\\([\"']{1}("+escapedNamespace+"){1}","g");
    var modified = {};

    var matches = contents.match(rex);
    if (matches) {
        matches.forEach((match)=> {
            modified[namespace] = withNamespace;
            var withWord = match.slice(0, match.search(/["']{1}/)+1) + withNamespace;
            contents = contents.replace(match, withWord); 
        });
    }

    callback(contents, modified);

}

function replaceNamespaceInParams(contents, func, namespace, withNamespace, callback) {

    var escapedNamespace = escapeRegExp(namespace);

    var modified = {};

    var rexBegin = new RegExp(func+"\\W*\\(\\W*[^\\]\\{]*[\\]\\{]", "g");
    var rexNamespace = new RegExp("[\"']{1}("+escapedNamespace+"){1}", "g");

    var fromAt = 0;
    do {

        var startAt = indexOfRegExp(contents, rexBegin, fromAt);
        if (startAt === -1) break;
        var endAt = indexOfRegExp(contents, /[\]\{]{1}/, startAt);
        if (endAt === -1) break;

        var before = startAt ? contents.slice(0, startAt) : "";
        var content = contents.slice(startAt, endAt+1);
        var after = contents.slice(endAt+1);
        
        var matches = content.match(rexNamespace);
        if (matches) {
            matches.forEach((match)=> {
                modified[namespace] = withNamespace;
                var withWord = match.slice(0, match.search(/["']{1}/)+1) + withNamespace;
                content = content.replace(match, withWord);
                if (namespace === "coreJS/") {
                }
            });
            contents = before+content+after;
            endAt = before.length+content.length+1;
        }

        fromAt = endAt+1;

    } while(fromAt < contents.length)

    callback(contents, modified);

}

function replaceNamespace(contents, namespace, withNamespace, callback) {

    var modifieds = {};
    replaceNamespaceInParams(contents, "define", namespace, withNamespace, (rtn, modified)=>{
        contents = rtn;
        _.extend(modifieds, modified);
    });
    replaceNamespaceInParams(contents, "require", namespace, withNamespace, (rtn, modified)=>{
        contents = rtn;
        _.extend(modifieds, modified);
    });
    replaceNamespaceInDirectRequire(contents, namespace, withNamespace, (rtn, modified)=>{
        contents = rtn;
        _.extend(modifieds, modified);
    });

    callback(contents, modifieds);
}

function replace(contents, namespaces, callback) {
    var modifieds = {};
    for (var k in namespaces) {
        replaceNamespace(contents, k, namespaces[k], (rtn, modified)=>{
            contents = rtn;
            _.extend(modifieds, modified);
        });
    }
    
    callback(contents, modifieds);

}

module.exports = {
    replace
};