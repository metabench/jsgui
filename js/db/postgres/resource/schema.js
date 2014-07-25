//http://stackoverflow.com/questions/4881059/how-to-handle-circular-dependencies-with-requirejs-amd

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

//define("Postgres_Database", ["exports", "../../../core/jsgui-lang-enh", 'pg', '../abstract/core', '../../../resource/core/resource', '../../../resource/core/collection',
define(["../../../core/jsgui-lang-enh", 'pg', '../abstract/core/all', '../../../resource/core/resource', '../../../resource/core/collection',
	'./table'], function(jsgui, pg, Abstract, Resource, Resource_Collection, Table_Resource) {
    
	
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

	// This part also look like it could benefit from using the AMD 'exports' system











	// db.meta.tables


	// Extend a base database class?

	
	var Postgres_Schema = Resource.extend({

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

            this.data = new Data_Object({});

			this.meta.set('type_levels', ['schema', 'rdb', 'postgres']);

			//console.log('spec.resource', spec.resource);
			//throw 'stop';

			// Meta.get('table_names')

			// At some point it will need to be a flat interface without objects.

			// The database resource will need to be flexible in some ways.

			// Will need to give it the plans for an authentication database, then the resource is going to ensure that database is set up.

			// This will not actually contain the data (though some Resources will), but will provide an interface to the data.


            // Could be a field though.
			if (spec.database) {
                // Or data, rather than meta?
                //  It's a resource itself/

				this.data.set('database', spec.database);
			}

			if (spec.name) {
				this.meta.set('name', spec.name);
			}

			//if (spec.username) {
			//	this.meta.set('username', spec.username);
			//}
			//if (spec.password) {
			//	this.meta.set('password', spec.password);
			//}

			//this.meta.set('status', 'off');

			// Possibly should not hold the internal data?
			//  Maybe a data cache named as such? Metadata / metadata cache?
			//this.data = new Data_Object({});

			// Tables should be meta?
			//  Or data?
			//  


			// Not so sure about the Resource keeping info about data / resources inside it...
			//  Will be referring to tables by name, properties using identifying parameters.
			//  Not so sure how useful exposing programming objects will be in the world of Resources.
			//  May be good to make use of them though.

			// And the database will have a Resource_Collection of schemas.

            // A Data_Resource pattern?
            //  Where there is a Data_Object inside that contains the nested info, either as Resources or other types.



			var tables = this.data.set('tables', new Resource_Collection({
				'fields': {
					'name': 'unique string'
				}
			}));
			tables.index_by('meta.name');



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

        // Should not need to connect to a schema like this.
        //  The database gets connected to
        //   (or the Server maybe, conceptually)

        // I don't think that this will have the postgres client itself, but will make calls through the database.
        //  The jsgui API will allow calls from the Schema, some calls from the Table too.

        //  These Resources will work in parallel with Abstract classes, some of which represent the same things.
        //  These Resources are about connecting to and interacting with the DBs and data.
        //  The Abstract Classes are about modelling the DBs and data structures (though probably not the data itself) and will be used in order to provide advanced functionality, likely
        //   through other APIs to a large extent. This is the equivalent of the app thinking about the task, modelling and planning, and then can generate instructions in a way that is removed
        //   from the module that executes them.

        /*
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
			//  Perhcps this will be done with dbi-postgres though.
			
			// Makes use of dbi-postgres, a utility module.
			
			console.log('pre call pg connect');
			
			pg.connect(cs, function(err, client) {

				if (err) {
					throw err;
				} else {
					client.query("SELECT NOW() as when", function(err, result) {
						console.log("Row count: %d",result.rows.length);  // 1
						console.log("Current year: %d", result.rows[0].when.getYear());
						
						// a little test.
						that.client = client;
						console.log('.client has been set');

						// and the resource pool triggers the start event?
						//  or here?

						// would be better to do this automatically.
						//  once the start function has completed.
						that.meta.set('status', 'on');
						that.trigger('start');

						callback.call(null, that);
						
					});
				}

				// So, we are connected now, basically.
				
				
			});	
		},

		*/
		
		// disconnect?
		
		//'end': function() {
		//	pg.end();
		//	delete this.client;
		//},

        /*

         SELECT t.relname as related_table,
         a.attname as related_column,
         s.relname as sequence_name
         FROM pg_class s
         JOIN pg_depend d ON d.objid = s.oid
         JOIN pg_class t ON d.objid = s.oid AND d.refobjid = t.oid
         JOIN pg_attribute a ON (d.refobjid, d.refobjsubid) = (a.attrelid, a.attnum)
         JOIN pg_namespace n ON n.oid = s.relnamespace
         WHERE s.relkind     = 'S'
         AND n.nspname     = 'public'
         */

        // When loading an abstract schema, will need to load the sequences data.



        'get_sequences_data': function(callback) {
            var schema_name = this.meta.get('name');

            var sql = [
                'SELECT t.relname as related_table,',
                'a.attname as related_column,',
                's.relname as sequence_name',
                'FROM pg_class s',
                'JOIN pg_depend d ON d.objid = s.oid',
                'JOIN pg_class t ON d.objid = s.oid AND d.refobjid = t.oid',
                'JOIN pg_attribute a ON (d.refobjid, d.refobjsubid) = (a.attrelid, a.attnum)',
                'JOIN pg_namespace n ON n.oid = s.relnamespace',
                'WHERE s.relkind     = \'S\'',
                'AND n.nspname     = \'' + schema_name + '\''

            ].join(' ');

            console.log('get_sequences_data sql', sql);

            this.data.get('database').execute_multirow_to_callback(sql, function(err, res) {
                console.log('get_sequence_data res', res);
                callback(err, res);
            });


        },

        'load_table_resources': function(callback) {
            var that = this;
            that.get_table_names(function(err, table_names) {
                if (err) {
                    throw err;
                } else {
                    //console.log('table_names', table_names);
                    //throw 'stop';

                    // We load the abstract schemas.
                    //  All of them get loaded as a Collection.

                    // Then for each of them we create a new Schema Resource, as a subresource here.

                    var data_tables = that.data.get('tables');

                    // and there is a collection of abstract schemas too
                    //console.log('data_tables', data_tables);
                    //console.log('data_tables.length()', data_tables.length());

                    //throw 'stop1';
                    var fns = jsgui.Fns();
                    each(table_names, function(i, name) {
                        fns.push([that, that.load_table_resource, [name]]);
                    })

                    fns.go(function(err, res) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log('res', res);
                            //throw 'stop2';

                            callback(null, true);
                        }
                    });


                }
            });
        },

        'load_table_resource': function(table_name, callback) {
            //console.log('load_table_resource table_name', table_name);

            // Create a new Resource, and add it to the collection of data.schemas

            var data_tables = this.data.get('tables');

            // we create the new ones...
            //  only if they don't already exist?

            // I don't think that code around here will automatically add it to the pool, but if it's being created within the scope of an existing pool object, the pool will
            //  get notified so that the pool can add it should the pool be set to do so.


            // Have to see if a Resource matches constraints?

            //console.log('table_name', table_name);
            //console.log('tof table_name', tof(table_name));

            var tr = new Table_Resource({
                'schema': this,
                'name': table_name
            });

            data_tables.push(tr);

            // And that schema resource itself needs to start.

            //console.log('pre tr.start');

            tr.start(function(err, res) {
                if (err) {
                    throw err;
                } else {
                    //console.log('res', res);
                    callback(null, true);
                }
            })

        },

		'start': function(callback) {
            //throw 'stop';
			//this.connect(callback);

            this.load_table_resources(function(err, res) {
                if (err) {
                    throw err;
                } else {

                    // Is not loading the Abstract Table by default.


                    //throw 'stop';

                    callback(null, true);
                }
            })

		},
		
		// dbi-postgres will do this, making use of the more basic connector API.
		
		// quite possibly the resource connector should be dealing with the DB names.
		//  it will be used to connect to other DBs as well.

		// get /tables

		// need a way of processing get requests at different paths, and getting variables out of them.
		//  need some kind of path interpretation here.
		// Perhaps using routing tree?

		// RFC 3986: 'The query component contains non-hierarchical data that, along with data in the path component (Section 3.3), serves to identify a resource'

        // The db resource may pass various get requests onto a schema resource, once it's determined that it's asking for data from within that schema.
        //  The schema resource is then likely to use the db resource's more general functionality to carry out operations relating to the schema.





        // The asyncronous get will get the connected data.
        // The sync get will be used for various things such as indexing objects.
        //  Data_Object and Enhanced_Data_Object code will handle sync gets.

        'abstract': function(callback) {

            // May need to make it defer calling it again.
            //  Having problems with it loading up the same Abstract tables into the schema twice.

            //console.log('Schema Resource .abstract');

            // don't want this to simultaneously load too many times (more than once)



            // Option to pass in the abstract database...
            //  With that abstract database reference, we can do the queries to load the abstract schemas.

            // Then with that reference to the abstract database, we can carry out the actual loading / queries.
            //  Also, to effectively load the abstract schemas, we need to access further data.

            //  Table resources getting set up automatically?
            //  Perhaps it will be best to only start / create some resources as they are needed.

            // Also, the Abstract Schema contains references to Abstract Tables
            //  Starting the Schema Resource should load and start the Table Resources, or at least make them available.

            var that = this;





            // Database currently has get_abstract_schemas.
            //  It may be more consistant to have database load up the schema resources.
            //   (I think it does this)
            //   Then to have the schema resources load their abstract classes.




            // This may need to be asynchronous as it may need to load data.

            if (this._abstract) {
                callback(null, this._abstract);
            } else {

                if (this._loading_abstract) {
                    throw 'stop - already loading schema abstract';
                }

                this._loading_abstract = true;
                // Need to get or make the Abstract class that represents this.

                // We can get the schema.
                // From that we get the Abstract schema
                //  We use that as a reference within the Abstract system.

                // Not so sure we need the abstract database.
                //  Can point between schemas.



                var database = this.data.get('database');
                //console.log('database', database);

                // Has the database resource.
                //  With the db.abstract function loading up the abstract schemas too?
                //  Or here, the abstract schema class can load its abstract data differently when it is connected to the db abstract.


                database.abstract(function(err, abstract_database) {
                    if (err) {
                        throw err;
                    } else {
                        //console.log('abstract_database', abstract_database);


                        // Or, use the schema resources linked to by the database to load the abstract tables.
                        //  Loading abstract tables is one of the main things about the schema resources.



                        // or do the rest of it here?
                        //  The resources should have loaded  by now.
                        //   Add the abstract tables to the abstract schema?

                        //  Create the abstract schema, add it to the database.

                        var schema_name = that.meta.get('name');

                        // Check to see if the abstract schema already exists...

                        var existing_abstract_schemas = abstract_database.get('schemas');
                        var existing_abstract_schema = existing_abstract_schemas.get(schema_name);

                        if (schema_name.value) schema_name = schema_name.value();

                        console.log('schema_name', schema_name);
                        //throw 'stop';


                        var abstract_schema = that._abstract = existing_abstract_schema || new Abstract.Schema({
                            'name': schema_name,
                            'database': abstract_database
                        });

                        // We then need to consult the table resources, and load up the abstract table objects for them.

                        var table_resources = that.data.get('tables');
                        //console.log('table_resources.length()', table_resources.length());

                        // For each table resource, we load the abstract table.
                        var fns = jsgui.Fns();

                        //throw 'stop';
                        table_resources.each(function(i, table_resource) {
                            // But the table resources don't have column resources.
                            //  Use the table resources to get access to the column info.

                            fns.push([that, function(callback) {
                                table_resource.abstract(function(err, abstract_table) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        //throw 'stop';
                                        //console.log('abstract_table', abstract_table);

                                        // But is this abstract table being called / created too many times?

                                        //throw 'stop';

                                        // That abstract table should contain abstract columns, constraints, indexes etc.



                                        //throw 'stop';
                                        callback(null, abstract_table);
                                    }
                                })
                            }]);


                        });

                        var abstract_sequences = abstract_schema.get('sequences')

                        // Load the sequence data, then create the abstract sequences?









                        fns.go(function(err, res) {
                            //console.log('res', res);
                            //throw 'stop';
                            // Will hopefully get all the data needed to reconstruct the sequence.
                            that.get_sequences_data(function(err, sequence_data) {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log('sequence_data', sequence_data);

                                    // then create Abstract Sequence objects based on this data.

                                    each(sequence_data, function(i, sequence_item) {

                                        sequence_item.schema = abstract_schema;
                                        var abstract_sequence = new Abstract.Sequence(sequence_item);
                                        console.log('abstract_sequence', abstract_sequence + '');
                                        abstract_sequences.push(abstract_sequence)

                                    });

                                    //throw 'stop';


                                }
                            });

                            callback(null, abstract_schema);
                        })




                        //throw 'stop';


                        //callback(null, abstract_schema);




                        //that.abstract(abstract_database, callback);
                        // creates the abstract schema, with reference to the existing abstract database.
                        //  The Database Resource will have loaded too,
                        //   we also use this Resource to carry out some of the actual loading.
                        //   need the actual loading code rather than just the indirection / rediection we have at the moment.




                        //  At this point it would be good to have the abstract schemas within the abstract database.
                        //  However, the code in the abstract database part of things is calling this code to load the abstract schemas.


                        //  So, if the abstract schemas are not loaded in the abstract db, we need to load them.

                        //



                        // But using the schema's function to get the abstract schemas too...
                        //  Abstract DB gets created, and


                        // Loading this abstract database, while connected to the Resource, should cause the DB and its abstract Schemas to load.
                        //  The DB would ensure it has its Schema Resources
                        //   Those Schema Resources would then load their Abstract schemas.


                        // The abstract database should already contain the abstract schema representing this.

                        // We'll assign it.



                        // And the abstract database should be enough.
                        // Those would be abstract schemas.
                        //  Want the resources to load in the right sequence, with the sequence being an emergent behaviour.


                        // Create the new abstract schema?
                        //  We'll need to add it to the abstract schemas in the abstract database,
                        //   so having this in load abstract database code makes sense.


                        /*

                        var adb_schemas = abstract_database.get('schemas');
                        //  So they may not be loaded yet.
                        //  Perhaps they should be?



                        console.log('adb_schemas.length()', adb_schemas.length());


                        // And when we get the Abstract Database, it will load and make use of Resources.
                        console.trace();
                        throw 'stop';

                        */


                    }
                });
                //var resource_schema = schema.)



                //
            }

            //throw 'stop';

        },

		'aget': fp(function(a, sig) {
			//console.log('schema resource aget sig', sig);

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
							//console.log('schema_names', schema_names);

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
							//console.log('schema_name', schema_name);

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
						//console.log('schema_names', schema_names);

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

			// That table could be an abstract table object?
			/*
			var example_table_def = {
				'name': 'users',
				'columns': [
					'id serial pk',
					'username unique indexed char(32) not null',
					'password_hash char(256) not null'
				]
			}
			table_def = example_table_def;
			*/

			// Needs to have the schema name in there too.
			//  At some point we may want a reference to that schema object - however, we may want to work with a string schema name instead.

			// I think it should make use of a schema resource?
			//  There being a default schema resource, that schema resource has ensure_table, create_table etc, and this function here is a means to call that
			//  on the selected schema / default pulic schema in the database.

			// I think there being a public schema resource that is used by default makes the most sense.


            var schema_name = this.meta.get('name');

			table_def.schema = schema_name;


			//console.log('table_def', table_def);
			//throw 'stop';

			// The abstract Postgres DB objects get created from this table def.
			// Postgres abstract core should be very useful for this.
            //console.log('');
            //console.log('pre create Abstract Table');
			var apg_table = new Abstract.Table(table_def);

            //console.log('pre get_create_statement');
			var sql_create = apg_table.get_create_statement();

			//console.log('sql_create', sql_create);

			// Then execute that SQL.
            //throw 'stop';

            // Call the query in the database.
            //  Perhaps calling it from the schema could allow it to say which schema we are in automatically.

            var database = this.data.get('database');

			database.s_query(sql_create, function(err, res) {
				//console.log('res', res);
				if (callback) callback(err, !!res);
			});

		},

		'ensure_table': fp(function(a, sig) {

			// Could generate the SQL to ensure the table (and its properties.)
			//  Could also make use of a Table resource if it has the right programming.
			//   But may not want the bother of making a Table Resource here.

			// Could have a Postgres ensure_table function, and Resource just provides a way to access it.
			//  dbi-postgres ensure_table
			//   And can take a JSON table definition, or an abstract definition / a Resource.
			//   A Table Resource may be a good way to describe it, but also want to make a simpler to use JSON interface that can ensure a table exists in a DB
			//    ensures columns exist as specified, may make some small changes where possible.
            console.log('');
			console.log('postgres resource ensure_table');

			console.log('sig', sig);

            var schema_tables = this.data.get('tables');

            console.log('schema_tables', schema_tables);

            var schema_name = this.meta.get('name');

			var that = this;

			var obj_table, callback;
			if (sig == '[o]') {
				obj_table = a[0];
			}


			if (obj_table) {

				console.log('obj_table', obj_table);

                var name = obj_table.name;

                console.log('name', name);

                var existing_table = schema_tables.get(name);
                console.log('existing_table', existing_table);
                //throw 'stop';

                if (!existing_table) {
                    // create it
                    that.create_table(obj_table, callback);

                } else {

                    // To ensure the various columns in the table, it could make sense to use the Table Resource.

                    var table_resource = this.data.get('tables').get(name);

                    //var existing_abstract_table = table_resource.abstract();

                    table_resource.abstract(function(err, abstract_table) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log('abstract_table', abstract_table);

                            throw 'stop';

                            //console.log('table_resource', table_resource);

                            obj_table.schema = schema_name;


                            //console.log('obj_table', obj_table);

                            // We want to use some specialised function that compares abstract tables, then comes up with the code (AST) that would be used to make the
                            //  change to the target table.

                            // Table_Change_Command_Generator

                            // Will do things like alter columns, create new ones






                            throw 'stop';

                            // The abstract Postgres DB objects get created from this table def.
                            // Postgres abstract core should be very useful for this.
                            console.log('');
                            console.log('pre create Abstract Table');
                            var apg_table = new Abstract.Table(table_def);

                            console.log('apg_table', apg_table);

                            // tccg(



                            // It's more complicated / granular when we ensure individual parts of the table.

                            // May be best to come up with an instruction model to change it.

                            // Don't reallt want to be adding a new column when a column has been renamed.
                            //  It may be possible to recognise renamings.

                            // Basically, want to create new abstract table.
                            //  Then another module, a Table_Change_Command_Generator will determine what changes to make in order to make the table that is in the
                            //  db match the abstract table. Table_Change_Command_Generator will be Abstract, in that it operates on Abstract database objects.

                            // Will have different types of generators as well.

                            // Anyway, come up with the new abstract table, don't add it to the schema...
                            //  Have an autoadd disabled flag?

                            // It's just a 'theoretical' or 'detached' table for the moment?


                            // Ensure the various table columns
                            // Ensure table constraints






                            // Ensure table column

                            // Will look at the columns in the abstract table.
                            // data.columns?
                            // meta.columns?
                            //  getc confusing with the two of them.
                            //  data may be best for internal data rather than references or subresources.
                            //   a subresources collection may be best as its own list or collection.
                            // A Resource should probably contain a default 'sub' collection.

                            // resource.sub(idx)





                            //var et_cols = existing_table.get('columns');


                            //console.log('et_cols', et_cols);
                            //console.log('et_cols.length()', et_cols.length());

                            // we ensure the columns we have

                            //var spec_columns = obj_table.columns;

                            // then we can do an abstract table ensure_columns_output_changes

                            // Want to get the changes that would get made as alter table SQL.
                            //  could actually get the abstract system to build commands.

                            // However, a command builder module could be useful to build the commands to carry out changes, rather than have it in the Abstract Core.
                            //  Really want the core just to represent the language. Have reasonable syntax for construction.
                            //  Other parts of the system could build statements from the core to carry out tasks.
                            //  eg modify_output_change_statements
                            //   get the abstract functions / objects that represent code needed to carry out the change commands.

                            // To start with, want verification that specified columns are in the table.
                            //  Having that functionalit yin the Postgres DB resource makes sense.
                            //  Or that DB resource can call upon other functionality within the Postgres directories.

                            // Having the code within the DB resource makes sense.
                            //  Though having it within a Table Resource could make more sense.
                            //  Better splitting up of code.

                            // Also, could have some of this within a Schema Resource.
                            //  The Schema resources would get loaded.
                            //   They would have Table resources.




                            //existing_table.verify_




                            //throw 'stop';


                            // Will also need to ensure the table foreign key constraints.



                            if (callback) callback(null, true);
                            // Ensure that the table is set up correctly

                            // Do a kind-of diff.

                            // See if any columns are missing from the specified columns
                            // See if there are any columns that are not specified but are in the DB (delete them??? leave them???)

                            // We want to be running checks against an existing Abstract Table.
                            //  Not sure if the checking mechanism should be part of the abstract system itself, or should be separate.

                            // Want to modify the abstract system, and update those modifications in the DB.
                            //  Updating the DB seems to be the main goal, we can use the abstract system to enable that.

                            // Could have code to ensure various columns and constraints, indexes.

                            // May well need more 'platform' functionality to quickly do the comparison here.


                            //existing_table.diff(obj_table);
                        }
                    });

                    //console.log('existing_abstract_table', existing_abstract_table);



                    // Or easy ability to get an abstract table when needed - but it would go back and make the Abstract Schema too.
                    //  I think references from the Resource to the Abstract Class make sense.
                    //  Also more code that facilitates the getting of the Abstract Classes.




                    // And from that table resource, can we get the abstract table?

                    // Or the schema resource will have loaded abstract tables?
                    //  Perhaps linking from Resource to Abstract makes sense.
                    // Have the Resource load up Abstract Classes as the Resource starts.






                }

                /*

				// See if the table already exists in the DB?
				// Create an abstract version of that Postgres table.

				var a_table = new Abstract.Table(obj_table);
				var table_name = a_table.get('name');

				//throw 'stop';
				console.log('a_table', a_table.toString());

				// then we need to ensure the table is in the DB.

				// Does a table with that name exist?

				// db name as well?

				this.table_exists(table_name, function(err, exists) {
					if (err) {
						throw err;
					} else {
						console.log('exists', exists);

						if (!exists) {
							// create the table / add the table


							// I think call a create table function, but that will use the Abstract facilities to make the statement.
							//if (callback) that.create_table(obj_table, callback);
							that.create_table(obj_table, callback);

						}

					}
				})

				*/


			}



		}),

        /*
		'get_schema_names': function(callback) {

			//select schema_name
			//from information_schema.schemata
			//where schema_name <> 'information_schema' -- exclude 'system' schemata
			//  and schema_name !~ E'^pg_'


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
    */


		//SELECT * FROM information_schema.tables 
		//WHERE table_schema = 'public'

		'get_table_names': function(callback) {
			var client = this.client;

            var schema_name = this.meta.get('name');
			
			// Will do a select exists query.
			
			var sql = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'' + schema_name + '\'';

            // do the query using the database resource.

            var database = this.data.get('database');
            //console.log('database', database);

			var query = database.client.query(sql);

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
		
		'table_exists': function(table_name, callback) {

			var db_name = this.meta.get('name');
			console.log('db_name', db_name);

			// SELECT d.datname as "Name", u.usename as "Owner", pg_catalog.pg_encoding_to_char(d.encoding) as "Encoding" FROM pg_catalog.pg_database d LEFT JOIN pg_catalog.pg_user u ON d.datdba = u.usesysid ORDER BY 1;
			// SELECT d.datname as "Name", u.usename as "Owner" FROM pg_catalog.pg_database d LEFT JOIN pg_catalog.pg_user u ON d.datdba = u.usesysid ORDER BY 1;
			// SELECT EXISTS(d.datname as "Name", u.usename as "Owner" FROM pg_catalog.pg_database d LEFT JOIN pg_catalog.pg_user u ON d.datdba = u.usesysid WHERE... ORDER BY 1);
			
			// var sql = 'SELECT table_name FROM information_schema.tables WHERE table_schema = "' + schema_name + '"';

			// We need the schema name for this too...

			//console.log('table_name', table_name);
			//throw 'stop';

			var sel = new Abstract.Select({

				// Don't think we want a nested abstract select like that.
				//  Still, it's best to build the queries using the abstract objects.

				// Select with a where clause.

				'select_list': ['table_name'],


				//'from_item': 'information_schema.tables',
				'from_item': 'information_schema.tables',

				// And sheck the table name too.

				// Seems like a way of automatically making the ANDs.
				'where': [['table_schema', 'public'], ['table_name', table_name]]
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
			
			this.s_query(sql, function(err, res) {
				callback(err, !!res);
			});
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

			// There need to be a client object.



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


			this.data.get('database').execute_query({
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
		}
		
		// could be an abstract function
		//  or abstract generation. abstract-postgres-gen?
		//  extends the normal abstract?
		
		// May want to ensure an abstract schema is in the db
		//  Abstract table, etc.
		// Ensure abstract functions are in the db
		
	});
	
	//exports.Postgres_Database = Postgres_Database;
	
	return Postgres_Schema;
	
	//return jsgui;
	
});

