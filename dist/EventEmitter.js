"use strict";function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}(),EventEmitter=function(){function e(){_classCallCheck(this,e),this._events={}}return _createClass(e,[{key:"emit",value:function(e){var n=void 0===arguments[1]?null:arguments[1],t=this._events[e],r=null;if(Array.isArray(t)&&t.length>0){for(var a=0;a<t.length;a++)r=t[a],r.once&&(t[a]=null),r.callback(n);for(;-1!==t.indexOf(null);)t.splice(t.indexOf(null),1)}}},{key:"on",value:function(e,n){var t=void 0===arguments[2]?!1:arguments[2];if(Array.isArray(e))for(var r=0;r<e.length;r++)this.on(e[r],n);else{var a=e.split(/,|, | /);if(a.length>1)for(var r=0;r<a.length;r++)this.on(a[r],n);else Array.isArray(this._events[e])||(this._events[e]=[]),this._events[e].push({once:t,callback:n})}}},{key:"once",value:function(e,n){this.on(e,n,!0)}}]),e}();
//# sourceMappingURL=EventEmitter.js.map