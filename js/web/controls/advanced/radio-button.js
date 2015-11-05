/**
 * Created by James on 04/08/2014.
 */

/*

if (typeof define !== 'function') { var define = require('amdefine')(module) }


// Also want to make an MDI window system (Multiple Document Interface)

define(["../../jsgui-html", "./horizontal-menu"],
    function(jsgui, Horizontal_Menu) {
*/

var jsgui = require('../../jsgui-html');
//var Horizontal_Menu = require('./horizontal-menu');

var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
var Control = jsgui.Control;

var group = jsgui.group;

// And the tab buttons act as radio buttons.
//  Having a JSGUI radio button replacement would be nice.
//   Could choose whether to render as a radio button and progressively enhance on the client...
//    Client-side enhancement of semantic HTML.

//   Or render as it appears on the client?
//    Being able to handle both would be nicest.
//    Possibly radio buttons could have good styling on modern clients anyway?
//    May want them to look very different to normal radio buttons though, eg using them for tabs.


// RadioButtonGroup could be a useful Control as well.
//  May provide an easier interface that abstracts away from having to directly make some of the controls.













var Radio_Button = Control.extend({
    // panel name?

    // could have a title field.

    // Items field could be an array.

    'fields': {
        'name': String,
        'text': String,
        'value': String
    },

    // maybe add before make would be better. add will probably be used more.
    'init': function(spec, add, make) {
        this._super(spec);

        this.__type_name = 'radio_button';

        this.set('dom.attributes.class', 'radio-button');
        var context = this._context;
        var that = this;

        //console.log('spec.el', spec.el);

        // No, make this contain an input element and a label element

        if (!spec.abstract && !spec.el) {

          var name = this.get('name').value();

          // Will need to render its ID in the DOM.

          var html_radio = new Control({
            'context': context
          });

          html_radio.set('dom.tagName', 'input');
          html_radio.set('dom.attributes.type', 'radio');
          html_radio.set('dom.attributes.name', name);
          html_radio.set('dom.attributes.id', html_radio._id());

          var html_label = new Control({
            'context': context
          });

          html_label.set('dom.tagName', 'label');
          console.log('text ', that.get('text'));
          html_label.add(that.get('text').value());
          html_label.set('dom.attributes.for', html_radio._id());

          that.add(html_radio);
          that.add(html_label);
          //html_radio.set('dom.attributes.type', 'radio');

          // Look at the items.


            /*
            var ctrl_fields = {
                'ctrl_relative': div_relative._id(),
                'title_bar': title_bar._id()
            }


            this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));
            */


        }

    },
    //'resizable': function() {
    //},
    'activate': function() {
        // May need to register Flexiboard in some way on the client.
        this._super();

        //

    }
})

module.exports = Radio_Button;
/*
        return Panel;
    }
);
    */
