
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/data-object-fields-collection', 'assert'],
function (Fields_Collection, assert) {

    describe("z_core/data/data-object-fields-collection", function () {

        // -----------------------------------------------------
        //	parse_field_text()
        // -----------------------------------------------------

        it("parse_field_text()", function () {

            var parse_field_text = Fields_Collection.parse_field_text;

            assert.deepEqual(parse_field_text(""), { data_type: undefined });
            assert.deepEqual(parse_field_text("int"), { data_type: "int" });

            assert.deepEqual(parse_field_text("unique pk indexed not_null read_only int"), { data_type: "int", unique: true, pk: true, indexed: true, not_null: true, read_only: true });
            assert.deepEqual(parse_field_text("unique   pk   indexed   not_null   read_only  int"), { data_type: "int", unique: true, pk: true, indexed: true, not_null: true, read_only: true });

            assert.deepEqual(parse_field_text("float"), { data_type: "float" });
            assert.deepEqual(parse_field_text("float(3)"), { data_type: ["float", 3] });
            assert.deepEqual(parse_field_text("float(12,2)"), { data_type: "float" });  // !!!

            assert.deepEqual(parse_field_text("not_null int"), { data_type: "int", not_null: true });
            assert.deepEqual(parse_field_text("not null int"), { data_type: "int", not_null: true });

            assert.deepEqual(parse_field_text("read_only int"), { data_type: "int", read_only: true });
            assert.deepEqual(parse_field_text("readonly int"), { data_type: "int", read_only: true });
            assert.deepEqual(parse_field_text("read-only int"), { data_type: "int", read_only: true });
            assert.deepEqual(parse_field_text("read only int"), { data_type: "int" });

        });

        // -----------------------------------------------------
        //	parse_data_type()
        // -----------------------------------------------------

        it("parse_data_type()", function () {

            var parse_data_type = Fields_Collection.parse_data_type;

            assert.deepEqual(parse_data_type(""), undefined);
            assert.deepEqual(parse_data_type("float"), "float");
            assert.deepEqual(parse_data_type("float(3)"), ["float", 3]);
            assert.deepEqual(parse_data_type("float(12,2)"), "float");  // !!!

        });

        // -----------------------------------------------------
        //	Fields_Collection
        // -----------------------------------------------------

        it("Fields_Collection", function () {

            var fieldsCollection = new Fields_Collection();

            assert.deepEqual(fieldsCollection.get(), []);

            fieldsCollection.set([["field1", "int"], ["field2", "string"]]);

            assert.deepEqual(fieldsCollection.get(), [["field1", "int", { data_type: "int" }], ["field2", "string", { data_type: "string" }]]);
            assert.deepEqual(fieldsCollection.get("field1"), ["field1", "int", { data_type: "int" }]);

            assert.deepEqual(fieldsCollection.fields(), [["field1", "int", { data_type: "int" }], ["field2", "string", { data_type: "string" }]]);
            assert.deepEqual(fieldsCollection.fields("field1"), ["field1", "int", { data_type: "int" }]);

            fieldsCollection.out("field1");
            //
            assert.deepEqual(fieldsCollection.get(), [["field2", "string", { data_type: "string" }]]);
            assert.deepEqual(fieldsCollection.get("field1"), undefined);

            fieldsCollection.clear(); /// does nothing!
            //
            assert.deepEqual(fieldsCollection.get(), [["field2", "string", { data_type: "string" }]]); // !!!

        });

        // -----------------------------------------------------
        //	fieldsCollection.set() works like add()
        // -----------------------------------------------------

        it("fieldsCollection.set() works like add()", function () {
            var fieldsCollection = new Fields_Collection();
            assert.deepEqual(fieldsCollection.get(), []);
            //
            fieldsCollection.set("field1", "int");
            assert.deepEqual(fieldsCollection.get(), [["field1", "int", { data_type: "int" }]]);
            //
            fieldsCollection.set("field2", "string");
            assert.deepEqual(fieldsCollection.get(), [["field1", "int", { data_type: "int" }], ["field2", "string", { data_type: "string" }]]);
        });

        it("fieldsCollection.set() can add field with the same name", function () {
            var fieldsCollection = new Fields_Collection();
            assert.deepEqual(fieldsCollection.get(), []);
            //
            fieldsCollection.set("field1", "int");
            assert.deepEqual(fieldsCollection.get(), [["field1", "int", { data_type: "int" }]]);
            //
            fieldsCollection.set("field1", "string");
            assert.deepEqual(fieldsCollection.get(), [["field1", "int", { data_type: "int" }], ["field1", "string", { data_type: "string" }]]); // !!!
        });

        // -----------------------------------------------------
        //	fieldsCollection.set() cases
        // -----------------------------------------------------

        function create_and_set() {
            var fieldsCollection = new Fields_Collection();
            fieldsCollection.set.apply(fieldsCollection, arguments);
            return fieldsCollection;
        }

        function check_set() {
            // check_set(arg1, arg2,... , estimatedResult);
            //
            var last = arguments.length - 1;
            assert.ok(last >= 1);
            var args = Array.prototype.slice.call(arguments, 0, last);
            var estimatedResult = arguments[last];
            //
            var fc = create_and_set.apply(this, args);
            assert.deepEqual(fc.get(), estimatedResult);
        }

        function check_set_throws() {
            // check_set(arg1, arg2,... , estimatedError);
            //
            var last = arguments.length - 1;
            assert.ok(last >= 1);
            var args = Array.prototype.slice.call(arguments, 0, last);
            var estimatedError = arguments[last];
            //
            assert.throws(function () { create_and_set.apply(this, args); }, estimatedError);
        }

        it("fieldsCollection.set() cases", function () {

            check_set(
                [["field1", "int"], ["field2", "string"]], // set() parameters
                [["field1", "int", { data_type: "int" }], ["field2", "string", { data_type: "string" }]] // estimated result
            );

            // [a], [s,s]  ==>  [s,s,o]

            check_set(["field1", "int"], [["field1", "int", { data_type: "int" }]]);

            // [a], [s,f]  ==>  [s,s,f]

            check_set(["field1", Number], [["field1", "Class", Number]]);

            // [a], [s,s,o]  ==>  [s,s,o]

            check_set(["field1", "int", { data_type: "int" }], [["field1", "int", { data_type: "int" }]]);

            check_set(["field1", "int", {}], [["field1", "int", {}]]);

            // [a], [n,[s,s]]  ==>  [s,s]

            check_set([0, ["field1", "int"]], [["field1", "int"]]); // ??? !!!
            check_set([1, ["field1", "int"]], [["field1", "int"]]);
            check_set([2, ["field1", "int"]], [["field1", "int"]]);

            check_set([0, ["field1", "collection"]], [["field1", "collection"]]); // "if (field_item_type_name)" never true

            // [a], [n,[s,s,?]]  ==>  [s,s,?]

            check_set([0, ["field1", "int", 100]], [["field1", "int", 100]]);  // ??? !!!

            check_set_throws([0, ["field1", "collection", 100]], 'Default values for Collection not supported');

            // [a], [s,[s,s]]  ==>  [s,[s,s]]

            check_set(["field1", ["collection", "int"]], [["field1", ["collection", "int"]]]);
            check_set(["field1", ["dictionary", "int"]], []); // !!! ?

            // [a], []
            
            check_set([], []);

            // [a], [o]

            check_set_throws([{}], 'stop');
            
            // [a], [s,o]  ==>  [s,[s,o]]

            check_set(["field1", {}], [["field1", ["data_object", {}]]]);

            // [a], [s,[o]]  ==>  [s,[s,o]]

            check_set(["field1", [{}]], [["field1", ["collection", {}]]]);

            // [a], [s,~C]

            // not tested because "collection" module is not processed yet  // !!!

            // [o]
            
            check_set({ field1: "int", field2: "string" },  [["field1", "int", { data_type: "int" }], ["field2", "string", { data_type: "string" }]]);

            // (a.l > 1)
            
            check_set(["field1", "int"], ["field2", "string"], [["field1", "int", { data_type: "int" }], ["field2", "string", { data_type: "string" }]]);

            check_set("field1", "int", { data_type: "int" }, [["field1", "int", { data_type: "int" }]]);

            check_set("field1", ["collection", "int"], [["field1", ["collection", "int"]]]);

        });

        it("fieldsCollection.set(): array of array", function () {
            var fc = null;

            // [a], [s,s]

            check_set( ["field1", "int"],  [["field1", "int", { data_type: "int" }]]);
            check_set([["field1", "int"]], [["field1", "int", { data_type: "int" }]]);

            // [a], [s,f]

            check_set(   ["field1", Number],    [["field1", "Class", Number]]);
            check_set(  [["field1", Number]],   [["field1", "Class", Number]]);
            check_set( [[["field1", Number]]],  [["field1", "Class", Number]]);
            check_set([[[["field1", Number]]]], [["field1", "Class", Number]]);

        });

    });




});

