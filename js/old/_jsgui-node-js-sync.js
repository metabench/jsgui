if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
// could also use image_buffer...
//  will get a new image_buffer from a PNG.

//  will also load an image_buffer from 



define(['./jsgui-lang-essentials', 'fs', './jsgui-node-fs2-core'], 
    function(jsgui, fs, fs2) {
        
        var stringify = jsgui.stringify, each = jsgui.each, is_defined = jsgui.is_defined;
        var tof = jsgui.tof;
        
        var JS_Sync = jsgui.Class.extend({
            'init': function(spec) {
                
                this.dev_path = spec.dev_path;
                this.packages_path = spec.packages_path;
                
                this.transform_js_dev_to_package = spec.transform_js_dev_to_package;
                this.transform_js_package_to_dev = spec.transform_js_package_to_dev;
                
                this.sense(function(err, res_sense) {
                    
                    // not much in res_sense.
                    
                    // then plan...
                    
                    
                    // but first look at some of the data sensed.
                    
                    console.log('sensing done');
                    
                    
                    
                    
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
            
            
            
            'sense': function(callback) {
                // this function writes to the local model.
                
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
                // map them by paths
                // map 
                        
                // lead these various items.
                this.sense_packages(function() {
                    console.log('packages sensed');
                    
                    // sense the dev files.
                    
                    
                });
                
            }
            
            
        })
        
        if(require.main === module) { 
            
            // carry out the sync process.
            console.log("called directly");
            
            var js_sync = new JS_Sync({
                'packages_path': '../../github',
                'dev_path': './'
            });
            
        }
        else {
            //console.log("required as a module");
        }
        
        
        return JS_Sync;
    }
);

