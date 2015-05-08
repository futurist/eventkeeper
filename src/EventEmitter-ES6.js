class EventEmitter {

	/**
	 * Initializes the Event Emitter.
	 */
	constructor() {
		this._events = { };
	}

	/**
	 * Emit an Event to Listeners.
	 *
	 * @param {string} event
	 * @param {*} [data]
	 */
	emit(event, data = null) {
		var listeners = this._events[event];

		if(Array.isArray(listeners) && listeners.length > 0) {
			for(var l = 0; l < listeners.length; l++) {
				listeners[l](data);
			}
		}
	}

	/**
	 * Set callbacks for an event(s).
	 *
	 * @param {string|Array} event
	 * @param {function} callback
	 */
	on(event, callback) {
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

				this._events[event].push(callback);
			}
		}
	}

}
