
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./plus-minus-toggle-button", "./vertical-expander"], 
	function(jsgui, Plus_Minus_Toggle_Button, Vertical_Expander) {
		
		var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof;
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
				var that = this;


				if (!this._abstract) {

					if (!spec.el) {
						this.set('dom.attributes.class', 'menu-node');


						var spec_state = spec.state, state;

						var main_control = make(Control({ 'class': 'main' }));
						this.add(main_control);
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

							var span = make(jsgui.span({}));

							//var text = this.get('text');
							//console.log('text', text);
							//console.log('tof text', tof(text));

							span.add(spec.text);
							main_control.add(span);
						}
						var menu = spec.menu;
						if (menu) {
							this.set('menu', menu);
						}

						// then there mey be menu items inside these
						//  they will only appear when the menu is opened.
						//  will normally open the menu with a click
						//   or hover in submenu.

						

						var inner_control = make(Control({ 'class': 'inner hidden' }));
						this.add(inner_control);

						// Inner may not just be the title.

						this.set('inner_control', inner_control);

						//inner_control.hide();

						//var inner_control_content = inner_control.get('content');
						// reference to a menu control.
						// maybe take 'value' here
						if (spec.value) {
							// depending on the type of obj, work differently.
							//  array of strings, just make those menu items.

							var obj_menu = spec.value;
							var t_obj_menu = tof(obj_menu);
							console.log('t_obj_menu', t_obj_menu);

							if (t_obj_menu == 'array') {
								each(obj_menu, function(v) {
									// make a new menu node with that as the value?

									var tv = tof(v);
									if (tv == 'string') {
										// new node with text, no inner nodes.

										var nested_menu_node = make(Menu_Node({
											'text': v,
											'menu': menu
										}));
										inner_control.add(nested_menu_node);

									}

								})
							}



						}

						var ctrl_fields = {
							'inner_control': inner_control._id(),
							'main_control': main_control._id(),
							'menu': spec.menu._id()
						}



						// use different quotes...

						this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));




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

				var inner_control = this.get('inner_control');
				var main_control = this.get('main_control');
				var menu = this.get('menu');

				var that = this;

				// raise a select event on the menu.
				// and if there are other nodes inside, 

				main_control.on('click', function(e_click) {
					console.log('inner_control', inner_control);

					var icc = inner_control.get('content');
					var iccl = icc.length();

					if (iccl > 0) {
						// Maybe not, if it's nested.
						//  Could close other branches.
						menu.close_all();


						inner_control.show();
					} else {
						console.log('inner leaf node clicked');

						// means we close all open nodes, and register item as being selected.

						// raise a selected or item-selected? event.

						// or change event? prob not.

						// raise select event.
						menu.close_all();
						menu.raise('select', that);

					}
					
				})
				// then when the main part is clicked, show the inner control.




			},
			'close_all': function() {
				console.log('menu-node close_all');

				// need to do this recursively I think.
				//  could call this recursively on all nodes.

				// 

				var inner_control = this.get('inner_control');

				inner_control.get('content').each(function(i, v) {
					console.log('i', i);
					console.log('v', v);



					var tn = v.__type_name;
					console.log('tn', tn);

					if (tn == 'menu_node') {
						v.close_all();
					}



					//v.close_all();
				});

				inner_control.hide();


			}
		});
		return Menu_Node;
	
});