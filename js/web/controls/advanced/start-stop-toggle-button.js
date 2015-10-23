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
		this.set('dom.attributes.class', 'plus-minus toggle-button');
		var state = this.set('state', spec.state);

	}
});

module.exports = Start_Stop_Toggle_Button;
