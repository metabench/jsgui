

// As a resource, want to reveal the mongo interface.
//  This may be a simple matter of using a generic wrapper for the mongo object (for many things)
//  It's likely to need to have some internal representation of where it is connecting to.
//   It really needs to reveal the interface provided by mongo as a resource.

// Mongo server resource

// Maybe resource-generic-adapter?

//  I think this will need to have some boilerplate for wrapping a resource.
//  The resource will have an ip address and port.
//   It may have other identifying information too, such as database name.

// So there could be a mongo server resource that provides mongo database resources.
//  Then these database resources will provide various particular functions reflecting the Mongo API

// It may be worth doing more work on the resource sharing and resource pool first?

// Definitely want other things to connect to the mongo db resource.
//  Some things will provide application function from it directly
//  Some things will provide a further layer of abstraction
//   Then application functionality will use these abstracted parts that are not particularly reflective of a mongo database.


// Another important resource is an amazon cloud, or maybe a more general cloud.
//  I think there will be some code for specifically interacting with the Amazon EC2 service as an API.
//  There may be different resource objects for different cloud services
//  There may be something that wraps Amazon EC2 and other cloud providers in a more general API for cloud computing.

// This will help an application be assembled as logical units, while assisting with the interchangability of such units.

// With the mongo resource wrapper... need to having it do the things it should as a resource.
//  The admin interface will be published somehow.
//  Resources in general may all require an authentication (and authorization?) provider for access to their admin interface.
//   I think that makes sense, but it means some work will have to be done getting these resources to work before their admin interfaces are available.

// Resources need to be started etc.
//  This means starting the availability of that resource within the process, generally.
//  It may mean checking that a service is running and staring it, but that will be some extra code put in if desired.
//   Local_External_Systems_Controller
//    This seems like a possible resource that could help get various things to start?
//     Or the 'start' of the resource does not reveal something inside about if the service it referrs to is really running.
//     Maybe there could be start_external_service
//      external_service status
//     Resource could use an external_service api perhaps.

// Will be nice to use an authentication provider based on MongoDB, and then using that authentication (and auth?) provider to control access to the resources' admin
//  interfaces.

// Resource administration...
//  There should probably be the publishing system abstraction.
//  This may wind up being done through the resources' admin publishing system. The publishing abstraction and resource abstraction will be used to publish the
//   resource's admin interfaces in a GUI.

// I think the resource admin GUI will be the good thing to start working on.
//  There could be quite a few different files and objects there, and it's a good basis for making an IDE and various other 
//  administration, data-oriented and task-oriented systems.

// The mongo resource and the resource API.
//  It's not an exact fit with the 'stop' and 'start'
//   Perhaps the resources will have information about the level of control they have over the service.
//    Starting a resource really is done so that they have access to the right things in sequence.

// Lots of things will be published through a general admin interface.
//  One important thing that will be published is a website. There will be other publishing systems that turn something more abstract in its description of a system or service
//   into something with the interface using HTML and HTTP.
//  It would be possible in theory to have different publishers that would take the same (fairly abstract) website and publish it using Flash, in a native app wrapper, or as a native app even.

// In memory service providers will be a useful thing to have at some stage.
//  Could use various standardised memory interfaces, but provide a service such as authentication or document storage, or document authorization details storage.
//   Things that may need to get checked rapidly to allow or deny access may be better stored in memory. Memory on a graphics card will be an interesting thing to try too.

// Computation resources.
//  Nice if resources were able to / useful for performing functions, like rendering a page.
//  This may be a good way to break down the app logic too, could have app logic working over a distributed system.
//  Having rendering done on a machine with a graphics card storing things that have been cached could be very useful.
//   The most frequently accessed pieces of content could be stored in the graphics card, and pieced together very rapidly.
//  Could do quite a lot of things in parallel using a GPU. Could possibly be rendering quite a few pages / objects for pages at once.
//  Could possibly use the graphics card resource to create other resources on, with a simpler API.

// Maybe worth starting with a really simple data store working.
//  Also, get on with making things that obtain metadata about data stored on other websites.
//  Would be very nice to have metadata about UN population figures.
///  This metadata would be very useful for using the data itself. The data itself could be stored too.
//   Metadata may be indexed in some ways, so it may be possible to search for a column name across quite a lot of sources of data at once.
//   Likely to have a system that deals with views of collections of data.
//    It could require higher permissions (maybe paid for) to download large chunks of data at once.

