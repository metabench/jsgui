/**
 * Created by James on 01/10/2014.
 */


var jsgui = require('../../jsgui-html');
//var Multi_Layout_Mode = require('./multi-layout-mode');
var List = require('./list');
var Button = require('./button');
//var Flexidoc_Container = require('./flexidoc-container');

var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
var Control = jsgui.Control, Page_Control = jsgui.Page_Control;

// Much of this will be client-side, but will do a decent rendering server-side.

// May be worth making Flexidoc_Editor_Main
//  That would have the various containers.
//  It would start with one container
//   The user would then drag something (such as a text box) from the tools / misc area, into the container.

var Flexidoc_Component = Control.extend({

    'fields': {
        'mode': String
    },

    // Maybe should put this into a form, so that it does a form post.
    //  That could possibly be disabled.
    'init': function(spec) {

        this._super(spec);

        var that = this;



        //this.add_class('flexidoc-component');



        this.__type_name = 'flexidoc_component';

        if (!spec.el) {

            // If running on the server?

            var mode = this.get('mode');

            if (mode && mode.value) mode = mode.value();

            console.log('mode', mode);
            //throw 'stop';
            if (mode) {
                //this.add_class(mode);
                this.set('dom.attributes.class', 'flexidoc-component ' + mode);
            } else {
                this.set('dom.attributes.class', 'flexidoc-component');
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
module.exports = Flexidoc_Component;