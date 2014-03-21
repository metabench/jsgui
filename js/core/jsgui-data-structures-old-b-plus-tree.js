
// This is resulting in smaller code in other parts of the framework.
//  07/05/2012  - Making my own implementation of the tree.
//   May be providing object references within the tree nodes.
//    May be doing indexing based on a field in that object reference automatically.

// Want really concise code here. Want it to be very clear too, so internal data structures use an implementation of that data structure.
//  The tree here is going to use Doubly_Linked_Lists for lists.

// Could maybe extend the Doubly_Linked_List into Sorted_Doubly_Linked_List, so that items can be retrieved faster.
//  Could possibly have an Array_Backed_Sorted_Doubly_Linked_List so that an array keeps track of the positions of the items in the list.
//  Because of code reuse the data structures module won't be so big.









// May sway implementations of the particular items more easily when they are in their own files.

define(["./jsgui-lang-essentials"], function(jsgui) {
	
	// Also will get the Doubly_Linked_List.
	// Various data structures will be defined separately and this will link them together.
	
	//  I think some data structures would be nice when published online.
	//   They will rely on essentials. A microframework version could be published with the necessary essentials already built in.
	
	
	//  Could include some Jasmine unit tests with them.
	
	
	// Now that this is isolated, removing it and replacing it with a different / better version seems easier... it's just a component.
	
	// The node, and the tree itself.
	
	// Each node has a doubly linked list holding the branches or leaves.
	//  The doubly linked list by itself without an array - or use an array as well?
	//  Doubly linked list may be enough.
	//  May extend some classes like Doubly_Linked_List to have the particular operations needed for this, but will be basing some of the more complicated data structures on some simpler
	//   ones.
	
	// So a tree node extends a doubly linked list node.
	//  Is a list of either branches or leaves.
	//  The items in the tree will be holding key-value pairs.
	//   Will likely have the indexing systems keep track of values associated with the items.
	//   In a simple set-up on the client, could be indexing objects like controls there.
	
	// These will be an in-memory data structure set, none of it asyncronous.
	//  Other types of persistance will be possible using resources.
	//   Want to have resources that can operate some data structures using some simpler primitives provided by possibly distributed resources.
	
	// Having these things scale over a network could work very well... could make it quite straightforward, and 'unproductize' some parts of it.
	//  Though some things will be used in subscription services that I provide.
	
	// Node will have various child node references. It may contain leaf nodes.
	
	// The tree node contains a list of its content.
	//  If it is a leaf node, it contains various values (or keys and values).
	
	// I think KVPs will be a major item used in these data structures.
	//  [key, value]. 
	
	// Sort function can compare the keys.
	//  Value will just be some kind of object. Will be a string key for some indexing systems.
	
	// The node needs to remember its siblings.
	//  Like in the doubly linked lists.
	
	// Leaf nodes knowing they are leaf nodes?
	
	// Maintaining sorted order in a doubly linked list... that could be a Sorted_Doubly_Linked_List.
	
	
	
	
	
	
	
	
	
	
	
	
	

	var BTreeNode = Class.extend({
		'init' : function(tree) {
			this.leaves = []; // values
			this.ptrs = [];
			this.parent = null; // parent node
			this.nextNode = null;
			this.prevNode = null;
			this.tree = tree;

			// Does not store the number of items contained within it
			// and its child nodes.
			// That would be a good thing to keep track of if it was
			// algorithmically cheap.
			// Whenever node is added or removed from branch, percolate
			// size changes upwards?
			// Would be useful for finding the position of any item
			// within the tree quickly. Can see how many are before it.

		},
		'getFirstNode' : function() {
			if (this.isLeaf()) {
				return this;
			} else {
				return this.ptrs[0].getFirstNode();
			}
		},
		'getSize' : function() {
			return this.leaves.length;
		},
		'isRoot' : function() { // return true if it is root
			return (this.getDepth() == 0);
		},
		'isLeaf' : function() { // return true if the node is a leaf
			return !(this.ptrs.length > 0);
		},
		'isBranch' : function() { // return true if the node is a
									// branch
			return !(this.isLeaf());
		},
		'isFull' : function() {
			return (this.getSize() == this.tree.d * 2);
		},
		'isOverflow' : function() {

			var size = this.getSize();
			var calcd = this.tree.d * 2 + 1;

			return (size >= calcd);

		},
		'getDepth' : function() {
			if (this.ptrs[0] == null)
				return 1;
			return 1 + (this.ptrs[0].getDepth());
		},
		'getRoot' : function() {
			if (this.parent == null)
				return this;
			return this.parent.getRoot();
		},
		'setRoot' : function(node) {
			// if(!node) alert('No node set for setRoot');
			if (!node)
				throw ('No node set for setRoot');
			this.tree.root = node;
		},
		
		// This may be modified so that it returns the node that was inserted.
		
		'insert': function(val) { // insert node
			//console.log('b+ tree insert tof(val) ' + tof(val));
			//  strings get inserted.
			//  the leaves is an array.
			//   quite simple data types here.
			
			// so the leaf_address or leaf_location is the location where val gets inserted.
			//  these may get shifted, so indexing them may not be so good.
			//  a sibling linked list may be the better implementation.
			
			// At least now I'm getting a better understanding of these B+ trees.
			
			//  doubly linked list to connect each list with its sibling.
			//   I think that doing that would really change the way the tree works on the inside.
			//   Making a doubly linked list class would help with this.
			//   Would be useful for making the algorithm simpler - not splicing an array for example.
			
			// Next, previous would be quite simple to do in the doubly linked list.
			// An new implementation of the B+ tree would be helpful.
			
			
			
			
			
			
			
			var leaves = this.leaves;

			if (this.isLeaf()) { // if this node is a leaf

				for ( var i = 0, l = this.tree.d * 2; i < l; i++) {
					if (val - leaves[i] < 0) {
						leaves.splice(i, 0, val);
						if (this.isOverflow())
							this.split();
						return;
					}
				}
				leaves.push(val);
				if (this.isOverflow()) { // if this node is
											// overflowed
					this.split();
					return;
				}
				return;
			} else { // if current node is a branch node
				for ( var i = 0, l = this.tree.d * 2; i < l; i++) {
					if (val < leaves[i]) {
						this.ptrs[i].insert(val);
						break;
					}
					if (i == tree.d * 2 - 1) { // last case
						this.ptrs[this.getSize()].insert(val);
					}
				}
				if (this.isOverflow()) {
					this.split();
				}
			}
		},

		// could search for a node with value >= val
		// the search only finds the node.
		// what about a search that finds the node and rh

		'search_ge' : function(val) {
			if (this.isLeaf()) {
				// each(this.leaf, function(i, v) {
				//	
				// })

				for ( var i = 0, l = this.getSize(); i <= l; i++) {
					var leaves_i = this.leaves[i];
					if (leaves_i && leaves_i >= val) {
						return this;
					}
				}
				return;
			}
			for ( var i = 0, l = this.getSize(); i <= l; i++) {
				var ptrs_i = this.ptrs[i];
				if (ptrs_i) {
					if (ptrs_i.search_ge(val)) {
						// searching the pointers for the value... will
						// it take much time?

						return this;
					}
				}
			}
		},

		'search_ex' : function(val) {
			if (this.isLeaf()) {
				for ( var i = 0, l = this.getSize(); i <= l; i++) {
					var leaves_i = this.leaves[i];

					if (leaves_i) {
						if (leaves_i == val) {
							return [ this, null, i ];
							// return this;
						}
					}
				}
				return;
			}
			for ( var i = 0; i <= this.getSize(); i++) {
				if (this.ptrs[i]) {
					var ptr_search_res = this.ptrs[i].search_ex(val);

					if (ptr_search_res) {
						// searching the pointers for the value... will
						// it take much time?

						console.log('ptr_search_res '
								+ stringify(ptr_search_res));

						// return this rather than the leaf node in
						// which it was found?
						// and the leaf number?

						// return this;
					}
				}
			}
		},

		// with a comparison function? would be slower I think.

		'search_ex_ge' : function(val) {
			if (this.isLeaf()) {
				for ( var i = 0; i <= this.getSize(); i++) {
					if (this.leaves[i]) {
						if (this.leaves[i] >= val) {
							return [ this, i ];
							// return this;
						}
					}
				}
				return;
			}
			for ( var i = 0; i <= this.getSize(); i++) {
				if (this.ptrs[i]) {
					var ptr_search_res = this.ptrs[i].search_ex_ge(val);

					if (ptr_search_res) {
						// searching the pointers for the value... will
						// it take much time?

						// console.log('ptr_search_ex_ge res ' +
						// stringify(ptr_search_res));
						// console.log('ptr_search_res ' +
						// ptr_search_res);

						return [ ptr_search_res[0], ptr_search_res[1] ];

						// return this rather than the leaf node in
						// which it was found?
						// and the leaf number?

						// return this;
					}
				}
			}
		},

		// search_ex
		// finds the node, the leaf num, and optionally the ptr num.

		'search' : function(val) {
			// check only the leaf
			if (this.isLeaf()) {
				for ( var i = 0; i <= this.getSize(); i++) {
					if (this.leaves[i]) {
						if (this.leaves[i] == val) {
							return this;
						}
					}
				}
				return;
			}
			for ( var i = 0; i <= this.getSize(); i++) {
				if (this.ptrs[i]) {
					if (this.ptrs[i].search(val)) {
						// searching the pointers for the value... will
						// it take much time?

						// return this rather than the leaf node in
						// which it was found?
						// and the leaf number?

						return this;
					}
				}
			}
		},

		'existSpace' : function(e) {
			// find if there is an space existed for e;
			if (!this.isFull())
				return true;
			if (this.isFull() && this.isLeaf())
				return false;
			for ( var i = 0; i < this.getSize(); i++) {
				if (e < this.leaves[i]) {
					// called only if branch
					if (this.ptrs[i].existSpace(e))
						return true;
					return false;
				}
				if (this.ptrs[this.getSize()].existSpace(e))
					return true;
			}
			return false;
		},
		// split the node, returns the parent Node
		'split' : function(e) {
			var t_parent = this.parent;
			var tmp_right = new BTreeNode(this.tree); // Node to be
														// another
			if (this.isLeaf()) { // if leaf split
				for ( var i = 0, l = this.getSize(); i < l; i++) {
					tmp_right.leaves.unshift(this.leaves.pop());
				}
				var p = this.nextNode;
				this.nextNode = tmp_right;
				tmp_right.prevNode = this;
				tmp_right.nextNode = p;
				if (p) {
					p.prevNode = tmp_right;
				}

				if (t_parent) {
					tmp_right.parent = this.parent;// assign parent
					var first_val = this.leaves[0];
					var index = -1;
					// go through parent leaves and find representation
					for ( var i = 0, l = t_parent.getSize(); i < l; i++) {
						var tpl = t_parent.leaves;

						if (tpl[i] == first_val) {
							// add new leaf to the parent
							tpl.splice(i + 1, 0, tmp_right.leaves[0]);
							// assign new pointer to the created leaf;
							t_parent.ptrs.splice(i + 2, 0, tmp_right);
							return t_parent;
							break;
						}
						if (i == this.parent.getSize() - 1) {// if no
																// leaves
																// has
																// it,
																// then
																// add
																// it to
																// the
																// first
																// line
							tpl.splice(0, 0, tmp_right.leaves[0]);
							t_parent.ptrs.splice(1, 0, tmp_right);
							return t_parent;
						}
					}
					return;
				} else { // if node does not have any parent, create
							// a parent
					var tmp_parent = new BTreeNode(this.tree); // Node
																// to be
																// a
																// parent
					tmp_right.parent = this.parent = tmp_parent;
					tmp_parent.ptrs.push(this);
					tmp_parent.ptrs.push(tmp_right);
					tmp_parent.leaves.push(tmp_right.leaves[0]);
					return this.parent;
				}
				return;
			} else { // if branch split take the mid node, move it to
						// the upper level
				if (t_parent) {
					for ( var i = 0, l = this.getSize(); i < l; i++) {
						tmp_right.leaves.unshift(this.leaves.pop());
						tmp_right.ptrs.unshift(this.ptrs.pop());
						tmp_right.ptrs[0].parent = tmp_right; // assign
																// new
																// parent
					}
					tmp_right.parent = this.parent;// assign parent
					var midvalue = tmp_right.leaves.shift();
					// go through parent leaves and find representation
					for ( var i = 0, l = this.parent.getSize(); i < l; i++) {
						if (midvalue < this.parent.leaves[i]) {
							this.parent.leaves.splice(i, 0, midvalue);
							this.parent.ptrs
									.splice(i + 1, 0, tmp_right);
							if (this.parent.isOverflow())
								this.parent.split();
							return this.parent;
							break;
						}
						if (i == this.parent.getSize() - 1) {
							this.parent.leaves.push(midvalue);
							this.parent.ptrs.push(tmp_right);
							return;
						}
					}
					return;
				} else { // if node does not have any parent, create
							// a parent
					for ( var i = 0, l = this.getSize(); i < l; i++) {
						tmp_right.leaves.unshift(this.leaves.pop());
						tmp_right.ptrs.unshift(this.ptrs.pop());
						tmp_right.ptrs[0].parent = tmp_right; // assign
																// new
																// parent
					}
					var tmp_parent = new BTree(); // Node to be a
													// parent
					tmp_right.parent = this.parent = tmp_parent;
					tmp_parent.ptrs.push(this);
					tmp_parent.ptrs.push(tmp_right);
					tmp_parent.leaves.push(tmp_right.leaves.shift());
					return this.parent;
				}
				return;
			}
		},
		'transfer' : function() {
			var giver = this.transferable();
			if (!giver)
				return false;
			if (giver == this.nextNode) { // if giver is located on
											// the right side
				var tmp = this.nextNode.leaves.shift();
				this.parent.leaves[this.parent.searchIndex(tmp)] = this.nextNode.leaves[0];
				this.leaves.push(tmp);
			} else { // if giver is located on the left side
				var tmp = this.prevNode.leaves.pop();
				this.parent.leaves[this.parent
						.searchIndex(this.leaves[0])] = tmp;
				this.leaves.unshift(tmp);
				// TODO: change the min in
			}
			return true;

		},
		'transferable' : function() {
			if (this.isBranch()) {
				alert('Branch transfer not implemented');
				return;
			}
			if (this.nextNode) {
				if (this.nextNode.parent == this.parent) {
					if (this.nextNode.getSize() > this.tree.d) {
						return this.nextNode;
					}
				}
			}
			if (this.prevNode) {
				if (this.prevNode.parent == this.parent) {
					if (this.prevNode.getSize() > this.tree.d) {
						return this.prevNode;
					}
				}
			}
			return false;
		},
		'remove' : function(val) {
			if (this.isLeaf()) { // if this is a leaf find a node
				for ( var i = 0, l = this.getSize(); i < l; i++) {
					if (this.leaves[i] == val) {
						this.changeVal(val, this.leaves[i + 1], this
								.getRoot());
						this.leaves.splice(i, 1);
						if (this.getSize() < this.tree.d
								&& this != this.getRoot()) { // if
																// result
																// leaf
																// is
																// smaller
																// than
																// usual
																// and
																// this
																// is
																// not a
																// root
																// node
							this.balance();
						}
						return this;
					}
				}
				// alert('failure to remove '+val+'');
			} else {
				for ( var i = 0; i < this.getSize(); i++) {
					if (val < this.leaves[i]) {
						return (this.ptrs[i].remove(val));
					}
					if (i == this.getSize() - 1) {
						return (this.ptrs[this.getSize()]).remove(val);
					}
				}
			}
		},
		'searchIndex' : function(val) {
			for ( var i = 0; i < this.getSize(); i++) {
				if (this.leaves[i] == val)
					return i;
			}
			console.log('Search Index failed for value ' + val
					+ ' Assume first array element in ptrs array.');
			return false;
		},
		'setParent' : function(parent) {
			var size = this.getSize();
			for ( var i = 0; i <= size; i++) {
				this.ptrs[i].parent = parent;
			}
		},
		'balance' : function() {
			if (this.transfer()) {
				return true;
			}
			if (this.merge()) {
				return true;
			}
			// alert('Balance Failure');
			return false;
		},
		'changeVal' : function(from, to, node) {
			if (node) {
				for ( var i = 0; i <= node.getSize(); i++) {
					if (node.leaves[i] == from)
						node.leaves[i] = to; // assign new value
					if (node.ptrs[i])
						node.ptrs[i].changeVal(from, to, node.ptrs[i]);
				}
			}
		},
		'changeValUp' : function(from, to, node) {
			var np = node.parent;

			if (np) {
				for ( var i = 0; i <= np.getSize(); i++) {
					if (np.leaves[i] == from)
						np.leaves[i] = to;
					if (np.parent)
						np.parent.changeValUp(from, to, np);
				}
			}
		},
		'merge' : function() {
			var merger = this.mergeable();
			if (!merger)
				return false;
			if (merger == this.nextNode) { // if merger is located on
											// the right side
				this.mergeAssign(this, this.nextNode);
			} else { // if merger is located on the left side
				this.mergeAssign(this.prevNode, this);
			}
			return true;
		},
		'mergeAssign' : function(a, b) {
			var j = b.getSize();
			for ( var i = 0; i < j; i++) {
				a.leaves.push(b.leaves.shift());
			}
			if (b.nextNode) { // pointer adjustment
				b.nextNode.prevNode = a;
				a.nextNode = b.nextNode;
			} else {
				a.nextNode = null;
			}

			for ( var j = 0; j <= a.parent.getSize(); j++) {
				if (a.parent.ptrs[j] == b) {
					a.parent.ptrs.splice(j, 1);
					a.parent.leaves.splice(j - 1, 1);
					break;
				}
			}
			b = null;
			if (a.parent.getSize() == 0 && a.parent == a.getRoot()) { // if
																		// parent
																		// has
																		// been
																		// reduced
																		// to 0
																		// then
																		// assign
																		// this
																		// to
																		// parent
				a.parent = null;
				tree.root = a;
				a.nextNode = null;
				a.prevNode = null;
				return;
			} else if (a.parent.getSize() < tree.d) {
				a.parent.reduce();
				return true;
			} else if (a.parent.isOverflow()) {
				alert('merge overflow');
				// a.parent.split();
				return true;
			}
		},
		'mergeable' : function() {
			if (this.isBranch()) {
				if (typeof console != 'undefined')
					console.log("Branch Merge not implemented");
				// alert('Branch Merge not implemented');
				return;
			}
			if (this.nextNode) {
				if (this.nextNode.parent == this.parent) {
					if (this.nextNode.getSize() + this.getSize() <= 2 * tree.d) {
						return this.nextNode;
					}
					// console.log("nextnode not mergeable");
				}
			}
			var prev_node = this.prevNode;
			if (prev_node) {
				if (prev_node.parent == this.parent) {
					if (prev_node.getSize() + this.getSize() <= 2 * tree.d) {
						return this.prevNode;
					}

					if (typeof console != 'undefined')
						console.log("prevnode not mergeable");
				}
			}
			return false;

		},
		'reduce' : function() { // reduce the height of the node
			if (this.isOverflow()) { // if this node is overflowed
				// alert('Overflow in reduce');
				this.split();
				return;
			}
			if (this.getSize() >= this.tree.d) {
				return;
			}
			if (this.getRoot() == this) {
				if (this.getSize() == 0) {
					var newroot = this.ptrs[0];
					this.setRoot(newroot);
					newroot.parent = null;
					newroot.prevNode = null;
					newroot.nextNode = null;
				}
				return;
			}
			for ( var i = 0, l = this.parent.getSize(); i <= l; i++) {
				if (this.parent.ptrs[i] == this) { // check prev and
													// next node
					var prev = this.parent.ptrs[i - 1];
					var next = this.parent.ptrs[i + 1];
					if (prev) {
						if (prev.getSize() > this.tree.d) { // getting
															// from prev
							var size = prev.getSize();
							var count = Math.ceil((size - tree.d) / 2);
							var old_minvalue = this.leaves[0];
							for ( var j = 0; j < count; j++) {
								var newleaf = this.parent.leaves[i - 1];
								this.leaves.unshift(newleaf);

								var leftleaf = prev.leaves.pop();
								this.parent.leaves[i - 1] = leftleaf;
								var newptr = prev.ptrs.pop();

								newptr.parent = this;
								this.ptrs.unshift(newptr); // ok
								this.changeValUp(newleaf, leftleaf,
										this.parent);
							}
							return;
						}
						break;
					}
					if (next) {
						if (next.getSize() > this.tree.d) {
							var size = next.getSize();
							var count = Math.ceil((size - tree.d) / 2);
							var old_minvalue = next.leaves[0];
							for ( var j = 0; j < count; j++) {
								var newleaf = this.parent.leaves[i];// bring
																	// head
																	// leaf
																	// down
								this.leaves.push(newleaf);

								var rightleaf = next.leaves.shift();
								this.parent.leaves[i] = rightleaf;
								var newptr = next.ptrs.shift();

								this.ptrs.push(newptr);// ok
								newptr.parent = this;
								if (j == count - 1) { // at last move
									this.changeValUp(newleaf,
											rightleaf, this.parent);
								}
							}
							return;
						}
						break;
					}
				}
				if (i == this.parent.getSize()) {
					// console.log("ptrs not found, somethign is
					// wrong");
					return false;
				}
			}
			// prev and next nodes don't have enough leaves... merge the
			// branch now
			var ret;
			if (prev) {
				ret = this.mergeBranch(prev, this);
			} else if (next) {
				ret = this.mergeBranch(this, next);
			}
			return ret.parent.reduce();
		},
		'mergeBranch' : function(a, b) {
			// return b;
			if (a.parent != b.parent) {
				// alert('Parent not matched, something is wrong');
			}
			var i = 0;
			for ( var i, l = b.parent.getSize(); i <= l; i++) {
				if (b.parent.ptrs[i] == b) {
					break;
				}
			}
			var b_leaves = b.leaves;
			var b_par = b.parent;
			var bpl = b_par.leaves;
			var bpp = b_par.ptrs;

			b_leaves.unshift(b.parent.leaves[i - 1]);
			bpl.splice(i - 1, 1); // cut the leave from the tree
			bpp.splice(i - 1, 1); // cut the pointers from the trees

			// var ;
			for ( var z = 0, j = a.getSize(); z < j; z++) {
				b_leaves.unshift(a.leaves.pop());
				b.ptrs.unshift(a.ptrs.pop());
				if (z == j - 1) { // one extra pointer;
					b.ptrs.unshift(a.ptrs.pop());
				}
			}
			b.setParent(b);
			return b;
		}
	});

	var BTreeCursor = Class.extend({
		// a cursor for the first item?

		'init' : function(tree, node, leafNum) {
			this.tree = tree;
			this.node = node;
			// this.subnodeNum = subnodeNum;
			this.leafNum = leafNum;
		},
		'get_value' : function() {
			// var tsnn = tof(this.subnodeNum);
			// if (tsnn)
			if (this.subnodeNum != null
					&& typeof this.subnodeNum != 'undefined') {
				// console.log('* this.subnodeNum ' + this.subnodeNum);

				// console.log('this.node.ptrs....length ' +
				// this.node.ptrs[this.subnodeNum].length);
				return this.node.ptrs[this.subnodeNum].leaves[this.leafNum]
			} else {
				// console.log('this.node.leaves.length ' +
				// this.node.leaves.length);
				return this.node.leaves[this.leafNum];
			}

			// if (node.leaves)
		},
		'move_first' : function() {
			// var l = get_cursor_location(this.tree, )
			// get the node...
			var n = this.tree.getRoot().getFirstNode();
			// console.log('n.leaves ' + n.leaves);
			// var p0 = n.ptrs[0];
			// console.log('p0 ' + p0);

			var l = [ n, null, 0 ];
			this.node = n;
			// this.subnodeNum = null;
			// node and leaf is enough to identify a value?
			this.leafNum = 0;
		},
		'move_next' : function() {
			// console.log('this.leafNum ' + this.leafNum);
			if (this.leafNum < this.node.leaves.length - 1) {
				this.leafNum++;

				// if (this.node.)

				var val = this.get_value();
				if (typeof val == 'undefined') {
					return this.move_next();
				} else {
					return true;
				}

				// console.log('incremented leafNum');
			} else {
				var nn = this.node.nextNode;
				// console.log('nn ' + nn);

				if (nn) {
					this.node = nn;
					this.leafNum = 0;
					return true;
				} else {
					var pln = this.node.ptrs[this.leafNum];
					// console.log('this.node.parent ' + this.node.parent);
					if (pln) {
						var nn2 = pln.nextNode;
						// console.log('nn2 ' + nn2);
						// console.log('nn2.leaves ' + nn2.leaves);
						this.node = nn2;
						this.leafNum = 0;
						return true;

						// what about the parent node?

					} else {
						return false;
					}
				}

			}

		}
	});

	

	var BTree = Class.extend({
		'init' : function(dimension) {
			set_vals(this, {
				'd' : dimension,
				'root' : new BTreeNode(this),
				'size' : 0
			});

			// this.d = dimension;
			// this.root = new BTreeNode(this);
			// this.size = 0;
		},
		'clear' : function() {
			set_vals(this, {
				'root' : new BTreeNode(this),
				'size' : 0
			});
		},
		'key_count' : function() {
			return this.size;
		},
		'insert': arrayify(function(e) {
			
			// inserting a bunch of nodes at once?
			
			// console.log('BTree insert');
			// if(e==0) {
			// alert('Please insert either positive or negative numbers');
			// want to be able to handle the number 0.

			// return false;
			// }
			if (this.root.search(e)) {
				// $("#notice").text('Cannot insert '+e+'. Node with value '+e+'
				// already exists.');
				return false;
			}
			if (this.root.getRoot() != this.root) {
				this.root = this.root.getRoot();
			}
			this.root.insert(e);
			this.size++;
			// console.log('this.size ' + this.size);
			if (this.root.getRoot() != this.root) {
				this.root = this.root.getRoot();
			}
			
			// I think a recursive insert that returns the node
			
			return true;
		}),
		'remove' : function(e) {
			if (!this.root.search(e)) {
				// $("#notice").text('Cannot delete '+e+'.\nNode with value
				// '+e+' was not found.');
				return false;
			}
			if (this.root.getRoot() != this.root) {
				this.root = this.root.getRoot();
			}
			this.root.remove(e);
			this.size--;
			if (this.root.getRoot() != this.root) {
				this.root = this.root.getRoot();
			}
			return true;
		},
		// 'walk': function() {
		// var firstnode = this.getRoot().getFirstNode();
		// //$("#walk_output").html("Leaf walks: "+firstnode.walk());
		// },
		'getRoot' : function() {
			return this.root;
		},
		'search' : function(val) {
			return this.root.search(val);
		},
		'getDepth' : function() {
			return this.getRoot().getDepth();
		},
		'keys' : function() {
			var firstNode = this.getRoot().getFirstNode();
			var keys = [];
			var cursor = new BTreeCursor(this, firstNode, null, 0);
			cursor.move_first();
			var val1 = cursor.get_value();
			// console.log('* val1 ' + val1);

			if (typeof val1 != 'undefined') {
				keys.push(val1);
			};

			while (cursor.move_next()) {
				// console.log('cursor.get_value() ' + cursor.get_value());
				keys.push(cursor.get_value());
			}
			return keys;

		},
		'keys_in_range' : function(iMin, iMax) {
			// first matching location
			var loc_first_matching = this.root.search_ex_ge(iMin, iMax);
			// loc_first_matching
			// console.log('loc_first_matching ' + loc_first_matching);

			var cursor = new BTreeCursor(this, loc_first_matching[0],
					loc_first_matching[1], loc_first_matching[2]);
			// var cursor = new BTreeCursor(this, loc_first_matching[0], null,
			// 0);
			// console.log('cursor.get_value() ' + cursor.get_value());

			var val = cursor.get_value();
			var res = [];
			console.log('cursor.get_value() ' + cursor.get_value());
			while (val != null && typeof val != 'undefined' && val <= iMax) {
				res.push(val);
				cursor.move_next();
				val = cursor.get_value();
				// console.log('val ' + val);
			}
			return res;

		}
		
		// prefix search could be similar.
		
	// get_range
	// could have a different search function to find the first.
	// it will find the first item within the range....

	// would need to do a tree traversal? looking for keys within that range.

	});
	
	// will put functions into the jsgui object.

	// with the functions listed like this it will be easier to document them.

	
	
	// will return a B_Plus object.
	
	// tree
	// node
	
	var B_Plus = {
		'Tree': BTree,
		'Node': BTreeNode,
		'Cursor': BTreeCursor
	}
	
	

	// var jsgui = {};
	// alert('returning jsgui from jsgui-lang');
	//return jsgui;

});


