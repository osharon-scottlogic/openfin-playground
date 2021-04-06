/* Polyfill EventEmitter. */
class EventEmitter {
	events:{[key:string]:Function[]} = {};

	on(event:string, listener:Function) { return this.addListener(event, listener); }
	
	addListener (event:string, listener:Function) {
		if (typeof this.events[event] !== 'object') {
				this.events[event] = [];
		}
	
		this.events[event].push(listener);
	};
	
	removeListener (event:string, listener:Function) {
		var idx;
	
		if (typeof this.events[event] === 'object') {
				idx = this.events[event].indexOf(listener);
	
				if (idx > -1) {
						this.events[event].splice(idx, 1);
				}
		}
	};
	
	emit (event:string, ...args:any[]) {
		let i, listeners, length;
	
		if (typeof this.events[event] === 'object') {
				listeners = this.events[event].slice();
				length = listeners.length;
	
				for (i = 0; i < length; i++) {
						listeners[i].apply(this, args);
				}
		}
	};
	
	once (event:string, listener:Function) {
		this.on(event, (g:Function) => {
				this.removeListener(event, g);
				listener.apply(this, arguments);
		});
	};
}

export { EventEmitter };