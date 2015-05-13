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
		var listeners = this._events[event],
			listener = null;

		if(Array.isArray(listeners) && listeners.length > 0) {
			for(var l = 0; l < listeners.length; l++) {
				listener = listeners[l];

				if(listener.once) {
					listeners[l] = null;
				}

				listener.callback(data);
			}

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
