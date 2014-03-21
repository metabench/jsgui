define(["./jsgui-lang-essentials", './data_object', './collection', './database'], function(jsgui, Data_Object, Collection, Database) {
	
	// Quite possibly this will be better using the Resources system?
	
	// This does make sense as the definition of a web database that gets given to an ORM layer.
	//  However, some application resources, like an Authentication Provider, could have a description of the data model
	//   that they need, and this gets given to the ORM layer.
	
	// This will take a Database object - which will have various interactions with actual databases, and then provide it with parameters,
	//  such as its tables and functions (or the options to generate the functions).
	
	// It should not need to be that big. Much of the mechanics for how the DB gets implemented is elsewhere.
	
	// Setting up the tables, will use some of the ways to specify what the tables are.
	//  May have something to do with fields in object extension.
	
	// For the moment, this Web_Database will generate all of the database? Or wrap it?
	
	// What about just a function to generate a web database? That could work quite well without increasing object orientation.
	
	var stringify = jsgui.stringify;
	
	var Table = Database.Table;
	
	// Say these are tables...?
	//  That means they are a collection?
	
	// But these are just the data types.
	
	
	var Role = Data_Object.extend({
		'init': function(spec) {
			this._super(spec);
		},
		'fields': {
			'name': 'unique text(32)'
		}
	});
	
	// user_roles is a one-to-many association relationship.
	var User = Data_Object.extend({
		'init': function(spec) {
			this._super(spec);
		},
		'fields': {
			'username': 'unique text(32)',
			'password_hash': 'text(128)',
			'roles': [Role] // [...] indicates plurality
		}
	});
	
	var Web_Database = Database.extend({
		'init': function(spec) {
			
			this._super(spec);
			
			//var fields = this.fields();
			//console.log('fields ' + stringify(fields));
			
			// OK, so it does have the old fields in the prototype.
			//  Need to make sure that setting field values works right...
			
			
			var roles = new Table(['Roles', Role]);
			
			//var roles_name = roles.get('name');
			//console.log('roles_name ' + roles_name);
			
			// ignoring ID in the most abstract implementation
			var users = new Table(['Users', User]);
			
			var tables = this.get('tables');
			// and is that array part of the prototype?
			
			// don't want to push them into a prototype.
			
			//console.log('tables ' + stringify(tables));
			
			//console.log('tables.__type ' + tables.__type);
			
			// OK, seems to be working.
			
			tables.push(roles);
			tables.push(users);
			
			//console.log('tables ' + stringify(tables));
			//throw('16) stop');
			
		}
	});

	return Web_Database;
	
	
	// Then we need something to persist this database.
	//  Want to be able to interact with Mongo DB.
	//   First of all, not using mongoose, but mongoose itself could be a connection point (later).
	
	
	
	
	
	// Documents as well will not take up much to define.
	//  It will just have to go through a few stages.
	// This is a good start... quite a lot can be generated from this with few options.
	//  Once the structure has been generated, will want to query the mongo db qith Data_Object and Collection.
	//  May have mongo, mongo-query?
	//   abstract-mongo being just the description of the database that's getting persisted... but perhaps this structure would be useful for access function too.
	//   I do like the idea of the abstract structures though, without database access code in that level.
	
	// Could extend abstract-mongo with active-mongo? That way the queries can be done, methods that could extend a Data_Object to get and set its data from the DB resource.
	//  This would still be for on the server. When saving a Data_Object, we can call an added .save() function? Or maybe better to have a data access connector.
	//   Will provide some functions doing save...
	//   Will provide functions that make JavaScript data access functions.
	// Then when I have roles, users and documents, I'll be good to go with actually having it do something on the front-end.
	//  Documents can contain JSUI and HTML.
	
	// I think the folder structure within the user space would be pretty important though.
	//  Being able to store a whole website within the user space would help a lot.
	// Multiple websites even, could have different publishing options (metadata on folders, also changes to the publishing options would notify the publisher / or the 
	//  publisher would then successfully process the requests asking for that published information.
	
	// I am now quite certain that the directory structure within the user's space, with a very simple document system, will be a powerful platform to go forward on.
	//  That part really does not need to be that complicated. Once I have it, it should make for quite a robust system.
	
	// I think that is what is needed in order to host my site. Having things published (files with paths, and other files available) makes sense as a starting point, but there
	//  will also be components (je suis xml system) that run from files like ASP.NET and will then have the application draw data in programmatically.
	
	// Controls that get loaded could look into documents or other tables in the database relatively easily.
	//  There may be some particular tables for particular websites, but I want to be careful about that on the reference implementation.
	
	// When defining news_items etc, they could be under the 'james' or 'admin' user, and published accordingly.
	//  Publishing them will probably alert a publishing system, or update some routing.
	//  Could have them published to /... rather than /[username]/... or /users/[username]/...
	//   Being able to set the path to somewhere in the site.
	
	// Quite a simple database, plus a bit of caching of data that's used in the site, then caching of rendered components, will lead to very high performance.
	//  With some basic editing properties built in, this will constitute a 'stack'.
	// I'll have my website running and be able to edit content on the fly - nice.
	
	// I'll then likely make some front-end components (demonstrations) and a portfolio component. The whole thing will work very will - all sorts of things / design elements
	//  making it look nice. Maybe 12 items in a grid... and links to other places / going into the next level.
	
	// Work for clients, can show small screenshots
	// JSGUI demos
	//  Could bring up a modal window showing that particular demo.
	//   Something like 'file system', or 'virtual desktop' would be nice as a demo provided it works well.
	
	// Once the back-end system is done, that data can be presented in a very flexible way on the front-end.
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// Could automatically create a normalized database from this.
	//  would put the IDs in, could be sequential or GUID
	//  would create the extra tables for associations - what appears as a field may get implemented as its own table.
	
	// This would still be the same format of Database in the abstract???
	//  Not so sure about it still functioning as a Data_Object though
	//   It would be further towards it, I think the new classes could be made?
	//    New extensions...? It would declaratively make the fields.
	
	// After that, another transformation would turn it into a more specific / lower level abstract database format.
	
	
	
	
	
	
	
	// Just setting this up should get everything needed for the web database
	
	// Users, roles, authentication, data resources, storing documents / data within the user file system.
	//  Storing a directory structure here. Did some previous work with this in specific DBs, but here I will apply it to an ORM system. Will be testing this
	//  and getting it to work in Postgres to start with.
	
	// will set up the tables
	
	//  or objects? This is not an RDB.
	//  The database can contain object classes.
	//   Or object categories. Idea is to store and retrieve objects in that category.
	
	// Will want access to objects within the database using a fairly simple interface with callback.
	
	// Database has 'classes'. Not sure that is a convenitent word here.
	//  Obj type...
	
	//  Maybe don't use tables right now, have Data_Objects
	// Object classes... User, Role
	//  Then the relationships between them.
	// These relationships will get mapped to an RDB structure.
	
	// There is quite a lot still to do on the code path.
	//  When this is finished it will be part of the system that makes it really easy to administer data.
	
	// Having a consitant and relatively powerful backend API will help a lot.
	//  Really needs to manage users and documents for them, quite a lot can be built on top of that.
	// The back-end server system is going to make things very flexible.
	
	// Not sure about using Resources for the moment.
	//  Things could be fitted into a Resource.
	
	// Want to make it so that the users get set up, and users can carry things out using an API.
	
	// Will be able to do things like get, set (maybe publish and share) documents within a file structure.
	//  Will also be able to edit nested content documents?
	//   Possibly defining general objects for the system with ownership attributed to the user.
	//    These objects can be published using a publishing system.
	
	// I think there are various clear steps to take towards this.
	//  The first is to continue on the Web_Database and its interfaces with Mongo and Postgres.
	
	// Maybe 3000 to 4000 lines of code necessary for full system.
	//  Mongo system could be made (first) with a lot less code.
	
	// Interaction between users and roles in Mongo system... could have table of user roles like in other system.
	//  That could possibly work better with the whole index system that there already is.
	
	// Possibly could save objects to the database in a simpler JSON form...
	//  but would still need to be careful about providing only the right interfaces.
	
	// System would likely check whether or not someone has the 'admin' role before allowing them to save objects.
	//  Otherwise puts them through something that checks what permission they have.
	
	// A user would be a system object, but they could have files that are their own user object.
	// 'root' user, or 'system' user?
	
	// Definitely have got to get this doing more... really want to build the back-end to support the front.
	
	// Could have the DB interface, then other code that will provide an API that can be directly opened to the internet.
	//  Resources do make a lot of sense in terms of granting or denying access to them.
	
	// Should make it fairly easy to save an object to Mongo... it will know what type of object it is etc.
	//  For the join / association tables/values/collection, where a user can have roles, it would be good to get that implemented in either a relational
	//  way, or simply as a list.
	
	// Relational makes more sense in various ways... will be able to build and operate a relational database over Mongo, for example.
	//  May even be able to query it using SQL
	
	// Having everything work very fast and precisely (with normalization) in Mongo may require normalization.
	//  db.things.find( { colors : "red" } ); - mongo winds up searching through the array of colors, not consulting an indexed map/collection of colors so that
	//   it will be able to do the check without any slowdown from searching through n items.
	
	// There would be other ways of doing things, with tables dealing with the associations between the objects.
	//  For the moment, just storing some more basic info would be fine.
	
	// Storing user information... will make various functions to do the things in Mongo.
	//  But still want this mapping....
	
	// I think the full translation from jsgui Database to the ODB or RDB takes some work.
	//  Relational over Object layer?
	// Object database can't do join queries nearly as well - but I would be able to do this with the right indexes, maybe using a bit/binary map to do a join, like it is done within
	//  an SQL database.
	
	// I think making databases in parallel could work well.
	//  Operations may need to work very quickly, without having to load a whole record, modify it, then save it.
	//  As well as that, want the more complex indexing system to have its complexity encapsulated.
	
	// I think we do need somewhat complex mapping even for the simple database operations to do with running a simple website.
	
	// Need the authentication and authorization system.
	//  Users, roles, documents being assigned to users.
	//   That would be enough to start a website, and even allow some quite powerful services to operate.
	//    Objects like Folders could be made, and a user could be assigned a '~' or home / root folder.
	
	// Users, roles and documents should be one of the first things.
	//  Sessions too maybe... just remembering when a user has logged in, what session authenitcation token they have (could be stored in a cookie).
	
	// Starting with a domain model I think.
	//  User, Role, Document
	//   Not much extra about the implementation of it, with the actual document content not stored in the document record.
	
	// 
	
	// user fields... {'roles': [Role]}, then it gets translated so that it has the right join with the role object.
	
	// With each user having a collection of roles.
	
	//  I think this will take a while longer to do, and to get right.
	
	// Database has got tables... I think the relational model would work well over the document database,
	//  but with relational databases need to be more careful adding documents.
	
	// The two types of database may not be all that different after all.
	//  Expression of the database without all its tables... this is an abstract database.
	//  Relationships will be defined
	//  Database -> Abstract ODB | Abstract RDB
	//   May be too hard to classify what an abstract ODB can do really, they have less in common than SQL.
	//  Database -> Abstract Mongo Database | Abstract RDB
	//  Abstract RDB -> Abstract Postgres
	
	
	
	//  Database -> Abstract Mongo Database
	//   this would be a translation that gets done. it's not going to turn it into the only appropriate kind of Mongo database either.
	//   The abstract ODB level could be useful, not sure. Could then have more options about giving it more tables for linked / collection values,
	//    such as user_roles, keeping things normalized, or doing things differently.
	
	// What about normalizing a Database object? Creating more tables etc?
	//  I think do it as part of the transformation / translation
	// Database -> Abstract Normalized Mongo DB
	
	
	
	// Mongo is a queryable database though... has more than Tokyo Cabinet
	//  TC is more of a KVS.
	
	
	
	
	
	
	
	// User
	//  id
	//  username
	//  roles (could use defined relationship, not sure)
	
	// Role
	//  id
	//  name
	
	// It could be useful not having much in the document object.
	//  Just the length - minimal metadata as well maybe.
	//  Link to metadata - this can contain links to other information about the document, perhaps items that have been indexed.
	//  Link to content
	
	// Document
	//  id
	//  name
	//  (eventually path when it has got folders too)
	//  content_id
	//    OR
	//  content (just the document content here)
	//  (metadata_id)
	
	
	// Could possibly create the User and Role Data_Objects first.
	//  That way they could just be given to the tables.
	//  User Data_Object already knows it has a collection of roles.
	
	
	// Content
	//  id
	//  value
	
	
	// Table is really a collection.
	//  Initializing a collection with a type?
	
	
	
		// Collection taking a data type as its constructor.
		//  Maybe just a Data_Object class / constructor. Will need to look out for those.
	
		// fields:
		//  'tables': new Collection(Table)?
		//  'tables': [Table] // could be convenient shorthand
		//  'functions': [Function]
	
	
});