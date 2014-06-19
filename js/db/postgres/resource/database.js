// Maybe better to move this away from the AMD style towards the normal node way.
//  Could then use browserify or my own build system.


//http://stackoverflow.com/questions/4881059/how-to-handle-circular-dependencies-with-requirejs-amd

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

//define("Postgres_Database", ["exports", "../../../core/jsgui-lang-enh", 'pg', '../abstract/core', '../../../resource/core/resource', '../../../resource/core/collection',
define(["../../../core/jsgui-lang-enh", 'pg', '../abstract/core', '../../../resource/core/resource', '../../../resource/core/collection',
	'./schema'], function(jsgui, pg, Abstract, Resource, Resource_Collection, Schema_Resource) {
    
	
	var Class = jsgui.Class, arrayify = jsgui.arrayify, fp = jsgui.fp;
	var tof = jsgui.tof, is_defined = jsgui.is_defined, each = jsgui.each, stringify = jsgui.stringify, arrayify = jsgui.arrayify, mapify = jsgui.mapify;
	var get_item_sig = jsgui.get_item_sig, trim_sig_brackets = jsgui.trim_sig_brackets;
	
	var Data_Object = jsgui.Data_Object;
    var Collection = jsgui.Collection;
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

	// Can make use of DBI_Postgres...?
	//  Postgres code that is not written as a resource?
	//   However, maybe not as DBI_Postgres acts a lot like a resource anyway.
	
	

    // This will need some significant changes.
    //  There is functionality callable with JS, and it will expose some particular functionality as a resource as well.

    //








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

			// This will not actually contain the data (though some Resources will), but will provide an interface to the data.



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


			// Not so sure about the Resource keeping info about data / resources inside it...
			//  Will be referring to tables by name, properties using identifying parameters.
			//  Not so sure how useful exposing programming objects will be in the world of Resources.
			//  May be good to make use of them though.

			var schemas = this.data.set('schemas', new Resource_Collection({
				'fields': {
					'name': 'unique string'
				}
			}));

            // Though, they need to be indexed by meta.get('name');
            //  Could also make the indexing system consult properties under 'meta'.
            //  I think this is an important thing to expand, being able to index sub-properties easily.
            //  Also, there are some objects like .meta, which are stored as normal JS object properties, and they make available the .get function.

            // A possibility is setting up get aliases.
            //  That means that when meta('name') is set, it is aliased as object('name').

            // Either aliases, or deeper indexing, or both.

            // Deeper indexing seems more impressive or generally useful. It's also good that we already have the indexing system separated out.
            //  It's already quite a complicated system, but there is room for the complexity + functionality to grow.


            //  this notation seems good for deeper indexing.
            //   and we have the function to extract the index field from an object, while it has the index specification provided.

            // The square brackets notation to indicate actual JS properties of objects seems useful.


            // I can't think of a better specific syntax.
            //  schemas.index_by('[meta].name');
            // However, a general syntax where it checks both the actual object properties, as well as ._[whatever] would be more flexible, again at the cost of performance
            //  Maybe would be faster if 'innate properties' were used more though.
            //  Would also clear the way for code that works in the future with the new listeners model
            //   New listeners API will make it so that JS itself supports much of that the Data_Object does, so that get/set would not have to be done through function calls.




            //schemas.index_by('[meta].name');
            schemas.index_by('meta.name');

            // So the schema index should be in place,
            //  I need to work on the code for adding and updating the index when a schema gets pushed.



			//schemas.index_by('name');
            //throw 'stop';
			// Possibly create a default public schema?



			/*

			var tables = this.data.set('tables', new Resource_Collection({
				'fields': {
					'name': 'unique string'
				}
			}));
			tables.index_by('name');

			*/

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
			//  Perhcps this will be done with dbi-postgres though.
			
			// Makes use of dbi-postgres, a utility module.
			
			console.log('pre call pg connect cs', cs);
			
			pg.connect(cs, function(err, client) {

				if (err) {
                    console.log('err', err);
					throw err;
				} else {
					client.query("SELECT NOW() as when", function(err, result) {
						//console.log("Row count: %d",result.rows.length);  // 1
						//console.log("Current year: %d", result.rows[0].when.getYear());
						
						// a little test.
						that.client = client;
						//console.log('.client has been set');

						// and the resource pool triggers the start event?
						//  or here?

						// would be better to do this automatically.
						//  once the start function has completed.



                        console.log('done connect');
						callback(null, that);
						
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

		'ensure_public_schema': function(callback) {

			var schemas = this.get('schemas');
			//console.log('schemas', schemas);

			var public_schema = schemas.get('public');
			//console.log('public_schema', public_schema);


			throw 'stop';

			callback(null, true);
		},

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
            //console.log('sql ' + sql);
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
            //console.log('4) table_name ' + table_name);
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



                //console.log('sql ' + sql);
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
                    //console.log('information_schema_row ' + stringify(information_schema_row));

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
            //console.log('sql ' + sql);

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
            //console.log('sql ' + sql);

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
            //console.log('sql ' + sql);

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
            //console.log('table_name ' + table_name);
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

            console.log('load_table_constraint_row');

            //throw 'stop 1';
            var sel = new Abstract.Select({
                'select_list': '*',
                'from_item': 'INFORMATION_SCHEMA.table_constraints',
                'where': [['constraint_schema', constraint_schema], ['table_schema', table_schema], ['table_name', table_name], ['constraint_name', constraint_name]]
            });
            //throw 'stop 2';

            var w = sel.get('where');
            //console.log('tof w', tof(w));
            //console.log('w', (w.length));
            //throw 'stop';
            var sql = sel.toString();
            //console.log('sql ' + sql);
            //throw 'stop';
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

            // should load just a single row.

            console.log('pre load_table_constraint_row');

            that.load_table_constraint_row(schema_name, schema_name, table_name, constraint_name, function(err, res_constraint_row) {
                if (err) {
                    throw err;
                } else {
                    console.log('res_constraint_row', res_constraint_row);
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
            console.log('load_table_abstract_constraints');
            var that = this;

            // load the table constraint names instead.
            //console.log('');
            console.log('pre load_table_constraint_names');


            that.load_table_constraint_names(schema_name, table_name, function(err, table_constraint_names) {

                // couls have a collection of constraints as the result

                if (err) {
                    throw err;
                } else {
                    var res = [];

                    //console.log('table_constraint_names', table_constraint_names);



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
                        //console.log('table_constraint_name ' + table_constraint_name);
                        //console.log('pre load_abstract_table_constraint');
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
                        console.log('res', res);
                        throw 'stop';
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
            console.log('load_table_constraint_names');
            var sel = new Abstract.Select({
                'select_list': ['constraint_name'],
                'from_item': 'INFORMATION_SCHEMA.table_constraints',
                'where': [['table_schema', schema_name], ['table_name', table_name]]
            });

            var sql = sel.toString();
            //console.log('sql ' + sql);

            // Single item?
            //  What does that mean here?

            // Not sure it is going to be a single item...

            //this.execute_multirow_single_item_to_array_callback(sql, callback);
            this.execute_multirow_to_callback(sql, function(err, res_constraints) {
                if (err) {
                    throw err;
                } else {
                    console.log('res_constraints', res_constraints);
                    var res = [];
                    each(res_constraints, function(i, v) {
                        res.push(v.constraint_name);

                    });
                    console.log('load_table_constraint_names res', res);
                    callback(null, res);
                }
            });
        },



        // loading the table info from the db
        '__load_abstract_table': function(schema_name, table_name, callback) {
            // get the columns for that table.

            // what about getting the postgres data type like serial?

            // the whole table structure, loaded from the database, as an Abstract.Table.

            // need to get a few things, like the columns.
            //  particularly the columns... only the columns?
            //console.log('');
            console.log('------------------ load_abstract_table ------------------ table_name ' + table_name);
            //console.log('');
            var that = this;

            // Not sure about doing it that way.
            //  Can make use of
            //  http://www.alberton.info/postgresql_meta_info.html#.U583ufldV8F

            // Want it so that the various pieces of info are loaded.

            //  Load abstract table column info
            //  Load constraint info

            //  Have local variables here that get populated as the info gets loaded.





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
                console.log('');
                console.log('pre load_table_abstract_constraints');

                //throw 'stop';

                that.load_table_abstract_constraints(schema_name, table_name, function(err, res_abstract_constraints) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('');
                        console.log('');
                        console.log('res_abstract_constraints ' + stringify(res_abstract_constraints));

                        //throw 'stop';

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

        '__load_abstract_tables': function(schema, callback) {
            // easier to load a bunch of these in one function,
            //  makes the load_abstract_schema function easier.

            // will return all the abstract ables that are loaded, in a collection of tables.

            // needs to get the list of all tables.

            var schema_name = schema.get('name');

            var that = this;
            //console.log('pre get_table_names');
            this.get_table_names(schema_name, function(err, table_names) {
                if (err) {

                } else {
                    //console.log('table_names ' + table_names);

                    //this.set('tables', new Collection({
                    //	'index_by': 'name'
                    //}));

                    //if (tof(spec.tables) == 'array') {
                    //	this.get('tables').load_array(spec.tables);
                    //}

                    // When a table gets added to this collection, it should be indexed according to its name.
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
                        //console.log('table_name ' + table_name);
                        that.load_abstract_table(schema_name, table_name, function(error, load_abstract_table_res) {
                            c++;
                            res.push(load_abstract_table_res);
                            //throw 'stop';
                            // Need to check that the table has been indexed properly.

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

        // This should possibly be within the Schema Resource.

        'abstract': function(callback) {
            // Refresh it?

            var that = this;
            //throw 'stop';

            // But then it could be called again before it's finished loading.
            //  In that case, need to defer it.

            //console.log();
            console.log('database.abstract');

            if (this._abstract) {
                callback(null, this._abstract);
            } else {


                var database_name = this.meta.get('name');
                var abstract_database = this._abstract = new Abstract.Database({
                    'name': database_name
                });

                var abstract_schemas = abstract_database.get('schemas');

                // And loading the schema resources causes it to (try to) load the abstract schema.
                //  Load the schema resources while it has an abstract database?
                //  The schema resources would then be able to give the abstract database in the reference.



                //throw 'stop';
                //console.log('');
                //console.log('pre load_schema_resources');
                //throw 'stop';
                // Or ensures the schema resources are loaded?
                this.load_schema_resources(function(err, schema_resources) {
                    if (err) {
                        throw err;
                    } else {

                        // Then needs to load the abstract schemas into the abstract_database

                        // Call functions in the schema resources to load the abstract schemas, giving them the abstract database

                        //console.log('schema_resources', schema_resources);

                        //console.log('schema_resources.length()', schema_resources.length());
                        //throw 'stop';

                        var fns = jsgui.Fns();
                        schema_resources.each(function(i, schema_resource) {
                            //console.log('');
                            //console.log('schema_resource', schema_resource);

                            // The number of table resources in the schema resource...

                            var schema_tables = schema_resource.data.get('tables');
                            //console.log('schema_tables.length()', schema_tables.length());

                            // And those tables will be able to get their abstract representations too.
                            //  But we want the abstract representations of the schemas to be in the abstract schemas collection.

                            // Get the abstract schema, and that will get put into the abstract schemas collection.
                            //  I hope that doing so at this stage makes sense.
                            //  Getting the abstract schema will make use of the schema resource.

                            // Build up a list of functions to call.

                            // Will be getting the abstract schemas, and then pushing them into the abstract schemas collection.
                            fns.push(function(callback) {

                                // But when getting the abstract schema, it gets the abstract db, which gets the abstract schema.???
                                //  So maybe different types of call / action when it has got the abstract db already.

                                // But of a problem... something needs to load the abstract schemas.
                                //  However, the abstract schemas function calls abstract to get the abstract database.
                                //   Perhaps deferring providing that would help???

                                // The schemas loading themselves, without calling on the abstract db function from the resource?


                                // Abstract, but with other parameter...?
                                schema_resource.abstract(function(err, abstract_schema) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        //console.log('abstract_schema', abstract_schema);

                                        // And the schema_resource.abstract will need to load up the various pieces of data needed to make the
                                        //  abstract schema resource.
                                        //   Referring to its Table Resources, or delegating to them.
                                        //   Need to give this more thought and coding to make sure that it's being called in the right pattern.

                                        // This seems to be a new style of programming (for me) where a network effect gets initiated, and then should
                                        //  get resolved in the right sequence. Avoiding having an overall control algorithm here.

                                        // If possible that Abstract Schema object will contain the Abstract tables etc.







                                        //throw 'stop';

                                        // The abstract schema should have been created with a reference to the abstract database,
                                        //  and has been added to the (abstract) schemas collection of the (abstract) database.

                                        callback(null, true);
                                    }
                                })
                            });

                        });

                        fns.go(function(err, res) {
                            if (err) {
                                throw err;
                            } else {
                                //console.log('res', res);
                                //throw 'stop';

                                that._abstract = abstract_database;
                                callback(null, abstract_database);
                            }
                        })
                        //throw 'stop';




                        // abstract_database



                        // And with those loaded schema resources, we can load abstract schemas, and add them to the abstract_database resource.

                        // Possibly do it individually.

                        // Then once they have loaded, we get the abstract for each of them
                        //  Ensure they all have their Abstract Classes loaded.

                        // However, the Schema may get the DB to load its Abstract Class.
                        //  Then the DB tells the Schema to do so?
                        //   With the DB having to wait until the Schema's abstract was made?

                        // then for each of them, load the abstract schemas.

                        // their own loading of abstract schemas (their own abstractions) will mean loading of lower-down abstract data.






                    }
                });

                // The database Resource's schemas need to be loaded.
                // Then we use them to get the Abstract Schemas for the Abstract Database.

                // load_schema_resources

                //  then once they are loaded, use them to load the abstract schemas for the Schema Resources.





            }






        },

        'load_abstract_schema': function(schema_name, callback) {

            // This will make use of the Schema Resource.
            //  Once the Database Resource has started, it will create Schema resources.
            //  It will then create Abstract Schema objects too.





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

            // Need to load these things within a schema.
            //  Possibly should use a schema resource.

            // I think creating the schema resources, and having them available through paths would make sense.
            //  However, would wind up having a lot of nested resources.
            console.log('load_abstract_schema');




            // should really be calling things in a sequence, loading the abstract tables, sequences and functions.
            console.log('pre load_abstract_tables');

            // Have a Schema Resource load the abstract tables?
            //  Making it so that we have the abstract classes, and the Resources as well.
            //  The Resources get started up in order to have the functionality to load the abstract info.
            //   Computation of changes happens on the abstract level, then changes (which are abstract in their representations) gets given to the Resources, or actuators,
            //    which carry out those changes.

            // For the moment it makes most sense to have the Schema Resource load Table Resources as necessary.
            //  The Table resource could load the table data as abstract.
            //  However, for getting the Table metadata, the Table Resource makes sense. The Table Resource would be set up with ways to query the Table, and its metadata.
            // Or Schema could load abstract tables, but at least DB is not doing that loading.

            // Not so sure about loading the tables here.
            //  Could be in the Schema Resource.





            /*
            this.load_abstract_tables(res, function(err, res_abstract_tables) {
                if (err) {

                } else {
                    console.log('res_abstract_tables ' + res_abstract_tables);
                    console.log('res_abstract_tables ' + tof(res_abstract_tables));

                    //throw 'stop';

                    // adding a collection to a collection.
                    //  don't want to push - that puts the collection in as one object.
                    //  collection will have more array-like interactions.

                    // Bit of a problem setting them all at once?

                    // So if we set a collection field to a collection, it should work...
                    //  However, there could be the problem with it not keeping the index?
                    //  Perhaps the new collection should have the properly set indexes.

                    res.set('tables', res_abstract_tables);
                    //throw 'stop';

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

                    //console.log('pre load_abstract_functions');
                    //that.load_abstract_functions(res, function(err, res_abstract_functions) {
                    //    if(err) {
                    //        throw err;
                    //    } else {
                    //        console.log('res_abstract_functions ' + res_abstract_functions);

                    //        res.set('functions', res_abstract_functions);

                    //        callback(undefined, res);

                    //    }
                    //});


                    callback(undefined, res);

                }

            });
            */

        },

        'load_abstract_schemas': function(callback) {
            var that = this;
            that.get_schema_names(function(err, schema_names) {
                if (err) {
                    throw err;
                } else {
                    console.log('schema_names', schema_names);


                    // We load the abstract schemas.
                    //  All of them get loaded as a Collection.


                    // load_abstract_schema

                    var fns = jsgui.Fns();
                    each(schema_names, function(i, name) {
                        fns.push([that, that.load_schema_resource, [name]]);
                    });

                    // I think they are in a Collection.

                    fns.go(function(err, res) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log('res', res);
                            //throw 'stop2';

                            callback(null, true);
                        }
                    })



                }
            });
        },

        // Will take some more work to ensure that schema resources are loaded, and gracefully handle reloading them.



        // make into sing/plur function?
        'load_schema_resources': function(callback) {

            // What if they are already loaded?

            console.log('load_schema_resources');


            var that = this;
            that.get_schema_names(function(err, schema_names) {
                if (err) {
                    throw err;
                } else {
                    console.log('schema_names', schema_names);

                    //throw 'stop';
                    // We load the abstract schemas.
                    //  All of them get loaded as a Collection.

                    // Then for each of them we create a new Schema Resource, as a subresource here.

                    // but data_schemas needs to be indexed by meta.get('name');

                    var data_schemas = that.data.get('schemas');

                    // and there is a collection of abstract schemas too
                    //console.log('data_schemas', data_schemas);
                    console.log('data_schemas.length()', data_schemas.length());

                    //each(schema_names, function(i, v) {
                    //    that.load_schema_resource
                    //})

                    var fns = jsgui.Fns();
                    each(schema_names, function(i, name) {
                        fns.push([that, that.load_schema_resource, [name]]);
                    });

                    fns.go(function(err, res) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log('res', res);
                            //throw 'stop';
                            callback(null, data_schemas);
                        }
                    });
                }
            });
        },

        'load_schema_resource': function(schema_name, callback) {
            console.log('load_schema_resource schema_name', schema_name);
            //throw 'stop';

            // Create a new Resource, and add it to the collection of data.schemas

            var data_schemas = this.data.get('schemas');

            // we create the new ones...
            //  only if they don't already exist?

            // I don't think that code around here will automatically add it to the pool, but if it's being created within the scope of an existing pool object, the pool will
            //  get notified so that the pool can add it should the pool be set to do so.


            // Have to see if a Resource matches constraints?

            //console.log('schema_name', schema_name);
            //console.log('tof schema_name', tof(schema_name));

            var sr = new Schema_Resource({
                'database': this,
                'name': schema_name
            });

            //console.log('');
            //console.log('pre data_schemas.push');

            // but if the schema resource is already loaded?
            //  can we use .set to set it with a particular value?
            //  or have it so that it's indexed and will notice and object if an attempt is made to overwrite
            //  or allow overwrite.



            data_schemas.push(sr);

            // When this schema gets added here, it should index it's name, but looking at meta.get('name').
            //  Needs to look into nested intrinsic properties and also the nested jsgui-type properties within ._


            // It seems like they are indexed according to meta.name now.



            //throw 'stop';

            // And that schema resource itself needs to start.

            //console.log('pre sr.start');
            //throw 'stop';
            sr.start(function(err, res) {
                if (err) {
                    throw err;
                } else {
                    //console.log('res', res);
                    //throw 'stop';

                    // And the schema resource should load tables?

                    callback(null, true);
                }
            })





        },

		'start': function(callback) {


            // This should start before the web-db resource.
            //  The web-db resource will rely on this or a similar DB resource.




			//throw 'stop';

			// As well as connecting, this could create the (default) public schema resource

			// I think loading the abstract database would be quite cool.
			//  That will get held, and will be used in order to carry out the database operations.

            var that = this;

            console.log('pre connect');
			this.connect(function(err, res) {
				if (err) {
                    console.log(err);
                    throw err;
					callback(err);
				} else {

					// Ensure there is a public schema resource.
					//  Or check for what schemas are in the database.


					// I think better than ensuring a public schema exists, we will read the database to create an Abstract Database object.
					//  That Abstract object can then be used as a basis for modifications on the database.


					//
                    console.log('pre load abstract schema');

                    // Possibly load the schema resources first.
                    //  The schema resources will be used to load the abstract schemas.
                    //  The schema resources will contain table resources which will be used to load data.

                    // that.load_schema_resources
                    //  or the schema resources automatically load on start.
                    //  their table resources would automatically load.
                    //   could tone that down.





                    // Does not load (just) the public schema.
                    //  We wil have it load all the schemas to start with.

                    // Probably no need to load abstract classes by default.

                    that.load_schema_resources(function(err, abstract_schemas) {
                        if (err) {
                            throw err;
                        } else {

                            // Once the resources are loaded, the abstract can then be loaded.
                            //  It will make use of the resources to obtain the metadata.

                            // This will not keep a note of the Abstract schemas.
                            //  The Abstract Classes

                            that.meta.set('status', 'on');

                            that.trigger('start');
                            callback(null, true);

                            /*

                            that.load_abstract_schemas(function(err, abstract_schemas) {
                                if (err) {
                                    throw err;
                                } else {
                                    //throw 'stop';

                                    that.meta.set('status', 'on');

                                    that.trigger('start');
                                    callback(null, true);
                                }
                            });

                            */


                            //callback(null, true);
                        }
                    })

                    /*


                    */

                    // meta.abstract_schemas

                    /*
                    that.load_abstract_schema('public', function(err, abstract_public_schema) {
                        console.log('abstract_public_schema', abstract_public_schema);



                        var tables = abstract_public_schema.get('tables');
                        console.log('tables', stringify(tables));
                        console.log('tof tables', tof(tables));
                        console.log('tables.length()', tables.length());

                        // Still seems like tables are not being indexed properly.
                        // Collection get needs to consult the index.
                        //  It seems that there may already be a primary index built in.
                        var table_users = tables.get('users');

                        var isys = tables.index_system;
                        console.log('isys', isys);

                        var pui = isys._primary_unique_index;
                        console.log('pui', pui);

                        var skvs = pui.sorted_kvs;

                        var skvs_keys = skvs.keys();
                        console.log('skvs_keys', skvs_keys);

                        console.log('table_users', table_users);

                        //throw 'stop';
                        that.meta.set('schema', abstract_public_schema);



                        // Now we have that abstract schema, a lot more can be done with it.

                        // The abstract schema will be held as a property.
                        //  meta.schema
                        //   that would be useful?
                        //    or just store it as a variable separately?
                        //     not so sure about listening for changes in the abstract schema and then making corresponding DB changes.

                        // The ensure_table part of things will create a new abstract item in the schema
                        //  The change will first be carried out on the abstract schema, and then made in the DB.

                        // Will go with a 'dirty checking' model. The abstract schema is compared, item by item, with the database.
                        //  mismatches are corrected where possible.

                        // Commands are generated that make use of the objects in the abstract schema / abstract db objects.









                        that.meta.set('status', 'on');

                        that.trigger('start');

                        //throw 'stop';

                    });

                    */

					//this.ensure_public_schema(function(err, public_schema_resource) {
					//	callback(null, true);
					//});



					
				}
			});
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

		// As well as getting data, should also be able to navigate to subresources, and get those subresources using code.


        // May be worth having a get_internal function?
        //  or _get
        //  aget
        //  async_get
        //  aget could be easier as a convention.

        // The default 'get' function calls aget here if async.

        // Resource is (partly) to bridge the gap between syncronous and asyncronous.



		'aget': fp(function(a, sig) {


            // Possibilities...
            //  With some data, particularly requested syncronously, we may want to return metadata.

            // Somehow have a wrapper around this so that if it's called syncronously, it gets called by Enhanced_Data_Object get



			//console.log('database resource get sig', sig);

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


				// May get/set from a public schema.




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




			table_def.schema = 'public';


			console.log('table_def', table_def);
			throw 'stop';

			// The abstract Postgres DB objects get created from this table def.
			// Postgres abstract core should be very useful for this.

			var apg_table = new Abstract.Table(table_def);
			var sql_create = apg_table.get_create_statement();

			//console.log('sql_create', sql_create);

			// Then execute that SQL.

			this.s_query(sql_create, function(err, res) {
				console.log('res', res);
				if (callback) callback(err, !!res);
			});



		},

        // could ensure the table on the default schema.

        'get_default_schema': function() {
            if (!this._default_schema) {
                var schemas = this.data.get('schemas');
                console.log('schemas', schemas);
                console.log('schemas.length()', schemas.length());
                //throw 'stop';

                // It now seems like it is not indexing the meta properties.
                //  eg, it should be indexed by meta.name
                //  It will take some more work to introduce that flexibility into the indexing system.





                var pblc = schemas.get('public');
                console.log('pblc', pblc);
                if (pblc) {

                    this._default_schema = pblc;
                    //return pblc;
                } else {
                    throw 'Missing public / default schema';
                }

                //



            }

            return this._default_schema;

        },

        'ensure_table': fp(function(a, sig) {
            var default_schema = this.get_default_schema();
            console.log('default_schema', default_schema);
            //throw 'stop';
            default_schema.ensure_table.apply(default_schema, a);
        }),



        // Would prefer to ensure the table within the Schema resource.
		'__ensure_table': fp(function(a, sig) {

			// Could generate the SQL to ensure the table (and its properties.)
			//  Could also make use of a Table resource if it has the right programming.
			//   But may not want the bother of making a Table Resource here.

			// Could have a Postgres ensure_table function, and Resource just provides a way to access it.
			//  dbi-postgres ensure_table
			//   And can take a JSON table definition, or an abstract definition / a Resource.
			//   A Table Resource may be a good way to describe it, but also want to make a simpler to use JSON interface that can ensure a table exists in a DB
			//    ensures columns exist as specified, may make some small changes where possible.

			console.log('postgres resource ensure_table');

			console.log('sig', sig);
			var that = this;


            // This function will work differently.
            //  It's going to look to see if the abstract table is already loaded in the schema


            // This is an abstract schema rather than a schema resource.
            //  I think having this connect into schema resources makes the most sense.
            //   Then the schema resources will use table resources.
            //   The improvement will be in that for in-depth code for interacting with a table, such as giving it a new definition, and then having it create SQL statements
            //    that will change the existing table into the specified one, we should have code within a specific table file.
            //   There could be quite a lot of code, and this will help to keep the code ordered.
            //    It also means there will be more run-time objects.
            //     The database resource will do less itself, but it's maybe going to be routing requests into its subresources, like tables.



            // There is no meta schema any longer.



            var schema = this.meta.get('schema');

            console.log('schema', schema);

            // And have a look for that table object by name


            // If there is already the abstract table item, we can then check to see what differences there are between the existing one, and a newly generated one.
            //  Perhaps that will be about running individual checks to see which is different.

            // There may also be the need for classes to do comparisons or various algorithms of the core abstract SQL components.

            var schema_tables = schema.get('tables');

            console.log('schema_tables', schema_tables);


            //throw 'stop';

            // Now we should be able to see if the table already exists in the schema tablesHave yo


			var obj_table, callback;
			if (sig == '[o]') {
                console.log('a[0]', a[0]);
                //throw 'stop';
				obj_table = a[0];
			}

			// 


			if (obj_table) {
				console.log('obj_table', obj_table);

                var name = obj_table.name;

                console.log('name', name);

                var existing_table = schema_tables.get(name);

                console.log('existing_table', existing_table);
                console.log('tof existing_table', tof(existing_table));
                //throw 'stop';

                if (!existing_table) {
                    // create it
                    that.create_table(obj_table, callback);

                } else {

                    // Ensure table column

                    // Will look at the columns in the abstract table.
                    var et_cols = existing_table.get('columns');
                    console.log('et_cols', et_cols);
                    console.log('et_cols.length()', et_cols.length());

                    // we ensure the columns we have

                    var spec_columns = obj_table.columns;

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




                    throw 'stop';


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


                throw 'stop';

				// See if the table already exists in the DB?
				// Create an abstract version of that Postgres table.

				// And would create the variois columns.

				// That abstract table needs to have access to an abstract public schema.
				//  That abstract public schema contains a bunch of things in a network model.
				//  To some extent, we will hide the fact that Postgres has separate schemas within databases
				//   Make a platform that's got wider functionality.
				//  More can be done automatically when the database resource has got the correct object model.

				// It may make sense to automatically load up the various abstract objects from the database on starting.
				//  Load the abstract database.
				//  Then it could also analyse it for modifications / fixes.
				//   (Like noticing that a Users_Roles table does not have the KFs set up and it expects them)

				// Loading up the abstract database makes sense in terms of a sense stage.
				//  We will have the right network loaded in order to make modifications.

				// Modifications could be things like adding tables





                /*


				var a_table = new Abstract.Table(obj_table);
				var table_name = a_table.get('name');

                if (table_name.value) table_name = table_name.value();
                console.log('table_name', table_name);

                console.log('schema_tables', stringify(schema_tables));

                var schema_table = schema_tables.get(table_name);
                console.log('schema_table', schema_table);

                // For the moment we can make a map of them here...
                //  However, the names are data_values, it should index by them.

                // Is the problem that when there is a Collection of Data_Values, it's not indexing them?

                schema_tables.each(function(i, v) {
                    console.log('v', v);
                    var name = v.get('name').value();
                    console.log('name', name);
                })
                throw 'stop';

				//throw 'stop';
				console.log('a_table', a_table.toString());

				// then we need to ensure the table is in the DB.

				// Does a table with that name exist?

				// db name as well?

                */
                /*
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
            console.log('get_table_names');

            if (tof(schema_name) == 'data_value') schema_name = schema_name.value();

            console.log('schema_name', schema_name);
            //console.log('table_name', table_name);

			var sql = 'SELECT table_name FROM information_schema.tables WHERE table_schema = \'' + schema_name + '\'';
            //console.log('sql', sql);
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
		
		'table_exists': function(table_name, callback) {

			var db_name = this.meta.get('name');
			console.log('db_name', db_name);

			// SELECT d.datname as "Name", u.usename as "Owner", pg_catalog.pg_encoding_to_char(d.encoding) as "Encoding" FROM pg_catalog.pg_database d LEFT JOIN pg_catalog.pg_user u ON d.datdba = u.usesysid ORDER BY 1;
			// SELECT d.datname as "Name", u.usename as "Owner" FROM pg_catalog.pg_database d LEFT JOIN pg_catalog.pg_user u ON d.datdba = u.usesysid ORDER BY 1;
			// SELECT EXISTS(d.datname as "Name", u.usename as "Owner" FROM pg_catalog.pg_database d LEFT JOIN pg_catalog.pg_user u ON d.datdba = u.usesysid WHERE... ORDER BY 1);
			
			// var sql = 'SELECT table_name FROM information_schema.tables WHERE table_schema = "' + schema_name + '"';

			// We need the schema name for this too...

			console.log('table_name', table_name);
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


        // It seems like the 'not null' table column constraint is implemented as an underlying check constraint.


        'execute_multirow_single_item_to_array_callback': function(sql, callback) {
            // will get the keys from the row?
            //console.log('');
            //console.log('execute_multirow_single_item_to_array_callback');
            //console.log('sql', sql);

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
                    //console.log('execute_multirow_single_item_to_array_callback ' + error);
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

                        console.trace();
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
		}

        // load_abstract_schema
		
		// could be an abstract function
		//  or abstract generation. abstract-postgres-gen?
		//  extends the normal abstract?
		
		// May want to ensure an abstract schema is in the db
		//  Abstract table, etc.
		// Ensure abstract functions are in the db
		
	});
	
	//exports.Postgres_Database = Postgres_Database;
	
	return Postgres_Database;
	
	//return jsgui;
	
});

