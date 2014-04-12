// Maybe make this into a page control.
//  That means it will always take up the whole page or be full screen in a window if suitable.

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../../jsgui-html", "./text-field", "./viewer/object",
	"./editor/object", "./flexiboard", "../page/layout/columns-2",
	"../../../resource/core/pool", "../../../resource/core/resource"], 
	function(jsgui, Text_Field, Object_Viewer, Object_Editor, Flexiboard, Columns_2, Ctrl_Resource_Pool, Ctrl_Resource) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control, Page_Control = jsgui.Page_Control;

		// Another type of control? - composite or basic-composite?
		//  That would be an unenhanced Login control. Made up of basic controls, will render and
		//   be useful on very limited platforms.

		// Since this is now an advanced control...
		
		// Layout_2_Column as a Page_Control...
		//  Would have the resizable separator bar between them.

		// We want the list of resources in the pool.
		//  They will first get generated on the server, though it would also be possible to get / refresh them
		//  on the client.

		// Have some kind of resource pool viewer?
		//  Or it's merely information nav?

		// I think making the resource pool viewer control could make sense.
		//  There will also be the resource publisher / resource pool publisher that exposes the rp through a json interface

		var Web_Admin = Columns_2.extend({

			// Maybe should put this into a form, so that it does a form post.
			//  That could possibly be disabled.

			'init': function(spec) {
			    var make = this.make;
			
				this._super(spec);

				//this.set('dom.attributes.class', 'web-admin-control');

				this.set('dom.attributes.class', 'admin control');

				this.__type_name = 'web_admin';

				
				
				// What about a data object being the test object?
				//  Perhaps a data object that's connected to the server?
				//   Perhaps that would be a Resource.

				// Would be good to have the object editor editing a remote object.

				// That would be a client-side connection to an object.
				//  Likely that object would be on the same server... but explore other options.

				// Want the web admin to use various tools such as the resource pool.

				// Perhaps the client-side resource pool needs some work now.
				//  It would provide access to some resources that exist on the server (possibly).

				// Starting up a client-side resource pool that provedes access to some server-side resouces would be
				// very cool. The particular server side resources are going to depend on the app, but some could be 
				//  generally available. Perhaps the resources that determine the app's content and files will be
				//  made available.

				/*
				var testObj = {
					'name': 'test1',
					'2ndObj': {
						'hello': 'world'//,
						//'further': {
						//	'nested': [1, 2, 3, 4]
						//}
					},
					'arr': ['hello', 'world', 12.5]
				}
				*/


				// and give it selection scope?
				//  it has that by default but objects internal to it do not, that would be best.

				// Also, selection scope is a property that could be passed onto the client.
				// data-jsgui-fields 'selection_scope': true

				// Then it activates with selection scope.

				//  Or it can be assumed the outer one has the selection scope.

				// will be properties_to_client on the server
				//  want the client to know more easily where a selection_scope starts.
				// Have a top band control as well...
				//  Then the flexiboard can be within that,
				//  could get it to float to the right.

				if (!spec.el) {
					//var top_band = new Control({
					//	'context': this._context
					//})
					//this.add(top_band);

					// Have a 2 panel vertical separator layout.
					// 2 column split layout.

					/*
					var flexiboard = new Flexiboard({
						'context': this._context
					})
					top_band.add(flexiboard);
					*/

					// Can have this absolutely positioned, then attached to the right by javascript.



					// can give it absolute position, towards the right.

					/*
					var objv = new Object_Viewer.Object_Viewer({
						'context': this._context,
						'value': testObj
					});
					*/

					// Could try an object editor.
					//  That may work quite effectively.
					//   Will work with contenteditable.
					//   Will also be updating the model based on view / ui changes.
					//    Then the model could automatically send its update to the server if applicable.

					/*
					var objv = new Object_Editor({
						'context': this._context,
						'value': testObj
					})

					objv.set('dom.attributes.data-jsgui-fields', "{'selection_scope': true}");

					this.add(objv);
					*/

					// In the left panel, of the main section, have navigation.


				}

				var left = this.get('left');
				var right = this.get('right');

				if (left) {
					// Put the web admin navigation in the left panel.
					//  This will be a published version / adaptation of the resource pool


					var ctrl_resource_pool = new Ctrl_Resource_Pool({
						'context': this._context
					});
					left.add(ctrl_resource_pool);



					// And when a resource gets clicked on, we set the main right panel view to show it.

					// selection-change event.
					//  or something similar.

					// When a new item is selected, we can get the actual resource object from the client side resource
					//  pool.

					// Also, want the client side pool to make an HTTP request to load the resources, unless this
					//  data is somehow also served with the page.



					//  Resource_Viewer?
					//  Resource_Access?
					//   That may be good?
					//  Ctrl_Resource
					//   That may be better.
					//   A generic interface to the resource.
					//    Will be enough for many RESTful operations.

				}
				if (right) {

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

				// Making it grid9 seems to have a problem with how the controls are arranged in relationship to each other.
				//  I think that will need to be worked on.

				//this.grid_9();


				//this.make_full_height();
				this._context.full_window = this;

				// get the reference to the ctrl_resource_pool.
				//  a system of automatic regetting of references would be very useful here.

				// Want to store the resource pool as a field...
				//  But could probably get it from the content relatively easily.
				var left = this.get('content').get(0);
				var right = this.get('content').get(1);
				var ctrl_resource_pool = left.get('content').get(0);

				/*

				var grid_9 = this.get('content').get(0);
				// and the content is a grid_9!
				//console.log('* content', content);
				console.log('* grid_9', grid_9);

				var v_middle = grid_9.get('content').get(1);
				console.log('v_middle', v_middle);

				var res_middle = v_middle.get('content').get(1);
				console.log('res_middle', res_middle);

				// Fields could work well for this.

				
				console.log('left', left);
				var right = res_middle.get('content').get(1);
				console.log('right', right);

				// Does ctrl_resource_pool somehow change into a different control?

				var ctrl_resource_pool = left.get('content').get(0);
				*/


				//  Has it not been activated as a ctrl_resource_pool?

				// So, at this time it does not have the right ID?
				//  It should have the context and not need to make any new ID.


				console.log('web-admin ctrl_resource_pool', ctrl_resource_pool);

				// why does this not get bound or get triggered?
				//  Maybe we just read the item from the selection scope?
				var context = this._context;

				ctrl_resource_pool.on('change', function(e_change) {
					var resource = e_change.resource;
					console.log('pool change resource', resource);

					// show the control for that resource.
					//  can have double binding.

					if (!resource.ctrl) {
						resource.ctrl = new Ctrl_Resource({
							'context': this._context,
							'resource': resource
						});


					}

					right.clear();
					right.add(resource.ctrl);


					// Now we have that resource, we can assign it to the Resource Control.

				});
				console.log('ctrl_resource_pool', ctrl_resource_pool);
				//throw 'stop';
			}
		});
		
		
		return Web_Admin;
	
});