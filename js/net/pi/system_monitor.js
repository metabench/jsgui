
var jsgui = require('../../core/jsgui-lang-util');
var each = jsgui.eac;
var Fns = jsgui.Fns;
var Evented_Class = jsgui.Evented_Class;
var fs2 = require('../../fs/jsgui-node-fs2-core');
var process = require('child_process');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var wicomms = require('./wicomms');

var backup_config_files = wicomms.backup_config_files;
var restore_config_from_backup = wicomms.restore_config_from_backup;
var start_config = wicomms.start_config;

// tail -f /var/log/{messages,kernel,dmesg,syslog}
//  Looks like a much better way to structure an app that responds to the Linux events.
//  Can have it fairly intelligently responding to USB changes.

//var child = exec('tail -f /var/log/{messages,kernel,dmesg,syslog}');
/*
child = exec('tail -f /var/log/syslog',
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});
*/

// This looks really good, as we can look out for USB events.
//  Would like to try to get a simplified event system for USB.
//  connect, disconnect.







// It may be worth just looking for connect and disconnect messages here.
//  After receiving such a message, we do a comprehensive scan on the devices on the machine.
//   That scan would also (probably) involve a signal strength check, but we would like the scans to work really quickly.

// Want to be reading the physical USB address, as well as the logical device number.

// Evented class that monitors USB.

var USB_Connection_Change_Monitor = Evented_Class.extend({
	'init': function(spec) {

		var that = this;

		var pos1, pos2, pos3, pos4, pos5, pos6, pos7, pos8, pos9;
		var t1, t2, t3, t4;

		var child = exec('tail -f /var/log/syslog');
		var l_data_line;

		child.stdout.on('data', function(data) {
			//console.log('stdout: ' + data);

			//console.log('standard data.length ' + data.length);

			var arr_data_lines = data.split('\n');
			//console.log('arr_data_lines.length ' + arr_data_lines.length);

			t2 = 'usb disconnect';
			t3 = '] usb ';
			t4 = 'device number ';

			t5 = 'new high-speed usb device number ';
			t6 = 'new full-speed usb device number ';

			var physical_usb_address;
			var device_number;

			each(arr_data_lines, function(data_line) {
				l_data_line = data_line.toLowerCase();
				pos1 = l_data_line.indexOf('usb');

				if (pos1 > -1) {
					//console.log('data_line ' + data_line);
					pos2 = l_data_line.indexOf(t2);

					if (pos2 > -1) {
						//console.log('disconnect data_line ' + data_line);
						pos3 = l_data_line.indexOf(t3) + t3.length;
						pos4 = l_data_line.indexOf(':', pos3);

						physical_usb_address = l_data_line.substring(pos3, pos4);

						//console.log('physical_usb_address', physical_usb_address);

						pos5 = l_data_line.indexOf(t4) + t4.length;
						device_number = parseInt(l_data_line.substr(pos5), 10);

						//console.log('device_number', device_number);

                        // This type of result is harder to decipher.
                        //  Including the property names in the result will be easier for humans, but make for less optimized packets.

                        // Going for simpler and more expandable object event properties. More standard and expected.

                        //console.log('pre raise disconnect');
						that.raise('disconnect', { 'physical_usb_address': physical_usb_address, 'device_number': device_number });

					}

					pos6 = l_data_line.indexOf(t5);
					if (pos6 === -1) pos6 = l_data_line.indexOf(t6);
					if (pos6 > -1) {
						//console.log('connect data_line ' + data_line);

						pos6 += t5.length;
						device_number = parseInt(l_data_line.substr(pos6), 10);

						pos3 = l_data_line.indexOf(t3) + t3.length;
						pos4 = l_data_line.indexOf(':', pos3);

						physical_usb_address = l_data_line.substring(pos3, pos4);

						//console.log('physical_usb_address', physical_usb_address);

						//console.log('device_number', device_number);
                        //console.log('pre raise connect');
						that.raise('connect', { 'physical_usb_address': physical_usb_address, 'device_number': device_number });

					}
				}

			});



		});
		child.stderr.on('error data', function(data) {
			//console.log('stdout: ' + data);
		});
		child.on('close', function(code) {
			console.log('closing code: ' + code);
		});


	}
});


var get_dmesg = function(callback) {
	exec('dmesg', function (error, stdout, stderr) {
		// output is in stdout
		//console.log(stdout);
		var lines = stdout.split('\n');
		console.log('dmesg lines.length ' + lines.length);

		var pos1, pos2, pos3;
		var i_seconds, i_second_parts;

		var res = [];

		for (c = 0, l = lines.length; c < l; c++) {
			line = lines[c];
			if (line) {
				var sp_time = line.substr(1, 12).split('.');
				//console.log('sp_time', sp_time);
				i_seconds = parseInt(sp_time[0], 10);
				i_second_parts = parseInt(sp_time[1], 10);

				//console.log('i_seconds ' + i_seconds);
				//console.log('i_second_parts ' + i_second_parts);

				var text = line.substr(15);
				//console.log('text ' + text);

				res.push([[i_seconds, i_second_parts], text]);
			}
		}
		callback(null, res);

	});
}

