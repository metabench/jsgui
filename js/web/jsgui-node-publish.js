// A module to publish packages being developed to npm.
// npm publish --force from within the right directory.
//  May use command line.
//  Could put together a bunch of command line instructions, and execute them.

// will need to find the folders where there is a package.json file.
//  could perhaps do a bit of validation on them.

// Interested in having some code that tests a bunch of files.

// Publish the various packages to npm

// Pushing them to Github may be a bit more complicated.

// Also may want to track versions myself in the app?

// Want fast and convenient updates.
// Could consult notes in the package files about what the latest changes are.

// Have misc deploy now


// I'm thinking that publish-resource would be useful.
//  It opens up a resource with an HTTP interface.












var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
	//paths: {
    //    "some": "some/v1.0"
    //},
    nodeRequire: require
});

requirejs(['jsgui-lang-essentials', 'jsgui-node-fs2-core', 'fs', 'async', 'child_process'],
function (jsgui, fs2, fs, async, child_process) {
    
	var j = jsgui;
	var stringify = jsgui.stringify;
	var mapify = jsgui.mapify, is_defined = jsgui.is_defined;
	var each = jsgui.each, tof = jsgui.tof;
	
	var path_packages = '../../github';

	var path_js = './';
	
	var package_js_file_map = {};
    var call_multiple_callback_functions = jsgui.call_multiple_callback_functions;
    // var exec = require('child_process').exec;
    
    var exec = child_process.exec;
    // exec("pwd", function (error, stdout, stderr) {
    
    
    // also want to get the info about javascript files in subfolders of the packet folder.
    // may filter by prefix
    // may be within a lib directory too.
    
    // fs2.dir_files_by_extension with a recursive directory traversal, depth 1.
    
    // get all the directories in the path_packages dir.
    
    //var filter = /^jsgui-node/;
    
    // maybe could tell it just to look for directories.
    var filter = /^jsgui-/;
    
    var publish_package_dir = function(source_path, callback) {
        // exec source_path/npm publish --force
        
        var str_command = 'npm publish --force';
        //var str_command = source_path + '/npm publish --force';
        console.log('str_command ' + str_command);
        
        exec(str_command, {
            'cwd': source_path
        }, function(err, stdout, stderr) {
            if (err) {
                throw err;
            } else {
                callback(null, true);
            }
        });
        
    }
    
    
    
    fs2.dir_contents(path_packages, filter, function(err, packages_dir_contents) {
        if (err) {
            throw err;
        } else {
            
            console.log('packages_dir_contents ' + stringify(packages_dir_contents));
            var dirs = packages_dir_contents.directories;
            
            // then for each directory, 
            
            //  async library
            // async.parallelLimit(tasks, limit, [callback])
            
            var fns = [];
            
            // async library does not seem to handle functions with parameters.
            // think we'll do call multiple - and then make that able to process in parallel with a limit.
            //  would be good doing maybe 6 or 12 at once.
            
            // would be very nice to only publish the ones that have changed.
            
            
            each(dirs, function(i, dir) {
                var package_dir_path = path_packages + '/' + dir;
                
                fns.push([publish_package_dir, [package_dir_path]]);
                
                
            });
            
            // 6 network calls in parallel...
            
            call_multiple_callback_functions(fns, 6, function(err, res_multi) {
                console.log('done publish on all');
            });
            
            
            
        }
    })
    
	        
	 
	// Want to be able to publish just the ones that have changed.
	//  Could also work with incrementing version numbers before publishing.
	
	
	
	
	
	
	// look at the github probject names
	
	// look at the javascript files in the root of the github projects
	
	// match any with any in the js path
	
	// see if there are more recent ones from the github projects.
	// copy over the ones from the github projects.
	
	// want to get a list of directories.
	
	// This will actually do the update for the moment... but want things working in a parameterised way too.
	
	
	// for all local files, create a true map of which files names are used
	
	// for all local files, identify which have got corresponding packages
	
	// for all packages, make a map of js file names in root dir
	
	// for all packages, and the js files in the root directory, identify the corresponding local files
	
	
	
	
	
	
	
	
	//var fs = require('fs');
    //fs.createReadStream('test.log').pipe(fs.createWriteStream('newLog.log'));
	
});