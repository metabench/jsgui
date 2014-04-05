if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

define(["../../../core/jsgui-lang-enh", 'pg', '../abstract/core', '../../../resource/core/resource', '../../../resource/core/collection',
	'../dbi-postgres'], function(jsgui, pg, Abstract, Resource, Resource_Collection, DBI_Postgres) {
    
	
	var Class = jsgui.Class, arrayify = jsgui.arrayify, fp = jsgui.fp;
	var tof = jsgui.tof, is_defined = jsgui.is_defined, each = jsgui.each, stringify = jsgui.stringify, arrayify = jsgui.arrayify, mapify = jsgui.mapify;
	var get_item_sig = jsgui.get_item_sig, trim_sig_brackets = jsgui.trim_sig_brackets;
	
	var Data_Object = jsgui.Data_Object;
	// This needs to provide resource access to a Postgres database.
	//  Want get and set to be working through a normal interface.
	//  Other database systems will also need to work through such an interface.

	// It will need to be possible to set the schema for the database (way the db is set up)

	// Setting up objects that get put through ORM as well.
	//  Basically want to define the objects.
	//  User...
	//   fields within this
	//  Role
	//  Setting up the relationships between those objects.
	//   That could hopefully be done using Data_Objects.
	//  So, a database resource could be given a Database type Data_Object for it to represent.
	//   Possibly using an Abstract Database?
	
	// Need to get postgres DB operating as a Resource.
	//  That means setting up a RESTful (like) interface to it.

	// Postgres would also have a 'Schema' Resource.

	// Setting a single field i nthe DB.
	// db/tables/table/row_id/field











	// db.meta.tables


	// Extend a base database class?

	
	var Postgres_Database = Resource.extend({

		/*
		'fields': {
			'name': String,
			'username': String,
			'password': String
		},
		*/
		
		// Connects to a Postgres Server.
		// Want most functionality through get, set, and meta.get, meta.set.
		
		
		'init': function(spec) {
			
			this._super(spec);

			this.meta.set('type_levels', ['database', 'rdb', 'postgres']);

			//console.log('spec.resource', spec.resource);
			//throw 'stop';

			// Meta.get('table_names')

			// At some point it will need to be a flat interface without objects.

			// The database resource will need to be flexible in some ways.

			// Will need to give it the plans for an authentication database, then the resource is going to ensure that database is set up.

			if (spec.server) {
				this.meta.set('server', spec.server);
			}
			if (spec.name) {
				this.meta.set('name', spec.name);
			}
			if (spec.username) {
				this.meta.set('username', spec.username);
			}
			if (spec.password) {
				this.meta.set('password', spec.password);
			}

			this.meta.set('status', 'off');

			this.data = new Data_Object({});

			// Tables should be meta?
			//  Or data?
			//  


			var tables = this.data.set('tables', new Resource_Collection({
				'fields': {
					'name': 'unique string'
				}
			}));
			tables.index_by('name');

			// Need to load the actual collection of tables from the database.
			//  Would create a Table object for each of them.
			//  However, the RESTful interface will probably be used through the Server.

			// Possibility of making a Postgres-Web-DB module that does not use the RESTful interface of the Postgres resource?
			//  Probably better to make the Postgres RESTful resource first.

			// 
			
			
		},
		
		// and reconnect?
		
		// should know if its in a connected state?
		// does it have a client?
		
		// possible to change db using reconnect?
		/*
		'reconnect': function(callback) {
			this.end();
			this.connect(callback);
		},
		*/
		'connect': function(callback) {
			

			var that = this, meta = this.meta;

			var username = meta.get('username');
			var password = meta.get('password');

			var server = meta.get('server');
			var host = server.meta.get('host');

			var db_name = meta.get('name');

			var get_connection_string = function() {

				//var conString = "postgres://YOURUSER:YOURPASSWORD@localhost/dev";
				var res = 'postgres://' + username + ':' + password + '@' + host + '/' + db_name;
				return res;
			}
			var cs = get_connection_string();
			
			// When it connects, it could get the information about the tables.
			//  Perhaps this will be done with dbi-postgres though.
			
			// Makes use of dbi-postgres, a utility module.
			
			
			pg.connect(cs, function(err, client) {

				if (err) {
					throw err;
				} else {
					client.query("SELECT NOW() as when", function(err, result) {
						console.log("Row count: %d",result.rows.length);  // 1
						console.log("Current year: %d", result.rows[0].when.getYear());
						
						// a little test.
						that.client = client;
						callback.call(null, that);
						
					});
				}

				// So, we are connected now, basically.
				
				
			});	
		},
		
		// disconnect?
		
		'end': function() {
			pg.end();
			delete this.client;
		},

		'start': function(callback) {

			this.connect(callback);
			//callback(null, true);
		},
		
		// dbi-postgres will do this, making use of the more basic connector API.
		
		// quite possibly the resource connector should be dealing with the DB names.
		//  it will be used to connect to other DBs as well.

		// get /tables

		// need a way of processing get requests at different paths, and getting variables out of them.
		//  need some kind of path interpretation here.
		// Perhaps using routing tree?

		// RFC 3986: 'The query component contains non-hierarchical data that, along with data in the path component (Section 3.3), serves to identify a resource'

		'get': fp(function(a, sig) {
			console.log('database resource get sig', sig);

			var query_component;
			var callback;
			if (sig == '[f]') {
				callback = a[0];
			} else {
				query_component = a[0];
				callback = a[1];
			}

			var that = this;

			if (query_component) {

				console.log('query_component', query_component);

				// Need to look for schemas...

				// specific one for tables?

				// But getting the inner data of the schemas - such as tables and columns in those tables?
				//  I think a /full query could do that best.
				// Returning the basic data, as well as inner data.
				//  Would return a much more comprehensive data structure.
				//   Maybe return all the data in the database?
				//  /full-structure
				//  /structure (does not imply its so full)

				// 





				if (query_component == 'schemas') {

					// Could refresh the local cache of table data?

					this.get_schema_names(function(err, schema_names) {
						if (err) {
							console.log('error getting schema names', err);
							callback(err);
						} else {
							console.log('schema_names', schema_names);

							// This level being meta anyway?
							//  Or meta are things outside of the heirachical path?
							//  Was thinking that the tables could be meta. I'm not sure.



							//var res = {
								//'name': that.meta.get('name'),
							//	'tables': table_names
							//}
							callback(null, schema_names);
						}
					})
				}

				var sqc = query_component.split('/');
				if (sqc.length > 1) {
					if (sqc.length == 2) {
						if (sqc[0] == 'schemas') {
							var schema_name = sqc[1];
							console.log('schema_name', schema_name);

							// need to get all tables in that schema.
							//  However, dealing with nested resources may be the best way.
							//  For the moment this has not been coded that way because there's quite a fixed heirachy of resources and I just want to get the code written.
							//  Nested resources would work differently.

							// Get the table names in schema




							throw 'stop;'
						}

					}

				}



			} else {
				console.log('get db resource root');

				// Returns info such as the database name, and the names of tables
				//  Will just return the table names.

				// Could also say which are navigable child fields.
				//  Maybe arrays of strings will be that.

				// Also get the latest list of tables...

				this.get_schema_names(function(err, schema_names) {
					if (err) {
						console.log('error getting schema names', err);
						callback(err);
					} else {
						console.log('schema_names', schema_names);

						// This level being meta anyway?
						//  Or meta are things outside of the heirachical path?
						//  Was thinking that the tables could be meta. I'm not sure.


						
						var res = {
							//'name': that.meta.get('name'),
							'schemas': schema_names
						}
						callback(null, res);
					}
				})

				



			}
			// Only work with 2 params?
			//  Maybe there will be a querystring in there too.

			// Need to parse that query component.
			//  There could be some complexity in how resources interpret that query component.

			// get returns info about the database itself.

			// And this resource could be published over HTTP.

		}),

		// I think resources will talk HTTP to some extent, with put and post methods, but at some point its going to use set, and that distinction could be lost.
		//  repeated put requests will act as if its been sent once.

		// A put request would be used to create a table
		// A post request, with that table description, could be used in order to update the table to what is described.
		//  Post being like doing a diff operation?
		//   Post just having some fields for the object?
		//  Put containing all the data?

		




		// Would call the Resource's Put or Post method.
		//  Not sure if that will be the Set method in some cases.
		//  Set does not have the distinction between (create or overwrite) and (update existing)
		//  Updating existing may overwrite data.

		/*
		I think one cannot stress enough the fact that PUT is idempotent: if the network is botched and the client is not sure whether his request made it through, it can just send it a second (or 100th) time, and it is guaranteed by the HTTP spec that this has exactly the same effect as sending once.
		*/




		// PUT - Create or Overwrite
		// POST - Update existing. Error if does not exist already (404).


		// Put will do this in some cases.
		'create_table': function(table_def, callback) {
			// This could use some of the abstract Postgres functionality.

			// Want to be able to interpret fairly simple json to make a table

			var example_table_def = {
				'name': 'users',
				'columns': [
					'id serial pk',
					'username unique indexed char(32) not null',
					'password_hash char(256) not null'
				]
			}
			table_def = example_table_def;

			// The abstract Postgres DB objects get created from this table def.
			// Postgres abstract core should be very useful for this.

			var apg_table = new Abstract.Table(table_def);
			var sql_create = apg_table.get_create_statement();

			console.log('sql_create', sql_create);




		},

		'get_schema_names': function(callback) {
			/*
			select schema_name
			from information_schema.schemata
			where schema_name <> 'information_schema' -- exclude 'system' schemata
			  and schema_name !~ E'^pg_'
  			*/

  			var sql = [
	  			"select schema_name",
				"from information_schema.schemata",
				"where schema_name <> 'information_schema'",
				  "and schema_name !~ E'^pg_'"
  			].join(' ');

  			//this.execute_multirow_to_callback(sql, callback);
  			// Don't want the full names in there.

  			// Want to execte multirow to callback, but have the results as an array
  			//  Works with single result per row.

  			this.execute_multirow_univalue_to_callback(sql, callback);

		},


		//SELECT * FROM information_schema.tables 
		//WHERE table_schema = 'public'

		'get_table_names': function(schema_name, callback) {
			var client = this.client;
			
			// Will do a select exists query.
			
			var sql = 'SELECT table_name FROM information_schema.tables WHERE table_schema = "' + schema_name + '"';
			var query = client.query(sql);

			var res = [];
			
			//can stream row results back 1 at a time
			query.on('row', function(row) {
			  console.log(row);
			  //console.log("row", row); //Beatle name: John
			  //console.log("Beatle birth year: %d", row.birthday.getYear()); //dates are returned as javascript dates
			  //console.log("Beatle height: %d' %d\"", Math.floor(row.height/12), row.height%12); //integers are returned as javascript ints
			  
			  res.push(row.table_name);
			  
			  
			});
			query.on('end', function() {
				//fired once and only once, after the last row has been returned and after all 'row' events are emitted
				//in this example, the 'rows' array now contains an ordered set of all the rows which we received from postgres
				//client.end();
				//console.log('res ' + stringify(res));
				callback(null, res);
			});
			
			
		},


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
				callback(null, res);
			});
			
			
		},
		
		'table_exists': function(db_name, callback) {
			// SELECT d.datname as "Name", u.usename as "Owner", pg_catalog.pg_encoding_to_char(d.encoding) as "Encoding" FROM pg_catalog.pg_database d LEFT JOIN pg_catalog.pg_user u ON d.datdba = u.usesysid ORDER BY 1;
			// SELECT d.datname as "Name", u.usename as "Owner" FROM pg_catalog.pg_database d LEFT JOIN pg_catalog.pg_user u ON d.datdba = u.usesysid ORDER BY 1;
			// SELECT EXISTS(d.datname as "Name", u.usename as "Owner" FROM pg_catalog.pg_database d LEFT JOIN pg_catalog.pg_user u ON d.datdba = u.usesysid WHERE... ORDER BY 1);
			
			var sel = new Abstract.Select({
				'from_item': new Abstract.Exists({
					'subquery': new Abstract.Select({
						'select_list': ['pg_catalog.pg_database.datname'],
						'from_item': 'pg_catalog.pg_database',
						'where': [['pg_catalog.pg_database.datname', db_name]]
					})
				})
			});
			var sql = sel.toString();
			//console.log('sql ' + sql);
			
			//this.execute_query({
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
				} else if (query_spec.query) {
					query = this.client.query(query_spec.query);
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
		
		'execute_multirow_to_callback': function(sql, callback) {
			var res = [];
			var that = this;
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

		'execute_multirow_univalue_to_callback': function(sql, callback) {
			var res = [];
			var that = this;
			this.execute_query({
				'sql': sql,
				'row': function(row) {
					//console.log('get_sequence_names exists row ' + stringify(row));
					//res = row;

					var keys = Object.keys(row);
					res.push(row[keys[0]]);

					//res.push(row);
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
	
	
	return Postgres_Database;
	
	//return jsgui;
	
});

