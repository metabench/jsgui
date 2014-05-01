if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./horizontal-slider", "./audio-volume", "./media-scrubber"], 
	function(jsgui, Horizontal_Slider, Audio_Volume, Media_Scrubber) {
		
		var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;

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

					var div_tracks = make(Control({'class': 'tracks'}));

					div_relative.add(div_tracks);

					var tracks = albums[0].tracks;
					console.log('tracks', tracks);

					each(tracks, function(track, i) {
						console.log('track', track);

						var div_track = make(Control({'class': 'track'}));
						div_tracks.add(div_track);

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

						var s_duration = Math.round(ms_duration / 1000);

						var mins = Math.floor(s_duration / 60);
						var secs = s_duration % 60;

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

					ctrl_source_mp3.set('dom.attributes.src', '/audio/albums/01/01.mp3');
					ctrl_source_ogg.set('dom.attributes.src', '/audio/albums/01/01.ogg');
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

					var ctrl_fields = {
						'ctrl_relative': div_relative._id(),
						'ctrl_audio': ctrl_audio._id(),
						'btn_previous': btn_previous._id(),
						'btn_play_stop': btn_play_stop._id(),
						'btn_next': btn_next._id(),
						'scrubber': scrubber._id(),
						'ctrl_volume': volume._id()
					}

					this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));

					// Escaping fields provides further difficulties
					//  May want to have a single quote within the text.
					//  Probably best to use the right unicode &??; syntax for apostrophes and quotes.

					// Could use different replacement characters.
					//  Replace both " and '
					//  Use smiley faces?
					//  UTF8 ☺ ☹ ⍨ ☺ ♥



					this.set('dom.attributes.data-jsgui-fields', stringify({
						'albums': albums
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
				var btn_previous = this.get('btn_previous');
				var btn_play_stop = this.get('btn_play_stop');
				var btn_next = this.get('btn_next');
				var scrubber = this.get('scrubber');
				var ctrl_volume = this.get('ctrl_volume');

				var el_audio = ctrl_audio.get('dom.el');
				console.log('el_audio', el_audio);
				el_audio.load();

				var initial = true;

				ctrl_audio.on('canplaythrough', function(e_canplaythrough) {
					console.log('e_canplaythrough', e_canplaythrough);

					if (initial) {
						el_audio.play();
						initial = false;

						// Change the play button image to stop.
						btn_play_stop.remove_class('play');
						btn_play_stop.add_class('stop');


					} else {

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

					
					scrubber.set('ms_time', ms_time);
					//throw 'stop';

					


				});

				

				// timeupdate

				ctrl_audio.on('canplay', function(e_canplay) {
					console.log('e_canplay', e_canplay);

					// Have it playing track 1 by default.

					

					


				});

				btn_play_stop.on('click', function(e_click) {
					console.log('click btn_play_stop');
					//el_audio.play();


				});
			}
		})

		return Audio_Player;
	}
);