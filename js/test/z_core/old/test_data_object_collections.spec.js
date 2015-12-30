
describe("z_core /test_data_object_collections.spec.js ", function () {

    var jsgui;
    var assert;
    var Data_Structures;
    var test_utils;

    var Collection;
    var Data_Value;
    var stringify;
    var Data_Object;
    var tof;
    var mapify;
    var Sorted_KVS;
    var each;

    before(function () {
        jsgui = require('../../../core/jsgui-lang-util');
        assert = require('assert');
        Data_Structures = require('../../../core/jsgui-data-structures');
        test_utils = require('../../test-utils/test-utils');
        //
        Collection = jsgui.Collection;
        Data_Value = jsgui.Data_Value;
        stringify = jsgui.stringify;
        Data_Object = jsgui.Data_Object;
        tof = jsgui.tof;
        mapify = jsgui.mapify;
        Sorted_KVS = Data_Structures.Sorted_KVS;
        each = jsgui.each;
        //
        prepare();
    });


    var get_arr_presidents;
    var get_ksvs_presidents;
    var President;
    var get_coll_presidents;
    var get_mini_coll_presidents;
    var old_get_coll_presidents;

    function prepare() {

        get_arr_presidents = function () {
            return [{ 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
                    { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
                    { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' },
                    { 'name': 'James Madison', 'y1': 1809, 'y2': 1817, 'party': 'Democratic-Republican' },
                    { 'name': 'James Monroe', 'y1': 1817, 'y2': 1825, 'party': 'Democratic-Republican' },
                    { 'name': 'John Quincy Adams', 'y1': 1825, 'y2': 1829, 'party': 'Democratic-Republican' },
                    { 'name': 'Andrew Jackson', 'y1': 1829, 'y2': 1837, 'party': 'Democratic' },
                    { 'name': 'Martin Van Buren', 'y1': 1837, 'y2': 1841, 'party': 'Democratic' },
                    { 'name': 'William Henry Harrison', 'y1': 1841, 'y2': 1841, 'party': 'Whig' },
                    { 'name': 'John Tyler', 'y1': 1841, 'y2': 1845, 'party': 'Whig' },
                    { 'name': 'James K. Polk', 'y1': 1845, 'y2': 1849, 'party': 'Democratic' },
                    { 'name': 'Zachary Taylor', 'y1': 1849, 'y2': 1850, 'party': 'Whig' },
                    { 'name': 'Millard Fillmore', 'y1': 1850, 'y2': 1853, 'party': 'Whig' },
                    { 'name': 'Franklin Pierce', 'y1': 1853, 'y2': 1857, 'party': 'Democratic' },
                    //{'name': 'Franklin Pierce', 'y1': 1853, 'y2': 1857, 'party': 'Republican'},
                    { 'name': 'James Buchanan', 'y1': 1857, 'y2': 1861, 'party': 'Democratic' },
                    { 'name': 'Abraham Lincoln', 'y1': 1861, 'y2': 1865, 'party': 'Republican' },
                    { 'name': 'Andrew Johnson', 'y1': 1865, 'y2': 1869, 'party': 'Democratic' },
                    { 'name': 'Ulysses S. Grant', 'y1': 1869, 'y2': 1877, 'party': 'Republican' },
                    { 'name': 'Rutherford B. Hayes', 'y1': 1877, 'y2': 1881, 'party': 'Republican' },
                    { 'name': 'James A. Garfield', 'y1': 1881, 'y2': 1881, 'party': 'Republican' },
                    { 'name': 'Chester A. Arthur', 'y1': 1881, 'y2': 1885, 'party': 'Republican' },
                    { 'name': 'Grover Cleveland', 'y1': 1885, 'y2': 1889, 'party': 'Democratic' }
            ];
        };

        get_ksvs_presidents = function () {
            var arr_presidents = get_arr_presidents();
            var ksvs = new Sorted_KVS();
            each(arr_presidents, function (i, v) {
                ksvs.put(v.name, v);
            })
            return ksvs;
        };

        President = Data_Object.extend({
            'fields': [
                ['name', 'indexed text(32)'],
                ['party', 'indexed text(32)'],
                ['y1', 'int'],
                ['y2', 'int']
            ],

            // connect_fields was connect
            'connect_fields': true
        });

        get_coll_presidents = function () {
            var coll_presidents = new jsgui.Collection(President, get_arr_presidents());
            return coll_presidents;
        };

        get_mini_coll_presidents = function () {
            var coll_presidents = new jsgui.Collection(President, get_arr_presidents().slice(0, 2));
            return coll_presidents;
        };

        old_get_coll_presidents = function () {
            var coll_presidents = new jsgui.Collection({
                'fields': [
                    ['name', 'indexed text(32)'],
                    ['party', 'indexed text(32)'],
                    ['y1', 'int'],
                    ['y2', 'int']
                ],
                'items': get_arr_presidents()
            });
            //
            return coll_presidents;
        };

    }



    //var jsgui = require('../../../core/jsgui-lang-util');
    //jsgui.__data_id_method = 'init';

    //var Data_Structures = require('../../../core/jsgui-data-structures');
    //var test_utils = require('../../test-utils/test-utils');
    //var assert = require('assert');

    //assert.equal(jsgui.__data_id_method, 'init');

    //after(function () {
    //    // runs after all tests in this block
    //    assert.equal(jsgui.__data_id_method, 'init');
    //});


    //var j = jsgui;

    //var stringify = jsgui.stringify, Collection = jsgui.Collection, Data_Object = jsgui.Data_Object;
    //var mapify = jsgui.mapify, is_defined = jsgui.is_defined;

    //var each = jsgui.each, tof = jsgui.tof;
    //var iterate_ancestor_classes = j.iterate_ancestor_classes;
    //var Sorted_KVS = Data_Structures.Sorted_KVS;



    // -----------------------------------------------------
    //	test_presidents_ksvs
    // -----------------------------------------------------

    it("test_presidents_ksvs", function () {
        var ksvs = get_ksvs_presidents();

        assert.equal(ksvs.key_count(), 22);

        var tree = ksvs.tree;
        assert.equal(tree.toString(), '[object Object]');

        //var tree_first = tree.firstLeaf;
        //console.log('tree_first ' + stringify(tree_first)); // - too long
        //for (x in tree_first) {
        //    console.log(x);
        //}
        //console.log(tree_first.keys);

        var keys = ksvs.keys();
        //console.log('keys ' + stringify(keys));
        assert.equal(stringify(keys), '["Abraham Lincoln", "Andrew Jackson", "Andrew Johnson", "Chester A. Arthur", "Franklin Pierce", "George Washington", "Grover Cleveland", "James A. Garfield", "James Buchanan", "James K. Polk", "James Madison", "James Monroe", "John Adams", "John Quincy Adams", "John Tyler", "Martin Van Buren", "Millard Fillmore", "Rutherford B. Hayes", "Thomas Jefferson", "Ulysses S. Grant", "William Henry Harrison", "Zachary Taylor"]');

        //get_keys_by_prefix			
        //var arr_james = ksvs.get_by_prefix('James');
        var arr_james = ksvs.get_keys_by_prefix('James');
        //console.log('arr_james ' + stringify(arr_james));
        assert.equal(stringify(arr_james), '["James A. Garfield", "James Buchanan", "James K. Polk", "James Madison", "James Monroe"]');
    });

    // -----------------------------------------------------
    //	test_coll_presidents
    // -----------------------------------------------------

    it("test_coll_presidents", function () {
        var coll_presidents = get_coll_presidents();
        var cp_dtc = coll_presidents._data_type_constraint;
        assert.equal(stringify(cp_dtc), '{"_super": undefined, "__data_type": "collection_constraint", "_constraint_type": "data_type"}');
        //
        var estimated_cp_indexes_0 = {
            _super: undefined,
            fields: ["name"],
            alphabetic_fields: ["name"],
            __type: "collection_index",
            index_type: "sorted"
        };
        var estimated_cp_indexes_1 = {
            _super: undefined,
            fields: ["party"],
            alphabetic_fields: ["party"],
            __type: "collection_index",
            index_type: "sorted"
        };
        //
        var cp_indexes = coll_presidents.indexes();
        assert.equal(cp_indexes.length, 2);
        test_utils.assertListedProps(cp_indexes[0], estimated_cp_indexes_0);
        test_utils.assertListedProps(cp_indexes[1], estimated_cp_indexes_1);
    });

    // -----------------------------------------------------
    //	test_mini_coll_presidents
    // -----------------------------------------------------

    it("test_mini_coll_presidents", function () {
        var mini_coll_presidents = get_mini_coll_presidents();
        //
        var cp_indexes = mini_coll_presidents.indexes();
        var estimated_cp_indexes_0 = {
            _super: undefined,
            fields: ["name"],
            alphabetic_fields: ["name"],
            __type: "collection_index",
            index_type: "sorted"
        };
        var estimated_cp_indexes_1 = {
            _super: undefined,
            fields: ["party"],
            alphabetic_fields: ["party"],
            __type: "collection_index",
            index_type: "sorted"
        };
        //
        assert.equal(cp_indexes.length, 2);
        test_utils.assertListedProps(cp_indexes[0], estimated_cp_indexes_0);
        test_utils.assertListedProps(cp_indexes[1], estimated_cp_indexes_1);
    });

    // -----------------------------------------------------
    //	test_get_by_name
    // -----------------------------------------------------

    it("test_get_by_name", function () {
        var coll_presidents = get_coll_presidents();
        var arr_george_washington = coll_presidents.find('name', 'George Washington');
        assert.equal(stringify(arr_george_washington), '[Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})]');
    });

    // -----------------------------------------------------
    //	test_2_field_index
    // -----------------------------------------------------

    it("test_2_field_index", function () {
        var coll_presidents = get_coll_presidents();

        // 1 index with 2 fields
        coll_presidents.index([['name', 'party']]);

        // can try to add another value...			
        coll_presidents.push({ 'name': 'Franklin Pierce', 'y1': 1853, 'y2': 1857, 'party': 'Republican' });

        // can iterate through the index
        //  there should be three indexes in the system after this one has been made.

        var found = coll_presidents.find([['name', 'Franklin Pierce'], ['party', 'Republican']]);
        assert.equal(stringify(found), '[Data_Object({"name": "Franklin Pierce", "y1": 1853, "y2": 1857, "party": "Republican"})]');
    });

    // -----------------------------------------------------
    //	test_2_field_unique_constraint
    // -----------------------------------------------------

    it("test_2_field_unique_constraint", function () {
        var coll_presidents = get_coll_presidents();
        coll_presidents.unique(['name', 'party']);
        //
        assert.throws(function () {
            coll_presidents.push({ 'name': 'Franklin Pierce', 'y1': 1853, 'y2': 1857, 'party': 'Democratic' });
        }, /Collection constraint\(s\) not satisfied/);
    });

    // -----------------------------------------------------
    //	test_unique_index_constraint
    // -----------------------------------------------------

    it("test_unique_index_constraint", function () {
        var coll_books = new jsgui.Collection([
            { 'name': 'JavaScript: The Good Parts', 'author': 'Douglas Crockford', 'isbn-13': '978-0596517748' }
        ]);
        coll_books.unique('isbn-13');
        //
        assert.throws(function () {
            coll_books.push({ 'name': 'JavaScript: The Bad Parts', 'author': 'Buggy Crockford', 'isbn-13': '978-0596517748' });
        }, /Collection constraint\(s\) not satisfied/);
        //
        // different isbn-13:
        coll_books.push({ 'name': 'JavaScript: The Bad Parts', 'author': 'Buggy Crockford', 'isbn-13': '978-0596517749' });
        assert.equal(coll_books.values().length, 2);
    });

    // -----------------------------------------------------
    //	test_president_class
    // -----------------------------------------------------

    it("test_president_class", function () {
        var President = Data_Object.extend({
            'fields': [
                ['name', 'indexed text(32)'],
                ['party', 'indexed text(32)'],
                ['y1', 'int'],
                ['y2', 'int']
            ],
            'connect_fields': true
        });
        var Country_President = President.extend({
            'fields': {
                'country': 'indexed text(32)'
            }
        });
        var Motorist_Country_President = Country_President.extend({
            'fields': {
                'car': 'indexed text(32)'
            }
        });
        //
        var pres_jackson = new Motorist_Country_President({ 'name': 'Andrew Jackson', 'y1': 1829, 'y2': 1837, 'party': 'Democratic' });
        //
        test_utils.assertDeepEqual(Data_Object.get_chained_fields(Motorist_Country_President), [
            [0, ["name", "indexed text(32)"]],
            [1, ["party", "indexed text(32)"]],
            [2, ["y1", "int"]],
            [3, ["y2", "int"]],
            [1, ["country", "indexed text(32)"]],
            [1, ["car", "indexed text(32)"]]
        ]);
        //
        test_utils.assertDeepEqual(Data_Object.get_chained_fields(pres_jackson.constructor), [
            [0, ["name", "indexed text(32)"]],
            [1, ["party", "indexed text(32)"]],
            [2, ["y1", "int"]],
            [3, ["y2", "int"]],
            [1, ["country", "indexed text(32)"]],
            [1, ["car", "indexed text(32)"]]
        ]);
        //
        test_utils.assertDeepEqual(pres_jackson.field(), [
            ["name", "indexed text(32)", { "data_type": ["text", 32], "indexed": true }],
            ["party", "indexed text(32)", { "data_type": ["text", 32], "indexed": true }],
            ["y1", "int", { "data_type": "int" }],
            ["y2", "int", { "data_type": "int" }],
            ["country", "indexed text(32)", { "data_type": ["text", 32], "indexed": true }],
            ["car", "indexed text(32)", { "data_type": ["text", 32], "indexed": true }]
        ]);
        //
        test_utils.assertDeepEqual(mapify(pres_jackson.field()), {
            "name": "indexed text(32)",
            "party": "indexed text(32)",
            "y1": "int",
            "y2": "int",
            "country": "indexed text(32)",
            "car": "indexed text(32)"
        });
        //
        //test_utils.assertDeepEqual(pres_jackson.get(), { "name": "Andrew Jackson", "y1": 1829, "y2": 1837, "party": "Democratic" });
        //
        var value_name = new Data_Value({ value: "Andrew Jackson" }); value_name.__type_name = "indexed text(32)";
        var value_y1 = new Data_Value({ value: 1829 }); value_y1.__type_name = "int";
        var value_y2 = new Data_Value({ value: 1837 }); value_y2.__type_name = "int";
        var value_party = new Data_Value({ value: "Democratic" }); value_party.__type_name = "indexed text(32)";
        //
        test_utils.assertDeepEqual(pres_jackson.get(), {
            "name": value_name,
            "y1": value_y1,
            "y2": value_y2,
            "party": value_party
        });
        //
        pres_jackson.party('Totalitarian');
        //test_utils.assertDeepEqual(pres_jackson.get(), { "name": "Andrew Jackson", "y1": 1829, "y2": 1837, "party": "Totalitarian" });
        //
        value_party = new Data_Value({ value: "Totalitarian" }); value_party.__type_name = "indexed text(32)";
        //
        test_utils.assertDeepEqual(pres_jackson.get(), {
            "name": value_name,
            "y1": value_y1,
            "y2": value_y2,
            "party": value_party
        });

    });

    // -----------------------------------------------------
    //	test_collection_type_constraint
    // -----------------------------------------------------

    it("test_collection_type_constraint", function () {
        var coll_presidents = get_coll_presidents();
        // 
        var President = Data_Object.extend({
            'fields': {
                'name': 'indexed text(32)',
                'party': 'indexed text(32)',
                'y1': 'int',
                'y2': 'int'
            },
            'connect': true
        });

        assert.equal(tof(President), 'function');
        assert.equal(jsgui.is_constructor_fn(President), true);

        coll_presidents.constraint(President);

        var Tower = function () {
            //this.name = 'Elizabeth Tower';
        }

        var e_tower = new Tower();

        // must throw an exception:
        //assert.throws(function () { coll_presidents.push(e_tower); });
        coll_presidents.push(e_tower); // - not thrown !!!
    });

    // -----------------------------------------------------
    //	test_collection_with_name_property
    // -----------------------------------------------------
    //
    // It seems intended to get/set values just like data_object does.
    // Now collection get/set methods has anpther meaning
    //
    //it("test_collection_with_name_property", function () {
    //    var coll_presidents = get_coll_presidents();
    //    coll_presidents.set('name', 'Presidents');
    //    //
    //    var name = coll_presidents.get('name');
    //    console.log('name ' + name);
    //});

    // -----------------------------------------------------
    //	test_data_object_read_only_field
    // -----------------------------------------------------

    it("test_data_object_read_only_field", function () {
        var President = Data_Object.extend({
            'fields': {
                'name': 'indexed text(32)',
                'party': 'readonly indexed text(32)',
                'y1': 'int',
                'y2': 'int'
            },
            'connect_fields': true
        });
        var pres_jackson = new President({ 'name': 'Andrew Jackson', 'y1': 1829, 'y2': 1837, 'party': 'Democratic' });
        //
        // must throw an error:
        //assert.throws(function () { pres_jackson.party('Totalitarian'); }); // !!! no error
        pres_jackson.party('Totalitarian');  // !!! no error
        //		
        test_utils.assertDeepEqual(pres_jackson.field(), [
            ["name", "indexed text(32)", { "data_type": ["text", 32], "indexed": true }],
            ["party", "readonly indexed text(32)", { "data_type": ["text", 32], "read_only": true, "indexed": true }],
            ["y1", "int", { "data_type": "int" }],
            ["y2", "int", { "data_type": "int" }]
        ]);

    });

    // -----------------------------------------------------
    //	test_collection_as_field
    // -----------------------------------------------------
    //
    //it("test_collection_as_field", function() {
    //    // May want to have a field in a data_object specified to be a collection.
    //    //
    //    // That collection could have its constraint about what goes in there.
    //    //  what type of object, with data_type_constraint.
    //});

    // -----------------------------------------------------
    //	test_collection_general_event_response_to_data_object_change
    // -----------------------------------------------------

    it("test_collection_general_event_response_to_data_object_change", function () {
        var coll_presidents = get_coll_presidents();
        //
        var event_args = {};
        coll_presidents.add_event_listener(function (target, event_name, event_params) {
            event_args.target = target;
            event_args.event_name = event_name;
            event_args.event_params = event_params;
        });
        //
        //
        // then we want to get the George Washington record
        //
        var george_washington = coll_presidents.find({ 'name': 'George Washington' })[0];
        assert.equal(stringify(george_washington), 'Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})');
        assert.equal(george_washington.position_within(coll_presidents), undefined); // !!!
        //
        //
        //  Change his name to George Wellington
        //
        george_washington.set('name', 'George Wellington');
        assert.equal(george_washington.get('name'), 'George Wellington');
        //
        // an event is not raised:
        assert.deepEqual(event_args, {}); // !!!
        //
        // the index is not updated:
        var george_washington2 = coll_presidents.find({ 'name': 'George Washington' })[0];
        assert.equal(stringify(george_washington2), 'Data_Object({"name": "George Wellington", "y1": 1789, "y2": 1797, "party": undefined})');
        //
        var george_wellington = coll_presidents.find({ 'name': 'George Wellington' });
        assert.equal(stringify(george_wellington), '[]');
        //
        // Franklin Pierce: find and remove
        //
        var franklin_pierce = coll_presidents.find({ 'name': 'Franklin Pierce' })[0];     // coll_presidents.get('Franklin Pierce')[0][1];
        assert.equal(stringify(franklin_pierce), 'Data_Object({"name": "Franklin Pierce", "y1": 1853, "y2": 1857, "party": "Democratic"})');
        assert.equal(franklin_pierce.position_within(coll_presidents), undefined);
        //
        assert.deepEqual(event_args, {});
        //
        //
        // then when removing an item from the collection, will need to adjust other items in the collection.
        //
        assert.deepEqual(coll_presidents.length(), 22);
        //
        franklin_pierce.remove_from(coll_presidents);
        // needs to remove it from the indexes as well.
        // removing should raise an event too.
        //
        // an event is not raised:
        assert.deepEqual(event_args, {});  // !!!
        //
        // the record is not removed: (!!!)
        assert.deepEqual(coll_presidents.length(), 22); // !!! instead of 21
        franklin_pierce = coll_presidents.find({ 'name': 'Franklin Pierce' })[0];
        assert.equal(stringify(franklin_pierce), 'Data_Object({"name": "Franklin Pierce", "y1": 1853, "y2": 1857, "party": "Democratic"})');
        //
        // indexes:
        //
        var indexes_info = [];
        //
        coll_presidents.index_system.iterate_indexes(function (index) {
            indexes_info.push({ index_type: index.index_type, fields: index.fields });
        });
        assert.deepEqual(indexes_info, [{ index_type: "sorted", fields: ["name"] }, { index_type: "sorted", fields: ["party"] }]);
        //
        // can we search for an index?
        //	    
        // get_index() not work: (!!!)
        //var idx_name = coll_presidents.get_index('name');
        assert.throws(function () { coll_presidents.get_index('name'); });
        //
        // use indexes() instead of get_index():
        var idx_name = coll_presidents.indexes()[0];
        assert.deepEqual(idx_name.fields, ["name"]);
        //
        // also want to iterate through the items.
        //
        var idx_name_items = [];
        //
        coll_presidents.each(idx_name, function (i, v) {
            idx_name_items.push({ key: i, value: v });
            assert.equal(tof(v), "data_object");
        });
        // the items are sorted:
        assert.equal(idx_name_items.length, 22); // !!! instead of 21
        assert.equal(idx_name_items[0].key, "Abraham Lincoln");
        assert.equal(idx_name_items[1].key, "Andrew Jackson");
        assert.equal(idx_name_items[2].key, "Andrew Johnson");
        //
        // "Franklin Pierce" is not removed: (!!!)
        assert.equal(idx_name_items[4].key, "Franklin Pierce");
        //
        // "George Washington" is not updated: (!!!)
        assert.equal(idx_name_items[5].key, "George Washington");
        assert.equal(stringify(idx_name_items[5].value), 'Data_Object({"name": "George Wellington", "y1": 1789, "y2": 1797, "party": undefined})');

    });


    // -----------------------------------------------------
    //	test_parents_and_relationships
    // -----------------------------------------------------

    it("test_parents_and_relationships", function () {
        var coll_business_sectors = new Collection({});
        coll_business_sectors.push({
            'name': 'Agriculture'
        });
        coll_business_sectors.push({
            'name': 'Technology'
        });
        coll_business_sectors.push({
            'name': 'Energy'
        });
        //
        var item0 = coll_business_sectors.values()[0];
        assert.equal(stringify(item0), 'Data_Object({"name": "Agriculture"})');
        assert.equal(item0.parent(), coll_business_sectors);
        assert.equal(item0.position_within(coll_business_sectors), undefined); // !!!
    });

    // -----------------------------------------------------
    //	test_abstract_string_collection
    // -----------------------------------------------------

    it("test_abstract_string_collection", function () {
        assert.equal(String.abstract, undefined);
        //
        var abs_str_coll = Collection(String);
        assert.equal(stringify(abs_str_coll), '~Collection(String)');
        //
        // side effect:
        assert.equal(String.abstract, true);
        delete String.abstract;
        assert.equal(String.abstract, undefined);
    });

});
	
