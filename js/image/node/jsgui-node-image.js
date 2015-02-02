

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


define(['../../core/jsgui-lang-essentials', 'fs', 'path', 'zlib', './jsgui-node-png'],
    function(jsgui, fs, path, zlib, jsgui_node_png) {
        
        var stringify = jsgui.stringify, each = jsgui.each, is_defined = jsgui.is_defined;
        
        // maybe has an Image object?
        
        // but importantly, we want to be able to load and save images, eventually using various formats,
        //  converting between rgba buffers and the encoded images.
        
        // Want to work on PNG handling and the test suite.
        
        // Load an image...
        //  Maybe call it rgba image
        //  Or Raster_Image
        
        // It will use the rgba buffer.
        
        // We'll use this to load images from disk, into that buffer.
        //  Can load SVGs through the use of jsgui-node-render-svg.
        
        // Will have static methods to begin with.
        
        var load_rgba_buffer_from_disk = function(source_path, callback) {
            // load the whole thing into a buffer.
            
            // will see what type of image it is, maybe look at extension.
            
            // then use the appropriate image module to load it.
            
            var ext = path.extname(source_path);
            
            if (ext == '.png') {
                //console.log('pre jsgui_node_png.load_pixel_buffer_from_disk');
                jsgui_node_png.load_pixel_buffer_from_disk(source_path, callback);
            } else {
                throw 'currently unsupported extension';
            }
            
            // and for other files...?
            // it it is an SVG, we can change it to a PNG stream, and load the rgba buffer from that stream.
            
        }
        
        var res = {
            'load_rgba_buffer_from_disk': load_rgba_buffer_from_disk
            
        }
        return res;
    }
);

