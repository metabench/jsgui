/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

define(["../../../jsgui-html-enh", "./factory"], 
	function(jsgui, factory) {
	*/
var jsgui = require('../../../jsgui-html-enh');
var factory = require('./factory');
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;

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
				if (!this.factory) this.factory = factory;

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

					var ctrl = that.factory(v, context);
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

				group_open_close.selectable(this);
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
							prev_comma_space.selectable(v);
							//prev_comma_space.click(function(e) {
								// can we find out which character was clicked?
							//	v.action_select_only();
							//})
						}
					}
				})
			}
		});
module.exports = Array_Viewer;

		//return Array_Viewer;
	//}
//);