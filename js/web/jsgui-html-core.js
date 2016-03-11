
var jsgui = require('../core/jsgui-lang-enh');
//This function is called when scripts/helper/util.js is loaded.

// HTML will benefit from a big tidy-up.
//  HTML core.
//   Then various enhancements.
//   Page_Context being a major feature.
//    It ties everything together.
//     So as well as an annoyance with controls requiring it, it seems useful.
//      Maybe make it so that controls default to that Page_Context.


var stringify = jsgui.stringify,
    fp = jsgui.fp,
    tof = jsgui.tof,
    extend = jsgui.extend,
    is_defined = jsgui.is_defined,
    str_arr_mapify = jsgui.str_arr_mapify;
var clone = jsgui.clone,
    each = jsgui.eac,
    data_type_instance = jsgui.data_type_instance;

var str_hex_to_int = jsgui.str_hex_to_int,
    hex_rgb_6_match = jsgui.hex_rgb_6_match,
    arr_rgb_to_css_hex_6 = jsgui.arr_rgb_to_css_hex_6;

var Data_Value = jsgui.Data_Value,
    Data_Object = jsgui.Data_Object,
    Collection = jsgui.Collection;

var Class = jsgui.Class;

var ensure_data_type_data_object_constructor = jsgui.ensure_data_type_data_object_constructor;

var Enhanced_Data_Object = jsgui.Enhanced_Data_Object;

// Dealing with fields of a specified type...
//  Could involve automatic invokation of the input and output processors


var map_data_type_data_object_constructors = jsgui.map_data_type_data_object_constructors;
map_data_type_data_object_constructors['size'] = Data_Value;


extend(jsgui.data_types_info, {
    'border_style': ['any', ['solid', 'dotted', 'dashed']],
    'distance': ['n_units', 'px'],
    'single_border': ['indexed_array', [
        ['width', 'distance'],
        ['style', 'border_style'],
        ['color', 'color']
    ]],
    'border': ['oltrb', 'single_border'],
    'margin': ['oltrb', 'distance'],
    'size': ['indexed_array', ['distance', ['width', 'height']]],

    // an indexed array for red, green, blue?

    // want to say that rgb are char/byte/UInt8 values

    // Color should already be defined.

    //'color': ['indexed_array', ['uint8', ['r', 'g', 'b']]],




    //'color': ['indexed_array', ],

    'control_collection': ['DataCollection', 'control'],

    // Defining the types that things will get automatically created as.
    'dom_attributes': 'ordered_string_list',

    //'dom_attributes': {
        //'class': 'Ordered_String_List'
    //    'class': 'ordered_string_list'

    //},
    // these are its fields.
    //  should be able to build a control_dom constructor function.
    'control_dom': {
        'node': 'object',
        'attributes': 'dom_attributes',
        'tagName': 'string'
    },
    'control': {

        // Another type of style inside here?
        'style': 'style',
        // that may be automatically done from its relationship to its parent.
        //'index': 'int',
        // It maybe has an ID anyway as a jsgui Data_Object.
        //  But I think this signifies it? Not sure.
        'id': 'context_id',
        //'controls': 'control_collection',
        // content collection.
        'dom': 'control_dom',
        'class_name': 'string'
        // css_class in the dom attributes. style is inline style-like thing.
        //  style will also be used for building and modifying actual css files or setups.

    },
    'style': {
        // an object declaration, not array. can have various things inside
        //'border': ['oltrb', 'single_border'],
        // top, left etc

        // Want CSS to work by default, but will have some overrides / parsing / reinterpretation.



        'border': 'border',
        'margin': 'margin',
        // when dealing with 'any': there may need to be a map that says if a value is contained.
        //  could even store these maps in a tree. would use something like 'ensure'
        'cursor': ['any', ['auto', 'crosshair', 'default', 'e-resize', 'help', 'move', 'n-resize', 'ne-resize',
          'nw-resize', 'pointer', 'progress', 's-resize', 'se-resize', 'sw-resize', 'text', 'w-resize', 'wait', 'inherit']]
    }
});

// Want an underlying system that represents CSS well.
//  Making it a lot easier to work with CSS, as it is in the browser.
//  On top of that we have another style layer. Maybe jsgui-style? A different way of interacting with the style system.
//  It may be that some .style instructions will be interpreted to go through the jsgui style layer.
//   When setting border-radius in a Page_Context that does not support it.

Enhanced_Data_Object.register_data_type('control_dom', jsgui.data_types_info['control_dom']);
Enhanced_Data_Object.register_data_type('dom_attributes', jsgui.data_types_info['dom_attributes']);
//jsgui.populate_all_dt_maps();
//  data type maps
//   likely to have maps created as needed and cached.

// May have a Data_Type_System that encloses these Data_Types.
ensure_data_type_data_object_constructor('control_dom');


// also a processor for distance?
//  a curried function for n_units basically?

var input_processors = jsgui.input_processors;
var output_processors = jsgui.output_processors;



input_processors['distance'] = function (input) {
    // use the n_units processor, but with 'px'
    return jsgui.input_processors['n_units']('px', input);
};
// not sure about using oltrb right now. Could compress by having a single arr_ltrb variable.
input_processors['margin'] = function (input) {
    return jsgui.input_processors['optional_array'](['left', 'top', 'right', 'bottom'], 'distance', input);
};

input_processors['size'] = function (input) {
    // use the n_units processor, but with 'px'
    console.log('using jsgui size input processor');
    console.trace();

		// Though, if size is an already defined type, we could have an input processor that deals with that.
		//  Could also make use of a default unit, px.

    // And could also use some specific preprocessing before the indexed array one.

    return jsgui.input_processors['indexed_array'](['width', 'height'], 'distance', input);
};







//console.log("jsgui.input_processors['color'] " + jsgui.input_processors['color']);

// just a string in the constructor - looks fine for the type.
//  likely to be using some namespaced type system eventually, but this is my namespace for the moment.

// and output the color to HTML.

// and may have the various output processors for margin (oltrbs?) and other things, outputting to HTML.
//  Some of them may output to other shim controls, or similar.
/// Will eventually output to HTML.

// Need the lower level style system working.
//  On top of that, the jsgui style system will be built.



output_processors['string'] = function (value) {
    // need to escapr it
    return value;
}

// Will require other code as well.

var get_inline_css_dict_from_style = function (style, page_context) {
    //console.log('get_inline_css_dict_from_style ' + stringify(style));

    var style_info = jsgui.data_types_info['style'];


    // should have the style data type info
    //  then for each property we get the data type info for that, and then use its output mechanism.

    var css_style_dict = {};
    each(style, function (i, v) {
        //console.log('style i ' + i);

        // TODO - May not just be a name but could directly be the info. Could use a loader function perhaps.
        var dt_info_style_item_name = style_info[i];
        //console.log('dt_info_style_item_name ' + stringify(dt_info_style_item_name));

        var dti_style_item = data_type_instance(dt_info_style_item_name);

        //console.log('*v ' + stringify(v));

        var style_rule = dti_style_item.output(v);

        //console.log('style_rule ' + stringify(style_rule));
        //console.log('tof(style_rule) ' + tof(style_rule));
        if (tof(style_rule) == 'string') {
            css_style_dict[i] = style_rule;
        } else {

            // could probably use extend here.

            each(style_rule, function (subrule_name, subrule_value) {
                css_style_dict[subrule_name] = subrule_value;
            });

        }

        //apply_jsgui_style_rule_to_css_style(css_style_dict, i, v);
    });
    return css_style_dict;
};

var apply_jsgui_style_rule_to_css_style = function (style, style_rule_name, style_rule_value) {
    //console.log('apply_jsgui_style_rule_to_css_style style_rule_name ' + style_rule_name);

    // it's probably going to use dti and output.

    // Will be changing the way that styles get calculated.
    // Going to create some new functions that get used in the rendering.
    //  Will get help from data_types_info.

    //console.log('fns_jsgui_style_item_to_inline_css_item[style_rule_name] ' + fns_jsgui_style_item_to_inline_css_item[style_rule_name]);

    // this way of doing things will change.
    //  going to do some kind of get_style.

    // More of it will be computed through lang and the data_types system.

    if (fns_jsgui_style_item_to_inline_css_item[style_rule_name]) {
        var inline_style_dict = fns_jsgui_style_item_to_inline_css_item[style_rule_name](style_rule_value);
        //  but could we get more than one style item in the dict?

        each(inline_style_dict, function (i2, v2) {

            style[i2] = v2;
        });
    }
};

var styles_dict_to_string = function (styles_dict) {

    // OK... some improvements will need to be made.
    //  will need to upgrade the styles / size / pos setting code.
    //console.log('styles_dict ' + jsgui.stringify(styles_dict));

    var res = '',
        first = true;
    each(styles_dict, function (i, v) {

        if (typeof v == 'number') {
            v = v + '';
        }

        if (typeof (v) != 'string') {
            //var stack = new Error().stack;
            //console.log('stack ' + stack);
            //console.log('i ' + i);
            //console.log('v ' + v);
            //console.log('typeof v ' + typeof v);
            throw 'jsgui: styles_dict_to_string: Only string css styles supported. Jsgui styles must be translated to css before use here.';
        } else {
            res = res + i + ': ' + v + ';';
        }
    });
    return res;
};

// JSGUI event binding functions.

var _bind_dom_event = function (dom_node, event_name, fn) {

    // return unbind function. ???

    var unbind = _unbind_dom_event(dom_node, event_name, fn);
    return unbind;
}

var _unbind_dom_event = function (dom_node, event_name, fn) {

}







// And Core, of course
//  Likely to rename this 'Control' or 'control' - probably 'Control'.

// Now it is in this file it will be easier to modify by itself.
// More rendering to be handled through the Data_Object capabilities.
//  Could be the output type of various different things.

// Maybe we need more testing of controls, there seems to be a problem which I need to fix to do
//  with fields not being found in the file system control.

// Perhaps I could investigate that control outside of a server.

// This needs more work on its style system.
//  Need to quickly and easily change conformant style rules.
//   There will be a CSS overrides system, but generally the CSS and styling of the Control should follow normal CSS.
//    In some cases the output CSS will not match the input styling rules,
//     there may be shortcuts for convenience, and it will accept more expressive language than CSS (hopefully)
//  But do want full css support.

// control.style('background-image', 'url(...)');
//  but will have input filters in case a url is not given in that format?


// I think this will take quite a lot more work to fully make the CSS / style API.
//  However, we most want to be able to set the style property of an object to give it styles.

// It needs to work with a variety of styles.
//  Needs to access the local CSS inline dict...
//   though could possibly work with a Collection?

// dom.attributes.style
//  I think it makes sense to have that available as a string to set...
//   however, I think dom.attributes._style makes sense.

// want to access the inline style dict.

//  will also apply input transformations in some cases.
//  may apply output transformations when rendering.

