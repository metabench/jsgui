
var Mongo = require('mongodb'), MongoClient = Mongo.MongoClient;

//var Mongo_Server  

define(["../../../core/jsgui-lang-util", "../../../web/resource"], function(jsgui, Resource) {
	
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Collection = jsgui.Collection;
	var is_defined = jsgui.is_defined, tof = jsgui.tof, stringify = jsgui.stringify, each = jsgui.each;
	var fp = jsgui.fp;
	// The basic resource connector... not quite sure what it needs to do 27/02/2012.
	//  Fills in the gap conceptually.
	
	var Rsce = Resource;

	// Maybe this won't need much in order to start it.
	//  Can refer to the items in it...

	// Maybe we need a resource to refer to a record.
	//  That would help with addressing records in this restful system.

	// Or records can act as a virtual resource.



	var Mongo_Collection = Rsce.extend({

		'init': function(spec) {
			this._super(spec);
			var meta = this.meta;
			if (spec.database) {
				meta.set('database', spec.database);
			}
			if (spec.name) {
				meta.set('name', spec.name);
			}
		},

		// when starting the resource...
		//  or maybe this won't need one because there are no async activities in order to start it.
		// RESTful actions upon this.

		// Put to create a new record, with its id, or to update an existing one.
		'put': fp(function(a, sig) {
			if (sig == '[o,f]') {
				var value = a[0];
				var callback = a[1];
				// put the value, the key is within the value.
				//  it should correspond to the key in the table.
				var meta = this.meta;
				var db = meta.get('database');
				// The meta database...
				//  we want to get the meta database's actual database...

				console.log('db', db);

				var collection_name = meta.get('name');
				// as well as the db, there is the collection object which is used to do the interfacing.

				var collection = this._collection;
				if (!collection) {
					collection = db._i.collection(collection_name);
					this._collection = collection;
				};
				collection.save(value, function(err, res) {
					if (err) {
						callback(err);
					} else {
						callback(null, res);
					}
				});
			}
		}),

		'get': fp(function(a, sig) {
			console.log('mongo collection resource get');

			console.log('sig ' + sig);

			var key, callback;

			if (sig == '[f]') {
				callback = a[0];
			}
			if (sig == '[s,f]') {
				key = a[0];
				callback = a[1];
			}

			console.log('collection get key', key);
			//if (a[0]) key = a[0];
			// Async get function.

			var meta = this.meta;
			var db = meta.get('database');
			var collection_name = meta.get('name');
			// as well as the db, there is the collection object which is used to do the interfacing.

			var collection = this._collection;
			if (!collection) {
				// need to access the interface object.
				//  not all that neat.
				collection = db._i.collection(collection_name);
				this._collection = collection;
			}
			// not so simple with the key...
			//  ???
			// What about getting the whole collection?

			// That may just be one parameter given to this function.
			// collection.get() returns whole collection.
			// collection get all?

			console.log('key', key);

			if (key) {


				collection.findOne({_id: key}, function(err, res) {
					if (err) {
						callback(err);
					} else {
						console.log('found!');


						callback(null, res);
					}
				});
			} else {

				/*
				toArray(function(err, docs) {
        assert.equal(null, err);
        assert.equal(3, docs.length);

        db.close();
      });
*/
	

				// Somewhat hard to know if we want to get the results, or to get an object.
				//  Inside, there could be resources we want to reference?
				//  Or can we do this using a virtual resource?

				// Maybe we want to get an object that can be queried to get all?
				//  Maybe the database should have not split the query, so that it has some code in db get
				//  that would first get the mongo collection resource, and then get the result from it.


				// just getting the collection?
				//  maybe we want this.

				collection.find().toArray(function(err, res) {
					if (err) {
						callback(err);
					} else {
						console.log('found!');
						console.log('err', err);
						console.log('res', res);

						callback(null, res);
					}
				});
			}
		})
	});

	// We could also have a Mongo_Collection resource. They may follow a similar interface to tables in other DBs.
	//  They would be creatable from a Database resource.
	//  The Info resource would interact with one of these
	
	return Mongo_Collection;
	
});

