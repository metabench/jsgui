
var jsgui = require('../../js/web/jsgui-server');


var Server_Page_Context = require("../../js/web/server-page-context");

var Default_Page = require('./js/default-page');


var Linux_System_Resource = require("../../js/resource/advanced/linux-system");

var Data_Object = jsgui.Data_Object;
var Collection = jsgui.Collection;


//var Simple_Authentication_Provider = Resource_Authentication.Simple_Provider;

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
var fromObject = j.fromObject;

var port = 80;

// sets up the server to process http requests with *

// The websocket router would need to work differently

// Could have different HTTP applications, but it would connect to the same socket system.

// We don't assign anything equivalent to the socks router here?
//  Or assign it to the relevant Resource?

// Should probably add that to the tree here.


// Probably connect to just one resource, though that resource can represent a bunch of other resources.

// As well as set, we may need commands.
//  Such as Reset USB (though it does set it off then on)
//  possibly .go or a 'go' call?
// Need to be able to call functions on Resources.
//  Or task.
//   It could even set a task.
//    Adds it to the task queue.


// Needs to handle tasks delivered by websocket.
//  The server will have such a task queue.

// Get and set will not use the task queue.
//  (not planned at least)

// Task queue will help to monitor the execution of tasks.







// .set('task', ['reset_usb', [4]])

//???
// .get('usb').set('task', [reset, [4]])

// .get('usb[4]').set('task', 'reset');
//  don't support this syntax in get.


var server = new jsgui.Server.JSGUI_Server({
    '*': {
        'name': 'window'
    }
});


var rp = server.get('resource_pool');

var Control = jsgui.Control;

var rp = server.get('resource_pool');
var ar = rp.get_resource('Server Router');
var rt = ar.get('routing_tree');



var os = require("os");

var resource_linux_system = new Linux_System_Resource({ 'meta': { 'name': 'Linux System' }});
rp.add(resource_linux_system);

// Should also have a Linux System Resource.

// Probably should have it run on Windows, but raise errors?




//Set delay for second Measure

server.start(port, function(err, res_started) {



	rt.set('/', function(req, res) {
		//console.log('1) server function from routing_tree');
		//console.log('req.url ' + req.url);
		// Better to make a proper JSGUI client document.
		var server_page_context = new Server_Page_Context({
			'req': req,
			'res': res
		});
		var hd = new Default_Page({
			'context': server_page_context
		});
		hd.include_client_css();
        hd.include_js('http://cdn.jsdelivr.net/sockjs/1.0.0/sockjs.min.js');
		hd.include_js('/js/app-bundle.js');

		hd.all_html_render(function(err, deferred_html) {
			if (err) {
				throw err;
			} else {
				//console.log('deferred_html', deferred_html);
				var mime_type = 'text/html';
				//console.log('mime_type ' + mime_type);
				res.writeHead(200, { 'Content-Type': mime_type });
				res.end(deferred_html, 'utf-8');
			}
		});
	});
	rt.setRoot404(function(req, res) {
		res.writeHead(404, {"Content-Type": "text/html"});
	  	res.write("<!DOCTYPE \"html\">");
	  	res.write("<html>");
	  	res.write("<head>");
	  	res.write("<title>Page Not Found</title>");
	  	res.write("</head>");
		res.write("<body>");
		res.write("<h1>Page Not Found</h1>");
		res.write("</body>");
		res.write("</html>");
		res.end();
	});
	// We should be able to put info into the db.
});
//});
