
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/data-object', '../../../core/data-value', "../../../core/jsgui-data-structures", "../../../core/constraint", "../../../core/enhanced-data-object", 'assert', '../../../test/test-utils/test-utils'],
function (Data_Object, Data_Value, Data_Structures, Constraint, Enhanced_Data_Object, assert, test_utils) {

    describe("z_core/data-object /Data_Object.spec.js ", function () {


        // -----------------------------------------------------
        //	jsgui:
        // -----------------------------------------------------

        var jsgui = null;

        // -----------------------------------------------------
        //	avoid side effects:
        // -----------------------------------------------------

        var save_jsgui_Data_Object = null; // jsgui-lang-utils.js(63): jsgui.Data_Object = Data_Object;
        var save_jsgui_Collection = null;  // jsgui-lang-utils.js(64): jsgui.Collection = Collection;
        var save_jsgui_Data_Value = null;  // jsgui-lang-utils.js(66): jsgui.Data_Value = Data_Object.Data_Value;
        //
        var save_jsgui__data_id_method = null;  // jsgui-lang-utils.js(1270): '__data_id_method' : 'lazy',
        //
        var save_Data_Object_Enhanced_Data_Object = null;  // enhanced-data-object(660): Data_Object.set_Enhanced_Data_Object(Enhanced_Data_Object);

        before(function () {
            //
            // jsgui:
            //
            jsgui = Data_Object.prototype.mod_link();
            //
            //  save values:
            //
            save_jsgui_Data_Object = jsgui.Data_Object;
            save_jsgui_Collection = jsgui.Collection;
            save_jsgui_Data_Value = jsgui.Data_Value;
            //
            save_jsgui__data_id_method = jsgui.__data_id_method;
            //
            save_Data_Object_Enhanced_Data_Object = Data_Object.get_Enhanced_Data_Object();
            //
            // reset values:
            //
            jsgui.Data_Object = null;
            jsgui.Collection = null;
            jsgui.Data_Value = null;
            //
            jsgui.__data_id_method = "init";
            //
            Data_Object.set_Enhanced_Data_Object(null);
        });

        after(function () {
            //
            //  restore values:
            //
            jsgui.Data_Object = save_jsgui_Data_Object;
            jsgui.Collection = save_jsgui_Collection;
            jsgui.Data_Value = save_jsgui_Data_Value;
            //
            jsgui.__data_id_method = save_jsgui__data_id_method;
            //
            Data_Object.set_Enhanced_Data_Object(save_Data_Object_Enhanced_Data_Object);
        });

        //#region Initialization

        // ======================================================
        //
        //	                Initialization
        //
        // ======================================================

        function base_check(data_object) {
            if (data_object._abstract) {
                assert.deepEqual(data_object.__type, undefined);
                assert.deepEqual(data_object._, undefined);
            } else {
                assert.deepEqual(data_object.__type, 'data_object');
                assert.deepEqual(data_object._, {});
            }
            //
            assert.deepEqual(data_object.fc, undefined); // !!!
        }


        // -----------------------------------------------------
        //	spec: event_bindings
        // -----------------------------------------------------

        it("should allows the event_bindings parameter", function () {
            //assert.throws(function () { new Data_Object({ event_bindings: [] }) });
            new Data_Object({ event_bindings: [] });
        });

        // -----------------------------------------------------
        //	spec: constraint
        // -----------------------------------------------------

        it("should set an constraint...", function () {
            //
            // the Data_Object.init() method contains the spec.constraint processing calling constraint() method.
            // But the constraint() method does not exists. Probably it means a constraints() method (with ending "s").
            //
            //assert.throws(function () { new Data_Object({ constraint: {} }) });
            new Data_Object({ constraint: {} });
        });

        //#endregion

        //#region get(), set(), has(), value(), load_from_spec()

        // ======================================================
        //
        //	   get(), set(), has(), value(), load_from_spec()
        //
        // ======================================================

        //
        // the main get() and set() algorithm is the following:
        //
        //function get(field_name) {
        //    if (fc.get(field_name)) {
        //        if (!_[field_name]) {
        //            _[field_name] = createValueBasedOnFieldDefinition(); // Data_Object or Data_Value usually
        //            return _[field_name];
        //        } else {
        //            return _[field_name];
        //        }
        //    } else {
        //        return ll_get(_, field_name);
        //    }
        //}
        //
        //function set(field_name, value) {
        //    if (!get(field_name)) {
        //        // no field defined, and no value was set previously:
        //        if (typeof (value) in ['string', 'number', 'boolean', 'date']) {
        //            this._[field_name] = new Data_Value({ 'value': value });
        //        } else {
        //            this._[field_name] = value;
        //        }
        //    } else {
        //        this._[field_name] = value;
        //    }
        //    return value;
        //}

        it("should work strangely", function () {
            var data_object = new Data_Object();
            var set_result = null;
            //
            set_result = data_object.set("Field2", null);
            assert.deepEqual(data_object.get("Field2"), null);
            assert.deepEqual(set_result, null);
            //
            assert.deepEqual(data_object.get(), { Field2: null });
        });

        // -----------------------------------------------------
        //	without the field(s) definition:
        // -----------------------------------------------------

        //#region without the field(s) definition

        it("native types", function () {
            var data_object = new Data_Object();
            var set_result = null;
            //
            // probably error
            // "date" is listed in the hard-coded types inside the set() method code, 
            // but typeof returns "object" instead of "date". So, it does not create 
            // the internal Data_Value for Date:
            //
            var date_value = new Date(10000);
            set_result = data_object.set("Field4", date_value);
            assert.deepEqual(data_object.get("Field4"), new Data_Value({ value: date_value })); 
            assert.deepEqual(set_result, date_value);
        });


        it("set() should raise change event", function () {
            var data_object = new Data_Object();
            //
            var change_eventArgs = null;
            data_object.on("change", function (eventArgs) {
                change_eventArgs = eventArgs;
            });
            //
            //
            // silent mode:
            //
            // set() method accepts the 'silent' parameter as string, but "false" evaluates as true:
            //
            change_eventArgs = null;
            data_object.set("Field1", [123], "false");
            assert.deepEqual(change_eventArgs, { name: "Field1", value: [123] });
        });

        it("set() using Data_Object instead of name/value pairs", function () {
            var data_object = new Data_Object();
            //
            var change_eventArgs = "not set";
            data_object.on("change", function (eventArgs) {
                change_eventArgs = eventArgs;
            });
            //
            var data_object_as_value = new Data_Object();
            //
            var set_result = data_object.set(data_object_as_value);
            assert.notDeepEqual(data_object.get(), { undefined: undefined }); // !!!
            assert.notDeepEqual(change_eventArgs, "not set");
            assert.notDeepEqual(set_result, undefined);
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


        // get() before set(): [s,s,o]:

        it("get() before set(): [s,s,o]", function () {
            var data_object = new Data_Object();
            //
            data_object.set_field("Field_collection", "collection"); assert_field_sig(data_object, "Field_collection", "[s,s,o]");
            //assert.throws(function () { data_object.get("Field_collection") });  // it's unable to create this field (line 4172 jsgui.Collection undefined) !!!
            data_object.get("Field_collection");  // it's unable to create this field (line 4172 jsgui.Collection undefined) !!!
            //
            //
            data_object.set_field("Field_text", "text", { data_type: ["text", 10] }); assert_field_sig(data_object, "Field_text", "[s,s,o]");
            var value_text = new Data_Value();
            assert.deepEqual(data_object.get("Field_text"), value_text);
            //
            data_object.set_field("Field_text2", "text"); assert_field_sig(data_object, "Field_text2", "[s,s,o]");
            //assert.deepEqual(data_object.get("Field_text2"), undefined); // !!!
            assert.notDeepEqual(data_object.get("Field_text2"), undefined); // !!!
        });

        // get() before set(): [s,s]:

        it("get() before set(): [s,s]", function () {
            var data_object = new Data_Object();
            //
            data_object.set_field(0, ["Field_collection", "collection"]); assert_field_sig(data_object, "Field_collection", "[s,s]");
            //assert.throws(function () { data_object.get("Field_collection") });
            data_object.get("Field_collection");
            //
            data_object.set_field(0, ["Field_data_object", "data_object"]); assert_field_sig(data_object, "Field_data_object", "[s,s]");
            //assert.throws(function () { data_object.get("Field_data_object") }); // "new jsgui.Data_Object(...)" data-object.js line 4347
            data_object.get("Field_data_object"); // "new jsgui.Data_Object(...)" data-object.js line 4347
        });


        // get() before set(): [s,[s,s]]:

        it("get() before set(): [s,[s,s]]", function () {
            var data_object = new Data_Object();
            //
            data_object.set_field("Field_collection", ["collection", "int"]); assert_field_sig(data_object, "Field_collection", "[s,[s,s]]");
            assert.notDeepEqual(data_object.get("Field_collection"), undefined);
        });

        //#endregion

        // -----------------------------------------------------
        //	set(), then get()
        // -----------------------------------------------------

        //#region set(), then get()

        //
        // There is a get() call inside the set() code. So, probably, "set() then get()" scenario is unreal?
        //

        // -----------------------------------------------------
        //	get, set() for qualified property names
        // -----------------------------------------------------

        it("should set and get values", function () {
            var data_object = new Data_Object();
            var set_result = null;
            //
            // set() allows to set a field named ".", but get() is unable to get this field:
            //
            set_result = data_object.set(".", ["dot"]);
            assert.deepEqual(data_object.get(), { '.': ["dot"] });
            //assert.deepEqual(data_object.get("."), undefined);
            assert.deepEqual(data_object.get("."), ["dot"]);
            assert.deepEqual(set_result, ["dot"]);
        });

        //#endregion

        //#endregion get(), set(), etc.

        //#region Fields

        // ======================================================
        //
        //	                 Fields
        //
        // ======================================================

        // -----------------------------------------------------
        //	fields(), set_field()
        // -----------------------------------------------------

        it("should be able to get/set fields", function () {
            var data_object = null;
            //
            //
            // setting the same field again adds a field with the same name !!!
            //
            data_object = new Data_Object();
            //
            data_object.set_field("Field1", "int");
            assert.deepEqual(data_object.fields(), [["Field1", "int", { data_type: "int" }]]);
            //
            data_object.set_field("Field1", "bool");
            assert.notDeepEqual(data_object.fields(), [["Field1", "int", { data_type: "int" }], ["Field1", "bool", { data_type: "bool" }]]);
        });

        //#endregion Fields

        //#region Constraints

        // ======================================================
        //
        //	                 Constraints
        //
        // ======================================================

        // -----------------------------------------------------
        //	constraints()
        // -----------------------------------------------------

        it("should return the constraints", function () {
            var data_object = new Data_Object();
            //
            var myConstraints = { Field1: "int", Field2: "number" };
            data_object.constraints(myConstraints);
            assert.deepEqual(data_object._field_constraints, myConstraints);
            //
            //assert.deepEqual(data_object.constraints(), undefined);
            assert.deepEqual(data_object.constraints(), myConstraints);
        });

        // -----------------------------------------------------
        //	matches_field_constraint()
        // -----------------------------------------------------

        it("should check field value for the constraint", function () {
            var data_object = null;
            //
            // data_object.set() creates an internal Data_Value, it does not matches the constraints:
            //
            data_object = new Data_Object();
            data_object.set("Field1", 12.5);
            assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: 12.5 }));
            //
            assert.deepEqual(data_object.matches_field_constraint("Field1", "int"), false);
            //assert.deepEqual(data_object.matches_field_constraint("Field1", "number"), false); // !!!
            assert.notDeepEqual(data_object.matches_field_constraint("Field1", "number"), false); // !!!
            //
            // repeated data_object.set() sets value directly, it matches the constraints:
            //
            data_object.set("Field1", 12.5);
            assert.deepEqual(data_object.get("Field1"), 12.5);
            //
            assert.deepEqual(data_object.matches_field_constraint("Field1", "int"), false);
            assert.deepEqual(data_object.matches_field_constraint("Field1", "number"), true);
        });

        // -----------------------------------------------------
        //	matches_field_constraints()
        // -----------------------------------------------------

        it("work strangely ", function () {
            var data_object = new Data_Object();
            //
            // it seems that the constraints should be an object with key/value pairs, probably field_name/field_constraint:
            //
            var myConstraints = { Field1: "int", Field2: "number" };
            data_object.constraints(myConstraints);
            assert.deepEqual(data_object._field_constraints, myConstraints);
            //
            // without parameters, and with object parameter - always returns undefined
            //
            //assert.deepEqual(data_object.matches_field_constraints(), undefined);  // !!!
            //assert.deepEqual(data_object.matches_field_constraints(myConstraints), undefined);  // !!!
            assert.notDeepEqual(data_object.matches_field_constraints(), undefined);  // !!!
            assert.notDeepEqual(data_object.matches_field_constraints(myConstraints), undefined);  // !!!
            //
        });

        // -----------------------------------------------------
        //	Data_Object.matches_field_constraints() - static 
        // -----------------------------------------------------

        it("always returns undefined", function () {
            var data_object = new Data_Object();
            //
            // always undefined !!!
            //
            //assert.deepEqual(Data_Object.matches_field_constraints(null, {}), undefined);
            //assert.deepEqual(Data_Object.matches_field_constraints(data_object, {}), undefined);
            //assert.deepEqual(Data_Object.matches_field_constraints(data_object, { Field1: "int", Field2: "number" }), undefined);
            assert.notDeepEqual(Data_Object.matches_field_constraints(null, {}), undefined);
            assert.notDeepEqual(Data_Object.matches_field_constraints(data_object, {}), undefined);
            assert.notDeepEqual(Data_Object.matches_field_constraints(data_object, { Field1: "int", Field2: "number" }), undefined);
        });


        // ----------------------------------------------------------------------------------------------
        //	ensure_field_constraint(), get_field_data_type_constraint(), set_field_data_type_constraint
        // ----------------------------------------------------------------------------------------------

        it("work strangely", function () {
            var data_object = new Data_Object();
            //
            var field_info = { data_type: "int" };
            //
            data_object.ensure_field_constraint("Field1", field_info);
            //
            var fdtc = data_object.get_field_data_type_constraint("Field1");
            assert.deepEqual(fdtc, Constraint.from_str("int"));
            //
            //
            // ensuring the constraint again throws an exception:
            //
            //assert.throws(function () { data_object.ensure_field_constraint("Field1", field_info); });
            //assert.throws(function () { data_object.ensure_field_constraint("Field1", { data_type: "text" }); });
            data_object.ensure_field_constraint("Field1", field_info);
            data_object.ensure_field_constraint("Field1", { data_type: "text" });
            //
            // set_field_data_type_constraint() just removes the constraint. The second parameter (data_type_constructor, e.g. String) does not matter.
            //
            data_object.set_field_data_type_constraint("Field1", String);
            //
            //assert.deepEqual(data_object.get_field_data_type_constraint("Field1"), undefined);
            assert.notDeepEqual(data_object.get_field_data_type_constraint("Field1"), undefined);
        });

        //#endregion  Constraints

        //#region requirements

        // ======================================================
        //
        //	                 requirements
        //
        // ======================================================

        // in general, the requirements feature does nothing

        // -----------------------------------------------------
        //	_____meets_requirements()
        // -----------------------------------------------------

        it("work strangely", function () {
            var data_object = new Data_Object();
            //
            // returns undefined if the requirements are set to anything
            //
            var requirements = { abc: 123 };
            data_object._requirements = requirements;
            //
            //assert.deepEqual(data_object._____meets_requirements(), undefined);
            //assert.deepEqual(data_object._____meets_requirements("Field1"), undefined);
            assert.notDeepEqual(data_object._____meets_requirements(), undefined);
            assert.notDeepEqual(data_object._____meets_requirements("Field1"), undefined);
        });

        // -----------------------------------------------------
        //	_____check_requirements()
        // -----------------------------------------------------

        it("does nothing", function () {
            var data_object = new Data_Object();
            //
            // always returns undefined
            //
            //assert.deepEqual(data_object._____check_requirements(), undefined);
            //assert.deepEqual(data_object._____check_requirements("Field1"), undefined);
            //assert.deepEqual(data_object._____check_requirements(true), undefined);
            assert.notDeepEqual(data_object._____check_requirements(), undefined);
            assert.notDeepEqual(data_object._____check_requirements("Field1"), undefined);
            assert.notDeepEqual(data_object._____check_requirements(true), undefined);
        });

        //#endregion  requirements


        //#region _id(), parent

        // ======================================================
        //
        //	                 _id(), parent
        //
        // ======================================================

        //
        // parent() and other methods (_fp_parent(), position_within(), and remove_from()) use different implementation private variables
        //



        // -----------------------------------------------------
        //	_fp_parent()
        // -----------------------------------------------------

        it("work strangely", function () {
            var data_object = new Data_Object();
            //
            // _fp_parent() always returns undefined (here and below):  !!!
            //
            assert.deepEqual(data_object._fp_parent(), undefined);
            //
            var nextId = 7;
            var context = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            var parent_data_object = new Data_Object({ context: context });
            //
            // _fp_parent(data_object) does nothing besides the _context setting:  !!!
            //
            //
            data_object._fp_parent(parent_data_object);
            //
            //assert.deepEqual(data_object._fp_parent(), undefined);
            assert.notDeepEqual(data_object._fp_parent(), undefined);
            //
            assert.deepEqual(data_object._context, context); // implementation specific !!!
            //
            // _fp_parent(data_object, position) changes the _parents variable:
            //
            //
            data_object._fp_parent(parent_data_object, 3);
            //
            assert.deepEqual(data_object._parents, { 'data_object_007': [parent_data_object, 3] });  // implementation specific !!!
            //assert.deepEqual(data_object._fp_parent(), undefined);
            assert.notDeepEqual(data_object._fp_parent(), undefined);
        });

        // -----------------------------------------------------
        //	remove_from()
        // -----------------------------------------------------

        it("should probably remove from parent", function () {
            var data_object = new Data_Object();
            //
            var nextId = 7;
            var context = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            var parent_data_object = new Data_Object({ context: context });
            //
            //  _fp_parent(data_object, position) sets the parent and position:
            //
            data_object._fp_parent(parent_data_object, 3);
            assert.deepEqual(data_object.position_within(parent_data_object), 3);
            //
            // remove_from() does not works:
            //            
            //assert.throws(function () { data_object.remove_from(parent_data_object); });
            data_object.remove_from(parent_data_object);
        });

        //#endregion  _id(), parent

        //#region Data_Object.extend()

        // ======================================================
        //
        //	                 Data_Object.extend()
        //
        // ======================================================

        // -----------------------------------------------------
        //	jsgui.map_classes[]
        // -----------------------------------------------------

        it("probably should register Data_Object derived classes in map_classes[]", function () {
            var old_map_classes = jsgui.map_classes;
            //
            var Data_Object_Ex = Data_Object.extend({
                class_name: { name: "MyClass" }
            });
            //
            // no effect. I see no way to set the 'class_name' property for a derived class. // !!!
            // on the other hand, I don't like such side effects, maybe it's better without this feature
            //
            //assert.deepEqual(Data_Object_Ex['class_name'], undefined);
            //assert.deepEqual(jsgui.map_classes, old_map_classes);
            assert.notDeepEqual(Data_Object_Ex['class_name'], undefined);
            assert.notDeepEqual(jsgui.map_classes, old_map_classes);
            //
            jsgui.map_classes = old_map_classes;
        });

        //#endregion  Data_Object.extend()

        //#region fields chain

        // ======================================================
        //
        //	                 fields chain
        //
        // ======================================================

        // -----------------------------------------------------
        //	get_fields_chain(), chained_fields_to_fields_list() - object
        // -----------------------------------------------------

        it("should get objects fields chain", function () {
            var Data_Object_Ex = Data_Object.extend({
                fields: { Field1: "int", Field2: "text" }
            });
            //
            var chained_fields = Data_Object.get_chained_fields(Data_Object_Ex);
            assert.deepEqual(chained_fields, [[1, ["Field1", "int"]], [2, ["Field2", "text"]]]);
            //
            var Data_Object_Ex_2 = Data_Object_Ex.extend({
                fields: { Field3: "number" }
            });
            //
            chained_fields = Data_Object.get_chained_fields(Data_Object_Ex_2);
            //
            // probably the field numbers should be 1,2,3 ?
            //
            //assert.deepEqual(chained_fields, [[1, ["Field1", "int"]], [2, ["Field2", "text"]], [1, ["Field3", "number"]]]); // 1, 2, 1  ???
            assert.deepEqual(chained_fields, [[1, ["Field1", "int"]], [2, ["Field2", "text"]], [3, ["Field3", "number"]]]); // 1, 2, 1  ???
        });

        // -----------------------------------------------------
        //	get_fields_chain(), chained_fields_to_fields_list() - array
        // -----------------------------------------------------

        it("should get arrays fields chain", function () {
            var Data_Object_Ex = Data_Object.extend({
                fields: [["Field1", "text"], ["Field2", "number"]]
            });
            //
            var chained_fields = Data_Object.get_chained_fields(Data_Object_Ex);
            assert.deepEqual(chained_fields, [[0, ["Field1", "text"]], [1, ["Field2", "number"]]]);
            //
            var Data_Object_Ex_2 = Data_Object_Ex.extend({
                fields: [["Field3", "int"]]
            });
            //
            chained_fields = Data_Object.get_chained_fields(Data_Object_Ex_2);
            //
            // probably the field numbers should be 0,1,2 ?
            //
            //assert.deepEqual(chained_fields, [[0, ["Field1", "text"]], [1, ["Field2", "number"]], [0, ["Field3", "int"]]]);  // 0, 1, 0 ???
            assert.deepEqual(chained_fields, [[0, ["Field1", "text"]], [1, ["Field2", "number"]], [2, ["Field3", "int"]]]);  // 0, 1, 0 ???
        });

        //#endregion  fields chain

        //#region creation...

        // ======================================================
        //
        //	                 creation...
        //
        // ======================================================

        // -----------------------------------------------------
        //	dobj()
        // -----------------------------------------------------

        it("dobj() - Data_Object", function () {
            //
            // data_def parameter does nothing:
            //
            var data_object = Data_Object.dobj({}, { Field1: "int" });
            assert.notDeepEqual(data_object._field_constraints, undefined);
        });

        //#endregion  creation...

        //#region input_processors, output_processors

        // ======================================================
        //
        //	         input_processors, output_processors
        //
        // ======================================================

        // -----------------------------------------------------
        //	output_processors[]
        // -----------------------------------------------------

        it("output_processors[]", function () {
            //
            assert.ok(jsgui.output_processors['color']);
            //
            var Color = Data_Object.extend('color');
            //
            // Data_Object.init() converts spec = { 'set': spec }, then calls set(spec); 
            // it calls set for each prop, e.g. set('red', 255); set ('green', 0); set('blue', 122);
            // each set() calls get() inside, e.g. get('red');
            // get checks is_defined(this.__type_name), then (a.l == 0)
            // but a.l == 1 because the prop name is passed (e.g. 'red'), 
            // and get() throws 'not yet implemented'
            //
            var red = null;
            red = new Color({ 'red': 255, 'green': 0, 'blue': 122 });
        });

        // -----------------------------------------------------
        //	input_processors[]
        // -----------------------------------------------------

        it("input_processors[]", function () {
            //
            // it seems that Data_Object is unable to use input_processors[] because
            // the appropriate set() code branch throws an exception:
            //
            //if (is_defined(this._data_type_name) && input_processors[this._data_type_name]) {
            //    // use the input processor of the data_type.
            //    throw 'stop';
            //
            // I was failed to create a test showing this exception because there are 3 ensure_data_type_data_object_constructor() function instances:
            //  1. inside data-object.js
            //  2. inside enhanced-data-object.js 
            //  3. inside jsgui-lang-util.js 
            //
            // the only version setting _data_type_name is inside jsgui-lang-util.js, but it does not calls;
            // jsgui.ensure_data_type_data_object_constructor variable seems set to enhanced-data-object.js instance
            // 
            assert.ok(false);
        });

        //#endregion  input_processors, output_processors


    });


});


