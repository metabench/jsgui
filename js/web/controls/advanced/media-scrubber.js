// Vertical_Expander


if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./horizontal-slider"], 
	function(jsgui, Horizontal_Slider) {
		
		var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof;
		var Control = jsgui.Control;

		var v_subtract = jsgui.v_subtract;
		

		// Extending, with field values being set?
		//  Setting field values in definitions may be a useful thing.
		var Media_Scrubber = Control.extend({
			// fields... text, value, type?
			//  type could specify some kind of validation, or also 'password'.
				
			// single field?
			//'fields': [
			//	['ms_time', Object]
			//],			
			//  and can have other fields possibly.
			
			
			'init': function(spec, add, make) {
				this._super(spec);
				this.__type_name = 'media_scrubber';

				if (spec.ms_duration) {
					this.set('ms_duration', spec.ms_duration);
				}

				if (!spec.abstract && !spec.el) {

					this.set('dom.attributes.class', 'scrubber');
					// the bar at the top.

					// It's going to act as a drag handle for this.
					//  The drag system will integrate with various bands / window positions.

					// Maybe a property to say that it's dockable.
					

					//var top_bar = new Control({
					//	'context': this._context
					//})
					//top_bar.set('dom.attributes.class', 'title bar');


					//this.add(top_bar);

					var time_display = add(Control({
						//'min': 0,
						//'max': 100
					}));



					time_display.add_class('time-display');

					var ms_duration = this.get('ms_duration');

					var s_duration = Math.round(ms_duration / 1000);

					var mins = Math.floor(s_duration / 60);
					var secs = s_duration % 60;

					var str_secs = secs.toString();
					if (str_secs.length == 1) {
						str_secs = str_secs + '0';
					}

					var str_time = mins + ':' + str_secs;


					var str_time_display = '0:00 / ' + str_time;
					time_display.add(str_time_display);

					// For the time positions within this.
					//  Will probably work on milliseconds internally.



					var h_slider = add(Horizontal_Slider({
						'min': 0,
						'max': ms_duration,
						'value': 0,
						'drag_mode': 'ghost'
					}));

					var ctrl_fields = {
						'h_slider': h_slider._id(),
						'time_display': time_display._id()
					}

					this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));


					// Don't just send control fields, send the ms duration field too.
					//  Will get updated when the track changes.


					this.set('dom.attributes.data-jsgui-fields', stringify({
						'ms_duration': ms_duration
					}).replace(/"/g, "[DBL_QT]").replace(/'/g, "[SNG_QT]"));


					this.active();
				}

				if (!spec.abstract) {
					this.set('ms_time', new jsgui.Data_Value({'contect': this._context}))
				}

				
				


				
			},


			'activate': function() {
				this._super();
				var that = this;
				console.log('Media_Scrubber activate');

				var h_slider = this.get('h_slider');
				var time_display = this.get('time_display');
				var el_time_display = time_display.get('dom.el');

				var ms_time = this.get('ms_time');

				var dv_ms_duration = this.get('ms_duration');
				//console.log('tof(dv_ms_duration)', tof(dv_ms_duration));

				var ms_duration = dv_ms_duration.value();

				var s_duration = Math.round(ms_duration / 1000);

				var mins_d = Math.floor(s_duration / 60);
				var secs_d = s_duration % 60;

				var str_secs_d = secs_d.toString();
				if (str_secs_d.length == 1) {
					str_secs_d =  '0' + str_secs_d;
				}

				var str_duration = mins_d + ':' + str_secs_d;



				

				//ms_time.on('change', function(e_change) {
				//	console.log('ms_time change', e_change);
				//})

				this.on('change', function(e_change) {

					var field_name = e_change.name, value = e_change.value;
					//console.log('field_name', field_name);
					if (value.value) {
						value = value.value();
					}
					//console.log('value', value);

					// Changing the change events to see if they originated from the user...

					// Having an e_change object
					//  name, value, source
					//   the source would be a string that may say 'internal' or 'user', maybe 'keyboard', 'mircophone', 'touch'
					//   Would help listening for internally generated events, and then not responding to them in the same way.


					// if (e_change.source != 'internal')

					//console.log('scrubber change', e_change);
					//console.log('p2', p2);
					//console.log('p3', p3);

					// Want to make the event handling depend on what generated an event.
					//  Eg, a media file advancing should be handled differently to a user changing position in a media file.
					//   When the media file advances, it generates an event which gets reflected in the UI
					//   When the user advances the media file, the event comes from the UI and then the audio element needs to be told to change pos.
					//    In this situation, we don't want to 

					if (field_name == 'ms_duration') {
						//el_time_display.innerHTML = value;

						// Need to update the horizontal slider.

						h_slider.set('max', value, that);

					}



					if (field_name == 'ms_time') {
						// update the scrubber position (UI)

						// Input and output processing of times would be very helpful.
						//  Being able to get the number of hours, minutes, seconds out of milliseconds.




						var s_time = value / 1000;

						var mins = Math.floor(s_time / 60);
						var secs = Math.floor(s_time % 60);

						var str_secs = secs.toString();
						if (str_secs.length == 1) {
							str_secs =  '0' + str_secs;
						}

						var str_time = mins + ':' + str_secs;

						//time_display.set('content', str_time);
						

						// Update the position of the scrubber handle.
						dv_ms_duration = that.get('ms_duration');
						//console.log('dv_ms_duration', dv_ms_duration);

						if (dv_ms_duration.value) {
							ms_duration = dv_ms_duration.value();
						} else {
							ms_duration = dv_ms_duration;
						}

						var s_duration = ms_duration / 1000;

						var mins_d = Math.floor(s_duration / 60);
						var secs_d = Math.floor(s_duration % 60);

						var str_secs_d = secs_d.toString();
						if (str_secs_d.length == 1) {
							str_secs_d =  '0' + str_secs_d;
						}

						var str_duration = mins_d + ':' + str_secs_d;

						el_time_display.innerHTML = str_time + ' / ' + str_duration;

						

						var proportion_through_track = value / ms_duration;
						//console.log('proportion_through_track', proportion_through_track);

						// and give the horizontal slider the proportion through.
						//console.log('pre set h slider value');
						//console.log('time_display', time_display);

						// hmm this is tricky.
						//  want to be able to trigger it so it does the internal update.
						//  

						// Definitely having ways of telling the event initiators will help.



						//h_slider.set('value', value, 'silent');
						//  Levels of event raising could help.
						//   So a silent event does get raised internally within an object.
						//   Internal level binding would be one way of solving this.
						//   It seems like this is quite an important thing to get right, and I don't want to work around this
						//    problem and wind up with a less powerful framework.


						// Also to do with event origination...
						//  If we respond to the user chaning the slider, we want it so that the change then does not cause the change in the slider
						//  again.

						h_slider.set('value', value, that);

						// Want to tell the difference between user initiated changes and other changes.



						//throw '2stop';






					}
				})
	

				// a set event?
				//  More details about the change event could help.
				//  Eg it can see it was a mouse event, a touch event, a user event, a triggered event etc.



				h_slider.on('change', function(e_change) {
					//console.log('media scrubber h_slider e_change', e_change);

					var name = e_change.name, value = e_change.value, source = e_change.source;


					if (source != that) {
						//throw 'stop';

						// raise an event for the scrubber, keeping the event source.
						//console.log('pre set name, value, source');

						//console.log('value', value);
						that.set(name, value, source);



					}
					//throw 'stop';

					// Need to recognise when the user has changed the position, and when app events have caused a position change.



					//throw 'stop';
				})
				


			}
		});
		
		return Media_Scrubber;
		
		//return jsgui;
});