/*

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../web/jsgui-html', 'os', 'http', 'url', './core/resource',
	'../web/jsgui-je-suis-xml', 'cookies'],

	function(jsgui, os, http, libUrl, Resource,
		JeSuisXML, Cookies) {
*/

var jsgui = require('../web/jsgui-html'), os = require('os'), http = require('http'), libUrl = require('url'), Resource = require('./core/resource'),
  JeSuisXML = require('../web/jsgui-je-suis-xml'), Cookies = require('cookies');

	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;

	// This can have a Table_Data_Resource.
	//  It makes use of a table or collection in a database.
	//  Uses the table and atabase resource API, rather than needing a reference to them.

	// Info on a single table...
	//  Not so sure this should be for all of the info in a website.

	// Perhaps we could have more than one info resource?

	// Perhaps a resource-data-table would be good?
	//  We want it to be abstract from the implementation of the DB at the level of where the resource is called.

	// Just for one table basically?

	// resource-web-content?
	//  That could be quite useful.
	//   The info resource could still be used to hold a few other things.




	var Info = Resource.extend({


		'init': function(spec) {
			this._super(spec);

			// meta.db_resource
			//  I think that will be the way of connecting it.
			//  There is an info resource available by default to a server.
			//  It gets connected to the database resource.

			// There will be a separate connection for the authentication resource when that happens
			//  Possibly could connect to another authentication resource on a different server on the LAN.

			// The resource also has .meta
			//  This will be used to control which database / database table it is associated with.
			//   Also works with Mongo collections.

			var meta = this.meta;

			if (spec.table) {
				meta.set('table', spec.table);
			}






		},
		'start': function(callback) {
			//console.log('lfs start');
			callback(null, true);
		},
		'get': function(key, callback) {
			// All params as one object for the resource?

			// gets the table / collection
			var meta = this.meta;
			var table = meta.get('table');

			console.log('Info get key ' + key);

			var table = meta.get('table');

			table.get(key, callback);

		},
		'set': fp(function(a, sig) {
			// All params as one object for the resource?
			//console.log('Info Resource set sig ' + sig);
			// gets the table / collection
			var meta = this.meta;
			var table = meta.get('table');

			if (sig == '[o,f]') {
				// The key would be within the object.
				var o = a[0];
				var callback = a[1];
				table.put(o, callback);

			}
		})
		// with REST, can do GET .../keys to get the keys.

		// however, I think a 'keys' function would be useful that gets the keys for a resource.
		//  The info object can have a bunch of keys.

		// Set as well... need to set a resource's value.


	});


	//return Info;


//});
module.exports = Info;
