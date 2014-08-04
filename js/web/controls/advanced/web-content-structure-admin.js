// Maybe make this into a page control.
//  That means it will always take up the whole page or be full screen in a window if suitable.

// Likely to be done with some more general purpose administration of resources.

// Will probably replace this with something using the flexible layout system.
//  Different internal controls / systems for navigation and viewing, all within a fairly standard and powerful control that
//   handles things this control will have in common with other browse + view/edit controls.
//   navigation area, content area, data and command area
//   left panel       right panel   ribbon on bottom of right panel
//   hidden on left   full          hidden on bottom
// That system will allow controls to work neatly on different screen sizes, allowing for any one of them to be like a simple mobile app.




if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./text-field", "./object-viewer", "./flexiboard"], 
	function(jsgui, Text_Field, Object_Viewer, Flexiboard) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control, Page_Control = jsgui.Page_Control;

		// Another type of control? - composite or basic-composite?
		//  That would be an unenhanced Login control. Made up of basic controls, will render and
		//   be useful on very limited platforms.

		// Since this is now an advanced control...

		// Not sure how much this will need to use a web content / web content structure resource.
		//  The resource may simplify making the DB calls, providing a structure so that web content can be
		//  got and set, 

		
		var Web_Content_Structure_Admin = Page_Control.extend({

			// Maybe should put this into a form, so that it does a form post.
			//  That could possibly be disabled.


			'init': function(spec) {
			    var make = this.make;
			
				this._super(spec);

				this.set('dom.attributes.class', 'web-admin-control');
				this.__type_name = 'web_admin';
				


				if (!spec.el) {
					var top_band = new Control({
						'context': this._context
					})
					this.add(top_band);


					var flexiboard = new Flexiboard({
						'context': this._context
					})
					top_band.add(flexiboard);

					// Can have this absolutely positioned, then attached to the right by javascript.



					// can give it absolute position, towards the right.

					// Basically want to show the structure of the site in a fairly large diagram.
					//  This will involve having some kind of data broker on the client and having a connection to the
					//   server for it.

					// Will generally use RESTful interface.

					// The structure as a JSON object...
					//  The structure as a bunch of more relational groups and pages joined by references?
					//   A mixture of both?

					// Nice to have a single JSON object for transmitting it.
					//  Storing in some cases.

					// The specific relational items, such as groups, will make for more granular editing of them?
					//  Possibly get higher performance on the server when dealing with queries like getting all pages
					//   in a group (though this could also be indexed within the app.)

					// I'll go for a more relational system.
					//  Will make it a bit easier for some more granular updates.

					// System will need to work in terms of both relational and as an object.
					//  Just I don't think a whole site's structure as a single object will work so well?

					

				}

				


				// want to anchor the Flexiboard in the top-right of the page

				// Will need quite a bit more work with HTML and CSS.
				//  Building useful CSS abstractions, accessing them systemically.




				

				//console.log('');
				//console.log('pre set objv value');
				

				//objv.set('value', testObj);

				// Set should raise a change event.

				// This control could have specific activation code.
				//  I think we should possibly be activating all controls.
				//   Possibly a bit more info needs to be sent about them, perhaps data attributes saying what function they
				//   serve within the jsgui system.

				// data-jsgui-spec
				//  That could contain the startup information needed to activate it.
				//  It may possibly contain the jsgui ids of subcontrols.

				// data-jsgui, then some JSON, may be more concise.
				//  would take parsing and interpretation.







				
			},
			'activate': function() {
				this._super();
				this.grid_9();
				this.make_full_height();
				this._context.full_window = this;
			}
		});
		
		
		return Web_Content_Structure_Admin;
	
});