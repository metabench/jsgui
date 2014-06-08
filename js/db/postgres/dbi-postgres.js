

// The HTML module needs to use the lang module. It will extend the jsgui object and return it.

// Perhaps it is best to split this one up.
//   Maybe if its clearer where to draw the line

// There is the 'ctrl'
//  Descriptions of ctrl data and html / css
// Extensions from core to handle more HTML (textNode), and other controls that have been made.

// Keeping this in one file for the moment would help keep track of the size of html-specific code.
//  It is nice to see that there is not so much right now. The extensive language section will keep this simple.

// This has become much more concise. Need it to do event handling.
//  Perhaps could use jQuery to do so. However want this to be swappable.
//  Different builds - when using jQuery could hold wrapped elements in the controls.
//  Won't make so much difference using the $ function again if they are not wrapped though.

// PageContext may specify which way of doing things.
//  Likely to load in separate code when using older browsers.

// It's mainly for handling events though... perhaps this could be in the library itself.

// This is no longer just for the mobile browser - need this to be in general (assume good HTML), but can load in other toolkits if needed
//  like for IE or different event models.

// Was using 'this.$.bind'.
//  Could even get the bind function out of jQuery - it works nicely, maybe put that into the library.
//  Could have mobile-client (modern)
//  jsgui-browser-support-ie
//   a few modules.
//   maybe other browser support modules like jsgui-vector-vml
//   they could get built together and sent to the client as a smaller file.

// Making it so it does not assume there is jQuery
//  But assumes that there are some jsgui functions, like _dom_bind that work with the w3c API, could use jQuery.
// These functions would be really simple in the standard W3C html version but would use jQuery or some specific / extracted bind code from jQuery.

// Also makes changes to the DataObject.

// The various tools in here will enable much to be done without directly referencing a postgres database.
//  May make the same interface for MS SQL Server.
//  Could license that.

// GET THIS TO MAKE AND ALLOW CHANGES TO THE DB STRUCTURE AND THE CRUD.

// This will be a fairly advanced database tool, here focused on postgres.

// Will set up web application using the features.
//  Building a data model from a domain model
//  Outputting the data model as code that sets it up in postgres.
//  Both postgres db admin, as well as a more general data tool.

// Currently has a decent amount more functionality
//  Ability to call stored procedure.
//  Using a query that contains both the query text and the parameterised values.

// Some fairly general code to do, more control over some aspects, such as foreign keys, other restraints.
//  Relationships between tables expressed not just as foreign keys.

// May be able to express 'is_a' type relationships.
//  Want easy syntax when setting up a users and roles table with the correct relationship between them.

// Security... there will be security built on top of a general system.
//  Users, roles, permissions.
//  Files (resources) assigned to users / roles / groups, can have ownership.
//  Various things could be backed up, stored in archives etc.

// 'Archivist' role? Can access archives?
//  Want quite a general and flexible permission system.
// Be able to issue authentication tokens from the DB.
//  Maybe Postgres DB will store all data, but with the most current and frequently accessed data being hosted elsewhere.

// Quite a lot in here... will be expanded further to better administer and connect to postgres databases.

// Will do further work on CRUD functions.
//  Will also introduce foreign keys.

// one-to-many relationships
//  user-roles
// linking tables

// May define jsgui resources, so on a page there are particular jsgui resources / controls.
//  Will have HTML processing at some levels.

// May take a while to process complex pages... but may have some caching mechanisms too.
//  May not want to make too many DB calls. Tokyo Cabinet may be better.

// Fully modelling a site or sites could work very well though.
//  Will be able to identify which elements of pages are repeated / structural.
//  And identify content.

// Query deeper within a page.
//  Not sure about making more postgres procedures for this...
//  Could be a fair bit faster.
//  Could possibly make the postgres procedures in Python.

// Could possibly have the unoptimized version that makes more db calls
//  and another version that does processing inside the database.

// This would work for experimental purposes - but may make a Tokyo Cabinet object database.
//  Howver, this Postgres system could in fact work well.
//  Probably with doing more programming inside Postgres, and could have reasonable efficiency.
//   Could have a system of cached text values. They may need to be deleated when an object inside it changes.

// For the MetaBench site to begin with, postgres performance should be fine.
//  Will use some caching.


// This will be streamlined now. This is for handling interaction with the postgres database.
//  Is not the abstraction, that is another component that can be used separately.

// Does not rely on the postgres generator either.
//  This will be a fairly streamlined module to do with interfacing with the database.
//  It will, for the moment, be dealing with Abstract postgres data, but other modules will specialise in the creation of such data.
//  Abstract postgres data will be used here to represent structures that are generally persisted to/from the actual db server.

// This will still be a fairly comprehensive module.

// This may be better when turned into a Resource.
//  Or be clearer about DBI
//   However, I think that it can be put in the resource, and put within the general framework of it, as it will be asyncronous generally



if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


