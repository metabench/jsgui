// object viewer


if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html"], 
	function(jsgui) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;

		var Flexiboard = Control.extend({
			'init': function(spec) {
				this._super(spec);

				this.__type_name = 'flexiboard';

				this.set('dom.attributes.class', 'flexiboard');

				if (!spec.el) {
					// the bar at the top.

					// It's going to act as a drag handle for this.
					//  The drag system will integrate with various bands / window positions.

					// Maybe a property to say that it's dockable.
					

					var top_bar = new Control({
						'context': this._context
					})
					top_bar.set('dom.attributes.class', 'top-bar');

					this.add(top_bar);

					// May want some code to set this up as a dockable dialog window.
					//  Dockable window?

					// Quite a lot of functionality for this should be applicable to general controls.

					// Not get the bhaviours set up as an abstraction yet.
					//  However, a few functions that set things up seems useful.

					// Perhaps put things in the enhanced html section?
					// in activate... 
					//  but need to get the top bar reference back.


					// would be nice if it could be set here and would automatically carry forward to the client.

					// and make the top bar act as a drag / window handle to this, the Flexiboard.

					// Will also work within the Page_Context.
					//  The Page_Context will have some handling for dragging windows.


					// Will need to be done on activation.
					//top_bar.drag_handle_to(this);

					// Maybe good to get linked controls through the JSGUI system.
					//  Although it makes clutter in the DOM at the moment, that could be done through a much more optimized system.

					// Should also have a map of its contents.

					
				}

			},
			'activate': function() {
				// May need to register Flexiboard in some way on the client.
				this._super();

				console.log('activate Flexiboard ');

				var content = this.get('content');
				
				console.log('content.length ' + content.length());
				var top_bar = content.get(0);
				top_bar.drag_handle_to(this);

				// 

			}
		})



		return Flexiboard;
	}
);