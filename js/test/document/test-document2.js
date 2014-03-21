//require('nodetime').profile()

var requirejs = require('requirejs');


// A bit complicated.
//  Maybe this could use a 'mini-server'.


requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
	//paths: {
    //    "some": "some/v1.0"
    //},
    nodeRequire: require
});

requirejs(['../../jsgui-server', 'express', '../../jsgui-sample-controls', '../../jsgui-radio-button', '../../jsgui-node-fs2-core', 'uglify-js', 'zlib', './test-document-client'],
function (jsgui, express, jsgui_sample_controls, Radio_Button, fs2, UglifyJS, zlib, Client_Side_Component) {
	
	var j = jsgui;
	var Class = j.Class;
	var each = j.each;
	var is_array = j.is_array;
	var is_dom_node = j.is_dom_node;
	var is_ctrl = j.is_ctrl;
	var extend = j.extend;
	var x_clones = j.x_clones;
	var get_truth_map_from_arr = j.get_truth_map_from_arr;
	var get_map_from_arr = j.get_map_from_arr;
	var arr_like_to_arr = j.arr_like_to_arr;
	var tof = j.tof;
	var is_defined = j.is_defined;
	var stringify = j.stringify;
	var functional_polymorphism = j.functional_polymorphism;
	var fp = j.fp;
	var arrayify = j.arrayify;
	var mapify = j.mapify;
	var are_equal = j.are_equal;
	var get_item_sig = j.get_item_sig;
	var set_vals = j.set_vals;
	var truth = j.truth;
	var trim_sig_brackets = j.trim_sig_brackets;
	var ll_set = j.ll_set;
	var ll_get = j.ll_get;
	var is_constructor_fn = j.is_constructor_fn;
	var is_arr_of_arrs = j.is_arr_of_arrs;
	var is_arr_of_strs = j.is_arr_of_strs;
	var is_arr_of_t = j.is_arr_of_t;
	
	var app = express();
	var port = 5010;
	
	// that jsgui object will have what is needed to serve HTML.
	
	// May integrate this with Connect or routes... or may call on jsgui functionality from a connect or express route.
	
	// May still be simple to talk about serving files to paths... but will want to serve other objects / have them exposed on a path.
	
	// Want an html document control that is an empty document.
	
	// creation of empty html document...
	
	// let's start up the server.
	var transform_js_for_client = function(js) {


		console.log('transform_js_for_client');
		// Will use a regex or two.

		// Replace the matching ./ occurrances with nothing.

		// use a regex to get the whole definition part of code.
		//  extract the data from it.
		//  rebuild it.
		// replace it.




		// include ../../ pattern
		// ../+


		var regex = /define\(\[((?:".*\/[\w|-]*")(?:, )?)+\]/; //"
		//var res = js.match(regex);
		// don't know about doing that kind of replacement here.

		/*

		var res = js.replace(regex, function(p1, p2, p3) {
			console.log('arguments ' + stringify(arguments));
			console.log('p1 ' + p1);
			console.log('p2 ' + p2);
			console.log('p3 ' + p3);

		})
		*/

		var match = js.match(regex);
		console.log('match ' + match);

		// need to be careful that this is matching what it should.
		//var url = req.url;
		//console.log('url ' + url);

		if (match) {
			console.log('match.length ' + match.length);
			console.log('match ' + stringify(match));
			//var num_matched = match.length - 1;

			// then go through the matched items, replacing them with versions without the ./
			//console.log('num_matched ' + num_matched);


			var sm = match[0];

			var pos1 = sm.indexOf('([') + 2;

			var pos2 = sm.lastIndexOf(']');
			var sub = sm.substring(pos1, pos2);
			console.log('sub ' + stringify(sub));

			// then get the various items.

			var arr_sub = sub.split(',');
			console.log('arr_sub ' + stringify(arr_sub));
			// then for each sub-item

			var new_items = [];
			each(arr_sub, function(i, sub_item) {
				var new_sub_item = sub_item.replace(/"/g, '').replace(/..\//g, '').replace(/.\//g, '').replace(/ /g, '');
				new_items.push(new_sub_item);
			});

			console.log('new_items ' + stringify(new_items));

			// then build the new define string...
			var str_new_define = 'define(' + stringify(new_items);
			console.log('str_new_define ' + str_new_define);

			var new_js = js.replace(regex, str_new_define);
			return new_js;

			var arr_matches = [];
			var arr_client_js_refs = [];

			for (var c = 1; c < num_matched + 1; c++) {
				var matched_item = match[c];
				arr_matches.push(matched_item);

				arr_client_js_refs.push(matched_item.replace(/.\//, ''));


			}
			//console.log('arr_matches ' + stringify(arr_matches));
			//console.log('arr_client_js_refs ' + stringify(arr_client_js_refs));

			// then build the new define string, with the modified references.

			var arr_new_define = ['define(['];
			arr_new_define.push(arr_client_js_refs.join(', '));
			arr_new_define.push(']');


			var str_new_define = arr_new_define.join('');
			console.log('str_new_define ' + str_new_define);

			// then get the new js

			var new_js = js.replace(regex, str_new_define);
			//console.log('');
			//console.log('');
			//console.log('new_js ' + new_js);

			//console.log('match ' + stringify(match));
			//console.log('match[0] ' + stringify(match[0]));
			//console.log('match[1] ' + stringify(match[1]));
			//console.log('match[2] ' + stringify(match[2]));
			//console.log('match[3] ' + stringify(match[3]));
			// could try replacing the define section.
			return new_js;

		} else {
			return js;
		}
	}

	// Also want to make the progressively enhanced radio buttons...
	//  Will; need to activate them on the client-side.


	var test_document_server = function() {
		var server = new jsgui.Server.JSGUI_Server({});
		//  A server can be for an express routes sub-path.
		//  Can be for the whole site.
		
		// Need to configure the server.
		//  Tell the server what document to serve?
		//  Want it to be serving an html document pretty soon.
		
		// This test server would need to be told to make the document...
		//  It's the component to serve the document...
		
		
		// And we can have this running in an expressless way too.
		
		
		
		server.start(port, function() {
			console.log('jsgui server started');
			
			app.listen(port, function() {
				// say what IP address...
				//  give the external ipv4 address?
				
				console.log("Listening on " + port);
				
				// Perhaps later we could expose resources to be served - with the resource doing some of the path processing.
				//  A resource could serve an interface for interacting with it - complete HTML interface, or JSON API that a more general
				//  HTML or other interface can interact with.
				
				var spc;

				// need to handle /js/jsgui-client.js
				//  serve some static client-side js
				//  will load it with require to start with though.
				//   there will also be some particular code about activation.
				//   associating controls with existing DOM elements.
				//   possibly scraping the values out of the DOM to build data models.
				//   requesting further data from the server.


				// couls serve the js file from disk each time, or have a copy cached in memory.
				//  anyway, need to be loading jsgui-client on the client.
				// resolve the local path first?


				var map_cached_files = {};

				// transforming the javascript files from the dev versions to the client-side / published versions.
				//  may need to change the references to other modules, in the define section,
				//  that way it will get the other modules to download.
				//  then we will have a lot of functionality available on the client too.

				var map_uglified_js_files = {};



				var map_compressed_files = {};
				// but then gzip compression gets its header set.




				// There will be particular client-side activation code and io response code, but that could just not get called
				//  on the server.

				// uglify compression
				//  other sort of lossless optimization... like could optimize PNG images.
				// gzip compression.

				var setup_serve_fs_file_as = function(fs_path, request_path) {
					app.get(request_path, function(req, res, next) {
						console.log('req.url ' + req.url);
						// when we have the (js) fs file, we then uglify it.

						var serve_js_string = function(js_string) {
							res.setHeader('Content-Type', 'text/javascript');
							res.setHeader('Content-Length', js_string.length);
							res.end(js_string);
						}

						var serve_compressed_js_buffer = function(compressed_js_buffer) {
							res.setHeader('Content-Type', 'text/javascript');
							res.setHeader('Content-Length', compressed_js_buffer.length);
							res.setHeader('content-encoding', 'gzip');
							res.end(compressed_js_buffer);

						}

						var have_ugly_js_string = function(fs_path, ugly_js_string) {

							// now we have the ugly string, we should compress it using gzip.

							// then we'll serve the ugly gzip string.


							//  from node.js 0.10.0 docs.
							//  may need to deal with streams differently to gzip the response.
							//   maybe coudl use a buffer.

							// raw.pipe(zlib.createGzip()).pipe(response);
							// maybe gzip compress the string.

							// zlib.gzip(buf, callback)

							// { 'content-encoding': 'gzip' });
							if (map_compressed_files[fs_path]) {
								serve_compressed_js_buffer(map_compressed_files[fs_path]);

							} else {

	    						zlib.gzip(ugly_js_string, function(err, gzipped) {
	    							if (err) {
	    								throw err;
	    							} else {
	    								console.log('gzipped callback');
	    								console.log('tof(gzipped) ' + tof(gzipped));
	    								map_compressed_files[fs_path] = gzipped;
	    								serve_compressed_js_buffer(gzipped);

	    							}
	    						});

							}

							//response.writeHead(200, { 'content-encoding': 'deflate' });
    						//raw.pipe(zlib.createDeflate()).pipe(response);


						}

						var have_js_string = function(fs_path, js_string) {
							//serve_js_string(js_string);

							if (map_uglified_js_files[fs_path]) {
								//serve_js_string(map_uglified_js_files[fs_path]);
								have_ugly_js_string(fs_path, result.code);

							} else {
								console.log('pre uglify');
								var result = UglifyJS.minify(js_string, {
									'fromString': true
								});
								map_uglified_js_files[fs_path] = result.code;
								//serve_js_string(result.code);

								have_ugly_js_string(fs_path, result.code);
							}

							// let's compress it...
							
							//console.log('result ' + stringify(result));



							

						}


						if (map_cached_files[fs_path]) {
							// and the particular mime type.. will depend on the file extension.
							//  may use a jsgui-mime-types module.


							//res.setHeader('Content-Type', 'text/javascript');
							//res.setHeader('Content-Length', map_cached_files[fs_path].length);
							//res.end(map_cached_files[fs_path]);
							have_js_string(fs_path, map_cached_files[fs_path]);

						} else {

							fs2.load_file_as_string(fs_path, function(err, str_js_file) {
								if (err) {
									throw err;
								} else {

									// transform the js for client publication
									str_js_file = transform_js_for_client(str_js_file);
									//res.setHeader('Content-Length', map_cached_files[str_js_file].length);

									//console.log('str_js_file ' + str_js_file);
									//throw 'stop';
									map_cached_files[fs_path] = str_js_file;
									//res.setHeader('Content-Type', 'text/javascript');
									//res.setHeader('Content-Length', str_js_file.length);
									have_js_string(fs_path, map_cached_files[fs_path]);
									// not sure res.end is working...
									//  would be better to load the file from disk and then serve it notmally.
									//res.end(str_js_file);
									//res.end(map_cached_files[fs_path]);

								}

							})


						}
					});

				}

				setup_serve_fs_file_as('../../jsgui-html.js', '/js/jsgui-html.js');
				setup_serve_fs_file_as('../../jsgui-radio-button.js', '/js/jsgui-radio-button.js');
				setup_serve_fs_file_as('../../jsgui-lang-enh.js', '/js/jsgui-lang-enh.js');
				setup_serve_fs_file_as('../../enhanced-data-object.js', '/js/enhanced-data-object.js');
				setup_serve_fs_file_as('../../jsgui-lang-util.js', '/js/jsgui-lang-util.js');
				setup_serve_fs_file_as('../../jsgui-data-structures.js', '/js/jsgui-data-structures.js');
				setup_serve_fs_file_as('../../jsgui-lang-util.js', '/js/jsgui-lang-util.js');
				setup_serve_fs_file_as('../../data_object.js', '/js/data_object.js');
				setup_serve_fs_file_as('../../collection.js', '/js/collection.js');
				setup_serve_fs_file_as('../../jsgui-lang-essentials.js', '/js/jsgui-lang-essentials.js');
				setup_serve_fs_file_as('../../jsgui-data-structures-b-plus-tree.js', '/js/jsgui-data-structures-b-plus-tree.js');
				setup_serve_fs_file_as('../../jsgui-data-structures-stiffarray.js', '/js/jsgui-data-structures-stiffarray.js');
				setup_serve_fs_file_as('../../jsgui-data-structures-doubly-linked-list.js', '/js/jsgui-data-structures-doubly-linked-list.js');
				setup_serve_fs_file_as('../../constraint.js', '/js/constraint.js');



				var cached_requirejs;

				app.get('/js/require.js', function(req, res, next) {
					var url = req.url;
					console.log('url ' + url);

					if (cached_requirejs) {
						res.setHeader('Content-Type', 'text/javascript');
						res.setHeader('Content-Length', cached_requirejs.length);
						res.end(cached_requirejs);

					} else {
						//console.log('pre load_file_as_string');
						fs2.load_file_as_string('../../require.js', function(err, str_js_file) {
							if (err) {
								throw err;
							} else {
								//console.log('str_js_file ' + str_js_file);
								cached_requirejs = str_js_file;
								res.setHeader('Content-Type', 'text/javascript');
								res.setHeader('Content-Length', str_js_file.length);
								res.end(str_js_file);

							}

						})
					}

					//res.sendfile('../../jsgui-client.js');
					

				});

				var cached_str_js_file;
				app.get('/js/jsgui-client.js', function(req, res, next) {
					var url = req.url;
					console.log('url ' + url);

					if (cached_str_js_file) {
						res.setHeader('Content-Type', 'text/javascript');
						res.setHeader('Content-Length', cached_str_js_file.length);
						res.end(cached_str_js_file);

					} else {
						fs2.load_file_as_string('../../jsgui-client.js', function(err, str_js_file) {
							if (err) {
								throw err;
							} else {
								//console.log('str_js_file ' + str_js_file);
								cached_str_js_file = str_js_file;
								res.setHeader('Content-Type', 'text/javascript');
								res.setHeader('Content-Length', str_js_file.length);
								res.end(str_js_file);

							}

						})
					}

					//res.sendfile('../../jsgui-client.js');
					

				});


				app.get('/', function(req, res, next) {
					// can get the full url out of the path.
					//  can get the difference from the url_path
					
					var url = req.url;
					console.log('url ' + url);
					
					//server.process_request(req, res);
					
					// jsgui.JSGUI_HTML_Document();
					//  has the correct references to jsgui client side code and CSS.
					//  will get the jsgui-html-client running on the client.
					
					// There are some functions which are not needed in the server version of the code.
					//  Some code to do with binding dom events perhaps.
					//   But those functions could work well on the client too - or there could be server side code executed on DOM events?
					//    probably not worth it - have more separation.
					
					
					// Or the page context has already been made automatically during the request?
					
					//var spc = new jsgui.Server.Page_Context({
	                spc = new jsgui.Server.Page_Context({
	                     'request': req,
	                     'response': res,
	                     'rendering_mode': 'html5'
	                });
					
					//server.create_page_context?
					
					//console.log('pre create new jsgui.Client_HTML_Document()');
					
					// Give the document the context.
					//  Need a new page context I think. Page_Context
					//  Maybe a page_request_context.
					
					
					// The appropriate JavaScript should be included in that client document.
					//  There may be some JSON properties to load for the controls as well.

					// Then on the client, it activates the controls.
					//  The controls may interact with web-services, but are unlikely to keep the request that made them open.
					//  Will try a RESTful interface (plus some commands) to start with.





					var doc = new jsgui.Client_HTML_Document({'context': spc});

					doc.include_jsgui_client();
					//  Then there will be code on the client that can respond to events.

					// Could have some way of specifying on the server where the update events go.
					//  But I think havinh other code processing the update events makes for leaner code.
					// Encapsulates the code that generates the HTML.
					//  





					//console.log('post create new jsgui.Client_HTML_Document()');
					// There will need to be HTML documents with things already set up for JSGUI.
					//  I think that would include a script block that initializes JavaScript functionality.
					//   Dynamically written JavaScript is the way to go here, but it can effectively be JSON.
					//    Stringify could produce code that gets initialized.
					
					// Effectively providing all the info that goes in init for every control.
					//  Or every control that has extra information.
					
					// So that could be info about the flags (but its likely to get some flags through css classes).
					//  The control will find out about the content of itself.
					//   And it will parse data from HTML where needed. Complete records can be given through the HTML, with extra data given through JSON.
					//    Most programming work, but it will be most efficient on the client.
					//     Another good option is to have all the rendering done on the client.
					
					//doc.get('body').
					//console.log('pre show body content');
					
					//console.log('doc.body().content() ' + doc.body().content());
					//console.log('post show body content, pre change body content');
					
					//doc.body().content().add('Hello World');
					
					// Use a Basic_Page control.
					//  Header, content, menu.
					//  Could add another section relatively easily.
					
					
					// Need to put the content in there as JSON of sorts, it will have items like
					//  'article' and 'content_piece', maybe just called 'content'.
					// Gets rendered to HTML using relatively simple rules.
					//  Data could be extracted from the DB.
					
					// The content needs to be a Control.
					//  Could make it so that when it finds strings, it creates <p> controls?
					
					// Want a constructor system from the context...
					//  Maybe even extending objects in a context...
					
					// or a context is a function so we can do context(jsgui.p)?
					
					// have a contextualize function?
					
					
					/*
					
					
					var basic_page = new jsgui_sample_controls.Basic_Page({
					    'title': 'Example Basic Page',
					    //'content': [new jsgui.p('James says hello')],
					    //'content': [new jsgui.p({'content': ['James says hello'], 'context': spc})],
					    'context': spc
					});
					
					// Content should be initialized when setting something.
					//  If the content is a string, it could be escaped???
					//  textNode?
					
					//basic_page.content().add(new jsgui.p({'content': ['James says hello'], 'context': spc}));
					
					// Try this with creating a TextNode?
					//  Some of that should be automatic.
					
					//basic_page.content().add(new jsgui.p({'content': ['James says hello'], 'context': spc}));
					
					// Basic page could have various fields.
					//  These fields would interact with the content.
					
					
					var tn_jsh = new jsgui.textNode({'text': 'James says hello', 'context': spc});
					
					//basic_page.content().add(new jsgui.p({'content': [tn_jsh], 'context': spc}));
					var new_p = new jsgui.p({'context': spc});
					new_p.content().add(tn_jsh);
					
					//basic_page.content().add(new_p);
					
					console.log('');
					console.log('');
					console.log('Pre set basic page content');
					
					// Basic page could have an inner_content.
					//  However, changing the various fields could add content to various places.
					// inner_content
					
					//basic_page.content(new_p);
					basic_page.inner_content(new_p);
					
					// and set the header content.
					
					*/
					
					// Should call set content function
					
					// Want to be able to set content in initialization.
					//  Maybe that should happen automatically because it is a field.
					
					// Perhaps a set content method should be used, .content(value).
					//  Not having to add it to the content.
					
					//basic_page.set('content', 
					// doc.set(basic_page) would do, it puts it into the body and maybe sets the title.
					//  basic_page will be a Control.
					
					// Automatically generated IDs would be useful here...
					//  That is something that Radio_Button could usefully do.
					//   Less important with other controls. Maybe important with input controls.
					
					// Maybe code in the radio button to generate its ID.

					// However, context seems to be useful / needed for this.

					// var rdo = spc.make(Radio_Button)
					//  So when it has the context, it can produce the ID.
					//  Perhaps we should tell it specifically to create some IDs, don't want IDs all over the place.

					// Will do some tests on abstract controls.
					//  They could possibly just hold the spec in some cases
					//  In others they would do some calculations but not modify things persistantly.
					//  It could be a useful syntax.

					var radioA1 = new Radio_Button({
				    	// May want to set the date or a range of dates... selected dates.
				    	'group_name': 'groupA',
				    	'checked': true,
				    	'value': 'rdo_A1',
				    	'id': true,
				    	// Have a Label control inside the Radio_Button, with it's 'for' property set to this control.

				    	// Want jsgui.Label
				    	/*
				    	'content': new jsgui.Label({
				    		'for': radioA1,
				    		'content': 'Option A1',
				    		'context': spc
				    	}),
						*/
				    	//'content': 'Option A1',
				    	'context': spc
				    	//'checked': true
				    	// 'id': auto // with auto as a local variable. Maybe take 'auto' string.
				    });
					radioA1.content().add(new jsgui.Label({
			    		'for': radioA1,
			    		'content': 'Option A1',
			    		'context': spc
			    	}));
					//console.log('radioA1._id() ' + radioA1._id());
					// dom.attributes.id
					//radioA1.set('dom.attributes.id', radioA1._id());

					//throw 'stop';


					// Labeled_Radio_Button
					//  Would have an id, that would be set to true
					//  Would put the label with for into itself, using the text? label_content property?
					//   I think a text property would be nice.


					// a shortcut to dom.attributes.id?
					//  it's useful that things are clearly partitioned like that.
					//radio1.content().add('Option 1');
					var radioA2 = new Radio_Button({
				    	// May want to set the date or a range of dates... selected dates.

				    	'id': true,

				    	'group_name': 'groupA',
				    	'value': 'rdo_A2',
				    	//'content': 'Option A2',
				    	'context': spc
				    	//'checked': true
				    });
				    radioA2.content().add(new jsgui.Label({
			    		'for': radioA2,
			    		'content': 'Option A2',
			    		'context': spc
			    	}));
					//radio1.content().add('Option 1');

					var radioB1 = new Radio_Button({
				    	// May want to set the date or a range of dates... selected dates.
				    	'group_name': 'groupB',
				    	'value': 'rdo_B1',
				    	//'content': 'Option B1',
				    	'context': spc,
				    	'id': true
				    	//'checked': true
				    });
				    radioB1.content().add(new jsgui.Label({
			    		'for': radioB1,
			    		'content': 'Option B1',
			    		'context': spc
			    	}));
					//radio1.content().add('Option 1');

					var radioB2 = new Radio_Button({
				    	// May want to set the date or a range of dates... selected dates.
				    	'group_name': 'groupB',
				    	'checked': true,
				    	'value': 'rdo_B2',
				    	//'content': 'Option B2',
				    	'context': spc,
				    	'id': true
				    	//'checked': true
				    });
				    radioB2.content().add(new jsgui.Label({
			    		'for': radioB2,
			    		'content': 'Option B2',
			    		'context': spc
			    	}));
					//radio1.content().add('Option 1');

					doc.body().content().add(radioA1);
					doc.body().content().add(radioA2);
					doc.body().content().add(radioB1);
					doc.body().content().add(radioB2);
					
					
					server.serve_document(req, res, doc);
					

					// This file does not get served, as-is.
					//  Not sure about building client-side code here.

					// But we could use a client-side component without too much difficulty.
					//	Can use client-side components without too much difficulty.
					//  Can also add a client-side JS file.
					//  Can have a client-side JS file that specifies what various objects are, maybe gives some properties.
					//  Perhaps that will be better for some more complex controls (too).

					// It's likely there should be different ways to incliude client-side code.
					//  Could include a file directly.
					//  That file could then run on the client-side.
					//  It would also be good to tell the client what the various controls / components are.

					// Do want to tell the client, through a JS file that it downloads, perhaps the main one that it runs,
					//  what various controls are.

					// As far is the app is concerned right now, they have IDs.
					//  The context may need to keep a map of the various IDs of controls / objects.
					//   But maybe not everything.

					// Could try using components that are designed to execute both on the client and server.
					//  I think the server-side code here should mainly be setting properties.
					//  Could make a single_page_application or page_application control.
					//  client_side_application or client_side control.









					// all urls go to the jsgui server...
					//  but that server needs a document or something in order to do anything.
					
					// Could we just use express to do the serving?
					//  We need to specify the document somewhere?
					//  Don't need a full app for the server...
					
				});
				
				
				app.get('*', function(req, res, next) {
					res.send(404);
				});
				
			});
		});
	}
	//test_document_server();

	// A different pattern to test_document_server... we could have a component with the whole client-side application, or screen, 
	//  where it is loaded, like the other files, and it is also executed on the client and server.

	// Having the main part of the page in a place that's applicable to cliebt and server does make a lot of sense.
	//  So the server will serve one component.
	//  That component will have other things inside.
	//   The component will also be downloaded onto the client.

	var test_document_server_with_client_side_component = function() {
		var server = new jsgui.Server.JSGUI_Server({});
		server.start(port, function() {
			app.listen(port, function() {
				var spc;
				var map_cached_files = {};
				var map_uglified_js_files = {};
				var map_compressed_files = {};
				var setup_serve_fs_file_as = function(fs_path, request_path) {
					app.get(request_path, function(req, res, next) {
						console.log('req.url ' + req.url);
						var serve_js_string = function(js_string) {
							res.setHeader('Content-Type', 'text/javascript');
							res.setHeader('Content-Length', js_string.length);
							res.end(js_string);
						}
						var serve_compressed_js_buffer = function(compressed_js_buffer) {
							res.setHeader('Content-Type', 'text/javascript');
							res.setHeader('Content-Length', compressed_js_buffer.length);
							res.setHeader('content-encoding', 'gzip');
							res.end(compressed_js_buffer);
						}
						var have_ugly_js_string = function(fs_path, ugly_js_string) {
							if (map_compressed_files[fs_path]) {
								serve_compressed_js_buffer(map_compressed_files[fs_path]);
							} else {
	    						zlib.gzip(ugly_js_string, function(err, gzipped) {
	    							if (err) {
	    								throw err;
	    							} else {
	    								console.log('gzipped callback');
	    								console.log('tof(gzipped) ' + tof(gzipped));
	    								map_compressed_files[fs_path] = gzipped;
	    								serve_compressed_js_buffer(gzipped);
	    							}
	    						});
							}
						}
						var have_js_string = function(fs_path, js_string) {
							if (map_uglified_js_files[fs_path]) {
								have_ugly_js_string(fs_path, map_uglified_js_files[fs_path]);
							} else {
								console.log('pre uglify');
								var result = UglifyJS.minify(js_string, {
									'fromString': true
								});
								map_uglified_js_files[fs_path] = result.code;
								have_ugly_js_string(fs_path, result.code);
							}
						}
						if (map_cached_files[fs_path]) {
							have_js_string(fs_path, map_cached_files[fs_path]);
						} else {

							fs2.load_file_as_string(fs_path, function(err, str_js_file) {
								if (err) {
									throw err;
								} else {
									console.log('loaded file fs_path ' + fs_path);
									console.log('pre transform');
									str_js_file = transform_js_for_client(str_js_file);
									console.log('post transform');


									map_cached_files[fs_path] = str_js_file;
									have_js_string(fs_path, map_cached_files[fs_path]);
								}
							})
						}
					});
				}

				setup_serve_fs_file_as('../../jsgui-html.js', '/js/jsgui-html.js');
				setup_serve_fs_file_as('../../jsgui-radio-button.js', '/js/jsgui-radio-button.js');
				setup_serve_fs_file_as('../../jsgui-lang-enh.js', '/js/jsgui-lang-enh.js');
				setup_serve_fs_file_as('../../enhanced-data-object.js', '/js/enhanced-data-object.js');
				setup_serve_fs_file_as('../../jsgui-lang-util.js', '/js/jsgui-lang-util.js');
				setup_serve_fs_file_as('../../jsgui-data-structures.js', '/js/jsgui-data-structures.js');
				setup_serve_fs_file_as('../../jsgui-lang-util.js', '/js/jsgui-lang-util.js');
				setup_serve_fs_file_as('../../data_object.js', '/js/data_object.js');
				setup_serve_fs_file_as('../../collection.js', '/js/collection.js');
				setup_serve_fs_file_as('../../jsgui-lang-essentials.js', '/js/jsgui-lang-essentials.js');
				setup_serve_fs_file_as('../../jsgui-data-structures-b-plus-tree.js', '/js/jsgui-data-structures-b-plus-tree.js');
				setup_serve_fs_file_as('../../jsgui-data-structures-stiffarray.js', '/js/jsgui-data-structures-stiffarray.js');
				setup_serve_fs_file_as('../../jsgui-data-structures-doubly-linked-list.js', '/js/jsgui-data-structures-doubly-linked-list.js');
				setup_serve_fs_file_as('../../constraint.js', '/js/constraint.js');
				setup_serve_fs_file_as('./test-document-client.js', '/js/test-document-client.js');

				setup_serve_fs_file_as('../../require.js', '/js/require.js');
				setup_serve_fs_file_as('../../jsgui-sample-controls.js', '/js/jsgui-sample-controls.js');
				


				/*
				var cached_requirejs;


				app.get('/js/require.js', function(req, res, next) {
					var url = req.url;
					console.log('url ' + url);

					if (cached_requirejs) {
						res.setHeader('Content-Type', 'text/javascript');
						res.setHeader('Content-Length', cached_requirejs.length);
						res.end(cached_requirejs);

					} else {
						//console.log('pre load_file_as_string');
						fs2.load_file_as_string('../../require.js', function(err, str_js_file) {
							if (err) {
								throw err;
							} else {
								//console.log('str_js_file ' + str_js_file);
								cached_requirejs = str_js_file;
								res.setHeader('Content-Type', 'text/javascript');
								res.setHeader('Content-Length', str_js_file.length);
								res.end(str_js_file);

							}
						})
					}
				});

				var cached_str_js_file;

				app.get('/js/jsgui-client.js', function(req, res, next) {
					var url = req.url;
					console.log('url ' + url);

					if (cached_str_js_file) {
						res.setHeader('Content-Type', 'text/javascript');
						res.setHeader('Content-Length', cached_str_js_file.length);
						res.end(cached_str_js_file);

					} else {
						fs2.load_file_as_string('../../jsgui-client.js', function(err, str_js_file) {
							if (err) {
								throw err;
							} else {
								//console.log('str_js_file ' + str_js_file);
								cached_str_js_file = str_js_file;
								res.setHeader('Content-Type', 'text/javascript');
								res.setHeader('Content-Length', str_js_file.length);
								res.end(str_js_file);

							}

						})
					}
				});
				*/

				app.get('/', function(req, res, next) {
					// can get the full url out of the path.
					//  can get the difference from the url_path
					
					var url = req.url;
					console.log('url ' + url);
					
	                spc = new jsgui.Server.Page_Context({
	                     'request': req,
	                     'response': res,
	                     'rendering_mode': 'html5'
	                });

					var doc = new jsgui.Client_HTML_Document({'context': spc});

					doc.include_jsgui_client('js/test-document-client');

					// but will include some particular client-side code.



					var page_component = new Client_Side_Component({
						context: spc
					});

					doc.body().content().add(page_component);



					server.serve_document(req, res, doc);
				});
				
				
				app.get('*', function(req, res, next) {
					res.send(404);
				});
				
			});
		});

	}
	test_document_server_with_client_side_component();

	var test_transform_js = function() {
		// Load the JS file we were having problems with.

		fs2.load_file_as_string()



	}
	//test_transform_js();

		
		
		
		
		
		
	
	
	// and first have express / connect listening to requests and giving them to the server?
	//  that would play well with other projects.
	
	
	
	
	
	
	
	
	
	
});

