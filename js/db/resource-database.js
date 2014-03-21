// This could wind up having a lot of functionality in order to provide the application programmer with ease of use
// flexibility, and high performance.




define(["../core/jsgui-lang-enh", "../web/resource", "./resource-mongo", "./resource-postgres"], function(jsgui, Resource, Mongo, Postgres) {
	
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
	
	var Database = Rsce.extend({

		'init': function(spec) {
			this._super(spec);
			
			console.log('3) spec.server._ ' + stringify(spec.server._));
			console.log('this._ ' + stringify(this._));

			// Server info
			//  (inc what type of DBMS)
			// Auth info

			if (spec.server) {
				this.meta.set('server', spec.server);
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
			
			this.meta.set('status', 'off');
			this.meta.set('collections', new Collection({'fields': {'name': 'unique string'}}));

			this.meta.add_event_listener('change', fp(function(a, sig) {
				console.log('meta change sig ' + sig);
				console.log('a ' + stringify(a));
			}));

			// active-db-resource
			//  The resource that this Database resource uses in order to actually connect to a database.
			
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