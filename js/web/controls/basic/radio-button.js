if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}



define(["../../jsgui-html"], function(jsgui) {
	var Control = jsgui.Control;
	var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
	var is_defined = jsgui.is_defined;
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

	// group_name

	// This could be in HTML though... it seems like a standard HTML control.
	//  Then there would be an enhanced version.
	//   Keep it here while working on it.

	// Then want to test this using jsgui server, including a client-side app with some progressive enhancement
	//  that responds to some events with the button push.

	// Could sort out data binding for quite simple cases.
	//  Also textboxes.

	// And the enhanced radio button as well?
	//  In a normal rendering mode, that will render the visible part as well.
	//  It won't just do progressive enhancement on the client.
	//   However, it may use css on the client to hide the actual radio button.

	// May have a linking system between the controls.
	//  So when you set something on one control it gets set on the other.

	// Enhanced_Radio_Button
	//  Would have a normal Radio_Button and an Item_Selector
	//  Can produce a bunch of controls that will get this to work on the client.

	// Carousel Radio button would be good in some ways... it puts the buttons into a carousel and restules / enhances them.

	// I think Carousel Selector would be a good one. There could be a bit of variety on this.
	//  May want to use different ways of selecting things on different interfaces, and have this easily reconfigurable.

	// Something to slide different divs into place?
	//  Or different items of content.

	// A button or enhanced button would be a useful thing.
	//  Definitely do want some relatively simple vector images.
	//  Don't want to have to be dealing with bitmaps (much).

	// Some structural items will be relatively simple as vector.
	//  Triangles or arrows could be used to point left and right.

	// A few vector images for use in documents would be good at this stage.
	//  As well as that, there are probably font glyphs that can handle many things.

	// Could test drawing some triangles into a document.
	//  I think that will be using jsgui-vector.
	//   There may be further modules to render to vml.
	//   jsgui-vector-vml, jsgui-vector-svg

	// For the moment will have svg rendering.
	//  Rendering will depend on the context.

	// Will define polygons.

	//  May have code to map them into different places in different ways.




	var Radio_Button = Control.extend({
		'fields': [
			['group_name', 'string'],
			['value', 'string'],
			['checked', 'boolean', {'default': false}]
		],

		'init': function(spec) {
			this._super(spec);

			// if it's abstract then set should not do anything?
			//  With controls... but with database components it may be different.
			//  Could have it so that things in the spec object could get got or set.



			this.set('dom.tagName', 'input');
			this.set('dom.attributes.type', 'radio');
		},


		// but declaratively set the tagName?

		// then within control_dom, there need to be attributes...


		// and some specific rendering code...
		//  but likely to have a way to tell the control to render various properties as attributes.
		'beforeRenderDomAttributes': function() {
			//this.set('dom.name')
			
			var dom = this.get('dom');
			//console.log('');

			//console.log('');
			var dom_attributes = dom.get('attributes');

			//console.log('dom ' + stringify(dom));
			//console.log('dom_attributes ' + dom_attributes);

			//throw 'stop';

			var domAttributes = this.get('dom.attributes');
			//console.log('domAttributes ' + stringify(domAttributes));
			//if (this.)
			var groupName = this.get('group_name').get();
			var checked = this.get('checked').get();
			var value = this.get('value').get();
			//console.log('checked ' + stringify(checked));
			//throw 'stop';
			if (groupName) {
				domAttributes.set('name', groupName);
			}
			if (checked) {
				domAttributes.set('checked', checked.toString());
			}
			if (is_defined(value)) {
				domAttributes.set('value', value);
			}
		}
		// Will override some function to do the rendering...
		//  adding rendered attributes.
		// Want to render some of its properties to attributes.

	})

	// And will have enhanced radio button.

	// Radio_Button.Enhanced
	//  Styled so that it only acts like the normal radio button in accessibility mode.




	// First, want to test composition of the Calendar control on the server
	//  Then want to try serving a Calendar control.
	//  It may use the same code - no harm in having unused client-side code on the server.


	return Radio_Button;

});