
if (typeof define !== 'function') { var define = require('amdefine')(module) }

//define(['./jsgui-server', 'os', 'http', 'url', './../node_modules/node-tokyocabinet'], function(jsgui, os, http, libUrl, tokyocabinet) {
define(['./jsgui-server', 'os', 'http', 'url', '../db/resource-postgres', './resource-server-pool'], 
	function(jsgui, os, http, libUrl, Resource_Postgres, Server_Resource_Pool) {
	
	// './abstract-web-db-postgres' won't be used for the moment here.
	//   This code will be in a lower layer, with its functionality provided through resources much of the time.
	//   This will enable things to work much more smoothly because the interface will be constrained here and specifically designed for these purposes
	//   It will be quite easy to get the resources talking to each other here and using each other when needed.
	//    Will 'interface' for what it provides / is, and will use 'requires' for what it requires.
	
	// Requires will have some flexibility built into it, so it could know it needs some variable name, like IP address, and can find out where to get it
	//  from. Don't want it too autonomous though. Checking a few things so that it's easier to configure them.
	
	// Have both the abstract web db module
	// And the dbi-postgres modules.
	
	
	// Will make the abstract web db.
	
	// Then persist it.
	//  Then may use a web-db-postgres or web-db module to allow function calls through a web interface.
	//  Maybe that would be a web-dbi module.
	
	// Make use of jsgui.Server.
	//  That will need to connect several APIs.
	
	//var Web_DBI_Postgres = web_db_postgres;
	
	// With this module setting up many of the things to do with MetaBench.
	//  The name of the website.
	//  Telling the abstract-web-db generator to generate the website's database.
	
	// Then the database gets made, and interacted with.
	
	// Database server components or extensions?
	//  Some of the functions could be made available fairly directly to users.
	//  That would mean that quite a lot of data could securely be made available to the client applications.
	//  It would be the abstract setup in the first place where this gets specified.
	
	// This will define things specific to MetaBench.
	//  The name
	//  The configuration
	//   Which options get used (will be defaults for the moment though)
	
	// Then will persist the database
	//  Load in the intial data
	//   Run the server.
	//    Expose parts of the database to the web
	
	//  The capability of setting website content is fairly important.
	//  Likely to be using a restful architecture.
	//   And likely to have a restful admin client.
	
	
	// Will be configuring an abstract-web-db-postgres.
	
	// Or the web-db-postgres doing a useful function?
	//  Don't see it as that important right now.
	//  The DB can get set up.
	//  The server can run.
	
	// This will probably be done as part of the configuration section.
	
	// database_configuration
	// then the database is configured / checked.
	//  various JavaScript functions will be made that connect to the database.
	// Then the web interfaces exposes various resources / services.
	
	// Will likely be creating the initial website within the database.
	//  Nice to set up MVC models so that the data updates correctly.
	
	// Designing the site structure... needing to have everything generated / produced correctly.
	//  The system needs to be fairly veristile to do this.
	//  Not just templates
	//   There will also be some controls that get information from the database.
	
	// Will these controls connect to the DB from the client?
	//  They may be able to save their data. A lot would depend on the client's permissions, but it would be nice to technically have that facility.
	//  That whole system could be set up in a fairly abstract way, then the pieces connected with server and database components.
	
	
	
	// Perhaps this won't use abstract database systems directly.
	//  Should possibly be outside of 
	
	
	// This could use a Resource API, so that everything that gets called or used here is through the resource / publishing system.
	//  Various resources could use these programming tools to do their jobs.
	//  Keeping the interface constrained at this level will help people get started.
	//   There can be quite a complicated system working in the background, but with this people will be able to get the resources available
	//    quickly, then use them to access and provide access to advanced functionality.
	
	var stringify = jsgui.stringify, each = jsgui.each, fp = jsgui.fp;
	var get_truth_map_from_arr = jsgui.get_truth_map_from_arr;
	
	// May go without the initial data from here for the moment, and go with the je suis XML GUI components.
	//  Then can have a more solid basis to proceed with the rest of it.
	//   Possibly use Mongoose?
	//   Would be very interested in getting the web app API up and running.
	//    Then could make a fairly impressive client app that edits data, could set some publishing options, that data could be programmatic or 
	//     config data for programs... could get onto some very useful functionality to do with MetaBench.
	
	var initial_data = [
	                    
	                    // May have to be flexible in terms of interpreting the parameters.
	                    
	                    // This is what would make good middleware.
	                    
	                    
	                    ['roles', ['administrator', 'user']],
	                    ['users', [{'username': 'james', 'password_hash': 'jav124'}]],
	                    
	                    // and the user role connecting the two?
	                    //  it would know that neither of them are string fields, but both of them refer to other tables,
	                    //  with their unique string columns (username and name). name is a big hint too. username too, possibly.
	                    
	                    
	                    // this will take more work so that it accepts these params as strings.
	                    //  can make another version of the crud function.
	                    //  then we'll have this, operating quickly.
	                    
	                    // Will be very easy to put data into the database.
	                    
	                    // 
	                    
	                    
	                    ['users_roles', [['james', 'administrator']]],
	                    
	                    
	                    
	                    ]
	
	
	
	// The applications would have their own convenient APIs for consuming the data.
	
	
	// First will do a lot creating the abstract database rather than connecting to metabench db.
	
	
	// Don't think we'll bother with the actual web server for a moment.
	//  I think it will be a while before it is ready to be running.
	//  More to do on the database structure and creation features.
	
	
	
	// Not exactly just the abstract web db.
	//  It's more like an abstract web db postgres TOOL.
	//  It generates it and manages the abstract database.
	//  It won't do much itself to interact with any real database by itself.
	
	
	
	
	
	// then connect to an actual Postgres database.
	
	
	
	// then persist the abstract one.
	
	// then start up the web server.... though this will be done by another module.
	
	// should check if there is a local postgres database.
	//  need to get access to it though... should not be a problem from the same machine.
	//  otherwise, use username and password?
	
	// A bit more code to get this to work... need to do a fair bit more on all of the components.
	
	// Also, could possibly model a domain or service.
	
	// Say there are users, they have the following information...
	//  Abstracted further back from the postgres system.
	//  Also, want an RDB interface that is abstracted back from Postgres.
	//   May be worth making other database interaction modules too.
	
	//   May we want to connect to Postgres over the LAN?
	
	// Having a more distributed database system could be a useful thing to have.
	//  May want to test this... would be useful with a KVS.
	// Could check out MongoDB.
	//  Possibly connect to the postgres database using network credentials.
	
	// Likely to have controls that interact with data.
	//  Don't want much data interaction code in the GUI.
	//   Will be able to save things to the server with an API.
	
	// May be worth building a system not using Postgres too.
	//  Could have a system using mongo db.
	//  Would have the same web facilities available.
	
	// Hybrid database - many things relational, other things stored in an object database.
	//  Different models focused in different ways.
	//  Transactions could be very useful in relational.
	
	// I'm thinking about making my own database system too, from a lower level.
	//  I think Postgres may be fine for the moment though.
	//  Other DB system could be better for logging?
	
	// Want the components to be interchangable.
	
	// Soon want it holding and rendering jsgui documents and code.
	//  I think the database could hold pages (or other items) as JSGUI XML. Will be like XHTML but with jsgui controls interspersed, like with ASP.NET.
	//  Likely to be rendering this on the server normally and on the client while editing such content.
	
	
	
	// then let's persist it to a real database.
	
	
	
	
	
	// then we want to generate the web tables.
	
	
	
	
	
	
	// also want to create the server object.
	
	// This server should maybe just be a 'Server' object, customized for the MetaBench website.
	//  Or just an object that conforms to the right API.
	
	
	
	
	
	
	
	
	
	
	
	// inital connection (postgres).
	
	// site connection (metabench)
	
	// execute a chain of commands, eg creating a bunch of crud functions, putting in a bit of data
	
	// defining command chains and executing different ones.
	
	// Will want flexible data types too.
	
	// This could go a bit further than the web-db-postgres?
	//  Or maybe that should have user-level data structures too.
	//  Defining a data structure could be a user privalage.
	
	// May want to also expose an API, so that web apps can make use of the user data.
	//  In this case, a well defined system of data structures makes sense.
	
	// Will possibly allow for a basic site in admin mode.
	// A content management platform?
	//  Possibly, will have the HTML capabilities.
	//  This will use postgres and possibly other dbs.
	
	
	
	// Will have a fairly capable DB site server.
	//  Various different things, including HTML content, will be in the database.
	//  The fairly simple DB api will make managing the site easier.
	//  Could have a secondary db config stage within this module.
	//  Could extend the database a bit further - but the default features will be enough to get a site up an running and managed.
	
	
	
	
	
	
	/*
	
	var dbi_pg = new Web_DBI_Postgres({
		
		'port': 5432,
		'host': 'localhost',
		'username': '_postgres',
		'db_name': 'postgres'
	});
	*/
	
	
	// will need to connect somehow.
	
	//  The database APIs will likely do more though.
	//  Use syntax that connects more directly to the required database.
	
	
	//var tokyocabinet = require('node-tokyocabinet');
	
	// Postgres could require some fairly in-depth programming for stored procedures and ensuring the structure of the database.
	//  Seems like a neat format, and also like if done well, middleware should support it well.
	
	// May want to make a more general, not MetaBench server.
	// May want a name for the web framework.
	//  This is more than just gui now.
	//  And it may set up the DB to handle web serving business logic.
	
	// web-db?
	
	// Could just carry on for the moment.
	//  May wind up releasing database configurations as open source.
	//  They get run by the software (on metabench.com) and create the SQL which can be downloaded to create the db.
	//  Or possible the user can run a node.js script.
	
	// More general purpose database module?
	//  just call dbi?
	//  web-dbi could be a good name.
	
	
	//var pg = require('pg');
	
	// We'll try connecting to this postgres.
	
	
	
	// What's the platform
	//  What's the version number?
	
	// Need to use this to make a server.
	//  It will be easy to run particular servers.
	
	
	//  May be verbose with all these different resource servers, but it splits it up nicely.
	//  Don't want the code to be too nested.
	
	// General Resource_Page...
	
	// Represents some info shown as a page.
	//  Can be linked to.
	//  Can have a specified URL.
	//  URL may be relative to other resources (inside them).
	// Resources exist independantly from other pages.
	//  They'll most likely be initialized when the server loads or when needed.
	
	// An abstraction layer between the data (which could be very much like backbone or could be backbone) and the presentational controls.
	
	// I think I'll do this in Postgres.
	//  Having difficulty using tokyo cabinet with Node.
	//  May get help wrapping C++ examples.
	
	
	/*
	var pg = require('pg'); //native libpq bindings = `var pg = require('pg').native`
	//var conString = "tcp://postgres:1234@localhost/postgres";
	
	
	// Connection with the _postgres user, as documented at http://www.peerassembly.com/2011/08/09/installing-postgresql-on-lion/
	
	// I should work on a postgres layer.
	//  This will do some kind of ORM - but we already have the data type and data structure in nested data.
	//  This would be good to fit in with some ORM so that types could be developed in a GUI and then the code will get written for the SPs.
	
	var conString = "tcp://_postgres:5432@localhost/postgres";

	//var client = new pg.Client(conString);
	//client.connect();
	
	pg.connect(conString, function(err, client) {
		client.query("SELECT NOW() as when", function(err, result) {
			console.log("Row count: %d",result.rows.length);  // 1
			console.log("Current year: %d", result.rows[0].when.getYear());
		});
	});
	*/
	
	// Should be a whole load simpler in JavaScript than VB.NET.
	
	// Could build a statement in a general form and then execute it.
	//  That could make the particular code writers simpler in the long run.
	
	// For the moment want some simpler functionality but then will have more code get generated.
	/*
	dbi_pg.connect(function() {
		// maybe will have err, connected data
		
		// or return the connection client.
		//  or itself, but connected.
		
		// maybe this will be the client, dbi_pg
		have_pg_metabench();
		console.log('callback ');
		
		
	});
	*/
	
	
	/*
	var have_pg_metabench = function() {
		
		// The web version with potentially more functionality
		//  In particular to do with setting up and running a website.
		//  Could have some quite advances (and maybe simple) features to do with running a website.
		//  Various key-value items could be made to hold a whole website.
		//   Will be able to archive other websites with the same system.
		
		// User / roles permission is one of the main things.
		//  Making the admin page too would be good.
		// Add remove files, documents, sites
		//  Publish these things
		
		// Want there to be a fairly simple admin interface as default.
		
		// Tools could be made available (like file upload) in certain situations to site users.
		//  User registers
		//  Has permission to run form with file upload.
		// May have db-admin module.
		//  Though some will be client-side.
		//  Maybe quite a few components will be sent to the client.
		
		
		dbi_pg = new Web_DBI_Postgres({
			//*
			// * this.port = spec.port;
			//	this.host = spec.host;
			//	this.username = spec.username;
			//	this.db_name = spec.db_name;
			//*
			'port': 5432,
			'host': 'localhost',
			'username': '_postgres',
			'db_name': 'metabench',
			'single_and_plural': [['user', 'users']]
		});
		
		
		dbi_pg.connect(function() {
			// may have it automatically connect.
			
			// May want to have a blog.
			//  Possibly want a lower-level DB system, where key-value items are stored.
			//  These would be pieced together to make the website.
			
			// The web-db system should allow most things that are required for the moment.
			
			
			
			// It may be worthwhile to build a whole website system from the bottom-up.
			//  Would be fairly easy to put some HTML pages in there as specific resources without generating them on the server.
			//  The ability to do both would be good.
			
			
			
			
			
			Web_DBI_Postgres.configure_db(dbi_pg, function(error, config_res) {
				console.log('config_res ' + stringify(config_res));
			});
			
		});
		
		
		
		
		
		
	}
	
	// Want to get a list of the existing databases.
	// A new API layer for this and other things.
	// It's middlewear really.
	
	// Postgres_Data
	//  Not just one database?
	
	// DBI_Postgres
	
	// I think that would encapsulate the functionality.
	//  postgres user
	//  port
	//  host
	//  database (starting database. it can be changed)
	
	
	
	
	
	
	
	
	
	
	
	
	
	// Will be able to create databases and do things like that now.
	
	// Don't want a very general postgres adapter???
	//  But will want to do similar things with other db formats, like SQL Server and MySQL where possible.
	
	// Will be able to use the descriptions in data_type_info, listing fields in a relatively simple way.
	
	// Will have some general database capabilities for key-value-store like things.
	//  Pieces that could be replaced with other KVS implementations.
	
	/*
	
	
	
	
	

	//queries are queued and executed one after another once the connection becomes available
	client.query("CREATE TEMP TABLE beatles(name varchar(10), height integer, birthday timestamptz)");
	client.query("INSERT INTO beatles(name, height, birthday) values($1, $2, $3)", ['Ringo', 67, new Date(1945, 11, 2)]);
	client.query("INSERT INTO beatles(name, height, birthday) values($1, $2, $3)", ['John', 68, new Date(1944, 10, 13)]);

	//queries can be executed either via text/parameter values passed as individual arguments
	//or by passing an options object containing text, (optional) parameter values, and (optional) query name
	client.query({
	  name: 'insert beatle',
	  text: "INSERT INTO beatles(name, height, birthday) values($1, $2, $3)",
	  values: ['George', 70, new Date(1946, 02, 14)]
	});

	//subsequent queries with the same name will be executed without re-parsing the query plan by postgres
	client.query({
	  name: 'insert beatle',
	  values: ['Paul', 63, new Date(1945, 04, 03)]
	});
	var query = client.query("SELECT * FROM beatles WHERE name = $1", ['John']);

	//can stream row results back 1 at a time
	query.on('row', function(row) {
	  console.log(row);
	  console.log("Beatle name: %s", row.name); //Beatle name: John
	  console.log("Beatle birth year: %d", row.birthday.getYear()); //dates are returned as javascript dates
	  console.log("Beatle height: %d' %d\"", Math.floor(row.height/12), row.height%12); //integers are returned as javascript ints
	});

	//fired after last row is emitted
	query.on('end', function() { 
	  client.end();
	});
	
	*/
	
	
	
	
	
	
	// Not sure we'll be using that sort of resource server right here.
	//  It may work like this,
	//  however I plan on having resources able to be served from the database.
	
	// The things to do with the structure of the site will be in the database, and maintainable using the admin system from there.
	
	// The server will be made to serve these things from the database - however that requires more work on the web db section.
	//  Will have it generating responses using info from the database and testing the html generated before this is properly hooked up.
	
	// Will likely have various resource servers.
	//  So a resource could be identified at a url.
	//  Sub-urls go to sub-resources
	//  And the resource servers are going to be making calls to databases and interfaces that do so.
	
	// Perhaps would even be able to expose the database as a restful interface.
	//  Resources on the site could be dealt with using REST.
	//  Perhaps controls would have identifying information about the data too, so the data could be updated on the server.
	
	
	
	
	
	
	
	
	
	
	
		
	
	
	
	/*
	var MB_Home_Page_Resource_Server = jsgui.Home_Page_Resource_Server.extend({
		
		// This may reference other resources in the website.
		
		// Will be able to get authentication and permissions responses from the web-db module.
		
		'process_response': function(req, res) {
        	// needs to work out the URL.
        	
        	// may have been given a URL from within something else...
        	
        	 i2 = libUrl.parse(req.url);
             var url = i2.href;
             console.log('MB_Home_Page_Resource_Server site resource url: ' + i2.href);
             var ua = req.headers['user-agent'];
             console.log('MB_Home_Page_Resource_Server site resource ua: ' + ua);
             
             
             var site_category_names = ['Consultancy', 'jsgui Framework'];
             
             
             
             var spc = new jsgui.Server_Page_Context({
            	 'request': req,
            	 'response': res,
            	 'rendering_mode': 'html5'
             });
             
             
             // Could all be done through standard markup.
             var html_tag = new jsgui.html({
            	 'page_context': spc
             });
             var head_tag = new jsgui.head({
            	 'page_context': spc
             });
             html_tag.add_control(head_tag);
             
             var title_tag = new jsgui.title({
            	 'page_context': spc
             });
             head_tag.add_control(title_tag);
             
             //var title_tn = new jsgui.textNode('MetaBench');
             var title_tn = new jsgui.textNode({
            	 'text': 'MetaBench',
            	 'page_context': spc
             });
             title_tag.add_control(title_tn);
             
             var body_tag = new jsgui.body({
            	 'page_context': spc
             });
             html_tag.add_control(body_tag);
             
             
             // render the html tag
             
             // the doctype definition from the page_context
             
             var hr = spc.get_dtd() + html_tag.all_html_render();
             console.log('** hr ' + hr);
             
             
             var s_date = new Date().toUTCString();
             res.writeHead(200, {
                 'Content-Type': 'text/html',
                 //'Content-Encoding': 'gzip',
                 'Cache-Control': 'max-age=3600000',
                 'Expires': 'Thu, 30 Oct 2014 14:19:41 GMT',
                 'Date': s_date,
                 'Connection': 'close'//,
                 //'ETag': ETag
             });
             res.end(hr);
             
             
             
        }
	});
	
	
	var rs_homepage = new MB_Home_Page_Resource_Server({
		
	});
	
	var MB_Site_Resource_Server = jsgui.Site_Resource_Server.extend({
		
		// may not need to extend this...
		
		
		'process_response': function(req, res) {
        	// needs to work out the URL.
        	
        	// may have been given a URL from within something else...
        	
        	 i2 = libUrl.parse(req.url);
             var url = i2.href;
             console.log('* MB site resource url: ' + i2.href);
             var ua = req.headers['user-agent'];
             console.log('* MB site resource ua: ' + ua);
             
             // So, need to have this generate a page (in general).
             
             // For the top URL...
             
             if (url == '/') {
            	 console.log('processing root');
            	 
            	 // Need to use the home page resource server.
            	 rs_homepage.process_response(req, res);
            	 
            	 
             }
             
             // Needs resource server instances though.
             
             // Needs to use an instance of a the Home_Page_Resource_Server.
             
             
             
             
        }
	});
	
	
	
	var MetaBench_Site_Data = jsgui.Class.extend({
		'init': function(spec) {
			
		},
		'connect': function(callback) {
			// may provide itself in the callback.
			
			
			// Maybe will use some other data adapters.
			//  Likely to attempt to connect with a Tokyo Cabinet adapter.
			
			
			
			
			
			callback(this);
			
		}
	});
	
	
	var MetaBench_Server = jsgui.Server.extend({
		'init': function(spec) {
			this._super(spec);
			
			// an array if the order is important.
			
			// start the resource connection,
			//  will be checking that a tokyo cabinet db is there.
			
			// Will use a MetaBench_Site_Data object.
			//  This will have a fairly convenient API somehow.
			//  May be a DataObject or a ConnectedDataObject.
			
			
			
			
			
			
			
			this.resources = {};
			
			
			
			// Serve the site as a resource from the root URL.
			
			this.resource_servers = {
				'/': new jsgui.MB_Site_Resource_Server({
					'root_url': '/'
				})
			}
		},
		'start': function() {
			
			// the resources themselves... may be nice keeping them together for the site.
			
			
			
			this._super();
		}
	});
	
	
	jsgui.MB_Site_Resource_Server = MB_Site_Resource_Server;
	jsgui.MetaBench_Server = MetaBench_Server;
	
	
	*/
	
	// Various remote resources will wind up getting indexed by the system.
	//  Perhaps a larger number of remote resource information objects should be stored in the database?
	//   Don't want to clog up the RAM on the machine?
	//   RAM usage usuall would not be too much of a problem, but we may want to store a very large amount of remote resource information.
	//    This could be information about web pages.
	
	// Storing information about remote resources...
	//  Lots of different ways of keeping things.
	//   Store a site's captured pages?
	//   Break them down further and analyse them?
	//   Index them?
	// There is a lot that can be done within this area. Need the flexibility to do lots more in the future.
	
	// Defining remote resources in a flexible way could be quite a task.
	//  Files, bits of files, data represented within files,
	//  remote databases, data represented within such remote databases.
	// May make user controls available as separate modules.
	//  Could combine a bunch of them into one file.
	// Likely to have them stored on the server, being available separately, or as part of a build.
	// Would also be usable for just creating HTML on the server.
	// I think we'll be able to get a very fast web publishing service with CMS.
	//  Won't just be publishing, will do some site administration.
	
	// Should get on with making it make the database, and then executing the necessary functions from that.
	//  Having the site begin to produce HTML would be very good, of course.
	//  Should probably continue doing more things in the background that get all the pieces in place for the system to work.
	//  Won't have very complex logic to handle in the database
	//   But will want some convenient ways of programming what is needed.
	
	// I already have a lot that does page generation using controls.
	//  Page generation using parameters is another thing.
	
	// Resources served on the local server as part of the system...
	//  These will have to be indexed too.
	
	// Resources (remote and local) are a very open-ended thing.
	//  Local to the server process
	//  Remote resources available to the server process.
	
	// Can not define so well what fields these resources have...
	//  But may as well use them.
	
	// Do more to define the server platform?
	
	// Having the system store code would be great for various reasons.
	//  Would help a lot having the structure in there for doing the documentation.
	//   Could probably run unit-tests from within the system, perhaps automatically when code gets changed.
	//    Benchmarking too?
	//   Could allow people to post code that does something and get paid for it?
	//    Algoritms get written to do things - jobs posted?
	//     Unit testing would have to be involved though.
	
	// A marketplace for algorithms and code...
	//  But want a lot available for free.
	
	// Remote resources could be various other JavaScript libraries too.
	//  Would be very nice so that the server can be got running without being told anything.
	
	// It will find the local postgres server, define it as an available resource, and connect to it.
	//  Will look for the metabench database, connect to that
	//  Will get further config information, information about resources.
	
	
	// The info about resources should be abstracted, or stored in different layers.
	//  Application layer - stored in the JavaScript process.
	//   Would be useful for information about db connections.
	//   Could be useful for some indexes - when a table is distributed accross a network, another / all other nodes could hold an index to it in RAM.
	//    Or just 1 or 2 other computers with that index, the others refer to it across the network.
	
	// So the local resources may be made available by the server, but they should not necessarily be shared.
	//  May want to store information about possible different network configurations - 
	//   which bits of the app doing which things.
	
	// Want to avoid problems with overwriting the DB when it is in operation.
	//  So will have it quite dynamic and flexible.
	
	// Will probably be exporting data then re-importing it when there are big changes.
	//  However, database administration tool could make the chagnges itself - and get the changes to carry accross the network.
	//  Could take individual servers out of action while making the changes to the database structure.
	
	// This looks fairly likely to be useful at least in the background, and could be made more exposed through the web application.
	
	// Want to make this system fairly easy to configure using the GUI.
	
	// Resources can be initialized outside, and run outside, the server.
	//  They will get put into the the resource pool.
	
	// Sometimes the will rely on other resources in the pool.
	
	// Can have a lot of data in JSON format here about the website.
	
	// I'd prefer to have more that is dealing with data sources and potentially cloud services.
	//  Mongolab may be an interesting one to use to get started with.
	
	// Probably should do more with setting up this local Postgres server.
	
	
	
	var MetaBench_Server = jsgui.Server.JSGUI_Server.extend({
		
		// Should the JSGUI server do a scan of available resources?
		//  Probably, it's not just for MetaBench.
		//   However, some code to do with specific resources may not be open sourced.
		
		'init': function(spec) {
			this._super(spec);
			
			// other things will get put in the resource pool.
			
			// get the local server info resource from the pool.
			console.log('-----------------------------------------------------')
			
			var rp = this.get('resource_pool');
			console.log('rp ' + rp);
			
			// find item(s) with matching interface.
			
			// The resources may be indexed by interface(s) as well.
			
			// Full-text search would be useful for matching within an interface string.
			
			
			// One of the resources in the pool could serve files.
			//  These files could be processed with je suis xml
			
			
			
			
			
			
			rp._resources.each(fp(function(a, sig) {
				//console.log('resource sig ' + sig);
				var item = a[1];
				console.log('item ' + stringify(item));
				
			}));
			
			var server_info_resource = rp.get_resources_by_interface('server_information');
			
			console.log('server_info_resource ' + stringify(server_info_resource));
			
			
			//var local_postgres_server_resource = new Resource_Postgres.Server();
			
			// could set up a directory-based server, using routes.
			//  I think routes will be a good feature.
			//   They will be usable for a restful interface.
			
			// At the same time, can be processing these jsgui pages, turning the XML into HTML with activation code.
			//  The activation code can be really simple - calling a JSGUI activate function. Will take JSON parameters.
			//   Screen-scraping will be possible, but not a required method for activation. Will be automatically done / encouraged where 
			//   useful.
			
			// Components getting data on the server, being rendered there, and sent to the client with them having MVC interactions.
			//  Server would possibly know what client has.
			
			
			
			
			
			
			// then with that resource we are able to use it as a requirement for another resource, the server itself, and the (local) postgres server
			
			// We can give the IP address property of the server_information resource,
			//  or it knows to look out for the IP address property when it has something with that interface (server_information).
			
			// Telling things to look on the local server?
			
			// Not so sure about having it detect services right now...
			//  Will give it a Postgres-Web-DB-Resource and tell that resource to get it's IP address from the local server.
			
			// Now that the collections are working, this whole system will work a lot more effectively.
			
			// other resources?
			
			// will use the web-db-postgres resource... helps to know the local server.
			
			// Perhaps now thit has the local server information (or some of it), it can get started running Postgres?
			//  Perhaps it could discover that Postgres is running on the local server.
			
			// That is where 'local_server_information' could be doing more.
			
			
			
			
			// var local_web_db_postgres = new Web_Db_Postgres_Resource({'server_information': server_info_resource})
			// Won't be any such resource for the moment
			
			// Will have Postgres DB
			// Then RDB
			// (then RDB-ODB?) - this could be used so that JavaScript constructs can be given to the database to store.
			//   it may be doing this using particular get/set interfaces, which I have done some work on already.
			// The Web DB
			
			
			// That abstraction would help Web DB run over different database implementations.
			// There may be a different Web DB that connects with object databases.
			
			// Need to get the various things running, and the different adapters on them.
			//  Not doing the Postgres-Web-DB at the moment because I'll have it running through more abstraction layers for better modularity.
			//   Hopefully they will not impact performance badly as the code will be fast and will be able to call on the right things quickly.
			
			// It may even know it is in a resource pool so look in that pool for the item(s) of the interface it needs.
			
			
			
			
			
		},
		
		
		
		// The server could keep track of other servers.
		//  That will likely be indexed somehow.
		// The collection object could probably be used to track External_Server objects.
		//  This would be a good starting point for interfacing with these external servers.
		//  Perhaps dbi-postgres would be dealing with these External_Postgres_Server objects (could be a local server, external means external to the node.js application).
		//   The external_postgres_server object would then be able to carry out various operations on the external server.
		//   Maybe dbi-postgres will be refactored.
		
		
		// The MB server could discover local resources, with some help from descriptions.
		//  File system
		//   Disk drives
		//  Local services (databases), could be found from a port scan even.
		
		// Once the local database is found, could load more data from that.
		//  Will possibly have fairly tight postgres integration with this.
		//   May be useful for setup.
		
		// Need more things working together nicely.
		
		// Could have a resource scanner.
		//  Resources API could be built for finding and using resources.
		//   Could find resources on the internet with a search/
		//   Could find resources on the local computer, some of which can be accessed.
		//    Could search for (and possibly find) resources on the LAN, such as Postgres servers.
		//     Server could contain information about what it is actually being used for within the system.
		//      And may not be advertised as a public or network facing resource (though may say what it should be accessed across the network for, if anything).
		//     May also spot the jsgui node most associated with that server.
		
		// Having the resource system defined and working could take a while longer 27/02/12, a few days possibly.
		//  Or could just get the important bits working, doing what is required.
		
		// Having things open to the GUI will make a lot of difference for development.
		//  Not quite sure how much I should make in the GUI...
		//   Probably will have a fair few editing components.
		//   Editing abstract databases of various kinds
		// Website editor would be a very useful tool
		//  Will have this integrated with the 'build' and 'resource' system. Will be able to edit snippets of HTML and uiml. Then the server would run them.
		//   Editing these files in the abstract before publishing them?
		//   Publishing them very quickly / automatically to development server.
		//    The developement server could be connecting with the main system though.
		
		
		// this is going to use a much more abstract system of resources, which is in jsgui-server.
		//  These will provide quite generalized capabilities.
		
		// This specific module will set up a server for the metabench website using the jsgui-server and other MetaBench capabilities.
		
		// The database deployment does seem like an important part of things.
		
		// Ensuring the DB setup will be done from the appropriate web db resource.
		/*
		'ensure_db_setup': function(callback) {
			
			product_name = 'metabench';
			
			var abstract_web_db_postgres = new AWDB_Postgres({
				'name': product_name
			});
			// don't set up the database at this point.
			
			
			// generate web functionality
			
			abstract_web_db_postgres.generate_web_functionality();
			// this should generate the db.
			
			abstract_web_db_postgres.get('generator').persist_generated_to_abstract(product_name);
			abstract_db = abstract_web_db_postgres.get('database');
			
			
			
			// should be able to connect to the local / preferred postgres database.
			// however, on this level, maybe it should not be specified as postgres, but a database with the right api.
			
			// this is where web-db-postgres could come in handy.
			
			// then we want to deploy the abstract database.
			//  maybe requires the connection?
			//console.log('abstract_db ' + abstract_db);
			// deploy_local won't keep the connection.
			
			// Deploys the database locally, works conceptually on the postgres db and node level.
			
			// Want something that treats this as a resource.
			//  The local external resource reference is created (a reference could possibly be a local resource / application level resource)
			//   may help when there are very large numbers of references, only some of which need to be loaded, or they are indexed by a node.
			//  The local resource system is created
			//   this may contain a resource connector as a local resource
			//  An abstract version of what should be at the external resource is created
			//  The resource connector connects to the external resource, and creates an application level resource that represents it
			//  The now local/application level resource is told what database should be there, reference being the generated abstract database, and it persists it.
			//   (possibly it is given something more complicated representing changes that get made to the database, could have changes that have
			//    already been made be logged as such but it sequentially carries out the other changes that are required)
			//  Carrying out an analysis of an existing database could be part of the update process.
			//   Could simply add or rename a row in some cases.
			//   May want to be very deliberate about persisting a change in the model to the relevant databases.
			
			// I think making it more enterprisey, with a bigger framework to handle many things will help, and it will be in contrast to the style of the client side library
			//  where I will leave out useful things because they would take too much space. I don't have that concern in coding mainly for server use.
			
			// The whole system is likely to be be represented in the client as well though.
			//  Resources could also be a useful point for content in the database and having users administer it.
			//  Not every resource would be owned.
			// Perhaps a user_resource would be. The website server would load up various resources, with the user rights it has.
			//  Every resource would have been set to be published.
			//  The website itself would be a resource that gets published.
			
			// The resource systems in the DB and in the app should correspond.
			
			var deploy_local = function() {
				
				// deploying locally with certain information set.
				
				// when this is done we'll be able to hook up services to a web api.
				
				DBI_Postgres.deploy_local(abstract_db, '_postgres', initial_data, function() {
					console.log('deploy_local (abstract db) routine finished');
					callback();
				});
				
			};
			
			deploy_local();
			
			//DBI_Postgres
			
			// so the abstract DB can get generated OK, but will need deployment.
			
		}
		*/
	});
	
	
	return MetaBench_Server;
	
});