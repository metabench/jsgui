// object viewer

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

define(["require", "../../../jsgui-html-enh"/*, "./object", "./array", "./basic/string", "./basic/number" */], 
	function(require, jsgui /*, Object_Viewer, Array_Viewer, String_Viewer, Number_Viewer */) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;

		// Need to side-load these various components.
		//  Would be nice to have easy sideload syntax.

		var map_modules = {};

		var that = this;

		/*

		console.log("module's path is: " + module.uri);
    	console.log("module's dir is: " + path.dirname(module.uri));
		*/
    	// Making a sideloaded constructor may be more work.

    	// Can't do circular reference like that.
    	/*
    	var Object_Viewer = require('./object');
		var Array_Viewer = require('./array');
		var String_Viewer = require('./basic/string');
		var Number_Viewer = require('./basic/number');
		*/

		// Want it so we get the object when needed...
		//  Not so sure it can apply the constructor?

		// Want to be sure to have the reference to the object when needed...




    	/*

		var sideload = function(module_path) {
			// Only do it the first time it is called?
			//  That may be the way to avoid unnecessary recursion.

			// the sideload could handle module path trickery.
			//  paths need to be relative to this module's path.
			//var relative_module_path = path.dirname(module.uri) + '/' + module_path;
			//console.log('relative_module_path', relative_module_path);

			var res = function() {
				var module = map_modules[module_path];
				// see if we have it already
				if (!module) {
					console.log('sideloading module_path: ', module_path);
					module = map_modules[module_path] = require(module_path);
				}
				return module.apply(this, arguments);
				//return module;
				//return 

			}
			return res;

		};
		*/
		

		// Need more trickery with the module path...

		/*
		var Object_Viewer = sideload('./object');
		var Array_Viewer = sideload('./array');
		var String_Viewer = sideload('./basic/string');
		var Number_Viewer = sideload('./basic/number');
		*/



		var create = function(obj, context) {
			var tobj = tof(obj);
			//console.log('tobj ' + tobj);
			if (tobj == 'object') {
				var Object_Viewer = require('./object');
				var res = new Object_Viewer({
					'context': context,
					'value': obj
				})
				return res;
			}
			if (tobj == 'array') {
				var Array_Viewer = require('./array');
				var res = new Array_Viewer({
					'context': context,
					'value': obj
				})
				return res;
			}
			if (tobj == 'string') {
				var String_Viewer = require('./basic/string');
				var res = new String_Viewer({
					'context': context,
					'value': obj
				})
				return res;
			}
			if (tobj == 'number') {
				var Number_Viewer = require('./basic/number');
				var res = new Number_Viewer({
					'context': context,
					'value': obj
				})
				return res;
			}
			if (tobj == 'data_value') {
				var val = obj.value();
				var tval = tof(val);

				if (tval == 'string') {
					var String_Viewer = require('./basic/string');
					var res = new String_Viewer({
						'context': context,
						'value': obj
					})
				}

				if (tval == 'array') {
					var Array_Viewer = require('./basic/number');
					var res = new Array_Viewer({
						'context': context,
						'value': obj
					})
				}
				
				return res;
			}
		}
		
		

		return create;
	}
);