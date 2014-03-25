if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../../jsgui-html", "./single-line", "./title-bar", "./viewer/object"], 
	function(jsgui, Single_Line, Title_Bar, Object_Viewer) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;
		

		// Extending, with field values being set?
		//  Setting field values in definitions may be a useful thing.

		// Deferred rendering of controls?
		//  This control gets its data using an asyncronous method.
		//  We want it so that the control does not render until it is ready with the data.

		// We don't have a stage to wait for a control to be ready before rendering.
		// We have assumed that they will be ready upon having been given their construction info.

		// This is the first Control to use deferred rendering.




		var Ctrl_Resource = Control.extend({
			fields: {
				'resource': Object//,
				//'name': String
			},

			'init': function(spec) {
				this._super(spec);
				var that = this;

				this.set('dom.attributes.class', 'resource');
				this.__type_name = 'ctrl_resource';
				//this.set('dom.attributes.data-jsgui-properties', "{'selection_scope': true}");

				// Could have the name as a title.
				//	var name = this.get('name');

				var resource = this.get('resource');




				// the resource may not have been established.
				//  We may need to get the resource from the pool.
				//  The resource name could be a property of the control that gets sent from the server as a data-jsgui atribute


				// This will depend on the context.
				//  It will be different the first time it gets rendered.

				// Will keep in mind client-side rendering, but generally I'm rendering the 1st time on the server.

				// When this gets activated on the client, it may connect with a Resource in the pool.
				//  Other Resource controls are going to inherit from this, but there will be some fairly general Resource Control
				//  functionality that's able to interact with a variety of resources.

				// Want it so that Resources and Controls are flexible enough to access a variety of online data.


				// We could otherwise get the resource from the resource pool.
				//  The control may have been told on the server which resource it is, and it accesses it from the pool.

				// When it is connected to the resource in the pool, it can listen to updates on it.
				//  Having the clock update with each tick from the server would be a good start.
				//  Want it to be easy to make these general interfaces where data is shared, covering a small variety of use cases that
				//   covers a lot of things.

				// Some simple diagrams could represent different configuration options.

				// Can get the resource pool from the context.

				//  This may have been initialised with some jsgui properties.

				// Explicitely have different code for when it runs on the client or the server?
				// Or when in the lifecycle of the Control it is? Has it been rendered already?
				//  Knowing if it expects to be rendered on the client?

				// Then will need to process updates to data, that could carry out the updates in a similar way both if it has not been rendered or
				//  if it has been - but if it has already been rendered then data will need to be updated (if the document is still active in that
				//  context?)










				if (resource) {
					var name = resource.meta.get('name');
					var ctrl_title_bar = new Title_Bar({
						'context': this._context,
						'text': name
					});

					// Show resource metadata.

					// Then information about the resource itself.
					//  Does a resource have fields?

					this.add(ctrl_title_bar);

					// Not so sure what type_levels is for.
					//  Maybe choose a clearer name?
					//  Or expand documentation, have it searchable.

					//  Want to make a CMS to compose the documentation.




					var type_levels = resource.meta.get('type_levels');
					//console.log('type_levels', type_levels);

					// Then get the data from the resource.
					//  The client_resource should interact with the server, doing a get request.

					// Will need to defer the rendering.
					//  Only render when this has the information.
					//  The render function of control will do the deferring, this may become a somewhat common patten used in the code.

					this.__status = 'waiting';

					resource.get(function(err, data) {
						if (err) {
							throw err;
						} else {
							// Maybe the data is the resource itself?
							//  Or it only provides async access, no caching - I think that's best for the moment.
							//  So when a resource is got, it could return just the JSON, or data_objects, collections.


							// That data could come back in some other form, or the resource could store the data within itself?
							//  and only contact the server when needed?

							// Alternatively, any form of caching could be handled as an add-on or within some particular resources.
							//  The main point of a Resource on the client is to provide the means to access a variety of
							//  data using convenient syntax.

							// So, with the mongo database, we get given a collections array.
							//  Want to be able to see the various items returned from a resource in the UI.
							//   It should also be easy to work out what the URL of a part of a resource is.
							//    The collections is not a resource itself, but a property of the database resource.
							//    Then individual collections would be resources.

							// We treat the meta field differently.
							//  Want to show the various items of data within a resource data explorer.
							//  Though, collections is quite a bit like a resource. However, it should be possible to make
							//   resource properties act as resources, perhaps to treat them as a resource on the client?

							// Do we illustrate that a resource links to another resource, in particular?
							//  It may make sense most.
							//  Or it could be assumed?

							// So a resource could have subresources
							//  and virtual subresources (such as a 'collections' level within a database)

							// So which fields of it are other resources, and which parts are virtual subresources?

							// Perhaps having a resource query result class?


							//console.log('got data', data);
							//console.log('tof(data) ' + tof(data));

							// Resource connected tabular data as well?
							//  Connecting a Control up to a Resource, in general, and displaying the information in a particular way.
							//   It will be good to have a variety of controls that can display / interact with a Resource.

							// Faced with a puzzle about which ones to make.
							//  Want something general that others inherit from
							//  Want something general that handles all situations
							//  Want something flexible.

							// Building more complex controls on top of more basic ones.

							// Start with a Resource Control that just displays an object.


							if (tof(data) == 'object') {
								var objv = new Object_Viewer({
									'context': that._context,
									'value': data
								});

								that.add(objv);

								var ctrl_fields = {
									'object_viewer': objv._id()
								//	'close': ctrlCloseID,
								//	'inner': ctrlInner._id()
								}

								// use different quotes...

								that.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));
							}




							// with the data being an object, we can display it as a table.
							//  A control that renders an object as an HTML table...
							//  the keys in the left column, and the values in the right column.

							// Or renders it as a JavaScript object perhaps?

							// I think that rendering the object as a table would work well with some fairly simple returned data.

							// Want to have various components that returned data can be rendered into.
							//  There should also be a way of choosing the ost appropriate Control to display / edit some particular data within.
							//  It could identify features of the data, such as if it is tabular data.

							



							that.set('dom.attributes.data-jsgui-resource-name', name);
							that.active();



							that.__status = 'ready';
							that.trigger('ready');

							// then present the data.
							//  find out the length of the keys.

							



						}
					});

				}

				//if (!spec.el) {

					

				//}



					


				// The URL of the resource?
				//  This will likely be a client-side resource.

				// Then subresources?

				// Can show the resource's URL.

				// Really want to get into the details of what the resource is about.
				//  A resource can have fields.
				//   They would be resource fields though?
				//    Maybe not...

				// Eg db resource.tables





			},
			'activate': function() {
				console.log('Ctrl_Resource activate');

				// Needs to connect up its internal fields?
				this._super();

				var ctrl_object_viewer = this.get('object_viewer');

				//console.log('ctrl_object_viewer', ctrl_object_viewer);




				// Means we listen to the resource pool, and update the UI.
				//  But also that we reconstruct the various references and variables / fields / properties needed to run the Control.

				var el = this.get('dom.el');
				console.log('el', el);

				var resource_name = el.getAttribute('data-jsgui-resource-name');
				console.log('resource_name', resource_name);

				var rp = this._context.resource_pool;
				console.log('rp', rp);

				var resource = rp.get_resource(resource_name);

				console.log('resource', resource);

				// Do need references to the parts of the UI that could be changed.

				// Couold re-render the resource UI when the resource changes.
				//  That's essentially what we a re doing here...

				// It may only be some fields from inside.

				// Need to find the references to them.
				//  Also, want this to work in general cases.
				//  More in-depth code to do with updating changes should be within other components.
				//  Will need to make some components able to identify and handle changes.
				//	They could be given a new version, it would need to see where the differences are.




				// Have the reference to the object viewer.
				//  Then update the object that it's displaying.

				// Will need to make some more general purpose user interface components, such as tables that display data.

				// find the subcontrols by type?
				//  use the system of automatically reconnecting them and getting back the references?



				// Need to listen for change events on the resource.

				resource.on('change', function(property_name, property_value) {
					//console.log('resource change event', e_change);

					// Now we have the change event, we change the UI.

					// Can just do a re render?
					//  That's less efficient than going in and only changing what needs to be changed.

					// use the change data to set ctrl_object_viewer's data.


					
					//\var val = e_change[1];\\
					var val = property_value;
					//console.log('tof(val) ' + tof(val));
					console.log('val', val);
					// Should be recieving this as a unix timestamp?



					var value = {
						'unix_time': val.getTime()
					}

					//console.log('value', value);


					// And the object viewer should listen for changes in its value.
					
					// That should raise necessary events.
					//  Should raise change on the ctrl_object_viewer
					//   (or on ctrl_object_viewer's value data_object?)



					ctrl_object_viewer.set('value', value);

					//console.log('ctrl_object_viewer._bound_events ' + ctrl_object_viewer._bound_events);

					
				})



				// need to look at the childnodes...
			}
		});
		return Ctrl_Resource;
});