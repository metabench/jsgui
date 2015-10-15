
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/data-value', 'assert'],
function (Data_Value, assert) {

    describe("z_core/data-object /Data_Value.spec.js ", function () {

        // -----------------------------------------------------
        //	Data_Value
        // -----------------------------------------------------

        it("should gets and sets values", function () {
            var data_value = new Data_Value();
            //
            var change_old = null;
            var change_new = null;
            //
            data_value.on("change", function (args) { change_old = args.old; change_new = args.value; });
            //
            assert.deepEqual(change_old, null);
            assert.deepEqual(change_new, null);
            //
            assert.deepEqual(data_value.get(), undefined);
            assert.deepEqual(data_value.value(), undefined);
            assert.deepEqual(data_value.toObject(), undefined);
            assert.deepEqual(data_value.toString(), undefined);
            assert.deepEqual(data_value.stringify(), undefined);
            //
            data_value.set(2014);
            //
            assert.deepEqual(change_old, undefined);
            assert.deepEqual(change_new, 2014);
            //
            assert.deepEqual(data_value.get(), 2014);
            assert.deepEqual(data_value.value(), 2014);
            assert.deepEqual(data_value.toObject(), 2014);
            assert.deepEqual(data_value.toString(), 2014); // !!!
            assert.deepEqual(data_value.stringify(), 2014); // !!!
            //
            data_value.set("2015");
            //
            assert.deepEqual(change_old, 2014);
            assert.deepEqual(change_new, "2015");
            //
            assert.deepEqual(data_value.get(), "2015");
            assert.deepEqual(data_value.value(), "2015");
            assert.deepEqual(data_value.toObject(), "2015");
            assert.deepEqual(data_value.toString(), "2015");
            assert.deepEqual(data_value.stringify(), '"2015"');
        });

        it("should perform value initialization", function () {
            var data_value = null;
            //
            data_value = new Data_Value();
            assert.deepEqual(data_value.get(), undefined);
            //
            data_value = new Data_Value({ value: 31 });
            assert.deepEqual(data_value.get(), 31);
        });

        it("should be able to clone itself", function () {
            var data_value = null;
            var data_value2 = null;
            //
            data_value = new Data_Value({ value: 31 });
            data_value2 = data_value.clone();
            assert.deepEqual(data_value2.get(), 31);
            //
            var obj = { a: 1, b: 2 };
            data_value = new Data_Value({ value: obj });
            data_value2 = data_value.clone();
            obj.a = 2;
            assert.deepEqual(data_value2.get(), { a: 2, b: 2 });
        });

        it("should be able to provide an id", function () {
            var data_value = null;
            //
            data_value = new Data_Value();
            assert.throws(function () { data_value._id(); });
            //
            var nextId = 7;
            var context = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            //
            data_value = new Data_Value({ context: context });
            assert.deepEqual(data_value._id(), "data_value_007");
            assert.deepEqual(data_value._id(), "data_value_007"); // the same as above, new_id() was not called
        });

        it("should be able to have a parent", function () {
            var data_value = null;
            //
            // no parent:
            //
            data_value = new Data_Value();
            assert.deepEqual(data_value.parent(), undefined);
            //
            // set something as parent:
            //
            data_value.parent("123");
            assert.deepEqual(data_value.parent(), "123");
            assert.throws(function () { data_value._id(); });
            //
            // set something as parent (with index):
            //
            data_value.parent("777", 0);
            assert.deepEqual(data_value.parent(), "777");
            assert.throws(function () { data_value._id(); });
            //
            // set a parent with a context:
            //
            var nextId = 7;
            var myContext = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            //
            var myParent = { _context: myContext };
            data_value.parent(myParent);
            assert.deepEqual(data_value.parent(), myParent);
            assert.deepEqual(data_value._id(), "data_value_007");
            //
            // set a parent with a context, with index:
            //
            data_value = new Data_Value();
            assert.deepEqual(data_value.parent(), undefined);
            //
            data_value.parent(myParent, 0);
            assert.deepEqual(data_value.parent(), myParent);
            assert.deepEqual(data_value._id(), "data_value_008");
        });


    });


});