var dmesg_select_usb_wlan = function(dmesg) {
	var c, l, line, text;
	var res = [];
	for (c = 0, l = dmesg.length; c < l; c++) {
		line = dmesg[c];
		text = line[1];
		//console.log('text', text);
		if (text.substr(0, 4) === 'usb ') {
			res.push(line);
		}
		if (text.substr(0, 4) === 'wlan') {
			res.push(line);
		}
	}
	return res;
}

var dmesg_select_wlan_products = function(dmesg) {
	var c, l, line, text, pos1, pos2, t1, t2;
	var res = [];
	var product_name, usb_address;

	for (c = 0, l = dmesg.length; c < l; c++) {
		line = dmesg[c];
		text = line[1];
		//console.log('text', text);
		if (text.substr(0, 4) === 'usb ') {
			//res.push(line);
			t1 = 'Product: ';
			pos1 = text.indexOf(t1);
			if (pos1 > -1) {
				pos1 = pos1 + t1.length;
				product_name = text.substr(pos1).trim();

				//console.log('product_name', product_name);
				if (product_name.toLowerCase().indexOf('wlan') > -1) {
					//console.log('text', text);
					pos2 = text.indexOf(':');
					usb_address = text.substring(4, pos2);

					//console.log('usb_address', usb_address);

					res.push([usb_address, product_name]);

				}
			}
		}
		//if (text.substr(0, 4) === 'wlan') {
		//	res.push(line);
		//}
	}
	return res;
}

// Want to get the mac addresses too.
//  They can be correlated to the ifconfig results.

var dmesg_select_usb_addresses_which_have_mac_addresses = function(dmesg) {
	var c, l, line, text, pos1, pos2, t1, t2;
	var res = [];
	var product_name, usb_address;

	for (c = 0, l = dmesg.length; c < l; c++) {
		line = dmesg[c];
		text = line[1];
		//console.log('text', text);
		if (text.indexOf('MAC Address ') > -1) {
			//res.push(line);
			pos2 = text.indexOf(':');
			usb_address = text.substring(4, pos2);

			//console.log('usb_address', usb_address);

			res.push(usb_address);
		}
		//if (text.substr(0, 4) === 'wlan') {
		//	res.push(line);
		//}
	}
	return res;
}

var dmesg_select_usb_addresses_with_mac_addresses = function(dmesg) {
	var c, l, line, text, pos1, pos2, pos3, t1, t2;
	var res = [];
	var product_name, usb_address, mac_address;

	for (c = 0, l = dmesg.length; c < l; c++) {
		line = dmesg[c];
		text = line[1];
		t1 = 'MAC Address ';
		pos1 = text.indexOf(t1);
		//console.log('text', text);
		if (pos1 > -1) {
			pos1 = pos1 + t1.length;
			//res.push(line);
			pos3 = text.indexOf(' = ', pos1) + 3;
			mac_address = text.substr(pos3);

			pos2 = text.indexOf(':');
			usb_address = text.substring(4, pos2);

			//console.log('usb_address', usb_address);

			res.push([usb_address, mac_address]);
		}
		//if (text.substr(0, 4) === 'wlan') {
		//	res.push(line);
		//}
	}
	return res;
}


var dmesg_select_usb_device_numbers = function(dmesg) {
	var c, l, line, text, pos1, pos2, t1, t2;
	var res = [];
	var str_device_number, device_number, usb_address;

	t1 = 'new high-speed USB device number ';

	for (c = 0, l = dmesg.length; c < l; c++) {
		line = dmesg[c];
		text = line[1];
		//console.log('text', text);
		pos1 = text.indexOf(t1);
		if (pos1 > -1) {
			pos1 = pos1 + t1.length;
			//res.push(line);
			pos2 = text.indexOf(' ', pos1);

			str_device_number = text.substring(pos1, pos2);
			//console.log('str_device_number', str_device_number);
			device_number = parseInt(str_device_number, 10);

			//console.log('device_number ', device_number);

			pos2 = text.indexOf(':');
			usb_address = text.substring(4, pos2);

			//console.log('usb_address', usb_address);

			res.push([usb_address, device_number]);
		}
		//if (text.substr(0, 4) === 'wlan') {
		//	res.push(line);
		//}
	}
	return res;

}

