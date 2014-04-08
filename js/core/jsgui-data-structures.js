// This is resulting in smaller code in other parts of the framework.
//  This section is getting quite big (again)
//  Still need to make use of the B+ free for ordered indexing.

// Moving some code to jsgui-lang-essentials
//  Will be publishing a 0.4 version of that before so long?
//   Maybe with more explanation?

// It may be worth publishing this, and a discussion forum about it on my own web forum.
//  Perhaps that could come later, but jsgui-lang-essentials may be a good step. Could call it version 0.35.
//   Could have a few examples
//   Would be a useful toolkit I could use while working elsewhere.

//  I think that web site would be lightening fast, and impress people with its speed compared to other web platforms that they are used to
//   (though Facebook is OK)




// May sway implementations of the particular items more easily when they are in their own files.

// It looks like things are pointing towards the Compressed Dynamic Suffix Array.

//  Want something that provides full-text matches.
//   Some simpler data structures may work better to start with.
//   For unit tests, could compare them to a very simple and inefficient algorithm that goes through the whole string.

// Suffixes seem like one of the important things to focus on.

//  Prefix trees seemed like a good way of doing things before.

// I think suffix arrays, compressed suffix arrays, and compressed dynamic ones seem like the major route to take.
// Suffix trees too, those may lead to suffix arrays as well.
//  Definitely do want these fairly difficult features.

// CDSAs are not necessarily Mikael Salson's version either.
//  Could approach it myself.
//  Need the suffix array
//  Need to compress it
//   Changing the uncompressed suffix array
//   Changing a compressed suffix array