// May be nice to have & give access to a few sources of economic data etc.
//  I think getting a more powerful server online before all that long would help a lot with doing this...
//   but then also queries could be directed to my home setup. I think having the system maintain some data, using various abstractions and systems makes sense.
//  The interchangeability and modularity of the whole system is very important. Some components will take a generally used standard such as mongo and adapt
//   it for a more limited purpose. Other systems will be adapted for the same more limited purpose.
//  Then more complicated components (resources), either for the application, like an authentication provider, or for another data structure.
//   It will be possible to build implementations of some more complicated data structures while not paying attention to the underlying storage mechanism.
//    Then that storage engine can get changed / optimized separately. Could be changed from 1 mysql server to a redis cluster.
//  The data abstractions will help for moving data from one place to another. This could be moving/copying data from the public internet to an indexed data structure within the
//   application. The data will then be presented to the user of the application.

// These various abstractions could work together to effectively form the MetaBench application.
//  When the things work so that data sources from other online sources works, and is put into its own indexing system to increase its availability,
//   the system will kind of be working.

// Will have the usage constraints built into it so that normal users can't download a huge amount of data.
//  It may be that basic registered users are able to publish a view of the data.
//  It may cost some users to have lots of data for visualization hosted.
//   Perhaps start charging when service level agreements become important.
//    This will be easily scalable, will start charging and scaling the service and making a margin.
// I think it will be possible to set up 'services' so that they are an abstraction in themselves.
//  Could charge for access to a storage resource or connectivity, could charge a small amount to remove some limitations or adverts.

// Could quite simply charge for a few things... they would already be confident the platform works.
//  A few digital items for sale, could get some nice revenue coming in.
// I think the configurable toolkit will help with making some tools which have a retail value.

// It's likely to get told what ports to look for things on the local machine on.
//  It could retrieve this from a text config file or the local sqlite db in the node path.

// Also, for many development tasks, the mongo database will be on the same server.

// To start with, would like an authentication system using Mongo.

// Mongo resource
//  Data structure wrapper
//   Authentication provider using data provider.

// Not so sure about making a mongo-auth object. It seems better to go through some middleware so that Mongo functionality is available, authorization functionality is available,
//  and the two work together through components interacting using the right API rather than because a component has been specifically made to provide authentication through a mongo
//  database.

// There may be some more specific resources and providers that are more tightly coupled, but the middleware way of doing things has the advantage of improved flexibility.
//  It's also in keeping with the nature of the library in general.

// The server as being a resource
// It contains resources too (the databases)

// I think there will be quite a lot of library code used to get access to these, but won't be much boilerplate code that is needed to do things.

// The mongo server resource as a provider of the mongo database resource.

// Could have a mongo database resource as something that requires a specific mongo server resource in order to work.
//  I think the resources will handle the multiple levels of existing objects and APIs.

// Looking forward to getting some of the more abstracted application service providers working, with the interchangable storage components.
// Will get a fairly simple object storage / indexing system working on Mongo.

// Will be doing a bit of work on top of the mongo api.
// Want to easily wrap the mongo api as a resource, without the need for what would be repertitive plumbing code with multiple resources.

// The resource pool may have its authentication and authorization providers set up right at the beginning.
//  This will be using the common means of doing those things.

// Quite a few things will need to be put in place for them to work.
//  I think having the mongo server resource and the mongo database resources working together is an important step.
//  Then collections within the mongo database
//   These are where the indexing takes place, may have some similarities to the collections that are part of my application.
//   When collections are resources, they will be called through the asyncronous system so that they could be storing their data non-locally.

// Collections in a Mongo DB will also be expressed as resources.

// Mongo as a resource abstraction... different parts to it
//  A resource abstraction creating inner resource abstractions...




// Connecting to a server and getting the list of databases.
//  That will be done when the resource starts.

// Then within the resource, there will be the resource.use function.
//  This will do the calling of the mongo functions.
//  Will possibly need to call some blocking functions as async, and have them return their result with a callback.

// 'Use' sounds like it is a flat API with methods being called.
//   Need to expose the various objects involved as resources so that they can be called.
//   Setting options on the resources.
//    Could be done in the spec to start with, could be done through the set statement.
//     These gets and sets would then need to be connected to the actual properies.

// set up a local mongo resource, it will start...
// set up a local mongo server resource and a local mongo database resource, get them to start.
//  The database resource would require the server resource, and the server resource could also make available database resources when it is queried for them.

