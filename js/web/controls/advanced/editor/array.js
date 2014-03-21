// object editor


if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../../jsgui-html-enh", "../viewer/array", "./factory"], 
	function(jsgui, Array_Viewer, factory) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		
		var Array_Editor = Array_Viewer.extend({

			// Maybe should put this into a form, so that it does a form post.
			//  That could possibly be disabled.

			'init': function(spec) {
			    var make = this.make;
				this.factory = factory;
				this._super(spec);

				this.set('dom.attributes.class', 'array-editor');
				this.__type_name = 'array_editor';
				
				// when the object changes, we re-render.
				//  Not sure about re-rendering the whole thing though.

			},
			'refresh_internal': function() {
				this._super();

			}
		});

		return Array_Editor;
	}
);