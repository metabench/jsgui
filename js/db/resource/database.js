


// Will there be a single resource module to load the references for a bunch of different resources related to a DB?
//  Do we need to load 3 sepearate files?
//   Or use an 'all' file within the mongo/resource directory?

// This is the general db resource?
// Or base class db resource?
// Or both?

// 



define(["module", "path",
	"../../core/jsgui-lang-enh", "../../web/resource", "./server", "../mongo/resource/all", "../postgres/resource/all"], 
	function(module, path, jsgui, Resource, Server, Mongo, Postgres) {
	
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Collection = jsgui.Collection;
	var is_defined = jsgui.is_defined, tof = jsgui.tof, stringify = jsgui.stringify, each = jsgui.each;
	var fp = jsgui.fp;
	// The basic resource connector... not quite sure what it needs to do 27/02/2012.
	//  Fills in the gap conceptually.
	
	var Rsce = Resource;

	// Should be able to connect to pretty much any database with this (eventually).
	//  Also should have some of its own database capabilities.

	//  Should be able to set it so that it represents a specific DBMS and then it uses the appropriate resource to
	//   connect to that.

	// Should provide quite a general interface to a variety of databases.
	//  Will do Mongo, Postgres(, MariaDB)

	// If given server info, it will create a database server?
	//   May need to be given the reference to avoid a circular reference?

	// Circulate_References?

	// The Database-Server would also refer to the database I assume.

	// I think getting this working to a reasonable standard with both Mongo and Postgres would be good.
	//  Need to tell the difference between base classes and advanced classes.
	//  Specific classes inherit from base classes
	//  Advanced classes make use of various specific classes to serve a general case, making use of the correct specific classes

	// So, we could tell an advanced database class to do various things, with a setting being postgres or whatever (alongside the info needed
	//  to connect to the db. )

	// The base database class would not actually be usable by itself (except possibly in abstract?)

	// Defining a Data Object, with constraints etc is how it can be done.
	//  Then that gets translated into being an actual database.
	// Then, we could actually connect the data models once the DB has been persisted (somehow, use the JS data classes for only a partial set of data)

	// Defining the relations between items, or defining items in such a way that they could be persisted as relational.

	// The Authentication Resource would have a node (jsgui) implementation of the database.







	//var Server;
	
	var Database = Rsce.extend({

		'init': function(spec) {

			var that = this;

			this._super(spec);
			
			console.log('3) spec.server._ ' + stringify(spec.server._));
			console.log('this._ ' + stringify(this._));

			// Server info
			//  (inc what type of DBMS)
			// Auth info

			this.meta.set('type_levels', ['database']);

			if (spec.server) {
				//

				// Though, we can create an actual Server resource when we are just given a Data_Object.

				// Not setting it as a Data_Object?

				//console.log('tof(spec.server) ' + tof(spec.server));

				if (spec.server.type) {
					this.meta.set('type', spec.server.type);
				}

				this.meta.set('server', spec.server);


				// Need some kind of function intercepts for meta get...
				//  So we can return the tables metadata.




				/*
				if (tof(spec.server) == 'object') {

					//var Server = require('./server');
					// But the path is wrong here...
					//  Can we get the module path?

					if (!Server) {
						console.log('module.uri ' + module.uri);

						var dirName = path.dirname(module.uri);
						console.log('dirName ' + dirName);

						var serverModulePath = dirName + '/server.js';

						that.loadingServerModule = true;

						// Will need to have a way for the start of the db resource to be delayed until the module for the
						//  server has loaded.

						// Could maybe set the server property to be a promise of the server.
						//  Maybe integrate promises into Data_Objects to help bridge the gap between sync/async.

						require([serverModulePath], function(ModuleServer){
				            // Delayed loading
				            //Company = C;
				            Server = ModuleServer;
				            that.loadingServerModule = null;

				            var server = new Server(spec.server);
							that.meta.set('server', server);
				        });


					} else {
						var server = new Server(spec.server);
						that.meta.set('server', server);
					}


					

					//var server = new Server(spec.server);
					//this.meta.set('server', server);


				} else {
					this.meta.set('server', spec.server);
				}

				*/

			}
			if (spec.type) {
				this.meta.set('type', spec.name);
			}
			if (spec.name) {
				this.meta.set('name', spec.name);
			}

			// May have quite a few different possible properies.

			if (spec.username) {
				this.meta.set('username', spec.username);
			}
			if (spec.password) {
				this.meta.set('password', spec.password);
			}
			
			// Will have a 'tables' field.

			this.meta.set('status', 'off');

			// Collections will be a field of itself
			this.meta.set('collections', new Collection({'fields': {'name': 'unique string'}}));

			this.meta.add_event_listener('change', fp(function(a, sig) {
				console.log('meta change sig ' + sig);
				console.log('a ' + stringify(a));
			}));

			// some way of modigying a data_object's get function, so it intercepts it.
			//  useful to refer to table.meta / database.meta in order to interact with metadata.
			//   keeping the processing within the resource module.

			var old_meta_get = this.meta.get;
			var meta = this.meta;

			this.meta.get = fp(function(a, sig) {
				console.log('new meta get sig ' + sig);

				if (sig == '[s]') {
					return old_meta_get.apply(meta, a);
				}
				if (sig == '[s,f]') {
					// it's the asyncronous way of doing it.
					//  we may have interrupts in here so that a different function gets called.

					var field_name = a[0];
					console.log('field_name', field_name);
					
					//if (that['get_' + field_name]) {

					//}

					if (field_name == 'tables') {
						// use the specific server to get the tables.
						//  mongo resource will use that as a synonym for collections.

						return that._specific.meta.get('tables', a[1]);
						//return that.get_tables(a[1]);
					}

					//return old_meta_get.apply(meta, a);
				}


			})



			// active-db-resource
			//  The resource that this Database resource uses in order to actually connect to a database.
			
		},

		'get_tables': function(callback) {


			//return this._specific.get_tables(callback);
		},

		'start': function(callback) {

			// Perhaps loading the server module should be done on start rather than init?
			//  That may make a lot more sense with resources as we expect init to be sync but start async.

			// Will need to ensure the Server module has loaded, Server object created, and started.
			//  We have the Database resource able to create the Server resource for convenience.
			//   Many developers will think in terms of connecting to a database.
			//   Automatically connecting to the necessary server makes sense.

			// It may also be worth making the specific resource objects for the particular database that they want
			//  to connect to.

			// Would also be good to set up the specific database resource.

			// ._specific.. would depend on the server type.


			var type = this.meta.get('type').value();
			var name = this.meta.get('name');
			var username = this.meta.get('username').value();
			var password = this.meta.get('password').value();
			var server_info = this.meta.get('server');

			console.log('type', type);

			// To make it connect up to the proper Database Resource...
			//  Doing this independantly from Server?
			
			// Maybe by making the Server resource it's going to automatically make the Database resource.
			//  Would be nice to have this in some sort of a pool so it can look for and find a resource rather than creating
			//   it again.
			var specific;
			// Using a Resource_Pool outside of a web server may be quite useful.
			if (type == 'mongo') {
				// set up the specific resource.

				specific = this._specific = new Mongo.Database({
					'name': name,
					'username': username,
					'password': password,
					'server': server_info
				});

			}

			// Start the specific database
			//  Then that will have the functionality needed.

			


			if (specific) {
				console.log('has specific db');
				specific.start(function(err, res_start) {
					if (err) {
						throw err;
					} else {
						//console.log('res_start', res_start);
						callback(null, res_start);
					}
				})
			} else {
				callback('no specific database');
			}



			//throw 'stop';


			// Will allow for more general syntax, eg calling a Mongo Collection a Table.
			/*
			var server = this.meta.get('server');
			console.log('tof(server) ' + tof(server));

			// if it's just an object, we want to create the Server Resource.

			if (tof(server) == 'object') {
				// load the module here?

				// Need to use the Server module...
				//  Though the Server module will sometimes use the Database module.
				//   But it may be less essential for it to create that.

				// Could simply have the Database depend on Server.
				//  Then Table will depend on Database

				// If we are going to return a Table Resource from any code in this module we will need to do
				//  async loading of that Resource.

				var resource_server = new Server(server);

				this.meta.set('server', resource_server);



				resource_server.start(function(err, res_start) {
					if (err) {
						throw err;
					} else {
						console.log('1) res_start', res_start);

						callback(null, res_start);
					}
				})





			}
			*/





			// May be waiting for loading of server module?


			//console.log('this.loadingServerModule', this.loadingServerModule);

		},

		// key, value, callback?

		// Set?
		//  Perhaps following the REST words would make sense for resources,
		//   making th design more restful at its core, rather than REST over get and set?

		//  I think get and set may make sense, but it could be difficult setting an item in a collection,
		//   where we have the item name, but there is not (necessarily) a defined index.

		// Set would generally work like PUT.
		// But also need post.
		//  Like push?

		// Will need to connect to the remote database, via a resource.
		'post': fp(function(a, sig) {
			if (a.l == 2 && tof(a[0]) == 'string') {
				// this adds the ID automatically

				var collectionName = a[0];
				var value = a[1];

				var collection = this._i.collection(collectionName);
					// Insert a single document
				collection.insert(value);
			}

		}),

		'put': fp(function(a, sig) {
			// When putting an object the key will be within the value.
			var collection_name, value, callback;
			if (sig == '[s,o,f]') {
				collection_name = a[0];
				value = a[1];
				callback = a[2];
				var db = this._i;

				//db.save()

				// need to create the reference to the collection.

				var collection = db.collection(collection_name);
				collection.save(value, function(err, res) {
					if (err) {
						callback(err);
					} else {
						callback(null, res);
					}
				})

			}

		}),

		// Want some way of applying a schema to the db...

		// This is also the way of putting?
		'set': fp(function(a, sig) {
			// so check for key, value

			// so that's string then anything pretty much.
			// we may be setting using a JSON object.

			if (a.l == 2 && tof(a[0]) == 'string') {
				var key = a[0];
				var value = a[1];

				console.log('key ' + key);
				console.log('value ' + stringify(value));

				// And ignore the object name?
				// need this to be really flexible.
				//  may need to do things like automatically create collections.

				var splitKey = key.split('.');
				if (splitKey.length == 2) {
					var collectionName = splitKey[0];
					var objectName = splitKey[1];

					//this._i.collectionNames(function(err, collectionNames) {
					//	if (err) {
					//		console.log('collectionNames err ' + err);
					//	} else {
					//		console.log('collectionNames ' + stringify(collectionNames));
					//	}
					//});

					var collection = this._i.collection(collectionName);
					// Insert a single document
					collection.insert(value);

				} else {
					throw 'Key must be given in the form collection.object';
				}

				//throw 'stop';
			}
		})
	});
	
	return Database;
	
});