// This framework here will help to avoid the code being too callback-heavy, because the callbacks will be managed by the framework in some cases.
// Things could be specified in a sequence, but operate in a non-blocking manner.

// When starting a database resource, it needs to connect to the mongo server resource - it needs to make sure that resource is specified, and has started too.
//  The database resource would take the server resource and a name as its location.
//   server/db
//   That may be used for a restful interface, not sure.

// The Mongo server and database resource components should be relatively simple.
// They are the bridge between the resources API in the application and the Mongo system.

// Starting the mongo server resource
//  It needs to be aware of the server's location - will not always be the local machine.

// This whole system would make a whole host of things available over a web interface. That could be very useful.
//  Quite a lot of business tasks will be possible when it is connected to business objects.

// Could have a personal workflow assistant, for example. This will deal with business logic and need to be connected to a business database.
//  I think something like 'biz' or 'office' may work OK. MetaBench Office Suite? (maybe implies it has got more email and word processing tools)
//  MetaBench Workflow Suite? That could be a good package for business. Workflows get developed in there. Workflow objects and information can be shared.
//   Sharing business logic, getting businesses themselves to share various procedures for doing things. Eg logic may be shared with franchises.
//    Could have franchises make improvements to the business logic, with the business logic being built using tools within the system.
//     Does not have to be JavaScript code. Could be some simple JSON that gets interpreted, like my system that does callbacks in sequence, or like jQuery.
//     Could maybe have branching?
//  Would be incorporated within the document sharing system.

// User credentials in other systems.
//  The MetaBench system, where it stores users, may also store user login information and credentials for other resources.
//   System, Username, Password. May have login information for the local postgres server.
//    It may be worth having this information encrypted using the user's password, so the password has to be provided to have access to it?
//     Or another hash of the user's password? Slightly safer. Will still require the password to get access to this protected data.

// Protected data stored for the user 
//  I think that would work well over a normal document interface, where it encrypts the contents.
//  Could send encrypted messages too.

// Resources will work outside of the resource pool as well.
//  Resource pool is a sensible mechanism for co-ordinating them within a process.

// This will probably wind up being fairly big pieces of code, as will other resources that connect to databases.
//  Need to present a simple (where possible) and consistant API, and also connect to a variety of different databases with the
//  different database resources.

// Basically, want other resources, particularly the Info resource, to connect to a database.

var Mongo = require('mongodb'), MongoClient = Mongo.MongoClient;

//var Mongo_Server  

