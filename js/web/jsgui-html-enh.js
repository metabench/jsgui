if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

// Needs a general Page_Context

// so enh includes the page_context?

// Really not sure about where in the heirachy the Page_Context is. Many controls need it.

// May be easier if these enhancements did away with the page context. May need to work on the server too.

// However, this I think was intended only for the client anyway.

//define(["./jsgui-html-core", "./client-page-context"], 
//define(["./jsgui-html-core", "./controls/advanced/context-menu"],

// Handle circular dependencies...



//define(["./jsgui-html-core"],

//define(["./jsgui-html-core", "./controls/advanced/context-menu"],
	//function(jsgui, Context_Menu) {

        var jsgui = require('./jsgui-html-core');

        // don't think this can have context menu so easily here.
        //var Context_Menu = require('./controls/advanced/context-menu');
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var fp = jsgui.fp;
		var group = jsgui.group;
		var str_arr_mapify = jsgui.str_arr_mapify;
		var map_Controls = jsgui.map_Controls;

		//var Context_Menu;

        // Don't include context-menu in enh...
        //  Or find a different way to include it
        //  Have different enh-levels, eg most of it is enh-1
        //  then context-menu is in enh-2.
        //  html-enh contains both 1 and 2, and future levels if they are made.


        // Don't like what follows - it's tricky. May make it hard to recompile / build the code.
        //  And would be unnecessary when the context menu has been localised.


        /*

		var ensure_Context_Menu_loadedensure_Context_Menu_loaded = function(callback) {
			//console.log('ensure_Context_Menu_loaded');

            // Does not include web/ here
            //  Not sure if how this behaviour is different on the client.

			require(['./controls/advanced/context-menu'], function(_Context_Menu) {
				//console.log('_Context_Menu', _Context_Menu);
				Context_Menu = _Context_Menu;
    			callback(Context_Menu);
    		});
		}

		*/


		//require(['./controls/advanced/context-menu'], function(Context_Menu) {		
    	//	
    	//});

		var hover_class = fp(function(a, sig) {
			//console.log('hover_class sig ' + sig);
			if (sig == '[c,s]') {
				var ctrl = a[0];
				var hover_class = a[1];
				ctrl.hover(function(e_in) {
					ctrl.add_class(hover_class);
				}, function(e_out) {
					ctrl.remove_class(hover_class);
				});
			}
		});

		// this is the enhanced HTML module.

		var group_hover_class = fp(function(a, sig) {
			// Could possibly recategorise into having an array if the sig as a bunch of objects of one type and then 
			//  a string.

			//poly2(a, sig);

			if (sig == '[a,s]') {
				// An array of items to put into the group.

				var res = group(a[0]);
				//console.log('res ' + tof(res));

				var hover_class = a[1];
				res.hover(function(e_in) {
					res.add_class(hover_class);
				}, function(e_out) {
					res.remove_class(hover_class);
				})

				return res;
			}

		});


	    var get_window_size = function() {
	        var winW, winH;
	        if (document.body && document.body.offsetWidth) {
	            winW = document.body.offsetWidth;
	            winH = document.body.offsetHeight;
	        }
	        if (document.compatMode=='CSS1Compat' && document.documentElement && document.documentElement.offsetWidth ) {
	            winW = document.documentElement.offsetWidth;
	            winH = document.documentElement.offsetHeight;
	        }
	        if (window.innerWidth && window.innerHeight) {
	            winW = window.innerWidth;
	            winH = window.innerHeight;
	        }
	        return [winW, winH];
	    }


		var findPos = function(obj) {
	        var curleft = curtop = 0;
	        if (obj.offsetParent) {
	            do {
	                curleft += obj.offsetLeft;
	                curtop += obj.offsetTop;
	            } while (obj = obj.offsetParent);
	            return [curleft,curtop];
	        }
	    }


	    // Make it a Data_Object so it can respond to events?
	   	var Selection_Scope = jsgui.Data_Object.extend({
	    
	    //var Selection_Scope = jsgui.Class.extend({
	        'init': function(spec) {
	            // has its control.

	            // various controls point to it.

	            // has various methods to do with selecting and selecting objects
	            if (spec.control) this.control = spec.control;

	            // Needs to be a list / map of all controls that are selected.

	            // map of selected controls by id?

	            //  also need to be able to go through the list of controls.

	            this.map_selected_controls = {};

	            // set the items by their id to point to the control.
	            //  the control will know its index within its parent, can look up more info there.




	        },
	        'select_only': function(ctrl) {
	            //console.log('Selection_Scope select_only ' + ctrl._id());

	            // remove the selected class from all that are currently selected (except the target ctrl).
	            //console.log('this.map_selected_controls ', this.map_selected_controls);
	            each(this.map_selected_controls, function(i, v) {

	                if (v && v !== ctrl) {
	                    v.set('selected', false);
	                    v.remove_class('selected');

	                    //console.log('should have deselcted ' + v._id())
	                }
	            })

	            this.map_selected_controls = {};

	            this.map_selected_controls[ctrl._id()] = ctrl;

	            // and then tell the control that it's selected.

	            // could possibly set a CSS flag.
	            ctrl.set('selected', true);
	            ctrl.add_class('selected');

	            this.trigger('change');



	        },

	        // deselect controls internal to a control.

	        // When selecting a control, we want to make it so that controls inside it, in the same selection context are not selected.
	        //  The Selection Scope does a fair bit of the management of the selections.

	        'deselect_ctrl_content': function(ctrl) {
	            var cs = ctrl.get('selection_scope');
	            var msc = this.map_selected_controls;
	            var that = this;
	            ctrl.get('content').each(function(i, v) {
	                var tv = tof(v);
	                //console.log('tv ' + tv);

	                if (tv == 'control') {
	                    v.remove_class('selected');
	                    v.set('selected', false);

	                    var id = v._id();
	                    if (msc[id]) msc[id] = false;

	                    that.deselect_ctrl_content(v);
	                }
	            })
	            //console.log('msc ', msc);
	            this.trigger('change');
	            //throw 'stop';
	        },



	        'select_toggle': function(ctrl) {
	            //console.log('');
	            //console.log('select_toggle');
	            var sel = ctrl.get('selected');
	            //console.log('tof(sel) ' + tof(sel));

	            var msc = this.map_selected_controls;
	            var id = ctrl._id();
	            if (!sel) {
	                

	                var sel_anc = ctrl.find_selected_ancestor_in_scope();

	                if (sel_anc) {
	                    console.log('1) not selecting because a selected ancestor in the selection scope has been found.');
	                } else {
	                    ctrl.set('selected', true);
	                    // Check for a selected ancestor control in the scope.

	                    this.deselect_ctrl_content(ctrl);

	                    //  can try an iterate_ancestors function.

	                    //  iterate_ancestors_in_selection_scope
	                    //   looking for selected ancestor.

	                    // find_selected_ancestor_in_scope

	                    ctrl.add_class('selected');
	                    msc[id] = ctrl;
	                }

	                
	            } else {
	                var tsel = tof(sel);
	                //console.log('tsel ' + (tsel))
	                if (tsel == 'data_value') {
	                    var val = sel.get();
	                    //console.log('val ' + val);
	                    if (val) {
	                        ctrl.remove_class('selected');
	                        ctrl.set('selected', false);
	                        msc[id] = false;
	                    } else {
	                        var sel_anc = ctrl.find_selected_ancestor_in_scope();

	                        if (sel_anc) {
	                            console.log('2) not selecting because a selected ancestor in the selection scope has been found.');
	                        } else {
	                            ctrl.set('selected', true);
	                            // Check for a selected ancestor control in the scope.
	                            this.deselect_ctrl_content(ctrl);
	                            //  can try an iterate_ancestors function.

	                            //  iterate_ancestors_in_selection_scope
	                            //   looking for selected ancestor.

	                            // find_selected_ancestor_in_scope

	                            ctrl.add_class('selected');
	                            msc[id] = ctrl;
	                        }
	                    }
	                    //
	                }
	                if (tsel == 'boolean') {

	                    if (sel) {
	                        ctrl.remove_class('selected');
	                        ctrl.set('selected', false);
	                        msc[id] = false;
	                    } else {
	                        var sel_anc = ctrl.find_selected_ancestor_in_scope();

	                        if (sel_anc) {
	                            console.log('2) not selecting because a selected ancestor in the selection scope has been found.');
	                        } else {
	                            this.deselect_ctrl_content(ctrl);
	                            ctrl.set('selected', true);

	                            // Check for a selected ancestor control in the scope.

	                            //  can try an iterate_ancestors function.

	                            //  iterate_ancestors_in_selection_scope
	                            //   looking for selected ancestor.

	                            // find_selected_ancestor_in_scope

	                            ctrl.add_class('selected');
	                            msc[id] = ctrl;
	                        }
	                    }

	                }
	            }
	            this.trigger('change');
	            //throw 'stop';

	        }
	    })

		// Some of these will need to get a bit more complex with options, but they will also generally be transferrable among jsgui controls.

		// The outermost object will have selection scope
		//  That means that within it when there is a deselect_all command it deselects within that scope.

		// We could have an enhanced control too.

		// Perhaps replace the basic control in this case, so an upgraded control is always used.
		//  Would have more functionality to do with windows, setting up a control so that it's a window, with docking capability.

		// Perhaps more client-side capabilities should be here, like activate.

		var mapDomEventNames = {
            'change': true,

            'click': true,
            'mousedown': true,
            'mouseup': true,
            'mousemove': true,
            'mouseover': true,
            'mouseout': true,
            'blur': true,
            'focus': true,
            'keydown': true,
            'keyup': true,
            'keypress': true,
            'contextmenu': true,

            'touchstart': true,
            'touchmove': true,
            'touchend': true,

            'abort': true,
			'canplay': true,
			'canplaythrough': true,
			'durationchange': true,
			'emptied': true,
			'ended': true,
			'error': true,
			'loadeddata': true,
			'loadedmetadata': true,
			'loadstart': true,
			'pause': true,
			'play': true,
			'playing': true,
			'progress': true,
			'ratechange': true,
			'seeked': true,
			'seeking': true,
			'stalled': true,
			'suspend': true,
			'timeupdate': true,
			'volumechange': true,
			'waiting': true

        };

		Control = jsgui.Control = jsgui.Control.extend({
			'fields': {
				'selection_scope': Object
			},

			'init': function(spec) {
				this._super(spec);
			},

			'bcr': fp(function(a, sig) {
	            //console.log('sig', sig);
	            if (sig == '[]') {
	                var el = this.get('dom.el');

	                
	                var bcr = el.getBoundingClientRect();
	                var res = [[bcr.left, bcr.top], [bcr.right, bcr.bottom], [bcr.width, bcr.height]];

	                return res;
	            }

                // However, need to take account of the padding and the class.

                // instead of getting the bcr, we could ge the style('width')?
                //  which would actually get the width style value?

                // Or we could get the bcr, and then subtract the padding as well.

                // ctrl.padding
                //  seems like a useful enhancement syntax to have
                //  would be useful in keeping things in proportion and accounting for the padding.

                // Probably want to be getting the computed style from the browser.
                //  Some info is within CSS and effects things through that.
                //  Sometimes in the JS we need to read from the screen because values have been calculated by the css system.
                //  Want this to be somewhat responsive to the CSS that is written.









                if (sig == '[a]') {
                    console.log('bcr sig arr');

                    var bcr_def = a[0];
                    var pos = bcr_def[0];
                    var br_pos = bcr_def[1];
                    var size = bcr_def[2];

                    // then we actually want to set the css.

                    this.style({
                        'position': 'absolute',
                        'left': pos[0] + 'px',
                        'top': pos[1] + 'px',
                        'width': size[0] + 'px',
                        'height': size[1] + 'px'
                    })



                    //throw 'stop';
                }

	        }),

            'computed_style': fp(function(a, sig) {
                if (sig == '[s]') {
                    // Should only work on the client.

                    var property_name = a[0];

                    var x = this.get('dom.el');

                    if (x.currentStyle)
                        var y = x.currentStyle[styleProp];
                    else if (window.getComputedStyle)
                        var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(property_name);
                    return y;


                }
            }),

            'padding': fp(function(a, sig) {
                if (sig == '[]') {
                    // read the padding.
                    //  the computed style is probably what we are after.

                    // Perhaps a computed_style function would help too, making the code clearer that this padding function uses that.

                    // Perhaps just calling 'style' should get the computed style while it's in the browser.
                    //  There would be both the computed properties and the set properties.

                    // Perhaps we should always refer to computed style or cstyle
                    //  Avoid confusion with the padding property that can be set
                    //

                    var left, top, right, bottom;

                    var c_padding = this.computed_style('padding');
                    console.log('c_padding', c_padding);

                    var s_c_padding = c_padding.split(' ');
                    console.log('s_c_padding.length', s_c_padding.length);

                    if (s_c_padding.length == 3) {
                        // top, right, bottom
                        top = parseInt(s_c_padding[0], 10);
                        right = parseInt(s_c_padding[1], 10);
                        bottom = parseInt(s_c_padding[2], 10);

                        // returns as l, t, r, b

                        //return [0, top, right, bottom];

                        return [0, top, right, bottom];

                    }





                }
            }),

            'border': fp(function(a, sig) {
                if (sig == '[]') {
                    // read the padding.
                    //  the computed style is probably what we are after.

                    // Perhaps a computed_style function would help too, making the code clearer that this padding function uses that.

                    // Perhaps just calling 'style' should get the computed style while it's in the browser.
                    //  There would be both the computed properties and the set properties.

                    // Perhaps we should always refer to computed style or cstyle
                    //  Avoid confusion with the padding property that can be set
                    //

                    var left, top, right, bottom;

                    var c_border = this.computed_style('border');
                    console.log('c_border', c_border);

                    throw 'stop';

                    /*

                    var s_c_padding = c_padding.split(' ');
                    console.log('s_c_padding.length', s_c_padding.length);

                    if (s_c_padding.length == 3) {
                        // top, right, bottom
                        top = parseInt(s_c_padding[0], 10);
                        right = parseInt(s_c_padding[1], 10);
                        bottom = parseInt(s_c_padding[2], 10);

                        // returns as l, t, r, b

                        //return [0, top, right, bottom];

                        return [0, top, right, bottom];

                    }
                    */





                }
            }),
            'border_thickness': fp(function(a, sig) {
                if (sig == '[]') {
                    // read the padding.
                    //  the computed style is probably what we are after.

                    // Perhaps a computed_style function would help too, making the code clearer that this padding function uses that.

                    // Perhaps just calling 'style' should get the computed style while it's in the browser.
                    //  There would be both the computed properties and the set properties.

                    // Perhaps we should always refer to computed style or cstyle
                    //  Avoid confusion with the padding property that can be set
                    //

                    var left, top, right, bottom;

                    var c_border = this.computed_style('border');
                    console.log('c_border', c_border);

                    //var s_c_border = c_border.split(' ');
                    //console.log('s_c_border', s_c_border);

                    // Can't really split it by space.
                    //  some of the terms in the bracket include a space.
                    //  could first do a regex to change ', ' to ','

                    var b2 = c_border.split(', ').join('');
                    var s_c_border = b2.split(' ');
                    console.log('s_c_border', s_c_border);

                    // then can get the thickness from the first one.

                    var thickness = parseInt(s_c_border[0], 10);

                    // the 4 different thicknesses?

                    return thickness;













                    //throw 'stop';

                    /*

                     var s_c_padding = c_padding.split(' ');
                     console.log('s_c_padding.length', s_c_padding.length);

                     if (s_c_padding.length == 3) {
                     // top, right, bottom
                     top = parseInt(s_c_padding[0], 10);
                     right = parseInt(s_c_padding[1], 10);
                     bottom = parseInt(s_c_padding[2], 10);

                     // returns as l, t, r, b

                     //return [0, top, right, bottom];

                     return [0, top, right, bottom];

                     }
                     */





                }
            }),

            'cover': fp(function(a, sig) {
                // Makes a cover to this control.
                //  Relatively positioned div as first child (if it is not there already)
                //  Absolutely positioned within that relative div.

                // insert a new relative div?
                //  relative for layout?





            }),

            'ghost': fp(function(a, sig) {

            }),

            // absolute_ghost_clone
            'absolute_ghost_clone': function() {
                // find out what type the control is...

                // And would either have lower opacity - or be 'ghosted' out with a cover.
                //  Could have an internal cover that takes up the space.
                //  Absolute positioning, measured to take up the internal space.
                //  Would require a relative div inside?
                //  Could create a relative div as the first child.
                //   relative size 0, in the top left, then used for absolute positioning of the cover layer.


                // this.cover
                //  and would get access to the cover control as well.
                //  should be absolutely positioned, and above the other items in the control.

                // this.cover(false);

                // this.ghost()
                //  makes a ghost cover.











                var type_name = this.__type_name;
                var id = this._id();
                var context = this._context;

                // spin up a new control, using they type of controls.

                console.log('context', context);

                var ctrl_document = context.ctrl_document;

                console.log('ctrl_document', ctrl_document);
                console.log('type_name', type_name);

                var Cstr = context.map_Controls[type_name];
                console.log('Cstr', Cstr);

                // We can create a new one, with a new ID.

                var new_id = id + '_clone';
                var map_controls = context.map_controls;

                // Want the body control as well.



                if (!map_controls[new_id]) {
                    // create it.

                    var new_ctrl = new Cstr({
                        'context': context,
                        'id': new_id
                    })

                    console.log('new_ctrl', new_ctrl);

                    //var body = ctrl_document.body();

                    var body = ctrl_document.content().get(1);

                    var css_class = this.get('dom.attributes.class');
                    new_ctrl.set('dom.attributes.class', css_class);

                    // Should copy the controls inside the one being cloned.
                    var my_contents = this.get('content');

                    // should be able to clone a Data_Value too.



                    each(my_contents, function(i, v) {
                        console.log('i', i);
                        console.log('v', v);

                        // Adding a Data_Value not working?

                        var v_clone = v.clone();
                        console.log('v_clone', v_clone);

                        // could get the value if it's a Data_Value for the moment...
                        //  Adding a Data_Value to a

                        //if (v_clone.value) {
                        if (v_clone instanceof jsgui.Data_Value) {
                            new_ctrl.add(v_clone.value());
                        } else {
                            new_ctrl.add(v_clone);
                        }



                    })

                    console.log('this', this);

                    // could get the computed width?

                    // computed padding too?



                    var my_bcr = this.bcr();


                    console.log('my_bcr', my_bcr);

                    // and get the border thickness too.
                    //  may be a bit more complex getting them all
                    //  and making sure it works in all browsers.







                    var my_padding = this.padding();
                    console.log('my_padding', my_padding);

                    my_bcr[2][0] = my_bcr[2][0] - my_padding[0];
                    my_bcr[2][1] = my_bcr[2][1] - my_padding[1];
                    my_bcr[2][0] = my_bcr[2][0] - my_padding[2];
                    my_bcr[2][1] = my_bcr[2][1] - my_padding[3];



                    //var my_border = this.border();
                    //console.log('my_border', my_border);

                    var my_border_thickness = this.border_thickness();

                    console.log('my_border_thickness', my_border_thickness);


                    var t_my_border_thickness = tof(my_border_thickness);

                    if (t_my_border_thickness == 'number') {
                        my_bcr[2][0] = my_bcr[2][0] - 2 * my_border_thickness;
                        my_bcr[2][1] = my_bcr[2][1] - 2 * my_border_thickness;

                    }

                    // Not sure how the border would be reported in a bunch of different browsers or border values

                    // could be '1px solid rgb(221, 221, 221)'
                    // could have regexes testing for various borders and getting the values back from them.

                    //  so we know the thickness of the individual left, top, right, bottom because we get them all at once.







                    // and subtract the padding.



                    // and use the bcr values to set the position and size of the new control.

                    // .bounds?
                    //   sets the position (screen location) and the size?
                    //   gets the bounding client rect?



                    new_ctrl.bcr(my_bcr);




                    console.log('new_ctrl', new_ctrl);





                    //throw 'stop';

                    // need to make the new control absolute







                    //ctrl_document.body().add(new_ctrl);
                    body.add(new_ctrl);

                    var new_el = new_ctrl.get('dom.el');
                    console.log('new_el', new_el);


                    //throw 'stop';

                }









                //throw 'stop';





            },

            /*

            'create_ghost_copy': function() {
                // Needs to clone the control, and put it into the body.

                // May need to do some in-depth work on cloning a control.
                //  Don't want to complicate the code too much though.
                //  Could just add the HTML from inside the other one.

                var ghost_copy = new Control({
                    'context': this._context
                });

                var el = this.get('dom.el');

                // Can't reuse IDs
                //  I think we need a means of cloning controls (properly).
                //  Need to run a clone procedure on the Control and its subcontrols.
                //  Would make a clone within the same context but it would get a new ID.






                if (el) {
                    //ghost_copy.add(el.innerHTML)

                    var my_clone = this.clone();

                    // then put the clone in the body.

                    var body = this._context.body();
                    body.add(my_clone);
                }


            },
            */




	        'one_mousedown_anywhere': function(callback) {
	        	//var ctrl_html_root = this._context.ctrl_document;
	        	//console.log('this._context', this._context);
	        	var body = this._context.body();

	        	var that = this;

	        	body.one('mousedown', function(e_mousedown) {
	        		// Maybe see if it's internal or external to the control

	        		// Would be good to have that in the event.

	        		var el = that.get('dom.el');

	        		var e_el = e_mousedown.srcElement || e_mousedown.target;





	        		console.log('one mousedown', e_mousedown);
	        		console.log('e_el', e_el);

	        		// Want to see if the element clicked on is a descendant of this's el.

	        		var iao = that.is_ancestor_of(e_el);
	        		//console.log('iao', iao);

	        		e_mousedown.within_this = iao;

	        		callback(e_mousedown);

	        	});
	        },


			// This may need to search inside for controls to be activated.
			//  Need to get this to work with client-rendered content.


	        'activate_recursive': function() {
	            console.log('activate_recursive');
	            var el = this.get('dom.el');

	            var context = this._context;
	            var map_controls = context.map_controls;

	            recursive_dom_iterate_depth(el, function(el2) {
	                //console.log('el ' + el);
	                var nt = el2.nodeType;
	                //console.log('nt ' + nt);
	                if (nt == 1) {
	                    var jsgui_id = el2.getAttribute('data-jsgui-id');


	                    //console.log('jsgui_id ' + jsgui_id);
	                    if (jsgui_id) {


	                        // Not so sure the control will exist within a map of controls.
	                        //  If we have activated the whole page, then they will exist.
	                        //  However, we may just want to do activate on some controls.

	                        

	                        var ctrl = map_controls[jsgui_id];
	                        //console.log('ctrl ' + ctrl);

	                        // don't want to activate twice.

	                        // specifically avoid activating twice?


	                        //if (el2 != el) {
	                        //    //ctrl.activate(el2);
	                        //}

	                        if (!ctrl.__active) ctrl.activate(el2);

	                        

	                        //console.log('jsgui_type ' + jsgui_type);
	                    }
	                }
	            })
	        },

	        'add_event_listener': fp(function(a, sig) {

	            /*
	            var el = this.get('dom.el');
	            if (el) {
	                
	                // Check if the element has that event listener...
	                //  Maybe maintain a map within the control of which DOM functions have been bound to the element.



	                el.addEventListener(event_name, handler, false);
	            }
	            */

	            // In enh - with this only working post-activation?

	            // see http://www.w3schools.com/tags/ref_av_dom.asp
	            /*
	            abort	Fires when the loading of an audio/video is aborted
				canplay	Fires when the browser can start playing the audio/video
				canplaythrough	Fires when the browser can play through the audio/video without stopping for buffering
				durationchange	Fires when the duration of the audio/video is changed
				emptied	Fires when the current playlist is empty
				ended	Fires when the current playlist is ended
				error	Fires when an error occurred during the loading of an audio/video
				loadeddata	Fires when the browser has loaded the current frame of the audio/video
				loadedmetadata	Fires when the browser has loaded meta data for the audio/video
				loadstart	Fires when the browser starts looking for the audio/video
				pause	Fires when the audio/video has been paused
				play	Fires when the audio/video has been started or is no longer paused
				playing	Fires when the audio/video is ready to play after having been paused or stopped for buffering
				progress	Fires when the browser is downloading the audio/video
				ratechange	Fires when the playing speed of the audio/video is changed
				seeked	Fires when the user is finished moving/skipping to a new position in the audio/video
				seeking	Fires when the user starts moving/skipping to a new position in the audio/video
				stalled	Fires when the browser is trying to get media data, but data is not available
				suspend	Fires when the browser is intentionally not getting media data
				timeupdate	Fires when the current playback position has changed
				volumechange	Fires when the volume has been changed
				waiting	Fires when the video stops because it needs to buffer the next frame

				abort
				canplay
				canplaythrough
				durationchange
				emptied
				ended
				error
				loadeddata
				loadedmetadata
				loadstart
				pause
				play
				playing
				progress
				ratechange
				seeked
				seeking
				stalled
				suspend
				timeupdate
				volumechange
				waiting
				*/


	            

	            // So, it should also bind the event to the control, so a listener will hear that.

	            // But does this apply itself???
	            this._super.apply(this, a);

	            // then if it appears in the dom events, attach it.

	            if (sig == '[s,f]') {
	                var event_name = a[0];

                    // change is also a DOM event
                    //  that's a tricky one.
                    //  should make it easy to listen out for DOM changes.
                    // let's include it for the moment.



	                if (mapDomEventNames[a[0]]) {
	                    //console.log('we have a DOM event: ' + event_name);

	                    var listener = this.mapListeners[event_name];
	                    var that = this;
	                    var el = this.get('dom.el');

	                    //console.log('el' + el);

	                    if (el) {
	                        if (!listener) {
	                            // a single listener called when a bound dom event fires.
	                            //  this will then split up the event calls to everything that is listening to this.
	                            // for the DOM event on the object, we raise the event on the control.

	                            listener = this.mapListeners[event_name] = function(e) {
	                                //console.log('event_name heard ' + event_name);

	                                // Raising an event, there could be multiple listeners.
	                                //  would be good to get an array of what the listeners returned.
	                                //  Return false here if any of them return false?



	                                var res_raise = that.raise(event_name, e);
	                                //console.log('res_raise', res_raise);

	                                // then if any results are false, we return false.

	                                var any_are_false = false;
	                                var c = 0, l = res_raise.length;

	                                while (!any_are_false && c < l) {
	                                    if (res_raise[c] === false) {
	                                        any_are_false = true;
	                                    }

	                                    c++;
	                                }

	                                //console.log('any_are_false', any_are_false);

	                                if (any_are_false) {
	                                    e.preventDefault();
	                                    return false;
	                                }
	                                // Would like to respond to the event.
	                                //  Eg if the dom event handler returns false, it would be good to return false in the listener.



	                            };
	                            el.addEventListener(event_name, listener, false);

	                        }
	                    }
	                }
	            }
	        }),

	        // not recursive
	        'activate': function(el) {
	        	//console.log('enh ctrl activate');

                if (!this.__active) {
                    this.__active = true;
                    if (el) {
                        this.set('dom.el', el);
                    }

                    //console.log('activate ' + this._id());
                    // activate content controls.
                    //console.log('1) ' + this._.content._arr.length);
                    this.activate_dom_attributes();
                    //console.log('2) ' + this._.content._arr.length);

                    this.activate_content_controls();
                    //console.log('3) ' + this._.content._arr.length);

                    // then is there is a selection_scope as true, create a new Selection_Scope object, then set it so that subcontrols point
                    //  to it with their selection_scope property.

                    // so after the fields have been set up.

                    this.activate_content_listen();
                    //console.log('4) ' + this._.content._arr.length);

                    // Activate style change listen?
                    //  Or generally dom attributes change listen?

                    this.activate_other_changes_listen();
                    //console.log('5) ' + this._.content._arr.length);
                }




	        },
	        'activate_other_changes_listen': function() {

	        	/*
	        	var style = this.get('dom.attributes.style');

	        	console.log('style', style);

	        	style.on('change', function(e_change) {
	        		console.log('style change', e_change);
	        	})
				*/
				var dom_attributes = this.get('dom.attributes');
				//console.log('dom_attributes', dom_attributes);

				var el = this.get('dom.el');

				dom_attributes.on('change', function(e_change) {
					var property_name = e_change.name, dval = e_change.value;

					//console.log('dom_attributes change', property_name, dval);

					/*
					if (property_name == 'style') {
						// need to update it on the element.

						if (tof(dval) == 'string') {
							el.setAttribute('style', dval);
						} else {
							el.setAttribute('style', dval.value());
						}
					} else if (property_name == 'class') {
						// need to update it on the element.

						if (tof(dval) == 'string') {
							el.setAttribute('class', dval);
						} else {
							el.setAttribute('class', dval.value());
						}
					}
					*/

					// I think this works better, 02/05/14

                    console.log('tof(dval)', tof(dval));

                    var t_dval = tof(dval);

					if (t_dval == 'string' || t_dval == 'number') {
						//el.setAttribute('style', dval);
					} else {
						//el.setAttribute('style', dval.value());

						dval = dval.value();
					}

					el.setAttribute(property_name, dval);



				});


	        },
	        'activate_content_listen': function() {
	        	//console.log('activate_content_listen');

	        	var content = this.get('content');

                //console.log('1) content.length()', content.length());

	        	var that = this;
	        	

	        	// var el = that.get('dom.el');

                // Important piece of code here.


	            content.on('change', function(e_change) {
	            	//console.log('activated control content change');

	            	var el = that.get('dom.el');
	            	var type = e_change.type;

	            	if (type == 'insert') {
	            		//console.log('control content change');
		                //console.log('e_change ', e_change);
		                //item._.parent = that;
	                    //item._.index = position;

	                    // need to put it into the dom...

	                    // basically, need to render it to an element, or document fragment.
	                    //  then put it into the DOM.

	                    // ctrl.render_to_element?
	                    
	                    //var p = el.parentNode;
	                    var item = e_change.item;



	                    var itemDomEl = item.get('dom.el');

                        // need to render the item ID in there too.
                        //var id = item._id();




	                    //console.log('e_change.item._context', item._context);
	                    if (!itemDomEl) {


                            // Making it get added twice?
                            // does this cause problems?
                            //  this seems to be the culprit.

                            // Or is the problem in conjunction with activate?
                            item.active();
                            // Making it active meaning it duplicates the content?


                            // This seems to do the trick for making a newly inserted item have the right document properties.
                            //  Will it also be in the context properly?


	                        //itemDomEl = e_change.item._context.document.createElement(e_change.item.get('dom.tagName'));
	                        // render the 

	                        // Are items not activated with contexts?

                            // Perhaps we should not always use a DIV?

                            var item_tag_name = item.get('tag_name').value();
                            //console.log('item_tag_name', item_tag_name);
                            //console.log('item', item);

                            // check for SVG tag names.

                            var temp_el;


                            if (item_tag_name == 'circle' || item_tag_name == 'line' || item_tag_name == 'polyline') {
                                // Can make SVG inside an element, with the right namespace.

                                var temp_svg_container = e_change.item._context.document.createElement('div');
                                temp_svg_container.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">' + e_change.item.all_html_render() + '</svg>';
                                itemDomEl = temp_svg_container.childNodes[0].childNodes[0];
                                //


                            } else {
                                temp_el = e_change.item._context.document.createElement('div');
                                temp_el.innerHTML = e_change.item.all_html_render();
                                itemDomEl = temp_el.childNodes[0];
                            }


	                        //var temp_div =

                            // It may need to be inside an SVG element.



	                        //itemDomEl = temp_div.childNodes[0];

	                        e_change.item.set('dom.el', itemDomEl);
	                    };
	                    //console.log('itemDomEl', itemDomEl);

	                    //el.insertBefore(itemDomEl, el.childNodes[0]);
	                    el.appendChild(itemDomEl);

                        // And then activate it?
                        //  Perhaps making it so that it's impossible to add the same content again?



                        //item.activate();
                        // Will switch this off for the moment.

                        //  Seems to have a problem with both .active and .activate
                        //  Will turn .activate back on, and look at the activate code.


	            	}

	            	if (type == 'clear') {
	            		el.innerHTML = '';
	            	}


	            });

                //console.log('2) content.length()', content.length());
	        },
	        'activate_dom_attributes': function() {
	            var el = this.get('dom.el');

	            // may not have el....?
	            var that = this;
	            var dom_attributes = this.get('dom.attributes');
	            for (var i = 0, attrs = el.attributes, l = attrs.length; i < l; i++){
				    //arr.push(attrs.item(i).nodeName);
				    var item = attrs.item(i);
				    //console.log('item', item);

				    //console.log('item.name', item.name);
				    //console.log('item.value', item.value);

				    var name = item.name;
				    var value = item.value;

				    if (name == 'data-jsgui-id') {
				    	// Handled elsewhere - not so sure it should be but won't change that right now.
				    } else if (name == 'data-jsgui-type') {
				    	// ^
				    } else if (name == 'style') {

				    	//console.log('inline style value', value);

				    	// Need to parse that style value.
				    	//  Put it into the control's inline style dict.

				    	//._icss

				    	//console.log('1) ._icss', this._icss);

				    	var map_inline_css = this._icss;

				    	var arr_style_items = value.split(';');
				    	//console.log('arr_style_items', arr_style_items);

				    	//each(arr_style_items)
				    	for (var c = 0, l2 = arr_style_items.length; c < l2; c++) {
				    		//map_inline_css[]

				    		var style_item = arr_style_items[c];
				    		//var style_item_name = 
				    		var arr_style_item = style_item.split(':');

				    		if (arr_style_item[0]) {
				    			map_inline_css[arr_style_item[0]] = arr_style_item[1];
				    		}
				    	}

				    	//console.log('2) ._icss', this._icss);

				    	// and the dom.attributes.style will get set from the ._icss as a later point.




				    	// ^
				    } else if (name == 'data-jsgui-fields') {
				    	var str_properties = value;

				    	if (str_properties) {
			                //console.log('str_ctrl_fields ' + str_ctrl_fields);
			                //console.log('str_properties', str_properties);
			                //var s_pre_parse = str_properties.replace(/'/g, '"').replace(/♥/g, '\'').replace(/☺/g, '"');
							var s_pre_parse = str_properties.replace(/\[DBL_QT\]/g, '"').replace(/\[SNG_QT\]/g, '\'');
							s_pre_parse = s_pre_parse.replace(/\'/g, '"');


			                // DBL_QT
			                //console.log('s_pre_parse', s_pre_parse);

			                //console.log('s_pre_parse', tof(s_pre_parse));

			                var props = JSON.parse(s_pre_parse);
			                //console.log('props ' + stringify(props));
			                //throw 'stop';
			                this.set(props);

			                // Could be set through flags?

			                //  We can set it to be a selection scope at an earlier stage, on the server,
			                //  and tell it to retain that information going to the client, so that when it is activated there
			                //  it is also a selection scope.

			                // I think another useful function would just set the selection scope to be at the current level.

			                // ctrl.selection_scope(ctrl);
			                //  otherwise it could be getting the selection scope.
			                //  nice set syntax, consistant with other code too.


			                var ss = this.get('selection_scope');
			                //console.log('ss ' + ss);
			                // if we have the selection scope, better to create a proper Selection_Scope object.

			                if (ss && ss.value() === true) {
			                    // will create a proper selection scope

			                    var selection_scope = new Selection_Scope({
			                        'control': this
			                    });

			                    this.set('selection_scope', selection_scope);
			                    //throw 'stop';
			                }

			                //if (ss) throw 'stop';

			                //throw 'sty';

			            }
				    } else {
				    	// set the dom attributes value... silent set?

				    	dom_attributes.set(name, value);
				    }

				}

				/*


	            var cls = el.className;

	            //console.log('cls ' + cls);
	            var aCls = cls.split(' ');


	            if (aCls.length > 0) {
	                // can use a map of the css classes.
	                //  faster to add and remove.

	                var map_classes = jsgui.get_truth_map_from_arr(aCls);

	                this.set('dom.attributes.class', map_classes);
	            }

	            // Need to read through all of the DOM atributes.
	            //  


	            var str_properties = el.getAttribute('data-jsgui-fields');
	            //console.log('str_properties', str_properties);
	            if (str_properties) {
	                //console.log('str_ctrl_fields ' + str_ctrl_fields);
	                //console.log('str_properties', str_properties);
	                var props = JSON.parse(str_properties.replace(/'/g, '"'));
	                //console.log('props ' + stringify(props));
	                //throw 'stop';
	                this.set(props);

	                // Could be set through flags?

	                //  We can set it to be a selection scope at an earlier stage, on the server,
	                //  and tell it to retain that information going to the client, so that when it is activated there
	                //  it is also a selection scope.

	                // I think another useful function would just set the selection scope to be at the current level.

	                // ctrl.selection_scope(ctrl);
	                //  otherwise it could be getting the selection scope.
	                //  nice set syntax, consistant with other code too.


	                var ss = this.get('selection_scope');
	                //console.log('ss ' + ss);
	                // if we have the selection scope, better to create a proper Selection_Scope object.

	                if (ss && ss.value() === true) {
	                    // will create a proper selection scope

	                    var selection_scope = new Selection_Scope({
	                        'control': this
	                    });

	                    this.set('selection_scope', selection_scope);
	                    //throw 'stop';
	                }

	                //if (ss) throw 'stop';

	                //throw 'sty';

	            }
	            */
	        },
	        'hide': function() {
	        	// set the style to hidden.
	        	//  Could add a hidden class.

	        	//  I think a variety of tests on styling would make sense.

	        	// Want to set styles with easy syntax.

	        	// ctrl.style(style_name, value);
	        	//  I think the Control needs to maintain its own dict or data structure of its inline styles.
	        	//   These could get rendered differently to dom.attributes.style.

	        	// Or, the dom.sttributes.style gets producted from the jsgui styles that are set.
	        	//  These styles could also operate a bit differently, or be rendered differently to account for browser differeces.
	        	// Eg with rounded corners, could use a polyfill for earlier browsers.

	        	// Will interact with dom.attributes.style.

	        	// When active, needs to respond to changes in dom.attributes etc
	        	//  Will need to listen for those changes and re-render as appropriate.


	        	this.add_class('hidden');
	        	// Probably needs a lower level index / system of maintaining the classes - think it has one now apr 2014







	        },
	        'show': function() {
	        	this.remove_class('hidden');

	        },

            'descendants': function(search) {
                // assembles a list of the descendents that match the search
                //  (search by .__type_name)

                // eg get a list of menu_node objects.

                // basically need to recursively go through the descendents, with a callback in here, and see if they match the search.

                // recursive iteration of the control(s)

                var recursive_iterate = function(ctrl, item_callback) {
                    // callback on all of the child controls, and then iterate those.
                    //console.log('recursive_iterate');
                    var content = ctrl.get('content');
                    //console.log('content', content);

                    var t_content = tof(content);

                    //console.log('t_content', t_content);

                    if (t_content == 'collection') {
                        if (content.length() > 0) {

                            //console.log('content.length()', content.length());
                            // iterate through those child nodes as well.
                            content.each(function(i, item) {
                                //console.log('item', item);
                                item_callback(item);
                                recursive_iterate(item, item_callback);

                            })
                        }
                    }

                }

                var arr_matching = [];

                recursive_iterate(this, function(item) {
                    // see if the item matches the search

                    //console.log('cb item', item);
                    var item_type = item.__type_name;
                    //console.log('item_type', item_type);

                    if (item_type == search) {
                        arr_matching.push(item);
                    } else {
                        //return ctrl_parent.ancestor(search);
                    }

                });

                //console.log('arr_matching', arr_matching);

                return arr_matching;





            },

            'ancestor': function(search) {
                // could maybe work when not activated too...
                // need to get the ancestor control matching the search (in type).

                if (this._parent) {
                    var ctrl_parent = this._parent._parent;
                    // the _parent is a Collection within the parent Control

                    if (!ctrl_parent) {
                        return false;
                    } else {

                        console.log('ctrl_parent', ctrl_parent);
                        // does the parent match the type?

                        var parent_type = ctrl_parent.__type_name;
                        console.log('parent_type', parent_type);

                        if (parent_type == search) {
                            return ctrl_parent;
                        } else {
                            return ctrl_parent.ancestor(search);
                        }



                    }
                } else {
                    return false;
                }









            },

	        'context_menu': fp(function(a, sig) {
	        	
	        	// What to do here depends on the control lifecycle stage.
	        	//  On the server
	        	//   Want it to be sent to the client so that it automatically gets activated with that context menu.
	        	//    Would not be able to call callbacks that get given when the function gets set up.
	        	//    Would need to have UI responses handled on activation, but at least the menu itself could be set up at an earlier stage.
	        	//  On the client
	        	//   Pre-activation
	        	//    ??Won't do that for the moment. Could maybe raise an error
	        	//    Set properties so that when it gets activated it knows to activate it with the context menu.
	        	//   Post/during activation



	        	// So far, this seems to be for post-activation.
	        	//  On the server, we want it so that the properties get sent over to the client.
	        	//   I think that could do with more work.
	        	//   Making it so that properties in general, and behaviours, can be sent to the client and activated there.

	        	// It seems like some more generalization is needed in how data gets transferred to the client?
	        	// There are the fields which get sent, and there are ctrl-fields
	        	//  Fields get set, however they don't influence behaviours.

	        	// Mechanism for function calls upon activation.
	        	//  Possibly behaviours
	        	//  or jsgui-activate="context_menu(params)"
	        	//   So actually having function calls there.
	        	//    Calling functions on the controls upon activation, as specified by parameters on the server.

	        	// Also, better mechanism for setting fields and ctrl-fields.
	        	//  Need a bit of behind the scenes processing to make something work between both the server an the clients.
	 			//  Setting fields and behaviours on the server that determine how it gets activated on the client makes sense.

	 			// jQuery / CSS like selectors for selecting and finding controls within each other will also make sense.
	 			//  So for activating controls within another control, it will be fast to find the various controls to be activated.


	 			// data-jsgui-call-on-activate
	 			// data-jsgui-activate
	 			// data-jsgui-call
	 			//  Functions for it to call on the client.
	 			//   Interprets the functions, calls them.
	 			//   So a context menu that's specified on the server could be sent along to the client.

	 			// Control having extra functionality to add and remove the values that will get sent to the client.
	 			//  Will have various map objects of data sent to the client (maybe list/array instead?)

	 			// Dealing with maps of data to be sent to the client.
	 			//  Need something for rendering this?
	 			//  Just use the normal dom attributes?

	 			// Want ways of referring to JSON objects within the DOM attributes.
	 			//  It sounds like the data type and field systems should handle this where possible.

	 			//.set('active.context_menu', {...})
	 			//  So changes to the active field, on the server, cause changes to dom.attributes.jsgui-active

	 			//.active({'context_menu': {...}})


	        	var menu_def;
	        	if (sig == '[o]' || sig == '[a]') {
	        		menu_def = a[0];
	        	}

	        	var Context_Menu = Context_Menu || require('./controls/advanced/context-menu');

	        	var context_menu;
	        	var that = this;

	        	// Need it so that the context menu gets removed when it should.
	        	//  Any mouseup event causes it to vanish.

                var body = this._context.body();

	        	//var ctrl_html_root = this._context.ctrl_document;

                //console.log('ctrl_html_root', ctrl_html_root);

	        	//var body = ctrl_html_root.body();

	        	var show_context_menu = fp(function(a, sig) {


	        		var pos;


	        		if (sig == '[a]') {
	        			// A position?

	        			pos = a[0];

	        		}

	        		//console.log('show_context_menu pos:', pos);

	        		//console.log('show_context_menu');

	        		//console.log('Context_Menu', Context_Menu);
	        		//console.log('context_menu', context_menu);

	        		if (!context_menu) {
                        console.log('creating new context menu');

	        			//console.log('menu_def', menu_def);

	        			context_menu = new Context_Menu({
	        				'context': that._context,
	        				'value': menu_def
	        			});

	        			if (pos) {
	        				context_menu.style({
		        				'left': (pos[0] - 1) + 'px',
		        				'top': (pos[1] - 1) + 'px'
		        			});
		        			
	        			} else {
	        				context_menu.style({
		        				'left': '100px',
		        				'top': '100px'
		        			});

	        			}

	        			

	        			// Then put it into the dom.

	        			// Need to render it?
	        			//  Add it to the document Control's body (the body control) and then
	        			//  the rendering should be done automatically.

	        			// Not sure I can get the body control like that.
	        			// A different way to get the body?
	        			//  Make a body function?

	        			var context = that._context;
	        			//console.log('context', context);


	        			// The context should have access to the document and body controls?
	        			//  There is already the document reference.


	        			// Should have both the document and the document control available in the Page_Context.


	        			// It should find the body...
	        			//console.log('context.ctrl_document', context.ctrl_document);

	        			
	        			//console.log('body', body);


	        			

						

	        			

	        			// I think we need another demo / test of dynamically adding content to a control.
	        			//  Should try insert as well as add.

	        			// Want the coder to update it within the control system, the framework renders and inserts into the DOM as necessary.

	        			//console.log('post add context menu to body');

	        		} else {

	        			if (pos) {
	        				context_menu.style({
		        				'left': (pos[0] - 1) + 'px',
		        				'top': (pos[1] - 1) + 'px'
		        			});
		        			
	        			} else {
	        				context_menu.style({
		        				'left': '100px',
		        				'top': '100px'
		        			});
	        			}
                        /*
	        			setTimeout(function() {
	        				//console.log('pre add context menu');
	        				body.add(context_menu);
	        				context_menu.activate();

	        				context_menu.one_mousedown_anywhere(function(e_mousedown) {
								console.log('e_mousedown.within_this ' + e_mousedown.within_this);

								if (!e_mousedown.within_this) {
									context_menu.remove();
								} else {
                                    // maybe open a new level
                                    context_menu.remove();
                                }
							});


	        			}, 0);
                        */


	        		}

                    setTimeout(function() {

                        //console.log('pre add context_menu', context_menu);

                        console.log('pre add context_menu._.content._arr.length ' + context_menu._.content._arr.length);
                        // Looks like we need to examine the add procedure more.

                        body.add(context_menu);

                        console.log('pre activate context_menu._.content._arr.length ' + context_menu._.content._arr.length);

                        context_menu.activate();

                        // Why is the context menu's node getting added twice?

                        //console.log('added context_menu', context_menu);
                        console.log('post activate context_menu._.content._arr.length ' + context_menu._.content._arr.length);


                        // Seems not to be rendering it with its ID.
                        //  Would prefer its id to be rendered as data-jsgui-id


                        // Why is it adding more to the context menu when it's appearing a 2nd time?

                        // do we need to activate it here?
                        //  will that be done automatically?
                        //  I think that adding the control should activate it if necessary.
                        //context_menu.activate();


                        context_menu.one_mousedown_anywhere(function(e_mousedown) {
                            console.log('e_mousedown.within_this ' + e_mousedown.within_this);

                            if (!e_mousedown.within_this) {
                                context_menu.remove();



                            } else {
                                // maybe open a new level.

                                // And need to call the relevant context menu function.

                                console.log('e_mousedown', e_mousedown);

                                var el_target = e_mousedown.target;

                                // the target control will have a jsgui id now.
                                //  we should be able to then go to its parent and get its menu node.

                                var context = that._context;
                                console.log('context', context);

                                var target_id = el_target.getAttribute('data-jsgui-id');
                                console.log('target_id', target_id);

                                var ctrl_target = context.map_controls[target_id];

                                console.log('ctrl_target', ctrl_target);

                                // want to be able to get an ancestor of type menu-node

                                var menu_node = ctrl_target.ancestor('menu_node');
                                console.log('menu_node', menu_node);

                                // and raise the menu_node select event.

                                menu_node.raise('select');










                                // But the inner control, the menu node which was dynamically created, has not been rendered with its
                                //  necessary jsgui properties, like data-jsgui-id

                                // then from that, we find the menu node it corresponds with.

                                //var el_menu_node = el_target.parentNode.parentNode;
                                // and need to get the Control itself from the context.

                                //var menu_node_id =


                                context_menu.remove();
                            }


                        });



                        /*
                         setTimeout(function() {


                         // Need to hide the context menu on mousedown outside it.

                         // one_mousedown_outside
                         //  that could be a useful specialised function to have.

                         // Would only want it to be removed once.




                         ctrl_html_root.one('mouseup', function(e_mouseup) {
                         console.log('');
                         console.log('one mouseup');
                         if (context_menu) {
                         context_menu.remove();
                         }
                         });
                         }, 20)
                         */
                    }, 0);

	        	});



	        	// Respond to right clicks only.
                /*
	        	this.on('click', function(e_click) {
	        		console.log('e_click', e_click);
	        	})
	        	*/

	        	this.on('contextmenu', function(e_contextmenu) {
	        		//console.log('e_contextmenu', e_contextmenu);
	        		return false;
	        		//console.log('e_click', e_click);
	        	})

	        	this.on('mousedown', function(e_mousedown) {
	        		//console.log('e_mousedown', e_mousedown);

	        		var int_button = e_mousedown.which;

	        		if (int_button == 3) {
	        			e_mousedown.preventDefault();
	        			window.event.returnValue = false;
	        			return false;
	        		}
	        	});

	        	this.on('mouseup', function(e_mouseup) {
	        		//console.log('e_mouseup', e_mouseup);

	        		var int_button = e_mouseup.which;

	        		if (int_button == 3) {
	        			console.log('right button');
	        			e_mouseup.preventDefault();
	        			window.event.returnValue = false;

	        			// Need to work out the position of the click.

	        			// pageX, pageY

	        			var pos = [e_mouseup.pageX, e_mouseup.pageY];


	        			show_context_menu(pos);

	        			return false;
	        		}
	        	})

	        	// Create a context menu with those nodes.

	        	// When control is right clicked on, create and show a context menu?
	        	//  I think keeping the menu within the control, rendered by hidden would work. Maybe?
	        	//  Or easier to show in an overlay if it is generated?
	        	//  I think absolute positioning would be OK, but then it could run into problems with the element's overflow: hidden
	        	//  So rendering in an absolute div may make the most sense.
	        	//   Could then keep the DOM el once it exists.

	        	// This would mean Context_Menu would be a requirement of html-enh, which means a whole load of other
	        	//  components could also fit in that space in the heirachy, logically.






	        }),
	        'activate_content_controls': function() {



	        	//console.log('activate_content_controls');
	            // needs to have an el.

	            // Every internal control has its selection scope set?

	            //  Or it can find the selection scope by moving upwards through the heirachy when needed?




	            var el = this.get('dom.el');
	            var context = this._context;

	            var ctrl_fields = {};
	            var that = this;

	            var str_ctrl_fields = el.getAttribute('data-jsgui-ctrl-fields');
	            if (str_ctrl_fields) {
	                //console.log('str_ctrl_fields ' + str_ctrl_fields);
	                ctrl_fields = JSON.parse(str_ctrl_fields.replace(/'/g, '"'));

	            }

	            //console.log('ctrl_fields ' + stringify(ctrl_fields));

	            //var fields_ctrl = {};
	            //var selection_scope;

                // PROBLEM!...?

                // Setting the same thing twice?

	            each(ctrl_fields, function(i, v) {
	            	//fields_ctrl.set(i, v);

	               	//fields_ctrl[v] = i;
	               	var referred_to_control = context.map_controls[v];
	               	//console.log('referred_to_control', referred_to_control);

	               	that.set(i, referred_to_control);


	            })
	            // context.map_controls



	            //var ss = this.get('selection_scope');
	            //console.log('ss ' + ss);
	            //if (ss) throw 'stop';

	            

	            //console.log('fields_ctrl ' + stringify(fields_ctrl));

	            // the other controls will have already been registered, even if they are not active controls.

	            // Register, activate

	            //console.log('el ' + el);

	            // Works in an overly complicated way?


	            var cns = el.childNodes;

                // For every child node...

                //  Do not want to add it's control each time.
                //  Should probably only do that if the control is not already there.
	            
	            

	            var content = this.get('content');

                // Adding the content again?

	            for (var c = 0, l = cns.length; c < l; c++) {
	                var cn = cns[c];

	                var nt = cn.nodeType;
	                //console.log('* nt ' + nt);
	                if (nt == 1) {
	                    var cn_jsgui_id = cn.getAttribute('data-jsgui-id');
	                    //console.log('cn_jsgui_id ' + cn_jsgui_id);

	                    var cctrl = context.map_controls[cn_jsgui_id];
	                    //console.log('cctrl ' + stringify(cctrl));
	                    //content.push(cctrl);
	                    // OK, but when adding content it will be good to know what index the content goes to.
	                    //  maybe this.add would be better.


                        // Need to be careful about this.
                        //  Don't want to add controls twice.
                        //  Only want them to be pushed to the content if they are not already there.


                        // Need to add them to the content when activating from the DOM at the beginning.
                        //  However, we may have the control already associated with its parent control, if it was rendered.

                        // Need a fast way of looking up if a control, by name, is within the content collection.
                        //  Could make the collection automatically index the id... but that would be a new requirement for controls to
                        //  always have IDs. Perhaps it would be useful / necessary though.
                        // Or, when a control does have an ID, that id gets recorded.

                        // This definitely looks like the problem where it's adding the content that already exists.

                        // a .content_contains_control_id function could help in the short term.
                        //  may be a performance bottleneck if it checks all controls.
                        //  a control having a map of its subcontrols may make sense, though that functionality really belongs within Collection.

                        // When adding a control, it would index that control's id.
                        //  Make it so that the collection automatically indexes a control's id.





                        // quick check to see if the control is not already there.

                        var found = false;

                        // Seems inefficient here. Could check faster, or make check unnecessary (maybe throw error if found, then debug elsewhere).

                        if (cctrl) {
                            var ctrl_id = cctrl.__id;
                            //console.log('ctrl_id', ctrl_id);


                            if (ctrl_id) {
                                content.each(function(i, v) {
                                    if (v.__id) {
                                        if (v.__id == ctrl_id) found = true;
                                    }
                                });
                            }

                            if (!found) {
                                content.push(cctrl);
                            }
                        }









	                    // need to be able to get from a control:
	                    // _parent()
	                    // _index()

	                    // Though there could be a more complicated relationships system, I think keeping that simple API would be good.

	                    // or just .parent()
	                    // .index()

	                    // not sure that ._id() was so well named... but anyway.

	                    //
	                    //if (fields_ctrl[cn_jsgui_id]) {
	                    //    //console.log('fields_ctrl[cn_jsgui_id] ' + fields_ctrl[cn_jsgui_id]);
	                    //    that.set(fields_ctrl[cn_jsgui_id], cctrl);
	                    //}

	                    // Not doing recursive selection scope setting here?
	                }
	                if (nt == 3) {
	                    // text
	                    var val = cn.nodeValue;
	                    //console.log('val ' + val);
	                    content.push(val);

	                }
	                // we can get the ctrl reference

	            }

	        },

			// make full height.
			//  makes the control take the rest of the height of the window.

            // Drag function as well...
            //  Could make this accept the same params as the drag function,
            //   but this version will be more flexible with more modes.
            // Drag and drop could also be set up with simpler parameters and acts in the default way that .drag would do.

            'draggable': fp(function(a, sig) {
                var that = this;
                console.log('draggable sig', sig);
                var options = {}, mode, drag_start_distance = 4;

                // options could contain event handlers.
                //  Not sure about the publish / subscribe model.
                //   Maybe it would work well.

                // But allowing event handlers as specified in the options would be good as well.

                var fn_mousedown, fn_dragstart, fn_dragmove, fn_dragend;
                var handle_mousedown, handle_dragstart, handle_dragmove , handle_dragend;


                if (sig == '[o]') {
                    options = a[0];
                }

                // fn_mousedown, fn_begin, fn_move, fn_end
                if (sig == '[f,f,f,f]') {
                    handle_mousedown = a[0];
                    handle_dragstart = a[1];
                    handle_dragmove = a[2];
                    handle_dragend = a[3];
                }


                if (options.mode) mode = options.mode;
                //if (options.fn_dragmove) fn_dragmove = options.fn_dragmove;
                if (options.move) handle_dragmove = options.move;
                //if (options.fn_dragstart) fn_dragstart = options.fn_dragstart;
                if (options.start) handle_dragstart = options.start;

                // could have a 'none' mode that does not implement drag behaviour itself, but just shows the events?
                //  or I think 'events' mode would be a better name because it's saying what it is.
                //  would be useful for moving objects around according to more specific rules.






                if (mode == 'ghost-copy') {
                    // Drag a ghost copy of the original element.

                    // call a create_ghost_copy function? It would make the ghost copy absolutely positioned and a child of the body.
                    //  could automatically create it with a small offset.

                    //  Need to be dragging the ghost copy around throughout the drag operation in this case.

                    console.log('ghost-copy drag');




                }

                var body = that._context.body();

                // raise the events externally.

                var is_dragging;
                var pos_mousedown;

                var ghost_clone;





                var fn_mousemove = function(e_mousemove) {
                    console.log('e_mousemove', e_mousemove);

                    var pos = [e_mousemove.pageX, e_mousemove.pageY];

                    var pos_offset = [pos[0] - pos_mousedown[0], pos[1] - pos_mousedown[1]];



                    //console.log('dist', dist);

                    if (!is_dragging) {
                        var dist = Math.round(Math.sqrt(pos_offset[0] * pos_offset[0] + pos_offset[1] * pos_offset[1]));
                        if (dist >= drag_start_distance) {
                            console.log('starting drag');
                            is_dragging = true;

                            // in ghost copy mode create the ghost copy

                            if (mode == 'ghost-copy') {
                                ghost_clone = that.absolute_ghost_clone();

                            }


                            if (handle_dragstart) {
                                e_mousemove.control = that;

                                handle_dragstart(e_mousemove);
                            }
                        }
                    }

                    if (is_dragging) {
                        // raise the drag event.

                        // could do some of the drag-drop activity depending on the drag mode.
                        //  also want to provide other hooks for functionality.

                        if (fn_dragmove) {
                            e_mousemove.control = that;
                            fn_dragmove(e_mousemove);
                        }

                    }



                    // Want the offset from the mousedown position.

                }
                var fn_mouseup = function(e_mouseup) {
                    console.log('e_mouseup', e_mouseup);

                    body.off('mousemove', fn_mousemove);
                    body.off('mouseup', fn_mouseup);

                    body.remove_class('no-text-select');
                }

                this.on('mousedown', function(e_mousedown) {
                    console.log('e_mousedown', e_mousedown);

                    pos_mousedown = [e_mousedown.pageX, e_mousedown.pageY];

                    // position within Control
                    // position within window


                    body.on('mousemove', fn_mousemove);
                    body.on('mouseup', fn_mouseup);

                    body.add_class('no-text-select');
                    is_dragging = false;

                    if (handle_mousedown) {
                        handle_mousedown(e_mousedown);
                    }

                })




                // think we want the various drag and drop signifier events.





                // There will be different drag options.
                //  Drag a ghost copy
                //  Drag the original
                //   Automatically snap/transition back into place (depending on conditions)

                // I think dragging a ghost copy of the original is best for dragging items from a toolbox




                // with no sig...


                // basically make the control draggable.




            }),


            // As well as the 'draggable' function?
            //  Could keep this, and have it call draggable?
            //  Draggable makes more sense, perhaps drag could be an alias for draggable.


            /*
			'drag': function(fn_mousedown, fn_begin, fn_move, fn_end) {

	            var screen_down_x, screen_down_y;

	            // Want ways of restricting or cancelling a drag.
	            var ctrl_html_root = this._context.ctrl_document;


	            this.add_event_listener('mousedown', function(e) {
	                //console.log('hover mouseover');

	                //console.log('drag mousedown ', e);

	                screen_down_x = e.screenX;
	                screen_down_y = e.screenY;

	                //var moved = false;
	                var drag_initiated = false;

	                fn_mousedown(e);

	                var first = true;

	                var handle_move = function(e) {

	                    console.log('handle_move');

	                    var screen_move_x = e.screenX;
	                    var screen_move_y = e.screenY;

	                    var screen_offset_x = screen_move_x - screen_down_x;
	                    var screen_offset_y = screen_move_y - screen_down_y;

	                    if (first) {
	                    	ctrl_html_root.add_class('cursor-default');
	                    	first = false;
	                    }

	                    // Screen movement offset.

	                    // Anyway, we need the position within the div / element where the mouse went down.
	                    //  We use that to calculate the position to move the control to, we need to take account of that inital offset.



	                    // could find the position of the srcElement.

	                    // that may be better.
	                    //  then we use the client x and client y properties to determine the offset into the item clicked.



	                    //console.log('screen_offset_x', screen_offset_x, 'screen_offset_y', screen_offset_y);

	                    // but we already have an offset property from the event.

	                    // maybe call our new one a movement offset.



	                    var e = {
	                        'offsetX': screen_offset_x,
	                        'offsetY': screen_offset_y,
	                        'screenX': screen_move_x,
	                        'screenY': screen_move_y,
	                        'clientX': e.clientX,
	                        'clientY': e.clientY,
	                        'pageX': e.pageX,
	                        'pageY': e.pageY
	                    }

	                    if (!drag_initiated) {

	                        //see how far it is...

	                        // want to use a function that calculates the magnitude of the distance.

	                        var dbp = jsgui.distance_between_points([[0, 0], [screen_offset_x, screen_offset_y]]);

	                        //console.log('dbp ' + dbp);

	                        // drag_initiation_distance

	                        var drag_initiation_distance = 16;
	                        if (dbp >= 16) {
	                            drag_initiated = true;
	                            ctrl_html_root.add_class('dragging');
	                            //ctrl_html_root.add_class('cursor-default');

	                            fn_begin(e);
	                            
	                        }


	                        // can just use the magnitude of the offset.
	                        //  dbp taking just 2 values...



	                        
	                    }

	                    if (drag_initiated) {
	                        fn_move(e);
	                    }

	                    
	                }

	                var handle_mouseup = function(e) {
	                    //document.removeEventListener('mousemove', handle_move);
	                    //document.removeEventListener('mouseup', handle_mouseup);

	                    ctrl_html_root.off('mousemove', handle_move);
	                	ctrl_html_root.off('mouseup', handle_mouseup);

	                	ctrl_html_root.remove_class('dragging');
	                	ctrl_html_root.remove_class('cursor-default');

	                    var screen_mouseup_x = e.screenX;
	                    var screen_mouseup_y = e.screenY;

	                    var screen_offset_x = screen_mouseup_x - screen_down_x;
	                    var screen_offset_y = screen_mouseup_y - screen_down_y;

	                    console.log('screen_offset_x', screen_offset_x, 'screen_offset_y', screen_offset_y);

	                    var e = {
	                        'offsetX': screen_offset_x,
	                        'offsetY': screen_offset_y
	                    }
	                    fn_end(e);

	                }

	                ctrl_html_root.on('mousemove', handle_move);
	                ctrl_html_root.on('mouseup', handle_mouseup);

	                //document.addEventListener('mousemove', handle_move, false);
	                //document.addEventListener('mouseup', handle_mouseup, false);


	                //fn_in();
	            })
	        },
	        */

	        'drag_handle_to': function(ctrl) {
	            // Also involved with drag and drop actions.

	            // could use the lower level drag(3) function.
	            //  would handle initializaing the drag, stopping it.

	            // another piece of code deals with dragging something representing a copy, we don't want that here.
	            //  want to move the window.

	            // and can drag another control.

	            // maybe want to make a few lower level drag functions?
	            //console.log('drag_handle_to');
	            var mousedown_offset_from_ctrl_lt;

	            var ctrl_el = ctrl.get('dom.el');
	            // could go in enhanced....

	            this.drag(function(e_mousedown) {
	                //console.log('e_mousedown', e_mousedown);


	                // This will need to be revised - making adjustment for when dragging from an anchored position.
	                //  Should maintain some info about the drag so it knows if it starts/ends anchored anywhere.
	                var target = e_mousedown.target;

	                // want to get the position within the thing it's a handle to?

	                // will need to do a bit of position calculation to get it to work.

	                var targetPos = findPos(target);
	                //console.log('targetPos ' + stringify(targetPos));

	                var ctrl_el_pos = findPos(ctrl.get('dom.el'));

	                // and use the client x, client y

	                // or page x page y?

	                var e_pos_on_page = [e_mousedown.pageX, e_mousedown.pageY];

	                // then subtract the vectors.

	                //var offset_within_target = jsgui.v_subtract(e_pos_on_page, targetPos);
	                mousedown_offset_from_ctrl_lt = jsgui.v_subtract(e_pos_on_page, ctrl_el_pos);
	                //console.log('mousedown_offset_from_ctrl_lt ' + stringify(mousedown_offset_from_ctrl_lt));

	                // not bad...

	                // notify the page context.
	                //  Will notify the page context when control gets moved too.
	                //   The page context could arrange other things, like tell a control with a drop zone to get ready?
	                //    Or that control responds to the mouseover event because it is a drop zone?

	                // The Page_Context may get told about a few things, but only then send on messages where necessary.





	            }, function(e_begin) {
	                // also want the position of mousedown.

	                // we could get that with a mousedown event.


	                // could get a measurement of the size height.
	                //  also know if it is docked or not.

	                var ctrlSize = ctrl.size();
	                console.log('ctrlSize', ctrlSize);

	                var anchored_to = ctrl.get('anchored_to');
	                //console.log('anchored_to', anchored_to);

	                if (!anchored_to) {
	                    //ctrl.set('unanchored_size', ctrlSize);
	                } else {
	                    // need to unanchor it.
	                    ctrl.unanchor();

	                    /*
	                    var unanchored_size = ctrl.get('unanchored_size');
	                    console.log('unanchored_size', unanchored_size);

	                    ctrl.size(unanchored_size);
	                    ctrl.style({
	                        'position': 'absolute'
	                    })
	                    */
	                }


	                //console.log('drag handle to drag begin');


	                //throw 'stop';

	                // need to make it absolutely positioned, size it.



	            }, function(e_move) {

	                //console.log('move event');
	                // need to reposition the control.
	                //  will mean adjusting some inline style.

	                // could do with more jsgui work on dealing with styles.
	                //  both conventional styles
	                //  and a style abstraction.

	                // set the style on the control.

	                // another style abstraction system would be quite useful, not called style....
	                // .form? Seems confusing with html for.
	                // .appearance - too long
	                // .flair?

	                // or just .style, but these are jsgui style abstractions.
	                //  so we can have it put in the rounded edges within a DIV in IE6, but it does change the layout in general.

	                // style polyfill? shim?

	                // maybe want to specify corners in jsgui - that is a style abstraction.

	                var clientX = e_move.clientX;
	                var clientY = e_move.clientY;

	                //var pageX = e_move.pageX;
	                //var pageY = e_move.pageY;

	                //console.log('pre set ctrl style');

	                // the style within the dom attributes?

	                // I think .form would be good instead of .style.
	                //  .form would be like .style but the style abstraction.

	                // Perhaps being able to access .style makes sense for controls though.

	                // Need to deal properly with offsets.

	                //  

	                // width of the control.

	                // want ctrl.width() to produce the result, but that will need more work.



	                // Also need to clamp it within page constraints.

	                var window_size = get_window_size();


	                var ctrl_pos = jsgui.v_subtract([clientX, clientY], mousedown_offset_from_ctrl_lt);

	                // But then act differently if we are dragging from an anchored position.
	                //  The mousedown offset within the control won't be so relevant - 
	                //   or won't be the only factor.

	                // Take account of position_adjustment
	                //  or offset_adjustment

	                var offset_adjustment = ctrl.get('offset_adjustment');
	                //console.log('offset_adjustment', offset_adjustment);

	                if (offset_adjustment) {
	                    // want to find out what zone it is anchored in.

	                    ctrl_pos = jsgui.v_add(ctrl_pos, offset_adjustment);

	                    //
	                }
	                /*
	                var unanchored_offset = ctrl.get('unanchored_offset');
	                console.log('unanchored_offset', unanchored_offset);

	                if (unanchored_offset) {
	                    // want to find out what zone it is anchored in.
	                    var anchored_to = ctrl.get('anchored_to');
	                    var zone = anchored_to[2];

	                    console.log('zone', zone);

	                    if (zone == 'left' || zone == 'top' || zone == 'bottom') {
	                        ctrl_pos = jsgui.v_add(ctrl_pos, [unanchored_offset[0], 0]);
	                    }


	                    //
	                }
	                */


	                if (ctrl_pos[0] < 0) ctrl_pos[0] = 0;
	                if (ctrl_pos[1] < 0) ctrl_pos[1] = 0;

	                // clamping it so the right does not go outside the screen is more difficult.
	                // mousedown_offset_from_ctrl_lt

	                //console.log(window_size[0] - mousedown_offset_from_ctrl_lt[0]);


	                var ow = ctrl_el.offsetWidth;
	                var oh = ctrl_el.offsetHeight;
	                

	                if (ctrl_pos[0] > window_size[0] - ow) ctrl_pos[0] = window_size[0] - ow;
	                if (ctrl_pos[1] > window_size[1] - oh) ctrl_pos[1] = window_size[1] - oh;



	                //ctrl.style({
	                //    'left': pageX + 'px',
	                //    'top': pageY + 'px'
	                //});
	                
	                ctrl.style({
	                    'left': ctrl_pos[0] + 'px',
	                    'top': ctrl_pos[1] + 'px'
	                });


	                // If the ctrl is anchored, we need to unanchor it.



	                // as well as that, tell the control's context.
	                //  That could do things like scan for it being in an outside border.

	                ctrl._context.move_drag_ctrl(e_move, ctrl);

	                // so the context has been notified.
	                //  It can check for various things like the mouse being in an outer border region.

	                //  Other controls could check for the mouse being above them.





	                // also, it's worth telling the context about the drag.

	                // There could be docking regions set up.
	                //  Also, there could be different ways of implementing this.
	                //  I think comparing to the edge of the document.
	                //   Checking the cursor position in relation to the width of the screen.
	                //   Seeing if it is in an outer section.
	                //    If so, we can have a docking indication.

	                // Want to define the docking areas.
	                //  May need to dock an item next to another one.
	                //   So possibly invisible docking divs would help.

	                // This could also use a bit of a collision detection algorithm.

	                // Anyway, to start with the flexigrid should be able to dock to the top, left, bottom, or right.

	                // May be necessary to move the main content around, creating panels on the edges where the docked control stays.
	                //  I think rearranging the page layout using more than just the docked control will be necessary.

	                // Being able to flexibly change layouts will be useful.
	                //  With a page control, or an active control that is the main part of the page.

	                // Defining where side panels go.
	                //  Controls (elements) can have side panels put next to them.
	                //   Could be inside them in the DOM.
	                //    At the beginning or the end.
	                //  Could effectively split up a control into two columns, with the side panel being on the left.
	                //   Could go for up to four side panels.
	                //    And have 8 corner panels too.

	                // Division of a div into 9 seems like it would be very useful. Potentially 9.
	                //  Keeping the layout valid while making an abstraction for this will be very useful.

	                // Activating 9-panel functionality on a div...
	                //  I think I should do much of this in html enhancements.

	                //  Dom tools before control.
	                // And separate out control.
	                //  Then html builds on top of control, adds more
	                //  Then we have enh-control, which will still be used as a default in many cases.
	                //   Will have extra functionality which could be useful, but not part of the core control functionality.
	                //    These enhancements could then be made more modular.























	                // need to look into the get system.
	                //  this will also need to update the element too.
	                //  ctrl.render_inline_css
	                //   gets a string
	                //  ctrl.update_inline_css








	            }, function(e_end) {
	                // tell the context that the drag has ended.
	                var uo1 = ctrl.get('unanchored_offset');
	                //console.log('uo1', uo1);

	                ctrl._context.end_drag_ctrl(e_end, ctrl);

	                var uo2 = ctrl.get('unanchored_offset');
	                //console.log('uo2', uo2);

	                if (uo1 && uo2) {
	                    ctrl.set('unanchored_offset', null);
	                }

	                ctrl.set('offset_adjustment', null);

	                // and if it already has an unanchored_offset

	            });

	        },


	        // Possibly put this back?
	        //  But maybe don't want to be talking about click or touch too much, maybe talk about pointer actions.
	        /*
	        'click_to_select': function(ctrl) {
	            ctrl = ctrl || this;

	            this.click(function(e) {
	                // is control held down?
	                //console.log('e', e);
	                var ctrl_key = e.ctrlKey;
	                if (ctrl_key) {
	                    ctrl.action_select_toggle();
	                } else {
	                    ctrl.action_select_only();
	                }
	            });
	        },
	        */

	        'resize_handle_to': function(ctrl, handle_position) {
	        	// The control needs to be draggable normally?
	        	//  And then from the positions of where it is adjust the size of what it's a resize handle to?

	        	console.log('resize_handle_to');

	        	if (handle_position == 'right-bottom') {
	        		var fn_move = function(e_move) {
	        			console.log('e_move', e_move);
	        		}
	        		var fn_up = function(e_up) {
	        			console.log(e_up);
	        		}

	        		var doc = ctrl._context.ctrl_document;

	        		console.log('ctrl._context', ctrl._context);

	        		//var body = doc.get('content').get(1);
	        		//console.log('body', body);

	        		// The context should have access to the control_document.
	        		//throw 'stop';

	        		// Need to store the inital positions to work out differences between them.

	        		// pageX and PageY are reliable accross browsers.
	        		//  can be used to work out movement vector.

	        		// Maybe we use the original measured position of the window to work out the new size, along with the movement vector.




	        		var fn_move = function(e_move) {
        				console.log('e_move', e_move);
        			}

        			var fn_up = function(e_up) {
        				console.log('e_up', e_up);

        				doc.off('mousemove', fn_move);
        				doc.off('mouseup', fn_up);
        			}

	        		ctrl.on('mousedown', function(e_mousedown) {


	        			console.log('e_mousedown', e_mousedown);


	        			doc.on('mousemove', fn_move);
	        			doc.on('mouseup', fn_up);
	        		})



	        	}

	        },

	        'selectable': function(ctrl) {
	        	var that = this;
	        	ctrl = ctrl || this;

	        	that.click(function(e) {
					// is control held down?
					//console.log('e', e);
					var ctrl_key = e.ctrlKey;
					var meta_key = e.metaKey;

					//console.log('metaKey ' + e.metaKey);

					if (ctrl_key || meta_key) {
						ctrl.action_select_toggle();
					} else {
						ctrl.action_select_only();
					}
				});
	        },


	        'action_select_only': function() {
	            // needs to see what is within the selection_scope.
	            // this is a selection scope, or it refers to a control with that set to true that is an ancestor.
	            //  it could find such a control.
	            // not totally sure if the ancestor requirement is necessary, it may make sense and be best though.
	            //console.log('action_select ');
	            // I think a Selection_Scope object may make sense to hold the data.

	            // this.selection_scope.select_only(this);

	            //this.get('selection_scope').select_only(this);

	            //var ss = this.find_selection_scope();

	            // The selection scope shouls be a Selection_Scope object.

	            //  I think that it would make use of the B+ tree where needed.
	            // Need algorithmically fast operations to:
	            // Select or deselect an object
	            // Get all objects that are selected in the order in which they are listed in another control.
	            //  Though can get all objects that are selected quickly, then quickly get their indexes.
	            //  Do that without going through whole selection.

	            console.log('this ', this);
	            //ss.select_only(this);
	            this.find_selection_scope().select_only(this);

	        },

	        'action_select_toggle': function() {
	            this.find_selection_scope().select_toggle(this);
	        },


	        // So I think the resource-pool will have a selection scope.
	        'find_selection_scope': function() {
	            //console.log('find_selection_scope');

	            var res = this.get('selection_scope');
	            if (res) return res;

	            // look at the ancestor...

	            var parent = this.get('parent');
	            //console.log('parent ' + tof(parent));


	            if (parent) return parent.find_selection_scope();

	        },

			// Nice, this works. Not that efficiently yet.

			'make_full_height': function() {
				var el = this.get('dom.el');
				var viewportHeight = document.documentElement.clientHeight;


				var rect = el.getBoundingClientRect();
				console.log(rect.top, rect.right, rect.bottom, rect.left);

				var h = viewportHeight - rect.top;

				this.style('height', h + 'px', true);
			},
			'grid_9': function() {
				var res = this.get('grid_9');
				if (res) return res;

				res = new Grid_9({
					'context': this._context
				})
				//res.__type_name = 'control';
				res.set('dom.attributes.data-jsgui-type', 'control');
				// need to say it's a control too...

				var res_id = res._id();

				res.set('dom.attributes.data-jsgui-id', res_id);

				this._context.map_controls[res_id] = res;

				//res.set('')

				// transplant the content.
				

				var el = this.get('dom.el');
				// remove all child nodes???

				// can just insert the rendered grid9
				//console.log('pre res all_html_render')
				var html_grid_9 = res.all_html_render();
				var nel = document.createElement('div');

				//console.log('html_grid_9 ' + html_grid_9);

				nel.innerHTML = html_grid_9;

				var el_grid_9 = nel.childNodes[0];

				//console.log('el_grid_9 ' + el_grid_9);

				//console.log('el_grid_9.childNodes.length ' + el_grid_9.childNodes.length );

				

				el.insertBefore(el_grid_9, el.childNodes[0]);

				while (el.childNodes[1]) {
					el_grid_9.childNodes[1].childNodes[1].appendChild(el.childNodes[1]);
				}

				
				res.set('dom.el', el_grid_9);

				res.activate_recursive();
				// can't do it quite like that.
				//  maybe change for copying between collections.
				//  setting a collection, with a collection.
				//   should create a new copy?
				//    or reference it... 
				//   reference is better if it works.


				// get content should get a collection...
				//  but need to work on the Data_Object's set for when it is dealing with a collection.


				var current_content = this.get('content');

				//console.log('1) current_content.length() ' + current_content.length());
				//throw 'stop';

				// need to copy it somehow....

				var res_middle = res.get('content').get(1).get('content').get(1);
				//console.log('res_middle ' + res_middle);




				res_middle.set('content', current_content);

				//console.log('1) res content .length() ' + res.get('content').length());
				//console.log('1) res_middle content .length() ' + res_middle.get('content').length());


				this.get('content').clear();
				this.get('content').add(res);


				this.set('grid_9', res);

				//var current_content = this.get('content');

				//console.log('2) current_content.length() ' + current_content.length());

				// recursive activate...
				//  needs to activate from inside to outside.

				// When something gets anchored into a position in the Grid_9, the Grid_9 needs to handle it.

				
				return res;


			},

			// Is getting a bit verbose.
			//  Some things could be expressed more efficiently.
			//  However, right now don't want to create overall abstraction for this.

			// There will be grid_9 and a few other layouts that are fairly intrinsic to the system.




			'ensure_dock_placeholder': function(pos) {
				//console.log('enh ctrl ensure_dock_placeholder pos ' + pos);

				// and then we keep track of the dock placeholder.

				// would likely be easier to get a string by default?
				//  or easily get the value.

				// a val function that gets the value of it, if it has a value function.



				//val(dock_placeholder_pos)

				
				// use the grid_9's dock placeholder position?





				//console.log('dock_placeholder_pos ' + stringify(dock_placeholder_pos));
				//console.log('tof dock_placeholder_pos ' + tof(dock_placeholder_pos));
				var grid_9 = this.get('grid_9');
				var g9el = grid_9.get('dom.el');
				if (grid_9) {
					var dock_placeholder_pos = grid_9.get('dock_placeholder_pos');

					var t_stripe = grid_9.get('content').get(0);
					var m_stripe = grid_9.get('content').get(1);
					var cell_4 = m_stripe.get('content').get(1);
					var cell4_el = cell_4.get('dom.el');

					//console.log('dock_placeholder_pos ' + dock_placeholder_pos);
					//console.log('dock_placeholder_pos ' + tof(dock_placeholder_pos));
					//throw 'stop';
					if (dock_placeholder_pos) {
						// if the pos we have is different.
						var dpp_val;
						if (dock_placeholder_pos.value) {
							dpp_val = dock_placeholder_pos.value();
						} else {
							dpp_val = dock_placeholder_pos;
						}

						//dpp_val = dock_placeholder_pos.value();
						//console.log('dpp_val ' + dpp_val);

						if (!pos) {
							// remove it from wherever it is.
							if (dpp_val == 'left') {
								// need to set some styles, so that h_middle does not take the full width.
								//  reduce its width so that the placeholder can be accommodated.

								grid_9.close_placeholder();

								/*

								var g9w = g9el.offsetWidth;



								var g9c = grid_9.get('content');
								//console.log('g9c', g9c.length());
								
								//console.log('m_stripe', m_stripe);

								var cell_3 = m_stripe.get('content').get(0);

								// need to measure and shrink the central cell.
								
								//var w = cell4_el.offsetWidth;

								//console.log('w ' + w);

								// or remove that style declaration?
								cell_4.style({
									//'width': null
									'width': '100%'
								})



								//console.log('cell_3', cell_3);
								cell_3.remove_class('dock-placeholder');
								this.set('dock_placeholder_pos', false);

								*/
							}

							if (dpp_val == 'top') {
								//var g9c = grid_9.get('content');
								//console.log('g9c', g9c.length());
								//var m_stripe = grid_9.get('content').get(0);
								//console.log('m_stripe', m_stripe);

								grid_9.close_placeholder();

								/*
								var cell_1 = t_stripe.get('content').get(1);
								//console.log('cell_3', cell_3);
								cell_1.remove_class('dock-placeholder');
								this.set('dock_placeholder_pos', false);
								*/

							}

							if (dpp_val == 'right') {
								grid_9.close_placeholder();
								/*
								var cell_5 = grid_9.get('content').get(1).get('content').get(2);
								//console.log('cell_3', cell_3);
								cell_5.remove_class('dock-placeholder');
								this.set('dock_placeholder_pos', false);

								cell_4.style({
									//'width': null
									'width': '100%'
								})
								*/
							}

							if (dpp_val == 'bottom') {
								grid_9.close_placeholder();
							}

							// bottom 7
							//  like with others, the central div will need to be made a bit smaller.


						}

						//throw 'stop';



					} else {
						// put the placeholder in the position...
						//console.log('pos ' + pos);
						//throw 'stop';
						if (!pos) {
							// tell the grid9 to remove whichever class indicates its the placeholder.

							//throw 'stop';

						}

						if (pos == 'left') {
							//var g9c = grid_9.get('content');
							//console.log('g9c', g9c.length());

							grid_9.open_placeholder('left');

							/*

							var cw = document.documentElement.clientWidth;
							grid_9.style({
								'width': cw + 'px'
							})


							
							//console.log('m_stripe', m_stripe);
							var cell_3 = m_stripe.get('content').get(0);

							//var cell_4 = m_stripe.get('content').get(1);
							var cell3_el = cell_3.get('dom.el');
							//var cell4_el = cell_4.get('dom.el');
							var c4w = cell4_el.offsetWidth;

							//console.log('* c4w ' + c4w);

							//throw 'stop';
							//console.log('cell_3', cell_3);
							// ensure class?
							cell_3.add_class('dock-placeholder');

							var c3w = cell3_el.offsetWidth;
							var nw = c4w - c3w;
							//console.log('nw ' + nw);



							cell_4.style({
								'width': (nw) + 'px'
							})
							//console.log('* c3w ' + c3w);


							this.set('dock_placeholder_pos', 'left');

							*/
						}
						if (pos == 'top') {
							//var g9c = grid_9.get('content');
							//console.log('g9c', g9c.length());

							/*
							var m_stripe = grid_9.get('content').get(0);
							//console.log('m_stripe', m_stripe);
							var cell_1 = m_stripe.get('content').get(1);
							//console.log('cell_3', cell_3);
							// ensure class?
							cell_1.add_class('dock-placeholder');
							this.set('dock_placeholder_pos', 'top');
							*/

							grid_9.open_placeholder('top');
						}
						if (pos == 'right') {

							grid_9.open_placeholder('right');

							
						}

						//grid_9.open_placeholder('bottom');


						if (pos == 'bottom') {
							grid_9.open_placeholder('bottom');
						}
					}
				}
			},

			'unanchor': function() {
				var anchored_to = this.get('anchored_to');
				anchored_to[0].unanchor_ctrl(this);

			}

		})

		var Grid_9 = jsgui.Control.extend({
			'init': function(spec) {
				this._super(spec);

				// composition...
				//  need to create 3 stripes: top, v_middle, bottom
				//   then within each of them we have left, h_middle, right

				// in an array. The center is number 4.

				// 0 1 2
				// 3 4 5
				// 6 7 8
				this.__type_name == 'grid_9';

				this.set('dom.attributes.class', 'grid_9');
				var context = this._context;

				// if being given the element when it is constructed...

				// putting this into another control.
				//  we need to re-render the control fully, I think.

				// Is there a better way to put this into an existing document?

				// Render the HTML of it and everything inside it...
				//  Would need to reactivate / reattach events.
				//   Memory leak?

				// could maybe activate to make access to subcontrols more convenient?



				// we can detach and reattach.
				//  could have a specific mechanism for putting this in.

				// compose its html
				// render create the element.
				//  remove the existing element
				// put the grid9 element in (or is it simply 9 elements?) grid_9 could take an outer div, though we could possibly remove that.
				//  then put the element within position 4 of the grid9.

				var arr_v_names = ['top', 'v-middle', 'bottom'];
				var arr_h_names = ['left', 'h-middle', 'right'];

				if (!spec.el) {
					var c = 0;
					var arr_ctrls = new Array(9);
					for (var y = 0; y < 3; y++) {
						var stripe = new jsgui.Control({
							'context': context
						})
						stripe.set('dom.attributes.class', arr_v_names[y]);
						// could have the page context see what the free ids are, and then use them.
						//  would set the counter for each of them based on what has been found.

						stripe.set('dom.attributes.data-jsgui-type', stripe.__type_name);


						stripe.set('dom.attributes.data-jsgui-id', stripe._id());

						this.add(stripe);

						context.map_controls[stripe._id()] = stripe;

						for (var x = 0; x < 3; x++) {
							arr_ctrls[c] = new jsgui.Control({
								'context': context
							})
							arr_ctrls[c].set('dom.attributes.class', arr_h_names[x]);
							arr_ctrls[c].set('dom.attributes.data-jsgui-id', arr_ctrls[c]._id());
							arr_ctrls[c].set('dom.attributes.data-jsgui-type', arr_ctrls[c].__type_name);

							stripe.add(arr_ctrls[c]);

							context.map_controls[arr_ctrls[c]._id()] = arr_ctrls[c];
							c++;
						}
					}
					//console.log(this.get('content').length());
					//throw 'stop';	
				}


			},

			'unanchor_ctrl': function(ctrl) {
				var anchored_to = ctrl.get('anchored_to');
				var zone = anchored_to[2];
				console.log('unanchor_ctrl zone ' + zone);
				ctrl.remove_class('anchored');

				var unanchored_offset = ctrl.get('unanchored_offset');
				console.log('unanchored_offset', unanchored_offset);

				// But when unanchoring is done as part of a drag...
				//  need to recalculate the drag offset.

				//ctrl.offset(unanchored_offset);
				if (unanchored_offset) {
					if (zone !== 'right') {
						ctrl.set('offset_adjustment', [unanchored_offset[0], 0]);
					}

					
				}
				

				var t_stripe = this.get('content').get(0);
				var m_stripe = this.get('content').get(1);
				var cell_4 = m_stripe.get('content').get(1);
				var cell4_el = cell_4.get('dom.el');

				if (zone == 'left') {
					var cell_3 = m_stripe.get('content').get(0);

					//var cell_4 = m_stripe.get('content').get(1);
					var cell3_el = cell_3.get('dom.el');

					cell_3.remove_class('open');
				}

				if (zone == 'right') {
					//var c4w = document.documentElement.clientWidth;
					var cell_5 = this.get('content').get(1).get('content').get(2);
					cell_5.remove_class('dock-placeholder');

					/*
					this.set('open', 'right');
					var cell5_el = cell_5.get('dom.el');
					var c5w = cell5_el.offsetWidth;
					var nw = c4w - c5w;
					cell_4.style({
						'width': (nw) + 'px'
					})
					*/
				}


				anchored_to[0].close_placeholder(zone);



				ctrl.set('anchored_to', null);
				ctrl.set('unanchored_offset', null);

			},

			'anchor_ctrl': function(ctrl, zone) {
				// need to find the right nested subcontrol

				var x, y, found;
				if (zone == 'left') {
					x = 0; y = 1;
					found = true;
				}
				if (zone == 'top') {
					x = 1; y = 0;
					found = true;
				}
				if (zone == 'right') {
					x = 2; y = 1;
					found = true;
				}
				if (zone == 'bottom') {
					x = 1; y = 2;
					found = true;
				}

				var t_stripe = this.get('content').get(0);
				var m_stripe = this.get('content').get(1);
				var cell_4 = m_stripe.get('content').get(1);
				var cell4_el = cell_4.get('dom.el');

				if (found) {
					var grid_section = this.get('content').get(y).get('content').get(x);

					//console.log('grid_section ', grid_section);

					// need a way of inserting a control.
					//  Adding to the content, and having the control react to this and update the DOM?

					// may have ctrl.append(ctrl)
					//  which adds it to the content (and updates the DOM)
					// could also have an activated control listen out for content changes.
					//  so when something gets added in the content, it gets appended in the DOM too.
					//   I think that makes sense in terms of convenience.

					// Will mean making that left bar bigger so that it fits the flexi board.
					// also need to add the class 'open' or something to show that the grid section is open.

					// open a part of the grid section...
					//  best to get the grid_9 to do this.
					//  also would be good to get the grid_9 to show placeholders using its own methods.




					// And this will change the formatting of the grid_9
					//  Don't want that section to appear and dissipear.
					//  Don't show it as a placeholder when something is there...

					// Need to open a section of the Grid_9 / reposition things.
					//  Like when the placeholder is shown.

					// We want to actually open that section of the grid_9.
					var unanchored_offset = ctrl.offset();
					ctrl.set('unanchored_offset', unanchored_offset);

					console.log('unanchored_offset', unanchored_offset);

					ctrl.add_class('anchored');




					//console.log('');
					grid_section.add(ctrl);

					ctrl.set('anchored_to', [this, grid_section, zone]);
					var unanchored_size = ctrl.size();

					ctrl.set('unanchored_size', unanchored_size);




					// This is basically working now!
					//  Have automatic DOM append of added content.
					//   Need to get that working properly and tested in all cases though.


					if (zone == 'left') {
						console.log ('left zone');
						var cw = document.documentElement.clientWidth;
						this.style({
							'width': cw + 'px'
						})
						//console.log('m_stripe', m_stripe);
						var cell_3 = m_stripe.get('content').get(0);

						//var cell_4 = m_stripe.get('content').get(1);
						var cell3_el = cell_3.get('dom.el');
						//var cell4_el = cell_4.get('dom.el');
						var c4w = cell4_el.offsetWidth;
						cell_3.add_class('open');

						var c3w = cell3_el.offsetWidth;
						var nw = c4w - c3w;
						cell_4.style({
							'width': (nw) + 'px'
						})
					}

					if (zone == 'right') {
						var c4w = document.documentElement.clientWidth;
						var cell_5 = this.get('content').get(1).get('content').get(2);
						cell_5.add_class('dock-placeholder');
						this.set('open', 'right');
						var cell5_el = cell_5.get('dom.el');
						var c5w = cell5_el.offsetWidth;
						var nw = c4w - c5w;
						cell_4.style({
							'width': (nw) + 'px'
						})
					}

					if (zone == 'bottom') {
						var c = document.documentElement.clientHeight;
						var cell_7 = this.get('content').get(2).get('content').get(1);
						cell_7.add_class('open');
						this.set('dock_placeholder_pos', 'bottom');
						var cell7_el = cell_7.get('dom.el');
						var c7h = cell7_el.offsetHeight;
						//console.log('c7h ' + c7h);
						var nh = c - c7h;
						//console.log('nh ' + nh);
						m_stripe.style({
							'height': (nh) + 'px'
						})
					}



					//grid_section.anchor_ctrl(ctrl);
				}



				


			},
			'open_placeholder': function(zone) {
				//console.log('grid_9 open_placeholder ' + zone);

				var t_stripe = this.get('content').get(0);
				var m_stripe = this.get('content').get(1);
				var cell_4 = m_stripe.get('content').get(1);
				var cell4_el = cell_4.get('dom.el');

				if (zone == 'left') {
					var cw = document.documentElement.clientWidth;
					this.style({
						'width': cw + 'px'
					})
					//console.log('m_stripe', m_stripe);
					var cell_3 = m_stripe.get('content').get(0);

					//var cell_4 = m_stripe.get('content').get(1);
					var cell3_el = cell_3.get('dom.el');
					//var cell4_el = cell_4.get('dom.el');
					var c4w = cell4_el.offsetWidth;
					cell_3.add_class('dock-placeholder');

					var c3w = cell3_el.offsetWidth;
					var nw = c4w - c3w;
					cell_4.style({
						'width': (nw) + 'px'
					})
					this.set('dock_placeholder_pos', 'left');
				}

				if (zone == 'top') {
					//var m_stripe = grid_9.get('content').get(0);
							//console.log('m_stripe', m_stripe);
					var cell_1 = t_stripe.get('content').get(1);
					//console.log('cell_3', cell_3);
					// ensure class?
					cell_1.add_class('dock-placeholder');
					this.set('dock_placeholder_pos', 'top');
				}

				if (zone == 'right') {
					var c4w = document.documentElement.clientWidth;
					var cell_5 = this.get('content').get(1).get('content').get(2);
					cell_5.add_class('dock-placeholder');
					this.set('dock_placeholder_pos', 'right');


					//var c4w = cell4_el.offsetWidth;
					


					//console.log('c4w ' + c4w);
					//cell_5.add_class('dock-placeholder');

					var cell5_el = cell_5.get('dom.el');


					// use the full page width.




					var c5w = cell5_el.offsetWidth;
					//console.log('c5w ' + c5w);
					var nw = c4w - c5w;
					//console.log('nw ' + nw);
					cell_4.style({
						'width': (nw) + 'px'
					})

				}

				if (zone == 'bottom') {
					var c = document.documentElement.clientHeight;
					var cell_7 = this.get('content').get(2).get('content').get(1);
					cell_7.add_class('dock-placeholder');
					this.set('dock_placeholder_pos', 'bottom');


					//var c4w = cell4_el.offsetWidth;
					


					//console.log('c4w ' + c4w);
					//cell_5.add_class('dock-placeholder');

					var cell7_el = cell_7.get('dom.el');


					// use the full page width.


					//var c4h = cell4_el.offsetHeight;
					// get the offset height of the middle stripe, that's the one who's height we should change.




					var c7h = cell7_el.offsetHeight;
					//console.log('c7h ' + c7h);
					var nh = c - c7h;
					//console.log('nh ' + nh);
					m_stripe.style({
						'height': (nh) + 'px'
					})
				}

			},
			'close_placeholder': function() {
				var dppos = this.get('dock_placeholder_pos');
				if (dppos && dppos.value) dppos = dppos.value();

				var t_stripe = this.get('content').get(0);

				var m_stripe = this.get('content').get(1);
				var cell_4 = m_stripe.get('content').get(1);

				if (dppos == 'left') {
					var el = this.get('dom.el');
					var g9w = el.offsetWidth;

					var g9c = this.get('content');
					//console.log('g9c', g9c.length());
					
					//console.log('m_stripe', m_stripe);

					var cell_3 = m_stripe.get('content').get(0);

					// need to measure and shrink the central cell.
					
					//var w = cell4_el.offsetWidth;

					//console.log('w ' + w);

					// or remove that style declaration?
					cell_4.style({
						//'width': null
						'width': '100%'
					})



					//console.log('cell_3', cell_3);
					cell_3.remove_class('dock-placeholder');
					this.set('dock_placeholder_pos', false);

				}

				if (dppos == 'top') {
					var cell_1 = t_stripe.get('content').get(1);
					//console.log('cell_3', cell_3);
					cell_1.remove_class('dock-placeholder');
					this.set('dock_placeholder_pos', false);
				}

				if (dppos == 'right') {
					var cell_5 = this.get('content').get(1).get('content').get(2);
					//console.log('cell_3', cell_3);
					cell_5.remove_class('dock-placeholder');
					this.set('dock_placeholder_pos', false);
					cell_4.style({
						//'width': null
						'width': '100%'
					})
				}

				if (dppos == 'bottom') {
					var cell_7 = this.get('content').get(2).get('content').get(1);
					//console.log('cell_3', cell_3);
					cell_7.remove_class('dock-placeholder');
					this.set('dock_placeholder_pos', false);

					m_stripe.style({
						'height': '100%'
					})
				}


				/*
				var g9w = g9el.offsetWidth;



								var g9c = grid_9.get('content');
								//console.log('g9c', g9c.length());
								
								//console.log('m_stripe', m_stripe);

								var cell_3 = m_stripe.get('content').get(0);

								// need to measure and shrink the central cell.
								
								//var w = cell4_el.offsetWidth;

								//console.log('w ' + w);

								// or remove that style declaration?
								cell_4.style({
									//'width': null
									'width': '100%'
								})



								//console.log('cell_3', cell_3);
								cell_3.remove_class('dock-placeholder');
								this.set('dock_placeholder_pos', false);
				*/
			}


			// the grid_9 also needs to be activated.
			//  the controls within it need attachments to their elements.
			//  maybe grid_9 does not need more code in itself... just needs activate to be called when it's in the DOM.



		});
		//jsgui.Control = Control;




		// Selection scope...
		//  Can select the whole thing, can select parts of it.

		// Don't want too much code to do with selection in the UI control itself.



		// Space saving measures?
		//  Declaring a buch of subcontrols with properties?
		//  Doing so as XML? As JSON?


		// Movable
		// Resizable
		// Rotatable
		// Deletable
		// Editable
		// Reorderable
		// Creatable

		// Actionable
		//  (actionable behaviours)

		// They will vary quite a lot and probably can't all fit into one way of doing things.

		// Want a very easy way to set these up.

		// Using groups too.

		// Behaviours seem like a good way of expressing action-reaction.
		//  


	    var recursive_dom_iterate = function (el, callback) {
	        //console.log('recursive_dom_iterate');
	        callback(el);

	        //console.log('tof(el.childNodes) ' + tof(el.childNodes));

	        //each(el.childNodes, function(i, v) {
	        //	console.log('v ' + v);
	        //});

	        //console.log('el.childNodes.length ' + el.childNodes.length);
	        var cns = el.childNodes;
            console.log('el', el);
            console.log('cns.length', cns.length);
	        for (var c = 0, l = cns.length; c < l; c++) {
	            recursive_dom_iterate(cns[c], callback);
	        }
	    }

	    var recursive_dom_iterate_depth = function (el, callback) {
	        //console.log('recursive_dom_iterate');
	        

	        //console.log('tof(el.childNodes) ' + tof(el.childNodes));

	        //each(el.childNodes, function(i, v) {
	        //  console.log('v ' + v);
	        //});

	        //console.log('el.childNodes.length ' + el.childNodes.length);
	        var cns = el.childNodes;
	        for (var c = 0, l = cns.length; c < l; c++) {
	            recursive_dom_iterate_depth(cns[c], callback);
	        }
	        callback(el);
	    }


	    // Want the document node to be linked with the context when activated (automatically)

	    // We find the html element control. That is the one that gets set to be the context's ctrl_document.




		var activate = function(context) {
	        // The context should already have the map of controls.

	        // Not so sure we can have the client page context here - does it use resources?

	        //ensure_Context_Menu_loaded(function(_Context_Menu) {
	        	//Context_Menu = _Context_Menu;

	        	if (!context) {
		        	throw 'jsgui-html-enh activate(context) - need to supply context parameter.';
		        }
		        //context = context || new Page_Context();

		        //console.log('jsgui-html-enh activate context', context);

		        var map_jsgui_els = {};
		        var map_jsgui_types = {};

		        //console.log('activate - beginning mapping');

		        // Could put together the array of controls in order found.

		        var arr_controls = [];
		        // element registration
		        // Recursive iteration where the innermost get called first....
		        //  Would be useful here.

		        // counting up the typed id numbers.

		        var max_typed_ids = {};

		        var id_before__ = function(id) {
		            var pos1 = id.lastIndexOf('_');
		            var res = id.substr(0, pos1);
		            return res;
		        }

		        var num_after = function(id) {
		            var pos1 = id.lastIndexOf('_');
		            var res = parseInt(id.substr(pos1 + 1), 10);
		            return res;
		        }

		        recursive_dom_iterate(document, function(el) {
		            console.log('2) el.tagName ' + el.tagName);
		            var nt = el.nodeType;
		            //console.log('nt ' + nt);

		            // So for the 'HTML' tag name...
		            //  We should make a control for the HTML document - or it should get activated.



		            if (nt == 1) {
		                var jsgui_id = el.getAttribute('data-jsgui-id');
		                // Give the HTML document an ID?


		                //console.log('jsgui_id ' + jsgui_id);
		                if (jsgui_id) {
		                    var ib = id_before__(jsgui_id);
		                    var num =  num_after(jsgui_id);
		                    if (!max_typed_ids[ib]) {
		                        max_typed_ids[ib] = num;
		                    } else {
		                        if (num > max_typed_ids[ib]) max_typed_ids[ib] = num;
		                    }

		                    map_jsgui_els[jsgui_id] = el;
		                    var jsgui_type = el.getAttribute('data-jsgui-type');
		                    //console.log('jsgui_type ' + jsgui_type);
		                    map_jsgui_types[jsgui_id] = jsgui_type;
		                    //console.log('jsgui_type ' + jsgui_type);
		                }
		            }
		        });
		        context.set_max_ids(max_typed_ids);
		        //console.log('max_typed_ids ' + stringify(max_typed_ids));
		        //throw 'stop';
		        //console.log('activate - finished mapping');

		        // Then activate
		        //  (but an activation where it does not yet know the references to various necessary other controls)
		        //  This is about creating the controls, within the page_context.

		        // if the control does not have its own recursive activation...
		        //  Do the control creation, then there should be various properties and behaviours that get set.

		        // create the controls.
		        //console.log('map_jsgui_types ' + stringify(map_jsgui_types));
		        //console.log('map_jsgui_els ' + stringify(map_jsgui_els));

		        //console.log('map_controls_by_type ' + stringify(map_controls_by_type));
		        //throw 'stop';

		        //console.log('context.map_controls', context.map_controls);
				//console.log('map_jsgui_types', map_jsgui_types);

		        var map_controls = context.map_controls;
		        // Control construction and registration
		        each(map_jsgui_els, function(jsgui_id, el) {
		            //console.log('jsgui_id ' + jsgui_id);
		            //console.log('3) el.tagName ' + el.tagName);
		            var l_tag_name = el.tagName.toLowerCase();
		            if (jsgui_id) {
		                var type = map_jsgui_types[jsgui_id];
		                //console.log('type ' + type);
		                //var cstr = jsgui.constructor_from_type(type);

		                //var cstr = jsgui.constructor_from_type(type);

		                //console.log('cstr ' + cstr);

		                // use the context's map_Controls

		                var Cstr = context.map_Controls[type];
		                //console.log('Cstr ' + Cstr.prototype);

		                // then we can construct the control, and put it within the map.
		                //  A later stage of activation will recreate the relationships between the controls.

		                // OK, but have we got variables to initialize the controls with?
		                //  It would maybe be most efficient to take delivery of them as one object.
		                //   With just the control types and the data contained in them we can do a lot of reconstruction of the actual controls.

		                // With the object viewer, we can even reconstruct the initial object from the rendered view.
		                //  Not sure quite how much point there is in doing that. May work out most efficient because 1st view is prerendered and
		                //  it does not need to send the data twice.
		                // Eg can hook up the key (viewer), the value (viewer) and the comma.

		                // for the document element we specifically add the control to the context.



		                if (Cstr) {
		                	var ctrl = new Cstr({
			                    'context': context,
			                    '_id': jsgui_id,
			                    'el': el
			                })
			                map_controls[jsgui_id] = ctrl;
			                arr_controls.push(ctrl);

			                //console.log('el.tagName', el.tagName);

			                if (l_tag_name === 'html') {
			                	//console.log('el is document root el');

			                	// The html element represents the root of a document.
			                	//throw '2) stop';

			                	context.ctrl_document = ctrl;
			                }
		                } else {
		                	console.log('Missing context.map_Controls for type ' + type + ', using generic Control');
		                	var ctrl = new Control({
			                    'context': context,
			                    '_id': jsgui_id,
			                    'el': el
			                })
			                map_controls[jsgui_id] = ctrl;
			                arr_controls.push(ctrl);

		                }

		                
		                //console.log('jsgui_id ' + jsgui_id);
		                //console.log('ctrl._id() ' + ctrl._id());
		                
		            }
		            // get the constructor from the id?
		        });
		        //console.log('arr_controls ' + stringify(arr_controls));
		        // depth-first activation?
		        //  But connecting up the activated subcontrols with the control getting activated?
		        //   They could be the content.

                console.log('pre recursive_dom_iterate_depth');
		        recursive_dom_iterate_depth(document, function(el) {
		            //console.log('el ' + el);
		            var nt = el.nodeType;
		            //console.log('nt ' + nt);
		            if (nt == 1) {
		                var jsgui_id = el.getAttribute('data-jsgui-id');
		                //console.log('* jsgui_id ' + jsgui_id);
		                if (jsgui_id) {
		                    
		                    var ctrl = map_controls[jsgui_id];
		                    ctrl.__activating == true;
		                    //console.log('tof ctrl ' + tof(ctrl));
		                    ctrl.activate();
		                    ctrl.__activating == false;
		                    //console.log('jsgui_type ' + jsgui_type);
		                }
		            }
		        });

                // Image uploader seems not to be activating properly...

	        //})

	        //  constructors.

	        // should activate with the context.

		        

	        //console.log('done activate rdi');

	        /*

	        each(arr_controls, function(i, ctrl) {
	            // Call activate on the control...
	            //  usually it's going to set up the contents.


	            // activate_contents activate_control_contents

	            ctrl.activate();
	            // Activate from bottom up
	            //  Most inwards, upwards?

	            //  So inner controls are active by the time it reaches outside....



	        });
	        */

	        // Then another rec dom it.
	        //  When activating various controls, we'll be looking for specific subcontrols to get a reference to.
	        //  Don't want to wrap the elements like with jQuery.

	        // then wen need to find the constructor for various controls.
	        //  possibly do it for all controls.
	        //  for text spans, we read it and assign the properites.

	        // Think we should activate everything.
	        //  Create the controls
	        //  Give them references to the page context

	        // Then give the controls references to each other.
	        //  Some of the controls will be fields of other controls.
	        //  We can make sure these get sent from the server so they can be activated on the client.
	        //   Could maybe have 'relationships' where various other controls are given by jsgui-id that do something on a control.
	        //   They are really control fields.

	        // So an object editor may have the open and close control fields.

	    }

	    var core_extension = str_arr_mapify(function (tagName) {
	        jsgui[tagName] = Control.extend({
	            'init': function (spec) {
	                //spec.tagName = tagName;

	                //console.log('core extension tagName ' + tagName);

	                this._super(spec);

	                this.get('dom').set('tagName', tagName);
	                // dom.tagName?

	            }
	        });
	        jsgui[tagName].prototype._tag_name = tagName;
	        map_Controls[tagName] = jsgui[tagName];
	    });

	    var core_extension_no_closing_tag = str_arr_mapify(function (tagName) {
	        jsgui[tagName] = Control.extend({
	            'init': function (spec) {
	                //spec.tagName = tagName;

	                //console.log('core extension tagName ' + tagName);

	                this._super(spec);

	                this.get('dom').set('tagName', tagName);
	                this.get('dom').set('noClosingTag', true);
	                // dom.tagName?

	            }
	        });
	        jsgui[tagName].prototype._tag_name = tagName;
	        map_Controls[tagName] = jsgui[tagName];
	    });




	    core_extension('html head title body div span h1 h2 h3 h4 h5 label p a script button form img ul li audio video');
	    core_extension_no_closing_tag('link input');
	    // link tag needs to have no closing tag.
	    //  core_extension_no_closing_tag


	    // the jsgui.script object needs more fields.
	    //  the jsgui data system has become more restrictive, in that fields / attributes need to be specified.

	    // dom.attributes.type being part of script.

	    // jsgui.script.fields().add('dom.attributes.type')

	    //  It may be nice to have this more flexible again.

	    // but with label we want a bit more...

	    jsgui.Label = Control.extend({
	        // a field for 'for'
	        'fields': [
	            ['for', 'control']
	            // needs to be able to deal with fields of the type 'control'.


	        ],

	        'init': function (spec) {
	            // for property, and it's tagName gets set too.
	            this._super(spec);
	            this.set('dom.tagName', 'label');


	            //console.log(spec.for);
	            //throw stop;
	            // content rather than text.
	        },
	        'beforeRenderDomAttributes': function () {
	            //this.set('dom.name')

	            //var dom = this.get('dom');
	            //console.log('');

	            //console.log('');
	            //var dom_attributes = this.get('dom.attributes');

	            //console.log('dom ' + stringify(dom));
	            //console.log('dom_attributes ' + dom_attributes);

	            //throw 'stop';

	            
	            //console.log('domAttributes ' + stringify(domAttributes));
	            //if (this.)
	            //console.log('this._ ' + stringify(this._));
	            var _for = this.get('for');



	            //console.log('tof(_for) ' + tof(_for));
	            //throw 'stop';

	            if (tof(_for) == 'control') {
	                // we use that control's _id() as thr for in the dom attributes.
	                var domAttributes = this.get('dom.attributes');
	                domAttributes.set('for', _for._id());
	            }

	            //console.log('_for ' + stringify(_for));
	            //throw 'stop';
	            /*
				var groupName = this.get('group_name').get();
				var checked = this.get('checked').get();
				var value = this.get('value').get();
				//console.log('checked ' + stringify(checked));
				//throw 'stop';
				if (groupName) {
					domAttributes.set('name', groupName);
				}
				if (checked) {
					domAttributes.set('checked', checked.toString());
				}
				if (is_defined(value)) {
					domAttributes.set('value', value);
				}
				*/
	        }
	    });

		var HTML_Document = jsgui.html.extend({
	        // no tag to render...
	        //  but has dtd.

	        'render_dtd': function () {
	            return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n';
	        }


	        /*
	        'all_html_render': function () {



	            //if (this.pre_all_html_render) {
	            //	
	            //}
	            var that = this;
	            var res = [];

	            this.pre_all_html_render();

	            var dom = this.get('dom');

	            if (dom) {

	                res.push(that.render_dtd());

	                // the super all_html_render.


	                res.push(this._super());
	                //res.push(that.render_content());

	                //res.push(

	                // does it have innerHTML?
	                //  I think that will just be a content item that gets rendered anyway.
	                //console.log('has dom');

	                //var beginning = this.renderBeginTagToHtml();
	                //var middle = this.all_html_render_internal_controls();
	                //var end = this.renderEndTagToHtml();
	                //var appendment = this.renderHtmlAppendment();

	                //console.log('beginning ' + beginning);
	                //console.log('middle ' + middle);
	                //console.log('end ' + end);

	                //res = [beginning, middle, end, appendment].join('');
	                //throw ('stop');
	            }

	            
	        	
	        	//if (this.dom && this.dom._ && this.dom._.innerHtml) {
	        	//	res = [this.renderBeginTagToHtml(), this.dom._.innerHtml, this.renderEndTagToHtml(), this.renderHtmlAppendment()].join('');
	        	//} else {
	        	//	res = [this.renderBeginTagToHtml(), this.all_html_render_internal_controls(), this.renderEndTagToHtml(), this.renderHtmlAppendment()].join('');
	        	//};
	        	
	            return res.join('');
	        }
	        */

	    });

	    var Blank_HTML_Document = HTML_Document.extend({
	        'init': function (spec) {
	            this._super(spec);

	            var context = this._context;
	            //console.log('context ' + context);

	            if (!spec.el) {
	            	var head = new jsgui.head({
		                'context': context
		            });
		            this.get('content').add(head);

		            var title = new jsgui.title({
		                'context': context
		            });
		            head.get('content').add(title);

		            var body = new jsgui.body({
		                'context': context
		            });
		            this.get('content').add(body);

		            // and have .head, .title, .body?

		            // useful shortcuts?
		            this.set('head', head);
		            this.set('title', title);
		            this.set('body', body);

		            //this.head = head;
		            //this.title = title;
		            //this.body = body;

		            // Maybe connecting control fields?
		            this.connect_fields(['head', 'body', 'title']);
	            }

	            

	            //console.log('content ' + stringify(this.get('content')));

	            //throw 'stop';

	            //console.log('');
	            //console.log('end init Blank_HTML_Document this._ ' + stringify(this._));
	        },
	        'body': fp(function(a, sig) {
	        	console.log('body sig', sig);
	        	if (sig =='[]') {
	        		// find the body control.

	        		var content = this.get('content');
	        		//console.log('content', content);
	        		var body = content.get(1);
	        		//console.log('body', body);
	        		//throw 'stop';

	        		return body;
	        	}
	        })
	    });

        // Want a body function in other nodes, available throughout the document?



	    var Client_HTML_Document = Blank_HTML_Document.extend({
	        'init': function (spec) {
	            this._super(spec);

	            //spec.context.ctrl_document = this;
	            this.active();

	        },

	        'include_js': function(url) {
	            var head = this.get('head');
	            // create jsgui.script

	            var script = new jsgui.script({
	                //<script type="text/JavaScript" src="abc.js"></script>
	                'context': this._context
	            })
	            // <script data-main="scripts/main" src="scripts/require.js"></script>
	            var dom = script.get('dom');
	            //console.log('* dom ' + stringify(dom));

	            //var domAttributes = script.get('dom.attributes');
	            var domAttributes = dom.get('attributes');
	            //console.log('domAttributes ' + domAttributes);

	            domAttributes.set('type', 'text/javascript');
	            //domAttributes.set('src', '/js/require.js');
	            domAttributes.set('src', url);
	            head.content().add(script);
	        },

	        'include_css': function(url) {
	            var head = this.get('head');
	            // create jsgui.script
	            
	            // <link rel="stylesheet" type="text/css" href="theme.css">

	            var link = new jsgui.link({
	                //<script type="text/JavaScript" src="abc.js"></script>
	                'context': this._context
	            })
	            // <script data-main="scripts/main" src="scripts/require.js"></script>
	            var dom = link.get('dom');
	            //console.log('* dom ' + stringify(dom));

	            //var domAttributes = script.get('dom.attributes');
	            var domAttributes = dom.get('attributes');
	            //console.log('domAttributes ' + domAttributes);

	            domAttributes.set('rel', 'stylesheet');
	            domAttributes.set('type', 'text/css');
	            //domAttributes.set('src', '/js/require.js');
	            domAttributes.set('href', url);
	            head.content().add(link);
	        },

	        
	        'include_jsgui_client': function(js_file_require_data_main) {

	        	// Could add the default client file.

	        	// Or a specific client file with a control that also has client-side code.
	        	//  The client-side code won't get processed on the server.
	        	//  There will be a specific place where client side code gets called upon activation.

	        	// could include a specific parameter for js_file_require_data_main

	        	js_file_require_data_main = js_file_require_data_main || '/js/web/jsgui-html-client';

	            // Needs to add various script references to the body.
	            //  May just be one client.js file
	            //  Then will work on having it build quickly
	            //  Then will work on making it stay fast to build and be smaller.

	            // include the script in the body?
	            //  is there a way to keep it at the end of the body?
	            //  could put it in the head for the moment.

	            var head = this.get('head');
	            // create jsgui.script

	            var script = new jsgui.script({
	                //<script type="text/JavaScript" src="abc.js"></script>
	                'context': this._context
	            })
	            // <script data-main="scripts/main" src="scripts/require.js"></script>

	            //var dom = script.get('dom');
	            //console.log('* dom ' + stringify(dom));

	            //var domAttributes = script.get('dom.attributes');
	            //var domAttributes = dom.get('attributes');
	            var domAttributes = script.get('dom.attributes');

	            //console.log('domAttributes ' + domAttributes);



	            //domAttributes.set('type', 'text/javascript');
	            //domAttributes.set('src', '/js/require.js');
	            //domAttributes.set('data-main', js_file_require_data_main);
	            domAttributes.set({
	                'type': 'text/javascript',
	                'src': '/js/web/require.js',
	                'data-main': js_file_require_data_main
	            });


	            //script.set('dom.attributes.type', 'text/javascript');
	            //script.set('dom.attributes.src', 'js/jsgui-client.js');
	            //script.set('dom.attributes.src', 'js/require.js');
	            //script.set('dom.attributes.data-main', 'js/jsgui-client.js');
	            //script.set('dom.attributes.data-main', js_file_require_data_main);


	            head.add(script);
	            //throw 'stop';

	        },

	        'include_jsgui_resource_client': function(path) {

	            // Could add the default client file.

	            // Or a specific client file with a control that also has client-side code.
	            //  The client-side code won't get processed on the server.
	            //  There will be a specific place where client side code gets called upon activation.

	            // could include a specific parameter for js_file_require_data_main

	            var js_file_require_data_main = path || '/js/web/jsgui-html-resource-client';
	            this.include_jsgui_client(js_file_require_data_main);

	        },
	        'include_client_css': function() {
	            var head = this.get('head');
	            var link = new jsgui.link({
	                //<script type="text/JavaScript" src="abc.js"></script>
	                'context': this._context

	            });
	            //var lda = link.get('dom.attributes');
	            //var dom = link.get('dom');
	            //console.log('* dom ' + stringify(dom));

	            //var domAttributes = script.get('dom.attributes');
	            var domAttributes = link.get('dom.attributes');

	            domAttributes.set('rel', 'stylesheet');
	            domAttributes.set('type', 'text/css');
	            domAttributes.set('href', '/css/basic.css');

	            head.content().add(link);
	            // <link rel="stylesheet" type="text/css" href="theme.css">
	        }

	        // also need to include jsgui client css



	    });




		// Behaviours...
		//  (May be like flags?)
		//  Selectable
		//  Dragable
		//  Drop-Zone

		// These need to be done in a way to make controls take less code.


		
		jsgui.activate = activate;
		jsgui.recursive_dom_iterate = recursive_dom_iterate;
		jsgui.recursive_dom_iterate_depth = recursive_dom_iterate_depth;
		jsgui.get_window_size = get_window_size;
		jsgui.Client_HTML_Document = Client_HTML_Document;

		// And a Page_Control as well...





		jsgui.hover_class = hover_class;
		jsgui.group_hover_class = group_hover_class;

		//return jsgui;

        module.exports = jsgui;

	//}
//);