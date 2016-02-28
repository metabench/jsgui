
/* * @module core/collection */

/*
 if (typeof define !== 'function') {
 var define = require('amdefine')(module);
 }

 define(["./jsgui-lang-essentials", "./jsgui-data-structures", "./data-object", "./data-object-fields-collection", "./constraint",
 "./collection-index"],
 */

var jsgui = require('./jsgui-lang-essentials');
var Data_Structures = require('./jsgui-data-structures');
var Data_Value = require('./data-value');
var Data_Object = require('./data-object');
var Data_Object_Field_Collection = require('./data-object-fields-collection');
var Constraint = require('./constraint');
var Collection_Index = require('./collection-index');
//

var Evented_Class = require('./evented-class');

//function(jsgui, Data_Structures, Data_Object, Data_Object_Field_Collection, Constraint, Collection_Index) {

// Collection... use sligntly more than essentials?
var Collection_Index_System = Collection_Index.System;
var Sorted_Collection_Index = Collection_Index.Sorted;

var j = jsgui;
var Class = j.Class;
var each = j.each;
var eac = j.eac;
var is_array = j.is_array;
var is_dom_node = j.is_dom_node;
var is_ctrl = j.is_ctrl;
var extend = j.extend;
var clone = j.clone;
var x_clones = j.x_clones;
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
var iterate_ancestor_classes = j.iterate_ancestor_classes;
var is_constructor_fn = j.is_constructor_fn;

var is_arr_of_strs = j.is_arr_of_strs;
var is_arr_of_arrs = j.is_arr_of_arrs;

var dobj = Data_Object.dobj;

// Basically 2D matrix storage.

// Need to be able to get, set add, remove rows, columns.
//  Logically needs to be similar to a spreadsheet.

// Difficulties dealing with internal data structures?
//  How to hold something in a simple format, and / or have it performant?

// Should operate in different modes?
//  And spots which mode to use in some cases?

// Should use general purpose data structure that is fit for various things.
//  A key-value store for each and every row and column would be useful.
//   So it would iterate over all of the values there when it displays data.
//    When it's not displaying the data within a view it does not need to reference it.



// Will need to determine the range of the data as it loads.








