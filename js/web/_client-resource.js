
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['./jsgui-html', './resource'], 

	function(jsgui, Resource) {

	
	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;
	
	// Extends AutoStart_Resource?

	// May need to change around a fair few references to make it workable.
	// May need some more complicated logic to change it to the path for service.


	var Client_Resource = Resource.extend({
		//'fields': {
		//	'url': String
		//},

		'init': function(spec) {
			this._super(spec);

			if (spec.meta) {
				var meta = spec.meta;
				console.log('1) meta.url', meta.url);
				if (meta.url) this.meta.set('url', meta.url);
				if (meta.type_levels) this.meta.set('type_levels', meta.type_levels);


				//console.log('meta.name ' + meta.name);
			}

			//this.meta.set('custom_paths', new Data_Object({}));
			// Those are custom file paths.

			// could have a collection of directories, indexed by name, that get served.

			// Index the collection by string value?
			//this.meta.set('served_directories', new Collection({'index_by': 'name'}));

			// Will also have a URL.
			//  The client resource pool will have a base url.
			//   Maybe default base URL, it's set up to communicate with the server that served the HTML document.

			// could have a variety of server URLs, but let's deal with one for the moment.


		},
		'get': function(callback) {
			var url = this.meta.get('url').value();
			console.log('url', url);
			jsgui.http(url, function(err, res) {
				if (err) {
					callback(err);
				} else {
					console.log('res', res);
					callback(null, res);
				}
			})
		}
		//'start': function(callback) {
		//	callback(null, true);
		//}
	});
	
	
	return Client_Resource;
	
	
});