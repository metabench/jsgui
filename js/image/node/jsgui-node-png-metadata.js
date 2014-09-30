if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../../core/jsgui-lang-essentials', 'fs', 'path'],
    function(jsgui, fs, path) {
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
            'from_stream': function(stream, callback) {
                // could possibly be given the file size.
                
                // would also calculate the stream's size.
                
                // need to know the size to create the buffer?
                
                // don't return the file size in this case?
                var data_num = 0;
                
                //var small_buffer = new Buffer(40);
                
                stream.on('data', function(data) {
					
                
                    //console.log("Found some data! data.length " + data.length);
                    
                    // first data reception always contains metadata?
                    
                    
                    
                    //  that is the amount in the buffer...
                    
                    // The amount given in the buffer here may not be the full chunk.
                    //  If it is not the full chunk, we need to copy what we do have into a temporary buffer, and
                    //   then use that as well as the next data for reading the PNG chunk.
                    
                    
                    
                    
                    //console.log('data_num ' + data_num);
                    //console.log('');
                    //png_pos
                    
                    // move through the data... we'll keep in sync with the chunks.
                    
                    
                    var found_IHDR_chunk = function(chunk_buffer) {
                        var chunk_length = chunk_buffer.readUInt32BE(0);
                        console.log('IHDR chunk_length ' + chunk_length);
                        
                        // extract various values from it.
                        // could set them in an FSM.
                        
                        var img_width = chunk_buffer.readUInt32BE(8);
                        var img_height = chunk_buffer.readUInt32BE(12);
                        
                        //console.log('img_width ' + img_width);
                        //console.log('img_height ' + img_height);
                        
                        bit_depth = chunk_buffer.readUInt8(16);
                        color_type = chunk_buffer.readUInt8(17);
                        var compression_method = chunk_buffer.readUInt8(18);
                        var filter_method = chunk_buffer.readUInt8(19);
                        var interlace_method = chunk_buffer.readUInt8(20);
                        
                        console.log('bit_depth ' + bit_depth);
                        console.log('color_type ' + color_type);
                        console.log('compression_method ' + compression_method);
                        console.log('filter_method ' + filter_method);
                        console.log('interlace_method ' + interlace_method);
                        //var chunk_crc = data.readUInt32BE(29);
                        //console.log('chunk_crc ' + chunk_crc);
                        
                        var obj_metadata = {
                            'width': img_width,
                            'height': img_height,
                            'bit_depth': bit_depth,
                            'color_type': color_type,
                            'compression_method': compression_method
                        }
                        
                        found_metadata(obj_metadata);
                        src.pause();
                        src.destroy();
                    }
                    
                    
                    
                    if (data_num == 0) {
                        // we start by finding the PNG signature and the first chunk.
                        
                        // Directly read from the PNG header.
                        
                        var img_width = data.readUInt32BE(16);
                        var img_height = data.readUInt32BE(20);
                        
                        bit_depth = data.readUInt8(24);
                        color_type = data.readUInt8(25);
                        var compression_method = data.readUInt8(26);
                        var filter_method = data.readUInt8(27);
                        var interlace_method = data.readUInt8(28);
                        
                        var obj_metadata = {
                            'width': img_width,
                            'height': img_height,
                            'bit_depth': bit_depth,
                            'color_type': color_type,
                            'compression_method': compression_method
                        }
                        
                        stream.pause();
                        stream.destroy();
                        
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
                            
                            
                            
                        }
                    
                    
                    });
                }
			}
                
            
            
            
        };
        
        
        return res;
        
        
        
    }
);
