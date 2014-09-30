if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../../core/jsgui-lang-essentials', 'fs', 'path', 'jsgui-node-file-metadata', 'jsgui-node-png', 'phantomjs'],
    function(jsgui, fs, path, jsgui_file_metadata, jsgui_node_png, phantomjs) {
        var tof = jsgui.tof, each = jsgui.each;
        var stringify = jsgui.stringify;
        
        
        // Image conversion takes place in JavaScript.
        //  This will be fairly versitile, but much of the nuts and bolts will be in other modules.
        
        // Basically load an image, possibly transform it, then save it according to specified parameters.
        
        
        // Automatic lossless compression.
        // Lossy compression will have to be specified.
        
        // imgconvert img1.svg -f png      [default is png32, but could intelligently choose a palette and automatically compress losslessly]
        // imgconvert img1.svg -f png24
        // imgconvert img1.svg -f png32
        
        
        
        var imgconvert = {
            
            // Could directly process streams or image buffers.
            //  Will need to load a PNG or whatever image from its stream using the appropriate module.
            
            
            // need to convert individual file
            
            
            
            // convert individual file stream.
            
            // want to stream in a PNG, and stream out rgba.
            //  That way we can avoid loading the whole PNG image.
            //   Will save memory.
            
            // will just load the PNG for the moment.
            
            // will work on single file at the moment too.
            
            
            
            
            
            
            
            'from_file': function(source_path, output_options, callback) {
                // could process these files sequentially when there is an array of them.
                var that = this;
                //console.log('source_path ' + source_path);
                //console.log('tof(source_path) ' + tof(source_path));
                
                // load the files' metadata
                
                // then arrange them.
                
                // use RectangleSheet with the image metadata.
                
                
                // jsgui-node-png - can it convert directly?
                //  can it load directly?
                
                // would be really nice to get an SVG into an ARGB buffer.
                
                jsgui_file_metadata.from_file(sources_path, function(err, file_metadata) {
                    // need to separate out the images.
                    
                    //file_metadata
                    
                    // depending on the format...
                    //  converting an SVG to a PNG.
                    
                    // would mean rendering it with Webkit I think.
                    
                    
                    
                    
                    
                    
                    
                    
                });
            
            },
            'from_metadata': function(metadata) {
                
            
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
                
                var packed = rs.pack(arr_images);
                
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
        
        return imgconvert;
    }
);
