
describe("z_core/collection/Collection-Indexes.spec.js ", function () {

    var jsgui;
    var Collection;
    var Data_Value;
    var Constraint;
    var Data_Object;
    var Collection_Index;
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
        Collection_Index = require('../../../core/collection-index');
        assert = require('assert');
        test_utils = require('../../test-utils/test-utils');
        //
        stringify = jsgui.stringify;
    });

    //#region Collection - Indexes

    // ======================================================
    //
    //	                Collection - Indexes
    //
    // ======================================================

    // -----------------------------------------------------
    //	indexes()
    // -----------------------------------------------------

    it("test indexes()", function () {
        var collection = new Collection();
        //
        collection.index_by(["Field1"]);
        //
        test_utils.assertDeepEqual(collection.indexes(), [new Collection_Index.Sorted({ 'fields': ["Field1"] })]);
    });

    // -----------------------------------------------------
    //	index_by([a])
    // -----------------------------------------------------

    it("test index_by([a]) - array of string", function () {
        var collection = new Collection();
        //
        // create an estimated index clone:
        var estimated_index = new Collection_Index.Sorted({ 'fields': ["Field1", "Field2"] });
        //
        // create an index:
        var index = collection.index_by(["Field1", "Field2"]);
        //
        test_utils.assertDeepEqual(collection.index_system.index_map, { "Field1,Field2": { indexes_by_type: { sorted: estimated_index } } });
        //
        test_utils.assertDeepEqual(index, estimated_index);
        assert(index !== estimated_index);
        //
        // ask for index again - returns already created index
        var index2 = collection.index_by(["Field1", "Field2"]);
        assert(index === index2);
        test_utils.assertDeepEqual(collection.index_system.index_map, { "Field1,Field2": { indexes_by_type: { sorted: estimated_index } } });
    });

    it("test index_by([a]) - array of array of string", function () {
        var collection = new Collection();
        //
        collection.index_by([["Field1", "Field2"], ["Field3"]]);
        //
        var estimated_indexes = [
            new Collection_Index.Sorted({ 'fields': ["Field1", "Field2"] }),
            new Collection_Index.Sorted({ 'fields': ["Field3"] })
        ];
        //
        var estimated_index_map = {
            "Field1,Field2": { indexes_by_type: { sorted: estimated_indexes[0] } },
            "Field3": { indexes_by_type: { sorted: estimated_indexes[1] } }
        };
        //
        test_utils.assertDeepEqual(collection.indexes(), estimated_indexes);
        test_utils.assertDeepEqual(collection.index_system.index_map, estimated_index_map);
    });

    // -----------------------------------------------------
    //	index_by([s])
    // -----------------------------------------------------

    it("test index_by([s])", function () {
        var collection = new Collection();
        //
        collection.index_by("Field1");
        //
        var estimated_indexes = [
            new Collection_Index.Sorted({ 'fields': ["Field1"] })
        ];
        //
        var estimated_index_map = {
            "Field1": { indexes_by_type: { sorted: estimated_indexes[0] } }
        };
        //
        test_utils.assertDeepEqual(collection.indexes(), estimated_indexes);
        test_utils.assertDeepEqual(collection.index_system.index_map, estimated_index_map);
    });

    // -----------------------------------------------------
    //	index_by([o])
    // -----------------------------------------------------

    it("test index_by([o])", function () {
        var collection = new Collection();
        //
        //
        // create an index. "sorted2" will be ignored (only "sorted" is used):
        //
        collection.index_by({ sorted: [["Field1"]], sorted2: [["Field2"]] });
        //
        var estimated_indexes = [
            new Collection_Index.Sorted({ 'fields': ["Field1"] })
        ];
        //
        var estimated_index_map = {
            "Field1": { indexes_by_type: { sorted: estimated_indexes[0] } }
        };
        //
        test_utils.assertDeepEqual(collection.indexes(), estimated_indexes);
        test_utils.assertDeepEqual(collection.index_system.index_map, estimated_index_map);
        //
        // do the same again. the index will be re-created:
        //
        var index_old = collection.indexes()[0];
        collection.index_by({ sorted: [["Field1"]], sorted2: [["Field2"]] });
        assert(collection.indexes()[0] !== index_old);
        //
        test_utils.assertDeepEqual(collection.indexes(), estimated_indexes);
        test_utils.assertDeepEqual(collection.index_system.index_map, estimated_index_map);
        //
        //
        // unable to create an index with several fields:
        //
        assert.throws(function () { collection.index_by({ sorted: [["Field2", "Field3"]] }); });
        //
        // add 2 indexes:
        //
        collection.index_by({ sorted: [["Field2"], ["Field3"]] });
        //
        estimated_indexes = [
            new Collection_Index.Sorted({ 'fields': ["Field1"] }),
            new Collection_Index.Sorted({ 'fields': ["Field2"] }),
            new Collection_Index.Sorted({ 'fields': ["Field3"] }),
        ];
        //
        estimated_index_map = {
            "Field1": { indexes_by_type: { sorted: estimated_indexes[0] } },
            "Field2": { indexes_by_type: { sorted: estimated_indexes[1] } },
            "Field3": { indexes_by_type: { sorted: estimated_indexes[2] } }
        };
        //
        test_utils.assertDeepEqual(collection.indexes(), estimated_indexes);
        test_utils.assertDeepEqual(collection.index_system.index_map, estimated_index_map);
    });

    // -----------------------------------------------------
    //	index(indexes_def)
    // -----------------------------------------------------

    it("test index(indexes_def)", function () {
        var collection = new Collection();
        //
        collection.index("Field1");  // the same as collection.index_by("Field1");
        //
        var estimated_indexes = [
            new Collection_Index.Sorted({ 'fields': ["Field1"] })
        ];
        //
        var estimated_index_map = {
            "Field1": { indexes_by_type: { sorted: estimated_indexes[0] } }
        };
        //
        test_utils.assertDeepEqual(collection.indexes(), estimated_indexes);
        test_utils.assertDeepEqual(collection.index_system.index_map, estimated_index_map);
    });

    // -----------------------------------------------------
    //	get_index(fields)
    // -----------------------------------------------------

    it("test get_index(fields)", function () {
        var collection = new Collection(String);
        //
        assert.throws(function () { collection.get_index("value"); });
    });


});

