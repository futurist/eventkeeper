"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = (function () {

	/**
  * Initializes the Event Emitter.
  */

	function EventEmitter() {
		_classCallCheck(this, EventEmitter);

		this._events = {};
		this._middleware = {};
	}

	_createClass(EventEmitter, [{
		key: "middleware",

		/**
   * Assign Middleware to an Event, and the Event will only fire if the Middleware allows it.
   *
   * @param {string} event
   * @param {function} next
   */
		value: function middleware(event, func) {
			if (!Array.isArray(this._middleware[event])) {
				this._middleware[event] = [];
			}

			this._middleware[event].push(func);
		}
	}, {
		key: "emit",

		/**
   * Emit an Event to Listeners.
   *
   * @param {string} event
   * @param {*} [data]
   */
		value: function emit(event) {
			var data = arguments[1] === undefined ? null : arguments[1];

			var listeners = this._events[event],
			    listener = null,
			    middleware = null,
			    doneCount = 0,
			    execute = false;

			if (Array.isArray(listeners) && listeners.length > 0) {
				for (var l = 0; l < listeners.length; l++) {
					listener = listeners[l];
					middleware = this._middleware[event];

					/* Check and execute Middleware */
					if (Array.isArray(middleware) && middleware.length > 0) {
						for (var m = 0; m < middleware.length; m++) {
							middleware[m](data, function () {
								doneCount++;
							});
						}

						if (doneCount >= middleware.length) {
							execute = true;
						}
					} else {
						execute = true;
					}

					/* If Middleware checks have been passed, execute */
					if (execute) {
						if (listener.once) {
							listeners[l] = null;
						}

						listener.callback(data);
					}
				}

				/* Dirty way of removing used Events */
				while (listeners.indexOf(null) !== -1) {
					listeners.splice(listeners.indexOf(null), 1);
				}
			}
		}
	}, {
		key: "on",

		/**
   * Set callbacks for an event(s).
   *
   * @param {string|Array} event
   * @param {function} callback
   * @param {boolean} [once]
   */
		value: function on(event, callback) {
			var once = arguments[2] === undefined ? false : arguments[2];

			if (Array.isArray(event)) {
				for (var e = 0; e < event.length; e++) {
					this.on(event[e], callback);
				}
			} else {
				var split = event.split(/,|, | /);

				if (split.length > 1) {
					for (var e = 0; e < split.length; e++) {
						this.on(split[e], callback);
					}
				} else {
					if (!Array.isArray(this._events[event])) {
						this._events[event] = [];
					}

					this._events[event].push({
						once: once,
						callback: callback
					});
				}
			}
		}
	}, {
		key: "once",

		/**
   * Same as "on", but will only be executed once.
   *
   * @param {string|Array} event
   * @param {function} callback
   */
		value: function once(event, callback) {
			this.on(event, callback, true);
		}
	}]);

	return EventEmitter;
})();

exports["default"] = EventEmitter;
module.exports = exports["default"];