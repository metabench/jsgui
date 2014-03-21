// can see if define is defined or not.

// The data enhancements are getting on for fairly large.
//  But will definitely help the project scale.
//  Likely to be integrating b+ trees at a very core level.

// Tests going well... quite a bit more advanced functionality going into and working in Collection and Data_Object.
//  Iterating through collections in different orders.
//  Iterating through them by their array order,
//   or the order of an index.

// collection.iterate(index)?
// each?

// Specifying the index to iterate using?

// collection.each('index_name')?
// collection.each(index);
// collection.each(['name'])?

// Also, collection could provide access to its indexes.
//  Each index could have a name.
//  Each index is actually anower object, so we may be able to get reference to that and use it, maybe as well as named ids.




// Could have this so it only does it when running in Node.

// As well as the update module, want to publish to npm
//  Also want to push to git.

// Also copy over the tests (and source files for the tests)???
//  Not so sure about that... may need different source folders for the sources of the tests.


// could use jsgui-node-js-dev-publish-sync
//  that being an object oriented component that encapsulates the logic in separate functions.
//  it will get initialized, it will load the data about the paths, have a list of what the published modules are,
//   and use that list of published modules for the transformations.




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

requirejs(['jsgui-lang-essentials', 'jsgui-node-fs2-core', 'fs'],
function (jsgui, fs2, fs) {
    
	var j = jsgui;
	
	var stringify = jsgui.stringify;
	var mapify = jsgui.mapify, is_defined = jsgui.is_defined;
	
	var each = jsgui.each, tof = jsgui.tof;
	
	
	// to copy a file
	
	// want it so that it copies the github versions to workspace
	
	// also copy workspace versions to github.
	
	// will enable faster tdd and linking, while also enabling faster deployment of code to github, other repos, and npm.
	//  want to make it so once changes have been made in the development directory, all changed modules get pushed to 
	//  github and npm in an update. Maybe also update or reinstall globally installed npm packages that have changed.
	
	
	var path_packages = '../../github';
	
	
	var path_js = './';
	
	
	// maybe just use a jsgui command?
	//  jsgui publish dev to git, npm -update
	// could have a jsgui command line tool.
	
	
	
	
	
	// calculate which files get copied where.
	//  ie generate copying instructions.
	
	// then have something process those instructions.
	
	// to start with, will have something saying copy a bunch of newer files from the github folders over to the development directory.
	
	// also keep track of the last updated time 
	
	// want to be able to get the info on when various files were last updated...
	//  but I think this can be in fs2.
	
	// Maybe fs3 will be the one that contains a lot of things.
	//  or there can be fs2-core.
	//  fs2 would bring lots of fs2 modules together, for a whole bunch of things that can operate on the file systems.
	
	// using fs2-core would enable the data about all .js files in a directory to be obtained quickly, including the last-modified time.
	
	// compare_file_update_times?
	
	// or get the file info including last updated.
	
	// let's get the js directory json.
	
	
	
	// includes the metadata.
	
	// I think an extension filter would work as a parameter for dir_contents.
	
	var package_js_file_map = {};
	
	fs2.dir_contents(path_js, '.js', {'metadata': true, 'fs_paths': true}, function(err, js_dev_files) {
	    if (err) {
	        throw err;
	    } else {
	        console.log('js_dev_files ' + stringify(js_dev_files));
	        //throw 'stop';
	        
	        // also want to get the info about javascript files in subfolders of the packet folder.
	        // may filter by prefix
	        // may be within a lib directory too.
	        
	        // fs2.dir_files_by_extension with a recursive directory traversal, depth 1.
	        
	        // get all the directories in the path_packages dir.
	        
	        //var filter = /^jsgui-node/;
	        var filter = /^jsgui-/;
	        
	        fs2.dir_contents(path_packages, filter, function(err, res_contents) {
	            if (err) {
	                throw err;
	            } else {
	                //console.log('res_contents ' + stringify(res_contents));
	                var dirs = res_contents.directories;
	                
	                console.log('dirs ' + stringify(dirs));
	                // these dirs are essentially packages.
	                
	                var true_map_packages = {};
	                each(dirs, function(i, package_dir) {
	                    true_map_packages[package_dir] = true;
	                });
	                
	                
	                //throw 'stop';
	                // may want to get the fs paths, the full or relative paths of the dirs.
	                
	                var dir_fs_paths = [];
	                each(dirs, function(i, dir) {
	                    dir_fs_paths.push(path_packages + '/' + dir);
	                })
	                
	                console.log('dir_fs_paths ' + stringify(dir_fs_paths));
	                //throw 'stop';
	                // then use dir_contents again to look at the javascript files in there.
	                // could maybe look in a lib directory too.
	                
	                // arrayify so that the callback gets called once?
	                
	                fs2.dir_contents(dir_fs_paths, '.js', {'metadata': true, 'fs_paths': true}, function(err, res_package_root_js_files) {
	                    if (err) {
	                        throw err
	                    } else {
	                        console.log('res_package_root_js_files ' + stringify(res_package_root_js_files));
	                        
	                        // then compare the files' modification dates...
	                        
	                        // could use an option to get the fs paths.
	                        
	                        // combine the files result object.
	                        //  conbine_nested_variable?
	                        
	                        var arr_package_js_files = [];
	                        
	                        each(res_package_root_js_files, function(i, v) {
	                            console.log('files_obj ' + stringify(v));
	                            
	                            if (tof(v) == 'array') {
	                                var fs_path = a[0];
	                                var file_data = a[1];
	                            }
	                            
	                            var nested_files_obj = v.files;
	                            
	                            console.log('nested_files_obj ' + stringify(nested_files_obj));
	                            
	                            each(nested_files_obj, function(i, file) {
	                                arr_package_js_files.push(file);
	                            });
	                            
	                        })
	                        
	                        console.log('arr_package_js_files ' + stringify(arr_package_js_files));
	                        //throw 'stop';
	                        
	                        // when copying from the development files to the package files, the library references may change.
	                        //  Keeping the files in different places, as slightly different files?
	                        
	                        // Transformations between the two?
	                        //  So './jsgui-node-pixel-buffer' in dev -> 'jsgui-node-pixel-buffer'.
	                        //  
	                        
	                        
	                        
	                        var map_dev_files = {};
	                        var map_package_files = {};
	                        
	                        each(js_dev_files.files, function(i, dev_file) {
	                            console.log('');
	                            console.log('dev_file ' + stringify(dev_file));
	                        
	                            var dev_file_path = dev_file[0];
	                            var dev_file_info = dev_file[1][1];
	                            
	                            var dev_file_name = dev_file[1][0];
	                            console.log('dev_file_name ' + dev_file_name);
	                            
	                            map_dev_files[dev_file_name] = map_dev_files[dev_file_name] || [];
	                            map_dev_files[dev_file_name].push([dev_file_path, dev_file_info]);
	                            
	                        })
	                        
	                        console.log('');
	                        console.log('map_dev_files ' + stringify(map_dev_files));
	                        
	                        // then look at the package files.
	                        
	                        // will be a bit nested, and will also co-ordinate git push and npm publish --force
	                        
	                        each(arr_package_js_files, function(i, package_file) {
	                            console.log('package_file ' + stringify(package_file));
	                            
	                            var package_file_path = package_file[0];
	                            var package_file_info = package_file[1][1];
	                            
	                            var package_file_name = package_file[1][0];
	                            console.log('package_file_name ' + package_file_name);
	                            
	                            map_package_files[package_file_name] = map_package_files[package_file_name] || [];
	                            map_package_files[package_file_name].push([package_file_path, package_file_info]);
	                            
	                        })
	                        
	                        console.log('');
	                        console.log('map_package_files ' + stringify(map_package_files));
	                        //throw 'stop';
	                        // array of files that are earlier in the dev section
	                        // array of files that are earlier in the package section
	                        
	                        // files to copy between either dev or package.
	                        
	                        var arr_newer_package_names = [];
	                        var arr_newer_dev_names = [];
	                        
	                        var arr_package_names_not_dev = [];
	                        
	                        // then for all of the package files, we need to do a comparison to see if they are newer than the dev files.
	                        each(map_package_files, function(package_file_name, arr_package_files) {
	                            
	                            console.log('package_file_name ' + package_file_name);
	                            console.log('arr_package_files.length ' + arr_package_files.length);
	                            
	                            var latest_package_js;
	                            
	                            if (arr_package_files.length == 1) {
	                                latest_package_js = arr_package_files[0];
	                                
	                            } else {
	                                console.log('need to choose the latest one, perhaps it will get pushed to other packages');
	                                throw 'stop';
	                                
	                            }
	                            
	                            if (latest_package_js) {
	                                // compare it to the corresponding dev file.
	                                console.log('latest_package_js ' + stringify(latest_package_js));
	                                
	                                var corresponding_dev_js = map_dev_files[package_file_name];
	                                console.log('corresponding_dev_js ' + stringify(corresponding_dev_js));
	                                
	                                if (corresponding_dev_js) {
	                                    var latest_dev_js;
	                                    if (corresponding_dev_js.length == 1) {
	                                        latest_dev_js = corresponding_dev_js[0];
	                                    } else {
	                                        throw 'expected 1 file with name ' + package_file_name + ' in the dev folder(s)';
	                                    }
	                                }
	                                
	                                if (latest_dev_js) {
	                                    // compare the dates modified.
	                                    
	                                    //var mdate_
	                                    console.log('');
	                                    console.log('latest_dev_js ' + stringify(latest_dev_js));
	                                    
	                                    var latest_dev_path = latest_dev_js[0];
	                                    var latest_dev_js_metadata = latest_dev_js[1];
	                                    
	                                    // then do the time comparisons...
	                                    
	                                    var latest_dev_mtime = latest_dev_js_metadata.mtime;
	                                    var latest_package_mtime = latest_package_js[1].mtime;
	                                    
	                                    if (latest_dev_mtime < latest_package_mtime) {
	                                        // copy from the package.
	                                        arr_newer_package_names.push(package_file_name);
	                                    }
	                                    if (latest_dev_mtime > latest_package_mtime) {
	                                        // copy from the package.
	                                        arr_newer_dev_names.push(package_file_name);
	                                    }
	                                    
	                                   
	                                } else {
	                                    arr_package_names_not_dev.push(package_file_name);
	                                }
	                                    
	                            }
	                            
	                        });
	                        
                            console.log('arr_newer_package_names ' + stringify(arr_newer_package_names));
                            console.log('arr_newer_dev_names ' + stringify(arr_newer_dev_names));
                            //throw 'stop';
                            console.log('arr_package_names_not_dev ' + stringify(arr_package_names_not_dev));
                            
                            // then we can copy the files... but creating the copy instructions makes sense.
                            
                            // we also want to note which packages have got updated, and update them using npm and github.
                            //  not so sure about how to put in the git message for the change.
                            //  it could refer to an update_message file?
                            //  or look for an update message at the very top of the file?
                            
                            // let's copy over files...
                            
                            // we can load up these files for comparison...
                            //  or have a copy if different from transformation function.
                            
                            // with a defined doc transformation...
                            
                            // when copying files to the publishing directory, want to have references to other published projects.
                            //  that will mean transforming these documents according to what other files are available / found in the packages area.
                            
                            
                            var file_copy_instructions = [];
                            
                            each(arr_package_names_not_dev, function(i, package_not_dev) {
                                console.log('package_not_dev ' + stringify(package_not_dev));
                                
                                var arr_package_js = map_package_files[package_not_dev];
                                if (arr_package_js.length == 1) {
                                    var package_js = arr_package_js[0];
                                    console.log('package_js ' + stringify(package_js));
                                    var package_js_path = package_js[0];
                                    
                                    // and work out what the dev path for it would be
                                    
                                    var dev_path = path_js + package_not_dev;
                                    console.log('dev_path ' + dev_path);
                                    
                                    var instruction = ['copy', package_js_path, dev_path];
                                    file_copy_instructions.push(instruction);
                                }
                                
                            });
                            
                            // and put the package -> dev updates in.
                            
                            each(arr_newer_package_names, function(i, newer_package) {
                                var arr_package_js = map_package_files[newer_package];
                                if (arr_package_js.length == 1) {
                                    var package_js = arr_package_js[0];
                                    console.log('package_js ' + stringify(package_js));
                                    var package_js_path = package_js[0];
                                    
                                    // and work out what the dev path for it would be
                                    
                                    var dev_path = path_js + newer_package;
                                    console.log('dev_path ' + dev_path);
                                    
                                    var instruction = ['copy', package_js_path, dev_path];
                                    file_copy_instructions.push(instruction);
                                    
                                }
                            })
                            
                            // then copy over the newer dev files.
                            
                            // we want to transform the dev files before the comparison.
                            
                            // will involve loading these dev_js_path files over to the new location.
                            
                            // ie load the dev js file.
                            
                            // transform_js_dev_to_package
                            
                            // and then when copying from the package versions to the dev versions...
                            
                            var transform_js_for_package = function(str_dev_js) {
                                // have this arrayified so it can do multiple?
                                //  may be better to keep the filename as a key?
                                
                                // only need to look at the beginning 8k?
                                
                                // define(['jsgui-lang-essentials', 'fs', 'zlib', './CrcStream', './jsgui-node-pixel-buffer'], 
                                // ->
                                // define(['jsgui-lang-essentials', 'fs', 'zlib', './CrcStream', 'jsgui-node-pixel-buffer'],
                                //  jsgui-node-pixel-buffer is a package, CrcStream is not.
                                //  need to check which of these items in the 'define' string are packages, the ones that are lose their './'.
                                //  the ones that are not packages need to get loaded along as files, they are part of the package (check this?).
                                
                                // get the array of (matched) items in the define string.
                                
                                //console.log('str_dev_js ' + str_dev_js);
                                
                                //var rx_definitions = /define\(\['(\w|-)?'\]/
                                //var rx_definitions = /define\(\['(\w|-)+(', ?'(\w|-)+')*/
                                //var rx_definitions = /(define\(\[)'([\w-]+)(', ?)([\w-]+)/
                                //var rx_definitions = /define\(\['[\w-]+', ?[\w-]+/
                                //var rx_definitions = /define\(\['([\w-]+)'(?:, '([\w-]+)')*/
                                
                                
                                //var rx_definitions = /define\(\['([\w-]+)'(?:, '([\w-]+)')*/
                                
                                //var matches = str_dev_js.match(rx_definitions);
                                //console.log('matches ' + stringify(matches));
                                //if (matches) console.log('matches.length ' + matches.length);
                                //throw 'stop';
                                
                                // but if it is not there, we don't change it.
                                
                                //if (!matches) {
                                //    return str_dev_js;
                                //} else {
                                //    var matched_items = matches.slice(1);
                                //    console.log('matched_items ' + stringify(matched_items));
                                
                                //    throw 'stop';
                                //}
                                
                                // not using regular expressions...
                                
                                var beginning_search = 'define([';
                                var pos1 = str_dev_js.indexOf(beginning_search);
                                
                                if (pos1 > -1) {
                                    
                                    var pos2 = str_dev_js.indexOf(']', pos1);
                                    
                                    var definition = str_dev_js.substring(pos1 + beginning_search.length, pos2);
                                    
                                    definition = definition.replace(/ /g, '');
                                    definition = definition.replace(/'/g, '');
                                    
                                    console.log('definition ' + definition);
                                    
                                    var arr_definition_items = definition.split(',');
                                    console.log('arr_definition_items ' + stringify(arr_definition_items));
                                    
                                    // then with those items, we see which are packages
                                    
                                    var arr_definition_items_that_are_packages = [];
                                    var new_package_arr_definition_items = [];
                                    
                                    each(arr_definition_items, function(i, definition_item) {
                                        var orig_definition_item = definition_item;
                                        // and check for the name ending in '.js'
                                        // check for name beginning with / or having /
                                        console.log('definition_item ' + definition_item);
                                        var pos1 = definition_item.indexOf('/');
                                        if (pos1 > -1) {
                                            
                                            //throw 'stop';
                                            definition_item = definition_item.substr(pos1 + 1);
                                            //new_package_arr_definition_items.push(
                                        }
                                        console.log('definition_item ' + definition_item);
                                        if (true_map_packages[definition_item]) {
                                            arr_definition_items_that_are_packages.push(definition_item);
                                            new_package_arr_definition_items.push(definition_item);
                                        } else {
                                            new_package_arr_definition_items.push(orig_definition_item);
                                        }
                                    });
                                    
                                    console.log('arr_definition_items_that_are_packages ' + stringify(arr_definition_items_that_are_packages));
                                    console.log('new_package_arr_definition_items ' + stringify(new_package_arr_definition_items));
                                    
                                    // then come up with the new definition item text.
                                    
                                    // then come up with the new define string.
                                    
                                    var str_new_define = '';
                                    var first = true;
                                    each(new_package_arr_definition_items, function(i, def_item) {
                                        if (!first) {
                                            str_new_define = str_new_define + ', ';
                                        } else {
                                            first = false;
                                        }
                                        str_new_define = str_new_define + '\'' + def_item + '\'';
                                    });
                                    
                                    console.log('');
                                    console.log('str_new_define ' + str_new_define);
                                    console.log('');
                                    
                                    var res = str_dev_js.substr(0, pos1 + beginning_search.length) + str_new_define + str_dev_js.substr(pos2);
                                    console.log('');
                                    console.log('res ' + res);
                                    
                                    console.log('');
                                    console.log('str_dev_js ' + str_dev_js);
                                    
                                    //throw 'stop';
                                    //throw 'stop';
                                    return res;
                                } else {
                                    return str_dev_js;
                                }
                            }
                            
                            // at this stage, load all of the package JavaScript files?
                            //  then we compare the versions that are transformed to the package version with the package versions there.
                            //  when the transformed versions are different and newer, we replace the package versions with the transformed versions.
                            
                            // when the package versions are newer, we apply a reverse package transformation,
                            //  a package to dev transformation.
                            
                            // for the newer dev versions, load up the package files, compare to transformed dev versions.
                            
                            // not very good with all these loops...
                            
                            // would be better to re-organize the code.
                            // transformations section... load the dev code, transform it.
                            //  load_transform may be a useful function... it would mean that files could be loaded using the transformation.
                            //  also, could have a compare and copy routine with 2 way transform.
                            // so it gets specified how to convert from package to dev files, and back.
                            
                            // then we could do an analysis to see which of the packages' js files is not up-to-date.
                            
                            // getting things in arrays, seeing what the case is, then acting upon that.
                            //  making a series of instructions and carrying them out.
                            //  accessing the transformations from memory where needed.
                            
                            // the code base would be much better structured then, and this can incorporate code for two way transformations between
                            //  published and dev files.
                            
                            // the transformation functons may require knowledge about which files are available as packages, and which will get loaded locally.
                            //  I think good use of arrayify and mapify will help in these cases.
                            
                            // Specifying file updating and syncing when files get transformed between places.
                            //  That could be a component of its own.
                            
                            // Transforming_File_Sync
                            //  Create the transforming file sync, giving it a bunch of paths to read the files from?
                            //  Too general here, just work on the package/dev sync?
                            
                            // Want to avoid this pyramid code with lots of indentations here.
                            
                            
                            
                            
                            
                            
                            
                            
                            each(arr_newer_dev_names, function(i, newer_package) {
                                var arr_dev_js = map_dev_files[newer_package];
                                if (arr_dev_js.length == 1) {
                                    var dev_js = arr_dev_js[0];
                                    console.log('dev_js ' + stringify(dev_js));
                                    var dev_js_path = dev_js[0];
                                    console.log('dev_js_path ' + dev_js_path);
                                    //throw 'stop';
                                    // and work out what the dev path for it would be
                                    
                                    if (dev_js_path.substr(0, 2) == './') {
                                        dev_js_path = dev_js_path.substr(2);
                                    }
                                    
                                    // then look at where it occurs in the 
                                    
                                    //var dev_path = path_js + newer_package;
                                    //console.log('dev_path ' + dev_path);
                                    
                                    var arr_package_paths = map_package_files[newer_package];
                                    console.log('arr_package_paths ' + stringify(arr_package_paths));
                                    
                                    //throw 'stop';
                                    
                                    // do the comparison first...
                                    //  load the dev file, and transform it for use in the package folder.
                                    
                                    //  and load the file in the package area, and compare it to the transformed string.
                                    
                                    fs2.load_file_as_string(dev_js_path, function(err, str_dev_js_file) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            var str_js_file_transformed_for_package = transform_js_for_package(str_dev_js_file);
                                            
                                            //console.log('str_js_file_transformed_for_package ' + str_js_file_transformed_for_package);
                                            //throw 'stop';
                                            
                                            // then compare the transformed string to the package one(s).
                                            // if it is different, we do the file copy.
                                            
                                            // however, need to wait for callbacks.
                                            //  what about loading a bunch of files?
                                            
                                            // maybe code that proceeds when all of them have loaded?
                                            
                                            // load the javascript from the various packages, compare.
                                            
                                            // or do a save_if_different.
                                            
                                            // want to load all of the package javascript files...
                                            
                                            
                                            //  then will be able to read them, and create versions of
                                            
                                            fs2.load_file_as_string(arr_package_paths, function(err, arr_loaded_package_js) {
                                                if (err) {
                                                    throw err;
                                                } else {
                                                    // compare the loaded package js files to the transformed dev files.
                                                    
                                                    //var fns = new Functions();
                                                    //var fns = Functions();
                                                    //var fns = Fns();
                                                    // fns.go(callback);
                                                    
                                                    var fns = [];
                                                    
                                                    each(arr_loaded_package_js, function(loaded_package_path, loaded_package_js) {
                                                        if (loaded_package_js != str_js_file_transformed_for_package) {
                                                            // save the transformed javascript to the package path.
                                                            //  will use a function to save these various strings to disk.
                                                            // build a list of save commands...
                                                            
                                                            fns.push([fs2.save_file_as_string, [loaded_package_path, str_js_file_transformed_for_package]]);
                                                        }
                                                        
                                                    })  
                                                    throw '!stop';
                                                    call_multi(fns, function(err, res_multi) {
                                                        console.log('dev files transformed to packages and saved');
                                                    })
                                                    
                                                    // fns.execute would be a good thing...
                                                    // fns.exec? fns.go?
                                                    
                                                    
                                                }
                                                
                                            });
                                            
                                            
                                            
                                            
                                            
                                            
                                            
                                            
                                        }
                                    })
                                    
                                    each(arr_package_paths, function(i, path) {
                                        console.log('path ' + stringify(path));
                                        var instruction = ['copy', dev_js_path, path[0]];
                                        file_copy_instructions.push(instruction);
                                    });
                                    
                                    //var instruction = ['copy', package_js_path, dev_path];
                                    //file_copy_instructions.push(instruction);
                                    //throw 'stop';
                                    
                                }
                                
                            })
                            
                            console.log('file_copy_instructions ' + stringify(file_copy_instructions));
                            
                            fs2.instruct(file_copy_instructions, function(err, res_instructions) {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log('copied files');
                                }
                            })
	                        
	                    }
	                })
	                
	            }
	        })
	        
	        
	        
	        
	        
	        
	    }
	})
	
	
	
	
	
	
	
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