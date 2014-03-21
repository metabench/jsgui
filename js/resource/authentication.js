define(['../web/jsgui-html', 'os', 'http', 'url', './core/resource', '../web/jsgui-je-suis-xml', 'cookies'], 

	function(jsgui, os, http, libUrl, Resource, JeSuisXML, Cookies) {

	
	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;
	
	var exec = require('child_process').exec;

	// I think this may need to involve components that set up the web database if required.
	//  I think mongolab would be a good data resource to connect to to get things going.
	
	// These would likely connect to a database or data source.
	//  Should not need to connect to a specific database.
	//  Should connect to a database interface.

	// Want to be able to easily set up the database.
	//  Set up the web db.

	var Authentication_Provider = Resource.extend({
		'init': function(spec) {
			// May need to connect with a database.
			
			// Will also have a very simple Authentication_Provider.
			//  Other authentication providers can connected to databases of various different sorts.
			//  Could be adapters to a database.
			
			
			this._super(spec);
			
		},

		// Will probably be more like get ('authentication', credentials).
		// Will limit the interface to using 'get' and 'set' where possible / most suitable.


		'authenticate': function(username, password, callback) {
		
		},
		'start': function(callback) {
			callback(null, true);
		}
	});
	
	
	// and the actions... I think actions could be defined as a function.
	//  They may be made available with a web interface, so that an authentication provider could be accessed as a service
	//   in a distributed system.
	
	// Does not require anything.
	var Simple_Authentication_Provider = Authentication_Provider.extend({
		'init': function(spec) {
			this._super(spec);
		},
		
		// authenticate username + session id
		//  get true/false
		//  get a list of permissions?
		//   though could check permissions at later point.

		// authenticate username + password

		// Maybe split this function


		// authenticate password - need to authenticate token as well.
		'authenticate': fp(function(a, sig) {
			// however, as a resource this should be asyncronous.

			// Authenticating a request would make sense too.

			// Also, authenticating a PageContext (looking at its request), and then adding the authentication info to the context.

			//console.log('authenticate sig ' + sig);

			//console.log('tof a0 ' + tof(a[0]));

			var that = this;

			if (sig == '[R,f]') {
				// Readable stream being the request... not sure why it is this.
				var req = a[0];
				var callback = a[1];
				// look at the cookies.
				//var username = 
				//var cookies = new Cookies()
				// Only want to get the cookies from the request.

				var headers = req.headers;
				//console.log('headers ' + stringify(req.headers));

				var hCookie = headers.cookie;
				//console.log('hCookie ' + hCookie);

				if (hCookie) {
					hCookie = hCookie.replace(/; /g, ';');
					var arrCookies = hCookie.split(';');
					//console.log('arrCookies ' + stringify(arrCookies));

					var mapCookies = {};

					each(arrCookies, function(i, cookie) {
						var arrCookie = cookie.split('=');
						mapCookies[arrCookie[0]] = arrCookie[1];
					})

					//console.log('mapCookies ' + stringify(mapCookies));

					var sessiontoken = mapCookies.sessiontoken;
					//console.log('sessiontoken ' + sessiontoken);

					this.authenticate(sessiontoken, function(err, username) {
						if (err) {
							callback(err);
						} else {
							var res = {
								'username': username,
								'sessiontoken': sessiontoken,
								'verified': true
							}

							callback(null, res);

						}
					});
					// and see if there is a sessionToken...
					//  authenticate that, (check if it matches the username)

				} else {
					callback(null, false);
				}

				

				// If there is a username cookie there should be a sessiontoken cookie too.

			}

			if (sig == '[s,f]') {
				var auth_token = a[0];
				var callback = a[1];
				//console.log('authenticating token ' + auth_token);
				if (auth_token == '9876543210') {
					//return true;
					// Could callback with the username.

					var username = 'admin';

					callback(null, username);
				} else {
					//return false;
					callback(null, false);
				}
			}

			if (sig == '[s,s,f]') {
				var username = a[0], password = a[1];
				var callback = a[2];
				
				if (username === 'admin' && password == '1234') {
					//return '9876543210';
					callback(null, '9876543210');
				} else {
					//return -1;
					callback(null, false);
				}
				//return username === 'admin' && password == '1234';
			}
		}),
		
		'username': function(auth_token) {
			if (auth_token == '9876543210') {
				return 'admin';
			}
		},
		
		// also need to see if an authentication token matches.
		
		'meets_requirements': function() {
			return true;
		},
		'start': function(callback) {
			callback(null, true);
		}
	});


	// Need to make a version that's DB-connected as well.
	
	// As well as the authentication provider, we need something that returns the login form.
	//  I think that could be a 'login resource' that returns HTML.
	
	// Don't think the authorization provider should have to deal with that.
	//  It may be possible to easily wrap a Login control as a resource.
	
	// A more complex authentication provider could connect to a database resource.
	//  Maybe a password table resource.
	//   That could be a specific type of resource (interface) that is implemented on a variety of platforms.

	// Various authenticated resources
	// DB resources needed to handle them.

	// Want a relatively simple authentication provider for Mongo DBs, but maybe a general interface to DBs would be
	//  best and then that more general one connects to the auth provider.

	// However, an auth provider that connects to a certain type of mongo db would make sense here,
	//  I could go into quite a bit of detail with different authorization classes.

	// Mongo_Authentication_Provider

	// It would be nice if there was a general interface to the DB.
	//  So this talks to a general DB connection.

	// Can talk to a resource-mongo.
	//  That could be within the resouce pool.

	// Will be good to test some database things / resources / resource connectors separately.

	






	
	
	var Authentication = {
		'Provider': Authentication_Provider,
		'Simple_Provider': Simple_Authentication_Provider
	}
	
	
	return Authentication;
	
	
});