// But is this part of the html client, or it uses the html client.

// The client has page context.
//  Page context has the resource pool.

// So, client-resource will need html-enh I think, but not the client system.




define(['../../web/jsgui-html-enh', './resource'], 

	function(jsgui, Resource) {

	
	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;
	
	// Extends AutoStart_Resource?

	// May need to change around a fair few references to make it workable.
	// May need some more complicated logic to change it to the path for service.

	// There can be a client app that's specifically for a resource.
	//  That's a special case.
	// Other client side apps will access multiple resources.
	//  They can do this through a Resource_Pool.
	//  There could be client-side resources that make use of information sharing between these client and server side resources.




	// This client resource could reference a remote resource.

	// Will have client-remote-reference resource
	//  maybe just client-remote
	//  will work in a similar way to remote or node-remote in terms of API, but internally it will do HTTP calls differently.
	//  Possibly could just use jsgui though, have it expose the same API for node and the client.

	// This one is still fairly abstract.
	//  It will be the client-remote-link resource which will have the functionality.
	//  client-remote-link will connect with websockets to get events
	//  it will do get with http.


	// A resource control will recieve events from the client resource.
	//  It may also ensure it has been set up.

	// Also a Resource_Client file that sets up a resource connection with a particular resource?
	//  Maybe don't set up such abstract resource linking for the moment?

	// With the Resource-Client architure, we could define the back-end in terms of a Resource, and not need to write various pieces of boilerplate for them
	//  to communicate with each other.


	// Resource_Client may be a necessary JS file.
	//  Would be JavaScript that runs on a page that's for when it's the client for a single resource?

	// With the clock resource, would want it to have a resource control.
	//  That control could possibly speak to the resource directly.
	//  It could possibly speak to a client-side resource / aggregator that then speaks to the server resource.

	// Serving a page with a component that connects back to the resource...
	//  I think a lot of the activity will be in the user control,
	//  however, it may be that the user control will just be making use of the client-side resources or client-side resource pool.


	var Client_Resource = Resource.extend({
		//'fields': {
		//	'url': String
		//},

		'init': function(spec) {
			this._super(spec);

			if (spec.meta) {
				var meta = spec.meta;
				console.log('1) meta.url', meta.url);
				if (meta.url) this.meta.set('url', meta.url);
				if (meta.type_levels) this.meta.set('type_levels', meta.type_levels);


				//console.log('meta.name ' + meta.name);
			}

			this.data = new Data_Object();

			var that = this;

			
			// both in one parameter here?


			// Why not listen to the resource's data directly?
			//  Should not be a problem when doing it on the client?


			this.data.on('change', function(property_name, property_value) {
				//console.log('');
				//console.log('resource data change property_name', property_name);
				//console.log('property_value', property_value);

				that.trigger('change', property_name, property_value);

			})
			

			//this.meta.set('custom_paths', new Data_Object({}));
			// Those are custom file paths.

			// could have a collection of directories, indexed by name, that get served.

			// Index the collection by string value?
			//this.meta.set('served_directories', new Collection({'index_by': 'name'}));

			// Will also have a URL.
			//  The client resource pool will have a base url.
			//   Maybe default base URL, it's set up to communicate with the server that served the HTML document.

			// could have a variety of server URLs, but let's deal with one for the moment.


		},
		'get': function(callback) {

			var url = this.meta.get('url').value();

			// jsgui lang essentials ends function
			//  test if a string ends with something.

			var ends_dot_json = jsgui.ends(url, '.json');
			//console.log('ends_dot_json', ends_dot_json);

			var json_url;

			if (!ends_dot_json) {
				json_url = url + '.json';
			} else {
				json_url = url;
			}

			//console.log('json_url', json_url);
			jsgui.http(json_url, function(err, res) {
				if (err) {
					callback(err);
				} else {
					//console.log('res', res);
					callback(null, res);
				}
			})
		},

		'notify_change_from_server': function(property_name, property_value) {
			// needs to do some kind of silent set.

			console.log('client resource notify_change_from_server');

			var data = this.data;

			console.log('data', this.data);

			// may need to do a set with options, such as {silent: true};
			//  may need to define message propagation in more detail.
			// Will need to have it working by default, but various things explicitly set in the messages to determine where the message gets
			//  sent to, and presented in which way, including messages acknowlwdging that a previous message has been processed.

			// Don't want this to be too complicated.
			//  I think without much more code we will have the functionality.

			// Could do more detail in some areas later on.




			this.data._[property_name] = property_value;

			// also different ways of raising events or options for the events that are raised.
			//  May need to include more change event metadata.
			//   Such as what initiated the event. Perhaps a user.
			//    Maybe info on the event processing chain. Such as user,data_object
			//    or remote,data_object

			// So the system can tell where the change came from, it can know how to propagate the change and how and whether to acknowledge it.

			// It may be worth having message IDs.
			//  Also aggregating messages that get sent from the server.
			//  Could have submessages within an original one.

			// Want a simple enough core to this.
			//  Easy to understand and powerful, and then more complexity can be built on top of that.

			// I think more properties in change events could be helpful.
			//  The change events could be used in processing the events in some cases, and want to avioud ambiguity and infinite loops.
			// Sending a few extra string codes such as it's initiator, possibly a message id that is the change notification, will help the app process
			//  the changes as they take place in different places.

			// Resource changes on the server. Message sent to clients. Clients change the data in corresponding client-side resource. Client components
			//  listen for changes to the local resource and respond accordingly.

			// Will be using different types of change binding.
			//  There will be some complexity there.
			//  It's going to work easily with default configurations.
			//   Will be very fast to set something up as a resource, and the defaults will make sense.

			// There will be a few different information lifecycles, with changes initiating in various places and being propagated to
			//  various other places.

			//  Could be a place for security to validate that whatever is making the change has got the authority to do so.

			// The change event handling in the Data_Objects probably require more work to them.
			//  Making it so that with different types of changes they notify different things about it.

			// A resource publisher could be listening for changes in a data_object on a server.
			//  The changes originate from the server, and are to be viewed as the 'correct' version of the information.

			// There could be some read-only data sources, like a clock on the internet.
			//  Or setting its time would involve setting the computer's system time. Possibly, but something that may need higher security.

			// The simple clock example will just send data fro mthe server. That data is read-only.
			//  It will be good to make enough detail about the data is sent.
			//  Will be interesting to use this clock example for some other types of data transmission, such as peer-to-peer, with the peers running
			//  node.js and being coordinated by a central server. The central server would send its updates to only some of the clients, and
			//  those clients would send it on. Could maybe have a central system defining where the clients are, and what hops of the chain it is.
			// Could also have the central system maintain keys. Public key encryption. Communication between clients could be encrypted. They could be encrypted
			//  so that other clients would not understand them, and so they need to speak to the client they are assigned by the central server.






			// When a client-resource changes, it may send it's info to the server?
			//  Or only when set is called?


			this.data.trigger('change', property_name, property_value);

			// Or the resource listens to data changes, triggers change on itself when the data changes.

			// Or change on the resource itself I think.







		}
		//'start': function(callback) {
		//	callback(null, true);
		//}
	});
	
	return Client_Resource;
	
	
});