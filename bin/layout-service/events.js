/* Polyfill EventEmitter. */
class EventEmitter {
    constructor() {
        this.events = {};
    }
    on(event, listener) { return this.addListener(event, listener); }
    addListener(event, listener) {
        if (typeof this.events[event] !== 'object') {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    ;
    removeListener(event, listener) {
        var idx;
        if (typeof this.events[event] === 'object') {
            idx = this.events[event].indexOf(listener);
            if (idx > -1) {
                this.events[event].splice(idx, 1);
            }
        }
    }
    ;
    emit(event, ...args) {
        let i, listeners, length;
        if (typeof this.events[event] === 'object') {
            listeners = this.events[event].slice();
            length = listeners.length;
            for (i = 0; i < length; i++) {
                listeners[i].apply(this, args);
            }
        }
    }
    ;
    once(event, listener) {
        this.on(event, (g) => {
            this.removeListener(event, g);
            listener.apply(this, arguments);
        });
    }
    ;
}
export { EventEmitter };