// Going from the operation, doing something, to all the steps needed to change the array.
//  Can do some experiments with the suffix arrays, compressing them to another type of suffix array, and decompressing them as well.
//   Performing search operations on the compressed suffix array.

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./jsgui-lang-essentials", "./jsgui-data-structures-doubly-linked-list", "./jsgui-data-structures-b-plus-tree"], function(jsgui, Doubly_Linked_List, B_Plus_Tree) {
	
    /** 
    * Data structures module.
    * @module core/jsgui-data-structures
    * @exports Data_Structures
    */


	// The data structures will be needed to support some components
	
	var Class = jsgui.Class;
	//console.log('Class ' + Class);
	var mapify = jsgui.mapify;
	//console.log('mapify ' + mapify);

	var is_defined = jsgui.is_defined;
	var stringify = jsgui.stringify;
	var each = jsgui.each;
	var fp = jsgui.fp;
	// Also will get the Doubly_Linked_List.
	// Various data structures will be defined separately and this will link them together.
	
	//  I think some data structures would be nice when published online.
	//   They will rely on essentials. A microframework version could be published with the necessary essentials already built in.
	
	
	//  Could include some Jasmine unit tests with them.
	
	
	// Now that this is isolated, removing it and replacing it with a different / better version seems easier... it's just a component.
	
	// This is acting as a friendlier wrapper to the B+ tree.
	//  Not so sure about it having it maintain a dict index too... but maybe it is best to have ksvs
	//  KSVS could possibly be extended so that it makes use of both the tree and the dict.
	
	// I'm interested in making a data structure that uses these sibling lists as well as a dict. That will mean they can be located by full key in O(1) time.
	//  Then the tree can be moved through.
	//   This would mean indexing the leaf node for the object. Then it will be possible to move through the tree.
	//   Finding the place where an item would be put... similar to finding the first key after a certain value.
	//   Then can proceed through the tree (quick to move to the next node) until we have moved past nodes with the specified prefix.
	
	// The point is to have various data structures here that are named, and have APIs as per their usage.
	// Eg Key-Value-Store rather than B+ tree
	
	// Sorted_KVS
	
	//  Could make an API / interface for this.
	
	// May be better to work on the XML processing for the moment?
	
	// Transforming an XML / jsgui page jsguiml? actually ASP.NET?
	//  JSUI (Je Suis, I like that name, it's announcing that things 'are', it's a very declarative statement.)
	//   JSUI-XML
	//   JeSui_XML
	//   Je_Suis_Xml
	
	//  JSUI-ML
	
	// I think maintaining and consuming these data structures as resources will be a very useful functionality.
	//  Distributed result finding could be very useful, where a function in execution is sent over the network.
	//  The function gets sent over to its next node when it has a result from one node.
	//   It could branch as well when necessary, meaning lookups take place in parallel.
	//    Would maybe need or benefit from high latency alert reporting.
	
	// Publishing various data structures such as a sorted list over a network would be useful.
	//  Even if the list itself may not be distributed, it could be a component in a distributed system.
	
	// There will wind up being a variety of different classes that do similar things, but in different ways.
	
	// Could have a high throughput system.
	
	// There could be a KVS resource that is used as a shard, with a published index for the sharding system, and the client machines
	//  using a KVS_Shards(_Client) resource. That will mean that systems that rely on a large array like structure, like a B+ tree, could make use of it.
	// Client access for using the B+ tree could be done accross the network (if its not for locks!)
	//  May run into trouble because of data change and access to it.
	//  Could also implement a locking mechanism? What exactly would it do? Or more like a rapid update notifier? Or again no need because everything gets updated in the shards?
	//  Want to avoid multiple updates taking place at once. The lack of logic could be messy.
	//   Maybe there is a way to partition things so that some part of a tree becomes locked?
	
	// I think a sharded lower level unsorted KSV would be really useful for making a sorted KVS, and also a full-text index.
	//  There could be multiple nodes that access it, but 
	
	// Full text index:
	//  Key(string), text_value(string)
	//  key used to identify the text and for returning the result.
	
	// Full text index on the client would indeed be quite useful.
	//  It would probably be possible to make a text index incorporating some things like BWT for use on the client.
	
	
	
	// The data for the tree would be distributed over the KVS shards, and would then 
	
	
	/*
	
	var Sorted_List = Class.extend({
		'init': function(spec) {
			
			this.tree = new BTree(12);
			
			
		},
		'clear': function() {
			this.tree.clear();
		},
		'put': function(value) {
			var insert_res = this.tree.insert(key);
		},
		'out': function(value) {
			this.tree.remove(key);
		},
		'has': function(value) {
			// tree.has?
			
			
		},
		'values': function(value) {
			
		},
		'count': function() {
			
		},
		'get_cursor': function() {
			
		}
	})
	
	*/
	
	
	// Will have the ordered string list here as well
	//  Commented out for the moment
	
	/*
	 * 
	 * 
	
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

			// (add), remove, get, get_all, has, put, move, splice
			this.has = function(value) {
				return (typeof dict_indexes[value] !== 'undefined');
			}

			this.put = function(value) {
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

			this.out = function(value) {
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

			this.toggle = function(value) {
				if (this.has(value)) {
					this.out(value);
				} else {
					this.put(value);
				}
			}

			this.move_value = function(value, index) {
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

			this.toString = function() {
				var res = arr.join(' ');
				return res;
			}

			this.toString.stringify = true;

			this.set = fp(function(a, sig) {
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
	 */
	
	
    /**
    * Creates the Sorted_KVS.
    * @constructor
    * @classdesc Represents a sorted key/value pairs storage (with fast access by the key).
    * @memberof module:core/jsgui-data-structures
    */
	
	// Multiple items could be stored in one position.
	//  This may have another layer of functionality beyond the tree.
	
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

			// (add), remove, get, get_all, has, put, move, splice
			this.has = function(value) {
				return (typeof dict_indexes[value] !== 'undefined');
			}

			this.put = function(value) {
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

			this.out = function(value) {
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

			this.toggle = function(value) {
				if (this.has(value)) {
					this.out(value);
				} else {
					this.put(value);
				}
			}

			this.move_value = function(value, index) {
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

			this.toString = function() {
				var res = arr.join(' ');
				return res;
			}

			this.toString.stringify = true;

			this.set = fp(function(a, sig) {
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
	

	// var jsgui = {};
	// alert('returning jsgui from jsgui-lang');
	//return jsgui;
	
	// maybe should mix the data structures into jsgui.
	//  These data structures are likely to be necessary for various things
	
	
	
	
	
	return Data_Structures;

});