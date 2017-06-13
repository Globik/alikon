'use strict';

// see https://github.com/nodejs/node/blob/master/lib/module.js
// and https://github.com/nodejs/node/blob/master/lib/internal/module.js
const Module = module.constructor;
const debug=require('debug')('inv');
const boundCachedSym = Symbol();
const invalidateCallbacksSym = Symbol();
const validateCallbacksSym = Symbol();
const invalid = Symbol();

debug('see https://tc39.github.io/ecma262/#sec-toprimitive')
function toPrimitive(value) {

	var valueToPrimitive = value[Symbol.toPrimitive];
	if ( valueToPrimitive !== undefined )
		return valueToPrimitive;
	
	return function(hint) {
		
		if ( hint === 'number' )
			return Number(value);
		if ( hint === 'string' )
			return String(value);

		if ( typeof(value) !== 'object' && typeof(value) !== 'function' || value === null )
			return value;
			
		var val = value.valueOf();
		if ( typeof(val) !== 'object' && typeof(val) !== 'function' || val === null )
			return val;
		
		return String(value);
	}
}

function hasInstance(ctor) {
	
	return function(instance) {
		
		return instance instanceof ctor;	
	}
}

function bindSetProto(fct, value) {

	function bound() {
		
		return fct.apply(value, arguments);
	}
	Object.setPrototypeOf(bound, fct); // see test "exports property on function"
	delete bound.name; // preserves the original function name
	return bound;
}


Module.invalidate = function() {
	console.log('HALI HALO 58 INVALIDATE()')
	for ( var filename in Module._cache )
		Module._cache[filename].invalidate();
}

Module.invalidateByExports = function(exports) {
	console.log('ENTERING IN INVALIDATEBYEXPORTS')
	for ( var filename in Module._cache )
		console.log('ENTERING IN MODULE._CACHE')
		console.log('Module._cache[filename].exports: 67',Module._cache[filename].exports.valueOf())
		console.log('EXPORTS:  68',exports.valueOf())
		console.log('typeof exports 69: ',typeof exports)
		console.log('typof Module._cache: 70',typeof Module._cache[filename].exports)
		console.log('getownproprtiessymbols():71: ',Object.getOwnPropertySymbols(Module._cache[filename].exports))
		console.log('GET_OWN_PROPERTY_SYMBOLS()72: ',Object.getOwnPropertySymbols(exports))
		console.log('OBJECT: ',Object.getOwnPropertyNames(exports))
		console.log('OBJECT_2: ',Object.getOwnPropertyNames(Module._cache[filename].exports))
		for(var i in exports){console.log('bi:',i)
							 console.log('bi: ', exports[i])
										 }
	for(var k in Module._cache[filename].exports){
		console.log('k 70: ',k)
	console.log('k 71 : ', Module._cache[filename].exports[k])
	}
	console.log('IS_EQAL? : ', (Module._cache[filename].exports===exports))
		//if ( Module._cache[filename].exports === exports ){
			//console.log('YES 68 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
			Module._cache[filename].invalidate();
		//}else{console.log('NOOOOOOOOOOOOOOOOOOOOOOO 73')}
}

Module.prototype.invalidateByPath = function(path) {
	
	Module._cache[Module._resolveFilename(path, this, this.parent === null)].invalidate();
}

Module.prototype.invalidate = function() {
console.log('ENTERING INVALIDATE()')
	//if ( !this.invalidable )return;
	
	if ( invalidateCallbacksSym in this ) {
		
		var validateCallbacks = this[validateCallbacksSym] || (this[validateCallbacksSym] = new Set);

		this[invalidateCallbacksSym].forEach(callback => {
			
			var validateCallback = callback(this._exports);
			if ( typeof(validateCallback) === 'function' )
				validateCallbacks.add(validateCallback);
		});
		this[invalidateCallbacksSym].clear();
	}
	console.log('this._exports: 91:', this._exports,' ',invalid)
	this._exports = invalid;
}

Module.prototype.onInvalidate = function(callback) {
	
	var invalidateCallbacks = this[invalidateCallbacksSym] || (this[invalidateCallbacksSym] = new Set);
	return invalidateCallbacks.add(callback).delete.bind(invalidateCallbacks, callback);
}

function reload(mod, R) {
console.log('RELOADING')
console.log(' ****************************************************')
console.log('RRRRRRRRRRRRRRR: ',R)
console.log('**********************************************************')
	mod._exports = {}; // resets _exports
	mod.loaded = false;
	mod.load(mod.filename);
	
	if ( validateCallbacksSym in mod ) {
		
		mod[validateCallbacksSym].forEach(callback => callback(mod._exports) );
		mod[validateCallbacksSym].clear();
	}else{console.log('NO validateCallbackSym')}
}


