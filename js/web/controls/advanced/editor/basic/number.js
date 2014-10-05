// object editor

/*
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../../../jsgui-html-enh", "../../viewer/basic/number"], 
	function(jsgui, Number_Viewer) {
		*/

var jsgui = require('../../../../jsgui-html-enh');
var Number_Viewer = require('../../viewer/basic/number');
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		
		var Number_Editor = Number_Viewer.extend({

			// Maybe should put this into a form, so that it does a form post.
			//  That could possibly be disabled.


			'init': function(spec) {
			    var make = this.make;
			    
				
				this._super(spec);

				this.set('dom.attributes.class', 'number-editor');
				this.__type_name = 'number_editor';


				// when the object changes, we re-render.
				//  Not sure about re-rendering the whole thing though.

				// Then when it is selected, have it listen for keyboard events?
				//  Or have some larger / wider keyboard event listener that sends the events to this?

				// I think having this listen to the doc's keyboard events when it is selected makes sense.

				// Could have some events that respond to it being selected (and deselected).


				//this.set('dom.attributes.contenteditable', 'true');
				// Not so fast... not sure contenteditable is the way.
				
				

				// I think it should also look out for keyboard events (when activated).
				//  Only when it has the focus will it need to pay attention to these keyboard events.
				//   It could have some real-time validation that prevents invalid values.

				



			},
			'refresh_internal': function() {
				this._super();

			}
		});
module.exports = Number_Editor;

		//return Number_Editor;
	//}
//);