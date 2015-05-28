if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['module', 'path', 'fs', 'url', '../../web/jsgui-html', 'os', 'http', 'url', './resource',
	'../../web/jsgui-je-suis-xml', 'cookies', '../../fs/jsgui-node-fs2-core'],

	function(module, path, fs, url, jsgui, os, http, libUrl,
		Resource, JeSuisXML, Cookies, fs2) {


	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;

	// Extends AutoStart_Resource?

	// May need to change around a fair few references to make it workable.
	// May need some more complicated logic to change it to the path for service.



	var serve_css_file_from_disk = function(filePath, response) {

        // look for the file in two places.
        // look within the project
        // look within jsgui

        // Checking if a file exists is not recommended.
        //  Possible race condition where exists checks and sees it's there, something else deletes it, then try to open the file thinking that it exists.
        //  Now recommended to open the file and handle error if it does not exist.

        //


        var file_path_in_project = filePath;

        // And also need to work outs path within the ws system.



		fs2.load_file_as_string(filePath, function (err, data) {
			if (err) {
                //console.log('could not open file filePath', filePath);

                // Try to open it from within the app's path.
                // ../../../ + filePath

				// Could try some different CSS paths
                //var jsgui_css_file_path = '../jsgui/' + filePath;
                var jsgui_css_file_path = '../../ws/' + filePath;


                fs2.load_file_as_string(jsgui_css_file_path, function (err, data) {
                    if (err) {
                        //console.log('could not open file jsgui_css_file_path', jsgui_css_file_path);

                        // Try to open it from within the app's path.
                        // ../../../ + filePath

                        //var jsgui_css_file_path = '../../../' + filePath;




                        throw err;
                    } else {
                        //var servableJs = updateReferencesForServing(data);
                        response.writeHead(200, {'Content-Type': 'text/css'});
                        response.end(data);
                    }
                });


				//throw err;
			} else {
				//var servableJs = updateReferencesForServing(data);
				response.writeHead(200, {'Content-Type': 'text/css'});
				response.end(data);
			}
		});
	}


	var Site_CSS = Resource.extend({

		'init': function(spec) {
			this._super(spec);

			this.meta.set('custom_paths', new Data_Object({}));
			// Those are custom file paths.

			// could have a collection of directories, indexed by name, that get served.

			// Index the collection by string value?
			this.meta.set('served_directories', new Collection({'index_by': 'name'}));
		},
		'start': function(callback) {
			callback(null, true);
		},
		'serve_directory': function(path) {
			// Serves that directory, as any files given in that directory can be served from /js
			var served_directories = this.meta.get('served_directories');
			//console.log('served_directories ' + stringify(served_directories));
			//served_directories.push(path);

			// May also want to serve a directory under a different path.



			served_directories.push({
				'name': path
			});
			//console.log('served_directories ' + stringify(served_directories));
			//console.log('path ' + path);


			//throw 'stop';



		},
		'process': function(req, res) {
			//console.log('Site_CSS processing HTTP request');
			var remoteAddress = req.connection.remoteAddress;

			var custom_paths = this.meta.get('custom_paths');

			var rurl = req.url;

			var pool = this.meta.get('pool');
			// should have a bunch of resources from the pool.

			//var pool_resources = pool.resources();
			//console.log('pool_resources ' + stringify(pool_resources));


			var url_parts = url.parse(req.url, true);
			//console.log('url_parts ' + stringify(url_parts));
			var splitPath = url_parts.path.substr(1).split('/');
			//console.log('resource site css splitPath ' + stringify(splitPath));


			if (rurl.substr(0, 1) == '/') rurl = rurl.substr(1);
			rurl = rurl.replace(/\./g, '☺');
			//console.log('rurl ' + rurl);

			var custom_response_entry = custom_paths.get(rurl);
			//console.log('custom_response_entry ' + stringify(custom_response_entry));

			if (custom_response_entry) {
				var tcr = tof(custom_response_entry);
				//console.log('tcr ' + tcr);

				if (tcr == 'data_value') {
					val = custom_response_entry.value();
					//console.log('val ' + val);

					var tval = tof(val);

					if (tval == 'string') {
						// then it should be a local file path, serve it.

						serve_css_file_from_disk(val, res);

					}
				}

				//throw 'stop';
			} else {
                //console.log('splitPath.length', splitPath.length);
                //console.log('splitPath', splitPath);
				if (splitPath.length > 0) {

					// Can check for /js folder.
					//  There will be some fixed resources for the site.
					//   They will be served by Resource objects.
					//  There may be some overlap of resources, with there being some very fixed purpose
					//   specific resources that could duplicate some features of the more general ones.
					//   Eventually, some of the code from the more specific resources will be
					//   replacable with code from the more general ones.

					// Site_JavaScript resource
					//  Will serve JavaScript files needed for the site.
					//   Could become more advanced at some points, serving particular builds.


					if (splitPath[0] == 'css') {
						//var sjs = pool.get_resource('Site JavaScript');
						//console.log('sjs ' + sjs);

						//throw 'stop';

						// determine the name of the file to serve, serve that file
						//  Could use some more general kind of file server.

						if (splitPath.length > 1) {
							if (splitPath.length == 2) {
								var fileName = splitPath[1];
								//console.log('url_parts.path ' + url_parts.path);


								//var filePath = url_parts.path.substr(1);



								//console.log('module.uri ' + module.uri);

								// No, need the current module's relative path....

								//var val2 =  path.dirname(module.uri);
								//console.log('val2 ' + val2);
								//throw '9) stop';

								//var diskPath = val2 + '/../css/' + fileName;

                                // May want to be serving it from the project path location.
                                //  Serve file from disk could try both locations to serve css from.

                                // could just serve the filename.

                                //var ws_file_disk_path = '../../ws/css/' + fileName;;

								//var diskPath = '../../ws/css/' + fileName;

                                var filePath = 'css/' + fileName;

                                //console.log('pre serve css file ', filePath);







								serve_css_file_from_disk(filePath, res);

								/*
								fs2.load_file_as_string(diskPath, function (err, data) {
									if (err) {
										throw err;
									} else {
										//var servableJs = updateReferencesForServing(data);
										res.writeHead(200, {'Content-Type': 'text/css'});
										res.end(data);
									}
								});
								*/
							} else {
								if (splitPath.length == 3) {
									// /js/core/jsgui-lang-enh
									//console.log('!*!*!*! url_parts.path ' + url_parts.path);
									/*
									if (splitPath[1] == 'core') {
										var fileName = splitPath[2];
										var val2 =  path.dirname(module.uri);
										//console.log('val2 ' + val2);
										var diskPath = val2 + '/../core/' + fileName;
										fs2.load_file_as_string(diskPath, function (err, data) {
											if (err) {
												throw err;
											} else {
												//var servableJs = updateReferencesForServing(data);
												res.writeHead(200, {'Content-Type': 'text/css'});
												res.end(data);
											}
										});
									}
									*/


								}

							}
						}
					}

				}
			}


			//console.log('remoteAddress ' + remoteAddress);

			// Need to be able to get the resource pool from this resource.
			//  It routes http calls to particular resources, and resources in the same pool make use of each
			//   other.


			// /js/...js

			// the site's static file resources.
			//  a file server that serves the files with their mime types.
			//   nice to have encapsulation of this because it can do compression.


			//console.log('this.parent() ' + stringify(this.parent()));
			// then

			// This could send it to an authenticated service / resource.

			//  /admin
			//  /admin/files could go to a file manager application (html resource)
			//   There could be the HTML interface to the File_System resource there.

			//  /admin/resources could go to the resource pool admin, from where it would be possible to administer
			//   and view various resource.

			// split the path up, then do various initial tests, then maybe send it to the admin resource.
			//  And the admin resource may not be the resource pool interface, it could be more user friendly,
			//  a gateway to deeper administration.
		}
	});


	return Site_CSS;


});
