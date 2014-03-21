// The HTML module needs to use the lang module. It will extend the jsgui object and return it.
// Perhaps it is best to split this one up.
//   Maybe if its clearer where to draw the line
// There is the 'ctrl'
//  Descriptions of ctrl data and html / css
// Extensions from core to handle more HTML (textNode), and other controls that have been made.
// Keeping this in one file for the moment would help keep track of the size of html-specific code.
//  It is nice to see that there is not so much right now. The extensive language section will keep this simple.
// This has become much more concise. Need it to do event handling.
//  Perhaps could use jQuery to do so. However want this to be swappable.
//  Different builds - when using jQuery could hold wrapped elements in the controls.
//  Won't make so much difference using the $ function again if they are not wrapped though.
// PageContext may specify which way of doing things.
//  Likely to load in separate code when using older browsers.
// It's mainly for handling events though... perhaps this could be in the library itself.
// This is no longer just for the mobile browser - need this to be in general (assume good HTML), but can load in other toolkits if needed
//  like for IE or different event models.
// Was using 'this.$.bind'.
//  Could even get the bind function out of jQuery - it works nicely, maybe put that into the library.
//  Could have mobile-client (modern)
//  jsgui-browser-support-ie
//   a few modules.
//   maybe other browser support modules like jsgui-vector-vml
//   they could get built together and sent to the client as a smaller file.
// Making it so it does not assume there is jQuery
//  But assumes that there are some jsgui functions, like _dom_bind that work with the w3c API, could use jQuery.
// These functions would be really simple in the standard W3C html version but would use jQuery or some specific / extracted bind code from jQuery.
// This HTML module makes use of various lang features, making it much more concise than it would otherwise be.
// Will have other HTML controls as well. Would be nice to have them organized in an online system too, with the source code and perhaps resources linked together.
//  This implies more back-end work, but the control can really be represented as text (for the most part). With decent vector graphic rendering, controls probably
//  can just be stored as text. Being able to retrieve them on-the-fly would be useful, as would being able to load a bunch of them.
// Also, creating builds of jsgui for client devices with the needed controls built in.
//  Will get this highly optimized so that apps can get built using these controls with a small amount of JavaScript required in the final product.
// This definitely needs more work.
//  Will be doing more on the language parts of the framework to start with.
// The item selection example that I did that works very smoothly in IE6 was good from the data structure behaviour, but there was a lot of
//  'nothing' code, or code that copies data / sets an index value etc. With that in framework code, first using the data types, and then the
//  Collections system, the code will be much neater, and more efficient.
// My concern was that although I has a nice effect, the code was too big to have various other generalized effects like it.
//  That functionality would be instead integrated more neatly into the framework. Should be able to declare that a selection group gets indexed
//  according to the order in the group they have been selected from. Some things to do with set theory may be relevant too.
// This would get the code needed to do that down to a minimal amount.


    // needs to extend the core's data types.
    // may have function to do this that sets up the cached maps for those data types.

    // and extend some more native data types too?
    //  for handling dom nodes here?
    //  but can say it is an object with a few particular properties - can even define these. Could help with making a GUI or an IDE.

    // I think this information will become known as object_schema information?
    //  Or this is similar, this is not just about what data is there, but how the data is stored in indexes?
    //  Indexed_array seems like a useful type of data to be processing through routines that understand it.

    // These data types will be used for constraints as well.
    //  A field must match a constraint...

    // Will do more work on these constraints, and their types, outside of HTML as well.
    //  But won't be so hard to test them inside HTML.
    // Will be that it has various fields, with constraints set as the data type.
    //  This will be different to when the constraints are used for mapping to the database
    //   It would be interesting to see how some of these more complicated data types got mapped to the database.
    //    Could put their values in as strings, or could have some other sort of list where it maintains them in a sorted / indexed order, and keeps track of the
    //    ids for the list in a separate table. That seems like a more complicated way of doing things, and could be one of the transformation options.
    // Will be nice to store transformation options alongside the original domain model.

    // Will be integrating these data_types into Data_Objects.
    //  Will have plenty of the functionality happening on Data_Objects, with the Control functionality being for rendering.
    //  Data_Object funtionality will assist a lot in getting and setting properties with convenient syntax - will not require so much code specifically
    //   handling HTML in these instances, so the Control will be clearer and smaller. Versitile code available for other parts of the library too.

    // Some more specialised CSS3 features to be removed from here.

    // Data_Objects will be looking at the jsgui.data_types_info in order to configure themselves
    //  Not a JavaScript data type - more like a pseudo data type?
    //  Maybe call it data_type here.
    //   Will likely fit in with the __data_type or _data_type property.
    //   instanceof Data_Object will be a useful check in other instances.

    // Having Data_Objects that are able to tap into the jsgui.data_types_info will be very useful.
    //  Sub data_types...

    // Defining a data_type... will have some simpler ones, such as number, text.
    //  Will also specify that things are indexed, possibly unique.

    // a general interface for processing data_types... will be processing n_units etc.
    //  Likely to stop using nested... some of that is handled by Data_Object.
    //  Fields could take these data_types.

    // Quite a lot of the HTML / CSS processing will take place on an abstracted level.
    // Functionality from nested is going to be moved to data-object.
    //  Will have a simpler means of setting nested properties... will be a clear algorithm that makes use of Data_Object's capabilities.
    //  There may be Data_Objects at the different levels (maybe not?), these objects will store the various values.
    //   Nested Data_Objects does make more sense... but now I am wondering if it would really lead to performance / memory problems.
    //    Maybe best to do it, then optimize the Data_Objects.
    // Data_Objects here may be very useful for the flexibility.
    //  Sounds useful for when the properties actually are more complex, like with CSS transitions.

    // Data_Object with various fields...

    // input processors?
    // or data types as well?
    //  defining data_types, and they have input processors.

    // Can have a DataType object - name, in function, out function(s)
    //  will have different / overridable output functions.
    //   may be outputting as specific data types too.
    //    They have their internal representation as well.
    //     However, these are not in a class, they often will be arrays, and it will make it easier to process these objects of various specified types.
    // 02/09/2012 - Will need to do a fair bit more to get these controls working again.
    // But much is handled by the input and output functions.

    //jsgui.set('dti', 'hello');

    // Would use input processors for vector information.
    //  Want it so that it renders a simple vector image.

    // Could have it so that alpha is optional at the end...
    //  rgba color.
    //  But we can use color and opacity.
    //  Or rgba_color

    // Input processors and data_types_info...
    //  Need to move this out of HTML.
    // Could be part of DataObject?
    //  Except this is likely to use collections.
    // Within jsgui-lang-enh. Color could be useful there.
    /*

    extend(jsgui.data_types_info, {

        'color': ['indexed_array', [
            ['red', 'number'],
            ['green', 'number'],
            ['blue', 'number']
        ]],
        'oltrb': ['optional_array', ['left', 'top', 'right', 'bottom']],
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
        'control_collection': ['DataCollection', 'control'],

        // Defining the types that things will get automatically created as.
        'dom_attributes': {
            //'class': 'Ordered_String_List'
            'class': 'ordered_string_list'

        },

        // these are its fields.
        //  should be able to build a control_dom constructor function.
        'control_dom': {
            'node': 'object',
            'attributes': 'dom_attributes',
            'tagName': 'string'
        },
        'control': {
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
            'border': 'border',
            'margin': 'margin',
            // when dealing with 'any': there may need to be a map that says if a value is contained.
            //  could even store these maps in a tree. would use something like 'ensure'
            'cursor': ['any', ['auto', 'crosshair', 'default', 'e-resize', 'help', 'move', 'n-resize', 'ne-resize', 'nw-resize', 'pointer', 'progress', 's-resize', 'se-resize', 'sw-resize', 'text', 'w-resize', 'wait', 'inherit']]
        }
    });
    */

