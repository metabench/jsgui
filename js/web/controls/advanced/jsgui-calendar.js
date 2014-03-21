if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}



define(["../../jsgui-html"], function(jsgui) {
	var Control = jsgui.Control;
	var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;

	// view_type
	//  day, week, month, year, decade

	// Will have different Controls for viewing different items.
	// Each of the Time_Period(_View) controls will have a startDate and an endDate

	// Will have radio buttons at the top.
	// Day, week, month, year, decade views

	// Have a ribbon at the top.
	//  Will be better using individual css files for development.

	// Planning on making a high quality calendar component.

	// Need some radio buttons / enhanced radio buttons.
	//  These enhanced radio buttons could use progressive enhancement... however they could be fully rendered as they appear on the server
	//  with the option of a simple mode for non-js clients (possibly).

	// Can render on the server and activate on the client.
	//  Progressive enhancement would be better for accessability.

	// Could render actual radio buttons, but render them invisible when not in text accessability mode.

	



	var Calendar_Item = Control.extend({
		'fields': [
			['start_date', 'date'],
			['end_date', 'date']
		]
	})

	// Set the default view_type.
	var Calendar = Control.extend({
		'fields': [
			['view_type', 'string', {'default': 'month'}]
		],
		'init': function(spec) {
			this._super(spec);
		}
	})

	// First, want to test composition of the Calendar control on the server
	//  Then want to try serving a Calendar control.
	//  It may use the same code - no harm in having unused client-side code on the server.


	return Calendar;

});