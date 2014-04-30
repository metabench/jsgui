// Vertical_Expander


if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./horizontal-slider"], 
	function(jsgui, Horizontal_Slider) {
		
		var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof;
		var Control = jsgui.Control;

		var v_subtract = jsgui.v_subtract;
		

		// Extending, with field values being set?
		//  Setting field values in definitions may be a useful thing.
		var Audio_Volume = Control.extend({
			// fields... text, value, type?
			//  type could specify some kind of validation, or also 'password'.
				
			// single field?
			//'fields': [
			//	['text', String]
			//],			
			//  and can have other fields possibly.
			
			
			'init': function(spec, add, make) {
				this._super(spec);
				this.__type_name = 'audio_volume';

				if (!spec.abstract && !spec.el) {

					this.set('dom.attributes.class', 'audio-volume');
					// the bar at the top.

					// It's going to act as a drag handle for this.
					//  The drag system will integrate with various bands / window positions.

					// Maybe a property to say that it's dockable.
					

					//var top_bar = new Control({
					//	'context': this._context
					//})
					//top_bar.set('dom.attributes.class', 'title bar');


					//this.add(top_bar);

					var h_slider = add(Horizontal_Slider({
						'min': 0,
						'max': 100
					}));

					var ctrl_fields = {
						'h_slider': h_slider._id()
					}

					this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));


					this.active();
				}

				
				


				
			},
			'activate': function() {
				this._super();
				console.log('Audio Volume activate');

				var h_slider = this.get('h_slider');


				


			}
		});
		
		return Audio_Volume;
		
		//return jsgui;
});