//require('nodetime').profile()

require('nodetime').profile({
    accountKey: '9acb8ef314936e0d58a0ca0c52c94b1e162f483c', 
    appName: 'Node.js Application'
  });

var requirejs = require('requirejs');


requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
	//paths: {
    //    "some": "some/v1.0"
    //},
    nodeRequire: require
});

requirejs(['../web/jsgui-server', 'express', '../web/jsgui-sample-controls'],
function (jsgui, express, jsgui_sample_controls) {

	// Does use Express... this could be done without it but I'm not sure the point,
	//  express routing is fairly simple to use, this also means jsgui can expose a function that can be integrated
	//   into Express projects nicely.
	
	var j = jsgui;
	var Class = j.Class;
	var each = j.each;
	var is_array = j.is_array;
	var is_dom_node = j.is_dom_node;
	var is_ctrl = j.is_ctrl;
	var extend = j.extend;
	var x_clones = j.x_clones;
	var get_truth_map_from_arr = j.get_truth_map_from_arr;
	var get_map_from_arr = j.get_map_from_arr;
	var arr_like_to_arr = j.arr_like_to_arr;
	var tof = j.tof;
	var is_defined = j.is_defined;
	var stringify = j.stringify;
	var functional_polymorphism = j.functional_polymorphism;
	var fp = j.fp;
	var arrayify = j.arrayify;
	var mapify = j.mapify;
	var are_equal = j.are_equal;
	var get_item_sig = j.get_item_sig;
	var set_vals = j.set_vals;
	var truth = j.truth;
	var trim_sig_brackets = j.trim_sig_brackets;
	var ll_set = j.ll_set;
	var ll_get = j.ll_get;
	var is_constructor_fn = j.is_constructor_fn;
	var is_arr_of_arrs = j.is_arr_of_arrs;
	var is_arr_of_strs = j.is_arr_of_strs;
	var is_arr_of_t = j.is_arr_of_t;
	
	var app = express();
	var port = 5009;
	
	// that jsgui object will have what is needed to serve HTML.
	
	// May integrate this with Connect or routes... or may call on jsgui functionality from a connect or express route.
	
	// May still be simple to talk about serving files to paths... but will want to serve other objects / have them exposed on a path.
	
	// Want an html document control that is an empty document.
	
	// creation of empty html document...
	
	// let's start up the server.
	
	var server = new jsgui.Server.JSGUI_Server({});


	// This is winding up a bit like Express in parts.



	//  A server can be for an express routes sub-path.
	//  Can be for the whole site.
	
	// Need to configure the server.
	//  Tell the server what document to serve?
	//  Want it to be serving an html document pretty soon.
	
	// This test server would need to be told to make the document...
	//  It's the component to serve the document...
	
	// Login_Html_Resource?

	
	
	server.start(port, function() {
		//console.log('**jsgui server started');
		//throw 'stop';

		var rp = server.get('resource_pool');
		// Application Router
		//console.log('rp ' + rp);
		var ar = rp.get_resource('Application Router');

		//console.log('ar ' + ar);


		var rt = ar.get('routing_tree');
		//console.log('rt ' + stringify(rt));

		// will have functions to handle the code.
		//  but could be directed to resources.

		// Just for get responses...
		//  we will need to have it so there are different routing trees for different HTTP methods.
		//   or a routing tree can handle different methods (that seems best)
		//  however, we are likely to want to have the same object handling the different methods.
		//   so not routing on method early on may make a lot of sense and be very different to Express.


		// So there is a bit of abstraction ehere now.
		//  Hopefully that will make things easier.
		//   However, want a way to capture the 404 errors when a page has not been found.

		// The routing tree is getting set, rather than the app directly.





		// '/' would likely be a special case.
		rt.set('/', function(req, res) {
			console.log('server function from routing_tree');
			console.log('req.url ' + req.url);
			// Then want some convenitent code for handling this.
			// Want to be able to return a web page relatively easily.
			//  And could also render controls to that page.
			//webPage(res, options);
			// Could use some functions for very simple HTML construction.
			//  Also would like to use simple template systems as well, such as underscore and mustache templates.

			// HTML prep functions could be really fast.
			//  Faster than controls.
			//  But controls would be more tangible.

			res.writeHead(200, {"Content-Type": "text/html"});
		  	res.write("<!DOCTYPE \"html\">");
		  	res.write("<html>");
		  	res.write("<head>");
		  	res.write("<title>Hello World Page</title>");
		  	res.write("</head>");
			res.write("<body>");
			res.write("<h1>Root Page</h1>");
			// can have a message about the method used



			res.write("</body>");
			res.write("</html>");
			res.end();

		});

		// will need to interpret the name as a variable
		//  need to make this equivalent to Express routes, through the use of variables.

		// Want it so that the following can be put into a tree.

		// users/:name/images/:image_name
		// users/:name/:resource_type/:resource_name

		// users/:name/images
		// users/:name/calendar
		// users/all
		//  that could have a specific handler.

		// so at any level, there can be a number of specific handlers, and we can tell immediately if one is relevant
		//  there also can be a variable handler, that gets the name of the variable at that location.



		//  but it's going through the object tree where considerations need to be made at each level.
		//   want to use the Data_Object get/set if possible, but we'll have variables at the various levels
		//   (need to indicate that a variable can be in use at that level if we don't know what it's value is)

		// Then also wildcard routes - where once we have some of the route it will have a wilcard and send the requests to
		//  a handler function no matter what else is in the URL.

		// Need to be sure about the routing algorithm.
		//  Will go through the levels of the routing tree, and will see if there is a route from that tree that
		//  applies when we have a URL

		// Process URL
		// Add route to tree
		// Remove route from tree

		// The Application_Router is a Resource.

		// Need to do more work on the Routing_Tree object.








		// so there could be mappings where some paths are given as variables and some are not.
		//  this needs to be a tree / index of paths, rather than a list that it does comparisons on because we need this
		//  to be fast.




		// At any level, it will try to send it a specific handler.
		//  So, after hello, it will see if the next work in the URL matches a specific handler at that level.
		//  

		// So when adding the route...
		//  Can't use just get and set

		// Could route these to particular resources or resource publishers.
		//  Some resources should be secure enough to only act when they have the proper credentials given.

		// Autoredirect to a login resource may make sense in some cases.
		//  We need to make sure there are useful abstractions.

		// A 404 abstraction may be best.
		//  However, that could possibly be a resource.
		//  The resource will help because they can be initialized in one line and they handle (secure) async operations

		// Also, having authentication set within the routing tree makes sense...
		//  Though maybe it makes more sense having authenticated / secured resources.

		// Sending a user to a login resource makes sense.
		//  Then the application may have its own resources for handling various things.
		//  But I want there to be a general library of resources and UIs for doing various things.

		// Want to connect this up with authentication and authorization resources.
		//  Also need login page / resource.
		// Can have login redirect mechanism.

		// Authenticated resource tree?
		//  So the resource tree knows where the login page is?

		// Putting a login path within the tree... that will provide the login page.
		//  Then there can be a login page html control.
		//  Could do an Ajax login that just stores the session token locally.

		// Want to make it relatively easy for the users to store data in various places,
		//  so this could give a user access to an authenticated resource,
		//  or a programmatic resource that has got the facilities a user would need but no more.

		// Could possibly use this to get twgeo running fairly soon.
		// Also the landlord-tenant directory

		// Basically, need the authentication / security system to be baked into the app
		//  Secure by default would be a good feature.

		// Could do a bit more on database resources.
		//  Have that so that authentication connects to a database.

		//  May be worth making use of various online database services with APIs.
		//   Can wrap them in an API and also offer a similar MetaBench online data API.

		// OAuth would be fairly good to use to authenticate users.
		//  Maybe Facebook authentication.
		//  Perhaps a user could authenticate with multiple means at once.
		// Authenticated user flow would definitely be useful for this.
		//  And would be good to encapsulate things.
		//   Perhaps define a 'System' as a bundle of things that go into an app, but they are glued together with
		//   the JSGUI framework.
		// Also, je suis XML would be very worthwhile to produce.
		//  Could catch on a bit like Angular, but it will be a neat way of declaring jsgui functionality
		//   within an HTML document.

		// Want to be able to pass on a directory, onwards (likely to use a wildcard) to a web file server resource.
		//  And that could possibly handle je suis xml.

		// Basically, want to get this set up as an interface and a web app.
		//  Want it to be flexible enough so that 'Editors' can be put into place and developed as separate components.
		//  Could posisbly make an HTML app store. It could attract people to it if the jsgui system is successful.

		// Also, need to get the MetaBench website up and running.
		//  Wil have company info, and will have jsgui documentation and samples.

		// JSGUI controls.
		// System for organizing the development of JSGUI within JSGUI.
		//  Stable data sources.
		//   For the moment that seems like cloud services would be the best offering.
		//    Could make a few Resource abstractions around them.

		// However, speed would probably be highest with local DBs.
		//  It would be useful to keep it the same between computers,
		//   perhaps setting using MetaBench's virtual server for a Mongo DB makes sense.
		//  As would upgrading to a more advanced web server.
		//   That could make a lot of sense if doing some data-intensive things.
		//  But first should get some real software up and on running on the internet.

		// Using some S3 infrastructure may make sense.
		//  Should start dealing with actual user accounts.

		// A mongo database admin / explorer program would be really useful.
		//  Could connect back to the app's node.js server to access that Mongo database,
		//   and could possibly access it directly.

		// The security resources should probably have more work done, as well as their incorporation within the
		//  app flow.




































		rt.setRoot404(function(req, res) {
			// the root 404 error.
			//  different levels could get different 404s attached.

			res.writeHead(404, {"Content-Type": "text/html"});
		  	res.write("<!DOCTYPE \"html\">");
		  	res.write("<html>");
		  	res.write("<head>");
		  	res.write("<title>Page Not Found</title>");
		  	res.write("</head>");
			res.write("<body>");
			res.write("<h1>Page Not Found</h1>");
			res.write("</body>");
			res.write("</html>");
			res.end();

		});

		// Can try authenticating and authorizing various pages.
		//  I think using a convenient resource abstraction makes sense.

		// Middleware resources?
		//  As in there can be an unsecured resource (handler) that then has the security pathway intercept the request.


		// Gateway, Security Gateway, Security Path.
		// Auth = Authentication and Authorization?
		// Thent authentication
		// Thori authorization

		// Can ensure that someone is logged in
		//  Can ensure that it's a particular user
		//   Can ensure that user has got particular privaledges

		// Different resources being run at particular points?

		// Define a resource, and make it available programmatically?
		//  Resource could have both get and set, so could be in tune with http methods.

		// The server would likely be connected to one particular authentication resource.



		// A secrets page - that is found during the routing tree,
		//  but the processor function first checks to see if that user is authenticated.


		// Also a login resource / login resource page.
		//  Not sure quite what needs to be called a resource, but it will be useful having various things in the
		//   resource pool so that they interact with each outer with some simple but intelligent rules that means
		//   things get automatically connected with each other or can be connected up easily.



		// a protect function?
		//  auth function?
		// A few different functions could act around a function to ensure that it gets authorized etc.
		//  However want smooth redirection.

		// Want there to be a login processor / resource.


		rt.set('login/', function(req, res) {
			var login = rp.get_resource('Login HTML Resource');


			// Then get that resource to process the request.
			login.respond(req, res);


			//console.log('server function from routing_tree');
			//console.log('req.url ' + req.url);
			// Then want some convenitent code for handling this.
			// Want to be able to return a web page relatively easily.
			//  And could also render controls to that page.
			//webPage(res, options);
			// Could use some functions for very simple HTML construction.
			//  Also would like to use simple template systems as well, such as underscore and mustache templates.

			// HTML prep functions could be really fast.
			//  Faster than controls.
			//  But controls would be more tangible.

			/*

			res.writeHead(200, {"Content-Type": "text/html"});

			// However, will want to use a Page Control.


		  	res.write("<!DOCTYPE \"html\">");
		  	res.write("<html>");
		  	res.write("<head>");
		  	res.write("<title>MetaBench Login</title>");
		  	res.write("</head>");
			res.write("<body>");
			res.write("<h1>Login</h1>");
			res.write('<div>Hello</div>')
			res.write("</body>");
			res.write("</html>");
			res.end();

			*/

		});


		rt.set('users/', function(req, res) {



			console.log('server function from routing_tree');
			console.log('req.url ' + req.url);
			// Then want some convenitent code for handling this.
			// Want to be able to return a web page relatively easily.
			//  And could also render controls to that page.
			//webPage(res, options);
			// Could use some functions for very simple HTML construction.
			//  Also would like to use simple template systems as well, such as underscore and mustache templates.

			// HTML prep functions could be really fast.
			//  Faster than controls.
			//  But controls would be more tangible.

			res.writeHead(200, {"Content-Type": "text/html"});
		  	res.write("<!DOCTYPE \"html\">");
		  	res.write("<html>");
		  	res.write("<head>");
		  	res.write("<title>Hello World Page</title>");
		  	res.write("</head>");
			res.write("<body>");
			res.write("<h1>Users page</h1>");
			res.write('<div>Hello</div>')
			res.write("</body>");
			res.write("</html>");
			res.end();

		});

		
		rt.set('users/:name/', function(req, res) {
			console.log('server function from routing_tree');
			console.log('req.url ' + req.url);
			// Then want some convenitent code for handling this.
			// Want to be able to return a web page relatively easily.
			//  And could also render controls to that page.
			//webPage(res, options);
			// Could use some functions for very simple HTML construction.
			//  Also would like to use simple template systems as well, such as underscore and mustache templates.

			// HTML prep functions could be really fast.
			//  Faster than controls.
			//  But controls would be more tangible.

			res.writeHead(200, {"Content-Type": "text/html"});
		  	res.write("<!DOCTYPE \"html\">");
		  	res.write("<html>");
		  	res.write("<head>");
		  	res.write("<title>Hello World Page</title>");
		  	res.write("</head>");
			res.write("<body>");
			res.write("<h1>Page for when we have a name variable</h1>");
			res.write('<div>Hello, ' + req.params.name + '</div>')
			res.write("</body>");
			res.write("</html>");
			res.end();

		});

		rt.set('users/:name/images/', function(req, res) {
			console.log('server function from routing_tree');
			console.log('req.url ' + req.url);
			// Then want some convenitent code for handling this.
			// Want to be able to return a web page relatively easily.
			//  And could also render controls to that page.
			//webPage(res, options);
			// Could use some functions for very simple HTML construction.
			//  Also would like to use simple template systems as well, such as underscore and mustache templates.

			// HTML prep functions could be really fast.
			//  Faster than controls.
			//  But controls would be more tangible.

			res.writeHead(200, {"Content-Type": "text/html"});
		  	res.write("<!DOCTYPE \"html\">");
		  	res.write("<html>");
		  	res.write("<head>");
		  	res.write("<title>Hello World Page</title>");
		  	res.write("</head>");
			res.write("<body>");
			res.write("<h1>Page for when we have a name variable, will show images</h1>");
			res.write('<div>Hello, ' + req.params.name + ', here are your images</div>');
			res.write("</body>");
			res.write("</html>");
			res.end();

		});

		// Definitely want to make an online OS / desktop / editor / server admin app.
		//  I think making the various resources is the right way of going about things.
		//  Could use various client-side implementations for interacting with these resources.





		// Wildcards will be useful so that a resource provides the results based on the path 
		//  of the wildcard.

		rt.set('users/:name/images/*', function(req, res) {
			console.log('server function from routing_tree');
			console.log('req.url ' + req.url);
			// Then want some convenitent code for handling this.
			// Want to be able to return a web page relatively easily.
			//  And could also render controls to that page.
			//webPage(res, options);
			// Could use some functions for very simple HTML construction.
			//  Also would like to use simple template systems as well, such as underscore and mustache templates.

			// HTML prep functions could be really fast.
			//  Faster than controls.
			//  But controls would be more tangible.

			res.writeHead(200, {"Content-Type": "text/html"});
		  	res.write("<!DOCTYPE \"html\">");
		  	res.write("<html>");
		  	res.write("<head>");
		  	res.write("<title>Hello World Page</title>");
		  	res.write("</head>");
			res.write("<body>");
			res.write("<h1>Page for when we have a name variable, will show images, and after that path it's wildcard</h1>");
			res.write('<div>Hello, ' + req.params.name + ', here are your images</div>');
			res.write("</body>");
			res.write("</html>");
			res.end();

		});
		
	

		
		rt.set('users/all/', function(req, res) {
			console.log('server function from routing_tree');
			console.log('req.url ' + req.url);
			// Then want some convenitent code for handling this.
			// Want to be able to return a web page relatively easily.
			//  And could also render controls to that page.
			//webPage(res, options);
			// Could use some functions for very simple HTML construction.
			//  Also would like to use simple template systems as well, such as underscore and mustache templates.

			// HTML prep functions could be really fast.
			//  Faster than controls.
			//  But controls would be more tangible.

			res.writeHead(200, {"Content-Type": "text/html"});
		  	res.write("<!DOCTYPE \"html\">");
		  	res.write("<html>");
		  	res.write("<head>");
		  	res.write("<title>Hello World Page</title>");
		  	res.write("</head>");
			res.write("<body>");
			res.write("<h1>Page for all users</h1>");
			res.write('<div>Should be no params</div>')
			res.write("</body>");
			res.write("</html>");
			res.end();

		});
		
		



		// want to also test variables in the routes, like in Express.
		//  Not sure if Express uses routing trees though.

		// Would be good to have this do RESTful routing.

		// Then resources can be accessed using data that's routed 



		// But then we may want to set a few more routes here.
		//  Though it will be possible to use resources, it will also be possible just to assign a function to 
		//   a route.

		// However, we have a tree of these routes, perhaps helped along by using Data_Object.

		// perhaps we'll need a set function override for the routing tree.

		// so it will ensure it has the right objects at the right levels.
		//  we'll need it to be able to take in variables too.

		// such as 




		console.log('got ' + stringify(rt.get('/')));

		// Can use an admin port
		// Or /admin
		//  settable option.
		/*
	
		// Then need to tell the server how to respond.
		

		
		app.listen(port, function() {
			// say what IP address...
			//  give the external ipv4 address?
			
			
			
			console.log("Listening on " + port);
			
			// Perhaps later we could expose resources to be served - with the resource doing some of the path processing.
			//  A resource could serve an interface for interacting with it - complete HTML interface, or JSON API that a more general
			//  HTML or other interface can interact with.
			
			// Can have different handlers.

			//  Some response handlers will expose a resource.
			//   Could be a resource publisher interface?
			//    or just a Response_Handler function.
			//    HTTP_Response_Handler function, could have other sorts of signals coming in.

			// admin could be covered by the jsgui server.
			
			// Or hook in the admin here?
			//  

			// Have an admin http html request handler for the server.





			//app.get('/admin', function(req, res, next) {

				// this will be the response handler...
			//
			//
			//});
			


			app.get('/', function(req, res, next) {
				// can get the full url out of the path.
				//  can get the difference from the url_path
				
				var url = req.url;
				console.log('url ' + url);
				
				//server.process_request(req, res);
				
				// jsgui.JSGUI_HTML_Document();
				//  has the correct references to jsgui client side code and CSS.
				//  will get the jsgui-html-client running on the client.
				
				// There are some functions which are not needed in the server version of the code.
				//  Some code to do with binding dom events perhaps.
				//   But those functions could work well on the client too - or there could be server side code executed on DOM events?
				//    probably not worth it - have more separation.
				
				// Or the page context has already been made automatically during the request?
				
				var spc = new jsgui.Server.Page_Context({
                     'request': req,
                     'response': res,
                     'rendering_mode': 'html5'
                });
				
				//server.create_page_context?
				
				//console.log('pre create new jsgui.Client_HTML_Document()');
				
				// Give the document the context.
				//  Need a new page context I think. Page_Context
				//  Maybe a page_request_context.
				
				
				var doc = new jsgui.Client_HTML_Document({'context': spc});
				//console.log('post create new jsgui.Client_HTML_Document()');
				// There will need to be HTML documents with things already set up for JSGUI.
				//  I think that would include a script block that initializes JavaScript functionality.
				//   Dynamically written JavaScript is the way to go here, but it can effectively be JSON.
				//    Stringify could produce code that gets initialized.
				
				// Effectively providing all the info that goes in init for every control.
				//  Or every control that has extra information.
				
				// So that could be info about the flags (but its likely to get some flags through css classes).
				//  The control will find out about the content of itself.
				//   And it will parse data from HTML where needed. Complete records can be given through the HTML, with extra data given through JSON.
				//    Most programming work, but it will be most efficient on the client.
				//     Another good option is to have all the rendering done on the client.
				
				
				//doc.get('body').
				//console.log('pre show body content');
				//console.log('');
				//console.log('');
				//console.log('***** doc.body().content() ' + stringify(doc.body().content()));
				//console.log('post show body content, pre change body content');
				//doc.body().content().add('Hello World');


				// Now it's getting added as a Data_Value because it's a string.
				//  Need to make sure Data_Values get rendered as a string.

				doc.body().content().add('Hello World');
				//console.log('2**** doc.body().content() ' + stringify(doc.body().content()));
				
				//console.log('post change body content');
				// make a new div...
				
				// but we can have a control that is selectable - has a selected flag.
				
				// The enhanced Data_Object extend will deal with the flags.
				//  They are much like fields - except the flags are a field.
				//  
				
				// However, we may need to use something that has been defined in code that goes to the client.
				
				// May want a client side only test.
				
				// Having client-server integration will be very useful indeed.
				//  And it will help that the same objects are being represented.
				
				// jsgui-sample-controls.
				//  selectable div.
				
				// A color picker would be a useful control to have.
				// Maybe properties editor?
				
				// Something that runs on both the client and the server...
				//  Sent to the client as HTML, and then activated through its jgsui id.
				//  Will use data attributes for the moment when sending them.
				//   May depend on the page context? But they would be expando properties anyway and would still work in HTML4.
				
				//var div1 = new jsgui.div({});
				
				/*
				
				var seldiv = new jsgui_sample_controls.Selectable_Div({});
				// flags are a field, I think.
				
				
				
				//seldiv.selected(true);
				
				// Maybe specialised syntax for flags - will not need too much code for this with much being done with collections of strings.
				
				
				//seldiv.flags('selected', true);
				console.log('');
				var flags = seldiv.get('flags');
				
				console.log('flags ' + stringify(flags));
				
				var fields = seldiv.fields();
				console.log('fields ' + stringify(fields));
				//  should go up the prototype chain to get the fields.
				
				
				// so when that flag changes, it should also change the css.
				
				// we should be able to have this identified when it's sent to the client.
				//  various properties get sent to the client.
				//   they should be as a JSON object, but they will still have to do with the Data_Object system somehow I think.
				// will go via JSON.
				
				
				
				doc.body().content().add(seldiv);
				
				*/
				
				// We can make this serve a relatively simple control sample.
				//  Possibly separate out HTML from control logic?
				//  Could design much of the control as HTML, and use that HTML document as a template for it?
				
				// I think a login control would be very useful.
				//  That would also need some AJAX capabilities.
				
				// Some extended HTML controls make sense.
				//  HTML_Basic_Set
				
				// Will include a login control
				//  A few controls for multi-column layout with DIVs.
				
				// Do want to ge these flags and css flags into place.
				//  Some flags will be there. Assumed to be off when not set.
				//  Will have fairly fast access.
				// ability to toggle flags
				
				// Once we have flags, including css flags, we will be able to make use of various css classes in a much better way.
				//  Would have the flags linked to shims where necessary.
				//   May need to re-render a control when a flag changes - the level of re-rendering would depend on if
				//    html has changed.
				
				
				/*
				server.serve_document(req, res, doc);
				
				// all urls go to the jsgui server...
				//  but that server needs a document or something in order to do anything.
				
				// Could we just use express to do the serving?
				//  We need to specify the document somewhere?
				//  Don't need a full app for the server...
				
				
			});
			
		});
		*/
		
		
		
		
	});
	
	// and first have express / connect listening to requests and giving them to the server?
	//  that would play well with other projects.
	
	
	
	
	
	
	
	
	
	
});