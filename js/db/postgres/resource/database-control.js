
if (typeof define !== 'function') { var define = require('amdefine')(module) }

// Want to include the right database css.
// It would be useful if a control could ensure that some css has got included.




define(['../../../web/jsgui-html', '../../../web/controls/advanced/resource-base',
	'../../../web/controls/advanced/window', '../../../web/controls/advanced/tree-node'], 
	function(jsgui, Resouce_Control, Window, Tree_Node) {
		
		var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof;
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

							// The database control could act in different modes.
							//  One mode is simply representing itself in a list.

							// This could represent a databse in 'app' mode.
							// Or 'list' mode.

							// Is it possible to cache the resource result so it only is got once per rendering?

							// I think just using a simple list mode item would be worthwhile.
							//  Image and text is all that is needed there.



							console.log('resource_res', resource_res);
							//throw 'stop';

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





							var title_img = make(jsgui.img({}));
							title_img.set('dom.attributes.src', '/img/db/postgres/postgres-database-512x512.png');
							//title_img.set('dom.attributes.class', 'title-img');

							title_bar.add(centered);


							var h4_description = new jsgui.h4({
								'context': that._context
							});
							h4_description.add('Postgres Database');


							var db_name = resource.meta.get('name');


							var h1_title = new jsgui.h1({
								'context': that._context
							});
							h1_title.add(db_name);
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

							var db_tree_root_node = make(Tree_Node({
								'img_src': '/img/db/postgres/postgres-database-512x512.png',
								'text': db_name
							}));



							// Then we want something to represent the database.
							//  Not a full database-control though?
							//   or use it, but a light version?

							// an image in the root node to show its a postgres db.

							/*
							var title_pg_db = make(jsgui.img({}));
							title_pg_db.set('dom.attributes.src', '/img/postgres/postgres-database-512x512.png');
							db_tree_root_node.add(title_pg_db);

							// In the tree node, there is the inner section.
							// Also need a section that gets expanded and collapsed.
							//  Inner?
							//  There is a title section at the top?

							// I'm doing some programming right now, so may not respond immediately, but I'm still here.


							// as well as that have the text for the db root node


							var db_root_node_label = make(jsgui.span({}));
							db_root_node_label.add(db_name);
							db_tree_root_node.add(db_root_node_label);


							// want to create a new node for the schemas.

							var db_tree_schemas_node = make(Tree_Node({}));
							db_tree_root_node.add(db_tree_schemas_node);

							var img_pg_schemas = make(jsgui.img({}));
							img_pg_schemas.set('dom.attributes.src', '/img/postgres/schemas_512.png');
							db_tree_schemas_node.add(img_pg_schemas);

							var db_schemas_node_label = make(jsgui.span({}));
							db_schemas_node_label.add('Schemas');
							db_tree_schemas_node.add(db_schemas_node_label);
							*/

							//


							// then in the root node we have the schemas node.



							win.add(db_tree_root_node);


							var db_tree_schemas_node = make(Tree_Node({
								'img_src': '/img/db/postgres/schemas-512.png',
								'text': 'Schemas'
							}));
							db_tree_root_node.add(db_tree_schemas_node);
							// Then we have the extended part...
							//  other tree nodes.

							// Will have a tree node for schemas.
							//  Then a tree node for each schema

							// consolt resource_res
							// schema names
							var schemas = resource_res.schemas;
							each(schemas, function(schema) {
								var db_tree_schema_node = make(Tree_Node({
									'img_src': '/img/db/postgres/schema-512.png',
									'text': schema
								}));
								db_tree_schemas_node.add(db_tree_schema_node);
								
								var db_tree_schema_tables_node = make(Tree_Node({
									'img_src': '/img/db/tables-512.png',
									'text': 'Tables'
								}));
								db_tree_schema_node.add(db_tree_schema_tables_node);

								// Then for each schema we put in the tables?
								//  I think we may as well.



							});

							// Could have the schemas actually load the tables when the user clicks to expand it.




							//console.log('win', win);

							//var win = new Window({
							//	'context': this._context
							//})
							//that.add(win);

							// Find out what schemas are in the system.



							that.__status = 'ready';
							that.trigger('ready');



						}
					})

				}








				// Will have a variety of controls inside it.
				//  This database resource control will act as an app in many ways.
				//  May use pushstate to change the URL, but the Database is a level where it's worth making an app.
				
				
				

				
			},
			'activate': function() {
				console.log('Activating Postgres Database Resource Control');
			}


		});


		return Postgres_Database_Resource_Control;
		
		//return jsgui;
		
	
});