

var jsgui = require('../../../../js/web/jsgui-server');
//var Window = require('../../../../js/web/controls/advanced/window');
var Radio_Button_Group = require('../../../../js/web/controls/advanced/radio-button-group');
var Tabs = require('../../../../js/web/controls/advanced/tabs');

var Server_Page_Context = require("../../../../js/web/server-page-context");

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

var server = new jsgui.Server.JSGUI_Server({
	'*': {
		'name': 'start-stop-toggle-button'
	}
});


var rp = server.get('resource_pool');
var Control = jsgui.Control;

// List of resources in the pool...

console.log('rp.count()', rp.count());
//throw 'stop';


//console.log('rp ' + rp);
var rp = server.get('resource_pool');
var ar = rp.get_resource('Server Router');

console.log('!!ar', !!ar);



var rt = ar.get('routing_tree');

// Would be best if the server built the client side on start, if needed.
//  Could have a version numbering system that could tell if it's not needed - or check last modified times of files.




server.start(port, function(ree, res_started) {

	console.log('started server');
	//throw 'stop';

	// Maybe it's best to use je-suis-xml for setting up the page.

	// Set up jsgui-html-client-stylish within the js serving resource.
	//  It gets served as if it's within /js/web

	// Automatic generation of a new page context?
	rt.set('/', function(req, res) {
		// Better to make a proper JSGUI client document.

		var server_page_context = new Server_Page_Context({
			'req': req,
			'res': res
		});

		var hd = new jsgui.Client_HTML_Document({
			'context': server_page_context
		});

		hd.include_client_css();
		hd.include_js('/js/app-bundle.js');

		var body = hd.body();

		// Want easy access to the various tabs and panels here.
		//  Both through exposed references to them, as well as (probably best) in construction.

		// Would be nice to have a more declarative way of expressing this.


		// add and make function

		// Dont want to just add a string...
		//  That's the text (for the moment).
		//  Could have a different way of adding text, such as a text function.



		// .add('<code');
		//  seems like most convenient syntax.





		// .add(text(...));

		// New syntax for this.make
		//  Will have some translation layers between HTML-like trees and the parameters for

		/*
		var ctrl_0 = this.make(`
		<Tabs>
			<Tab>Content 1</Tab>
			<Tab>Content 2</Tab>
			<Tab>Content 3</Tab>
		</Tabs>`);
		*/

		var ctrl_0 = new Tabs({
			'context': server_page_context,
			'tabs': ['Tab1', 'Tab2', 'Tab3']
		});

		ctrl_0.panel(0).add('Tab index 0 content');
		ctrl_0.panel(1).add('Tab index 1 content');
		ctrl_0.panel(2).add('Tab index 2 content');




		/*
		var ctrl_0 = new Tabs({
			'context': server_page_context,
			'tabs': ['Tab1', 'Tab2', 'Tab3'],
			'def': `
				<div>Content 1</div>
				<div>Content 2</div>
				<Start_Stop_Button name="ssb1"/>
				`

		});
		//ctrl_0.resizable();




		//ctrl_0.panel(2).add('Tab index 2 content');

		//ctrl_0.panel(2).jesui('<Calendar year="2015" />');

		//ctrl_0.panel(2).jesui('<Start_Stop_Button name="ssb1"/>');

		//var ssb1 = this.find('ssb1');
		*/

		// A combination of declatative definitions, and then searching for



		// Identity or naming contexts would make sense.
		//  So when we are defining a control, we can keep track of various names of subcontrols.
		//  In fact, we already have ctrl_fields.




		// Use an HTML parser to start with, then change it to xml.




		body.add(ctrl_0);
		ctrl_0.active();



		// style should at least set the CSS.
		//


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
