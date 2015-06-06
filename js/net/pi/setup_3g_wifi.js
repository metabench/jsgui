var wicomms = require('./wicomms');

var backup_config_files = wicomms.backup_config_files;
var restore_config_from_backup = wicomms.restore_config_from_backup;
var start_config = wicomms.start_config;

start_config('3g_wifi', function(err, res_start) {
	if (err) { throw(err); } else {
		console.log('res_start', res_start);
	}
});
