

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/jsgui-data-structures-stiffarray', 'assert', '../../test-utils/test-utils'],
function (StiffArray, assert, test_utils) {

    describe("core/data-structures/StiffArray.spec.js", function () {


        function expect(val) {
            return {
                toEqual: function (expected) {
                    assert.deepEqual(val, expected);
                },
                toThrow: function (expected) {
                    assert.throws(val, expected);
                }
            };
        }


        it("test adds", function () {
            var array = new StiffArray(3);
            //
            expect(array.items.length).toEqual(3);
            expect(array.count).toEqual(0);
            expect(array.toString()).toEqual("");
            //
            array.add(1);
            expect(array.toString()).toEqual("1");
            //
            array.add(2);
            expect(array.toString()).toEqual("1,2");
            //
            array.add(3);
            expect(array.toString()).toEqual("1,2,3");
            //
            expect(function () { array.add(4); }).toThrow("StiffArray.add()");
            expect(array.toString()).toEqual("1,2,3");
        });

        it("test insert", function () {
            var array = new StiffArray(7);
            //
            array.add(2);
            array.add(4);
            array.add(6);
            expect(array.toString()).toEqual("2,4,6");
            //
            array.insert(1, 3);
            expect(array.toString()).toEqual("2,3,4,6");
            //
            array.insert(0, 1);
            expect(array.toString()).toEqual("1,2,3,4,6");
            //
            array.insert(5, 7);
            expect(array.toString()).toEqual("1,2,3,4,6,7");
            //
            expect(function () { array.insert(-1, 0); }).toThrow("StiffArray.insert(): index");
            expect(function () { array.insert(7, 0); }).toThrow("StiffArray.insert(): index");
            expect(array.toString()).toEqual("1,2,3,4,6,7");
            //
            array.insert(4, 5);
            expect(array.toString()).toEqual("1,2,3,4,5,6,7");
            expect(function () { array.insert(0, 0); }).toThrow("StiffArray.insert(): overflow");
        });

        it("test removeAt", function () {
            var array = new StiffArray(10);
            //
            array.add(2);
            array.add(4);
            array.add(6);
            array.add(8);
            expect(array.toString()).toEqual("2,4,6,8");
            //
            array.removeAt(1);
            expect(array.toString()).toEqual("2,6,8");
            //
            array.removeAt(2);
            expect(array.toString()).toEqual("2,6");
            //
            array.removeAt(0);
            expect(array.toString()).toEqual("6");
            //
            expect(function () { array.removeAt(-1); }).toThrow("StiffArray.removeAt()");
            expect(function () { array.removeAt(1); }).toThrow("StiffArray.removeAt()");
            expect(array.toString()).toEqual("6");
            //
            array.removeAt(0);
            expect(array.toString()).toEqual("");
            //
            expect(function () { array.removeAt(0); }).toThrow("StiffArray.removeAt()");
            expect(array.toString()).toEqual("");
        });

        it("test search_first - doc example", function () {
            var arr = new StiffArray(10);
            //
            arr.add(1); // [0]
            arr.add(2); // [1]
            arr.add(2); // [2]
            arr.add(3); // [3]
            arr.add(3); // [4]
            arr.add(3); // [5]
            //
            assert.deepEqual(arr.search_first(0), { found: false, index: 0 });
            assert.deepEqual(arr.search_first(1), { found: true, index: 0 });
            assert.deepEqual(arr.search_first(2), { found: true, index: 1 });
            assert.deepEqual(arr.search_first(3), { found: true, index: 3 });
            assert.deepEqual(arr.search_first(4), { found: false, index: 6 });
        });

        it("test search_first", function () {
            var array = new StiffArray(10);
            var searchResult = null;
            //
            array.add(1);
            array.add(3);
            array.add(5);
            array.add(5);
            array.add(5);
            array.add(5);
            array.add(7);
            expect(array.toString()).toEqual("1,3,5,5,5,5,7");
            //
            searchResult = array.search_first(0);
            expect(searchResult.found + " " + searchResult.index).toEqual("false 0");
            //
            searchResult = array.search_first(1);
            expect(searchResult.found + " " + searchResult.index).toEqual("true 0");
            //
            searchResult = array.search_first(2);
            expect(searchResult.found + " " + searchResult.index).toEqual("false 1");
            //
            searchResult = array.search_first(3);
            expect(searchResult.found + " " + searchResult.index).toEqual("true 1");
            //
            searchResult = array.search_first(4);
            expect(searchResult.found + " " + searchResult.index).toEqual("false 2");
            //
            searchResult = array.search_first(5);
            expect(searchResult.found + " " + searchResult.index).toEqual("true 2");
            //
            searchResult = array.search_first(6);
            expect(searchResult.found + " " + searchResult.index).toEqual("false 6");
            //
            searchResult = array.search_first(7);
            expect(searchResult.found + " " + searchResult.index).toEqual("true 6");
            //
            searchResult = array.search_first(8);
            expect(searchResult.found + " " + searchResult.index).toEqual("false 7");
        });

        it("test search_first-2", function () {
            var array = new StiffArray(10);
            var searchResult = null;
            //
            array.add(1);
            array.add(3);
            expect(array.toString()).toEqual("1,3");
            //
            searchResult = array.search_first(1);
            expect(searchResult.found + " " + searchResult.index).toEqual("true 0");
        });

        it("test search_first-3", function () {
            var array = new StiffArray(10);
            var searchResult = null;
            //
            array.add("111");
            array.add("121");
            array.add("122");
            array.add("131");
            expect(array.toString()).toEqual("111,121,122,131");
            //
            searchResult = array.search_first("10");
            expect(searchResult.found + " " + searchResult.index).toEqual("false 0");
            //
            searchResult = array.search_first("11");
            expect(searchResult.found + " " + searchResult.index).toEqual("false 0");
            //
            searchResult = array.search_first("12");
            expect(searchResult.found + " " + searchResult.index).toEqual("false 1");
            //
            searchResult = array.search_first("13");
            expect(searchResult.found + " " + searchResult.index).toEqual("false 3");
            //
            searchResult = array.search_first("14");
            expect(searchResult.found + " " + searchResult.index).toEqual("false 4");
        });

        it("test search_first-big", function () {
            var search_first = function (items, key) {
                var array = new StiffArray(10);
                for (var i = 0; i < items.length; i++) array.add(items[i]);
                return array.search_first(key);
            };
            //
            //
            // length == 0
            //
            expect(search_first([], 0)).toEqual({ found: false, index: 0 });
            //
            // length == 1
            //
            expect(search_first([1], 0)).toEqual({ found: false, index: 0 });
            expect(search_first([1], 1)).toEqual({ found: true, index: 0 });
            expect(search_first([1], 2)).toEqual({ found: false, index: 1 });
            //
            // length == 2
            //
            expect(search_first([1, 1], 0)).toEqual({ found: false, index: 0 });
            expect(search_first([1, 1], 1)).toEqual({ found: true, index: 0 });
            expect(search_first([1, 1], 2)).toEqual({ found: false, index: 2 });
            //
            expect(search_first([1, 3], 0)).toEqual({ found: false, index: 0 });
            expect(search_first([1, 3], 1)).toEqual({ found: true, index: 0 });
            expect(search_first([1, 3], 2)).toEqual({ found: false, index: 1 });
            expect(search_first([1, 3], 3)).toEqual({ found: true, index: 1 });
            expect(search_first([1, 3], 4)).toEqual({ found: false, index: 2 });
            //
            // length == 3
            //
            expect(search_first([1, 1, 1], 0)).toEqual({ found: false, index: 0 });
            expect(search_first([1, 1, 1], 1)).toEqual({ found: true, index: 0 });
            expect(search_first([1, 1, 1], 2)).toEqual({ found: false, index: 3 });
            //
            expect(search_first([1, 1, 3], 0)).toEqual({ found: false, index: 0 });
            expect(search_first([1, 1, 3], 1)).toEqual({ found: true, index: 0 });
            expect(search_first([1, 1, 3], 2)).toEqual({ found: false, index: 2 });
            expect(search_first([1, 1, 3], 3)).toEqual({ found: true, index: 2 });
            expect(search_first([1, 1, 3], 4)).toEqual({ found: false, index: 3 });
            //
            expect(search_first([1, 3, 3], 0)).toEqual({ found: false, index: 0 });
            expect(search_first([1, 3, 3], 1)).toEqual({ found: true, index: 0 });
            expect(search_first([1, 3, 3], 2)).toEqual({ found: false, index: 1 });
            expect(search_first([1, 3, 3], 3)).toEqual({ found: true, index: 1 });
            expect(search_first([1, 3, 3], 4)).toEqual({ found: false, index: 3 });
            //
            expect(search_first([1, 3, 5], 0)).toEqual({ found: false, index: 0 });
            expect(search_first([1, 3, 5], 1)).toEqual({ found: true, index: 0 });
            expect(search_first([1, 3, 5], 2)).toEqual({ found: false, index: 1 });
            expect(search_first([1, 3, 5], 3)).toEqual({ found: true, index: 1 });
            expect(search_first([1, 3, 5], 4)).toEqual({ found: false, index: 2 });
            expect(search_first([1, 3, 5], 5)).toEqual({ found: true, index: 2 });
            expect(search_first([1, 3, 5], 6)).toEqual({ found: false, index: 3 });
            //
            // length == 4
            //
            expect(search_first([1, 1, 1, 1], 0)).toEqual({ found: false, index: 0 });
            expect(search_first([1, 1, 1, 1], 1)).toEqual({ found: true, index: 0 });
            expect(search_first([1, 1, 1, 1], 2)).toEqual({ found: false, index: 4 });
            //
            expect(search_first([1, 1, 1, 3], 0)).toEqual({ found: false, index: 0 });
            expect(search_first([1, 1, 1, 3], 1)).toEqual({ found: true, index: 0 });
            expect(search_first([1, 1, 1, 3], 2)).toEqual({ found: false, index: 3 });
            expect(search_first([1, 1, 1, 3], 3)).toEqual({ found: true, index: 3 });
            expect(search_first([1, 1, 1, 3], 4)).toEqual({ found: false, index: 4 });
            //
            expect(search_first([1, 3, 3, 3], 0)).toEqual({ found: false, index: 0 });
            expect(search_first([1, 3, 3, 3], 1)).toEqual({ found: true, index: 0 });
            expect(search_first([1, 3, 3, 3], 2)).toEqual({ found: false, index: 1 });
            expect(search_first([1, 3, 3, 3], 3)).toEqual({ found: true, index: 1 });
            expect(search_first([1, 3, 3, 3], 4)).toEqual({ found: false, index: 4 });
            //
            expect(search_first([1, 1, 3, 5], 0)).toEqual({ found: false, index: 0 });
            expect(search_first([1, 1, 3, 5], 1)).toEqual({ found: true, index: 0 });
            expect(search_first([1, 1, 3, 5], 2)).toEqual({ found: false, index: 2 });
            expect(search_first([1, 1, 3, 5], 3)).toEqual({ found: true, index: 2 });
            expect(search_first([1, 1, 3, 5], 4)).toEqual({ found: false, index: 3 });
            expect(search_first([1, 1, 3, 5], 5)).toEqual({ found: true, index: 3 });
            expect(search_first([1, 1, 3, 5], 6)).toEqual({ found: false, index: 4 });
            //
            expect(search_first([1, 3, 3, 5], 0)).toEqual({ found: false, index: 0 });
            expect(search_first([1, 3, 3, 5], 1)).toEqual({ found: true, index: 0 });
            expect(search_first([1, 3, 3, 5], 2)).toEqual({ found: false, index: 1 });
            expect(search_first([1, 3, 3, 5], 3)).toEqual({ found: true, index: 1 });
            expect(search_first([1, 3, 3, 5], 4)).toEqual({ found: false, index: 3 });
            expect(search_first([1, 3, 3, 5], 5)).toEqual({ found: true, index: 3 });
            expect(search_first([1, 3, 3, 5], 6)).toEqual({ found: false, index: 4 });
            //
            expect(search_first([1, 3, 5, 5], 0)).toEqual({ found: false, index: 0 });
            expect(search_first([1, 3, 5, 5], 1)).toEqual({ found: true, index: 0 });
            expect(search_first([1, 3, 5, 5], 2)).toEqual({ found: false, index: 1 });
            expect(search_first([1, 3, 5, 5], 3)).toEqual({ found: true, index: 1 });
            expect(search_first([1, 3, 5, 5], 4)).toEqual({ found: false, index: 2 });
            expect(search_first([1, 3, 5, 5], 5)).toEqual({ found: true, index: 2 });
            expect(search_first([1, 3, 5, 5], 6)).toEqual({ found: false, index: 4 });
            //
            expect(search_first([1, 3, 5, 7], 0)).toEqual({ found: false, index: 0 });
            expect(search_first([1, 3, 5, 7], 1)).toEqual({ found: true, index: 0 });
            expect(search_first([1, 3, 5, 7], 2)).toEqual({ found: false, index: 1 });
            expect(search_first([1, 3, 5, 7], 3)).toEqual({ found: true, index: 1 });
            expect(search_first([1, 3, 5, 7], 4)).toEqual({ found: false, index: 2 });
            expect(search_first([1, 3, 5, 7], 5)).toEqual({ found: true, index: 2 });
            expect(search_first([1, 3, 5, 7], 6)).toEqual({ found: false, index: 3 });
            expect(search_first([1, 3, 5, 7], 7)).toEqual({ found: true, index: 3 });
            expect(search_first([1, 3, 5, 7], 8)).toEqual({ found: false, index: 4 });
        });

        it("test search_last - doc example", function () {
            var arr = new StiffArray(10);
            //
            arr.add(1); // [0]
            arr.add(2); // [1]
            arr.add(2); // [2]
            arr.add(3); // [3]
            arr.add(3); // [4]
            arr.add(3); // [5]
            //
            assert.deepEqual(arr.search_last(0), { found: false, index: 0 });
            assert.deepEqual(arr.search_last(1), { found: true, index: 0 });
            assert.deepEqual(arr.search_last(2), { found: true, index: 2 });
            assert.deepEqual(arr.search_last(3), { found: true, index: 5 });
            assert.deepEqual(arr.search_last(4), { found: false, index: 6 });
        });

        it("test search_last", function () {
            var array = new StiffArray(10);
            var searchResult = null;
            //
            array.add(1);
            array.add(3);
            array.add(5);
            array.add(5);
            array.add(5);
            array.add(5);
            array.add(7);
            expect(array.toString()).toEqual("1,3,5,5,5,5,7");
            //
            searchResult = array.search_last(0);
            expect(searchResult.found + " " + searchResult.index).toEqual("false 0");
            //
            searchResult = array.search_last(1);
            expect(searchResult.found + " " + searchResult.index).toEqual("true 0");
            //
            searchResult = array.search_last(2);
            expect(searchResult.found + " " + searchResult.index).toEqual("false 1");
            //
            searchResult = array.search_last(3);
            expect(searchResult.found + " " + searchResult.index).toEqual("true 1");
            //
            searchResult = array.search_last(4);
            expect(searchResult.found + " " + searchResult.index).toEqual("false 2");
            //
            searchResult = array.search_last(5);
            expect(searchResult.found + " " + searchResult.index).toEqual("true 5");
            //
            searchResult = array.search_last(6);
            expect(searchResult.found + " " + searchResult.index).toEqual("false 6");
            //
            searchResult = array.search_last(7);
            expect(searchResult.found + " " + searchResult.index).toEqual("true 6");
            //
            searchResult = array.search_last(8);
            expect(searchResult.found + " " + searchResult.index).toEqual("false 7");
        });

        it("test search_last-3", function () {
            var array = new StiffArray(10);
            var searchResult = null;
            //
            array.add("111");
            array.add("121");
            array.add("122");
            array.add("131");
            expect(array.toString()).toEqual("111,121,122,131");
            //
            searchResult = array.search_last("10");
            expect(searchResult.found + " " + searchResult.index).toEqual("false 0");
            //
            searchResult = array.search_last("11");
            expect(searchResult.found + " " + searchResult.index).toEqual("false 0");
            //
            searchResult = array.search_last("12");
            expect(searchResult.found + " " + searchResult.index).toEqual("false 1");
            //
            searchResult = array.search_last("13");
            expect(searchResult.found + " " + searchResult.index).toEqual("false 3");
            //
            searchResult = array.search_last("14");
            expect(searchResult.found + " " + searchResult.index).toEqual("false 4");
        });

        it("test search_last-big", function () {
            var search_last = function (items, key) {
                var array = new StiffArray(10);
                for (var i = 0; i < items.length; i++) array.add(items[i]);
                return array.search_last(key);
            };
            //
            //
            // length == 0
            //
            expect(search_last([], 0)).toEqual({ found: false, index: 0 });
            //
            // length == 1
            //
            expect(search_last([1], 0)).toEqual({ found: false, index: 0 });
            expect(search_last([1], 1)).toEqual({ found: true, index: 0 });
            expect(search_last([1], 2)).toEqual({ found: false, index: 1 });
            //
            // length == 2
            //
            expect(search_last([1, 1], 0)).toEqual({ found: false, index: 0 });
            expect(search_last([1, 1], 1)).toEqual({ found: true, index: 1 });
            expect(search_last([1, 1], 2)).toEqual({ found: false, index: 2 });
            //
            expect(search_last([1, 3], 0)).toEqual({ found: false, index: 0 });
            expect(search_last([1, 3], 1)).toEqual({ found: true, index: 0 });
            expect(search_last([1, 3], 2)).toEqual({ found: false, index: 1 });
            expect(search_last([1, 3], 3)).toEqual({ found: true, index: 1 });
            expect(search_last([1, 3], 4)).toEqual({ found: false, index: 2 });
            //
            // length == 3
            //
            expect(search_last([1, 1, 1], 0)).toEqual({ found: false, index: 0 });
            expect(search_last([1, 1, 1], 1)).toEqual({ found: true, index: 2 });
            expect(search_last([1, 1, 1], 2)).toEqual({ found: false, index: 3 });
            //
            expect(search_last([1, 1, 3], 0)).toEqual({ found: false, index: 0 });
            expect(search_last([1, 1, 3], 1)).toEqual({ found: true, index: 1 });
            expect(search_last([1, 1, 3], 2)).toEqual({ found: false, index: 2 });
            expect(search_last([1, 1, 3], 3)).toEqual({ found: true, index: 2 });
            expect(search_last([1, 1, 3], 4)).toEqual({ found: false, index: 3 });
            //
            expect(search_last([1, 3, 3], 0)).toEqual({ found: false, index: 0 });
            expect(search_last([1, 3, 3], 1)).toEqual({ found: true, index: 0 });
            expect(search_last([1, 3, 3], 2)).toEqual({ found: false, index: 1 });
            expect(search_last([1, 3, 3], 3)).toEqual({ found: true, index: 2 });
            expect(search_last([1, 3, 3], 4)).toEqual({ found: false, index: 3 });
            //
            expect(search_last([1, 3, 5], 0)).toEqual({ found: false, index: 0 });
            expect(search_last([1, 3, 5], 1)).toEqual({ found: true, index: 0 });
            expect(search_last([1, 3, 5], 2)).toEqual({ found: false, index: 1 });
            expect(search_last([1, 3, 5], 3)).toEqual({ found: true, index: 1 });
            expect(search_last([1, 3, 5], 4)).toEqual({ found: false, index: 2 });
            expect(search_last([1, 3, 5], 5)).toEqual({ found: true, index: 2 });
            expect(search_last([1, 3, 5], 6)).toEqual({ found: false, index: 3 });
            //
            // length == 4
            //
            expect(search_last([1, 1, 1, 1], 0)).toEqual({ found: false, index: 0 });
            expect(search_last([1, 1, 1, 1], 1)).toEqual({ found: true, index: 3 });
            expect(search_last([1, 1, 1, 1], 2)).toEqual({ found: false, index: 4 });
            //
            expect(search_last([1, 1, 1, 3], 0)).toEqual({ found: false, index: 0 });
            expect(search_last([1, 1, 1, 3], 1)).toEqual({ found: true, index: 2 });
            expect(search_last([1, 1, 1, 3], 2)).toEqual({ found: false, index: 3 });
            expect(search_last([1, 1, 1, 3], 3)).toEqual({ found: true, index: 3 });
            expect(search_last([1, 1, 1, 3], 4)).toEqual({ found: false, index: 4 });
            //
            expect(search_last([1, 3, 3, 3], 0)).toEqual({ found: false, index: 0 });
            expect(search_last([1, 3, 3, 3], 1)).toEqual({ found: true, index: 0 });
            expect(search_last([1, 3, 3, 3], 2)).toEqual({ found: false, index: 1 });
            expect(search_last([1, 3, 3, 3], 3)).toEqual({ found: true, index: 3 });
            expect(search_last([1, 3, 3, 3], 4)).toEqual({ found: false, index: 4 });
            //
            expect(search_last([1, 1, 3, 5], 0)).toEqual({ found: false, index: 0 });
            expect(search_last([1, 1, 3, 5], 1)).toEqual({ found: true, index: 1 });
            expect(search_last([1, 1, 3, 5], 2)).toEqual({ found: false, index: 2 });
            expect(search_last([1, 1, 3, 5], 3)).toEqual({ found: true, index: 2 });
            expect(search_last([1, 1, 3, 5], 4)).toEqual({ found: false, index: 3 });
            expect(search_last([1, 1, 3, 5], 5)).toEqual({ found: true, index: 3 });
            expect(search_last([1, 1, 3, 5], 6)).toEqual({ found: false, index: 4 });
            //
            expect(search_last([1, 3, 3, 5], 0)).toEqual({ found: false, index: 0 });
            expect(search_last([1, 3, 3, 5], 1)).toEqual({ found: true, index: 0 });
            expect(search_last([1, 3, 3, 5], 2)).toEqual({ found: false, index: 1 });
            expect(search_last([1, 3, 3, 5], 3)).toEqual({ found: true, index: 2 });
            expect(search_last([1, 3, 3, 5], 4)).toEqual({ found: false, index: 3 });
            expect(search_last([1, 3, 3, 5], 5)).toEqual({ found: true, index: 3 });
            expect(search_last([1, 3, 3, 5], 6)).toEqual({ found: false, index: 4 });
            //
            expect(search_last([1, 3, 5, 5], 0)).toEqual({ found: false, index: 0 });
            expect(search_last([1, 3, 5, 5], 1)).toEqual({ found: true, index: 0 });
            expect(search_last([1, 3, 5, 5], 2)).toEqual({ found: false, index: 1 });
            expect(search_last([1, 3, 5, 5], 3)).toEqual({ found: true, index: 1 });
            expect(search_last([1, 3, 5, 5], 4)).toEqual({ found: false, index: 2 });
            expect(search_last([1, 3, 5, 5], 5)).toEqual({ found: true, index: 3 });
            expect(search_last([1, 3, 5, 5], 6)).toEqual({ found: false, index: 4 });
            //
            expect(search_last([1, 3, 5, 7], 0)).toEqual({ found: false, index: 0 });
            expect(search_last([1, 3, 5, 7], 1)).toEqual({ found: true, index: 0 });
            expect(search_last([1, 3, 5, 7], 2)).toEqual({ found: false, index: 1 });
            expect(search_last([1, 3, 5, 7], 3)).toEqual({ found: true, index: 1 });
            expect(search_last([1, 3, 5, 7], 4)).toEqual({ found: false, index: 2 });
            expect(search_last([1, 3, 5, 7], 5)).toEqual({ found: true, index: 2 });
            expect(search_last([1, 3, 5, 7], 6)).toEqual({ found: false, index: 3 });
            expect(search_last([1, 3, 5, 7], 7)).toEqual({ found: true, index: 3 });
            expect(search_last([1, 3, 5, 7], 8)).toEqual({ found: false, index: 4 });
        });

        it("test search_last_prefix", function () {
            var array = new StiffArray(10);
            var searchResult = null;
            //
            array.add("111");
            array.add("121");
            array.add("122");
            array.add("131");
            expect(array.toString()).toEqual("111,121,122,131");
            //
            expect(array.search_last_prefix("")).toEqual({ found: true, index: 3 });
            expect(array.search_last_prefix("0")).toEqual({ found: false, index: 0 });
            expect(array.search_last_prefix("1")).toEqual({ found: true, index: 3 });
            expect(array.search_last_prefix("2")).toEqual({ found: false, index: 4 });
            //
            expect(array.search_last_prefix("10")).toEqual({ found: false, index: 0 });
            expect(array.search_last_prefix("11")).toEqual({ found: true, index: 0 });
            expect(array.search_last_prefix("12")).toEqual({ found: true, index: 2 });
            expect(array.search_last_prefix("13")).toEqual({ found: true, index: 3 });
            expect(array.search_last_prefix("14")).toEqual({ found: false, index: 4 });
        });


    });



});


