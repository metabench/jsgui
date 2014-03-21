//require('nodetime').profile({
//    accountKey: '9acb8ef314936e0d58a0ca0c52c94b1e162f483c', 
//    appName: 'Node.js Application'
//  });

//require('nodetime').profile()

//require('nodetime').profile();

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

requirejs(['../web/jsgui-server', 'express', '../web/jsgui-sample-controls'],
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
	
	//var app = express();
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
	// But a server could possibly listen on multiple ports.

	// We could configure a website resource as being part of the server.

	// Being able to expose all the resources in the site makes sense, so probably won't want the requests
	//  and responses fed through like that.

	// I think having a basic website resource makes sense.
	//  And an admin resource for the website resource.


	
	server.start(port, function() {
		console.log('jsgui server started');

	}, function(req, res) {
		//console.log('req ' + stringify(req));

		// At this point, we can pass the request to a Resource that handles requests.
		//  Resources will be able to talk to other resources and be remotely administered.
		console.log('maybe not being called');



	});
});