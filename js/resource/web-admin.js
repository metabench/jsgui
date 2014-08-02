if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// This Resouce should maybe be changed so it does not have an HTML or HTTP interface (to start with?)
//  The main focus of this resource should be to administer website data, and the resource could be connected to in the standard way that resources get connected to.
//  At least use a generalised resource admin HTTp interface, then extend that for this resource where necessary.
//   Much of the website would be nested information anyway.



define(['../web/jsgui-html', 'os', 'http', 'url', './core/resource', '../web/server-page-context',
        '../web/jsgui-je-suis-xml', 'cookies',
        '../web/controls/advanced/web-admin'],

	// May make a Site-Info or just Info resource.
	//  That would be in the resource pool and deal with the various pieces or Info that will get displayed in the website.
	//   It's a way of accessing all the information in the website.

	//  Would be possible to set the website's info too.
	//   Other resources, such as Web-Admin would allow read-write access to the info.
	//   Other resources would access the info (may be a way of just requesting read-only access)
	//    Or having it so that setting the info requires some authentication and authorization.


	// This could expose both REST and HTML interfaces.



	function(jsgui, os, http, libUrl, Resource, Server_Page_Context, JeSuisXML, Cookies, Web_Admin_Control) {

	
	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;
	
	var exec = require('child_process').exec;

	// This resource may also provide a RESTful interface for administering the resources on the website.
	//  The client resource pool could then connect to this, and provide a system to make async js calls rather than
	//  having to deal with the transport mechanism.


	// File system admin will likely be a specialised resource, not using a generic resource admin interface.

	// This will also process requests.
	//  Would likely have a client-side web admin component too.
	// This could use a more general Resource protection system, so it authenticates automatically?

	var Resource_Web_Admin = Resource.extend({
		
		'init': function(spec) {
			this._super(spec);
		},
		'start': function(callback) {
			callback(null, true);
		},

        // And the web admin resource needs to be processed in the right context.

		// Currently this is all about processing requests - I think it should be about having a Resource that represents the website's admin functionality, but to actually
		//  administer the application would use both general purpose resource clients as well as a customised one for administering a website.

        // process with context

		'process': function(req, res) {

            console.log('arguments.length ' + arguments.length);
			
			console.log('Resource_Web_Admin process');



			var rurl = req.url;



			//if (rurl.substr(rurl.length - 1) == '/') rurl = rurl.substr(0, rurl.length - 1);

			console.log('rurl', rurl);

			// Then could do some internal routing based on the URL.
			//  Don't want to make this complicated to begin with.
			//   Not going for client-side routing either (right now).





			var pool = this.meta.get('pool');
			// should have a bunch of resources from the pool.
			//console.log('pool ' + pool);

			// At the root, this should show an admin page.

			// Then this control gives access to the info resource, from the pool.

			var info = pool.get_resource('Info');
			//console.log('info ' + info);

			// Thinking that the admin resource could publish / enable access to the Info resource.
			//  Resources don't always have web admin.

			// I think a Resource-Publisher would be good so that resources can be accessed with HTTP requests.
			//  So, create the Resource_Publisher, give it the resource, and then connect it to a URL route.

			// A content items table may be quite useful to have.
			//  Stores object types...
			//  So can get a group
			//   And a group will have a variety of items inside it.

			






			// An Info / Data resource should be possible to administer using a fairly generic tool.

			// We need a website info resource to administer.
			//  That info resource could be set to interface with other data sources.

			// I think there can be a DB-agnostic info resource.
			//  It will then connect to particular databases.

			// Such as an Info resource connecting to Resource_Mongo
			//  Not quite sure what place the info resource takes, it may provide a schema for the web db.
			//  May want some kind of interface/resource over the info one to make it into a website info resource.


			// Setting up the website's information resource seems like a priority.

			// All sites have a fairly generaic info resource.
			//  They then use resource-[specific-db] to persist the data.

			// Ensuring the database is set up could be a step in starting up the server
			//  Though this would be done through the resources system.

			// The specific server will set up the info resource to connect with a particular database resource.



			// Data for the site may also be exposed through the admin interface.
			//  In other cases, the site can have data interfaces.

			// Want one of the main components of the page to be a tree that shows the site's data.

			// Maybe I can make it show the whole expanded tree on the server... that could get very big for big sites.

			//  Want a simple way of navigating the site.
			//  Want access to the Data_Objects and Collections that represent the website.

			// I think an info resource would be a good thing to start with.
			//  It can load the info I have, and then could be editable through the admin interface.

			// Also, an Info-Persist system may be good.
			//  Then want interfaces from that to the various DBMSs.

			// I think more work on the flexible DB side of things is needed now.

			// The website info just needs an object interface.
			//  Need a fairly general purpose interface to DBs.


			// could connect to a resource-mongo.
			//  Then use get and set to access values in collections.
			//  Maybe some more resource verbs too, to match RESTful http.

			// POST is like JS push
			// PUT is like set


			// Could show the same admin control for all routes?
			//  There could be admin/files in particular.


			// Should show an admin page.
			var spc = new Server_Page_Context({
				'req': req,
				'res': res,
				'pool': pool
			});
			
			
			//this.respond(spc);

			// Not so sure about this responding exclusively with an HTML document.
			//  It may be required to act as a JSON or even XML service at some point.

			// Maybe something else will make the server's resource pool available?



			var hd = new jsgui.Client_HTML_Document({
				'context': spc
			});

			hd.include_client_css();
			hd.include_jsgui_client('/js/app.js');
			
			// need to have the login control.
			//  Should be fairly simple... but need to be collecting the login information.
			
			// Login control contains a form?
			//  That could be an option maybe.

			// Then show different controls depending on the specific route.
			//  The web admin (page) control could be fairly generic.

			// Thinking that a 'content' admin control may be good.
			//  Then content/structure
			//  content/pages
			//  content/pages/pageId or page url name

			// Structure could be used to define the site's menus.
			//  Maybe there is the root group
			//   Then there can either be a group or a page at each level
			//    Consultancy is the only page in the root group.

			// Think we need drag and drop interface, dragging both group items and page items.
			//  A toolbox.
			// Ability to create new items easily.
			//  + icons in places where they can be created.
			// So in the root group we just have a plus item
			//  Click it to create either a group or a page.
			//   Possibly drag existing pages into the structure.
			//    Have a pages viewer.

			// The content editor could allow editing of both pages and structure.
			//  Will be possible to view either the structure or a page by itself.
			var body = hd.body();

			// Having some kind of a control panel would be useful here.
			//  Panel on the left, likely for navigation.
			//  Main panel used for displaying and editing content.

			// A server admin interface is what we are after here.
			//  Want to be able to administer the resources on the server.
			//   Also access the resources that the server has access to.

			// Ideally want to be able to edit some JSON or other data in a remote database, with that
			//  controlling the web server.

			// Web_Admin allowing generic access to resources in the resource pool?
			//  That will be nice.

			// The resource pool would need its administration to be externally published though.

            console.log('rurl', rurl);


			if (rurl == '/admin/') {
                // Want to use the web admin control here.

                console.log('pre create web admin control');

				var ctrlAdmin = new Web_Admin_Control({
					'context': spc
				});

                // I think it will need to use asyncronous rendering.

                //console.log('post create web admin control');
				// oh... when the body is created, it does not have a context.
				//  need to be able to assign it, and sub-controls a context
				
				// Could use activate?
				ctrlAdmin.active();
				body.add(ctrlAdmin);

                console.log('post add wa control to body');
			}

            // Want the wen admin control to allow creation of pages
            // Uploading of images
            // Viewing and editing of website data.
            //






			// Content admin

			// Content structure admin
			if (rurl == '/admin/content/structure') {
				var ctrlAdmin = new Web_Content_Structure_Admin({
					'context': spc
				});
				// oh... when the body is created, it does not have a context.
				//  need to be able to assign it, and sub-controls a context
				
				// Could use activate?
				ctrlAdmin.active();
				body.add(ctrlAdmin);
			}


			// Content pages admin

			if (rurl == '/admin/content/pages') {
				var ctrlAdmin = new Web_Content_Pages_Admin({
					'context': spc
				});
				// oh... when the body is created, it does not have a context.
				//  need to be able to assign it, and sub-controls a context
				
				// Could use activate?
				ctrlAdmin.active();
				body.add(ctrlAdmin);
			}

			// Will be able to use a Page_Editor







			
			
			
			
			// When sending the client js...
			//  It will need to create the right object references.

			// I think we need to generate a page to send.
			//  It should not be all that complicated a page.

			// Maybe just generate the script.
			//hd.active();
			// making a document active...
			//  that means it creates a script to send.
			//  need to tell it what to do when the page starts, and make sure it has the right references.
			//   sounds tricky to do per individual page.

			// Perhaps for the moment I'll define this in the app.


			// and that will set the context of the login control.
			//  The body will already have its context set.
			
			// Is a lot going on here... will likely need to optimize some things.
			
			//  Then when the items are within their own context (._context has been set)
			//  they will not be a huge memory and slowdown leak.
			
			
			
			//var body_context = body._context;
			//console.log('body_context ' + body_context);
			
			
			// the dynamic reassignment of context for all nested controls...
			//  seems important to do.
			
			
			
			
			// Should not be getting slower on each request!
			
			
			// and serve that blank HTML document.
			console.log('pre all render');

            // Would asyncronous rendering work better?
			//var html = hd.all_html_render();

            hd.all_html_render(function(err, html) {
                if (err) {
                    throw err;
                } else {
                    console.log('cb all render');

                    var mime_type = 'text/html';
                    //console.log('mime_type ' + mime_type);

                    res.writeHead(200, { 'Content-Type': mime_type });
                    console.log('pre res end');
                    res.end(html, 'utf-8');
                    console.log('post res end');
                }
            })







			
		}
	});
	return Resource_Web_Admin;
});