// This would greatly benefit from being split up, but the circular references could be a bit of a problem?
//  http://stackoverflow.com/questions/4881059/how-to-handle-circular-dependencies-with-requirejs-amd


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// Used to represent a database.
//  Want a class for a domain model as well.

// Domain model gets created, then that gets used to create database models.
//  Possibly domain model -> Abstract RDB -> Abstract Postgres

// I think a user interface to specify the domain model would help a lot...
//  but then I'd want to use resources etc to save it.

// Perhaps making authentication without all the ORM.
//  The ORM project seems big, it may be best to put that on hold for the moment.

// Get the more basic service / platform set up, it can specifically use Postgres / Mongo / whatever.
//  Should be relatively simple components that can be swapped with more complex ones.

// Naming of them... they won't exactly be THE classes to do this, but maybe earlier versions.
//  Name them sensibly and then replace in the future.



define(["../../../core/jsgui-lang-enh"], function(jsgui) {
	
	// This could be used on the client too.
	
	// Likely to shift to DataObject...
	//  May have possibilities with tracking changes better.
	//  If an object gets changed within the DataObject it may work well for MVC patterns.
	//  Maybe in an editing application on the client could track that change on the client, and send it as an update to the server.
	
	// Or would deal with the columns in a db as a collection better.
	//  And when a column gets added or removed in the abstract model, other programmatic items such as generators could be told.
	//  So that functions that refer to that column could get changed too.
	
	
	// OK... think Abstract would be much improved through the use of DataObject.
	//  Have a DB, want to set a schema.
	//  Could use an 'ensure' function.
	
	// 25/02/11 Probably does not need so much more code right now.
	//  Could perhaps benefit from different ways of storing collections of things.
	//  Like the list of tables, stored as a collection.
	//  These collections should provide more convenient indexing.
	//   Also, a generator system would be able to listen for events from these collections and objects within them.
	
	
	// Postgres could have a different abstract model to many databases?
	//  Schema being like a database but things can get shared between schemas within the same database.
	//  Don't really want to restrict it too much.
	
	// Could maybe translate an abstract DB to a Postgres schema.
	
	
	// And then an abstract database translating to an abstract relational database.
	//  The db is like the rdb except the link tables are not defined.
	//  The relationships, such as one-to-many etc do get defined.
	// Editing this with UML in the browser would be very good.
	
	// Edit UML in a nice GUI, get the SQL code that is used to set up that databases in a number of different languages.
	//  Possibly automatically deploy it to cloud services.
	
	
	// For the moment, need to write code! on the execution path as well.
	//  I do like how resources are turning out so far.
	
	// I think more should be done on the database / abstract database system first.
	
	// An abstract wrapper around Postgres?
	// Or deal just with an abstract (probably advanced) database, and have it then translated to Postgres?
	//  I prefer making the abstract db, then generating the abstract RDB, then abstract Postgres DB, then persisting that, while still being able to
	//   use the original abstractions (which could be quite simple).
	
	// Once this has been done, more functionality such as authentication providers should be made.
	//  These will make use of the database abstraction layers so that they will focus on the logic, but also definitions of the logic that get given
	//   to the database abstration layers for them to implement and provide. 
	
	
	var Data_Object = jsgui.Data_Object;
	var Collection = jsgui.Collection;
	// The Data_Object may have a few more features added to it.
	// Receiving and sending on event bubbling
	// Other use of a heirachy.
	// Parent objects.
	// Structure.
	// Having this structure, and knowing the parent, would be useful for many things, including event bubbling.
	//  And there may be collections within it 
	
	// This will not have parsing, though that is a part of abstract postgres.
	//  Maybe make this abstract-postgres-core
	//  abstract-postgres-parsing
	//  and abstract-postgres then loads them both together.
	
	
	var Class = jsgui.Class, arrayify = jsgui.arrayify, fp = jsgui.fp, is_defined = jsgui.is_defined;
	var tof = jsgui.tof, is_defined = jsgui.is_defined, each = jsgui.eac, stringify = jsgui.stringify, arrayify = jsgui.arrayify, mapify = jsgui.mapify;
	var get_item_sig = jsgui.get_item_sig;
	
	var Abstract = {
		
		// Could make things data objects.
		
		//  That could lead to better reporting of updates within a heirachy.
		//  Could lead to better systems of collections (possibly).
		
		// Not so sure about the whole nested data system here (that's quite big at the moment)
		// Want to use something that makes collections work a bit better.
			
		// There will be named items.
		
		// Possibly lists of function calls. Linked lists may be good for removal there.
		//  But that may be more in responding to events.
			
		
		// Currently, these are very much to do with generating the SQL representing them.
		
			
		// Postgres abstract external resources...
		//  A database connection.
		//  Can be connected to a DB using a connector object.
		
		// 'External_Resource' -- Could be a database? A cluster?
		//  Maybe having it represent the server is best.
		//  Could possibly have abstract external resources for both the server and the databases - perhaps even tables in the databases.
		//   Functions in the database would be a nice thing to treat as an external resource that can be accessed using a familiar API.
			
		// Database_Resource
		// Server_Resource
		
		// Not SO sure they all should go in here.
		//  These abstract resources are not part of the Postgres spec.
		// Could have another abstract-postgres-resources module for these references to Postgres resources.
		
		
			
			
			
			
			
			
			
			
			
			
		
		// May want to represent these things as resources too.
		//  Not so sure about making these more complicated, and specific objects work that way.
		// However, it seems right with the 'Database' class doing much to define what a Database is.
		//  Perhaps we can get the abstract information from a search for resources.
		// I think it does make sense to use these abstract objects to represent resources that are available.
		//  A system within the app could index these various abstract objects that are available as resources.
			
		// Abstract_Resource.extend?
		//  But its very nice to keep this abstract postgres thing a bit separate here.
		//  Merging it with code that identifies resources may make this Abstract-Postgres code harder to use by itself.
			
		// Don't want resource specific code here at least.
		// May have Abstract_Resource_Wrapper.
			
		// Application system uses the External_Resource_Finder or Machine_Resource_Finder, a Resource_Finder class
		//  The Abstract_Resource gets found.
			
		// I think I'll write specific code for the specific Abstract_Resources.
		//  It does not need to hold the whole structure of the thing.
		//   Though knowing which functions there are, with which parameters may help.
		// Having the Abstract_Resource hold all the info of the abstract object may help.
		//  Don't think Abstract Objects get identified so much by their location - but perhaps they could be.
		//   That could be useful when working on configurations of different servers.

		'Database': Data_Object.extend({
			'init': function(spec) {
				this._super(spec);
				
				this.set('name', spec.name);
				
				//this.name = spec.name;
				
				
				// will have a collection of schemas.
				
				// maybe these should also be indexed ordered items.
				
				// probably just an array though.
				//  could easily be a dict.
				
				// but with the schemas as a collection, not just an array?
				
				// Don't know what sort of schema collection really.
				
				//  May want more control over these operations?
				
				// set will set the 'parent' properties of those objects within it.
				//  like schema.
				
				// also, if given arrays, may wrap them in a collection.
				//  there could be a collection that operates just like an array, but notifies of items being added / removed / operations being done, through bubbling.
				
				// Thinking about incorporating backbone.js though (or not).
				
				// The backbone collections seem very advanced.
				
				// The collection here will probably take the index property of 'name'.
				//  so the items will be available by name.
				//  it will be possible to push items into the collection too.
				// The collection won't actually be an array, to avoid confusion.
				//  Perhaps it actually could be an array.
				// I think it will probably just contain an array and do some other things too.
				
				// Augmenting arrays would work though.
				//  Need to know the parent in the heirachy.
				//  Need to be able to bubble these events, perhaps have events bound themselves.
				
				
				
				// the schemas could be a collection.
				//  want the collection to be indexed using a dict.
				//  nothing too complicated there, but should work this out as a lang-feature.
				// indexed by the unique 'name' property.
				//  Primary index.
				//   This means that collection.get(item_name) will work.
				//   Make sure this works with test_lang_features.
				
				
				// there may not be schemas in the spec.
				//  maybe should create a new collection of schemas.
				
				
				
				// a collection of schemas, indexed by name.
				// set up the collection of schemas.
				//  load any from the spec.
				// schemas.get(schema_name) will work.
				
				/*
				 * var coll_presidents = new jsgui.Collection({
					'index_by': 'name',
					// this should set the primary unique index.
					
					
					
					'items': arr_presidents
				}); */
				 
				
				this.set('schemas', new Collection({
					'index_by': 'name'
				}));
				
				if (tof(spec.schemas) == 'array') {
					this.get('schemas').load_array(spec.schemas);
				}
				
				//this.set('schemas', spec.schemas || []);
				
				//this.schemas = spec.schemas;
				
				
			}
		}),
		
		
		// Although this does not contain the code that interfaces with the database,
		//  this maybe should contain much of the SQL generation,
		//  this may get used by the client within a browser.
		// May want to generate plenty of SQL, such as SQL that creates a whole bunch of tables.
		
		
		
		// DataObject could use some kind of indexing system.
		
		// Or there be objects with indexes inside.
		
		// Not just the normal map.
		//  For example, with tables, need to preserve the order as well as get by name.
		//  With functions, need to allow overloading, so the name could hold a small collection of functions itself.
		//   That could be a collection then a dict.
		
		// However, the function signatures may need to be represented with more information and be indexed more comprehensively.
		
		// Want to be cautious about introducing new data structures here, but want to continue to have this work effectively.
		
		
		
		
		'Schema': Data_Object.extend({
			'init': function(spec) {
				// schemas have collections of other things.
				this._super(spec);
				// right now will just use arrays.
				
				// Likely to have some other MVC database representation for the client.
				//  Responding to updates, actually handling data updates with the client
				//  with authentication and authorization done.
				
				// just an array of tables...
				//  may want them indexed as well
				//  and then may find that an indexed_collection is actually simpler.
				
				// could just have a dict of databases.
				
				//this.name = spec.name;
				this.set('name', spec.name);
				// could possibly handle the tables collection differently.
				//  not completely sure how data_item would solve that.
				
				//  even when not doing nested properties, could there be collection properties available?
				
				// or maybe just create the collection for the moment.
				//  tables could be uniquely named.
				//  functions are not. they are unique with the name and the signature.
				
				
				
				
				
				
				// table could be represented as a map without too much difficulty.
				//  could have an index of tables.
				
				// the nested data system could prove useful here... but it is a large system to use.
				
				
				// what about getting something so that properties can have types?
				//  perhaps nested could use that type system too?
				
				// nested could be used for setting things in greater depth, however.
				//  it would get more complicated.
				
				// DataObjects I think.
				
				// I think non-nested, or not very nested...
				//  But I also think being able to set something, giving it an array, but it buts it into a more advanced collection.
				
				
				
				
				
				
				// tables should also be a collection.
				//  tables will be unique by name.
				
				// Moving over to the Collections methodology should make it easier to use this module.
				//  The code may become more bulky, but will be more flexible to use.
				//  Will be able to do tables.get[name], and they still get held in the order in the array.
				//  The order of the tables is relevant when persisting things.
				
				
				
				
				// create a new collection for the tables.
				//  have them indexed by name.
				
				
				
				
				//this.tables = spec.tables || [];
				//this.set('tables', spec.tables || []);
				
				// may be best to have the tables be a collection so that it can be get or set when a new one is put in.
				
				this.set('tables', new Collection({
					'index_by': 'name'
				}));

                // Then when a table is added to that collection, it should index it properly.
				
				if (tof(spec.tables) == 'array') {
					this.get('tables').load_array(spec.tables);
				}

                if (spec.database) {

                    // Throw an error if the spec abstract database already contains a schema with the same name
                    //  (and it is not this abstract schema?)


                    this.set('database', spec.database);

                    var database_schemas = spec.database.get('schemas');
                    console.log('database_schemas.length()', database_schemas.length());

                    var existing_schema = database_schemas.get(spec.name);
                    if (existing_schema) {
                        //console.log('existing_schema', stringify(existing_schema));
                        console.trace();
                        throw 'Not expecting existing schema';
                    } else {
                        database_schemas.push(this);
                    }



                    // Can also check the database to see if it contains the abstract schema.

                    // if it does not have it, push

                }
                // So the abstract schema can link back to the database.
				
				
				
				// function collection - need to be able to keep track of functions of the same name but with different signatures.
				//  when there are functions of the same name but different sigs, a map could be put in place.
				
				
				
				// May want to index functions by their signatures.
				
				
				//this.functions = spec.functions || [];
				//this.set('functions', spec.functions || []);
				this.set('functions', new Collection({
					//'index_by': 'specific_name'
				}));
				
				if (tof(spec.functions) == 'array') {
					this.get('functions').load_array(spec.functions);
				}
				
				
				// The functions could be in a collection that indexes them by name and signature.
				//  Probably not right now though.
				
				// the function index could be more difficult.
				
				
				
			}
		
		
		
		
		
			// Functions within schema?
		
			// Other functions will ensure that abstract things have been represented.
		
		
		
		}),
		
			
		// May want to model things like a schema or function as well.
			
		// And database?
		
		// The language of the function will vary depending on how it's used.
		//  Different return types.
			
		// Will want to use PL/pgSQL when returning a table.
		
		// SQL may be OK for single rows.
		
		/* CREATE FUNCTION getQtyOrders(customerID int) RETURNS int AS $$
DECLARE
qty int;
BEGIN
SELECT COUNT(*) INTO qty
FROM Orders
WHERE accnum = customerID;
RETURN qty;
END;
$$ LANGUAGE plpgsql;

Read more: http://www.eioba.com/a/1ign/a-basic-introduction-to-postgres-stored-procedures#ixzz1m4S3TM8m */
			
		// Postgres is flexible, need to make it easy to use the right language.
		// Could return a set of results
		// Could return a single result
		// Could return nothing.
			
			
		// Could have both SQL_Function and PGSQL_Function.
		//  This would work fairly well, not being confusing about which gets written.
			
		// Assign the parameter and return types, give it enough info, and it makes the function.
		//  Will use statements that refer to parameters.
			
			
			
		// To begin with, an SQL function will be enough for inserting one record.
		
		//  Executing one of these functions should not be too hard to do.
		//   I think other code that uses node-postgres will do the execution.
		
		// Possibly need to make a pg/Sql function
		//  They are apparrantly slower.
		
		// Do want that overloading.
		//  Thinking about how it can be done with just SQL,
		//  especially for insert statements.
		// Could do lookups in JavaScript... may work fairly well.
		
		// Think we do need plpgsql functions.
		//  Will be able to do more.
		//  The function using variables and looking up values into variables makes sense.
		
		// caching some things in memory?
		
		// Perhaps an abstract database could make the script to create it?
		//  Ensuring an existing database matches it is more complicated though.
		//  Carrying out changes to the existing database.
		
		
		
		// These are a bit complicated.
		//  May make them out of the rows from the INFORMATION_SCHEMA.
		
		// Not completely sure how the functions should be indexed.
		//  Possibly by specific_name, possibly name and signature.
		//  The indexing system could be enhanced to accommodate this, but that could be done later.
		
		
		'SQL_Function': Data_Object.extend({
			'init': function(spec) {
				// Function Parameters
				// Function body
				
				this._super(spec);
				
				
				if (spec.specific_schema && spec.specific_name) {
					this.load_from_information_schema_row(spec);
				} else {
					
					
					this.set('name', spec.name);
					// will have a specific_name too, maybe won't be set by the user.
					
					
					//this.arguments = spec.arguments;
					//  sql function could have a collection of parameters.
					//  That could make indexing them easier, perhaps could have index of functions available by params.
					//  will do that before so long.
					
					
					//this.set('parameters', spec.parameters || spec.params || []);
					
					this.set('parameters', new Collection({
						//'index_by': 'name'
					}));
					
					if (tof(spec.parameters) == 'array') {
						this.get('parameters').load_array(spec.parameters);
					}
					
					var params = this.get('parameters');
					console.log('init params ' + stringify(params));
					console.log('init spec.parameters ' + stringify(spec.parameters));
					//this.parameters = spec.parameters || spec.params || [];
					//this.statements = spec.statements || [];
					
					//this.set('statements', spec.statements || []);
					
					this.set('statements', new Collection({
						//'index_by': 'name'
					}));
					
					if (tof(spec.statements) == 'array') {
						this.get('statements').load_array(spec.statements);
					}
					
					// the normal SQL language runs faster though.
					//  Should be fine for insert statements.
					
					//this.return_type = spec.return_type;
					
					this.set('return_type', spec.return_type);
					
					//this.language = spec.language || 'SQL';
					//this.language = 'SQL';
					
					this.set('language', 'SQL');
				}
				
				// Could be composed of statements that get put together, or just text.
				//this.name = spec.name;
				
				
				// think SQL does not do named parameters.
				//  just does them in an order I think.
				
				
				//this.ret = spec.ret || null;
				
				// could have a function body
				// maybe the function body could be a collection of statements.
				
				// We'll want functions for CRUD.
				
				
				// statement : could be pieces of Postgres SQL language, pieced together.
				//  won't be so hard to model these objects, but there may be quite a few of them for this interface.
				
				//this.body = spec.body;
				
			},
			
			'load_from_information_schema_row': function(information_schema_row) {
				//console.log('load_from_information_schema_row ' + stringify(information_schema_row));
				
				// set the values from spec.
				
				// perhaps only set the properties we need, and with the right names.
				
				//this.set(information_schema_row);
				this.set('schema', information_schema_row.specific_schema);
				this.set('specific_name', information_schema_row.specific_name);
				this.set('name', information_schema_row.routine_name);
				// can be updated with the actual schema, possibly could respond to event to do that.
				
				// quite a bit of metadata here from the INFORMATION_SCHEMA, will leave much of this for the moment.
				//  some of it covers the language that the procedure is written in.
				//  http://www.postgresql.org/docs/9.1/static/infoschema-routines.html
				
				var routine_definition = information_schema_row.routine_definition;
				
				
				//console.log('');
				console.log('');
				console.log('');
				console.log('routine_definition ' + routine_definition);
				
				// the definition could get parsed, and references to tables / other functions noted with their names.
				//  then the references could be updated to refer to the actual objects.
				
				if (Abstract.parsers && Abstract.parsers.sql) {
					// parsing the code into its various statements... would be nice.
					// Will first have it getting the parameters from the DB.
					
					
				}
				
				
			},
			
			
			// not sure about this function here???
			'get_signature': function() {
				var res = [];
				//var res = ['['];
				var first = true;
				var params = this.get('parameters');
				console.log('params ' + stringify(params));
				console.log('params.length() ' + params.length());
				each(params, function(i, param) {
					// look at the parameter data type.
					if (!first) {
						res.push(',');
					} else {
						first = false;
					}
					
					//console.log('param ' + stringify(param));
					
					// the param may not be a proper / full abstract sql parameter.
					console.log('tof(param) ' + tof(param));
					// each individual parameter may now 
					
					var tp = tof(param);
					
					if (tp == 'collection') {
						
						console.log('param ' + stringify(param));
						//console.log('param._ ' + stringify(param._));
						
						var dts = param.get(1).get();
						console.log('dts ' + dts);
						console.log('dts ' + stringify(dts));
						
						if (dts.indexOf('char') > -1) {
							res.push('s');
						} else if (dts.indexOf('int') > -1) {
							res.push('i');
						}
						
					} else {
						if (tp == 'array') {
							var dts = param[1];
							if (dts.indexOf('char') > -1) {
								res.push('s');
							} else if (dts.indexOf('int') > -1) {
								res.push('i');
							}
							
						} else {
							res.push(param.get_signature());
						}
					}
					
					
					
				});
				
				//res.push(']');
				
				return res.join('');
				
			},
			//'toString': function() {
				// Puts the arguments together and the body.
				
				// fn name?
				
				
			//},
			'to_create_or_replace_str': function() {
				// could compose the create or replace function statement as an OO statement.
				
				var res = [];
				res.push('CREATE OR REPLACE FUNCTION ' + this.get('name'));
				
				res.push('(');
				
				var first = true;
				
				var params = this.get('parameters');
				console.log('params ' + stringify(params));
				//throw('stop');
				
				each(params, function(i, param) {
					if (!first) {
						res.push(', ');
					} else {
						first = false;
					}
					// the param will have both a name and a data type.
					
					// should be OK with varchar(n) as function parameters...
					//  we'll see if it works.
					
					// just the types given, not the parameter names.
					
					//console.log('tof(param) ' + tof(param));
					
					var tp = tof(param)
					
					if (tp == 'array' && param.length == 2) {
						//res.push(param[0]);
						//res.push(' ');
						res.push(param[1]);
					}
					if (tp == 'collection' && param.length() == 2) {
						//res.push(param[0]);
						//res.push(' ');
						console.log('param ' + stringify(param));
						// Need to sort out where the parameters get their names from.
						
						var p1 = param.get(1);
						//console.log('p0 ' + p0);
						//console.log('p0 ' + stringify(p0));
						//console.log('tof p0 ' + tof(p0));
						
						res.push(p1.get());
					}
					
				});
				
				res.push(') RETURNS ');
				
				var str_return_type = this.get('return_type') || 'VOID';
				
				res.push(str_return_type);
				res.push(' AS $$\n');
				//res.push('BEGIN\n');
				res.push('');
				// the main statement itself
				// or statements
				
				each(this.get('statements'), function(i, statement) {
					res.push('\t');
					res.push(statement.toString());
					res.push('\n');
				});
				//res.push('END;\n');
				res.push('$$ LANGUAGE SQL');
				
				return res.join('');
				
				
			},
			'arguments_str': function() {
				var res = [];
				// uncluse brackets?
				
				
				var first = true;
				each(this.get('parameters'), function(i, v) {
					// 
					if (!first) {
						res.push(', ');
					} else {
						first = false;
					}
					res.push(v.toString());
				});
				
				
				return res.join('');
				
				
			}
			
			// to create function string.
			
		}),
		
		'Function_Call': Data_Object.extend({
			'init': function(spec) {
				this._super(spec);
				// a way to get the class name of an item?
				
				console.log('tof spec ' + tof(spec));
				
				
				
				// could have a reference to the function itself... but probably won't use that.
				this.set('function_name', spec.function_name);
				
				//var that = this;
				//if (spec.num_parameters)
				
				//console.log('tof(spec.parameters ' + tof(spec.parameters));
				
				if (is_defined(spec.parameters)) {
					
					if (tof(spec.parameters) == 'number') {
						
						// should make a collection instead.
						
						var params = this.set('parameters', []);
						params = this.get('parameters');
						
						for (var c = 1, l = spec.parameters + 1; c < l; c++) {
							params.push('$' + c);
						};
					} else if (tof(spec.parameters) == 'array') {
						this.set('parameters', spec.parameters);
					}
				}
				
				//this.parameters = spec.parameters;
				// but maybe the params get specified in different ways.
				
				// could just call it with the params as $1, $2 etc, those are already in the query at a lower level using node-postgres query api.
				//console.log('this.parameters ' + stringify(this.parameters));
				
				// name value pairs?
				//  just the values?
				
				
				
			},
			'toString': function() {
				console.log('');
				console.log('');
				console.log('fc toString');
				
				
				var res = [this.get('function_name')];
				//console.log('params ' + stringify(this.parameters));
				
				res.push('(');
				// each param... add its value?
				
				//  but could be a parameterised function all.
				var first = true;
				
				var params = this.get('parameters');
				console.log('');
				console.log('')
				console.log('toString params ' + stringify(params));
				
				each(params, function(i, param) {
					if (!first) {
						res.push(',');
					} else {
						first = false;
					}
					if (tof(param) == 'string') {
						res.push(param);
					} else {
						if (param.toString) {
							res.push(param.toString());
						} else {
							console.log('param: ' + stringify(param));
							
							if (tof(param) == 'data_value') {
								
							}
							
						}
					}
				});
				
				/*
				 * var insert = {
    //name: "insert",
    text: "INSERT INTO hours (count, view_period, countable_id, countable_type) VALUES ($1, date_trunc('hour', $2::timestamp), $3, $4);",
    values: [1, "2012-01-13T20:19:35.945Z", 1234, "foo"]
  };
				 * 
				 */
				
				// could use a parameterized function call.
				
				
				// the text, and the values.
				//  is the name needed?
				
				
				res.push(')');
				
				return res.join('');
				
				
			}
		}),
		
		// or argument
		//  Not used yet (much).
		//  May use them in defining functions, but it seems that arrays are OK for that at the moment.
		
		'Parameter': Data_Object.extend({
			'init': function(spec) {
				this._super(spec);
				
				// will be able to create these from the INFORMATION_SCHEMA.parameter rows.
				// These parameters will likely get more properties to match the information_schema.
				//  Will provider a simpler API than information_schema though.
				
				
				
				
				
				//this.name = spec.name;
				
				//  This property will probably be made to follow the Postgres data type.
				//   Will have more about data correction in an automatic way with Data_Object.
				// These parameters will be looked at, perhaps indexed. Will be used in code analysis.
				
				// Also want to be able to call the functions found in the database quite soon,
				//  but a bit of analysis on the functions will help determine that the right ones are being called.
				// More code on the bridge, and then things will work very smoothly.
				
				// Also want to make permissions part of the DB from the abstract web db.
				//  Function analysis should also understand permissions.
				
				// This will be able to set up and use web databases very quickly.
				
				// Want it so that parameters are used correctly when creating rows.
				// Would also be able to use language to identify what functions do, functions called create_[item_name] being relatively obvious.
				//  After this, calling the functions won't be so difficult, should be quite easy to do from JavaScript and therefore the web.
				
				// Then dealing with permissions will be put into the database / database design.
				//  This won't be integral to abstract-postgres (or parsing)
				//  Will be a major part of the abstract-web-db-postgres system.
				// May get permissions / general objects to follow a specific pattern accross databases.
				
				// Object ownership - each documents object is owned by a user or group (owner)
				//  Users and Groups each have their OwnerID, as they are Owners.
				// May involve a few tables and functions to get working, but then will have a general system for assigning ownership.
				//  Superuser will have override.
				//  Ownership changes can be rejected too (but they are deemed to be acceptable if they were requested rather than given)
				// Group ownership - what that means in particular depends on the group's rules.
				//  Maybe only the group admins can make ownership changes.
				//  Group mechanics can be explored further once the individual users system is working.
				//  Keep track of which users are members of which groups. Also which roles they perform within the group.
				//   That is fairly important so that a normal user of the site could be an / the administrator of a group.
				// A new table of roles for each group?
				//  So that a group could have a 'Games Master' role that gets defined.
				//  Or 'Recycling Manager'
				// Group has some default roles anyway, 'administrator' and 'member'
				//  Could work with them, but also have
				//  Group_Additional_Roles  id, name
				
				// When all that is done, object ownership could be established for various pieces of content on the website.
				//  Will provide a useful basis for recording permissions
				//  The owner has almost full permissions
				//  The owner can assign permissions to other owners (users and groups)
				//   When an operation is attempted, the system checks to see if its done by the owner
				//    Or if they have any specific permissions
				//    Or if they are a member of a group that has permission
				//   Will be a few lookups of indexed records.
				
				// Then, a huge amount more could be done on the front-end, using a relatively simple but versitile API.
				//  A file manager, and all the management tools that are needed for content on a website.
				//  The XML editor tool could progress more rapidly when there are actually XML / HTML files to edit.
				//   It could also be very useful for editing small pieces of content.
				
				// These things will all work very well when they are using the right components.
				//  It will all work seemlessly and provide an interface for administering a server/servers
				// Services on the servers will be exposed through the Resource interface.
				// Things will be done within an abstraction, not all that much code will be needed.
				//  Won't be massively difficult.
				//  Want the website up before too long... need to get these various things working.
				
				// Loading parameters from information_schema is that thing.
				//  After that, a bit of function analysis
				//  Perhaps parsing of functions.
				//   Then more advanced function analysis
				//  Finding the functions that add rows seems important.
				//  Query the (abstract) DB to get, for each table, the function that adds a row
				//   All of the functions that add a row, including functions that have a shortcut using a lookup.
				//   Also want to get the shortcut / overloaded generated functions working using the lookup.
				//    Will make programming a bit more convenient to have these, and will be useful to have the option of creating them in the middleware.
				
				// Will be able to call Postgres functions from the web interface without too much difficulty.
				//  Will be very nice to have solid GUI tools built that make use of the back-end.
				//  More options for storing and modifying the presentation layer.
				// I think various (admin) tools will be able to be put in as components.
				//  Could maybe make tools that use the API like a music file mixing tool, and would use the permissions API like an admin tool.
				//   Would be able to save created files / sequences to the server.
				
				var is_info_schema_row = (is_defined(spec.specific_schema) && is_defined(spec.specific_schema) && is_defined(spec.parameter_mode) && is_defined(spec.as_locator));
				//console.log('');
				//console.log('');
				//console.log('is_info_schema_row ' + is_info_schema_row);
				//console.log('spec ' + stringify(spec));
				
				if (spec.specific_schema && spec.specific_schema && spec.parameter_mode && spec.as_locator) {
					this.load_from_information_schema_row(spec)
				} else {
					this.set('name', spec.name);
					// or could hold a full data_type object.
					//this.str_data_type = spec.str_data_type;
					this.set('str_data_type', spec.str_data_type);
				}
				
				
			},
			'load_from_information_schema_row': function(information_schema_row) {
				console.log('param information_schema_row ' + stringify(information_schema_row));
				// specific_schema, specific_name, ordinal_position, parameter_mode, is_result, as_locator, data_type, 
				//  could maybe have a parameter name when its a differen language and the specific name is not used.
				this.set('specific_schema', information_schema_row.specific_schema);
				this.set('specific_name', information_schema_row.specific_name);
				this.set('ordinal_position', information_schema_row.ordinal_position);
				this.set('parameter_mode', information_schema_row.parameter_mode);
				this.set('is_result', information_schema_row.is_result);
				this.set('as_locator', information_schema_row.as_locator);
				this.set('udt_name', information_schema_row.udt_name);
				
				
				//console.log('information_schema_row ' + stringify(information_schema_row));
			},
			
			'toString': function() {
				// a function to get the data type as a string.
				//  data type could be held in a different waym including as the results of INFORMATION_SCHEMA.
				
				// will deal with the data type differently, maybe use the information_schema system if that data is there.
				
				return this.get('name') + ' ' + this.get('str_data_type');
				
				
				
			},
			
			// not sure about this.
			/*
			'get_signature': function() {
				console.log('this.str_data_type ' + this.str_data_type);
				
				
				if (this.str_data_type.indexOf('char') > 0) {
					return 's';
				} else if (this.str_data_type.indexOf('int') > 0) {
					return 'i';
				}
				
			}
			*/
		}),
			
		'Table': Data_Object.extend({
			// There will be code to load this abstract table from a database, or a description of how it is in the db.

			'fields': {
				// Though it should be able to work as a string too.

                // Won't use automatic assignment right now.

				//'schema': Object
			},
			
			'init': function(spec) {

                console.log('init Table');

				// Polymorphism in how this gets specified to the constructor?

				var that = this;

				this._super(spec);

				//throw 'stop';
				// The spec may be a JSON object that's not so specifically following the Postgres format.
				//  Needs to respond to Postgres parameters, as well as the jsgui parameters which aims to be uniform accross different DB implementations.


				// set the columns from information_schema_column_rows?
				
				
				//  may want these the be indexed, with a string index.
				//   could use some kind of IndexedCollection for this.
				

                // Having a problem with the index by name.
                //  It could be related to the name being a Data_Value, and it not recognising that value and indexing it as such.


                if (spec.schema) {

                    // Throw an error if the spec abstract database already contains a schema with the same name
                    //  (and it is not this abstract schema?)


                    this.set('schema', spec.schema);

                    var schema_tables = spec.schema.get('tables');
                    //console.log('schema_tables.length()', schema_tables.length());



                    var existing_table = schema_tables.get(spec.name);
                    if (existing_table) {
                        //console.log('existing_schema', stringify(existing_schema));
                        console.trace();
                        throw 'Not expecting existing table';
                    } else {
                        schema_tables.push(this);
                    }
                    // Can also check the database to see if it contains the abstract schema.

                    // if it does not have it, push

                }

				this.set('columns', new Collection({
					'index_by': 'name'
				}));

				this.set('constraints', new Collection({
					'index_by': 'name'
				}));

				//var c = this.get('constraints');
				//console.log('c', c);


				//console.log('spec.columns', spec.columns);
				if (tof(spec.columns) == 'array') {


					// Don't just load them all without processing them
					//  Each item should be given to the column constructor.

					var columns = this.get('columns');

                    //throw 'stop';
                    //console.log('');

					each(spec.columns, function(spec_column) {
						//console.log('spec_column', spec_column);

						// Adding another property to an array?
						//  Questionable.

						//spec_column.table = that;

						// {table, array_spec};
						//  It gets more complicated and convoluted, but it will allow columns to be specified more easily.

						// However, need to set up the primary key or other constraints if it applies to the row.

						//  A column may be created that has FK constraints as well as PK ones.


						//console.log('spec', spec);

						var column = new Abstract.Column({
							'arr_spec': spec_column,
							'table': that
						});
						//console.log('column', column);


                        // Pushing the column is a problem.

                        //console.log('tof columns', tof(columns));
                        //throw 'stop';
						columns.push(column);

					})

					//this.get('columns').load_array(spec.columns);
				}
				
				
				//var columns = this.set('columns', spec.columns || []);
				
				
				// a problem with set not returning what I think it should.

				var columns = this.get('columns');


				
				this.load_from_spec(spec, ['name', 'schema_name', 'single_name']);
				
				
				
				
				//throw 'stop';

				// why no constrints collection though?
				
				if (tof(spec.constraints) == 'array') {
					this.get('constraints').load_array(spec.constraints);
				}
				
				//this.set('constraints', spec.constraints || []);
				// constraints collection, indexed by name instead.
				
				
				
				//this.set('name', spec.name);
				
				// only want to set various properties if they have been defined.
				// d_set... sets if defined.
				
				// could use a local function.
				//  or preferably set multiple things if defined.
				
				// this.set_if_defined(map);
				//  or read them from the spec...
				// load_from_spec(spec, items)
				
				//this.set('schema_name', spec.schema_name);
				
				//this.set('single_name', spec.single_name);
				
				
				if (is_defined(spec.parent_table)) {
					this.set('parent_table', spec.parent_table);
				}
				var that = this;


				if (is_defined(spec.information_schema_column_rows)) {
					each(spec.information_schema_column_rows, function(information_schema_row) {
						
						var column = new Abstract.Column({
							// possibly just give the information schema row as the spec.
							
							'information_schema': information_schema_row
						});
						columns.push(column);
					});
					
				}
				
				
				// update column_not_null.
				
				if (is_defined(spec.not_null)) {
					// will make columns have this constraint by default
					//  I think unless they are pks because they can't be null anyway.
					this.set('not_null', spec.not_null);
					
					
					// could go through the columns given, making them not null.
					
					// not very mvc.
					this.update_not_null();
					
				}
				
				
				// not working in stringify if there are 2 - way references.
				//this.update_column_parents();
				
				// when we have a foreign key, we need to know where it refers.
				
				
			},

			'ensure_pk_constraint': function(constraint) {



				// would need to create the constraint object I think.

				var constraints = this.get('constraints');
				//console.log('constraints', constraints);
				constraints.push(constraint);

			},
			
			'update_column_parents': function() {
				var that = this;
				each(this.get('columns'), function(i, column) {
					column.table = that;
				});
			},
			
			'update_not_null': function() {
				if (this.not_null) {
					each(this.get('columns'), function(i, column) {
						// look at the constraints.
						
						var has_not_null = false, has_unique = false, has_pk = false;
						each(column.get('constraints'), function(constraint) {
							//console.log('');
							//console.log('constraint ' + stringify(constraint));
							
							if (constraint.name == 'primary key') {
								has_pk = true;
							}
							if (constraint.name == 'unique') {
								has_unique = true;
							}
							if (constraint.name == 'not null') {
								has_not_null = true;
							}
						});
						
						if (!has_not_null && ! has_pk) {
							var nn = new Abstract.Column_Constraint.Not_Null();
							
							// It's still an array for the moment.
							//  When it's another sort of collection
							//   (probably an indexed collection, indexed by name)
							//   it is also likely to have a push function.
							
							
							column.get('constraints').push(nn);
						}
						
						//console.log('column.constraints ' + stringify(column.get('constraints')));
						
					});
					
					
				}
			},
			
			'get_column_dict': function() {
				var res = {};
				each(this.get('columns'), function(i, v) {
					res[v.name] = v;
				});
				return res;
			},
			
			'get_create_statement': function() {
				return 'CREATE TABLE ' + this.get_string_description();
				
			},
			'get_string_description': function() {
				var res = [];
				
				if (this.get('schema_name')) {
					res.push(this.get('schema_name') + '.');
				}
				
				res.push(this.get('name') + ' ');
				
				res.push('(\n');
				
				if (this.get('columns').length() > 0) {
					
					var first = true;
					
					
					
					each(this.get('columns'), function(v) {
						
						// could apply the not null to each column here...
						
						
						if (first) {
							first = false;
						} else {
							res.push(',');
							res.push('\n');
						}
						//console.log('v ' + stringify(v));
						res.push(v.toString());
						
					});
					
					
				}
				
				var constraints = this.get('constraints');
				
				if (constraints && constraints.length() > 0) {
					//var first = true;
					each(this.get('constraints'), function(v) {
						if (first) {
							first = false;
						} else {
							res.push(',');
							res.push('\n');
						}
						res.push(v.toString());
					});
					
				}
				
				res.push('\n');
				res.push(')');
				
				return res.join('');
			},
			'toString': function() {
				return this.get_string_description();
			},
			'toFQN': function() {
				
				// Fully qualified name...
				
				// could possibly use this.has functions.
				
				//if (is_defined(this.schema_name) && is_defined(this.name)) {
				if (this.has('schema_name') && this.has('name')) {
						return this.get('schema_name') + '.' + this.get('name');
						
				} else if (is_defined(this.get('name'))) {
					
					// could have a parent as the schema.
					
					return this.get('name');
				}
			}
		}),
		
		// Will take a bit more work to get table sequences.
		//  Will look at the DEFAULT value of various rows in the column.
		//  Will particularly identify the sequence in the primary key column.
		
		// Much better if columns can get their reference to the schema.
		//  They can then get the reference to another table by name
		//  With that, they can include a link to the table object within themselves, storing and using pointers on the object graph.



		
		
		'Column': Data_Object.extend({
			// And the column has a reference to the table, its parent.
			'fields': {
				//'table': Object
			},

			'init': function(spec) {
				//this.name = spec.name;
				this._super(spec);
				var that = this;

				// The abstract column would refer to an abstract table which would refer to an abstract schema.
				//  It may be that it's best to generate an abstract schema / abstract database, and work within that.
				//  Even when just creating columns, they may be best within a database.
				//  The various objects will themselves be 'hackers', meaning that they change data elswehere.
				//   Create a column with a foreign key, add it to a table, and it automatically adds the foreign key constraint to the table
				//   Want to minimise the number of statements needed to create something.

				// This used to have the ability to create an Abstract Column out of information_schema
                //  That would be very useful to put back.


                var t_spec = tof(spec);
                var arr_spec;

                var table;

                var name, data_type, data_type_length;

                var pk_constraint;








				//console.log('init Column');
				//console.log('spec.name', spec.name);

				//console.log('spec', spec);

				// I think break this down further into
				//  1) Getting / arranging the data as local variables
				//  2) Carrying out the initialization based on that local data.

				// Not so sure about setting things up in the tables when we make a PK column.
				//  Or at least not sure about doing it from this code here.



				// Depending on the type of the spec.
				//  The spec could be an array.

				// get the data from the spec as local variables here.
				//  the data type, and possibly its length
				//  other flags, such as autoincrement and pk

				// Parse out the values, some could be given as an array.
				//  not sure that arr_spec is the right way of doing this though.





				



				// pk_constraint, data_type, constraints, column_constraints, information_schema, is_unique

				if (t_spec == 'object') {

                    if (spec.information_schema) {
                        var information_schema = spec.information_schema;

                        //console.log('information_schema', information_schema);
                        //

                        name = information_schema.name;
                        data_type = information_schema.data_type;

                        // But the information schema does not provide the info about if it is a primary key column.
                        //  There will be a constraint in the table, the reference will be set up
                        //   (maybe while loading constraints)






                        //throw 'stop';
                    }

					// get properties from the object, look for the array arr_spec
					if (spec.arr_spec) arr_spec = spec.arr_spec;

					// some or all properties could be defined here.

					// data_type

					// table property

					//if (spec.table) table = spec.table;


                    if (spec.table) {

                        // Throw an error if the spec abstract database already contains a schema with the same name
                        //  (and it is not this abstract schema?)


                        this.set('table', spec.table);

                        var table_columns = spec.table.get('columns');
                        console.log('table_columns.length()', table_columns.length());

                        var existing_column = table_columns.get(spec.name);
                        if (existing_column) {
                            //console.log('existing_schema', stringify(existing_schema));
                            console.trace();
                            throw 'Not expecting existing column';
                        } else {
                            table_columns.push(this);
                        }
                        // Can also check the database to see if it contains the abstract schema.

                        // if it does not have it, push

                    }

				}
				if (t_spec == 'array') {
					arr_spec = spec;
				}

				//console.log('arr_spec', arr_spec);

				// then process the arr_spec into other variables.

				var has_fk, fk_referenced_table, fk_referenced_column;



				var process_arr_spec = function() {
					name = arr_spec[0];
					data_type = arr_spec[1];



					if (tof(arr_spec[2]) == 'number') {
						data_type_length = arr_spec[2];
					}

					//console.log('arr_spec.length ' + arr_spec.length);

					// then treat the rest as words...

					if (arr_spec.length > 2) {
						// look at the words, though the first [a2] could be a number

						var i;

						if (tof(arr_spec[2]) == 'number') {
							if (arr_spec.length > 3) {
								i = 3;

							}
							
						} else {
							i = 2;
						}


					}

					if (i) {
						var column_words = arr_spec.slice(i);
						//console.log('column_words', column_words);

						// then process these column words.
						// mapify?
						var mcw = jsgui.get_truth_map_from_arr(column_words);
						//console.log('mcw', mcw);

						// then if certain words are found in the map, we assign those characteristics to the column.

						//  If there is a PK we set up the Primart_Key constraint.

						if (mcw.pk) {
							// And reference the column

							pk_constraint = new Abstract.Column_Constraint.Primary_Key({
								'column': that
							});
						}
					}

					each(arr_spec, function(spec_word) {
						//console.log('spec_word', spec_word);

						if (tof(spec_word) == 'string') {
							if (spec_word.substr(0, 3) == 'fk-') {
								//console.log('');
								//console.log('we have a foreign key');

								var s_fk = spec_word.split('-');
								var referenced_table_name, referenced_table;
								if (s_fk.length == 2) {
									referenced_table_name = s_fk[1];
									//console.log('referenced_table_name', referenced_table_name);

									// need to look up that referenced table, by name, from the abstract database / schema system

									// and the table references the db

									var table2 = that.get('table');
									//console.log('table2', table2);
									var schema = table2.get('schema');
									console.log('schema', schema);
									console.log('tof schema', tof(schema));

									// then look for the referred to table in the schema.
									//  (want to build up a model / graph of this if possible)
									//  the schema may not have been set up though.

									// in that case, not sure we could do references to other tables in the same way, but they still could be done.
									//  ???
									//   know the name of the table, but the schema object connects them together.
									//   perhaps the Postgres database resource could use the public schema as a default.
									//   however, we may be building up an abstract schema to persist.




								}

								console.trace("Here I am!");
								//throw 'stop';
							}
						}


						
					})

				}

				// Go through column_words, looking for information about a foreign key
				//  fk-table_name
				//  fk-table_name-field_name

				if (arr_spec) process_arr_spec();


				//console.log('table', table);
				//throw 'stop';
				//console.log('name', name);
				//console.log('data_type', data_type);
				//console.log('data_type_length', data_type_length);
				//console.log('pk_constraint', pk_constraint);

				// process that into words.
				//  a number just after the data_type indicates the data_type length

				this.set('name', name);
				this.set('data_type', data_type);
				this.set('data_type_length', data_type_length);

				// The constraints may not just be given as spec.constraints.


				if (pk_constraint) {

					// Would get set on the table.

					//this.set('pk_constraint', pk_constraint);
					//this.get('column_constraints').push(pk_constraint);



					//this.set('column_constraints', [pk_constraint]);

					// ensure the constraint is represented in the table
					//  That's more than just adding it.
					//console.log('pk_constraint', pk_constraint);
					//throw 'stop';

					table.ensure_pk_constraint(pk_constraint);
				}

				// Automatic unique constraint on foreign keys?



				//throw 'stop';

				/*

				// Will put together the parameters, and then use them

				
				//   data type length
				//   there could be more info than just about the column in Postgres terms, so it makes sense that the Table object processes this and puts the objects in place.




				// boolean flags, and the various words that can be used to describe a field.


				if (t_spec == 'array') {
					name = spec[0];
					data_type = spec[1];



					if (tof(spec[2]) == 'number') {
						data_type_length = spec[2];
					}

					console.log('spec.length ' + spec.length);

					// then treat the rest as words...

					if (spec.length > 2) {
						// look at the words, though the first [a2] could be a number

						var i;

						if (tof(spec[2]) == 'number') {
							if (spec.length > 3) {
								i = 3;

							}
							
						} else {
							i = 2;
						}


					}

					if (i) {
						var column_words = spec.slice(i);
						console.log('column_words', column_words);

						// then process these column words.
						// mapify?
						var mcw = jsgui.get_truth_map_from_arr(column_words);
						console.log('mcw', mcw);

						// then if certain words are found in the map, we assign those characteristics to the column.

						//  If there is a PK we set up the Primart_Key constraint.

						if (mcw.pk) {
							pk_constraint = new Abstract.Column_Constraint.Primary_Key();
						}

					}



				} else {

					// Can include the spec as an array.

					name = spec.name;
					//this.load_from_spec(spec, ['pk_constraint', 'data_type']);

					// can get the specification word array




					if (spec.information_schema) {
						var i_s = spec.information_schema;


						//this.set('information_schema', i_s);
						//this.set('name', i_s.column_name);


						var name = i_s.column_name;

						//console.log('this.name' + this.name);
						//if (!this.has('data_type')) {
							// create the data type object from information schema.
							//this.set('data_type', new Abstract.Data_Type({'information_schema': spec.information_schema}));
						//}
						
						
						
					}
				}

				
				this.set('name', name);
				this.set('data_type', data_type);

				// The constraints may not just be given as spec.constraints.


				if (pk_constraint) {

					// Would get set on the table.

					//this.set('pk_constraint', pk_constraint);
					//this.get('column_constraints').push(pk_constraint);



					//this.set('column_constraints', [pk_constraint]);

					// ensure the constraint is represented in the table

					table.ensure_pk_constraint(pk_constraint);
				}
				
				// a reference to the primary key constraint if there is one.
				//  not sure this is needed with the column constraints array.
				//this.pk_constraint = spec.pk_constraint;
				
				// Also need to load array items when they are provided

				

				// Need to interpret items in an array to be those values.





				
				
				//this.set('pk_constraint', spec.pk_constraint);
				
				// not_null being a property, its postgres name?
				//  and within postgres it sets up a constraint.
				
				// SELECT * FROM information_schema.sequences???
				//  may want to go into the primary key columns and get their default information.
				//  could possibly use a regex?
				
				
				// A column will be able to reference another table (I think implicitly its pk)
				//  or reference a column within a table.
				
				//this.foreign_key = spec.foreign_key;
				
				
				
				//this.required = true;
				
				//if (spec.data_type) {
				//	this.data_type = spec.data_type;
					
					// can this data type contain information_schema data?
					
					// may look furhter into the data type.
					//  some data types, such as serial, are more than just the data type.
					//  serial means the value gets incremented.
					
					
					
				//}
				//this.set('data_type', spec.data_type);
				
				
				
				// these may include foreign key.
				//  not sure it will have to be included here.
				//this.column_constraints = spec.column_constraints || [];
				
				this.set('constraints', spec.constraints || spec.column_constraints || []);
				//  (column) constraints will most likely be a collection.
				//  Will improve, and document the indexing system used in the collection.
				
				
				
				//console.log('this._' + stringify(this._));
				
				
				
				if (is_defined(spec.is_unique)) {
					this.set('is_unique', spec.is_unique);
					if (spec.is_unique) {
						// create the constraint.
						
						// maybe check to see if its already there.
						
						console.log('making unique column constraint.')
						
						
						var unique_cc = new Abstract.Column_Constraint.Unique();
						//  expressed as a column constraint here...
						//  however, it gets expressed as a table constraint in the system.
						
						// perhaps we should create the table constraint too.
						//  don't know if this has the parent(column).
						// maybe we can make the scan for the unique columns look at the column constraints too.
						
						
						
						
						
						
						// and a collection object that also had 'push' could also bubble the event within the event heirachy.
						//  that may be implemented using the system's normal event receivers???
						
						// but having an event heirachy parent...
						//  or even event heirachy parents...
						//  could make a lot of sense.
						
						// new constraint gets added.
						//  constraint has the event parent.
						
						// gets bubbled up the event heirachy, and listeners can listen for it.
						//  by then will be able to compare the target object on the event with the event handler.
						//  will be able to see what the event target item is.
						
						
						
						
						
						//// can not get column constraints....
						//  They need to be set up.
						//  Using the data_types code could speed up or automate their initialization.
						
						
						//  should have been set already.
						console.log('this._' + stringify(this._));
						
						// not getting constraints right :(
						
						this.get('constraints').push(unique_cc);
						
						// but where does it then go?
						
					}
					
					
				}

				*/
				
				
			},
			'toString': function() {
				
				//var name = this.
				
				var name, data_type_length;
				
				if (this.has('information_schema')) {
					name = this.get('information_schema').column_name;
				} else {
					name = this.get('name');
				}


				var data_type_length = this.get('data_type_length');
				
				var res = [];
				
				//var res = this.name + '    ' + this.data_type.toString();
				res.push(name);
				res.push('     ');

				// It should have a data_type.
				var data_type = this.get('data_type');

				if (data_type) {
					res.push(data_type.toString());
					if (data_type_length) {
						res.push('(' + data_type_length + ')');
					}

				} else {
					throw 'Postgres Column expected to have data_type';
				}

				
				
				// not null?
				
				//console.log('this.constraints ' + stringify(this.get('constraints')));
				
				var constraints = this.get('constraints');


				if (constraints && constraints.length > 0) {
					//')
					
					each(this.get('constraints'), function(v) {
						
						//console.log('column toString ' + name + ', column constraint  ' + stringify(v));
						
						res.push(' ');
						console.log('** ' + v.toString());
						res.push(v.toString());
					});
				}
				
				//console.log('');
				//console.log(res.join(''));
				
				return res.join('');
			},
			'toFQN': function() {
				
				var name;
				
				
				var isc = this.get('information_schema');
				if (is_defined(isc)) {
					name = isc.table_schema + '.' + isc.table_name + '.' + isc.column_name;
				} else {
					name = this.get('name');
				}
				
				var res = [];
				
				// the schema name?
				
				res.push(name);
				
				
				return res.join('');
			},
			
			
			// Data type may well be changed through use of the DataObject system.
			
			//  Though currently DataObject by itself is quite minimal.
			
			
			
			
			'toDataTypeString': function() {
				//console.log('this.data_type ' + stringify(this.get('data_type')));
				if (this.get('data_type')) {
					if (this.get('data_type').get('text')) {
						return this.get('data_type').get('text');
					}
				}
			},
			
			//'toParameterString': function() {
			//	// full param? for PL/PgSQL queries?
			//	return this.name + ' ' + this.toDataTypeString();
			//}
			
			// from information schema....
			//  loads the data type from information schema too
			
			// get the string data type.
			
			// see if the column is needed in a create operation.
			//  automatically generated columns not needed.
			
			
			
			
			
			
			
		}),
		
		
		'Sequence': Data_Object.extend({
			'init': function(spec) {
				// sequences won't need to be very complicated.
				
				// will get various pieces of info from the spec.
				
				// the information about the functions will be more interesting really.
				//  perhaps I will parse the function bodies into statements.
				
				// likely to be able to get information from the function names and the parameters.
				
				// all the info about functions and parameters will be useful for determining how to carry out operations in the application.
				
				// Will set up some kind of mapping so that JavaScript functions will be able to carry out functions in the database easily.
				//  Will keep various concerns separated. Code will be longer but will have a more understandable structure.
				
				
				
				// Loading abstract functions will get more complicated.
				//  Being able to parse statements would be very interesting!!!
				
				
				
				
				
				
				
				
				
			}
		}),
		
		
		// Perhaps we'll have a Column_Information_Schema info object.
		//  Could be used accross databases.
		//  Or just hold the data.
		
		
		'Data_Type': Data_Object.extend({
			'init': function(spec) {
				this._super(spec);
				// perhaps will give it INFORMATION_SCHEMA as the Data_Type.
				//  but this will be able to hold all the values from the INFORMATION_SCHEMA.
				
				/*
				if (is_defined(spec.table_catalog)) {
					this.table_catalog = spec.table_catalog;
				}
				*/
				//var that = this;
				//var copy_from_spec = arrayify(function(item_name) {
				//	if (is_defined(spec[item_name])) {
				//		that[item_name] = spec[item_name];
				//	}
				//});
				//copy_from_spec('information_schema');
				
				this.set('information_schema', spec.information_schema);
				
				//console.log('spec ' + stringify(spec));
				
				/*
				copy_from_spec(['table_catalog', 'table_schema', 'table_name', 'column_name', 'ordinal_position', 'column_default', 'is_nullable', 'data_type', 'character_maximum_length', 'character_octet_length', 'numeric_precision', 'numeric_precision_radix', 'numeric_scale', 'datetime_preceision', 'interval_type', 'intervasl_precision']);
				copy_from_spec(['character_set_catalog', 'character_set_schema', 'character_set_name', 'collation_catalog', 'collation_schema', 'collation_name', 'domain_catalog']);
				copy_from_spec(['domain_schema', 'domain_name', 'udt_catalog', 'udt_schema', 'udt_name', 'scope_catalog', 'scope_schema', 'scope_name']);
				copy_from_spec(['maximum_cardinality', 'is_self_referencing', 'is_identity', 'identity_generation', 'identity_start', 'identity_increment', 'identity_maximum', 'idenetity_minimum'])
				copy_from_spec(['identity_cycle', 'is_generated', 'generation_expression', 'is_updatable']);
				*/
				// may give the data type in a variety of ways, in a string.
				//  could have some generalization going on here for convenience if it's wanted.
				
				// lots of different ones used in postgres.
				
				// can be summarised as text though without other things set.
				//  that will be convenient for the moment
				
				// load this from information schema?
				
				// perhaps the data type should have all of the information schema info available?
				// The INFORMATION_SCHEMA system may be important for middleware.
				
				// It seems like an important system to have,
				//  but it gets complicated with the different representations.
				
				
				
				
				//if (is_defined(spec.text)) {
				//	this.text = spec.text;
				//}
				
				this.set('text', spec.text);
				
				
			},
			'toString': function() {
				//console.log('this.information_schema ' + this.information_schema);
				if (this.has('information_schema')) {
					//console.log('stringify(this.information_schema) ' + stringify(this.get(information_schema)));
					
					return stringify({'information_schema': this.get('information_schema')});
				} else {
					if (this.has('data_type')) {
						
						
					} else {
						if (this.has('text')) {
							return this.get('text');
						}
					}
				}
				
			}
		}),
		
		/*
		'Table_Constraint': Class.extend({
			
		}),
		*/
		/*
		'Column_Constraint': Class.extend({
			// such as primary key
			
			
		}),
		*/
		
		// Creation and use of select statements used in various database tasks.
		
		// Use a constructed select statement to get INFORMATION_SCHEMA data about the primary keys in a table.
		
		
		
		
		'Select': Data_Object.extend({
			// different clauses
			
			// selection expression (columns / *)
			// called 'SELECT List' in postgres docs
			
			
			
			
			//  options such as distinct
			
			
			
			// from clause
			//  called from_item in postgres docs
			
			// ordered where conditions
			// group by
			// order by
			// limit
			// offset
			
			
			'init': function(spec) {
				this._super(spec);
				// what about 'SELECT 1'.
				//  Specify it through Select(1)?
				
				//  or selecting a function result.
				
				
				//this.select_list = spec.select_list || [];
				
				// don't want FROM in the case of functions.
				
				// could list columns or columns with aliases
				
				//this.from_item = spec.from_item;
				//this.where = spec.where || [];
				//this.group_by = spec.group_by;
				//this.order_by = spec.order_by;
				//this.limit = spec.limit;
				//this.offset = spec.offset;
				
				this.set('select_list', spec.select_list);
				//  should maybe be a collection.
				
				this.set('from_item', spec.from_item);
				this.set('where', spec.where || []);
				this.set('group_by', spec.group_by);
				this.set('order_by', spec.order_by);
				this.set('limit', spec.limit);
				this.set('offset', spec.offset);
				
				this.set('statement_type', 'SELECT');
			},
			'toString': function() {
				var res = [];
				res.push('SELECT ');
				var that = this;
				
				var get_select_list_str = function() {
					// all the columns.
					
					var sell = that.get('select_list');
					if (sell === '*')  return sell;
					
					// it may be an array of items, references to columns.
					//  they could have aliases too, could be alias references.
					var res = [];
					
					//console.log('tof(sell) ' + tof(sell));
					//console.log('(sell) ' + stringify(sell));
					
					if (tof(sell) == 'array') {
						var first = true;
						each(sell, function(v) {
							
							//console.log('v ' + v);
							
							if (!first) {
								res.push(', ');
							} else {
								first = false;
							}
							
							if (tof(v) == 'array') {
								if (v.length == 2) {
									// and both are strings
									//console.log('tof(v[0]) ' + tof(v[0]));
									//console.log('tof(v[1]) ' + tof(v[1]));
									
									res.push(v[0]);
									res.push(' AS ');
									res.push(v[1]);
									
								}
							} else {
								
								if (tof(v) == 'string') {
									res.push(v);
								} else {
									res.push(v.toString());
								}
								
								
							}
						});
					}
                    if (tof(sell) == 'data_value') {
                        res.push(sell.value());
                    }

					return res.join('');
					
				}
				
				var get_from_item_str = function() {
					// similar to the select list.
					
					// will call toString???
					
					// May be calling it on abstract columns, or may be given the names.
					
					// table reference? could refer to a view too.
					
					// toFQN
					var from_item = that.get('from_item');
					//console.log('from_item ' + from_item);
					
					var res = [];
					//console.log('tof(from_item)', tof(from_item));
					if (from_item.toFQN) {
						res.push(from_item.toFQN());
					} else {
                        if (tof(from_item) == 'string') {
                            res.push(from_item);
                        } else if (tof(from_item) == 'data_value') {
                            res.push(from_item.value());
                        } else {
							res.push(from_item.toString());
						}
						
						
					}
					
					
					return res.join('');
					
					
				}
				res.push(get_select_list_str());
				
				// won't always have 'from'.

                var t_select_list = tof(this.get('select_list'));
                //console.log('select_list', this.get('select_list'));
                //console.log('t_select_list', t_select_list);
                //console.log('tof t_select_list', tof(t_select_list));



				if (t_select_list == 'array' && this.get('select_list').length > 0 ||
                    t_select_list == 'string' || t_select_list == 'data_value') {
					res.push(' FROM ');
				}

                var str_from_item = get_from_item_str();
				//console.log('str_from_item', str_from_item);
				res.push(str_from_item);
				
				// are there where clauses?
				var where = this.get('where');
				//console.log('* where ' + stringify(where));


				var where_get_str = function(where_item) {
					//console.log('tof(where_item) ' + tof(where_item));
					//console.log('stringify(where_item) ' + stringify(where_item));
					
					if (tof(where_item) == 'array') {
						if (where_item.length == 2) {
							//console.log('tof(where_item[1]) ' + tof(where_item[1]));
							if (tof(where_item[1]) == 'string') {
								var res = where_item[0] + ' = \'' + where_item[1] + '\'';
								return res;
							} else {
								// ['param', val]
								
								if (tof(where_item[1]) == 'array') {
									if (where_item[1][0] === 'param' || where_item[1][0] === 'parameter') {
										var res = where_item[0] + ' = ' + where_item[1][1];
										return res;
									}
									
								}
								
								// will probably be .get('name')
								
								if (tof(where_item[1]) == 'object') {
									//console.log('where_item[1] ' + stringify(where_item[1]));
									if (is_defined(where_item[1].constraint_name)) {
										var res = where_item[0] + ' = \'' + where_item[1].constraint_name + '\'';
										return res;
									}
									
								}

								if (tof(where_item[1]) == 'data_value') {

									var v = where_item[1].value();

									//throw 'stop';
									//console.log('where_item[1] ' + stringify(where_item[1]));
									//if (is_defined(where_item[1].constraint_name)) {
										var res = where_item[0] + ' = \'' + v + '\'';
										return res;
									//}
									
								} 
								
								// may have a tofqn
								
								//console.log('where_item[1].toFQN ' + where_item[1].toFQN);
								
							}
						}
					}
				}
				
				var get_where_str = function() {
					var res = [];
					if (tof(where) == 'array') {
						//console.log('where.length', where.length);
						if (where.length > 0) {
							var first = true;
							res.push(' WHERE ');
							each(where, function(where_item) {
								if (!first) {
									res.push(' AND ');
								} else {
									first = false;
								}
								
								// need to get the where item as string. It may not be in there as a where clause object, could be given just as two objects in an array, meaning they are equal.
								//console.log('where_item ' + stringify(where_item));
								res.push(where_get_str(where_item));
								
								//res.push(where_item.to)
							});
						}
						
						
						
					} else {
						if (tof(where) == 'string') {
							
						}
					}
					
					//console.log('get_where_str ' + res);
					return res.join('');
				}
				
				res.push(get_where_str());
				
				var get_group_by_str = function() {
					
				}
				
				res.push(get_group_by_str());
				
				
				var get_order_by_str = function() {
					// how does order by get specified?
					//  this is where signature processing could be useful.
					//  identifying a single order by item, which is an array.
					
					var res = [];
					
					
					var ob = that.get('order_by');

                    //console.log('');
                    //console.log('ob', ob);
                    //console.log('tof ob', tof(ob));
					// order_by seems naturally an array.
					
					if (tof(ob) == 'array') {
						// order by array could be a few different fields in an array.
						
						if (ob.length > 0) {
							res.push(' ORDER BY ');
							
							var ob_sig = get_item_sig(ob, 1);
							//console.log('ob_sig', ob_sig);
							
							if (ob_sig == '[s,s]') {
								res.push(ob[0]);
								res.push(' ');
								res.push(ob[1]);
							} else {
								// each item in the order by array gets processed.
								
								each(ob, function(v) {
									// check the signature of the item, if so it's an order by item.
									var ob_sig = get_item_sig(v);
									if (ob_sig == '[s,s]') {
										res.push(v[0]);
										res.push(' ');
										res.push(v[1]);
									}
								});
							}
							
						}
						
						// a single item??
						
						
						
						
						
						
					}
					
					
					return res.join('');
				}
				
				res.push(get_order_by_str());
				
				
				//res.push(';');
				
				// Perhaps a 'statement' could contain select and then be terminated with ';'.
				
				return res.join('');
				
				
				
			}
			
			
		}),
		
		// Want to call a function.
		//  Do so in a parameterised way.
		//  The syntax is using select, parameters will be 
		
		'Exists': Data_Object.extend({
			'init': function(spec) {
				this._super(spec);
				this.set('subquery', spec.subquery);
			},
			'toString': function() {
				var res = [];
				res.push('EXISTS (');
				res.push(this.get('subquery').toString());
				res.push(')');
				return res.join('');
			}
			
		}),
		
		// Perhaps statement.extend.
		
		// The insert statement.
		//  It needs to be able to recognise its an insert statement.
		
		
		'Insert': Data_Object.extend({
			'init': function(spec) {
				this._super(spec);
				this.set('table', spec.table);
				this.set('values', spec.values);
				this.set('statement_type', 'INSERT');
				
			},
			'toString': function() {
				var res = ['INSERT INTO '];
				
				// table fully qualified name?
				
				var tn;
				
				var table = this.get('table');
				console.log('!!! table ' + table);
				if (is_defined(table.toFQN)) {
					// get the qualified name for the table.
					
					tn = table.toFQN();
				}
				
				if (is_defined(tn)) {
					res.push(tn);
					
					// then the list of columns.
					//  I think will be specified by default in these functions.
					res.push('(');
					
					var columns = this.get('table').get('columns');
					// no... the columns to be inserted.
					// column_name and value pairs.
					
					var values = this.get('values');
					
					console.log('')
					console.log('');
					console.log('values ' + stringify(values));
					
					// no, not every column.
					var first = true;
					each(values, function(v) {
						if (!first) {
							res.push(', ');
						} else {
							first = false;
						}
						res.push(v[0]);
					});
					res.push(') VALUES (');
					// string values quoted.
					first = true, p_num = 1;
					each(values, function(v) {
						// possibly check if it is string data.
						if (!first) {
							res.push(', ');
						} else {
							first = false;
						}
						
						// no the values are not always automatically sequential parameters.
						//  very often they will be though.
						//  in the current case we want it to have abstract function calls.
						//  will look into the parameter object.
						console.log('v ' + stringify(v[1]));
						if (v[1] instanceof Abstract.Function_Call) {
							console.log('is abstract function call');
							res.push(v[1].toString());
						} else {
							// TODO: Fix this, possibly run tests
							res.push('$' + p_num);
						}
						
						
						
						
						//res.push(v[0]);
						p_num++;
						
					});
					res.push(');');
					
				} else {
					var stack = new Error().stack;
					console.log( stack );
					
					throw 'Table name "' + tn + '" not found';
				}
				
				//res.push()
				
				return res.join('');
			}
		}),
		
		
		'Inner_Join': Data_Object.extend({
			'init': function(spec) {
				// left
				// right
				//  then on something
				//  match_left column
				//  match_right column
				this._super(spec);
				// perhaps could give two columns here...
				
				// Could allow different ways of expressing it in the code.
				
				// will process the spec into the correct internal format.
				
				if (spec.left_table && spec.right_table && spec.left_column && spec.right_column) {
					this.set('left_table', spec.left_table);
					this.set('right_table', spec.right_table);
					this.set('left_column', spec.left_column);
					this.set('right_column', spec.right_column);
				}
				
				
			},
			'toString': function() {
				var res = [];
				
				var str_lt, str_rt;
				
				//var tlt = tof(this.get('left_table'));
                //console.log('tlt', tlt);

                var lt = this.get('left_table');
                var rt = this.get('right_table');

                if (lt.value) {
                    str_lt = lt.value();
                } else {
                    str_lt = lt;
                }


                if (rt.value) {
                    str_rt = rt.value();
                } else {
                    str_rt = rt;
                }
				//if (tlt == 'string') {
				//	str_lt = this.get('left_table');
				//};
				//if (tof(this.get('right_table')) == 'string') {
				//	str_rt = this.get('right_table');
				//}
				
				res.push(str_lt);
				
				res.push(' INNER JOIN ');
				//res.push()
				res.push(str_rt);
				
				// the fully qualified names of the columns.
				
				
				res.push(' ON (');
				res.push(str_lt);
				res.push('.');
				res.push(this.get('left_column'));
				res.push(' = ');
				res.push(str_rt);
				res.push('.');
				res.push(this.get('right_column'));
				res.push(')');
				return res.join('');
			}
		})
		
		//,
		//'TC_UNIQUE': Abstract.Table_Constraint.extend({
			
		//})
	}
	
	// Possibly make the names clearer
	
	Abstract.Column_Constraint = {};
	
	// make these things classes...
	//  initialize these things in the same way as each other using the information_schema rows.
	//  then would be possible to find various unique field constraints
	// his would make it easier to identify the unique fields, to enable get_id_by_unique_field functions to be created.
	// Will be able to create the empty website in a very small amount of time.
	//  Content will get added and uploaded
	//  Various tools will be available to present the content.
	//   Centralized management of resources, such as uploading a high-res image file.
	//   Cropping it and selecting a region, while keeping the original
	//    Creating resized versions of the cropped image, saving them, making them available
	//  Web publishing UI tools
	
	
	
	
	Abstract.Table_Constraint = Data_Object.extend({
		'init': function(spec) {
			this._super(spec);
			
			this.set('column_usage', new Collection());
			
			var using_is_row = is_defined(spec.constraint_name) && is_defined(spec.table_name) && is_defined(spec.constraint_schema) && is_defined(spec.constraint_type);
			console.log('spec ' + stringify(spec));
			
			console.log('');
			console.log('');
			console.log('using_is_row ' + using_is_row);
			
			if (using_is_row) {
				this.load_from_information_schema_row(spec);
			}
			
		},
		
		// The row may not cover which column it is constraining.
		//  May need to do other queries to get that information.
		
		
		'load_from_information_schema_row': function(row) {
			// pertty good... nicely getting various objects as abstract now.
			// will also work on getting data faster and simultaneously later.
			
			this.set('name', row.constraint_name);
			this.set('table', row.table_name);
			this.set('table_schema', row.table_schema);
			this.set('constraint_schema', row.constraint_schema);
			this.set('constraint_type', row.constraint_type);
			
			
			
		}
		
		// also need to load data from constraint_column_usage.
		
		
		
	});
	
	// These other ones will have some information_schema properties already set.
	//  A nice database capability should be good for administering and displaying art and music.
	//  The middleware will be very useful for supporting a fair few things.
	//  The versitility at this stage will allow various things to be set up very quickly, with the repetitive writing of database functions done automatically.
	
	
	
	
	
	
	
	var acc = Abstract.Column_Constraint;
	acc.Primary_Key = Data_Object.extend({
		'init': function(spec) {
			this._super(spec);

			// and a referemce to the column too
			//console.log('spec', spec);
			//console.trace("Here I am!")
			//throw 'stop';


			//this.set('name', 'primary key');
			
			// maybe not capital letters?

			// And the constraint has column as a property?

			// Well, it can have a collection of columns.
			//  I think it's best implementing that, but also making it so it can work with a single column.
			//  Still, may be best to store it as an array / collection?

			if (spec.column) {
				//console.log('spec.column', spec.column);
				this.set('columns', spec.column);
			}


			
			
			
			this.set('constraint_type', 'PRIMARY KEY');
			
		},
		'toString': function() {

			var columns = this.get('columns');
			//console.log('columns', columns);

			if (!columns) {
				throw 'Primary key constraint needs column(s) assigned';
			}

			var column_name = columns.get('name').value();
			//console.log('column_name', column_name);

			return 'PRIMARY KEY(' + column_name + ')';
		}
	})
	
/*
-- Table: "Users"

-- DROP TABLE "Users";

CREATE TABLE "Users"
(
id serial NOT NULL,
username character(24) NOT NULL,
CONSTRAINT "Users_pkey" PRIMARY KEY (id)
)
WITH (
OIDS=FALSE
);
ALTER TABLE "Users"
OWNER TO postgres;
*/

	// foreign key...
	//  says that it references something.

	// The constraint belongs to the table rather than the column (in Postgres terms)
	//  Will be able to define a key as being part of a column.
	
	acc.Foreign_Key = Data_Object.extend({
		'init': function(spec) {
			this._super(spec);

			// Not just the target, the...

			// The table containing the foreign key is called the referencing or child table, and the table containing the candidate key is called the referenced or parent table.[4]


			// table
			// referenced table = target

			// Can reference two columns?
			//  Column in one table references a column in another table.

			// references a target column in a target table

			this.set('target', spec.target);
			
			// and knowing which column its a constraint for?
			//  That will be in the relationships mechanism, when that's working. Made do for the moment without it.
			
			//this.set('name', 'foreign key');
			this.set('constraint_type', 'FOREIGN KEY');
		},
		'toString': function() {
			// depending on if the target is a column or a table...
			//  how can we tell easily?
			
			if (this.get('target').get('columns')) {
				// then it is a table.
				
				return 'REFERENCES ' + this.get('target').get('name');
				
			}
			
			
			
		}
	});
	
	acc.Unique = Data_Object.extend({
		'init': function(spec) {
			this._super(spec);
			//this.set('name', 'unique');
			
			this.set('constraint_type', 'UNIQUE');
			
		},
		'toString': function() {
			return 'UNIQUE';
		}
	});
	
	acc.Not_Null = Data_Object.extend({
		'init': function(spec) {
			this._super(spec);
			this.set('name', 'not null');
		},
		'toString': function() {
			return 'NOT NULL';
		}
	});
	
	
	
	
	var atc = Abstract.Table_Constraint;
	atc.Unique = atc.extend({
		'init': function(spec) {
			this._super(spec);
			this.set('columns', spec.columns);
			
			this.set('constraint_type', 'UNIQUE');
		},
		'toString': function() {
			var res = [];
			
			res.push('UNIQUE (');
			
			var first = true;
			each(this.get('columns'), function(column) {
				if (!first) {
					res.push(', ');
				} else {
					first = false;
				}
				if (tof(column) == 'string') {
					res.push(column);
				} else {
					res.push(column.get('name'));
				}
			});
			
			res.push(')');
			
			return res.join('');
		}
	});
			
	atc.Primary_Key = atc.extend({
		'init': function(spec) {
			this._super(spec);
			
			// can be more than one column.
			
			// but will probably take columns themselves fine.
			//  will do a little checking to see what type of object it is probably.
			
			// better to make this have a collection of columns, but able to hold a column name.
			//  will be a modification before long.
			
			this.load_from_spec(spec, ['column_name']);
			
			
			// will be able to apply to more than one column.
			
			//this.set('column_name', spec.column_name);
			//this.set('name', 'primary key');
			this.set('constraint_type', 'PRIMARY KEY');
		},
		'toString': function() {
			var cn = this.get('column_name');
			var res = ['PRIMARY KEY ('];
			
			if (tof(cn) == 'array') {
				var first = true;
				each(cn, function(v) {
					if (!first) {
						res.push(', ');
					} else {
						first = false;
					}
					res.push(v);
				})
			} else {
				res.push(cn);
			}
			res.push(')');
			
			// and USING INDEX TABLESPACE?
			
			return res.join('');
		}
	});
		
	
	return Abstract;
});



