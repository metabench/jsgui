

var jsgui = require('../../jsgui-html');
var Toggle_Button = require('./toggle-button');
//if (typeof define !== 'function') { var define = require('amdefine')(module) }

//define(["../../jsgui-html", "./toggle-button"],
	//function(jsgui, Toggle_Button) {

		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;

		var Plus_Minus_Toggle_Button = Toggle_Button.extend({

			'fields': [
				//['text', String]
			],
			//  and can have other fields possibly.

			'init': function(spec, add, make) {

				// Set it so it only has two states
				//  '+' and '-'

				spec.states = ['+', '-'];
				spec.state = spec.state || '-';


				this._super(spec);

				this.set('dom.attributes.class', 'plus-minus toggle-button');

				// Has the states.
				//  Is set with a state
				//  Has different content per state.
				//   Maybe have different controls that get toggled, give easy access to those controls.
				//  An array or collection of controls. Toggles between them.


				// A map of the states and their content controls.

				// And the Plus_Minus_Toggle_Button will extend this.
				//  The tree control will use that.
				//  Will listen to changes from the button.


				//var spec_state = spec.state, state, spec_states = spec.states, states;
				//console.log('spec.state', spec.state);


				var state = this.set('state', spec.state);
				// Set should return the object it sets it as. Possibly a Data_Object.

				//console.log('state', state);
				//if (spec_state) {
					//if (spec_state == 'expanded' || spec_state == 'contracted') {
					//state = this.set('state', spec_state);
					//} else {
					//	throw 'spec.state expects "expanded" or "contracted".';
					//}
				//} else {
					//state = this.set('state', 'expanded');
				//}

				// Then render the text content itself.

				/*
				var t_state = tof(state);
				//console.log('t_state', t_state);
				//throw 'stop';
				if (t_state == 'string') {
					//console.log('state', state);
					//throw 'stop';
					this.add(state);
				};
				*/






			}
		});
		//return Plus_Minus_Toggle_Button;

		//return jsgui;


//});

module.exports = Plus_Minus_Toggle_Button;
