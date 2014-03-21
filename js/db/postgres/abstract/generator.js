define(["./jsgui-lang-util", './abstract-postgres-parser'], function(jsgui, Abstract) {
	
	
	// OK, this is currently big and chaotic.
	// Generates an abstract Postgres database.
	
	// It will need be corrected.
	
	// I am not so sure that Postgres generation will be done like this.
	//  I'll be doing more in terms of translating an abstract RDB to Postgres, rather than generating it in Postgres.
	//  This will be much clearer in terms of instructions. The generation logic will be applicable to all RDBs.
	//  The various types / definitions will be more clearly laid out.
	// This postgres system has been cool, but generating the abstract RDB first is better. Then the Postgres implementation of it can be made.
	//  Won't be wrapping the abstract Postgres database like this right now. Will be working on the abstract db -> abstract rdb
	//   then abstract rdb -> abstract postgres.
	
	// 

	// Abstract rdb generator...
	//  Abstract RDB
	//   Then translation to Postgres.

	
	
	
	
	
	
	
	// This generates things in an abstract Postgres database.
	//  Perhaps more will be done developing abstract databases, and generating instructions in an abstract way.
	//   In most cases the abstract instructions could be translated into stored procedures / functions of the required language.
	
	// However, much of it would be best when finely tuned to the language being used.
	
	// This generation code generates abstract CRUD functionality.
	
	// Could have more of this done outside this module.
	//  The general process of going through the database, identifying the tables, and then defining what the CRUD functions are.
	
	// It would be nice to have fairly abstract definitions of CRUD functions generated, perhaps just their names and a code describing what they do,
	//  and then these get used as input for creating abstract Postgres functions.
	
	// All that abstraction makes sense in terms of avoiding recoding logic for different database systems.
	//  It's also closer to approaching the 'nirvana paradigm' where code gets reused less and logic that's written is applicable to many instances.
	
	// Defining the abstract rdb model -> abstract postgres model -> specific postgres database gets set up, interfaces provided that make reference to the abstract
	//  rdb model.
	
	// abstract db -> abstract rdb -> abstract postgres -> actual postgres
	
	
	
	// I don't think this system will be too bulky to make all that quickly now that I have thought about it a lot.
	//  A lot of the planning has already been done.
	// 4 different levels of objects... at least.
	
	// This software will obviously be a bit of a beast... not sure about releasing it immediately.
	//  I think it would be nice released as a service, iPad app too.
	//  Probably don't release the whole stack quite yet.
	// Will be worth releasing code that integrates with my system, publishing some APIs and having discussions about them online.
	//  Want to get much of the buzz, excitement and learning taking place through my site.
	//   Also interested in getting some advertising $. 
	
	// Defining a Data_Object's field type as being another particular (type of) Data_Object...
	//  that's a type of field checking, and it's going to translate as a relationship in the database.
	
	// Could also have a Data_Object field being a collection of a particular type of Data_Object.
	//  Tables - collection of table, for example.
	
	// President's country referring to a Country object
	// User's Roles referring to a Collection of the Role object.
	
	// It will be good that these objects will be usable in the application too!
	//  There will be good indexing capabilities afforded to the system. Will enable HTML to be produced pretty quickly.
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//  It's a nice place to put this content together.
	//   Also, it makes sense in terms of process. (it did)
	//   It's going to perhaps decorate abstract postgres.
	//   Creating the functions as its told to do.
	
	// Could produce a matrix of possible functions.
	//  The user could choose possible ones. Tick some boxes.
	
	// I think a few categories of functions
	
	// Create
	//  Also creating something (like a user) and creating values in subtables (like users_roles).
	
	// Update
	//  Update an existing record. Set some fields, have the id of the record.
	//   Dont' have the ID, but can look it up because we have the values of another unique key.
	
	//  Update - where the existing content is left there and it is reversible?
	//   That would make another layer on top of this one.
	
	// Have the abstract-generator layer working nicely.
	//  It will be given a description of what to generate and it does it.
	//  Will work out the basics of what can be done too.
	
	// Another layer would be to set out to generate a database with specific characteristics.
	//  Like a website's database with a security model on top of it, allowing for modifyable content.
	//  That layer would possibly be customizable.
	
	// Things like references to specific tables, or domain model uses, such as 'users', should be kept out of this module.
	//  should go in abstract-web-db-postgres.
	
	
	
	// NOT SPECIFICALLY FOR WEB DATABASES.
	
	// This should be fairly customizable.
	
	
	
	// I think this should be a class that does the generation,
	//  is attached to the abstract postgres object
	//  Will create one by default.
	
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object;
	var each = jsgui.each, is_defined = jsgui.is_defined, tof = jsgui.tof, stringify = jsgui.stringify;
	
	
	// This is an interface to the abstract postgres database system.
	//  The abstract system needs to represent the postgres language really, and to keep the code neat and modular that's what I'm limiting it to doing.
	//  Manipulating such objects will be done by a different subsystem (this one). The code here will create abstract postgres objects as needed for different purposes.
	
	
	
	// Creating CRUD functions from the existing tables in the database, with some direction.
	
	//  DataObject may well be best.
	//   Would have better MVC functionality.
	//   Could even have a 'database' function for get and set.
	
	// Would be updating objects within it too.
	//  Perhaps they would want to be MVC-connected. May display well in a GUI if that pattern is used.
	
	// Will have various functions in place for augmenting the existing database
	//  Will also have functions for generating new code based on the existing database.
	
	// Likely to keep track of functions it has generated.
	
	var Abstract_Postgres_Generator = Data_Object.extend({
		'init': function(spec) {
			this._super(spec);
			
			//this.database = spec.database;
			console.log('spec.database ' + spec.database);
			if (is_defined(spec.database)) {
				this.set('database', spec.database);
			}
			
			
			// and keep track of which is the active schema...?
			//  will want to generate things for that schema in particular.
			//  will want to persist things for particular schemas.
			
			
			// will also be receiving information about the application / required database.
			//  That info could include some actual data to put in the db.
			
			// the generator has the database.
			//  it can be used 
			
			
			
			// This level is not in abstract directly, it goes beyond that a bit.
			//  Will look at the abstract database / tables etc.
			
			// Will then come up with more things to add to it.
			//  Will add those things to the abstract db.
			
			// That abstract db can later be persisted using another tool.
			
			
			
			// Should probably keep track of the various functions / objects generated.
			
			// An index / matrix of what the generated objects are for.
			
			
			// This is an abstract-postgres generator.
			//  That means it may take a domain model.
			//  This is where that interface would be.
			//  At the moment I'm not giving very much in the way of a domain model.
			// It would not be so hard to give such a domain model.
			//  Perhaps this really should take a 'database application model' though, and make it in postgres.
			// This may only deal with parts of the full domain.
			
			// However, this can be given a model of sorts for its own domain.
			
			// We may tell it what tables we want, and what fields to put in, and what functions to use to access the data.
			
			// Or we may tell it what objects are stored in the system, and the relationships between them.
			//  It would then work out what database objects are needed.
			//  user-roles: many-many. Could indicate that relationship as an object?
			// The database model contain information about the keys, unique indexes etc. It is closer to the implementation.
			
			
			// will have things get generated for different schemas.
			//  probably won't be generating entire schemas.
			//  worth knowing what schema the items would go in though.
			
			this.set('generated', {
				'functions': []
			});
			
			
			
			
			
			
			
			
			
		},
		
		// functions for getting the generated CRUD for different items.
		
		// Not sure about overwriting things.
		//  Will be best for initial use cases.
		//  Could have the longer functions generate things, and used in shorter ensure functions.
		
		// 'make' easier word - like make crud.
		
		
		
		// may be a bit easier to have the items generated an immediately put in place.
		//  however, this other way could be very useful for displaying potential generated functions in a browser.
		//  lots get generated, some get selected and deployed.
		
		
		'generate_crud': function(directions) {
			
		},
		
		'ensure_crud': function(directions) {
			
		},
		
		'persist_generated_to_abstract': function(abstract_schema) {
			// Should probably be generated things just for one schema.
			
			if (tof(abstract_schema) == 'string') {
				//abstract_schema = this.get()
				// get the schema by name.
				//  this is where the indexing system for collections makes the most sense.
				
				var db = this.get('database');
				console.log('db ' + db);
				
				abstract_schema = db.get('schemas').get(abstract_schema);
				
			}
			
			
			var generated = this.get('generated');
			//each(generated, function(category_name, category_items) {
			//	
			//})
			
			// need to be persisted to a particular schema.
			
			
			
			
			
			// by individual typed for the moment
			
			// persist generated functions
			
			var gen_funs = generated.functions;
			
			console.log('gen_funs ' + stringify(gen_funs.length));
			//throw('stop');
			// should be whole bunch of them
			
			
			// a map of existing functions by signatures?
			//  may need some logic to see which to overwrite / delete.
			
			// could look through the CRUD index...
			//  and then use these to overwrite the existing functions with the same signatures.
			//console.log('abstract_schema ' + abstract_schema);
			
			
			var existing_fns = abstract_schema.get('functions');
			console.log('existing_fns ' + existing_fns);
			
			// these functions won't have the optional specific names, which they get indexed by
			//  and have unique constraint enforced for.
			// Could do more work on the collections and the various constraints and indexes that can apply.
			//  The collection system has got quite big already.
			//  May be good to put it in its own file?
			//  The code is quite big, but fairly modular now.
			
			
			each(gen_funs, function(i, gen_fun) {
				var fn_name = gen_fun.get('name');
				console.log('fn_name ' + fn_name);
				
				
				var sig = gen_fun.get_signature();
				console.log('sig ' + sig);
				
				//fn_parent = get_fn.get('parent');
				// the generated function can say its parent is the relevant abstract schema?
				
				//console.log('relationships ' + gen_fun.get('relationships'));
				// do we have the functions indexed by signature anyway?
				
				// and using the crud_index.
				
				
				// The system's a bit more complicated for new columns that get generated?
				//  Quite a bit of the indirection does not need to be used right now.
				
				// just push them for the moment.
				//  may have an indexing system in the functions that ensures they are unique by parameter types or signature.
				
				existing_fns.push(gen_fun);
				
				
				
				// should be able to look at the function's signature too.
				//  a string signature?
			});
			
			// overwrite existing functions with the same name and signature?
			
			//console.log('crud_index ' + stringify(this.crud_index));
			
			
			
		},
		
		
		// 22/03/12 OK, so the somewhat more complex CRUD generation seems to be working right now.
		//  Will put a few more things in functions, but likely this generate_abstract_schema_crud function will be very long.
		
		'generate_abstract_schema_crud': function(abstract_schema, crud_map) {
			
			// I think we can have different levels / layers of CRUD.
			
			// With adding values:
			//  With linked tables, or when a value can be represented by a string / value rather than an integer key.
			//  Having it do the lookup.
			//  Overloaded functions where it does the lookup.
			
			// Will be looking through the crud_index.
			//  A decent amount can be generated by default.
			
			
			
			
			
			
			
			var generated = this.get('generated');
			var gen_funs = generated.functions;
			
			// description of what CRUD we wish to use.
			
			console.log('');
			console.log('');
			console.log('----------generate_abstract_schema_crud-----------------');
			// quite a big function... may be broken up into different parts.
			console.log('crud_map ' + stringify(crud_map));
			// Will have this generating a fair few things by default.
			
			// crud_map will have more things like overridden functions that provide more convenient parameters by carrying out lookups on other tables.
			
			
			
			
			//  Need to be able to handle link table items...
			//   Will not be too hard with ids
			//   Handle them with the string keys too... have a lookup in the function.
			
			
			// Need to make sure this works.
			
			
			
			// does this for the whole schema. goes through its tables and makes the necessary functions.
			
			// will also keep an index of what CRUD functions have been generated.
			
			
			
			var that = this;
			
			// will also have the indexes done by function signature.
			//  so will know which function to call from the JavaScript call.
			
			that.crud_index = that.crud_index || {
				'create': {},
				'read': {},
				'update': {},
				'delete': {}
			};
			
			// and also that.get('generated') object;
			
			
			crud_map = crud_map || {};
			// a position map of all functions.
			
			var fn_pos_map = [];
			each(abstract_schema.get('functions'), function(i, a_fn) {
				fn_pos_map[a_fn.name] = i;
			});
			// the map of the position of the functions... not sure this is needed.
			
			// use the table iterator.
			// will be more like tables.each?
			//  or better, have the each function recognise collections and iterate through them.
			//  collection should have its own iterator, but each could call it.
			// the collection could perhaps be in a certain order.
			//  but want to keep the arr order (the order they were added) for the moment.
			
			// now the tables is a collection of tables.
			//  maybe use the each function of the collection.
			
			// abstract_schema.get('tables').each
			
			
			// I'm sure this can be much neater.
			// Want to be putting in more functions by default for the moment.
			//  Getting IDs from unique string values seems important.
			
			// can do this with users, roles.
			
			// fn_[table_name]_get_id_from_[field_name]
			
			// will be able to create more CRUD for some functions once the first function set has been made. Some new CRUD will deal with overloading.
			
			var generate_level_0 = function() {
				each(abstract_schema.get('tables'), function(i, table) {
					
					
					
					var table_name = table.get('name');
					
					console.log('generating CRUD for abstract table: ' + table_name);
					
					var crud_item;
					if (crud_map[table_name]) {
						crud_item = crud_map[table_name];
					}
					
					var fn_create = make_fn_create(table);
					
					// can use a static function.
					
					// not just a function with that name, but with that name and signature.
					
					// will be doing functional overloading before long, so likely to have to fix this.
					
					// fn_pos_map???
					if (!is_defined(fn_pos_map[fn_create.get('name')])) {
						
						
						// no, put it in the generated functions section.
						//abstract_schema.get('functions').push(fn_create);
						gen_funs.push(fn_create);
						//  but do we have a way to compare them to the functions that are in the abstract database later on?
						//   don't want to create duplicate functions there.
						//  Do the functions get indexed?
						
						
						var fn_sig = fn_create.get_signature();
						//console.log('');
						//console.log('fn_sig ' + stringify(fn_sig));
						
						// I think only a single one for the moment.
						that.crud_index['create'][table_name] = that.crud_index['create'][table_name] || {};
						that.crud_index['create'][table_name][fn_sig] = fn_create;
						
					}
					
					// not just create, make string property lookup tables too.
					
					// does the table have a unique string column (that is not the primary key)?
					
					var fn_get_id_by_unique_column = make_fn_get_id_by_unique_column(table);
					console.log('fn_get_id_by_unique_column ' + fn_get_id_by_unique_column);
					//throw ('stop');
					
					if (fn_get_id_by_unique_column) {
						// then put it in the generated functions (maybe under the right condition).
						
						gen_funs.push(fn_get_id_by_unique_column);
						
						var fn_sig = fn_get_id_by_unique_column.get_signature();
						//console.log('');
						//console.log('fn_sig ' + stringify(fn_sig));
						//throw('stop');
						// I think only a single one for the moment.
						
						that.crud_index['get_by_unique_column'] = that.crud_index['get_by_unique_column'] || {};
						
						that.crud_index['get_by_unique_column'][table_name] = that.crud_index['get_by_unique_column'][table_name] || {};
						that.crud_index['get_by_unique_column'][table_name][fn_sig] = fn_get_id_by_unique_column;
						
						
						
					}
					
					
					
					
					if (crud_item) {
						each(crud_item, function(i, v) {
							// for each of them, it's an operation, and 1 or more params.
							var op = v[0];
							
							
							// maybe we look here to see how the parameters may be rearrangements of existing crud_items 
							
							
							if (op == 'create') {
								console.log('op == create');
								
								// but with this one we check for the parameter shifting here.
								
								// when creating a record, especially with the link tables (like users_roles), may want to specify the record by strings such as the
								//  username and the role name.
								
								// likely to have them for get...
								//  maybe more likely for exists though.
								//  and delete
								//  what the id is exactly does not matter so much.
								
								// it will be easy to specify such functions.
								// it will also provide a fast way to create many-to-many relationships, and other types too.
								
								// the web interface may be better though.
								//  provide that intefrace for the db through 'admin'.
								//  provide access to the objects that make up the application.
								// likely to facilitate easy movement between items and easy editing of content.
								console.log('');
								console.log('');
								console.log('');
								console.log('v[1] ' + stringify(v[1]));
								
								// may need to work out what the integer fields 'mean'.
								//  what string fields they correspond with.
								
								// could ask the abstract schema...
								//  which unique string fields correspond with those integers?
								
								// ['s,s', 'i,i']
								
								// want to interpret it.
								
								var sig = get_item_sig(v[1]);
								console.log('sig ' + sig);
								
								
								// This will get quite complicated.
								//  Creating a new function that calls the old one,
								//  (or in fact deals with the values directly?)
								// This would speed up the production of CRUD functions.
								
								
								// Calling an exising function with different parameters.
								
								//  Creating a wrapper to a function.
								//   This should probably be made more explicit with a create_wrapper function call.
								
								if (sig == '[s,s]') {
									// two strings, offering different types of parameters.
									
									var new_params = v[1][0].split(',');
									var old_params = v[1][1].split(',');
									
									// then need to find the way of getting between the types.
									
									// find out from the old params what values they are for.
									//  they'll refer to integer values on tables.
									
									
									// will be checking the crud_index too.
									//  that will have the function with the parameters.
									
									var crud_create_table = that.crud_index.create[table_name];
									
									//console.log('that.crud_index.create[table_name] ' + stringify(that.crud_index.create[table_name]));
									
									var cct_old = crud_create_table[v[1][1]];
									//  Does not stringify so well, because shows all info for table where references are in fact used.
									console.log('cct_old ' + stringify(cct_old));
									
									
									console.log('');
									
									// We have the old function, want to have a look at the function's parameters.
									
									var old_fn_params = cct_old.parameters;
									
									console.log('old_fn_params ' + stringify(old_fn_params));
									
									// have the param names and types
									
									// they correspond to items in the table.
									
									var col_dict = table.get_column_dict();
									
									each(old_fn_params, function(i, old_param) {
										
										// corresponding new param...
										
										var param_name = old_param[0];
										if (col_dict[param_name]) {
											var col = col_dict[param_name];
											console.log('col ' + stringify(col));
											
											var col_constraints = col.get('constraints');
											//console.log('col_constraints ' + stringify(col_constraints));
											
											each (col_constraints, function(i, col_constraint) {
												if (col_constraint.name == 'foreign key') {
													var target_table = col_constraint.get('target');
													var target_name = target_table.get('name');
													console.log('target_name ' + target_name);
													
													// and that target corresponds with the parameters.
													
													// we'll be able to use existing CRUD functions to get those values.
													
													//  However, should probably have these 'get' functions marked when they are created.
													//  'read' - only read the id
													//  'read' could read all records joined with linked ones, a subset, a single one, then same with single records,
													//    and parts of records too.
													//  'read' seems too generalized in comparison to 'create'.
													
													// And other functions / functions to do with reading and modification will have built in security too.
													//  So 'crud' may narrow things too much, but still be a checklist of some things to implement.
													
													
													
													
													//  perhaps they are 'id' functions?
													
													
													
													
													
													
													
													// so, with the table names (and the tables anyway), we can refer to those tables to find unique columns, matching the data types
													//  of the parameters given.
													
													// need to be values representing the columns.
													
													
													// and then look at it, and if its the right data type, assign it as a match
													//target_table.get_unique_columns();
													
													
													
													
													
												}
												
											});
											
										}
										
									});
									
									
									console.log('');
									
								}
								
								
								
								
								
								
								
								
								
								
							}
							
							
							// is get crud?
							
							// get id?
							// get [id]?
							
							// we want to get the id of the record,
							//  can supply unique fields
							
							// want to get the ids of various records, can supply some fields
							//  or may want to get full record or full and linked record information, or a selection of records from linked tables.
							
							// It seems like there are a lot of combinations there, and keeping track of them would make sense.
							
							// The function designer could be more integrated with abstract and less with dbi.
							//  The CRUD / function generator should not need to make database calls.
							// Should not need to be tempted to make database calls.
							// Database + schema defined in the abstract.
							// There should be some kind of meta-framework around the abstract postgres db itself.
							// So far the abstract section has mostly been about modelling the postgres db structure, not doing loads of things with it.
							
							// Likely that hooking up MVC would be the way to do this.
							// Want it so that the abstract database can get defined.
							//  Then there is another module that updates it / interacts with it.
							
							// Abstract DB
							// Abstract DB Generation
							
							// Specifically putting things in abstract-postgres-generation may make the most sense.
							// Not sure about it only being for generation?
							
							// Want it looking at the abstract database, generating things, maybe making columns.
							//  It could propose things to generate, and then generate them.
							
							// Easy enough to put things into the abstract database directly.
							//  Also it may be possible for it to keep the collection of modifications to itself?
							//  I think these would just be new functions though.
							
							// Would be very useful to have the abstract-postgres-generation module generate the functions,
							
							// Abstract-postgres-generation would hold a copy of a schema or a database
							//  Database I think.
							// It would create metadata where needed about that database and be able to hold it outside that abstract database.
							//  That metadata would be interacted with through the Abstract_Postgres_Generation object.
							//  May be a stepping stone to the domain model.
							
							// Will also clear out code from dbi-postgres.
							//  At the moment there is code here that is of a more abstract nature,
							//  and not necessarily interacting with the database itself.
							
							
							
							
							
							
							
							//  and then provide feedback about how they would be called in JavaScript.
							// Could also be useful for when the functions are already in the database?
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							
							if (op == 'get') {
								
								// may just want to get the id of the record by the string values of associated records...
								//  would not rule it out.
								// keep in mind the possibility of these wrapped functions.
								
								
								
								var fn_name = 'fn_' + table.get('single_name') + '_get_by_' + v[1];
								//console.log('fn_name ' + fn_name);
								
								// need to find out what that parameter type is, the one we are getting it by.
								//  also should be unique.
								
								var cd = table.get_column_dict();
								
								// 2nd paramter could be a column.
								//  means get by that column.
								
								// not needing to do parameter shifting here.
								
								var col = cd[v[1]];
								
								//console.log('***');
								//console.log('col ' + stringify(col));
								
								if (col.is_unique) {
									// we can do it.
									
									var coldtt = col.toDataTypeString();
									// put the function together.
									
									
									// * 'name': fn_name,
									//	'parameters': params,
									//	'statements': statements,
									//	'return_type': 'boolean'
									// * 
									// * 
									
									
									var params = [];
									
									// it knows the data type.
									
									params.push([v[1], coldtt]);
									
									var where = [];
									
									
									
									where.push([v[1], ['param', '$1']]);
									
									// and the sql statements
									
									// a very simple statement.
									var statements = [new Abstract.Select({
										'select_list': ['id'],
										'from_item': table,
										'where': where
									})];
									
									// can we get the type of the primary key row?
									
									// assume it's an integer for the moment?
									
									
									// SELECT [id] FROM tablename where paramcolumn = paramvalue
									
									// params.push([a_column.name, a_column.toDataTypeString()]);
									
									var fn_get = new Abstract.SQL_Function({
										'name': fn_name,
										'parameters': params,
										'statements': statements,
										
										// could just be one statement.
										'return_type': 'integer'
									});
									
									// should go within the crud_index at some point.
									
									
									// not just in the map, but in the crud_index with that signature.
									
									if (!is_defined(fn_pos_map[fn_get.get('name')])) {
										
										
										abstract_schema.functions.push(fn_get);
										
										
										
										
										// I think only a single one for the moment.
										
										// get and with just the string signature.
										
										//that.crud_index['get'][table_name] = fn_create;
										
									}
									
									//var sql = fn_get.to_create_or_replace_str();
									//console.log('');
									//console.log('');
									//console.log('');
									//console.log('sql ' + sql);
									
									// 
									
									// abstract_schema.functions.push(fn_create);
									
								} else {
									throw 'The column must be unique for the get function like this';
									
								}
								
								
								//var fn_get = new Abstract.SQL_Function({
								//	
								//});
								
							}
							
							
							
						});
						
						
					}
					
					
					//abstract_schema.functions.push()
					
					// then generate the functions...
					
					// won't be adding them to the DB.
					
					
					
					
				});
				
			}
			
			
			generate_level_0();
			
			var generate_level_1 = function() {
				
				// look at the generated functions.
				
				// maybe in some kind of index already.
				
				// then see which functions / functions for tables could be extended with overridden CRUD functions.
				
				// then make them, and have a brilliant piece of tech!
				
				// still would be a lot more to do with an objects and permissions system within the database.
				
				// things to deal with with groups too I think.
				
				// users will have their own space / item creation and publishing privilidges (or not)
				//  Creating a file system won't be too hard.
				// Will be able to create a directory object for a user.
				//  
				
				// Look through the create functions.
				//  we may find some that take various integer / id parameters.
				//  maybe we could tell that from the tables too, like with users_roles.
				//   three columns: id int pk, user_id references users, role_id references roles.
				// Creating the overloaded version will make a function that calls the original.
				//  Will use lookup functions to get the integer values to use to start with.
				// More of the advanced functions will get generated automatically.
				// Will have a decent set of CRUD functions before too long.
				//  Will need to be careful about delete cascades.
				// Will also have update by id functions
				//  Will need to be careful about updating various unique fields
				// Will have functions to update only particular fields?
				//  Could explore some flexibility there.
				// Probably will be updating whole records much of the time anyway.
				//  In other situations can be more specific, system could help with generating functions.
				
				// And reading whole bunches of information...
				//  Not so sure about that yet. Access to information will depend on authorization.
				//  Likely to have read functions with authorization, maybe read functions without.
				//  Authorization would be partly about selecting the right users' data to read.
				//  Items may have IDs unique to that user.
				// Will have it so that items can have a unique ID withing a set / for a user.
				//  That ID may need to be transferred if the object moved to a different user.
				//  The object itself could have a system ID which is not revealed to the user much of the time.
				//  It may be revealed on publishing.
				//   Probably won't make these system IDs secret, but possibly won't reveal them to individial users.
				
				// The functional analysis method is proving to take a while to program.
				//  I think it is a very effective way to do things, dealing with a set of functions once they have been generated.
				
				// Loading data for linked tables will become much easier
				//  Maybe accessing such data, verifying records exist.
				
				// Will have a somewhat general way of automatically overloading postgres functions with new versions that retrieve the integers or other IDs
				//  using a unique key value.
				// This is the kind of tool that could be charged for.
				//  Possibly on an iPhone app
				//  Possibly subscription charge to use the website.
				//   Very cheap to maintain user space, do a few things.
				// Trial / guest account would maybe allow only one database
				//  Maximum of 16 tables
				// Then the single user / 'pro' / developer subscription could be licensed at $5/year.
				//  Academic license $2/year, verified with a .edu email address not alumni.edu???
				//   Other registered educational institutions?
				//   Could do that a little later, $5/year is not too bad.
				// Developer subscription has storage limited by size.
				//  Won't take so much storage to begin with.
				//  May have hard limit of 100MB.
				
				// Possible more advanced feature being working with a development deployment...
				//  Could have test data in there.
				//  Automatically generated test data.
				//  Could be made into a live deployment quickly. Perhaps it would get transferred to a different machine.
				// That would be a more advanced feature that extra culd be charged for.
				
				// Hosted database subscription plans:
				//  May be available through the deploy options... deploy to hosted database. Done very quickly, practically immediately, and the credentials
				//   are provided in a matter of seconds, perhaps considerably less with the deploy script being fast as it is.
				//    Deployment could be optimized further, with simultaneous loading, but that would need to be done carefully and with awareness of the load order
				//    / dependencies. Analysis of an abstract database before deployment could help with creating an optimized deployment order.
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				//console.log('gen_funs ' + stringify(gen_funs));
				
				
				// I think go through all the tables
				//  Identify tables that have an integer or number single row PK
				//  Also have one or more integer / number fields that references another table, identifyable through a single field.
				//  Has create function that uses these integer parameters and is ready to be overloaded.
				
				// With that info we'll be ready to create the function that overrides the original.
				//  How about starting with the function and looking at the parameters?
				
				// There could be different ways of creating these overriding functions.
				//  Will also be worth doing when there are more level 0 functions to override.
				
				// Could delete a row using its string key rather than by id.
				//  May do more than one lookup for linked tables.
				
				// can look at the tables to see if they can have functions overridden.
				
				// I think I prefer looking at the functions.
				//  Can see what parameters they have and what they represent?
				// Analysis of functions may be of some use at a later stage too.
				//  It may be about deducing some metadata.
				
				// There will be quite a lot that gets put in automatically.
				//  Users actually need to be able to have some things.
				//  User space?
				//  User can view each object assigned to them.
				//   Could perhaps have a desktop in effect.
				//  User has a home folder.
				//  Or documents folder?
				// Or root folder which can contain a few things.
				//  Documents / resources may not always be stored as files anyway.
				// They file system would provide a convenient space for files.
				//  Could also have a website uploaded here and store the files as resources.
				//   And the files get served as resources.
				
				// Look at the functions
				//  Look at the tables they deal with
				//   this would be querying based on the function code tree, either parsed or created.
				// Look by function
				//  spot overloads
				//  look at the parameters
				//   look into what the parameters represent
				
				// Having it deduce some things at various stages is important.
				//  Want it to be able to process things without having to be be given various pieces of information.
				
				// Finding out what the parameters correspond with in the function.
				//  Seeing if there is a way to look up that information.
				
				
				// Analysis of level 0
				//  Finding out which functions are suitable to be overridden
				// Deducing what can be done for level 1
				//  Which functions provide the data used to override the parameters?
				// Doing level 1
				//  Creating the new overridden functions.
				
				// The overridden function(s) will be very useful for adding data to the database.
				
				// File structure within the database?
				//  Getting files by path etc?
				// Probably not so much needed, at least to begin with.
				
				// Decent code editing, of different codes, will prove very useful.
				//  This will include various parsing capabilities
				//  Data structures that repesent applications in full.
				//   Having the data structures is one of the main components of a parser anyway.
				//  Some pieces of code will exist as snippets within a system, or as various parsed objects that get rendered to code quickly when needed.
				
				// The GUI will still be a fair bit of work, but I'm sure it will be made more concise by all the language features.
				//  Will want various easy to use drag and drop tools.
				//  Like an uncluttered Visual Studio.
				//  Can drag controls into the page and edit properties rapidly.
				
				// Want things to be very stramlined in comparison to Visual Studio in terms of workflow.
				//  Perhaps providing more of an abstraction?
				//   Node is handling the lower levels, this makes content for the engine which is defined elsewhere.
				
				// More on the platform, ASP / ASP.NET like pages incorporating controls as XML.
				//  I think this could get quite a bit of interest quite quickly.
				//  May be best to test the IDE on the music and art website first???
				//   But also worth being able to have it expand quickly.
				//  Could be run with very restricted data capabilities unless users sign up for the more advanced one.
				//   Could rapidly provision that (maybe have the system do it) and also get a (couple of) decent servers with SSD and decent HD space.
				//    They would take over much of the work.
				//    Analyse the exiting functions.
				//    Could be part of abstract-postgres-generator.
				//   Perform analysis on a function.
				//    Find out which parameters refer to which table.column
				//     Perform analysis on that table.column
				//      Find out if it represents the PK in some way, or is sufficient to identify a single record
				//      Is it unique, and an identifier of the record?
				
				// The generator could store some metadata for the database.
				//  We have the unique fields for tables
				//   Analysing the function to see what the parameters are for...
				//    It it that simple? Do any of them get put in tables?
				//     Used in insert statement, corresponding with fields?
				//     Input_Field_Correspondance
				//     Input_Column_Correspondance
				//      Could have a function to determine that based on the abstract SQL function.
				
				// May have a way of checking what pattern a function follows...
				//  Do want functional analysis to determine this rather than having to retain information from the CRUD generation.
				
				// Identify single insert statement function.
				//  These are the ones that would get overridden
				
				console.log('gen_funs.length ' + gen_funs.length);
				
				
				// scan 0
				//  identify the functions that are used to get a row's id from a single string value.
				//   these will select the id based on a single unique string.
				
				// I think these scans can be put to use in an encapsulated way.
				//  They scan through the ADB, looking for functions that fit a particular pattern and could be used together to put other functionality in place.
				//  They will only find the relevant functions.
				//  They will be more useful still (and amazing to some users) when they have parsed the functions in the DB and know what they do, and can suggest useful
				//   other functions based on the ones that already exist.
				// It will be useful in creating the whole CRUD layer, or incrementally adding pieces to the CRUD system.
				
				// functions for getting the id from the single unique string field
				//  hold some information about the function
				//  what table they are used for, index them by that
				//  the name of the field that they get (probably ID)
				//  the name of the field that they take
				
				var afns_table_id_lookup_from_unique_string = {};
				// when we have the table name, we can use this to refer to the get id function and a bit of info about how it is used.
				
				
				var scan_0 = function() {

					each(gen_funs, function(i, gen_fun) {
						var statements = gen_fun.get('statements');
						if (statements.length() == 1) {
							var statement = statements.get(0);
							var statement_type = statement.get('statement_type');
							if (statement_type == 'SELECT') {
								// is it just selecting the ID?
								
								//console.log('statement ' + stringify(statement));
								//console.log('statement ' + stringify(statement.toString()));
								
								var sl = statement.get('select_list');
								//console.log('tof(sl) ' + tof(sl));
								
								var fi = statement.get('from_item');
								var w = statement.get('where');
								
								console.log('fi ' + stringify(fi));
								// the from item may be a table, not a table name.
								
								// TODO: Fix for when select list is a collection
								if (sl.length == 1) {
									var select_item = sl[0];
									// select item should be the table's PK column.
									//  should only be one PK column.
									//console.log('select_item ' + stringify(select_item));
									//console.log('tof(select_item) ' + stringify(tof(select_item)));
									
									// maybe a string.
									//  if so, refers to a field.
									
									// TODO ancestors
									if (fi instanceof Abstract.Table) {
										console.log('fi is abstract table');
										
										var table_name = fi.get('name');
										// where clause...
										//console.log('w ' + stringify(w));
										var value_is_clause = w[0][1];
										//console.log('tof(value_is_clause) ' + tof(value_is_clause));
										if (tof(value_is_clause) == 'array') {
											//console.log('value_is_clause.length ' + value_is_clause.length);
											if (value_is_clause.length == 2) {
												if (value_is_clause[0] == 'param') {
													// single param.
													
													var column_name = w[0][0];
													console.log('column_name ' + column_name);
													
													// then we can look at the from item table to get that column.
													
													var columns = fi.get('columns');
													
													var column = columns.get(column_name);
													// get the type of the column?
													// TODO: Improvement with getting data object / make it easier to use them?
													var c_dt = column.get('data_type');
													//console.log('c_dt ' + c_dt);
													//console.log('tof c_dt ' + tof(c_dt));
													//console.log('stringify c_dt ' + stringify(c_dt));
													
													if (tof(c_dt) == 'data_object') {
														//console.log('ido');
														c_dt = c_dt.toString();
													}
													//console.log('tof c_dt ' + tof(c_dt));
													// no major problems here.
													//  could maybe be able to query the abstract data type to get more information about it.
													
													// is it a string value?
													//  if so, that's good. want the where clause to be a string value.
													
													var is_string = c_dt.indexOf('char') > 0;
													
													
													if (is_string) {
														// also have a look at the select_item
														
														// selecting a field represented by a string.
														
														if (tof(select_item) == 'string') {
															// get information about that field in the table. it should be the primary key, and the only primary key.
															
															var selected_column = columns.get(select_item);
															
															// does it have a PK constraint?
															var has_pk = column_has_pk_constraint(selected_column);
															//console.log('has_pk ' + has_pk);
															if (has_pk) {
																// do any of the other columns have a PK constraint?
																var other_pk_constraint = false;
																each(columns, function(i, column) {
																	if (column !== selected_column) {
																		if (column_has_pk_constraint(column)) {
																			other_pk_constraint = true;
																		}
																	}
																})
																//console.log('other_pk_constraint ' + other_pk_constraint);
																if (!other_pk_constraint) {
																	// It looks like we have identified a suitable function to use in the overloading procedure.
																	//  This is taking quite a lot of code, but things are mostly cleanly defined so the procedure can
																	//  be put into place without too much difficulty.
																	
																	// Also want to check that the field in the where clause is used to retrieve a column with a unique value
																	
																	// column has unique constraint...
																	//  though this can work with table constrints.
																	// may be better to check that the table has a unique constraint for the column.
																	
																	// Getting these constraints has proved difficult in the past.
																	//  They could be represented as either column or table constraints,
																	//  and Postgres I think sets them up as table constraints when supplied column constraints.
																	//  It's internal representaion of them is fairly relational in INFORMATION_SCHEMA.
																	//console.log('pre tuccns');
																	var tuccns = table_unique_column_constraint_column_names(fi);
																	//console.log('tuccns ' + stringify(tuccns));
																	//throw '1) stop';
																	
																	if (tuccns.length == 1) {
																		// that column should be the one in the where clause.
																		var col_name = column.get('name');
																		//console.log('col_name ' + col_name);
																		
																		if (col_name == tuccns[0]) {
																			// looks like we are good to go
																			//  (or to save the reference to the function as one which can be usef for a particular purpose)
																			
																			afns_table_id_lookup_from_unique_string[table_name] = {
																				'afn': gen_fun,
																				'table_name': table_name,
																				'id_field_name': selected_column.get('name'),
																				'unique_key_field_name': col_name
																			}
																			
																			
																		}
																		
																	}
																	
																	
																	
																}
																
															}
															
															
														}
														
													}
													
													
													
													
												}
												
											}
										}
										
										
									}
									
									
									
								}
								
								//throw('stop');
								//throw '2) stop';
								
								// where field is most interest.
								
								
								
								
								// could check its referring to the right table.
								
							}
						}
						
					});
					
				}
				scan_0();
				
				//console.log('afns_table_id_lookup_from_unique_string ' + stringify(afns_table_id_lookup_from_unique_string));
				// that should be enough info for scan 1, where it identifies which INSERT functions take integer parameters that could be expressed using these strings.
				
				
				//throw '3) stop';
				
				// In this scan we need to identify which INSERT functions could have the overloaded versions made.
				//  Then, keeping the code separate, we generate those insert statements once we have data that will be used as generation parameters.
				//  Then, after a lot of work, we'll have the capability to generate these relatively simple functions
				// Generating a whole set of useful functions will be great.
				
				// Will have other tools for generating functions according to parameters, to do various things.
				//  Checking a record's existance - this could also be an authentication function, or much of one.
				
				var afns_table_insert_row_overloading_candidates = {};
				
				// the function
				//  the table its inserting data into
				//  the parameters that will be overridden
				//  what functions are available to override those parameters
				
				// This has got fairly complicated so far. Still need to get the overridable functions recognised.
				//  A large amount of code to generate a small function.
				
				
				var scan_1 = function() {
					each(gen_funs, function(i, gen_fun) {
						// analyse the function to see if its suitable for overriding.
						//  looking for a function with a single statement for the moment.
						//  that statement is an insert statement.
						
						var statements = gen_fun.get('statements');
						console.log('statements.length() ' + statements.length());
						if (statements.length() == 1) {
							var statement = statements.get(0);
							//console.log('statement ' + stringify(statement.toString()));
							//console.log('statement ' + stringify(statement));
							
							var statement_type = statement.get('statement_type');
							console.log('statement_type ' + statement_type);
							
							// Analysis of the insert functions. Some of them will refer to (id) values in other tables.
							if (statement_type == 'INSERT') {
								// have a look at the parameters.
								
								// look at the statement, they should refer to the parameters.
								
								var table = statement.get('table');
								var columns = table.get('columns');
								var values = statement.get('values');
								
								var table_name = table.get('name');
								console.log('table_name ' + table_name);
								console.log('');
								console.log('');
								console.log('values ' + stringify(values));
								
								// a values are either [field_name, data_type]
								// or [str_field_name], where the type is not given but can be found by looking at the table.
								//  in some cases these will be references to the PK of a different table.
								//  within that that table, the rows may be identifyable as a (string) non-pk indexed value. In such cases we can make an overloaded
								//  function for setting those values. These will be useful for adding data in a more natural way.
								
								// could do a previous select statement function scan to look for functions that are used to get a record from a single string value.
								
								// Values match the parameters, perhaps check the parameters length.
								//  Not much detail in params in SQL functions anyway.
								
								// For each value that gets inserted...
								//var arr_value_and_lookup_info = [];
								
								// still putting together information used to determine if this candidate function can be overridden.
								var value_overrides_info = [];
								var has_at_least_one_overridable_field = false;
								
								each(values, function(i, v) {
									// the length of the value. 2 param/field name, data type
									//                          1 param name
									
									var value_override_info = [];
									
									if (v.length == 1) {
										var val = v[0];
										
										//console.log('v ' + v);
										//console.log('tof(v) ' + tof(v));
										// should refer to a field.
										if (tof(val) == 'string') {
											var referred_column = columns.get(val);
											//console.log('referred_column ' + referred_column);
											// then look at its constrints. It may refer to something else...
											var rc_constraints = referred_column.get('constraints');
											//console.log('rc_constraints ' + rc_constraints.length);
											
											// for each foreign key, keep track of which 
											
											// could have multiple foreign key constraints.
											//  need to get information about these foreign keys for use in writing the function.
											//  also need to determine if the function needs to be written.
											var rc_name = referred_column.get('name');
											console.log('rc_name ' + rc_name);
											
											
											// maybe have a function to get all foreign key constraints from a column
											
											each(rc_constraints, function(i, constraint) {
												// is it a foreign key
												
												var ct = constraint.get('constraint_type');
												//console.log('ct ' + ct);
												if (ct == 'FOREIGN KEY') {
													var target = constraint.get('target');
													
													//console.log('target ' + stringify(target));
													//console.log('hello');
													// OK, so do we have usable class name reflection in JavaScript?
													
													//console.log('*** target instanceof Abstract.Table ' + (target instanceof Abstract.Table));
													
													if ((target instanceof Abstract.Table)) {
														// or something descended from this... need better ancestor instance tracking.
														//  will be able to look at the superclass I think, work this into the current system.
														//  maybe use ancestry.js.
														// possibly can be done by searching up through the prototypes.
														
														// look at the PK for the table if needed, that's the data type.
														//  maybe assume integer for now.
														
														// do we have any functions that get this the id from a string key here?
														//  that function could have already been made.
														
														var tn = target.get('name');
														//console.log('');
														//console.log('');
														//console.log('tn ' + tn);
														
														if (afns_table_id_lookup_from_unique_string[tn]) {
															var lookup_afn_info = afns_table_id_lookup_from_unique_string[tn];
															//console.log('lookup_afn_info ' + stringify(lookup_afn_info));
															
															// we know that that table has a way of accessing its values.
															
															// need to assemble info about this candidate function.
															
															var rc_dt = referred_column.get('data_type');
															
															console.log('rc_dt ' + stringify(rc_dt));
															// should be an integer type (for a PK field).
															//  should have a PK constraint, and be the table's only PK.
															
															// should maybe have more functions for detecting which column has get the primary key constraint.
															
															var pk_column_names = table_columns_with_pk_constraint_names(target);
															console.log('pk_column_names ' + stringify(pk_column_names));
															if (pk_column_names.length == 1) {
																
																//value_override_info
																
																// name of column being overridden: rc_name
																// name of table providing the id to use?
																// name of field within foreign table?
																// the function that is used to get the id from the string in the foreign table: lookup_afn_info
																
																value_override_info = [rc_name, gen_fun, lookup_afn_info];
																has_at_least_one_overridable_field = true;
															}
															
															
														}
													}
													
												}
												
											})
											
											
										}
										
									}
									
									value_overrides_info.push(value_override_info);
								});
								
								// fn_create_user_role(user_username, role_name)
								//  That function would make coding a lot smoother and more intuitive.
								
								// Other functions will inevitably get made with this capability.
								
								console.log('value_overrides_info ' + stringify(value_overrides_info));
								// the original function name
								//  the original function?
								
								if (has_at_least_one_overridable_field) {
									afns_table_insert_row_overloading_candidates[table_name] = [gen_fun, value_overrides_info];
								}
								
								
							}
							
						};
						
						
						
					});
				}
				scan_1();
				// scan 1
				
				// now we should be able to make the functions that do the overloading.
				
				var tables = abstract_schema.get('tables');
				//tables.
				
				each(afns_table_insert_row_overloading_candidates, function(table_name, info) {
					//console.log('table_name ' + tables.);
					// have the original function name here?
					
					
					//  that would be very useful.
					
					// This overriding stuff is really taking a while.
					//  Will also want to generalize it so that other functions can be overridden.
					
					// make_overridden_fn (fn, fields_to_override)
					//  this will work on a more general level, and will do the necessary function analysis.
					//  will be fairly easy to get this generator function making new functions.
					
					
					
					var a_table = tables.get(table_name);
					
					//console.log('info ' + stringify(info));
					
					// we put together the info that is used to make the overloaded function.
					//  This is turning out to be quite large.
					//  The parser will also increase the general capabilites, but be a somewhat difficult thing to make.
					//   Will be very useful for the more general capabilites of the library. Some quite general parsing facilities as well as specific would
					//   be very handy for building JavaScript (projects maybe) out of very high level source.
					//  Could have MetaBench project files that are very high level. They get parsed and used to create projects which have a variety of files
					//   and resources, coded in different languages. Project file could say what system it is to be implemented on too.
					
					// This kind of programming will make the middleware quite large, but will make it fast and easy for the developer to carry out tasks.
					//  Parsing database functions will be a powerful capability, 
					
					
					// This won't be so hard to do now.
					
					var orig_fn = info[0];
					var param_overrides_info = info[1];
					
					var override_info = [];
					
					each(param_overrides_info, function(i, field_override_nvp) {
						var field_name = field_override_nvp[0];
						console.log('field_name ' + field_name);
						
						var fn = field_override_nvp[2].afn;
						var fn_name = fn.get('name');
						// the specific name?
						//  the function's signature?
						//   doubt it would be useful for this simple get id function because there won't be multiple versions of it anyway.
						
						console.log('fn_name ' + fn_name);
						var orig_fn_name = field_override_nvp[1].get('name');
						override_info.push([field_name, fn_name]);
						//override_info.push([orig_fn_name, field_name, fn_name]);
						
						// the field names and functions should be enough to run the function maker function where it replaces the use of parameters directly
						// with the function calls using the functions provided.
						
						// This will now be doing the job of quite a skilled developer.
						//  Various other automatic generation functions are likely to be developed as well, these will carry out some particular and useful tasks
						//   within the database.
						// The abstract generator should be restricted to making code that works in an abstract sense. Can do various checks of records, but
						//  it will still be dealing with DB concepts on the Postgres level. Would not deal with internal types of objects, like 'users' that have
						//  been defined within the database application space, or their roles in the database roles table. Code for implementing these will
						//  be done on a separate level, but will use the abstract generator as a platform.
						
						// There won't be code here to break up XML documents, I think, but the structures that store such documents, and many of the functions
						//  needed, maybe all, will be able to be generated here, but from concepts that represent the specific use case.
						
						
						
						
					})
					
					// the same function name as the other insert statement, the one it's overriding.
					//console.log('info ' + stringify(info));
					//console.log('');
					//console.log('info[1] ' + stringify(info[1]));
					//var oi = [info[1].get('name')];
					//console.log('override_info' + stringify(override_info));
					//console.log('info.length ' + info.length);
					//throw('stop');
					
					// abstract_table, fn_name, parameter_overrides
					//console.log('info ' + stringify(info));
					var fn_o_insert = make_fn_create_override(abstract_schema, gen_funs, a_table, orig_fn, override_info);
					
					gen_funs.push(fn_o_insert);
					
				});
				
				
				console.log('');
				//console.log('afns_table_insert_row_overloading_candidates ' + stringify(afns_table_insert_row_overloading_candidates));
				
				// The overridden (INSERT) functions are proving quite a difficult beast to get the system to make.
				//  Quite a few different things to consider.
				
				// Create a function with parameter overloads... in stead of giving that parameter directly, its a function call
				
				// Looks like we'll need to create the new SQL function, and have it substitute various parameter values for function calls
				//  using that parameter value.
				
				// make_override_create_function (abstract_table, fn_name, parameter_overrides)
				
				
				// I think a good free to use IDE would be good, but do want to charge a subscription of not very much for various users.
				//  Maybe $5/year for something that's very usable for multiple projects, not much storage space, maybe fewer components available.
				//   Sharing over groups could be disabled
				//  $40/year, get plenty of space and integration features.
				
				// MetaBench IDE
				//  Could be used for defining some other things in other services, such as if someone sets up a webcrawler.
				//  
				
				
				
				// Will be useful for maintaining 'libraries' in the conventional sense, where some of it gets selected for particular uses.
				//  Very tight control over the build process.
				
				// Would not be too hard to have the app build things for iOS using HTML5.
				//  But it would probably be quite a large code-base, replicating somewhat abstract structures I have in my system.
				//  Perhaps compilation of code blocks could be brought further into the system.
				
				
				
				
				
				
				
				
				
				
				
				//throw('4) stop');
				
				
				
				
				
				
				
				
			}
			generate_level_1();
			
			
			
		},
	
		'abstract_pk_id_column': function() {
			var pk = new Abstract.Column_Constraint.Primary_Key();
			var res = new Abstract.Column({
				'name': 'id',
				'data_type': new Abstract.Data_Type({
					'text': 'serial'
				}),
				'pk_constraint': pk,
				'column_constraints': [pk]
			});
			return res;
		},
		
		// could just give the table names?
		'abstract_link_table': function(table1, table2) {
			// the two columns, represented with ids, together should be unique.
			//  this will possibly be done though an index.
			
			//  that would be a table constraint.
			//  so that two columns together make a unique combination
			//  what about the index_parameters?
			
			
			
			
			var name = table1.get('name') + '_' + table2.get('name');
			var that = this;
			
			// Foreign key columns.
			//  Each column has a foreign_key parameter.
			//  It can be set to another table.
			
			var cc_fk_1 = new Abstract.Column_Constraint.Foreign_Key({
				'target': table1
			});
			var cc_fk_2 = new Abstract.Column_Constraint.Foreign_Key({
				'target': table2
			});
			
			var col_fk_1 = new Abstract.Column({
				'name': table1.get('single_name') + '_' + 'id',
				'data_type': 'integer',
				'column_constraints': [cc_fk_1]
			})
			var col_fk_2 = new Abstract.Column({
				'name': table2.get('single_name') + '_' + 'id',
				'data_type': 'integer',
				'column_constraints': [cc_fk_2]
			})
			
			//console.log('pre create abstract table.')
			
			var single_name = table1.get('single_name') + '_' + table2.get('single_name');
			console.log('single_name ' + single_name);
			// another constraint, this is the table having two items unique in combination.
			//  not a primary key, but I think this gets indexed fairly well.
			
			var table_constraints = [];
			table_constraints.push(new Abstract.Table_Constraint.Unique({
				'columns': [col_fk_1, col_fk_2]
			}));
			
			var res = new Abstract.Table({
				'name': name,
				'single_name': single_name,
				'columns': [that.abstract_pk_id_column(), col_fk_1, col_fk_2],
				'table_constraints' : table_constraints
			});
			
			if (this.get('schema_name')) {
				res.set('schema_name', this.get('schema_name'));
			}
			
			//console.log('post create abstract table.')
			return res;
			
		},
		
		// Function to generate CRUD / access functions for the tables.
	
	
		
		// functions to ensure various things.
		
		
		
	
		
	
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// Get ID
	//  unique fields supplied
	// Get record 
	//  (id provided)
	//  (overloads)
	// Get record's data fields
	//  Get record and associated records
	
	// Delete
	//  By ID simple enough
	//  Delete all records matching a pattern.
	
	// Read
	//  Read all records in a table
	//  Read all records and associated records in a table or view
	//  Search comes under read.
	//  Read could encompass search, get, get all, get some specific info.
	// Can't say read is at all specific, may have subitems within it.
	// get_id
	// get_record
	// and with many-to-many relationships, may be hard to read everything as a single row anyway.
	//  may not be best always, but would be useful in many situations.
	
	// Security: DB level security.
	//  Will be able to set security properties on the functions, these will be part of abstract-postgres.
	
	// Integrating other security mechanisms within the generated code?
	//  That may be a job for whatever uses this library.
	//  This library would help define the CRUD functions for a website, assuming that the blueprints it is given are secure.
	
	// System level functions may be assumed to be securely called.
	
	// May have user level functions.
	
	// User may wish to delete content.
	// ufn_delete_content(user_id, content_id)
	//  would look at the content and ownership of that content.
	//  may not physically delete it from disk anyway?
	//  could depend on the users's admin level.
	
	// That sounds like a particular security model.
	//  Could put it in the website generator?
	
	// Or abstract-postgres-generator-securelayer
	//  Would mean users have rights to do some things.
	//  But these rights could be associated with objects and content management.
	//  They may have to do with the use of the database, not strictly jsut security.
	//  Kind of a db-on-db.
	
	// Nice to have a security model, hard to define it though.
	
	// When we have the users, roles, etc, using system functions it will be easier to then go on to the next stage in the security model.
	//  There may not be much need to have that actually within the database, but could run within JavaScript code on the server.
	
	// It may still be best to model things outside of the database.
	// Have it so that an abstract web database gets created. 
	//  Then it gets persisted and used.
	
	// So another abstract layer after generator:
	
	//  abstract-web-db-postgres.
	//  this will create the database in the abstract.
	//   will have abstractions to do with security on the database level here.
	//   users will be users within the database
	//   they will have access to functions, but there will be functions that decide whether or not they have permission to do some things.
	//   much of the time these functions will call other functions that follow simple procedures to deduce if a user has permission or not.
	//   will possibly lead to quite an advanced database server.
	
	// Users may try to do functions like save content, load content.
	//  That should be fine so long as its going to their own file path / they have permission wherever it is going.
	
	
	
	
	
	
	
	
	
	
	//  web-db-postgres will persist it.
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// The ownership mechanism could be established within the database structure.
	
	// Generating a security layer... that is not outside the realms of this generator module.
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// Get covering read and search?
	
	
	
	
	// Keeping track of these functions that get made.
	//  So if we are able to get_id_by_x we are able to use x as a parameter for some other functions.
	
	// Some functions would use others (but would not necessarily have to)
	//  Could have it an option to use these other functions or not, to inline them.
	
	// Function naming scheme.
	//  Function lookup. Will be able to find the 'get id' [table] unique[val1, val2]
	
	// Get functions
	//  When we have the unique fields representing the record.
	//  Could get by the PK, or some other unique fields. Should return 1 or 0 records.
	
	// Search functions
	//  When we are proving some fields that may identify record(s)
	
	
	
	
	
	
	
	
	// Other functions when the meaning of tables and purposes is known.
	//  Requires knowledge of domain model, and application of domain model to app model.
	
	// authenticate
	
	
	
	
	//   Should probably create a whole bunch of functions in response to input?
	
	
	
	
	
	
	
	
	
	
	
	
	// this will return the generator object.
	
	// It will wrap the Abstract Postgres Schema.
	
	// With that done, it will modify abstract postgres dbs and schemas
	
	// It will hold metadata too, perhaps even a domain model which is used to generate things.
	//  Particular metadata:
	//  An index of what various functions are.
	
	// A matrix of possible functions.
	//  There would be loads of possibilities for things based on different parameters.
	//  User expresses how they want to access data, functions are made.
	
	// Eg being able to overload some parameters with string values, and have the id looked up using the string and the correct function.
	
	// The application having a bit more of a model of the mechanics of the database system.
	//  Knowing which are the important, or data containing, fields for example.
	
	// A PK could be the username itself.
	// In my DBs it generally is not, and the PK is just a number.
	//  Tell it that the field 'username' actually is the username.
	//  (though it could deduce it by it being a unique string value)
	
	// Automated value lookup would be a very useful feature.
	//  Want it so that the right functions are available.
	
	
	// May have another layer / module that sets up the abstract postgres database as a website one.
	
	// Generator hints may make the most sense.
	//  Telling it that a certain column (in the abstract model) is representative of the object.
	
	// But having it deduce things through unique constr5aints would make sense too.
	//  Getting code out of dbi-postgres may be a good motivation for this.
	
	// The CRUD generation is done on the abstract level.
	
	/*
	var CRUD = {
		// need item singular name.
			
		// or DBI_Postgres.make_fn_create?
			
		// Could be within CRUD object.
			
		
		// Better to do this with the abstract schema, and then have these persisted to the database.
		
		'ensure_table_CRUD': function(dbi_postgres, abstract_table) {
			// uses the existing abstract_table.
			
			// get all the CRUD functions.
			
			// Then ensure they are in the DB.
			
			// want to get the name from the abstract_table.
			
			console.log('* abstract_table ' + stringify(abstract_table));
			
			var single_name = abstract_table.single_name;
			
			if (!single_name) {
				single_name = dbi_postgres.single_and_plural.single(abstract_table.name.toLowerCase())
				console.log('* single_name ' + single_name);
				
			}
			console.log('single_name ' + single_name);
			abstract_table.single_name = abstract_table.single_name || single_name;
			var fn_create = CRUD.fn_create(abstract_table);
			
			console.log('fn_create ' + fn_create.to_create_or_replace_str());
			
			
		}
		
	}
	*/
	
	// This seems like it is in the right sort of place.
	//  Maybe lower level?
	//  Keep it as var for the moment.
	
	
	
	// creates a function based on a table.
	//  seems like a good way of doing things here, but want them exposed too.
	

	var create_function_check_record_existance = function(fn_name, table, field_names) {
		
		var table_name;
		
		if (tof(table) == 'object') {
			table_name = table.name;
		} else if (tof(table) == 'string') {
			// its just the name. maybe we need to load up the abstract table and use that.
			
			throw 'Abstract.Table required';
		}
		
		// just with the table name?
		//  no abstract table?
		
		// Could load the abstract table from the DB of course.
		//  Or could get the required information with just the table name.
		
		
		
		
		// also the field types?
		//  that could require looking at the abstract_table
		var params = [];
		
		var map_table_columns = mapify(table.columns, 'name');
		//console.log('map_table_columns ' + stringify(map_table_columns));
		
		
		// will need to refer to the table for its
		
		// possibly use function parameter items?
		
		var where = [];
		// where fields match parameters...
		var c = 1;
		each(field_names, function(i, field_name) {
			// best to look at a map of the table's fields.
			
			var a_column = map_table_columns[field_name];
			// then with the column you get the parameter.
			
			// param string?
			
			var param_ref = '$' + c;
			
			params.push([a_column.name, a_column.toDataTypeString()]);
			
			// but need to say it is a parameter reference.
			//  perhaps we should use actual Abstract function parameter objects.
			//  then it is clearer when the where clause refers to parameters.
			//where.push([field_name, param_ref]);
			where.push([field_name, ['param', param_ref]]);
			
			c++;
		});
		
		
		// where the parameters match.
		
		//  need to match what the function is called with.
		
		
		
		
		var statements = [];
		statements.push(new Abstract.Select({
			'from_item': new Abstract.Exists({
				'subquery': new Abstract.Select({
					'select_list': '*',
					'from_item': table,
					'where': where
				})
			})
			
		}));
		
		//  From Function:
		//this.name = spec.name;
		//this.parameters = spec.parameters || spec.params || [];
		//this.statements = spec.statements || [];
		//this.return_type = spec.return_type;
		
		// will be a select exists statement.
		
		var fn = new Abstract.SQL_Function({
			'name': fn_name,
			'parameters': params,
			'statements': statements,
			'return_type': 'boolean'
		});
		
		//var sql = fn.to_create_or_replace_str();
		//console.log('sql ' + sql);
		
		// nice, seems to work so far.
		
		//this.s_query(sql, callback);
		
		return fn;
	};
	
	var table_unique_constraints = function(abstract_table) {
		// this could use an indexing system, that will make the code here simpler when it is done.
		
		var tcs = abstract_table.get('constraints');
		console.log('tcs.length ' + tcs.length());
		var res = [];
		each(tcs, function(i, constraint) {
			if (constraint.get('constraint_type') == 'UNIQUE') {
				res.push(constraint);
			}
		});
		
		// then for every column we need to look for the unique column constraints.
		//  ???
		
		
		return res;
		
	}
	
	var column_has_pk_constraint = function(abstract_column) {
		// TODO: Could be made more efficient, breaking the loop and not scanning all of them.
		var res = false;
		each(abstract_column.get('constraints'), function(i, v) {
			var constraint_type = v.get('constraint_type');
			//console.log('***** constraint_type ' + constraint_type);
			//console.log('***** constraint_type ' + tof(constraint_type));
			if (constraint_type == 'PRIMARY KEY') {
				res = true;
			}
			
			
		});
		return res;
		
	};
	
	var table_columns_with_pk_constraint_names = function(abstract_table) {
		var columns = abstract_table.get('columns');
		var res = [];
		each(columns, function(i, column) {
			if (column_has_pk_constraint(column)) {
				res.push(column.get('name'));
			}
		});
		return res;
	}
	
	var table_unique_column_constraints = function(abstract_table) {
		// go through all of the columns looking for a unique constraint.
		
		var res = [];
		var columns = abstract_table.get('columns');
		each(columns, function(i, column) {
			
			var column_constraints = column.get('constraints');
			console.log('column_constraints.length ' + column_constraints.length);
			each(column_constraints, function(i, column_constraint) {
				console.log('column_constraint ' + stringify(column_constraint));
				if (column_constraint.get('constraint_type') == 'UNIQUE') {
					res.push(column_constraint);
				}
			});
		});
		return res;
	};
	
	//var table_
	
	
	var table_unique_column_constraint_column_names = function(abstract_table) {
		// go through all of the columns looking for a unique constraint.
		
		var res = [];
		var columns = abstract_table.get('columns');
		each(columns, function(i, column) {
			var column_constraints = column.get('constraints');
			console.log('column_constraints.length ' + column_constraints.length);
			each(column_constraints, function(i, column_constraint) {
				console.log('column_constraint ' + stringify(column_constraint));
				if (column_constraint.get('constraint_type') == 'UNIQUE') {
					res.push(column.get('name'));
				}
				
			});
			
		});
		return res;
	};
	
	// a bit hacky now, with taking other functions too.
	//  will look at the gen_funs.
	// Will do more to do with relationships between object.
	//  Dealing with newly generated objects and keeping them separate in a way / marking them until the change has been confirmed.
	// For the moment, will implement this useful functionality without more of a coding framework.
	//  This functionality forms part of a code framework in itself.
	
	var schema_get_function_by_name = function(abstract_schema, other_functions, function_name) {
		// functions are in a collection.
		
		// currently not indexed by name as there are duplicates.
		//  may set it up so that they are still indexed by name in a system that allows duplicates.
		
		var functions = abstract_schema.get('functions');
		console.log('functions.length() ' + functions.length());
		var c = 0;
		var res;
		
		if (res) {
			each(functions, function(i, afn) {
				var name = afn.get('name');
				console.log('name ' + name);
				if (name == function_name) {
					if (c == 0) {
						res = afn;
						c++;
					} else {
						throw 'More than one function with name ' + function_name + ' found in table ' + abstract_table.get('name');
					}
					
				}
			});
		} else {
			c = 0;
			each(other_functions, function(i, afn) {
				var name = afn.get('name');
				console.log('name ' + name);
				if (name == function_name) {
					if (c == 0) {
						res = afn;
						c++;
					} else {
						throw 'More than one function with name ' + function_name + ' found in table ' + abstract_table.get('name');
					}
					
				}
			})
		}
		
		
		
		
		
		return res;
		
	}
	
	
	
	
	var make_fn_get_id_by_unique_column = function(abstract_table) {
		
		// may return nothing.
		
		// this finds out what the unique column is.
		
		// then it makes the function to get by that unique column.
		
		// later, these kinds of functions / patterns wil be identifyable from the database.
		//  may have a way of comparing found functions to function archetypes
		
		//var tcs = abstract_table.get('constraints');
		//each(tcs, function(i, v) {
		//	ct = v.get('constraint_type');
		//	console.log('ct ' + ct);
		//});
		
		var tucns = table_unique_column_constraint_column_names(abstract_table);
		//console.log('tucns.length ' + tucns.length);
		
		
		if (tucns.length == 1) {
			// got a single constraint, can find out the column.
			
			// then will make the function that gets the id based on that column's value.
			//  not very hard to do!
			
			// Then these lookup functions will be used when creating easier to use functions for things that link between tables.
			//  It is requiring quite a lot of programming for this, but that is going to lead to a very well-rounded system.
			//  Bit by bit this is coming into shape, but more is needed.
			//  Storage of blocks/chunks will be very useful for the user interface.
			// Storage of JavaScript code as a reqource will be useful too.
			//  This extra layer of adaptivity is taking a while to make, but its worth making the structure
			//   Details can be put in later
			//   JavaScript parsing, compilation, building.
			//   These things should fit in in a modular way.
			//    Compiling Postgres code is useful so far!
			// Will do a lot more to do with compilation of code when objects can be defined in an abstract sense.
			//  An iOS object model in objective-c would be a nice option, with SQLite and a DB backend that's been made and is accessed through JSON.
			//  Could provide quite a powerful and reliable application framework with this tool.
			
			// I think users having their own file system will be enough.
			//  I won't want to be making DB changes when the DB is up.
			//  However, the admin system will be built for that possibility.
			//   Database changes could be dealt with as entities in their own right and have server code run them, following a set methodology.
			
			// Will have a fairly versitile website up, and a relatively simple API for dealing with persisted objects and who has permission to do what.
			//  Server-side node code will use these to show pages, sites etc.
			//  Objects retrieved from the DB get shown to the website user.
			//  Objects may be considered to be 'published' on a website, they can be edited without being published on the server first.
			//console.log('name ' + abstract_table.get('name'));
			//console.log('tucns ' + stringify(tucns));
			// Should be very good for easy administration of images. Will be very satisfying to make the client-side code once the server-side code is running nicely.
			//  Assets could possibly be stored on disk too, may perform better than retrieving them from the database.
			//  I think keeping the data in the database for now makes a lot of sense, as things will be self-contained, and would be very cool to render/compile
			//   assets for the site from the database. Following a routine to compile the JavaScript would be cool, but that's a bit further off.
			//  Will just store JavaScript files too.
			//  Will also develop abstract codebase facilities. Code objects could be stored in the database (patterns too) and be used where needed, and shown with a nice
			//   gui for drag and drop. Could possibly increase productivity a lot.
			
			//console.log('one unique constraint.');
			
			// find out what column it is.
			//  we should be able to get that from the parent.
			//  building up the Data_Object and Collection network, tree and indexing system.
			// Perhaps Data_Object and collection should be merged?
			//  It would have very flexible internals anyway.
			// Think we do need to get the relationships.parent system working.
			//  That could involve quite a bit of thinking and writing code.
			//  Will be very useful / essential when dealing with HTML and the DOM as well.
			// The parent of an item in a collection is not the collection, but the item holding the collection.
			//  Could be an important distinction between Collection and Data_Object.
			//   They may get used quite differently, also it's in keeping with backbone.js.
			
			// Having the parent/relationship system working well would be very advantageous here.
			//  Want it so that when constraints get added to tables, they are processed by having it noted that their parent is the table
			//   and possibly what ordinal position as well.
			
			// May be useful to make a test example for this, make sure that it's working with a data system.
			//  Could make various categories of things, put them in sets/collections, and in other data objects, and see that we can get information about the
			//   parent data_object/collection without too much difficulty.
			
			// Then can put the function together.
			
			// By default, a few more things will be made.
			// Make the programmatic control over what gets generated a bit easier / more precise / clearly defined.
			//  Could make a few examples, but these may be best seen with the system actually running.
			//  May want to integrate system into unit tests.
			
			// is the 'id' field for the moment.
			
			var fn_name = 'fn_' + abstract_table.get('single_name') + '_get_id_by_' + tucns[0];
			//console.log('fn_name ' + fn_name);
			
			var params = [];
			//var statements = [];
			
			
			var columns = abstract_table.get('columns');
			
			// then the columns... should probably be a collection, indexed by name.
			//  this should probably be set up from the spec if it is given as an array.
			
			//.get(tucns[0]);
			
			var coldtt = columns.get(tucns[0]).toDataTypeString();
			
			//var coldtt = col.toDataTypeString();
			
			var where = [];
			where.push([tucns[0], ['param', '$1']]);
			
			params.push([tucns[0], coldtt]);
			
			var statements = [new Abstract.Select({
				'select_list': ['id'],
				'from_item': abstract_table,
				'where': where
			})];
			
			var fn_get = new Abstract.SQL_Function({
				'name': fn_name,
				'parameters': params,
				'statements': statements,
				
				// could just be one statement.
				'return_type': 'integer'
			});
			
			//console.log('fn_get ' + fn_get);
			
			return fn_get;
			
			//throw ('no problem');
			

			/*
			var fn_name = 'fn_' + table.get('single_name') + '_get_by_' + v[1];
			//console.log('fn_name ' + fn_name);
			
			// need to find out what that parameter type is, the one we are getting it by.
			//  also should be unique.
			
			var cd = table.get_column_dict();
			
			// 2nd paramter could be a column.
			//  means get by that column.
			
			// not needing to do parameter shifting here.
			
			var col = cd[v[1]];
			
			//console.log('***');
			//console.log('col ' + stringify(col));
			
			if (col.is_unique) {
				// we can do it.
				
				var coldtt = col.toDataTypeString();
				// put the function together.
				
				
				// * 'name': fn_name,
				//	'parameters': params,
				//	'statements': statements,
				//	'return_type': 'boolean'
				// * 
				// * 
				
				
				var params = [];
				
				// it knows the data type.
				
				params.push([v[1], coldtt]);
				
				var where = [];
				
				
				
				where.push([v[1], ['param', '$1']]);
				
				// and the sql statements
				
				// a very simple statement.
				var statements = [new Abstract.Select({
					'select_list': ['id'],
					'from_item': table,
					'where': where
				})];
				
				// can we get the type of the primary key row?
				
				// assume it's an integer for the moment?
				
				
				// SELECT [id] FROM tablename where paramcolumn = paramvalue
				
				// params.push([a_column.name, a_column.toDataTypeString()]);
				
				var fn_get = new Abstract.SQL_Function({
					'name': fn_name,
					'parameters': params,
					'statements': statements,
					
					// could just be one statement.
					'return_type': 'integer'
				});
				
				// should go within the crud_index at some point.
				
				
				// not just in the map, but in the crud_index with that signature.
				
				if (!is_defined(fn_pos_map[fn_get.get('name')])) {
					
					
					abstract_schema.functions.push(fn_get);
					
					
					
					
					// I think only a single one for the moment.
					
					// get and with just the string signature.
					
					//that.crud_index['get'][table_name] = fn_create;
					
				}
				
				//var sql = fn_get.to_create_or_replace_str();
				//console.log('');
				//console.log('');
				//console.log('');
				//console.log('sql ' + sql);
				
				// 
				
				// abstract_schema.functions.push(fn_create);
				
			} else {
				throw 'The column must be unique for the get function like this';
				
			}
			
			
			*/
			
		}
		
		
	}
	
	// make an overloaded create function.
	//  this will be used in the generation phase
	
	// may have more general code for creating an overloaded function.
	//  may have a version that has all the needed data from functional analysis, and another that performs it.
	// Functional analysis could be looking at (parsing if necessary) all the functions and comparing them to patterns (perhaps abstract functions) to detect matches.
	
	
	
	// this could have access to the original function too.
	//  quite a lot of work goes into getting the information needed to carry out this override.
	// This function / the functions that get made will certainly be very useful in the (rapid) deployment of internet services.
	
	// A framework of function generation should be made, so that they get made in a more uniform way.
	
	// could maybe look in the table for the schema with the relationships.
	var make_fn_create_override = function(abstract_schema, additional_functions, abstract_table, original_fn, parameter_overrides) {
		console.log('abstract_schema ' + abstract_schema);
		// There will be another function for creating wrapper overrides, functions that only wrap the original function rather than replicate
		//  its functionality using function call lookups on some parameters.
		
		// Recreating a modified version of any original function should be possible though, that will prove to be an interesting challenge and 
		//  a very useful piece of functionality too.
		
		// I think a lot of this will be available in a paid-for client-side app.
		//  May work out licensing deals for the code with other companies.
		//  Negotiate about paying development costs too.
		//  Maybe a company could pay $10K for a source code license, and a relatively small amount of work adding additional functionality
		//   (guideline of 4 additional features)???
		//  Maintaining other companies' builds?
		//   Incorporating new features into a main build...
		//  This whole system will get fairly large. It will be very good to finish some pieces of it.
		
		// Will be very good to have the code well organized into files.
		
		// every parameter will be overridden?
		//  maybe better to use an overrides map / say its a map. It's an array, but that can work as a map with integer keys.
		console.log('');
		console.log('');
		console.log('parameter_overrides ' + stringify(parameter_overrides));
		
		// override [0] field_name write with call to [1] function
		
		//var param_ov_map = mapify(parameter_overrides);
		var map_po = {};
		each(parameter_overrides, function(i, v) {
			map_po[v[0]] = v[1];
		});
		
		console.log('');
		console.log('map_po ' + stringify(map_po));
		
		//var name = fn_name || 'fn_create_' + (abstract_table.get('single_name') || (abstract_table.get('name')));
		var name = original_fn.get('name');
		var params = [];
		
		// and column and value pairs.
		var insert_values = [];
		var has_serial = false;
		// can see what the primary key column is
		//  and if it has a serial data type.
		
		var param_num = 0;
		
		each(abstract_table.get('columns'), function(i, column) {
			//console.log('column.data_type ' + stringify(column.data_type));
			//console.log('column ' + stringify(column));
			var column_name = column.get('name');
			
			// look at the column, and see if its one of the ones that has the override.
			
			if (map_po[column_name]) {
				// then we use a function call for this.
				//  should be able to look at the function
				
				var get_id_fn_name = map_po[column_name];
				console.log('get_id_fn_name ' + stringify(get_id_fn_name));
				var get_id_fn = schema_get_function_by_name(abstract_schema, additional_functions, get_id_fn_name);
				console.log('tof(get_id_fn) ' + tof(get_id_fn));
				// get the data type of its param.
				
				var fn_params = get_id_fn.get('parameters');
				console.log('fn_params ' + stringify(fn_params));
				
				// hmmm get(0) not working right.
				//  sig not showing
				//   could be a bug in fp.
				//   May possibly fix that and release another developer preview.
				var p0 = fn_params.get(0);
				console.log('p0 ' + stringify(p0));
				
				// it's not a Param object I think???
				//  should it be?
				
				//var dt = p0.get('str_data_type');
				var dti = p0.get(1);
				
				
				console.log('dti' + stringify(dti));
				var dt = dti.get();
				console.log('dt ' + dt);
				
				//
				
				// so, got the type of the parameter now, the parameter that is replacing the original one.
				
				
				
				// we use this for both the param and the insert statement.
				// then get the data type of the single parameter for that function.
				
				// Create the function a bit like before, but with the function calls in their place, and with different param data types.
				
				
				//var column_override_info = map_po[column_name];
				params.push([column_name, dt]);
				
				// Will be inserting a function call result.
				//  So an abstract function call should be fine here.
				//insert_values.push([column.get('name'), column.get('data_type').get('text')]);
				
				// will be inserting a value from a function call.
				
				// the value is a function call.
				
				var fc = new Abstract.Function_Call({
					'function_name': get_id_fn_name,
					'parameters': ['$' + (param_num + 1)]
				});
				param_num++;
				
				console.log('');
				console.log('inserting fc');
				//throw '6) stop';
				insert_values.push([column.get('name'), fc]);
				
				
				
			} else {
				

				// if it's not serial, then use it
				var cdt = column.get('data_type');
				
				if (tof(cdt) == 'string') {
					
					
					params.push([column.get('name'), column.get('data_type')]);
					insert_values.push([column.get('name', column.get('data_type'))]);
				} else {
					if (column.get('data_type').get('text')) {
						if (column.get('data_type').get('text') != 'serial') {
							
							
							
							
							// data type will be different, will be the data type of the function that is used.
							//  look at the function that's a replacement for that column name.
							
							//var column_name = column.get('name');
							
							console.log('');
							console.log('');
							console.log('column_override_info ' + stringify(column_override_info));
							
							params.push([column_name, column.get('data_type').get('text')]);
							
							// Will be inserting a function call result.
							//  So an abstract function call should be fine here.
							insert_values.push([column.get('name'), column.get('data_type').get('text')]);
							
							
						} else {
							has_serial = true;
						}
					}
				}
				
			}
			
			
			
		});
		
		var stmt_insert = new Abstract.Insert({
			'table': abstract_table,
			'values': insert_values
		});
		
		// and select the select currval('table_id_column_seq');
		
		var statements = [stmt_insert];
		
		if (has_serial) {
			// get the newly generated value.
			
			// SELECT currval('tablename_sequence_id'); gets used.
			
			// before this we want to know the name of the sequence that is used in the table.
			//  this will be obtainable through information_schema.
			
			// will only 1 sequence be used per table? Multiple ones could be used, I think.
			//  so will get an array of table sequences or a single item.
		}
		
		
		var fn = new Abstract.SQL_Function({
			'name': name,
			'parameters': params,
			'statements': statements,
			'return_type': 'void'
		});
		
		var fn_sql = fn.to_create_or_replace_str();
		console.log('fn_sql ' + fn_sql);
		
		//throw ('5) stop');
		
		// or just return the abstract function.
		return fn;
		
	}
	
	
	var make_fn_create = function(abstract_table, fn_name) {
		
		//var name = fn_name || 'fn_create_' + (abstract_table.single_name || (abstract_table.name + '_record'));
		var name = fn_name || 'fn_create_' + (abstract_table.get('single_name') || (abstract_table.get('name')));
		var params = [];
		
		// and column and value pairs.
		var column_values = [];
		
		var has_serial = false;
		// can see what the primary key column is
		//  and if it has a serial data type.
		each(abstract_table.get('columns'), function(i, column) {
			//console.log('column.data_type ' + stringify(column.data_type));
			//console.log('column ' + stringify(column));
			
			// if it's not serial, then use it
			var cdt = column.get('data_type');
			
			if (tof(cdt) == 'string') {
				params.push([column.get('name'), column.get('data_type')]);
				column_values.push([column.get('name', column.get('data_type'))]);
			} else {
				if (column.get('data_type').get('text')) {
					if (column.get('data_type').get('text') != 'serial') {
						params.push([column.get('name'), column.get('data_type').get('text')]);
						column_values.push([column.get('name'), column.get('data_type').get('text')]);
					} else {
						has_serial = true;
					}
				}
			}
			
		});
		
		var stmt_insert = new Abstract.Insert({
			'table': abstract_table,
			'values': column_values
		});
		
		// and select the select currval('table_id_column_seq');
		
		var statements = [stmt_insert];
		
		if (has_serial) {
			// get the newly generated value.
			
			// SELECT currval('tablename_sequence_id'); gets used.
			
			// before this we want to know the name of the sequence that is used in the table.
			//  this will be obtainable through information_schema.
			
			// will only 1 sequence be used per table? Multiple ones could be used, I think.
			//  so will get an array of table sequences or a single item.
		}
		
		
		var fn = new Abstract.SQL_Function({
			'name': name,
			'parameters': params,
			'statements': statements,
			'return_type': 'void'
		});
		
		//var fn_sql = fn.to_create_or_replace_str();
		//console.log('fn_sql ' + fn_sql);
		
		// or just return the abstract function.
		return fn;
		//return fn_sql;
	}

	
	// overwridden functions.
	
	// may have function that creates overridden / 2nd level functions.
	//  they will call on the more basic CRUD functions.
	
	
	
	var create_access_function = function(abstract_function, new_signature) {
		// creates a new function to access another
		// with the same name
		
		// calls other functions to load the values.
		
		
		
	
	};
	

	/*
	
	// ensure that there is a record check function.
	'ensure_fn_check_record_existance': function(fn_name, table, field_names, callback) {
		var fn = create_function_check_record_existance(fn_name, table, field_names);
		
		var sql = fn.to_create_or_replace_str();
		//console.log('sql ' + sql);
		
		// nice, seems to work so far.
		
		this.s_query(sql, callback);
		
		
	},
	
	
	// when operating within the generator,
	//  should be told the schema, table (and the name of the function)
	//  could work out the name of the function.
	
//  perhaps this could take more parameters, such as the pk sequence name.
	//  could possibly make some new functions within the generator
	//   so that they can be added to the abstract schema only when needed.
	
	// make the function... make it within the generator or the schema...
	//  could have the generator track proposed changes,
	//  that could be very useful in the client app.
	//  extra work for now?
	
	// I do think those two steps make the most sense.
	
	
	

	'make_fn_create': function(abstract_table, fn_name) {
		
		// may want to make other versions of this.
		//  I think elsewhere I will have make_overloaded_lookup_fn.
		
		
		// since we can... we can get the information about sequences for that table.
		//  that would be useful for getting the new ID.
		
		// we can get the 'default' value for the primary key.
		
		
		
		// there could be other create functions.
		//  we may wish to create a user_role, which 
		
		
		
		
		// composes the SQL to create or alter the function.
		//  chooses a name according to convention.
		
		// Compose in the abstract, using function and parameters.
		//  Want some kind of modelling of the procedural SQL so it can be composed.
		
		// use the single_name.
		
		//var name = fn_name || 'fn_create_' + (abstract_table.single_name || (abstract_table.name + '_record'));
		var name = fn_name || 'fn_create_' + (abstract_table.single_name || (abstract_table.name));
		var params = [];
		
		
		
		
		
		// parameters, body, statements
		
		// go through the columns making parameters for the relevant ones.
		
		// insert into ...
		
		// and insert the values into the correct columns
		
		
		
		// and column and value pairs.
		var column_values = [];
		
		var has_serial = false;
		// can see what the primary key column is
		//  and if it has a serial data type.
		
		
		
		
		each(abstract_table.columns, function(i, column) {
			//console.log('column.data_type ' + stringify(column.data_type));
			//console.log('column ' + stringify(column));
			
			// if it's not serial, then use it
			var cdt = column.data_type;
			
			if (tof(cdt) == 'string') {
				params.push([column.name, column.data_type]);
				column_values.push([column.name, column.data_type]);
			} else {

				if (column.data_type.text) {
					
					if (column.data_type.text != 'serial') {
						params.push([column.name, column.data_type.text]);
						column_values.push([column.name, column.data_type.text]);
					} else {
						has_serial = true;
					}
					
					// and the function contains an insert statement.
					
					
					
					
					
				}
			}
			
			
			
		});
		
		var stmt_insert = new Abstract.Insert({
			'table': abstract_table,
			'values': column_values
		});
		
		// as well as the insert statement, should get the id of the newly created row if approperiate.
		//   perhaps this will have been specified.
		
		// may have special case when a serial data type is used.
		//  may have a way of referering to the id column.
		//  need to know the sequence name for the table
		//  (though there could maybe be more than one sequence).
		//  hopefully we get the primary key sequence.
		
		// Returning the new ID would be a really nice touch.
		
		
		
		
		
		// and select the select currval('table_id_column_seq');
		
		var statements = [stmt_insert];
		
		if (has_serial) {
			// get the newly generated value.
			
			// SELECT currval('tablename_sequence_id'); gets used.
			
			// before this we want to know the name of the sequence that is used in the table.
			//  this will be obtainable through information_schema.
			
			// will only 1 sequence be used per table? Multiple ones could be used, I think.
			//  so will get an array of table sequences or a single item.
			
			
			
		}
		
		
		var fn = new Abstract.SQL_Function({
			'name': name,
			'parameters': params,
			'statements': statements,
			'return_type': 'void'
		});
		
		//var fn_sql = fn.to_create_or_replace_str();
		//console.log('fn_sql ' + fn_sql);
		
		// or just return the abstract function.
		return fn;
		//return fn_sql;
	},
	
	
	
	
	
	
	
	

	// Maybe will be in abstract.
	'abstract_pk_id_column': function() {
		var pk = new Abstract.Column_Constraint.CC_PK();
		var res = new Abstract.Column({
			'name': 'id',
			'data_type': new Abstract.Data_Type({
				'text': 'serial'
			}),
			'pk_constraint': pk,
			'column_constraints': [pk]
		});
		return res;
	},
	
	// foreign key column too?
	
	
	// This abstract module will generate link tables, it will no longer be part of dbi_postgres.
	
	
	
	
	
	// generating property access functions for the abstract schema?
	
	
	// Probably shoudl not be here... better to have it in the abstract generator.
	
	// Won't refer to the dbi-postgres
	//  But will carry out work on the abstract schema
	
	
	// index for the schema we are working on!!!
	
	
	
	*/
	
	return Abstract_Postgres_Generator;
	
	
	
});

