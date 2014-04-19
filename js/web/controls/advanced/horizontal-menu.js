// object viewer


if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html"], 
	function(jsgui) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;

		var Horizontal_Menu = Control.extend({

			// could have a title field.
			//'fields': {
			//	'title': String
			//},


			// maybe add before make would be better. add will probably be used more.
			'init': function(spec, add, make) {
				this._super(spec);

				this.__type_name = 'horizontal_menu';

				this.set('dom.attributes.class', 'horizontal menu');
				console.log('spec.el', spec.el);




				if (!spec.abstract && !spec.el) {
					// the bar at the top.

					// It's going to act as a drag handle for this.
					//  The drag system will integrate with various bands / window positions.

					// Maybe a property to say that it's dockable.
					

					//var top_bar = new Control({
					//	'context': this._context
					//})
					//top_bar.set('dom.attributes.class', 'title bar');
					//this.add(top_bar);

					

					
				}

			},
			'activate': function() {
				// May need to register Flexiboard in some way on the client.
				this._super();

				console.log('activate Horizontal_Menu');

				

				// 

			}
		})



		return Horizontal_Menu;
	}
);