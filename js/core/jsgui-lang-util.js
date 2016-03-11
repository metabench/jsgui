// This is resulting in smaller code in other parts of the framework.
//  This section is getting quite big (again)
//  Still need to make use of the B+ free for ordered indexing.

// Moving some code to jsgui-lang-essentials
//  Will be publishing a 0.4 version of that before so long?
//   Maybe with more explanation?

// It may be worth publishing this, and a discussion forum about it on my own web forum.
//  Perhaps that could come later, but jsgui-lang-essentials may be a good step. Could call it version 0.35.
//   Could have a few examples
//   Would be a useful toolkit I could use while working elsewhere.

//  I think that web site would be lightening fast, and impress people with its speed compared to other web platforms that they are used to
//   (though Facebook is OK)

// This is going to be using data_types as well.
// Will also have a system of requirements.
//  That could mean they need to be both the right data type, as well as having some other specified properties.
/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


define(["./jsgui-lang-essentials", "./jsgui-data-structures", "./data-object", "./collection"],
	function(jsgui, Data_Structures, Data_Object, Collection) {
	*/
    var jsgui = require('./jsgui-lang-essentials');
var Data_Structures = require('./jsgui-data-structures');
var Data_Value = require('./data-value');
var Evented_Class = require('./evented-class');


//console.log('Evented_Class', Evented_Class);


//throw 'stop';
var Data_Object = require('./data-object');
var Collection = require('./collection');
var Data_Grid = require('./data-grid');

	// Will use data structures.
	//  Not sure about using all of them here.

	// A mix-in system of enhancing the data structures may work best.
	//  It does not start with B+ tree, but that gets brought in?

	// However, having B+ as part of it could work quite nicely.


 var j = jsgui;
 var Class = j.Class;
 var each = j.each;
 var is_array = j.is_array;
 var is_dom_node = j.is_dom_node;
 var is_ctrl = j.is_ctrl;
 var extend = j.extend;
 var x_clones = j.x_clones;
 var get_truth_map_from_arr = j.get_truth_map_from_arr;
 var get_map_from_arr = j.get_map_from_arr;
 var arr_like_to_arr = j.arr_like_to_arr;
 var tof = j.tof;
 var atof = j.atof;
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

jsgui.Data_Object = Data_Object;
jsgui.Collection = Collection;

jsgui.Data_Value = Data_Value;
jsgui.Evented_Class = Evented_Class;
jsgui.Data_Grid = Data_Grid;

//var B_Plus_Tree = Data_Structures.B_Plus_Tree;
var Sorted_KVS = Data_Structures.Sorted_KVS;

var vectorify = function(n_fn) {
    // Creates a new polymorphic function around the original one.

    var fn_res = fp(function(a, sig) {
        //console.log('vectorified sig ' + sig);
        if (a.l > 2) {
            var res = a[0];
            for ( var c = 1, l = a.l; c < l; c++) {
                res = fn_res(res, a[c]);
                // console.log('res ' + res);
            }
            return res;
        } else {
            if (sig == '[n,n]') {
                return n_fn(a[0], a[1]);
            } else {
                // will need go through the first array, and the 2nd... but
                // will need to compare them.
                var ats = atof(a);
                //console.log('ats ' + stringify(ats));
                if (ats[0] == 'array') {
                    if (ats[1] == 'number') {
                        var res = [], n = a[1];
                        each(a[0], function(i, v) {
                            res.push(fn_res(v, n));
                        });
                        return res;
                    }
                    if (ats[1] == 'array') {
                        if (ats[0].length != ats[1].length) {
                            throw 'vector array lengths mismatch';
                        } else {
                            var res = [], arr2 = a[1];
                            each(a[0], function(i, v) {
                                res.push(fn_res(v, arr2[i]));
                            });
                            return res;
                        }
                    }
                }
            }
        }
    });
    return fn_res;
};

var n_add = function(n1, n2) {
    return n1 + n2;
}, n_subtract = function(n1, n2) {
    return n1 - n2;
}, n_multiply = function(n1, n2) {
    return n1 * n2;
}, n_divide = function(n1, n2) {
    return n1 / n2;
};

var v_add = vectorify(n_add), v_subtract = vectorify(n_subtract);

// these are not the standard, established vector or matrix operations. They
// can be used for scaling of arrays of vectors.
var v_multiply = vectorify(n_multiply), v_divide = vectorify(n_divide);

var vector_magnitude = function(vector) {
    // may calculate magnitudes of larger dimension vectors too.
    // alert(tof(vector[0]));
    // alert(vector[0] ^ 2);

    var res = Math.sqrt((Math.pow(vector[0], 2)) + (Math.pow(vector[1], 2)));
    return res;

};

var distance_between_points = function(points) {
    var offset = v_subtract(points[1], points[0]);
    //console.log('offset ' + stringify(offset));
    return vector_magnitude(offset);
}

// Does this have a general use?
var remove_sig_from_arr_shell = function(sig) {
    // first and last characters?
    // use regex then regex to extract the middle?

    if (sig[0] == '[' && sig[sig.length - 1] == ']') {
        return sig.substring(1, sig.length - 1);
    }
    return sig;
    // but also do this to the arguments?
};

var execute_on_each_simple = function(items, fn) {
    // currently no arguments provided, there may be in the future / future
    // versions
    var res = [], that = this;
    each(items, function(i, v) {
        res.push(fn.call(that, v)); // function called with item as its only
                                    // parameter.
    });
    return res;
};

var filter_map_by_regex = function(map, regex) {
    var res = {};
    each(map, function(i, v) {
        // if (regex.match(i)) {
        if (i.match(regex)) {
            res[i] = v;
        }
    });
    return res;
}

// May be replaced by a more veristile replacement system, ie input transformation and parsing in schemas.
var npx = arrayify(function(value) {
    // don't think we can use arrayify?

    // good candidate for pf? but how it deals with array trees...
    // could have another one, like sf or spf that is simpler in terms of
    // treating an array in the signature as just one array?

    var res, a = arguments, t = tof(a[0]);

    // fn sigs??? performance?

    if (t == 'string') {
        res = a[0];
    } else if (t == 'number') {
        res = a[0] + 'px';
    }
    return res;
});

var no_px = arrayify(fp(function(a, sig) {
    // no_px - removes the 'px' if it ends with px
    // Generally returns a number.
    // value
    var re = /px$/, res;
    if (sig == '[s]' && re.test(a[0])) {
        res = parseInt(a[0]);
    } else {
        res = a[0];
    }
    ;
    return res;
}));

var arr_ltrb = [ 'left', 'top', 'right', 'bottom' ];

var str_arr_mapify = function(fn) {
    var res = fp(function(a, sig) {
        if (a.l == 1) {
            if (sig == '[s]') {
                var s_pn = a[0].split(' ');
                // console.log('s_pn ' + s_pn.length);

                if (s_pn.length > 1) {
                    return res.call(this, s_pn);
                } else {
                    return fn.call(this, a[0]);
                }
            }

            if (tof(a[0]) == 'array') {
                var res2 = {}, that = this;

                each(a[0], function(i, v) {
                    res2[v] = fn.call(that, v);
                });
                return res2;
            }
        }
    });
    return res;
};

// Lower level functions
// For the moment not exposed

// These two do deal with nested data... but the purpose of the nested
// module is to put the complicated nested stuff there.
// This one looks quite useful and it is limited in what it does, easy to
// understand. Keep here.


var arr_hex_chars = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        'A', 'B', 'C', 'D', 'E', 'F' ];
var dict_hex_to_bin = {
    '0' : 0,
    '1' : 1,
    '2' : 2,
    '3' : 3,
    '4' : 4,
    '5' : 5,
    '6' : 6,
    '7' : 7,
    '8' : 8,
    '9' : 9,
    'A' : 10,
    'B' : 11,
    'C' : 12,
    'D' : 13,
    'E' : 14,
    'F' : 15
};
var str_hex_to_int = function(str_hex) {
    str_hex = str_hex.toUpperCase();
    var i = str_hex.length; // or 10
    var res = 0, exp = 1;
    while (i--) {
        var i_part = dict_hex_to_bin[str_hex.charAt(i)];
        var ip2 = i_part * exp;
        res = res + ip2;
        exp = exp * 16;
        // ...
    }
    ;
    return res;
};
var byte_int_to_str_hex_2 = function(byte_int) {
    var a = Math.floor(byte_int / 16), b = byte_int % 16, sa = arr_hex_chars[a], sb = arr_hex_chars[b], res = sa
            + sb;
    return res;
};
var arr_rgb_to_str_hex_6 = function(arr_rgb) {
    var r = byte_int_to_str_hex_2(arr_rgb[0]);
    var res = r + byte_int_to_str_hex_2(arr_rgb[1])
            + byte_int_to_str_hex_2(arr_rgb[2]);
    return res;
};
var arr_rgb_to_css_hex_6 = function(arr_rgb) {
    // a / b // divide a by b
    // a % b // find the remainder of division of a by b
    return '#' + arr_rgb_to_str_hex_6(arr_rgb);
};
/*
 * Consider the following:
 *
 *
 * var arr_multi_set_item = function(arr, iBegin, iEnd, item_name, value) {
 * var c = iBegin; while (c <= iEnd) { arr[item_name][c] = value; }; return
 * arr; }; var item_cond_set_multi_values = function(target, source,
 * value_names) { each(value_names, function(i, v) { if (typeof source[v] !=
 * 'undefined') { target[v] = source[v]; } }); return target; }; var
 * arr_item_cond_set_multi_values = function(arr_target, arr_source, iMin,
 * iMax, value_names) { for (var c = iMin; c <= iMax; c++) {
 * item_cond_set_multi_values(arr_target[c], arr_source[c], value_names); }; };
 *
 */

// information about data types such as 'int'?
// Perhaps some number data types could be re-implemented, like Decimal.

var input_processors = {};

var output_processors = {};

var validators = {
    'number' : function(value) {
        return tof(value) == 'number';
    }
};

// create data type instance from info

// Code will be better organized using this, but it will still be quite a
// large amount of logic.
// Will make reference to special cases (directives) to control the flow.

// I think the recursion inherant in the data types will be enough for this
// to work (hope so).
// The logic here looks at two layers sometimes, I hope it does not need
// recursion there, but rather that one directive may reference other
// things.
// Those other things could be their own data types that can be referenced.

var referred_object_is_defined = function(object_reference) {
    return is_defined(object_reference[0][object_reference[1]]);
}

// This code is really big now.
// Without WS and logging it will be smaller.

// The HTML module will give it HTML and CSS-like properties it will use for
// its internal representation and translations to and from
// DOM representations.

// The B (or B+?) tree coming up. It's quite a big one....
// There will be some other, simpler classes that use it.

// KSVS, Keys and Values store
// May want something that stores only a single value for a key.
// Likely to want to specify this, in how an index is used.
// Don't want to impose an extra requirement on there being unique values
// for indexed fields.
// That's why more complex data types may fit the data better than dicts.

// Will make a new B+ tree structure.
//  I'll want to know what it does anyway - and I'll see that this one is optimized as well as useful for various operations that would get performed on the tree.

// Quite a few data types will wind up here, in this bit of the library.
//  I don't think they will take up all that much space.

// Could have Data_Structures before util?
//  I don't think they'll be making use of functionality such as Collection or Data_Object. Collection will use these data structures for its index.
//   May be good having them really compatable too?

//  Perhaps there will be a lang 'essentials' set?
//   Before data structures, core tools such as polymorphism, stringify, each, tof
//    That would be a really good toolkit in a few KB of code.
//    I think those things won't change so much.
//     Other parts of lang are developing, but are taking far more code to do.




// Data_Object and Collection are not data structures - they are more than that.
//  They provide a utility, and use the appropriate data structures to do so. They also deal with events and have/enable MVC patterns.
//  That means that data structures won't use them.

// There will be a data structures part of the system that will be used as building blocks for this part.
//  The data structures will use jsgui-lang-essentials.






//var Doubly_Linked_List =


// var BTree = function() {

// BTree is fairly big.
// It can be shrunk a bit further... but not massively
// May find this is an integral part of code to well functioning data
// systems on the client.
// May only be useful when there is a more significant amount of data to
// deal with?

// Makes things possible though.

var set_vals = function(obj, map) {
    each(map, function(i, v) {
        obj[i] = v;
    });
};

// its functions may get proxied.

// OK, so looks like it's working so far.

// indexed collection. keeps track of the index of each item in it.

// Will use this within the typed data I think.

// every item needs an id, need an index too.

// Need to be able to access controls in a collection using a nice interface
// at different levels.

// items in the collection have got index() and id() functions for access to
// the variables.
// index is the position in the collection.

// Think this one is quite specific for when items have ids.

// Should be made much more general, or given specific name.

// Will be phased out.
// Will have Collection.

// That will be a Data_Object.
// It will have an array
// It will have index capabilities.
// Perhaps it could even be able to handle larger datasets with efficient
// indexing capabilities.

// As an abstract class?

// Indexed by position in another index?
// Or ordered by it...

// And that order could change, too.
// have it respond automatically for that...
// Would like to get this to be easy to express.

// collection 1 not particularly ordered
// collection 2 ordered by items' positions in collection 1.
// don't want lots of code specifically for this - but should be possible
// using a fairly general system.
// so each object will have its collection1_index value available.
// Need to think about where to hook up the listeners to listen for a change
// in collection1 so order could be updated in collection 2.
// Probably not for any single item that changes position
// Could maybe be given a list of all items that change position...
// Or it could be an event on the object.
// May re-index that.

// Also, need to look out for property changes on indexed items.
// Need to update the index in that situation.

// Seems like quite a lot of work to get this all going - but I think it
// will be worth it when the indexed collection system is working.
// Will need to refer to the index record when the property value changes.
// Perhaps update all relevant indexes.
// But then don't want to proceed with other things until this is done.

// The system gets somewhat complicated, but this is something which could
// be an integral component that could be reused a lot, if it is done right.

// A collection of collections could be a lot like a database.
// May want more examples about dealing with such collections.

// Don't want to spend a long time making and testing various things that
// have this collection and ordering functionality...
// However need to do what is necessary. Some of them may not seem that
// useful in the abstract - like having something that is indexed by the
// position within another control.
// Indexed by the position in another control or ordered by it? Same thing?
// May require quite a bit behind the scenes to get everything working
// right.
// It won't be a very large amount of code... but it needs to be right.
// Really don't want to make the download too large. May change the b+
// implementation and experiment with it, get a smaller b+ tree size.
// Could perhaps be loaded after lang, as a separate module, but using lang.
// Lang could start with the indexing system set up, but not all the types
// of indexes. Maybe just the dict index?
// Other indexes will then be easier to work on separately.
// But b+ could be so essential to the library working smoothly in the GUI.
// Won't be impossible to make a micro-b+ implementation.
// So could still get by id with the dict index
// Maintaining another collection ordered by the position in another
// collection does seem like a good objective.
// Position in collection = position within the normal array...
// Not the position within some kind of index.

// index_by(other_collection)
// only if items are in the other collection...

// item position in collection... collection is always an array as well.
// could that make things inefficient there?
// moving items around the array, changing the array index of items.
// may not be worth so much indexing with those inherant limitations?


var _data_generators = {
    //'Ordered_String_List' : function() {
    //	// console.log('dg Ordered_String_List');
    //	return new Ordered_String_List();
    //}
}

// This could be useful for a few things, like storing tables in a DB
// schema.
// Maybe quite a few more things.

// Uses private variables.

// Different to sorted string list.
//  Indexed by the string too...



var truth = function(value) {
    return value === true;
}

// will put functions into the jsgui object.

// with the functions listed like this it will be easier to document them.

var extend = jsgui.extend, fp = jsgui.fp, stringify = jsgui.stringify, tof = jsgui.tof;


// Connecting these input processors in this instance to the Enhanced_Data_Object?

// So keep the color declaration here. Outside of HTML?

// color is an indexed array.
//  Does that mean it should be stored as a Data_Value?


extend(jsgui.data_types_info, {

    // Automatically created constructor function from the data types info?

    'color': ['indexed_array', [
        ['red', 'number'],
        ['green', 'number'],
        ['blue', 'number']
    ]],
    'oltrb': ['optional_array', ['left', 'top', 'right', 'bottom']]
});

var create_input_function_from_data_type_info = function (data_type_info) {
    //console.log('create_input_function_from_data_type_info data_type_info ' + stringify(data_type_info));

    if (tof(data_type_info) == 'array') {
        var secondary_instruction = data_type_info[0];
        var arr_items = data_type_info[1];
        //console.log('secondary_instruction ' + secondary_instruction);
        //console.log('tof(arr_items) ' + tof(arr_items));

        if (tof(arr_items) == 'string') {
            // the distance.
            // console.log('arr_items ' + arr_items);


            if (jsgui.data_types_info[secondary_instruction]) {
                // process it with that instruction, but need to have it operating with the data type given here,
                //  'distance'.

                // seems quite hard to do, may be a recursive process.
                //  optional array being the example here.

                // otlrb.

                // call a new procedure for otlrb?
                //  may need to automatically jump through some indirection.
                //   really, want to be layering functional processors.

                if (jsgui.data_types_info[arr_items]) {
                    // process it with that instruction, but need to have it operating with the data type given here,
                    //  'distance'.

                    // seems quite hard to do, may be a recursive process.
                    //  optional array being the example here.

                    // otlrb.

                    // call a new procedure for otlrb?
                    //  may need to automatically jump through some indirection.
                    //   really, want to be layering functional processors.

                    //console.log('processing ' + arr_items + ' according to ' + secondary_instruction);

                    // load up the oltrb item...
                    //  I think we need a reader for that.

                    // A constructor / a function that is an input processor for oltrb.
                    //  Test that, then use it here.


                }
            }
        }

        if (tof(arr_items) == 'array') {
            // process the secondary instruction...
            if (secondary_instruction == 'indexed_array') {

                var res = fp(function (a, sig) {

                    // check the arguments given... do they match what is expected?

                    // or if it is an object, put them into place in the correct position.

                    // data_types_info could have associated maps, attached to the data_types_info.

                    //console.log('input processor for dti ' + stringify(data_type_info));
                    //console.log('sig ' + sig);
                    // with an indexed array, there should be a dti.position_map

                    if (sig == '[[[n,n,n]]]') {
                        res = a[0][0];
                        return res;
                    }

                    // The preprocessor is dealing with these.
                    /*
                    if (sig == '[[s]]') {
                        // likely to best use some regex color matches.
                        //  could have a pre-input?
                        //  specifific formatting for color anyway, could use a preprocessor.

                    }
                    */

                    if (!data_type_info.map_pos) {
                        data_type_info.map_pos = {};

                        each(arr_items, function (i, v) {
                            //console.log('i ' + i);
                            //console.log('v ' + v);
                            data_type_info.map_pos[v[0]] = i;
                        });
                    }

                    if (sig == '[[o]]') {
                        // put the items from that object into an array.

                        var dtimp = data_type_info.map_pos;
                        var o = a[0][0];

                        var res = [];

                        each(o, function (i, v) {
                            var pos = dtimp[i];
                            //console.log('pos ' + pos);
                            //console.log('v ' + v);
                            res[pos] = v;
                        });
                        //console.log('res ' + stringify(res));
                        return res;
                    }

                    // also use regular expression identifiers for parsing from a string?

                    //throw '3) stop';
                    // then use data_type_info.map_pos

                    //console.log('data_type_info.map_pos ' + stringify(data_type_info.map_pos));

                });
                return res;
            }
        }
    }
}

// or just .extend('control');
//  Data_Object('control'); (not a constructor).

//var Control = Data_Object.extend({'data_type': 'control'});
//var Control = Data_Object.extend('control');


// could have an input preprocessor as well.
//  so that generalized functionality gets used too.

// Is really a CSS hex string -> [r, g, b] converter

// color parser...
//  want to parse the input
// color preprocessor_parser

var color_preprocessor_parser = fp(function(a, sig) {
    //console.log('color_preprocessor_parser a ' + stringify(a));
    //console.log('color_preprocessor_parser sig ' + sig);
    if (sig == '[s]') {
        var input = a[0];
        var rx_hex = /(#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2}))/;
        var m = input.match(rx_hex);
        //console.log('m ' + stringify(m));

        if (m) {
            // Could use arrayify or something to make the conversion quicker... will do that in more places, mainly want to get the code working now.

            var r = jsgui.str_hex_to_int(m[2]);
            var g = jsgui.str_hex_to_int(m[3]);
            var b = jsgui.str_hex_to_int(m[4]);

            var res = [r, g, b];
            return res;
        }
    }

})


var color_preprocessor = (function (fn_color_processor) {
    var that = this;
    //throw '!stop';
    var res = fp(function (a, sig) {

        //console.log('color_preprocessor sig ' + sig);

        if (sig == '[[s]]') {
            //var new_input =
            // use regexes to detect / read the string.

            //var rx_hex = /^#?[a-fA-F0-9][a-fA-F0-9][a-fA-F0-9]$/;
            var rx_hex = /(#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2}))/;
            //var rx_hex = /(#(([0-9A-Fa-f]{2}){3}))/;
            //var rx_hex = /(#([0-9A-Fa-f]{2}){3})/;
            var input = a[0][0];

            //var m = rx_hex.match(input);
            var m = input.match(rx_hex);
            //console.log('m ' + stringify(m));

            if (m) {
                // Could use arrayify or something to make the conversion quicker... will do that in more places, mainly want to get the code working now.

                var r = jsgui.str_hex_to_int(m[2]);
                var g = jsgui.str_hex_to_int(m[3]);
                var b = jsgui.str_hex_to_int(m[4]);

                var res = [r, g, b];
                return res;
            }

        } else {
            // call with the same arguments.
            //console.log('calling normal...');
            return fn_color_processor.apply(that, a);

        }
    });
    return res;
});

// In previous modules, it won't keep the same input_processors.
//  Is there a way of retrieving that from the most inner modules?
//test_Color();

// And inputting an indexed array.
//  Will need to accept 2d size inputs.
// Size could possibly be 3d, maybe 1d? A line has a size, which is also its length (though in the world of GUI it could also have
//  a thickness).

// Optional array looks more like a language feature (enhancement).
//  Or even a core language feature?


// There will be different types of optional arrays, will have different input parameters.
jsgui.input_processors['optional_array'] = fp(function (a, sig) {
    // would need to take in objects with the names of the properties as well.
    //  populate a sparse array with them.
    //   will make a very flexible HTML interface.
    //   controls will be able to have their properties changed in a flexible way, and output seamlessly to a wide variety of browsers.

    // the items in the index could be a bit more complicated, but we are going to say they are just strings for the moment.
    //  items_data_type_name...
    //   is the params an array of strings?
    // oa_params, input
    if (a.l == 2) {
        var oa_params = a[0],
            input = a[1];
        if (tof(input) == 'array') {
            // check it is within the right number.
            if (input.length <= oa_params.length) {
                return input;
            }
        } else {
            return input;
        }
    }
    if (a.l == 3) {
        var oa_params = a[0],
            items_data_type_name = a[1],
            input = a[2];
        // now need to get every item in the array or the item to conform to the given type.
        var input_processor_for_items = jsgui.input_processors[items_data_type_name];
        //console.log('input_processor_for_items ' + input_processor_for_items);
        //console.log('tof(input) ' + tof(input));
        if (tof(input) == 'array') {
            // check it is within the right number.
            if (input.length <= oa_params.length) {
                var res = [];
                each(input, function (i, v) {
                    res.push(input_processor_for_items(v));
                });
                return res;
            }
        } else {
            return input_processor_for_items(input);
        }
    }
    //console.log('oa_params ' + stringify(oa_params));
});

jsgui.input_processors['indexed_array'] = fp(function (a, sig) {
    // it may be taking some kind of data type that things need to be applied to.
    // eg 'size': ['indexed_array', ['distance', ['width', 'height']]],
    // would need to take in objects with the names of the properties as well.

    console.log('indexed_array sig', sig);

    if (a.l == 2) {
        var ia_params = a[0],
            input = a[1];
        //console.log('ia_params ' + stringify(ia_params));

        if (tof(input) == 'array') {
            if (input.length <= ia_params.length) {
                return input;
            }
        }
    }
    if (a.l == 3) {
        var ia_params = a[0],
            items_data_type_name = a[1],
            input = a[2];
        var input_processor_for_items = jsgui.input_processors[items_data_type_name];
        if (tof(input) == 'array') {
            // check it is within the right number.
            if (input.length <= ia_params.length) {
                var res = [];
                each(input, function (i, v) {
                    res.push(input_processor_for_items(v));
                });
                return res;
            }
        }
    }
});

jsgui.input_processors['n_units'] = function (str_units, input) {
    // this will change things to have both the number of units and a string with the unit in an array.
    //  will make it easier to do maths on the distances.

    if (tof(input) == 'number') {
        return [input, str_units];
    }
    if (tof(input) == 'string') {
        //var rx_n_units = /^(?:(\d+)(\w+))|(?:(\d*)\.(\d+)(\w+))$/;
        var rx_n_units = /^(\d+)(\w+)$/;
        // then match it, should be multiple parts to the match.

        // Do want to get the various pieces working for the Control system.
        //  Then will be very nice indeed when compacted for a mobile-client.

        var match = input.match(rx_n_units);
        //console.log('match ' + stringify(match));

        if (match) {
            return [parseInt(match[1]), match[2]];
        }

        rx_n_units = /^(\d*\.\d+)(\w+)$/;
        match = input.match(rx_n_units);
        //console.log('match ' + stringify(match));
        if (match) {
            return [parseFloat(match[1]), match[2]];
        }
        //throw('stop');
    }
};
jsgui.map_data_type_data_object_constructors = jsgui.map_data_type_data_object_constructors || {};


var ensure_data_type_data_object_constructor = function (data_type_name) {
    //console.log('');
    //console.log('');
    //console.log('jsgui.map_data_type_data_object_constructors[data_type_name] ' + stringify(jsgui.map_data_type_data_object_constructors[data_type_name]));
    //console.log('');
    //console.log('');

    console.log('ensure_data_type_data_object_constructor data_type_name', data_type_name);
    console.log('!!jsgui.map_data_type_data_object_constructors[data_type_name]', !!jsgui.map_data_type_data_object_constructors[data_type_name]);

    if (!jsgui.map_data_type_data_object_constructors[data_type_name]) {
        //console.log('html module: creating new Data_Object constructor for data_type: ' + data_type_name)
        //throw 'stop';
        // Need to get the variable back through the modules...
        //  Missing global variables?
        //  Move this function somewhere else?
        //  Maybe we could have some storage available in jsgui-lang-essentials through a closure.
        //  That way the code could be sent back... but do we still have different instances running?

        // Could just be different execution contexts... co can't feed back this information about other objects.
        //  But can feed functionality forards.

        // May need to have things more independant.

        //var dti = jsgui.get('dti');
        //console.log('dti ' + dti);
        //throw 'stop';


        // Won't there be some data types that should have a Data_Value?

        // Some constructors, such as size are done using indexed_array.
        //  se it seeems

        // Others, such as color, also use indexed_array but are not currently being represented as Data_value objects
        //  Would help if the field definition said if it should be held as a data_object or data_values.
        //  Data_Values correspond better with simpler JavaScript types. When not using a Collection to hold an Array, a Data_Value would work well.
        //   They are supposed to be more light-weight and still provide evented functionality.





        var dto = jsgui.data_types_info[data_type_name];
       //console.log('dto ' + stringify(dto));
        //console.log()
        //throw 'stop';

        // Currently only using 'color' here.
        //  That should be a Data_Value

        // May need some annotation to say we should use a Data_Object, if necessary.

        // And 'color' works when using a Data_Value.

        // Generally will use Data_Values for fields.
        //  In other cases, they will have JSGUI types specified.



        var dtc;

        var use_data_value = function() {

            // And I'm not sure that a Data_Value has got fields.

            dtc = Data_Value.extend({
                'fields': dto
            })

        };

        var use_data_object = function() {
            dtc = Data_Object.extend({
                'fields': dto
            })

        };

        use_data_value();




        dtc.prototype._data_type_name = data_type_name;
        jsgui.map_data_type_data_object_constructors[data_type_name] = dtc;
    }
    return jsgui.map_data_type_data_object_constructors[data_type_name];
}
jsgui.ensure_data_type_data_object_constructor = ensure_data_type_data_object_constructor;
//console.log('jsgui.input_processors ' + stringify(Object.keys(jsgui.input_processors)));
var dti_color = jsgui.data_types_info['color'];

jsgui.input_processors['color'] = function(input) {


	var res;
	console.log('processing color input: ' + stringify(input));

	var input_sig = get_item_sig(input, 2);
	//console.log('input_sig ' + input_sig);

	//var i;

	if (input_sig == '[s]') {
		//i = input[0];
		res = color_preprocessor_parser(input[0]);
	}

	if (input_sig == '[n,n,n]') {
		//input = input[0];
		//i = input[0];
		//var res = color_preprocessor_parser(input);
		res = input;
	}




	// not sure that using the preprocessor is right...
	//  it returns a function, I think it applies to a function.
	//throw '!!stop';
	console.log('res ' + stringify(res));

    // So, the 'color' property gets set.
    //  Then would need to set the CSS background-color property?
    //   Depening on what type of Control it is.


    console.log('color input_processors output', res);



	return res;
}

//color_preprocessor(create_input_function_from_data_type_info(dti_color));
jsgui.ensure_data_type_data_object_constructor('color');

jsgui.output_processors['color'] = function (jsgui_color) {
    var res = jsgui.arr_rgb_to_css_hex_6(jsgui_color);
    return res;
};

// collection needs a context...
//  can get the context from the first object.

// Grouping not working so well so far...
//  Maybe a less reflective way of making the group function?



var group = function() {

    // Hope this grouping system is not too slow.
    //  May be able to optimize / selectively make the grouping functions.

    var a = arguments;

    if (a.length == 1 && tof(a[0]) == 'array') {
        return group.apply(this, a[0]);
    }

    //var res = new Collection();
    var res;
    for (var c = 0, l = a.length; c < l; c++) {
        var item = a[c];

        if (c == 0) {
            res = new Collection({'context': item._context});

        }
        res.push(item);

    }

    var C = a[0].constructor;
    var p = C.prototype;

    //console.log('C ' + C);
    //console.log('p ' + p);

    var i;

    for (i in p) {

        var tpi = tof(p[i]);
        //console.log('tpi ' + tpi);

        // if tpi is a function, then we can make a version for the collection.

        // need this to remember the function name... maybe with another closure.



        if (tpi == 'function') {
            // make a group version.

            (function(i) {
                //console.log('i ' + i);

                if (i != 'each' && i != 'get' && i != 'add_event_listener') {
                    res[i] = function() {
                        //console.log(i + ' called');
                        //console.log('called');
                        //throw 'stop';

                        // then for each of the items in the collection we call with the same parameters.
                        // But with which context?
                        //  Can we have a group context?

                        // this - will be the collection?

                        // then we need to call the collective function ...
                        //  on each of them?
                        var a = arguments;

                        res.each(function(i2, v) {
                            //console.log('i ' + i);


                            //v[i].apply(res, a);

                            // adding an event listener...

                            // do it differently?
                            //  have it so that the context is the object.
                            //   it needs to be that for the function to work.

                            // can that be changed so we give it another context?
                            //  so that it when the event happens, its triggered context is the group?
                            // group events will be very useful. then applying changes to a group.
                            v[i].apply(v, a);

                        })


                    }
                }
            })(i)



        }

    }

    //throw 'stop';


    // but the group methods...
    //  Collective methods.
    //   Could get the type of the first object.



    return res;

}

var true_vals = function(map) {
    var res = [];
    for (var i in map) {
        if (map[i]) res.push(map[i]);
    }
    return res;
}



var jsgui = extend(jsgui, {
//var jsgui = {
    'vectorify' : vectorify,
    'v_add' : v_add,
    'v_subtract' : v_subtract,
    'v_multiply' : v_multiply,
    'v_divide' : v_divide,
    'vector_magnitude' : vector_magnitude,
    'distance_between_points' : distance_between_points,
    //'arr_trim_undefined' : arr_trim_undefined,
    // 'remove_sig_from_arr_shell': remove_sig_from_arr_shell
    //'ll_set' : ll_set,
    //'ll_get' : ll_get,
    'execute_on_each_simple' : execute_on_each_simple,
    'mapify' : mapify,
    'filter_map_by_regex' : filter_map_by_regex,
    'atof' : atof,
    'npx' : npx,
    'no_px' : no_px,
    'str_arr_mapify' : str_arr_mapify,
    'arr_ltrb' : arr_ltrb,
    'true_vals': true_vals,

    // 'data_type_instance': data_type_instance,

    // 'data_types_info': data_types_info,

    //'input_processors' : input_processors,
    //'output_processors' : output_processors,

    // This is going to do a bit more to do with validation.
    //  Will validate according to types
    //  Will validate according to other specified requirements
    //   Type validation will be fairly easy... but do need to know what types are expected.
    //    Would be different ways of checking types, particularly with a class inheritance structure.
    //    'IS' type check.

    // Want to do checks I like I think is expressed in the HTML section.
    //  This will be integrated with form validation.
    // Will bring that functionality out of 'nested'.

    // Want to specify the requirements so that it can know to check for a property value.

    'validators' : validators,

    //'DataObject' : DataObject,
    //'Data_Object' : DataObject,

    // In some cases the wrapper will add difficulty / slowness.
    //  In others it could be useful for some precise number operations.

    //'KSVS': KSVS,
    //'KSVS_Cursor': KSVS_Cursor,

    //  DataValues could perhaps be addressable within a resource abstraction.

    //'Data_Value': Data_Value,
    //'Collection' : Collection,

    '__data_id_method' : 'lazy',
    // '__data_id_method': 'init',

    // 'DataCollection': DataCollection,

    'str_hex_to_int' : str_hex_to_int,
    'arr_rgb_to_css_hex_6' : arr_rgb_to_css_hex_6,

    // These are likely to be deprecated in favour of having lang handle
    // these internally and exposing add_data_type, which will be mapified.

    /*
     * 'populate_any_maps': populate_any_maps,
     * 'populate_optional_array_pos_maps': populate_optional_array_pos_maps,
     * 'populate_indexed_array_pos_maps': populate_indexed_array_pos_maps
     */
    // 'populate_all_dt_maps': populate_all_dt_maps,
    '_data_generators' : _data_generators,

    'group': group

    //'Ordered_String_List' : Ordered_String_List,

});
//console.log('jsgui.input_processors ' + stringify(jsgui.input_processors));
// var jsgui = {};
// alert('returning jsgui from jsgui-lang');
//return jsgui;
module.exports = jsgui;
//});
