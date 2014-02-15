loadScript = function(sScriptSrc, oCallback) {
    var oHead = document.getElementsByTagName('head')[0];
    var oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = sScriptSrc;
    oScript.onload = oCallback;
    oScript.onreadystatechange = function() {
        if (this.readyState === 'complete') {
            oCallback();
        }
    };
    oHead.appendChild(oScript);
};

setMode = function(editor, mode){
    loadScript("/include/ace/src-min/mode-" + mode + ".js", function(){
        var Mode = require("ace/mode/" + mode).Mode;
        editor.getSession().setMode(new Mode());

    });
};

var fnv1aHash = function(str, it) {
    var FNV1_32A_INIT = 0x811c9dc5;
    var hval = FNV1_32A_INIT;
    for (var i = 0; i < str.length; ++i)
    {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if (it > 4) {
        return '#' + (hval >>> 0).toString(16).substring(0, 6);
    } else {
        return fnv1aHash((hval.toString(16) + (hval >>> 0).toString(16)), it + 1);
    }
};

var getRGB = function(str) {
    return fnv1aHash(str, 0);
};