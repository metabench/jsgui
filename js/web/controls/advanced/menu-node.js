
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./plus-minus-toggle-button", "./vertical-expander"], 
	function(jsgui, Plus_Minus_Toggle_Button, Vertical_Expander) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;
		

		// Extending, with field values being set?
		//  Setting field values in definitions may be a useful thing.

		// A container type that has got content added to a different place to the root node.
		//  Content gets added in a specific content part.
		//  Could be done by overriding the add function?
		//  Will have a specific field where the content gets added.


		var Menu_Node = Control.extend({
			// fields... text, value, type?
			//  type could specify some kind of validation, or also 'password'.
				
			// single field?

			// Actually having a different content?
			//  Or use inner_content.

			// Menu node having expanded and contracted states.

			// Menu Node has an image and some text, and a contrainer control for othe Menu nodes.
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
				//  That's all I'll have in the Menu node for now.
				this.__type_name = 'menu_node';


				if (!this._abstract) {

					if (typeof document == 'undefined') {
						this.set('dom.attributes.class', 'menu-node');


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
					}
				}
					

				
			},
			'activate': function() {
				this._super();

			}
		});
		return Menu_Node;
	
});