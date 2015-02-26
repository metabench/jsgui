
/*
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html-enh"],
 function(jsgui) {
*/

// Should have a toggle button group to allow selection / activation of individual buttons.
//  Will have an event for when the button selection changes.
//  Perhaps this could be done with a selection group, like a radio group.
// For the moment, I think a Toggle_Button_Group is the right way to go.


// Maybe we really want a 'select_button'.
//  Don't want clicking it again to unselect it.
//  Perhaps we just want to say a button is 'selectable'.




var jsgui = require('../../jsgui-html-enh');


var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof;
var Control = jsgui.Control;

var Toggle_Button = Control.extend({

    'fields': [
        //['text', String]
    ],
    //  and can have other fields possibly.

    'init': function(spec, add, make) {
        this._super(spec);
        this.__type_name = 'toggle_button';

        this.set('dom.attributes.class', 'toggle-button');

        // Always active?

        this.active();


        // Has the states.
        //  Is set with a state
        //  Has different content per state.
        //   Maybe have different controls that get toggled, give easy access to those controls.
        //  An array or collection of controls. Toggles between them.


        // A map of the states and their content controls.

        // And the Plus_Minus_Toggle_Button will extend this.
        //  The tree control will use that.
        //  Will listen to changes from the button.


        var spec_state = spec.state, state, spec_states = spec.states, states;

        // need to persist some fields to the client, but not as

        //var ctrl_fields = {};

        // Activate would set those values on the client-side.

        // active_fields.
        //  Potential to make all of a control's fields active.
        //  Would be better to include a new JSON dock or chunk of JSON in the script.
        //  It could download that data separately, so that it gets the first rendered view quicker.

        // Title on top, main content, sidebar on right
        //  Perhaps multi layout mode(s) could have footer as well.
        //  Possibly replace title with header.
        //   see http://alistapart.com/d/negativemargins/ex4.htm

        // May need to put the various containers within wrapper divs, to get more divs that are needed for flexibility in CSS
        //  I think flexible layout also means flexible HTML construction.
        //   Want it to render specific wrapper combinations on the server or in the construction phase.
        //   Multi-layout-mode may need to hold quite a variety of layouts, and render them differently.
        //    a variety of CSS classes will mean that the layout that gets rendered in HTML appears correct when rendered in the browser.













        var active_fields;





        if (spec_state) {
            //if (spec_state == 'expanded' || spec_state == 'contracted') {
            state = this.set('state', spec_state);
            if (!active_fields) active_fields = {};
            active_fields.state = state;
            //ctrl_fields['state'] = state;
            //} else {
            //	throw 'spec.state expects "expanded" or "contracted".';
            //}
        } else {
            //state = this.set('state', 'expanded');
        }

        if (spec_states) {
            //if (spec_state == 'expanded' || spec_state == 'contracted') {
            states = this.set('states', spec_states);

            //state = this.set('state', spec_state);

            if (!active_fields) active_fields = {};
            active_fields.states = states;
            //ctrl_fields['state'] = state;
            //} else {
            //	throw 'spec.state expects "expanded" or "contracted".';
            //}
        } else {
            //state = this.set('state', 'expanded');
        }

        console.log('active_fields', active_fields);

        if (active_fields) {
            this.set('dom.attributes.data-jsgui-fields', stringify(active_fields).replace(/"/g, "'"));
        }
        // use different quotes...

        //that.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));

        // Need to transfer the state and states properties/fields to the clients.




    },
    'activate': function() {
        this._super();
        console.log('toggle button activate');

        // Need references?
        var that = this;

        // read the active fields.
        //  This is likely to be done in Control in the future.? Or now?


        // need to listen for the state changing.
        //  update the UI.
        var state = that.get('state');
        console.log('tof state', tof(state));

        // Want .on for data value change?
        // Would make sense to detect when a data value changes!
        //  A bit like Data_Object.


        state.on('change', function(e_change) {
            console.log('toggle button state change', e_change);


            // Would need to re-render it as well.
            //  Control needs to listen for content change.

            //that.set('content', e_change.value);
            that.clear();
            that.get('content').add(new jsgui.textNode({'context': that._context, 'text': e_change.value}));


            that.raise('toggle', e_change);

        });



        this.on('click', function(e_click) {
            console.log('toggle button clicked');

            // needs to toggle through states.

            // Need to send the state field from the server to the client.



            console.log('state', state);

            // And need to look at the states.

            var states = that.get('states');
            // Need to send the state field from the server to the client.



            console.log('states', states);

            //State being stored as a Data_Object,
            // States being stored as an Array?

            // still, need to shift between them
            var i_current_state;
            if (tof(states) == 'array') {
                each(states, function(i_state, i) {
                    console.log('i_state', i_state);
                    console.log('tof i_state', tof(i_state));
                    if (i_state == state.value()) {
                        i_current_state = i;
                    }
                })
                console.log('i_current_state', i_current_state);
                // then choose the next state

                var i_next_state = i_current_state + 1;
                if (i_next_state == states.length) i_next_state = 0;
                var str_next_state = states[i_next_state];

                state.set(str_next_state);

            } else {
                throw 'stop'
            }









        })
    }
});

module.exports = Toggle_Button;

        /*
		return Toggle_Button;
		
		//return jsgui;
		
	
});
            */