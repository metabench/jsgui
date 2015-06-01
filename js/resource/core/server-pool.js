
/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../../web/jsgui-html', 'os', 'http', 'url', './resource', '../../web/jsgui-je-suis-xml', 'cookies',
	'../local-server-info', './pool', "./publisher"],

	function(jsgui, os, http, libUrl, Resource, JeSuisXML,
		Cookies, Local_Server_Info, Resource_Pool, Resource_Publisher) {
*/

var jsgui = require('../../web/jsgui-html'), os = require('os'), http = require('http'),
libUrl = require('url'), Resource = require('./resource'),
JeSuisXML = require('../../web/jsgui-je-suis-xml'), Cookies = require('cookies'),
Local_Server_Info = require('../local-server-info'), Resource_Pool = require('./pool'), Resource_Publisher = require('./publisher');

	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;

	var exec = require('child_process').exec;

	// Perhaps this will have HTTP endpoints as well?
	//  Maybe we can access it through url/resources/

	// Perhaps a resource publisher, or a few of them could be useful.
	//  HTTP_Resource_Publisher?
	//  Generally publishes a resource over HTTP.
	//   Will have some authorization and authentication properties, hooked up with the proper providers.

	// This may be the place in which remote access to the resources is given.
	//  It would make sense.
	//  Perhaps it is worth using a resource publisher? Then is that a resource?
	//  I think the resource pool may be the sensible point of access.





	var Server_Resource_Pool = Resource_Pool.extend({
		'init': function(spec) {
			this._super(spec);

			// will add the Resource_Local_Server_Information


			// Will be nice to set them with an object.
			//  Not just the normal spec.
			//  Maybe can see if the spec matches fields?
			//  Or copy fields from the spec?
			var lsi = new Local_Server_Info({
				'meta': {
					'name': 'Local Server Info'
				},
				'startup_type': 'auto',
				'access': {
					'full': ['server_admin']
				}
			});

			this.add(lsi);

			// And a resource publisher resource.
			//  It goes in the pool, and it publishes other resources (over HTTP)
			//   The resource pool contains its own publisher.

			// Likely to want multiple publisher resources - one for each published resource.
			//  This used to publish the resource pool. Will use a resource pool publisher for this in the future.

			/*
			var publisher = new Resource_Publisher_HTTP({
				'meta': {
					'name': 'HTTP Resource Publisher'
				},
				'startup_type': 'auto',
				'access': {
					'full': ['server_admin']
				}
			});

			this.add(publisher);
			*/




		}

	})


	//return Server_Resource_Pool;


//});
module.exports = Server_Resource_Pool;
