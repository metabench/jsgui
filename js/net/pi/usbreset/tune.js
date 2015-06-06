var exec = require('child_process').exec;

var get_lsusb = function(callback) {
	exec('lsusb', function (error, stdout, stderr) {
		// output is in stdout
		//console.log(stdout);
		var lines = stdout.split('\n');
		//console.log(lines.length);

		var c, l, line;
		var s_num_device, s_id, s_name;
		var num_device;
		var pos1, pos2, pos3, pos4;
		var t1, t2;

		var res = [];

		for (c = 0, l = lines.length; c < l; c++) {
		  line = lines[c];
		  
		  // On the pi, they are all on the same bus.
		  //  Return all on one bus for the moment.
		  
		  
		  if (line.substr(0, 4) === 'Bus ') {
			  //console.log('line ' + line);
			  t1 = 'Device ';
			  pos1 = line.indexOf(t1) + t1.length;
			  pos2 = pos1 + 3;
			  s_num_device = line.substring(pos1, pos2);
			  //console.log('s_num_device ' + s_num_device);
			  num_device = parseInt(s_num_device, 10);
			  //console.log('num_device ' + num_device);
			  
			  pos3 = pos2 + 5;
			  pos4 = pos3 + 9;
			  
			  s_id = line.substring(pos3, pos4);
			  //console.log('s_id ' + s_id);
			  
			  s_name = line.substring(pos4 + 1);
			  //console.log('s_name ' + s_name);
			  
			  res.push([num_device, s_id, s_name]);
			  
			  //s_num_device = line.substr(
		  }
		  
		  
		  // We can look through dmesg, and see which of the adapters has been given a MAC address.
		  //  If one has not been given a MAC address, we reset its USB port.
		  
		  
		  
		  
		}
		res.sort(function(a, b){
			//var a1= a.pears, b1= b.pears;
			if(a[0] == b[0]) return 0;
			return a[0] > b[0] ? 1: -1;
		});
		
		callback(null, res);

	});
}

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

var reset_usb_device = function(device_number) {
	
}

// Can search text for
//  new high-speed USB device number 
//  new full-speed USB device number 
//   slower
// Then read the numbers from there.

// We see which of the USB WLAN devices has got a MAC address.
//  And we reset the one that has not

// I'm not sure how these USB numbers differ from other numbers, but they are connected by a BUS and seem different.
//  We may well need these numbers to reset a USB device.







// Then want to query the dmesg lines...
//  Will specifically get the info about usb associations.
//  


// get dmesg lines, then read through them to find out what's hapenned to the USB wireless.




get_lsusb(function(err, lsusb) {
	if (err) {
		throw err;
	} else {
		console.log('lsusb', lsusb);
		
		var c, l;
		
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
})


