
describe("z_core/collection/Collection-Constraints.spec.js ", function () {

    var jsgui;
    var Collection;
    var Data_Value;
    var Constraint;
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
        Constraint = require('../../../core/constraint');
        Data_Object = require('../../../core/data-object');
        assert = require('assert');
        test_utils = require('../../test-utils/test-utils');
        //
        stringify = jsgui.stringify;
    });

    //#region Collection - Constraints

    // ======================================================
    //
    //	                Collection - Constraints
    //
    // ======================================================

    // -----------------------------------------------------
    //	constraint()
    // -----------------------------------------------------

    it("test constraint()", function () {
        var collection = new Collection();
        //
        var expected = null;
        test_utils.assertDeepEqual(collection.constraint(), expected);
        //
        collection.constraint(Number);
        expected = {
            data_type: new Constraint.Collection_Data_Type(Number)
        };
        test_utils.assertDeepEqual(collection.constraint(), expected);
        //
        collection.constraint({ Field1: "int", Field2: "text" });
        expected = {
            data_type: new Constraint.Collection_Data_Type(Number),
            data_def: new Constraint.Collection_Data_Def({ Field1: "int", Field2: "text" })
        };
        test_utils.assertDeepEqual(collection.constraint(), expected);
        //
        collection.constraint(new Data_Object());
        expected = {
            data_type: new Constraint.Collection_Data_Type(Number),
            data_def: new Constraint.Collection_Data_Def({ Field1: "int", Field2: "text" }),
            data_object: Constraint.from_obj(new Data_Object())
        };
        test_utils.assertDeepEqual(collection.constraint(), expected);
    });

    it("test constraint([o])", function () {
        var collection = new Collection();
        //
        test_utils.assertDeepEqual(collection.constraint(), null);
        //
        collection.constraint({ Field1: "int", Field2: "text" });
        test_utils.assertDeepEqual(collection.constraint(), { data_def: new Constraint.Collection_Data_Def({ Field1: "int", Field2: "text" }) });
    });

    it("test constraint([f])", function () {
        var collection = new Collection();
        //
        test_utils.assertDeepEqual(collection.constraint(), null);
        //
        collection.constraint(Number);
        test_utils.assertDeepEqual(collection.constraint(), { data_type: new Constraint.Collection_Data_Type(Number) });
        //
        collection.constraint(String);
        test_utils.assertDeepEqual(collection.constraint(), { data_type: new Constraint.Collection_Data_Type(String) });
        //
        collection.constraint(Date);
        test_utils.assertDeepEqual(collection.constraint(), { data_type: new Constraint.Collection_Data_Type(Date) });
    });

    it("test constraint([D])", function () {
        var collection = new Collection();
        //
        test_utils.assertDeepEqual(collection.constraint(), null);
        //
        collection.constraint(new Data_Object());
        test_utils.assertDeepEqual(collection.constraint(), { data_object: Constraint.from_obj(new Data_Object()) });
    });

    it("test constraint([[s,s]])", function () {
        var collection = new Collection();
        //
        test_utils.assertDeepEqual(collection.constraint(), null);
        //
        // the "[[s,s]]" branch does not work:
        collection.constraint(["unique", "Field1"]);
        test_utils.assertDeepEqual(collection._unique_constraints, undefined);
    });

    // -----------------------------------------------------
    //	get_data_type_constraint()
    // -----------------------------------------------------

    it("test get_data_type_constraint()", function () {
        var collection = new Collection();
        //
        test_utils.assertDeepEqual(collection.get_data_type_constraint(), undefined);
        //
        collection.constraint(Number);
        test_utils.assertDeepEqual(collection.get_data_type_constraint(), new Constraint.Collection_Data_Type(Number));
    });

    // -----------------------------------------------------
    //	unique(...), get_unique_constraint(fields)
    // -----------------------------------------------------

    it("test unique(...), get_unique_constraint(fields)", function () {
        var collection = new Collection();
        //
        collection.unique(["Field1"]);
        test_utils.assertDeepEqual(collection._unique_constraints, [new Constraint.Unique({ 'fields': ["Field1"] })]);
        //
        // always undefined (tries to return from nested function in each()):
        test_utils.assertDeepEqual(collection.get_unique_constraint(["Field1"]), undefined);
        //
        //
        collection.unique("Field2");
        test_utils.assertDeepEqual(collection._unique_constraints, [new Constraint.Unique({ 'fields': ["Field1"] }), new Constraint.Unique({ 'fields': ["Field2"] })]);
        test_utils.assertDeepEqual(collection.get_unique_constraint("Field2"), undefined);
    });

    // -----------------------------------------------------
    //	find_unique_constraint(field)
    // -----------------------------------------------------

    it("test find_unique_constraint(field)", function () {
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
        presidents.unique("name");
        test_utils.assertDeepEqual(presidents._unique_constraints[0].fields, ["name"]);
        //
        // find_unique_constraint() tries to compare ["name"] and "name", returns null:
        test_utils.assertDeepEqual(presidents.find_unique_constraint("name"), null);
    });

    // -----------------------------------------------------
    //	test_object_against_constraints(obj) - _type_constructor
    // -----------------------------------------------------

    it("test test_object_against_constraints(obj) - _type_constructor", function () {
        //
        var Book = function () { }
        Book.abstract = true;
        //
        var collection = new Collection(Book);
        //
        test_utils.assertDeepEqual(collection._type_constructor, Book);
        test_utils.assertDeepEqual(collection.test_object_against_constraints(new Book()), true);
        test_utils.assertDeepEqual(collection.test_object_against_constraints(new Date()), false);
        test_utils.assertDeepEqual(collection.test_object_against_constraints(123), false);
    });

    // -----------------------------------------------------
    //	test_object_against_constraints(obj) - _data_def_constraint
    // -----------------------------------------------------

    it("test test_object_against_constraints(obj) - _data_def_constraint", function () {
        var collection = null;
        //
        collection = new Collection();
        //
        // data_def constrains not checks:
        collection.constraint({ Field1: "number", Field2: "text" });
        test_utils.assertDeepEqual(collection.test_object_against_constraints({ Field1: 1, Field2: "2" }), true);
        test_utils.assertDeepEqual(collection.test_object_against_constraints({ Field1: "1", Field2: 2 }), true);
        //
    });

    // -----------------------------------------------------
    //	test_object_against_constraints(obj) - _data_object_constraint
    // -----------------------------------------------------

    it("test test_object_against_constraints(obj) - _data_object_constraint", function () {
        var collection = new Collection();
        //
        collection.constraint(new Data_Object());
        //
        test_utils.assertDeepEqual(collection.test_object_against_constraints(new Data_Object()), true);
        test_utils.assertDeepEqual(collection.test_object_against_constraints({ Field1: "1", Field2: 2 }), false);
        test_utils.assertDeepEqual(collection.test_object_against_constraints(new Data_Value()), false);
        test_utils.assertDeepEqual(collection.test_object_against_constraints("text"), false);
    });

    // -----------------------------------------------------
    //	test_object_against_constraints(obj) - _data_type_constraint
    // -----------------------------------------------------

    it("test test_object_against_constraints(obj) - _data_type_constraint", function () {
        var collection = new Collection();
        //
        collection.constraint(Number);
        //
        test_utils.assertDeepEqual(collection.test_object_against_constraints(100), true);
        test_utils.assertDeepEqual(collection.test_object_against_constraints(new Data_Object()), false);
        test_utils.assertDeepEqual(collection.test_object_against_constraints({ Field1: "1", Field2: 2 }), false);
        test_utils.assertDeepEqual(collection.test_object_against_constraints(new Data_Value()), false);
        test_utils.assertDeepEqual(collection.test_object_against_constraints("text"), false);
    });

    // -----------------------------------------------------
    //	test_object_against_constraints(obj) - _unique_constraints
    // -----------------------------------------------------

    it("test test_object_against_constraints(obj) - _unique_constraints", function () {
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
        presidents.unique("name");
        //
        var GeorgeWashington = new President({ 'name': 'George Washington', 'y1': 1789, 'y2': 1797 });
        var JohnTyler = new President({ 'name': 'John Tyler', 'y1': 1841, 'y2': 1845, 'party': 'Whig' });
        //
        test_utils.assertDeepEqual(presidents.test_object_against_constraints(GeorgeWashington), false);
        test_utils.assertDeepEqual(presidents.test_object_against_constraints(JohnTyler), true);
    });

    // -----------------------------------------------------
    //	test_object_against_constraints(obj) - all
    // -----------------------------------------------------

    it("test test_object_against_constraints(obj) - all", function () {
        var collection = null;
        //
        // _type_constructor:
        //
        var Book = function () { }
        Book.abstract = true;
        //
        collection = new Collection(Book);
        //
        test_utils.assertDeepEqual(collection._type_constructor, Book);
        test_utils.assertDeepEqual(collection.test_object_against_constraints(new Book()), true);
        test_utils.assertDeepEqual(collection.test_object_against_constraints(new Date()), false);
        test_utils.assertDeepEqual(collection.test_object_against_constraints(123), false);
        //
        // _data_def_constraint:
        //
        collection = new Collection();
        //
        // data_def constrains not checks:
        collection.constraint({ Field1: "number", Field2: "text" });
        //
        test_utils.assertDeepEqual(collection.test_object_against_constraints({ Field1: 1, Field2: "2" }), true);
        test_utils.assertDeepEqual(collection.test_object_against_constraints({ Field1: "1", Field2: 2 }), true);
        //
        // _data_object_constraint:
        // 
        collection = new Collection();
        //
        collection.constraint(new Data_Object());
        //
        test_utils.assertDeepEqual(collection.test_object_against_constraints(new Data_Object()), true);
        test_utils.assertDeepEqual(collection.test_object_against_constraints({ Field1: "1", Field2: 2 }), false);
        test_utils.assertDeepEqual(collection.test_object_against_constraints(new Data_Value()), false);
        test_utils.assertDeepEqual(collection.test_object_against_constraints("text"), false);
        //
        // _data_type_constraint:
        //
        collection = new Collection();
        //
        collection.constraint(Number);
        //
        test_utils.assertDeepEqual(collection.test_object_against_constraints(100), true);
        test_utils.assertDeepEqual(collection.test_object_against_constraints(new Data_Object()), false);
        test_utils.assertDeepEqual(collection.test_object_against_constraints({ Field1: "1", Field2: 2 }), false);
        test_utils.assertDeepEqual(collection.test_object_against_constraints(new Data_Value()), false);
        test_utils.assertDeepEqual(collection.test_object_against_constraints("text"), false);
        //
        // unique constraint:
        //
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
        presidents.unique("name");
        //
        var GeorgeWashington = new President({ 'name': 'George Washington', 'y1': 1789, 'y2': 1797 });
        var JohnTyler = new President({ 'name': 'John Tyler', 'y1': 1841, 'y2': 1845, 'party': 'Whig' });
        //
        test_utils.assertDeepEqual(presidents.test_object_against_constraints(GeorgeWashington), false);
        test_utils.assertDeepEqual(presidents.test_object_against_constraints(JohnTyler), true);
    });


});

