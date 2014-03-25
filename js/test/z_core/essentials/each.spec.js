

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/jsgui-lang-essentials', '../../../core/collection', '../../../core/data-object', 'assert', '../../test-utils/test-utils'], function (jsgui, collection, data_object, assert, test_utils) {


    describe("z_core/essentials/each.spec.js", function () {

        // -----------------------------------------------------
        //	Collection
        // -----------------------------------------------------

        xit("should iterate over Collection", function () {
            var result = "";
            //

            var President = data_object.Data_Object.extend({
                'fields': [
			        ['name', 'indexed text(32)'],
			        ['party', 'indexed text(32)'],
			        ['y1', 'int'],
			        ['y2', 'int']
                ],
                // connect_fields was connect
                'connect_fields': true
            });


            var arr_presidents = [
                { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
                { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
                { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' }
            ];


            var presidentsCollection = new collection.Collection(President, arr_presidents);
            //
            jsgui.each(presidentsCollection, function (index, element, stop) {
                //result += index + ":" + element + "/";
            });
            //
            //assert.equal(result, "0:1/1:2/2:3/3:4/4:5/");
        });

        // -----------------------------------------------------
        //	Array
        // -----------------------------------------------------

        it("should iterate over Array", function () {
            var result = "";
            //
            jsgui.each([1, 2, 3, 4, 5], function (index, element, stop) {
                result += index + ":" + element + "/";
            });
            //
            assert.equal(result, "0:1/1:2/2:3/3:4/4:5/");
        });

        // -----------------------------------------------------
        //	Object
        // -----------------------------------------------------

        it("should iterate over Object", function () {
            var result = "";
            //
            var obj = { a: 1, b: 2, c: 3 };
            jsgui.each(obj, function (key, value, stop) {
                result += key + ":" + value + "/";
            });
            //
            assert.equal(result, "a:1/b:2/c:3/");
        });

        // -----------------------------------------------------
        //	context
        // -----------------------------------------------------

        it("should bind to context", function () {
            var result = "";
            //
            var obj = {};
            //
            jsgui.each([1, 2, 3, 4, 5], function (index, element, stop) {
                result += index + ":" + element + "/";
                assert.equal(this, obj);
            }, obj);
            //
            assert.equal(result, "0:1/1:2/2:3/3:4/4:5/");
        });

        // -----------------------------------------------------
        //	null
        // -----------------------------------------------------

        it("should do nothing if no collection is given", function () {
            var result = "";
            //
            jsgui.each(null, function (index, element, stop) {
                result += index + ":" + element + "/";
                assert.equal(this, obj);
            });
            //
            assert.equal(result, "");
        });

        // -----------------------------------------------------
        //	stop
        // -----------------------------------------------------

        it("should should break iteration when the stop function is called", function () {
            var result = "";
            //
            jsgui.each([1, 2, 3, 4, 5], function (index, element, stop) {
                result += index + ":" + element + "/";
                if (element >= 3) stop();
            });
            //
            assert.equal(result, "0:1/1:2/2:3/");
        });


    });

    describe("z_core/essentials/each.spec.js - eac() function", function () {

        // -----------------------------------------------------
        //	Collection
        // -----------------------------------------------------

        xit("should iterate over Collection", function () {
            var result = "";
            //

            var President = data_object.Data_Object.extend({
                'fields': [
			        ['name', 'indexed text(32)'],
			        ['party', 'indexed text(32)'],
			        ['y1', 'int'],
			        ['y2', 'int']
                ],
                // connect_fields was connect
                'connect_fields': true
            });


            var arr_presidents = [
                { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
                { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
                { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' }
            ];


            var presidentsCollection = new collection.Collection(President, arr_presidents);
            //
            jsgui.eac(presidentsCollection, function (index, element, stop) {
                //result += index + ":" + element + "/";
            });
            //
            //assert.equal(result, "0:1/1:2/2:3/3:4/4:5/");
        });

        // -----------------------------------------------------
        //	Array
        // -----------------------------------------------------

        it("should iterate over Array", function () {
            var result = "";
            //
            jsgui.eac([1, 2, 3, 4, 5], function (element, index, stop) {
                result += index + ":" + element + "/";
            });
            //
            assert.equal(result, "0:1/1:2/2:3/3:4/4:5/");
        });

        // -----------------------------------------------------
        //	Object
        // -----------------------------------------------------

        it("should iterate over Object", function () {
            var result = "";
            //
            var obj = { a: 1, b: 2, c: 3 };
            jsgui.eac(obj, function (value, key, stop) {
                result += key + ":" + value + "/";
            });
            //
            assert.equal(result, "a:1/b:2/c:3/");
        });

        // -----------------------------------------------------
        //	context
        // -----------------------------------------------------

        it("should bind to context", function () {
            var result = "";
            //
            var obj = {};
            //
            jsgui.eac([1, 2, 3, 4, 5], function (element, index, stop) {
                result += index + ":" + element + "/";
                assert.equal(this, obj);
            }, obj);
            //
            assert.equal(result, "0:1/1:2/2:3/3:4/4:5/");
        });

        // -----------------------------------------------------
        //	null
        // -----------------------------------------------------

        it("should do nothing if no collection is given", function () {
            var result = "";
            //
            jsgui.eac(null, function (element, index, stop) {
                result += index + ":" + element + "/";
                assert.equal(this, obj);
            });
            //
            assert.equal(result, "");
        });

        // -----------------------------------------------------
        //	stop
        // -----------------------------------------------------

        it("should should break iteration when the stop function is called", function () {
            var result = "";
            //
            jsgui.eac([1, 2, 3, 4, 5], function (element, index, stop) {
                result += index + ":" + element + "/";
                if (element >= 3) stop();
            });
            //
            assert.equal(result, "0:1/1:2/2:3/");
        });


    });

});


