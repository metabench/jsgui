
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

var Mongo = require('mongodb'), MongoClient = Mongo.MongoClient;

//var Mongo_Server  

define(["module", "path",
	"../../../core/jsgui-lang-util", "../../../resource/core/resource", "../../../resource/core/collection", "./collection"], 

	// Or server should have the referece to database? Server is the larger one.
	//  May need to side-load the server at some point.

	function(module, path, jsgui, Resource, Resource_Collection, Mongo_Collection) {
	
	// Will also use a reference to Server?
	//  May help initializing a Database Resource, where it also provides the server info, and the Database
	//   Resource automatically creates the Server Resource.




	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Collection = jsgui.Collection;
	var is_defined = jsgui.is_defined, tof = jsgui.tof, stringify = jsgui.stringify, each = jsgui.each;
	var fp = jsgui.fp;
	// The basic resource connector... not quite sure what it needs to do 27/02/2012.
	//  Fills in the gap conceptually.
	
	var Rsce = Resource;

	// With these resources, need to expose them in a standard way.
	
	
	var Mongo_Collection;

	// So both extend Resource.
	//  They may contain resources and / or data.


	// For the moment may not be able to read the databases from a Mongo server.
	//  May need a way to log into the server itself to access it .
	//   There will be ways to do this, but maybe it's not worth doing just yet.

	// May need to define a server as containing a database, then connect to that database.
	//  That seems to be the logical order because we need to reference both the server and the db
	//   Knowing the server address does not mean we can list the DBs

	// So the DB would have a 'server' property?
	//  Maybe it would also be the parent?
	//   Or the collection of dbs on the server would be the parent?

	// A server property on the DB would make sense here.

	// When adding a resource to another, may need to be careful that it has started.






	// Perhaps further testing of fields will help, fields that are declares like below?

	// DB gets given a reference to the server.

	// Providing RESTful access to the database.

	
	var Mongo_Database = Rsce.extend({

		// Could have something like fields?
		//  The word 'fields' is already used for something a bit different, but perhaps it can be used here.
		//  published_fields?





		'init': function(spec) {
			var that = this;

			this._super(spec);
			
			//console.log('3) spec.server._ ' + stringify(spec.server._));
			//console.log('this._ ' + stringify(this._));

			this.meta.set('type_levels', ['database', 'odb', 'mongo']);

			//var server = this.get('server');
			//console.
			// Should not be needed, with the server being a field.
			//if (is_defined(spec.server)) {
				// the server is the 'location' too, if that matters.
			//	this.set('server', spec.server);
			//}
			
			// location is a Mongo_Server.
			//  Addressable through another component
			
			// The database also requires a mongo server.
			//  This could be set up for it, or provided when looking for the local server.
			//  There will be directories of locations. These could be stored in an Sqlite database on the local machine.
			
			// It could be given it's location in the initialization.
			//  When starting it up, it will be checking that it has a location.
			//   The location would be a resource in this case.
			
			// The Server Resource is a requirement in this case.
			
			//  maybe call it can_try_start - something else could prevent it from starting properly.
			
			
			// Then we want to tell the database to do various things.
			
			// Want to be able to persist a database structure (where necessary)
			//  Mongo DBs may be schemaless in terms of the internal structure.
			
			// Will persist this though - want to be able to set up a mongo web db and use it relatively quickly and easily.
			//  Also want this to work through a resource transformation system - so when the system has connected to a db through an
			//   interface, it is able to use this as a web db.
			
			// I think we need to persist things using the Database.
			//  Want to have the database object connected to Mongo - or just have an interface to it.
			
			// Will still deal with sets of information.
			
			// Maybe should make a simpler resource to start with.
			//  Ans a simpler resource adapter.

			/*
			'fields': {

			// OK, so is it handling that typed field OK?
			//  Not sure I have done all of the tests for that.

			// I think the problem is with setting fields of a class type.
			//  The mongo server field does not get set properly.


			'server': Mongo_Server,
			'name': String
		} */

			// <dbuser>:<dbpassword>@

			if (spec.server) {
				this.meta.set('server', spec.server);
			}
			if (spec.name) {
				this.meta.set('name', spec.name);
			}

			// Set on the database resource?
			//  Or on the server?

			if (spec.username) {
				this.meta.set('username', spec.username);
			}
			if (spec.password) {
				this.meta.set('password', spec.password);
			}
			
			// meta currently a Data_Object rather than Resource... that may make sense.
			//  Is it worth extending Data_Object to have async access?
			//  Or are we doing this here by layering an async access method on top of it.

			// We may be able to adapt Data_Objects to work like resources in many cases.

			
			this.meta.set('status', 'off');

			// Metadata about the collections it contains,
			//  though in one sense these collections are the actual content.

			// Maybe have 'collections' as a field, of type Resource_Collection.
			//  Could make a Resource wrapper for Collections.
			//   Will make the access asyncronous.
			//    Will then hold the collections collection as that resource.
			//     queries to it will be directed to it.

			// I think collections as a field of the database does make more sense.
			//  It will be a resource-collection.


			//this.meta.set('collections', new Collection({'fields': {'name': 'unique string'}}));

			// Has not set up the fields correctly. Not sure why.
			//  Because fields have not been set up like that - it's not through the prototype chain.
			//  Seems intuitive to be able to set them up like this though.

			// I think we do need collections as some kind of meta-object?
			//  it's got confusing about getting or setting them.

			// Getting the collections - would assume we want to get, in programming form, the collection resources
			//  associated with this object. However, this get function could wind up getting some data representing
			//  those objects. At some points may want some relatively simple info as JSON, at other points may want the
			//  resource.

			// Get with an object endpoint?
			//  Need some syntax that would deal with both kinds of get requests.


			// Perhaps a get_resource function is what is needed.
			//  so, until the final level of a query, we keep getting resources, and then at the final level
			//  we get the output.

			// I think that nested get requests are a fairly major thing to tackle.
			//  Sometimes we need to get a resource that can then get or set further information.
			//   Is it more efficient to cache some resources too, and access them quickly?
			//  

			// Asyncronous access to nested resources.
			//  I think I should make a doc explaining it.





			// var resource_mongo_collection = this.get_resource('collections.site_info')
			// 

			// 

			var colls = this.set('collections', new Resource_Collection({
				'fields': {
					'name': 'unique string'
				}
			}));
			colls.index_by('name');

			console.log('colls.fields() ' + colls.fields());
			

			// indexes
			console.log('colls.indexes() ', colls.indexes());
			//throw 'stop';


			// There may need to be a different http get function?

			// In some cases, maybe we don't call get on particular subresources.
			//  Though if left to it, could get called.




			colls.get = fp(function(a, sig) {
				console.log('colls get sig ' + sig);
				if (sig == '[]') {
					// it's the collection names...
					that.get_user_level_collection_names(function(err, collection_names) {
						if (err) {
							throw err;
						} else {
							callback(null, collection_names);
						}
					})
				} else {

					// Do a find here?
					//  Just one string parameter...

					//  it's not set up to use the name string as the pk, maybe that could be done in the fields
					//   definitions.

					// But with the callback too, need to change the response accordingly.

					//if (sig == '[s]') 

					// with string and callback, need to do a find based on that string.
					if (sig == '[s,f]') {

						// Do a query to get a specific collection.
						//  Would need to run the query to the database.


						// The key could be further nested...
						//  We may want to get the collection resource ???
						//  Using colls to find something here?
						//var get_key = a[]

						var res = colls.find(a[0]);

						console.log('res', stringify(res));
						throw 'stop';

						var callback = a[1];


						callback(null, res);
					} else {
						if (sig == '[s]') {

							// but if it has full stops...
							//  we need to get an item inside a collection.
							//   then firther in we could just get a property from an item.

							//var stack = new Error().stack;
							//console.log(stack);
							//throw 'stop';
							//return colls.find({'name': a[0]});

							// Not just the find... I think it needs to do a query based on the name.
							//  Yes, needs to do the database query to get the database's collections.
							//   They will be (mongo resource) Collection objects.

							//var res = function(callback) {
							//	callback
							//}

							//var res = colls.find('name', a[0]);

							//var fres = function(callback) {

							//}

							// Can do the query based on name here...
							//  need to query the mongo database to get that collection.
							//  maybe only get fairly simple info about it?
							//  or get all of its fields...

							var field_name = a[0];
							var split_field_name = field_name.split('.');
							console.log('db split_field_name', split_field_name);
							if (split_field_name.length > 1) {
								var collection_name = a[0];
								var item_id = a[1];

								var coll = new Mongo_Collection({
									'name': collection_name,
									'database': that
								});

								return function(callback) {
									coll.get(item_id, callback);
								}


							} else {
								var coll = new Mongo_Collection({
									'name': a[0],
									'database': that
								});

								// and return a promise...
								//  or a function to call which will get the result.

								return function(callback) {
									coll.get(callback);
								}
							}

							// anyway, we would create the Collection object...

							





							//return colls.find('name', a[0]);
						} else {
							//that._super.apply(this, {'name': a[0]});
							throw 'stop';
						}

						
					}


					
				}
				// Also get with a string, carries out a find by name.
				//  However, with name set as the primary key, the index system may/should be able to 


			})

			// There needs to be a new basic get for the collections...

			//console.log('this._.collections', this._.collections);
			//throw 'stop';

			// a listener for changes in the meta...
			//  that way we can carry out database operations.

			// perhaps a beforeChange event would make sense here.
			

			// This could also listen for changes in the meta.
			//  It could carry out actions to reflect those changes on the remote resource that the Resource class
			//  provides an interface to.

			// .meta.set('collections.users.indexes.username', 'unique');
			//  I think that is fairly sensible syntax, inline with accessing deeper objects.

			this.meta.add_event_listener('change', fp(function(a, sig) {
				console.log('meta change sig ' + sig);
				console.log('a ' + stringify(a));
			}));

			var old_meta_get = this.meta.get, meta = this.meta;

			// So many get requests while running the server?
			this.meta.get = fp(function(a, sig) {
				//console.log('mongo database resource new meta get sig ' + sig);

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

						//return that._specific.meta.get('tables', a[1]);
						return that.get_tables(a[1]);

						// call the function that gets the tables from the mongo database.
					}

					if (field_name == 'collections') {
						// use the specific server to get the tables.
						//  mongo resource will use that as a synonym for collections.

						//return that._specific.meta.get('tables', a[1]);

						// But we could have a faster way of getting a particular collection Resource if its cached.
						//  Or all of the cached collection Resources.



						return that.get_tables(a[1]);

						// call the function that gets the tables from the mongo database.
					}

					//return old_meta_get.apply(meta, a);
				}


			});
		},
		/*
		'side_load_collections_module': function(callback) {
			var that = this;
			if (Mongo_Collection) {
				callback(null, Mongo_Collection);
			} else {

				var dirName = path.dirname(module.uri);
				console.log('dirName ' + dirName);

				var collectionModulePath = dirName + '/collection.js';

				that.loadingCollectionModule = true;
				console.log('collectionModulePath', collectionModulePath);
				// Will need to have a way for the start of the db resource to be delayed until the module for the
				//  server has loaded.
				Mongo_Collection = require(collectionModulePath);
				console.log('loaded req');

				callback(Mongo_Collection);


				// Could maybe set the server property to be a promise of the server.
				//  Maybe integrate promises into Data_Objects to help bridge the gap between sync/async.
				/*
				require([collectionModulePath], function(Module_Collection) {
					console.log('requirement loaded.');

		            // Delayed loading
		            //Company = C;
		            Mongo_Collection = Module_Collection;
		            that.loadingCollectionModule = null;

		            //var server = new Server(spec.server);
					//that.meta.set('server', server);

					callback(null, Module_Collection);
		        });
				*/

				/*
			}
		}, */

		// Get the user level collection names function... better to encapsulate that.

		'get_user_level_collection_names': function(callback) {
			var that = this;
			//this.side_load_collections_module(function() {
			console.log('sideloaded');
			

			var db = that._i;
			console.log('db ' + db);

			db.collectionNames(function(err, resCollectionNames) {
				if (err) {
					console.log('collectionNames err ' + err);
				} else {
					//console.log('resCollectionNames ' + stringify(resCollectionNames));

					// want the user_level_collection_names
					//  But maybe they all should go in meta.collections.
					var user_level_collection_names = [];
					each(resCollectionNames, function(i, objCollectionName) {
						var name = objCollectionName.name;

						//if (name.indexOf())

						// search for x.system
						// x.objectlabs-system
						var pos1 = name.indexOf('.');
						var nameAfterFullStop = name.substr(pos1 + 1);
						console.log('nameAfterFullStop ' + nameAfterFullStop);

						if (nameAfterFullStop.indexOf('system.') == 0) {

						} else {
							if (nameAfterFullStop.indexOf('objectlabs-system') == 0) {

							} else {
								user_level_collection_names.push(nameAfterFullStop);
							}
						}

					});

					callback(null, user_level_collection_names);
				}
			});

			//});
		},

		'get_collections': function(callback) {
			console.log('get_collections');

			// A map of collections could be useful when referring to a particular collection.

			// Perhaps the collections will be some kind of resource, attached as a group / collection resource.

			// Anyway, need to be able to access items in collections, and collections themselves, through
			//  a restful path that is handled by resources.




			// Will return the collections as a Resource???
			//  Or array of Resource objects?

			// Maybe we need a Resource_Collection (as in a jsgui Collection of Resource objects)?

			// However, creating and then referring to these various resources takes more computer resources.
			//  Will make it easier to show them in a nice GUI though.

			// _specific is used for a specific type of resource when having dealt with general ones.

			// Need to ensure the Mongo Collections is loaded.
			//  The Collection objects will probably have a reference to the Database.

			//  Then we will be able to use the Collection objects to directly reference the Collection.
			var that = this;
			that.get_user_level_collection_names(function(err, user_level_collection_names) {
				if (err) {
					throw err;
				} else {
					// Rather than just an array, could return a resource.
					//  That collections resource would be queryable
					//   mainly just to get all of the collections.




					var res = [];

					// But these should be cached in meta.
					//  Could try sync get to see if it is there before trying async get.

					each(user_level_collection_names, function(i, collection_name) {
						var mc = new Mongo_Collection({
							'name': collection_name,
							'database': that
						});
						res.push(mc);
					})

					callback(null, res);
				}
			})
		},

		'get_tables': function(callback) {
			return this.get_collections(callback);
		},

		'start': function(callback) {
			// ensure the server resource exists and has started/
			//  This could rely on the starting resource chains / pooling.
			//   However, this programmed behaviour here may be OK, but could be avoided with more abstract
			//    'Requirements' code.

			console.log('starting mongo database resource');

			// not getting the server properly from itself...
			//  is it creating a new one?

			var server = this.meta.get('server');
			console.log('server', server);
			console.log('tof server', tof(server));

			// if it's just an object, then we create that actual Mongo server.

			/*
			if (tof(server) == 'object') {
				server = new Server(server);
				this.meta.set('server', server);

				// Also start the Server?
			}
			*/


			// At this stage, meta.server may only be information about the server.
			//  We'll need to instantiate it in that case.
			//   Side-loading? Can't have circular references with requireJS.
			var that = this;

			var status = this.meta.get('status');
			console.log('status ' + status);
			console.log('tof(status) ' + tof(status));

			var name = this.meta.get('name');

			// Meta will also contain structural information about the DB.
			//  It will be possible to change the DB structure (ie indexes etc) through changing the meta.



			if (status == 'off') {
				this.meta.set('status', 'starting');

				// Need to see if the connected server has started as well, if it has not we'll need to start it.

				var db_status = server.meta.get('status');
				//console.log('server_status ' + server_status);

				//console.log('*** server port ' + server.meta.get('port'));

				var ctu = function() {
					// proceed to connect to the mongo database.

					//console.log('proceeding');

					var mongoserver = server._server;
					// db_connector = new mongodb.Db(name, mongoserver, db_options);
					//console.log('name.toString() ' + name.toString());
					//console.log('tof(name) ' + tof(name));


					var db_connector = new Mongo.Db(name.toString(), mongoserver, {});

					// Don't want to do as much on start of this resource.



					db_connector.open(function(err, db) {

						// may have a shorthand / word for the object that is provided from elsewhere and 
						//  is used by the Resource in order to provide its functionality.
						// Would be the internal object in use by the resource.

						// ._i implementation object.
						// ._i makes a convenient shortcut.

						that._i = db;
						console.log('that._i', that._i);


						// authenticate(username, password[, options], callback)

						//  Loading the collection names when the db starts and storing them locally may make sense.
						//   However, we now have a resource collection.
						//    Need to work out some details about how a resource or resource collection can
						//    cache its data locally. 
						//   We could refer to a particular db if needed and get it or operate on it async.
						//  It may be best to make a separate resource caching layer.
						//  
						//   



						var username = that.meta.get('username');
						var password = that.meta.get('password');

						if (false && username && password) {
							db.authenticate(username.toString(), password.toString(), function(err, authRes) {

								// Not so sure we need to do that here?
								db.collectionNames(function(err, resCollectionNames) {
									if (err) {
										console.log('collectionNames err ' + err);
									} else {
										//console.log('resCollectionNames ' + stringify(resCollectionNames));

										// want the user_level_collection_names
										//  But maybe they all should go in meta.collections.
										var user_level_collection_names = [];
										each(resCollectionNames, function(i, objCollectionName) {
											var name = objCollectionName.name;

											//if (name.indexOf())

											// search for x.system
											// x.objectlabs-system
											var pos1 = name.indexOf('.');
											var nameAfterFullStop = name.substr(pos1 + 1);
											console.log('nameAfterFullStop ' + nameAfterFullStop);

											if (nameAfterFullStop.indexOf('system.') == 0) {

											} else {
												if (nameAfterFullStop.indexOf('objectlabs-system') == 0) {

												} else {
													user_level_collection_names.push(nameAfterFullStop);
												}
											}

										});
										console.log('user_level_collection_names ' + stringify(user_level_collection_names));

										// then use these to set the meta collections.
										//  ensure that there is the meta collection object for each of them.

										var m = that.meta;
										//var mColls = m.get('collections');

										var colls = that.get('collections');
										// But by making the collections a subresource, they don't get cached.
										//  Can't really push into them when they are a collection resource.
										// Maybe we want a non-resource representation, or for the resource to do
										//  some form of caching.
										// We would need to differentiate between doing operations on the local data
										//  structure and the remote one.




										console.log('colls ' + stringify(colls));
										console.log('that._.collections', that._.collections);

										//var mcusers = mColls.find({'name': 'users'});
										//console.log('mcusers ' + stringify(mcusers));

										each(user_level_collection_names, function(i, cName) {
											var mc = colls.find({'name': cName});
											console.log('mc ' + stringify(mc));

											if (!mc) {
												//mColls.push(new Data_Object({'value': {'name': cName}}));

												// I think an easy way of setting the value of the Data_Object at 
												// construction makes sense.
												console.log('cName ' + cName);
												console.log('tof cName ' + tof(cName));
												//throw '7) stop';

												var ndo = new Data_Object();
												ndo.set('name', cName);
												console.log('ndo ' + ndo);
												console.log('ndo ' + stringify(ndo));
												colls.push(ndo);
												//throw 'stop';
											}
										});

										//console.log('colls ' + stringify(colls));

										// need to check if that collection contains another...
										//  Maybe Collections would be better as a Data_Object.
										//   That's designed for referencing by name

										//this._db = db;

										callback(null, db);
									}
								});
							});
						} else {
							callback(null, db);
						}
					});
				}

				if (db_status == 'off') {
					server.start(function(err, res) {
						if (err) {
							throw err;
						} else {
							ctu();
						}
					});
				} else if (server_status == 'on') {
					ctu();
				}
			}
			//if (!status) {
			//	this.meta.set('status')
			//}
			// server.meta.status?
			//  need to ensure the server has started.
			//   could look at its state to see if it has.

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

		/*
		'set': fp(function(a, sig) {
			// so check for key, value

			// so that's string then anything pretty much.
			// we may be setting using a JSON object.

			console.log('mongo db resource set sig', sig);

			if (a.l == 2 && tof(a[0]) == 'string') {
				var key = a[0];
				var value = a[1];

				console.log('key ' + key);
				console.log('value ' + stringify(value));

				// And ignore the object name?
				// need this to be really flexible.
				//  may need to do things like automatically create collections.

				var splitKey = key.split('.');

				// Maybe don't need to override this?

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

		}),
		*/
		// Basic get - 
		///  get with a string, needs to return one of the fields of this.
		// Maybe have a particularly defined basic get for only a callback parameter.

		// The nested async get system is running into problems.


		'get': fp(function(a, sig) {
			console.log('db resource get sig ' + sig);


			if (sig == '[f]') {
				// If the collections were actually a field within the resource, it would get exposed as such.



				var callback = a[0];

				console.log('basic async get');

				var meta = this.meta;
				var name = meta.get('name');

				// Not just the collection names.
				//  Also want to return some info about what type of resource this is.
				//  That will make client-side code able to consume the resource.
				//   Don't need a big specification about what the resource can do.
				//   Just need some type names that are used to determine what interfaces the resource has.
				var type_levels = this.meta.get('type_levels');



				this.get_user_level_collection_names(function(err, collection_names) {
					if (err) {
						throw err;
					} else {

						// Accurate info for navigating returned.

						var res = {
							'meta': {
								'name': name,
								'type_levels': type_levels
							},
							'collections': collection_names,
						}

						// and the collections' names...


						callback(null, res);
					}
				})

				

				//return res;

			} else 
			if (sig == '[s]') {

				var key = a[0];
				console.log('key', key);

			} else {




				// We may have other functionality for RESTful / asyncronous getting of information from the database.
				//  Likely to be getting something referencing a collection.

				// Async get methods...

				// collections.something
				//  is there already a collections collection specified?
				//  does it have async access?

				// we can look at what we are getting, at least.
				//  there is the meta collections...
				//  perhaps they will have got populated at some point.


				// so, perhaps we can refer to meta collections here...

				//  I think some particular processing for the items that may be referred to with a restful interface.
				//   There may not be so many at a particular level.

				// [db_name]/collections/[collection_name]/[id]

				// Will be able to interact with quite a lot of data through a restful interface.
				//  Want to enable easy getting and setting of data.

				// No neec for this, will use the collection of collections's own get.

				console.log('db resource get a[0] ' + a[0]);

				// collections.cname.id
				//  we don't want to carry out get() on the collection.
				//  however, we could do get(id) on the collection we want.

				// Do want to have some processing here.
				//  Make sure it carries out the right operations.
				//   The database's resource's get may need to do a bit of routing and processing, as its directing
				//   queries to part of the database.

				// The basic get is not working here, it carries out get() on the collections resource,
				//  but should carry out a deeper level get operation.






				//console.log('sig ' + sig);

				if (false && sig == '[s,f]') {
					var requestPath = a[0];

					var callback = a[1];

					console.log('requestPath ' + requestPath);

					// we break the request path down into the stages.

					// then we find the object referred to there.
					//  if it's collections, we refer to meta.collections.

					// There may not be that many different things this can hook up to.
					//  Maybe want to abstract code away for this.

					var srp = requestPath.split('.');

					// Then when getting querying a collection, we refer that to the collection.

					// Could have collections as a field within the database.
					//  That way they could be exposed as a resource themselves.

					// Also, collections within the resource here would be a collection itself, maybe a 
					//  Resource_Collection.
					// That Resource_Collection would have its own URL
					//  In this case, it would put the request through to the subresource.

					if (srp[0] == 'collections') {

						if (srp.length == 1) {
							// just return info on the collections.
							// should be simple...

							this.get_user_level_collection_names(function(err, collection_names) {
								if (err) {
									throw err;
								} else {
									callback(null, collection_names);
								}
							})

						}
						if (srp.length == 2) {

							// Change this...

							// collections.collection

							// Getting a particular collection.
							//  We would need to reference the collections.
							//  do a get on this.collections

							//this.




							// collections.collection.record_id

							// respond to srp lengths 2 and 3.



							// join it back together...

							var rsrp = srp.slice(1);
							console.log('rsrp ' + stringify(rsrp));

							if (rsrp.length == 1) {
								// then we are talking about getting a particular collection.

								this.meta.get('collections', function(err, collections) {
									if (err) {
										throw err;
									} else {
										// no, use get_collections

										console.log('collections ' + tof(collections));

										// it's an array.



										// So it's a collection of (mongo) collections...
										//  That may mean that it's possibly to query it for a collection by name.
										//  We have the name...

										/*

										var coll = collections.find({
											'name': rsrp[0]
										});
										*/

										// An object query may be better.
										//  Also may be worthwhile to have the mongo database resource index its collections
										//  by name.
										// Not sure they will have been initialised properly...
										var collection_name = rsrp[0];
										var fcoll;

										each(collections, function(i, collection) {
											console.log('collection', collection);
											if (collection.meta._.name == collection_name) fcoll = collection;
										})

										// Needs to call back with something understandable...
										//

										/*  
										fcoll.meta._.database.find(function(err, res) {
											if (err) {
												throw err;
											} else {
												console.log('find res', res);
												callback(null, res);
											}
										})
										*/
										fcoll.get(callback);

										

										/*

										var coll = collections.find('name', rsrp[0]);

										// then we use that collection's get function...
										//  That collection should be a Mongo Resource Collection.



										console.log('coll ' + tof(coll));

										// Just collection get, no key, just callback - that will mean get every item
										//  in the whole collection.
										// Possibly metadata? Could do that automatically if the collection is too large.
										//  But getting the whole collection easily makes sense if it's not too big a collection.

										coll.get(callback);
										*/
									}
								});

									


								//coll.get();


							}

							//callback(null, rsrp);

						}
					}


				} else {
					return this._super.apply(this, a);
				}
				
			}
		})

		// get and set functions.
		//  Needs to work within the fairly basic architecture of the db.

		// The get and set commands should be useful here...
		//  They need to perform in a fairly general way but this resource gives access to a particular mongo 
		//  database.

	});
	
	return Mongo_Database;
	
});


