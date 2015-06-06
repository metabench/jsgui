
var jsgui = require('../../../ws/js/core/jsgui-lang-util');
var each = jsgui.eac;
var Fns = jsgui.Fns;
var Evented_Class = jsgui.Evented_Class;

//var fs2 = require('./jsgui/js/fs/jsgui-node-fs2-core');

var fs2 = require('../../../ws/js/fs/jsgui-node-fs2-core');
var process = require('child_process');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;


// iw wlan0 info
// iw dev

// Needs to be able to correlate other info from USB with network scan data.

// iw list would be useful for getting info about what the devices support.

// get_device_channel_frequencies
//  need to know if these are the ones allowed by region... 'iw list' gives less ambiguous info about that, also what current support is.

// iwlist scan
//  shows the quality as well as the signal level
//   I think it should be done just after iw list.
//  This seems to show the most recent scan results, with the scans seemingly being done on a fairly constant basis.


// May get different scan results on different wifi devices.
//  Some may have directional antannae attached. Could use point-to-point directional on 1 antenna, and have omni on another.
//   Omni may be enough to get low bandwidth connection at range when the other antenna is directional.





var iw_iwlist_scan = function(wlan_device_name, callback) {
	// Just do the iw scan first, we don't look at the results.
	// then look at the iwlist scan

	// sudo iw wlan0 scan
	// iwlist wlan0 scan

	exec('sudo iw ' + wlan_device_name + ' scan', function (error, stdout, stderr) {
		// then iwlist, and parse the results.
		//  we will have different networks found of various strengths.
		//  iwlist scan provides data like 'Quality=20/70  Signal level=-90 dBm', which involves the signal/noise ratio too.
		//   that quality measurement would be nice in a graph but I don't know how requently these measurements would get updated.
		//    that's worth staying aware of. Something that is being tasked with scanning won't be able to perform its normal wifi dutues as well
		//     (unless those tasks involve constant scanning).


		exec('iwlist ' + wlan_device_name + ' scan', function (error, stdout, stderr) {
			console.log('stdout', stdout);
		}

	};

}


var iw_list = function(callback) {
	exec('iw list', function (error, stdout, stderr) {
		var phy_name, obj_phy;

		var tx1, tx2, tx3, tx4, tx5, tx6;
		var pos1, pos2, pos3, pos4, pos5, pos6;

		var t1 = 'Wiphy ', lt1 = t1.length;
		var t2 = '	Band ', lt2 = t2.length;
		var t3 = '		Capabilities: ', lt3 = t3.length;
		var t4 = '			', lt4 = t4.length;
		var t5 = '		Frequencies:', lt5 = t5.length;

		var band_num, band;

		var res = [];

		var parsing;

		var capabilities;
		var s_freq, mhz, str_channel, channel, permitted_power;

		var lines = stdout.split('\n');
		each(lines, function(line) {
			//console.log('line', line);

			var parse_phy_start = function(line) {
				phy_name = line.substr(lt1);
				console.log('phy_name', phy_name);

				if (obj_phy) {
					res.push(obj_phy);
				}
				obj_phy = {
					'phy_name': phy_name,
					'bands': []
				};
			}

			var parse_band_start = function(line) {
				//console.log('line ' + line);

				band_num = parseInt(line.substring(lt2, line.length - 1), 10);
				console.log('band_num', band_num);

				band = {
					'num': band_num
				};
				obj_phy.bands.push(band);



				//obj_phy.band_num = band_num;


			}

			var parse_capability = function(capability) {
				//console.log('capability ' + capability);
				capabilities.push(capability);
			}

			var parse_frequency = function(frequency) {
				//console.log('capability ' + capability);
				frequency = frequency.substr(2);

				s_freq = frequency.split(' ');

				mhz = parseInt(s_freq[0], 10);
				//str_channel =

				channel = parseInt(s_freq[2].substr(1).substr(0, s_freq[2].length - 2), 10);

				limit = s_freq[3].substr(1).substr(0, s_freq[3].length - 1).split(')').join('');
				//limit = limit.split(')').join('');

				//console.log('limit', limit);


				frequencies.push([mhz, channel, limit]);
			}

			var parse_indented_line = function(line) {
				tx1 = line.substr(lt4);
				//console.log('tx1 ', tx1);

				if (parsing === 'capabilities') {
					parse_capability(tx1);
				}

				if (parsing === 'frequencies') {
					parse_frequency(tx1);
				}
			}

			var parse_capabilities_start = function(line) {
				var capabilities_id = line.substring(lt3);
				//console.log('capabilities_id', capabilities_id);
				parsing = 'capabilities';
				capabilities = band.capabilities = [];
				obj_phy.capabilities_id = capabilities_id;
			}

			var parse_frequencies_start = function(line) {
				//var capabilities_id = line.substring(lt3);
				//console.log('capabilities_id', capabilities_id);
				parsing = 'frequencies';
				frequencies = band.frequencies = [];
				//obj_phy.frequencies = frequencies;
			}

			if (line.substr(0, lt1) === t1) {
				parse_phy_start(line);

			}

			if (line.substr(0, lt2) === t2) {
				parse_band_start(line);

			}

			if (line.substr(0, lt3) === t3) {
				parse_capabilities_start(line);

			} else {
				if (line.substr(0, lt4) === t4) {
					parse_indented_line(line);

				} else {
					// Look for other parsing starters...
					// 		Frequencies:
					// want to put the frequencies in a programmer-friendly object.

					if (line.substr(0, lt5) === t5) {
						parse_frequencies_start(line);

					} else {
						parsing = null;
					}




				}
			}







			// 	Band
		});
		res.push(obj_phy);

		callback(null, res);

	});
}

module.exports = {
	'iw_list': iw_list,
	'iw_iwlist_scan': iw_iwlist_scan
}
