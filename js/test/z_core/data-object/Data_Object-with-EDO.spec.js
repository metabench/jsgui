

//
// Data_Object tests in "Enhanced_Data_Object loaded" environment
// (only the tests that works differently when Enhanced_Data_Object module is requested)
//

describe("z_core/data-object /Data_Object-with-EDO.spec.js ", function () {

    var Data_Object;
    var Data_Structures;
    var Constraint;
    var Enhanced_Data_Object;
    var assert;
    var test_utils;

    // -----------------------------------------------------
    //	jsgui:
    // -----------------------------------------------------

    var jsgui = null;

    before(function () {
        var jsgui_module_name = require.resolve('../../../core/jsgui-lang-essentials');
        delete require.cache[jsgui_module_name];
        var util_module_name = require.resolve('../../../core/jsgui-lang-util');
        delete require.cache[util_module_name];
        var data_object_module_name = require.resolve('../../../core/data-object');
        delete require.cache[data_object_module_name];
        //
        Data_Object = require('../../../core/data-object');
        Data_Structures = require('../../../core/jsgui-data-structures');
        Constraint = require('../../../core/constraint');
        //
        var oldStringAbstract = String.abstract;
        Enhanced_Data_Object = require('../../../core/enhanced-data-object');
        if ((oldStringAbstract === undefined) && (String.abstract === true)) delete String.abstract;
        //
        assert = require('assert');
        test_utils = require('../../test-utils/test-utils');
        //
        //
        // jsgui:
        //
        jsgui = Data_Object.prototype.mod_link();
    });

    //#region Initialization

    // ======================================================
    //
    //	                Initialization
    //
    // ======================================================

    // -----------------------------------------------------
    //	__id
    // -----------------------------------------------------

    it("should assign an _id sometimes", function () {
        var data_object = null;
        //
        // _context
        //
        var nextId = 7;
        var myContext = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
        data_object = new Data_Object({ context: myContext });
        assert.deepEqual(data_object.__id, undefined); // instead of "data_object_007", as '__data_id_method' == 'lazy'
    });

    //#endregion

    //#region get(), set(), has(), value(), load_from_spec()

    // ======================================================
    //
    //	   get(), set(), has(), value(), load_from_spec()
    //
    // ======================================================

    // -----------------------------------------------------
    //	with the field(s) definition: get() before set():
    // -----------------------------------------------------

    //#region with the field(s) definition: get() before set():

    // this function is related to the get() implementation details, and used to check code coverage purposes
    // this check should be removed from the final (production) tests version
    function assert_field_sig(data_object, fieldName, fieldSig) {
        var sig = jsgui.get_item_sig(data_object.fc.get(fieldName), 20);
        assert.deepEqual(sig, fieldSig);
    }

    // get() before set(): [s,s,o]:

    it("get() before set(): [s,s,o]", function () {
        var data_object = new Data_Object();
        //
        data_object.set_field("Field_collection", "collection"); assert_field_sig(data_object, "Field_collection", "[s,s,o]");
        //assert.throws(function () { data_object.get("Field_collection") });  // it's unable to create this field (line 4172 jsgui.Collection undefined) !!!
        var get_collection = data_object.get("Field_collection");
        assert.ok(get_collection);
        assert.ok(get_collection instanceof jsgui.Collection);
    });

    // get() before set(): [s,s]:

    it("get() before set(): [s,s]", function () {
        var data_object = new Data_Object();
        //
        data_object.set_field(0, ["Field_data_object", "data_object"]); assert_field_sig(data_object, "Field_data_object", "[s,s]");
        //assert.throws(function () { data_object.get("Field_data_object") }); // "new jsgui.Data_Object(...)" data-object.js line 4347
        var value_data_object = new Data_Object();
        value_data_object._parent = data_object;                                    // !!!
        assert.deepEqual(data_object.get("Field_data_object"), value_data_object);
    });

    //#endregion

    //#endregion


    //#region creation...

    // ======================================================
    //
    //	                 creation...
    //
    // ======================================================

    // -----------------------------------------------------
    //	dobj()
    // -----------------------------------------------------

    it("dobj() - Enhanced_Data_Object", function () {
        var data_object = Data_Object.dobj();
        assert.deepEqual(data_object.field(), [["flags", ["collection", "string"]]]);
        assert.ok(data_object instanceof Enhanced_Data_Object);
        //
        // data_def does nothing:
        //
        data_object = Data_Object.dobj({}, { Field1: "int" });
        assert.deepEqual(data_object.field(), [["flags", ["collection", "string"]]]);
        //
        // set values:
        //
        data_object = Data_Object.dobj({ Field1: [111], Field2: [222] });
        assert.deepEqual(data_object.get("Field1"), [111]);
        assert.deepEqual(data_object.get("Field2"), [222]);
    });

    // -----------------------------------------------------
    //	ensure_data_type_data_object_constructor()
    // -----------------------------------------------------

    it("ensure_data_type_data_object_constructor()", function () {
        var save_map_data_type_data_object_constructors = jsgui.map_data_type_data_object_constructors;
        var save_data_types_info = jsgui.data_types_info;
        //
        assert.deepEqual(jsgui.data_types_info['my_test_type'], undefined);
        assert.deepEqual(jsgui.map_data_type_data_object_constructors['my_test_type'], undefined);
        //
        jsgui.data_types_info['my_test_type'] = { Field1: "int", Field2: "number" };
        //
        // "without Enhanced_Data_Object" test calls Data_Object.ensure_data_type_data_object_constructor()...
        //
        var MyTestTypeConstructor = jsgui.ensure_data_type_data_object_constructor('my_test_type'); // ???  jsgui. ...
        //
        var data_object = new MyTestTypeConstructor();
        assert.ok(data_object instanceof Enhanced_Data_Object);
        assert.deepEqual(data_object.field(), [["flags", ["collection", "string"]], ["Field1", "int", { data_type: "int" }], ["Field2", "number", { data_type: "number" }]]);
        //
        jsgui.data_types_info = save_data_types_info;
        jsgui.map_data_type_data_object_constructors = save_map_data_type_data_object_constructors;
    });

    //#endregion  creation...

});


