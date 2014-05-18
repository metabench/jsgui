
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/jsgui-lang-essentials', 'assert'],
function (jsgui, assert) {

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

        it("should call the function asynchronously, pass the parameters, and get the results in right order", function (done) {

            var log = [];

            var callback = function (err, res) {
                assert.equal(err, null);
                assert.deepEqual(log, ["task2", "task1"]); // task2 called before the task1 because of the setTimeout() timeout
                assert.deepEqual(res, [111, 222]); // task1 result, then task2 result
                done();
            };

            var task1_fn = function (arg1, arg2, cb) {
                setTimeout(function () { log.push("task1"); cb(null, (arg2 - arg1)); }, 10); // result: 111
            };
            var task1_args = [111, 222];

            var task2_fn = function (arg1, cb) {
                setTimeout(function () { log.push("task2"); cb(null, arg1 / 2); }, 1); // result: 222
            };
            var task2_args = [444];

            var tasks = [[task1_fn, task1_args], [task2_fn, task2_args]];

            jsgui.call_multiple_callback_functions(tasks, 300, callback);

        });

        // -----------------------------------------------------
        //	test_async_timeouts
        // -----------------------------------------------------

        it("should call the functions one by one if the num_parallel is not specified (or if num_parallel == 1)", function (done) {

            var fns = [];
            var log = [];

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
                    //
                    // make sure all the functions was executed (in the predefined order):
                    //assert.deepEqual(log, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,... ]);
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

        function arrayIndexOf(array, item) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] === item) return i;
            }
            return -1;
        }

        it("should execute all the functions (allowing up to 8 a the same time), then call the callback when all the functions are finished", function (done) {

            var fns = [];
            var log = [];

            for (var c = 0; c < 32; c++) {
                (function () {
                    var i = c;
                    fns.push([function (callback) {
                        setTimeout(function () {
                            //console.log(i + ' complete');
                            log.push(i);
                            callback(null, true);
                        }, 1)
                    }, []]);
                }());
            }

            // arr, fn
            // arr, num, fn - number is the number of parallel to execute at once.
            jsgui.call_multiple_callback_functions(fns, 8, function (err, res) {
                if (err) {
                    throw err;
                } else {
                    //console.log('test_async_timeouts_multi_8 all done');
                    //console.log(log);
                    //
                    // make sure all the functions was executed (in any order):
                    assert.equal(log.length, fns.length);
                    for (var i = 0; i < log.length; i++) {
                        assert.ok(arrayIndexOf(log, i) >= 0);
                    }
                    //
                    done();
                }
            });


        });

        // -----------------------------------------------------
        //	documentation sample
        // -----------------------------------------------------

        it("should execute the example from the documentation", function (done) {

            var tasks = [];

            var task1 = function (arg1, arg2, cb) {
                setTimeout(function () { cb(null, (arg1 * arg2)); }, 1); // multiply arg1 * arg2
            };

            tasks.push([task1, [10, 2]]);   // multiply 10 * 2

            jsgui.call_multiple_callback_functions(tasks, function (error, result) {
                //console.log("All the tasks are done. The first task result is " + result[0]);
                assert.equal(error, null);
                assert.equal(result, 20);
                done();
            });
        });

        // ================================================================================================================================
        //	                        test different call signatures (i.e. polymorphic versions)
        // ================================================================================================================================

        // -----------------------------------------------------
        //	(a,f)
        // -----------------------------------------------------

        it("should process (tasks, callback) parameters", function (done) {

            var callback = function (err, res) {
                assert.equal(err, null);
                assert.deepEqual(res, [222]);
                done();
            };

            var task1_fn = function (arg1, cb) {
                setTimeout(function () { cb(null, (arg1 * 2)); }, 1);
            };
            var task1_args = [111];

            var tasks = [[task1_fn, task1_args]];

            jsgui.call_multiple_callback_functions(tasks, callback);

        });

        // -----------------------------------------------------
        //	(a,n,f)
        // -----------------------------------------------------

        it("should process (tasks, num_parallel, callback) parameters", function (done) {

            var callback = function (err, res) {
                assert.equal(err, null);
                assert.deepEqual(res, [222]);
                done();
            };

            var task1_fn = function (arg1, cb) {
                setTimeout(function () { cb(null, (arg1 * 2)); }, 1);
            };
            var task1_args = [111];

            var tasks = [[task1_fn, task1_args]];

            jsgui.call_multiple_callback_functions(tasks, 100, callback);

        });


        // -----------------------------------------------------
        //	(a,f,b)
        // -----------------------------------------------------

        it("should process (tasks, callback, return_params) parameters", function (done) {

            var callback = function (err, res) {
                assert.equal(err, null);
                assert.deepEqual(res, [[[111], 222]]);
                done();
            };

            var task1_fn = function (arg1, cb) {
                setTimeout(function () { cb(null, (arg1 * 2)); }, 1);
            };
            var task1_args = [111];

            var tasks = [[task1_fn, task1_args]];

            jsgui.call_multiple_callback_functions(tasks, callback, true);

        });

        // ================================================================================================================================
        //	                        test different task signatures
        // ================================================================================================================================

        // -----------------------------------------------------
        //	fn
        // -----------------------------------------------------

        it("should process fn task signature", function (done) {

            var callback = function (err, res) {
                assert.equal(err, null);
                assert.deepEqual(res, [222]);
                done();
            };

            var task1_fn = function (cb) {
                setTimeout(function () { cb(null, 222); }, 1);
            };

            var tasks = [task1_fn];

            jsgui.call_multiple_callback_functions(tasks, callback);

        });

        // -----------------------------------------------------
        //	[context, fn]
        // -----------------------------------------------------

        it("should process [context, fn] task signature", function (done) {

            var callback = function (err, res) {
                assert.equal(err, null);
                assert.deepEqual(res, [222]);
                done();
            };

            var task1_obj = { calc: function (x) { return 222; } };

            var task1_fn = function (cb) {
                var obj = this;
                setTimeout(function () { cb(null, obj.calc()); }, 1);
            };

            var tasks = [[task1_obj, task1_fn]];

            jsgui.call_multiple_callback_functions(tasks, callback);

        });

        // -----------------------------------------------------
        //	[fn, params]
        // -----------------------------------------------------

        it("should process [fn, params] task signature", function (done) {

            var callback = function (err, res) {
                assert.equal(err, null);
                assert.deepEqual(res, [222]);
                done();
            };

            var task1_fn = function (arg1, cb) {
                setTimeout(function () { cb(null, (arg1 * 2)); }, 1);
            };
            var task1_args = [111];

            var tasks = [[task1_fn, task1_args]];

            jsgui.call_multiple_callback_functions(tasks, callback);

        });

        // -----------------------------------------------------
        //	[fn, params, fn_callback]
        // -----------------------------------------------------

        it("should process [fn, params, fn_callback] task signature", function (done) {

            var task1_callback_called = false;

            var callback = function (err, res) {
                assert.equal(err, null);
                assert.deepEqual(res, [222]);
                assert.ok(task1_callback_called);
                done();
            };

            var task1_callback = function (err, res) {
                assert.equal(err, null);
                assert.equal(res, 222);
                task1_callback_called = true;
            };

            var task1_fn = function (arg1, cb) {
                setTimeout(function () { cb(null, (arg1 * 2)); }, 1);
            };
            var task1_args = [111];

            var tasks = [[task1_fn, task1_args, task1_callback]];

            jsgui.call_multiple_callback_functions(tasks, callback);

        });

        it("should process [fn, params, fn_callback] task signature (2 tasks test)", function (done) {

            var log = [];

            var callback = function (err, res) {
                assert.equal(err, null);
                assert.deepEqual(log, ["task2", "task1"]);
                assert.deepEqual(res, [222, 444]);
                done();
            };

            // task1

            var task1_callback = function (err, res) {
                assert.equal(err, null);
                assert.equal(res, 222);
                log.push("task1");
            };

            var task1_fn = function (arg1, cb) {
                setTimeout(function () { cb(null, (arg1 * 2)); }, 10);
            };
            var task1_args = [111];

            // task2

            var task2_callback = function (err, res) {
                assert.equal(err, null);
                assert.equal(res, 444);
                log.push("task2");
            };

            var task2_fn = function (arg1, cb) {
                setTimeout(function () { cb(null, (arg1 / 2)); }, 1);
            };
            var task2_args = [888];

            //

            var tasks = [
                [task1_fn, task1_args, task1_callback],
                [task2_fn, task2_args, task2_callback]
            ];

            jsgui.call_multiple_callback_functions(tasks, 2, callback);

        });

        // -----------------------------------------------------
        //	[context, fn, params]
        // -----------------------------------------------------

        it("should process [context, fn, params] task signature", function (done) {

            var callback = function (err, res) {
                assert.equal(err, null);
                assert.deepEqual(res, [222]);
                done();
            };

            var task1_obj = { calc: function (x) { return x * 2; } };

            var task1_fn = function (arg1, cb) {
                var obj = this;
                setTimeout(function () { cb(null, obj.calc(arg1)); }, 1);
            };
            var task1_args = [111];

            var tasks = [[task1_obj, task1_fn, task1_args]];

            jsgui.call_multiple_callback_functions(tasks, callback);

        });

        // -----------------------------------------------------
        //	[context, fn, params, fn_callback]
        // -----------------------------------------------------

        it("should process [context, fn, params, fn_callback] task signature", function (done) {

            var task1_callback_called = false;

            var callback = function (err, res) {
                assert.equal(err, null);
                assert.deepEqual(res, [222]);
                assert.ok(task1_callback_called);
                done();
            };

            var task1_obj = { calc: function (x) { return x * 2; } };

            var task1_callback = function (err, res) {
                assert.equal(err, null);
                assert.equal(res, 222);
                task1_callback_called = true;
            };

            var task1_fn = function (arg1, cb) {
                var obj = this;
                setTimeout(function () { cb(null, obj.calc(arg1)); }, 1);
            };

            var task1_args = [111];

            var tasks = [[task1_obj, task1_fn, task1_args, task1_callback]];

            jsgui.call_multiple_callback_functions(tasks, callback);

        });



    });


});


