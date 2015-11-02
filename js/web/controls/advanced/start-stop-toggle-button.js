var jsgui = require('../../jsgui-html');
var Toggle_Button = require('./toggle-button');

var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
var Control = jsgui.Control;

var Start_Stop_Toggle_Button = Toggle_Button.extend({

	'fields': [
		//['text', String]
	],
	//  and can have other fields possibly.

	'init': function(spec, add, make) {
		// Set it so it only has two states
		//  '+' and '-'

		spec.states = ['start', 'stop'];
		spec.state = spec.state || 'start';

		this._super(spec);
		this.__type_name = 'start_stop_toggle_button';
		this.set('dom.attributes.class', 'start-stop toggle-button');

		// set not returning the Data_Value?

		this.set('state', spec.state);

		// Want it to have events as well specific to start and stop.
		//  That will make it different to some other toggle buttons.

		// can listen for state change.

		// needs to be client-side event only.
		//  Maybe just on activation.





	},
	'activate': function() {
		// Need to check it's not active already.

		if (!this.__active) {
			this._super();

			// Should be a Data_Value on the client-side, so we can listen for changes.

			// Need to make sute that on the client side it gets activated by setting with a Data_Value.
			//  Perhaps making state into a field would help.

			/*

			var state = this.get('state');
			console.log('this', this);

			console.log('state', state);
			console.log('tof state', tof(state));

			state.on('change', function(e_state_change) {
				console.log('e_state_change', e_state_change);
			});

			*/

			console.log('activate Start_Stop_Toggle_Button');

			var that = this;

			this.on('change', function(e_change) {
				console.log('e_change', e_change);
				var name = e_change.name;
				var value = e_change.value;

				if (name === 'state') {
					// the state is just what the button says/will say.
					if (value === 'stop') {
						// start it.
						that.raise('start');
					}
					if (value === 'start') {
						// start it.
						that.raise('stop');
					}

				}
			})

			/*
			this.on('state', function(e_state) {
				console.log('e_state', e_state);
			})
			*/
		}



	}
});

module.exports = Start_Stop_Toggle_Button;
