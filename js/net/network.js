


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

requirejs(['../../core/jsgui-lang-enh'], function (jsgui) {

	var stringify = jsgui.stringify;

	var strInterfaces = '{"lo0": [{"address": "fe80::1", "family": "IPv6", "internal": true}, {"address": "127.0.0.1", "family": "IPv4", "internal": true}, {"address": "::1", "family": "IPv6", "internal": true}], "en0": [{"address": "fe80::226:b0ff:fee1:7c12", "family": "IPv6", "internal": false}, {"address": "192.168.2.9", "family": "IPv4", "internal": false}], "vnic0": [{"address": "10.211.55.2", "family": "IPv4", "internal": false}, {"address": "fe80::21c:42ff:fe00:8", "family": "IPv6", "internal": false}, {"address": "fec0:0:0:fea9::1", "family": "IPv6", "internal": false}], "vnic1": [{"address": "10.37.129.2", "family": "IPv4", "internal": false}, {"address": "fe80::21c:42ff:fe00:9", "family": "IPv6", "internal": false}, {"address": "fec0:0:0:feaa::1", "family": "IPv6", "internal": false}]}';
	var objInterfaces = JSON.parse(strInterfaces);

	var tof = jsgui.tof;

	// Need to have the network interface data types... nice if they are quickly expressed.

	// Only need some classes...

	// A Network_Interface class could make sense.

	// However, perhaps we could just define the data within the type system inside a class.


	// interface
	//  name
	//  address entries
	//   address entry
	//    address
	//    family
	//    internal

	// Representing these within a Data_Object would enable some things to be found quicker, and to automate the code
	//  for bringing it from JSON or a simple object representation to one that is efficiently indexed, ready to be
	//  queried in different ways, eg get all external IP addresses. It may already have them in an index.
	// Eg get all enet ip4 addresses.

	// This seems like quite a concise way of expressing the network information.
	// [{}] is an array of objects. A single object in an array signigies an array of that type of object.

	// Means the network field is a compound data type.
	//  This adds a bit of complexity, but also means that the data structures for applications can be declared a lot more
	//   quickly and concisely.

	var test_config_class = function() {
		var Config = jsgui.Enhanced_Data_Object.extend({
			'fields': [
				['network', {'name': 'string', 'entries': [{'address': 'string', 'family': 'string', 'internal': 'boolean'}]}]
			]
		})

		var config = new Config();
		console.log('config ' + stringify(config));
		console.log('config.fields() ' + stringify(config.fields()));
		// The Data_Object should possibly have the network field (though it has not been set).

		//console.log('config.fields() ' + stringify(config.fields()));
	}
	test_config_class();

	//var test_network_data_object
	// fields as maps.
	//  This may be easier in many cases, though arrays may be better to strictly preserve order in all js implementations.

	var test_network_data_object = function() {
		// ???
		//var typeDef = {'name': 'string', 'entries': [{'address': 'string', 'family': 'string', 'internal': 'boolean'}]};
		//  it's the definition of the fields, being compound fields.

		// Not sure if this will work for a fields declaration quite yet.
		//  Probably needs additional programming.

		// This will definitely make more efficient code when object data types can be defined / declared simply like this.
		//  Could do quite wide-scale indexing of fields on some (smaller) objects.


		// Setting the fields, in the constructor, using a map object.
		// Maybe only Enhanced_Data_Object can deal with this...
		//  Having a collection inside it.

		// How can we index by the family?
		//  So, a query could be done on the entries' interfaces.



		// Looks more like a single network interface.
		var network = new jsgui.Enhanced_Data_Object({
			// Need to have the 'get' function able to deal with this.
			fields: {'name': 'string', 'entries': [{'address': 'string', 'family': 'string', 'internal': 'boolean'}]}
		});

		console.log('network ' + stringify(network));
		console.log('network.fields() ' + stringify(network.fields()));

		var name = network.get('name');
		var tName = tof(name);

		console.log('tName ' + tName);
		console.log('stringify name ' + stringify(name));

		// This should get the entries field properly.
		console.log('');
		//console.log('');
		//console.log('');

		var entries = network.get('entries');
		var tEntries = tof(entries);
		console.log('tEntries ' + tEntries);
		console.log('stringify entries ' + stringify(entries));
		console.log('stringify entries.fields() ' + stringify(entries.fields()));

		// When the fields have got set, some constraints should have got set as well.

		// constraint
		console.log('stringify entries.constraint() ' + stringify(entries.constraint()));
		// should show the constraints



		// create a new entry...
		// need to get the Enhanced_Data_Object constructor for that type.
		//  We have a collection of entries...
		//  Perhaps could have defined a Data_Object constructor.

		//var entry1 = new Data

		entries.push({
			'address': '192.168.1.8',
			'family': 'IPv4',
			'internal': false
		});

		console.log('stringify entries ' + stringify(entries));

		// Data_Object.find to find sub-objects?


		var found_ipv4 = network.find('entries.family', 'IPv4');
		console.log('found_ipv4 ' + found_ipv4);

		// Run the JSGUI server, then



	}
	//test_network_data_object();





	//var nw = config.get('network');
	//console.log('nw ' + stringify(nw));

});
