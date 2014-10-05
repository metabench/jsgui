// object viewer

/*

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

define(["../../../jsgui-html-enh", "./object-kvp", "./factory"], 
	function(jsgui, Object_KVP_Viewer, factory) {
*/

var jsgui = require('../../../jsgui-html-enh');
var Object_KVP_Viewer = require('./object-kvp');
var factory = require('./factory');

		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;

		// The Object KVP will need to use the factory.
		//  Maybe the factory will need to be side-loaded?
		//   Or the factory can handle side-loading itself?
		//    That may be easier in order to keep the sideloading in one module.
		//     Then could better encapsulate / modularise the sideloading.
		//     And remove it for deployement.


		// This will need to side-load other references.
		//  Not sure exactly when is best to do that.
		//  Hopefully it can be done inside the module, loaded as the module loads?
		//  Or does it need to be the first time such an object is used?

		/*
		var _Object_KVP;

		var get_Object_KVP = function() {
			if (_Object_KVP) {
				return _Object_KVP;
			} else {
				_Object_KVP = require("./object-kvp");
				return _Object_KVP;
			}
		}
		*/



		// Maybe make this an Array_Viewer too?
		var Object_Viewer = Control.extend({

			// Maybe should put this into a form, so that it does a form post.
			//  That could possibly be disabled.

			'init': function(spec) {
			    var make = this.make;
			    
				
				this._super(spec);

				if (!this.factory) this.factory = factory;
				if (!this.Object_KVP) this.Object_KVP = Object_KVP_Viewer;


				this.set('dom.attributes.class', 'object-viewer');
				this.__type_name = 'object_viewer';
				var req = this._context.req;

				if (is_defined(spec.value)) {

					// Does that value become a data object?
					//  Want to listen to change events on it.

					this.set('value', spec.value);
				}

				// It may not have been initialised with a value?
				//  Perhaps it should have been.
				//  Could send a data-jsgui-value property.
				//   Or could reconstruct it from the DOM.

				// Anyway, there needs to be a value in the Control that can notice when it gets changed.





				if (!spec.el) {
					var ctrlOpen = new Control({
						'context': this._context
					})
					ctrlOpen.set('dom.attributes.class', 'object-open');
					// Want to make it send the controls ids in the html.
					// Sending over the IDs of controls that gets activated seems important.
					//  Not in all cases, but in cases where controls need to interact with each other.
					//  Possibly for internal interaction.

					//ctrlOpen.set('dom.attributes.

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

				// on this changing?
				

				/*

				this.add_event_listener('change', function(e) {
					
					console.log('Object_Viewer change');
					console.log('Object_Viewer change e ' + stringify(e));
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

				*/

				// when the object changes, we re-render.
				//  Not sure about re-rendering the whole thing though.

			},
			'refresh_internal': function() {
				//console.log('object refresh_internal');
				//console.log('this._context', this._context);

				var value = this.get('value');

				var inner = this.get('inner');
				//console.log('object viewer refresh_internal ');
				//console.log('value ' + stringify(value));

				inner.clear();
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

					// and want it so that we can either get the kvp viewer or editor.
					//  This needs to be overridable in a subclass.

					// .Object_KVP
					//  viewer or editor.


					//var kvp_viewer = new Object_KVP_Viewer({
					var kvp_viewer = new that.Object_KVP({
						'context': context,
						'key': i,
						'value': v
					})
					var cInternal = that.factory(v, context);
					inner.add(kvp_viewer);
					first = false;
					prev_kvp = kvp_viewer;
				});
			},


			// Could put this in control or enhanced control?
			

			'activate': function() {

				console.log('activate Object_Viewer');
				this._super();

				var ctrl_open = this.get('open');
				var ctrl_close = this.get('close');

				var ctrl_inner = this.get('inner');

				// Very nice to have this so concise now.
				var hover_class = 'bg-light-yellow';
				var group_open_close = jsgui.group_hover_class([ctrl_open, ctrl_close], hover_class);

				var that = this;
				// then for clicking on either the open or the close tag, should do the select actions for a selectable.


				group_open_close.selectable(this);
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
				});


				// This needs to listen to its value changing.

				/*
				this.get('value').on('change', function(e_change) {
					console.log('object viewer value change');
				});

				
				*/

				this.on('change', function(e_change) {
					console.log('object viewer change');

					// rerender the html!!!
					that.refresh_internal();

				});

				// should set up bound event handlers.

				console.log('this._bound_events', this._bound_events);

				//throw 'stop';

			}
		});
module.exports = Object_Viewer;

		//return Object_Viewer;
	//}
//);