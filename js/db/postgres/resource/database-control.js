
if (typeof define !== 'function') { var define = require('amdefine')(module) }

// Want to include the right database css.
// It would be useful if a control could ensure that some css has got included.




define(['../../../web/jsgui-html', '../../../web/controls/advanced/resource-base',
	'../../../web/controls/advanced/window', '../../../web/controls/advanced/tree-node'], 
	function(jsgui, Resouce_Control, Window, Tree_Node) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;
		
		// The basic controls should not do too much on top of normal HTML, but make it easier to do a few things
		//  there.

		// This should not only operate in full-screen mode.
		//  ???
		// Or say that this control is an 'app?'
		
		var Postgres_Database_Resource_Control = Resouce_Control.extend({
			// is an Input element.
			//  type of either text or password.
			// could possibly specify some of the starting field values in this part.
			
			//'fields': [
			//	['value', String],
			//	['type', String]
			//
			//],
			
			'init': function(spec, add, make) {
				

				// Specify that the basic resource does not render anything?
				//  Maybe still have the titlebar.


				//console.log('spec.resource', spec.resource);
				//throw 'stop';

				var that = this;
				this._super(spec);
				this.__type_name = 'postgres_database_resource';
				this.set('dom.attributes.class', 'postgres database resource');


				// Initial render on the server, show the schemas and tables in the database
				//  Render the initial app view.
				//  It gets activated on the client.

				// needs to get the schemas from the database.

				if (typeof document == 'undefined') {
					var resource = this.get('resource');

					// Needs to defer rendering as well.

					this.__status = 'waiting';

					resource.get(function(err, resource_res) {
						if (err) {
							throw err;
						} else {
							console.log('resource_res', resource_res);

							// Want to render the various parts of the database into a tree.
							//  Not sure which of them need to be represented by resources.

							// Some aspects of automatic creation of objects based on resource data has not been done.


							// Want to render an active app with windows.
							//  Will have a main window.
							//  Title at the top and then menu bar.

							

							// Have a large title bar.

							var title_bar = new Control({
								'context': that._context
							});
							title_bar.set('dom.attributes.class', 'title bar');


							var centered = new Control({
								'context': that._context
							});
							centered.set('dom.attributes.class', 'centered');



							// In the title bar we have an image to represent a postgres database.

							// then split into left and right.
							//  Icon and control description on left
							//  Database name on right


							var div_left = new Control({ 'context': that._context });
							div_left.set('dom.attributes.class', 'left');
							var div_right = new Control({ 'context': that._context });
							div_right.set('dom.attributes.class', 'right');
							var div_clearall = new Control({ 'context': that._context });
							div_clearall.set('dom.attributes.class', 'clearall');





							var title_img = new jsgui.img({

							})
							title_img.set('dom.attributes.src', '/img/postgres/postgres-database-512x512.png');
							//title_img.set('dom.attributes.class', 'title-img');

							title_bar.add(centered);


							var h4_description = new jsgui.h4({
								'context': that._context
							});
							h4_description.add('Postgres Database');





							var h1_title = new jsgui.h1({
								'context': that._context
							});
							h1_title.add(resource.meta.get('name'));
							//centered.set('dom.attributes.class', 'centered');

							centered.add(div_left);
							centered.add(div_right);
							centered.add(div_clearall);

							

							div_left.add(title_img);
							div_left.add(h4_description);

							div_right.add(h1_title);

							//centered.add(title_img);
							//centered.add(h4_description);
							//centered.add(h1_title);

							that.add(title_bar);


							// Then a few other parts.
							//  Want to display the schemas.
							//  There is a list of schemas, also want to be able to bring up the schema info.
							//  As this is a SPA it would be good to have windows there too.
							//  A menu at the top as well.
							//  Minimised windows going to a taskbar at the bottom.

							// Want there to be a schemas window - lists the schemas.

							// 

							// A window with a tree in it on the left to explore the database
							//  On the right a control to deal with / modify whatever is selected on the left.

							// I think we need / could use a tree control.
							//  Could show various objects in tree node view.

							// Add window

							// I think the add function would be good as an input parameter.
							//  A shortcut that automatically deals with contexts will be very useful and will help with compression.



							//var win = make(Window({}));
							//that.add(win);

							var win = add(Window({
								'size': [300, 500],
								'title': 'Database Tree'
							}));

							var db_tree_root_node = make(Tree_Node({}));

							win.add(db_tree_root_node);


							//console.log('win', win);

							//var win = new Window({
							//	'context': this._context
							//})
							//that.add(win);












							that.__status = 'ready';
							that.trigger('ready');



						}
					})

				}








				// Will have a variety of controls inside it.
				//  This database resource control will act as an app in many ways.
				//  May use pushstate to change the URL, but the Database is a level where it's worth making an app.
				
				
				

				
			}
		});


		return Postgres_Database_Resource_Control;
		
		//return jsgui;
		
	
});