function createProxy(mod) {
	console.log('we in proxy object invalid: ',invalid)
	//console.log('mod: ',mod);
	//console.log('reload: ',reload)
	return new Proxy(function() {}, {

		getPrototypeOf: function(target) {
			
			mod._exports === invalid && reload(mod,145);
			console.log('llll:122: ',mod._exports);
			return Reflect.getPrototypeOf(mod._exports);
		},
		
		setPrototypeOf: function(target, prototype) {
			
			mod._exports === invalid && reload(mod,159);
			return Reflect.setPrototypeOf(mod._exports, prototype);
		},
		
		isExtensible: function(target) {
			
			mod._exports === invalid && reload(mod,158);
			return Reflect.isExtensible(mod._exports);
		},
		
		preventExtensions: function(target) {
			
			mod._exports === invalid && reload(mod,164);
			return Reflect.preventExtensions(mod._exports);
		},
		
		getOwnPropertyDescriptor: function(target, prop) {
			
			mod._exports === invalid && reload(mod,170);

			if ( prop === 'prototype' && typeof(mod._exports) !== 'function' ) // see ownKeys
				return {};
			return Reflect.getOwnPropertyDescriptor(mod._exports, prop);
		},
		
		defineProperty: function(target, property, descriptor) {
			
			mod._exports === invalid && reload(mod,179);
			return Reflect.defineProperty(mod._exports, property, descriptor);
		},
		
		has: function(target, prop) {
			console.log('184 HAAAAAAAAAAAAAASSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS!!!!!!!!!!!!!!!')
			mod._exports === invalid && reload(mod,185);
			return Reflect.has(mod._exports, prop);
		},
		
		get: function(target, property) {
			console.log('190',mod._exports)
			mod._exports === invalid && reload(mod,191);
			console.log('property 189 :',property)
			if ( property === Symbol.hasInstance )
				return hasInstance(mod._exports);
			if ( property === Symbol.toPrimitive )
				return toPrimitive(mod._exports);
			
			// see http://stackoverflow.com/questions/42496414/illegal-invocation-error-using-es6-proxy-and-node-js
			// see https://github.com/nodejs/node/issues/11629 (Illegal invocation error using ES6 Proxy and node.js)
			// see http://stackoverflow.com/questions/42594682/how-to-determine-that-a-javascript-function-is-native-without-testing-native
			// see V8 issue https://bugs.chromium.org/p/v8/issues/detail?id=5773
	
			var val = Reflect.get(mod._exports, property);

			if ( typeof(val) === 'function' && !('prototype' in val) ) { // native function has prototype === undefined

				// needed for native function, like Promise.resolve().then, ...

				return boundCachedSym in val ? val[boundCachedSym] : val[boundCachedSym] = bindSetProto(val, mod._exports);
			}
console.log('211: VVVVVVVVVVVVVVVVVVVVVVVVVVVVVAALL: ',val)
			return val;
		},
		
		set: function(target, property, value) {
			
			mod._exports === invalid && reload(mod,217);
			return Reflect.set(mod._exports, property, value);
		},
		
		deleteProperty: function(target, property) {
			
			mod._exports === invalid && reload(mod,223);
			return Reflect.deleteProperty(mod._exports, property);
		},
		
		ownKeys: function(target) {
			
			mod._exports === invalid && reload(mod,229);
			var ownKeys = Reflect.ownKeys(mod._exports);
			// see https://tc39.github.io/ecma262/#sec-invariants-of-the-essential-internal-methods
			if ( typeof mod._exports !== 'function' )
				ownKeys.push('prototype');
			return ownKeys;
		},
		
		apply: function(target, thisArg, argumentsList) {
			
			mod._exports === invalid && reload(mod, 239);
			return Reflect.apply(mod._exports, thisArg, argumentsList);
		},
		
		construct: function(target, argumentsList, newTarget) {
			
			mod._exports === invalid && reload(mod, 244);
			return Reflect.construct(mod._exports, argumentsList);
		}
	});
}
//this._proxy=createProxy(this);
/*Object.defineProperty(Module.prototype, 'invalidable', {
	get: function() {
		//return this.proxy;
		return !!this._proxy;
	},
	set: function(value) {
		
		if ( this._proxy ) {
			
			if ( !value )
				//this._proxy = null;
				this._proxy=createProxy(this)
		} else {
			
			if ( value )
				console.log('VALUE 2: ',value)
				this._proxy = createProxy(this);
		}
	}
});
*/

Object.defineProperty(Module.prototype, 'exports', {
	get: function() {
console.log('in exports prop: this._proxy: ', this._proxy)
console.log('in exports prop: this._exports: ',this._exports)
return this._proxy=createProxy(this);
		//return this._proxy ? this._proxy : this._exports;
	},
	set: function(value) {
console.log('VALUE: ',value)
		this._exports = value;
	}
});

Module.prototype.unload = function() {

	var exports = this._exports;
	this.invalidate();
	this._exports = exports;
	this.invalidable = false;

	delete Module._cache[this.filename];
	
	// remove this module from all module children
	for ( var filename in Module._cache ) {
		 
		var children = Module._cache[filename].children;
		var pos = children.indexOf(this);
		if ( pos !== -1 )
			children.splice(pos);
	}

	this.parent = null;

	this.children.length = 0;
	
	// remove module from Module._pathCache
	var pathCache = Module._pathCache;
	var keys = Object.keys(pathCache);
	for ( var i = 0; i < keys.length; ++i )
		if ( pathCache[keys[i]] === this.filename )
			delete pathCache[keys[i]];
}

Module.prototype.unloadByPath = function(path) {

	Module._cache[Module._resolveFilename(path, this, this.parent === null)].unload();
}

Module.unloadByExports = function(exports) {
	
	for ( var filename in Module._cache )
		if ( Module._cache[filename].exports === exports )
			Module._cache[filename].unload();
}