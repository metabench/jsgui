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
        'value': String,
        'checked': Boolean
    },

    // maybe add before make would be better. add will probably be used more.
    'init': function(spec, add, make) {


        this._super(spec);

        // Will have set up some fields.
        //  However, will not be directly using a Field_Collection.
        //   Though perhaps that would help with keeping the ordering of the fields.
        //   Currently we are just treating ._ as holding all fields.
        //    Though not everything in there need be considered a field or set up as one.




        this.__type_name = 'radio_button';

        this.set('dom.attributes.class', 'radio-button');
        var context = this._context;
        var that = this;

        // A different way of raising change events?
        //  .on('change') often translates to the dom el's onchange.

        // Want a way to refer to the event for the Control itself, not adding a DOM listener.
        //  (..., false) seems OK.





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
            //console.log('that._', that._);

            var text_value = that.get('text').value();

            //console.log('spec.text', spec.text);

            // Value should have been set during the initialization.


            //console.log('text_value', text_value);
            //console.log('tof text_value', tof(text_value));
            //console.log('that._.text', that._.text);
            //console.log('tof(that._.text)', tof(that._.text));
            //console.log('tof(that._.text._)', tof(that._.text._));

            // So it seems as though the text field has not been assigned.
            //  It should have been, as its specified as a field.

            // However, there is a Data_Value for the text field, but it has not been set.

            // The field should have been set during initialization.



            //throw 'stop';

            if (is_defined(text_value)) {
                html_label.add(text_value);
            }

            // The text is a field.
            //  Should be automatically assigned from the spec.


            // Needs to have a context for the text that gets added.
            //  Text is not an element in of itself, so will not need a context.



            html_label.set('dom.attributes.for', html_radio._id());

            that.add(html_radio);
            that.add(html_label);
            that.set('radio', html_radio);
            that.set('label', html_label);
            //html_radio.set('dom.attributes.type', 'radio');

            that.set('dom.attributes.data-jsgui-fields', stringify({
                'value': that.get('value')
            }).replace(/"/g, "[DBL_QT]").replace(/'/g, "[SNG_QT]"));

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


        if (!this.__active) {
            this._super();

            var radio = this.get('radio');
            var el_radio = radio.get('dom.el').value();
            var label = this.get('label');
            var that = this;

            //var el = this.get('dom.el');
            //

            // No, refer specifically to the radio button element's control.



            // Changes upon becoming checked?
            radio.on('change', function(e_change) {
                //console.log('el_radio.checked', el_radio.checked);

                if (el_radio.checked) {
                    that.raise('change');
                }
            });

            // Need to listen for DOM change events. That will chage the value.
            //  The checked value true or false.



        }



        //

    }
})

module.exports = Radio_Button;
/*
 return Panel;
 }
 );
 */
