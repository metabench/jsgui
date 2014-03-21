

// Use all Mongo, Postgres resources?
//  Quite a lot of files are winding up getting loaded.
//   Hope it does not make too much of a start delay. Now the delay when starting has got noticable.





define(["../../core/jsgui-lang-enh", "../../web/resource", "../mongo/resource/all", "../postgres/resource/all"], 
	function(jsgui, Resource, Mongo, Postgres) {
	
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Collection = jsgui.Collection;
	var is_defined = jsgui.is_defined, tof = jsgui.tof, stringify = jsgui.stringify, each = jsgui.each;
	var fp = jsgui.fp;
	// The basic resource connector... not quite sure what it needs to do 27/02/2012.
	//  Fills in the gap conceptually.
	
	var Rsce = Resource;

	// With these resources, need to expose them in a standard way.
	
	
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

	// Could use some kind of Server Class or Resource?

	// Database server will be a particular kind of resource.



	
	var Server = Rsce.extend({
		//'fields': {
		//	'databases': Collection(Mongo_Database),
		//	//'host': String,
		//	//'port': Number
		//	'host': 'string',
		//	'port': 'number'
		//},

		// a collection of databases
		//  but those databases will be resources.



		'init': function(spec) {
			this._super(spec);

			var meta = this.meta;
			meta.set('status', 'off');

			if (spec.host) {
				meta.set('host', spec.host);
			}
			if (spec.port) {
				meta.set('port', spec.port);
			}
			if (spec.type) {
				meta.set('type', spec.type);
			}

		},
		'start': function(callback) {

			// Would need some kind of connector to start it.
			//  And that would depend on the connection (or connector) metadata.

			// I think some kind of Connector object makes sense.
			//  dbi-postgres as a connector?
			//   maybe not, but keep it as it contains useful code.


			console.log('starting server resource');



			var flds = this.fields();
			console.log('flds ' + stringify(flds));

			//throw '2) stop';
			var host = this.meta.get('host').value();
			var port = this.meta.get('port').value();
			var type = this.meta.get('type').value();

			console.log('this._ ' + stringify(this._));

			console.log('tof port ' + tof(port));
			console.log('host ' + stringify(host));
			console.log('host ' + (host));
			console.log('port ' + stringify(port));

			// Not necessarily Mongo.

			//  This is a flexible resource that gets told the type of server.
			//   It will have a specific_server property.
			//    What type of server it is will depend on the server type that was specified.
			//  The server, and specific_server, will both be resources.
			console.log('type', type);
			var specific;
			if (type == 'mongo') {
				specific = this._specific = new Mongo.Server({
					'host': host,
					'port': port
				});

			}

			specific.start(function(err, res_start) {
				if (err) {
					throw err;
				} else {
					console.log('res_start', res_start);
					callback(null, res_start);
				}
			})

			

		}

	
	});
	
	return Server;
	
});