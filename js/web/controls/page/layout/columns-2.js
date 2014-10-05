
/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(["../../../jsgui-html"], function(jsgui) {
*/
var jsgui = require('../../../jsgui-html');
	var Control = jsgui.Control;
	var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
	//var Client_HTML_Document = jsgui.Client_HTML_Document;
	var Page_Control = jsgui.Page_Control;
	// Set the default view_type.

	// Maybe easiest to make this extend another control...
	// Or to make a layout control that goes inside.

	//  I think a page-layout type control would be nice...
	//   it adds things to the document's body, that's it.
	//  Other components will be dealing with adding the correct JavaScript references.

	// Not sure this should be in page layout???

	var Columns_2 = Page_Control.extend({

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

			var el = this.get('dom.el');

			if (!el) {
				var left = new Control({
					'context': this.context
				})
				left.set('dom.attributes.class', 'left panel');
				
				var right = new Control({
					'context': this.context
				})
				right.set('dom.attributes.class', 'right panel');

				this.add(left);
				this.add(right);

				this.set('left', left);
				this.set('right', right);
			}

			this.set('dom.attributes.class', 'page columns-2');

			// setting these up as fields would be quite useful, so they are available on activation.


			// OK, but does this activate so it gets access to both the left and the right panels?
			

			// Except will these need to be set during activation?

			//this.set('bottom', bottom);

			// add top bar...

			// middle

			// bottom




		}
	})

	// First, want to test composition of the Calendar control on the server
	//  Then want to try serving a Calendar control.
	//  It may use the same code - no harm in having unused client-side code on the server.
module.exports = Columns_2;

//	return Columns_2;

//});