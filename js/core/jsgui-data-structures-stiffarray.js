
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


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


// May sway implementations of the particular items more easily when they are in their own files.

define(["./jsgui-lang-essentials"], function (jsgui) {


    // StiffArray: an array with pre-allocated items
    // it seems that this array is usually faster (excluding IE javascript engine)
    // probably there is a reason to provide IE implementation based on usual dynamic arrays

    /** 
    * Stiff Array module.
    * @module core/jsgui-data-structures-stiffarray
    * @exports StiffArray
    */


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


    return StiffArray;


});


