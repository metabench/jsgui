
define(["./jsgui-lang-util"], function(jsgui) {
	
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
	
	
	
	
	
	
	
	var Data_Object = jsgui.DataObject;
	// The Data_Object may have a few more features added to it.
	// Receiving and sending on event bubbling
	// Other use of a heirachy.
	// Parent objects.
	// Structure.
	// Having this structure, and knowing the parent, would be useful for many things, including event bubbling.
	//  And there may be collections within it 
	
	
	
	
	
	var Class = jsgui.Class, arrayify = jsgui.arrayify, fp = jsgui.fp;
	var tof = jsgui.tof, is_defined = jsgui.is_defined, each = jsgui.each, stringify = jsgui.stringify, arrayify = jsgui.arrayify, mapify = jsgui.mapify;
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
		
			
		
			
	
		'Database': Data_Object.extend({
			'init': function(spec) {
				
				
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
				
				
				
				
				
				
				
				
				
				
				
				this.set('schemas', spec.schemas);
				
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
				
				
				
				
				
				
				
				
				//this.tables = spec.tables || [];
				this.set('tables', spec.tables || []);
				
				// may be best to have the tables be a collection so that it can be get or set when a new one is put in.
				
				
				
				
				// function collection - need to be able to keep track of functions of the same name but with different signatures.
				//  when there are functions of the same name but different sigs, a map could be put in place.
				
				
				
				
				//this.functions = spec.functions || [];
				this.set('functions', spec.functions || []);
				
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
		
		
		
		
		
		'SQL_Function': Data_Object.extend({
			'init': function(spec) {
				// Function Parameters
				// Function body
				
				// Could be composed of statements that get put together, or just text.
				//this.name = spec.name;
				
				this.set('name', spec.name);
				
				//this.arguments = spec.arguments;
				this.set('parameters', spec.parameters || spec.params || []);
				
				//this.parameters = spec.parameters || spec.params || [];
				//this.statements = spec.statements || [];
				
				this.set('statements', spec.statements || []);
				
				// the normal SQL language runs faster though.
				//  Should be fine for insert statements.
				
				//this.return_type = spec.return_type;
				
				this.set('return_type', spec.return_type);
				
				//this.language = spec.language || 'SQL';
				//this.language = 'SQL';
				
				this.set('language', 'SQL');
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
			
			// not sure about this function here???
			'get_signature': function() {
				var res = [];
				//var res = ['['];
				var first = true;
				each(this.get('parameters'), function(i, param) {
					// look at the parameter data type.
					if (!first) {
						res.push(',');
					} else {
						first = false;
					}
					
					//console.log('param ' + stringify(param));
					
					// the param may not be a proper / full abstract sql parameter.
					
					if (tof(param) == 'array') {
						var dts = param[1];
						if (dts.indexOf('char') > -1) {
							res.push('s');
						} else if (dts.indexOf('int') > -1) {
							res.push('i');
						}
						
					} else {
						res.push(param.get_signature());
					}
					
				});
				
				//res.push(']');
				
				return res.join('');
				
			},
			'toString': function() {
				// Puts the arguments together and the body.
				
				// fn name?
				
				
			},
			'to_create_or_replace_str': function() {
				// could compose the create or replace function statement as an OO statement.
				
				var res = [];
				res.push('CREATE OR REPLACE FUNCTION ' + this.name);
				
				res.push('(');
				
				var first = true;
				each(this.get('parameters'), function(i, param) {
					if (!first) {
						res.push(', ');
					} else {
						first = false;
					}
					// the param will have both a name and a data type.
					
					// should be OK with varchar(n) as function parameters...
					//  we'll see if it works.
					
					// just the types given, not the parameter names.
					
					if (tof(param) == 'array' && param.length == 2) {
						//res.push(param[0]);
						//res.push(' ');
						res.push(param[1]);
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
				
				// a way to get the class name of an item?
				
				
				// could have a reference to the function itself... but probably won't use that.
				this.set('function_name', spec.function_name);
				
				//var that = this;
				//if (spec.num_parameters)
				if (is_defined(spec.parameters)) {
					//console.log('tof(spec.parameters ' + tof(spec.parameters));
					if (tof(spec.parameters) == 'number') {
						var params = this.set('parameters', []);
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
				var res = [this.function_name];
				//console.log('params ' + stringify(this.parameters));
				
				res.push('(');
				// each param... add its value?
				
				//  but could be a parameterised function all.
				var first = true;
				
				each(this.get('parameters'), function(i, param) {
					if (!first) {
						res.push(',');
					} else {
						first = false;
					}
					if (tof(param) == 'string') {
						res.push(param);
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
				//this.name = spec.name;
				this.set('name', spec.name);
				// or could hold a full data_type object.
				//this.str_data_type = spec.str_data_type;
				this.set('str_data_type', spec.str_data_type);
				
				
			},
			'toString': function() {
				// a function to get the data type as a string.
				//  data type could be held in a different waym including as the results of INFORMATION_SCHEMA.
				
				
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
			
			
			
			
			
			'init': function(spec) {
				
				// set the columns from information_schema_column_rows?
				
				
				//  may want these the be indexed, with a string index.
				//   could use some kind of IndexedCollection for this.
				
				
				var columns = this.set('columns', spec.columns || []);
				
				
				this.set('table_constraints', spec.table_constraints || []);
				this.set('name', spec.name);
				
				this.set('schema_name', spec.schema_name);
				
				this.set('single_name', spec.single_name);
				
				
				if (is_defined(spec.parent_table)) {
					this.set('parent_table', spec.parent_table);
					
				}
				var that = this;
				if (is_defined(spec.information_schema_column_rows)) {
					each(spec.information_schema_column_rows, function(i, information_schema_row) {
						
						var column = new Abstract.Column({
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
						each(column.get('constraints'), function(i, constraint) {
							console.log('');
							console.log('constraint ' + stringify(constraint));
							
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
							
							
							column.get('column_constraints').push(nn);
						}
						
						console.log('column.column_constraints ' + stringify(column.get('column_constraints')));
						
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
				
				if (this.get('columns').length > 0) {
					
					var first = true;
					
					
					
					each(this.get('columns'), function(i, v) {
						
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
				
				if (this.get('constraints').length > 0) {
					//var first = true;
					each(this.get('constraints'), function(i, v) {
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
				
				// could possibly use this.has functions.
				
				//if (is_defined(this.schema_name) && is_defined(this.name)) {
				if (this.has('schema_name') && this.has('name')) {
						return this.get('schema_name') + '.' + this.get('name');
				} else if (is_defined(this.name)) {
					return this.name;
				}
			}
		}),
		
		// Will take a bit more work to get table sequences.
		//  Will look at the DEFAULT value of various rows in the column.
		//  Will particularly identify the sequence in the primary key column.
		
		
		
		
		'Column': Data_Object.extend({
			'init': function(spec) {
				//this.name = spec.name;
				this.set('name', spec.name);
				
				
				// a reference to the primary key constraint if there is one.
				//  not sure this is needed with the column constraints array.
				//this.pk_constraint = spec.pk_constraint;
				this.set('pk_constraint', spec.pk_constraint);
				
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
				this.set('data_type', spec.data_type);
				
				
				
				// these may include foreign key.
				//  not sure it will have to be included here.
				//this.column_constraints = spec.column_constraints || [];
				
				this.set('constraints', spec.constraints || spec.column_constraints || []);
				
				
				if (spec.information_schema) {
					var i_s = spec.information_schema;
					this.set('information_schema', i_s);
					this.set('name', i_s.column_name);
					//console.log('this.name' + this.name);
					if (!this.has('data_type')) {
						// create the data type object from information schema.
						this.set('data_type', new Abstract.Data_Type({'information_schema': spec.information_schema}));
					}
					
					
					
				}
				
				if (is_defined(spec.is_unique)) {
					this.set('is_unique', spec.is_unique);
					if (spec.is_unique) {
						// create the constraint.
						
						// maybe check to see if its already there.
						
						console.log('making unique column constraint.')
						
						
						var unique_cc = new Abstract.Column_Constraint.Unique();
						
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
						
						
						
						
						
						
						
						this.get('column_constraints').push(unique_cc);
						
						// but where does it then go?
						
					}
					
					
				}
				
				
			},
			'toString': function() {
				
				//var name = this.
				
				var name;
				
				if (this.has('information_schema')) {
					name = this.get('information_schema').column_name;
				} else {
					name = this.get('name');
				}
				
				var res = [];
				
				//var res = this.name + '    ' + this.data_type.toString();
				res.push(name);
				res.push('     ');
				res.push(this.get('data_type').toString());
				
				// not null?
				
				console.log('this.column_constraints ' + stringify(this.get('column_constraints')));
				
				if (this.get('column_constraints').length > 0) {
					//')
					
					each(this.get('column_constraints'), function(i, v) {
						
						console.log('column toString ' + name + ', column constraint  ' + stringify(v));
						
						res.push(' ');
						console.log('** ' + v.toString());
						res.push(v.toString());
					});
				}
				
				console.log('');
				console.log(res.join(''));
				
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
				console.log('this.data_type ' + stringify(this.get('data_type')));
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
		
		// Perhaps we'll have a Column_Information_Schema info object.
		//  Could be used accross databases.
		//  Or just hold the data.
		
		
		'Data_Type': Data_Object.extend({
			'init': function(spec) {
				
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
				console.log('this.information_schema ' + this.information_schema);
				if (this.has('information_schema')) {
					console.log('stringify(this.information_schema) ' + stringify(this.get(information_schema)));
					
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
				this.set('from_item', spec.from_item);
				this.set('where', spec.where || []);
				this.set('group_by', spec.group_by);
				this.set('order_by', spec.order_by);
				this.set('limit', spec.limit);
				this.set('offset', spec.offset);
				
				
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
					if (tof(sell) == 'array') {
						var first = true;
						each(sell, function(i, v) {
							
							if (!first) {
								res.push(', ');
							} else {
								first = false;
							}
							
							if (tof(v) == 'array') {
								if (v.length == 2) {
									// and both are strings
									res.push(v[0]);
									res.push(' AS ');
									res.push(v[1]);
									
								}
							} else {
								res.push(v.toString());
							}
							
							
							
							
						});
						
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
					var res = [];
					
					if (from_item.toFQN) {
						res.push(from_item.toFQN());
					} else {
						res.push(from_item.toString());
					}
					
					
					return res.join('');
					
					
					
					
				}
				res.push(get_select_list_str());
				
				// won't always have 'from'.
				if (tof(this.get('select_list')) == 'array' && this.get('select_list').length > 0 || 
					tof(this.get('select_list')) == 'string') {
					res.push(' FROM ');
				}
				
				
				
				
				res.push(get_from_item_str());
				
				// are there where clauses?
				var where = this.where;
				
				var where_get_str = function(where_item) {
					//console.log('tof(where_item) ' + tof(where_item));
					
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
								
								// may have a tofqn
								
								//console.log('where_item[1].toFQN ' + where_item[1].toFQN);
								
								
							}
							
						}
					}
					
				}
				
				var get_where_str = function() {
					var res = [];
					if (tof(where) == 'array') {
						
						if (where.length > 0) {

							var first = true;
							res.push(' WHERE ');
							each(where, function(i, where_item) {
								if (!first) {
									res.push(' AND ');
								} else {
									first = false;
								}
								
								// need to get the where item as string. It may not be in there as a where clause object, could be given just as two objects in an array, meaning they are equal.
								
								
								res.push(where_get_str(where_item));
								
								//res.push(where_item.to)
							});
						}
						
						
						
					} else {
						if (tof(where) == 'string') {
							
						}
					}
					
					
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
					
					
					var ob = that.order_by;
					// order_by seems naturally an array.
					
					if (tof(ob) == 'array') {
						// order by array could be a few different fields in an array.
						
						if (ob.length > 0) {
							res.push(' ORDER BY ');
							
							var ob_sig = get_item_sig(ob);
							if (ob_sig == '[s,s]') {
								res.push(ob[0]);
								res.push(' ');
								res.push(ob[1]);
							} else {
								// each item in the order by array gets processed.
								
								each(ob, function(i, v) {
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
		
		
		
		'Insert': Data_Object.extend({
			'init': function(spec) {
				
				this.set('table', spec.table);
				this.set('values', spec.values);
			},
			'toString': function() {
				var res = ['INSERT INTO '];
				
				// table fully qualified name?
				
				var tn;
				
				if (is_defined(this.get('table').toFQN)) {
					// get the qualified name for the table.
					
					tn = this.get('table').toFQN();
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
					
					// no, not every column.
					var first = true;
					each(values, function(i, v) {
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
					each(values, function(i, v) {
						// possibly check if it is string data.
						if (!first) {
							res.push(', ');
						} else {
							first = false;
						}
						res.push('$' + p_num);
						
						//res.push(v[0]);
						p_num++;
						
					});
					res.push(');');
					
					
					
				} else {
					throw 'Table name not found';
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
				
				
				if (tof(this.get('left_table')) == 'string') {
					str_lt = this.get('left_table');
				};
				if (tof(this.get('right_table')) == 'string') {
					str_rt = this.get('right_table');
				}
				
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
	Abstract.Table_Constraint = {};
	
	var acc = Abstract.Column_Constraint;
	acc.Primary_Key = Data_Object.extend({
		'init': function(spec) {
			
			this.set('name', 'primary key');
		},
		'toString': function() {
			return 'PRIMARY KEY';
		}
	})
	
	// foreign key...
	//  says that it references something.
	
	acc.Foreign_Key = Data_Object.extend({
		'init': function(spec) {
			this.set('target', spec.target);
			
			this.set('name', 'foreign key');
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
			this.set('name', 'unique');
		},
		'toString': function() {
			return 'UNIQUE';
		}
	});
	
	acc.Not_Null = Data_Object.extend({
		'init': function(spec) {
			this.set('name', 'not null');
		},
		'toString': function() {
			return 'NOT NULL';
		}
	});
	
	
	
	
	var atc = Abstract.Table_Constraint;
	atc.Unique = Data_Object.extend({
		'init': function(spec) {
			this.set('columns', spec.columns);
			
			
		},
		'toString': function() {
			var res = [];
			
			res.push('UNIQUE (');
			
			var first = true;
			each(this.get('columns'), function(i, column) {
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
			
	atc.Primary_Key = Data_Object.extend({
		'init': function(spec) {
			// can be more than one column.
			
			// but will probably take columns themselves fine.
			//  will do a little checking to see what type of object it is probably.
			
			this.set('column_name', spec.column_name);
			
			this.set('name', 'primary key');
			
		},
		'toString': function() {
			var cn = this.get('column_name');
			var res = ['PRIMARY KEY ('];
			
			if (tof(cn) == 'array') {
				var first = true;
				each(cn, function(i, v) {
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



