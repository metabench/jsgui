
// could rename this ds_doubly_linked_list.js

// maybe not really a part of jsgui?
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}



define(["./jsgui-lang-essentials"], function(jsgui) {

    /** 
    * Doubly linked list module.
    * @module core/jsgui-data-structures-doubly-linked-list 
    * @exports Doubly_Linked_List
    */

	// Essentials provides a fair few things... at least I can use functional polymorphism.

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
	var are_equal = j.are_equal;
	var get_item_sig = j.get_item_sig;
	var set_vals = j.set_vals;
	var truth = j.truth;
	var trim_sig_brackets = j.trim_sig_brackets;
	
// This may use some more generic graph node?
	
	// This may need to get adapted further for use in some other components.
	
	// Nodes having a key - they get inserted in a particular position.
	//  Having a value too? A key value pair array?
	//   Possibly could maintain the sorted order of a list. That will get used for the B+ tree.
	
	// Each node has a parent, and various children / branches.
	//  I think there can be some relatively generic tree / node systems, with b+ functionality implemented on top of that.
	
	// The B+ tree node could be an extension from Sorted_Doubly_Linked_list
	//  It will override insert code with code that can insert within other Node objects within it.
	
	// There will be a B+ tree class that makes use of these nodes, and will perform rebalancing where necessary.
	
	// Want an interface, linked_hash_map, that has the linked list internally
	// Linked list that has an object inside each node.
	
	
	// Doing more work on a linked list, and linked mapped list will be helpful.
	//  Sorted_KVS, Ordered_KVS?
	//  Ordered_List?
	//  Ordered_KVS makes sense when each value has a key but the order needs to be preserved.
	//   Could be a wrapper around Linked_Map.
	
    /**
    * Creates the node.
    * @constructor
    * @classdesc Represents a doubly linked list item (named "node").
    * @alias Doubly_Linked_List.Node
    * @param {object} spec - {value: (node value)}
    * @memberof module:core/jsgui-data-structures-doubly-linked-list
    * @example
    *
    * var node101 = new Doubly_Linked_List.Node({ value: 101 });
    */
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
	
	
	// var jsgui = {};
	// alert('returning jsgui from jsgui-lang');
	//return jsgui;

	return Doubly_Linked_List;
	
	
});
