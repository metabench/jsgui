
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html"], 
	function(jsgui, Text_Input) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;
		
		var Single_Line = Control.extend({
			// fields... text, value, type?
			//  type could specify some kind of validation, or also 'password'.
				
			// single field?
			'fields': [
				['value', Object],
				['field', String],
				['meta_field', String]
			],			
			//  and can have other fields possibly.
			
			
			'init': function(spec) {
				this._super(spec);

				this.set('dom.attributes.class', 'single-line');
				this.__type_name = 'single_line';

				//if (spec.resource_pool) {
				//	this.set('resource_pool', spec.resource_pool);
				//}

				// we have access to the resource pool through the page context.
				//  that may be disabled in some configurations though.

				//var pool = this._context.pool;
				//console.log('pool', pool);

				// then for each resource in the pool, we have a resource control.
				//  controls for the same kind of item could be in different kinds of display modes, such as list and
				//  edit. Don't want to make loads of modules for different things, so having resources display just with their
				//  name in one configuration, and as an editable / interactive full size object in another configuration.

				var value = this.get('value');
				//console.log('Single_Line init value ', value);

				var display_value;

				var meta_field = this.get('meta_field');
				//console.log('tof meta_field', tof(meta_field));
				//console.log('meta_field', meta_field);

				if (meta_field) {
					display_value = value.meta.get(meta_field.value());
				}

				//console.log('display_value', display_value);
				//console.log('tof display_value', tof(display_value));

				// and have a span where it shows that value

				var el = this.get('dom.el');
				if (!el) {
					var span = new jsgui.span({
						'context': this._context//,
						//'content': display_value
					});
					if (display_value) {
						span.add(display_value);
					}
					


					this.add(span);

					this.set('span', span);
				}

				


				// Maybe won't get the field directly.
				//  May be getting a meta field.

			},
			'activate': function() {
				this._super();

				// Not sure it will have activated / got the subcontrols as content yet...


				// also do some scraping.
				//  want to get the value.
				//  as data_value or string?

				// get the child span control...
				var content = this.get('content');
				//console.log('Single_Line content', content);

				// need to read the value from that.
				var span = content.get(0);
				//console.log('span', span);


				var val = span.get('dom.el').innerHTML;

				this.set('value', val);

				/*
				var span = this.get('content').get(0);
				console.log('span', span);

				var span_content = span.get('content');
				console.log('span_content', span_content);
				*/
				//var span_content_item = span.get('content').get(0);
				//console.log('span_content_item', span_content_item);

			}


		});
		return Single_Line;
		
		//return jsgui;
		
	
});