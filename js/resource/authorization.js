if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../web/jsgui-html', 'os', 'http', 'url', './core/resource', '../web/jsgui-je-suis-xml', 'cookies'], 

	function(jsgui, os, http, libUrl, Resource, JeSuisXML, Cookies) {

	
	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;
	
	var exec = require('child_process').exec;

	
	var Authorization_Provider = Resource.extend({
		'init': function(spec) {
			this._super(spec);
		}
	});
	
	var Simple_Authorization_Provider = Authorization_Provider.extend({
		'init': function(spec) {
			this._super(spec);
		},
		// maybe not just the username???
		'get_user_roles': function(username) {
			if (username == 'admin') {
				return 'server_admin';
			}
		},
		'meets_requirements': function() {
			return true;
		},
		'start': function(callback) {
			callback(null, true);
		}
	});
	
	
	
	var Authorization = {
		'Provider': Authorization_Provider,
		'Simple_Provider': Simple_Authorization_Provider
	}
	
	
	return Authentication;
	
	
});