// Not sure to what extent resources will publish themselves over HTTP.

// Could make a Distributed Access type provider.
//  In some contexts, it will serve HTTP per usual for the resource.
//  In other client or peripheral server roles/situations it's goint to connect up to the central data resource.






if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../web/jsgui-html', 'os', 'http', 'url', './core/resource',
	'../web/jsgui-je-suis-xml', 'cookies'], 

	function(jsgui, os, http, libUrl, Resource,
		JeSuisXML, Cookies) {

	
	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;

	// This can have a Table_Data_Resource.
	//  It makes use of a table or collection in a database.
	//  Uses the table and atabase resource API, rather than needing a reference to them.

	// Info on a single table...
	//  Not so sure this should be for all of the info in a website.

	// Perhaps we could have more than one info resource?

	// Perhaps a resource-data-table would be good?
	//  We want it to be abstract from the implementation of the DB at the level of where the resource is called.

	// Just for one table basically?

	// resource-web-content?
	//  That could be quite useful.
	//   The info resource could still be used to hold a few other things.
	
	// Needs to deal with both the structure and the content.
	//  However, both could be stored in a single table.

	// In the resource pool.
	//  Needs to be able to process HTTP requests.
	//  HTTP requests will be routed to it.
	//   When the application router sees a request /resources/...
	//    it has the Resource_Publisher_HTTP serve the request.
	//    Resource_Publisher_HTTP needs to do A&A for security.
	//     For the moment will only allow the root user access, will allow full or very substantial access to root.

	// The https access means causes this to access the routing table, find the resource that is being referred to,
	//  and do the appropriate asyncronous action based on the HTTP verb provided.




	// Get being the method used for this?
	//  I think process_request may be better, as we see what it refers to before branching for the method
	//  (unlike express, as far as I know).

	// Publishes the resource as a service... though a transformation could be done to make it into HTML / an interactive
	//  HTML document.


	// Will need to be a control for this...

	// Publishes all the resources in the pool.
	// Also want the means to publish a single resource.

	//  Having the publisher as a resource would assist in administration.

	// This one is really a Resource_Pool_Publisher.

	// Publish single resource

	// Need to be able to publish a resource in general.
	//  May need to be published in different ways
	//  JSON interface
	//  HTML interface
	//  Websocket connection

	// Want to make some very simple data resources to test them.

	// The purpose is to write resources in terms of the data they manipulate rather than focusing on transport mechanisms or db mechanisms in some cases.
	//  So that means focusing on writing transport mechanisms.

	// I think a clock resource would be a useful one to have.
	//  Mainly useful for testing - but useful to have as a core component.

	// Resources may not only be for the web but for the internet.

	// Could make a new Resource folder to put the resources.
	//  The resources are a lot to do with bridging the gap between different machines.
	//  A Distributed Data Structure could function as a Resource.

	// Publishing multiple resource seems like the way.
	//  Perhaps operating through a Pool.
	//  Also want to make resource access possible through a Resource Access Pool or Resource Access Router.


	// controls/resource
	// controls/resource-pool


	var Resource_Publisher_HTTP = Resource.extend({
		
		'init': function(spec) {
			this._super(spec);

			var meta = this.meta;

		},
		'start': function(callback) {
			//console.log('lfs start');
			callback(null, true);
		},
		'get': function(key, callback) {
			// All params as one object for the resource?

			// gets the table / collection
			var meta = this.meta;
			

		},

		// Having some resources processing HTTP requests may not be too bad.
		//  However, we could have an automatic layer for this so that they do not have to be programmed
		//  individually.


		'process': function(req, res) {

			// Probably should not pay attention to the full URL path like this.
			//  It's root URL could be assigned in the application resource router.

			
			console.log('Resource_Publisher_HTTP process');
			var rurl = decodeURIComponent(req.url);

			// The resources could be published in different places.



			if (rurl.substr(rurl.length - 1) == '/') rurl = rurl.substr(0, rurl.length - 1);
			if (rurl.substr(0, 1) == '/') rurl = rurl.substr(1);

			console.log('rurl', rurl);

			// We split up the url so that we get the resource and restfully indicated subitems.

			var surl = rurl.split('/');
			console.log('surl ' + stringify(surl));

			// OK, so do we have the resource pool.

			// Would be good to have some client side code that can interact with this.
			//  


			var pool = this.meta.get('pool');
			console.log('pool ' + pool);

			if (surl.length == 1) {
				// Want to get the names of / basic info on all the resources.

				// Could return the names of resources as an array.
				//  Maybe could have a way of asking for more detailed information about all of them too.

				var resources = pool.resources();
				var arrRes = [];

				// Also want to publish some metadata about these resources.
				//  Do they have a __type or similar?
				// or type property through data_object?

				// Also want to get the layered types for that resource.
				//  That information will probably be useful to determine which control to display it in.
				//  There will likely be custom controls for displaying particular types of resource, such as
				//  for an rdb table, or a mongo collection.

				// Anyway, will make use of a RESTful interface to the resources, and will also have somewhat
				//  general purpose resource explorers using that data (though could refactor functionality later).


				var resourceInfo;
				// Could have some further basic information about the resources.
				//  They may be called subresources? Maybe fields?
				//  I think fields makes sense, its a way of making fields available over the resource / http system.

				// Description could be a good thing to call it...
				//  fields may be the right name, though it is fields over the http interface.

				// Can just have an array of field objects, give them names.
				//  Generally want the resource so it can describe itself, and with a bit of intelleigence a client can
				//  make use of that resource.





				resources.each(function(i, resource) {
					// Want to find out from the resource what fields / field like info it has.
					//  rfields?




					resourceInfo = {
						'name': resource.meta.get('name'),
						'type_levels': resource.meta.get('type_levels')
					}

					arrRes.push(resourceInfo);
				});
				// and write that as JSON into the HTTP request.

				res.writeHead(200, {'Content-Type': 'application/json'});
				//var html = doc.all_html_render();
				//console.log('html ' + html);

	  			res.end(JSON.stringify(arrRes));



			} else {
				var resource_name = surl[1];
				console.log('resource_name ' + resource_name);

				var named_resource = pool.get_resource(resource_name);


				// we can carry out that request on the resource...
				//  maybe better than passing the request and response to the resource.

				// resource.get(path, callback)
				//  and it gets the object requested.

				// resource/meta?
				//  will that be a different path, or different means of interacting with it?

				// Requests for metadata with REST?
				//  Requests to interact with metadata over REST?

				// Want get requests to go to the resource...

				// resource_name?meta=true/

				//  May be better to have a possible query string after the resource name part of the path.
				//   So we could give it a command, or refer to the metadata.

				// This should allow for quite a lot of info to flow into a web browser from the server, using
				//  a corresponding client-side resource pool.

				// resource_name/?command=restart/
				// resource_name?command=restart/
				//  It could work out OK really.

				// I think another path level to specify it as metadata may work OK,
				//  no so sure about two possible query strings in a URL though.

				// that could be a shortcut that breaks out of the stricter method of having everything go to get or verb.

				// resource_name?meta/ aboids confusion about if there is a property called ?meta, and there could be....
				//  perhaps queries should be in their own part of the path.

				// Some resources will have their own HTTP request handlers.
				//  Many will not, and will make use of the resource publisher to publish them over HTTP.

				// Doing a database query...
				
				// resource_name/?meta/

				// resource_name/?meta=true/
				// resource_name/?meta=true/password

				//  would that get all the metadata?
				//  
				//  meaning that we get to interact with the resource's meta object.
				//  that could mean something like creating a new table in the database
				//  or finding out how many tables there are.
				// may get / set database connection properties
				//  could get a resource to restart.





				// then can that resource do some kind of get / set / http verb based on what is given in the request?
				//  I'm not so sure that resources will generally be able to process HTTP requests.
				//  I think they will be bale to process some kinds of requests though.
				//   Possibly could have http processing but maybe want a bit of a block between the net and these objects?
				//console.log('named_resource ' + tof(named_resource));
				//console.log('named_resource ' + stringify(named_resource));
				//throw 'stop';
				// then we do a resource.get?

				// When we refer to a fairly large resource, we don't get everything within it.
				//  we want to get some relatively basic info about it.
				// Metadata on where to go further with it.
				//  Maybe we get metadata without doing ?meta in many cases.
				//  Perhaps it will have URLs?
				//   We could put a few more things into the request to get some specific things.

				// Really, we want some resources to have a get function for no parameters given.
				//  Maybe saying what child resources it has.
				//   (Or linked resources)
				//  A Mongo Database will have Collections as children
				//   And Server as parent. I'm not sure it's necessary for the Resource to keep track of that
				//    relationship itself - though perhaps it could help.
				//  Basically, when queried, we can get the resource to return some relatively basic info about itself.
				//   Enough to help browsing other resources I think.
				//  Perhaps a parent resource would help... maybe that would be given by its path?
				//   Or we can work out its parent resource from the path anyway, child resources are more important.
				//   Maybe will mark the parent resource where possible.

				// Resources exposing other resources, and they show up in the GUI...
				//  I think it makes sense if a resource returns a few things:
				//   meta
				//   virtual (virtual subresources)
				//   resources

				// Virtual subresources could be treated as resources on the client, but would not be implemented
				//  as another resource. For example, there will be a collection of collections in a mongo db resource
				//  

				// May be worth making a Collection_Resource - represents a collection as a resource?
				/// 



				if (surl.length == 2) {
					named_resource.get(function(err, res_get_named_resource_value) {
						if (err) {
							throw err;
						} else {
							// Exposes the subresources.

							console.log('res_get_named_resource_value', stringify(res_get_named_resource_value));

							// Resource.get should not get a circular structure.
							//  Some references may need to be changed.

							res.writeHead(200, {'Content-Type': 'application/json'});
							//var html = doc.all_html_render();
							//console.log('html ' + html);

				  			res.end(JSON.stringify(res_get_named_resource_value));
						}
					})
				}

				// otherwise, we carry out a different get operation on the resource, giving it the rest of the url
				//  as a path for what the resource should get.
				//   want something so that a (mongo) database resource keeps track of what collections are available to it
				//    want to be able to refer to a collection quickly, but it's like to use an async method.

				if (surl.length > 2) {
					var rest = surl.slice(2);
					console.log('rest ' + stringify(rest));
					var fsRest = rest.join('.');
					console.log('fsRest ' + fsRest);

					// then do get on the named resource...

					// Also need to be able to get in an output format...
					//  Maybe removing links to parents, as with URL paths we can find the parent very easily.

					named_resource.get(fsRest, function(err, res_get_named_resource_path_value) {
						if (err) {
							throw err;
						} else {

							console.log('res_get_named_resource_path_value', res_get_named_resource_path_value);
							// The get result is now the result of getting a Resource_Collection,
							//  which is not specifically taylored for JSON output.

							// Need to be able to easily get the JSON from the collections and data objects.

							// Also maybe just get it's value...
							//  a collection would return its value as a JS object.


							var js_res = res_get_named_resource_path_value;
							if (typeof js_res.value == 'function') {
								js_res = js_res.value();
							}
							//var json_res = res_get_named_resource_path_value.toJSON();
							//console.log('json_res', json_res);
							console.log('js_res', js_res);

							//console.log('* res_get_named_resource_path_value', stringify(res_get_named_resource_path_value));
							res.writeHead(200, {'Content-Type': 'application/json'});
				  			res.end(JSON.stringify(js_res));
						}
					})
				}

			}

			// then we get that resource by name...

			

			// then we give that resource the request?
			//  or we see what the request is about a bit further?

			// We may be requesting metadata.
			//  Possibly we want to use some kind of Resource-Data_Object adapter.
			//   Though the Resource itself may kind of be that. Not sure.

			// We generally want the publishing mechanism to accept and publish any resource, or at least
			//  control over it.
			// 








		},
		'set': fp(function(a, sig) {
			// All params as one object for the resource?
			//console.log('Info Resource set sig ' + sig);
			// gets the table / collection
			var meta = this.meta;
			
		})


	});
	
	
	return Resource_Publisher_HTTP;
	
	
});