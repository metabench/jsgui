
//describe("z_core/data-object /Data_Object.spec.js ", function () {
describe("Data_Object tests", function () {

    var Data_Object;
    var Data_Value;
    var Data_Structures;
    var Constraint;
    var Enhanced_Data_Object;
    var assert;
    var test_utils;

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

        var jsgui_module_name = require.resolve('../../../core/jsgui-lang-essentials');
        delete require.cache[jsgui_module_name];
        //
        Data_Object = require('../../../core/data-object');
        Data_Value = require('../../../core/data-value');
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
        //
        //  save values:
        //
        //save_jsgui_Data_Object = jsgui.Data_Object;
        //save_jsgui_Collection = jsgui.Collection;
        //save_jsgui_Data_Value = jsgui.Data_Value;
        ////
        //save_jsgui__data_id_method = jsgui.__data_id_method;
        ////
        //save_Data_Object_Enhanced_Data_Object = Data_Object.get_Enhanced_Data_Object();
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

    //after(function () {
    //    //
    //    //  restore values:
    //    //
    //    jsgui.Data_Object = save_jsgui_Data_Object;
    //    jsgui.Collection = save_jsgui_Collection;
    //    jsgui.Data_Value = save_jsgui_Data_Value;
    //    //
    //    jsgui.__data_id_method = save_jsgui__data_id_method;
    //    //
    //    Data_Object.set_Enhanced_Data_Object(save_Data_Object_Enhanced_Data_Object);
    //});

    describe("new Data_Object(spec)", function () {

        // ======================================================
        //
        //	                Initialization
        //
        // ======================================================

        // -----------------------------------------------------
        //	init()
        // -----------------------------------------------------

        //this.log = '<mark>Something</mark> a user has logged.\n\nI am currently in the process of fixing indentation';
        //this.tag = "yellow";

        it("no spec or empty spec", function () {
            var data_object = null;
            //
            // no spec:
            data_object = new Data_Object();
            assert.deepEqual(data_object.__type, 'data_object');
            assert.deepEqual(data_object._, {});
            //
            // empty spec:
            data_object = new Data_Object({});
            assert.deepEqual(data_object.__type, 'data_object');
            assert.deepEqual(data_object._, {});
        });

        it("abstract: spec is constructor", function () {
            var TypeConstructor = function () { };
            TypeConstructor.abstract = true;
            //
            var data_object = new Data_Object(TypeConstructor);
            //
            assert.deepEqual(data_object._abstract, true);
            assert.deepEqual(data_object._type_constructor, TypeConstructor);
            //
            // BTW, in contrast to "real" (non-abstract) Data_Object:
            //assert.deepEqual(data_object.__type, undefined);
            //assert.deepEqual(data_object._, undefined);
        });

        it("abstract: spec is object", function () {
            var data_object = new Data_Object({ abstract: true });
            //
            assert.deepEqual(data_object._abstract, true);
            assert.deepEqual(data_object._spec, { abstract: true });
            //
            // BTW, in contrast to "real" (non-abstract) Data_Object:
            //assert.deepEqual(data_object.__type, undefined);
            //assert.deepEqual(data_object._, undefined);
        });

        // -----------------------------------------------------
        //	spec: call a method
        // -----------------------------------------------------

        //var myConstraints = { Field1: "int" };
        //var data_object = new Data_Object({ constraints: myConstraints }); // calls constraints(myConstraints)
        //assert.deepEqual(data_object._field_constraints, myConstraints);

        it("call a method // spec: { method_name: method_parameter }", function () {
            //
            // it should call methods mentioned in the spec, passing parameter from the spec
            //
            // if typeof(spec)=="object", then it iterates over the spec fields. 
            // If the Data_Object contains a method named as the spec field name, 
            // then it calls the method passing the field value as a parameter.
            // I.e. spec looks like { method_name: method_parameter }
            //
            var data_object = new Data_Object({ set_field: { Field1: "int" } }); // calls set_field({ Field1: "int" })
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }]]);
        });

        // -----------------------------------------------------
        //	spec: set chained fields
        // -----------------------------------------------------

        it("set chained fields // spec: { field_name: field_value }", function () {
            //
            // it should set chained fields mentioned in the spec
            //
            // if typeof(spec)=="object", then it iterates over the spec fields. 
            // If the Data_Object does not contains a method named as the spec field name, 
            // but there is a chained field with the name, then it calls set(chained_field_name, value)
            // I.e. spec looks like { chained_field_name: value }
            //
            var Data_Object_Ex = Data_Object.extend({
                fields: { Field1: "int", Field2: "text" }
            });
            //
            var data_object = new Data_Object_Ex({ Field2: "abc" });
            //
            assert.deepEqual(data_object.get(), { Field2: new Data_Value({ value: "abc" }) });
        });

        // -----------------------------------------------------
        //	spec: event_bindings
        // -----------------------------------------------------

        it("spec.event_bindings", function () {
            //
            // it should prohibit the event_bindings parameter ???
            //
            // !!! it seems was intended to process spec.event_bindings,
            // !!! but presently it throws an exception
            //
            assert.throws(function () { new Data_Object({ event_bindings: [] }); });
        });

        // -----------------------------------------------------
        //	spec: constraint
        // -----------------------------------------------------

        it("spec.constraint", function () {
            // !!! it seems was intended to process spec.constraint,
            // !!! but presently it throws an exception
            //
            assert.throws(function () { new Data_Object({ constraint: {} }); });
        });

        // -----------------------------------------------------
        //	spec: parent
        // -----------------------------------------------------

        it("spec.parent", function () {
            // !!! it seems was intended to process spec.parent,
            // !!! but presently it throws an exception
            //
            assert.throws(function () { new Data_Object({ parent: new Data_Object() }); });
        });
        // new Data_Object({ parent: ? });  - calls set('parent',..) instead of parent()
        //var data_object = new Data_Object({ parent: 123 });
        //var data_object = new Data_Object();
        //data_object.set("parent2", 123);
        //assert.deepEqual(data_object.get(), { parent: new Data_Value({ value: 123 }) });

    });

    describe("creation related methods", function () {

        // ======================================================
        //
        //	                 creation related methods
        //
        // ======================================================

        // -----------------------------------------------------
        //	dobj()
        // -----------------------------------------------------

        it("dobj() - Data_Object", function () {
            //
            // test dobj() creating Data_Object instance
            //
            var data_object = Data_Object.dobj();
            assert.ok(!(data_object instanceof Enhanced_Data_Object));
            assert.deepEqual(data_object.field(), []);
            //
            // data_def parameter does nothing: !!!
            //
            data_object = Data_Object.dobj({}, { Field1: "int" });
            assert.deepEqual(data_object.field(), []);
            //
            // set values:
            //
            data_object = Data_Object.dobj({ Field1: 111, Field2: 222 });
            assert.deepEqual(data_object.get("Field1"), new Data_Value({value: 111}));
            assert.deepEqual(data_object.get("Field2"), new Data_Value({ value: 222 }));
        });

        it("dobj() - Enhanced_Data_Object", function () {
            //
            // test dobj() creating Enhanced_Data_Object instance
            //
            // prepare dobj() to create Enhanced_Data_Object:
            assert.deepEqual(Data_Object.get_Enhanced_Data_Object(), null);
            Data_Object.set_Enhanced_Data_Object(Enhanced_Data_Object);
            assert.deepEqual(Data_Object.get_Enhanced_Data_Object(), Enhanced_Data_Object);
            //
            // test dobj() without parameters:
            var data_object = Data_Object.dobj();
            assert.deepEqual(data_object.field(), [["flags", ["collection", "string"]]]);
            assert.ok(data_object instanceof Enhanced_Data_Object);
            //
            // data_def parameter does nothing: !!!
            //
            data_object = Data_Object.dobj({}, { Field1: "int" });
            assert.deepEqual(data_object.field(), [["flags", ["collection", "string"]]]);
            //
            // set values:
            //
            data_object = Data_Object.dobj({ Field1: 111, Field2: 222 });
            assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: 111 }));
            assert.deepEqual(data_object.get("Field2"), new Data_Value({ value: 222 }));
            //
            // restore module state (turn off the Enhanced_Data_Object creation mode):
            Data_Object.set_Enhanced_Data_Object(null);
        });

        it("dobj() - doc example", function () {
            var data_object = null;
            //
            // empty:
            //
            data_object = Data_Object.dobj();
            assert.deepEqual(data_object.field(), []);
            assert.deepEqual(data_object.value(), {});
            //
            // set values:
            //
            data_object = Data_Object.dobj({ Field1: 111, Field2: 222 });
            assert.deepEqual(data_object.value(), { Field1: 111, Field2: 222 });
            assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: 111 }));
            assert.deepEqual(data_object.get("Field2"), new Data_Value({ value: 222 }));
            //
            // data_def does nothing: !!!
            //
            data_object = Data_Object.dobj({}, { Field1: "int" });
            assert.deepEqual(data_object.field(), []);
        });

        // -----------------------------------------------------
        //	ensure_data_type_data_object_constructor()
        // -----------------------------------------------------

        it("ensure_data_type_data_object_constructor()", function () {
            //
            // prepare the "pure" environment:
            //
            var save_map_data_type_data_object_constructors = jsgui.map_data_type_data_object_constructors;
            var save_data_types_info = jsgui.data_types_info;
            //
            jsgui.map_data_type_data_object_constructors = [];
            jsgui.data_types_info = [];
            //
            assert.deepEqual(Data_Object.get_Enhanced_Data_Object(), null);
            //
            // add the test data type, create the constructor:
            //
            jsgui.data_types_info['my_test_type'] = { Field1: "int", Field2: "number" };
            var MyTestTypeConstructor = Data_Object.ensure_data_type_data_object_constructor('my_test_type');
            //
            // create and check the data object:
            //
            var data_object = new MyTestTypeConstructor();
            assert.ok(data_object instanceof Data_Object);
            assert.ok(!(data_object instanceof Enhanced_Data_Object));
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }], ["Field2", "number", { data_type: "number" }]]);
            //
            assert.deepEqual(jsgui.map_data_type_data_object_constructors['my_test_type'], MyTestTypeConstructor);
            //
            // restore the environment:
            //
            jsgui.data_types_info = save_data_types_info;
            jsgui.map_data_type_data_object_constructors = save_map_data_type_data_object_constructors;
        });

        // -----------------------------------------------------
        //	map_data_type_data_object_constructors
        // -----------------------------------------------------

        it("map_data_type_data_object_constructors", function () {
            //
            // The following code is contained in the data_object.js module:
            // jsgui.map_data_type_data_object_constructors['boolean'] = Data_Value;
            //
            assert.deepEqual(Data_Object.map_data_type_data_object_constructors['boolean'], Data_Value);
        });

    });

    describe("Data_Object.extend()", function () {

        // ======================================================
        //
        //	                 Data_Object.extend()
        //
        // ======================================================

        // -----------------------------------------------------
        //	base extension
        // -----------------------------------------------------

        it("usual class extension", function () {
            //
            // extend Data_Object class: add a property and a method:
            //
            // create test class:
            var Data_Object_Ex = Data_Object.extend({
                Prop1: 123,
                Func1: function () { return "hello"; }
            });
            //
            // create test class object:
            var data_object = new Data_Object_Ex();
            //
            // check the result:
            assert.deepEqual(data_object.Prop1, 123);
            assert.deepEqual(data_object.Func1(), "hello");
            //
            // override Data_Object.stringify() method:
            //
            // check the initial stringify() behaviour:
            data_object._ = "123";
            assert.deepEqual(data_object.stringify(), 'Data_Object("123")');
            //
            // create the test class:
            var Data_Object_Ex_2 = Data_Object.extend({
                stringify: function () { return this._super() + "-extended"; }
            });
            //
            // create the test object:
            data_object = new Data_Object_Ex_2();
            //
            // check the result:
            data_object._ = "123";
            assert.deepEqual(data_object.stringify(), 'Data_Object("123")-extended');
        });

        // -----------------------------------------------------
        //	jsgui.data_types_info[]
        // -----------------------------------------------------

        it("use jsgui.data_types_info[]: data type info as string", function () {
            //
            // it should use type information from jsgui.data_types_info
            //
            // save the jsgui.data_types_info:
            var old_data_types_info = jsgui.data_types_info;
            //
            // prepare test data type info:
            jsgui.data_types_info = [];
            jsgui.data_types_info["depth"] = "int";
            //
            // create the test class:
            var Data_Object_Ex = Data_Object.extend("depth");
            //
            // check the test class:
            // !!! the keys (property names) and values are equal,
            // !!! is it indended and useful?
            assert.deepEqual(Data_Object_Ex.depth, "depth"); // !!!
            assert.deepEqual(Data_Object_Ex.int, "int"); // !!!
            assert.deepEqual(Data_Object_Ex["int"], "int"); // !!!
            //
            // create the test class object:
            var data_object = new Data_Object_Ex();
            //
            // check the test class object:
            assert.deepEqual(data_object.__type_name, "data_object"); // !!! "depth" changed to "data_object" inside the init() method
            assert.deepEqual(data_object.__data_type_info, "int");
            //
            // restore the jsgui.data_types_info:
            jsgui.data_types_info = old_data_types_info;
        });

        it("use jsgui.data_types_info[]: data type info as object", function () {
            //
            // it should use type information from jsgui.data_types_info
            //
            // save the jsgui.data_types_info:
            var old_data_types_info = jsgui.data_types_info;
            //
            // prepare test data type info:
            jsgui.data_types_info = [];
            jsgui.data_types_info['my_test_type'] = { Field1: "int", Field2: "number" };
            //
            // create the test class:
            var Data_Object_Ex = Data_Object.extend("my_test_type");
            //
            // check the test class:
            //
            // !!! the keys (property names) and values are equal
            // !!! is it indended and useful?
            //
            // !!! the data type info can be accessed by any object as key (e.g. empty object: {})
            // !!! because objects are converted to "[object Object]" when used as associative array keys
            //
            assert.deepEqual(Data_Object_Ex.my_test_type, "my_test_type"); // !!!
            assert.deepEqual(Data_Object_Ex[{}], { Field1: "int", Field2: "number" }); // !!!
            assert.deepEqual(Data_Object_Ex["[object Object]"], { Field1: "int", Field2: "number" }); // !!!
            //
            // create the test class object:
            var data_object = new Data_Object_Ex();
            //
            // check the test class object:
            assert.deepEqual(data_object.__type_name, "data_object"); // !!! "my_test_type" changed to "data_object" inside the init() method
            assert.deepEqual(data_object.__data_type_info, { Field1: "int", Field2: "number" });
            //
            // restore the jsgui.data_types_info:
            jsgui.data_types_info = old_data_types_info;
        });

        // -----------------------------------------------------------------------------
        //	(name.charAt(0) === '#') addition  (just like the corresponding Class test)
        // -----------------------------------------------------------------------------

        it("#name feature: 1 level", function () {
            //
            // it should extend the original Class by this custom addition...
            //
            // create test class:
            var Data_Object_Ex = Data_Object.extend({
                'prop1': 111,
                'prop2': 222,
                '#prop3': 'prop1'
            });
            //
            // create test data object:
            var data_object = new Data_Object_Ex();
            //
            // check the data_object:
            assert.equal(data_object.prop1, 111);
            assert.equal(data_object.prop2, 222);
            assert.equal(data_object.prop3, 111);
            assert.equal(data_object['#prop3'], undefined);
            //
            // check if the properties still be connected:
            data_object.prop1 = 1000; // change the .prop1 value
            assert.equal(data_object.prop3, 111); // .prop3 not changed
        });

        it("#name feature: 2 levels", function () {
            //
            // it should extend the original Class by this custom addition...
            //
            // create test classes:
            var Data_Object_2 = Data_Object.extend({
                'prop1': 111,
                'prop2': 222
            });
            var Data_Object_3 = Data_Object_2.extend({
                'prop3': 333,
                '#prop4': 'prop2'
            });
            //
            // create test objects:
            var do2 = new Data_Object_2();
            var do3 = new Data_Object_3();
            //
            // quick main check:
            assert.equal(do3['prop4'], 222);
            assert.equal(do3.prop4, 222);
            //
            // do2 detailed check:
            assert.equal(do2.prop1, 111);
            assert.equal(do2.prop2, 222);
            assert.equal(do2.prop3, undefined);
            assert.equal(do2.prop4, undefined);
            assert.equal(do2['#prop4'], undefined);
            //
            // do3 detailed check:
            assert.equal(do3.prop1, 111);
            assert.equal(do3.prop2, 222);
            assert.equal(do3.prop3, 333);
            assert.equal(do3.prop4, 222);
            assert.equal(do3.prop5, undefined);
            //
            // check if the properties still be connected:
            do3.prop2 = 2000;
            assert.equal(do3.prop4, 222); // not changed
        });

        // -----------------------------------------------------
        //	post_init()
        // -----------------------------------------------------

        it("post_init feature", function () {
            //
            // it should call the post_init method (if present)
            //
            var Data_Object_Ex = Data_Object.extend({
                post_init: function () { this.PI = 3.14; }
            });
            var data_object = new Data_Object_Ex();
            //
            assert.deepEqual(data_object.PI, 3.14);
        });

        // -----------------------------------------------------
        //	for_class[]
        // -----------------------------------------------------

        it("for_class feature", function () {
            //
            // should assign some values to the resulting class instead of the class instance
            //
            // save the environment:
            var old_map_classes = jsgui.map_classes;
            //
            // class_name, fields, and connect_fields are involved into "for_class" feature:
            //
            var Data_Object_Ex = Data_Object.extend({
                class_name: { name: "MyClass" }, // object
                fields: { f1: 1, f2: 2 },  // object
                connect_fields: false  // boolean
            });
            var data_object = new Data_Object_Ex();
            //
            // check the class:
            assert.deepEqual(Data_Object_Ex._class_name, { name: "MyClass" });
            assert.deepEqual(Data_Object_Ex._fields, { f1: 1, f2: 2 });
            assert.deepEqual(Data_Object_Ex._connect_fields, false);
            //
            // check the object:
            assert.deepEqual(data_object.class_name, undefined);
            assert.deepEqual(data_object.fields, undefined);
            assert.deepEqual(typeof (data_object.connect_fields), "function"); // the Data_Object.connect_fields method
            //
            // the 'for_class' feature works for 'object' and 'boolean' types only;
            // other types just extends the class as usual:
            //
            var func_fields = function () { };
            //
            Data_Object_Ex = Data_Object.extend({
                class_name: "MyClass",  // not object
                fields: func_fields,  // not object
                connect_fields: 100  // not boolean
            });
            data_object = new Data_Object_Ex();
            //
            // check the class:
            assert.deepEqual(Data_Object_Ex._class_name, undefined);
            assert.deepEqual(Data_Object_Ex._fields, undefined);
            assert.deepEqual(Data_Object_Ex._connect_fields, undefined);
            //
            // check the object:
            assert.deepEqual(data_object.class_name, "MyClass");
            assert.deepEqual(data_object.fields, func_fields);
            assert.deepEqual(data_object.connect_fields, 100);
            //
            // restore the environment:
            jsgui.map_classes = old_map_classes;
        });

        // -----------------------------------------------------
        //	jsgui.map_classes[]
        // -----------------------------------------------------

        it("jsgui.map_classes[]", function () {
            //
            // probably should register Data_Object derived classes in map_classes[]
            //
            // save the environment:
            var old_map_classes = jsgui.map_classes;
            //
            // create the test class (trying to set Class['class_name']):
            var Data_Object_Ex = Data_Object.extend({
                class_name: { name: "MyClass" }
            });
            //
            // no effect. I see no way to set the 'class_name' property for a derived class. // !!!
            //
            assert.deepEqual(Data_Object_Ex['class_name'], undefined);
            assert.deepEqual(jsgui.map_classes, old_map_classes);
            //
            // restore the environment:
            jsgui.map_classes = old_map_classes;
        });

        // -----------------------------------------------------
        //	_superclass
        // -----------------------------------------------------

        it("base class reference", function () {
            //
            // it should keep the base class reference
            //
            // function to get the base class:
            function calcSuperClass(ctor) {
                var result = [];
                jsgui.iterate_ancestor_classes(ctor, function (_class) { result.push(_class); });
                return result[1];
            }
            //
            // create derived class:
            var Data_Object_Ex = Data_Object.extend({});
            // check the base class:
            assert.deepEqual(calcSuperClass(Data_Object_Ex), Data_Object);
            //
            // create next level derived class:
            var Data_Object_Ex_2 = Data_Object_Ex.extend({});
            // check the base class:
            assert.deepEqual(calcSuperClass(Data_Object_Ex_2), Data_Object_Ex);
        });

    });

    describe("context", function () {

        // ======================================================
        //
        //	                 context
        //
        // ======================================================

        //
        // parent() and other methods (_fp_parent(), position_within(), and remove_from()) use different implementation private variables
        //

        it("_id() doc example", function () {
            //
            // no id, no context: no way to create the id:
            //
            var data_object = new Data_Object();
            assert.throws(function () { data_object._id(); });
            //
            //
            // it can pass id in the constructor spec
            //
            data_object = new Data_Object({ _id: "118" });
            assert.deepEqual(data_object._id(), "118");
            //
            //
            // it can generate the id using the context new_id() method:
            //
            // fake context:
            var nextId = 7;
            var context = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            //
            // create the data object with context:
            data_object = new Data_Object({ context: context });
            //
            // check the generated id:
            assert.deepEqual(data_object._id(), "data_object_007");
            //
            // check again to ensure it is not changed:
            assert.deepEqual(data_object._id(), "data_object_007"); // the same as above, new_id() was not called
        });

        it("no id", function () {
            //
            // no id, no context: no way to create the id:
            //
            var data_object = new Data_Object();
            assert.throws(function () { data_object._id(); });
        });

        it("spec._id", function () {
            //
            // it can pass id in the constructor spec
            //
            var data_object = new Data_Object({ _id: "118" });
            assert.deepEqual(data_object._id(), "118");
        });

        // -----------------------------------------------------
        //	spec.context
        // -----------------------------------------------------

        it("spec.context", function () {
            var data_object = null;
            //
            // create the id using context.new_id() method:
            //
            // the fake context:
            var nextId = 7;
            var myContext = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            //
            // create the data object:
            data_object = new Data_Object({ context: myContext });
            //
            // check the generated id:
            assert.deepEqual(data_object._id(), "data_object_007");
            //
            // check again to ensure it is not changed:
            assert.deepEqual(data_object._id(), "data_object_007"); // the same as above, new_id() was not called
        });

        // -----------------------------------------------------
        //	parent(): 
        // -----------------------------------------------------

        it("parent()", function () {
            //
            // it should be able to have a parent 
            // BTW: all this works just like Data_Value.parent()
            //
            var data_object = null;
            //
            // no parent:
            //
            data_object = new Data_Object();
            assert.deepEqual(data_object.parent(), undefined);
            //
            // set something as parent:
            //
            data_object.parent("123");
            assert.deepEqual(data_object.parent(), "123");
            assert.throws(function () { data_object._id(); });
            //
            // set something as parent (with index):
            //
            data_object.parent("777", 0);
            assert.deepEqual(data_object.parent(), "777");
            assert.throws(function () { data_object._id(); });
            //
            // set a parent with a context:
            //
            // fake context:
            var nextId = 7;
            var myContext = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            //
            // fake parent:
            var myParent = { _context: myContext };
            data_object.parent(myParent);
            //
            // check:
            assert.deepEqual(data_object.parent(), myParent);
            assert.deepEqual(data_object._id(), "data_object_007");
            //
            // set a parent with a context, with index:
            //
            data_object = new Data_Object();
            assert.deepEqual(data_object.parent(), undefined);
            //
            data_object.parent(myParent, 0);
            assert.deepEqual(data_object.parent(), myParent);
            assert.deepEqual(data_object._id(), "data_object_008");
        });

        // -----------------------------------------------------
        //	_fp_parent()
        // -----------------------------------------------------

        it("_fp_parent()", function () {
            var data_object = new Data_Object();
            //
            // the test contains some implementation specific things to make the test simpler, sorry
            //
            // _fp_parent() always returns undefined (here and below):  !!!
            //
            assert.deepEqual(data_object._fp_parent(), undefined);
            //
            // _fp_parent(data_object) does nothing besides the _context setting:  !!!
            //
            // create parent:
            var parent_data_object = new Data_Object();
            parent_data_object._context = "context1";  // implementation specific!
            //
            // set the parent:
            data_object._fp_parent(parent_data_object);
            //
            assert.deepEqual(data_object._parents, undefined); // implementation specific! // no effect !!!
            assert.deepEqual(data_object._relationships, undefined); // implementation specific!
            assert.deepEqual(data_object._fp_parent(), undefined); // no effect !!!
            assert.deepEqual(data_object.parent(), undefined);
            //
            assert.deepEqual(data_object._context, "context1"); // implementation specific!
            //
            // _fp_parent(data_object, position) changes the _parents variable:
            //
            var nextId = 7;
            var context = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            //
            parent_data_object._context = context; // implementation specific !!!
            data_object._fp_parent(parent_data_object, 3);
            //
            assert.deepEqual(data_object._parents, { 'data_object_007': [parent_data_object, 3] });  // implementation specific!
            assert.deepEqual(data_object._relationships, undefined); // implementation specific!
            assert.deepEqual(data_object._fp_parent(), undefined); // no effect !!!
            assert.deepEqual(data_object.parent(), undefined);
        });

        // -----------------------------------------------------
        //	position_within()
        // -----------------------------------------------------

        it("position_within()", function () {
            //
            // it should returns the position within a parent
            //
            var data_object = new Data_Object();
            //
            var nextId = 7;
            var context = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            var parent_data_object = new Data_Object({ context: context });
            //
            // parent not set - returns undefined:
            //
            assert.deepEqual(data_object.position_within(parent_data_object), undefined);
            //
            // _fp_parent(parent_data_object) does nothing anyway (besides the _context setting): 
            //
            data_object._fp_parent(parent_data_object);
            assert.deepEqual(data_object.position_within(parent_data_object), undefined);
            //
            //  _fp_parent(data_object, position) sets the parent and position,
            // position_within() returns the position:
            //
            data_object._fp_parent(parent_data_object, 3);
            assert.deepEqual(data_object.position_within(parent_data_object), 3);
            //
            // throws an exception if the parent candidate is unable to provide _id():
            //
            var other_data_object = new Data_Object();
            assert.throws(function () { data_object.position_within(other_data_object); });
        });

        // -----------------------------------------------------
        //	remove_from()
        // -----------------------------------------------------

        it("remove_from()", function () {
            //
            // it should probably remove from parent
            //
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
            // remove_from() throws an exception: !!!
            //            
            assert.throws(function () { data_object.remove_from(parent_data_object); });
        });

        // -----------------------------------------------------
        //	Mini_Context
        // -----------------------------------------------------

        it("Mini_Context", function () {
            var mini_context = new Data_Object.Mini_Context();
            assert.throws(function () { mini_context.new_id(); }, /stop Mini_Context typed id/); // !!!
        });

    });

    describe("Fields", function () {

        // ======================================================
        //
        //	                 Fields
        //
        // ======================================================

        // -----------------------------------------------------
        //	field(), set_field()
        // -----------------------------------------------------

        it("field(), set_field()", function () {
            //
            // it should be able to get/set fields
            //
            var data_object = null;
            //
            // initial state:
            data_object = new Data_Object();
            assert.deepEqual(data_object.field(), []);
            //
            // add a field:
            data_object.set_field("Field1", "int");
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }]]);
            //
            // add 2 other fields:
            data_object.field({ Field2: "string", Field3: "bool" });
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }], ["Field2", "string", { data_type: "string" }], ["Field3", "bool", { data_type: "bool" }]]);
            //
            // get fields:
            assert.deepEqual(data_object.field("Field2"), ["Field2", "string", { data_type: "string" }]);
            assert.deepEqual(data_object.field("Field5"), undefined);
            //
            // setting the same field again adds a field with the same name !!!
            //
            data_object = new Data_Object();
            //
            // set "Field1" field:
            data_object.set_field("Field1", "int");
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }]]);
            //
            // set "Field1" field again (change the type):
            data_object.set_field("Field1", "bool");
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }], ["Field1", "bool", { data_type: "bool" }]]); // 2 fields "Field1" !!!
        });

        // -----------------------------------------------------
        //	field()
        // -----------------------------------------------------

        it("field()", function () {
            var data_object = new Data_Object();
            assert.deepEqual(data_object.field(), []);
            //
            data_object.set_field("Field1", "int");
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }]]);
        });

        it("field(field_name)", function () {
            var data_object = new Data_Object();
            assert.deepEqual(data_object.field("Field1"), undefined);
            //
            data_object.set_field("Field1", "int");
            assert.deepEqual(data_object.field("Field1"), ["Field1", "int", { data_type: "int" }]);
        });

        it("field(obj)", function () {
            var data_object = new Data_Object();
            //
            data_object.field({ Field2: "string", Field3: "bool" });
            assert.deepEqual(data_object.field(), [["Field2", "string", { data_type: "string" }], ["Field3", "bool", { data_type: "bool" }]]);
        });

        // -----------------------------------------------------
        //	read_only()
        // -----------------------------------------------------

        it("read_only()", function () {
            //
            // it should get/set read_only state for fields
            //
            // there are no way to get read_only state besides internal _map_read_only property use !!!
            //
            var data_object = null;
            //
            data_object = new Data_Object();
            assert.deepEqual(data_object._map_read_only, undefined);
            assert.deepEqual(data_object.read_only(), undefined);
            assert.deepEqual(data_object._map_read_only, {});
            //
            data_object.read_only('f1');
            assert.deepEqual(data_object._map_read_only, { f1: true });
            assert.deepEqual(data_object.read_only(), undefined); // !!!
            //
            data_object.read_only('f1', false);
            assert.deepEqual(data_object._map_read_only, { f1: null });
            assert.deepEqual(data_object.read_only(), undefined); // !!!
            //
            data_object.read_only('f1', true);
            assert.deepEqual(data_object._map_read_only, { f1: true });
            assert.deepEqual(data_object.read_only(), undefined); // !!!
            //
            data_object.read_only(['f1', 'f2']);
            assert.deepEqual(data_object._map_read_only, { f1: true, f2: true });
            assert.deepEqual(data_object.read_only(), undefined); // !!!
        });

        it("read_only(field_name) - doc example", function () {
            var data_object = new Data_Object();
            //
            data_object.read_only("Field1");
            assert.throws(function () { data_object.set("Field1", 123); }, /Property "Field1" is read-only./);
        });

        it("read_only(field_name, value) - doc example", function () {
            var data_object = new Data_Object();
            //
            data_object.read_only("Field1");
            assert.throws(function () { data_object.set("Field1", 123); }, /Property "Field1" is read-only./);
            assert.deepEqual(data_object.get("Field1"), undefined);
            //
            data_object.read_only("Field1", false);
            data_object.set("Field1", 123);
            assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: 123 }));
        });

        it("Fields_Collection", function () {
            assert.deepEqual(Data_Object.Fields_Collection.parse_field_text("not_null int"), { data_type: "int", not_null: true });
        });

        it("parse_field_text(field_text)", function () {
            assert.deepEqual(Data_Object.parse_field_text("not_null int"), { data_type: "int", not_null: true });
        });

    });

    describe("Constraints", function () {

        // ======================================================
        //
        //	                 Constraints
        //
        // ======================================================

        // -----------------------------------------------------
        //	data_def()
        // -----------------------------------------------------

        it("data_def()", function () {
            //
            // does nothing !!!
            //
            var data_object = new Data_Object();
            data_object.data_def({ Field1: "int" });
            //
            assert.deepEqual(data_object._field_constraints, undefined); // no changes !!!
            assert.deepEqual(data_object.data_def(), undefined); // returns nothing !!!
        });

        // -----------------------------------------------------
        //	constraints()
        // -----------------------------------------------------

        it("constraints()", function () {
            var data_object = null;
            //
            // it seems that the constraints should be an object with key/value pairs, probably field_name/field_constraint:
            //
            // initial state: no constraints:
            data_object = new Data_Object();
            assert.deepEqual(data_object._field_constraints, undefined);
            assert.deepEqual(data_object.constraints(), undefined);
            //
            // set field constraints:
            var myConstraints = { Field1: "int" };
            data_object.constraints(myConstraints);
            assert.deepEqual(data_object._field_constraints, myConstraints);
            //
            // !!! constraints() without parameters seems intended to return the field constraints, but it returns undefined
            assert.deepEqual(data_object.constraints(), undefined); // !!!
        });

        // -----------------------------------------------------
        //	matches_field_constraint()
        // -----------------------------------------------------

        it("matches_field_constraint()", function () {
            var data_object = null;
            //
            // !!! data_object.set() creates an internal Data_Value, it does not matches the constraints always:
            //
            data_object = new Data_Object();
            data_object.set("Field1", 12.5);
            assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: 12.5 }));
            //
            assert.deepEqual(data_object.matches_field_constraint("Field1", "int"), false);
            assert.deepEqual(data_object.matches_field_constraint("Field1", "number"), false); // !!!
        });

        // -----------------------------------------------------
        //	matches_field_constraints()
        // -----------------------------------------------------

        it("matches_field_constraints()", function () {
            var data_object = new Data_Object();
            //
            // it seems that the constraints should be an object with key/value pairs, probably field_name/field_constraint:
            //
            var myConstraints = { Field1: "int", Field2: "number" };
            data_object.constraints(myConstraints);
            assert.deepEqual(data_object._field_constraints, myConstraints);
            //
            // 1) [] without parameters:
            // !!! always returns undefined
            assert.deepEqual(data_object.matches_field_constraints(), undefined);  // !!!
            //
            // 2) [o] object parameter:
            // !!! always returns undefined
            assert.deepEqual(data_object.matches_field_constraints(myConstraints), undefined);  // !!!
            //
            // 3) [D] Data_Object parameter:
            // it can check other Data_Object values for its constrains (not other Data_Object constrains):
            // !!! always return false because the values are wrapped into Data_Value objects:
            //
            var other_data_object = new Data_Object();
            other_data_object.set("Field1", 1); 
            other_data_object.set("Field2", 1.5);
            //
            assert.deepEqual(data_object.matches_field_constraints(other_data_object), false); // must be true !!!
        });

        // -----------------------------------------------------
        //	Data_Object.matches_field_constraints() - static 
        // -----------------------------------------------------

        it("Data_Object.matches_field_constraints()", function () {
            var data_object = new Data_Object();
            //
            // !!! always returns undefined
            //
            assert.deepEqual(Data_Object.matches_field_constraints(null, {}), undefined);
            assert.deepEqual(Data_Object.matches_field_constraints(data_object, {}), undefined);
            assert.deepEqual(Data_Object.matches_field_constraints(data_object, { Field1: "int", Field2: "number" }), undefined);
        });

        // -----------------------------------------------------
        //	obj_matches_field_constraints()
        // -----------------------------------------------------

        it("obj_matches_field_constraints()", function () {
            var data_object = new Data_Object();
            //
            // it seems that the constraints should be an object with key/value pairs, probably field_name/field_constraint:
            //
            var myConstraints = { Field1: "int", Field2: "number" };
            data_object.constraints(myConstraints);
            assert.deepEqual(data_object._field_constraints, myConstraints);
            //
            // obj_matches_field_constraints() will calls a matches_field_constraint() method of the passed object
            // we will use a fake method logging the passed arguments:
            //
            var args = [];
            var obj = { matches_field_constraint: function (a, b) { args.push([a, b]); return true; } };
            //
            // so, test it:
            //
            assert.deepEqual(data_object.obj_matches_field_constraints(obj), true);
            assert.deepEqual(args, [["Field1", "int"], ["Field2", "number"]]);
            //
            // now test using a real Data_Object:
            //
            var data_object2 = new Data_Object();
            data_object2.set("Field1", 1);
            data_object2.set("Field2", 1.5);
            //
            // !!! does not match because of the Data_Value wrapping:
            assert.deepEqual(data_object.obj_matches_field_constraints(data_object2), false); // !!! should be true
        });

        it("obj_matches_field_constraints() - doc example", function () {
            var data_object = new Data_Object();
            //
            // set constraint:
            //
            var myConstraints = { Field1: "int", Field2: "number" };
            data_object.constraints(myConstraints);
            //
            // set values for other Data_Object:
            //
            var data_object2 = new Data_Object();
            data_object2.set("Field1", 1);
            data_object2.set("Field2", 1.5);
            //
            // !!! does not match because of the Data_Value wrapping:
            assert.deepEqual(data_object.obj_matches_field_constraints(data_object2), false); // !!! should be true
        });

        // ----------------------------------------------------------------------------------------------
        //	ensure_field_constraint(), get_field_data_type_constraint(), set_field_data_type_constraint
        // ----------------------------------------------------------------------------------------------

        it("ensure_field_constraint(), get_field_data_type_constraint(), set_field_data_type_constraint()", function () {
            //
            // field data type constraint
            //
            var data_object = new Data_Object();
            //
            assert.deepEqual(data_object.get_field_data_type_constraint("Field1"), undefined);
            //
            var field_info = { data_type: "int" };
            //
            data_object.ensure_field_constraint("Field1", field_info);
            //
            var fdtc = data_object.get_field_data_type_constraint("Field1");
            //
            assert.deepEqual(fdtc, Constraint.from_str("int"));
            //
            if (!test_utils.isInBrowser()) {
                // it seems that RequireJs loads separate Constraint modules for data-object.js module and this test.
                // so, the assertion below passes for Node environment, but fails for browser one.
                assert.ok(fdtc instanceof Constraint.Field_Data_Type);
            }
            //
            // ensure_field_constraint(), get_field_data_type_constraint(), set_field_data_type_constraint() are not related to field constraints():
            //
            assert.deepEqual(data_object._field_constraints, undefined);
            //
            // !!! ensuring the constraint again throws an exception:
            //
            assert.throws(function () { data_object.ensure_field_constraint("Field1", field_info); }); // !!!
            assert.throws(function () { data_object.ensure_field_constraint("Field1", { data_type: "text" }); }); // !!!
            //
            // !!! set_field_data_type_constraint() just removes the constraint. The second parameter (data_type_constructor, e.g. String) does not matter.
            //
            data_object.set_field_data_type_constraint("Field1", String);
            //
            assert.deepEqual(data_object.get_field_data_type_constraint("Field1"), undefined);
        });

        it("set_field_data_type_constraint() - doc example", function () {
            var data_object = new Data_Object();
            //
            var field_info = { data_type: "int" };
            data_object.ensure_field_constraint("Field1", field_info);
            //
            assert.deepEqual(data_object.get_field_data_type_constraint("Field1"), Constraint.from_str("int")); // instanceof Constraint.Field_Data_Type
            //
            // !!! set_field_data_type_constraint() just removes the constraint. The second parameter (data_type_constructor, e.g. String) does not matter.
            //
            data_object.set_field_data_type_constraint("Field1", String);
            //
            assert.deepEqual(data_object.get_field_data_type_constraint("Field1"), undefined);
        });

        it("get_field_data_type_constraint() - doc example", function () {
            var data_object = new Data_Object();
            //
            assert.deepEqual(data_object.get_field_data_type_constraint("Field1"), undefined);
            //
            data_object.ensure_field_constraint("Field1", { data_type: "int" });
            //
            assert.deepEqual(data_object.get_field_data_type_constraint("Field1"), Constraint.from_str("int")); // instanceof Constraint.Field_Data_Type
        });

        it("ensure_field_constraint() - doc example", function () {
            var data_object = new Data_Object();
            //
            assert.deepEqual(data_object.get_field_data_type_constraint("Field1"), undefined);
            //
            data_object.ensure_field_constraint("Field1", { data_type: "int" });
            //
            assert.deepEqual(data_object.get_field_data_type_constraint("Field1"), Constraint.from_str("int")); // instanceof Constraint.Field_Data_Type
            //
            // !!! Ensuring the constraint again throws an exception!
            assert.throws(function () { data_object.ensure_field_constraint("Field1", { data_type: "int" }); }, /6\) it is! stop, check to see if it is a Field_Data_Type_Constraint, use instanceOf/);
        });

        it("matches_field_constraints() - doc example", function () {
            var data_object = new Data_Object();
            //
            data_object.constraints({ Field1: "int", Field2: "number" });
            //
            assert.deepEqual(data_object.matches_field_constraints(), undefined);  // !!!
        });

        it("matches_field_constraints(obj) - doc example", function () {
            var data_object = new Data_Object();
            //
            assert.deepEqual(data_object.matches_field_constraints({ Field1: "int", Field2: "number" }), undefined);  // !!!
        });

        it("matches_field_constraints(data_object) - doc example", function () {
            var data_object = new Data_Object();
            //
            data_object.constraints({ Field1: "int", Field2: "number" });
            //
            var data_object2 = new Data_Object();
            data_object2.set("Field1", 1);
            data_object2.set("Field2", 1.5);
            //
            // Returns false instead of true because of the Data_Value wrapping:
            assert.deepEqual(data_object.matches_field_constraints(data_object2), false); // !!!
        });

    });

    describe("requirements", function () {

        // ======================================================
        //
        //	                 requirements
        //
        // ======================================================

        // in general, the requirements feature does nothing

        // -----------------------------------------------------
        //	____requires()
        // -----------------------------------------------------

        it("____requires()", function () {
            var data_object = new Data_Object();
            //
            // ____requires() returns _requirements member variable
            // !!! there is no way to set this variable using methods
            //
            assert.deepEqual(data_object._requirements, undefined);
            assert.deepEqual(data_object.____requires(), undefined);
            //
            var requirements = { abc: 123 };
            data_object._requirements = requirements;
            assert.deepEqual(data_object.____requires(), requirements);
        });

        // -----------------------------------------------------
        //	_____meets_requirements()
        // -----------------------------------------------------

        it("_____meets_requirements()", function () {
            var data_object = new Data_Object();
            //
            // returns true if the requirements are not set
            //
            assert.deepEqual(data_object._requirements, undefined);
            assert.deepEqual(data_object._____meets_requirements(), true);
            //
            // !!! returns undefined if the requirements are set to anything
            //
            var requirements = { abc: 123 };
            data_object._requirements = requirements;
            assert.deepEqual(data_object._____meets_requirements(), undefined);
            assert.deepEqual(data_object._____meets_requirements("Field1"), undefined);
        });

        // -----------------------------------------------------
        //	_____check_requirements()
        // -----------------------------------------------------

        it("_____check_requirements()", function () {
            var data_object = new Data_Object();
            //
            // !!! always returns undefined
            //
            assert.deepEqual(data_object._____check_requirements(), undefined);
            assert.deepEqual(data_object._____check_requirements("Field1"), undefined);
            assert.deepEqual(data_object._____check_requirements(true), undefined);
        });

    });

    describe("fields connection", function () {

        // ======================================================
        //
        //	                 fields connection
        //
        // ======================================================

        // -----------------------------------------------------
        //	connect_fields()
        // -----------------------------------------------------

        it("connect_fields: doc example", function () {
            var Data_Object_Ex = Data_Object.extend({
                fields: { Field1: "number", Field2: "text" },
                connect_fields: true
            });
            var data_object = new Data_Object_Ex();
            //
            data_object.Field1(123);
            assert.deepEqual(data_object.Field1(), new Data_Value({ value: 123 }));
        });

        it("connect_fields(name): doc example", function () {
            var data_object = new Data_Object();
            //
            data_object.connect_fields("Field1");
            data_object.set_field("Field1", "number"); // does not works without it
            //
            // connect_fields() allows to create a function to get/set a field value:
            //
            data_object.Field1(123);
            assert.deepEqual(data_object.Field1(), new Data_Value({ value: 123 }));
            //
            // it can override any other method: !!!
            //
            assert.deepEqual(data_object.stringify(), 'Data_Object({"Field1": 123})');
            //
            data_object.connect_fields("stringify");
            data_object.set_field("stringify", "number"); // does not works without it
            //
            data_object.stringify(45);
            assert.deepEqual(data_object.stringify(), new Data_Value({ value: 45 }));
        });

        it("connect_fields(array): doc example", function () {
            var data_object = new Data_Object();
            //
            data_object.connect_fields(["Field2", "Field3"]);
            //
            data_object.set_field("Field2", "number"); // does not works without it
            data_object.set_field("Field3", "number"); // does not works without it
            //
            data_object.Field2(222);
            data_object.Field3(333);
            //
            assert.deepEqual(data_object.Field2(), new Data_Value({ value: 222 }));
            assert.deepEqual(data_object.Field3(), new Data_Value({ value: 333 }));
        });

        it("connect_fields(obj): doc example", function () {
            var data_object = new Data_Object();
            //
            assert.throws(function(){ data_object.connect_fields({}); }, /16\) stop/); // !!!
        });

        it("connect_fields()", function () {
            var data_object = new Data_Object();
            //
            // connect_fields() allows to add a method to get/set a field value
            //
            //
            // 1. connect_fields(string) overload:
            // ===================================
            //
            data_object.connect_fields("Field1"); // add data_object.Field1() method
            //
            data_object.set_field("Field1", "int"); // it is required to set field with the same name
            //
            // estimated value:
            var data_value_123 = new Data_Value({ value: 123 });
            data_value_123.__type_name = "int";
            //
            // test added Field1() method:
            data_object.Field1(123);
            assert.deepEqual(data_object.Field1(), data_value_123);
            //
            //
            // 2. connect_fields(array) overload:
            // ==================================
            //
            // array parameter calls connect_fields(item) for each array item:
            //
            data_object.connect_fields(["Field2", "Field3"]);
            //
            data_object.set_field("Field2", "int");
            data_object.set_field("Field3", "int");
            //
            var data_value_222 = new Data_Value({ value: 222 });
            data_value_222.__type_name = "int";
            var data_value_333 = new Data_Value({ value: 333 });
            data_value_333.__type_name = "int";
            //
            data_object.Field2(222);
            data_object.Field3(333);
            assert.deepEqual(data_object.Field2(), data_value_222);
            assert.deepEqual(data_object.Field3(), data_value_333);
            //
            //
            // 3. connect_fields(object) overload:
            // ==================================
            // 
            // !!! object parameter is not allowed:
            assert.throws(function () { data_object.connect_fields({}); }); // !!!
            //
            //
            // !!! 4. it does not works without set_field()
            // ============================================
            //
            data_object.connect_fields("Field5");
            assert.throws(function () { data_object.Field5(555); }); // !!!
            //
            // !!! 5. it can override any other method:
            //
            // stringify() works as intended:
            assert.deepEqual(data_object.stringify(), 'Data_Object({"Field1": 123, "Field2": 222, "Field3": 333})');
            assert.deepEqual(typeof data_object.stringify(), "string");
            //
            // connect field named "stringify":
            data_object.connect_fields("stringify");
            //
            // now stringify() returns function instead of string:
            assert.deepEqual(typeof data_object.stringify(), "function"); // !!!
        });

        // -----------------------------------------------------
        //	using_fields_connection()
        // -----------------------------------------------------

        it("using_fields_connection()", function () {
            //
            var data_object = new Data_Object();
            assert.deepEqual(data_object.using_fields_connection(), false);
            //
            var Data_Object_Ex = Data_Object.extend({
                connect_fields: false
            });
            //
            data_object = new Data_Object_Ex();
            assert.deepEqual(data_object.using_fields_connection(), false);
            //
            var Data_Object_Ex_2 = Data_Object_Ex.extend({
                connect_fields: true
            });
            //
            data_object = new Data_Object_Ex_2();
            assert.deepEqual(data_object.using_fields_connection(), true);
            //
            var Data_Object_Ex_3 = Data_Object_Ex_2.extend({
                connect_fields: false
            });
            //
            data_object = new Data_Object_Ex_3();
            assert.deepEqual(data_object.using_fields_connection(), false);
        });

        // -----------------------------------------------------
        //	connect fields:
        // -----------------------------------------------------

        it("connect_fields: false", function () {
            //
            var Data_Object_Ex = Data_Object.extend({
                fields: { Field1: "int", Field2: "text" },
                //connect_fields: false
            });
            var data_object = new Data_Object_Ex();
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }], ["Field2", "text", { data_type: "text" }]]);
            //
            assert.deepEqual(data_object.Field1, undefined);
        });

        it("connect_fields: true", function () {
            //
            var Data_Object_Ex = Data_Object.extend({
                fields: { Field1: "int", Field2: "text" },
                connect_fields: true
            });
            var data_object = new Data_Object_Ex();
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }], ["Field2", "text", { data_type: "text" }]]);
            //
            var data_value_123 = new Data_Value({ value: 123 });
            data_value_123.__type_name = "int";
            //
            data_object.Field1(123);
            assert.deepEqual(data_object.Field1(), data_value_123);
        });

    });

    describe("fields chain", function () {

        // ======================================================
        //
        //	                 fields chain
        //
        // ======================================================

        it("chained fields doc example 1 (object field def)", function () {
            var Data_Object_Ex = Data_Object.extend({
                fields: { Field1: "int", Field2: "text" }
            });
            //
            var data_object = new Data_Object_Ex();
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }], ["Field2", "text", { data_type: "text" }]]);
        });

        it("chained fields doc example 2 (array field def)", function () {
            var Data_Object_Ex = Data_Object.extend({
                fields: [["Field1", "int"], ["Field2", "text"]]
            });
            //
            var data_object = new Data_Object_Ex();
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }], ["Field2", "text", { data_type: "text" }]]);
        });

        it("chained fields doc example 3 (set value in constructor)", function () {
            var Data_Object_Ex = Data_Object.extend({
                fields: { Field1: "int", Field2: "text" }                
            });
            //
            var data_object = new Data_Object_Ex({ Field2: "abc" });
            //
            assert.deepEqual(data_object.get(), { Field2: new Data_Value({ value: "abc" }) });
        });

        it("get_chained_fields() - doc example", function () {
            var Data_Object_Ex = Data_Object.extend({
                fields: { Field1: "int", Field2: "text" }
            });
            //
            assert.deepEqual(Data_Object.get_chained_fields(Data_Object_Ex), [[1, ["Field1", "int"]], [2, ["Field2", "text"]]]);
            //
            var Data_Object_Ex_2 = Data_Object_Ex.extend({
                fields: { Field3: "number" }
            });
            //
            // The item_number values seems not consistent: (1,2,1) !!!
            assert.deepEqual(
                Data_Object.get_chained_fields(Data_Object_Ex_2),
                [[1, ["Field1", "int"]], [2, ["Field2", "text"]], [1, ["Field3", "number"]]]
            );
        });

        it("chained_fields_to_fields_list() - doc example", function () {
            var chained_fields = [[1, ["Field1", "int"]], [2, ["Field2", "text"]], [1, ["Field3", "number"]]];
            //
            assert.deepEqual(Data_Object.chained_fields_to_fields_list(chained_fields), [["Field1", "int"], ["Field2", "text"], ["Field3", "number"]]);
        });

        // -----------------------------------------------------
        //	get_chained_fields(), chained_fields_to_fields_list() - object
        // -----------------------------------------------------

        it("static only - object", function () {
            //
            // should process fields chain specified as object
            // test static usage only (without the Data_Object instance creation)
            //
            var Data_Object_Ex = Data_Object.extend({
                fields: { Field1: "int", Field2: "text" }
            });
            //
            var chained_fields = Data_Object.get_chained_fields(Data_Object_Ex);
            assert.deepEqual(chained_fields, [[1, ["Field1", "int"]], [2, ["Field2", "text"]]]);
            assert.deepEqual(Data_Object.chained_fields_to_fields_list(chained_fields), [["Field1", "int"], ["Field2", "text"]]);
            //
            var Data_Object_Ex_2 = Data_Object_Ex.extend({
                fields: { Field3: "number" }
            });
            //
            chained_fields = Data_Object.get_chained_fields(Data_Object_Ex_2);
            assert.deepEqual(chained_fields, [[1, ["Field1", "int"]], [2, ["Field2", "text"]], [1, ["Field3", "number"]]]); // 1, 2, 1  ???
            assert.deepEqual(Data_Object.chained_fields_to_fields_list(chained_fields), [["Field1", "int"], ["Field2", "text"], ["Field3", "number"]]);
        });

        // -----------------------------------------------------
        //	get_chained_fields(), chained_fields_to_fields_list() - array
        // -----------------------------------------------------

        it("static only - array", function () {
            //
            // should process fields chain specified as array
            // test static usage only (without the Data_Object instance creation)
            //
            var Data_Object_Ex = Data_Object.extend({
                fields: [["Field1", "text"], ["Field2", "number"]]
            });
            //
            var chained_fields = Data_Object.get_chained_fields(Data_Object_Ex);
            assert.deepEqual(chained_fields, [[0, ["Field1", "text"]], [1, ["Field2", "number"]]]);
            assert.deepEqual(Data_Object.chained_fields_to_fields_list(chained_fields), [["Field1", "text"], ["Field2", "number"]]);
            //
            var Data_Object_Ex_2 = Data_Object_Ex.extend({
                fields: [["Field3", "int"]]
            });
            //
            chained_fields = Data_Object.get_chained_fields(Data_Object_Ex_2);
            assert.deepEqual(chained_fields, [[0, ["Field1", "text"]], [1, ["Field2", "number"]], [0, ["Field3", "int"]]]);  // 0, 1, 0 ???
            assert.deepEqual(Data_Object.chained_fields_to_fields_list(chained_fields), [["Field1", "text"], ["Field2", "number"], ["Field3", "int"]]);
        });

        // --------------------------------------------------------------------
        //	set fields in class constructor, set values in object constructor
        // -------------------------------------------------------------------

        it("object field def", function () {
            var Data_Object_Ex = Data_Object.extend({
                fields: { Field1: "int", Field2: "text" }
            });
            var data_object = new Data_Object_Ex({ Field1: 111, Field5: 555 });
            //
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }], ["Field2", "text", { data_type: "text" }]]);
            //
            var data_value_111 = new Data_Value({ value: 111 });
            data_value_111.__type_name = "int";
            //
            assert.deepEqual(data_object.get(), { Field1: data_value_111 });
        });

        it("array field def", function () {
            var Data_Object_Ex = Data_Object.extend({
                fields: [["Field1", "int"], ["Field2", "text"]]
            });
            var data_object = new Data_Object_Ex({ Field1: 111, Field5: 555 });
            //
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }], ["Field2", "text", { data_type: "text" }]]);
            //
            var data_value_111 = new Data_Value({ value: 111 });
            data_value_111.__type_name = "int";
            //
            assert.deepEqual(data_object.get(), { Field1: data_value_111 });
        });

        it("name field def", function () {
            //
            // if the "fields" are just field names:
            // it does not create fields,
            // but it allows to set the values in the object constructor
            //
            var Data_Object_Ex = Data_Object.extend({
                fields: ["Field1", "Field2", "Field3"]
            });
            var data_object = new Data_Object_Ex({ Field1: 111, Field5: 555 });
            //
            assert.deepEqual(data_object.field(), []);
            //
            var data_value_111 = new Data_Value({ value: 111 });
            //
            assert.deepEqual(data_object.get(), { Field1: data_value_111 });
        });

        it("2-level inheritance", function () {
            var data_value_111 = new Data_Value({ value: 111 });
            data_value_111.__type_name = "int";
            var data_value_333 = new Data_Value({ value: 333 });
            //data_value_333.__type_name = "number"; ???
            //
            var Data_Object_Ex = Data_Object.extend({
                fields: { Field1: "int", Field2: "text" }
            });
            var data_object = new Data_Object_Ex({ Field1: 111, Field5: 555 });
            //
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }], ["Field2", "text", { data_type: "text" }]]);
            //
            assert.deepEqual(data_object.get(), { Field1: data_value_111 });
            //
            var Data_Object_Ex_2 = Data_Object_Ex.extend({
                fields: { Field3: "number" }
            });
            data_object = new Data_Object_Ex_2({ Field1: 111, Field3: 333, Field5: 555 });
            assert.deepEqual(data_object.field(), [["Field1", "int", { data_type: "int" }], ["Field2", "text", { data_type: "text" }], ["Field3", "number", { data_type: "number" }]]);
            assert.deepEqual(data_object.get(), { Field1: data_value_111, Field3: data_value_333 });
        });

    });

    describe("get(), set()", function () {

        // ======================================================
        //
        //	   get(), set()
        //
        // ======================================================
        
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

        it("initial state: empty Data_Object", function () {
            var data_object = new Data_Object();
            //
            assert.deepEqual(data_object.field(), []);
            //
            assert.deepEqual(data_object.get(), {});
        });

        describe("set and get values", function () {

            it("should set and get field values", function () {
                var data_object = new Data_Object();
                //
                // with field definition:
                //
                data_object.set_field("Field1", "int");
                data_object.set("Field1", "abc");
                //
                var abc_value = new Data_Value({ value: "abc" });
                abc_value.__type_name = "int";
                //
                assert.deepEqual(data_object.get("Field1"), abc_value);
                //
                // with field definition but without set(): create Data_Value or Data_Object or something else:
                //
                data_object.set_field("Field2", "int");
                assert.deepEqual(data_object.get("Field2"), new Data_Value()); // without __type_name !!!
                //
                // without field definition: create Data_Value for 'string', 'number', 'boolean', 'date':
                //
                data_object.set("Field3", "abc");
                assert.deepEqual(data_object.get("Field3"), new Data_Value({ value: "abc" }));
                //
                // without field definition: create Data_Value too:
                //
                data_object.set("Field4", ["abc"]);
                assert.deepEqual(data_object.get("Field4"), new Data_Value({value: ["abc"]}));
                //
                // without field definition: set Data_Value:
                var data_value_31 = new Data_Value({ value: 31 });
                data_object.set("Field5", data_value_31);
                assert.deepEqual(data_object.get("Field5"), data_value_31);
                //
                //
                // check internal data:
                //
                assert.deepEqual(data_object.field(), [
                    ["Field1", "int", { data_type: "int" }],
                    ["Field2", "int", { data_type: "int" }]
                ]);
                //
                assert.deepEqual(data_object.get(), {
                    Field1: abc_value, // with __type_name = "int"
                    Field2: new Data_Value(),
                    Field3: new Data_Value({ value: "abc" }),
                    Field4: new Data_Value({ value: ["abc"] }),
                    Field5: data_value_31,
                });
            });

            it("set null: get returns undefined", function () {
                var data_object = new Data_Object();
                var set_result = null;
                //
                // without field definition:
                // !!! it allows to set null as pure value, but get() returns undefined:
                //
                set_result = data_object.set("Field1", null);
                assert.deepEqual(data_object.get("Field1"), undefined); // !!!
                assert.deepEqual(set_result, null);
                //
                // with field definition: works ok
                //
                data_object.set_field("Field2", "int");
                set_result = data_object.set("Field2", null);
                //
                var estimated_field2_value = new Data_Value({ value: null });
                estimated_field2_value.__type_name = "int";
                //
                assert.deepEqual(data_object.get("Field2"), estimated_field2_value);
                assert.deepEqual(set_result, estimated_field2_value);
                //
                // !!! with wrong field definition: it sets null as pure value, but get() returns undefined (just like the Field1 case)
                //
                data_object.set_field("Field3", "wrong_type");
                set_result = data_object.set("Field3", null);
                //
                assert.deepEqual(data_object.get("Field3"), undefined); // !!!
                assert.deepEqual(set_result, null);
                //
                // check resulting state:
                //
                assert.deepEqual(data_object.field(), [
                    ["Field2", "int", { data_type: "int" }],
                    ["Field3", "wrong_type", { data_type: "wrong_type" }]
                ]);
                //
                assert.deepEqual(data_object.get(), {
                    Field1: null,
                    Field2: estimated_field2_value,
                    Field3: null
                });
            });

            it("set() result", function () {
                var data_object = new Data_Object();
                var set_result = null;
                //
                // without field definition, wrap value into Data_Value:
                //
                // !!! set() returning value seems inconsistent (pure value for the first time, but wrapped values for next times)
                //
                // first time:
                //
                set_result = data_object.set("Field1", 123);
                assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: 123 }));
                assert.deepEqual(set_result, 123); // pure value
                //
                // second time:
                //
                set_result = data_object.set("Field1", 123);
                assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: 123 }));
                assert.deepEqual(set_result, new Data_Value({ value: 123 })); // wrapped value
                //
                // third time:
                //
                set_result = data_object.set("Field1", 123);
                assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: 123 }));
                assert.deepEqual(set_result, new Data_Value({ value: 123 })); // wrapped value
                //
                // with field definition: wrapped value always:
                //
                data_object.set_field("Field2", "int");
                //
                var data_value_45 = new Data_Value({ value: 45 });
                data_value_45.__type_name = "int";
                //
                //
                // first time:
                //
                set_result = data_object.set("Field2", 45);
                assert.deepEqual(data_object.get("Field2"), data_value_45);
                assert.deepEqual(set_result, data_value_45);
                //
                // second time:
                //
                set_result = data_object.set("Field2", 45);
                assert.deepEqual(data_object.get("Field2"), data_value_45);
                assert.deepEqual(set_result, data_value_45);
            });

        });

        describe("set() without field definition: internally wrap values into Date_Value", function () {

            it("set() without field definition: doc example 1", function () {
                var data_object = new Data_Object();
                //
                // set_field() not called, so Field1 is not defined
                //
                data_object.set("Field1", "abc"); // set() creates an internal Data_Value:
                assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: "abc" }));
            });

            it("set() without field definition: doc example 2", function () {
                var data_object = new Data_Object();
                //
                // set some constraint:
                data_object.constraints({ Field1: "int" });
                //
                // get data_object._field_constraints property:
                assert.deepEqual(data_object.get("_field_constraints"), { Field1: "int" });
            });

            it("string, number, boolean: wrap", function () {
                var data_object = new Data_Object();
                //
                // Data_Object creates an internal Data_Value for native types ('string', 'number', 'boolean', 'date')
                //
                data_object.set("Field1", "45");
                assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: "45" }));
                //
                data_object.set("Field2", 123);
                assert.deepEqual(data_object.get("Field2"), new Data_Value({ value: 123 }));
                //
                data_object.set("Field3", true);
                assert.deepEqual(data_object.get("Field3"), new Data_Value({ value: true }));
                //
                data_object.set("Field4", false);
                assert.deepEqual(data_object.get("Field4"), new Data_Value({ value: false }));
                //
                // check internal data:
                //
                assert.deepEqual(data_object.get(), {
                    Field1: new Data_Value({ value: "45" }),
                    Field2: new Data_Value({ value: 123 }),
                    Field3: new Data_Value({ value: true }),
                    Field4: new Data_Value({ value: false })
                });
            });

            it("date: wrap", function () {
                var data_object = new Data_Object();
                var set_result = null;
                //
                // Data_Object tries to create an internal Data_Value wrap object for native types ('string', 'number', 'boolean', 'date')
                // but for 'object' too, and (new Date()) is object
                //
                var date_value = new Date(10000);
                //
                set_result = data_object.set("Field4", date_value);
                assert.deepEqual(data_object.get("Field4"), new Data_Value({value: date_value})); 
                assert.deepEqual(set_result, date_value);
                //
                // check internal data:
                //
                assert.deepEqual(data_object.get(), { Field4: new Data_Value({ value: date_value }) });
            });

            it("array, object: wrap", function () {
                var data_object = new Data_Object();
                var set_result = null;
                //
                // It did not wrap objects and arrays. Now it wraps them.
                //
                // [number] value:
                //
                set_result = data_object.set("Field1", [123]);
                assert.deepEqual(data_object.get("Field1"), new Data_Value({value: [123]}));
                assert.deepEqual(set_result, [123]);
                //
                // [string] value:
                //
                set_result = data_object.set("Field2", ["45"]);
                assert.deepEqual(data_object.get("Field2"), new Data_Value({value: ["45"]}));
                assert.deepEqual(set_result, ["45"]);
                //
                // object value:
                //
                var object_value = { x: 100 };
                set_result = data_object.set("Field3", object_value);
                assert.deepEqual(data_object.get("Field3"), new Data_Value({value: object_value}));
                assert.deepEqual(set_result, object_value);
                //
                // check internal data:
                //
                assert.deepEqual(data_object.get(), {
                    Field1: new Data_Value({ value: [123] }),
                    Field2: new Data_Value({ value: ["45"] }),
                    Field3: new Data_Value({ value: object_value })
                });
            });

        });

        describe("get() with field definition: create default value", function () {

            // this function is related to the get() implementation details, and used to check code coverage purposes
            // probably this check should be removed from the final (production) tests version
            function assert_field_sig(data_object, fieldName, fieldSig) {
                var sig = jsgui.get_item_sig(data_object.fc.get(fieldName), 20);
                assert.deepEqual(sig, fieldSig);
            }


            it("!!! get() creates default value for int only", function () {
                var data_object = new Data_Object();
                data_object.set_field("Field1", "int");
                data_object.set_field("Field2", "text");
                data_object.set_field("Field3", "number");
                //
                assert.deepEqual(data_object.get("Field1"), new Data_Value());
                assert.deepEqual(data_object.get("Field2"), undefined); // !!!
                assert.deepEqual(data_object.get("Field3"), undefined); // !!!
            });


            it("!!! __type_name is set for int field only", function () {
                var data_object = new Data_Object();
                //
                data_object.set_field("Field1", "int");
                data_object.set_field("Field2", "number");
                //
                data_object.set("Field1", 1);
                data_object.set("Field2", 1);
                //
                assert.deepEqual(data_object.get("Field1").__type_name, "int");
                assert.deepEqual(data_object.get("Field2").__type_name, undefined); // !!!
            });



            // get() before set(): [s,s,f]

            it("get() before set(): [s,s,f]", function () {
                var data_object = new Data_Object();
                //
                data_object.set_field("Field_Number", Number); assert_field_sig(data_object, "Field_Number", "[s,s,f]");
                assert.deepEqual(data_object.get("Field_Number"), new Data_Value());
                //
                var MyBook = function () { this.book = "Secret City"; };
                //
                data_object.set_field("Field_MyBook", MyBook); assert_field_sig(data_object, "Field_MyBook", "[s,s,f]");
                assert.deepEqual(data_object.get("Field_MyBook"), new MyBook());
                //
                // check resulting state:
                //
                test_utils.assertDeepEqual(data_object.field(), [
                    ["Field_Number", "Class", Number],
                    ["Field_MyBook", "Class", MyBook],
                ]);
                //
                test_utils.assertDeepEqual(data_object.get(), {
                    Field_Number: new Data_Value(),
                    Field_MyBook: new MyBook(),
                });
            });

            // get() before set(): [s,[s,u]] - I see no way to create such field

            // get() before set(): [s,s,o]:

            it("get() before set(): [s,s,o]", function () {
                var data_object = new Data_Object();
                //
                data_object.set_field("Field_collection", "collection"); assert_field_sig(data_object, "Field_collection", "[s,s,o]");
                assert.throws(function () { data_object.get("Field_collection") });  // it's unable to create this field (line 4172 jsgui.Collection undefined) !!!
                assert.equal(jsgui.Collection, undefined);
                //
                data_object.set_field("Field_data_object", "data_object"); assert_field_sig(data_object, "Field_data_object", "[s,s,o]");
                var value_data_object = new Data_Object();
                value_data_object._parent = data_object;
                assert.deepEqual(data_object.get("Field_data_object"), value_data_object);
                //
                data_object.set_field("Field_ordered_string_list", "ordered_string_list"); assert_field_sig(data_object, "Field_ordered_string_list", "[s,s,o]");
                var value_ordered_string_list = new Data_Structures.Ordered_String_List();
                var v1_ordered_string_list = test_utils.functionsToStrings(data_object.get("Field_ordered_string_list"));
                var v2_ordered_string_list = test_utils.functionsToStrings(value_ordered_string_list);
                assert.deepEqual(v1_ordered_string_list, v2_ordered_string_list);
                //
                data_object.set_field("Field_string", "string"); assert_field_sig(data_object, "Field_string", "[s,s,o]");
                var value_string = new Data_Value();
                value_string._parent = data_object;
                assert.deepEqual(data_object.get("Field_string"), value_string);
                //
                data_object.set_field("Field_text", "text", { data_type: ["text", 10] }); assert_field_sig(data_object, "Field_text", "[s,s,o]");
                var value_text = new Data_Value();
                assert.deepEqual(data_object.get("Field_text"), value_text);
                //
                data_object.set_field("Field_text2", "text"); assert_field_sig(data_object, "Field_text2", "[s,s,o]");
                assert.deepEqual(data_object.get("Field_text2"), undefined); // !!!
                //
                data_object.set_field("Field_int", "int"); assert_field_sig(data_object, "Field_int", "[s,s,o]");
                var value_int = new Data_Value();
                assert.deepEqual(data_object.get("Field_int"), value_int);
                //
                data_object.set_field("Field_wrong", "wrong"); assert_field_sig(data_object, "Field_wrong", "[s,s,o]");
                assert.deepEqual(data_object.get("Field_wrong"), undefined);
                //
                // check resulting state:
                //
                test_utils.assertDeepEqual(data_object.field(), [
                    ["Field_collection", "collection", { data_type: "collection" }],
                    ["Field_data_object", "data_object", { data_type: "data_object" }],
                    ["Field_ordered_string_list", "ordered_string_list", { data_type: "ordered_string_list" }],
                    ["Field_string", "string", { data_type: "string" }],
                    ["Field_text", "text", { data_type: ["text", 10] }],
                    ["Field_text2", "text", { data_type: "text" }],
                    ["Field_int", "int", { data_type: "int" }],
                    ["Field_wrong", "wrong", { data_type: "wrong" }],
                ]);
                //
                test_utils.assertDeepEqual(data_object.get(), {
                    Field_data_object: value_data_object,
                    Field_ordered_string_list: value_ordered_string_list,
                    Field_string: value_string,
                    Field_text: value_text,
                    Field_int: value_int,
                });
            });

            // get() before set(): [s,s]:

            it("get() before set(): [s,s]", function () {
                var data_object = new Data_Object();
                //
                data_object.set_field(0, ["Field_collection", "collection"]); assert_field_sig(data_object, "Field_collection", "[s,s]");
                assert.throws(function () { data_object.get("Field_collection") }, /not supported here. should use code in enhanced-data-object./);
                //
                data_object.set_field(0, ["Field_data_object", "data_object"]); assert_field_sig(data_object, "Field_data_object", "[s,s]");
                assert.throws(function () { data_object.get("Field_data_object") }, /jsgui.Data_Object is not a function/); // "new jsgui.Data_Object(...)" 
                //
                data_object.set_field(0, ["Field_text", "text"]); assert_field_sig(data_object, "Field_text", "[s,s]");
                var value_text = new (jsgui.ensure_data_type_data_object_constructor("text"))();
                value_text.parent(data_object);
                test_utils.assertDeepEqual(data_object.get("Field_text"), value_text);
                //
                // check resulting state:
                //
                test_utils.assertDeepEqual(data_object.field(), [
                    ["Field_collection", "collection"],
                    ["Field_data_object", "data_object"],
                    ["Field_text", "text"],
                ]);
                //
                test_utils.assertDeepEqual(data_object.get(), {
                    Field_text: value_text,
                });
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
                assert.deepEqual(Data_Object.get_Enhanced_Data_Object(), null);
                //
                //  perform the test:
                //
                var data_object = new Data_Object();
                jsgui.data_types_info["MyType"] = { Field1: "int" };
                data_object.set_field(0, ["FieldMyType", "MyType"]); assert_field_sig(data_object, "FieldMyType", "[s,s]");
                var get_FieldMyType = data_object.get("FieldMyType");
                //
                //  check the result:
                //
                assert.ok(get_FieldMyType instanceof Data_Object);
                assert.ok(!(get_FieldMyType instanceof Enhanced_Data_Object));
                assert.deepEqual(get_FieldMyType.field(), [["Field1", "int", { data_type: "int" }]]);
                //
                // check resulting state:
                //
                test_utils.assertDeepEqual(data_object.field(), [
                    ["FieldMyType", "MyType"],
                ]);
                //
                // prepare the same value as the one stored in the data_object:
                var value_MyType = new Data_Object();
                value_MyType._parent = data_object;
                value_MyType.set_field("Field1", "int");
                // the __type property is not listed in the Object.keys(data_object.get().FieldMyType) array
                // probably this property is set in the prototype
                // so we have to remove the property from value_MyType in order to make it "equals" for the assertDeepEqual() method:
                delete value_MyType.__type;
                //
                // check the data_object values:
                test_utils.assertDeepEqual(data_object.get(), {
                    FieldMyType: value_MyType,
                });
                //
                // restore the environment:
                //
                jsgui.ensure_data_type_data_object_constructor = save_ensure_data_type_data_object_constructor;
                jsgui.data_types_info = save_data_types_info;
                jsgui.map_data_type_data_object_constructors = save_map_data_type_data_object_constructors;
            });

            // get() before set(): [s,[s,s]]:

            it("get() before set(): [s,[s,s]]", function () {
                var data_object = new Data_Object();
                //
                data_object.set_field("Field_collection", ["collection", "int"]); assert_field_sig(data_object, "Field_collection", "[s,[s,s]]");
                assert.deepEqual(data_object.get("Field_collection"), undefined); // !!!
                //
                data_object.set_field("Field_dictionary", ["dictionary", "int"]); assert_field_sig(data_object, "Field_dictionary", "u"); // !!!
                //
                // check resulting state:
                //
                test_utils.assertDeepEqual(data_object.field(), [
                    ["Field_collection", ["collection", "int"]],
                ]);
                //
                test_utils.assertDeepEqual(data_object.get(), {});
            });

            // get() before set(): [s,[s,o]]:

            it("get() before set(): [s,[s,o]]", function () {
                var data_object = new Data_Object();
                //
                data_object.set_field("Field_collection", [{}]); assert_field_sig(data_object, "Field_collection", "[s,[s,o]]");
                assert.deepEqual(data_object.fc.get("Field_collection"), ["Field_collection", ["collection", {}]]);
                assert.throws(function () { data_object.get("Field_collection") });
                //
                data_object.set_field("Field_data_object", {}); assert_field_sig(data_object, "Field_data_object", "[s,[s,o]]");
                assert.deepEqual(data_object.fc.get("Field_data_object"), ["Field_data_object", ["data_object", {}]]);
                assert.deepEqual(data_object.get("Field_data_object"), undefined); // !!!
                //
                // check resulting state:
                //
                test_utils.assertDeepEqual(data_object.field(), [
                    ["Field_collection", ["collection", {}]],
                    ["Field_data_object", ["data_object", {}]],
                ]);
                //
                test_utils.assertDeepEqual(data_object.get(), {});
            });

        });

        describe("change value", function () {

            it("allows to change Data_Value wrapped values", function () {
                var data_object = new Data_Object();
                //
                // set to false:
                data_object.set("Field1", false);
                assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: false }));
                //
                // change to true:
                data_object.set("Field1", true);
                assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: true }));
                //
                // change to 12:
                data_object.set("Field1", 12);
                assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: 12 }));
                //
                // change to [1]:
                data_object.set("Field1", [1]);
                assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: [1] }));
                //
                // check internal data:
                //
                assert.deepEqual(data_object.field(), []);
                //
                assert.deepEqual(data_object.get(), {
                    Field1: new Data_Value({ value: [1] })
                });
            });

            it("set Data_Value twice", function () {
                var data_object = new Data_Object();
                //
                // set Field1 to Data_Value:
                data_object.set("Field1", new Data_Value({ value: 111 }));
                assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: 111 }));
                //
                // set Field1 to Data_Value again: it adds the Data_Value to the existing Data_Value !!!
                data_object.set("Field1", new Data_Value({ value: 111 }));
                assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: new Data_Value({ value: 111 }) }));
                //
                // check the resulting state:
                assert.deepEqual(data_object.get(), {
                    Field1: new Data_Value({ value: new Data_Value({ value: 111 }) })
                });
            });

            it("set Data_Object (twice)", function () {
                var data_object = new Data_Object();
                //
                // set Field1 to Data_Object:
                data_object.set("Field1", new Data_Object());
                assert.deepEqual(data_object.get("Field1"), new Data_Object()); // the internal value is just new Data_Object()
                //
                // set Field1 to Data_Object again...
                data_object.set("Field1", new Data_Object());
                //
                // Prepare an internal value to check. The internal value is a Data_Object after .set() call:
                var internal_data_object = new Data_Object();
                internal_data_object.set(new Data_Object());
                //
                // check the internal value:
                assert.deepEqual(data_object.get("Field1"), internal_data_object);
                //
                // check the resulting state:
                assert.deepEqual(data_object.get(), { Field1: internal_data_object });
                //
                // check the internal value state:
                assert.deepEqual(internal_data_object.get(), { undefined: new Data_Object() });
            });

        });

        describe("overloads", function () {

            it("get() should return an object with all values", function () {
                var data_object = new Data_Object();
                //
                assert.deepEqual(data_object.get(), {});
                // 
                data_object.set("Field1", 100);
                data_object.set("Field2", "200");
                //
                assert.deepEqual(data_object.get(), {
                    Field1: new Data_Value({ value: 100 }),
                    Field2: new Data_Value({ value: "200" }),
                });
            });

            it("set() using object of name/value pairs", function () {
                var data_object = new Data_Object();
                //
                var set_result = data_object.set({ Field1: 123, Field2: "45" });
                assert.deepEqual(set_result, { Field1: 123, Field2: "45" });
                //
                assert.deepEqual(data_object.get(), {
                    Field1: new Data_Value({ value: 123 }),
                    Field2: new Data_Value({ value: "45" })
                });
            });

            it("set() using Data_Object instead of name/value pairs", function () {
                var data_object = new Data_Object();
                //
                // prepare to check 'change' event:
                var change_eventArgs = null;
                data_object.on("change", function (eventArgs) {
                    change_eventArgs = eventArgs;
                });
                //
                // value to set:
                var data_object_as_value = new Data_Object();
                //
                // perform the set:
                var set_result = data_object.set(data_object_as_value);
                assert.deepEqual(set_result, data_object_as_value);
                //
                // now check the state after set() call. The set() code refers to property_name variable, but the variable is undefined.
                // so, the state looks strange:
                //
                assert.deepEqual(data_object.get(), { undefined: data_object_as_value }); // !!! undefined as a property key looks funny :)
                assert.deepEqual(change_eventArgs, [undefined, data_object_as_value]);  // JFYI: the event raising code is: this.raise_event('change', [property_name, value]);
            });

            it("set() using control instead of name/value pairs", function () {
                //
                // !!! TODO: complete the test when Control code will be documented and tested
                //
                //var data_object = null;
                ////
                //data_object = new Data_Object();
                ////
                //var control_as_value = ...
                ////
                //data_object.set(control_as_value);
                //assert.deepEqual(data_object.get(), ...);
            });

        });

        describe("'change' event", function () {

            it("set and change value", function () {
                var data_object = new Data_Object();
                //
                // prepare the event handler:
                var change_eventArgs = null;
                data_object.on("change", function (eventArgs) {
                    change_eventArgs = eventArgs;
                });
                //
                // set a value:
                // !!! it passes the wrapping Data_Value object to the event
                change_eventArgs = null;
                data_object.set("Field1", 123);
                assert.deepEqual(change_eventArgs, { name: "Field1", value: new Data_Value({ value: 123 }), target: data_object });
                //
                //
                // change the value:
                // !!! it passes pure value now (seems not consistent)
                change_eventArgs = null;
                data_object.set("Field1", 45);
                assert.deepEqual(change_eventArgs, { name: "Field1", value: 45, target: data_object });
            });

            it("with and without field definition", function () {
                var data_object = new Data_Object();
                //
                // prepare the event handler:
                var change_eventArgs = null;
                data_object.on("change", function (eventArgs) {
                    change_eventArgs = eventArgs;
                });
                //
                // !!! the value passed to the event handler is different:
                // - pure value (with field definition case)
                // - wrapped value (without field definition case)
                //
                // with field definition:
                //
                // set field definition:
                data_object.set_field("Field1", "int");
                //
                // test the event:
                change_eventArgs = null;
                data_object.set("Field1", 123);
                assert.deepEqual(change_eventArgs, { name: "Field1", value: 123, target: data_object });
                //
                //
                // without field definition:
                //
                // test the event:
                change_eventArgs = null;
                data_object.set("Field2", 123);
                assert.deepEqual(change_eventArgs, { name: "Field2", value: new Data_Value({ value: 123 }), target: data_object });
            });

            it("silent mode", function () {
                var data_object = new Data_Object();
                //
                // prepare the event handler:
                var change_eventArgs = null;
                data_object.on("change", function (eventArgs) {
                    change_eventArgs = eventArgs;
                });
                //
                // silent mode on:
                change_eventArgs = null;
                data_object.set("Field1", 123, true);
                assert.deepEqual(change_eventArgs, null); // the event was not raised
                //
                // silent mode off:
                change_eventArgs = null;
                data_object.set("Field1", 123, false);
                assert.deepEqual(change_eventArgs, { name: "Field1", value: 123, target: data_object });
            });

            it("silent mode specified by string argument", function () {
                var data_object = new Data_Object();
                //
                // prepare the event handler:
                var change_eventArgs = null;
                data_object.on("change", function (eventArgs) {
                    change_eventArgs = eventArgs;
                });
                //
                // !!! set() method accepts string or boolean argument type for the 'silent' parameter. 
                // boolean argument works well, but string argument works funny:
                //
                change_eventArgs = null;
                data_object.set("Field1", 123, "true"); // evaluates to silent:true
                assert.deepEqual(change_eventArgs, null);
                //
                change_eventArgs = null;
                data_object.set("Field1", 123, "false"); // evaluates to silent:true !!!
                assert.deepEqual(change_eventArgs, null);
                //
                change_eventArgs = null;
                data_object.set("Field1", 123, ""); // evaluates to silent:false - the only way to pass false using string argument
                assert.deepEqual(change_eventArgs, { name: "Field1", value: 123, target: data_object });
            });

        });

        describe("other features", function () {

            it("should prevent read-only fields from setting", function () {
                var data_object = new Data_Object();
                //
                data_object.read_only("Field1");
                assert.throws(function () { data_object.set("Field1", 123); }, /Property "Field1" is read-only./);
                assert.deepEqual(data_object.get("Field1"), undefined);
                //
                data_object.read_only("Field1", false);
                data_object.set("Field1", 123);
                assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: 123 }));
                //
            });

            it("should not allow an asyncronous access for get()", function () {
                var data_object = new Data_Object();
                //
                data_object.set("Field1", "abc");
                assert.deepEqual(data_object.get("Field1"), new Data_Value({ value: "abc" }));
                //
                var callback = function () { };
                assert.throws(function () { data_object.get("Field1", callback); });
            });

            it("get/set should process qualified names", function () {
                var data_object = new Data_Object();
                var set_result = null;
                //
                // set() allows to set a field named ".", but get() is unable to get this field.
                // Probably there is a reason to prohibit the "." field set (!!!)
                //
                set_result = data_object.set(".", "dot");
                assert.deepEqual(data_object.get(), { '.': new Data_Value({value: "dot"}) });
                assert.deepEqual(data_object.get("."), undefined);
                assert.deepEqual(set_result, "dot");
                //
                // Data_Object allows to set values using qualified names,
                // if all the nested data objects are created:
                //
                var data_object_b = new Data_Object();
                set_result = data_object_b.set("c", "abc");
                assert.deepEqual(set_result, "abc");
                //
                var data_object_a = new Data_Object();
                set_result = data_object_a.set("b", data_object_b);
                assert.deepEqual(set_result, data_object_b);
                //
                set_result = data_object.set("a", data_object_a);
                assert.deepEqual(data_object.get("a.b.c"), new Data_Value({ value: "abc" }));
                assert.deepEqual(set_result, data_object_a);
                //
                set_result = data_object.set("a.b.c", 123);
                assert.deepEqual(data_object.get("a.b.c"), new Data_Value({ value: 123 }));
                assert.deepEqual(set_result, new Data_Value({ value: 123 }));
                //
                // Data_Object is unable to create the nested data objects itself:
                //
                assert.throws(function () { data_object.set("x.y", "xy"); }, /No data object at this level/);
                //
                // Data_Object provides the change event for the qualified names as well:
                //
                var change_eventArgs = null;
                data_object.on("change", function (eventArgs) {
                    change_eventArgs = eventArgs;
                });
                //
                set_result = data_object.set("a.b.c", 45);
                assert.deepEqual(data_object.get("a.b.c"), new Data_Value({ value: 45 }));
                assert.deepEqual(change_eventArgs, { name: "a.b.c", value: 45, bubbled: true, target: data_object });
                assert.deepEqual(set_result, new Data_Value({ value: 45 }));
            });

            it("!!! should use input_processors and output_processors", function () {
                //
                assert.ok(jsgui.output_processors['color']);
                assert.ok(jsgui.input_processors['color']);
                //
                var Color = Data_Object.extend('color');
                var color = new Color();
                assert.equal(color.__type_name, "color"); // !!! color.__type_name=="data_object", so it is unable to use the processors
                //
                var set_result = color.set(["#FF0000"]);
                assert.deepEqual(set_result, [255, 0, 0]);
                //
                // !!! get() returns "#NaN" instead of "#FF0000":
                assert.deepEqual(color.get(), "#NaN");
                //
                // !!! internal data looks strange:
                assert.deepEqual(color._, { undefined: [255, 0, 0] });
            });

        });

    });

    describe("has(), value(), load_from_spec()", function () {

        it("has()", function () {
            //
            // should return if a value has set
            //
            var data_object = new Data_Object();
            //
            // with field definition:
            //
            assert.deepEqual(data_object.has("Field1"), false);
            //
            data_object.set_field("Field1", "int");
            assert.deepEqual(data_object.has("Field1"), true); // value created automatically
            //
            data_object.set("Field1", "abc");
            assert.deepEqual(data_object.has("Field1"), true);
            //
            // without field definition:
            //
            assert.deepEqual(data_object.has("Field2"), false);
            data_object.set("Field2", "abc");
            assert.deepEqual(data_object.has("Field2"), true);
        });

        it("value()", function () {
            //
            // should return values object
            //
            var data_object = new Data_Object();
            //
            // The Data_Object::value() method calls Data_Value::value() method in turn for the stored values.
            // So, it returns "pure" values in contrast to the get() method.
            //
            // implicit Data_Value:
            data_object.set("Field1", "abc");
            assert.deepEqual(data_object.get("Field1"), new Data_Value({value: "abc"}));
            assert.deepEqual(data_object.value(), { Field1: "abc" });
            //
            // explicit Data_Value:
            var data_value = new Data_Value({ value: 123 });
            data_object.set("Field2", data_value);
            assert.deepEqual(data_object.get("Field2"), data_value);
            assert.deepEqual(data_object.value(), { Field1: "abc", Field2: 123 });
        });

        it("load_from_spec()", function () {
            //
            // should set values for the items present in both 'spec' and 'arr_item_names' parameters
            //
            var data_object = new Data_Object();
            //
            data_object.load_from_spec({ Field1: 111, Field2: 222, Field3: 333 }, ["Field1", "Field3", "Field4"]);
            assert.deepEqual(data_object.value(), { Field1: 111, Field3: 333 });
        });

    });

    describe("utilites", function () {

        // ======================================================
        //
        //	                 utilites
        //
        // ======================================================

        // -----------------------------------------------------
        //	keys()
        // -----------------------------------------------------

        it("keys()", function () {
            var data_object = new Data_Object();
            //
            data_object.set("Field1", 111);
            data_object.set("Field2", 222);
            //
            assert.deepEqual(data_object.keys(), ["Field1", "Field2"]);
        });

        // -----------------------------------------------------
        //	stringify()
        // -----------------------------------------------------

        it("stringify()", function () {
            var data_object = null;
            //
            // empty Data_Object (just created):
            var data_object = new Data_Object();
            assert.deepEqual(data_object.stringify(), 'Data_Object({})');
            //
            // empty abstract Data_Object:
            data_object = new Data_Object({ abstract: true });
            assert.deepEqual(data_object.stringify(), 'Data_Object(undefined)'); // !!! without the starting '~'
            //
            // Data_Object with some data:
            //
            data_object = new Data_Object();
            //
            data_object.set("Field1", 111);
            data_object.set("Field2", 222);
            //
            assert.deepEqual(data_object.stringify(), 'Data_Object({"Field1": 111, "Field2": 222})');
        });

        // -----------------------------------------------------
        //	toObject()
        // -----------------------------------------------------

        it("toObject()", function () {
            var data_object = null;
            //
            // empty Data_Object:
            data_object = new Data_Object();
            assert.deepEqual(data_object.toObject(), {});
            //
            // Data_Object with some data:
            //
            data_object = new Data_Object();
            //
            data_object.set("Field1", 111);
            data_object.set("Field2", 222);
            //
            assert.deepEqual(data_object.toObject(), { "Field1": 111, "Field2": 222 });
            //
            // BTW these field values are Data_Value in fact, but processed by own toObject() method in turn:
            assert.deepEqual(data_object.get(), { "Field1": new Data_Value({value: 111}), "Field2": new Data_Value({value: 222}) });
        });

        // -----------------------------------------------------
        //	each()
        // -----------------------------------------------------

        it("each()", function () {
            var data_object = new Data_Object();
            //
            var result = [];
            var callback = function (name, value) { result.push([name, value]) };
            //
            data_object.set("Field1", "abc");
            data_object.set("Field2", 123);
            //
            data_object.each(callback);
            //
            assert.deepEqual(result, [
                ["Field1", new Data_Value({ value: "abc" })],
                ["Field2", new Data_Value({ value: 123 })]
            ]);
        });

        // -----------------------------------------------------
        //	mod_link()
        // -----------------------------------------------------

        it("mod_link()", function () {
            //
            // mod_link() returns jsgui module reference
            // it can be 'jsgui-lang-essentials', 'jsgui-lang-util' or 'jsgui-lang-enh' depending of the require() calls sequence
            // so, use a duck test:
            //
            var data_object = new Data_Object();
            var jsgui = data_object.mod_link();
            //
            // the duck test:
            //
            assert.deepEqual(typeof (jsgui.Class), "function");
            assert.deepEqual(typeof (jsgui.arrayify), "function");
            assert.deepEqual(typeof (jsgui.functional_polymorphism), "function");
            assert.deepEqual(typeof (jsgui.get_item_sig), "function");
            assert.deepEqual(typeof (jsgui.get_truth_map_from_arr), "function");
            //
            assert.deepEqual(jsgui.get_truth_map_from_arr(["a", "b", "c"]), { a: true, b: true, c: true });
        });

        // -----------------------------------------------------
        //	_get_input_processors()
        // -----------------------------------------------------

        it("_get_input_processors()", function () {
            var data_object = new Data_Object();
            //
            assert.deepEqual(data_object._get_input_processors(), jsgui.input_processors);
        });

        // -----------------------------------------------------
        //	get_Enhanced_Data_Object(), set_Enhanced_Data_Object()
        // -----------------------------------------------------

        it("get_Enhanced_Data_Object(), set_Enhanced_Data_Object()", function () {
            assert.deepEqual(Data_Object.get_Enhanced_Data_Object(), null);
            //
            Data_Object.set_Enhanced_Data_Object(Enhanced_Data_Object);
            //
            assert.deepEqual(Data_Object.get_Enhanced_Data_Object(), Enhanced_Data_Object);
            //
            // restore back:
            Data_Object.set_Enhanced_Data_Object(null);
        });

    });

});


