if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./horizontal-slider", "./audio-volume"], 
	function(jsgui, Horizontal_Slider, Audio_Volume) {
		
		var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;

		var Audio_Player = Control.extend({

			// could have a title field.
			'fields': {
				'title': String
			},


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


					//this.__status = 'waiting';

					/*

					site_audio.meta.get('albums', function(err, albums) {
						if (err) {
							throw err;
						} else {
							console.log('albums', albums);

							that.__status = 'ready';
							that.trigger('ready');
						}
					})

					*/

					

					// Show the 0th album for the moment. In future will be able to navigate between them.



					var tracks = albums[0].tracks;
					console.log('tracks', tracks);

					each(tracks, function(track, i) {
						console.log('track', track);

						var div_track = make(Control({'class': 'track'}));
						div_tracks.add(div_track);

						// Could have a Track control.

						var div_number = make(Control({'class': 'number'}));
						div_track.add(div_number);
						div_number.add('' + (i + 1));

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
							str_secs = str_secs + '0';
						}

						var str_time = mins + ':' + str_secs;

						div_length.add(str_time);

						var dca = make(Control({'class': 'clearall'}));
						div_track.add(dca);


					});

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

					var scrubber = make(Horizontal_Slider({}));
					scrubber.add_class('scrubber');
					//var scrubber = make(Control({'class': 'scrubber'}));
					controls.add(scrubber);

					var time_pos = make(Control({'class': 'time_pos'}));
					controls.add(time_pos);

					var info = make(Control({'class': 'info'}));
					controls.add(info);


					var ctrl_fields = {
						'ctrl_relative': div_relative._id()
					}

					this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));



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


			}
		})

		return Audio_Player;
	}
);