// Possibly the style system could do with some separate work and testing.
//  We want it so that in old IE rounded edges can be emulated with VML.


// dom.attributes.style is literally the style attribute as a string?
//  no special case there?
//   however, there will be a system of dynamically creating this in as its needed in some cases.

var edo_init = Enhanced_Data_Object.prototype.init;
var do_init = Data_Object.prototype.init;
//var do_init_call = Data_Object.prototype.init.call;

// Will also use reusable local variables.
//  May be a bit experimental! Should do less assignment & garbage collection.

var that, dom, flags, css_flags, spec_content, tsc, arr, res, dom_attrs;

// Link tag needs to have no closing tag.

// This should have more for the client side.
//

// For drag and drop:
//  Best to use the existing API. Have a layer on top of that.
// Then for mobile (iOS, Blackberry? Android) have an implementation that is a bit like the HTML implementation.
// Then have a nice, convenient layer on top of both.

// Drag, rearranging seems really useful.
// May need to interact with server objects when doing the rearrangement, need a clear division between rearrangement
//  UI and the actions it carries out.

// Basically say something is draggable
// Don't assume it drags itself, there may be a handle
// Allow the drag item to be something representing some data in terms of model
// Allow the drag item to be a ghost view of the item being dragged
// Work so that example with the separate items grouping together works.




// Perhaps have some kind of html enhancements module?




// Control could benefit from composition methods and definitions.
//  They define the composition of controls.
//   May contain inner controls. These get created when necessary.


// Also need a good system for drag and drop events.
//  Need to recognise drag starts at first.

// Dragging something that is already selected.

// Selecting something on the beginning of the drag.



// Also want to be able to make shallow copies / clones of controls.
//  Probably won't have connection to data.
//   For short term use in dragging.

// will copy all the dom attributes and tags, nodes.
//  could be a control?
//   including subcontrols... could make a bunch of new controls as the copy.
//    That may be best to have the same effects / to enable effects.


var parse_style_attribute_to_map = function(str_style) {
    str_style = str_style.replace(/; /g, ';');
    str_style = str_style.replace(/: /g, ':');
    var rules = str_style.split(';');
    var rule_nvps = [];
    var map_rules = {};
    each(rules, function(i, rule) {
        if (rule) {
            var sRule = rule.split(':');

            rule_nvps.push(sRule)
            map_rules[sRule[0]] = sRule[1]
        }

    })

    //console.log('rule_nvps ' + stringify(rule_nvps));

    //console.log('map_rules ' + stringify(map_rules));

    return map_rules;
}

var style_attribute_map_to_string = function(map_style) {
    var arr_res = [];
    var first = true;
    each(map_style, function(i, v) {
        if (!first) {
            arr_res.push(';');
        }

        arr_res.push(i);
        arr_res.push(':');
        arr_res.push(v);


        first = false;
    })
    return arr_res.join('');
}

// Deferred rendering is going to be a fairly major feature.


var getStyle = function (el, property_name) {

    if (el.currentStyle)
        var y = el.currentStyle[property_name];
    else if (window.getComputedStyle);
        var y = document.defaultView.getComputedStyle(el, null).getPropertyValue(property_name);
    return y;
}


// Making it so a Control needs to be initialised with a context every time?

// Having size as a field of the control seems like a good way to do things.
//  And it would have a specified data type.


