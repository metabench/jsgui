
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

/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


// May sway implementations of the particular items more easily when they are in their own files.

define(["./jsgui-lang-essentials"], function (jsgui) {
    */
var jsgui = require('./jsgui-lang-essentials');

    // StiffArray: an array with pre-allocated items
    // it seems that this array is usually faster (excluding IE javascript engine)
    // probably there is a reason to provide IE implementation based on usual dynamic arrays


    var StiffArray = function (capacity) {

        // -----------------------------------------
        //              public interface:
        // -----------------------------------------

        var m_public = {
            items: new Array(capacity), // internal storage array 
            count: 0, // items count
            first: function () {
                if (this.count == 0) throw "StiffArray.first()";
                return this.items[0];
            },
            last: function () {
                if (this.count == 0) throw "StiffArray.last()";
                return this.items[this.count - 1];
            },
            add: function (item) {
                if (this.count >= capacity) throw "StiffArray.add()";
                //
                this.items[this.count++] = item;
            },
            add_from: function (source) {
                if (this.count + source.count > capacity) throw "StiffArray.add_from()";
                //
                for (var i = 0; i < source.count; i++) this.items[this.count++] = source.items[i];
            },
            insert: function (index, item) {
                if ((index < 0) || (index > this.count)) throw "StiffArray.insert(): index";
                if (this.count >= capacity) throw "StiffArray.insert(): overflow";
                //
                for (var i = this.count; i > index; i--) this.items[i] = this.items[i - 1];
                this.items[index] = item;
                this.count++;
            },
            removeAt: function (index) {
                if ((index < 0) || (index >= this.count)) throw "StiffArray.removeAt()";
                //
                this.count--;
                for (var i = index; i < this.count; i++) this.items[i] = this.items[i + 1];
            },
            removeFirst: function () {
                this.removeAt(0);
            },
            removeLast: function () {
                this.removeAt(this.count - 1);
            },
            copy_from: function (source, index, count) {
                for (var i = 0; i < count; i++) {
                    this.items[i] = source.items[i + index];
                }
                this.count = count;
            },
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
module.exports = StiffArray;


    //return StiffArray;


//});


