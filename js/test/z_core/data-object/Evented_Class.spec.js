
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/data-object', 'assert'],
function (Data_Object, assert) {

    describe("data-object /Evented_Class.spec.js ", function () {

        // -----------------------------------------------------
        //	Evented_Class
        // -----------------------------------------------------

        // ====================================================
        //     test event handler (listener) environment:
        // ====================================================

        var handler_call_args = null; // the arguments passed to the event handler
        var handler_call_count = 0;   // how many times the handler was called

        // the test handler:
        function handler() {
            handler_call_args = Array.prototype.slice.call(arguments, 0); // save the args
            handler_call_count++; // count the calls
            //
            return [handler_call_count, handler_call_args]; // return some result
        }

        // =========================================
        //                  the test:
        // =========================================

        it("should works", function () {
            //
            // test Data_Object.Data_Value evented class:
            test_evented_object(new Data_Object.Data_Value());
            //
            // test Data_Object evented class:
            test_evented_object(new Data_Object());
        });

        // =========================================
        //                  test utils:
        // =========================================

        function test_evented_object(evented_object) {
            //
            // initially no handlers are subscribed:
            //
            check_event_not_subscribed(evented_object, "event1");
            check_event_not_subscribed(evented_object, "event2");
            //
            // subscribe handler using different methods (add_event_listener() and on()):
            //
            evented_object.add_event_listener("event1", handler);
            evented_object.on("event2", handler);
            //
            // the handlers are subscribed:
            //
            check_event_subscribed(evented_object, "event1");
            check_event_subscribed(evented_object, "event2");
            //
            // subscribe the same handlers again, using the methods in different order:
            //
            evented_object.on("event1", handler);
            evented_object.add_event_listener("event2", handler);
            //
            // the handlers are subscribed twice:
            //
            check_event_subscribed(evented_object, "event1", 2);
            check_event_subscribed(evented_object, "event2", 2);
            //
            // unsubscribe the handlers:
            //
            evented_object.remove_event_listener("event1", handler);
            evented_object.off("event2", handler);
            //
            // now only one handler is subscribed for each event:
            //
            check_event_subscribed(evented_object, "event1");
            check_event_subscribed(evented_object, "event2");
            //
            // unsubscribe the handlers again:
            //
            evented_object.off("event1", handler);
            evented_object.remove_event_listener("event2", handler);
            //
            // nothing is subscribed:
            //
            check_event_not_subscribed(evented_object, "event1");
            check_event_not_subscribed(evented_object, "event2");
            //
            // unsubscribe the handlers again (no errors should be raised):
            //
            evented_object.off("event1", handler);
            evented_object.remove_event_listener("event2", handler);
            //
            // nothing is subscribed:
            //
            check_event_not_subscribed(evented_object, "event1");
            check_event_not_subscribed(evented_object, "event2");
        }

        // === check_event_not_subscribed() ===

        function check_event_not_subscribed(evented_object, event_name) {
            // try to raise the event using 3 different methods:
            check_not_raised(evented_object.raise_event(event_name));
            check_not_raised(evented_object.raise(event_name));
            check_not_raised(evented_object.trigger(event_name));
        }

        function check_not_raised(raise_event_result) {
            //
            // if the event was not subscribed before, then raise_event() returns "undefined"
            // in other case (the event was subscribed, then unsubscribed) it returns "[]"
            // BTW not consistent !!!
            //
            if (raise_event_result !== undefined) {
                assert.deepEqual(raise_event_result, []);
            }
            //
            assert.deepEqual(handler_call_args, null);
            assert.deepEqual(handler_call_count, 0);
        }

        // === check_event_subscribed() ===

        function check_event_subscribed(evented_object, event_name, handlers_count) {
            if (handlers_count === undefined) handlers_count = 1;
            //
            // try to raise the event using 3 different methods:
            //
            check_raised(evented_object.raise_event(event_name), [], handlers_count);
            check_raised(evented_object.raise(event_name), [], handlers_count);
            check_raised(evented_object.trigger(event_name), [], handlers_count);
            //
            // try to raise the event using 3 different methods and passing parameters:
            //
            check_raised(evented_object.raise_event(event_name, 101, "102"), [101, "102"], handlers_count);
            check_raised(evented_object.raise(event_name, 101, "102"), [101, "102"], handlers_count);
            check_raised(evented_object.trigger(event_name, 101, "102"), [101, "102"], handlers_count);
        }

        function check_raised(raise_event_result, estimated_args, handlers_count) {
            var estimated_raise_event_result = [];
            for (var i = 1; i <= handlers_count; i++) {
                estimated_raise_event_result.push([i, estimated_args]); // because our test handler returns [handler_call_count, handler_call_args]
            }
            //
            assert.deepEqual(raise_event_result, estimated_raise_event_result);
            //
            assert.deepEqual(handler_call_args, estimated_args);
            assert.deepEqual(handler_call_count, handlers_count);
            //
            // reset for the next use:
            //
            handler_call_args = null;
            handler_call_count = 0;
        }

    });


});


