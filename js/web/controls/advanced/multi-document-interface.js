
if (typeof define !== 'function') { var define = require('amdefine')(module) }


// Also want to make an MDI window system (Multiple Document Interface)

define(["../../jsgui-html", "./horizontal-menu"], 
	function(jsgui, Horizontal_Menu) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;

		// Extensions of inner frames within inner frames...
		//  The relative frame container, which has an inner frame. Then if something extends that, it would be good for that
		//  to have an inner_control of its own and seamlessly expose that one while using the one above that.

		// Relate the inner_control more to that level of the control heirachy.
		//	Then make it so that they are navigable in sequence.
		//  Not for the moment though.
		//  I'll just have the Window control contain a relative div.


		//var Relative_Frame = Control.

		var Multi_Document_Interface = Control.extend({



			// could have a title field.
			//'fields': {
			//	'title': String
			//},


			// maybe add before make would be better. add will probably be used more.
			'init': function(spec, add, make) {
				this._super(spec);

				this.__type_name = 'multi_document_interface';

				this.set('dom.attributes.class', 'multi-document-interface');
				console.log('spec.el', spec.el);

				if (!spec.abstract && !spec.el) {

					
				}

			},
			'activate': function() {
				// May need to register Flexiboard in some way on the client.
				this._super();


			}//,
			// Takes on the menu of the maximized window (for the moment).
			//  Could have its own menu possibly
			//'menu': function(menu_spec) {
				

			//}
		})

		return Multi_Document_Interface;
	}
);