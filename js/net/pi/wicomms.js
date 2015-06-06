
var jsgui = require('../../core/jsgui-lang-util');
var each = jsgui.eac;
var Fns = jsgui.Fns;
var fs2 = require('../../fs/jsgui-node-fs2-core');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var config_files = [
	'/etc/network/interfaces',
	'/etc/wpa_supplicant/wpa_supplicant.conf',
	'/etc/hostapd/hostapd.conf',
	'/etc/default/hostapd',
	'/etc/udhcpd.conf',
	'/etc/dnsmasq.conf',
	'/etc/dhcp/dhcpd.conf',
];

// Should maybe have code for changing the country, or editing the country's allowed channels (maybe only for LL).
// sudo iw reg get
// iwlist wlan1 channel
// sudo iw reg set BO
// iwlist wlan1 channel
// sudo iwconfig wlan1 txpower 30
// sudo iwlist wlan1 scan | grep Frequency | sort | uniq -c | sort -n



// 'copy_file': function(source_path, dest_path, callback) {

var backup_config_files = function(backup_name, callback) {
	// may as well do this as a series of instructions with Fns
	// copy all of the files to be backed up to their new locations.
	/*
	var fns = new Fns();
	each(config_files, function(config_file) {

	});

	fns.push([fs2.copy_file, []]);
	*/

	var escaped_file_name, escaped_file_path;

	var dest_root = './configs/' + backup_name + '/';
	fs2.dir_ensure(dest_root, function(err, exists_path) {
		if (err) {
			callback(err);
		} else {
			var fns = new Fns();
			each(config_files, function(config_file) {
				escaped_file_name = config_file.split('/').join('[*~|~*]');
				escaped_file_path = dest_root + escaped_file_name;

				fns.push([fs2.copy_file, [config_file, escaped_file_path]]);
			});

			fns.go(function(err, res_all) {
				if (err) {
					callback(err);
				} else {
					//console.log('completed file copies');
					callback(null, true);
				}
			});
		}
	});

}

var restore_config_from_backup = function(backup_name, callback) {
	// need to read through the files in that backup directory.
	// For the moment, they are all backed up configuration files. Probably should keep it that way.

	// dir_contents
	var escaped_file_name, escaped_file_path;

	var source_root = './configs/' + backup_name + '/';

	var source_file_name;

	fs2.dir_contents(source_root, function(err, res_contents) {
		if (err) {
			callback(err);
		} else {
			//console.log('res_contents', backup_file_names);
			var backup_file_names = res_contents.files;
			var fns = new Fns();

			each(backup_file_names, function(backup_file_name) {
				//console.log('backup_file_name', backup_file_name);
				var pos1, pos2, backup_escaped_path;

				pos1 = backup_file_name.indexOf('[*~|~*]');

				if (pos1 > -1) {
					// Ignoring another file, such as setup.sh which may be there.
					backup_escaped_path = backup_file_name.substr(pos1);
					source_file_name = backup_escaped_path.split('[*~|~*]').join('/');
					//console.log('source_file_name', source_file_name);
					fns.push([fs2.copy_file, [backup_file_name, source_file_name]]);
				}

			});

			fns.go(function(err, res_all) {
				if (err) {
					callback(err);
				} else {
					//console.log('completed file copies');
					callback(null, true);
				}
			});
			// then for each of those files, we work out their original path, and copy it back.

		}
	});
}

var run_config_sh = function(config_name, callback) {
	var source_root = './configs/' + config_name + '/';
	var sh_file_path = source_root + config_name + '.sh';
	// then we run that sh file.

	console.log('pre exec sh_file_path', sh_file_path);

	/*
	exec('sh ' + sh_file_path, function (error, stdout, stderr) {
		if (error) {
			callback(error);
		} else {
			console.log('stderr', stderr);
			console.log('stdout', stdout);
		}
	});
	* */

	var child = exec('sh ' + sh_file_path);



	child.stdout.on('data', function(data) {
		console.log('stdout: ' + data);
	});
	child.stderr.on('data', function(data) {
		console.log('stdout: ' + data);
	});
	child.on('close', function(code) {
		console.log('closing code: ' + code);
		callback(null, true);
	});

	// Not sure this one really ends


}

var start_config = function(config_name, callback) {
	var source_root = './configs/' + config_name + '/';

	// restore the file backups, then run the .sh script.
	restore_config_from_backup(config_name, function(err, res_restored) {
		if (err) {
			callback(err);
		} else {
			run_config_sh(config_name, callback);


		}
	})

}

// would be nice to use some command line arguments, like bcakup and restore.
//  however, this system will have saved config sets for the moment.

// Would be good to have a configuration viewer app as well.


var wicomms = {
	'backup_config_files': backup_config_files,
	'restore_config_from_backup': restore_config_from_backup,
	'start_config': start_config,
	'run_config_sh': run_config_sh
}

module.exports = wicomms;
