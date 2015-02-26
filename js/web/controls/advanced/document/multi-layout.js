/**
 * Created by James on 02/02/2015.
 */

// An HTML document which also is using the multi-layout-mode.
//  Will be able to refer to different parts of the layout conveniently.

var jsgui = require('../../../jsgui-html-enh');

var stringify = jsgui.stringify

var Client_HTML_Document = jsgui.Client_HTML_Document;

var Multi_Layout_Mode_Control = require('../multi-layout-mode');

var Multi_Layout_Document = Client_HTML_Document.extend({
    'fields': {
        'layout_mode': String
    },
    'init': function(spec) {
        //spec.layout_mode =


        this._super(spec);

        // And add the multi-layout-mode control, if appropriate
        //  appropriate when the control does not have a DOM element / does not have that content already.

        if (!spec.abstract && !spec.el) {

            var mlm = new Multi_Layout_Mode_Control({
                'context': this._context,
                'layout_mode': spec.layout_mode
            });



            this.add(mlm);
            mlm.active();

            // Will use some JavaScript to arrange things.
            //  Eg fixed width column on the right, variable width column on left
            //   see http://www.pagecolumn.com/liquidfixed/2_col_liquid_fix.htm for how to do it in css

            // Want a decent amount to be done in CSS




            // And then we want to directly link to the multi-layout subcontrols.
            this.set('misc', mlm.get('panel_misc'));
            this.set('ctrl_layout', mlm);


            var ctrl_fields = {
                'title': this.set('title', mlm.get('title'))._id(),
                'navigation': this.set('navigation', mlm.get('navigation'))._id(),
                'main': this.set('main', mlm.get('main'))._id(),
                'misc': this.set('misc', mlm.get('misc'))._id(),
                'ctrl_layout': mlm._id()
            }




            this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));


            //this.active();
        }


    }
})

module.exports = Multi_Layout_Document;