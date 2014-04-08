
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


// May sway implementations of the particular items more easily when they are in their own files.

define(["./jsgui-lang-essentials", "./jsgui-data-structures-stiffarray"], function (jsgui, StiffArray) {

    /** 
    * B+ Tree module.
    * @module core/jsgui-data-structures-b-plus-tree
    * @exports B_Plus_Tree
    */


    // B+ Tree

    // some B+ Tree description can be found here:
    // http://www.cs.berkeley.edu/~kamil/teaching/su02/080802.pdf
    // http://baze.fri.uni-lj.si/dokumenti/B+%20Trees.pdf


    // sample tree classic presentation:
    //
    //	              [] 7 []
    //	              /     \
    //	             /       -----------------
    //	            /                         \
    //	           /                           \
    //	     [] 3 [] 5 []                  [] 8 [] 8 []
    //	     /    |     \                  /     \    \
    //	    /     |      \                /       |    ----
    //     /      |       \              /         \       \
    //  {1,2}   {3,4}    {5,6,7}      {8,8,8}    {8,8}    {8,9}
    //
    //   the diagram notation:
    //   numbers are "keys" array items
    //   "[]" figures are "children" array items


    // sample tree toText() presentation:
    //
    //	      {1,2}
    //	    3
    //	      {3,4}
    //	    5
    //	      {5,6,7}
    //  7
    //	      {8,8,8}
    //	    8
    //	      {8,8}
    //	    8
    //	      {8,9}


    // sample tree toString() presentation:
    //
    // {{{1,2}3{3,4}5{5,6,7}}7{{8,8,8}8{8,8}8{8,9}}}


    // some remarks:
    //
    //  children.length == keys.length + 1
    //
    //  (max children[i] key) <= (keys[i]) <= (min children[i+1] key)
    //
    //  the node overflow threshold referred somewhere as "node order" is referred as "node capacity" here


    // -----------------------------------------
    //
    //	              global variables:
    //
    // -----------------------------------------

    //var B_Plus_Tree_NextNodeDebugId = 1;
    // uncomment the line above to include unique node IDs 
    // to the toString() and toTest() output

    // -----------------------------------------
    //
    //	              B_Plus_Node:
    //
    // -----------------------------------------

    // Likely to get this into the core, and do some more polymorphic optimization to reduce file size.
    //  One various things are running, I will focus on some code size optimizations to bring things down to really small sizes when used in
    //  conjunction with Essentials.

    // Not sure about the B+ tree making use of Collections but with no indexing?
    //  I think by making Collection really flexible, and a version that mixes in other functionality to a more basic one,
    //  it would be possible to make the B+ tree use a Collection with StiffArray capabilities.
    //   Not worth it right now. Keep StiffArray as a low level component used for the tree. Maybe move it out of its own JavaScript file, not sure it
    //    will be used for that much else. Not sure, could be good for when binary searches are required.








    // B+ tree index node:

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


        /**
        *
        * @constructor
        * @alias FindInfo
        * @augments module:core/jsgui-data-structures-b-plus-tree
        * 
        */

        // @memberof  module:core/jsgui-data-structures-b-plus-tree

        /* * @lends FindInfo.prototype */

        return {
            /** key to find */
            key: key,     // key to find (if present)
            value: value, // value to find (if present)
            isPrefixSearch: isPrefixSearch, // prefix search mode
            leaf: null,   // found leaf
            index: -1,    // found leaf item index
            isKeyPresent: isKeyPresent, // function () { return this.key !== undefined; }, // is the search criteria contains key
            isValuePresent: isValuePresent, // function () { return this.value !== undefined; }, // is the search criteria contains value
            foundKey: function () { return this.leaf.keys.items[this.index]; }, // found items's key
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
        *   numbers are "keys" array items
        *   "[]" figures are "children" array items
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
            * clear the tree
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
            * @param {*} key
            * @param {*} value
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */

            /** 
            * insert key and value: key is arr[0], value is arr[1]; i.e. `insert([key, value])`
            * @func
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
            // find first key matching the prefix:
            findFirstPrefix: function (prefix) {
                return p_FindFirst(prefix, undefined, true);
            },
            //
            // find next search conditions occurence
            findNext: function (findInfo) {
                return p_FindNext(findInfo);
            },
            //
            // findLast() - find the very last item
            // findLast(key) - find the last item for the given key
            // findLast(key, value) - find the last key+value occurrence
            findLast: function (key, value) {
                return p_FindLast(key, value);
            },
            //
            // find last key matching the prefix:
            findLastPrefix: function (prefix) {
                return p_FindLast(prefix, undefined, true);
            },
            //
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
            * getValue() and setValue() methods pair offer a dictionary-like usage pattern
            *
            * @func
            * @param {*} key
            * @instance
            */
            // get one value by key (or null):
            getValue: function (key) {
                return p_GetValue(key);
            },
            /** 
            * set one value by key (insert or update)
            *
            * getValue() and setValue() methods pair offer a dictionary-like usage pattern
            *
            * @func
            * @param {*} key
            * @param {*} value
            * @instance
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
            * @instance
            * @memberof module:core/jsgui-data-structures-b-plus-tree.B_Plus_Tree
            */

            /** 
            * count values with the given key
            * @func
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
            */
            // get keys by prefix
            'get_keys_by_prefix': function (prefix) {
                return p_get_keys_by_prefix(prefix);
            },
            //
            /** 
            * get values at key...
            * @func
            * @param {*} key
            * @instance
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

    return B_Plus_Tree;


});


