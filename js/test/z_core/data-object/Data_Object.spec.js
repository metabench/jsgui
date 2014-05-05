
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/data-object', 'assert'],
function (Data_Object, assert) {

    describe("data-object /Data_Object.spec.js ", function () {

        // -----------------------------------------------------
        //	Data_Object
        // -----------------------------------------------------

        it("should ...", function () {
            var data_object = new Data_Object();
            assert.deepEqual(data_object.stringify(), "Data_Object({})");
            assert.deepEqual(data_object.toObject(), {});
            //
        });

        // -----------------------------------------------------
        //	init()
        // -----------------------------------------------------

        function base_check(data_object) {
            if (data_object._abstract) {
                assert.deepEqual(data_object.__type, undefined);
                assert.deepEqual(data_object._, undefined);
            } else {
                assert.deepEqual(data_object.__type, 'data_object');
                assert.deepEqual(data_object._, {});
            }
            //
            assert.deepEqual(data_object.fc, undefined);
        }

        xit("should ...", function () {
            var data_object = null;
            //
            // default
            //
            data_object = new Data_Object();
            base_check(data_object);
            //
            assert.deepEqual(data_object.stringify(), "Data_Object({})");
            assert.deepEqual(data_object.toObject(), {});
            //
            // abstract: object
            //
            data_object = new Data_Object({ abstract: true });
            base_check(data_object);
            //
            //
            assert.deepEqual(data_object._abstract, true);
            assert.deepEqual(data_object._type_constructor, undefined);
            assert.deepEqual(data_object._spec, { abstract: true }); // ?
            //
            assert.deepEqual(data_object.stringify(), "Data_Object(undefined)");
            assert.deepEqual(data_object.toObject(), {});
            //
            // abstract: function
            //
            var type_constructor = function () { };
            type_constructor.abstract = true;
            data_object = new Data_Object(type_constructor);
            base_check(data_object);
            //
            assert.deepEqual(data_object._abstract, true);
            assert.deepEqual(data_object._type_constructor, type_constructor);
            assert.deepEqual(data_object._spec, undefined);
            //
            assert.deepEqual(data_object.stringify(), "Data_Object(undefined)");
            assert.deepEqual(data_object.toObject(), {});
            //
            // _context
            //
            var nextId = 7;
            var myContext = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            data_object = new Data_Object({ context: myContext });
            base_check(data_object);
            //
            assert.deepEqual(data_object._context, myContext);
            //
            // __id
            //
            data_object = new Data_Object({ _id: "008" });
            base_check(data_object);
            //
            assert.deepEqual(data_object.__id, "008");
            //
            // 
            //
            data_object = new Data_Object({});
            base_check(data_object);
            //
            //assert.deepEqual(data_object.constructor, 'data_object');
        });


        // -----------------------------------------------------
        //	__id
        // -----------------------------------------------------

        it("should assign an _id sometimes", function () {
            var data_object = null;
            //
            // default
            //
            data_object = new Data_Object();
            assert.deepEqual(data_object.__id, undefined);
            //
            // abstract: object
            //
            data_object = new Data_Object({ abstract: true });
            assert.deepEqual(data_object.__id, undefined);
            //
            // abstract: function
            //
            var type_constructor = function () { };
            type_constructor.abstract = true;
            data_object = new Data_Object(type_constructor);
            assert.deepEqual(data_object.__id, undefined);
            //
            // _context
            //
            var nextId = 7;
            var myContext = { new_id: function (prefix) { return prefix + "_00" + nextId++; } };
            data_object = new Data_Object({ context: myContext });
            assert.deepEqual(data_object.__id, "data_object_007");
            //
            // _id
            //
            data_object = new Data_Object({ _id: "008" });
            assert.deepEqual(data_object.__id, "008");
            //
            // no context, no _id
            //
            data_object = new Data_Object({});
            assert.deepEqual(data_object.__id, undefined);
        });

        // -----------------------------------------------------
        //	spec function
        // -----------------------------------------------------

        xit("should ...", function () {
            var call_count = 0;
            var data_object = new Data_Object({ f1: function () { call_count++; } });
            assert.deepEqual(call_count, 1);
        });

    });


});


