define(["./jsgui-lang-essentials", './data-object', './collection'], function(jsgui, Data_Object, Collection) {
	// This actually is a database
	

	 var j = jsgui;
	 var Class = j.Class;
	 var each = j.each;
	 var is_array = j.is_array;
	 var is_dom_node = j.is_dom_node;
	 var is_ctrl = j.is_ctrl;
	 var extend = j.extend;
	 var clone = j.clone;
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
	 
	 
	//var Sorted_KVS = Data_Structures.Sorted_KVS;
	var dobj = Data_Object.dobj;
	
	var input_processors = j.input_processors;
	
	//var constraint_from_obj = Constraint.from_obj;
	
	// Has a collection of tables.
	
	// May have an area of CRUD functions.
	//  These could be JavaScript functions that actually operate on it. Their main goal right now is to have functions defined so that they can be transformed into
	//   abstract-rdb CRUD functions, which will then get transformed into the CRUD functions of a specific database such as Postgres.
	
	// There could be a 'function bridge' or easy method for the Database object that has been defined to interact with the database on the server.
	//  Maybe 'remote operation mode'. Perhaps the functional bridging happens with resources.
	
	// Could extend Data_Object.
	//  The Data_Object stores collections.
	//   Maybe just a couple of collections to start with.
	
	// I think the main use will come from querying.
	//  Can have different levels of query API... programmatic, and something that parses data to that programmatic form.
	//  Querys are not all that important right now?
	//   But the query translation could be very cool.
	//   Enter the SQL in a particular dialect, then it can get run in a different database system.
	// This will be very flexible indeed, with support for a variety of database vendors.
	// Postgres, SQL Server, Oracle, MySQL... these 4 RDBs would be very nice to have support for.
	//  Would make an amazing application, having a nice UI on the client side, and having it produce high-performance DB code.
	
	
	
	
	
	// Include the fields in the definition?
	//  Kind of use these fields as the class?
	
	// Maybe like a model?
	//  But this is a general, abstract database in design, but in operation it will do things.
	//  A Database object here will have its structure separate from its data. It will be able to get copies of the structure relatively easily,
	//   then they will be transmittable and recreatable relatively easily.
	// This may serve as a useful tool for data migration. Could have a part on my website about data migration and integration.
	//  I think I'll be able to present a very good website to customers and everyone else who is interested.
	
	// Having some sort of change notifier or replicator would indeed be nice.
	//  The changes get made on abstract RDB, then get sent to the abstract Postgres or whatever database.
	
	// Data_Object with fields built into the class definition...
	//  Not so sure this will work directly using prototypal object inheritance, 
	//  but being able to give a Data_Object's fields as part of its definition makes a lot of sense.
	// Having it as part of the extend function, rather than in init?
	//  That would make more sense in terms of developing object heirachies.
	//   It is also more declarative.
	
	// ?Data_Object.extend(functions, fields)
	// Data_Object.extend(fields, functions)
	
	// may be nice giving all the fields at the top.
	//  That would definitely look good.
	//  It would be nice in the object definition side of things.
	//   Syntactic sugar? We want this to be really concise and easy for the developer to use.
	
	// The fields_spec sticking to the class object... then the fields actually being made as constraints on the individual DataObjects?
	
	// Defining a field as a collection.
	//  Or array?
	
	// Field as a collection would represent some relationships, like user_roles.
	//  That could then get translated to RDB, or quite easily put into an ODB, but there would be options about using keys or values.
	//  Will have code that can make some ODBs into RDBs even? Implementing relational features will be pretty good.
	
	// Do like making a Web-Database object not as a resource for the moment,
	//  I think that having the functionality available just with JavaScript functions makes a lot of sense.
	
	// Could get the database being generated within a few days, I think.
	//  Do want to make and test the API, also want to use it for my own website.
	
	// I think my site could get a lot of content quickly if I do things right.
	//  The web platform will take a fair bit of work, but need to get the background things working first.
	// The ORM layer seems like an important part of this. Am keen on having things working with a Postgres server soon.
	//  I think a Mongo layer as well is quite important
	// MySQL, SQL Server, Oracle.
	//  These all will be quite important to implement for the full system. It will be easier to make them once more abstract things have been made.
	
	// Next step - translation of abstract database (semi-abstract, using the Database and associated object) to abstract RDB.
	
	// User has Collection of Roles.
	//  Collection can have type of an exiting Data_Object.
	
	// This should produce some very good code... but perhaps need to do more work on Data_Object and Collection still.
	
	// Will be querying the database with SQL at some point... but programmatic objects I think are nicer.
	
	// Not sure this needs so much really.
	//  It may make use of some more customization of Data_Object and Field.
	
	// It could do type checking to see if the objects it is given is on the inheritance chain of Table or Database_Function (maybe just Function within the Database namespace).
	
	// May have to do with type checking of fields.
	//  That could be another field constraint.
	//   (Within) type (chain) - would not work inside a database (probably), without translation. However, would be a useful way of expressing fields.
	
	// Type constraint on a Data_Object field not being a type, but an object, or a bunch of objects.
	//  That would mean that only objects of the required type chain are allowed. We can't get the class names without them being added in in places, that will be done
	//  systematically. Perhaps type names will be part of the prototype. Should probably do some more work on the class and prototype system.
	// Want to get any object's class name.
	//  Want to get all the class names of the superclasses.
	// I think some info will be stored in the prototypes.
	
	// Perhaps the prototype / object inheritance / creation could be improved a bit later. For the moment, want the database system just to work really.
	//  There may not be much purpose in it to begin with, but it's a logical container and is useful for later transformations.
	
	// Defining fields in the class would be sensible.
	//  Would be fairly similar to Backbone's Model in that way... but it would not have this system of 'defaults', or would it?
	//  Perhaps 'defaults' would be a good keyword.
	//  Will need to adapt the Data_Object extend method.
	//  Will not just extend it with new functions... will extend it with other things too, they could be with keywords such as 'defaults' or 'fields'.
	// The 'fields' could be given as an object rather than a function. Data_Object extend would interpret objects in extend differently... that is how
	//  the 'fields' could be specified there.
	
	
	
	
	
	
	// Nothing very special about the table here.
	//  It is a collection, but it should maybe have some more API to do with the table's fields / columns.
	
	//  This is an abstract definition of a table really.
	//   I'm not so sure about it actually acting as a table.
	
	
	
	// Some type of system for easily connecting to particular databases.
	//  So we can define a table, then get it to persist that table in any DBMS.

	// When defining a database for a website - perhaps we can define the database(s) in the abstract, then tell the
	//  database.js to connect to a particular type.
	// Or we use a Database_Multi_Connector - connects the Database type (Resource?) to a database on a server.
	//  Having adapters bridge the gap between a general database system and particular database implementations.

	// This may be better as a resource?

	//  Want a database resource

	// And a database multi adapter
	//  So when we set up the database resource, we can connect it to a db multi adapter
	//   tell that multi adapter what type of db we want
	//   the multi adapter calls on the specific database resource.

	// resource-database
	// resource-adaptor-multi-database
	// 

	// Can re resourcify something?
	//  That may be an interesting change to make, ensuring something is always accessed with an asyncronous interface.

	// So we could resourcify a local database that is programmed more simply.
	//  Would resourcify a Data_Object.

	// To begin with, will make a new resource-database
	//  This can notify a connector / adapter when a change gets made to it.
	//   Changing its structure
	//  Does / does not keep its data within itself.
	// The Resource-Database could be a node.js database system, perhaps distributed.
	//  It should also be able to connect to other databases and use them.
	// The multi-adapter system should be useful in connecting to a variety of different databases quickly and
	//  easily. Just give it a few parameters to make the connection. Then we can use at least the basic level database
	//  operations. Get and set objects. Create and remove indexes.

	// So the resource database could be given a multi-adapter.
	//  Possibly the resource-database will connect to more than one DBMS.

	// Having a resource-database so that it understands its own structure.
	//  Provides an asyncronous interface to the data itself.
	//   Storing data itself? Maybe not, but resource-database could be a good place for it?

	// So it will have a Collection of Collections?
	//  Could make some kind of Resource-Collecton too?
	//   So we can refer to a table as a resource relatively easily?
	//   Resource-Data-Object?

	// resource-database-multi-connector?
	//  Just use that generally for the moment?
	// resource-database-multi?
	//  so it's not going to be the general resource-database.

	// Having a database running in node seems like it could be useful (especially distributed), but for the moment
	//  we really want to connect with other database systems.

	// resource-database-inprocess ???
	//  that may be a good way of naming the DB that's actually within the process.

	// However, it could serve as a relatively simple asyncronous adapter to database.

	//  resource-database serving as a resource adapter simply to database?
	//   would be quite simple naming.

	//  Then having it interact with a multi connector / adapter?
	//  resource-database-multi-connector
	//   connector may be the better term than adapter.

	












	
	
	var Table = Collection.extend({
		'init': function(spec) {
			// it requires a name...
			//  getting collection to have properties as well as items...
			
			// collection.set('name', name);
			// collecion.get('name')
			
			// Read-only properties for both Data_Object and Collection.
			
			// modify the spec if needed, call _super
			
			var spec_sig = get_item_sig(spec);
			//console.log('spec_sig ' + spec_sig);
			if (spec_sig == '[s,f]') {
				spec = {
					'name': spec[0],
					'constraint': spec[1]
				}
			}
			
			this._super(spec);
			
			
			
		}
	})
	
	
	
	
	
	var Database = Data_Object.extend({
		'init': function(spec) {
			this._super(spec);
			// tables, collection
			//  indexed by name
			//  collection as field in Data_Object... that would help express things.
			//  should not be too hard to do.
			
			// functions
			//  these should probably be AbstractFunctions to start with.
			//   they could run in JavaScript, maybe have a code writer to write them in JavaScript.
			//   Abstract_Function - a function that is fully described. Like pseudocode in code.
			//    This abstract function will then be able to have versions of it written in other languages.
			//   It could be more of a specification of what the function does.
			//    In generator, user may be able to switch these on and off, with different end results getting generated.
			
			// Having events such as add and remove field could be very useful so that the different models could be processed too.
			//  Replicating these changes - we would not want to completely recreate the resultant database when we could modify it.
			// Not so important to begin with... but will be nice to have it doing these things efficiently.
			//  Once abstract postgres database has been generated, will have a system where changes can be represented to it.
			//  Abstract DB will be able to generate abstract changes. These changes will be translated into postgres specific ones.
			//   May be similar in terms of removing an index, adding a column, adding a table, whatever.
			//  Changes to an abstract database may then have their way of being made to an actual database.
			
			// It will be possible to be very methodical with this system.
			//  I think it will take some time to develop, but could perhaps be made quite quickly.
			// Could require a lot of code to be written before it makes any database, but I think that may be worth the cost.
			
			// It is a very round-about route compared to object databases, but connecting to and using these relational databases
			//  will be very useful for the software. Should help a lot in importing data, maybe continuing to use and update these older databases,
			//  while having tools provided through this system.
			
			
			// functions
			// views?
			// triggers?
			
			// Just having the tables will be good enough really.
			//  I'm not expecting this Database object to do that much in JavaScript really, but it could potentially.
			//   It could accept queries, for example. 
			
			// Could have other code that listens to a Database, sees when it changes, and will change other objects that are based on it, using the equivalent changes.
			
			// The database could have access to actual database systems.
			//  Maybe using a wrapper of some kind.
			
			// Could maintain this database interface, while using it to interact with a connected database.
			
			//  This needs to be general purpose and configurable.
			// Web-Database
			//  Think that will extend Database. It will create various things inside it, some based on the spec.
			//   Various features could be on or off in the web database. Authentication could be part of this.
			//    Features could rely on each other.
			// Perhaps the resources system would be better?
			//  I think they will handle asyncronous things better, they will be designed with that access pattern in mind.
			
			// I think the abstract changes will be useful when the changes too get represented in particular systems.
			//  It should not be too hard to have the changes cascaded.
			
			// An abstract normalized DB could make sense too. That is because the normalization stage would be the same / similar for use in Mongo, SQL, or another database
			//  that has the required indexing capabilities.
			
			
			
			
			
			
			
			
			
			
			
		},
		'fields': {
			
			// Meaning that 'tables' is a collection of the Table object.
			
			'tables': [Table],
			'name': 'text(32)'
		},
		'connect': true
	})
	
	Database.Table = Table;
	return Database;
	
});
