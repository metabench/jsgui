


define(["../core/jsgui-lang-enh", '../web/resource'], function(jsgui, Resource) {
	
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Collection = jsgui.Collection;
	var is_defined = jsgui.is_defined, tof = jsgui.tof, stringify = jsgui.stringify, each = jsgui.each;
	var fp = jsgui.fp;
	// The basic resource connector... not quite sure what it needs to do 27/02/2012.
	//  Fills in the gap conceptually.
	
	var Rsce = Resource;

	// Nice if this was a resource-adapter?
	//  However, some types of DBs will only work as a Resource anyway.
	//   Let's not make this use the non-async database server functionality?
	//    Or it can make use of it but not depend on it as its core mechanism?

	
	
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

		},
		'start': function(callback) {

			// Would need some kind of connector to start it.
			//  And that would depend on the connection (or connector) metadata.

			// I think some kind of Connector object makes sense.
			//  dbi-postgres as a connector?
			//   maybe not, but keep it as it contains useful code.


			var flds = this.fields();
			console.log('flds ' + stringify(flds));

			callback(null, true);

		}

	
	});

	
	return Server;
	
});