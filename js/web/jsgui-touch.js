
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["./jsgui-html"], function(jsgui) {
	
	// Nicely separates this.
	
    //This function is called when scripts/helper/util.js is loaded.
	
	//alert('jsgui-lang has loaded');
	//alert('mobile client jsgui ' + jsgui);
	//alert(jsgui.get_inline_css_dict_from_style);
	
	// Will require other code as well.
	
	// will modify the jsgui object as a mobile client
	//  or just wrap it up.
	
	// Less modular in the current way, creating a modified jsgui object?
	
	// Maybe do things in a more modular way - don't necessarily extend things onto the jsgui object.
	
	// But to begin with we mainly want to separate concerns.
	
	// We still want many things through the jsgui object. 
	//  ??? Or embrace modules more?
	
	// May need to merge functionality into the jsgui object.
	//  Will work for various incremental systems - touch requires html for example.
	
	jsgui.listen_for_swipe = function(dom_node, callbacks) {
		// can be given an array
		// can be given an object with named parameters.
		
		var single_touch_start_screen_pos;
		var touch_action = null;
		var touch_event_bubble = false;
		
		var i_moves_until_bearings_test = 1;
		
		var moves_until_bearings_test = i_moves_until_bearings_test;
		var move_events = 0;
		// initial number of moves
		
		// then a later number ov moves
		
		var l_moves_until_bearings_test = 8;
		var _2pi = 2 * Math.PI;
		// listen for swipe release.
		
		var deg_tolerance_from_line = 18;
		
		var deg_left_swipe = 270;
		
		var l_bound_left = deg_left_swipe - deg_tolerance_from_line;
		var u_bound_left = deg_left_swipe + deg_tolerance_from_line;
		
		var deg_right_swipe = 90;
		
		var l_bound_right = deg_right_swipe - deg_tolerance_from_line;
		var u_bound_right = deg_right_swipe + deg_tolerance_from_line;
		
		var test_swipe_left_angle = function(deg_angle) {
			return deg_angle >= l_bound_left && deg_angle <= u_bound_left;
		};
		
		// also assessing tolerance for 0 degrees
		
		var deg_down_swipe = 180;
		
		var l_bound_down = deg_down_swipe - deg_tolerance_from_line;
		var u_bound_down = deg_down_swipe + deg_tolerance_from_line;
		
		var test_swipe_down_angle = function(deg_angle) {
			return deg_angle >= l_bound_down && deg_angle <= u_bound_down;
		};
		
		// with up, will check for 2 ranges
		// 360-tolerance to 360
		// 0 to tolerance
		
		var test_swipe_up_angle = function(deg_angle) {
			return ((deg_angle >= 360 - deg_tolerance_from_line && deg_angle <= 360) || (deg_angle >= 0 && deg_angle <= deg_tolerance_from_line));

		};
		
		var test_swipe_right_angle = function(deg_angle) {
			return deg_angle >= l_bound_right && deg_angle <= u_bound_right;
		};
		
		// (at/2pi) * 320
		// think I can optimize direction code not to use trig.
		
		var get_bearing = function(vector) {
			var at = Math.atan2(vector[0], vector[1]);
			var at2 = ((at / (_2pi)) * -360) + 180;
			
			if (at2 < 0) at2 = at2 + 360;
			if (at2 > 360) at2 = at2 - 360;
			return at2;
		}
		// the ratios method seems like it will be the right way.
		
		var direction_from_vector = function(vector) {
			// needs to be quicker than the bearing method.
			// needs to look into ratios, and avoid /0 problem.
			// % variance 
			// how far from varios ratios are things?
			
			var bearing = get_bearing(vector);
			if (test_swipe_up_angle(bearing)) {
				return 1;
			}
			if (test_swipe_down_angle(bearing)) {
				return 7;
			}
			if (test_swipe_left_angle(bearing)) {
				return 3;
			} else if (test_swipe_right_angle(bearing)) {
				return 5;
			}
			return -1;
		};
		
		var event_swipe_move = function(evt) {
			//ctrl_info.dom.node.innerHTML = 'swipe_move direction: ' + evt.direction; 
			//log('swipe_move direction: ' + evt.direction + ', offset: ' + evt.offset);
			if (callbacks['move']) {
				callbacks['move'](evt);
			}
		}
		var event_swipe_complete = function(evt) {
			//log (evt.direction + ' swipe complete, move_events ' + move_events)
			move_events = 0;
			moves_until_bearings_test = i_moves_until_bearings_test;
			
			if (callbacks['end']) {
				callbacks['end'](evt);
			}
		}
		var event_swipe_cancelled = function(evt) {
			// like if the swipe goes out of the angular band or back to magnitude < 5
			//  maybe if it takes too long
			
			//log ('swipe cancelled');
			move_events = 0;
			moves_until_bearings_test = i_moves_until_bearings_test;
			single_touch_start_screen_pos = null;
			var touch_action = 'cancelled';
			
			if (callbacks['cancelled']) {
				callbacks['cancelled'](evt);
			}
		}

		//var log = function(data) {
		//	ctrl_info.dom.node.innerHTML = ctrl_info.dom.node.innerHTML + data + '<br />';
		//}
		
		var event_swipe_start = function(evt) {
			//ctrl_info.dom.node.innerHTML = 'swipe_start direction: ' + evt.direction; 
			//log('swipe_start direction: ' + evt.direction + ', offset: ' + evt.offset);
			if (callbacks['start']) {
				callbacks['start'](evt);
			}
		}
		
		var direction_names = ['ul', 'up', 'ur', 'left', 'centre', 'right', 'dl', 'down', 'dr'];
		// Could compress this when it's doing more. For the moment, the 9KB library size means there is space for a fair bit more within the 12 KB.
		//  There is also some more scope for cutting things down further in places.
		
		var browser_api_touch_events = {
			'start': function(e) {
				//console.log('touchdown');
				//var i_moves_until_bearings_test = 1;
				//var moves_until_bearings_test = i_moves_until_bearings_test;
				//var move_events = 0;
				//var l_moves_until_bearings_test = 8;
				//var touch_event_bubble = false;
				
				//var single_touch_start_screen_pos;
				//var touch_action = null;
				
				//moves_until_bearings_test = i_moves_until_bearings_test;
				var all_touches = e.touches;
				var num_touches = all_touches.length;
				e.preventDefault();
				//console.log('num_touches ' + num_touches);
				
				if (num_touches == 1) {
					touch_action = null;
					var touch = all_touches[0];
					var screen_pos = [touch.screenX, touch.screenY];
					//ctrl_info.dom.node.innerHTML = screen_pos + '';
					//console.log('* a screen_pos ' + screen_pos);
					single_touch_start_screen_pos = screen_pos;
					
				} else {
					//ctrl_info.dom.node.innerHTML = num_touches + ' touches';
				}
				
				
			},
			'move': function(e) {
				var all_touches = e.touches;
				var num_touches = all_touches.length;
				if (num_touches == 1) {
					var touch = all_touches[0];
					var screen_pos = [touch.screenX, touch.screenY];
					//console.log('screen_pos ' + screen_pos);
					//console.log('single_touch_start_screen_pos ' + single_touch_start_screen_pos);
					
					var offset_from_touch_down = vector_subtract(screen_pos, single_touch_start_screen_pos);
					//console.log('offset_from_touch_down ' + offset_from_touch_down);
					
					var mag = vector_magnitude(offset_from_touch_down);
					var test_swipe_mag = function() {
						return mag >= 5;
					};
					if (touch_action == null) {
						// check if any actions get started.
						//console.log('mag ' + mag);
						if (test_swipe_mag()) {
							var e_swipe = {};
							var bearings_ok_left = true;
							if (moves_until_bearings_test == 0) {
								//var bearings = get_bearing(offset_from_touch_down);
								var direction = direction_from_vector(offset_from_touch_down);
								if (direction == 1) {
									touch_action = 'swipe-up';
									e_swipe.direction = 'up';
									event_swipe_start(e_swipe);
								}
								if (direction == 3) {
									touch_action = 'swipe-left';
									e_swipe.direction = 'left';
									event_swipe_start(e_swipe);
								}
								if (direction == 5) {
									touch_action = 'swipe-right';
									e_swipe.direction = 'right';
									event_swipe_start(e_swipe);
								}
								if (direction == 7) {
									touch_action = 'swipe-down';
									e_swipe.direction = 'down';
									event_swipe_start(e_swipe);
								}
								moves_until_bearings_test = i_moves_until_bearings_test;
								
							} else {
								moves_until_bearings_test--;
							}
						}
					};
					move_events++;
					if (touch_action == 'swipe-up') {
						if (moves_until_bearings_test == 0) {
							var dir = direction_from_vector(offset_from_touch_down);
							if (dir != 1) {
								
								touch_action = null;
								event_swipe_cancelled({'direction': direction_names[1]});
							} else {
								event_swipe_move();
							}
							moves_until_bearings_test = l_moves_until_bearings_test;
						} else {
							moves_until_bearings_test--;
						}
					};
					if (touch_action == 'swipe-left') {
						if (moves_until_bearings_test == 0) {
							var dir = direction_from_vector(offset_from_touch_down);
							if (dir != 3) {
								touch_action = null;
								event_swipe_cancelled({'direction': direction_names[3]});
							} else {
								event_swipe_move();
							}
							moves_until_bearings_test = l_moves_until_bearings_test;
							
						} else {
							moves_until_bearings_test--;
						}
					};
					if (touch_action == 'swipe-right') {
						if (moves_until_bearings_test == 0) {
							var dir = direction_from_vector(offset_from_touch_down);
							if (dir != 5) {
								touch_action = null;
								event_swipe_cancelled({'direction': direction_names[5]});
							} else {
								event_swipe_move();
							}
							moves_until_bearings_test = l_moves_until_bearings_test;
						} else {
							moves_until_bearings_test--;
						}
					};
					if (touch_action == 'swipe-down') {
						
						if (moves_until_bearings_test == 0) {
							var dir = direction_from_vector(offset_from_touch_down);
							if (dir != 7) {
								touch_action = null;
								event_swipe_cancelled({'direction': direction_names[7]});
							} else {
								event_swipe_move();
							}
							moves_until_bearings_test = l_moves_until_bearings_test;
						} else {
							moves_until_bearings_test--;
						}
					};
				}
			},
			'end': function(e) {
				var e_swipe = {};
				// calculate the magnitude of the swipe
				
				if (touch_action == 'swipe-left') {
					touch_action = null;
					e_swipe.direction = 'left';
					event_swipe_complete(e_swipe);
				}
				if (touch_action == 'swipe-right') {
					touch_action = null;
					e_swipe.direction = 'right';
					event_swipe_complete(e_swipe);
				}
				if (touch_action == 'swipe-up') {
					touch_action = null;
					e_swipe.direction = 'up';
					event_swipe_complete(e_swipe);
				}
				if (touch_action == 'swipe-down') {
					touch_action = null;
					e_swipe.direction = 'down';
					event_swipe_complete(e_swipe);
				}
				touch_action = null;
			},
			'cancel': function(e) {
				
			}
		};
		
		var bind_browser_api_touch_events = function(dom_node, api_touch_events) {
			each(api_touch_events, function(event_name, event_fn) {
				dom_node.addEventListener('touch' + event_name, event_fn, false);
			});
		};
		bind_browser_api_touch_events(dom_node, browser_api_touch_events);
	}
	
	return jsgui;
});