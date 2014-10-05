// object viewer


//if (typeof define !== 'function') {
//    var define = require('amdefine')(module);
//};

//define(["require", "../../../jsgui-html-enh"/*, "./object", "./array", "./basic/string", "./basic/number" */],
//	function(require, jsgui /*, Object_Editor, Array_Editor, String_Editor, Number_Editor */) {

var jsgui = require('../../../jsgui-html-enh');
var Object_Editor = require('./object');
var Array_Editor = require('./array');
var String_Editor = require('./basic/string');
var Number_Editor = require('./basic/number');
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;

		// Need to side-load these various components.
		//  Would be nice to have easy sideload syntax.

		var map_modules = {};

		var that = this;

		var create = function(obj, context) {
			var tobj = tof(obj);
			//console.log('tobj ' + tobj);
			if (tobj == 'object') {
				var Object_Editor = require('./object');
				var res = new Object_Editor({
					'context': context,
					'value': obj
				})
				return res;
			}
			if (tobj == 'array') {
				var Array_Editor = require('./array');
				var res = new Array_Editor({
					'context': context,
					'value': obj
				})
				return res;
			}
			if (tobj == 'string') {
				var String_Editor = require('./basic/string');
				var res = new String_Editor({
					'context': context,
					'value': obj
				})
				return res;
			}
			if (tobj == 'number') {
				var Number_Editor = require('./basic/number');
				var res = new Number_Editor({
					'context': context,
					'value': obj
				})
				return res;
			}
			if (tobj == 'data_value') {
				var val = obj.value();
				var tval = tof(val);

				if (tval == 'string') {
					var String_Editor = require('./basic/string');
					var res = new String_Editor({
						'context': context,
						'value': obj
					})
				}

				if (tval == 'array') {
					var Array_Editor = require('./basic/number');
					var res = new Array_Editor({
						'context': context,
						'value': obj
					})
				}
				
				return res;
			}
		}
module.exports = create;
		


//		return create;
//	}
//);