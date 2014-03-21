if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
 // Deploys open source software packages

    // Needs to know the package name.
    //  May want to report changes from a changelog - update a changelo file to the most recent version.
    //   Could keep a list of changes in comments at the top of a file.
    

    // Copies that out of the development system
    //  Also copies the tests
    //  Copies any necessary c / c++
    //  Copies the tests
    //   Updates the package.json file.
    // Deploy to
    //  Github
    //  npm

    // for single file packages.

    // Want to be able to deploy a single file package, automatically incrementing its version number
    //  deploy to both github and npm at once.

    // sfp_prepare_package_dir
    // sfp_deploy_prepared_dir

    


    // sfp_copy_to_github_dir
    // sfp_copy_to_github_dir_increment_package_json_version
    //  very minor increment.

    // sfp_deploy_github_dir_to_github
    //  


define(['../core/jsgui-lang-essentials.js', 'fs', '../fs/jsgui-node-fs2-core.js', 'async', 'module', 'path', 'js-beautify', 'request'],
   
    

    function(jsgui, fs, fs2, async, module, path, beautify, request) {


        var exec = require('child_process').exec, child;

    	var stringify = jsgui.stringify, Fns = jsgui.Fns, each = jsgui.each, mapify = jsgui.mapify;
        var path_parent = fs2.path_parent, path_last_part = fs2.path_last_part;

        var arr_internal_node_modules = ['child_process'];
        var get_truth_map_from_arr = jsgui.get_truth_map_from_arr;
        var map_internal_node_modules = mapify(arr_internal_node_modules);


        var increment_version_string_revision = function(strVersion) {
            var pos1 = strVersion.indexOf('.');
            if (pos1 > -1) {
                var pos2 = strVersion.indexOf('.', pos1 + 1);
                if (pos2 > -1) {
                    var theRest = strVersion.substr(pos2 + 1);
                    var iRevision = parseInt(theRest, 10);
                    console.log('iRevision ' + iRevision);
                    iRevision++;
                    var res = strVersion.substr(0, pos2 + 1) + iRevision;
                    console.log('res ' + res);
                    return res;
                }
            }
        }
        
        var package_deploy = {
            'increment_package_json_revision': function(strFilePath, callback) {
                fs2.load_file_as_string(strFilePath, function(err, res) {
                    if (err) {
                        callback(err);
                    } else {
                        var objPackage = JSON.parse(res);
                        var strVersion = objPackage.version;
                        console.log('strVersion ' + strVersion);
                        // could be in form major, minor, revision.
                        objPackage.version = increment_version_string_revision(objPackage.version);
                        var strPackage = beautify(JSON.stringify(objPackage));
                        fs2.save_file_as_string(strFilePath, strPackage, callback);
                    }
                })
            },
            'get_release_package_version_str': function(directoryPath, callback) {
                // need to get the package name first.
                // can get that from the package.json file.

                var release_package_json_path = directoryPath + '/package.json';
                fs2.load_file_as_string(release_package_json_path, function(err, strPackage) {
                    if (err) {
                        throw err;
                    } else {
                        var objPackage = JSON.parse(strPackage);
                        var strVersion = objPackage.version;
                        //return strVersion;
                        callback(null, strVersion);
                    }
                })
            },
            'get_npm_version_str': function(package_name, callback) {
                var npm_registry_url = 'http://registry.npmjs.org/';
                var npm_package_registry_url = npm_registry_url + package_name;
                //console.log('npm_package_registry_url ' + npm_package_registry_url);
                request(npm_package_registry_url, function (error, response, body) {
                    if (error) {
                        console.log('error ' + error);
                        throw error;
                    }

                    if (!error && response.statusCode == 200) {
                        //console.log(body) // Print the google web page.
                        var objPackage = JSON.parse(body);
                        var strVersion = objPackage['dist-tags'].latest;

                        //console.log('strVersion ' + strVersion);
                        //return strVersion;
                        callback(null, strVersion);

                  }
                })

            },
            'deploy_release_package_to_npm': function(directoryPath, callback) {
                var packageName = fs2.path_last_part(directoryPath);
                console.log('deploy_release_package_to_npm packageName ' + packageName);

                console.log(directoryPath + '/' + 'npm publish');

                exec('npm publish', {
                    'cwd': directoryPath
                }, function(err, resExec) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log('resExec ' + resExec);
                        callback(null, resExec);
                    }
                })
            },
            'load_release_js_changelog': function(release_package_js_file_path, callback) {
                fs2.load_file_as_string(release_package_js_file_path, function(err, strReleaseJs) {
                    if (err) {
                        callback(err);
                    } else {

                        var extract_changelogs_from_strjs = function(strJs) {
                            var pos1 = strJs.indexOf('/* Changelog:');
                            console.log('pos1 ' + pos1);
                            if (pos1 > -1) {
                                var res = {};
                                var pos2 = strJs.indexOf('*/', pos1);
                                var strChangelogsSection = strJs.substr(pos1, pos2);
                                console.log('strChangelogsSection ' + strChangelogsSection);
                                var arrSplitLines = strChangelogsSection.split('\r\n');
                                //console.log('arrSplitLines ' + stringify(arrSplitLines));
                                console.log('arrSplitLines.length ' + stringify(arrSplitLines.length));
                                var major = 0, minor = 0, revision = 0;
                                var pastVersionLine = false;
                                var arrCurrentVersionLogLines, strVersion;
                                each(arrSplitLines, function(i, clLine) {
                                    console.log('clLine ' + clLine);
                                    // run a regex on the line to see if it's got a version number,
                                    //  like major.minor.revision
                                    var m = clLine.match(/\d+.\d+.\d+/);
                                    //console.log('m ' + stringify(m));
                                    if (m) {
                                        strVersion = m[0];
                                        console.log('strVersion ' + strVersion);
                                        var splitVersion = strVersion.split('.');
                                        if (splitVersion.length == 3) {
                                            major = parseInt(splitVersion[0], 10);
                                            minor = parseInt(splitVersion[1], 10);
                                            revision = parseInt(splitVersion[2], 10);
                                            pastVersionLine = true;
                                            arrCurrentVersionLogLines = [];
                                            res[strVersion] = arrCurrentVersionLogLines;
                                        }
                                    } else if (pastVersionLine) {
                                        console.log('clLine.length ' + clLine.length);


                                        if (clLine.length > 1 && clLine.indexOf('-----') == -1
                                            && clLine.indexOf('*/') == -1) {
                                            //res[strVersion].push(clLine.substr(0, clLine.length - 1));
                                            res[strVersion].push(clLine.replace(/\t/, ''));
                                        }
                                    }
                                })
                                return res;
                            }
                        }
                        //console.log('strReleaseJs ' + strReleaseJs);
                        var changelogs = extract_changelogs_from_strjs(strReleaseJs);
                        callback(null, changelogs);
                        //console.log('changelogs ' + stringify(changelogs));
                        //return changelogs;
                    }
                })
            },

            'get_arr_cpp_refs_from_str_js': function(str_js) {
                //var unfiltered_refer
                var search1 = './build/Release/'
                var pos1 = str_js.indexOf('./build/Release');
                var pos2;
                var res = [];
                if (pos1 > 0) {
                    while (pos1 > 0) {
                        pos2 = str_js.indexOf('"', pos1);
                        console.log('pos1 ' + pos1 + ', pos2 ' + pos2);
                        var strRef = str_js.substring(pos1, pos2);
                        //console.log('strRef ' + strRef);
                        res.push(strRef);
                        pos1 = str_js.indexOf('./build/Release', pos2 + 1);
                        //throw 'stop';
                    }
                    return res;

                } else {
                    return [];
                }
            },
            // Also need to correlate these deployment refs with where there is no package found...
            //  if there is no package for a file then we will copy that file.

            'get_arr_js_unfiltered_deployment_references_original_pairs': function(str_dev_js) {
                // get unfilered with original references...
                //  gets used in another function.
                var beginning_search = 'define([';
                var pos1 = str_dev_js.indexOf(beginning_search);
                if (pos1 > -1) {
                    var pos2 = str_dev_js.indexOf(']', pos1);
                    var definition = str_dev_js.substring(pos1 + beginning_search.length, pos2);
                    definition = definition.replace(/ /g, '');
                    definition = definition.replace(/'/g, '');
                    //console.log('definition ' + definition);
                    var arr_definition_items = definition.split(',');
                    var arr_definition_items_that_are_packages = [];
                    var new_package_arr_definition_items = [];
                    var res = [];
                    each(arr_definition_items, function(i, definition_item) {
                        var orig_definition_item = definition_item;
                        console.log('1) definition_item ' + definition_item);
                        definition_item = fs2.path_last_part(definition_item);
                        definition_item = definition_item.replace(/"/g, '');
                        //throw 'stop';
                        //console.log('orig_definition_item ' +orig_definition_item);
                        //definition_item.orig = orig_definition_item + ' ';

                        //console.log('1) definition_item.orig ' + definition_item.orig);
                        /*
                        var pos1 = definition_item.indexOf('/');
                        if (pos1 > -1) {

                            //throw 'stop';
                            definition_item = definition_item.substr(pos1 + 1);
                            //new_package_arr_definition_items.push(
                        }
                        */
                        console.log('2) definition_item ' + definition_item);
                        //arr_definition_items[i] = definition_item;
                        //throw 'stop';
                        res.push([definition_item, orig_definition_item]);
                    });
                    return res;
                }

            },


            'get_arr_js_unfiltered_deployment_references': function(str_dev_js) {
                // get unfilered with original references...
                //  gets used in another function.
                var beginning_search = 'define([';
                var pos1 = str_dev_js.indexOf(beginning_search);
                if (pos1 > -1) {
                    var pos2 = str_dev_js.indexOf(']', pos1);
                    var definition = str_dev_js.substring(pos1 + beginning_search.length, pos2);
                    definition = definition.replace(/ /g, '');
                    definition = definition.replace(/'/g, '');
                    //console.log('definition ' + definition);
                    var arr_definition_items = definition.split(',');
                    var arr_definition_items_that_are_packages = [];
                    var new_package_arr_definition_items = [];
                    each(arr_definition_items, function(i, definition_item) {
                        var orig_definition_item = definition_item;
                        //console.log('definition_item ' + definition_item);
                        definition_item = fs2.path_last_part(definition_item);
                        //console.log('orig_definition_item ' +orig_definition_item);
                        //definition_item.orig = orig_definition_item + ' ';

                        //console.log('1) definition_item.orig ' + definition_item.orig);
                        /*
                        var pos1 = definition_item.indexOf('/');
                        if (pos1 > -1) {

                            //throw 'stop';
                            definition_item = definition_item.substr(pos1 + 1);
                            //new_package_arr_definition_items.push(
                        }
                        */
                        console.log('3) definition_item ' + definition_item);
                        arr_definition_items[i] = definition_item;
                        //throw 'stop';
                    });
                    return arr_definition_items;
                }

            },

            'modify_file_js_refs': function(js_file_path, fn_ref_modification, callback) {
                fs2.process_file_as_string(js_file_path, function(str_file) {
                    var res = package_deploy.modify_str_js_refs(str_file, fn_ref_modification);
                    return res;
                }, callback);
            },

            'modify_str_js_refs': function(str_dev_js, fn_ref_modification) {
                var beginning_search = 'define([';
                var pos1 = str_dev_js.indexOf(beginning_search);
                if (pos1 > -1) {
                    var pos2 = str_dev_js.indexOf(']', pos1);
                    var definition = str_dev_js.substring(pos1 + beginning_search.length, pos2);

                    definition = definition.replace(/ /g, '');
                    definition = definition.replace(/'/g, '');
                    definition = definition.replace(/"/g, '');
                    var arr_definition_items = definition.split(',');
                    var arr_definition_items_that_are_packages = [];
                    var new_package_arr_definition_items = [];
                    each(arr_definition_items, function(i, definition_item) {
                        var orig_definition_item = definition_item;
                        // and check for the name ending in '.js'
                        // check for name beginning with / or having /
                        console.log('4) definition_item ' + definition_item);
                        arr_definition_items[i] = fn_ref_modification(definition_item);
                        //throw 'stop';
                    });
                    //console.log('arr_definition_items_that_are_packages ' + stringify(arr_definition_items_that_are_packages));
                    //console.log('new_package_arr_definition_items ' + stringify(new_package_arr_definition_items));
                    // then come up with the new definition item text.
                    // then come up with the new define string.

                    var str_new_define = '';
                    var first = true;
                    each(arr_definition_items, function(i, def_item) {
                        if (!first) {
                            str_new_define = str_new_define + ', ';
                        } else {
                            first = false;
                        }
                        str_new_define = str_new_define + '"' + def_item + '"';
                    });
                    var res = str_dev_js.substr(0, pos1 + beginning_search.length) + str_new_define + str_dev_js.substr(pos2);
                    return res;
                } else {
                    return str_dev_js;
                }
            },

            'modify_dev_str_js_references_for_deployment': function(str_dev_js, map_deployment_package_names) {
                // Perhaps we need some more info, like the names of the file in the package directory
                //  (or that are going to be there.)
                // Could have a later stage where we check the references for files in that directory
                //  happens after the files have been copied.
                var stack = new Error().stack;
                console.log(stack);
                if (!map_deployment_package_names) throw 'need map_deployment_package_names';

                var beginning_search = 'define([';
                var pos1 = str_dev_js.indexOf(beginning_search);
                if (pos1 > -1) {
                    var pos2 = str_dev_js.indexOf(']', pos1);
                    var definition = str_dev_js.substring(pos1 + beginning_search.length, pos2);

                    definition = definition.replace(/ /g, '');
                    definition = definition.replace(/'/g, '');
                    //console.log('definition ' + definition);
                    var arr_definition_items = definition.split(',');
                    //console.log('arr_definition_items ' + stringify(arr_definition_items));
                    // then with those items, we see which are packages
                    var arr_definition_items_that_are_packages = [];
                    var new_package_arr_definition_items = [];
                    each(arr_definition_items, function(i, definition_item) {
                        var orig_definition_item = definition_item;
                        // and check for the name ending in '.js'
                        // check for name beginning with / or having /
                        console.log('5) definition_item ' + definition_item);
                        definition_item = definition_item.replace(/"/g, '');
                        //throw 'stop';
                        var sres = definition_item.substr(definition_item.length - 5);
                        console.log('sres ' + sres);
                        if (sres == '.node') {

                        } else {
                            // depending on the case, just use the last part of the path

                            // however, when it's referring to another file that gets copied, we need the ./

                            if (definition_item.substr(0, 2) == './') {

                                // can check to see if it's a package or not.
                                //  if the package dir folder exists
                                console.log('map_deployment_package_names ' + stringify(map_deployment_package_names));
                                // check to see it it's a found package
                                // if it is, we strip it to the last part

                                // otherwise if it's not found, we use ./ because it's an item
                                //  which will have to be copied.
                                var theRest = definition_item.substr(2);
                                var hasTheRes = map_deployment_package_names[theRest];

                                console.log('hasTheRes ' + hasTheRes);

                                if (!hasTheRes) {
                                    
                                } else {
                                    definition_item = theRest;
                                }
                                //throw 'stop';
                            } else {
                                definition_item = fs2.path_last_part(definition_item);
                            }   
                        }
                        definition_item = definition_item.replace(/\n/g, '');

                        if (definition_item.substr(0, definition_item.length - 3) == '.js') {
                            definition_item = './' +  definition_item.substr(definition_item.length - 3);
                        }
                        console.log('6) definition_item ' + definition_item);

                        // But for some of these, they will refer to an existing file.
                        
                        /*
                        var pos1 = definition_item.indexOf('/');
                        if (pos1 > -1) {

                            //throw 'stop';
                            definition_item = definition_item.substr(pos1 + 1);
                            //new_package_arr_definition_items.push(
                        }
                        */
                        //console.log('definition_item ' + definition_item);
                        arr_definition_items[i] = definition_item;
                        //throw 'stop';
                    });

                    //console.log('arr_definition_items_that_are_packages ' + stringify(arr_definition_items_that_are_packages));
                    //console.log('new_package_arr_definition_items ' + stringify(new_package_arr_definition_items));
                    // then come up with the new definition item text.
                    // then come up with the new define string.

                    var str_new_define = '';
                    var first = true;
                    each(arr_definition_items, function(i, def_item) {
                        if (!first) {
                            str_new_define = str_new_define + ', ';
                        } else {
                            first = false;
                        }
                        str_new_define = str_new_define + '"' + def_item + '"';
                    });

                    //console.log('str_new_define ' + stringify(str_new_define));
                    //throw 'stop';

                    //console.log('');
                    //console.log('str_new_define ' + str_new_define);
                    //console.log('');

                    var res = str_dev_js.substr(0, pos1 + beginning_search.length) + str_new_define + str_dev_js.substr(pos2);
                    //console.log('');
                    //console.log('res ' + res);

                    //console.log('');
                    //console.log('str_dev_js ' + str_dev_js);

                    //throw 'stop';
                    //throw 'stop';
                    return res;
                } else {
                    return str_dev_js;
                }
            },

            'modify_release_file_ensure_local_references': function(file_path, callback) {
                // call a function that uses a modification function for each reference...

                // May need to check in that directory to see what local references there are.

                // get the names of javascript files in the package directory.

                fs2.dir_contents(fs2.path_parent(file_path), '.js', function(err, arr_js_files) {
                    if (err) {
                        callback(err);
                    } else {
                        arr_js_files = arr_js_files.files;
                        var map_js_files = get_truth_map_from_arr(arr_js_files);
                        console.log('arr_js_files ' + stringify(arr_js_files));
                        package_deploy.modify_file_js_refs(file_path, function(ref) {
                            console.log('ref ' + ref);

                            if (map_js_files[ref + '.js']) {
                                // we change the reference.
                                return './' + ref;

                            } else {
                                return ref;
                            }
                            
                        }, function() {
                            //throw 'stop';
                            callback(null, true)
                        });
                    }
                })
            },

            'get_map_deployment_package_names': function(deployment_packages_path, callback) {
                console.log('deployment_packages_path ' + deployment_packages_path);
                fs2.dir_contents(deployment_packages_path, function(err, contents) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log('contents ' + stringify(contents));
                        var dirs = contents.directories;
                        var res = [];
                        each(dirs, function(i, dir) {
                            if (dir.substr(0, 1) != '_') {
                                res.push(dir);
                            }
                        })
                        //throw 'stop';
                        callback(null, res);

                    }
                })
            },

            'modify_file_release_js_references': function(file_path, deployment_packages_path, callback) {
                //if (argument)
                // need to get the package names fitst.
                package_deploy.get_map_deployment_package_names(deployment_packages_path, function(err, map_deployment_package_names) {
                    if (err) {
                        callback(err);
                    } else {
                        fs2.process_file_as_string(file_path, function(str_file) {
                            var res = package_deploy.modify_dev_str_js_references_for_deployment(str_file, map_deployment_package_names);
                            return res;
                        }, callback);
                    }
                })
            },

            'modify_directory_release_test_js_references': function(dir_path, deployment_packages_path, callback) {
                // modify the references in place.

                // want a modify file in place function.
                // get all the js files in the directory.

                fs2.dir_contents(dir_path, '.js', function(err, js_files) {
                    if (err) {
                        throw err;
                    } else {
                        js_files = js_files.files;
                        //console.log('js_files ' + stringify(js_files));

                        var fns = Fns();
                        //fns.concat()
                        each(js_files, function(i, v) {

                            fns.push([package_deploy.modify_file_release_js_references, [dir_path + '/' + v, deployment_packages_path]]);
                        });
                        fns.go(function(err, res) {
                            if (err) {
                                throw err;
                            } else {
                                //throw 'stop';
                                callback(null, true);
                            }
                        });
                    }
                })
            },

            'get_unfiltered_arr_cpp_includes_from_str_cpp': function(str_cpp) {
                // read through the file line by line...
                var arr_cpp_lines = str_cpp.split('\n');
                console.log('arr_cpp_lines.length ' + arr_cpp_lines.length);
                var res = [];

                each(arr_cpp_lines, function(i, line) {
                    // 
                    var posI = line.indexOf('#include');
                    if (posI > -1) {
                        //console.log('line ' + line);

                        var pos2 = line.indexOf('"');
                        if (pos2 > -1) {
                            var pos3 = line.indexOf('"', pos2 + 1);
                            if (pos3 > -1) {
                                var item = line.substring(pos2 + 1, pos3);
                                console.log('item ' + item);
                                res.push(item);
                            }
                        }
                    }

                })
                return res;
            },

            'get_unfiltered_arr_cpp_includes_from_cpp_file': function(cpp_file_path, callback) {
                fs2.load_file_as_string(cpp_file_path, function(err, str_cpp_file) {
                    if (err) {
                        callback(err);
                    } else {
                        var arr_includes = package_deploy.get_unfiltered_arr_cpp_includes_from_str_cpp(str_cpp_file);
                        callback(null, arr_includes);
                    }
                })
            },

            'deploy_js_file': function(dev_js_file_path, release_package_js_file_path, callback) {
                console.log('deploy_js_file ' + dev_js_file_path);
                // load the JS file, process it to change the references, publish it.
                // load the list of directories at release_package_js_file_path
                var release_packages_path = fs2.path_parent(fs2.path_parent(release_package_js_file_path));
                console.log('release_packages_path ' + release_packages_path);
                fs2.dir_contents(release_packages_path, function(err, contents) {
                    if (err) {
                        callback(err)
                    } else {

                        var package_dirs = contents.directories;
                        var map_package_dirs = get_truth_map_from_arr(package_dirs);
                        console.log('map_package_dirs ' + map_package_dirs);
                        fs2.load_file_as_string(dev_js_file_path, function(err, str_dev_js) {
                            if (err) {
                                callback(err)
                            } else {
                                var deployment_js = package_deploy.modify_dev_str_js_references_for_deployment(str_dev_js, map_package_dirs);
                                
                                console.log('has deployment_js');
                                //console.log('deployment_js ' + deployment_js);
                                fs2.save_file_as_string(release_package_js_file_path, deployment_js, function(err, res) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        callback(null, deployment_js);
                                    }
                                });
                            }
                        });
                    }
                })
                //var that = this;
            },

            'load_release_js_release_changelog': function(release_package_js_file_path, callback) {
                // and get the package path from release_package_js_file_path
                var package_path = fs2.path_parent(release_package_js_file_path);
                var rcl = package_deploy.load_release_js_changelog(release_package_js_file_path, function(err, releaseChangelog) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('releaseChangelog ' + stringify(releaseChangelog));
                        if (releaseChangelog) {

                            package_deploy.get_release_package_version_str(package_path, function(err, strVersion) {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log('strVersion ' + strVersion);
                                    var revisionChangeLog = releaseChangelog[strVersion];
                                    console.log('revisionChangeLog ' + stringify(revisionChangeLog));

                                    callback(null, revisionChangeLog);
                                }
                            })
                        } else {
                            callback(null, undefined);
                        }

                    }
                })
            },
            'deploy_release_package_to_github': function(directoryPath, callback) {
                var packageName = fs2.path_last_part(directoryPath);
                console.log('deploy_release_package_to_github packageName ' + packageName);

                // Git message - perhaps that would be worth taking as a parameter.
                var release_package_js_file_path = directoryPath + '/' + packageName + '.js';
                // Get the changelog from the file, as an object.
                package_deploy.load_release_js_release_changelog(release_package_js_file_path, function(err, arrRevisionChangeLog) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('arrRevisionChangeLog ' + stringify(arrRevisionChangeLog));
                        var message;

                        if (arrRevisionChangeLog) {
                            message = arrRevisionChangeLog.join('\n');
                        } else {
                            message = 'Update';
                        }

                        // then use that to make the message.

                        var execOpts = {
                            'cwd': directoryPath
                        };

                        exec('git add -A', execOpts, function(err, res) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('message ' + message);
                                exec('git commit -m "' + message + '"', execOpts, function(err, res) {
                                    if (err) {
                                        console.log('err ' + err);
                                        console.log('res ' + res);

                                        if (res == 'nothing to commit (working directory clean)') {
                                            callback(null, false);
                                        }

                                        throw err;
                                    } else {
                                        exec('git push origin master', execOpts, function(err, res) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                console.log('git push complete');
                                                callback(null, true);
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            },
            'compare_str_versions': function(ver1, ver2) {
                var arr1 = ver1.split('.');
                var arr2 = ver2.split('.');

                if (arr1.length == arr2.length) {
                    // left to right
                    var l = arr1.length;
                    var done = false;
                    var c = 0;
                    while (c < l) {
                        var val1 = parseInt(arr1[c], 10);
                        var val2 = parseInt(arr2[c], 10);
                        if (val1 < val2) return -1;
                        if (val1 > val2) return 1;
                        c++;
                    }
                    return 0;
                }
            },

            // will use this to check that the 
            'get_dev_js_file_external_dependencies_for_deployment': function(dev_js_file_path, callback) {
                // load the file, get the dependencies
                // filter them for the external dependencies
                fs2.load_file_as_string(dev_js_file_path, function(err, str_dev_js) {
                    if (err) {
                        callback(err);
                    } else {
                        var arr_unfiltered_deployment_references = package_deploy.get_arr_js_unfiltered_deployment_references(str_dev_js);
                        console.log('arr_unfiltered_deployment_references ' + stringify(arr_unfiltered_deployment_references));
                    }
                });
            },
            'get_deployment_package_directory_names': function(release_directory_path, callback) {
                fs2.dir_contents(release_directory_path, function(err, dir_contents) {
                    if (err) {
                        callback(err);
                    } else {
                        var dirs = dir_contents.directories;

                        //console.log('dirs ' + stringify(dirs));
                        callback(null, dirs);
                    }
                })
            },


            // increment_package_json_revision exists
            //'increment_package_json': function(release_package_folder_path, callback) {

            //},

            // want to discover both the dependencies as well as the files to get copied over
            //  should also be able to find external dependencies.
            //  could maybe find the version of these that are installed on the local system to get the 
            //  minimum version numbers.
            // Will need to recursively go through multiple files finding the dependencies out of all of them
            //  Then assess which of these are:
            //   Internal node.js (eg fs)
            //    node
            //   jsgui packages
            //    jsgui-package
            //     jsgui
            //   other-package
            //    other
            //    could use a call to the npm website to get the latest version of package
            //   jsgui files to be included in the package (local references)
            //    included


            

            // single package scan for references

            // then a multiple package scan
            //  once it has determined the references from one file (which are local)
            //   it will go through and obtain those references.

            // categorise_js_file_refs
            //  gets a map with the types of file ref
            //   node, jsgui, other, included

            // These references will still be their local paths, 
            //  but can get translated to deployment refs

            



            'create_package_json': function(dev_js_file_path, release_package_folder_path, module_name) {
                // Will also need to check the references when coming up with the dependencies.
                //  Some will be copied over as files, some are packages.

                console.log('create_package_json');

                /*
                {
                  "name": "jsgui-node-image",
                  "version": "0.1.0",
                  "main": "jsgui-node-image.js",
                  "scripts": {
                    "test": "echo \"Error: no test specified\" && exit 1"
                  },
                  "repository": {
                    "type": "git",
                    "url": "https://github.com/metabench/jsgui-node-image"
                  },
                  "keywords": [
                    "png",
                    "image",
                    "jsgui"
                  ],
                  "dependencies" : {
                    "jsgui-lang-essentials" :  "0.3.x",
                    "jsgui-node-png" :  "0.1.x",
                    "amdefine": ">=0.0.4"
                  },
                  "author": "James Vickers <james@metabench.com>",
                  "description": "jsgui - Image module. Load, save, access metadata.",
                  "contributors": [ 
                    {
                      "name": "James Vickers",
                      "email": "james@metabench.com"
                    } 
                  ],
                  "license": "MIT"
                }
*/

                var proto = {
                    'name': module_name,
                    'version': '0.1.0',
                    'main': module_name + '.js',
                    'repository': {
                        'type': 'git',
                        'url': 'https://github.com/metabench/' + module_name
                    },
                    'keywords': [
                        'jsgui'
                    ],
                    // need to work out what the dependencies are.
                    //  they'll be other packages referenced within this or the files that are loaded.
                    'author': 'James Vickers <james@metabench.com>',
                    'contributors': [
                        {
                            'name': James Vickers,
                            'email': 'james@metabench.com'
                        }
                        
                    ],
                    'license': 'MIT'

                }

            },
            'create_or_maybe_increment_package_json': function(dev_js_file_path, release_package_folder_path, module_name, do_increment, callback) {
                // But sometimes we don't want the increment.

                // does the file exist or not?

                var release_package_json_path = release_package_folder_path + '/package.json';



                fs.exists(release_package_json_path, function(exists) {
                    if (exists) {
                        // do increment
                        package_deploy.increment_package_json_revision(release_package_folder_path, callback)
                    } else {
                        // do create
                        package_deploy.create_package_json(dev_js_file_path, release_package_folder_path, module_name, callback);
                    }
                });

            }
        }
    	process.argv.forEach(function (val, index, array) {
            console.log(index + ': ' + val);
		})
		var extraArgs = process.argv.slice(2);
		console.log('extraArgs ' + stringify(extraArgs));
		var source_package_name;

		if (extraArgs.length == 1) {
			source_package_name = extraArgs[0];
            // Could possibly construct the message out of the changelogs in the file.
		}



        // otherwise, need to parse the args.



		console.log('source_package_name ' + source_package_name);

		//var filename = module.uri,
        //dirname = path.dirname(filename);

        var moduleFileName = process.argv[1];
        console.log('moduleFileName ' + moduleFileName);

		//var source_js_file_path = dirname;
		//console.log('source_js_file_path ' + source_js_file_path);

        // path_parent

        var modParent = path_parent(moduleFileName);
        console.log('modParent ' + modParent);

        var jsDirPath = path_parent(modParent);

        var source_js_file_path = jsDirPath + '/' + source_package_name + '.js';

        var source_dir_path = jsDirPath + '/' + (path_parent(source_package_name));
        console.log('source_dir_path ' + source_dir_path);

        var release_packages_folder_path = path_parent(path_parent(jsDirPath)) + '/github';

        var release_package_folder_path = release_packages_folder_path + '/' + path_last_part(source_package_name);

        // Source test directory...

        var release_package_json_path = release_package_folder_path + '/package.json';

        var release_package_js_file_path = release_package_folder_path + '/' + path_last_part(source_package_name) + '.js';
        var release_package_readme_file_path = release_package_folder_path + '/' + 'README.md';

        console.log('source_js_file_path ' + source_js_file_path);
        console.log('release_packages_folder_path ' + release_packages_folder_path);
        console.log('release_package_folder_path ' + release_package_folder_path);
        console.log('release_package_json_path ' + release_package_json_path);
        console.log('release_package_js_file_path ' + release_package_js_file_path);

        // Copy the package, if it is different, then increment the revision number of the package.json

        //  Then will run code to push them to both git and npm.
        //  Will check the metadata first, will also be good to keep this sequential using fns if possible.


        // Maintained closure asyncronous sequential processing.
        //  Maybe better than promises?

        // Ensure the existance of the package directory...

        // Would wind up creating a new directory, with a few files, for cases where the package directory does not exist.

        // Will copy over the files, creating the package json, maybe the readme and then proceed with the
        //  (open) source deployment.

        // It would be powerful to have the system deploy all the requirements for a module.
        //  Flexible in that we may want it to do different things


        var fns = new Fns();

        var source_package_js_file_size, release_package_js_file_size;

        // release js may not exist...

        fns.push([fs2.metadata, [release_package_js_file_path], function(err, res_md) {
            //console.log('res_size ' + stringify(res_size));
            var obj_md = res_md[1];

            if (obj_md) {
                var size = obj_md.size;
                //console.log('size ' + size);
                release_package_js_file_size = size;

                console.log('release_package_js_file_size ' + release_package_js_file_size);
            }
            //console.log('obj_md ' + stringify(obj_md));
            
        }]);

        fns.push([fs2.metadata, [source_js_file_path], function(err, res_md) {
            //console.log('res_size ' + stringify(res_size));
            var obj_md = res_md[1];
            //console.log('obj_md ' + stringify(obj_md));
            var size = obj_md.size;
            //console.log('size ' + size);
            source_package_js_file_size = size;

            console.log('source_package_js_file_size ' + source_package_js_file_size);
        }]);

        // can this be put as a function call to execute sequentially?
        //  when we have the sizes, we can decide to do the copy.




        fns.go(function(err, res) {
            //console.log('go res ' + stringify(res));
            // do the next things

            // Not just copying
            // doing a package_deploy_js
            // package preparation
            // package deployment

            var strNpmVersion;

            var prepare_tests = function(callback) {
                console.log('prepare_tests');

                // need to copy over the relevant tests folder if there is one.
                //  will be updating with the tests from the development tests directory.

                // if there are test files to prepare, need to find them and copy them over

                var dev_test_path = jsDirPath + '/test/' + path_last_part(source_package_name);
                console.log('dev_test_path ' + dev_test_path);

                fs.exists(dev_test_path, function(exists) {
                    if (exists) {
                        var release_test_path = release_package_folder_path + '/test';
                        fs2.copy(dev_test_path, release_test_path, function(err, res_copy) {
                            if (err) {
                                console.log('err ' + err);
                                throw err;
                            } else {
                                // but don't want to copy over the 'res' dir.

                                var package_test_res_path = release_test_path + '/res';

                                // and delete it.
                                console.log('package_test_res_path ' + package_test_res_path);
                                fs2.delete(package_test_res_path, function(err, resDelete) {
                                    if (err){
                                        throw err;
                                    } else {
                                        console.log('tests dir copied and res dir removed');

                                        // Need to correct the references in the JavaScript files there.
                                        //  Will do so for every file in the directory.
                                        package_deploy.modify_directory_release_test_js_references(release_test_path, release_packages_folder_path, function(err, res) {
                                            if (err) {
                                                throw err;
                                            } else {

                                                // create the result directory if necessary.
                                                //  does it exist in the source test dir?

                                                var dev_test_res_path = dev_test_path + '/res';

                                                fs.exists(dev_test_res_path, function(exists) {
                                                    if (exists) {
                                                        // ensure it exists in the release package dir
                                                        var release_test_res_path = release_test_path + '/res';
                                                        fs2.ensure_directory_exists(release_test_res_path, callback);
                                                    } else {
                                                        callback();
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        callback();
                    }
                });
            }


            var do_preparation = function(callback) {

                // Can include a file if it is not found as a package.
                //  eg include misc/CrcStream.js if it's not a package.

                // Ensuring / setting up the directory...
                //  We'll want to create a new directory for jsgui-data-structures.
                //   That will involve copying over a variety of files.
                //   Create the package.json
                //    Save a modified prototype.
                console.log('do_preparation');

                fs2.dir_ensure(release_package_folder_path, function(err, resEnsure) {
                    if (err) {
                        throw err;
                    } else {
                        var doCopyIncrementRevision = false;
                        if (true || release_package_js_file_size != source_package_js_file_size) {
                            doCopyIncrementRevision = true;
                        }

                        // Setting up the package file...
                        //  will be changed to ensure its existance, and also to increment the version number.

                        // create_or_increment_package_json
                        //  would need to know what the dependencies are.





                        if (doCopyIncrementRevision) {

                            var fns2 = new Fns();
                            // deploy_js_file

                            var str_deployment_js;

                            //fns2.push([fs2.copy, [source_js_file_path, release_package_js_file_path]]);
                            fns2.push([package_deploy.deploy_js_file, [source_js_file_path, release_package_js_file_path], function(err, res) {
                                str_deployment_js = res;
                            }]);

                            // ensure the package directory (exists)
                            // ensure the package.json file exists
                            //  will need to ensure / set up the dependencies in that file.
                            //   can do greater than or equal to the current (deployed? package?) latest version.






                            //  (ensure the readme.md file exists)



                            fns2.push([package_deploy.increment_package_json_revision, [release_package_json_path]]);

                            // Also need to update the C / C++ in the package directory.
                            //  That should also appear in the package.json.
                            //  We can get some info out of the package.json in the directory that it's already in.

                            // Only copy the files over if they are necessary.
                            //fns2.push([package_deploy.increment_package_json_revision, [release_package_json_path]]);

                            // Determine if the package uses C++ or not.
                            //  We can get that from the reference in the file.
                            //   Look for require('./build/Release/binding.node') or similar

                            var do_cpp_preparation = function(callback) {
                                console.log('do_cpp_preparation');
                                var cpp_dir_path = release_package_folder_path + '/c';
                                var cpp_binding_file_path = cpp_dir_path + '/binding.cpp';

                                var dev_cpp_binding_file_path = source_dir_path + '/c/binding.cpp';
                                // then check that file for C++ references to copy over....

                                // We'll need to create the c directory
                                // copy the binding.gyp

                                var dev_binding_gyp_path = source_dir_path + '/binding.gyp';
                                // 
                                var release_binding_gyp_path = release_package_folder_path + '/binding.gyp';

                                var cpp_release_dir_path = release_package_folder_path + '/c';

                                // Will change to use fns.


                                fs2.dir_ensure(cpp_release_dir_path, function(err, res) {
                                    if (err) {
                                        console.log('err ' + err);
                                        throw err;
                                    } else {
                                        console.log('dev_binding_gyp_path ' + dev_binding_gyp_path);
                                        fs2.copy(dev_binding_gyp_path, release_binding_gyp_path, function(err, res) {
                                            if (err) {
                                                console.log('err ' + err);
                                                throw err;
                                            } else {

                                                fs2.copy(dev_cpp_binding_file_path, cpp_binding_file_path, function(err, res) {
                                                    if (err) {
                                                        console.log('err ' + err);
                                                        throw err;
                                                    } else {
                                                        
                                                        // Find out which files (in the c dir) are included.
                                                        //  look in binding.cpp, going through it line by line.


                                                        package_deploy.get_unfiltered_arr_cpp_includes_from_cpp_file(dev_cpp_binding_file_path, function(err, cpp_includes) {
                                                            if (err) {
                                                                throw err;
                                                            } else {
                                                                console.log('cpp_includes ' + stringify(cpp_includes));

                                                                // then copy over all the cpp_include files

                                                                var arr_source_cpp_included_file_paths = [];
                                                                var fns = Fns();
                                                                each(cpp_includes, function(i, inclusion) {
                                                                    var source_file_path = source_dir_path + '/c/' + inclusion;
                                                                    var dest_file_path = cpp_release_dir_path + '/' + inclusion;
                                                                    //console.log('filePath ' + filePath);
                                                                    //throw 'stop';
                                                                    fns.push([fs2.copy, [source_file_path, dest_file_path]]);
                                                                })
                                                                fns.go(function(err, res_copies) {
                                                                    if (err) {
                                                                        throw err;
                                                                    } else {

                                                                        // prepare tests...
                                                                        //  another function.

                                                                        //prepare_tests(callback);


                                                                        callback();
                                                                    }
                                                                })

                                                                
                                                                //

                                                                //callback();
                                                            }
                                                        })


                                                        //throw 'stop';

                                                        

                                                    }
                                                })
                                            }
                                        })
                                        
                                    }
                                })

                            }

                            var ctu = function() {
                                console.log('ctu');
                                // copy any referenced files that don't have a deployment package
                                // need the dev js

                                fs2.load_file_as_string(source_js_file_path, function(err, strDevJs) {
                                    if (err) {
                                        throw err;
                                    } else {

                                        var deployment_refs_info = package_deploy.get_arr_js_unfiltered_deployment_references_original_pairs(strDevJs);
                                        console.log('deployment_refs_info ' + stringify(deployment_refs_info));

                                        
                                        package_deploy.get_deployment_package_directory_names(release_packages_folder_path, function(err, arr_deployement_package_directory_names) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                console.log('arr_deployement_package_directory_names ' + stringify(arr_deployement_package_directory_names));
                                                //throw 'stop';

                                                var map_dpdns = jsgui.get_truth_map_from_arr(arr_deployement_package_directory_names);
                                                console.log('map_dpdns ' + stringify(map_dpdns));

                                                // then get the intersection... or rather those that are deployed but have no item in the map

                                                var refs_with_no_package = [];
                                                console.log('deployment_refs_info ' + stringify(deployment_refs_info));
                                                
                                                var modified_refs = [];
                                                var non_cpp_modified_refs = [];

                                                each(deployment_refs_info, function(i, deployment_ref) {
                                                    if (!map_dpdns[deployment_ref[0]]) {
                                                        refs_with_no_package.push(deployment_ref);
                                                        //console.log('deployment_ref.orig ' + deployment_ref.orig);
                                                        if (deployment_ref[0] != deployment_ref[1]) {
                                                            modified_refs.push(deployment_ref);

                                                            if (deployment_ref[1].indexOf('./build/Release') == -1) {
                                                                non_cpp_modified_refs.push(deployment_ref);
                                                            }
                                                        }
                                                    }
                                                });
                                                

                                                console.log('refs_with_no_package ' + stringify(refs_with_no_package));
                                                console.log('modified_refs ' + stringify(modified_refs));
                                                console.log('non_cpp_modified_refs ' + stringify(non_cpp_modified_refs));
                                                // So for these various items, we see which of them point to a path...
                                                //  and not a binding to cpp.


                                                package_deploy.modify_release_file_ensure_local_references(release_package_js_file_path, function(err, res) {
                                                    if (err) {
                                                        throw err;
                                                    } else {


                                                        var fns = Fns();
                                                        each(non_cpp_modified_refs, function(i, ref_info) {
                                                            var modified = ref_info[0];
                                                            var orig = ref_info[1];
                                                            console.log('source_dir_path ' + source_dir_path);
                                                            console.log('orig ' + orig);

                                                            if (orig.substr(0, 2) == './') {
                                                                orig = orig.substr(2);
                                                            }
                                                            console.log('orig ' + orig);

                                                            // and use the relative path from the package dev dir.
                                                            var orig_file_path = source_dir_path + '/' + orig;

                                                            if (orig_file_path.substr(orig_file_path.length - 3) != '.js') {
                                                                orig_file_path = orig_file_path + '.js';
                                                            }

                                                            console.log('orig_file_path ' + orig_file_path);

                                                            var dest_file_path = release_package_folder_path + '/' + modified;
                                                            if (dest_file_path.substr(dest_file_path.length - 3) != '.js') {
                                                                dest_file_path = dest_file_path + '.js';
                                                            }


                                                            console.log('dest_file_path ' + stringify(dest_file_path));

                                                            // we don't just copy the file, we deploy it.
                                                            // could be a fs2.process_copy function, that has a function
                                                            //  that processes the file before saving it.


                                                            fns.push([package_deploy.deploy_js_file, [orig_file_path, dest_file_path]]);

                                                            //fns.push([fs2.copy, [orig_file_path, dest_file_path]]);

                                                        })

                                                        fns.go(function(err, res) {
                                                            if (err) {
                                                                throw err;
                                                            } else {
                                                                console.log('Referenced, non-packaged js file(s) copied.');

                                                                prepare_tests(callback);
                                                            }
                                                        })

                                                    }
                                                })

                                                //throw 'stop';

                                                // OK, it's copying these refs, but we need to make it 
                                                // ./refname in the file.

                                                // modify the deployed file so that it has the reference to the local file...



                                                // we copy each of these referenced files to the release package dir.

                                                
                                                //




                                                //
                                            }
                                        })
            

                                    }
                                })


                                

                                //console.log('deployment_refs ' + stringify(deployment_refs));

                                //fns = Fns();



                                // check to see if any of them are javascript files from that directory?


                                //throw 'stop';
                                
                            }

                            fns2.go(function(err, res) {
                                if (err) {
                                    throw err;
                                } else {
                                    //console.log('res ' + stringify(res));
                                    //console.log('pre get_npm_version_str');
                                    package_deploy.get_npm_version_str(path_last_part(source_package_name), function(err, resStrNpmVersion) {

                                        if (err) {
                                            throw err;
                                        } else {
                                            console.log('strNpmVersion ' + strNpmVersion);
                                            strNpmVersion = resStrNpmVersion;

                                            //console.log('str_deployment_js ' + str_deployment_js);

                                            //var cpp_refs = 
                                            //throw ('4) stop');
                                            var arr_cpp_refs = package_deploy.get_arr_cpp_refs_from_str_js(str_deployment_js);
                                            //console.log('arr_cpp_refs ' + stringify(arr_cpp_refs));

                                            //throw ('3) stop');

                                            if (arr_cpp_refs.length > 0) {
                                                // means we need to copy over the c / cpp directory.


                                                do_cpp_preparation(function() {
                                                    //throw '1) stop';
                                                    ctu();
                                                })


                                            } else {
                                                //throw '2) stop';
                                                ctu();
                                            }

                                            //throw 'stop';

                                            // Get the local npm version number.
                                            
                                        }
                                    })
                                }
                            })

                        } else {
                            package_deploy.deploy_release_package_to_github(release_package_folder_path, function(res_github_deploy) {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log('res_github_deploy ' + res_github_deploy);
                                }
                            })
                        }
                    }
                })


                
            }

            // Perhaps this should do more planning, seeing which files will be copied there.



            var do_deployment = function(callback) {
                package_deploy.get_release_package_version_str(release_package_folder_path, function(err, strReleaseVersion) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('strReleaseVersion ' + strReleaseVersion);
                        var comparison = package_deploy.compare_str_versions(strNpmVersion, strReleaseVersion);
                        console.log('comparison ' + comparison);
                        
                        if (comparison == -1) {
                            var ctu = function() {
                                // deploy to github

                                package_deploy.deploy_release_package_to_github(release_package_folder_path, function(res_github_deploy) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log('res_github_deploy ' + res_github_deploy);
                                    }
                                })
                            }

                            if (comparison == 0) {
                                ctu();
                            } else {
                                package_deploy.deploy_release_package_to_npm(release_package_folder_path, function(err, resDeployment) {
                                    if (err) {
                                        console.log('Error deploying to npm');
                                        console.log(err);

                                        throw 'err';
                                    } else {
                                        console.log('resDeployment ' + resDeployment);
                                        ctu();
                                    }
                                })
                            }
                        }
                    }
                })
            }

            do_preparation(function() {
                console.log('preparation done.');
                do_deployment(function() {
                    console.log('deployment done.');
                });
            });
            //console.log('doCopyIncrementRevision ' + doCopyIncrementRevision);
            

            //var fns2 = new Fns();



        })


    	

    	return package_deploy;

    }

 );