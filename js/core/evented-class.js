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
        // The events system is not working right on the server.

        //console.log('Data_Object.raise_event');
        // a general event listener would be nice... so we don't need to tell it what events we are listening for, but it presents us with that
        //  information.

        // A more generalized event handler?

        // this._bound_general_handler
        //  useful when not quite sure what the event name is... can help with debugging when we can output the event name.

        //console.log('1) raise_event sig ' + sig);
        //console.log('raise_event a.l ' + a.l);
        var that = this;

        // Will change the way this works fairly significantly.
        //  First arg is the event name
        //  Second, third etc are the first, second stc arguments.

        // Won't be so much about checking the sig.
        // Maybe a particular one for when it is just a string (no arguments)?

        //  Will get the arguments into an array, and use that for apply.

        // Bound general handlers... get called with the event name as the first param.
        //  Then the other event params as further params.

        if (sig == '[s]') {
            // just raise an event, given with no parameters,
            //  maybe like 'started'.

            var target = this;
            var event_name = a[0];

            //console.log('Data_Object raise_event ' + event_name);

            var bgh = this._bound_general_handler;

            // bound general handler - handles all events???

            //console.log('bgh ' + bgh);

            // not using general handlers for the moment...

            // Will be a convenient way to listen to all events from an object.

            /*

             if (bgh && tof(bgh) == 'array') {
             each(bgh, function(i, v) {
             //console.log('calling bgh handler');

             v.call(target, target, event_name);
             });
             }
             if (that._parents) {
             console.log('Data_Object raise_event that._parents.length ' + that._parents.length);
             }

             */

            //var parent_obj;

            // Maybe don't do that for the moment.
            //  It may be better to not have this automatic as it could slow things down, make things more complex.

            /*

             each(that._parents, function(parent_id, parent_and_position_pair) {
             //parent_obj = parent_and_position_pair[0];
             //parent_obj.raise_event(target, event_name);
             parent_and_position_pair[0].raise_event(target, event_name);
             });
             */
            var be = this._bound_events;

            // is there really a new context?
            //  should contexts have their own IDs?

            //console.log('this.__id ' + this.__id);

            // These can get too many bound events after multiple requests at the moment.
            //  Need to fix this.
            //console.log('be', be);
            //console.log('this', this);
            if (be) {
                // This is attaching events to the same object.
                //  Not sure why, but this needs to be fixed.


                var bei = be[event_name];

                //console.log('bei', bei);
                //console.log('tof bei', tof(bei));
                if (tof(bei) == 'array') {
                    //console.log('1) raise_event bei.length ' + bei.length);
                    var res = [];

                    each(bei, function(i, v) {
                        // I think it knows what the name of the event
                        // is already.

                        // get the target, the event name and the params
                        // all at once?
                        // That seems OK for an event handler.
                        // Could have a simpler handler? But maybe it
                        // hides necessary complexity.
                        // perhaps don't need to put target in twice,
                        // having it as a parameter?
                        // maybe the this context would be enough.

                        // just call it?
                        //  or is there mor abstraction?

                        //v.call(target, target, event_name);
                        //console.log('pre call');
                        res.push(v.call(target));

                        // Perhaps I have sussed out the problem.
                        //  Or some of it?


                    });

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
            for (var c = 1, l = a.l; c < l; c++) {
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

                        each(bei, function(i, v) {
                            // I think it knows what the name of the event
                            // is already.

                            // get the target, the event name and the params
                            // all at once?
                            // That seems OK for an event handler.
                            // Could have a simpler handler? But maybe it
                            // hides necessary complexity.
                            // perhaps don't need to put target in twice,
                            // having it as a parameter?
                            // maybe the this context would be enough.

                            //v.call(target, target, event_name);
                            //console.log('1) additional_args', additional_args);
                            if (v) res.push(v.apply(target, additional_args));
                            // Perhaps I have sussed out the problem.
                            //  Or some of it?


                        });
                        //console.log('Evented_Class raise_event [s] res', res);
                        return res;
                    } else {
                        return false;
                    }


                    //console.log('2) raised the bound events');
                }
                // Or if it's just a function?

            }

        }

        // With a single event handler being raised, it's hard to pass on the result of that event.

        // Click events get raised, but they would have a result.
        //  DO)M events are a bit different to the standard events but work within the same system.


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

                    each(bei, function(i, v) {
                        res.push(v.call(target, a[1]));
                    });

                    //console.log('Evented_Class raise_event [s] res', res);
                    return res;
                }
            }
        }


        // Raise event with multiple arguments?
        //  First argument is the event name. Arguments after that are the arguments for the handler.

        /*
         if (a.l == 2) {
         // a.re()
         // a.re calling the function?
         // or even a.r?
         // recalling the original function could work.
         //console.log('2) a ' + stringify(a));
         //console.log('a[0] ' + a[0]);
         //console.log('this ' + this);

         //console.log('***** a ' + stringify(a));

         return this.raise_event(this, a[0], a[1]);

         } else if (a.l == 3) {

         // binds a function to the event.
         var target = a[0];
         //console.log('target a[0] ' + a[0]);

         //console.log('!!!!!a ' + stringify(a));

         var event_name = a[1];
         var event_params = a[2];



         if (tof(event_params) == 'collection') {
         var stack = new Error().stack
         console.log(stack);

         throw '25) stop';

         }


         var bgh = this._bound_general_handler;


         if (bgh && tof(bgh) == 'array') {

         //console.log('bgh.length ' + bgh.length);
         each(bgh, function(i, v) {
         //console.log('calling bgh handler');

         v.call(target, target, event_name, event_params);
         })
         }


         // the parent Collection will be told about a change for example.
         //  Perhaps there should be two stages of propagation... one so that the parent can do its updates (like index), another so that it
         //  could call the events in a bubbling order.

         // may use a .parent function
         // DataObjects may have more than one parent...
         //  But it does make sense for a data heirachy.
         //  Some things will be expressable as data heirachies.
         //   Particularly objects in documents, collections.
         //  Something could be in a number of collections though.
         //  Will need to deal with these cases, for the moment want to get this server execution path going.

         // It's doing quite a few things in the mean-time, the various resources will all help the system fir together.
         //  It would be very interesting for users of the site to view real-time edits and updates.
         // Perhaps websockets could come in use for showing these things.
         // The site will be supporting quite a lot of content.
         //  Not sure quite how many page views there will be
         //  Likely to go for a fairly small amount of advertising when people are viewing the project documentation.
         // I think there could be quite good pieces of documentation and demos.
         // Discussions too.. there will be discussions about pieces of code that I release.


         // need to deal with parents of Data_Objects... have it so that they are the collection that the object was put inside by default.

         // it will do this for each parent.

         // Will be a lot of event propagation.
         //  It could turn out very useful. Will have a 2-way interaction.
         //   More finely grained than Backbone.


         //var each_parent = function(callback) {
         //
         //}

         // It is up to the item itself to raise the event in its parent(s).


         //each(that._parents, function(parent_id, parent_and_position_pair) {
         //	var parent_obj = parent_and_position_pair[0];
         //	parent_obj.raise_event(target, event_name, event_params);
         //});


         //if (this.has('parent')) {
         //console.log('has parent');

         //	this.get('parent').raise_event(target, event_name, event_params);
         //}



         // _bound_events needs some looking at - currently major performance issues.
         //   1 July 2013 still causing major performance issues... keeps getting bigger when new
         //    pages are served.
         var be = this._bound_events;

         //console.log('this.__id ' + this.__id);

         if (be) {
         var bei = be[event_name];
         if (tof(bei) == 'array') {
         //console.log('2) raise_event bei.length ' + bei.length);
         //console.log('');
         each(bei, function(i, v) {
         // I think it knows what the name of the event
         // is already.

         // get the target, the event name and the params
         // all at once?
         // That seems OK for an event handler.
         // Could have a simpler handler? But maybe it
         // hides necessary complexity.
         // perhaps don't need to put target in twice,
         // having it as a parameter?
         // maybe the this context would be enough.

         //console.log('event_params ' + stringify(event_params));

         //v.call(target, target, event_name, event_params);
         //console.log('tof(event_name) ' + tof(event_name));
         //console.log('tof(event_params) ' + tof(event_params));
         //console.log(



         //v.call(target, target, event_name, event_params);
         //console.log('calling');
         v.call(target, event_params);

         // the bound events...
         //  expect target to be a property of the events.



         });
         }
         }

         }

         */

        return [];
    }),

    // also just raise and trigger?

    'raise': function() {
        return this.raise_event.apply(this, arguments);
    },
    'trigger': function() {
        return this.raise_event.apply(this, arguments);
    },

    // fp this
    //


    // fp losing the context?


    // Could do further tests on fp to see that it's dealing with the context (this) OK?
    //  Maybe fp will only work for anonymous functons?
    //   we could come up with another way of defining them if necessary.
    // I don't think this made the difference - I think fp is working and tested with
    //  context.
    /* ************************* */
    /* *** not used anywhere *** */
    /* ************************* */
    '__add_event_listener': function (eventName, handler) {
        var a = arguments;
        if (a.length == 1) {
            handler = eventName;
            eventName = null;
        }

        if (is_defined(eventName)) {
            this._bound_events = this._bound_events || {};

            // removing from a bound general handler being slow?
            //  perhaps... but we won't have so many of these anyway.
            //  could get id for object and have it within collection.
            //   But not sure about using collections for events... collections use events...?
            if (!this._bound_events[eventName]) this._bound_events[eventName] = [];

            var bei = this._bound_events[eventName];
            if (tof(bei) == 'array') {
                //console.log('add_event_listener bei.length ' + bei.length);
                bei.push(handler);
            };
        }
    },

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
            if (tof(this._bound_general_handler) == 'array') {
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
            if (tof(bei) == 'array') {
                //console.log('this', this);
                //console.log('add_event_listener bei.length ' + bei.length);
                bei.push(fn_listener);
            };
        }

        //console.log('ael finished');



        // an index that keeps track of the positions of the items
        // in it?
        // so functions could get added (no string key, just put
        // there).
        // how to get the order back quickly? Is there a way to
        // avoid the indivual comparisons?
        // could tag the functions with something?

        // Could be done differently with different data structures.
        // Not for now.
        // Could retain a node in a linked list. That way it could
        // be deleted quickly.

        // Quite simple with an array. This code with the type
        // checking leaves the possibility of putting in a different
        // data structure. Linked list could be quite good. Can
        // quickly insert onto the end.
        // Can quickly remove a node (and we'll keep track of it
        // through a closure in this function, this fn will return
        // the remove fn).

        // ll_ensure?

        //ll_ensure(this, '_bound_events')

        //this.ensure()?

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

            var tbei = tof(bei);
            //console.log('tbei', tbei);

            if (tbei == 'array') {
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

module.exports = Evented_Class;