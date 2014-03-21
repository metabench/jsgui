//require('nodetime').profile()
var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
	//paths: {
    //    "some": "some/v1.0"
    //},
    nodeRequire: require
});

requirejs(['./jsgui-server', 'express', './jsgui-sample-controls'],
function (jsgui, express, jsgui_sample_controls) {
	
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
	var port = 5009;
	
	// that jsgui object will have what is needed to serve HTML.
	
	// May integrate this with Connect or routes... or may call on jsgui functionality from a connect or express route.
	
	// May still be simple to talk about serving files to paths... but will want to serve other objects / have them exposed on a path.
	
	// Want an html document control that is an empty document.
	// creation of empty html document...
	
	// let's start up the server.
	
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
		
		// The server should probably listen on that port.

		// We may need our own routing system for these resources. Using express for the moment makes sense though.

		// need to be able to define these request handlers on the server.
		//  Either using Express or not.


		/*
		app.listen(port, function() {
			// say what IP address...
			//  give the external ipv4 address?
			console.log("Listening on " + port);

			// This is the HTML administration interface.
			//  I think we can't use Express quite like this.

			// Will need to get the jsgui server to do its response handling, and then
			//  

			

			app.get('/admin', function(req, res, next) {
				//server.
				// Response processors.
				//  A response processor could be an object.
				//   Basically a function?
				//    A subclass of function?
				//     Ie a function with a specified interface, or could have a few interfaces.

				// Also need JSON commands.
				//  May want a description of the resource.

				//GET, POST, PUT, DELETE



			})



			app.get('/', function(req, res, next) {
				// can get the full url out of the path.
				//  can get the difference from the url_path
				
				var url = req.url;
				console.log('url ' + url);
				var spc = new jsgui.Server.Page_Context({
                     'request': req,
                     'response': res,
                     'rendering_mode': 'html5'
                });
				//server.create_page_context?
				var doc = new jsgui.Client_HTML_Document({'context': spc});
				var basic_page = new jsgui_sample_controls.Basic_Page({
				    'title': 'Example Basic Page',
				    //'content': [new jsgui.p('James says hello')],
				    //'content': [new jsgui.p({'content': ['James says hello'], 'context': spc})],
				    'context': spc
				});

				var tn_jsh = new jsgui.textNode({'text': 'James says hello', 'context': spc});
				//basic_page.content().add(new jsgui.p({'content': [tn_jsh], 'context': spc}));
				var new_p = new jsgui.p({'context': spc});
				new_p.content().add(tn_jsh);
				basic_page.inner_content(new_p);
				doc.body().content().add(basic_page);
				server.serve_document(req, res, doc);
			});

			
			
		});

		*/
	});
});