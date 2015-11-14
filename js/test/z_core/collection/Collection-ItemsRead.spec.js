
describe("z_core/collection/Collection-ItemsRead.spec.js ", function () {

    var jsgui;
    var Collection;
    var Data_Value;
    var Data_Object;
    var assert;
    var test_utils;

    var stringify;

    before(function () {
        var jsgui_module_name = require.resolve('../../../core/jsgui-lang-essentials');
        delete require.cache[jsgui_module_name];
        jsgui = require('../../../core/jsgui-lang-essentials');
        //
        Collection = require('../../../core/collection');
        Data_Value = require('../../../core/data-value');
        Data_Object = require('../../../core/data-object');
        assert = require('assert');
        test_utils = require('../../test-utils/test-utils');
        //
        stringify = jsgui.stringify;
    });

    //#region Collection - ItemsRead

    // ======================================================
    //
    //	                Collection - ItemsRead
    //
    // ======================================================

    // -----------------------------------------------------
    //	length()
    // -----------------------------------------------------

    it("length() should return collection length", function () {
        var collection = new Collection();
        test_utils.assertDeepEqual(collection.length(), 0);
        //
        collection.set([1, "2"]);
        test_utils.assertDeepEqual(collection.length(), 2);
    });

    // -----------------------------------------------------
    //	each()
    // -----------------------------------------------------

    it("each() should iterate over the items", function () {
        var collection = new Collection();
        collection.set([1, "2"]);
        //
        var dump = [];
        var callback = function (key, value) { dump.push([key, value]) };
        //
        collection.each(callback);
        test_utils.assertDeepEqual(dump, [[0, new Data_Value({ value: 1 })], [1, new Data_Value({ value: "2" })]]);
    });

    // -----------------------------------------------------
    //	eac()
    // -----------------------------------------------------

    it("eac() should iterate over the items", function () {
        var collection = new Collection();
        collection.set([1, "2"]);
        //
        var dump = [];
        var callback = function (value, key) { dump.push([key, value]) }; // as opposed to each() callback parameters (key, value)
        //
        collection.eac(callback);
        test_utils.assertDeepEqual(dump, [[0, new Data_Value({ value: 1 })], [1, new Data_Value({ value: "2" })]]);
    });

    //#endregion

    //#region find(...)

    // ======================================================
    //
    //	                find(...)
    //
    // ======================================================

    // -----------------------------------------------------
    //	find([o])
    // -----------------------------------------------------

    it("test find([o])", function () {
        var presidents = new Collection(
            Data_Object.extend({
                'fields': [
                    ['name', 'indexed text(32)'],
                    ['party', 'indexed text(32)'],
                    ['y1', 'int'],
                    ['y2', 'int']
                ],
            }),
            [
                { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
                { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
                { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' }
            ]
        );
        //
        var find_result = null;
        //
        find_result = presidents.find({ 'name': 'George Washington' });
        test_utils.assertDeepEqual(stringify(find_result), '[Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})]');
        //
        find_result = presidents.find({ 'party': '' });
        test_utils.assertDeepEqual(stringify(find_result), '[Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})]');
        //
        find_result = presidents.find({ 'party': undefined });
        test_utils.assertDeepEqual(find_result, undefined);
        //
        assert.throws(function () { find_result = presidents.find({ 'y1': 1789 }); }, /stop/); // no index for 'y1' field
        //
        find_result = presidents.find({ 'name': '' });
        test_utils.assertDeepEqual(find_result, []);
        //
        assert.throws(function () { find_result = presidents.find({ 'name': 'George Washington', 'party': '' }); }, /stop/); // keys.length != 1
        assert.throws(function () { find_result = presidents.find({ 'name': 'George Washington', 'y1': 1789 }); }, /stop/); // keys.length != 1
    });

    // -----------------------------------------------------
    //	find([a])
    // -----------------------------------------------------

    it("test find([a])", function () {
        var presidents = new Collection(
            Data_Object.extend({
                'fields': [
                    ['name', 'indexed text(32)'],
                    ['party', 'indexed text(32)'],
                    ['y1', 'int'],
                    ['y2', 'int']
                ],
            }),
            [
                { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
                { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
                { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' },
                { 'name': 'William Henry Harrison', 'y1': 1841, 'y2': 1841, 'party': 'Whig' },
                { 'name': 'John Tyler', 'y1': 1841, 'y2': 1845, 'party': 'Whig' },
                { 'name': 'James K. Polk', 'y1': 1845, 'y2': 1849, 'party': 'Democratic' },
                { 'name': 'Zachary Taylor', 'y1': 1849, 'y2': 1850, 'party': 'Whig' },
                { 'name': 'Millard Fillmore', 'y1': 1850, 'y2': 1853, 'party': 'Whig' }
            ]
        );
        //
        var find_result = null;
        //
        // name field, found:
        find_result = presidents.find([['name', 'George Washington']]);
        test_utils.assertDeepEqual(stringify(find_result), '[Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})]');
        //
        // name field, not found:
        find_result = presidents.find([['name', 'Nobody']]);
        test_utils.assertDeepEqual(find_result, []);
        //
        // party field, found:
        find_result = presidents.find([['party', 'Whig']]);
        test_utils.assertDeepEqual(find_result.length, 4);
        //
        // party, undefined found:
        find_result = presidents.find([['party', undefined]]);
        test_utils.assertDeepEqual(stringify(find_result), '[Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})]');
        //
        // party field, empty string instead of undefined, found:
        find_result = presidents.find([['party', '']]);
        test_utils.assertDeepEqual(stringify(find_result), '[Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})]');
        //
        // party field, not found:
        find_result = presidents.find([['party', 'xxx']]);
        test_utils.assertDeepEqual(find_result, []);
        //
        // non-indexed field:
        find_result = presidents.find([['y1', '1789']]);
        test_utils.assertDeepEqual(find_result, undefined);
        //
        // indexed + indexed (different indexes), not work:
        find_result = presidents.find([['name', 'George Washington'], ['party', undefined]]);
        test_utils.assertDeepEqual(find_result, undefined);
        //
        // indexed + indexed (different indexes), not work again:
        find_result = presidents.find([['name', 'William Henry Harrison'], ['party', 'Whig']]);
        test_utils.assertDeepEqual(find_result, undefined);
        //
        // indexed + non-indexed, not work (it's expected):
        find_result = presidents.find([['name', 'George Washington'], ['y1', '1789']]);
        test_utils.assertDeepEqual(find_result, undefined);
        //
        // add 2 fields index:
        //
        presidents.index(['name', 'party']);
        //
        // indexed + indexed, works now:
        find_result = presidents.find([['name', 'George Washington'], ['party', undefined]]);
        test_utils.assertDeepEqual(stringify(find_result), '[Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})]');
        //
        // indexed + indexed, works now:
        find_result = presidents.find([['name', 'William Henry Harrison'], ['party', 'Whig']]);
        test_utils.assertDeepEqual(stringify(find_result), '[Data_Object({"name": "William Henry Harrison", "y1": 1841, "y2": 1841, "party": "Whig"})]');
    });

    // -----------------------------------------------------
    //	find([o,s])
    // -----------------------------------------------------

    it("test find([o,s])", function () {
        var presidents = new Collection(
            Data_Object.extend({
                'fields': [
                    ['name', 'indexed text(32)'],
                    ['party', 'indexed text(32)'],
                    ['y1', 'int'],
                    ['y2', 'int']
                ],
            }),
            [
                { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
                { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
                { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' }
            ]
        );
        //
        var find_result = null;
        //
        // seems not possible to pass an object to be found successfully...
        //
        // When Collection_Index_System.search_for_index_with_fields() method tries
        // to select an appropriate index, it compares an object and an array using an are_equal() function. 
        // In this case the function result is never true.
        //
        find_result = presidents.find({}, 'George Washington');
        test_utils.assertDeepEqual(find_result, undefined);
    });

    // -----------------------------------------------------
    //	find([s,s])
    // -----------------------------------------------------

    it("test find([s,s])", function () {
        var presidents = new Collection(
            Data_Object.extend({
                'fields': [
                    ['name', 'indexed text(32)'],
                    ['party', 'indexed text(32)'],
                    ['y1', 'int'],
                    ['y2', 'int'],
                ],
            }),
            [
                { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
                { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
                { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' },
                { 'name': 'William Henry Harrison', 'y1': 1841, 'y2': 1841, 'party': 'Whig' },
                { 'name': 'John Tyler', 'y1': 1841, 'y2': 1845, 'party': 'Whig' },
                { 'name': 'James K. Polk', 'y1': 1845, 'y2': 1849, 'party': 'Democratic' },
                { 'name': 'Zachary Taylor', 'y1': 1849, 'y2': 1850, 'party': 'Whig' },
                { 'name': 'Millard Fillmore', 'y1': 1850, 'y2': 1853, 'party': 'Whig' },
            ]
        );
        //
        var find_result = null;
        //
        find_result = presidents.find('name', 'George Washington');
        test_utils.assertDeepEqual(stringify(find_result), '[Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})]');
        //
        find_result = presidents.find('name', '');
        test_utils.assertDeepEqual(find_result, []);
        //
        find_result = presidents.find('party', '');
        test_utils.assertDeepEqual(stringify(find_result), '[Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})]');
        //
        find_result = presidents.find('party', undefined);
        test_utils.assertDeepEqual(find_result, undefined);
        //
        find_result = presidents.find('party', 'Whig');
        test_utils.assertDeepEqual(find_result.length, 4);
        //
        find_result = presidents.find('y1', '1789');
        test_utils.assertDeepEqual(find_result, undefined); // "y1" field not indexed
    });

    // -----------------------------------------------------
    //	find([a,s])
    // -----------------------------------------------------

    it("test find([a,s])", function () {
        var presidents = new Collection(
            Data_Object.extend({
                'fields': [
                    ['name', 'indexed text(32)'],
                    ['party', 'indexed text(32)'],
                    ['y1', 'int'],
                    ['y2', 'int'],
                ],
            }),
            [
                { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
                { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
                { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' },
            ]
        );
        //
        var find_result = null;
        //
        // seems not possible to pass such parameters to be found successfully...
        //
        // Collection_Index_System.find() passing the first parameter (array) into the Collection_Index_System.search_for_index_with_fields() method 
        // wraps it into an additional array, so it is unable to find an appropriate collection index.
        //
        find_result = presidents.find(['name'], 'George Washington');
        test_utils.assertDeepEqual(find_result, undefined);
    });

    // -----------------------------------------------------
    //	find([s,o])
    // -----------------------------------------------------

    it("test find([s,o])", function () {
        var order_items = new Collection(
            Data_Object.extend({
                'fields': [
                    ['order_id', 'indexed text(10)'],
                    ['items', 'array']
                ],
            }),
            [
                { 'order_id': '101', items: [{ name: 'pencil', cost: 1 }, { name: 'book', cost: 15 }, { name: 'watercolour', cost: 7 }] },
                { 'order_id': '102', items: [{ name: 'stick notes', cost: 3 }, { name: 'mark pen', cost: 4 }] },
                { 'order_id': '103', items: [{ name: 'drawing set', cost: 10 }, { name: 'protractor', cost: 1 }, { name: 'book', cost: 20 }] }
            ]
        );
        //
        var find_result = null;
        //
        find_result = order_items.find('items', { name: 'book' });
        test_utils.assertDeepEqual(stringify(find_result), 'Collection(Data_Object({"name": "book", "cost": 15}), Data_Object({"name": "book", "cost": 20}))');
        //
        find_result = order_items.find('items', { name: 'book', cost: 20 });
        test_utils.assertDeepEqual(stringify(find_result), 'Collection(Data_Object({"name": "book", "cost": 20}))');
    });

    //#endregion

    // -----------------------------------------------------
    //	get([n])
    // -----------------------------------------------------

    it("test get([n])", function () {
        var presidents = new Collection(
            Data_Object.extend({
                'fields': [
                    ['name', 'indexed text(32)'],
                    ['party', 'indexed text(32)'],
                    ['y1', 'int'],
                    ['y2', 'int'],
                ],
            }),
            [
                { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
                { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
                { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' },
            ]
        );
        //
        var item = presidents.get(0);
        test_utils.assertDeepEqual(stringify(item), 'Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})');
    });

    // -----------------------------------------------------
    //	get([s])
    // -----------------------------------------------------

    it("test get([s])", function () {
        var presidents = new Collection(
            Data_Object.extend({
                'fields': [
                    ['name', 'indexed text(32)'],
                    ['party', 'indexed text(32)'],
                    ['y1', 'int'],
                    ['y2', 'int'],
                ],
            }),
            [
                { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
                { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
                { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' },
            ]
        );
        //
        assert.throws(function () { presidents.get("George Washington"); });
    });

    // -----------------------------------------------------
    //	has(obj_key)
    // -----------------------------------------------------

    it("test has(obj_key)", function () {
        //
        // works for native String collections only:
        //
        var collection = new Collection(String);
        //
        collection.push("1");
        collection.push("2");
        //
        test_utils.assertDeepEqual(collection.has("1"), true);
        test_utils.assertDeepEqual(collection.has("2"), true);
        test_utils.assertDeepEqual(collection.has("3"), false);
        //
        // non-String collection:
        //
        var presidents = new Collection(
            Data_Object.extend({
                'fields': [
                    ['name', 'indexed text(32)'],
                    ['party', 'indexed text(32)'],
                    ['y1', 'int'],
                    ['y2', 'int'],
                ],
            }),
            [
                { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
                { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
                { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' },
            ]
        );
        //
        test_utils.assertDeepEqual(presidents.has("1"), undefined);
        test_utils.assertDeepEqual(presidents.has("George Washington"), undefined);
    });

    // -----------------------------------------------------
    //	values() and value()
    // -----------------------------------------------------

    it("test values() and value()", function () {
        var collection = new Collection([1, 2, 3]);
        //
        test_utils.assertDeepEqual(collection.values(), [new Data_Value({ value: 1 }), new Data_Value({ value: 2 }), new Data_Value({ value: 3 })]);
        test_utils.assertDeepEqual(collection.value(), [1, 2, 3]);
    });

});

