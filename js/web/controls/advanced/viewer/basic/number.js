// object viewer

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

define(["../../../../jsgui-html-enh"], 
	function(jsgui) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;

		
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

				/*

				this.add_event_listener('change', function(e) {
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
					span_content.push(value.value());
				}
			},
			'activate': function() {
				this._super();
				var that = this;
				//that.click(function(e) { that.action_select_only() })
				var hover_class = 'bg-light-yellow';

				// I think a selectable behaviour may be good.
				//  Could use .on / bind event
				//  and trigger / raise 'select' / 'deselect'

				// Can have event listeners that listen out for these various things.




				// this looks like a simple selectable behaviour.

				// Making it selectable... selectable using the lower level dom binding well...
				//  Changing how it binds the events to the DOM.

				that.selectable();


				/*

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

				*/

				/*
				var content = this.get('content');
				var span = this.set('span', content.get(0));
				console.log('span ' + tof(span));
				*/

				jsgui.hover_class(this, hover_class);

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

		return Number_Viewer;
	}
);