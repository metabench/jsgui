// Vertical_Expander


if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html"], 
	function(jsgui) {
		
		var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof;
		var Control = jsgui.Control;

		var v_subtract = jsgui.v_subtract;
		

		// Extending, with field values being set?
		//  Setting field values in definitions may be a useful thing.
		var Horizontal_Slider = Control.extend({
			// fields... text, value, type?
			//  type could specify some kind of validation, or also 'password'.
				
			// single field?
			//'fields': [
			//	['text', String]
			//],			
			//  and can have other fields possibly.
			
			
			'init': function(spec, add, make) {
				this._super(spec);
				this.__type_name = 'horizontal_slider';
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

					var div_relative = add(Control({'class': 'relative'}))
					this.set('dom.attributes.class', 'horizontal slider');

					// Then we add the bar over the width.
					var h_bar = make(Control({'class': 'h-bar'}));
					var v_bar = make(Control({'class': 'v-bar'}));

					div_relative.add(h_bar);
					div_relative.add(v_bar);

					var ctrl_fields = {
						'h_bar': h_bar._id(),
						'v_bar': v_bar._id()
					}

					this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));

					this.active();
				}

				
				


				
			},
			'activate': function() {
				this._super();
				console.log('Horizontal Slider activate');

				var h_bar = this.get('h_bar');
				var v_bar = this.get('v_bar');

				console.log('h_bar', h_bar);
				console.log('v_bar', v_bar);

				var size = this.size();
				console.log('size', size);

				var h_padding = 5;

				var h_bar_width = size[0] - h_padding * 2;

				h_bar.style({
					'width': h_bar_width + 'px'
				});

				var ctrl_html_root = this._context.ctrl_document;


				// have lower level drag working on the h_bar?
				//  want some kind of flexible drag, but that could be done while cutting out code.
				//  for the moment, will do the eventhandlers?
				//   generic drag handlers would be useful for touch interfaces as well.

				var pos_down, pos_current, pos_offset;

				var orig_v_bar_l = parseInt(v_bar.style('left'), 10);
				var new_v_bar_l;

				console.log('orig_v_bar_l', orig_v_bar_l);

				var fn_mousemove = function(e_mousemove) {
					console.log('e_mousemove', e_mousemove);

					pos_current = [e_mousemove.pageX, e_mousemove.pageY];

					pos_offset = v_subtract(pos_current, pos_down);
					console.log('pos_offset', pos_offset);

					new_v_bar_l = orig_v_bar_l + pos_offset[0];

					// need to constrain the bar values.

					if (new_v_bar_l > size[0] - h_padding * 2) {
						new_v_bar_l = size[0] - h_padding * 2;
					}

					if (new_v_bar_l < h_padding) {
						new_v_bar_l = h_padding;
					}

					v_bar.style('left', new_v_bar_l + 'px');

				}

				var fn_mouseup = function(e_mouseup) {

					ctrl_html_root.off('mousemove', fn_mousemove);
					ctrl_html_root.off('mouseup', fn_mouseup);

					//pos_current = [e_mousemove.pageX, e_mousemove.pageY];

					ctrl_html_root.remove_class('dragging');

					orig_v_bar_l = new_v_bar_l;

				}

				v_bar.on('mousedown', function(e_mousedown) {
					ctrl_html_root.on('mousemove', fn_mousemove);

					ctrl_html_root.on('mouseup', fn_mouseup);

					ctrl_html_root.add_class('dragging');

					// use pageX and pageY
					pos_down = [e_mousedown.pageX, e_mousedown.pageY];

				});



				// need to 


			}
		});
		
		return Horizontal_Slider;
		
		//return jsgui;
});