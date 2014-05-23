if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// Possibly will be a core resource.

// Likely to be hooked up with a DB as well.
//  So need a functioning DB resource to handle it.
//  An abstract DB resource that could handle a variety of different DBMSs would be nice.



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

	// Some of the user / authetication resources could have specifications about how they want the database to be / how they want data access to be
	//  Database resources then carry that out - setting up what they need to set up within the database.


	// This Resource will not necessarily be published.
	//  It will be possible to access this resource to carry out authentication.

	// Want the base class
	// Also want a flexible class that can plug into a variety of interfaces.

	// Or we have an authentication data resource as well...
	//  It would connect to a data resource that follows an extablished interface.
	//  In fact it would not need complicated data.

	// I think some more work on the data resources, and more fully establishing how they work will be useful.


	// Want it to be easy to set and retrieve data from a database.
	//  Also want that under user credentials...

	// I think the the server file will link up the various resources so that they work with each other.
	//  Will have resources connected in such a way that they get authenticated etc.

	// An authenticated file system resource would be really helpful.
	// Also a file system or virtual file system resource for users.

	// So the user james can look at the file system.
	//  They can save annotations / notes in their own user space.

	// A general authentication provider connecting to a database resource.
	//  Or connecting to an Authentication Database Resource?
	//  There will be some specific DB routines to run.
	//  Would be nice to have an Auth resource that connects to a DB resource, that db resource connects to the db.
	//  I think another resource apart from Authentication Provider should set up the database.

	// Authentication_Database resource?
	//  And that is a Resource that connects to any / a variety of Database resources.

	// The Authentication Provider will query the Authentication DB resource.
	//  That will query a DB resource.


	// I think the authentication resource will have some kind of description what db it expects.
	//  Or would that be the authentication db resource?

	// I think that setting up the users / authentication / authorization db in Postgres, using ORM, would be great.

	// Need to split it into different logical units.
	//  The authentication provider could ensure that there is the correct DB resource.

	// Perhaps I need to do more work with the DB anyway to get it working right in general terms.

	// I think that thinking about adapters may make sense
	//  So there is a DB resource (for a particular DBMS)
	//  Then there is an Adapter which means it provides an Authentication Resource interface.

	// The adapter will ensure that the Database has got the right tables set up.
	//  It will adapt between a type of DB resource (eg Postgres, Mongo), and a resource that provides Authentication.
	//  It will use the Database resource in order to provide an Authentication resource.

	// Having this connect to a Postgres DB resource...
	//  Maybe make a specific Postgres-Auth resource.
	//  That resource could set up the DB for use as Postgres.
	//   Then when more flexibility is introduced elsewhere, this postgres-auth could call on that.

	// I think a Postgres users DB (resource) would make the most sense.
	//  Exposes the users system as a resource, uses Postgres internally.

	// Exposes a Web-DB resource.
	//  Maybe Web-DB-Postgres would be worth doing, it will handle authentication and functionality for a fairly basic website - users can
	//  save information, maybe just key-value store by user.

	// Web-db-postgres could later be refactored so that it sets up the web db using any database resource. For the moment, having it work using Postgres
	//  makes sense.

	























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