
describe("z_core/collection/Collection.spec.js ", function () {

    var jsgui;
    var Collection;
    var Data_Value;
    var Data_Object;
    var assert;
    var test_utils;

    before(function () {
        var jsgui_module_name = require.resolve('../../../core/jsgui-lang-essentials');
        delete require.cache[jsgui_module_name];
        var util_module_name = require.resolve('../../../core/jsgui-lang-util');
        delete require.cache[util_module_name];
        var data_object_module_name = require.resolve('../../../core/data-object');
        delete require.cache[data_object_module_name];
        var collection_module_name = require.resolve('../../../core/collection');
        delete require.cache[collection_module_name];
        //
        jsgui = require('../../../core/jsgui-lang-essentials');
        //
        Collection = require('../../../core/collection');
        Data_Value = require('../../../core/data-value');
        Data_Object = require('../../../core/data-object');
        assert = require('assert');
        test_utils = require('../../test-utils/test-utils');
    });


    //#region miscellaneous

    // ======================================================
    //
    //	                miscellaneous
    //
    // ======================================================

    // -----------------------------------------------------
    //	extend()
    // -----------------------------------------------------

    it("test extend()", function () {
        var data_object = new Data_Object();
        //
        var CollectionEx = Collection.extend({
            data_object: data_object, // try to set a data_object constraint
            hello: function () { return "hello!"; } // extend the Collection class adding hello() method
        });
        //
        var collection = new CollectionEx();
        //
        test_utils.assertDeepEqual(collection.constraint(), null); // the constraint is not set
        test_utils.assertDeepEqual(collection.hello(), "hello!");
    });

    // -----------------------------------------------------
    //	_id()
    // -----------------------------------------------------

    it("should be able to provide an id", function () {
        var collection = null;
        //
        collection = new Collection();
        test_utils.assertDeepEqual(collection._id(), undefined);
        //
        test_utils.assertDeepEqual(collection.__type_name, "data_object"); // !!!! 
        test_utils.assertDeepEqual(collection.__type, "collection");
        //
        var nextId = 7;
        var context = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
        //
        // !!!! the generated ids was "collection_008" and "collection_009". 
        // !!!! Now they are changed to "data_object_008" and "data_object_009" because of the collection.__type_name
        //
        collection = new Collection({ context: context });
        test_utils.assertDeepEqual(collection._id(), "data_object_008"); // "data_object_007" was generated in the constructor!
        test_utils.assertDeepEqual(collection._id(), "data_object_009"); // new ID generated !!!
    });

    //#endregion

});

