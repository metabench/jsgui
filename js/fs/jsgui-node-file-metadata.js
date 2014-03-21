if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../core/jsgui-lang-essentials', 'fs', 'path', '../image/jsgui-node-png-metadata'], 
    function(jsgui, fs, path, png_metadata) {
        var tof = jsgui.tof, each = jsgui.each;
        // Just reads the metadata.
        /*
        var PNG_Metadata = jsgui.Class.extend({
            'init': function(spec) {
                
            }
            
            
            
            
            
        })
        */
        
        // Read from file.
        // Read from stream.
        // Read from buffer.??
        
        
        var res = {
            // Think we need to do this from a file, or at least know the file type
            //  or extension
            
            
            // but if given an array of files, can get the metadata for each of them.
            
            
            
            'from_file': function(source_path, callback) {
                // could process these files sequentially when there is an array of them.
                var that = this;
                //console.log('source_path ' + source_path);
                //console.log('tof(source_path) ' + tof(source_path));
                
                if (tof(source_path) == 'array') {
                    var fns = [];
                    var res = {};
                    each(source_path, function(i, v) {
                        fns.push([that, that.from_file, [v], function(err, file_metadata) {
                            
                            if (!err) {
                                res[v] = file_metadata;
                            }
                            
                        }]);
                    });
                    
                    // but these get their results in the callback...
                    
                    jsgui.call_multiple_callback_functions(fns, function(err, res_multi) {
                        callback(null, res);
                    });
                    
                } else if (tof(source_path) == 'string') {
                    
                        
                    // could deal with multiple files.
                    //var that = this;
                    fs.stat(source_path, function(err, stats) {
                        if (err) {
                            
                        } else {
                            var size = stats.size;
                            
                            //console.log('size ' + size);
                            
                            var ext = path.extname(source_path);
                            
                            if (ext == '.png') {
                                png_metadata.from_file(source_path, callback);
                            } else {
                                if (stats.isDirectory()) {
                                    var res = {
                                        'is_directory': true
                                    };
                                } else {
                                    var res = {
                                        'size': size,
                                        'extension': ext
                                    };
                                }
                                callback(null, res);
                                
                            }
                            
                            
                            // General PNG reading code.
                            //  Perhaps I will have an event driven PNG reader, so that it calls a function when it
                            //  has read more pixels from the PNG.
                            
                            // Being able to give or pipe it a buffer would be useful.
                            //   Also, would be useful to only read the first part of the PNG rather than the whole thing.
                            
                            // Then use the specific metadata reader's 
                            
                            
                            /*
                            
                            fs.open(source_path, 'r', function(err, fd) {
                                if (err) {
                                    
                                } else {
                                    var src = fs.createReadStream(source_path);
                                    
                                
                                    that.from_stream(src, function(err, res) {
                                        if (err) {
                                        
                                        } else {
                                            res.size = size;
                                            callback(null, res);
                                        }
                                        
                                    });
                                }
                            });
                            */
                            
                            
                        }
                    
                    
                    });
                }
			}
                
            
            
            
        };
        
        
        return res;
        
        
        
    }
);
