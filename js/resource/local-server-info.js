
/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../web/jsgui-html', 'os', 'http', 'url', './core/resource', '../web/jsgui-je-suis-xml', 'cookies'],
*/


	// Not sure the server needs the controls???



	// This module is really adding a resource.



	//function(jsgui, os, http, libUrl, Resource, JeSuisXML, Cookies) {
var jsgui = require('../web/jsgui-html'), os = require('os'), http = require('http'),
libUrl = require('url'), Resource = require('./core/resource'),
JeSuisXML = require('../web/jsgui-je-suis-xml'), Cookies = require('cookies');

	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;

	var exec = require('child_process').exec;


	var get_network_info = function(callback) {
		// Need to return this in a way that is useful for Windows too.

		var net_info = os.networkInterfaces();
		//console.log('net_info ' + stringify(net_info));
		// still not working in Windows... need a quick fix.

		// will get the info from ipconfig... will read various results from that to start with.

		var is_useless_net_info = function(net_info) {
			var c = 0;
			each(net_info, function(i, v) {
				c++;
			})
			return c == 0;
		}
		//console.log('is_useless_net_info ' + is_useless_net_info(net_info));

		if (is_useless_net_info(net_info)) {
			throw 'Need to add Windows support';
		} else {
			callback(null, net_info);
		}


	}

	var fc_get_network_ip = function(callback) {
		// maybe this will have a callback?
		var net_info = os.networkInterfaces();
		//console.log('net_info ' + stringify(net_info));
		// still not working in Windows... need a quick fix.

		// will get the info from ipconfig... will read various results from that to start with.

		var is_useless_net_info = function(net_info) {
			var c = 0;
			each(net_info, function(i, v) {
				c++;
			})
			return c == 0;
		}
		//console.log('is_useless_net_info ' + is_useless_net_info(net_info));

		if (is_useless_net_info(net_info)) {
			// get the relevant information.

			if (process.platform == 'win32') {
				command = 'ipconfig';

				exec(command, function (error, stdout, sterr) {
		        	//console.log('stdout ' + stdout);
		        	// get the info for the different adapters.
		        	//  Perhaps this could easily use the grammar and a parser... could have a very concise, small grammar for this simple task.
		        	var adapters = [];
		        	/*
		        	var pos1 = stdout.indexOf(':');
		        	console.log('pos1 ' + pos1);
		        	var pos2 = stdout.lastIndexOf('\n', pos1);
		        	console.log('pos2 ' + pos2);
		        	//var pos1 = stdout.indexOf(':');

		        	var adapterName = stdout.substring(pos1, pos2);
		        	console.log('adapterName ' + adapterName);
		        	*/
		        	var s_out = stdout.split('\n');
		        	//console.log('s_out ' + stringify(s_out));

		        	var adapter_name;
		        	var adapter;
		        	var state = 'ready';

		        	each(s_out, function(i, v) {
		        		//console.log('v ' + v);
		        		//console.log('v.length ' + v.length);

		        		//console.log('state ' + state);

		        		var last_char = v.substr(v.length - 2, 1);
		        		//console.log('last_char ' + last_char);

		        		if (state == 'ready') {
		        			if (last_char == ':') {
			        			//console.log('v ' + v);
			        			adapter_name = v.substr(0, v.length - 2);
			        			//console.log('adapter_name ' + adapter_name);
			        			state = 'pre_reading_adapter';
			        			adapter = {
			        				'name': adapter_name
			        			}
			        			adapters.push(adapter);
			        		}
		        		} else 	if (state == 'pre_reading_adapter') {
		        			if (v.length == 1) {
		        				state = 'reading_adapter';
		        			} else {
		        				//throw 'break'

		        			}
		        		} else if (state == 'reading_adapter') {
		        			//console.log('v.length ' + v.length);
		        			if (v.length > 1) {
		        				//console.log('v ' + v);
		        				var pos1 = v.indexOf('. ') - 1;
		        				//var pos1 = v.indexOf('.') -1;
		        				//console.log('pos1 ' + pos1);
		        				var pos2 = v.indexOf(':');
		        				if (pos1 == -2) {
		        					var property_name = v.substring(0, pos2);
			        				property_name = property_name.replace(/^\s+|\s+$/g,'');
		        				} else {
		        					var property_name = v.substring(0, pos1 + 1);
			        				property_name = property_name.replace(/^\s+|\s+$/g,'');
		        				}

		        				//console.log('property_name ' + property_name);

		        				var property_value = v.substr(pos2 + 2).replace(/^\s+|\s+$/g,'');
		        				//console.log('property_value ' + property_value);
		        				//console.log('property_value ' + property_value.length);

		        				if (property_value.length > 3) {
		        					adapter[property_name] = property_value;
		        				}

		        				//adapter[]

		        			} else {
		        				// phase change.
		        				state = 'ready';
		        			}
		        		}
		        	})
		        	//console.log('adapters ' + stringify(adapters));
		        	// then want to find adapters with ipv4

		        	var adapters_with_ipv4_address = [];
		        	each(adapters, function(i, v) {
		        		if (v['IPv4 Address']) {
		        			adapters_with_ipv4_address.push(v);
		        		}
		        	});

		        	//console.log('adapters_with_ipv4_address ' + stringify(adapters_with_ipv4_address));

		        	var local_area_connection_adapters = [];
		        	each(adapters_with_ipv4_address, function(i, v) {
		        		if (v.name.indexOf('Local Area Connection') > -1) {
		        			local_area_connection_adapters.push(v);
		        		}
		        	});

		        	//console.log('local_area_connection_adapters ' + stringify(local_area_connection_adapters));

		        	if (local_area_connection_adapters.length > 0) {
		        		callback(local_area_connection_adapters[0]['IPv4 Address']);
		        	} else {
		        		// error callback?
		        		callback();
		        	}

		        	// then read it in line by line, setting adapter properties.

		        	// The local server information could request information about local adapters and other hardware.
		        	//  Right now we are just looking for the IP address really.
		        	//  Also, with requirements, the website publisher can start once the local server information has been retireved.

		        	// Should be able to publish some decent information about this system, that will help it get acceptance in the marketplace.

		        	// FSM line processor

		        	/*

		        	var read_line = function() {


		        	}
		        	*/

		        	/*

		            cached = [];
		            var ip;
		            var matches = stdout.match(filterRE) || [];
		            //if (!error) {
		            for (var i = 0; i < matches.length; i++) {
		                ip = matches[i].replace(filterRE, '$1')
		                if (!ignoreRE.test(ip)) {
		                    cached.push(ip);
		                }
		            }
		            //}
		            callback(error, cached);
		            */
		        });
			}
		} else {
			// it is easier when we get the proper network results.
			var external_ip4 = [];

			each(net_info, function(device_name, device_details) {
				//console.log('device_name ' + device_name);
				//console.log('device_details ' + stringify(device_details));

				each(device_details, function(i, interface_details) {
					//console.log('interface_details ' + stringify(interface_details));

					if (interface_details.family == 'IPv4') {
						if (interface_details.internal == false) {
							external_ip4.push([device_name, interface_details.address]);
						}
					}
				});
			})
			//console.log('external_ip4 ' + stringify(external_ip4));

			//return
			callback(external_ip4[0][1]);
		}

		/*
	    var get_external_ipv4_addresses = function(network_interfaces, callback) {
	    	// will need to use a callback in Windows I think... it will read the information from ipconfig output.
	    	var res = {};

	    	each(network_interfaces, function(name, value) {
	    		//var v4 = value[1];

	    		each(value, function(i, v) {
	    			// is it ipv4
	    			if (v.family == 'IPv4' && v.internal == false) {
	    				// found external ip4.
	    				res[name] = v.address;
	    			}

	    		})

	    	});
	    	return res;
	    }

	    //console.log('net_info ' + stringify(net_info));
	    //console.log('net_info ' + (net_info));
	    // filter map by regex to get the the ethernet ones.
	    var ext_ip4 = get_external_ipv4_addresses(net_info);
	    var en_addresses = arrayify(filter_map_by_regex(ext_ip4, /^en\d+$/));
	    if (en_addresses.length == 1) {
	    	return en_addresses[0][1];
	    }
	    */

		/*

		getNetworkIPs(function(ips) {
			console.log('ips ' + stringify(ips));
			callback(ips);
		});
	    */
	    //console.log('ext_ip4 ' + stringify(ext_ip4));
	    //console.log('en_addresses ' + stringify(en_addresses));
	    // want to read through it, looking for local network interface, ip v 4.
	};

	var Network_Interfaces = Collection.extend({
		'item_def': {'name': 'string', 'entries': [{'address': 'string', 'family': 'string', 'internal': 'boolean'}]}
	});

	var Local_Server_Info = Resource.extend({
		// A network interfaces field.
		'fields': [
			//['name', 'string'],
			['networkInterfaces', Network_Interfaces],
			['status', 'string']
		],

		'init': function(spec) {
			this._super(spec);

			// meta status.



			this.meta.set('status', 'off');
			//this.set('interface', 'server_information');

			// Info about the server... access to the file system will come from another Resource.

			// And the local server information could find out about various providers?
			//  Load in different resources?




			// could have a resource that

			//  The interface will be used so that other resources which consume resources will know they are connected to a resource of the correct type.

			// does not require anything.
			//  otherwise would be // this.set('requires', [['name1', 'item1'], ['name2', 'item2']])
			//   when requires has been set, we can use the 'using' or similar syntax.
			//   using(item1, item2).

			// so it checks that what it is using matches up with the requirements.

			// works backwards to see that things can start, works forward to actually start them.

			// This one won't require another resources, so will be able to start immediately.
			//  When it does require other resources, first determine if all of them are able to start.
			//  When it finds out that they are, it starts them.

			// Checks that the various resource objects that it uses actually exist.
			//  These references will be done by name lookup, I think.
			//  Possibly wire them directly?
			//  Not an issue with this particular resource.

			// Maybe we should make a few test resources that start up?
			//  I think making and testing this very library would be better unless I get stuck.

			// The whole resources system could be running, and present things with a relatively simple API.
			// Should still be possible to do a lot just with xml, strings, controls, using the document rendering system that exists.

			//  then it would require items of those types.
			//  could have local names for the used items


			//this.set('info', {});
			//this.set('info', new Data_Object({}));
			// info could be a field.
			//  That means it would store it in a more organised / constructed way.
			//   That would assist in getting various things like the names of various objects without getNames etc as functions.

			// Using fields would make a lot of sense.
			//  As well as that, don't really want an 'info' field, as this class is info already.
			//  It's the data, and ways of exposing it.
			//   The resource will have various fields, and they could get exposed through the description,
			//    so fields certainly makes sense.



		},

		// context needs to work properly in call multiple.. need to sort that out.
		//  may need to specify the calling object and the function.
		//  may not just be a pair.

		'start': function(callback) {

			// should check to see if it's already started.
			//  if it has, then it would need to be restarted with restart rather than start.
			//  start is more like ensureStarted




			// not so sure about this taking callbacks. The resource pool could notify other things of when this has started, and perhaps get other resources to start up when appropriate.
			//console.log('starting Resource.Local_Server_Information');
			//console.log('this ' + tof(this));
			var o_status = this.meta.get('status');
			//console.log('o_status ' + o_status);
			var that = this;
			// collections responding to events in their objects?

            //console.log('lsi start');
            //console.log('o_status', o_status);

			if (o_status == 'off') {
				that.meta.set('status', 'starting');
				// The resource pool will be listening for changes in status.
				//  It may update them on GUIs in browsers that are listening.

				// get the ipv4_address
				//  Then other services / other parts of this service could discover more information about what is running on the server.

				// More likely that a postgres-db resource, configured to look for one on the local machine, will then do so.
				//  Using credentials stored on the machine at a lower level?

				// could use a function outside this to get the ipv4 address.
				//  Having it within the resource system will avoid confusion about if things get called with callbacks - they do use callbacks.

				// get the network info.
                //console.log('pre get_network_info');
				get_network_info(function(err, netInfo) {
					if (err) {
						throw 'error getting network info ' + err;
					} else {
						that.meta.set('status', 'on');
						that.raise_event('started');
						////that.set('netInfo', netInfo);
                        //console.log('netInfo', netInfo);


						//that.set('network.interfaces', netInfo);

						// Could have a bunch of network interface objects.
						//console.log('');
						//console.log('pre get');
						// Can we set a particular type of collection to hold these network interfaces?
						var nis = that.get('networkInterfaces');
						//console.log('nis ' + stringify(nis));
						//console.log('nis.fields() ' + stringify(nis.fields()));

						//console.log('that.fields() ' + stringify(that.fields()));

						//console.log('netInfo ' + stringify(netInfo));

						// Let's push the items in.

						each(netInfo, function(i, interfaceInfo) {
							//nis.push(interfaceInfo);

							//console.log('i ' + i);
							//console.log('interfaceInfo ' + stringify(interfaceInfo));

							var item = {
								'name': i,
								'entries': interfaceInfo
							}

							nis.push(item);

						});

						//throw 'stop';

						//console.log('nis ' + stringify(nis));


						//throw 'stop';


						// Should be lazy loading the Data_Object OK.
						//  Need to check this.

						//var nw = that.get('network');
						//console.log('nw ' + stringify(nw));

						//var ifce = nw.get('interface');
						//console.log('ifce ' + stringify(ifce));

						// Finding all IPV4 addresses would be easy.


						// We'll want to work out which IP addresses to run this on.
						//  We could listen on all IP addresses.


						if (callback) {
                            //console.log('pre cb lsi');
							callback(null, true);
						}
					}
				})


				/*
				fc_get_network_ip(function(ipv4) {

					// It may need a data_object field?


					console.log('ipv4 ' + stringify(ipv4));
					that.set('info.ipv4', ipv4);

					// something else will listen for status changes

					that.set('status', 'on');

					// raise an event saying it has started.
					that.raise_event('started');

					if (callback) {
						callback(null, true);
					}

				});
				(/)
				*/
			} else if (o_status == 'on') {
                callback(null, true);
            }
			// does not have any dependencies which would also have to start.

			// not sure about having it start on initialization.
			//  I think the resources will work differently to that.
			//  The JS object being there does not mean that the resource is running. It could be stopped, or in an initialization stage.



			// will have different statuses.
			//  will be 'off', 'on', 'starting', 'stopping', 'failed'
			//  the changes in state will be events that get raised.

			// The resource pool is going to listen for various changes so it can start things up.

			// When the local server information starts, its going to be getting some information.

			// I think this resource will just have a 'get' function that gets the internal data.
			//  Other resources can work in a similar way, where they are opened up to a publishing system, and they have this simple 'get' api.

			// The publishing system will also deal with access restrictions.

			// The local server information resource could keep getting updates on things such as the CPU usage
			//  Perhaps the CPU usage of this particular node.js process.

			// This resource will keep updating itself as necessary.

			// it will do different things during its various status phases.
			//  while starting up it may be carrying out asynchronous functions.
			//   one such function will be getting the local network details - this may need to be async in Windows.

			// Once various things are done, this resource will be 'on' in the resource pool.
			//  When it is there, it is available. The local network address will be one of the things available in this resource.
			// Will be possible to get more than one piece of information at once, may be possible to get just the one piece of information - though
			//  care would need to be taken when doing this over network requests.

		},
		'meets_requirements': function() {
			return true;
		}

		//,
		/*

		'get': function() {
			// possibly throw an exception/ return an error... seems better... if the resource has not started yet.
			//  This gets the status, or the local server information.
			//  The network address is the main thing to begin with.

			// will return an object with various pieces of information, the network address being one of the most important ones.


			// Other resources will be wired up to use this local information
			//  For example, when we connect to the local postgres server, that is how it finds out what the local machine is.
			//  That is why the db connection will start after the local postgres service.

			// Likely to split the authentication out of the normal database - but have it possible to have the normal db do that.
			//  It gets complicated here, because some components could do varying amounts of authorization.
			//   Role checking could be another thing.
			//   Permission checking too.
			//    Permissions may be more tied to objects or groups of them.
			//    I think moving some of the authorization mechanisms out of the main database is another step.
			//    Having an authorization provider
			//    Authentication provider too.

		}
		*/
	})




	//return Local_Server_Info;


//});
module.exports = Local_Server_Info;
