

// Adding process_copy function


/*
 if (typeof define !== 'function') {
 var define = require('amdefine')(module);
 }


 //['jsgui-lang-essentials', 'node-rasters']

 define(['../core/jsgui-lang-essentials', 'child_process', 'ncp', './jsgui-node-file-checksum', 'rimraf'],
 function (jsgui, child_process, ncp_module, checksum, rimraf) {
 */

var jsgui = require('../core/jsgui-lang-essentials', 'child_process', 'ncp', './jsgui-node-file-checksum', 'rimraf');
var child_process = require('child_process');
var ncp_module = require('ncp');
var checksum = require('./jsgui-node-file-checksum');
var rimraf = require('rimraf');
//var child_process = require('child_process');

//define(['jsgui-lang-essentials', 'node-rasters', 'node-spritesheet', 'xpath', 'jsgui-html', 'phantom', 'xmldom', 'ncp'], function (jsgui, node_rasters, node_spritesheet, xpath, jsgui_html, phantom, xmldom, ncp) {

var ncp = ncp_module.ncp;
var log = console.log;

// removing libxmljs?

var each = jsgui.each, stringify = jsgui.stringify, is_array = jsgui.is_array;
var is_defined = jsgui.is_defined;
var tof = jsgui.tof, arrayify = jsgui.arrayify, mapify = jsgui.mapify;

var dir_separator = '/';
if (process.platform === 'win32') dir_separator = '\\';

var fs = require('fs');
var node_path = require('path');
//var im = require('imagemagick');
//var libxmljs = require("libxmljs");

var exec = child_process.exec;
var fp = jsgui.fp;
var call_multiple_callback_functions = jsgui.call_multiple_callback_functions;
var call_multi = jsgui.call_multi;

var Fns = jsgui.Fns;

var recursive_xml_traversal = function(xml, el_callback) {
	if (xml.root) {
		var root = xml.root();
		recursive_xml_traversal(root, el_callback);
	} else {
		if (xml.attrs) {
			el_callback(xml);
			var cns = xml.childNodes();
			each(cns, function(i, v) {
				recursive_xml_traversal(v, el_callback);
			});
		}
	}
};

var map_extension_mime_types = {
	'html': 'text/html',
	'htm': 'text/html',

	'ico': 'image/x-icon',
	'txt': 'text/plain',
	'xml': 'application/xml',

	'png': 'image/png',
	'gif': 'image/gif',
	'jpeg': 'image/jpeg',
	'jpg': 'image/jpeg',
	'bmp': 'image/bmp',

	'svg': 'image/svg+xml',

	'mp3': 'audio/mpeg3',
	'ogg': 'audio/ogg',
}

var sequential_execute_fs_child_processes = function(arr_fs_process_commands, callback) {

	// not sure about doing the unused simultaneous method of multithreading.

	// may do that version later.

	var l = arr_fs_process_commands.length;
	var c = 0;

	var process = function() {
		var command = arr_fs_process_commands[c];
		c++;

		//console.log('pre exec command ' + command);
		exec(command, function(error, stdout, stderr) {
			if (error) {
				throw(error);
			} else {
				if (c < l) {
					process();
				} else {
					callback(null);
				}

			}
		})
	}

	if (c < l) process();

}

