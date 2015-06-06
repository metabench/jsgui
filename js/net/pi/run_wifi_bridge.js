var wicomms = require('./wicomms');

var backup_config_files = wicomms.backup_config_files;
var restore_config_from_backup = wicomms.restore_config_from_backup;
var start_config = wicomms.start_config;
var run_config_sh = wicomms.run_config_sh;

// This could make more granular changes.
//  However, this basic system seems to work reliably.

// A different system, polyconfig, would be better at seeing what the state is and coordinating config changes.
// Want it to plan a smooth change, so does not do DHCP release on something that it does not need to release, or reset network devices it can leave unchanged, or
//  apply a small change to. Start or restart a service as needed.

// Could have an object that represents the whole system? Represents a RPi node that could be a part of a bigger system.




run_config_sh('wifi_bridge', function(err, res_start) {
	if (err) { throw(err); } else {
		console.log('res_start', res_start);
	}
});
