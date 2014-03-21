if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../core/jsgui-lang-essentials', 'fs', 'path', '../fs/jsgui-node-file-metadata', './rectangle_sheet.js'], 
    function(jsgui, fs, path, jsgui_file_metadata, RectangleSheet) {
        var tof = jsgui.tof, each = jsgui.each;
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
        /*
        // var RectangleSheet = require('./rectangle_sheet.js');
        var res = {
            
            'from_files': function(sources_path, callback) {
                // could process these files sequentially when there is an array of them.
                var that = this;
                //console.log('source_path ' + source_path);
                //console.log('tof(source_path) ' + tof(source_path));
                
                // load the files' metadata
                
                // then arrange them.
                
                // use RectangleSheet with the image metadata.
                
                jsgui_file_metadata.from_file(sources_path, function(err, res_metadata) {
                    // need to separate out the images.
                    
                    // sort them by extensions.
                    var arr_images = [];
                    each(res_metadata, function(i, v) {
                        if (v.extension == '.png') {
                            arr_images.push(v);
                        }
                    });
                    
                    
                    // then use RS with arr_images.
                    
                    // sort the images by height.
                    
                    arr_images.sort(function(a, b){
                        return b.height - a.height;
                    });
                    
                    console.log('arr_images ' + stringify(arr_images));
                    
                    
                    
                });
                
                
                
                
			}
            
        };
        
        
        return res;
        */
        
        // Returns a function that arranges the sprites, from the sources path array.
        
        // Needs to operate from the file system,
        //  more importantly needs to operate on the metadata itself...
        
        // May want to arrange it from sources_paths or from image_metadata.
        
        var arrange = {
            'from_files': function(sources_path, callback) {
                // could process these files sequentially when there is an array of them.
                var that = this;
                //console.log('sources_path ' + sources_path);
                //console.log('tof(source_path) ' + tof(source_path));
                
                // load the files' metadata
                
                // then arrange them.
                
                // use RectangleSheet with the image metadata.
                
                var that = this;
                
                jsgui_file_metadata.from_file(sources_path, function(err, res_metadata) {
                    // need to separate out the images.
                    //console.log('res_metadata ' + stringify(res_metadata));
                    var arrangement = that.from_metadata(res_metadata);
                    //console.log('arrangement ' + stringify(arrangement));
                    callback(null, arrangement);
                    
                    
                    
                    
                    
                });
            
            },
            'from_metadata': function(metadata) {
                //console.log('from_metadata ' + metadata);
            
                // sort them by extensions.
                var arr_images = [];
                
                each(metadata, function(i, v) {
                    if (v.extension == '.png') {
                        arr_images.push([i, v]);
                    }
                });
                
                
                // then use RS with arr_images.
                
                // sort the images by height.
                
                arr_images.sort(function(a, b){
                    return b[1].height - a[1].height;
                });
                
                //console.log('arr_images ' + stringify(arr_images));
                
                
                // then use that array of images to arrange the sprite.
                //  should be fine for reading through the sprite metadata, need to adapt RectangleSheet.
                
                
                var maxHeight = parseInt(arr_images[0][1].height + arr_images[0][1].height / 2);
                var totalWidth = 0;
                
                each(arr_images, function(i, v){
                    totalWidth += v[1].width;
                });
                
                //console.log('totalWidth ' + totalWidth);
                //console.log('maxHeight ' + maxHeight);
                
                //this.sheet =  new RectangleSheet({width:totalWidth, height: maxHeight});
                var rs = new RectangleSheet({'width': totalWidth, 'height': maxHeight});
                //console.log('pre pack');

                //console.log('arr_images')

                var packed = rs.pack(arr_images, function(r1, r2) {
                    //console.log('cb packed');


                });
                //console.log('post pack');
                
                // when packed... need to also have the size of the whole result coords.
                
                
                var size = [rs.width, rs.height];
                var res = [size, packed];
                /*
                
                rs.pack(arr_images, function(packed_images) {
                    //console.log('packed_images ' + stringify(packed_images));
                    
                    callback(null, packed_images);
                    
                });
                */
                
                return res;
                
            }
               
        }
        
        
        
        return arrange;
    }
);
