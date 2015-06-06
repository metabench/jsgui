
var jsgui = require('../../core/jsgui-lang-util');
var each = jsgui.eac;
var Fns = jsgui.Fns;
var Evented_Class = jsgui.Evented_Class;

var fs2 = require('../../fs/jsgui-node-fs2-core');
var process = require('child_process');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var wicomms = require('./wicomms');
var system_monitor = require('./system_monitor');

var backup_config_files = wicomms.backup_config_files;
var restore_config_from_backup = wicomms.restore_config_from_backup;
var start_config = wicomms.start_config;


// Want this to do a quick, but detailed sense of what's on the USB.
// will parse the lsusb-v output.

// This is how the more complicated system (that is simpler to use) will get things done.

// See what changes need to be made, plan the changes, make them.

// For the moment will extract the most interesting / critical data.

// Have this scan see what's available with the wireless scan?

// Scanning the wirelss networks would take longer.
// Should probably be included as part of a relatively full scanning process.

// iw wlan0 info

// ls -l /sys/class/net/
//  gives info about paths that tell us more about the devices, and are some of their code in operation.

// ls -l /sys/devices/platform/bcm2708_usb/usb1/1-1/1-1.4/1-1.4:1.0/net/wlan0
//  includes info such as 'lrwxrwxrwx 1 root root    0 May 23 15:17 phy80211 -> ../../ieee80211/phy0'

// Need to precisely know what functionalities and abstractions are tied to the USB device.

// Need to work out what has been assigned within Linux.
//  Probably don't need a very large amount of info, but some if the Linux info is disjointed and hard to correlate at first.


var map_adapters = {
	'148f:5572': {
		'name': 'Ralink RT5572',
		'chipset': 'RT5572',
		'manufacturer': 'Ralink',
		'bands': [2.4, 5]
	}
}

// Want a version that interprets the code.
// May be running the code remotely.

// However, we could do a lot by copying over the newest iojs, and doing npm install jsgui
//  For the moment that will include the interface stuff and possibilities of doing further config once it's running as a server on the machine.


var parse_res_scan_devices = function(str_output) {
	var stdout = str_output;
	console.log('stdout', stdout);
	var lsusb_lines = stdout.split('\n');
	console.log('lsusb_lines.length ' + lsusb_lines.length);


	var current_device;
	var devices = [];
	var new_device;


	var n_bus, n_device, id, name;

	var pos1, pos2, pos3, pos4, pos5, pos6, t1, t2, t3, t4, r1, r2;

	var parse_new_device_line = function(line) {
		t1 = 'Bus ';
		t2 = ' Device ';
		t3 = ': ';

		pos1 = t1.length;
		pos2 = pos1 + 3;
		pos3 = pos2 + t2.length;
		pos4 = pos3 + 3;
		pos5 = pos4 + 5;
		pos6 = pos5 + 9;
		pos7 = pos6 + 1;

		n_bus = parseInt(line.substring(pos1, pos2), 10);
		n_device = parseInt(line.substring(pos3, pos4), 10);
		id = line.substring(pos5, pos6);
		name = line.substring(pos7);

		console.log('n_bus', n_bus);
		console.log('n_device', n_device);
		console.log('id', id);
		console.log('name', name);

		new_device = {
			'n_bus': n_bus,
			'n_device': n_device,
			'id': id,
			'name': name
		};

		if (map_adapters[id]) {
			new_device.info = map_adapters[id];
		}

		if (current_device) {
			devices.push(current_device);

		}
		current_device = new_device;


	}

	var parse_max_power_line = function(line) {
		//console.log('line ' + line);
		pos1 = line.indexOf('MaxPower') + 8;
		r1 = line.substr(pos1).trim();
		//console.log('r1', r1);
		current_device.max_power = r1;

	}

	each(lsusb_lines, function(line) {

		if (line.substr(0, 4) === 'Bus ') {
			// it's a new device line
			parse_new_device_line(line);

		}
		if (line.indexOf('MaxPower') > -1) {
			parse_max_power_line(line);
		}
	})
	devices.push(current_device);

	return devices;
}

var scan_devices = function(callback) {
	exec('lsusb -v', function (error, stdout, stderr) {
		console.log('stdout', stdout);

		var lsusb_lines = stdout.split('\n');
		console.log('lsusb_lines.length ' + lsusb_lines.length);


		var current_device;
		var devices = [];
		var new_device;


		var n_bus, n_device, id, name;

		var pos1, pos2, pos3, pos4, pos5, pos6, t1, t2, t3, t4, r1, r2;

		var parse_new_device_line = function(line) {
			t1 = 'Bus ';
			t2 = ' Device ';
			t3 = ': ';

			pos1 = t1.length;
			pos2 = pos1 + 3;
			pos3 = pos2 + t2.length;
			pos4 = pos3 + 3;
			pos5 = pos4 + 5;
			pos6 = pos5 + 9;
			pos7 = pos6 + 1;

			n_bus = parseInt(line.substring(pos1, pos2), 10);
			n_device = parseInt(line.substring(pos3, pos4), 10);
			id = line.substring(pos5, pos6);
			name = line.substring(pos7);

			console.log('n_bus', n_bus);
			console.log('n_device', n_device);
			console.log('id', id);
			console.log('name', name);

			new_device = {
				'n_bus': n_bus,
				'n_device': n_device,
				'id': id,
				'name': name
			};

			if (map_adapters[id]) {
				new_device.info = map_adapters[id];
			}

			if (current_device) {
				devices.push(current_device);

			}
			current_device = new_device;


		}

		var parse_max_power_line = function(line) {
			//console.log('line ' + line);
			pos1 = line.indexOf('MaxPower') + 8;
			r1 = line.substr(pos1).trim();
			//console.log('r1', r1);
			current_device.max_power = r1;

		}

		each(lsusb_lines, function(line) {

			if (line.substr(0, 4) === 'Bus ') {
				// it's a new device line
				parse_new_device_line(line);

			}
			if (line.indexOf('MaxPower') > -1) {
				parse_max_power_line(line);
			}
		})
		devices.push(current_device);

		//console.log('devices', devices);

		// Want to get the device numbers.

		system_monitor.get_dmesg_wifi_view(function(err, res_wifi_view) {
			if (err) { throw err; } else {
				console.log('res_wifi_view ', res_wifi_view);
				callback(null, devices);
			}
		})



	});

	// The scan devices could also look at the dmesg data to see where any of the devices have been assigned.



};

// Also want to look at the logs to see which of these have been assigned to any logical device such as wlan0, wlan1



module.exports = {
	'scan_devices': scan_devices,
	'parse_res_scan_devices': parse_res_scan_devices
};
