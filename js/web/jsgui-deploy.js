var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require
});
requirejs(['module', 'path', 'jsgui-lang-util', 'fs', 'fs2'], function (module, path, jsgui, fs, fs2) {
	var exec = require('child_process').exec;
	var stringify = jsgui.stringify, fp = jsgui.fp, tof = jsgui.tof, extend = jsgui.extend, is_defined = jsgui.is_defined, str_arr_mapify = jsgui.str_arr_mapify, each = jsgui.each;
	var call_multiple_callback_functions = jsgui.call_multiple_callback_functions;


	var deploy = {
		'git_add': function(arr_items, callback){
			var items_str = arr_items.join(' ');
			var command = 'git add ' + items_str;
			exec(command, function(err, res){
				callback(err, res);
			});
		},
		'git_commit': function(message, callback) {
			var command = 'git commit -m "' + message + '"';
			exec(command, function(err, res){
				callback(err, res);
			});
		},
		'git_push': function(callback) {
			var command = 'git push';
			exec(command, function(err, res){
				callback(err, res);
			});
		},
		'git_push_files': function(arr_items, message, callback) {
			deploy.git_add(arr_items, function(err, res){
				console.log(err + ' ' + res);

				deploy.git_commit(message, function(err, res) {
					console.log(err + ' ' + res);
					callback(err, res);
				});

			});
		},
		'update_live': function(build_path, repo_path, commit_message, callback) {
			fs2.copy(build_path, repo_path, function(err, res){
				var cwd = process.cwd();

				process.chdir(repo_path);
				deploy.git_push_files(['.'], commit_message, function(err, res) {
					process.chdir(cwd);
				});
			});
		},
		'update_main': function(build_path, commit_message, callback) {
			fs2.copy(build_path, '.', function(err, res){
				
				deploy.git_push_files(['index.html', 'js', 'css', 'img'], commit_message, function(err, res){
					callback(err, res);
				});
			});
		}

	}

	/*deploy.update_live('build/build_57', '/root/kettlechips', 'testing', function(err, res){
		console.log(err + ' ' + res);
	})*/

	

});