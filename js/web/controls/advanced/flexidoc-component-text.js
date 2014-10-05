/**
 * Created by James on 01/10/2014.
 */

/**
 * Created by James on 01/10/2014.
 */


var jsgui = require('../../jsgui-html');
//var Multi_Layout_Mode = require('./multi-layout-mode');
var List = require('./list');
var Button = require('./button');
var Flexidoc_Component = require('./flexidoc-component');

var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
var Control = jsgui.Control, Page_Control = jsgui.Page_Control;

// Much of this will be client-side, but will do a decent rendering server-side.

// May be worth making Flexidoc_Editor_Main
//  That would have the various containers.
//  It would start with one container
//   The user would then drag something (such as a text box) from the tools / misc area, into the container.

var Flexidoc_Component_Text = Flexidoc_Component.extend({

    //'fields': {
    //    num_columns: Number,
    //    column_width: Number
    //},

    // Maybe should put this into a form, so that it does a form post.
    //  That could possibly be disabled.
    'init': function(spec) {

        this._super(spec);

        var that = this;

        //this.set('dom.attributes.class', 'flexidoc-component-text');
        this.add_class('text');

        this.__type_name = 'flexidoc_component_text';

        if (!spec.el) {

            var d_mode = this.get('mode');


            if (d_mode && d_mode.value() == 'icon') {
                this.add('Text');
            }

            //var num_columns = this.get('num_columns').value();
            //var column_width = this.get('column_width').value();

            /*
             this.style({
             //'background': 'linear-gradient(to right,#DDDDDD 1px,#FFF 1px,#FFF 28px)',
             'background': '-webkit-linear-gradient(left,#DDDDDD 1px,#FFF 1px,#FFF 28px)',
             'background-size': '36px 36px',
             'width': (num_columns * column_width) + 'px',
             'height': '120px'
             });
             */



            this.active();

            /*
             var active_fields = {
             'num_columns': num_columns,
             'column_width': column_width
             };

             this.set('dom.attributes.data-jsgui-fields', stringify(active_fields).replace(/"/g, "'"));
             */

        }

    },
    'activate': function() {

        this._super();

        // Here we define things so it's a drag/drop target.
        // Processes / triggers / responds to drag/drop events.

        // Want it so that various things can be dragged over from the misc / tools area.


    }
});
module.exports = Flexidoc_Component_Text;