var fs2 = {

	'path_parent': function(strPath) {
		var dirSep = '/';
		//console.log('strPath', strPath);
		var pos1 = strPath.lastIndexOf(dirSep);
		if (pos1 > -1) {
			var beginning = strPath.substr(0, pos1);
			//console.log('beginning ' + beginning);
			return beginning;
		}

	},

	'path_last_part': function(strPath) {
		// the last part is not necessarily a file name, it may be.
		var dirSep = '/';
		var pos1 = strPath.lastIndexOf(dirSep);
		if (pos1 > -1) {
			var theRest = strPath.substr(pos1 + 1);
			//console.log('theRest ' + theRest);
			return theRest;
		} else {
			return strPath;
		}

	},

	// dir_svg_dirs_to_png_dirs
	//  creates the png directories according to output format.
	//  could output to multiple formats as well.

	'walk': function(start_path, dir_callback, callback) {
		// May also need to know how many to do asymcronously at once.


		// may be recursive inside... that could be easier.
		// think this does need a callback for call_multi to work right.

		var rec = function(path, rcb) {
			//console.log('rec path ' + path);

			// read the contents from that path.

			fs2.dir_contents(path, function(err, contents) {
				if (err) {
					callback(err);
				} else {
					//console.log('contents ' + stringify(contents));

					dir_callback(path, contents);

					// have the directory callback with all the contents here.

					// however, need to go through each of the directories, processing them.
					//  don't want too much code branching.

					// will use call_multi

					var fns = [];
					each(contents.directories, function(i, directory) {
						//console.log('directory ' + stringify(directory));

						var dirPath = path + '/' + directory;
						//log('dirPath ' + dirPath);
						fns.push([rec, [dirPath]]);
					});
					call_multi(fns, function(err, res) {
						if (err) {
							//log('call_multi err ' + err);
							throw err;
						} else {
							//log('call multi cb');
							rcb();

						}
					})



				}
			})
		}

		rec(start_path, callback);

	},

	'exists': function(path, callback) {
		fs.exists(path, function(res) {
			callback(null, res);
		})
	},


	// want to save a binary file as well.

	// But loading binary gets more complicated as we need to know the format in many cases, so will have specific functions
	//  to load typed arrays.

	// Seems to work OK.
	//  Will also want to load binary files.



	'save_binary': function(file_path, file_content, callback) {
		// the file content could be a typed array.
		// just try to create a buffer out of it.
		//console.log('save_binary ' + file_path);

		if (file_content.buffer.byteLength) {
			// its a typed array

			console.log('file_content.length', file_content.length);

			var buf = new Buffer(file_content.buffer);

			// but does it calculate the buffer length correctly?
			console.log('buf.length', buf.length);

			fs.open(file_path, "w", function(err, fd) {
				if (err) { callback(err); } else {

					//console.log('file opened');
					fs.write(fd, buf, 0, buf.length, function(err, res_write) {
						if (err) { console.log('err', err); callback(err); } else {
							//console.log('file written');
							fs.close(fd);
							//console.log('written to file_path ' + file_path);
							callback(null, file_path);
						}
					})
				}
			});
		}

		// But does the buf have a bytelength





	},

	// could put in filter objects...
	//  so the text begins with something, has an extension, file size

	// plain mapify to use here I think.
	//  may need to modify mapify to support callback functions like arrayify.
	//  Can save a whole bunch of files as strings.
	'save_file_as_string': mapify(fp(function(a, sig) {
		//console.log('save_file_as_string sig ' + sig);

		// and could JSON stringify an object.

		if (sig == '[s,o,f]' || sig == '[s,a,f]') {
			var file_path = a[0];
			var file_content = JSON.stringify(a[1]);
			var callback = a[2];
			return this.save_file_as_string(file_path, file_content, callback);
		}

		if (sig == '[s,s,f]') {
			var file_path = a[0];
			var file_content = a[1];
			var callback = a[2];
			//console.log('pre write file file_path', file_path);
			fs.writeFile(file_path, file_content, function(err) {
				if(err) {
					//console.log(err);
					callback(err);
				} else {
					//console.log("The file was saved!");
					callback(null, true);
					// could return the file path?
					//  returning timing info would be cool as well.
					//  could maybe make a function that keeps track of it as a function is executed.


				}
			});
		};
	})),

	'process_file_as_string': function(file_path, fnProcess, callback) {
		fs2.load_file_as_string(file_path, function(err, str_file) {
			if (err) {
				callback(err);
			} else {
				fs2.save_file_as_string(file_path, fnProcess(str_file), callback);
			}
		});
	},

	// Loading a file as a Uint8 Typed array will become more important.
	//  Will be using them rather than buffers in many cases.
	//  Will be easier to interface with C++ code.

	// Probably not needed - as buffer is a Uint8Array.

	// May be easier to carry out operations on a Uint8Array in general though.


	// Also want to be able to load a file as a buffer.

	'load_file_as_buffer': fp(function(a, sig) {
		//source_path, callback

		// should work as an array...
		// so when you give it an array of source paths, it loads them all, and returns the result as an array by default.
		//  can return a map if asked to... would be easier to access in many cases, but problems when there are repeated params.
		// I think return map by default.
		//  Arrayify input, mapify output.

		// could use arrayify here possibly...

		// could have a concurrency_limit argument.
		//  would be useful to incorporate that into a lot of code as an option.

		var source_path, concurrency_limit = 4, callback;

		//console.log('load_file_as_string sig ' + sig);

		if (sig == '[a,n,f]') {
			source_path = a[0];
			concurrency_limit = a[1];
			callback = a[2];
		}
		if (sig == '[s,n,f]') {
			source_path = a[0];
			concurrency_limit = a[1];
			callback = a[2];
		}
		if (sig == '[a,f]') {
			source_path = a[0];
			callback = a[1];
		}
		if (sig == '[s,f]') {
			source_path = a[0];
			callback = a[1];
		}

		if (tof(source_path) == 'string') {
			fs.readFile(source_path, function(err, data_buffer) {
				if (err) {
					//console.log('error reading file at ' + source_path);
					//var stack = new Error().stack;

					// callback with the error.


					//console.log(stack);

					//throw err;

					callback(err);
				} else {
					callback(null, data_buffer);
				}
				//console.log('OK: ' + filename);
				//console.log(data)
			});

		} else if (tof(source_path) == 'array') {
			var res = {};
			var fns = [];
			each(source_path, function(i, source_path_item) {
				fns.push([fs2.load_file_as_buffer, [source_path_item], function(err, res_loaded) {
					if (err) throw err;

					res[source_path_item] = res_loaded;

				}]);
			});
			call_multi(fns, function(err, res_multi) {
				if (err) throw err;
				callback(null, res);
			});
		}

		//fs.readFile(filename, 'utf8', function(err, data_buffer) {

	}),

	'load_json_as_object': function(path, callback) {
		this.load_file_as_string(path, function(err, str_file) {
			if (err) { callback(err); } else {
				// try/catch?
				//return JSON.parse(str_file);

				callback(null, JSON.parse(str_file));
			}
		});
	},

	'load_file_as_string': fp(function(a, sig) {
		//source_path, callback

		// should work as an array...
		// so when you give it an array of source paths, it loads them all, and returns the result as an array by default.
		//  can return a map if asked to... would be easier to access in many cases, but problems when there are repeated params.
		// I think return map by default.
		//  Arrayify input, mapify output.

		// could use arrayify here possibly...

		// could have a concurrency_limit argument.
		//  would be useful to incorporate that into a lot of code as an option.

		var source_path, concurrency_limit = 4, callback;

		//console.log('load_file_as_string sig ' + sig);

		if (sig == '[a,n,f]') {
			source_path = a[0];
			concurrency_limit = a[1];
			callback = a[2];
		}
		if (sig == '[s,n,f]') {
			source_path = a[0];
			concurrency_limit = a[1];
			callback = a[2];
		}
		if (sig == '[a,f]') {
			source_path = a[0];
			callback = a[1];
		}
		if (sig == '[s,f]') {
			source_path = a[0];
			callback = a[1];
		}

		if (tof(source_path) == 'string') {
			fs.readFile(source_path, function(err, data_buffer) {
				if (err) {
					callback(err);
				} else {
					callback(null, data_buffer.toString());
				}
				//console.log('OK: ' + filename);
				//console.log(data)
			});

		} else if (tof(source_path) == 'array') {
			var res = {};
			var fns = [];
			each(source_path, function(i, source_path_item) {
				fns.push([fs2.load_file_as_string, [source_path_item], function(err, res_loaded) {
					if (err) throw err;

					res[source_path_item] = res_loaded;

				}]);
			});
			call_multi(fns, function(err, res_multi) {
				if (err) throw err;
				callback(null, res);
			});
		}

		//fs.readFile(filename, 'utf8', function(err, data_buffer) {

	}),

	'dir_dirs_beginning': function(dir_path, beginning_text, callback) {
		//console.log('dir_path ' + dir_path);
		//console.log('dir_path ' + tof(dir_path));

		// dir_contents has been arrayified, need to make sure it still works.
		//console.log('pre dir_contents');
		fs2.dir_contents(dir_path, function(err, dir_contents) {
			if (err) {
				throw err;
			} else {
				var directories = dir_contents.directories;
				var target_directories = [];
				each(directories, function(i, v) {
					if (v.substr(0, beginning_text.length) == beginning_text) target_directories.push(v);
				});
				callback(null, target_directories);
			}
		})
	},

	'ensure_directory_exists': function(dir_path, callback) {
		fs.exists(dir_path, function(exists) {
			if (exists) {
				callback(null, true);
			} else {
				// Maybe go backwards recursively and make sure parents exist.
				fs.mkdir(dir_path, function(err) {
					if (err) {
						throw(err);
					} else {
						callback(null, true);
					}
				})
			}
		})
	},

	// could use an arrayify function for functions with callbacks.
	'dir_ensure': function(dir_path, callback) {
		if (tof(dir_path) == 'array') {
			var fns = [];
			each(dir_path, function(i, v) {
				fns.push([fs2.dir_ensure, [v]]);
			});
			call_multiple_callback_functions(fns, callback)
		} else {
			fs.exists(dir_path, function(exists) {
				if (exists) {
					callback(null, dir_path);
				} else {
					fs.mkdir(dir_path, function(err, res) {
						if (err) {
							throw err;
						} else {
							callback(null, dir_path);
						}
					})
				}
			});
		}
	},

	// dir_ensure_named_numbered

	'dir_ensure_named_numbered': function(parentPath, name, callback) {
		// get the list of directories in the parent, make a map.
		this.dir_dirs_beginning(parentPath, name, function(err, resDirsBeginning) {
			if (err) {
				callback(err);
			} else {
				//console.log('resDirsBeginning ' + stringify(resDirsBeginning));
				var map_dirs_beginning = {};
				each(resDirsBeginning, function(i, v) {
					map_dirs_beginning[v] = true;
				});
				//console.log('map_dirs_beginning ' + stringify(map_dirs_beginning));

				// then loop to generate the name
				var c = 0, genName = name + '_' + c;
				while (map_dirs_beginning[genName]) {
					c++;
					genName = name + '_' + c;
				}
				// then we create the directory.

				var dirPath = parentPath + '/' + genName;
				//console.log('dirPath ' + dirPath);

				fs2.dir_ensure(dirPath, callback);



			}
		})

	},

	// likely to use an extension filer on dir_contents?
	//  that way could also do a traversal_depth, so it looks in subdirectories


	'dir_files_by_extension': fp(function(a, sig) {
		var path = a[0], extension = a[1], include_metadata = false, callback;

		if (a.l == 3) {
			callback = a[2];
		}
		if (a.l == 4) {
			include_metadata = a[2];
			callback = a[3];
		}

		var contents_cb = function(err, dir_contents) {
			if (err) {

			} else {
				//console.log('dir_contents ' + stringify(dir_contents));

				var res = [];
				each(dir_contents.files, function(i, v) {
					//console.log('v ' + stringify(v));

					var file_name;

					if (tof(v) == 'array') {
						file_name = v[0];
					}
					if (tof(v) == 'string') {
						file_name = v[1];
					}

					var file_extension = node_path.extname(file_name);
					if (extension == file_extension) {


						res.push(v);
					}

				})
				//return res;
				//console.log('res ' + res);
				callback(null, res);
			}
		};

		if (include_metadata) {
			fs2.dir_contents(path, include_metadata, contents_cb);
		} else {

			fs2.dir_contents(path, contents_cb);
		}

	}),

	// option include_metadata?
	// can include an extension filter.


	// dir_dirs?

	// and have this arrayified on param 0?
	//  we may then want to get the contents of a bunch of dirs.

	'dir_dirs': fp(function(a, sig) {
		// can still apply to multiple dirs.
		// source_dir, callback

		var source_dir, callback;

		//console.log('dir_dirs sig ' + sig);

		if (sig == '[s,f]') {
			source_dir = a[0];
			callback = a[1];
			this.dir_contents(source_dir, {'files_or_directories': 'directories'}, callback);
		}
		if (sig == '[s,o,f]') {
			source_dir = a[0];
			options = a[1];
			callback = a[2];
			options.files_or_directories = 'directories';
			this.dir_contents(source_dir, options, callback);
		}
		// but do want this to allow a filter as well.

	}),

	// want to be able to load the file contents too.

	// could have this get directory contents recursively to a path... or maybe use the specialised function for that.
	'dir_contents': arrayify(0, fp(function(a, sig) {
		// path, callback

		var path = a[0], filter, include_metadata = false, include_file_contents = false, callback, t_filter;
		var fs_paths = false;
		// with an extension filter...

		var extension_filter;
		var regex_filter;

		var res_format = 'array';

		//console.log('dir_contents sig ' + sig);

		// may want to specify options object.
		//  may want to load the directories, that could be specified as an option.

		var files_or_directories;
		if (a.l == 2) {
			// [s,f]
			callback = a[1];
		}
		if (a.l == 3) {

			// [s,s,f]
			//  it has an extension filter.

			if (sig == '[s,s,f]') {
				filter = a[1];
				extension_filter = filter;
				t_filter = 'extension';
				callback = a[2];
				var options = {};
				options.files_or_directories = 'files';
			}

			// [s,b,f]

			// [s,r,f]

			// [s,o,f]
			//  can have an options object there.
			//  another option can be files_or_directories??? better name?

			if (sig == '[s,o,f]') {
				//include_metadata = a[1];
				var options = a[1];
				if (options.include_metadata) include_metadata = options.include_metadata;
				if (options.files_or_directories) files_or_directories = options.files_or_directories;
				if (options.include_file_contents) include_file_contents = options.include_file_contents;
				if (options.res_format) res_format = options.res_format;

				if (options.filter) {
					filter = options.filter;
					t_filter = tof(filter);

					// then if t_filter is 'object', there will be more filter properties.

					if (t_filter == 'object') {
						if (filter.extension) {
							//filter = filter.extension;
							//t_filter = 'extension';
							extension_filter = filter.extension;

						}
						if (filter.regex) {
							//filter = filter.extension;
							//t_filter = 'extension';
							regex_filter = filter.regex;

						}
					}
				}
				if (options.fs_paths) {
					fs_paths = options.fs_paths;
					//throw 'stop';
				}
				callback = a[2];
				//console.log('sof');
			}

			if (sig == '[s,b,f]') {
				include_metadata = a[1];
				callback = a[2];
			}
			if (sig == '[s,r,f]') {
				filter = a[1];
				t_filter = 'regex';
				regex_filter = filter;
				callback = a[2];
			}



			// regex being the filter
		}
		if (a.l == 4) {
			if (sig == '[s,s,b,f]') {
				filter = a[1];
				t_filter = 'extension';
				include_metadata = a[2];
				callback = a[3];
			}
			if (sig == '[s,s,o,f]') {
				filter = a[1];
				t_filter = 'extension';
				extension_filter = filter;

				//include_metadata = a[2];
				var options = a[2];
				if (options.metadata) {
					include_metadata = options.metadata;
				}
				if (options.include_metadata) {
					include_metadata = options.include_metadata;
				}
				if (options.fs_paths) {
					fs_paths = options.fs_paths;
					//throw 'stop';
				}
				if (options.files_or_directories) files_or_directories = options.files_or_directories;
				if (options.include_file_contents) include_file_contents = options.include_file_contents;
				if (options.res_format) res_format = options.res_format;


				callback = a[3];
			}
		}

		// ssbff?
		//console.log ('!callback ' + tof(callback));
		//path = path.replace(/\//g, '\\');
		//console.log('dir_contents path ' + path);

		//console.log(fs.existsSync(path));

		// readdir working on a bunch of paths automatically?
		//  or have this function arrayified?
		//console.log('pre fs.readdir');
		//throw 'stop';
		fs.readdir(path, function(err, files) {
			if (err) {
				//console.log('err ' + err);
				var stack = new Error().stack;
				console.log(stack);
				throw('err ' + err);
			} else {

				//console.log('files ' + stringify(files));
				//console.log('typeof files ' + stringify(typeof files));
				//console.log('dir_contents path ' + path);
				var res = {};
				var res_files = [];
				var res_directories = [];
				var c = files.length;
				//console.log('c ' + c);
				//console.log ('!2callback ' + tof(callback));
				var cb = function() {
					//console.log('cb ');
					//console.log('files_or_directories', files_or_directories);
					if (files_or_directories == 'files') {
						callback(null, res_files);
					} else if (files_or_directories == 'directories') {
						callback(null, res_directories);
					} else {

						if (res_files.length > 0) {
							res.files = res_files;
						}
						if (res_directories.length > 0) {
							res.directories = res_directories;
						}
						//return res;
						//console.log('res ' + stringify(res));
						//console.log('tof callback ' + tof(callback));
						//console.log('callback ' + stringify(callback));
						callback(null, res);
					}

				}

				// maybe this could be done sequentially, perhaps doing n at once.
				//  limit the simultaneous lookups.

				// want to do sequential function calls, waiting for the callback on each.
				//  putting the result callback into the result, but calling it with different items.

				if (!files || files.length == 0) {
					cb();
				}

				//console.log('files.length', files.length);

				//console.log('files', files);



				each(files, function(i, v) {
					var file_name = v;
					var file_or_dir_full_path;

					if (path.substr(path.length - 1) == '/') {
						file_or_dir_full_path = path + v;
					} else {
						file_or_dir_full_path = path + dir_separator + v;
					}



					//console.log('file_or_dir_full_path ' + stringify(file_or_dir_full_path));

					//console.log('i ' + stringify(i));
					//console.log('v ' + stringify(v));
					// find out if it is a directory.

					// depending on the name and filter, do the next step.
					var proceed = true;

					//console.log('extension_filter ' + extension_filter);
					//console.log('regex_filter ' + regex_filter);

					if (extension_filter) {
						var ext = node_path.extname(file_name);
						//console.log('ext ' + ext);
						proceed = ext == extension_filter;
					}
					if (proceed && regex_filter) {
						//console.log('file_name ' + file_name);
						proceed = regex_filter.test(file_name);
					}
					//console.log('proceed ' + proceed);

					/*
					 if (filter) {

					 if (t_filter == 'regex') {
					 //RegExpObject.test(string)
					 proceed = filter.test(v);
					 }
					 if (t_filter == 'extension') {
					 var ext = node_path.extname(v);
					 proceed = ext == filter;
					 }

					 }
					 */

					if (proceed) {

						fs.stat(file_or_dir_full_path, function(err, stats) {


							if (err) {



								//console.log('stats unavailable for ' + file_or_dir_full_path);

								var item_res = file_name;
								res_files.push(item_res);

								// Probably don't fail whole thing with error...

								c--;
								//console.log('c', c);
								if (c == 0) {
									cb();
								}

								//throw(err);

							} else {
								//console.log('stats.isDirectory() ' + stringify(stats.isDirectory()));

								var is_dir = stats.isDirectory();

								//console.log('file_name', file_name);

								//console.log('files_or_directories ' + files_or_directories);
								//console.log('is_dir ' + is_dir);
								//console.log('file_or_dir_full_path ' + file_or_dir_full_path);

								// not a dir anyway???
								if (is_dir && files_or_directories != 'files') {
									if (fs_paths) {
										res_directories.push(file_or_dir_full_path);
									} else {
										res_directories.push(v);
									}

									c--;
									if (c == 0) {
										cb();
									}
								} else if (files_or_directories != 'directories') {

									// can load the whole file as string if asked to do so.

									// options.load_file == 'string'.

									// if including the file contents... load it as a string.

									// if including both the metadata and the content...
									//  could load them both at once.
									//   would like the Fns() system with .go rather than using call_multi.

									// it can load the required data... calling a function that loads the metadata as well as a function that loads the file.
									//  when there are multiple file calls, the results should arrive in an array I think.

									// fns.go seems like it would be very useful indeed.

									var fns = Fns();

									// and in the results we may need to include the full paths.
									//  that could be an option in the metadata function.

									//fns.push([]);

									if (include_metadata) {
										fns.push([fs2.metadata, [file_or_dir_full_path]]);
										// could become fns.push(fs2.metadata, file_or_dir_full_path);
									}
									if (include_file_contents) {
										fns.push([fs2.load_file_as_string, [file_or_dir_full_path]]);
									}

									//console.log('fns.length ' + fns.length);

									if (fns.length > 0) {


										fns.go(function(err, fns_res) {
											if (err) {
												throw err;
											} else {

												//console.log('fns_res ' + stringify(fns_res));
												//console.log('tof(fns_res) ' + tof(fns_res));

												// we may need to return the fs paths with the data...
												// path, content, metadata
												if (include_metadata && include_file_contents) {
													var metadata = fns_res[0];
													var file_contents = fns_res[1];

													if (res_format == 'array') {
														//var res
														var item_res = [file_or_dir_full_path, metadata, file_contents];
														res_files.push(item_res);
													} else if (res_format == 'map') {
														var item_res = {
															//'path': file_or_dir_full_path,
															'name': file_name,
															'metadata': metadata,
															'contents': file_contents
														}
														if (fs_paths) {
															item_res.path = file_or_dir_full_path;
														}
														res_files.push(item_res);
													}

												} else if (include_metadata) {
													var metadata = fns_res[0];
													if (res_format == 'array') {
														var item_res = [file_or_dir_full_path, metadata];
														res_files.push(item_res);
													} else if (res_format == 'map') {
														var item_res = {
															//'path': file_or_dir_full_path,
															'name': file_name,
															'metadata': metadata
														}
														if (fs_paths) {
															item_res.path = file_or_dir_full_path;
														}
														res_files.push(item_res);
													}

												} else if (include_file_contents) {
													var file_contents = fn_res[0];

													if (res_format == 'array') {
														if (fs_paths) {
															var item_res = [file_or_dir_full_path, file_contents];
														} else {
															var item_res = [file_name, file_contents];
														}


														res_files.push(item_res);
													} else if (res_format == 'map') {
														var item_res = {
															//'path': file_or_dir_full_path,
															'name': file_name,
															'contents': file_contents
														}
														if (fs_paths) {
															item_res.path = file_or_dir_full_path;
														}
														res_files.push(item_res);
													}
												} else {
													// no results in the callback anyway.

													if (fs_paths) {
														var item_res = file_or_dir_full_path;
													} else {
														var item_res = file_name;
													}

													res_files.push(item_res);

													//throw 'not yet implemented';
												}

												c--;
												if (c == 0) {
													cb();
												}

												//throw 'stop';
											}
										})

									} else {
										res_files.push(file_name);
										c--;
										if (c == 0) {
											cb();
										}
									}



									//throw 'stop';

									/*

									 if (include_metadata) {
									 fs2.metadata(file_or_dir_full_path, function(err, file_data) {
									 if (err) {
									 throw err;
									 } else {
									 //var f_val = [v, metadata];
									 //var f_val = file_data;

									 if (fs_paths) {
									 // maybe have different ways to return the results...
									 /// can format the results as an array, can format results as map.

									 if (res_format == 'array') {
									 res_files.push([file_or_dir_full_path, file_data]);
									 } else if (res_format == 'map') {
									 res_files.push({'path': file_or_dir_full_path, 'data': file_data});
									 }

									 } else {
									 res_files.push(file_data);
									 }

									 //res_files.push(f_val);
									 c--;
									 if (c == 0) {
									 cb();
									 }
									 }
									 })


									 } else {
									 res_files.push(v);
									 c--;
									 if (c == 0) {
									 cb();
									 }
									 }
									 */

								} else {
									c--;
									if (c == 0) {
										cb();
									}
									//throw 'stop';
								}

							}
						})



					} else {
						c--;
						if (c == 0) {
							cb();
						}
					}

				})
			}
		})
	})),
	// metadata... will make a (mime) type assumption based on the extension.
	//  may then read further metadata, possibly verify the file, metadata verification is one thing,
	//  has_metadata.
	// There could be further file validation.
	//

	// could possibly use arrayify, but arrayify that has been handled to work with callback functions.
	// maybe call file_metadata.

	// possibly keep in the core... but it would look into a variety of file formats.
	//  possibly have a core version that gets data such as last modified and file size.
	'metadata': function(path, callback) {

		// this may have options, like including the path in the results?



		// calling metadata on a directory...
		//  should this get the metadata for files in the dir?

		// mainly for file metadata.
		// check to see if it exists.

		//console.log('metadata path ' + path);

		fs.exists(path, function(exists) {
			if (!exists) {
				//console.log('file does not exist ' + path);

				//throw('file not found');
				callback(null, false);
			} else {
				//var pos1 = path.lastIndexOf()

				// just get the node.js file stats first.

				fs.stat(path, function(err, stats) {
					var extname = node_path.extname(path);
					var basename = node_path.basename(path);
					//console.log('extname ' + extname);

					var extname2 = extname.substring(1);
					var res = {
						'size': stats.size,
						'atime': stats.atime,
						'mtime': stats.mtime,
						'ctime': stats.ctime,
						'isDirectory': stats.isDirectory()
					};

					// atime, mtime, ctime

					callback(null, [basename, res]);

					// mime type tables, then will have specific metadata finding for specific mime types.

					// metadata lookup for specific mime types - could be its own node.js library.

					/*

					 var mime_type = map_extension_mime_types[extname2];
					 //console.log('mime_type ' + mime_type);

					 var fn_spec_md = specific_metadata[mime_type];

					 if (fn_spec_md) {
					 //console.log('has fn_spec_md');
					 // then use that specific mime type to load the metadata.

					 fn_spec_md(path, function(err, specific_metadata) {
					 if (err) {
					 console.log(err);
					 throw(err);
					 } else {
					 each(specific_metadata, function(i, v) {
					 res[i] = v;
					 });
					 //console.log('specific_metadata ' + stringify(specific_metadata));
					 callback(null, [basename, res]);

					 }
					 });

					 } else {

					 //console.log('no metadata loading for type ' + mime_type);
					 callback(null, [basename, res]);
					 }
					 */
				});
			}
		});
	},

	// copy a file as well.

	// This could be arrayified? But it would need parameter pairs?

	'copy_file': function(source_path, dest_path, callback) {
		//console.log('source_path ' + source_path);
		//console.log('dest_path ' + dest_path);

		var r = fs.createReadStream(source_path).pipe(fs.createWriteStream(dest_path));

		r.on('close', function() {
			//if (err) throw err;
			//throw 'stop';
			callback(null, true);
		});
	},



	'instruct': fp(function(a, sig) {
		// if it is just an array, and a callback...

		//console.log('instruct sig ' + sig);

		var is_multi_callback = false;

		if (a.l == 2) {
			if (tof(a[0]) == 'array' && tof(a[1]) == 'function') {
				// a bunch of instructions to execute, and then a callback.
				var fns = [];
				var instructions = a[0];
				var callback = a[1];
				is_multi_callback = true;

				each(instructions, function(i, instruction) {
					fns.push([fs2.instruct, instruction])
				})

				call_multiple_callback_functions(fns, function(err, res_multi) {
					if (err) {
						throw err;
					} else {
						callback(null, res_multi);
					}
				})


			}
		}

		if (!is_multi_callback) {
			// then check to see if the last one is a callback.
			//  the ones before it will be parameters of various kinds.
			//  if first is string, last is function.

			var last_arg = a[a.l - 1];
			//console.log('tof(last_arg) ' + tof(last_arg));

			if (tof(a[0]) == 'string' && tof(last_arg) == 'function') {
				var command_name = a[0];
				var callback = last_arg;

				// but basically want to call the right function with the params.

				var new_args = a.slice(1);

				if (command_name == 'copy') {
					fs2.copy.apply(this, new_args);
				}
			}


		}

		// [s,s,s]



	}),

	'process_copy': function(source_path, fn_process, dest_path, callback) {
		fs2.load_file_as_string(source_path, function(err, strFile) {
			if (err) {
				callback(err);
			} else {
				strFile = fn_process(str_file);
				fs2.save_file_as_string(dest_path, callback);
			}
		})
	},

	'copy': function(source_path, dest_path, callback) {
		// dest must be a directory

		ncp.limit = 16;
		//console.log('copy source_path ' + source_path);
		//console.log('copy dest_path ' + dest_path);

		//var test_for_same_files = true;

		// testing needs to handle when the dest file does not exist.
		var test_for_same_files = false;


		var ctu = true;

		var the_rest = function() {
			ncp(source_path, dest_path, function (err) {
				if (err) {
					return console.error(err);
				}
				callback(null, true);
				//console.log('done!');
			});
		}

		if (test_for_same_files) {
			// get the checksum for the source, and the dest.

			checksum(source_path, function(err, source_checksum) {
				checksum(dest_path, function(err, dest_checksum) {
					if (source_checksum != dest_checksum) {
						the_rest();
					} else {
						callback(null, false);
					}

				})
			})

		} else {
			the_rest();
		}

		/*
		 fs.stat(dest_path, function(err, stats) {
		 if (err) {

		 } else {

		 if (stats.isDirectory()) {

		 fs.stat(source_path, function(err, stats) {
		 if (err) {

		 } else {

		 if (stats.isDirectory()) {

		 // create the corresponding directory
		 // copy every file and directory within that directory to the corresponding directory

		 // This can be built up using fns.



		 } else {

		 }

		 }
		 });

		 }

		 }
		 });
		 */
		// source can be a file or directory.

		// when copying a directory, copy all directories inside it as well (recursively).


	},
	'delete': function(path, callback) {
		// needs to be a versitile delete function.

		// use rimraf if it's a directory.
		fs2.metadata(path, function(err, md) {
			if (err) {
				callback(err);
			} else {
				//console.log('md ' + stringify(md));
				if (!md) {
					callback(null, false);
				}
				//console.log('md.isDirectory ' + md.isDirectory);
				if (md[1].isDirectory) {
					//console.log('pre rimraf');
					rimraf(path, function(err) {
						if (err) {
							callback(err);
						} else {
							callback(null, true);
						}
					});
				}
			}
		})


	},


	// fs2-traverse?

	// maybe keep in core for the moment.


	'dir_contents_with_metadata_full_tree': function(start_path, callback) {
		//  get this from za?

		// I think this will be recursive...
		//console.log('');
		//console.log('dir_contents_with_metadata_to_path');
		//console.log('start_path ' + start_path);
		//console.log('dest_path ' + dest_path);


		// Let's build this up...

		// get the contents and metadata for the path itself.

		// Also, this can act as a finite state machine.
		//  Can have simultaneous processes too.

		// recursive function within this one.

		var path_from_start = '';

		var res = {};


		// and look at the dest path...

		if (dest_path.length < start_path.length) {
			throw 'dest path length must be >= source path length';
		}

		if (dest_path.substr(0, start_path.length) != start_path) {
			throw 'the dest path must start with the start path - therefore being a subdirectory';
		}

		var process_path = function(path_from_start, arr_path, current_res_obj, callback) {
			//console.log('process_path');
			//console.log('arr_path ' + stringify(arr_path));

			var current_path = start_path + path_from_start;

			// will need to put the items into the res properly.
			//console.log('current_path ' + current_path);
			//throw 'stop';
			fs2.dir_contents_with_metadata(current_path, function(err, dir_contents) {
				if (err) {
					throw (err);
				} else {
					// for every file...
					//console.log('have contents for ' + current_path);


					if (dir_contents.files && dir_contents.files.length > 0) {
						current_res_obj.files = current_res_obj.files || [];
						each(dir_contents.files, function(i, file_info) {
							//console.log('file_info ' + stringify(file_info));
							var file_name = file_info[0];
							var file_md = file_info[1];
							//current_res_obj.files[file_name] = file_md;

							current_res_obj.files.push(file_info);
						});
						//console.log('dir_contents ' + stringify(dir_contents));
					}

					// for every directory... that gets more complicated.

					// won't do the callback yet...

					// will get the info from the directories, and put them in an object.
					// name, contents, metadata.

					if (dir_contents.directories) {
						// process those directories.
						current_res_obj.directories = current_res_obj.directories || [];
						//var next_path =
						//var next_arr_path = arr_path.slice();
						//next_arr_path.push(

						var fns = [];

						each(dir_contents.directories, function(i, directory_info) {
							//console.log('directory_info ' + stringify(directory_info));

							if (tof(directory_info == 'string')) {
								var directory_name = directory_info;
								var next_arr_path = arr_path.slice();
								next_arr_path.push(directory_name);

								var dir_obj = [directory_name, {}, {}];
								current_res_obj.directories.push(dir_obj);

								//console.log('path_from_start.substr(path_from_start.length -1) ' + path_from_start.substr(path_from_start.length -1));

								//console.log('path_from_start ' + path_from_start);


								/*
								 if (path_from_start.substr(path_from_start.length -1) == dir_separator) {
								 throw 'stop';
								 var next_path_from_start = path_from_start + directory_name;
								 fns.push([process_path, [next_path_from_start, next_arr_path, current_res_obj]]);
								 } else {
								 var next_path_from_start = path_from_start + directory_name + dir_separator;
								 fns.push([process_path, [next_path_from_start, next_arr_path, current_res_obj]]);
								 }
								 */

								var next_path_from_start = path_from_start + directory_name + dir_separator;
								fns.push([process_path, [next_path_from_start, next_arr_path, current_res_obj]]);



							} else {
								throw 'string expected';
							}

						});
						//console.log('fns.length ' + fns.length);
						if (fns.length > 0) {
							call_multiple_callback_functions(fns, function(err, fns_res) {
								//console.log('fns_res ' + stringify(fns_res));
								callback(null, res);
							});
						} else {
							callback(null, res);
						}



					} else {
						//console.log('no directories');
						callback(null, res);
					}


					// need to go through every directory there, processing the path.




				}



			});

		}

		process_path('', [], res, function(err, res_process_path) {
			//throw 'stop';

			callback(null, res_process_path);

		});
	},


	// could become another option of 'dir_contents'
	//  and 'dir_contents' could even become 'contents' where it would load the contents of a file too. Maybe even set contents as well.

	// this is unrestricted from that path.

	'dir_contents_with_metadata_to_path': function(start_path, dest_path, callback) {
		// find the sequence of paths to get

		// get them in sequence, then construct them into the object.

		// maybe difficult?
		//  get this from za?
		// I think this will be recursive...
		//console.log('');
		//console.log('dir_contents_with_metadata_to_path');
		//console.log('start_path ' + start_path);
		//console.log('dest_path ' + dest_path);


		// Let's build this up...

		// get the contents and metadata for the path itself.

		// Also, this can act as a finite state machine.
		//  Can have simultaneous processes too.

		// recursive function within this one.

		var path_from_start = '';

		var s_path_from_start = path_from_start.split(dir_separator);

		var res = {};


		// and look at the dest path...

		if (dest_path.length < start_path.length) {
			throw 'dest path length must be >= source path length';
		}

		if (dest_path.substr(0, start_path.length) != start_path) {
			throw 'the dest path must start with the start path - therefore being a subdirectory';
		}

		var navigation_path = dest_path.substr(start_path.length);
		//console.log('navigation_path ' + navigation_path);

		if (navigation_path.substr(navigation_path.length - 1) == dir_separator) {
			navigation_path = navigation_path.substr(0, navigation_path.length - 1);
		}

		//console.log('navigation_path ' + navigation_path);

		var s_np = navigation_path.split(dir_separator);
		//console.log('s_np ' + stringify(s_np));

		//throw 'stop';

		var depth = 0;

		var process_path = function(path_from_start, arr_path, current_res_obj, depth, callback) {
			//console.log('process_path');
			//console.log('arr_path ' + stringify(arr_path));

			var current_path = start_path + path_from_start;

			// will need to put the items into the res properly.
			//console.log('current_path ' + current_path);
			//throw 'stop';
			fs2.dir_contents_with_metadata(current_path, function(err, dir_contents) {
				if (err) {
					throw (err);
				} else {
					// for every file...
					//console.log('have contents for ' + current_path);


					if (dir_contents.files && dir_contents.files.length > 0) {
						current_res_obj.files = current_res_obj.files || [];
						each(dir_contents.files, function(i, file_info) {
							//console.log('file_info ' + stringify(file_info));
							var file_name = file_info[0];
							var file_md = file_info[1];
							//current_res_obj.files[file_name] = file_md;

							current_res_obj.files.push(file_info);
						});
						//console.log('dir_contents ' + stringify(dir_contents));
					}

					// for every directory... that gets more complicated.

					// won't do the callback yet...

					// will get the info from the directories, and put them in an object.
					// name, contents, metadata.

					if (dir_contents.directories) {
						// process those directories.
						current_res_obj.directories = current_res_obj.directories || [];
						//var next_path =
						//var next_arr_path = arr_path.slice();
						//next_arr_path.push(

						var fns = [];

						each(dir_contents.directories, function(i, directory_info) {
							//console.log('directory_info ' + stringify(directory_info));

							if (tof(directory_info == 'string')) {
								var directory_name = directory_info;
								var next_arr_path = arr_path.slice();
								next_arr_path.push(directory_name);

								var dir_obj = [directory_name, {}, {}];
								current_res_obj.directories.push(dir_obj);

								//console.log('path_from_start.substr(path_from_start.length -1) ' + path_from_start.substr(path_from_start.length -1));

								//console.log('path_from_start ' + path_from_start);


								/*
								 if (path_from_start.substr(path_from_start.length -1) == dir_separator) {
								 throw 'stop';
								 var next_path_from_start = path_from_start + directory_name;
								 fns.push([process_path, [next_path_from_start, next_arr_path, current_res_obj]]);
								 } else {
								 var next_path_from_start = path_from_start + directory_name + dir_separator;
								 fns.push([process_path, [next_path_from_start, next_arr_path, current_res_obj]]);
								 }
								 */

								// check it's the next directory name.

								if (directory_name == s_np[depth]) {

									var next_path_from_start = path_from_start + directory_name + dir_separator;
									fns.push([process_path, [next_path_from_start, next_arr_path, current_res_obj, depth + 1]]);

								}



							} else {
								throw 'string expected';
							}

						});
						//console.log('fns.length ' + fns.length);
						if (fns.length > 0) {
							call_multiple_callback_functions(fns, function(err, fns_res) {
								//console.log('fns_res ' + stringify(fns_res));
								callback(null, res);
							});
						} else {
							callback(null, res);
						}



					} else {
						//console.log('no directories');
						callback(null, res);
					}
					// need to go through every directory there, processing the path.
				}

			});

		}

		process_path('', [], res, depth, function(err, res_process_path) {
			//throw 'stop';

			callback(null, res_process_path);

		});

	},


	// will use the polymorphism of dir_contents and parameters.
	// have this returning the object with files and directories.
	'_dir_contents_with_metadata': function(path, callback) {
		//console.log('dir_contents_with_metadata path ' + path);

		if (path.lastIndexOf(dir_separator) != path.length - 1) {
			path = path + dir_separator;
		}

		fs2.dir_contents(path, function(err, dir_contents) {
			if (err) {
				//console.log('dir_contents_with_metadata err ' + err);
			} else {
				//console.log('dir_contents_with_metadata path ' + path + ' has callback ');
				var res = {};

				if (dir_contents.directories && dir_contents.directories.length > 0) {
					res.directories = dir_contents.directories;
				}

				var cb = function() {
					callback(null, res);
				};

				if (dir_contents.files && dir_contents.files.length > 0) {
					// do a sequential_call

					//console.log('dir_contents.files ' + stringify(dir_contents.files));

					var seq_md = sequential_call(fs2.metadata);
					//  may be a faster way of getting metadata.

					var files_with_paths = [];
					each(dir_contents.files, function(i, v) {
						var full_path = path + v;
						files_with_paths.push(full_path);
					});

					//console.log('files_with_paths ' + stringify(files_with_paths));

					seq_md(files_with_paths, function(err, res2) {
						if (err) {

						} else {
							//console.log('seq_md res ' + stringify(res));
							res.files = res2;
							callback(null, res);
						}
					});
					/*
					 var res_files = [];
					 res.files = res_files;
					 var c = dir_contents.files.length;

					 each(dir_contents.files, function(i, file_name) {
					 var full_path = path + dir_separator + file_name;
					 console.log('dir_contents_with_metadata full_path ' + full_path);

					 fs2.metadata(full_path, function(err, file_metadata) {
					 if (err) {
					 console.log('err ' + err);
					 } else {
					 console.log('file_metadata ' + stringify(file_metadata));

					 if (file_metadata !== false) {
					 res_files.push([file_name, file_metadata]);
					 } else {
					 res_files.push(file_name);
					 }

					 c--;
					 console.log('c ' + c);
					 if (c == 0) cb();
					 }
					 });

					 });
					 */
				} else {
					cb();
				}
			}
		})
	}

}


//module.exports = fs2;
//	return fs2;
//});

module.exports = fs2;
