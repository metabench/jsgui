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
var Radio_Button_Group = require('./radio-button-group');

var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof, is_defined = jsgui.is_defined;
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













var Tabs = Control.extend({
    // panel name?

    // could have a title field.

    // Give the different tabs individual names and labels.



    'fields': {
        'name': String,
        'tabs': Array
    },

    // maybe add before make would be better. add will probably be used more.
    'init': function(spec, add, make) {
        this._super(spec);

        this.__type_name = 'tabs';

        this.set('dom.attributes.class', 'tabs');
        //console.log('spec.el', spec.el);

        console.log('init Tabs');
        var context = this._context;

        if (!spec.abstract && !spec.el) {

          // The tab bar
          //  (the main display area)
          //  separate panels to be hidden or shown.
          //  Needs to link the radio buttons to the panels somehow.
          //  Best to use the index of the button? Or buttons could be rearranged?
          //   Then reindex?

          // Each button has got corresponding panel.
          //  ???
          //  While using the RadioButtonGroup abstraction?

          // Make a Radio_Button_Group that

          // Each tab will have either a combined name and label, or two properties.
          //  Two properties would be much better for internationalization.
          //  label_text.


          var tabs = this.get('tabs');

          var rbg_items = [];

          each(tabs, function(tab) {
            console.log('tab', tab);

            var t_tab = tof(tab);
            console.log('t_tab', t_tab);

            if (t_tab === 'string') {
              rbg_items.push(tab);
            }



          })

          var rbg = new Radio_Button_Group({
            'context': context,
            'items': rbg_items
          });

          this.add(rbg);

          rbg.add_class('horizontal');






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

module.exports = Tabs;
/*
        return Panel;
    }
);
    */
