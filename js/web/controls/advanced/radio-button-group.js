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

var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof, is_defined = jsgui.is_defined;
var Control = jsgui.Control;

var group = jsgui.group;

var Radio_Button = require('./radio-button');

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













var Radio_Button_Group = Control.extend({
    // panel name?

    // Should not need to give a group name...

    'fields': {
        'items': Array
    },

    // maybe add before make would be better. add will probably be used more.
    'init': function(spec, add, make) {
        this._super(spec);

        this.__type_name = 'radio_button_group';

        this.set('dom.attributes.class', 'radio-button-group');

        //console.log('spec.el', spec.el);

        var context = this._context;
        var that = this;


        if (!spec.abstract && !spec.el) {
          var id = this._id();

          var items = this.get('items');
          console.log('items', items);

          each(items, function(v, i) {

            // jsgui advanced Radio Buttons will also be able to have a text label next to them.
            //  May render itself as an item inside a div, with the value next to it.
            //  Would be interesting to have a control that is 0 depth container...
            //   Like a div, but does not exist.

            // So a control could have contents, but could have no DOM node of its own.
            //  Or it has got more than one top level DOM node?
            // Do not want to have to put everything inside a DIV.
            //  An HTML radio button with its label next to it looks just like the kind of thing that could work as a 2 element control.
            //   Make it have an array of elements as its .el?
            //    or .els?
            //  Seems like it would add more complexity to the branching.
            //   Brings up more edge cases, makes rules more complex.

            // Could get on with this and override the rendering mechanism?
            //  Or have an option not to render the control itself?

            // .content_only property?
            //  Does not render the control itself, only its content.
            //   Then the content can include the HTML radio button control itself.

            // But then sending the control that has not HTML element to the client?
            //  Details of that control could be included in the next level down that does get shown.

            // Should put them in a Div for the moment, the find a way to remove that DIV from the markup.
            //  Avoid more hacks + complexity for now. Just get the tabs etc working smoothly.












            var radio_button = new Radio_Button({
              'context': context,
              'name': id,
              'text': v,
              'value': v
            });

            that.add(radio_button);
          });



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

module.exports = Radio_Button_Group;
/*
        return Panel;
    }
);
    */
