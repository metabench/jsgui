
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/data-object-fields-collection', 'assert'],
function (Fields_Collection, assert) {

    describe("core/data-object-fields-collection", function () {

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

        // -----------------------------------------------------
        //	fieldsCollection.set() cases
        // -----------------------------------------------------

        function create_and_set() {
            var fieldsCollection = new Fields_Collection();
            fieldsCollection.set.apply(fieldsCollection, arguments);
            return fieldsCollection;
        }

        it("fieldsCollection.set() cases", function () {
            var fc = null;

            // [a], [s,s]

            fc = create_and_set([["field1", "int"], ["field2", "string"]]);
            //
            assert.deepEqual(fc.get(), [["field1", "int", { data_type: "int" }], ["field2", "string", { data_type: "string" }]]);

            fc = create_and_set(["field1", "int"]);
            //
            assert.deepEqual(fc.get(), [["field1", "int", { data_type: "int" }]]);

            // [a], [s,f]

            fc = create_and_set(["field1", Number]);
            //
            assert.deepEqual(fc.get(), [["field1", "Class", Number]]);

            // [a], [s,s,o]

            fc = create_and_set(["field1", "int", { data_type: "int" }]);
            //
            assert.deepEqual(fc.get(), [["field1", "int", { data_type: "int" }]]);

            fc = create_and_set(["field1", "int", {}]);
            //
            assert.deepEqual(fc.get(), [["field1", "int", {}]]);

            // [a], [n,[s,s]]

            fc = create_and_set([0, ["field1", "int"]]); assert.deepEqual(fc.get(), [["field1", "int"]]);  // ??? !!!
            fc = create_and_set([1, ["field1", "int"]]); assert.deepEqual(fc.get(), [["field1", "int"]]);
            fc = create_and_set([2, ["field1", "int"]]); assert.deepEqual(fc.get(), [["field1", "int"]]);

            fc = create_and_set([0, ["field1", "collection"]]); assert.deepEqual(fc.get(), [["field1", "collection"]]); // "if (field_item_type_name)" never true

            // [a], [n,[s,s,?]]

            fc = create_and_set([0, ["field1", "int", 100]]); assert.deepEqual(fc.get(), [["field1", "int", 100]]);  // ??? !!!

            //var collectionDefaultValueThrown = false;
            //try {
            //    fc = create_and_set([0, ["field1", "collection", 100]]);
            //} catch (err) {
            //    if (err === 'Default values for Collection not supported') collectionDefaultValueThrown = true;
            //}
            //assert.ok(collectionDefaultValueThrown);
            assert.throws(function () { create_and_set([0, ["field1", "collection", 100]]) }, 'Default values for Collection not supported');

            // [a], [s,[s,s]]

            fc = create_and_set(["field1", ["collection", "int"]]); assert.deepEqual(fc.get(), [["field1", ["collection", "int"]]]);
            fc = create_and_set(["field1", ["dictionary", "int"]]); assert.deepEqual(fc.get(), []); // !!! ?

            // [a], []

            fc = create_and_set([]); assert.deepEqual(fc.get(), []);

            // [a], [o]

            assert.throws(function () { create_and_set([{}]); }, 'stop');

            // [a], [s,o]

            fc = create_and_set(["field1", {}]); assert.deepEqual(fc.get(), [["field1", ["data_object", {}]]]);

            // [a], [s,[o]]

            fc = create_and_set(["field1", [{}]]); assert.deepEqual(fc.get(), [["field1", ["collection", {}]]]);

            // [a], [s,~C]

            // not tested because "collection" module is not processed yet  // !!!

            // [o]

            var o = {
                field1: "int",
                field2: "string",
            };

            fc = create_and_set(o);
            //fc = new Fields_Collection();
            //fc.set(o);
            //
            assert.deepEqual(fc.get(), [["field1", "int", { data_type: "int" }], ["field2", "string", { data_type: "string" }]]);

            // (a.l > 1)

            fc = create_and_set(["field1", "int"], ["field2", "string"]);
            //
            assert.deepEqual(fc.get(), [["field1", "int", { data_type: "int" }], ["field2", "string", { data_type: "string" }]]);

            fc = create_and_set("field1", "int", { data_type: "int" });
            //
            assert.deepEqual(fc.get(), [["field1", "int", { data_type: "int" }]]);

        });

        it("fieldsCollection.set(): array of array", function () {
            var fc = null;

            // [a], [s,s]

            fc = create_and_set(["field1", "int"]);
            //
            assert.deepEqual(fc.get(), [["field1", "int", { data_type: "int" }]]);

            fc = create_and_set([["field1", "int"]]);
            //
            assert.deepEqual(fc.get(), [["field1", "int", { data_type: "int" }]]);


            // [a], [s,f]

            fc = create_and_set(["field1", Number]);
            //
            assert.deepEqual(fc.get(), [["field1", "Class", Number]]);

            fc = create_and_set([["field1", Number]]);
            //
            assert.deepEqual(fc.get(), [["field1", "Class", Number]]);

        });

    });




});

