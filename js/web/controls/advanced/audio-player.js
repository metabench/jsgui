if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./horizontal-slider", "./audio-volume", "./media-scrubber"], 
	function(jsgui, Horizontal_Slider, Audio_Volume, Media_Scrubber) {
		
		var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;

		// The ZA audio player may need more elements for presentation.
		//  Would need to look into a subclass modigying the layout/composition of its parent class.

		// It seems like vector graphics will be needed.
		//  Likely more can be done in CSS though.
		//  Could have some activation that relies on CSS3.




		var Audio_Player = Control.extend({

			// could have a title field.
			'fields': {
				'title': String
			},

			// This audio player could connect back up to the audio resource on the server,
			//  or it could send itself enough data to proceed.

			// It should know the track durations and the album path.
			//  Perhaps individual track paths.

			// Perhaps an audio resource publisher makes sense?
			//  That way a Resource Client and Resource Control would be sent to the client.

			// However, I think a more flexible style of programming where the Audio_Player is not necessarily a resource client,
			// but can act like one, would be better.

			// I'd prefer to send track data in the original request.
			//  If it's connecting to a large library then a Resource system would enable it,
			//  but sending encoded tracks data to the client will be fine.




			// maybe add before make would be better. add will probably be used more.
			'init': function(spec, add, make) {
				this._super(spec);
				this.__type_name = 'audio_player';
				this.set('dom.attributes.class', 'audio-player');
				console.log('this._context', this._context);
				var rp = this._context.resource_pool;
				var site_audio = rp.get_resource('Site Audio');

				console.log('site_audio', site_audio);
				//  Making this a Resource Client for the moment.

				var that = this;

				// Should be set to track 1 to start with.

				//console.log('spec.el', spec.el);
				if (!spec.abstract && !spec.el) {

					var albums = site_audio.meta.get('albums');
					console.log('albums', albums);

					var div_relative = add(Control({'class': 'relative'}));

					// have a title bar with both the artist name and the album name

					var titlebar = make(Control({'class': 'titlebar'}));

					var h1 = make(jsgui.h1({}));
					titlebar.add(h1);
					h1.add(albums[0].artist);

					var h2 = make(jsgui.h2({}));
					titlebar.add(h2);
					h2.add(albums[0].name);

					div_relative.add(titlebar);

					var ctrl_tracks = make(Control({'class': 'tracks'}));

					this.set('ctrl_tracks', ctrl_tracks);

					div_relative.add(ctrl_tracks);

					var tracks = albums[0].tracks;



					console.log('tracks', tracks);

					each(tracks, function(track, i) {
						console.log('track', track);

						var div_track = make(Control({'class': 'track'}));
						ctrl_tracks.add(div_track);

						// Could have a Track control.

						var div_number = make(Control({'class': 'number'}));
						div_track.add(div_number);

						var str_number = '' + (i + 1);
						div_number.add(str_number);

						var div_name = make(Control({'class': 'name'}));
						div_track.add(div_name);
						div_name.add(track.name);

						var div_length = make(Control({'class': 'length'}));



						div_track.add(div_length);

						var ms_duration = track.ms_duration;
						console.log('ms_duration', ms_duration);

						var s_duration = ms_duration / 1000;

						var mins = Math.floor(s_duration / 60);
						var secs = Math.floor(s_duration % 60);

						var str_secs = secs.toString();
						if (str_secs.length == 1) {
							str_secs = '0' + str_secs;
						}

						var str_time = mins + ':' + str_secs;

						div_length.add(str_time);

						var dca = make(Control({'class': 'clearall'}));
						div_track.add(dca);


					});

					// And the audio element itself.

					var ctrl_audio = make(jsgui.audio({}));
					div_relative.add(ctrl_audio);

					var ctrl_source_mp3 = make(Control({'tagName': 'source'}));
					var ctrl_source_ogg = make(Control({'tagName': 'source'}));

					//ctrl_source_mp3.set('dom.attributes.src', '/audio/albums/01/01.mp3');
					//ctrl_source_ogg.set('dom.attributes.src', '/audio/albums/01/01.ogg');
					ctrl_source_mp3.set('dom.attributes.type', 'audio/mp3');
					ctrl_source_ogg.set('dom.attributes.type', 'audio/ogg');

					ctrl_audio.add(ctrl_source_mp3);
					ctrl_audio.add(ctrl_source_ogg);

					// Have two source elements within it.
					//  Start by rendering the first track in there.



					// http://192.168.1.13/audio/albums/01/01.mp3
					/*	
						<source src="tracks/mp3/11.mp3" type="audio/mp3">
						<source src="tracks/ogg/11.ogg" type="audio/ogg">

						$mp3_source.attr('src', 'tracks/mp3/' + str_track_num + '.mp3');
						$ogg_source.attr('src', 'tracks/ogg/' + str_track_num + '.ogg');
					*/


					var controls = make(Control({'class': 'controls'}));
					div_relative.add(controls);



					// prev, play/stop, next
					// scrubber (can be fairly wide if there is space)
					// current time position indicator
					// volume (could be button with popup volume, ubut won't hide it with that to start with)
					// info

					var buttons = make(Control({'class': 'buttons'}));
					controls.add(buttons);

					// then add various buttons.
					var btn_previous = make(Control({'class': 'previous button'}));
					var btn_play_stop = make(Control({'class': 'play button'}));
					var btn_next = make(Control({'class': 'next button'}));

					buttons.add(btn_previous);
					buttons.add(btn_play_stop);
					buttons.add(btn_next);



					// Probably is best to build this out of reusable components.
					//  Better encapsulation. There is less splitting (in terms of things being hard to find) of client-side and
					//   server-side code.
					//  Less gets done in any single init or activation stage, so it's likely to be easier to begug & maintain than
					//   a small number of large init and activate functions.

					// Should probably find out the lengths of the tracks by now.
					//  Should not be so hard to read (and possibly write to) the MP3 metadata to say the length of the tracks.


					// Use Horizontal_Slider controls.

					// Needs work on add_class and maintaining the list of CSS classes.

					var volume = make(Audio_Volume({}));
					//volume.add_class('volume');
					//var volume = make(Control({'class': 'volume'}));
					controls.add(volume);


					// And give the scrubber the duration of the 1st track.
					var scrubber = make(Media_Scrubber({
						'ms_duration': tracks[0].ms_duration
					}));
					//scrubber.add_class('scrubber');
					//var scrubber = make(Control({'class': 'scrubber'}));
					controls.add(scrubber);

					//var time_pos = make(Control({'class': 'time_pos'}));
					//controls.add(time_pos);

					//var info = make(Control({'class': 'info'}));
					//controls.add(info);

					//var now_playing = make(Control({'class': 'now-playing'}));
					//info.add(now_playing);

					// And send over the control fields for the individual tracks?
					//  I think they can be obtained on the 


					var ctrl_fields = {
						'ctrl_relative': div_relative._id(),
						'ctrl_audio': ctrl_audio._id(),
						'btn_previous': btn_previous._id(),
						'btn_play_stop': btn_play_stop._id(),
						'btn_next': btn_next._id(),
						'scrubber': scrubber._id(),
						'ctrl_volume': volume._id(),
						'ctrl_tracks': ctrl_tracks._id(),
						'ctrl_source_mp3': ctrl_source_mp3._id(),
						'ctrl_source_ogg': ctrl_source_ogg._id(),
					}

					this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));

					// Escaping fields provides further difficulties
					//  May want to have a single quote within the text.
					//  Probably best to use the right unicode &??; syntax for apostrophes and quotes.

					// Could use different replacement characters.
					//  Replace both " and '
					//  Use smiley faces?
					//  UTF8 ☺ ☹ ⍨ ☺ ♥

					// Change the paths of the albums?

					var c_albums = jsgui.clone(albums);

					c_albums[0].path = '/audio/albums/01/';

					this.set('dom.attributes.data-jsgui-fields', stringify({
						'albums': c_albums
					}).replace(/"/g, "[DBL_QT]").replace(/'/g, "[SNG_QT]"));


				}

			},
			'resizable': function() {
				this.set('resizable', 'right-bottom');

				// This needs to be a property that gets sent to the client.
				//  Call them active_fields?

				this.set('dom.attributes.data-jsgui-fields', "{'resizable': 'right-bottom'}");
			},
			'activate': function() {
				// May need to register Flexiboard in some way on the client.
				this._super();
				var ctrl_relative = this.get('ctrl_relative');
				var ctrl_audio = this.get('ctrl_audio');
				var ctrl_source_mp3 = this.get('ctrl_source_mp3');
				var ctrl_source_ogg = this.get('ctrl_source_ogg');
				var btn_previous = this.get('btn_previous');
				var btn_play_stop = this.get('btn_play_stop');
				var btn_next = this.get('btn_next');
				var scrubber = this.get('scrubber');
				var ctrl_volume = this.get('ctrl_volume');
				var ctrl_tracks = this.get('ctrl_tracks');





				var el_audio = ctrl_audio.get('dom.el');

				var tracks_content = ctrl_tracks.get('content');


				ctrl_tracks.set_i_track = function(i_track) {
					// 0 indexed interger

					tracks_content.each(function(i, ctrl_track) {
						//console.log('v', v);
						//console.log('i', i);

						var track = tracks[i];

						if (i_track == i) {
							ctrl_track.add_class('current');
						} else {
							ctrl_track.remove_class('current');
						}

						

						

						// Not so sure about using MVC.


					})
				}

				var albums = this.get('albums');
				var that = this;

				console.log('albums', albums);
				console.log('tof albums', tof(albums));

				var tracks = albums[0].tracks;

				var album_path = albums[0].path;
				console.log('album_path', album_path);

				ctrl_relative.on('touchstart', function(e_touchstart) {
					console.log('e_touchstart', e_touchstart);
				});

				//ctrl_audio.on('ended', )

				var i_track = 0;

				tracks_content.each(function(i, ctrl_track) {
					//console.log('v', v);
					//console.log('i', i);

					var track = tracks[i];

					ctrl_track.set('track', track);

					ctrl_track.on('click', function(e_click) {


						//console.log('track e_click', e_click);

						//console.log('track', i, track);

						i_track = i;
						var track_num_str = (i + 1) + '';
						if (track_num_str.length == 1) track_num_str = '0' + track_num_str;

						var mp3_path = album_path + track_num_str + '.mp3';
						var ogg_path = album_path + track_num_str + '.ogg';


						// Come up with the track paths in different formats.
						//  We use those as properties for the audio sources.
						ctrl_source_mp3.set('dom.attributes.src', mp3_path);
						ctrl_source_ogg.set('dom.attributes.src', ogg_path);




						//scrubber.set('ms_duration', track.ms_duration, that);
						scrubber.set('ms_duration', track.ms_duration, that);

						ctrl_tracks.set_i_track(i);



						el_audio.load();


						//ctrl_source_mp3.get('dom.el').setAttribute('src', mp3_path);
						//ctrl_source_ogg.get('dom.el').setAttribute('src', ogg_path);



					})

					// Not so sure about using MVC.


				})



				

				
				console.log('el_audio', el_audio);

				el_audio.load();

				var initial = true;

				var state = 'loading';

				// need to activate the track controls.



				ctrl_audio.on('canplaythrough', function(e_canplaythrough) {
					console.log('e_canplaythrough', e_canplaythrough);

					if (initial) {
						el_audio.play();

						//state = 'paused';
						state = 'playing';
						initial = false;

						console.log('el_audio.duration', el_audio.duration);

						console.log('el_audio.duration mins', Math.floor(el_audio.duration / 60));
						console.log('el_audio.duration seconds', Math.floor(el_audio.duration % 60));

						// Change the play button image to stop.
						//btn_play_stop.remove_class('play');
						//btn_play_stop.add_class('stop');


					} else {
						el_audio.play();

						//state = 'paused';
						state = 'playing';


					}

				});

				ctrl_audio.on('timeupdate', function(e_timeupdate) {
					//console.log('e_timeupdate', e_timeupdate);

					// Have it playing track 1 by default.

					var current_time = el_audio.currentTime;
					//console.log('timeupdate current_time', current_time);

					var ms_time = current_time * 1000;
					//console.log('timeupdate ms_time', ms_time);

					// set time in seconds, not milliseconds?

					// Want it so that when this gets set, we don't get an event back from the scrubber.


					scrubber.set('ms_time', ms_time, that);


					//scrubber.set('ms_time', ms_time);
					//throw 'stop';

					


				});

				var play_track_by_index = function(i) {
					var track = tracks[i_track];
					var track_num_str = (i + 1) + '';
					if (track_num_str.length == 1) track_num_str = '0' + track_num_str;
					var mp3_path = album_path + track_num_str + '.mp3';
					var ogg_path = album_path + track_num_str + '.ogg';
					ctrl_source_mp3.set('dom.attributes.src', mp3_path);
					ctrl_source_ogg.set('dom.attributes.src', ogg_path);
					scrubber.set('ms_duration', track.ms_duration, that);
					el_audio.load();
					ctrl_tracks.set_i_track(i);
				}

				ctrl_audio.on('ended', function(e_ended) {
					console.log('e_ended', e_ended);

					if (i_track < tracks.length) {
						i_track++;
						play_track_by_index(i_track);
					}
				});

				scrubber.on('change', function(e_change) {

					// Want it so we can tell the difference between changes to the scrubber which this control caused, and
					//  changes to the scrubber that the user caused.


					//console.log('scrubber change', e_change);



					var name = e_change.name, value = e_change.value, source = e_change.source;

					// Could see if the source is a track change?

					if (source != that) {
						// Set the position in the track

						//console.log('ui initiated change', e_change);


						var val;

						if (value.value) {
							val = value.value();
						} else {
							val = value;
						}
						//console.log('val', val);

						//var nct = Math.round(val / 1000);
						var nct = (val / 1000);
						console.log('nct', nct);

						//console.log('el_audio', el_audio);

						//console.log('el_audio.seekable', el_audio.seekable);

						el_audio.currentTime = nct;

						// set the audio time position.





						// We change the position in the track



						//throw 'stop';
					}
				})

				

				// timeupdate
				/*
				ctrl_audio.on('canplay', function(e_canplay) {
					console.log('e_canplay', e_canplay);

					// Have it playing track 1 by default.

					

					


				});
				*/

				btn_previous.on('click', function(e_click) {
					//console.log('click btn_play_stop');

					//console.log('state', state);
					//console.log('tof(state)', tof(state));

					// Want to indicate that a track is playing.
					//  May be better architecture to make the tracklist into a table that can show an active row.
					//  Could add functionality to the track list control so we can tell it which track is selected.




					i_track--;

					play_track_by_index(i_track);



					

					if (state == 'playing') {
						//console.log('is playing');
						//el_audio.pause();
						//state = 'paused';
					} else {
						//if (state == 'paused') {
						//	el_audio.play();
						//	state = 'playing';
						//}
					}
					//console.log('2) state', state);


				});

				btn_next.on('click', function(e_click) {
					//console.log('click btn_play_stop');

					//console.log('state', state);
					//console.log('tof(state)', tof(state));

					i_track++;

					// set the src for that track.

					play_track_by_index(i_track);

					ctrl_tracks.set_i_track(i_track);



					if (state == 'playing') {
						//console.log('is playing');
						//el_audio.pause();
						state = 'paused';
					} else {
						if (state == 'paused') {
							//el_audio.play();
							//state = 'playing';
						}
					}
					//console.log('2) state', state);


				});

				btn_play_stop.on('click', function(e_click) {
					//console.log('click btn_play_stop');

					//console.log('state', state);
					//console.log('tof(state)', tof(state));

					if (state == 'playing') {
						//console.log('is playing');
						el_audio.pause();
						state = 'paused';
					} else {
						if (state == 'paused') {
							el_audio.play();
							state = 'playing';
						}
					}
					//console.log('2) state', state);


				});
			}
		})

		return Audio_Player;
	}
);