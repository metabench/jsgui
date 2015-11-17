
describe("z_core/collection/Collection-Utils.spec.js ", function () {

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

    //#region Collection - Utils

    // ======================================================
    //
    //	                Collection - Utils
    //
    // ======================================================

    // -----------------------------------------------------
    //	stringify()
    // -----------------------------------------------------

    it("stringify() should start abstract collection from tilde", function () {
        var collection = new Collection({ abstract: true });
        //
        test_utils.assertDeepEqual(collection.stringify(), "~Collection()");
    });

    it("stringify() should print _type_constructor for abstract collection", function () {
        test_utils.assertDeepEqual(String.abstract, undefined);
        String.abstract = true;
        //
        var collection = new Collection(String);
        test_utils.assertDeepEqual(collection.stringify(), "~Collection(String)");
        //
        delete String.abstract;
        test_utils.assertDeepEqual(String.abstract, undefined);
    });

    it("stringify() should print _type_constructor for abstract collection - 2", function () {
        test_utils.assertDeepEqual(String.abstract, undefined);
        //
        var collection = Collection(String);
        test_utils.assertDeepEqual(collection.stringify(), "~Collection(String)");
        //
        test_utils.assertDeepEqual(String.abstract, true); // !!!
        //
        delete String.abstract;
        test_utils.assertDeepEqual(String.abstract, undefined);
    });

    it("stringify() should print values", function () {
        var collection = new Collection();
        //
        collection.set([1, "2"]);
        test_utils.assertDeepEqual(collection.stringify(), 'Collection(1, "2")');
    });

    // -----------------------------------------------------
    //	toString()
    // -----------------------------------------------------

    it("toString() should return values as string", function () {
        var collection = new Collection();
        test_utils.assertDeepEqual(collection.toString(), "[]");
        //
        collection.set([1, "2"]);
        test_utils.assertDeepEqual(collection.toString(), '[1, "2"]');
        //
        var abstract_collection = new Collection({ abstract: true });
        test_utils.assertDeepEqual(abstract_collection.toString(), "undefined");
    });

    // -----------------------------------------------------
    //	toObject()
    // -----------------------------------------------------

    it("toObject() should return values as objects array", function () {
        var collection = new Collection();
        test_utils.assertDeepEqual(collection.toObject(), []);
        //
        collection.set([1, "2"]);
        test_utils.assertDeepEqual(collection.toObject(), [1, "2"]);
        //
        var abstract_collection = new Collection({ abstract: true });
        test_utils.assertDeepEqual(abstract_collection.toObject(), []);
    });

    //#endregion

});

