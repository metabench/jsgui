

var jsgui = require('../../../../js/web/jsgui-server');
//var Window = require('../../../../js/web/controls/advanced/window');
var Grid = require('../../../../js/web/controls/advanced/grid');
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
		'meta': {
			'name': 'start-stop-toggle-button'
		}
	}
});
//'*': {
//	'name': 'start-stop-toggle-button'
//}
var rp = server.get('resource_pool');
var Control = jsgui.Control;
var website_resource = rp.get_resource('start-stop-toggle-button');
var js = website_resource.get_resource('Site JavaScript');
//js.set('auto_build_client', true);
// or call a function...
//  seems more specific.

var ar = rp.get_resource('Server Router');
var rt = ar.get('routing_tree');
//console.log('js', js);


var col_name = function(n) {
	var ordA = 'a'.charCodeAt(0);
	var ordZ = 'z'.charCodeAt(0);
	var len = ordZ - ordA + 1;

	var s = "";
	while(n >= 0) {
		s = String.fromCharCode(n % len + ordA) + s;
		n = Math.floor(n / len) - 1;
	}
	return s;
}

js.build_client(function(err, res_build_client) {

	server.start(port, function(ree, res_started) {

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

			var num_columns = 6;
			var num_rows = 120;

			var x, y;

			var data = [];


			for (y = 0; y < num_rows; y++) {
				var row = [];
				data.push(row);

				for (x = 0; x < num_columns; x++) {
					var val = col_name(x) + (y + 1);
					row.push(val);
				}
			}


			// The Grid should use an underlying DataGrid.

			// Seems like decent syntax to put in a single scrollbar.
			//  When scrollbars are in use, the control's contents need to be packaged into some kind of inner control.
			//   The control may make use of an inner_control property, not for use as the area inside the scrollbar, but it may be further inside something else.
			// For that reason, it may be worth having a scrollable_internal, or scroll_internal Control.

			// The control would insert another control between itself and its current content.
			//  That would be trickier when the control itself is not a DIV.
			//  So a Table control, would need to render itself as a DIV, with the table inside the control.
			//   (possibly inside another view window DIV - that seems most stable)

			// There needs to be a fair bit of rearrangement of controls when scrollbars are in operation.

			// There may be a case for having controls start up with a view window inside.
			//  At least some of the larger controls that can accept scrollbars.

			// Adding view window functionality to controls / enchanced controls may be the first step to take in this.
			//  A control may possibly have multiple view tiles.

			// VIEW TILES are the way it should be called.
			//  Could have a single view tile / tile within a control.
			//  Could possibly have more than one view tile.
			//  Those tiles / that tile would exist within a view window.
			//  That window itself would not move, but its contents would move.


			//  Would set things up by default as being a single view window with
			//   no view tiles / view tiles not used
			//   a single view tile
			// ctrl view_window view_tiles

			// This is a decent logical hierachy that will also work for Google Maps type tiling.
			//  However, it does not deal with the inner_control as things stand. That may be an advantage.

			// For the moment, stay aware of how tiles may be used in the future. For the moment, we just need a single tile, within a view window (that does not move), within the control.






























			var ctrl_0 = new Grid({
				'context': server_page_context,
				'data': data,
				'scrollbar': 'horizontal'

			});



			//ctrl_0.resizable();
			body.add(ctrl_0);

			// Making a table active make it use a lot more HTML attributes.
			ctrl_0.active();

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
});