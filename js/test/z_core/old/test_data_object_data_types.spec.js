
describe("z_core /test_data_object_data_types.spec.js ", function() {

    var jsgui;
    var assert;
    var Data_Structures;
    var test_utils;

    var Collection;
    var stringify;
    var Data_Object;
    var tof;
    var mapify;
    var Sorted_KVS;
    var each;
    var extend;
    var fp;

    before(function () {
        jsgui = require('../../../core/jsgui-lang-util');
        assert = require('assert');
        Data_Structures = require('../../../core/jsgui-data-structures');
        test_utils = require('../../test-utils/test-utils');
        //
        Collection = jsgui.Collection;
        stringify = jsgui.stringify;
        Data_Object = jsgui.Data_Object;
        tof = jsgui.tof;
        mapify = jsgui.mapify;
        Sorted_KVS = Data_Structures.Sorted_KVS;
        each = jsgui.each;
        extend = jsgui.extend;
        fp = jsgui.fp;
        //
        prepare();
    });


    //#region prepare

    // create the input function...

    // need a way of creating input functions from the object info.

    // particular functions for dealing with particular things?
    // will likely be moved.
    var create_input_function_from_data_type_info = function (data_type_info) {
        //console.log('create_input_function_from_data_type_info data_type_info ' + stringify(data_type_info));

        if (tof(data_type_info) == 'array') {
            var secondary_instruction = data_type_info[0];
            var arr_items = data_type_info[1];
            //console.log('secondary_instruction ' + secondary_instruction);
            //console.log('tof(arr_items) ' + tof(arr_items));

            if (tof(arr_items) == 'string') {
                // the distance.
                //console.log('arr_items ' + arr_items);


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

    function prepare() {

        jsgui.data_types_info = jsgui.data_types_info || {};

        //console.log('jsgui.data_types_info ' + jsgui.data_types_info);
        assert.equal(jsgui.data_types_info.toString(), '[object Object]');

        extend(jsgui.data_types_info, {

            // color rgba?
            // 'number' may prove to be a native type.
            // color may be native - it breaks something down from a hash value code.
            'color': ['indexed_array', [['red', 'number'], ['green', 'number'], ['blue', 'number']]],
            //  have input processors here? or another section?

            // and , ['alpha', 'number']


            // optional_array - can optionally have an array, 
            // oltrb will be used when specifying a variety of points.
            //  may extend it so that it can be [left and right, top and bottom] with 2 items.
            //  specified different to CSS, I prefer it that way.
            //  May have swapable external and internal representations.

            'oltrb': ['optional_array', ['left', 'top', 'right', 'bottom']],

            // and may fit custom ones in - maybe that pass regex
            'border_style': ['any', ['solid', 'dotted', 'dashed']],

            // may need to allow for auto in this.
            'distance': ['n_units', 'px'],

            'margin_distance': [],

            // should maybe put a directive here.
            //  indexed_array
            'single_border': ['indexed_array', [['width', 'distance'], ['style', 'border_style'], ['color', 'color']]],

            // looks up a data type which has been defined in the data_types_info.
            'border': ['oltrb', 'single_border'],

            'margin': ['oltrb', 'distance'],
            // allowing 'auto'? seems important.
            // a distance or 'auto'.


            //

            //'size': ['indexed_array', [['width', 'distance'], ['height', 'distance']]],
            'size': ['indexed_array', ['distance', ['width', 'height']]],

            // index auto-numbering so that each item has a unique integer.
            //  but auto-incrementing within container.
            /// maybe container_int_sequence?
            // int_seq_in_container
            // index_in_container.

            'control_collection': ['DataCollection', 'control'],

            'dom_attributes': {
                'class': 'Ordered_String_List'
            },

            // index may get automatically assigned?
            //  or here, say it is just an int.
            //  id is a string.
            //  may be easier that way.
            // code will be used that hooks into it.
            //  but an override?
            // do want automatic generation.
            //  generation of these items may be a bit tricky.
            //  but need to hook into it somewhere.

            // could have generation or get functions.

            // the new data types system is really changing the mechanics within this. More declarative definition in HTML, which is good.
            //  Needs quite a complex engine to support it.

            'control_dom': {
                'node': 'object',
                'attributes': 'dom_attributes',

                // though could say it is one of a bunch of valid tag names.
                //  That could also help with an IDE.

                'tagName': 'string'

                // and info about the dom atributes
                //  they all get handled as strings (though could be validated, connected to info about html, useful for IDE).
                // but the .class dom attribute is a special case. dealt with as a Ordered_String_List
                //  have the code already. need to make it a type within this system.



            },

            //  so lots of the Core functionality will be handled through the data types system.
            //  not in the Core prototype.

            'control': {
                'style': 'style',
                // int needs to be handled at a lower level in some places.
                //  Maybe it could have its own data_type instance. (a limited one?)

                'index': 'int',

                // id being something that can be automatically generated.
                //'id': 'string',
                //  The control may need to generate an id upon get if it does not have one already.
                // auto-gen string, using a function that is given the control.

                'id': 'context_id',

                // or something where there is a getter.
                //  I think it could look for the getter function for context_id, and use it where appropriate.

                // no longer has a collection of controls inside.
                //  it has a collection of content items
                //  Ordered collection... the order is very important.
                //  

                // Likely to define this using a Collection, with the Control type checking.

                'controls': 'control_collection',


                // and define its dom and dom attributes here.
                // still things get complex but the complexity is more generalised and moved to lang.

                'dom': 'control_dom', // TODO will change this, and test the change

                // control could check to see if there is a generator for this.

                // 'id': 'context_class_name_id'? 'context_id'
                // 'context_id' means that the Page Context gives it an id? it uses the class_name to get the id as well.
                //  It will do that when trying to get the id and it can't find it.



                'class_name': 'string'

                // have a way of managing a collection of controls through this.

            },

            'style': {
                // an object declaration, not array. can have various things inside
                //'border': ['oltrb', 'single_border'],
                'border': 'border',
                'margin': 'margin',
                // when dealing with 'any': there may need to be a map that says if a value is contained.
                //  could even store these maps in a tree. would use something like 'ensure'

                'cursor': ['any', ['auto', 'crosshair', 'default', 'e-resize', 'help', 'move', 'n-resize', 'ne-resize', 'nw-resize', 'pointer', 'progress', 's-resize', 'se-resize', 'sw-resize', 'text', 'w-resize', 'wait', 'inherit']]
            }
        });

        // or just .extend('control');
        //  Data_Object('control'); (not a constructor).

        //var Control = Data_Object.extend({'data_type': 'control'});
        //var Control = Data_Object.extend('control');


        // could have an input preprocessor as well.
        //  so that generalized functionality gets used too.

        // Is really a CSS hex string -> [r, g, b] converter

        var color_preprocessor = (function (fn_color_processor) {
            var that = this;
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

        //test_Color();

        // And inputting an indexed array.
        //  Will need to accept 2d size inputs.
        // Size could possibly be 3d, maybe 1d? A line has a size, which is also its length (though in the world of GUI it could also have
        //  a thickness).


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
                var oa_params = a[0], input = a[1];

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
                var oa_params = a[0], items_data_type_name = a[1], input = a[2];

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
                        })

                        return res;

                    }

                } else {
                    return input_processor_for_items(input);
                }

            }

            console.log('oa_params ' + stringify(oa_params));


        })

        jsgui.input_processors['indexed_array'] = fp(function (a, sig) {
            // it may be taking some kind of data type that things need to be applied to.

            // eg 'size': ['indexed_array', ['distance', ['width', 'height']]],

            // would need to take in objects with the names of the properties as well.

            if (a.l == 2) {
                var ia_params = a[0], input = a[1];
                //console.log('ia_params ' + stringify(ia_params));

                if (tof(input) == 'array') {
                    if (input.length <= ia_params.length) {
                        return input;
                    }
                }

            }
            if (a.l == 3) {
                var ia_params = a[0], items_data_type_name = a[1], input = a[2];
                var input_processor_for_items = jsgui.input_processors[items_data_type_name];
                if (tof(input) == 'array') {
                    // check it is within the right number.

                    if (input.length <= ia_params.length) {
                        var res = [];
                        each(input, function (i, v) {
                            res.push(input_processor_for_items(v));
                        })

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


                throw ('stop');
            }

        }

        // also a processor for distance?
        //  a curried function for n_units basically?

        jsgui.input_processors['distance'] = function (input) {
            // use the n_units processor, but with 'px'
            return jsgui.input_processors['n_units']('px', input);
        }


        // not sure about using oltrb right now. Could compress by having a single arr_ltrb variable.
        jsgui.input_processors['margin'] = function (input) {
            return jsgui.input_processors['optional_array'](['left', 'top', 'right', 'bottom'], 'distance', input);
        }

        jsgui.input_processors['size'] = function (input) {
            // use the n_units processor, but with 'px'
            return jsgui.input_processors['indexed_array'](['width', 'height'], 'distance', input);
        }

        var dti_color = jsgui.data_types_info['color'];
        jsgui.input_processors['color'] = color_preprocessor(create_input_function_from_data_type_info(dti_color));
        //console.log("jsgui.input_processors['color'] " + jsgui.input_processors['color']);

        // just a string in the constructor - looks fine for the type.
        //  likely to be using some namespaced type system eventually, but this is my namespace for the moment.

        // and output the color to HTML.

        // and may have the various output processors for margin (oltrbs?) and other things, outputting to HTML.
        //  Some of them may output to other shim controls, or similar.
        /// Will eventually output to HTML.



        jsgui.output_processors['color'] = function (jsgui_color) {
            var res = jsgui.arr_rgb_to_css_hex_6(jsgui_color);
            return res;
        }

    }

    //#endregion


	
	// -----------------------------------------------------
	//	test_Color
	// -----------------------------------------------------
			
    it("test_Color", function () {

        var Color = Data_Object.extend('color');
        // Data_Object extend consults the jsgui.data_types_info, gets indexed_array definition as an array.



        // Can produce Data_Object constructors for types that have been defined... seems like it could be a part of the Data_Object layer.


        // nice if both are legal.
        //var red = new Color([255, 0, 0]);

        //console.log('red.get() ' + red.get());
        // Will get onto doing the full CSS style rules.
        //  May need to change them a bit, make them capable of different units.
        //   and say what the units are.

        // the oltrb system will come in handy.



        //assert.throws(function () { new Color({ 'red': 255, 'green': 0, 'blue': 122 }); }, /not yet implemented/);

        // --------------------------------------------------------------------------------------------
        // !!! it does not use the input_processors and output_processors from jsgui-lang-util.js module,
        // but use the processors from this file instead
        // --------------------------------------------------------------------------------------------

        var red = null;
        //
        red = new Color({ 'red': 255, 'green': 0, 'blue': 122 });
        assert.equal(red.get(), "#NaN");

        // also use regular expression identifiers for parsing from a string?

        red = new Color('#FF0000');
        assert.equal(red.get(), "#NaN");
        //
        red = new Color('#ff0000');
        assert.equal(red.get(), "#NaN");
        //
        red = new Color('FF0000');
        assert.equal(red.get(), "#NaN");
        //
        red = new Color('ff0000');
        assert.equal(red.get(), "#NaN");
        //
        //

        // then some of the other properties that get used in HTML will get built into the system.



        // is that always how these constructors will work?
        //  not giving it a spec object, giving it an array.

        // The data_type very much defines how the constructor behaves.
        //  It essentially causes the value to be set if there is a data_type.

        /*
        var red = new Color({
            'red': 255,
            'green': 0,
            'blue': 0
        });
        */
        //var red = new Color(255, 0, 0);

    });
					
	// -----------------------------------------------------
	//	test_optional_array
	// -----------------------------------------------------
			
    it("test_optional_array", function () {

        // could take (optional) data type name for the items.


        //console.log('test_optional_array');

        var val = jsgui.input_processors['optional_array'](['left', 'top', 'right', 'bottom'], 12);
        //console.log('val ' + val);
        assert.equal(val, 12);

        //var dti_optional_array = jsgui.data_types_info['optional_array'];
        //jsgui.input_processors['optional_array'] = (create_input_function_from_data_type_info(dti_optional_array));

    });
					
	// -----------------------------------------------------
	//	test_distance
	// -----------------------------------------------------
			
    it("test_distance", function () {

        //console.log('test_distance');

        //var val = jsgui.input_processors['n_units']('px', 12);

        //var val = jsgui.input_processors['n_units']('px', '12.5pt');#

        var val = jsgui.input_processors['distance']('12.5pt');

        //var val = jsgui.input_processors['n_units']('px', '12pt');
        //console.log('val ' + val);
        assert.equal(val, "12.5,pt");

    });
					
	// -----------------------------------------------------
	//	test_optional_array_distance
	// -----------------------------------------------------
			
    it("test_optional_array_distance", function () {

        //console.log('test_optional_array_distance');

        //var val = jsgui.input_processors['optional_array'](['left', 'top', 'right', 'bottom'], 12);
        //var val = jsgui.input_processors['optional_array'](['left', 'top', 'right', 'bottom'], 'distance', 12);
        //var val = jsgui.input_processors['optional_array'](['left', 'top', 'right', 'bottom'], 'distance', 12);
        var val = jsgui.input_processors['optional_array'](['left', 'top', 'right', 'bottom'], 'distance', [12, 10, 3, 12]);


        //console.log('val ' + stringify(val));
        assert.equal(stringify(val), '[[12, "px"], [10, "px"], [3, "px"], [12, "px"]]');

        //var dti_optional_array = jsgui.data_types_info['optional_array'];
        //jsgui.input_processors['optional_array'] = (create_input_function_from_data_type_info(dti_optional_array));

    });
					
	// -----------------------------------------------------
	//	test_indexed_array
	// -----------------------------------------------------
			
    it("test_indexed_array", function () {

        // This is an important thing to test.
        //  Also, need to make sure the API is right.
        //   It may need to maintain the index... it should be able to do that by referring back to
        //    the object.
        // Once indexed_array is working right as a data type, we'll be able to implement colors,
        //  and they will use the indexed_array for r,g,b
        // Need to be clear about what the API will do.
        //  A bunch of processors for different input?
        //   And one of them processes indexed arrays?

        // Need to be sure we have a convenient syntax, both for input processors, output processors,
        //  and indexed arrays

        // Need to be sure about how the indexed_array api will work.
        //  want to provide the index items as an array.
        //   but then it will translate from a string key to a number.

        // Can define a field as an indexed array.

        // 255, 255, 255
        //  so these are defined in terms of red, green, blue.

        // indexed_array may be more of a keyword in some places.
        //  Maybe I can just get on with using this to generate HTML.

        // need to use this to parse color values.


        // With Color having been defined in terms of indexed_array

        // Want to use this for a server for the moment.
        //  May make that file manager application / component.





        //var col = new Color(255, 255, 255);


        var val = jsgui.input_processors['indexed_array'](['width', 'height'], [12, 16]);
        // then will do that with distance.

        //console.log('val ' + stringify(val));
        assert.equal(stringify(val), '[12, 16]')


    });
					
	// -----------------------------------------------------
	//	test_indexed_array_distance
	// -----------------------------------------------------
			
    it("test_indexed_array_distance", function () {

        var val = jsgui.input_processors['indexed_array'](['width', 'height'], 'distance', [12, 16]);
        // then will do that with distance.

        //console.log('val ' + stringify(val));
        assert.equal(stringify(val), '[[12, "px"], [16, "px"]]');
    });
					
	// -----------------------------------------------------
	//	test_size
	// -----------------------------------------------------
			
    it("test_size", function () {

        // then use that to define a 'size'.

        var val = jsgui.input_processors['size']([12, 16]);
        // then will do that with distance.

        //console.log('val ' + stringify(val));
        assert.equal(stringify(val), '[[12, "px"], [16, "px"]]');


    });
					
	// -----------------------------------------------------
	//	test_oltrb
	// -----------------------------------------------------
			
    it("test_oltrb", function () {

        var dti_oltrb = jsgui.data_types_info['oltrb'];
        jsgui.input_processors['oltrb'] = (create_input_function_from_data_type_info(dti_oltrb));
        assert.equal(jsgui.input_processors['oltrb'], undefined);  // !!!

    });
					
	// -----------------------------------------------------
	//	test_Margin
	// -----------------------------------------------------
			
    it("test_Margin", function () {

        //var dti_margin = jsgui.data_types_info['margin'];


        //jsgui.input_processors['margin'] = (create_input_function_from_data_type_info(dti_margin));
        // why not create the margin input function myself.
        //  may then come up with better shortcuts to it.


        //console.log("jsgui.input_processors['margin'] " + jsgui.input_processors['margin']);

        var val = jsgui.input_processors['margin'](12);
        //console.log('val ' + stringify(val));
        assert.equal(stringify(val), '[12, "px"]');

        //var Margin = Data_Object.extend('margin');

        // The rules with oltrb input may get fairly complicated.
        //  They need to be programmed, and tested, in isolation from the HTML Control system that uses them.

        // Will take some more time in order to test the controls themselves...
        //  These controls need to contain a collection of controls inside.
        //  They will pretty much only have controls inside.
        //  Maybe they should have 'contents' which could possibly inclide strings, numbers or other content that is not a control.
        //  Maybe is a Data_Object.
        //   Just some HTML as a string, or some EJS or Jade possibly.


        //var margin = new Margin(12);
        //var margin = new Margin(16, 12, 8, 4);

        //var left_margin = new Margin('left', 12);
        //var left_margin = new Margin('left', '12px');
        //var left_margin = new Margin('left', '12');
        //var left_margin = new Margin({'left': '12px'});


        // and output the vargin value...

        //console.log('margin._ ' + stringify(margin._));


    });
					
});

	
	// Need to test these on Data_Objects, Controls in particular.
	//  This test set will contain code that is used to enable controls to work, and will deal a lot with HTML processing.
	
	
	
	// Can we build a Control Data_Object here?
	//  I want one that makes use of the Data_Object data functionality, so that it does not take so much coding.
	// The control will have a collection of internal controls that is easily defined.
	
	// The internal controls 
	
	
	
	
	// Would also need to be setting the size at some point...
	
