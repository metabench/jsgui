

var path = require('path'), fs = require('fs'),
		url = require('url'), jsgui = require('../../web/jsgui-html'), os = require('os'), http = require('http'), libUrl = require('url'),
		Resource = require('./resource'), JeSuisXML = require('../../web/jsgui-je-suis-xml'), Cookies = require('cookies'), fs2 = require('../../fs/jsgui-node-fs2-core'), UglifyJS = require('uglify-js'), zlib = require('zlib');


var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
var filter_map_by_regex = jsgui.filter_map_by_regex;
var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
var fp = jsgui.fp, is_defined = jsgui.is_defined;
var Collection = jsgui.Collection;
var call_multi = jsgui.call_multi, get_truth_map_from_arr = jsgui.get_truth_map_from_arr;

var browserify = require('browserify');

// Extends AutoStart_Resource?


// May need to change around a fair few references to make it workable.
// May need some more complicated logic to change it to the path for service.


// This will also be able to be told to serve some particular files from some particular locations.


// It can have a custom_serving_map.

// That means that some specific urls that are given as inputs refer to specific files, perhaps with
//  relative paths.

// Since this is a resource, we could wrap that in the .meta object.
//  Or just have a custom_paths_map Data_Object.


// Not so sure about this.
//  Processing of files for serving. Maybe some kind of map would work well.
//  Now the path name is needed in order to serve various files.
//  Some of the files will be useful on the client as well (possibly resources).

// This file seems too hackily put together.

// There may be different categories of JavaScript files to serve or not serve.
//  We want the app, by default, to serve necessary files for the JSGUI client.
//  May get into compressing and browserifying them too.

// May need some more general purpose resource for dealing with JavaScript files.
//  Want to make it easy to serve the client files in its default configuration.

// Perhaps we could have availability comments within the JavaScript files.
//  So whatever folder it is in, we can know it should be served at /js/jsgui-lang-utils or similar.
//  However, it may be best to have the client app mirror the structure on the server.
//  Could make the app easier to serve, and mean we don't need to transform references.

// /js/web/jsgui-html-client
//  could start with that path.
//  most of what we look for will be within web anyway.
//  we could also make some other things available from resources.
//   not everything in web is suitable for the client anyway.
//   many things from outside web will be suitable for the client.

// Needs to make sure the require.js file gets served.
//  Then there will be a bunch of other files that get requested.
//  Better to try serving the files in their paths without modification.


var serve_js_file_from_disk_updated_refs = function(filePath, response, callback) {
	fs2.load_file_as_string(filePath, function (err, data) {
		if (err) {
			throw err;
		} else {
			//console.log('');
			//console.log('serve_js_file_from_disk_updated_refs filePath ' + filePath);

			//console.log('data ' + data);
			//var servableJs = updateReferencesForServing(data);

			response.writeHead(200, {'Content-Type': 'text/javascript'});
			//response.end(servableJs);
			response.end(data);
		}
	});
}

var check_served_directories_for_requested_file = function(arr_served_paths, split_path_within_js, callback) {
	//console.log('check_served_directories_for_requested_file');
	//console.log('split_path_within_js ' + stringify(split_path_within_js));
	//console.log('arr_served_paths ' + stringify(arr_served_paths));
	// use call_multi.
	// maybe we get a result from them all.

	var fns = [

	]

	var checkPath = function(path, callback) {
		// check to see if an existing file matches up with the path that is requested.
		// so, from that path, we use the split_path_within_js for the rest of the file path.

		// then we check if such a (JS) file exists.
	}

	// fns.push([fs2.load_file_as_string, [source_path_item], function(err, res_loaded) {

	// Not so sure I can use the exists function like this...
	var reconstitutedPathWithinJs = split_path_within_js.join('/');
	var firstFoundPath;
	each(arr_served_paths, function(i, fsPath) {
		fns.push([function(callback) {
			var checkingPath = fsPath + '/' + reconstitutedPathWithinJs;
			fs.exists(checkingPath, function(exists) {
				//console.log('cb fsPath ' + checkingPath + ' exists ' + exists)
				if (exists &! firstFoundPath) {
					firstFoundPath = checkingPath;
				}
				callback(null, exists);
			})
		}, []]);
	});

	call_multi(fns, function(err, res_multi) {
		if (err) {
			console.log('err ' + err);
			throw 'stop';
		} else {
			//console.log('res_multi ' + stringify(res_multi));
			//throw 'stop';

			if (firstFoundPath) {
				callback(null, firstFoundPath);
			} else {
				callback(null, null);
			}
		}
	})

	// add a function check for each of the
}

