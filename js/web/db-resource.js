if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// As well as resource controls, we will have some other web related resources.
//  The web db resource (adapter) will adapt a DB resource to provide a Web DB interface.
//  The Web DB interface will be the basics for what is needed to run a website.
//   Web DB resource will not have DB implementation specific code.





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
				var that = this;
				// if it's not started, wait until it starts.

				db.on('start', function(e_start) {
					//console.log('e_start', e_start);

					that.start(callback);
				});

				if (db_status != 'on') {

				} else {
					var fns = jsgui.Fns();
					fns.push(function(cb) {
						console.log('pre ensure_table');
						//console.log('db.ensure_table', db.ensure_table);
						db.ensure_table({
							'name': 'users',
							'columns': [
								//['id', 'int', 'autoincrement', 'pk'],
								['id', 'serial', 'pk'],
								['username', 'char', 24],
								['passwordhash', 'char', 128]
							]
						});

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

						/*
							ALTER TABLE user_roles
							  ADD CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users (id)
							   ON UPDATE NO ACTION ON DELETE NO ACTION;
							CREATE INDEX fki_users
							  ON user_roles(user_id);
							*/


						db.ensure_table({
							'name': 'user_roles',
							'columns': [
								//['id', 'int', 'autoincrement', 'pk'],
								['id', 'serial', 'pk'],
								['user_id', 'int', 'fk-users'],
								['role_id', 'int', 'fk-roles']
							]
						});


						//  Could define relationships between tables, including foreign keys



						// User_Roles



						// Instead we could specify the DB and ensure that.



					});
					console.log('pre go');
					fns.go(function(err, res) {
						if (err) {
							throw err;
						} else {
							console.log('cb web resource');
							callback(null, true);
						}
					});
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