
/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// I would like my own (fast) way of reading MP3 metadata.

// Had a problem seeking later parts of the track in Chrome. It would request a few seconds too little audio from the server.
//  Seems like Chrome estimated positions for VBR audio are out.
//  This bay be improved by changing to a constant bitrate (though that is less efficient encoding, generally)

// Other parts of the system are likely to be more important.
// It may be useful to have an interface to administer the site's audio.

// Browse tracks, and encode them into different bit rates and formats.
// Maintain copies of the tracks in different bit rates and formats.


define(['module', 'path', 'fs', 'url', '../../web/jsgui-html', 'os', 'http', 'url', './resource',
	'../../web/jsgui-je-suis-xml', 'cookies', '../../fs/jsgui-node-fs2-core', '../../audio/jsgui-node-audio-metadata', 'crypto'],

	function(module, path, fs, url, jsgui, os, http, libUrl,
		Resource, JeSuisXML, Cookies, fs2, audio_metadata, crypto) {
*/

var path = require('path'), fs = require('fs'), url = require('url'), jsgui = require('../../web/jsgui-html'), os = require('os'), http = require('http'), libUrl = require('url'),
  Resource = require('./resource'), JeSuisXML = require('../../web/jsgui-je-suis-xml'), Cookies = require('cookies'), fs2 = require('../../fs/jsgui-node-fs2-core'), audio_metadata = require('../../audio/jsgui-node-audio-metadata'), crypto = require('crypto');


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
		'mp3': 'audio/mpeg3',
		'mpeg': 'audio/mpeg',
		'ogg': 'audio/ogg',
		'wav': 'audio/wav',
		'webm': 'audio/webm'
	};

	var serve_audio_file_from_disk = fp(function(a, sig) {

		var filePath, start_pos = 0, end_pos, response;
		var using_byte_range = false;

		if (a.l == 2) {
			filePath = a[0];
			response = a[1];

		}
		if (a.l == 3) {
			filePath = a[0];
			start_pos = a[1];
			response = a[2];
			using_byte_range = true;

		}
		if (a.l == 4) {
			filePath = a[0];
			start_pos = a[1];
			end_pos = a[2]
			response = a[3];
			using_byte_range = true;
		}
		console.log('serve_audio_file_from_disk filePath ', filePath);

		var extname = path.extname(filePath);
		console.log('extname ' + extname);

		var extension = extname.substr(1);
		console.log('extension ' + extension);


		// then return the right MIME type for that extension.

		// No, don't load the image file as a string.

		// fs loadfile
		//  async, then serve it with the correct mime type, write to the response buffer.

		// can this be streamed to the response buffer?

		//console.log('filePath', filePath);

		// This was served from Express in another app:
		/*
		Accept-Ranges:bytes
		Cache-Control:public, max-age=0
		Connection:keep-alive
		Content-Length:7831024
		Content-Range:bytes 0-7831023/7831024
		Content-Type:audio/mpeg
		Date:Fri, 02 May 2014 15:41:56 GMT
		ETag:"7831024-1357308361000"
		Last-Modified:Fri, 04 Jan 2013 14:06:01 GMT
		X-Powered-By:Express

		Currently served:

		Accept-Ranges:bytes
		Connection:keep-alive
		Content-Length:7831024
		Content-Range:bytes 0-7831024/7831024
		Content-Type:audio/mpeg3
		Date:Fri, 02 May 2014 18:01:47 GMT


		*/

		// It seems like this needs to present an etag to the client in order to work successfully.




		// May be better to use fs.read
		//  Serve this as a stream
		//  The client may not request it so quickly.
		//   However, may not want lots of access to the disk, so storing it in RAM while being served may make sense.




		//

		/*

		fs.open('./data/index.html', 'r', function(err, fd) {
		    if(err) throw err;
		    var str = new Buffer(3);
		    fs.read(fd, buf, 0, buf.length, null, function(err, bytesRead, buffer) {
				if(err) throw err;
				console.log(err, bytesRead, buffer);
				fs.close(fd, ChaipaKwa, are you there?
				function() {
				console.log('Done');
				});
		    });
		});

		*/

		// This current code is probably more memory efficient.
		//  A greater efficiency could be gained (possibly) by storing the whole MP3 in memory while it is being served,
		//  and using the same buffer to send to more than 1 client.

		fs.stat(filePath, function (err, stats) {
			if (err) {

				// The file probably was not found.
				//  Return a 404.

				//response.status(404).send('Not found');

				response.writeHead(404, {

		            "Content-Type": "text/plain"

		        });

		        response.write("404 Not Found\n");

		        response.end();


				//throw err;
			} else {
				console.log('stats.size', stats.size);

				//var l = stats.size;

				var l;

				var response_code = 200;
				//if (start_pos > 0) {
				//	response_code = 206;
				//}


				if (using_byte_range) {
					response_code = 206;
					if (start_pos) {
						l = stats.size - start_pos ;

					}



					var rs_opts = {
						'start': start_pos
					};

					if (end_pos) {
						rs_opts.end = end_pos + 1;
						l = end_pos;
					}

					if (start_pos && end_pos) {
						l = (end_pos + 1) - start_pos;
					}


				} else {
					l = stats.size;
				}


				console.log('rs_opts', rs_opts);
				var rs = fs.createReadStream(filePath, rs_opts);

				rs.pause();

				var c = 0;

				// Response code 206 for partial content.
				//  Need to only do this if the browser is asking for partial content though.

				// It seems like partial requests rely on etags.








				// Needs to have a new etag for each file.
				//  Can use a hash of the file path.


				var key = 'ready salted';
				var hash = crypto.createHmac('sha1', key).update(filePath).digest('hex');

				// Get last modified time from file.


				// Need to handle 0-n ranges
				//  iOS starts the audio download with a 0-1 range.

				// Seems that with the range request we should return 1 more byte.



				// Don't necessarily do content-range.

				var o_head = {'Content-Type': mime_types[extension],
					//'Accept-Ranges': 'bytes',

					'ETag': hash,
					//'Last-Modified': 'Fri, 04 Jan 2013 14:06:01 GMT',
					'Last-Modified': stats.mtime,

					'Content-Length': l//,

					// Not serving the whole content (fill amount - 1) gets the 206 response to work.
					//'Content-Range': 'bytes ' + start_pos + '-' + (stats.size - 1) + '/' + stats.size
				};

				if (using_byte_range) {
					o_head['Accept-Ranges'] = 'bytes';
					start_pos = start_pos || 0;

					if (end_pos) {
						o_head['Content-Range'] = 'bytes ' + start_pos + '-' + (end_pos) + '/' + stats.size
					} else {
						o_head['Content-Range'] = 'bytes ' + start_pos + '-' + (stats.size - 1) + '/' + stats.size
					}


				}

				console.log('o_head', o_head);


				response.writeHead(response_code, o_head);

				//response.pipe()

				rs.pipe(response);



				//rs.on('data', function(chunk) {
					//c = c + chunk.length;
				  	//console.log('got %d bytes of data', chunk.length);
				  	//console.log('bytes read so far', c);
				//});
				rs.resume();






				/*
				fs.open(filePath, 'r', function(err, fd) {
					if (err) {
						throw err;
					} else {
						// Do we know how long the file is?
						//  We need to get the metadata first?

						// Want to stream the file, sequentially.




					}
				})
				*/

			}

	    });



		/*

		fs.readFile(filePath, function(err, data) {
			if (err) {
				throw err;
			} else {
				console.log('cb readfile');
				response.writeHead(200, {'Content-Type': mime_types[extension],
					'Accept-Ranges': 'bytes',
					'Content-Length': data.length,
					'Content-Range': 'bytes 0-' + data.length + '/' + data.length
				});

				// Accept-Ranges:bytes
    			response.end(data, 'binary');

			}
		});
		*/


		//fs2.load_file_as_string(filePath, function (err, data) {
		//	if (err) {
		//		throw err;
		//	} else {
		//		//var servableJs = updateReferencesForServing(data);
		//		response.writeHead(200, {'Content-Type': mime_types[extension]});
		//		response.end(data);
		//	}
		//});
	});


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

			if (albums) {
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
						//console.log('track_mp3_path', track_mp3_path);
						// perhaps using call_multi
						// load this up, get the track length
						audio_metadata.from_file(track_mp3_path, function(err, metadata) {
							if (err) {
								throw err;
							} else {
								//console.log('metadata', metadata);

								var ms_duration = metadata.ms_duration;
								track.ms_duration = ms_duration;

								l--;

								if (l == 0) {
									//console.log('tracks', tracks);
									callback(null, true);
								}

							}
						})


					});


				});

			} else {
				callback(null, true);
			}

			//console.log('albums', albums);
			//console.log('tof(albums)', tof(albums));



		},
		'serve_directory': function(path) {
			// Serves that directory, as any files given in that directory can be served from /js
			var served_directories = this.meta.get('served_directories');
			//console.log('served_directories ' + stringify(served_directories));
			//served_directories.push(path);
			served_directories.push({
				'name': path
			});
			//console.log('served_directories ' + stringify(served_directories));
			//console.log('path ' + path);


			//throw 'stop';



		},

		// basically get requests, but can handle more than just get.
		'process': function(req, res) {
			console.log('Site_JavaScript processing');
			var remoteAddress = req.connection.remoteAddress;

			var custom_paths = this.meta.get('custom_paths');

			var rurl = req.url;

			var pool = this.meta.get('pool');
			// should have a bunch of resources from the pool.

			//var pool_resources = pool.resources();
			//console.log('pool_resources ' + stringify(pool_resources));

			//console.log('req', req);

			var headers  = req.headers;
			console.log('headers', headers);

			// bytes=6723861-

			var range = headers.range;
			console.log('range', range);



			var byte_start_pos;
			var byte_end_pos;

			if (range) {
				var s_range = range.split('=');

				console.log('s_range', s_range);

				var s_range_2 = s_range[1].split('-');

				console.log('s_range_2', s_range_2);

				if (s_range_2[0]) {
					byte_start_pos = parseInt(s_range_2[0], 10);
				}
				if (s_range_2[1]) {
					console.log('s_range_2[1]', s_range_2[1]);
					byte_end_pos = parseInt(s_range_2[1], 10);
				}
			}

			console.log('byte_start_pos', byte_start_pos);
			console.log('byte_end_pos', byte_end_pos);

			//if (range.substr())





			// It looks like this will need to handle byte ranges too.




			var wildcard_value = req.params.wildcard_value;
			//console.log('wildcard_value', wildcard_value);

			if (wildcard_value) {
				var s_path = wildcard_value.split('/');
				//console.log('s_path', s_path);

				if (s_path.length == 3) {
					var album_url_name = s_path[1];
					var track_url_name = s_path[2];

					var s_track_url_name = track_url_name.split('.');
					var track_base_name = s_track_url_name[0];
					var track_extension = s_track_url_name[1];

					//console.log('track_base_name', track_base_name);
					console.log('track_extension', track_extension);

					// Need to match it up with the resource's albums



					// Then load up and serve the file.

					//var media_file_path =

					// Likely to have been given specialised path info, in the metadata.
					//  Could have been provided with an album's path.

					var meta = this.meta;
					//console.log('meta', meta);

					var albums = meta.get('albums');
					//console.log('albums', albums);

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

					//console.log('s_track', s_track);

					// Anyway, choose the right file (from mp3 dir for the moment)

					// Must also be able to serve ogg paths.



					var media_file_path = album.path + '/' + track_extension + '/' + s_track + '.' + track_extension;
					console.log('media_file_path', media_file_path);
					//console.log('res (response)', res);

					// Also, we may not want to serve the whole audio file, but to begin the stream.
					//  Maybe we could keep the whole audio file in memory as a buffer.
					//  Don't want lots of large temporary buffers.




					// Also need to take into account the byte range.
					//  The serve audio function could be changed so that it can serve a byterange, eg x-
					//   from x to the end

					if (byte_end_pos) {
						serve_audio_file_from_disk(media_file_path, byte_start_pos, byte_end_pos, res);
					} else {

						if (typeof byte_start_pos != 'undefined') {
							serve_audio_file_from_disk(media_file_path, byte_start_pos, res);
						} else {
							serve_audio_file_from_disk(media_file_path, res);
						}


					}





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

	//return Site_Audio;
//});

module.exports = Site_Audio;
