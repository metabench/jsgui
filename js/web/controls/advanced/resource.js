if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../../jsgui-html", "./single-line", "./title-bar"], 
	function(jsgui, Single_Line, Title_Bar) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;
		

		// Extending, with field values being set?
		//  Setting field values in definitions may be a useful thing.
		var Ctrl_Resource = Control.extend({
			fields: {
				'resource': Object//,
				//'name': String
			},

			'init': function(spec) {
				this._super(spec);

				this.set('dom.attributes.class', 'resource');
				this.__type_name = 'ctrl_resource';
				//this.set('dom.attributes.data-jsgui-properties', "{'selection_scope': true}");

				// Could have the name as a title.
				//	var name = this.get('name');

				var resource = this.get('resource');

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
						
						





						console.log('got data', data);

						// then present the data.
						//  find out the length of the keys.

						



					}
				});



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
				// need to look at the childnodes...
			}
		});
		return Ctrl_Resource;
});