var get_dmesg_wifi_view = function(callback) {
	get_dmesg(function(err, dmesg) {
		if (err) {
			throw err;
		} else {

			// This is talking about known MAC addresses here.
			//  Perhaps the lsusb -v would say the MAC addresses.


			//console.log('dmesg', dmesg);
			var relevant_dmesg = dmesg_select_usb_wlan(dmesg);
			console.log('relevant_dmesg', relevant_dmesg);

			var wlan_products = dmesg_select_wlan_products(relevant_dmesg);
			console.log('wlan_products', wlan_products);

			var usb_addresses_which_have_mac_addresses = dmesg_select_usb_addresses_which_have_mac_addresses(relevant_dmesg);
			console.log('usb_addresses_which_have_mac_addresses', usb_addresses_which_have_mac_addresses);

			var map_usb_addresses_which_have_mac_addresses = {};

			for (c = 0, l = usb_addresses_which_have_mac_addresses.length; c < l; c++) {
				map_usb_addresses_which_have_mac_addresses[usb_addresses_which_have_mac_addresses[c]] = true;
			}

			var usb_addresses_without_mac_addresses = [];

			for (c = 0, l = wlan_products.length; c < l; c++) {
				if (!map_usb_addresses_which_have_mac_addresses[wlan_products[c][0]]) usb_addresses_without_mac_addresses.push(wlan_products[c][0]);
				//map_usb_addresses_with_mac_addresses[usb_addresses_with_mac_addresses[c]] = true;
			}

			console.log('usb_addresses_without_mac_addresses', usb_addresses_without_mac_addresses);

			var device_numbers = dmesg_select_usb_device_numbers(relevant_dmesg);
			console.log('device_numbers', device_numbers);

			var usb_mac_addresses = dmesg_select_usb_addresses_with_mac_addresses(relevant_dmesg);
			console.log('usb_mac_addresses', usb_mac_addresses);

			// Let's reset the one without the mac address.







		}
	})
}

/*
var uccm = new USB_Connection_Change_Monitor();


uccm.on('connect', function(physical_usb_address, device_number) {
	console.log('connect physical_usb_address, device_number', physical_usb_address, device_number);
});

uccm.on('disconnect', function(physical_usb_address, device_number) {
	console.log('disconnect physical_usb_address, device_number', physical_usb_address, device_number);
});
*/

var get_sys_class_net_addresses = function(callback) {
	exec('ls -l /sys/class/net/', function (error, stdout, stderr) {
		var lines = stdout.split('\n');
		var line, pos1, pos2, t1, t2;

		var network_interface_name;

		var res = {};
		var fs_path;

		each(lines, function(line) {
			pos1 = line.indexOf(' -> ');
			if (pos1 > -1) {
				pos2 = line.lastIndexOf(' ', pos1 - 1);
				network_interface_name = line.substring(pos2 + 1, pos1);

				//console.log('network_interface_name', network_interface_name);

				pos1 = line.indexOf('../..', pos2) + 5;
				t1 = line.substr(pos1);
				fs_path = '/sys' + t1;

				//console.log('fs_path', fs_path);
				//res.push(

				//res.push([network_interface_name, fs_path]);;
				res[network_interface_name] = fs_path;
			}

		});
		callback(null, res);
	});
}

var get_wlan_phys_from_class_net_address = function(class_net_address, callback) {
	var command = 'ls -l ' + class_net_address;
	//console.log('command ' + command);
	exec(command, function (error, stdout, stderr) {
		//console.log('stdout ', stdout);
		var lines = stdout.split('\n');
		var line, pos1, pos2, t1 = 'phy80211 -> ', t2;

		var phys;

		//var res = {};
		var fs_path;

		each(lines, function(line) {
			pos1 = line.indexOf(t1);
			//console.log('pos1 ', pos1);
			if (pos1 > -1) {
				pos1 += t1.length;

				t2 = line.substr(pos1);

				pos2 = t2.lastIndexOf('/') + 1;
				phys = t2.substr(pos2);

				//console.log('phys', phys);


			}

		});
		callback(null, phys);
	});
}

var get_wlan_phys_pairs = function(callback) {
	get_sys_class_net_addresses(function(err, class_addresses) {
		if (err) { throw err } else {
			//console.log('class_addresses', class_addresses);

			// then for all of the wlan ones

			var fns = Fns();

			var res = {};



			each(class_addresses, function(file_path, interface_name) {
				//console.log('file_path', file_path);
				//console.log('interface_name', interface_name);

				if (interface_name.substr(0, 4) == 'wlan') {
					fns.push([get_wlan_phys_from_class_net_address, [file_path], function(err, res_single) {
						//console.log('res_single', res_single);

						res[interface_name] = res_single;
					}]);
				}

			});

			fns.go(function(err, res_all) {
				if (err) { throw err; } else {
					//console.log('res_all', res_all);
					callback(null, res);
				}
			});

		}
	})

}


module.exports = {
	'USB_Connection_Change_Monitor': USB_Connection_Change_Monitor,
	'get_dmesg_wifi_view': get_dmesg_wifi_view,
	'get_sys_class_net_addresses': get_sys_class_net_addresses,
	'get_wlan_phys_pairs': get_wlan_phys_pairs
}


/*
var tail = exec("tail", ["-f", '/var/log/{messages,kernel,dmesg,syslog}']);
console.log("start tailing");

tail.on("stdout", function (data) {
	//sys.puts(data);
	console.log('data', data);
});
*/
