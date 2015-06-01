/*

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../web/jsgui-html', 'os', 'http', 'url', './core/web', '../web/jsgui-je-suis-xml', 'cookies', '../web/server-page-context',
	"../web/controls/advanced/login"],

	function(jsgui, os, http, libUrl, Web_Resource, JeSuisXML, Cookies, Server_Page_Context, Control_Login) {
*/

var jsgui = require('../web/jsgui-html'), os = require('os'), http = require('http'), libUrl = require('url'), Web_Resource = require('./core/web'),
JeSuisXML = require('../web/jsgui-je-suis-xml'), Cookies = require('cookies'),
Server_Page_Context = require('../web/server-page-context'), Control_Login = require('../web/controls/advanced/login');


	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;

	var exec = require('child_process').exec;


	// OK, does this need the server module?
	//  Should things be taken out of the server module because some things are needed to make pages?

	// Not so keen on using resources to provide an HTTP interface like this.
	//  The main purpose of resources is to provide distributed access to the data, conveniently.
	//  However, it may be a good thing to do, but within a subcategory of resources,

	// Will also have tools to publish resources as HTML.
	//  Could access a data resource and turn it into HTML
	//  Could make a navigation bar in html by giving it a resource as input.




	var Login_Html_Resource = Web_Resource.extend({
		'init': function(spec) {
			this._super(spec);
		},

		// This can respond based on a Page_Context. That means objects / controls used will be indexed for the duration of the page
		//  (but only that duration)

		// is 'respond' a better name? or 'process'?

		'respond': fp(function(a, sig) {

			// If this is a post request, we don't show the login form, we handle the login.


			//



			// Create the document object for the response, with the login control.
			//  Then it issues the cookie to provide correct authentication.

			// Needs to respond to both get an post.
			//  With post, will set the cookie, and redirect (back).

			// But maybe this will just do a get and handle a post, and then it will be done.
			// After the post the user will have the cookie, but it will need to know where to redirect the user back to.

			// Will need to load a login control page...
			//  Can possibly wrap a Control as a resource... but likely to do that when we have more of them.


			// need the login control.

			// Will also make the HTML document control.


			// However, the response is likely to have to do with the authentication resource as well...
			//  Likely to be connecting to that to determine what the response is once the form has been posted back.
			//  Quite a lot of separation into different objects.

			// I think we'll need to serve each of these with a new Page_Context.
			///  Hopefully Page_Contexts will be forgotten at the right time too.
			//   Don't want too much info shared between page requests.

			// Will keep a separate index of the various controls within each Page_Context.
			//  The Page_Context may also be used for callbacks for real-time features.

			// This looks like it needs individual page contexts to work effectively.
			//  Won't have jsgui-html making all these new IDs, items, and indexing those items.
			//  With the single page_context object it will be easier to make sure that info is forgotten about when it's no longer needed.

			// Perhaps the server will provide a new page_context?
			//  And the Page_Context will have the ID generators for items of different types.
			//  Then we should have the whole server serving pages quickly.


			// Not so sure we are using Server_Page_Request objects at the moment.
			//  Just passing through the request and response objects.
			//   A bit like eclipse middleware.
			//    Not as much change from the basic node request and response compared to Express.

			// Needs to see what the method is.
			var that = this;

			// Maybe have a resource-logout too?
			// Can this polymorphically do both?
			//  Call it login-logout?



			if (a.l == 1) {
				// It's a Context object.
				// Server_Page_Context;

				var server_page_context = a[0];

				//console.log('server_page_context ' + stringify(server_page_context));

				var req = server_page_context.req;
				var res = server_page_context.res;

				//console.log('req ' + stringify(req));
				//console.log('res ' + stringify(res));


				var method = req.method.toUpperCase();
				console.log('HTTP method ' + method);

				//

				if (method == 'POST') {
					// We need to get the info from the form, then do the authentication.
					//  Will pass the info the the Authorization_Provider.
					//   That will likely be in the same application pool / server resource pool.

					// get the data out of the form.

					console.log('is post');
					//throw 'stop';


					var posted_body = "";
					req.on('data', function (chunk) {
					    posted_body += chunk;
					});
					req.on('end', function () {
					    console.log('POSTed: ' + stringify(posted_body));
					    // Could post something requesting a logout?
					    if (posted_body != '') {

					    	// we parse the posted body.
					    	//  hopefully won't have too much data, should check for that and cut it off if it's posting too
					    	//  much.

					    	// parse that body into name / value pairs.
					    	//  need to handle / quickly reject a malformed body.

					    	//"username=james&password=xxxxxx"

					    	var separate_items = posted_body.split('&');
					    	if (separate_items.length == 2) {
					    		var username, password;
					    		each(separate_items, function(i, item) {
					    			var s_item = item.split('=');
					    			var itemName = s_item[0];
					    			var itemValue = s_item[1];
					    			if (itemName == 'username') {
					    				username = itemValue;
					    			}
					    			if (itemName == 'password') {
					    				password = itemValue;
					    			}

					    		});

					    		// then we use the username and password for authentication.

					    		console.log('username ' + username);
					    		console.log('password ' + password);

					    		// And get the authentication provider from the server resource pool.
					    		// Do we have that from the server_page_context?
					    		//  Perhaps the resource has access to the pool itself.

					    		var rp = that.meta.get('pool');
					    		console.log('rp ' + rp);

					    		// then from the resource pool we get the authentication provider.
					    		//  There could possibly need to be more than one, may need to address that.

					    		var authen = rp.get_resource('Authentication');
					    		console.log('authen ' + authen);



					    		authen.authenticate(username, password, function(err, sessionToken) {
					    			if (err) {
					    				throw err;
					    			} else {
					    				console.log('sessionToken ' + sessionToken);

					    				if (!sessionToken) {
					    					// wrong username / password combination.

					    					// I think showing a login unsuccessful page is best...
					    					//  with the right error code?
					    					// Not sure this will always be a normal browser request...

					    					// We can show a Login_Page control.

					    					// could redirect to a get request for login,
					    					//  saying the login was not successful.

					    					throw '6) stop';



					    				} else {
					    					// we need to send that session token back to the client.
					    					//  could send it as a cookie.
					    					//  could give it some script to run.

					    					// will use Set-Cookie: name=value

					    					// however, should redirect back to the original page.
					    					//  it would be good to get the original url to redirect back to
					    					//  but this may be hard to set on the server...

					    					// could have it within the client with activated js,
					    					//  but it's better to generate this on the server and send it
					    					//  to the document.

					    					// will use ?returnurl
					    					//  needs to be in the post action.
					    					//  the login control may need to know which page it's in...
					    					//   but / can be the default to start with.

					    					var queryData = libUrl.parse(req.url, true).query;
					    					console.log('t queryData ' + typeof queryData);
					    					console.log('queryData ' + stringify(queryData));
					    					//queryData.returnurl;

					    					/*
					    					res.writeHead(303, {
					    					  'Set-Cookie': 'sessiontoken=' + sessionToken + ';Path=/; Expires=Wed, 13 Jan 2021 22:23:01 GMT;',
											  'Set-Cookie': 'username=' + username + ';Path=/; Expires=Wed, 13 Jan 2021 22:23:01 GMT;',
											  'Location': queryData.returnurl
											  //add other headers here...
											});
											*/

											res.writeHead(303, [
					    					  ['Set-Cookie', 'sessiontoken=' + sessionToken + ';Path=/; Expires=Wed, 13 Jan 2021 22:23:01 GMT;'],
											  ['Set-Cookie', 'username=' + username + ';Path=/; Expires=Wed, 13 Jan 2021 22:23:01 GMT;'],
											  ['Location', queryData.returnurl]
											  //add other headers here...
											]);

					    					// set the cookie for the session token.
					    					// set-cookie to delete:
					    					// reg_fb_gate=deleted; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/; Domain=.example.com; HttpOnly

											res.end();




					    				}

					    				//throw 'stop';
					    			}
					    		});
					    		//console.log('is_auth ' + is_auth);

					    		//throw 'stop';


					    	}




					    	/*
					        var hash = splitter.formValues(body);

					         console.log("input1 = " + hash["first_name"]);
					         console.log("input2 = " + hash["last_name"]);

					         res.writeHead(200);
					         res.write('Hello ' + hash["first_name"] + ', ' + hash["last_name"] + '!');
					         res.end();
					         return;
					         */
					    } else {
					    	console.log('This is a logout');

					    	// Need to remove the sessiontoken and username, then redirect back.
					    	var queryData = libUrl.parse(req.url, true).query;
	    					console.log('t queryData ' + typeof queryData);
	    					console.log('queryData ' + stringify(queryData));
	    					//queryData.returnurl;

	    					/*
	    					res.writeHead(303, {
	    					  'Set-Cookie': 'sessiontoken=' + sessionToken + ';Path=/; Expires=Wed, 13 Jan 2021 22:23:01 GMT;',
							  'Set-Cookie': 'username=' + username + ';Path=/; Expires=Wed, 13 Jan 2021 22:23:01 GMT;',
							  'Location': queryData.returnurl
							  //add other headers here...
							});
							*/

							res.writeHead(303, [
	    					  ['Set-Cookie', 'sessiontoken=deleted;Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'],
							  ['Set-Cookie', 'username=deleted;Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'],
							  ['Location', queryData.returnurl]
							  //add other headers here...
							]);

	    					// set the cookie for the session token.
	    					// set-cookie to delete:
	    					// reg_fb_gate=deleted; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/; Domain=.example.com; HttpOnly

							res.end();




					    }
					    //res.writeHead(200);
					    //res.end(postHTML);
					});
				} else if (method == 'GET') {
					var hd = new jsgui.Client_HTML_Document({
						'context': server_page_context
					});

					hd.include_client_css();

					// need to have the login control.
					//  Should be fairly simple... but need to be collecting the login information.

					// Login control contains a form?
					//  That could be an option maybe.


					var login = new Control_Login({
						'context': server_page_context
					});
					// oh... when the body is created, it does not have a context.
					//  need to be able to assign it, and sub-controls a context






					// and that will set the context of the login control.
					//  The body will already have its context set.

					// Is a lot going on here... will likely need to optimize some things.

					//  Then when the items are within their own context (._context has been set)
					//  they will not be a huge memory and slowdown leak.


					var body = hd.body();
					var body_context = body._context;
					//console.log('body_context ' + body_context);


					// the dynamic reassignment of context for all nested controls...
					//  seems important to do.

					body.add(login);


					// Should not be getting slower on each request!


					// and serve that blank HTML document.

					var html = hd.all_html_render();

					var mime_type = 'text/html';
					//console.log('mime_type ' + mime_type);

					res.writeHead(200, { 'Content-Type': mime_type });
					res.end(html, 'utf-8');
				}



			}


			if (a.l == 2) {
				// req, res
				var req = a[0];
				var res = a[1];

				// do we make a new server page context for this?
				//  Quite possibly... I think having a separate context item is important here so that it does not slow down like it did before.
				/*
				var spr = {
					'req': req,
					'res': res
				};
				*/
				// Server_Page_Context




				var spc = new Server_Page_Context({
					'req': req,
					'res': res
				});


				this.respond(spc);


			}



		}),

		'meets_requirements': function() {
			// Does it have the required Authentication Resource? Has that resource started?

			// Will have a way of checking those requirements in a more automatic way.
			//  However, MVC etc and a front-end will be nice for this so we can watch various resources starting.





			return true;
		},

		'start': function(callback) {
			// This is likely to actually only going to start when it has its Authentication Resource.

			callback(null, true);



		}


		// When starting... should only be started once the required resources are there.
		//  And the login resource will need the Authentication resource.
		//   It would use the required authentication resource to actually do the login.







		// This resource is going to process a request...

	});

	var Login = {
		'Html': Login_Html_Resource
	}

	//return Login;


//});
module.exports = Login;
