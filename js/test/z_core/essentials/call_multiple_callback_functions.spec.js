
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/jsgui-lang-essentials', 'assert', '../../test-utils/test-utils'],
function (jsgui, assert, test_utils) {

    describe("z_core/essentials /call_multiple_callback_functions.spec.js ", function () {

        // -----------------------------------------------------
        //	empty arr_functions_params_pairs
        // -----------------------------------------------------

        it("should call the callback when the arr_functions_params_pairs array is empty", function (done) {

            var callback = function (err, res) {
                assert.equal(err, null);
                assert.equal(res, null);
                done();
            };

            jsgui.call_multiple_callback_functions([], callback);
        });

        // -----------------------------------------------------
        //	one async function call
        // -----------------------------------------------------

        it("should call the function asynchronously, pass the parameters, get the result", function (done) {

            var callback = function (err, res) {
                assert.equal(err, null);
                assert.deepEqual(res, [444]);
                done();
            };

            var task1_fn = function (arg1, arg2, cb) {
                setTimeout(function () { cb(null, (arg1 * 2) + arg2); }, 1);
            };
            var task1_args = [111, 222];

            var tasks = [[task1_fn, task1_args]];

            jsgui.call_multiple_callback_functions(tasks, callback);

        });

        // -----------------------------------------------------
        //	2 async function call
        // -----------------------------------------------------

        xit("should call the function asynchronously, pass the parameters, and get the results in right order", function (done) {

            var log = [];

            var callback = function (err, res) {
                assert.equal(err, null);
                assert.deepEqual(log, ["task2", "task1"]);
                assert.deepEqual(res, [444, 333]);
                done();
            };

            var task1_fn = function (arg1, arg2, cb) {
                setTimeout(function () { log.push("task1"); cb(null, (arg1 * 2) + arg2); }, 10);
            };
            var task1_args = [111, 222];

            var task2_fn = function (arg1, cb) {
                setTimeout(function () { log.push("task2"); cb(null, arg1); }, 1);
            };
            var task2_args = [333];

            var tasks = [[task1_fn, task1_args], [task2_fn, task2_args]];

            jsgui.call_multiple_callback_functions(tasks, 2, callback);

        });

        // -----------------------------------------------------
        //	test_async_timeouts
        // -----------------------------------------------------

        it("should call the functions one by one if the num_parallel is not specified (or if num_parallel == 1)", function (done) {

            var log = [];

            var fns = [];

            for (var c = 0; c < 32; c++) {
                (function () {
                    var i = c;
                    fns.push([function (cb) {
                        setTimeout(function () {
                            //console.log(i + ' complete');
                            log.push(i);
                            cb();
                        }, 1)
                    }, []]);
                }());
            }

            jsgui.call_multiple_callback_functions(fns, function (err, res) {
                if (err) {
                    throw err;
                } else {
                    //console.log('test_async_timeouts all done');
                    //assert.deepEqual(log, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, ]);
                    assert.equal(log.length, fns.length);
                    for (var i = 0; i < log.length; i++) {
                        assert.equal(log[i], i);
                    }
                    done();
                }
            });


        });

        // -----------------------------------------------------
        //	test_async_timeouts_multi_8
        // -----------------------------------------------------

        it("should ...", function (done) {

            var log = [];

            var fns = [];

            for (var c = 0; c < 32; c++) {
                (function () {
                    var i = c;
                    fns.push([function (cb) {
                        setTimeout(function () {
                            //console.log(i + ' complete');
                            log.push(i);
                            cb();
                        }, 1)
                    }, []]);
                }());
            }

            jsgui.call_multiple_callback_functions(fns, function (err, res) {
                if (err) {
                    throw err;
                } else {
                    //console.log('test_async_timeouts all done');
                    //assert.deepEqual(log, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, ]);
                    assert.equal(log.length, fns.length);
                    for (var i = 0; i < log.length; i++) {
                        assert.equal(log[i], i);
                    }
                    done();
                }
            });


        });

    });


});