var Data_Grid = Evented_Class.extend({

    'fields': {
        'range': Array
    },


    'init': function(spec, arr_values) {
        //console.log('Collection init');
        //console.log('spec ' + stringify(spec))
        spec = spec || {};
        // Probably should act differently for an abstract collection.
        this.__type = 'data_grid';
        this.__data_grid = true;
        var tspec = tof(spec);


        if (spec.abstract === true) {

            if (tspec === 'function') {
                this.constraint(spec);
            }
        } else {
            //this._relationships = this._relationships || {};
            //this._arr_idx = 0;

            // Should have a KVS to store each row and cell.
            //  Could have coordinates / num,num letnum

            // Need different ways of addressing it.
            //  Purely numeric for both X and Y sounds easiest.

            // So just make a string key out of the coordinates.



            var kvs = this.kvs = {};



            //this._arr = [];


            var spec = spec || {};

            if (tspec === 'array') {
                spec = {
                    'load_array': spec
                };
            } else {
                if (tspec === 'function') {
                    if (spec.abstract === true) {
                        //throw 'Collection with abstract spec function';

                        this._abstract = true;
                    } else {

                        // Columns x can be given as a letter (like a spreadsheet)



                    }

                }
            }

            if (is_defined(spec.data)) {
                spec.load_array = spec.load_array || spec.data;
            }
            if (arr_values) {
                //console.log('load arr_values ------------');
                spec.load_array = arr_values;
            }

            if (spec.load_array) {
                this.load_array(spec.load_array);
            }


            if (jsgui.__data_id_method == 'init') {
                // but maybe there will always be a context. May save download size on client too.
                if (this._context) {
                    this.__id = this._context.new_id(this.__type_name || this.__type);
                    this._context.map_objects[this.__id] = this;
                } else {
                    // don't think we want a whole bunch of objects mapped like this....
                    //  IDs will be very useful when they are controls... but maybe not always needed.

                    //this.__id = new_collection_id();
                    //map_jsgui_ids[this.__id] = this;
                }

            }

            if (!this.__type) {


            }
        }


        this._super(spec);
    },

    // maybe use fp, and otherwise apply with the same params and context.

    /**
     * @func
     * @param value
     */

    // x, y, value
    // [x, y], value

    // set it with a single object
    //  set a row?
    //  set a column?
    //  set a cell
    //  set a block of cells from a certain area


    'str_key': function(x, y) {
        return x + ',' + y;

    },

    'load_array': function(p_arr) {
        //console.log('load_array', p_arr);

        // That array should contain arrays
        // Then each item in there is a call.

        // Alternatively just having a list of columns...

        // Would be an interesting and more complex alternative to make this using Collection rather than just array.
        //  Likely to be slower too.

        //var arr = this._arr;

        var kvs = this.kvs;

        // array should be empty to start with...?

        var c, l = p_arr.length;




        // Do have the rows and columns zero indexed internally.

        var i_column, i_row;


        var inner_arr;

        var l_inner, key, val;

        var max_x = 0, max_y = l - 1;

        /*


        */

        var t_inner;


        for (i_row = 0; i_row < l; i_row++) {

            inner_arr = p_arr[i_row];

            t_inner = tof(inner_arr);

            //console.log('t_inner', t_inner);

            if (t_inner === 'array') {
                l_inner = inner_arr.length;

                for (i_column = 0; i_column < l_inner; i_column++) {
                    //





                    if (l_inner - 1 > max_x) max_x = l_inner - 1;


                    key = this.str_key(i_column, i_row);

                    //console.log('inner_arr', inner_arr);
                    val = inner_arr[i_column];

                    //console.log('key', key);
                    //console.log('val', val);

                    kvs[key] = val;



                    //for (i_row = 0; r_row < )



                }
            } else {
                key = this.str_key(0, i_row);
                val = inner_arr;
                //console.log('val', val);
                kvs[key] = val;
            }






        }

        //console.log('max_x', max_x);
        //console.log('max_y', max_y);

        // Could set a range field that gets sent to the client.



        this.max_x = max_x;
        this.max_y = max_y;

        //this.set('range', [max_x, max_y]);










    },

    'set': function(a, sig) {


    },

    /**
     * @func
     */
    'clear': function() {
        //this._arr_idx = 0;
        this._arr = [];

        this.trigger('change', {
            'type': 'clear'
        })
    },

    /**
     * @func
     */
    'stringify': function() {
        var res = [];

        // Probably only list the cells that have data
        //  Just an array of cells, [key, value]



        if (this._abstract) {
            // then we can hopefully get the datatype name

            // if it's abstract we detect it, otherwise it should be in there.



        } else {

        }
        return res.join('');
    },

    /**
     * @func
     */
    'toString': function() {
        return stringify(this._arr);

    },

    /**
     * @func
     */
    'toObject': function() {
        var res = [];
        this.each(function(i, v) {
            res.push(v.toObject());
        });
        return res;
    },




    /**
     * @func
     * @param ...
     */
    'find': fp(function(a, sig) {



    }),
    // get seems like the way to get unique values.


    /**
     * @func
     * @param ...
     */


    // x, y
    // [x, y]

    'get' : fp(function(a, sig, _super) {

        // integer... return the item from the collection.
        //console.log('collection get sig ' + sig);

        if (sig === '[n,n]') {
            var x = a[0], y = a[1];

            return this.kvs[this.str_key(x, y)];

        }

        if (sig == '[n]' || sig == '[i]') {
            return this._arr[a[0]];
        }

        // getting by it's unique index?
        //  this may again refer to getting a property.

        if (sig == '[s]') {

            /*


            var ix_sys = this.index_system;
            var res;
            if (ix_sys) {
                //console.log('ix_sys', ix_sys);
                var pui = ix_sys._primary_unique_index;
                //console.log(pui);
                res = pui.get(a[0])[0];
            }

            if (res) {
                return res;
            }

            return Data_Object.prototype.get.apply(this, a);
            */


            if (a[0] === 'range') {

                return [this.max_x, this.max_y];


            }

        }
        // may take multiple params, specifying the fields in the
        // unique index.

    })


});


module.exports = Data_Grid;

//return Collection;
//});
