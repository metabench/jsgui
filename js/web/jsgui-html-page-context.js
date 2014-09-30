
/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


define(["./jsgui-html-core"], 
	function(jsgui) {
	    */

        var jsgui = require('./jsgui-html-core');
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control, Class = jsgui.Class;

		var fp = jsgui.fp;
		var group = jsgui.group;

		var get_window_size = jsgui.get_window_size;

		
		// this is the enhanced HTML module.

		var Page_Context = Class.extend({
	        'init': function (spec) {
	            spec = spec || {};
	            if (spec.browser_info) {
	                this.browser_info = spec.browser_info;
	            };

	            if (spec.resource_pool) {
	            	this.resource_pool = spec.resource_pool;
	            }

	            /*
	    		this.itemIndex = function(obj, item) {
	    		    var c = -1;
	    		    $.each(obj, function(i, n) {
	    		        if (n === obj) c = i;
	    		    });
	    		    return c;
	    		};
	    		*/

	            this.get_vector_methodology = function () {
	                if (this.browser_info.ie) {
	                    return 'vml';
	                } else {
	                    return 'svg';
	                }
	            };

	            /*
	            var qids = [],
	                iQid = 1,
	                qid = function () {
	                    var res = 'qid_' + iQid;
	                    iQid++;
	                    return res;
	                }, typedIds = {}, iTypedIds = {}, typed_id = function (str_type) {
	                    if (typeof iTypedIds[str_type] === 'undefined') {
	                        iTypedIds[str_type] = 1;
	                    }
	                    var res = iTypedIds[str_type];
	                    iTypedIds[str_type] = iTypedIds[str_type] + 1;
	                    return res;
	                };
	            this.qid = qid;
	            */


	            // Copied from Server.Page_Context

	            var map_new_ids = {};
	            // and have the objects registered within the context too.
	            
	            var map_objects = {};
	            
	            var _get_new_typed_object_id = function(type_name) {
	                if (!is_defined(map_new_ids[type_name])) {
	                    map_new_ids[type_name] = 0;
	                }
	                //if (!is_defined(map_new_ids[type_name]) {
	                //  map_new_ids[type_name] = 0;
	                //}
	                var res = type_name + '_' + map_new_ids[type_name];
	                map_new_ids[type_name]++;
	                return res;
	            }
	            
	            this.new_id = _get_new_typed_object_id;

	            this.set_max_ids = function(map_max_ids) {
	                each(map_max_ids, function(i, v) {
	                    map_new_ids[i] = v + 1;
	                })
	            }


	            /* teIds = {}, iteIds = {}, typed_enhancement_id = function(str_type) {
	    			return str_type + '_' + typed_enhancement_int(str_type);
	    		}; */

	            //this.teIds = teIds;
	            //this.ctrls_by_id = {};
	            //this.cl_abs = {}; // abstract controls for the client

	            // typed enhancements may be retired. Not actively using them late July 2011 but they could they be within the lower level workings?
	            /*
	    		var typed_enhancement_int = function(str_type) {
	    			if (typeof iteIds[str_type] === 'undefined') {
	    				iteIds[str_type] = 0;
	    			};
	    			//console.log('');
	    			//console.log('** str_type ' + str_type);
	    			
	    			var res = iteIds[str_type];
	    			iteIds[str_type] = iteIds[str_type] + 1;
	    			return res;
	    		};

	    		this._advance_type_id = function(str_type, quantity) {
	    			if (typeof quantity == 'undefined') quantity = 1;
	    			iteIds[str_type] = iteIds[str_type] || 0;
	    			iteIds[str_type] = iteIds[str_type] + quantity;
	    		};
				*/
	            /*
	    		this.ensure_ctrl_id = function(ctrl) {
	    			ctrl._ = ctrl._ || {};
	    			
	    			//console.log('ensure_ctrl_id ctrl._ ' + stringify(ctrl._));
	    			
	    			if (typeof ctrl._.id == 'undefined') {
	    				// ctrl._.class_name
	    				
	    				
	    				var id = typed_enhancement_id(ctrl._.type_name);
	    				ctrl._.id = id;
	    			}
	    			return ctrl._.id;
	    		};
	    		// may be retired... could be behaviours / surfaces in specs.
	    		this.apply_enhancement_id_spec = function(spec, ctrl) {
	    			
	    			// specifically what does this do?
	    			
	    			// The control will have another DOM attribute set
	    			// This is only for when composing an enhanced control on the server?
	    			// jsgui_e_id
	    			
	    			spec.dom = spec.dom || {};
	    			spec.dom.attributes = spec.dom.attributes || {};
	    			var tName = ctrl.typeName || 'misc';
	    			var tei = typed_enhancement_int(tName);
	    			spec.dom.attributes['jsgui_e_id'] = String(tei);
	    			return [tName, tei];
	    		};
				*/

	            /*
	            this.get_spec = function (spec) {
	                spec = spec || {};
	                spec.page_context = this;
	                return spec;
	            };
	            */

	            // Give it the abstract component to make?
	            //  So the abstract constructor gets called, and then the abstract instance goes into the make function.

	            // contextify - contextifies a recently made item.

	            //this.make = function()

	            var map_Controls = this.map_Controls = {};
	            //  they are constructors

	            var map_controls = this.map_controls = {};

	            map_Controls['control'] = Control;

	        },
	        'make': function(abstract_object) {
	            if (abstract_object._abstract) {
	                //var res = new 
	                // we need the constructor function.

	                var constructor = abstract_object.constructor;
	                //console.log('constructor ' + constructor);

	                
	                //throw 'stop';

	                var aos = abstract_object._spec;

	                // could use 'delete?'
	                aos.abstract = null;
	                aos.context = this;

	                //console.log('abstract_object._spec ' + stringify(abstract_object._spec));
	                // Not sure it is creating the right constructor.


	                var res = new constructor(abstract_object._spec);
	                return res;
	            } else {
	                throw 'Object must be abstract, having ._abstract == true'
	            }
	        },
	        'update_Controls': fp(function(a, sig) {
	            //console.log('update_Controls sig ' + sig);
	            if (sig == '[o]') {
	                // a map of keys and constructors values.
	                var o = a[0];
	                var map_Controls = this.map_Controls;
	                each(o, function(name, Constructor) {
	                    name = name.toLowerCase();
	                    //console.log('name ' + name);
	                    map_Controls[name] = Constructor;
	                });

	            }
	            if (sig == '[s,f]') {
	                var name = a[0];
	                var Constructor = a[1];
	                name = name.toLowerCase();
	                //console.log('name ' + name);
	                this.map_Controls[name] = Constructor;
	            }
	        }),

	        register_control: function(control) {
	        	// Put it into the map of IDs

	        	//console.log('register_control');

	        	// Not sure how useful registration of all controls will be.
	        	//  Probably would not be a problem, just it will take memory and CPU cycles.


	        	var id = control._id();
	        	//console.log('id', id);

	        	this.map_controls[id] = control;

	        },



	        //'set_max_ids': function(map_max_ids) {

	        //},

	        // begin_drag?

	        // can this be plumbed into the recently created events?
	        //  we tell it that the drag is starting.

	        // Want to tell the page context about beginning different types of drags?

	        // Want the page context to be notified whenever a drag begins.
	        //  If there is a selection scope then it's dragging those items.

	        // Otherwise it could be dragging a control.
	        //  Want the control dragging to call events here, so the Page_Context knows where controls are being dragged from / to.




	        // This is currently about beginning a drag with a selection scope, but we may just want to be dragging a single control
	        //  or controls not to do with a selection_scope.

	        // In the case of there being a selection scope, we want to drag around something that represents the selection.

	        // With direct drag, or dragging a handle, we don't have this copy of the selection scope.

	        // drag_selection_scope_shallow_copy

	        // May want to refactror things to have more behaviours and drag abstractions.
	        //  However, working more on the style properties first makes more sense.

	        // I'll do some more without major further abstractions.
	        //  

	        // Defining the repositioning...
	        //  could have that extnedable.

	        // then we have the dragging of a control.
	        //  Moves the control, does not leave a placeholder.

	        // Need to be notified of it?
	        //  Control may be dockable.

	        // (notify)
	        'begin_drag_ctrl': function(e_begin, ctrl) {
	            // Though the ctrl should probably go in the event object - maybe need to formalise an API.

	            // Different types of drag could be made modular to make builds smaller.
	            //  For the moment need to add functionality then work on build size later.





	        },

	        // Make this an Evented_Class?

	        'raise': function(event_name) {
	            // need to access the object's bound events.

	            //this.__bound_events = this.__bound_events || {};

	            // but which context?

	            //  the context of the event raiser?

	            var a = arguments;
	            var a2 = [];
	            if (a.length > 1) {
	                for (var c = 1; c < a.length; c++) {
	                    a2.push(a[c]);
	                }
	            }

	            if (this.__bound_events) {
	                var corresponding_events = this.__bound_events[event_name];
	                for (var c = 0, l = corresponding_events.length; c < l; c++) {
	                    if (a2.length > 0) {
	                        corresponding_events[c].apply(this, a2);
	                    } else {
	                        corresponding_events[c].apply(this);
	                    }
	                    
	                }
	            }

	        },

	        // listen function as well.
	        //  to listen for an event, it's like add_event_handler.

	        // may change that to listen.

	        'listen': function(event_name, handler) {
	            this.__bound_events = this.__bound_events || {};
	            this.__bound_events[event_name] = this.__bound_events[event_name] || [];
	            this.__bound_events[event_name].push(handler);
	        },


	        'move_drag_ctrl': function(e_move, ctrl) {
	            // Though the ctrl should probably go in the event object - maybe need to formalise an API.

	            // Different types of drag could be made modular to make builds smaller.
	            //  For the moment need to add functionality then work on build size later.

	            //console.log('move_drag_ctrl ', e_move);
	            
	            // maybe tify up the params so there is a move_offset value.
	            //  perhaps we dont need it and it makes unnecessary calculation.

	            // anyway, use the clientx and client y

	            // should maybe measure the client area?
	            //  or do that once and do it again on resize?

	            // Should be able to get the client size from the Page_Context.
	            //  Page_Context is turning out to be very versitile on the client too, nice that it's got similarities on the server
	            //  but used very differently.


	            // find out where we are within the client window.

	            // get_window_size



	            var window_size = get_window_size();



	            //console.log('Window width = ' + winW);
	            //console.log('Window height = ' + winH);

	            // find how close the clientX / clientY is to the sides

	            // could even have two different distances / ranges for
	            //  1) anchor to position
	            //  2) anchor to poisition and hide, only showing with mouseover of small region.

	            // find how close to edges...

	            var from_left, from_top, from_right, from_bottom;



	            var clientX = e_move.clientX;
	            var clientY = e_move.clientY;

	            // see if it's at the top or bottom...
	            //  would be nice to have different distances, so halfway to the margin anchors it in a way that it hides itself.



	            var margin = 64;

	            var is_left = clientX <= margin;
	            var is_top = clientY <= margin;

	            var is_right = clientX >= window_size[0] - margin;
	            var is_bottom = clientY >= window_size[1] - margin;

	            // need more generic event binding for objects.

	            // listen
	            // raise




	            // then for the combinations...
	            //console.log('is_top ' + is_top);
	            if (is_top) {
	                // raise the event...

	                // then some things will listen for it.
	                this.raise('drag-ctrl-top');

	            } else if (is_bottom) {
	                // raise the event...

	                // then some things will listen for it.
	                this.raise('drag-ctrl-bottom');

	            } else if (is_left) {
	                // raise the event...

	                // then some things will listen for it.
	                this.raise('drag-ctrl-left');

	            } else if (is_right) {
	                // raise the event...

	                // then some things will listen for it.
	                this.raise('drag-ctrl-right');

	            } else {
	                this.raise('drag-ctrl-no-zone');

	            }


	        },

	        'end_drag_ctrl': function(e_end, ctrl) {
	            // raise the event...
	            this.raise('drag-ctrl-end', e_end, ctrl);


	        },

	        'drop_ctrl': function(ctrl, zone) {
	            //console.log('page context drop control ctrl ' + ctrl);
	            //console.log('zone ' + zone);

	            if (this.full_window) {
	                // anchor the control in that zone.

	                this.anchor(ctrl, zone);

	                // Basically we need to anchor one control inside another.
	                //  The anchor zone will be a part of the grid_9 (or other mechanism)


	            }
	        },

	        'anchor': function(ctrl, zone) {
	            console.log('page context anchor ');

	            if (this.full_window) {
	                var fw = this.full_window;

	                // and then does the full window control have a grid_9?

	                var g9 = fw.get('grid_9');
	                //console.log('g9 ' + g9);

	                if (g9) {

	                    // Then the control will know its anchored.
	                    //  Dragging that control will unanchor it.

	                    // anchor the control to a position within that g9.
	                    //  Basically just put the control in place.
	                    //  Could do ctrl.anchor(g9, zone);

	                    // Generally won't be anchoring g9s to other things, but don't want to imply that in the fn name.
	                    //  g9.anchor_ctrl()

	                    // may have ctrl.anchor_ctrl, and anchoring is basically putting inside, but it sets it as being
	                    //  'anchored'.

	                    g9.anchor_ctrl(ctrl, zone);


	                }

	                var fwtn = fw.__type_name;
	                //console.log('fwtn ' + fwtn);

	            }
	        },

	        // Ending a control drag.
	        //  If we are to dock the control somewhere, we have some docking code that does this that can be called separately from the
	        //  event.


	        // more than notify, this does some UI too.
	        'begin_drag_selection_scope': function(e_begin, selection_scope) {

	            // drag begin event, then what we are dragging.
	            //  we could be dragging a selection scope
	            //  just a single control
	            //  a copy of a control.

	            // going for some specific names to begin with may help.

	            // rename this begin_selection_scope_drag





	            // different drag modes...

	            //  drag-shallow-copy
	            //  drag-ctrl

	            // drag-shallow-copy-begin

	            // I think awareness of the drag mode will help.

	            // The selection scope may not be relevant when dragging a window.
	            //  However, we could count one item as being selected in the drag?








	            console.log('page context drag selection_scope ' + selection_scope);

	            var map_selected_controls = selection_scope.map_selected_controls;
	            //console.log('map_selected_controls ' + stringify(map_selected_controls));

	            // true keys...

	            var arr_selected = jsgui.true_vals(map_selected_controls);
	            console.log('arr_selected.length ' + arr_selected.length);

	            // make shallow copies of these selected controls.

	            var shallow_copies_selected = jsgui.shallow_copy(arr_selected);


	            this.drag_selected = arr_selected;

	            var ctrl_abs = this.make(Control({

	            }));

	            ctrl_abs.add(shallow_copies_selected);

	            var screenX = e_begin.screenX;

	            //console.log('screenX ' + screenX);
	            var screenY = e_begin.screenY;

	            var clientX = e_begin.clientX;
	            var clientY = e_begin.clientY;


	            //ctrl_abs.set('dom.attributes.style.position', 'absolute');
	            //ctrl_abs.set('dom.attributes.style.height', '200px');
	            //ctrl_abs.set('dom.attributes.style.width', '320px');
	            //ctrl_abs.set('dom.attributes.style.background-color', '#ABCDEF');

	            // Could set its class or have better way of doing an inline style.

	            ctrl_abs.set('dom.attributes.style', 'position: absolute; left: ' + clientX + 'px; top:' + clientY + 'px; height: 200px; width: 320px; background-color: #EEEEEE');
	            var html = ctrl_abs.all_html_render();

	            var el_ctr = document.createElement('div');
	            el_ctr.innerHTML = html;

	            var el_abs = el_ctr.childNodes[0];

	            document.body.appendChild(el_abs);

	            ctrl_abs.set('el', el_abs);

	            // within the context, we can make new controls and put them in the document.
	            // an absolutely positioned div.

	            this.ctrl_abs = ctrl_abs;


	            //throw 'stop';
	        },



	        'move_drag_selection_scope': function(e_move) {
	            console.log('page context move_drag_selection_scope');

	            // Don't want this to be the case with all drag moves...
	            //  We may be moving the actual item.




	            var clientX = e_move.clientX;
	            var clientY = e_move.clientY;

	            // definitely would be useful to have the abstraction that covers individual style properties.
	            var style = 'position: absolute; left: ' + clientX + 'px; top:' + clientY + 'px; height: 200px; width: 320px; background-color: #EEEEEE'
	            //console.log('style ' + style);
	            var el = this.ctrl_abs.get('el');
	            //console.log('el ' + el);
	            el.style.cssText = style;


	        },
	        'end_drag_selection_scope': function(e_end) {
	            if (this.ctrl_abs) {
	                this.ctrl_abs.remove();
	                this.ctrl_abs = null;
	            }
	        },

	        'ensure_dock_placeholder': function(pos) {
	            //console.log('Page Context ensure_dock_placeholder ' + pos);

	            var fw = this.full_window;

	            if (fw) {
	                fw.ensure_dock_placeholder(pos);
	            }
	        }

	    });

        module.exports = Page_Context;
		//return Page_Context;
	//}
//);




