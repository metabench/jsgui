
    var Enhanced_Data_Object = require('../../../core/enhanced-data-object');
    var Data_Object = require('../../../core/data-object');
    var Data_Value = require('../../../core/data-value');
    var Data_Structures = require('../../../core/jsgui-data-structures');
    var Constraint = require('../../../core/constraint');
    var assert = require('assert');
    var test_utils = require('../../../test/test-utils/test-utils');

    describe("z_core/data-object /Enhanced_Data_Object.spec.js ", function () {

        // -----------------------------------------------------
        //	jsgui:
        // -----------------------------------------------------

        var jsgui = null;

        before(function () {
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
        //	flags
        // -----------------------------------------------------

        it("should works with flags...", function () {
            var edo = new Enhanced_Data_Object();
            //
            assert.deepEqual(edo.has_flag("test"), false);
            //
            edo.add_flag("test");
            //
            assert.deepEqual(edo.has_flag("test"), true);
            assert.deepEqual(jsgui.stringify(edo.get('flags')), 'Collection("test")');
            //
            edo.remove_flag("test");
            //
            assert.deepEqual(edo.has_flag("test"), false);
            assert.deepEqual(jsgui.stringify(edo.get('flags')), 'Collection()');
            //
            edo.add_flag("test"); // added already..
            edo.add_flag("test"); // added already..
            //
            assert.deepEqual(edo.has_flag("test"), true);
            assert.deepEqual(jsgui.stringify(edo.get('flags')), 'Collection("test")');
        });

        // -----------------------------------------------------
        //	ensure_data_type_data_object_constructor
        // -----------------------------------------------------

        it("ensure_data_type_data_object_constructor() should not remove fields() method", function () {
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
            assert.deepEqual(edo_int.fields(), [["flags", ["collection", "string"]]]); // fields() method not removed
            //
            // now define some type - the fields() method will be not removed:
            //
            jsgui.data_types_info["int2"] = {};
            var edo_int2 = new (jsgui.ensure_data_type_data_object_constructor("int2"))();
            assert.deepEqual(edo_int2.fields(), [["flags", ["collection", "string"]]]); // feilds() method not removed
            //
            //
            //
            // restore the global variables:
            jsgui.map_data_type_data_object_constructors = save_jsgui_map_data_type_data_object_constructors;
            jsgui.data_types_info = save_jsgui_data_types_info;
        });



    });




