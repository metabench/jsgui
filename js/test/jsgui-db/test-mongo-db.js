//require('nodetime').profile()

var requirejs = require('requirejs');


requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
	//paths: {
    //    "some": "some/v1.0"
    //},
    nodeRequire: require
});

requirejs(['../../core/jsgui-lang-util', '../../db/resource-mongo'],
function (jsgui, Resource_Mongo) {
	
	var j = jsgui;
	var Class = j.Class;
	var each = j.each;
	var is_array = j.is_array;
	var is_dom_node = j.is_dom_node;
	var is_ctrl = j.is_ctrl;
	var extend = j.extend;
	var x_clones = j.x_clones;
	var get_truth_map_from_arr = j.get_truth_map_from_arr;
	var get_map_from_arr = j.get_map_from_arr;
	var arr_like_to_arr = j.arr_like_to_arr;
	var tof = j.tof;
	var is_defined = j.is_defined;
	var stringify = j.stringify;
	var functional_polymorphism = j.functional_polymorphism;
	var fp = j.fp;
	var arrayify = j.arrayify;
	var mapify = j.mapify;
	var are_equal = j.are_equal;
	var get_item_sig = j.get_item_sig;
	var set_vals = j.set_vals;
	var truth = j.truth;
	var trim_sig_brackets = j.trim_sig_brackets;
	var ll_set = j.ll_set;
	var ll_get = j.ll_get;
	var is_constructor_fn = j.is_constructor_fn;
	var is_arr_of_arrs = j.is_arr_of_arrs;
	var is_arr_of_strs = j.is_arr_of_strs;
	var is_arr_of_t = j.is_arr_of_t;
	
	
	// that jsgui object will have what is needed to serve HTML.
	
	// May integrate this with Connect or routes... or may call on jsgui functionality from a connect or express route.
	
	// May still be simple to talk about serving files to paths... but will want to serve other objects / have them exposed on a path.
	
	// Want an html document control that is an empty document.
	
	// creation of empty html document...
	
	// let's start up the server.
	
	// Need to start the appropriate Mongo resource(s),

	// There may be resources to do with connecting to different databases.
	//  Also the possibility of exposing a resource from inside another resource, so a mongo server
	//   could contain mongo resources.

	var test_mongo_resource = function() {
		// Need both the database and the server.

		// but should give it ip address
		//  not so sure it needs a context.
		//  Should be able to function ok without one hopefully.

		// Maybe there should be a server URL.
		//  Thouse URLs could be IPv6?



		var server = new Resource_Mongo.Server({
			'host': 'ds029798.mongolab.com',
			'port': 29798
		});

		// OK, so the host and port should be set but it does not look like that's working.

		var host = server.get('host');
		console.log('host ' + host);
		var port = server.get('port');
		console.log('port ' + port);
		var port = server.get('port');
		console.log('port ' + port);

		console.log('1) server._ ' + stringify(server._));
		//throw 'stop';


		var db = new Resource_Mongo.Database({
			'server': server,
			'name': 'metabench',
			'username': 'mb',
			'password': 'mb1234'
		})

		console.log('2) server._ ' + stringify(server._));
		//throw 'stop';
		// not sure we need to start the resources
		//  should just be able to connect to the DB.

		// db.connect is like starting.
		//  could start those resources, an then when they are ready we have connected.

		//db.meta.constraints?
		// db.post



		db.start(function(err, res) {
			console.log('db started / connected');
			//throw 'stop';

			// It looks like set should not just make more and more new items.
			//  Define a primary key?

			// Setting the objects by a particular field, as their primary key?

			//  May have more ways of doing a set, but I think set may be a useful keyword.
			//   May be best not to go setting Mongo primary keys, and keep the randomly generated strings?

			// Want to be able to make use of different ways of doing this, either using a username as a primary
			//  key or not.
			// By not doing so, they can change their username more easily?
			//  

			// set working like put?

			// Also a post verb?

			// Post means the system creates the ID itself.


			// Can't use the DB to enforce unique constraints?




			// When setting, we may want to check particular fields to see if the object is already there,
			//  in which case we update it.



			//db.set('users.james', {'username': 'james', 'password': 'jv'});

			// Would be good to get info about the database structure.

			// It would be simple to keep a JS object in the DB that represents the whole site.
			//  Also, an object in a DB could be something that would have a lot that can be done to it regarding editors.

			// Want something to edit an object in a DB.
			//  That can be the basis for a lot of functionality.

			// However, just exposing an object should be enough.
			//  Will just stringify this js object.

			// However, the mongo-db object could hopefully deal with Data_Object and Collection objects.
			//  Perhaps a to JSON or to JSObjects would be better.
			//   Would maybe lose some info about the indexing in collections.


			// Basically, want to be able to give the mongo db either JS objects or data objects and collections, and get the same
			//  back.
			// Dealing with combinations of both?

			// Also need to deal with typed collections.
			//  I think storing JSON is how it will be done, but there may be more levels of interpretation of that JSON.

			// Perhaps something that recreates the objects from the stringified form...
			//  We already have the notation that says they are data objects and collections, we could use that in the DB.

			// However, storing the simplest JSON objects would also be good.
			//  Getting the JSON data from more complicated objects, and then reconstructing them with JSON would be good.

			// Some kind of jsgui-json-io
			//  Data_Object.fromJSON

			//  data_object.toObject
			//  collection.toArray

			//   will create a simple JS object with that object's contents.

			//  data_object.toJSON
			// The same with collections.
			//  Then nested ones could be more easily made and persisted.
			//  It would be a general interface to the DB modules.
			//   All DBs can store strings.
			//   In cases like Mongo, which can store objects, we can use that.

























			db.post('users', {'username': 'james', 'password': 'jv'});



			// Not sure about this...
			//  We need a way of interacting with the DB, 

			//db.meta.get('collections').get('users').set('indexes.username': 'unique');

			//db.meta.set('collections.users.indexes.username', 'unique');
			//db.meta.set('indexes', 'users username unique');

			// db.meta.get('indexes')

			// but then that metadata actually interacting with the online connected resource?
			//  I think it makes sense to have it do so, so that we can make changes in node.js and it changes the 
			//   resource itself that it is connected to.

			// There may also be a local meta and remote meta?
			//  Is it risky to blur the lines here?
			//  Or is changing the remote meta a very useful thing here?




		});

		// db.get('users', {'username': 'james'});



		



		//db.connect(function(err, res) {

		//})


	};
	test_mongo_resource();



	
	
	
	
	
	
	
	
	
	
});