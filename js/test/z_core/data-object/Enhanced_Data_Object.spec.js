
describe("z_core/data-object /Enhanced_Data_Object.spec.js ", function () {


    var Enhanced_Data_Object;
    var Data_Object;
    var Data_Value;
    var Data_Structures;
    var Constraint;
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
        var edo_module_name = require.resolve('../../../core/enhanced-data-object');
        delete require.cache[edo_module_name];
        var data_object_module_name = require.resolve('../../../core/data-object');
        delete require.cache[data_object_module_name];

        var oldStringAbstract = String.abstract;
        Enhanced_Data_Object = require('../../../core/enhanced-data-object');
        if ((oldStringAbstract === undefined) && (String.abstract === true)) delete String.abstract;

        Data_Object = require('../../../core/data-object');
        Data_Value = require('../../../core/data-value');
        Data_Structures = require('../../../core/jsgui-data-structures');
        Constraint = require('../../../core/constraint');
        assert = require('assert');
        test_utils = require('../../test-utils/test-utils');

        //
        // jsgui:
        //
        jsgui = Enhanced_Data_Object.prototype.mod_link();
    });

    //#region miscellaneous

    // ======================================================
    //
    //	                miscellaneous
    //
    // ======================================================

    // -----------------------------------------------------
    //	register_data_type
    // -----------------------------------------------------

    it("should register a data type", function () {
        var save_data_types_info = jsgui.data_types_info;
        jsgui.data_types_info = {};
        //
        var myDataTypeDef = { data: "myDataTypeData" };
        Enhanced_Data_Object.register_data_type("myDataType", myDataTypeDef);
        //
        assert.deepEqual(jsgui.data_types_info["myDataType"], myDataTypeDef);
        //
        jsgui.data_types_info = save_data_types_info;
    });

    // -----------------------------------------------------
    //	map_data_type_data_object_constructors
    // -----------------------------------------------------

    it("check map_data_type_data_object_constructors[]", function () {
        assert.ok(jsgui.map_data_type_data_object_constructors === Data_Object.map_data_type_data_object_constructors);
        assert.ok(jsgui.map_data_type_data_object_constructors === Enhanced_Data_Object.map_data_type_data_object_constructors);
    });

    // -----------------------------------------------------
    //	flags
    // -----------------------------------------------------

    it("should works with flags...", function () {
        var edo = new Enhanced_Data_Object();
        //
        assert.deepEqual(edo.has_flag("test"), undefined);
        //
        edo.add_flag("test");
        //
        assert.deepEqual(edo.has_flag("test"), undefined);
        assert.deepEqual(jsgui.stringify(edo.get('flags')), 'Collection("test")');
        //
        edo.remove_flag("test");
        //
        assert.deepEqual(edo.has_flag("test"), undefined);
        assert.deepEqual(jsgui.stringify(edo.get('flags')), 'Collection("test")');
        //
        edo.add_flag("test"); // added already..
        //
        assert.deepEqual(edo.has_flag("test"), undefined);
        assert.deepEqual(jsgui.stringify(edo.get('flags')), 'Collection("test", "test")');
    });

    // -----------------------------------------------------
    //	ensure_data_type_data_object_constructor
    // -----------------------------------------------------

    it("ensure_data_type_data_object_constructor() can remove fields() method", function () {
        //
        // save the global variables:
        var save_jsgui_map_data_type_data_object_constructors = jsgui.map_data_type_data_object_constructors;
        var save_jsgui_data_types_info = jsgui.data_types_info;
        //
        // clear the global variables:
        jsgui.map_data_type_data_object_constructors = [];
        jsgui.data_types_info = [];
        //
        //
        //
        // if a data type is not defined in jsgui.data_types_info[], then ensure_data_type_data_object_constructor()
        // removes the fields() method from Enhanced_Data_Object instances:
        //
        var edo_int = new (jsgui.ensure_data_type_data_object_constructor("int"))(); // jsgui.data_types_info["int"] not defined
        assert.deepEqual(edo_int.fields, undefined); // fields() method removed
        //
        // now define some type - the fields() method will be not removed:
        //
        jsgui.data_types_info["int2"] = {};
        var edo_int2 = new (jsgui.ensure_data_type_data_object_constructor("int2"))();
        assert.deepEqual(edo_int2.fields(), [["flags", ["collection", "string"]]]); // feilds() method not removed
        //
        // it works on such manner because ensure_data_type_data_object_constructor() passes the data type info to the Enhanced_Data_Object.extend() method:
        //
        //
        var edo1 = new (Enhanced_Data_Object.extend({ 'fields': undefined }))();
        assert.deepEqual(edo1.fields, undefined);
        //
        var edo2 = new (Enhanced_Data_Object.extend({ 'fields': {} }))();
        assert.deepEqual(edo2.fields(), [["flags", ["collection", "string"]]]);
        //
        //
        // restore the global variables:
        jsgui.map_data_type_data_object_constructors = save_jsgui_map_data_type_data_object_constructors;
        jsgui.data_types_info = save_jsgui_data_types_info;
    });

    // -----------------------------------------------------
    //	extend()
    // -----------------------------------------------------

    it("extend()", function () {
        var edo = new Enhanced_Data_Object();
        assert.deepEqual(edo.flags, undefined);
        //
        var EDO2 = Enhanced_Data_Object.extend({ flags: [] });
        assert.deepEqual(EDO2._flags, []);
        //
        var edo2 = new EDO2();
        assert.deepEqual(edo2._flags, undefined);
        assert.deepEqual(edo2.flags, []);
    });

    //#endregion

    // ***********************************************************************************
    //
    //                                      get()
    //
    // ***********************************************************************************

    // -----------------------------------------------------
    //	without the field(s) definition:
    // -----------------------------------------------------

    //#region without the field(s) definition

    //
    //
    // all the tests in this region are exactly the same as for Data_Object
    // ========================================================================
    //

    it("internal ll_get() and ll_set()", function () {
        var data_object = new Enhanced_Data_Object();
        var set_result = null;
        //
        // Data_Object allows to set and get values directly, without the internal Data_Value creation
        // it does not works for the following types: 'string', 'number', 'boolean', 'date'
        // so, test it using arrays and object:
        //
        // BTW ll_set() found to be not used 
        //
        set_result = data_object.set("Field1", [123]);
        assert.deepEqual(data_object.get("Field1"), [123]);
        assert.deepEqual(set_result, [123]);
        //
        set_result = data_object.set("Field2", ["45"]);
        assert.deepEqual(data_object.get("Field2"), ["45"]);
        assert.deepEqual(set_result, ["45"]);
        //
        var value = { x: 100 };
        set_result = data_object.set("Field1", value);
        assert.deepEqual(data_object.get("Field1"), value);
        assert.deepEqual(set_result, value);
    });

    it("native types", function () {
        var data_object = new Enhanced_Data_Object();
        var set_result = null;
        //
        // Data_Object creates an internal Data_Value for native types ('string', 'number', 'boolean', 'date')
        //
        set_result = data_object.set("Field1", "45");
        assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: "45" }));
        assert.deepEqual(set_result, "45");
        //
        set_result = data_object.set("Field2", 123);
        assert.deepEqual(data_object.get("Field2"), new Data_Value({ value: 123 }));
        assert.deepEqual(set_result, 123);
        //
        set_result = data_object.set("Field3", false);
        assert.deepEqual(data_object.get("Field3"), new Data_Value({ value: false }));
        assert.deepEqual(set_result, false);
        //
        // probably error
        // "date" is listed in the hard-coded types inside the set() method code, 
        // but typeof returns "object" instead of "date". So, it does not create 
        // the internal Data_Value for Date:
        //
        var date_value = new Date(10000);
        set_result = data_object.set("Field4", date_value);
        assert.deepEqual(data_object.get("Field4"), date_value); // !!!
        assert.deepEqual(set_result, date_value);
    });

    it("allows to set anything if the field exists", function () {
        var data_object = new Enhanced_Data_Object();
        var set_result = null;
        //
        // if the field was set previously, then Data_Object allows to set anything without the internal Data_Object creation
        // bug?
        //
        set_result = data_object.set("Field1", [123]);
        assert.deepEqual(data_object.get("Field1"), [123]);
        assert.deepEqual(set_result, [123]);
        //
        set_result = data_object.set("Field1", 123);
        assert.deepEqual(data_object.get("Field1"), 123); // !!!
        assert.deepEqual(set_result, 123);
        //
        set_result = data_object.set("Field3", false);
        assert.deepEqual(data_object.get("Field3"), new Data_Value({ value: false }));
        assert.deepEqual(set_result, false);
        //
        set_result = data_object.set("Field3", true);
        assert.deepEqual(data_object.get("Field3"), true);
        assert.deepEqual(set_result, true);
    });

    it("should prevent read-only fields from setting", function () {
        var data_object = new Enhanced_Data_Object();
        var set_result = null;
        //
        data_object.read_only("Field1");
        assert.throws(function () { data_object.set("Field1", [123]); });
        assert.deepEqual(data_object.get("Field1"), undefined);
        //
        data_object.read_only("Field1", false);
        set_result = data_object.set("Field1", [123]);
        assert.deepEqual(data_object.get("Field1"), [123]);
        assert.deepEqual(set_result, [123]);
    });

    it("get() should return an object with all values", function () {
        var data_object = new Enhanced_Data_Object();
        // 
        var data_value1 = new Data_Value({ value: 100 });
        var data_value2 = new Data_Value({ value: "200" });
        //
        var set_result1 = data_object.set("Field1", 100);
        var set_result2 = data_object.set("Field2", "200");
        assert.deepEqual(data_object.get("Field1"), data_value1);
        assert.deepEqual(data_object.get("Field2"), data_value2);
        assert.deepEqual(set_result1, 100);
        assert.deepEqual(set_result2, "200");
        //
        assert.deepEqual(data_object.get(), { Field1: data_value1, Field2: data_value2 });
    });

    it("get() should return an object with all values - 2", function () {
        var data_object = new Enhanced_Data_Object();
        // 
        assert.deepEqual(data_object.get(), {});
        //
        var set_result1 = data_object.set("Field1", [100]);
        var set_result2 = data_object.set("Field2", ["200"]);
        assert.deepEqual(data_object.get("Field1"), [100]);
        assert.deepEqual(data_object.get("Field2"), ["200"]);
        assert.deepEqual(set_result1, [100]);
        assert.deepEqual(set_result2, ["200"]);
        //
        assert.deepEqual(data_object.get(), { Field1: [100], Field2: ["200"] });
    });

    it("set() should raise change event", function () {
        var data_object = new Enhanced_Data_Object();
        //
        var change_eventArgs = null;
        data_object.on("change", function (eventArgs) {
            change_eventArgs = eventArgs;
        });
        //
        data_object.set("Field1", [123]);
        assert.deepEqual(change_eventArgs, { name: "Field1", value: [123] });
        //
        var value = { x: 100 };
        data_object.set("Field1", value);
        assert.deepEqual(change_eventArgs, { name: "Field1", value: value });
        //
        // silent mode:
        //
        change_eventArgs = null;
        data_object.set("Field1", [123], true);
        assert.deepEqual(change_eventArgs, null);
        //
        change_eventArgs = null;
        data_object.set("Field1", [123], false);
        assert.deepEqual(change_eventArgs, { name: "Field1", value: [123] });
        //
        change_eventArgs = null;
        data_object.set("Field1", [123], ""); // ???
        assert.deepEqual(change_eventArgs, { name: "Field1", value: [123] });
        //
        change_eventArgs = null;
        data_object.set("Field1", [123], "true");
        assert.deepEqual(change_eventArgs, null);
        //
        change_eventArgs = null;
        data_object.set("Field1", [123], "false");
        assert.deepEqual(change_eventArgs, null);
    });

    xit("set() should include a source property to the change event when a control is passed", function () {
        //
        // something like data_object.set("Field1", [123], control);
        //
        // TODO: complete the test when controls code will be processed
    });

    it("set() using object instead of name/value pairs", function () {
        var data_object = new Enhanced_Data_Object();
        //
        var set_result = data_object.set({ Field1: [123], Field2: ["45"] });
        assert.deepEqual(set_result, { Field1: [123], Field2: ["45"] });
        //
        assert.deepEqual(data_object.get("Field1"), [123]);
        assert.deepEqual(data_object.get("Field2"), ["45"]);
    });

    it("set() using Data_Object instead of name/value pairs", function () {
        var data_object = new Enhanced_Data_Object();
        //
        var change_eventArgs = "not set";
        data_object.on("change", function (eventArgs) {
            change_eventArgs = eventArgs;
        });
        //
        var data_object_as_value = new Data_Object();
        //
        var set_result = data_object.set(data_object_as_value);
        assert.deepEqual(data_object.get(), { undefined: undefined }); // !!!
        assert.deepEqual(change_eventArgs, "not set");
        assert.deepEqual(set_result, undefined);
    });

    xit("set() using control instead of name/value pairs", function () {
        //
        // TODO: complete the test when controls code will be processed
        // maybe James means "Collection"? but "c" sig is "control"...
        // anyway it must not works
        //
        //var data_object = null;
        ////
        //data_object = new Enhanced_Data_Object();
        ////
        //var control_as_value = ...
        ////
        //data_object.set(control_as_value);
        //assert.deepEqual(data_object.get(), { undefined: undefined }); // !!!
    });


    //#endregion

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


    // get() before set(): [s,s,f]

    it("get() before set(): [s,s,f]", function () {
        //
        // differs from Data_Object: always undefined
        //
        var data_object = new Enhanced_Data_Object();
        //
        data_object.set_field("Field_String", String); assert_field_sig(data_object, "Field_String", "[s,s,f]");
        assert.deepEqual(data_object.get("Field_String"), undefined);
        //
        data_object.set_field("Field_Number", Number); assert_field_sig(data_object, "Field_Number", "[s,s,f]");
        assert.deepEqual(data_object.get("Field_Number"), undefined);
        //
        var MyBook = function () { this.book = "Secret City"; };
        //
        data_object.set_field("Field_MyBook", MyBook); assert_field_sig(data_object, "Field_MyBook", "[s,s,f]");
        assert.deepEqual(data_object.get("Field_MyBook"), undefined); // new MyBook());
        //
        //
        assert.deepEqual(data_object.get(), {});
    });

    // get() before set(): [s,[s,u]] - I see no way to create such field

    // get() before set(): [s,s,o]:

    it("get() before set(): [s,s,o]", function () {
        var data_object = new Enhanced_Data_Object();
        //
        // "collection" differs from Data_Object: Enhanced_Data_Object creates the value successfully
        //
        data_object.set_field("Field_collection", "collection"); assert_field_sig(data_object, "Field_collection", "[s,s,o]");
        //Data_Object: assert.throws(function () { data_object.get("Field_collection") });  // it's unable to create this field (line 4172 jsgui.Collection undefined) !!!
        var value_Collection = new jsgui.Collection({ 'context': data_object._context });
        assert.deepEqual(jsgui.stringify(data_object.get("Field_collection")), jsgui.stringify(value_Collection));
        //
        data_object.set_field("Field_data_object", "data_object"); assert_field_sig(data_object, "Field_data_object", "[s,s,o]");
        var value_data_object = new Enhanced_Data_Object();
        value_data_object._parent = data_object;                                    // !!!
        test_utils.assertDeepEqual(data_object.get("Field_data_object"), value_data_object);
        //
        // "ordered_string_list" differs from Data_Object: Enhanced_Data_Object code forgot to add the Ordered_String_List reference:
        //
        data_object.set_field("Field_ordered_string_list", "ordered_string_list"); assert_field_sig(data_object, "Field_ordered_string_list", "[s,s,o]");
        //var value_ordered_string_list = new Data_Structures.Ordered_String_List();
        //var v1_ordered_string_list = test_utils.functionsToStrings(data_object.get("Field_ordered_string_list"));
        //var v2_ordered_string_list = test_utils.functionsToStrings(value_ordered_string_list);
        //assert.deepEqual(v1_ordered_string_list, v2_ordered_string_list);
        assert.throws(function () { data_object.get("Field_ordered_string_list"); });
        //
        data_object.set_field("Field_string", "string"); assert_field_sig(data_object, "Field_string", "[s,s,o]");
        var value_string = new Data_Value();
        value_string._parent = data_object; // !!!
        assert.deepEqual(data_object.get("Field_string"), value_string);
        //
        // all other differs from Data_Object. Data_Object tries to process data_type_name avoiding ensure_data_type_data_object_constructor()
        // in the next tests; but Enhanced_Data_Object uses ensure_data_type_data_object_constructor() code branch.
        //
        data_object.set_field("Field_text", "text", { data_type: ["text", 10] }); assert_field_sig(data_object, "Field_text", "[s,s,o]");
        var value_text = new (jsgui.ensure_data_type_data_object_constructor("text"))();
        value_text.parent(data_object);
        test_utils.assertDeepEqual(data_object.get("Field_text"), value_text);
        //
        data_object.set_field("Field_text2", "text"); assert_field_sig(data_object, "Field_text2", "[s,s,o]");
        test_utils.assertDeepEqual(data_object.get("Field_text2"), value_text);
        //
        data_object.set_field("Field_int", "int"); assert_field_sig(data_object, "Field_int", "[s,s,o]");
        var value_int = new (jsgui.ensure_data_type_data_object_constructor("int"))();
        value_int.parent(data_object);
        test_utils.assertDeepEqual(data_object.get("Field_int"), value_int);
        //
        data_object.set_field("Field_wrong", "wrong"); assert_field_sig(data_object, "Field_wrong", "[s,s,o]");
        var value_wrong = new (jsgui.ensure_data_type_data_object_constructor("wrong"))();
        value_wrong.parent(data_object);
        test_utils.assertDeepEqual(data_object.get("Field_wrong"), value_wrong);
    });

    // get() before set(): [s,s]:

    it("get() before set(): [s,s]", function () {
        var data_object = new Enhanced_Data_Object();
        //
        data_object.set_field(0, ["Field_collection", "collection"]); assert_field_sig(data_object, "Field_collection", "[s,s]");
        var value_collection = new jsgui.Collection({ 'context': data_object._context });
        value_collection.parent(data_object);
        test_utils.assertDeepEqual(data_object.get("Field_collection"), value_collection);
        //
        data_object.set_field(0, ["Field_control", "control"]); assert_field_sig(data_object, "Field_control", "[s,s]");
        test_utils.assertDeepEqual(data_object.get("Field_control"), undefined);
        //
        data_object.set_field(0, ["Field_string", "string"]); assert_field_sig(data_object, "Field_string", "[s,s]");
        var value_string = new Data_Value();
        value_string.parent(data_object);
        test_utils.assertDeepEqual(data_object.get("Field_string"), value_string);
        //
        // other cases try to use jsgui.map_data_type_data_object_constructors[], 
        // but the code refers jsgui as this._module_jsgui - it is undefined
        // so the results below are always undefined
        //
        data_object.set_field(0, ["Field_other", "other"]); assert_field_sig(data_object, "Field_other", "[s,s]");
        test_utils.assertDeepEqual(data_object.get("Field_other"), undefined); // intended to use map_data_type_data_object_constructors["other"]
        //
        data_object.set_field(0, ["Field_other2", "other2"]); assert_field_sig(data_object, "Field_other2", "[s,s]");
        test_utils.assertDeepEqual(data_object._module_jsgui, undefined);
        jsgui.map_data_type_data_object_constructors["other2"] = Data_Value;
        //var value_other2 = new Data_Value();
        //value_other2.parent(data_object);
        test_utils.assertDeepEqual(data_object.get("Field_other2"), undefined); // value_other2);
        //
        data_object.set_field(0, ["Field_data_object", "data_object"]); assert_field_sig(data_object, "Field_data_object", "[s,s]");
        test_utils.assertDeepEqual(data_object.get("Field_data_object"), undefined);
    });

    // get() before set(): [s,s] using jsgui.data_types_info:

    it("get() before set(): [s,s] using jsgui.data_types_info", function () {
        //
        //  prepare the pure environment (without Enhanced_Data_Object and jsgui-lang-utils side effects):
        //
        var save_map_data_type_data_object_constructors = jsgui.map_data_type_data_object_constructors;
        var save_data_types_info = jsgui.data_types_info;
        var save_ensure_data_type_data_object_constructor = jsgui.ensure_data_type_data_object_constructor;
        //
        jsgui.map_data_type_data_object_constructors = [];
        jsgui.data_types_info = [];
        jsgui.ensure_data_type_data_object_constructor = Data_Object.ensure_data_type_data_object_constructor;
        //
        //
        //  perform the test:
        //
        var data_object = new Enhanced_Data_Object();
        jsgui.data_types_info["MyType"] = { Field1: "int" };
        data_object.set_field(0, ["FieldMyType", "MyType"]); assert_field_sig(data_object, "FieldMyType", "[s,s]");
        var get_FieldMyType = data_object.get("FieldMyType");
        //
        //  check the result:
        //
        test_utils.assertDeepEqual(get_FieldMyType, undefined);
        //
        // restore the environment:
        //
        jsgui.ensure_data_type_data_object_constructor = save_ensure_data_type_data_object_constructor;
        jsgui.data_types_info = save_data_types_info;
        jsgui.map_data_type_data_object_constructors = save_map_data_type_data_object_constructors;
    });

    // get() before set(): [s,[s,s]]:

    it("get() before set(): [s,[s,s]]", function () {
        var data_object = new Enhanced_Data_Object();
        //
        data_object.set_field("Field_collection", ["collection", "int"]); assert_field_sig(data_object, "Field_collection", "[s,[s,s]]");
        var value_collection = new jsgui.Collection({ 'context': data_object._context });
        value_collection.parent(data_object);
        test_utils.assertDeepEqual(data_object.get("Field_collection"), value_collection);
        //
        data_object.set_field("Field_dictionary", ["dictionary", "int"]); assert_field_sig(data_object, "Field_dictionary", "u"); // !!!
    });

    // get() before set(): [s,[s,o]]:

    it("get() before set(): [s,[s,o]]", function () {
        var data_object = new Enhanced_Data_Object();
        //
        data_object.set_field("Field_collection", [{ Field1: "int", Field2: "text" }]); assert_field_sig(data_object, "Field_collection", "[s,[s,o]]");
        assert.deepEqual(data_object.fc.get("Field_collection"), ["Field_collection", ["collection", { Field1: "int", Field2: "text" }]]);
        //
        var value_collection = new jsgui.Collection({ 'context': data_object._context });
        value_collection.fields({ Field1: "int", Field2: "text" });
        value_collection.parent(data_object);
        test_utils.assertDeepEqual(data_object.get("Field_collection"), value_collection);
        //
        data_object.set_field("Field_data_object", {}); assert_field_sig(data_object, "Field_data_object", "[s,[s,o]]");
        assert.deepEqual(data_object.fc.get("Field_data_object"), ["Field_data_object", ["data_object", {}]]);
        assert.deepEqual(data_object.get("Field_data_object"), undefined);
    });

    //#endregion

    // -----------------------------------------------------
    //	set(), then get()
    // -----------------------------------------------------

    //#region set(), then get()

    // -----------------------------------------------------
    //	get, set() for qualified property names
    // -----------------------------------------------------

    it("should set and get values", function () {
        var data_object = new Enhanced_Data_Object();
        var set_result = null;
        //
        // ---------------------------------------------------------------------------------------------
        // trying to set a field named "." throws an exception 
        // (Data_Object: set() allows to set a field named ".", but get() is unable to get this field)
        // ---------------------------------------------------------------------------------------------
        //
        //set_result = data_object.set(".", ["dot"]);
        assert.throws(function () { set_result = data_object.set(".", ["dot"]); }); 
        //assert.deepEqual(data_object.get(), { '.': ["dot"] });
        //assert.deepEqual(data_object.get("."), undefined);
        //assert.deepEqual(set_result, ["dot"]);
        //
        // ---------------------------------------------
        // all other are the same as for Data_Object:
        // ---------------------------------------------
        //
        // Enhanced_Data_Object allows to set values using qualified names,
        // if all the nested data objects are created:
        //
        var data_object_b = new Enhanced_Data_Object();
        set_result = data_object_b.set("c", ["abc"]);
        assert.deepEqual(set_result, ["abc"]);
        //
        var data_object_a = new Enhanced_Data_Object();
        set_result = data_object_a.set("b", data_object_b);
        assert.deepEqual(set_result, data_object_b);
        //
        set_result = data_object.set("a", data_object_a);
        assert.deepEqual(data_object.get("a.b.c"), ["abc"]);
        assert.deepEqual(set_result, data_object_a);
        //
        set_result = data_object.set("a.b.c", [123]);
        assert.deepEqual(data_object.get("a.b.c"), [123]);
        assert.deepEqual(set_result, [123]);
        //
        // Enhanced_Data_Object is unable to create the nested data objects itself:
        //
        assert.throws(function () { data_object.set("x.y", ["xy"]); }); // 'No data object at this level.'
        //
        // Enhanced_Data_Object provides the change event for the qualified names as well:
        //
        var change_eventArgs = null;
        data_object.on("change", function (eventArgs) {
            change_eventArgs = eventArgs;
        });
        //
        set_result = data_object.set("a.b.c", [45]);
        assert.deepEqual(data_object.get("a.b.c"), [45]);
        assert.deepEqual(change_eventArgs, { name: "a.b.c", value: [45], bubbled: true });
        assert.deepEqual(set_result, [45]);
    });

    //#endregion


});