define(["../../../core/jsgui-lang-util", '../../../web/resource', "./database"], function(jsgui, Resource, Database) {
	
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Collection = jsgui.Collection;
	var is_defined = jsgui.is_defined, tof = jsgui.tof, stringify = jsgui.stringify, each = jsgui.each;
	var fp = jsgui.fp;
	// The basic resource connector... not quite sure what it needs to do 27/02/2012.
	//  Fills in the gap conceptually.
	
	var Rsce = Resource;

	// With these resources, need to expose them in a standard way.
	
	
	// So both extend Resource.
	//  They may contain resources and / or data.


	// For the moment may not be able to read the databases from a Mongo server.
	//  May need a way to log into the server itself to access it .
	//   There will be ways to do this, but maybe it's not worth doing just yet.

	// May need to define a server as containing a database, then connect to that database.
	//  That seems to be the logical order because we need to reference both the server and the db
	//   Knowing the server address does not mean we can list the DBs

	// So the DB would have a 'server' property?
	//  Maybe it would also be the parent?
	//   Or the collection of dbs on the server would be the parent?

	// A server property on the DB would make sense here.

	// When adding a resource to another, may need to be careful that it has started.






	// Perhaps further testing of fields will help, fields that are declares like below?

	
	var Mongo_Server = Rsce.extend({
		//'fields': {
		//	'databases': Collection(Mongo_Database),
		//	//'host': String,
		//	//'port': Number
		//	'host': 'string',
		//	'port': 'number'
		//},

		// a collection of databases
		//  but those databases will be resources.



		'init': function(spec) {
			this._super(spec);
			
			/*
			if (is_defined(spec.host)) {
				// the server is the 'location' too, if that matters.
				this.set('host', spec.host);
			}
			if (is_defined(spec.port)) {
				// the server is the 'location' too, if that matters.
				this.set('port', spec.port);
				// Maybe set with Data_Object being given a Number field needs to work differently.

			}
			*/
			//var host = this.get('host');
			//var port = this.get('port');

			//console.log('tof port ' + tof(port));
			//console.log('host ' + stringify(host));
			//console.log('host ' + (host));
			//console.log('port ' + stringify(port));
			//throw '1) stop';
			var meta = this.meta;
			meta.set('status', 'off');

			if (spec.host) {
				meta.set('host', spec.host);
			}
			if (spec.port) {
				meta.set('port', spec.port);
			}


			// mongoserver = new mongodb.Server(host, port, server_options),
			
			// addess or location is an IP address
			//  Addressable through its IP address
		},
		'start': function(callback) {
			console.log('starting mongo server resource');

			var flds = this.fields();
			console.log('flds ' + stringify(flds));

			//throw '2) stop';
			var host = this.meta.get('host');
			var port = this.meta.get('port');

			console.log('this._ ' + stringify(this._));

			console.log('tof port ' + tof(port));
			console.log('host ' + stringify(host));
			console.log('host ' + (host));
			console.log('port ' + stringify(port));

			//console.log('tof host ' + tof(host));
			//var mongoserver = new Mongo.Server(host, port, server_options),
			var mongoserver = new Mongo.Server(host.toString(), port.toString());

			// and there will be internal implementation objects.
			//  the resource will present a facade to a variety of programmatic objects.
			//   however, we may still want access to them.
			//  there could be a layer over some existing, well understood APIs and it would be best not to 
			//   hide those APIs - though in order to really use the resource we need to use the resource's exposed APIs.
			//    but won't want to see the implementation details like the programmatic mongodb object.
			this._server = mongoserver;
			/*

			this._server = mongoserver;
			this._server.start(function(err, res_start) {
				if (err) {
					throw err;
				} else {
					console.log('pre mongo server start cb');
					callback(null, res_start);
				}
			})
			*/


			console.log('pre mongo server start cb');
			callback(null, true);




			/*
			var mongodb = require("mongodb"),
				mongoserver = new mongodb.Server(host, port, server_options),
			    db_connector = new mongodb.Db(name, mongoserver, db_options);

			db_connector.open(callback);
			*/

			//MongoClient.

		}
		
		// Requirements - 
		//  Requirements could be made to be things other than resources. Could be made to be things such as the location of the resource.
		//   Location of the resource needs to be specified before it can start. This applies to things I had called resource-connectors.
		//    May have resource-localizer form making a resource available on another machine available locally.
		
	
		// I think requirements before starting makes sense
		//  They won't only be other resources, but they could be in some cases
		//  The other resources will be set much like property names, given in the spec.
	
		// 
	
	
		// starting it - connects to the server.
		//  getting more information, like the databases inside it will take another step.
		//   this is an extension to the Mongo API.
	
		
	
	});
	

	// Maybe the database could be seen in terms of resource requirements?
	//  And have the ability to define a DB without a server?
	//  Could connect it to multiple servers?

	// Can't use get and set normally for the fields...
	//  maybe we need meta fields.

	// We maybe need a kind of 'set' which is specifically for the resource actions.
	//  I think .meta may be best for the resource, where there is a .meta Data_Object, 
	//  and this is for properties such as the server and its name.

	// The fields would be the fields in the DB itself.???


	// Maybe define the fields of the meta object though.

	// Need to be able to make sure a field is unique.


	// This should expose a Mongo DB and Mongo server in the Resourceful way.
	//  Not entirely sure what that means, but it's definitely asyncronous.
	//  Should probably follow the REST verbs closely if possible. May need to change some things to do that.
	//  Maybe allow access through REST verbs as well as having some more flexibility to interpret 'set'.
	//  Maybe accept push and add as post.


	// Also, may need to set the schema for DBs.
	//  Maybe not with Mongo, but perhaps indexes will be in there.






	// We may want to get Collections and Data_Objects from the resource.


	// We could also have a Mongo_Collection resource. They may follow a similar interface to tables in other DBs.
	//  They would be creatable from a Database resource.
	//  The Info resource would interact with one of these


	
	return Mongo_Server;
	
});




/*

var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db,
Grid = mongo.Grid;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('exampleDb', server);

db.open(function(err, db) {
  if(!err) {
    var grid = new Grid(db, 'fs');
    var buffer = new Buffer("Hello world");
    grid.put(buffer, {metadata:{category:'text'}, content_type: 'text'}, function(err, fileInfo) {
      if(!err) {
        console.log("Finished writing file to Mongo");
      }
    });
  } else {
	  console.log(err);
  }
});
*/
