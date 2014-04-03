if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['sockjs', './jsgui-html', 'os', 'http', 'url', '../resource/core/resource', './jsgui-je-suis-xml',
	'cookies', '../resource/local-server-info', '../resource/local-file-system',
	'../resource/core/server-pool', '../resource/core/application-router', '../resource/file-system-web-admin', '../resource/web-admin',
	'../resource/core/site-javascript', '../resource/core/site-css', '../resource/core/site-images',
	'../resource/info',
	'../resource/login', './server-page-context'], 

	function(sockjs, jsgui, os, http, libUrl, Resource, JeSuisXML, Cookies,
		Local_Server_Information, Local_File_System, Server_Resource_Pool, Application_Router,
		Resource_File_System_Web_Admin, Resource_Web_Admin, Site_JavaScript, Site_CSS, Site_Images, Info,
		Login, Server_Page_Context) {
	
	var Server = {};
	
	var Login_Html_Resource = Login.Html;
	// Test if node features are supported?
	
	// This should be running in node.js
	
	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;
	
	//each(Basic_Controls, function(ctrl_name, ctrl_constructor) {
	//	jsgui[ctrl_name] = ctrl_constructor;
	//})
	
	var exec = require('child_process').exec;

	var JSGUI_Server = Enhanced_Data_Object.extend({

		'init': function(spec) {
			this._super(spec);
			var resource_pool = new Server_Resource_Pool({
				// Other things can be made available through the server resource pool.
				'access': {
					'full': ['server_admin']
				}
			});

			// Having a Login_Html_Resource?
			//  Could be fairly useful as standard.
			//  Also want to be able to add them fairly easily.

			// OK, but not sure about these having to depends on the server as well?
			//  Perhaps there is a server-core.
			//  There is the server-page-context located at the top.
			//   That could be its own module. Various page servers


			// (A Page Server? That could be good terminology for a part of the application that serves a partiuclar page.)
			//  Likely to be availabe from a URL path.
			//   Useful subdivision, will be possible in many cases to develop separate pages separately in an app.

			// Having the login as a resource makes sense because it's able to be added to a pool, seen to be there,
			//  so the system can provide some information about it.
			// Would be possible to swap it for a 2 facter authentication login for example.



			resource_pool.push(new Login_Html_Resource({
				'meta': {
					'name': 'Login HTML Resource'
				}
			}));


			resource_pool.push(new Application_Router({
				'meta': {
					'name': 'Application Router'
				}
			}));

			resource_pool.push(new Local_File_System({
				'meta': {
					'name': 'Local File System'
				}
			}));

			resource_pool.push(new Resource_Web_Admin({
				'meta': {
					'name': 'Web Admin'
				}
			}));



			//resource_pool.push(new Resource_File_System_Web_Admin({
			//	'meta': {
			//		'name': 'File System Web Admin'
			//	}
			//}));

			// Could possibly have a Bundle_JavaScript resource for getting a bundle's JavaScript?
			//  Or the bundelling system could access the server?
			//   The server could probably help with some / much of the bundle preparation.
			//    Though this would maybe require looking into more of the structure of the files to ensure they are all 
			//     there, rather than responding to requests.

			// Maybe it should be done in a way where the bundle is specified.
			//  It will have some simple HTML, the main project's control, that will be called when creating the bundle.

			// I think a jsgui-bundle module would be of use, where it may work in a few stages.
			//  It may be given some input about what files to copy over, and then copy them.
			//  More intelligence could be used automatically to discover what is in the bundles.

			// May be useful to have a login resource by default.
			
			// Not so sure about including an authtication resource by default...
			//  Should maybe add it separately.

			// An Info resource would make sense as a point through which the site's information/content can be got/set
			//  Perhaps call it a web-content resource?
			//  Just resource-content?

			// Can contain things like pages, articles?
			//  website-info could have structure too.

			// I think some more work can be done on the general information resource.
			//  It will have some capability of connecting to one or more db resources.

			// Resources may not necessarily only be for web. There could be various application components that are within a resource
			// pool. It may be better than global variables, also has the assumption of asyncronous access, which means that a wide
			// variety of data sources can be used.

			// Some resources will act like collections, some like objects.

			// Want it so that there is the Info resource to start with in a website.
			//  It will then be connectable to various databases.





			resource_pool.push(new Info({
				'meta': {
					'name': 'Info'
				}
			}));


			resource_pool.push(new Site_JavaScript({
				'meta': {
					'name': 'Site JavaScript'
				}
			}));

			resource_pool.push(new Site_CSS({
				'meta': {
					'name': 'Site CSS'
				}
			}));

			resource_pool.push(new Site_Images({
				'meta': {
					'name': 'Site Images'
				}
			}));


			// Resource_File_System_Web_Admin
			
			this.set('resource_pool', resource_pool);
			//console.log('resource_pool ' + stringify(resource_pool.start));

			//var rp = this.get('resource_pool');
			//console.log('this._.resource_pool ' + this._.resource_pool);
			//console.log('rp ' + stringify(rp.start));
			//throw 'stop';

		},

		
		'start': function(port, callback, fnProcessRequest) {
			//throw 'stop';
			// The resource_pool is not just a Data_Value. need to fix some get or create new field value code.
			//console.log('start');
			var resource_pool = this.get('resource_pool');
			console.log('resource_pool ' + stringify(resource_pool));
			//throw 'stop';

			var that = this;

			resource_pool.start(function(err) {
			    if (err) {
			        throw err;
			    } else {
                    //console.log('jsgui-server started');
                    
                    var rp = that.get('resource_pool');
                    //console.log('rp ' + rp);


                    // get_resource should do the query for the 
                    var lsi = rp.get_resource('Local Server Info');
                    //console.log('lsi ' + stringify(lsi));
                    var js = rp.get_resource('Site JavaScript');
                    var css = rp.get_resource('Site CSS');
                    var images = rp.get_resource('Site Images');
                    var login = rp.get_resource('Login HTML Resource');
                    var admin = rp.get_resource('Web Admin');
                    var resource_publisher = rp.get_resource('HTTP Resource Publisher');

                    // .get on a resource.
                    //  could get a sub-resource.


                    var nis = lsi.get('networkInterfaces');
                    //console.log('nis ' + stringify(nis));


                    // find the non-local ipv5 interfaces

                    // Could listen on all of those addresses.

                    // For this find query, we want it to consult indexes if possible.
                    //  I don't think any of this is indexed (right now) anyway

                    // Find all root level objects with this characteristic
                    //  Searching for objects. Objects tested to see if they match query.

                    /*
                    var matching = nis.find({
                    	'entries': {
                    		'family': 'IPv4',
                    		'internal': false
                    	}
                    });
					*/

                    // Find all entries with this characteristic.
                    //  Searching for entry objects. Objects tested to see if they match query.
                    // nis.extract
                    //  addresses within items that match a 'find' query.


                    var matching = nis.find('entries', {
                    	'family': 'IPv4',
                    	'internal': false
                    })

                    // matching.extract


                    //console.log('matching ' + stringify(matching));

                    // Then extract the IP addresses themselves.

                    var ipAddresses = [];

                    each(matching, function(i, v) {
                    	var ipAddress = v.get('address');
                    	ipAddresses.push(ipAddress);
                    });


                    // get_resource - get should do the job!
                    var application_router = resource_pool.get_resource('Application Router');

                    console.log('ipAddresses ' + stringify(ipAddresses));
                    //console.log('application_router ' + stringify(application_router));
                    //console.log('resource_pool ' + stringify(resource_pool));

                    // And add other item(s) to the routing tree
                    //  will do js handling

                    //  will do css handling


                    var rt = application_router.get('routing_tree');

                    // Should set up login on the routing tree.
                    //  (it should be able to deal with querystrings as well then.)


                    //console.log('rt ' + rt);
                    //throw 'stop';



                    rt.set('/resources/*', function(req, res) {


                    	console.log('resources wildcard routing. will send to the resource pool publisher resource.');

                    	//throw 'stop';
                    	resource_publisher.process(req, res);

                    });

                    rt.set('/login/*', function(req, res) {
                    	console.log('login wildcard routing. will send to the login resource.');

                    	//throw 'stop';
                    	login.process(req, res);

                    });

                    rt.set('/css/*', function(req, res) {
                    	//console.log('css wildcard routing. will send to the css resource.');

                    	//throw 'stop';
                    	css.process(req, res);

                    });

                    rt.set('/js/*', function(req, res) {

                    	// Want it easy to see what the wildcard part is.

                    	//console.log('js wildcard routing. will send to the js resource.');
                    	//console.log('req', req);
                    	js.process(req, res);
                    });

                    /*
                    rt.set('/images/*', function(req, res) {
                    	console.log('images wildcard routing. will send to the images resource.');

                    	//throw 'stop';
                    	images.process(req, res);

                    });
					*/

                    rt.set('/img/*', function(req, res) {
                    	console.log('images wildcard routing. will send to the images resource.');
                    	//throw 'stop';
                    	images.process(req, res);
                    });

                    rt.set('/admin/*', function(req, res) {
                    	console.log('admin wildcard routing. will send to the Web Admin resource.');

                    	//throw 'stop';
                    	admin.process(req, res);

                    });

                    //throw 'stop';
                    // Different / better mapping of connections by ip address too?
                    var map_connections = {};

					var i_connections = 0;

                    each(ipAddresses, function(i, ipAddress) {

                    	// Different HTTP servers for the different network addresses.

                    	// Not sure if to integrate websockets here.
                    	//  It's likely that there won't need to be multiple websocket endpoints like there are with http.

                    	// need to save a map of the http servers to the IP addersses.

                    	// Or also setup the websocket servers too.

                    	// Could perhaps set up websocket servers by default.

                    	// However, need to pay attention to the HTTPS protocol for this as well.
                    	//  For the moment will focus on HTTP.

                    	// Running a websocket server could be optional.

                    	// It may be worth having some socket abstraction here, so it handles all websocket servers at once.


						var http_server = http.createServer(function(req, res) {


							var authentication_resource = resource_pool.get_resource('Authentication');

							// Why is the request being identified as a Readable Stream?

							if (!authentication_resource) {
								application_router.process(req, res);

							} else {
								authentication_resource.authenticate(req, function(err, auth_res) {
									if (err) {
										throw err;
									} else {
										//console.log('auth_res ' + stringify(auth_res));

										var tar = tof(auth_res);
										if (tar == 'object') {
											// it's a username

											// we can include authentication information with the req.

											req.auth = auth_res;

										}

										application_router.process(req, res);
									}
								});
							}

							
						});

						var sock_server = sockjs.createServer();

						// However, may want this for particular resource?

						// Or the resource_pool?

						that.sock = sock_server;


						

						sock_server.on('connection', function(conn) {

							//console.log('sock_server on connection');

							var connection_id = i_connections;
							conn.id = connection_id;
							i_connections++;

							map_connections[connection_id] = conn;

							//console.log('map_connections', map_connections);


							// We can have it give an update message every 10s...

							// Or more frequent updates maybe...

							conn.on('data', function(message) {
					        	//conn.write(message);

					        	// Broadcast the message?
					        	//  Nothin to do here.

					        	//console.log('socks connection on data: ', message);
					        	//console.log('conn.id', conn.id);

					        	// But it needs to be for the right connection.


						        //that.trigger('websocket_data', message);


						    });
						    conn.on('close', function() {
						    	//console.log('connection ' + conn.id + ' closed');
						    	map_connections[conn.id] = null;
						    });

						});

						var broadcast = function(message) {
							if (!(tof(message) == 'string')) {
								message = JSON.stringify(message);
							}
							//console.log('broadcast');
							//console.log('map_connections', map_connections);
							each(map_connections, function(i, conn) {
								
								if (conn) {
									//console.log('conn i', i);
									//conn.write(message);
									//console.log('message', message);
									//console.log('t message', tof(message));
									conn.write(message);
								}
								//conn.write(message);
							})
						}

						that.sock_broadcast = broadcast;
						that.broadcast = broadcast;

						//throw 'stop';



						/*
                    	sock_server.on('connection', function(conn) {

                    		// should probably raise server events.



						    conn.on('data', function(message) {
						        //conn.write(message);
						        console.log('socks connection on data: ', message);

						        that.trigger('websocket_data', message);
						    });

						    conn.on('close', function() {
						    	console.log('socks connection closed');

						    	that.trigger('websocket_close');

						    });
						});
						*/

						sock_server.installHandlers(http_server, {prefix:'/ws'});

						http_server.listen(port, ipAddress);
                    	console.log('Server running at http://' + ipAddress + ':' + port + '/');


                    	

                    });
                    if (callback) callback(null, true);
			    }
			    
			});
		},
		
		'process_request': function(req, res) {
			// check to see if the 1st word in the path is 'admin'.
			//  Then if it is, we'll be giving something to an admin route.
			
			
			// And if it is within the admin path, then 
			
			var url = req.url;

			console.log('process_request url ' + url);
			
			var s_url = url.split('/');
			console.log('s_url ' + stringify(s_url));
			
			var a_path = [];
			each(s_url, function(i, v) {
				if (v.length > 0) {
					a_path.push(v);
				}
			});
			
			//var spc = new Server_Page_Context(req, res);
			var spc = new Server_Page_Context({
				'req': req,
				'res': res
			});
			
			// then that should be able to understand things about the browser from the user agent string.
			
			//console.log('a_path ' + stringify(a_path));
			
			if (a_path.length > 0) {
				// However, this could be hosting different websites at different URLs.
				//  But there could easily be a root website.
				//  Will want just one website for the moment... but will want that to be configurable too.
				//   But this admin and resource system should allow a fair few things, local and remote, to be controlled.
				
				// A server login provider... will have the same authentication for all websites and services for the moment.
				//  A website can specify its own authentication or authorization provider.
				
				if (a_path[0] == 'admin') {
					// Then make sure logged in / has admin rights?
					
					// Want to check if the current user has admin rights.
					// need to get the authorization code from the cookie.
					//  what about only sending it in the body of the request?
					
					// I think using a cookie makes sense here.
					
					var cookies = new Cookies(req, res);
					var c_token = cookies.get('token');
					
					//console.log('c_token ' + stringify(c_token));
					
					if (!is_defined(c_token)) {
						// send the login page.
						//  I think that will be a login resource.
						//   The login resource for the site will be the same one, but they can be overridden.
						
						// Will use a login resource.
						//  Not specifically part of the 'Website' but it's one of the standard features that gets used and will get put in place for
						//   websites.
						
						// The website could use its own login resource, or could use the standard one.
						//  This resource will deal with requests by returning an HTML page.
						
						// The resource could publish itself as a page.
						//  Or be published as a page.
						
						// Login_Provider - could be used to provide the login resource to the user.
						//  Used to present the HTML and client-side mechanism for the login to take place.
						
						// A Resource or Provider can provide an interface?
						//  Maybe different interfaces can be given.
						//  Or there is interface information, such as saying a resource presents an HTML interface or a JSON interface.
						
						console.log('Should route to the login resource');
						
						var rp = this.get('resource_pool');
						
						var resource_login = rp.get_resource('Login');
						
						// then we pass the request to the resource
						
						// But the login resource can respond using the page_context.
						//  Don't want it to have to make a new page_context.
						
						
						//resource_login.respond(req, res);					
						resource_login.respond(spc);					
						
						
					}
					
					
				} else {
					
				}
				
				// However, will authenticate and check authorization early if possible.
				//  The website will have its access permissions defined.
				
				// However, we use the authorization provider to do the test.
				//  They may not need authorization to use the website though.
				
				
				// Otherwise, pass the request over to the website resource.
				//  (if there is a website resource).
				
				
			}
			
			console.log('jsgui.process_request url ' + url);
			
			// Get access to local variables for the server...
			
			
		},
		'serve_document': function(req, res, jsgui_html_document) {
			var html = jsgui_html_document.all_html_render();
			
			var mime_type = 'text/html';
			//console.log('mime_type ' + mime_type);
				
			res.writeHead(200, { 'Content-Type': mime_type });
			res.end(html, 'utf-8');
			
			
		},
		'status': function(callback) {

		}
	});
	
	
	Server.Page_Context = Server_Page_Context;
	// Not sure - it's not a single page therefore its not a single page context?
	
	//Server.get_network_ip = get_network_ip;
	
	// Using the resource pool should not be a very big deal.
	
	
	Server.JSGUI_Server = JSGUI_Server;
	
	// start a new server, then connect it to a route.
	//  or tell it to process_request(req, res);
	
	jsgui.Server = Server;
	
	
	
	// Also want a File_Server.
	//  Want files to be served from a particular path, as a resource in the URL system.
	//  Will be able to post files there with the right permission.
	
	
	return jsgui;
	
	
});