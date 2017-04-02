const isArray = Array.isArray;

class EventEmitter {

    /**
     * Initializes the Event Emitter.
     */
    constructor() {
        this._listeners = {};
        this._middleware = {};
    }

    /**
     * Assign Middleware to an Event, and the Event will only fire if the Middleware allows it.
     *
     * @param {string|Array} evnt
     * @param {function} func
     */
    middleware(evnt, func) {
        if (isArray(evnt)) {
            evnt.forEach(e => this.middleware(e, func));
        } else {
            if (!isArray(this._middleware[evnt])) {
                this._middleware[evnt] = [];
            }

            this._middleware[evnt].push(func);
        }
    }

    /**
     * Removes all Listeners for an Event and, optionally, all Middleware for the Event.
     *
     * @param {string|Array|null} [evnt]
     * @param {boolean} [middleware]
     */
    removeListeners(evnt = null, middleware = false) {
        if (evnt !== null) {
            if (isArray(evnt)) {
                evnt.forEach(e => this.removeListeners(e, middleware));
            } else {
                delete this._listeners[evnt];

                if (middleware) {
                    this.removeMiddleware(evnt);
                }
            }
        } else {
            this._listeners = {};
        }
    }

    /**
     * Removes all Middleware from an Event.
     *
     * @param {string|Array|null} [evnt]
     */
    removeMiddleware(evnt = null) {
        if (evnt !== null) {
            if (isArray(evnt)) {
                evnt.forEach(e => this.removeMiddleware(e));
            } else {
                delete this._middleware[evnt];
            }
        } else {
            this._middleware = {};
        }
    }

    /**
     * Emit an Event to Listeners.
     *
     * @param {string} evnt
     * @param {*} [data]
     * @param {boolean} [silent]
     */
    emit(evnt, data = null, silent = false) {
        evnt = evnt.toString();

        let listeners = this._listeners[evnt];
        let middleware = null;
        let doneCount = 0;
        let execute = silent;

        if (isArray(listeners)) {
            listeners.forEach((listener, index) => {
                // Start Middleware checks unless we're doing a silent emit
                if (!silent) {
                    middleware = this._middleware[evnt];

                    // Check and execute Middleware
                    if (isArray(middleware)) {
                        middleware.forEach(m => {
                            m(data, (newData = null) => {
                                if (newData !== null) {
                                    data = newData;
                                }

                                doneCount++;
                            }, evnt);
                        });

                        if (doneCount >= middleware.length) {
                            execute = true;
                        }
                    } else {
                        execute = true;
                    }
                }

                // If Middleware checks have been passed, execute
                if (execute) {
                    if (listener.once) {
                        listeners[index] = null;
                    }

                    listener.callback(data);
                }
            });

            // Dirty way of removing used Events
            while (listeners.indexOf(null) !== -1) {
                listeners.splice(listeners.indexOf(null), 1);
            }
        }
    }

    /**
     * Set callbacks for an event(s).
     *
     * @param {string|Array} evnt
     * @param {function} callback
     * @param {boolean} [once]
     */
    on(evnt, callback, once = false) {
        if (isArray(evnt)) {
            evnt.forEach(e => this.on(e, callback));
        } else {
            evnt = evnt.toString();
            const split = evnt.split(/,|, | /);

            if (split.length > 1) {
                split.forEach(e => this.on(e, callback));
            } else {
                if (!isArray(this._listeners[evnt])) {
                    this._listeners[evnt] = [];
                }

                this._listeners[evnt].push({
                    once: once,
                    callback: callback,
                });
            }
        }
    }

    /**
     * Same as "on", but will only be executed once.
     *
     * @param {string|Array} evnt
     * @param {function} callback
     */
    once(evnt, callback) {
        this.on(evnt, callback, true);
    }

    /**
     * Returns whether the Emitter has any Listeners.
     *
     * @returns {boolean}
     */
    hasListeners() {
        return Object.keys(this._listeners).length > 0;
    }

    /**
     * Returns whether the Emitter has any Listeners for the given Event.
     *
     * @param {string} evnt
     *
     * @returns {boolean}
     */
    has(evnt) {
        return isArray(this._listeners[evnt]) && this._listeners[evnt].length;
    }

}

export default EventEmitter;
