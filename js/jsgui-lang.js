// This is resulting in smaller code in other parts of the framework.

define(function () {
    //Do setup work here
	//alert('loading jsgui-lang');
	// lots of things will be in var declarations....
	//  
	//return {};
	var initializing = false, fnTest = /xyz/.test(function() { xyz; }) ? /\b_super\b/ : /.*/;
    var Class = function() {};
    Class.extend = function(prop, namespcExtension, propsToMerge) {
        var _super = this.prototype;
        initializing = true;
        var prototype = new this();
        initializing = false;
        for (var name in prop) {
        	if (name.charAt(0) === '#') {
        		prototype[name.substring(1)] = prototype[prop[name]];
        	} else {
        		prototype[name] = typeof prop[name] === 'function' &&
    	        typeof _super[name] === 'function' && fnTest.test(prop[name]) ?
    	        	// had some difficulty using fp() with 'init' functions. could it have to do with function names?	
    	        	
    	        (function(name, fn) {
    	            return function() {
    	                var tmp = this._super;
    	                this._super = _super[name];
    	                var res = fn.apply(this, arguments);
    	                this._super = tmp;
    	                return res;
    	            };
    	        })(name, prop[name]) :
    	        prop[name];
        	};
        };
        function Class() {
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        };
        Class.prototype = prototype;
        Class.constructor = Class;
        Class.extend = arguments.callee;
        
        /*
        if (namespcExtension) {
            each(namespcExtension, function(i, n) {
                Class[i] = n;
            });
        };
        if (propsToMerge) {
            each(propsToMerge, function(i, n) {
                if (typeof Class.prototype[i] === 'undefined') {
                    Class.prototype[i] = n;
                } else {
                    $.extend(true, Class.prototype[i], n);
                };
            });
        }
        */
        
        return Class;
    };
	

	var each = function(collection, fn, context) {
		// each that puts the results in an array or dict.
		if (collection) {
			if (is_array(collection)) {
				var res = [];
				for (var c = 0, l = collection.length; c < l; c++) {
					var res_item;
					if (context) {
						res_item = fn(c, collection[c]);
					} else {
						res_item = fn.call(context, c, collection[c]);
					}
					res.push(res_item);
				}
				return res;
			} else {
				var name, res = {};
				for (name in collection ) {
					if (context) {
						res[name] = fn.call(context, name, collection[name]);
					} else {
						res[name] = fn(name, collection[name]);
					}
				}
				return res;
			}
		}
		
		
	};
	var jq_class2type = {};
	var jq_type = function( obj ) {
		return obj == null ?
			String(obj):
			jq_class2type[toString.call(obj)] || "object";
	};
	
	var is_array = Array.is_array || function( obj ) {
		return jq_type(obj) === "array";
	}, is_dom_node = function isDomNode(o) {
	    return (typeof o.nodeType != 'undefined' && typeof o.childNodes != 'undefined');
	};
	
	
	
	each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
		jq_class2type["[object " + name + "]"] = name.toLowerCase();
	});
	
	/*
	var jq_type = function( obj ) {
		return obj == null ?
			String(obj):
			jq_class2type[toString.call(obj)] || "object";
	};
	*/
	
	var jq_isFunction = function( obj ) {
		return jq_type(obj) === "function";
	};
	
	var jq_isWindow = function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	};
	
	var hasOwn = Object.prototype.hasOwnProperty;
    

	var jq_isPlainObject = function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jq_type(obj) !== "object" || obj.nodeType || jq_isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for (key in obj) {}

		return key === undefined || hasOwn.call(obj, key);
	};
	
	// jQuery Extend
	
	var jq_extend = function() {
		var options, name, src, copy, copyis_array, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (typeof target !== "object" && !jq_isFunction(target)) {
			target = {};
		}

		// (extend (jQuery) itself if only one argument is passed) no longer in jQuery
		if (length === i) {
			target = this;
			--i;
		}

		for ( ; i < length; i++) {
			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {
				// Extend the base object
				
				// nope... need to go through all items in the array if its an array, copying undefined as needed.
				
				if (is_array(options)) {
					
					// could maybe use each here anyway.
					//  but a direct function may be faster.
					
					for(var name = 0, l = options.length; name < l; name++) {
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (jq_isPlainObject(copy) || (copyis_array = is_array(copy)))) {
							if (copyis_array) {
								copyis_array = false;
								clone = src && is_array(src) ? src : [];
							} else {
								clone = src && jq_isPlainObject(src) ? src : {};
							}
							// Never move original objects, clone them
							target[ name ] = jq_extend( deep, clone, copy );
						// Don't bring in undefined values???
						} //else if ( copy !== undefined ) {
						else {
							target[ name ] = copy;
						}
					}
					
					
				} else {
					for (name in options) {
						
						//console.log('name ' + name);
						
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (jq_isPlainObject(copy) || (copyis_array = is_array(copy)))) {
							if (copyis_array) {
								copyis_array = false;
								clone = src && is_array(src) ? src : [];
							} else {
								clone = src && jq_isPlainObject(src) ? src : {};
							}
							// Never move original objects, clone them
							target[ name ] = jq_extend( deep, clone, copy );
						// Don't bring in undefined values
						} else if ( copy !== undefined ) {
							target[ name ] = copy;
						}
					}
				}
				
				
				
			}
			//console.log('arguments[i] ' + stringify(arguments[i]));
			//console.log('options ' + stringify(options));
		}
		// Return the modified object
		//console.log('target ' + stringify(target));
		return target;
	}, extend = jq_extend;
    
	var clone = function(obj) {
		var t = tof(obj);
		if (t == 'array') {
			
			// slice removes undefined items
			//console.log('clone obj ' + stringify(obj));
			//console.log('obj.length ' + obj.length);
			/*
			var res = [];
			each(obj, function(i, v) {
				console.log('i ' + i);
				res.push(v);
			});
			return res;
			*/
			return obj.slice();
			
			
		} else if (t == 'undefined') {
			return undefined;
		} else if (t == 'string') {
			return obj;
		} else {
			
			// extend not cloning the undefined values in the array properly, don't want them trimmed.
			
			return extend(true, {}, obj);
		}
	};
	
	var x_clones = function(obj, x) {
		var res = [];
		for (var c = 0; c < x; c++) {
			res.push(clone(obj));
		}
		return res;
	};
	
	
	var get_truth_map_from_arr = function(arr) {
		var res = {};
		each(arr, function(i, v) {
			res[v] = true;
		});
		return res;
	};
	
	// not a truth map because 0 == false. Could use this but do different check, like is_defined.
	var get_map_from_arr = function(arr) {
		var res = {};
		each(arr, function(i, v) {
			res[v] = i;
		});
		return res;
	}
	
	var arr_like_to_arr = function(arr_like) {
    	// like an arguments list
		// is this working in Safari?
		
    	var res = [];
    	
    	// This was not working in Safari! Worked in Chrome. Probably (mis?)recognised it as an object.
    	//each(arr_like, function(i, v) {
    	//	res.push(v);
		//});
    	
    	for (var c = 0, l = arr_like.length; c < l; c++) {
    		res.push(arr_like[c]);
    	};
    	
    	return res;
    };
	
    /*
    var is_ctrl = function(obj) {
    	return (typeof obj != 'undefined' && obj != null && typeof obj.$render != 'undefined');
    };
    */
    
    var is_ctrl = function(obj) {
    	
    	//if (obj._) {
    		//console.log('obj._.type_name ' + obj._.type_name);
    	//}
    	
    	
    	return (typeof obj != 'undefined' && obj != null && is_defined(obj._) && is_defined(obj._.type_name));
    };
    
    // may change to the jq_type code.
    var tof = function(obj) {
    	var res = typeof(obj);
    	if (res == 'object' && is_array(obj)) res = 'array';
    	if (res == 'object' && is_ctrl(obj)) res = 'control';
    	return res;
    };
    
    var is_defined = function(value) {
    	return tof(value) != 'undefined';
    }, isdef = is_defined;
    

	var stringify = function(obj, includeFunctions) {
		// Likely optimization: use array to build the string, then join it for the result.
		//  Now updated.
		// Could probably use polymorphism here and save space
		
		// Designed for stringifying specs including functions in mind.
		var t = typeof obj, res = [];
		
		
		if (t == 'object') {
			var ia = is_array(obj);
			if (ia) {
				//res = res + '[';
				res.push('[');
				var first = true;
				for(var c = 0; c < obj.length; c++) {
					//if (!first) res = res + ', ';
					if (!first) res.push(', ');
					//res = res + stringify(obj[c]);
					res.push(stringify(obj[c]));
					first = false;
				};
				//res = res + ']';
				res.push(']');
			} else if (obj == null) {
				 res = ['null'];
			} 
			else if (is_ctrl(obj)) {
				//res = res + '{"ctrl": "' + obj.id() + '"}';
				res.push('{"ctrl": "' + obj.id() + '"}');
			} 
			else {
				//console.log('obj ' + obj);
				
				// a way of checking for a non-native toString?
				if (is_defined(obj.toString) && obj.toString.stringify === true) {
					res.push('"' + obj.toString() + '"');
				} else {
					var first = true;
					//res = res + '{';
					res.push('{');
					each(obj, function(i, v) {
						
						//console.log(tof(v));
						if (includeFunctions !== false && tof(v) !== 'function') {
							//if (!first) res = res + ', ';
							if (!first) res.push(', ');
							//res = res + '"' + i + '": ' + stringify(v);
							res.push('"' + i + '": ' + stringify(v));
							first = false;
						}
					});
					//res = res + '}';
					res.push('}');
				}
				
				
			};
		} else if (t == 'string') {
			// Escape characters in JSON string?
			//res = '"' + obj + '"';
			res.push('"' + obj + '"');
		} else if (t == 'undefined') {
			res = ['undefined'];
		} else if (t == 'function'){
			
			if (includeFunctions !== false) {
				res = [obj.toString()];
			}
		} else {
			res = [obj.toString()];
		}
		return res.join('');
	};
    
    var get_item_sig = function(i) {
		// also want to be able to do polymorphic rearrangements.
		//  these will need to be specified so they get rearranged as required.
		//  will check for some signatures and rearrange the arguments, and return that array. Will be useful all over the place in the library.
		
		// v2 = [i, i], v3 = [i, i, i]
		//  or even i2 = [i, i]? maybe not for the moment, plenty of simplification already, could maybe express things like that at some stage.
		
		// rearrangement - '[i, i], s' <- 's, [i, i]'
		//  if second arrangement, output the items in the order given.
		//  that seems to require parsing these signature strings.
		
		// returns the polymorphic signature.
		// same for each item in the array.
		
		// will get the poly signature for each item in the array?
		//  is it an array?
		
		var t = tof(i), res;
		
		// likely to use a map for this logic instead.
		//console.log('t ' + t);
		if (t == 'array') {
			var res = '[';
			for (var c = 0, l = i.length; c < l; c++) {
				if (c > 0) res = res + ',';
				res = res + get_item_sig(i[c]);
			}
			res = res + ']';
			//return res;
		} else if (t == 'string') {
			// is it a string that parses to an integer?
			// parses to a decimal number
			// parses to an rgb value
			// parses to hex value
			// various string regexs used (optionally), can say what we are looking for (for various parameters).
			//  may want a quick basic poly.
			
			
			
			res = 's';
		} else if (t == 'function') {
			res = 'f';
		} else if (t == 'control') {
			res = 'c';
		} else if (t == 'number') {
			// is it an integer?
			// is it a decimal?
			
			// are we checking for those anyway? maybe not by default.
			
			res = 'n';
		} else if (t == 'object') {
			
			// not sure about showing all the details of the object.
			
			res = 'o';
		} else if (t == 'undefined' ) {
			res = 'u';
		}
		//console.log('sig res ' + res);
		return res;
	};
	

	var functional_polymorphism = function(options, fn) {
		var a0 = arguments;
		if (a0.length == 1) {
			fn = a0[0];
			options = null;
		}
		//var that = this;
		var new_fn = function() {
			var a = arguments;
			// and if there is an array of arguments given... give as one argument.
			if (a.length == 1) {
				var sig = get_item_sig([a[0]]);
				// a 'l' property given to array given
				var a2 = [a[0]];
				a2.l = a2.length;
				return fn.call(this, a2, sig);
			} else if (a.length > 1) {
				var arr = arr_like_to_arr(a);
				arr = arr_trim_undefined(arr);
				var sig = get_item_sig(arr);
				arr.l = arr.length;
				return fn.call(this, arr, sig);
			} else if (a.length == 0) {
				arr = [];
				arr.l = 0;
				return fn.call(this, arr, '[]');
			}
		};
		return new_fn;
	}, fp = functional_polymorphism;
    
	var arrayify = fp(function(a, sig) {
    	
    	//console.log('arrayify sig ' + sig);
    	
    	// what about a pf function that provides an 'a' map.
    	//  has whatever properties have been provided and asked for.
    	var param_index, fn;
    	// (param_index, fn)
    	if (sig == '[f]') {
    		param_index = 0, fn = a[0];
    	} else if (sig == '[n,f]'){
    		param_index = a[0], fn = a[1];
    	}
    	// maybe done with pf for getting function signature.
    	//console.log('using arrayify');
    	//if (typeof param_index == 'undefined') param_index = 0;
    	
    	var res = function() {
    		// could use pf here? but maybe not 
    		
    		//console.log('arguments.length ' + arguments.length);
    		
    		var a = arr_like_to_arr(arguments), ts = atof(a), t = this;
    		
    		//console.log('a.length ' + a.length);
    		//console.log('a ' + stringify(a));
    		
    		//console.log('param_index ' + param_index);
    		//console.log('ts ' + stringify(ts));
    		
    		if (typeof param_index !== 'undefined' && ts[param_index] == 'array') {
    			//var res = [], a2 = a.slice(1); // don't think this makes a copy of the array.
    			var res = []; // don't think this makes a copy of the array.
    			//console.log('fn ' + fn);
    			
    			
    			each(a[param_index], function(i, v) {
    				var new_params = a;
        			new_params[param_index] = v;
    				// the rest of the parameters as normal
        			
        			var result = fn.apply(t, new_params);
        			//console.log('result ' + stringify(result));
    				res.push(result);
    			});
    			return res;
    		} else {
    			return fn.apply(t, a);
    		}
    	};
    	return res;
    });
	
	/*
	var ll_set = function(obj, prop_name, prop_value) {
		// not setting sub-properties specifically. sub-properties are properties of a kind
		//  however will not use ll_set inappropriately eg border.width works differently
		

		var arr = prop_name.split('.');
		//console.log('arr ' + arr);
		var c = 0, l = arr.length;
    	var i = obj._ || obj;
    	while (c < l) {
    		var s = arr[c];
    		//console.log('s ' + s);
    		if (typeof i[s] == 'undefined') {
    			if (c - l == -1) {
    				//console.log('default_value ' + default_value);
    				
    				i[s] = prop_value;
    			} else {
    				i[s] = {};
    			}
    		}
    		i = i[s];
    		c++;
    	};
    	return i;
		
		
		
	}
	*/
	
	var are_equal = function() {
		var a = arguments;
		if (a.length == 0) return null;
		if (a.length == 1) {
			var t = jsgui.tof(a[0]);
			if (t == 'array' && a[0].length > 1) {
				for (var c = 1, l = a[0].length; c < l; c++) {
					if (!jsgui.are_equal(a[0][0], a[0][c])) return false;
				}
			} else {
				return true;
			}
		}
		if (a.length == 2) {
			var ts = jsgui.atof(a);
			if (ts[0] != ts[1]) return false;
			var t = ts[0];
			if (t == 'string' || t == 'number') return a[0] == a[1];
			if (t == 'array') {
				if (a[0].length != a[1].length) return false;
				for (var c = 0, l = a[0].length; c < l; c++) {
					if (!jsgui.are_equal(a[0][c], a[1][c])) return false;
				};
			} else if (typeof a[0] == 'object') {
				// get the dict of keys for both, compare the lengths, (compare the keys), get merged key map
				var merged_key_truth_map = {};
				var c1 = 0;
				each(a[0], function(i, v) {
					merged_key_truth_map[i] = true;
					c1++;
				});
				var c2 = 0;
				each(a[1], function(i, v) {
					merged_key_truth_map[i] = true;
					c2++;
				});
				if (c1 != c2) return false;
				each(merged_key_truth_map, function(i, v) {
					if (!jsgui.are_equal(a[0][i], a[1][i])) return false;
				});
			}
		}
		if (a.length > 2) {
			var ts = jsgui.atof(a);
			if (!jsgui.are_equal(ts)) return false;
			var o = a[0];
			for (var c = 1, l = a.length; c < l; c++) {
				if (a[c] !== o) return false;
			}
		};
		return true;
	};
	
	

	var vectorify = function(n_fn) {
		// Creates a new polymorphic function around the original one.
		
		var fn_res = fp(function(a, sig) {
			if (a.l > 2) {
				var res = a[0];
				for (var c = 1, l = a.l; c < l; c++) {
					res = fn_res(res, a[c]);
					//console.log('res ' + res);
				}
				return res;
			} else {
				if (sig == '[n,n]') {
					return n_fn(a[0], a[1]);
				} else {
					// will need go through the first array, and the 2nd... but will need to compare them.
					var ats = atof(a);
					//console.log('ats ' + ats);
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
	
	// these are not the standard, established vector or matrix operations. They can be used for scaling of arrays of vectors.
	var v_multiply = vectorify(n_multiply), v_divide = vectorify(n_divide);
	
	var vector_magnitude = function(vector) {
		// may calculate magnitudes of larger dimension vectors too.
		
		//alert(tof(vector[0]));
		//alert(vector[0] ^ 2);
		
		var res = Math.sqrt((Math.pow(vector[0], 2)) + (Math.pow(vector[1], 2)));
		return res;
		
	};
	
	var distance_between_points = function(points) {
		var offset = vector_subtract(points[1], points[0]);
		return vector_magnitude(offset);
	}
	
	var arr_trim_undefined = function(arr_like) {
		var res = [];
		var last_defined = -1;
		
		each(arr_like, function(i, v) {
			
			var t = tof(v);
			if (t == 'undefined') {
				
			} else {
				last_defined = i;
			}
			
		});
		
		each(arr_like, function(i, v) {
			if (i <= last_defined) {
				res.push(v);
			}
		});
		return res;
	};
	
	
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
    	// currently no arguments provided, there may be in the future / future versions
    	var res = [], that = this;
    	each(items, function(i, v) {
    		res.push(fn.call(that, v)); // function called with item as its only parameter.
    	});
    	return res;
    };

    var mapify = function(fn) {
    	// been given a map / object
    	var res = fp(function(a, sig) {
    		var that = this;
    		if (sig == '[o]') {
    			var map = a[0];
    			each(map, function(i, v) {
    				fn.call(that, i, v);
    			});
    		} else if (a.length == 2){
    			// could take functions, but not dealing with objects may be tricky?
    			//  or just if there are two params its fine.
    			fn.apply(this, a);
    		}
    	});
    	return res;
    };
    
    var atof = function(arr) {
    	var res = [];
    	each(arr, function(i, v) {
    		res.push(tof(v)); 
    	});
    	return res;
    };
    
    var npx = arrayify(function(value) {
		// don't think we can use arrayify?
		
		// good candidate for pf? but how it deals with array trees...
		//  could have another one, like sf or spf that is simpler in terms of treating an array in the signature as just one array?
		
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
		//  Generally returns a number.
		// value
		var re = /px$/, res;
		if (sig == '[s]' && re.test(a[0])) {
			res = parseInt(a[0]);
		} else {
			res = a[0];
		};
		return res;
	}));
	
    var arr_ltrb = ['left', 'top', 'right', 'bottom'];
    

	var str_arr_mapify = function(fn) {
		var res = fp(function(a, sig) {
			if (a.l == 1) {
				if (sig == '[s]') {
					var s_pn = a[0].split(' ');
					//console.log('s_pn ' + s_pn.length);
					
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
	//  For the moment not exposed
	
	var ll_set = function(obj, prop_name, prop_value) {
		// not setting sub-properties specifically. sub-properties are properties of a kind
		//  however will not use ll_set inappropriately eg border.width works differently
		

		var arr = prop_name.split('.');
		//console.log('arr ' + arr);
		var c = 0, l = arr.length;
    	var i = obj._ || obj;
    	while (c < l) {
    		var s = arr[c];
    		//console.log('s ' + s);
    		if (typeof i[s] == 'undefined') {
    			if (c - l == -1) {
    				//console.log('default_value ' + default_value);
    				
    				i[s] = prop_value;
    			} else {
    				i[s] = {};
    			}
    		}
    		i = i[s];
    		c++;
    	};
    	return i;
		
		
		
	}
	
	var ll_get = fp(function(a, sig) {
		
		if (a.l == 2) {
			var arr = a[1].split('.');
			console.log('get arr ' + arr);
			var c = 0, l = arr.length;
        	var i = a[0]._ || a[0];
        	
        	while (c < l) {
        		var s = arr[c];
        		//console.log('s ' + s);
        		if (typeof i[s] == 'undefined') {
        			if (c - l == -1) {
        				//console.log('default_value ' + default_value);
        				//console.log(i[s]);
        				//i[s] = a[2];
        				//return i[s];
        			} else {
        				//i[s] = {};
        				throw 'object ' + s + ' not found';
        			}
        		} else {
        			if (c - l == -1) {
        				//console.log('default_value ' + default_value);
        				//console.log(i[s]);
        				//i[s] = a[2];
        				return i[s];
        			}
        		}
        		i = i[s];
        		c++;
        	};
        	//return i;
		}
	});
	
    
	var arr_hex_chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
	var dict_hex_to_bin = { '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15 };
	var str_hex_to_int = function(str_hex) {
		str_hex = str_hex.toUpperCase();
		var i = str_hex.length; //or 10
		var res = 0, exp = 1;
		while(i--)
		{
			var i_part = dict_hex_to_bin[str_hex.charAt(i)];
			var ip2 = i_part * exp;
			res = res + ip2;
			exp = exp * 16;
		  //...
		};
		return res;
	};
	var byte_int_to_str_hex_2 = function(byte_int) {
		var a = Math.floor(byte_int / 16), b = byte_int % 16, sa = arr_hex_chars[a], sb = arr_hex_chars[b], res = sa + sb;
		return res;
	};
	var arr_rgb_to_str_hex_6 = function(arr_rgb) {
		var r = byte_int_to_str_hex_2(arr_rgb[0]);
		var res = r + byte_int_to_str_hex_2(arr_rgb[1]) + byte_int_to_str_hex_2(arr_rgb[2]);
		return res;
	};
	var arr_rgb_to_css_hex_6 = function(arr_rgb) {
		// a / b    // divide a by b
		//a % b    // find the remainder of division of a by b
		return '#' + arr_rgb_to_str_hex_6(arr_rgb);
	};
	
    /*
     * Consider the following:
     * 
     * 
	var arr_multi_set_item = function(arr, iBegin, iEnd, item_name, value) {
		var c = iBegin;
		while (c <= iEnd) {
			arr[item_name][c] = value;
		};
		return arr;
	};
	var item_cond_set_multi_values = function(target, source, value_names) {
		each(value_names, function(i, v) {
			if (typeof source[v] != 'undefined') {
				target[v] = source[v];
			}
		});
		return target;
	};
	var arr_item_cond_set_multi_values = function(arr_target, arr_source, iMin, iMax, value_names) {
		for (var c = iMin; c <= iMax; c++) {
			item_cond_set_multi_values(arr_target[c], arr_source[c], value_names);
		};
	};
     * 
     */
    
	
	// information about data types such as 'int'?
	//  Perhaps some number data types could be re-implemented, like Decimal.
	
    var data_types_info = {};
	
	
	var i_data_types = {
			
	};
	
	var input_processors = {};
	
	var output_processors = {};
	
	var validators = {
		'number': function(value) {
			return tof(value) == 'number';
		}
	};
	
	// create data type instance from info
	
	// Code will be better organized using this, but it will still be quite a large amount of logic.
	//  Will make reference to special cases (directives) to control the flow.
	
	// I think the recursion inherant in the data types will be enough for this to work (hope so).
	//  The logic here looks at two layers sometimes, I hope it does not need recursion there, but rather that one directive may reference other things.
	//  Those other things could be their own data types that can be referenced.
	
	var referred_object_is_defined = function(object_reference) {
		return is_defined(object_reference[0][object_reference[1]]);
	}
	
	// This code is really big now.
	//  Without WS and logging it will be smaller.
	
	// The HTML module will give it HTML and CSS-like properties it will use for its internal representation and translations to and from 
	//  DOM representations.
	
	var data_type_instance_from_info = function(data_type_name) {
		//console.log('data_type_name ' + data_type_name);
		
		
		var data_type_info = data_types_info[data_type_name];
		// see if its an array or obj
		var td = tof(data_type_info);
		//console.log('td ' + td);
		//console.log('data_type_info ' + stringify(data_type_info));
		
		var directive = data_type_info[0];
		
		// object data type instance - they define all their subproperties
		var res = {
			
			// will have 'get' and 'set' functions.
				
			// they will need to navigate to the right level in the tree / get the right reference first.
			//  so maybe use get_reference or get_subproperty_reference
			//  a nested get_reference that breaks up the string into parts by split('.').
				
			// Then will expand the data to cover more CSS
				
			// Will also deal with indexed collections too.
			//  (and efficient selections of them, ordered by index, using B+ tree). The tree will not take so much space - but its efficient
			//  implementation will make selecting from long lists of items fast.
			// So no need to think about efficiency cut-off point for more items. Baseline high efficiency.
				
				
			'set': function(obj, property_path, value) {
				
				// nested_get_property_reference
				var prop_ref = this.nested_get_property_reference(obj, property_path);
				//console.log('* set prop_ref ' + stringify(prop_ref));
				
				// but with an optional array item - maybe the property reference should be different to how it currently is.
				
				//console.log('1) obj ' + stringify(obj));
				
				var dt_field = prop_ref[2];
				//console.log('dt_field ' + stringify(dt_field));
				
				var dti_level;
				
				
				if (tof(dt_field) == 'array' && dt_field[0] == 'optional_array') {
					var single_item_data_type = dt_field[2];
					//console.log('single_item_data_type ' + single_item_data_type);
					dti_level = data_type_instance(single_item_data_type);
					
					var new_val = dti_level.input(value);
					//console.log('*oarr new_val ' + stringify(new_val));
					
					
					
					prop_ref[0][prop_ref[1]] = new_val;
					
				} else {
					dti_level = data_type_instance(prop_ref[2]);
					var new_val = dti_level.input(value);
					//console.log('new_val ' + stringify(new_val));
					
					
					prop_ref[0][prop_ref[1]] = new_val;
				}
				
				
				//console.log('2) obj ' + stringify(obj));
				
				//console.log('returning prop_ref ' + stringify(prop_ref));
				
				return prop_ref;
				
			},
			
			'get': function(obj, property_path) {
				
				
				var prop_ref = this.nested_get_property_reference(obj, property_path);
				
				
				return prop_ref[0][prop_ref[1]];
			},
			
			
			// and the get function
			
			// need to test these with more CSS
			
			// need to have this system expanded to include collections, like control collections.
				
				
			'get_basic_object_type': function() {
				var tdti = tof(data_type_info);
				if (tdti == 'array') {
					// if it's an optional_array need to look inside the type.
				}
				
				return(tdti);
			},
				
			// or create_subproperty instead?
			
			/*
			'ensure_next_level_object': function(obj, next_level_property_name) {
				//gets the subproperty index
				
				var spi = this.get_subproperty_index(next_level_property_name);
				
				// use that to create the new object.
				
				// and returns that next level object in the right place.
				
				// be able to create the empty object
				
				//console.log('spi ' + stringify(spi));
				
			},
			*/
			
			'get_subproperty': function(obj, subproperty_name) {
				var idx = this.get_subproperty_index(subproperty_name);
				if (tof(idx) == 'array') {
					// replacement_set_sub_property
					
					
				} else {
					return obj[idx];
				}
				
			},
			
			// however, we may want to subproperty reference
			//  and to create it if it does not exist.
			
			// may have set or nested set.
			
			'create_empty': function(next_property_name) {
				// creates an empty object of the correct type.
				
				// will find out what form it is in.
				
				//console.log('create_empty ' + )
				//console.log('create_empty data_type_info ' + stringify(data_type_info));
				
				if (tof(data_type_info) == 'object') {
					return {};
				} else {
					
					// may need to look ahead - see what the next property is.
					
					// may be one of the optional arrays - or another directive.
					
					var directive = data_type_info[0];
					//console.log('directive ' + directive);
					
					if (tof(directive) == 'string') {
						
						if (directive == 'indexed_array') {
							//
							var arr_items = data_type_info[1];
							// create the empty items in sequence.
							
							// the empty items may contain some info though....
							
							//  could however have things in a collapsed empty state.
							
							// usually the items won't be empty and will have values assigned though.
							
							// may have a way of creating them, and assigning values without them ever being undefined.
							var empty = [];
							each(arr_items, function(i, v) {
								// create an empty item.
								var item_dtn = v[1];
								var item_dti = data_type_instance(item_dtn);
								
								if (is_defined(item_dti)) {
									var empty_item = item_dti.create_empty();
									empty.push(empty_item);
								} else {
									//console.log('dti not defined: item_dtn ' + item_dtn);
									
									empty.push(undefined);
									
								}
								
								
								// create a new item. no next property name specified - that is for optional arrays.
								
								
								
								
							});
							return empty;
							
							
							
							
						} else if (directive == 'n_units') {
							var default_unit = data_type_info[1];
							return [undefined, default_unit];
							
							
							
						} else if (directive == 'any') {
							return undefined;
							
						} else {
							// look at second level directives.
							

							var dir_dt_info = data_types_info[directive];
							//console.log('dir_dt_info ' + stringify(dir_dt_info));
							
							var dir2 = dir_dt_info[0];
							
							if (dir2 == 'optional_array') {
								// then check if its an item in the optional array
								
								// if it is or not determines the size of the array that gets put there - items will be undefined for the moment.
								
								var single_item_type_name = data_type_info[1];
								//console.log('single_item_type_name ' + single_item_type_name);
								
								// maybe just check to see if its one of the items in the optional array.
								
								oa_map = optional_array_pos_maps[directive];
								//console.log('optional_array_pos_maps ' + stringify(optional_array_pos_maps));
								//console.log('oa_map ' + stringify(oa_map));
								
								var idx_oa_map = oa_map[next_property_name];
								if (is_defined(idx_oa_map)) {
									// then its an item in the optional array.
									var res = x_clones(undefined, dir_dt_info[1].length);
									return res;
									
								} else {
									// it's just a single item to be made
									
									//var res = undefined;
									// undefined or an empty object?
									// or create the item as it should....?
									//  load up the single item dti.
									
									var dti_single = data_type_instance(single_item_type_name);
									var res = dti_single.create_empty();
									
									
									return res;
									
								}
								
							}
						}
						
						//console.log('next_property_name ' + stringify(next_property_name));
						
						// use directive2?
						//  what about many references in sequence? is that possible?
						
					} else {
						throw 'non-string directives not supported here yet';
					}
					
					
					throw 'Object type not handled yet';
				}
			},
			
			
			// not nested...
			'get_subproperty_reference': function(obj, subproperty_name) {
				// gets the reference obejct that is used to refer to the subproperty.
				
				var idx = this.get_subproperty_index_and_data_type_name(subproperty_name);
				
				//console.log('idx ' + stringify(idx));
				if (tof(idx) == 'array') {
					idx = idx[0];
				} else {
					
				}
				//console.log('idx ' + idx);
				
				var res = [obj, idx];
				return res;
				
			},
			
			'nested_get_property_reference': function(obj_ref, property_path, dont_create) {
				
				// When requesting properties that are automatically generated...
				//  Create them in this function?
				
				//console.log('obj_ref ' + stringify(obj_ref));
				
				var obj = obj_ref[0][obj_ref[1]];
				var tpp = tof(property_path);
				if (tpp == 'string') {
					return this.nested_get_property_reference(obj_ref, property_path.split('.'), dont_create);
				} else if (tpp == 'array') {
					
					//console.log('property_path ' + stringify(property_path));
					
					
					// hmmmm... will need to look into how this gets items from the optional array.
					var property_index = this.get_subproperty_index_and_data_type_name(property_path[0]);
					
					// getting the index of 'color'. not working right not.
					
					//console.log('property_index ' + stringify(property_index));
					
					// does the data type correspond to something that automatically generates the data?
					//  like context_id
					var item_dtn = property_index[1];
					
					// check to see if the object has a generator for that property (type).
					
					// ll_has?
					if (obj.data_generators && obj.data_generators[item_dtn]) {
						// will set its value if it does not exist.
						
						// but nor for creating the path.
						
					}
					
					//if (is_defined(obj[]))
					
					
					
					
					// [["optional_array", 4], 0]
					//  want the index of the property, and it's data type.
					//  here the index is 0, unknown data type.
					var empty;
					var opt_arr = tof(property_index[1]) == 'array' && property_index[1][0] == 'optional_array';
					
					var opt_arr_length;
					
					// maybe don't need to create empty item on all occasions.
					
					var create_empty = function() {
						if (opt_arr) {
							opt_arr_length = property_index[1][1];
							
							// create the empty items here.
							//var sidt = property_index[1][2];
							//console.log('sidt ' + sidt);
							
							//var si_dti = data_type_instance(sidt);
							//var empty_si = si_dti.create_empty();
							//  need to create the single item instances.
							
							// probably should only create it if needed.
							
							empty = x_clones(undefined, opt_arr_length);
						} else {
							if (property_index[1] == 'string') {
								empty = undefined;
							} else {
								
								// context_id...
								
								//  want to be checking for getters/setters?
								//  
								//console.log('property_index[1] ' + property_index[1]);
								var dti_sub = data_type_instance(property_index[1]);
								//console.log('dti_sub ' + dti_sub);
								
								// possible to create an empty context_id?
								
								// create an empty int (undefined).
								//  however, may work on create_empty to deal with native data types.
								
								if (is_defined(dti_sub)) {
									empty = dti_sub.create_empty();
								} else {
									empty = undefined;
								}
								
								
							}
						}
						return empty;
					}
					
					/*
					if (tof(property_index[1]) == 'array' && property_index[1][0] == 'optional_array') {
						opt_arr = true;
						
						
						// may not need to create an empty item if there is an existing array there of the right size.
						//  maybe with validation of internal objects.
						
						
						
						
					} else {
						//console.log('data_type_name ' + stringify(data_type_name));
						//console.log('property_index ' + stringify(property_index));
						
						
						//var dti_sub = data_type_instance(property_index[1]);
						//empty = dti_sub.create_empty();
					}
					*/
					
					
					//console.log('empty ' + stringify(empty));
					
					
					
					var tpi = tof(property_index);
					//if (tpi == 'number') {
						// the data type of the next property would be useful too.
						
						//var next_reference = [obj, property_index]
					//}
					
					//console.log('tpi ' + tpi);
					
					// need more optional array handling - when getting the reference for an empty optional array need to create empty objects in the places.
					
					
					if (tpi == 'array') {
						// need to look further.
						var index = property_path[0];
						// no, not the dt.
						//var data_type_name = property_path[1];
						// need to use the data type map for this.
						
						
						var res_data_type_name = data_type_info[index];
						
						
						//console.log('index ' + stringify(index));
						
						// but when dealing with the items in an optional_array, needs to return the whole bunch of items in the arr.
						
						//console.log('opt_arr ' + stringify(opt_arr));
						//console.log('obj ' + stringify(obj));
						
						if (!opt_arr) {
							var res = [obj, property_index[0], property_index[1]];
							
							
						} else {
							// for optional arrays here.
							
							//obj[index] = empty;
							
							var existing = obj_ref[0][obj_ref[1]];
							//console.log('existing.length ' + existing.length);
							//console.log('existing ' + stringify(existing));
							//console.log('');
							//console.log('!!!');
							//console.log('nested_get_property_reference data_type_info ' + stringify(data_type_info));
							//console.log('');
							
							var single_item_dtn = data_type_info[1];
							var is_single_item = data_type_instance(single_item_dtn).validate(obj);
							//console.log('is_single_item ' + is_single_item);
							
							// if it's a single item there, need to clone it, have it as all the items in the list.
							//  then replace the correct one.
							
							if (is_single_item) {
								//var empty = x_clones(existing, )
								// what's the length of all of them
								
								var dt_info_multi = data_types_info[data_type_info[0]];
								var len = dt_info_multi[1].length;
								//console.log('len ' + len);
								var empty = x_clones(existing, len);
								obj_ref[0][obj_ref[1]] = empty;
							}
							
							// want to determine the type of the existing item.
							
							// do a validation according to which type?
							//  try validation according to the single item data type
							
							/*
							if (existing.length != opt_arr_length) {
								
								// could possibly do further type checks.
								//   could check if the item there already is the single item.
								//   may not wish to replace the single item with empty as well.
								
								//console.log('obj_ref[0][obj_ref[1]] ' + stringify(obj_ref[0][obj_ref[1]]));
								
								// probably should validate the existing item as a single item.
								
								// won't necessarily create an empty item, it may be necessary to clone the existing item.
								//console.log('pre create empty');
								var empty = create_empty();
								//console.log('post create empty');
								//console.log('1) empty ' + stringify(empty));
								obj_ref[0][obj_ref[1]] = empty;
							}
							*/
							
							var res = [obj_ref[0][obj_ref[1]], property_index[0], property_index[1]];
						}
						
						if (!is_defined(obj[index])) {
							//console.log('!is_defined(obj[index])');
							
							// could have a dont_create property.
							
							// the property can't be found.
							
							if (dont_create) {
								
								if (property_path.length == 1) {
									// not creating the nested reference but creates the object if asked for the property in some cases....
									
									// maybe have another param, create_empty_lazy_property_value
									// and we need to work out if the property is a lazy property.
									
									// Work out here if it is a lazy property?
									//  we can get that from the data type.
									
									//console.log('is this lazy? data_type_name ' + data_type_name);
									//  we can check the object (control?) to see if it has a generator for context_id.
									
									// have we got access to the ctrl still? or is obj now the control's _ object?
									
									// Perhaps that is why it should be done by the control itself.
									
									//if (obj.data_generators && obj.data_generato)
									
									/*
									var dg = obj._data_generators;
									
									console.log('dg ' + dg);
									
									if (is_defined(dg)) {
										var dgi = dg[data_type_name];
										if (is_defined(dgi)) {
											// use the generator to create the object then return the reference to it.
											
											var val = dgi();
											
											obj[index] = val;
											var res = [obj, index, data_type_name];
											console.log('res ' + stringify(res));
											return res;
											
										}
									}
									*/
									
									// but return a note saying the object is not yet defined? That way the control or DataObject could create the object if it should be there.
									//  not quite yet...
									
									// object has not yet been made perhaps...
									
									return [obj, index, res_data_type_name];
									
								}
								
								// Could perhaps return null or something indicating this failure condition.
								
								return undefined;
								
								//throw 'Object path not found';
							} else {
								var empty = create_empty();
								//console.log('2) empty ' + stringify(empty));
								obj[index] = empty;
							}
							
							
						}
						
						if (opt_arr) {
							// put the existing object into the array?
							
							
							//res = [empty, property_index[0], property_index[1]];
						}
						
						//console.log('pre stringify res');
						//console.log('res ' + stringify(res));
						//console.log('post stringify res');
						
						// check if the object actually exists...
						//  if it does not exist, create it.
						//  use the data type name for that.
						
						//var dti_sub
						
						
						//console.log('place 1');
						if (property_path.length > 1) {
							
							var sub_dti = data_type_instance(res_data_type_name);
							
							//console.log('place 2');
							return sub_dti.nested_get_property_reference(res, property_path.slice(1), dont_create);
						} else {
							//console.log('place 3');
							return res;
						}
						
						
						
						// only for the last one is it the result.
						
						// will need to recurse.
						
						return res;
					}
					
					//console.log('property_index ' + stringify(property_index));
					
				}
			},
			
			// gets a reference?
			'get_subproperty_index_and_data_type_name': function(subproperty_name) {
				// needs understanding of the directive / subdirective.
				
				var tdti = tof(data_type_info);
				
				//console.log('tdti ' + tdti);
				
				//console.log('get_subproperty_index data_type_info ' + stringify(data_type_info));
				//console.log('subproperty_name ' + subproperty_name);
				
				if (tdti == 'array') {
					
					// May need to be a little clever when dealing with optional_array objects.
					
					// read the first one.
					var directive1 = data_type_info[0];
					//console.log('directive1 ' + directive1);
					
					// but directive1 could be an array of some sort, eg indexed_array.
					
					// before the first directive had been 'oltrb' and that gets referred to something else.
					
					if (directive1 == 'indexed_array') {
						
						// but need the subproperty data type.
						//  not sure we have that so easily available / cached.???
						
						// see which item in the index it is.
						var ia_map = indexed_array_pos_maps[data_type_name];
						//console.log('ia_map ' + stringify(ia_map));
						//var item = data_type_info[]
						
						var idx = ia_map[subproperty_name];
						if (is_defined(idx)) {
							var item_def = data_type_info[1][idx];
							//console.log('item_def ' + stringify(item_def));
							var item_dt = item_def[1];
							
							return [idx, item_dt];
						}
						
						
					} else {

						var dir1_dt = data_types_info[directive1];
						//console.log('dir1_dt ' + stringify(dir1_dt));
						
						// better system of recursion? get something in terms of native types? Or need some layers of logic here?
						var dir1_dir = dir1_dt[0];
						//console.log('dir1_dir ' + dir1_dir);
						
						if (dir1_dir == 'optional_array') {
							// will be doing two checks.
							//  is it in the optional array item parameters?
							//  or in the normal object item parameters?
							
							//console.log('*opt arr data_type_info ' + stringify(data_type_info));
							var single_item_type = data_type_info[1];
							//console.log('optional_array_pos_maps ' + stringify(optional_array_pos_maps));
							
							if (optional_array_pos_maps[directive1]) {
								var pos_map = optional_array_pos_maps[directive1];
								//console.log('pos_map ' + stringify(pos_map));
								
								if (is_defined(pos_map[subproperty_name])) {
									// and return an indication saying its one of the items in the optional array.
									// the length of the optional array.
									
									//console.log('dir1_dt[1] ' + stringify(dir1_dt[1]));
									
									// includes a hint saying it's in the optional array.
									
									// and the data types?
									
									// but what about the single item data type?
									
									// need to change this.
									var idx = pos_map[subproperty_name];
									var dt_extra = ['optional_array', dir1_dt[1].length, single_item_type];
									
									// but will need to check for optional array at other points when using the results.
									//  as an item in an optional array.
									return [idx, dt_extra];
									
									
								} else {
									//console.log('single item?');
									
									// check for the normal items.
									var normal_item_tn = data_type_info[1];
									//console.log('normal_item_tn ' + normal_item_tn);
									
									var dt_item_normal_item = data_types_info[normal_item_tn];
									//console.log('dt_item_normal_item ' + stringify(dt_item_normal_item));
									
									var normal_item_directive = dt_item_normal_item[0];
									//console.log('normal_item_directive ' + stringify(normal_item_directive));
									
									if (normal_item_directive == 'indexed_array') {
										// get the map
										//console.log('indexed_array_pos_maps ' + stringify(indexed_array_pos_maps));
										
										//console.log('subproperty_name ' + subproperty_name);
										
										//var dt_info_sub = data_type_info[subproperty_name];
										//console.log('dt_info_sub ' + stringify(dt_info_sub));
										
										// no, the pos-map for the subproperty.
										
										var ia_map = indexed_array_pos_maps[normal_item_tn];
										//console.log('ia_map ' + stringify(ia_map));
										
										//var idx = ia_map[subproperty_name];
										// and the data type
										
										var item_tn = data_type_info[subproperty_name];
										//console.log('item_tn ' + item_tn);
										
										//console.log('normal_item_tn ' + stringify(normal_item_tn));
										var dti_normal_item = data_type_instance(normal_item_tn);
										
										return dti_normal_item.get_subproperty_index_and_data_type_name(subproperty_name);
										
										//if (is_defined(idx)) {
										//	return ia_map[subproperty_name, item_tn];
										//}
									}
								}
							}
							/*else {
								// look within the single item.
								// look in the single item pos map.
								// could possibly load the single item dti. may be better code structure to do that.
								
								
							}*/
							
							//var opt_arr_item_map = 
							
							
						}
					}
					// get the array index map (from a data type info)
					
					// could maybe get the index map from the data type instance (for border for example).
					//  would it return something a bit complex 
					
					//if ()
					
				} else if (tdti == 'object') {
					//console.log('data_type_info ' + stringify(data_type_info));
					//console.log('subproperty_name ' + stringify(subproperty_name));
					
					var sp_dtn = data_type_info[subproperty_name];
					//console.log('sp_dtn ' + stringify(sp_dtn));
					
					
					//console.log('t')
					
					return [subproperty_name, sp_dtn];
				}
				
				// likely to need to look up both oltrb and single_border.
				
				
				// This could return something that shows which subproperties if there is more than one.
				
				//var spdt_info = data_types_info[];
				
			},
				
				
			// output being another characteristic.
			//  some types (eg color) will have their own output procedure.
				
			// May want to give other output options.
			//  For the moment have one output platform in mind - CSS3 supported browsers.
			//  In other situations it may output the css? but mainly tell the ctrl that it will need to take special measures to render something.
				
			'output': function(value) {
				// formats the value for output properly.
				var res;
				
				
				
				//console.log('output value: ' + stringify(value));
				//console.log('output value.length: ' + stringify(value.length));
				//console.log('data_type_name ' + data_type_name);
				// but probably really want the property name
				//  or property root name / prefix.
				//   use this for multi items of the property.
				
				
				
				//console.log('data_type_name ' + data_type_name);
				
				// may be able to get a data item from the data type name.
				
				// should check data_type_name against specific output filters.
				
				
				
				
				var dti_data_type = data_type_instance(data_type_name);
				//console.log('** dti_data_type ' + dti_data_type);
				
				
				
				info_dt = data_types_info[directive];
				//console.log('directive ' + directive);
				//console.log('info_dt ' + stringify(info_dt));
				//console.log('**** output_processors ' + stringify(output_processors));
				
				if (output_processors[data_type_name]) {
					res = output_processors[data_type_name](value);
				} else if (info_dt) {
					var directive2 = info_dt[0];
					//console.log('directive2 ' + directive2);
					
					if (directive2 == 'optional_array') {
						var single_item_dtn = data_type_info[1];
						//console.log('single_item_dtn ' + single_item_dtn);
						
						var arr_oa_item_names = info_dt[1];
						//console.log('arr_oa_item_names ' + stringify(arr_oa_item_names));
						
						var dti_single_item = data_type_instance(single_item_dtn);
						
						
						var is_single_item = dti_single_item.validate(value);
						// why is the distance not validating?
						//console.log('is_single_item ' + is_single_item);
						
						if (is_single_item) {
							// output it in that format.
							// use an object for that and output it with the output function.
							//  This is how it's recursive now.
							
							var out2 = dti_single_item.output(value);
							//console.log('out2 ' + out2);
							res = out2;
							
							
						} else {
							// we are dealing with the array of items.
							//if ()
							//console.log('not single item, value ' + stringify(value));
							//console.log('value.length ' + value.length);
							
							if (value.length == info_dt[1].length) {
								// no, should be doing actual validation of types to prevent mistakes.
								
								
								
								
								// output each of the values...
								res = {};
								
								
								
								each(info_dt[1], function(i, v) {
									// use the dti_single item for outputting each item.
									
									var single_item_output = dti_single_item.output(value[i]);
									//console.log('single_item_output ' + stringify(single_item_output));
									
									// eg border-v
									
									
									
									// need to build the rule_name.
									
									if (is_defined(single_item_output)) {
										
										// needs to be the propery name - the first bit of the property name.
										
										// TODO: Change this - chould have another param for the property root name which gets used here if needed.
										var rule_name = data_type_name + '-' + v;
										
										
										res[rule_name] = single_item_output;
									}
									
									
									
								});
								//console.log('*** res ' + stringify(res));
							}
							
						}
						
					}
					
					
				} else {
					
					if (directive == 'n_units') {
						// need to know the unit type...
						
						// but look at the value.
						
						//console.log('output n_units value ' + value);
						
						// value could be undefined though....
						
						if (is_defined(value)) {
							res = value.join('');
						} else {
							res = undefined;
						}
						
						
					}
					if (directive == 'any') {
						res = value;
					}
					
					
					if (directive == 'indexed_array') {
						// get each of them and join them together in a string.
						
						//console.log('value ' + stringify(value));
						
						// and also the array...
						var single_item_dtn = data_type_info[1];
						
						// it may not be the data_type_name...
						// data_type_items?
						//console.log('single_item_dtn ' + stringify(single_item_dtn));
						// array of what?
						
						res = [];
						
						// all the items there may be undefined.
						
						
						
						each(single_item_dtn, function(i, v) {
							var item_dtn = v[1];
							//console.log('item_dtn ' + item_dtn);
							var dti_item = data_type_instance(item_dtn);
							
							if (dti_item) {
								
								//console.log('value ' + stringify(value));
								
								if (is_defined(value)) {
									//console.log('value[i] ' + value[i]);
									
									var out_value = dti_item.output(value[i]);
									//console.log('out_value ' + stringify(out_value));
									
									res.push(out_value);
								}
								
								
							}
							
						});
						if (res.length > 0) {
							res = res.join(' ');
						} else {
							res = undefined;
						}
						
						
					}
				}
				
				// we need to see if the item is a single value.
				
				return res;
				
			},
				
			// create empty object
			
			
			
			
			// navigate through different subproperties?
			
			// can we have a dti for control?
			//  let's make one
			
			
				
			// perhaps a function to read the form of a property
			//  like using_single_item or using_optional_array
			//  the single items may be held as arrays though (eg color)
				
			// perhaps validate to see if its a single item or not, could use that data type.
			//  that seems like a decent check to do, process of elimination.
			// don't want to validate every item in an array.
				
				
				
			// setting sub-properties.
			//  will again look at the directive and handle different native types specifically, eg optional_array.
			
			// can this be done when the value is undefined?
			//  get new subproperty reference may be 
			
			
			// creates a replacement of an object, having set the subproperty.
			//  could we do this while getting a default value?
			
			// create_empty - create the empty object.
			//  may need to know the next property / the form of the new object.
			
			// but creating a property may mean replacing its parent in some cases.
			
			// creates a replacement from the original
			//  to actually do a replacement - may be best to use a reference. (full reference)?
			
			// a version of this using references?
			//  where given a reference representing an object, and told to change a subproperty on that?
			
			
			'replacement_set_sub_property': function(original, sub_property_name, value) {
				console.log('replacement_set_sub_property directive ' + directive);
				
				// can we process it directly?
				
				var res;
				// look at subdirective.
				
				info_dt = data_types_info[directive];
				console.log('info_dt ' + stringify(info_dt));
				
				var directive2 = info_dt[0];
				console.log('directive2 ' + directive2);
				
				if (directive2 == 'optional_array') {
					
					// we need the positions of the items in the optional array for fast indexing.
					//  this will have been pre-prepared in a tree.
					
					// use optional_array_pos_maps
					
					var single_item_dtn = data_type_info[1];
					console.log('single_item_dtn ' + single_item_dtn);
					
					
					
					if (optional_array_pos_maps[directive]) {
					//	if (optional_array_pos_maps[directive][])
						console.log('optional_array_pos_maps[directive] ' + stringify(optional_array_pos_maps[directive]));
						
						var index = optional_array_pos_maps[directive][sub_property_name];
						
						//console.log('index ' + index);
						
						if (is_defined(index)) {
							console.log('index ' + index);
							
							// need to find out if the original property is in the ltrb format.
							
							var dti_single_item = data_type_instance(single_item_dtn);
							var orig_is_single_item = dti_single_item.validate(original);
							
							console.log('orig_is_single_item ' + orig_is_single_item);
							var arr_item_name_list = info_dt[1];
							if (orig_is_single_item) {
								
								// will likely need to replace the original object.
								
								// make clones of the original
								
								var new_obj = x_clones(original, arr_item_name_list.length);
								
								var i_val = dti_single_item.input(value);
								new_obj[index] = i_val; // does the replacement in the original object because it can in this case.
								res = new_obj;
								
								
								//throw 'case not handled yet';
							} else {
								// check it's an array of the right length.
								
								// the list of values for the array...
								
								//if (original.length == )
								console.log('arr_item_name_list ' + stringify(arr_item_name_list));
								
								if (arr_item_name_list.length == original.length) {
									
									// in this case could change the original item.
									//original[index] = value;
									
									// but need to parse / input the value successfully.
									
									var i_val = dti_single_item.input(value);
									original[index] = i_val; // does the replacement in the original object because it can in this case.
									res = original;
									
								}
							}
							
							
							
							
						} else {
							// if the index is not defined, the sub-property may not refer to an optional_array item of the data_type,
							//  but an index within the item, like 'width' for border, rather than 'left'.
							
							var dt_info_single_item = data_types_info[single_item_dtn];
							if (dt_info_single_item) {
								console.log('dt_info_single_item ' + stringify(dt_info_single_item));
								
								var directive_single_item = dt_info_single_item[0];
								console.log('directive_single_item ' + directive_single_item);
								
								//var dti_single_item = data_type_instance(single_item_dtn);
								//var 
								// so can the value be parsed within that?
								
								// and the pos map for the single item directive
								
								var pm = indexed_array_pos_maps[single_item_dtn];
								if (pm) {
									console.log('pm ' + stringify(pm));
									
									var index = pm[sub_property_name];
									if (is_defined(index)) {
										//console.log('index ' + index);
										
										// need to validate / input the value.
										
										data_info = dt_info_single_item[1][index][1];
										//console.log('data_info ' + data_info);
										
										var item_dti = data_type_instance(data_info);
										//console.log('item_dti ' + item_dti);
										value = item_dti.input(value);
										
										original[index] = value;
										res = original;
									}
								}
							}
						}
					}
					
				}
				return res;
				
			},
				
			
				
			// input, output, verify / validate
			//  could have verbose option that shows where failures occurr.
			'validate': function(value) {
				// checking that the value conforms to the internal representation
				//  not to see if the value can be parsed.
				var res = false;
				//console.log('validate data_type_info ' + stringify(data_type_info));
				
				//console.log('directive ' + stringify(directive));
				//console.log('value ' + stringify(value));
				//console.log('value ' + stringify(value.length));
				
				// again, use the directive to see how to proceed.
				
				// different validation code for n_units
				//  could that be found from the data types? Not now, n_units is a primitive / native type for the library.
				
				if (directive == 'n_units') {
					//if ()
					//var unit = data_type_info[1];
					if (tof(value) == 'array') {
						console.log('value.length ' + value.length);
						
						if (value.length == 2 && tof(value[0]) == 'number' && tof(value[1]) == 'string') {
							res = true;
						} 
					}
				}
				
				if (directive == 'any') {
					// value must be within the 'any' map.
					
					var am_name = any_maps[data_type_name];
					//console.log('am_name ' + stringify(am_name));
					
					if (am_name[value]) res = true;
				}
				
				
				if (directive == 'indexed_array') {
					// validate each of the data types.
					
					// may use static 'validate' function.
					var arr_items = data_type_info[1];
					// the value must be an array.
					
					
					var t_val = tof(value);
					if (t_val == 'array') {
						
						// test array lengths
						
						if (value.length == arr_items.length) {
							// check the individual items for type
							
							var valid_so_far = true, l = arr_items.length, c = 0;
							while(valid_so_far && c < l) {
								var value_item = value[c];
								var dt_name = arr_items[c][1];
								//console.log('dt_name ' + dt_name);
								
								var dti = data_type_instance(dt_name);
								if (dti) {
									var r2 = dti.validate(value_item);
									//console.log('r2 ' + r2);
									if (r2 !== true) {
										valid_so_far = false;
									}
									
								} else {
									
									
									if (validators[dt_name]) {
										var valid = validators[dt_name](value_item);
										if (valid !== true) {
											valid_so_far = false;
										}
									} else {
										throw 'No data type or validator found for ' + dt_name;
									}
									
									// number - need either a data type for 'number' or will use a specifically made data type (instance)
									
									
								}
								
								c++;
							}
							if (valid_so_far === true) res = true;
							
							
						}
						
					}
					
					
				}
				return res;
				
				
			},
				
				
			// may have 'input_to' function.
				
			'input': function(value) {
				var t_val = tof(value);
				//console.log('');
				//console.log('t_val ' + t_val);
				//console.log('value ' + stringify(value));
				//console.log('data_type_info ' + stringify(data_type_info));
				//console.log('directive ' + directive);
				
				
				if (td == 'array') {
					
					
					
					// but could the directive be an array?
					//  directive and parameters for the directive.
					
					//console.log('directive ' + directive);
					
					// may be a native directive? interpreted here.
					//  the directive may be an array.
					/*
					if (directive == 'indexed_array') {
						// number of values, and get the items for each value.
						// however, with color, want to be able to parse the hex.
						
						// perhaps this could be done with a color native type.
						//  the color native type could have its own input function?
						//  could have input processors - where it changes the input for a data type if necessary.
						
						if (input_processors[data_type_name]) {
							value = input_processors[data_type_name](value);
						}
						
					}
					*/
					
					
					if (directive == 'n_units') {
						var s_unit = data_type_info[1];
						//console.log('s_unit ' + s_unit);
						
						if (t_val == 'number') {
							value = [value, s_unit];
						}
						if (t_val == 'string') {
							
							// what about just a number as a string?
							
							
							// may have numeric component and text component - the unit.
							// need to split these.
							
							//  number:
							// ^[-]?\d+(\.\d+)?$
							
							// need to change the number part of this.
							//var rx_int_word = /^(\d+)([a-zA-Z]+)$/;
							
							var rx_num_word = /^([-]?\d+(\.\d+)?)([a-zA-Z]+)$/;
							
							// could also check for allowed measurements in the regex?
							//  though may define 'distance' more.
							
							//var match = rx_int_word.match(value);
							//console.log('');
							//console.log('matching regex with value ' + value);
							var match = value.match(rx_num_word);
							//console.log('match ' + match);
							
							if (match) {
								//console.log('');
								//console.log('value ' + stringify(value));
								//console.log('*** match.length ' + match.length);
								//console.log('match ' + stringify(match));
								
								
								
								var number_left = match[1];
								var number_right = match[2];
								var unit = match[3];
								
								// and if there are no units....
								
								if (match.length == 4) {
									
									// should not have to be an int numeral.
									//var numeral = parseInt(match[1]);
									
									if (is_defined(number_right)) {
										//value = [parseFloat(), unit];
										value = [parseFloat(number_left + '.' + number_right), unit];
									} else {
										value = [parseInt(number_left), unit];
										
									}
									console.log('value ' + stringify(value));
									//var unit = match[2];
									
									// the numeral must be parsed as a number.
									
									
								}
							} else {
								// check for just the numeric value, as a string.
								
								var rx_num = /^(([-]?\d+)(\.(\d+))?)|([-]?(\.(\d+)))$/;
								//  more complex now - more output positions.
								// match [".44", undefined, undefined, undefined, undefined, ".44", ".44", "44"]
								// match ["1.44", "1.44", "1", ".44", "44", undefined, undefined, undefined]
								
								
								// could do two regex tests sequentially - simpler code. But not as nice use of regexes.
								
								// 14.4 -> match ["14.4", "14", ".4", "4"]
								// 14 -> match ["14", "14", undefined, undefined]
								
								
								
								var match = value.match(rx_num);
								//console.log('match ' + stringify(match));
								if (match) {
									// is it an integer or a float?
									//console.log('s_unit ' + s_unit);
									//var s_num = match[1];
									if (is_defined(match[3]) || is_defined(match[6])) {
										// need to use the default unit.
										
										var value = [parseFloat(value), s_unit];
									} else {
										var value = [parseInt(value), s_unit];
									}
									
								}
								
								
								
								
							}
							
							
							//console.log('match ' + stringify(match));
						}
						// use the system to load numbers?
					} else if (directive == 'any') {
						// must be any of data_type_info[1]. otherwise it fails
						// use the get procedure
						
						//console.log('any map name ' + data_type_name);
						var am_item = ll_get(any_maps, data_type_name);
						//console.log('am_item ' + stringify(am_item));
						
						if (am_item[value]) {
							
						} else {
							throw 'data_type_name does not support value: ' + value;
						}
						
						
					} else if (directive == 'indexed_array') {
						// if the value is a string, split it with ' '.
						
						//console.log('input_processors ' + stringify(input_processors));
						
						if (input_processors[data_type_name]) {
							value = input_processors[data_type_name](value);
						} else {
							t_val = tof(value);
							
							var arr_items = data_type_info[1];
							
							// an input for color... input_processors
							
							if (t_val == 'string') {
								//console.log('value ' + stringify(value));
								
								var vals = value.split(' ');
								if (arr_items.length == vals.length) {
									// use the correct input for each of the items in the array.
									
									// need each item data type...
									//console.log('arr_items ' + stringify(arr_items));
									value = [];
									each(arr_items, function(i, v) {
										
										var item_type = v[1];
										//console.log('item_type ' + item_type);
										
										var dt_item = data_type_instance(item_type);
										var item_value = dt_item.input(vals[i]);
										
										value.push(item_value);
										
									});
									
								}
							}
						}
					} else {
						// for non-native directives, such as oltrb - they will have a directive inside.
						
						// optional arrays will need some native processing.
						//  need to get a data type instance from a directive?
						
						//console.log('non-native directive ' + directive);
						
						var dt_nn = data_types_info[directive];
						//console.log('** dt_nn ' + stringify(dt_nn));
						
						// and this data type info should have another directive inside.
						var directive2 = dt_nn[0];
						//console.log('directive2 ' + directive2);
						// inputting items to an optional array - programming logic here?
						if (directive2 == 'optional_array') {
							var opt_arr_items = dt_nn[1];
							
							var item_data_type = data_type_info[1];
							//console.log('item_data_type ' + stringify(item_data_type));
							
							// then see if the single border validates as that type.
							var dti_item_data = data_type_instance(item_data_type);
							//console.log('value ' + stringify(value));
							
							// attempt to parse the value.
							var val = dti_item_data.validate(value);
							//console.log('val ' + val);
							
							if (val) {
								
							} else {
								var pval = dti_item_data.input(value);
								val = dti_item_data.validate(pval);
								//console.log('* val ' + val);
								if (val === true) {
									value = pval;
								} else {
									// it may fit into the optional array.
									//console.log('opt_arr_items ' + stringify(opt_arr_items));
									if (value.length == opt_arr_items.length) {
										// seems OK so far... but I think we check that each item is the required type for each position in the array
										//  and run the input function.
										
										// maybe there should be an input_validate function.
										//  attempts validation, then if not valid uses input / normalization and attempts validation again.
										
										var ctu = true, l = value.length, c = 0;
										while (ctu && c < l) {
											//var c_val = value[c]
											
											var val = dti_item_data.validate(value[c]);
											//console.log('** val ' + val);
											
											if (!val) {
												var value2 = dti_item_data.input(value[c]);
												//console.log('value2 ' + stringify(value2));
												
												var val2 = dti_item_data.validate(value2);
												if (val2 !== true) {
													ctu = false;
												} else {
													value[c] = value2;
												}
											}
											c++;
										}
										
										if (ctu) {
											// seems all were valid.
											
										}
									}
									
								}
							}
						}
						//var dti_
					}
				}
				//console.log('dti input return value ' + stringify(value));
				return value;
				
			}
				
		}
		
		//console.log('dti input res ' + stringify(res));
		
		return res;
	}
	
	var data_type_instance = function(data_type_name) {
		
		// what about the 'int' data type?
		// other native data types?
		
		var res = i_data_types[data_type_name];
		//console.log('data_type_instance data_type_name ' + data_type_name);
		if (!res) {
			if (data_types_info[data_type_name]) {
				res = i_data_types[data_type_name] = data_type_instance_from_info(data_type_name);
			}
		}
		return res;
	}
	
	// a function to add / merge data types...?
	

	var DataObject = Class.extend({
		'init': function(spec) {
			//ensure(this, '_');
			this._ = this._ || {};
			var that = this;
			
			// but the collection could be made in the prototype I think???
			
			//console.log('that._collection_names ' + that._collection_names);
			
			// The collection names... could be dealt with using the data_type_instance methods.
			
			each(that._collection_names, function(i, v){
				//console.log('collection name i ' + i);
				
				that._[i] = new DataCollection();
				
				
				// connect up the functions... apply for the instance.
				
				// but the data object will have a function for the data collection in the prototype.
				
				// hmmm... still on the prototype function
				//  don't want to add items to that, whatever it is.
				//  better to do this in the prototype.
				/*
				
				
				
				that[i].action = function(action_name, value) {
					return that._[i].action(action_name, value);
				};
				*/
				
				// does not copy functions - still the same function in the prototype.
				//  could we make it a new function in the data collection?
				// I think we could have flexible syntax - that's one of the main objectives here.
				//  Want different ways to access things, and withou needing lots of code in place to do it.
				//  Will encapsulate functionality, and make the Core easier to understand.
				
				
				// but can we access this from the dataCollection's subproperty?
				//console.log('that[i].parent ' + that[i].parent);
				var oti = that[i];
				// a function from the prototype
				
				that[i] = fp(function(a, sig) {
					//console.log('thati sig ' + sig);
					return oti.apply(that[i], a);
				}); // so it's not the function from the prototype any longer... it's kind of a clone of the original function.
				
				
				that[i].add = function(value) {
					// no, it's a single function that gets copied about the place,
					//  how do we copy a function?
					return that._[i].add.call(that._[i], value);
				};
				that[i].action = function(action_name, value) {
					return that._[i].action(action_name, value);
				};
				//that[i]
				
				that[i]._parent = that;
				
				
				
				
			});
			
			
			
			// ok, so it works so far.
			
			
			
			// but with the collection properties - can these be initialized here?
			//  maybe do that within the collection property....
			//  but may need to check too much.
			
			// have something in the prototype that says the collection names?
			
			
			each(spec, function(i, v) {
				//var my_i = that[i];
				// will save a bit in the Core rewrite. Will eventually put these techniques in the main lib.
				if (tof(that[i]) == 'function') {
					that[i](v);
				};
			});
			
		},
		
		// will be able to use the DataObject's class_name for get and set.
		//  maybe just type_name?
		// Could have a type name heirachy. So that if it does not find get/set methods for div, it uses the ones for control.
		
		
		
		/*
		'get': str_arr_mapify(function(property_name) {
			//each(this, function(i, v) {
			//	console.log('i ' + i);
			//});
			
			var al = this._alias[property_name];
			//console.log('al ' + al);
			if (al) {
				property_name = al;
			}
			
			
			var pos1 = property_name.indexOf('.');
			// or call set
			
			if (pos1 == -1) {
				return this._[property_name];
			} else {
				// it separates them into sub-properties.
				//  should use the set procedure for the subproperties.
				
				// and the event will say which subproperty has changed.
				//set(this, '_.' + property_name, value);
				return get(this, property_name);
				
			}
			
		}),
		*/
		// no, get may take an array, and return a map.
		// could be re-done so that it's like an arrayify for strings, but puts the results in a map, and will split up a string with spaces in it.
		/*
		'get': (function(property_name) {
			var that = this;
			if (tof(property_name) == 'array') {
				var res = {};
				
				each(property_name, function(i, v) {
					res[v] = that.get(v);
				});
				return res;
			} else {
				// but if there are spaces in a string make it into an array.
				var s_pn = property_name.split(' ');
				//console.log('s_pn ' + s_pn.length);
				
				if (s_pn.length > 1) {
					return that.get(s_pn);
				} else {
					return this._[property_name];
				}
				
				
			}
			
			
		}),*/
		// will also call an event when the property has changed.
		
		// Set should deal with properties
		/*
		'set': mapify(function(property_name, value) {
			// but the value may have '.'.
			
			// is the name an alias?
			
			var al = this._alias[property_name];
			//console.log('al ' + al);
			if (al) {
				property_name = al;
			}
			
			//var s3_name = property_name.split('.');
			var pos1 = property_name.indexOf('.');
			// or call set
			
			if (pos1 == -1) {
				this._[property_name] = value;
			} else {
				// it separates them into sub-properties.
				//  should use the set procedure for the subproperties.
				
				// and the event will say which subproperty has changed.
				set(this, property_name, value);
				
				
			}
			
			// will raise the event too... similar formate to backbone.js
			//return value;
		}),
		*/
		/*
		'property_ensure': function(property_name, value) {
			// like set, but does not overwrite it.
			

			var al = this._alias[property_name];
			//console.log('al ' + al);
			if (al) {
				property_name = al;
			}
			
			//var s3_name = property_name.split('.');
			var pos1 = property_name.indexOf('.');
			// or call set
			
			if (pos1 == -1) {
				//
				if (tof(this._[property_name]) == 'undefined') {
					this._[property_name] = value;
				}
				
			} else {
				// it separates them into sub-properties.
				//  should use the set procedure for the subproperties.
				
				// and the event will say which subproperty has changed.
				set(this, property_name, value);
				
				
			}
			
		}
		*/
		

		'get': function(property_name) {
			// needs access to the property
			
			// Going through the previous properties.
			//  May need to access them by name.
			//  May use a get_property_reference function
			
			// And will use output processing too.
			//  May have option to determine the output formatting
			// Internal representation, Default output (HTML)/minor adaptations for devices, Other output procedure (eg major adaptation for IE6 using shims)
			
			
			// Maybe out will use output processing?
			//  Get will just get the value.
			
			// The get procedure may get properties such as id which are created on demand.
			//  Want id to work through the data type system.
			//  But not sure about that because it relies on page context, or a context.
			//  May rely on the html section.
			
			
			
			//console.log('this._.type_name ' + this._.type_name);
			
			var dti_control = data_type_instance(this._.type_name);
			
			//var prop_ref = get_property_reference(this, property_name, false);
			// getting a reference to it may be saying that the property should be created if its an automatic creation property.
			
			// Lang will handle this.
			
			
			
			
			var prop_ref = dti_control.nested_get_property_reference([this, '_'], property_name, true);
			
			// a problem with the reference?
			//  giving results from an earlier control?
			//console.log('property_name ' + stringify(property_name));
			//console.log('!! prop_ref ' + stringify(prop_ref));
			
			// but with some lazy properties, may need to create them???
			
			// check if the referred to object is defined.
			// and if it is not, see if there is a generator for the data type.
			//console.log('prop_ref[0][prop_ref[1]] ' + prop_ref[0][prop_ref[1]]);
			if (!is_defined(prop_ref[0][prop_ref[1]])) {
				
				var dtn = prop_ref[2];
				
				// check jsgui itself for the data generator first.
				//  generator outside of the ctrl, this is the case with Ordered_String_List.
				var jg_gen = jsgui._data_generators[dtn];
				if (is_defined(jg_gen)) {
					
					//console.log('has jsgui generator');
					
					var val = jg_gen.call(this);
					//console.log('gen val ' + stringify(val));
					prop_ref[0][prop_ref[1]] = val;
				} else {
					var gen = this._data_generators[dtn];
					
					// have a generator for Ordered_String_List!!
					// there could be a default generator set, as well as on the control.
					
					
					
					
					if (is_defined(gen)) {
						var val = gen.call(this);
						
						//console.log('gen val ' + val);
						
						prop_ref[0][prop_ref[1]] = val;
					}
				}
				
				
				
				
				// the generator may be in the ctrl. this is the case with id.
				
				
				//console.log('gen ' + gen);
				
			}
			
			
			
			
			//console.log('prop_ref ' + stringify(prop_ref));
			
			if (is_defined(prop_ref)) {
				return prop_ref[0][prop_ref[1]];
			};
			
			
			
		},
		'set': function(property_name, value) {
			
			//  property reference only works for a single level???
			//   should be multilevel.
			
			// this will be done through the control data type.
			
			
			// Maybe this will be in the data_type_object
			
			
			var dti_control = data_type_instance(this._.type_name);
			var prop_ref = dti_control.nested_get_property_reference([this, '_'], property_name, false);
			//console.log('prop_ref ' + stringify(prop_ref));
			
			// also want the data type name from the property referecne
			
			var data_type_name = prop_ref[2], dti
			if (tof(data_type_name) == 'array' && data_type_name[0] == 'optional_array') {
				dti = data_type_instance(data_type_name[2]);
			} else {
				dti = data_type_instance(data_type_name);
			}
			
			var val2;
			if (is_defined(dti)) {
				val2 = dti.input(value);
			} else {
				val2 = value;
			}
			
			//var 
			
			//console.log('val2 ' + stringify(val2));
			
			prop_ref[0][prop_ref[1]] = val2;
			// and raise appropriate event / callback(s).
		},
	});
	
	
	// its functions may get proxied.
	
	// OK, so looks like it's working so far.
	
	// indexed collection. keeps track of the index of each item in it.
	
	// Will use this within the typed data I think.
	
	// every item needs an id, need an index too.
	
	// Need to be able to access controls in a collection using a nice interface at different levels.
	
	// items in the collection have got index() and id() functions for access to the variables.
	//  index is the position in the collection.
	
	var DataCollection = Class.extend({
		'init': function(spec) {
			this._id_map = {};
			this._arr = [];
			this.length = 0;
		},
		
		// function reference - add functions to that?
		
		// much like fn_call. Perhaps DataObject could have fn_call - the same as this. But this one deals with an empty sig, maybe that's the
		//  default function which can be assigned.
		'action': fp(function(a, sig) {
			// what about calling this with more parameters?
			
			//console.log('action sig ' + sig);
			
			
			
			if (sig == '[]') {
				//console.log('1) this._arr ' + tof(this._arr));
				//console.log(this._arr.length);
				return this._arr;
			} else {
				var action_name = a[0];
				
				//console.log('action_name ' + action_name);
				
				// then call the relevant function... eg add(a[1])
				
				// and then make it so that more parameters can be given.
				
				var params = a.slice(1);
				
				//return this[action_name](a[1]);
				
				return this[action_name].apply(this, params);
				
			}
			
			
		}),
		
		'add': fp(function(a, sig) {
			// item
			console.log('add sig ' + sig);
			
			if (sig == '[o]' || sig == '[c]') {
				//if ()
				var i = this._arr.length;
				this._arr.push(a[0]);
				this.length++;
				//console.log('2) this._arr ' + (this._arr));
				//console.log('2) this._arr ' + stringify(this._arr));
				
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
		'get': fp(function(a, sig) {
			// string, it's an id
			if (sig == '[s]') {
				return this._id_map[a[0]];
			} else if (sig == '[n]') {
				return this._arr[a[0]];
			}
			
			// number it's an index
			
		}),
		'insert': fp(function(a, sig) {
			// can be given one object to insert, can be given an array of items to insert?
			//  not for actually inserting an array though. For use with controls really, could be used with other objects.
			//  Could maybe turn this off as an object in the construction.
			// maybe told to insert(control, position)
			
			console.log('insert sig ' + sig);
			//if (sig == '[')
			// checking for an array in the sig is tricky.
			
			if (sig == '[o,n]') {
				// will need to move the index of items above forward.
				
				this._arr.splice(a[1], 0, a[0]);
				for (var c = a[1], l = this._arr.length; c < l; c++) {
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
	
	

	var any_maps = {
		
	}
	
	// populate the any maps.
	
	var populate_any_maps = function(dtsi, item_name) {
		
		if (tof(item_name) == 'undefined') item_name = '';
		//console.log('populate_any_maps item_name ' + item_name);
		var t = tof(dtsi);
		if (t == 'object') {
			
			
			each(dtsi, function(i, v) {
				
				var in2 = item_name;
				
				var tv = tof(v);
				
				
				//if (tv == 'array') {
				//	
				//}
				
				//console.log('tv ' + tv);
				//console.log('v ' + stringify(v));
				
				
				if (tv == 'object') {
					if (item_name.length > 0) item_name = item_name + '.';
					item_name = item_name + i;
					
					populate_any_maps(v, item_name);
				} else {
					var directive = v[0];
					
					if (directive == 'any') {
						//
						//console.log('i ' + i);
						// go through each of them
						// reference to the any_maps parent item...?
						if (in2.length > 0) in2 = in2 + '.';
						in2 = in2 + i;
						
						// make truth map
						
						
						
						//each(v[1], function(i2, v2) {
						//	console.log('v2 ' + v2);
							
						//})
						
						var tm = get_truth_map_from_arr(v[1]);
						ll_set(any_maps, in2, tm);
						
						//console.log('* in2 ' + in2);
						
					}
				}
			});
		}
	};
	//populate_any_maps(data_types_info);
	//console.log('any_maps ' + stringify(any_maps));
	
	var optional_array_pos_maps = {};
	var populate_optional_array_pos_maps = function(dtsi, item_name) {
		
		// again, need to go through the tree.
		
		if (tof(item_name) == 'undefined') item_name = '';
		//console.log('populate_optional_array_pos_maps item_name ' + item_name);
		var t = tof(dtsi);
		if (t == 'object') {
			
			each(dtsi, function(i, v) {
				
				var in2 = item_name;
				
				var tv = tof(v);
				
				
				//if (tv == 'array') {
				//	
				//}
				
				//console.log('tv ' + tv);
				//console.log('v ' + stringify(v));
				
				
				if (tv == 'object') {
					if (item_name.length > 0) item_name = item_name + '.';
					item_name = item_name + i;
					
					populate_optional_array_pos_maps(v, item_name);
				} else {
					var directive = v[0];
					
					if (directive == 'optional_array') {
						//
						//console.log('i ' + i);
						// go through each of them
						// reference to the any_maps parent item...?
						if (in2.length > 0) in2 = in2 + '.';
						in2 = in2 + i;
						
						// make truth map
						
						
						
						//each(v[1], function(i2, v2) {
						//	console.log('v2 ' + v2);
							
						//})
						
						var tm = get_map_from_arr(v[1]);
						ll_set(optional_array_pos_maps, in2, tm);
						
						//console.log('optional_array in2 ' + in2);
						
						//var single_item_type = v[1];
						
						
					}
				}
			});
		}
	}
	
	
	//populate_optional_array_pos_maps(data_types_info);
	//console.log('optional_array_pos_maps ' + stringify(optional_array_pos_maps));
	
	// also need to hold the indexed array location maps.
	
	var indexed_array_pos_maps = {};
	
	// could combine the populate functions.
	var populate_indexed_array_pos_maps = function(dtsi, item_name) {
		if (tof(item_name) == 'undefined') item_name = '';
		var t = tof(dtsi);
		if (t == 'object') {
			each(dtsi, function(i, v) {
				var in2 = item_name;
				var tv = tof(v);
				if (tv == 'object') {
					if (item_name.length > 0) item_name = item_name + '.';
					item_name = item_name + i;
					
					populate_indexed_array_pos_maps(v, item_name);
				} else {
					var directive = v[0];
					
					if (directive == 'indexed_array') {
						if (in2.length > 0) in2 = in2 + '.';
						in2 = in2 + i;
						
						//var tm = get_map_from_arr(v[1]);
						var pos_map = {};
						each(v[1], function(i2, v2) {
							pos_map[v2[0]] = i2;
						});
						
						
						ll_set(indexed_array_pos_maps, in2, pos_map);
					}
				}
			});
		}
	}
	//populate_indexed_array_pos_maps(data_types_info);
	
	
	var populate_all_dt_maps = function() {
		populate_any_maps(data_types_info);
		populate_optional_array_pos_maps(data_types_info);
		populate_indexed_array_pos_maps(data_types_info);
	}
	
	// Functionality for the control's IDs - that seems like its page_context, which could be part of html.
	
	var _data_generators = {
		'Ordered_String_List': function() {
			//console.log('dg Ordered_String_List');
			return new Ordered_String_List();
		}
	}
	
	var Ordered_String_List = Class.extend({
		'init': function() {
			//console.log('init osl sig ' + sig);
			
			var arr = [];
			var dict_indexes = {};
			
			var reindex_dict_indexes = function() {
				dict_indexes = {};
				for (var c = 0, l = arr.length; c < l; c++) {
					dict_indexes[arr[c]] = c;
				}
			}
			
			// (add), remove, get, get_all, has, put, move, splice
			this.has = function(value) {
				return (typeof dict_indexes[value] !== 'undefined');
			}
			
			this.put = function(value) {
				// by default puts it at the end.
				if (this.has(value)) {
					// stays in same place.
					//arr[dict_indexes[value]]
					// do nothing
				} else {
					var index = arr.length;
					arr.push(value);
					dict_indexes[value] = index;
				}
				
			}
			
			this.out = function(value) {
				if (this.has(value)) {
					var idx = dict_indexes[value];
					arr.splice(idx, 1);
					
					delete dict_indexes[value];
					
					for (var c = idx, l = arr.length; c < l; c++) {
						var i = arr[c];
						dict_indexes[i]--;
					}
					// will need the items after it and lower their indexes.
					
				}
			}
			
			this.toggle = function(value) {
				if (this.has(value)) {
					this.out(value);
				} else {
					this.put(value);
				}
			}
			
			this.move_value = function(value, index) {
				if (this.has(value) && dict_indexes[value] != index) {
					
					// gets removed from current position, causes items after it to move back.
					//  gets put in new position, gets items after that to move forwards.
					
					var old_index = dict_indexes[value];
					arr.splice(old_index, 1);
					
					arr.splice(index, 0, value);
					
					
					
					if (index < old_index) {
						// moving back.
						//dict_indexes[]
						dict_indexes[arr[index]] = index;
						// the index object of the one it
						
						//for (var c = index, l = arr.length; c < l; c++) {
						for (var c = index + 1; c <= old_index; c++) {
							dict_indexes[arr[c]]++;
						}
					} else if (index > old_index) {
						dict_indexes[arr[index]] = index;
						for (var c = old_index; c < index; c++) {
							dict_indexes[arr[c]]--;
						}
					}
					
					
				}
				
			}
			
			
			// for testing
			
			this._index_scan = function() {
				for (var c = 0, l = arr.length; c < l; c++) {
					console.log('c ' + c + ' arr[c] ' + arr[c] + ' idx ' + dict_indexes[arr[c]]);
				};
			}
			
			
			this.toString = function() {
				var res = arr.join(' ');
				return res;
			}
			
			this.toString.stringify = true;
			
			this.set = fp(function(a, sig) {
				if (sig == '[s]') {
					arr = a[0].split(' ');
					//console.log('arr ' + jsgui.stringify(arr));
					reindex_dict_indexes();
				}
			});
			
			//if (sig == '[s]') {
			//	this.set(a[0]);
			//}
			
			var a = arguments;
			if (a.length == 1) {
				var spec = a[0];
				if (tof(spec) == 'string') {
					//console.log('setting');
					this.set(spec);
				}
			}
			
		}
	});
	
//  will put functions into the jsgui object.
	
	// with the functions listed like this it will be easier to document them.
	
	var jsgui = {
		'Class': Class,
		'each': each,
		'is_array': is_array,
		'is_dom_node': is_dom_node,
		'is_ctrl': is_ctrl,
		'extend': extend,
		'clone': clone,
		'x_clones': x_clones,
		'get_truth_map_from_arr': get_truth_map_from_arr,
		'get_map_from_arr': get_map_from_arr,
		'arr_like_to_arr': arr_like_to_arr,
		'tof': tof,
		'is_defined': is_defined,
		'stringify': stringify,
		'functional_polymorphism': functional_polymorphism,
		'fp': fp,
		'arrayify': arrayify,
		'are_equal': are_equal,
		'vectorify': vectorify,
		'v_add': v_add,
		'v_subtract': v_subtract,
		'v_multiply': v_multiply,
		'v_divide': v_divide,
		'vector_magnitude': vector_magnitude,
		'distance_between_points': distance_between_points,
		'arr_trim_undefined': arr_trim_undefined,
		//'remove_sig_from_arr_shell': remove_sig_from_arr_shell
		//'ll_set': ll_set,
		'execute_on_each_simple': execute_on_each_simple,
		'mapify': mapify,
		'atof': atof,
		'npx': npx,
		'no_px': no_px,
		'str_arr_mapify': str_arr_mapify,
		'arr_ltrb': arr_ltrb,
		'data_type_instance': data_type_instance,
		'data_types_info': data_types_info,
		'input_processors': input_processors,
		'output_processors': output_processors,
		'validators': validators,
		'DataObject': DataObject,
		'DataCollection': DataCollection,
		
		'str_hex_to_int': str_hex_to_int,
		'arr_rgb_to_css_hex_6': arr_rgb_to_css_hex_6,
		
		// These are likely to be deprecated in favour of having lang handle these internally and exposing add_data_type, which will be mapified.
		
		/*
		'populate_any_maps': populate_any_maps,
		'populate_optional_array_pos_maps': populate_optional_array_pos_maps,
		'populate_indexed_array_pos_maps': populate_indexed_array_pos_maps
		*/
		'populate_all_dt_maps': populate_all_dt_maps,
		
		'_data_generators': _data_generators,
		
		'Ordered_String_List': Ordered_String_List
		
		
	};
	
	
	
	
	//var jsgui = {};
	//alert('returning jsgui from jsgui-lang');
	return jsgui;
	
	
    
});