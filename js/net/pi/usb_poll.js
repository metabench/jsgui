
var jsgui = require('./jsgui/js/core/jsgui-lang-essentials');
var each = jsgui.eac;
var Fns = jsgui.Fns;

var fs2 = require('./jsgui/js/fs/jsgui-node-fs2-core');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var wicomms = require('./wicomms');

var backup_config_files = wicomms.backup_config_files;
var restore_config_from_backup = wicomms.restore_config_from_backup;
var start_config = wicomms.start_config;

// Seems inefficient.

// tail -f /var/log/{messages,kernel,dmesg,syslog}
//  Looks like a much better way to structure an app that responds to the Linux events.
//  Can have it fairly intelligently responding to USB changes.

var usb_poll = function() {
	exec('lsusb', function (error, stdout, stderr) {
		//console.log('stdout', stdout);
	});
}

setInterval(function() {
	usb_poll();
}, 250);
