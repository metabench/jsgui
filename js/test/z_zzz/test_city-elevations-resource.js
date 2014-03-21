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

requirejs(['./jsgui-server', './resource-eg-city-elevations'],
function (jsgui, City_Elevations) {
	
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
	
	// city_elevations
	
	// Resources should work fine by themselves, while not in a pool.
	
	// Also could make a City_Elevations server that includes a client-side app.
	
	// Feb 2013 - Need to finish off a lot of the code, an not add more structure.
	//  A lot of structure has been put into this, now need to leverage that for functionality in apps.
	
	
	
	
	
	
	var ce = new City_Elevations();
	
	// those functions are now asyncronous.
	
	
	
	//var elevations = ce.get('elevations');
	//console.log('elevations got with "elevations" property: ' + stringify(elevations));
	
	
	ce.get('elevations', function(err, res) {
	    console.log('cb get elevations res ' + stringify(res));
	});
	
	// Using resources with a callback... allows for resources to access other things asyncronously.
	
	// So we can have a FileSystem resource that gets published using the Resource system.
	//  Allows gor generalities in providing or denying access.
	
	// Need to have an authentication and authorization layer (or multiple ways of doing this too).
	//  Could make a Restricted_Resource (which many/most/all will be when published on the web) so that certain A&A information
	//  is used to access such a resource.
	
	// And let's use this to get the MetaBench web presence really good.
	
	// Allows for a website to be run from JSON.
	//  That may make a good first version, before it is put into a DB and CMS.
	//  Can specify things as fields fitting for a language / locale.
	//   Use this for internationalization, but have that layer added in after simple JSON has been provided.
	
	// Would be nice to have it showing some tech news links on the front page to start with?
	//  Or some screenshots?
	
	
	//  Have it so that someone can write about their app, asking for a reply.
	
	// Also, want the MetaBench main Control.
	//  This will enable the display of data that is on the MetaBench server.
	//   Could be data categories...
	//   Maybe will be full-screen.
	
	
	// Can view more info on various items.
	
	// I think we have it designed, with various icons, like 'audio', 'video', 'cloud', 'mobile'
	
	
	// A news section
	// Can have a consultancy ad contracting section
	// A projects section
	//  Later the front page could contain utilities
	
	
	
	//var els2 = ce.get();
	//console.log('elevations got through default property: ' + stringify(els2));
	
	// That looks fine!
	//  It gets the sub-properties, but does not have 'elevations' as the only property.
	
	// It will be interesting to serve that resource,
	//  and to have a client consume the resource.
	
	// resource-server would serve a resource, to a port or to a URL.
	//  It would handle requests to that resource over a web interface.
	
	// A client program could get that resource, and use it.
	
	// Also, a resource can be used to power a website.
	// Want to set up a website that gets served with jsgui.
	
	// want to be able to get elevtions of a particular city.
	//  The Data_Object and Resource should maybe index the information.
	
	// Could make a database resource, or persist a resource to the database.
	//  The resource could have a 'get' which returns its main information.
	
	// May have a Resource_Pool server?
	//  But Resource_Pool is a Resource anyway.
	
	// A Resource_Publisher or Resource_Server will present the Resource over an HTTP or even HTML interface.
	
	// Want to get this website running - the Website is a Resource, with its own publishing.
	//  Website_Resource - Allows for queries to be asyncronous.
	//  Website_Server - Serves the Website_Resource (processes requests)
	
	// Let's build the MetaBench website.
	//  We'll have a MetaBench website data resource.
	//  metabench-website-resource
	//  maybe extends website-resource.
	
	// Let's have the Website data model.
	//  Something in  a fairly standard JSON format that publishes a website.
	//  There may be various resources involved too.
	//  Resources may get stored in a database, resources could be images, other files etc.
	
	// Let's get it serving this website.
	// Want some content in there...
	//  However, also want the admin system to be fully working.
	
	// Maybe making the file manager will be a good step, for administration of the website.
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
});