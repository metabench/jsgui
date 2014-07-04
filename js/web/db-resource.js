if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// As well as resource controls, we will have some other web related resources.
//  The web db resource (adapter) will adapt a DB resource to provide a Web DB interface.
//  The Web DB interface will be the basics for what is needed to run a website.
//   Web DB resource will not have DB implementation specific code.

// The aim of this is to use some quite general purpose code for making a website's DB, and then exposing it as a Resource.

// The abstractions for this are taking ages to program.
//  I would possibly prefer a simpler web db system???
//  However the abstractions are fundamental to getting some systems running.

// Web DB Postgres could just create a blank DB from a backup / dump.
//  It could be made in a few hours / days.

//  It would allow storage of the website's information.
//










define(["./jsgui-html", "../resource/core/resource"], 
	function(jsgui, Resource) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;

		var Web_DB_Resource = Resource.extend({
			fields: {


				// It's a database resource.
				'database': Object//,
				//'name': String
			},

			'init': function(spec) {
				this._super(spec);
				var that = this;

				// This serves as an adapter to a database resource.

				// Will have get and set properties.
				//  Not sure about nested subresources.
				//  The Resource is an object that provides an interface to information. How the Resource does that is an implementation detail, but when patterns emerge they could be
				//  made more convenient somehow.





			},
			'start': function(callback) {
				// This can only start when its prerequisite resource has started.
				console.log('Web_DB_Resource start');





				var db = this.get('database');

				// Why does this change from being a Data_Value to a string?
				//  No matter how it winds up working, if it's currently a Data_Value, and we call set, giving it a string, it stays a Data_Value


				var dbs = db.meta.get('status');
				console.log('dbs', dbs);



				var db_status;

				if (dbs.value) {
					db_status = dbs.value();
				} else {
					db_status = dbs;
				}


                console.log('db_status', db_status);
                console.log('tof db_status', tof(db_status));
                //throw 'stop';
				var that = this;
				// if it's not started, wait until it starts.

				db.on('start', function(e_start) {
					//console.log('e_start', e_start);

					that.start(callback);
				});

				if (db_status != 'on') {

				} else {
					var fns = jsgui.Fns();

                    // Not sure about ensuring all these tables to start with...
                    //  May be better to ensure a schema or a database.

                    //throw 'stop';

                    // Perhaps I should make a Postgres-DB-Resource for the moment that sets things up in that DB?
                    //  This system has got too much abstraction and complexity to get it done quickly.




					fns.push(function(cb) {

                        // Don't want to load the schema resources too many times, or have them properly overwrite.


                        // db.ensure(def)

                        //  The definition given would not have to be specific to Postgres.
                        //   Would be a fairly simple declarative definition of a database.

                        var db_def = {
                            'name': 'docs',
                            'tables': [
                                {
                                    'name': 'users',
                                    'columns': [
                                        //['id', 'int', 'autoincrement', 'pk'],
                                        ['id', 'serial', 'pk'],
                                        ['username', 'character', 24],
                                        ['passwordhash', 'character', 128]
                                    ]
                                },

                                {
                                    'name': 'roles',
                                    'columns': [
                                        //['id', 'int', 'autoincrement', 'pk'],
                                        ['id', 'serial', 'pk'],
                                        ['name', 'character', 24]
                                    ]
                                },

                                {
                                    'name': 'user_roles',
                                    'columns': [
                                        //['id', 'int', 'autoincrement', 'pk'],
                                        ['id', 'serial', 'pk'],
                                        ['user_id', 'int', 'fk-users'],
                                        ['role_id', 'int', 'fk-roles']
                                    ]
                                }
                            ],
                            'crud': true
                        };

                        db.ensure(db_def, function(err, res) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('res', res);
                            }
                        })



                        /*
                        db.abstract(function(err, res_abstract) {
                            if (err) {
                                throw err;
                            } else {
                                //console.log('res_abstract', res_abstract);

                                // The abstract DB should have its schemas loaded.
                                //  (somehow)

                                // May need specific handling for schemas in Postgres (maybe Oracle too)

                                var schemas = res_abstract.get('schemas');

                                //console.log('schemas', schemas);
                                //console.log('schemas.length()', schemas.length());

                                // Then we want to see if the abstract tables are represented.
                                //  We can use a schema object in place of a normal db object (substitute the Postgres Schema Resource for a MSSQL Database Resource etc)

                                var public_schema = schemas.get('public');
                                //console.log('public_schema', public_schema);

                                var public_schema_tables = public_schema.get('tables');
                                //  It should have loaded up the abstract schema's abstract tables too.

                                console.log('public_schema_tables.length()', public_schema_tables.length());

                                //console.log('public_schema_tables', stringify(public_schema_tables));

                                each(public_schema_tables, function(i, v) {
                                    //console.log('v', stringify(v));

                                    var name = v.get('name').value();
                                    console.log('name', name);

                                    // We can also have a look into the tables.

                                });

                                // I think the change command generator would be an advanced piece of abstract functionality.
                                //

                                var existing_public_schema = public_schema;

                                // Problem here...
                                //  Not specifically using Postgres.
                                //  Need to send params to another layer.

                                // We should get the database resource to do this.

                                // the database resource ensure method.





                                var target_public_schema = new Abstract.Schema({
                                    'tables': [
                                        {
                                            'name': 'users',
                                            'columns': [
                                                //['id', 'int', 'autoincrement', 'pk'],
                                                ['id', 'serial', 'pk'],
                                                ['username', 'char', 24],
                                                ['passwordhash', 'char', 128]
                                            ]
                                        },

                                        {
                                            'name': 'roles',
                                            'columns': [
                                                //['id', 'int', 'autoincrement', 'pk'],
                                                ['id', 'serial', 'pk'],
                                                ['name', 'char', 24]
                                            ]
                                        },

                                        {
                                            'name': 'user_roles',
                                            'columns': [
                                                //['id', 'int', 'autoincrement', 'pk'],
                                                ['id', 'serial', 'pk'],
                                                ['user_id', 'int', 'fk-users'],
                                                ['role_id', 'int', 'fk-roles']
                                            ]
                                        }
                                    ]
                                });

                                console.log('target_public_schema', target_public_schema);
                                throw 'stop';






                                abstract_postgres_comparison_change_command_generator.generate(existing_public_schema, function(err, change_commands) {

                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log('change_commands', change_commands);

                                    }
                                })





                                // 19/06/2014
                                //  It has been hard work making the Abstract DB and the Resource system load together.
                                //  I have not opted for a loading algorithm that's in one place, but have exploited network and tree effects.
                                //
                                //  Now that the abstract resource has loaded, we can use the compare and change generator to update the active database.






                                // Should probably get rid of most / all other logging.
                                //  Then have logging for key initializations / abstract calls.
                                //  Would be able to see the sequencing in which different abstract objects get created or added to collections.
                                //  Currently having a problem with abstract tables appearing twice.



                                // Seems have been putting too many tables into the abstract schema.


                                //throw 'stop';
                            }
                        })

                        */



						//console.log('pre ensure_table');
						//console.log('db.ensure_table', db.ensure_table);

						// There would be a public schema in that Postgres database, used by default.
						//  Want it so that there is the schema object that gets the tables added to it.
						//  That schema object could be sent into a persistance mechanism.


						//  however, that looks more postgres specific.
						// db.ensure_schema({'tables': [...]})

						// Would be worth having code that makes use of a default public schema (and later allows other schemas).

						// schema.ensure_table would make more sense here.

						// Creates the abstract table according to that def.

                        // Get the abstract table out of the existing system?
                        //  Though this part will be about accessing a db that is not postgres specific.

                        // ensure_table will only take place once it has the abstract model to begin with.
                        //  changes will be made to that abstract model. Those changes will then be made in the DB, making use of the abstract model to express them to the DB.

                        // The implementation specific general db resource will make a note of the abstract DB, getting that when it starts / connects.
                        //  It will use that info in order to make changes and carry out the commands given.

                        // When the resource itself starts, it will get the abstract data
                        //  The Postgres database resource will get the abstract data about the schemas in the db.

                        // Ensure table will be different
                        //  It will check those items against the abstract schema
                        //  If there are differences, it will modify the abstract schema and carry out the corresponding changes in the DB.

                        // ensure_table will work differently once it has access to the abstract schema, which will have been loaded.
                        //  it's going to check the definition given against the abstract schema.








                        //throw 'stop';

                        // Ensure table will create the abstract db?


                        /*
						db.ensure_table({
							'name': 'users',
							'columns': [
								//['id', 'int', 'autoincrement', 'pk'],
								['id', 'serial', 'pk'],
								['username', 'char', 24],
								['passwordhash', 'char', 128]
							]
						});
						*/

                        //console.log('table ensured');
                        //throw 'stop';

                        /*
						// Roles
						//  Role name, role ID

						db.ensure_table({
							'name': 'roles',
							'columns': [
								//['id', 'int', 'autoincrement', 'pk'],
								['id', 'serial', 'pk'],
								['name', 'char', 24]
							]
						});



						// Also link between the role and the users - a many to many link table.
						//  id, and fk for each table.

						// Want to make it easy to set up foreign keys.
						//  Creating a Column that acts as a Foreign Key. Perhaps it could set up the FK constraint on the table if necessary.
						//  Don't want to much variation in the coding, less syntax than SQL.
						//  Will have easy interoperation between DMBSs.


							//ALTER TABLE user_roles
							//  ADD CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users (id)
							//   ON UPDATE NO ACTION ON DELETE NO ACTION;
							//CREATE INDEX fki_users
							//  ON user_roles(user_id);


						// So when a fk column is made, it will update the table constraints so it contains foreign keys.


						db.ensure_table({
							'name': 'user_roles',
							'columns': [
								//['id', 'int', 'autoincrement', 'pk'],
								['id', 'serial', 'pk'],
								['user_id', 'int', 'fk-users'],
								['role_id', 'int', 'fk-roles']
							]
						});

						*/




						//  Could define relationships between tables, including foreign keys



						// User_Roles



						// Instead we could specify the DB and ensure that.

                        cb(null, true);

					});
                    /*
                    fns.push(function(cb) {
                         db.ensure_table({
                         'name': 'roles',
                         'columns': [
                         //['id', 'int', 'autoincrement', 'pk'],
                         ['id', 'serial', 'pk'],
                         ['name', 'char', 24]
                         ]
                         });


                        cb(null, true);

                    });

                    fns.push(function(cb) {


                        db.ensure_table({
                            'name': 'user_roles',
                            'columns': [
                                //['id', 'int', 'autoincrement', 'pk'],
                                ['id', 'serial', 'pk'],
                                ['user_id', 'int', 'fk-users'],
                                ['role_id', 'int', 'fk-roles']
                            ]
                        });


                        cb(null, true);

                    });
                    */
					//console.log('pre go');


					fns.go(function(err, res) {
						if (err) {
							throw err;
						} else {
							//console.log('cb web resource');
							callback(null, true);
						}
					});

                    //callback(null, true);

				}

				//throw 'stop';


				

				// Relies on the database resource starting (a requirement), and will set up the web database.
				//  Users table.

				


				// The first step should be to look into the database
				//  Build up an abstract representation of it.

				// Should be able to get an abstract representation of a Postgres DB using existing code, possibly with some fixes / changes.
				//  Dealing with the Abstract Postgres tables seems necessary, but also want it to be made so that those programming objects can be made from JSON.



				// will call a bunch of functions in a sequence.

					




			}
		});
		return Web_DB_Resource;
});