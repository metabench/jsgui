var wicomms = require('./wicomms');

var backup_config_files = wicomms.backup_config_files;
var restore_config_from_backup = wicomms.restore_config_from_backup;
var start_config = wicomms.start_config;

// Should not need to restart if currently configured OK...
//  And should not need to restart some things if they are working.




start_config('wifi_bridge', function(err, res_start) {
	if (err) { throw(err); } else {
		console.log('res_start', res_start);
	}
});
