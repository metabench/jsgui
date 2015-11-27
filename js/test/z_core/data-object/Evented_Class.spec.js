
describe("z_core/data-object /Evented_Class.spec.js ", function () {

    var Evented_Class;
    var Data_Object;
    var Data_Value;
    var assert;

    before(function () {
        var jsgui_module_name = require.resolve('../../../core/jsgui-lang-essentials');
        delete require.cache[jsgui_module_name];
        //
        Evented_Class = require('../../../core/evented-class');
        Data_Object = require('../../../core/data-object');
        Data_Value = require('../../../core/data-value');
        assert = require('assert');
    });

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
        // test Evented_Class:
        test_evented_object(new Evented_Class());
        //
        // test Data_Value evented class:
        test_evented_object(new Data_Value());
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
        //
        // --- test one() method: ---
        //
        evented_object.one("event1", handler);
        check_event_subscribed_one(evented_object, "event1");
        //
        // --- general listener: ---
        //
        evented_object.add_event_listener(handler);
        check_event_subscribed(evented_object, "event1", 1, true);
        check_event_subscribed(evented_object, "event2", 1, true);
        //
        evented_object.add_event_listener(handler);
        check_event_subscribed(evented_object, "event1", 2, true);
        check_event_subscribed(evented_object, "event2", 2, true);
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
        assert.deepEqual(raise_event_result, []);
        //
        assert.deepEqual(handler_call_args, null);
        assert.deepEqual(handler_call_count, 0);
    }

    // === check_event_subscribed() ===

    function check_event_subscribed(evented_object, event_name, handlers_count, isGeneral) {
        if (handlers_count === undefined) handlers_count = 1;
        //
        // try to raise the event using 3 different methods:
        //
        var args = [];
        if (isGeneral) args.push(event_name);
        //
        check_raised(evented_object.raise_event(event_name), args, handlers_count);
        check_raised(evented_object.raise(event_name), args, handlers_count);
        check_raised(evented_object.trigger(event_name), args, handlers_count);
        //
        // try to raise the event using 3 different methods and passing parameters:
        //
        args = [];
        if (isGeneral) args.push(event_name);
        args.push(101);
        args.push("102");
        //
        check_raised(evented_object.raise_event(event_name, 101, "102"), args, handlers_count);
        check_raised(evented_object.raise(event_name, 101, "102"), args, handlers_count);
        check_raised(evented_object.trigger(event_name, 101, "102"), args, handlers_count);
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

    function check_event_subscribed_one(evented_object, event_name, handlers_count) {
        if (handlers_count === undefined) handlers_count = 1;
        //
        // try to raise the event:
        //
        check_raised_one(evented_object.raise_event(event_name, 101, "102"), [101, "102"], handlers_count);
        check_not_raised(evented_object.raise(event_name));
    }

    function check_raised_one(raise_event_result, estimated_args, handlers_count) {
        var estimated_raise_event_result = [];
        for (var i = 1; i <= handlers_count; i++) {
            estimated_raise_event_result.push(undefined); // !!! .one() handler wrapper does not return anything
        }
        //
        assert.deepEqual(raise_event_result, estimated_raise_event_result);
        //
        estimated_args = estimated_args.slice(0, 1); // !!! .one() handler wrapper pass the first argument only
        assert.deepEqual(handler_call_args, estimated_args);
        assert.deepEqual(handler_call_count, handlers_count);
        //
        // reset for the next use:
        //
        handler_call_args = null;
        handler_call_count = 0;
    }

});

