// object viewer

// Will be better to use exports from require.


/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

define(["../../../../jsgui-html-enh"], 
	function(jsgui) {
*/

var jsgui = require('../../../../jsgui-html-enh');


		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;


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
				console.log('string viewer init el', el);
				// Not so sure about setting the value just with text.
				//  Perhaps we can link it with a model.
				//  Then when the value is changed in the UI, it gets changed in the model.
				//   Then it can get sent to the server to be updated automatically.
				//   There will be easy to configure model persistance.
				

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
					span.set('dom.attributes.class', 'single-line');
					//span.addClass('single-line');
					//span.set('dom.attributes.contenteditable', 'true');

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

				/*

				this.add_event_listener('change', function(e) {
					//console.log('String_Viewer change e ' + stringify(e));

					// Need to update the UI.

					// Rendering all controls again seems like a way to do it to start with.
					//  Seems easier than matching up the existing ones with what they have changed too.
					//   Maybe the matching will be more efficient though.
					var fieldName = e[0];
					var fieldValue = e[1];

					//console.log('fieldValue ' + stringify(fieldValue));
					console.log('fieldValue ' + tof(fieldValue));

					// then get it to refreshInternalControls.
					// rebuild? build? create?

					that.refresh_internal();
				})
				*/

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
				//console.log('content', stringify(content));
				//console.log('content.length ' + content.length());

				//throw 'stop';

				// And hover for the value...
				var hover_class = 'bg-light-yellow';
				



				// then the content are controls which will get set like field controls.

				var ctrl_open = this.set('open', content.get(0));
				//var span = this.get('span');

				//var span_content = span.get('content');

				var span = this.set('span', content.get(1));
				// get the value from inside the span.

				var value = span.get('dom.el').innerHTML;
				this.set('value', value);




				//var group_content = jsgui.group_hover_class([span], hover_class);
				jsgui.hover_class(span, hover_class);

				var ctrl_close = this.set('close', content.get(2));


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


				// Want the select action to work differently in different places...

				// this.selectable(group_open_close);
				// span.selectable();


				
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
				

				//var ctrl_span_content = this.get('span');

				span.selectable();

				/*
				span.click(function(e) { 
					var ctrl_key = e.ctrlKey;
					if (ctrl_key) {
						span.action_select_toggle();
					} else {
						span.action_select_only();
					}

					//ctrl_span_content.action_select_only();
				})
				*/

			}
		});

		// Can use an exports object?
		
module.exports = String_Viewer;

		//return String_Viewer;
	//}
//);