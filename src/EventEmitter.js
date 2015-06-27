/**
 * Event Emitter
 *
 * @author Thomas Mosey [tom@thomasmosey.com]
 * @version 1.0.14
 */

class EventEmitter {

	/**
	 * Initializes the Event Emitter.
	 */
	constructor() {
		this._events = { };
		this._middleware = { };
	}

	/**
	 * Assign Middleware to an Event, and the Event will only fire if the Middleware allows it.
	 *
	 * @param {string|Array} event
	 * @param {function} func
	 */
	middleware(event, func) {
		if(Array.isArray(event)) {
			for(var e = 0; e < event.length; e++) {
				this.middleware(event[e], func);
			}
		}else{
			if(!Array.isArray(this._middleware[event])) {
				this._middleware[event] = [ ];
			}

			this._middleware[event].push(func);
		}
	}

	/**
	 * Removes all Listeners for an Event and, optionally, all Middleware for the Event.
	 *
	 * @param {string|Array|null} [event]
	 * @param {boolean} [middleware]
	 */
	removeListeners(event = null, middleware = false) {
		if(event != null) {
			if(Array.isArray(event)) {
				for(var e = 0; e < event.length; e++) {
					this.removeListeners(event[e], middleware);
				}
			}else{
				delete this._events[event];

				if(middleware) {
					this.removeMiddleware(event);
				}
			}
		}else{
			this._events = { };
		}

	}

	/**
	 * Removes all Middleware from an Event.
	 *
	 * @param {string|Array|null} [event]
	 */
	removeMiddleware(event) {
		if(event != null) {
			if(Array.isArray(event)) {
				for(var e = 0; e < event.length; e++) {
					this.removeMiddleware(event[e]);
				}
			}else{
				delete this._middleware[event];
			}
		}else{
			this._middleware = { };
		}
	}

	/**
	 * Emit an Event to Listeners.
	 *
	 * @param {string} event
	 * @param {*} [data]
	 * @param {boolean} [silent]
	 */
	emit(event, data = null, silent = false) {
		event = event.toString();

		var listeners = this._events[event],
			listener = null,
			middleware = null,
			doneCount = 0,
			execute = silent;

		if(Array.isArray(listeners) && listeners.length > 0) {
			for(var l = 0; l < listeners.length; l++) {
				listener = listeners[l];

				/* Start Middleware checks unless we're doing a silent emit */
				if(!silent) {
					middleware = this._middleware[event];

					/* Check and execute Middleware */
					if(Array.isArray(middleware) && middleware.length > 0) {
						for(var m = 0; m < middleware.length; m++) {
							middleware[m](data, function(newData = null) {
								if(newData != null) {
									data = newData;
								}

								doneCount++;
							}, event);
						}

						if(doneCount >= middleware.length) {
							execute = true;
						}
					}else{
						execute = true;
					}
				}

				/* If Middleware checks have been passed, execute */
				if(execute) {
					if(listener.once) {
						listeners[l] = null;
					}

					listener.callback(data);
				}
			}

			/* Dirty way of removing used Events */
			while(listeners.indexOf(null) !== -1) {
				listeners.splice(listeners.indexOf(null), 1);
			}
		}
	}

	/**
	 * Set callbacks for an event(s).
	 *
	 * @param {string|Array} event
	 * @param {function} callback
	 * @param {boolean} [once]
	 */
	on(event, callback, once = false) {
		if(Array.isArray(event)) {
			for(var e = 0; e < event.length; e++) {
				this.on(event[e], callback);
			}
		}else{
			event = event.toString();
			var split = event.split(/,|, | /);

			if(split.length > 1) {
				for(var e = 0; e < split.length; e++) {
					this.on(split[e], callback);
				}
			}else{
				if(!Array.isArray(this._events[event])) {
					this._events[event] = [ ];
				}

				this._events[event].push({
					once: once,
					callback: callback
				});
			}
		}
	}

	/**
	 * Same as "on", but will only be executed once.
	 *
	 * @param {string|Array} event
	 * @param {function} callback
	 */
	once(event, callback) {
		this.on(event, callback, true);
	}

}

export default EventEmitter;