// A way of serving a file so that it includes custom code.
//  Or have a standard client template that is easy to serve.

// Maybe do more with custom controls, such as custom page controls.
//  Those page controls would know which control types are within them.
//  That info could then be used to write JS code that sets up the references on the client.



// Possibly this should have its own routing tree to connect paths with js files?
//  Need to set up custom paths.



var Site_JavaScript = Resource.extend({
	//'fields': {
	//	'custom_paths': 'data_object'
	//},

	'init': function(spec) {
		this._super(spec);

		this.meta.set('custom_paths', new Data_Object({}));
		// Those are custom file paths.

		// could have a collection of directories, indexed by name, that get served.

		// Index the collection by string value?

		this.meta.set('served_directories', new Collection({'index_by': 'name'}));

	},
	'start': function(callback) {

		console.log('Site_JavaScript start');

		var build_on_start = this.meta.value('build_on_start');


		if (build_on_start) {
			this.build_client(function(err, res_build) {
				if (err) {
					callback(err)
				} else {
					callback(null, true);
				}
			})
		} else {
			callback(null, true);
		}

		// Let's have it build the client-side code.
		//  Need the options to ignore various files, as well as to include the source maps in the output.





	},

	'build_client': function(callback) {
		// Need the reference relative to the application directory.

		//var path = __dirname + '/js/app.js';
		var appDir = path.dirname(require.main.filename);
		//console.log('appDir', appDir);

		var app_path = appDir + '/js/app.js';
		var app_bundle_path = appDir + '/js/app-bundle.js';

		//
		var wstream = fs.createWriteStream(app_bundle_path);
		var b = browserify();

		//b.require(app_path, {
		//	entry: true,
		//	debug: true
		//});
		b.add(app_path);
		//console.log('app_path', app_path);
		//console.log('pre browserify bundle');
		//b.bundle().pipe(process.stdout);

		b.bundle().pipe(wstream);

		wstream.end = function (data) {

			//console.log('file bundle write complete');

			callback(null, app_bundle_path);
			// no more writes after end
			// emit "close" (optional)
		}

		//setTimeout(function() {
		//	throw 'stop';
		//}, 20000);



		//browserify(path)
	},

	// Will could serve all jsgui code?
	//  May be better not to allow server-side code to be read on the client.
	//  Could have specific directories within jsgui that get served to the client.




	'serve_directory': function(path) {
		// Serves that directory, as any files given in that directory can be served from /js
		var served_directories = this.meta.get('served_directories').value();
		console.log('served_directories ' + stringify(served_directories));
		//served_directories.push(path);
		served_directories.push({
			'name': path
		});
		//console.log('served_directories ' + stringify(served_directories));
		//console.log('path ' + path);

		//throw 'stop';

	},

	// Want to be able to serve specific js files.

	// Need better syntax than this:
	//  //site_js.meta.set('custom_paths.js/modernizr-latest☺js', './client/js/modernizr-latest.js');

	// .set_custom_path(url, fileName)
	//  would need to appear in the main routing tree perhaps?

	'set_custom_path': function(url, file_path) {
		// But change the URL to have a smiley face instead of fullstops
		//console.log('url', url);
		var escaped_url = url.replace(/\./g, '☺');
		//console.log('escaped_url', escaped_url);

		//this.meta.set('custom_paths.' + escaped_url, file_path);
		var custom_paths = this.meta.get('custom_paths');
		//console.log('custom_paths', custom_paths);
		custom_paths.set(escaped_url, file_path);

	},

	'process': function(req, res) {
		console.log('Site_JavaScript processing req.url', req.url);
		var remoteAddress = req.connection.remoteAddress;
		//console.log('remoteAddress ' + remoteAddress);

		// Need to be able to get the resource pool from this resource.
		//  It routes http calls to particular resources, and resources in the same pool make use of each
		//   other.


		// /js/...js

		// //site_js.meta.set('custom_paths.js/app☺js', './client/js/app.js');

		// http://192.168.2.3/js/app.js

		// need to serve /js/app.js.
		//  however the Website Resource should set this up.



		// the site's static file resources.
		//  a file server that serves the files with their mime types.
		//   nice to have encapsulation of this because it can do compression.

		// It may be useful to get given the rest of the URL.



		var custom_paths = this.meta.get('custom_paths');

		//console.log('custom_paths', custom_paths);
		//console.log('tof custom_paths', tof(custom_paths));

		var rurl = req.url.replace(/\./g, '☺');

		if (rurl.substr(0, 1) == '/') rurl = rurl.substr(1);


		//console.log('rurl', rurl);

		var custom_response_entry = custom_paths.get(rurl);

		// hmmmm get not working right?



		//console.log('custom_response_entry', custom_response_entry);

		var pool = this.meta.get('pool');
		if (custom_response_entry) {
			// we serve the file pointed to.


			var file_path = custom_response_entry.value();

			//console.log('file_path', file_path);



			//throw 'stop';

			//var disk_path = '../../ws/js/' + wildcard_value;

			fs2.load_file_as_string(file_path, function (err, data) {
				if (err) {
					throw err;
				} else {
					//console.log('');
					//console.log('serve_js_file_from_disk_updated_refs filePath ' + filePath);


					//console.log('data ' + data);
					//var servableJs = updateReferencesForServing(data);

					res.writeHead(200, {'Content-Type': 'text/javascript'});
					//response.end(servableJs);
					res.end(data);
				}
			});


		} else {
			//throw 'stop';



			//console.log('this.parent() ' + stringify(this.parent()));
			// then


			// should have a bunch of resources from the pool.

			//var pool_resources = pool.resources();
			//console.log('pool_resources ' + stringify(pool_resources));

			// Could serve the app's /js directory by default.
			//  Some kind of caching could be useful?
			//   Less useful for development.





			var served_directories = this.meta.get('served_directories');





			var url_parts = url.parse(req.url, true);
			//console.log('url_parts ' + stringify(url_parts));
			var splitPath = url_parts.path.substr(1).split('/');

			//console.log('splitPath ' + stringify(splitPath));


			//console.log('req.url ' + req.url);

			// Could make a few special cases.


			var wildcard_value = req.params.wildcard_value;
			//console.log('*** wildcard_value', wildcard_value);

			if (wildcard_value == 'web/require.js') {
				//console.log('serving require.js');

				// Could even have the whole JS as a variable in the code here!
				//  Better to load it and serve it from disk though.

				// Don't want to have to load it each time though...
				//  But that's convenient for developing anyway.

				// Should not be running from apps!
				//  Got a problem with the file location here!



				fs2.load_file_as_string('../../ws/js/web/require.js', function (err, data) {
					if (err) {
						throw err;
					} else {
						//console.log('');
						//console.log('serve_js_file_from_disk_updated_refs filePath ' + filePath);


						//console.log('data ' + data);
						//var servableJs = updateReferencesForServing(data);

						res.writeHead(200, {'Content-Type': 'text/javascript'});
						//response.end(servableJs);
						res.end(data);
					}
				});
			} else {
				// Can get the path on disk...

				//console.log('wildcard_value', wildcard_value);

				// Best to check the app's directory.
				//  We probably won't need to be serving the whole jsgui framework from here.
				//  It can be built and put in the app's js directory.
				//  Could also make it buildable on the server?





				var disk_path = '../../ws/js/' + wildcard_value;

				// Would be good to uglify and gzip what gets served.


				var compress = false;

				if (compress) {
					fs2.load_file_as_string(disk_path, function (err, data) {
						if (err) {
							throw err;
						} else {

							// And gzipped too...

							var minified = UglifyJS.minify(data, {
								fromString: true
							});
							//console.log('minified', minified);

							zlib.deflate(minified.code, function (err, buffer) {
								if (err) throw err;

								res.writeHead(200, {
									'Content-Encoding': 'deflate',
									'Content-Type': 'text/javascript'
								});

								res.end(buffer);

								//res.writeHead(200, {'Content-Type': 'text/javascript'});
								//response.end(servableJs);
								//res.end(minified.code);
							});


							//console.log('minified', minified);

							//console.log('');
							//console.log('serve_js_file_from_disk_updated_refs filePath ' + filePath);


							//console.log('data ' + data);
							//var servableJs = updateReferencesForServing(data);


						}
					});
				} else {


					// try to load it from the project's js path.

					//console.log('disk_path', disk_path);

					var project_js_path = 'js/' + wildcard_value;
					//console.log('project_js_path', project_js_path);

					fs2.load_file_as_string(project_js_path, function(err, str_js) {
						if (err) {
							console.log('error loading from project_js_path: ', project_js_path);
							console.log(err);
							throw err;
						} else {
							// Have loaded the js from the project path, we can serve it.

							//console.log('have loaded js');

							// serve the js.
							res.writeHead(200, {'Content-Type': 'text/javascript'});
							//response.end(servableJs);
							res.end(str_js);



							//throw 'stop';


						}
					})


					/*
					 fs2.load_file_as_string(disk_path, function (err, data) {
					 if (err) {
					 throw err;
					 } else {

					 // And gzipped too...


					 res.writeHead(200, {'Content-Type': 'text/javascript'});
					 //response.end(servableJs);
					 res.end(data);



					 }
					 });
					 */


				}



			}

		}


		// For the moment, can load other files from the system.
		//  Though this will need to check security later on too.
		//   Perhaps specifically disallow some files.

		// Don't want to have to change the files before serving if it's not necessary with require.

		// Browserify and better compression seems like the way to do it.
		//  Want to get these very small sized apps made.







		// Could have it so that require.js or whatever else is set up to be served.

		// Could have special handling for reuqire.js


		// Want another path parameter - not just the whole path, but need to know the path from the resource.


		/*

		 if (splitPath.length > 0) {
		 //console.log('req.url ' + req.url);
		 //

		 var rurl = req.url;
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

		 serve_js_file_from_disk_updated_refs(val, res);

		 }

		 }

		 //throw 'stop';
		 } else {
		 //console.log('no custom response for url ' + rurl);
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

		 if (splitPath[0] == 'js') {
		 //var sjs = pool.get_resource('Site JavaScript');
		 //console.log('sjs ' + sjs);
		 //throw 'stop';

		 // determine the name of the file to serve, serve that file
		 //  Could use some more general kind of file server.

		 if (splitPath.length > 1) {

		 // we can check to see if the file is in any of the served directories.

		 // served_directories
		 // go through all the served directories, looking for the file.var served_direct

		 var served_dir_names = [];

		 served_directories.each(function(i, v) {
		 //console.log('i ' + i);
		 //console.log('v ' + v);
		 //console.log('v ' + stringify(v));

		 var name = v.get('name').value();
		 // we search for the file on disk in that directory, and serve it if it is found.

		 //
		 served_dir_names.push(name);

		 });
		 //console.log('served_dir_names ' + stringify(served_dir_names));

		 // I think I'll need to better encapsulate this using callback functions.
		 //  Will have a callback function checkServedDirectoriesForFile(path);

		 // will keep it neater.




		 var potentially_serve_app_js = function() {
		 //console.log('potentially_serve_app_js');
		 //console.log('splitPath ' + stringify(splitPath));

		 // May have a better way of dealing with this.
		 //  Will start at the root, then look for the file.

		 // Will also try to construct the file's path on the server.

		 var dirPath = path.dirname(module.uri);;
		 //console.log('dirPath ' + dirPath);
		 //console.log('dirPath ' + stringify(dirPath.split('/')));

		 if (dirPath[dirPath.length - 1] == '.') dirPath = dirPath.substr(0, dirPath.length - 1);
		 if (dirPath[dirPath.length - 1] == '/') dirPath = dirPath.substr(0, dirPath.length - 1);
		 console.log('dirPath ' + dirPath);

		 var pp = fs2.path_parent(fs2.path_parent(dirPath));
		 //console.log('pp ' + pp);

		 var path_file = pp + '/' + splitPath.join('/');
		 //console.log('path_file ' + path_file);




		 // then create a file path including what's requested.

		 fs.exists(path_file, function(exists) {
		 if (exists) {
		 serve_js_file_from_disk_updated_refs(path_file, res);
		 }

		 else {
		 //console.log('file does not exist');

		 if (splitPath.length == 2) {
		 var fileName = splitPath[1];
		 //console.log('url_parts.path ' + url_parts.path);
		 var filePath = url_parts.path.substr(1);
		 //console.log('module.uri ' + module.uri);
		 var val2 =  path.dirname(module.uri);
		 //console.log('val2 ' + val2);
		 var diskPath = val2 + '/' + fileName;

		 //console.log('1) diskPath ' + diskPath);

		 fs.exists(diskPath, function(exists) {
		 if (exists) {
		 serve_js_file_from_disk_updated_refs(diskPath, res);
		 }

		 else {
		 console.log('file does not exist');
		 }

		 })
		 // If that file exists!!!?
		 //serve_js_file_from_disk_updated_refs(diskPath, res);
		 } else {
		 if (splitPath.length == 3) {
		 // /js/core/jsgui-lang-enh
		 //console.log('!*!*!*! url_parts.path ' + url_parts.path);

		 if (splitPath[1] == 'core') {
		 var fileName = splitPath[2];
		 var val2 = path.dirname(module.uri);
		 //console.log('val2 ' + val2);
		 var diskPath = val2 + '/../core/' + fileName;
		 //console.log('2) diskPath ' + diskPath);

		 fs.exists(diskPath, function(exists) {
		 if (exists) {
		 serve_js_file_from_disk_updated_refs(diskPath, res);
		 }
		 })

		 }
		 }
		 }
		 }

		 })
		 }

		 // check the served directories for the requested file.
		 check_served_directories_for_requested_file(served_dir_names, splitPath.slice(1), function(err, fileRes) {
		 if (err) {
		 throw err;
		 } else {
		 //console.log('cb check_served_directories_for_requested_file fileRes ' + stringify(fileRes));
		 if (fileRes) {
		 // we serve that.
		 serve_js_file_from_disk_updated_refs(fileRes, res);
		 } else {
		 potentially_serve_app_js();
		 }
		 //throw 'stop';

		 }
		 })
		 }
		 }

		 if (splitPath[0] == 'admin') {
		 // direct it to the admin router?
		 // to the admin resource?

		 // perhaps there will be deeper routing in the application router.

		 if (splitPath.length > 1) {
		 if (splitPath[1] == 'files') {
		 // We don't have the references exactly?
		 //  Or this has access to the application?

		 // And to file admin?
		 //  Quite possibly...

		 // So there is the local file system resource,
		 //  we can get that from the resource pool.
		 // There would also need to be a resource to administer that.
		 //  View it / access it.
		 //  Administer may be right because it needs admin access.

		 fswa.process(req, res);
		 // The file administrator should also split the paths and do that calculation I think.
		 //  May well send processing metadata through in a little while as a further object.
		 }
		 } else {

		 }
		 }
		 }

		 }

		 */

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

/*
 return Site_JavaScript;


 });
 */
module.exports = Site_JavaScript;
