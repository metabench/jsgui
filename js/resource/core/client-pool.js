
/*
define(['../../web/jsgui-html', './client-resource', './pool'],

	function(jsgui, Resource, Resource_Pool) {
*/

var jsgui = require('../../web/jsgui-html');
var Resource = require('./client-resource');
var Resource_Pool = require('./pool');


	// Client_Resource?
	//  I think that makes sense, so that we have something specific which has the URL attached.
	//   It is able to make HTTP requests to the server resource.



	
	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;
	
	//var exec = require('child_process').exec;

	// Perhaps this will have HTTP endpoints as well?
	//  Maybe we can access it through url/resources/

	// Perhaps a resource publisher, or a few of them could be useful.
	//  HTTP_Resource_Publisher?
	//  Generally publishes a resource over HTTP.
	//   Will have some authorization and authentication properties, hooked up with the proper providers.

	// This may be the place in which remote access to the resources is given.
	//  It would make sense.
	//  Perhaps it is worth using a resource publisher? Then is that a resource?
	//  I think the resource pool may be the sensible point of access.
	
	var Client_Resource_Pool = Resource_Pool.extend({
		'fields': {
			'url': String
		},
		'init': function(spec) {
			this._super(spec);



			
			// will add the Resource_Local_Server_Information
			
			
			// Will be nice to set them with an object.
			//  Not just the normal spec.
			//  Maybe can see if the spec matches fields?
			//  Or copy fields from the spec?

			// Have remote server info
			//  Allow for info on a number of different remote servers.
			//   (0 will be the one it got served from or the equivalent jsgui service provider)
			// Have local browser info
			// Other local info as necessary



			/*
			var lsi = new Local_Server_Info({
				'meta': {
					'name': 'Local Server Info'
				},
				'startup_type': 'auto',
				'access': {
					'full': ['server_admin']
				}
			});
			
			this.add(lsi);
			*/

			// And a resource publisher resource.
			//  It goes in the pool, and it publishes other resources (over HTTP)
			//   The resource pool contains its own publisher.

			/*
			var publisher = new Resource_Publisher_HTTP({
				'meta': {
					'name': 'HTTP Resource Publisher'
				},
				'startup_type': 'auto',
				'access': {
					'full': ['server_admin']
				}
			});
			
			this.add(publisher);

			*/
			
			
		},
		'start': function(callback) {

			// download the resource information from the server...
			//  http request.

			// Think that will be in jsgui-client.
			//  It's worth making the jsgui-client bundle

			// Maybe some other jsgui client bundles, like jsgui-client-platform
			//  including all platform client components. Then there could be some other builds that include more thigns still,
			//  like bunches of controls / components for different customers / websites.

			//console.log('Client_Resource_Pool start, window.location ' + window.location);

			// need to get the resources url...


			var _request_resources = function() {
				var loc = window.location.toString();
				var pos1 = loc.indexOf('//');
				var pos2 = loc.indexOf('/', pos1 + 2);
				var part1 = loc.substr(0, pos2 + 1);
				//console.log('part1 ' + part1);

				var that = this;

				// carry out the HTTP request.
				//  Use the result to initialize the various resource objects in a collection...
				//  or using the pool really.

				// Perhaps the client pool will have been told what resources are there.
				//  Also, the client pool could be used to access a single resource on the server, and have a bunch of resources available on the client.
				//  These resources will be a bit like global variables with an asyncronous interface.

				// Not sure about assuming the server will provide the resources list a /resources

				// We don't want that default, it makes an extra requirement for the server to fulfill.

				
				this.set('url', urlResources);

				var urlResources = part1 + 'resources';
				console.log('urlResources', urlResources);

				// An http abstraction may be good for older browsers, or polyfill elsewhere.
				var oReq = new XMLHttpRequest();
				oReq.onload = function(res) {
					console.log('oReq.responseText ' + oReq.responseText);

					var objResponse = JSON.parse(oReq.responseText);

					// Then for each of them we create an object.

					if (tof(objResponse) == 'array') {
						each(objResponse, function(i, v) {
							var tv = tof(v);

							if (tv == 'string') {
								// it's the name of the Resource.

								var resource = new Resource({
									'meta': {
										'name': v,
										'pool': that,
										'url': urlResources + '/' + v
									}
								});
								that.add(resource);
								//console.log('resource', resource);
							}
							if (tv == 'object') {
								//console.log('v', v);
								var resource = new Resource({
									'meta': {
										'name': v.name,
										'pool': that,
										'url': urlResources + '/' + v.name,
										'type_levels': v.type_levels
									}
								});
								that.add(resource);

							}
						})
					}

				};
				oReq.open("get", urlResources, true);
				oReq.send();
			}

			callback(null, true);


			



			/* From resource_pool init.



			this._resources = new Collection({
				'index': {
					//'sorted': [['name']] // similar to above, but literally it's a single index in a list of indexes, that index just has one field, in a list of fields
					
					// The syntax for specifying a (sorted) index is for an attached field.
					//  It gets the data for the attached object.
					// {'attached': {'meta': 'name'}}
					'sorted': [[{'attached': {'meta': 'name'}}]]
					//sorted: [[['attached', 'meta', 'name']]]
				}
			});

			*/





			// http://192.168.1.14:5009/resources
			//  not so sure it needs to make an HTTP request.
			//  Perhaps it can find out about the resource types?

			// Though, the resource pool having the basic information about the resources makes a lot of sense.
			// Perhaps have some more information about the resource, metadata about what they do?
			//  Their API versions?

			// Some resource type info would help.
			//  There could be published APIs on how to access particular resources, maybe call them interfaces.

			// ["Local Server Info","HTTP Resource Publisher","Login HTML Resource","Application Router","Local File System","Web Admin","Info","Site JavaScript","Site CSS","Site Images","Authentication","metabench"]

			// Local Server Info
			//  See a bit of info about the local server
			// HTTP Resource Publisher
			//  Determine how HTTP resources get published? Will see what would be good to administer here, but
			//  we want many of the settings to be open.
			// Web Admin
			//  Would be a good resource to interact with. Through resource mechanisms we will be able to alter the
			//  content of the website.
			// Local File System
			//  Having access to the server file system.
			//   Could modify the site files as they are running.
			// Info
			//  This is a particular database table I think.
			// metabench
			//  This is a database.

			// Identifying the types of resources when /resources is called would be useful. A bit more metadata too
			//  if appropriate.





		}
		
	})
module.exports = Client_Resource_Pool;
	
	
	//return Client_Resource_Pool;
	
	
//});