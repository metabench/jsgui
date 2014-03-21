if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}



define(["../../jsgui-html", "./layout/top-and-bottom-bars", "../advanced/login", "../basic/link-menu"], 
	function(jsgui, Top_And_Bottom_Bars, Login, Link_Menu) {
	var Control = jsgui.Control;
	var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
	var Client_HTML_Document = jsgui.Client_HTML_Document;

	// Set the default view_type.
	// Maybe easiest to make this extend another control...
	// Or to make a layout control that goes inside.

	//  I think a page-layout type control would be nice...
	//   it adds things to the document's body, that's it.
	//  Other components will be dealing with adding the correct JavaScript references.



	var Home_Page = Client_HTML_Document.extend({

		// Could follow a general specified layout?
		//  Taking info about where to put the login control for example.
		//'fields': [
		//	['view_type', 'string', {'default': 'month'}]
		//],

		// This could take a Site_Info resource?
		//  Want this to render the data provided, but data could be a general site.

		// Could have a Content page as well, quite a generic one, that shows some content from the site's data structure.

		// a site_info field...
		//  That could have a few different properties, such as its sections.

		//  Likely to have an array of sections.
		//   Then within them there will be different forms of data.
		//    Will be quite simple to start with.
		//     Then will be made dynamic using a Resource.

		'fields': {
			'sections': 'collection'
		},






		'init': function(spec) {
			this._super(spec);

			var top_and_bottom_bars = new Top_And_Bottom_Bars({
				'context': this._context
			});
			this.add(top_and_bottom_bars);

			this.set('layout', top_and_bottom_bars);
			// And choosing that layout could select particular CSS.

			var top_bar = top_and_bottom_bars.get('top');

			var login = new Login({
				'context': this._context
			});

			top_bar.add(login);

			// the link_menu could take the site_info.
			var sections = this.get('sections');
			console.log('sections ' + stringify(sections));

			var link_menu = new Link_Menu({
				'context': this._context,
				'sections': sections
			})
			link_menu.set('dom.attributes.class', 'horizontal link-menu');

			top_bar.add(link_menu);

			this.include_client_css();
			this.include_css('css/top-and-bottom-bars.css');

			this.set('top_bar', top_bar);
		}
	})

	// First, want to test composition of the Calendar control on the server
	//  Then want to try serving a Calendar control.
	//  It may use the same code - no harm in having unused client-side code on the server.


	return Home_Page;

});