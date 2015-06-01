var jsgui = require('./jsgui-lang-essentials');

var j = jsgui;
var Class = j.Class;
var each = j.each;
var is_array = j.is_array;
var is_dom_node = j.is_dom_node;
var is_ctrl = j.is_ctrl;
var extend = j.extend;
var get_truth_map_from_arr = j.get_truth_map_from_arr;
var get_map_from_arr = j.get_map_from_arr;
var arr_like_to_arr = j.arr_like_to_arr;
var tof = j.tof;
var is_defined = j.is_defined;
var stringify = j.stringify;
var functional_polymorphism = j.functional_polymorphism;
var fp = j.fp;
var arrayify = j.arrayify;
var mapify = j.mapify;
var are_equal = j.are_equal;
var get_item_sig = j.get_item_sig;
var set_vals = j.set_vals;
var truth = j.truth;
var trim_sig_brackets = j.trim_sig_brackets;
var ll_set = j.ll_set;
var ll_get = j.ll_get;
var input_processors = j.input_processors;
var iterate_ancestor_classes = j.iterate_ancestor_classes;
var is_arr_of_arrs = j.is_arr_of_arrs;
var is_arr_of_strs = j.is_arr_of_strs;
var is_arr_of_t = j.is_arr_of_t;
var clone = jsgui.clone;

var Evented_Class = Class.extend({

    // Needs to initialize the bound events to start with.

    'init': function() {
        this._bound_events = {};
    },

    'raise_event': fp(function(a, sig) {

        var that = this;
        var c, l;

        if (sig == '[s]') {
            // just raise an event, given with no parameters,
            //  maybe like 'started'.

            var target = this;
            var event_name = a[0];

            //console.log('Data_Object raise_event ' + event_name);

            var bgh = this._bound_general_handler;
            var be = this._bound_events;

            if (be) {
                // This is attaching events to the same object.
                //  Not sure why, but this needs to be fixed.


                var bei = be[event_name];

                //console.log('bei', bei);
                //console.log('tof bei', tof(bei));
                if (tof(bei) == 'array') {
                    //console.log('1) raise_event bei.length ' + bei.length);
                    var res = [];

                    for (c = 0, l = bei.length; c < l; c++) {
                      res.push(bei[c].call(target));
                    }

                    //console.log('Evented_Class raise_event [s] res', res);
                    return res;
                }// else if (tof(bei) == 'function') {
                //	bei.call(target, target, event_name);
                //}
            }
        }

        if (a.l >= 2) {
            var target = this;
            var event_name = a[0];

            //console.log('event_name ' + event_name);

            var additional_args = [];
            for (c = 1, l = a.l; c < l; c++) {
                additional_args.push(a[c]);
            }

            var be = this._bound_events;
            //console.log('be ' + tof(be));
            if (be) {
                // The controls that are activated on the clients need to have bound events.

                //console.log('event_name', event_name);
                var bei = be[event_name];
                //console.log('bei ', bei);
                if (tof(bei) == 'array') {
                    //console.log('1) raise_event bei.length ' + bei.length);

                    if (bei.length > 0) {
                        var res = [];

                        // They are handlers that get called.

                        for (c = 0, l = bei.length; c < l; c++) {
                          if (bei[c]) res.push(bei[c].apply(target, additional_args));

                        }

                        return res;
                    } else {
                        return false;
                    }


                    //console.log('2) raised the bound events');
                }
                // Or if it's just a function?

            }

        }

        if (sig == '[s,o]') {
            var be = this._bound_events;
            //console.log('this._bound_events', this._bound_events);
            if (be) {
                var bei = be[event_name];

                //console.log('bei.length', bei.length);
                //console.log('tof bei', tof(bei));
                if (tof(bei) == 'array') {
                    //console.log('1) raise_event bei.length ' + bei.length);
                    var res = [];

                    for (c = 0, l = bei.length; c < l; c++) {
                      res.push(bei[c].call(target, a[1]));
                    }

                    //each(bei, function(i, v) {
                    //    res.push(v.call(target, a[1]));
                    //});

                    //console.log('Evented_Class raise_event [s] res', res);
                    return res;
                }
            }
        }

        return [];
    }),

    // also just raise and trigger?

    //'raise': function() {
    //    return this.raise_event.apply(this, arguments);
  //},
    //'trigger': function() {
    //    return this.raise_event.apply(this, arguments);
    //},


    'add_event_listener' : fp(function(a, sig) {

        // event listener for all events...
        //  that could work with delegation, and then when the code finds the event it interprets it.
        //console.log('');
        //console.log('data_object add_event_listener sig ' + sig);

        // Why is this getting called so many times, for the same object?



        //console.log('');
        // Why is the bound events array getting so big?

        if (sig == '[f]') {
            var stack = new Error().stack;
            console.log(stack);
            throw 'stop';
            this._bound_general_handler = this._bound_general_handler || [];
            if (Array.isArray(this._bound_general_handler)) {
            //if (tof(this._bound_general_handler) == 'array') {
                this._bound_general_handler.push(a[0]);
            };
        }
        // Why does a change event listener get bound to the wrong control, or bound multiple times?
        //  Changes getting pushed up through the tree?


        if (sig == '[s,f]') {
            // bound to a particular event name

            // want the general triggering functions to be done too.
            //  with a different function
            var event_name = a[0], fn_listener = a[1];
            //console.log('event_name ' + event_name);
            this._bound_events = this._bound_events || {};

            // removing from a bound general handler being slow?
            //  perhaps... but we won't have so many of these anyway.
            //  could get id for object and have it within collection.
            //   But not sure about using collections for events... collections use events...?

            // Different controls binding to the same array of events?

            if (!this._bound_events[event_name]) this._bound_events[event_name] = [];

            var bei = this._bound_events[event_name];
            //console.log('this._id() ' + this._id());
            if (Array.isArray(bei)) {
            //if (tof(bei) == 'array') {
                //console.log('this', this);
                //console.log('add_event_listener bei.length ' + bei.length);
                bei.push(fn_listener);
            };
        }

    }),

    // A way of proxying functions below?
    //  Or simply use function alias?
    'on': function() {
        // However, need to make use of some document events.
        //  With some controls, we need to pass through

        return this.add_event_listener.apply(this, arguments);


    },

    'remove_event_listener': function(event_name, fn_listener) {
        // needs to go through the whole array?
        // think so....

        //console.log('remove_event_listener');
        //console.log('this._bound_events', this._bound_events);
        if (this._bound_events) {
            //console.log('event_name', event_name);
            var bei = this._bound_events[event_name] || [];

            //var tbei = tof(bei);
            //console.log('tbei', tbei);

            if (Array.isArray(bei)) {
                // bei.push(fn_listener);

                var c = 0, l = bei.length, found = false;

                //console.log('l', l);

                while (!found && c < l) {
                    if (bei[c] === fn_listener) {
                        found = true;
                    } else {
                        c++;
                    }
                }
                //console.log('found', found);
                //console.log('c', c);
                if (found) {
                    bei.splice(c, 1);
                }
            };
        }


    },

    'off': function() {
        // However, need to make use of some document events.
        //  With some controls, we need to pass through

        return this.remove_event_listener.apply(this, arguments);

    },
    'one': function(event_name, fn_handler) {

        var inner_handler = function(e) {

            fn_handler.call(this, e);
            this.off(event_name, inner_handler);
        };

        this.on(event_name, inner_handler);
    }
});

var p = Evented_Class.prototype;
p.raise = p.raise_event;
p.trigger = p.raise_event;

module.exports = Evented_Class;
