
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./single-line"], 
	function(jsgui, Single_Line) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;
		

		// Extending, with field values being set?
		//  Setting field values in definitions may be a useful thing.

		// A container type that has got content added to a different place to the root node.
		//  Content gets added in a specific content part.
		//  Could be done by overriding the add function?
		//  Will have a specific field where the content gets added.


		var Tree_Node = Control.extend({
			// fields... text, value, type?
			//  type could specify some kind of validation, or also 'password'.
				
			// single field?

			// Actually having a different content?
			//  Or use inner_content.



			'fields': [
				//['text', String]
			],			
			//  and can have other fields possibly.
			
			
			'init': function(spec, add, make) {
				this._super(spec);

				this.set('dom.attributes.class', 'tree-node');
				//var span = new jsgui.span({
				//	'context': this._context
				//})
				//span.add(this.get('text').value());
				//ctrl_title_bar.set('dom.attributes.class', 'titlebar');
				//this.add(span);

				// Will have the plus and minus
				//  Indentation
				//  And its own content - which will probably contain tree nodes.

				// Will have the plus or minus symbols

				var plus_minus = add(Control({}));

				var inner_content = add(Control({}));
				
			}
		});
		return Tree_Node;
		
		//return jsgui;
		
	
});