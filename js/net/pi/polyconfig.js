/*

Allowing multiple different configurations to run, switching between them.


Need some clever programming that sets / checks various settings in Linux in order to have a desired effect.

Need to be able to switch between various configurations based on the peripherals detected, and possibly their connectivity.

Will be a bit of an AI agent (eventually) in terms of using Sense, Model, Plan, Act.
  Scans to see what the most open frequency is for an access point.
  

Making changes to, or replacing various files

Copy all of the files that are relevant to a configuration, store them
Including files that may get changed by other configs and should be changed back
File Sets basically
  Maybe about 10 config files all things included? Will replace / in the names with a special character / combination [*~|~*], and then we know where to save them back to easily, and just read the
   file names and modify them.


sudo nano /etc/udhcpd.conf
sudo nano /etc/hostapd/hostapd.conf
sudo nano /etc/default/hostapd
sudo nano /etc/udhcpd.conf
sudo nano /etc/dnsmasq.conf
sudo nano /etc/dhcp/dhcpd.conf


I may make a polling server to check for USB changes.
If it's changed into a different device configuration, it wou

*/

// Need to backup all those files, and save them to a directory with the saved configuration files.

// May be good to have some other settings apart from files in the config as well.
// Such as saying we want to run particular services on particular systems.
//  Could just copy the files and then run a shell script.
//  That probably would be simple enough as well as flexible enough.

// Want to be able to transition between wireless setups quickly and easily.
//  This app may also look at the USB devices that are plugged in to determine what settings to put in place.

var wicomms = require('./wicomms');

var backup_config_files = wicomms.backup_config_files;
var restore_config_from_backup = wicomms.restore_config_from_backup;

var usb_scan = require('./usb_scan');
var wifi_scan = require('./wifi_scan');
var system_monitor = require('./system_monitor');
var scan_devices = usb_scan.scan_devices;

// Should do a single, fiarly comprehensive scan at the beginning.
//  Looking for recognised LSA networks is a plus. That way a bridge mode could be configured.
//  Possibly also have devices transmitting whether they have an internet connection or not.
//   The ESSID name would possibly indicate that. When a node does get an internet, it could change its purpose somewhat and set itself up to share that internet connection,
//   with a network created that's for sharing internet access.

// Want to make it work with some fiarly simple configurations quickly.

// Have internet from 3g, rebroadcast it.

// Have internet from recognised wifi, rebroadcast it.
// Can find both recognised wifi, and LSA wifi, connect to the LSA wifi.

// Find other LSA node, connect to it, and set up other LSA access point.
//  Configs involving different parts of the spectrum, wifi at different signal strengths, some with directional antennae.
//  Measure signal strengths on connections, so ability to find these longer range directional connections. Minimal config to use them.

// Be able to get into the system, see a UI for it, and make a change such as saying make a particular link 5Ghz.









system_monitor.get_wlan_phys_pairs(function(err, map_wlan_phys) {
	if (err) { throw err } else {
		console.log('map_wlan_phys', map_wlan_phys);
		
		// Should do channel scan next, to see what channels are available to use on the devices.
		
		// Do a scan to see the usage of those channels.
		
		wifi_scan.iw_list(function(err, iw_list) {
			if (err) { throw err; } else {
				console.log('iw_list', JSON.stringify(iw_list, null, 2));
				
				// Worth also doing a scan to see what's currently being used.
				//  This is also where we could find friendly networks.
				
				
				
				
			}
		});
		
		
	}
})

// Then for wlan we want the phy80211 info.
//  The phy interface is mentioned and used by some commands, so we need to be able to address the devices that way too.




/*

scan_devices(function(err, res_scan_devices) {
	if (err) { throw err; } else {
		console.log('res_scan_devices', res_scan_devices);
		
		
		
		
	}
});

*/
// Want to specify different configurations here...
// System may look at the configurations, and decide which applies based on what's plugged in.
//  Could maybe have a simple interface to change some things, but I'd like it to autoconfigure as much as possible.

// Want a decent scan / sensing of what's available to start with.

/*

backup_config_files('wifi_bridge', function(err, res_backup) {
	if (err) {
		throw 'err';
	} else {
		console.log('config backup complete, res_backup', res_backup);
	}
});

*/

/*
restore_config_from_backup('backup1', function(err, res_restore) {
	if (err) {
		throw 'err';
	} else {
		//console.log('config backup restore, res_backup', res_backup);
	}
});
*/
