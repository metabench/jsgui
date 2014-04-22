
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/constraint', '../../../core/data-object', 'assert'],
function (Constraint, Data_Object, assert) {

    describe("core/constraint", function () {

        /*

           Constraint members usage:
          ===========================

          Constraint.from_obj: collection.js, data-object.js 
          Constraint.obj_matches_constraint: data-object.js 
          Constraint.from_str: nowhere

          Constraint.Unique: collection.js
          Constraint.Collection_Data_Type: collection.js
          Constraint.Collection_Data_Def: collection.js
          Constraint.Field_Data_Type : data-object.js 

          Constraint.Not_Null: nowhere
          Constraint.Data_Object_Def_Constraint: nowhere
          Constraint.Collection_Data_Object: nowhere
          Constraint.Guid: nowhere

        */

        /*
           Classes hierarchy:
          ===================

          Constraint
             Data_Object_Constraint
             Data_Object_Def_Constraint
             Field_Constraint
                Not_Null_Constraint
                Field_Data_Type_Constraint
                   Text_Constraint
                   Guid_Constraint
                   Number_Constraint
                      Int_Constraint
             Collection_Constraint
                Collection_Data_Def_Constraint
                Collection_Data_Type_Constraint
                Collection_Data_Object_Constraint
                Unique_Constraint
                Relationship_Constraint


        */


        // =================================================================================================
        //
        //	                                    Static methods:
        //
        // =================================================================================================

        // -----------------------------------------------------
        //	from_str()
        // -----------------------------------------------------

        it("from_str()", function () {

            var c = null;

            c = Constraint.from_str("int"); // Int_Constraint
            assert.deepEqual(c.to_info_obj(), "int");

            c = Constraint.from_str("number"); // Number_Constraint
            assert.deepEqual(c.to_info_obj(), "number");

            c = Constraint.from_str("text(10)"); // Text_Constraint
            assert.deepEqual(c.to_info_obj(), ["text", 10]);

            c = Constraint.from_str("text"); // Text_Constraint
            assert.deepEqual(c.to_info_obj(), "text");

            c = Constraint.from_str("guid"); // Guid_Constraint
            assert.deepEqual(c.to_info_obj(), "guid");

            c = Constraint.from_str("nothing");
            assert.deepEqual(c, undefined);
        });


        // -----------------------------------------------------
        //	from_obj()
        // -----------------------------------------------------

        it("from_obj()", function () {

            var c = null;

            //
            // string parameter (uses from_str() internally):
            //

            c = Constraint.from_obj("int"); // Int_Constraint
            assert.deepEqual(c.to_info_obj(), "int");

            c = Constraint.from_obj("number"); // Number_Constraint
            assert.deepEqual(c.to_info_obj(), "number");

            c = Constraint.from_obj("text(10)"); // Text_Constraint
            assert.deepEqual(c.to_info_obj(), ["text", 10]);

            c = Constraint.from_obj("text"); // Text_Constraint
            assert.deepEqual(c.to_info_obj(), "text");

            c = Constraint.from_obj("guid"); // Guid_Constraint
            assert.deepEqual(c.to_info_obj(), "guid");

            c = Constraint.from_obj("nothing");
            assert.deepEqual(c, undefined);

            //
            // object parameter:
            //

            c = Constraint.from_obj(["text", 10]); // Text_Constraint
            assert.deepEqual(c.to_info_obj(), ["text", 10]);

            c = Constraint.from_obj(["unique", "SomeID"]); // Unique_Constraint
            assert.deepEqual(c._constraint_type, "unique");
            assert.deepEqual(c.fields, "SomeID");

            //c = Constraint.from_obj(new Data_Object()); // Collection_Data_Object_Constraint - removed
            //assert.deepEqual(c._constraint_type, "data_object");

            assert.deepEqual(Constraint.from_obj({}), undefined);
            assert.deepEqual(Constraint.from_obj([]), undefined);

        });

        // -----------------------------------------------------
        //	obj_matches_constraint()
        // -----------------------------------------------------

        it("obj_matches_constraint()", function () {
            var obj_matches_constraint = Constraint.obj_matches_constraint;
            //
            assert.deepEqual(obj_matches_constraint(1, "int"), true);
            assert.deepEqual(obj_matches_constraint(1.5, "int"), false);
            //
            assert.deepEqual(obj_matches_constraint(1, "number"), true);
            assert.deepEqual(obj_matches_constraint("1", "number"), false);
            //
            assert.deepEqual(obj_matches_constraint("123", "text(3)"), true);
            assert.deepEqual(obj_matches_constraint("1234", "text(3)"), false);
        });


        // =================================================================================================
        //
        //	                                    Data_Object_...
        //
        // =================================================================================================

        // -----------------------------------------------------
        //	Data_Object_Constraint
        // -----------------------------------------------------

        it("Data_Object_Constraint", function () {
            // the Data_Object_Constraint class does nothing, and is not public
        });

        // -----------------------------------------------------
        //	Data_Object_Def_Constraint
        // -----------------------------------------------------

        it("Data_Object_Def_Constraint", function () {
            var c = new Constraint.Data_Object_Def_Constraint();
            //
            assert.deepEqual(c.__data_type, "data_object_def_constraint");
            //
            assert.deepEqual(c.match(1), false);
            assert.deepEqual(c.match("1"), false);
            //
            assert.deepEqual(c.match({}), true); // (?) c.data_def is not set, any object matches
            //
            c = new Constraint.Data_Object_Def_Constraint({ name: "string", age: "number" });
            //
            assert.deepEqual(c.match({ name: "John", age: 25 }), true);
            assert.deepEqual(c.match({ name: "John", age: "25" }), false);
            //
            assert.deepEqual(c.match({}), false); 
        });

        // =================================================================================================
        //
        //	                                    Field_Constraint
        //
        // =================================================================================================

        // -----------------------------------------------------
        //	Not_Null
        // -----------------------------------------------------

        it("Not_Null", function () {
            var c = new Constraint.Not_Null();
            //
            assert.deepEqual(c.__data_type, "field_constraint");
            //
            assert.deepEqual(c.match(1), true);
            assert.deepEqual(c.match({}), true);
            assert.deepEqual(c.match(), false);
            assert.deepEqual(c.match(null), false);
        });

        // -----------------------------------------------------
        //	Field_Data_Type_Constraint
        // -----------------------------------------------------

        it("Field_Data_Type_Constraint", function () {

            // Field_Data_Type_Constraint seems used only as a base class for "instanceof" operators

            var c = new Constraint.Field_Data_Type();
            assert.deepEqual(c.__data_type, "field_constraint");
        });

        // -----------------------------------------------------
        //	Text_Constraint
        // -----------------------------------------------------

        it("Text_Constraint", function () {
            var c = Constraint.from_obj("text(10)")
            //
            assert.deepEqual(c.__data_type, "field_constraint");
            assert.deepEqual(c.to_info_obj(), ["text", 10]);
            //
            assert.deepEqual(c.match(""), true);
            assert.deepEqual(c.match("a b c"), true);
            assert.deepEqual(c.match("0123456789"), true);
            assert.deepEqual(c.match("01234567890"), false);
            //
            assert.deepEqual(c.match(), false);
            assert.deepEqual(c.match(null), false);
            assert.deepEqual(c.match(1), false);
            assert.deepEqual(c.match({}), false);
            assert.deepEqual(c.match(["aaa"]), false);
            //
            // "any length text" constraint:
            //
            c = Constraint.from_obj("text")
            assert.deepEqual(c.to_info_obj(), "text");
            assert.deepEqual(c.match("a b c"), true);
        });

        // -----------------------------------------------------
        //	Guid_Constraint
        // -----------------------------------------------------

        it("Guid_Constraint", function () {
            var c = Constraint.from_obj("guid")
            //
            assert.deepEqual(c.__data_type, "field_constraint");
            assert.deepEqual(c.to_info_obj(), "guid");
            //
            assert.deepEqual(c.match("{86DCA9A5-31AC-4F20-B552-4D1503D0D11C}"), true);
            //
            assert.deepEqual(c.match("{ZZZZZZZZ-31AC-4F20-B552-4D1503D0D11C}"), false);
            assert.deepEqual(c.match("{________-31AC-4F20-B552-4D1503D0D11C}"), false);
            //
            assert.deepEqual(c.match("86DCA9A5-31AC-4F20-B552-4D1503D0D11C"), false);
            assert.deepEqual(c.match(1), false);
            assert.deepEqual(c.match([1]), false);
        });

        // -----------------------------------------------------
        //	Number_Constraint
        // -----------------------------------------------------

        it("Number_Constraint", function () {
            var c = Constraint.from_obj("number")
            //
            assert.deepEqual(c.__data_type, "field_constraint");
            assert.deepEqual(c.to_info_obj(), "number");
            //
            assert.deepEqual(c.match(1), true);
            assert.deepEqual(c.match("1"), false);
        });

        // -----------------------------------------------------
        //	Int_Constraint
        // -----------------------------------------------------

        it("Int_Constraint", function () {
            var c = Constraint.from_obj("int")
            //
            assert.deepEqual(c.__data_type, "field_constraint");
            assert.deepEqual(c.to_info_obj(), "int");
            //
            assert.deepEqual(c.match(1), true);
            assert.deepEqual(c.match(1.5), false);
            assert.deepEqual(c.match("1"), false);
        });

        // =================================================================================================
        //
        //	                                    Collection_Constraint
        //
        // =================================================================================================

        // -----------------------------------------------------
        //	Collection_Data_Def_Constraint
        // -----------------------------------------------------

        it("Collection_Data_Def_Constraint", function () {
            var c = new Constraint.Collection_Data_Def({ name: "string", age: "number" });
            //
            assert.deepEqual(c.__data_type, undefined); // instead of "collection_constraint", because _super() was not called in the constructor
            assert.deepEqual(c._constraint_type, "data_def");
            //
            assert.equal(c.match({ name: "John", age: 25 }), true);
            assert.equal(c.match({ name: "John", age: "25" }), false);
            assert.equal(c.match({}), false);
            //
            //
            c = new Constraint.Collection_Data_Def({
                fieldNumber: "number",
                fieldString: "string",
                fieldNull: "null",
                fieldObject: "object",
                fieldArray: "array",
            });
            //
            var value_good = { fieldNumber: 1, fieldString: "", fieldNull: null, fieldObject: {}, fieldArray: [] };
            var value_bad = { fieldNumber: "1", fieldString: "", fieldNull: null, fieldObject: {}, fieldArray: [] };
            //
            assert.equal(c.match(value_good), true);
            assert.equal(c.match(value_bad), false);
        });

        // -----------------------------------------------------
        //	Collection_Data_Type_Constraint
        // -----------------------------------------------------

        it("Collection_Data_Type_Constraint", function () {
            var c = null;
            //
            //  Number
            //
            c = new Constraint.Collection_Data_Type(Number);
            //
            assert.deepEqual(c.__data_type, undefined); // instead of "collection_constraint", because _super() was not called in the constructor
            assert.deepEqual(c._constraint_type, "data_type");
            //
            assert.equal(c.match(1), true);
            assert.equal(c.match("1"), undefined); // !!!
            //
            //  String
            //
            c = new Constraint.Collection_Data_Type(String);
            //
            assert.equal(c.match("1"), true);
            assert.equal(c.match(1), undefined); // !!!
            //
            //  Book
            //
            var Book = function () { this.title = "Unknown book"; }
            c = new Constraint.Collection_Data_Type(Book);
            //
            assert.equal(c.match(new Book()), true);
            assert.equal(c.match("Book"), undefined); // !!!
            //
            //
            // there is a separate code branch for Data_Object in the match() method implementation,
            // but it works exactly as for other objects.
            // Probably there is a reason to remove the specific code branch from match():
            //
            // The same seems true for Collection (not tested, just code review)
            //
            c = new Constraint.Collection_Data_Type(Data_Object);
            //
            assert.equal(c.match(new Data_Object()), true);
        });

        // -----------------------------------------------------
        //	Collection_Data_Object_Constraint
        // -----------------------------------------------------

        //it("Collection_Data_Object_Constraint", function () {
        //    //var c = new Constraint.Collection_Data_Object(new Data_Object());
        //    //
        //    // the Collection_Data_Object_Constraint class seems not used anywhere,
        //    // and uses an implicit cyclic dependencies to Data_Object and Collection classes.
        //    //
        //    // no tests made. it seems better to remove the class.
        //    //
        //    var c = Constraint.from_obj(new Data_Object()); // Collection_Data_Object_Constraint
        //    assert.deepEqual(c._constraint_type, "data_object");
        //});

        // -----------------------------------------------------
        //	Unique_Constraint
        // -----------------------------------------------------

        it("Unique_Constraint", function () {
            var c = new Constraint.Unique({ fields: ["ID"] });
            //
            assert.deepEqual(c.__data_type, "collection_constraint"); 
            assert.deepEqual(c._constraint_type, "unique");
            //
            assert.deepEqual(c.fields, ["ID"]);
            assert.deepEqual(c.match, undefined); // !!!
            //
            // from_obj():
            //
            c = Constraint.from_obj(["unique", "SomeID"]); // Unique_Constraint
            assert.deepEqual(c._constraint_type, "unique");
            assert.deepEqual(c.fields, "SomeID");
        });

        // -----------------------------------------------------
        //	Relationship_Constraint
        // -----------------------------------------------------

        it("Relationship_Constraint", function () {
            // the Relationship_Constraint class does nothing, and is not public
        });

    });


});


