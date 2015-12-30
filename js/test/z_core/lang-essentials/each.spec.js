
describe("z_core/essentials/each.spec.js", function () {

    var jsgui;
    var Collection;
    var Data_Object;
    var assert;

    before(function () {
        jsgui = require('../../../core/jsgui-lang-essentials');
        Collection = require('../../../core/collection');
        Data_Object = require('../../../core/data-object');
        assert = require('assert');
    });

    // -----------------------------------------------------
    //	Collection
    // -----------------------------------------------------

    it("each() should iterate over Collection", function () {
        var result = [];
        //
        var President = Data_Object.extend({
            'fields': [
                ['name', 'indexed text(32)'],
                ['party', 'indexed text(32)'],
                ['y1', 'int'],
                ['y2', 'int']
            ],
            'connect_fields': true
        });
        //
        var arr_presidents = [
            { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
            { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
            { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' }
        ];
        //
        var presidentsCollection = new Collection(President, arr_presidents);
        //
        jsgui.each(presidentsCollection, function (index, element, stop) {
            result.push([index, jsgui.stringify(element)]);
        });
        //
        assert.deepEqual(result,[
            [0, 'Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})'],
            [1, 'Data_Object({"name": "John Adams", "y1": 1797, "y2": 1801, "party": "Federalist"})'],
            [2, 'Data_Object({"name": "Thomas Jefferson", "y1": 1801, "y2": 1809, "party": "Democratic-Republican"})']
        ]);
    });

    // -----------------------------------------------------
    //	Array
    // -----------------------------------------------------

    it("each() should iterate over Array", function () {
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

    it("each() should iterate over Object", function () {
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

    it("each() should bind to context", function () {
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

    it("each() should do nothing if no collection is given", function () {
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
    //	stop - array
    // -----------------------------------------------------

    it("each() should should break array iteration when the stop function is called", function () {
        var result = "";
        //
        jsgui.each([1, 2, 3, 4, 5], function (index, element, stop) {
            result += index + ":" + element + "/";
            if (element >= 3) stop();
        });
        //
        assert.equal(result, "0:1/1:2/2:3/");
    });

    // -----------------------------------------------------
    //	stop - object
    // -----------------------------------------------------

    it("each() should should break object iteration when the stop function is called", function () {
        var result = "";
        //
        jsgui.each({ a: 1, b: 2, c: 3, d: 4, e: 5 }, function (index, element, stop) {
            result += index + ":" + element + "/";
            if (element >= 3) stop();
        });
        //
        assert.equal(result, "a:1/b:2/c:3/");
    });


    // ==================================================================================
    //                                      eac()
    // ==================================================================================

    // -----------------------------------------------------
    //	Collection
    // -----------------------------------------------------

    it("eac() should iterate over Collection", function () {
        var result = [];
        //
        var President = Data_Object.extend({
            'fields': [
                ['name', 'indexed text(32)'],
                ['party', 'indexed text(32)'],
                ['y1', 'int'],
                ['y2', 'int']
            ],
            'connect_fields': true
        });
        //
        var arr_presidents = [
            { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
            { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
            { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' }
        ];
        //
        var presidentsCollection = new Collection(President, arr_presidents);
        //
        jsgui.eac(presidentsCollection, function (element, index, stop) {
            result.push([index, jsgui.stringify(element)]);
        });
        //
        assert.deepEqual(result, [
            [0, 'Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})'],
            [1, 'Data_Object({"name": "John Adams", "y1": 1797, "y2": 1801, "party": "Federalist"})'],
            [2, 'Data_Object({"name": "Thomas Jefferson", "y1": 1801, "y2": 1809, "party": "Democratic-Republican"})']
        ]);
    });

    // -----------------------------------------------------
    //	Array
    // -----------------------------------------------------

    it("eac() should iterate over Array", function () {
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

    it("eac() should iterate over Object", function () {
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

    it("eac() should bind to context", function () {
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

    it("eac() should do nothing if no collection is given", function () {
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
    //	stop - array
    // -----------------------------------------------------

    it("eac() should should break array iteration when the stop function is called", function () {
        var result = "";
        //
        jsgui.eac([1, 2, 3, 4, 5], function (element, index, stop) {
            result += index + ":" + element + "/";
            if (element >= 3) stop();
        });
        //
        assert.equal(result, "0:1/1:2/2:3/");
    });

    // -----------------------------------------------------
    //	stop - object
    // -----------------------------------------------------

    it("eac() should should break object iteration when the stop function is called", function () {
        var result = "";
        //
        jsgui.eac({ a: 1, b: 2, c: 3, d: 4, e: 5 }, function (element, index, stop) {
            result += index + ":" + element + "/";
            if (element >= 3) stop();
        });
        //
        assert.equal(result, "a:1/b:2/c:3/");
    });


});

