
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./plus-minus-toggle-button"], 
	function(jsgui, Plus_Minus_Toggle_Button) {
		
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

			// Tree node having expanded and contracted states.

			// Tree Node has an image and some text, and a contrainer control for othe tree nodes.
			//  Can be collapsed so that the internal items don't show




			//'fields': [
				//['text', String]


			//],			

			//'fields': {
			//	'img_src': 'string',
			//	'text': 'string'
			//},

			//  and can have other fields possibly.
			
			
			'init': function(spec, add, make) {
				// Wont fields have been set?

				this._super(spec);

				// Can take an image
				// Can take some text.
				//  That's all I'll have in the tree node for now.



				if (!this._abstract) {
					this.set('dom.attributes.class', 'tree-node');


					var spec_state = spec.state, state;
					//console.log('**** spec.img_src', spec.img_src);
					if (spec.img_src) {
						//this.set('img_src', spec.img_src);

						var img_src = this.get('img_src');
						//console.log('img_src', img_src);
						//console.log('this._', this._);
						//throw '1) stop;'
					}
					if (spec.text) {
						this.set('text', spec.text);
					}

					if (spec_state) {


						if (spec_state == 'expanded' || spec_state == 'contracted') {
							state = this.set('state', spec_state);
						} else {
							throw 'spec.state expects "expanded" or "contracted".';
						}
					} else {
						state = this.set('state', 'expanded');
					}

					console.log('state', state);
					console.log('tof state', tof(state));


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

					// Can have a Toggle_Button control.
					//  Then can have a Plus_Minus_Toggle_Button control.

					//var plus_minus = add(Control({ 'class': 'plus_minus' }));
					

					var top_line = add(Control({ 'class': 'top-line' }));


					var plus_minus = make(Plus_Minus_Toggle_Button({}));
					top_line.add(plus_minus);

					var img_src = this.get('img_src');


					var img = make(jsgui.img({}));
					img.set('dom.attributes.src', img_src);
					top_line.add(img);

					// Also add the text to the top line.

					var span = make(jsgui.span({}));
					span.add(this.get('text'));
					top_line.add(span);

					// add the image to the top line.


					//console.log('img_src', img_src);
					//console.log('this._', this._);
					//throw 'stop;'


					// We have the top line, then the rest

					var clearall = add(Control({'class': 'clearall'}));

					var expander = add(Control({'class': 'expander'}));


					var inner_control = make(Control({ 'class': 'inner' }));
					expander.add(inner_control);

					// Inner may not just be the title.

					this.set('inner_control', inner_control);
				}


					

				
			},
			'activate': function() {
				// Need to listen to the toggle event of the plus minus toggle button

				// This will be done through the ctrl~_fields system.
				//  Would like an easier way of setting that up.

				




			}
		});
		return Tree_Node;
		
		//return jsgui;
		
	
});