
var jsgui = require('../../web/jsgui-html'), os = require('os'), http = require('http'),
libUrl = require('url'), Web_Resource = require('./web'),
JeSuisXML = require('../../web/jsgui-je-suis-xml'), Cookies = require('cookies'),
Resource_Control = require('../../web/controls/advanced/resource-base')
var Server_Page_Context = require('../../web/server-page-context');

//fs = require('fs'), fs2 = require('../fs/jsgui-node-fs2-core');

/*

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../../web/jsgui-html', 'os', 'http', 'url', './web', '../../web/controls/advanced/resource-base',
	'../../web/jsgui-je-suis-xml', 'cookies', '../../web/server-page-context'],

	function(jsgui, os, http, libUrl, Web_Resource, Resource_Control,
		JeSuisXML, Cookies, Server_Page_Context) {
*/

	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;


  // Looks like this publishes an HTML interface for the moment.

	// This one is for publishing a single resource

	// A resource may get published in more than one way though:
	//  HTML interface (provides an HTML client)
	//  JSON interface (get, set)
	//  Websockets (subscribe to events being the most important, but also set and update may be important)

	// Will make it so that the publisher can do all these at once under an address, but adding bits to the path.
	//  Make it take less boilerplate code to do all of these.


	// May route the responses in elsewhere.
	//  Want some kind of flexibility for websocket routing , but for it to work out-of-the-box as well.


	var Resource_Publisher = Web_Resource.extend({

		// should take the resource to publish as the field...?

		'init': function(spec) {


			this._super(spec);
			//console.log('spec.resource', spec.resource);
			if (spec.resource) this.meta.set('resource', spec.resource);



			//var resource = this.get('resource');
			//console.log('resource', resource);
				//throw 'stop';
			//var meta = this.meta;

			//console.log('Publisher this.meta', this.meta);

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
		'set': fp(function(a, sig) {
			// All params as one object for the resource?
			//console.log('Info Resource set sig ' + sig);
			// gets the table / collection
			var meta = this.meta;

		}),
		// Having some resources processing HTTP requests may not be too bad.
		//  However, we could have an automatic layer for this so that they do not have to be programmed
		//  individually.


		// The publisher could do more then just respond.
		//  May also need to serve some client script that gets downloaded by the client and serves the resource script.
		//  Need this to be automatic / neatly encapsulated.


		// publish(resource, ...)

		// need a way to get the resource to send its info through a websockets channel.

		// Also need to recieve information on the resource.
		//  We could change a property on the client, and that info will be transferred with sock.

		// Listening to updates through sock... would then call the resource's get or set.

		'sock_broadcast_changes': function(server) {

			// with sock, need to send to every connection.
			//console.log('sock_broadcast_changes');


			var resource = this.meta.get('resource');
			var resource_name = resource.meta.get('name');

			resource.on('change', function(key_name, value) {
				console.log('resource change');
				// Perhaps need to put more into one parameter.
				//  Both name and value...

				//console.log('change_e', change_e);
				//var key_name = change_e[0];
				//var value = change_e[1];

				// May need to parse / encode the value.

				//console.log('value', value);

				var tval = tof(value);
				//console.log('tval ' + tval);

				if (tval == 'date') {
					value = {
						'__type': 'date-iso-8601',
						'value': value.toISOString()
					}
				}

				var e_res = [resource_name, 'change', key_name, value];

				//console.log('publisher resource change event ', e_res);
				//console.log('will broadcast change with sock');

				//

				server.sock_broadcast(e_res);

			})
		},


		// also needs to respond to resource-client.js.




		'respond': fp(function(a, sig) {

			var req, res, content_type, my_Resource_Control, resource_client_path, included_css;

      // length 2:

      console.log('respond sig', sig);



			if (a.l == 3) {
				req = a[0];
				res = a[1];
				content_type = a[2];
			}

			if (a.l == 4) {
				req = a[0];
				res = a[1];
				content_type = a[2];
				my_Resource_Control = a[3];
			}

			if (a.l == 5) {
				req = a[0];
				res = a[1];
				content_type = a[2];
				my_Resource_Control = a[3];
				resource_client_path = a[4];
			}

			if (a.l == 6) {
				req = a[0];
				res = a[1];
				content_type = a[2];
				my_Resource_Control = a[3];
				resource_client_path = a[4];
				included_css = a[5];
			}



			// May have some further data.
			// best not to hide it in the req I think

			// The other data being the control to use.
			//  Not using a standard Resource_Control perhaps.


			// Probably should not pay attention to the full URL path like this.
			//  It's root URL could be assigned in the application resource router.

			// Should carry out get on the resource.
			//  Will need to use params in some cases. In some cases the params will have been found by the Application Router.
			//  Params should be parsed prior to this I think - need to make it a well defined stage.

			// Maybe have different types of responses.
			//  JSON should probably be more of a focus...
			//  But publisher should publish as HTML as well.

			// Also want to deal with socket connection.
			//  But getting he right granularity of change event listening right may be worth doing first.
			//  Could have some nice way of coding which changes need to be broadcast immediately.

			// Have a means to listen to the resource through websockets.
			//  Then the HTML interface could keep updated using the websockets.

			// Not sure quite how much to include of a specialised client in the HTML inteface for a resource
			//  I think there should be a default basic client, and also enhanced clients that are specific to that resource.
      var resource = this.meta.get('resource');


			// We could read the content type from the end of the req...
			//console.log('req keys', Object.keys(req));

			var url = req.url;
			var method = req.method;
			var params = req.params;
			var wildcard_value;
			console.log('url', url);
			console.log('method', method);
			console.log('params', params);

			if (params) {
				wildcard_value = params.wildcard_value;
			}

      console.log('content_type', content_type);



			// Detect if we are looking for JSON

			var ends_dot_json = function(str) {
				//console.log('str', str);
				if (!str || (str.length < 5)) return false;
				return (str.substr(str.length - 5) == '.json');
			}



			var edj = ends_dot_json(wildcard_value) || ends_dot_json(url);
			//console.log('edj', edj);

      var is_json = edj || content_type === 'json';

      var json_path;

			if (edj) {
				var pre_dot_json_path = '';
				if (wildcard_value) pre_dot_json_path = wildcard_value.substr(0, wildcard_value.length - 5);

				var resource = this.meta.get('resource');
        json_path = pre_dot_json_path;
      } else {
        json_path = decodeURI('/' + wildcard_value);
      }

      if (is_json) {
        resource.get(json_path, function(err, res_resource) {
					if (err) {
						throw err;
					} else {
						// And include metadata.

						var output = {
							'resource': {
								//'meta': {
								//	'name': resource.meta.get('name') + ''
                  //'name': 'james'
								//},
								'data': res_resource
							}
						}

						var resource_type_levels = resource.meta.get('type_levels');
						console.log('resource_type_levels', resource_type_levels);

						if (resource_type_levels) {
							output.resource.meta.types = resource_type_levels;
						}

						if (pre_dot_json_path) {
							output.inner_path = pre_dot_json_path;
						}

            console.log('output', output);

						var json = JSON.stringify(output);
						var mime_type = 'application/json';
						res.writeHead(200, { 'Content-Type': mime_type });
						res.end(json, 'utf-8');
					}
				})

      } else {
				if (!wildcard_value) {


					console.log('Resource_Publisher_HTTP html respond');

					// Put together a JSGUI page.
					//  It should be easy to generate a page and access the body.

					var server_page_context = new Server_Page_Context({
						'req': req,
						'res': res
					});

					var hd = new jsgui.Client_HTML_Document({
						'context': server_page_context
					});




					hd.include_client_css();

					if (included_css) {
						hd.include_css(included_css);
					}

					// want to be able to include some specific css files.



					// also include the jsgui-client JavaScript.
					//  Therw will not be much / any extra JavaScript that needs to run alongside the client.

					// On this page, want to render a component that will keep updating continuously.
					//  Want it to be very easy to set up, but not at the expense of clarity.

					// So there will be a resource client?
					//  I think a general resource client HTML component would be useful.
					//  Resource client bootstrap could be a useful way of starting up a real-time / data driven project.

					// For the moment will not got through a communications broker / channel.
					//  The client side resource consumer will connect directly with the server.

					//hd.include_css('css/app.css');

					//hd.include_js('js/modernizr-latest.js');

					// Possibly need an easier way of including the JSGUI client.
					//  Not so sure about having the client connect to the server by default.

					// Could have different versions of jsgui-client, one of which autoconnects back to the server on a socket connection.
					//  Not so sure about it haveing all the resource stuff.

					// Perhaps jsgui-resource-client would autoconnect back to the resource it was served from.
					//  Could have it access other resources too, but there would be client controls for doing so.

					// And want to be able to serve framework files easily under /js


					//hd.include_jsgui_client('js/app.js');


					// Not necessarily...
					//hd.include_js('http://cdn.sockjs.org/sockjs-0.3.min.js');


					// Somehow send the resource name along as well?
					//  Or it can get information on the resource by calling the url + '.json', and that does a 'get' on the resource, including the resource's name.
					//  At some point will have in improved way of loading initial data into the client.



					// More like we need to serve a specific resource client JavaScript.
					//  I think that would mean putting an entry into the Routing Tree.



					//console.log('resource_client_path', resource_client_path);
					hd.include_jsgui_resource_client(resource_client_path);

					// <script src="http://cdn.sockjs.org/sockjs-0.3.min.js">
	  				//</script>



					// This needs to include the resource client in this case.
					//  Will not always be connecting to a resource server - however we can keep this concise and have a small amount delivered to the client.



					// The jsgui client would include the necessary client resource / resource connection info.
					// Would need a Resource class on the client side too.


					// I send something to the client, as JS, with a bit of information about the resource it's connecting to.
					//  The client code should already have the necessary code for the actual resource classes.

					// It just needs some info.
					//  Probably need more work on client side resources.
					//  It may be able to connect to the URL for the resource it is looking at / the page's resource.

					// Want to return some kind of client-side app JS.
					// perhaps published-resource-client.

					// Will have the client check back to the server to get more information about the resource (I think)
					//  Will do a JSON HTTP get request.










					var body = hd.body();


					// and the resource control will then connect to that same resource on the client through the resource pool.


					var resource_control = new (my_Resource_Control || Resource_Control)({
						'context': server_page_context,
						'resource': this.meta.get('resource')
					});

					// Need to somehow defer the rendering of the control until it is ready.
					//  we could make an async render function that waits until they are ready before rendering.

					// Controls could have a 'status' field.
					//  Need to make controls async in this way if we are rendering them based on asyncronously obtained data.

					// When rendering check all controls to see if they are ready?

					resource_control.active();


					// The resource control will be activated on the client.
					//  It will be bound to the client-side resource.
					//  Updates to the client side resource will cause the resource_control to update.

					// Updates done by the user would also be sent to the server.
					//  Possibly validated at different stages too.




					body.add(resource_control);

					// Also, include a resource control



					// Inside the body, we need a table of some sort showing the data.
					//  Could do resource.get as well, and then handle the results.
					//  Want to send something to the client that can refer back to the resource on the server.


					// Rendering an HTML table, and then on the client it gets activasted?

					// I think we need to use some kind of connected data control.
					//  On the client, it will activate, it will know what resource to ask for, and it will connect to that resource, either directly, or using the resource
					//  broker.
					//

					// Could use an object or data object viewer of some type.

					// Directly referencing a Resource with a Control that gets rendered...
					//  Need to have it so that some pathways get put in automatically.

					// Resource_Control?
					//  Something that renders a resource, first on the server, then on the client it connects to the resource on the server.

					// Want a general control that interacts with a resource on the server.
					//  It could become a very useful way of encapsulating client-server functionality.

					// Then on the client side, connects to the resource(s) on the server, may use websockets for communications.


					// An async / deferred rendering function would provide the result in its callback.



					/*
					var html = hd.all_html_render();

					var mime_type = 'text/html';
					//console.log('mime_type ' + mime_type);

					res.writeHead(200, { 'Content-Type': mime_type });
					res.end(html, 'utf-8');
					*/
					//console.log('pre deferred render');

					hd.all_html_render(function(err, deferred_html) {
						if (err) {
							throw err;
						} else {
							//console.log('deferred_html', deferred_html);

							var mime_type = 'text/html';
							//console.log('mime_type ' + mime_type);

							res.writeHead(200, { 'Content-Type': mime_type });
							res.end(deferred_html, 'utf-8');
						}
					});

				}
			}



			//throw 'stop';

			//content_type = content_type || 'html';

			// This should display it as HTML?
			/*
			if (content_type == 'html') {
				// I think showing the data and streaming updates is the best basic HTML display for a Resource.
				//  Sends an HTML client that connects back to the Resource, using websockets / socks.js

				// At first serve the page just with the result / results.









				// Would be good to include some kind of connected data view / control.





				//var html = '<html><head></head><body><h1>Resource_Publisher_HTTP response</h1></body></html>';
				//var mime_type = 'text/html';
				//res.writeHead(200, { 'Content-Type': mime_type });
				//res.end(html, 'utf-8');

			}

			if (content_type == 'json') {
				//console.log('Resource_Publisher_HTTP json respond');

				var resource = this.meta.get('resource');
				//console.log('resource', resource);
				resource.get(function(err, res_resource) {
					if (err) {
						throw err;
					} else {
						// And include metadata.

						var output = {
							'resource': {
								'meta': {
									'name': resource.meta.get('name')
								},
								'data': res_resource
							}
						}

						var json = JSON.stringify(output);
						var mime_type = 'application/json';
						res.writeHead(200, { 'Content-Type': mime_type });
						res.end(json, 'utf-8');
					}
				})


			}
			*/





		})
	});


	//return Resource_Publisher;


//});

module.exports = Resource_Publisher;
