if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// I would like my own (fast) way of reading MP3 metadata.



define(['module', 'path', 'fs', 'url', '../../web/jsgui-html', 'os', 'http', 'url', './resource',
	'../../web/jsgui-je-suis-xml', 'cookies', '../../fs/jsgui-node-fs2-core', '../../audio/jsgui-node-audio-metadata'], 

	function(module, path, fs, url, jsgui, os, http, libUrl,
		Resource, JeSuisXML, Cookies, fs2, audio_metadata) {

	
	var stringify = jsgui.stringify, each = jsgui.eac, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;
	
	// This resource may have quite a lot of functionality put in to deal with
	//  seriving images in an optimized way.
	// Want this so it also serves the developer in that images can be put in place
	//  and modified easily in an unoptimized way. Then they get put in place in an
	//  optimized way on request or automatically. Want to incorporate sprite sheet generation
	//  here. This should handle requests for individual images, but it's also possible sprites
	//  could be requested. If that's the case, maybe it should pass it onto a sprite resource.
	// It would be really good to have practically instant sprite generation, using C / C++
	//  and maybe OpenCL.
	// It could be requests to a sprite resource that returns a predefined selection of
	//  assets.
	// The image resource may also be called upon to return rescaled versions.
	//  That's something that OpenCL would also be very fast at.
	// The image / spritesheet resources may be connected to other database resources that provide
	//  caching and indexing of images.
	//   These would most likely be abstractions over data resources.

	// Want to make an image interface to a flexible db interface.
	//  Serving and caching optimized images would be cool.

	// Rather than relying on storing image versions in a DB (which would be cool, esp for distributed)
	//  we can store image versions + spritesheets on the local disk.
	// Cache them in RAM as well.
	//  Storing them in GPU RAM would be very cool, especially if from there we can get versions with
	//   different operations done, or the output of operations.






	// May need to change around a fair few references to make it workable.
	// May need some more complicated logic to change it to the path for service.


	// need to see what type of image it is.
	var mime_types = {
		'acc': 'audio/acc',
		'mp4': 'audio/mp4',
		'mpeg': 'audio/mpeg',
		'ogg': 'audio/ogg',
		'wav': 'audio/wav',
		'webm': 'audio/webm'
	};

	var serve_audio_file_from_disk = function(filePath, response) {
		var extname = path.extname(filePath);
		console.log('extname ' + extname);

		var extension = extname.substr(1);
		console.log('extension ' + extension);


		// then return the right MIME type for that extension.

		// No, don't load the image file as a string.

		// fs loadfile
		//  async, then serve it with the correct mime type, write to the response buffer.

		// can this be streamed to the response buffer?

		console.log('filePath', filePath);

		fs.readFile(filePath, function(err, data) {
			if (err) {
				throw err;
			} else {

				response.writeHead(200, {'Content-Type': mime_types[extension] });
    			response.end(data, 'binary');

			}
		});


		//fs2.load_file_as_string(filePath, function (err, data) {
		//	if (err) { 
		//		throw err;
		//	} else {
		//		//var servableJs = updateReferencesForServing(data);
		//		response.writeHead(200, {'Content-Type': mime_types[extension]});
		//		response.end(data);
		//	}
		//});
	}


	var Site_Audio = Resource.extend({
		

		'init': function(spec) {
			this._super(spec);

			this.meta.set('custom_paths', new Data_Object({}));
			// Those are custom file paths.

			// could have a collection of directories, indexed by name, that get served.

			// Index the collection by string value?
			this.meta.set('served_directories', new Collection({'index_by': 'name'}));
		},
		'start': function(callback) {
			// Load the tracks and find out their lengths.

			console.log('Site Audio Resource Start');

			var meta = this.meta;
			var albums = meta.get('albums');

			console.log('albums', albums);
			console.log('tof(albums)', tof(albums));

			each(albums, function(album) {
				// We load the track length.

				var tracks = album.tracks;

				var l = tracks.length;

				each(tracks, function(track, i_track) {
					var track_base_name = (i_track + 1).toString();
					if (track_base_name.length == 1) {
						track_base_name = '0' + track_base_name;
					}
					var track_mp3_path = album.path + '/mp3/' + track_base_name + '.mp3';
					console.log('track_mp3_path', track_mp3_path);
					// perhaps using call_multi
					// load this up, get the track length
					audio_metadata.from_file(track_mp3_path, function(err, metadata) {
						if (err) {
							throw err;
						} else {
							console.log('metadata', metadata);

							var ms_duration = metadata.ms_duration;
							track.ms_duration = ms_duration;

							l--;

							if (l == 0) {
								console.log('tracks', tracks);
								callback(null, true);
							}

						}
					})


				});

				
			});

			
		},
		'serve_directory': function(path) {
			// Serves that directory, as any files given in that directory can be served from /js
			var served_directories = this.meta.get('served_directories');
			console.log('served_directories ' + stringify(served_directories));
			//served_directories.push(path);
			served_directories.push({
				'name': path
			});
			console.log('served_directories ' + stringify(served_directories));
			console.log('path ' + path);


			//throw 'stop';



		},

		// basically get requests, but can handle more than just get.
		'process': function(req, res) {
			//console.log('Site_JavaScript processing');
			var remoteAddress = req.connection.remoteAddress;

			var custom_paths = this.meta.get('custom_paths');

			var rurl = req.url;

			var pool = this.meta.get('pool');
			// should have a bunch of resources from the pool.

			//var pool_resources = pool.resources();
			//console.log('pool_resources ' + stringify(pool_resources));

			console.log('req', req);

			var wildcard_value = req.params.wildcard_value;
			console.log('wildcard_value', wildcard_value);

			if (wildcard_value) {
				var s_path = wildcard_value.split('/');
				console.log('s_path', s_path);

				if (s_path.length == 3) {
					var album_url_name = s_path[1];
					var track_url_name = s_path[2];

					var s_track_url_name = track_url_name.split('.');
					var track_base_name = s_track_url_name[0];
					var track_extension = s_track_url_name[1];

					console.log('track_base_name', track_base_name);
					console.log('track_extension', track_extension);

					// Need to match it up with the resource's albums



					// Then load up and serve the file.

					//var media_file_path = 

					// Likely to have been given specialised path info, in the metadata.
					//  Could have been provided with an album's path.

					var meta = this.meta;
					console.log('meta', meta);

					var albums = meta.get('albums');
					console.log('albums', albums);

					var parsed_album_url_name = parseInt(album_url_name, 10);
					var i_album = parsed_album_url_name - 1;

					var album = albums[i_album];


					//var tracks = album.get('tracks');
					var tracks = album.tracks;

					var i_track = parseInt(track_base_name, 10);

					var s_track = i_track.toString();
					if (s_track.length == 1) {
						s_track = '0' + s_track;
					}

					console.log('s_track', s_track);

					// Anyway, choose the right file (from mp3 dir for the moment)

					var media_file_path = album.path + '/mp3/' + s_track + '.mp3';
					console.log('media_file_path', media_file_path);

					serve_audio_file_from_disk(media_file_path, res);

					//console.log('tracks', tracks);

					// 
				}
			}

			//throw 'stop';

			/*

			

			
			var url_parts = url.parse(req.url, true);
			//console.log('url_parts ' + stringify(url_parts));
			var splitPath = url_parts.path.substr(1).split('/');

			// Want the path inside the resource as well.

			//console.log('resource site css splitPath ' + stringify(splitPath));


			if (rurl.substr(0, 1) == '/') rurl = rurl.substr(1);
			rurl = rurl.replace(/\./g, '☺');
			//console.log('rurl ' + rurl);

			var custom_response_entry = custom_paths.get(rurl);
			//console.log('custom_response_entry ' + stringify(custom_response_entry));

			// Should probably already be given the audio path, as well as the path within the audio path.

			// Custom audio resource publishers could seem like a decent business.

			if (custom_response_entry) {
				var tcr = tof(custom_response_entry);
				//console.log('tcr ' + tcr);

				if (tcr == 'data_value') {
					val = custom_response_entry.value();
					//console.log('val ' + val);

					var tval = tof(val);

					if (tval == 'string') {
						// then it should be a local file path, serve it.
						serve_image_file_from_disk(val, res);
					}
				}
			} else {
				//console.log('splitPath', splitPath);
				if (splitPath.length > 0) {

					if (splitPath[0] == 'audio') {

						if (splitPath.length > 1) {
							if (splitPath.length == 2) {
								var fileName = splitPath[1];
								//console.log('url_parts.path ' + url_parts.path);
								var filePath = url_parts.path.substr(1);
								//console.log('module.uri ' + module.uri);
								var val2 =  path.dirname(module.uri);
								console.log('val2 ' + val2);

								var diskPath = '../../ws/audio/' + fileName;

								serve_image_file_from_disk(diskPath, res);

							} else {
								if (splitPath.length > 2) {

									// need to put the rest of it together...

									var fileName = splitPath.slice(1, splitPath.length).join('/');
									console.log('fileName', fileName);


									var filePath = url_parts.path.substr(1);
									//console.log('module.uri ' + module.uri);
									var val2 =  path.dirname(module.uri);
									console.log('val2 ' + val2);
									var diskPath = '../../ws/audio/' + fileName;

									serve_image_file_from_disk(diskPath, res);

								}

							}
						}
					}
				}
			}
			*/
		}
	});
	
	return Site_Audio;
});