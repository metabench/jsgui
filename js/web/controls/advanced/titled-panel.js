var jsgui = require('../../jsgui-html');
//var Horizontal_Menu = require('./horizontal-menu');

var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
var Control = jsgui.Control;

var Panel = require('./panel');

// Panel with a titlebar inside

var Title_Bar = require('./title-bar');

var Titled_Panel = Panel.extend({
    'fields': {
        'title': String
    },

    'init': function(spec) {
        this._super(spec);
        this.__type_name = 'titled_panel';

        // And in composition, we add the title bar.

        if (!spec.abstract && !spec.el) {
            var title_bar = new Title_Bar({
                'context': this._context,
                'text': this.get('title')
            });
            title_bar.active();
            this.add(title_bar);


            // Then an inner content control.
            var inner_control = new Control({
                'context': this._context
            });
            inner_control.active();
            this.add(inner_control);

            // Then want to set the jsgui control fields so that it knows what these are on the client-side too.
            //  Will change this so it's got better syntax.
            //  But for the moment want to use the pattern as it is, and better spot how to cover the cases.

            this.set('dom.attributes.data-jsgui-ctrl-fields', stringify({
                'title_bar': title_bar._id(),
                'inner_control': inner_control._id()
            }).replace(/"/g, "'"));







            // And want to be able to refer to the title_bar as an object.
            // Also, want it so the inside of this control is where things get added, so there may need to be another content div.
            //  Easier to do that than to keep the title always the first element.







        }

    },
    'activate': function() {
        this._super();

        var title_bar = this.get('title_bar');
        var inner_control = this.get('inner_control');

        console.log('title_bar', title_bar);
        console.log('inner_control', inner_control);

    }
})

module.exports = Titled_Panel;