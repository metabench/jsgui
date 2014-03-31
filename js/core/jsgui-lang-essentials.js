

   /**
    * lang essentials module.
    * @module core/jsgui-lang-essentials
    * @version 0.4.4
    */

/* Changelog:
	
	0.4.4
	-----
	Removed excess comments, inlcuding unused commented-out code

	0.4.3
	-----
	Added comment about changing arr_like_to_arr

	0.4.2
	-----

	Performance improvements, based on profiling
	isArray uses Array.isArray if available


*/


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

if (typeof window === 'undefined') {
    //exports.foo = {};
    var Stream = require('stream');
} else {
    //window.foo = {};
}


// needs to use node.js's stream for the moment.
// Will make a new jsgui-node-lang-essentials version because it's got node-specific & dependant code now.

//define(['Stream'], 
//function (Stream) {


define(function() {

    // ========================================================
    //                      Class
    // ========================================================

    // seems based on http://ejohn.org/blog/simple-javascript-inheritance/

    /**
    * Base class like John Resig's "Simple JavaScript Inheritance" tehnique. 
    *
    * In addition, when the inherited class contains a property that name starts from '#',
    * then the property adds to the class without '#', and the property value is the base class property value, 
    * but the base class property name used is the rest of the initial property name (after the '#').
    * @see [John Resig's "Simple JavaScript Inheritance"]{@link http://ejohn.org/blog/simple-javascript-inheritance/}
    * @name Class
    * @member
    * @memberof module:core/jsgui-lang-essentials
    */


	var initializing = false, fnTest = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;
	var Class = function() {
	};
	
	// not so sure of the utility of namespcExtension, propsToMerge
	Class.extend = function(prop) {
		var _super = this.prototype;
		initializing = true;
		var prototype = new this();
		initializing = false;
		for (var name in prop) {
			if (name.charAt(0) === '#') {
				prototype[name.substring(1)] = prototype[prop[name]];
			} else {
				prototype[name] = typeof prop[name] === 'function'
						&& typeof _super[name] === 'function'
						&& fnTest.test(prop[name]) ?
				// had some difficulty using fp() with 'init' functions. could
				// it have to do with function names?

				(function(name, fn) {
					return function() {
						var tmp = this._super;
						this._super = _super[name];
						var res = fn.apply(this, arguments);
						this._super = tmp;
						return res;
					};
				})(name, prop[name]) : prop[name];
			};
		};
		function Class() {
			//console.log('initializing ' + initializing);
			//console.log('!!this.init ' + !!this.init);
			if (!initializing && this.init) {
				this.init.apply(this, arguments);
				//if (this.post_init) {
				//	this.post_init();
				//}
			}
		};
		Class.prototype = prototype;
		Class.prototype.constructor = Class;
		//Class.constructor = Class;
		Class.extend = arguments.callee;
		//Class._superclass = _super;
		
		Class._superclass = this;
		
		return Class;
	};


    // ========================================================
    //                      functions
    // ========================================================
	


    /**
    * Break iteration callback function.
    * @example
    * jsgui.each([1, 2, 3, 4, 5], function(index, element, stop){
    *    if (element > 3) stop();
    * });
    *
    * jsgui.eac([1, 2, 3, 4, 5], function(element, index, stop){
    *    if (element > 3) stop();
    * });
    *
    * @callback module:core/jsgui-lang-essentials.stopIterationCallback
    */

    /**
    * Array iterator callback function.
    *
    * @callback module:core/jsgui-lang-essentials.arrayIteratorCallback
    * @param {number} index
    * @param {*} element
    * @param {module:core/jsgui-lang-essentials.stopIterationCallback} stop
    */

    /**
    * Object iterator callback function.
    *
    * @callback module:core/jsgui-lang-essentials.objectIteratorCallback
    * @param {string} key
    * @param {*} value
    * @param {module:core/jsgui-lang-essentials.stopIterationCallback} stop
    */

    /**
    * Iterates over a collection of elements. Each element is passed to an iterator function. 
    * The iterator function is bound to the context object, if passed.
    * The collection parameter can be:
    * - a Collection object (the Collection.each() method is used in this case)
    * - an array (iterate over array elements)
    * - an object (iterate over object properties)
    *
    * The iteration function parameters are:
    * - index, element, stopFunction (for array)
    * - key, value, stopFunction (for object)
    *
    * The stopFunction breaks the iteration if called.
    *
    * @func
    * @param {Collection|Array|Object} collection - collection of elements
    * @param {module:core/jsgui-lang-essentials.arrayIteratorCallback|module:core/jsgui-lang-essentials.objectIteratorCallback} fn - iterator function
    * @param {Object} [context] - context object
    * @memberof module:core/jsgui-lang-essentials
    * @example
    * jsgui.each([1, 2, 3, 4, 5], function(index, element, stop){
    *    console.log(index + ":" + element);
    * });
    */
	// new addition with the loop being stoppable using a function call. 18/06/2012
	var each = function(collection, fn, context) {
		// each that puts the results in an array or dict.
		if (collection) {

			if (collection.__type == 'collection') {
				return collection.each(fn, context);
			}

			// could have a break function that stops the loop from continuing.
			//  that would be useful as a third parameter that can get called.
			//  stop() function
			var ctu = true;
			var stop = function() {
				ctu = false;
			}
			
			if (is_array(collection)) {
				var res = [], res_item;
				for (var c = 0, l = collection.length; c < l; c++) {
					res_item;
					if (ctu == false) break;
					
					if (context) {
						res_item = fn.call(context, c, collection[c], stop);
						
					} else {
						res_item = fn(c, collection[c], stop);
					}
					res.push(res_item);
				}
				return res;
			} else {
				var name, res = {};
				for (name in collection) {
					if (ctu == false) break;
					if (context) {
						res[name] = fn.call(context, name, collection[name], stop);
					} else {
						res[name] = fn(name, collection[name]);
					}
				}
				return res;
			}
		}

	};

    /**
    * Array iterator callback function.
    *
    * @callback module:core/jsgui-lang-essentials.arrayIteratorCallback-eac
    * @param {number} index
    * @param {*} element
    * @param {module:core/jsgui-lang-essentials.stopIterationCallback} stop
    */

    /**
    * Object iterator callback function.
    *
    * @callback module:core/jsgui-lang-essentials.objectIteratorCallback-eac
    * @param {string} key
    * @param {*} value
    * @param {module:core/jsgui-lang-essentials.stopIterationCallback} stop
    */

    /**
    * Iterates over a collection of elements, just like the [each()]{@link module:core/jsgui-lang-essentials.each} function, but the iterator function parameters order is changed.
    *
    * Better each function, first param of callback is obj, 2nd is index. Will replace all each functions with this version then change the name to each.
	*  Useful for new code.
    *
    * The iteration function parameters are:
    * - element, index, stopFunction (for array)
    * - value, key, stopFunction (for object)
    *
    * @func
    * @param {Collection|Array|Object} collection - collection of elements
    * @param {module:core/jsgui-lang-essentials.arrayIteratorCallback-eac|module:core/jsgui-lang-essentials.objectIteratorCallback-eac} fn - iterator function
    * @param {Object} [context] - context object
    * @memberof module:core/jsgui-lang-essentials
    * @example
    * jsgui.eac([1, 2, 3, 4, 5], function(element, index, stop){
    *    console.log(index + ":" + element);
    * });
    */
	var eac = function(collection, fn, context) {
		// each that puts the results in an array or dict.
		if (collection) {

			if (collection.__type == 'collection') {
				return collection.each(fn, context);
			}

			// could have a break function that stops the loop from continuing.
			//  that would be useful as a third parameter that can get called.
			//  stop() function
			var ctu = true;
			var stop = function() {
				ctu = false;
			}
			
			if (is_array(collection)) {
				var res = [], res_item;
				for (var c = 0, l = collection.length; c < l; c++) {
					res_item;
					if (ctu == false) break;
					
					if (context) {
						res_item = fn.call(context, collection[c], c, stop);
						
					} else {
						res_item = fn(collection[c], c, stop);
					}
					res.push(res_item);
				}
				return res;
			} else {
				var name, res = {};
				for (name in collection) {
					if (ctu == false) break;
					if (context) {
						res[name] = fn.call(context, collection[name], name, stop);
					} else {
						res[name] = fn(collection[name], name, stop);
					}
				}
				return res;
			}
		}
	};



	var jq_class2type = {};
	var jq_type = function(obj) {
		return obj == null ? String(obj) : jq_class2type[toString.call(obj)]
				|| "object";
	};



    /**
    * Returns `true` if the passed `obj` is an `Array`. Delegates to the native `Array.isArray()` function if it exists.
    * @func
    * @param {Object} obj - object to check
    * @memberof module:core/jsgui-lang-essentials
    */
	var is_array = Array.isArray || function(obj) {
		return jq_type(obj) === "array";
	};
    
    /**
    * Returns `true` if the passed `obj` is a DOM node. Uses the duck typing.
    * @func
    * @param {Object} obj - object to check
    * @memberof module:core/jsgui-lang-essentials
    */
    var is_dom_node = function isDomNode(obj) {
		return (!!obj && typeof obj.nodeType != 'undefined' && typeof obj.childNodes != 'undefined');
	};

	each("Boolean Number String Function Array Date RegExp Object".split(" "),
		function(i, name) {
			if (typeof(name) == 'string') {
		        jq_class2type["[object " + name + "]"] = name.toLowerCase();
		    }
		});

	/*
	 * var jq_type = function( obj ) { return obj == null ? String(obj):
	 * jq_class2type[toString.call(obj)] || "object"; };
	 */

	var jq_isFunction = function(obj) {
		return jq_type(obj) === "function";
	};

	var jq_isWindow = function(obj) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	};

	var hasOwn = Object.prototype.hasOwnProperty;

	var jq_isPlainObject = function(obj) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor
		// property.
		// Make sure that DOM nodes and window objects don't pass through, as
		// well
		if (!obj || jq_type(obj) !== "object" || obj.nodeType
				|| jq_isWindow(obj)) {
			return false;
		}

		// Not own constructor property must be Object
		if (obj.constructor && !hasOwn.call(obj, "constructor")
				&& !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
			return false;
		}
		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for (key in obj) {
		}

		return key === undefined || hasOwn.call(obj, key);
	};

	// jQuery Extend

    /**
    * Merge the contents of two or more objects together into the first object. Returns the updated object.
    * If only one parameter is passed, the extends `this`.
    * @func
    * @param {boolean} [deep] - if true, performs recursive deep copy. if false or omitted, performs simple reference copy.
    * @param {(object|array)} [target] - target object; if omitted then `this` is used.
    * @param {...(object|array)} extender - object(s) to add the content
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *   jq_extend({a:1}, {b:2})  ==> {a:1, b:2}
    *   jq_extend([1,2,3], [4,5])  ==> [4,5,3]  
    *
    *   var ext = {sub2:{prop2:2}};
    *   var result1 = jq_extend(true, {}, ext)  ==> {sub2:{prop2:2}}
    *   var result2 = jq_extend(false, {}, ext)  ==> {sub2:{prop2:2}}
    *   ext.sub2.prop2 = 20;  ==> (result1.sub2.prop2 == 2) & (result2.sub2.prop2 == 20)
    */
	var jq_extend = function() {
		var options, name, src, copy, copyis_array, clone, target = arguments[0]
				|| {}, i = 1, length = arguments.length, deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}
		// Handle case when target is a string or something (possible in deep
		// copy)
		if (typeof target !== "object" && !jq_isFunction(target)) {
			target = {};
		}

		// (extend (jQuery) itself if only one argument is passed) no longer in
		// jQuery
		if (length === i) {
			target = this;
			--i;
		}

		for (; i < length; i++) {
			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {
				// Extend the base object

				// nope... need to go through all items in the array if its an
				// array, copying undefined as needed.

				if (is_array(options)) {

					// could maybe use each here anyway.
					// but a direct function may be faster.

					for ( var name = 0, l = options.length; name < l; name++) {
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if (deep
								&& copy
								&& (jq_isPlainObject(copy) || (copyis_array = is_array(copy)))) {
							if (copyis_array) {
								copyis_array = false;
								clone = src && is_array(src) ? src : [];
							} else {
								clone = src && jq_isPlainObject(src) ? src : {};
							}
							// Never move original objects, clone them
							target[name] = jq_extend(deep, clone, copy);
							// Don't bring in undefined values???
						} // else if ( copy !== undefined ) {
						else {
							target[name] = copy;
						}
					}

				} else {
					for (name in options) {

						// console.log('name ' + name);

						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if (deep
								&& copy
								&& (jq_isPlainObject(copy) || (copyis_array = is_array(copy)))) {
							if (copyis_array) {
								copyis_array = false;
								clone = src && is_array(src) ? src : [];
							} else {
								clone = src && jq_isPlainObject(src) ? src : {};
							}
							// Never move original objects, clone them
							target[name] = jq_extend(deep, clone, copy);
							// Don't bring in undefined values
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}

			}
			// console.log('arguments[i] ' + stringify(arguments[i]));
			// console.log('options ' + stringify(options));
		}
		// Return the modified object
		// console.log('target ' + stringify(target));
		return target;
	};
    
    /**
    * Alias to the [jq_extend()]{@link module:core/jsgui-lang-essentials.jq_extend} function.
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
    var extend = jq_extend;
	
	/*
	var x_clones = function(obj, x) {
		
	};
	*/
	
    /**
    * Returns a truth map created from the given array.
    *
    * The truth map is an object containing key/value pairs; the keys are the array elements, the values are all true.
    * @example get_truth_map_from_arr(["a", "b", "c"]) ==> { a: true, b: true, c: true}
    * @func
    * @param {Array} arr - source array
    * @memberof module:core/jsgui-lang-essentials
    */
	var get_truth_map_from_arr = function(arr) {
		var res = {};
		each(arr, function(i, v) {
			res[v] = true;
		});
		return res;
	};

    /**
    * Returns a map created from the given array.
    *
    * The map is an object containing key/value pairs; the keys are the array elements, the values are the array indexes.
    * @example get_map_from_arr(["a", "b", "c"]) ==> { a: 0, b: 1, c: 2}
    * @func
    * @param {Array} arr - source array
    * @memberof module:core/jsgui-lang-essentials
    */
	// not a truth map because 0 == false. Could use this but do different
	// check, like is_defined.
	var get_map_from_arr = function(arr) {
		var res = {};
		for (var c = 0, l = arr.length; c < l; c++) {
			res[arr[c]] = c;
		}
		//each(arr, function(i, v) {
		//	res[v] = i;
		//});
		return res;
	}

	//var arrSliceCall = Array.prototype.slice.call;

    /**
    * Returns an array created from the given "array-like" object (e.g. `arguments`).
    * @func
    * @param {Object|Array} arr_like - the array-like object
    * @example
    * function example(){
    *    var arguments_array = arr_like_to_arr(arguments);
    *    console.log(arguments_array);
    * }
    * @memberof module:core/jsgui-lang-essentials
    */
	var arr_like_to_arr = function(arr_like) {
		// like an arguments list
		// is this working in Safari?

		//var res = [];
		//return arrSliceCall(arr_like, 0);


		//return Array.prototype.slice(arr_like);
		// May have better way of doing this.



		var res = new Array(arr_like.length);


		// This was not working in Safari! Worked in Chrome. Probably
		// (mis?)recognised it as an object.
		// each(arr_like, function(i, v) {
		// res.push(v);
		// });

		for (var c = 0, l = arr_like.length; c < l; c++) {
			//res.push(arr_like[c]);
			res[c] = arr_like[c];
		};
		return res;
	};

	/*
	 * var is_ctrl = function(obj) { return (typeof obj != 'undefined' && obj !=
	 * null && typeof obj.$render != 'undefined'); };
	 */

	// Could do better... could check actual instanceof
	//  But a more advanced jsgui level could do this check, and have its own tof function.
	//  That would be jsgui-lang-html has the check for is control.

    /**
    * <mark>description...</mark>
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
	var is_ctrl = function(obj) {
		return (typeof obj != 'undefined' && obj != null && is_defined(obj._) && is_defined(obj.__type_name));
	};


    // Also a bit of node.js specific code.
    //  May make node version of jsgui-lang-essentials, jsgui-node-lang-essentials.
    
    /**
    * Returns the type of the given object as a string. If the t1 parameter is passed, then returns t1 for all the t1 values excepting 'object' one.
    * Possible results are:
    * - "number"
    * - "string"
    * - "function"
    * - "boolean"
    * - "object"
    * - "undefined"
    * - "null"
    * - <mark>obj.__type</mark>
    * - "array"
    * - "control"
    * - "regex" (obj instanceof RegExp)
    * - "buffer" (obj instanceof Buffer)
    * - "readable_stream" (obj instanceof Stream.Readable)
    * - "writable_stream" (obj instanceof Stream.Writable)
    * @func
    * @param {*} obj - object to inspect type
    * @param {string} [t1] - type to return (?)
    * @memberof module:core/jsgui-lang-essentials
    * @example
    * tof(1) ==> "number"
    * tof([]) ==> "array"
    * tof(1, "myType") ==> "myType"
    * tof(1, "object") ==> "object"
    * tof([], "object") ==> "array"
    */
	// may change to the jq_type code.
	var tof = function(obj, t1) {
		var res = t1 || typeof obj;

		if (res == 'number' || res == 'string' || res == 'function' || res == 'boolean') {
		    return res;
		}


		if (res == 'object') {

			if (typeof obj != 'undefined') {
				
				if (obj === null) {
					return 'null';
				}


				
				//console.log('typeof obj ' + typeof obj);
				//console.log('obj === null ' + (obj === null));
				
				if (obj.__type) {
					return obj.__type;
				} else {

					// Inline array test, earlier on?

					if (obj instanceof Date) {
						return 'date';
					}


					if (is_array(obj)) {
				        //res = 'array';
				        //return res;
				        return 'array';
				    } else if (is_ctrl(obj)) {
				    	//throw 'control stop';
				    	//if (is_defined(obj.__type)) {
						//	return obj.__type;
						//}

				        //res = 'control';
				        //return res;
				        return 'control';
				    } else {
				        
				        if (obj instanceof RegExp) res = 'regex';

				        // For running inside Node.
				        //console.log('twin ' + typeof window);
				        if (typeof window === 'undefined') {
				        	//console.log('obj.length ' + obj.length);
				        	if (obj instanceof Buffer) res = 'buffer';

							if (obj instanceof Stream.Readable) res = 'readable_stream';
							if (obj instanceof Stream.Writable) res = 'writable_stream';
				        }
				        

				    }
				    //console.log('res ' + res);
					return res;
					
				}
			} else {
				return 'undefined';
			}
		    
		}

		return res;
	};
	
	// Bug for a test case - checking if a function is an instanceOf stream.
	
    /**
    * Returns an array containing type strings for the passed array elements. The type strings are made using the [tof()]{@link module:core/jsgui-lang-essentials.tof} function.
    * @func
    * @param {Array} arr - source array
    * @memberof module:core/jsgui-lang-essentials
    * @example
    * atof([1, "", null]) ==> ["number", "string", "null"]
    */
	var atof = function(arr) {

		var res = new Array(arr.length);
		//each(arr, function(i, v) {
		//	res.push(tof(v));
		//});
		for (var c = 0, l = arr.length; c < l; c++) {
			//res.push(tof(arr[c]));
			res[c] = tof(arr[c]);
		}
	
		return res;
	};

    /**
    * Returns true if the value is defined (e.g. not equals to undefined)
    * @func
    * @param {*} value - value to check
    * @memberof module:core/jsgui-lang-essentials
    * @example
    * is_defined(Math.PI) ==> true
    * is_defined(Math.PI_PI_PI) ==> false
    */
	var is_defined = function(value) {
		// tof or typeof

		return typeof (value) != 'undefined';
	}, isdef = is_defined;

	var is_data_object = function(obj) {
		
		if(obj) {
			if (obj.__type == 'data_object') return true;
			if (obj.__type == 'collection') return true;
		}
		
		//this.__type = 'collection'
		
		return false;
		
	}
	
	// will test for control using similar means as well.
	
	var is_collection = function(obj) {
		//if (obj.__type == 'data_object') return true;
		
		if (obj) {
			if (obj.__type == 'collection') return true;
		}
		
		
		//this.__type = 'collection'
		
		return false;
		
	}

    /**
    * Outputting a string in a convenient format - currently JSON.
    * @func
    * @param {*} obj - value to convert
    * @param {bool} [includeFunctions] - if true, then include functions to the result
    * @param {array(string)} [excludingProps] - exclude the listed object properties from the result
    * @memberof module:core/jsgui-lang-essentials
    * @example
    * stringify(1) ==> '1'
    * stringify("1") ==> '"1"'
    * stringify([1, "a", null]) ==> '[1, "a", null]'
    * stringify({p1:1, p2:"a", p3:null}) ==> '{"p1": 1, "p2": "a", "p3": null}'
    */
	var stringify = function(obj, includeFunctions, excludingProps) {
	
		var _stringify = function(obj, includeFunctions, callerObjItem) {
		
			//_stringify(a, b, { prev: callerObjItem, obj: obj });
		
			var isCircularReference = function(obj, callerObjItem){
				while(callerObjItem){
					if (callerObjItem.obj === obj) return true;
					callerObjItem = callerObjItem.prev;
				}
				return false;
			};
			
			if (isCircularReference(obj, callerObjItem)) return "(CircularRef)";
		
			// Likely optimization: use array to build the string, then join it for
			// the result.
			// Now updated.
			// Could probably use polymorphism here and save space

			// Designed for stringifying specs including functions in mind.
			
			// Could use tof as well... I think that would make a lot of sense.
			
			var t = typeof obj, res = [];
			
			// to stringify a collection?
			
			if (obj === String) {
				return 'JS_String';
			}
			
			if (t == 'object') {
				// will be testing it to see if it is a Data_Object
				//  and then if it is a Collection
				
				
				if (obj && is_defined(obj.stringify)) {
					return obj.stringify();
				} else {
					
					var ia = is_array(obj);
					if (ia) {
						// res = res + '[';
						res.push('[');
						var first = true;
						for ( var c = 0; c < obj.length; c++) {
							// if (!first) res = res + ', ';
							if (!first)
								res.push(', ');
							// res = res + stringify(obj[c]);
							//res.push(_stringify(obj[c], undefined, { prev: callerObjItem, obj: obj }));
							res.push(_stringify(obj[c], includeFunctions, { prev: callerObjItem, obj: obj }));
							first = false;
						}
						;
						// res = res + ']';
						res.push(']');
					} else if (obj == null) {
						res = [ 'null' ];
						// don't do this is_control test.
					//} else if (is_ctrl(obj)) {
						// res = res + '{"ctrl": "' + obj.id() + '"}';
					//	res.push('{"ctrl": "' + obj.id() + '"}');
					} else {
						// console.log('obj ' + obj);

						// a way of checking for a non-native toString?
						if (is_defined(obj.toString) && obj.toString.stringify === true) {
							res.push('"' + obj.toString() + '"');
						} else {
							var first = true;
							// res = res + '{';
							res.push('{');
							each(obj, function(i, v) {
								//console.log(tof(v));
								//
								var propIsPrintable = true;
								if (propIsPrintable && !includeFunctions && tof(v) === 'function') propIsPrintable = false;
								if (propIsPrintable && excludingProps && excludingProps.indexOf(i)>=0) propIsPrintable = false;
								//
								/*if (includeFunctions !== false
										&& tof(v) !== 'function') {
									// if (!first) res = res + ', ';
									if (!first)
										res.push(', ');
									// res = res + '"' + i + '": ' +
									// stringify(v);
									res.push('"' + i + '": ' + _stringify(v, undefined, { prev: callerObjItem, obj: obj }));
									first = false;
								}*/
								//
								if (propIsPrintable) {
									if (!first)	res.push(', ');
									//res.push('"' + i + '": ' + _stringify(v, undefined, { prev: callerObjItem, obj: obj }));
									res.push('"' + i + '": ' + _stringify(v, includeFunctions, { prev: callerObjItem, obj: obj }));
									first = false;
								}
							});
							// res = res + '}';
							res.push('}');
						}
					};
					
				}
				
			} else if (t == 'string') {
				// Escape characters in JSON string?
				// res = '"' + obj + '"';
				res.push('"' + obj + '"');
			} else if (t == 'undefined') {
				res = [ 'undefined' ];
			} else if (t == 'function') {
				//if (includeFunctions !== false) {
				if (!!includeFunctions) {
					res = [obj.toString()];
				}
			} else {
				res = [obj.toString()];
			}
			return res.join('');
		}; // var _stringify = 
	
		return _stringify(obj, includeFunctions);
	};

    /* previous version:

	var stringify = function(obj, includeFunctions) {
		// Likely optimization: use array to build the string, then join it for
		// the result.
		// Now updated.
		// Could probably use polymorphism here and save space

		// Designed for stringifying specs including functions in mind.
		
		// Could use tof as well... I think that would make a lot of sense.
		
		var t = typeof obj, res = [];
		
		// to stringify a collection?
		
		if (obj === String) {
			return 'JS_String';
		}
		
		if (t == 'object') {
			// will be testing it to see if it is a Data_Object
			//  and then if it is a Collection
			
			
			if (obj && is_defined(obj.stringify)) {
				return obj.stringify();
			} else {
				
				var ia = is_array(obj);
				if (ia) {
					// res = res + '[';
					res.push('[');
					var first = true;
					for ( var c = 0; c < obj.length; c++) {
						// if (!first) res = res + ', ';
						if (!first)
							res.push(', ');
						// res = res + stringify(obj[c]);
						res.push(stringify(obj[c]));
						first = false;
					}
					;
					// res = res + ']';
					res.push(']');
				} else if (obj == null) {
					res = [ 'null' ];
					// don't do this is_control test.
				//} else if (is_ctrl(obj)) {
					// res = res + '{"ctrl": "' + obj.id() + '"}';
				//	res.push('{"ctrl": "' + obj.id() + '"}');
				} else {
					// console.log('obj ' + obj);

					// a way of checking for a non-native toString?
					if (is_defined(obj.toString) && obj.toString.stringify === true) {
						res.push('"' + obj.toString() + '"');
					} else {
						var first = true;
						// res = res + '{';
						res.push('{');
						each(obj, function(i, v) {
							//console.log(tof(v));
									if (includeFunctions !== false
											&& tof(v) !== 'function') {
										// if (!first) res = res + ', ';
										if (!first)
											res.push(', ');
										// res = res + '"' + i + '": ' +
										// stringify(v);
										res.push('"' + i + '": ' + stringify(v));
										first = false;
									}
								});
						// res = res + '}';
						res.push('}');
					}
				};
				
			}
			
		} else if (t == 'string') {
			// Escape characters in JSON string?
			// res = '"' + obj + '"';
			res.push('"' + obj + '"');
		} else if (t == 'undefined') {
			res = [ 'undefined' ];
		} else if (t == 'function') {

			if (includeFunctions !== false) {
				res = [obj.toString()];
			}
		} else {
			res = [obj.toString()];
		}
		return res.join('');
	};

    */
	
    /**
    * Returns a type signature for the given value. 
    * Possible results are:
    * - "s" (string)
    * - "n" (number)
    * - "b" (boolean)
    * - "f" (function)
    * - "a" (array)
    * - "o" (object)
    * - "u" (undefined)
    * - "!" (null)
    * - "c" (control)
    * - "r" (RegEx)
    * - "B" (Buffer)
    * - "R" (readable_stream)
    * - "W" (writable_stream)
    * - "X" (collection_index)
    * - "D" (data_object)
    * - "~D" (abstract data_object)
    * - "V" (data_value)
    * - "~V" (abstract data_value)
    * - "C" (collection)
    * - "~C" (abstract collection)
    * @func
    * @param {*} i - value to get the type signature
    * @param {*} [arr_depth] - array nesting depth to include the array element signatures
    * @memberof module:core/jsgui-lang-essentials
    * @example
    * get_item_sig(1) ==> 'n'
    * get_item_sig("1") ==> 's'
    * get_item_sig([1, 2]) ==> 'a'
    * get_item_sig([1, 2], 1) ==> '[n,n]'
    */
	var get_item_sig = function(i, arr_depth) {
	
	    // an option about how far into the array to look.
	    
	    
	
		// also want to be able to do polymorphic rearrangements.
		// these will need to be specified so they get rearranged as required.
		// will check for some signatures and rearrange the arguments, and
		// return that array. Will be useful all over the place in the library.

		// v2 = [i, i], v3 = [i, i, i]
		// or even i2 = [i, i]? maybe not for the moment, plenty of
		// simplification already, could maybe express things like that at some
		// stage.
		
		// rearrangement - '[i, i], s' <- 's, [i, i]'
		// if second arrangement, output the items in the order given.
		// that seems to require parsing these signature strings.

		// returns the polymorphic signature.
		// same for each item in the array.

		// will get the poly signature for each item in the array?
		// is it an array?
    
        
		var res;
		var t1 = typeof i;

		// could possibly have two functions - one that will be very fast, and a more dynamic, slower one.



		if (t1 == 'string') {
			res = 's';
		} else if (t1 == 'number') {
			res = 'n';
		} else if (t1 == 'boolean') {
			res = 'b';
		} else if (t1 == 'function') {
			res = 'f';
		} else {
			var t = tof(i, t1);
			
			//if (i === 0) {
				//console.log('i ' + i);
				//console.log('t ' + t);
			//}
				


			//console.log('i ' + i);
			//console.log('t ' + t);
			
			// likely to use a map for this logic instead.
			// console.log('t ' + t);
			if (t == 'array') {
			    
			    // look into it with one nested level...
			    if (arr_depth) {
			        //res = String.fromCharCode(91);
			        res = '['
	                for (var c = 0, l = i.length; c < l; c++) {
	                    if (c > 0) res = res + ',';
	                    res = res + get_item_sig(i[c], arr_depth - 1);
	                }
	                //res = res + String.fromCharCode(93);;
	                res = res + ']';
			    } else {
			        res = 'a';
			    }
			    //console.log('res* ' + res);
				
				// return res;
			//} else if (t == 'string') {
				// is it a string that parses to an integer?
				// parses to a decimal number
				// parses to an rgb value
				// parses to hex value
				// various string regexs used (optionally), can say what we are
				// looking for (for various parameters).
				// may want a quick basic poly.

			//	res = 's';
			//} else if (t == 'boolean') {
			//	res = 'b';
			//} else if (t == 'function') {
			//	res = 'f';
			} else if (t == 'control') {
				res = 'c';
			} else if (t == 'date') {
				res = 'd';
			} else if (t == 'regex') {
				res = 'r';
			} else if (t == 'buffer') { // may remove for non node.js.
				res = 'B';
			//} else if (t == 'stream') { // may remove for non node.js.
			//	res = 'S';

			// Will also incorporate dubplex and transformation streams.

			} else if (t == 'readable_stream') { // may remove for non node.js.
				res = 'R';
			} else if (t == 'writable_stream') { // may remove for non node.js.
				res = 'W';
			//} else if (t == 'number') {
				// is it an integer?
				// is it a decimal?

				// are we checking for those anyway? maybe not by default.

			//	res = 'n';
			} else if (t == 'object') {

				// not sure about showing all the details of the object.

				res = 'o';
			} else if (t == 'undefined') {
				res = 'u';
			} else {
				
				if (t == 'collection_index') {
					return 'X';
				} else if (t == 'data_object') {
					if (i._abstract) {
						res = '~D';
					} else {
						res = 'D';
					}
				
					
				} else {
					if (t == 'data_value') {
						if (i._abstract) {
							res = '~V';
						} else {
							res = 'V';
						}
					
						
					} else if (t == 'null') {
						res = '!';
					} else if (t == 'collection') {
						if (i._abstract) {
							res = '~C';
						} else {
							res = 'C';
						}
						
					} else {


						console.log('t ' + t);
						throw 'Unexpected object type ' + t;
					}
				}
				
				// May have decimal type as well?
				
				// d for the moment?
				//  May want decimal numbers too?
				//  D is better for Data_Object.
				
				// c for Control
				// C for Collection
				
				// Could say Data_Object is D
				// Collection is C?
				
			}
		}
		//console.log('get_item_sig res ' + res);
		return res;
		
	};

	
    /**
    * Removes the leading and trailing square brackets from the signature, if the brackets are presented.
    * @func
    * @param {string} sig - the signature
    * @memberof module:core/jsgui-lang-essentials
    * @example
    * trim_sig_brackets("[n]") ==> "n"
    * trim_sig_brackets("n") ==> "n"
    */
	var trim_sig_brackets = function(sig) {
		if (tof(sig) == 'string') {
			if (sig[0] == '[' && sig[sig.length - 1] == ']') {
				return sig.substring(1, sig.length - 1);
			} else {
				return sig;
			}
		}
	};

    /**
    * Returns an array without the trailing undefined values, made from the array-like source.
    * @func
    * @param {array-like} arr_like - the source
    * @memberof module:core/jsgui-lang-essentials
    * @example
    * arr_trim_undefined([undefined, 1, undefined]) ==> [undefined, 1]
    */
	var arr_trim_undefined = function(arr_like) {
		var res = [];
		var last_defined = -1;
		var t, v;
		for (var c = 0, l = arr_like.length; c < l; c++) {
			v = arr_like[c];
			t = tof(v);
			if (t == 'undefined') {

			} else {
				last_defined = c;
			}
		}

		for (var c = 0, l = arr_like.length; c < l; c++) {
			if (c <= last_defined) {
				res.push(arr_like[c]);
			}
		}
		return res;
	};
	
    /**
    * Helps to create a polymorphic version of the passed function. The function will get 2 parameters: `a` and `sig`. 
    * Array `a` will contains the actual parameters, `a.l` property will contains the parameters count.
    * The `sig` parameter will contains the parameter types array signature. The function will use these parameters
    * to select a required polymorphic code branch to execute.
    * @func
    * @param {*} [options] - not used
    * @param {function} fn - the function
    * @memberof module:core/jsgui-lang-essentials
    * @example
    * var myFunc = functional_polymorphism(function(a, sig){
    *    return stringify(a) + ": " + sig;
    * });
    *
    * myFunc(1, "a", [null])  ==>  '[1, "a", [null]]: [n,s,a]'
    *
    */
	var functional_polymorphism = function(options, fn) {
		var a0 = arguments;
		if (a0.length == 1) {
			fn = a0[0];
			options = null;
		}
		
		//is there a this?
		
		//var that = this;
		//var _super = that._super;
		
		// not having access to this here
		var arr_slice = Array.prototype.slice;
		var arr, sig, a2, l, a;

		return function() {
			
			//that = this;

			// not sure we want super here?
			//  We hardly ever use this, it would slow things down.
			//var _super = that._super;
			
			a = arguments;
			// and if there is an array of arguments given... give as one
			// argument.
			l = a.length;

			if (l == 1) {
				sig = get_item_sig([a[0]], 1);
				//console.log('fp sig, a.l == 1 ' + sig);
				// a 'l' property given to array given
				a2 = [a[0]];
				a2.l = 1;
				//return fn.call(that, a2, sig, _super);
				return fn.call(this, a2, sig);
			} else if (l > 1) {
				//var arr = arr_like_to_arr(a);
				//var arr = arr_slice.call(a, 0);
				//
				arr = arr_trim_undefined(arr_slice.call(a, 0));

				//arr = arr_trim_undefined(arr);
				//var sig = get_item_sig(arr, 1);
				sig = get_item_sig(arr, 1);
				arr.l = l;
				//console.log('arr.l ' + arr.l);
				//return fn.call(that, arr, sig, _super);
				return fn.call(this, arr, sig);
			} else if (a.length == 0) {
				arr = new Array(0);
				arr.l = 0;
				//return fn.call(that, arr, '[]', _super);
				return fn.call(this, arr, '[]');
			}
		}
	};
    
    /**
    * A shortcut for the [functional_polymorphism()]{@link module:core/jsgui-lang-essentials.functional_polymorphism} function.
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
    var fp = functional_polymorphism;

    /**
    * If an **object** argument passed:
    * Returns an array containing [key, value] arrays of the object properties:<br />
    * `arrayify({a: 1, b: 2})  ==> [["a", 1], ["b", 2]]`
    * 
    * If a **function** argument passed:
    * Returns an arrayified version of the function. The arrayified version accepts an array of values instead of single value for some parameter.
    * For example: `func(a, b) ==> arrayified_func([a], b)`
    * The original function will be called several times, one time for each value from the array. The result of the arrayified function
    * will be an array containing the original function return values.
    * 
    * By default it arrayifies the first parameter. You can specify the arrayifying parameter index as the first argument of the arrayify() function: <br />
    * `arrayify(func)  ==>  arrayified_func([a], b, c, d, ...)` <br />
    * `arrayify(2, func)  ==>  arrayified_func(a, b, [c], d, ...)` 
    * 
    * You can arrayify an async function as well. If the very last argument passed to the arrayified version is function, then this case is considered 
    * as async function call. The last parameter is considered as a callback function receiving the async array processing final result. The callback
    * format is `callback(error, result)`, where `error` is an error object or null, and `result` is the result array.
    * 
    * The original async function must call a callback function in turn. The callback function is passed as a last argument to the async function
    * call, following the usual [call_multiple_callback_functions()]{@link module:core/jsgui-lang-essentials.call_multiple_callback_functions} rules.
    * 
    * @func
    * @param {number} [param_index = 0] - arrayifing parameter index
    * @param {function} fn - arrayifing function
    * @memberof module:core/jsgui-lang-essentials
    * 
    * @example
    * 
    * 
    * // ------- arrayifing an object: -------
    * 
    * arrayify({a: 1, b: 2})  ==> [["a", 1], ["b", 2]]
    * 
    * 
    * // ------- arrayifing a function: -------
    * 
    * var multiply = function (a, b) {
    *     return a * b;
    * };
    * 
    * // multiply([a], b):
    *             
    * var arrayified_multiply = jsgui.arrayify(multiply); 
    * 
    * console.log(arrayified_multiply([1, 5, 10], 2));  // [2, 10, 20]);
    *             
    * // multiply(a, [b]):
    * 
    * var arrayified_multiply2 = jsgui.arrayify(1, multiply); 
    * 
    * console.log(arrayified_multiply2(10, [1, 5, 10])); // [10, 50, 100]);
    * 
    * 
    * // ------- arrayifing an async function: -------
    * 
    * var asyncMultiply = function (a, b, cb) {
    *     setTimeout(function () { cb(null, a * b); }, 1000);
    * };
    * 
    * var arrayified_asyncMultiply = jsgui.arrayify(asyncMultiply); // asyncMultiply([a], b, cb)
    * 
    * var callback = function (error, result) {
    *     console.log(error);  // null
    *     console.log(result); // [2, 10, 20]);
    *     done();
    * };
    * 
    * arrayified_asyncMultiply([1, 5, 10], 2, callback);
    * 
    */
	var arrayify = fp(function(a, sig) {
        // but when the function has it's last parameter as a function...
        //  can we assume it is a callback?
        
        // when given a whole bunch of strings (or numbers) these can be used to make a map for the results.
        //  ie for load_file could give a bunch of string files, it loads them, can provide the results as one object.
        
        // may also want to specify if functions get called in parallel, and the limit to how many get called at once.
        
        // this could take options in the signature - be able to return a results map.
        
        
		// What about arrayifying a map rather than a function?
		// Turns it into name/value pairs. Easier to process with each or
		// measure the length of.

		// what about a pf function that provides an 'a' map.
		// has whatever properties have been provided and asked for.
		var param_index, fn;
		// (param_index, fn)
		var res;
		var process_as_fn = function() {
		    //console.log('process_as_fn');
			res = function() {
				// could use pf here? but maybe not

				//console.log('arguments.length ' + arguments.length);
				//console.log('arguments ' + stringify(arguments));
				var a = arr_like_to_arr(arguments), ts = atof(a), t = this;
			    //console.log('a ' + stringify(a));

                var last_arg = a[a.length - 1];
                //console.log('last_arg ' + last_arg);
                //console.log('a.length ' + a.length);
                
                if (tof(last_arg) == 'function') {
                    // it seems like a callback function.
                    
                    // will do callback result compilation.
                    
                    //console.log('ts[param_index] ' + ts[param_index]);
                    
                    if (typeof param_index !== 'undefined' && ts[param_index] == 'array') {
                        // var res = [], a2 = a.slice(1); // don't think this makes
                        // a copy of the array.
                        var res = []; // don't think this makes a copy of the
                                        // array.
                        // console.log('fn ' + fn);
                        
                        // but we can make this process a function with a callback.
                        
                        
                        var fns = [];
                        
                        each(a[param_index], function(i, v) {
                            var new_params = a.slice(0, a.length - 1);
                            new_params[param_index] = v;
                            // the rest of the parameters as normal
                            
                            // context, function, params
                            fns.push([t, fn, new_params]);
                                
                            //var result = fn.apply(t, new_params);
                            // console.log('result ' + stringify(result));
                            //res.push(result);
                        });
                        //return res;
                        
                        // call_multi not working right?
                        
                        call_multiple_callback_functions(fns, function(err, res) {
                            if (err) {
                                throw err;
                            } else {
                                //
                                
                                //console.log('res ' + stringify(res));
                                
                                // we get back the results of the multiple callback functions.
                                //  let's put them in one array.
                                
                                // maybe make result array concat optional.
                                //  likely to be needed.
                                
                                // concat all of the arrays in the results.
                                
                                var a = [];
                                a = a.concat.apply(a, res);
                                
                                var callback = last_arg;
                                //console.log('last_arg ' + last_arg);
                                callback(null, a);
                            }
                        })
                        
                    } else {
                        return fn.apply(t, a);
                    }
                    
                } else {
                    
                    if (typeof param_index !== 'undefined' && ts[param_index] == 'array') {

                        // var res = [], a2 = a.slice(1); // don't think this makes
                        // a copy of the array.
                        var res = []; // don't think this makes a copy of the
                                        // array.
                        // console.log('fn ' + fn);
                        
                        // but we can make this process a function with a callback.
                        
                        each(a[param_index], function(i, v) {
                            var new_params = a;
                            new_params[param_index] = v;
                            // the rest of the parameters as normal
    
                            var result = fn.apply(t, new_params);
                            // console.log('result ' + stringify(result));
                            res.push(result);
                        });
                        return res;
                    } else {
                        return fn.apply(t, a);
                    }   
                }
                
				// console.log('a.length ' + a.length);
				// console.log('a ' + stringify(a));
				// console.log('param_index ' + param_index);
				// console.log('ts ' + stringify(ts));
                // but if the last function there is a function... it may be best to compile the results into one object.
                
			};
		}

		if (sig == '[o]') {
			var res = [];
			each(a[0], function(i, v) {
				res.push([i, v]);
			});
		} else if (sig == '[f]') {
			param_index = 0, fn = a[0];
			process_as_fn();
		} else if (sig == '[n,f]') {
		    param_index = a[0], fn = a[1];
			process_as_fn();
		}

		// maybe done with pf for getting function signature.
		// console.log('using arrayify');
		// if (typeof param_index == 'undefined') param_index = 0;

		return res;
	});

    /**
    * If an **array** argument passed: <br />
    * Returns an object containing keys and values from the [key, value] pairs of the array:<br />
    * `mapify([["a", 1], ["b", 2]])  ==> {a: 1, b: 2}`
    * 
    * If an **array** and **by_property_name** arguments passed: <br />
    * The array is an objects array. The mapify() function gathers values of the (by_property_name) properties. The values will be keys (property names) of the 
    * returning object. The values of the returning object will be the objects itself:<br />
    * `mapify([{ name: "Larry", age: 21 }, { name: "John", age: 22 }], "name")  ==> { Larry: { name: "Larry", age: 21 }, John: { name: "John", age: 22 } }`
    * 
    * If a **function** argument passed:<br />
    * Returns an mapified version of the function. The orginal function receives 2 parameters: key and value. The mapified version receives an object, and
    * calls the original function for each key/value pair of the object.
    *
    * You can mapify an async function as well. If you pass a function as the second parameter to the mapified version call, then this case is considered 
    * as async function call. The second parameter is considered as a callback function receiving the async object processing final result. The callback
    * format is `callback(error, result)`, where `error` is an error object or null, and `result` is the result array.
    *
    * The original async function must call a callback function in turn. The callback function is passed as a last argument to the async function
    * call, following the usual [call_multiple_callback_functions()]{@link module:core/jsgui-lang-essentials.call_multiple_callback_functions} rules.
    *
    * So, the mapified function parameters are (object) or (object, function). You can call the mapified function with other parameters type, but in
    * this case it will just call the original function (if the parameters number >= 2).
    * 
    * @func
    * @param {object|function} fn - mapifying array or function
    * @param {string} [by_property_name] - mapping property name
    * @memberof module:core/jsgui-lang-essentials
    * 
    * @example
    * 
    * 
    * // ------- mapify an array: -------
    * 
    * mapify([["name", "John"], ["age", 22]])  ==> { name: "John", age: 22 }
    * 
    * 
    * // ------- mapify an array by property name: -------
    * 
    * mapify([{ name: "Larry", age: 21 }, { name: "John", age: 22 }], "name")  ==> { Larry: { name: "Larry", age: 21 }, John: { name: "John", age: 22 } }
    * 
    * 
    * // ------- mapify a function: -------
    * 
    * var keys = [];
    * var values = [];
    * 
    * var addKeyValue = function (key, value) {
    *     keys.push(key);
    *     values.push(value);
    * };
    * 
    * var mapified_addKeyValue = jsgui.mapify(addKeyValue);
    * 
    * mapified_addKeyValue({ a: 1, b: 2, name: "John" });
    * 
    * console.log(keys); // ["a", "b", "name"]
    * console.log(values); // [1, 2, "John"]
    * 
    * 
    * // ------- mapify an async function: -------
    * 
    * 
    * var keys = [];
    * var values = [];
    * 
    * var asyncAddKeyValue = function (key, value, cb) {
    *     setTimeout(function () {
    *         keys.push(key);
    *         values.push(value);
    *         cb(null, key + "=" + value);
    *     }, 1000);
    * };
    * 
    * var callback = function (error, result) {
    *     console.log(result); // ["a=1", "b=2", "name=John"]
    *     //
    *     console.log(keys);   // ["a", "b", "name"]
    *     console.log(values); // [1, 2, "John"]
    * };
    * 
    * var mapified_asyncAddKeyValue = jsgui.mapify(asyncAddKeyValue);
    * 
    * mapified_asyncAddKeyValue({ a: 1, b: 2, name: "John" }, callback);
    * 
    * 
    * // ------- call the original function: -------
    * 
    * var func = function (a, b, c) {
    *     console.log(a + " " + b + " " + c);  // 1 5 10
    * };
    * 
    * var mapified_func = jsgui.mapify(func);
    * 
    * mapified_func(1, 5, 10);
    * 
    * 
    */
    // that target function could take a callback(err, res) parameter.
    //  that means, when calling the function, if the last function is a callback, we can act differently.
	var mapify = function(target) {
		var tt = tof(target);
		if (tt == 'function') {
			var res = fp(function(a, sig) {
				var that = this;
				//console.log('mapified fn sig ' + sig);
				if (sig == '[o]') {
					var map = a[0];
					each(map, function(i, v) {
					    //fn.call(that, i, v);
					    target.call(that, i, v);
					});
				} else if (sig == '[o,f]') {
				    var map = a[0];
				    // call_multi on the function, using the items in the map, calling with 1 param (+callback).
				    var callback = a[1];
				    var fns = [];
				    each(map, function(i, v) {
				        fns.push([target, [i, v]]);
				    });
				    call_multi(fns, function(err_multi, res_multi) {
				        if (err_multi) {
				            callback(err_multi);
				        } else {
				            callback(null, res_multi);
				        }
				    });
				    
				} else if (a.length >= 2) {
				    // applying the target function with a callback...
				    
				    //var last_arg = a[a.length - 1];
				    
					// could take functions, but not dealing with objects may be
					// tricky?
					// or just if there are two params its fine.
					target.apply(this, a);
				}
			});
			return res;
		} else if (tt == 'array') {
			// a bunch of items, items could have name
			
			// could just be given an array to mapify.
			
			var res = {};
			
			if (arguments.length == 1) {
				// dealing with [name, value] pairs
				each(target, function(i, v) {
					res[v[0]] = v[1];
				});
			} else {
				var by_property_name = arguments[1];
				each(target, function(i, v) {
					res[v[by_property_name]] = v;
				});
			}
			
			return res;

		}
		// we may be given a function,
		// we may be given an array.

		// been given a map / object

	};
	
    /**
    * Creates a clone of the given value. The result depends of the input value type:
    * - array: an array containing reference-copies of the input array elements
    * - undefined: undefined
    * - string: same string
    * - number: same number
    * - function: same function reference
    * - boolean: same boolean value
    * - null: null
    * - other (object): deep copy of the object
    *
    * If the second parameter is passed, then returns an array containing the requested number of the clones.
    * @func
    * @param {*} obj - source value
    * @param {number} [count] - number of the output values
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *  clone(1) ==> 1
    *
    *  clone("abc") ==> "abc"
    *  clone("abc", 3) ==> ["abc", "abc", "abc"]
    *
    *  clone([1, undefined]) ==> [1, undefined]
    *
    *  clone({a: 1, b:{c:2}}) ==> {a: 1, b:{c:2}}
    *
    */
	// had x_clones folded into it
	var clone = fp(function(a, sig) {
		var obj = a[0];
		if (a.l == 1) {
			
			
			var t = tof(obj);
			if (t == 'array') {

				// slice removes undefined items
				// console.log('clone obj ' + stringify(obj));
				// console.log('obj.length ' + obj.length);
				/*
				 * var res = []; each(obj, function(i, v) { console.log('i ' + i);
				 * res.push(v); }); return res;
				 */
				return obj.slice();
				
				// deep clone...?

			} else if (t == 'undefined') {
				return undefined;
			} else if (t == 'string') {
			    return obj;
			} else if (t == 'number') {
			    return obj;
			} else if (t == 'function') {
			    return obj;
			} else if (t == 'boolean') {
			    return obj;
			} else if (t == 'null') {
			    return obj;
			} else {

				// extend not cloning the undefined values in the array properly,
				// don't want them trimmed.

				return extend(true, {}, obj);
			}
			
		} else if (a.l == 2 && tof(a[1]) == 'number') {
			var res = [];
			for ( var c = 0; c < a[1]; c++) {
				res.push(clone(obj));
			}
			return res;
			
		}
		
		
	});

    /**
    * Returns true if all the passed arguments are equals. Performs a "deep equals" for objects and arrays.
    * 
    * If one array argiment passed, then returns true if all the array elements are equals.
    * 
    * If one other (non-array) argument passed, returns true.
    * 
    * If no arguments passed, returns null.
    * 
    * @func
    * @param {...*} obj - values to compare.
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *  
    * are_equal(1, 1, 1) => true
    * are_equal(1, 2, 1) => false
    *  
    * are_equal([1, 1, 1]) => true
    * are_equal([1, 2, 1]) => false
    *  
    * are_equal([1, { b1: "2", b2: 2 }, 3], [1, { b1: "2", b2: 2 }, 3]) => true
    * are_equal([1, { b1: "2", b2: 2 }, 3], [1, { b1: 2, b2: 2 }, 3]) => false
    *  
    */
	var are_equal = function() {
		var a = arguments;
		if (a.length == 0)
			return null;
		if (a.length == 1) {
			var t = jsgui.tof(a[0]);
			if (t == 'array' && a[0].length > 1) {
				for ( var c = 1, l = a[0].length; c < l; c++) {
					if (!jsgui.are_equal(a[0][0], a[0][c]))
						return false;
				}
			} else {
				return true;
			}
		}
		if (a.length == 2) {
			var ts = jsgui.atof(a);
			if (ts[0] != ts[1])
				return false;
			var t = ts[0];
			if (t == 'string' || t == 'number')
				return a[0] == a[1];
			if (t == 'array') {
				if (a[0].length != a[1].length)
					return false;
				for ( var c = 0, l = a[0].length; c < l; c++) {
					if (!jsgui.are_equal(a[0][c], a[1][c]))
						return false;
				}
				;
			} else if (typeof a[0] == 'object') {
			    // get the dict of keys for both, compare the lengths, (compare
			    // the keys), get merged key map
			    var merged_key_truth_map = {};
			    var c1 = 0;
			    each(a[0], function (i, v) {
			        merged_key_truth_map[i] = true;
			        c1++;
			    });
			    var c2 = 0;
			    each(a[1], function (i, v) {
			        merged_key_truth_map[i] = true;
			        c2++;
			    });
			    if (c1 != c2)
			        return false;
			    var objects_are_equal = true;
			    each(merged_key_truth_map, function (i, v) {
			        if (!jsgui.are_equal(a[0][i], a[1][i])) {
			            objects_are_equal = false;
			            return;
                    }
			    });
			    return objects_are_equal;
			} else {
			    return a[0] == a[1];
			}
		}
		if (a.length > 2) {
			var ts = jsgui.atof(a);
			if (!jsgui.are_equal(ts))
				return false;
			var o = a[0];
			for ( var c = 1, l = a.length; c < l; c++) {
				if (a[c] !== o)
					return false;
			}
		};
		return true;
	};

	
    /**
    * Assigns property values from map to obj.
    * @func
    * @param {object} obj - target object
    * @param {object} map - source key/value object
    * @returns undefined
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *  
    *  var obj1 = {};
    *  jsgui.set_vals(obj1, { a: 1, b: 2});  // obj1 == { a: 1, b: 2}
    *  
    *  var obj2 = { a: 1, b: 2};
    *  jsgui.set_vals(obj2, { b: 200, c: 300});  // obj2 == { a: 1, b: 200, c: 300}
    *  
    */
	var set_vals = function(obj, map) {
		each(map, function(i, v) {
			obj[i] = v;
		});
	};
	

    /**
    * description...
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
	var ll_set = function(obj, prop_name, prop_value) {
		// not setting sub-properties specifically. sub-properties are
		// properties of a kind
		// however will not use ll_set inappropriately eg border.width works
		// differently

		var arr = prop_name.split('.');
		//console.log('arr ' + arr);
		var c = 0, l = arr.length;
		var i = obj._ || obj, s;
		
		while (c < l) {
			s = arr[c];
			//console.log('s ' + s);
			if (typeof i[s] == 'undefined') {
				if (c - l == -1) {
					// console.log('default_value ' + default_value);
					i[s] = prop_value;
				} else {
					i[s] = {};
				}
			} else {
				if (c - l == -1) {
					// console.log('default_value ' + default_value);
					i[s] = prop_value;
				}
			}
			i = i[s];
			c++;
		};
		return prop_value;
	};
	
	/*
	var ll_get_inner = function(a0, a1) {
		var i = a0._ || a0;
		var arr = a1.split('.');

		// shows how much the ll functions get used when they get logged!

		//console.log('ll_get arr ' + arr);
		var c = 0, l = arr.length, s;

		while (c < l) {
			s = arr[c];
			//console.log('s ' + s);
			//console.log('typeof i[s] ' + typeof i[s]);
			//console.log('c ' + c);
			//console.log('l ' + l);
			if (typeof i[s] == 'undefined') {
				if (c - l == -1) {
					// console.log('default_value ' + default_value);
					// console.log(i[s]);
					//i[s] = a[2];
					//return i[s];
				} else {
					// i[s] = {};
					throw 'object ' + s + ' not found';
				}
			} else {
				if (c - l == -1) {
					// console.log('default_value ' + default_value);
					// console.log(i[s]);
					// i[s] = a[2];
					return i[s];
				}
			}
			i = i[s];
			c++;
		}
	}
	*/
	

    /**
    * description...
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
	var ll_get = function(a0, a1) {

		if (a0 && a1) {
			var i = a0._ || a0;

			if (a1 == '.') {
				//(function() {
					if (typeof i['.'] == 'undefined') {
						//throw 'object ' + s + ' not found';
						return undefined;
					} else {
						return i['.'];
					}
				//})();
				
			} else {

				//return ll_get_inner(a0, a1);

				
				var arr = a1.split('.');

				// shows how much the ll functions get used when they get logged!

				//console.log('ll_get arr ' + arr);
				var c = 0, l = arr.length, s;

				while (c < l) {
					s = arr[c];
					//console.log('s ' + s);
					//console.log('typeof i[s] ' + typeof i[s]);
					//console.log('c ' + c);
					//console.log('l ' + l);
					if (typeof i[s] == 'undefined') {
						if (c - l == -1) {
							// console.log('default_value ' + default_value);
							// console.log(i[s]);
							//i[s] = a[2];
							//return i[s];
						} else {
							// i[s] = {};
							throw 'object ' + s + ' not found';
						}
					} else {
						if (c - l == -1) {
							// console.log('default_value ' + default_value);
							// console.log(i[s]);
							// i[s] = a[2];
							return i[s];
						}
					}
					i = i[s];
					c++;
				}
				
				
				
			}
			// return i;
		}
	};


	/*
	var ll_get = fp(function(a, sig) {

		if (a.l == 2) {
			var i = a[0]._ || a[0];

			if (a[1] == '.') {
				if (typeof i['.'] == 'undefined') {
					//throw 'object ' + s + ' not found';
					return undefined;
				} else {
					return i['.'];
				}
			} else {
				var arr = a[1].split('.');

				// shows how much the ll functions get used when they get logged!

				//console.log('ll_get arr ' + arr);
				var c = 0, l = arr.length;
				

				while (c < l) {
					var s = arr[c];
					//console.log('s ' + s);
					//console.log('typeof i[s] ' + typeof i[s]);
					//console.log('c ' + c);
					//console.log('l ' + l);
					if (typeof i[s] == 'undefined') {
						if (c - l == -1) {
							// console.log('default_value ' + default_value);
							// console.log(i[s]);
							//i[s] = a[2];
							//return i[s];
						} else {
							// i[s] = {};
							throw 'object ' + s + ' not found';
						}
					} else {
						if (c - l == -1) {
							// console.log('default_value ' + default_value);
							// console.log(i[s]);
							// i[s] = a[2];
							return i[s];
						}
					}
					i = i[s];
					c++;
				}
			}
			// return i;
		}
	});
	*/
	
    /**
    * description...
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
	var truth = function(value) {
		return value === true;
	};
	
    /**
    * description...
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
	var iterate_ancestor_classes = function(obj, callback) {
		
		/*
		if (obj.constructor &! obj._superclass) {
			iterate_ancestor_classes(obj.constructor, callback)
		} else {
			callback(obj);
			if (obj._superclass) {
				iterate_ancestor_classes(obj._superclass, callback);
			}
			
		}
		*/
		
		var ctu = true;
		
		var stop = function() {
			ctu = false;
		}
		
		callback(obj, stop);
		if (obj._superclass && ctu) {
			iterate_ancestor_classes(obj._superclass, callback);
		}
		
		
	}
	
	

    /**
    * description...
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
	var is_arr_of_t = function(obj, type_name) {
		var t = tof(obj), tv;
		if (t == 'array') {
			var res = true;
			
			each(obj, function(i, v) {
				//console.log('2) v ' + stringify(v));
				tv = tof(v);
				//console.log('tv ' + tv);
				//console.log('type_name ' + type_name);
				if (tv != type_name) res = false;
			});
			return res;
		} else {
			return false;
		}
		
	}
	
    /**
    * description...
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
	var is_arr_of_arrs = function(obj) {
		return is_arr_of_t(obj, 'array');
	}


    /**
    * description...
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
	var is_arr_of_strs = function(obj) {
		//console.log('obj ' + stringify(obj));
		return is_arr_of_t(obj, 'string');
	}
	
	
    /**
    * description...
    * @member
    * @memberof module:core/jsgui-lang-essentials
    */
	var input_processors = {};

    /**
    * description...
    * @member
    * @memberof module:core/jsgui-lang-essentials
    */
	var output_processors = {};
	
	// for data types...
	//  don't look up the data types directly for the moment.
	//  they are composed of input processors, validation and output processors.
	
	
    /**
    * description...
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
	var is_constructor_fn = function(fn) {
		return is_defined(fn.prototype);
	}
	
	
	//var output_processors = {};
	
	// Possibly validators here too.
	//  They may well get used for data structures that deal with these data types. The typed constraints could make use of them (the basis that is set in essentials)
	//  while adding to them. Perhaps a 'core' intermediate layer will be there extending essentials with some of the data types that are to be used throughout the system.
	
	// May find that the functionality for 'nested' gets moved out from that code file. Not so sure about using the Data_Type_Instance...
	//  it could be useful, but not really useful on the level of what the user wants the system to do.
	//  Want to get the Data_Object and Collections system working in some more generic tests, also want to explore some of the more complicated data structures
	//  that will be used for HTML. The idea is that the HTML section will not need so much code because it is making use of some more generally defined things.
	
	// Defining an element's style attributes... will use a Data_Object system internally that is customized to reformat data.
	//  That seems like a fairly big goal, want to get these things working on a simpler level and in collections.
	//  Will use some kind of polymorphic rearrangement to rearrange where suitable.
	
    /**
    * Executes several tasks one by one (default) or simultaneously (up to specified amount of tasks at the same time).
    *
    * Each task is an array in turn. The following task formats are supported:
    * - [context, fn]
    * - [fn, params]
    * - [fn, params, fn_callback]
    * - [context, fn, params]
    * - [context, fn, params, fn_callback]
    *
    * The task parts mean:
    * - context: execution context ("this" value)
    * - fn - task function
    * - params - task function parameters array
    * - fn_callback - callback function calling when the task is completed: fn_callback(null, result), where "result" is the task function result
    *
    * The task function must call a predefined callback function. The callback function is passed as the last parameter to the task function.
    * The callback function looks as follows: callback(error, result)
    * - error: an error object or null
    * - result: the task result
    *
    * The "main" callback (passed to the call_multiple_callback_functions() call) looks as follows:
    * callback(error, result), where "result" is all the tasks result array.
    *
    * @example
    * var tasks = [];
    *
    * var task1 = function(arg1, arg2, cb) {
    *    setTimeout(function () { cb(null, (arg1 * arg2)); }, 1000); // multiply arg1 * arg2
    * };
    *
    * tasks.push([task1, [10, 2]]);   // multiply 10 * 2
    *
    * call_multiple_callback_functions(tasks, function(error, result) {
    *    console.log("All the tasks are done. The first task result is " + result[0]);
    * });
    *
    *
    * @func
    * @param {array} tasks - tasks array
    * @param {number} [num_parallel = 1] - maximum amount of tasks running simultaneously
    * @param {function} callback - callback function called when all the tasks are completed
    * @param {boolean} [return_params = false] - include the task parameters to the task result
    * @memberof module:core/jsgui-lang-essentials
    */
	var call_multiple_callback_functions = fp(function(a, sig) {
		// will look at the signature and choose what to do.
		//if (sig == )
		// need to be checking if the item is an array - nice to have a different way of doing that with fp.
		
		// and want to look out for a number in there.
		//  want it to call multiple functions, but have them running in parallel too.
		//  like the async library, but also accepting parameters.
		
		// arr_functions_params_pairs, callback
		var arr_functions_params_pairs, callback, return_params = false;
		
		//console.log('a.l ' + a.l);
		//console.log('');
		//console.log('');
		//console.log('call_multi sig ' + sig);
		
		var num_parallel = 1;
		
		if (a.l == 2) {
			arr_functions_params_pairs = a[0];
			callback = a[1];
		}
		if (a.l == 3) {
		    // look at the sig
		    // arr, num, fn - number is the number of parallel to do at once.
		    // return_params is a boolean?
		    
		    // want a signature that just treats an array as a?
		    //  may make more sense for these function signatures.
		    //   at least for the first stage... could look in more detail at the array.
		    //   not using the more complicated signatures right now. could change to a different sig method when needed, or use different sig or fp options.
		    
		    //console.log('sig ' + sig);
		    
		    if (sig == '[a,n,f]') {
		        arr_functions_params_pairs = a[0];
		        num_parallel = a[1];
		        callback = a[2];
		    }
		    if (sig == '[a,f,b]') {
		        arr_functions_params_pairs = a[0];
                callback = a[1];
                return_params = a[2];
		    }
			
		}
		
		// also want the context.
		
		var res = [];
		
		var l = arr_functions_params_pairs.length;
		var c = 0;
		var that = this;
		
		var count_unfinished = l;

		// the number of processes going 
		
		// the maximum number of processes allowed.
        //  num_parallel
        
        var num_currently_executing = 0;
        
		var process = function() {
		    num_currently_executing++;
			// they may not be pairs, they could be a triple with a callback.
			//console.log('num_currently_executing ' + num_currently_executing);
			//console.log('c ' + c);
			
			var pair = arr_functions_params_pairs[c];
			
			//console.log('pair ' + pair);
			
			// object (context / caller), function, params
			// object (context / caller), function, params, fn_callback
			
			var context;
			var fn, params, fn_callback;
			// function, array
			// context
			//console.log('pair.length ' + pair.length);
			var pair_sig = get_item_sig(pair);
			//console.log('pair_sig ' + pair_sig);
			//console.log(jsgui.atof(pair));
			//console.log('pair.length ' + pair.length);
			
			if (pair.length == 2) {
			    // [context, fn]
			    // [fn, params]

				//if (tof(pair[0]) == 'function' && tof(pair[1]) == 'array' && pair.length == 2) {
				//	fn = pair[0];
				//	params = pair[1];
				//}
				// ?, function
				
				if (tof(pair[1]) == 'function') {
					context = pair[0];
					fn = pair[1];
					params = [];
				} else {
					fn = pair[0];
					params = pair[1];
				}			
			}
			
			// function, array, function
			if (pair.length == 3) {
			    // [fn, params, fn_callback]
			    // [context, fn, params]

				if (tof(pair[0]) == 'function' && tof(pair[1]) == 'array' && tof(pair[2]) == 'function') {
					fn = pair[0];
					params = pair[1];
					fn_callback = pair[2];
				}
				// object / data_object?
				// ?, function, array
				if (tof(pair[1]) == 'function' && tof(pair[2]) == 'array') {
				    //console.log('has context');
					context = pair[0];
					fn = pair[1];
					params = pair[2];
					
					// may not be a fn_callback in this case.
				}
			}
			
			if (pair.length == 4) {
			    // [context, fn, params, fn_callback]

			    // context, function being called, params, cb
			    context = pair[0];
			    fn = pair[1];
			    params = pair[2];
			    fn_callback = pair[3];
			}
			
			var i = c;
			// not sure it keeps this same value of i.
			//  can try some tests on this.
			
			c++;
			//throw 'stop';
			
			var cb = function(err, res2) {
			    num_currently_executing--;
			    count_unfinished--; 
				//console.log('cb num_currently_executing ' + num_currently_executing + ', c ' + c);
				if (err) {
					var stack = new Error().stack;
					console.log(stack);
					throw err;
				} else {
				    //console.log('i ' + i + ', res2 ' + res2);
					if (return_params) {
						//console.log('call_multi inner cb return_params ' + stringify(return_params));
						//throw 'stop';
						//console.log('params ' + params);
						res[i] = [params, res2];
					} else {
						res[i] = res2;
					}
					//console.log('pair.length ' + pair.length);

					if (fn_callback) {
					    fn_callback(null, res2);
					}
					/*
					
					if (pair.length == 3) {
						fn_callback(null, res2);
					}
					if (pair.length == 4) {
						fn_callback(null, res2);
					}
					*/
					
					if (c < l) {

					    // only process if the num executing is less than the max num to execute.
					    // otherwise the process will be done when a callabck is produced from the function.
					    
					    if (num_currently_executing < num_parallel) {
					        process();
					    }
					    
						
					} else {
					    if (count_unfinished <= 0) {
					        callback(null, res);
					    }
					}
				}
			}
			
			var arr_to_call = clone(params);
			//console.log('params ' + params);
			//console.log('fn ' + fn);
			arr_to_call.push(cb);
			//console.log('context ' + context);
			if (context) {
				fn.apply(context, arr_to_call);
			} else {
				fn.apply(that, arr_to_call);
			}
		}
		
		//console.log('arr_functions_params_pairs ' + arr_functions_params_pairs);
		if (arr_functions_params_pairs.length > 0) {
		    while ((c < l)  && (num_currently_executing < num_parallel)) {
		        process();
		    }	
		} else {
		    if (callback) {
		        callback(null, null);
		    }
		}
		
		
	});
	
	var multi = call_multiple_callback_functions;
	
    /**
    * Alias to the [call_multiple_callback_functions()]{@link module:core/jsgui-lang-essentials.call_multiple_callback_functions} function.
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
    var call_multi = call_multiple_callback_functions;
	
	
    /**
    * description...
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
	var Fns = function() {
	    var fns = [];
	    fns.go = function(callback) {
	        call_multi(fns, callback);
	    }
	    return fns;
	}
	
    /**
    * description...
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
	var native_constructor_tof = function(value) {
		if (value === String) {
			return 'String';
		}
		if (value === Number) {
			return 'Number';
		}
		if (value === Boolean) {
			return 'Boolean';
		}
		if (value === Array) {
			return 'Array';
		}
		if (value === Object) {
			return 'Object';
		}
	}
	
	//var storage_closure
	
	// jsgui.get and jsgui.set
	//  so JSGUI itself would have some properties within a closure.
	//  Not sure if that would allow some kind of global variables (again).
	var storage_map = {};


    /**
    * description...
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
	var get = function(key) {
		return storage_map[key];
	}

    /**
    * description...
    * @func
    * @memberof module:core/jsgui-lang-essentials
    */
	var set = function(key, value) {
		storage_map[key] = value;
	}


	/*

	(function() {


	})();
	
	*/
	// will put functions into the jsgui object.

	// with the functions listed like this it will be easier to document them.

	var jsgui = {
		'Class' : Class,
		'each' : each,
		'eac': eac,
		'is_array' : is_array,
		'is_dom_node' : is_dom_node,
		'is_ctrl' : is_ctrl,
		'extend' : extend,
		'clone' : clone,
		//'x_clones' : x_clones,
		'get_truth_map_from_arr' : get_truth_map_from_arr,
		'arr_trim_undefined': arr_trim_undefined,
		'get_map_from_arr' : get_map_from_arr,
		'arr_like_to_arr' : arr_like_to_arr,
		'tof' : tof,
		'atof' : atof,
		'is_defined' : is_defined,
		'stringify' : stringify,
		'functional_polymorphism' : functional_polymorphism,
		'fp' : fp,
		'arrayify' : arrayify,
		'mapify' : mapify,
		'are_equal' : are_equal,
		'get_item_sig' : get_item_sig,
		'set_vals': set_vals,
		'truth': truth,
		'trim_sig_brackets' : trim_sig_brackets,
		'll_set': ll_set,
		'll_get': ll_get,
		'iterate_ancestor_classes': iterate_ancestor_classes,
		'is_constructor_fn': is_constructor_fn,
		'is_arr_of_t': is_arr_of_t,
		'is_arr_of_arrs': is_arr_of_arrs,
		'is_arr_of_strs': is_arr_of_strs,
		'input_processors': input_processors,
		'output_processors': output_processors,
		'call_multiple_callback_functions': call_multiple_callback_functions,
		'call_multi': call_multi,
		'native_constructor_tof': native_constructor_tof,
		'Fns': Fns,
		'get': get,
		'set': set
	};

	
    /**
    * description...
    * @alias data_types_info
    * @member
    * @memberof module:core/jsgui-lang-essentials
    */
	// Maybe this will be moved to an intermediate layer.
	jsgui.data_types_info = jsgui.data_types_info || {};
	
	
	
	
	// and the local variable shortcuts that go at the beginning:
	
	/*
	 
	 var j = jsgui;
	 var Class = j.Class;
	 var each = j.each;
	 var is_array = j.is_array;
	 var is_dom_node = j.is_dom_node;
	 var is_ctrl = j.is_ctrl;
	 var extend = j.extend;
	 var x_clones = j.x_clones;
	 var get_truth_map_from_arr = j.get_truth_map_from_arr;
	 var get_map_from_arr = j.get_map_from_arr;
	 var arr_like_to_arr = j.arr_like_to_arr;
	 var tof = j.tof;
	 var is_defined = j.is_defined;
	 var stringify = j.stringify;
	 var functional_polymorphism = j.functional_polymorphism;
	 var fp = j.fp;
	 var arrayify = j.arrayify;
	 var mapify = j.mapify;
	 var are_equal = j.are_equal;
	 var get_item_sig = j.get_item_sig;
	 var set_vals = j.set_vals;
	 var truth = j.truth;
	 var trim_sig_brackets = j.trim_sig_brackets;
	 var ll_set = j.ll_set;
	 var ll_get = j.ll_get;
	 var is_constructor_fn = j.is_constructor_fn;
	 var is_arr_of_arrs = j.is_arr_of_arrs;
	 var is_arr_of_strs = j.is_arr_of_strs;
	 var is_arr_of_t = j.is_arr_of_t;
	 */
	
	
	// var jsgui = {};
	// alert('returning jsgui from jsgui-lang');
	return jsgui;

});