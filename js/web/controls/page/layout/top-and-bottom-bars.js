if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}



define(["../../../jsgui-html"], function(jsgui) {
	var Control = jsgui.Control;
	var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
	//var Client_HTML_Document = jsgui.Client_HTML_Document;

	// Set the default view_type.

	// Maybe easiest to make this extend another control...
	// Or to make a layout control that goes inside.

	//  I think a page-layout type control would be nice...
	//   it adds things to the document's body, that's it.
	//  Other components will be dealing with adding the correct JavaScript references.

	// Not sure this should be in page layout???

	var Top_And_Bottom_Bars = Control.extend({

		// Could follow a general specified layout?
		//  Taking info about where to put the login control for example.


		// This gets put into the body.

		// Perhaps I'll have a generic layout control... a control that does not render itself.
		//  maybe a no_self_render option or flag in Control.

		// Has a horizontal menu (H_Menu)
		//  Will be a menu with pop-up links
		//	However, clicking on a section will bring up a page corresponding to that secion.

		// Like clicking on the Open-Source item rather then the subitems will navigate to /open-source

		


		

		//'fields': [
		//	['view_type', 'string', {'default': 'month'}]
		//],
		'init': function(spec) {
			this._super(spec);

			//this.add_flag('no_self_render');

			// And add contents...

			// Will have a div and css class.



			this.set('dom.attributes.class', 'page top-and-bottom-bars');

			var top = new Control({
				'context': this.context
			})
			top.set('dom.attributes.class', 'top bar');

			var middle = new Control({
				'context': this.context
			})
			middle.set('dom.attributes.class', 'middle section');

			var bottom = new Control({
				'context': this.context
			})
			bottom.set('dom.attributes.class', 'bottom bar');

			this.add(top);
			this.add(middle);
			this.add(bottom);

			this.set('top', top);
			this.set('middle', middle);
			this.set('bottom', bottom);

			// add top bar...

			// middle

			// bottom




		}
	})

	// First, want to test composition of the Calendar control on the server
	//  Then want to try serving a Calendar control.
	//  It may use the same code - no harm in having unused client-side code on the server.


	return Top_And_Bottom_Bars;

});