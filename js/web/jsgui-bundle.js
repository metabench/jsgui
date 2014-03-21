
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['./jsgui-html', 'os', '../fs/jsgui-node-fs2-core', 'module', 'path', 'http', 'url', './resource', './jsgui-je-suis-xml',
	'cookies', './basic-controls', '../resource/local-server-info', '../resource/local-file-system',
	'../resource-/core/server-pool', './resource-application-router', './resource-file-system-web-admin',
	'./resource-site-javascript', './resource-site-css', './resource-login', './server-page-context',
	'phonegap'], 

	function(jsgui, os, fs2, module, path, http, libUrl, Resource, JeSuisXML, Cookies, Basic_Controls,
		Local_Server_Information, Local_File_System, Server_Resource_Pool, Application_Router,
		Resource_File_System_Web_Admin, Site_JavaScript, Site_CSS, Login, Server_Page_Context,
		phonegap) {
	
	var Server = {};
	
	var Login_Html_Resource = Login.Html;
	// Test if node features are supported?
	
	// This should be running in node.js
	
	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof, fp = jsgui.fp;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined, call_multi = jsgui.call_multi;
	var Collection = jsgui.Collection;
	
	each(Basic_Controls, function(ctrl_name, ctrl_constructor) {
		jsgui[ctrl_name] = ctrl_constructor;
	})
	
	var exec = require('child_process').exec;


	var pathFile = function(path) {
		var pos1 = path.lastIndexOf('/');
		if (pos1 > -1) {
			var res = path.substr(pos1 + 1);
			return res;
		} else {
			return path;
		}
	}

	var parentPath = function(path) {
		var pos1 = path.lastIndexOf('/');
		if (pos1 > -1) {
			var res = path.substr(0, pos1);
			return res;
		} else {
			return path;
		}
	}

	var normalizePath = function(path) {
		// gets rid of ..
		console.log('normalizePath path ' + path);
		var inner = function(pos1) {
			var pos2 = path.lastIndexOf('/', pos1 - 1);
			console.log('pos2 ' + pos2);


			var pos3 = path.indexOf('/', pos1 + 3);
			//console.log('pos3 ' + pos3);

			if (pos3 > -1) {
				var pathUntil = path.substr(0, pos2);
				console.log('pathUntil ' + pathUntil);
				var pathAfter = path.substr(pos3);
				console.log('pathAfter ' + pathAfter);

				var newPath = pathUntil + pathAfter;
				console.log('newPath ' + newPath);

				pos1 = newPath.indexOf('/..');
				console.log('pos1 ' + pos1);

			} else {
				var pathUntil = path.substr(0, pos2);
				console.log('pathUntil ' + pathUntil);

				return pathUntil;
				//throw 'stop';
			}

			// get the path up to the fullstops

			

			
			if (pos1 > -1) {
				//throw 'stop';
				path = newPath;
				return inner(pos1);
			} else {
				
				path = newPath;
				return inner(pos1);
			}

			
		}

		var pos1 = path.indexOf('/..');
		console.log('pos1 ' + pos1);
		if (pos1 > -1) {
			return inner(pos1);
		}

		
	}


	var updateJSFileReferencesForBundle = function(strJSFile) {
		// need to look for the references, then change them.

		// Similar to the Site-JavaScript resource.

		var begLen = 8000;
		if (strJSFile.length < begLen) begLen = strJSFile.length;

		var beginning = strJSFile.substr(0, begLen);

		var search1 = 'define([';
		console.log('beginning ' + beginning);
		//throw 'stop';
		var pos1 = beginning.indexOf(search1);
		if (pos1 > -1) {
			var pos2 = beginning.indexOf(']', pos1);

			var definitionBeginning = pos1 + search1.length;
			var definitionEnd = pos2;
			var definition = strJSFile.substring(definitionBeginning, definitionEnd);

			console.log('');
			console.log('1) definition ' + definition);

			// then go through the definition items, 
			//definition = definition.replace(/, /g, ',');
			definition = definition.replace(/,\s+/g, ',');
			console.log('2) definition ' + definition);

			var definitionItems = definition.split(',');

			console.log('definitionItems ' + stringify(definitionItems));

			// will replace ../core/ with /js/core/

			var newDefinitionItems = [];

			each(definitionItems, function(i, v) {

				//console.log('definitionItem ' + v);

				// not just the core items. The web items need to work as well.



				var search = '"../core/';
				var pos3 = v.indexOf(search);
				console.log('pos3 ' + pos3);
				if (pos3 > -1) {
					//throw 'stop';
					var theRest = v.substr(search.length);

					var newDefinition = '"' + theRest;
					
					var pos4 = newDefinition.indexOf('.js"');
					if (pos4 == -1) {
						//newDefinition = newDefinition.substr(0, newDefinition.length - 1) + '.js"';
					}

					//console.log('newDefinition ' + newDefinition);



					newDefinitionItems.push(newDefinition);



				} else {

					// but test for /web
					//  change to /js

					var search2 = '../web/';
					// then replace that with js

					var pos4 = v.indexOf(search2);
					if (pos4 > -1) {
						//console.log('!!! has found search2: ' + search2);

						var pos5 = v.indexOf('"', pos4 + search2.length);
						var theRest;
						if (pos5 > -1) {
							theRest = v.substring(pos4 + search2.length, pos5);
						} else {
							theRest = v.substring(pos4 + search2.length);
						}
						
						//console.log('theRest ' + theRest);
						//var newRef = '"js/' + theRest + '"';
						var newRef = '"' + theRest + '"';
						//console.log('newRef ' + newRef);
						newDefinitionItems.push(newRef);
					} else {
						newDefinitionItems.push(v);
					}
				}
			});

			//console.log('newDefinitionItems ' + stringify(newDefinitionItems));
			var newDefinition = newDefinitionItems.join(',');

			var res = strJSFile.substring(0, definitionBeginning) + newDefinition + strJSFile.substr(definitionEnd);



			return res;


			//throw 'stop';
		} else {
			return strJSFile;
		}



	}

	// or a version that saves the updated one?
	//  copies it

	var copyJSFileUpdateReferencesForBundle = function(jsFilePath, destPath, callback) {
		fs2.load_file_as_string(jsFilePath, function(err, strJSInput) {
			if (err) {
				console.log('err ' + err);

			} else {
				var strUpdatedFileJS = updateJSFileReferencesForBundle(strJSInput);
				fs2.save_file_as_string(destPath, strUpdatedFileJS, callback);
			}
		})
	}


	
	var bundle = {

		// create with map...
		//  prepare the map of the various files that go in place
		//  also to copy over the relevant files for the jsgui client system
		//   to begin with it will be the separate files, then it will be a built version.

		// Will also need to do a server-side rendering of the initial / index page.

		// create a (new) bundle at a path...

		// Maybe we'll also have this generate phonegap bundles here.

		// May also give this params saying what files from the project to copy over.

		// Good to have different functions to make different bundles.
		//  Would be nice to have in-memory creation of a zip bundle... but will likely have to access disk.





		'create': fp(function(a, sig) {
			// Maybe create phonegap project from here for the moment?



			// then uses the current module path.

			var dirname, source_path;
			var client_required_js_files, client_script_tag_js_files;
			var client_css_files, Client_Control;

			if (sig == '[]') {
				var filename = module.uri,
        			dirname = path.dirname(filename);

        		console.log('dirname ' + dirname);

        		// then need to find the free bundle path...
        		//  maybe fs2 core will help with that.

        		

			}
			if (sig == '[s]') {
				dirname = a[0];


			}

			if (sig == '[o]') {
				var params = a[0];
				dirname = params.dirname || params.dirName || params.dirPath;
				client_required_js_files = params.client_required_js_files;
				client_script_tag_js_files = params.client_script_tag_js_files;
				source_path = params.source_path;
				client_css_files = params.client_css_files;
				Client_Control = params.Client_Control;
			}

			var jsgui_client_files = ['web/jsgui-html.js', 'core/jsgui-lang-enh.js',
			'core/jsgui-lang-util.js', 'core/enhanced-data-object.js', 'core/jsgui-lang-essentials.js',
			'core/jsgui-data-structures.js', 'core/data-object.js', 'core/collection.js',
			'core/jsgui-data-structures-doubly-linked-list.js', 'core/jsgui-data-structures-b-plus-tree.js',
			'core/constraint.js', 'core/data-object-fields-collection.js',
			'core/collection-index.js', 'core/jsgui-data-structures-stiffarray.js'
			];

			// so, needs to get these from the parent directory of this, jsgui-bundle

			var jsguiJsPath = normalizePath(parentPath(path.dirname(module.uri)));
			console.log('jsguiJsPath ' + jsguiJsPath);

			var jsgui_css_path = parentPath(jsguiJsPath) + '/css';
			console.log('jsgui_css_path ' + jsgui_css_path);
			//throw 'stop';
			var jsgui_css_files = ['basic.css'];
			// May possibly want to normalize the path, removing and accounting for /../
			//var jsgui

			//throw 'stop';

			// also will add the client css - those files just be in the client directory
			//  later they will work from a css directory in the client app (js will work in a similar way)
			//   will search those paths for the needed files.




			if (dirname) {
				fs2.dir_ensure_named_numbered(dirname, 'bundle', function(err, resDir) {
        			if (err) {
        				throw err;
        			} else {
        				console.log('resDir ' + stringify(resDir));

        				// then inside that resulting directory, we make 3 folders

        				// images, css and js

        				// then we make the index.html

        				//phonegap.create({
        				//	'path': resDir
        				//});

        				// and copy over the necessary javascript files.
        				var cssPath = resDir + '/' + 'css', imagesPath = resDir + '/' + 'images', jsPath = resDir + '/' + 'js';

        				var subdirs = [cssPath, imagesPath, jsPath];

        				fs2.dir_ensure(subdirs, function(err, res_ensure) {
        					if (err) {
        						throw err;
        					} else {
        						console.log('res_ensure ' + stringify(res_ensure));

        						// copy over the necessary css references.

        						// maybe have a function to get those file names.

        						// basic css file
        						//  single css file for the moment.

        						// no images for the moment

        						// quite a lot of javascript files.
        						//  will do the javascript in different modes.
        						//   would need to get particular referenced files from the project path
        						//    by default will just copy them to the /js directory
        						//  some of them will be loaded normally, others will be part of the include system.

        						// So, require.js and the jsgui files.

        						// need to get the array of reference to files to copy into the js directory.


        						// require.js from this directory...

        						// Some of the files will be relative to jsgui (here), some will be relative to the project
        						//  folder that they are being built out of.

        						var filename = module.uri, thisDirPath = path.dirname(filename);

        						var rjsPath = thisDirPath + '/require.js';
        						console.log('rjsPath ' + rjsPath);

        						var rjsDestPath = jsPath + '/require.js';

        						// we will put in the script tag for require.js


        						// a few other files to copy, as part of jsgui as well...




        						//fs2.copy_file

        						var fns = [];

        						fns.push([fs2.copy_file, [rjsPath, rjsDestPath]]);

        						// copy the script tag files over to the js path.

        						

        						each(client_script_tag_js_files, function(i, client_script_tag_js_file) {

        							// We are flattening the paths into the js folder, for the moment.
        							var fileSourcePath = source_path + '/' + (client_script_tag_js_file);



        							var destPath = jsPath + '/' + pathFile(client_script_tag_js_file);

        							console.log('fileSourcePath ' + fileSourcePath);
        							console.log('destPath ' + destPath);
        							fns.push([fs2.copy_file, [fileSourcePath, destPath]]);
        						})

        						each(client_required_js_files, function(i, client_required_js_file) {

        							// We are flattening the paths into the js folder, for the moment.
        							var fileSourcePath = source_path + '/' + (client_required_js_file);



        							var destPath = jsPath + '/' + pathFile(client_required_js_file);

        							console.log('fileSourcePath ' + fileSourcePath);
        							console.log('destPath ' + destPath);

        							// copyJSFileUpdateReferencesForBundle
        							//fns.push([fs2.copy_file, [fileSourcePath, destPath]]);
        							fns.push([copyJSFileUpdateReferencesForBundle, [fileSourcePath, destPath]]);
        						})

        						// we also want to copy over various jsgui client files that are needed.
        						//  these will also be loaded by require.js

        						each(jsgui_client_files, function(i, jsgui_client_file) {
        							var src = jsguiJsPath + '/' + jsgui_client_file;
        							var dest = jsPath + '/' + pathFile(jsgui_client_file);
        							fns.push([copyJSFileUpdateReferencesForBundle, [src, dest]]);
        						});

        						// add the jsgui css.

        						
        						// add the app's css
        						each(jsgui_css_files, function(i, jsgui_css_file) {
        							var fileSourcePath = jsgui_css_path + '/' + jsgui_css_file;
        							var dest = cssPath + '/' + jsgui_css_file;

        							console.log('fileSourcePath ' + fileSourcePath);
        							console.log('dest ' + dest);

        							fns.push([fs2.copy_file, [fileSourcePath, dest]]);
        						});

        						each(client_css_files, function(i, client_css_file) {
        							var src = source_path + '/' + client_css_file;
        							var dest = cssPath + '/' + pathFile(client_css_file);

        							console.log('src ' + src);
        							console.log('dest ' + dest);

        							//throw 'stop';
        							fns.push([fs2.copy_file, [src, dest]]);
        						})




        						call_multi(fns, function(err, res_multi) {
        							if (err) {
        								throw err;
        							} else {
        								console.log('res_multi ' + stringify(res_multi));


        								var server_page_context = new Server_Page_Context({});

		        						var hd = new jsgui.Client_HTML_Document({
											'context': server_page_context
										});


										hd.include_client_css();


										// We don't want the general jsgui client.
										//  we want the client control.

										// Also want to serve that JavaScript (various JavaScript files, maybe all in the client directory)


										//hd.

										// need to include the client app.

										//hd.include_js('app.js');

										hd.include_css('css/app.css');

										hd.include_js('js/modernizr-latest.js');

										hd.include_jsgui_client('js/app.js');
										// we could flatten the references to various jsgui files, from within the JavaScript.
										//  like the Site_JavaScript_Resource.
										//  Perhaps I should make a JavaScript_Resource that does this functionality.




										hd.include_js('js/zepto-min.js');
										hd.include_js('js/parse.js');
										hd.include_js('js/milo-parse-utils.js');

										// The server needs to route this successfully.



										
										// need to have the login control.
										//  Should be fairly simple... but need to be collecting the login information.
										
										// Login control contains a form?
										//  That could be an option maybe.
										
										// and that will set the context of the login control.
										//  The body will already have its context set.
										
										// Is a lot going on here... will likely need to optimize some things.
										
										//  Then when the items are within their own context (._context has been set)
										//  they will not be a huge memory and slowdown leak.
										
										
										var body = hd.body();

										var client_control = new Client_Control({
											'context': server_page_context
										});
										//var body_context = body._context;
										//client_control.set('dom.attributes.id', client_control._id());

										client_control.set('dom.attributes.id', 'main_control');

										// Then we add the Me_Books_Client control.
										body.add(client_control);


										//console.log('body_context ' + body_context);
										

										// and serve that blank HTML document.
										
										var html = hd.all_html_render();

										// then write the html to a file.
										var htmlFilePath = resDir + '/index.html';
										console.log('html ' + html);
										console.log('htmlFilePath ' + htmlFilePath);
										fs2.save_file_as_string(htmlFilePath, html, function(err, resSave) {
											if (err) {
												throw err;
											} else {
												console.log('resSave ' + stringify(resSave));
											}
										})


        							}
        						});


        						// similar for the client required files, but they won't have a script tag loading them individually.

        						// Needs to create the index.html file.
        						//  That part is one of the more complicated things.

        						// Will create a server page context.
        						//	Not so sure about a request and response...
        						//   Maybe a bundle request?

        						// Then the HTML document control gets made, it's html rendered, then it gets saved
        						//  to a file.








        					}
        				});

        				//var c = 0;
        				//var val = 
        			}
        		})
			}
		})


	}

	return bundle;

});