if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../core/jsgui-lang-essentials', 'fs', 'path', 'musicmetadata'], 
    function(jsgui, fs, path, musicmetadata) {
        var tof = jsgui.tof, each = jsgui.eac;
        var exec = require('child_process').exec;
        var stringify = jsgui.stringify;
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


        var parse_property_values = function(str_val) {
            var rx_kvp = /^(\w+):\s?([\w\./:\s]+\s?)+/;
            var match = str_val.match(rx_kvp);
            //console.log('match ' + stringify(match));
            
            var res = [];
            if (match) {
                // let's see if we can parse the value.
                //  if it's a duration, maybe other values, we can parse it to ms.
                //   and just keep it as an ms integer.
                
                // likely to be operating a metadata cache on the filesystem.
                //  will create metadata as a background task.
                
                // likely to store this metadata in its own database.
                //  I think that does make sense. Quick to update that, quick to access it, separate from file system.
                //   Tokyo Cabinet seems like a good possibility for that.
                //   Mongo may make more sense, faster to set up.
                
                var rx_ffmpeg_time = /^(\d\d):(\d\d):(\d\d)\.(\d\d)$/;
                
                var name = match[1];
                var value = match[2];
                
                var match_ft = value.match(rx_ffmpeg_time);
                //console.log('match_ft ' + stringify(match_ft));
                
                if (match_ft) {
                    var h = parseInt(match_ft[1]);
                    var m = parseInt(match_ft[2]);
                    var s = parseInt(match_ft[3]);
                    var ms = parseInt(match_ft[4]) * 10;
                    
                    //console.log('h ' + h);
                    //console.log('m ' + m);
                    //console.log('s ' + s);
                    //console.log('ms ' + ms);
                    
                    var total_min = m + (h * 60);
                    var total_s = s + (total_min * 60);
                    var total_ms = ms + (total_s * 1000);
                    
                    //var t = ms + (s + (m + (h * 60) * 60) * 1000); 
                    //console.log('total_ms ' + total_ms);
                    
                    res.push(['ms_' + name.toLowerCase(), total_ms]);
                    
                } else {
                    res.push([name, value]);
                }
            }
            return res;
        }

        
        var Audio_Metadata = {

            // Need to respond to different types of files / streams.
            //  MP3 to start with.




            'from_stream': function(stream, callback) {
                // could possibly be given the file size.
                
                // would also calculate the stream's size.
                
                // need to know the size to create the buffer?
                
                // don't return the file size in this case?
                var data_num = 0;
                
                //var small_buffer = new Buffer(40);
                
                stream.on('data', function(data) {


                    
                    
                    
                    if (data_num == 0) {
                        console.log('data.length', data.length);

                        
                        stream.pause();
                        stream.destroy();

                        var obj_metadata = {};
                        
                        callback(null, obj_metadata);
                        
                    }
                    // then read through all the chunks.
                    
                    data_num++;
                  //writeStream.write(textData);
                });

                // the reading is finished...
                stream.on('close', function () {
                    // It should have been processing the data recieved.
                    
                    //writeStream.end(); // ...close up the write, too!
                    //console.log("src finished.");
                });
                
				
            },
            
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
                            
                            // General PNG reading code.
                            //  Perhaps I will have an event driven PNG reader, so that it calls a function when it
                            //  has read more pixels from the PNG.
                            
                            // Being able to give or pipe it a buffer would be useful.
                            //   Also, would be useful to only read the first part of the PNG rather than the whole thing.
                            
                            // Duration not being obtained with musicmetadata.
                            //  I think actually measuring it with FFMPEG is best.

                            // need to deal with windows paths too?

                            console.log('source_path', source_path);



                            exec("ffmpeg -analyzeduration 1000000000 -i " + source_path, function(err, stdout){
                                if (err) {
                                    //console.log('err ' + err);

                                    // Getting metadata from this output may not be so reliable

                                    // this fails anyway, it's not outputting anything like FFMPEG expects.
                                    // the error contains the needed info.
                                    var str_err = err.toString();
                                    var s1 = 'Input #';
                                    var pos1 = str_err.indexOf(s1) + s1.length;
                                    var s2 = 'At least';
                                    var pos2 = str_err.indexOf(s2);
                                    var extract = str_err.substring(pos1, pos2);
                                    //console.log('extract ' + extract);
                                    
                                    var s3 = 'Metadata:';
                                    var pos3 = extract.indexOf(s3) + s3.length;
                                    var str_md = extract.substring(pos3);
                                    //console.log('str_md', str_md);

                                    // different new line character on Windows and Unix.


                                    var split = str_md.split('\n');

                                    //console.log('split ' + stringify(split));
                                    
                                    var lines2 = [];
                                    
                                    var res_properties = {};
                                    
                                    each(split, function(v, i) {
                                        //console.log('v ' + v);
                                        // run them through a regex that strips extra spaces / tabs
                                        var rx_extra_spc_detect = /\t/g;
                                        var v2 = v.replace(rx_extra_spc_detect, '');
                                        
                                        var rx2 = /^ +/g;
                                        v2 = v2.replace(rx2, '');
                                        
                                        var rx3 = / {2,}/g;
                                        v2 = v2.replace(rx3, ' ');
                                        
                                        var rx4 = / :/g;
                                        v2 = v2.replace(rx4, ':');
                                        
                                        var rx5 = /\n|\r$/g;
                                        v2 = v2.replace(rx5, '');
                                        
                                        //console.log('v2 ' + stringify(v2));
                                        // file_s_url = file_s_url.replace(/(\/)/g, '\\');
                                        
                                        var pv = parse_property_values(v2);
                                        each(pv, function(nvp, i) {
                                            var name = nvp[0];
                                            var value = nvp[1];
                                            
                                            //console.log('name ' + name);
                                            //console.log('value ' + value);
                                            res_properties[name] = value;
                                        })
                                    })
                                    //return res_properties;
                                    callback(null, res_properties);
                                } else {
                                    //var output = stdout.toString();
                                    //console.log('output ' + output);
                                }
                                //socket.emit('Done', {'Image' : 'Video/' + Name + '.jpg'});
                            });
                        }
                    });
                }
            },
            
            '_from_file': function(source_path, callback) {
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
                            
                            // General PNG reading code.
                            //  Perhaps I will have an event driven PNG reader, so that it calls a function when it
                            //  has read more pixels from the PNG.
                            
                            // Being able to give or pipe it a buffer would be useful.
                            //   Also, would be useful to only read the first part of the PNG rather than the whole thing.
                            
                            var parser = musicmetadata(fs.createReadStream(source_path));
                            parser.on('metadata', function (result) {
                                //console.log(result);
                                result.size = size;
                                callback(null, result);
                            });
                            /*
                            fs.open(source_path, 'r', function(err, fd) {
                                if (err) {
                                    
                                } else {
                                    var src = fs.createReadStream(source_path);
                                    var ext = path.extname(source_path);
                                
                                    that.from_stream(src, function(err, res) {
                                        if (err) {
                                        
                                        } else {
                                            res.size = size;
                                            res.extension = ext;
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
        
        
        return Audio_Metadata;
        
        
        
    }
);
