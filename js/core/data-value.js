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

var Evented_Class = require('./evented-class');


var Data_Value = Evented_Class.extend({
    'init': function(spec) {

        this._super();
        // the spec will be the value.
        //  could be the value and its type.

        //console.log('jsgui.__data_id_method ' + jsgui.__data_id_method);
        //throw 'stop';

        // so if the data_id_method is lazy, we get the id through a function.

        // Could take the context as another parameter...
        //  Can make it more flexible in terms of how it gets initialised.
        //  Data_Value(value) makes the most sense.

        if (spec && spec.context) {
            this._context = spec.context;

        }

        if (spec) {
            //console.log('!* spec.value ' + spec.value);
            //console.log('spec ' + stringify(spec));
        }

        if (spec && is_defined(spec.value)) {
            this._ = spec.value;
        }

        /*
        if (jsgui.__data_id_method == 'init') {
            //throw 'stop';
            // and there may be a map in the context.

            if (this._context) {

                // the context no longer keeps a map of the objects.
                //  Will work more on the relationships in a bit.



                //this._context.map_objects[this.__id] = this;
            } else {
                // don't want to be using IDs out of context.

                //throw 'Data_Value needs context';

                // but we'll try this - not setting the ID.
                //  really it needs an ID when it's in a page.
                //  Data_Values should be able to work at other times, such as rendering HTML examples.

                // But maybe it should be able to operate with no context or ID.
                //  It may be a demand of the context that it has an ID.
                //   (maybe not is some contexts though).

                //this.__id = new_data_value_id();



                //map_jsgui_ids[this.__id] = this;


            }
        }
        */

        //this._val = spec;

        this.__type = 'data_value';

        //this._bound_events = {};


        this._relationships = {};
    },
    'get': function() {
        //return this._val;
        return this._;
    },
    'value': function() {
        return this.get();
    },
    'toObject': function() {
        //if (this._.toObject) {
        //	return this._.toObject();
        //} else {
        //	return this._;
        //}
        return this._;

    },
    'set': function(val) {
        //this._val = val;

        // This may also need to make use of input_processors

        var input_processors = jsgui.input_processors;
        var input_processor = input_processors[this.__type_name];

        if (input_processor) {
            val = input_processor(val);
        }

        var old_val = this._;

        this._ = val;
        console.log('val', val);

        this.raise('change', {
            'old': old_val,
            'value': val
        });

        return val;
    },
    'toString': function() {
        //return stringify(this.get());
        // con

        //console.log('this._val ' + stringify(this._val));
        //throw 'stop';

        return this.get();
    },
    // Maybe a particular stringify function?
    'stringify': function() {
        //return stringify(this.get());
        // con

        //console.log('this._val ' + stringify(this._val));
        //throw 'stop';

        var val = this.get();

        //var tval = tof(val);
        var tval = typeof val;
        if (tval == 'string') {
            return '"' + val + '"';
        } else {
            return val;
        }
    },

    'clone': function() {
        var val = this.value();

        var res = new Data_Value({
            'value': val
        });

        //console.log('res', res);
        //throw 'stop';

        return res;
    },


    '_id': function() {
        // gets the id.
        //console.log('this._context ' + this._context);
        //throw 'stop';
        if (this.__id) return this.__id;
        if (this._context) {
            //console.log('this.__type ' + this.__type);
            //throw 'stop';
            this.__id = this._context.new_id(this.__type_name || this.__type);

        } else {
            if (!is_defined(this.__id)) {
                throw 'DataValue should have context';
                this.__id = new_data_value_id();
            }
        }


        return this.__id;

    },
    'parent': fp(function(a, sig) {
        var obj, index;
        //console.log('parent sig', sig);


        if (a.l == 0) {
            return this._parent;
        }
        if (a.l == 1) {
            obj = a[0];

            if (!this._context && obj._context) {
                this._context = obj._context;
            }

            // IDs will only work within the context.



            // Another way of expressing this?

            // Can have a single parent, or multiple parents.
            //  May want something to be the only parent. Could have a different mode for multiple parents.

            //  this._parent = obj?


            //console.log('parent obj_id ' + obj_id);
            //throw 'stop'
            //console.log('obj ' + stringify(obj));
            // should maybe rename or subdivide _relationships.
            //  it will also be useful for databases.
            //  however, would need to work with the constraint system.
            //   likely that they would be syncronised through code.

            //var relate_by_id = function () {
            //    var obj_id = obj._id();
            //    this._relationships[obj_id] = true;
            //}

            //var relate_by_ref = function () {
            //    this._parent = obj;
            //}
            //relate_by_ref();

            var relate_by_id = function (that) {
                var obj_id = obj._id();
                that._relationships[obj_id] = true;
            }

            var relate_by_ref = function (that) {
                that._parent = obj;
            }
            relate_by_ref(this);
        }
        if (a.l == 2) {
            obj = a[0];
            index = a[1];

            if (!this._context && obj._context) {
                this._context = obj._context;
            }

            this._parent = obj;
            this._index = index;
        }

        if (is_defined(index)) {
            // I think we just set the __index property.
            //  I think a __parent property and a __index property would do the job here.
            //  Suits DOM heirachy.
            // A __relationships property could make sense for wider things, however, it would be easy (for the moment?)
            // to just have .__parent and .__index
            //


            // Not sure all Data_Objects will need contexts.
            //  It's mainly useful for Controls so far




        } else {
            // get the object's id...

            // setting the parent... the parent may have a context.





        }
    })
});

module.exports = Data_Value;
