// object editor

/*
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../../jsgui-html-enh", "../viewer/object-kvp", "./factory", "./basic/string"], 
	function(jsgui, Object_KVP_Viewer, factory, String_Editor) {
*/

var jsgui = require('../../../jsgui-html-enh');
var Object_KVP_Viewer = require('../viewer/object-kvp');
var factory = require('./factory');
var String_Editor = require('./basic/string');
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		// A way of telling this to do a component replace?
		//  So that it uses the editor components instead of the viewer ones.

		// Class substitutions may be a useful thing, so it chooses the correct class to use.
		//  So, it could load with various references, and those references could be changed by using substitutions
		//   before the module is initialized.
		//  So, it would set values in the control's prototype.
		//   Running a control could be done in different ways depending on what 'mode' or particular subclass is used.




		
		var Object_KVP_Editor = Object_KVP_Viewer.extend({
			'init': function(spec) {
				this.factory = factory;
				this.String = String_Editor;
				this._super(spec);

				this.set('dom.attributes.class', 'object-kvp-editor');
				this.__type_name = 'object_kvp_editor';
				
			},
			'refresh_internal': function() {
				// Instead of having viewer components, this needs to have editor components.

				this._super();

			}
		})
module.exports = Object_KVP_Editor;

		//return Object_KVP_Editor;
	//}
//);