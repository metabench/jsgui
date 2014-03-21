if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// Maybe I don't want it to do all the syncing at once.

define(['./jsgui-lang-essentials.js', 'fs', './jsgui-node-fs2-core.js', 'async'],
    function(jsgui, fs, fs2, async) {

        var stringify = jsgui.stringify, each = jsgui.each, is_defined = jsgui.is_defined;
        var tof = jsgui.tof;

        var transform_js_for_package = function(str_dev_js, map_package_js_files_by_name) {

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

                    if (map_package_js_files_by_name[definition_item] || map_package_js_files_by_name[definition_item + '.js']) {
                        var pos_js = definition_item.indexOf('.js');
                        if(pos_js > -1){
                            definition_item = definition_item.substr(0, pos_js);
                        }

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
                //console.log('res ' + res);

                console.log('');
                //console.log('str_dev_js ' + str_dev_js);

                //throw 'stop';
                //throw 'stop';
                return res;
            } else {
                return str_dev_js;
            }
        }


        // Generally won't want to do this...
        //  We develop it as the dev package, but deploy them individually?
        //  However, we may have patches put in place in the deployed versions by others,
        //   need to integrate these changes back into the development code.



        var transform_js_for_dev = function(str_package_js, map_package_js_files_by_name) {

            var beginning_search = 'define([';
            var pos1 = str_package_js.indexOf(beginning_search);

            if (pos1 > -1) {

                var pos2 = str_package_js.indexOf(']', pos1);

                var definition = str_package_js.substring(pos1 + beginning_search.length, pos2);

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

                    if (map_package_js_files_by_name[definition_item] || map_package_js_files_by_name[definition_item + '.js']) {

                        arr_definition_items_that_are_packages.push(definition_item);


                            definition_item = './' + definition_item + '.js';


                        console.log('definition_item ' + definition_item);
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

                var res = str_package_js.substr(0, pos1 + beginning_search.length) + str_new_define + str_package_js.substr(pos2);
                console.log('');
                //console.log('res ' + res);

                console.log('');
                //console.log('str_package_js ' + str_package_js);

                //throw 'stop';
                //throw 'stop';
                return res;
            } else {
                return str_package_js;
            }
        }
        var JS_Sync = jsgui.Class.extend({
            'init': function(spec) {

                var that = this;

                this.dev_path = spec.dev_path;
                this.packages_path = spec.packages_path;

                this.transform_js_dev_to_package = spec.transform_js_dev_to_package;
                this.transform_js_package_to_dev = spec.transform_js_package_to_dev;

                this.sense(function(err, res_sense) {

                    // not much in res_sense.

                    // then plan...


                    // but first look at some of the data sensed.

                    console.log('sensing done');

                    that.model(function(err, res_model){
                        console.log('model done');

                        that.plan(function(err, res){
                            console.log('plan done');

                            that.act(function(err, res){
                                console.log("act done");
                            })
                        })
                    });




                });

            },

            //
            // get_functions get the info and return it in the callback.
            'get_package_directories': function(callback) {
                // this.packages_path
                // filter out directories beginning with '_'

                //fs2.dir_dirs(this.packages_path, callback);
                // ^(?!tbd_).+

                // want to return the full paths as well.

                fs2.dir_dirs(this.packages_path, {'filter': {'regex': /^(?!_).+/}, 'fs_paths': true}, callback);

            },

            // get dev js files
            'get_dev_js_files': function(callback) {
                // load a list of names of the javascript files in the location.

                // maybe fs2 could allow the files to be loaded along with metadata.

                // load_files, include metadata.
                //  then can use these to calculate the file transformations a bit later.

                // load the files themselves...
                //  also load metadata.

                fs2.dir_contents(this.dev_path, {'res_format': 'map', 'files_or_directories': 'files', 'fs_paths': true,
                'include_metadata': true, 'include_file_contents': true,
                'filter': {'extension': '.js', 'regex': /^(?!_).+/}}, function(err, res_active_js_files) {
                    if (err) throw err;
                    //console.log('res_active_txt_files ' + stringify(res_active_txt_files));
                    callback(null, res_active_js_files);
                });


            },

            // sense the untransformed dev files
            'sense_dev': function(callback){

                var that = this;

                that.get_dev_js_files(function(err, dev_js_files){

                    each(dev_js_files, function(i, dev_js_file) {

                        that.map_dev_js_files[dev_js_file.name] = that.map_dev_js_files[dev_js_file.name] || [];
                        that.map_dev_js_files[dev_js_file.name].push(dev_js_file);

                    });

                    callback();
                })

            },
            // sense the untransformed packages.

            // model is the transformations./
            'sense_packages': function(callback) {

                var that = this;

                // sense_packages

                // sense_dev

                that.get_package_directories(function(err, package_directories) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('package_directories ' + stringify(package_directories));

                        // then get / load / sense the package files.
                        //  load all the files from each of the package directories into a map.

                        // dir_contents of an array of directories.
                        //  it's an arrayified function.

                        // and get all the javascript files not beginning with underscore in that directory.

                        // can have a test to load filtered (!^_) .js files from multiple directories.

                        // we may want to get the results as a map...
                        //  maybe a multify function could help.

                        fs2.dir_contents(package_directories, {'res_format': 'map', 'files_or_directories': 'files', 'fs_paths': true,
                        'include_metadata': true, 'include_file_contents': true,
                        'filter': {'extension': '.js', 'regex': /^(?!_).+/}}, function(err, res_active_package_js_files) {
                            if (err) throw err;
                            //console.log('res_active_js_files ' + stringify(res_active_js_files));

                            //console.log('tof(res_active_package_js_files) ' + tof(res_active_package_js_files));

                            each(res_active_package_js_files, function(i, active_js_file) {
                                //console.log('tof(active_js_file) ' + tof(active_js_file));
                                // should be an object, I think, as we asked for the results as a map.

                                //console.log('active_js_file.path ' + active_js_file.path);

                                that.map_package_js_files_by_full_path[active_js_file.path] = active_js_file;
                                that.map_package_js_files_by_name[active_js_file.name] = that.map_package_js_files_by_name[active_js_file.name] || [];
                                that.map_package_js_files_by_name[active_js_file.name].push(active_js_file);

                            })


                            // then more sensing... sense the

                            callback();

                            //throw 'stop';
                        });

                    }

                })

            },

            // list latest dev files
            'sense_latest_dev': function(callback){

                var that = this;


                each(this.map_dev_js_files, function(dev_file_name, dev_js_file){
                    var corresponding_package_js_file = that.map_package_js_files_by_name[dev_file_name];

                    dev_js_file = dev_js_file[0];

                    //console.log(dev_js_file.metadata[1].mtime + " " + corresponding_package_js_file.metadata.mtime);

                    if (corresponding_package_js_file) {

                        corresponding_package_js_file = corresponding_package_js_file[0];

                        if (dev_js_file.metadata[1].mtime > corresponding_package_js_file.metadata[1].mtime) {
                            //console.log("Dev file: " + dev_file_name);
                            that.latest_dev_files.push(dev_file_name);
                        }

                    } else {
                        //arr_package_names_not_dev.push(package_file_name);
                    }

                });

                callback();
            },

            // list latest package files
            'sense_latest_package': function(callback){

                var that = this;

                each(this.map_package_js_files_by_name, function(package_file_name, package_js_file){
                    var corresponding_dev_js_file = that.map_dev_js_files[package_file_name];

                    package_js_file = package_js_file[0];

                    //console.log(dev_js_file.metadata[1].mtime + " " + corresponding_package_js_file.metadata.mtime);

                    if (corresponding_dev_js_file) {

                        corresponding_dev_js_file = corresponding_dev_js_file[0];

                        if (package_js_file.metadata[1].mtime > corresponding_dev_js_file.metadata[1].mtime) {
                            console.log(package_file_name);
                            that.latest_package_files.push(package_file_name);
                        }



                    } else {
                        //arr_package_names_not_dev.push(package_file_name);
                    }

                });

                callback();

            },

            'sense': function(callback) {
                // this function writes to the local model.
                var that = this;
                this.arr_package_directories = [];

                this.map_dev_js_files = {};
                // all the js files are in the same directory.

                // has both content and date.

                //this.map_dev_js_file_content = {};
                //this.map_dev_js_file_dates = {};

                //this.map_package_js_file_content = {};
                //this.map_package_js_file_dates = {};

                this.map_package_js_files_by_full_path = {};
                this.map_package_js_files_by_name = {};

                this.latest_dev_files = [];
                this.latest_package_files = [];
                // map them by paths
                // map

                // lead these various items.
                this.sense_packages(function() {
                    console.log('packages sensed');

                    // sense the dev files.
                    that.sense_dev(function(){

                        /*each(that.map_dev_js_files, function(i,v){
                            console.log(v[0].metadata)
                        })*/
                        console.log('dev files sensed');

                        that.sense_latest_dev(function(){

                            console.log('latest dev files sensed');

                            that.sense_latest_package(function(){
                                console.log('latest package files sensed');

                                callback(null, null);
                            });

                        });
                    });

                });



            },

            'model_do_transformations': function(callback){

                var that = this;

                // transform dev files to package files
                each(this.latest_dev_files, function(i, dev_file_name){
                    var dev_js_file = that.map_dev_js_files[dev_file_name][0];
                    console.log('Transform dev->package: ' + dev_file_name);
                    that.map_dev_transformed_files[dev_file_name] = transform_js_for_package(dev_js_file.contents, that.map_package_js_files_by_name);

                });

                each(this.latest_package_files, function(i, package_file_name){
                    var package_js_file = that.map_package_js_files_by_name[package_file_name][0];
                    console.log('Transform package->dev: ' + package_file_name);
                    that.map_package_transformed_files[package_file_name] = transform_js_for_dev(package_js_file.contents, that.map_package_js_files_by_name);
                    //console.log(that.map_package_transformed_files[package_file_name].substr(that.map_package_transformed_files[package_file_name].indexOf('define'),100));
                });

                callback();

            },

            'model': function(callback){

                var that = this;

                this.map_dev_transformed_files = {};
                this.map_package_transformed_files = {};

                this.model_do_transformations(function(){
                    console.log("transformations done");
                    callback(null, null);
                });
            },

            'plan_copy_instructions': function(callback){

                var that = this;
                var fns = [];

                each(this.map_dev_transformed_files, function(dev_file_name, dev_file_js){
                    var package_js_file = that.map_package_js_files_by_name[dev_file_name][0];

                    fns.push(function(cb){
                        fs2.load_file_as_string(package_js_file.path, function(err, loaded_package_js){
                            if(dev_file_js != loaded_package_js){
                                that.dev_files_to_copy_names.push(dev_file_name);
                            }else{
                                console.log("Files are the same when " + dev_file_name + " is transformed to a package version");
                                console.log("nothing to do");
                            }
                            cb();
                        });
                    });

                });

                each(this.map_package_transformed_files, function(package_file_name, package_file_js){
                    var dev_js_file = that.map_dev_js_files[package_file_name][0];

                    fns.push(function(cb){
                        fs2.load_file_as_string(dev_js_file.path, function(err, loaded_dev_js){
                            if(package_file_js != loaded_dev_js){
                                that.package_files_to_copy_names.push(package_file_name);
                            }else{
                                console.log("Files are the same when " + package_file_name + " is transformed to a development version");
                                console.log("nothing to do");
                            }
                            cb();
                        });
                    });

                });

               async.series(fns, function(err, res){
                    console.log('Dev files to copy ' + stringify(that.dev_files_to_copy_names));
                    console.log('Package files to copy ' + stringify(that.package_files_to_copy_names));
                    callback();
                });

            },

            'plan': function(callback){

                var that = this;

                this.dev_files_to_copy_names = [];
                this.package_files_to_copy_names = [];

                this.plan_copy_instructions(function(){
                    console.log("copy instructions done");
                    callback(null, null);
                });
            },

            'copy_dev_files': function(callback){
                var that = this;
                var fns = [];

                each(this.dev_files_to_copy_names, function(i, dev_file_name){


                    var dev_js_file_str = that.map_dev_transformed_files[dev_file_name];
                    var package_js_file = that.map_package_js_files_by_name[dev_file_name][0];

                    fns.push(function(cb){
                        fs.writeFile(package_js_file.path, dev_js_file_str, function(err){
                            if(err) throw err;

                            console.log("Saved " + package_js_file.path);
                            cb();
                        });
                    });

                });


                async.series(fns, function(err, res){

                    callback();
                });
            },

            'copy_package_files': function(callback){
                var that = this;
                var fns = [];

                each(this.package_files_to_copy_names, function(i, package_file_name){


                    var package_js_file_str = that.map_package_transformed_files[package_file_name];
                    var dev_js_file = that.map_dev_js_files[package_file_name][0];

                    console.log(dev_js_file.path);

                    fns.push(function(cb){
                        fs.writeFile(dev_js_file.path, package_js_file_str, function(err){
                            if(err) throw err;

                            //console.log("Saved " + dev_js_file.path);
                            cb();
                        });
                    });

                });


                async.series(fns, function(err, res){

                    callback();
                });
            },

            'act': function(callback){

                var that = this;

                this.copy_dev_files(function(){
                    console.log("copy dev files done");

                    that.copy_package_files(function(){
                        console.log("Copy package files done");
                        callback(null, null);
                    })

                });
            }
        })

        if(require.main === module) {

            // carry out the sync process.
            console.log("called directly");

            var js_sync = new JS_Sync({
                'packages_path': '../metabench/github',
                'dev_path': './'
            });

        }
        else {
            //console.log("required as a module");
        }


        return JS_Sync;
    }
);

