
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./single-line", "./title-bar", "./resource"], 
	function(jsgui, Single_Line, Title_Bar, Ctrl_Resource) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;
		

		// Extending, with field values being set?
		//  Setting field values in definitions may be a useful thing.
		var Ctrl_Resource_Pool = Control.extend({
			// fields... text, value, type?
			//  type could specify some kind of validation, or also 'password'.
				
			// single field?
			//'fields': [
			//	['text', String]
			//],			
			//  and can have other fields possibly.
			
			
			'init': function(spec) {
				this._super(spec);

				this.set('dom.attributes.class', 'resource-pool');
				this.__type_name = 'ctrl_resource_pool';
				// Have a header bar.
				//  A div with the text: Resource Pool

				// Being able to define a header in one line could be good, so that could be done with something that
				// extends Control.
				// Maybe not quite 'window'?
				// Named_Control?
				// Titled_Control?
				//  Then we can give it a title very quickly, it puts that title into place in the header.

				// Header would just be a div with a style, that has a 'text' property.
				//  Want to do more client-side work on updating such text, using the MVC system.
				//  Having events trigger so that data gets updated on the server / through a Resource, and the 
				//  update gets carried out in a way such that minimal boilerplate is needed.

				//this.set('dom.attributes.data-jsgui-fields', '{"selection_scope": true}');
				this.set('dom.attributes.data-jsgui-fields', "{'selection_scope': true}");
				// Creating a Title_Bar may be an easy step though.


				var ctrl_title_bar = new Title_Bar({
					'context': this._context,
					'text': 'Resource Pool'
				})
				//ctrl_title_bar.add('Resource Pool');
				//ctrl_title_bar.set('dom.attributes.class', 'titlebar');
				this.add(ctrl_title_bar);

				//if (spec.resource_pool) {
				//	this.set('resource_pool', spec.resource_pool);
				//}

				// we have access to the resource pool through the page context.
				//  that may be disabled in some configurations though.

				// Interesting...
				//  It may help if there is an actual resource pool available on the client.
				//   It may start out as being empty, but it will be able to load various resources on the server.

				// This resource pool control will display and interact with both client-side and server-side
				// resource pools and resources. It will interact with the server-side resource pool(s) via the 
				// client-side one.

				// Within the client-side app, the client-side resource pool will need to be initialised.
				//  It could be a resource?
				//   Gets started, and has started once it's received and processed its resource information.






				var pool = this._context.pool;
				console.log('pool', pool);

				// then for each resource in the pool, we have a resource control.
				//  controls for the same kind of item could be in different kinds of display modes, such as list and
				//  edit. Don't want to make loads of modules for different things, so having resources display just with their
				//  name in one configuration, and as an editable / interactive full size object in another configuration.



				var resources = pool.resources();
				var that = this;
				each(resources, function(i, resource) {
					// create the new resource control, in list item view mode.
					//  miniitem? single-line mode may be appropriate.

					// or we could just create some kind of single_line_item control, giving it that resource?
					// list-item resource.
					//  Though that sounds like the li from html.

					// a single_line (viewer) control may be suitable.
					//  We can give that single_line control the resource as its 'value'.

					// and it's text is a property / field of its value
					//  value_field? just call it field.

					// Could have more processing for choosing the image that gets displayed here...
					//  Want to have a system for handling images within the site.
					//   That looks like it will be the resource system.

					// It may be worth sending more information about the resources that they represent?
					//  Not sure about scraping the name from the HTML?
					//   It could be OK though, seems like an efficient way to get the info.
					//   Perhaps there could be a scrape() function as part of activate?
					//    And some default scraping, or easy scraping systems to set up with given parameters.
					//     It could pay attention to how the data gets rendered in the first place, maybe
					//      building scraping instructions as it renders it.


					var single_line_resource = new Single_Line({
						'context': that._context,
						'value': resource,
						'meta_field': 'name'//,
						//'selection_scope'
					});


					// set a bunch of control fields for it to get the references back?
					//  or no need?


					// this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));

					// On activation instead?
					//  Perhaps this could pass some activation parameters to this?
					//single_line_resource.selectable();

					// Need it so that these are selectable.
					//  Want it so that selecting one of these leads to its information being shown in the main pane.
					//  I think that would entail having some kind of a client-side resource system, or that this control
					//   is somehow sent with resource info (not as good).

					// I think the client-side resource pool makes sense, it can be a gateway to server resource pools,
					//  particularly the server that served the HTTP request, but later on, not necessarily.

					// Could make the single line selectable on activation.
					//  Defining the selection scope as this.

					that.add(single_line_resource);


					// I think creating the list-item, giving it a model / data_object?
					//  rename data_object to model?
					// Perhaps use that as an alias so at least talking about models is correct.
					//  Make a Model one of the enhanced types of Data_Objects?
				});
	

				// The various items will be selectable.
				//  Maybe this will just be resource-pool navigation?
				//   Could possibly navigate to subresources...
				
			},
			'activate': function() {
				console.log('Resource_Pool activate');
				// need to look at the childnodes...

				// However, the child controls may have been activated?
				var that = this;
				this._super();

				var content = this.get('content');
				console.log('rp content', content);
				console.log('rp content.length()', content.length());

				// then we want to make all the content items selectable.

				// That would be nice syntax - each with just a string, it would apply that function to each of them.
				// content.each('selectable');
				var selection_scope = this.get('selection_scope');
				content.each(function(i, item) {
					item.selectable();
					item.set('selection_scope', selection_scope);
					// selection scope selection change...

				});
				
				selection_scope.on('change', function() {
					//console.log('resource-pool selection_scope change');

					// then we get the actual client-side resource.
					//  it's something that provides the reference to the server-side resource, and can query it.

					//console.log('selection_scope', selection_scope);

					var msc = selection_scope.map_selected_controls;
					console.log('msc', msc);

					// then from that selected control, can we get the resource itself?
					//  the value?

					var asc = [];
					each(msc, function(k, v) {
						asc.push(v);
					});
					console.log('asc.length', asc.length);
					if (asc.length == 1) {
						var single_selected_control = asc[0];
						var val = single_selected_control.get('value');
						console.log('val', val);

						// However the value from the single_line I don't think is a resource, on the way back
						// into the DOM on the client. Perhaps it could be made to look up / get the resource
						// object from the resource pool.
						// The resource object could be created in the pool during the activation of the 
						// (something???)
						// I think having the client side resource pool load automatically from the server makes sense.
						//  It will create the proper client side resource objects, ready for them to be used.
						//  They will have info about the URLs of the server resource, and will carry out operations
						//  on those server resources.
						//  These should make for a convenient bridge between client side and server side code.

						// can we get access to the pool, and have a look for the resource by name?
						//  if it has been loaded into the client resource pool, we should have the means to access it.

						var pool = that._context.pool;
						var resource = pool.get_resource(val.value());

						console.log('resource', resource);

						// Then, that resource (client side resource) could have various viewers / a viewer factory.
						//  Want to be able to get a view / control? of a resource.

						// I think views make sense as terminology.
						//  Controls will not necessarily be views in terms of mvc, but they have embedded
						//  mvc anyway.

						// Need to be able to browse within resources.
						//  Perhaps we could expand the single line item?
						//  Show more lines inside it?

						// Want to be showing the resource control within the main right section


						// have an event saying that the resource has changed.

						//that.trigger('change', {'resource': resource});
						console.log('that', that);
						that.trigger('change', {'resource': resource});






						// then use that value to show a control for that resource.

						// Will make the resource control.




					}



				});


				// There is a bit more to do on activation.
				//  Some of this may be encapsulated elsewhere, such as in the resource_pool or client_resource_pool
				//  classes themselves. In response to a click / resource being selected, this needs to trigger
				//  some actions that would result in a resource being displayed.

				// I think a Resource control would be sensible.
				//  When a Resource is selected from the pool, that Resource control can be shown.

				// It's also worth having the client side resource pool (not the UI control) load some data about the
				//  resources available.





			}
		});
		return Ctrl_Resource_Pool;
		
		//return jsgui;
		
	
});