
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/jsgui-lang-essentials', 'assert', '../../test-utils/test-utils'],
function (jsgui, assert, test_utils) {

    describe("z_core/essentials /mapify.spec.js ", function () {

        // -----------------------------------------------------
        //	mapify() - array
        // -----------------------------------------------------

        it("mapify() should convert a key/value array into an object", function () {

            assert.deepEqual(jsgui.mapify([["name", "John"], ["age", 22]]), { name: "John", age: 22 });

        });

        // -----------------------------------------------------
        //	mapify() - array, name
        // -----------------------------------------------------

        it("mapify() should convert a key/value array into an object mappied by a specified property", function () {

            var source = [{ name: "Larry", age: 21 }, { name: "John", age: 22 }];

            var estimated_result = { Larry: { name: "Larry", age: 21 }, John: { name: "John", age: 22 } };

            assert.deepEqual(jsgui.mapify(source, "name"), estimated_result);

        });


        // -----------------------------------------------------
        //	mapify() - function [o]
        // -----------------------------------------------------

        it("mapify() should create a function calling for key/value pairs of passed object", function () {

            var keys = [];
            var values = [];

            var addKeyValue = function (key, value, other) {
                assert.equal(other, undefined);
                //
                keys.push(key);
                values.push(value);
            };

            var mapified_addKeyValue = jsgui.mapify(addKeyValue);

            mapified_addKeyValue({ a: 1, b: 2, name: "John" });

            assert.deepEqual(keys, ["a", "b", "name"]);
            assert.deepEqual(values, [1, 2, "John"]);

        });


        // -----------------------------------------------------
        //	mapify() - function [o,f]
        // -----------------------------------------------------

        it("mapify() should create an async function calling for key/value pairs of passed object", function (done) {


            // ------- function: [o,f] -------

            var keys = [];
            var values = [];

            var asyncAddKeyValue = function (key, value, cb, other) {
                assert.equal(other, undefined);

                setTimeout(function () {
                    keys.push(key);
                    values.push(value);
                    cb(null, key + "=" + value);
                }, 1);

            };

            var callback = function (error, result) {
                assert.equal(error, null);
                //
                assert.deepEqual(result, ["a=1", "b=2", "name=John"]);
                //
                assert.deepEqual(keys, ["a", "b", "name"]);
                assert.deepEqual(values, [1, 2, "John"]);
                //
                done();
            };

            var mapified_asyncAddKeyValue = jsgui.mapify(asyncAddKeyValue);

            mapified_asyncAddKeyValue({ a: 1, b: 2, name: "John" }, callback);

        });


        // -----------------------------------------------------
        //	mapify() - function, other
        // -----------------------------------------------------

        it("mapify() should create a function just passing the parameters to original function", function () {

            var estimated_args = [1, 5, 10];

            var func = function () {
                var args = Array.prototype.slice.call(arguments);
                assert.deepEqual(args, estimated_args);
            };

            jsgui.mapify(func)(1, 5, 10);

        });

        // -----------------------------------------------------
        //	mapify() - function, other, this
        // -----------------------------------------------------

        it("mapify() should create a function just passing the parameters with context to original function", function () {

            var func = function () {
                assert.equal(this, estimated_this);
                //
                var args = Array.prototype.slice.call(arguments);
                assert.deepEqual(args, estimated_args);
            };

            var obj = {};
            obj.mapified_func = jsgui.mapify(func);

            var estimated_this = obj;
            var estimated_args = [{ a: 1, b: 2, name: "John" }, 123];

            obj.mapified_func({ a: 1, b: 2, name: "John" }, 123);

        });

    });


});


