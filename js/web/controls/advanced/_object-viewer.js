// object viewer


if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html-enh"], 
	function(jsgui) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;

		// A clipboard / flexiboard would be useful in conjunction with these.
		//  Being able to drag items to the flexiboard would help.
		//  Could also fo a bit more on window UIs for the flexiboard.

		// Want to be able to drag items to the flexiboard, drop them there, possibly edit them,
		//  then drag them elsewhere.
		// Saving the flexiboard, or different flexiboard configurations would be really useful.

		// Flexiboard could maybe be the way into settings, various options.
		//  Could work on mobile too, sliding in and out of view.

		// Flexiboard would need to be anchored in different ways.

		// Generally, flexiboard items will be selectable, groupable,
		//  movable
		//  will be able to reconfigure flexiboard.
		//  add new items, can add code items.



		//  Could act as a keyboard in mobile apps.
		//  





		// Another type of control? - composite or basic-composite?
		//  That would be an unenhanced Login control. Made up of basic controls, will render and
		//   be useful on very limited platforms.

		// Since this is now an advanced control...
		
		// Flexible fields?
		//  So it can accept an object or data_object.

		// Will need to render with different means for either an object or data_object.
		//  Basically, does the 'each', and then will show the keys and their values.

		// Will create the specific viewer for each of the values.

		// Seems like they should be in the same module as they all need each other.

		// I think making it so that the viewer gets activated on the client makes most sense.
		//  Need to ensure that the JSGUI JS gets served to the client.

		// Now, can make editor versions of these.
		//  Will inherit from the viewers.

		// Let's make objects within the JSON viewer selectable.
		//  Will have it editable quite what does what.
		//  Want it to be really concisely expressed.

		// Click on KVP quotes - selects the whole KVP (and its comma if it has one).
		// Click on KVP key text - selects whole KVP
		//  While whole KVP is selected will select the KVP key text
		// Click on KVP colon space - select whole KVP
		// Click on string quotes - select whole kvp
		//  when whole kvp is selected - select string incl quotes
		// Click on string text - selects whole kvp
		//  with kvp selected will select the text

		// Want it so that these rules can be looked at in the code and they are not pages of code themselves that would take a while to
		//  change.

		// Those are all selection rules.

		// Should just set it up for the moment....

		// Need to set up a selection_scope
		//  Eg in a file tree clicking on another one without a modifier deselects all others within that scope
		//  Outside of that scope the selections are not modified.

		// In this case, the json viewer is the selection scope.
		//  Or it has the selection scope.

		// The selectable behaviour will have a scope.
		//  Likely to be a feature of html-enh

		// Selected is like focused, somewhat.
		//  May be some overlap in concepts.


		// Need to deal with selectable objects in a recursive structure.

		// Selecting needs to work on the innermost object that can be selected.
		//  Can try making a String_Viewer selectable...

		// Handle click event.
		//  Change the control's selected flag.
		//  Need a bit of an indexing system for dealing with the controls that are selected.

		// Generally will avoid code that can be avoided in these component modules.
		//  Need to deal with abstractions.
		//  Behaviours seems to be a good one.
		//  

		// ctrl.selectable();

		// Could have automatically enhanced controls.
		//  Some functionality such as 'selectable'

		// I think a 'selected' css flag makes the most sense.
		
		// This control could also start drag events.
		//  Selecting objects, have the ctrl-click system.

		// Also, context menus seem like they could be important.
		//  Want to be able to copy, for example.
		//  Maybe copy to the browser memory, a clipboard made my my app, maybe copy to the system clipboard.
		// Could possibly keep multiple objects in the clipboard, possibly even edit them there.
		//  The context menu would also be a good place to use an image, and get the sprite system integrated into the server.
		//   Would be able to modify a directory of image resources and they will be made into a sprite and served that way.




		// Could maybe separate these types out into individual modules?
		//  The relatively basic types, then ways in which they get joined together.
		//  So, these basic object types, their viewers and editors, can be used in different controls,
		//   such as having an XML viewer / editor that makes use of some of the same basic components used by the JSON
		//    object viewer / editor.


		var String_Viewer = Control.extend({

			// Maybe should put this into a form, so that it does a form post.
			//  That could possibly be disabled.


			'init': function(spec) {
			    var make = this.make;
				
				this._super(spec);

				this.set('dom.attributes.class', 'string-viewer');
				this.__type_name = 'string_viewer';

				var that = this;

				var el = spec.el;

				if (is_defined(spec.value)) {
					//span.add(spec.value);
					this.set('value', spec.value);
				}

				if (!el) {

					// Want a faster way of making these things.
					//  Maybe define a composition.
					//  Or could define its contents?

					// This basically defines 3 spans.

					// Could use composition methods.
					//  Span in particular takes a string.

					// this.compose(['span', 'span_open', '"'], ['span', 'span'], ['span', 'span_close', '"']);

					var span_open = new jsgui.span({
						'context': this._context
					})
					span_open.add('"');

					var span = new jsgui.span({
						'context': this._context
					})

					var span_close = new jsgui.span({
						'context': this._context
					})
					span_close.add('"');

					

					this.add(span_open);
					this.add(span);
					this.add(span_close);

					this.set('span', span);


					this.refresh_internal();
				}

				this.add_event_listener('change', function(e) {
					console.log('String_Viewer change e ' + stringify(e));

					// Need to update the UI.

					// Rendering all controls again seems like a way to do it to start with.
					//  Seems easier than matching up the existing ones with what they have changed too.
					//   Maybe the matching will be more efficient though.
					var fieldName = e[0];
					var fieldValue = e[1];

					console.log('fieldValue ' + stringify(fieldValue));
					console.log('fieldValue ' + tof(fieldValue));

					// then get it to refreshInternalControls.
					// rebuild? build? create?

					that.refresh_internal();
				})

				// when the object changes, we re-render.
				//  Not sure about re-rendering the whole thing though.

			},
			'refresh_internal': function() {
				var value = this.get('value');
				//console.log('value ' + stringify(value));
				//console.log('value ' + tof(value));

				var span = this.get('span');
				var span_content = span.get('content');

				var tval = tof(value);

				var context = this._context;
				var content = this.get('content');
				//console.log('**** String viewer content ' + content);

				if (tval == 'data_value') {
					span_content.clear();
					//span_content.push('"' + value.value() + '"');
					span_content.push(value.value());
				}
			},
			'activate': function() {
				this._super();

				//var el = this.get('dom.el');
				// then we use that 
				var that = this;

				var content = this.get('content');
				console.log('content.length ' + content.length());

				//throw 'stop';

				// then the content are controls which will get set like field controls.

				var ctrl_open = this.set('open', content.get(0));
				this.set('span', content.get(1));
				var ctrl_close = this.set('close', content.get(2));


				var hover_class = 'bg-light-yellow';
				var group_open_close = jsgui.group_hover_class([ctrl_open, ctrl_close], hover_class);

				// click to select, like with the object viewer.

				// A selectable abstraction would be really useful.
				// event-action links.

				// selectable abstraction means it has a click handler that interprets ctrl / shift key...

				// modifiable actions?
				// action responses?
				//  need a simple abstraction.

				// Also, sub-selections.

				//  When selecting something, check if it's ancestor within the same scope is selected.
				//   if so, ignore making the selection.
				//    That prevents there being unnecessary selected objects.




				group_open_close.click(function(e) {
					// is control held down?
					//console.log('e', e);
					var ctrl_key = e.ctrlKey;
					if (ctrl_key) {
						that.action_select_toggle();
					} else {
						that.action_select_only();
					}
				});

				var ctrl_span_content = this.get('span');
				ctrl_span_content.click(function(e) { 
					var ctrl_key = e.ctrlKey;
					if (ctrl_key) {
						ctrl_span_content.action_select_toggle();
					} else {
						ctrl_span_content.action_select_only();
					}

					//ctrl_span_content.action_select_only();
				})

			}
		});
		
		var Number_Viewer = Control.extend({

			// Maybe should put this into a form, so that it does a form post.
			//  That could possibly be disabled.


			'init': function(spec) {
			    var make = this.make;
			    
				
				this._super(spec);

				this.set('dom.attributes.class', 'number-viewer');
				this.__type_name = 'number_viewer';

				var that = this;

				var span = new jsgui.span({
					'context': this._context
				})

				if (is_defined(spec.value)) {


					//span.add(spec.value);
					this.set('value', spec.value);
				}

				this.add(span);
				this.set('span', span);
				this.refresh_internal();


				this.add_event_listener('change', function(e) {
					that.refresh_internal();
				})

				// when the object changes, we re-render.
				//  Not sure about re-rendering the whole thing though.

			},
			'refresh_internal': function() {
				var value = this.get('value');
				//console.log('value ' + stringify(value));
				//console.log('value ' + tof(value));

				var span = this.get('span');
				var span_content = span.get('content');

				var tval = tof(value);

				var context = this._context;
				var content = this.get('content');
				//console.log('**** String viewer content ' + content);

				if (tval == 'data_value') {
					span_content.clear();
					span_content.push(value.value());
				}
			},
			'activate': function() {
				this._super();
				var that = this;
				//that.click(function(e) { that.action_select_only() })


				// this looks like a simple selectable behaviour.
				that.click(function(e) {
					// is control held down?
					//console.log('e', e);
					var ctrl_key = e.ctrlKey;
					if (ctrl_key) {
						that.action_select_toggle();
					} else {
						that.action_select_only();
					}
				});

				// beginning a drag on it...
				//  respond to mousedown with no mouseleave?
				//  then respond to mousemove on the document.

				// want some jsgui drag events to fire on some objects even if they are not d and d themselves
				//  dragging selected objects to a drop zone.

				//that.drag
				//  then a few functions for the event.
				//  move
				//  end

				// This drag behaviour could be generalised.

				// It may also be worth setting up a drop-zone as well.
				//  Then we will have the various events needed for a good UI.


				that.drag(function(e_mousedown) {

				}, function(e_begin) {
					console.log('drag begin', e_begin);

					// could notify the selection scope that a drag has begun.

					// however, dragging one object may also drag the other objects that are selected within the scope.
					//  rename selection_scope to selection_context?
					//   more similar naming with other type of context.

					// Also, would be good to have info about what is being dragged.
					//  That would be part of the page_context.

					//  Want to perfect the beginning of dragging various objects.
					//   We'll know what they are in terms of the objects.
					//    Then the last stage is to update the UI with what has been done.

					// When beginning a drag, it can put things in a drag_group control.
					//  That means that only one control needs to be repositioned.
					//   The rest can appear within that.
					//    We can also make shallow / ghost copies of whatever is being dragged.

					// The page_context will act as a drag_manager, amongst other things.

					var is_selected = that.get('selected');
					if (is_selected && is_selected.value) is_selected = is_selected.value();
					//console.log('is_selected ' + is_selected);
					if (!is_selected) {
						that.action_select_only();
					}

					// and we do the drag for the whole of the selection.
					//  context.drag(this.get('selection_scope'));

					// so everything in the selection scope that is selected will be dragged.
					//  This will bring copies of them into the control that is being dragged.
					//   We move a control around the DOM, so it will be good to be dragging around copies,
					//   or drag_copies or drag_icons of what gets dragged.


					// telling the context of the drag events.


					// Bust dragging a ctrl is different.
					//  Maybe dragging a dockable ctrl will be different still.

					that._context.begin_drag_selection_scope(e_begin, that.find_selection_scope());

					// but just dragging a draggable window... that's a different drag to tell the page context about.


					

				}, function(e_move) {
					//console.log('drag move', e_move);

					that._context.move_drag_selection_scope(e_move);
				}, function(e_end) {
					//console.log('drag end', e_end);
					that._context.end_drag_selection_scope(e_end);
				});




			}
		});

		var Object_KVP_Viewer = Control.extend({
			'init': function(spec) {
				this._super(spec);
				this.set('dom.attributes.class', 'object-kvp-viewer');
				this.__type_name = 'object_kvp_viewer';
				var that = this;

				
				// only create the new controls if the spec does not have an el.
				//  Though may change that check... could check to see if it's an empty el or if there are already elements as content.
				//   to be activated or overwritten.

				if (is_defined(spec.key)) {
					this.set('key', spec.key);
				};

				if (is_defined(spec.value)) {
					this.set('value', spec.value);
				};

				if (!spec.el) {
					var ctrlKey = new Control({
						'context': this._context
					})
					ctrlKey.set('dom.attributes.class', 'object-kvp-key-viewer');

					var span_key_open_quote = new jsgui.span({
						'context': this._context
					});
					span_key_open_quote.add('"');
					ctrlKey.add(span_key_open_quote);

					var span_key_inner = new jsgui.span({
						'context': this._context
					});
					//span_key_close_quote.add('"');
					ctrlKey.add(span_key_inner);

					var span_key_close_quote = new jsgui.span({
						'context': this._context
					});
					span_key_close_quote.add('"');
					ctrlKey.add(span_key_close_quote);

					var span_key_colon_space = new jsgui.span({
						'context': this._context
					});
					span_key_colon_space.add(': ');
					ctrlKey.add(span_key_colon_space);
					//  But setting up the ctrlKey so it has got other controls inside it, which will activate...



					var ctrlValueContainer = new Control({
						'context': this._context
					})
					ctrlValueContainer.set('dom.attributes.class', 'object-kvp-value-viewer');

					var ctrlClose = new Control({
						'context': this._context
					})
					ctrlClose.set('dom.attributes.class', 'object-close');
					ctrlClose.get('content').add('}');

					//this.add(ctrlOpen);
					this.add(ctrlKey);
					this.add(ctrlValueContainer);

					this.refresh_internal();
				}

				this.add_event_listener('change', function(e) {
					console.log('Object_Viewer change e ' + stringify(e));

					// Need to update the UI.

					// Rendering all controls again seems like a way to do it to start with.
					//  Seems easier than matching up the existing ones with what they have changed too.
					//   Maybe the matching will be more efficient though.
					var fieldName = e[0];
					var fieldValue = e[1];

					if (fieldName == 'key') {

					}
					if (fieldName == 'value') {
						
					}

					that.refresh_internal();


				})
			},
			'refresh_internal': function() {
				var key = this.get('key');

				var value = this.get('value');
				
				var content = this.get('content');
				//console.log('content ' + stringify(content));

				//var 

				var ctrl_key = content.get(0);


				var ctrl_value = content.get(1);

				var keyContent = ctrl_key.get('content').get(1);

				if (key) {

					var key_value = key.value();
					console.log('key_value ' + key_value);

					keyContent.add(key_value);

					var vcon = ctrl_value.get('content');
					//vcon.set(1, 'hello');
					vcon.clear();

					var ctrl_viewer = viewer(value, this._context);
					vcon.push(ctrl_viewer);
				}

			},
			'activate': function(el) {

				// could maybe not that the control is active at some stage to prevent reactivation.



				// not sure why this should get activated again.

				this._super(el);

				console.log('activate Object_KVP_Viewer ' + this._id());

				var el = el || this.get('dom.el');
				//console.log('el.innerHTML ' + el.innerHTML);

				var cns = el.childNodes;
				//console.log('cns.length ' + cns.length);

				var content = this.get('content');
				console.log('content.length() ' + content.length());

				var clength = content.length();

				var ctrl_key, ctrl_value, ctrl_comma;

				if (clength == 2 || clength == 3) {
					var content_key = content.get(0);
					//console.log('content_key ' + stringify(content_key));
					//console.log('content_key ' + tof(content_key));


					ctrl_key = this.set('ctrl_key', content_key);


					//console.log('ctrl_key ' + tof(ctrl_key));
					ctrl_value = this.set('ctrl_value', content.get(1));
				}
				if (clength == 3) {
					ctrl_comma = this.set('ctrl_comma', content.get(2));
				}

				if (clength > 3) {
					console.log('content', content);
					throw 'stop';
				}


				// I think with the grid_9 the content still is not being dealt with properly.


				// then the open for the key.
				var key_content = ctrl_key.get('content');


				//console.log('ctrl_key._id() ' + ctrl_key._id())
				//console.log('key_content.length() ' + key_content.length());

				// open, content, close, colon_space

				var ctrl_key_open_quote, ctrl_key_content, ctrl_key_close_quote, ctrl_key_colon_space;


				if (key_content.length() == 4) {
					ctrl_key_open_quote = key_content.get(0);
					ctrl_key_content = key_content.get(1);
					ctrl_key_close_quote = key_content.get(2);
					ctrl_key_colon_space = key_content.get(3);


					var hover_class = 'bg-light-yellow';
					var group_key_quotes = jsgui.group_hover_class([ctrl_key_open_quote, ctrl_key_close_quote], hover_class);


					var that = this;
					//group_key_quotes.click(function(e) {
					//	that.action_select_only();
					//});
					
					group_key_quotes.click_to_select(this);
					// I think click_to_select works nicely as an API.




					


					// an easy way to specify the select action would be good.
					//  there is the normal select which will allow for the ctrl and shift modifiers.

					/*

					ctrl_key_content.click(function(e) {
						// is control held down?
						//console.log('e', e);
						var ctrl_key = e.ctrlKey;
						if (ctrl_key) {
							ctrl_key_content.action_select_toggle();
						} else {
							ctrl_key_content.action_select_only();
						}
					});
					*/

					ctrl_key_content.click_to_select();



					//ctrl_key_content.click(function(e) { ctrl_key_content.action_select_only() });


					// ctrl_key_colon_space
					ctrl_key_colon_space.click_to_select(this);
					/*
					ctrl_key_colon_space.click(function(e) {
						// is control held down?
						//console.log('e', e);
						var ctrl_key = e.ctrlKey;
						if (ctrl_key) {
							that.action_select_toggle();
						} else {
							that.action_select_only();
						}
					});
					*/

					//ctrl_key_colon_space.click(function(e) { that.action_select_only() });

				}
			}
		})

		// Maybe make this an Array_Viewer too?
		var Object_Viewer = Control.extend({

			// Maybe should put this into a form, so that it does a form post.
			//  That could possibly be disabled.

			'init': function(spec) {
			    var make = this.make;
			    
				
				this._super(spec);

				this.set('dom.attributes.class', 'object-viewer');
				this.__type_name = 'object_viewer';
				var req = this._context.req;

				if (is_defined(spec.value)) {
					this.set('value', spec.value);
				}
				if (!spec.el) {
					var ctrlOpen = new Control({
						'context': this._context
					})
					ctrlOpen.set('dom.attributes.class', 'object-open');
					ctrlOpen.get('content').add('{');
					var ctrlOpenID = ctrlOpen._id();

					var ctrlInner = new Control({
						'context': this._context
					})
					ctrlInner.set('dom.attributes.class', 'object-inner');
					

					var ctrlClose = new Control({
						'context': this._context
					})
					ctrlClose.set('dom.attributes.class', 'object-close');
					ctrlClose.get('content').add('}');

					var ctrlCloseID = ctrlClose._id();

					this.add(ctrlOpen);
					this.add(ctrlInner);
					this.add(ctrlClose);

					this.set('inner', ctrlInner);

					// Calling this a 'change' event now.
					var ctrl_fields = {
						'open': ctrlOpenID,
						'close': ctrlCloseID,
						'inner': ctrlInner._id()
					}

					// use different quotes...

					this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));

					this.refresh_internal();
				}
				
				var that = this;


				this.add_event_listener('change', function(e) {
					console.log('Object_Viewer change e ' + stringify(e));
					console.log('Object_Viewer change');
					// Need to update the UI.

					// Rendering all controls again seems like a way to do it to start with.
					//  Seems easier than matching up the existing ones with what they have changed too.
					//   Maybe the matching will be more efficient though.
					var fieldName = e[0];
					var fieldValue = e[1];

					console.log('fieldValue ' + stringify(fieldValue));
					//console.log('fieldValue ' + tof(fieldValue));

					// then get it to refreshInternalControls.
					// rebuild? build? create?

					that.refresh_internal();
				})

				// when the object changes, we re-render.
				//  Not sure about re-rendering the whole thing though.

			},
			'refresh_internal': function() {
				var value = this.get('value');

				var inner = this.get('inner');
				console.log('object viewer refresh_internal ');
				console.log('value ' + stringify(value));
				//console.log('value ' + tof(value));

				// may need to clear the internal controls... seems likely on the client.
				//  could possibly go through the internal controls making small changes....
				// maybe will do this by making granular changes.
				var context = this._context;
				var that = this;

				var first = true;
				var prev_kvp;

				// In activation will need to go through the comma controls again.



				each(value, function(i, v) {

					// need to show the keys...

					if (!first) {
						var comma = new jsgui.span({
							'context': context
						})
						comma.get('content').push(',');

						prev_kvp.get('content').push(comma);
						//inner.add(comma);
					}

					var kvp_viewer = new Object_KVP_Viewer({
						'context': context,
						'key': i,
						'value': v
					})
					var cInternal = viewer(v, context);
					inner.add(kvp_viewer);
					first = false;
					prev_kvp = kvp_viewer;
				});
			},


			// Could put this in control or enhanced control?
			

			'activate': function() {
				this._super();

				var ctrl_open = this.get('open');
				var ctrl_close = this.get('close');

				var ctrl_inner = this.get('inner');

				// Very nice to have this so concise now.
				var hover_class = 'bg-light-yellow';
				var group_open_close = jsgui.group_hover_class([ctrl_open, ctrl_close], hover_class);

				var that = this;
				// then for clicking on either the open or the close tag, should do the select actions for a selectable.


				group_open_close.click_to_select(this);
				/*
				group_open_close.click(function(e) {
					that.action_select_only();
				});
				*/

				// Can maybe be done more neatly with selection handles.

				var prev_comma;
				ctrl_inner.get('content').each(function(i, ctrl_kvp) {
					// Not the inner content...
					//  The inner content 

					var ckvp = ctrl_kvp.get('content');
					//console.log('ckvp.length ' + ckvp.length());
					
					if (prev_comma) {
						prev_comma.click(function(e) {
							// can we find out which character was clicked?
							ctrl_kvp.action_select_only();
						})
					}

					if (ckvp.length() == 3) {
						var comma = ckvp.get(2);
						prev_comma = comma;

					}
				})
				//throw 'stop';

			}
		});
	
		//

		var Array_Viewer = Control.extend({

			//  though in this case the selection behaviour is a bit more complicated.

			// need drag behaviour to be easy too.
			//  however, should implement it with most in jsgui html if possible.




			//'behaviour': ['selectable']

			// Maybe should put this into a form, so that it does a form post.
			//  That could possibly be disabled.

			'init': function(spec) {
			    var make = this.make;
				
				this._super(spec);

				this.set('dom.attributes.class', 'array-viewer');
				this.__type_name = 'array_viewer';

				var req = this._context.req;

				if (is_defined(spec.value)) {
					this.set('value', spec.value);
				}
				var that = this;
				if (!spec.el) {
					var ctrlOpen = new Control({
						'context': this._context
					})
					ctrlOpen.set('dom.attributes.class', 'array-open');
					ctrlOpen.get('content').add('[');

					var ctrlInner = new Control({
						'context': this._context
					})
					ctrlInner.set('dom.attributes.class', 'array-inner');

					var ctrlClose = new Control({
						'context': this._context
					})
					ctrlClose.set('dom.attributes.class', 'array-close');
					ctrlClose.get('content').add(']');

					this.add(ctrlOpen);
					this.add(ctrlInner);
					this.add(ctrlClose);

					this.set('inner', ctrlInner);

					this.refresh_internal();

				}

				this.add_event_listener('change', function(e) {

					var fieldName = e[0];
					var fieldValue = e[1];

					that.refresh_internal();


				})

				// when the object changes, we re-render.
				//  Not sure about re-rendering the whole thing though.

			},
			'refresh_internal': function() {
				var inner = this.get('inner');

				var value = this.get('value');

				var first = true;
				var context = this._context;
				var that = this;
				// Want to keep track of the comma controls.

				

				each(value, function(i, v) {
					// Create the new control for the object...
					var comma_space;
					if (!first) {

						comma_space = new jsgui.span({
							'context': that._context
						})

						comma_space.get('content').push(', ');


						inner.add(comma_space);
						//arr_comma_spaces.push(comma_space);
					}

					var ctrl = viewer(v, context);
					inner.add(ctrl);

					//if (comma_space) {
					//	comma_space.set('next', ctrl);
					//}

					first = false;
				});

			},
			'activate': function() {
				this._super();
				//var el = this.get('dom.el');
				// then we use that 

				// Very concise code compared to how it would be without the control system.

				var content = this.get('content');
				//console.log('content.length ' + content.length());

				//throw 'stop';

				// then the content are controls which will get set like field controls.

				var ctrl_open = this.set('open', content.get(0));
				//this.set('inner', content.get(1));
				var ctrl_close = this.set('close', content.get(2));

				var hover_class = 'bg-light-yellow';

				var group_open_close = jsgui.group_hover_class([ctrl_open, ctrl_close], hover_class);
				var that = this;

				group_open_close.click_to_select(this);
				//group_open_close.click(function(e) {
				//	that.action_select_only();
				//});

				// needs to go through the inner, looking for the comma_spaces.

				var ctrl_inner = content.get(1);

				var prev_comma_space;
				ctrl_inner.get('content').each(function(i, v) {
					var is_comma_space = i % 2;
					//console.log('r ' + r);
					// want the comma space to select the next one.

					if (is_comma_space) {
						prev_comma_space = v;


					} else {
						if (prev_comma_space) {
							prev_comma_space.click_to_select(v);
							//prev_comma_space.click(function(e) {
								// can we find out which character was clicked?
							//	v.action_select_only();
							//})
						}
					}
				})
			}
		});

		var viewer = function(obj, context) {
			var tobj = tof(obj);
			//console.log('tobj ' + tobj);
			if (tobj == 'object') {
				var res = new Object_Viewer({
					'context': context,
					'value': obj
				})
				return res;
			}
			if (tobj == 'array') {
				var res = new Array_Viewer({
					'context': context,
					'value': obj
				})
				return res;
			}
			if (tobj == 'string') {
				var res = new String_Viewer({
					'context': context,
					'value': obj
				})
				return res;
			}
			if (tobj == 'number') {
				var res = new Number_Viewer({
					'context': context,
					'value': obj
				})
				return res;
			}
			if (tobj == 'data_value') {
				var val = obj.value();
				var tval = tof(val);

				if (tval == 'string') {
					var res = new String_Viewer({
						'context': context,
						'value': obj
					})
				}

				if (tval == 'array') {
					var res = new Array_Viewer({
						'context': context,
						'value': obj
					})
				}
				
				return res;
			}
		}
		
		var res = {
			'String_Viewer': String_Viewer,
			'Number_Viewer': Number_Viewer,
			'Object_Viewer': Object_Viewer,
			'Object_KVP_Viewer': Object_KVP_Viewer,
			'Array_Viewer': Array_Viewer
		}

		return res;
	}
);