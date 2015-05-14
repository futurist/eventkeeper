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
	 * @param {string} event
	 * @param {function} next
	 */
	middleware(event, func) {
		if(!Array.isArray(this._middleware[event])) {
			this._middleware[event] = [ ];
		}

		this._middleware[event].push(func);
	}

	/**
	 * Emit an Event to Listeners.
	 *
	 * @param {string} event
	 * @param {*} [data]
	 */
	emit(event, data = null) {
		var listeners = this._events[event],
			listener = null,
			middleware = null,
			doneCount = 0,
			execute = false;

		if(Array.isArray(listeners) && listeners.length > 0) {
			for(var l = 0; l < listeners.length; l++) {
				listener = listeners[l];
				middleware = this._middleware[event];

				/* Check and execute Middleware */
				if(Array.isArray(middleware) && middleware.length > 0) {
					for(var m = 0; m < middleware.length; m++) {
						middleware[m](data, () => {
							doneCount++;
						});
					}

					if(doneCount >= middleware.length) {
						execute = true;
					}
				}else{
					execute = true;
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
