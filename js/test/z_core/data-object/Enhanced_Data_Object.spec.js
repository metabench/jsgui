
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../../core/enhanced-data-object", '../../../core/data-object', "../../../core/jsgui-data-structures", "../../../core/constraint", 'assert', '../../test-utils/test-utils'],
function (Enhanced_Data_Object, Data_Object, Data_Structures, Constraint, assert, test_utils) {


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

        //#region xxxxxxxxxxxx

        // ======================================================
        //
        //	                xxxxxxxxxxxx
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

        //#endregion



        // this function is related to the get() implementation details, and used to check code coverage purposes
        // this check should be removed from the final (production) tests version
        function assert_field_sig(data_object, fieldName, fieldSig) {
            var sig = jsgui.get_item_sig(data_object.fc.get(fieldName), 20);
            assert.deepEqual(sig, fieldSig);
        }

        // get() before set(): [s,s,f]

        it("get() before set(): [s,s,f]", function () {
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
        });


    });


});


