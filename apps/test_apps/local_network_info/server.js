

var jsgui = require('../../../js/web/jsgui-server');
//var Window = require('../../../../js/web/controls/advanced/window');
var Radio_Button_Group = require('../../../js/web/controls/advanced/radio-button-group');
var Tabs = require('../../../js/web/controls/advanced/tabs');

var Server_Page_Context = require("../../../js/web/server-page-context");

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

var lsi = rp.get_resource('Local Server Info');

console.log('Local Server Info lsi', lsi);
console.log('tof lsi', tof(lsi));

lsi.start(function(err_start, res_start) {
	if (err_start) {
		console.log('error starting Local Server Info resource', err_start);

	} else {


		console.log('cb start Local Server Info');

		console.log('');

		console.log('Local Server Info lsi', lsi);
		console.log('tof lsi', tof(lsi));

		var nis = lsi.get('networkInterfaces');
		console.log('nis', nis);
		console.log('tof nis', tof(nis));

		console.log('nis', stringify(nis));

		var t_nis = tof(nis);

		if (t_nis === 'collection') {
			console.log('network interfaces object is a collection');

			console.log('nis.length()', nis.length());

			var nis_index_system = nis.index_system;
			console.log('nis_index_system', nis_index_system);
			console.log('tof nis_index_system', tof(nis_index_system));

			var indexes = nis_index_system.indexes();
			console.log('indexes', indexes);

			var index_map = nis_index_system.index_map;
			console.log('index_map', index_map);
			//throw 'stop';


			var matching = nis.find('entries', {
				'family': 'IPv4',
				'internal': false
			});

			console.log('matching.length()', matching.length());

		}


	}
})