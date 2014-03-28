
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/jsgui-lang-essentials', 'assert', '../../test-utils/test-utils'],
function (jsgui, assert, test_utils) {

    describe("z_core/essentials /arrayify.spec.js ", function () {

        // -----------------------------------------------------
        //	arrayify() - object
        // -----------------------------------------------------

        it("arrayify() should create a [key, value] items array from an object", function () {
            assert.deepEqual(jsgui.arrayify({}), []);
            assert.deepEqual(jsgui.arrayify({ a: 1, b: 2 }), [["a", 1], ["b", 2]]);
        });

        // -----------------------------------------------------
        //	arrayify() - function
        // -----------------------------------------------------

        it("arrayify() should create an arrayifed version from a function", function () {

            var multiply = function (a, b) {
                return a * b;
            };

            // multiply([a], b)
            
            var arrayified_multiply = jsgui.arrayify(multiply); 

            assert.deepEqual(arrayified_multiply([1, 5, 10], 2), [2, 10, 20]);
            
            // multiply(a, [b])

            var arrayified_multiply2 = jsgui.arrayify(1, multiply); 

            assert.deepEqual(arrayified_multiply2(10, [1, 5, 10]), [10, 50, 100]);

        });

        // -----------------------------------------------------
        //	arrayify() - async1
        // -----------------------------------------------------

        it("arrayify() should create an arrayifed async version from a function", function (done) {

            var asyncMultiply = function (a, b, cb) {
                setTimeout(function () { cb(null, a * b); }, 1);
            };

            var arrayified_asyncMultiply = jsgui.arrayify(asyncMultiply); // asyncMultiply([a], b, cb)

            var callback = function (error, result) {
                assert.equal(error, null);
                assert.deepEqual(result, [2, 10, 20]);
                done();
            };

            arrayified_asyncMultiply([1, 5, 10], 2, callback);

        });

        // -----------------------------------------------------
        //	arrayify() - async2
        // -----------------------------------------------------

        it("arrayify() should create an arrayifed async version from a function, for the specified parameter", function (done) {

            var asyncMultiply = function (a, b, cb) {
                setTimeout(function () { cb(null, a * b); }, 1);
            };

            var arr_asyncMultiply = jsgui.arrayify(1, asyncMultiply); // asyncMultiply(a, [b], cb)

            var callback = function (error, result) {
                assert.equal(error, null);
                assert.deepEqual(result, [10, 50, 100]);
                done();
            };

            arr_asyncMultiply(10, [1, 5, 10], callback);

        });

        // -----------------------------------------------------
        //	arrayify() - synthetic test 1
        // -----------------------------------------------------

        it("arrayify() probably should keep this behaviour", function () {

            var func1 = jsgui.arrayify(function () {
                var args = Array.prototype.slice.call(arguments);
                return args;
            });

            assert.deepEqual(func1(1, 2, "a"), [1, 2, "a"]);

            assert.deepEqual(func1([1, 2, "a"]), [[1], [2], ["a"]]);

            assert.deepEqual(func1([1, 2, 3], "a", "b"), [[1, "a", "b"], [2, "a", "b"], [3, "a", "b"]]);

        });

        // -----------------------------------------------------
        //	arrayify() - synthetic test 2
        // -----------------------------------------------------

        it("arrayify() probably should keep this async-like behaviour", function (done) {

            var func2 = jsgui.arrayify(function (a, b, cb) {
                var args = Array.prototype.slice.call(arguments);
                //console.log('=' + jsgui.stringify(args) + '=');
                // =[1, 100, ]=
                // =[2, 100, ]=
                // =["a", 100, ]=

                cb(null, args);
            });

            var callback = function (error, result) {
                var args = Array.prototype.slice.call(arguments);
                //console.log('*' + jsgui.stringify(args) + '*'); // *[null, [1, 100, , 2, 100, , "a", 100, ]]*
                assert.equal(error, null);
                assert.equal(jsgui.stringify(args), '[null, [1, 100, , 2, 100, , "a", 100, ]]');
                done();
            };

            func2([1, 2, "a"], 100, callback);

        });

        // -----------------------------------------------------
        //	arrayify() - synthetic test 3
        // -----------------------------------------------------

        it("arrayify() should keep this async-like behaviour", function (done) {

            var func2 = jsgui.arrayify(function (a, b, cb) {
                cb(null, {a: a, b: b});
            });

            var callback = function (error, result) {
                assert.equal(error, null);
                assert.deepEqual(result, [{ a: 1, b: 100 }, { a: 2, b: 100 }, { a: "a", b: 100 }]);
                done();
            };

            func2([1, 2, "a"], 100, callback);

        });

    });


});


