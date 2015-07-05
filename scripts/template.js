var _gsScope = (typeof(module) !== "undefined" && module.exports && typeof(global) !== "undefined") ? global : this || window; //helps ensure compatibility with AMD/RequireJS and CommonJS/Node
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push( function() {
    //ignore the line above this and at the very end - those are for ensuring things load in the proper order
    "use strict";

    /**__CODE_GOES_HERE__**/

    _gsScope._gsDefine.plugin(new TypedPlugin());

}); if (_gsScope._gsDefine) { _gsScope._gsQueue.pop()(); }