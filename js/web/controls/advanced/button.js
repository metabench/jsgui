var jsgui = require('../../jsgui-html');
var Item = require('./item');

var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
var Control = jsgui.Control;
var Collection = jsgui.Collection;

// will have a context menu by default

var Button = Control.extend({

    'init': function(spec, add, make) {
        // Wont fields have been set?
        this._super(spec);
        var that = this;
        this.__type_name = 'button';

        this.set('dom.attributes.class', 'button');

        // Want to have a system of accessing icons.
        //  Will be possible to do using a Postgres website db resource
        //   First want it working from disk though.





        if (spec.text) {
            this.set('text', spec.text);
        }
        if (!this._abstract && !spec.el) {
            if (spec.text) {
                this.add(spec.text);
            }
        }
    },
    'activate': function() {
        this._super();
    }
});

module.exports = Button;