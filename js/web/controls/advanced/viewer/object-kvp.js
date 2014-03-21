// object viewer

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

define(["../../../jsgui-html-enh", "./factory", "./basic/string"], 
	function(jsgui, factory, String_Viewer) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;

		// Could this be made to swap a different factory in place?
		//  Object_KVP_Editor would then use the 'Editor' factory

		// In init, this.factory = factory.
		//  Then we can substitute the factory.



		var Object_KVP_Viewer = Control.extend({
			'init': function(spec) {
				this._super(spec);
				if (!this.factory) this.factory = factory;
				if (!this.String) this.String = String_Viewer;

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

					/*
					var ctrlKey = new Control({
						'context': this._context
					})
					ctrlKey.set('dom.attributes.class', 'object-kvp-key-viewer');
					*/

					// May be better to use a string Viewer, Editor here, rather than having 3 different controls
					//  for the different parts of it. I think that will make for better encapsulation.


					// A single string control does seem better here.
					//  (editor or viewer)

					// The inner text?

					var ctrl_string_key = new that.String({
						'context': this._context,
						'text': spec.key
					});

					/*


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
					*/


					// Why isnt this rendering?


					var span_key_colon_space = new jsgui.span({
						'context': this._context
					});
					span_key_colon_space.get('content').add(': ');
					//ctrlKey.add(span_key_colon_space);

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
					this.add(ctrl_string_key);


					this.add(span_key_colon_space);


					this.add(ctrlValueContainer);

					this.refresh_internal();
				}

				// Generally, event listeners need some more work.
				//  Maybe a specific way to define them so that they bubble up through a heirachy.
				//  May be best for performance reasons to swith that off by default.





				/*

				this.add_event_listener('change', function(e) {
					// It looks like the e value is not working ok for stringifying it.
					//  Could maybe make a Class that stringifies well for events.

					//console.log('Object_Viewer change e ' + stringify(e));

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
				*/
			},
			'refresh_internal': function() {
				var key = this.get('key');

				var value = this.get('value');

				// May be better to have a String control for the key.
				//  That way it will be easier to make it editable (using the control overrides).

				
				var content = this.get('content');
				//console.log('content ' + stringify(content));

				//var 

				var ctrl_key = content.get(0);
				var ctrl_value = content.get(2);

				var keyContent = ctrl_key.get('content').get(1);

				if (key) {

					var key_value = key.value();
					console.log('key_value ' + key_value);

					keyContent.add(key_value);

					var vcon = ctrl_value.get('content');
					//vcon.set(1, 'hello');
					vcon.clear();

					var ctrl_viewer = this.factory(value, this._context);
					//console.log('ctrl_viewer', ctrl_viewer);
					console.log('tof ctrl_viewer', tof(ctrl_viewer));

					vcon.push(ctrl_viewer);
				}

			},
			'activate': function(el) {

				// could maybe not that the control is active at some stage to prevent reactivation.

				var hover_class = 'bg-light-yellow';

				// not sure why this should get activated again.

				this._super(el);

				//console.log('activate Object_KVP_Viewer ' + this._id());

				var el = el || this.get('dom.el');
				//console.log('el.innerHTML ' + el.innerHTML);

				var cns = el.childNodes;
				//console.log('cns.length ' + cns.length);

				var content = this.get('content');
				//console.log('content.length() ' + content.length());

				var clength = content.length();
				var ctrl_key, ctrl_value, ctrl_comma;

				// Now using a string control for the key.
				//  Need less event handling here I think.


				if (clength == 3 || clength == 4) {
					var content_key = content.get(0);
					//console.log('content_key ' + stringify(content_key));
					//console.log('content_key ' + tof(content_key));
					ctrl_key = this.set('ctrl_key', content_key);
					//console.log('ctrl_key ' + tof(ctrl_key));
					ctrl_value = this.set('ctrl_value', content.get(2));
				}
				if (clength == 4) {
					ctrl_comma = this.set('ctrl_comma', content.get(4));
				}

				// 4...



				if (clength > 4) {
					//console.log('content', content);
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


					
					var group_key_quotes = jsgui.group_hover_class([ctrl_key_open_quote, ctrl_key_close_quote], hover_class);


					var that = this;
					//group_key_quotes.click(function(e) {
					//	that.action_select_only();
					//});
					
					group_key_quotes.click_to_select(this);
					// I think click_to_select works nicely as an API.
					jsgui.hover_class(ctrl_key_content, hover_class);


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
		});

		return Object_KVP_Viewer;
	}
);