var Control = jsgui.Enhanced_Data_Object.extend({

    'fields': [
    // This may be a good way of expressing collections, works in JSON.
    //['content', ['collection', 'control']]

    // need to make sure that the fields makes these with the right contexts.

    // Say it's a collection of controls?
        // Could possibly have an inner content?
        //  Inner control?
        //  And that inner control's content is the inner content.
        //  Not all will have an inner control.
        //   Could check a control to see if it has it.
        //   Add will add to the inner control.

        // May have active fields as well.
        //  There will be references to other controls - that's handled with data-jsgui-ctrl-fields.
        //  The non-control fields are transferred with data-jsgui-fields
        //   However, we don't want to confuse them with the fields that are a standard part of the control in a different part of the lifecycle.

        // May be worth explicitly breaking out the Composition part of the Control lifecycle again.
        //  When a Control is initialized on the client, being given a DOM element, it does not need to be composed.
        //   (I think)

        ['content', 'collection'],
        ['dom', 'control_dom'],
        ['size', 'size'],
        ['color', 'color']

        // Including color in this section...
        //  would go through the input processing.






        //,

				// Seems like it's automatically made functions to access the fields?



				// Size not really working right as a field.
				//  Perhaps alongide input and output processors, we need to specify linkage with a DOM property.




        // What are the CSS flags?
        //  Should this use the flag system?
        //  We will have flags that determine CSS styling.
        //   But do we have flags that directly are CSS properties / configurations, either on or off?

        //['css_flags', Collection(String)]
        // context as a field?
        //  or is context handled by Data_Object?

    ],

    // Set up a field with type Control.
    //  Then it will be sent to the client as a control field, and the reference re-obtained.


    // Connect all fields? Just some of them?
    //  Want to make it easy for the necessary fields / control references to be sent to the client.
    'connect_fields': true,

    // Don't want to use this much. Should probably override functions instead. ??? Or find a way not to use it.
    'mod_link': function () {
        return jsgui;
    },

    // Style does Data_Object.set('style')
    //  so need to be careful about this style object.
    //   Will need to refer to it when rendering.

    // There will be the jsgui-style, but I think having normal style as the default is best, and that will get
    //  overridden in some circumstances.


    // We are likely to need a better style function in HTML.

    // may be good in some ways having it work as a field.

    // Keep dom.style.attributes as it is, but modify that when changing inline styles.

    'init': function (spec) {

        // but process / normalize the spec here?

        spec = spec || {};
        //spec.nodeType = spec.nodeType || 1;
        //console.log('pre super init');
        //this._super(spec);

        //do_init_call(this, spec);
        this.mapListeners = {};

        // Some of the Control initialization makes sense to do before the Data_Object initialization.
        //  Data_Object will run the fields as function calls to set the values.
        // When setting the color upon init, it's not setting the color in the css.
        //  However, size is working OK.





        do_init.call(this, spec);


        //console.log('post super init');

        this.__type_name = 'control';
        this.__type = 'control';

        if (!this._abstract) {


            /*
            this.add_event_listener('set', fp(function (a, sig) {
                //console.log('control event set sig ' + sig);
                //throw 'stop';
                // a flag could have been set.
            }));
            */

            // need to listen for changes in the flags and maybe some other properties.
            //  css classes will be added and removed using these flags.

            // will also have this responding to the addition and removal of css flags.
            //  css flags will correspond to a normal flag, so setting a css flag creates the normal flag too
            //  removing the normal flag removes the css flag if there is one.
            //  removing the css flag removes the normal flag if there is one.

            //  could have a list of css_enabled_flags so that whenever the normal flag version is switched on, it switches on
            //   the css flag as well.

            // may have a fairly convenient interface for receiving these flags (for instances ans for classes)
            //  and have some complexity inside, but making it as simple for the end developer as possible, while also
            //  enabling event responses to work as well.

            //flags = this.get('flags');
            //css_flags = this.get('css_flags');

            //var flags = this.get('flags');
            //var css_flags = this.get('css_flags');


            //var that = this;
            //that = this;

            //console.log('pre get dom');

            // abstract controls don't have the field instances.
            //  but they could have settings or a spec.
            // Maybe abstract Data_objects could retain their spec,
            //  then not do the normal constructor.

            //console.log('this.fields() ' + stringify(this.fields()));
            // the chained fields?
            //  have the fields not been initialised properly?
            //var chained_fields = jsgui.get_chained_fields(this.constructor);
            //console.log('chained_fields ' + stringify(chained_fields));
            //console.log('pre get dom');
            //var dom = this.get('dom');

            //dom = this.get('dom');
            //dom.set('tagName', 'div'); // Though may depend on spec...

            var tagName = spec.tagName || spec.tag_name || 'div';

            this.set('dom.tagName', tagName);

            // this.set_s_s;
            //  different versions of set, one of which will just set using 2 string params.



            //  using two strings.
            //  a version of the function

            // could have inline creation of the dom Data_Object.

            //var dom = this._.dom = this._.dom || new Data_Object({'context': this.context});
            //var tag_name = dom._.tagName = new Data_Value({'value': tagName});
            //tag_name.parent(dom);

            this._icss = {};
            //this._.dom = {'tagName': 'div'};

            // Abstract controls won't have

            //console.log('dom ' + stringify(dom));

            // The DOM is a field that it should be getting from the control.
            spec_content = spec.content;
            if (spec_content) {
                tsc = tof(spec_content);
                if (tsc == 'array') {
                    throw 'Content array not yet supported here.'
                } else if (tsc == 'string' || tsc == 'control') {
                    this.content().add(spec_content);
                }

            }

            if (spec.el) {

                //console.log('spec.el', spec.el);
                this.set('dom.el', spec.el);
                //console.log('this._.dom._.el', this._.dom._.el);
                //throw 'stop';
            }

            var that = this;
            var context = this._context;

            //console.log('context', context);

            if (context) {

                if (context.register_control) context.register_control(this);
            } else {
                //console.trace('');
                //throw 'Control requires context'

                // I think the very first Control object's prototype or something that inherits from it does not have
                //  a context at some stage.
            }



            if (spec['class']) {
                //this.set('dom.attributes.class', spec['class']);
                this.add_class(spec['class']);
            }






            // When content gets added, need to update the relationships.

            // Perhaps change is the better event to use.

            //  And then within the change event there are more details.
            //  Fewer event listeners to add.

            //

            var content = this.get('content');
            content._parent = this;

            // Want to have the list of fields
            //var cc = 0;

            // Want to listen to changes in fields.
            //  Change gets triggered so frequently!

            // Why is the event getting bound too many times?
            //  Have a strange problem, where this event is firing more than expected and more appear bound on the control.

            // Are change events being bubbled?

            // Why is on change setting up so many event handlers?


            // A change event here seems to be creating lots of event handlers on one control.

            // Need to work out why event binding here causes problems, with it seeming to bind lots of events to one control.

            // It will probably be best to do smaller test cases to do with event binding and bubbling,
            //  possibly also browser based cases that will be easier to follow.


            // Onchange here makes it go drastically wrong.
            //  Between page views, event handlers are building up on a control.
            //  Seems like some Data_Objects or Controls may not have contexts applied.



            // The control's onchange event is not working.
            //  It seems like onchange for the content is working though.

            //  On change any of the control fields...
            //   Could create onchange events for each of the control fields automatically.



            var that = this;

            // Want something in the change event that indicates the bubble level.
            //  It looks like the changes bubble upwards.

            // Want a 'target' for the change event.

            var size = this.get('size');
            console.log('tof size', tof(size));

            //throw 'stop';


            // has the value been set?

            //console.log('size._', size._);

            var set_dom_size = function(size) {
                var width = size[0].join('');
                var height = size[1].join('');

                //console.log('width', width);
                //console.log('height', height);

                that.style({
                    'width': width,
                    'height': height
                });
            };

            var set_dom_color = function(color) {
                var color_css_property = 'background-color';

                // need to run output processor on the inernal color value

                var out_color = output_processors['color'](color);

                //console.log('out_color');


                that.style(color_css_property, out_color);
            };


            // This is where it sets the size to begin with.
            //  Need the same for color.
            //  Possibly need the same for a whole load of properties.
            if (size._) {
                set_dom_size(size._);
            }

            size.on('change', function(e_size_change) {
                //console.log('e_size_change', e_size_change);

                var target = e_size_change.target, name = e_size_change.name, value = e_size_change.value;

                set_dom_size(value);

                //console.log('*** value', value);
                //console.log('*** tof value', tof(value));

                // Could use an html/css output processor.


            });


            // Need to listen for changes in the color as well.

            var color = this.get('color');


            // Quite sure that color should be a Data_Value, not a Data_Object.
            //  It gets created within Data_Object get.
            //  Want these types to be defined within a Data_Value.
            //   Some of the types should carry on within a Data_Object though.
            //

            // Size already gets created as as Data_Value
            //  possibly specify that within color as well as have code that recognises that its specified.










            console.log('color', color);
            console.log('tof color', tof(color));

            if (color._) {
                console.log('color._', color._);
                set_dom_color(color._);
            }

            color.on('change', function(e_color_change) {
                console.log('core ctrl e_color_change', e_color_change);

                var value = e_color_change.value;

                // Some controls will have color property apply to a different css property

                var color_css_property = 'background-color';

                // need to run output processor on the inernal color value

                var out_color = output_processors['color'](value);

                console.log('out_color');


                that.style(color_css_property, out_color);



            });



        }

    },


    'post_init': function (spec) {
        //throw 'stop';
        if (spec && spec.id === true) {
            // get the id from the context.
            //if (t)
            this.set('dom.attributes.id', this._id());

        }
    },

    // Not so sure that css flags will be used.
    //  We have css classes which get manipulated.
    //  Other types of properties won't depend on CSS quite yet.
    //  Will have control fields improved to be more flexible and to carry from the server to the client parameters and behavioural rules.

    /*
    'add_css_flag': function (flag_name) {
        var css_flags = this.get('css_flags');
        //console.log('css_flags ' + stringify(css_flags));

        // Flags that appear in CSS.
        //  Also have some other effect, most likely.

        if (!css_flags.has(flag_name)) {
            css_flags.add(flag_name);
        }


    },
    'remove_css_flag': function (flag_name) {
        var css_flags = this.get('css_flags');
        if (css_flags.has(flag_name)) {
            css_flags.remove(flag_name);
        }

    },
    'has_css_flag': function (flag_name) {
        var css_flags = this.get('css_flags');
        return css_flags.has(flag_name);
    },

    */

    // Maybe consider these part of rendering, move them.
    '_get_amalgamated_style': function (arr_contexts) {
        //console.log('this._.style ' + stringify(this._.style));

        // Do we have style as a field that uses data objects?

        //res = clone(this._.style);
        //that = this;




        // needs to be substantially redone.
        //  I want to keep it simple, and close to the HTML API by default.
        //  There will need to be overrides in various places.

        // Sometimes new elements would need to be put in (maybe into the background)

        //console.log('res ' + stringify(res));
        // OK, needs the style object.

        // Likely to have the style() function.

        /*
    	 * not using contexts at the moment anyway
    	 *
    	$.eac(arr_contexts, function(i, v) {
    		//var cs = that._.cs[v];
    		if (global.page_context && global.page_context.context_style[v]) {
    			//console.log('a) get_amalgamated_style res ' + jsgui.stringify(res));
    			apply_style_to_style(res, global.page_context.context_style[v]);
    			//console.log('b) get_amalgamated_style res ' + jsgui.stringify(res));
    		}
    	});
    	*/
        //return res;

        // Not going to use this._.style.
        //  will have this._icss for inline css

        return clone(this._.style);
    },

    '_get_rendered_inline_css_dict': function () {

        // and does setting the style work right?

        // will refer to an object, will return this._.inline_css_dict.
        //  will render that dict when necessary ---?
        //  amalgamting the styles

        // when changing the style of something - may be overwritten by amalgamated styles?
        //  have an amalgamated style override?

        //var contexts = this.getContexts(),

        var ast = this.get_amalgamated_style()


        //console.log('ast ' + stringify(ast));
        var inline_css_dict = get_inline_css_dict_from_style(ast);

        //console.log('inline_css_dict ' + jsgui.stringify(inline_css_dict));

        return inline_css_dict;
    },


    // Will use less inline style rendering, will make more stylesheet components.
    //  Will also work on tools for making stylesheets and styles.

    // may be how style gets output - could use an output system that makes reference to the page_context.
    //  it is just dom.attributes.style
    /*
    '_get_rendered_inline_css': function () {
        var css_dict = this.get_rendered_inline_css_dict(),
            str_css = '';

        // renders the jsgui styles that have been set to the inline style
        // then renders/copies the CSS inline styles to the inline style

        // will already have a style dict.


    	//if (typeof this.dom.attributes != 'undefined' && typeof this.dom.attributes.style != 'undefined') {
    	//	var da_style_dict = str_get_styles_dict(this.dom.attributes.style);
      //	var nsd = {};
      //	$.extend(true, nsd, da_style_dict,  css_dict);
      //	str_css = styles_dict_to_string(nsd);
    	//};


        // will be a data type that supports ordering / reordering soon.
        var h = this.has('this.dom.attributes._.dict_style');
        // maybe does not have that attribute?
        // they are inline styles (that have been set)

        //console.log('h ' + h);

        if (h) {
            var da_style_dict = h;
            var nsd = {};
            extend(true, nsd, da_style_dict, css_dict);

            //console.log('nsd ' + jsgui.stringify(nsd));

            str_css = styles_dict_to_string(nsd);
        } else {
            //console.log('css_dict ' + jsgui.stringify(css_dict));
            str_css = styles_dict_to_string(css_dict);
        }

        return str_css;
    },
    */

    // likely to be done with an alias
    //  And will be done using the data type system.

    'property_css_transition_duration': function (style_property_name) {
        // this._.s

        // will refer to style properties differently

        if (this.has('_.s.transition')) {
            // look up the css transition in the jsgui style
            //if(this._.s.transition) {
            var tr = this._.s.transition;
            if (tr[style_property_name]) {
                // anything about duration etc?
                var dur = tr[style_property_name][0];
                return dur;
            }
            //}
        }
    },

    // 'ret' function - gets something if possible.
    'has': function (item_name) {
        var arr = item_name.split('.');
        //console.log('arr ' + arr);
        var c = 0,
            l = arr.length;
        var i = this;
        var s;
        while (c < l) {
            s = arr[c];
            //console.log('s ' + s);
            if (typeof i[s] == 'undefined') {
                return false;
            }
            i = i[s];
            c++;
        };
        return i;
    },

    // The Dom attributes could count as fields, and wind up rendering themselves using Get.
    //  Dom attributes likely to be a collection as well, perhaps automatically sorted by name.
    // Could use collection rendering.
    'renderDomAttributes': function () {
        //console.log('renderDomAttributes');

        // Pre-render dom attributes?
        //  To set the dom attributes programmatically according to properties.

        if (this.beforeRenderDomAttributes) {
            this.beforeRenderDomAttributes();
        }

        // Need to set up the data-jsgui-ctrl-fields attribute.
        //  Probably should not be setting it directly.
        //  It's just a string property.
        // The code that I'm currently using is messy and would be better if it were encapsulated.
        //  Just setting a property of a control with another control, on the server, should be enough to get this mechanism operating.
        //  It will be available as a field on the client-side.

        var dom_attrs = this.get('dom.attributes');

        if (!dom_attrs) {
          throw 'expecting dom_attrs';
        } else {
          if (this._ctrl_fields) {
            // go through the control fields, putting together the data attribute that will be persited to the client.

            // need to compose the string.

            var obj_ctrl_fields = {};

            var keys = Object.keys(this._ctrl_fields);
            var key;
            for (var c = 0, l = keys.length; c < l; c++) {
              key = keys[c];
              obj_ctrl_fields[key] = this._ctrl_fields[key]._id();
            }

            //each(this._ctrl_fields, function(ctrl_field, name) {
            //  obj_ctrl_fields[name] = ctrl_field._id();
            //});


            //this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(obj_ctrl_fields).replace(/"/g, "'"));
            // lower level set here?
            dom_attrs.set('data-jsgui-ctrl-fields', stringify(obj_ctrl_fields).replace(/"/g, "'"))


          }

          if (this._fields) {
            // go through the control fields, putting together the data attribute that will be persited to the client.

            // need to compose the string.

            //var obj_fields = {};
            //each(this._ctrl_fields, function(ctrl_field, name) {
            //  obj_ctrl_fields[name] = ctrl_field._id();
            //});

            //this.set('dom.attributes.data-jsgui-fields', stringify({
            //    'num_days': num_days
            //}).replace(/"/g, "[DBL_QT]").replace(/'/g, "[SNG_QT]"));


            //this.set('dom.attributes.data-jsgui-fields', stringify(this._fields).replace(/"/g, "[DBL_QT]").replace(/'/g, "[SNG_QT]"));
            dom_attrs.set('data-jsgui-fields', stringify(this._fields).replace(/"/g, "[DBL_QT]").replace(/'/g, "[SNG_QT]"))

          }
          var arr = [];
          //var arr_dom = dom_attrs._arr;

          //for (var c = 0, l = arr_dom.length; c < l; c++) {
          //  arr.push(' ', c, '="', arr_dom[c], '"');
          //}
          var _ = dom_attrs._;
          var dom_attrs_keys = Object.keys(_);
          //console.log('dom_attrs_keys', dom_attrs_keys);
          //throw 'stop';

          var key, item;
          for (var c = 0, l = dom_attrs_keys.length; c < l; c++) {
            key = dom_attrs_keys[c];
            item = _[key];
            arr.push(' ', key, '="', item, '"');
          }



          //dom_attrs.each(function (i, v) {
          //    arr.push(' ', i, '="', v, '"');
          //});
          return arr.join('');
        }


        // Maintaining a dict, or some data structure of the inline styles will help.






        //res = arr.join('');
        //return res;

    },
    'renderBeginTagToHtml': function () {

        // will be in _.dom.tagName
        //  I think that's why we need the further level properties.

        // dom.style.transform3d.translate3d
        //  these property levels could go quite deep. Want a convenient way of using them without having to manually code lots of
        //  iterations, nested existance checks. Could have shortcuts so it knows what dom.translate3d means.
        // do we have 'get'?
        //var dom = this.get('dom');
        //var tagName = this.get('dom.tagName'),
        var tagName = this._.dom._.tagName;
        //console.log('this._.dom', this._.dom._.attributes);

        //console.log('tagName', tagName);
            res;

        if (tagName === false) {
            res = '';
        } else {

            //var dom_attributes = this.renderDomAttributes();
            res = ['<', tagName, this.renderDomAttributes(), '>'].join('');
        }
        //var res = ['<', this._.tagName, this.renderDomAttributes(), '>'].join('');

        //console.log('renderBeginTagToHtml res ' + res);
        return res;
    },
    'renderEndTagToHtml': function () {
        // will have different way of referring to the tagName, but that could be a shortcut.
        // dom.tagName();
        //  through the fields system.
        var dom = this.get('dom');
        var tagName = dom.get('tagName'),
            res;

        var noClosingTag = dom.get('noClosingTag');

        //console.log(tof(noClosingTag));
        //throw 'stop';

        if (tagName === false || noClosingTag) {
            res = '';
        } else {
            res = ['</', tagName, '>'].join('');
        }

        //console.log('renderBeginTagToHtml res ' + res);
        return res;
    },
    'renderHtmlAppendment': function () {
        return this.htmlAppendment || '';
    },

    // not rendering a jQuery object....
    // content including the tags? Not for the moment. Tags being false means there are no tags, and this tagless control acts as a container for other
    //  controls or content.
    // That will be useful for having different insertion points in controls without having to have them enclosed by an HTML element.

    'renderEmptyNodeJqo': function () {
        return [this.renderBeginTagToHtml(), this.renderEndTagToHtml(), this.renderHtmlAppendment()].join('');
    },

    // Need to implement deferred rendering.
    //  Some controls will ge ttheir data from a Resource / from Resources.
    //  This means the data is available to them asyncronously.
    //  The control will not be ready to render immediately.

    // For example, a control shows the records in a DB table. This is done through accessing a Resource.
    //  The control will not be ready to render until it has loaded the data from the Resource.

    // I think some kind of 'status' in the Control would make sense.
    //  Assumed to be ready, but could have .__status = 'waiting'
    // Could hold more info about waiting and timing?

    // For the moment, just need to be able to delay rendering a control until all subcontrols are ready.

    // Will go through the control tree like with rendering, noting down any that are not ready, and subscribing to their ready events.
    //  We count down the number yet to be ready, when that is 0 we do the rendering like normal, except returning the result asyncronously.


    'iterate_this_and_subcontrols': function(ctrl_callback) {
        ctrl_callback(this);

        var content = this.get('content');
        var that = this;

        content.each(function(i, v) {
            //console.log('v', v);

            tv = tof(v);
            if (tv == 'string') {
                // escape the string.

                //var output = jsgui.output_processors['string'](n);
                //res.push(output);
                //res.push(jsgui.output_processors['string'](n));

            }
            /*
            if (tof(n) == 'string') {
                // escape the string.

                var output = jsgui.output_processors['string'](n);
                res.push(output);

            }
            */
            if (tv == 'data_value') {
                //var output = jsgui.output_processors['string'](n.get());
                //res.push(jsgui.output_processors['string'](n.get()));
            } else {
                //htm = n.all_html_render();
                //res.push(n.all_html_render());

                // it should not be null, but can ignore it for the moment / forever

                if (v && v.iterate_this_and_subcontrols) {
                    v.iterate_this_and_subcontrols.call(v, ctrl_callback);
                }


            }



        });


    },

    // Should now include deferred rendering.

    'all_html_render': function(callback) {

        //console.log('all render callback', tof(callback));
        if (callback) {

            //console.log('deferred rendering');
            //throw 'stop';

            // Get the map of any controls that have __status == 'waiting'.
            var that = this;
            // want to recursively iterate through controls and subconstrols.
            var arr_waiting_controls = [];

            // Worth setting up the listener on this loop?



            this.iterate_this_and_subcontrols(function(control) {
                if (control.__status == 'waiting') arr_waiting_controls.push(control);
            });

            // then if we are waiting on any of them we listen for them to complete.

            //console.log('arr_waiting_controls.length', arr_waiting_controls.length);

            if (arr_waiting_controls.length == 0) {
                var html = this.all_html_render();
                callback(null, html);
            } else {
                var c = arr_waiting_controls.length;

                var complete = function() {
                    //console.log('complete');
                    that.pre_all_html_render();

                    var dom = that.get('dom');
                    //console.log('dom', dom);

                    if (dom) {
                        // does it have innerHTML?
                        //  I think that will just be a content item that gets rendered anyway.
                        //console.log('has dom');

                        /*

                        var beginning = this.renderBeginTagToHtml();
                        var middle = this.all_html_render_internal_controls();
                        var end = this.renderEndTagToHtml();
                        var appendment = this.renderHtmlAppendment();

                        res = [beginning, middle, end, appendment].join('');
                        */
                        //return [that.renderBeginTagToHtml(), that.all_html_render_internal_controls(), that.renderEndTagToHtml(), that.renderHtmlAppendment()].join('');
                        var html = [that.renderBeginTagToHtml(), that.all_html_render_internal_controls(), that.renderEndTagToHtml(), that.renderHtmlAppendment()].join('');
                        //console.log('html', html);
                        callback(null, html);
                        //throw ('stop');
                    }
                }

                each(arr_waiting_controls, function(control, i) {


                    control.on('ready', function(e_ready) {
                        //console.log('control ready');
                        c--;
                        //console.log('c');
                        if (c == 0) {
                            complete();
                        }

                    });
                });


            }
        } else {
            this.pre_all_html_render();

            var dom = this.get('dom');

            if (dom) {
                // does it have innerHTML?
                //  I think that will just be a content item that gets rendered anyway.
                //console.log('has dom');

                /*

                var beginning = this.renderBeginTagToHtml();
                var middle = this.all_html_render_internal_controls();
                var end = this.renderEndTagToHtml();
                var appendment = this.renderHtmlAppendment();

                res = [beginning, middle, end, appendment].join('');
                */
                return [this.renderBeginTagToHtml(), this.all_html_render_internal_controls(), this.renderEndTagToHtml(), this.renderHtmlAppendment()].join('');
                //throw ('stop');
            }
        }

        //console.log('all_html_render ');
        //if (this.pre_all_html_render) {
        //
        //}


        //return res;
    },



    'render_content': function () {

        //console.log('render_content');

        // it's controls() now, gets the collection of controls.
        //each(this._.controls, function(i, n) {

        //var fields = this.fields();
        //console.log('fields ' + stringify(fields));

        // Some kind of full content?
        //  Content shortcuts?

        // Or have an internal_content property?
        //  Possibility of different places for internal content?
        //   Or not right now?

        // I think an internal_content reference would be best.
        //  or just .internal


        // should be able to get the content... it's a field.
        //  but complications because it's a collection.

        // When adding a string to the collection...

        var content = this.get('content');

        // Does not have content?
        //  That's very strange.

        if (!content.length) {
            console.log('!!!no content length!!!');
            console.log('');
            console.log(this);
            console.log('');
            console.trace();
            console.log('content', content);
            console.log('tof(content) ' + tof(content));
            throw 'stop';
        }

        //console.log('content', content);
        //console.log('tof(content) ' + tof(content));

        // The content should not be a control.
        //  Can't call a part of a control its 'content', as that already exists.
        //  Should be considered a protected word.

        var contentLength = content.length();

        // var res = [];

        var res = new Array(contentLength);

        //console.log('-------------------------');
        //console.log('content ' + stringify(content));
        //console.log('tof(content) ' + tof(content));
        //throw('8) stop');

        /*
    	each(controls._arr, function(i, n) {
            htm = n.all_html_render();
            res.push(htm);
        });
    	*/
        var tn, output;
        //console.log('content', content);

        // content._arr

        var arr = content._arr;
        var c, l = arr.length, n;

        for (c = 0; c < l; c++) {
          n = arr[c];
          // Could use faster duck typing here.
          tn = tof(n);
          if (tn == 'string') {
              // escape the string.
              //var output = jsgui.output_processors['string'](n);
              //res.push(output);
              res.push(jsgui.output_processors['string'](n));
          }
          /*
          if (tof(n) == 'string') {
              // escape the string.

              var output = jsgui.output_processors['string'](n);
              res.push(output);

          }
          */
          if (tn == 'data_value') {
              //var output = jsgui.output_processors['string'](n.get());
              res.push(jsgui.output_processors['string'](n._));
          } else {
              if (tn == 'data_object') {
                  //console.log('n', n);
                  //
                  throw 'stop';
              } else {
                  res.push(n.all_html_render());
              }
              //htm = n.all_html_render();
          }
        }

        /*
        content.each(function (i, n) {
            //console.log('-------------------------');
            //console.log('tof(n) ' + tof(n));
            //console.log('(n) ' + stringify(n));
            //throw 'stop';
            tn = tof(n);
            if (tn == 'string') {
                // escape the string.
                //var output = jsgui.output_processors['string'](n);
                //res.push(output);
                res.push(jsgui.output_processors['string'](n));
            }
            if (tn == 'data_value') {
                //var output = jsgui.output_processors['string'](n.get());
                res.push(jsgui.output_processors['string'](n.get()));
            } else {
                if (tn == 'data_object') {
                    console.log('n', n);
                    //
                    throw 'stop';
                } else {
                    res.push(n.all_html_render());
                }
                //htm = n.all_html_render();
            }
        });
        */

        //console.log('res', res);
        return res.join('');
    },

    'all_html_render_internal_controls': function () {
        //var controls = this.controls, res = [];
        return this.render_content();
    },
    'pre_all_html_render': function () {

    },



    'compose': function () {

        // I think having this avoids a recursion problem with _super calling itself.
    },

    'wait': function (callback) {
        //console.log('wait');
        setTimeout(function () {
            callback();
        }, 0);
    },
    // could use aliases for style properties.

    'visible': function (callback) {

        //console.log('vis');

        //return this.style('display', 'block', callback);
        this.style('display', 'block', callback);
    },

    // These kind of functions, that set a property to a value, could be made in a more efficient way.

    // have this in a function chain?
    'transparent': function (callback) {
        // make block or inline display, maybe depending on what it was before being made hidden
        //console.log('transp');
        // if display is none then display it.
        //  may have the previous display value stored.
        //return this.style({'opacity': 0}, callback);
        this.style('opacity', 0, callback);
        /*

	this.style({
		'display': 'block',
		'opacity': 0
	});

	if (callback) {
		setTimeout(function() {
			callback();
		}, 0);
	} else {
		return this;
	}
	*/
    },
    'opaque': function (callback) {
        return this.style({
            'opacity': 1
        }, callback);

    },

    // possibly change name
    'chain': function (arr_chain, callback) {
        // each item in the array is a function call (reference) that needs to be executed.
        // assuming the last param in each function is the callback.

        var pos_in_chain = 0;

        //setTimeout()
        var that = this;
        var process_chain = function () {
            //console.log('process_chain arr_chain.length ' + arr_chain.length + ', pos_in_chain ' + pos_in_chain);
            //console.log('arr_chain.length ' + arr_chain.length);
            if (pos_in_chain < arr_chain.length) {
                var item = arr_chain[pos_in_chain];

                // what types can item be
                // an array... that means more than one thing gets applied at this point in the chain.

                var t_item = tof(item);

                //console.log('t_item ' + t_item);
                if (t_item == 'array') {
                    // do more than one item at once.

                    // will wait for them all to be complete too.
                    var count = item.length;
                    var cb = function () {
                        count--;
                        if (count == 0) {
                            //if (callback) {
                            //	callback();
                            //}
                            pos_in_chain++;
                            process_chain();
                        }
                    };
                    each(item, function (i, v) {
                        that.fn_call(v, function () {
                            cb();
                        });
                    });
                    //console.log('arr item ' + stringify(item));
                } else {
                    // for a string I think.
                    // could be a map, and need to call the item(s) in the map.
                    that.fn_call(item, function () {
                        //console.log('cb1');
                        pos_in_chain++;
                        process_chain();
                    });
                }
            } else {
                if (callback) {
                    callback.call(that);
                }
            }
        }
        process_chain();
    },
    'fn_call': function (call, callback) {
        // and callbacks within the right way?
        //console.log('fn_call ' + call);
        var t = tof(call);
        //console.log('t ' + t);
        // but call may be an object...
        var fn, params, that = this;
        if (t == 'string') {
            fn = this[call];
            params = [];
            //console.log('callback ' + callback);
            if (callback) {
                return fn.call(this, callback);
            } else {
                return fn.call(this);
            }
        };
        if (t == 'array') {
            // the 0th item in the arr should be the function name, the rest the params
            // but does the function have a 'callback' param that we know about here? not now.
            fn = this[call[0]];
            params = call.slice(1);
            if (callback) params.push(callback);
            return fn.apply(this, params);
        }
        if (t == 'object') {
            // how many?
            var count = 0;
            each(call, function (i, v) {
                count++;
            });

            each(call, function (i, v) {
                var cb = function () {
                    count--;
                    if (count == 0) {
                        callback.call(that);
                    }
                };
                that.fn_call([i, v], cb);
            });
        }
    },

    // I think .animate syntax would be very helpful.
    //  syntax similar to jQuery but likely to allow more possible options???
    //   more ways of expressing the options.






    // This could probably be defined as an alias.

    // transition -> style.transition
    //  Integrating callbacks with these property changes?
    //  Maybe should not do so much more on compressing & generalizing yet.

    // Horizontal_Carousel_Selector
    //  Or just show these various selectable items in the horizontal carousel.

    // Will maybe make the carousel continuous, so could go from December to January, and it would raise an event
    //  signifying the continuation and direction, so this could make the year change.
    // Would have a horizontal carousel selector for selecting the year, with it continuing.
    //  Could make it a combo selector so the value can be typed in as well. 'J' would bring up 'January', 'June' and 'July' as autoselect items.
    // Putting these GUI features in place will not take so long, and will help this to be a powerful toolkit.

    // May be worth doing more on databases and authentication though.



    'transition': function (value, callback) {
        //var i = {};
        //i[]

        // may include multiple transitions in an array.
        return this.style({
            'transition': value
        }, callback);
    },

    'transit': fp(function (a, sig) {

        // arr_duration_and_timing_function, map_values, callback
        // transit, callback
        //console.log('transit sig ' + sig);
        // [[n,s],o]  a duration with timing function, then a transit map. no callback
        //  what about extracting from the most inner array, so also responding to [[[n,s],o]].
        // seeing that the required thing is inside an array shell.

        // extract_sig_from_array_shell
        var that = this;
        //  [[[n,s],o,],f] including callback function

        // [[[n,s],o]]
        var unshelled_sig = remove_sig_from_arr_shell(sig);
        //if (remove_sig_from_arr_shell(sig))
        //console.log('unshelled_sig ' + unshelled_sig);
        if (unshelled_sig == '[[n,s],o]') {
            return this.transit(a[0][0], a[0][1]);
        }

        if (sig == '[[[n,s],o],f]') {

            var transit = a[0];
            var callback = a[1];

            var duration_and_tf = transit[0];
            var map_values = transit[1];

            this.transit(duration_and_tf, map_values, callback);

        } else if (sig == '[[n,s],o,f]') {
            var duration_and_tf = a[0];
            var map_values = a[1];
            var callback = a[2];
            var transition = {};
            each(map_values, function (i, v) {
                // set the transition style
                transition[i] = duration_and_tf;
            });
            that.transition(transition);

            each(map_values, function (i, v) {
                // set the transition style
                //transition[i] = arr_duration_and_timing_function;

                // use the style function to set the value
                // and use a callback system here for when they are all done.

                that.style(i, v);
            });

            //this.transit(duration_and_tf, map_values, callback);
        } else if (a.length == 2) {
            var duration_and_tf = a[0];
            //console.log('a ' + stringify(a));

            // transit includes the map values

            var duration_and_tf = a[0];
            var map_values = a[1];
            //var transit_map = a[1];
            var transition = {};

            each(map_values, function (i, v) {
                // set the transition style
                transition[i] = duration_and_tf;


            });
            that.transition(transition);

            each(map_values, function (i, v) {
                // set the transition style
                //transition[i] = arr_duration_and_timing_function;

                // use the style function to set the value
                // and use a callback system here for when they are all done.

                that.style(i, v);

            });
            //console.log('transit_map ' + stringify(transit_map));
            //this.transit(duration_and_tf, transit_map);
            //that.transition()
        } // else if (a.length == 3) {
        //	var arr_duration_and_timing_function = a[0], map_values = a[1], callback = a[2];
        //	console.log('a ' + stringify(a));


        //}

    }),

    // and also want to be able to output the property.

    'out': function (property_name) {
        var dti_control = data_type_instance('control');

        //var prop_ref = get_property_reference(this, property_name, false);
        var prop_ref = dti_control.nested_get_property_reference([this, '_'], property_name, true);

        var item_type = prop_ref[2];
        var dti_item = data_type_instance(item_type);

        var out_val = dti_item.output(prop_ref[0][prop_ref[1]]);

        //console.log('out prop_ref ' + stringify(prop_ref));
        //console.log('out out_val ' + stringify(out_val));

        return out_val;
    },

    'page_context': function (val) {
        if (typeof val == 'undefined') {
            // _.page_context should not be a function.

            // how frequently does it need to be called?
            //  is it being called too much?
            //console.log('� this._.page_context ' + this._.page_context);
            if (is_defined(this._.page_context)) {
                return this._.page_context;
            } else {
                if (jsgui.page_context) {
                    return jsgui.page_context;
                }
            }
        } else {
            this._.page_context = val;
        }
    },

    // may change the controls access functions, but seems simple and OK for the moment to wrap them like this.

    // will just be adding to the content.

    '_add_control': function (new_content) {
        //var content = this.get('content');


        // The controls array being an ID'd and indexed collection.
        //  Everything in there has an ID.
        //  So needs a page_context.
        //  Seems a little inconvenient.
        //  But will solve the problem for the moment.



        //return content.add(new_content);
        return this.get('content').add(new_content);
    },
    'add': function(new_content) {

        //console.log('new_content', new_content);

        // Will also turn XML strings describing jsgui controls/content into controls/content.

        var tnc = tof(new_content);
        //console.log('control add content tnc', tnc);

        if (tnc == 'array') {
            var res = [], that = this;
            each(new_content, function(i, v) {
                res.push(that.add(v));
            });
            return res;
        } else {

            if (new_content) {
                if (!new_content._context) {
                    if (this._context) {
                        new_content._context = this._context;
                    }
                }
                var inner_control = this.get('inner_control');


                //console.log('inner_control', inner_control);

                // Does it add a Data_Object successfully?

                // Could adding this cause content inside the content that's being added to duplicate?

                if (inner_control) {
                    return inner_control.get('content').add(new_content);
                } else {
                    return this.get('content').add(new_content);
                }
            }


            /*
            console.log('add context: ' + this._context);
            if (this._context) {
                if (tof(new_content) == 'string') {

                } else {
                    new_content._context = this._context;
                }
            }
            */

            //console.log('pre content add');
            //return content.add(new_content);

            // also, want to set the index of the new_content.
            //  The content could be a string...
            //   no need to set the index then.

            //  If the content is a control, we want to set a property for that control.
            //   Control should know what its parent control is.



            // OK, but does puttint it into that collection automatically set its parent in some way?

            // Maybe listen out for content being added.
            //  So we can do content.add rather than just .add, and it updates the parent and index values.

            // Could check for an inner control.

            // Also could instantiate the content if it is abstract.
            // Also could express content as JSON in some cases.
            //  Possibly could add XML.



            // Possibly inner controls will be used when a control has got scrollbars.
            //  However, what if there are multiple overlapping reasons for having such inner controls?

            // Not sure of what examples where that will happen.
            //  A Window control already makes use of inner_control.
            //  It makes sense to have the scrollbars operate within a known outer area.
            ///  ????? but will it fit right on the screen?

            // Possibly make it so that controls that have an InnerConrol always need to be prepared to have scrollbars outside of that inner_control.

            //  Could also have something specifying that the inner_control is acting as a clipping_area in accordance with the scrollbars and a specified size.

            // Quite a lot of controls could have content that is longer than normally fits.
            //  Should test a variety of controls with scrollbar.























            // then it should know it's been added, and update the DOM.
            //  should render the control to the DOM too.


        }

        //var content = this.get('content');

        // but the context of the new control should be set.

        // Carousel Button
        //  Carousel button Selector
        //  In horizontal mode.

        //throw 'stop';

        // won't need to apply the context automatically... but maybe if the object does not already have one.


        //console.log('post content add');
    },

    'insert_before': function(target) {
        //console.log('target', target);

        //console.log('pre find parent');
        //throw 'stop';

        // The parent of a content Collection being a Control?
        //  Probably makes sense.


        var target_parent = target.parent().parent();

        //console.log('target_parent', target_parent);

        var target_index = target._index;

        //console.log('target_index', target_index);

        // insert into the content collection.

        var content = target_parent.get('content');

        content.insert(this, target_index);

        // An enhanced / activated control needs to listen for content change in particular.





        //console.log('');
        //console.log('target', target);

        // Controls need to better keep track of their index within the parent, and what their parent control is.
        //  Adds a bit of effort to keep track of what the indexes are.
        //  It's worth having the controls stay aware of what their index is where possible.

        // This 'parent' and relationship info could be integral to Data_Objects and Collections, not just Controls.

        //throw 'stop';
    },

    'stringify': function () {
        var res = [];
        res.push('Control(' + stringify(this._) + ')');
        return res.join('');
    },
    'style': fp(function(a, sig) {
        // For the moment, this should be a convenient way of updating the dom attributes style.

        //  This could do the document update or not....

        var style_name, style_value, modify_dom = true;

        if (sig == '[s]') {

            // Best not to refer to the computed styles probably?
            //  Really want to interact with inline styles here.

            // maybe have some syntax for computed styles, such as .style('computed', style_name);
            //  Or just don't have it, get it from the element if needed.




            // Want to get a style value.
            //  This could get fairly complicated when getComputedStyle is not around, in older browsers.

            // May have a system to read through a stylesheet and work out what would get applied to an element

            // For the moment, will look at style of control property (need to develop that more).

            var styleName = a[0];
            //console.log('get style ' + styleName);

            var el = this.get('dom.el');

            // Should probably return a copy of the style, not read from the DOM.

            var res = getComputedStyle(el)[styleName];
            return res;


        }


        //console.log('style sig ' + sig);

        if (sig == '[s,s,b]') {
            var styleName = a[0];
            var styleValue = a[1];

            // Modify dom by default if there is a DOM.


            var modifyDom = a[2];

        };

        if (sig == '[s,s]' || sig == '[s,n]') {
            var styleName = a[0];
            var styleValue = a[1];

            // rebuild the css style???
            //  May just be in the dom attributes as well.

            //var das = this._.dom_attributes._.style;
            //console.log('das', das);

            //var da = this._.dom._.attributes;
            //console.log('da', da);




            // Modify dom by default if there is a DOM.
            //var modifyDom = a[2];

        };




        /*
        if (sig == '[s,s,b]') {
            var styleName = a[0];
            var styleValue = a[1];

            // Modify dom by default if there is a DOM.


            var modifyDom = a[2];

            var style = this.get('dom.attributes.style');


           // console.log('style ' + style);

            if (!style) {
                this.set('dom.attributes.style', styleName + ':' + styleValue + ';');
            } else {
                // parse the style attribute

                // can't do such a simple split, need to split in a way that avoids semicolons such as in a url?

                // try semicolon split.

                if (tof(style) == 'data_value') style = style.value();

                var map_style = parse_style_attribute_to_map(style);
                //console.log('map_style ' + stringify(map_style));


                map_style[styleName] = styleValue;

                var str_style = style_attribute_map_to_string(map_style);

                this.set('dom.attributes.style', str_style);


                //throw 'stop';
            }

            // Should modigy the DOM by default I think.
            if (modifyDom) {
                var style = this.get('dom.attributes.style');
                var el = this.get('dom.el');

                if (el) {
                    el.style.cssText = style;
                }
            }

        }
        */

        if (styleName && typeof styleValue !== 'undefined') {
            //var styleName = a[0];
            //var styleValue = a[1];

            // dom.attributes.style - as a normal data_object?
            //  Or a particular type of attribute that is dealt with differently?


            // Need to set the inline css dict

            // will update the dom attributes string from the style?
            //  will set an item in the inline_css_dict

            this._icss[styleName] = styleValue;

            // then rebuild the dom attributes style from that one.

            // produce the inline css from that dict...

            //console.log('styleName', styleName);

            var str_css = '';
            //var first = true;
            each(this._icss, function(item_style_value, item_style_name) {
                //if (!first) {
                //    str_css = str_css + '';
                //}
                str_css = str_css + item_style_name + ':' + item_style_value + ';';
            })
            //console.log('str_css', str_css);


            if (modify_dom) {
                this.set('dom.attributes.style', str_css);
            }

        }
        var that = this;


        if (sig == '[o]') {

            // could recompute the whole style string in a more optimized way.
            //  there could also be a style map, that would help in storing and checking particular styles.



            each(a[0], function(v, i) {
                //console.log('v', v);
                //console.log('i', i);
                that.style(i, v, false);
            });

            var style = this.get('dom.attributes.style');

            var el = this.get('dom.el');

            if (el) {
                el.style.cssText = style;
            }


        }


    }),
    'active': function() {
        // only on the server.
        //  Not necessarily!
        //  Perhaps client-side rendering should render the jsgui id. That is really necessary.
        //  However, perhaps should not use active to do this.


        //console.log('');
        //console.log('active');
        var id = this._id();

        //var domAttributes = this.get('dom.attributes');

        //domAttributes.set('data-jsgui-id', id);
        //domAttributes.set('data-jsgui-type', this.__type_name);


        // Longer code version...
        var dom = this._.dom;


        //console.log('this', this);

        var dom_attributes = this._.dom._.attributes;
        if (!dom_attributes) {
          dom_attributes = dom.get('attributes');
          //dom_attributes.set('data-jsgui-id', id);
          //dom_attributes.set('data-jsgui-type', this.__type_name);
          //console.log('dom_attributes', dom_attributes);
          //dom_attributes._['data-jsgui-id'] = new Data_Value({'value': id});
          //dom_attributes._['data-jsgui-type'] = new Data_Value({'value': this.__type_name});
        } else {

        }
        //console.log('dom_attributes', dom_attributes);
        //throw 'stop';
        dom_attributes._['data-jsgui-id'] = new Data_Value({'value': id});
        dom_attributes._['data-jsgui-type'] = new Data_Value({'value': this.__type_name});
        //var el = this._.el || dom._.el;
        var el;

        if (dom._.el) {
            el = dom._.el._;
        }

        if (el) {
          //console.log('el', el);
            //console.log('el.nodeType', el.nodeType);

            if (el.nodeType === 1) {
                el.setAttribute('data-jsgui-id', id);
                el.setAttribute('data-jsgui-type', this.__type_name);
            }


        }






        // Then update the DOM?




        // Calls active on the inner controls.

        //
				var tCtrl;

        this.get('content').each(function(i, ctrl) {
            //console.log('active i', i);

            tCtrl = tof(ctrl);
            //console.log('tCtrl', tCtrl);
            if (tCtrl === 'control') {
                ctrl.active();
            }
        });

        // need to listen to content change.


    },

    // So I think the resource-pool will have a selection scope.
    'find_selection_scope': function() {
        //console.log('find_selection_scope');

        var res = this.get('selection_scope');
        if (res) return res;

        // look at the ancestor...

        var parent = this.get('parent');
        //console.log('parent ' + tof(parent));


        if (parent) return parent.find_selection_scope();

    },

    'click': function(handler) {
        // Adding the click event listener... does that add it to the DOM?

        this.add_event_listener('click', handler);
    },
    'hover': function(fn_in, fn_out) {
        this.add_event_listener('mouseover', function(e) {
            //console.log('hover mouseover');
            fn_in();
        })

        this.add_event_listener('mouseout', function(e) {
            //console.log('hover mouseout');
            fn_out();
        })
    },



    'add_class': function(class_name) {
        // Should have already set these up on activation.
        //console.log('Control add_class ' + class_name);
        var cls = this.get('dom.attributes.class');
        //console.log('cls ' + cls);
        var el = this.get('dom.el');

        //console.log('add_class el ' + el);
        if (!cls) {

            this.set('dom.attributes.class', class_name);


            // as well as that, need to have the class in the doc respond to this chaging.
            //  event listener listening for dom changes will update this.

            //if (el) el.className = class_name;

        } else {
            var tCls = tof(cls);
            //console.log('tCls ' + tCls);
            if (tCls == 'object') {
                //cls
                cls[class_name] = true;
                // then get the classes from the obj

                var arr_class = [];
                each(cls, function(i, v) {
                    if (v) arr_class.push(i);
                })
                var str_class = arr_class.join(' ');
                el.className = str_class;
            } else if (tCls == 'data_value') {
                var val = cls.value();

                var arr_classes = val.split(' ');
                var already_has_class = false, l = arr_classes.length, c = 0;
                while (c < l &! already_has_class) {
                    if (arr_classes[c] == class_name) {
                        already_has_class = true;
                    }
                    c++;
                }
                if (!already_has_class) {
                    arr_classes.push(class_name);
                }
                var str_cls = arr_classes.join(' ');
                //console.log('str_cls', str_cls);
                this.set('dom.attributes.class', str_cls);

               //this.add_class(val);
                // And the DOM should update itself when one of these 'model' objects gets changed - depending on if its activated or not.


            } else if (tCls == 'string') {
                var arr_classes = cls.split(' ');
                var already_has_class = false, l = arr_classes.length, c = 0;
                while (c < l &! already_has_class) {
                    if (arr_classes[c] == class_name) {
                        already_has_class = true;
                    }
                    c++;
                }
                if (!already_has_class) {
                    arr_classes.push(class_name);
                }
                var str_cls = arr_classes.join(' ');
                //console.log('str_cls', str_cls);
                this.set('dom.attributes.class', str_cls);
                // And the DOM should update itself when one of these 'model' objects gets changed - depending on if its activated or not.


            }
        }
        //throw 'stop';

    },

    'remove_class': function(class_name) {
        //console.log('remove_class ' + class_name);


        var cls = this.get('dom.attributes.class');
        //console.log('cls ' + stringify(cls));
        var el = this.get('dom.el');
        //console.log('el', el);
        if (cls) {
            var tCls = tof(cls);
            //console.log('tCls', tCls);
            //throw 'stop';
            if (tCls == 'object') {
                //el.

                // go through it again, building the class string...
                var arr_class = [];
                each(cls, function(i, v) {
                    //if (v) arr_class.push(i);
                    if (i == class_name) cls[i] = false;
                    if (cls[i]) arr_class.push(i);
                })
                var str_class = arr_class.join(' ');
                this.set('dom.attributes.class', str_cls);
                //el.className = str_class;

                //console.log('str_class ' + str_class);
            }
            if (tCls == 'string') {
                //console.log('cls', cls);
                var arr_classes = cls.split(' ');
                var arr_res = [];
                var l = arr_classes.length, c = 0;
                //console.log('arr_classes', arr_classes);
                while (c < l) {
                    if (arr_classes[c] != class_name) {
                        //already_has_class = true;
                        arr_res.push(arr_classes[c]);
                    }
                    c++;
                }
                //console.log('arr_res', arr_res);
                var str_cls = arr_res.join(' ');
                //console.log('str_cls ', str_cls);
                this.set('dom.attributes.class', str_cls);

                //console.log('str_cls ' + str_cls);
                //throw 'stop';
            }

            // and if it's a data value, do similar...

            if (tCls == 'data_value') {
                var cls2 = cls.value();

                var arr_classes = cls2.split(' ');
                var arr_res = [];
                var l = arr_classes.length, c = 0;
                //console.log('arr_classes', arr_classes);
                while (c < l) {
                    if (arr_classes[c] != class_name) {
                        //already_has_class = true;
                        arr_res.push(arr_classes[c]);
                    }
                    c++;
                }
                //console.log('arr_res', arr_res);
                var str_cls = arr_res.join(' ');
                //console.log('str_cls ', str_cls);
                this.set('dom.attributes.class', str_cls);

                //console.log('str_cls ' + str_cls);
            }

        }
    },

    'hover_class': function(class_name) {
        // Though this is a behaviour...
        //  could make this work through the behaviour system?
        //  could make the behaviour system work with this.
        //   This one seems fairly simple, lower level than behaviour system.

        // but in the group... when hover_class gets called for the group, it needs to be active on the group....

        // When targeting a group as well...
        //  May need to give groups a bit more thought.

        // But hover_class seems useful at least.


        var that = this;
        that.hover(function(e_in) {
            that.add_class(class_name);
            //ctrl_key_close_quote.add_class(hover_class);
        }, function(e_out) {
            that.remove_class(class_name);
            //ctrl_key_close_quote.remove_class(hover_class);
        })


    },

    'find': function(selector) {

    },
    'children': fp(function(a, sig) {
        var selector;

        if (sig == '[s]') {
            selector = a[0];
        }




    }),

    'matches_selector': function(selector) {

    },

    // Want to see if an element (or control) is a descendant of this.
    //  If this is an ancestor of element or control. is_ancestor_of
    // will go through DOM parent nodes or control parents.

    'is_ancestor_of': function(target) {
        var t_target = tof(target);
        console.log('t_target', t_target);

        var el = this.get('dom.el');

        var inner = function(target2) {

            if (target2 == el) {
                return true;
            }
            var parent = target2.parentNode;
            if (!parent) {
                return false;
            }  else {
                return inner(parent);
            }

        }

        if (t_target == 'object') {
            if (el != target) {
                var parent = target.parentNode;
                if (parent) {
                    return inner(parent);
                }
            }

        }
    },

    'find_selected_ancestor_in_scope': function() {
        // same selection scope
        // is this one already selected?
        // best not to check....

        var s = this.get('selection_scope');


        var parent = this.get('parent');
        //console.log('parent ' + parent);

        var ps = parent.get('selection_scope');

        if (s == ps) {
            // Probably would be much more convenient to get a data value just as its value,
            //  or have a more convenient data value idiom.
            var psel = parent.get('selected');
            if (psel && psel.value && psel.value() == true) {
                //throw 'stop';

                return parent;
            } else {
                return parent.find_selected_ancestor_in_scope();
            }
        }


        //throw 'stop';


    },

    'remove': function() {
        var el = this.get('dom.el');
        if (el) {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        }
    },

    'shallow_copy': function() {
        console.log('Control shallow_copy');

        var res = new Control({
            'context': this._context
        });


        // need to get setting of one data object to another correct.
        //  That looks like a lower level piece of functionality that needs attention.

        // For the moment, want to get some kind of shallow copy working.

        //res.set('dom.attributes', this.get('dom.attributes'));

        var da = this.get('dom.attributes');
        var cl = da.get('class');

        console.log('cl ' + stringify(cl));
        console.log('cl ' + tof(cl));

        var map_class_exclude = {
            'bg-light-yellow': true,
            'selected': true
        }

        each(cl, function(i, v) {
            if (i && !map_class_exclude[i]) res.add_class(i);
        })

        var res_content = res.get('content');

        this.get('content').each(function(i, v) {
            console.log('v ' + v);
            //console.log('v ' + stringify(v));
            console.log('tof v ' + tof(v));

            if (tof(v) == 'data_value') {
                res_content.add(v.value());
            } else {
                res_content.add(v.shallow_copy());
            }


        })

        return res;
    },

    // May be good having _size
    //  or _measuredSize
    //  want to measure the control at a suitable time.

    // Should probably be in html-enh instead.
	//
    //  Though with size as a field, it could bypass this particular function.


    //  Won't use this function for the moment.
    //   Want to use some of the Data_Object capabilities to set / get / output the size.
    //   Will also have controls listen for a change in their size property

    /*

    'size': fp(function(a, sig) {
        console.log('size sig', sig);


        // Would it be worth using the input processors system?
        //  Would turn it into a string.
        //  Would then be able to give the styling necessary?
        // Or to have the more generic jsgui representation of the size internally, and then to represent that in the DOM.

        // Using the more complicated input processing system would help with size and some other properties.
        //  Would help the code in these parts to be more concise.

        // However, for the moment, directly getting access to some properties would be useful.

        // Having a size property, or field for controls would be useful.
        //  It would render using CSS, and its value would be loaded from CSS.

        // The size would be an internal property of the jsgui controls, and they will be addressable like .size.width, .size[0]
        //  As an indexed array there will be the logic needed to input / output the internal size value to / from a variety of formats.

        // And the system could have data that tells it which css properties are to be synced with the size property.



        if (sig == '[]') {
            var el = this.get('dom.el');

            var w = parseInt(getStyle(el, 'width'), 10);
            var h = parseInt(getStyle(el, 'height'), 10);
            var res = [w, h];
            return res;
        }
        if (sig == '[a]') {
            // set the size.
            //  will be done through CSS height and width.
            //console.log('a[0]', a[0]);
            this.style({
                'width': a[0][0] + 'px',
                'height': a[0][1] + 'px'
            });
        }
    }),

    */

    // Likely to directly use fields, data types and input_processors.
    //  Will have it somewhat automatic / abstract, so there is not much code to specifically handle some CSS/HTML/DOM things, but there is a definition of what the
    //  data formats are, and it works out or is told how to do translations between that internal representaion, and the formats it may be given, and may need to output.


    // 01/03/2016
    //  Better for color to be handled by the input and output processing systems and fields.
    //  Not using a function within the Control definition space.
    //  .size works like this already. Should be similar.
    ///  ??? or not???



    'color': fp(function(a, sig) {

			// It may be worth having a color field.
			//  And that color field gets listened to, and DOM changes get made from that.



        console.log('color sig ', sig);
      // Should probably try to use color input and output processors.

      var input_processor = jsgui.input_processors['color'];
      //console.log('input_processor', input_processor);

			var output_processor = jsgui.output_processors['color'];
      //console.log('output_processor', output_processor);

      if (sig == '[]') {
          var el = this.get('dom.el');

          //var w = parseInt(getStyle(el, 'width'), 10);
          //var h = parseInt(getStyle(el, 'height'), 10);
          //var res = [w, h];
          //return res;
      }
      if (sig == '[a]') {
        var processed = input_processor(a[0]);
        //console.log('processed', processed);

        this.set('color', processed, false); // false not to raise change event from it?

        var html_color = output_processor(processed);

        //console.log('html_color', html_color);

        var color_property_name = this.__color_property_name || 'background-color';

        this.style(color_property_name, html_color);

      }

    }),



    'offset': fp(function(a, sig) {
        if (sig == '[]') {
            var el = this.get('dom.el');
            var res = [el.offsetLeft, el.offsetTop];
            return res;
        }
        if (sig == '[a]') {
            this.style({
                'left': a[0] + 'px',
                'top': a[1] + 'px'
            })
        }
    }),

    'clear': function() {
        // clear all the contents.
        // ui should react to the change.

        return this.get('content').clear();

    },

    'activate': function() {
        // Do nothing for basic control I think.
        //  Possibly will be doing some things depending on discovered properties.

        // Need to work more on heirachy in activation.
        //  Want html documents (and pretty much everythin else) to use the enhanced activation.
        //  Should be OK having that in the dependency chain on the server, much of the code won't be called though.

        // Or, enhance the activations of the prototypes?
        //  I'd prefer to have the enhancements become higher up the chain.





    }

    // shallow_copy
    //  would make a copy of the controls and its contents.





    // add event listener...
    //  will be for the dom events.
    // dom.listeners?




    //





});


var p = Control.prototype;
//p._ = p._ || {};
//p._.type_name = 'control';

p._data_generators = {
    'context_id': function () {
        // this is the control
        //  the control should have access to a page_context?

        // Controls on the server are likely to need this for rendering right (different contexts).

        // On the client could refer to jsgui.page_context

        // could refer to jsgui.page_context, if it is there.
        //  Otherwise it would have to be a property of the control.
        //console.log('this.set ' + this.set);
        var page_context = this.page_context();
        var id = page_context.ensure_ctrl_id(this);
        return id;
    },
    'control_collection': function () {
        var res = new jsgui.DataCollection();
        return res;
    }
};

var initializing = false, fnTest = /xyz/.test(function() {
    xyz;
}) ? /\b_super\b/ : /.*/;

Control.prototype._module_jsgui = jsgui;

Control.extend = function(prop, post_init) {
    var _super = this.prototype;
    initializing = true;
    var prototype = new this();
    var for_class = {};
    initializing = false;
    if (typeof prop === 'string') {
        var data_type_name = prop;
        var dtis = jsgui.data_types_info;
        var data_type_info = dtis[data_type_name];
        for_class[data_type_name] = data_type_name;
        for_class[data_type_info] = data_type_info;
        prototype['__type_name'] = data_type_name;
        prototype['__data_type_info'] = data_type_info;
        prop = {};
    }
    var prop_item, t_prop_item, tmp, name, res;
    for (name in prop) {
        prop_item = prop[name];
        if (name.charAt(0) === '#') {
            prototype[name.substring(1)] = prototype[prop_item];
        } else {
            t_prop_item = typeof prop_item;
            if (t_prop_item === 'function') {
                prototype[name] = typeof _super[name] === 'function' && fnTest.test(prop_item) ?
                (function(name, fn) {
                    return function() {
                        tmp = this._super;
                        this._super = _super[name];
                        //console.log('pre apply function ' + name);
                        res = fn.apply(this, arguments);
                        this._super = tmp;
                        return res;
                    };
                })(name, prop[name]) : prop[name];
            } else if (t_prop_item === 'object' || t_prop_item === 'boolean') {
                if (name == 'class_name') {
                    for_class['_class_name'] = prop_item;
                } else if (name == 'fields') {
                    for_class['_fields'] = prop_item;
                } else if (name == 'connect_fields') {
                    for_class['_connect_fields'] = prop_item;
                } else {
                    prototype[name] = prop[name];
                }
            }  else {
                prototype[name] = prop[name];
            }
        };
    };
    var Class = function() {
        if (!initializing) {
            if (this.init) {
                var that = this;
                var the_make_function = function(abstract_control) {
                    // needs to create a real control out of an abstract one.
                   // var instance = new abstract_control

                   //console.log('the make function');
                   //console.log('abstract_control', abstract_control);
                   //console.log('abstract_control.constructor', abstract_control.constructor);

                   var spec = abstract_control._spec;
                   spec.abstract = null;
                   spec._abstract = null;
                   spec.context = that._context;
                   //console.log('that._context', that._context);
                   var instance = new abstract_control.constructor(spec);
                   //throw 'stop';

                   return instance;


                };

                var the_add_function = function(abstract_control) {
                    var instance = the_make_function(abstract_control);
                    return that.add(instance);
                }

                var l = arguments.length;
                var a2 = new Array(l + 2);
                for (var c = 0; c < l; c++) {
                    a2[c] = arguments[c];
                }
                a2[l] = the_add_function;
                a2[l + 1] = the_make_function;

                this.init.apply(this, a2);
                if (this.post_init) {
                    //this.post_init();
                    this.post_init.apply(this, arguments);
                }
                if (post_init) {
                    post_init.call(this);
                }
            } else {
                var spec = arguments[0] || {};
                spec.abstract = true;
                return new Class(spec);
            }
        }
    };
    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    Class.extend = arguments.callee;
    for (i in for_class) {
        Class[i] = for_class[i];
    }
    if (Class['class_name']) {
        jsgui.map_classes[Class['class_name']] = Class;
    }
    Class._superclass = this;
    return Class;
};



// function to set up access functions on a prototype?
//  aliases?
//  access functions in particular here.

// Need to do more about rebuilding the framework with the new property system.
//  Will have encapsulated a lot into lang from html, making things easier here.

// lang/prototype_access

// Likely to be changed through use of the Data_Object

// Do we have a style variable?

var prototype_access = function (p, variable_name, fn_name) {

    p[fn_name] = fp(function (a) {

        //console.log('this. ' + stringify(this._));

        if (a.l == 1) {
            //var val = a[0];
            return this.set(variable_name, a[0]);
        } else {
            return this.get(variable_name);
        }
    });
}

var p = Control.prototype;

// This system works quite nicely now.
//  Allows simple functional access to these properties.

// prototype_access(p, 'index', 'index');
//prototype_access(p, 'id', 'id');
prototype_access(p, 'dom.tagName', 'tagName');
prototype_access(p, 'dom.attributes', 'domAttributes');
//prototype_access(p, 'controls', 'controls');


//prototype_access(p, 'style', 'style');

// access to the dom node as well.

// domAttributes

//p._tag_name = 'div';

var map_Controls = {};



//jsgui = {};
//jsgui.Core = Core;






// Own tof function for this section that checks instanceOf Control.

/*
var old_tof = jsgui.tof;

jsgui.tof = function (obj) {
    var res = old_tof(obj);
    if (obj instanceof Control) res = 'control';
    return res;

};
*/

// Also need to get this loading (automatically) as a client-side component.



// make it so that there is head.title(),
// also title() method for a basic HTML document.

// these should support text inside them.
// the 'text' property could do something different for different things.

// text_property('div span h1 h2')
// a property that represents a textNode inside.

// text property - will work as a property called text.
//  however, when the text has been set/changed, it changes text in a textNode.
// This text property should be a convenient interface to that text node.

// I think that means we need a textNode.

// Will have a dom.nodeType property.
//  Most things will be 1 (element)
//  Attribute node 2
//  Text node 3

// The properties indeed have greatly shortened this code.
//  Likely to put the new property system into the full library when more fully defined.
//  Or likely to put the full lib's capabilities into this, a new version of it?

// The new property system looks set to save on a lot of code. So much of the code is currently dealing with the mechanics of property values.

// Again, will change through use of the Data_Object
// and the control init function?
//  it's call

var ctrl_init = Control.prototype.init;
var ctrl_init_call = Control.prototype.init.call;

var escape_html_replacements = [
        [/&/g, '&amp;'],
        [/</g, '&lt;'],
        [/>/g, '&gt;'],
        [/"/g, '&quot;'], //"
        [/'/g, '&#x27;'], //'
        [/\//g, '&#x2F;']
    ];
//var single_replacement;

var escape_html = function (str) {

    //console.log('tof(str) ' + tof(str));

    //console.log('escape_html str ' + str);
    //console.log('tof str ' + tof(str));


    if (tof(str) === 'data_value') str = str.get();
    if (tof(str) === 'number') str = str + '';

    //console.log('tof(str)', tof(str));

    if (typeof str === 'undefined') {
      str = '';
    } else {
      var single_replacement;
      for (var c = 0, l = escape_html_replacements.length; c < l; c++) {
          single_replacement = escape_html_replacements[c]
          str = str.replace(single_replacement[0], single_replacement[1]);
      }
    }

    //

    // str.replace(/microsoft/gi, "W3Schools")
    /*
    var res = str.replace(/&/g, '&amp;');
    res = res.replace(/</g, '&lt;');
    res = res.replace(/>/g, '&gt;');
    res = res.replace(/"/g, '&quot;');
    res = res.replace(/'/g, '&#x27;');
    res = res.replace(/\//g, '&#x2F;');
    */

    //var replacements =

    //each(escape_html_replacements, function (i, v) {
    //    str = str.replace(v[0], v[1]);
    //});

    return str;
};


jsgui.Text_Node = jsgui.textNode = Control.extend({
    'init': function (spec) {


        spec = spec || {};
        this._super(spec);

        if (typeof spec == 'string') {
            //this._.text = spec;
            //this.innerHtml = spec;
            spec = {
                'text': spec
            };
        }

        spec.nodeType = 3;
        //this.ensure('_');

        /*
  	if (spec.text) {
		this._.text = spec.text;
		//this.innerHtml = spec.text;
		spec = {};
	}
  	*/
        //this.no_escape = spec.no_escape || false;
        // another property from the spec? I think this property could fit in with an MVC (or MMVC) pattern where changes lead to updates in the HTML without
        // needing much programming for each change. 2/3 of this class could be removed if using different OO.

        /*
  	if (spec.no_escape) {
  		this.ensure('_');
  		this._.no_escape = spec.no_escape;
  	}
  	*/
        //ctrl_init_call(this, spec);

        //this._super(spec);

        if (typeof spec.text != 'undefined') {
            this._.text = spec.text;
        }

        //this.typeName = pr.typeName;
        //this.tagName = 'p';

    },
    // will use a no-escape property.
    /*
  'no_escape': fp(function(a, sig) {
  	if (a.l == 0) {
  		return this.ret('_.no_escape');
  	}
  	if (a.l == 1) {
  		this.ensure('_');
  		this._.no_escape = a[0];
  	}
  }),
  */
    'all_html_render': function () {
        // need to escape the HTML it outputs.



        //var text = this._.text || '';
        var text = this.get('text');
        // These get and set operations should not rely on the page_context.

        //console.log('text ' + text);

        var nx = this.get('no_escape');


        //console.log('nx ' + nx);

        if (nx) {
            res = text || '';
        } else {
            //console.log('text', text);
            res = escape_html(text || '') || '';
        }

        return res;
    }
    /*,

    // will have a text property.

    'text': function(text) {
    	// need to update the text in the dom.
    	this._.text = text;
    	// use jQuery for this?
    	// or DOM?
    	// not sure jQuery handles text nodes directly so well.

    	// is there this.$?

    	// do these text nodes get recreated?
    	//  they can't have the jsgui expando like elements.

    	// can not so easily get this text node activated on the client.

    	//  what about the ability to get / identify text nodes from their parent?
    	//  so that a parent could be told what active text node it contains.

    	// can tell a span control to change the text it contains.

    	//.text_nodes(0).text...
    	//  having a ctrl keep track of any text nodes inside them
    	//   modelling them, having controls.
    	//   however, don't want lots of complications.



    	// just innerHTML?

    }
    */
});



// And there is some client code that loads the necessary jsgui tools and then activates all the controls in the DOM.
//  Will do a DOM traverse, except start with the deepest nested elements.
//   Then it will be able to find controls inside controls.
//   A lot of elements will have JSGUI IDs.
//    But some things could be inferred to be controls because they follow a pattern.


// Page_Context needs a new_id method.


// I think some of this should be in Client_Page_Context
//  Perhaps Page_Context in its own module.

// Should this only be in enhanced?
//  So it creates enhanced controls?
//   Will that be OK for the server page context?


// Maybe should not need to get browser info yet? Keep it general???
// Perhaps there will be html-client.
//  Will have the ctrls_by_id? The page_context.
// Activating existing DOM nodes is easy enough without this activation system - just needs code to do it.
//  But having the nodes created on the server, then sent to the client - requires the JSGUI IDs or other reconstruction code.
// This does seem almost done for many uses - want to polish it though.
// Want to make a blog site fairly soon.

// Also a system for displaying content and programming snippets.
// Much of it would be server side, not needing client side activation.
//  Login could use it for enhancement.

// Can set the data_object constructor for boolean...
//  and it is a Data_Value.

// Seems like it should be within a client side page context.

// Do this within the Page_Context.
/*
var map_controls_by_type = {};


var update_ctrl_lookup = fp(function(a, sig) {
    console.log('update_ctrl_lookup sig ' + sig);
    var Module;
    if (a.l == 1) {
        Module = a[0];
        each(Module, function(ctrl_name, Ctrl) {
            console.log('ctrl_name ' + ctrl_name);
            var lName = ctrl_name.toLowerCase();
            map_controls_by_type[lName] = Ctrl;
            console.log('** map_controls_by_type ' + JSON.stringify(map_controls_by_type));
        })
    }

    if (sig == '[s,f]') {
        var name = a[0];
        var Ctrl = a[1];
        map_controls_by_type[name] = Ctrl;
    }
    console.log('* map_controls_by_type ' + JSON.stringify(map_controls_by_type));

});
*/


// Maybe the jsgui page context will be the key to getting this running on the client.
//  Could package some things as jquery plugins. Maybe have a standalone build of jsgui.



// Perhaps it will be context.activate?


// context.activate?
//  that may work better.

// Need more generalised recursive dom activation.
//  When activating a control recursively, need to go through all of the sub-elements
//   activate them from the inside.



var shallow_copy = fp(function(a, sig) {
    if (sig == '[a]') {
        var arr_ctrls = a[0];

        var res = [];
        each(arr_ctrls, function(i, v) {
            res.push(v.shallow_copy());
        });
        return res;
    }
});

var constructor_from_type = function(type) {
    console.log('constructor_from_type type ' + type);
    console.log('map_controls_by_type ' + stringify(map_controls_by_type));
}
//

jsgui = jsgui.extend(jsgui, {
    'get_inline_css_dict_from_style': get_inline_css_dict_from_style,
    'apply_jsgui_style_rule_to_css_style': apply_jsgui_style_rule_to_css_style,
    'styles_dict_to_string': styles_dict_to_string,
    'Control': Control,
    //'Page_Context': Page_Context,
    //'Blank_HTML_Document': Blank_HTML_Document,
    //'Client_HTML_Document': Client_HTML_Document,
    //'recursive_dom_iterate': recursive_dom_iterate,
    'map_Controls': map_Controls,
    //'update_ctrl_lookup': update_ctrl_lookup,
    //'activate': activate,
    'shallow_copy': shallow_copy
    //'constructor_from_type': constructor_from_type,
    //'map_controls_by_type': map_controls_by_type
});
//alert('2 ' + jsgui);
//return jsgui;
module.exports = jsgui;
