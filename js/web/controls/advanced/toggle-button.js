
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

// Can the button contain an image?
//  Would be useful for a start/stop button.
//  Toggle button toggling between two images.

// Can we have an abstraction that will handle a variety of images in a variety of contexts?
//  We want to have SVGs that are suitable for start and stop.
//  Want to make use of the right images or the right image abstractions.
//   Possibly vector abstractions would be useful.
//   Perhaps late 2015 we can count on svg support. Deos not seem to have that good Android support.
//    Legacy support too?
//    Spritesheets may be quicker.

// Using image files / sprites makes sense.
//  A sprite + build abstraction would be nice.
//  Just using image files would be easy to begin with.





// Inherit from Button, with change events, and the possibility of changing between images?


// If we defined something as a Collection, we would need to have different handling.
//  Want to be able to have collections as fields.


var Toggle_Button = Control.extend({

    // Though maybe tell it to be an array and it should be an array rather than a collection?
    //  Or a Data_Value that holds an array?

    'fields': [
        ['text', String],
        ['state', String],
        ['states', Array]
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

        var that = this;




        var active_fields;

        //console.log('spec.state', spec.state);



        if (spec_state) {
          //console.log('spec_state', spec_state);
            //if (spec_state == 'expanded' || spec_state == 'contracted') {
            //state = this.set('state', spec_state);
            state = this.get('state').value();
            console.log('state', state);
            //console.log()

            // So it's a Data_Value when it's a string...
            // But when it's an array it's an array?

            //throw 'stop';

            if (!active_fields) active_fields = {};
            active_fields.state = state;

            // Have a control for its text.

            //var ctrl_text = new jsgui.textNode({'context': that._context, 'text': e_change.value});

            //that.add(ctrl_text);
            //that.set('ctrl_text', ctrl_text);

            // May be better to put this into more general purpose composition.

            if (!spec.abstract && !spec.el) {
                var span_state = new jsgui.span({ 'context': this._context});
                span_state.add(state + '');
                that.add(span_state);
                that.set('span_state', span_state);

            }


            //that.add(state + '');
            //ctrl_fields['state'] = state;
            //} else {
            //	throw 'spec.state expects "expanded" or "contracted".';
            //}
        } else {
            //state = this.set('state', 'expanded');
        }

        if (spec_states) {
            //if (spec_state == 'expanded' || spec_state == 'contracted') {

            states = this.get('states').value();

            // Should probably get the collection.

            console.log('states', states);
            console.log('tof states', tof(states));
            console.log('tof states', tof(this._.states));
            //throw 'stop';

            //states = this.set('states', spec_states);

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

        //console.log('active_fields', active_fields);

        if (active_fields && typeof document === 'undefined') {
            this.set('dom.attributes.data-jsgui-fields', stringify(active_fields).replace(/"/g, "'"));
        }

        //this.get('state').on('change', function(e_state_change) {
        //  console.log('e_state_change', e_state_change);

        //})
        // use different quotes...

        //that.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));

        // Need to transfer the state and states properties/fields to the clients.




    },
    'activate': function() {

      if (!this.__active) {
        this._super();
        //console.log('toggle button activate');

        // Need references?
        var that = this;

        // Only want jsgui wrappers in some places.
        // When getting a jsgui Data_Object or Control, we don't want it wrapped within its own Data_Object.





        var span_state = this.get('span_state');

        // read the active fields.
        //  This is likely to be done in Control in the future.? Or now?


        // need to listen for the state changing.
        //  update the UI.



        // Automatically make strings get set as Data_Objects?
        //

        var state = that.get('state').value();

        //console.log('tof state', tof(state));

        // Want .on for data value change?
        // Would make sense to detect when a data value changes!
        //  A bit like Data_Object.
        /*
        state.on('change', function(e_change) {
            console.log('toggle button state change', e_change);


            // Would need to re-render it as well.
            //  Control needs to listen for content change.

            //that.set('content', e_change.value);
            that.clear();
            that.get('content').add(new jsgui.textNode({'context': that._context, 'text': e_change.value}));
            that.raise('toggle', e_change);

        });
        */

        that.on('change', function(e_change) {
          //console.log('e_change', e_change);

          if (e_change.name === 'state') {
            //e_change.value;
              console.log('e_change.value', e_change.value);
              console.log('tof e_change.value', tof(e_change.value));
              console.log('');
              console.log('1) span_state.__id', span_state.__id);

            span_state.clear();

              var tn_new_value = new jsgui.textNode({
                  'context': that._context,
                  'text': e_change.value
              })

              console.log('');
              console.log('2) span_state.__id', span_state.__id);

              // Activated the span state with the wrong ID?
              //  Or it needs to generate another id?

            span_state.add(tn_new_value);

          }
        });

        this.on('click', function(e_click) {
            //console.log('toggle button clicked');
            // needs to toggle through states.
            // Need to send the state field from the server to the client.
            var state = that.get('state').value();
            //console.log('state', state);
            // And need to look at the states.

            var states = that.get('states').value();
            // Need to send the state field from the server to the client.
            //console.log('states', states);
            //State being stored as a Data_Object,
            // States being stored as an Array?
            // still, need to shift between them
            var i_current_state;

            if (tof(states) === 'array') {
                each(states, function(i_state, i) {
                    //console.log('i_state', i_state);
                    //console.log('tof i_state', tof(i_state));
                    if (i_state == state) {
                        i_current_state = i;
                    }
                })
                //console.log('i_current_state', i_current_state);
                // then choose the next state
                var i_next_state = i_current_state + 1;
                if (i_next_state == states.length) i_next_state = 0;
                var str_next_state = states[i_next_state];
                //console.log('str_next_state', str_next_state);
                //state.set(str_next_state);

                that.set('state', str_next_state);
                // need to listen for a change from the ctrl then.

            } else {
                throw 'stop'
            }
        })
      }


    }
});

module.exports = Toggle_Button;

        /*
		return Toggle_Button;

		//return jsgui;


});
            */
