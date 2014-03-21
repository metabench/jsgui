
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./single-line"], 
	function(jsgui, Single_Line) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;
		

		// Extending, with field values being set?
		//  Setting field values in definitions may be a useful thing.
		var Title_Bar = Control.extend({
			// fields... text, value, type?
			//  type could specify some kind of validation, or also 'password'.
				
			// single field?
			'fields': [
				['text', String]
			],			
			//  and can have other fields possibly.
			
			
			'init': function(spec) {
				this._super(spec);

				this.set('dom.attributes.class', 'title bar');
				var span = new jsgui.span({
					'context': this._context
				})
				span.add(this.get('text').value());
				//ctrl_title_bar.set('dom.attributes.class', 'titlebar');
				this.add(span);
				
			}
		});
		return Title_Bar;
		
		//return jsgui;
		
	
});