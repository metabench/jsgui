// JSGUI Web Build (With jQuery integration?)

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
    * Iterates over a collection calling the collection.each(fn, context) method.
    *
    * @name each
    * @func
    * @param {Collection} collection - collection of elements
    * @param {function} fn - iterator function
    * @param {Object} [context] - context object
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *
    * // TODO..............
    *
    */


    /**
    * Iterates over the array elements. The iterator function calls for each element: fn(index, element, stop):
    * - index: the element index
    * - element: the element value
    * - stop: call this function to prevent further iterations
    *
    * The iterator function is bound to the context object, if passed.
    *
    * @name each
    * @func
    * @param {Array} arr - array of elements
    * @param {module:core/jsgui-lang-essentials.arrayIteratorCallback} fn - iterator function
    * @param {Object} [context] - context object
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *
    * jsgui.each([1, 2, 3, 4, 5], function(index, element, stop){
    *    console.log(index + ":" + element);  // 0:1 1:2 2:3 3:4 4:5
    *    if (index > 1000) stop();
    * });
    *
    */


    /**
    * Iterates over the object properties. The iterator function calls for each element: fn(key, value, stop):
    * - key: the property key
    * - value: the property value
    * - stop: call this function to prevent further iterations
    *
    * The iterator function is bound to the context object, if passed.
    *
    * @name each
    * @func
    * @param {Object} obj - object
    * @param {module:core/jsgui-lang-essentials.objectIteratorCallback} fn - iterator function
    * @param {Object} [context] - context object
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *
    * jsgui.each({a: 1, b: 2}, function(key, value, stop){
    *    if (key == "secretKey"){ 
    *      stop();
    *      return;
    *    }
    *    console.log(key + ":" + value);  // a:1  b:2
    * });
    *
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
						res[name] = fn(name, collection[name], stop);
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
    * Iterates over a collection calling the collection.each(fn, context) method.
    *
    * <mark>maybe collection.each() must be changed to collection.eac()?</mark>
    *
    * @name eac
    * @func
    * @param {Collection} collection - collection of elements
    * @param {function} fn - iterator function
    * @param {Object} [context] - context object
    * @memberof module:core/jsgui-lang-essentials
    * @example
    * 
    * // TODO.......
    * 
    */

    /**
    * Iterates over an array, just like the [each()]{@link module:core/jsgui-lang-essentials.each} function, but the iterator function parameters order is changed:<br>
    * `fn(element, index, stop)` instead of `fn(index, element, stop)`
    *
    * Better each function, first param of callback is obj, 2nd is index. Will replace all each functions with this version then change the name to each.
	*  Useful for new code.
    *
    * @name eac
    * @func
    * @param {Array} arr - array of elements
    * @param {module:core/jsgui-lang-essentials.arrayIteratorCallback-eac} fn - iterator function
    * @param {Object} [context] - context object
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *
    * jsgui.each([1, 2, 3, 4, 5], function(element, index, stop){
    *    console.log(index + ":" + element);  // 0:1 1:2 2:3 3:4 4:5
    *    if (index > 1000) stop();
    * });
    *
    */

    /**
    * Iterates over the object properties, just like the [each()]{@link module:core/jsgui-lang-essentials.each} function, but the iterator function parameters order is changed:<br />
    * `fn(value, key, stop)` instead of `fn(key, value, stop)`
    *
    * Better each function, first param of callback is obj, 2nd is index. Will replace all each functions with this version then change the name to each.
	*  Useful for new code.
    *
    * @name eac
    * @func
    * @param {Object} obj - object
    * @param {module:core/jsgui-lang-essentials.objectIteratorCallback-eac} fn - iterator function
    * @param {Object} [context] - context object
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *
    * jsgui.eac({a: 1, b: 2}, function(value, key, stop){
    *    if (key == "secretKey"){ 
    *      stop();
    *      return;
    *    }
    *    console.log(key + ":" + value);  // a:1  b:2
    * });
    *
    */
	var eac = function (collection, fn, context) {
		// each that puts the results in an array or dict.
		if (collection) {

			if (collection.__type == 'collection') {
				return collection.eac(fn, context);
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
	var jq_type = function (obj) {
	    //return obj == null ? String(obj) : jq_class2type[toString.call(obj)] || "object";
	    if (obj == null) return String(obj);
	    var s = Object.prototype.toString.call(obj);
	    return jq_class2type[s] || "object";
	};



    /**
    * Returns `true` if the passed `obj` is an `Array`. Delegates to the native `Array.isArray()` function if it exists.
    * @func
    * @param {Object} obj - object to check
    * @memberof module:core/jsgui-lang-essentials
    */
	var is_array = Array.isArray || function (obj) {
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


    jq_class2type["[object Boolean]"] = "boolean";
    jq_class2type["[object Number]"] = "number";
    jq_class2type["[object String]"] = "string";
    jq_class2type["[object Function]"] = "function";
    jq_class2type["[object Array]"] = "array";
    jq_class2type["[object Date]"] = "date";
    jq_class2type["[object RegExp]"] = "regexp";
    jq_class2type["[object Object]"] = "object";

    /* each() calls isArray(), isArray() calls jq_type(), jq_type() uses jq_class2type[] in turn
    each("Boolean Number String Function Array Date RegExp Object".split(" "),
		function(i, name) {
			if (typeof(name) == 'string') {
		        jq_class2type["[object " + name + "]"] = name.toLowerCase();
		    }
		});*/

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
    * - "date"
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
						    var propIsPrintable = function (name, value) {
						        if (!includeFunctions && tof(value) === 'function') return false;
						        //
						        if (excludingProps) {
						            for (var i = 0; i < excludingProps.length; i++) {
						                if (name == excludingProps[i]) return false;
						            }
						        }
						        //
						        return true;
						    };
                            //
							var first = true;
							// res = res + '{';
							res.push('{');
							each(obj, function(i, v) {
								//console.log(tof(v));
								//
								//var propIsPrintable = true;
								//if (propIsPrintable && !includeFunctions && tof(v) === 'function') propIsPrintable = false;
								//if (propIsPrintable && excludingProps && excludingProps.indexOf(i)>=0) propIsPrintable = false;
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
							    if (propIsPrintable(i, v)) {
							        if (!first) res.push(', ');
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


						//console.log('t ' + t);
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
	        if (sig.charAt(0) == '[' && sig.charAt(sig.length - 1) == ']') {
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
				//arr.l = l;
				arr.l = arr.length;
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
    * Returns an array containing [key, value] arrays of the passed object properties.<br />
    * 
    * @name arrayify
    * @func
    * @param {object} obj - arrayifing object
    * @memberof module:core/jsgui-lang-essentials
    * 
    * @example
    * 
    * arrayify({a: 1, b: 2})  ==> [["a", 1], ["b", 2]]
    * 
    */


    /**
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
    * Returns an object containing keys and values from the [key, value] pairs of the array.
    * 
    * @name mapify
    * @func
    * @param {array} arr - mapifying array
    * @memberof module:core/jsgui-lang-essentials
    * 
    * @example
    * 
    * mapify([["name", "John"], ["age", 22]])  ==> { name: "John", age: 22 }
    * 
    */

    /**
    * The array is an objects array. The mapify() function gathers values of the (by_property_name) properties. The values will be keys (property names) of the 
    * returning object. The values of the returning object will be the objects itself.
    * 
    * @name mapify
    * @func
    * @param {array} arr - mapifying array
    * @param {string} by_property_name - mapping property name
    * @memberof module:core/jsgui-lang-essentials
    * 
    * @example
    * 
    * var obj_arr = [{ name: "Larry", age: 21 }, { name: "John", age: 22 }];
    * 
    * mapify(obj_arr, "name")  ==> { Larry: { name: "Larry", age: 21 }, John: { name: "John", age: 22 } }
    * 
    */

    /**
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
    * @param {function} fn - mapifying function
    * @memberof module:core/jsgui-lang-essentials
    * 
    * @example
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
    * - array: an array containing clones of the input array elements
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
				
				var res = []; 
				each(obj, function(i, v) {
					//console.log('i ' + i);
					res.push(clone(v)); 
				});
				return res;
				
				//return obj.slice();
				
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
    *  jsgui.set_vals(obj1, { a: 1, b: 2});  // obj1 == { a: 1, b: 2 }
    *  
    *  var obj2 = { a: 1, b: 2};
    *  jsgui.set_vals(obj2, { b: 200, c: 300});  // obj2 == { a: 1, b: 200, c: 300 }
    *  
    */
	var set_vals = function(obj, map) {
		each(map, function(i, v) {
			obj[i] = v;
		});
	};
	

    /**
    * Assigns a property value of the object using a qualified (dotted) property name. Nested sub-objects are created if needed.
    *
    * if the object contains an internal object named "_", then assigns the internal object property.
    *
    * @func
    * @param {object} obj - target object
    * @param {string} prop_name - property name
    * @param {*} prop_value - property value
    * @returns property value
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *  
    *  // object itself:
    *  
    *  var obj1 = {};
    *  jsgui.ll_set(obj1, "a", 1);  // obj1 == { a: 1 }
    *  
    *  var obj2 = {};
    *  jsgui.ll_set(obj2, "a.b.c", 1);  // obj2 == { a: { b: { c: 1 } } }
    *  
    *  var obj3 = { a: { b: { c: 1 } };
    *  jsgui.ll_set(obj3, "a.b.c", 100);  // obj3 == { a: { b: { c: 100 } } }
    *  
    *  // internal object:
    *  
    *  var obj4 = { _: {}, a: 100 };
    *  jsgui.ll_set(obj4, "a", 1);  // obj4 == { _: { a: 1 }, a: 100 }
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
    * Returns a property value of the object using a qualified (dotted) property name.
    *
    * Returns `undefined` if the property does not exists.
    *
    * Throwns an exception if an inner object containing the property does not exists.
    *
    * if the object contains an internal object named "_", then return the value of the internal object property.
    *
    * Allows to pass "." (dot) as the `prop_name` parameter returning a value of the '.' property for the object or internal "_" object (if the value exists).
    *
    * @func
    * @param {object} obj - object
    * @param {string} prop_name - property name
    * @returns property value
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *  
    *  // object itself:
    *  
    *  jsgui.ll_get({}, "a");  ==> undefined
    *  jsgui.ll_get({ a: 1 }, "a");  ==> 1
    *  jsgui.ll_get({ '.': 1 }, ".");  ==> 1
    *
    *  jsgui.ll_get({ a: { b: { c: 1 } } }, "a.b.c");  ==> 1
    *  jsgui.ll_get({ a: { b: { } } }, "a.b.c");  ==> undefined
    *  jsgui.ll_get({ a: { } }, "a.b.c");  ==> exception
    *  jsgui.ll_get({ }, "a.b.c");  ==> exception
    *  
    *  // internal object:
    *  
    *  jsgui.ll_get({ _ : { '.': 1 } }, ".");  ==> 1
    *  jsgui.ll_get({ _ : { a: { b: { c: 1 } } } }, "a.b.c");  ==> 1
    *  jsgui.ll_get({ _ : { '.': 1 } }, "a.b.c");  ==> exception
    *
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
    * Returns true only if the passed value is a boolean true.
    * @param {*} value - value to check
    * @func
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *  
    *  jsgui.truth(true)  ==> true
    *  jsgui.truth(1)  ==> false
    *  
    *  
    *  
    */
	var truth = function(value) {
		return value === true;
	};
	
    /**
    * Iterates over ancestor classes hierarchy calling the callback function for each class in the inheritance tree. Starts from the passed class, ends on jsgui.Class.
    *
    * The iteration can be broken calling the `stop()` function (the callback second parameter).
    *
    * @func
    * @param {jsgui.Class} obj - class to start the iteration
    * @param {function} callback - callback function (obj, stop).
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *  
	*  var Class = jsgui.Class;
	*  var Person = Class.extend({});
	*  var Ninja = Person.extend({});
    *  
	*  var classes = [];
    * 
	*  var callback = function (_class, stop) {
	*    classes.push(_class);
	*  };
	*  
	*  jsgui.iterate_ancestor_classes(Ninja, callback);  // classes == [Ninja, Person, Class]
    *  
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
    * Returns `true` if the passed object is an array containing values of the specified type only.
    * @param {*} obj - object to check
    * @param {string} type_name - estimated type name
    * @func
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *  
    *  jsgui.is_arr_of_t("1", "string")  ==>  false
    *  
    *  jsgui.is_arr_of_t([], "string")  ==>  true
    *  
    *  jsgui.is_arr_of_t(["1", "2", "3"], "string")  ==>  true
    *  
    *  jsgui.is_arr_of_t(["1", 2, "3"], "string")  ==>  false
    *  
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
    * Returns `true` if the passed object is an array containing arrays in turn.
    * @param {*} obj - object to check
    * @func
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *  
    *  jsgui.is_arr_of_arrs([])  ==>  true
    *  
    *  jsgui.is_arr_of_arrs(["1", "2", "3"])  ==>  false
    *  
    *  jsgui.is_arr_of_arrs([[], [1, "2"]])  ==>  true
    *  
    */
	var is_arr_of_arrs = function(obj) {
		return is_arr_of_t(obj, 'array');
	}


    /**
    * Returns `true` if the passed object is an array containing strings only.
    * @param {*} obj - object to check
    * @func
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *  
    *  jsgui.is_arr_of_strs("1")  ==>  false
    *  
    *  jsgui.is_arr_of_strs([])  ==>  true
    *  
    *  jsgui.is_arr_of_strs(["1", "2", "3"])  ==>  true
    *  
    *  jsgui.is_arr_of_strs(["1", 2, "3"])  ==>  false
    *  
    */
	var is_arr_of_strs = function(obj) {
		//console.log('obj ' + stringify(obj));
		return is_arr_of_t(obj, 'string');
	}
	
	
    /**
    * <mark>description... TODO</mark>
    * @member
    * @memberof module:core/jsgui-lang-essentials
    */
	var input_processors = {};

    /**
    * <mark>description... TODO</mark>
    * @member
    * @memberof module:core/jsgui-lang-essentials
    */
	var output_processors = {};
	
	// for data types...
	//  don't look up the data types directly for the moment.
	//  they are composed of input processors, validation and output processors.
	
	
    /**
    * <mark>Returns `true` if the passed object has a prototype (typically the object is a function).</mark>
    * @func
    * @param {function} fn - object to check
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *  
    *  jsgui.is_constructor_fn(Object)  ==>  true
    *  jsgui.is_constructor_fn(new Object())  ==>  false
    *  
    *  jsgui.is_constructor_fn(setInterval)  ==>  true
    *  
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
    * Each task can be a function, or an array in. The following task formats are supported:
    * - fn
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
		//console.log('a.l', a.l);
		if (a.l == 2) {
			arr_functions_params_pairs = a[0];
			//console.log('arr_functions_params_pairs', arr_functions_params_pairs);
			callback = a[1];
			//console.log('callback', callback);
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
			
			//console.log('pair', pair);
			
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

			var t_pair = tof(pair);
			//console.log('t_pair', t_pair);

			if (t_pair == 'function') {
				fn = pair;
				params = [];
			} else {
				if (pair.length == 1) {

				}
				
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
					//console.log(stack);
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
					//console.log('c', c);
					//console.log('l', l);
					
					if (c < l) {

					    // only process if the num executing is less than the max num to execute.
					    // otherwise the process will be done when a callabck is produced from the function.
					    //console.log('num_currently_executing', num_currently_executing);
					    if (num_currently_executing < num_parallel) {
					        process();
					    }
					    
						
					} else {
						//console.log('count_unfinished', count_unfinished);
					    if (count_unfinished <= 0) {
					        callback(null, res);
					    }
					}
				}
			}
			
			var arr_to_call = clone(params) || [];
			//console.log('params', params);
			//console.log('arr_to_call', arr_to_call);
			//console.log('params ' + params);
			//console.log('fn ' + fn);
			arr_to_call.push(cb);

			// but if the function does not have a callback?
			//console.log('context ' + context);
			if (context) {
				fn.apply(context, arr_to_call);
			} else {
				fn.apply(that, arr_to_call);
			}
		}
		
		//console.log('** arr_functions_params_pairs.length ' + arr_functions_params_pairs.length);
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
    * Returns a [call_multiple_callback_functions()]{@link module:core/jsgui-lang-essentials.call_multiple_callback_functions} helper object. The object is an array with `go()` method added.
    * You can add the [call_multiple_callback_functions()]{@link module:core/jsgui-lang-essentials.call_multiple_callback_functions} tasks to the array, then call the go() method passing the callback function.
    * @func
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *
	*   var taskPlus = function (a, b, cb) { cb(null, a + b); };
	*   var taskMinus = function (a, b, cb) { cb(null, a - b); };
    *
	*   var fns = jsgui.Fns();
    *
	*   fns.push([taskPlus, [1, 2]]);
	*   fns.push([taskPlus, [3, 4]]);
	*   fns.push([taskMinus, [1, 2]]);
	*   fns.push([taskPlus, [10, 12]]);
    *
	*   fns.go(function (error, result) {
	*       console.log(result);  //  [3, 7, -1, 22]
	*   });
    *
    */
	var Fns = function() {
	    var fns = [];
	    fns.go = function(callback) {
	        call_multi(fns, callback);
	    }
	    return fns;
	}
	
    /**
    * Returns a name of the passed native constructor function. Possible return values are:
    * - "String"
    * - "Number"
    * - "Boolean"
    * - "Array"
    * - "Object"
    * - undefined (for all other arguments)
    *
    * @func
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *
    * jsgui.native_constructor_tof(String)  ==>  "String"
    *
    * jsgui.native_constructor_tof(Date)  ==>  undefined
    *
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
    * Gets value from the module's internal key/value storage.
    * @func
    * @param {string|*} key - the value key
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *
    * jsgui.set("a", 1);
    * jsgui.set(100, 2);
    *
    *
    * jsgui.get("a")  ==>  1
    * jsgui.get(100)  ==>  2
    *
    */
	var get = function(key) {
		return storage_map[key];
	}

    /**
    * Sets value for the module's internal key/value storage.
    * @func
    * @param {string|*} key - the value key
    * @param {*} value - the value 
    * @memberof module:core/jsgui-lang-essentials
    * @example
    *
    * jsgui.set("a", 1);
    * jsgui.set(100, 2);
    *
    *
    * jsgui.get("a")  ==>  1
    * jsgui.get(100)  ==>  2
    *
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


	// Doubly Linked List

	var Node = Class.extend({
		'init': function(spec) {
			// previous and next held as an array.
			
			// neighbours
			//  it could have no neighbours.
			//   a list will be empty, with no nodes.
			//   then it will have a node with no neighbours, which is both the first and the last node.
			//   then 2 nodes, 1 with each neighbour
			//   then 3 nodes, with the end nodes still having no neighbours.
			
			// This will just be for iterating through the list, adding, removing, doing basic operations.
			//  I may leave inefficient operations out, so the linked list gets used for what it is best at.
			//   But the inefficient/less efficient operations may be done to lower amounts, such as 12, by maintaining small LLs in data structures such as B+ trees.
			
			this.neighbours = spec.neighbours || [];
			
		    /**
            * The node's value.
            * @memberof module:core/jsgui-data-structures-doubly-linked-list.Doubly_Linked_List.Node
            * @instance
            * @name value
            */
		    // Adding and removing while maintaining an order?
			this.value = spec.value;
			
			
			// parent
			
		},
	    /**
        * Returns previous node in the list.
        * @memberof module:core/jsgui-data-structures-doubly-linked-list.Doubly_Linked_List.Node.prototype
        */
		'previous': function () {
			return this.neighbours[0];
		},
	    /**
        * Returns next node in the list.
        * @memberof module:core/jsgui-data-structures-doubly-linked-list.Doubly_Linked_List.Node.prototype
        */
		'next': function () {
			return this.neighbours[1];
		}
	});
	
	// Do these linked list nodes need to have anything?
	//  Just the means to insert their nodes etc?
	//   Then their nodes could be made to carry other data by other components.
	
	// Doubly_Linked_List could extend Node.
	//  That way it can be put in a tree, and used for holding the data in a tree.
	//  Want a B+ tree so that items can get put in correctly.
	
	// Having a whole tree made up of a doubly linked list, with other structures indexing it?
	//  Need some more fundamental data structures. The Collection and Data_Object will be good, but it will be good to store the fields in an appropriate object.
	
	
	// Ordered_KVS - may be a useful one.
	//  Would have the double linked list inside and map.
	
	
	// Mapped_Linked_List? would need to know what field to look at.
	
	var nodify = function(fn) {
		
		var res = function(val) {
			if (val instanceof Node) {
				return fn(val);
			} else {
				var node = new Node({'value': val});
				return fn(node);
			}
			
		};
		return res;
		
	}
	
	
    /**
    * Creates the doubly linked list.
    * @constructor
    * @classdesc Represents a doubly linked list.
    * @memberof module:core/jsgui-data-structures-doubly-linked-list
    */
	var Doubly_Linked_List = Class.extend({
		'init': function(spec) {
			// spec could be the initial items for the list.
			
			this.first = null;
			this.last = null;
			
			this.length = 0;
			// harder to maintain the length when nodes could be moved around the list.
			//  would need to be able to see if a node is in the list to begin with...
			//   so each node could have a container object, and if it is set to the list already when an insert is done, then the list will be able to keep track of
			//    its length. That would be better than having to count them.
			
		},
		
	    /**
        * Iterates over the list nodes calling the function for each node.
        * @param {function} callback - callback function: callback(node, stop)
        * - node: the list node
        * - stop: function to break iterations.
        * @memberof module:core/jsgui-data-structures-doubly-linked-list.Doubly_Linked_List.prototype
        * @example
        *
        * function getNodes(list) {
        *     var result = [];
        *     //
        *     list.each_node(function (node) { result.push(node); });
        *     //
        *     return result;
        * }
        *
        */
		'each_node': function (callback) {
			//console.log('each_node this.length ' + this.length);
			
			var node = this.first;
			var ctu = true;
			var stop = function() {
				ctu = false;
			};
			while (node && ctu) {
				callback(node, stop);
				node = node.neighbours[1];
			}
		},
		
	    /**
        * Iterates over the list nodes calling the function for each node's value.
        * @param {function} callback - callback function: callback(value, stop)
        * - value: the list node value
        * - stop: function to break iterations.
        * @memberof module:core/jsgui-data-structures-doubly-linked-list.Doubly_Linked_List.prototype
        * @example
        *
        * function getValues(list) {
        *     var result = [];
        *     //
        *     list.each(function (value) { result.push(value); });
        *     //
        *     return result;
        * }
        *
        */
		'each': function (callback) {
			this.each_node(function(node, stop) {
				callback(node.value, stop);
			});
		},
		
	    /**
        * Removes the node from the list.
        * @param {Node} node - node to remove
        * @memberof module:core/jsgui-data-structures-doubly-linked-list.Doubly_Linked_List.prototype
        * @example
        *
        * var list = new Doubly_Linked_List();
        * var node101 = new Doubly_Linked_List.Node({ value: 101 });
        *
        * list.push(node101);
        * list.remove(node101);
        *
        * // the list is empty now
        */
		'remove': (function (node) {
			
			// can not remove a value... have to remove a node.
			//  this will be more useful when there is a map of values.
			
			if (node.neighbours[0]) {
				node.neighbours[0].neighbours[1] = node.neighbours[1];
			} else {
				this.first = node.neighbours[1];
			}
			
			if (node.neighbours[1]) {
				node.neighbours[1].neighbours[0] = node.neighbours[0];
			} else {
				this.last = node.neighbours[0];
			}
			
			node.neighbours = [];
			
			if (node.parent == this) {
				delete node.parent;
				this.length--;
			}
			
		}),
		
		// check to see if the item is a 'node' object.
		//  if it is, can insert it as a node, otherwise create the node object and insert it.
		//   a bit like wrapping values in Data_Value.
		
	    /**
        * Inserts the node at the beginning of the list.
        * @param {Node|*} node - node to insert, or node value
        * @memberof module:core/jsgui-data-structures-doubly-linked-list.Doubly_Linked_List.prototype
        * @example
        *
        * var list = new Doubly_Linked_List();
        * var node101 = new Doubly_Linked_List.Node({ value: 101 });
        *
        * list.insert_beginning(node101);
        * list.insert_beginning(102);
        *
        * // list values: 102, 101
        */
		'insert_beginning': function (val) {
			if (val instanceof Node) {
				if (this.first == null) {
					this.first = val;
					this.last = val;
					val.neighbours = [];
					if (val.parent != this) {
						val.parent = this;
						this.length++;
					}
				} else {
					// insert it before first item.
					this.insert_before(val, this.first);
				}
				return val;
			} else {
				var node = new Node({'value': val});
				return this.insert_beginning(node);
			}
		},
		
		// could use a nodify function.
		//  or ensure_data_wrapper
		
	    /**
        * Inserts the node before the specified node.
        * @param {Node|*} val - node to insert, or node value
        * @param {Node} node - insert point
        * @memberof module:core/jsgui-data-structures-doubly-linked-list.Doubly_Linked_List.prototype
        * @example
        *
        * var list = new Doubly_Linked_List();
        * var node101 = new Doubly_Linked_List.Node({ value: 101 });
        *
        * list.push(node101);
        * list.insert_before(102, node101);
        *
        * // list values: 102, 101
        */
		'insert_before': function (val, node) {
			// check to see if the new value is a node.
			
			if (val instanceof Node) {
				val.neighbours = [node.neighbours[0], node];
				if (node.neighbours[0] == null) {
					this.first = val;
				} else {
					node.neighbours[0].neighbours[1] = val;
				}
				node.neighbours[0] = val;
				
				if (val.parent != this) {
					val.parent = this;
					this.length++;
				}
				return val;
			} else {
				var new_node = new Node({'value': val});
				return this.insert_before(new_node, node);
			}
			
		},
		
	    /**
        * Inserts the node after the specified node.
        * @param {Node|*} val - node to insert, or node value
        * @param {Node} node - insert point
        * @memberof module:core/jsgui-data-structures-doubly-linked-list.Doubly_Linked_List.prototype
        * @example
        *
        * var list = new Doubly_Linked_List();
        * var node101 = new Doubly_Linked_List.Node({ value: 101 });
        *
        * list.push(node101);
        * list.insert_after(102, node101);
        *
        * // list values: 101, 102
        */
		'insert_after': function (val, node) {
			if (val instanceof Node) {
				//console.log('insert after node ' + node);
				
				val.neighbours = [node, node.neighbours[1]];
				if (node.neighbours[1] == null) {
					this.last = val;
				} else {
					node.neighbours[1].neighbours[0] = val;
					
				}
				node.neighbours[1] = val;
				
				//node.neighbours[0].neighbours[1] = val;
				if (val.parent != this) {
					val.parent = this;
					this.length++;
				}
				return val;
			} else {
				var new_node = new Node({'value': val});
				return this.insert_after(new_node, node);
			}
		},
		// not wrapping the item in a node?
		
		// want one where we are not pushing nodes, but items stored in nodes.
		//  Perhaps this is a Data_Value?
		// Or a doubly_linked_node.
		
		// Doubly_Linked_Node could take the form [prev, item, next]
		//  [prev, item, key, next]? probably not
		
		//  Maybe we could put more private variables, such as 'neighbours' as a var within the init statement.
		
	    /**
        * Inserts the node at the end of the list.
        * @param {Node|*} val - node to insert, or node value
        * @memberof module:core/jsgui-data-structures-doubly-linked-list.Doubly_Linked_List.prototype
        * @example
        *
        * var list = new Doubly_Linked_List();
        * var node101 = new Doubly_Linked_List.Node({ value: 101 });
        *
        * list.push(node101);
        * list.push(102);
        *
        * // list values: 101, 102
        */
		'push': function (val) {
			
			if (val instanceof Node) {
				if (this.last == null) {
					this.insert_beginning(val);
				} else {
					return this.insert_after(val, this.last);
					/*
					var last = this.last;
					last.neighbours[1] = val;
					this.last = val;
					
					//console.log('val.parent ' + val.parent);
					//console.log('this ' + this);
					
					if (val.parent != this) {
						val.parent = this;
						this.length++;
					}
					*/
				}
				return val;
			} else {
				var new_node = new Node({'value': val});
				return this.push(new_node);
			}
			// the item gets wrapped in a node.?
			
			
			
		}
	});
	
    /**
    * The list node class.
    * @memberof module:core/jsgui-data-structures-doubly-linked-list.Doubly_Linked_List
    * @name Doubly_Linked_List.Node
    */

	Doubly_Linked_List.Node = Node;



	// Stiffarray

	var StiffArray = function (capacity) {

        // -----------------------------------------
        //              public interface:
        // -----------------------------------------

        /**
        * Creates the stiff array.
        * @constructor
        * @classdesc 
        * An array with pre-allocated items.
        * It seems that this array is usually faster (excluding IE javascript engine).
        * Probably there is a reason to provide IE implementation based on usual dynamic arrays.
        *
        * @alias StiffArray
        * @param {number} capacity - array capacity (maximum possible number of items).
        * @memberof  module:core/jsgui-data-structures-stiffarray
        * @example
        *
        * var array = new StiffArray(7);
        */

        var m_public = {
            /** 
            * internal storage array 
            * @type {Array}
            * @instance
            */
            items: new Array(capacity),
            /** 
            * items count
            * @type {number}
            * @instance
            */
            count: 0,
            /** 
            * Returns the first item
            * @instance
            */
            first: function () {
                if (this.count == 0) throw "StiffArray.first()";
                return this.items[0];
            },
            /** 
            * Returns the last item
            * @instance
            */
            last: function () {
                if (this.count == 0) throw "StiffArray.last()";
                return this.items[this.count - 1];
            },
            /** 
            * Adds item
            * @instance
            * @param {*} item - item to add
            */
            add: function (item) {
                if (this.count >= capacity) throw "StiffArray.add()";
                //
                this.items[this.count++] = item;
            },
            /** 
            * Adds all the items from the  source (to the end of the existing items)
            * @param {StiffArray} source - source stiff array
            * @instance
            */
            add_from: function (source) {
                if (this.count + source.count > capacity) throw "StiffArray.add_from()";
                //
                for (var i = 0; i < source.count; i++) this.items[this.count++] = source.items[i];
            },
            /** 
            * Inserts the item at the specified index.
            * @param {number} index - index for the new item (zero-based)
            * @param {*} item - item to insert
            * @instance
            */
            insert: function (index, item) {
                if ((index < 0) || (index > this.count)) throw "StiffArray.insert(): index";
                if (this.count >= capacity) throw "StiffArray.insert(): overflow";
                //
                for (var i = this.count; i > index; i--) this.items[i] = this.items[i - 1];
                this.items[index] = item;
                this.count++;
            },
            /** 
            * Removes the item at the specified index.
            * @param {number} index - index of the removing item (zero-based)
            * @instance
            */
            removeAt: function (index) {
                if ((index < 0) || (index >= this.count)) throw "StiffArray.removeAt()";
                //
                this.count--;
                for (var i = index; i < this.count; i++) this.items[i] = this.items[i + 1];
            },
            /** 
            * Removes the first item.
            * @instance
            */
            removeFirst: function () {
                this.removeAt(0);
            },
            /** 
            * Removes the last item.
            * @instance
            */
            removeLast: function () {
                this.removeAt(this.count - 1);
            },
            /** 
            * Replaces all the items to the subset of the other StiffArray items.
            * @param {StiffArray} source - source stiff array
            * @param {number} index - index of the first item of the subset
            * @param {number} count - number of items in the subset
            * @instance
            */
            copy_from: function (source, index, count) {
                for (var i = 0; i < count; i++) {
                    this.items[i] = source.items[i + index];
                }
                this.count = count;
            },
            /** 
            * Performs a binary search for the first occurrence of the item in the stiff array. Uses an usual JavaScript items comparison: item1 < item2.
            * @param {*} item - item to search
            * @returns {object} { found: f, index: i } object:
            * - found: true if the item is found, false otherwise
            * - index: index of the found item, or index to insert new (non-found) item
            * @instance
            * @example
            *
            * var arr = new StiffArray(10);
            * arr.add(1); // [0]
            * arr.add(2); // [1]
            * arr.add(2); // [2]
            * arr.add(3); // [3]
            * arr.add(3); // [4]
            * arr.add(3); // [5]
            *
            * arr.search_first(0)  ==>  { found: false, index: 0 }
            * arr.search_first(1)  ==>  { found: true, index: 0 }
            * arr.search_first(2)  ==>  { found: true, index: 1 }
            * arr.search_first(3)  ==>  { found: true, index: 3 }
            * arr.search_first(4)  ==>  { found: false, index: 6 }
            */
            search_first: function (item) {
                var cnt = this.count;
                var first = 0;
                while (cnt > 0) {
                    var step = Math.floor(cnt / 2);
                    var index = first + step;
                    if (this.items[index] < item) {
                        first = index + 1;
                        cnt -= (step + 1);
                    } else {
                        cnt = step;
                    }
                }
                //
                if (first < this.count) {
                    return { found: (this.items[first] == item), index: first };
                }
                return { found: false, index: first };
            },
            /** 
            * Performs a binary search for the last occurrence of the item in the stiff array. Uses an usual JavaScript items comparison: item1 >= item2.
            * @param {*} item - item to search
            * @returns {object} { found: f, index: i } object:
            * - found: true if the item is found, false otherwise
            * - index: index of the found item, or index to insert new (non-found) item
            * @instance
            * @example
            *
            * var arr = new StiffArray(10);
            * arr.add(1); // [0]
            * arr.add(2); // [1]
            * arr.add(2); // [2]
            * arr.add(3); // [3]
            * arr.add(3); // [4]
            * arr.add(3); // [5]
            *
            * arr.search_last(0)  ==>  { found: false, index: 0 }
            * arr.search_last(1)  ==>  { found: true, index: 0 }
            * arr.search_last(2)  ==>  { found: true, index: 2 }
            * arr.search_last(3)  ==>  { found: true, index: 5 }
            * arr.search_last(4)  ==>  { found: false, index: 6 }
            */
            search_last: function (item) {
                var cnt = this.count;
                var first = 0;
                while (cnt > 0) {
                    var step = Math.floor(cnt / 2);
                    var index = first + step;
                    if (item >= this.items[index]) {
                        first = index + 1;
                        cnt -= (step + 1);
                    } else {
                        cnt = step;
                    }
                }
                //
                if ((first > 0) && (first <= this.count)) {
                    if (this.items[first - 1] == item) {
                        return { found: true, index: first - 1 };
                    }
                }
                return { found: false, index: first };
            },
            /** 
            * Performs a binary search for the last occurrence of the prefix in the stiff array. Useful when the stiff array items are strings.
            *
            * A search_first_prefix() method is not implemented because search_first() can be used instead; but search_last() cannot be used instead of the search_last_prefix().
            *
            * @param {string} prefix - prefix to search
            * @returns {object} { found: f, index: i } object:
            * - found: true if the prefixed item is found, false otherwise
            * - index: index of the found item, or index to insert new (non-found) item
            * @instance
            * @example
            *
            * var arr = new StiffArray(10);
            * arr.add("111"); // [0]
            * arr.add("121"); // [1]
            * arr.add("122"); // [2]
            * arr.add("131"); // [3]
            *
            * arr.search_last_prefix("")  ==>  { found: true, index: 3 }
            *
            * arr.search_last_prefix("0")  ==>  { found: false, index: 0 }
            * arr.search_last_prefix("1")  ==>  { found: true, index: 3 }
            * arr.search_last_prefix("2")  ==>  { found: false, index: 4 }
            *
            * arr.search_last_prefix("10")  ==>  { found: false, index: 0 }
            * arr.search_last_prefix("11")  ==>  { found: true, index: 0 }
            * arr.search_last_prefix("12")  ==>  { found: true, index: 2 }
            * arr.search_last_prefix("13")  ==>  { found: true, index: 3 }
            * arr.search_last_prefix("14")  ==>  { found: false, index: 4 }
            *
            *
            *
            */
            search_last_prefix: function (prefix) {
                var prefix_length = prefix.length;
                //
                var check_prefix = function (item) {  
                    if (prefix_length > item.length) return false;
                    return (item.substr(0, prefix_length) == prefix)
                }
                //
                var cnt = this.count;
                var first = 0;
                while (cnt > 0) {
                    var step = Math.floor(cnt / 2);
                    var index = first + step;
                    var item = this.items[index];
                    if ((prefix > item) || check_prefix(item)) {
                        first = index + 1;
                        cnt -= (step + 1);
                    } else {
                        cnt = step;
                    }
                }
                //
                if ((first > 0) && (first <= this.count)) {
                    if (check_prefix(this.items[first - 1])) {
                        return { found: true, index: first - 1 };
                    }
                }
                return { found: false, index: first };
            },
            toString: function () {
                return this.items.slice(0, this.count).toString();
            }
        };


        // -----------------------------------------
        //       return the public interface:
        // -----------------------------------------

        return m_public;
    };




	// B+ tree

	var B_Plus_Node = function (nodeCapacity) {

        // -----------------------------------------
        //              public interface:
        // -----------------------------------------

        var m_public = {
            isLeaf: false,
            parent: null,
            keys: new StiffArray(nodeCapacity + 1),     // +1: to allow temporary owerflow
            children: new StiffArray(nodeCapacity + 2) // +2: children.length == keys.length + 1
        };

        // -----------------------------------------
        //                  debug ID:
        // -----------------------------------------

        //if (typeof (B_Plus_Tree_NextNodeDebugId) != "undefined") m_public.debugId = B_Plus_Tree_NextNodeDebugId++;

        // -----------------------------------------
        //       return the public interface:
        // -----------------------------------------

        return m_public;
    };

    // -----------------------------------------
    //
    //	              B_Plus_Leaf:
    //
    // -----------------------------------------

    // B+ tree leaf node:

    var B_Plus_Leaf = function (nodeCapacity) {

        // -----------------------------------------
        //              public interface:
        // -----------------------------------------

        var m_public = {
            isLeaf: true,
            parent: null,
            keys: new StiffArray(nodeCapacity + 1),
            values: new StiffArray(nodeCapacity + 1),
            //
            // leafs chain:
            prevLeaf: null,
            nextLeaf: null
        };

        // -----------------------------------------
        //                  debug ID:
        // -----------------------------------------

        //if (typeof(B_Plus_Tree_NextNodeDebugId) != "undefined") m_public.debugId = B_Plus_Tree_NextNodeDebugId++;

        // -----------------------------------------
        //       return the public interface:
        // -----------------------------------------

        return m_public;
    };


    // -----------------------------------------
    //
    //	              B_Plus_Tree:
    //
    // -----------------------------------------

    // B+ tree:

    // Using Crockford's Module Pattern.
    //  Need to be careful about how it is not initialized with a constructor and the 'new' keyword.

    /**
    *
    * @constructor
    * @classdesc
    *
    * This class is used for the findFirst/findNext iteration pattern:
    * - findFirst() gets the search criteria, finds the first item, store the search state to FindInfo
    * (including the criteria, found item, and all other related information), and returns the FindInfo.
    * - the client process the found item (from the returned FindInfo), and calls findNext() passing the FindInfo.
    * - findNext() uses the search state from FindInfo to find next item, updates the search state, and returns the updated FindInfo.
    * - the client process the found item, and calls findNext() again and again - until null will be returned.
    *
    * The FindInfo() constructor is intended for internal use only. You should call findFirst(), findNext(), findLast() etc. to get the FindInfo object.
    *
    * @--param {*} key
    * @--param {*} value
    * @--param {boolean} isPrefixSearch
    * @memberof module:core/jsgui-data-structures-b-plus-tree
    * 
    * @example
    * 
    *     // get all the key/value pairs:
    * 
    *     var findInfo = tree.findFirst();
    *     while (findInfo !== null) {
    *       console.log("key=" + findInfo.foundKey() + " value=" + findInfo.foundValue());
    *       findInfo = tree.findNext(findInfo);
    *     }
    * 
    * 
    *     // get all the key/value pairs in reverse order:
    * 
    *     var findInfo = tree.findLast();
    *     while (findInfo !== null) {
    *       console.log("key=" + findInfo.foundKey() + " value=" + findInfo.foundValue());
    *       findInfo = tree.findPrevious(findInfo);
    *     }
    * 
    * 
    *     // get all the values for "010" key:
    * 
    *     var findInfo = tree.findFirst("010");
    *     while (findInfo !== null) {
    *       console.log("key=" + findInfo.foundKey() + " value=" + findInfo.foundValue());
    *       findInfo = tree.findNext(findInfo);
    *     }
    * 
    * 
    *     // get all the key/value pairs prefixed by "01" in reverse order:
    * 
    *     var findInfo = tree.findLastPrefix("01");
    *     while (findInfo !== null) {
    *       console.log("key=" + findInfo.foundKey() + " value=" + findInfo.foundValue());
    *       findInfo = tree.findPrevious(findInfo);
    *     }
    * 
    * 
    * 
    */

    var FindInfo = function (key, value, isPrefixSearch) {
        isPrefixSearch = !!isPrefixSearch;
        var isKeyPresent = (key != undefined);
        var isValuePresent = (value != undefined);
        var prefixLength = 0;
        if (isPrefixSearch) {
            if (typeof (key) != "string") {
                isPrefixSearch = false;
            } else {
                prefixLength = key.length;
            }
        }
        //
        return {
            /* * 
            * key to find (if present)
            * @memberof module:core/jsgui-data-structures-b-plus-tree.FindInfo.prototype 
            */
            key: key,     // key to find (if present)
            /* * 
            * value to find (if present)
            * @memberof module:core/jsgui-data-structures-b-plus-tree.FindInfo.prototype 
            */
            value: value, // value to find (if present)
            /* * 
            * prefix search mode
            * @memberof module:core/jsgui-data-structures-b-plus-tree.FindInfo.prototype 
            */
            isPrefixSearch: isPrefixSearch, // prefix search mode
            /* * 
            * found leaf
            * @memberof module:core/jsgui-data-structures-b-plus-tree.FindInfo.prototype 
            */
            leaf: null,   // found leaf
            /* * 
            * found leaf item index
            * @memberof module:core/jsgui-data-structures-b-plus-tree.FindInfo.prototype 
            */
            index: -1,    // found leaf item index
            /* * 
            * is the search criteria contains key
            * @memberof module:core/jsgui-data-structures-b-plus-tree.FindInfo.prototype 
            */
            isKeyPresent: isKeyPresent, // function () { return this.key !== undefined; }, // is the search criteria contains key
            /* * 
            * is the search criteria contains value
            * @memberof module:core/jsgui-data-structures-b-plus-tree.FindInfo.prototype 
            */
            isValuePresent: isValuePresent, // function () { return this.value !== undefined; }, // is the search criteria contains value
            /** 
            * found items's key
            * @memberof module:core/jsgui-data-structures-b-plus-tree.FindInfo.prototype 
            */
            foundKey: function () { return this.leaf.keys.items[this.index]; }, // found items's key
            /** 
            * found item's value
            * @memberof module:core/jsgui-data-structures-b-plus-tree.FindInfo.prototype 
            */
            foundValue: function () { return this.leaf.values.items[this.index]; }, // found item's value
            //
            prefix_length: prefixLength, // prefix length
            check_prefix: function () {  // check the current key to match the prefix
                if (!isPrefixSearch) return false;
                if (this.index >= this.leaf.keys.count) return false;
                var keyToCheck = this.foundKey();
                if (this.prefix_length > keyToCheck.length) return false;
                return (keyToCheck.substr(0, this.prefix_length) == this.key)
            }
        };
    };



    var B_Plus_Tree = function (nodeCapacity) {

        // -----------------------------------------
        //            arguments processing:
        // -----------------------------------------

        if (nodeCapacity === undefined) nodeCapacity = 10;
        if (nodeCapacity < 4) throw "B_Plus_Tree(): node capacity must be >= 4";

        // -----------------------------------------
        //              public interface:
        // -----------------------------------------

        /**
        * Creates the B+ Tree.
        * @constructor
        * @classdesc 
        *
        * B+ Tree
        *
        * some B+ Tree description can be found here:
        *
        * {@link http://www.cs.berkeley.edu/~kamil/teaching/su02/080802.pdf}
        *
        * {@link http://baze.fri.uni-lj.si/dokumenti/B+%20Trees.pdf}
        *
        * sample tree classic presentation:
        *
        * <pre>
        * <code>
        *                 [] 7 []
        *                 /     \
        *                /       -----------------
        *               /                         \
        *              /                           \
        *        [] 3 [] 5 []                  [] 8 [] 8 []
        *        /    |     \                  /     \    \
        *       /     |      \                /       |    ----
        *      /      |       \              /         \       \
        *   {1,2}   {3,4}    {5,6,7}      {8,8,8}    {8,8}    {8,9}
        * </code>
        * </pre>
        *
        *   the diagram notation:
        *  - numbers are "keys" array items
        *  - "[]" figures are "children" array items
        *
        * @alias B_Plus_Tree
        * @param {number} [nodeCapacity=10] - tree node capacity (maximum possible number of items in each node).
        * @memberof  module:core/jsgui-data-structures-b-plus-tree
        * @example
        *
        * var tree = new B_Plus_Tree();
        */


        var m_public = {
            /** 
            * the tree root node
            * @type {B_Plus_Node|B_Plus_Leaf}
            * @instance
            */
            // tree root:
            root: new B_Plus_Leaf(nodeCapacity),
            //
            /** 
            * first leaf in the "all leaves" chain
            * @type {B_Plus_Leaf}
            * @instance
            */
            // leafs chain:
            firstLeaf: null,
            //
            /** 
            * last leaf in the "all leaves" chain
            * @type {B_Plus_Leaf}
            * @instance
            */
            lastLeaf: null,
            //
            // ---------------------
            //     editing:
            // ---------------------
            //
            /** 
            * clear the tree (remove all items)
            * @func
            * @instance
            */
            // clear the tree:
            clear: function () {
                p_Clear();
            },
            //

            /** 
            * insert key and value
            * @name insert
            * @func
            * @variation 1
            * @param {*} key
            * @param {*} value
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */

            /** 
            * insert key and value: key is arr[0], value is arr[1]; i.e. `insert([key, value])`
            * @func
            * @variation 2
            * @param {array} arr
            * @instance
            */

            // insert(key, value)
            // insert([key, value])
            insert: function (key, value) {
                if (arguments.length == 2) {
                    return p_Insert(key, value);
                } else {
                    return p_Insert(key[0], key[1]);
                }
            },
            //

            /** 
            * remove all values with given key
            * @name remove
            * @func
            * @param {*} key
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */

            /** 
            * remove one value occurrence
            * @func
            * @param {*} key
            * @param {*} value
            * @instance
            */


            // remove(key) - remove all values with given key
            // remove(key, value) - remove one value occurrence
            remove: function (key, value) {
                if (arguments.length == 2) {
                    return p_Remove(key, value);
                } else {
                    p_RemoveKey(key);
                }
            },
            //
            // ---------------------
            //       finding:
            // ---------------------
            //

            /** 
            * find the very first item
            * @func
            * @name findFirst
            * @variation 1
            * @returns {module:core/jsgui-data-structures-b-plus-tree.FindInfo} - find info
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */

            /** 
            * find the first item for the given key
            * @func
            * @name findFirst
            * @variation 2
            * @param {*} key
            * @returns {module:core/jsgui-data-structures-b-plus-tree.FindInfo} - find info
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */

            /** 
            * find the first key+value occurrence
            * @func
            * @name findFirst
            * @variation 3
            * @param {*} key
            * @param {*} value
            * @returns {module:core/jsgui-data-structures-b-plus-tree.FindInfo} - find info
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */

            // findFirst() - find the very first item
            // findFirst(key) - find the first item for the given key
            // findFirst(key, value) - find the first key+value occurrence
            //
            // returns the FindInfo object:
            //    key: key,     // key to find (if present)
            //    value: value, // value to find (if present)
            //
            //    leaf: null,   // the current found leaf
            //    index: -1,    // the current found index
            //
            //    foundKey():   // the current found key
            //    foundValue(): // the current found value
            //
            findFirst: function (key, value) {
                return p_FindFirst(key, value);
            },
            //
            /** 
            * find first key matching the prefix
            * @func
            * @param {string} prefix
            * @returns {module:core/jsgui-data-structures-b-plus-tree.FindInfo} - find info
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */
            // find first key matching the prefix:
            findFirstPrefix: function (prefix) {
                return p_FindFirst(prefix, undefined, true);
            },
            //
            /** 
            * find next search conditions occurence
            * @func
            * @param {module:core/jsgui-data-structures-b-plus-tree.FindInfo} findInfo
            * @returns {module:core/jsgui-data-structures-b-plus-tree.FindInfo} - find info
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */
            // find next search conditions occurence
            findNext: function (findInfo) {
                return p_FindNext(findInfo);
            },

            /** 
            * find the very last item
            * @func
            * @name findLast
            * @variation 1
            * @returns {module:core/jsgui-data-structures-b-plus-tree.FindInfo} - find info
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */

            /** 
            * find the last item for the given key
            * @func
            * @name findLast
            * @variation 2
            * @param {*} key
            * @returns {module:core/jsgui-data-structures-b-plus-tree.FindInfo} - find info
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */

            /** 
            *  find the last key+value occurrence
            * @func
            * @name findLast
            * @variation 3
            * @param {*} key
            * @param {*} value
            * @returns {module:core/jsgui-data-structures-b-plus-tree.FindInfo} - find info
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */


            //
            // findLast() - find the very last item
            // findLast(key) - find the last item for the given key
            // findLast(key, value) - find the last key+value occurrence
            findLast: function (key, value) {
                return p_FindLast(key, value);
            },
            //
            /** 
            * find last key matching the prefix
            * @func
            * @param {string} prefix
            * @returns {module:core/jsgui-data-structures-b-plus-tree.FindInfo} - find info
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */
            // find last key matching the prefix:
            findLastPrefix: function (prefix) {
                return p_FindLast(prefix, undefined, true);
            },
            //
            /** 
            * find previous search conditions occurence
            * @func
            * @param {module:core/jsgui-data-structures-b-plus-tree.FindInfo} findInfo
            * @returns {module:core/jsgui-data-structures-b-plus-tree.FindInfo} - find info
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */
            // find previous search conditions occurence
            findPrevious: function (findInfo) {
                return p_FindPrev(findInfo);
            },
            //
            // ---------------------
            // dictionary-like usage:
            // ---------------------
            //
            /** 
            * get one value by key (or null if the key not found)
            *
            * [getValue()]{@link module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree#getValue} and [setValue()]{@link module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree#setValue} methods pair provides a dictionary-like usage pattern.
            *
            * @func
            * @param {*} key
            * @instance
            * @example
            *
            * var tree = new B_Plus_Tree();
            * //
            * tree.setValue(101, "value 101");
            * tree.setValue(101, "value 101.2");
            *
            * tree.getValue(101) // "value 101.2"
            * tree.getValue(102) // null
            *
            */
            // get one value by key (or null):
            getValue: function (key) {
                return p_GetValue(key);
            },
            /** 
            * set one value by key (insert or update)
            *
            * [getValue()]{@link module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree#getValue} and [setValue()]{@link module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree#setValue} methods pair provides a dictionary-like usage pattern.
            *
            * @func
            * @param {*} key
            * @param {*} value
            * @instance
            * @example
            *
            * var tree = new B_Plus_Tree();
            * //
            * tree.setValue(101, "value 101");   // insert
            * tree.setValue(101, "value 101.2"); // update
            *
            * tree.getValue(101) // "value 101.2"
            * tree.getValue(102) // null
            *
            */
            // set one value by key (insert or update):
            setValue: function (key, value) {
                p_SetValue(key, value);
            },
            //
            //
            // ---------------------
            //   other functions:
            // ---------------------
            //

            /** 
            * count all values
            * @name count
            * @func
            * @variation 1
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */

            /** 
            * count values with the given key
            * @func
            * @variation 2
            * @param {*} key
            * @instance
            */

            // count() - count all values
            // count(key) - count values with the given key
            count: function (key) {
                if (arguments.length == 1) {
                    return p_CountKey(key);
                } else {
                    return p_Count();
                }
            },
            //

            /** 
            * returns the tree nodes capacity (also referred somewhere as "node order")
            * @func
            * @instance
            */
            // tree capacity:
            getCapacity: function () {
                return m_nodeMaxCount;
            },
            //
            // ---------------------
            // additional functions:
            // ---------------------
            //
            /** 
            * iterate through each key + value pair<br />
            * callback is `function(key, value)`
            * @func
            * @param {function} callback
            * @instance
            * @example
            *
            * var tree = new B_Plus_Tree();
            * //
            * tree.insert(101, "value 101");
            * tree.insert(102, "value 102");
            * tree.insert(103, "value 103");
            * //
            * tree.each(function(key, value) {
            *   console.log("key=" + key + " value=" + value);
            * });
            *
            */
            // iterate through each key + value pair
            // callback is function(key, value)
            'each': function (callback) {
                return p_each(callback);
            },
            //
            /** 
            * get all keys
            * @func
            * @instance
            * @example
            *
            * var tree = new B_Plus_Tree();
            * //
            * tree.insert(101, "value 101");
            * tree.insert(102, "value 102");
            * tree.insert(103, "value 103");
            * //
            * console.log(tree.keys()); // 101,102,103
            *
            */
            // get all keys
            'keys': function () {
                return p_keys();
            },
            //
            /** 
            * get all [key, value] pairs
            * @func
            * @instance
            * @example
            *
            * var tree = new B_Plus_Tree();
            * //
            * tree.insert(101, "value 101");
            * tree.insert(102, "value 102");
            * tree.insert(103, "value 103");
            * //
            * console.log(tree.keys_and_values()); // [101,"value 101"],[102,"value 102"],[103,"value 103"]
            *
            */
            // get all [key, value] pairs
            'keys_and_values': function () {
                return p_keys_and_values();
            },
            //
            //
            /** 
            * get keys and values by prefix
            * @func
            * @param {string} prefix
            * @instance
            * @example
            *
            * var tree = new B_Plus_Tree();
            * //
            * tree.insert("111", "value 111");
            * tree.insert("122", "value 122");
            * tree.insert("123", "value 123");
            * //
            * console.log(tree.get_by_prefix("12")); // ["122","value 122"],["123","value 123"]
            *
            */
            // get keys and values by prefix
            'get_by_prefix': function (prefix) {
                return p_get_by_prefix(prefix);
            },
            //
            /** 
            * get keys by prefix
            * @func
            * @param {string} prefix
            * @instance
            * @example
            *
            * var tree = new B_Plus_Tree();
            * //
            * tree.insert("111", "value 111");
            * tree.insert("122", "value 122");
            * tree.insert("123", "value 123");
            * //
            * console.log(tree.get_keys_by_prefix("12")); // "122","123"
            *
            */
            // get keys by prefix
            'get_keys_by_prefix': function (prefix) {
                return p_get_keys_by_prefix(prefix);
            },
            //
            /** 
            * get values related to the passed key
            * @func
            * @param {*} key
            * @instance
            * @example
            *
            * var tree = new B_Plus_Tree();
            * //
            * tree.insert("101", "value 101");
            * tree.insert("102", "value 102.1");
            * tree.insert("102", "value 102.2");
            * //
            * console.log(tree.get_values_by_key("102")); // "value 102.1","value 102.2"
            *
            */
            // get values at key...
            'get_values_by_key': function (key) {
                return p_get_values_by_key(key);
            }
        };

        // -----------------------------------------
        //              initialization:
        // -----------------------------------------

        m_public.firstLeaf = m_public.root;
        m_public.lastLeaf = m_public.root;

        // -----------------------------------------
        //              private variables:
        // -----------------------------------------

        var m_nodeMaxCount = nodeCapacity;
        var m_nodeMinCount = Math.floor(m_nodeMaxCount / 2);

        // -----------------------------------------
        //                 clear():
        // -----------------------------------------

        // clear the tree
        // (just create new empty root)
        var p_Clear = function () {
            m_public.root = new B_Plus_Leaf(m_nodeMaxCount);
            m_public.firstLeaf = m_public.root;
            m_public.lastLeaf = m_public.root;
        };

        // -----------------------------------------
        //                iterations:
        // -----------------------------------------

        var p_keys = function () {
            var res = [];
            _p_each_key(function (key) {
                res.push(key);
            });
            return res;
        }

        var p_keys_and_values = function () {
            var res = [];
            p_each(function (key, value) {
                res.push([key, value]);
            });
            return res;
        }

        var _p_each_key = function (callback) {
            var findInfo = p_FindFirst();
            while (findInfo != null) {
                var fk = findInfo.foundKey();
                callback(fk);
                findInfo = p_FindNext(findInfo);
            }
        }

        var p_each = function (callback) {
            var findInfo = p_FindFirst();

            var doStop = false;
            

            while (findInfo != null) {
                //var stop = 
                //console.log('doStop ' + doStop);
                var fk = findInfo.foundKey();
                var fv = findInfo.foundValue();
                // callback with the key and the value
                callback(fk, fv, function() {
                    //throw 'stop';
                    //console.log('stop!!!');
                    doStop = true;
                });
                //console.log('2) doStop ' + doStop);
                if (doStop) {
                    findInfo = null;
                } else {
                    findInfo = p_FindNext(findInfo);
                }
                
            }
        }

        // -----------------------------------------
        //                insert():
        // -----------------------------------------

        // insert (key, value) item to the tree
        var p_Insert = function (key, value) {
            //
            // search leaf to insert:
            var searchResult = searchLeaf(key);
            var leaf = searchResult.node;
            //
            // insert to the leaf:
            leaf.keys.insert(searchResult.index, key);
            leaf.values.insert(searchResult.index, value);
            //
            // if overflow:
            if (leaf.keys.count > m_nodeMaxCount) {
                if ((leaf.prevLeaf != null) && (leaf.prevLeaf.keys.count < m_nodeMaxCount) && (leaf.prevLeaf.parent == leaf.parent)) {
                    rotateAmongLeavesToLeft(leaf.prevLeaf, leaf);
                } else if ((leaf.nextLeaf != null) && (leaf.nextLeaf.keys.count < m_nodeMaxCount) && (leaf.nextLeaf.parent == leaf.parent)) {
                    rotateAmongLeavesToRight(leaf, leaf.nextLeaf);
                } else {
                    splitLeaf(leaf);
                }
            }
        };

        // split leaf to 2 leaves
        // (create right sibling)
        var splitLeaf = function (leaf) {
            var leftCount = m_nodeMinCount;
            var rightCount = leaf.keys.count - leftCount;
            //
            // create right leaf:
            var newRightLeaf = new B_Plus_Leaf(m_nodeMaxCount);
            newRightLeaf.parent = leaf.parent;
            //
            // copy to the right:
            newRightLeaf.keys.copy_from(leaf.keys, leftCount, rightCount);
            newRightLeaf.values.copy_from(leaf.values, leftCount, rightCount);
            //
            // update the left:
            leaf.keys.count = leftCount;
            leaf.values.count = leftCount;
            //
            // update leafs chain:
            newRightLeaf.nextLeaf = leaf.nextLeaf;
            if (newRightLeaf.nextLeaf != null) newRightLeaf.nextLeaf.prevLeaf = newRightLeaf;
            newRightLeaf.prevLeaf = leaf;
            leaf.nextLeaf = newRightLeaf;
            if (m_public.lastLeaf == leaf) m_public.lastLeaf = newRightLeaf;
            //
            // update parent:
            if (leaf.parent != null) {
                var leafIndex = calcChildIndex(leaf.parent, leaf);
                insertToParent(leaf.parent, newRightLeaf, newRightLeaf.keys.first(), leafIndex + 1);
            } else {
                createNewRoot(leaf, newRightLeaf, newRightLeaf.keys.first());
            }
        };

        // create new root
        var createNewRoot = function (nodeLeft, nodeRight, key) {
            // create new root containing nodeLeft and nodeRight children
            // btw nodeLeft and nodeRight can be leaves
            //
            // create the root node:
            var newRoot = new B_Plus_Node(m_nodeMaxCount);
            newRoot.keys.add(key);
            newRoot.children.add(nodeLeft);
            newRoot.children.add(nodeRight);
            //
            // update parent references:
            nodeLeft.parent = newRoot;
            nodeRight.parent = newRoot;
            //
            // update root reference:
            m_public.root = newRoot;
        };

        // insert newChildNode with key newChildFirstKey into the parentNode
        // the newChildNode inserts into the newChildIndex position in the children
        var insertToParent = function (parentNode, newChildNode, newChildFirstKey, newChildIndex) {
            //
            // insert child info:
            parentNode.keys.insert(newChildIndex - 1, newChildFirstKey); // -1: the related key is "before" the child
            parentNode.children.insert(newChildIndex, newChildNode);
            //
            // update parent reference:
            newChildNode.parent = parentNode;
            //
            // update parent if overflow:
            if (parentNode.keys.count > m_nodeMaxCount) {
                splitNode(parentNode);
            }
        };

        // split the overflowed node into 2 nodes
        var splitNode = function (node) {
            // split node: create right sibling
            //
            var newLeftCount = m_nodeMinCount;
            var newRightCount = m_nodeMaxCount - newLeftCount;
            var middleKey = node.keys.items[newLeftCount]; // key to move up
            //
            // create right node:
            var newRightNode = new B_Plus_Node(m_nodeMaxCount);
            newRightNode.keys.copy_from(node.keys, newLeftCount + 1, newRightCount);
            newRightNode.children.copy_from(node.children, newLeftCount + 1, newRightCount + 1);
            //
            // update the node:
            node.keys.count = newLeftCount;
            node.children.count = newLeftCount + 1;
            //
            // update children's parent:
            for (var i = 0; i < newRightNode.children.count; i++) newRightNode.children.items[i].parent = newRightNode;
            //
            // update parent:
            if (node.parent == null) {
                createNewRoot(node, newRightNode, middleKey);
            } else {
                var nodeIndex = calcChildIndex(node.parent, node);
                insertToParent(node.parent, newRightNode, middleKey, nodeIndex + 1);
            }
        };

        // -----------------------------------------
        //                remove():
        // -----------------------------------------

        // remove (key, value) item from the tree
        var p_Remove = function (key, value) {
            var searchResult = searchLeafValue(key, value);
            if (!searchResult.found) return false;
            //
            removeFromLeaf(searchResult.node, searchResult.index);
            return true;
        };

        // remove all the items with given key
        var p_RemoveKey = function (key) {
            while (true) {
                var searchResult = searchLeaf(key);
                if (!searchResult.found) break;
                //
                removeFromLeaf(searchResult.node, searchResult.index);
            }
        };

        // remove the item from index position of the leaf
        var removeFromLeaf = function (leaf, index) {
            leaf.keys.removeAt(index);
            leaf.values.removeAt(index);
            //
            // the item is removed; then update the tree if the leaf is underflowed:
            if (leaf.keys.count < m_nodeMinCount) {
                if ((leaf.prevLeaf != null) && (leaf.parent == leaf.prevLeaf.parent) && (leaf.prevLeaf.keys.count > m_nodeMinCount)) {
                    rotateAmongLeavesToRight(leaf.prevLeaf, leaf);
                } else if ((leaf.nextLeaf != null) && (leaf.parent == leaf.nextLeaf.parent) && (leaf.nextLeaf.keys.count > m_nodeMinCount)) {
                    rotateAmongLeavesToLeft(leaf, leaf.nextLeaf);
                } else {
                    mergeLeaf(leaf);
                }
            }
            return true;
        };

        // merge the underflowed leaf with left or right sibling 
        var mergeLeaf = function (leaf) {
            // if the leaf is root, then underflow is allowed:
            if (leaf.parent == null) {
                return;
            }
            //
            // calculate keys count in left and right sibling:
            var leftCount = m_nodeMaxCount + 1;
            var rightCount = m_nodeMaxCount + 1;
            if ((leaf.prevLeaf != null) && (leaf.prevLeaf.parent == leaf.parent)) {
                leftCount = leaf.prevLeaf.keys.count;
            }
            if ((leaf.nextLeaf != null) && (leaf.nextLeaf.parent == leaf.parent)) {
                rightCount = leaf.nextLeaf.keys.count;
            }
            //
            // select sibling to merge:
            if (leftCount < rightCount) {
                if (leftCount + leaf.keys.count > m_nodeMaxCount) throw "B_Plus_Tree.mergeLeaf(): leftCount";
                mergeLeaves(leaf.prevLeaf, leaf);
            } else {
                if (rightCount + leaf.keys.count > m_nodeMaxCount) throw "B_Plus_Tree.mergeLeaf(): rightCount";
                mergeLeaves(leaf, leaf.nextLeaf);
            }
        };

        // merge 2 leaf nodes: leafLeft and leafRight
        var mergeLeaves = function (leafLeft, leafRight) { // merge (left + right) -> left
            //
            // add right to left:
            leafLeft.keys.add_from(leafRight.keys);
            leafLeft.values.add_from(leafRight.values);
            //
            // update leafs chain:
            leafLeft.nextLeaf = leafRight.nextLeaf;
            if (leafLeft.nextLeaf != null) leafLeft.nextLeaf.prevLeaf = leafLeft;
            if (m_public.lastLeaf == leafRight) m_public.lastLeaf = leafLeft;
            //
            // remove right from parent:
            var parent = leafRight.parent;
            var leafRightIndex = calcChildIndex(parent, leafRight);
            parent.keys.removeAt(leafRightIndex - 1);
            parent.children.removeAt(leafRightIndex);
            //
            // update parent if underflow:
            if (parent.keys.count < m_nodeMinCount) {
                mergeNode(parent);
            };
        };

        // fix underflower index (non-leaf) node:
        // rotate among sibling, or merge with sibling
        var mergeNode = function (node) { // merge the node with sibling
            var parent = node.parent;
            //
            // remove root if the node became empty root:
            if (node.parent == null) {
                if (node.keys.count == 0) {
                    m_public.root = node.children.items[0];
                    m_public.root.parent = null;
                }
                return;
            }
            //
            // find left and right siblings:
            var nodeIndex = calcChildIndex(parent, node);
            var leftSibling = (nodeIndex > 0) ? parent.children.items[nodeIndex - 1] : null;
            var rightSibling = ((nodeIndex + 1) < parent.children.count) ? parent.children.items[nodeIndex + 1] : null;
            //
            // try rotation:
            if ((leftSibling != null) && (leftSibling.keys.count > m_nodeMinCount)) {
                rotateAmongNodesToRight(leftSibling, node);
                return;
            }
            if ((rightSibling != null) && (rightSibling.keys.count > m_nodeMinCount)) {
                rotateAmongNodesToLeft(node, rightSibling);
                return;
            }
            //
            // calculate siblings key count:
            var leftCount = m_nodeMaxCount + 1;
            var rightCount = m_nodeMaxCount + 1;
            if (leftSibling != null) {
                leftCount = leftSibling.keys.count;
            }
            if (rightSibling != null) {
                rightCount = rightSibling.keys.count;
            }
            //
            // select sibling to merge:
            if (leftCount < rightCount) {
                if (leftSibling == null) throw "B_Plus_Tree.mergeNode(): leftSibling";
                mergeNodes(leftSibling, node, nodeIndex);
            } else {
                if (rightSibling == null) throw "B_Plus_Tree.mergeNode(): rightSibling";
                mergeNodes(node, rightSibling, nodeIndex + 1);
            }
        };

        // merge 2 index (non-leaf) nodes nodeLeft and nodeRight into one node
        // the nodeRightIndex is the nodeRight index in parent's children array;
        // the nodeRightIndex is known in caller, so it's not needed to calculate it here
        var mergeNodes = function (nodeLeft, nodeRight, nodeRightIndex) { // merge (left + right) -> left
            var parent = nodeLeft.parent;
            //
            // update right children parent:
            for (var i = 0; i < nodeRight.children.count; i++) nodeRight.children.items[i].parent = nodeLeft;
            //
            // move down key from parent:
            nodeLeft.keys.add(nodeLeft.parent.keys.items[nodeRightIndex - 1]);
            //
            // add right to left:
            nodeLeft.keys.add_from(nodeRight.keys);
            nodeLeft.children.add_from(nodeRight.children);
            //
            // remove right from parent:
            parent.keys.removeAt(nodeRightIndex - 1);
            parent.children.removeAt(nodeRightIndex);
            //
            // update parent if underflow:
            if (parent.keys.count < m_nodeMinCount) {
                mergeNode(parent);
            };
        };


        // -----------------------------------------
        //          findFirst() / findNext():
        // -----------------------------------------

        // FindInfo nested class
        // contains the search criteria (key, value) and search result (leaf, index)


        // find first item matching (key, value) search criteria
        // use cases:
        // p_FindFirst()
        // p_FindFirst(key)
        // p_FindFirst(key, value)
        // p_FindFirst(key, undefined, true)
        var p_FindFirst = function (key, value, isPrefixSearch) {
            var findInfo = new FindInfo(key, value, isPrefixSearch);
            //
            if (findInfo.isKeyPresent) {
                if (findInfo.isPrefixSearch && findInfo.isValuePresent) throw "B_Plus_Tree.p_FindFirst(): arguments error: isPrefixSearch, but value is present";
                //
                var searchResult = findInfo.isValuePresent ? searchLeafValue(key, value) : searchLeaf(key);
                findInfo.leaf = searchResult.node;
                findInfo.index = searchResult.index;
                if (!searchResult.found) {
                    if (!findInfo.check_prefix()) {
                        return null;
                    }
                }
            } else {
                if (findInfo.isValuePresent) throw "B_Plus_Tree.findFirst(): arguments error: key is not present, but value is present";
                //
                findInfo.leaf = m_public.firstLeaf;
                findInfo.index = 0;
                if (findInfo.leaf.keys.count <= 0) return null;
            }
            //
            return findInfo;
        };

        // find last item matching (key, value) search criteria
        // use cases:
        // p_FindLast()
        // p_FindLast(key)
        // p_FindLast(key, value)
        // p_FindLast(key, undefined, true)
        var p_FindLast = function (key, value, isPrefixSearch) {
            var findInfo = new FindInfo(key, value, isPrefixSearch);
            //
            if (findInfo.isKeyPresent) {
                if (findInfo.isPrefixSearch && findInfo.isValuePresent) throw "B_Plus_Tree.p_FindLast(): arguments error: isPrefixSearch, but value is present";
                //
                if (findInfo.isPrefixSearch) {
                    var searchResult = searchLastLeafByPrefix(key);
                    findInfo.leaf = searchResult.node;
                    findInfo.index = searchResult.index;
                    if (!searchResult.found) {
                        return null;
                    }
                } else {
                    var searchResult = findInfo.isValuePresent ? searchLastLeafValue(key, value) : searchLastLeaf(key);
                    findInfo.leaf = searchResult.node;
                    findInfo.index = searchResult.index;
                    if (!searchResult.found) {
                        return null;
                    }
                }
            } else {
                if (findInfo.isValuePresent) throw "B_Plus_Tree.findLast(): arguments error: key is not present, but value is present";
                //
                findInfo.leaf = m_public.lastLeaf;
                findInfo.index = findInfo.leaf.keys.count - 1;
                if (findInfo.index < 0) return null;
            }
            //
            return findInfo;
        };

        // move to next item
        var findGoToNext = function (findInfo) {
            findInfo.index++;
            if (findInfo.index >= findInfo.leaf.keys.count) {
                findInfo.leaf = findInfo.leaf.nextLeaf;
                findInfo.index = 0;
            }
            //
            return (findInfo.leaf != null);
        };

        // move to previous item
        var findGoToPrev = function (findInfo) {
            findInfo.index--;
            if (findInfo.index < 0) {
                findInfo.leaf = findInfo.leaf.prevLeaf;
                if (findInfo.leaf == null) return false;
                findInfo.index = findInfo.leaf.keys.count - 1;
            }
            //
            return true;
        };

        // find next item after the findInfo's found item, matching the findInfo's search criteria
        var p_FindNext = function (findInfo) {
            while (true) {
                if (!findGoToNext(findInfo)) return null;
                //
                if (findInfo.isPrefixSearch) {
                    if (!findInfo.check_prefix()) return null;
                } else {
                    if (findInfo.isKeyPresent && (findInfo.key != findInfo.foundKey())) return null;
                }
                //
                if (findInfo.isValuePresent) {
                    if (findInfo.value == findInfo.foundValue()) return findInfo;
                } else {
                    return findInfo;
                }
            }
        };

        // find previous item after the findInfo's found item, matching the findInfo's search criteria
        var p_FindPrev = function (findInfo) {
            while (true) {
                if (!findGoToPrev(findInfo)) return null;
                //
                //if (findInfo.isKeyPresent && (findInfo.key != findInfo.foundKey())) return null;
                if (findInfo.isPrefixSearch) {
                    if (!findInfo.check_prefix()) return null;
                } else {
                    if (findInfo.isKeyPresent && (findInfo.key != findInfo.foundKey())) return null;
                }
                //
                if (findInfo.isValuePresent) {
                    if (findInfo.value == findInfo.foundValue()) return findInfo;
                } else {
                    return findInfo;
                }
            }
        };

        // -----------------------------------------
        //          additional methods:
        // -----------------------------------------

        // get values at key...
        //  make this always return an array, even if there is one item.
        //  will make interpretation easier.

        // will move the prefix search code into here.

        // iterate nodes by prefix... that may be a more efficient way of doing this, may be less efficient, it assigns one more thing I think.
        //  possibly a fast iterator?

        //  definitely would be easier code, I think it would be worth doing.
        //  could also be given its own check function.
        //   maybe gets given starting location.+


        var p_get_values_by_key = function (key) {
            var res = [];
            var findInfo = p_FindFirst(key);
            while (findInfo != null) {
                res.push(findInfo.foundValue());
                findInfo = p_FindNext(findInfo);
            }
            return res;
        }

        // get keys and values by prefix

        var p_get_by_prefix = function (prefix) {
            var res = [];
            var findInfo = m_public.findFirstPrefix(prefix);
            while (findInfo != null) {
                res.push([findInfo.foundKey(), findInfo.foundValue()]);
                findInfo = m_public.findNext(findInfo);
            }
            return res;
        }

        // get keys by prefix

        var p_get_keys_by_prefix = function (prefix) {
            var res = [];
            var findInfo = m_public.findFirstPrefix(prefix);
            while (findInfo != null) {
                res.push(findInfo.foundKey());
                findInfo = m_public.findNext(findInfo);
            }
            return res;
        }


        // -----------------------------------------
        //          getValue() / setValue():
        // -----------------------------------------

        // get value for the given key
        var p_GetValue = function (key) {
            var searchResult = searchLeaf(key);
            if (!searchResult.found) return null;
            return searchResult.node.values.items[searchResult.index];
        };

        // set value for the given key
        var p_SetValue = function (key, value) {
            var searchResult = searchLeaf(key);
            if (searchResult.found) {
                removeFromLeaf(searchResult.node, searchResult.index);
            }
            //
            p_Insert(key, value);
        };

        // -----------------------------------------
        //                 count():
        // -----------------------------------------

        // count all the value items in the tree
        // is that an easier way to iterate?

        var p_Count = function () {
            var result = 0;
            //
            var leaf = m_public.firstLeaf;
            while (leaf != null) {
                result += leaf.keys.count;
                leaf = leaf.nextLeaf;
            }
            //
            return result;
        };

        // count the value items with given key in the tree
        var p_CountKey = function (key) {
            var result = 0;
            //
            var findInfo = m_public.findFirst(key);
            while (findInfo != null) {
                result++;
                findInfo = m_public.findNext(findInfo);
            }
            //
            return result;
        };

        // -----------------------------------------
        //                 toText():
        // -----------------------------------------

        // returns multi-line text presentation for the tree

        /*
	    
        var _p_ToText = function () {
        var result = m_public.root.toText("");
        //
        if (typeof (B_Plus_Tree_NextNodeDebugId) != "undefined") {
        // print leafs chain:
        result += "\r\n";
        var leaf = m_public.firstLeaf;
        while (leaf != null) {
        result += "(" + leaf.debugId + ") ";
        leaf = leaf.nextLeaf;
        }
        }
        //
        return result;
        };

        */

        // -----------------------------------------
        //                rotations:
        // -----------------------------------------

        // "rotation" means moving items between siblings instead of split/merge

        // the following conditions are true when rotation is called:
        // leftNode.parent == rightNode.parent
        // leftLeaf.parent == rightLeaf.parent

        // move a key item to the left between leftNode and rightNode index (non-leaf) nodes
        // right node first item -> parent
        // parent item -> left node
        var rotateAmongNodesToLeft = function (leftNode, rightNode) {
            // move item from rightNode to LeftNode
            //
            var parent = rightNode.parent;
            var rightIndex = calcChildIndex(parent, rightNode);
            //
            // move the key:
            leftNode.keys.add(parent.keys.items[rightIndex - 1]); // copy the key down
            parent.keys.items[rightIndex - 1] = rightNode.keys.first(); // copy the key up
            rightNode.keys.removeFirst(); // remove from right
            //
            // move the child reference:
            rightNode.children.first().parent = leftNode; // update parent reference
            leftNode.children.add(rightNode.children.first()); // copy to left
            rightNode.children.removeFirst(); // remove from right
        };

        // move a key item to the right between leftNode and rightNode index (non-leaf) nodes
        // left node last item -> parent
        // parent item -> right node
        var rotateAmongNodesToRight = function (leftNode, rightNode) {
            // move item from leftNode to rightNode
            //
            var parent = rightNode.parent;
            var rightIndex = calcChildIndex(parent, rightNode);
            //
            // move the key:
            rightNode.keys.insert(0, parent.keys.items[rightIndex - 1]); // copy the key down
            parent.keys.items[rightIndex - 1] = leftNode.keys.last(); // copy the key up
            leftNode.keys.removeLast(); // remove from left
            //
            // move the child reference:
            rightNode.children.insert(0, leftNode.children.last()); // copy to right
            rightNode.children.first().parent = rightNode; // update parent reference
            leftNode.children.removeLast(); // remove from left
        };

        // move an item to the left between leftLeaf and rightLeaf leaf nodes
        // right leaf first item -> left leaf
        var rotateAmongLeavesToLeft = function (leftLeaf, rightLeaf) {
            // move item from rightLeaf to leftLeaf
            //
            var rightIndex = calcChildIndex(rightLeaf.parent, rightLeaf);
            //
            // copy to left:
            leftLeaf.keys.add(rightLeaf.keys.first());
            leftLeaf.values.add(rightLeaf.values.first());
            //
            // remove from right:
            rightLeaf.keys.removeFirst();
            rightLeaf.values.removeFirst();
            //
            // update parent:
            rightLeaf.parent.keys.items[rightIndex - 1] = rightLeaf.keys.first();
        };

        // move an item to the right between leftLeaf and rightLeaf leaf nodes
        // left leaf last item -> right leaf
        var rotateAmongLeavesToRight = function (leftLeaf, rightLeaf) {
            // move from leftLeaf to rightLeaf
            //
            var rightIndex = calcChildIndex(rightLeaf.parent, rightLeaf);
            //
            // copy to right:
            rightLeaf.keys.insert(0, leftLeaf.keys.last());
            rightLeaf.values.insert(0, leftLeaf.values.last());
            //
            // remove from left:
            leftLeaf.keys.removeLast();
            leftLeaf.values.removeLast();
            //
            // update parent:
            rightLeaf.parent.keys.items[rightIndex - 1] = rightLeaf.keys.first();
        };

        // -----------------------------------------
        //             internal searches:
        // -----------------------------------------

        // short description: returns the "child" index in the "node"
        // long description: calculates the "child" node index in the "node.children" array
        // (usually node == child.paren)
        var calcChildIndex = function (node, child) {
            var key = child.keys.first();
            var searchResult = node.keys.search_first(key);
            if (!searchResult.found) {
                if (node.children.items[searchResult.index] != child) throw "B_PlusTree.calcChildIndex(): 1";
                return searchResult.index;
            }
            //
            var index = searchResult.index;
            for (; ; ) {
                if (node.children.items[index] == child) return index;
                //
                index++;
                if (index >= node.children.count) break;
                if (node.keys.items[index - 1] != key) break;
            }
            throw "B_PlusTree.calcChildIndex(): 2";
        };

        // returns leaf node containing an item with the given key
        var searchLeaf = function (key) {
            // 
            var doSearchLeaf = function (node, key) {
                var searchResult = node.keys.search_first(key);
                //
                if (node.isLeaf) {
                    return { node: node, found: searchResult.found, index: searchResult.index };
                }
                //
                if (searchResult.found) {
                    // illustration: [left child] key [right child]
                    // both children (left and right i.e. before and after the key) can contain the key
                    //
                    // try the left child first:
                    var resultLeft = doSearchLeaf(node.children.items[searchResult.index], key);
                    if (resultLeft.found) return resultLeft;
                    //
                    // try the right child
                    return doSearchLeaf(node.children.items[searchResult.index + 1], key);
                } else {
                    // the pointed key is greater than the searched key. Only left child can be considered:
                    return doSearchLeaf(node.children.items[searchResult.index], key);
                }
            };
            //
            return doSearchLeaf(m_public.root, key);
        };

        // returns last leaf node containing an item with the given key
        var searchLastLeaf = function (key) {
            // 
            var doSearchLastLeaf = function (node, key) {
                var searchResult = node.keys.search_last(key);
                //
                if (node.isLeaf) {
                    return { node: node, found: searchResult.found, index: searchResult.index };
                }
                //
                if (searchResult.found) {
                    // illustration: [left child] key [right child]
                    // both children (left and right i.e. before and after the key) can contain the key
                    //
                    // try the right child first:
                    var resultRight = doSearchLastLeaf(node.children.items[searchResult.index + 1], key);
                    if (resultRight.found) return resultRight;
                    //
                    // try the left child
                    return doSearchLastLeaf(node.children.items[searchResult.index], key);
                } else {
                    // the pointed key is greater than the searched key. Only left child can be considered:
                    return doSearchLastLeaf(node.children.items[searchResult.index], key);
                }
            };
            //
            return doSearchLastLeaf(m_public.root, key);
        };

        // returns last leaf node containing an item with the given prefix
        var searchLastLeafByPrefix = function (prefix) {
            // 
            var doSearchLastLeafByPrefix = function (node, prefix) {
                var searchResult = node.keys.search_last_prefix(prefix);
                //
                if (node.isLeaf) {
                    return { node: node, found: searchResult.found, index: searchResult.index };
                }
                //
                if (searchResult.found) {
                    // illustration: [left child] key [right child]
                    // both children (left and right i.e. before and after the key) can contain the prefix
                    //
                    // try the right child first:
                    var resultRight = doSearchLastLeafByPrefix(node.children.items[searchResult.index + 1], prefix);
                    if (resultRight.found) return resultRight;
                    //
                    // try the left child
                    return doSearchLastLeafByPrefix(node.children.items[searchResult.index], prefix);
                } else {
                    // the pointed key is greater than the searched prefix. Only left child can be considered:
                    return doSearchLastLeafByPrefix(node.children.items[searchResult.index], prefix);
                }
            };
            //
            return doSearchLastLeafByPrefix(m_public.root, prefix);
        };

        // returns leaf node containing an item with the given key and value
        var searchLeafValue = function (key, value) {
            // search the key:
            var searchResult = searchLeaf(key);
            if (!searchResult.found) return searchResult;
            //
            // search the value (if there are several the same keys):
            var valueFound = false;
            var leaf = searchResult.node;
            var index = searchResult.index;
            for (; ; ) {
                if (index >= leaf.values.count) {
                    leaf = leaf.nextLeaf;
                    if (leaf == null) break;
                    index = 0;
                }
                if (leaf.keys.items[index] != key) break;
                if (leaf.values.items[index] == value) {
                    valueFound = true;
                    break;
                }
                index++;
            }
            //
            return { node: leaf, found: valueFound, index: index };
        };

        // returns last leaf node containing an item with the given key and value
        var searchLastLeafValue = function (key, value) {
            // search the key:
            var searchResult = searchLastLeaf(key);
            if (!searchResult.found) return searchResult;
            //
            // search the value (if there are several the same keys):
            var valueFound = false;
            var leaf = searchResult.node;
            var index = searchResult.index;
            //var foundIndex = 0;
            for (; ; ) {
                if (index < 0) {
                    leaf = leaf.prevLeaf;
                    if (leaf == null) break;
                    index = leaf.values.count - 1;
                }
                if (leaf.keys.items[index] != key) break;
                if (leaf.values.items[index] == value) {
                    valueFound = true;
                    break;
                }
                index--;
            }
            //
            return { node: leaf, found: valueFound, index: index };
        };

        // -----------------------------------------
        //       return the public interface:
        // -----------------------------------------

        return m_public;
    };

    B_Plus_Tree.FindInfo = FindInfo;




	// jsgui-data-structures.js

	var Sorted_KVS = Class.extend({
		'init': function(spec) {
			spec = spec || {};
			// both a dict and a BTree
			//  that is used in this case because the BTree only stores string keys.
			//  the improved B+ tree will have value objects/pointers within them
			
			if (is_defined(spec.unique_keys)) this.unique_keys = spec.unique_keys;
			//this.tree = new B_Plus_Tree(12); // order 12
			this.tree = B_Plus_Tree(12); // order 12
			
			
			//this.dict = {};
			// likely to make the dict refer to the tree node
			
			
		},

	    /**
        * Clears the storage, removing all the key/value pairs.
        * @memberof module:core/jsgui-data-structures.Sorted_KVS
        * @instance
        */
		'clear': function () {
			this.tree.clear();
			//this.dict = {};
		},

	    /**
        * Puts the key/value pairs from the passed object into the storage.
        * @func
        * @param {object} obj
        * @memberof module:core/jsgui-data-structures.Sorted_KVS
        * @instance
        * @example
        * var kvs = new Data_Structures.Sorted_KVS();
        * kvs.put({ a: 1});
        * kvs.put({ b: 2, c: 3});
        */
		'put': mapify(function (key, value) {
			// inserting a bunch of things at once... could that be done more efficiently, such as in one traversal?
			//  sort the items, then can skip through the tree a bit quicker?
			
			
			var insert_res = this.tree.insert(key, value);
			// with tree.insert - nice if we can keep the treenode as a result.
			//  the tree does not store objects in the node.
			//   could make the tree node hold a reference to the object?
			
			
			
			
			//console.log('put insert_res ' + insert_res);
			//this.dict[key] = value;
		}),


	    /**
        * Removes from the storage values for the passed key.
        * @func
        * @param {*} key
        * @memberof module:core/jsgui-data-structures.Sorted_KVS
        * @instance
        */
		'out': function (key) {
			//console.log('key ' + key);
			//
		
			this.tree.remove(key);
			//console.log('this.tree.keys_and_values() ' + stringify(this.tree.keys_and_values()));
			//throw '2.stop';
			//delete this.dict[key];
		},

	    /**
        * Gets from the storage values for the passed key, returns the values array.
        * @func
        * @param {*} key
        * @memberof module:core/jsgui-data-structures.Sorted_KVS
        * @instance
        */
		'get': function (key) {
			//console.log('Sorted_KVS get');
			//console.log('key ' + stringify(key));

			
			// get all nodes with that key
			
			//var tree_res = this.tree.
			//console.log('this.tree.keys() ' + stringify(this.tree.keys()));
			//throw ('stop');
			
			//return 
			// if this is treating the keys as unique it will just return 1 item or undefined / null.
			// otherwise it returns array on n items
			
			// don't want KVPs
			
			return this.tree.get_values_by_key(key);
			
			//return this.dict[key];
		},


	    /**
        * Returns true if the storage contains the passed key.
        * @func
        * @param {*} key
        * @memberof module:core/jsgui-data-structures.Sorted_KVS
        * @instance
        */
		'has': function (key) {
			//return (typeof this.dict[key] !== 'undefined');
			
			return this.key_count(key) > 0;
			
		},
		'get_cursor': function() {
			//var res = new KSVS_Cursor(this);
			//res.move_first();
			//return res;
		},


	    /**
        * Returns an array of all the keys in the storage.
        * @func
        * @memberof module:core/jsgui-data-structures.Sorted_KVS
        * @instance
        */
		'keys': function () {
			
			return this.tree.keys();
			
			//return this.tree.keys();
		},

	    /**
        * Returns an array of [key, value] arrays for all the items in the storage.
        * @func
        * @memberof module:core/jsgui-data-structures.Sorted_KVS
        * @instance
        */
		'keys_and_values': function () {
			return this.tree.keys_and_values();
		},
		
		/*
		'values': function() {
			var keys = this.keys();
			var res = [];
			var that = this;
			console.log('keys.length ' + keys.length );
			console.log('keys ' + jsgui.stringify(keys));
			
			each(keys, function(i, v) {
				res.push(that.dict[v]);
			});
			return res;
		},
		*/
		
	    /**
        * Returns an amount of all the keys in the storage.
        * @name key_count
        * @func
        * @memberof module:core/jsgui-data-structures.Sorted_KVS
        * @instance
        */

	    /**
        * Returns an amount of the passed key occurrences in the storage.
        * @func
        * @param {*} key
        * @memberof module:core/jsgui-data-structures.Sorted_KVS
        * @instance
        */
		'key_count': function (key) {
			
			if (is_defined(key)) {
				return this.tree.count(key);
			} else {
				return this.tree.count();
			}
			
			// also want to do it for a particular key
			
			
		},
		
		/*
		
		'get_keys_by_prefix': function(prefix) {
			var leaf = this.tree.searchLeaf(prefix);
			var node = leaf.node;
			var res = [];
			var index = leaf.index;
			var plen = prefix.length;
			var check_prefix = function(key) {
				if (plen > key.length) return false;
				return (key.substr(0, plen) == prefix)
			}
			var has_prefix = true;
	        while (node != null && has_prefix) {
	        	// what is the original index?
	        	var key = node.keys.items[index];
	        	console.log('key ' + key);
	        	//var value = node.values.items[index];
	        	has_prefix = check_prefix(key);
	        	if (has_prefix) {
	        		if (index >= node.keys.count) {
			        	res.push(key);
			            node = node.nextLeaf;
		        		index = 0;
		        	} else {
			        	res.push(key);
		        		index++;
		        	}
	        	}
	        }
	        return res;
		},
		
		*/
		
	    /**
        * Returns an array of the keys that start from the passed prefix.
        * @func
        * @param {string} prefix
        * @memberof module:core/jsgui-data-structures.Sorted_KVS
        * @instance
        */
		'get_keys_by_prefix': function (prefix) {
			return this.tree.get_keys_by_prefix(prefix);
		},
		
	    /**
        * Invokes the callback function for each item in the storage: `callback(key, value)`
        * @func
        * @param {function} callback
        * @memberof module:core/jsgui-data-structures.Sorted_KVS
        * @instance
        */
		'each': function (callback) {
			// iterate through every item
			//  key, value
			return this.tree.each(callback);
		},
		
	    /**
        * Returns an array of [key, value] arrays for the keys that start from the passed prefix.
        * @func
        * @param {string} prefix
        * @memberof module:core/jsgui-data-structures.Sorted_KVS
        * @instance
        */
		'get_by_prefix': function (prefix) {
			
	        return this.tree.get_by_prefix(prefix);
		}
	});



    /**
    * Creates the Ordered_KVS.
    * @constructor
    * @classdesc Represents an unsorted key/value pairs storage, but with fast access by the key. The each()-based operations 
    * (e.g. keys(), values() etc.) returns the items in the same order as they was added. But the get() and out() operations 
    * use a fast key access. Unfortunately these operation works with the last added value only if several values have equal keys.
    * @memberof module:core/jsgui-data-structures
    */

	// Double Linked List inside, as well as a simple dict with references to the nodes.
	// Use liked list nodes?
	
	// Items are identified with a key, but stored in any order.
	//  This could be useful for storing a list of fields. Allows fast retrieval by field name, also preserves the ordering.
	
	// will have functions for re-ordering as well.
	
	var Ordered_KVS = Class.extend({
		'init': function() {
			this.dll = new Doubly_Linked_List();
			this.node_map = {};
		},


	    /**
        * Returns an amount of items in the storage.
        * @func
        * @memberof module:core/jsgui-data-structures.Ordered_KVS
        * @instance
        */
		'length': function () {
			return this.dll.length;
		},


	    /**
        * Adds the key/value pair to the storage.
        * @func
        * @param {*} key
        * @param {*} value
        * @memberof module:core/jsgui-data-structures.Ordered_KVS
        * @instance
        */
		'put': function (key, value) {
			// does it already exist with that key - if so that item gets replaced, stays in the same position?
			// or maybe push - that means the item that goes in gets added to the end.
			return this.push(key, value);
		},


	    /**
        * Returns the value for the passed key, or `undefined` if the key does not exists. <br />
        * If the key was added several times, then returns the latest added value.
        * @func
        * @param {*} key
        * @memberof module:core/jsgui-data-structures.Ordered_KVS
        * @instance
        */
		'get': function (key) {
			//console.log('get key ' + key);
			var kvs_node = this.node_map[key];
			if (kvs_node) {
				return kvs_node.value;
			} else {
				return undefined;
				//throw 'Missing KVS node: ' + key;
			}
		},


	    /**
        * Adds the key/value pair to the storage.
        * @func
        * @param {*} key
        * @param {*} value
        * @memberof module:core/jsgui-data-structures.Ordered_KVS
        * @instance
        */
		'push': function (key, value) {
			// does it already have a node with that key?
			var node = this.dll.push(value);
			node.key = key;
			this.node_map[key] = node;
		},

	    /**
        * Removes the pair with the passed key from the storage. Throws an exception if the key does not exists. <br />
        * If the key was added several times, then removes the latest added pair only (and throws an exception for the next time).
        * @func
        * @param {*} key
        * @memberof module:core/jsgui-data-structures.Ordered_KVS
        * @instance
        */
		'out': function (key) {
			var node = this.node_map[key];
			//delete node.key;
			delete this.node_map[key]
			
			this.dll.remove(node);
		},

	    /**
        * Invokes the callback function for each item in the storage: `callback(key, value, stop)`
        * @func
        * @param {function} callback
        * @memberof module:core/jsgui-data-structures.Ordered_KVS
        * @instance
        */
		'each': function(callback) {
			
			// return the key as well as the value in the callback.
			this.dll.each_node(function(node, stop) {
				callback(node.key, node.value, stop);
			});
			
			
			//this.dll.each(callback);
		},

	    /**
        * Returns an array of all the values in the storage.
        * @func
        * @memberof module:core/jsgui-data-structures.Ordered_KVS
        * @instance
        */
		'values': function () {
			var res = [];
			this.each(function(key, value) {
				res.push(value);
			});
			return res;
		},

	    /**
        * Returns an array of all the keys in the storage.
        * @func
        * @memberof module:core/jsgui-data-structures.Ordered_KVS
        * @instance
        */
		'keys': function () {
			var res = [];
			this.each(function(key, value) {
				res.push(key);
			});
			return res;
		},

	    /**
        * Returns an array of [key, value] arrays for all the items in the storage.
        * @func
        * @memberof module:core/jsgui-data-structures.Ordered_KVS
        * @instance
        */
		'keys_and_values': function () {
			var res = [];
			this.each(function(key, value) {
				res.push([key, value]);
			});
			return res;
		}
		// will not need to deal with nodes on the user level.
		// want to be able to add and remove items, normally items will get pushed to the end of the list.
		
		// will provide a key and value in order to do this.
	});
	// have a KSVS cursor - this will be able to get the key and value at any position.
	//  Need to be able to move the cursor.
	
	/*
	
	var Sorted_KVS_Cursor = Class.extend({
		'init': function(ksvs) {
			this.ksvs = ksvs;
			this.b_plus_cursor = new BTreeCursor();
			this.b_plus_cursor.move_first();
		},
		'move_first': function() {
			return this.b_plus_cursor.move_first();
		},
		'move_next': function() {
			return this.b_plus_cursor.move_next();
		},
		'move_prev': function() {
			return this.b_plus_cursor.move_prev();
		},
		'kv': function() {
			var key = this.b_plus_cursor.get_value();
			var value = this.ksvs.dict[key];
			return [key, value];
		}
	});
	*/



    /**
    * Creates the Ordered_String_List.
    * @classdesc Represents an unsorted string list.
    * @constructor
    * @param {string} [values] - space-separated list of values
    * @memberof module:core/jsgui-data-structures
    * @example
    * var list1 = new Data_Structures.Ordered_String_List();
    * var list2 = new Data_Structures.Ordered_String_List("value1 value2 value3");
    */

	// This could be useful for a few things, like storing tables in a DB
	// schema.
	// Maybe quite a few more things.

	// May make some objects with friendlier interfaces...
	//  And may use collection for this to store lists of strings.
	//  Like CSS flags at the moment.

	// Uses private variables.
	var Ordered_String_List = Class.extend({
		'init' : function() {
			// console.log('init osl sig ' + sig);

			var arr = [];
			var dict_indexes = {};

			var reindex_dict_indexes = function() {
				dict_indexes = {};
				for ( var c = 0, l = arr.length; c < l; c++) {
					dict_indexes[arr[c]] = c;
				}
			}

		    /**
            * Returns `true` if the passed value exists in the list.
            * @func
            * @alias has
            * @param {string} value
            * @memberof module:core/jsgui-data-structures.Ordered_String_List
            * @instance
            */
		    // (add), remove, get, get_all, has, put, move, splice
			this.has = function(value) {
				return (typeof dict_indexes[value] !== 'undefined');
			}

		    /**
            * Adds the passed value to the end of the list. Does nothing if the value already exists in the list.
            * @func
            * @alias put
            * @param {string} value
            * @memberof module:core/jsgui-data-structures.Ordered_String_List
            * @instance
            */
			this.put = function (value) {
				// by default puts it at the end.
				if (this.has(value)) {
					// stays in same place.
					// arr[dict_indexes[value]]
					// do nothing
				} else {
					var index = arr.length;
					arr.push(value);
					dict_indexes[value] = index;
				}

			}

		    /**
            * Removes the passed value from the list. Does nothing if the value does not exists in the list.
            * @func
            * @alias out
            * @param {string} value
            * @memberof module:core/jsgui-data-structures.Ordered_String_List
            * @instance
            */
			this.out = function (value) {
				if (this.has(value)) {
					var idx = dict_indexes[value];
					arr.splice(idx, 1);

					delete dict_indexes[value];

					for ( var c = idx, l = arr.length; c < l; c++) {
						var i = arr[c];
						dict_indexes[i]--;
					}
					// will need the items after it and lower their indexes.

				}
			}

		    /**
            * Toggles the passed value presence in the list: if the value already exists then removes it, or adds the value on other case.
            * @func
            * @alias toggle
            * @param {string} value
            * @memberof module:core/jsgui-data-structures.Ordered_String_List
            * @instance
            */
			this.toggle = function (value) {
				if (this.has(value)) {
					this.out(value);
				} else {
					this.put(value);
				}
			}

		    /**
            * Toggles the passed value to the specified position in the list. Does nothing if the value does not exists in the list.
            * @func
            * @alias move_value
            * @param {string} value
            * @param {number} index - new index for the value (zero-based)
            * @memberof module:core/jsgui-data-structures.Ordered_String_List
            * @instance
            * @example
            * var list = new Data_Structures.Ordered_String_List("v0 v1 v2");
            * list.move_value("v0", 1);
            * console.log(list.toString()); // "v1 v0 v2"
            */
			this.move_value = function (value, index) {
				if (this.has(value) && dict_indexes[value] != index) {

					// gets removed from current position, causes items after it
					// to move back.
					// gets put in new position, gets items after that to move
					// forwards.

					var old_index = dict_indexes[value];
					arr.splice(old_index, 1);

					arr.splice(index, 0, value);

					if (index < old_index) {
						// moving back.
						// dict_indexes[]
						dict_indexes[arr[index]] = index;
						// the index object of the one it

						// for (var c = index, l = arr.length; c < l; c++) {
						for ( var c = index + 1; c <= old_index; c++) {
							dict_indexes[arr[c]]++;
						}
					} else if (index > old_index) {
						dict_indexes[arr[index]] = index;
						for ( var c = old_index; c < index; c++) {
							dict_indexes[arr[c]]--;
						}
					}

				}

			}
			// for testing

			this._index_scan = function() {
				for ( var c = 0, l = arr.length; c < l; c++) {
					console.log('c ' + c + ' arr[c] ' + arr[c] + ' idx '
							+ dict_indexes[arr[c]]);
				};
			}

		    /**
            * Returns the string representation of the list: all the string values separated by space.
            * @func
            * @alias toString
            * @memberof module:core/jsgui-data-structures.Ordered_String_List
            * @instance
            */
			this.toString = function () {
				var res = arr.join(' ');
				return res;
			}

			this.toString.stringify = true;

		    /**
            * Sets the values in the list.
            * @func
            * @alias set
            * @param {string} values - space-separated list of values
            * @memberof module:core/jsgui-data-structures.Ordered_String_List
            * @instance
            */
			this.set = fp(function (a, sig) {
				if (sig == '[s]') {
					arr = a[0].split(' ');
					// console.log('arr ' + jsgui.stringify(arr));
					reindex_dict_indexes();
				}
			});

			// if (sig == '[s]') {
			// this.set(a[0]);
			// }

			var a = arguments;
			if (a.length == 1) {
				var spec = a[0];
				if (tof(spec) == 'string') {
					// console.log('setting');
					this.set(spec);
				}
			}

		}
	});

	
	
	var Data_Structures = {
		'Doubly_Linked_List': Doubly_Linked_List,
		'B_Plus_Tree': B_Plus_Tree,
		'Sorted_KVS': Sorted_KVS,
		'Ordered_KVS': Ordered_KVS,
		'Ordered_String_List': Ordered_String_List
		//'Sorted_KVS_Cursor': Sorted_KVS_Cursor
	}

	// constraint.js

	var Constraint = Class.extend({
		'init': function(spec) {
			// if the spec is a string, then parse the string.
			
			// it may make reference to various data types.
			//  text, restricted or unrestricted length
			//  ints, numbers, etc
			//  various tests will be carried out, beyond tof.
			
			if (tof(spec) == 'string') {
				
			}
			
			// A constraint can be / contain multiple other constraints.
			//  Maybe it should have that logic inside it, and these other constraints can be particular ones.
			
			// Code execution path... may be important getting that working before long, but now it does seem that specifying and
			//  validating these various types in JavaScript seems like an important thing to do.
			
			// 
			
			
		}
	// 'matches'
		
	
	})


    /**
    * Returns true if the `obj` value matches the `constraint` definition.
    * @func
    * @param {object} obj - object to check
    * @param {string} constraint - constraint definition
    * @memberof module:core/constraint
    * @example
    * obj_matches_constraint(1, "int") ==> true
    * obj_matches_constraint("1", "int") ==> false
    * obj_matches_constraint("1", "text(3)") ==> true
    */
	var obj_matches_constraint = function (obj, constraint) {
		//console.log('obj_matches_constraint ');
		//throw('stop');
		
		if (tof(constraint) == 'string') {
			constraint = constraint_from_str(constraint);
			
			return constraint.match(obj);
		}
		
	}


    /**
    * Creates the data object constraint.
    * @constructor
    * @classdesc <mark>the class does nothing, not public, not used anywhere.</mark>.
    * @memberof module:core/constraint
    */
    // Data_Object_Constraint
	var Data_Object_Constraint = Constraint.extend({
	    'init': function (spec) {
	        this.__data_type = 'data_object_constraint';
	    }
	});


	var Data_Object_Def_Constraint = Constraint.extend({

	    /** 
        * @classdesc Data object definition constraint.
        * @constructs module:core/constraint.Data_Object_Def_Constraint 
        * @param {object} spec - data definition
        * 
        */
		'init': function(spec) {
		    this.__data_type = 'data_object_def_constraint';
		    //
		    if (tof(spec) === 'object') {
		        this.data_def = spec;
		    }
		},

	    /**
        * Returns `true` if the `value` matches the constraint.
        * @param {object} value - object to check
        * @memberof module:core/constraint.Data_Object_Def_Constraint
        * @instance
        * @example
        * var c = new Constraint.Data_Object_Def_Constraint({ name: "string", age: "number" });
        * c.match({ name: "John", age: 25 })  ==> true
        * c.match({ name: "John", age: "25" })  ==> false
        * c.match({ name: "John" })  ==> false
        */
		'match': function (value) {
			// value must be an object?
			var that = this;

			var tv = tof(value);
			if (tv == 'object') {
				//console.log('value ' + stringify(value));

				// need to see if the value matches the items in the data_def.
				var allMatch = true;

				each(this.data_def, function(field_name, field_def, stop) {
					var match = object_matches_def(value[field_name], field_def);
					//console.log('match ' + match);

					allMatch = allMatch && match;
					if (!allMatch) stop();
				});
				return allMatch;
				//throw 'stop';
			}
            //
			return false;
		} 
	});



	// Data_Object_Def_Constraint
	//  Though putting them in as individual field constraints may make sense...
	//   But the field constraints sound more like constraints on individual fields. Useful to validate a particular field,
	//    but the object validation may work differently.

	
	var Field_Constraint = Constraint.extend({

	    /** 
        * @classdesc Field constraint base class. The class is private.
        * @constructs module:core/constraint.Field_Constraint 
        * 
        */
	    'init': function (spec) {
			// if the spec is a string, then parse the string.
			
			// it may make reference to various data types.
			//  text, restricted or unrestricted length
			//  ints, numbers, etc
			//  various tests will be carried out, beyond tof.
			
			this.__data_type = 'field_constraint';
			
			//if (tof(spec) == 'string') {
				
			//}
			
			// A constraint can be / contain multiple other constraints.
			//  Maybe it should have that logic inside it, and these other constraints can be particular ones.
			
			// Code execution path... may be important getting that working before long, but now it does seem that specifying and
			//  validating these various types in JavaScript seems like an important thing to do.
			
			// 
			
			
		}
	// 'matches'
		
	
	})
	



	// A Data_Object_Constraint could help

	// Data_Object_Def_Constraint
	//  A single constraint, with the definition of various fields given concisely.
	//   This could have better performance as it's not instatiating as many objects to carry out the constraints.
	//    But it may be a problem with having different ways of doing the same things.

	// Defining fields in more detail may make sense, using Field objects.
	//  They make sense for DBs

	// But for object definitions, it may be useful to just jave the simplest form of input - they could be translated to
	//  the field system. We may have two ways of modifying the same data, and have them working together well.
	
	
	// Field constraints,
	//  Will translate to data types, and possibly further checks / validation that is done in the DB layer on input
	
	// Will 
	
	
	// Collection constraints
	//  These will translate to table constraints
	
	
	// data_type_constraint
	// field_data_type_constraint
	
	//  not null is not (really) a data type constraint.
	//  same with some check constraints. Does not seem like a very definite boundary though.
	
	var Field_Data_Type_Constraint = Field_Constraint.extend({

	    /** 
        * @classdesc Typed field constraint base class. 
        *
        * The class public name is <strong>Field_Data_Type</strong> (e.g. `new Constraint.Field_Data_Type()`).
        * @constructs module:core/constraint.Field_Data_Type_Constraint 
        * 
        */
	    'init': function (spec) {
			
			// also hold the data type itself.
			
			
			
			this._super(spec);
		}
	});
	
	
	
	var Text_Constraint = Field_Data_Type_Constraint.extend({

	    /** 
        * The constructor is private. Use from_obj() or {@link module:core/constraint.from_str|from_str()} to create this constraint.
        * @classdesc Text field constraint: checks value type (string) and possibly max length.
        * @constructs module:core/constraint.Text_Constraint 
        * @param {object} spec - constraint properties: `{}` or `{length: maxlength}`
        * 
        */
	    'init': function (spec) {
			// if the spec is a string, then parse the string.
			
			// it may make reference to various data types.
			//  text, restricted or unrestricted length
			//  ints, numbers, etc
			//  various tests will be carried out, beyond tof.
			
			//if (tof(spec) == 'string') {
			//	
			//}
			this._super(spec);
			if (is_defined(spec.length)) {
				this.length = spec.length;
			}
			
			// A constraint can be / contain multiple other constraints.
			//  Maybe it should have that logic inside it, and these other constraints can be particular ones.
			
			// Code execution path... may be important getting that working before long, but now it does seem that specifying and
			//  validating these various types in JavaScript seems like an important thing to do.
			
			// 
			
			
	    },

	    /**
        * Returns `true` if the `value` matches the constraint.
        * @param {*} value - value to check
        * @memberof module:core/constraint.Text_Constraint
        * @instance
        * @example
        * var c = Constraint.from_obj("text(3)");
        * c.match("123")  ==> true
        * c.match(123)  ==> false
        * c.match("1234")  ==> false
        *
        * var c = Constraint.from_obj("text");
        * c.match("1234567890")  ==> true
        */
	    'match': function (v) {
		    if (is_defined(this.length)) {
		        return (tof(v) == 'string' && v.length <= this.length);
		    } else {
		        return (tof(v) == 'string');
		    }
	    },

	    /**
        * Returns the constraint information object. The object can be following:
        * - `["text", length]` - if the constraint contains a maxlength restriction
        * - `"text"` - if the constraint does not contains a maxlength restriction
        * @memberof module:core/constraint.Text_Constraint
        * @instance
        * @example
        * var c = Constraint.from_obj("text(3)");
        * c.to_info_obj()  ==> ["text", 3]
        *
        * var c = Constraint.from_obj("text");
        * c.to_info_obj()  ==> "text"
        */
	    'to_info_obj': function () {
			if (is_defined(this.length)) {
				return ['text', this.length];
			} else {
				return 'text';
			}
			
			
		}
	// 'matches'
		
	})
	
	var Not_Null_Constraint = Field_Constraint.extend({
		
	    /** 
        * @classdesc "Not null" constraint: checks a value to be not null. 
        *
        * The class public name is <strong>Not_Null</strong> (e.g. `new Constraint.Not_Null()`).
        * @constructs module:core/constraint.Not_Null_Constraint 
        */
	    'init': function (spec) {
			// if the spec is a string, then parse the string.
			this._super(spec);
			
			
	    },

	    /**
        * Returns `true` if the `value` matches the constraint (i.e. value != undefined && value != null).
        * @param {*} value - value to check
        * @memberof module:core/constraint.Not_Null_Constraint
        * @instance
        * @example
        * var c = new Constraint.Not_Null();
        * c.match("123")  ==> true
        * c.match(null)  ==> false
        */
	    'match': function (v) {
			return is_defined(v) && v != null;
		}
	});
	
	// Objects that represent the data types themselves?
	//  Probably not going to use classes for that, just JS objects like arrays, maps.
	
	var Guid_Constraint =  Field_Data_Type_Constraint.extend({

	    /** 
        * @classdesc GUID field constraint: checks a value to a GUID string (e.g. `"{86DCA9A5-31AC-4F20-B552-4D1503D0D11C}"`). 
        *
        * The class public name is <strong>Guid</strong> (e.g. `new Constraint.Guid()`).
        * @constructs module:core/constraint.Guid_Constraint 
        */
	    'init': function (spec) {
			// if the spec is a string, then parse the string.
			this._super(spec);
			
			
	    },

	    /**
        * Returns `true` if the `value` matches the constraint (i.e. value is a GUID string).
        * @param {*} value - value to check
        * @memberof module:core/constraint.Guid_Constraint
        * @instance
        * @example
        * var c = new Constraint.Guid();
        * c.match("{86DCA9A5-31AC-4F20-B552-4D1503D0D11C}")  ==> true
        * c.match("86DCA9A5-31AC-4F20-B552-4D1503D0D11C")  ==> false
        */
	    'match': function (v) {
			//return tof(v) == 'number';
			
			// string of a given length...
			
			//  this will really be for translating to Mongo or SQL Server or other DB GUID types.
			
		    // "{86DCA9A5-31AC-4F20-B552-4D1503D0D11C}"
		    if (tof(v) === "string") {
		        var reg = /^{[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}}$/;
		        return reg.test(v);
            }
            //
		    return false;
			
	    },

	    /**
        * Returns the constraint information object (i.e. "guid" string).
        * @memberof module:core/constraint.Guid_Constraint
        * @instance
        * @example
        * var c = Constraint.from_obj("guid");
        * c.to_info_obj()  ==> "guid"
        */
	    'to_info_obj': function () {
			return 'guid';
		}
		
	})
	
	
	var Number_Constraint = Field_Data_Type_Constraint.extend({

	    /** 
        * The constructor is private. Use from_obj() or {@link module:core/constraint.from_str|from_str()} to create this constraint.
        * @classdesc Number field constraint: checks value to be a number.
        * @constructs module:core/constraint.Number_Constraint 
        */
	    'init': function (spec) {
			// if the spec is a string, then parse the string.
			this._super(spec);
	    },

	    /**
        * Returns `true` if the `value` matches the constraint (i.e. value is a number).
        * @param {*} value - value to check
        * @memberof module:core/constraint.Number_Constraint
        * @instance
        * @example
        * var c = Constraint.from_obj("number");
        * c.match(1)  ==> true
        * c.match("1")  ==> false
        */
	    'match': function (v) {
			return tof(v) == 'number';
		},

	    /**
        * Returns the constraint information object (i.e. "number" string).
        * @memberof module:core/constraint.Number_Constraint
        * @instance
        * @example
        * var c = Constraint.from_obj("number");
        * c.to_info_obj()  ==> "number"
        */
		'to_info_obj': function () {
			return 'number';
		}
		
	})
	
	var Int_Constraint = Number_Constraint.extend({

	    /** 
        * The constructor is private. Use from_obj() or {@link module:core/constraint.from_str|from_str()} to create this constraint.
        * @classdesc Int field constraint: checks value to be an integer number.
        * @constructs module:core/constraint.Int_Constraint 
        */
	    'init': function (spec) {
			// if the spec is a string, then parse the string.
			this._super(spec);
	    },

	    /**
        * Returns `true` if the `value` matches the constraint (i.e. value is an integer number).
        * @param {*} value - value to check
        * @memberof module:core/constraint.Int_Constraint
        * @instance
        * @example
        * var c = Constraint.from_obj("int");
        * c.match(1)  ==> true
        * c.match(1.5)  ==> false
        * c.match("1")  ==> false
        */
	    'match': function (v) {
			return tof(v) == 'number' && parseInt(v) === v;
		},

	    /**
        * Returns the constraint information object (i.e. "int" string).
        * @memberof module:core/constraint.Int_Constraint
        * @instance
        * @example
        * var c = Constraint.from_obj("int");
        * c.to_info_obj()  ==> "int"
        */
	    'to_info_obj': function () {
			return 'int';
		}
		
	})
	
	
	// Type_Constraint
	
	
	// Collection constraints as well
	//  These may not necessirily apply to JSGUI collections, but could be for translating to Table Constraints in SQL.
	
	
	// Collections will have different types of constraints.
	
	// Could be that every item needs to follow a set of field constraints.
	// Could also be that there are unique keys.
	//  May have fields specified.
	
	// This will work very well indeed when this is done. Should be intuitive to create the models, then these models will be very useful for 
	//  translating to different things. Some of the indexing functionality of the DB gets replicated on the client in a relatively small amount of code,
	//  allowing for some things to run in a very optimized way even on IE6.
	
	// It will be nice to see the things working fine in IE6 as well as modern browsers.
	
	
	
	
	
	var Collection_Constraint = Constraint.extend({
		
	    /** 
        * The class is private. 
        * @classdesc Collection constraints base class.
        * @constructs module:core/constraint.Collection_Constraint 
        */
	    'init': function (spec) {
			// if the spec is a string, then parse the string.
			
			// it may make reference to various data types.
			//  text, restricted or unrestricted length
			//  ints, numbers, etc
			//  various tests will be carried out, beyond tof.
			this.__data_type = 'collection_constraint';
			//if (tof(spec) == 'string') {
				
			//}
			
			// A constraint can be / contain multiple other constraints.
			//  Maybe it should have that logic inside it, and these other constraints can be particular ones.
			
			// Code execution path... may be important getting that working before long, but now it does seem that specifying and
			//  validating these various types in JavaScript seems like an important thing to do.
			
			// 
			
			
		}
	// 'matches'
		
	
	});
	
	// Not so sure about this being the same Data_Type_Constraint for Data_Objects...
	
	
	// May also have 
	
	// This can force a collection to hold only a particular type of object, tested with instanceof
	
	//  And not using the field system?
	//   So we could restrict a collection to only holding a String this way.
	
	var object_matches_def = function(value, def) {
		//console.log('object_matches_def');
		//console.log('value ' + stringify(value));
		//console.log('def ' + stringify(def));

		var tv = tof(value);

		//if (def == 'string') {
		//	return tv == 'string'
		//}
		//console.log('tv ' + tv);

		if (tv == def) {
			return true;
		}

		return false;

	}

	
	var Collection_Data_Def_Constraint = Collection_Constraint.extend({

	    /** 
        * @classdesc Collection fields definition constraint.
        *
        * The class public name is <strong>Collection_Data_Def</strong> (e.g. `new Constraint.Collection_Data_Def({})`).
        * @constructs module:core/constraint.Collection_Data_Def_Constraint 
        * @param {object} spec - data definition
        * 
        */
	    'init': function (spec) {

		    this._super();

		    //if (tof(spec) == 'function' && is_constructor_fn(spec)) {
			//	this.data_type_constructor = spec;
			//}
			//console.log('tof(spec) ' + tof(spec));
			//console.log('tof(String) ' + tof(String));
			
			if (tof(spec) === 'object') {
				this.data_def = spec;
			}
			
			// Def is not the data_type in terms of a constructor
			this._constraint_type = 'data_def';
			
		},

	    /**
        * Returns `true` if the `value` matches the fields constraint.
        * @param {object} value - object to check
        * @memberof module:core/constraint.Collection_Data_Def_Constraint
        * @instance
        * @example
        * var c = new Constraint.Collection_Data_Def({ name: "string", age: "number" });
        * c.match({ name: "John", age: 25 })  ==> true
        * c.match({ name: "John", age: "25" })  ==> false
        * c.match({ name: "John" })  ==> false
        */
	    'match': function (value) {
			// value must be an object?
			var that = this;

			var tv = tof(value);
			if (tv == 'object') {
				//console.log('value ' + stringify(value));

				// need to see if the value matches the items in the data_def.
				var allMatch = true;

				each(this.data_def, function(field_name, field_def, stop) {
					var match = object_matches_def(value[field_name], field_def);
					//console.log('match ' + match);

					allMatch = allMatch && match;
					//console.log('allMatch ' + allMatch);
					if (!allMatch) stop();
				});
				return allMatch;
				//throw 'stop';
			}

		} 
	});
	
	// Perhaps rename to Collection_Data_Type_Constructor_Constraint
	var Collection_Data_Type_Constraint = Collection_Constraint.extend({

	    /** 
        * @classdesc Collection item type constraint.
        *
        * The class public name is <strong>Collection_Data_Type</strong> (e.g. `new Constraint.Collection_Data_Type(Object)`).
        * @constructs module:core/constraint.Collection_Data_Type_Constraint 
        * @param {function} spec - item type constructor function
        * 
        */
	    'init': function (spec) {

		    this._super();

		    //if (tof(spec) == 'function' && is_constructor_fn(spec)) {
			//	this.data_type_constructor = spec;
			//}
			//console.log('tof(spec) ' + tof(spec));
			//console.log('tof(String) ' + tof(String));
			
			if (tof(spec) === 'function') {
				this.data_type_constructor = spec;
			}
			
			this._constraint_type = 'data_type';
			
		},
	    /**
        * Returns `true` if the `value` matches the item type constraint.
        * @param {object} value - object to check
        * @memberof module:core/constraint.Collection_Data_Type_Constraint
        * @instance
        * @example
        * var c = new Constraint.Collection_Data_Type(Number);
        * c.match(1)  ==> true
        * c.match("1")  ==> false
        * 
        * 
        * var c2 = new Constraint.Collection_Data_Type(MyBook);
        * c2.match(new MyBook())  ==> true
        * c2.match(new Number(1))  ==> false
        * 
        */
	    'match': fp(function (a, sig) {
			//console.log('');
			//console.log('*  match sig ' + sig);
			//console.log('this.data_type_constructor ' + this.data_type_constructor);
			//console.log('a[0] ' + a[0]);
			//console.log('tof(a[0]) ' + tof(a[0]));
			//console.log('a[0] instanceof this.data_type_constructor ' + (a[0] instanceof this.data_type_constructor));
			
			var ta0 = tof(a[0]);
			//console.log('ta0 ' + ta0);
			if (ta0 == 'number') {
				//console.log(this.data_type_constructor === Number);
				if (this.data_type_constructor === Number) return true;
			}
			// But can perform casting / conversion.
			if (ta0 == 'string') {
				//console.log(this.data_type_constructor === Number);
				if (this.data_type_constructor === String) return true;
			}
			
			if (this.data_type_constructor && a[0] instanceof this.data_type_constructor) {
				return true;
			}
			
			//if (sig == '[D]') {
			//	// matching a Data_Object against these constraints.
				
			//	//var c_res = this.data_object.obj_matches_field_constraints(a[0]);
			//	//return c_res;
				
			//	if (this.data_type_constructor) {
			//		return a[0] instanceof this.data_type_constructor;
			//	}
				
			//	//return 
				
			//}
			
			//// May be given a collection here.
			//if (sig == '[C]') {
			//	// A collection may hold constraints for a type of collection.
				
			//	// Database holds Tables Collection, which is of the Table item.
				
			//	// let's have a look at that collection.
			//	var obj = a[0];
			//	//console.log('obj ' + stringify(obj));
				
			//	// eg collection of tables.
			//	///  probably should have its data type constraint?
				
			//	var obj_name = obj.get('name');
			//	//console.log('obj_name ' + obj_name);
				
				
				
			//	// we may be able to get the data_type_constraint of that collection.
			//	//  It may be a dtc that implies it can take a collection, maybe a collection of a particular type of object.
				
			//	//console.log('obj._data_type_constraint ' + stringify(obj._data_type_constraint));
			//	// so, a collection when given a typed collection as it's data_type will need to respond correctly.
			//	//  setting its _data_type_constraint
				
			//	//console.log('obj._data_type_constraint.data_type_constructor ' + stringify(obj._data_type_constraint.data_type_constructor));
				
			//	//data_type_constructor
				
			//	//console.log('this.data_type_constructor ' + stringify(this.data_type_constructor));
			//	//var stack = new Error().stack
			//	//console.log( stack )				
			//	//throw('13) stop');
				
			//	//var res = obj instanceof obj._data_type_constraint.data_type_constructor;
			//	var res = obj instanceof this.data_type_constructor;
			//	//console.log('res ' + res);
			//	// nice, seems to work.
				
			//	return res;
			//	// see if the collection's _data_type_constraint matches the constructor in this constraint.
				
				
			//	// this does get a bit complicated with the same code being used on different nested levels.
			//	//  I'll need to cut down on feature addition on this, and make sure the API is working and stable.
			//	//  Document it too.
				
			//	// Just need it to generate these relational, or semi-relational databases.
			//	//  Need to get the whole web platform running.
				
			//	// The system has got pretty big, still will need a bit more for the whole database support.
			//	//  Will likely make some database connected extensions... or maybe more sync code in the 'Database' class.
								
			//	//return 
			//}
			//
			return false;
			
		})
	});
	
	// Will be used for checking every Table that gets put into a Database is a Table etc.
	//  Used to enforce ststic typing.
	
	// Something very similar could be used to enforce static typing on Data_Objects.
	//  That will restrict the objects that can get put into Data_Objects to being a particular class / subclass chain.
	
	// Collection_Data_Object_Constraint
	//  Used for making a Collection like a Table in a DB.
	//  This way the Collection is constrained to storing one type of object.
	
	// Could be a data type constraint... used for holding the required fields.
	//  Not just for checking the data_type... must check that the objects conform to the Data_Object's constraints.
	//  May be able to make a data_object that can't be constructed without the right fields...
	
	//var Collection_Data_Object_Constraint = Collection_Constraint.extend({
	//	'init': function(spec) {
	//		if (tof(spec) == 'data_object') {
	//			this.spec;
	//		}

	//		// May also want to define a table data object constraint like:
	//		//  {"address": "string", "family": "string", "internal": "boolean"}
	//		//  (is it a constraint really? or just a collection of fields?)
	//		//   I think it's a constraint because it restricts their types.

	//		//console.log('Collection_Data_Object_Constraint tof(spec) ' + tof(spec));


			
	//		this._constraint_type = 'data_object';
			
	//	},
	//	'match': fp(function(a, sig) {
	//		//console.log('match sig ' + sig);
	//		//console.log('match a ' + stringify(a));
	//		if (sig == '[D]') {
	//			// matching a Data_Object against these constraints.
				
	//			var c_res = this.data_object.obj_matches_field_constraints(a[0]);
	//			return c_res;
	//		}
			
	//		// May be given a collection here.
	//		if (sig == '[C]') {
	//			// A collection may hold constraints for a type of collection.
				
	//			// Database holds Tables Collection, which is of the Table item.
				
	//			// let's have a look at that collection.
	//			var obj = a[0];
	//			//console.log('obj ' + stringify(obj));
				
	//			// get the constraint for that field...
	//			//  it should have been put in when the field gets specified.
				
	//			//each(obj, function(i, v) {
	//			//	console.log('i ' + i);
	//			//	console.log('v ' + v);
	//			//});
				
	//			// a lower level each?
	//			//  The Collection object has got fairly big and complicated.
	//			//  want to be able to view all its constraints easily.
				
	//			// it may have a data_type_constraint.
	//			/*
	//			var coll_dtc = obj._data_type_constraint;
	//			console.log('coll_dtc ' + coll_dtc);
	//			//console.log('coll_dtc ' + stringify(coll_dtc));
				
				
				
				
	//			var stack = new Error().stack
	//			console.log( stack )
				
				
	//			throw('14) stop');
	//			*/
	//			return true;
				
				
	//		}
			
	//	})
		
	//});
	
	
	
	
	// One of these can be set to primary. The first one is by default.
	//  The order of the unique indexes matters.
	
	var Unique_Constraint = Collection_Constraint.extend({

	    /** 
        * @classdesc Collection unique constraint.
        *
        * The class does not provide the `match()` method, but provides `.fields` property for the unique field names.
        *
        * The class public name is <strong>Unique</strong> (e.g. `new Constraint.Unique()`).
        * @constructs module:core/constraint.Unique_Constraint 
        * @param {string|string[]} spec - unique field name(s)
        * 
        */
	    'init': function (spec) {
			this._super(spec);
			
			//this.set('constraint_type', 'unique');
			
			this._constraint_type = 'unique';
			
			// field (name) or actual field (reference to a field constraint).
			
			// but field could be plural too
			//  will be a convention that the singular here can sometimes refer to plural.
			//  maybe plural would be better?
			if (is_defined(spec.fields)) this.fields = spec.fields;
			
			if (tof(this.fields) == 'array') {
				this._sorted_fields = clone(this.fields).sort();
			}		
	    }

	    /** 
        * @name fields
        * @member
        * @type {string|string[]}
        * @memberof module:core/constraint.Unique_Constraint
        * @instance
        * @example
        * var c = new Constraint.Unique("ID");
        * c.fields  ==> "ID"
        * 
        */


		// not really sure the constraint will do much here... it requires an index to be set up.
		//  perhaps tells the index not to accept duplicates?
	
		// test the constraint?
		//  do that outside for the moment
	
	
	});
	
	
	
	
	//var Relationship_Constraint = Collection_Constraint.extend({
	//	'init': function(spec) {
	//		this._super(spec);
			
	//		// which other collection(s) and field(s) does it reference?
			
	//		// what form does the relationship take?
			
	//		// files in a folder
	//		//  aggregation
	//		//  has (composed of)
	//		//  many-to-one
	//		//   aggregation_to_item (but maybe we would be saying the folder 'has' files)
			
			
	//		// friends
	//		//  many-to-many
	//		//  association
	//		//  has (as friend) / is associated with
	//		//   use join table
	//		//   association_between_items
			
	//		// employees-projects
	//		//  many-to-many
	//		//  association
	//		//  is associated with 
	//		//   use join table
	//		//   association_between_items
			
			
	//		// user_roles
	//		//  aggregation? 
	//		//  maybe association
	//		//  one-to-many
	//		//  user is associated with roles
			
	//		// employee-pay_band
	//		//  association?
	//		//  one_to_one
	//		//  user has that pay band
			
	//		// Compositon for sub-items?
			
	//		// May be interested in mapping inheritance for this object system
	//		//  At the moment, need to just map the JavaScript structures into the database, then we'll get to work with
	//		//  building up the database and components of it that deal with website functionality.
			
	//		// Once things can quickly be declared and then created in the database, it should be relatively fast to implement programmatic
	//		//  components that work quickly with the DB and also can be created quickly.
			
	//		// There is some more to do with this work, but now it is at a really good stage where it is able to do a lot of things in the background.
	//		//  With some more coding, it will do a whole bunch more things.
			
	//		// Will do some more work on the XML / HTML transformation.
	//		//  That would be one of the really amazing things if I were to release it with that.
			
	//		// The declarative writing of these pages would be very interesting and get people interested with the JSGUI platform.
	//		//  That part is also something it would be interesting to get written in C++ or C.
			
	//		// Also, will be interesting to have bits and pieces about technology on the website.
	//		//  Presentations.
			
	//		// I think it could be very good advertising for my own services, and releasing the JSGUI open source framework will do a lot to help this.
	//		//  I'm likely to release the client-side framework, as well as a server distribution.
	//		//  I doubt it would be the full / development / internal distribution, but one that has various very useful features.
			
	//		// I would likely license commercial modules as well, such as a Postgres Connector.
	//		//  Also would have a marketplace for those who wish to sell their own components - and may well be selling advertising to those who
	//		//  want to sell their own components for it, possibly through Google.
			
	//		// May do deals with component makes, could have sponsored listings? 
			
	//		// The basic framework should probably be released as open-source, then I should be set for employing people and getting paid to develop this code
	//		//  further for clients in their systems.
			
	//		// I think this could make it easy to get a high performance web server running.
	//		//  That will be very nice indeed. I think both the ease of use and customizability will be high.
			
	//		// It will be very nice to have an advanced admin interface going alongside it.
	//		//  Won't require installing files, images etc, could be using a few vector images.
	//		//  It may surprise people when they see it, thinking, where did that come from, when they are doing simple, easily,
	//		//   but there is quite a complicated enabling system allowing it to work.
			
	//		// Am getting much closer to the software goals.
	//		//  Think I'll get a really nice system online. Don't know quite how long.
	//		//  I'll get a lot done over the next few days.
			
	//		// There may be a few more things to get really right along the execution path.
	//		//  There is quite a lot to do with the HTML that needs to work.
	//		//  Some of this will be expressed in terms of field corrections and constraints.
			
	//		// There is maybe another 3000 more lines that needs to be written for this?
			
	//		// The server side library will be big, but will be focused on producing efficient client-side output
	//		//  I'll do work on documenting it.
			
	//		// It would be interesting to see how big a build (sequentially ordered) of the JavaScript file is.
	//		//  Perhaps some things would need to be renamed so that lots of vars in the global namespace would work together.
	//		//  There would be a large amount of gain possible in the build process.
			
	//		// The size of the small client library is nudging upwards. Perhaps it will be a 24KB download? Even 32?
	//		//  It will definitely be impressive though, will enable lots of things, useful business interactions.
			
	//		// Could have a very useful system for conference attendees.
	//		//  However, need to do the constraints.
			
			
			
			
	//		// Likely to go into more detail on the relationship constraints when actually making them.
	//		//  Perhaps will be related to something in the same collection or Data_Object?
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
	//		// Could talk to D about setting up the implementations of it.
	//		//  
			
			
			
			
			
			
			
			
			
			
			
			
			
			
	//		// Also like the idea of having a donate for feature box.
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
	//		/*
	//		 * “Each Order is associated with one or more OrderLines.”

	//			“Each OrderLine is associated with one and only one Order.”
				
	//			“Each OrderLine is associated with one and only one Product.”
				
	//			“Each Product is associated with zero or more OrderLines.”
	//		 * 
	//		 */
			
			
			
	//	}
	//	// not really sure the constraint will do much here... it requires an index to be set up.
	//	//  perhaps tells the index not to accept duplicates?
	//});
	
	
	// Relationship
	
	// Foreign_Key constraint?
	//  Maybe call this a Reference or Relationship constraint.
	
	// Expressed in the data model, this could describe a many-to-many relationship that gets expressed using a links table in an RDB.
	//  Possibly using a links, or the general links / relationships table in an ODB.
	
	
	
	
	
	// Not so sure about specifying primary keys here...
	//  The things used as PKs in this system may not be PKs in the database. The PKs may all be incrementing numeric IDs in the database.
	//   That could make a lot more sense, but not in all situations.
	
	// Primary Unique Index in this situation... that will be a constraint that gets translated to unique index.
	
	
	
	
	
	// With collections, they will be saying that records are to have a property, and some uniqueness conditions should be satisfied.
	
	// NOT NULL - collection
	// UNIQUE - collection
	// PRIMARY KEY - collection
	// FOREIGN KEY - collection
	// CHECK - field but likely applied through the collection
	// DEFAULT - field but likely applied through the collection
	
	// There is quite a bit to do to get this data model working within JavaScript.
	//  Then it will be a question of getting it translating itself to other languages.
	//  Creating the RDB model, then the Postgres model, then the actual code used to create it, then running that code.
	//  These translation steps will result in a fairly substantially sized piece of software, quite powerful too.
	//   The functionality could still be fairly small in a download.
	
	// I think this could make a very nice app on the iPad, there would be quite a lot that could be made in terms of database design.
	//  Then emailing the setup code, maybe running the setup code from the iPad.
	// Being able to view all the code, a fairly focused IDE for making Postgres code.
	//  Could do quite a lot on the iPad without selling an app, and then sell an app as well.
	
	// They kind of all refer to fields, but it's to do with how these fields interact with other fields and fields in other tables/collections that
	//  make them either field or collection constraints
	
	// Text_Constraint
	// Number_Type_Constraint
	// Integer_Type_Constraint
	
	// These type constraints could also be able to parse data that does not match the constraint.
	//  Perhaps a regex could be run on a string if it's expecting something else.
	
	// Multiple_Constraint (different constraints get satisfied)
	
	
	// Indexed_Array_Constraint
	
	// All basically run tests on the object to see if it meets the constraint or not.
	
	// also get the constraint from an object.
	// some things will be expressed as (nested) JavaScript objects.
	
	// This, as well as sorting out this parsing system to be like ASP.NET, will take a while longer.
	//  On the server, it will be possible to use much more code to do what is needed.
	//  On the client, making use of existing DOM parsing would make more sense.
	
	
	
	// Different types of constraint.
	//  I think types like 
	/* from_obj instead
	var value_as_field_constraint = function(val) {
		// more flexible than getting it from a string.
		//  may be dealing with nested things too.
		
		
		
		
	}
	*/


	
    /** 
    * Creates a constraint using the definition string. See {@link module:core/constraint.from_str|from_str()} for possible definition strings.
    * @func
    * @name from_obj
    * @variation 1
    * @param {string} str - constraint definition string
    * @memberof module:core/constraint
    * @example
    * c = Constraint.from_obj("int");
    * c = Constraint.from_obj("text(10)");
    */

    /** 
    * Creates a constraint using the "string and number" definition. The following definitions are supported:
    * - `["text", <length>]` - creates {@link module:core/constraint.Text_Constraint|Text_Constraint}, where "`<length>`" is the max text length allowed
    * @func
    * @name from_obj
    * @variation 2
    * @param {array} arr_of_str_and_num - constraint definition
    * @memberof module:core/constraint
    * @example
    * c = Constraint.from_obj(["text", 10]);
    */

    /** 
    * Creates a constraint using the "string and string" definition. The following definitions are supported:
    * - `["unique", <fieldName>]` - creates {@link module:core/constraint.Unique_Constraint|Unique_Constraint}, where "`<fieldName>`" is the unique field name
    * @func
    * @name from_obj
    * @variation 3
    * @param {array} arr_of_str_and_str - constraint definition
    * @memberof module:core/constraint
    * @example
    * c = Constraint.from_obj(["unique", "SomeID"]);
    */




	var from_obj = fp(function(a, sig) {
		// Should be able to interpret things as either Field or Collection constraints.
		//  Nice how Field constraints will be applyable to a Collection.
		//   This will be like setting columns in the database.
		
		// This sophisticated data model will be applicable to many database situations / scenarios.
		//  Should make it really fast to produce a database with CRUD SPs.
		//  Easy to translate from the requirements into the finished product.
		//   Convenient GUI tools for specifying the requirements.
		
		// Would be good to directly monetize this software pretty soon.
		//  I can get something impressive online soon that will get me customers and income from adverts.
		
		// Will definitely put together a good online presence.
		
		// Together with resources, ORM, and Je-Suis XML... will take some time.
		//  Also needing the web database interface.
		
		// It all has been coming on a lot very recently.
		//  Need to do more to turn it into a comprehensive web platform.
		
		// Will be a whole application including CMS.
		
		// For the moment, will continue with the single goal of getting the framework running, fully displaying my HTML website.
		
		//  I envisage my website will make use of some nice animations, and have some nice demos.
		//  A few animations in a portfolio section too.
		//   Section on work I have done (hype Brandon Generator a little bit).
		//  Technology demostrations.
		
		// Will get this whole website very polished, and will see how many people start using it.
		//  I think I could get some more widespread usage of the library, then get consultancy work regarding it.
		// Interact with the customers through the website.
		
		// OK... need to do more on this constraint system.
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		//console.log('constraint.js from_obj sig ' + stringify(sig));
		
		if (sig == '[s]') {
			return constraint_from_str(a[0]);
			
		}
		
		
		
		if (a.l == 1 && tof(a[0]) == 'array') {
			//console.log('constraint.js from_obj sig ' + stringify(sig));
			//console.log('constraint.js from_obj obj ' + stringify(a[0]));
			
			var obj = a[0];
			
			var obj_sig = get_item_sig(obj, 1);  // was get_item_sig(obj);
			//console.log('obj_sig ' + obj_sig);
			//console.log('obj ' + stringify(obj));
			
			// could be given [s,n]
			// eg ['text', 32]
			
			if (obj_sig == '[s,n]') {
				var data_type_name = obj[0];
				var length = obj[1];
				
				if (data_type_name == 'text') {
					var constraint = new Text_Constraint({'length': length});
					return constraint;
				}
				
			}
			
			
			if (obj_sig == '[s,s]') {
				var constraint_type = obj[0];
				//  then another parameter, if it's a unique constraint then the other param is the field_name
				//console.log('constraint_type ' + constraint_type);
				if (constraint_type == 'unique') {
					var field_name = obj[1];
					
					// we don't have the actual field, but got its name.
					//  the name would do for the moment.
					var constraint = new Unique_Constraint({
						'fields': field_name
					});
					//console.log('constraint ' + constraint);
					return constraint;
					
					
					
				}
				
				if (constraint_type == 'text') {
					
					
				}
				
				// if it's a text constraint... that's a field type.
				
				
				
				
				
				
			}
			
			
			
		}
		
		//if (sig == '[D]') {			
		//	var constraint = new Collection_Data_Object_Constraint(a[0]);
		//	//console.log('constraint ' + constraint);
		//	return constraint;
		//}
		
		
		
		
		// Need to really do a lot on the execution path of this.
		//  I think the whole database transformation system is necessary to get it to run, it's an integral part of the system.
		//  Getting access to relational databases is critical for the whole software to perform its intended functions.
		
		
		
		
		
		
		// an array, 2 strings...
		
		// may wind up using a variery of constraint definitions
		//  they will be interpreted here into constraint objects, which can be put in collections, and these used to test DataObjects.
		
		// Can be used for making abstract definitions of things, before data goes in.
		//  Then these abstract definitions are used in order to create the database and interact with it
		
		// Made loads of progress with the object system, constraints are going to be a very powerful feature.
		//  Requirements may also be there as a different API, perhaps requiring constraints to be matched,
		//  also some more advanced programmatic checks that would get expressed in JavaScript, whereas the constraints are 
		//  a system that will be translatable into different particular methodologies.
		
		
		
		
		
		
		
		
		
		
		
		//throw ('stop');
		
	})
	
	
    /**
    * Creates a constraint using the definition string. The following definitions are supported:
    * - "int" - creates {@link module:core/constraint.Int_Constraint|Int_Constraint}
    * - "number" - creates {@link module:core/constraint.Number_Constraint|Number_Constraint}
    * - "text" - creates {@link module:core/constraint.Text_Constraint|Text_Constraint} without max length restriction
    * - "text(<length>)" - creates {@link module:core/constraint.Text_Constraint|Text_Constraint}, where "<length>" is the max text length allowed
    * - "guid" - creates {@link module:core/constraint.Guid_Constraint|Guid_Constraint}
    * @func from_str
    * @param {string} str - constraint definition
    * @memberof module:core/constraint
    * @example
    * c = Constraint.from_str("int");
    * c = Constraint.from_str("text(10)");
    */
	var constraint_from_str = function (str) {
		//console.log('constraint_from_str str ' + str);
		// will check the cache for it though.
		
		// will need to choose the type of the constraint.
		
		// if it's a string it won't be that complicated, I think.
		//  may be best to use regular expressions to detect what kind of constraint it is.
		
		// It may be a string with some parameters.
		// Not really wanting essentials to get bigger, but thing some extra string processing may be of use before this.
		//  Jsgui-util currently has the data types, so that one is fairly big.
		
		// Functionality will be brought over from Nested... except it will work differently
		//  In nested, there is a Data_Type_Instance.
		//  In this case, I think it will be Constraints, and more declarative descriptions of the data types.
		
		// It will be intended to mirror in some ways the data types and constraints that are in databases.
		//  Constraints could apply to collections, saying that key values must be unique, eg no one has the same NI number.
		
		
		// examples
		// 'string', 'int', 'text', 'text(32)', 
		
		// Perhaps these are like Data_Type_Instance objects, but they'll be called constraints here.
		//  They may not be limited to being data types, but they should do the same jobs.
		// The data types they reference... not so sure about making Data_Type_Instances or not.
		// Constraints as a concept makes more sense, especially when defining databases.
		
		// I think this system before too long could produce some really advanced functionality.
		//  With this abstraction made it will be possible to get development work uing it I hope.
		
		// Not quite sure how or if this will be competing with backbone.
		//  I think having the jsgui domain, having it there, with a demo and discussion, talking about it on twitter,
		//  showing the twitter feed on the website using nuce UI components...
		
		// Some simple downloadable pieces / builds
		// A system using node.js that will provide the right JavaScript client library to the clients
		// Make it easy to get running from downloads, easy-to-view examples and documentation within the downloads.
		
		// I think it could make a very sophisticated website system. Could have a graphical IDE where componets can be put in place, it generates the code for
		//  that.
		
		
		// Go through, looking for some patterns as regular expressions.
		//  If we have identified them, we have the values needed for the constraint.
		
		var rx_specified_length_text = /^text\((\d+)\)$/;
		// the data type could possibly be handled by input processors.
		//  I think that makes sense, moving input_processors out of nested and into essentials.
		//   It's an expandable system, the basis for it will not take much. The relevant input processors could be added by Data_Object, but 
		//   then be available throughout the system, such as for dealing with function calls, or data types which can have a length.
		
		
		
		
		
		var match_slt = str.match(rx_specified_length_text);
		
		//console.log('match_slt ' + match_slt);
		
		if (match_slt) {
			var length = parseInt(match_slt[1]);
			//console.log('length ' + tof(length));
			var constraint = new Text_Constraint({
				'length': length
			})
			return constraint;
		}
		
		if (str === 'text') {
		    var constraint = new Text_Constraint({})
		    return constraint;
		}

		if (str === 'int') {
		    var constraint = new Int_Constraint({})
		    return constraint;
		}

		if (str === 'number') {
			var constraint = new Number_Constraint({})
			return constraint;
		}
		
		if (str === 'guid') {
			var constraint = new Guid_Constraint({})
			return constraint;
		}
		
		
		
		
		//throw('stop');
		
		
		
		
	}
	
	Constraint.from_obj = from_obj;
	
	Constraint.from_str = constraint_from_str;
	Constraint.obj_matches_constraint = obj_matches_constraint;
	
	Constraint.Not_Null = Not_Null_Constraint;
	Constraint.Unique = Unique_Constraint;
	Constraint.Data_Object_Def_Constraint = Data_Object_Def_Constraint;
	//Constraint.Collection_Data_Object = Collection_Data_Object_Constraint;
	Constraint.Collection_Data_Type = Collection_Data_Type_Constraint;
	Constraint.Collection_Data_Def = Collection_Data_Def_Constraint;
	Constraint.Field_Data_Type = Field_Data_Type_Constraint;
	Constraint.Guid = Guid_Constraint;

	// data-object-fields-collection

	var data_value_index = 0;
	var data_value_abbreviation = 'val';
	
	// do data objects get an ID when they are initialized.
	jsgui.__data_id_method = 'init';
	
	var obj_matches_constraint = Constraint.obj_matches_constraint;
	var native_constructor_tof = jsgui.native_constructor_tof;
	
	var value_as_field_constraint = Constraint.value_as_field_constraint;
	
	var Ordered_String_List = Data_Structures.Ordered_String_List;

	// When setting the fields, indexes may need to be set too...

	
	// gets a value as a field_constraint object.
	//var ensure_data_type_data_object_constructor = j.ensure_data_type_data_object_constructor;
	
	
	// So, Data_Objects may have a Page_Context, Application_Context, or just Context.
	//  The Context would include info such as which browser is being used.
	//   Controls will render differently depending on the context.
	
	// jsgui.data_types_info and data_type will become much more closely integrated into this.
	//  Perhaps there should be another module level for this.
	
	// Not sure about introducing it here. Maybe in lang-essentials? Don't want that to get too big.
	
	// Data_Object Flags is the next thing here...
	//  But that requires a Collection.
	// Can make Enhanced_Data_Object?
	//  Or make Data_Object enhance itself once it has a Collection.
	//  Or could do Flags on a lower level.
	
	// Quite a complicated question. 
	//  Flags running as a collection of strings makes a lot of sense.
	//   Will be ordered etc.
		
	var parse_field_text = function(field_text) {
		field_text = field_text.replace(/not null/g, 'not_null');
		var is_unique = false;
		var is_indexed = false;
		var is_not_null = false;
		var is_read_only = false, is_pk = false;
		var field_words = field_text.split(' ');
		var flag_words = [];
		var str_data_type;
		var word;
		for (var c = 0, l = field_words.length; c < l; c++) {
			word = field_words[c];
			if (c < l - 1) {
				flag_words.push(word);
			} else {
				str_data_type = word;
			}
		}
		each(flag_words, function(i, v) {
			if (v == 'unique') {
				is_unique = true;
			}
			if (v == 'pk') {
				is_pk = true;
			}
			if (v == 'indexed') {
				is_indexed = true;
			}
			if (v == 'not_null') {
				is_not_null = true;
			}
			if (v == 'readonly' || v == 'read_only' || v == 'read-only') {
				is_read_only = true;
			}
		});
		var data_type = parse_data_type(str_data_type);
		var res = {
			//'is_unique': is_unique,
			//'is_indexed': is_indexed,
			//'is_not_null': is_not_null,
			'data_type': data_type
		}
		if (is_read_only) {
			res.read_only = is_read_only;
		}
		if (is_pk) {
			res.pk = is_pk;
		}
		if (is_unique) {
			res.unique = is_unique;
		}
		if (is_not_null) {
			res.not_null = is_not_null;
		}
		if (is_indexed) {
			res.indexed = is_indexed;
		}
		return res;
	}


	var parse_data_type = function(data_type_text) {
		
		//console.log('data_type_text ' + data_type_text);
		// will return the data type info as an object / array
		
		// could just return a string
		// could return [dt_name, length]
		
		// should not begin with a number
		
		//var rx_dt = /^(([a-z]|[A-Z]|_)\w*)(\([a-z]|[A-Z]|_\w+\))?$/;
		var rx_dt = /^(([a-z]|[A-Z]|_)\w*)(\((\d+)\))?/;
		
		// then check to see the match.
		
		var match = data_type_text.match(rx_dt);
		
		
		//console.log('match ' + stringify(match));
		
		if (match) {
			var dt_name = match[1];
			var dt_length = parseInt(match[4]);
			
			if (is_defined(dt_length) &! isNaN(dt_length)) {
				return [dt_name, dt_length];
			} else {
				return dt_name;
			}
		}
		
		//throw('parse_data_type stop');
	}
	
	
	var field_obj_to_text = function(field_obj) {
		//var res = [];
		
		var words = [];
		if (field_obj.unique) {
			words.push('unique');
		}
		if (field_obj.pk) {
			words.push('pk');
		}
		if (field_obj.indexed) {
			words.push('indexed');
		}
		if (field_obj.not_null) {
			words.push('not_null');
		}
		if (field_obj.read_only) {
			words.push('read_only');
		}
		
		
		/*
		
		if (is_defined(field_obj.length)) {
			words.push(field_obj.data_type);
			words.push('(');
			words.push(field_obj.length);
			words.push(')');
		} else {
			words.push(field_obj.data_type);
		}
		*/
		
		if (tof(field_obj))
		
		return words.join(' ');
	}


	// Could make a basic Data_Object too?
	//  Basic_Collection?
	
	// Then have different levels?
	var Fields_Collection = Class.extend({
		// a way of getting all the field names?
		
		// The Field_Collection could hold the context perhaps.
		
		'init': function(spec) {
			
			// could have a map of positions of fields?
			//  also, a Linked_List may be useful here.
			
			// That way fields could be quickly added. Order gets maintained. 
			
			// Fields are really used as a system of influencing the lower-level constraints and indices.
			//  They are a convenient way of representing information about a field.
			
			// Perhaps an Ordered_List makes sense.
			//  Like a Linked_List, a wrapper that uses a Linked List for the Ordered List functionality.
			
			// Fields are definitely kept in order that way.
			//  Linked_Map seeming like a useful data structure.
			
			this.okvs = new Data_Structures.Ordered_KVS();
			//this.containing_object = spec.containing_object;
			
			
		},
		
		'_get_field_index': function(field_name) {
			//var res = -1;
			//each()
			
			// Maybe a linked list would work best... that way we can search through it (iterate until stop) to find the relevant item.
			//  linked list with an index as well? map holding a link to the node that holds the field item.
			
		},
		

		// Could maybe test just the fields collection?
		//  So we make a new collection of fields not associated with a control?


		// Needs more work on this part...
		//  Making it polymorphic and flexible, covering all or at least enough cases.

		// Non polymorphic version would be a lot faster.
		//  Perhaps using an inner function for the [string, value] operations, and the
		//   iterative version makes use of that.
		'set': fp(function(a, sig) {
			// Prime candidate for optimization here.

			// When setting an indexed array Data_Object, it sets a field collection.
			//  This is the case with a Color Data_Object.
			//   It has fields for red, green, blue. Perhaps alpha.


			/* This needs to work:

			'fields': {
				'products': Products_Collection
			},

			*/

			// [field name, function (constructor)]

			// will add the field to the array.
			
			//console.log('Fields_Collection set a ' + stringify(a));
			//console.log('Fields_Collection set sig: ' + sig);
			//console.log('Fields_Collection set a ' + stringify(a));
			// and when this has 2 strings... 
			
			//throw 'stop';
			
			//console.log
			
			// [[n,s],[n,a]] - That looks possibly wrong anyway.

			// Using a (constructor) function in the field defintion.
			// ['networkInterfaces', NetworkInterfaces]

			var that = this;
			//var containing_object = that.containing_object;
			// str, str
			//  field_name, str_field_def
			// what about setting a single field with an array?
			
			// can check the formats - string, anything
			
			// Will have fairly versitile field definitions.
			
		    // [[['content', ['collection', 'control]]]]
			//console.log(">>> sig=" + sig);
			if (sig == '[a]') {
			
				//console.log('a.l ' + a.l);
			
				var item_or_arr = a[0];
				//var ioa_sig = get_item_sig(item_or_arr);
				var ioa_sig = get_item_sig(item_or_arr, 2);
				
				// want the signature that will go into the array.
				//  need to use a new option on get_item_sig
				//console.log('ioa_sig ' + ioa_sig);
				//console.log('item_or_arr ' + stringify(item_or_arr));
				// need to sort out this code...
				
				// But we don't want to misinterpret a single field as an array of fields.


				// ioa_sig [[s,~C],[s,s],[s,s],[s,~C],s]

				// array, string

				// [a,a]
				//  data type info is on the left.
				//  then the value(s) are on the right.


				//console.log('item_or_arr ' + stringify(item_or_arr));

				if (ioa_sig == '[s,s]') {
					// string name with string field representation
					var field_name = item_or_arr[0];
					var field_str_def = item_or_arr[1];
					
					//console.log('field_name ' + field_name);
					
					//console.log('*** *** field_str_def ' + field_str_def);
					
					var field_obj = parse_field_text(field_str_def);
					//console.log('field_obj ' + stringify(field_obj));
					
					
					var field_arr = [field_name, field_str_def, field_obj];
					
					//console.log('setting with field_arr ' + stringify(field_arr));
					
					this.set(field_arr);
					
					//field_obj.parent(containing_object);
					
				} else if (ioa_sig == '[s,f]') {
					// the function is a constructor function (should be one, maybe test this?)

					// A Class field.

					var field_name = item_or_arr[0];
					var field_str_def = 'Class';
					var field_obj = item_or_arr[1];

					var field_arr = [field_name, field_str_def, field_obj];
					
					// then actually do the set.
					
					//  find the index of the item 
					//console.log('putting in okvs field_name: ' + field_name);
					//console.log('putting in okvs field_name: ' + field_name);
					this.okvs.put(field_name, field_arr);

					//throw 'ioa stop';

				} else if (ioa_sig == '[s,s,o]') {
					// string name with string field representation
					var field_name = item_or_arr[0];
					var field_str_def = item_or_arr[1];
					var field_obj = item_or_arr[2];
					//var field_arr = [field_name, field_str_def, field_obj];
					//this.set(field_arr);
					
					
					
					var field_arr = [field_name, field_str_def, field_obj];
					
					// then actually do the set.
					
					//  find the index of the item 
					//console.log('putting in okvs field_name: ' + field_name);
					//console.log('putting in okvs field_name: ' + field_name);
					this.okvs.put(field_name, field_arr);
					//field_obj.parent(containing_object);
					
				} else {
					//console.log('other array, check for arr_of_arrs');
					//var ioa_sig = get_item_sig(item_or_arr);
					
					//console.log('ioa_sig ' + ioa_sig);
					
					// But there could be a collection - perhaps an abstract collection.
					//  I think indicate type as ~Collection.
					//  and ~C
					
					
					
					// n,s,s,? - the item in the ? is the defailt_value.

					// will use regex \d matching.

					var rx_test_sig_default_value = /\[n,\[s,s,\w\]\]/;


					// Ordinal position of fields...
					//  May need to be careful about that.


					if (ioa_sig == '[n,[s,s]]') {
						// a number, the index in array / sequence, then name, then data_type_name
						
						//console.log('item_or_arr ' + stringify(item_or_arr));
						
						var field_def = item_or_arr[1]; 
						var field_name = field_def[0];
						var field_type_name = field_def[1];
						
						//console.log('field_name ' + field_name);
						//console.log('field_type_name ' + field_type_name);
						
						if (field_type_name == 'collection') {
							// should be a collection of that type.
							
							//var field_arr = [field_name, field_type_name, field_item_type_name];#
							if (field_item_type_name) {
								var field_arr = [field_name, [field_type_name, field_item_type_name]];
							} else {
								var field_arr = [field_name, field_type_name];
							}
							
							// then actually do the set.
							//  find the index of the item 
							//console.log('putting in okvs field_name: ' + field_name);
							this.okvs.put(field_name, field_arr);
							
							
						} else {
							
							// I think the field collection here is really just for storing info about the fields.
							//  It is when the objects represented by fields are get and set that the field functionality really comes into play.
							
							// can be the same as with collection!
							//  may do some more checks?
							
							var field_arr = [field_name, field_type_name];
							
							//console.log('field_arr ' + stringify(field_arr));
							
							// then actually do the set.
							//  find the index of the item 
							//console.log('putting in okvs field_name: ' + field_name);
							this.okvs.put(field_name, field_arr);
							//console.log('done okvs put');
							
							//throw('7)stop');
						}
					} else if (ioa_sig.match(rx_test_sig_default_value)) {
						//console.log('matches regex, has default value.')
						//console.log('ioa_sig ' + ioa_sig);
						//throw 'stop';
						var field_def = item_or_arr[1]; 
						//console.log('item_or_arr ' + stringify(item_or_arr));
						var field_name = field_def[0];
						var field_type_name = field_def[1];
						var field_default_value = field_def[2];


						if (field_type_name == 'collection') {
							// should be a collection of that type.
							throw 'Default values for Collection not supported';
							//var field_arr = [field_name, field_type_name, field_item_type_name];#
							if (field_item_type_name) {
								var field_arr = [field_name, [field_type_name, field_item_type_name]];
							} else {
								var field_arr = [field_name, field_type_name];
							}
							
							// then actually do the set.
							//  find the index of the item 
							//console.log('putting in okvs field_name: ' + field_name);
							this.okvs.put(field_name, field_arr);
							
							
						} else {
							
							// I think the field collection here is really just for storing info about the fields.
							//  It is when the objects represented by fields are get and set that the field functionality really comes into play.
							
							// can be the same as with collection!
							//  may do some more checks?
							
							var field_arr = [field_name, field_type_name, field_default_value];
							
							//console.log('field_arr ' + stringify(field_arr));
							
							// then actually do the set.
							//  find the index of the item 
							//console.log('putting in okvs field_name: ' + field_name);
							this.okvs.put(field_name, field_arr);
							//console.log('done okvs put');
							
							//throw('7)stop');
						}

					}

					// if it's a string and an object
					
					
					if (ioa_sig == '[s,[s,s]]') {
						var field_name = item_or_arr[0];
						var field_def = item_or_arr[1];
						var field_type_name = field_def[0];
						var field_item_type_name = field_def[1];
						
						if (field_type_name == 'collection') {
							// should be a collection of that type.
							
							//var field_arr = [field_name, field_type_name, field_item_type_name];
							var field_arr = [field_name, [field_type_name, field_item_type_name]];
							// then actually do the set.
							//  find the index of the item 
							//console.log('putting in okvs field_name: ' + field_name);
							this.okvs.put(field_name, field_arr);
						}
					} else {
						//console.log('* item_or_arr ' + stringify(item_or_arr));
						//console.log('ioa_sig ' + ioa_sig);
						//console.log('a ' + stringify(a));
						
						// Have changed the way that signatures work... now it's a for array.


						if (ioa_sig == '[]') {
						    

						} if (ioa_sig == '[o]') {
							//console.log('ioa sig is an object ');
							//console.log('item_or_arr ' + stringify(item_or_arr));
							throw 'stop';
						} else {
							//console.log('pre stop');
							//throw ('6)stop');
							
							

							// Should have a more complete picture of the fields... where do these come from?
							
							// [s,o] object being a more complex definition.
							//  possibly a compound object.

							// An object with more field definitions declared within it.
							//  Will opt for lazy loading in various cases where possible.
							//   But some default values will need to be loaded at times.
							//    May also need to get loaded upon stringify.

							// 



							/*
							["object", "dom_attributes", "string"]
							ioa_sig [s,s,s]
							*/
							
							/*
							'node': 'object',
							'attributes': 'dom_attributes',
							'tagName': 'string'
							*/

							// Maybe do more testing of Data_Object or Data_Object fields.
							//  Will try a single field of a Data_Object with a particular type.

							if (ioa_sig == '[s,o]') {
								// it's a compound definition.
								// will need to create the next level down, ie create the new Data_Object, and set its
								//  fields.

								// An object indicates it's a Data_Object.
								//  It's a field that gets declared with a particular data_type.
								//   That goes into the fields and constraints for that object.
								var fieldName = item_or_arr[0];
								var fieldDef = item_or_arr[1];

								// So there is a data type name? ie field name, and its data inside?
								// anyway, need to make a Data_Object with those fields.

								// Need to be able to make a Data_Object using fields that are supplied as an object
								//  rather than an array of arrays.



								//console.log('fieldDef ' + stringify(fieldDef));

								var field_arr = [fieldName, ['data_object', fieldDef]];
								this.okvs.put(fieldName, field_arr);

								// can we put this in relatively easily?
								//  the complicated part is interpreting the field.

								//throw 'stop';

							}

							//console.log('ioa_sig ' + ioa_sig);
							//console.log('item_or_arr ' + stringify(item_or_arr));
							//console.log('OTHER CASE!!!!');

							// [s,[o]]
							//  means a named array/collection of objects/dataobjects.
							//   in that case, we create a collection, and give it the type defined inside.

							if (ioa_sig == '[s,[o]]') {
								var fieldName = item_or_arr[0];
								var fieldItemDef = item_or_arr[1][0];

								// needs to make a collection field.

								// var field_arr = [field_name, [field_type_name, field_item_type_name]];

								// But won't go making nested data types?
								//  needs to ensure the types specified inside match OK,
								//  so need to (recursively) go into the definition.

								//console.log('fieldItemDef ' + stringify(fieldItemDef));

								// include more data in the info about the fields?
								//  do that to make it work in a more deeply nested way?
								//   or think some more about nested fields.

								// The field needs to be defined as being a collection of that type.
								//var field_arr = [fieldName, ['collection', field_item_type_name]];
								var field_arr = [fieldName, ['collection', fieldItemDef]];
								this.okvs.put(fieldName, field_arr);


								//throw 'stop';

							}



							if (ioa_sig == '[s,~C]') {
								// string, abstract collection
								
								// Items in an array...

								// need to set the field to hold an abstract collection....
								
								// Setting a field to an abstract collection of strings.
								//  We have supplied the abstract collection but we want there to be a collection instance.
								
								// Need to create the field of that actual type within the field collection.
								
								var t_abstract = native_constructor_tof(item_or_arr[1]._type_constructor);
								//console.log('t_abstract ' + t_abstract);
								//console.log('item_or_arr[1] ' + stringify(item_or_arr[1]));
								

								if (t_abstract) {
									var field_name = item_or_arr[0];
									var field_arr = [field_name, ['collection', t_abstract.toLowerCase()]];
									//console.log('field_name ' + field_name);
									//console.log('field_arr ', field_arr);
									this.okvs.put(field_name, field_arr);
								} else {
									var field_name = item_or_arr[0];
									var field_arr = [field_name, 'collection'];
									//console.log('field_name ' + field_name);
									//console.log('field_arr ', field_arr);
									this.okvs.put(field_name, field_arr);
								}
								
								// we can make a new field without the abstract condition of the constructor.
								//  will then eventually get these tags, and css-matched tags operating.
								// Then will be able to set up behaviours relatively easily.
								
								// Typed collections as data types is another thing to consider, as well as the syntax for declaring
								//  the abstract typed collections.
								// This hopefully will not introduce too much code bloat, it will be very good to get this system
								//  compressed right down for use in client apps. Could have things reduced down to a few KB (maybe 12?)
								//   and this would also allow for various application items to be working nicely.
								
								
								
								//throw 'stop';
								
							}
						}
						
						
					}
					// [[s,[s,s]]]
					// eg ['content', ['collection', 'control']]
					// [items]
					// [[str_name, str_type]]
				
					// could be a collection of something.
					
					var aoa = is_arr_of_arrs(item_or_arr);
					//console.log('aoa ' + aoa);
					
					if (aoa) {
						each(item_or_arr, function(i, v) {
						    that.set(v);
						});
					}
					/*
					if (aoa) {
						//var this_set_call = this.set.call;
						var this_set = this.set;
						for (var c = 0, l = item_or_arr.length; c < l; c++) {
							this_set(item_or_arr[c]);
						}
					}
					*/
				}
			};
			
			if (sig == '[o]') {
				// add each one
				//var that = this;
				var this_set_call = this.set.call, a0 = a[0];
				for (i in a0) {
				    //console.log(this_set_call);
				    //this_set_call(this, [i, a0[i]]);
				    this.set.call(this, [i, a0[i]]);

				}
				/*
				each(a[0], function(field_name, field_def) {
					//console.log('i ' + stringify(i));
					//console.log('v ' + stringify(v));
					//console.log('');
					that.set([field_name, field_def]);
				});
				*/



			}

			// then for setting in other ways...
			//  name then field definition.


			if (a.l > 1) {
				//console.log('longer a.l');
				//throw 'stop';
				this.set(a);
			}


			/*
			if (a.l == 1 && tof(a[0]) == 'array') {
				each(a[0], function(i, field_arr) {
					
				});
			}
			*/
			// [s,[s,o]]
			
			// s, o
			// o
			
			// the object representation of a field, can have various flags.
			
			/* var res = {
				'is_unique': is_unique,
				'is_indexed': is_indexed,
				'is_not_null': is_not_null,
				'data_type': data_type
				
				// possibly name
			
			} */
			
			// str, arr
			//  
			
		}),
		'get': function(a0) {
			//console.log('Fields_Collection get sig: ' + sig);
			var ta0 = typeof a0;
			if (ta0 == 'undefined') {
				// get them all
				// just the objects though?
				return this.okvs.values();
			} else if (ta0 == 'string') {
				return this.okvs.get(a0);
			}
			/*
			if (sig == '[s]') {
				// get a single field.
				//console.log('fc get ' + a[0]);
				
				
				//console.log('this.okvs.length() ' + this.okvs.length());
				// does it have anything with that key?
				
				var res = this.okvs.get(a[0]);

				//console.log('a[0] ' + a[0]);
				//console.log('this.okvs.keys() ' + this.okvs.keys());

				//console.log('Fields_Collection get ** res ' + stringify(res));
				return res;
			}
			*/
		},
		/*
		'_get': fp(function(a, sig) {
			//console.log('Fields_Collection get sig: ' + sig);
		
			if (sig == '[]') {
				// get them all
				// just the objects though?
				return this.okvs.values();
			}
			if (sig == '[s]') {
				// get a single field.
				//console.log('fc get ' + a[0]);
				
				
				//console.log('this.okvs.length() ' + this.okvs.length());
				// does it have anything with that key?
				
				var res = this.okvs.get(a[0]);

				//console.log('a[0] ' + a[0]);
				//console.log('this.okvs.keys() ' + this.okvs.keys());

				//console.log('Fields_Collection get ** res ' + stringify(res));
				return res;
			}
		}),
		*/
		'fields': function() {
			return this.get.apply(this, arguments);
		},
		/*
		'_fields': fp(function(a, sig) {
			return this.get.apply(this, a);
		}),
		*/

		'out': function(key) {
			this.okvs.out(key);
		},
		'clear': function() {
			
		}
	})

	Fields_Collection.parse_field_text = parse_field_text;
	Fields_Collection.parse_data_type = parse_data_type;


	// Data_Object.js

	var data_value_index = 0;
	var data_value_abbreviation = 'val';
	
	// do data objects get an ID when they are initialized.
	jsgui.__data_id_method = 'init';
	
	var obj_matches_constraint = Constraint.obj_matches_constraint;
	var native_constructor_tof = jsgui.native_constructor_tof;
	
	var value_as_field_constraint = Constraint.value_as_field_constraint;
	
	var Ordered_String_List = Data_Structures.Ordered_String_List;
	// gets a value as a field_constraint object.
	//var ensure_data_type_data_object_constructor = j.ensure_data_type_data_object_constructor;
	
	
	// So, Data_Objects may have a Page_Context, Application_Context, or just Context.
	//  The Context would include info such as which browser is being used.
	//   Controls will render differently depending on the context.
	
	// jsgui.data_types_info and data_type will become much more closely integrated into this.
	//  Perhaps there should be another module level for this.
	
	// Not sure about introducing it here. Maybe in lang-essentials? Don't want that to get too big.
	
	// Data_Object Flags is the next thing here...
	//  But that requires a Collection.
	// Can make Enhanced_Data_Object?
	//  Or make Data_Object enhance itself once it has a Collection.
	//  Or could do Flags on a lower level.
	
	// Quite a complicated question. 
	//  Flags running as a collection of strings makes a lot of sense.
	//   Will be ordered etc.
	
	// Could make a basic Data_Object too?
	//  Basic_Collection?
	
	// Then have different levels?

	
	var Mini_Context = jsgui.Class.extend({

		// Need quite a simple mechansm to get IDs for objects.

		// They will be typed objects/

		'init': function(spec) {


			var map_typed_counts = {}
			var typed_id = function(str_type) {
				throw 'stop Mini_Context typed id';

				var res;
				if (!map_typed_counts[str_type]) {
					res = str_type + '_0';
					map_typed_counts[str_type] = 1;
				} else {
					res = str_type + '_' + map_typed_counts[str_type];
					map_typed_counts[str_type]++;
				}
				return res;
				/*
				var iTypedIds = {};
	    		if (typeof iTypedIds[str_type] === 'undefined') {
	    				iTypedIds[str_type] = 1;
	    		}

	    		var typed_id = function(str_type) {
	    			if (typeof iTypedIds[str_type] === 'undefined') {
	    				iTypedIds[str_type] = 1;
	    			}
	    			var res = iTypedIds[str_type];
	    			iTypedIds[str_type] = iTypedIds[str_type] + 1;
	    			return res;
	    		};
	    		this.qid = qid;
	    		*/
	    	}
			this.new_id = typed_id;
			//new_id
		},

		'make': function(abstract_object) {
			if (abstract_object._abstract) {
				//var res = new 
				// we need the constructor function.

				var constructor = abstract_object.constructor;
				console.log('constructor ' + constructor);

				
				//throw 'stop';

				var aos = abstract_object._spec;

				// could use 'delete?'
				aos.abstract = null;
				//aos._abstract = null;
				aos.context = this;

				//console.log('abstract_object._spec ' + stringify(abstract_object._spec));
				// Not sure it is creating the right constructor.


				var res = new constructor(aos);
				r
				return res;
			} else {
				throw 'Object must be abstract, having ._abstract == true'
			}
		}

	});


	// Enhanced_Data_Object with flags seems like one of the best options.
	//  These flags can easily correspond to CSS classes in an MVC system too, CSS will be automatically updated when the object's properties change.
	
	// And Control will inherit from Enhanced_Data_Object.
	//  Flags is not a massive enhancement, but there could be more.
	//  Could maintain a Collection of references to other Data_Objects and Enhanced_Data_Objects more conveniently.
	
	
	// Want either express-like routing, or to lift the routing out of Express.
	//  It may be worth integrating Express right into this, for the things that Express does.
	//   There may be various things that Express does not do, but could be called upon to assist with.
	//    JSGUI seems very much about building the HTML, and acting as MVC on client and server. It could use Express.
	//     Or it could incorporate Express.
	//      Perhaps JSGUI can be used by Express to render pages.
	//       Will have it compatable, but there will be some overlapping features.
	//       jsgui could use some Express routing by default.
	
	// Having je suis XML running soon will be nice!
	//  Could serve from a directory.
	//   Want to get that working as that will really be the code path that is taken.
	//   Could get a site up and running using that before so long...
	//    But also want to have the discussion forum running. Doubt I want all the ORM for that, but will be able to get it running in a document database before too long.
	//   Then the system will definitely be quite fast.
	//    Would not be all that much user data, but would need to start to keep it backed up / consistent.
	
	// Data_Object is not using 'nested' at the moment.
	
	// Nested has got fairly complicated, it's fairly good though.
	//  Perhaps it will wind up being refactored into Data_Object and uses of that.
	
	// Currently Nested is dealing with data types.
	
	// We need to ensure that data getting put into Data_Objects meets data type criteria.
	// Nested also has the ability of transforming data.
	// 1) Meets the criteria
	// 2) Meets criteria for transformation into the correct data
	
	// The data types can be dealing with nested information too.
	//  I think dealing with nested information will wind up in the core.
	//  The core may wind up being abit big, but it's all important stuff.
	// With 4G and the use in various environments like conference halls, downloading 32KB onto an iPad would not be a problem.
	//  I think the whole thing could load very quickly, then present the user with a powerful application.
	
	

	// The schemas system is going to be namespaced, and will use a Namespaced_Dict object, which will use a B+ tree, for retrieval by prefix.
	
	// Should possibly be called constrints.
	// Having Constraints built right into Data_Object may be the most suitable thing to do.
	
	// It is the same terminology as databases.
	//  Field constraints makes sense too.
	
	// Constraints that apply to whole collections - the same language used to talk about indexes.
	//  Indexes will be used to power unique constraints, so it'll make use of the 'constraint' terminology.
	
	// Bringing the focus to 'constraints' will help bridge the gap into the database world.
	// Things will be expressable in a way that is more closely transferrable,
	//  though some constraints in this system will be represented using types in other systems.
	
	// This will possibly become quite a widely used MVC paradigm.
	
	// I think having plenty of tests, API documentation, and well-written tutorial / reference documentation will help a lot.
	//  Can have quite a few pages of this documentation with Google adverts.
	// I would be interested to see how much a small amount of advertising on the documentation part of my site will make.
	//  Also, advertising will not be shown to the paying customers.
	
	
	
	// constraint function?
	//  and can give it multiple constraints?
	
	// be able to get information about the constraints that are applied to a Data_Object as well.
	//  Remember, the constraints won't be stored in a collection.
	
	
	// They will be called constraints.
	
	// constraint?
	// singular does make sense because we do keep giving them maps and arrays to process.
	
	// The constraints in use on the Data_Object will be field constraints.
	
	// Data_Object needs more work to do with setting, getting, and checking against its fields.
	//  Have checking for collections, but need checking for changing a field's value.
	
	//  The fields system here will have clear, logical results when testing.
	//   Possibility of connection a fields check onto the object class, or having one for all objects of that class?
	//   Don't want to be holding lots of repeated data about fields in memory, though it's not really a major problem to begin with.
	
	
	
	// easy api with add_field etc...
	// ensure_field.
	// remove_field
	//  would need to remove indexes
	
	
	// perhaps just call them field_constraints for the moment.
	//  saying a field is indexed... that has more to do with the collection.
	
	// Will not use a 'Field' object.
	//  Fields will be held in the form [name, [string_representation, obj_representation]]
	
	// Fields_Collection?
	//  This seems like a nice encapsulation of the fields functionality, stopping the Data_Object from becoming too complicated itself.
	//   The fields may have some indexes added for faster lookup at a later stage, Data_Object can easily use the API.
	//  set_field  (ensure_field) / set
	//  remove_field / remove / out
	//  get_field / get(field_name)
	//  get_fields / get()
	//  set_fields / set(map or array)
	//   other lower level things, remove_field_index(field_name), remove_field_unique(field_name), remove_field_flag(field_name, flag_name), add_field_flag etc
	//    also while suppressing raising of events (when an index has been deleted, this will be about updating the field so that it does not refer to that index.
	//    these will be carried out when indexes or constraints (that refer to fields) are added/removed
	
	// Will also raise events for when fields are added, removed, or changed.
	//  This will enable other components, that refer to fields, such as Constraints and Indexes, to remain updated.
	//   When adding / removing constraints, will need to have that update the field info, maybe modify fields while suppressing events.
	
	// All lower level collection systems...
	//  not arranged around Data_Objects
	
	// The Index_System does the job with indexes on a collection. 
	
	
	// Fields referring to the field constraints.
	//  Field constraints being their own classes... fields not being so?
	
	// Fields referring to their actual indexes. Collection has the Index_System, but we need to be referring to indexes from the field?
	//  or just hold the info in the field that it is to be indexed. Modifying this can alert the collection so that it removes the index from the field.
	
	// Some constraints / indexes will only apply to fields of objects within a collection.
	
	
	// Constraints_Collection
	// Indexes_Collection?
	
	// [field_name, [str_repr, obj_repr]]
	
	// will coerce the types a little - ensure it is arr3_field format
	//  [name, str_def, obj_def]
	
	
	// This will hold a collection of fields that are used by an object.
	//  They get maintained in a particular order.
	
	// But what exactly are these fields?

	// Stores an array of fields...?

	
	//var map_jsgui_ids = {};
	
	// Won't be a whole map of IDs for every object made by jsgui.
	//  They will be stored within a Page_Context.
	//  There had been a great slowdown for subsequent requests. Definitely don't want that.
	
	/*
	
	var new_data_value_id = function() {
		var res = data_value_abbreviation + '_' + data_value_index;
		data_value_index++;
		return res;
	};
	*/
	
	// I think Data_Object will be made so that it can act as a Data_Value.
	//  It will work in a very constrained mode, such as only holding one value, such as a string.
	//  It may also hold a field name and a value.
	// Data_Object(String);
	
	// Collection using a Data_Value constraint?
	//  Constrinat testing is already in Data_Object.
	
	// Data_Value is likely to have a type. It could have type checking. Needs to be lightweight though.
	
	// I think the Data_Value will also have events.
	//  Change event being the main one of interest at the moment.

	var Evented_Class = Class.extend({
		'raise_event': fp(function(a, sig) {
			// The events system is not working right on the server.
		
			//console.log('Data_Object.raise_event');
			// a general event listener would be nice... so we don't need to tell it what events we are listening for, but it presents us with that
			//  information.
			
			// A more generalized event handler?
			
			// this._bound_general_handler
			//  useful when not quite sure what the event name is... can help with debugging when we can output the event name.
			
			//console.log('1) raise_event sig ' + sig);
			//console.log('raise_event a.l ' + a.l);
			var that = this;

			// Will change the way this works fairly significantly.
			//  First arg is the event name
			//  Second, third etc are the first, second stc arguments.

			// Won't be so much about checking the sig.
			// Maybe a particular one for when it is just a string (no arguments)?

			//  Will get the arguments into an array, and use that for apply.

			// Bound general handlers... get called with the event name as the first param.
			//  Then the other event params as further params.
			
			if (sig == '[s]') {
				// just raise an event, given with no parameters,
				//  maybe like 'started'.
				
				var target = this;
				var event_name = a[0];

				//console.log('Data_Object raise_event ' + event_name);
				
				var bgh = this._bound_general_handler;
				
				// bound general handler - handles all events???
				
				//console.log('bgh ' + bgh);
				
				// not using general handlers for the moment...

				// Will be a convenient way to listen to all events from an object.

				/*

				if (bgh && tof(bgh) == 'array') {
					each(bgh, function(i, v) {
						//console.log('calling bgh handler');
						
						v.call(target, target, event_name);
					});
				}
				if (that._parents) {
					console.log('Data_Object raise_event that._parents.length ' + that._parents.length);
				}

				*/
				
				//var parent_obj;

				// Maybe don't do that for the moment.
				//  It may be better to not have this automatic as it could slow things down, make things more complex.

				/*

				each(that._parents, function(parent_id, parent_and_position_pair) {
					//parent_obj = parent_and_position_pair[0];
					//parent_obj.raise_event(target, event_name);
					parent_and_position_pair[0].raise_event(target, event_name);
				});
				*/
				var be = this._bound_events;
				
				// is there really a new context?
				//  should contexts have their own IDs?
				
				//console.log('this.__id ' + this.__id);
				
				// These can get too many bound events after multiple requests at the moment.
				//  Need to fix this.
				//console.log('be', be);
				//console.log('this', this);
				if (be) {
					// This is attaching events to the same object.
					//  Not sure why, but this needs to be fixed.


					var bei = be[event_name];

					//console.log('bei', bei);
					//console.log('tof bei', tof(bei));
					if (tof(bei) == 'array') {
						//console.log('1) raise_event bei.length ' + bei.length);
						var res = [];

						each(bei, function(i, v) {
							// I think it knows what the name of the event
							// is already.

							// get the target, the event name and the params
							// all at once?
							// That seems OK for an event handler.
							// Could have a simpler handler? But maybe it
							// hides necessary complexity.
							// perhaps don't need to put target in twice,
							// having it as a parameter?
							// maybe the this context would be enough.

							// just call it?
							//  or is there mor abstraction?

							//v.call(target, target, event_name);
							//console.log('pre call');
							res.push(v.call(target));

							// Perhaps I have sussed out the problem.
							//  Or some of it?


						});

						//console.log('Evented_Class raise_event [s] res', res);
						return res;
					}// else if (tof(bei) == 'function') {
					//	bei.call(target, target, event_name);
					//}
				}
			}

			if (a.l >= 2) {
				var target = this;
				var event_name = a[0];

				//console.log('event_name ' + event_name);

				var additional_args = [];
				for (var c = 1, l = a.l; c < l; c++) {
					additional_args.push(a[c]);
				}

				var be = this._bound_events;
				//console.log('be ' + tof(be));
				if (be) {

					// The controls that are activated on the clients need to have bound events.



					//console.log('event_name', event_name);
					var bei = be[event_name];
					//console.log('bei ', bei);
					if (tof(bei) == 'array') {
						//console.log('1) raise_event bei.length ' + bei.length);

						if (bei.length > 0) {
							var res = [];

							// They are handlers that get called.

							each(bei, function(i, v) {
								// I think it knows what the name of the event
								// is already.

								// get the target, the event name and the params
								// all at once?
								// That seems OK for an event handler.
								// Could have a simpler handler? But maybe it
								// hides necessary complexity.
								// perhaps don't need to put target in twice,
								// having it as a parameter?
								// maybe the this context would be enough.

								//v.call(target, target, event_name);
								//console.log('1) additional_args', additional_args);
								res.push(v.apply(target, additional_args));
								// Perhaps I have sussed out the problem.
								//  Or some of it?


							});
							//console.log('Evented_Class raise_event [s] res', res);
							return res;
						} else {
							return false;
						}

						
						//console.log('2) raised the bound events');
					}
					// Or if it's just a function?

				}

			}

			// With a single event handler being raised, it's hard to pass on the result of that event.

			// Click events get raised, but they would have a result.
			//  DO)M events are a bit different to the standard events but work within the same system.





			// Raise event with multiple arguments?
			//  First argument is the event name. Arguments after that are the arguments for the handler.
			
				/*
			if (a.l == 2) {
				// a.re()
				// a.re calling the function?
				// or even a.r?
				// recalling the original function could work.
				//console.log('2) a ' + stringify(a));
				//console.log('a[0] ' + a[0]);
				//console.log('this ' + this);
				
				//console.log('***** a ' + stringify(a));
				
				return this.raise_event(this, a[0], a[1]);

			} else if (a.l == 3) {

				// binds a function to the event.
				var target = a[0];
				//console.log('target a[0] ' + a[0]);
				
				//console.log('!!!!!a ' + stringify(a));
				
				var event_name = a[1];
				var event_params = a[2];
				
				
				
				if (tof(event_params) == 'collection') {
					var stack = new Error().stack
					console.log(stack);
					
					throw '25) stop';
					
				}
				
				
				var bgh = this._bound_general_handler;
				
				
				if (bgh && tof(bgh) == 'array') {
					
					//console.log('bgh.length ' + bgh.length);
					each(bgh, function(i, v) {
						//console.log('calling bgh handler');
						
						v.call(target, target, event_name, event_params);
					})
				}
				
				
				// the parent Collection will be told about a change for example.
				//  Perhaps there should be two stages of propagation... one so that the parent can do its updates (like index), another so that it
				//  could call the events in a bubbling order.
				
				// may use a .parent function
				// DataObjects may have more than one parent...
				//  But it does make sense for a data heirachy.
				//  Some things will be expressable as data heirachies.
				//   Particularly objects in documents, collections.
				//  Something could be in a number of collections though.
				//  Will need to deal with these cases, for the moment want to get this server execution path going.
				
				// It's doing quite a few things in the mean-time, the various resources will all help the system fir together.
				//  It would be very interesting for users of the site to view real-time edits and updates.
				// Perhaps websockets could come in use for showing these things.
				// The site will be supporting quite a lot of content.
				//  Not sure quite how many page views there will be
				//  Likely to go for a fairly small amount of advertising when people are viewing the project documentation.
				// I think there could be quite good pieces of documentation and demos.
				// Discussions too.. there will be discussions about pieces of code that I release.
				
				
				// need to deal with parents of Data_Objects... have it so that they are the collection that the object was put inside by default.
				
				// it will do this for each parent.
				
				// Will be a lot of event propagation.
				//  It could turn out very useful. Will have a 2-way interaction.
				//   More finely grained than Backbone.
				
				
				//var each_parent = function(callback) {
				//	
				//}
				
				// It is up to the item itself to raise the event in its parent(s).
				
				
				//each(that._parents, function(parent_id, parent_and_position_pair) {
				//	var parent_obj = parent_and_position_pair[0];
				//	parent_obj.raise_event(target, event_name, event_params);
				//});
				
				
				//if (this.has('parent')) {
					//console.log('has parent');
					
				//	this.get('parent').raise_event(target, event_name, event_params);
				//}
				


				// _bound_events needs some looking at - currently major performance issues.
				//   1 July 2013 still causing major performance issues... keeps getting bigger when new
				//    pages are served.
				var be = this._bound_events;
				
				//console.log('this.__id ' + this.__id);
				
				if (be) {
					var bei = be[event_name];
					if (tof(bei) == 'array') {
						//console.log('2) raise_event bei.length ' + bei.length);
						//console.log('');
						each(bei, function(i, v) {
							// I think it knows what the name of the event
							// is already.

							// get the target, the event name and the params
							// all at once?
							// That seems OK for an event handler.
							// Could have a simpler handler? But maybe it
							// hides necessary complexity.
							// perhaps don't need to put target in twice,
							// having it as a parameter?
							// maybe the this context would be enough.
							
							//console.log('event_params ' + stringify(event_params));
							
							//v.call(target, target, event_name, event_params);
							//console.log('tof(event_name) ' + tof(event_name));
							//console.log('tof(event_params) ' + tof(event_params));
							//console.log(
							
							
							
							//v.call(target, target, event_name, event_params);
							//console.log('calling');
							v.call(target, event_params);
							
							// the bound events...
							//  expect target to be a property of the events.
							
							
							
						});
					}
				}
				
			}

			*/

			return [];
		}),

		// also just raise and trigger?

		'raise': function() {
			return this.raise_event.apply(this, arguments);
		},
		'trigger': function() {
			return this.raise_event.apply(this, arguments);
		},
		
		// fp this
		// 
		

		// fp losing the context?


		// Could do further tests on fp to see that it's dealing with the context (this) OK?
		//  Maybe fp will only work for anonymous functons?
		//   we could come up with another way of defining them if necessary.
		// I don't think this made the difference - I think fp is working and tested with
	    //  context.
        /* ************************* */
        /* *** not used anywhere *** */
	    /* ************************* */
		'__add_event_listener': function (eventName, handler) {
			var a = arguments;
			if (a.length == 1) {
				handler = eventName;
				eventName = null;
			}

			if (is_defined(eventName)) {
				this._bound_events = this._bound_events || {};
				
				// removing from a bound general handler being slow?
				//  perhaps... but we won't have so many of these anyway.
				//  could get id for object and have it within collection.
				//   But not sure about using collections for events... collections use events...?
				if (!this._bound_events[eventName]) this._bound_events[eventName] = [];
				
				var bei = this._bound_events[eventName];
				if (tof(bei) == 'array') {
					//console.log('add_event_listener bei.length ' + bei.length);
					bei.push(handler);
				};
			}
		},

		'add_event_listener' : fp(function(a, sig) {
			
			// event listener for all events...
			//  that could work with delegation, and then when the code finds the event it interprets it.
			//console.log('');
			//console.log('data_object add_event_listener sig ' + sig);

			// Why is this getting called so many times, for the same object?



			//console.log('');
			// Why is the bound events array getting so big?
			
			if (sig == '[f]') {
				var stack = new Error().stack;
				console.log(stack);
				throw 'stop';
				this._bound_general_handler = this._bound_general_handler || [];
				if (tof(this._bound_general_handler) == 'array') {
					this._bound_general_handler.push(a[0]);
				};
			}
			
			if (sig == '[s,f]') {
				// bound to a particular event name
				
				// want the general triggering functions to be done too.
				//  with a different function
				var event_name = a[0], fn_listener = a[1];
				//console.log('event_name ' + event_name);
				this._bound_events = this._bound_events || {};
				
				// removing from a bound general handler being slow?
				//  perhaps... but we won't have so many of these anyway.
				//  could get id for object and have it within collection.
				//   But not sure about using collections for events... collections use events...?
				if (!this._bound_events[event_name]) this._bound_events[event_name] = [];
				
				var bei = this._bound_events[event_name];
				//console.log('this._id() ' + this._id());
				if (tof(bei) == 'array') {
					//console.log('add_event_listener bei.length ' + bei.length);
					bei.push(fn_listener);
				};
			}
			
			//console.log('ael finished');
			
			

			// an index that keeps track of the positions of the items
			// in it?
			// so functions could get added (no string key, just put
			// there).
			// how to get the order back quickly? Is there a way to
			// avoid the indivual comparisons?
			// could tag the functions with something?

			// Could be done differently with different data structures.
			// Not for now.
			// Could retain a node in a linked list. That way it could
			// be deleted quickly.

			// Quite simple with an array. This code with the type
			// checking leaves the possibility of putting in a different
			// data structure. Linked list could be quite good. Can
			// quickly insert onto the end.
			// Can quickly remove a node (and we'll keep track of it
			// through a closure in this function, this fn will return
			// the remove fn).

			// ll_ensure?
			
			//ll_ensure(this, '_bound_events')
			
			//this.ensure()?

		}),

		// A way of proxying functions below?
		//  Or simply use function alias?
		'on': function() {
			// However, need to make use of some document events.
			//  With some controls, we need to pass through 

			return this.add_event_listener.apply(this, arguments);


		},

		'remove_event_listener': function(event_name, fn_listener) {
			// needs to go through the whole array?
			// think so....

			//console.log('remove_event_listener');
			//console.log('this._bound_events', this._bound_events);
			if (this._bound_events) {
				//console.log('event_name', event_name);
				var bei = this._bound_events[event_name] || [];

				var tbei = tof(bei);
				//console.log('tbei', tbei);

				if (tbei == 'array') {
					// bei.push(fn_listener);

					var c = 0, l = bei.length, found = false;

					//console.log('l', l);

					while (!found && c < l) {
						if (bei[c] === fn_listener) {
							found = true;
						} else {
							c++;
						}
					}
					//console.log('found', found);
					//console.log('c', c);
					if (found) {
						bei.splice(c, 1);
					}
				};
			}

			
		},

		'off': function() {
			// However, need to make use of some document events.
			//  With some controls, we need to pass through 

			return this.remove_event_listener.apply(this, arguments);

		},
		'one': function(event_name, fn_handler) {

			var inner_handler = function(e) {

				fn_handler.call(this, e);
				this.off(event_name, inner_handler);
			};

			this.on(event_name, inner_handler);
		}
	});


	
	var Data_Value = Evented_Class.extend({
		'init': function(spec) {
			// the spec will be the value.
			//  could be the value and its type.
			
			//console.log('jsgui.__data_id_method ' + jsgui.__data_id_method);
			//throw 'stop';
			
			// so if the data_id_method is lazy, we get the id through a function.
			
			// Could take the context as another parameter...
			//  Can make it more flexible in terms of how it gets initialised.
			//  Data_Value(value) makes the most sense.

			if (spec && spec.context) {
				this._context = spec.context;

			}

			if (spec) {
				//console.log('!* spec.value ' + spec.value);
				//console.log('spec ' + stringify(spec));
			}

			if (spec && is_defined(spec.value)) {
				this._ = spec.value;
			}
			
			if (jsgui.__data_id_method == 'init') {
				//throw 'stop';
				// and there may be a map in the context.
				
				if (this._context) {
					
					// the context no longer keeps a map of the objects.
					//  Will work more on the relationships in a bit.



					//this._context.map_objects[this.__id] = this;
				} else {
					// don't want to be using IDs out of context.
					
					//throw 'Data_Value needs context';
					
					// but we'll try this - not setting the ID.
					//  really it needs an ID when it's in a page.
					//  Data_Values should be able to work at other times, such as rendering HTML examples.
					
					// But maybe it should be able to operate with no context or ID.
					//  It may be a demand of the context that it has an ID.
					//   (maybe not is some contexts though).
					
					//this.__id = new_data_value_id();
					
					
					
					//map_jsgui_ids[this.__id] = this;
					
					
				}
			}
			
			//this._val = spec;
			
			this.__type = 'data_value';
			
			this._bound_events = {};


			this._relationships = {};
		},
		'get': function() {
			//return this._val;
			return this._;
		},
		'value': function() {
			return this.get();
		},
		'toObject': function() {
			//if (this._.toObject) {
			//	return this._.toObject();
			//} else {
			//	return this._;
			//}
			return this._;
			
		},
		'set': function(val) {
			//this._val = val;
			var old_val = this._;

			this._ = val;
			this.raise('change', {
				'old': old_val,
				'value': val
			});

			return val;
		},
		'toString': function() {
			//return stringify(this.get());
			// con
			
			//console.log('this._val ' + stringify(this._val));
			//throw 'stop';
			
			return this.get();
		},
		// Maybe a particular stringify function?
		'stringify': function() {
			//return stringify(this.get());
			// con
			
			//console.log('this._val ' + stringify(this._val));
			//throw 'stop';

			var val = this.get();

			//var tval = tof(val);
			var tval = typeof val;
			if (tval == 'string') {
				return '"' + val + '"';
			} else {
				return val;
			}
			
			 
		},


		'_id': function() {
			// gets the id.
			//console.log('this._context ' + this._context);
			//throw 'stop';
			if (this.__id) return this.__id;
			if (this._context) {
				//console.log('this.__type ' + this.__type);
				//throw 'stop';
				this.__id = this._context.new_id(this.__type_name || this.__type);

			} else {
				if (!is_defined(this.__id)) {
					throw 'DataValue should have context';
					this.__id = new_data_value_id();
				}
			}
			
			
			return this.__id;

		},
		'parent': fp(function(a, sig) {
			var obj, index;
			//console.log('parent sig', sig);


			if (a.l == 0) {
				return this._parent;
			}
			if (a.l == 1) {
				obj = a[0];

				if (!this._context && obj._context) {
					this._context = obj._context;
				}
				
				// IDs will only work within the context.
				
				
				
				// Another way of expressing this?
				
				// Can have a single parent, or multiple parents.
				//  May want something to be the only parent. Could have a different mode for multiple parents.
				
				//  this._parent = obj?
				
				
				//console.log('parent obj_id ' + obj_id);
				//throw 'stop'
				//console.log('obj ' + stringify(obj));
				// should maybe rename or subdivide _relationships.
				//  it will also be useful for databases.
				//  however, would need to work with the constraint system.
				//   likely that they would be syncronised through code.
				
				//var relate_by_id = function () {
				//    var obj_id = obj._id();
				//    this._relationships[obj_id] = true;
				//}

				//var relate_by_ref = function () {
				//    this._parent = obj;
				//}
				//relate_by_ref();

				var relate_by_id = function (that) {
				    var obj_id = obj._id();
				    that._relationships[obj_id] = true;
				}

				var relate_by_ref = function (that) {
				    that._parent = obj;
				}
				relate_by_ref(this);
            }
			if (a.l == 2) {
				obj = a[0];
				index = a[1];

				if (!this._context && obj._context) {
					this._context = obj._context;
				}

				this._parent = obj;
				this._index = index;
			}

			if (is_defined(index)) {
				// I think we just set the __index property.
				//  I think a __parent property and a __index property would do the job here.
				//  Suits DOM heirachy.
				// A __relationships property could make sense for wider things, however, it would be easy (for the moment?)
				// to just have .__parent and .__index
				//  


				// Not sure all Data_Objects will need contexts.
				//  It's mainly useful for Controls so far

				


			} else {
				// get the object's id...
				
				// setting the parent... the parent may have a context.
				
				
				
				
				
			}
		})
	});
	
	
	// This system will exist within the Page_Context
	//  We don't want loads of these controls / Data_Objects to stay within the normal application memory all the time.
	
	
	// Context will hold these indexes.
	//  A context will be set up for each page request.
	//  Request_Context?
	//  Page_Context on the client?
	
	// Lots of objects will have links to their contexts.
	//  Will make it easy to get info about what browser / front-end capabilities there are.
	
	
	
	
	/*
	
	var data_object_index = 0;
	var data_object_abbreviation = 'do';

	var new_data_object_id = function() {
		var res = data_object_abbreviation + '_' + data_object_index;
		data_object_index++;
		return res;
	};
	
	*/
	
	// What about turning a normal object into a DataObject?
	//var t_id_num = 0;
	// May be good for testing the collecton and data object.

	// Don't want the Data_Object to always be betting IDs (after all).
	//  Don't want to always have to have a context - though for many purposes a context will help when rendering HTML.
	//   Has got in the way of other simpler things.

	var is_js_native = function(obj) {
		var t = tof(obj);
		return t == 'number' || t == 'string' || t == 'boolean' || t == 'array';
	}
	

	// Should maybe make it extend Evented_Class
	//  Data_Value would extend that as well.

	// Control would have specific handling for DOM events.

	// With EVented_Class in lang-essentials?
	




	var Data_Object = Evented_Class.extend({
		'init': function(spec) {
			// but it could do a different initialization as an abstract object.
			//  Collection(String) seems more like an abstract collection, or even a newly defined type.
			//  because of its easy syntax, Collection(String) makes a lot of sense to use.
			// going without the new keyword when we are not particularly looking for an actual new collection,
			//  but something that signifies its type as a collection of strings.
			//   May be possible to have these running in abstract (or schema?) mode.
			//   I think abstract mode fits in well with names we already are using.
			
			//console.log('begin Data_Object init');

			// bound_events needs to be overhauled quite a lot.
			//  There is a major problem with it right now.

			//  It's not staying within the context.
			//   Don't really want to be storing the index of object ids?
			//    could be useful during the creation of the page.

			
			// can have 'abstract': true in the spec,
			//  we will get this if it was called without the 'new' keyword as well.
			if (!spec) spec = {};
			//if (!is_defined(spec)) {
			//	spec = {};
			//};
			
			// if it's abstract call the abstract_init.
			
			if (spec.abstract === true) {
				//throw 'stop abstract';
				// this may need to be more lightweight.
				
				this._abstract = true;
				
				// iinit = instance init?
				//  with it only needing to save the spec, not do further initialization?



				//console.log('tof(spec) ' + tof(spec));
				
				// And with the spec as a function, we'll be able to say that each item must match that constructor
				//  However, there are only a few native JavaScript functions to check this against.
				
				// As a function, it gives a type constructor.
				//(console.log('tof(spec) ' + tof(spec)));
				var tSpec = tof(spec);

				if (tSpec == 'function') {
					this._type_constructor = spec;
					// could possibly 
					// but maybe want to keep this json-friendly.
					
					// the type constructor could be used in a collection.
					//  could be more leightweight than other things? specific constraint objects.
				}
				// Abstract controls won't be dealing with events for the moment.
				if (tSpec == 'object') {
					this._spec = spec;
					// could possibly 
					// but maybe want to keep this json-friendly.
					
					// the type constructor could be used in a collection.
					//  could be more leightweight than other things? specific constraint objects.
				}
			
			} else {
				var that = this;
				this._initializing = true;
				
				if (spec.context) {
					//console.log('spec has context');
				
					this._context = spec.context;
				}

				if (spec._id) {
					this.__id = spec._id;
				}
				
				//this._relationships = {};
				
				// when setting a value with another Data_Object,
				//  make the child one remember the parent relationship.
				//  may be possible to have multiple parents, could be that a data set is referred to in two places. When that data set changes it will get changed in
				//   all of its parents too.
				
				// not so quick.
				//  Don't want that item appearing unnecessarily.
				//  May ensure it at a later stage.
				
				//this._requirements = {};
				
				// then __type_name
				// __data_type_obj? (maybe not needed because of (quick) lookup from name, seems more memory efficient?)
				
				//var ctr = this.caller;
				//var dtn = ctr.data_type_name;
				//console.log('dtn ' + dtn);
				//console.log('this.__type_name ' + this.__type_name);
				//console.log('this.__data_type_info ' + stringify(this.__data_type_info));
				
				// and if a data type has been declared, we'll be parsing the input.
				// will essentially be setting the 'value' in the spec.
				
				// always the case with constructors when given a data_type?
				//console.log('do this.__type ' + this.__type);
				if (!this.__type) {
					this.__type = 'data_object';
					
				}
				//console.log('jsgui.__data_id_method ' + jsgui.__data_id_method);
				//throw 'stop';
				
				if (!is_defined(this.__id) && jsgui.__data_id_method == 'init') {
				
					// It should have the context...
					//  But maybe there can be a default / application / initialization context (not serving a particular page).
					//   Things to do with processing jsgui would be in that context.
					
					if (this._context) {
						//console.log('this._context ' + this._context);
						//console.log('sfy this._context ' + stringify(this._context));
						this.__id = this._context.new_id(this.__type_name || this.__type);
						//console.log('DataObject new ID from context: ' + this.__id);

						//this._context.map_objects[this.__id] = this;
						// Not keeping a map of objects by id in the context.

					} else {
						
						// Use the default context.
						// possibly make a new_data_object_id function?
						
						// Maybe don't need to give all data objects ids.

						//var create_id = function()
						/*
						var new_data_object_id = function() {
							var res = '_tid_' + t_id_num;
							t_id_num++;
							console.log('new temp id ' + res);
							return res;
						}
						
						console.log('no context found - creating new temp id. should have context');
					
						this.__id = new_data_object_id();

						*/
						// don't think we keep a map of all IDs, or we will do within a Page_Context.
						//map_jsgui_ids[this.__id] = this;
						// and make sure it is within the index / map of jsgui objects with ids.
					}
					
					
				}
				
				// don't get it from the prototype
				// It was copying over from the prototype.
				//  01/07/2012, it took a while to track this down.
				//   Copying things over from a prototype could prove very useful.
				//   May do more work on a type system, and then rebuild the whole thing around a type / class system that is definitely more advanced.
				//   
				
				// so, not getting it through the prototype chain.
				if (!this.hasOwnProperty('_')) {
					this._ = {};
				}
				
				// is also going to have a _fields object.
				//  the _fields will have different things in them.
				
				if (is_defined(this.__type_name)) {
					spec = {
						'set': spec
					}
				};

				/*
				if (is_defined(spec.data_def)) {
					//spec = {
					//	'set': spec
					//}

					this.

				};
				*/

				// data_def
				
				//this._ = this._ || {};
				//var _ = this._;
				
				// ensure(this, '_');
				//var _ = this._ = this._ || {};
				
	
				// but the collection could be made in the prototype I
				// think???
	
				// console.log('that._collection_names ' +
				// that._collection_names);
	
				// The collection names... could be dealt with using the
				// data_type_instance methods.
	
				// Interesting... has collections inside.
	
				// ok, so it works so far.
	
				// but with the collection properties - can these be
				// initialized here?
				// maybe do that within the collection property....
				// but may need to check too much.
				
				// the chain of fields... not sure how the chain needs to work backwards.
				//  for person recorded: [[0, ["flags", ~Collection(String)]], [0, ["dob", "date"]], [1, ["name", "string"]]]
				//  maybe need to join them together better? into a fields list?
				//  so we start with the most recent ones?
				//  fields map so we know what they are by name, so ignoring the repeated ones going back, who's definition will have been overwritten.
				//  Then we use the chained fields in the right order... set the fields up?
				//   But I think we want lazy field loading anyway.
				
				// Need to have the dom field available to HTML.
				
				var chained_fields = get_chained_fields(this.constructor);
				var chained_fields_list = chained_fields_to_fields_list(chained_fields);

				//var chained_fields_list = chained_fields_to_fields_list(get_chained_fields(this.constructor));
				// need to look at how the chained fields are set up.
				//  I think various (chained) fileds will get set up during the normal initialization of the library.



				// It may not be setting up the fields right for Color.
				//  There is an indexed array of red, green, blue.



				
				//console.log('chained_fields ' + stringify(chained_fields));


				//console.log('* chained_fields ' + stringify(chained_fields));
				//console.log('* chained_fields_list ' + stringify(chained_fields_list));
				// the chained fields list seem OK.
				
				// But making just a list of fields out of the chained ones...
				//  is it working OK?

				//throw 'stop';
				
				//console.log('* chained_fields_list ' + stringify(chained_fields_list));
				//throw 'stop';
				// then process the chained fields to fields list...
				
				// Need to set the Context?

				// I think only make the fields collection if there are fields.

				if (chained_fields_list.length > 0) {
					this.fc = new Fields_Collection({
						// 
						//'containing_object': this
					});
					
					// but the field object itself may be created on get.
					//  need to make sure at that time it has its parent.
					
					// need to check how this is getting set now.
					//  This is only really dealing with setting up some info for the fields, the fields will likely be empty until they are needed,
					//   using lazy loading to save memory.
					//console.log('');
					//console.log('');
					//console.log('*** chained_fields_list ' + stringify(chained_fields_list));
					
					//this.fc.set(chained_fields);
					this.fc.set(chained_fields_list);

					// the fields collection... that needs to handle fields that are given
					//  as constructor functions.
					//   maybe assume a function is a constructor function?
					//    then a 'products' field that is given by a constructor function
					//     would then have a connected field that sets that value.


					var do_connect = this.using_fields_connection();
					if (do_connect) {
						
						var arr_field_names = [], field_name;
						each(chained_fields, function(i, field_info) {
							//console.log('field_info ' + stringify(field_info));
							
							field_name = field_info[1][0];
							//console.log('field_name ' + field_name);
							arr_field_names.push(field_name);
						});
						
						// just an array of fields.
						//console.log('arr_field_names ' + stringify(arr_field_names));
						this.connect_fields(arr_field_names);
					}
				}

				
				// does set work OK?
				
				
				
				// that should have done it...
				//  the field collection should now hold info about all of the fields.
				
				
				//this.fields(chained_fields);
				
				
				
				// also, if we have fields (obtained through the field chain in this case), we then need to check if the fields get connected.
				//  this is a nice way of doing things, making it easy to specify, but without too much going on automatically.
				
				// 
				
				
				// have something in the prototype that says the collection
				// names?
				// order of bound events called not strictly set.
				
				
				// could possibly do this at a later stage of initialization, once the variables have been set for sure.
				//  could have already set the variables.
				//console.log('spec ' + stringify(spec));
				
				//console.log('chained_fields_list ' + stringify(chained_fields_list));
				
				
				//var chained_fields_map = mapify(chained_fields_list, 0);
				//console.log('chained_fields_map ' + stringify(chained_fields_map));
				//each(chained_fields_list, function(i, v) {
					//chained_fields_map[v[0]] = v[1];
				//});
				
				// go through chained_fields_map[i]), setting up fields.
				
				// maybe best to use the list.
				
				/*
				each(chained_fields, function(i, chained_field) {
					var field_name = chained_field[0];
					var field_def = chained_field[1];
					
					// The point is, I think, that I am not making field classes, but processing them using some more basic variable types.
					
					//console.log('field_name ' + field_name);
					//console.log('field_def ' + stringify(field_def));
					
					// at least it has those fields... I am not sure it needs to do anything until 'get', maybe even if there are default values.
					
					
				})
				*/
				
				
				//console.log('tof(spec) ' + spec);
				var chained_field_name;
				each(spec, function(i, v) {
					
					// Just copy the functions for the moment?
					// what about copying everything else?
					// need to may more attention to adding things?
					// push the other, non-function items one by one?
	
					// Or copy the other things to '_'.
	
					// var my_i = that[i];
					// will save a bit in the Core rewrite. Will eventually
					// put these techniques in the main lib.
					// calling the functions???
	
					// May be used for controls???
					// Function calls in spec...
					// Calling things like 'bind' through the spec.
					
				    //console.log('i ' + i + ' =v= ' + v + ' that[i] ' + that[i]);
					
					// Other thing that we may want to do is just copy
					// things.
					// Really not sure about that in general though, with
					// DataObject being so generally used as a basis for
					// things like controls.
	
					if (typeof that[i] == 'function') {
						// connected by now!
						
						// such as setting the fields...
					    
						that[i](v);
					} else {
						// _[i] = v;
						
						// they could be values...
						//  should set the values
						
						// possibly only set them if they correspond to fields?
						
						// set values from fields seems like a good idea here.
						//  that seems like a good level of connectedness.
						//  want a map of the fields to quickly test them.
						
						// setting values from chained fields?
						//  probably better to set them from the normal fields.
						
						//console.log('2* chained_fields ' + stringify(chained_fields));
						//console.log('2* chained_fields_list ' + stringify(chained_fields_list));
						
						// it will be dom.nodeType.
						
						
						
						// then it should be able to set some values.
						//console.log('spec ' + stringify(spec));
						
						// maybe a map of chained fields would work better.
						
						// Could be done a lot more efficiently with a map.

						if (chained_fields_list.length > 0) {
							var tcf, chained_field;
							for (var c = 0, l = chained_fields_list.length; c < l; c++) {
								chained_field = chained_fields_list[c];
								tcf = tof(chained_field);

								if (tcf == 'string') {
									chained_field_name = chained_field;
								} else if (tcf == 'array') {
									chained_field_name = chained_field[0];
								}
								
								//console.log('chained_field_name ' + chained_field_name);
								// coming out as undefined.

								// I think I need to redo the field chaining system somewhat.
								//  It's algorithms can be made faster and neater.
								// Basically, at any level we define fields.
								// Need to be able to get the fields for this level.
								//  Would help to get the names of the parents.
								//   Field definitions of the subclasses overwrite those of the superclasses.

								// Want to be able to get the field chain...
								//  That is going backwards getting all of the fields.
								//   Not overwriting them as older ones are found.




								// Redoing the field chaining is probably one of the largest
								//  changes to make in order to get a nicely working system.





								//console.log('i ' + i);

								// Need to make sure we a are properly holding the field types.
								
								if (chained_field_name == i) {
									//console.log('*** chained_field_name ' + chained_field_name);
									//console.log('setting');
									//that.set([i, v]);

									// Need to check setting a collection with an array.
									that.set(i, v);
									
									//console.log('that._[i] ' + stringify(that._[i]));
								}
							}

							/*
							each(chained_fields_list, function(i2, chained_field) {
								//console.log('chained_field ' + stringify(tof(chained_field)));
								
								
								
								if (tof(chained_field) == 'string') {
									chained_field_name = chained_field;
								}
								if (tof(chained_field) == 'array') {
									chained_field_name = chained_field[0];
								}
								
								//console.log('chained_field_name ' + chained_field_name);
								//console.log('i ' + i);
								
								if (chained_field_name == i) {
									//console.log('chained_field_name ' + chained_field_name);
									//console.log('setting');
									//that.set([i, v]);

									// Need to check setting a collection with an array.
									that.set(i, v);
									
									//console.log('that._[i] ' + stringify(that._[i]));
								}
							});
							*/
						}

						
						//throw('stop');
						/*
						//chained_fields_list
						if(chained_fields_map && is_defined(chained_fields_map[i])) {
							console.log('chained_fields i ' + i);
							console.log('chained_fields v ' + v);
							
							
							
							that.set(i, v);
						}
						*/
					}
				});
	
				// events as a list?
				// or named anyway?
	
				// then there is a list for the events of each name.
				// also, will create the _bound_events object when needed.
				//this._bound_events = {};
				
				if (is_defined(spec.event_bindings)) {
					throw '16) stop';
					each(spec.event_bindings, function(event_name, v) {
						if (tof(v) == 'array') {
							each(v, function(event_name, fn_event) {
								if (tof(fn_event) == 'function') {
									this.add_event_listener(event_name, fn_event);
								}
							});
						} else if (tof(v) == 'function') {
							this.add_event_listener(event_name, v);
						}
					});
				}
				
				var spec_reserved = ['parent', 'event_bindings', 'load_array'];
				var map_spec_reserved = get_truth_map_from_arr(spec_reserved);
				
				// Don't give the constraint as just the spec!
				//  It's not a good idea. Specify it separately.
				//  Spec can just be the data, it looks like?
				
				//var o_constraint = {};
				/*
				each(spec, function(i, v) {
					if (!map_spec_reserved[i]) {
						//
						o_constraint[i] = v;
					}
				})
				*/
				if (spec.constraint) that.constraint(spec.constraint);
				// then go through the spec, ignoring the reserved ones, and treat those items as field constraits / field constraint definitions.
				// and _parent?
				// but get(parent) could be really useful.
				// Could be very useful with controls, having this parent
				// structure.
				// Could be useful in bubbling events in controls too.
	
				// But not just one potential parent.
				// The data object can appear in more than one collection.
				//  Will use 'relationships', where there can be more than one 'parent'
				//  Will have things indexed for faster access.
				// what if the spec is a collection of string keys (representing fields) and string values representing the constraints?
				
				// parent could be reserved / ignored as a field.
				//  could check an object to see if it's a field definition type.
				//  could be a string. could be an array of the right form.
				//  Field definitions could be a bit tricky - it may actually create such a field definition object if it needs to do so.
				
				if (is_defined(spec.parent)) {
					this.set('parent', spec.parent);
				}
				
				//var that = this;
				
				// These events seem to get called far too much.
				//  Need to look into the add_event_listener code for dealing with serving multiple pages.


				// only add it if it has a context?

				if (this._context) {
					this.init_default_events();
				}

				//if (spec.fields) {
				//	this.fields(spec.fields);
				//}

				


				// Want to do this after all initialization.
				//  After the whole init sequence has finished.


				

				//delete this._initializing;
				this._initializing = false;
			}
			
			//console.log('end Data_Object init');
		},

		'init_default_events': function() {

			/*
			var that = this;
			this.add_event_listener('add', function(e) {
				
				if (tof(e) == 'collection') {
					var stack = new Error().stack;
					console.log(stack);
					throw 'The event object should not be a collection.';
				}
			
				var parent = that.parent();
				if (parent) {
					parent.raise_event('add', e);
					//throw 'stop';
				}
				
			});
			
			this.add_event_listener('remove', function(e) {
				var change_e = {};
				each(e, function(i, v) {
					change_e[i] = v;
				});
				change_e.event_name = 'remove';
				that.raise_event('change', change_e);
				
				var parent = that.parent();
				if (parent) {
					parent.raise_event('remove', e);
					//throw 'stop';
				}
			})
			*/


		},

		'data_def': fp(function(a, sig) {
			if (sig == '[o]') {
				// create the new data_def constraint.


			}
		}),
		
		'stringify': function() {
			var res = [];
			res.push('Data_Object(' + stringify(this._) + ')');
			return res.join('');
		},

		'toObject': function() {
			// need to go through each of them...
			var res = {};

			//console.log('this._ ' + stringify(this._));

			each(this._, function(i, v) {
				if (v.toObject) {
					//console.log('tof v ' + tof(v));
					res[i] = v.toObject();
				} else {
					res[i] = v;
				}
			})

			return res;
			//return this._;
		},
		
		// using_fields_connection()
		//  will search up the object heirachy, to see if the Data_Objects fields need to be connected through the use of functions.
		//  that will make the fields easy to change by calling a function. Should make things much faster to access than when programming with Backbone.
		// then will connect the fields with connect_fields()
		
		'using_fields_connection': function() {
			var res = false;
			iterate_ancestor_classes(this.constructor, function(a_class, stop) {
				if (is_defined(a_class._connect_fields)) {
					res = a_class._connect_fields;
					stop();
				}
			})
			return res;
			
		},
		
		'connect_fields': fp(function(a, sig) {
			//console.log('');
			//console.log('connect_fields sig' + sig);
			//console.log('a ' + stringify(a));
			
			var that = this;
			//throw '8) stop';
			
			if (a.l == 1 && tof(a[0]) == 'array') {
				var arr_fields = a[0];
				each(a[0], function(i, v) {
					that.connect_fields(v);
				});
			}
			
			if (sig == '[s]') {
				// connect that field by name
				// create the function
				
				// connect a singular field.
				
				/*
				this[a[0]] = fp(function(a2, sig) {
					
					//console.log('sig ' + sig);
					if (a2.l == 1) {
						return that.set(a[0], a2[0]);
					} else if (a2.l == 0) {
						return that.get(a[0]);
					}
				});
				*/

				this[a[0]] = function(a1) {
					
					if (typeof a1 == 'undefined') {
						// 0 params
						return that.get(a[0]);
					} else {
						// 1 param
						
						return that.set(a[0], a1);
					}

					//console.log('sig ' + sig);
					//if (a2.l == 1) {
					//	return that.set(a[0], a2[0]);
					//} else if (a2.l == 0) {
					//	return that.get(a[0]);
					//}
				};


				
			}
			
			if (sig == '[o]') {
				
				throw('16) stop');
			}
			
		}),
		
		// does this get overwritten?
		
		// Various items need to have their parents set properly when starting.
		
		// fp working?

		// Duck type collection detect -- __type == 'collection'

		// Don't have the array of parents.

		// One parent and one index for the moment. That's what DOM nodes need.

		'parent': fp(function(a, sig) {
			var obj, index;
			//console.log('parent sig', sig);


			if (a.l == 0) {
				return this._parent;
			}
			if (a.l == 1) {
				obj = a[0];

				if (!this._context && obj._context) {
					this._context = obj._context;
				}
				
				// IDs will only work within the context.
				
				
				
				// Another way of expressing this?
				
				// Can have a single parent, or multiple parents.
				//  May want something to be the only parent. Could have a different mode for multiple parents.
				
				//  this._parent = obj?
				
				
				//console.log('parent obj_id ' + obj_id);
				//throw 'stop'
				//console.log('obj ' + stringify(obj));
				// should maybe rename or subdivide _relationships.
				//  it will also be useful for databases.
				//  however, would need to work with the constraint system.
				//   likely that they would be syncronised through code.
				
				var relate_by_id = function(that) {
					var obj_id = obj._id();
					that._relationships[obj_id] = true;
				}
				
				var relate_by_ref = function(that) {
					that._parent = obj;
				}
				relate_by_ref(this);
			}
			if (a.l == 2) {
				obj = a[0];
				index = a[1];

				if (!this._context && obj._context) {
					this._context = obj._context;
				}

				this._parent = obj;
				this._index = index;
			}

			if (is_defined(index)) {
				// I think we just set the __index property.
				//  I think a __parent property and a __index property would do the job here.
				//  Suits DOM heirachy.
				// A __relationships property could make sense for wider things, however, it would be easy (for the moment?)
				// to just have .__parent and .__index
				//  


				// Not sure all Data_Objects will need contexts.
				//  It's mainly useful for Controls so far

				


			} else {
				// get the object's id...
				
				// setting the parent... the parent may have a context.
				
				
				
				
				
			}
		}),

		/*
		'parent': function(a1, a2) {
			var ta1 = typeof a1, ta2 = typeof a2, tri, info;
			if (ta1 == 'undefined') {
				// 0 params

				// could call the simple get function here, but maybe we can have it inline and fast.
				var arr_parents = [];
				for (i in this._relationships) {
					info = this._relationships[i];
					tri = typeof info;
					if (tri == 'number') {

					} else if (tri.__type === 'collection') {
						arr_parents.push(info);
					} else if (tri.__type === 'data_object') {
						arr_parents.push(info);
					}
				}
				if (arr_parents.length == 1) {
					return arr_parents[0];
				} else if (arr_parents.length > 1) {
					return arr_parents;
				}

			} else if (ta2 == 'undefined') {
				// 1 param
				if (a1.__type == 'data_object') {
					if (a1._context) this._context = a1._context;
				}

			} else {
				// 2 params
				if (a1.__type == 'data_object' && typeof a2 == 'number') {
					var parent = a1;
					var p_id = parent._id();
					var position_in_array = a2;
					
					if (parent._context) this._context = parent._context;
					
					// it's the child saying it's got the attribution to the parent here
					
					// child knows what poisition it is within parent.
					
					this._parents = this._parents || {};
					
					this._parents[p_id] = [parent, position_in_array];
				}
			}
		},
		*/

		'_fp_parent': fp(function(a, sig) {

			// Maybe detect if it's a Data_Object or Control relatively quickly here.
			//  Then perhaps call ._parent_Data_Object
			//   there would likely be some more optimized functions.

			// ._parent_get



			//console.log('parent sig ' + sig);
			//throw 'stop';
			if (a.l == 0) {
				// there could be just a single parent...
				//  if there is more they will be returned as an array.
				
				var arr_parents = [];
				
				// look at the _relationships.
				
				// _relationships will be used instead of .parent or ._parent
				//console.log('this._relationships ' + stringify(this._relationships));
				//console.log('this._parents ' + stringify(this._parents));
				
				//console.log('this ' + stringify(this));
				
				//var stack = new Error().stack
				//console.log(stack);
				//throw 'stop';
				
				// and each relationship record may indicate a parent
				//  does so with an integer, which is the index within that parent.
				//   will make for more efficient algorithms than jQuery's .index().
				var tri;
				each(this._relationships, function(relative_id, relationship_info) {
					tri = tof(relationship_info);
					
					console.log('relative_id ' + relative_id);

					if (tri == 'number') {
						// Relationships will be changed and tested.
						
						// it indicates a parent.
						// perhaps we should also return the position within the parent?
						
						// This needs changing / fixing.
						
						throw 'Relationships system needs more work here. Had been using the map of all many objects, which has been removed for web server performance reasons.';
						
						/*
						var id_map = map_jsgui_ids;
						
						if (this._context) {
							id_map = this._context.map_objects;
						}
						
						arr_parents.push(id_map[relative_id]);
						*/
						
						
					} else {
						//console.log('tri ' + tri);
						
						if (tri == 'data_object' || tri == 'collection') {
							arr_parents.push(relationship_info);
						}
						//console.log('relative_id ' + relative_id);
						//console.log('map_jsgui_ids[relative_id] ' + map_jsgui_ids[relative_id]);
						//throw 'stop';
					}
					
				});
				
				/*
				
				
				each(this._parents, function(i, v) {
					arr_parents.push(v);
				});
				*/
				if (arr_parents.length == 1) {
					return arr_parents[0];
				} else if (arr_parents.length > 1) {
					return arr_parents;
				}
				
			} else {
				//if (sig == '')
				//throw '2) stop';
				// otherwise, may have been given a parent control.
				//  May make a test suite to test types and signatures.
				
				// the parent should be a Data_Object (which includes Control), as well as other things.
				//  I think that there will be a lot of power and flexibility in controls when they get used again using the Data_Object underpinnings.
				// It will also be possible to make much more condensed versions of the framework.
				// 
				
				// Parents needs a significant amount more work...
				//  But needs to store the positions within parents.

				// set the parent - but may also need to know the position of the child.
				
				if (sig == '[D]') {
					var parent = a[0];

					console.log('[D] parent io Data_Object ' + parent instanceof Data_Object);
					//console.log('[D] parent io Collection ' + parent instanceof Collection);
					
					if (parent._context) this._context = parent._context;
					
					// maybe better to just use ._parent.
					
					var use_parent_id = function() {
						
						
						var p_id = parent._id();
						
						// This could return the position within that parent?
						
						// It may not have its position set - because if the parent is a Data_Object, then it does not have positions as such.
						var tp = tof(parent);
						
						if (tp == 'data_object') {
							//this._parents = this._parents || {};
							// but it's position may effectively be the field name...
							//  may be worth having that.
							
							
							//this._parents[p_id] = parent;
							
							this._relationships = this._relationships || {};
							
							this._relationships[p_id] = parent;
							
						}
						
						if (tp == 'collection') {
							throw 'Required: position in array of item';
						}
					
					}
					
					// an array of parents?
					//  or just set the parent? Multiple parents would help (in theory).
					var use_parent_ref = function() {
						// will work on parent later on.
						
						
					}
					
					
					
					
					
				}
				
				// could be a collection and a number...
				
				if (sig == '[D,n]') {
					var parent = a[0];
					var p_id = parent._id();
					var position_in_array = a[1];
					
					if (parent._context) this._context = parent._context;
					
					// it's the child saying it's got the attribution to the parent here
					
					// child knows what poisition it is within parent.
					
					this._parents = this._parents || {};
					
					this._parents[p_id] = [parent, position_in_array];
					
					// parent keeps a list of all children?
					// parent can have children in different places, in different other collections.
					
					//console.log('position_in_array ' + position_in_array);
					
					//parent.children.
					
					
				}
				
				/*
				
				if (a.l == 1) {
					
					//console.log('sig ' + sig);
					//throw 'stop';
					
					// the signature could be D, a Data_Object.
					
					
					
					
					console.log('p_id ' + p_id);
					
					// parents dict of objects... not sure about using an actual collection here.
					//  could get too complicated unnecessarily.
					// Could try it later when data structures are more finished.
					
					this._parents = this._parents || {};
					
					this._parents[p_id] = parent;
					
					
				}
				*/
				
			}
		}),

		'_id': function() {
			// gets the id.
			//console.log('Data_Object _id this._context ' + this._context);
			
			// Should get the context at an early stage if possible.
			//  Need to have it as the item is added, I think.
			if (this.__id) return this.__id;
			
			if (this._context) {
				//console.log('this.__type ' + this.__type);

				// __type will be control?
				// __data_type as control.
				//  that's the overriding type, there are a few of them
				// __type could be the more specific type such as radio_button.

				//console.log('this._context.new_id ' + this._context.new_id);

				this.__id = this._context.new_id(this.__type_name || this.__type);
				
				//console.log('__id ' + this.__id);
				//throw '!stop';
			} else {
				if (this._abstract) {
					return undefined;
				} else if (!is_defined(this.__id)) {

					// What does not have the abstract?

					//var stack = new Error().stack;
					//console.log(stack);

					// no such function... but there should be something declared in many situations.
					throw 'stop, currently unsupported.';
					this.__id = new_data_object_id();
					
					console.log('!!! no context __id ' + this.__id);
				}
			}
			return this.__id;
		},

		'fields': fp(function(a, sig) {
			// an easier interface to the fields than fields and constraints.
			//  this may be immutable when it is held in a collection - not sure.
			//  may not want to keep creating new copies of field sets and constraints for use in individual Data_Objects.
			
			// The individual Data_Objects will need to have their own constraints, to begin with.
			
			// we may have been given the chained fields here.
			//  
			
			
			//console.log('***** fields sig ' + sig);
			
			// Should have had fields set already.
			//  The Data_Object constructor should find out what fields are part of it.
			//  Not sure how easy that is to do from that level... there needs to be a way.
			
			// 
			
			var that = this;
			
			if (a.l == 0) {
				
				// Will be keeping track of the fields internally.
				//  They get stored in an array, so that the order gets maintained.
				
				/*
				
				//console.log('fields this._map_field_constraints ' + stringify(this._map_field_constraints));
				
				var res = [];
				
				each(this._map_field_constraints, function(field_name, v) {
					//console.log('field_name ' + field_name);
					//console.log('v ' + stringify(v));
					
					// then for each constraint, get an info object from it.
					// v.to_obj_info
					// v.to_info_obj
					
					each(v, function(i2, constraint_for_field) {
						
						// May also be saying it's a primary key field
						//  Need more work on setting fields
						
						
						if (constraint_for_field instanceof Constraint.Field_Data_Type) {
							var field_constraint_info_obj = constraint_for_field.to_info_obj();
							//console.log('field_constraint_info_obj ' + stringify(field_constraint_info_obj));
							
							// find out if the field is read-only.
							
							var flags = [];
							if (that._map_read_only && that._map_read_only[field_name]) {
								flags.push('read_only');
							}
							if (flags.length == 0) {
								res.push([field_name, field_constraint_info_obj]);
							} else {
								res.push([field_name, field_constraint_info_obj, flags]);
							}
						}
					});
				});
				
				return res;
				*/
				
				// an index of the position of a field within the array? Would that be useful?
				//  means some encapsulation may be worthwhile here
				
				// have a look at the fc (fields_collection)
				
				var fields_collection = this.fc;
				//console.log('fields_collection ' + fields_collection);
				
				// not just the field values.
				var res;
				if (fields_collection) {
					res = fields_collection.okvs.values();
				} else {
					res = [];
				}
				
				return res;
				
				
				//return this._arr_fields || [];
				// can get a position map relatively quickly from the array of fields.
				//  can be done after any adjustment on the fields is done.
				// this._field_positions_by_name
				//  or a linked list of fields? That could work for preserving order, iterating, insertion, deletion, 
				
				
			}
			
			if (sig == '[s]') {
				// get a single field.
				
				// get the field from the field_collection.
				
				var fc = this.fc;
				//console.log('** fc ' + fc);
				var res = fc.get(a[0]);
				//console.log('res ' + stringify(res));
				return res;
				
			}
			
			//var that = this;
			if (sig == '[o]') {
				// when giving it the chained fields, need to process them right.
				//  may be best to clone them.
				
				//console.log('a[0] ' + stringify(a[0]));
				
				// better to ensure the fields in order...
				
				//  can set each field individually.

				// Setting a field with a value...
				//  The field type could be a bit more complex.
				//  Need to be careful about using JSON or JS object input to set a field - it may need to be instantiated from that input.




				
				each(a[0], function(i, v) {
					//console.log('i ' + stringify(i));
					//console.log('v ' + stringify(v));
					
					// it's using the new set_field in Collection.
					that.set_field(i, v);
					// for setting an existing field...
					//  see if the field exists (search the fields object or other lookup)
					//   if it exists, modify the existing one - complicated when other things depend on this.
					//    the constraints and indexes will also depend on the fields, so a modification in a field can result in the removal of a constraint or index.
					//     removal of a field could necessitate the removal of a constraint or index.
					//      remove_constraints_for_field
					//      remove_indexes_for_field
					
					// Don't want to remove multi-field constraints when replacing one field - but do want that when properly removing a field.
					//  I guess this will just take a bit more coding and testing to get the desired behaviors.
					// Really want to be using fields as a convenitent interface for constraints.
					//  They will encompass a few things involving them.
				}, that);
			}
			
		}),
				
		'constraints': fp(function(a, sig) {
			// or constraints... if given multiple ones.
			//   I think constraints may be the better name here.
			//   Will accept the singular as well.
			
			
			
			
			
			//console.log('Data_Object constraint sig ' + sig);
			
			// was 'fields'
			
			// as constraints, a Data_Object can also be a Collection, so these will need to apply to collections as well.
			
			// collections won't have fields though, so Field_Constraints won't apply to them, and collections won't accept them as constraints.
			
			
			// field constraints...
			
			// may be given the field constraints
			
			if (a.l == 0) {
				
				// want to get all the constraints.
				
				
			}
			
			// Field rather than column.
			
			
			// Collections will have other sorts of constraints, such as table constraints.
			//  Nice to be able to have collections have constraints defined in terms of other collections.
			
			
			// Foreign_Key_Constraint is a table constraint
			// Unique is as well... it does not check individual fields, depends on the whole table.
			//  Fine to ingore the fact that SQL can recognise them as column constraints here, we are not dealing with columns, 
			//  but fields. Fields won't say they are constrained to unique values... collections will say they constrain fields to unique values.
			//   Would be more memory efficient.
			
			
			// the signature... could be a field_constraint?
			// could be a collection_constraint?
			//  that may be worth putting into the signatures, with fc and cc
			//   or FC and CC
			// that's how they get brought into the system at quite a low level, with the flexibility making the code clearer here.
			
			
			// function wanted to get and set the fields as well...
			
			/// it looks like there are field constraints in use here.
			//  the fields will be an object / array with the fields.
			
			
			
			if (sig == '[o]') {
				// setting the field constraints.
				
				// May have a closer look at those objects.
				
				// overwrite existing ones.
				var field_constraints = a[0];
				this._field_constraints = field_constraints;
				
				
				// does it match the current field constraints?
				//  if not, throw an error.
				
				
				
			}
			
			
			// string, ?
			//  it would try to process the ? as a field_constraint for that field
			//  if it already is a field_constraint, then great
			//  if it is an array or a string (possibly other object) it will parse / interpret that as a field_constraint object
			
			// Making the system of specifying constraints easy, while still providing the full database-like model,
			//  is an interesting challenge. It should make for a nice tool on the front-end that can create code that gets transformed
			//  into the DB code and allows access to it without too much difficulty.
			
			// This system, in JavaScript, will be able to bind to databases relatively easily.
			//  Should provide the coder with easy access to data in various databases.
			//  This whole constraints and data types system will have wide application to a lot of data available on the internet,
			//   and will be useful for publishing data too.
			
			// Looking forward to making a resources system that makes it relatively easy to access data that is stored somewhere with an easy API.
			//  May be interesting to open-source some of this technology. May be best to open-source all of it?
			//  I think open sourcing a precise, fairly compact build of it would be nice.
			//   Worth thinking in terms of possible extensions.
			
			// The system to do with finding and defining metadata, and matching that with data scraped from websites or from web resources...
			//  Not sure about open sourcing some of the core indexing stuff quite yet. Possibly in the future.
			
			// But my website could make metadata available.
			//  There could be some open-sourced code to do with the core things, I'm sure.
			
			// Perhaps connecting to various resources.
			//  Hosting data perhaps, identifying it to the index.
			
			// Perhaps people running hosting software I have written will connect to the central system, also could use the Resources system
			//  to obtain data from elsewhere for their own use, while publishing it with MetaBench indexing systems, APIs and semantics.
			
			
			if (a.l == 2 && tof(a[0]) == 'string') {
				
				
				
				
			}
			
			
			
			// may be returning the field constraints
			
			
			
		}),
		
		'matches_field_constraint': fp(function(a, sig) {
			// there may be more than one constraint for that field.
			
			//console.log('matches_field_constraint sig ' + sig);
			//console.log('matches_field_constraint a ' + stringify(a));
			
			
			if (sig == '[s,s]') {
				var field_name = a[0];
				
				// the constraint as just one item.
				//  there could be multiple fields constraints for that item.
				
				if (tof(a[1]) == 'string') {
					var str_constraint = a[1];
					
					// then use the constraint module to test these.
					
					var field_val = this.get(field_name);
					return obj_matches_constraint(field_val, str_constraint);
				}
				
				if (tof(a[1]) == 'array') {
					throw 'Multiple constraints not yet implemented here';
				}
				
				
				
			}
			
			//throw('stop')
			
			// given as string
			
			
			// 
			
			
		}),
		
		'obj_matches_field_constraints': function(obj) {
			//console.log('matches_field_constraints ');
			var that = this;
			// iterate through the field constraints
			var matches = true;
			
			// don't check it against the _field_constraints?
			//  get the_field_constraints?
			//  have the .fc (field collection) interacting with the field constraints?
			//   have the fields_collection system store the field constraints?
			//  possibly not, because some constraints will be outside of individual fields.
			
			// perhaps have _unique_constraints_collection / index that keeps track of the unique constraints.
			
			// they are different to the field constraints. for the moment they can just be an index.
			//  could maybe have them like flags.
			
			//  they can be added, removed, they will be indexed for sat retrieval and checking.
			
			// indexes... another index index? these indicate how things get indexed within the collection, rather than being the indexes themselves.
			
			// field_index_schema?
			//  
			
			
			
			
			
			
			each(this._field_constraints, function(i, v) {
				// does it match?
				
				matches = matches && obj.matches_field_constraint(i, v)
				
			})
			return matches;
			//throw('stop');
			
		},
		
		// Maybe fields and field constraint heavy lifting should be done elsewhere?
		//  But Data_Object will be right in the core really.
		
		// I doubt the core will be all that large in terms of file size.
		//  A lot of size savings will be made, and it will be very small and efficient compared to many other systems.
		//  Combining different things into one file would be another days work.
		
		// I could also do some more work on building up the JavaScript code and evaluating it.
		//  That could save a lot of space with an efficient compression mechanism.
		
		
		// Setting a whole bunch of fields, or even a field, may be better done in a collection, because some of the field has to do with how a collection handles it...
		//  indexing it, 
		
		
		/*
		'fields': fp(function(a, sig) {
			if (sig == '[o]') {
				// overwrite all fields.
				
				// will use the set_field to set the individual fields?
				
			}
			
			//console.log('Collection fields sig ' + sig);
		
		
		}),
		*/
		// The field constraints, and data_type system is getting quite large and a bit fragmented. 
		//  Hopefully it will be closer integrated into the core, and tested with some relatively simple examples to show that it works
		//  and what results to expect.
		
		// The constraints about what objects can be will go a long way towards the goal of specifiying things in JavaScript that
		//  will work on many systems eventually. These mechanisms will be useful in GUIs, so it will help that they are built into the core of the framework.
		
		// At the moment I am putting quite a lot in, having spent some time considering what will be needed next.
		//  A later stage will be refactoring things. That may come when it is running in a browser and I see how much it is using.
		//  It may be done after some more code analysys, perhaps enabled by JavaScript parsing and storing the code on the system ready for use
		//   and analysis
		
		// set_field for the Data_Object... the field is a constraint to do with the type, it could also be that an index is set up for that field.
		
		//  want read-only fields to operate on the class level as well.
		//  I think the map is useful, I'm not so sure that they are constraints anyway.
		//  Field properties... then can have a field property map or field property index.
		
		
		'read_only': arrayify(fp(function(a, sig) {
			var mro = this._map_read_only = this._map_read_only || {};
			
			var field_name = a[0];
			
			if (sig == '[s]') {
				// a field name to make read-only
				mro[field_name] = true;
			}
			if (sig == '[s,b]') {
				// a field name to make read-only, boolean value can be false
				
				var bool_is_read_only = a[1];
				if (bool_is_read_only) {
					return this.read_only(field_name);
				} else {
					//delete mro[field_name];
					mro[field_name] = null;
				}
			}
			// array... process them?
			//  could arrayify the whole function.	
		})),
		
		'set_field': fp(function(a, sig) {
			
			// This will be overhauled...
			//   It will need to efficiently see if an existing field is there.
			
			// If it is there, it will update the field. That may then mean that constraints need to get updated as well..
			//  would mean removing some existing ones perhaps?
			// But it would check what constraints are then needed for that field and remove the extraneous ones.
			//  Same with single-field indexes.
			
			// When adding the field, would also need to update the constraints.
			//  Could have the constraint system respond to field changes, maybe be the first listener.
			//   using this.ensure_field_constraint(field_name, field_info);?
			

			this.fc = this.fc || new Fields_Collection();

			return this.fc.set.apply(this.fc, a);
			
			// although it has been added, we need to set the parent...
			//  maybe fc can do this?
			
			//console.log('set_field sig ' + sig);
			//console.log('set_field a ' + stringify(a));
			
			// [s,[f]]
			//  data type is defined by a constructor within an array
			//   means a collection of that type.
			
			// sets a data type constraint on that field
			/*
			if (sig == '[s,[f]]') {
				
				throw '10) Stop';
			}
			*/
			// Collection has something that overrides this.
			/*
			if (sig == '[s,s]') {
				// will need to interpret the second part
				var field_name = a[0];
				var field_text = a[1];
				
				//console.log('field_text ' + field_text);
				// parse the fiex text. it may have some things to do with constraints that apply to the collection, if it is in a collection.
				//  not so sure about saving these here. They could be saved so that they get put into a collection fine with other unique fields...
				// but then we'll be taking more care specifying things in the collection if necessary.
				
				var field_info = input_processors['field_text'](field_text);
				
				//console.log('field_info ' + stringify(field_info));
				
				// then ensure the constraint(s) corresponding to the field, where possible.
				//  not able to put uniqueness constraint in place here, yet. It's really dealt with and enforced by the Collection class.
				
				// I think the library core is getting pretty big now, it could still do with more for HTML, CSS processing.
				//  The database side of things will be expanded, it will be good to have code using very nice syntax provided by the library.
				
				this.ensure_field_constraint(field_name, field_info);
				
				if (field_info.read_only) {
					this.read_only(field_name);
				}
				
				// Just need to do quite a lot more...
				//  Quite a bit more needed for the objects to work like they should, then I'll be using those objects for the HTML components, and also for the
				//  database layer.
				
				// Persisting to that DB layer seems like a really useful stage, not sure about open-sourcing that code.
				//  May be best to... may be better that my ORM is used. I'd still have the powerful web app too?
				//   Could have different licensing for that component... commercial deployments cost money?
				//    But then want to have things distributed nice and easily. Perhaps could have different options for this. With the website running out-of-the-box,
				//     could directly go to the Mongo layer.
				// Would be very nice to have open-source code producing everything that's needed. Could get quite a lot of interest.
				//  Maybe will keep that on my server for the moment, or in the client-side applications people use.
				// Will be fine without OSing all the ORM, but a relatively simple Mongo layer would work fine.
				//  It may be more what people want, and would get developer interest. The ORM would be useful for accessing legacy systems? SQL can be very useful in its
				//   own right, but could be harder to use effectively in this case.
				
				
				// does it have the not_null constraint?
				//  each field can have more than one constraint.
				//  not sure about a collection of constraints though.
				//   perhaps a simpler collection would be very useful in implementing some of the more advanced things.
				//  array of constraints for each field will do for the moment.
				
				// can be both a Not_Null constraint and a data type constrint.
				// easy then to create the field with this information.
				
				//  find out if there is an existing field (constraint).
				//  find out about existing indexes for that field, create one if needed
				//  find out about existing constraints, such as not_null
				//   perhaps not_null can be a value constraint - but it's something that translates readily into the database system.
				
				// this will be for setting single field indexes.
				
				// Other indexes could be defined with multiple fields.
				
				// Will be useful for iterating through a collection, getting the values that match two given values.
				
			}
			*/
			
		}),
		
		
		// unique, not_null being the field constraints in action.
		
		//  unique could apply to multiple fields at once. Would need the index with those two fields looking for collisions.
		
		// constraints: {
		//	'unique': ['school_district', 'district_school_id']
		//}
		
		// will also try to get a field constraint, based on the field.
		//  but may also do it based on type, maybe get_field_data_type_constraint
		
		'set_field_data_type_constraint': function(field_name, data_type_constructor) {
			// these dtcs are separate to the fields themselves.
			
			// May be better using the Field_Collection here.
			
			var fmc = this._map_field_constraints = this._map_field_constraints || {};
			var fmfc = fmc[field_name];
			if (fmfc) {
				var deletion_index;
				each(fmfc, function(i, v) {
					// if it is a Field_Data_Type_Constraint
					if (v instanceof Constraint.Field_Data_Type) {
						//return v;
						//
						if (v.data_type_constructor === data_type_constructor) {
							
						} else {
							// replace that one.
							deletion_index = i;
						}
					}
				})
				
				if (is_defined(deletion_index)) {
					fmfc.splice(deletion_index, 1);
					
					// create the new constraint object.
				}
			}
		},
		
		'get_field_data_type_constraint': function(field_name) {
			var fmc = this._map_field_constraints;
			// field_constraints - they are constraints that apply to the fields. They are not the list of fields.
			
			if (fmc) {
				var fmfc = fmc[field_name];
				if (fmfc) {
					each(fmfc, function(i, v) {
						// if it is a Field_Data_Type_Constraint
						
						if (v instanceof Constraint.Field_Data_Type) {
							return v;
						}
						
					})
				}
			}
			
		},
		
		
		// 
		
		// ensure_constraint_from_field
		// ensure_constraints_from_field
		//  can have a not null constraint, can have a data type constraint.
		//  can be given the whole [field_name, [str_field, obj_field_info]]
		// possibly not_null constraint would be part of data type constraint?
		//  easier to have separate not null constraint.
		
		// once we have the field, there are some possible constraints.
		//  could have them indexed... an obj saying not_null, with link to constraint if it is there.
		//  _map_field_constraints...
		//  _map_field_constraints[field_name][constraint_type_name]
		//  _map_field_constraints[field_name]['multi_field']
		//   and then there is a list of all the constraints that have got the field mentioned... 
		
		// some of these things could be done with a quick search.
		
		
		//   when we have the field name, we can refer to all its constraints from this.
		
		// and then there should be the (KVS) map of unique constraints ordered by alphabetic fields...
		//  also storing when a field is mentioned in a constraint, but it's not the only field?
		//   when deleting a field we'll need to get all constraints that a field is involved in.
		
		// 
		
		
		
		//  can also be given [field_name, str_field], can calculate the constraint object.
		//   may at times be given the obj_field_info and need to make the text representation
		
		
		
		'ensure_field_constraint': fp(function(a, sig) {
			
			// this would also have to interact with the field object if necessary, keeping things in sync.
			
			// will have different field_constraint maps.
			// or a map of the fields to the constriaint types.
			//  
			
			
			// (fc_map[field_name]['unique'])
			// fc_map[field_name]['data_type']
			// fc_map[field_name]['not_null']
			
			
			
			//  ensures a single constraint?
			// [s,s] can parse the field text
			
			if (sig == '[s,o]') {
				var field_name = a[0];
				var field_info = a[1];
				
				// Different constraints that can apply to the field... but likely to be a data_type constraint really.
				
				
				
				// can ensure not null and data type
				
				// OK... looks like the field_constraints will need to be organized somehow.
				//  They are another thing that perhaps a simple indexing system would help with.
				// Will be organizing them using the native JavaScript objects.
				
				// Having an array of field_constraints makes sense, so that the order is maintained.
				
				// array of field constraints.
				// map of field constraints. 
				
				//this._arr_field_constraints = this._arr_field_constraints || [];
				
				//  not so sure about this array of constraints again.
				//  perhaps only keeping them in the map is enough.
				
				// field constraints_by_field
				// _map_field_constraints... this will hold the constraints by field.
				//  there may not be more than one constraint for a particular field, there may be a map of such constraints.
				
				// so it's organized by field here... easier to get the existing field constraints, overwrite them, or create a new one,
				//  or to look it up.
				
				//console.log('field_info ' + stringify(field_info));
				//console.log('a ' + stringify(a));
				
				// Will _map_field_constraints be in the Field_Collection?
				
				this._map_field_constraints = this._map_field_constraints || {};
				this._map_field_constraints[field_name] = this._map_field_constraints[field_name] || [];
				// don't want an array of constraints there...
				//  there are not many constraints that can be there, such as data_type, not_null
				
				// The constraints only apply to fields individually
				//  There can be collection constraints that apply, they can be specified, and they get applied to the relevant collection.
				
				
				
				
				var fc_item_arr = this._map_field_constraints[field_name];
				// Have the fields referencing their constraints.
				//  Also have a map / sorted KVS of constraints by the fields they are for, different ways they need to be looked up
				//   alhabetically sorted list of unique fields kept in a KVS
				//    no such thing as a unique index - only unique constraint.
				//   a single field can be unique (have a unique constraint)
				//   a unique constraint can apply to multiple fields.
				
				// map of fields objects by name
				//  as well as array of fields
				//   the Fields object - perhaps it should be defined as its own class.
				//    It would make sense.
				// A unique constraint does not really apply to the field, but more to the collection, with reference to the field.
				//  It's still information that should get stored alongside the field.
				
				
				// looking for an existing constraint already.
				//  the whole sytem can be improved.
				// I think having an actual ._fields object would help.
				//  It would be an array (or simpler collection?)
				//   A simple collection could be quite nice if it has B+ indexing capability.
				//    But the whole thing has got a bit complicated anyway with Data_Object.
				// Just an array would do fine for the moment.
				//  Want to be sure of maintaining the order.
				//   _map_fields goes to the field by name.
				
				// The field will reference both indexes and constraints.
				//  Indexes and constraints will refer to particular fields, often by name.
				
				// Don't want complicated data types to do with fields.
				//  There is a _fields object.
				//  _arr_fields
				//  kvs_fields? it stores the fields by name in a kvs. also for multi-field constraints and indexes?
				
				// Doing the individual fields, and also the multiple fields when they are applied together.
				
				
				
				
				
				// That is a fairly major change for the data_object.
				//  Will not have the constraint map just as it is.
				//  There will be the index for multi-field constraints, but just a simple array for the fields.
				//  _map_field_constraints[field1_name][field2_name][array of constraints applying to that field combination]
				
				// I think the B+ KVS will be better for storing the constraints by their fields.
				//  
				
				
				
				var dt_info = field_info.data_type;
				
				var new_dt_constraint = Constraint.from_obj(dt_info);
				//console.log('new_dt_constraint ' + stringify(new_dt_constraint));
				
				if (!is_defined(new_dt_constraint)) {
					//throw '9) New constraint from_obj not profucing constraint';
				} else {
					
					

					var dt_constraint;
					//console.log('fc_item_arr ' + stringify(fc_item_arr));
					if (fc_item_arr.length > 0) {
						// go through the array updating relevant constraints.
						// really looking for the data_type constraint.
						
						var dt_constraints = [];
						//console.log('fc_item_arr ' + stringify(fc_item_arr));
						// should only be one in there at maximum
						each(fc_item_arr, function(i, constraint_item) {
							//console.log('constraint_item ' + stringify(constraint_item));
							
							if (constraint_item instanceof Constraint.Field_Data_Type) {
								//console.log('constraint_item ' + stringify(constraint_item));
								
								var constraint_info = constraint_item.to_info_obj();
								console.log('constraint_info ' + stringify(constraint_info));
								console.log('field_info ' + stringify(field_info));
								
								var stack = new Error().stack
								console.log( stack )
								
								throw ('6) it is! stop, check to see if it is a Field_Data_Type_Constraint, use instanceOf')
								
								
							}
							
							
							
							// I think delete any existing dt constraints?
							//  Do nothing if the constraints match...
							//  Will likely have events to do with adding and removing constraints.
							
							
							
							
						})
						
						// check existing constraint against values given. possibly change it, possibly replace it.
						
						
						
						
					} else {
						
						fc_item_arr.push(new_dt_constraint);
					}
					
					
					
				}
				
				//throw('7) stop');
				
				
				
				// if there is nothing there, create it.
				
				// if it's there, overwrite any constraints with the relevant one from the field info we were given.
				
				
				
				//console.log('this._arr_field_constraints ' + stringify(this._arr_field_constraints));
				//throw('5 stop');
			}
			
		}),
		
		'matches_field_constraints': fp(function(a, sig) {
			if (a.l == 0) {
				return this.matches_field_constraints(this._field_constraints);
			}
			
			// comparing an object with its field constraints... that could be outside this.
			
			// check_field_constraints
			//  does the check and says where it fails
			
			// matches_field_constraints
			//  stops when it fails, returns false
			
			// does a Data_Object match constraints?
			
			// may want to check if a Data_Object that gets provided matches the field constraints stored in this Data_Object.
			//  One Data_Object can be used as reference for doing checks.
			//   The Data_Objects that get put in don't have the checks as part of them, but they may have checks done on them before they have
			//   completed updating. This could be used to indicate an error to the user in the GUI.
			
			// This really won't be so hard to do, and to get right.
			//  Hopefully all these things would be able to be used for various packages.
			// I think declarative writing of much of it, so that a LMS could be set up, or something for social services that
			//  deal with information about individuals, workflows, and reporting (helping produce the required documents and keep
			//  users of the system informed)
			
			//console.log('matches_field_constraints sig ' + sig);
			
			if (sig == '[D]') {
				// Does that Data_Object match the constraints of this one?
				
				var fcs = this._field_constraints;
				
				//console.log('fcs ' + stringify(fcs));
				
				var obj = a[0];
				
				var all_match = true, obj_field_value, matches;
				
				each(fcs, function(field_name, constraint) {
					// these constraints could potentially be something quite complicated and nested.
					
					// We would need to be careful about that.
					// Will use this for specifying HTML controls, being sure they are output in a standard format.
					
					obj_field_value = obj.get(field_name);
					//console.log('obj_field_value ' + obj_field_value);
					
					//console.log('constraint ' + constraint);
					
					matches = obj_matches_constraint(obj_field_value, constraint);
					
					all_match = all_match && matches;
					//if (!matches) return false;
					// returning false from the main loop?
					//  breaking out of my each loop... both these things will need to be looked into.
					
					// each could be used to build a result... but do want break conditions.
					
					//check_value_against_constraint
					
					// a function to check against the constraints.
					//  this is to do with things no longer to do with Data_Object, should be in lang-essentials
					//  possibly worth making an intermediate level.
					// It's going outside of the essentials, but it still is pretty important
					// Maybe have core, which includes essentials and validation, or valid_data
					//  Could have a constraints module.
					//   This would be working in a nested way, the constraints could be nested.
					
					// Constraints would be defined as objects.
					//  They would often be specified as text, such as 'int'.
					//  They could be specified to be an array, like [['red', 'int'], ['green', 'int'], ['blue', 'int']]
					//  Having a constraint object would help to store maps that are generated to help with that constraint.
					//  They would also act as indexes for some arrays, helping with the JavaScript implementation.
					
					//  valid_data may be a good name because it will potentially have some more data handling facilities, such as dealing with
					//  nested data. I may be moving functionality out of Nested and putting it somewhere simpler, maybe I'll be better able to express it
					//  with recursive functions.
					// Will be dealing with data types at different levels.
					//  Could be more systematic about maps that express positions of items in arrays.
					
					// I think that side of things, tidying it up a lot, will help with getting these things running correctly in a web server.
					
					
				});
				
				// Will be faster to break out of each loop.
				
				return all_match;
			}
			
			
			
			if (sig == '[o]') {
				
				// may want to test if an object matches the field constraints.
				
				// obejct representing the constraints...
				//  seeing if this Data_Object meets those constraints.
				
				// these constraints are given as a field.
				
				
				
				
				
				// an object representing those constraints.
				//  not using a Data_Object for this yet.
				
				// find out which are the current keys (get a truth map of them)
				
				// see if all of the current ones adhere to the given constraints
				
				// see if all of the given constraints have been met
				//  could have a map of the given constraints, and delete them from that map as they have been met
				//  then go through the map using each to see which ones have not been met.
				
				// May use some code to do with data types.
				//  With the HTML processing, will be taking in data with fewer constraints, and transforming it so it matches what is required.
				
				// I think there will be a fair bit more coding to get the HTML system fully running with the newer Data_Object abstraction, 
				//  and data types and transformations specified in terms of the data type, meaning that the code will be more concise and declarative
				// Some quite complex things to do with indexing and data transformation get done elsewhere, for example.
				
				// I am expecting to get this to work fairly soon, I have made a lot of progress recently.
				// Having the code executing and producing a website will be very nice.
				//  Would be good to get a portfolio online, but very good indeed if it loads quickly, has a nice menu, and just generally is my
				//  professional / business website.
				
				// It does seem like a real business priority to get this site up online.
				//  It could be very useful for customers, maybe if I am doing front-end development work, can show something and get comments rapidly
				//   within my system.
				
				// Anyway, need to get this matching the field constraints here.
				
				/*
				var field_constraints = a[0];
				
				
				// check for matching a single constraint
				
				
				
				each(field_constraints, function(i, v) {
					console.log('field_constraints i ' + i);
					console.log('field_constraints v ' + stringify(v));
					
				});
				*/
				
				return data_object_matches_field_constraints(this, a[0]);
				
			}
			
			
		}),
		
		
		// requires is different to accepts.
		
		// requirements may be needed to do something.
		// accepts is about setting data on it.
		//  could say (or assume) that the fields are required. They could be required in order to persist it to some location.
		// Perhaps only some fields are required, or their reuqirement is met when they are null or undefined.
		
		//  Saying a field is required is equivalent to saying it is 'not null'.
		//   Fields will possibly not meet this constraint just as the object has been created... but it may be that the object must get created with the necessary
		//   data. It will be possible, though, to have the Data_Object, not containing any data. Maybe it will be considered empty, or dataless
		//   dataless may be better as it does not imply the opposite of 'full'.
		
		
		
		
		'____requires': fp(function(a, spec) {
			
			// Leaving this for the moment, developing field constraints.
			
			
			// sets items in this object's schema
			//  this could set items in an item-level rather than class-level schema.
			//   there could be two schemas - the one it starts with, and those that override the default schema.
			//   That avoids copying lots of the default schema items, making controls start more quickly and will use less memory.
			//    Less reduntant information being stored.
			
			// base_schema (this could be set by a string name, referring to jsgui.schemas).
			// overrides_schema (object_schema may be a better name).
			
			// 'requires' would be setting something on the overrides_schema (or object_schema)
			
			// object_schema
			// object_type_schema
			// object_base_schema
			// object_schema_additions
			
			// base_schema
			// schema_additions
			// additional_schema
			// object_schema
			
			// base_schema
			// object_schema
			
			// types will be namespaced more
			//  there is the type system of the JavaScript code here
			//  there is an internal type system for arbitrary namespaced objects... they will follow the names of objects here.
			
			// 
			
			
			
			// schemas applied to properties
			//  done so that the checking stage can see that requirments are met.
			
			// It may be worth putting this in a 'schema' for the object, rather than at this stage.
			
			// Setting schemas for sub-objects, and setting schemas for the objects themselves makes a lot of sense.
			//  Perhaps the schemas for the sub-objects should be set through the schema for the object itself.
			
			// this, I think, will be setting a particular item on the object_schema.
			// the object_schema could simple be a data_type_name.
			//  this will tie into jsgui.data_type_name
			// Likely to make the nested system clearer and more compact, and incorporate it into the main part.
			//  I think I'll get things running in a fairly compact way that would enable things to run really well on a mobile device.
			//   Could have significantly advanced programming around the 12KB mark, would have things really optimized, but it needs to get a bit complicated in
			//   order to implement such functionality. A lot can be done in that relatively small size, and more still can be done using that code for the mobile application.
			
			// Putting the requirement information into the object_schema makes sense
			//  May be similar to using a data_type_name?
			//   or schema_name?
			
			// schema_name may make more sense.
			// possibly also have a group / collection of schemas.
			//  not sure about collection because these schemas will be used for implementing things to do with the collection.
			//  could have an application-wide dictionary of schemas.
			//  some of these will have to do with HTML, for example.
			
			// It makes sense to use a schema system in various places where it is appropriate, and call it a schema.
			//  Should be compatable where possible with the object definitions and access, such as indexed_array
			//  Called the jsgui-schema standard I think.
			// I may make some separate components that work using this standard. They could be reference implementations of some things.
			//  Checking that an object's properties conform to the schema
			//   Should make it possible to easily get the schema tester to know how the object's properties are done, such as on Data_Object using get and set
			//   functions.
			
			// Will also be able to say something requires an object with a particular interface.
			//  Data_Objects will have an 'interfaces' property (private property)
			//   this will help them tell whether the object that is connected has the right interface(s)
			
			// Objects can have more than one interface.
			//  This is akin to c#. In this case, we don't care about how inheritance is done on the object (it can be done in different ways to c#), but we are saying that the object
			//  conforms to a particulat interface, ie has various properities.
			//   In some cases those properties must be set.
			
			// Will also be able to specify functions in interfaces (and object_schemas I think), so that it can be run through tests.
			
			// Interfaces: an interface is a named conformance to either a specified or named schema.
			
			// jsgui.data_types -> jsgui.schemas
			
			// These schemas will be usable in form validation, creating HTML forms, processing them, and dealing with objects in databases, perhaps with generated CRUD.
			//  They will be simple to specify.
			//  There will sometime be a GUI tool for specifying schemas.
			//   They won't be too complicated - but they could be used for describing some real-work objects.
			
			
			
			// tell it what to look for with that property.
			
			// There may be some more complicated cases.
			//  Could be referring to multiple required objects for one property name.
			//  They could be in a collection, or an array.
			
			// can add an object to the requirements.
			//  checks that the item is there?
			
			// checks that the item conforms.
			//  possibly to an object_schema.
			// the object_schema system could be used for data types elsewhere - not sure about this. It sounds OK though.
			
			// elsewhere, whe check if an object conforms to a set type.
			
			// maybe object_schema should be the same system, or the other system could change over to using an object_schema, to make things clearer.
			//  I think the object_schema abstraction would help a bit.
			
			// will be making use of jsgui.data_types_info
			
			// string and an object
			//  the string is the name of the property within this object
			//  the object is the schema for that property.
			
			
			
			// Requirements will be sealt with through the constraints system.
			//  Perhaps it is an assumption that it is required the constraints are satisfied.
			
			//  A requirements system may operate for resources... not so sure about having requirements in the Data_Object as that seems like it can be 
			//   handled by fields and constraints.
			
			
			if (a.l == 0) {
				// return the requirements.
				
				return this._requirements;
				
			}
			
			
			
		}),
		
		
		// meets_requitements, was check_requirements?
		
		// meets returns a boolean, check returns a report saying where it failed.
		
		// A resource may require another resource to have started in order to start.
		//  Now working on the code execution path for the MetaBench hosting (expandable) server to be run.
		//  Will host the website as a Resource before long.
		//  Will also be interacting with DBs using a resource API.
		
		// There is quite a bit of general structure, and lots of scope for specifics to be built.
		//  Do want to get my website hosted.
		//  A few components could display things quite nicely.
		
		// Will have a demo section showing front-end components.
		//  May have an e-learning section
		
		// Mobile development
		// 
		
		
		// Will use field constraints for the moment
		//  Requirements may make an appearance in resources, ie saying that a resource requires another resource (to have started) before it can start.
		'_____meets_requirements': fp(function(a, sig) {
			
			// Possibly check field constraints, but these would have probably been checked on input or on setting the constraints.
			
			var requirements = this._requirements;
			if (!requirements) {
				return true;
			} else {
				if (sig == '[s]') {
					var property_name = a[0];
					
					// does it meet that one requirement?
					
					// not sure exactly how requirements are expressed right now.
					//  I think many of those things should be written up in documentation on the system and published.
					
					// 'name': ['regex', rx]
					
					// could check for different data types as well
					//  could check that something has a particular status, either function result or its own object.
					
					
					// How much of this is in 'nested'?
					//  How much of nested should be brought to the core?
					
				}
			}
			
		}),
		
		
		// although this is not a collection, it is similar to a normal JS dict / object.
		//  would be good to iterate over all the items of data in this. 
		
		'each': function(callback) {
			// could use for i in...


			/*
			each(this._, function(i, v) {
				callback(i, v);
			});
			*/

			// Could have inline code here for speed?
			each(this._, callback);


		},
		
		
		// could make this polymorphic so that it 
		'position_within': function(parent) {
			var p_id = parent._id();
			//console.log('p_id ' + p_id);
			//console.log('this._parents ' + stringify(this._parents));
			
			if (this._parents && is_defined(this._parents[p_id])) {
				var parent_rel_info = this._parents[p_id];
				//console.log('parent_rel_info ' + stringify(parent_rel_info));
				
				//var parents = this._parents;
				//if (parents) {
				//	
				//}
				var pos_within = parent_rel_info[1];
				
				// It is indexed by position in parent through the parent.
				
				return pos_within;
				
			}
			
			
		},
		
		'remove_from': function(parent) {
			var p_id = parent._id();
			
			if (this._parents && is_defined(this._parents[p_id])) {
				
				var parent = this._parents[p_id][0];
				var pos_within = this._parents[p_id][1];
				
				// is the position within accurate?
				var item = parent._arr[pos_within];
				//console.log('item ' + stringify(item));
				
				
				//console.log('');
				//console.log('pos_within ' + pos_within);
				// Then remove the item in the collection (or Data_Object?) ....
				// and the actual parent?
				
				// can get control / dataobject / collection by its ID of course.
				
				parent.remove(pos_within);
				
				// Remove it by index.
				
				delete this._parents[p_id];
				
				
				
			}
			
		},
		
		// Will just deal with constraints for the moment.
		//  I'll probably make it so that resources have requirements.
		
		
		
		// Requirements may be more general and flexible than field constraints.
		//  Requirements could be that another component has initialized.
		
		
		'_____check_requirements': fp(function(a, sig) {
			// tell it what to look for with that property.
			
			if (a.l == 0) {
				// then check all of the requirements
				// returns true if successful, otherwise details of where it fails.
				
				// could maybe lead to a truth(x) function that checks if x === true, rather than is an object that could be giving details of something being false.
			}
			
			if (sig == '[s]') {
				// then check that one property
				var property_name = a[0];
			}
			
			if (a.l == 1 && a[0] === true) {
				// that means it's recursive.
				//  we'll be checking the requirements of this, and of any required objects.
				
				
				
			}
			
			
		}),
		
		// will be able to use the DataObject's class_name for get and
		// set.
		// maybe just type_name?
		// Could have a type name heirachy. So that if it does not find
		// get/set methods for div, it uses the ones for control.

		/*
		 * 'property_ensure': function(property_name, value) { // like
		 * set, but does not overwrite it.
		 * 
		 * 
		 * var al = this._alias[property_name]; //console.log('al ' +
		 * al); if (al) { property_name = al; }
		 * 
		 * //var s3_name = property_name.split('.'); var pos1 =
		 * property_name.indexOf('.'); // or call set
		 * 
		 * if (pos1 == -1) { // if (tof(this._[property_name]) ==
		 * 'undefined') { this._[property_name] = value; }
		 *  } else { // it separates them into sub-properties. // should
		 * use the set procedure for the subproperties.
		 *  // and the event will say which subproperty has changed.
		 * set(this, property_name, value);
		 * 
		 *  }
		 *  }
		 */

		// Removing events won't work well when there are vary many.
		// Perhaps multiple listeners could be removed relatively
		// quickly.
		// Also, what about event delegation to another object?
		// Something could have an event_parent.
		// Gets told about events.
		// And that will have the event handler
		// Saves attaching so many event handlers.
		// Event propagates / bubbles.
		// Could even have just a 'parent' data object that receives
		// this information about events?
		// May do other things though.
		// Could even have the parent eventl listeners listen for the
		// actual events?
		// Not then throw them in the same way.
		// HTML surfaces will be listening for the events of delegated
		// objects through the HTML event delegation mechanic.
		// So even with no listeners set up, it will tell a delegation
		// parent.
		// Or event parent.
		// Will leave defining the event bubbling here.

		// Backbone does not seem to have this event bubbling mechanism.
		// Seems to be about receiving all events for a page.
		// Quite possibly should have a Data_Object Event class.
		// This will know the target, maybe other things.
		// DO NEED TO keep track of the target when sending these events
		// through a chain.
		// Target is assumed to be this when calling it with 2
		// parameters
		
		// Events getting raised on too many items when there are objects within different page contexts.
		
		// Want objects in more independent contexts.
		
		

		'load_from_spec': function(spec, arr_item_names) {
			var that = this;
			each(arr_item_names, function(i, v) {
				var spec_item = spec[v];
				if (is_defined(spec_item)) {
					that['set'](v, spec_item);
				}
			});
		},

		'mod_link': function() {
			return jsgui;
		},

		// Could use less polymorphism and recursion here.
		//  Could maybe iterate structure with a while loop.

		'value': function() {
			var res = {};
			this.each(function(i, v) {
				if (typeof v.value == 'function') {
					res[i] = v.value();
				} else {
					res[i] = v;
				}
				
			});
			return res;
		},

		// Much of the time enhanced_data_object will be used.
		// get() returns the object - will make the object out of field values / just return _.

		// Asyncronous nested get gets tricky - especially when some of the calls to get objects
		//  are asyncronous and some are not. However, need to process the list of property names
		//  asyncronously where necessary.

		// Maybe will do that outside of data-object though.
		//  The non-async get is fairly complicated already.
		//  It may be possible to make a new get function for Resource that makes use of the get function
		//   of data-object.
		//  However, a data-object would need to be able to interact with this...
		//   So I think that data-object needs this capability too.
		//   I think that asyncronous nested get will be a really useful capability to have,
		//   but it won't be so easy to implement.
		//    Need to be methodical about it.
		//  Running through nested get examples and tests would make a lot of sense.
		//  I think making some smaller jsgui test cases would also be very useful.

		// Would it be possible to make some simple resources that take a while to return a simple result, (1s maybe)?
		//  Then they could be in a chain / sequence so that the async get can be tested to work.

		// Perhaps only Resources have an async get() at their own level, getting their own information.

		// get - a word used because JS did not have getters and setters, getting from a local variable
		//       a word used to signify getting from a more remote location, like from disk or over a network
		//                              calculation

		// Making a very flexible get function would be a very useful thing to do. It will cover the various meanings,
		//  dealing with locally stored data as well as remote.

		// Within a Data_Object, it will be getting Data_Object properties syncronously, but when it encounters a Resource,
		//  it may need to get that asyncronously.

		// How about:
		//  If Data_Object get was called asynchronously, it can call async get functions from resources, and continues
		//   through the chain calling asynchronously.
		//  It fails if it tries to make a syncronous call on a Resource.
		//   Integrating promises would be nice, but it's a new style of programming that makes that part
		//    more complicated when used in conjunction with other pieces of coding that I'm also working on.


		// I think the non asyncronous get can be simplified.
		//  It seems like it is definitely worth getting unit testing done.



		'get': fp(function(a, sig) {

			// Could have more managable (for the compiler) functions.

			// but when nested is in place, is it still working right?
			// also will have to deal with particular output formats.
			//  many controls / data types for the moment will have default output as HTML formatted.
			//console.log('Data_Object get this.__type_name ' + this.__type_name);
			//console.log('Data_Object get sig ' + sig);
			//console.log('* get a ' + stringify(a));
			// will also be looking at the output processors.
			if (is_defined(this.__type_name)) {
				// should possibly have this assigned for controls...
				//var raw_input = a;
				//console.log('this.__type_name is defined: ' + this.__type_name);
				
				//var parsed_input_obj = jsgui.input_processors[this.__type_name](raw_input);				
				if (a.l == 0) {
					var output_obj = jsgui.output_processors[this.__type_name](this._);
					return output_obj;
				} else {
					throw 'not yet implemented';
				}
			} else {

				if (sig == '[s,f]') {

					// however, it is more complicated than that.
					//  maybe put this in resource level?

					// Though, collections and data-objects handling async operations well would be an advantage.
					//  This may intersperse with the resources, could perhaps have the resource return a promise
					//  (function?) if it had to operate asyncronously.

					// Go through the system with async calls?
					//  May not be all that hard to do...

					// I think this may need more work...
					//  Keep continuing through the chain, using async chaining.
					throw 'Asyncronous access not allowed on Data_Object get.'


					var res = this.get(a[0]);
					var callback = a[1];

					if (typeof res == 'function') {
						res(callback);
					} else {
						return res;
					}



					// could check if we had a function returned.
					//  then we execute that function


					//callback(null, res);
				}

				// check to see if there is a field defined.
				if (sig == '[s]') {
					//console.log('get param: ' + a[0]);
					var fc = this.fc;
					
					// let's have a look at the fields
					
					// Don't try to stringify field collections (yet).
					
					//console.log('fc.get() ' + stringify(fc.get()));
					
					
					
					var field_name = a[0];
					// could have .s in it, making it nested, and have removed nested from here.
					//console.log('pre fc get');
					var field;
					if (fc) {
						field = fc.get(a[0]);
					}
					
					
					//throw 'stop';

					// being told to get 'dom.attributes.class'.
					//console.log('field ' + field);
					// should be able to get 'dom' field first.
					
					// so if it is multi-level, we can have a function that processes this multi-level request.
					
					//console.log('field_name ' + field_name);
					
					if (field_name.indexOf('.') > -1) {
						// Then we are dealing with a request for a nested object.
						// Split up the field_name into the various field names for the levels, then have a recursive function here
						//  process through the levels. Will keep the recursive part small in size and located here.
						// May not need to even be recursive.
						
						var arr_field_names = field_name.split('.');
						
						var level = 0, l = arr_field_names.length;
						var current_obj = this, new_obj, fname;
						while(level < l) {
							fname = arr_field_names[level];
							if (!current_obj) {
								return undefined;
							}

							// OK, but we may be dealing asyncronously now. If the current object is a function,
							// it gets called and we use the callback to do its stuff.

							// I think this branch should only handle synchronous chaining.
							/*
							if (typeof current_obj == 'function') {
								// the gotten info is there I hope
								// This totally would not work in a while loop I think.
								//  Maybe would need to split up the getting, and ending the while loop.
								// May be worth seeing what is next...

								// if this was called without a callback, and needs to be async, can return
								//  a function to call.

								// let's have a look at the next levels field names...
								console.log('level', level);
								console.log('arr_field_names', arr_field_names);

								// want to get the slice of arr_field_names until the next 
								//  maybe return a promise to get it here?
								//   and set it up so that it proceeds to get it...

								var next = arr_field_names.slice(level).join('.');

								return function(callback) {
									//return current_obj.get(next, callback);
									return current_obj(function(err, res) {
										console.log('got res', res);
										console.log('got res', stringify(res));

										// That's assuming res is a resource or data_object?

										res.get(next, callback);
										//res(next, callback);
										//callback(null, res);
									})
								}


								// want to call get on the item returned.


								//throw 'stop';
								
								//current_obj(function(err, gotten) {
								//	//new_obj = current_obj.get(fname);
								//	level++;
								//	// too late by now. would need to break out of the while.
								//	//  not really possibly (right now)?
								//	//  

								//	current_obj = new_obj;
								//})
								
							} else {
							*/
							new_obj = current_obj.get(fname);
							//console.log('fname ' + fname);
							
							// So, when the dom object is obtained, it should have its own fields.
							//  The 'get' function will need to be modified to return objects of the right type / class.
							
							//console.log('new_obj ' + stringify(new_obj));
							//console.log('current_obj ' + stringify(current_obj));
							
							level++;
							current_obj = new_obj;
							/*
							}
							*/


							
						}

						// but could this return a function?
						//  could that be handled?

						return current_obj;
					}
					
					//console.log('field_name ' + field_name);
					//console.log('field ' + stringify(field));
					
					// fields seem to stop having been set up properly.
					
					//console.log('get: field ' + (field));
					//throw 'stop';
					if (field) {
						//console.log('tof(field) ' + tof(field));
						//console.log('field ' + stringify(field));
						
						//throw 'stop';
						
						//console.log('this._[field_name] ' + this._[field_name]);
						// depending on the type, such as if it is a collection or some other kind of Data_Object, define it.
						//if (!is_defined())
						
						// do we know the field name yet?
						// yes
						//console.log('field_name ' + field_name);
						//console.log('this._[field_name] ' + this._[field_name]);
						
						
						if (!this._[field_name]) {
							
							//console.log('did not find object for field. will make one if appropriate. field_name = ' + field_name);
							//console.log('this._[field_name] ' + this._[field_name]);
							// create the new item of that type.
							//  just collections for the moment.
							
							var sig_field = get_item_sig(field, 20);
							//console.log('1) sig_field ' + stringify(sig_field));
							//console.log('field ' + stringify(field));
							// And a function here? The definition of a field? String consructor etc.
							//  Harder to differentiate between that and callbacks now.

							// A constructor function or a callback?
							//  There would need to be a way to tell the difference, even if we assign a 
							//  _is_constructor property to the constructors.

							// Perhaps stop using this?
							//  We can get fields anyway, without specifying the types.
							//  Also the constructor function there gets confused with callbacks potentially.

							if (sig_field == '[s,s,f]') {
								var field_name = field[0];
								var fieldStrType = field[1];
								var fieldDef = field[2];

								// Maybe look out for String?
								//  Dealing with String fields, given as a String class?


								// But if it is a String, maybe we use a Data_Value

								if (fieldDef == String) {
									//console.log('is a String');
									//throw 'stop';

									var dval = new Data_Value({
										'context': this._context
									})
									this._[field_name] = dval;
									return this._[field_name];


								} else if (fieldDef == Number) {
									//console.log('is a String');
									//throw 'stop';

									var dval = new Data_Value({
										'context': this._context
									})
									this._[field_name] = dval;
									return this._[field_name];


								} else if (fieldStrType == 'Class') {
									// Can't create a new string like this...

									var FieldConstructor = fieldDef;
									var nObj = new FieldConstructor({
										'context': this._context
									})
									this._[field_name] = nObj;
									return this._[field_name];

								}

								

							}

							if (sig_field == '[s,[s,u]]') {
								// it looks like it has gone wrong.
								var stack = new Error().stack;
								console.log(stack);
							}
							
							if (sig_field == '[s,s,o]') {
								var field_name = field[0];
								var field_type_name = field[1];
								var field_info = field[2];
								
								//field_name
								//console.log('* field_name ' + field_name);
								//console.log('* field_type_name ' + field_type_name);
								//console.log('* field_info ' + stringify(field_info));
								// need to cover cases where we have the field info.
								//  it may need to create a new object matching that field, with the check
								//   that the data fits into that field.
								// Data_Value would likely be a good type for a variety of fields.





								if (field_type_name == 'collection') {
									//console.log('lazy loading - creating new collection');
									this._[field_name] = new jsgui.Collection({
										'context': this._context
									});
									return this._[field_name];
								} else {
									// if it's just a string?

									// 'data_object'
									//  may get the data_type_object_constructor here.

									if (field_type_name == 'data_object') {
										var dobj = new Data_Object({'context': this._context});
										this._[field_name] = dobj;
										dobj.parent(this);
										return this._[field_name];
									}


									if (field_type_name == 'ordered_string_list') {
										var osl = new Ordered_String_List();
										this._[field_name] = osl;
										return this._[field_name];
									} else if (field_type_name == 'string') {
										// use a Data_Value?
										//throw 'stop';
										var dv = new Data_Value({
											'context': this._context
										});
										//dv.set()
										
										//console.log('dv.__id ' + dv.__id); 
										//console.log('dv._id() ' + dv._id()); 
										//throw 'stop';
										this._[field_name] = dv;
										
										// not providing an index
										dv.parent(this);
										
										//console.log('dv ' + stringify(dv));
										
										return this._[field_name];
									} else {

										// need to look into more info about the field.
										//  
										//console.log('field_info ' + stringify(field_info));
										// ignore indexed here I think.

										// Can get data type object constructors for various types of field, such as
										//  {"data_type": ["text", 32], "indexed": true}
										//  indexed text(32)


										//if (field_info.data_type == )
										// need to see if it's a text field.
										//  data_type = [name, length]
										//  and look at the item_sig for the data_type.
										var dt = field_info.data_type;
										var dt_sig = get_item_sig(dt, 4);
										//console.log('dt_sig ' + dt_sig);

										if (dt_sig == '[s,n]') {
											var data_type_name = dt[0];
											var data_type_length = dt[1];

											// then for text, just make a Data_Value

											if (data_type_name == 'text') {
												var dVal = new Data_Value({
													'context': this._context
												});
												//dVal.parent(this);
												//value.set(field_val);
												this._[field_name] = dVal;
												return this._[field_name];
											}

											// If the data type is just a string, need to process some specific
											//  data types.
											// This may be possible using input processors?


										} else if (dt_sig == 's') {
											var data_type_name = dt;
											//console.log('*** data_type_name ' + data_type_name);

											if (data_type_name == 'int') {
												var dVal = new Data_Value({
													'context': this._context
												});
												//dVal.parent(this);
												//value.set(field_val);
												this._[field_name] = dVal;
												return this._[field_name];
											}
											//if (data_type_name == '')
										} else {
											var dtoc = this.mod_link().ensure_data_type_data_object_constructor(field_type_name);
											//console.log('dtoc ' + dtoc);
											// then use this to construct the empty field.
											
											//throw '!!stop';

											var field_val = new dtoc({'context': this._context});
											field_val.parent(this);
											this._[field_name] = field_val;
											return this._[field_name];
										}



										// throw 'stop';

											
									}
									
									// check if it is a defined data type.
									//  if so, we can do something with it.
									//   input with that data type, and output from it.
									
									// This code is getting quite big. I think it won't be all that big when compressed, refactored a bit.
									//  Once it has been tested it can be refactored down quite a lot, don't want to do that while it is still being built.
									
									// if there is an input processor, we know how to deal with it for the moment.
									//  same with output processor?
									
									// so you get the dom data_object?
									//  I think automatically created and nested Data_Objects are the way.
									
									// a Data_Object of that type?
									//  automatic Data_Object extensions?
									
									//throw('5) stop');
								}
								
							} else if (sig_field == '[s,s]') {
								var field_name = field[0];
								var field_type_name = field[1];
								
								//console.log('field_name ' + field_name);
								//console.log('field_type_name ' + field_type_name);
								
								// perhaps getting collection fields should be moved to enhanced_data_object?
								//  not keen on interdependencies here.
								
								
								
								if (field_type_name == 'collection') {
									
									// lazy creation of fields.
									
									throw 'not supported here. should use code in enhanced-data-object.';
									
									// So, Collection has been added to jsgui by now.
									console.log('pre make coll');
									
									// Maybe Collection has not been added to jsgui.
									//  Need to ensure it does get added when it's getting used.
									
									// seems like the Collection object does not get put back on this...
									//  or at least not always.
									
									// looks like we use the module as it is.
									
									var coll = new jsgui.Collection({
										'context': this._context
									});
									
									console.log('pre set coll parent');
									coll.parent(this);
									
									this._[field_name] = coll;
									return this._[field_name];
									
								} else if (field_type_name == 'data_object') {
									var dobj = new jsgui.Data_Object({
										'context': this._context
									})
									dobj.parent(this);
									this._[field_name] = dobj;
									return this._[field_name];

								} else {
									var dtoc = jsgui.ensure_data_type_data_object_constructor(field_type_name);
									//console.log('dtoc ' + dtoc);
									//throw '!stop';
									// then use this to construct the empty field.
									//  without the new constructor it was trying to make an abstract version!!!
									var obj = new dtoc({'context': this._context});
									//if (this._context) obj._context = this._context;
									obj.parent(this);
									
									this._[field_name] = obj;
									//console.log('this._ ' + stringify(this._));
									
									return this._[field_name];
								}
							} else if (sig_field == '[s,[s,s]]') {
								var field_name = field[0];
								var field_info = field[1];
								
								//console.log('field_info ' + stringify(field_info));
								
								if (field_info[0] == 'collection') {
									var collection_type_name = field_info[1];
									
									// new Collection('string') should work.
									
									// context needs to be set at the beginning though.
									//  Can't make a collection from this module.

									// Need a way to be able to!
									
									//var ncoll = new jsgui.Collection({'context': this._context})
									
									//var ncoll = new jsgui.Collection(collection_type_name);
									//if (this._context) ncoll._context = this._context;
									
									//ncoll.parent(this);
									//this._[field_name] = ncoll;
									//return this._[field_name];
								}
							} else if (sig_field == '[s,[s,o]]') {
								// [fieldName,['collection', objDef]]

								// eg field ["entries", ["collection", {"address": "string", "family": "string", "internal": "boolean"}]]
								// it's a collection?? (check, with the particular data type)

								var field_name = field[0];
								var field_info = field[1];
								var data_type_name = field_info[0];

								if (data_type_name == 'collection') {
									var objDef = field_info[1];
									throw 'not supported here. should use code in enhanced-data-object.';

									// Need to do more than this.
									//var ncoll = new jsgui.Collection({'context': this._context})
									
									//var ncoll = new jsgui.Collection(collection_type_name);
									//if (this._context) ncoll._context = this._context;
									
									//ncoll.parent(this);
									//this._[field_name] = ncoll;
									//return this._[field_name];
								}

							}
							
							
						} else {
							//console.log('did find field obj ' + field_name);
							
							return this._[field_name];
						}
						
						//var tf = tof(this._[field_name]);
						//console.log('tf ' + tf);
						//if ()
						
					} else {
						// Without a field... t

						var res = ll_get(this._, a[0]);

						//console.log('property_name ' + property_name);
						//console.log('res ' + res);
						return res;
					}
					
					
					
				} else if (a.l == 0) {
					// need to get the values of all fields.
					//  Think they are now being held in the field collection, fc.
					
					return this._;
				}
			}
			
			
		}),

		// trying a different way of doing things.
		
		'___get_fields_chain': function() {
			// is this the prototype / constructor.
			
			var my_fields = this._fields;
			
			// a bit difficult...
			
			
			console.log('my_fields ' + stringify(my_fields));
			
			var con = this.constructor;
			console.log('con ' + stringify(con));
			
			//this._super();
			
			/*
			
			var sc = this._superclass;
			console.log('sc ' + sc);
			
			
			
			console.log('this._fields ' + stringify(this._fields));
			
			if (con) {
				var con_fields = con._fields;
				console.log('con_fields ' + stringify(con_fields));
				
				var con_super = con._superclass;
				console.log('con_super ' + stringify(con_super));
				
				var con_pro = con.prototype;
				console.log('con_pro ' + stringify(con_pro));
				
				var con_pro_super = con.prototype._superclass;
				console.log('con_pro_super ' + stringify(con_pro_super));
				
				var con_pro_fields = con_pro._fields;
				console.log('con_pro_fields ' + stringify(con_pro_fields));
				
				
			}
			
			
			var pro = this.prototype;
			console.log('pro ' + pro);
			
			if (pro) {
				var pro_fields = pro._fields;
				//var con_pro = con.prototype;
				console.log('pro_fields ' + stringify(pro_fields));
				
				
				var pro_super = pro._super;
				console.log('pro_super ' + stringify(pro_super));
				
				
			}
			*/
		},
		
		'_get_input_processors': function() {
			//throw 'stop';
			return jsgui.input_processors;
		},
		
		// 


		'set': fp(function(a, sig) {
			// property_name, value
			
			// May override this with collections...
			//  Clear, then push first item, when given a Data_Object.

			//console.log('Data_Object set sig ' + stringify(sig));
			//console.log('this._abstract', this._abstract);
			if (this._abstract) return false;
			
			var that = this, res;
			
			//console.log('');
			
			
			// May want to add it to a collection in some cases.
			//  Or make it the only item in the collection.
			
			// The signature for set as well?
			
			//console.log('');
			//console.log('set');
			
			//console.log('this.__type_name ' + this.__type_name);
			//console.log('this._data_type_name ' + this._data_type_name);



			var input_processors;
			if (this._module_jsgui) {
				input_processors = this._module_jsgui.input_processors;
			} else {
				input_processors = this._get_input_processors();
			}

			//console.log('*** input_processors ' + stringify(Object.keys(input_processors)));

			// or some other value will be set?
			//console.log('jsgui.input_processors ' + stringify(jsgui.input_processors));
			// These input processors need to be available throughout.
			//  Not sure about where to retrieve them from when using AMD.
			//   Could pass forward a request fot input processors.
			// so would have _get_input_processors function.
			//  that would retrieve it from whichever module it is from.

			// so there may not be an input processor set up already for it.
			//  some classes won't need it.

			// Need to refactor this.


			// setUsingInputProcessor

			// setUsingThis




			// Less important a distinction now.
			//  The data types may have been set up so that they just apply fields, not that they have got
			//   input and output processors.

			if (is_defined(this._data_type_name) && input_processors[this._data_type_name]) {
				// use the input processor of the data_type.

				throw 'stop';
				
				console.log('is_defined _data_type_name and input_processors[this._data_type_name]');

				//console.log('this.__type_name ' + this.__type_name);
				//throw 'stop';
				var raw_input = a;
				
				// we may not have the means to parse that raw input...
				//console.log('input_processors)
				
				// OK, so when setting using the type that has come about through the type system...

				//console.log('raw_input ' + stringify(raw_input));


				// if there is no input processor, to set _, we process it directly.

				// ['name, value'];
				//  set our own fields.
				//if (input_processors[this._data_type_name]) {
					var parsed_input_obj = input_processors[this._data_type_name](raw_input);
					//console.log('parsed_input_obj ' + stringify(parsed_input_obj));
					//throw('2) stop');
					
					this._ = parsed_input_obj;

				this.trigger('change');
				//} else {

				//}


				
				
				
				// set, just with a value... just with the __type_name.
				//  Uses the data type parsing to do this.
				//  Should work for fields.
				
				
				
				
				
				// but then with get() - get according to an output format like HTML / CSS, or the internal JSGUI representation.
				//  could still make use of _ for the internal representation.
				
				
			} else {
				//console.log('no dtn defined');
				//console.log('a.l ' + a.l);
				//console.log('');


				if (a.l == 2 || a.l == 3) {


					var property_name = a[0], value = a[1];

					var ta2 = tof(a[2]);
					//console.log('ta2', ta2);

					var silent = false;
					var source;

					if (ta2 == 'string' || ta2 == 'boolean') {
						silent = a[2]
					}

					if (ta2 == 'control') {
						source = a[2];
					}

					//silent = false || a[2];


					//console.log('set property_name ' + property_name + ', value ' + value);
					//console.log('set value ' + value);
					//console.log('set value ' + stringify(value));
					
					// is the property read_only?
					
					if (!this._initializing && this._map_read_only && this._map_read_only[property_name]) {
						throw 'Property "' + property_name + '" is read-only.';
					} else {
						
						//console.log('***');
						
						// not using ll_set any longer.
						
						// need to use a routine that deals with the data_types.
						
						// Think we need some kind of recursive get-set type of routine.
						//  Get will get it to greate objects that are fields anyway.
						
						var split_pn = property_name.split('.');
						//console.log('split_pn.length ' + split_pn.length);

						// When setting some types of Data_Object class
						//  (like Server, a subclass of Data_Object, and a Resource)
						// need to make sure it sets it with the item given.



						if (split_pn.length > 1 && property_name != '.') {
							//console.log('split_pn ' + stringify(split_pn));
							
							var spn_first = split_pn[0];
							var spn_arr_next = split_pn.slice(1);

							// For dealing with a root item?
							//  So can set its . property?

							// I think we have a special '.' field.
							//  Treat it as an object.


							
							//console.log('spn_first ' + stringify(spn_first));
							//console.log('spn_arr_next ' + stringify(spn_arr_next));
							
							var data_object_next = this.get(spn_first);
							//console.log('data_object_next', data_object_next);
							if (data_object_next) {

								var res = data_object_next.set(spn_arr_next.join('.'), value);

								if (!silent) {

									var e_change = {
										'name': property_name,
										'value': value
									};

									if (source) {
										e_change.source = source;
									}

									this.raise_event('change', e_change);
								}

								
								return res;
								
							} else {

								// Could create a new Data_Object.

								//var ndo = new Data_Object({
								//	// with a context?
								//	'context': this._context
								//});

								// but for the '.' property...









								// Is this recursive?
								//  Need to fix this.

								// May need to specify a data model?
								//  But we want this to be flexible?

								// Maybe we need to declare that Script has got some deeper attributes.

								//var data_object_next = new 

								// Not sure how this is recursing properly.
								//  Maybe work on this at some other time, using an example that's more sandboxed,
								//   such as the US presidents example.

								



								var stack = new Error().stack
								console.log(stack);
								throw('No data object at this level.');
							}
							throw('10)stop');
							// call a multi-level-set function?
							//  could do it recursively here for the moment I think, without much code.
							//   like it is now :)
							
							
						} else {
						
							//console.log('2) no split');
							
							// not necessarily, it still may apply to a data_object.
							
							//console.log('pre get ');
							//  if there is nothing, get should return undefined / null.
							//   perhaps make it if it is an expected object though.
							//    it looks like it is expected? or we have it from the value anyway.
							//    maybe it's only fine to set it to a data_object / data_value.
							
							// if it is just a string we can make a Data_Value to hold it and then put it in place.
							// can use the dobj function???
							
							// can just set the value.
							//  could just record the string in here.
							//  putting it in a Data_Value would eventually help with automatic string indexing.
							//   And it would potentially be an indexed field anyway.
							
							// Potentially parsing object input?
							//  Will have more of that working to do with some HTML properties to start with.
							
							
							
							
							
							// get it???
							//  that could work... could create the right constructor.

							//  There maybe will only be a 

							// Maybe don't need to get this...
							//console.log('---');
							// We may be able to get it, using lazy loading in some cases.
							//  This may look at the fields and create a new object.

							//console.log('1) property_name ' + property_name);
							// But we are setting it!!!



							// May do away with data_object_next.
							//  

							var data_object_next = this.get(property_name);

							// Looking for these in resources, and doing more than needs to be done on init?

							

							// So, the property has not been defined correctly.
							//  Need to make it so that data_def sets up the fields so that they work.




							//console.log('---');
							//  gets it as a string?
							

							// Stringifying this causes an endless loop (sometimes)
							//console.log('data_object_next ' + stringify(data_object_next));
							
							// failing to get tagName property - it's a string proper
							
							// and when setting the tag_name object?
							
							//console.log('property_name ' + property_name);
							//console.log('value ', (value));
							//console.log('***** data_object_next ' + data_object_next);
							if (!is_defined(data_object_next)) {
								
								// add it to the fields collection?
								//this._[property_name] = new Data_Object({});
								//return this.set(property_name, value);
								//console.log('tof(value) ' + tof(value));


								//var tv = tof(value);
								var tv = typeof value;

								/*
								if (tv == 'data_object') {
									// copy directly in more cases than this... maybe just for primitive types do we use the 
									//  data_value.

								} else {

								}
								*/
								var dv;
								//console.log('tv ' + tv);
								if (tv == 'string' || tv == 'number' || tv == 'boolean' || tv == 'date') {
									dv = new Data_Value({'value': value});
								} else {
									dv = value;
								}

								
								//console.log('dv ' + stringify(dv));
								//this._[property_name] = value;
								//throw 'Should make a new Data_Value';

								this._[property_name] = dv;
								// Not making a new Data_Value?

								//console.log('this._[property_name] ' + this._[property_name])
								
								//this.raise_event('change', [property_name, dv]);

								if (!silent) {
									var e_change = {
										'name': property_name, 
										'value': dv
									}

									if (source) {
										e_change.source = source;
									}

									this.raise_event('change', e_change);
								}

								


								//throw 'stop!!!';
								
								return value;
								
							} else {
								//console.log('this ' + stringify(this));
								//console.log('2) property_name ' + property_name);
								//console.log('data_object_next ' + stringify(data_object_next));
								//console.log('tof data_object_next ' + tof(data_object_next));
								
								// Just because we can get the server as a next data object, does not mean we need to.

								//  If we have been given a value, use it.
								//  However, need to clarify this code here.
								//   At some times we will want it to produce the next level of data object, but not at others.

								// Setting a field should be a fairly simple procedure if possible, maybe this code could 
								//  be refactored.

								// So when we have been given a server property, we want to set ._.server to it

								// 


								// REFACTOR?



								// if it is a data object?
								//  if it is a native type?
								
								
								
								if (is_js_native(data_object_next)) {
									//console.log('is_js_native');
									//this.set
									// but maybe that object should be wrapped in Data_Object?
									this._[property_name] = value;
									res = value;
									
									
								} else {
									//console.log('not is_js_native');
									//var res = data_object_next.set(value);

									this._[property_name] = value;
									res = value;


									//console.log('set data object next using value');
								}
								
								
								
								
								//var res = ll_set(this._, property_name, value);
								// should raise an event here.

								// this.raise_event('set', [property_name, value]);
								// then the event tells everything that is listening to it.
								//console.log('this', this);

								//this.trigger('change', [property_name, value]);
								//console.log('property_name', property_name);
								//console.log('value', value);
								//console.log('this', this);

								if (!silent) {
									var e_change = {
										'name': property_name,
										'value': value
									};
									if (source) {
										e_change.source = source;
									}
									this.trigger('change', e_change);
								}
								

								// want to listen to the set event for some things such as GUI components in particular.
								
								return res;
							}
						}
					}
				} else {
					// But maybe it should be a data_value, not a data_object.

					//console.log('3) else sig ' + sig);

					// And for a Data_Object?
					//  Basically put it into place.

					if (sig == '[D]') {
						//console.log('property_name ' + property_name);
						this._[property_name] = value;

						//this.raise_event('change', [property_name, value]);

						// Raise a change event?
						//  Or is set event OK?

					}

					if (sig == '[o]') {
						//console.log('setting with a provided object');
						
						var that = this;
						// may need to be recursive.
						var res = {};
						each(a[0], function(i, v) {
							//console.log('i ' + i);
							//console.log('v ' + stringify(v));
							
							res[i] = that.set(i, v);
							//that.raise_event('change', [i, v]);
							
						});
						return res;
					}

					// C for collection?
					if (sig == '[c]') {
						//this._[]
						this._[property_name] = value;
						//this.raise_event('change', [property_name, value]);
						//throw 'unsupported';
					}
				}
			}
		}),
		'has' : function(property_name) {
			return is_defined(this.get(property_name));
		}
	});

	var initializing = false, fnTest = /xyz/.test(function() {
		xyz;
	}) ? /\b_super\b/ : /.*/;
	
	
	var get_fields_chain = function(data_object_class) {
		var res = [];
		var inner = function(data_object_class) {
			// _fields... fields will be given as an array by default, to preserve the order.
			
			var fields = data_object_class._fields;
			
			
			//console.log('get_fields_chain fields ' + stringify(fields));
			if (fields) {
				res.push(fields);
			}
			// Could be pushing an array containing an array that represents one field.

			var sc = data_object_class._superclass;
			//console.log('sc ' + sc);
			//if (sc) console.log('sc.constructor._fields ' + stringify(sc.constructor._fields));
			if (sc) {
				inner(sc);
			}
		};
		inner(data_object_class);
		//console.log('get_fields_chain res ' + stringify(res));
		return res;
	}
	
	
	// But the fields may have an order. It may be necessary to preserve that order.
	//  The order of fields is not of great imporance usually. May be nice to have their order guaranteed to stay the same...
	//   it may be that different JavaScript engines will do this anyway.
	
	var get_chained_fields = function(data_object_class) {
		// would be nice to do this in a way that preserves the order.
		//  an array of fields may be better.
		
		// The fields chain... need to make sure that is getting the separate fields.
		var fc = get_fields_chain(data_object_class);



		var i = fc.length; //or 10
		
		//var res = {};
		var res = [];
		
		// Not so sure about doing this... is it breaking up a field into more than one field when it should not be?


		while(i--)
		{
		  //...
			var item = fc[i];
			
			// the item can be an object... or an array. Array is better.
			
			//each(item, function(i2, v) {
			//	res[i2] = v;
			//});
			
			// [field_name, field_info]
			
			// Not so sure about including the number?
			//  Is it necessary?
			// Maybe it can be ignored at a later stage.
			//  However, do want it to properly interpret the fields at a later stage.

			var c = 0;

			each(item, function(i2, field_info) {

				//console.log('');
				//console.log('i2 ' + i2);

				if (tof(i2) == 'string') {
					c = c + 1;
					res.push([c, [i2, field_info]]);
				} else {
					res.push([i2, field_info]);
					c = i2;
				}

				//console.log('field_info ' + stringify(field_info));

				//res[i2] = v;
				// field_info could just be the field_name and some text. that should be fine.
				
			});
			
		}
		// not sure that all fields will have simple types.
		//  some will be constructors even.
		// Fields should have been set correctly, not like get_chained_fields res [[0, "indexed_array"], [1, [["red", "number"], ["green", "number"], ["blue", "number"]]]]
		//console.log('get_chained_fields res ' + stringify(res));
		return res;
	}
	
	var chained_fields_to_fields_list = function(chained_fields) {


		/*
		var res = [];
		each(chained_fields, function(i, v) {
			var field_number = v[0];
			var field = v[1];
			res.push(field);
		});
		*/
		
		//console.log('chained_fields ' + stringify(chained_fields));
		
		var l = chained_fields.length;
		//console.log('l ' + l);
		var res = new Array(l);
		//var res_push = res.push;
		for (var c = 0; c < l; c++) {
			//res_push.call(res, chained_fields[c][1]);
			//res.push(chained_fields[c][1]);
			res[c] = chained_fields[c][1];
		};
		

		return res;
	};
	
	jsgui.map_classes = {};
	
	/*
	Object.prototype.begetObject = function () {
		function F() {}
		F.prototype = this;
		return new F();
	};
	
	newObject = oldObject.begetObject();
	*/
	
	// Also want to specify functions that execute upon initialization that call
	//  a function, using a parameter that gets set in the definition.
	// This will be used to enable a Collection subclass to be defined as
	//  Collection.extend({'data_object': Data_Object_Subclass});
	//   Like a collection of products holding the Product Data_Object type and having that
	//   easily and clearly declared within the model code.
	// Could this be done in the normal init?
	//  or use propsToMerge?
	
	Data_Object.extend = function(prop, post_init) {
		var _super = this.prototype;
		initializing = true;
		var prototype = new this();
		
		// copying accross some old things?
		//  keeping some things in the prototype chain?
		var for_class = {};
		
		initializing = false;
		
		//if (tof(prop) === 'string') {
		if (typeof prop === 'string') {
			// giving it a data_type from the jsgui.data_types_info
			var data_type_name = prop;
			var dtis = jsgui.data_types_info;
			//console.log('dtis ' + stringify(dtis));
			//return dtis;
			var data_type_info = dtis[data_type_name];
			//console.log('data_type_name ' + stringify(data_type_name));
			//console.log('data_type_info ' + stringify(data_type_info));
			for_class[data_type_name] = data_type_name;
			for_class[data_type_info] = data_type_info;
			// then it will be read from the class object itself.
			//  will be able to get the constructor object, I think.
			// maybe not best to do this through the prototype?
			//  having difficulty getting the constructor, within the constructor function.
			prototype['__type_name'] = data_type_name;
			prototype['__data_type_info'] = data_type_info;
			
			prop = {};
			
			// then this effectively sets its fields.
			//  create the fields, in order, and have a numeric index saying which field is which.
			//  will have an _operating_mode.
			//  the data_object will be able to operate as an indexed_array... but not sure about making a collection and giving it named items?
			//   collection already takes named items.
			
			// Will also need to deal with collections of objects here.
			//  Will be very nice when the HTML code is very declarative.
			
			// Data_Type_Instance? Or the constructor to the relevant Data_Object functions as its instance?
			//  It's not exactly an instance, it's a constructor, but constructors can have their own methods too.
			
			// Then this is the data_type_instance, effectively.
			
			// so it will hold the data type info within the constructor?
			//  or named reference to it is fine.
			
			//throw('*1 stop');
		}
		var prop_item, t_prop_item, tmp, name, res;
		for (name in prop) {
			
			prop_item = prop[name];
			if (name.charAt(0) === '#') {
				
				// direct copy with '#'... not been using that.
				
				prototype[name.substring(1)] = prototype[prop_item];
			} else {
				// if it's a function, then do the following.
				
				// if it's an object, then it may be something specific to the DataObject type.
				//  such as setting / extending fields of an object.
				
				// some specific non-object things will be set to the prototype.
				//  it will be possible to look at this info, the fields chain in the object, will take a bit of trial, error and design.
				
				t_prop_item = typeof prop_item;
				//console.log('prop_item' + prop_item);
				if (t_prop_item === 'function') {
					
					prototype[name] = typeof _super[name] === 'function' && fnTest.test(prop_item) ?
					// had some difficulty using fp() with 'init' functions. could
					// it have to do with function names?
					
					(function(name, fn) {
						return function() {
							tmp = this._super;
							this._super = _super[name];
							res = fn.apply(this, arguments);
							this._super = tmp;
							return res;
						};
					})(name, prop[name]) : prop[name];
					
				} else if (t_prop_item === 'object' || t_prop_item === 'boolean') {
					
					// don't put these in the prototype.
					//  they are not for the object itself.
					//console.log('property name', name);
					if (name == 'class_name') {
						for_class['_class_name'] = prop_item;
					} else if (name == 'fields') {
						// maybe call it something else, fields is a function.
						// fields could be a function, so call it _fields
						// it sets the array of fields... could be an object representing fields but an array is better because the order gets preserved.
						for_class['_fields'] = prop_item;
						//this['_fields'] = prop_item;
						// then the fields will be read upon initialization?
						//  getting all the fields up the chain...
					} else if (name == 'connect_fields') {
						// maybe call it something else, fields is a function.
						// fields could be a function, so call it _fields
						
						for_class['_connect_fields'] = prop_item;
						
						// then the fields will be read upon initialization?
						//  getting all the fields up the chain...
						
					} else {
						prototype[name] = prop[name];
					}
					
				}  else {
					prototype[name] = prop[name];
				}
			};
		};

		// Looks like this needs to be changed just to be local...
		
		var Class = function() {
		
			//console.log('Data_Object initializing ' + initializing);
			//console.log('Data_Object !!this.init ' + !!this.init);
			
			if (!initializing) {
				if (this.init) {
					this.init.apply(this, arguments);
					if (this.post_init) {
						//this.post_init();
						this.post_init.apply(this, arguments);
					}

					if (post_init) {
						post_init.call(this);
					}
					// Check to see if there are further functions to call...
					//  things that have got put into the extend function?



				} else {
					var spec = arguments[0] || {};
					spec.abstract = true;
					//var newClass = new Class(spec);
					
					//return newClass;
					return new Class(spec);
				}
			}

			/*
			if (!initializing && this.init) {
				//this.constructor = 
				this.init.apply(this, arguments);
				if (this.post_init) {
					//this.post_init();
					this.post_init.apply(this, arguments);
				} else {
					//return return new Class(((arguments[0] || {}).abstract = true));
					
				}
			}
			*/
			
			/*
			if (!initializing &! this.init) {
				//console.log('this looks like it has been called without a "new" keyword, as a constructor');
				
				// init_no_new
				//console.log('this.init_no_new ' + this.init_no_new);
				// so that does not help... yet.
				//console.log('tof(prop) ' + tof(prop));
				
				//var prop2 = clone(prop);
				//console.log('tof(prop2) ' + tof(prop2));
				//prop2.abstract = true;
				
				var spec = arguments[0] || {};

				spec.abstract = true;
				
				//var newClass = new Class(spec);
				
				//return newClass;
				return new Class(spec);

				
				//function object(o) {
				//	 function F() {}
				//	 F.prototype = o;
				//	 return new F();
				//}
				
				
				//function object(o) {
				//	
				//}
				
				//if (this.init_no_new) {
				//	this.init_no_new.apply(this, arguments);
				//}
			}
			*/
			
		};
		Class.prototype = prototype;
		//Class.constructor = Class;
		Class.prototype.constructor = Class;
		// but constructor loses info. not sure how to get back at the constructor from an object?
		//  what is the original constructor even?
		
		Class.extend = arguments.callee;
		
		/*
		if (for_class) {
			for (var c = 0, l = for_class.length; c < l; c++) {
				Class[i] = for_class[v];
			}
		}
		*/
		//console.log('for_class', for_class);
		for (i in for_class) {
			Class[i] = for_class[i];
		}
		

		//each(for_class, function(i, v) {
		//	Class[i] = v;
		//});
		
		// jsgui.map_classes[]
		
		if (Class['class_name']) {
			jsgui.map_classes[Class['class_name']] = Class;
		}
		
		//console.log('_superprototype ' + _super.prototype);
		
		//Class.prototype._superclass = _super;
		
		Class._superclass = this;
		
		//Class._superprototype = _super;

		
		// * if (namespcExtension) { each(namespcExtension, function(i, n) {
		// * Class[i] = n; }); }; if (propsToMerge) { each(propsToMerge,
		// * function(i, n) { if (typeof Class.prototype[i] === 'undefined') {
		// * Class.prototype[i] = n; } else { $.extend(true, Class.prototype[i],
		/// * n); }; }); }
		 

		return Class;
	};

	
	// Will have actual Constraint programming objects.
	//  They may translate to the database level as well.
	//  In many cases the constraints will be expressed as strings such as 'text(32)'.
	//   Would then be translated to varchar(32) on a different level.
	
	
	
	var data_object_matches_field_constraints = function(data_object, field_constraints) {
		// Field constraints given as a normal object.
		
		// returns true or false
		//  though could return failure information as well if asked for it.
		//  making it into another polymorphic function.
		
		each(field_constraints, function(fc_name, fc_value) {
			//console.log('fc_name ' + fc_name);
			//console.log('fc_value ' + fc_value);
			
		});
	};
	// That data object will be indexable.

	var Enhanced_Data_Object = null;

	var set_Enhanced_Data_Object = function(EDO) {
		Enhanced_Data_Object = EDO;
	}

	Data_Object.map_data_type_data_object_constructors = jsgui.map_data_type_data_object_constructors;
 	Data_Object.Mini_Context = Mini_Context;
 	Data_Object.set_Enhanced_Data_Object = set_Enhanced_Data_Object;


	// seems like an overlap with the new jsgui.fromObject function.
	//  That will initially go in the Enhanced_Data_Object module, or jsgui-enh

	var dobj = function(obj, data_def) {
		// could take a data_def?
		// Could use the enhanced data object if we patch backwards?
		//  So Enhanced_Data_Object could hopefully patch backwards in the code?

		//var tdd = tof(data_def);

		var cstr = Data_Object;
		if (Enhanced_Data_Object) cstr = Enhanced_Data_Object;
		//console.log('Enhanced_Data_Object ' + Enhanced_Data_Object);

		var res;
		if (data_def) {
			res = new cstr({'data_def': data_def});
		} else {
			res = new cstr({});
		}

		var tobj = tof(obj);
		
		//console.log('obj ' + stringify(obj));
		if (tobj == 'object') {
			var res_set = res.set;
			each(obj, function(i, v) {
				//res.set(i, v);
				res_set.call(res, i, v);
			});
		}

		return res;
	};
	
	
	// This code could be done using other means in other parts of the system.
	//  The framework code will provide more to do with data type definitions and interpreting input data.
	
	// this seems like part of an input processor.
	//  changes from text to the JavaScript objects that get understood.
	
	
	// parsing a data type
	// similar to parsing a JavaScript function call, but only one ting in the brackets, and there may not be brackets anyway
	
	
	var parse_field_text = Fields_Collection.parse_field_text;
	var parse_data_type = Fields_Collection.parse_data_type;
	// We can't extend this further down while using requirejs
	//  Not sure how to achieve this now, requirejs was meant to be for convenience.

	// Can have some sort of function chaining.
	//  And having a function within the right module called...
	//  That could be a 'linking function.'
	// mod_link.

	// A new constructor for these?
	//  Curried functions?
	//  Or Boolean_DV... Would have tests possibly.

	jsgui.map_data_type_data_object_constructors = jsgui.map_data_type_data_object_constructors || {};
	jsgui.map_data_type_data_object_constructors['boolean'] = Data_Value;
	//boolean': Data_Value
	
	

	// Could do something like pass the ensure_data_type_data_object_constructor function around?
	//  Or the HTML module will have its own way of making object constructors.

	// I think only having object constructor functions going down the module loading heirachy will work.
	//  May have a map of various loading functions that get made in each module.

	// They are basically constructor functions.

	// But this could have access or need access to more information about how to construct objects.
	//  Want to get this working for 'color'.
	var ensure_data_type_data_object_constructor = function(data_type_name) {
		
		//console.log('');
		//console.log('');
		//console.log('jsgui.map_data_type_data_object_constructors[data_type_name] ' + stringify(jsgui.map_data_type_data_object_constructors[data_type_name]));
		//console.log('');
		//console.log('');

		// Hardet to bring that map through all dependencies and back.
		//  However, need to have access to that map variable.

		//console.log('jsgui.map_data_type_data_object_constructors ' + jsgui.map_data_type_data_object_constructors);

		if (!jsgui.map_data_type_data_object_constructors[data_type_name]) {
			//console.log('creating new Data_Object constructor for data_type: ' + data_type_name)
			
			// Need to get the variable back through the modules...
			//  Missing global variables?
			//  Move this function somewhere else?
			//  Maybe we could have some storage available in jsgui-lang-essentials through a closure.
			//  That way the code could be sent back... but do we still have different instances running?

			// Could just be different execution contexts... co can't feed back this information about other objects.
			//  But can feed functionality forards.

			// May need to have things more independant.
			//  

			//var dti = jsgui.get('dti');
			//console.log('dti ' + dti);
			//throw 'stop';

			var dto = jsgui.data_types_info[data_type_name];

			console.log('dto ' + stringify(dto));
			
			var dtc = Data_Object.extend({
				'fields': dto
			})
			jsgui.map_data_type_data_object_constructors[data_type_name] = dtc;
		}
		return jsgui.map_data_type_data_object_constructors[data_type_name];
	}
	jsgui.ensure_data_type_data_object_constructor = ensure_data_type_data_object_constructor;
	
	input_processors.field_text = parse_field_text;
	input_processors.data_type = parse_data_type;


	// collection-index.js

	var Collection_Index = Class.extend({
		'init' : function(spec) {
			// Could do some initialization here?
			//console.log('init Collection_Index');
			//console.log('spec.fields ' + stringify(spec.fields));
			if (is_defined(spec.fields)) {
				this.fields = spec.fields;
				
				// and if it is an array, save an alphabetically ordered copy.
				
				if (tof(spec.fields) == 'array') {
					// Not sure we can sort object fields by name like this?
					//  It seems to work?
					this.alphabetic_fields = clone(spec.fields).sort();
				}

				// the fields held by the Collection_Index.
				//  some fields may represent fields on attached items.
				//   looks like there won't be anything to do on this simple field assignment?



				// this index will be quicker for matching.
			}
			
			this.__type = 'collection_index';
			
		},
		'add_object' : function(obj) {
			var tobj = tof(obj);

			//console.log('add_object Collection_Index');
			//console.log('***** tobj ' + tobj);

			if (tobj == 'array') {

				// check that all of the items can be added before adding any of
				// them???
				// or better to add them sequentially, because there could be
				// conflicts within the items themselves.
				// though, could check that first, but makes the code more
				// complex.
				// could do this by creating a parallel index with the same
				// properties, and have that load the data first.
				var that = this;
				each(obj, function(i, v) {
					that.add_object(v);
				});

			} else if (tobj == 'data_object') {
				//console.log('adding data_object');

				// chack if we can add it.

				//if (this.can_add_object(obj)) {
				// not doing uniqueness checking here.
				
					this.unsafe_add_object(obj);
				//}

				// then need to add the thing!

			}

		}

	// add_object
	// remove_object
	// iterate through objects...
	// default could be an array?
	// ?? get_object(key)

	// Index the whole collection... used when the index is created.

	// get_object(key, key)
	// get_object([keys])

	});

	// Ordered_Dict?

	var BPD_Collection_Index = Collection_Index.extend({
		'init' : function(spec) {
			// indexed with both the b+ tree and the dict.

		}
	})

	// Ordered collection index

	// Dict collection index

	// Ordered_Dict collection index - has both ordered and dict capabilities.
	// More space required, faster get operations through the dict.

	// Full_Text collection index?
	// This will be the most complicated to do. Would make data structures like
	// the Trie.
	// Could have that pluggable for more advanced data structures.

	// Dict, Ordered, and Full_Text seem like good index types.
	// Not saying how Ordered and Full_Text will be implemented.
	// Is it possible / easy for an index to be both full-text and ordered?

	// Could possibly even rate time complexity for each operation.
	// So program could even determine - we have 30,000 records, better download
	// a more efficient index.

	// Dict as the default index?

	// have dict_index(property_name) function?
	// sets up the index. di(pn, false) could remove it.

	// Seems good to separate these things out a lot.
	// Having it so that the index engines could get upgraded.

	// Would be worth approaching this in a very modular way, so that the data
	// structures could all be tested and optimized separately.
	// Swapped as well, as more advanced ones get written.

	//var index_key_separator = '*.oOo.*';
	
	var index_key_separator = ',';
	//  comma should work OK? Maybe not when reading out the values and knowing what they are from the key,
	//  but should be fine for comparisons and ordering
	
	// The trouble is, this could get written about!
	// Is there a way around using such a separator?
	// Not sure about more dict indexes at each level.
	// May not be a problem because we will be searching in the right indexes
	// anyway.

	// Attached fields... these will get indexed too.
	//  However, we won't have that much of an interface or abstraction for dealing with attached objects.
	//  They are simple object[attachmentName].

	// So in a collection, we want to be able to index attached fields.
	//  When querying them, we need to use a notation that indicated we are querying attached fields.
	//   It seems like they should be in the same index structure though.

	// Perhaps need to extend the indexes a bit to cover attached fields specifically in some places.

	// More thought about attached fields seems important.






	var Ordered_Collection_Index = Collection_Index.extend({
		'init': function(spec) {
			this._super(spec);
			// which field(s) get indexed?
			//this.fields = spec.fields;
			this.index_type = 'ordered';

		}

	// this will probably refer to the B+ implementation. need to wrap it
	// concisely.

	})

	// not so sure about this fn.
	var get_fields_key = function(fields) {
		var tf = tof(fields);
		if (tf == 'array') {
			return fields.join(index_key_separator);
		} else if (tf == 'string') {
			return fields;
		}
	}

	var get_obj_fields_key = function(obj, fields) {
		//console.log('get_obj_fields_key');

		//var stack = new Error().stack
		//console.log( stack )
		var tFields = tof(fields);

		//console.log('tFields ' + tFields);
		if (tFields == 'string') {
			fields = [fields];
		}
		
		// var first = true;
		var arr_res = [];
		each(fields, function(i, field_name) {

			// may check if it is a string or can be stringified.
			// maybe should call functions to get a string result too.

			// maybe will look at obj._ for the field value.
			// or use the get function.
			
			//console.log('field_name ' + stringify(field_name));


			var tFieldName = tof(field_name);
			
			if (tFieldName == 'array') {
				

				// gets more complicated with the array.
				//  commas will do fine for now.
				
				//var res = field_name.join(',');
				//console.log('res ' + res);
				//arr_res.push('[' + field_name.join(', ') + ']');
				//return res;
				arr_res.push(stringify(field_name));
				
			} else if (tFieldName == 'string') {

				// But for objects, we are getting potentially attached field values.




				//console.log('field_name ' + field_name);
				var field_val = obj.get(field_name);
				//console.log('field_val ' + field_val);
				arr_res.push(field_val);
			} else if (tFieldName == 'object') {
				//console.log('have an object fieldName, well its not really a simple field name it seems, could be an attached object\'s field.');

				// the key in the index is the value?
				//  is that what an index is in terms of key and value?

				// need a way of iterating through the attached fields?
				//  or deal with one level of attachment at this time?

				if (field_name.attached) {
					// it will only be one attached item.
					var attachedObjName;
					var attachedObjFieldName;
					var c = 0;
					each(field_name.attached, function(i, v) {
						attachedObjName = i;
						attachedObjFieldName = v;
						c++;
					})
					//console.log('c ' + c);
					if (c != 1) {
						throw 'unexpected number of items in attached definition';
					} else {
						var attachedObj = obj[attachedObjName];
						//console.log('attachedObj ' + stringify(attachedObj));
						var res = attachedObj.get(attachedObjFieldName);
						arr_res.push(res);
					}
				}


				//throw 'stop';

			}
			// object...


			// var field_val = obj[field_name];
		})
		return arr_res.join(index_key_separator);
	}

	// Function to get the first or nth?

	
	
	var Sorted_Collection_Index = Collection_Index.extend({
		'init': function(spec) {
			this._super(spec);
			
			//this.fields = spec.fields;
			
			// the fields, sorted by name alphabetically
			//   could be done by Collection_Index
			this.index_type = 'sorted';
			
			// have something about its implementation?
			// could get that from the Sorted_KVS.
			//  Maybe as a function that applies to the type... getting more info about what underlying data structure it is using and the
			//   efficiency of various operations (high efficiency for sorted indexes)
			
			//this.unique_mode = true;
			
			// Can use the Sorted KVS. The fact it's using a tree is not very relevant here.
			
			this.sorted_kvs = new Sorted_KVS(12);
			
		},
		'each': function(callback) {
			return this.sorted_kvs.each(callback);
		},
		
		// this is not a constraint.
		
		/*
		'can_add_object': function(obj) {
			var fields_key = get_obj_fields_key(obj, this.fields);
			
			var count_with_fields_key = this.sorted_kvs.key_count(fields_key);
			
			// The collection index won't be operating unique mode.
			//  It will be a collection constraint, that makes reference to the index.
			
			// Have done a really large amount on this codebase.
			//  Need to do a fair bit more...
			//  Need to have it fully operating with constraints.
			
			// Then something relatively simple, set up with constraints and maybe some data, could be used to create the populated database
			
			// Quite a bit more to do on the general/back-end code.
			//  Then it won't be so hard to populate a few nice components with some text & images.
			
			
			
			
			
			//if (count_with_fields_key > 0) {
			//	if (this.unique_mode) return false;
				
			//}
			return true;
		},
		*/
		
		'unsafe_add_object': function(obj) {
			
			// if the object is just a string?
			//  object needs to be in a data_object though.
			//  that Data_Object can have a set type.
			
			//console.log('Sorted_Collection_Index uao obj ' + stringify(obj));
			
			// but do we have the object's position/numerical index within the collection?
			
			// The fields key...
			//  The field's key?

			//console.log('this.fields ' + stringify(this.fields));


			// what is this function?
			//  gets a string
			//  gets the key for the object's values within this index's fields?

			// so that fields key would need to produce a string that allows the fields in the object
			//  to be indexed 

			var fields_key = get_obj_fields_key(obj, this.fields);



			//console.log('this.fields ' + stringify(this.fields));
			//console.log('fields_key ' + stringify(fields_key));

			// so, we add it to the index.


			//throw ('5) stop');
			this.sorted_kvs.put(fields_key, obj);
			// so far, so good.

		},
		
		// get for one object?
		//  or find? Want flexibility where possible, so may provide arrays.
		
		'get': fp(function(a, sig) {
			//console.log('Sorted_Collection_Index get');
			// will be providing a key, or part of a key
			//  uses the prefix search.
			//console.log('sig ' + sig);
			
			if (sig == '[s]') {
				var search_term = a[0];
				//console.log('search_term ' + search_term);
				var kvps = this.sorted_kvs.get(search_term);
				//console.log('kvps ' + stringify(kvps));
				return kvps;
			}
			
			if (tof(a[0]) == 'array') {
				//throw ('stopping for array');
				var search_term = a[0].join(',');
				//console.log('search_term ' + search_term);
				//var keys = this.sorted_kvs.keys();
				//console.log('keys ' + stringify(keys));
				var kvps = this.sorted_kvs.get(search_term);
				//console.log('kvps ' + stringify(kvps));
				// should return keys and values
				return kvps;
			}
			
		}),
		'has': fp(function(a, sig) {
			if (sig == '[s]') {
				return (this.sorted_kvs.key_count() > 0);
			}
		}),
		'remove': function(obj) {
			// depends on what type of object the collection is holding too.
			//  When initialized as Collection(String).
			//   Has a collection data type constraint.
			//   The collection will still have items indexed.
			
			// So when a string item is added, it needs to get indexed. I'll trace that.
			
			var fields_key;
			if (tof(obj) == 'string') {
				fields_key = obj;
			} else {
				fields_key = get_obj_fields_key(obj, this.fields);
			}
			this.sorted_kvs.out(fields_key);
		}
		
		// when getting... do we have the fields?
	});
	
	// Map rather than dict?
	var Dict_Collection_Index = Collection_Index.extend({
		'init': function(spec) {
			this._super(spec);
			// which field(s) get indexed?
			//this.fields = spec.fields;
			this.index_type = 'dict';
			// also could do more than one field at once.
			// however, this one is no good for doing a search where the first
			// field in the multi-field index is specified but no others
			this.dict = {};
			// this should assume items are unique for the moment.
			// perhaps the Dict_Collection_Index could operate in unique_mode =
			// false as well.
			this.unique_mode = true;
		},

		'can_add_object' : function(obj) {
			// true / false?
			// won't have the error message.
			// perhaps another function could reveal the problem if asked.
			// this would be used for detecting if an object will be OK in a
			// number of different indexes before adding it to the collection.
			var fields_key = get_obj_fields_key(obj, this.fields);
			// is there already an object there? Different object?
			// same object?

			// Want to raise the right exception.
			var existing_obj = this.dict[fields_key];
			//console.log('existing_obj ' + existing_obj);
			if (is_defined(existing_obj)) {
				if (this.unique_mode === true) {

					// if (is_defined(existing_obj.__id) &&
					// is_defined(obj.__id)) {
					// if (existing_obj.__id === obj.__id) {
					// throw 'The same item (identified by ID) is already in the
					// collection, unique fields clash';
					//		
					// } else {
					// throw 'Unique fields clash';
					// }
					// }
					return false;
				}
			}
			return true;
		},

		'unsafe_add_object' : (function(obj) {
			//console.log('DICT unsafe_add_object');
			// it's currently unsafe to stringify some objects.
			//console.log('unsafe_add_object ' + stringify(obj));
			// should have a can_add_object function too,
			// possibly an unsafe_add function that does not do checking.
			// If something can't be added to one index, we don't want it added
			// to any of them.
			var fields_key = get_obj_fields_key(obj, this.fields);
			// won't be (directly) adding array objects to the collection.
			// will be adding collections to collections though.
			// console.log('tof(obj) ' + tof(obj));
			// console.log('Dict_Collection_Index add_object');
			// is this index doing multiple fields?
			// console.log('fields ' + stringify(this.fields));
			// for one field, no separator.
			this.dict[fields_key] = obj;
			// get the fields key from the field values.
			// this.dict[fields_key]

		}),
		'get': fp(function(a, sig) {
			// [s]
			// just one value, searching the index based on that value.
			
			// This one won't have the layer / wrapper for multiple values stored at one key (yet).
			
			// That would be a decent way of doing an index.
			//  The B+ tree would insert the multiple identical keys anyway.
			if (a.l == 1 && tof(a[0]) == 'string') {
				return this.dict[a[0]];
			}
			// array of values - will need to group them together and search the
			// index.
		})

	// some kind of search or retrieval function.
	// 'get' I think for this index.

	})

	// A whole system for collection indexes.
	// Maybe it should be in the collection class?
	// But maybe not if it encapsulates a fair bit of functionality and has a
	// simple enough API.

	// May make sense to keep the indexing system in one place.

	// Ensure there are various indexes...

	// May have both b+ and dict index at once?
	// Combined index? Like the KSVS?
	// Want the indexes to be fast and easy to set up primarily
	// Make it easy to use a b+ tree alongside a dict in indexing.

	// The the specific indexes...

	// Will add objects to them, and be able to do searches / get by key.

	// Want an index that is both b+ and dict.
	// Dict is used for the object retrieval from key
	// The b+ tree is used to ensure the correct order.

	// Collection always has items in an array...?
	// That array implementation could possibly change.
	// However, I think it will be OK for the moment.

	// Add and remove different types of index.
	// Possibly say what sort of index is needed...
	// Then the indexes could have different internal implementations
	//  

	// We may want to expand this in various ways.

	// Has a collection of indexes?
	// With them indexed?
	// In this situation, I think we need to do the indexing within the index
	// system on a lower level... a bit more code.
	// This indexing system will be used in a fair few places.
	// May wish to build on this (maybe separate module)
	// with a disconnected / async index system.
	// can make use of asyncronous data structures. These could be across a
	// network.

	// Collections will have different kinds of constraints to Data_Objects
	//  Though a collection constraint could be that field constraints are required.
	//  Data models defined using this system will then be more easily translated to DB and RDM formats.
	//   Could use these constraints here in JavaScript for checking before putting into an object database
	//   Can also use them in generating the SQL database and its CRUD functions.
	//    Likely to want to continue working on the parser. Being able to parse a variety of languages would prove very useful.
	//     It would also help for them to be integrated with the data model and JavaScript system I am using here.
	//     Being able to graphically illustrate what could go at any point in a document would be very useful...
	//      it would know what the objects are, and help / helpful windows could display information ready to be clicked on or tapped in order
	//      to add that text of function call. Would be nice to have an iPad next to the keyboard to tap things and view info interactively.
	//      Could easily be connected to an address over the LAN, I do think a Local_MB_Node system running in node.js could enhance people's
	//       experience as they use the website. 
	
	// For the moment, the single client is what matters.
	
	// As well as the index system, are the collection_constraints
	// These are different to field_constraints.
	// One collection_constrint will be applying field_constraints
	
	
	// When a collection is given a field constraint, it's a constraint that applies to the fields of all objects in the collection.
	
	// Not a Data_Object?
	//  It would probably be safe to make this a Data_Object.
	//  Making this Index_System use some lower level mechanisms for indexing. The index is not available here, this is used to implement indexing.
	
	// This kind of is the index index. Not so sure about a more complex index index inside this.
	//  Can put a few of the operations in functions to encapsulate index search.
	
	// Maybe don't create the index system if there is nothing to do.

	var Collection_Index_System = Class.extend({
		
		// I am now going to extend this so that it also can use B+ trees.
		//  B+ trees may be advantageous to use in many cases over dicts, but will likely be slower and use more memory, though will
		//  also provide prefix search and ordering functionality in addition to the dict index.
		
		
		'init' : function(spec) {

			// This could keep track of the primary_unique_index for get
			// operations.

			this.collection = spec.collection;

			// This should do a fair few things...
			// A new index can be added

			// New index created? Makes the index go and collect the
			// data by iterating through the array.

			// Will this System class make the CollectionIndexes all
			// work together smoothly in the Collection code?

			// The system will need to keep track of the indexes, kind
			// of provide an index to them.

			// Will this be tasked with carrying out the queries?
			// We have the indexes, we so we have access to the results.

			// The query planner or executer could go in this part.
			// Just need to make it so that collections do get indexed
			// OK, some separation of concerns may help.

			// This could really be in the Collection.

			// Could hook this up to listen for any item being added (or
			// removed) from the collection?
			// Or just have the collection notify it - not sure right
			// now.

			// This could expose an easier API.
			// Could also have a function that gets the index based on
			// which fields, and which index type.

			// Then with everything indexed within this system, it may
			// not be too hard to have this system carry out the
			// searches.

			// However, the searches could get a bit more complex...
			// searching non-indexed data.
			// Or sort, various functions.

			// Perhaps it will just be in the collection...
			// Or there could be an Index_System_Searcher object.
			// That would help encapsulate the functionality, have the
			// code express what it is doing at the same time.
			// So when a search query is given, it is the searcher that
			// queries the index system, finds out what indexes to use,
			// gets those indexes, then prepares the result.
			// It will know what final stages may be necessary to carry
			// out the query specified.

			// this.indexes = [];
			// just stored in an array?

			// or have them in some kind of object matrix?

			// a collection of indexes and then an index of them?

			// a reference to the primary index - the one that is used
			// when processing 'get' requests.

			// index types? dict, ordered_string, full_text?
			// 3 index types with defined capabilities...
			// could put in a full text index, with the full text index
			// API clearly defined.
			// then it would be a job to write some compressed dynamic
			// suffix tree JavaScript code.
			// that data structure would be interesting when run in a
			// distributed fashion, could have it as though very large
			// blocks of memory are available.

			// indexes by field...
			// indexes with multiple fields.

			// field object
			// single index
			// object containing indexes with nested indexes

			// index_map['last_name'].index_map['first_name'].indexes_by_type['dict']
			// one way of being able to get the indexes for a particular
			// field, of a particular type.
			// Think this is an OK way to store a map of the various
			// indexes that are used.
			// What about getting all indexes? Should we store them in
			// an array?
			// Not so sure for the moment, could iterate over these
			// indexes, and add and remove them without too much trouble
			// in this format.

			// get_indexes_by_type_by_fields(arr_field_names)
			// then those indexes are referred to by the type of index
			// (not the data structure used).
			// Though 'dict' works as a hash under the JS dict.

			// may be a little verbose specifying some indexes.
			// however, want a very functional index of indexes.
			// with the possibility of different types of indexes being
			// used.
			// being able to run relatively simple dict indexes on
			// collections for 'get' operations seems like a good plan.
			// have that within a flexible system that allows different
			// index types.

			// has a dict index (lookup / unique key) (could be set to
			// allow multiple items, so that all items at key get
			// returned)
			// or ordered_string? (allows multiple items more easily)
			// or full_text?

			// could get different implementations of these various
			// indexes.
			// for full text, could make a relatively simple tree index.
			// and could also experiment with some optimized full text
			// indexes. The unit testing would be useful for making
			// these indexes, and having a simple one could work
			// very well for testing and comparison.

			// Could have a data structures project where different ones
			// could be made.
			// Not so sure that the client in a web app would need this?
			// Searching would probably be done on the server.
			// However, these data structures could lead to server
			// implementations.

			// index_map['last_name'].indexes['dict']
			// and keeping track of the primary unique index.
			
			// There could be one index that is considered the primary_unique_index.
			//  Maybe determine the primary unique field?
			
			
			
			this.index_map = {};
			//  the indexes stored in the index map.
			//  may require searching at times.
			
			
		},

		// respond to events in the DataObjects / values stored within the collection.
		//  the normal system of propagating events up to the parents / ancestors?
		//  

		'notify_insertion': function(pos) {
			// need to code this.
			//  don't think its relevant for controls, which is what I'm working on right now.

			//console.log('TODO collection-index notify_insertion');
			return false;
		},
		
		
		'clear' : function() {
			this.index_map = {};
		},

		// re-index a whole collection / array...

		// add index by type by fields.

		// and set it as the primary index?
		// want to do that for quick retrieval with get operations.

		// Or set things as being a primary / unique field that will
		// work with get operations.
		// The indexing system is a little complex, but it won't take up
		// too much code when it's in place in the build.
		// Just a few hundred bytes I think.

		// Supporting get operations will make the Collection quite
		// useful.
		// Want it so that collections easily fit into place in code in
		// various situations.
		// Will often be defining which fields in an object are unique
		// Corresponding to unique columns / column constraints in a
		// database.

		// Want to make a nice IDE website, and use that to develop
		// version 2.
		// Saving database resources...
		// Likely to be storing classes and functions within the
		// database. Will be able to build them into modules.

		// Is a complicated way of going about things to have something
		// indexed with a dict...
		// But will save on code used in various objects. Some
		// complexity to be handled by the collection.
		// Will remove clutter from code that should be doing something
		// else apart from indexing a field.

		// Will get some examples with data working, then will get some
		// abstract postgres objects holding their objects using
		// Collection.
		// The Abstract Postgres code will be very clear, and easy
		// access to the objects will be provided.

		// Possibly will index a function matrix using multiple fields
		// in an index?
		// Will take time and effort to improve the collection, but then
		// it will be usable to store more things.
		// Ordering will not matter in many situations.
		// Will be able to sort a collection too, probably to keep it
		// sorted too.

		// Different implementation for get_by_position possible rather
		// than using array?
		// Perhaps these normal collections won't be so good for dealing
		// with large amounts of data, with the array operations.
		// Could maybe make a collection that does not use an array for
		// internal storage.
		// Right now, keeping track of the position in the array is
		// important.
		// Could perhaps make a B+ tree where items know their position.

		// search implies possibly returning multiple records.
		// we should know there won't be multiple records when searching
		// using a unique field / unique field combination.

		// could have 'get'?
		// a way of testing if things are stored in a unique index
		// system?

		// a non-unique dict system where new dicts get created at each
		// level?

		// get_by.
		//  will get by an indexed property.
		
		// get is fairly simple... need to have the index doing searches too.
		
		// also want to search the index system for indexes that are for various fields, but in any order.
		//  These indexes can be used to implement uniqueness constraints even if the order of keys does not match.
		//  Having this deal with some more complicated indexing patterns should make for a very powerful collection component.
		
		
		
		'search_for_index_with_fields': fp(function(a, sig) {
			// will be consulting the alphabetical list of fields.
			//  also, index could be indexed with its alphabetical list of fields.
			
			// scope for optimization through improved index index
			//  alphabetically sorted KVS of alphabetically sorted index fields.
			//  This is the kind of thing that will make this a good system!

			// Perhaps need different naming for attached fields?
			//  Need to be able to tell them apart from a list of fields.

			// an attached field:
			// ['attached', 'meta', 'name']
			//  could get confused with an array of three string field names.

			// '/.meta.name'
			//  /. could be convenient syntax for this, so we indicate that a field has been added that is
			//   an attached field.

			
			//console.log('search_for_index_with_fields ' + sig);
			//console.log('a ' + stringify(a));
			
			if (sig == '[s]') {
				return this.search_for_index_with_fields([a[0]]);
			}
			if (sig == '[a]') {
				
				// check the index in alphabetical order - any index with the right fields will do.
				
				//  may have option to continue search for the index with them matching in the right order.
				
				// could check for that one first.

				// OK, but to identify this is one field?
				//  Perhaps the whole field name as a string is better?

				
				//console.log('a[0] ' + stringify(a[0]));
				
				//var sorted_
				var idx = this.get_index_starting(a[0]);
				//console.log('idx', idx);
				return idx;
				
			}
			// how about looking through the indexes in this function?

			if (sig == '[o]') {
				var res;
				var matching_count = 0;

				this.iterate_indexes(function(index, stop) {
				
					
					
					//console.log('iterate_indexes index ' + index);
					//console.log('iterate_indexes index.fields ' + stringify(index.fields));
					//console.log('iterate_indexes index.fields ' + stringify(index.fields));
					//console.log('fields ' + stringify(fields));
					// compare the two arrays
					
					var i_fields = index.fields;
					if (tof(i_fields) == 'string') i_fields = [i_fields];
					
					//console.log('a[0] ' + stringify(a[0]));
					//console.log('i_fields ' + stringify(i_fields));

					var ae = are_equal([a[0]], i_fields);
					

					if (ae) {
						//matching_indexes.push(index);
						res = index;
						matching_count ++;
						//console.log('res ' + res);
						//return res;
					}
					
					//console.log('ae ' + ae);
					
					
					
					//throw ('iterate_indexes stop');
				});
				if (matching_count > 1) {
					throw 'unexpected matching_count > 1';
				} else {
					if (matching_count == 1) {
						return res;

					}
				}

			}
			
			
			
			
		}),
		
		
		// calling this find now.
		//  shorter, more positive sounding.
		'find': fp(function(a, sig) {
			
			// we can't really do search at the moment.
			//  21/06/2012, now we can. Good B+ implementation now in there.
			//  it looks like we can now... but maybe it's using 'get'.
			
			// however, do want full-text search.
			
			// will be doing searches with = or prefixes ok.
			
			//  (not all that well)
			// at a later stage we will have full-text search on indexes
			//  will search a lower case version of the text.
			
			// I think a trie will suffice for this functionality.
			//  Will do more experiments on this.
			//  May have an index of words and word occurrances within a collection.
			//   That would be a decent indexing system.
			//   Could also go for the full text index that could be more powerful and flexible.
			//   May want to be careful about setting word boundary search rules.
			
			// that could be done using a trie, prexix tree, suffix tree, suffix array, compressed dynamic suffix array, or other data structure.
			
			
			// can search one field for a name / value pair.
			//console.log('Collection_Index_System search sig: ' + sig);
			// searching multiple fields - multiple name value pairs.

			// nvp: [s,?]

			// do we have any indexes that cover all fields?
			// could do merging based on the results of more than one
			// index.

			// devising the search strategy becomes a bit more complex
			// when dealing with more than one index, being asked to
			// search by more than one field.

			// the indexing system does not hold all data anyway.
			// it won't be able to do all searches.

			// perhaps it should be queried to see what fields it does
			// index by before doing a search.
			// after doing a search with an index, may need to then
			// search through other fields without using the index.

			// searching by things in the order of the indexes
			// searching in other order, would be nice if it can consult
			// the right index.
			
			// var found = coll_presidents.find([['name', 'Franklin Pierce'], ['party', 'Republican']]);
			
			//console.log('Collection_Index_System find sig ' + sig);
			//console.log('a.l ' + a.l);

			if (sig == '[o]') {
				var objQuery = a[0];
				//console.log('objQuery ' + stringify(objQuery));

				//console.log('this.index_map ' + stringify(this.index_map));
				// so maybe if there is no index map we return false.
				//  not sure about indexed sub-items.

				//  may leave that for the moment.
				//   I'm sure it will be useful though.
				//    Perhaps they could be found through indexes in their own collections, so it's not down
				//     to the indexing system to find them apart from point them to the right item where it can.

				// Object query
				// ------------

				// Are we looking for a field that is indexed?
				//  Are we specifying multiple fields?

				// Dealing with searching for a single item with a query seems like a good case to handle.
				//  Other logic can deal with other cases.

				// indexes

				var indexes = this.indexes();

				// can't stringify the indexes.



				//console.log('t indexes ' + tof(indexes));
				//console.log('indexes.length ' + indexes.length);

				// then for each index, we see which fields it is...
				var map_single_field_indexes_by_field = {};
				each(indexes, function(i, v) {
					if (v.fields.length == 1) {
						//console.log('tof v.fields[0] ' + tof(v.fields[0]));

						var field = v.fields[0];
						var tField = tof(field);

						if (tField == 'string') {
							map_single_field_indexes_by_field[field] = v;
						}

						
					}
					//console.log('v.fields ' + stringify(v.fields));
				});

				// OK, so we see what it's indexed by.
				//  We also need to use the index to find the items by the object key.

				// {key: value}

				// Will need to look through the properties of the object given to this.
				var c = 0;
				var keys = [];

				each(objQuery, function(key, value) {
					//console.log('key ' + key);
					//console.log('value ' + value);
					c++;
					keys.push(key);
				});
				//console.log('c ' + c);

				if (keys.length == 1) {
					var index = map_single_field_indexes_by_field[keys[0]];

					if (index) {
						var res = index.get(objQuery[keys[0]]);
						//console.log('res ' + stringify(res));
						return res;
					} else {
						//throw 'no index found';

						return false;
					}

					
				}
				// we see which 


				// Want to search any indexes that match. May need to look through different sets if we are searching
				//  for more than one thing?




				throw 'stop';


				//console.log('Collection_Index_System search does not handle object query.');
				//  not yet? that will be a field name type thing, can look for fields on an attached
				//   object.
				//throw 'stop';
				return false;
			}



			if (sig == '[a]') {
				
				// .find('Donald Tsang < name < Jamie Oliver')
				// .find('Jamie Oliver > name > Donald Tsang') // in reverse order - it could notice that a > b and do the DESC query.
				
				//.find()
				
				// We could do a bit of interpretation on what is being looked for.
				//  There could be a search expression here.
				//  At the moment the search expression is just the field value, without the field name
				
				// '[indexed_field_value] = Jamie Oliver'
				// '= Jamie Oliver'
				// 'Jamie Oliver'
				
				// Index parsing for the queries should be useful.
				//  Also want things able to be done not in strings...
				//   Don't want to fall into the 'SQL Trap' of creating a string representation dynamically only to have to parse it again.
				
				// .find(['Donald Tsang', '<', 'name', '<', 'Jamie Oliver'])
				
				// the default will be <=
				// .find(['Donald Tsang', '<=', 'name', '<=', 'Jamie Oliver'])
				//                           ==
				// .find(['Donald Tsang', 'name', 'Jamie Oliver'])
				
				// .find({
				//    'name': ['Donald Tsang', 'Jamie Oliver'] // not saying inclusive or exclusive, could be inclusive by default
				//    'name': [['Donald Tsang', false], ['Jamie Oliver', false]] // exclusive
				//     exclusive(str) -> [str, false]
				//  Will need to do more specifying and testing for non-string values in indexes.
				//   Getting numerical indexes right with the comparison function would be nice.
				//    stores the number as a string... but stores it in numerical order.
				//     Would probably be best to parse it to a number for the comparison.
				//      Could try with numeric keys directly - they could work with comparisons.
				// })
				
				//  slightly odd syntax, but it makes sense.
				//   having the 'name' field in the middle... does make sense.
				//  expresses the operands - as if it has been parsed, the next stage.
				// searching for this one value.
				// not all indexes... need to have a default index.
				// primary index?
				//  may be spacifying the name of the field in many cases.
				//  this will be most useful when only one index is set up.
				//console.log('Index System find a[0] ' + stringify(a[0]));
				// primary index?
				//  may be the case when there is only one index.
				//  may specify primary indexes at other times.
				
				var indexes = [];
				
				this.iterate_indexes(function(finding_index) {
					//console.log('finding_index ' + finding_index);
					indexes.push(finding_index);
				});
				//throw('stop');
				//console.log('indexes.length ' + indexes.length);
				//console.log('this.index_map ' + stringify(this.index_map));
				
				// So, asking each index for the answer?
				
				//console.log('indexes.length ' + indexes.length);
				//console.log('a[0] ' + stringify(a[0]));
				
				var search_fields = [];
				var search_values = [];
				
				
				
				each(a[0], function(i, v) {
					//console.log('v ' + stringify(v));
					
				
					search_fields.push(v[0]);
					search_values.push(v[1]);
				});
				
				//console.log('search_fields ' + stringify(search_fields));
				
				/*
				
				if (indexes.length > 0) {
					
					// search for the right index.
					
					
					
					// consult the first index.
					
					var res = indexes[0].get(a[0]);
					
					//if (res.length == 1) {
					//	return res;
					//}
					//console.log('item ' + stringify(item));
					
					return res;
					
				}
				*/
				var equal_indices = [];
				//console.log('indexes ' + stringify(indexes));
				
				each(indexes, function(i, idx) {
					var idx_fields = idx.fields;
					//console.log('idx_fields ' + stringify(idx_fields));
					
					if (idx_fields.length >= search_fields.length) {
						// get the first part of the idx_fields
						
						// if it is an array...
						var idx_fields_to_check;
						if (tof(idx_fields) == 'array') {
							idx_fields_to_check = idx_fields.slice(0, search_fields.length);
						} else {
							idx_fields_to_check = [idx_fields];
						}
						
						
						
						
						//console.log('idx_fields_to_check ' + stringify(idx_fields_to_check));
						
						if (are_equal(idx_fields_to_check, search_fields)) {
							//console.log('they are equal');
							
							equal_indices.push(idx);
							
						}
						
					}
					
					//if (is_equal(idx_fields, search_fields))
					
					
				});
				
				//console.log('equal_indices.length ' + equal_indices.length);
				//return equal_indices[0];
				
				if (equal_indices.length > 0) {
					// use that index
					
					// will give that index two values to look for, in an array
					
					// will also do some testing with non-string values, and indexing them at some point.
					//  may do some lower level work in the B+ tree to get this right.
					
					var idx = equal_indices[0];
					//console.log('idx ' + stringify(idx));
					
					var res_indices_get = equal_indices[0].get(search_values);
					
					//console.log('res_indices_get ' + stringify(res_indices_get));
					
					return res_indices_get;
					
					
					
				}
				
				
			}
			
			/*
			if (sig == '[s]') {
				// it's searching for an index with a single field. Easy if there is just one of them found.
				
				// then split that string, it could be separated by commas.
				//  what about split with ', '?
				//  could have a new split function that maybe uses regexes to split like that?
				//  split, removing whitespace after commas.
				//  would go in util / essentials.
				
				var field_str = a[0];
				
				if (field_str.indexOf(',') > -1) {
					throw ('Multiple fields search through a string not yet implemented.');
				}
				var res = [];
				
				this.iterate_indexes(function(index) {
					if (index.fields.length == 1) {
						//res.push()
						if (index.fields[0] == field_str) {
							res.push(index);
						}
					}
				})
				if (res.length <= 1) return res[0];
				return res;
			}
			*/
			if (sig == '[o,s]') {
				// an object which represents the field.
				//  May need to read / understand that object.
				//   however, it could have been put into the index as a JSON field.
				//    so it will get recorded in the index under that string name.
				var fieldDef = a[0];
				//var strField = stringify(fieldDef);
				//console.log('strField ' + strField);

				// will search through and retrieve from the index (system)

				// can put in the object to the search.
				//  will it get stringified later?
				//   this needs to be used as a key for a string field though.
				var index = this.search_for_index_with_fields(fieldDef);
				//var index = this.search_for_index_with_fields(strField);
				//  may consult different indexes / look for them in a specific order when doing a lookup operation.
				//console.log('index ' + stringify(index));
				if (index) {
					//console.log('a[1] ' + stringify(a[1]));
					var res = index.get(a[1]);
				}
				//console.log('res ' + stringify(res));
				return res;
				//throw 'stop';


			}


			// That looks like multiple fields specified.
			if (a.l == 2 && tof(a[0]) == 'array') {
				//console.log('sig ' + sig);
				//console.log('4) a ' + stringify(a));
				//var index = this.search_for_index_with_fields(stringify(a[0]));
					
				// put them in an array to indicate they are one field?

				var index = this.search_for_index_with_fields([a[0]]);

				//  may consult different indexes / look for them in a specific order when doing a lookup operation.
				//console.log('index ' + stringify(index));
				if (index) {
					//console.log('a[1] ' + stringify(a[1]));
					var res = index.get(a[1]);
				}
				//console.log('res ' + stringify(res));
				return res;
			}

			if (a.l == 2 && tof(a[0]) == 'string') {
				// it's a single name-value pair.
				// is it?
				
				//console.log('sig ' + sig);
				//console.log('a ' + stringify(a));
				
				
				// search for the single index.
				// just use a dict index for the moment.
				// searching a dict is a 'get' operation.
				// maybe we need to search a full text index only?
				// the b+ index can do the prefix search, which is a
				// start.
				// more general searches, such as with a regex? becomes
				// more complex.

				
				//console.log('this.index_map ' + stringify(this.index_map));
				
				//var index = this.index_map[a[0]]['indexes_by_type']['dict'];
				
				// use a get_index function for this.
				var index = this.search_for_index_with_fields(a[0]);
				
				
				//  may consult different indexes / look for them in a specific order when doing a lookup operation.
				//console.log('index ' + index);
				//console.log('index ' + stringify(index));

				// then we search the index?
				// what API to lookup the value with the key?

				// return a search of the index.
				// a dict index... should maybe have 'get' rather than
				// search.
				//console.log('a[1] ' + a[1]);
				
				if (index) {
					var res = index.get(a[1]);
					//console.log('res ' + stringify(res));
					//console.log('a[1] ' + a[1]);
					//console.log('sig ' + sig);
				}
				
				//console.log('res ' + stringify(res));
				return res;
			}
		}),

		// This is going to be replaced with the system of constraints.
		//  There is the index
		//  Then there is the unique constraint
		//  Then it is the primary key, or similar to it, will be a field/column or a combination of them that gets used extensively in the
		//   database.
		
		// This will need to be tested fairly thoroughly, then it will be documented on the website.
		//  I think the website will have quite a lot of documentation, and I'll be able to modify it using a CMS.
		
		// Some documentation will be generated from the code.
		//  Will be able to edit API reference documents, they'll be viewable using a nice interface.
		// I think that could help take-up of this library quite considerably.
		//  That will be quite a big project.
		//  I think quite a lot of material about this, and JavaScript programming will go on my site.
		//  It would be good to have an active discussion forum as well.
		// The demos area, consultancy area, Web development work - getting back to people with a quote.
		//  It may be possible to put together good sites, quickly, for not all that much.
		// Could be recruiting contractors on that site. Would be a good interface with the programming community.
		//  Could possibly have a chat service, but answering people's questions quickly, or directing them to the forum, may be a useful thing to do.
		
		// I think this system would be a very solid technological basis for the site.
		//  Would be paticularly good for having other processes running that keep up-to-date backups.
		//  Also interested in connecting the web server with other MetaBench nodes that happen to be on and running.
		
		
		// There is no such thing as the primary unique index.
		//  There is the 'constraints' system.
		
		/*
		
		'primary_unique_index': fp(function(a, sig) {
			// just a string - the field name
			// dicts serve uniqueness checking well, though other data structures can do that too.
			
			//console.log('primary_unique_index sig ' + sig);
			
			if (sig == '[s]') {
				// ensuring there is that unique index, with that field
				// as the key.
				var field_name = a[0];
				// get the index for that field.
				// not sure it will already exist.

				// however, may want to first look to see if there are
				// any indexes for that field.
				// ensuring the dict index is the right way of doing
				// things for the moment.
				// will later do more development of the indexing system
				// so that other types of index can be used as a unique
				// index.
				// and so that the dict index can be used as a
				// non-unique index.
				//this._primary_unique_index = 
				this.ensure_index(field_name, 'dict');
			}
			if (sig = '[]') {
				//console.log('this._primary_unique_index ' + this._primary_unique_index);
				return this._primary_unique_index;
			}

		}),
		*/
		
		
		'get_index_starting': function(fields) {
			// will be starting with just one field?...
			//  get indexes starting...
			
			//console.log('get_index_starting ' + stringify(fields));
			
			if (tof(fields) == 'string') {
				fields = [fields];
			}
			//console.log('get_index_starting fields ' + stringify(fields));
			// go through all indexes, looking for the index which has got the right match.
			//  what about consulting an index of indexes?
			//  this could be done later, really won't be many indexes to search through.
			
			// look at the index map... get the fields as a string which will get used in the index lookup?
			//  want to be looking at all indexes at the moment.
			
			
			// want the stop function in iterate_indexes
			
			var matching_indexes = [];
			
			this.iterate_indexes(function(index, stop) {
				
				
				
				//console.log('iterate_indexes index ' + index);
				//console.log('iterate_indexes index.fields ' + stringify(index.fields));
				//console.log('fields ' + stringify(fields));
				// compare the two arrays
				
				var i_fields = index.fields;
				if (tof(i_fields) == 'string') i_fields = [i_fields];
				
				var ae = are_equal(fields, i_fields);
				
				if (ae) {
					matching_indexes.push(index);
				}
				
				//console.log('ae ' + ae);
				
				
				
				//throw ('iterate_indexes stop');
			});
			
			//console.log('matching_indexes.length ' + matching_indexes.length);
			
			if (matching_indexes.length > 1) {
				throw 'get_index_starting, more than 1 matching index found. Needs implementation';
				// May return the best match
				//  The best match could be found through an index.
				
				
			} else {
				return matching_indexes[0];
			}
			
			
		},
		
		
		'ensure_index': fp(function(a, sig) {
			// index may be given as the field(s)
			// single string field, or an array of fields.

			// index type as well...
			// we could have a default index type.

			// could try some benchmarks later on, judge difference
			// between b+ index and the dict index for retriveing
			// values.
			// dict will probably be much faster in JS because it uses
			// native code behind it, probably with a good string
			// hashing algorithm.

			// fields, index_type
			// field, index_type

			// and ensuring a unique index too?
			// perhaps the 'dict' index is unique.
			// could choose to operate the indexes on 'unique mode' or
			// not.

			// Want it easier to create a new index with the code.
			//  May have unsafe_add_index, or just be clearer about what code is used.
			
			// may ensure a single index.
			
			// may be given an array of strings.
			//   if so, it is a single index.
			
			
			//console.log('ensure_index sig ' + sig);
			
			if (a.l == 1 && is_arr_of_strs(a[0])) {
				// not specifying the type of index here.
				//  it is assumed to be the sorted (B+) index.
				
				
				// want to see if there is an existing index.
				
				/// hmmmm not sure... 
				
				var new_index_spec = a[0];
				//console.log('new_index_spec ' + stringify(new_index_spec));
				
				//throw('stop');
				// then create the actual (sorted) index.
				
				// will manually put this into the index map.
				//  may keep the index map, it's detailed, but also have a field_index_index where it points to the relevant index.
				//  may make other more direct objects in the index_system to refer to indexes.
				
				var sci = new Sorted_Collection_Index({
					'fields': new_index_spec
				});
				// then populate the index.
				
				// can add_object with an array to the index.
				sci.add_object(this.collection._arr);
				
				// then add the index into the index_system.
				
				// perhaps the map could be done in a heirachy like in nested?
				//  will have some code that is a bit complex and single-purpose here.
				//   it will be supporting the collection and index system.
				
				// May create light collection and data_object components. May have been better earlier, but then would have made things more complex too, this has been
				//  OK for developing.
				
				
				
				// not so sure about having the single field name?
				//  but they could be indexed here by their string fields key
				
				// this.index_map[field_name]['indexes_by_type'][index_type] = idx;
				
				//  could have the field names in sequence in the index - a little like the nested system.
				//  that would allow searching the index when looking sequentially for an index for fields.
				
				// though the sorted KVS with prefix search could actually help retrieve the index here.
				//  That would possibly be a useful data structure
				
				
				// The index map is already pretty unwieldy, perhaps it can be imprved.
				//  I think a specialized index index will be what is needed in a bit. At least there won't need to be so much specialized indexing code.
				//  Some kind of specialised code to power the indexing engine makes a lot of sense.
				
				// Will use the map and the fields_key for the moment.
				
				var fields_key = get_fields_key(new_index_spec);
				//console.log('2) fields_key ' + fields_key);
				
				this.index_map[fields_key] = this.index_map[fields_key] || {};
				this.index_map[fields_key]['indexes_by_type'] = this.index_map[fields_key]['indexes_by_type'] || {};
				this.index_map[fields_key]['indexes_by_type']['sorted'] = sci;
				
				return sci;
				
				//throw('4) stop');
				
			}
			
			// maybe change this interface.
			if (a.l == 2) {
				if (tof(a[1]) == 'string') {
					var index_type = a[1];
					if (tof(a[0]) == 'array') {
						var fields = a[0];
						
						return this.ensure_index[a[0]];
						
					}
					
					// what about when there are multiple fields to index.
					//  could try indexing president's party affiliations too.
					
					
					if (tof(a[0]) == 'string') {
						var field_name = a[0];

						// ensure a dict index...
						// think we will have to run through the types
						// sequentially here.

						// if (index_type == 'dict') {
						// see if there is a dict index already for that
						// field.

						// }

						// see if there is an existing index for that
						// field.

						var e_idx = this.get_index_by_type_by_fields([ field_name ], index_type);
						if (!is_defined(e_idx)) {
							// need to create the index.

							// should probably start it up with the
							// existing dataset.

							var idx = new Dict_Collection_Index({
								'fields' : [ field_name ]
							});
							// then want to load all the data in the
							// collection into the index.

							// Need to put the index in the index map.
							// Will do some ll_set or ll_ensure code to
							// make this shorter.
							this.index_map[field_name] = this.index_map[field_name] || {};
							this.index_map[field_name]['indexes_by_type'] = this.index_map[field_name]['indexes_by_type'] || {};
							this.index_map[field_name]['indexes_by_type'][index_type] = idx;
							
							// a dict of indexes, ordered by the field names of the index (comma separated), with an array of indexes that
							//  satisfy that combination of fields.
							// would be fast to search that array for particular fields - search all with that combination,
							//  then search for the fields in the particular order.
							
							// Sorted_KVS
							// .indexes_by_alphabetic_fields
							//  a prefix search on this could quickly get the required index
							// It would indeed be a fast way to get the index.
							//  Collection is getting quite big... it will be nice to get it back down to only a few KB.
							//  I wonder if the framework will wind up being quite hefty?
							//   Seems like a LOT of comments here. I think the collection itself, with the index system and data types etc, could be
							//   fairly small, a few K when wrapped up with other things.
							
							// I do want to provide an impressively small library, perhaps it will be around 30-40K?
							//  Once I have got a decent system, I can do refactoring and building.
							
							// I think an automated compilation / build process will be very useful.
							//  This one will put more things as local variables.
							//  Some object-oriented functions may be re-written as non-oo so that they work in the local scope, getting called from the local scope.
							//  Will also build up string names for strings that get used - can compress things a fair bit that way.
							//   With various compression means, it should be possible to get this down to a very small size.
							
							// The automatic linking (var removal) will prove useful when building this.
							//  Having this on the server, with an interface for producing builds will be useful.
							
							
							// a sorted KVS for storing the indexes by alphabetical fields...
							//  that would be nice for retrieving all of the indexes with a given alphabetical fields key.
							
							// Will take some more testing and checking to get the various things that are needed working.
							//  Am looking forward to creating the abstract rdb model, then translating that to an abstract Postgres model,
							//   then persisting that abstract Postgres model to a Postgres database.
							// All this middleware will make for some very convenient interfaces eventually.
							//  Having the data structure infrastructure to support them will help a lot.
							
							// as well as mapping it by type, and just one field name...
							//  need to have it indexing by the alphabetically sorted list of fields.
							// I think these things will take some more examples and testing, will test things with multiple indices as well.
							
							// Ordered indexes
							//  May be able to get them ordered by one of the sorted indexes.
							
							// Iterate through it, or get records, or get keys
							//  Will want to index the indexes with their fields stored alphabetically.
							//  this will matter when there are multiple fields in the indexes.
							
							
							
							
							

							// have made add_object into
							// unsafe_add_object that does not do
							// checking.
							// perhaps that unsafe method could be a
							// private function???

							// console.log('this.collection._arr ' )

							idx.add_object(this.collection._arr);

							// need to access the collection's array.
						}
					}
				}
			}
		}),



		// seems like the best way to index the indexes.
		// by field, then by index type.
		//  Would be good to have a clearer name / description of this function.

		'set_index_by_type_by_fields': function(index, arr_fields, index_type) {
			// In the Collection_Index_System

			//console.log('set_index_by_type_by_fields');
			// the fields for the index... possibly restricted to named fields, and do that check.
			//  make disabling some checks optional. Could also remove them at the build stage.
			
			// needs to go through the indexed fields
			// will create the dict maps saying which fields are getting
			// indexed.

			// Automatically indexing by automatically generated IDs?
			// That seems uncertain.

			// arr_fields ["attached", "meta", "name"] - that looks like one field.
			//  want a way of specifying a field is attached in some way.
			//  

			//console.log('index ' + stringify(index));
			//console.log('arr_fields ' + stringify(arr_fields));
			//console.log('index_type ' + stringify(index_type));

			
			// hmmm indexing by multiple fields.
			//  making a multi-level index map object.

			var c = 0, l = arr_fields.length;
			var i = this;
			//console.log('l ' + l);
			
			while (c < l) {
				var field = arr_fields[c];

				var tField = tof(field);
				//console.log('tField ' + tField);
				//throw 'stop';
				if (tField == 'string') {
					if (!i.index_map[field]) {
						i.index_map[field] = {};
					};
					i = i.index_map[field];
				} else {
					//console.log('tField ' + tField);
					// The field could be given as an array.

					// if it's an attached field...
					//  probably best to index it as an attached field.

					// object fields...
					//  need to be careful about adding these indexes for attached objects' fields.
					//  it needs to register so that when objects are added, the relevant indexes are
					//  notified, and know to check the attached object field.

					if (tField == 'object') {
						//console.log('is object');
						//console.log('field ' + stringify(field));

						// processing attached fields here?

						var fieldStr = stringify(field);
						if (!i.index_map[fieldStr]) {
							i.index_map[fieldStr] = {};
						};
						i = i.index_map[fieldStr];


						// Then would need something for when the object is added.

						//throw 'stop';

					}



					if (tField == 'array') {
						// record it in the index as a stringified array.
						//  that would be an attached field.
						//   attached(fieldName) would look neater, but not be JSON.

						var fieldStr = stringify(field);
						if (!i.index_map[fieldStr]) {
							i.index_map[fieldStr] = {};
						};
						i = i.index_map[fieldStr];




					}


					// Could set it by the name of the field even if it's attached?
					//  Or the attachment becomes part of the name?
					//  I think fields referring to attachments could make sense.
					//   Need to keep this consistant however.
					//console.log('field ' + stringify(field));

					// if the field is an array, such as ['attached', attachedObjName, attachedObjField]
					// an attached field.







					//throw '3) stop';
				}


				
				c++;
			}
			i['indexes_by_type'] = i['indexes_by_type'] || {};
			i['indexes_by_type'][index_type] = index;
		},
		
		// may just be called index() in the collection, but more in-depth name here.
		'set_index' : function(index) {
			this.set_index_by_type_by_fields(index, index.fields, index.index_type);
		},

		'get_index_by_type_by_fields': function(arr_fields, index_type) {
			// needs to go through the fields, moving through the
			// indexes.
			var c = 0, l = arr_fields.length;
			var i = this;
			while (c < l) {
				i = i.index_map[arr_fields[c]];

				c++;
			}
			// perhaps the index has not been defined.
			if (i) {
				var index = i['indexes_by_type'][index_type];
			}

			// could there be multiple indexes of the same index type?
			// possibly could make it hold indexes with different
			// engines / data structures... but I don't think that's
			// necessary.
			// but not sure the index exists...

			return index;

		},
		
		'indexes': fp(function(a, sig) {
			if (a.l == 0) {
				var res = [];
				this.iterate_indexes(function(index) {
					res.push(index);
				});
				return res;
			} else {
				throw 'Setting indexes not supported here (yet)';
			}
		}),

		// with 'stop' function in callback
		'iterate_indexes': function(index_callback) {

			//console.log('ii');
			
			// recursive function inside to do the iteration.
			//console.log('beginning index iteration. this.index_map: ' + stringify(this.index_map));
			// the index map needs to be updated when indexes are added.

			// will be used when adding an object to the indexes.
			// also when removing object from indexes.

			// stop in this code... a bit more complex.
			
			var iterate_level = function(level) {
				each(level, function(i, v, stop1) {
					//console.log('i ' + i);
					//console.log('v ' + stringify(v));

					// i is the field name.

					var ibt = v['indexes_by_type'];
					if (ibt) {
						each(ibt, function(i2, v2, stop2) {
							// is an index, I think.
							
							var full_stop = function() {
								stop2();
								stop1();
							}
							index_callback(v2, full_stop);
						});
					}

				})

				// each(level['indexes_by_type'], function(i, v) {
				// console.log('v ' + stringify(v));
				// each(v, function(index_type, index) {
				// index_callback(index);
				// })

				// });

			}
			//console.log('this.index_map ' + stringify(this.index_map));
			iterate_level(this.index_map);

		},

		// this will be checking it against constraints instead.
		/// depricated... will be removed.
		'_____can_add_object': function(obj) {
			// think we just check for single objects right now

			var tobj = tof(obj);
			//console.log('can_add_object tobj ' + tobj);

			if (tobj == 'data_object') {
				// go through the indexes to see if all the indexes can
				// add it.
				
				// does it match the acceptance criteria?
				/*
				if (this._accepts) {
					// check whether the obj matches this._accepts
					
					// ._accepts as constraints / a Data_Object as constraints?
					//  a Data_Object with its fields set as constraints?
					//  or would the fields be fine by themselves?
					
					// want a function to test a Data_Object against fields
					
					// the indexing system does not do the acceptance test for data validation, only checking it's not conflicting.
					
					console.log('this._accepts ' + this._accepts);
					
					
				}
				*/
				
				var can_add = true;

				this.iterate_indexes(function(index) {
					// a problem iterating the indexes.

					//console.log('*ii index ' + stringify(index));

					// when adding an object to an index, it could raise
					// an error.
					// may be best to check all indexes first to see if
					// the object will be addable.

					// index.add_object(obj);

					var index_can_add = index.can_add_object(obj);

					//console.log('index_can_add ' + index_can_add);

					if (!index_can_add) {
						can_add = false;
						// break from iteration, like is possible in
						// jQuery?
					}

				});

				return can_add;

			} else {
				return false;
				
			}

		},

		'add_object': function(obj) {
			//console.log('Index System add_object ' + stringify(obj));
			return this.unsafe_add_object(obj);
			/*
			
			if (this.can_add_object(obj)) {
				return this.unsafe_add_object(obj);
			} else {
				throw 'Can\'t add object. Check unique key collisions.';
			}
			*/
		},

		
		// The index no longer will have a problem with multiple items with the same key being added.
		//  It's the uniqueness constraints which may have something to say about it. They would consult the indexes.
		
		'unsafe_add_object': function(obj) {
			// NOT adds an index.
			// should add an object to all indexes.
			// a way to iterate through all indexes?
			// maybe they won't be stored in a normal array.
			//console.log('Collection_Index_System unsafe_add_object ' + stringify(obj));
			//console.log('obj.meta ' + jsgui.stringify(obj.meta));

			// The object may have attached objects.
			//  There could be attached metadata, but we want a general way for indexing (fields on)
			//   attached data.

			// It will still get put into the object index, but the index will have to be set up to
			//  deal with attached fields properly.

			// These are not subfields... there may not be any more than just metadata.
			//  meta seems most applicable to the Resource system, and get and set will be useful
			//  methods for interacting with the resource itself. The name could possibly be available
			//   through non-meta, but that could possibly have security / reliability issues.

			this.iterate_indexes(function(index) {
				// a problem iterating the indexes.
				// It seems like the indexes were not set up.
				//console.log('2) ii index ' + stringify(index));
				// when adding an object to an index, it could raise an
				// error.
				// may be best to check all indexes first to see if the
				// object will be addable.
				index.unsafe_add_object(obj);
			});

		},
		
		
		'remove': function(obj) {
			// was remove_object
			
			// need to locate the object.
			// it may be in all indexes.
			
			// tell all indexes to remove that object, if they have it.
			
			this.iterate_indexes(function(index) {
				index.remove(obj);
				
			});
			// remove it from the sorted_kvs.
		},
		// This is going to be changed to collection_constraints
		'accepts': fp(function(a, sig) {
			// may be expressed in terms of a Data_Object
			if (sig == '[D]') {
				// we set the acceptance criteria to the Data_Object. Every object that gets potentially added to this gets checked against
				//  the Data_Object's check acceptance criteria method (though this may call other, non-oo methods)
				this._accepts = a[0];
				// could check all existing items against acceptance criteria (first)?
				
			}
			// if it's an object, could save that object? test against that?
			
			if (sig == '[o]') {
				throw 'Map object as acceptance criteria not yet supported in Collection';
				
			}
		})
		
		/*
		'clear' : function() {

		}
		*/
		
		// a function to get the appropriate index for the given fields.
		//  check if it has such an index?

	// ensure index by type and rows.

	});

	var Collection_Index = {
		'System': Collection_Index_System,
		'Sorted': Sorted_Collection_Index
	}


	var dop = Data_Object.prototype;
	
	// wrap the old set_field function
	var old_set_field = dop.set_field;
	
	var new_set_field = fp(function(a, sig) {
		// some polymorphic cases which are not checked by the old one.
		if (sig == '[s,[f]]') {
			// It's a constraint / field that is a collection.
			//  The collection actually gets created, _.field_name set to be that collection.
			
			//console.log('new_set_field sig ' + sig);
			
			// then create the data type constraint...
			//  the data type for that field is a collection, and that collection has a given type that it accepts.
			var field_name = a[0];
			//console.log('field_name ' + field_name);
			var dt_constructor = a[1][0];
			
			//console.log('dt_constructor ' + dt_constructor);
			
			var coll = new Collection(dt_constructor);
			coll._data_type_constraint = new Constraint.Collection_Data_Type(dt_constructor);
			this.set(field_name, coll);
			
			//throw '12) new_set_field stop';
		} else {
			old_set_field.apply(this, a);
		}
	});
	
	dop.set_field = new_set_field;
	
    /**
    * @param obj
    * @param query
    */
	var obj_matches_query_obj = function(obj, query) {
		//console.log('obj_matches_query_obj');
		//console.log('obj ' + stringify(obj));
		//console.log('query ' + stringify(query));

		var matches = true;
		each(query, function(fieldName, fieldDef) {
			var tfd = tof(fieldDef);
			//console.log('fieldName ' + fieldName);
			//console.log('tfd ' + tfd);

			if (tfd == 'string' || tfd == 'boolean' || tfd == 'number') {
				matches = matches && obj[fieldName] === fieldDef;
				//if (!matches) stop();
			} else {
				throw 'need more work on more complex queries for collection find, iterative search'
			}
		})
		return matches;
	}


	// In the definition of a control's extension, we may include a 'data_type'.
	//  That will translate to a _data_type_constraint being applied to all collections
	//   of that defined type.
	//  constraint(D);

	// May need to make a new extend function to handle 'data_type' being specified at the top
	//  level of the definition, similar to 'fields'.

	// May add some parameters into extend, so that this will accept a function that processes
	//  this value upon initialization.

	// 28-Dec-2013
	//  This lacks insert_at. That seems like an important part of a collection.
	//  Maybe not important with various indexing systems, but important for basic usage.
	//   Like inserting a control into another control's contents as the first.


    /*
     * @constructor
     */

   /** 
    * A module representing a collection.
    * @exports core/collection
    */
	var Collection = Data_Object.extend({
		
		'init': function(spec, arr_values) {
			//console.log('Collection init');
			//console.log('spec ' + stringify(spec))

			// Probably should act differently for an abstract collection.
			this.__type = 'collection';
			if (spec.abstract === true) {
				//console.log('init abstract collection');

				// An abstract collection does no have an index system - though maybe has got abstract indexes?
				// We may initialise it using a constructor for another function.
				//  eg Collection(Table)

				// In this case hold the item type.
				//  It is a constraint.
				//  Any objects in the collection must be an instanceOf the type given.


				// Just meaning it is a collection of a certain type.
				//  Fields will get declared in the abstract, eg when defining a Database class, it has tables as a field.

				// Will do this as the collection having a data type constraint.

				var tspec = tof(spec);
				if (tspec === 'function') {
					this.constraint(spec);
				}



				// Abstract collection of type.

				// Will not have an actual index system in abstract mode.

			} else {
				this._relationships = this._relationships || {};
				this._arr_idx = 0;
				this._arr = [];

				// Maybe some collections don't need indexing?
				this.index_system = new Collection_Index_System({
					// The collection index system could have different default ways of indexing items.
					//  Each item that gets indexed could get indexed in a different way.
					'collection' : this
				});
				
				var spec = spec || {};
				
				if (tof(spec) == 'array') {
					spec = {
						'load_array': spec
					};
				} else {
					if (tof(spec) == 'function') {
						if (spec.abstract === true) {
							//throw 'Collection with abstract spec function';
							
							this._abstract = true;
						} else {
							
							if (is_constructor_fn(spec)) {
								
								var chained_fields = Data_Object.get_chained_fields(spec);
								
								var chained_fields_list = Data_Object.chained_fields_to_fields_list(chained_fields);
								
								//console.log('***** chained_fields_list ' + stringify(chained_fields_list));
								
								var index_field_names = [], field_name, field_text;
								each(chained_fields_list, function(i, v) {
									field_name = v[0];
									field_text = v[1];
									
									var isIndexed = field_text.indexOf('indexed') > -1;
									var isUnique = field_text.indexOf('unique') > -1

									if (isIndexed || isUnique) {
										index_field_names.push([field_name]);
									}
								});
								
								// So, that does it :)
								var old_spec = spec;
								spec = {
									'constraint': spec
								};
								
								if (old_spec == String) {
									spec.index_by = 'value';
								}
								
								if (index_field_names.length > 0) {
									spec.index_by = index_field_names;
								}
								
							}
							
						}
						
					} else if (tof(spec) == 'string') {
						// May be like with the constraint above.
						// still need to set up the constructor function.
						
						var map_native_constructors = {
							'array': Array,
							'boolean': Boolean,
							'number': Number,
							'string': String,
							'object': Object
						}
						
						var nc = map_native_constructors[spec];
						
						if (nc) {
							spec = {
								'constraint': nc
							};
							if (nc == String) {
								spec.index_by = 'value';
							}
						}
					}
				}
				
				if (is_defined(spec.items)) {
					spec.load_array = spec.load_array || spec.items;
				}
				if (arr_values) {
					console.log('load arr_values ------------');
					spec.load_array = arr_values;
				}
				
				// keeping these things below the expected public interface.
				if (is_defined(spec.accepts)) {
					this._accepts = spec.accepts;
				}
				
				
				if (jsgui.__data_id_method == 'init') {
					// but maybe there will always be a context. May save download size on client too.
					if (this._context) {
						this.__id = this._context.new_id(this.__type_name || this.__type);
						this._context.map_objects[this.__id] = this;
					} else {
					    // don't think we want a whole bunch of objects mapped like this....
					    //  IDs will be very useful when they are controls... but maybe not always needed.
					    
						//this.__id = new_collection_id();
						//map_jsgui_ids[this.__id] = this;
					}
					
				}
				
				if (!this.__type) {
					
					
				}
			}
 
				
			this._super(spec);
		},
		
		// maybe use fp, and otherwise apply with the same params and context.

       /** 
        * @func
        * @param value
        */
		'set': function(value) {
		    // get the tof(value)
		    var tval = tof(value);
		    
		    //console.log('tval ' + tval);
		    //throw('stop');
		    var that = this;
		    if (tval == 'data_object') {
		        this.clear();
		        return this.push(value);
		    } else if (tval == 'array') {
		    	// for an array... clear, then add each.

		    	this.clear();
		    	// Not sure about making a new collection here... but maybe we could get it defined as a normal point.

		    	// But we could make a DataValue for the points.
		    	//  Could specify that points are stored as Data_Values.
		    	//   Maybe fixed length of 2.

		    	each(value, function(i, v) {
		    		that.push(v);
		    	});
		        
		    } else {
		    	if (tval == 'collection') {
		    		// need to reindex - though could have optimization that checks to see if the indexes are the same...
		    		throw 'stop';
		    		this.clear();
		    		value.each(function(i, v) {
		    			that.push(v);
		    		})

		    	} else {
		    		return this._super(value);
		    	}

		    	
		    }
		    
		},
		
       /**
        * @func
        */
		'clear': function() {
			this._arr_idx = 0;
			this._arr = [];

			this.index_system = new Collection_Index_System({
				// The collection index system could have different default ways of indexing items.
				//  Each item that gets indexed could get indexed in a different way.
				'collection' : this
			});

			this.trigger('change', {
				'type': 'clear'
			})
		},
		
       /** 
        * @func
        */
		'stringify': function() {
			var res = [];
			if (this._abstract) {
				// then we can hopefully get the datatype name
				
				// if it's abstract we detect it, otherwise it should be in there.
				var ncto = native_constructor_tof(this._type_constructor);
				
				res.push('~Collection(')
				if (ncto) {
					res.push(ncto);
				} else {
				
				}
				res.push(')');
				
			} else {
				res.push('Collection(');
				//console.log('obj._arr ' + stringify(obj._arr));
				
				var first = true;
				this.each(function(i, v) {
					if (!first) {
						res.push(', ');
					} else {
						first = false;
					}
					res.push(stringify(v));
					
				})
				
				res.push(')');
			}
			return res.join('');
		},		

       /** 
        * @func
        */
		'toString': function() {
			return stringify(this._arr);
			
		},

       /** 
        * @func
        */
		'toObject': function() {
			var res = [];
			this.each(function(i, v) {
				res.push(v.toObject());
			});
			return res;
		},
		
       /** 
        * @func
        * @param ...
        */
		'each' : fp(function(a, sig) {
			// was callback, context
			// ever given the context?
			
			if (sig == '[f]') {
				return each(this._arr, a[0]);
			} else {
				
				if (sig == '[X,f]') {
					// X for index
					
					// we use the order of the index.
					//  possibly we can iterate using the index itself, maybe with that same callback.
					
					var index = a[0];
					var callback = a[1];
					return index.each(callback);
					
				} else {
					if (a.l == 2) {
						return each(this._arr, a[0], a[1]);
					}
				}
			}
		}),

		'eac' : fp(function(a, sig) {
			// was callback, context
			// ever given the context?
			
			if (sig == '[f]') {
				return eac(this._arr, a[0]);
			} else {
				
				if (sig == '[X,f]') {
					// X for index
					
					// we use the order of the index.
					//  possibly we can iterate using the index itself, maybe with that same callback.
					
					var index = a[0];
					var callback = a[1];
					return index.eac(callback);
					
				} else {
					if (a.l == 2) {
						return eac(this._arr, a[0], a[1]);
					}
				}
			}
		}),


       /** 
        * @func
        */
		'_id' : function() {
			// gets the id.
			
			
			if (this._context) {
				this.__id = this._context.new_id(this.__type_name || this.__type);
			} else {
				if (!is_defined(this.__id)) {
					
					// get a temporary id from somewhere?
					//  but the collection should really have a context...
					//  or without a context, the collection is its own context?

					// Won't go setting the ID for the moment.

					//this.__id = new_collection_id();
				}
			}
			return this.__id;

		},


       /** 
        * @func
        */
		'length': function() {
			return this._arr.length;
		},
		
		
       /** 
        * @func
        * @param ...
        */
		'find': fp(function(a, sig) {


			// var found = coll_presidents.find([['name', 'Franklin Pierce'], ['party', 'Republican']]);
			
			// it can be an array of fields.
			//console.log('collection find ' + sig);
			//console.log('a ' + stringify(a));
			if (a.l == 1) {
				
				// Make it so that index_system handles object queries...
				//  field: value

				var index_system_find_res = this.index_system.find(a[0]);
				//console.log('index_system_find_res ' + index_system_find_res);

				// How to know if these have been indexed or not.
				//  Perhaps the index system will only do certain queries.
				//  index_system.can_find would help.
				if (index_system_find_res === false) {
					// let's do the search ourself.
					// need to go through every object to see if it matches the search query.
					// Though the results may be better returned as a collection.
					var foundItems = [];
					each(this, function(index, item) {
						//console.log('index ' + index);
						//console.log('item ' + stringify(item));


						// check each data item for the match.
						throw 'stop';
					})
				} else {
					return index_system_find_res;
				}
				// if there is only one index in the system then the search will be simple.
			}

			// [o,s]
			//  finding a string value that's been specified using an object.
			//   It may indicate an attached field.
			//   We'll still be asking the index_system to find it.
			//   Need to be sure that [o,s] fields get indexed properly, and other indexes who's fields
			//    are specified by an object.
			//   {fieldName: {}} equivalent to 'fieldName'
			//    this will allow extended information to be added.
			//   We will be aware of what we are indexing, such as attached field names.
			//    Code when the index gets created
			//    Code when an item gets added to that index.
			//     Will need to check attached objects.

			if (sig == '[o,s]') {
				return this.index_system.find(a[0], a[1]);
			}

			//   




			// and if looking for more than one thing...
			if (sig == '[s,s]') {
				return this.index_system.find(a[0], a[1]);
			}
			if (sig == '[a,s]') {
				return this.index_system.find(a[0], a[1]);
			}
			if (sig == '[s,o]') {
				var propertyName = a[0];
				var query = a[1];
				//console.log('propertyName ' + propertyName);
				//console.log('query ' + stringify(query));
				// Maybe return a Collection, not an array.
				// don't consult the index system.
				var foundItems = [];
				// for each object we need to go deeper into the fields.
				each(this, function(index, item) {
					//console.log('index ' + index);
					//console.log('item ' + stringify(item));

					//var matches = item.match(query);

					var itemProperty = item.get(propertyName);
					//console.log('itemProperty ' + stringify(itemProperty));

					//console.log('tof(itemProperty) ' + tof(itemProperty));
					var tip = tof(itemProperty);

					if (tip == 'array') {
						// possibly should be a collection
						each(itemProperty, function(i, v) {
							//console.log('v ' + stringify(v));
							var matches = obj_matches_query_obj(v, query);
							//console.log('matches ' + matches);

							if (matches) {
								foundItems.push(v);
							}
						})
					}
					// check each data item for the match.
					//throw '!stop';
				})
				return new Collection(foundItems);
			}
		}),
		// get seems like the way to get unique values.
		

       /** 
        * @func
        * @param ...
        */
		'get' : fp(function(a, sig, _super) {
			// integer... return the item from the collection.
			//console.log('collection get sig ' + sig);
			if (sig == '[n]' || sig == '[i]') {
				return this._arr[a[0]];
			}
			
			// getting by it's unique index?
			//  this may again refer to getting a property.
			
			if (sig == '[s]') {
				return Data_Object.prototype.get.apply(this, a);
				
			}
			// may take multiple params, specifying the fields in the
			// unique index.

		}),


		// insert_before could be useful.
		//  In some HTML controls want to insert one control before another one.


		// Will a control always know what position it's in?

       /** 
        * @func
        * @param ...
        */
		'insert': function(item, pos) {
			// use array splice...
			//  then modify the index somehow.
			//  perhaps add 1 to each item's position past that point.
			//  may mean n operations on the index.
			//   some kind of offset tree could be useful for fast changes and keeping accurate lookups.

			this._arr.splice(pos, 0, item);

			// index system notify_insertion
			//  so the index system can make the adjustments to the other items.


			// then call the change event.
			//  and have event details saying an item i has been inserted at position p.
			//   for controls, that should be enough to render that control and put it onto the screen
			//   if the context is active.

			this.index_system.notify_insertion(pos);


			this.trigger('change', {
				'name': 'insert',
				'item': item,
				'pos': pos
			});




		},
		
		// may have efficiencies for adding and removing multiple items at once.
		//  can be sorted for insertion into index with more rapid algorithmic time.
		
       /** 
        * @func
        * @param ...
        */
		'remove': fp(function(a, sig) {
			var that = this;
			
			//console.log('sig ' + sig);
			//throw 'stop';
			
			if (sig == '[n]') {
				
				var own_id = this._id();
				
				// remove the item at that position.
				
				var pos = a[0];
				var item = this._arr[pos];
				
				var o_item = item;
				//console.log('*');
				//console.log('item ' + stringify(item));
				
				var spliced_pos = pos;
				this._arr.splice(pos, 1);
				this._arr_idx--;
				var length = this._arr.length;
				while (pos < length) {
					
					// reassign the stored position of the item
					
					var item = this._arr[pos];
					
					item.relationships[own_id] = [that, pos];
					//console.log('');
					//console.log('item._parents[own_id] ' + stringify(item._parents[own_id]));
					pos++;
				}
				
				// need to remove that item from the index system as well.
				
				this.index_system.remove(o_item);
				// but is it no longer actually there?
				//  seems to be gone now.
				
				var e = {
					'target': this,
					'item': item,
					'position': spliced_pos
				}
				
				this.raise_event(that, 'remove', e);
			}
			
			// and if we are removing by a string key...
			
			if (sig == '[s]') {
				var key = a[0];
				
				// get the object...
				
				var obj = this.index_system.find([['value', key]]);
				
				//console.log('obj ' + stringify(obj));
				//console.log('tof(obj) ' + tof(obj));
				//throw 'stop'
				
				// and get the position within the parent.
				
				var my_id = this.__id;
				//console.log('my_id ' + my_id);
				//throw 'stop';
				
				var item_pos_within_this = obj[0]._relationships[my_id];
				//console.log('item_pos_within_this ' + item_pos_within_this);
				//throw 'stop';
								
				this.index_system.remove(key);
				this._arr.splice(item_pos_within_this, 1);
				
				// then adjust the positions downwards for each item afterwards.
				
				
				
				for (var c = item_pos_within_this, l = this._arr.length; c < l; c++) {
					//console.log('c ' + c);
					var item = this._arr[c];
					item._relationships[my_id]--;
				}
				
				var e = {
					'target': this,
					'item': obj[0],
					'position': item_pos_within_this
				}
				
				this.raise_event(that, 'remove', e);
				
			}
			
		}),
		
       /** 
        * @func
        * @param obj_key
        */
		'has': function(obj_key) {
			// will operate differently depending on how the collection is being used.
			//console.log('this._data_type_constraint ' + stringify(this._data_type_constraint));
			if (this._data_type_constraint) {
				//console.log('this._data_type_constraint.data_type_constructor ' + stringify(this._data_type_constraint.data_type_constructor));
				if (this._data_type_constraint.data_type_constructor) {
					if(this._data_type_constraint.data_type_constructor === String) {
						// collection of strings - does it have that string?
						//console.log('this.index_system ' + stringify(this.index_system));
						var found = this.index_system.find('value', obj_key);
						//console.log('found ' + stringify(found));
						//throw 'stop';
						//return !!found;
						return found.length > 0;
					}
				}
			}
		},
		
		// Set still operates as it does from the Data_Object.
		
		// Unique index being replaced with a constraint, and it also makes the index when the constraint is put in place if the index is not already there.
		

       /** 
        * @func
        * @param ...
        */
		'get_index': fp(function(a, sig) {
			if (sig == '[s]') {
				return this.index_system.search(a[0]);
			}
			
		}),
		
		// has_index may be useful... perhaps this should be changed to index_by?
		//  other people may think this means it has an index (int) and returns that.
		
		// just need to be very clear about what this function does, could have an index_by function too.
		
		// 
		
		// renamed index(), was index_by()
		
		// 'index' is actually going to be setting up constraints.
		//  // dealing with a layer of constraints may make sense, but it should probably be exposing the indexes.
		
		// Don't want to change the syntax, and make developers have to type 'Constraint' all the time, but I think that Constraints is the right
		//  way of expressing the underlying system, partly to aid transitions to databases, and its proven to be a flexible (inflexible) model.
		
       /** 
        * @func
        * @param field
        */
		'find_unique_constraint': function(field) {
			// can be one field, or an array.
			
			// Perhaps the order of the fields here should be rearranged to alphabetical?
			//  In a constraint, the order of the fields should not matter - except it would set up an index using the order of the fields specified.
			//  the constraint could have the fields rearranged in alphabetical order.
			
			// There will be a bit of code bloat in some lower level components because they are not using Data_Object and Constraint classes themselves.
			//  Finding the right constraint out of the existing constraints is necessary when potentially adding a new constraint.
			//  Constraints having an alphabetically sorted list of fields?
			//  It is as though we can't use unique constraint code for this where otherwise it could have been used.
			
			// fields in alphabetical order...
			
			// want to be able to break out of each loops as well.
			//  posibly (i, v, break) and call the break function?
			
			var item = null;
			
			if (tof(field) == 'array') {
				
			} else if (tof(field) == 'string'){
				// it's just one string.
				each(this._unique_constraints, function(i, v, stop) {
					// does it match the field?
					if (v.fields === field) {
						item = v;
						stop();
					}
				})
			}
			//console.log('item ' + item);
			return item;
		},
		
		// The constraints will also be available, but they will likely make for a less user-friendly interface than fields.
		
		
       /** 
        * @func
        * @param ...
        */
		'fields': fp(function(a, sig) {
			
			//console.log('Collection fields sig ' + sig);
			//console.log('Collection fields a ' + stringify(a));
			var that = this;
			// this will refer to the fields of the data_object_constraint.

			if (sig == '[o]') {
				// use a field definition constraint
				//  (a different way of doing the constraint, using json-like object, not using a Data_Object constructor.

				each(a[0], function(i, v) {
					that.set_field(i, v);
				});

				// set the constraints

				that.constraint(a[0]);

			} else {
				if (!this._data_object_constraint) {
					this._data_object_constraint = Constraint.from_obj(new Data_Object());
				}
				var doc = this._data_object_constraint;
				
				if (a.l == 0) {
					return doc.data_object.fc.get();
				}
				// if given an array, set the fields.
				
				//console.log('a.l ' + a.l);
				
				if (a.l == 1 && tof(a[0] == 'array')) {
					//console.log('array 1');
					return doc.data_object.fc.set(a[0]);
				}
			}

			
		}),
		
		// Getting quite in depth with generality and polymorphism here.
		//
		//  Perhaps there should be a _fields object.
		//  So far we have used constraints - there will be field constraints when fields are specified.
		//   Maybe it makes sense... a 'field' may correspond with indexes as well.
		
		// May be the fields from the prototype, as well as fields that have been added.
		
       /** 
        * @func
        * @param ...
        */
		'set_field': fp(function(a, sig) {
			//console.log('set_field');
			// sets a field?
			//  maybe 'set' is a better word because it would overwrite existing fields.
			
			// will be able to add an individual field
			//  name and field type as string...
			var that = this;
			// we may have a data_def_constraint?
			//var that = this;

			// Fields get created using constraints.

			var doc = that._data_object_constraint = that._data_object_constraint || Constraint.from_obj(new Data_Object());
			//var doc = that._data_object_constraint || 
			//console.log('doc ' + stringify(doc));


			
			//console.log('set_field sig ' + sig);
			//console.log('set_field a ' + stringify(a));
		
			if(a.l == 2 && tof(a[0]) == 'string') {
				doc.data_object.fc = doc.data_object.fc || new Data_Object_Field_Collection();

				// May need to set up indexing on the fields as well.
				

				return doc.data_object.fc.set(a[0], a[1]);
			}
		}),
		

       /** 
        * @func
        * @param ...
        */
		'remove_field': fp(function(a, sig) {
			var doc = this._data_object_constraint;
			
			if (doc) {
				if (sig == '[s]') {
					return doc.data_object.fc.out(a[0]);
				}
			}
			
			
		}),
		// A constraint may reference an index.
		// It may need to create the index if it does not already exist.
		
		// Give a data type to give a type constraint.
		
       /** 
        * @func
        */
		'get_data_type_constraint': function() {
			// there may just be one ._data_type_constraint.
			//  not having all the constraints listed together.
			
			return this._data_type_constraint;
			
			
		},
		
       /** 
        * @func
        * @param ...
        */
		'constraint': fp(function(a, sig) {
			if (sig == '[]') {
				// Get all of the constraints.

				// if no constraints, return null.
				var res = null;

				if (this._data_type_constraint) {
					res = {
						'data_type': this._data_type_constraint
					}
				}
				if (this._data_object_constraint) {
					res = res || {};
					res.data_object = this._data_object_constraint;
				}
				if (this._data_def_constraint) {
					res = res || {};
					res.data_def = this._data_def_constraint;
				}
				return res;
			}

			if (sig == '[o]') {
				this._data_def_constraint = new Constraint.Collection_Data_Def(a[0]);
			}
			
			if (sig == '[f]') {
				if (a[0] === Number) {
					//var cdtc = new Constraint.Collection_Data_Type(a[0]);
					this._data_type_constraint = new Constraint.Collection_Data_Type(a[0]);
					return this._data_type_constraint;
				}
				if (a[0] === String) {
					//var cdtc = new Constraint.Collection_Data_Type(String);
					this._data_type_constraint = new Constraint.Collection_Data_Type(a[0]);
					//console.log('this._data_type_constraint ' + this._data_type_constraint);
					return this._data_type_constraint;
				} else if (is_constructor_fn(a[0])) {
					
					//console.log('is_constructor_fn ');
					var data_type_constructor = a[0];
					// set up the data type constraint.
					//  can have a Type_Constraint on a collection... each object in the collection must satisfy that type.
					//   different to having it satisfy a particular data_object's constraints.
					var dtc = this._data_type_constraint;
					if (dtc) {
						var cdtc = this._data_type_constraint.data_type_constructor;
						if (cdtc && cdtc === data_type_constructor) {
							//console.log('returning dtc');
							return dtc;
						}
					}
					this._data_type_constraint = new Constraint.Collection_Data_Type(data_type_constructor);
					//console.log('this._data_type_constraint ' + this._data_type_constraint);
					return this._data_type_constraint;
					// have a look at the existing data_type_constraint
					
				}
			}
			// ['unique', 'isbn-13']
			// ['unique', ['school_id', 'school_assigned_student_id']]
			
			// will need to ensure there is an index for that set of fields.
			
			// is it an array?
			//  could be an array of different constraints
			
			if (sig == '[D]') {
				var constraint = constraint_from_obj(a[0]);
				this._data_object_constraint = constraint;
			}
			if (sig == '[[s,s]]') {
				// A single constraint, with one string parameter (probably its field)
				
				var constraint_def = a[0];
				var constraint = constraint_from_obj(constraint_def);
				
				var c_type = constraint._constraint_type;
				//console.log('c_type ' + c_type);
				
				if (c_type == 'unique') {
					// ensure it has that unique constraint.
					//  this will mean going through all unique constraints, or checking its own index of them
					//  may have a bit of optimization here, but not using collections to implement this.
					//  collections will be used in many other things though. Will be useful for representing data models as well.
					
					// unique constraints,
					// NOT NULL,
					// Relationship
					// Check
					
					// The relationship constraints, when set up, will assist in creating the data models that accuratly model those relationships.
					// check if it already has that unique constraint.
					this._unique_constraints = this._unique_constraints || [];
					// get the index...
					// index_system.find_indexes_with_fields
					// get_unique_constraint?
					// find_unique_constraint(fields)
					//  that will be a function that does the specific search for an existing unique constraint with those fields.
					//  returns false if not found.
					// will use find_unique_constraint to see if there are already matching unique constraints.
					var field_name = constraint_def[1];
					//console.log('field_name ' + field_name);
					var existing_unique_constraint = this.find_unique_constraint(field_name);
					//console.log('existing_unique_constraint ' + existing_unique_constraint);
					
					if (existing_unique_constraint) {
						return existing_unique_constraint;
					} else {
						
						// look to see if there is an index that supports the constraint.
						//  does not have to be a sorted index, necessarily.
						
						// let's get an index, with those fields.
						
						// it may be worth having the fields of various indexes sorted by name automatically.
						//  would be useful for quick algorithmic comparison of which fields they are indexing.
						
						// The optimal one would be the index in the same order, but failing that, an index with the fields in a different order can be used.
						//  The order on the constraints does not matter so much, but it is nice to preserve whichever order the user specified initially.
						// This will take more time and effort... but not a massive amount before the system is ready to be used.
						
						// I think I should get my site running so it can host discussion about the system.
						//  Having documentation on my site would be very good. It would be nice to measure the traffic and interest.
						
						// There will be some features about doing some specific things.
					}
				}
			}
		}),
		
		// also could be expressed as a constraint and then the index is automatically put in place.
		// However, when an index is set, it's not setting a unique constraint automatically.
		
		// basically ensure_index for the moment.
		//  however, will also return the index, and with no params will get all indexes.
		//  will have nice syntax with ensuring multiple indexes at once.
		
		// Should possibly present nicer syntax to MongoDB with a wrapper.
		//  May have some different data wiring / connection options.
		// Likely to be best to do a lot in the abstract so changes can be viewed before being made.
		
       /** 
        * @func
        * @param fields
        */
		'get_unique_constraint': function(fields) {
			if (tof(fields) == 'string') fields = [fields];
			each(this._unique_constraints, function(i, unique_constraint) {
				var uc_fields = unique_constraint.fields;
				//console.log('uc_fields ' + stringify(uc_fields));
				
				if (are_equal(uc_fields, fields)) return unique_constraint;
			});
		},
		
       /** 
        * @func
        * @param ...
        */
		'unique': fp(function(a, sig) {
			var that = this;
			//console.log('a[0] ' + stringify(a[0]));
			
			if (sig == '[s]') {
				return this.unique([a[0]]);
			}
			if (tof(a[0]) == 'array') {
				if (is_arr_of_arrs(a[0])) {
					//console.log('is_arr_of_arrs');
				}
				if (is_arr_of_strs(a[0])) {
					var existing_uc = this.get_unique_constraint(a[0]);
					if (existing_uc) return existing_uc;
					var new_uc = new Constraint.Unique({
						'fields': a[0]
					});
					this._unique_constraints = this._unique_constraints || [];
					this._unique_constraints.push(new_uc);
					var idx = this.index(a[0]);
					//console.log('');
					//console.log('idx ' + stringify(idx));
				}
			}
		}),
		
		// indexes
		//  will get all the indexes... may set a particular index? Or replace the indexes?
		
       /** 
        * @func
        * @param ...
        */
		'indexes': fp(function(a, sig) {
			if (a.l == 0) {
				// get all indexes.
				// will look at the index system, and get the indexes from that.
				var index_system = this.index_system;
				//console.log('index_system ' + index_system);
				var indexes = index_system.indexes();
				return indexes;
			}
		}),
		// index_by - it sounds nice, reads well in code / samples.
		//  may just use the index() method, but that could call index_by to make things a bit clearer.
		

       /** 
        * @func
        * @param ...
        */
		'index_by': fp(function(a, sig) {
			var that = this;
			//console.log('index_by a ' + stringify(a));
			//console.log('a.l ' + a.l);
			//console.log('sig ' + sig);
			//throw('stop');
			//console.log('tof(a[0]) ' + tof(a[0]));
			//if (a.l == 1 && tof(a[0]) == 'array') {
			if (sig == '[a]') {
				//console.log('a[0] ' + stringify(a[0]));

				if (is_arr_of_strs(a[0])) {
					// then it's a single index.
					//console.log('is_arr_of_strs ' + stringify(a[0]));
					var relevant_index = this.index_system.get_index_starting(a[0]);
					//console.log('relevant_index ' + relevant_index);
					if (relevant_index) {
						return relevant_index;
						
					} else {
						var index_spec = a[0];
						var new_index = this.index_system.ensure_index(index_spec);
						return new_index;
					}
				}
				// If it's an array of arrays... it's an array of indexes.
				if (is_arr_of_arrs(a[0])) {
					// deal with each of them in turn.
					//console.log('it is_arr_of_arrs');
					each(a[0], function(i, specified_index) {
						that.index(specified_index);
					});
				}
			}
			
			// otherwise, we'll be taking a map of what to index and what type of index to use there.
			var that = this;
			// get the index, based on that name?
			if (sig == '[s]') {
				return that.index({
					'sorted': [[a[0]]]
				});
			}

			if (sig == '[o]') {
				//console.log('object sig');
				
				var index_map = a[0];
				//console.log('index_map ' + stringify(index_map));
				
				each(index_map, function(index_type, index_definition) {
					//console.log('index_type ' + index_type);
					if (index_type == 'sorted') {
						// set up the individual index of the specified type.
						
						//if (index_type == 'sorted') {
						//console.log('index_definition ' + stringify(index_definition));
						if (tof(index_definition) == 'array') {
							// is it an array of strings? then it is the fields?
							// is it an array of arrays?
							if (is_arr_of_arrs(index_definition)) {
								// each index, each field in the index
								var indexes = [];
								
								each(index_definition, function(i, individual_index_fields) {
									// then will have a bunch of fields
									//console.log('individual_index_fields ' + stringify(individual_index_fields));

									// Setting the fields of a Collection_Index...
									//  need to be careful when the field is an attached object.
									//   may use JSON notation for the attachement.
									//   likely to disallow quotes and (square) brackets in field names.



									// Make it so Sorted_Collection_Index can handle attached objects.
									//  fields set like [{"attached": {"meta": "name"}}]
									//  where a field is specified as an object, 

									// So the index gets created.
									//  It has those fields...
									//   where to they get made within the Sorted_Collection_Index constructor?




									var index = new Sorted_Collection_Index({
										'fields' : individual_index_fields
									});
									
									// These collection indexes should have a 'get' function.
									
									that.index_system.set_index(index);
									indexes.push(index);
									
								});
								
								that.index_system._primary_unique_index = indexes[0];
								return indexes[0];
							}
							if (is_arr_of_strs(index_definition)) {
								// one index, with fields
							}
							
						}
							
						//}
					}
				})
			}
		}),
		
       /** 
        * @func
        * @param ...
        */
		'index': fp(function(a, sig) {
			
			if (a.l == 1) {
				return this.index_by(a[0]);
			}
			

		}),
		

       /** 
        * @func
        * @param obj
        */
		'test_object_against_constraints': function(obj) {
			// will do the test for the various constraints
			//console.log('test_object_against_constraints');
			//var res_test_data_object_constraint = 
			//console.log('this._type_constructor ' + this._type_constructor);
			//console.log('this._data_object_constraint ' + stringify(this._data_object_constraint));
			//console.log('this._data_type_constraint ' + stringify(this._data_type_constraint));
			
			//console.log('obj ' + stringify(obj));
			// Could also have a constructor type - can check instance of
			
			if (this._type_constructor) {
				if (!obj instanceof this._type_constructor) return false;
			}

			if (this._data_object_constraint) {
				// not sure why this will have a _data_object_constraint in various cases.
				if (!this._data_object_constraint.match(obj)) return false;
			}
			
			if (this._data_type_constraint) {
				// test against that constraint
				if (!this._data_type_constraint.match(obj)) return false;
			}
			
			var that = this;
			
			var res = true;
			each(this._unique_constraints, function(i, unique_constraint) {
				//console.log('unique_constraint ' + stringify(unique_constraint));
				// then test against that unique constraint.
				
				// get the fields of the constraint, then try to get a record with those fields
				
				var uc_fields = unique_constraint.fields;
				//console.log('uc_fields ' + stringify(uc_fields));
				
				// then attempt to 'get', using these fields.
				//  performing a record count would be more efficient though.
				//  'has' search, returns boolean
				
				var find_params = [];
				each(uc_fields, function(i, field_name) {
					// get the value
					
					var field_value = obj.get(field_name);
					find_params.push([field_name, field_value]);
					
				});
				//console.log('find_params ' + stringify(find_params));
				
				var found = that.find(find_params);
				//console.log('found ' + stringify(found));
				
				if (found && found.length > 0) {
					res = false;
				}
			});
			return res;
		},
		

       /** 
        * @func
        * @param value
        */

        // Sometimes wrap a normal JS obj as a Data_Value, Data_Object or Collection?



		'push': function(value) {

			var tv = tof(value);
			//console.log('1) collection push value: ' + stringify(value));
			//console.log('--------------------')
			//console.log('push tv ' + tv);

			if (tv == 'object') {
				
				var dtc = this._data_type_constraint;
				//  but we can have an object definition constraint?
				//  is that a type of data_type_constraint?
				//console.log('dtc ' + dtc);

				if (dtc) {
					var dtcon = dtc.data_type_constructor;
					//console.log('dtcon ' + dtcon);
					value = new dtcon(value);
				} else {
					var ddc = this._data_def_constraint;
					//console.log('ddc ' + stringify(ddc));

					// need to see if it matches the constraint.
					//console.log('value ' + stringify(value));
					// Will need something recursive to see if something matches a data_def.
					//  in the data_def_constrint code.
					var match = true;
					if (ddc) match = ddc.match(value);
					//console.log('match ' + match);

					if (!match) {
						throw 'Does not match data_def constraint';
					} else {
						// need to create a new data_object with that data_def?
						//  or could set the fields?
						//  Fields could respond to data_def.
						//   But data_def could encompass more than just fields.

						// And a Data_Object could have a data_def_constraint too.
						//  That would also set its fields.

						// Will just set the fields with the data_def for now???
						//value = dobj(value);
						// Would be better to make an enhanced_data_object here

						//value = new 
						//console.log('* value ' + stringify(value));
						if (ddc) {
							value = dobj(value, ddc.data_def);
						} else {
							value = dobj(value);
						}
						//console.log('value ' + stringify(value));
						// set its constraints...
						value.constraints(ddc);
						// Using the collection data definition constraint, should be able to set the inner constaint of the
						//  data_object. May just use the same object rather than cloning it.
					}

					//value = dobj(value);
				}
				tv = tof(value);
				//console.log('tv ' + tv);
				//console.log('value ' + value);
			}
			
			//console.log('collection push tv: ' + tv);
			//console.log('2) collection push value: ' + stringify(value));
			// so, a data_item gets added at this._arr_idx

			// also need to be add a collection to the collection.
			//  that will be a lot like with Data_Object.
			//   There can't really be full automatic indexing here.
			
			if (tv == 'collection') {
				//console.log('1) pre test_object_against_constraints');
				var constraints_test_res = this.test_object_against_constraints(value);
				//console.log('constraints_test_res ' + constraints_test_res);
				if (constraints_test_res) {
					this.index_system.unsafe_add_object(value);
					var pos = this._arr.length;
					this._arr.push(value);
					
					// but does this have a context?
					//  A content collection should have the same context as the control it's in.
					value.parent(this, pos);
					
					var e = {
						'target': this,
						'item': value,
						'position': pos,
						'type': 'insert'
					}
					//console.log('adding collection to collection event being raised');
					// raise a change event.
					//  have a change type, like add or insert.

					//this.raise_event('add', e);
					this.raise_event('change', e);

					this._arr_idx++;
				} else {
					var stack = new Error().stack
					//console.log( stack );
					throw('Collection constraint(s) not satisfied');
				}
			}
			if (tv == 'data_object' || tv == 'control') {
                
				//console.log('pre constraints test');
				//console.log('2) pre test_object_against_constraints');
				var constraints_test_res = this.test_object_against_constraints(value);
				//console.log('post constraints test');
				// the uniqueness test is an important one too.
				//  when a unique constraint is set up, the index should be created.
				//console.log('constraints_test_res ' + constraints_test_res);
				// would be testing against a unique constraint.
				//  can test to see if a new object would violate a collection constraint?
				//console.log('constraints_test_res ' + constraints_test_res);
				if (constraints_test_res) {
					
					//console.log('pre unsafe_add_object');
					this.index_system.unsafe_add_object(value);
					// gets added to the index... but is its position within this collection stored too?
					//console.log('post unsafe_add_object');
					// Things do get a bit complicated with needing the positions within the collection to do various things.
					// Don't want to rely on it always being stored in the indexes though.
					
					var pos = this._arr.length;
					this._arr.push(value);
					// the position within the parent / the parent's array.
					//console.log('pos ' + pos);
					var e = {
						'target': this,
						'item': value,
						'position': pos,
						'type': 'insert'
					}
					//value._relationships[this._id()] = this._arr_idx;
					//console.log('adding data_object to collection event being raised');
					// this, and the position it's going to.


					// Should set the parent and the position within the parent.
					//  __index perhaps?

					value.parent(this, pos);

					// item can have multiple parents... that should be possible.
					//console.log('pre raise add event');
					
					// This bit is taking a while.
					//  Not sure why!!! Has to do with objects being put in a large collection probably.
					//  Too many things, in the wrong context, getting notified.

					this.raise_event('change', e);

					
					//console.log('post raise add event');
					// accessed using a 'parent' array / mini-collection?
					// mini-collection, handling collections without the bells and whistles?
					//  or collections with some things disabled?
					
					// value.parent(this)
					
					// location within parent...
					//  should probably / possibly make this clearer in code?
					//  not so sure that the position tracking will work all the times.
					//  may be best to separate the position, or give it some kind of variable name.
					// will do more work and testing on this later.
					this._arr_idx++;
				} else {
					var stack = new Error().stack
					//console.log( stack );
					throw('Collection constraint(s) not satisfied');
				}
				// check if the index system can add the object.
			}
			
			if (tv == 'array') {
				// wrap it or not? could put it in another collection.
				//  will that be useful for a function's parameters?
				//  that would maintain the whole system with the wrapper and relationships.
				// I think we do that... turn it into a new collection and put it in there.
				//  Will get for some more complex behaviours, but they could prove pretty useful.
				// Could make a copyleft licence wrapper - any code that runs it needs to be wrapped by that function.
				// for the moment, I think we create a new collection wrapper to hold the array.
				// need to basically add an array object to the collection, but have it wrapped.
				
				//var coll = new Collection(value);
				//return this.push(coll);
				return this.push(new Collection(value));
			}

			if (tv == 'string' || tv == 'number') {

				//console.log('tv ' + tv);
				// still need to check if it matched the collection constraint(s).
				//console.log('3) pre test_object_against_constraints');

				

				var constraints_test_res = this.test_object_against_constraints(value);
				//console.log('constraints_test_res ' + constraints_test_res);
				if (constraints_test_res) {
					var dv = new Data_Value({'value': value});
					//console.log('dv ' + stringify(dv));
					var pos = this._arr.length;
					// Should not need a context or ID just to be put in place.
					this._arr.push(dv);
					var e = {
						'target': this,
						'item': dv,
						'position': pos,
						'type': 'insert'
					}
					this.raise_event('change', e);
					
					if (tv == 'string') {
						// indexing the value
						this.index_system.unsafe_add_object(dv);
					}
				} else {
					console.trace();
					throw('wrong data type');
				}
			}
			this._arr_idx++;
			return value;
		},


       /** 
        * @func
        * @param value
        */
		'add': function(value) {
			return this.push(value);
		},


       /** 
        * @func
        * @param arr
        */
		'load_array': function(arr) {
			var that = this;
			//console.log('load_array arr ' + stringify(arr));
			// there could be a data type that this is expecting... a constraint?
			//  could have a data type constructor.
			// so, if the item given is not a Data_Object, we can try making the Data_Object, and putting it in place.
			var dtc = this._data_type_constraint;
			//console.log('dtc ' + dtc);

			// May also need to change ID values on the objects?
			//  Create clones of the objects with different ID values?

			// Be able to accept items being pushed that will have IDs changed?

			// Should have a data_type_constructor with typed collections.



			if (dtc) {
				// is a Collection_Data_Type_Constraint
				var data_type_constructor = dtc.data_type_constructor;
				//console.log('data_type_constructor ' + data_type_constructor);
				
				/*
				each(arr, function(i, v) {
					that.push(v);
				});
				*/
				for (var c = 0, l = arr.length; c < l; c++) {
					that.push(arr[c]);
				}


			} else {
				/*
				each(arr, function(i, v) {
					
					that.push(v);
				});
				*/
				for (var c = 0, l = arr.length; c < l; c++) {
					that.push(arr[c]);
				}
			}
			this.raise_event('load');
		},
		

       /**
        * polymorphic version
        * @name values
        * @func
        * @param {string} parm1 - param description
        * @memberof module:core/collection
        * @inner
        */

       /** 
        * @func
        * @param ...
        * @variation 2
        */
		'values': fp(function(a, sig) {
			if (a.l == 0) {
				return this._arr;
			} else {
				var stack = new Error().stack;
				//console.log(stack);
				//console.log('');
				//console.log('sig ' + sig);
				// should be setting the values.
				throw 'not yet implemented';
			}
		}),


       /** 
        * @func
        */
		'value': function() {
			var res = [];
			this.each(function(i, v) {
				if (typeof v.value == 'function') {
					//res[i] = v.value();
					res.push(v.value());
				} else {
					res.push(v);
				}
				
			});
			return res;
		},

		// insert_at seems very important.



		// all the collection's values
		// values() will get or set all the values.
	
	// Could use a (new) extension of Data_Object.extend.
	//  We want it so that we can specify a 'data_object' when defining a class, and this
	//   sets up a ._data_object_constraint using .constraint(D)
	//    though we are giving it a Data_Object subclass constructor.





	});


    /**
     * @function 
     * @static
     */
	Collection.extend = function() {
		var a = arguments;
		var args = [a[0]];
		// call Data_Object.extend with another function for post-initialization?

		if (a[0].data_object) {
			//console.log('extending a Collection with .data_object');
			args.push(function() {
				// post-init function to get called after the init function.

				this.constraint(a[0].data_object);
			})
			//throw 'stop';
		}
		// execute a post-init function in order to set the constraint in some circumstances?
		//var args = [a[0]]


		var res = Data_Object.extend.apply(this, args);


		return res;

	}

	// jsgui-lang-util.js

	var vectorify = function(n_fn) {
		// Creates a new polymorphic function around the original one.

		var fn_res = fp(function(a, sig) {
			//console.log('vectorified sig ' + sig);
			if (a.l > 2) {
				var res = a[0];
				for ( var c = 1, l = a.l; c < l; c++) {
					res = fn_res(res, a[c]);
					// console.log('res ' + res);
				}
				return res;
			} else {
				if (sig == '[n,n]') {
					return n_fn(a[0], a[1]);
				} else {
					// will need go through the first array, and the 2nd... but
					// will need to compare them.
					var ats = atof(a);
					//console.log('ats ' + stringify(ats));
					if (ats[0] == 'array') {
						if (ats[1] == 'number') {
							var res = [], n = a[1];
							each(a[0], function(i, v) {
								res.push(fn_res(v, n));
							});
							return res;
						}
						if (ats[1] == 'array') {
							if (ats[0].length != ats[1].length) {
								throw 'vector array lengths mismatch';
							} else {
								var res = [], arr2 = a[1];
								each(a[0], function(i, v) {
									res.push(fn_res(v, arr2[i]));
								});
								return res;
							}
						}
					}
				}
			}
		});
		return fn_res;
	};

	var n_add = function(n1, n2) {
		return n1 + n2;
	}, n_subtract = function(n1, n2) {
		return n1 - n2;
	}, n_multiply = function(n1, n2) {
		return n1 * n2;
	}, n_divide = function(n1, n2) {
		return n1 / n2;
	};

	var v_add = vectorify(n_add), v_subtract = vectorify(n_subtract);

	// these are not the standard, established vector or matrix operations. They
	// can be used for scaling of arrays of vectors.
	var v_multiply = vectorify(n_multiply), v_divide = vectorify(n_divide);

	var vector_magnitude = function(vector) {
		// may calculate magnitudes of larger dimension vectors too.
		// alert(tof(vector[0]));
		// alert(vector[0] ^ 2);

		var res = Math.sqrt((Math.pow(vector[0], 2)) + (Math.pow(vector[1], 2)));
		return res;

	};

	var distance_between_points = function(points) {
		var offset = v_subtract(points[1], points[0]);
		console.log('offset ' + stringify(offset));
		return vector_magnitude(offset);
	}

	// Does this have a general use?
	var remove_sig_from_arr_shell = function(sig) {
		// first and last characters?
		// use regex then regex to extract the middle?

		if (sig[0] == '[' && sig[sig.length - 1] == ']') {
			return sig.substring(1, sig.length - 1);
		}
		return sig;
		// but also do this to the arguments?
	};

	var execute_on_each_simple = function(items, fn) {
		// currently no arguments provided, there may be in the future / future
		// versions
		var res = [], that = this;
		each(items, function(i, v) {
			res.push(fn.call(that, v)); // function called with item as its only
										// parameter.
		});
		return res;
	};

	var filter_map_by_regex = function(map, regex) {
		var res = {};
		each(map, function(i, v) {
			// if (regex.match(i)) {
			if (i.match(regex)) {
				res[i] = v;
			}
		});
		return res;
	}
	
	// May be replaced by a more veristile replacement system, ie input transformation and parsing in schemas.
	var npx = arrayify(function(value) {
		// don't think we can use arrayify?

		// good candidate for pf? but how it deals with array trees...
		// could have another one, like sf or spf that is simpler in terms of
		// treating an array in the signature as just one array?

		var res, a = arguments, t = tof(a[0]);

		// fn sigs??? performance?

		if (t == 'string') {
			res = a[0];
		} else if (t == 'number') {
			res = a[0] + 'px';
		}
		return res;
	});

	var no_px = arrayify(fp(function(a, sig) {
		// no_px - removes the 'px' if it ends with px
		// Generally returns a number.
		// value
		var re = /px$/, res;
		if (sig == '[s]' && re.test(a[0])) {
			res = parseInt(a[0]);
		} else {
			res = a[0];
		}
		;
		return res;
	}));

	var arr_ltrb = [ 'left', 'top', 'right', 'bottom' ];

	var str_arr_mapify = function(fn) {
		var res = fp(function(a, sig) {
			if (a.l == 1) {
				if (sig == '[s]') {
					var s_pn = a[0].split(' ');
					// console.log('s_pn ' + s_pn.length);

					if (s_pn.length > 1) {
						return res.call(this, s_pn);
					} else {
						return fn.call(this, a[0]);
					}
				}

				if (tof(a[0]) == 'array') {
					var res2 = {}, that = this;

					each(a[0], function(i, v) {
						res2[v] = fn.call(that, v);
					});
					return res2;
				}
			}
		});
		return res;
	};

	// Lower level functions
	// For the moment not exposed

	// These two do deal with nested data... but the purpose of the nested
	// module is to put the complicated nested stuff there.
	// This one looks quite useful and it is limited in what it does, easy to
	// understand. Keep here.


	var arr_hex_chars = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
			'A', 'B', 'C', 'D', 'E', 'F' ];
	var dict_hex_to_bin = {
		'0' : 0,
		'1' : 1,
		'2' : 2,
		'3' : 3,
		'4' : 4,
		'5' : 5,
		'6' : 6,
		'7' : 7,
		'8' : 8,
		'9' : 9,
		'A' : 10,
		'B' : 11,
		'C' : 12,
		'D' : 13,
		'E' : 14,
		'F' : 15
	};
	var str_hex_to_int = function(str_hex) {
		str_hex = str_hex.toUpperCase();
		var i = str_hex.length; // or 10
		var res = 0, exp = 1;
		while (i--) {
			var i_part = dict_hex_to_bin[str_hex.charAt(i)];
			var ip2 = i_part * exp;
			res = res + ip2;
			exp = exp * 16;
			// ...
		}
		;
		return res;
	};
	var byte_int_to_str_hex_2 = function(byte_int) {
		var a = Math.floor(byte_int / 16), b = byte_int % 16, sa = arr_hex_chars[a], sb = arr_hex_chars[b], res = sa
				+ sb;
		return res;
	};
	var arr_rgb_to_str_hex_6 = function(arr_rgb) {
		var r = byte_int_to_str_hex_2(arr_rgb[0]);
		var res = r + byte_int_to_str_hex_2(arr_rgb[1])
				+ byte_int_to_str_hex_2(arr_rgb[2]);
		return res;
	};
	var arr_rgb_to_css_hex_6 = function(arr_rgb) {
		// a / b // divide a by b
		// a % b // find the remainder of division of a by b
		return '#' + arr_rgb_to_str_hex_6(arr_rgb);
	};
	/*
	 * Consider the following:
	 * 
	 * 
	 * var arr_multi_set_item = function(arr, iBegin, iEnd, item_name, value) {
	 * var c = iBegin; while (c <= iEnd) { arr[item_name][c] = value; }; return
	 * arr; }; var item_cond_set_multi_values = function(target, source,
	 * value_names) { each(value_names, function(i, v) { if (typeof source[v] !=
	 * 'undefined') { target[v] = source[v]; } }); return target; }; var
	 * arr_item_cond_set_multi_values = function(arr_target, arr_source, iMin,
	 * iMax, value_names) { for (var c = iMin; c <= iMax; c++) {
	 * item_cond_set_multi_values(arr_target[c], arr_source[c], value_names); }; };
	 * 
	 */

	// information about data types such as 'int'?
	// Perhaps some number data types could be re-implemented, like Decimal.

	var input_processors = {};

	var output_processors = {};

	var validators = {
		'number' : function(value) {
			return tof(value) == 'number';
		}
	};

	// create data type instance from info

	// Code will be better organized using this, but it will still be quite a
	// large amount of logic.
	// Will make reference to special cases (directives) to control the flow.

	// I think the recursion inherant in the data types will be enough for this
	// to work (hope so).
	// The logic here looks at two layers sometimes, I hope it does not need
	// recursion there, but rather that one directive may reference other
	// things.
	// Those other things could be their own data types that can be referenced.

	var referred_object_is_defined = function(object_reference) {
		return is_defined(object_reference[0][object_reference[1]]);
	}

	// This code is really big now.
	// Without WS and logging it will be smaller.

	// The HTML module will give it HTML and CSS-like properties it will use for
	// its internal representation and translations to and from
	// DOM representations.

	// The B (or B+?) tree coming up. It's quite a big one....
	// There will be some other, simpler classes that use it.

	// KSVS, Keys and Values store
	// May want something that stores only a single value for a key.
	// Likely to want to specify this, in how an index is used.
	// Don't want to impose an extra requirement on there being unique values
	// for indexed fields.
	// That's why more complex data types may fit the data better than dicts.

	// Will make a new B+ tree structure.
	//  I'll want to know what it does anyway - and I'll see that this one is optimized as well as useful for various operations that would get performed on the tree.
	
	// Quite a few data types will wind up here, in this bit of the library.
	//  I don't think they will take up all that much space.
	
	// Could have Data_Structures before util?
	//  I don't think they'll be making use of functionality such as Collection or Data_Object. Collection will use these data structures for its index.
	//   May be good having them really compatable too?
	
	//  Perhaps there will be a lang 'essentials' set?
	//   Before data structures, core tools such as polymorphism, stringify, each, tof
	//    That would be a really good toolkit in a few KB of code.
	//    I think those things won't change so much.
	//     Other parts of lang are developing, but are taking far more code to do.
	
	
	
	
	// Data_Object and Collection are not data structures - they are more than that.
	//  They provide a utility, and use the appropriate data structures to do so. They also deal with events and have/enable MVC patterns.
	//  That means that data structures won't use them.
	
	// There will be a data structures part of the system that will be used as building blocks for this part.
	//  The data structures will use jsgui-lang-essentials.
	
	
	
	
	
	
	//var Doubly_Linked_List = 
	
	
	// var BTree = function() {

	// BTree is fairly big.
	// It can be shrunk a bit further... but not massively
	// May find this is an integral part of code to well functioning data
	// systems on the client.
	// May only be useful when there is a more significant amount of data to
	// deal with?

	// Makes things possible though.

	var set_vals = function(obj, map) {
		each(map, function(i, v) {
			obj[i] = v;
		});
	};

	// its functions may get proxied.

	// OK, so looks like it's working so far.

	// indexed collection. keeps track of the index of each item in it.

	// Will use this within the typed data I think.

	// every item needs an id, need an index too.

	// Need to be able to access controls in a collection using a nice interface
	// at different levels.

	// items in the collection have got index() and id() functions for access to
	// the variables.
	// index is the position in the collection.

	// Think this one is quite specific for when items have ids.

	// Should be made much more general, or given specific name.

	// Will be phased out.
	// Will have Collection.

	// That will be a Data_Object.
	// It will have an array
	// It will have index capabilities.
	// Perhaps it could even be able to handle larger datasets with efficient
	// indexing capabilities.

	// As an abstract class?

	// Indexed by position in another index?
	// Or ordered by it...

	// And that order could change, too.
	// have it respond automatically for that...
	// Would like to get this to be easy to express.

	// collection 1 not particularly ordered
	// collection 2 ordered by items' positions in collection 1.
	// don't want lots of code specifically for this - but should be possible
	// using a fairly general system.
	// so each object will have its collection1_index value available.
	// Need to think about where to hook up the listeners to listen for a change
	// in collection1 so order could be updated in collection 2.
	// Probably not for any single item that changes position
	// Could maybe be given a list of all items that change position...
	// Or it could be an event on the object.
	// May re-index that.

	// Also, need to look out for property changes on indexed items.
	// Need to update the index in that situation.

	// Seems like quite a lot of work to get this all going - but I think it
	// will be worth it when the indexed collection system is working.
	// Will need to refer to the index record when the property value changes.
	// Perhaps update all relevant indexes.
	// But then don't want to proceed with other things until this is done.

	// The system gets somewhat complicated, but this is something which could
	// be an integral component that could be reused a lot, if it is done right.

	// A collection of collections could be a lot like a database.
	// May want more examples about dealing with such collections.

	// Don't want to spend a long time making and testing various things that
	// have this collection and ordering functionality...
	// However need to do what is necessary. Some of them may not seem that
	// useful in the abstract - like having something that is indexed by the
	// position within another control.
	// Indexed by the position in another control or ordered by it? Same thing?
	// May require quite a bit behind the scenes to get everything working
	// right.
	// It won't be a very large amount of code... but it needs to be right.
	// Really don't want to make the download too large. May change the b+
	// implementation and experiment with it, get a smaller b+ tree size.
	// Could perhaps be loaded after lang, as a separate module, but using lang.
	// Lang could start with the indexing system set up, but not all the types
	// of indexes. Maybe just the dict index?
	// Other indexes will then be easier to work on separately.
	// But b+ could be so essential to the library working smoothly in the GUI.
	// Won't be impossible to make a micro-b+ implementation.
	// So could still get by id with the dict index
	// Maintaining another collection ordered by the position in another
	// collection does seem like a good objective.
	// Position in collection = position within the normal array...
	// Not the position within some kind of index.

	// index_by(other_collection)
	// only if items are in the other collection...

	// item position in collection... collection is always an array as well.
	// could that make things inefficient there?
	// moving items around the array, changing the array index of items.
	// may not be worth so much indexing with those inherant limitations?

	// could make different collections with different internal storage?
	// linked list? something that maintains an order?

	// at the moment, controls are stored in an array, other indexing is done
	// too.

	// A single index.
	
	
	/*
	var DataCollection = Class.extend({
		'init' : function(spec) {
			this._id_map = {};
			this._arr = [];
			this.length = 0;
		},

		// function reference - add functions to that?

		// much like fn_call. Perhaps DataObject could have fn_call - the same
		// as this. But this one deals with an empty sig, maybe that's the
		// default function which can be assigned.
		'action' : fp(function(a, sig) {
			// what about calling this with more parameters?

			// console.log('action sig ' + sig);

			if (sig == '[]') {
				// console.log('1) this._arr ' + tof(this._arr));
				// console.log(this._arr.length);
				return this._arr;
			} else {
				var action_name = a[0];

				// console.log('action_name ' + action_name);

				// then call the relevant function... eg add(a[1])

				// and then make it so that more parameters can be given.

				var params = a.slice(1);

				// return this[action_name](a[1]);

				return this[action_name].apply(this, params);

			}

		}),

		'add' : fp(function(a, sig) {
			// item
			console.log('add sig ' + sig);

			if (sig == '[o]' || sig == '[c]') {
				// if ()
				var i = this._arr.length;
				this._arr.push(a[0]);
				this.length++;
				// console.log('2) this._arr ' + (this._arr));
				// console.log('2) this._arr ' + stringify(this._arr));

				// circular references with controls?

				// but could index be a read-only property?
				if (tof(a[0].index) == 'function') {
					a[0].index(i);
				}

				if (tof(a[0].id) == 'function') {
					var id = a[0].id();
					this._id_map[id] = a[0];
				}

			}

		}),
		'get' : fp(function(a, sig) {
			// string, it's an id
			if (sig == '[s]') {
				return this._id_map[a[0]];
			} else if (sig == '[n]') {
				return this._arr[a[0]];
			}

			// number it's an index

		}),
		'insert' : fp(function(a, sig) {
			// can be given one object to insert, can be given an array of items
			// to insert?
			// not for actually inserting an array though. For use with controls
			// really, could be used with other objects.
			// Could maybe turn this off as an object in the construction.
			// maybe told to insert(control, position)

			console.log('insert sig ' + sig);
			// if (sig == '[')
			// checking for an array in the sig is tricky.

			if (sig == '[o,n]') {
				// will need to move the index of items above forward.

				this._arr.splice(a[1], 0, a[0]);
				for ( var c = a[1], l = this._arr.length; c < l; c++) {
					var item = this._arr[c];
					if (item.index) {
						item._.index = c;
					}
				}
				this.length++;

			} else {

				if (tof(a[0]) == 'array') {

				} else if (tof(a[0]) == 'object' || tof(a[0]) == 'control') {
					// will need to move the ones after it up as well.

				}

			}

		})
	});
	var p = DataCollection.prototype;
	*/
	// Functionality for the control's IDs - that seems like its page_context,
	// which could be part of html.

	var _data_generators = {
		//'Ordered_String_List' : function() {
		//	// console.log('dg Ordered_String_List');
		//	return new Ordered_String_List();
		//}
	}

	// This could be useful for a few things, like storing tables in a DB
	// schema.
	// Maybe quite a few more things.

	// Uses private variables.
	
	// Different to sorted string list.
	//  Indexed by the string too...
	

	
	var truth = function(value) {
		return value === true;
	}
	
	// will put functions into the jsgui object.

	// with the functions listed like this it will be easier to document them.
	
	var extend = jsgui.extend, fp = jsgui.fp, stringify = jsgui.stringify, tof = jsgui.tof;


	// Connecting these input processors in this instance to the Enhanced_Data_Object?



    extend(jsgui.data_types_info, {

        'color': ['indexed_array', [
            ['red', 'number'],
            ['green', 'number'],
            ['blue', 'number']
        ]],
        'oltrb': ['optional_array', ['left', 'top', 'right', 'bottom']]
    });

    var create_input_function_from_data_type_info = function (data_type_info) {
        console.log('create_input_function_from_data_type_info data_type_info ' + stringify(data_type_info));

        if (tof(data_type_info) == 'array') {
            var secondary_instruction = data_type_info[0];
            var arr_items = data_type_info[1];
            //console.log('secondary_instruction ' + secondary_instruction);
            //console.log('tof(arr_items) ' + tof(arr_items));

            if (tof(arr_items) == 'string') {
                // the distance.
                // console.log('arr_items ' + arr_items);


                if (jsgui.data_types_info[secondary_instruction]) {
                    // process it with that instruction, but need to have it operating with the data type given here,
                    //  'distance'.

                    // seems quite hard to do, may be a recursive process.
                    //  optional array being the example here.

                    // otlrb.

                    // call a new procedure for otlrb?
                    //  may need to automatically jump through some indirection.
                    //   really, want to be layering functional processors.

                    if (jsgui.data_types_info[arr_items]) {
                        // process it with that instruction, but need to have it operating with the data type given here,
                        //  'distance'.

                        // seems quite hard to do, may be a recursive process.
                        //  optional array being the example here.

                        // otlrb.

                        // call a new procedure for otlrb?
                        //  may need to automatically jump through some indirection.
                        //   really, want to be layering functional processors.

                        //console.log('processing ' + arr_items + ' according to ' + secondary_instruction);

                        // load up the oltrb item...
                        //  I think we need a reader for that.

                        // A constructor / a function that is an input processor for oltrb.
                        //  Test that, then use it here.


                    }
                }
            }

            if (tof(arr_items) == 'array') {
                // process the secondary instruction...
                if (secondary_instruction == 'indexed_array') {

                    var res = fp(function (a, sig) {

                        // check the arguments given... do they match what is expected?

                        // or if it is an object, put them into place in the correct position.

                        // data_types_info could have associated maps, attached to the data_types_info.

                        //console.log('input processor for dti ' + stringify(data_type_info));
                        //console.log('sig ' + sig);
                        // with an indexed array, there should be a dti.position_map

                        if (sig == '[[[n,n,n]]]') {
                            res = a[0][0];
                            return res;
                        }

                        // The preprocessor is dealing with these.
                        /*
						if (sig == '[[s]]') {
							// likely to best use some regex color matches.
							//  could have a pre-input?
							//  specifific formatting for color anyway, could use a preprocessor.
							
						}
						*/

                        if (!data_type_info.map_pos) {
                            data_type_info.map_pos = {};

                            each(arr_items, function (i, v) {
                                console.log('i ' + i);
                                console.log('v ' + v);
                                data_type_info.map_pos[v[0]] = i;
                            });
                        }

                        if (sig == '[[o]]') {
                            // put the items from that object into an array.

                            var dtimp = data_type_info.map_pos;
                            var o = a[0][0];

                            var res = [];

                            each(o, function (i, v) {
                                var pos = dtimp[i];
                                console.log('pos ' + pos);
                                console.log('v ' + v);
                                res[pos] = v;
                            });
                            //console.log('res ' + stringify(res));
                            return res;
                        }

                        // also use regular expression identifiers for parsing from a string?

                        //throw '3) stop';
                        // then use data_type_info.map_pos

                        //console.log('data_type_info.map_pos ' + stringify(data_type_info.map_pos));

                    });
                    return res;
                }
            }
        }
    }

    // or just .extend('control');
    //  Data_Object('control'); (not a constructor).

    //var Control = Data_Object.extend({'data_type': 'control'});
    //var Control = Data_Object.extend('control');


    // could have an input preprocessor as well.
    //  so that generalized functionality gets used too.

    // Is really a CSS hex string -> [r, g, b] converter

    // color parser...
    //  want to parse the input
    // color preprocessor_parser

    var color_preprocessor_parser = fp(function(a, sig) {
    	console.log('color_preprocessor_parser a ' + stringify(a));
    	console.log('color_preprocessor_parser sig ' + sig);
    	if (sig == '[s]') {
    		var input = a[0];
    		var rx_hex = /(#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2}))/;
            var m = input.match(rx_hex);
            //console.log('m ' + stringify(m));

            if (m) {
                // Could use arrayify or something to make the conversion quicker... will do that in more places, mainly want to get the code working now.

                var r = jsgui.str_hex_to_int(m[2]);
                var g = jsgui.str_hex_to_int(m[3]);
                var b = jsgui.str_hex_to_int(m[4]);

                var res = [r, g, b];
                return res;
            }
    	}

    })


    var color_preprocessor = (function (fn_color_processor) {
        var that = this;
        //throw '!stop';
        var res = fp(function (a, sig) {

            //console.log('color_preprocessor sig ' + sig);

            if (sig == '[[s]]') {
                //var new_input = 
                // use regexes to detect / read the string.

                //var rx_hex = /^#?[a-fA-F0-9][a-fA-F0-9][a-fA-F0-9]$/;
                var rx_hex = /(#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2}))/;
                //var rx_hex = /(#(([0-9A-Fa-f]{2}){3}))/;
                //var rx_hex = /(#([0-9A-Fa-f]{2}){3})/;
                var input = a[0][0];

                //var m = rx_hex.match(input);
                var m = input.match(rx_hex);
                //console.log('m ' + stringify(m));

                if (m) {
                    // Could use arrayify or something to make the conversion quicker... will do that in more places, mainly want to get the code working now.

                    var r = jsgui.str_hex_to_int(m[2]);
                    var g = jsgui.str_hex_to_int(m[3]);
                    var b = jsgui.str_hex_to_int(m[4]);

                    var res = [r, g, b];
                    return res;
                }

            } else {
                // call with the same arguments.
                //console.log('calling normal...');
                return fn_color_processor.apply(that, a);

            }
        });
        return res;
    });

	// In previous modules, it won't keep the same input_processors.
	//  Is there a way of retrieving that from the most inner modules?
    //test_Color();

    // And inputting an indexed array.
    //  Will need to accept 2d size inputs.
    // Size could possibly be 3d, maybe 1d? A line has a size, which is also its length (though in the world of GUI it could also have
    //  a thickness).

    // Optional array looks more like a language feature (enhancement).
    //  Or even a core language feature?


    // There will be different types of optional arrays, will have different input parameters.
    jsgui.input_processors['optional_array'] = fp(function (a, sig) {
        // would need to take in objects with the names of the properties as well.
        //  populate a sparse array with them.
        //   will make a very flexible HTML interface.
        //   controls will be able to have their properties changed in a flexible way, and output seamlessly to a wide variety of browsers.

        // the items in the index could be a bit more complicated, but we are going to say they are just strings for the moment.
        //  items_data_type_name...
        //   is the params an array of strings?
        // oa_params, input
        if (a.l == 2) {
            var oa_params = a[0],
                input = a[1];
            if (tof(input) == 'array') {
                // check it is within the right number.
                if (input.length <= oa_params.length) {
                    return input;
                }
            } else {
                return input;
            }
        }
        if (a.l == 3) {
            var oa_params = a[0],
                items_data_type_name = a[1],
                input = a[2];
            // now need to get every item in the array or the item to conform to the given type.
            var input_processor_for_items = jsgui.input_processors[items_data_type_name];
            //console.log('input_processor_for_items ' + input_processor_for_items);
            //console.log('tof(input) ' + tof(input));
            if (tof(input) == 'array') {
                // check it is within the right number.
                if (input.length <= oa_params.length) {
                    var res = [];
                    each(input, function (i, v) {
                        res.push(input_processor_for_items(v));
                    });
                    return res;
                }
            } else {
                return input_processor_for_items(input);
            }
        }
        //console.log('oa_params ' + stringify(oa_params));
    });

    jsgui.input_processors['indexed_array'] = fp(function (a, sig) {
        // it may be taking some kind of data type that things need to be applied to.
        // eg 'size': ['indexed_array', ['distance', ['width', 'height']]],
        // would need to take in objects with the names of the properties as well.
        if (a.l == 2) {
            var ia_params = a[0],
                input = a[1];
            //console.log('ia_params ' + stringify(ia_params));

            if (tof(input) == 'array') {
                if (input.length <= ia_params.length) {
                    return input;
                }
            }
        }
        if (a.l == 3) {
            var ia_params = a[0],
                items_data_type_name = a[1],
                input = a[2];
            var input_processor_for_items = jsgui.input_processors[items_data_type_name];
            if (tof(input) == 'array') {
                // check it is within the right number.
                if (input.length <= ia_params.length) {
                    var res = [];
                    each(input, function (i, v) {
                        res.push(input_processor_for_items(v));
                    });
                    return res;
                }
            }
        }
    });

    jsgui.input_processors['n_units'] = function (str_units, input) {
        // this will change things to have both the number of units and a string with the unit in an array.
        //  will make it easier to do maths on the distances.

        if (tof(input) == 'number') {
            return [input, str_units];
        }
        if (tof(input) == 'string') {
            //var rx_n_units = /^(?:(\d+)(\w+))|(?:(\d*)\.(\d+)(\w+))$/;
            var rx_n_units = /^(\d+)(\w+)$/;
            // then match it, should be multiple parts to the match.

            // Do want to get the various pieces working for the Control system.
            //  Then will be very nice indeed when compacted for a mobile-client.

            var match = input.match(rx_n_units);
            //console.log('match ' + stringify(match));

            if (match) {
                return [parseInt(match[1]), match[2]];
            }

            rx_n_units = /^(\d*\.\d+)(\w+)$/;
            match = input.match(rx_n_units);
            //console.log('match ' + stringify(match));
            if (match) {
                return [parseFloat(match[1]), match[2]];
            }
            //throw('stop');
        }
    };
    jsgui.map_data_type_data_object_constructors = jsgui.map_data_type_data_object_constructors || {};
    

    var ensure_data_type_data_object_constructor = function (data_type_name) {
        //console.log('');
        //console.log('');
        //console.log('jsgui.map_data_type_data_object_constructors[data_type_name] ' + stringify(jsgui.map_data_type_data_object_constructors[data_type_name]));
        //console.log('');
        //console.log('');

        if (!jsgui.map_data_type_data_object_constructors[data_type_name]) {
            //console.log('html module: creating new Data_Object constructor for data_type: ' + data_type_name)
            //throw 'stop';
            // Need to get the variable back through the modules...
            //  Missing global variables?
            //  Move this function somewhere else?
            //  Maybe we could have some storage available in jsgui-lang-essentials through a closure.
            //  That way the code could be sent back... but do we still have different instances running?

            // Could just be different execution contexts... co can't feed back this information about other objects.
            //  But can feed functionality forards.

            // May need to have things more independant.

            //var dti = jsgui.get('dti');
            //console.log('dti ' + dti);
            //throw 'stop';
            var dto = jsgui.data_types_info[data_type_name];
           //console.log('dto ' + stringify(dto));
            //console.log()
            //throw 'stop';
            var dtc = Data_Object.extend({
                'fields': dto
            })
            dtc.prototype._data_type_name = data_type_name;
            jsgui.map_data_type_data_object_constructors[data_type_name] = dtc;
        }
        return jsgui.map_data_type_data_object_constructors[data_type_name];
    }
    jsgui.ensure_data_type_data_object_constructor = ensure_data_type_data_object_constructor;
    //console.log('jsgui.input_processors ' + stringify(Object.keys(jsgui.input_processors)));
    var dti_color = jsgui.data_types_info['color'];

    jsgui.input_processors['color'] = function(input) {
    	console.log('processing color input: ' + stringify(input));

    	var input_sig = get_item_sig(input, 2);
    	//console.log('input_sig ' + input_sig);

    	if (input_sig == '[s]') input = input[0];
    	
    	var res = color_preprocessor_parser(input);
    	// not sure that using the preprocessor is right...
    	//  it returns a function, I think it applies to a function.
    	throw '!!stop';
    	//console.log('res ' + stringify(res));
    	return res;
    }

    //color_preprocessor(create_input_function_from_data_type_info(dti_color));
    jsgui.ensure_data_type_data_object_constructor('color');

    jsgui.output_processors['color'] = function (jsgui_color) {
        var res = jsgui.arr_rgb_to_css_hex_6(jsgui_color);
        return res;
    };

    // collection needs a context...
    //  can get the context from the first object.

    // Grouping not working so well so far...
    //  Maybe a less reflective way of making the group function?



    var group = function() {

    	// Hope this grouping system is not too slow.
    	//  May be able to optimize / selectively make the grouping functions.

    	var a = arguments;

    	if (a.length == 1 && tof(a[0]) == 'array') {
    		return group.apply(this, a[0]);
    	}

    	//var res = new Collection();
    	var res;
    	for (var c = 0, l = a.length; c < l; c++) {
    		var item = a[c];

    		if (c == 0) {
    			res = new Collection({'context': item._context});

    		}
    		res.push(item);

    	}

    	var C = a[0].constructor;
    	var p = C.prototype;

    	//console.log('C ' + C);
    	//console.log('p ' + p);

    	for (i in p) {
    		
    		var tpi = tof(p[i]);
    		//console.log('tpi ' + tpi);

    		// if tpi is a function, then we can make a version for the collection.

    		// need this to remember the function name... maybe with another closure.



    		if (tpi == 'function') {
    			// make a group version.

    			(function(i) {
    				//console.log('i ' + i);

    				if (i != 'each' && i != 'get' && i != 'add_event_listener') {
    					res[i] = function() {
		    				//console.log(i + ' called');
		    				//console.log('called');
		    				//throw 'stop';

		    				// then for each of the items in the collection we call with the same parameters.
		    				// But with which context?
		    				//  Can we have a group context?

		    				// this - will be the collection?

		    				// then we need to call the collective function ...
		    				//  on each of them?
		    				var a = arguments;

		    				res.each(function(i2, v) {
		    					//console.log('i ' + i);


		    					//v[i].apply(res, a);

		    					// adding an event listener...

		    					// do it differently?
		    					//  have it so that the context is the object.
		    					//   it needs to be that for the function to work.

		    					// can that be changed so we give it another context?
		    					//  so that it when the event happens, its triggered context is the group?
		    					// group events will be very useful. then applying changes to a group.
		    					v[i].apply(v, a);

		    				})


		    			}
    				}
    			})(i)

    			

    		}

    	}

    	//throw 'stop';


    	// but the group methods...
    	//  Collective methods.
    	//   Could get the type of the first object.



    	return res;

    }

    var true_vals = function(map) {
    	var res = [];
    	for (var i in map) {
    		if (map[i]) res.push(map[i]);
    	}
    	return res;
    }



	var jsgui = extend(jsgui, {
	//var jsgui = {
		'vectorify' : vectorify,
		'v_add' : v_add,
		'v_subtract' : v_subtract,
		'v_multiply' : v_multiply,
		'v_divide' : v_divide,
		'vector_magnitude' : vector_magnitude,
		'distance_between_points' : distance_between_points,
		//'arr_trim_undefined' : arr_trim_undefined,
		// 'remove_sig_from_arr_shell': remove_sig_from_arr_shell
		//'ll_set' : ll_set,
		//'ll_get' : ll_get,
		'execute_on_each_simple' : execute_on_each_simple,
		'mapify' : mapify,
		'filter_map_by_regex' : filter_map_by_regex,
		'atof' : atof,
		'npx' : npx,
		'no_px' : no_px,
		'str_arr_mapify' : str_arr_mapify,
		'arr_ltrb' : arr_ltrb,
		'true_vals': true_vals,

		// 'data_type_instance': data_type_instance,

		// 'data_types_info': data_types_info,

		//'input_processors' : input_processors,
		//'output_processors' : output_processors,
		
		// This is going to do a bit more to do with validation.
		//  Will validate according to types
		//  Will validate according to other specified requirements
		//   Type validation will be fairly easy... but do need to know what types are expected.
		//    Would be different ways of checking types, particularly with a class inheritance structure.
		//    'IS' type check.
		
		// Want to do checks I like I think is expressed in the HTML section.
		//  This will be integrated with form validation.
		// Will bring that functionality out of 'nested'.
		
		// Want to specify the requirements so that it can know to check for a property value.
		
		'validators' : validators,
		
		//'DataObject' : DataObject,
		//'Data_Object' : DataObject,
		
		// In some cases the wrapper will add difficulty / slowness.
		//  In others it could be useful for some precise number operations.
		
		//'KSVS': KSVS,
		//'KSVS_Cursor': KSVS_Cursor,
		
		//  DataValues could perhaps be addressable within a resource abstraction.
		
		//'Data_Value': Data_Value,
		//'Collection' : Collection,

		'__data_id_method' : 'lazy',
		// '__data_id_method': 'init',

		// 'DataCollection': DataCollection,

		'str_hex_to_int' : str_hex_to_int,
		'arr_rgb_to_css_hex_6' : arr_rgb_to_css_hex_6,

		// These are likely to be deprecated in favour of having lang handle
		// these internally and exposing add_data_type, which will be mapified.

		/*
		 * 'populate_any_maps': populate_any_maps,
		 * 'populate_optional_array_pos_maps': populate_optional_array_pos_maps,
		 * 'populate_indexed_array_pos_maps': populate_indexed_array_pos_maps
		 */
		// 'populate_all_dt_maps': populate_all_dt_maps,
		'_data_generators' : _data_generators,

		'group': group

		//'Ordered_String_List' : Ordered_String_List,

	});


	// enhanced-data-object.js

	var register_data_type = function(data_type_name, def) {
		jsgui.data_types_info[data_type_name] = def;
	}

	var ensure_data_type_data_object_constructor = function(data_type_name) {
		//console.log('ENH ensure_data_type_data_object_constructor');
		//console.log('data_type_name ' + data_type_name);

		if (!jsgui.map_data_type_data_object_constructors[data_type_name]) {

			// Can we get it from the most up-to-date module?
			//  Or even make use of a global variable?
			//  JSGUI?




			var dto = jsgui.data_types_info[data_type_name];
			//console.log('dto ' + stringify(dto));

			// Do we need to be accessing the latest data here?
			//  Can we patch the required component backwards?



			var dtc = Enhanced_Data_Object.extend({
				'fields': dto
			})
			jsgui.map_data_type_data_object_constructors[data_type_name] = dtc;
		}
		return jsgui.map_data_type_data_object_constructors[data_type_name];
	}
	// Maybe the Enhanced_Data_Object will have access to Collection?
	var dop = Data_Object.prototype;
	var do_init = dop.init;
	var do_get = dop.get;

	// And making it a collection will give it good enough indexing anyway.
	var Enhanced_Data_Object = Data_Object.extend({
		// Can we define a Collection like that?
		
		// the flags is a collection of strings... but we want to connect the flags.
		
		// But we can choose the context for the object.
		//  Will need to do that.
		
		// But maybe object could only have flags if they are used?
		//  Dormant fields?
		
		// Collection(String) being in the general context?
		//  It could be a special case, for abstract collections.
		//  Also, not using the 'new' keyword.
		
		'fields': [['flags', Collection(String)]],
		
		// Collection(String) may be hard to understand... Collection is a Class and is normally called with a constructor.
		//  It has not normally been declared with a native data type inside (or any data type) but it could be done and is convenient
		//   syntax. I think without the constructor, but with the object inside, it could be an abstract or representative object,
		//   and used so that we know Collection(String) is a collection of strings (probably implemented using Data_Value objects).
		
		// so will this flags field start up OK?
		//  that should be enough to get the flags field there.
		
		//'init': function(spec) {
		//	this._super(spec);
		//},
		
		/*

		'init': function(spec) {
			//this._super(spec);
			do_init.call(this, spec);
			// need to respond to flag fields being added and removed.
			//  when a flag gets added, there needs to be the flag's connected function.
			
			//.flags().selected?
			//.flags('selected');
			
			// .selected(true); .selected(1);
			
			// can leave the flags unconnected for the moment, and return to the flags connection so there is 
			//  easier syntax and probably faster code.
			
			// but want it so we know when flags have changed (the collection of flags)?
			
			// also when any flags' value has changed.
			
			// can quite simply add and remove flags from an object.
			//  also may pay some attention to a restricted list of flags, where if the flags are not set then we know
			//  the values are false.
			
			// want to make it easy to deal with flags that correspond to css as well.
			
		},
		*/
		// or an enhanced version of the set function that deals with more input processors?
		//  Or have the supercalssed set function send mack the input processors in parameters.
		//   I think that is the best option.

		'_get_input_processors': function() {
			//throw 'stop';
			return jsgui.input_processors;
		},
		'add_flag': function(flag_name) {
			var flags = this.get('flags');
			//console.log('flags ' + stringify(flags));
			var fields = this.fields();
			//console.log('fields ' + stringify(fields));
			// unfortunate that no fields are found???
			//  should probably be a few.
			if (!flags.has(flag_name)) {
				flags.add(flag_name);
			}
		},
		'remove_flag': function(flag_name) {
			var flags = this.get('flags');
			//console.log('flags ' + stringify(flags));
			//throw 'stop';
			var has_flag = flags.has(flag_name);
			//console.log('has_flag ' + has_flag);
			
			if (has_flag) {
				flags.remove(flag_name);
				console.log('flags ' + stringify(flags));
				
				flags = this.get('flags');
				console.log('flags ' + stringify(flags));
				//throw 'stop';
			}
			
		},
		'has_flag': function(flag_name) {
			var flags = this.get('flags');
			return flags.has(flag_name);
		},
		
		// copied from Data_Object because Data_Object was not able to deal with collections within itself.
		//  code works, but should make this call data_object code where possible.
		
		'get': fp(function(a, sig) {
			// More difficult to maintain with the separate get code.
			//  Handle specific cases here, otherwise use _super.

			// In some cases, an automatically constructed object, like a control_dom, should have fields.

			// but when nested is in place, is it still working right?
			// also will have to deal with particular output formats.
			//  many controls / data types for the moment will have default output as HTML formatted.
			//console.log('Data_Object get this.__data_type_name ' + this.__data_type_name);
			//console.log('Enhanced_Data_Object get a ' + stringify(a));
			//console.log('Enhanced_Data_Object get sig ' + sig);
			// will also be looking at the output processors.
			//console.log('this.__data_type_name ' + this.__data_type_name);
			if (is_defined(this.__data_type_name)) {
				// should possibly have this assigned for controls...
				//var raw_input = a;
				//console.log('this.__data_type_name is defined: ' + this.__data_type_name);
				
				//var parsed_input_obj = jsgui.input_processors[this.__data_type_name](raw_input);				
				//this._super.apply(this, a);
				do_get.apply(this, a);

			} else {
				// check to see if there is a field defined.
				if (sig == '[s]') {
					//console.log('get param: ' + a[0]);

					if (!this.fc) this.fc = new Fields_Collection({
						// 
						//'containing_object': this
					});

					var fc = this.fc;

					//console.log('fc ' + (fc));

					//console.log('fc.get() ' + stringify(fc.get()));
					var field_name = a[0];
					//console.log('field_name ' + field_name);
					//console.log('this.fields() ' + stringify(this.fields()));
					// could have .s in it, making it nested, and have removed nested from here.
					//console.log('pre fc get');
					var field = fc.get(field_name);
					//console.log('EDO field ' + stringify(field));

					if (field_name.indexOf('.') > -1) {

						//console.log('EDO get has field ' + field_name);

						// Then we are dealing with a request for a nested object.
						// Split up the field_name into the various field names for the levels, then have a recursive function here
						//  process through the levels. Will keep the recursive part small in size and located here.
						// May not need to even be recursive.
						var arr_field_names = field_name.split('.');
						
						var level = 0, l = arr_field_names.length;
						var current_obj = this, new_obj, fname;
						while (level < l) {
							fname = arr_field_names[level];
							new_obj = current_obj.get(fname);
							//console.log('fname ' + fname);
							
							// So, when the dom object is obtained, it should have its own fields.
							//  The 'get' function will need to be modified to return objects of the right type / class.
							
							//console.log('new_obj ' + stringify(new_obj));
							//console.log('current_obj ' + stringify(current_obj));
							
							level++;
							current_obj = new_obj;
						}
						return current_obj;
					}
					
					//console.log('field ' + stringify(field));
					
					// fields seem to stop having been set up properly.
					
					//console.log('field ' + (field));
					

					//console.log('* field_name ' + field_name);
					//console.log('* field ' + stringify(field));
					

					if (field) {
						// May not be able to stringify the field object without making an infinite loop / call stack error.
						//console.log('this._[field_name] ' + stringify(this._[field_name]));
						//console.log('field_name ' + field_name);
						// So the DOM attributes were not created properly.




						if (!this._[field_name]) {
							//console.log('does not have field already');
							
							var sig_field = get_item_sig(field, 20);
							//console.log('');
							//console.log('---------------');
							//console.log('');
							//console.log('enhanced data_object sig_field ' + stringify(sig_field));
							//console.log('field ' + stringify(field));
							
							//console.log('sig_field ' + sig_field);


							if (sig_field == '[s,[s,u]]') {
								// it looks like it has gone wrong.
								var stack = new Error().stack;
								console.log(stack);
							}
							
							// ss?
							// s,s,b
							//  the last param is the default value???
							//   not right now.

							if (sig_field == '[s,s,o]') {
								var field_name = field[0];
								var field_type_name = field[1];

								// default_value?

								var field_info = field[2];
								
								//console.log('field_type_name ' + field_type_name);
								


								if (field_type_name == 'collection') {
									//console.log('lazy loading - creating new collection');
									this._[field_name] = new Collection({
										'context': this._context
									});
									return this._[field_name];
								} else {
									// if it's just a string?
									if (field_type_name == 'ordered_string_list') {
										var osl = new Ordered_String_List();
										this._[field_name] = osl;
										return this._[field_name];
									} else if (field_type_name == 'string') {
										// use a Data_Value?
										// Data value with no context?

										//var dv = new Data_Value({
											//'context': this._context
										//});
										// Tell the Data_Value it's a string only?
										// context?
										var dv = new Data_Value({
											'context': this._context
										});

										if (field_info.default) {
											dv.set(field_info.default);
										}


										//dv.set()
										
										this._[field_name] = dv;
										dv.parent(this);
										return this._[field_name];
									} else {
										//console.log('');
										//console.log('field_type_name ' + field_type_name);

										var default_value = field_info.default;
										//console.log('')



										//var dtoc = this.mod_link().ensure_data_type_data_object_constructor(field_type_name);
										var dtoc = ensure_data_type_data_object_constructor(field_type_name);
										
										var context = this.context;
										if (context) {
											var field_val = new dtoc({'context': this._context});
										} else {
											var field_val = new dtoc();
										}
										if (is_defined(default_value)) {
											field_val.set(default_value);
										}
										
										//throw 'stop';

										field_val.parent(this);
										this._[field_name] = field_val;
										return this._[field_name];
									}
								}
								
							} else if (sig_field == '[s,s]') {
								//console.log('!!!!!');
								//console.log('field ' + stringify(field));
								var field_name = field[0];
								var field_type_name = field[1];
								
								//console.log('field_name ' + field_name);
								//console.log('field_type_name ' + field_type_name);
								
								// perhaps getting collection fields should be moved to enhanced_data_object?
								//  not keen on interdependencies here.
								
								if (field_type_name == 'collection') {
									
									// lazy creation of fields.
									
									//throw 'not supported here. should use code in enhanced-data-object.
									
									// So, Collection has been added to jsgui by now.
									//console.log('pre make coll');
									
									// Maybe Collection has not been added to jsgui.
									//  Need to ensure it does get added when it's getting used.
									
									// seems like the Collection object does not get put back on this...
									//  or at least not always.
									
									// looks like we use the module as it is.
									
									var coll = new jsgui.Collection({
										'context': this._context
									});
									
									//console.log('pre set coll parent');
									coll.parent(this);
									
									this._[field_name] = coll;
									return this._[field_name];
									
								} else if (field_type_name == 'control') {
									// want to put the control in place basically.
									//  but it the control is not there, we can't get it.
									// no lazy loading of controls like for other data items.
									return undefined;


								} else if (field_type_name == 'string') {
									var dv = new Data_Value();
									dv.parent(this);
									this._[field_name] = dv;
								} else {
										// 

									// a different function?
									//  we could look for the input processors?
									// Then use the input processor to create a Data Object or Data Value.
									var input_processors;
									var data_type_info;
									var module_jsgui = this._module_jsgui;
									//console.log('module_jsgui ' + module_jsgui);

									// Need a way to get back to the common jsgui module.


									if (module_jsgui) {
										input_processors = module_jsgui.input_processors;
										data_types_info = module_jsgui.data_types_info;

										//console.log('data_types_info ' + stringify(data_types_info));

										// so we may have the information needed to construct such a Data_Object.

										// This needs to be set in various objects.


										// Shoudl make be careful to ensure these exist...
										//  Need the constructor for the control_dom object.

										// Perhaps doing a sub-project on the data system is worth it?
										//  Or do that once the basis is working for HTML serving?


										// but will we have data object constructors for this yet?
										object_constructor = module_jsgui.map_data_type_data_object_constructors[field_type_name];

										//console.log('object_constructor ' + stringify(object_constructor));

										// ensure_data_type_data_object_constructor
										//  that is used where we have the data type definition for that data type.

										// and look at the data types object constructors?
										//  or data types constructos.
										if (object_constructor) {

											var obj = new object_constructor({'context': this._context});
											obj.parent(this);
									
											this._[field_name] = obj;
											return obj;
										}


										//throw 'stop';
									};

									//console.log('input_processors[field_type_name] ' + input_processors[field_type_name]);
									// so we may have an input processor for the data.
									//  However, we may also have information about how to construct a data object with the data.

									// not just the input processors... we need the data type info.

									// data_type_info



									//if (input_processors[field_type_name]) {
									//	var processed_value = input_processors[field_type_name]()

									//}

									// OK, but this will need to actually create a new constructor for an empty object, and set it in place.
									//  We have some kind of a linking to the later modules.
									// Need to do some kind of back-referencing because we don't have global variables.
									//  _module_jsgui will be enough for now.
									//   It should get overwritten before object construction, so should be at an advanced level with
									//    instances of advanced objects.
									//   May be removed when JS is put into one large code file.

									// I think defining data type object constructors may make sense...
									//  Like for an indexed array?




									// dtoc = this.mod_link().ensure_data_type_data_object_constructor(field_type_name);
									//console.log('dtoc ' + dtoc);
									
									// then use this to construct the empty field.
									//  without the new constructor it was trying to make an abstract version!!!
									//var obj = new dtoc({'context': this._context});
									//if (this._context) obj._context = this._context;
									//obj.parent(this);
									
									//this._[field_name] = obj;

								}

									//console.log('this._ ' + stringify(this._));
									
								return this._[field_name];
								
							} else if (sig_field == '[s,[s,s]]') {
								var field_name = field[0];
								var field_info = field[1];
								

								//console.log('field_info ' + stringify(field_info));
								
								if (field_info[0] == 'collection') {
									var collection_type_name = field_info[1];
									var ncoll = new jsgui.Collection({'context': this._context});
									ncoll.parent(this);
									this._[field_name] = ncoll;
									return this._[field_name];
								}
							} else if (sig_field == '[s,[s,o]]') {
								// [fieldName,['collection', objDef]]

								// eg field ["entries", ["collection", {"address": "string", "family": "string", "internal": "boolean"}]]
								// it's a collection?? (check, with the particular data type)

								var field_name = field[0];
								var field_info = field[1];
								var data_type_name = field_info[0];

								if (data_type_name == 'collection') {
									var objDef = field_info[1];
									//throw 'not supported here. should use code in enhanced-data-object.';

									// Need to do more than this.
									//  Defining a collection with a specified data type.
									var ncoll = new jsgui.Collection({'context': this._context});
									// Specifying a collection constraint as well (perhaps these are fields for the obejcts)
									//  I think calling it a collection constraint with specified fields for the objects makes
									//  sense.
									console.log('objDef ' + stringify(objDef));
									// will be an object rather than array (for now at least)

									// Not sure about setting through fields...
									ncoll.fields(objDef);
									// that should set the constraint as well.
									//ncoll.

									// Specifying fields on a collection.
									//  Need to say itemFields, as a collection itself could have fields as well as
									//   items contained? Or the collection's fields apply to each item.


									
									//var ncoll = new jsgui.Collection(collection_type_name);
									if (this._context) ncoll._context = this._context;
									
									ncoll.parent(this);
									this._[field_name] = ncoll;
									return this._[field_name];
								}

							}

						} else {
							return this._[field_name];
						}
					} else {
						//console.log('this._ ' + stringify(this._));

						var res = ll_get(this._, a[0]);
						//console.log('res ' + res);

						//if (!is_defined(res)) {
							// No, don't thin we just create a new one. It may need to get overwritten by some other code.



							//res = new Enhanced_Data_Object({'context': this._context});
						//}

						//console.log('property_name ' + property_name);
						//console.log('res ' + res);
						return res;
					}
				} else if (a.l == 0) {
					return this._;
				}
			}
		})


		
		// oh but this is treated differently...
		//  may wish to set the flags property?
		
		// need a different name for this?
		// or just don't need that function with flags connected?
		
		/*
		
		'flags': fp(function(a, sig) {
			if (sig == '[s,b]') {
				var flags = this.get('flags');
				console.log('flags ' + stringify(flags));
				
				
			}
			
		})
		*/
		
		// OK, but we may also want some of these fields to work with css as well.
		
		// When defining css flags in the Control... they are normal flags, but they also
		//  have a corresponding css class. 
		
		// data_object.flag_item(true);
		// data_object.flag_item(false);
		// data_object.flag_item('toggle');
		//  data_object.flag_item(-1); ??? looks confusing. but could be ok.
		
	});
	
	// Data_Object.extend = function(prop, namespcExtension, propsToMerge) {
	
	Enhanced_Data_Object.extend = function(prop, namespcExtension, propsToMerge) {
		//var res = Data_Object.extend(prop, namespcExtension, propsToMerge);
		var res = Data_Object.extend.call(this, prop, namespcExtension, propsToMerge);
		// but the fields are not going in properly.???
		// quite possibly need to set up the fields (_fields on the Enhanced_Data_Object object.
		// but need to merge the properties from this...
		// but also need to look out for the flags.
		// if in the prop or map_props there is something called 'flags' we need to pay attention.
		//  That will then get put in the prototype (or constructor?)
		/*
		for (var name in prop) {
			
		}
		*/
		if (prop.flags) {
			//res[
			res._flags = prop.flags;
		}
		return res;
	}


	jsgui.ensure_data_type_data_object_constructor = ensure_data_type_data_object_constructor;

	Enhanced_Data_Object.map_data_type_data_object_constructors = Data_Object.map_data_type_data_object_constructors;
	Enhanced_Data_Object.Mini_Context = Data_Object.Mini_Context;
	
	Data_Object.set_Enhanced_Data_Object(Enhanced_Data_Object);

	Enhanced_Data_Object.register_data_type = register_data_type;


	// jsgui-html-core.js

	extend(jsgui.data_types_info, {
        'border_style': ['any', ['solid', 'dotted', 'dashed']],
        'distance': ['n_units', 'px'],
        'single_border': ['indexed_array', [
            ['width', 'distance'],
            ['style', 'border_style'],
            ['color', 'color']
        ]],
        'border': ['oltrb', 'single_border'],
        'margin': ['oltrb', 'distance'],
        'size': ['indexed_array', ['distance', ['width', 'height']]],
        'control_collection': ['DataCollection', 'control'],

        // Defining the types that things will get automatically created as.
        'dom_attributes': 'ordered_string_list',

        //'dom_attributes': {
            //'class': 'Ordered_String_List'
        //    'class': 'ordered_string_list'

        //},
        // these are its fields.
        //  should be able to build a control_dom constructor function.
        'control_dom': {
            'node': 'object',
            'attributes': 'dom_attributes',
            'tagName': 'string'
        },
        'control': {

            // Another type of style inside here?
            'style': 'style',
            // that may be automatically done from its relationship to its parent.
            //'index': 'int',
            // It maybe has an ID anyway as a jsgui Data_Object.
            //  But I think this signifies it? Not sure.
            'id': 'context_id',
            //'controls': 'control_collection',
            // content collection.
            'dom': 'control_dom',
            'class_name': 'string'
            // css_class in the dom attributes. style is inline style-like thing.
            //  style will also be used for building and modifying actual css files or setups.

        },
        'style': {
            // an object declaration, not array. can have various things inside
            //'border': ['oltrb', 'single_border'],
            // top, left etc

            // Want CSS to work by default, but will have some overrides / parsing / reinterpretation.



            'border': 'border',
            'margin': 'margin',
            // when dealing with 'any': there may need to be a map that says if a value is contained.
            //  could even store these maps in a tree. would use something like 'ensure'
            'cursor': ['any', ['auto', 'crosshair', 'default', 'e-resize', 'help', 'move', 'n-resize', 'ne-resize', 'nw-resize', 'pointer', 'progress', 's-resize', 'se-resize', 'sw-resize', 'text', 'w-resize', 'wait', 'inherit']]
        }
    });

    // Want an underlying system that represents CSS well.
    //  Making it a lot easier to work with CSS, as it is in the browser.
    //  On top of that we have another style layer. Maybe jsgui-style? A different way of interacting with the style system.
    //  It may be that some .style instructions will be interpreted to go through the jsgui style layer.
    //   When setting border-radius in a Page_Context that does not support it.





    
    Enhanced_Data_Object.register_data_type('control_dom', jsgui.data_types_info['control_dom']);
    Enhanced_Data_Object.register_data_type('dom_attributes', jsgui.data_types_info['dom_attributes']);
    //jsgui.populate_all_dt_maps();
    //  data type maps
    //   likely to have maps created as needed and cached.

    // May have a Data_Type_System that encloses these Data_Types.
    ensure_data_type_data_object_constructor('control_dom');
    

    // also a processor for distance?
    //  a curried function for n_units basically?

    jsgui.input_processors['distance'] = function (input) {
        // use the n_units processor, but with 'px'
        return jsgui.input_processors['n_units']('px', input);
    };
    // not sure about using oltrb right now. Could compress by having a single arr_ltrb variable.
    jsgui.input_processors['margin'] = function (input) {
        return jsgui.input_processors['optional_array'](['left', 'top', 'right', 'bottom'], 'distance', input);
    };

    jsgui.input_processors['size'] = function (input) {
        // use the n_units processor, but with 'px'
        return jsgui.input_processors['indexed_array'](['width', 'height'], 'distance', input);
    };


    //console.log("jsgui.input_processors['color'] " + jsgui.input_processors['color']);

    // just a string in the constructor - looks fine for the type.
    //  likely to be using some namespaced type system eventually, but this is my namespace for the moment.

    // and output the color to HTML.

    // and may have the various output processors for margin (oltrbs?) and other things, outputting to HTML.
    //  Some of them may output to other shim controls, or similar.
    /// Will eventually output to HTML.

    // Need the lower level style system working.
    //  On top of that, the jsgui style system will be built.



    jsgui.output_processors['string'] = function (value) {
        // need to escapr it
        return value;
    }

    // Will require other code as well.

    var get_inline_css_dict_from_style = function (style, page_context) {
        //console.log('get_inline_css_dict_from_style ' + stringify(style));

        var style_info = jsgui.data_types_info['style'];


        // should have the style data type info
        //  then for each property we get the data type info for that, and then use its output mechanism.

        var css_style_dict = {};
        each(style, function (i, v) {
            //console.log('style i ' + i);

            // TODO - May not just be a name but could directly be the info. Could use a loader function perhaps.
            var dt_info_style_item_name = style_info[i];
            //console.log('dt_info_style_item_name ' + stringify(dt_info_style_item_name));

            var dti_style_item = data_type_instance(dt_info_style_item_name);

            //console.log('*v ' + stringify(v));

            var style_rule = dti_style_item.output(v);

            //console.log('style_rule ' + stringify(style_rule));
            //console.log('tof(style_rule) ' + tof(style_rule));
            if (tof(style_rule) == 'string') {
                css_style_dict[i] = style_rule;
            } else {

                // could probably use extend here.

                each(style_rule, function (subrule_name, subrule_value) {
                    css_style_dict[subrule_name] = subrule_value;
                });

            }

            //apply_jsgui_style_rule_to_css_style(css_style_dict, i, v);
        });
        return css_style_dict;
    };

    var apply_jsgui_style_rule_to_css_style = function (style, style_rule_name, style_rule_value) {
        //console.log('apply_jsgui_style_rule_to_css_style style_rule_name ' + style_rule_name);

        // it's probably going to use dti and output.

        // Will be changing the way that styles get calculated.
        // Going to create some new functions that get used in the rendering.
        //  Will get help from data_types_info.

        //console.log('fns_jsgui_style_item_to_inline_css_item[style_rule_name] ' + fns_jsgui_style_item_to_inline_css_item[style_rule_name]);

        // this way of doing things will change.
        //  going to do some kind of get_style.

        // More of it will be computed through lang and the data_types system.

        if (fns_jsgui_style_item_to_inline_css_item[style_rule_name]) {
            var inline_style_dict = fns_jsgui_style_item_to_inline_css_item[style_rule_name](style_rule_value);
            //  but could we get more than one style item in the dict?

            each(inline_style_dict, function (i2, v2) {

                style[i2] = v2;
            });
        }
    };

    var styles_dict_to_string = function (styles_dict) {

        // OK... some improvements will need to be made.
        //  will need to upgrade the styles / size / pos setting code.
        //console.log('styles_dict ' + jsgui.stringify(styles_dict));

        var res = '',
            first = true;
        each(styles_dict, function (i, v) {

            if (typeof v == 'number') {
                v = v + '';
            }

            if (typeof (v) != 'string') {
                //var stack = new Error().stack;
                //console.log('stack ' + stack);
                //console.log('i ' + i);
                //console.log('v ' + v);
                //console.log('typeof v ' + typeof v);
                throw 'jsgui: styles_dict_to_string: Only string css styles supported. Jsgui styles must be translated to css before use here.';
            } else {
                res = res + i + ': ' + v + ';';
            }
        });
        return res;
    };

    // JSGUI event binding functions.

    var _bind_dom_event = function (dom_node, event_name, fn) {

        // return unbind function. ???

        var unbind = _unbind_dom_event(dom_node, event_name, fn);
        return unbind;
    }

    var _unbind_dom_event = function (dom_node, event_name, fn) {

    }



    



    // And Core, of course
    //  Likely to rename this 'Control' or 'control' - probably 'Control'.

    // Now it is in this file it will be easier to modify by itself.
    // More rendering to be handled through the Data_Object capabilities.
    //  Could be the output type of various different things.

    // Maybe we need more testing of controls, there seems to be a problem which I need to fix to do
    //  with fields not being found in the file system control.

    // Perhaps I could investigate that control outside of a server.

    // This needs more work on its style system.
    //  Need to quickly and easily change conformant style rules.
    //   There will be a CSS overrides system, but generally the CSS and styling of the Control should follow normal CSS.
    //    In some cases the output CSS will not match the input styling rules,
    //     there may be shortcuts for convenience, and it will accept more expressive language than CSS (hopefully)
    //  But do want full css support.

    // control.style('background-image', 'url(...)');
    //  but will have input filters in case a url is not given in that format?


    // I think this will take quite a lot more work to fully make the CSS / style API.
    //  However, we most want to be able to set the style property of an object to give it styles.

    // It needs to work with a variety of styles.
    //  Needs to access the local CSS inline dict...
    //   though could possibly work with a Collection?

    // dom.attributes.style
    //  I think it makes sense to have that available as a string to set...
    //   however, I think dom.attributes._style makes sense.

    // want to access the inline style dict.

    //  will also apply input transformations in some cases.
    //  may apply output transformations when rendering.

    // Possibly the style system could do with some separate work and testing.
    //  We want it so that in old IE rounded edges can be emulated with VML.


    // dom.attributes.style is literally the style attribute as a string?
    //  no special case there?
    //   however, there will be a system of dynamically creating this in as its needed in some cases.

    var edo_init = Enhanced_Data_Object.prototype.init;
    var do_init = Data_Object.prototype.init;
    //var do_init_call = Data_Object.prototype.init.call;

    // Will also use reusable local variables.
    //  May be a bit experimental! Should do less assignment & garbage collection.

    var that, dom, flags, css_flags, spec_content, tsc, arr, res, dom_attrs;

    // Link tag needs to have no closing tag.

    // This should have more for the client side.
    //  

    // For drag and drop:
    //  Best to use the existing API. Have a layer on top of that.
    // Then for mobile (iOS, Blackberry? Android) have an implementation that is a bit like the HTML implementation.
    // Then have a nice, convenient layer on top of both.

    // Drag, rearranging seems really useful.
    // May need to interact with server objects when doing the rearrangement, need a clear division between rearrangement
    //  UI and the actions it carries out.

    // Basically say something is draggable
    // Don't assume it drags itself, there may be a handle
    // Allow the drag item to be something representing some data in terms of model
    // Allow the drag item to be a ghost view of the item being dragged
    // Work so that example with the separate items grouping together works.




    // Perhaps have some kind of html enhancements module?

    


    // Control could benefit from composition methods and definitions.
    //  They define the composition of controls.
    //   May contain inner controls. These get created when necessary.


    // Also need a good system for drag and drop events.
    //  Need to recognise drag starts at first.

    // Dragging something that is already selected.

    // Selecting something on the beginning of the drag.



    // Also want to be able to make shallow copies / clones of controls.
    //  Probably won't have connection to data.
    //   For short term use in dragging.

    // will copy all the dom attributes and tags, nodes.
    //  could be a control?
    //   including subcontrols... could make a bunch of new controls as the copy.
    //    That may be best to have the same effects / to enable effects.


    var parse_style_attribute_to_map = function(str_style) {
        str_style = str_style.replace(/; /g, ';');
        str_style = str_style.replace(/: /g, ':');
        var rules = str_style.split(';');
        var rule_nvps = [];
        var map_rules = {};
        each(rules, function(i, rule) {
            if (rule) {
                var sRule = rule.split(':');

                rule_nvps.push(sRule)
                map_rules[sRule[0]] = sRule[1]
            }
            
        })

        //console.log('rule_nvps ' + stringify(rule_nvps));

        //console.log('map_rules ' + stringify(map_rules));

        return map_rules;
    }

    var style_attribute_map_to_string = function(map_style) {
        var arr_res = [];
        var first = true;
        each(map_style, function(i, v) {
            if (!first) {
                arr_res.push(';');
            }

            arr_res.push(i);
            arr_res.push(':');
            arr_res.push(v);


            first = false;
        })
        return arr_res.join('');
    }

    // Deferred rendering is going to be a fairly major feature.


    var getStyle = function (el, property_name) {
        
        if (el.currentStyle)
            var y = el.currentStyle[property_name];
        else if (window.getComputedStyle);
            var y = document.defaultView.getComputedStyle(el, null).getPropertyValue(property_name);
        return y;
    }


    var Control = Enhanced_Data_Object.extend({

        'fields': [
        // This may be a good way of expressing collections, works in JSON.
        //['content', ['collection', 'control']]

        // need to make sure that the fields makes these with the right contexts.

        // Say it's a collection of controls?
            // Could possibly have an inner content?
            //  Inner control?
            //  And that inner control's content is the inner content.
            //  Not all will have an inner control.
            //   Could check a control to see if it has it.
            //   Add will add to the inner control.

            ['content', 'collection'],
            ['dom', 'control_dom'],

            // What are the CSS flags?
            //  Should this use the flag system?
            //  We will have flags that determine CSS styling.
            //   But do we have flags that directly are CSS properties / configurations, either on or off?

            ['css_flags', Collection(String)]
            // context as a field?
            //  or is context handled by Data_Object?

        ],
        'connect_fields': true,

        // Don't want to use this much. Should probably override functions instead.
        'mod_link': function () {
            return jsgui;
        },

        // Style does Data_Object.set('style')
        //  so need to be careful about this style object.
        //   Will need to refer to it when rendering.

        // There will be the jsgui-style, but I think having normal style as the default is best, and that will get
        //  overridden in some circumstances.


        // We are likely to need a better style function in HTML.

        // may be good in some ways having it work as a field.

        // Keep dom.style.attributes as it is, but modify that when changing inline styles.




        'init': function (spec) {

            // but process / normalize the spec here?

            spec = spec || {};
            //spec.nodeType = spec.nodeType || 1;
            //console.log('pre super init');
            //this._super(spec);

            //do_init_call(this, spec);
            this.mapListeners = {};
            do_init.call(this, spec);


            //console.log('post super init');

            this.__type_name = 'control';
            this.__type = 'control';

            if (!this._abstract) {


                /*
                this.add_event_listener('set', fp(function (a, sig) {
                    //console.log('control event set sig ' + sig);
                    //throw 'stop';
                    // a flag could have been set.
                }));
                */

                // need to listen for changes in the flags and maybe some other properties.
                //  css classes will be added and removed using these flags.

                // will also have this responding to the addition and removal of css flags.
                //  css flags will correspond to a normal flag, so setting a css flag creates the normal flag too
                //  removing the normal flag removes the css flag if there is one.
                //  removing the css flag removes the normal flag if there is one.

                //  could have a list of css_enabled_flags so that whenever the normal flag version is switched on, it switches on
                //   the css flag as well.

                // may have a fairly convenient interface for receiving these flags (for instances ans for classes)
                //  and have some complexity inside, but making it as simple for the end developer as possible, while also
                //  enabling event responses to work as well.

                //flags = this.get('flags');
                //css_flags = this.get('css_flags');

                //var flags = this.get('flags');
                //var css_flags = this.get('css_flags');


                //var that = this;
                //that = this;

                //console.log('pre get dom');

                // abstract controls don't have the field instances.
                //  but they could have settings or a spec.
                // Maybe abstract Data_objects could retain their spec,
                //  then not do the normal constructor.

                //console.log('this.fields() ' + stringify(this.fields()));
                // the chained fields?
                //  have the fields not been initialised properly?
                //var chained_fields = jsgui.get_chained_fields(this.constructor);
                //console.log('chained_fields ' + stringify(chained_fields));
                //console.log('pre get dom');
                //var dom = this.get('dom');

                //dom = this.get('dom');
                //dom.set('tagName', 'div'); // Though may depend on spec...

                var tagName = spec.tagName || spec.tag_name || 'div';

                this.set('dom.tagName', tagName);

                this._icss = {};
                //this._.dom = {'tagName': 'div'};

                // Abstract controls won't have 

                //console.log('dom ' + stringify(dom));

                // The DOM is a field that it should be getting from the control.
                spec_content = spec.content;
                if (spec_content) {
                    tsc = tof(spec_content);
                    if (tsc == 'array') {
                        throw 'Content array not yet supported here.'
                    } else if (tsc == 'string' || tsc == 'control') {
                        this.content().add(spec_content);
                    }

                }

                if (spec.el) {
                    this.set('dom.el', spec.el);
                }

                var that = this;

                if (spec.size) {
                    var size = spec.size;
                    var t_size = tof(size);
                    if (t_size == 'array') {
                        var width = size[0];
                        var height = size[1];

                        // far from ideal
                        //  Really should set inline styles separately.
                        //  I had lost some of the JSGUI style system before because I redid control based on Data_Object, it may have got too complicated before though.
                        //  

                        // Want to be able to access css styles.
                        //  Want to be able to access styles on a different level though - things which may not be supported by CSS directly.
                        //  Will do things more based on the CSS standard where possible, and shifting to use other methods when not possible.





                        this.set('dom.attributes.style', 'width: ' + width + 'px; height: ' + height + 'px;');

                        // Needs to set inline styles.
                    }
                }

                if (spec['class']) {
                    this.set('dom.attributes.class', spec['class']);
                }


                // When content gets added, need to update the relationships. 

                // Perhaps change is the better event to use.

                //  And then within the change event there are more details.
                //  Fewer event listeners to add.

                // 

                var content = this.get('content');
                content._parent = this;
                
                content.on('change', function(e_change) {
                    //console.log('Control content e_change', e_change);

                    // This gets called on both the client and the server.
                    //  With controls that get activated


                    /*
                    if (e_change.type == 'insert') {
                        // then we need to insert it into the DOM

                        var el = that.get('dom.el');
                        //var p = el.parentNode;
                        var itemDomEl = e_change.item.get('dom.el');
                        console.log('e_change.item._context', e_change.item._context);
                        if (!itemDomEl) {
                            //itemDomEl = e_change.item._context.document.createElement(e_change.item.get('dom.tagName'));
                            // render the 

                            var temp_div = e_change.item._context.document.createElement(e_change.item.get('div'));
                            temp_div.innerHTML = e_change.item.all_html_render();
                            itemDomEl = temp_div.childNodes[0];

                            e_change.item.set('dom.el', itemDomEl);
                        }
                        // If the item does not yet have a DOM element, we could create one automatically.
                        //  It does not always have to be about using innerHTML.

                        // Sometimes a control may need to create a DOM node by itself.
                        //  Or a document fragment?

                        // Need a reliable mechanism for creating the DOM node in some other contexts.
                        //  It won't necessarily always be there already, it will be necessary to create dom nodes on the
                        //  fly.

                        // The page_context should have the document object I think...

                        
                        // Probably should have a context I think.




                        console.log('itemDomEl', itemDomEl);
                        el.insertBefore(itemDomEl, el.childNodes[0]);

                    }
                    */

                    // Need to update the DOM to reflect the change.



                })
                

                /*
                this.get('content').add_event_listener('add', function(e_content) {
                    // Slows it down too much?

                    //console.log('control content add ' + stringify(e_content));

                    // Not doing anything here yet...
                    //  but if we have an element we can update the dom.
                    //  active property in the closure as variable - would speed things up.






                    //console.log('control content add event');

                    var target = e_content.target;
                    var item = e_content.item;
                    var position = e_content.position;

                    // could use get and set parent properties?
                    //  may make more sense in terms of consistancy.
                    //  maybe not with speed.

                    // index as a property?

                    // the target may be the collection.
                    //item._.parent = target;
                    
                    item._.parent = that;
                    item._.index = position;

                    //console.log('tof e_content ' + tof(e_content));

                    //console.log('e_content ', (e_content));

                    var item = e_content.item;

                    var el;

                    var ctrl_el = that.get('dom.el');
                    //console.log('ctrl_el ' + ctrl_el);

                    if (item.__type == 'control' && item.get) el = item.get('dom.el');

                    if (ctrl_el && el) {
                        // The element may have been given in the constructor, and the content being added is actually
                        //  already in the DOM.
                        //console.log('content being added has el');

                        //console.log ('that.__activating ' + that.__activating);

                        // does the element have a parent node?
                        //  is the element's parent node already this control's node?

                        var content_parent = el.parentNode;

                        if (content_parent == ctrl_el) {
                            //console.log('already in ctrl');
                        } else {
                            //console.log('not in ctrl');
                            //console.log('ctrl_el ', ctrl_el);
                            //console.log('el ', el);

                            // Not so sure we want it on the ctrl like this?



                            ctrl_el.appendChild(el);
                        }




                        //console.log('control content add event has el');

                        // Something to indicate that we want the added content to be appended in the dom?

                        // I think that would make the most sense, explicitly asking for it.

                        // However, need to get parameters through.



                        // don't want to be doing this when controls are initializing or activating.
                        //  this could have been done in response to the user doing something that causes the DOM to change
                        //throw 'stop';


                    }

                    //item.__parent = target;
                    //item.

                }); 
                */



                //if (spec.content)

                //throw 'stop';
                // This seems to cause an infinite loop.
                //  Maybe that has to do with updates...

                // should have the dom set up as a field already.
                //  may have to run some (more) tests on fields.

                // Why is this not working in some cases?
                //  Was a problem with get function?
                //console.log('dom ' + dom);
                //console.log('this.fields() ' + stringify(this.fields()));

                

                // OK, so why are fields suddenly not working here?

                // Maybe could make a setupDefaultEvents function to avoid the closure here.




                //var flags = this.get('flags');

                // Perhaps the normal Data_Object event listeners will do?

                /*
                this.add_event_listener('remove', function (e) {
                    //console.log('e ' + stringify(e));
                    //throw 'stop';

                    if (e.target == css_flags) {
                        //throw 'stop';

                        var css_flag_name = e.item.value();
                        //this.remove
                        //console.log('css_flag_name ' + css_flag_name);
                        //throw 'stop';

                        that.remove_flag(css_flag_name);

                        //console.log('flags ' + stringify(flags));

                        // also add or remove the css class...
                        //  will actually re-render the css class.
                        //  set the value.


                        // render the dom attributes css style.

                    }

                    //console.log('flags ' + stringify(that.get('flags')));

                    //throw 'stop';

                });


                // dom_attributes
                // dom_attributes.class

                this.add_event_listener('change', function (e) {
                    console.log('change event e ' + stringify(e));

                    // raise the change event in the parent. ??
                    //  would that lead to a multiplying cascade?
                    //   bubble happens with specific events, change for convenience?

                    //console.log('e.target ' + stringify(e.target));
                    //throw 'stop';
                    if (e.target == css_flags) {
                        //console.log('change to css_flags');
                        var item = e.item;
                        // this is the value that has been changed  - added or removed?

                        var event_name = e.event_name;

                        if (event_name == 'add') {
                            var name_css_flag_added = item.value();
                            //console.log('name_css_flag_added ' + name_css_flag_added);

                            that.add_flag(name_css_flag_added);

                        }
                        if (event_name == 'remove') {

                            //var name_css_flag_removed = item.value();
                            //console.log('name_css_flag_removed ' + name_css_flag_removed);

                            //that.add_flag(name_css_flag_removed);
                        }
                        //var event_name = e.event_name;
                        //console.log('event_name ' + event_name);

                        //var stack = new Error().stack
                        //console.log(stack)
                        //throw '!!! stop';

                        // OK, nice, so we have got here.

                    }
                });

                */
                
            }

            // but can the rest be skipped if this is abstract?
            //  with abstract Data_Objects or controls, don't call the normal constructor?

            //  we need to keep the spec.


            // FIX / Clarify
            
            // __type
            //if (spec.page_context) {
            //	this._.page_context = spec.page_context;
            //}
            //if (spec.context) {
            //	this._context = spec.context;
            //}

            //this.content = this.get('content');
            // should connect the content field with connect_fields = true;
            // need to have this listen for some changes.
            //  changes in flags being an important one.

            // some flags will also correspond to css classes which get toggled.
            //  such as 'hidden' or 'selected' or maybe 'clearall'.

            // Think we need something that listens for content being added (or removed).
        },

        // Needs activate, and behaviour fields (or similar).

        // ctrl.set('hover-class', 'hover');
        //  Want this to respond to state changes.
        //  that will be the in and out functions on the element.
        // May be better to do the hover event functions because it could work accross more browsers.
        //  Also, for the drag and drop, we'll need to know what's being picked up... could do that in another way.

        // Configure what is draggable
        //  That would be on the editable version.
        //  Perhaps on this version we allow drag starts?



        // Configure how the parts of the components recieve drops.
        //  Don't want things to be changing all over the place in response to changes.
        //  When something gets picked up, grey out its place in the document.
        //   Put a fairly small placeholder in the document to show where it could go.

        // Probably should implement my own drag and drop interface so it works on mobile.
        // In the editor version, various controls will have a opetions for drag and drop.

        // Will want some encapsulation for drag and drop, but some of the behaviours to do with placeholders will be custom (maybe).
        //  I think that thinking in terms of general cases is best.

        // Draggable
        // Drop_Zone
        //  What can be dropped here?
        // How does the placeholder look?
        // For the moment, should keep the original item in place, possibly shade it.
        //  An item that follows the mouse pointer.
        //   Some kind of clone / ghost copy of the original.
        //   I think ghost may be good because it's just the appearance without an effect for the moment.

        // Can use data attributes in the DOM for indicating behaviours?
        //  Or could be in the activation information for controls.

        // Selectable.
        // Selection handles - basically events wired to select/deselct the object
        //  Things are likely to be selected in order to drag...
        //   Not necessarily though.

        // Possibly want better facilities for adding and removing css classes.
        //  Could have an object to hold them...
        //   Could do a generally quite fast system of updating the style attribute
        //    Logically quite simple.

        // Could use flags for behaviours. Such as a 'selectable' flag.
        //  That in turn interacts with a (css) flag, selected.

        // Anyway, want activation.

        // Upgraded event binding...
        //  Some events will be DOM events.
        // So, when some events, such as 'blur' are bound to a control, we want it to be bound as an
        //  event listener on the DOM so that the control is listening to that DOM event.

        // The jsgui programmer will use the same API to bind DOM events to controls as to bind other sorts of events
        //  to controls and other objects.

        // The 'blur' event will be the one I start with.

        





        'post_init': function (spec) {
            //throw 'stop';
            if (spec && spec.id === true) {
                // get the id from the context.
                //if (t)
                this.set('dom.attributes.id', this._id());

            }
        },

        'add_css_flag': function (flag_name) {
            var css_flags = this.get('css_flags');
            //console.log('css_flags ' + stringify(css_flags));

            // Flags that appear in CSS.
            //  Also have some other effect, most likely.

            if (!css_flags.has(flag_name)) {
                css_flags.add(flag_name);
            }


        },
        'remove_css_flag': function (flag_name) {
            var css_flags = this.get('css_flags');
            if (css_flags.has(flag_name)) {
                css_flags.remove(flag_name);
            }

        },
        'has_css_flag': function (flag_name) {
            var css_flags = this.get('css_flags');
            return css_flags.has(flag_name);
        },

        // Maybe consider these part of rendering, move them.
        '_get_amalgamated_style': function (arr_contexts) {
            //console.log('this._.style ' + stringify(this._.style));

            // Do we have style as a field that uses data objects?

            //res = clone(this._.style);
            //that = this;




            // needs to be substantially redone.
            //  I want to keep it simple, and close to the HTML API by default.
            //  There will need to be overrides in various places.

            // Sometimes new elements would need to be put in (maybe into the background)

            //console.log('res ' + stringify(res));
            // OK, needs the style object.

            // Likely to have the style() function.

            /*
        	 * not using contexts at the moment anyway
        	 * 
        	$.eac(arr_contexts, function(i, v) {
        		//var cs = that._.cs[v];
        		if (global.page_context && global.page_context.context_style[v]) {
        			//console.log('a) get_amalgamated_style res ' + jsgui.stringify(res));
        			apply_style_to_style(res, global.page_context.context_style[v]);
        			//console.log('b) get_amalgamated_style res ' + jsgui.stringify(res));
        		}
        	});
        	*/
            //return res;

            // Not going to use this._.style.
            //  will have this._icss for inline css




            return clone(this._.style);
        },

        '_get_rendered_inline_css_dict': function () {

            // and does setting the style work right?

            // will refer to an object, will return this._.inline_css_dict.
            //  will render that dict when necessary ---?
            //  amalgamting the styles

            // when changing the style of something - may be overwritten by amalgamated styles?
            //  have an amalgamated style override?

            //var contexts = this.getContexts(), 

            var ast = this.get_amalgamated_style()


            //console.log('ast ' + stringify(ast));
            var inline_css_dict = get_inline_css_dict_from_style(ast);

            //console.log('inline_css_dict ' + jsgui.stringify(inline_css_dict));

            return inline_css_dict;
        },


        // Will use less inline style rendering, will make more stylesheet components.
        //  Will also work on tools for making stylesheets and styles.

        // may be how style gets output - could use an output system that makes reference to the page_context.
        //  it is just dom.attributes.style
        /*
        '_get_rendered_inline_css': function () {
            var css_dict = this.get_rendered_inline_css_dict(),
                str_css = '';

            // renders the jsgui styles that have been set to the inline style
            // then renders/copies the CSS inline styles to the inline style

            // will already have a style dict.

            
        	//if (typeof this.dom.attributes != 'undefined' && typeof this.dom.attributes.style != 'undefined') {
        	//	var da_style_dict = str_get_styles_dict(this.dom.attributes.style);
	        //	var nsd = {};
	        //	$.extend(true, nsd, da_style_dict,  css_dict);
	        //	str_css = styles_dict_to_string(nsd);
        	//};
        	

            // will be a data type that supports ordering / reordering soon.
            var h = this.has('this.dom.attributes._.dict_style');
            // maybe does not have that attribute?
            // they are inline styles (that have been set)

            //console.log('h ' + h);

            if (h) {
                var da_style_dict = h;
                var nsd = {};
                extend(true, nsd, da_style_dict, css_dict);

                //console.log('nsd ' + jsgui.stringify(nsd));

                str_css = styles_dict_to_string(nsd);
            } else {
                //console.log('css_dict ' + jsgui.stringify(css_dict));
                str_css = styles_dict_to_string(css_dict);
            }

            return str_css;
        },
        */

        // likely to be done with an alias
        //  And will be done using the data type system.

        'property_css_transition_duration': function (style_property_name) {
            // this._.s

            // will refer to style properties differently

            if (this.has('_.s.transition')) {
                // look up the css transition in the jsgui style
                //if(this._.s.transition) {
                var tr = this._.s.transition;
                if (tr[style_property_name]) {
                    // anything about duration etc?
                    var dur = tr[style_property_name][0];
                    return dur;
                }
                //}
            }
        },

        // 'ret' function - gets something if possible.
        'has': function (item_name) {
            var arr = item_name.split('.');
            //console.log('arr ' + arr);
            var c = 0,
                l = arr.length;
            var i = this;
            var s;
            while (c < l) {
                s = arr[c];
                //console.log('s ' + s);
                if (typeof i[s] == 'undefined') {
                    return false;
                }
                i = i[s];
                c++;
            };
            return i;
        },

        // The Dom attributes could count as fields, and wind up rendering themselves using Get.
        //  Dom attributes likely to be a collection as well, perhaps automatically sorted by name.
        // Could use collection rendering.
        'renderDomAttributes': function () {
            //console.log('renderDomAttributes');

            // Pre-render dom attributes?
            //  To set the dom attributes programmatically according to properties.

            if (this.beforeRenderDomAttributes) {
                this.beforeRenderDomAttributes();
            }



            

            /*
            var inline_css = this.get_rendered_inline_css();
            //console.log('inline_css ' + inline_css);

            //throw('10)stop');

            // style currently goes first here... does it matter though?
            // could be in the dom.attributes.style - it being using some kind of MVC interaction with this.style.
            if (inline_css.length > 0) {

                // no, not quite like this.
                //  
                //this.domAttributes('style', inline_css);

                // don't set the style attribute there - render it as the style attribute

                arr.push(' ', 'style', '="', inline_css, '"');
                //console.log('*_ ' + stringify(this._.dom));
            }
            */
            //var dom = this.get('dom');

            //var dom_attrs = dom.get('attributes');

            var dom_attrs = this.get('dom.attributes');
            //console.log('dom_attrs ' + tof(dom_attrs));
            // don't know the number of keys?

            var arr = [];

            // Maintaining a dict, or some data structure of the inline styles will help.




            //var arr = new Array(dom_attrs.length * 5);
            if (dom_attrs) {

                // Going to handle the style attribute differently.
                //  Maybe at a different level though.



                dom_attrs.each(function (i, v) {
                    /*
                    if (i != 'style') {
                        // check just in case

                        // when rendering the style... 
                        //  I think the DOM attributes style will already be rendered (so far)
                        // Probably render style like the others.
                        // May use a data type that allows the style / class to be done effectively.
                        //  could be a dict or an object that does this.
                        //console.log('dom attr i ' + i);
                        arr.push(' ', i, '="', v, '"');
                    }
                    */
                    arr.push(' ', i, '="', v, '"');
                });
            }


            //res = arr.join('');
            //return res;
            return arr.join('');
        },
        'renderBeginTagToHtml': function () {

            // will be in _.dom.tagName
            //  I think that's why we need the further level properties.

            // dom.style.transform3d.translate3d
            //  these property levels could go quite deep. Want a convenient way of using them without having to manually code lots of 
            //  iterations, nested existance checks. Could have shortcuts so it knows what dom.translate3d means.
            // do we have 'get'?
            //var dom = this.get('dom');
            var tagName = this.get('dom.tagName'),
                res;

            if (tagName === false) {
                res = '';
            } else {

                //var dom_attributes = this.renderDomAttributes();
                res = ['<', tagName, this.renderDomAttributes(), '>'].join('');
            }
            //var res = ['<', this._.tagName, this.renderDomAttributes(), '>'].join('');

            //console.log('renderBeginTagToHtml res ' + res);
            return res;
        },
        'renderEndTagToHtml': function () {
            // will have different way of referring to the tagName, but that could be a shortcut.
            // dom.tagName();
            //  through the fields system.
            var dom = this.get('dom');
            var tagName = dom.get('tagName'),
                res;

            var noClosingTag = dom.get('noClosingTag');

            //console.log(tof(noClosingTag));
            //throw 'stop';

            if (tagName === false || noClosingTag) {
                res = '';
            } else {
                res = ['</', tagName, '>'].join('');
            }

            //console.log('renderBeginTagToHtml res ' + res);
            return res;
        },
        'renderHtmlAppendment': function () {
            return this.htmlAppendment || '';
        },

        // not rendering a jQuery object....
        // content including the tags? Not for the moment. Tags being false means there are no tags, and this tagless control acts as a container for other
        //  controls or content.
        // That will be useful for having different insertion points in controls without having to have them enclosed by an HTML element.

        'renderEmptyNodeJqo': function () {
            return [this.renderBeginTagToHtml(), this.renderEndTagToHtml(), this.renderHtmlAppendment()].join('');
        },

        // Need to implement deferred rendering.
        //  Some controls will ge ttheir data from a Resource / from Resources.
        //  This means the data is available to them asyncronously.
        //  The control will not be ready to render immediately.

        // For example, a control shows the records in a DB table. This is done through accessing a Resource.
        //  The control will not be ready to render until it has loaded the data from the Resource.

        // I think some kind of 'status' in the Control would make sense.
        //  Assumed to be ready, but could have .__status = 'waiting'
        // Could hold more info about waiting and timing?

        // For the moment, just need to be able to delay rendering a control until all subcontrols are ready.

        // Will go through the control tree like with rendering, noting down any that are not ready, and subscribing to their ready events.
        //  We count down the number yet to be ready, when that is 0 we do the rendering like normal, except returning the result asyncronously.


        'iterate_this_and_subcontrols': function(ctrl_callback) {
            ctrl_callback(this);

            var content = this.get('content');
            var that = this;

            content.each(function(i, v) {
                //console.log('v', v);

                tv = tof(v);
                if (tv == 'string') {
                    // escape the string.

                    //var output = jsgui.output_processors['string'](n);
                    //res.push(output);
                    //res.push(jsgui.output_processors['string'](n));

                }
                /*
                if (tof(n) == 'string') {
                    // escape the string.

                    var output = jsgui.output_processors['string'](n);
                    res.push(output);

                }
                */
                if (tv == 'data_value') {
                    //var output = jsgui.output_processors['string'](n.get());
                    //res.push(jsgui.output_processors['string'](n.get()));
                } else {
                    //htm = n.all_html_render();
                    //res.push(n.all_html_render());
                    v.iterate_this_and_subcontrols.call(v, ctrl_callback);
                }

                

            });


        },

        // Should now include deferred rendering.

        'all_html_render': function(callback) {

            if (callback) {

                //console.log('deferred rendering');
                //throw 'stop';

                // Get the map of any controls that have __status == 'waiting'.
                var that = this;
                // want to recursively iterate through controls and subconstrols.
                var arr_waiting_controls = [];

                // Worth setting up the listener on this loop?



                this.iterate_this_and_subcontrols(function(control) {
                    if (control.__status == 'waiting') arr_waiting_controls.push(control);
                });

                // then if we are waiting on any of them we listen for them to complete.

                //console.log('arr_waiting_controls.length', arr_waiting_controls.length);

                if (arr_waiting_controls.length == 0) {
                    var html = this.all_html_render();
                    callback(null, html);
                } else {
                    var c = arr_waiting_controls.length;

                    var complete = function() {
                        //console.log('complete');
                        that.pre_all_html_render();

                        var dom = that.get('dom');
                        //console.log('dom', dom);

                        if (dom) {
                            // does it have innerHTML?
                            //  I think that will just be a content item that gets rendered anyway.
                            //console.log('has dom');

                            /*

                            var beginning = this.renderBeginTagToHtml();
                            var middle = this.all_html_render_internal_controls();
                            var end = this.renderEndTagToHtml();
                            var appendment = this.renderHtmlAppendment();

                            res = [beginning, middle, end, appendment].join('');
                            */
                            //return [that.renderBeginTagToHtml(), that.all_html_render_internal_controls(), that.renderEndTagToHtml(), that.renderHtmlAppendment()].join('');
                            var html = [that.renderBeginTagToHtml(), that.all_html_render_internal_controls(), that.renderEndTagToHtml(), that.renderHtmlAppendment()].join('');
                            //console.log('html', html);
                            callback(null, html);
                            //throw ('stop');
                        }
                    }

                    each(arr_waiting_controls, function(i, control) {
                        control.on('ready', function(e_ready) {
                            //console.log('control ready');
                            c--;
                            //console.log('c');
                            if (c == 0) {
                                complete();
                            }

                        });
                    });


                }
            } else {
                this.pre_all_html_render();

                var dom = this.get('dom');

                if (dom) {
                    // does it have innerHTML?
                    //  I think that will just be a content item that gets rendered anyway.
                    //console.log('has dom');

                    /*

                    var beginning = this.renderBeginTagToHtml();
                    var middle = this.all_html_render_internal_controls();
                    var end = this.renderEndTagToHtml();
                    var appendment = this.renderHtmlAppendment();

                    res = [beginning, middle, end, appendment].join('');
                    */
                    return [this.renderBeginTagToHtml(), this.all_html_render_internal_controls(), this.renderEndTagToHtml(), this.renderHtmlAppendment()].join('');
                    //throw ('stop');
                }
            }

            //console.log('all_html_render ');
            //if (this.pre_all_html_render) {
            //	
            //}
            

            //return res;
        },



        'render_content': function () {
            
            // it's controls() now, gets the collection of controls.
            //each(this._.controls, function(i, n) {

            //var fields = this.fields();
            //console.log('fields ' + stringify(fields));

            // Some kind of full content?
            //  Content shortcuts?

            // Or have an internal_content property?
            //  Possibility of different places for internal content?
            //   Or not right now?

            // I think an internal_content reference would be best.
            //  or just .internal


            // should be able to get the content... it's a field.
            //  but complications because it's a collection.

            // When adding a string to the collection...

            var content = this.get('content');
            var contentLength = content.length();

            // var res = [];

            var res = new Array(contentLength);

            //console.log('-------------------------');
            //console.log('content ' + stringify(content));
            //console.log('tof(content) ' + tof(content));
            //throw('8) stop');

            /*
        	each(controls._arr, function(i, n) {
                htm = n.all_html_render();
                res.push(htm);
            });
        	*/
            var tn, output;
            content.each(function (i, n) {
                //console.log('-------------------------');
                //console.log('tof(n) ' + tof(n));
                //console.log('(n) ' + stringify(n));
                //throw 'stop';
                tn = tof(n);
                if (tn == 'string') {
                    // escape the string.

                    //var output = jsgui.output_processors['string'](n);
                    //res.push(output);
                    res.push(jsgui.output_processors['string'](n));

                }
                /*
                if (tof(n) == 'string') {
                    // escape the string.

                    var output = jsgui.output_processors['string'](n);
                    res.push(output);

                }
                */
                if (tn == 'data_value') {
                    //var output = jsgui.output_processors['string'](n.get());
                    res.push(jsgui.output_processors['string'](n.get()));
                } else {
                    //htm = n.all_html_render();
                    res.push(n.all_html_render());
                }
            });
            return res.join('');
        },

        'all_html_render_internal_controls': function () {
            //var controls = this.controls, res = [];
            return this.render_content();
        },
        'pre_all_html_render': function () {

        },

        // May happen through Data_Object events as well.

        // bind dom event to normal events?
        //  Be quite explicit in which ones get bound for the moment.

        // Want it so that the dom attributes style gets changed with the css_flags.


        'bind_dom_event': function (evt_name, evt_handler) {

            // but make this raise a jsgui event too
            var n = this.domNode();

            // this._el?
            if (n) {
                n.addEventListener(evt_name, evt_handler, false);
            }
        },

        'unbind_dom_event': function (evt_name, evt_handler) {

            //jsgui._dom_removeEventListener(dom_node, evt_name, evt_handler, false);
            // jsgui._dom_unbind_event(dom_node, evt_name, evt_handler) - phase assumed, no boolean here, different API.
            // a (jsgui) api outside of the controls.

            var n = this.domNode();
            if (n) {
                n.removeEventListener(evt_name, evt_handler, false);
            }
        },

        // event handling - likely to be moved to DataObject. Controls will still handle events!

        'bind_ctrl_event': function (evt_name, evt_handler) {

            // could use a ll_ensure function...
            //  clearer naming that it's simple.
            //  will compress better.

            //var ceen = this.ensure('_.bound_ctrl_events.' + evt_name, []);
            var ceen = ll_ensure(this, '_.bound_ctrl_events.' + evt_name, []);

            ceen.push(evt_handler);
        },

        'trigger_ctrl_event': function (evt_name) {
            //console.log('trigger_ctrl_event ' + evt_name);

            var a = arr_like_to_arr(arguments),
                p = [];
            if (a.length > 1) {
                p = a.slice(1);
            };
            var ce = this._.bound_ctrl_events,
                that = this;
            //console.log('ce ' + ce);
            if (ce) {
                //console.log('ce[evt_name] ' + ce[evt_name]);
                if (ce[evt_name]) {
                    each(ce[evt_name], function (i, v) {
                        v.apply(that, p);
                    });
                };
            };
        },

        'compose': function () {

            // I think having this avoids a recursion problem with _super calling itself.
        },
        'wait': function (callback) {
            //console.log('wait');
            setTimeout(function () {
                callback();
            }, 0);
        },
        // could use aliases for style properties.

        'visible': function (callback) {

            //console.log('vis');

            //return this.style('display', 'block', callback);
            this.style('display', 'block', callback);
        },

        // These kind of functions, that set a property to a value, could be made in a more efficient way.

        // have this in a function chain?
        'transparent': function (callback) {
            // make block or inline display, maybe depending on what it was before being made hidden
            //console.log('transp');
            // if display is none then display it.
            //  may have the previous display value stored.
            //return this.style({'opacity': 0}, callback);
            this.style('opacity', 0, callback);
            /*
			
			this.style({
				'display': 'block',
				'opacity': 0
			});
			
			if (callback) {
				setTimeout(function() {
					callback();
				}, 0);
			} else {
				return this;
			}
			*/
        },
        'opaque': function (callback) {
            return this.style({
                'opacity': 1
            }, callback);

        },

        // possibly change name
        'chain': function (arr_chain, callback) {
            // each item in the array is a function call (reference) that needs to be executed.
            // assuming the last param in each function is the callback.

            var pos_in_chain = 0;

            //setTimeout()
            var that = this;
            var process_chain = function () {
                //console.log('process_chain arr_chain.length ' + arr_chain.length + ', pos_in_chain ' + pos_in_chain);
                //console.log('arr_chain.length ' + arr_chain.length);
                if (pos_in_chain < arr_chain.length) {
                    var item = arr_chain[pos_in_chain];

                    // what types can item be
                    // an array... that means more than one thing gets applied at this point in the chain.

                    var t_item = tof(item);

                    //console.log('t_item ' + t_item);
                    if (t_item == 'array') {
                        // do more than one item at once.

                        // will wait for them all to be complete too.
                        var count = item.length;
                        var cb = function () {
                            count--;
                            if (count == 0) {
                                //if (callback) {
                                //	callback();
                                //}
                                pos_in_chain++;
                                process_chain();
                            }
                        };
                        each(item, function (i, v) {
                            that.fn_call(v, function () {
                                cb();
                            });
                        });
                        //console.log('arr item ' + stringify(item));
                    } else {
                        // for a string I think.
                        // could be a map, and need to call the item(s) in the map.
                        that.fn_call(item, function () {
                            //console.log('cb1');
                            pos_in_chain++;
                            process_chain();
                        });
                    }
                } else {
                    if (callback) {
                        callback.call(that);
                    }
                }
            }
            process_chain();
        },
        'fn_call': function (call, callback) {
            // and callbacks within the right way?
            //console.log('fn_call ' + call);
            var t = tof(call);
            //console.log('t ' + t);
            // but call may be an object...
            var fn, params, that = this;
            if (t == 'string') {
                fn = this[call];
                params = [];
                //console.log('callback ' + callback);
                if (callback) {
                    return fn.call(this, callback);
                } else {
                    return fn.call(this);
                }
            };
            if (t == 'array') {
                // the 0th item in the arr should be the function name, the rest the params
                // but does the function have a 'callback' param that we know about here? not now.
                fn = this[call[0]];
                params = call.slice(1);
                if (callback) params.push(callback);
                return fn.apply(this, params);
            }
            if (t == 'object') {
                // how many?
                var count = 0;
                each(call, function (i, v) {
                    count++;
                });

                each(call, function (i, v) {
                    var cb = function () {
                        count--;
                        if (count == 0) {
                            callback.call(that);
                        }
                    };
                    that.fn_call([i, v], cb);
                });
            }
        },

        // I think .animate syntax would be very helpful.
        //  syntax similar to jQuery but likely to allow more possible options???
        //   more ways of expressing the options.






        // This could probably be defined as an alias.

        // transition -> style.transition
        //  Integrating callbacks with these property changes?
        //  Maybe should not do so much more on compressing & generalizing yet.

        // Horizontal_Carousel_Selector
        //  Or just show these various selectable items in the horizontal carousel.

        // Will maybe make the carousel continuous, so could go from December to January, and it would raise an event
        //  signifying the continuation and direction, so this could make the year change.
        // Would have a horizontal carousel selector for selecting the year, with it continuing.
        //  Could make it a combo selector so the value can be typed in as well. 'J' would bring up 'January', 'June' and 'July' as autoselect items.
        // Putting these GUI features in place will not take so long, and will help this to be a powerful toolkit.

        // May be worth doing more on databases and authentication though.



        'transition': function (value, callback) {
            //var i = {};
            //i[]

            // may include multiple transitions in an array.
            return this.style({
                'transition': value
            }, callback);
        },

        'transit': fp(function (a, sig) {

            // arr_duration_and_timing_function, map_values, callback
            // transit, callback
            //console.log('transit sig ' + sig);
            // [[n,s],o]  a duration with timing function, then a transit map. no callback
            //  what about extracting from the most inner array, so also responding to [[[n,s],o]].
            // seeing that the required thing is inside an array shell.

            // extract_sig_from_array_shell
            var that = this;
            //  [[[n,s],o,],f] including callback function

            // [[[n,s],o]]
            var unshelled_sig = remove_sig_from_arr_shell(sig);
            //if (remove_sig_from_arr_shell(sig))
            //console.log('unshelled_sig ' + unshelled_sig);
            if (unshelled_sig == '[[n,s],o]') {
                return this.transit(a[0][0], a[0][1]);
            }

            if (sig == '[[[n,s],o],f]') {

                var transit = a[0];
                var callback = a[1];

                var duration_and_tf = transit[0];
                var map_values = transit[1];

                this.transit(duration_and_tf, map_values, callback);

            } else if (sig == '[[n,s],o,f]') {
                var duration_and_tf = a[0];
                var map_values = a[1];
                var callback = a[2];
                var transition = {};
                each(map_values, function (i, v) {
                    // set the transition style
                    transition[i] = duration_and_tf;
                });
                that.transition(transition);

                each(map_values, function (i, v) {
                    // set the transition style
                    //transition[i] = arr_duration_and_timing_function;

                    // use the style function to set the value
                    // and use a callback system here for when they are all done.

                    that.style(i, v);
                });

                //this.transit(duration_and_tf, map_values, callback);
            } else if (a.length == 2) {
                var duration_and_tf = a[0];
                //console.log('a ' + stringify(a));

                // transit includes the map values

                var duration_and_tf = a[0];
                var map_values = a[1];
                //var transit_map = a[1];
                var transition = {};

                each(map_values, function (i, v) {
                    // set the transition style
                    transition[i] = duration_and_tf;


                });
                that.transition(transition);

                each(map_values, function (i, v) {
                    // set the transition style
                    //transition[i] = arr_duration_and_timing_function;

                    // use the style function to set the value
                    // and use a callback system here for when they are all done.

                    that.style(i, v);

                });
                //console.log('transit_map ' + stringify(transit_map));
                //this.transit(duration_and_tf, transit_map);
                //that.transition()
            } // else if (a.length == 3) {
            //	var arr_duration_and_timing_function = a[0], map_values = a[1], callback = a[2];
            //	console.log('a ' + stringify(a));


            //}

        }),

        // and also want to be able to output the property.

        'out': function (property_name) {
            var dti_control = data_type_instance('control');

            //var prop_ref = get_property_reference(this, property_name, false);
            var prop_ref = dti_control.nested_get_property_reference([this, '_'], property_name, true);

            var item_type = prop_ref[2];
            var dti_item = data_type_instance(item_type);

            var out_val = dti_item.output(prop_ref[0][prop_ref[1]]);

            //console.log('out prop_ref ' + stringify(prop_ref));
            //console.log('out out_val ' + stringify(out_val));

            return out_val;
        },

        'page_context': function (val) {
            if (typeof val == 'undefined') {
                // _.page_context should not be a function.

                // how frequently does it need to be called?
                //  is it being called too much?
                //console.log('£ this._.page_context ' + this._.page_context);
                if (is_defined(this._.page_context)) {
                    return this._.page_context;
                } else {
                    if (jsgui.page_context) {
                        return jsgui.page_context;
                    }
                }
            } else {
                this._.page_context = val;
            }
        },

        // may change the controls access functions, but seems simple and OK for the moment to wrap them like this.

        // will just be adding to the content.

        'add_control': function (new_content) {
            //var content = this.get('content');


            // The controls array being an ID'd and indexed collection.
            //  Everything in there has an ID.
            //  So needs a page_context.
            //  Seems a little inconvenient.
            //  But will solve the problem for the moment.



            //return content.add(new_content);
            return this.get('content').add(new_content);
        },
        'add': function(new_content) {

            var tnc = tof(new_content);
            //console.log('tnc', tnc);

            if (tnc == 'array') {
                var res = [], that = this;
                each(new_content, function(i, v) {
                    res.push(that.add(v));
                });
                return res;
            } else {
                if (!new_content._context) {
                    if (this._context) {
                        new_content._context = this._context;
                    }
                }

                /*
                console.log('add context: ' + this._context);
                if (this._context) {
                    if (tof(new_content) == 'string') {

                    } else {
                        new_content._context = this._context;
                    }
                }
                */

                //console.log('pre content add');
                //return content.add(new_content);

                // also, want to set the index of the new_content.
                //  The content could be a string...
                //   no need to set the index then.

                //  If the content is a control, we want to set a property for that control.
                //   Control should know what its parent control is.



                // OK, but does puttint it into that collection automatically set its parent in some way?

                // Maybe listen out for content being added.
                //  So we can do content.add rather than just .add, and it updates the parent and index values.

                // Could check for an inner control.

                // Also could instantiate the content if it is abstract.
                // Also could express content as JSON in some cases.
                //  Possibly could add XML.




                var inner_control = this.get('inner_control');

                if (inner_control) {
                    return inner_control.get('content').add(new_content);
                } else {
                    return this.get('content').add(new_content);
                }


                
                // then it should know it's been added, and update the DOM.
                //  should render the control to the DOM too.


            }   

            //var content = this.get('content');

            // but the context of the new control should be set.

            // Carousel Button
            //  Carousel button Selector
            //  In horizontal mode.

            //throw 'stop';

            // won't need to apply the context automatically... but maybe if the object does not already have one.

            
            //console.log('post content add');
        },

        'insert_before': function(target) {
            //console.log('target', target);

            //console.log('pre find parent');
            //throw 'stop';

            // The parent of a content Collection being a Control?
            //  Probably makes sense.


            var target_parent = target.parent().parent();

            //console.log('target_parent', target_parent);

            var target_index = target._index;

            //console.log('target_index', target_index);

            // insert into the content collection.

            var content = target_parent.get('content');

            content.insert(this, target_index);

            // An enhanced / activated control needs to listen for content change in particular.





            //console.log('');
            //console.log('target', target);

            // Controls need to better keep track of their index within the parent, and what their parent control is.
            //  Adds a bit of effort to keep track of what the indexes are.
            //  It's worth having the controls stay aware of what their index is where possible.

            // This 'parent' and relationship info could be integral to Data_Objects and Collections, not just Controls.





            //throw 'stop';
        },

        'stringify': function () {
            var res = [];
            res.push('Control(' + stringify(this._) + ')');
            return res.join('');
        },
        'style': fp(function(a, sig) {
            // For the moment, this should be a convenient way of updating the dom attributes style.

            //  This could do the document update or not....

            var style_name, style_value, modify_dom = true;

            if (sig == '[s]') {

                // Best not to refer to the computed styles probably?
                //  Really want to interact with inline styles here.

                // maybe have some syntax for computed styles, such as .style('computed', style_name);
                //  Or just don't have it, get it from the element if needed.




                // Want to get a style value.
                //  This could get fairly complicated when getComputedStyle is not around, in older browsers.

                // May have a system to read through a stylesheet and work out what would get applied to an element

                // For the moment, will look at style of control property (need to develop that more).

                var styleName = a[0];
                console.log('get style ' + styleName);

                var el = this.get('dom.el');

                // Should probably return a copy of the style, not read from the DOM.

                var res = getComputedStyle(el)[styleName];
                return res;


            }


            //console.log('style sig ' + sig);

            if (sig == '[s,s,b]') {
                var styleName = a[0];
                var styleValue = a[1];

                // Modify dom by default if there is a DOM.


                var modifyDom = a[2];

            };

            if (sig == '[s,s]') {
                var styleName = a[0];
                var styleValue = a[1];

                // Modify dom by default if there is a DOM.
                //var modifyDom = a[2];

            };




            /*
            if (sig == '[s,s,b]') {
                var styleName = a[0];
                var styleValue = a[1];

                // Modify dom by default if there is a DOM.


                var modifyDom = a[2];

                var style = this.get('dom.attributes.style');


               // console.log('style ' + style);

                if (!style) {
                    this.set('dom.attributes.style', styleName + ':' + styleValue + ';');
                } else {
                    // parse the style attribute

                    // can't do such a simple split, need to split in a way that avoids semicolons such as in a url?

                    // try semicolon split.

                    if (tof(style) == 'data_value') style = style.value();

                    var map_style = parse_style_attribute_to_map(style);
                    //console.log('map_style ' + stringify(map_style));


                    map_style[styleName] = styleValue;

                    var str_style = style_attribute_map_to_string(map_style);

                    this.set('dom.attributes.style', str_style);


                    //throw 'stop';
                }

                // Should modigy the DOM by default I think.
                if (modifyDom) {
                    var style = this.get('dom.attributes.style');
                    var el = this.get('dom.el');

                    if (el) {
                        el.style.cssText = style;
                    }
                }

            }
            */

            if (styleName && typeof styleValue !== 'undefined') {
                //var styleName = a[0];
                //var styleValue = a[1];

                // dom.attributes.style - as a normal data_object?
                //  Or a particular type of attribute that is dealt with differently?


                // Need to set the inline css dict

                // will update the dom attributes string from the style?
                //  will set an item in the inline_css_dict

                this._icss[styleName] = styleValue;

                // then rebuild the dom attributes style from that one.

                // produce the inline css from that dict...

                var str_css = '';
                //var first = true;
                each(this._icss, function(item_style_name, item_style_value) {
                    //if (!first) {
                    //    str_css = str_css + '';
                    //}
                    str_css = str_css + item_style_name + ':' + item_style_value + ';';
                })
                //console.log('str_css', str_css);

                
                if (modify_dom) {
                    this.set('dom.attributes.style', str_css);
                }

            }
            var that = this;


            if (sig == '[o]') {

                // could recompute the whole style string in a more optimized way.
                //  there could also be a style map, that would help in storing and checking particular styles.



                each(a[0], function(i, v) {
                    that.style(i, v, false);
                });

                var style = this.get('dom.attributes.style');

                var el = this.get('dom.el');

                if (el) {
                    el.style.cssText = style;
                }


            }


        }),
        'active': function() {
            // only on the server.
            //console.log('');
            //console.log('active');
            var id = this._id();

            var domAttributes = this.get('dom.attributes');

            domAttributes.set('data-jsgui-id', id);
            domAttributes.set('data-jsgui-type', this.__type_name);



            this.get('content').each(function(i, ctrl) {
                var tCtrl = tof(ctrl);
                if (tCtrl == 'control') {
                    ctrl.active();
                }
            });

            // need to listen to content change.


        },

        // So I think the resource-pool will have a selection scope.
        'find_selection_scope': function() {
            //console.log('find_selection_scope');

            var res = this.get('selection_scope');
            if (res) return res;

            // look at the ancestor...

            var parent = this.get('parent');
            //console.log('parent ' + tof(parent));


            if (parent) return parent.find_selection_scope();

        },


        // This should not just add the listener to the DOM event.
        //  This should listen to the relevant DOM event, and then apply the superclass's function
        //   (meaning it gets raised as a control event).

        // It gets raised as a control event anyway.
        //  If it matches a dom event then it gets raised as a control event when that dom event happens.

        /*

        'add_event_listener': function(event_name, handler) {
            var el = this.get('dom.el');
            if (el) {
                
                // Check if the element has that event listener...
                //  Maybe maintain a map within the control of which DOM functions have been bound to the element.



                el.addEventListener(event_name, handler, false);
            }
        },
        */



        
        '_add_event_listener': fp(function(a, sig) {

            // depending on what the event is, we also bind it to the DOM.
            //  can use addEventListener.

            if (sig == '[s,f]') {
                var event_name = a[0];

                var listener = this.mapListeners[event_name];
                var that = this;

                var el = this.get('dom.el');

                /*
                if (el) {
                    
                    // Check if the element has that event listener...
                    //  Maybe maintain a map within the control of which DOM functions have been bound to the element.

                    if (!listener) {
                        // a single listener called when a bound dom event fires.
                        //  this will then split up the event calls to everything that is listening to this.
                        // for the DOM event on the object, we raise the event on the control.

                        listener = this.mapListeners[event_name] = function(e) {
                            that.raise(event_name, e);
                        };
                        el.addEventListener(event_name, listener, false);

                    }


                    //el.addEventListener(event_name, handler, false);
                }
                */

                // This causes an infinite loop for some reason.
                //  Maybe when the event takes place....

                Enhanced_Data_Object.prototype.add_event_listener.apply(this, a);


                //this._super.apply(this, a);
                

                //console.log('html core add_event_listener event_name', event_name);

                // And the base event listener as well?
                //  Does it make an infinite recursive loop when I try?

                //

            }

        }),
        

        'click': function(handler) {
            // Adding the click event listener... does that add it to the DOM?

            this.add_event_listener('click', handler);
        },
        'hover': function(fn_in, fn_out) {
            this.add_event_listener('mouseover', function(e) {
                //console.log('hover mouseover');
                fn_in();
            })

            this.add_event_listener('mouseout', function(e) {
                //console.log('hover mouseout');
                fn_out();
            })
        },

        

        'add_class': function(class_name) {
            // Should have already set these up on activation.
            console.log('Control add_class ' + class_name);
            var cls = this.get('dom.attributes.class');
            //console.log('cls ' + cls);
            var el = this.get('dom.el');

            //console.log('add_class el ' + el);
            if (!cls) {

                this.set('dom.attributes.class', class_name);


                // as well as that, need to have the class in the doc respond to this chaging.
                //  event listener listening for dom changes will update this.

                //if (el) el.className = class_name;

            } else {
                var tCls = tof(cls);
                console.log('tCls ' + tCls);
                if (tCls == 'object') {
                    //cls
                    cls[class_name] = true;
                    // then get the classes from the obj

                    var arr_class = [];
                    each(cls, function(i, v) {
                        if (v) arr_class.push(i);
                    })
                    var str_class = arr_class.join(' ');
                    el.className = str_class;
                } else if (tCls == 'data_value') {
                    var val = cls.value();

                    var arr_classes = val.split(' ');
                    var already_has_class = false, l = arr_classes.length, c = 0;
                    while (c < l &! already_has_class) {
                        if (arr_classes[c] == class_name) {
                            already_has_class = true;
                        }
                        c++;
                    }
                    if (!already_has_class) {
                        arr_classes.push(class_name);
                    }
                    var str_cls = arr_classes.join(' ');
                    //console.log('str_cls', str_cls);
                    this.set('dom.attributes.class', str_cls);

                   //this.add_class(val);
                    // And the DOM should update itself when one of these 'model' objects gets changed - depending on if its activated or not.


                } else if (tCls == 'string') {
                    var arr_classes = cls.split(' ');
                    var already_has_class = false, l = arr_classes.length, c = 0;
                    while (c < l &! already_has_class) {
                        if (arr_classes[c] == class_name) {
                            already_has_class = true;
                        }
                        c++;
                    }
                    if (!already_has_class) {
                        arr_classes.push(class_name);
                    }
                    var str_cls = arr_classes.join(' ');
                    //console.log('str_cls', str_cls);
                    this.set('dom.attributes.class', str_cls);
                    // And the DOM should update itself when one of these 'model' objects gets changed - depending on if its activated or not.


                }
            }
            //throw 'stop';

        },

        'remove_class': function(class_name) {
            //console.log('remove_class ' + class_name);


            var cls = this.get('dom.attributes.class');
            //console.log('cls ' + stringify(cls));
            var el = this.get('dom.el');
            //console.log('el', el);
            if (cls) {
                var tCls = tof(cls);
                //console.log('tCls', tCls);
                //throw 'stop';
                if (tCls == 'object') {
                    //el.

                    // go through it again, building the class string...
                    var arr_class = [];
                    each(cls, function(i, v) {
                        //if (v) arr_class.push(i);
                        if (i == class_name) cls[i] = false;
                        if (cls[i]) arr_class.push(i);
                    })
                    var str_class = arr_class.join(' ');
                    this.set('dom.attributes.class', str_cls);
                    //el.className = str_class;

                    //console.log('str_class ' + str_class);
                }
                if (tCls == 'string') {
                    console.log('cls', cls);
                    var arr_classes = cls.split(' ');
                    var arr_res = [];
                    var l = arr_classes.length, c = 0;
                    console.log('arr_classes', arr_classes);
                    while (c < l) {
                        if (arr_classes[c] != class_name) {
                            //already_has_class = true;
                            arr_res.push(arr_classes[c]);
                        }
                        c++;
                    }
                    //console.log('arr_res', arr_res);
                    var str_cls = arr_res.join(' ');
                    //console.log('str_cls ', str_cls);
                    this.set('dom.attributes.class', str_cls);

                    //console.log('str_cls ' + str_cls);
                    //throw 'stop';
                }

                // and if it's a data value, do similar...

                if (tCls == 'data_value') {
                    var cls2 = cls.value();

                    var arr_classes = cls2.split(' ');
                    var arr_res = [];
                    var l = arr_classes.length, c = 0;
                    //console.log('arr_classes', arr_classes);
                    while (c < l) {
                        if (arr_classes[c] != class_name) {
                            //already_has_class = true;
                            arr_res.push(arr_classes[c]);
                        }
                        c++;
                    }
                    //console.log('arr_res', arr_res);
                    var str_cls = arr_res.join(' ');
                    //console.log('str_cls ', str_cls);
                    this.set('dom.attributes.class', str_cls);

                    //console.log('str_cls ' + str_cls);
                }

            }
        },

        'hover_class': function(class_name) {
            // Though this is a behaviour...
            //  could make this work through the behaviour system?
            //  could make the behaviour system work with this.
            //   This one seems fairly simple, lower level than behaviour system.

            // but in the group... when hover_class gets called for the group, it needs to be active on the group....

            // When targeting a group as well... 
            //  May need to give groups a bit more thought.

            // But hover_class seems useful at least.


            var that = this;
            that.hover(function(e_in) {
                that.add_class(class_name);
                //ctrl_key_close_quote.add_class(hover_class);
            }, function(e_out) {
                that.remove_class(class_name);
                //ctrl_key_close_quote.remove_class(hover_class);
            })


        },

        'find_selected_ancestor_in_scope': function() {
            // same selection scope
            // is this one already selected?
            // best not to check....

            var s = this.get('selection_scope');


            var parent = this.get('parent');
            //console.log('parent ' + parent);

            var ps = parent.get('selection_scope');

            if (s == ps) {
                // Probably would be much more convenient to get a data value just as its value,
                //  or have a more convenient data value idiom.
                var psel = parent.get('selected');
                if (psel && psel.value && psel.value() == true) {
                    //throw 'stop';

                    return parent;
                } else {
                    return parent.find_selected_ancestor_in_scope();
                }
            }


            //throw 'stop';


        },

        'remove': function() {
            var el = this.get('dom.el');
            if (el) {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            }
        },

        'shallow_copy': function() {
            console.log('Control shallow_copy');

            var res = new Control({
                'context': this._context
            });


            // need to get setting of one data object to another correct.
            //  That looks like a lower level piece of functionality that needs attention.

            // For the moment, want to get some kind of shallow copy working.

            //res.set('dom.attributes', this.get('dom.attributes'));

            var da = this.get('dom.attributes');
            var cl = da.get('class');

            console.log('cl ' + stringify(cl));
            console.log('cl ' + tof(cl));

            var map_class_exclude = {
                'bg-light-yellow': true,
                'selected': true
            }

            each(cl, function(i, v) {
                if (i && !map_class_exclude[i]) res.add_class(i);
            })

            var res_content = res.get('content');

            this.get('content').each(function(i, v) {
                console.log('v ' + v);
                //console.log('v ' + stringify(v));
                console.log('tof v ' + tof(v));

                if (tof(v) == 'data_value') {
                    res_content.add(v.value());
                } else {
                    res_content.add(v.shallow_copy());
                }

                
            })

            return res;
        },

        // May be good having _size
        //  or _measuredSize
        //  want to measure the control at a suitable time.

        // Should probably be in html-enh instead.

        'size': fp(function(a, sig) {
            //console.log('sig', sig);
            if (sig == '[]') {
                var el = this.get('dom.el');

                var w = parseInt(getStyle(el, 'width'), 10);
                var h = parseInt(getStyle(el, 'height'), 10);
                var res = [w, h];
                return res;
            }
            if (sig == '[a]') {
                // set the size.
                //  will be done through CSS height and width.
                //console.log('a[0]', a[0]);
                this.style({
                    'width': a[0][0] + 'px',
                    'height': a[0][1] + 'px'
                })

            }
            
        }),

        'offset': fp(function(a, sig) {
            if (sig == '[]') {
                var el = this.get('dom.el');
                var res = [el.offsetLeft, el.offsetTop];
                return res;
            }
            if (sig == '[a]') {
                this.style({
                    'left': a[0] + 'px',
                    'top': a[1] + 'px'
                })
            }
        }),

        'clear': function() {
            // clear all the contents.
            // ui should react to the change.

            return this.get('content').clear();

        },

        'activate': function() {
            // Do nothing for basic control I think.
            //  Possibly will be doing some things depending on discovered properties.

            // Need to work more on heirachy in activation.
            //  Want html documents (and pretty much everythin else) to use the enhanced activation.
            //  Should be OK having that in the dependency chain on the server, much of the code won't be called though.

            // Or, enhance the activations of the prototypes?
            //  I'd prefer to have the enhancements become higher up the chain.





        }

        // shallow_copy
        //  would make a copy of the controls and its contents.





        // add event listener...
        //  will be for the dom events.
        // dom.listeners?




        //  





    });


    var p = Control.prototype;
    //p._ = p._ || {};
    //p._.type_name = 'control';

    p._data_generators = {
        'context_id': function () {
            // this is the control
            //  the control should have access to a page_context?

            // Controls on the server are likely to need this for rendering right (different contexts).

            // On the client could refer to jsgui.page_context

            // could refer to jsgui.page_context, if it is there.
            //  Otherwise it would have to be a property of the control.
            //console.log('this.set ' + this.set);
            var page_context = this.page_context();
            var id = page_context.ensure_ctrl_id(this);
            return id;
        },
        'control_collection': function () {
            var res = new jsgui.DataCollection();
            return res;
        }
    };

    var initializing = false, fnTest = /xyz/.test(function() {
        xyz;
    }) ? /\b_super\b/ : /.*/;

    Control.prototype._module_jsgui = jsgui;

    Control.extend = function(prop, post_init) {
        var _super = this.prototype;
        initializing = true;
        var prototype = new this();
        var for_class = {};
        initializing = false;
        if (typeof prop === 'string') {
            var data_type_name = prop;
            var dtis = jsgui.data_types_info;
            var data_type_info = dtis[data_type_name];
            for_class[data_type_name] = data_type_name;
            for_class[data_type_info] = data_type_info;
            prototype['__type_name'] = data_type_name;
            prototype['__data_type_info'] = data_type_info;
            prop = {};
        }
        var prop_item, t_prop_item, tmp, name, res;
        for (name in prop) {
            prop_item = prop[name];
            if (name.charAt(0) === '#') {
                prototype[name.substring(1)] = prototype[prop_item];
            } else {
                t_prop_item = typeof prop_item;
                if (t_prop_item === 'function') {
                    prototype[name] = typeof _super[name] === 'function' && fnTest.test(prop_item) ?
                    (function(name, fn) {
                        return function() {
                            tmp = this._super;
                            this._super = _super[name];
                            res = fn.apply(this, arguments);
                            this._super = tmp;
                            return res;
                        };
                    })(name, prop[name]) : prop[name];
                } else if (t_prop_item === 'object' || t_prop_item === 'boolean') {
                    if (name == 'class_name') {
                        for_class['_class_name'] = prop_item;
                    } else if (name == 'fields') {
                        for_class['_fields'] = prop_item;
                    } else if (name == 'connect_fields') {
                        for_class['_connect_fields'] = prop_item;
                    } else {
                        prototype[name] = prop[name];
                    }
                }  else {
                    prototype[name] = prop[name];
                }
            };
        };
        var Class = function() {
            if (!initializing) {
                if (this.init) {
                    var that = this;
                    var the_make_function = function(abstract_control) {
                        // needs to create a real control out of an abstract one.
                       // var instance = new abstract_control

                       //console.log('the make function');
                       //console.log('abstract_control', abstract_control);
                       //console.log('abstract_control.constructor', abstract_control.constructor);

                       var spec = abstract_control._spec;
                       spec.abstract = null;
                       spec._abstract = null;
                       spec.context = that._context;
                       //console.log('that._context', that._context);
                       var instance = new abstract_control.constructor(spec);
                       //throw 'stop';

                       return instance;


                    };

                    var the_add_function = function(abstract_control) {
                        var instance = the_make_function(abstract_control);
                        return that.add(instance);
                    }

                    var l = arguments.length;
                    var a2 = new Array(l + 2);
                    for (var c = 0; c < l; c++) {
                        a2[c] = arguments[c];
                    }
                    a2[l] = the_add_function;
                    a2[l + 1] = the_make_function;

                    this.init.apply(this, a2);
                    if (this.post_init) {
                        //this.post_init();
                        this.post_init.apply(this, arguments);
                    }
                    if (post_init) {
                        post_init.call(this);
                    }
                } else {
                    var spec = arguments[0] || {};
                    spec.abstract = true;
                    return new Class(spec);
                }
            }
        };
        Class.prototype = prototype;
        Class.prototype.constructor = Class;
        Class.extend = arguments.callee;
        for (i in for_class) {
            Class[i] = for_class[i];
        }
        if (Class['class_name']) {
            jsgui.map_classes[Class['class_name']] = Class;
        }
        Class._superclass = this;
        return Class;
    };



    // function to set up access functions on a prototype?
    //  aliases?
    //  access functions in particular here.

    // Need to do more about rebuilding the framework with the new property system.
    //  Will have encapsulated a lot into lang from html, making things easier here.

    // lang/prototype_access

    // Likely to be changed through use of the Data_Object

    // Do we have a style variable?

    var prototype_access = function (p, variable_name, fn_name) {

        p[fn_name] = fp(function (a) {

            //console.log('this. ' + stringify(this._));

            if (a.l == 1) {
                //var val = a[0];
                return this.set(variable_name, a[0]);
            } else {
                return this.get(variable_name);
            }
        });
    }

    var p = Control.prototype;

    // This system works quite nicely now.
    //  Allows simple functional access to these properties.

    prototype_access(p, 'index', 'index');
    prototype_access(p, 'id', 'id');
    prototype_access(p, 'dom.tagName', 'tagName');
    prototype_access(p, 'dom.attributes', 'domAttributes');
    prototype_access(p, 'controls', 'controls');


    //prototype_access(p, 'style', 'style');

    // access to the dom node as well.

    // domAttributes

    //p._tag_name = 'div';

    var map_Controls = {};

    

    //jsgui = {};
    //jsgui.Core = Core;



    


    // Own tof function for this section that checks instanceOf Control.

    /*
    var old_tof = jsgui.tof;

    jsgui.tof = function (obj) {
        var res = old_tof(obj);
        if (obj instanceof Control) res = 'control';
        return res;

    };
    */

    // Also need to get this loading (automatically) as a client-side component.



    // make it so that there is head.title(),
    // also title() method for a basic HTML document.

    // these should support text inside them.
    // the 'text' property could do something different for different things.

    // text_property('div span h1 h2')
    // a property that represents a textNode inside.

    // text property - will work as a property called text.
    //  however, when the text has been set/changed, it changes text in a textNode.
    // This text property should be a convenient interface to that text node.

    // I think that means we need a textNode.

    // Will have a dom.nodeType property.
    //  Most things will be 1 (element)
    //  Attribute node 2
    //  Text node 3

    // The properties indeed have greatly shortened this code.
    //  Likely to put the new property system into the full library when more fully defined.
    //  Or likely to put the full lib's capabilities into this, a new version of it?

    // The new property system looks set to save on a lot of code. So much of the code is currently dealing with the mechanics of property values.

    // Again, will change through use of the Data_Object
    // and the control init function?
    //  it's call

    var ctrl_init = Control.prototype.init;
    var ctrl_init_call = Control.prototype.init.call;

    var escape_html_replacements = [
            [/&/g, '&amp;'],
            [/</g, '&lt;'],
            [/>/g, '&gt;'],
            [/"/g, '&quot;'], //"
            [/'/g, '&#x27;'], //'
            [/\//g, '&#x2F;']
        ];
    //var single_replacement;

    var escape_html = function (str) {

        //console.log('tof(str) ' + tof(str));

        //console.log('escape_html str ' + str);
        //console.log('tof str ' + tof(str));

        if (tof(str) == 'data_value') str = str.get();

        // 

        // str.replace(/microsoft/gi, "W3Schools")
        /*
        var res = str.replace(/&/g, '&amp;');
        res = res.replace(/</g, '&lt;');
        res = res.replace(/>/g, '&gt;');
        res = res.replace(/"/g, '&quot;');
        res = res.replace(/'/g, '&#x27;');
        res = res.replace(/\//g, '&#x2F;');
        */

        //var replacements = 
        var single_replacement;
        for (var c = 0, l = escape_html_replacements.length; c < l; c++) {
            single_replacement = escape_html_replacements[c]
            str = str.replace(single_replacement[0], single_replacement[1]);
        }
        //each(escape_html_replacements, function (i, v) {
        //    str = str.replace(v[0], v[1]);
        //});

        return str;
    };


    jsgui.textNode = Control.extend({
        'init': function (spec) {


            spec = spec || {};
            this._super(spec);

            if (typeof spec == 'string') {
                //this._.text = spec;
                //this.innerHtml = spec;
                spec = {
                    'text': spec
                };
            }

            spec.nodeType = 3;
            //this.ensure('_');

            /*
	    	if (spec.text) {
				this._.text = spec.text;
				//this.innerHtml = spec.text;
				spec = {};
			}
	    	*/
            //this.no_escape = spec.no_escape || false;
            // another property from the spec? I think this property could fit in with an MVC (or MMVC) pattern where changes lead to updates in the HTML without
            // needing much programming for each change. 2/3 of this class could be removed if using different OO.

            /*
	    	if (spec.no_escape) {
	    		this.ensure('_');
	    		this._.no_escape = spec.no_escape;
	    	}
	    	*/
            //ctrl_init_call(this, spec);

            //this._super(spec);

            if (typeof spec.text != 'undefined') {
                this._.text = spec.text;
            }

            //this.typeName = pr.typeName;
            //this.tagName = 'p';

        },
        // will use a no-escape property.
        /*
	    'no_escape': fp(function(a, sig) {
	    	if (a.l == 0) {
	    		return this.ret('_.no_escape');
	    	}
	    	if (a.l == 1) {
	    		this.ensure('_');
	    		this._.no_escape = a[0];
	    	}
	    }),
	    */
        'all_html_render': function () {
            // need to escape the HTML it outputs.

            

            //var text = this._.text || '';
            var text = this.get('text');
            // These get and set operations should not rely on the page_context.

            //console.log('text ' + text);

            var nx = this.get('no_escape');


            //console.log('nx ' + nx);

            if (nx) {
                res = text || '';
            } else {
                res = escape_html(text || '') || '';
            }

            return res;
        }
        /*,
        
        // will have a text property.
        
        'text': function(text) {
        	// need to update the text in the dom.
        	this._.text = text;
        	// use jQuery for this?
        	// or DOM?
        	// not sure jQuery handles text nodes directly so well.
        	
        	// is there this.$?
        	
        	// do these text nodes get recreated?
        	//  they can't have the jsgui expando like elements.
        	
        	// can not so easily get this text node activated on the client.
        	
        	//  what about the ability to get / identify text nodes from their parent?
        	//  so that a parent could be told what active text node it contains.
        	
        	// can tell a span control to change the text it contains.
        	
        	//.text_nodes(0).text...
        	//  having a ctrl keep track of any text nodes inside them
        	//   modelling them, having controls.
        	//   however, don't want lots of complications.
        	
        	
        	
        	// just innerHTML?
        	
        }
        */
    });

    

    // And there is some client code that loads the necessary jsgui tools and then activates all the controls in the DOM.
    //  Will do a DOM traverse, except start with the deepest nested elements.
    //   Then it will be able to find controls inside controls.
    //   A lot of elements will have JSGUI IDs.
    //    But some things could be inferred to be controls because they follow a pattern.


    // Page_Context needs a new_id method.


    // I think some of this should be in Client_Page_Context
    //  Perhaps Page_Context in its own module.

    // Should this only be in enhanced?
    //  So it creates enhanced controls?
    //   Will that be OK for the server page context?

    
    // Maybe should not need to get browser info yet? Keep it general???
    // Perhaps there will be html-client.
    //  Will have the ctrls_by_id? The page_context.
    // Activating existing DOM nodes is easy enough without this activation system - just needs code to do it.
    //  But having the nodes created on the server, then sent to the client - requires the JSGUI IDs or other reconstruction code.
    // This does seem almost done for many uses - want to polish it though.
    // Want to make a blog site fairly soon.

    // Also a system for displaying content and programming snippets.
    // Much of it would be server side, not needing client side activation.
    //  Login could use it for enhancement.

    // Can set the data_object constructor for boolean...
    //  and it is a Data_Value.

    // Seems like it should be within a client side page context.
    
    // Do this within the Page_Context.
    /*
    var map_controls_by_type = {};


    var update_ctrl_lookup = fp(function(a, sig) {
        console.log('update_ctrl_lookup sig ' + sig);
        var Module;
        if (a.l == 1) {
            Module = a[0];
            each(Module, function(ctrl_name, Ctrl) {
                console.log('ctrl_name ' + ctrl_name);
                var lName = ctrl_name.toLowerCase();
                map_controls_by_type[lName] = Ctrl;
                console.log('** map_controls_by_type ' + JSON.stringify(map_controls_by_type));
            })
        }

        if (sig == '[s,f]') {
            var name = a[0];
            var Ctrl = a[1];
            map_controls_by_type[name] = Ctrl;
        }
        console.log('* map_controls_by_type ' + JSON.stringify(map_controls_by_type));
        
    });
    */


    // Maybe the jsgui page context will be the key to getting this running on the client.
    //  Could package some things as jquery plugins. Maybe have a standalone build of jsgui.



    // Perhaps it will be context.activate?


    // context.activate?
    //  that may work better.

    // Need more generalised recursive dom activation.
    //  When activating a control recursively, need to go through all of the sub-elements
    //   activate them from the inside.

    

    var shallow_copy = fp(function(a, sig) {
        if (sig == '[a]') {
            var arr_ctrls = a[0];

            var res = [];
            each(arr_ctrls, function(i, v) {
                res.push(v.shallow_copy());
            });
            return res;
        }
    });

    var constructor_from_type = function(type) {
        console.log('constructor_from_type type ' + type);
        console.log('map_controls_by_type ' + stringify(map_controls_by_type));
    }
    // 

    jsgui = jsgui.extend(jsgui, {
        'get_inline_css_dict_from_style': get_inline_css_dict_from_style,
        'apply_jsgui_style_rule_to_css_style': apply_jsgui_style_rule_to_css_style,
        'styles_dict_to_string': styles_dict_to_string,
        'Control': Control,
        //'Page_Context': Page_Context,
        //'Blank_HTML_Document': Blank_HTML_Document,
        //'Client_HTML_Document': Client_HTML_Document,
        //'recursive_dom_iterate': recursive_dom_iterate,
        'map_Controls': map_Controls,
        //'update_ctrl_lookup': update_ctrl_lookup,
        //'activate': activate,
        'shallow_copy': shallow_copy
        //'constructor_from_type': constructor_from_type,
        //'map_controls_by_type': map_controls_by_type
    });

    var hover_class = fp(function(a, sig) {
			//console.log('hover_class sig ' + sig);
			if (sig == '[c,s]') {
				var ctrl = a[0];
				var hover_class = a[1];
				ctrl.hover(function(e_in) {
					ctrl.add_class(hover_class);
				}, function(e_out) {
					ctrl.remove_class(hover_class);
				});
			}
		});

		// this is the enhanced HTML module.

		var group_hover_class = fp(function(a, sig) {
			// Could possibly recategorise into having an array if the sig as a bunch of objects of one type and then 
			//  a string.

			//poly2(a, sig);

			if (sig == '[a,s]') {
				// An array of items to put into the group.

				var res = group(a[0]);
				//console.log('res ' + tof(res));

				var hover_class = a[1];
				res.hover(function(e_in) {
					res.add_class(hover_class);
				}, function(e_out) {
					res.remove_class(hover_class);
				})

				return res;
			}

		});


	    var get_window_size = function() {
	        var winW, winH;
	        if (document.body && document.body.offsetWidth) {
	            winW = document.body.offsetWidth;
	            winH = document.body.offsetHeight;
	        }
	        if (document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth ) {
	            winW = document.documentElement.offsetWidth;
	            winH = document.documentElement.offsetHeight;
	        }
	        if (window.innerWidth && window.innerHeight) {
	            winW = window.innerWidth;
	            winH = window.innerHeight;
	        }
	        return [winW, winH];
	    }


		var findPos = function(obj) {
	        var curleft = curtop = 0;
	        if (obj.offsetParent) {
	            do {
	                curleft += obj.offsetLeft;
	                curtop += obj.offsetTop;
	            } while (obj = obj.offsetParent);
	            return [curleft,curtop];
	        }
	    }


	    // Make it a Data_Object so it can respond to events?
	   	var Selection_Scope = Data_Object.extend({
	    
	    //var Selection_Scope = jsgui.Class.extend({
	        'init': function(spec) {
	            // has its control.

	            // various controls point to it.

	            // has various methods to do with selecting and selecting objects
	            if (spec.control) this.control = spec.control;

	            // Needs to be a list / map of all controls that are selected.

	            // map of selected controls by id?

	            //  also need to be able to go through the list of controls.

	            this.map_selected_controls = {};

	            // set the items by their id to point to the control.
	            //  the control will know its index within its parent, can look up more info there.




	        },
	        'select_only': function(ctrl) {
	            //console.log('Selection_Scope select_only ' + ctrl._id());

	            // remove the selected class from all that are currently selected (except the target ctrl).
	            //console.log('this.map_selected_controls ', this.map_selected_controls);
	            each(this.map_selected_controls, function(i, v) {

	                if (v && v !== ctrl) {
	                    v.set('selected', false);
	                    v.remove_class('selected');

	                    //console.log('should have deselcted ' + v._id())
	                }
	            })

	            this.map_selected_controls = {};

	            this.map_selected_controls[ctrl._id()] = ctrl;

	            // and then tell the control that it's selected.

	            // could possibly set a CSS flag.
	            ctrl.set('selected', true);
	            ctrl.add_class('selected');

	            this.trigger('change');



	        },

	        // deselect controls internal to a control.

	        // When selecting a control, we want to make it so that controls inside it, in the same selection context are not selected.
	        //  The Selection Scope does a fair bit of the management of the selections.

	        'deselect_ctrl_content': function(ctrl) {
	            var cs = ctrl.get('selection_scope');
	            var msc = this.map_selected_controls;
	            var that = this;
	            ctrl.get('content').each(function(i, v) {
	                var tv = tof(v);
	                //console.log('tv ' + tv);

	                if (tv == 'control') {
	                    v.remove_class('selected');
	                    v.set('selected', false);

	                    var id = v._id();
	                    if (msc[id]) msc[id] = false;

	                    that.deselect_ctrl_content(v);
	                }
	            })
	            //console.log('msc ', msc);
	            this.trigger('change');
	            //throw 'stop';
	        },



	        'select_toggle': function(ctrl) {
	            //console.log('');
	            //console.log('select_toggle');
	            var sel = ctrl.get('selected');
	            //console.log('tof(sel) ' + tof(sel));

	            var msc = this.map_selected_controls;
	            var id = ctrl._id();
	            if (!sel) {
	                

	                var sel_anc = ctrl.find_selected_ancestor_in_scope();

	                if (sel_anc) {
	                    console.log('1) not selecting because a selected ancestor in the selection scope has been found.');
	                } else {
	                    ctrl.set('selected', true);
	                    // Check for a selected ancestor control in the scope.

	                    this.deselect_ctrl_content(ctrl);

	                    //  can try an iterate_ancestors function.

	                    //  iterate_ancestors_in_selection_scope
	                    //   looking for selected ancestor.

	                    // find_selected_ancestor_in_scope

	                    ctrl.add_class('selected');
	                    msc[id] = ctrl;
	                }

	                
	            } else {
	                var tsel = tof(sel);
	                //console.log('tsel ' + (tsel))
	                if (tsel == 'data_value') {
	                    var val = sel.get();
	                    //console.log('val ' + val);
	                    if (val) {
	                        ctrl.remove_class('selected');
	                        ctrl.set('selected', false);
	                        msc[id] = false;
	                    } else {
	                        var sel_anc = ctrl.find_selected_ancestor_in_scope();

	                        if (sel_anc) {
	                            console.log('2) not selecting because a selected ancestor in the selection scope has been found.');
	                        } else {
	                            ctrl.set('selected', true);
	                            // Check for a selected ancestor control in the scope.
	                            this.deselect_ctrl_content(ctrl);
	                            //  can try an iterate_ancestors function.

	                            //  iterate_ancestors_in_selection_scope
	                            //   looking for selected ancestor.

	                            // find_selected_ancestor_in_scope

	                            ctrl.add_class('selected');
	                            msc[id] = ctrl;
	                        }
	                    }
	                    //
	                }
	                if (tsel == 'boolean') {

	                    if (sel) {
	                        ctrl.remove_class('selected');
	                        ctrl.set('selected', false);
	                        msc[id] = false;
	                    } else {
	                        var sel_anc = ctrl.find_selected_ancestor_in_scope();

	                        if (sel_anc) {
	                            console.log('2) not selecting because a selected ancestor in the selection scope has been found.');
	                        } else {
	                            this.deselect_ctrl_content(ctrl);
	                            ctrl.set('selected', true);

	                            // Check for a selected ancestor control in the scope.

	                            //  can try an iterate_ancestors function.

	                            //  iterate_ancestors_in_selection_scope
	                            //   looking for selected ancestor.

	                            // find_selected_ancestor_in_scope

	                            ctrl.add_class('selected');
	                            msc[id] = ctrl;
	                        }
	                    }

	                }
	            }
	            this.trigger('change');
	            //throw 'stop';

	        }
	    })

		// Some of these will need to get a bit more complex with options, but they will also generally be transferrable among jsgui controls.

		// The outermost object will have selection scope
		//  That means that within it when there is a deselect_all command it deselects within that scope.

		// We could have an enhanced control too.

		// Perhaps replace the basic control in this case, so an upgraded control is always used.
		//  Would have more functionality to do with windows, setting up a control so that it's a window, with docking capability.

		// Perhaps more client-side capabilities should be here, like activate.

		var mapDomEventNames = {
            'click': true,
            'mousedown': true,
            'mouseup': true,
            'mousemove': true,
            'mouseover': true,
            'mouseout': true,
            'blur': true,
            'focus': true,
            'keydown': true,
            'keyup': true,
            'keypress': true,
            'contextmenu': true,

            'touchstart': true,
            'touchmove': true,
            'touchend': true,

            'abort': true,
			'canplay': true,
			'canplaythrough': true,
			'durationchange': true,
			'emptied': true,
			'ended': true,
			'error': true,
			'loadeddata': true,
			'loadedmetadata': true,
			'loadstart': true,
			'pause': true,
			'play': true,
			'playing': true,
			'progress': true,
			'ratechange': true,
			'seeked': true,
			'seeking': true,
			'stalled': true,
			'suspend': true,
			'timeupdate': true,
			'volumechange': true,
			'waiting': true

        };

        var id_before__ = function(id) {
            var pos1 = id.lastIndexOf('_');
            var res = id.substr(0, pos1);
            return res;
        }

        var num_after = function(id) {
            var pos1 = id.lastIndexOf('_');
            var res = parseInt(id.substr(pos1 + 1), 10);
            return res;
        }

		Control = jsgui.Control = jsgui.Control.extend({
			'fields': {
				'selection_scope': Object
			},

			'init': function(spec) {
				this._super(spec);
			},

			'bcr': fp(function(a, sig) {
	            //console.log('sig', sig);
	            if (sig == '[]') {
	                var el = this.get('dom.el');

	                
	                var bcr = el.getBoundingClientRect();
	                var res = [[bcr.left, bcr.top], [bcr.right, bcr.bottom], [bcr.width, bcr.height]];

	                return res;
	            }
	        }),

	        'activate_recursive': function(el_param) {
	            console.log('activate_recursive');


	            // Going to change this function in the client build, it should first map controls inside this one
	            //var max_typed_ids = {};
	            var max_typed_ids = jsgui.max_typed_ids || {};
	            var map_jsgui_els = jsgui.map_jsgui_els || {};
		        var map_jsgui_types = jsgui.map_jsgui_types || {};
		        var arr_controls = jsgui.arr_controls || [];

	            var el = this.get('dom.el');
	            if (!el) el = this.set('dom.el', el_param);

	            var context = this._context;
	            var map_controls = context.map_controls;


	            recursive_dom_iterate(el, function(el) {
		            //console.log('2) el.tagName ' + el.tagName);
		            var nt = el.nodeType;
		            //console.log('nt ' + nt);

		            // So for the 'HTML' tag name...
		            //  We should make a control for the HTML document - or it should get activated.



		            if (nt == 1) {
		                var jsgui_id = el.getAttribute('data-jsgui-id');
		                // Give the HTML document an ID?


		                //console.log('jsgui_id ' + jsgui_id);
		                if (jsgui_id) {
		                    var ib = id_before__(jsgui_id);
		                    var num =  num_after(jsgui_id);
		                    if (!max_typed_ids[ib]) {
		                        max_typed_ids[ib] = num;
		                    } else {
		                        if (num > max_typed_ids[ib]) max_typed_ids[ib] = num;
		                    }

		                    map_jsgui_els[jsgui_id] = el;
		                    var jsgui_type = el.getAttribute('data-jsgui-type');
		                    //console.log('jsgui_type ' + jsgui_type);
		                    map_jsgui_types[jsgui_id] = jsgui_type;
		                    //console.log('jsgui_type ' + jsgui_type);
		                }
		            }
		        });
		        context.set_max_ids(max_typed_ids);

		        each(map_jsgui_els, function(jsgui_id, el) {
		            //console.log('jsgui_id ' + jsgui_id);
		            //console.log('3) el.tagName ' + el.tagName);
		            var l_tag_name = el.tagName.toLowerCase();
		            if (jsgui_id) {
		                var type = map_jsgui_types[jsgui_id];
		                //console.log('type ' + type);
		                //var cstr = jsgui.constructor_from_type(type);

		                //var cstr = jsgui.constructor_from_type(type);

		                //console.log('cstr ' + cstr);

		                // use the context's map_Controls

		                var Cstr = context.map_Controls[type];
		                //console.log('Cstr ' + Cstr.prototype);

		                // then we can construct the control, and put it within the map.
		                //  A later stage of activation will recreate the relationships between the controls.

		                // OK, but have we got variables to initialize the controls with?
		                //  It would maybe be most efficient to take delivery of them as one object.
		                //   With just the control types and the data contained in them we can do a lot of reconstruction of the actual controls.

		                // With the object viewer, we can even reconstruct the initial object from the rendered view.
		                //  Not sure quite how much point there is in doing that. May work out most efficient because 1st view is prerendered and
		                //  it does not need to send the data twice.
		                // Eg can hook up the key (viewer), the value (viewer) and the comma.

		                // for the document element we specifically add the control to the context.



		                if (Cstr) {
		                	var ctrl = new Cstr({
			                    'context': context,
			                    '_id': jsgui_id,
			                    'el': el
			                })
			                map_controls[jsgui_id] = ctrl;
			                arr_controls.push(ctrl);

			                //console.log('el.tagName', el.tagName);

			                if (l_tag_name === 'html') {
			                	//console.log('el is document root el');

			                	// The html element represents the root of a document.
			                	//throw '2) stop';

			                	context.ctrl_document = ctrl;
			                }
		                } else {
		                	console.log('Missing context.map_Controls for type ' + type + ', using generic Control');
		                	var ctrl = new Control({
			                    'context': context,
			                    '_id': jsgui_id,
			                    'el': el
			                })
			                map_controls[jsgui_id] = ctrl;
			                arr_controls.push(ctrl);

		                }

		                
		                //console.log('jsgui_id ' + jsgui_id);
		                //console.log('ctrl._id() ' + ctrl._id());
		                
		            }
		            // get the constructor from the id?
		        });



	            recursive_dom_iterate_depth(el, function(el2) {
	                //console.log('el ' + el);
	                var nt = el2.nodeType;
	                //console.log('nt ' + nt);
	                if (nt == 1) {
	                    var jsgui_id = el2.getAttribute('data-jsgui-id');


	                    console.log('jsgui_id ' + jsgui_id);
	                    if (jsgui_id) {


	                        
	                        var ctrl = map_controls[jsgui_id];
	                        console.log('ctrl ' + ctrl);

	                        // don't want to activate twice.

	                        // specifically avoid activating twice?


	                        //if (el2 != el) {
	                        //    //ctrl.activate(el2);
	                        //}

	                        if (ctrl && !ctrl.__active) ctrl.activate(el2);

	                        

	                        //console.log('jsgui_type ' + jsgui_type);
	                    }
	                }
	            })
	        },

	        'add_event_listener': fp(function(a, sig) {

	            /*
	            var el = this.get('dom.el');
	            if (el) {
	                
	                // Check if the element has that event listener...
	                //  Maybe maintain a map within the control of which DOM functions have been bound to the element.



	                el.addEventListener(event_name, handler, false);
	            }
	            */

	            // In enh - with this only working post-activation?

	            // see http://www.w3schools.com/tags/ref_av_dom.asp
	            /*
	            abort	Fires when the loading of an audio/video is aborted
				canplay	Fires when the browser can start playing the audio/video
				canplaythrough	Fires when the browser can play through the audio/video without stopping for buffering
				durationchange	Fires when the duration of the audio/video is changed
				emptied	Fires when the current playlist is empty
				ended	Fires when the current playlist is ended
				error	Fires when an error occurred during the loading of an audio/video
				loadeddata	Fires when the browser has loaded the current frame of the audio/video
				loadedmetadata	Fires when the browser has loaded meta data for the audio/video
				loadstart	Fires when the browser starts looking for the audio/video
				pause	Fires when the audio/video has been paused
				play	Fires when the audio/video has been started or is no longer paused
				playing	Fires when the audio/video is ready to play after having been paused or stopped for buffering
				progress	Fires when the browser is downloading the audio/video
				ratechange	Fires when the playing speed of the audio/video is changed
				seeked	Fires when the user is finished moving/skipping to a new position in the audio/video
				seeking	Fires when the user starts moving/skipping to a new position in the audio/video
				stalled	Fires when the browser is trying to get media data, but data is not available
				suspend	Fires when the browser is intentionally not getting media data
				timeupdate	Fires when the current playback position has changed
				volumechange	Fires when the volume has been changed
				waiting	Fires when the video stops because it needs to buffer the next frame

				abort
				canplay
				canplaythrough
				durationchange
				emptied
				ended
				error
				loadeddata
				loadedmetadata
				loadstart
				pause
				play
				playing
				progress
				ratechange
				seeked
				seeking
				stalled
				suspend
				timeupdate
				volumechange
				waiting
				*/


	            

	            // So, it should also bind the event to the control, so a listener will hear that.

	            // But does this apply itself???
	            this._super.apply(this, a);

	            // then if it appears in the dom events, attach it.

	            if (sig == '[s,f]') {
	                var event_name = a[0];
	                if (mapDomEventNames[a[0]]) {
	                    //console.log('we have a DOM event: ' + event_name);

	                    var listener = this.mapListeners[event_name];
	                    var that = this;
	                    var el = this.get('dom.el');

	                    //console.log('el' + el);

	                    if (el) {
	                        if (!listener) {
	                            // a single listener called when a bound dom event fires.
	                            //  this will then split up the event calls to everything that is listening to this.
	                            // for the DOM event on the object, we raise the event on the control.

	                            listener = this.mapListeners[event_name] = function(e) {
	                                //console.log('event_name heard ' + event_name);

	                                // Raising an event, there could be multiple listeners.
	                                //  would be good to get an array of what the listeners returned.
	                                //  Return false here if any of them return false?



	                                var res_raise = that.raise(event_name, e);
	                                //console.log('res_raise', res_raise);

	                                // then if any results are false, we return false.

	                                var any_are_false = false;
	                                var c = 0, l = res_raise.length;

	                                while (!any_are_false && c < l) {
	                                    if (res_raise[c] === false) {
	                                        any_are_false = true;
	                                    }

	                                    c++;
	                                }

	                                //console.log('any_are_false', any_are_false);

	                                if (any_are_false) {
	                                    e.preventDefault();
	                                    return false;
	                                }
	                                // Would like to respond to the event.
	                                //  Eg if the dom event handler returns false, it would be good to return false in the listener.



	                            };
	                            el.addEventListener(event_name, listener, false);

	                        }
	                    }
	                }
	            }
	        }),

	        // not recursive
	        'activate': function(el) {
	        	console.log('enh ctrl activate el', el);

	            this.__active = true;
	            if (el) {
	            	console.log('setting dom el');
	                this.set('dom.el', el);
	            }

	            //console.log('activate ' + this._id());
	            // activate content controls.
	            this.activate_dom_attributes();
	            this.activate_content_controls();

	            // then is there is a selection_scope as true, create a new Selection_Scope object, then set it so that subcontrols point
	            //  to it with their selection_scope property.

	            // so after the fields have been set up.

	            this.activate_content_listen();

	            // Activate style change listen?
	            //  Or generally dom attributes change listen?

	            this.activate_other_changes_listen();


	        },
	        'activate_other_changes_listen': function() {

	        	/*
	        	var style = this.get('dom.attributes.style');

	        	console.log('style', style);

	        	style.on('change', function(e_change) {
	        		console.log('style change', e_change);
	        	})
				*/
				var dom_attributes = this.get('dom.attributes');
				//console.log('dom_attributes', dom_attributes);

				var el = this.get('dom.el');

				dom_attributes.on('change', function(e_change) {
					var property_name = e_change.name, dval = e_change.value;

					//console.log('dom_attributes change', property_name, dval);

					/*
					if (property_name == 'style') {
						// need to update it on the element.

						if (tof(dval) == 'string') {
							el.setAttribute('style', dval);
						} else {
							el.setAttribute('style', dval.value());
						}
					} else if (property_name == 'class') {
						// need to update it on the element.

						if (tof(dval) == 'string') {
							el.setAttribute('class', dval);
						} else {
							el.setAttribute('class', dval.value());
						}
					}
					*/

					// I think this works better, 02/05/14

					if (tof(dval) == 'string') {
						//el.setAttribute('style', dval);
					} else {
						//el.setAttribute('style', dval.value());

						dval = dval.value();
					}

					el.setAttribute(property_name, dval);



				});


	        },
	        'activate_content_listen': function() {
	        	//console.log('activate_content_listen');

	        	var content = this.get('content');
	        	var that = this;
	        	

	        	// var el = that.get('dom.el');

	            content.on('change', function(e_change) {
	            	console.log('activated control content change');

	            	var el = that.get('dom.el');
	            	var type = e_change.type;

	            	if (type == 'insert') {
	            		//console.log('control content change');
		                //console.log('e_change ', e_change);
		                //item._.parent = that;
	                    //item._.index = position;

	                    // need to put it into the dom...

	                    // basically, need to render it to an element, or document fragment.
	                    //  then put it into the DOM.

	                    // ctrl.render_to_element?
	                    
	                    //var p = el.parentNode;
	                    var item = e_change.item;
	                    var itemDomEl = item.get('dom.el');
	                    //console.log('e_change.item._context', item._context);
	                    if (!itemDomEl) {
	                        //itemDomEl = e_change.item._context.document.createElement(e_change.item.get('dom.tagName'));
	                        // render the 

	                        // Are items not activated with contexts?

	                        var temp_div = e_change.item._context.document.createElement('div');
	                        temp_div.innerHTML = e_change.item.all_html_render();
	                        itemDomEl = temp_div.childNodes[0];

	                        e_change.item.set('dom.el', itemDomEl);
	                    };
	                    //console.log('itemDomEl', itemDomEl);

	                    //el.insertBefore(itemDomEl, el.childNodes[0]);
	                    el.appendChild(itemDomEl);
	            	}

	            	if (type == 'clear') {
	            		el.innerHTML = '';
	            	}


	            });
	        },
	        'activate_dom_attributes': function() {
	            var el = this.get('dom.el');
	            console.log('el', el);

	            // may not have el....?
	            var that = this;
	            var dom_attributes = this.get('dom.attributes');
	            for (var i = 0, attrs = el.attributes, l = attrs.length; i < l; i++){
				    //arr.push(attrs.item(i).nodeName);
				    var item = attrs.item(i);
				    //console.log('item', item);

				    //console.log('item.name', item.name);
				    //console.log('item.value', item.value);

				    var name = item.name;
				    var value = item.value;

				    if (name == 'data-jsgui-id') {
				    	// Handled elsewhere - not so sure it should be but won't change that right now.
				    } else if (name == 'data-jsgui-type') {
				    	// ^
				    } else if (name == 'style') {

				    	//console.log('inline style value', value);

				    	// Need to parse that style value.
				    	//  Put it into the control's inline style dict.

				    	//._icss

				    	//console.log('1) ._icss', this._icss);

				    	var map_inline_css = this._icss;

				    	var arr_style_items = value.split(';');
				    	//console.log('arr_style_items', arr_style_items);

				    	//each(arr_style_items)
				    	for (var c = 0, l2 = arr_style_items.length; c < l2; c++) {
				    		//map_inline_css[]

				    		var style_item = arr_style_items[c];
				    		//var style_item_name = 
				    		var arr_style_item = style_item.split(':');

				    		if (arr_style_item[0]) {
				    			map_inline_css[arr_style_item[0]] = arr_style_item[1];
				    		}
				    	}

				    	//console.log('2) ._icss', this._icss);

				    	// and the dom.attributes.style will get set from the ._icss as a later point.




				    	// ^
				    } else if (name == 'data-jsgui-fields') {
				    	var str_properties = value;

				    	if (str_properties) {
			                //console.log('str_ctrl_fields ' + str_ctrl_fields);
			                //console.log('str_properties', str_properties);
			                //var s_pre_parse = str_properties.replace(/'/g, '"').replace(/♥/g, '\'').replace(/☺/g, '"');
							var s_pre_parse = str_properties.replace(/\[DBL_QT\]/g, '"').replace(/\[SNG_QT\]/g, '\'').replace(/'\'/g, '"');


			                // DBL_QT
			                console.log('s_pre_parse', s_pre_parse);

			                var props = JSON.parse(s_pre_parse);
			                //console.log('props ' + stringify(props));
			                //throw 'stop';
			                this.set(props);

			                // Could be set through flags?

			                //  We can set it to be a selection scope at an earlier stage, on the server,
			                //  and tell it to retain that information going to the client, so that when it is activated there
			                //  it is also a selection scope.

			                // I think another useful function would just set the selection scope to be at the current level.

			                // ctrl.selection_scope(ctrl);
			                //  otherwise it could be getting the selection scope.
			                //  nice set syntax, consistant with other code too.


			                var ss = this.get('selection_scope');
			                //console.log('ss ' + ss);
			                // if we have the selection scope, better to create a proper Selection_Scope object.

			                if (ss && ss.value() === true) {
			                    // will create a proper selection scope

			                    var selection_scope = new Selection_Scope({
			                        'control': this
			                    });

			                    this.set('selection_scope', selection_scope);
			                    //throw 'stop';
			                }

			                //if (ss) throw 'stop';

			                //throw 'sty';

			            }
				    } else {
				    	// set the dom attributes value... silent set?

				    	dom_attributes.set(name, value);
				    }

				}

				/*


	            var cls = el.className;

	            //console.log('cls ' + cls);
	            var aCls = cls.split(' ');


	            if (aCls.length > 0) {
	                // can use a map of the css classes.
	                //  faster to add and remove.

	                var map_classes = jsgui.get_truth_map_from_arr(aCls);

	                this.set('dom.attributes.class', map_classes);
	            }

	            // Need to read through all of the DOM atributes.
	            //  


	            var str_properties = el.getAttribute('data-jsgui-fields');
	            //console.log('str_properties', str_properties);
	            if (str_properties) {
	                //console.log('str_ctrl_fields ' + str_ctrl_fields);
	                //console.log('str_properties', str_properties);
	                var props = JSON.parse(str_properties.replace(/'/g, '"'));
	                //console.log('props ' + stringify(props));
	                //throw 'stop';
	                this.set(props);

	                // Could be set through flags?

	                //  We can set it to be a selection scope at an earlier stage, on the server,
	                //  and tell it to retain that information going to the client, so that when it is activated there
	                //  it is also a selection scope.

	                // I think another useful function would just set the selection scope to be at the current level.

	                // ctrl.selection_scope(ctrl);
	                //  otherwise it could be getting the selection scope.
	                //  nice set syntax, consistant with other code too.


	                var ss = this.get('selection_scope');
	                //console.log('ss ' + ss);
	                // if we have the selection scope, better to create a proper Selection_Scope object.

	                if (ss && ss.value() === true) {
	                    // will create a proper selection scope

	                    var selection_scope = new Selection_Scope({
	                        'control': this
	                    });

	                    this.set('selection_scope', selection_scope);
	                    //throw 'stop';
	                }

	                //if (ss) throw 'stop';

	                //throw 'sty';

	            }
	            */
	        },
	        'hide': function() {
	        	// set the style to hidden.
	        	//  Could add a hidden class.

	        	//  I think a variety of tests on styling would make sense.

	        	// Want to set styles with easy syntax.

	        	// ctrl.style(style_name, value);
	        	//  I think the Control needs to maintain its own dict or data structure of its inline styles.
	        	//   These could get rendered differently to dom.attributes.style.

	        	// Or, the dom.sttributes.style gets producted from the jsgui styles that are set.
	        	//  These styles could also operate a bit differently, or be rendered differently to account for browser differeces.
	        	// Eg with rounded corners, could use a polyfill for earlier browsers.

	        	// Will interact with dom.attributes.style.

	        	// When active, needs to respond to changes in dom.attributes etc
	        	//  Will need to listen for those changes and re-render as appropriate.


	        	this.add_class('hidden');
	        	// Probably needs a lower level index / system of maintaining the classes - think it has one now apr 2014







	        },
	        'show': function() {
	        	this.remove_class('hidden');

	        },

	        'context_menu': fp(function(a, sig) {
	        	var menu_def;
	        	if (sig == '[o]' || sig == '[a]') {
	        		menu_def = a[0];
	        	}



	        	var Context_Menu = Context_Menu || require('./controls/advanced/context-menu');

	        	var context_menu;
	        	var that = this;

	        	// Need it so that the context menu gets removed when it should.
	        	//  Any mouseup event causes it to vanish.

	        	var ctrl_html_root = this._context.ctrl_document;

	        	var body = ctrl_html_root.body(); 

	        	var show_context_menu = fp(function(a, sig) {


	        		var pos;


	        		if (sig == '[a]') {
	        			// A position?

	        			pos = a[0];

	        		}

	        		console.log('show_context_menu pos:', pos);

	        		//console.log('show_context_menu');

	        		//console.log('Context_Menu', Context_Menu);
	        		console.log('context_menu', context_menu);
	        		if (!context_menu) {
	        			//console.log('menu_def', menu_def);

	        			context_menu = new Context_Menu({
	        				'context': that._context,
	        				'value': menu_def
	        			});

	        			if (pos) {
	        				context_menu.style({
		        				'left': (pos[0] - 1) + 'px',
		        				'top': (pos[1] - 1) + 'px'
		        			});
		        			
	        			} else {
	        				context_menu.style({
		        				'left': '100px',
		        				'top': '100px'
		        			});

	        			}

	        			

	        			// Then put it into the dom.

	        			// Need to render it?
	        			//  Add it to the document Control's body (the body control) and then
	        			//  the rendering should be done automatically.

	        			// Not sure I can get the body control like that.
	        			// A different way to get the body?
	        			//  Make a body function?

	        			var context = that._context;
	        			//console.log('context', context);


	        			// The context should have access to the document and body controls?
	        			//  There is already the document reference.


	        			// Should have both the document and the document control available in the Page_Context.


	        			// It should find the body...
	        			//console.log('context.ctrl_document', context.ctrl_document);

	        			
	        			//console.log('body', body);

	        			setTimeout(function() {
	        				body.add(context_menu);

	        				setTimeout(function() {

				        		ctrl_html_root.one('mouseup', function(e_mouseup) {
				        			console.log('');
				        			console.log('one mouseup');
				        			if (context_menu) {
				        				context_menu.remove();
				        			}
				        		});
	        				}, 20)

	        			}, 0);
	        			

	        			// I think we need another demo / test of dynamically adding content to a control.
	        			//  Should try insert as well as add.

	        			// Want the coder to update it within the control system, the framework renders and inserts into the DOM as necessary.

	        			//console.log('post add context menu to body');

	        		} else {

	        			if (pos) {
	        				context_menu.style({
		        				'left': (pos[0] - 1) + 'px',
		        				'top': (pos[1] - 1) + 'px'
		        			});
		        			
	        			} else {
	        				context_menu.style({
		        				'left': '100px',
		        				'top': '100px'
		        			});

	        			}

	        			setTimeout(function() {
	        				//console.log('pre add context menu');
	        				body.add(context_menu);

	        				setTimeout(function() {

				        		ctrl_html_root.one('mouseup', function(e_mouseup) {
				        			console.log('');
				        			console.log('one mouseup');
				        			if (context_menu) {
				        				context_menu.remove();
				        			}
				        		});
	        				}, 20)

	        			}, 0);


	        		}

	        	});



	        	// Respond to right clicks only.

	        	this.on('click', function(e_click) {
	        		console.log('e_click', e_click);
	        	})

	        	this.on('contextmenu', function(e_contextmenu) {
	        		//console.log('e_contextmenu', e_contextmenu);
	        		return false;
	        		//console.log('e_click', e_click);
	        	})




	        	this.on('mousedown', function(e_mousedown) {
	        		//console.log('e_mousedown', e_mousedown);

	        		var int_button = e_mousedown.which;

	        		if (int_button == 3) {
	        			e_mousedown.preventDefault();
	        			window.event.returnValue = false;
	        			return false;
	        		}
	        	})

	        	this.on('mouseup', function(e_mouseup) {
	        		//console.log('e_mouseup', e_mouseup);

	        		var int_button = e_mouseup.which;

	        		if (int_button == 3) {
	        			console.log('right button');
	        			e_mouseup.preventDefault();
	        			window.event.returnValue = false;

	        			// Need to work out the position of the click.

	        			// pageX, pageY

	        			var pos = [e_mouseup.pageX, e_mouseup.pageY];


	        			show_context_menu(pos);

	        			return false;
	        		}
	        	})

	        	// Create a context menu with those nodes.

	        	// When control is right clicked on, create and show a context menu?
	        	//  I think keeping the menu within the control, rendered by hidden would work. Maybe?
	        	//  Or easier to show in an overlay if it is generated?
	        	//  I think absolute positioning would be OK, but then it could run into problems with the element's overflow: hidden
	        	//  So rendering in an absolute div may make the most sense.
	        	//   Could then keep the DOM el once it exists.

	        	// This would mean Context_Menu would be a requirement of html-enh, which means a whole load of other
	        	//  components could also fit in that space in the heirachy, logically.






	        }),
	        'activate_content_controls': function() {

	        	//console.log('activate_content_controls');
	            // needs to have an el.

	            // Every internal control has its selection scope set?

	            //  Or it can find the selection scope by moving upwards through the heirachy when needed?




	            var el = this.get('dom.el');
	            var context = this._context;

	            var ctrl_fields = {};
	            var that = this;

	            var str_ctrl_fields = el.getAttribute('data-jsgui-ctrl-fields');
	            if (str_ctrl_fields) {
	                //console.log('str_ctrl_fields ' + str_ctrl_fields);
	                ctrl_fields = JSON.parse(str_ctrl_fields.replace(/'/g, '"'));

	            }

	            //console.log('ctrl_fields ' + stringify(ctrl_fields));

	            //var fields_ctrl = {};
	            //var selection_scope;

	            each(ctrl_fields, function(i, v) {
	            	//fields_ctrl.set(i, v);

	               	//fields_ctrl[v] = i;
	               	var referred_to_control = context.map_controls[v];
	               	//console.log('referred_to_control', referred_to_control);

	               	that.set(i, referred_to_control);


	            })
	            // context.map_controls



	            //var ss = this.get('selection_scope');
	            //console.log('ss ' + ss);
	            //if (ss) throw 'stop';

	            

	            //console.log('fields_ctrl ' + stringify(fields_ctrl));

	            // the other controls will have already been registered, even if they are not active controls.

	            // Register, activate

	            //console.log('el ' + el);

	            // Works in an overly complicated way?


	            var cns = el.childNodes;

	            
	            

	            var content = this.get('content');

	            for (var c = 0, l = cns.length; c < l; c++) {
	                var cn = cns[c];

	                var nt = cn.nodeType;
	                //console.log('* nt ' + nt);
	                if (nt == 1) {
	                    var cn_jsgui_id = cn.getAttribute('data-jsgui-id');
	                    //console.log('cn_jsgui_id ' + cn_jsgui_id);

	                    var cctrl = context.map_controls[cn_jsgui_id];
	                    //console.log('cctrl ' + stringify(cctrl));
	                    //content.push(cctrl);
	                    // OK, but when adding content it will be good to know what index the content goes to.
	                    //  maybe this.add would be better.

	                    content.push(cctrl);

	                    // need to be able to get from a control:
	                    // _parent()
	                    // _index()

	                    // Though there could be a more complicated relationships system, I think keeping that simple API would be good.

	                    // or just .parent()
	                    // .index()

	                    // not sure that ._id() was so well named... but anyway.

	                    //
	                    //if (fields_ctrl[cn_jsgui_id]) {
	                    //    //console.log('fields_ctrl[cn_jsgui_id] ' + fields_ctrl[cn_jsgui_id]);
	                    //    that.set(fields_ctrl[cn_jsgui_id], cctrl);
	                    //}

	                    // Not doing recursive selection scope setting here?
	                }
	                if (nt == 3) {
	                    // text
	                    var val = cn.nodeValue;
	                    //console.log('val ' + val);
	                    content.push(val);

	                }
	                // we can get the ctrl reference

	            }

	        },

			// make full height.
			//  makes the control take the rest of the height of the window.

			'drag': function(fn_mousedown, fn_begin, fn_move, fn_end) {

	            var screen_down_x, screen_down_y;

	            // Want ways of restricting or cancelling a drag.
	            var ctrl_html_root = this._context.ctrl_document;


	            this.add_event_listener('mousedown', function(e) {
	                //console.log('hover mouseover');

	                //console.log('drag mousedown ', e);

	                screen_down_x = e.screenX;
	                screen_down_y = e.screenY;

	                //var moved = false;
	                var drag_initiated = false;

	                fn_mousedown(e);

	                var first = true;

	                var handle_move = function(e) {

	                    console.log('handle_move');

	                    var screen_move_x = e.screenX;
	                    var screen_move_y = e.screenY;

	                    var screen_offset_x = screen_move_x - screen_down_x;
	                    var screen_offset_y = screen_move_y - screen_down_y;

	                    if (first) {
	                    	ctrl_html_root.add_class('cursor-default');
	                    	first = false;
	                    }

	                    // Screen movement offset.

	                    // Anyway, we need the position within the div / element where the mouse went down.
	                    //  We use that to calculate the position to move the control to, we need to take account of that inital offset.



	                    // could find the position of the srcElement.

	                    // that may be better.
	                    //  then we use the client x and client y properties to determine the offset into the item clicked.



	                    //console.log('screen_offset_x', screen_offset_x, 'screen_offset_y', screen_offset_y);

	                    // but we already have an offset property from the event.

	                    // maybe call our new one a movement offset.



	                    var e = {
	                        'offsetX': screen_offset_x,
	                        'offsetY': screen_offset_y,
	                        'screenX': screen_move_x,
	                        'screenY': screen_move_y,
	                        'clientX': e.clientX,
	                        'clientY': e.clientY,
	                        'pageX': e.pageX,
	                        'pageY': e.pageY
	                    }

	                    if (!drag_initiated) {

	                        //see how far it is...

	                        // want to use a function that calculates the magnitude of the distance.

	                        var dbp = jsgui.distance_between_points([[0, 0], [screen_offset_x, screen_offset_y]]);

	                        //console.log('dbp ' + dbp);

	                        // drag_initiation_distance

	                        var drag_initiation_distance = 16;
	                        if (dbp >= 16) {
	                            drag_initiated = true;
	                            ctrl_html_root.add_class('dragging');
	                            //ctrl_html_root.add_class('cursor-default');

	                            fn_begin(e);
	                            
	                        }


	                        // can just use the magnitude of the offset.
	                        //  dbp taking just 2 values...



	                        
	                    }

	                    if (drag_initiated) {
	                        fn_move(e);
	                    }

	                    
	                }

	                var handle_mouseup = function(e) {
	                    //document.removeEventListener('mousemove', handle_move);
	                    //document.removeEventListener('mouseup', handle_mouseup);

	                    ctrl_html_root.off('mousemove', handle_move);
	                	ctrl_html_root.off('mouseup', handle_mouseup);

	                	ctrl_html_root.remove_class('dragging');
	                	ctrl_html_root.remove_class('cursor-default');

	                    var screen_mouseup_x = e.screenX;
	                    var screen_mouseup_y = e.screenY;

	                    var screen_offset_x = screen_mouseup_x - screen_down_x;
	                    var screen_offset_y = screen_mouseup_y - screen_down_y;

	                    console.log('screen_offset_x', screen_offset_x, 'screen_offset_y', screen_offset_y);

	                    var e = {
	                        'offsetX': screen_offset_x,
	                        'offsetY': screen_offset_y
	                    }
	                    fn_end(e);

	                }

	                ctrl_html_root.on('mousemove', handle_move);
	                ctrl_html_root.on('mouseup', handle_mouseup);

	                //document.addEventListener('mousemove', handle_move, false);
	                //document.addEventListener('mouseup', handle_mouseup, false);


	                //fn_in();
	            })
	        },

	        'drag_handle_to': function(ctrl) {
	            // Also involved with drag and drop actions.

	            // could use the lower level drag(3) function.
	            //  would handle initializaing the drag, stopping it.

	            // another piece of code deals with dragging something representing a copy, we don't want that here.
	            //  want to move the window.

	            // and can drag another control.

	            // maybe want to make a few lower level drag functions?
	            console.log('drag_handle_to');
	            var mousedown_offset_from_ctrl_lt;

	            var ctrl_el = ctrl.get('dom.el');
	            // could go in enhanced....

	            this.drag(function(e_mousedown) {
	                //console.log('e_mousedown', e_mousedown);


	                // This will need to be revised - making adjustment for when dragging from an anchored position.
	                //  Should maintain some info about the drag so it knows if it starts/ends anchored anywhere.
	                var target = e_mousedown.target;

	                // want to get the position within the thing it's a handle to?

	                // will need to do a bit of position calculation to get it to work.

	                var targetPos = findPos(target);
	                console.log('targetPos ' + stringify(targetPos));

	                var ctrl_el_pos = findPos(ctrl.get('dom.el'));

	                // and use the client x, client y

	                // or page x page y?

	                var e_pos_on_page = [e_mousedown.pageX, e_mousedown.pageY];

	                // then subtract the vectors.

	                //var offset_within_target = jsgui.v_subtract(e_pos_on_page, targetPos);
	                mousedown_offset_from_ctrl_lt = jsgui.v_subtract(e_pos_on_page, ctrl_el_pos);
	                //console.log('mousedown_offset_from_ctrl_lt ' + stringify(mousedown_offset_from_ctrl_lt));

	                // not bad...

	                // notify the page context.
	                //  Will notify the page context when control gets moved too.
	                //   The page context could arrange other things, like tell a control with a drop zone to get ready?
	                //    Or that control responds to the mouseover event because it is a drop zone?

	                // The Page_Context may get told about a few things, but only then send on messages where necessary.





	            }, function(e_begin) {
	                // also want the position of mousedown.

	                // we could get that with a mousedown event.


	                // could get a measurement of the size height.
	                //  also know if it is docked or not.

	                var ctrlSize = ctrl.size();
	                console.log('ctrlSize', ctrlSize);

	                var anchored_to = ctrl.get('anchored_to');
	                //console.log('anchored_to', anchored_to);

	                if (!anchored_to) {
	                    //ctrl.set('unanchored_size', ctrlSize);
	                } else {
	                    // need to unanchor it.
	                    ctrl.unanchor();

	                    /*
	                    var unanchored_size = ctrl.get('unanchored_size');
	                    console.log('unanchored_size', unanchored_size);

	                    ctrl.size(unanchored_size);
	                    ctrl.style({
	                        'position': 'absolute'
	                    })
	                    */
	                }


	                console.log('drag handle to drag begin');


	                //throw 'stop';

	                // need to make it absolutely positioned, size it.



	            }, function(e_move) {

	                console.log('move event');
	                // need to reposition the control.
	                //  will mean adjusting some inline style.

	                // could do with more jsgui work on dealing with styles.
	                //  both conventional styles
	                //  and a style abstraction.

	                // set the style on the control.

	                // another style abstraction system would be quite useful, not called style....
	                // .form? Seems confusing with html for.
	                // .appearance - too long
	                // .flair?

	                // or just .style, but these are jsgui style abstractions.
	                //  so we can have it put in the rounded edges within a DIV in IE6, but it does change the layout in general.

	                // style polyfill? shim?

	                // maybe want to specify corners in jsgui - that is a style abstraction.

	                var clientX = e_move.clientX;
	                var clientY = e_move.clientY;

	                //var pageX = e_move.pageX;
	                //var pageY = e_move.pageY;

	                //console.log('pre set ctrl style');

	                // the style within the dom attributes?

	                // I think .form would be good instead of .style.
	                //  .form would be like .style but the style abstraction.

	                // Perhaps being able to access .style makes sense for controls though.

	                // Need to deal properly with offsets.

	                //  

	                // width of the control.

	                // want ctrl.width() to produce the result, but that will need more work.



	                // Also need to clamp it within page constraints.

	                var window_size = get_window_size();


	                var ctrl_pos = jsgui.v_subtract([clientX, clientY], mousedown_offset_from_ctrl_lt);

	                // But then act differently if we are dragging from an anchored position.
	                //  The mousedown offset within the control won't be so relevant - 
	                //   or won't be the only factor.

	                // Take account of position_adjustment
	                //  or offset_adjustment

	                var offset_adjustment = ctrl.get('offset_adjustment');
	                console.log('offset_adjustment', offset_adjustment);

	                if (offset_adjustment) {
	                    // want to find out what zone it is anchored in.

	                    ctrl_pos = jsgui.v_add(ctrl_pos, offset_adjustment);

	                    //
	                }
	                /*
	                var unanchored_offset = ctrl.get('unanchored_offset');
	                console.log('unanchored_offset', unanchored_offset);

	                if (unanchored_offset) {
	                    // want to find out what zone it is anchored in.
	                    var anchored_to = ctrl.get('anchored_to');
	                    var zone = anchored_to[2];

	                    console.log('zone', zone);

	                    if (zone == 'left' || zone == 'top' || zone == 'bottom') {
	                        ctrl_pos = jsgui.v_add(ctrl_pos, [unanchored_offset[0], 0]);
	                    }


	                    //
	                }
	                */


	                if (ctrl_pos[0] < 0) ctrl_pos[0] = 0;
	                if (ctrl_pos[1] < 0) ctrl_pos[1] = 0;

	                // clamping it so the right does not go outside the screen is more difficult.
	                // mousedown_offset_from_ctrl_lt

	                //console.log(window_size[0] - mousedown_offset_from_ctrl_lt[0]);


	                var ow = ctrl_el.offsetWidth;
	                var oh = ctrl_el.offsetHeight;
	                

	                if (ctrl_pos[0] > window_size[0] - ow) ctrl_pos[0] = window_size[0] - ow;
	                if (ctrl_pos[1] > window_size[1] - oh) ctrl_pos[1] = window_size[1] - oh;



	                //ctrl.style({
	                //    'left': pageX + 'px',
	                //    'top': pageY + 'px'
	                //});
	                
	                ctrl.style({
	                    'left': ctrl_pos[0] + 'px',
	                    'top': ctrl_pos[1] + 'px'
	                });


	                // If the ctrl is anchored, we need to unanchor it.



	                // as well as that, tell the control's context.
	                //  That could do things like scan for it being in an outside border.

	                ctrl._context.move_drag_ctrl(e_move, ctrl);

	                // so the context has been notified.
	                //  It can check for various things like the mouse being in an outer border region.

	                //  Other controls could check for the mouse being above them.





	                // also, it's worth telling the context about the drag.

	                // There could be docking regions set up.
	                //  Also, there could be different ways of implementing this.
	                //  I think comparing to the edge of the document.
	                //   Checking the cursor position in relation to the width of the screen.
	                //   Seeing if it is in an outer section.
	                //    If so, we can have a docking indication.

	                // Want to define the docking areas.
	                //  May need to dock an item next to another one.
	                //   So possibly invisible docking divs would help.

	                // This could also use a bit of a collision detection algorithm.

	                // Anyway, to start with the flexigrid should be able to dock to the top, left, bottom, or right.

	                // May be necessary to move the main content around, creating panels on the edges where the docked control stays.
	                //  I think rearranging the page layout using more than just the docked control will be necessary.

	                // Being able to flexibly change layouts will be useful.
	                //  With a page control, or an active control that is the main part of the page.

	                // Defining where side panels go.
	                //  Controls (elements) can have side panels put next to them.
	                //   Could be inside them in the DOM.
	                //    At the beginning or the end.
	                //  Could effectively split up a control into two columns, with the side panel being on the left.
	                //   Could go for up to four side panels.
	                //    And have 8 corner panels too.

	                // Division of a div into 9 seems like it would be very useful. Potentially 9.
	                //  Keeping the layout valid while making an abstraction for this will be very useful.

	                // Activating 9-panel functionality on a div...
	                //  I think I should do much of this in html enhancements.

	                //  Dom tools before control.
	                // And separate out control.
	                //  Then html builds on top of control, adds more
	                //  Then we have enh-control, which will still be used as a default in many cases.
	                //   Will have extra functionality which could be useful, but not part of the core control functionality.
	                //    These enhancements could then be made more modular.























	                // need to look into the get system.
	                //  this will also need to update the element too.
	                //  ctrl.render_inline_css
	                //   gets a string
	                //  ctrl.update_inline_css








	            }, function(e_end) {
	                // tell the context that the drag has ended.
	                var uo1 = ctrl.get('unanchored_offset');
	                console.log('uo1', uo1);

	                ctrl._context.end_drag_ctrl(e_end, ctrl);

	                var uo2 = ctrl.get('unanchored_offset');
	                console.log('uo2', uo2);

	                if (uo1 && uo2) {
	                    ctrl.set('unanchored_offset', null);
	                }

	                ctrl.set('offset_adjustment', null);

	                // and if it already has an unanchored_offset

	            });

	        },


	        // Possibly put this back?
	        //  But maybe don't want to be talking about click or touch too much, maybe talk about pointer actions.
	        /*
	        'click_to_select': function(ctrl) {
	            ctrl = ctrl || this;

	            this.click(function(e) {
	                // is control held down?
	                //console.log('e', e);
	                var ctrl_key = e.ctrlKey;
	                if (ctrl_key) {
	                    ctrl.action_select_toggle();
	                } else {
	                    ctrl.action_select_only();
	                }
	            });
	        },
	        */

	        'resize_handle_to': function(ctrl, handle_position) {
	        	// The control needs to be draggable normally?
	        	//  And then from the positions of where it is adjust the size of what it's a resize handle to?

	        	console.log('resize_handle_to');

	        	if (handle_position == 'right-bottom') {
	        		var fn_move = function(e_move) {
	        			console.log('e_move', e_move);
	        		}
	        		var fn_up = function(e_up) {
	        			console.log(e_up);
	        		}

	        		var doc = ctrl._context.ctrl_document;

	        		console.log('ctrl._context', ctrl._context);

	        		//var body = doc.get('content').get(1);
	        		//console.log('body', body);

	        		// The context should have access to the control_document.
	        		//throw 'stop';

	        		// Need to store the inital positions to work out differences between them.

	        		// pageX and PageY are reliable accross browsers.
	        		//  can be used to work out movement vector.

	        		// Maybe we use the original measured position of the window to work out the new size, along with the movement vector.




	        		var fn_move = function(e_move) {
        				console.log('e_move', e_move);
        			}

        			var fn_up = function(e_up) {
        				console.log('e_up', e_up);

        				doc.off('mousemove', fn_move);
        				doc.off('mouseup', fn_up);
        			}

	        		ctrl.on('mousedown', function(e_mousedown) {


	        			console.log('e_mousedown', e_mousedown);


	        			doc.on('mousemove', fn_move);
	        			doc.on('mouseup', fn_up);
	        		})



	        	}

	        },

	        'selectable': function(ctrl) {
	        	var that = this;
	        	ctrl = ctrl || this;

	        	that.click(function(e) {
					// is control held down?
					//console.log('e', e);
					var ctrl_key = e.ctrlKey;
					var meta_key = e.metaKey;

					//console.log('metaKey ' + e.metaKey);

					if (ctrl_key || meta_key) {
						ctrl.action_select_toggle();
					} else {
						ctrl.action_select_only();
					}
				});
	        },


	        'action_select_only': function() {
	            // needs to see what is within the selection_scope.
	            // this is a selection scope, or it refers to a control with that set to true that is an ancestor.
	            //  it could find such a control.
	            // not totally sure if the ancestor requirement is necessary, it may make sense and be best though.
	            //console.log('action_select ');
	            // I think a Selection_Scope object may make sense to hold the data.

	            // this.selection_scope.select_only(this);

	            //this.get('selection_scope').select_only(this);

	            //var ss = this.find_selection_scope();

	            // The selection scope shouls be a Selection_Scope object.

	            //  I think that it would make use of the B+ tree where needed.
	            // Need algorithmically fast operations to:
	            // Select or deselect an object
	            // Get all objects that are selected in the order in which they are listed in another control.
	            //  Though can get all objects that are selected quickly, then quickly get their indexes.
	            //  Do that without going through whole selection.

	            console.log('this ', this);
	            //ss.select_only(this);
	            this.find_selection_scope().select_only(this);

	        },

	        'action_select_toggle': function() {
	            this.find_selection_scope().select_toggle(this);
	        },


	        // So I think the resource-pool will have a selection scope.
	        'find_selection_scope': function() {
	            //console.log('find_selection_scope');

	            var res = this.get('selection_scope');
	            if (res) return res;

	            // look at the ancestor...

	            var parent = this.get('parent');
	            //console.log('parent ' + tof(parent));


	            if (parent) return parent.find_selection_scope();

	        },

			// Nice, this works. Not that efficiently yet.

			'make_full_height': function() {
				var el = this.get('dom.el');
				var viewportHeight = document.documentElement.clientHeight;


				var rect = el.getBoundingClientRect();
				console.log(rect.top, rect.right, rect.bottom, rect.left);

				var h = viewportHeight - rect.top;

				this.style('height', h + 'px', true);
			},
			'grid_9': function() {
				var res = this.get('grid_9');
				if (res) return res;

				res = new Grid_9({
					'context': this._context
				})
				//res.__type_name = 'control';
				res.set('dom.attributes.data-jsgui-type', 'control');
				// need to say it's a control too...

				var res_id = res._id();

				res.set('dom.attributes.data-jsgui-id', res_id);

				this._context.map_controls[res_id] = res;

				//res.set('')

				// transplant the content.
				

				var el = this.get('dom.el');
				// remove all child nodes???

				// can just insert the rendered grid9
				//console.log('pre res all_html_render')
				var html_grid_9 = res.all_html_render();
				var nel = document.createElement('div');

				//console.log('html_grid_9 ' + html_grid_9);

				nel.innerHTML = html_grid_9;

				var el_grid_9 = nel.childNodes[0];

				//console.log('el_grid_9 ' + el_grid_9);

				//console.log('el_grid_9.childNodes.length ' + el_grid_9.childNodes.length );

				

				el.insertBefore(el_grid_9, el.childNodes[0]);

				while (el.childNodes[1]) {
					el_grid_9.childNodes[1].childNodes[1].appendChild(el.childNodes[1]);
				}

				
				res.set('dom.el', el_grid_9);

				res.activate_recursive();
				// can't do it quite like that.
				//  maybe change for copying between collections.
				//  setting a collection, with a collection.
				//   should create a new copy?
				//    or reference it... 
				//   reference is better if it works.


				// get content should get a collection...
				//  but need to work on the Data_Object's set for when it is dealing with a collection.


				var current_content = this.get('content');

				//console.log('1) current_content.length() ' + current_content.length());
				//throw 'stop';

				// need to copy it somehow....

				var res_middle = res.get('content').get(1).get('content').get(1);
				//console.log('res_middle ' + res_middle);




				res_middle.set('content', current_content);

				//console.log('1) res content .length() ' + res.get('content').length());
				//console.log('1) res_middle content .length() ' + res_middle.get('content').length());


				this.get('content').clear();
				this.get('content').add(res);


				this.set('grid_9', res);

				//var current_content = this.get('content');

				//console.log('2) current_content.length() ' + current_content.length());

				// recursive activate...
				//  needs to activate from inside to outside.

				// When something gets anchored into a position in the Grid_9, the Grid_9 needs to handle it.

				
				return res;


			},

			// Is getting a bit verbose.
			//  Some things could be expressed more efficiently.
			//  However, right now don't want to create overall abstraction for this.

			// There will be grid_9 and a few other layouts that are fairly intrinsic to the system.




			'ensure_dock_placeholder': function(pos) {
				//console.log('enh ctrl ensure_dock_placeholder pos ' + pos);

				// and then we keep track of the dock placeholder.

				// would likely be easier to get a string by default?
				//  or easily get the value.

				// a val function that gets the value of it, if it has a value function.



				//val(dock_placeholder_pos)

				
				// use the grid_9's dock placeholder position?





				//console.log('dock_placeholder_pos ' + stringify(dock_placeholder_pos));
				//console.log('tof dock_placeholder_pos ' + tof(dock_placeholder_pos));
				var grid_9 = this.get('grid_9');
				var g9el = grid_9.get('dom.el');
				if (grid_9) {
					var dock_placeholder_pos = grid_9.get('dock_placeholder_pos');

					var t_stripe = grid_9.get('content').get(0);
					var m_stripe = grid_9.get('content').get(1);
					var cell_4 = m_stripe.get('content').get(1);
					var cell4_el = cell_4.get('dom.el');

					//console.log('dock_placeholder_pos ' + dock_placeholder_pos);
					//console.log('dock_placeholder_pos ' + tof(dock_placeholder_pos));
					//throw 'stop';
					if (dock_placeholder_pos) {
						// if the pos we have is different.
						var dpp_val;
						if (dock_placeholder_pos.value) {
							dpp_val = dock_placeholder_pos.value();
						} else {
							dpp_val = dock_placeholder_pos;
						}

						//dpp_val = dock_placeholder_pos.value();
						//console.log('dpp_val ' + dpp_val);

						if (!pos) {
							// remove it from wherever it is.
							if (dpp_val == 'left') {
								// need to set some styles, so that h_middle does not take the full width.
								//  reduce its width so that the placeholder can be accommodated.

								grid_9.close_placeholder();

								/*

								var g9w = g9el.offsetWidth;



								var g9c = grid_9.get('content');
								//console.log('g9c', g9c.length());
								
								//console.log('m_stripe', m_stripe);

								var cell_3 = m_stripe.get('content').get(0);

								// need to measure and shrink the central cell.
								
								//var w = cell4_el.offsetWidth;

								//console.log('w ' + w);

								// or remove that style declaration?
								cell_4.style({
									//'width': null
									'width': '100%'
								})



								//console.log('cell_3', cell_3);
								cell_3.remove_class('dock-placeholder');
								this.set('dock_placeholder_pos', false);

								*/
							}

							if (dpp_val == 'top') {
								//var g9c = grid_9.get('content');
								//console.log('g9c', g9c.length());
								//var m_stripe = grid_9.get('content').get(0);
								//console.log('m_stripe', m_stripe);

								grid_9.close_placeholder();

								/*
								var cell_1 = t_stripe.get('content').get(1);
								//console.log('cell_3', cell_3);
								cell_1.remove_class('dock-placeholder');
								this.set('dock_placeholder_pos', false);
								*/

							}

							if (dpp_val == 'right') {
								grid_9.close_placeholder();
								/*
								var cell_5 = grid_9.get('content').get(1).get('content').get(2);
								//console.log('cell_3', cell_3);
								cell_5.remove_class('dock-placeholder');
								this.set('dock_placeholder_pos', false);

								cell_4.style({
									//'width': null
									'width': '100%'
								})
								*/
							}

							if (dpp_val == 'bottom') {
								grid_9.close_placeholder();
							}

							// bottom 7
							//  like with others, the central div will need to be made a bit smaller.


						}

						//throw 'stop';



					} else {
						// put the placeholder in the position...
						//console.log('pos ' + pos);
						//throw 'stop';
						if (!pos) {
							// tell the grid9 to remove whichever class indicates its the placeholder.

							//throw 'stop';

						}

						if (pos == 'left') {
							//var g9c = grid_9.get('content');
							//console.log('g9c', g9c.length());

							grid_9.open_placeholder('left');

							/*

							var cw = document.documentElement.clientWidth;
							grid_9.style({
								'width': cw + 'px'
							})


							
							//console.log('m_stripe', m_stripe);
							var cell_3 = m_stripe.get('content').get(0);

							//var cell_4 = m_stripe.get('content').get(1);
							var cell3_el = cell_3.get('dom.el');
							//var cell4_el = cell_4.get('dom.el');
							var c4w = cell4_el.offsetWidth;

							//console.log('* c4w ' + c4w);

							//throw 'stop';
							//console.log('cell_3', cell_3);
							// ensure class?
							cell_3.add_class('dock-placeholder');

							var c3w = cell3_el.offsetWidth;
							var nw = c4w - c3w;
							//console.log('nw ' + nw);



							cell_4.style({
								'width': (nw) + 'px'
							})
							//console.log('* c3w ' + c3w);


							this.set('dock_placeholder_pos', 'left');

							*/
						}
						if (pos == 'top') {
							//var g9c = grid_9.get('content');
							//console.log('g9c', g9c.length());

							/*
							var m_stripe = grid_9.get('content').get(0);
							//console.log('m_stripe', m_stripe);
							var cell_1 = m_stripe.get('content').get(1);
							//console.log('cell_3', cell_3);
							// ensure class?
							cell_1.add_class('dock-placeholder');
							this.set('dock_placeholder_pos', 'top');
							*/

							grid_9.open_placeholder('top');
						}
						if (pos == 'right') {

							grid_9.open_placeholder('right');

							
						}

						//grid_9.open_placeholder('bottom');


						if (pos == 'bottom') {
							grid_9.open_placeholder('bottom');
						}
					}
				}
			},

			'unanchor': function() {
				var anchored_to = this.get('anchored_to');
				anchored_to[0].unanchor_ctrl(this);

			}

		})

		var Grid_9 = jsgui.Control.extend({
			'init': function(spec) {
				this._super(spec);

				// composition...
				//  need to create 3 stripes: top, v_middle, bottom
				//   then within each of them we have left, h_middle, right

				// in an array. The center is number 4.

				// 0 1 2
				// 3 4 5
				// 6 7 8
				this.__type_name == 'grid_9';

				this.set('dom.attributes.class', 'grid_9');
				var context = this._context;

				// if being given the element when it is constructed...

				// putting this into another control.
				//  we need to re-render the control fully, I think.

				// Is there a better way to put this into an existing document?

				// Render the HTML of it and everything inside it...
				//  Would need to reactivate / reattach events.
				//   Memory leak?

				// could maybe activate to make access to subcontrols more convenient?



				// we can detach and reattach.
				//  could have a specific mechanism for putting this in.

				// compose its html
				// render create the element.
				//  remove the existing element
				// put the grid9 element in (or is it simply 9 elements?) grid_9 could take an outer div, though we could possibly remove that.
				//  then put the element within position 4 of the grid9.

				var arr_v_names = ['top', 'v-middle', 'bottom'];
				var arr_h_names = ['left', 'h-middle', 'right'];

				if (!spec.el) {
					var c = 0;
					var arr_ctrls = new Array(9);
					for (var y = 0; y < 3; y++) {
						var stripe = new jsgui.Control({
							'context': context
						})
						stripe.set('dom.attributes.class', arr_v_names[y]);
						// could have the page context see what the free ids are, and then use them.
						//  would set the counter for each of them based on what has been found.

						stripe.set('dom.attributes.data-jsgui-type', stripe.__type_name);


						stripe.set('dom.attributes.data-jsgui-id', stripe._id());

						this.add(stripe);

						context.map_controls[stripe._id()] = stripe;

						for (var x = 0; x < 3; x++) {
							arr_ctrls[c] = new jsgui.Control({
								'context': context
							})
							arr_ctrls[c].set('dom.attributes.class', arr_h_names[x]);
							arr_ctrls[c].set('dom.attributes.data-jsgui-id', arr_ctrls[c]._id());
							arr_ctrls[c].set('dom.attributes.data-jsgui-type', arr_ctrls[c].__type_name);

							stripe.add(arr_ctrls[c]);

							context.map_controls[arr_ctrls[c]._id()] = arr_ctrls[c];
							c++;
						}
					}
					//console.log(this.get('content').length());
					//throw 'stop';	
				}


			},

			'unanchor_ctrl': function(ctrl) {
				var anchored_to = ctrl.get('anchored_to');
				var zone = anchored_to[2];
				console.log('unanchor_ctrl zone ' + zone);
				ctrl.remove_class('anchored');

				var unanchored_offset = ctrl.get('unanchored_offset');
				console.log('unanchored_offset', unanchored_offset);

				// But when unanchoring is done as part of a drag...
				//  need to recalculate the drag offset.

				//ctrl.offset(unanchored_offset);
				if (unanchored_offset) {
					if (zone !== 'right') {
						ctrl.set('offset_adjustment', [unanchored_offset[0], 0]);
					}

					
				}
				

				var t_stripe = this.get('content').get(0);
				var m_stripe = this.get('content').get(1);
				var cell_4 = m_stripe.get('content').get(1);
				var cell4_el = cell_4.get('dom.el');

				if (zone == 'left') {
					var cell_3 = m_stripe.get('content').get(0);

					//var cell_4 = m_stripe.get('content').get(1);
					var cell3_el = cell_3.get('dom.el');

					cell_3.remove_class('open');
				}

				if (zone == 'right') {
					//var c4w = document.documentElement.clientWidth;
					var cell_5 = this.get('content').get(1).get('content').get(2);
					cell_5.remove_class('dock-placeholder');

					/*
					this.set('open', 'right');
					var cell5_el = cell_5.get('dom.el');
					var c5w = cell5_el.offsetWidth;
					var nw = c4w - c5w;
					cell_4.style({
						'width': (nw) + 'px'
					})
					*/
				}


				anchored_to[0].close_placeholder(zone);



				ctrl.set('anchored_to', null);
				ctrl.set('unanchored_offset', null);

			},

			'anchor_ctrl': function(ctrl, zone) {
				// need to find the right nested subcontrol

				var x, y, found;
				if (zone == 'left') {
					x = 0; y = 1;
					found = true;
				}
				if (zone == 'top') {
					x = 1; y = 0;
					found = true;
				}
				if (zone == 'right') {
					x = 2; y = 1;
					found = true;
				}
				if (zone == 'bottom') {
					x = 1; y = 2;
					found = true;
				}

				var t_stripe = this.get('content').get(0);
				var m_stripe = this.get('content').get(1);
				var cell_4 = m_stripe.get('content').get(1);
				var cell4_el = cell_4.get('dom.el');

				if (found) {
					var grid_section = this.get('content').get(y).get('content').get(x);

					//console.log('grid_section ', grid_section);

					// need a way of inserting a control.
					//  Adding to the content, and having the control react to this and update the DOM?

					// may have ctrl.append(ctrl)
					//  which adds it to the content (and updates the DOM)
					// could also have an activated control listen out for content changes.
					//  so when something gets added in the content, it gets appended in the DOM too.
					//   I think that makes sense in terms of convenience.

					// Will mean making that left bar bigger so that it fits the flexi board.
					// also need to add the class 'open' or something to show that the grid section is open.

					// open a part of the grid section...
					//  best to get the grid_9 to do this.
					//  also would be good to get the grid_9 to show placeholders using its own methods.




					// And this will change the formatting of the grid_9
					//  Don't want that section to appear and dissipear.
					//  Don't show it as a placeholder when something is there...

					// Need to open a section of the Grid_9 / reposition things.
					//  Like when the placeholder is shown.

					// We want to actually open that section of the grid_9.
					var unanchored_offset = ctrl.offset();
					ctrl.set('unanchored_offset', unanchored_offset);

					console.log('unanchored_offset', unanchored_offset);

					ctrl.add_class('anchored');




					//console.log('');
					grid_section.add(ctrl);

					ctrl.set('anchored_to', [this, grid_section, zone]);
					var unanchored_size = ctrl.size();

					ctrl.set('unanchored_size', unanchored_size);




					// This is basically working now!
					//  Have automatic DOM append of added content.
					//   Need to get that working properly and tested in all cases though.


					if (zone == 'left') {
						console.log ('left zone');
						var cw = document.documentElement.clientWidth;
						this.style({
							'width': cw + 'px'
						})
						//console.log('m_stripe', m_stripe);
						var cell_3 = m_stripe.get('content').get(0);

						//var cell_4 = m_stripe.get('content').get(1);
						var cell3_el = cell_3.get('dom.el');
						//var cell4_el = cell_4.get('dom.el');
						var c4w = cell4_el.offsetWidth;
						cell_3.add_class('open');

						var c3w = cell3_el.offsetWidth;
						var nw = c4w - c3w;
						cell_4.style({
							'width': (nw) + 'px'
						})
					}

					if (zone == 'right') {
						var c4w = document.documentElement.clientWidth;
						var cell_5 = this.get('content').get(1).get('content').get(2);
						cell_5.add_class('dock-placeholder');
						this.set('open', 'right');
						var cell5_el = cell_5.get('dom.el');
						var c5w = cell5_el.offsetWidth;
						var nw = c4w - c5w;
						cell_4.style({
							'width': (nw) + 'px'
						})
					}

					if (zone == 'bottom') {
						var c = document.documentElement.clientHeight;
						var cell_7 = this.get('content').get(2).get('content').get(1);
						cell_7.add_class('open');
						this.set('dock_placeholder_pos', 'bottom');
						var cell7_el = cell_7.get('dom.el');
						var c7h = cell7_el.offsetHeight;
						//console.log('c7h ' + c7h);
						var nh = c - c7h;
						//console.log('nh ' + nh);
						m_stripe.style({
							'height': (nh) + 'px'
						})
					}



					//grid_section.anchor_ctrl(ctrl);
				}



				


			},
			'open_placeholder': function(zone) {
				//console.log('grid_9 open_placeholder ' + zone);

				var t_stripe = this.get('content').get(0);
				var m_stripe = this.get('content').get(1);
				var cell_4 = m_stripe.get('content').get(1);
				var cell4_el = cell_4.get('dom.el');

				if (zone == 'left') {
					var cw = document.documentElement.clientWidth;
					this.style({
						'width': cw + 'px'
					})
					//console.log('m_stripe', m_stripe);
					var cell_3 = m_stripe.get('content').get(0);

					//var cell_4 = m_stripe.get('content').get(1);
					var cell3_el = cell_3.get('dom.el');
					//var cell4_el = cell_4.get('dom.el');
					var c4w = cell4_el.offsetWidth;
					cell_3.add_class('dock-placeholder');

					var c3w = cell3_el.offsetWidth;
					var nw = c4w - c3w;
					cell_4.style({
						'width': (nw) + 'px'
					})
					this.set('dock_placeholder_pos', 'left');
				}

				if (zone == 'top') {
					//var m_stripe = grid_9.get('content').get(0);
							//console.log('m_stripe', m_stripe);
					var cell_1 = t_stripe.get('content').get(1);
					//console.log('cell_3', cell_3);
					// ensure class?
					cell_1.add_class('dock-placeholder');
					this.set('dock_placeholder_pos', 'top');
				}

				if (zone == 'right') {
					var c4w = document.documentElement.clientWidth;
					var cell_5 = this.get('content').get(1).get('content').get(2);
					cell_5.add_class('dock-placeholder');
					this.set('dock_placeholder_pos', 'right');


					//var c4w = cell4_el.offsetWidth;
					


					//console.log('c4w ' + c4w);
					//cell_5.add_class('dock-placeholder');

					var cell5_el = cell_5.get('dom.el');


					// use the full page width.




					var c5w = cell5_el.offsetWidth;
					//console.log('c5w ' + c5w);
					var nw = c4w - c5w;
					//console.log('nw ' + nw);
					cell_4.style({
						'width': (nw) + 'px'
					})

				}

				if (zone == 'bottom') {
					var c = document.documentElement.clientHeight;
					var cell_7 = this.get('content').get(2).get('content').get(1);
					cell_7.add_class('dock-placeholder');
					this.set('dock_placeholder_pos', 'bottom');


					//var c4w = cell4_el.offsetWidth;
					


					//console.log('c4w ' + c4w);
					//cell_5.add_class('dock-placeholder');

					var cell7_el = cell_7.get('dom.el');


					// use the full page width.


					//var c4h = cell4_el.offsetHeight;
					// get the offset height of the middle stripe, that's the one who's height we should change.




					var c7h = cell7_el.offsetHeight;
					//console.log('c7h ' + c7h);
					var nh = c - c7h;
					//console.log('nh ' + nh);
					m_stripe.style({
						'height': (nh) + 'px'
					})
				}

			},
			'close_placeholder': function() {
				var dppos = this.get('dock_placeholder_pos');
				if (dppos && dppos.value) dppos = dppos.value();

				var t_stripe = this.get('content').get(0);

				var m_stripe = this.get('content').get(1);
				var cell_4 = m_stripe.get('content').get(1);

				if (dppos == 'left') {
					var el = this.get('dom.el');
					var g9w = el.offsetWidth;

					var g9c = this.get('content');
					//console.log('g9c', g9c.length());
					
					//console.log('m_stripe', m_stripe);

					var cell_3 = m_stripe.get('content').get(0);

					// need to measure and shrink the central cell.
					
					//var w = cell4_el.offsetWidth;

					//console.log('w ' + w);

					// or remove that style declaration?
					cell_4.style({
						//'width': null
						'width': '100%'
					})



					//console.log('cell_3', cell_3);
					cell_3.remove_class('dock-placeholder');
					this.set('dock_placeholder_pos', false);

				}

				if (dppos == 'top') {
					var cell_1 = t_stripe.get('content').get(1);
					//console.log('cell_3', cell_3);
					cell_1.remove_class('dock-placeholder');
					this.set('dock_placeholder_pos', false);
				}

				if (dppos == 'right') {
					var cell_5 = this.get('content').get(1).get('content').get(2);
					//console.log('cell_3', cell_3);
					cell_5.remove_class('dock-placeholder');
					this.set('dock_placeholder_pos', false);
					cell_4.style({
						//'width': null
						'width': '100%'
					})
				}

				if (dppos == 'bottom') {
					var cell_7 = this.get('content').get(2).get('content').get(1);
					//console.log('cell_3', cell_3);
					cell_7.remove_class('dock-placeholder');
					this.set('dock_placeholder_pos', false);

					m_stripe.style({
						'height': '100%'
					})
				}


				/*
				var g9w = g9el.offsetWidth;



								var g9c = grid_9.get('content');
								//console.log('g9c', g9c.length());
								
								//console.log('m_stripe', m_stripe);

								var cell_3 = m_stripe.get('content').get(0);

								// need to measure and shrink the central cell.
								
								//var w = cell4_el.offsetWidth;

								//console.log('w ' + w);

								// or remove that style declaration?
								cell_4.style({
									//'width': null
									'width': '100%'
								})



								//console.log('cell_3', cell_3);
								cell_3.remove_class('dock-placeholder');
								this.set('dock_placeholder_pos', false);
				*/
			}


			// the grid_9 also needs to be activated.
			//  the controls within it need attachments to their elements.
			//  maybe grid_9 does not need more code in itself... just needs activate to be called when it's in the DOM.



		});
		//jsgui.Control = Control;




		// Selection scope...
		//  Can select the whole thing, can select parts of it.

		// Don't want too much code to do with selection in the UI control itself.



		// Space saving measures?
		//  Declaring a buch of subcontrols with properties?
		//  Doing so as XML? As JSON?


		// Movable
		// Resizable
		// Rotatable
		// Deletable
		// Editable
		// Reorderable
		// Creatable

		// Actionable
		//  (actionable behaviours)

		// They will vary quite a lot and probably can't all fit into one way of doing things.

		// Want a very easy way to set these up.

		// Using groups too.

		// Behaviours seem like a good way of expressing action-reaction.
		//  


	    var recursive_dom_iterate = function (el, callback) {
	        //console.log('recursive_dom_iterate');
	        callback(el);

	        //console.log('tof(el.childNodes) ' + tof(el.childNodes));

	        //each(el.childNodes, function(i, v) {
	        //	console.log('v ' + v);
	        //});

	        //console.log('el.childNodes.length ' + el.childNodes.length);
	        var cns = el.childNodes;
	        for (var c = 0, l = cns.length; c < l; c++) {
	            recursive_dom_iterate(cns[c], callback);
	        }
	    }

	    var recursive_dom_iterate_depth = function (el, callback) {
	        //console.log('recursive_dom_iterate');
	        

	        //console.log('tof(el.childNodes) ' + tof(el.childNodes));

	        //each(el.childNodes, function(i, v) {
	        //  console.log('v ' + v);
	        //});

	        //console.log('el.childNodes.length ' + el.childNodes.length);
	        var cns = el.childNodes;
	        for (var c = 0, l = cns.length; c < l; c++) {
	            recursive_dom_iterate_depth(cns[c], callback);
	        }
	        callback(el);
	    }


	    // Want the document node to be linked with the context when activated (automatically)

	    // We find the html element control. That is the one that gets set to be the context's ctrl_document.




		var activate = function(context) {
	        // The context should already have the map of controls.

	        // Not so sure we can have the client page context here - does it use resources?

	        ensure_Context_Menu_loaded(function(_Context_Menu) {
	        	Context_Menu = _Context_Menu;

	        	if (!context) {
		        	throw 'jsgui-html-enh activate(context) - need to supply context parameter.';
		        }
		        //context = context || new Page_Context();

		        //console.log('jsgui-html-enh activate context', context);

		        var map_jsgui_els = {};
		        var map_jsgui_types = {};

		        //console.log('activate - beginning mapping');

		        // Could put together the array of controls in order found.

		        var arr_controls = [];
		        // element registration
		        // Recursive iteration where the innermost get called first....
		        //  Would be useful here.

		        // counting up the typed id numbers.

		        var max_typed_ids = {};

		        var id_before__ = function(id) {
		            var pos1 = id.lastIndexOf('_');
		            var res = id.substr(0, pos1);
		            return res;
		        }

		        var num_after = function(id) {
		            var pos1 = id.lastIndexOf('_');
		            var res = parseInt(id.substr(pos1 + 1), 10);
		            return res;
		        }

		        recursive_dom_iterate(document, function(el) {
		            //console.log('2) el.tagName ' + el.tagName);
		            var nt = el.nodeType;
		            //console.log('nt ' + nt);

		            // So for the 'HTML' tag name...
		            //  We should make a control for the HTML document - or it should get activated.



		            if (nt == 1) {
		                var jsgui_id = el.getAttribute('data-jsgui-id');
		                // Give the HTML document an ID?


		                //console.log('jsgui_id ' + jsgui_id);
		                if (jsgui_id) {
		                    var ib = id_before__(jsgui_id);
		                    var num =  num_after(jsgui_id);
		                    if (!max_typed_ids[ib]) {
		                        max_typed_ids[ib] = num;
		                    } else {
		                        if (num > max_typed_ids[ib]) max_typed_ids[ib] = num;
		                    }

		                    map_jsgui_els[jsgui_id] = el;
		                    var jsgui_type = el.getAttribute('data-jsgui-type');
		                    //console.log('jsgui_type ' + jsgui_type);
		                    map_jsgui_types[jsgui_id] = jsgui_type;
		                    //console.log('jsgui_type ' + jsgui_type);
		                }
		            }
		        });
		        context.set_max_ids(max_typed_ids);
		        //console.log('max_typed_ids ' + stringify(max_typed_ids));
		        //throw 'stop';
		        //console.log('activate - finished mapping');

		        // Then activate
		        //  (but an activation where it does not yet know the references to various necessary other controls)
		        //  This is about creating the controls, within the page_context.

		        // if the control does not have its own recursive activation...
		        //  Do the control creation, then there should be various properties and behaviours that get set.

		        // create the controls.
		        //console.log('map_jsgui_types ' + stringify(map_jsgui_types));
		        //console.log('map_jsgui_els ' + stringify(map_jsgui_els));

		        //console.log('map_controls_by_type ' + stringify(map_controls_by_type));
		        //throw 'stop';

		        //console.log('context.map_controls', context.map_controls);
				//console.log('map_jsgui_types', map_jsgui_types);

		        var map_controls = context.map_controls;
		        // Control construction and registration
		        each(map_jsgui_els, function(jsgui_id, el) {
		            //console.log('jsgui_id ' + jsgui_id);
		            //console.log('3) el.tagName ' + el.tagName);
		            var l_tag_name = el.tagName.toLowerCase();
		            if (jsgui_id) {
		                var type = map_jsgui_types[jsgui_id];
		                //console.log('type ' + type);
		                //var cstr = jsgui.constructor_from_type(type);

		                //var cstr = jsgui.constructor_from_type(type);

		                //console.log('cstr ' + cstr);

		                // use the context's map_Controls

		                var Cstr = context.map_Controls[type];
		                //console.log('Cstr ' + Cstr.prototype);

		                // then we can construct the control, and put it within the map.
		                //  A later stage of activation will recreate the relationships between the controls.

		                // OK, but have we got variables to initialize the controls with?
		                //  It would maybe be most efficient to take delivery of them as one object.
		                //   With just the control types and the data contained in them we can do a lot of reconstruction of the actual controls.

		                // With the object viewer, we can even reconstruct the initial object from the rendered view.
		                //  Not sure quite how much point there is in doing that. May work out most efficient because 1st view is prerendered and
		                //  it does not need to send the data twice.
		                // Eg can hook up the key (viewer), the value (viewer) and the comma.

		                // for the document element we specifically add the control to the context.



		                if (Cstr) {
		                	var ctrl = new Cstr({
			                    'context': context,
			                    '_id': jsgui_id,
			                    'el': el
			                })
			                map_controls[jsgui_id] = ctrl;
			                arr_controls.push(ctrl);

			                //console.log('el.tagName', el.tagName);

			                if (l_tag_name === 'html') {
			                	//console.log('el is document root el');

			                	// The html element represents the root of a document.
			                	//throw '2) stop';

			                	context.ctrl_document = ctrl;
			                }
		                } else {
		                	console.log('Missing context.map_Controls for type ' + type + ', using generic Control');
		                	var ctrl = new Control({
			                    'context': context,
			                    '_id': jsgui_id,
			                    'el': el
			                })
			                map_controls[jsgui_id] = ctrl;
			                arr_controls.push(ctrl);

		                }

		                
		                //console.log('jsgui_id ' + jsgui_id);
		                //console.log('ctrl._id() ' + ctrl._id());
		                
		            }
		            // get the constructor from the id?
		        })
		        //console.log('arr_controls ' + stringify(arr_controls));
		        // depth-first activation?
		        //  But connecting up the activated subcontrols with the control getting activated?
		        //   They could be the content.


		        recursive_dom_iterate_depth(document, function(el) {
		            //console.log('el ' + el);
		            var nt = el.nodeType;
		            //console.log('nt ' + nt);
		            if (nt == 1) {
		                var jsgui_id = el.getAttribute('data-jsgui-id');
		                //console.log('* jsgui_id ' + jsgui_id);
		                if (jsgui_id) {
		                    
		                    var ctrl = map_controls[jsgui_id];
		                    ctrl.__activating == true;
		                    //console.log('tof ctrl ' + tof(ctrl));
		                    ctrl.activate();
		                    ctrl.__activating == false;
		                    //console.log('jsgui_type ' + jsgui_type);
		                }
		            }
		        })
	        })

	        //  constructors.

	        // should activate with the context.

		        

	        //console.log('done activate rdi');

	        /*

	        each(arr_controls, function(i, ctrl) {
	            // Call activate on the control...
	            //  usually it's going to set up the contents.


	            // activate_contents activate_control_contents

	            ctrl.activate();
	            // Activate from bottom up
	            //  Most inwards, upwards?

	            //  So inner controls are active by the time it reaches outside....



	        });
	        */

	        // Then another rec dom it.
	        //  When activating various controls, we'll be looking for specific subcontrols to get a reference to.
	        //  Don't want to wrap the elements like with jQuery.

	        // then wen need to find the constructor for various controls.
	        //  possibly do it for all controls.
	        //  for text spans, we read it and assign the properites.

	        // Think we should activate everything.
	        //  Create the controls
	        //  Give them references to the page context

	        // Then give the controls references to each other.
	        //  Some of the controls will be fields of other controls.
	        //  We can make sure these get sent from the server so they can be activated on the client.
	        //   Could maybe have 'relationships' where various other controls are given by jsgui-id that do something on a control.
	        //   They are really control fields.

	        // So an object editor may have the open and close control fields.

	    }

	    var core_extension = str_arr_mapify(function (tagName) {
	        jsgui[tagName] = Control.extend({
	            'init': function (spec) {
	                //spec.tagName = tagName;

	                //console.log('core extension tagName ' + tagName);

	                this._super(spec);

	                this.get('dom').set('tagName', tagName);
	                // dom.tagName?

	            }
	        });
	        jsgui[tagName].prototype._tag_name = tagName;
	        map_Controls[tagName] = jsgui[tagName];
	    });

	    var core_extension_no_closing_tag = str_arr_mapify(function (tagName) {
	        jsgui[tagName] = Control.extend({
	            'init': function (spec) {
	                //spec.tagName = tagName;

	                //console.log('core extension tagName ' + tagName);

	                this._super(spec);

	                this.get('dom').set('tagName', tagName);
	                this.get('dom').set('noClosingTag', true);
	                // dom.tagName?

	            }
	        });
	        jsgui[tagName].prototype._tag_name = tagName;
	        map_Controls[tagName] = jsgui[tagName];
	    });




	    core_extension('html head title body div span h1 h2 h3 h4 h5 label p a script button form img ul li audio video');
	    core_extension_no_closing_tag('link input');
	    // link tag needs to have no closing tag.
	    //  core_extension_no_closing_tag


	    // the jsgui.script object needs more fields.
	    //  the jsgui data system has become more restrictive, in that fields / attributes need to be specified.

	    // dom.attributes.type being part of script.

	    // jsgui.script.fields().add('dom.attributes.type')

	    //  It may be nice to have this more flexible again.

	    // but with label we want a bit more...

	    jsgui.Label = Control.extend({
	        // a field for 'for'
	        'fields': [
	            ['for', 'control']
	            // needs to be able to deal with fields of the type 'control'.


	        ],

	        'init': function (spec) {
	            // for property, and it's tagName gets set too.
	            this._super(spec);
	            this.set('dom.tagName', 'label');


	            //console.log(spec.for);
	            //throw stop;
	            // content rather than text.
	        },
	        'beforeRenderDomAttributes': function () {
	            //this.set('dom.name')

	            //var dom = this.get('dom');
	            //console.log('');

	            //console.log('');
	            //var dom_attributes = this.get('dom.attributes');

	            //console.log('dom ' + stringify(dom));
	            //console.log('dom_attributes ' + dom_attributes);

	            //throw 'stop';

	            
	            //console.log('domAttributes ' + stringify(domAttributes));
	            //if (this.)
	            //console.log('this._ ' + stringify(this._));
	            var _for = this.get('for');



	            //console.log('tof(_for) ' + tof(_for));
	            //throw 'stop';

	            if (tof(_for) == 'control') {
	                // we use that control's _id() as thr for in the dom attributes.
	                var domAttributes = this.get('dom.attributes');
	                domAttributes.set('for', _for._id());
	            }

	            //console.log('_for ' + stringify(_for));
	            //throw 'stop';
	            /*
				var groupName = this.get('group_name').get();
				var checked = this.get('checked').get();
				var value = this.get('value').get();
				//console.log('checked ' + stringify(checked));
				//throw 'stop';
				if (groupName) {
					domAttributes.set('name', groupName);
				}
				if (checked) {
					domAttributes.set('checked', checked.toString());
				}
				if (is_defined(value)) {
					domAttributes.set('value', value);
				}
				*/
	        }
	    });

		var HTML_Document = jsgui.html.extend({
	        // no tag to render...
	        //  but has dtd.

	        'render_dtd': function () {
	            return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n';
	        },


	        /*
	        'all_html_render': function () {



	            //if (this.pre_all_html_render) {
	            //	
	            //}
	            var that = this;
	            var res = [];

	            this.pre_all_html_render();

	            var dom = this.get('dom');

	            if (dom) {

	                res.push(that.render_dtd());

	                // the super all_html_render.


	                res.push(this._super());
	                //res.push(that.render_content());

	                //res.push(

	                // does it have innerHTML?
	                //  I think that will just be a content item that gets rendered anyway.
	                //console.log('has dom');

	                //var beginning = this.renderBeginTagToHtml();
	                //var middle = this.all_html_render_internal_controls();
	                //var end = this.renderEndTagToHtml();
	                //var appendment = this.renderHtmlAppendment();

	                //console.log('beginning ' + beginning);
	                //console.log('middle ' + middle);
	                //console.log('end ' + end);

	                //res = [beginning, middle, end, appendment].join('');
	                //throw ('stop');
	            }

	            
	        	
	        	//if (this.dom && this.dom._ && this.dom._.innerHtml) {
	        	//	res = [this.renderBeginTagToHtml(), this.dom._.innerHtml, this.renderEndTagToHtml(), this.renderHtmlAppendment()].join('');
	        	//} else {
	        	//	res = [this.renderBeginTagToHtml(), this.all_html_render_internal_controls(), this.renderEndTagToHtml(), this.renderHtmlAppendment()].join('');
	        	//};
	        	
	            return res.join('');
	        }
	        */

	    });

	    var Blank_HTML_Document = HTML_Document.extend({
	        'init': function (spec) {
	            this._super(spec);

	            var context = this._context;
	            //console.log('context ' + context);

	            if (!spec.el) {
	            	var head = new jsgui.head({
		                'context': context
		            });
		            this.get('content').add(head);

		            var title = new jsgui.title({
		                'context': context
		            });
		            head.get('content').add(title);

		            var body = new jsgui.body({
		                'context': context
		            });
		            this.get('content').add(body);

		            // and have .head, .title, .body?

		            // useful shortcuts?
		            this.set('head', head);
		            this.set('title', title);
		            this.set('body', body);

		            //this.head = head;
		            //this.title = title;
		            //this.body = body;

		            // Maybe connecting control fields?
		            this.connect_fields(['head', 'body', 'title']);
	            }

	            

	            //console.log('content ' + stringify(this.get('content')));

	            //throw 'stop';

	            //console.log('');
	            //console.log('end init Blank_HTML_Document this._ ' + stringify(this._));
	        },
	        'body': fp(function(a, sig) {
	        	if (sig =='[]') {
	        		// find the body control.

	        		var content = this.get('content');
	        		var body = content.get(1);
	        		//console.log('body', body);
	        		//throw 'stop';

	        		return body;
	        	}
	        })
	    });

	    var Client_HTML_Document = Blank_HTML_Document.extend({
	        'init': function (spec) {
	            this._super(spec);

	            //spec.context.ctrl_document = this;
	            this.active();

	        },

	        'include_js': function(url) {
	            var head = this.get('head');
	            // create jsgui.script

	            var script = new jsgui.script({
	                //<script type="text/JavaScript" src="abc.js"></script>
	                'context': this._context
	            })
	            // <script data-main="scripts/main" src="scripts/require.js"></script>
	            var dom = script.get('dom');
	            //console.log('* dom ' + stringify(dom));

	            //var domAttributes = script.get('dom.attributes');
	            var domAttributes = dom.get('attributes');
	            //console.log('domAttributes ' + domAttributes);

	            domAttributes.set('type', 'text/javascript');
	            //domAttributes.set('src', '/js/require.js');
	            domAttributes.set('src', url);
	            head.content().add(script);
	        },

	        'include_css': function(url) {
	            var head = this.get('head');
	            // create jsgui.script
	            
	            // <link rel="stylesheet" type="text/css" href="theme.css">

	            var link = new jsgui.link({
	                //<script type="text/JavaScript" src="abc.js"></script>
	                'context': this._context
	            })
	            // <script data-main="scripts/main" src="scripts/require.js"></script>
	            var dom = link.get('dom');
	            //console.log('* dom ' + stringify(dom));

	            //var domAttributes = script.get('dom.attributes');
	            var domAttributes = dom.get('attributes');
	            //console.log('domAttributes ' + domAttributes);

	            domAttributes.set('rel', 'stylesheet');
	            domAttributes.set('type', 'text/css');
	            //domAttributes.set('src', '/js/require.js');
	            domAttributes.set('href', url);
	            head.content().add(link);
	        },

	        
	        'include_jsgui_client': function(js_file_require_data_main) {

	        	// Could add the default client file.

	        	// Or a specific client file with a control that also has client-side code.
	        	//  The client-side code won't get processed on the server.
	        	//  There will be a specific place where client side code gets called upon activation.

	        	// could include a specific parameter for js_file_require_data_main

	        	js_file_require_data_main = js_file_require_data_main || '/js/web/jsgui-html-client';

	            // Needs to add various script references to the body.
	            //  May just be one client.js file
	            //  Then will work on having it build quickly
	            //  Then will work on making it stay fast to build and be smaller.

	            // include the script in the body?
	            //  is there a way to keep it at the end of the body?
	            //  could put it in the head for the moment.

	            var head = this.get('head');
	            // create jsgui.script

	            var script = new jsgui.script({
	                //<script type="text/JavaScript" src="abc.js"></script>
	                'context': this._context
	            })
	            // <script data-main="scripts/main" src="scripts/require.js"></script>

	            //var dom = script.get('dom');
	            //console.log('* dom ' + stringify(dom));

	            //var domAttributes = script.get('dom.attributes');
	            //var domAttributes = dom.get('attributes');
	            var domAttributes = script.get('dom.attributes');

	            //console.log('domAttributes ' + domAttributes);



	            //domAttributes.set('type', 'text/javascript');
	            //domAttributes.set('src', '/js/require.js');
	            //domAttributes.set('data-main', js_file_require_data_main);
	            domAttributes.set({
	                'type': 'text/javascript',
	                'src': '/js/web/require.js',
	                'data-main': js_file_require_data_main
	            });


	            //script.set('dom.attributes.type', 'text/javascript');
	            //script.set('dom.attributes.src', 'js/jsgui-client.js');
	            //script.set('dom.attributes.src', 'js/require.js');
	            //script.set('dom.attributes.data-main', 'js/jsgui-client.js');
	            //script.set('dom.attributes.data-main', js_file_require_data_main);


	            head.add(script);
	            //throw 'stop';

	        },

	        'include_jsgui_resource_client': function(path) {

	            // Could add the default client file.

	            // Or a specific client file with a control that also has client-side code.
	            //  The client-side code won't get processed on the server.
	            //  There will be a specific place where client side code gets called upon activation.

	            // could include a specific parameter for js_file_require_data_main

	            var js_file_require_data_main = path || '/js/web/jsgui-html-resource-client';
	            this.include_jsgui_client(js_file_require_data_main);

	        },
	        'include_client_css': function() {
	            var head = this.get('head');
	            var link = new jsgui.link({
	                //<script type="text/JavaScript" src="abc.js"></script>
	                'context': this._context

	            });
	            //var lda = link.get('dom.attributes');
	            //var dom = link.get('dom');
	            //console.log('* dom ' + stringify(dom));

	            //var domAttributes = script.get('dom.attributes');
	            var domAttributes = link.get('dom.attributes');

	            domAttributes.set('rel', 'stylesheet');
	            domAttributes.set('type', 'text/css');
	            domAttributes.set('href', '/css/basic.css');

	            head.content().add(link);
	            // <link rel="stylesheet" type="text/css" href="theme.css">
	        }

	        // also need to include jsgui client css



	    });




		// Behaviours...
		//  (May be like flags?)
		//  Selectable
		//  Dragable
		//  Drop-Zone

		// These need to be done in a way to make controls take less code.


		
		jsgui.activate = activate;
		jsgui.recursive_dom_iterate = recursive_dom_iterate;
		jsgui.recursive_dom_iterate_depth = recursive_dom_iterate_depth;
		jsgui.get_window_size = get_window_size;
		jsgui.Client_HTML_Document = Client_HTML_Document;

		// And a Page_Control as well...





		jsgui.hover_class = hover_class;
		jsgui.group_hover_class = group_hover_class;


		// jsgui-html-page-context.js

		var Page_Context = Class.extend({
	        'init': function (spec) {
	            spec = spec || {};
	            if (spec.browser_info) {
	                this.browser_info = spec.browser_info;
	            };

	            if (spec.resource_pool) {
	            	this.resource_pool = spec.resource_pool;
	            }

	            /*
	    		this.itemIndex = function(obj, item) {
	    		    var c = -1;
	    		    $.each(obj, function(i, n) {
	    		        if (n === obj) c = i;
	    		    });
	    		    return c;
	    		};
	    		*/

	            this.get_vector_methodology = function () {
	                if (this.browser_info.ie) {
	                    return 'vml';
	                } else {
	                    return 'svg';
	                }
	            };

	            /*
	            var qids = [],
	                iQid = 1,
	                qid = function () {
	                    var res = 'qid_' + iQid;
	                    iQid++;
	                    return res;
	                }, typedIds = {}, iTypedIds = {}, typed_id = function (str_type) {
	                    if (typeof iTypedIds[str_type] === 'undefined') {
	                        iTypedIds[str_type] = 1;
	                    }
	                    var res = iTypedIds[str_type];
	                    iTypedIds[str_type] = iTypedIds[str_type] + 1;
	                    return res;
	                };
	            this.qid = qid;
	            */


	            // Copied from Server.Page_Context

	            var map_new_ids = {};
	            // and have the objects registered within the context too.
	            
	            var map_objects = {};
	            
	            var _get_new_typed_object_id = function(type_name) {
	                if (!is_defined(map_new_ids[type_name])) {
	                    map_new_ids[type_name] = 0;
	                }
	                //if (!is_defined(map_new_ids[type_name]) {
	                //  map_new_ids[type_name] = 0;
	                //}
	                var res = type_name + '_' + map_new_ids[type_name];
	                map_new_ids[type_name]++;
	                return res;
	            }
	            
	            this.new_id = _get_new_typed_object_id;

	            this.set_max_ids = function(map_max_ids) {
	                each(map_max_ids, function(i, v) {
	                    map_new_ids[i] = v + 1;
	                })
	            }


	            /* teIds = {}, iteIds = {}, typed_enhancement_id = function(str_type) {
	    			return str_type + '_' + typed_enhancement_int(str_type);
	    		}; */

	            //this.teIds = teIds;
	            //this.ctrls_by_id = {};
	            //this.cl_abs = {}; // abstract controls for the client

	            // typed enhancements may be retired. Not actively using them late July 2011 but they could they be within the lower level workings?
	            /*
	    		var typed_enhancement_int = function(str_type) {
	    			if (typeof iteIds[str_type] === 'undefined') {
	    				iteIds[str_type] = 0;
	    			};
	    			//console.log('');
	    			//console.log('** str_type ' + str_type);
	    			
	    			var res = iteIds[str_type];
	    			iteIds[str_type] = iteIds[str_type] + 1;
	    			return res;
	    		};

	    		this._advance_type_id = function(str_type, quantity) {
	    			if (typeof quantity == 'undefined') quantity = 1;
	    			iteIds[str_type] = iteIds[str_type] || 0;
	    			iteIds[str_type] = iteIds[str_type] + quantity;
	    		};
				*/
	            /*
	    		this.ensure_ctrl_id = function(ctrl) {
	    			ctrl._ = ctrl._ || {};
	    			
	    			//console.log('ensure_ctrl_id ctrl._ ' + stringify(ctrl._));
	    			
	    			if (typeof ctrl._.id == 'undefined') {
	    				// ctrl._.class_name
	    				
	    				
	    				var id = typed_enhancement_id(ctrl._.type_name);
	    				ctrl._.id = id;
	    			}
	    			return ctrl._.id;
	    		};
	    		// may be retired... could be behaviours / surfaces in specs.
	    		this.apply_enhancement_id_spec = function(spec, ctrl) {
	    			
	    			// specifically what does this do?
	    			
	    			// The control will have another DOM attribute set
	    			// This is only for when composing an enhanced control on the server?
	    			// jsgui_e_id
	    			
	    			spec.dom = spec.dom || {};
	    			spec.dom.attributes = spec.dom.attributes || {};
	    			var tName = ctrl.typeName || 'misc';
	    			var tei = typed_enhancement_int(tName);
	    			spec.dom.attributes['jsgui_e_id'] = String(tei);
	    			return [tName, tei];
	    		};
				*/

	            /*
	            this.get_spec = function (spec) {
	                spec = spec || {};
	                spec.page_context = this;
	                return spec;
	            };
	            */

	            // Give it the abstract component to make?
	            //  So the abstract constructor gets called, and then the abstract instance goes into the make function.

	            // contextify - contextifies a recently made item.

	            //this.make = function()

	            var map_Controls = this.map_Controls = {};
	            //  they are constructors

	            var map_controls = this.map_controls = {};

	            map_Controls['control'] = Control;

	        },
	        'make': function(abstract_object) {
	            if (abstract_object._abstract) {
	                //var res = new 
	                // we need the constructor function.

	                var constructor = abstract_object.constructor;
	                //console.log('constructor ' + constructor);

	                
	                //throw 'stop';

	                var aos = abstract_object._spec;

	                // could use 'delete?'
	                aos.abstract = null;
	                aos.context = this;

	                //console.log('abstract_object._spec ' + stringify(abstract_object._spec));
	                // Not sure it is creating the right constructor.


	                var res = new constructor(abstract_object._spec);
	                return res;
	            } else {
	                throw 'Object must be abstract, having ._abstract == true'
	            }
	        },
	        'update_Controls': fp(function(a, sig) {
	            //console.log('update_Controls sig ' + sig);
	            if (sig == '[o]') {
	                // a map of keys and constructors values.
	                var o = a[0];
	                var map_Controls = this.map_Controls;
	                each(o, function(name, Constructor) {
	                    name = name.toLowerCase();
	                    //console.log('name ' + name);
	                    map_Controls[name] = Constructor;
	                });

	            }
	            if (sig == '[s,f]') {
	                var name = a[0];
	                var Constructor = a[1];
	                name = name.toLowerCase();
	                //console.log('name ' + name);
	                this.map_Controls[name] = Constructor;
	            }
	        }),

	        //'set_max_ids': function(map_max_ids) {

	        //},

	        // begin_drag?

	        // can this be plumbed into the recently created events?
	        //  we tell it that the drag is starting.

	        // Want to tell the page context about beginning different types of drags?

	        // Want the page context to be notified whenever a drag begins.
	        //  If there is a selection scope then it's dragging those items.

	        // Otherwise it could be dragging a control.
	        //  Want the control dragging to call events here, so the Page_Context knows where controls are being dragged from / to.




	        // This is currently about beginning a drag with a selection scope, but we may just want to be dragging a single control
	        //  or controls not to do with a selection_scope.

	        // In the case of there being a selection scope, we want to drag around something that represents the selection.

	        // With direct drag, or dragging a handle, we don't have this copy of the selection scope.

	        // drag_selection_scope_shallow_copy

	        // May want to refactror things to have more behaviours and drag abstractions.
	        //  However, working more on the style properties first makes more sense.

	        // I'll do some more without major further abstractions.
	        //  

	        // Defining the repositioning...
	        //  could have that extnedable.

	        // then we have the dragging of a control.
	        //  Moves the control, does not leave a placeholder.

	        // Need to be notified of it?
	        //  Control may be dockable.

	        // (notify)
	        'begin_drag_ctrl': function(e_begin, ctrl) {
	            // Though the ctrl should probably go in the event object - maybe need to formalise an API.

	            // Different types of drag could be made modular to make builds smaller.
	            //  For the moment need to add functionality then work on build size later.





	        },

	        'raise': function(event_name) {
	            // need to access the object's bound events.

	            //this.__bound_events = this.__bound_events || {};

	            // but which context?

	            //  the context of the event raiser?

	            var a = arguments;
	            var a2 = [];
	            if (a.length > 1) {
	                for (var c = 1; c < a.length; c++) {
	                    a2.push(a[c]);
	                }
	            }

	            if (this.__bound_events) {
	                var corresponding_events = this.__bound_events[event_name];
	                for (var c = 0, l = corresponding_events.length; c < l; c++) {
	                    if (a2.length > 0) {
	                        corresponding_events[c].apply(this, a2);
	                    } else {
	                        corresponding_events[c].apply(this);
	                    }
	                    
	                }
	            }

	        },

	        // listen function as well.
	        //  to listen for an event, it's like add_event_handler.

	        // may change that to listen.

	        'listen': function(event_name, handler) {
	            this.__bound_events = this.__bound_events || {};
	            this.__bound_events[event_name] = this.__bound_events[event_name] || [];
	            this.__bound_events[event_name].push(handler);
	        },


	        'move_drag_ctrl': function(e_move, ctrl) {
	            // Though the ctrl should probably go in the event object - maybe need to formalise an API.

	            // Different types of drag could be made modular to make builds smaller.
	            //  For the moment need to add functionality then work on build size later.

	            //console.log('move_drag_ctrl ', e_move);
	            
	            // maybe tify up the params so there is a move_offset value.
	            //  perhaps we dont need it and it makes unnecessary calculation.

	            // anyway, use the clientx and client y

	            // should maybe measure the client area?
	            //  or do that once and do it again on resize?

	            // Should be able to get the client size from the Page_Context.
	            //  Page_Context is turning out to be very versitile on the client too, nice that it's got similarities on the server
	            //  but used very differently.


	            // find out where we are within the client window.

	            // get_window_size



	            var window_size = get_window_size();



	            //console.log('Window width = ' + winW);
	            //console.log('Window height = ' + winH);

	            // find how close the clientX / clientY is to the sides

	            // could even have two different distances / ranges for
	            //  1) anchor to position
	            //  2) anchor to poisition and hide, only showing with mouseover of small region.

	            // find how close to edges...

	            var from_left, from_top, from_right, from_bottom;



	            var clientX = e_move.clientX;
	            var clientY = e_move.clientY;

	            // see if it's at the top or bottom...
	            //  would be nice to have different distances, so halfway to the margin anchors it in a way that it hides itself.



	            var margin = 64;

	            var is_left = clientX <= margin;
	            var is_top = clientY <= margin;

	            var is_right = clientX >= window_size[0] - margin;
	            var is_bottom = clientY >= window_size[1] - margin;

	            // need more generic event binding for objects.

	            // listen
	            // raise




	            // then for the combinations...
	            //console.log('is_top ' + is_top);
	            if (is_top) {
	                // raise the event...

	                // then some things will listen for it.
	                this.raise('drag-ctrl-top');

	            } else if (is_bottom) {
	                // raise the event...

	                // then some things will listen for it.
	                this.raise('drag-ctrl-bottom');

	            } else if (is_left) {
	                // raise the event...

	                // then some things will listen for it.
	                this.raise('drag-ctrl-left');

	            } else if (is_right) {
	                // raise the event...

	                // then some things will listen for it.
	                this.raise('drag-ctrl-right');

	            } else {
	                this.raise('drag-ctrl-no-zone');

	            }


	        },

	        'end_drag_ctrl': function(e_end, ctrl) {
	            // raise the event...
	            this.raise('drag-ctrl-end', e_end, ctrl);


	        },

	        'drop_ctrl': function(ctrl, zone) {
	            //console.log('page context drop control ctrl ' + ctrl);
	            //console.log('zone ' + zone);

	            if (this.full_window) {
	                // anchor the control in that zone.

	                this.anchor(ctrl, zone);

	                // Basically we need to anchor one control inside another.
	                //  The anchor zone will be a part of the grid_9 (or other mechanism)


	            }
	        },

	        'anchor': function(ctrl, zone) {
	            console.log('page context anchor ');

	            if (this.full_window) {
	                var fw = this.full_window;

	                // and then does the full window control have a grid_9?

	                var g9 = fw.get('grid_9');
	                //console.log('g9 ' + g9);

	                if (g9) {

	                    // Then the control will know its anchored.
	                    //  Dragging that control will unanchor it.

	                    // anchor the control to a position within that g9.
	                    //  Basically just put the control in place.
	                    //  Could do ctrl.anchor(g9, zone);

	                    // Generally won't be anchoring g9s to other things, but don't want to imply that in the fn name.
	                    //  g9.anchor_ctrl()

	                    // may have ctrl.anchor_ctrl, and anchoring is basically putting inside, but it sets it as being
	                    //  'anchored'.

	                    g9.anchor_ctrl(ctrl, zone);


	                }

	                var fwtn = fw.__type_name;
	                //console.log('fwtn ' + fwtn);

	            }
	        },

	        // Ending a control drag.
	        //  If we are to dock the control somewhere, we have some docking code that does this that can be called separately from the
	        //  event.


	        // more than notify, this does some UI too.
	        'begin_drag_selection_scope': function(e_begin, selection_scope) {

	            // drag begin event, then what we are dragging.
	            //  we could be dragging a selection scope
	            //  just a single control
	            //  a copy of a control.

	            // going for some specific names to begin with may help.

	            // rename this begin_selection_scope_drag





	            // different drag modes...

	            //  drag-shallow-copy
	            //  drag-ctrl

	            // drag-shallow-copy-begin

	            // I think awareness of the drag mode will help.

	            // The selection scope may not be relevant when dragging a window.
	            //  However, we could count one item as being selected in the drag?








	            console.log('page context drag selection_scope ' + selection_scope);

	            var map_selected_controls = selection_scope.map_selected_controls;
	            //console.log('map_selected_controls ' + stringify(map_selected_controls));

	            // true keys...

	            var arr_selected = jsgui.true_vals(map_selected_controls);
	            console.log('arr_selected.length ' + arr_selected.length);

	            // make shallow copies of these selected controls.

	            var shallow_copies_selected = jsgui.shallow_copy(arr_selected);


	            this.drag_selected = arr_selected;

	            var ctrl_abs = this.make(Control({

	            }));

	            ctrl_abs.add(shallow_copies_selected);

	            var screenX = e_begin.screenX;

	            //console.log('screenX ' + screenX);
	            var screenY = e_begin.screenY;

	            var clientX = e_begin.clientX;
	            var clientY = e_begin.clientY;


	            //ctrl_abs.set('dom.attributes.style.position', 'absolute');
	            //ctrl_abs.set('dom.attributes.style.height', '200px');
	            //ctrl_abs.set('dom.attributes.style.width', '320px');
	            //ctrl_abs.set('dom.attributes.style.background-color', '#ABCDEF');

	            // Could set its class or have better way of doing an inline style.

	            ctrl_abs.set('dom.attributes.style', 'position: absolute; left: ' + clientX + 'px; top:' + clientY + 'px; height: 200px; width: 320px; background-color: #EEEEEE');
	            var html = ctrl_abs.all_html_render();

	            var el_ctr = document.createElement('div');
	            el_ctr.innerHTML = html;

	            var el_abs = el_ctr.childNodes[0];

	            document.body.appendChild(el_abs);

	            ctrl_abs.set('el', el_abs);

	            // within the context, we can make new controls and put them in the document.
	            // an absolutely positioned div.

	            this.ctrl_abs = ctrl_abs;


	            //throw 'stop';
	        },



	        'move_drag_selection_scope': function(e_move) {
	            console.log('page context move_drag_selection_scope');

	            // Don't want this to be the case with all drag moves...
	            //  We may be moving the actual item.




	            var clientX = e_move.clientX;
	            var clientY = e_move.clientY;

	            // definitely would be useful to have the abstraction that covers individual style properties.
	            var style = 'position: absolute; left: ' + clientX + 'px; top:' + clientY + 'px; height: 200px; width: 320px; background-color: #EEEEEE'
	            //console.log('style ' + style);
	            var el = this.ctrl_abs.get('el');
	            //console.log('el ' + el);
	            el.style.cssText = style;


	        },
	        'end_drag_selection_scope': function(e_end) {
	            if (this.ctrl_abs) {
	                this.ctrl_abs.remove();
	                this.ctrl_abs = null;
	            }
	        },

	        'ensure_dock_placeholder': function(pos) {
	            //console.log('Page Context ensure_dock_placeholder ' + pos);

	            var fw = this.full_window;

	            if (fw) {
	                fw.ensure_dock_placeholder(pos);
	            }
	        }

	    });

		jsgui.Page_Context = Page_Context;

	// horizontal-slider.js

		var Client_Page_Context = jsgui.Page_Context.extend({
			'init': function(spec) {
				spec = spec || {};

	    		
	    		this._super(spec);
	    		//this.set('document', spec.document);
	    		this.document = spec.document || document;

	    		// Not so sure about creating the resource pool or requiring the resources.
	    		//  Could have problems with dependencies.


	    		//var resource_pool = new Client_Resource_Pool();
	    		//this.pool = resource_pool;

	    		//resource_pool.start();
	    		// so the pool probably won't have loaded when controls get activated.

	    		// Add the resource_pool into the page context at a later occasion.
	    		//  The basic html client will not need resource.
	    		//  Resource requires some html functionality though.


	    		// The item IDs could be handled here... use the local variable closure here.
	    		
			}
			
			//get id's of particular types of items...
			
		});
		jsgui.Client_Page_Context = Client_Page_Context;

	var Horizontal_Slider = Control.extend({
			// fields... text, value, type?
			//  type could specify some kind of validation, or also 'password'.
				
			// single field?
			'fields': [
				['min', Number],
				['max', Number],
				['value', Number],
				['drag_mode', String]
			],			
			//  and can have other fields possibly.

			// This should be customizable in which values it holds.
			//  For the moment, set up the value range on the server, and send that to the client as fields which we get back from the DOM when
			//  the Control gets activated.

			// I think this can take a min, a max, and a value.
			//  Perhaps operating in 'proportion' mode between 0 and 1 is easiest?
			//  Also having it handle time values - could use ms.


			// Basically, this needs to be told its min value, its max value, and its current value.

			// Also, want 'ghost' drag mode so that the handle can be dragged, and only changes position on release
			//  For different scrubber behaviour to what is in the iPod app.



			
			
			'init': function(spec, add, make) {
				this._super(spec);
				this.__type_name = 'horizontal_slider';

				// Want a 'ghost' drag mode.



				if (!spec.abstract && !spec.el) {
					// the bar at the top.

					// It's going to act as a drag handle for this.
					//  The drag system will integrate with various bands / window positions.

					// Maybe a property to say that it's dockable.
					

					//var top_bar = new Control({
					//	'context': this._context
					//})
					//top_bar.set('dom.attributes.class', 'title bar');


					//this.add(top_bar);

					var div_relative = add(Control({'class': 'relative'}))
					this.set('dom.attributes.class', 'horizontal slider');

					// Then we add the bar over the width.
					var h_bar = make(Control({'class': 'h-bar'}));
					var v_bar = make(Control({'class': 'v-bar'}));

					div_relative.add(h_bar);
					div_relative.add(v_bar);

					var ctrl_fields = {
						'div_relative': div_relative._id(),
						'h_bar': h_bar._id(),
						'v_bar': v_bar._id()
					}

					this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));

					// Send the min, max and value fields over to the client too.

					var min = this.get('min').value();
					var max = this.get('max').value();



					//console.log('min', min);
					//console.log('max', max);

					// Is value a specific case?

					var value = this.get('value').value();

					var obj_fields = {
						//'ms_duration': ms_duration
						'min': min,
						'max': max,
						'value': value
					};

					var drag_mode = this.get('drag_mode');

					if (drag_mode) {
						obj_fields.drag_mode = drag_mode.value();
					}
					//console.log('tof(min)', tof(min));
					//throw 'stop';

					this.set('dom.attributes.data-jsgui-fields', stringify(obj_fields).replace(/"/g, "[DBL_QT]").replace(/'/g, "[SNG_QT]"));

					this.active();
				}

				
			},
			'activate': function(el) {
				this._super(el);
				console.log('Horizontal Slider activate');

				// Also need to deal with touch events.
				//  I think that touch tolerance would do the job.
				//  Need to find the right trick to use for this, if there is one.

				// Could probably work using a lower level touch API
				//  Detect if the touch is near the item we want to drag.

				// Perhaps touch tolerance could be done by using a larger touch overlay, or touch handle.






				var that = this;

				var div_relative = this.get('div_relative');
				var h_bar = this.get('h_bar');
				var v_bar = this.get('v_bar');

				var ghost_v_bar;



				//console.log('h_bar', h_bar);
				//console.log('v_bar', v_bar);

				var size = this.size();
				//console.log('size', size);

				var size_v_bar = v_bar.size();
				var w_v_bar = size_v_bar[0];
				var h_w_v_bar = w_v_bar / 2;

				var h_padding = 5;

				var h_bar_width = size[0] - h_padding * 2;

				h_bar.style({
					'width': h_bar_width + 'px'
				});

				var ctrl_html_root = this._context.ctrl_document;


				// have lower level drag working on the h_bar?
				//  want some kind of flexible drag, but that could be done while cutting out code.
				//  for the moment, will do the eventhandlers?
				//   generic drag handlers would be useful for touch interfaces as well.

				var pos_down, pos_current, pos_offset;

				var orig_v_bar_l = parseInt(v_bar.style('left'), 10);
				var new_v_bar_l;

				//console.log('orig_v_bar_l', orig_v_bar_l);

				var drag_mode;

				var prop;

				var ctrl_ghost_v_bar;
				var context = this._context;

				var v_bar_center_pos;
				var v_bar_center_pos_when_pressed;

				var ensure_ctrl_ghost_v_bar = function() {
					if (!ctrl_ghost_v_bar) {
						ctrl_ghost_v_bar = new Control({
							'context': this._context,
							'class': 'ghost v-bar'
						});

						div_relative.add(ctrl_ghost_v_bar);

						// TODO: Automatic activation of an added control will be very useful.
						ctrl_ghost_v_bar.activate();
					} else {
						div_relative.add(ctrl_ghost_v_bar);
					}
				}

				var fn_mousemove = function(e_mousemove) {

					// Could maybe do the same calculation as mouseup?



					//console.log('e_mousemove', e_mousemove);

					/*

					pos_current = [e_mousemove.pageX, e_mousemove.pageY];

					pos_offset = v_subtract(pos_current, pos_down);
					console.log('orig_v_bar_l', orig_v_bar_l);
					console.log('pos_offset', pos_offset);

					new_v_bar_l = orig_v_bar_l + pos_offset[0];


					if (drag_mode == 'ghost') {
						new_v_bar_l = new_v_bar_l;
						console.log('new_v_bar_l', new_v_bar_l);

					} else {

					}

					if (new_v_bar_l > size[0] - h_padding * 2) {
						new_v_bar_l = size[0] - h_padding * 2;
					}

					if (new_v_bar_l < h_padding) {
						new_v_bar_l = h_padding;
					}

					*/

					var bcr_h_bar = h_bar.bcr();
					//console.log('bcr_h_bar', bcr_h_bar);

					// Want the pageX - 

					var bcr_h_bar_x = bcr_h_bar[0][0];
					var bcr_h_bar_w = bcr_h_bar[2][0];

					// then the position of the mouse event from that bcr_x

					var up_offset_from_bcr_h_bar_x = e_mousemove.pageX - bcr_h_bar_x;
					//console.log('up_offset_from_bcr_h_bar_x', up_offset_from_bcr_h_bar_x);

					if (up_offset_from_bcr_h_bar_x < 0) up_offset_from_bcr_h_bar_x = 0;
					if (up_offset_from_bcr_h_bar_x > bcr_h_bar_w) up_offset_from_bcr_h_bar_x = bcr_h_bar_w;

					//var prop = up_offset_from_bcr_h_bar_x / bcr_h_bar_w;

					//console.log('prop', prop);

					//var new_val = prop * max;
					// need to constrain the bar values.

					if (drag_mode == 'ghost') {
						ensure_ctrl_ghost_v_bar();
						//ctrl_ghost_v_bar.style('left', (pos_current[0] + new_v_bar_l) + 'px');

						//ctrl_ghost_v_bar.style('left', (up_offset_from_bcr_h_bar_x + (h_w_v_bar)) + 'px');
						ctrl_ghost_v_bar.style('left', (up_offset_from_bcr_h_bar_x) + 'px');

					} else {
						

						v_bar.style('left', up_offset_from_bcr_h_bar_x + 'px');
					}

					// Depending on the drag mode.
					//  If it is in ghost mode then we ensure existance of and then use a ghost v_bar control.




					

				}

				var fn_mouseup = function(e_mouseup) {

					console.log('e_mouseup', e_mouseup);

					ctrl_html_root.off('mousemove', fn_mousemove);
					ctrl_html_root.off('mouseup', fn_mouseup);

					// Find where it is within the bounding client rect.

					//var bcr = that.bcr();
					//console.log('bcr', bcr);
					//var offset_x = e_mouseup.pageX - bcr[0][0];
					//console.log('offset_x', offset_x);


					// Nice, looks like the getBoundingClientRect system works fine.

					// Will also use the width of the hbar to setermine how far along it is.
					//  And the left pos of the hbar?

					// 





					var bcr_h_bar = h_bar.bcr();
					console.log('bcr_h_bar', bcr_h_bar);

					// Want the pageX - 

					var bcr_h_bar_x = bcr_h_bar[0][0];
					var bcr_h_bar_w = bcr_h_bar[2][0];

					// then the position of the mouse event from that bcr_x

					var up_offset_from_bcr_h_bar_x = e_mouseup.pageX - bcr_h_bar_x;
					console.log('up_offset_from_bcr_h_bar_x', up_offset_from_bcr_h_bar_x);

					if (up_offset_from_bcr_h_bar_x < 0) up_offset_from_bcr_h_bar_x = 0;
					if (up_offset_from_bcr_h_bar_x > bcr_h_bar_w) up_offset_from_bcr_h_bar_x = bcr_h_bar_w;

					var prop = up_offset_from_bcr_h_bar_x / bcr_h_bar_w;

					console.log('prop', prop);

					/*


					//pos_current = [e_mousemove.pageX, e_mousemove.pageY];

					ctrl_html_root.remove_class('dragging');

					pos_up = [e_mouseup.pageX, e_mouseup.pageY];

					var pos_offset_up = v_subtract(pos_up, pos_down);

					console.log('pos_offset_up', pos_offset_up);

					var offset_h_bar = h_bar.offset();

					// The page offset of the h_bar?

					var size_h_bar = h_bar.size();

					var x_up_within_h_bar = pos_up[0] - offset_h_bar[0];
					console.log('x_up_within_h_bar', x_up_within_h_bar);

					*/

					if (drag_mode == 'ghost') {


						ctrl_ghost_v_bar.remove();

						var min = that.get('min');
						if (min.value) min = min.value();
						var max = that.get('max');
						if (max.value) max = max.value();

						console.log('pos_down', pos_down);



						//var prop = x_up_within_h_bar / h_bar_width;

						var new_val = prop * max;



						console.log('new_val', new_val);


						// Find the current mouse position within the slider bar.

						// We can use the offset of the relative container.
						//  I think an offset function in Control will help with this.
						//   It measures the offset in the DOM.
						//   While CSS is in use and the values are not integrated we need to do some DOM measurement.
						//    Not directly getting data from the CSS files at the moment.




						//pos_current = [e_mousemove.pageX, e_mousemove.pageY];

						//pos_offset = v_subtract(pos_current, pos_down);


						// Need to calculate the new proportion through.
						//  Don't rely on a cached answer.





						// Want it so that this value change will be treated differently, because it's source is the user
						//  (mouse).

						// The Media_Scrubber would then recognise that the change came from the user.
						// The scrubber frequently has its value changed by the audio player.
						//  The audio player causes the scrubber to advance as the track advances.
						//  Want it so that the audio player can then recognise scrubber move events that come from the user.
						//   Don't want the audio player to respond to scrubber movement commands that come from itself.

						// Perhaps in this case, the Audio_Player Control can be considered to be the event source.
						// I think having an event object will be better stylistically.
						//  More along how DOM events work... makes it more consistant.

						// And give it the source of the action?
						//  Could give it the mouse event for it to know that the add action came through a mouse / browser event, not from itself.

						that.set('value', new_val);


					} else {
						orig_v_bar_l = new_v_bar_l;
					}

					

				}

				v_bar.on('mousedown', function(e_mousedown) {
					var dm = that.get('drag_mode');
					//drag_mode = ;
					if (dm) {
						drag_mode = dm.value();
					}
					v_bar_center_pos_when_pressed = v_bar_center_pos;

					console.log('drag_mode', drag_mode);

					ctrl_html_root.on('mousemove', fn_mousemove);

					ctrl_html_root.on('mouseup', fn_mouseup);

					ctrl_html_root.add_class('dragging');

					// use pageX and pageY
					pos_down = [e_mousedown.pageX, e_mousedown.pageY];

				});

				// So the event does not get raised when setting a field?

				//this.get('value').on('change', function(name, value) {
				//	console.log('h slider value change ', name, value);
				//});

				

				this.on('change', function(e_change) {

					var name = e_change.name, value = e_change.value;
					//console.log('h slider change', e_change);

					if (name == 'value') {
						var min = that.get('min');
						if (min.value) min = min.value();

						// Very annoying this.
						//  We need tools to make it easier to get the value out of a data_value, or a Data_Object / Control.
						//  Sometimes they return DV, sometimes POJO.





						var max = that.get('max');
						if (max.value) max = max.value();

						prop = value / max;
						//console.log('prop', prop);

						var size_h_bar = h_bar.size();
						v_bar_center_pos = Math.round((size_h_bar[0] * prop) + h_padding - h_w_v_bar);

						//console.log('v_bar_center_pos', v_bar_center_pos);

						//console.log('v_bar', v_bar);

						v_bar.style('left', v_bar_center_pos + 'px');

						// then use this proportion * the width of the bar.


					}
				});



				// need to 


			}
		});

	jsgui.Horizontal_Slider = Horizontal_Slider;

	console.log('jsgui loaded');




