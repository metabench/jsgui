/**
 * Created by James on 01/10/2014.
 */

/**
 * Created by James on 01/10/2014.
 */
/**
 * Created by James on 30/09/2014.
 */

/**
 * Created by James on 04/08/2014.
 */


var jsgui = require('../../jsgui-html');
//var Multi_Layout_Mode = require('./multi-layout-mode');
var List = require('./list');
var Button = require('./button');
var Flexidoc_Container = require('./flexidoc-container');

var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
var Control = jsgui.Control, Page_Control = jsgui.Page_Control;

// Much of this will be client-side, but will do a decent rendering server-side.

// May be worth making Flexidoc_Editor_Main
//  That would have the various containers.
//  It would start with one container
//   The user would then drag something (such as a text box) from the tools / misc area, into the container.

// Different layouts for different screen sizes
//  Will allow intelligent rearrangement where possible, but also allow the user to specify things
//  Would make the 1024 width layout, then work from there, changing it for other sizes
//   In some cases could even interpolate between them
//    But I think work with a few minimum screen widths (with their implied ranges).

// layout.min_width


var Flexidoc_Editor_Main = Control.extend({
    //'fields': {
    //    'web_admin': Object
    //},

    // Maybe should put this into a form, so that it does a form post.
    //  That could possibly be disabled.
    'init': function(spec) {

        this._super(spec);

        var that = this;

        this.set('dom.attributes.class', 'flexidoc-editor-main');
        this.__type_name = 'flexidoc_editor_main';

        if (!spec.el) {

            //var pool = this._context.pool;
            //var web_admin = pool.get_resource('Web Admin');

            // and if it's on the server only?

            // And render it initially with one container.
            // flexidoc-container

            // We could specify the container's width and number of columns
            //  Or it's column size and number of columns

            // Use toggle buttons in the misc area to switch between the layout modes.


            var container0 = new Flexidoc_Container({
                'context': this._context,
                'num_columns': 32,
                'column_width': 32
            });

            // 32 columns, each 32 pixels wide




            // Want to make this for 1024 width screens




            this.add(container0);

            this.active();


        }

    },
    'activate': function() {

        this._super();


    },
    'measure_client_offsets': function() {
        // Offsets for the containers
        //  Offsets for items / controls / components within the containers.

        var content = this.get('content');

        var res = [];



        content.each(function(i, ctrl) {
            console.log('ctrl', ctrl);

            // the measured offsets for the container
            //  this would include the measured offsets of the components inside it.

            var offset = ctrl.measure_client_offsets();
            res.push(offset);


        });

        return res;



    }
});
module.exports = Flexidoc_Editor_Main;