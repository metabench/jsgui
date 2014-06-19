if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

define(["../../../core/jsgui-lang-enh", 'pg', '../abstract/core', '../../../resource/core/resource', '../dbi-postgres'], function(jsgui, pg, Abstract, Resource, DBI_Postgres) {
    
	
	var Class = jsgui.Class, arrayify = jsgui.arrayify, fp = jsgui.fp, Data_Object = jsgui.Data_Object;
	var tof = jsgui.tof, is_defined = jsgui.is_defined, each = jsgui.each, stringify = jsgui.stringify, arrayify = jsgui.arrayify, mapify = jsgui.mapify;
	var get_item_sig = jsgui.get_item_sig, trim_sig_brackets = jsgui.trim_sig_brackets;
	
	
	
	var Table = Resource.extend({
		
		// Connects to a Postgres Server.
		// Want most functionality through get, set, and meta.get, meta.set.
		
		
		'init': function(spec) {

            this._super(spec);

            this.data = new Data_Object({});

            this.meta.set('type_levels', ['table', 'rdb', 'postgres']);

            console.log('init Table Resource');

            //console.log('spec.resource', spec.resource);
            //throw 'stop';

            // Meta.get('table_names')

            // At some point it will need to be a flat interface without objects.

            // The database resource will need to be flexible in some ways.

            // Will need to give it the plans for an authentication database, then the resource is going to ensure that database is set up.

            // This will not actually contain the data (though some Resources will), but will provide an interface to the data.


            // Could be a field though.
            if (spec.schema) {
                // Or data, rather than meta?
                //  It's a resource itself

                // Push itself into the schema's tables array?



                this.data.set('schema', spec.schema);
            }

            if (spec.name) {
                this.meta.set('name', spec.name);
            }
			

			
			
		},

        // Not sure about having columns and constraints as resources themselves.
        //  Resources help solve the problem of addressability. Constraints, columns, indexes and data are addressable within the Table Resource.


        // Need this Table Resource to be able to read metadata about the table.
        //



		
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

		//'connect': function(callback) {
			
		//},

        'start': function(callback) {
            // Not so sure about column resources.
            //  However, this would be a good place to load the metadata.
            //  It could be also be useful for the Resource to have a reference to the Abstract Class.

            // The Abstract system is connected in a whole network.
            //  Keeping the networks in sync will be a challenge.

            // At this point, it would be useful to load in the columns.
            //  Not sure at what point to initiate the loading and linking of the abstract data.






            callback(null, true);
        },
		
		// disconnect?
		
		'end': function() {
			pg.end();
			delete this.client;
		},

        'abstract': function(callback) {
            // This may need to be asynchronous as it may need to load data.

            var name = this.meta.get('name'), that = this;

            // So, while this data is in the midst of being obtained, it may be asked for it again.
            //  Should be handling that possibility.




            console.log('Table: ' + name + ', Resource.abstract ');



            if (this._abstract) {
                callback(null, this._abstract);
            } else {


                // Need to get or make the Abstract class that represents this.

                // We can get the schema.
                // From that we get the Abstract schema
                //  We use that as a reference within the Abstract system.



                var schema = this.data.get('schema');
                //console.log('schema', schema);
                schema.abstract(function(err, abstract_schema) {
                    if (err) {
                        throw err;
                    } else {
                        //console.log('abstract_schema', abstract_schema);

                        // Need to think more about how this is done.
                        //  Had difficulty with loading schema, with it referring backwards and forwards between the database and the schema.
                        //  Now need this to make use of that the abstract schema function loads, but also to add further to it.





                        // So, we use the abstract schema as a parameter to the abstract table.

                        // However, we check the abstract schema to see if it already has such a table?
                        //  Could put that in after I've made a check inside the Abstract Table in the part where it automatically adds itself to the schema
                        //   After that I will continue with the goal of making the web-db Resource wrapper, using Postgres and a general purpose interface.

                        var abstract_tables = abstract_schema.get('tables');
                        var existing_table = abstract_tables.get(name);

                        //if (existing_table) {

                        //}



                        var abstract_table = that._abstract = existing_table || new Abstract.Table({
                            'name': name,
                            'schema': abstract_schema
                        });

                        // Could have get_metadata function
                        //  provides structured info about the columns, constraints etc



                        that.get_metadata(function(err, metadata) {
                            if (err) {
                                throw err;
                            } else {
                                //console.log('metadata', metadata);

                                //console.log('metadata', stringify(metadata));

                                // Map out which columns are PKs first...
                                //  Columns and constraints rely on each other to some extent.

                                // It's now easier to see which columns are PK columns.
                                //  The columns can set up the constraints.
                                //   More difficult ('side effect?') programming that exploits network effects?

                                // Should be able to use the column data to construct the columns...
                                //  with the columns setting up the PKs.

                                var columns = metadata.columns;

                                each(columns, function(i, column) {
                                    //console.log('column', column);

                                    // However, the abstract column should have a reference to the abstract table.
                                    column.table = abstract_table;

                                    var abstract_column = new Abstract.Column(column);
                                    //console.log('abstract_column', abstract_column);

                                    //console.log('abstract_column', stringify(abstract_column));



                                });

                                callback(null, abstract_table);

                                //throw 'stop';







                                // Need to check the existing table / abstract table to see if various things are already there?




                                /*
                                var js = {
                                    "columns": [{
                                        "name": "id",
                                        "information_schema": {
                                            "table_catalog": "docs",
                                            "table_schema": "public",
                                            "table_name": "user_roles",
                                            "column_name": "id",
                                            "ordinal_position": 1,
                                            "column_default": "nextval('user_roles_id_seq'::regclass)",
                                            "is_nullable": "NO",
                                            "data_type": "integer",
                                            "character_maximum_length": null,
                                            "character_octet_length": null,
                                            "numeric_precision": 32,
                                            "numeric_precision_radix": 2,
                                            "numeric_scale": 0,
                                            "datetime_precision": null,
                                            "interval_type": null,
                                            "interval_precision": null,
                                            "character_set_catalog": null,
                                            "character_set_schema": null,
                                            "character_set_name": null,
                                            "collation_catalog": null,
                                            "collation_schema": null,
                                            "collation_name": null,
                                            "domain_catalog": null,
                                            "domain_schema": null,
                                            "domain_name": null,
                                            "udt_catalog": "docs",
                                            "udt_schema": "pg_catalog",
                                            "udt_name": "int4",
                                            "scope_catalog": null,
                                            "scope_schema": null,
                                            "scope_name": null,
                                            "maximum_cardinality": null,
                                            "dtd_identifier": "1",
                                            "is_self_referencing": "NO",
                                            "is_identity": "NO",
                                            "identity_generation": null,
                                            "identity_start": null,
                                            "identity_increment": null,
                                            "identity_maximum": null,
                                            "identity_minimum": null,
                                            "identity_cycle": null,
                                            "is_generated": "NEVER",
                                            "generation_expression": null,
                                            "is_updatable": "YES"
                                        },
                                        "primary_key_constraint": {
                                            "constraint_catalog": "docs",
                                            "constraint_schema": "public",
                                            "constraint_name": "user_roles_pkey",
                                            "table_catalog": "docs",
                                            "table_schema": "public",
                                            "table_name": "user_roles",
                                            "constraint_type": "PRIMARY KEY",
                                            "is_deferrable": "NO",
                                            "initially_deferred": "NO"
                                        }
                                    }, {
                                        "name": "user_id",
                                        "information_schema": {
                                            "table_catalog": "docs",
                                            "table_schema": "public",
                                            "table_name": "user_roles",
                                            "column_name": "user_id",
                                            "ordinal_position": 2,
                                            "column_default": null,
                                            "is_nullable": "YES",
                                            "data_type": "integer",
                                            "character_maximum_length": null,
                                            "character_octet_length": null,
                                            "numeric_precision": 32,
                                            "numeric_precision_radix": 2,
                                            "numeric_scale": 0,
                                            "datetime_precision": null,
                                            "interval_type": null,
                                            "interval_precision": null,
                                            "character_set_catalog": null,
                                            "character_set_schema": null,
                                            "character_set_name": null,
                                            "collation_catalog": null,
                                            "collation_schema": null,
                                            "collation_name": null,
                                            "domain_catalog": null,
                                            "domain_schema": null,
                                            "domain_name": null,
                                            "udt_catalog": "docs",
                                            "udt_schema": "pg_catalog",
                                            "udt_name": "int4",
                                            "scope_catalog": null,
                                            "scope_schema": null,
                                            "scope_name": null,
                                            "maximum_cardinality": null,
                                            "dtd_identifier": "2",
                                            "is_self_referencing": "NO",
                                            "is_identity": "NO",
                                            "identity_generation": null,
                                            "identity_start": null,
                                            "identity_increment": null,
                                            "identity_maximum": null,
                                            "identity_minimum": null,
                                            "identity_cycle": null,
                                            "is_generated": "NEVER",
                                            "generation_expression": null,
                                            "is_updatable": "YES"
                                        }
                                    }, {
                                        "name": "role_id",
                                        "information_schema": {
                                            "table_catalog": "docs",
                                            "table_schema": "public",
                                            "table_name": "user_roles",
                                            "column_name": "role_id",
                                            "ordinal_position": 3,
                                            "column_default": null,
                                            "is_nullable": "YES",
                                            "data_type": "integer",
                                            "character_maximum_length": null,
                                            "character_octet_length": null,
                                            "numeric_precision": 32,
                                            "numeric_precision_radix": 2,
                                            "numeric_scale": 0,
                                            "datetime_precision": null,
                                            "interval_type": null,
                                            "interval_precision": null,
                                            "character_set_catalog": null,
                                            "character_set_schema": null,
                                            "character_set_name": null,
                                            "collation_catalog": null,
                                            "collation_schema": null,
                                            "collation_name": null,
                                            "domain_catalog": null,
                                            "domain_schema": null,
                                            "domain_name": null,
                                            "udt_catalog": "docs",
                                            "udt_schema": "pg_catalog",
                                            "udt_name": "int4",
                                            "scope_catalog": null,
                                            "scope_schema": null,
                                            "scope_name": null,
                                            "maximum_cardinality": null,
                                            "dtd_identifier": "3",
                                            "is_self_referencing": "NO",
                                            "is_identity": "NO",
                                            "identity_generation": null,
                                            "identity_start": null,
                                            "identity_increment": null,
                                            "identity_maximum": null,
                                            "identity_minimum": null,
                                            "identity_cycle": null,
                                            "is_generated": "NEVER",
                                            "generation_expression": null,
                                            "is_updatable": "YES"
                                        }
                                    }],
                                    "constraints": {
                                        "primary_key": [{
                                            "constraint_catalog": "docs",
                                            "constraint_schema": "public",
                                            "constraint_name": "user_roles_pkey",
                                            "table_catalog": "docs",
                                            "table_schema": "public",
                                            "table_name": "user_roles",
                                            "constraint_type": "PRIMARY KEY",
                                            "is_deferrable": "NO",
                                            "initially_deferred": "NO",
                                            "columns": [{
                                                "column_name": "id",
                                                "constraint_name": "user_roles_pkey",
                                                "ordinal_position": 1
                                            }]
                                        }]
                                    }
                                }

                                */

                                // The metadata should be enough (as plane JS objects) to make the various Abstract objects.
                                //  Columns and constraints.




                                // Quite a lot of data in there.

                                // Would be good to get the constraints metadata as well.
                                // Although some constraints metadata gets included in the columns metadata, it would be good to have
                                //  JSON-like data sets specifically about constraints.

                                //  The constraints metadata will be organised as different sorts of constraints.
                                //  Follows Sense, Model, Plan, Act type of procedure, where this loads in all the necessary data about the table,
                                //   and once it has it it puts that data into a more structured / networked / organised format.







                                // could make a map out of the metadata too.

                                // want to get the constraints metadata too.

                                // The information_schema does not contain info on primary keys.
                                // get_columns_metadata should do.






                            }
                        })

                        // We need to load the columns.
                        //  The Table Resource should already have them loaded. ?????

                        // The Table Resource not having columns loaded, apart from Abstract ones...
                        //  That makes sense if the columns are not Resources.

                        //  Should probably get the column metadata.







                        // We need to load more (meta)data into that abstract table...





                        //callback(null, abstract_table);



                    }
                });
                //var resource_schema = schema.)



                //
            }

            //throw 'stop';

        },

        'get_table_pk_constraints_rows': function(callback) {
            var sql;
            var schema = this.data.get('schema');

            var schema_name = schema.meta.get('name');
            var database = schema.data.get('database');
            var table_name = this.meta.get('name');

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

            database.execute_multirow_to_callback(sql, callback);

            // often, when this has completed, further information about the constraints will be obtained.



        },

        // gets the full info...
        //  maybe we don't want so many columns.
        //  could use some aliases too.

        // perhaps could just get column name and ordinal position.


        'get_constraint_columns': function(constraint_name, callback) {

            var schema = this.data.get('schema');

            var schema_name = schema.meta.get('name');
            var database = schema.data.get('database');
            var table_name = this.meta.get('name');

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



            database.execute_multirow_to_callback(sql, callback);




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



        'get_table_sequences': function(callback) {
            // could give an abstract table or a table name.

            // will get all the columns, and look at the 'default' value for each.
            var schema = this.data.get('schema');

            var schema_name = schema.meta.get('name');
            var database = schema.data.get('database');
            var table_name = this.meta.get('name');
            //var res = [];

            this.get_columns_information_schema(function(error, info_sch) {
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

        'get_metadata': function(callback) {
            var res = {};

            var that = this;

            that.get_columns_metadata(function(err, columns_metadata) {
                if (err) {
                    throw err;
                } else {
                    res.columns = columns_metadata;


                    that.get_constraints_metadata(function(err, constraints_metadata) {
                        if (err) {
                            throw err;
                        } else {
                            res.constraints = constraints_metadata;


                            // Indexes? (rules and triggers)

                            callback(null, res);



                        }
                    })

                }
            })
        },

        'get_primary_key_constraints_metadata': function(callback) {

            // this.get_pk_constraints_with_column_metadata
            //

            var res = [];
            var map_pk_constraints = {};

            var that = this;

            that.get_table_pk_constraints_rows(function(err, pk_constraints) {
                if (err) {
                    throw err;
                } else {
                    //console.log('pk_constraints', pk_constraints);

                    // And need to get the associated columns (including their (basic) metadata.
                    //  At least need to get column names associated with that PK.

                    // Will then need to test this with multiple PK columns.

                    // needs to make array of fns, and use them to get the associated column(s) information.

                    var fns = jsgui.Fns();

                    each(pk_constraints, function(i, pk_constraint) {
                        //console.log('pk_constraint', pk_constraint);

                        //throw 'stop';

                        var constraint_name = pk_constraint.constraint_name;

                        map_pk_constraints[constraint_name] = pk_constraint;

                        res.push(pk_constraint);

                        fns.push([that, that.get_constraint_columns, [constraint_name], function(err, constraint_columns) {
                            if (err) {
                                throw err;
                            } else {
                                //console.log('constraint_columns', constraint_columns);

                                each(constraint_columns, function(i, constraint_column) {
                                    //console.log('constraint_column', constraint_column);

                                    //var constraint_name = constraint_column.constraint_name;
                                    var column_name = constraint_column.column_name;

                                    //map_pk_constraints[constraint_name][column_name] = map_pk_constraints[constraint_name][column_name] || [];
                                    //map_pk_constraints[constraint_name][column_name].push(constraint_column);

                                });

                                //pk_constraint.columns = jsgui.clone(map_pk_constraints[constraint_name]);
                                pk_constraint.columns = constraint_columns;


                                //throw 'stop';
                            }
                        }]);
                    })

                    fns.go(function(err, res_fns) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log('res_fns', res_fns);
                            callback(null, res);
                        }
                    })






                }
            });
        },

        'get_constraints_metadata': function(callback) {

            var res = {};

            var that = this;

            that.get_primary_key_constraints_metadata(function(err, primary_key_constraints_metadata) {
               if (err) {
                   throw err;
               } else {
                   res.primary_key = primary_key_constraints_metadata;

                   callback(null, res);

               }
            });
            // Primary key constraints

            // Foreign key constraints

            // Other types of constraints





        },


        'get_columns_metadata': function(callback) {
            console.log('Table Resource get_columns_metadata');

            // Should maybe do a query using the Schema or DB Resource.

            // This should just be about outputting the (useful) metadata as JSON.
            //  Want to find out more about the constraints that apply to the columns,
            //   but having the constraints get loaded seems like a useful feature.
            //   The references can be set up so they point to each other in JavaScript land too.

            // May be good to get more than just the information_schema data here.
            //  Something more general and usable.
            //  Would be worth keeping the column metadata similar between different DBIs?
            //   Or to use the DBI's metadata as available
            //   But of both?




            var schema = this.data.get('schema');
            //console.log('schema', schema);

            var that = this;

            // Or get the constraints columsn...

            // Need to keep some data in a map.
            //  Then process that map once we have the data,
            //   need to work out which columns are PK constraints.


            this.get_table_pk_constraints_rows(function(err, pk_constraints) {
                if (err) {
                    throw err;
                } else {
                    //console.log('pk_constraints', pk_constraints);

                    var map_pk_constraints = {};

                    var map_columns_with_pk_constraints = {};



                    each(pk_constraints, function(i, pk_constraint) {
                        //console.log('pk_constraint', pk_constraint);

                        var constraint_name = pk_constraint.constraint_name;
                        map_pk_constraints[constraint_name] = pk_constraint;


                    });

                    //console.log('');
                    //console.log('map_pk_constraints', map_pk_constraints);





                    var fns = jsgui.Fns();

                    // and have a map of column constraints.



                    each(pk_constraints, function(i, pk_constraint) {
                        //console.log('pk_constraint', pk_constraint);
                        var constraint_name = pk_constraint.constraint_name;

                        fns.push([that, that.get_constraint_columns, [constraint_name], function(err, constraint_columns) {
                            //console.log('constraint_columns', constraint_columns);

                            each(constraint_columns, function(i, constraint_column) {
                                //console.log('constraint_column', constraint_column);

                                var ordinal_position = constraint_column.ordinal_position;

                                var column_name = constraint_column.column_name;



                                // use ordinal_position in an array of the colummns that apply to a constraint.



                                // match them up with the constraints.
                                var constraint_name = constraint_column.constraint_name;
                                var constraint = map_pk_constraints[constraint_name];

                                // Map that column and having the PK constraint.

                                map_columns_with_pk_constraints[column_name] = map_columns_with_pk_constraints[column_name] || [];
                                map_columns_with_pk_constraints[column_name].push(constraint);





                                //console.log('constraint', constraint);








                            });

                            // So while we get the constraint columns, we can cross-reference them with the columns
                            //  Setting some columns as being PKs.



                        }]);
                    });



                    fns.go(function(err, res) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log('res', res);

                            //console.log('map_columns_with_pk_constraints', map_columns_with_pk_constraints);

                            //throw 'stop';


                            // After this, we get the normal columns metadata
                            //  We can annotate it using the data we have about the PK constraints.


                            that.get_columns_information_schema(function(err, columns_information_schema) {
                                if (err) {
                                    throw err;
                                } else {
                                    //console.log('columns_information_schema', columns_information_schema);

                                    // And then we should be able to create abstract columns out of the information_schema.
                                    var res = [];


                                    each(columns_information_schema, function(i, column_information_schema) {
                                        //console.log('column_information_schema', column_information_schema);


                                        //var abstract_column = new Abstract.Column({
                                        //    'information_schema': column_information_schema
                                        //});
                                        //column_information_schema

                                        var column_name = column_information_schema.column_name;

                                        var obj_res = {
                                            'name': column_name,
                                            'information_schema': column_information_schema
                                        };



                                        if (map_columns_with_pk_constraints[column_name]) {

                                            // Could have more than 1 constraints in an array.
                                            //  Do that later on.
                                            obj_res.primary_key_constraint = map_columns_with_pk_constraints[column_name][0];

                                        }


                                        res.push(obj_res);




                                        // Don't hold onto that data...



                                    })

                                    callback(null, res);

                                    //
                                }
                            });


                            //throw 'stop';
                        }
                    })

                    //throw 'stop';




                    // Then with that info on the constraints (including names) we get further info on the constraints.
                    //  need to query to find out what columns they refer to.

                    /*
                    that.get_constraint_columns(function(err, constraint_columns) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('constraint_columns', constraint_columns);

                            // set up fns to get all of the columns info on those constraints.




                            throw 'stop';



                        }
                    })
                    */



                }
            })



            //throw 'stop';


        },

        'get_columns_information_schema': function(callback) {
            // use a query for this...
            var schema = this.data.get('schema');
            var schema_name = schema.meta.get('name');

            var table_name = this.meta.get('name');



            var sql, that = this;
            //if (this.current_schema_name) {
            //	sql = 'SELECT * FROM information_schema.columns WHERE table_name = \'' + table_name + '\' AND table_schema = \'' + this.current_schema_name + '\';';
            //
            //	//sql = 'SELECT exists(SELECT column_name FROM information_schema.columns WHERE table_name = \'' + table_name + '\' AND table_schema = \'' + this.current_schema_name + '\' AND column_name =  \'' + column_name + '\') AS "exists";';
            //} else {
            //	sql = 'SELECT * FROM information_schema.columns WHERE table_name = \'' + table_name + '\';';
            //}

            var database = schema.data.get('database');


            //console.log('4) table_name ' + table_name);
            sql = 'SELECT * FROM information_schema.columns WHERE table_name = \'' + table_name + '\' AND table_schema = \'' + schema_name + '\';';


            //var sql = 'SELECT * FROM information_schema.columns WHERE table_name = \'' + table_name + '\';';

            //console.log('sql ' + sql);

            var res = [];
            database.execute_query({
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
		
		// dbi-postgres will do this, making use of the more basic connector API.
		
		// quite possibly the resource connector should be dealing with the DB names.
		//  it will be used to connect to other DBs as well.
		
		'get_table_names': function(callback) {
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
		
		// could be an abstract function
		//  or abstract generation. abstract-postgres-gen?
		//  extends the normal abstract?
		
		// May want to ensure an abstract schema is in the db
		//  Abstract table, etc.
		// Ensure abstract functions are in the db
		
	});
	
	
	return Table;
	
	//return jsgui;
	
});

