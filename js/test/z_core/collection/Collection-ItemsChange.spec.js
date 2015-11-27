describe("z_core/collection/Collection-ItemsChange.spec.js ", function () {

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

    //#region Collection - ItemsChange

    // ======================================================
    //
    //	                Collection - ItemsChange
    //
    // ======================================================

    // -----------------------------------------------------
    //	clear()
    // -----------------------------------------------------

    it("clear() should clear the collection", function () {
        var collection = new Collection();
        //
        collection.set([1, "2"]);
        test_utils.assertDeepEqual(collection.values(), [new Data_Value({ value: 1 }), new Data_Value({ value: "2" })]);
        //
        collection.clear();
        test_utils.assertDeepEqual(collection.values(), []);
    });

    // -----------------------------------------------------
    //	clear(): event
    // -----------------------------------------------------

    it("clear() should raise change event", function () {
        var collection = new Collection();
        //
        var event_args = null;
        collection.on("change", function (args) { event_args = args; });
        //
        collection.clear();
        test_utils.assertDeepEqual(event_args, { type: "clear", target: collection });
    });

    // -----------------------------------------------------
    //	set(Data_Object)
    // -----------------------------------------------------

    it("set(Data_Object) should set data object as value", function () {
        var collection = new Collection();
        //
        var data_object = new Data_Object();
        data_object.set("Field1", 111);
        //
        collection.set(data_object);
        test_utils.assertDeepEqual(collection.stringify(), 'Collection(Data_Object({"Field1": 111}))');
    });

    // -----------------------------------------------------
    //	set(array)
    // -----------------------------------------------------

    it("set(array) should set values", function () {
        var collection = new Collection();
        collection.set([1, "2"]);
        test_utils.assertDeepEqual(collection.values(), [new Data_Value({ value: 1 }), new Data_Value({ value: "2" })]);
    });

    // -----------------------------------------------------
    //	set(Collection)
    // -----------------------------------------------------

    it("set(Collection) should throw an error", function () {
        var collection = new Collection();
        //
        var collection_value = new Collection();
        //
        assert.throws(function () { collection.set(collection_value); }, /stop/);
    });

    // -----------------------------------------------------
    //	set(other)
    // -----------------------------------------------------

    it("set(other) should do nothing", function () {
        var collection = new Collection();
        //
        collection.set({ "Field1": [111] });
        // most probably it calls Data_Object.set({"Field1": [111]}), then Collection.set("Field1", [111]), then Data_Object.set("Field1");
        // nothing is done as result
        //
        test_utils.assertDeepEqual(collection.values(), []);
        test_utils.assertDeepEqual(collection.get(), undefined);
        //test_utils.assertDeepEqual(collection.get("Field1"), [111]); // - does not works because of get() method error
        test_utils.assertDeepEqual(collection._, {});
    });

    // -----------------------------------------------------
    //	push(value) - 'object', _data_type_constraint
    // -----------------------------------------------------

    it("test push(value) - 'object', _data_type_constraint", function () {
        var President = Data_Object.extend({
            'fields': [
                ['name', 'indexed text(32)'],
                ['party', 'indexed text(32)'],
                ['y1', 'int'],
                ['y2', 'int'],
            ],
        });
        //
        var presidents = new Collection(
            President,
            [
                { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
                { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
                { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' },
            ]
        );
        //
        var value = presidents.push({ "name": "John Tyler", "y1": 1841, "y2": 1845, "party": "Whig" });
        test_utils.assertDeepEqual(stringify(value), 'Data_Object({"name": "John Tyler", "y1": 1841, "y2": 1845, "party": "Whig"})');
        test_utils.assertDeepEqual(stringify(presidents.values()[3]), 'Data_Object({"name": "John Tyler", "y1": 1841, "y2": 1845, "party": "Whig"})');
        test_utils.assertDeepEqual(presidents.values()[3], value);
    });

    // -----------------------------------------------------
    //	push(value) - 'object', _data_type_constraint, not Data_Object
    // -----------------------------------------------------

    it("test push(value) - 'object', _data_type_constraint, not Data_Object", function () {
        var collection = new Collection();
        //
        var Book = function (obj) { this.title = obj.bookTitle; this.objtype = "Book"; };
        //
        collection.constraint(Book);
        //
        //
        var value = collection.push({ bookTitle: "The Little Prince" });
        //
        // the value is converted into Book, but not added to the collection:
        //
        test_utils.assertDeepEqual(value, new Book({ bookTitle: "The Little Prince" }));
        test_utils.assertDeepEqual(stringify(collection), 'Collection()');
        test_utils.assertDeepEqual(collection.length(), 0);
    });

    // -----------------------------------------------------
    //	push(value) - 'object', _data_def_constraint
    // -----------------------------------------------------

    it("test push(value) - 'object', _data_def_constraint", function () {
        var collection = new Collection();
        collection.constraint({ name: "string", age: "number" });
        //
        assert.throws(function () { collection.push({ name: "John", age: "25" }); }, /Does not match data_def constraint/);
        assert.throws(function () { collection.push({ name: "John" }); }, /Does not match data_def constraint/);
        assert.throws(function () { collection.push({ name: null, age: "25" }); }, /Does not match data_def constraint/);
        //
        var value = collection.push({ name: "John", age: 25 });
        test_utils.assertDeepEqual(stringify(value), 'Data_Object({"name": "John", "age": 25})');
        test_utils.assertDeepEqual(stringify(collection), 'Collection(Data_Object({"name": "John", "age": 25}))');
        test_utils.assertDeepEqual(collection.values()[0], value);
    });

    // -----------------------------------------------------
    //	push(value) - 'object', no constraints
    // -----------------------------------------------------

    it("test push(value) - 'object', no constraints", function () {
        var collection = new Collection();
        //
        var value = collection.push({ name: "John", age: 25 });
        //
        test_utils.assertDeepEqual(stringify(value), 'Data_Object({"name": "John", "age": 25})');
        test_utils.assertDeepEqual(stringify(collection), 'Collection(Data_Object({"name": "John", "age": 25}))');
        test_utils.assertDeepEqual(collection.values()[0], value);
    });

    // -----------------------------------------------------
    //	push(value) - 'collection'
    // -----------------------------------------------------

    it("test push(value) - 'collection'", function () {
        var collection = new Collection();
        //
        var value_collection = new Collection([1, 2]);
        //
        var event_args = null;
        collection.on('change', function (e) { event_args = e; });
        //
        // without constraints:
        //
        var value = collection.push(value_collection);
        test_utils.assertDeepEqual(stringify(value), 'Collection(1, 2)');
        test_utils.assertDeepEqual(stringify(collection), 'Collection(Collection(1, 2))');
        test_utils.assertDeepEqual(collection.values()[0], value);
        test_utils.assertDeepEqual(event_args, { 'target': collection, 'item': value_collection, 'position': 0, 'type': 'insert' });
        //
        // passed constraint:
        //
        event_args = null;
        collection.constraint(new Collection());
        value = collection.push(value_collection);
        test_utils.assertDeepEqual(stringify(value), 'Collection(1, 2)');
        test_utils.assertDeepEqual(stringify(collection), 'Collection(Collection(1, 2), Collection(1, 2))');
        test_utils.assertDeepEqual(collection.values()[1], value);
        test_utils.assertDeepEqual(event_args, { 'target': collection, 'item': value_collection, 'position': 1, 'type': 'insert' });
        //
        // failed constraint:
        //
        collection.constraint(Number);
        assert.throws(function () { collection.push(value_collection); }, /Collection constraint\(s\) not satisfied/);
    });

    // -----------------------------------------------------
    //	push(value) - 'data_object'
    // -----------------------------------------------------

    it("test push(value) - 'data_object'", function () {
        var collection = new Collection();
        //
        var value_data_object = Data_Object.dobj({ "name": "John", "age": 25 });
        //
        var event_args = null;
        collection.on('change', function (e) { event_args = e; });
        //
        // without constraints:
        //
        var value = collection.push(value_data_object);
        test_utils.assertDeepEqual(stringify(value), 'Data_Object({"name": "John", "age": 25})');
        test_utils.assertDeepEqual(stringify(collection), 'Collection(Data_Object({"name": "John", "age": 25}))');
        test_utils.assertDeepEqual(collection.values()[0], value);
        test_utils.assertDeepEqual(event_args, { 'target': collection, 'item': value_data_object, 'position': 0, 'type': 'insert' });
        //
        // passed constraint:
        //
        event_args = null;
        collection.constraint(new Data_Object());
        value = collection.push(value_data_object);
        test_utils.assertDeepEqual(stringify(value), 'Data_Object({"name": "John", "age": 25})');
        test_utils.assertDeepEqual(stringify(collection), 'Collection(Data_Object({"name": "John", "age": 25}), Data_Object({"name": "John", "age": 25}))');
        test_utils.assertDeepEqual(collection.values()[1], value);
        test_utils.assertDeepEqual(event_args, { 'target': collection, 'item': value_data_object, 'position': 1, 'type': 'insert' });
        //
        // failed constraint:
        //
        collection.constraint(Number);
        assert.throws(function () { collection.push(value_data_object); }, /Collection constraint\(s\) not satisfied/);
    });

    // -----------------------------------------------------
    //	push(value) - 'control'
    // -----------------------------------------------------

    xit("test push(value) - 'control'", function () {
        // TODO...
    });

    // -----------------------------------------------------
    //	push(value) - 'array'
    // -----------------------------------------------------

    it("test push(value) - 'array'", function () {
        //
        // the only difference from the "push(value) - 'collection'" test
        // is the value passed to the push() method:
        // [1, 2] instead of new Collection([1, 2])
        //
        var collection = new Collection();
        //
        var value_array = [1, 2];
        //
        var event_args = null;
        collection.on('change', function (e) { event_args = e; });
        //
        // without constraints:
        //
        var value = collection.push(value_array);
        test_utils.assertDeepEqual(stringify(value), 'Collection(1, 2)');
        test_utils.assertDeepEqual(stringify(collection), 'Collection(Collection(1, 2))');
        test_utils.assertDeepEqual(collection.values()[0], value);
        test_utils.assertDeepEqual(event_args, { 'target': collection, 'item': value, 'position': 0, 'type': 'insert' });
        //
        // passed constraint:
        //
        event_args = null;
        collection.constraint(new Collection());
        value = collection.push(value_array);
        test_utils.assertDeepEqual(stringify(value), 'Collection(1, 2)');
        test_utils.assertDeepEqual(stringify(collection), 'Collection(Collection(1, 2), Collection(1, 2))');
        test_utils.assertDeepEqual(collection.values()[1], value);
        test_utils.assertDeepEqual(event_args, { 'target': collection, 'item': value, 'position': 1, 'type': 'insert' });

        // failed constraint:
        //
        collection.constraint(Number);
        assert.throws(function () { collection.push(value_array); }, /Collection constraint\(s\) not satisfied/);
    });

    // -----------------------------------------------------
    //	push(value) - 'string'
    // -----------------------------------------------------

    it("test push(value) - 'string'", function () {
        var collection = new Collection();
        //
        var value_string = "text";
        //
        var event_args = null;
        collection.on('change', function (e) { event_args = e; });
        //
        // without constraints:
        //
        var value = collection.push(value_string);
        test_utils.assertDeepEqual(value, "text");  // !!! instead of new Data_Value({ 'value': "text" })
        test_utils.assertDeepEqual(stringify(collection), 'Collection("text")');
        test_utils.assertDeepEqual(collection.values()[0], new Data_Value({ 'value': value }));
        test_utils.assertDeepEqual(event_args, { 'target': collection, 'item': new Data_Value({ 'value': value }), 'position': 0, 'type': 'insert' });
        //
        // passed constraint:
        //
        event_args = null;
        collection.constraint(String);
        value = collection.push(value_string);
        test_utils.assertDeepEqual(value, "text");  // !!! instead of new Data_Value({ 'value': "text" })
        test_utils.assertDeepEqual(stringify(collection), 'Collection("text", "text")');
        test_utils.assertDeepEqual(collection.values()[1], new Data_Value({ 'value': value }));
        test_utils.assertDeepEqual(event_args, { 'target': collection, 'item': new Data_Value({ 'value': value }), 'position': 1, 'type': 'insert' });
        //
        // failed constraint:
        //
        collection.constraint(Number);
        assert.throws(function () { collection.push(value_string); }, /wrong data type/);
    });

    // -----------------------------------------------------
    //	push(value) - 'number'
    // -----------------------------------------------------

    it("test push(value) - 'number'", function () {
        var collection = new Collection();
        //
        var value_number = 123;
        //
        var event_args = null;
        collection.on('change', function (e) { event_args = e; });
        //
        // without constraints:
        //
        var value = collection.push(value_number);
        test_utils.assertDeepEqual(value, 123);  // !!! instead of new Data_Value({ 'value': 123 })
        test_utils.assertDeepEqual(stringify(collection), 'Collection(123)');
        test_utils.assertDeepEqual(collection.values()[0], new Data_Value({ 'value': value }));
        test_utils.assertDeepEqual(event_args, { 'target': collection, 'item': new Data_Value({ 'value': value }), 'position': 0, 'type': 'insert' });
        //
        // passed constraint:
        //
        event_args = null;
        collection.constraint(Number);
        value = collection.push(value_number);
        test_utils.assertDeepEqual(value, 123);  // !!! instead of new Data_Value({ 'value': 123 })
        test_utils.assertDeepEqual(stringify(collection), 'Collection(123, 123)');
        test_utils.assertDeepEqual(collection.values()[1], new Data_Value({ 'value': value }));
        test_utils.assertDeepEqual(event_args, { 'target': collection, 'item': new Data_Value({ 'value': value }), 'position': 1, 'type': 'insert' });
        //
        // failed constraint:
        //
        collection.constraint(String);
        assert.throws(function () { collection.push(value_number); }, /wrong data type/);
    });

    // -----------------------------------------------------
    //	insert(item, pos)
    // -----------------------------------------------------

    it("test insert(item, pos)", function () {
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
                // { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
                { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' },
            ]
        );
        //
        var event_args = null;
        presidents.on("change", function (args) { event_args = args; });
        //
        presidents.insert({ 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' }, 1);
        //
        var item0 = presidents.get(0);
        test_utils.assertDeepEqual(stringify(item0), 'Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})');
        //
        var item1 = presidents.get(1);
        test_utils.assertDeepEqual(stringify(item1), '{"name": "John Adams", "y1": 1797, "y2": 1801, "party": "Federalist"}'); // without "Data_Object(...)" wrapping
        //
        test_utils.assertDeepEqual(event_args, { 'name': 'insert', 'item': { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' }, 'pos': 1, target: presidents });
    });

    // -----------------------------------------------------
    //	remove(pos)
    // -----------------------------------------------------

    it("test remove(pos)", function () {
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
        var event_args = null;
        presidents.on("remove", function (args) { event_args = args; });
        //
        assert.throws(function () { presidents.remove(0); });
        //
        //var item0 = presidents.get(0);
        //test_utils.assertDeepEqual(stringify(item0), 'Data_Object({"name": "John Adams", "y1": 1797, "y2": 1801, "party": "Federalist"})'); - ???
        //
        //test_utils.assertDeepEqual(event_args, { 'target': presidents, 'item': { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 }, 'position': 0 });
    });

    it("test remove(pos) - 2", function () {
        var collection = new Collection(String);
        //
        var event_args = null;
        collection.on("remove", function (args) { event_args = args; });
        //
        collection.push("1");
        collection.push("2");
        collection.push("3");
        //
        test_utils.assertDeepEqual(collection.values(), [new Data_Value({ value: "1" }), new Data_Value({ value: "2" }), new Data_Value({ value: "3" })]);
        //
        // remove(pos) works for the very last item only
        //
        // remove last:
        collection.remove(2);
        test_utils.assertDeepEqual(collection.values(), [new Data_Value({ value: "1" }), new Data_Value({ value: "2" })]);
        test_utils.assertDeepEqual(event_args, null); // event not raised properly
        //
        // remove not last:
        assert.throws(function () { collection.remove(0); });
    });

    it("test remove(key)", function () {
        var collection = new Collection(String);
        //
        var event_args = null;
        collection.on("remove", function (args) { event_args = args; });
        //
        collection.push("1");
        collection.push("2");
        //
        test_utils.assertDeepEqual(collection.values(), [new Data_Value({ value: "1" }), new Data_Value({ value: "2" })]);
        //
        // remove(key) removes very first item always
        //
        collection.remove("2");
        test_utils.assertDeepEqual(collection.values(), [new Data_Value({ value: "2" })]); // item "1" removed instead !!!
        test_utils.assertDeepEqual(event_args, null); // event not raised properly
    });

    // -----------------------------------------------------
    //	remove(key)
    // -----------------------------------------------------

    it("test remove(key) - 2", function () {
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
        var event_args = null;
        presidents.on("remove", function (args) { event_args = args; });
        //
        assert.throws(function () { presidents.remove('George Washington'); });
        //
        //var item0 = presidents.get(0);
        //test_utils.assertDeepEqual(stringify(item0), 'Data_Object({"name": "John Adams", "y1": 1797, "y2": 1801, "party": "Federalist"})'); - ???
        //
        //test_utils.assertDeepEqual(event_args, { 'target': presidents, 'item': { 'name': 'George Washington', 'y1': 1789, 'y2': 1797 }, 'position': 0 });
    });

    // -----------------------------------------------------
    //	load_array(arr)
    // -----------------------------------------------------

    it("test load_array(arr)", function () {
        var collection = new Collection();
        //
        collection.load_array([1, 2, 3]);
        //
        test_utils.assertDeepEqual(stringify(collection), 'Collection(1, 2, 3)');
        test_utils.assertDeepEqual(collection.values()[0], new Data_Value({ value: 1 }));
    });

    //#endregion

});