define(["../../core/jsgui-lang-enh", 'pg', './abstract/parser'], function(jsgui, pg, Abstract) {
    
	// will likely use Postgres-Resource-Connector
	//  That will handle functions like execute_query.
	// Then dbi-postgres will inherit from Postgres-Resource-Connector, and do more things too.
	
	var Class = jsgui.Class, arrayify = jsgui.arrayify, fp = jsgui.fp;
	var tof = jsgui.tof, is_defined = jsgui.is_defined, each = jsgui.each, stringify = jsgui.stringify, arrayify = jsgui.arrayify, mapify = jsgui.mapify;
	var get_item_sig = jsgui.get_item_sig, trim_sig_brackets = jsgui.trim_sig_brackets;
	var Collection = jsgui.Collection;
	
	// The interface between abstract postgres and the actual database
	//  Make sure that abstract things are represented in a real DB.
	
	// Maybe a DataObject rather than class...
	
	// And if it's a data object it has the event handling mechanism built in... could be very useful here.
	//  Should re-implement this and other classes as DataObjects
	
	// OK, this needs database modelling.
	//  Abstract definitions of things, like a table existing outside of a DB, but able to use code here to interact with a postgres db,
	//  perhaps creating that table or checking if it exists / ensuring it exists / adding columns to an existing table there.
	
	// Could inherit from AbstractSQL classes.
	//  Not sure of the point of that right now.
	
	// (Postgres)
	
	// Does not need to be that big to follow the postgres definition.
	
	// could have a whole abstract database.
	
	// Maybe we want these less abstract - or with less abstract methods where they can connect to the database and ensure they are there.
	
	// Check if a column exists within a table for example.
	
	// Or could have other methods that do these checks, but it seems good having it within these ones.
	
	// Maybe call 'disconnected'.
	
	// Not sure if these should have INFORMATION_SCHEMA data bolted on.
	
	// Should make table constraints (and column constraints)
	
	// Maybe call this data_model?
	//  Or db_model?
	//  It assumes it is generally abstract / disconnected yet parts can be syncronized with or syncronized from the database.
	
	
	// Will have functions to ensure these abstract structures are in the DB.
	
	// Want to be able to create the CRUD functions.
	//  Could use a CRUD_Factory.
	
	// Will create the functions that get put into the database.
	//  This is a part of ORM. Will be able to define some objects without too much difficulty and they will get created in the database.
	//  Could have a nice web interface for this.
	
	
	
	
	
	// 2 way string map (Single_And_Plural).
	//  could make this a data structure.
	//  don't want this in the code that represents the external postgres connection
	//   (and carries out operations on it).
	//  Perhaps this could offer a very simple API, to do with executing commands. (External_Postgres_Server)
	//   There could then be something else, maybe dbi-postgres that uses this core server and will execute particular queries, like get the names of all tables.
	//    The new dbi-postgres could make use of abstract in order to generate the SQL to use.
	//  I don't think that the core External_Server should be doing that much in terms of carrying out DB ops.
	//  Possibly there will be an External_Server object for the client to use too... won't actually connect to the server.
	//   Client versions and server versions.
	//   May want the server version to extend the client version, with the server version being able to handle connections and operations,
	//    client version may be able to do such things in a different way though, over the web.
	
	
	
	
	
	
	
	
	
/*
	
	var Single_And_Plural = Class.extend({
		'init': function(arr_pairs) {
			//this.sing_to_plur = {};
			//this.plur_to_sing = {};
			
			var sing_to_plur = {}, plur_to_sing = {};
			
			this.single = function(plural) {
				console.log('plur_to_sing ' + stringify(plur_to_sing));
				console.log('plural ' + stringify(plural));
				return plur_to_sing[plural];
			};
			this.plural = function(single) {
				return sing_to_plur[single];
			};
			var pair = this.pair = function(pair) {
				sing_to_plur[pair[0]] = pair[1];
				plur_to_sing[pair[1]] = pair[0];
			};
			
			each(arr_pairs, function(i, v) {
				pair(v);
				
			});
			
		}
	});
	
	
	*/
	// var conString = "tcp://_postgres:5432@localhost/postgres";
	
	// There could be a table of singular and plural words inside the database
	//  This can be created as part of the webapp setup.
	//  They could possibly be located in a different schema, but won't do that for the moment.
	
	// This will get more advanced and may make use of DataObject too.
	//  May make an ANSI-SQL implementation, and Postgres could use these in most cases.
	
	// Other SQL systems could override the ANSI-SQL where necessary.
	
	// Likely to model other languages too.
	//  Already have done some JavaScript.
	//  The tool may create some data-access code.
	//  could maybe have db-postgres (a more limited version of dbi, but without creation of CRUD functions, other advanced features)
	//  or could use JavaScript to make a node.js script that sets things up.
	
	
	
	
	
	// create_access_function('fn_create_user_role', '[i,i]', '[s,s]');
	// original function name?
	//  or the original function?
	
	// perhaps not a function to access the original function?
	//  though this would be sure to work, could require pgSql.
	
	// For the moment, may be better to make a function that's the complicated linked query.
	//  ????
	// Or gets the data first in JavaScript.
	//   could do the smaller queries without too much difficulty.
	
	// However 
	//  Can insert the result of a query.
	//  Not exactly sure how.
	
	// But may want to run queries to get user id and role id.
	
	// This basically represents an external_server.
	//  Want to use classes with a more standard API to represent these external resources.
	// Will use Collection and DataObject.
	//  Hopefully this will make things easier
	//  Or at least make more complicated things take less code and be clearer in the longer run.
	
	
	// External servers would also help with other things with web APIs.
	// Possibly call it an 'external resource'.
	//  That way, we could say one small piece of information that gets updates is an 'external resource'
	//  Could also define a site as an external resource, a server that is known to server multiple sites and may be administered.
	
	// Or put the thing about the resources and resource locations in the lang section?
	//  Not sure it's really language though. ????
	//  My toolkit is for doing internet programming with JavaScript.
	//  Perhaps external resources should be condidered 1st class language citizens - with particular resource types being in modules.
	
	// May also identify a server we are running as a resource.
	// Maybe in the HTML part?
	
	
	
	
	
	
	// Perhaps have the External_Resources module, and have that loaded by an 'internet' module that is used for both client and server programming.
	
	
	
	
	
	
	
	// maybe make a jsgui-internet module?
	
	
	
	
	
	
	
	
	// External_Server.extend...
	//  will have 'connection_info' object, which is used to connect.
	
	
	// This seems a bit like a Resource...
	//  Maybe more low-level functionality should be put in the Resource itself?
	//  This actually seems to mirror Resource functionality, but uses this Abstract system.
	//   I think it would be worth making this into a Resource, or folding its functionality into the Postgres resources.
	//   Need to consider if it's worth changing the abstract Posrgres structural items - making them into resources?
	//    Abstract resources?
	//   For the moment, no.
	//   Have made the model of the Postgres DB that's a good basis for it.
	//   Will have the Resource make use of these programming objects, but be called using JSON. May need to increase JSON capabilities of the core Postgres DB objects,
	//   or make a factory / factories that make these core objects when provided with JSON.
	//    I think creating them with 1 JSON parameter should be fine, we'll see.


	// The general method will be to read the PG schema as an abstract schema, carry out modifications, and then have those modifications put into the actual DB.
	//  Want to get this working while making a general web related DB.

	








	
	var DBI_Postgres = Class.extend({
		'init': function(spec) {
			
			this.port = spec.port;
			this.host = spec.host;
			this.username = spec.username;
			this.db_name = spec.db_name;
			this.password = spec.password;
			
			// an event to connect with a callback.
			
			
			// Probably not relevant in the database connection module, this may be better in the abstract postgres section, or generator.
			//this.single_and_plural = new Single_And_Plural(spec.single_and_plural);
			// single and plural names table.
			
			// 2 way map.
			
			
			
			
		},
		
		// and reconnect?
		
		// should know if its in a connected state?
		// does it have a client?
		
		// possible to change db using reconnect?
		
		'reconnect': function(callback) {
			this.end();
			this.connect(callback);
		},
		
		
		'connect': function(callback) {
			var that = this;
			var get_connection_string = function() {
				var res;
				if (that.password) {
					res = 'tcp://' + that.username + ':' + that.password + '@' + that.host + '/' + that.db_name;
				} else {
					res = 'postgres://' + that.username + ':' + that.port + '@' + that.host + '/' + that.db_name;
				}

				
				return res;
			}
			var cs = get_connection_string();
			console.log('cs ' + cs);
			pg.connect(cs, function(err, client) {
				// So, we are connected now, basically.
				
				if (err) {
					console.log('ERROR: ' + err);
				} else {
					client.query("SELECT NOW() as when", function(err, result) {
						console.log("Row count: %d",result.rows.length);  // 1
						console.log("Current year: %d", result.rows[0].when.getYear());
						
						// a little test.
						that.client = client;
						callback.call(this);
					});
				}
				
				
			});	
		},
		'end': function() {
			pg.end();
			delete this.client;
		},
		
		// persist? program/abstract -> 
		'load_data_to_tables': function(data, callback) {
			
			// Will use functions that are available for loading.
			//  May do more work on expressing the database functions as a resource
			// We'll tell it which schema to load them into.
			//  We could give it the abstract schema, or have it load it.
			//  The system does not yet have parsing, which would be useful for more functional analysis.
			
			// Want to work on the GUI before long.
			//  This will mean piecing together presentational elements from what's on the server.
			// Will proceed with the users authentication and authorization systems, with files owned by users, and possibly published.
			//  That way I could manage my website within that, and then choose to publish it in that interface.
			
			
			
			
			
			// this could load up the abstract database, and provide that to other functions.
			//  having the abstract database makes sense here.
			//  it would be possible to perform a bit of analysis on the functions.
			//  parsing the functions into the abstract db would be cool.
			//   much more work at this stage, but worth doing so that we have the information needed to make the function calls.
			
			// loading the abstract database (or schema) seems like a big step.
			//  I think that is the right way of doing things
			//   load abstract
			//   perform analysis
			//   carry out tasks.
			
			// this.load_abstract_schema(schema_name, callback)
			//  can possibly use abstract-postgres-generator?
			//   or just use the abstract database (which will have some indexing of functions)
			//    to query which functions to use for particular things.
			//    could refer to the generator to get the function names / signatures to use.
			
			
			var that = this;
			
			
			if (this.current_schema_name) {
				
				
				this.load_abstract_schema(this.current_schema_name, function(err, abstract_schema) {
					// This will be an impressive thing here.
					//  Will be able to perform analysis more quickly/stably/simply on the abstract schema.
					//  Will be using it here to find the functions that load the data into the tables.
					//   Do not want to have stored that data, it's implicit with a bit of analysis on the database.
					//   Likely to get into parsing the functions too, but that won't be necessary quite yet because we'll be able to find the functions by
					//    looking at their names and parameters.
					
					
					console.log('abstract_schema ' + abstract_schema);
					
					// maybe want some abstract_schema_annotations?
					//  these will say what the functions do...
					//   or give some objects that are linked.
					//  however, actual parsing of the functions, then searching for them by their code would be better.
					//   still, it would be useful to have an index/map of which functions do what.
					
					//console.log('load_data_to_tables data ' + stringify(data));
					if (tof(data) == 'array') {
						var l = data.length, c = 0;
						
						var single_load = function() {
							var item = data[c];
							//console.log('* load_data_to_tables data ' + stringify(data));
							console.log('item ' + stringify(item));
							
							var table_name = item[0];
							var table_data = item[1];
							
							console.log('table_name ' + table_name);
							
							that.load_data_to_table(table_name, table_data, function(error, load_res) {
								if (!error) {
									c++;
									if (c < l) {
										single_load();
									} else {
										callback();
									}
								}
							});
						};
						
						if (c < l) {
							single_load();
						} else {
							callback();
						}
						
						// no, do them individually.
						
						//each(data, function(i, data_item) {
						//	var table_name = data_item[0];
						//	var data_item_data = data_item[1];
							
						//})
					}
				})
			}
			
			
		},
		
		'load_data_to_table': function(table, data, callback) {
			
			// this could load up the abstract schema, and provide that to other functions
			//  maybe this will have been provided with the abstract schema.
			
			// Could be done just using information about functions.
			//  Could identify what functions do by their names.
			//  Possibly by looking at them.
			// Before this stage, it may be worth doing more to encapsulate the table, and the functions that are used to access it, as a kind of resource,
			//  or group of resources.
			
			// However, having the system able to respond to things like adding data with the right functions makes a lot of sense.
			//  Will have already loaded / have the abstract_schema.
			//  Will be able to query the abstract_schema to find out which functions are used to add data.
			// Could possibly store some metadata in the database about what things are, but that would make things more complicated for the moment.
			// I think for the moment, keeping a copy of the abstract_schema, and running a query to determine what function(s) adds a row to that table.
			//  It may be needed / best to parse the SQL functions.
			// Also, comparing functions against templated ones....
			
			// I think the functional analysis on the abstract db could be expanded as a tool.
			//  When various processes are done together, metadata can be kept.
			
			// It seems like some fairly broad things need to get made, and these provide possibilities for the application in use.
			
			// I think parsing and more functional analysis would be a good thing to get into place.
			//  Won't just rely on an index of functions as they have been generated.
			//  Not sure about relying on the function names or parameters. It may also be good being able to work more in a query type way of doing things
			//   so that information gets found out using a querying system, and then acted upon.
			//   Query like 'which function is used to insert rows, and takes the string values'
			// Looking into the functions, finding out what they do, looking at their parameters.
			
			// Mapping these DB functions to JavaScript functions.
			//  I think identifying, or maybe reidentifying what the functions do is an important challenge.
			
			// I'm not as keen on querying this by name, but it may work for the moment.
			//  I think comparing with other abstract functions may work best.... but that is quite a tricky thing to get done properly.
			
			// I think this CRUD map that made in the past seems quite useful for when putting the CRUD functions together.
			//  Perhaps that CRUD map should be retained?
			
			// I do really like the idea of having it able to analyse the database to find the right functions to do various things like add records,
			//  and identify the functions that have overrides with different parameters (by calling functions internally).
			
			// The parsing would become needed I think.
			//  Its quite a big step, but I thinking having all of those functions parsed would then enable them to be queried to see what they do without too much
			//  difficulty. It's a fair bit to do, but I think it will make quite a clean, logical solution.
			
			// For the moment may be using the abstract_schema that has already been created and has the functions' ASTs. It's worth being aware that parsing
			//  will need to be done in the future when loading data to a database where there is not that information...?
			
			// Or do the parsing now so that we can proceed with having different stages be more independant.
			//  Would be able to load data to a database that has already been set up, and would use some analysis of functions to determine which functions
			//  to use to carry that out.
			
			// May want to get better at defining some functions for various purposes, and have an automated means of doing comparisons.
			//  So, when looking for generated functions, could generate a bunch of functions, and compare the existing ones with them.
			//  Will be some quite simple function patterns, but there is likely to be variety and this variety should be anticipated.
			
			// Analysis of functions could prove to be a fairly expansive part.
			//  It may prove useful for a more automated & easier modify system for looking for generated functions.
			//  That way if / when the generated functions get changed, changes will be made to the procedure of finding / identifying those functions.
			
			// Also could maybe identify older versions of generated functions by seeing the do some of the things but not all.
			
			// This may get frustrating because it's using complicated methodology to do something here that would be easy to do otherwise.
			// I think it is still the best way of progressing the library and middleware. 
			
			// Also, could have the metadata for functions published in a more readable format?
			// And kept in that format.
			// So when we have the table, we can look up which functions interact with that table within the CRUD system.
			//  That is information that could be known from generation, and we should be able to get the array / collection of functions used for a particular purpose
			//  fairly easily.
			
			// May have an abstract-postgres-analysis module that is used to analyse abstract postgres objects, and get information about things like what the various functions
			//  do. Can come up with an object that maps the various CRUD functions in a way useful to the application.
			
			// table.create -> all the functions that create a row in that table.
			//  maybe holds a map with function signatures that are available for that functionality.
			
			// That would be like the crud_index we have had previously.
			//  When this is set up, we can use it for very fast usage of Postres functions within JavaScript code.
			
			// Also, how about bulk loading? Working as a transaction?
			//  Transactional support within my system may prove useful.
			
			// I think an automatic means of connecting JS functionality to the code in the DB makes a lot of sense.
			//  Probably do want to treat it just as one possible resource available to the system though. Registering the database, maybe with its metadata,
			//  as a resource makes sense. However, it would be useful in various places to have some more advanced capabilities of a resource
			//  exposed without having to give its metadata. Maybe metadata could be obtained when it is needed.
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			console.log('load_data_to_table table ' + stringify(table));
			console.log('load_data_to_table data ' + stringify(data));
			
			// with an active schema??
			
			// schema.table.load_data
			
			var current_schema_name = this.current_schema_name;
			console.log('current_schema_name ' + current_schema_name);
			
			// the abstract schema should be known.
			//  this will enable quick function analysis to find out which functions are responsible for adding data to that table.
			
			
			
			
			
			// 
			
			// will need to load individual rows to begin with.
			//  will be calling the functions to load the data.
			
			// do we have an abstraction for those functions?
			//  perhaps we could look at the abstract functions.
			// since this is non-abstract here it may need to make use of the abstract capabilities.
			//  will load up the abstract functions, may map/index them.
			// would be easier to be doing things in a different order in the short term, but in this case want to separate the different pieces of code.
			//  the functions have already been defined in abstract and have got persisted to the database.
			
			// perhaps should load up the table as abstract?
			//  perhaps should load the database as abstract?
			//   more analysis could get done on the database to determine what the functions do.
			
			
			// this bit needs to be somewhat flexible.
			
			// should maybe find out more about the columns in the table.
			
			// some of them will match up with the data given, some won't
			
			
			/*  ['roles', ['administrator', 'user']],
	                    ['users', [{'username': 'james', 'password_hash': 'jav124'}]]
	                    
	                    // and the user role connecting the two?
	                    //  it would know that neither of them are string fields, but both of them refer to other tables,
	                    //  with their unique string columns (username and name). name is a big hint too. username too, possibly.
	                    ['users_roles', [['james', 'administrator']]],    // meaning that there is 1 record.
	                    ] */
			
			// 
			
			
			// basically, each object in the data is one row / record.
			
			/*
			each(data, function(i, record) {
				console.log('record ' + stringify(record));
				
				if (tof(record) == 'string') {
					// just one piece of information. may be fine for the roles column.
					
					// we need to know the function used to create the various records.
					
					// will have a load_row function that handles the details.
					
					
					// just loading them one at a time... may not be so fast.
					
					// but may have to do this in a different way with the callbacks.
					
					
				}
				
			})
			*/
			
			// will go through the records sequentially, calling the load_row function.
			/*
			
			var c = 0, l = data.length;
			var that = this;
			var process_row = function() {
				var row = data[c];
				
				that.load_row(table, row, function(error, load_row_res) {
					if (!error) {
						
						
						//console.log('c ' + c);
						
						c++;
						if (c < l) {
							process_row();
						} else {
							callback();
						}
					}
					
				})
				
			}
			
			if (c < l) {
				process_row();
			} else {
				callback();
			}
			*/
			
		},
		
		
		// when loading data... may want to use metadata about the functions.
		//  determining which functions to use to load data is important.
		//  dbi-postgres may be getting a fair bit of abstract information about the database.
		
		
		'load_row': function(table, row, callback) {
			
			var table_name;
			
			if (tof(table) == 'string') {
				table_name = table;
			} else {
				table_name = table.name;
			}
			
			
			// may need some metadata about the table?
			//  the order of the columns?
			
			// however, we want to call the appropriate C create function for the table.
			//  perhaps these could be indexed.
			
			//this.get_create_function(table);
			
			// refers to an index of the various functions.
			//  there will be different versions, some overloaded too.
			
			//console.log('this.crud_index ' + stringify(this.crud_index));
			console.log('table ' + stringify(table));
			
			// and the signature as well.
			// can we take the signature of the row?
			//  in this case, I think we want integer checking.
			//  but never mind, we could have it accept these as integers without too much trouble.
			
			
			// there will be different functions available, taking different signatures.
			//  postgres does function overloading, so we should be able to make use of extra functions that get created and do lookups.
			
			
			
			
			var ci_table = this.crud_index['create'][table_name];
			
			
			console.log('ci_table ' + stringify(ci_table));
			
			
			
			
			// and there is a signature there.
			
			// what is the signature of the row?
			var row_sig = get_item_sig(row);
			console.log('row_sig ' + row_sig);
			
			// This matches it up.
			
			
			// if the row signature is an object...
			
			
			
			
			
			var ci_item = ci_table[row_sig];
			
			// Not really working like this...
			
			//  but a bit more to do.
			
			
			
			
			if (!ci_item) {
				// need to look some more.
				if (row_sig == 'o') {
					// we put the row object into the right array, in the right order.
					
					// check the available signatures / functions
					
					each(ci_table, function(i, afn) {
						console.log('i ' + i);
						console.log('afn ' + stringify(afn));
						
						// the afn has parameters.
						//  we can get a map of these?
						
						// or look at these in order and check to see if they are on the given map.
						var c = afn.parameters.length, arr = [];
						each(afn.parameters, function(i, parameter) {
							console.log('parameter ' + stringify(parameter));
							
							if (is_defined(row[parameter[0]])) {
								
								//console.log('row[parameter[0]] ' + stringify(row[parameter[0]]));
								
								//arr.push([parameter[0], row[parameter[0]]]);
								arr.push(row[parameter[0]]);
								//arr.push(parameter[0])
								c--;
							}
							
							// these may correspond to items in the object.
						});
						
						if (c == 0) {
							row = arr;
						}
						
						// do they match?
								
					});
					
					
				};
				
				row_sig = trim_sig_brackets(get_item_sig(row));
				
				// but the row is an array... should it be considered such?
				//  will use a strip sig braces fn.
				
				
				
				
				console.log('2) row_sig ' + row_sig);
				console.log('row ' + stringify(row));
				console.log('table_name ' + stringify(table_name));
				// we don't have it..
				
				
				
				ci_item = ci_table[row_sig];
				
			}
			console.log('ci_item ' + stringify(ci_item));
			// at this stage, can we get thr right item for the row?
			
			
			if (is_defined(ci_item)) {
				this.execute_function(ci_item, row, function(error, ef_res) {
					if (!error) {
						console.log('ef_res ' + stringify(ef_res));
						callback(undefined, ef_res);
					}
					
				});
				
			} else {
				
				// can look at what the accepted item signatures are.
				
				// if we have 2 strings and need 2 integers?
				
				//  however, it may be best to make these other functions that will put in the data.
				//  they may use function calls as well, but that seems like it will work now.
				
			}
			
			
			
			
			// now with the row sig, we need to do something with it.
			
			// putting it into the right format can get a little more complicated... hopefully not very.
			
			// transform the object to the array in the expected format?
			
			//  may require doing a bit of a search.
			//  not sure that putting the params in as an object is best....
			
			//  but it could allow the params to be matched by name.
			
			
			
			
			
			/*
			// it's create...
			if (tof(row) == 'object') {
				// create a new row that's an array.
				console.log('ci_item.parameters ' + stringify(ci_item.parameters));
				
				var param_map = {};
				each(ci_item.parameters, function(i, v) {
					//param_map[v[0]] = v[1];
					param_map[v[0]] = i;
				})
				console.log('');
				console.log('param_map ' + stringify(param_map));
				
				// want to put the parameters we have received in the row into the arrar
				
				var row2 = [];
				
				each(row, function(i, v) {
					row2[param_map[i]] = v;
				});
				
				console.log('row2 ' + stringify(row2));
				row = row2;
			}
			*/
			
			
			// and then using that function, calling it, we can put the item into the database.
			
			// ok, so we have the abstract function.
			
			// dbi_postgres with a function to call an abstract function?
			//  that may be best because parameters will be sent over node-postgres.
			
			// will use 'execute_function': function(fn_name, params, callback) 
			
			// loading the data needs plenty ore work.
			
			// the row could be an object, not an array.
			
			// now, there is a bit of a problem.
			//  users_roles is serial, int, int
			//  foreign keys refer to other tables.
			//   really referring to the names in other tables (username, name).
			//  want it so that string values can be given for these insert functions.
			
			// it may be necessary to create overloaded functions.
			//  that won't be too hard... we can have function signature checking in JavaScript too.
			// creating the other overloaded functions too...
			//  these would be part of the CRUD.
			
		},
		
		
		// or ensure the CRUD functions using the CRUD factory / CRUD object.
		
		
		'get_database_names': function(callback) {
			// run the query.
			
			// Could use something to put the select statement together.
			//  Put an abstract one together
			//  Have it changed to Postgres
			//   with any necessary modifications.
			//  Could make the middleware fairly complex and able to translate between different DB implementations.
			// However, could make it do particular tasks for the moment.
			// Other complexities will come when making tables out of objects, with their type definitions.
			// Will produce a domain model and translate to DB implementation too.
			// Will have a nice GUI for all this.
			
			// Will have a variety of database utilities and methods that interface easily with JavaScript.
			//  Separation of the 'business' logic from the database implementation.
			
			
			var client = this.client;
			
			// Will do a select exists query.
			
			var sql = 'SELECT d.datname as "Name", u.usename as "Owner", pg_catalog.pg_encoding_to_char(d.encoding) as "Encoding" FROM pg_catalog.pg_database d LEFT JOIN pg_catalog.pg_user u ON d.datdba = u.usesysid ORDER BY 1;';
			var query = client.query(sql);

			var res = [];
			
			//can stream row results back 1 at a time
			query.on('row', function(row) {
			  console.log(row);
			  //console.log("row", row); //Beatle name: John
			  //console.log("Beatle birth year: %d", row.birthday.getYear()); //dates are returned as javascript dates
			  //console.log("Beatle height: %d' %d\"", Math.floor(row.height/12), row.height%12); //integers are returned as javascript ints
			  
			  res.push(row.Name);
			  
			  
			});
			query.on('end', function() {
				//fired once and only once, after the last row has been returned and after all 'row' events are emitted
				//in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
				//client.end();
				//console.log('res ' + stringify(res));
				callback(res);
			});
			
			
		},
		
		'ensure_no_db': function(db_name, callback) {
			console.log('ensure_no_db db_name ' + db_name);;
			var that = this;
			this.database_exists(db_name, function(err, exists) {
				if (!err) {
					if (exists) {
						that.delete_db(db_name, callback);
					} else {
						callback(undefined, true);
					}
				}
			})
			
		},
		
		'delete_db': function(db_name, callback) {
			console.log('delete db db_name ' + db_name);
			var statement = 'DROP DATABASE ' + db_name;
			this.s_query(statement, callback);
			
		},
		
		'create_database': function(db_name, callback) {
			// creates the db, which can have multiple schemas inside.
			
			console.log('fn create_database');
			
			var statement = 'CREATE DATABASE ' + db_name + ' TEMPLATE = template0;';
			
			console.log('statement ' + statement);
			var query = this.client.query(statement);
			query.on('row', function(row) {
				  console.log(row);
				  //console.log("row", row); //Beatle name: John
				  //console.log("Beatle birth year: %d", row.birthday.getYear()); //dates are returned as javascript dates
				  //console.log("Beatle height: %d' %d\"", Math.floor(row.height/12), row.height%12); //integers are returned as javascript ints
				  
				  //res.push(row.Name);
				  
				  
				});
			
			query.on('end', function() {
				//fired once and only once, after the last row has been returned and after all 'row' events are emitted
				//in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
				callback();
				
			});
			
			
			//this.client.on('error', function(error) {
			//    console.log(error);
			//  });    
			query.on('error', function(error) {
			    console.log(error);
			  });    
			
		},
		
		'database_exists': function(db_name, callback) {
			// SELECT d.datname as "Name", u.usename as "Owner", pg_catalog.pg_encoding_to_char(d.encoding) as "Encoding" FROM pg_catalog.pg_database d LEFT JOIN pg_catalog.pg_user u ON d.datdba = u.usesysid ORDER BY 1;
			// SELECT d.datname as "Name", u.usename as "Owner" FROM pg_catalog.pg_database d LEFT JOIN pg_catalog.pg_user u ON d.datdba = u.usesysid ORDER BY 1;
			// SELECT EXISTS(d.datname as "Name", u.usename as "Owner" FROM pg_catalog.pg_database d LEFT JOIN pg_catalog.pg_user u ON d.datdba = u.usesysid WHERE... ORDER BY 1);
			
			console.log('database_exists db_name ' + db_name);
			
			var sel = new Abstract.Select({
				'from_item': new Abstract.Exists({
					'subquery': new Abstract.Select({
						'select_list': ['pg_catalog.pg_database.datname'],
						'from_item': 'pg_catalog.pg_database',
						'where': [['pg_catalog.pg_database.datname', db_name]]
					})
				})
			})
			var sql = sel.toString();
			console.log('** database_exists sql ' + sql);
			
			//this.execute_query({
			//	
			//})
			
			// execute a query with the callback.
			
			// use the multirow version....
			
			// But possibly we just want the single result.
			//  Return the first column of the first row as the result?
			//  I think it had a name in SQL Server parlence...
			
			// single result value
			// s_query
			
			this.s_query(sql, callback);
			
			
		},
		'ensure_database_exists': function(db_name, callback) {
			//console.log('** ensure_database_exists db_name ' + db_name);
			var that = this;
			that.database_exists(db_name, function(error, exists) {
				if (!error) {
					if (exists) {
						callback(undefined, true);
					} else {
						that.create_database(db_name, callback);
					}
					
				}
				
			});
		},
		
		
		'get_table_qn': function(table_name) {
			// gets the qualified name, including schema
			// my_schema.table_name
			var res = table_name;
			if (this.current_schema_name) {
				res = this.current_schema_name + '.' + table_name;
			}
			
			return res;
			
		},
		
		// Don't worry about which schema to use so much?
		
		'set_schema_search_path': function(arr_paths, callback) {
			console.log('set_schema_search_path arr_paths ' + stringify(arr_paths));
			if (tof(arr_paths) == 'string') {
				arr_paths = [arr_paths];
			}
			
			var client = this.client;
			var sql = 'SET search_path TO ' + arr_paths.join(',');
			//console.log('sql ' + sql);
			var current_schema_name = arr_paths[0];
			// for setting things.
			this.current_schema_name = current_schema_name;
			
			this.execute_query({
				'sql': sql,
				'row': function(row) {
					//console.log('column_exists exists row ' + stringify(row));
					//res = row.exists;
				},
				'end': function() {
					callback(undefined, true);
				}
			})
			
		},
		
		'get_schema_names': function(callback) {
			var client = this.client;
			var sql = 'SELECT nspname AS "name", pg_catalog.obj_description(oid) AS "comments" \
				FROM pg_namespace \
				WHERE nspname !~ \'^pg_.*\';';
			var query = client.query(sql);
			
			var res = [];
			
			query.on('row', function(row) {
				  console.log(row);
				  //console.log("row", row); //Beatle name: John
				  //console.log("Beatle birth year: %d", row.birthday.getYear()); //dates are returned as javascript dates
				  //console.log("Beatle height: %d' %d\"", Math.floor(row.height/12), row.height%12); //integers are returned as javascript ints
				  
				  //res.push(row.Name);
				  res.push(row.name);
				  
				});
			
			query.on('end', function() {
				//fired once and only once, after the last row has been returned and after all 'row' events are emitted
				//in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
				callback(res);
				
			});
			
			
			//this.client.on('error', function(error) {
			//    console.log(error);
			//  });    
			query.on('error', function(error) {
				console.log(error);
			});    
			
			
		},
		'create_schema': function(name, callback) {
			var client = this.client;
			var sql = 'CREATE SCHEMA ' + name + ';';
			var query = client.query(sql);
			var that = this;
			query.on('end', function() {
				//fired once and only once, after the last row has been returned and after all 'row' events are emitted
				//in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
				callback.call(that, undefined, true);
				//callback(undefined, true);
				
			});
			query.on('error', function(error) {
				
				// error if the schema already exists.
				//  not sure about throwing a JavaScript error - they are not that useful
				
				// May have a way of indicating the query has ended with an error.
				
				// Could maybe return it as parameter 0 all the time.
				//  Maybe return a query_result object
				//  array: [error, result]
				
				// [undefined, true]
				// [error, undefined]
				callback.call(that, [error]);
				
				
				
				
				console.log(error);
			});    
		},
		
		// May just want really simple result processing?
		//  Gives it the result in a callback?
		//  Or may get used to a pattern where it gives either an error or a result.
		
		'ensure_schema_exists': function(name, callback) {
			
			this.schema_exists(name, function(error, qres) {
				// if no error
				
				if (!error) {
					// this line is here for clarity.
					var schema_exists = qres;
					if (!schema_exists) {
						this.create_schema(name, function(create_schema_error, create_schema_result) {
							if (create_schema_error) {
								// error
								callback.call(this, create_schema_error);
								
							} else {
								callback.call(this, create_schema_error, create_schema_result);
								
							}
							
						})
					} else {
						callback.call(this, error, true);
					}
				}
			});
		},
		
		'schema_exists': function(name, callback) {
			// maybe not connected....
			
			// best to get a boolean from the database.
			
			var sql = 'SELECT exists(select schema_name FROM information_schema.schemata WHERE schema_name = \'' + name + '\') AS "exists";';
			var that = this;
			
			// do we have the client?
			
			var query = this.client.query(sql);
			
			var res = false;
			
			query.on('row', function(row) {
				//console.log(row);
				//console.log("row", row); //Beatle name: John
				//console.log("Beatle birth year: %d", row.birthday.getYear()); //dates are returned as javascript dates
				//console.log("Beatle height: %d' %d\"", Math.floor(row.height/12), row.height%12); //integers are returned as javascript ints
				  
				//res.push(row.Name);
				//res.push(row.name);
				//console.log('tof(row.exists) ' + tof(row.exists));
				res = row.exists;
			});
			
			
			
			query.on('end', function() {
				//fired once and only once, after the last row has been returned and after all 'row' events are emitted
				//in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
				//callback([undefined, true]);
				
				// need to look at the result
				
				callback.call(that, undefined, res);
				//callback(undefined, res);
				
			});
			query.on('error', function(error) {
				
				// error if the schema already exists.
				//  not sure about throwing a JavaScript error - they are not that useful
				
				// May have a way of indicating the query has ended with an error.
				
				// Could maybe return it as parameter 0 all the time.
				//  Maybe return a query_result object
				//  array: [error, result]
				
				// [undefined, true]
				// [error, undefined]
				callback.call(that, error);
				
				
				
				// however, this means an error in the SQL.
				//  May not want SQL errors going outside of here so much.
				
				console.log(error);
			});    
			
		},
		
		// some kind of a spec or function parameters object could help.
		//  could be very useful with optional parameters.
		
		// Could also use polymorphism here to identify the callback, maybe the last parameter being the callback.
		//  An optional parameter would be include_system_tables or similar (default true)
		
		// Could have a general SQL_EXISTS query, where we give it the SQL and it deals with the callback.
		
		'table_exists': function(table_name, callback) {
			
			if (table_name.name) {
				table_name = table_name.name;
			}
			
			// and needs to use the current schema name too.
			var sql;
			if (this.current_schema_name) {
				sql = 'SELECT exists(SELECT tablename FROM pg_tables WHERE tablename = \'' + table_name + '\' AND schemaname = \'' + this.current_schema_name + '\') AS "exists";';
			} else {
				sql = 'SELECT exists(SELECT tablename FROM pg_tables WHERE tablename = \'' + table_name + '\') AS "exists";';
			}
			 
			var that = this;
			
			var query = this.client.query(sql);
			var res = false;
			console.log('sql ' + sql);
			query.on('row', function(row) {
				//console.log('table_exists row ' + row);
				//console.log("row", row); //Beatle name: John
				//console.log("Beatle birth year: %d", row.birthday.getYear()); //dates are returned as javascript dates
				//console.log("Beatle height: %d' %d\"", Math.floor(row.height/12), row.height%12); //integers are returned as javascript ints
				  
				//res.push(row.Name);
				//res.push(row.name);
				//console.log('tof(row.exists) ' + tof(row.exists));
				res = row.exists;
			});
			
			
			
			query.on('end', function() {
				//fired once and only once, after the last row has been returned and after all 'row' events are emitted
				//in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
				//callback([undefined, true]);
				callback.call(that, undefined, res);
				//callback(undefined, res);
				
			});
			query.on('error', function(error) {
				
				// error if the schema already exists.
				//  not sure about throwing a JavaScript error - they are not that useful
				
				// May have a way of indicating the query has ended with an error.
				
				// Could maybe return it as parameter 0 all the time.
				//  Maybe return a query_result object
				//  array: [error, result]
				
				// [undefined, true]
				// [error, undefined]
				console.log(error);
				callback.call(that, error);
				
				
				
				// however, this means an error in the SQL.
				//  May not want SQL errors going outside of here so much.
				
				
			});    
			
			
		},
		
		// definitely would like more object parameters.
		//  some, like 'cascade' could be set to true.
		
		// a polymorphic mechanism would help a lot, maybe expanding on the existing one.
		
		// Maybe something that takes the sugnatures and creates an object with named parameters.
		//  Making use of a parameter naming system for signatures.
		
		// Getting on for a bigger API here.
		
		//'ensure_table_does_not_exist': function
		
		
		'delete_table': fp(function(a, sig) {
			
			// table_name, cascade, callback
			
			var o_params = {};
			
			if (sig == '[s,b,f]') {
				o_params['table_name'] = this.get_table_qn(a[0]);
				o_params['cascade'] = a[1];
				o_params['callback'] = a[2];
			} else if (sig == '[s,f]') {
				o_params['table_name'] = this.get_table_qn(a[0]);
				o_params['callback'] = a[1];
			}
			
			var sql = 'DROP TABLE ' + o_params['table_name'];
			
			if (o_params['cascade']) {
				sql = sql + ' CASCADE';
			}
			sql = sql + ';';
			
			
			var res;
			
			// could use a bolean query system.
			console.log('sql ' + sql);
			this.execute_query({
				'sql': sql,
				'row': function(row) {
					//console.log('column_exists exists row ' + stringify(row));
					//res = row.exists;
				},
				'end': function() {
					o_params['callback'](undefined, res);
				}
			})
			
		}),
		
		// likely to use pf on this... identifying which one is the callback and havuing it follow a few rules.
		'get_table_names': function(callback) {
			// user tables
			
			var sql = 'SELECT tablename AS name FROM pg_tables \
				WHERE tablename NOT LIKE \'pg%\' \
				AND tablename NOT LIKE \'sql%\';';
			var that = this;
			
			var query = this.client.query(sql);
			var res = [];
			

			query.on('row', function(row) {
				console.log(row);
				//console.log("row", row); //Beatle name: John
				//console.log("Beatle birth year: %d", row.birthday.getYear()); //dates are returned as javascript dates
				//console.log("Beatle height: %d' %d\"", Math.floor(row.height/12), row.height%12); //integers are returned as javascript ints
				  
				//res.push(row.Name);
				//res.push(row.name);
				//console.log('tof(row.exists) ' + tof(row.exists));
				//res = row.exists;
				res.push(row.name);
			});
			
			
			
			query.on('end', function() {
				//fired once and only once, after the last row has been returned and after all 'row' events are emitted
				//in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
				//callback([undefined, true]);
				callback.call(that, undefined, res);
				//callback(undefined, res);
				
			});
			query.on('error', function(error) {
				
				// error if the schema already exists.
				//  not sure about throwing a JavaScript error - they are not that useful
				
				// May have a way of indicating the query has ended with an error.
				
				// Could maybe return it as parameter 0 all the time.
				//  Maybe return a query_result object
				//  array: [error, result]
				
				// [undefined, true]
				// [error, undefined]
				// changing the callback system
				
				//  error, query_result
				
				
				callback.call(that, error);
				
				
				
				// however, this means an error in the SQL.
				//  May not want SQL errors going outside of here so much.
				
				//console.log(error);
			});    
			
		},
		
		// Get the names of all the functions
		//  available (or the postgres functions in particular)
		
		// Get list of all the user's functions in the database
		
		// Execute a user's function
		//  (may rely on escaping input).
		
		
		
		
		
		'column_exists': function(table_name, column_name, callback) {
			//console.log('table_name ' + table_name);
			
			var sql;
			if (this.current_schema_name) {
				sql = 'SELECT exists(SELECT column_name FROM information_schema.columns WHERE table_name = \'' + table_name + '\' AND table_schema = \'' + this.current_schema_name + '\' AND column_name =  \'' + column_name + '\') AS "exists";';
			} else {
				sql = 'SELECT exists(SELECT column_name FROM information_schema.columns WHERE table_name = \'' + table_name + '\' AND column_name =  \'' + column_name + '\') AS "exists";';
			}
			
			//var sql = 'SELECT exists(SELECT column_name FROM information_schema.columns WHERE table_name = \'' + this.get_table_qn(table_name) + '\' AND column_name =  \'' + column_name + '\') AS "exists";';
			var res;
			console.log('sql ' + sql);
			// could use a bolean query system.
			
			this.execute_query({
				'sql': sql,
				'row': function(row) {
					//console.log('column_exists exists row ' + stringify(row));
					res = row.exists;
				},
				'end': function() {
					callback(undefined, res);
				}
			});
			
		},
		
		// get all columns information schema...
		// get all columns as column objects...
		
		'get_columns_information_schema': function(schema_name, table_name, callback) {
			// use a query for this...
			
			var sql, that = this;
			//if (this.current_schema_name) {
			//	sql = 'SELECT * FROM information_schema.columns WHERE table_name = \'' + table_name + '\' AND table_schema = \'' + this.current_schema_name + '\';';
			//	
			//	//sql = 'SELECT exists(SELECT column_name FROM information_schema.columns WHERE table_name = \'' + table_name + '\' AND table_schema = \'' + this.current_schema_name + '\' AND column_name =  \'' + column_name + '\') AS "exists";';
			//} else {
			//	sql = 'SELECT * FROM information_schema.columns WHERE table_name = \'' + table_name + '\';';
			//}
			console.log('4) table_name ' + table_name);
			sql = 'SELECT * FROM information_schema.columns WHERE table_name = \'' + table_name + '\' AND table_schema = \'' + schema_name + '\';';
			
			
			//var sql = 'SELECT * FROM information_schema.columns WHERE table_name = \'' + table_name + '\';';
			
			//console.log('sql ' + sql);
			
			var res = [];
			this.execute_query({
				'sql': sql,
				'row': function(row) {
					//console.log('get_columns_information_schema row ' + (row));
					//console.log('get_columns_information_schema row ' + stringify(row));
					//res = row;
					res.push(row);
				},
				'end': function() {
					callback.call(that, undefined, res);
				},
				'error': function(error) {
					console.log(error);
					callback.call(that, error);
				}
			});
		},
		
		
		'get_column_data_type': function(table_name, column_name, callback) {
			
			// get the datatype with just the text?
			//  though it could be using the standard information_schema description system.
			
			// will in fact get the column information schema.
			//  will need to process it more to find about some data types like serial.
			var that = this;
			var get_column_information_schema_data = function(table_name, column_name, callback) {
				
				var sql;
				if (this.current_schema_name) {
					
					sql = 'SELECT * FROM information_schema.columns WHERE table_name = \'' + table_name + '\' AND column_name = \'' + column_name + '\' AND table_schema = \'' + this.current_schema_name + '\';';
					
					//sql = 'SELECT exists(SELECT column_name FROM information_schema.columns WHERE table_name = \'' + table_name + '\' AND table_schema = \'' + this.current_schema_name + '\' AND column_name =  \'' + column_name + '\') AS "exists";';
				} else {
					sql = 'SELECT * FROM information_schema.columns WHERE table_name = \'' + table_name + '\' AND column_name = \'' + column_name + '\';';
				}
				
				
				
				console.log('sql ' + sql);
				// maybe a query that returns a single row.
				var res;
				that.execute_query({
					'sql': sql,
					'row': function(row) {
						console.log('get_column_data_type row ' + stringify(row));
						res = row;
					},
					'end': function() {
						callback(undefined, res);
					},
					'error': function(error) {
						
						// error if the schema already exists.
						//  not sure about throwing a JavaScript error - they are not that useful
						
						// May have a way of indicating the query has ended with an error.
						
						// Could maybe return it as parameter 0 all the time.
						//  Maybe return a query_result object
						//  array: [error, result]
						
						// [undefined, true]
						// [error, undefined]
						console.log(error);
						callback.call(that, error);
						
						
						
						// however, this means an error in the SQL.
						//  May not want SQL errors going outside of here so much.
						
						
					}
				});
				
				
			}
			
			
			get_column_information_schema_data(table_name, column_name, function(error, information_schema_row) {
				if (error) {
					
				} else {
				
					//var information_schema_row = information_schema_res[1];
					console.log('information_schema_row ' + stringify(information_schema_row));
					
					// need to look into this schema data.
					// how to identify it is a serial data type?
					///  think it's in the 'default' category.
					
					// Want to be ablt to make an abstract column from the INFORMATION_SCHEMA
					
					// then with the information schema row want to make an abstract column.
					
					var data_type = new Abstract.Data_Type({
						'information_schema': information_schema_row
					});
					//var res = [undefined, data_type];
					//callback(res);
					callback.call(that, undefined, data_type);
				}
				
				//callback()
				
				//if (!)
				
			})
			
			
			
			
		},
		
		
		// Will have some code for getting the table, various primarary key, foreign key constraints.
		
		// Get the info as it is in the information schema.
		
		// constraint_column_usage
		// constraint_table_usage
		
		// get table primary keys
		
		// Want to be getting something that's joined the column with the constraint too.
		//  Could possibly do it with separate queries to get constraint columns.
		// Probably easier for the moment.
		
		
		// get_constraint_columns
		//  constraint_name
		//  gets them in order.
		
		
		
		
		
		
		// also select * from information_schema.table_constraints INNER JOIN information_schema.key_column_usage ON (information_schema.table_constraints.constraint_name = information_schema.key_column_usage.constraint_name) WHERE constraint_type ='PRIMARY KEY'
		
		// Want to put together a system that makes queries programatically.
		// Will make it quicker to modify such queries.
		
		// App will be generating SQL.
		
		
		// just the simple query that gets the constraints, not the columns 
		//  the function name indicating it gets rows from the DB.
		'get_table_pk_constraints_rows': function(schema, table_name, callback) {
			var sql, schema_name;
			console.log('schema ' + schema);
			if (schema.get) {
				schema_name = schema.get('name');
			}
			if (tof(schema) == 'string') {
				schema_name = schema;
			}
			
			// more functions will require a schema_name for the moment.
			//  may change the ways parameters are given.
			
			
						/*
			if (this.current_schema_name) {
				// Could build this using an abstract SQL Select Statement.
				//  Easier to add clauses programatically.
				
				sql = 'SELECT * FROM information_schema.table_constraints WHERE table_schema = \'' + this.current_schema_name + '\' AND table_name = \'' + table_name + '\' AND constraint_type =\'PRIMARY KEY\';';
				
				//sql = 'SELECT exists(SELECT column_name FROM information_schema.columns WHERE table_name = \'' + table_name + '\' AND table_schema = \'' + this.current_schema_name + '\' AND column_name =  \'' + column_name + '\') AS "exists";';
			} else {
				sql = 'SELECT * FROM information_schema.table_constraints WHERE table_name = \'' + table_name + '\' AND constraint_type =\'PRIMARY KEY\';';
				
			}
			*/
			sql = 'SELECT * FROM information_schema.table_constraints WHERE table_schema = \'' + schema_name + '\' AND table_name = \'' + table_name + '\' AND constraint_type =\'PRIMARY KEY\';';
			
			// returns multiple rows from information_schema.
			
			// maybe have something that runs a multi-row query, returns them all to the callback function.
			console.log('sql ' + sql);
			
			this.execute_multirow_to_callback(sql, callback);
			
			// often, when this has completed, further information about the constraints will be obtained.
			
			
			
		},
		
		// gets the full info...
		//  maybe we don't want so many columns.
		//  could use some aliases too.
		
		// perhaps could just get column name and ordinal position.
		
		
		'get_constraint_columns': function(schema_name, table_name, constraint_name, callback) {
			
			// automatically assigning the schema on these functions???
			
			
			
			// let's build up the SQL select statement.
			
			//  hmmm.... need to be more particular than this.
			
			// Can't identify them just by name.
			
			var ij = new Abstract.Inner_Join({
				'left_table': 'INFORMATION_SCHEMA.key_column_usage',
				'right_table': 'INFORMATION_SCHEMA.columns',
				'left_column': 'column_name',
				'right_column': 'column_name'
			})
			
			// So, the inner join works.
			//  We still need just a few columns from it though.
			
			// selecting a few rows with an alias, returning them.
			
			var select_list = [['INFORMATION_SCHEMA.columns.column_name', 'column_name'],
			                   ['INFORMATION_SCHEMA.key_column_usage.constraint_name', 'constraint_name'],
			                   //['INFORMATION_SCHEMA.key_column_usage.constraint_type', 'constraint_type'],
			                   ['INFORMATION_SCHEMA.key_column_usage.ordinal_position', 'ordinal_position']];
			//var select_list = [['INFORMATION_SCHEMA.key_column_usage.constraint_name', 'constraint_name']];
			//var select_list = [['INFORMATION_SCHEMA.key_column_usage.constraint_type', 'constraint_type']];
			//var select_list = [['INFORMATION_SCHEMA.key_column_usage.ordinal_position', 'ordinal_position']];
			
			
			
			
			// perhaps join it with the information about the column.
			
			var a_select = new Abstract.Select({
				'select_list': select_list,
				// will be selecting from an inner join.
				'from_item': ij
				//'from_item': 'INFORMATION_SCHEMA.key_column_usage'
			});
			
			
			// add the where clauses programatically.
			// could just have pairs for direct matches in where clauses.
			
			// where is a single condition, but could be joined with AND.
			//  however could be listed as multiple conditions and they get expressed as a single one joined by AND clauses
			
			//if (this.current_schema_name) {
			//	a_select.where.push(['INFORMATION_SCHEMA.key_column_usage.table_schema', this.current_schema_name]);
			//	a_select.where.push(['INFORMATION_SCHEMA.columns.table_schema', this.current_schema_name]);
			//	a_select.where.push(['INFORMATION_SCHEMA.key_column_usage.constraint_schema', this.current_schema_name]);
			//}
			
			var where = a_select.get('where');
			
			where.push(['INFORMATION_SCHEMA.key_column_usage.table_schema', schema_name]);
			where.push(['INFORMATION_SCHEMA.columns.table_schema', schema_name]);
			where.push(['INFORMATION_SCHEMA.key_column_usage.constraint_schema', schema_name]);
			
			where.push(['INFORMATION_SCHEMA.key_column_usage.table_name', table_name]);
			where.push(['INFORMATION_SCHEMA.columns.table_name', table_name]);
			where.push(['INFORMATION_SCHEMA.key_column_usage.constraint_name', constraint_name]);
			
			// need to order them by ordinal_position
			
			a_select.set('order_by', ['INFORMATION_SCHEMA.key_column_usage.ordinal_position', 'DESC']);
			
			
			var sql = a_select.toString();
			
			//console.log('sql ' + sql);
			// OK :) we can execute the generated SQL. The query builder / use of Abstract Select and other queries will be expanded.
			// Would like to select particular fields
			//  Join with other tables.
			
			
			
			this.execute_multirow_to_callback(sql, callback);
			
			
			
			
		},
		
		
		
		
		
		// get the constraints information out of the database
		
		
		
		
		
		
		//  This will be relatively similar accross languages, it won't be so hard to port.
		
		// The differences between SQL implementations may mean that there should be various versions of this dbi-?
		//  Same API, different DBs.
		
		// This could expose a Relational DB API.
		//  Other things could rely on having a Relational DB API.
		//  Maybe give it less general name... it will do some particular things.
		
		// This module will also be usable on the server to get code snippets.
		//  I could make a CRUD generator for postgres on the website.
		//  Could later be integrated with other MetaBench services, but a nice web app would be to take a description of the DB
		//    (domain model / implementation details, can be flexible)
		//  Produces postgres code (probably using code on the server :))
		//  Will be able to produce quite a lot of postgres that can produce the tables and CRUD routines.
		
		// Could also put up adverts, maybe charge for premium usage
		//  $2 for 2 year subscription??? just for one small tool.
		
		// Login etc would become useful when dealing with these forms of data.
		
		
		
		//  That subscription for the 'Postgres Scripting Tool'
		//   Could be a cheap, specific service.
		//  May also 
		
		// mb-server is going to use bdi-postgres to set things up.
		// will have various database descriptions that could be plugged in.
		
		// could have something for a standard web server
		//  users, content, pages, etc.
		
		
		
		
		
		
		
		
		'get_table_sequences': function(schema_name, table, callback) {
			// could give an abstract table or a table name.
			
			// will get all the columns, and look at the 'default' value for each.
			
			var table_name = table;
			var res = [];
			
			this.get_columns_information_schema(schema_name, table, function(error, info_sch) {
				//console.log('info_sch ' + stringify(info_sch));
				
				// gets lots of info.
				
				each(info_sch, function(i, v) {
					var def = v.column_default;
					//console.log('def ' + def);
					
					// also the column name.
					
					// if it's not null, check for the value.
					
					// use a regex to match sequence next val
					
					//  don't understand the regclass part.
					// nextval('seq_name'::regclass)
					//var rx_nv = test = new RegExp('nextval(\'' + , 'g');
					
					//var res_item = [];
					
					// column name, is pk / pk ordinal, sequence name
					//  could possibly get the pk ordinal value using a join in the sql.
					//  could possibly run further queries for more info on the column.
					
					// though maybe we have that info elswehere and it is not so easy to integrate into this function.
					
					
					var rx_nv = /^nextval\('([a-zA-Z0-9_]+)'::regclass\)$/;
					
					if (tof(def) == 'string') {
						var m = def.match(rx_nv);
						//console.log('m ' + stringify(m));
						
						if (m) {
							var sequence_name = m[1];
							console.log('sequence_name ' + sequence_name);
							
							res.push([v.column_name, sequence_name]);
							
						}
					}
					
				});
				callback(undefined, res);
			});
			
		},
		
		
		
		// gets all the sequences in the schema / database.
		
		// we may want to get all the sequences in a table.
		//  could possibly have this take a 'spec' parameter so that it gets given the table as a parameter if necessary.
		
		
		'get_sequence_names': function(callback) {
			var sql;
			if (this.current_schema_name) {
				sql = 'SELECT * FROM information_schema.sequences WHERE sequence_schema = \'' + this.current_schema_name + '\';';
			} else {
				sql = 'SELECT * FROM information_schema.sequences;';
				//sql = 'SELECT exists(SELECT column_name FROM information_schema.columns WHERE table_name = \'' + table_name + '\' AND column_name =  \'' + column_name + '\') AS "exists";';
			}
			var res = [];
			this.execute_query({
				'sql': sql,
				'row': function(row) {
					//console.log('get_sequence_names exists row ' + stringify(row));
					//res = row;
					res.push(row.sequence_name);
				},
				'end': function() {
					callback(undefined, res);
				},
				'error': function(error) {
					
					// error if the schema already exists.
					//  not sure about throwing a JavaScript error - they are not that useful
					
					// May have a way of indicating the query has ended with an error.
					
					// Could maybe return it as parameter 0 all the time.
					//  Maybe return a query_result object
					//  array: [error, result]
					
					// [undefined, true]
					// [error, undefined]
					console.log(error);
					callback.call(that, error);
					
					
					
					// however, this means an error in the SQL.
					//  May not want SQL errors going outside of here so much.
					
					
				}
			});
			
		},
		
		
		
		//  Maybe won't be here.
		//  This could even be more on the abstract function.
		//  creates the abstract SQL function based on the table and some other info.
		
		
		
		
		
		'get_table_pk_default': function(table, callback) {
			// we may be able to guess the sequence name too.
		},
		
		
		
		// load abstract sequence and load abstract sequences.
		// will select from the INFORMATION_SCHEMA.sequences view, then initialize the abstract sequence objects from them.
		
		'load_sequences_rows': function(schema, callback) {
			
			var schema_name;
			
			if (tof(schema) == 'string') {
				schema_name = schema;
			}
			
			if (schema.get) {
				schema_name = schema.get('name');
			}
			
			// use the current schema???
			
			// put together the SQL query.
			
			// use the abstract select statement.
			
			var sel = new Abstract.Select({
				'select_list': '*',
				'from_item': 'INFORMATION_SCHEMA.sequences',
				'where': [['sequence_schema', schema_name]]
			});
			
			var sql = sel.toString();
			console.log('sql ' + sql);
			
			this.execute_multirow_to_callback(sql, callback);
			
		},
		
		
		// get the schema function rows...
		//  nice to have functions dealing with the implementation in postgres in particular more isolated,
		//  though converting from this information_schema to the abstract may have some postgres specific things.
		
		'get_schema_functions_rows': function(schema, callback) {
			// get the routines in the schema.
			
			
			var schema_name;
			
			if (tof(schema) == 'string') {
				schema_name = schema;
			}
			
			if (schema.get) {
				schema_name = schema.get('name');
			}
			
			// use the current schema???
			
			// put together the SQL query.
			
			// use the abstract select statement.
			
			var sel = new Abstract.Select({
				'select_list': '*',
				'from_item': 'INFORMATION_SCHEMA.routines',
				'where': [['routine_schema', schema_name]]
			});
			
			var sql = sel.toString();
			console.log('sql ' + sql);
			
			this.execute_multirow_to_callback(sql, callback);
		},
		
		// Will have the functions for dealing with those things, 
		
		// schema function names???
		
		'load_function_specific_names': function(schema, callback) {
			// INFORMATION_SCHEMA.routines.specific_name
			
			// query rows.field as array...
			//  would be concise here.

			var schema_name;
			
			if (tof(schema) == 'string') {
				schema_name = schema;
			}
			
			if (schema.get) {
				schema_name = schema.get('name');
			}
			
			// use the current schema???
			
			// put together the SQL query.
			
			// use the abstract select statement.
			
			var sel = new Abstract.Select({
				'select_list': ['specific_name'],
				'from_item': 'INFORMATION_SCHEMA.routines',
				'where': [['routine_schema', schema_name]]
			});
			
			var sql = sel.toString();
			//console.log('sql ' + sql);
			
			this.execute_multirow_single_item_to_array_callback(sql, callback);
			
			
			
		},
		
		'load_abstract_functions_from_specific_names': function(schema, specific_names, callback) {
			var that = this;
			//that.load_function_specific_names()
			
			// then go through the names, loading the abstract function.
			
			// the process/callback pattern
			var c = 0, l = specific_names.length;
			
			// the res is a collection of functions.
			var res_fns = new Collection({
				//'index_by': 'specific_name'
			});
			
			
			var process_function = function() {
				//var schema = adb_schemas[c];
				var fn_specific_name = specific_names[c];
				console.log('fn_specific_name ' + fn_specific_name);
				that.load_abstract_function_from_specific_name(schema, fn_specific_name, function(error, load_abstract_function_from_specific_name_res) {
					c++;
					res_fns.push(load_abstract_function_from_specific_name_res);
					if (c < l) {
						process_function();
					} else {
						callback(undefined, res_fns);
					}
				});
			};
			
			if (c < l) {
				process_function();
			} else {
				callback(undefined, res_fns);
			};
			
			
		},
		// Quite a lot of these functions, a fair bit of boilerplate code used at the moment.
		//  The functions are not particularly complicated, but having a fair few of them will help get this working and doing all that is needed to load all the
		//  required data.
		// There will likely be other equivalents for other SQL implementations.
		'load_specific_function_parameter_rows': function(schema_name, specific_name, callback) {

			var sel = new Abstract.Select({
				'select_list': '*',
				'from_item': 'INFORMATION_SCHEMA.parameters',
				'where': [['specific_schema', schema_name], ['specific_name', specific_name]],
				'order_by': [['ordinal_position', 'ASC']]
			});
			
			var sql = sel.toString();
			//console.log('sql ' + sql);
			
			this.execute_multirow_to_callback(sql, callback);
			
		},
		
		'load_specific_function_abstract_parameters': function(schema_name, specific_name, callback) {
			var that = this;
			var res = [];
			that.load_specific_function_parameter_rows(schema_name, specific_name, function(err, param_rows) {
				
				// array of params? collection?
				
				// maybe will use collection when more tested and developed.
				
				each(param_rows, function(i, param_row) {
					var param = new Abstract.Parameter(param_row);
					res.push(param);
				});
				
				callback(undefined, res);
				
				
			});
			
			
		},
		
		// could use a wrapper to make this function, or make the singular one polymorphic and repeat, getting all the results.
		'load_abstract_function_from_specific_name': function(schema, specific_name, callback) {
			// will also perform queries to get information about the parameters.
			
			var schema_name;
			
			if (tof(schema) == 'string') {
				schema_name = schema;
			}
			
			if (schema.get) {
				schema_name = schema.get('name');
			}
			
			var that = this;
			that.load_function_information_schema_row(schema_name, specific_name, function(err, res_isr) {
				
				// use the row to create the abstract function object.
				//  a separate module will do the postgres parsing. May make various language and parsing modules.
				//  having automatic parsing would be excellent.
				//   Parsing could be optional, depending on the abstract postgres version?
				//   There could be a version that has parsing (loads the parser).
				//  The parser may wind up being generally useful for different languages.
				//  Probably will have somewhat generic language rules.
				//   Likely to have different functions written for parsing different languages before more gets done declaratively.
				//  Will be fairly simple to write routines to parse the simple postgres code that I have.
				
				// I think JavaScript parsing will be very good too, but likely to use a Crockford made system.
				//  Having a good way of querying collections of functions... will have a functions_analysis module / section of code.
				
				console.log('res_isr ' + stringify(res_isr));
				
				var res = new Abstract.SQL_Function(res_isr);
				
				// parameters don't have names in SQL functions, I think.
				//  The generalised stuff is pretty good here. Less code specific to the projects, project-specific code is more declarative in nature.
				
				
				
				
				that.load_specific_function_abstract_parameters(schema_name, specific_name, function(err, res_abstract_params) {
					
					// setting a collection with an array could have some automatic behaviour that puts it in a collection.
					if (err) {
						
					} else {
						res.set('parameters', res_abstract_params);
						callback(undefined, res);
					}
					
					
				});
				
				
				
				
				
				
			})
			
			
		},
		
		// could be done with fewer calls, loading all functions' rows at once.
		'load_function_information_schema_row': function(schema_name, specific_name, callback) {
			var sel = new Abstract.Select({
				'select_list': '*',
				'from_item': 'INFORMATION_SCHEMA.routines',
				'where': [['specific_schema', schema_name], ['specific_name', specific_name]]
			});
			
			var sql = sel.toString();
			//console.log('sql ' + sql);
			
			this.execute_row_to_callback(sql, callback);
		},
		
		// load function parameters rows
		//  interpret those rows into abstract parameter objects.
		
		
		'load_abstract_functions': function(schema, callback) {
			// will load the information needed to distinguish between functions.
			
			// More middleware to make, but will definitely get these functions and DB facilities working well.
			
			// Having an HTML getting properties to use from the database will work very well,
			//  Pages could be defined using something like XML / ASP.NET as well.
			//  Decent pages will be able to be made quickly on the server, various caching options available too.
			
			
			//  there could be more than one function with the same name.
			//  we'll need to deal with that eventually.
			//  change the way functions are indexed within the collection.
			
			// will get the list of functions, then load them individually.
			
			// The parsing will be fairly complicated, but I think it should be done to have a well-rounded system.
			//  This will make for a powerful tool when editing and using Postgres databases.
			
			// Likely to have a similar system of analysis for other databases.
			//  Being able to identify, model and then use existing programming will be useful.
			//  Could identify functions which do the same thing as abstract generated functions but with different names, and replace them and references to them
			//   with the abstract generated functions.
			// Genaral refactoring when the code system is abstracted.
			
			// Will also be dealing with abstract JavaScript.
			//  May deal with abstract computer languages in general.
			
			// After this, adding rows will be possible using already generated functions that do this.
			var that = this;
			
			that.load_function_specific_names(schema, function(err, res_schema_function_specific_names) {
				
				if (err) {
					
				} else {
					
					// then with these functions, get more information... will be getting the function parameters.
					//  will have the 'specific names' which will be used to get more info about the functions.
					
					console.log('res_schema_function_specific_names ' + stringify(res_schema_function_specific_names));
					
					// and then with the specific names, we load the abstract function from that specific name.
					
					that.load_abstract_functions_from_specific_names(schema, res_schema_function_specific_names, function(err, res_abstract_functions) {
						if (err) {
							
						} else {
							console.log('res_abstract_functions ' + res_abstract_functions);
							console.log('res_abstract_functions ' + stringify(res_abstract_functions));
							
							callback(undefined, res_abstract_functions);
							
						}
						
					});
					
					
					
				}
				
			});
		},
		
		
		'load_abstract_sequences': function(schema, callback) {
			this.load_sequences_rows(schema, function(err, sequence_rows) {
				if (err) {
					
				} else {
					
					// for each sequence row, load an abstract sequence.
					var res = [];
					each(sequence_rows, function(i, sequence_row) {
						var a_seq = new Abstract.Sequence(sequence_row);
						res.push(a_seq);
						
					});
					//return res;
					callback(undefined, res);
					
				}
			})
			
		},
		
		
		// dbi-load-abstract?
		
		'load_table_abstract_pk_constraint': function(schema_name, table_name, callback) {
			console.log('load_table_abstract_pk_constraints');
			console.log('table_name ' + table_name);
			var that = this;
			
			// will only be one PK constraint for the table.
			
			var res;
			
			this.get_table_pk_constraints_rows(schema_name, table_name, function(err, table_pk_constraint_rows) {
				if (err) {
					
				} else {
					var res = [];
					each(table_pk_constraint_rows, function(i, v) {
						
						var constraint_name = v.constraint_name;
						
						
						that.get_constraint_columns(schema_name, table_name, constraint_name, function(err, res_constraint_columns) {
							if (err) {
								
							} else {
								console.log('res_constraint_columns ' + stringify(res_constraint_columns));
								
								if (res_constraint_columns.length == 1) {
									
									res = new Abstract.Table_Constraint.Primary_Key({
										'column_name': res_constraint_columns[0].column_name
									});
								} else {
									throw 'More than one PK constraint column not yet implemented in dbi-postgres.load_table_abstract_pk_constraints';
								}
								
								callback(undefined, res);
								
							}
						})
						
						console.log('constraint row ' + v);
						console.log('constraint row ' + stringify(v));
						
						// really need the column name of the constraint.
						
						var abstract_pk_constraint = Abstract.Table_Constraint.Primary_Key({
							
						});
					});
					
					// it's the callback with res.
					// was calling callback twice and making an error!
					//callback(undefined, res);
					//return res;
				}
			})
			
		},
		
		'load_constraint_column_usage_rows': function(constraint_schema, table_schema, table_name, constraint_name, callback) {
			
			var sel = new Abstract.Select({
				'select_list': '*',
				'from_item': 'INFORMATION_SCHEMA.constraint_column_usage',
				'where': [['constraint_schema', constraint_schema], ['table_schema', table_schema], ['table_name', table_name], ['constraint_name', constraint_name]]
			});
			this.execute_multirow_to_callback(sel.toString(), callback);
		},
		
		'load_table_constraint_row': function(constraint_schema, table_schema, table_name, constraint_name, callback) {
			var sel = new Abstract.Select({
				'select_list': '*',
				'from_item': 'INFORMATION_SCHEMA.table_constraints',
				'where': [['constraint_schema', constraint_schema], ['table_schema', table_schema], ['table_name', table_name], ['constraint_name', constraint_name]]
			});
			
			var sql = sel.toString();
			//console.log('sql ' + sql);
			
			this.execute_row_to_callback(sql, callback);
			
			
		},
		
		'load_abstract_table_constraint': function(schema_name, table_name, constraint_name, callback) {
			// will need to look at more than one table I think, possibly do a query with a join?
			
			// look at the table_constraints
			//  then the column usage to find out which columns the constraint is using.
			
			// could later update the reference to the direct reference to the object.
			
			// use some other functions for more particular interaction with the database.
			
			//var res_atc = new Abstract.Table_Constraint();
			
			var that = this;
			that.load_table_constraint_row(schema_name, schema_name, table_name, constraint_name, function(err, res_constraint_row) {
				if (err) {
					
				} else {
					
					var res_atc = new Abstract.Table_Constraint(res_constraint_row);
					
					// then load the other things, like the column usage.
					
					var cu = res_atc.get('column_usage');
					// then add the columns... will just add them by name for the moment.
					
					that.load_constraint_column_usage_rows(schema_name, schema_name, table_name, constraint_name, function(err, res_ccu_rows) {
						// don't initialize the actual column, this may be found automatically when the value is set through clever background programming.
						
						if (err) {
							
						} else {
							//cu.push()
							
							each(res_ccu_rows, function(i, v) {
								console.log('v.column_name ' + v.column_name);
								cu.push(v.column_name);
							})
							
							callback(undefined, res_atc);
						}
						
					})
					
					
					
					
				}
			})
			
			
		},
		
		'load_table_abstract_constraints': function(schema_name, table_name, callback) {
			
			var that = this;
			
			// load the table constraint names instead.
			
			that.load_table_constraint_names(schema_name, table_name, function(err, table_constraint_names) {
				
				// couls have a collection of constraints as the result
				
				if (err) {
					
				} else {
					var res = [];
					
					// go through each of the table constraint rows, loading the abstract constraint with another function.
					//  loading the abstract constraint will require looking at constraint_column_usage as well to see which column(s) that constraint is using.
					//   just another stage.
					
					
					
					// then the repeat through / callback pattern.
					
					var c = 0, l = table_constraint_names.length;
					
					//console.log('adb_schemas.length ' + l);
					// only do process_schema if there is another one.
					
					//var schemas = abstract_database.get('schemas');
					// Just 1 at a time for the moment.
					// can eventually use a sequential item processor.
					var process_table_constraint = function() {
						//var schema = adb_schemas[c];
						var table_constraint_name = table_constraint_names[c];
						console.log('table_constraint_name ' + table_constraint_name);
						that.load_abstract_table_constraint(schema_name, table_name, table_constraint_name, function(error, load_abstract_table_constraint_res) {
							c++;
							res.push(load_abstract_table_constraint_res);
							if (c < l) {
								process_table_constraint();
							} else {
								callback(undefined, res);
							}
						});
					};
					
					if (c < l) {
						process_table_constraint();
					} else {
						callback(undefined, res);
					}
					
					
					
					
					//each(res_table_constraint_rows, function(i, table_constraint_row) {
						
						// 
						
						
						//var a_constraint = new Abstract.Table_Constrint(table_constraint_row);
						//res.push(a_constraint);
						
						
					//});
					//callback(undefined, res);
				}
				
				
				
				
				
				
			});
			
		},
		
		'load_table_constraint_rows': function(schema_name, table_name, callback) {
			var sel = new Abstract.Select({
				'select_list': '*',
				'from_item': 'INFORMATION_SCHEMA.table_constraints',
				'where': [['table_schema', schema_name], ['table_name', table_name]]
			});
			
			var sql = sel.toString();
			//console.log('sql ' + sql);
			
			this.execute_multirow_to_callback(sql, callback);
		},
		
		'load_table_constraint_names': function(schema_name, table_name, callback) {
			var sel = new Abstract.Select({
				'select_list': ['constraint_name'],
				'from_item': 'INFORMATION_SCHEMA.table_constraints',
				'where': [['table_schema', schema_name], ['table_name', table_name]]
			});
			
			var sql = sel.toString();
			//console.log('sql ' + sql);
			
			this.execute_multirow_single_item_to_array_callback(sql, callback);
		},
		
		
		
		// loading the table info from the db
		'load_abstract_table': function(schema_name, table_name, callback) {
			// get the columns for that table.
			
			// what about getting the postgres data type like serial?
			
			// the whole table structure, loaded from the database, as an Abstract.Table.
			
			// need to get a few things, like the columns.
			//  particularly the columns... only the columns?
			//console.log('');
			console.log('------------------ load_abstract_table ------------------ table_name ' + table_name);
			//console.log('');
			var that = this;
			this.get_columns_information_schema(schema_name, table_name, function(error, info_schema_rows) {
				console.log('info_schema_rows ' + stringify(info_schema_rows));
				console.log('');
				console.log('');
				console.log('get_columns_information_schema done');
				// then with these rows we can create the Column items.
				console.log('');
				console.log('');
				console.log('');
				console.log('3) table_name ' + table_name);
				
				// maybe have a function specifically to load the table's abstract columns.
				
				var table_res = new Abstract.Table({
					'name': table_name,
					'information_schema_column_rows': info_schema_rows
				});
				
				// let's get the info about the constraints that apply to the table.
				
				// need to load the abstract table pk constraints.
				//  middleware needs a lot of interfacing code.
				
				// what about loading all of the table constraints?
				
				
				that.load_table_abstract_constraints(schema_name, table_name, function(err, res_abstract_constraints) {
					if (err) {
						
					} else {
						console.log('');
						console.log('');
						console.log('res_abstract_constraints ' + stringify(res_abstract_constraints));
						
						table_res.set('constraints', res_abstract_constraints);
						
						callback(undefined, table_res);
						
						//table_res.get('constraints').load_array(res_abstract_constraints);
					}
				})
				
				/*
				
				that.load_table_abstract_pk_constraint(schema_name, table_name, function(error, table_pk_constraint) {
					//console.log('');
					//console.log('');
					//console.log('table_pk_constraints ' + stringify(table_pk_constraints));
					
					if (error) {
						
					} else {
						
						
						if (table_pk_constraint) {
							table_res.get('constraints').push(table_pk_constraint);
						}
						
						//console.log('5) table_name ' + table_name);
						//console.log('********* table name: ' + table_res.get('name'));
						
						
						// then we want to get the sequences associated with the table????
						//  I think would just get the names of the associated sequences.
						
						
						
						callback(undefined, table_res);
					}
					
				});
				*/
				/*
				
				this.get_table_pk_constraints_rows(table_name, function(error, table_pk_constraints) {
					console.log('');
					console.log('');
					//console.log('table_pk_constraints ' + stringify(table_pk_constraints));
					
					callback(undefined, table_res);
					
					
				});
				*/
			});
		},
		
		'load_abstract_tables': function(schema, callback) {
			// easier to load a bunch of these in one function,
			//  makes the load_abstract_schema function easier.
			
			// will return all the abstract ables that are loaded, in a collection of tables.
			
			// needs to get the list of all tables.
			
			var schema_name = schema.get('name');
			
			var that = this;
			this.get_table_names(function(err, table_names) {
				if (err) {
					
				} else {
					console.log('table_names ' + table_names);
					
					//this.set('tables', new Collection({
					//	'index_by': 'name'
					//}));
					
					//if (tof(spec.tables) == 'array') {
					//	this.get('tables').load_array(spec.tables);
					//}
					
					
					var res = new Collection({
						'index_by': 'name'
					});
					
					// could fire off the get table info requests simultaneously.
					// May want it so that its doing 6 requests at once.
					
					//var max_simultaneous = 1, num_active = 0, table_names_c = 0, table_names_l = table_names.length;
					
					// Will use a different pattern here for the moment. Similar to when persisting.
					

					//console.log('pre get schemas length');
					var c = 0, l = table_names.length;
					
					//console.log('adb_schemas.length ' + l);
					// only do process_schema if there is another one.
					
					//var schemas = abstract_database.get('schemas');
					// Just 1 at a time for the moment.
					// can eventually use a sequential item processor.
					var process_table = function() {
						//var schema = adb_schemas[c];
						var table_name = table_names[c];
						console.log('table_name ' + table_name);
						that.load_abstract_table(schema_name, table_name, function(error, load_abstract_table_res) {
							c++;
							res.push(load_abstract_table_res);
							if (c < l) {
								process_table();
							} else {
								callback(undefined, res);
							}
						});
					};
					
					if (c < l) {
						process_table();
					} else {
						callback(undefined, res);
					}
					
					
					
					/*
					var table_request = function(schema_name, table_name, callback) {
						console.log('');
						console.log('');
						console.log('');
						console.log('table_request table_name: ' + table_name + ', table_names_c: ' + table_names_c);
						table_names_c++;
						num_active++;
						that.load_abstract_table(schema_name, table_name, callback);
						
						
						
						console.log('');
						console.log('');
						console.log('');
						console.log('table_names_c++');
						
						
						console.log('');
						console.log('');
						console.log('table_request end');
					};
					*/
					
					/*
					
					var table_request_callback = function(err, abstract_table, repeat_callback) {
						// starts the new table request if there are more.
						
						if (err) {
							
						} else {
							num_active--;
							console.log('****** abstract table name ' + abstract_table.get('name'));
							console.log('table_names_c ' + table_names_c);
							console.log('res.length() ' + res.length());
							
							res.push(abstract_table);
							if (table_names_c < table_names_l) {
								table_names_c++;
								var table_name_next = table_names[table_names_c];
								console.log('table_name_next ' + table_name_next);
								
								//table_request(schema_name, table_name_next, repeat_callback);
							} else {
								// all table requests have finished.
								console.log('all table requests have finished.');
								console.log('num_active ' + num_active);
								callback(res);
								
							}
						}
						
						
						
					};
					*/
					/*
					var repeat_cb = function(err, res1) {
						if (!err) {
							console.log('****************** res1 name ' + res1.get('name'));
							
							console.log('cb');
							res.push(res1);
							var i_table_name = table_names[table_names_c];
							console.log('*** table_name ' + i_table_name);
							
							if (i_table_name) {
								
								table_request(schema_name, i_table_name, repeat_cb);
							} else {
								// all tables loaded.
								callback(undefined, res);
							}
						} else {
							
						}
					}
					
					while (num_active < max_simultaneous && table_names_c < table_names_l) {
						console.log('');
						console.log('');
						console.log('');
						console.log('table_names_c ' + table_names_c);
						var i_table_name = table_names[table_names_c];
						//table_names_c++;
						table_names_c++;
						console.log('');
						console.log('');
						console.log('');
						console.log('*** table_name ' + i_table_name);
						table_request(schema_name, i_table_name, repeat_cb);
					}
					*/
					
				}
			})
			
			
			
		},
		
		'load_abstract_schema': function(schema_name, callback) {
			// will need to get quite a few pieces of information about the schema.
			
			// tables, functions, some more things too I'm sure like views.
			//  tables and functions will be very useful to begin with.
			
			
			var res = new Abstract.Schema({
				'name': schema_name
			});
			var that = this;
			// will then need to initialize them as abstract objects.
			
			// after this, an abstract schema could be examined to see which functions are used for adding data, removing data etc.
			//  analysis of the abstract database could be done before the application carries out an operation on the actual database.
			
			// The abstract database will provide a more controlled interface.
			//  Will make things a lot easier when dealing with different database types.
			// This system is requiring quite a lot of code, but its working out to be nicely modular.
			//  Will be very important for rapidly putting functionality into place.
			//  Want setting up the website itself to take just a few minutes by giving the correct configuration.
			
			// The website itself should be up and running in seconds. The setup script won't take long.
			//  Want this to be able to run my website, and the music website soon.
			// Dealing with login and managing content being one of the main things to do.
			//  The content will be relatively easily editable files / fragments that get put together.
			// Also a file browser system.
			//  Will be useful for uploading music albums.
			//   Music files will be published, will have JSON listings from the music publishing service
			//   Front-end will access the music service, play various files etc.
			//   Maybe pay to download albums. Could be convenient downloading, a single ZIP file with all the music.
			//    
			
			// should really be calling things in a sequence, loading the abstract tables, sequences and functions.
			
			this.load_abstract_tables(res, function(err, res_abstract_tables) {
				if (err) {
					
				} else {
					console.log('res_abstract_tables ' + res_abstract_tables);
					
					// adding a collection to a collection.
					//  don't want to push - that puts the collection in as one object.
					//  collection will have more array-like interactions.
					
					res.set('tables', res_abstract_tables);
					
					// have the table, now need to get the functions.
					
					// loading a bunch of functions at once.
					
					//  the functions could have metadata about which tables they refer to.
					//  loading the functions with parsing will be harder
					//   I think it would be worth doing, partly to be cool, partly to be complete.
					//   Would basically need to re-write in JavaScript. Could possibly put it in the abstract section or
					//    in the parse-abstract or parse-postgres section
					
					// I think this is important for exploring the function to see which tables etc get referenced through which instructions.
					//  This information could be very useful in a GUI when there is a large amount of functions.
					//   Could view/select all functions that insert data in one table (directly or through function calls)
					
					// These abstract functions will be referred to on the server side to see what they do in order to use them.
					//  Perhaps this is part of AI, using a further abstraction to be a disconnected model that can be manipulated outside of the database.
					//  Brings it closer to how a brain operates, perhaps closer to (a model of) conciousness.
					
					// Function analysis will be very useful for ensuring the necessary functions are there / finding them
					//  and for calling them easily when asked to do so by the application layer.
					
					
					that.load_abstract_functions(res, function(err, res_abstract_functions) {
						if(err) {
							
						} else {
							console.log('res_abstract_functions ' + res_abstract_functions);
							
							res.set('functions', res_abstract_functions);
							
							callback(undefined, res);
							
						}
					});
					
					
					
					
					
					
					
				}
				
			});
			
		},
		

		// An ensure_table function may be easier to use, but the Abstract Tables are useful in generating the SQL.


		
		'ensure_abstract_table': function(abstract_table, callback) {
			// some tables could depend on others.
			
			// may want to group them,
			// may want to do them individually.
			
			// eg users table refers to the roles table.
			
			
			// Maybe should also modify an existing table if it is given such a table.
			//  Validate all the columns to see that they are right.
			//  Change them if appropriate.
			//  Though maybe a more advanced abstract system that knows what changed would be better, such as with renaming columns.
			
			// Will not wanting to be deleting the db too much when there is content inside.
			//   perhaps changes could be recorded somewhere.
			
			
			// needs to do something!
			
			// check if the table is there or not.
			
			var that = this;
			
			that.table_exists(abstract_table, function(error, te_res) {
				
				if (!error) {
					
					//console.log('te_res ' + te_res);
					
					if (te_res) {
						// check all rows?
						
						// determining row renames may be hard.
						//  better for this to be done with commands or a GUI.
						
						// adding rows may be easier, especially when there are n fewer rows in the db than in the source.
						callback(undefined, true);
						
					} else {
						// creating the table may be easier
						
						var sql = abstract_table.get_create_statement();
						//console.log('sql' + sql);
						that.s_query(sql, function(err, ct_res) {
							if (!err) {
								callback(undefined, true);
								
							}
						})
					}
				}
			});
		},
		
		'ensure_abstract_function': function(abstract_function, callback) {
			var sql = abstract_function.to_create_or_replace_str();
			console.log('sql ' + sql);
			
			// nice, seems to work so far.
			
			this.s_query(sql, callback);
			
			
		},
		
		'ensure_abstract_schema': function(abstract_schema, callback) {
			
			// to begin with, will process this sequentially.
			//  have a list of the tables.
			
			// have a process_next callback.
			
			// later, could go into updating the tables or checking the fields.
			
			// or rather do it with the first.
			
			//console.log('abstract_schema.tables ' + stringify(abstract_schema.tables));
			
			// have a list of tables to go through in order.
			
			// ensure each one individually, waiting for the response.
			
			//var c = 0, l = abstract_schema.tables.length;
			var that = this;
			
			
			// there will be more...
			//  views will be another fairly important one.
			
			var fns = abstract_schema.get('functions');
			
			var process_functions = function() {
				var c = 0, l = fns.length();
				//console.log('l ' + l);
				//throw('stop');
				
				var process_function = function() {
					
					//console.log('process_function');
					
					var fn = fns.get(c);
					that.ensure_abstract_function(fn, function(err, eaf_res) {
						if (err) {
							var stack = new Error().stack
							console.log( stack )
							
							throw err;
						}
						
						if (!err) {
							c++;
							if (c < l) {
								process_function();
							} else {
								callback();
							}
						}
					})
				};
				
				if (c < l) {
					process_function();
				} else {
					callback();
				}
				
			};
			
			
			
			// need to ensure the schema itself exists.
			//  then change to that schema too.
			
			var process_tables = function() {
				var tables = abstract_schema.get('tables');
				//console.log('tables ' + stringify(tables));
				var c = 0, l = tables.length();
				
				var process_table = function() {
					//console.log('process_table');
					var table = tables.get(c);
					
					that.ensure_abstract_table(table, function(err, eat_res) {
						if (!err) {
							c++;
							if (c < l) {
								process_table();
							} else {
								process_functions();
							}
						}
					});
				}
				if (c < l) {
					process_table();
				} else {
					process_functions();
				}
			};
			
			var has_schema = function() {
				// set the schema path to that?
				that.set_schema_search_path(abstract_schema.get('name'), function(error, qr) {
					if (!error) {
						// then we ensure the items in the schema.
						
						process_tables();
						
						
						
					} else {
						console.log('error ' + error);
					}
				});
				
			};
			
			
			that.schema_exists(abstract_schema.get('name'), function(error, qr) {
				if (!error) {
					if (qr) {
						has_schema();
					} else {
						that.create_schema(abstract_schema.get('name'), function(error, qr) {
							if (!error) {
								has_schema();
							}
						});
					}
					
				}
			});
			
			
			
			
			
			
			//each(abstract_schema.tables, function(i, table) {
			//	
				
				
			//});
			
			
			
			// ensuring more than one abstract thing at once...
			
			//  need to do this in thr right order, regarding dependancies.
			
			
			
			// Will the abstract schema have various CRUD functions already made?
			
			// every table
			//   sequentially?
			//   will want to wait for some of them.
			
			// or put a lot of sql together that handles the tables in the correct order.
			//  Maybe the Abstract schema 
			
			
			
			
			// every function
			
			
			
			
		},
		
		
		// May have dbi-persist-abstract?
		//  It's not really core to dbi
		//  It uses dbi features
		//  Its a link to the abstract functionality.
		
		
		
		// Not bad... will ensure the source database is in the system quickly.
		'ensure_abstract_database': function(abstract_database, callback) {
			// May need to reconnect to that database as well.
			
			// not using the current connection?
			//  should probably make it do so before now. - except we can't!
			
			console.log('');
			console.log('');
			console.log('ensure_abstract_database abstract_database ' + abstract_database);
			
			// will require going through the schemas...
			
			// first of all, see if there is the database in the system.
			
			var that = this;
			var adb_name = abstract_database.get('name');
			console.log('adb_name ' + adb_name);
			var connected = function() {
				// Now we are connected to the right DB.
				// Check that all the schemas exist. Will require having a list of the schemas, and using a process_next type callback.
				
				console.log('connected');
				
				var adb_schemas = abstract_database.get('schemas');
				//console.log('adb_schemas ' + stringify(adb_schemas));
				//  can not stringify the schemas yet.
				
				// can have a length property as a number.
				//  but maybe a function would work better in general.
				
				console.log('pre get schemas length');
				var c = 0, l = adb_schemas.length();
				
				console.log('adb_schemas.length ' + l);
				// only do process_schema if there is another one.
				
				//var schemas = abstract_database.get('schemas');
				
				var process_schema = function() {
					//var schema = adb_schemas[c];
					var schema = adb_schemas.get(c);
					console.log('schema ' + schema);
					that.ensure_abstract_schema(schema, function(error, eas_res) {
						c++;
						if (c < l) {
							process_schema();
						} else {
							callback();
						}
					});
				};
				
				if (c < l) {
					process_schema();
				} else {
					callback();
				}
			};
			
			that.database_exists(adb_name, function(error, db_exists) {
				console.log('database_exists done');
				if (!error) {
					if (db_exists) {
						// is it the current db_name?
						
						if (adb_name !== that.db_name) {
							// need to reconnect.
							that.db_name = adb_name;
							that.reconnect(connected);
						} else {
							connected();
						}
						
						
					} else {
						console.log('about to create db');
						that.create_database(adb_name, function(error, create_db_res) {
							if (!error) {
								that.db_name = adb_name;
								that.reconnect(connected);
							}
						});
					}
				}
			});
		},
		
		
		// could use fp.
		'execute_query': function(query_spec) {
			//  not wanting (query_spec)
			//  better to have error, callback.
			//  not so likely to not want the whole thing in memory.
			//  could possibly check to see if its given a bunch of callbacks...
			
			
			
			
			
			// a connected function...
			//  if there is no client, then it needs to connect.
			//  maybe can only really be done when there is a callback function.
			
			
			
			
			
			
			// execut a query specified as an object???
			var query;
			if (tof(query_spec) == 'object') {
				// and does it have the sql or the text?
				
				if (query_spec.sql) {
					query = this.client.query(query_spec.sql);
					//console.log('sql ' + query_spec.sql);
				} else if (query_spec.query) {
					query = this.client.query(query_spec.query);
					//console.log('sql ' + query_spec.query);
				}
			}
			
			if (query) {
				if (is_defined(query_spec.row)) {
					query.on('row', query_spec.row);
				}
				if (is_defined(query_spec.error)) {
					query.on('error', query_spec.error);
				}
				if (is_defined(query_spec.end)) {
					query.on('end', query_spec.end);
				}
			} else {
				throw 'Query ' + stringify(query) + ' could not be executed.';
			}
			//var query = this.client.query(query_spec.sql);
			//query.on('row', query_spec.row);
			
			
			
		},
		
		'execute_function': function(fn_name, params, callback) {
			
			console.log('fn_name ' + stringify(fn_name));
			
			
			// what about executing an abstract function?
			//  It seems like maybe this should be the code to do it.
			
			//  Could take params (set from) the abstract function?
			
			if (tof(fn_name) != 'string') {
				if (fn_name.name) {
					fn_name = fn_name.name;
				} else {
					throw 'fn_name type not recognised';
				}
				
			}
			
			
			
			
			// params could be in various forms.
			
			// name, value pair,
			//  just the values.
			
			// perhaps more params could be given in the arguments list.
			
			// run a select statement and execute that.
			//  select a function call.
			//  may want to put function call into the select statement.
			
			// use a select statement.
			
			// a select statement that calls the function, with parameters.
			
			// think we need an Abstract.Function_Call item.
			//  can be used as a from_item in a select statement.
			
			
			// could say params = 4?
			
			//console.log('a) params ' + stringify(params));
			var values = [];
			if (tof(params) == 'string') {
				params = [params];
			}
			
			// the function call is the from_item.
			var sel = new Abstract.Select({
				//'from_item': 
				// the from item is a function call.
				
				'from_item': new Abstract.Function_Call({
					'function_name': fn_name,
					'parameters': params.length
				})
				
			});
			
			var sql = sel.toString();
			//console.log('sql ' + sql);
			
			//client.query({
			//	  name: 'insert beatle',
			//	  text: "INSERT INTO beatles(name, height, birthday) values($1, $2, $3)",
			//	  values: ['George', 70, new Date(1946, 02, 14)]
			//	});
			
			
			//console.log('b) params ' + stringify(params));
			//each(params, function(i, param) {
				//console.log('param ' + stringify(param));
				//values.push();
			//});
			
			var query = {
				'query': {
					'text': sql,
					'values': params
				},
				'row': function(row) {
					console.log('row ' + stringify(row));
				},
				'error': function(error) {
					console.log('error ' + stringify(error));
				},
				'end': function(end) {
					callback();
				}
				
			};
			
			// then execute the query.
			this.execute_query(query);
			
		},
		
		// Perhaps the query should be limited.
		's_query': function(sql, callback) {
			var res, that = this, first = true;
			this.execute_query({
				'sql': sql,
				'row': function(row) {
					//console.log('s_query row ' + stringify(row));
					//res = row;
					if (first) {
						// turn the row to an array.
						// map_values
						arr_row = arrayify(row);
						//console.log('arr_row ' + stringify(arr_row));
						res = arr_row[0][1];
						first = false;
					}
				},
				'end': function() {
					callback.call(that, undefined, res);
				},
				'error': function(error) {
					console.log('s_query ' + error);
					callback.call(that, error);
					
				}
			});
			
			
		},
		
		'execute_multirow_single_item_to_array_callback': function(sql, callback) {
			// will get the keys from the row?
			
			var res = [], that = this;
			
			
			this.execute_query({
				'sql': sql,
				'row': function(row) {
					//console.log('get_sequence_names exists row ' + stringify(row));
					//res = row;
					res.push(arrayify(row)[0][1]);
				},
				'end': function() {
					callback.call(that, undefined, res);
				},
				'error': function(error) {
					
					// error if the schema already exists.
					//  not sure about throwing a JavaScript error - they are not that useful
					
					// May have a way of indicating the query has ended with an error.
					
					// Could maybe return it as parameter 0 all the time.
					//  Maybe return a query_result object
					//  array: [error, result]
					
					// [undefined, true]
					// [error, undefined]
					console.log('execute_multirow_single_item_to_array_callback ' + error);
					callback.call(that, error);
					
					
					
					// however, this means an error in the SQL.
					//  May not want SQL errors going outside of here so much.
					
					
				}
			});
		},
		
		'execute_row_to_callback': function(sql, callback) {
			// only returns the first row.
			var that = this;
			that.execute_multirow_to_callback(sql, function(err, res) {
				if (err) {
					callback(err);
				} else {
					if (res.length == 1) {
						callback(undefined, res[0]);
					} else {
						throw 'Expected just one row';
					}
				}
			});
		},

		// execute_multirow_to_callbacks
		// execute_to_row_callbacks
		//  however, there may need to be a normal callback for errors.
		//  the main callback will also be called when it's complete.

		// (param, row_callback, callback);

		'execute_to_row_callbacks': function(sql, row_callback, callback) {
			var that = this;
			var row_count = 0;
			this.execute_query({
				'sql': sql,
				'row': function(row) {
					//console.log('get_sequence_names exists row ' + stringify(row));
					//res = row;
					//res.push(row);
					row_count++;
					row_callback(null, row);
				},
				'end': function() {
					callback.call(that, null, {
						'row_count': row_count
					});
				},
				'error': function(error) {
					
					// error if the schema already exists.
					//  not sure about throwing a JavaScript error - they are not that useful
					
					// May have a way of indicating the query has ended with an error.
					
					// Could maybe return it as parameter 0 all the time.
					//  Maybe return a query_result object
					//  array: [error, result]
					
					// [undefined, true]
					// [error, undefined]
					console.log(error);
					callback.call(that, error);
					// however, this means an error in the SQL.
					//  May not want SQL errors going outside of here so much.
					
				}
			});
		},



		
		'execute_multirow_to_callback': function(sql, callback) {
			var res = [];
			var that = this;
			
			//console.log('');
			console.log('execute_multirow_to_callback sql: ' + sql);
			//console.log('');
			
			this.execute_query({
				'sql': sql,
				'row': function(row) {
					//console.log('get_sequence_names exists row ' + stringify(row));
					//res = row;
					res.push(row);
				},
				'end': function() {
					callback.call(that, undefined, res);
				},
				'error': function(error) {
					
					// error if the schema already exists.
					//  not sure about throwing a JavaScript error - they are not that useful
					
					// May have a way of indicating the query has ended with an error.
					
					// Could maybe return it as parameter 0 all the time.
					//  Maybe return a query_result object
					//  array: [error, result]
					
					// [undefined, true]
					// [error, undefined]
					console.log(error);
					callback.call(that, error);
					// however, this means an error in the SQL.
					//  May not want SQL errors going outside of here so much.
					
				}
			});
		},
		
		
		// could be an abstract function
		//  or abstract generation. abstract-postgres-gen?
		//  extends the normal abstract?
		
		
		// May want to ensure an abstract schema is in the db
		//  Abstract table, etc.
		// Ensure abstract functions are in the db
		
	});
	
	
	// maybe this will just be in the dbi-postgres section.
	//var generate_abstract_schema_crud = 
	
	
	
	DBI_Postgres.deploy_local = function(abstract_postgres_db, username, initial_data, callback) {
		// 'deploy will overwrite the existing db'
		console.log('');
		console.log('--------------deploy_local-------------');
		
		var dbip_local = new DBI_Postgres({
			'port': 5432,
			'username': username,
			'host': '127.0.0.1',
			'db_name': 'postgres'
		});
		
		dbip_local.connect(function(_dbip_local) {
			console.log('postgres db connected.');
			
			// now connected to the main postgres db, find out if the required db exists.
			
			adb_name = abstract_postgres_db.get('name');
			console.log('adb_name ' + adb_name);
			
			// ensure_no_db - if the db exists, deletes it.
			
			dbip_local.ensure_no_db(adb_name, function(err, no_db_res) {
				// the database should have been removed, ready for redeployment.
				
				dbip_local.ensure_abstract_database(abstract_postgres_db, function(err, ens_abs_db_res) {
					console.log('ens_abs_db_res ' + ens_abs_db_res);
					
					dbip_local.load_data_to_tables(initial_data);
					
					
				});
				
			});
			
			
		});
		
	};
	
	//DBI_Postgres.Abstract = Abstract;
	//DBI_Postgres.CRUD = CRUD;
	//DBI_Postgres.create_function_check_record_existance = create_function_check_record_existance;
	//DBI_Postgres.generate_abstract_schema_crud = generate_abstract_schema_crud;
	
	return DBI_Postgres;
	
	//return jsgui;
	
});