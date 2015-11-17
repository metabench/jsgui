
describe("z_core/collection/Collection-Fields.spec.js ", function () {

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

    //#region Collection - Fields

    // ======================================================
    //
    //	                Collection - Fields
    //
    // ======================================================

    // -----------------------------------------------------
    //	fields(...)
    // -----------------------------------------------------

    it("test fields(...)", function () {
        var collection = new Collection();
        //
        // initially it does not create collection._data_object_constraint.data_object.fc field, so exception throws:
        assert.throws(function () { collection.fields(); });
        test_utils.assertDeepEqual(collection._data_object_constraint.data_object.fc, undefined);
        //
        // the same: ....fc is undefined, exception throws:
        assert.throws(function () { collection.fields(["Field1", "int"]); });
        //
        // the constraint is not set (will be set during the fields({...}) call):
        test_utils.assertDeepEqual(collection._data_def_constraint, undefined);
        //
        // it works:
        collection.fields({ "Field1": "int" });
        test_utils.assertDeepEqual(collection.fields(), [["Field1", "int", { data_type: "int" }]]);
        test_utils.assertDeepEqual(collection._data_def_constraint, new Constraint.Collection_Data_Def({ "Field1": "int" }));
        //
        // now it works too:
        collection.fields(["Field2", "text"]);
        test_utils.assertDeepEqual(collection.fields(), [["Field1", "int", { data_type: "int" }], ["Field2", "text", { data_type: "text" }]]);
        test_utils.assertDeepEqual(collection._data_def_constraint, new Constraint.Collection_Data_Def({ "Field1": "int" }));
        // please note: the constraint (see above) is not changed!
    });

    // -----------------------------------------------------
    //	set_field(field_name, field_def)
    // -----------------------------------------------------

    it("test set_field(field_name, field_def)", function () {
        var collection = new Collection();
        //
        collection.set_field("Field1", "int");
        test_utils.assertDeepEqual(collection.fields(), [["Field1", "int", { data_type: "int" }]]);
        //
        collection.set_field("Field2", "text");
        test_utils.assertDeepEqual(collection.fields(), [["Field1", "int", { data_type: "int" }], ["Field2", "text", { data_type: "text" }]]);
    });

    // -----------------------------------------------------
    //	remove_field(field_name)
    // -----------------------------------------------------

    it("test remove_field(field_name)", function () {
        var collection = new Collection();
        //
        collection.set_field("Field1", "int");
        test_utils.assertDeepEqual(collection.fields(), [["Field1", "int", { data_type: "int" }]]);
        //
        collection.remove_field("Field1");
        test_utils.assertDeepEqual(collection.fields(), []);
    });


});

