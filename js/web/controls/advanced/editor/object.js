// object editor

/*
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../../jsgui-html-enh", "../viewer/object", "./object-kvp", "./factory"], 
	function(jsgui, Object_Viewer, Object_KVP_Editor, factory) {
*/

var jsgui = require('../../../jsgui-html-enh');
var Object_Viewer = require('../viewer/object');
var Object_KVP_Editor = require('./object-kvp');
var factory = require('./factory');

		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;
		
		var Object_Editor = Object_Viewer.extend({

			// Maybe should put this into a form, so that it does a form post.
			//  That could possibly be disabled.

			'init': function(spec) {
			    var make = this.make;
				
				this.factory = factory;
				this.Object_KVP = Object_KVP_Editor;

				this._super(spec);


				this.set('dom.attributes.class', 'object-editor');
				this.__type_name = 'object_editor';
				
			},
			'refresh_internal': function() {
				this._super();


			}
		});
module.exports = Object_Editor;

		//return Object_Editor;
	//}
//);