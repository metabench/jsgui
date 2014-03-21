if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

var cpp_mod = require("./build/Release/binding.node");

// Want to add greyscale support.

// Also need to test with paletted images.

// Will also do do lossless conversion from RGB(A) to paletted.

// I think a few more things will need to be done to get this to work correctly on indexed color.


// could also use image_buffer...
//  will get a new image_buffer from a PNG.

//  will also load an image_buffer from 

// May need more work on PNGs with palettes.
//  Have been working on truecolor 32 and 24 and filter handling.

// Faster choice of optimized scanline filters would be good as well.
//  Calling node's deflate on each scanline is a bit slow.
//  Thinking about counting unique 4 byte words (readUInt32 results).
//   Then the one with least variation would be the one to use.

// PNGs are coming along nicely... but want the main JSGUI server to run.



define(['../core/jsgui-lang-essentials', 'fs', 'zlib', '../misc/CrcStream', './jsgui-node-pixel-buffer',
    './build/Release/binding.node'], 
    function(jsgui, fs, zlib, CrcStream, Pixel_Buffer, cpp_mod) {
        
        var stringify = jsgui.stringify, each = jsgui.each, is_defined = jsgui.is_defined;
        var fp = jsgui.fp, tof = jsgui.tof;
        var Fns = jsgui.Fns;
        var arrayify = jsgui.arrayify;
        
        
        
        //var get_deflated_length = arrayify(function(buffer, callback) {
        var get_deflated_length = (function(buffer, callback) {
            var deflate = zlib.createDeflate({
                chunkSize: 32 * 1024,
                level: 9,
                strategy: 3,
                windowBits: 15,
                memLevel: 9
            });
            //deflate.on('error', this.emit.bind(this, 'error'));
            deflate.on('error', function() {
                //console.log('deflate error');
            });
    
            //var buffers = [];
            var nread = 0;
        
            var that = this;
        
            deflate.on('data', function(chunk) {
                nread = nread + chunk.length;
            });
            deflate.on('end', function() {
                callback(null, nread);
            });
            deflate.end(buffer);
        });
        
        
        
        
        /*

PNG starts with an 8 byte signature

137	    A byte with its most significant bit set (``8-bit character'')
80	    P
78  	N
71	    G
13	    Carriage-return (CR) character, a.k.a. CTRL-M or ^M
10	    Line-feed (LF) character, a.k.a. CTRL-J or ^J
26	    CTRL-Z or ^Z
10	    Line-feed (LF) character, a.k.a. CTRL-J or ^J

137, 80, 78, 71, 13, 10, 26, 10

Then it has chunks

PNG Chunks
----------        
IHDR
    Header, metadata
gAMA
    Gamma correcton
PLTE
    Palette
tRNS
    Transparency
IEND
    End               

PNG color options
-----------------

Bits per pixel
--------------
Color option	Channels	Bits per channel
                    1	2	4	8	16
Indexed	            1	1	2	4	8	
Grayscale	        1	1	2	4	8	16
Grayscale & alpha	2				16	32
Truecolor	        3				24	48
Truecolor & alpha	4				32	64

PNG color types
---------------
Color
type	Name	Binary	Masks
 	A	C	P
0	Grayscale   	                0	0	0	0	 
1	(Indexed grayscale)	            0	0	0	1	palette
2	Truecolor	                    0	0	1	0	color
3	Indexed	                        0	0	1	1	palette
4	Grayscale & alpha       	    0	1	0	0	alpha
5	(Indexed grayscale & alpha)	    0	1	0	1	palette
6	Truecolor & alpha	            0	1	1	0	color
7	(Indexed & alpha)	            0	1	1	1	color | palette


Type byte	Filter name	Predicted value
0	        None	    Zero (so that the raw byte value passes through unaltered)
1	        Sub	        Byte A (to the left)
2	        Up	        Byte B (above)
3	        Average	    Mean of bytes A and B, rounded down
4	        Paeth	    A, B, or C, whichever is closest to p = A + B − C

PNG compression method 0 
(the only compression method presently defined for PNG) specifies deflate/inflate compression with a 32K sliding window.
        */
        
        var paeth_predictor = function(left, above, above_left) {
            var p = left + above - above_left,
                p_left = Math.abs(p - left),
                p_above = Math.abs(p - above),
                p_above_left = Math.abs(p - above_left);
        
            if (p_left <= p_above && p_left <= p_above_left) {
                return left;
            }
            else if (p_above <= p_above_left) {
                return above;
            }
            return above_left;
        };
        
        // Buffers read asyncronously... or some other things do here.

        // extend Binary_File_Wrapper?
        
        var PNG = jsgui.Class.extend({
            'init': function(spec) {
                // size
                
                //  ?? no file size right now. could have a loaded_file_size.
                // file_size
                
                // size
                
                this.map_unfiltered_scanline_buffers = {};
                
                // when initialized with the size, will create a buffer
                
                if (spec.size) {
                    this.size = spec.size;
                }
                
                if (spec.color_type) {
                    this.color_type = spec.color_type;
                }
                
                if (spec.bit_depth) {
                    this.bit_depth = spec.bit_depth;
                }
                
                if (this.size && this.color_type && this.bit_depth) {
                    this.init_scanlines_buffer(this.size, this.color_type, this.bit_depth);
                }
                // Can create a new scanlines buffer when initialized.
                // maybe only if the bit depth and color mode are specified.
            },
            
            // this one holds the actual data. A different one would hold the uncompressed data.
            //  Perhaps forget about this buffer once the data has been decompressed?
            'init_scanlines_buffer': function(size, color_type, bit_depth) {
                
                var scanline_image_data_length;
                var that = this;
                // and depends on the color mode.
                
                if (bit_depth == 1) {
                    scanline_image_data_length = Math.ceil(size[0] / 8);
                }
                if (bit_depth == 2) {
                    scanline_image_data_length = Math.ceil(size[0] / 4);
                }
                if (bit_depth == 4) {
                    scanline_image_data_length = Math.ceil(size[0] / 2);
                }
                if (bit_depth == 8) {
                    if (color_type == 2) {
                        scanline_image_data_length = size[0] * 3;
                    } else if (color_type == 6) {
                        scanline_image_data_length = size[0] * 4;
                    }
                }
            
                // bit depth 16...
                //  was not expecting that. greyscale of some kind.
                
                
                //console.log('scanline_image_data_length ' + scanline_image_data_length);
                
                // scanline_length depends on the number of bits per pixel.
                
                var scanline_length = scanline_image_data_length + 1;
                
                //console.log('scanline_length ' + scanline_length);
                
                that.scanline_image_data_length = scanline_image_data_length;
                that.scanline_length = scanline_length;
                
                var scanlines_buffer_length = that.scanline_length * that.size[1];
                that.scanlines_buffer_length = scanlines_buffer_length;
                
                var scanlines_buffer = new Buffer(scanlines_buffer_length);
                that.scanlines_buffer = scanlines_buffer;
                
            },
            
            // Want to be able to get and set pixels.
            //  Also want to be able to use this for the spritesheet, so the pixels can get composed in a pixel buffer,
            //  and then saved as a PNG.
            
            
            // want to be able to change what filter is used on any row.
            //  when doing that, will make a map of unfiltered data (pixels data? buffer?)...
            
            // Maybe hold things internally in an RGBA buffer?
            //  Need to be able to get the unfiltered scanline values when encoding.
            
            // Therefore need to store unfiltered scanlines...
            
            // Changing the filtering used on a scanline...
            
            // Need to be able to get any pixel... would require decoding things.
            //  I think maintaining a map of unfiltered/defiltered scanlines makes the most sense.
            //   ??? maybe not for garbage collection. Will do it though.
            
            //   They can be obtained as needed.
            //   The function get_unfiltered_scanline_buffer will be used to get them.
            
            // get_px will get the pixel from the unfiltered scanline buffer.
            // set_px will ensure the unfiltered scanline buffer exists, and set it there.
            //  (subsequent scanlines need to be updated as appropriate)
            // Want to be able to change individual line filters.
            //  May have ability to set a few of them at once. Will then remake the filtered scanlines (as needed).
            //   Possibly before reading a pixel that will have been updated?
            //   Having the filtered scanlines update automatically???
            //    Would then be able to test how compressable the data is
            
            // when setting a scanline filter, will need to update the filtered rows below?
            //  
            
            
            // When changing the scanline filter used... need to label that the scanline needs updating.
            //  Could automatically reencode all scanlines upon save.
            
            // I think a map_scanlines_changed object will help.
            //  When a scanline has been changed it should be marked as such.
            
            
            // Reencoding the whole image before it gets saved...
            
            // Reencoding parts of the image after a change, would be more efficient regarding CPU.
            //  Could get fairly finely grained about that, not sure if it is worth it right now.
            
            // apply scanline filter to all rows...
            
            // set the scanline filter on a row, but first cache its unfiltered scanline buffer
            
            'set_scanline_filter_all_rows': function(scanline_filter_num) {
                //console.log('set_scanline_filter_all_rows');
                var h = this.size[1];
                for (var y = 0; y < h; y++) {
                    this.set_scanline_filter(y, scanline_filter_num);
                }
            },
            // set_scanline_filter_byte
            
            'set_scanline_filter': function(scanline_num, scanline_filter_byte) {
                //this.map_unfiltered_scanline_buffers[scanline_num] = this.get_unfiltered_scanline_buffer(scanline_num);
                
                //console.log('set_scanline_filter');
                this.set_scanline_filter_byte(scanline_num, scanline_filter_byte);
                
                // And then when saving it it should be 
            },
            
            // More work on the save function needed... needs to reencode each scanline.
            
            'set_scanline_filter_byte_all_rows': function(scanline_filter_num) {
                var h = this.size[1];
                for (var y = 0; y < h; y++) {
                    this.set_scanline_filter_byte(y, scanline_filter_num);
                }
            },
            
            // set_scanline_filter_byte
            
            'set_scanline_filter_byte': function(scanline_num, scanline_filter_byte) {
                if (!this.scanline_length) {
                    //throw '!!stop';
                    //console.log('this.bit_depth ' + this.bit_depth);
                    if (this.bit_depth == 8) {
                        //console.log('this.color_type ' + this.color_type);
                        if (this.color_type == 2) {
                            this.scanline_length = this.size[0] * 3 + 1;
                        }
                        if (this.color_type == 6) {
                            this.scanline_length = this.size[0] * 4 + 1;
                        }
                    } else {
                        throw 'currently unsupported';
                    }
                }
                
                //console.log('scanline_length ' + this.scanline_length);
                //throw 'stop';
                var h = this.size[1], scanline_length = this.scanline_length, scanlines_buffer = this.scanlines_buffer;
                var scanline_start = scanline_num * scanline_length;
                scanlines_buffer.writeUInt8(scanline_filter_byte, scanline_start);
            },
            
            // Will look into the heuristics for choosing a scanline filter.
            // Will be able to apply scanline filters outside of the save process.
            
            'get_scanline_filter_byte': function(scanline_num) {
                //console.log('get_scanline_filter_byte scanline_num ' + scanline_num);
                var h = this.size[1], scanline_length = this.scanline_length, scanlines_buffer = this.scanlines_buffer;
                var scanline_start = scanline_num * scanline_length;
                //console.log('scanline_num ' + scanline_num);
                //console.log('scanline_length ' + scanline_length);
                //console.log('scanline_start ' + scanline_start);
                var scanline_filter_byte = scanlines_buffer.readUInt8(scanline_start);
                return scanline_filter_byte;
            },
            
            // calc
            
            'get_filtered_scanline_buffer': function(scanline_num) {
                // may re-encode it... not sure.
                // It would not need reencoding at all times.
                // consult a map of which have changed?
                throw 'Not yet implemented... will return the existing scanline buffer if it has been unchanged.';
            },
            // ?
            'calc_filtered_scanline_buffer': function(scanline_num) {
                // may re-encode it... not sure.
                
                // It would not need reencoding at all times.
                // consult a map of which have changed?
                //throw 'Not yet implemented... will return the existing scanline buffer if it has been unchanged.'
                
                // do this over each row?
                // or reencode all rows?
                
                
            },
            
            // get_rgba_pixel_buffer...
            //  will iterate through the pixels, copying to that buffer.
            //  alternatively will copy from the unfiltered scanline buffer when in color mode 6.
            
            'get_rgba_pixel_buffer': function() {
                // could be optimized (maybe just for some cases).
                // can optimize this a lot.
                //  when in the right mode, can almost read this out of the unfiltered scanlines buffer.
                
                // A C++ function could speed this up a lot, with the buffer copying.



                var res = new Pixel_Buffer({
                    'size': this.size
                });
                
                var color_type = this.color_type;
                
                // without iterating the pixels?
                //  having that inline would speed it up (a lot).
                
                var dest_buffer = res.buffer;
                
                //console.log('get_rgba_pixel_buffer color_type ' + color_type);
                
                // Slower here I think.
                // color_type 0: greyscale

                // also need to interate indexed color and indexed color with alpha.

                // different pixel iterators depending on the number of bits per pixel.
                if (color_type == 0) {
                    // each pixel is a greyscale sample
                    // each pixel has a single value
                    // have a multiple to get from the pixel value to something up to 256.

                    // Iterating through the pixels is slow.
                    //  Could it be faster if C++ raised the callback?
                    //   Or we pass a function into C++ for it to call? The same thing.

                    // Maybe doing some colour change algorithms on rgba buffers to start with is best.





                    this.iterate_pixels(function(x, y, pixel_value) {
                        // set the red, green, blue value to each of them?
                        //console.log('pixel_value ' + pixel_value);

                    });

                }
                
                if (color_type == 2) {
                    this.iterate_pixels(function(x, y, r, g, b) {
                        //console.log('r ' + r);
                        //console.log('g ' + g);
                        //console.log('b ' + b);
                        
                        //var alpha = 255;
                        
                        //px[3] = 255;
                        res.set_pixel(x, y, r, g, b, 255);
                    });
                } else if (color_type == 6) {


                    // .unfiltered_scanlines_buffer_to_new_rgba_buffer_cpp
                    //  creates the new buffer object...
                    // .copy_unfiltered_scanlines_buffer_to_rgba_buffer_cpp
                    //  copies from what is almost an rgba buffer to an actual one.
                    // means we don't need that loop in JavaScript, I think it can speed things up
                    //  a fair bit.

                    // .copy_unfiltered_scanlines_buffer_32_bpp_to_rgba_buffer_cpp







                    //  would be a quick copy for this specific case.





                    // write directly to the res buffer, using the unfiltered scanlines.
                    // copy to res.buffer.
                    // get the unfiltered scanlines...
                    var dest_buffer_line_length = 4 * this.size[0];
                    var unfiltered_scanlines_buffer_line_length = (4 * this.size[0]) + 1;
                    
                    //var dest_buffer_length = dest_buffer.length;
                    
                    //console.log('old_dest_buffer_length ' + old_dest_buffer_length);
                    //console.log('dest_buffer_length ' + dest_buffer_length);
                    var dest_buffer_start_pos, unfiltered_scanline_buffer;
                    var unfiltered_scanlines_buffer_start_pos;
                    var unfiltered_scanlines_buffer_end_pos;
                    //var get_unfiltered_scanline_buffer = this.get_unfiltered_scanline_buffer;
                    
                    // make sure it has its unfiltered scanlines buffer.
                    //  then copy from parts of that.
                    //  don't want to be creating a buffer for each scanline.
                    
                    this.ensure_unfiltered_scanlines_buffer_cpp();

                    // reverse filtering the whole thing should not take too long.
                    // but will keep track of when different parts of it have been modified.
                    //  with PNGs in memory, may prefer to work on the unfiltered scanlines buffer.
                    //  will need to keep them syncronised with changes.
                    
                    
                    var unfiltered_scanlines_buffer = this.unfiltered_scanlines_buffer;

                    res.buffer = cpp_mod.copy_unfiltered_scanlines_buffer_32_bpp_to_rgba_buffer_cpp(unfiltered_scanlines_buffer, res.buffer, unfiltered_scanlines_buffer_line_length);
                    //console.log('res.buffer.length ' + res.buffer.length);
                    

                    /*
                    for (var c = 0, l = this.size[1]; c < l; c++) {
                        dest_buffer_start_pos = dest_buffer_line_length * c;
                        unfiltered_scanlines_buffer_start_pos = unfiltered_scanlines_buffer_line_length * c;
                        unfiltered_scanlines_buffer_end_pos = unfiltered_scanlines_buffer_start_pos + unfiltered_scanlines_buffer_line_length;
                        
                        //unfiltered_scanline_buffer = this.get_unfiltered_scanline_buffer(c);
                        // buf.copy(targetBuffer, [targetStart], [sourceStart], [sourceEnd])#
                        // don't copy from pos 0.
                        
                        //var uf_len = unfiltered_scanline_buffer.length;
                        //unfiltered_scanline_buffer.copy(dest_buffer, dest_buffer_start_pos, 1);
                        console.log('dest_buffer_start_pos ' + dest_buffer_start_pos);
                        console.log('unfiltered_scanlines_buffer_start_pos ' + unfiltered_scanlines_buffer_start_pos);
                        //console.log('unfiltered_scanlines_buffer_end_pos ' + unfiltered_scanlines_buffer_end_pos);
                        //console.log('unfiltered_scanlines_buffer.length ' + unfiltered_scanlines_buffer.length);
                        
                        unfiltered_scanlines_buffer.copy(dest_buffer, dest_buffer_start_pos, unfiltered_scanlines_buffer_start_pos + 1, unfiltered_scanlines_buffer_end_pos);
                        
                    }
                    */
                    
                    
                    
                    
                    
                } else {
                    this.iterate_pixels(function(x, y, px) {
                        if (px.length == 3) px[3] = 255;
                        res.set_pixel(x, y, px);
                    });
                }
                return res;
            },
            
            // will be used for random access to pixels.
            //  will rapidly change the unfiltered scanlines.
            //  then when saving or accessing the filtered scanlines, will calculate the filtered scanlines.
            
            // May be better to edit this in a local environment and then copy to and from the github directories.
            //  The automated file sync / update will be best.
            
            // Module Staging <-> Development Directory
            // --------------     ---------------------
            //
            // Automatically updates items from each based on the last edit times.
            //  Means that you can keep a bunch of modules in their own github or repo directories.
            //  Also work on them in a directory that contains a whole bunch of modules edited together.
            //   Means a lot of development can be done using the modules locally, and then they can be copied to their package directories
            //    for deployment to github and npm.
            //  Could also have automatic republishing of changed modules.
            
            // 2 way updating... for when I have been working on things within the package folder.
            //  A utility module called 'update' makes sense for this.
            // It knows the path of the packages directory
            
            // development
            // packages.
            
            // localized-deflate is the best scanline optimization so far.
            // I think looking back quite far at a window of previous data would be the best.
            //  Seeing how many recurring patterns are within the proposed unfiltered scanline, and scanlines stretching back a bit.
            //  We could keep track of the window of previous items... but analysing it for groups (n-grams) each time?
            //  Could have some sort of revolving tree?
            //   Would possibly slow it down too much?
            //    What about something efficient somehow?
            //     But want to replicate delate's window to some extent.
            
            
            
            // jsgui-node-update
            
            // a function that gets an unviltered scanline buffer for the whole image...
            //  will be faster than doing it row by row, setting up new variables for each row.
            
            // should not take all that long. will be faster then getting an unfiltered buffer for each scanline.
            //  simpler code than using the r,g,b(,a) components


            
            '_ensure_unfiltered_scanlines_buffer': function() {
                // does it for all scanlines.
                //console.log('ensure_unfiltered_scanlines_buffer');
                // needs to go through the (filtered) scanlines buffer and unfilter them.
                
                // This is the next one to be optimized in C, within C++.
                //  Like the other function, but this one is reverse filtering.





                //console.log('ensure_unfiltered_scanlines_buffer');

                // This also does all of them at once.
                //  May as well do the filtering to start with.


                
                // could check all scanlines first, see if they are all 0.
                //  if so, we may not need to do anything.
                //   need to develop some rules for dealing with this.
                
                var scanline_length = this.scanline_length;

                //console.log('scanline_length ' + scanline_length);

                var scanlines_buffer_length = scanline_length * this.size[1];
                
                if (!this.unfiltered_scanlines_buffer || this.unfiltered_scanlines_buffer.length != scanlines_buffer_length);
                
                this.unfiltered_scanlines_buffer = new Buffer(scanlines_buffer_length);
                this.unfiltered_scanlines_buffer.fill(0);
                //console.log('this.unfiltered_scanlines_buffer.length ' + this.unfiltered_scanlines_buffer.length);
                
                var unfiltered_scanlines_buffer = this.unfiltered_scanlines_buffer;
                
                var w = this.size[0], scanlines_buffer = this.scanlines_buffer;
                var color_type = this.color_type, bit_depth = this.bit_depth;
                var scanline_filter_byte;
                var scanline_start, scanline_end;
                
                var bytes_per_pixel = -1;
                
                if (color_type == 2 && bit_depth == 8) {
                    bytes_per_pixel = 3;
                }
                if (color_type == 6 && bit_depth == 8) {
                    bytes_per_pixel = 4;
                }
                
                var unfiltered_byte_above;
                var unfiltered_byte_left;
                var unfiltered_byte_above_left;
                var byte_above_pos;
                var byte_left_pos;
                var byte_above_left_pos;
                
                var b;
                
                var byte_pos;
                var filtered_byte;
                var unfiltered_byte;
                // maybe variables for byte_above?
                //console.log('bytes_per_pixel ' + bytes_per_pixel);
                //throw 'stop';
                for (var y = 0, h = this.size[1]; y < h; y++) {
                    //console.log('ensure_unfiltered_scanlines_buffer y ' + y);

                    scanline_start = y * scanline_length;
                    scanline_filter_byte = scanlines_buffer.readUInt8(scanline_start);
                    
                    // if we have loaded an image with all scanline filters 0, we can put it directly into the unfiltered buffer.
                    //   Think it would be an optimization at this stage.
                    //   avoiding as many buffer copies.
                    
                    //console.log('scanline_filter_byte ' + scanline_filter_byte);
                    
                    // then need to decode that scanline... going through it byte by byte?
                    //  or could get 4 byte words from it, and use bit shifting, and bit masks possibly to extract various values from it?
                    
                    // or could continue to read the bytes into r, g, b, a as before. i don't think that was taking so long. I think it was all the making of new buffers,
                    //  not sure though. Reading and writing bytes to buffers may be faster than bit shifing. Not sure.
                    //  however, may not need to keep track of rgba, and can more closely follow directions, knowing what offset to do for any byte value.
                    //  what offset backwards, what offset up.
                    
                    //  could have smaller code here.
                    
                    // can start with scanline filtering of 2.
                    
                    // left, above, average, paeth
                    unfiltered_scanlines_buffer.writeUInt8(0, scanline_start);
                    //console.log('uas scanline_filter_byte ' + scanline_filter_byte);
                    if (scanline_filter_byte == 0) {
                        // copy over that scanline
                        //console.log('scanline_start ' + scanline_start);
                        //console.log('scanline_length ' + scanline_length);
                        //console.log('scanline_start ' + typeof scanline_start);
                        //console.log('scanline_length ' + typeof scanline_length);
                        //console.log('scanline_start + scanline_length ' + (scanline_start + scanline_length));

                        var scanline_end = scanline_start + scanline_length;

                        // Looks like buffer has had its syntax changed.

                        scanlines_buffer.copy(unfiltered_scanlines_buffer, scanline_start, scanline_start, scanline_end);
                        
                    } else if (scanline_filter_byte == 1) {
                        for (b = 1; b < scanline_length; b++) {
                            // get the byte above.
                            unfiltered_byte_left = 0;
                            byte_pos = scanline_start + b;
                            if (b >= bytes_per_pixel) {
                                // Are we not trying to ensure the existance of these unfiltered values?
                                //  but maybe we have the previous ones...

                                byte_left_pos = byte_pos - bytes_per_pixel;
                                unfiltered_byte_left = unfiltered_scanlines_buffer.readUInt8(byte_left_pos);
                            }
                            //console.log('unfiltered_byte_left ' + unfiltered_byte_left);
                            filtered_byte = scanlines_buffer.readUInt8(byte_pos);
                            unfiltered_byte = unfiltered_byte_left + filtered_byte;
                            if (unfiltered_byte > 255) unfiltered_byte = unfiltered_byte - 256;
                            unfiltered_scanlines_buffer.writeUInt8(unfiltered_byte, byte_pos);
                        }
                    } else if (scanline_filter_byte == 2) {
                        // above
                        for (b = 1; b < scanline_length; b++) {
                            // get the byte above.
                            unfiltered_byte_above = 0;
                            byte_pos = scanline_start + b;
                            if (y > 0) {
                                byte_above_pos = byte_pos - scanline_length;
                                unfiltered_byte_above = unfiltered_scanlines_buffer.readUInt8(byte_above_pos);
                            }
                            filtered_byte = scanlines_buffer.readUInt8(byte_pos);
                            unfiltered_byte = unfiltered_byte_above + filtered_byte;
                            if (unfiltered_byte > 255) unfiltered_byte = unfiltered_byte - 256;
                            unfiltered_scanlines_buffer.writeUInt8(unfiltered_byte, byte_pos);
                        }
                    } else if (scanline_filter_byte == 3) {
                        // average of up and left.
                        for (b = 1; b < scanline_length; b++) {
                            unfiltered_byte_above = 0;
                            unfiltered_byte_left = 0;
                            byte_pos = scanline_start + b;
                            if (y > 0) {
                                byte_above_pos = byte_pos - scanline_length;
                                unfiltered_byte_above = unfiltered_scanlines_buffer.readUInt8(byte_above_pos);
                            }
                            if (b >= bytes_per_pixel) {
                                byte_left_pos = byte_pos - bytes_per_pixel;
                                unfiltered_byte_left = unfiltered_scanlines_buffer.readUInt8(byte_left_pos);
                            }
                            filtered_byte = scanlines_buffer.readUInt8(byte_pos);
                            unfiltered_byte = filtered_byte + Math.floor((unfiltered_byte_above + unfiltered_byte_left) / 2);
                            if (unfiltered_byte > 255) unfiltered_byte = unfiltered_byte - 256;
                            unfiltered_scanlines_buffer.writeUInt8(unfiltered_byte, byte_pos);
                        }
                    } else if (scanline_filter_byte == 4) {
                        //paeth
                        for (b = 1; b < scanline_length; b++) {
                            unfiltered_byte_above = 0;
                            unfiltered_byte_left = 0;
                            unfiltered_byte_above_left = 0;
                            byte_pos = scanline_start + b;
                            if (y > 0) {
                                byte_above_pos = byte_pos - scanline_length;
                                unfiltered_byte_above = unfiltered_scanlines_buffer.readUInt8(byte_above_pos);
                            }
                            if (b >= bytes_per_pixel) {
                                byte_left_pos = byte_pos - bytes_per_pixel;
                                unfiltered_byte_left = unfiltered_scanlines_buffer.readUInt8(byte_left_pos);
                            }
                            if (y > 0 && b >= bytes_per_pixel) {
                                byte_above_left_pos = byte_pos - bytes_per_pixel - scanline_length;
                                unfiltered_byte_above_left = unfiltered_scanlines_buffer.readUInt8(byte_above_left_pos);
                            }
                            filtered_byte = scanlines_buffer.readUInt8(byte_pos);
                            unfiltered_byte = filtered_byte + paeth_predictor(unfiltered_byte_left, unfiltered_byte_above, unfiltered_byte_above_left);
                            if (unfiltered_byte > 255) unfiltered_byte = unfiltered_byte - 256;
                            unfiltered_scanlines_buffer.writeUInt8(unfiltered_byte, byte_pos);
                        }
                    }
                }
                
                //for (var c = 0, l = this.unfiltered_scanlines_buffer.length; c < l; c++) {
                //    console.log('uf val ' + this.unfiltered_scanlines_buffer.readUInt8(c));
                //}
                
                //throw 'stop';
                
            },
            
            // could maybe use an array instead.
            'get_map_scanline_filters': function() {
                var h = this.size[1], scanline_length = this.scanline_length, scanlines_buffer = this.scanlines_buffer;
                var res = {};
                for (var c = 0; c < h; c++) {
                    var scanline_start = c * scanline_length;
                    var scanline_filter_byte = scanlines_buffer.readUInt8(scanline_start);
                    //res.push[scanline_filter_byte];
                    res[c] = scanline_filter_byte;
                }
                return res;
            },
            
            // iterate pixels
            //  could enable changes to pixels
            //  will be used to get pixels into another image.
            
            // 'change_bit_depth'?
            
            // 'change_encoding'?
            
            // 'set_encoding'

            // may use an inline pixel iteration boilerplate.
            // may make a C++ plugin function that does the iteration and calls 
            //  the callback for each pixel

            // will make C++ functions that do the iteration + whatever optimization,
            //  but will 

            
            'iterate_row': function(y, pixel_callback) {
                //var uf_slb = this.get_unfiltered_scanline_buffer(y);
                
                // uses positions on the unfiltered_scanlines_buffer.
                //console.log('iterate_row');
                
                
                //throw 'stop';
                //console.log('uf_slb ' + uf_slb);
                // then depending on bit rate, color depth... but at least we have isolated the unfiltered scanline row with this.
                //  will use this to keep the low level structure and provide a high level interface.
                
                var scanline_length = this.scanline_length, bit_depth = this.bit_depth, color_type = this.color_type;
                var w = this.size[0];
                var scanline_data_length = scanline_length - 1;
                // Will need other iteration loops for different color depths.
                
                // different loops for different color modes / bit depths.
                var r, g, b, px;
                
                var _3x, _4x;
                
                var unfiltered_row_start_pos = scanline_length * y;
                var scanlines_buffer = this.scanlines_buffer;
                var unfiltered_scanlines_buffer = this.unfiltered_scanlines_buffer;
                //  should have the unfiltered scanlines buffer set up...
                //   should be a part of loading the png.
                
                
                
                // other color types, bit depths for iteration accross the row.
                //  will be iterating over an unfiltered row
                
            },

            'iterate_pixels': function(pixel_callback) {
                var width = this.size[0];
                var height = this.size[1];
                
                // iterate each row.

                var scanline_length = this.scanline_length, bit_depth = this.bit_depth, color_type = this.color_type;
                var w = width;
                var scanline_data_length = scanline_length - 1;
                // Will need other iteration loops for different color depths.
                
                // different loops for different color modes / bit depths.
                var r, g, b, px;
                
                var _3x, _4x;
                
                var unfiltered_row_start_pos = scanline_length * y;
                var scanlines_buffer = this.scanlines_buffer;

                if (!this.unfiltered_scanlines_buffer) this.ensure_unfiltered_scanlines_buffer_cpp();

                var unfiltered_scanlines_buffer = this.unfiltered_scanlines_buffer;
                //console.log('unfiltered_scanlines_buffer.length ' + unfiltered_scanlines_buffer.length);
                var unfiltered_row_start_pos;


                
                for (var y = 0; y < height; y++) {
                    //this.iterate_row(y, pixel_callback);
                    // inline row iteration.
                    unfiltered_row_start_pos = scanline_length * y;


                    if (color_type == 0) {
                        // bit-depth, calculate bits per pixel.
                        // pixels per byte... will need to go through each byte getting the pixels from it.

                        if (bit_depth == 1) {
                            // there are 8 pixels per byte.
                            //console.log('scanlines_buffer.length ' + scanlines_buffer.length);
                            //console.log(scanlines_buffer.length / this.size[1]);
                            // so look at every byte, then look at every bit in the byte with bit shifting (and masking)?
                            //  or just use bit masks... could be faster.

                            //byte_val & 128, 64, ... 1

                            // work out the number of bytes per row.
                            //  that could be the scanline_length.

                            // also need to be careful about the number of pixels per row (this.size[0], w).
                            // And do bit shifting I think.

                            // for every byte, do it, but increment a counter for x?
                            //console.log('y ' + y);
                            // or do it for each value of x... can get the next item.
                            //console.log('scanline_data_length ' + scanline_data_length);
                            //console.log('scanline_length ' + scanline_length);
                            //console.log('w ' + w);
                            //console.log('unfiltered_row_start_pos ' + unfiltered_row_start_pos);


                            //console.log('pixels_per_scanline ' + scanline_data_length * 8);

                            // could go through the width...
                            var x = 0;
                            var scanline_byte_num = 1;
                            var pixel_pos_in_byte = 0;
                            var current_byte_value;
                            var pixel_val;
                            while(x < w) {
                                //console.log('x ' + x);
                                // get 8 pixels out of 1 byte.
                                if (pixel_pos_in_byte == 0) {
                                    //console.log('unfiltered_row_start_pos + scanline_byte_num ' + (unfiltered_row_start_pos + scanline_byte_num));
                                    current_byte_value = scanlines_buffer.readUInt8(unfiltered_row_start_pos + scanline_byte_num);

                                    // then & 1, no bitshift

                                    //var pixel_val = current_byte_value & 1;
                                    //console.log('pixel_val ' + pixel_val);
                                    pixel_val = (current_byte_value & 128) >> 7;
                                    pixel_callback(x, y, pixel_val);

                                    pixel_pos_in_byte++;
                                } else if (pixel_pos_in_byte == 1) {
                                    pixel_val = (current_byte_value & 64) >> 6;
                                    //console.log('pixel_val ' + pixel_val);
                                    pixel_callback(x, y, pixel_val);
                                    pixel_pos_in_byte++;
                                } else if (pixel_pos_in_byte == 2) {
                                    pixel_val = (current_byte_value & 32) >> 5;
                                    //console.log('pixel_val ' + pixel_val);
                                    pixel_callback(x, y, pixel_val);
                                    pixel_pos_in_byte++;
                                } else if (pixel_pos_in_byte == 3) {
                                    pixel_val = (current_byte_value & 16) >> 4;
                                    //console.log('pixel_val ' + pixel_val);
                                    pixel_callback(x, y, pixel_val);
                                    pixel_pos_in_byte++;
                                } else if (pixel_pos_in_byte == 4) {
                                    pixel_val = (current_byte_value & 8) >> 3;
                                    //console.log('pixel_val ' + pixel_val);
                                    pixel_callback(x, y, pixel_val);
                                    pixel_pos_in_byte++;
                                } else if (pixel_pos_in_byte == 5) {
                                    pixel_val = (current_byte_value & 4) >> 2;
                                    //console.log('pixel_val ' + pixel_val);
                                    pixel_callback(x, y, pixel_val);
                                    pixel_pos_in_byte++;
                                } else if (pixel_pos_in_byte == 6) {
                                    pixel_val = (current_byte_value & 2) >> 1;
                                    //console.log('pixel_val ' + pixel_val);
                                    pixel_callback(x, y, pixel_val);
                                    pixel_pos_in_byte++;
                                } else if (pixel_pos_in_byte == 7) {
                                    //pixel_val = (current_byte_value & 128) >> 7;
                                    //console.log('pixel_val ' + pixel_val);
                                    pixel_val = current_byte_value & 1;
                                    pixel_callback(x, y, pixel_val);
                                    pixel_pos_in_byte = 0;
                                    scanline_byte_num++;
                                }
                                x++;
                            }
                        }
                    }

                    if (color_type == 2) {
                        // rgb
                        
                        if (bit_depth == 8) {
                            // 24 bpp
                            
                            for (var x = 0; x < w; x++) {
                                _3x = x * 3;
                                r = unfiltered_scanlines_buffer.readUInt8(unfiltered_row_start_pos + _3x + 1);
                                g = unfiltered_scanlines_buffer.readUInt8(unfiltered_row_start_pos + _3x + 2);
                                b = unfiltered_scanlines_buffer.readUInt8(unfiltered_row_start_pos + _3x + 3);
                                //px = [r, g, b];
                                //pixel_callback(x, y, px);
                                pixel_callback(x, y, r, g, b);
                            }
                            // read the pixel values.
                        
                        } else {
                            throw 'Unsupported bit_depth ' + bit_depth;
                        }                 
                    }
                    
                    // 3 is indexed color.
                    //  will include low bit depths.
                    
                    if (color_type == 6) {
                        // rgb
                        
                        if (bit_depth == 8) {
                            // 24 bpp
                            var _4x;
                            
                            for (var x = 0; x < w; x++) {
                                _4x = 4 * x;
                                r = unfiltered_scanlines_buffer.readUInt8(unfiltered_row_start_pos + _4x + 1);
                                g = unfiltered_scanlines_buffer.readUInt8(unfiltered_row_start_pos + _4x + 2);
                                b = unfiltered_scanlines_buffer.readUInt8(unfiltered_row_start_pos + _4x + 3);
                                a = unfiltered_scanlines_buffer.readUInt8(unfiltered_row_start_pos + _4x + 4);
                                //px = [r, g, b, a];
                                //pixel_callback(x, y, px);
                                pixel_callback(x, y, r, g, b, a);
                            }
                            // read the pixel values.
                        
                        } else {
                            throw 'Unsupported bit_depth ' + bit_depth;
                        }                 
                    }
                    




                }
            },

            '_iterate_pixels': function(pixel_callback) {
                var width = this.size[0];
                var height = this.size[1];
                
                // iterate each row.
                
                for (var y = 0; y < height; y++) {
                    this.iterate_row(y, pixel_callback);
                }
            },
            
            
            // when we have the unfiltered buffer, want to run filtering from it.
            
            // Need to refilter the rows.
            //  A pixel value may get chganged, or the filter used on a row could change.
            
            'analyse_scanline_filter_method_get_compressed_size': fp(function(a, sig) {
                // this function could be remade so that it gets compressed filter sizes for all of the different scanline filtering options,
                
                
                
                var scanline_num, scanline_filter_byte, options = {}, callback;
                
                //console.log('sig ' + sig);
                
                if (sig == '[n,n]') {
                    scanline_num = a[0];
                    scanline_filter_byte = a[1];
                }
                
                if (sig == '[n,n,f]') {
                    scanline_num = a[0];
                    scanline_filter_byte = a[1];
                    callback = a[2];
                }
                
                if (sig == '[n,n,o,f]') {
                    scanline_num = a[0];
                    scanline_filter_byte = a[1];
                    options = a[2];
                    callback = a[3];
                }
                
                //console.log('scanline_num ' + scanline_num);
                
                //unique_2grams
                //var method = 'deflate';
                //var method = 'unique_2grams';
                var method = 'unique_4grams';
                
                if (options) {
                    if (options.method) method = options.method;
                    if (options.filter_method) method = options.filter_method;
                }
                
                //  [n,n,f]
                
                // could have options in there.
                
                // there will be different optimization methods.
                //   these are all scanline-local.
                
                // deflate, unique_4_byte_words
                
                // creates a compressed version of the scanline to see how big it is when defalted.
                
                //  like filter_scanline, but we want to write it to a separate individual scanline buffer.
                
                //console.log('this.scanline_length ' + this.scanline_length);
                
                this.analysis_scanline_buffer = this.analysis_scanline_buffer || new Buffer(this.scanline_length);
                
                if (this.analysis_scanline_buffer.length != this.scanline_length) this.analysis_scanline_buffer = new Buffer(this.scanline_length);
                
                // can use different analysis methods.
                //  may try looking at 4-byte sequences read by readUInt32.
                //   counting the numbers of unique ones.
                //    and choosing the scanline filter that produces the lowest number of unique 4 byte sequences.
                
                
                //var scanline_filter_byte = this.get_scanline_filter_byte(scanline_num);
                
                var scanlines_buffer = this.scanlines_buffer;
                var scanline_length = this.scanline_length;
                var scanline_start = scanline_length * scanline_num;
                
                var analysis_scanline_buffer = this.analysis_scanline_buffer;
                
                var color_type = this.color_type;
                
                //console.log('filter_scanline ' + scanline_num + ' scanline_filter_byte: ' + scanline_filter_byte);
                
                
                var unfiltered_scanlines_buffer = this.unfiltered_scanlines_buffer;
                
                var bytes_per_pixel = -1;
                if (bit_depth == 8) {
                    if (color_type == 2) {
                        bytes_per_pixel = 3;
                    }
                    if (color_type == 6) {
                        bytes_per_pixel = 4;
                    }
                }
                
                var byte_pos;
                
                var unfiltered_byte;
                var filtered_byte;
                var unfiltered_byte_value_above;
                
                var unfiltered_byte_value_left;
                var unfiltered_byte_value_above_left;
                //console.log('scanline_filter_byte ' + scanline_filter_byte);
                
                // filtering individual scanlines could make sense if something changes and only affects things below it.
                //  or below it until a line with filter 0 or 1 is reached.
                
                // write to 5 analysis buffers at once?
                // or write to 5 different queue-like things.
                //  revolving data structures that forget previous items that were put in?
                //   I think an array with a pointer would work well. That way we can read back however many items, and see if that combination has hapenned before,
                //    working out unique-ngram occurrances.
                
                // local ngram analysis may turn out to be a good method...
                //  may not need to hold the whole scanline.
                
                // deflate on each line seems best for the moment though.
                
                // best option at the moment is the scanline deflate test?
                
                // taking into consideration previous lines will help as well.
                
                
                
                
                if (scanline_filter_byte == 0) {
                    // just copy it over to the scanlines_buffer
                    
                    // not sure if something needs to be done here... maybe.
                    
                    // copy from unfiltered buffer to filtered buffer.
                    //this.unfiltered_scanlines_buffer
                    //console.log('this.unfiltered_scanlines_buffer ' + this.unfiltered_scanlines_buffer);
                    unfiltered_scanlines_buffer.copy(analysis_scanline_buffer, 0, scanline_start, scanline_start + this.scanline_length);
                    
                    // it is the unfiltered value?
                    //  where do we get the various values from at this stage?
                    
                    
                    
                    
                }
                
                if (scanline_filter_byte == 1) {
                    if (color_type == 2 || color_type == 6) {
                        for (var b = 1; b < scanline_length; b++) {
                            byte_pos = scanline_start + b;
                            unfiltered_byte_value_left = 0;
                            if (b >= bytes_per_pixel) {
                                //var byte_left_pos = byte_pos - bytes_per_pixel;
                                unfiltered_byte_value_left = unfiltered_scanlines_buffer.readUInt8(byte_pos - bytes_per_pixel);
                            }
                            unfiltered_byte = unfiltered_scanlines_buffer.readUInt8(byte_pos);
                            filtered_byte = unfiltered_byte - unfiltered_byte_value_left;
                            
                            if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
                            analysis_scanline_buffer.writeUInt8(filtered_byte, byte_pos - scanline_start);
                        }
                    }
                }
                
                if (scanline_filter_byte == 2) {
                    if (color_type == 2 || color_type == 6) {
                        for (var b = 1; b < scanline_length; b++) {
                            byte_pos = scanline_start + b;
                            unfiltered_byte_value_above = 0;
                            if (scanline_num > 0) {
                                //var byte_above_pos = byte_pos - scanline_length;
                                unfiltered_byte_value_above = unfiltered_scanlines_buffer.readUInt8(byte_pos - scanline_length);
                            }
                            unfiltered_byte = unfiltered_scanlines_buffer.readUInt8(byte_pos);
                            filtered_byte = unfiltered_byte - unfiltered_byte_value_above;
                            
                            if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
                            analysis_scanline_buffer.writeUInt8(filtered_byte, byte_pos - scanline_start);
                        }
                    }
                }
                
                if (scanline_filter_byte == 3) {
                    // it's the 'average' filter.
                    // Average(x) = Raw(x) - floor((Raw(x-bpp)+Prior(x))/2)
                    
                    if (color_type == 2 || color_type == 6) {
                        for (var b = 1; b < scanline_length; b++) {
                            //var byte_value_above = 0;
                            byte_pos = scanline_start + b;
                            unfiltered_byte_value_above = 0;
                            if (scanline_num > 0) {
                                var byte_above_pos = byte_pos - scanline_length;
                                unfiltered_byte_value_above = unfiltered_scanlines_buffer.readUInt8(byte_above_pos);
                            }
                            unfiltered_byte_value_left = 0;
                            if (b >= bytes_per_pixel) {
                                var byte_left_pos = byte_pos - bytes_per_pixel;
                                unfiltered_byte_value_left = unfiltered_scanlines_buffer.readUInt8(byte_left_pos);
                            }
                            
                            unfiltered_byte = unfiltered_scanlines_buffer.readUInt8(byte_pos);
                            filtered_byte = unfiltered_byte - Math.floor((unfiltered_byte_value_left + unfiltered_byte_value_above) / 2);;
                            
                            if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
                            analysis_scanline_buffer.writeUInt8(filtered_byte, byte_pos - scanline_start);
                        }
                    }
                }
                
                if (scanline_filter_byte == 4) {
                    // it's the 'paeth' filter.
                    // Average(x) = Raw(x) - floor((Raw(x-bpp)+Prior(x))/2)
                    
                    var has_left, has_above;
                    
                    if (color_type == 2 || color_type == 6) {
                        for (var b = 1; b < scanline_length; b++) {
                            byte_pos = scanline_start + b;
                            unfiltered_byte_value_above = 0;
                            has_left = b >= bytes_per_pixel;
                            has_above = scanline_num > 0;
                            
                            if (has_above) {
                                unfiltered_byte_value_above = unfiltered_scanlines_buffer.readUInt8(byte_pos - scanline_length);
                            }
                            unfiltered_byte_value_left = 0;
                            if (has_left) {
                                unfiltered_byte_value_left = unfiltered_scanlines_buffer.readUInt8(byte_pos - bytes_per_pixel);
                            }
                            unfiltered_byte_value_above_left = 0;
                            if (has_left && has_above) {
                                unfiltered_byte_value_above_left = unfiltered_scanlines_buffer.readUInt8(byte_pos - scanline_length - bytes_per_pixel);
                            }
                            
                            unfiltered_byte = unfiltered_scanlines_buffer.readUInt8(byte_pos);
                            
                            filtered_byte = unfiltered_byte - paeth_predictor(unfiltered_byte_value_left, unfiltered_byte_value_above, unfiltered_byte_value_above_left);
                            
                            if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
                            analysis_scanline_buffer.writeUInt8(filtered_byte, byte_pos - scanline_start);
                        }
                    }
                }
                
                
                // then we compress the analysis scanlines buffer, and see how big it is.
                //console.log('analysis_scanline_buffer ' + this.analysis_scanline_buffer);
                //console.log('analysis_scanline_buffer.length ' + this.analysis_scanline_buffer.length);
                
                // could use lower deflate level... but the time is likely coming from making all these buffers. Don't think it can be helped with deflate (here).
                //  could maybe push the deflated chunk to a scratch buffer?
                //  maybe this will just be a bit slow for the moment.
                
                if (method == 'deflate') {
                    var deflate = zlib.createDeflate({
                        chunkSize: 32 * 1024,
                        level: 9,
                        strategy: 3,
                        windowBits: 15,
                        memLevel: 9
                    });
                    //deflate.on('error', this.emit.bind(this, 'error'));
                    deflate.on('error', function() {
                        //console.log('deflate error');
                    });
            
                    //var buffers = [];
                    var nread = 0;
                
                    var that = this;
                
                    deflate.on('data', function(chunk) {
                        nread = nread + chunk.length;
                    });
                    deflate.on('end', function() {
                        callback(null, nread);
                    });
                    deflate.end(this.analysis_scanline_buffer);
                } else if (method == 'unique_2grams') {
                    // go through the analysis buffer.
                    var map_found_2grams = {};
                    var filtered_2gram;
                    var count_unique = 0;
                    
                    //console.log('unique_2grams ');
                    // it's doing this through loads of callbacks... not sure that's the best way.
                    //  especially as no callback is needed for the 2-gram analysis.
                    
                    for (var b = 0; b < scanline_length - 1; b++) {
                        //console.log('b ' + b);
                        filtered_2gram = analysis_scanline_buffer.readUInt16BE(b);
                        if (map_found_2grams[filtered_2gram]) {
                        
                        } else {
                            map_found_2grams[filtered_2gram] = true;
                            count_unique++;
                        }
                    }
                    
                    //scanline_filter_byte
                    //console.log('scanline_filter_byte ' + scanline_filter_byte);
                    //console.log('count_unique ' + count_unique);
                    //callback(null, count_unique);
                    
                    return count_unique;
                    
                } else if (method == 'unique_4grams') {
                    // go through the analysis buffer.
                    
                    // 4grams seem like not the best method.
                    //  would also be able to track the 4grams in an efficient way when going through all of the unfiltered scanline...
                    //   also would not need to write to an analysis buffer.
                    //   would have good local optimization.
                    
                    // want something faster, some kind of n-grams, an array or buffer? Build up some kind of data structure quickly while going through the list?
                    //  want to check compressibility, quickly.
                    
                    // may also want something for going through the whole PNG.
                    //  deflate needs to be done asyncronously.
                    
                    
                    
                    
                    
                    
                    var map_found_4grams = {};
                    var filtered_4gram;
                    var count_unique = 0;
                    
                    //console.log('unique_2grams ');
                    // it's doing this through loads of callbacks... not sure that's the best way.
                    //  especially as no callback is needed for the 2-gram analysis.
                    
                    for (var b = 0; b < scanline_length - 3; b++) {
                        //console.log('b ' + b);
                        filtered_4gram = analysis_scanline_buffer.readUInt32BE(b);
                        if (map_found_4grams[filtered_4gram]) {
                        
                        } else {
                            map_found_4grams[filtered_4gram] = true;
                            count_unique++;
                        }
                    }
                    
                    //scanline_filter_byte
                    //console.log('scanline_filter_byte ' + scanline_filter_byte);
                    //console.log('count_unique ' + count_unique);
                    //callback(null, count_unique);
                    
                    return count_unique;
                    
                }
                
                
                
                
            }),
            
            // want to set the scanline filters based on analysis.
            // also optimize and save.
            
            // doing the filtering with all of the filter options each time takes some cpu resources.
            //  could make an analysis module that calculates all of the possible filtered scanlines at once, in a more optimized way.
            
            
            // there can be different methods of doing this.
            
            // scanline_deflate being one predictor.
            //  I may make a better one sometime that takes into account previously encoded data.
            
            
            'optimize_scanline_filters': fp(function(a, sig) {
                var options = {}, callback;
                if (sig == '[f]') {
                    callback = a[0];
                }
                if (sig == '[o,f]') {
                    options = a[0];
                    callback = a[1];
                }
                
                // and there will be different optimization methods.
                
                var method = 'deflate';
                if (options.method) {
                    method = options.method;
                }
                
                // this can work in async mode with deflate.
                //  other methods were not working in async as I had them, nicer to have in sync when it's JS code running anyway.
                //  will be calling some methods as both sync and async.
                var that = this;
                
                if (method == 'deflate') {
                    //console.log('deflate analyse_scanlines_predict_best_filters ');
                    that.analyse_scanlines_predict_best_filters({'method': method}, function(err, arr_predicted_best_scanline_filters) {
                        if (err) {
                            throw err;
                        } else {
                            each(arr_predicted_best_scanline_filters, function(y, predicted_best_filter) {
                                that.set_scanline_filter_byte(y, predicted_best_filter);
                            });
                        
                            callback(null, true);
                        }
                    
                    });
                } else {
                    var arr_predicted_best_scanline_filters = that.analyse_scanlines_predict_best_filters({'method': method});
                    each(arr_predicted_best_scanline_filters, function(y, predicted_best_filter) {
                        that.set_scanline_filter_byte(y, predicted_best_filter);
                    });
                
                    if (callback) {
                        callback(null, true);
                    } else {
                        return true;
                    }
                }
            }),
            
            'analyse_scanlines_predict_best_filters': fp(function(a, sig) {
                // do the analysis on a whole bunch of them.
                //  the optimizing set scanline filters works better.
                //   the 'best' optimization works really well.
                //   don't think the compression takes long.
                //    uses more cpu and memory though.
                
                
                // inlining the prediction could speed things up.
                //  perhaps having some deflate javascript code as well, may be faster for small deflations.
                
                // asyncronous methods: deflate.
                
                //console.log('analyse_scanlines_predict_best_filters sig ' + sig);
                
                var options = {}, callback;
                if (sig == '[o]') {
                    options = a[0];
                }
                if (sig == '[f]') {
                    callback = a[0];
                }
                if (sig == '[o,f]') {
                    options = a[0];
                    callback = a[1];
                }
                
                // and there will be different optimization methods.
                
                var method = 'deflate';
                if (options.method) {
                    method = options.method;
                }
                
                
                if (method == 'deflate') {
                    var fns = Fns();
                
                    // there may be too many of them for this kind of callback look.
                
                    for (var y = 0; y < this.size[1]; y++) {
                        //fns.push()
                        fns.push([this, this.analyse_scanline_predict_best_filter, [y, {'method': method}]]);
                    }
                
                    // but not calling these with a callback?
                    //console.log('pre go');
                    fns.go(function(err, res_scanlines_predicted_best_filters) {
                        if (err) {
                            throw err;
                        } else {
                            //console.log('res_scanlines_predicted_best_filters ' + stringify(res_scanlines_predicted_best_filters));
                            callback(null, res_scanlines_predicted_best_filters);
                        }
                    });
                
                } else {
                    var res = [];
                
                    for (var y = 0; y < this.size[1]; y++) {
                        res.push(this.analyse_scanline_predict_best_filter(y, method));
                    }
                    return res;
                }
                
                /*
                
                */
                
                
                
            }),
            
            
            // The scanline rows will have the filters built in.
            //  functions with an optional callback depending on how they were used?
            // Too many callbacks in a loop has caused problems.
            
            // I may need to get used to some functions returning values in some modes of operation.
            
            // I think...
            //  filter scanlines with optimization.
            //  filtering and optimization go together.
            
            // will have the simplest optimization method - looking for the recurring 2 byte values.
            //  larger recurrances too could maybe be looked for in that same algorithm? or modifications of it.
            
            // also want to go through, with the latest 32K of data for each scanline, see which makes the smallest total.
            //  That's (something like) the incremental filter selection.
            //  That will be the best method I think.
            //  Would also be able to test the individual filtered scanlines.
            
            
            
            
            
            // this only is good locally... still makes pretty good results though.
            //  will do an iterative-look-back filter selection.
            
            'analyse_scanline_predict_best_filter': fp(function(a, sig) {
                // this could take an analysis method parameter.
                //  more analysis methods could be added in time.
                
                // scanline_num, callback
                var scanline_num, callback;
                // but could take an analysis method.
                
                var options = {};
                
                // still local scanline analysis.
                //  going through the whole unfiltered scanline(s) buffer,
                //  filtering it to each of the filters, putting that in a short-term buffer or array (maybe going back 10), tracking if all the n-grams have occurred before,
                //  then continuing through.
                
                // Going through the whole image choosing filters based on ngrams, and a larger window using previously selected filters may work very well indeed.
                // A small ngram sliding window system (maybe very small, looking at 2,3,4 grams may be really good).
                //  Could probably get a fair performance improvement with one loop.
                //  Or could move on to the next problem.
                
                
                //console.log('analyse_scanline_predict_best_filter sig ' + sig);
                
                if (sig == '[n]') {
                    scanline_num = a[0];
                }
                if (sig == '[n,o]') {
                    scanline_num = a[0];
                    options = a[1];
                }
                if (sig == '[n,f]') {
                    scanline_num = a[0];
                    callback = a[1];
                }
                if (sig == '[n,o,f]') {
                    scanline_num = a[0];
                    options = a[1];
                    callback = a[2];
                }
                
                var method = 'deflate';
                if (options.method) method = options.method;
            
                // needs to build filtered versions of the scanline to see how big they are when compressed.
                //  
                
                // do this for the various filters...
                
                var fns = Fns();
                
                // there will be different filter prediction methods.
                // but we can use a different method.
                //  looking at the 2-grams.
                
                // but these functions now don't have a callback, they return a result.
                
                if (method == 'deflate') {
                    // it's asyncronous.
                    
                    // but reading through the scanline into 5 buffers at once, decoding it, re-using access to buffer variables, I could get faster fitering and deflating.
                    
                    //fns.push([this.analyse_scanline_filter_method_get_compressed_size, this, [scanline_num, 1]]);
                    fns.push([this, this.analyse_scanline_filter_method_get_compressed_size, [scanline_num, 0, {'method': method}]]);
                    fns.push([this, this.analyse_scanline_filter_method_get_compressed_size, [scanline_num, 1, {'method': method}]]);
                    fns.push([this, this.analyse_scanline_filter_method_get_compressed_size, [scanline_num, 2, {'method': method}]]);
                    fns.push([this, this.analyse_scanline_filter_method_get_compressed_size, [scanline_num, 3, {'method': method}]]);
                    fns.push([this, this.analyse_scanline_filter_method_get_compressed_size, [scanline_num, 4, {'method': method}]]);
                    
                    // these could go in parallel (I think), with deflation working in parallel.
                    
                    fns.go(function(err, multi_cb) {
                        //console.log('multi_cb ' + stringify(multi_cb));
                        //throw 'deflate stop';
                    
                        var min = Infinity;
                        var iMin = -1;
                    
                        each(multi_cb, function(i, v) {
                            if (v < min) {
                                min = v;
                                iMin = i;
                            }
                        });
                    
                        callback(null, iMin);
                    
                    });
                    
                    
                } else {
                    var res = [];
                
                    for (var c = 0; c < 5; c++) {
                        res.push(this.analyse_scanline_filter_method_get_compressed_size(scanline_num, c));
                    }
                
                    var min = Infinity;
                    var iMin = -1;
                
                    each(res, function(i, v) {
                        if (v < min) {
                            min = v;
                            iMin = i;
                        }
                    });
                
                    //callback(null, iMin);
                    return iMin;
                    
                }
                
            }),
            
            // analysis on all scanlines to get the filters to set them to.
            
            
            // want to do this, filtering all scanlines in one function.
            //  should be a bit more efficient.
            //  will also enable an optimizing filter to go through, choosing what is the best filter to use in each case, looking back on previous
            //  scanlines when carrying out the deflate.
            
            
            
            
            // using the filter found there, basing it on the unfiltered scanlines buffer.
            
            'filter_scanline': function(scanline_num) {
                
                // want to do an optimizing filtration...
                //  or at least set the scanline filters optimally.
                //  it will run deflate on the scanline with the various options to see which produces the best result.
                //   so for analysis purposes, we will need to get the unfiltered scanline.
                //    that could be slower. maybe there will be a scanline_analysis_buffer that sticks to the object.
                //    that would be faster. would make concurrency problems if two functions were to use it at once.
                //     the compression is async.
                
                // and can put this inline in filter all scanlines as well.
                //  that would likely wind up being faster.
                
                
                var scanline_filter_byte = this.get_scanline_filter_byte(scanline_num);
                
                var scanlines_buffer = this.scanlines_buffer;
                var scanline_length = this.scanline_length;
                var scanline_start = scanline_length * scanline_num;
                
                
                var color_type = this.color_type;
                
                //console.log('filter_scanline ' + scanline_num + ' scanline_filter_byte: ' + scanline_filter_byte);
                
                
                var unfiltered_scanlines_buffer = this.unfiltered_scanlines_buffer;
                
                var bytes_per_pixel = -1;
                if (bit_depth == 8) {
                    if (color_type == 2) {
                        bytes_per_pixel = 3;
                    }
                    if (color_type == 6) {
                        bytes_per_pixel = 4;
                    }
                }
                
                var byte_pos;
                
                var unfiltered_byte;
                var filtered_byte;
                var unfiltered_byte_value_above;
                
                var unfiltered_byte_value_left;
                var unfiltered_byte_value_above_left;
                //console.log('scanline_filter_byte ' + scanline_filter_byte);
                
                // filtering individual scanlines could make sense if something changes and only affects things below it.
                //  or below it until a line with filter 0 or 1 is reached.
                
                
                if (scanline_filter_byte == 0) {
                    // just copy it over to the scanlines_buffer
                    
                    // not sure if something needs to be done here... maybe.
                    
                    // copy from unfiltered buffer to filtered buffer.
                    //this.unfiltered_scanlines_buffer
                    //console.log('this.unfiltered_scanlines_buffer ' + this.unfiltered_scanlines_buffer);
                    //this.unfiltered_scanlines_buffer.copy(scanlines_buffer, scanline_start, scanline_start, scanline_start + this.scanline_length);
                }
                
                if (scanline_filter_byte == 1) {
                    // it's the 'left' filter.
                    
                    //console.log('color_type ' + color_type);
                    
                    if (color_type == 2 || color_type == 6) {
                        for (var b = 1; b < scanline_length; b++) {
                            //var byte_value_above = 0;
                            byte_pos = scanline_start + b;
                            
                            unfiltered_byte_value_left = 0;
                            if (b >= bytes_per_pixel) {
                                //var byte_left_pos = byte_pos - bytes_per_pixel;
                                unfiltered_byte_value_left = unfiltered_scanlines_buffer.readUInt8(byte_pos - bytes_per_pixel);
                            }
                            // and we should have that unfiltered byte.
                            
                            unfiltered_byte = unfiltered_scanlines_buffer.readUInt8(byte_pos);
                            filtered_byte = unfiltered_byte - unfiltered_byte_value_left;
                            
                            if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
                            scanlines_buffer.writeUInt8(filtered_byte, byte_pos);
                        }
                    }
                }
                
                if (scanline_filter_byte == 2) {
                    // it's the 'above' filter.
                    
                    // can make this much more concise by having it go through it byte by byte.
                    // too much code here right now.
                    
                    // will get values from the unfiltered_scanlines_buffer, and will use buffer offsets.
                    
                    // reads from unfiltered scanline buffer.
                    
                    //console.log('color_type ' + color_type);
                    
                    if (color_type == 2 || color_type == 6) {
                        
                        for (var b = 1; b < scanline_length; b++) {
                            //var byte_value_above = 0;
                            byte_pos = scanline_start + b;
                            
                            unfiltered_byte_value_above = 0;
                            if (scanline_num > 0) {
                                //var byte_above_pos = byte_pos - scanline_length;
                                unfiltered_byte_value_above = unfiltered_scanlines_buffer.readUInt8(byte_pos - scanline_length);
                            }
                            
                            // and we should have that unfiltered byte.
                            
                            unfiltered_byte = unfiltered_scanlines_buffer.readUInt8(byte_pos);
                            filtered_byte = unfiltered_byte - unfiltered_byte_value_above;
                            
                            if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
                            
                            scanlines_buffer.writeUInt8(filtered_byte, byte_pos);
                        }
                    }
                }
                
                if (scanline_filter_byte == 3) {
                    // it's the 'average' filter.
                    // Average(x) = Raw(x) - floor((Raw(x-bpp)+Prior(x))/2)
                    
                    if (color_type == 2 || color_type == 6) {
                        for (var b = 1; b < scanline_length; b++) {
                            //var byte_value_above = 0;
                            byte_pos = scanline_start + b;
                            unfiltered_byte_value_above = 0;
                            if (scanline_num > 0) {
                                var byte_above_pos = byte_pos - scanline_length;
                                unfiltered_byte_value_above = unfiltered_scanlines_buffer.readUInt8(byte_above_pos);
                            }
                            unfiltered_byte_value_left = 0;
                            if (b >= bytes_per_pixel) {
                                var byte_left_pos = byte_pos - bytes_per_pixel;
                                unfiltered_byte_value_left = unfiltered_scanlines_buffer.readUInt8(byte_left_pos);
                            }
                            // and we should have that unfiltered byte.
                            
                            unfiltered_byte = unfiltered_scanlines_buffer.readUInt8(byte_pos);
                            filtered_byte = unfiltered_byte - Math.floor((unfiltered_byte_value_left + unfiltered_byte_value_above) / 2);;
                            
                            if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
                            scanlines_buffer.writeUInt8(filtered_byte, byte_pos);
                        }
                        
                    }
                    
                }
                
                if (scanline_filter_byte == 4) {
                    // it's the 'paeth' filter.
                    // Average(x) = Raw(x) - floor((Raw(x-bpp)+Prior(x))/2)
                    
                    var has_left, has_above;
                    
                    if (color_type == 2 || color_type == 6) {
                        for (var b = 1; b < scanline_length; b++) {
                            byte_pos = scanline_start + b;
                            unfiltered_byte_value_above = 0;
                            has_left = b >= bytes_per_pixel;
                            has_above = scanline_num > 0;
                            
                            if (has_above) {
                                //var byte_above_pos = byte_pos - scanline_length;
                                unfiltered_byte_value_above = unfiltered_scanlines_buffer.readUInt8(byte_pos - scanline_length);
                            }
                            unfiltered_byte_value_left = 0;
                            if (has_left) {
                                //var byte_left_pos = byte_pos - bytes_per_pixel;
                                unfiltered_byte_value_left = unfiltered_scanlines_buffer.readUInt8(byte_pos - bytes_per_pixel);
                            }
                            unfiltered_byte_value_above_left = 0;
                            if (has_left && has_above) {
                                //var byte_above_left_pos = byte_pos - scanline_length - bytes_per_pixel;
                                unfiltered_byte_value_above_left = unfiltered_scanlines_buffer.readUInt8(byte_pos - scanline_length - bytes_per_pixel);
                            }
                            // and we should have that unfiltered byte.
                            
                            unfiltered_byte = unfiltered_scanlines_buffer.readUInt8(byte_pos);
                            
                            filtered_byte = unfiltered_byte - paeth_predictor(unfiltered_byte_value_left, unfiltered_byte_value_above, unfiltered_byte_value_above_left);
                            //filtered_byte = unfiltered_byte - Math.floor((unfiltered_byte_value_left + unfiltered_byte_value_above) / 2);;
                            
                            if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
                            scanlines_buffer.writeUInt8(filtered_byte, byte_pos);
                        }
                    }
                }
            },
            
            // This seems a lot faster than the old version.
            //  Could be used as a basis for optimize_filter_all_scanlines.
            //  That would make access to the unfiltered scanlines buffer, but it would try compression, using (up to) a 32k window, and choose the
            //  scanline for each row, and leave it as that value.
            // It may have 5 scanline scratch buffers as it carries out the function.
            //  I also expect that it could do some fairly fast optimizations... perhaps making use of more than one row.
            //  Perhaps it could do / keep track of the map/list of unique 2-byte sequences, and use those totals.
            
            // We could implement a faster version of the local scanline deflate test.
            //  And then move the window back... would be slower, but similar code.
            
            // the unfiltering of scanlines could be sped up a lot too, by putting it in one function rather than line-by-line.
            
            'optimize_filter_all_scanlines': fp(function(a, sig) {
                
                var options = {}, callback;
                
                //console.log('optimize_filter_all_scanlines sig ' + sig);
                
                if (sig == '[f]') {
                    callback = a[0];
                }
                if (sig == '[o,f]') {
                    options = a[0];
                    
                    callback = a[1];
                }
                
                // looks like the 'fast' option is not so fast, but much more optimized for 'mem' or 'ram'.
                
                var optimize = options.optimize || 'best';
                //console.log('optimize ' + optimize);
                //throw 'stop';
                // fast optimization will mean counting the recurring 16 bit and 32 bit words from the buffer.
                
                
                
                // callback
                
                // may take different options about how the optimization is done.
                //  comparing unique 2-grams, 4-grams over the buffer made from the window could work OK... not sure on the speed.
                // a fast n-gram comparison data structure would of course be good.
                
                
                
                // this could need a callback if it does deflate, otherwise it won't
                //  there will be various optimization methods that can be used here.
                //  at some stage it could be worth splitting optimizing functions into their own functions - repeating code, but less indirection.
                
                //console.log('optimize_filter_all_scanlines');

                // This optimization is not working with color mode 2, rgb images.


                
                var scanlines_buffer = this.scanlines_buffer;
                var scanline_length = this.scanline_length;
                
                var scratch_line_buffers = new Array(5);
                
                
                var scratch_full_buffers = new Array(5);
                var scratch_test_buffers = new Array(5);
                
                
                // if using an async method (like deflate) keeping all the filtered scanline buffers makes the most sense for now.
                var map_found_16, map_found_32;
                // don't want to have to create lots of buffer copies for closures.
                
                // just using scratch line buffers for optimization.
                
                
                
                // fast, good, better, best (ultimate?), ga?
                
                
                for (var c = 0; c < 5; c++) {
                    
                    if (optimize == 'fast') {
                        scratch_line_buffers[c] = new Buffer(scanline_length);
                        scratch_line_buffers[c].writeUInt8(c, 0);
                    }
                    
                    
                    
                    if (optimize == 'best') {
                        scratch_full_buffers[c] = new Buffer(scanlines_buffer.length);
                        scratch_test_buffers[c] = new Buffer(32768);
                    }
                    
                    
                    
                    // the deflate window size.
                    // 32768
                    //scratch_test_buffers[c] = new Buffer(32000);
                    
                    
                }
                
                // find out what is the optimal filter for each line...
                //  for the first line we just use deflate?
                
                // optimized code here... will mean having some code inline here, will be quite a large function.
                //  may repeat the scanline filtering code...
                //  meaning that we create all the filtered versions of the scanlines.
                //  doing this all at once could create an efficiency.
                
                var color_type = this.color_type;
                
                var h = this.size[1];
                var scanline_filter_byte;
                
                var unfiltered_scanlines_buffer = this.unfiltered_scanlines_buffer;
                var scanline_start, color_type;
                var byte_pos;
            
                var unfiltered_byte;
                var filtered_byte;
                var unfiltered_byte_value_above;
            
                var unfiltered_byte_value_left;
                var unfiltered_byte_value_above_left;
                var has_left, has_above;
                var b, c, iMin, min;
                
                var scanline_num;
                
                var byte_left_pos, byte_above_pos;
                
                var bytes_per_pixel = -1;
                if (bit_depth == 8) {
                    if (color_type == 2) {
                        bytes_per_pixel = 3;
                    }
                    if (color_type == 6) {
                        bytes_per_pixel = 4;
                    }
                }
                
                var count_unique, r16, r32, au = new Array(5);
                
                var filtered_byte_1, filtered_byte_2, filtered_byte_3, filtered_byte_4;
                
                var num_inner_functions_running = 0;
                
                // 'fast' seems slow compared to 'best'.
                //  it uses less memory, though.
                //  perhaps make a 'mem' optimization for what is currently 'fast'
                // then we have 'fast' be like 'best' but with a smaller backwards looking window.
                //  look back 1 scan line?
                //  or 2.
                // could choose a small number... but it is a small number anyway.
                //  
                var m_found_16;
                
                
                var get_buffer_simple_uniqueness_score = function(line_buffer) {
                    // could save on calling this function, having it inline.
                    //  making a closure with a buffer many times... removing that could help.
                    
                    map_found_16 = {};
                    //map_found_32 = {};
                
                    count_unique = 0;
                    
                    // could do random subsampling.
                    //  however, it seems using zlib's deflate turns out to be fairly fast, as is buffer copying.
                    
                    
                    
                    //console.log('line_buffer.length ' + line_buffer.length);
                    for (b = 0, l = line_buffer.length - 1; b < l; b++) {
                        //console.log('b ' + b);
                        r16 = line_buffer.readUInt16BE(b);
                        //r32 = line_buffer.readUInt32BE(b);
                        m_found_16 = map_found_16[r16];
                        
                        if (!m_found_16) {
                            map_found_16[r16] = true;
                            count_unique++;
                        }
                        //if (!map_found_32[r32]) {
                            //map_found_32[r32] = true;
                            //count_unique++;
                        //}
                    
                    
                    
                    }
                    //console.log('count_unique ' + count_unique);
                    return count_unique;
                
                }
                
                for (var y = 0; y < h; y++) {
                    //this.filter_scanline(y);
                    scanline_num = y;
                    //scanline_filter_byte = this.get_scanline_filter_byte(scanline_num);
                    scanline_start = scanline_length * scanline_num;
                    
                    // don't read the scanline filter byte.
                    
                    // for every scanline filter, write it to the scratch line buffer.
                    //console.log('y ' + y);
                    // from the unfiltered scanlines buffer to the scratch buffer.
                    // buf.copy(targetBuffer, [targetStart], [sourceStart], [sourceEnd])
                    
                    if (optimize == 'best') {
                        //scratch_full_buffers[0].writeUInt8(0, scanline_start);


                        scratch_full_buffers[1].writeUInt8(1, scanline_start);
                        scratch_full_buffers[2].writeUInt8(2, scanline_start);
                        scratch_full_buffers[3].writeUInt8(3, scanline_start);
                        scratch_full_buffers[4].writeUInt8(4, scanline_start);
                    
                        // Filter 0
                    
                        //unfiltered_scanlines_buffer.copy(scratch_line_buffers[0], 0, scanline_start, scanline_start + scanline_length);  
                        unfiltered_scanlines_buffer.copy(scratch_full_buffers[0], scanline_start, scanline_start, scanline_start + scanline_length);  
                    } else {
                        unfiltered_scanlines_buffer.copy(scratch_line_buffers[0], 0, scanline_start, scanline_start + scanline_length);  
                    }
                    
                    
                    
                    // then need to do this byte by byte.
                    //  all the filter methods at once, because in total they make use of a bunch of unfiltered byte values.
                    // base it on paeth because that once gets all the values.
                    
                    //console.log('color_type ' + color_type);
                    
                    // could sample a smaller number of pixels to speed it up???
                    //  or sample pixel sections - blocks of 3 pixels, randomly chosen where they occur out of blocks of 12.
                    
                    if (color_type == 2 || color_type == 6) {
                        
                        for (b = 1; b < scanline_length; b++) {
                        
                            //console.log('b ' + b);
                            byte_pos = scanline_start + b;
                            unfiltered_byte_value_above = 0;
                            has_left = b >= bytes_per_pixel;
                            has_above = scanline_num > 0;
                            if (has_above) {
                                //var byte_above_pos = byte_pos - scanline_length;
                                unfiltered_byte_value_above = unfiltered_scanlines_buffer.readUInt8(byte_pos - scanline_length);
                            }
                            unfiltered_byte_value_left = 0;
                            if (has_left) {
                                //var byte_left_pos = byte_pos - bytes_per_pixel;
                                unfiltered_byte_value_left = unfiltered_scanlines_buffer.readUInt8(byte_pos - bytes_per_pixel);
                            }
                            unfiltered_byte_value_above_left = 0;
                            if (has_left && has_above) {
                                //var byte_above_left_pos = byte_pos - scanline_length - bytes_per_pixel;
                                unfiltered_byte_value_above_left = unfiltered_scanlines_buffer.readUInt8(byte_pos - scanline_length - bytes_per_pixel);
                            }
                            unfiltered_byte = unfiltered_scanlines_buffer.readUInt8(byte_pos);
                            
                            // then the different filtered bytes made.
                            
                            filtered_byte_1 = unfiltered_byte - unfiltered_byte_value_left;
                            if (filtered_byte_1 < 0) filtered_byte_1 = filtered_byte_1 + 256;
                            //
                            
                            
                            filtered_byte_2 = unfiltered_byte - unfiltered_byte_value_above;
                            if (filtered_byte_2 < 0) filtered_byte_2 = filtered_byte_2 + 256;
                            //
                            
                            
                            filtered_byte_3 = unfiltered_byte - Math.floor((unfiltered_byte_value_left + unfiltered_byte_value_above) / 2);
                            if (filtered_byte_3 < 0) filtered_byte_3 = filtered_byte_3 + 256;
                            //
                            
                            
                            filtered_byte_4 = unfiltered_byte - paeth_predictor(unfiltered_byte_value_left, unfiltered_byte_value_above, unfiltered_byte_value_above_left);
                            if (filtered_byte_4 < 0) filtered_byte_4 = filtered_byte_4 + 256;
                            //
                            
                            
                            if (optimize == 'best') {
                                scratch_full_buffers[1].writeUInt8(filtered_byte_1, byte_pos);
                                scratch_full_buffers[2].writeUInt8(filtered_byte_2, byte_pos);
                                scratch_full_buffers[3].writeUInt8(filtered_byte_3, byte_pos);
                                scratch_full_buffers[4].writeUInt8(filtered_byte_4, byte_pos);
                            }
                            if (optimize == 'fast') {
                                scratch_line_buffers[1].writeUInt8(filtered_byte_1, b);
                                scratch_line_buffers[2].writeUInt8(filtered_byte_2, b);
                                scratch_line_buffers[3].writeUInt8(filtered_byte_3, b);
                                scratch_line_buffers[4].writeUInt8(filtered_byte_4, b);
                                
                                // may not need these scratch line buffers.
                                //  we can use some syncronous, continuous js methods that do some estimation of best filters.
                                
                                
                                // then do calculations based on those scratch line buffers.
                                //  we can calculate which are the filters with the smallest sizes.
                                
                                // for each of the buffers, work out which has got the least repeating 16 and 32 bit words that get read.
                                //  could maybe do it with bytes as well?

                                
                            }
                            
                            
                            
                        }
                        
                        // within y loop, out of b loop
                
                    
                        if (optimize == 'fast') {
                            
                            //var au = new Array(5);
                            au[0] = get_buffer_simple_uniqueness_score(scratch_line_buffers[0]);
                            au[1] = get_buffer_simple_uniqueness_score(scratch_line_buffers[1]);
                            au[2] = get_buffer_simple_uniqueness_score(scratch_line_buffers[2]);
                            au[3] = get_buffer_simple_uniqueness_score(scratch_line_buffers[3]);
                            au[4] = get_buffer_simple_uniqueness_score(scratch_line_buffers[4]);
                        
                            // then work out which has got the lowest uniqueness score.
                        
                            iMin = -1;
                            min = Infinity;
                    
                            for (c = 0; c < 5; c++) {
                                if (au[c] < min) {
                                    iMin = c;
                                    min = au[c];
                                }
                            }
                        
                            //console.log('iMin ' + iMin);
                        
                            scratch_line_buffers[iMin].copy(scanlines_buffer, scanline_start, 0, scanline_length);
                            
                            
                        }
                        
                        
                        // would like to use call multi... but seems problematic.
                        
                    }
                }
                
                // We have produced the scratch filtered ones...
                
                //console.log('finished computation of all filtered pixels... now need to choose filters');
                // will mean going through the rows, seeing which is the best scanline filter to use.
                
                // proceeding row by row...
                
                // depending on the optimization...
                //  with a fast optimization, can do the calculations in the same y loop.
                
                if (optimize == 'fast') {
                    callback(null, true);
                }
                
                if (optimize == 'best') {
                    var y = 0;
                    var deflation_test_buffer = new Buffer(scanline_length);
                
                    // can create the results for the most optimal filters to use...
                    //  and then copy from these filtered buffers.
                
                    var proceed = function() {
                        // compare the deflation of the various scanlines...
                        // need to copy them over to the filtered image in turn.
                        //  or we actually build a deflation_test_buffer
                    
                        var calculate_deflated_filtered_scanline_length = function(y, int_filter, callback) {
                            var scanline_start = y * scanline_length;
                            var amount_to_copy = 32768 - scanline_length;
                            if (scanline_start < amount_to_copy) amount_to_copy = scanline_start;
                            var copy_start_pos = scanline_start - amount_to_copy;
                            scratch_test_buffers[int_filter].fill(0);
                            scanlines_buffer.copy(scratch_test_buffers[int_filter], 0, copy_start_pos, scanline_start);
                            scratch_full_buffers[int_filter].copy(scratch_test_buffers[int_filter], amount_to_copy, scanline_start, scanline_start + scanline_length);
                            get_deflated_length(scratch_test_buffers[int_filter], function(err, res_deflated_length) {
                                if (err) {
                                    throw err;
                                } else {
                                    //console.log('res_deflated_length ' + res_deflated_length);
                                    callback(null, res_deflated_length);
                                }
                            })
                        }
                    
                        // deflates only that scanline...
                        //  we could look back further.
                        var calculate_smallest_deflated_scanline_filter = function(y, callback) {
                            // Can use a local method, or something with a look-back window.
                            //  Lookback window should produce the best optimization... but code could be inefficient with copying and compressing lots of different buffers.
                            var num_to_process = 5;
                            var res = new Array(5);
                            var cb = function() {
                                num_to_process--;
                                if (num_to_process == 0) {
                                    //callback(null, res);
                                
                                    var iMin = -1;
                                    var min = Infinity;
                                
                                    for (var c = 0; c < 5; c++) {
                                        if (res[c] < min) {
                                            iMin = c;
                                            min = res[c];
                                        }
                                    }
                                    callback(null, iMin);
                                }
                            }
                        
                            calculate_deflated_filtered_scanline_length(y, 0, function(err, res_deflated_sl0) {
                                if (err) {
                                    throw err;
                                } else {
                                    res[0] = res_deflated_sl0;
                                    //console.log('res_deflated_sl0 ' + res_deflated_sl0);
                                    cb();
                                }
                            })
                            calculate_deflated_filtered_scanline_length(y, 1, function(err, res_deflated_sl1) {
                                if (err) {
                                    throw err;
                                } else {
                                    res[1] = res_deflated_sl1;
                                    cb();
                                    //console.log('res_deflated_sl0 ' + res_deflated_sl0);
                                }
                            })
                            calculate_deflated_filtered_scanline_length(y, 2, function(err, res_deflated_sl2) {
                                if (err) {
                                    throw err;
                                } else {
                                    res[2] = res_deflated_sl2;
                                    cb();
                                    //console.log('res_deflated_sl0 ' + res_deflated_sl0);
                                }
                            })
                            calculate_deflated_filtered_scanline_length(y, 3, function(err, res_deflated_sl3) {
                                if (err) {
                                    throw err;
                                } else {
                                    res[3] = res_deflated_sl3;
                                    cb();
                                    //console.log('res_deflated_sl0 ' + res_deflated_sl0);
                                }
                            })
                            calculate_deflated_filtered_scanline_length(y, 4, function(err, res_deflated_sl4) {
                                if (err) {
                                    throw err;
                                } else {
                                    res[4] = res_deflated_sl4;
                                    cb();
                                    //console.log('res_deflated_sl0 ' + res_deflated_sl0);
                                }
                            })
                        }
                    
                        calculate_smallest_deflated_scanline_filter(y, function(err, res_smallest_local) {
                            if (err) {
                                throw err;
                            } else {
                                //console.log('y, res_smallest_local ' + y + ', ' + res_smallest_local);
                                var scanline_start = y * scanline_length;
                            
                                // then use that to copy from the buffer of the filtered scanline.
                                scratch_full_buffers[res_smallest_local].copy(scanlines_buffer, scanline_start, scanline_start, scanline_start + scanline_length);
                            
                                y++;
                                if (y < h) {
                                    proceed();
                                } else {
                                    callback(null, true);
                                }
                            }
                        })
                    }
                
                    if (y < h) proceed();
                
                }
                
                
                
                
            }),

            'ensure_unfiltered_scanlines_buffer_cpp': function() {

                // _ensure_unfiltered_scanlines_buffer


                //console.log('ensure_unfiltered_scanlines_buffer_cpp');
                var scanlines_buffer = this.scanlines_buffer;
                var scanline_length = this.scanline_length;

                var unfiltered_scanlines_buffer = new Buffer(scanlines_buffer.length);
                unfiltered_scanlines_buffer.fill(0);

                var bytes_per_pixel = -1;
                if (bit_depth == 8) {
                    if (color_type == 2) {
                        bytes_per_pixel = 3;
                    }
                    if (color_type == 6) {
                        bytes_per_pixel = 4;
                    }
                }

                cpp_mod.reverse_filter_all_scanlines(scanlines_buffer, unfiltered_scanlines_buffer, scanline_length, bytes_per_pixel);
                //this._ensure_unfiltered_scanlines_buffer();
                this.unfiltered_scanlines_buffer = unfiltered_scanlines_buffer;
                //throw 'stop';
                


            },
            
            'filter_all_scanlines_cpp': function() {
                //console.log('filter_all_scanlines_cpp');

                var scanlines_buffer = this.scanlines_buffer;
                var scanline_length = this.scanline_length;
                var unfiltered_scanlines_buffer = this.unfiltered_scanlines_buffer;

                var bytes_per_pixel = -1;
                if (bit_depth == 8) {
                    if (color_type == 2) {
                        bytes_per_pixel = 3;
                    }
                    if (color_type == 6) {
                        bytes_per_pixel = 4;
                    }
                }

                cpp_mod.filter_all_scanlines(scanlines_buffer, unfiltered_scanlines_buffer, scanline_length, bytes_per_pixel);






            },
            
            'filter_all_scanlines': function() {


                // and can compare this with the C function's output.
                //  Can do this for a much simpler image.
                //  Can make another test image, 4x4 with a red and blue stripe.
                //   Then I can see the output of the C / C++ version alongside this.


                
                var stack = new Error().stack;
                //console.log(stack);

                //throw 'stop';
                //console.log('* filter_all_scanlines');

                // This function would be faster in ASM.
                //  But faster still in C.

                //for (var c = 0, l = this.unfiltered_scanlines_buffer.length; c < l; c++) {
                //    console.log('uf val ' + this.unfiltered_scanlines_buffer.readUInt8(c));
                //}
                //throw '''stop';

                //console.log('this.ensure_unfiltered_scanlines_buffer ' + this.ensure_unfiltered_scanlines_buffer);
                
                //this.ensure_unfiltered_scanlines_buffer();


                
                var h = this.size[1];
                var scanline_filter_byte;
                var scanlines_buffer = this.scanlines_buffer;
                var scanline_length = this.scanline_length;
                var unfiltered_scanlines_buffer = this.unfiltered_scanlines_buffer;
                var scanline_start, color_type = this.color_type;;
                var byte_pos;
            
                var unfiltered_byte;
                var filtered_byte;
                var unfiltered_byte_value_above;
            
                var unfiltered_byte_value_left;
                var unfiltered_byte_value_above_left;
                var has_left, has_above;
                var b;
                
                var scanline_num;
                
                var byte_left_pos, byte_above_pos;
                
                var bytes_per_pixel = -1;
                if (bit_depth == 8) {
                    if (color_type == 2) {
                        bytes_per_pixel = 3;
                    }
                    if (color_type == 6) {
                        bytes_per_pixel = 4;
                    }
                }

                //console.log('bytes_per_pixel ' + bytes_per_pixel);
                //console.log('color_type ' + color_type);
                
                for (var y = 0; y < h; y++) {
                    //this.filter_scanline(y);
                    //console.log('');
                    //console.log('y ' + y);

                    scanline_num = y;
                    scanline_filter_byte = this.get_scanline_filter_byte(scanline_num);
                    //console.log('scanline_filter_byte ' + scanline_filter_byte);
                    scanline_start = scanline_length * scanline_num;
                
                    if (scanline_filter_byte == 0) {

                    }
                
                    if (scanline_filter_byte == 1) {
                        // it's the 'left' filter.
                        if (color_type == 2 || color_type == 6) {
                            for (b = 1; b < scanline_length; b++) {
                                byte_pos = scanline_start + b;
                                //console.log('filter_all_scanlines slf 1 byte_pos ' + byte_pos);
                                unfiltered_byte_value_left = 0;
                                if (b >= bytes_per_pixel) {
                                    unfiltered_byte_value_left = unfiltered_scanlines_buffer.readUInt8(byte_pos - bytes_per_pixel);
                                }
                                //console.log('unfiltered_byte_value_left ' + unfiltered_byte_value_left);
                                unfiltered_byte = unfiltered_scanlines_buffer.readUInt8(byte_pos);
                                filtered_byte = unfiltered_byte - unfiltered_byte_value_left;
                                if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
                                //console.log('filtered_byte ' + filtered_byte);
                                scanlines_buffer.writeUInt8(filtered_byte, byte_pos);
                            }
                        }
                    }
                    if (scanline_filter_byte == 2) {
                        // it's the 'above' filter.
                        if (color_type == 2 || color_type == 6) {
                            for (b = 1; b < scanline_length; b++) {
                                byte_pos = scanline_start + b;
                                unfiltered_byte_value_above = 0;
                                if (scanline_num > 0) {
                                    unfiltered_byte_value_above = unfiltered_scanlines_buffer.readUInt8(byte_pos - scanline_length);
                                }
                                // and we should have that unfiltered byte.
                                unfiltered_byte = unfiltered_scanlines_buffer.readUInt8(byte_pos);
                                filtered_byte = unfiltered_byte - unfiltered_byte_value_above;
                                if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
                                scanlines_buffer.writeUInt8(filtered_byte, byte_pos);
                            }
                        }
                    }
                    if (scanline_filter_byte == 3) {
                        // it's the 'average' filter.
                        // Average(x) = Raw(x) - floor((Raw(x-bpp)+Prior(x))/2)
                    
                        if (color_type == 2 || color_type == 6) {
                            for (b = 1; b < scanline_length; b++) {
                                //var byte_value_above = 0;
                                byte_pos = scanline_start + b;
                                unfiltered_byte_value_above = 0;
                                if (scanline_num > 0) {
                                    byte_above_pos = byte_pos - scanline_length;
                                    unfiltered_byte_value_above = unfiltered_scanlines_buffer.readUInt8(byte_above_pos);
                                }
                                unfiltered_byte_value_left = 0;
                                if (b >= bytes_per_pixel) {
                                    byte_left_pos = byte_pos - bytes_per_pixel;
                                    unfiltered_byte_value_left = unfiltered_scanlines_buffer.readUInt8(byte_left_pos);
                                }
                                unfiltered_byte = unfiltered_scanlines_buffer.readUInt8(byte_pos);
                                filtered_byte = unfiltered_byte - Math.floor((unfiltered_byte_value_left + unfiltered_byte_value_above) / 2);
                                if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
                                scanlines_buffer.writeUInt8(filtered_byte, byte_pos);
                            }
                        }
                    }
                    
                    if (scanline_filter_byte == 4) {
                        // it's the 'paeth' filter.
                        // Average(x) = Raw(x) - floor((Raw(x-bpp)+Prior(x))/2)
                        if (color_type == 2 || color_type == 6) {
                            for (b = 1; b < scanline_length; b++) {
                                byte_pos = scanline_start + b;
                                //console.log('byte_pos ' + byte_pos);
                                unfiltered_byte_value_above = 0;
                                has_left = b >= bytes_per_pixel;
                                has_above = scanline_num > 0;
                                if (has_above) {
                                    //var byte_above_pos = byte_pos - scanline_length;
                                    unfiltered_byte_value_above = unfiltered_scanlines_buffer.readUInt8(byte_pos - scanline_length);
                                }
                                unfiltered_byte_value_left = 0;
                                if (has_left) {
                                    //var byte_left_pos = byte_pos - bytes_per_pixel;
                                    unfiltered_byte_value_left = unfiltered_scanlines_buffer.readUInt8(byte_pos - bytes_per_pixel);
                                }
                                unfiltered_byte_value_above_left = 0;
                                if (has_left && has_above) {
                                    //var byte_above_left_pos = byte_pos - scanline_length - bytes_per_pixel;
                                    unfiltered_byte_value_above_left = unfiltered_scanlines_buffer.readUInt8(byte_pos - scanline_length - bytes_per_pixel);
                                }


                                unfiltered_byte = unfiltered_scanlines_buffer.readUInt8(byte_pos);
                                filtered_byte = unfiltered_byte - paeth_predictor(unfiltered_byte_value_left, unfiltered_byte_value_above, unfiltered_byte_value_above_left);
                                if (filtered_byte < 0) filtered_byte = filtered_byte + 256;
                                scanlines_buffer.writeUInt8(filtered_byte, byte_pos);
                            }
                        }
                    }
                }
                //console.log('scanlines_buffer.length ' + scanlines_buffer.length);
            },
            
            
            '_filter_all_scanlines': function() {
                
                //console.log('filter_all_scanlines');
                //throw 'stop';
                
                //this.ensure_unfiltered_scanlines_buffer();
                
                var h = this.size[1];
                for (var y = 0; y < h; y++) {
                    this.filter_scanline(y);
                }
                
            },
            
            
            // want to be able to change it to a higher bit depth.
            //  could change to argb, then copy the scanlines directly... but would need to keep the same filtering?
            //  maybe best to go via the pixels.
            
            // // change to most appropriate filter for compression... would use a means of choosing it line-by-line even.
            //  could have option for highest compression using a GA and lots of time.
            //  as well as using the established filter method selection heuristic(s).
            
            
            
            // convert to different format...
            //  want to investigate changing down to indexed color from an rgba image.
            //  can try different quantizing and dithering methods.
            
            'set_color_parameters': function(color_type, bit_depth) {
                // could take a string such as 'rgba 32'. ???
                //  make more flexible with fp?

                //console.log('set_color_parameters color_type ' + color_type);
                //console.log('bit_depth ' + bit_depth);
                //console.log('');

                // Want to be able to set this to greyscale
                //  (greyscale with alpha 4) 

                var val;

                // This loop is running pretty quick now!
                //  The inline pixel iteration function does not seem that slow...
                //   but of course that function call will come at a cost.

                // Truecolor rgb, no alpha
                if (color_type == 2) {
                    if (bit_depth == 8) {
                        //console.log('converting to rgb no alpha');

                        var trans_replacement_r = 255;
                        var trans_replacement_g = 255;
                        var trans_replacement_b = 255;

                        if (typeof arguments[2] != 'undefined') trans_replacement_r = arguments[2];
                        if (typeof arguments[3] != 'undefined') trans_replacement_g = arguments[3];
                        if (typeof arguments[4] != 'undefined') trans_replacement_b = arguments[4];
                        //console.log('trans_replacement_val ' + trans_replacement_val);
                        //var trans_replacement_val = arguments[3] || 255;

                        var scanline_data_length = 3 * this.size[0];
                        var new_scanline_length = scanline_data_length + 1;
                        var new_scanline_buffer_length = new_scanline_length * this.size[1];
                        var new_scanline_buffer = new Buffer(new_scanline_buffer_length);
                        var new_scanline_buffer_write_pos = 0;
                        var pixel_pos_in_new_scanline_buffer, offset, round = Math.round;
                        var that = this;

                        this.iterate_pixels(function(x, y, r, g, b, a) {
                            //val = round((r + g + b) / 3);
                            if (x == 0) {
                                offset = y * new_scanline_length;
                                //console.log('offset ' + offset);
                                new_scanline_buffer.writeUInt8(0, offset);
                            }

                            pixel_pos_in_new_scanline_buffer = (y * new_scanline_length) + 1 + (x * 3);
                            //console.log('pixel_pos_in_new_scanline_buffer ' + pixel_pos_in_new_scanline_buffer);
                            
                            
                            if (a == 0) {
                                //new_scanline_buffer.writeUInt8(trans_replacement_val, pixel_pos_in_new_scanline_buffer);
                                new_scanline_buffer.writeUInt8(trans_replacement_r, pixel_pos_in_new_scanline_buffer);
                                new_scanline_buffer.writeUInt8(trans_replacement_g, pixel_pos_in_new_scanline_buffer + 1);
                                new_scanline_buffer.writeUInt8(trans_replacement_b, pixel_pos_in_new_scanline_buffer + 2);

                            } else {
                                new_scanline_buffer.writeUInt8(r, pixel_pos_in_new_scanline_buffer);
                                new_scanline_buffer.writeUInt8(g, pixel_pos_in_new_scanline_buffer + 1);
                                new_scanline_buffer.writeUInt8(b, pixel_pos_in_new_scanline_buffer + 2);

                            }

                            // discard the aplha value
                            //new_scanline_buffer.writeUInt8(a, pixel_pos_in_new_scanline_buffer + 1);
                        })

                        that.bit_depth = bit_depth;
                        that.color_type = color_type;
                        that.scanlines_buffer = new_scanline_buffer;
                        that.palette = null;
                        that.palette_with_alphas = null;
                        that.scanline_length = new_scanline_length;
                        that.scanline_data_length = new_scanline_length - 1;
                    }
                }

                // Greyscale with no alpha.
                if (color_type == 0) {
                    if (bit_depth == 8) {
                        //console.log('converting to greyscale no alpha');

                        var trans_replacement_val = 255;
                        if (typeof arguments[2] != 'undefined') trans_replacement_val = arguments[2];
                        //console.log('trans_replacement_val ' + trans_replacement_val);
                        //var trans_replacement_val = arguments[3] || 255;

                        var scanline_data_length = 1 * this.size[0];
                        var new_scanline_length = scanline_data_length + 1;
                        var new_scanline_buffer_length = new_scanline_length * this.size[1];
                        var new_scanline_buffer = new Buffer(new_scanline_buffer_length);
                        var new_scanline_buffer_write_pos = 0;
                        var pixel_pos_in_new_scanline_buffer, offset, round = Math.round;
                        var that = this;

                        this.iterate_pixels(function(x, y, r, g, b, a) {
                            val = round((r + g + b) / 3);
                            if (x == 0) {
                                offset = y * new_scanline_length;
                                //console.log('offset ' + offset);
                                new_scanline_buffer.writeUInt8(0, offset);
                            }

                            pixel_pos_in_new_scanline_buffer = (y * new_scanline_length) + 1 + (x * 1);
                            //console.log('pixel_pos_in_new_scanline_buffer ' + pixel_pos_in_new_scanline_buffer);
                            
                            
                            if (a == 0) {
                                new_scanline_buffer.writeUInt8(trans_replacement_val, pixel_pos_in_new_scanline_buffer);
                            } else {
                                new_scanline_buffer.writeUInt8(val, pixel_pos_in_new_scanline_buffer);
                            }

                            // discard the aplha value
                            //new_scanline_buffer.writeUInt8(a, pixel_pos_in_new_scanline_buffer + 1);
                        })

                        that.bit_depth = bit_depth;
                        that.color_type = color_type;
                        that.scanlines_buffer = new_scanline_buffer;
                        that.palette = null;
                        that.palette_with_alphas = null;
                        that.scanline_length = new_scanline_length;
                        that.scanline_data_length = new_scanline_length - 1;
                    }
                }


                if (color_type == 4) {
                    if (bit_depth == 8) {
                        //console.log('converting to greyscale with alpha');

                        // inline pixel iteration here?
                        //  

                        // keep the same alpha,
                        //  use the average of r, g, b

                        // depending on what the current color mode is

                        // 2 - truecolor
                        // 6 - truecolor + alpha

                        // 0 is greyscale no alpha
                        //  but this has not been requested at the moment.

                        // need to make a new scanline buffer - smaller this time.
                        var scanline_data_length = 2 * this.size[0];
                        var new_scanline_length = scanline_data_length + 1;
                        var new_scanline_buffer_length = new_scanline_length * this.size[1];
                        var new_scanline_buffer = new Buffer(new_scanline_buffer_length);
                        var new_scanline_buffer_write_pos = 0;
                        var pixel_pos_in_new_scanline_buffer, offset, round = Math.round;
                        var that = this;

                        this.iterate_pixels(function(x, y, r, g, b, a) {
                            val = round((r + g + b) / 3);

                            // then set the pixel?

                            if (x == 0) {
                                offset = y * new_scanline_length;
                                //console.log('offset ' + offset);
                                new_scanline_buffer.writeUInt8(0, offset);
                            }

                            pixel_pos_in_new_scanline_buffer = (y * new_scanline_length) + 1 + (x * 2);
                            //console.log('pixel_pos_in_new_scanline_buffer ' + pixel_pos_in_new_scanline_buffer);
                            new_scanline_buffer.writeUInt8(val, pixel_pos_in_new_scanline_buffer);
                            new_scanline_buffer.writeUInt8(a, pixel_pos_in_new_scanline_buffer + 1);
                        })

                        that.bit_depth = bit_depth;
                        that.color_type = color_type;
                        that.scanlines_buffer = new_scanline_buffer;
                        that.palette = null;
                        that.palette_with_alphas = null;
                        that.scanline_length = new_scanline_length;
                        that.scanline_data_length = new_scanline_length - 1;


                    }
                }

                // 6	Truecolor & alpha
                //  32 bpp, bit depth is 8 bits per channel.
                
                // color_type 2 (rgb truecolor), bit depth 8
                // no alpha channel.
                
                // with some of them, depends on the current color parameters.
                //  Easier to increase it to higher detail per pixel.
                //   May need to compress when saving it to lower detail to keep image quality.
                
                if (color_type == 6) {
                    if (bit_depth == 8) {
                        // a lot bigger than 1 bpp indexed!

                        throw 'stop, needs param changing, no [r,g,b,a] array any longer, they are separate params'
                        
                        var scanline_data_length = 4 * this.size[0];
                        //console.log('scanline_data_length ' + scanline_data_length);
                        
                        var new_scanline_length = scanline_data_length + 1;
                        var new_scanline_buffer_length = new_scanline_length * this.size[1];
                        
                        //console.log('new_scanline_buffer_length ' + new_scanline_buffer_length);
                        
                        var new_scanline_buffer = new Buffer(new_scanline_buffer_length);
                        
                        var new_scanline_buffer_write_pos = 0;
                        
                        var that = this;
                        //console.log('pre iterate_pixels');
                        this.iterate_pixels(function(x, y, color) {
                            // consult the palette...
                            
                            //console.log('found pixel -----------------');
                            
                            // for a new line need to make a new scanline.
                            if (x == 0) {
                                new_scanline_buffer.writeUInt8(0, y * new_scanline_length);
                                
                            }
                            // red, green, blue, alpha
                            
                            // this.color_type
                            var col;
                            //console.log('that.color_type ' + that.color_type);
                            if (that.color_type == 2 || that.color_type == 6) {
                                col = color;
                            }
                            if (that.color_type == 3) {
                                if (that.palette_with_alphas) {
                                    col = that.palette_with_alphas[color];
                                } else if (that.palette) {
                                    col = that.palette[color];
                                }
                            }
                            
                            //console.log('col ' + stringify(col));
                            if (col) {
                                var pixel_pos_in_new_scanline_buffer = (y * new_scanline_length) + 1 + (x * 4);
                                
                                new_scanline_buffer.writeUInt8(col[0], pixel_pos_in_new_scanline_buffer);
                                new_scanline_buffer.writeUInt8(col[1], pixel_pos_in_new_scanline_buffer + 1);
                                new_scanline_buffer.writeUInt8(col[2], pixel_pos_in_new_scanline_buffer + 2);
                                
                                if (col.length == 3) {
                                    new_scanline_buffer.writeUInt8(255, pixel_pos_in_new_scanline_buffer + 3);
                                } else if (col.length == 4) {
                                    new_scanline_buffer.writeUInt8(col[3], pixel_pos_in_new_scanline_buffer + 3);
                                }
                            }
                            
                        });
                    
                        that.bit_depth = bit_depth;
                        that.color_type = color_type;
                        that.scanlines_buffer = new_scanline_buffer;
                        that.palette = null;
                        that.palette_with_alphas = null;
                        that.scanline_length = new_scanline_length;
                        that.scanline_data_length = new_scanline_length - 1;
                        //var new_scanline_buffer = 
                        // iterate the pixels,
                    }
                }
                
            },
            
            'get_signature_buffer': function() {
                var png_signature_buffer = new Buffer(8);
                png_signature_buffer.writeUInt8(137, 0);
                png_signature_buffer.writeUInt8(80, 1);
                png_signature_buffer.writeUInt8(78, 2);
                png_signature_buffer.writeUInt8(71, 3);
                png_signature_buffer.writeUInt8(13, 4);
                png_signature_buffer.writeUInt8(10, 5);
                png_signature_buffer.writeUInt8(26, 6);
                png_signature_buffer.writeUInt8(10, 7);
                return png_signature_buffer;
            },
            
            'get_buffer_IHDR': function() {
                var that = this;
                var res = new Buffer(25);
                //res.writeUInt32BE(0,
                res.writeUInt32BE(13, 0);
                res.write('IHDR', 4);
                //res.writeUInt32BE(14, 4);
                res.writeUInt32BE(that.size[0], 8);
                res.writeUInt32BE(that.size[1], 12);
                res.writeUInt8(that.bit_depth, 16);
                res.writeUInt8(that.color_type, 17);
                res.writeUInt8(0, 18);
                res.writeUInt8(0, 19);
                res.writeUInt8(0, 20);
                
                // also need to write the crc??
                //  crc based on the data of the chunk.
                
                // from position 8 to the end, 19?
                
                //var buf_for_crc = new Buffer(14);
                //res.copy(buf_for_crc, 0, 7)
                
                //var ihdr_crc = buffer_crc32.unsigned(buf_for_crc);
                //console.log('ihdr_crc ' + ihdr_crc);
                //console.log('topeof ihdr_crc ' + typeof ihdr_crc);
                //res.writeUInt32BE(ihdr_crc, 20);
                
                res.writeInt32BE(CrcStream.crc32(res.slice(4, res.length - 4)), res.length - 4);

                //res.write(ihdr_crc, 20);
                
                return res;
            },
            
            'get_buffer_IDAT': function(callback) {
                // if we have loaded it, we have the unfiltered_scanlines_buffer.
                // we want to be able to use the unfiltered scanlines buffer to save,
                //  re-encoding it.
                // It's easier to do operations on the unfiltered scanlines buffer.
                //  Keeping them in sync after each operation may be tricky... more costly for cpu.
                // It could vary though, because a small update would not need full image re-encoding.
                //  Could have optional partial image reencoding.
                
                // for the moment, want to improve the save function.
                //  want to have a function that encodes the filtered scanlines based on optimizing which canline filter to use.
                
                // but when it is loaded, we have it loaded into the unfiltered scanline buffer?
                
                
                //this.ensure_unfiltered_scanlines_buffer();
                
                //this.filter_all_scanlines();
                //  not any more... this relies on the scanlines being right at this time.
                //  generally the unfilteres scanlines buffer will be kept up to date.
                
                
                var deflate = zlib.createDeflate({
                        chunkSize: 32 * 1024,
                        level: 9,
                        strategy: 3,
                        windowBits: 15,
                        memLevel: 9
                    });
                //deflate.on('error', this.emit.bind(this, 'error'));
                deflate.on('error', function() {
                    //console.log('deflate error');
                });
            
                var buffers = [];
                var nread = 0;
                
                var that = this;
                
                deflate.on('data', function(chunk) {
                    //this.emit('data', this._packIDAT(data));
                    // got deflated data... buffer
                    
                    //console.log('got deflate data, length: ' + chunk.length);
                    buffers.push(chunk);
                    nread = nread + chunk.length;
                });
                
                deflate.on('end', function() {
                    //this.emit('data', this._packIEND());
                    //this.emit('end');
                    //console.log('deflate end');
                    
                    var buffer;
                    //var nread = 0;
                    switch (buffers.length) {
                        case 0: // no data.  return empty buffer
                            buffer = new Buffer(0);
                            break;
                        case 1: // only one chunk of data.  return it.
                            buffer = buffers[0];
                            break;
                        default: // concatenate the chunks of data into a single buffer.
                            buffer = new Buffer(nread);
                            var n = 0;
                            buffers.forEach(function(b) {
                                var l = b.length;
                                b.copy(buffer, n, 0, l);
                                n += l;
                            });
                            break;
                    }
                    
                    //var IHDR_buffer = that.get_buffer_IHDR();
                    // then use the buffer...
                    
                    var IDAT_buffer = new Buffer(buffer.length + 12);
                    //var crc32 = buffer_crc32.unsigned(buffer);
                    IDAT_buffer.writeUInt32BE(buffer.length, 0);
                    IDAT_buffer.write('IDAT', 4);
                    
                    buffer.copy(IDAT_buffer, 8);
                    //IDAT_buffer.writeUInt32BE(crc32, 8 + buffer.length);
                    IDAT_buffer.writeInt32BE(CrcStream.crc32(IDAT_buffer.slice(4, IDAT_buffer.length - 4)), IDAT_buffer.length - 4);
                    //IDAT_buffer.writeInt32BE(CrcStream.crc32(buffer), IDAT_buffer.length - 4);

                    callback(IDAT_buffer);
                });
                
                //console.log('');
                //console.log('this.scanlines_buffer.length ' + this.scanlines_buffer.length);

                //for (var c = 0, l = this.scanlines_buffer.length; c < l; c++) {
                //    console.log('pre make idat val ' + this.scanlines_buffer.readUInt8(c));
                //}

                deflate.end(this.scanlines_buffer);
            },
            
            'get_buffer_IEND': function() {
                var IEND_buffer = new Buffer(12);
                IEND_buffer.writeUInt32BE(0, 0);
                IEND_buffer.write('IEND', 4);
                
                IEND_buffer.writeInt32BE(CrcStream.crc32(IEND_buffer.slice(4, IEND_buffer.length - 4)), IEND_buffer.length - 4);

                return IEND_buffer;
            },
            
            // also may want to save to a buffer?
            //  saving to a stream should probably be fine.
            
            // may want to pipe to a stream?
            
            // get this as an RGB or RGBA buffer.
            
            //'save_to_stream': function(output_stream
            
            // a writable stream.
            'save_to_stream': fp(function(a, sig) {
                //console.log('save_to_stream');
                var stream, options = {};
                // stream
                // stream, options
                
                //console.log('sig ' + sig);
                //console.log('tof(a[0]) ' + tof(a[0]));
                if (sig == '[W]') {
                    stream = a[0];
                }
                if (sig == '[W,o]') {
                    stream = a[0];
                    options = a[1];
                }
                
                var optimize = options.optimize;
                //console.log('optimize ' + optimize);
                //throw 'stop';
                //console.log('stream ' + stream);

                
                var that = this;
                
                var do_optimize = function(callback) {
                    // optimizing the scanline filters.
                    if (optimize == 'fast' || optimize == 'best') {
                        
                        that.optimize_filter_all_scanlines({'optimize': optimize}, function(err, res_best_filters) {
                            //that.filter_all_scanlines();
                            callback(null, true);
                        })
                        //that.optimize_scanline_filters(function(err, res_best_filters) {
                        //    that.filter_all_scanlines();
                        //    callback(null, true);
                        //})
                    } else {
                        callback(null, true);
                    }
                }
                
                var do_save = function() {
                    //console.log('stream ' + stream);
                    var png_signature_buffer = that.get_signature_buffer();
                    var IHDR_buffer = that.get_buffer_IHDR();
                    that.get_buffer_IDAT(function(IDAT_buffer) {
                        var IEND_buffer = that.get_buffer_IEND();
                        stream.write(png_signature_buffer);
                        stream.write(IHDR_buffer);
                        stream.write(IDAT_buffer);
                        stream.write(IEND_buffer);
                        stream.end();
                        stream.destroySoon();
                        //callback();
                    });
                }
                
                if (optimize) {
                    do_optimize(function(err, res_optimize) {
                        if (err) {
                            throw err;
                        } else {
                            do_save();
                        }
                    })
                } else {
                    do_save();
                }
                
                // and this could also allow options and optimizations.
                //  but that could be 'export'? may need to make a copy before saving with lossy options.
                
                // stream in a sig as S?
                // don't think callback is needed because we can detect when the stream ends.
                
                
            }),
            
            // will take optimizations here.
            //  will do the optimizations on the PNG before saving.
            
            
            
            'save_to_disk': fp(function(a, sig) {
                var dest_path, options = {}, callback;
                
                
                if (sig == '[s,f]') {
                    dest_path = a[0];
                    callback = a[1];
                }
                if (sig == '[s,o,f]') {
                    dest_path = a[0];
                    options = a[1];
                    callback = a[2];
                }
                
                // then will carry out optimization if there is more to do.
                
                // then check for particulat optimizations to do.
                
                var optimize = {} || options.optimize;
                
                // saves the compressed scanlines, with all the metadata.
                
                // an optimize option will select optimal scanline filters.
                // perhaps the optimizations in an array?
                
                // can have options - options like optimize_scanline_filters
                //  and possibly different optimization levels.
                
                // or optimize: 'best'
                //  would carry out palette reduction if appropriate.
                
                // optimize: {'scanline_filters': 'best'}
                
                // optimize_scanline_filters: 'best' || 'good'
                // true = best?
                /*
                var do_optimize = function(callback) {
                    if (optimize.scanline_filters) {
                        // then do the optimization?
                        // or just tell it to do the optimization in the options.
                        
                        
                    }
                    
                }
                */
                var that = this;
                
                var do_save = function() {
                    //var that = this;
                    //console.log('do_save');
                    // save_to_stream
                    
                    // Do we need to test for the stream methods / API?

                    // tof with wave 'W' and 'R'.
                    //  or WS and RS?

                    var stream = fs.createWriteStream(dest_path, {flags: 'w'});
                    //var Stream = require('stream');

                    //console.log('stream ' + tof(stream));
                    //console.log('readable ' + (stream instanceof Stream.Readable));
                    //console.log('writable ' + (stream instanceof Stream.Writable));

                    //throw 'stop';
                    //stream.on('end', function() {
                    stream.on('close', function() {
                    
                        //throw 'stop';
                        callback(null, that);
                    });
                    that.save_to_stream(stream, options);
                }
                
                do_save();
                
                // this does not change the filter used on scanlines, but we may want to reencode scanlines after having changed
                //  unencoded scanlines.
                // This may need to update the scanlines from the unfiltered data.
                
                // Can be broken into a few save functions.
                
                // create a write buffer
                //  the various parts will be saved
                
            }),
            
            
            // Want it so that it can load directly from a stream.
            
            
            // want to be able to read a whole stream.
            //  Don't think I'll buffer the whole thing.
            //  Copy from the stream into this object.
            // That code could be used as the basis for outputting to an RGBA or RGB stream too - but it may require
            //  decoding in some cases.
            
            // load_from_stream
            
            // and load_from_disk will wind up using that.
            
            // we can read the inital part, then see how big a buffer to make for the data.
            //  can calculate the scanlines buffer length while reading the idat chunk
            //  and then we don't need to buffer everything as it comes in.
            //  just recieve info from the stream, process each piece, then it's done.
            //   then change load_from_disk so that it uses the load_from_stream code.
            
            // Also want to be able to save to a stream, and have the save_to_disk function use that one.
            
            // this needs to use a callback because of deflate/inflate being async.
            
            'load_from_buffer': function(buffer, callback) {
                // get to read through the whole buffer.
                
                // will load it chunk by chunk.
                //console.log('load_from_buffer ');
                // buffer.length
                // use a finite state machine to read through the buffer.
                
                // read the first items quickly... set some data.
                //  can read a chunk though.
                
                // will improve to code to use chunk buffers.
                
                var that = this;
                
                var found_IHDR_chunk = function(chunk_buffer) {
                    var chunk_length = chunk_buffer.readUInt32BE(0);
                    //console.log('IHDR chunk_length ' + chunk_length);
                    
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
                    
                    that.size = [img_width, img_height]
                    that.bit_depth = bit_depth;
                    that.color_type = color_type;
                    that.compression_method = compression_method;
                    
                    //console.log('bit_depth ' + bit_depth);
                    //console.log('color_type ' + color_type);
                    //console.log('that.size ' + stringify(that.size));
                    
                    // calculate the size of the image data buffer.
                    //  will hold the indexed pixel data if needed.
                    
                    // calculate the scanline length here.
                    
                    // depends on the bit depth... need to get the right scanline length.
                    
                    var scanline_image_data_length;
                    
                    // and depends on the color mode.
                    
                    if (bit_depth == 1) {
                        // not quite sure...
                        //  32 pixels wide... therefore 

                        scanline_image_data_length = Math.ceil(that.size[0] / 8);
                    }
                    if (bit_depth == 2) {
                        scanline_image_data_length = Math.ceil(that.size[0] / 4);
                    }
                    if (bit_depth == 4) {
                        scanline_image_data_length = Math.ceil(that.size[0] / 2);
                    }
                    if (bit_depth == 8) {
                        if (color_type == 2) {
                            scanline_image_data_length = that.size[0] * 3;
                        } else if (color_type == 6) {
                            scanline_image_data_length = that.size[0] * 4;
                        }
                    }

                    //console.log('scanline_image_data_length ' + scanline_image_data_length);
                    //throw 'stop';
                    
                    // bit depth 16...
                    //  was not expecting that. greyscale of some kind.
                    
                    
                    //console.log('scanline_image_data_length ' + scanline_image_data_length);
                    
                    // scanline_length depends on the number of bits per pixel.
                    
                    var scanline_length = scanline_image_data_length + 1;
                    
                    //console.log('scanline_length ' + scanline_length);
                    
                    that.scanline_image_data_length = scanline_image_data_length;
                    that.scanline_length = scanline_length;
                    
                    var scanlines_buffer_length = that.scanline_length * that.size[1];
                    //console.log('scanlines_buffer_length ' + scanlines_buffer_length);
                    //throw 'stop';
                    that.scanlines_buffer_length = scanlines_buffer_length;
                    
                    var scanlines_buffer = new Buffer(scanlines_buffer_length);
                    that.scanlines_buffer = scanlines_buffer;
                    //console.log('that.scanlines_buffer ' + that.scanlines_buffer);
                    //throw 'stop';
                    that.scanlines_buffer_write_pos = 0;
                    
                }
                
                var found_gAMA_chunk = function(chunk_buffer) {
                    var chunk_length = chunk_buffer.readUInt32BE(0);
                    //console.log('gAMA chunk_length ' + chunk_length);
                    
                    var value = chunk_buffer.readUInt32BE(8);
                    
                    //console.log('value ' + value);
                }
                
                var found_PLTE_chunk = function(chunk_buffer) {
                    var chunk_length = chunk_buffer.readUInt32BE(0);
                    //console.log('PLTE chunk_length ' + chunk_length);
                    
                    // then we get the chunk data... all the colors
                    
                    var num_colors = chunk_length / 3;
                    //console.log('num_colors ' + num_colors);
                    
                    // then parse the individual colors.
                    
                    var c = 0;
                    var color_begin_pos = 8;

                    // create a palette buffer, with the data for the chunk.
                    //  will be simpler operating on a low level buffer like that.

                    that.palette_buffer = new Buffer(chunk_length);
                    chunk_buffer.copy(that.palette_buffer, 0, 8, 8 + chunk_length);

                    while (c < num_colors) {
                        // the color is stored as 4 1 byte values.
                        //  but the info about color locations could be parsed out?
                        //  in this situation, we want the colors from the pallet.
                        
                        var color = [chunk_buffer.readUInt8(color_begin_pos), chunk_buffer.readUInt8(color_begin_pos + 1), chunk_buffer.readUInt8(color_begin_pos + 2)];
                        colors.push(color);
                        
                        
                        color_begin_pos = color_begin_pos + 3;
                        
                        c++;
                    }
                    that.palette = colors;
                    
                    //console.log('colors ' + stringify(colors));
                    //console.log('colors.length ' + stringify(colors.length));
                    
                }
                
                var found_tRNS_chunk = function(chunk_buffer) {
                    var chunk_length = chunk_buffer.readUInt32BE(0);
                    //console.log('tRNS chunk_length ' + chunk_length);
                    
                    //var value = chunk_buffer.readUInt32BE(8);
                    
                    //console.log('value ' + value);
                    if (color_type == 3) {
                        // then we read in all the color values.
                        trans = [];
                        for (var c = 8; c < 8 + chunk_length; c++) {
                            var alpha = chunk_buffer.readUInt8(c);
                            //console.log('alpha ' + alpha);
                            trans.push(alpha);
                        }
                        
                        // then create the colors with alpha values.
                        
                        each(colors, function(i, v) {
                            if (is_defined(trans[i])) {
                                var color_with_alpha = [v[0], v[1], v[2], trans[i]];
                                colors_with_alpha.push(color_with_alpha);
                            } else {
                                var color_with_alpha = [v[0], v[1], v[2], 255];
                                colors_with_alpha.push(color_with_alpha);
                            };
                            
                            //var color_with_alpha = [v[0], v[1], v[2], ]
                        });
                        //console.log('colors_with_alpha ' + stringify(colors_with_alpha));
                        
                        that.palette_with_alphas = colors_with_alpha;
                        
                    }
                    
                }
                
                // May go back to the old way... remembering that it's processing asyncronously, and running the callback when its stopped.
                
                var num_processing = 0;
                
                var on_chunk_read_complete = function() {
                    //console.log('
                    //if (num_processing == 0) {
                        callback(null, that);
                    //}
                }
                
                // need to compose together all the IDAT chunks.
                
                var idat_content_buffers = [];
                var deflated_length = 0;
                
                var found_IDAT_chunk = function(chunk_buffer) {
                    //pending_chunk_reads++;
                
                    var chunk_length = chunk_buffer.readUInt32BE(0);
                    //console.log('IDAT chunk_length ' + chunk_length);
                    
                    var idx_data_start = 8;
                    var idx_data_end = idx_data_start + chunk_length;
                    
                    //var inflate = zlib.createInflate();
                    
                    // inflate it to a stream or buffer?
                    
                    var buffer_deflated = new Buffer(chunk_length);
                    chunk_buffer.copy(buffer_deflated, 0, idx_data_start, idx_data_end);
                    
                    // inflate is async... need to be careful about this.
                    //  so this parsing happens after the IEND chunk has been read.
                    //  so, likely to have a callback that occurrs when every inflation has been done.
                    
                    // careful about race conditions with inflate too.
                    
                    // want it so that the inflated parts get put back in the proper order.
                    
                    /*
                    
                    num_processing++;
                    zlib.inflate(buffer_deflated, function(err, buffer_inflated) {
                        //console.log('err ' + err);
                        //console.log('res ' + res);
                        if (err) {
                            
                        } else {
                        
                            console.log('buffer_inflated.length ' + buffer_inflated.length);
                            buffer_inflated.copy(that.scanlines_buffer, that.scanlines_buffer_write_pos);     
                            that.scanlines_buffer_write_pos = that.scanlines_buffer_write_pos + buffer_inflated.length;
                                
                            
                            num_processing--;
                            //pending_chunk_reads--;
                            on_chunk_read_complete();                                            
                        }
                    })
                    */
                    deflated_length += buffer_deflated.length;
                    idat_content_buffers.push(buffer_deflated);
                    // may be best having some other asyncronous processing.
                    //  need to be careful about inflating the chunks and processing them correctly.
                    
                }
                
                var found_IEND_chunk = function(chunk_buffer) {
                    
                    // then the image is finished.
                    var chunk_length = chunk_buffer.readUInt32BE(0);
                    //console.log('IEND chunk_length ' + chunk_length);
                    //var that = this;
                    // let's do the callback, returning the palette data.
                    
                    //callback(that);
                    
                    //on_chunk_read_complete();  
                    
                    // has finished. this needs to use a callback
                    
                    //callback(null, that);
                    
                    // then put together all the idat data, decompress it.
                    
                    var buffer_idat_defalted = Buffer.concat(idat_content_buffers, deflated_length);
                    
                    zlib.inflate(buffer_idat_defalted, function(err, buffer_inflated) {
                        //console.log('err ' + err);
                        //console.log('res ' + res);
                        if (err) {
                            
                        } else {
                            //console.log('buffer should have inflated');
                            //console.log('buffer_inflated.length ' + buffer_inflated.length);
                            //console.log('that.scanlines_buffer ' + that.scanlines_buffer);
                            buffer_inflated.copy(that.scanlines_buffer, that.scanlines_buffer_write_pos);     
                            that.scanlines_buffer_write_pos = that.scanlines_buffer_write_pos + buffer_inflated.length;
                                
                            num_processing--;
                            //pending_chunk_reads--;
                            //on_chunk_read_complete();
                            
                            //console.log('finished loading image');
                            // No need to do this on load I think.
                            //that.ensure_unfiltered_scanlines_buffer();
                            
                            callback(null, that);                                       
                        }
                    })
                    //on_chunk_read_complete();
                }
                
                var found_chunk = function(chunk_buffer) {
                    
                    // interpret the chunk, and raise an event for having found that kind of chunk.
                    
                    var chunk_length = chunk_buffer.readUInt32BE(0);
                    //console.log('chunk_length ' + chunk_length);
                    
                    var chunk_type = chunk_buffer.toString('ascii', 4, 8);
                    //console.log('* chunk_type ' + chunk_type + '  ');
                    
                    // beginning of the chunk data, end of chunk data
                    //  From the chunk buffer.
                    //  Not sure we really need a chunk buffer anyway, but maybe buffer is more suitable than string for various things.
                    
                    var idx_chunk_data_beginning = 8;
                    var idx_chunk_data_ending = idx_chunk_data_beginning + chunk_length - 8;
                    
                    var chunk_crc = chunk_buffer.readUInt32BE(idx_chunk_data_ending);
                    
                    if (chunk_type == 'IHDR') {
                        found_IHDR_chunk(chunk_buffer);
                    }
                    
                    if (chunk_type == 'gAMA') {
                        found_gAMA_chunk(chunk_buffer);
                    }
                    if (chunk_type == 'PLTE') {
                        found_PLTE_chunk(chunk_buffer);
                    }
                    if (chunk_type == 'tRNS') {
                        found_tRNS_chunk(chunk_buffer);
                    }
                    if (chunk_type == 'IDAT') {
                        found_IDAT_chunk(chunk_buffer);
                    }
                    if (chunk_type == 'IEND') {
                        found_IEND_chunk(chunk_buffer);
                    }
                    
                }
                
                // need to separate the chunks out of the buffers.
                var data_num = 0;
                var chunk_beginning_pos;
                var next_chunk_pos;
                
                if (data_num == 0) {
                    // we start by finding the PNG signature and the first chunk.
                    chunk_beginning_pos = 8;
                    var chunk_length = buffer.readUInt32BE(chunk_beginning_pos);
                    //console.log('chunk_length ' + chunk_length);
                    
                    // make a new chunk buffer and read that chunk into the buffer
                    //  check there is enough space left in the current buffer.
                    
                    var buf_chunk = new Buffer(chunk_length + 12);
                    var next_chunk_pos = chunk_beginning_pos + 12 + chunk_length;
                    
                    // check that it's within the bounds of the data... otherwise don't write it.
                    //  otherwise will write an incomplete buffer.
                    buffer.copy(buf_chunk, 0, chunk_beginning_pos, next_chunk_pos);
                    
                    found_chunk(buf_chunk);
                    // then read everything from the chunk into chunk data.
                }
                
                var ctu = true;
                while (ctu && next_chunk_pos < buffer.length) {
                    chunk_beginning_pos = next_chunk_pos;
                    //console.log('chunk_beginning_pos ' + chunk_beginning_pos);
                    // copy that chunk into a buffer and give it to the chunk comprehension.
                    var chunk_length = buffer.readUInt32BE(chunk_beginning_pos);
                    //console.log('chunk_length ' + chunk_length);
                    
                    // chunk_end_position_in_read_buffer
                    
                    var chunk_end_position_in_read_buffer = chunk_beginning_pos + chunk_length + 12
                    
                    if (chunk_end_position_in_read_buffer > buffer.length) {
                        // need to copy this into the temporary buffer
                        //  buffer for incomplete chuncks that have been read.
                        incomplete_chunk_buffer = new Buffer(buffer.length - chunk_end_position_in_read_buffer);
                        buffer.copy(incomplete_chunk_buffer, 0, chunk_beginning_pos, buffer.length);
                        ctu = false;
                        
                    } else {
                        var buf_chunk = new Buffer(chunk_length + 12);
                        var next_chunk_pos = chunk_end_position_in_read_buffer;
                        //console.log('next_chunk_pos ' + next_chunk_pos);
                        
                        buffer.copy(buf_chunk, 0, chunk_beginning_pos, next_chunk_pos);
                        found_chunk(buf_chunk);
                    }
                }
                data_num++;
            },
            
            // another function could deal with recieving / streaming in the PNG.
            //  could stream out an RGB or ARGB buffer.
            
            // for the moment it's not a problem to load the whole PNG.
            
            'load_from_stream': function(input_stream, callback) {
                // we can have this process buffers of the chunks.
                //  one thing is, we don't keep a buffer of the whole thing.
                
                // don't know about how chunks will work so well in this stream.
                
                // maybe everything does need to be fed through as chunks.
                //  may need to build up buffers to handle incomplete chunks within the stream
                //  data event. we don't have the full size of the completed buffer, should not assume we
                //  have that at least.
                
                // could build a buffer of the previous buffers
                //  and concat them. then we read through completed chunks?
                
                // just responding to the data may not be so hard - but do need to make sure chunks are received together.
                
                // so can store away / put into buffers completed chunks as they come in.
                //  then those buffers would get removed, and a new set of buffers created while reading a chunk.
                
                // data can be broken up, however.
                
                // I think load the whole thing into a buffer, reading to the end would work.
                
                // Could do processing / docoding / copying of it as it comes in...
                //  but then again building up the complete image buffer will be easier to do.
                
                // could also use it to check if the results are the same when using a more complex method that reads as the stream progresses.
                var that = this;
                var buffers = [];
                var bytes_read = 0;
                input_stream.on('data', function(data_buffer) {
                    buffers.push(data_buffer);
                    bytes_read += data_buffer.length;
                });
                
                input_stream.on('end', function() {
                    var image_buffer = Buffer.concat(buffers, bytes_read);
                    that.load_from_buffer(image_buffer, function() {
                        callback(null, that);
                    }); 
                });
            },
            
            // load_from_stream_evented
            //  would have events / functions that get called when it has recieved certain data.
            //   a more complex version of the function I think.
            
            'load_from_disk': function(source_path, callback) {
                // don't need to get the size first... it counts the bytes received in the stream.
                //  then it loads from the buffer.
                var that = this;
                
                fs.open(source_path, 'r', function(err, fd) {
                    if (err) {
                        //throw err;
                        return callback(err);
                    } else {
                        var src = fs.createReadStream(source_path);
                        that.load_from_stream(src, callback);
                    }
                });
            }
            
            // count_rgb_colors
            //  possibly iterate pixels, possibly go through the unfiltered scanline buffer.
            
            
            
            
            
        })
        
        // Interested in using this in streaming mode.
        //  Decoding a PNG input stream, outputting an RGBA output stream.
        
        // would be making a new version like load_from_disk...
        //  decode_stream.
        
        // can pipe to an output stream?
        //  write to an output stream?
        
        // will give that more thought.
        
        var load_from_disk = function(source_path, callback) {
            var res = new PNG({});
            res.load_from_disk(source_path, callback);
        }
        
        // load from disk
        
        // get png metadata from path...
        
        var load_metadata_from_disk = function(source_path, callback) {
            
            var found_metadata = function(obj_metadata) {
                // and can we close the read buffer?
                
                callback(null, obj_metadata);
            }
            
            fs.stat(source_path, function(err, stats) {
                if (err) {
                    
                } else {
                    var size = stats.size;
                    var png_input_buffer = new Buffer(size);
                    
                    fs.open(source_path, 'r', function(err, fd) {
                        if (err) {
                            
                        } else {
                            var src = fs.createReadStream(source_path);
                            var png_buffer = new Buffer(size);
                            var png_pos = 0;
                            
                            // storing the previous data buffer as well...
                            var data_num = 0;
                            var chunk_positions_in_full_data = [];
                            
                            var color_type;
                            var bit_depth;

                            var colors = [];
                            var trans;
                            
                            var colors_with_alpha = [];
                            
                            var found_IHDR_chunk = function(chunk_buffer) {
                                var chunk_length = chunk_buffer.readUInt32BE(0);
                                //console.log('IHDR chunk_length ' + chunk_length);
                                
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
                                
                                //console.log('bit_depth ' + bit_depth);
                                //console.log('color_type ' + color_type);
                                //console.log('compression_method ' + compression_method);
                                //console.log('filter_method ' + filter_method);
                                //console.log('interlace_method ' + interlace_method);
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
                            
                            var found_chunk = function(chunk_buffer) {
                                // the chunk data as a buffer too?
                                // the chunk will be read in that way I think.
                                //console.log('found_chunk chunk_buffer.length ' + chunk_buffer.length);
                                // then let's read this chunk.
                                //  will raise various different events for different chunks that get read.
                                
                                // interpret the chunk, and raise an event for having found that kind of chunk.
                                

                                var chunk_length = chunk_buffer.readUInt32BE(0);
                                //console.log('chunk_length ' + chunk_length);
                                
                                var chunk_type = chunk_buffer.toString('ascii', 4, 8);
                                //console.log('* chunk_type ' + chunk_type + '  ');
                                
                                // beginning of the chunk data, end of chunk data
                                //  From the chunk buffer.
                                //  Not sure we really need a chunk buffer anyway, but maybe buffer is more suitable than string for various things.
                                
                                var idx_chunk_data_beginning = 8;
                                var idx_chunk_data_ending = idx_chunk_data_beginning + chunk_length - 8;
                                
                                //console.log('idx_chunk_data_ending ' + idx_chunk_data_ending);
                                
                                var chunk_crc = chunk_buffer.readUInt32BE(idx_chunk_data_ending);
                                
                                // Want to raise events for particular types of chunks.
                                //  That could actually parse the image info.
                                //  We'll be able to get the transparency and the palette chunks, both are needed to find out what rgba colors are represented.
                                
                                if (chunk_type == 'IHDR') {
                                    found_IHDR_chunk(chunk_buffer);
                                }
                                
                            }
                            
                            var incomplete_chunk_buffer = false;
                            
                            src.on('data', function(data) {
                            
                                // if we have an imcomplete chunk buffer, merge them.
                                if (incomplete_chunk_buffer) {
                                    var new_data = new Buffer(incomplete_chunk_buffer.length + data.length);
                                    
                                    incomplete_chunk_buffer.copy(new_data, 0, 0, incomplete_chunk_buffer.length);
                                    data.copy(new_data, incomplete_chunk_buffer.length, 0, data.length);
                                    data = new_data;
                                    incomplete_chunk_buffer = false;
                                }
                            
                                //console.log("Found some data! data.length " + data.length);
                                //  that is the amount in the buffer...
                                
                                // The amount given in the buffer here may not be the full chunk.
                                //  If it is not the full chunk, we need to copy what we do have into a temporary buffer, and
                                //   then use that as well as the next data for reading the PNG chunk.
                                
                                // move through the data... we'll keep in sync with the chunks.
                                
                                if (data_num == 0) {
                                    // we start by finding the PNG signature and the first chunk.
                                    chunk_beginning_pos = 8;
                                    var chunk_length = data.readUInt32BE(chunk_beginning_pos);
                                    //console.log('chunk_length ' + chunk_length);
                                    
                                    // make a new chunk buffer and read that chunk into the buffer
                                    //  check there is enough space left in the current buffer.
                                    
                                    var buf_chunk = new Buffer(chunk_length + 12);
                                    var next_chunk_pos = chunk_beginning_pos + 12 + chunk_length;
                                    
                                    // check that it's within the bounds of the data... otherwise don't write it.
                                    //  otherwise will write an incomplete buffer.
                                    data.copy(buf_chunk, 0, chunk_beginning_pos, next_chunk_pos);
                                    
                                    found_chunk(buf_chunk);
                                    // then read everything from the chunk into chunk data.
                                }
                                // then read through all the chunks.
                                
                                // read the next chunk.
                                var ctu = true;
                                while (ctu && next_chunk_pos < data.length) {
                                    chunk_beginning_pos = next_chunk_pos;
                                    //console.log('chunk_beginning_pos ' + chunk_beginning_pos);
                                    // copy that chunk into a buffer and give it to the chunk comprehension.
                                    var chunk_length = data.readUInt32BE(chunk_beginning_pos);
                                    //console.log('chunk_length ' + chunk_length);
                                    
                                    // chunk_end_position_in_read_buffer
                                    
                                    var chunk_end_position_in_read_buffer = chunk_beginning_pos + chunk_length + 12
                                    
                                    if (chunk_end_position_in_read_buffer > data.length) {
                                        // need to copy this into the temporary buffer
                                        //  buffer for incomplete chuncks that have been read.
                                        incomplete_chunk_buffer = new Buffer(data.length - chunk_end_position_in_read_buffer);
                                        data.copy(incomplete_chunk_buffer, 0, chunk_beginning_pos, data.length);
                                        ctu = false;
                                        
                                    } else {
                                        var buf_chunk = new Buffer(chunk_length + 12);
                                        var next_chunk_pos = chunk_end_position_in_read_buffer;
                                        //console.log('next_chunk_pos ' + next_chunk_pos);
                                        
                                        data.copy(buf_chunk, 0, chunk_beginning_pos, next_chunk_pos);
                                        found_chunk(buf_chunk);
                                    }
                                }
                                data_num++;
                              //writeStream.write(textData);
                            });

                            // the reading is finished...
                            src.on('close', function () {
                                // It should have been processing the data recieved.
                                //writeStream.end(); // ...close up the write, too!
                                //console.log("src finished.");
                            });
                        }
                    })
                }
            });
        }
        // could have a faster streaming loader.
        //  would do the specific loading algorithm.
        
        // this would go through, unfiltering scanlines.
        
        var load_pixel_buffer_from_disk = function(source_path, callback) {
            //console.log('PNG: load_pixel_buffer_from_disk');
            load_from_disk(source_path, function(err, res_png) {
                if (err) {
                    var stack = new Error().stack;
                    //console.log(stack);
                    throw err;
                } else {
                    // will use:
                    //  var uf_slb = this.get_unfiltered_scanline_buffer(y);
                    //console.log('png load_pixel_buffer_from_disk loaded from disk');
                    //console.log('pre get pixel buffer from png');
                    // I think this may be the slow part...
                    //  seems like loading the png itself is fairly fast. Getting the pixel buffer is the part that creates the new unfilteres scanline buffers,
                    //   would be faster just to have an unfiltered_scanlines_buffer.
                    var rgba32_buffer = res_png.get_rgba_pixel_buffer();
                    //console.log('post get pixel buffer from png');
                    
                    //console.log('got rgba32_buffer');
                    callback(null, rgba32_buffer);
                }
            })
        };
        
        var save_pixel_buffer_to_disk = fp(function(a, sig) {
            // need to have Buffer as a type in signatures.
            //  Think it will be B.
            
            // rbga_buffer, dest_path, callback
            
            var rbga_buffer, dest_path, options = {}, callback;
            //console.log('sig ' + sig);

            // problem getting the signature of the buffer.

            
            //throw 'stop';
            
            if (sig == '[o,s,f]') {
                rbga_buffer = a[0];
                dest_path = a[1];
                callback = a[2];
            }
            
            if (sig == '[o,s,o,f]') {
                rbga_buffer = a[0];
                dest_path = a[1];
                options = a[2];
                callback = a[3];
            }
            
            var scanline_encoding = false;
            var optimize = false;
            
            if (options.scanline_encoding) {
                scanline_encoding = options.scanline_encoding;
                
            }
            if (options.optimize) {
                optimize = options.optimize;
                
            }
            
            
            
            
            
        
            // rbga_buffer, dest_path, callback
            
            // open the png from the rgba_pixel_buffer
            //  save the png.
            // could do this quickly by copying into the scanline buffer, with the scanline filter set to 0
            
            // I think we will have some optional options.
            //  Options will include the scanline filtering to use, or the optimization.
            //  We want it so that a PNG can save itself using chosen scanline filters that are optimal.
            //  Could run deflate on each row to find out which is the best per row, but also want to be able to
            //   have the scanline filter set for the whole image. 
            
            
            
            var color_type;
            var bytes_per_pixel;
            var bit_depth = 8;
            
            if (rbga_buffer.bits_per_pixel == 24) {
                color_type = 2;
                bytes_per_pixel = 3;
            }
            if (rbga_buffer.bits_per_pixel == 32) {
                color_type = 6;
                bytes_per_pixel = 4;
            }
            
            var png = new PNG({'size': rbga_buffer.size, 'color_type': color_type, 'bit_depth': bit_depth});
            // iterating pixels is easiest?
            
            // I think direct copying is best.
            //console.log('rbga_buffer ' + rbga_buffer);
            var w = rbga_buffer.size[0];
            var h = rbga_buffer.size[1];
            // calculate the positions - the buffer to copy from, buffer to copy to.
            //  will be writing directly to the scanline buffer.
            var source_buffer = rbga_buffer.buffer;
            
            var dest_buffer = png.scanlines_buffer;
            
            // put it in the unfiltered scanlines buffer?
            
            var source_buffer_line_length = w * bytes_per_pixel;
            
            // 1 extra byte for the scanline filter byte. stays at 0.
            var dest_buffer_line_length = w * bytes_per_pixel + 1;
            
            var source_buffer_line_start, source_buffer_line_end;
            var dest_buffer_line_start;
            
            //var dest_buffer_writeUInt8 = dest_buffer.writeUInt8;
            //var source_buffer_copy = source_buffer.copy;
            
            // if we do scanline encoding, we want to write to the unfiltered buffer.
            //  will do tracking of meta-scanline encoding, so we can keep the image encoded or not.
            //  may specify optimizing scanline encoding.
            //  but we do want to have some sort of scanline encoding running.
            
            // want to be able to load data into an image, then have it encoded upon save.
            
            if (scanline_encoding) {
                // not 0 or false
                //console.log('scanline_encoding ' + scanline_encoding);
                if (!png.unfiltered_scanlines_buffer) {
                    png.unfiltered_scanlines_buffer = new Buffer(png.scanlines_buffer.length);
                }
                
                dest_buffer = png.unfiltered_scanlines_buffer;
                
            } else {
                
            }
            
            
            
            for (var y = 0; y < h; y++) {
                //png.buffer;
                source_buffer_line_start = y * source_buffer_line_length;
                source_buffer_line_end = source_buffer_line_start + source_buffer_line_length;
            
                dest_buffer_line_start = y * dest_buffer_line_length;
                //buf.copy(targetBuffer, [targetStart], [sourceStart], [sourceEnd])
            
            
                dest_buffer.writeUInt8(0, dest_buffer_line_start);
                source_buffer.copy(dest_buffer, dest_buffer_line_start + 1, source_buffer_line_start, source_buffer_line_end);
            }
            
            
            if (scanline_encoding != false) {
                if (tof(scanline_encoding) == 'number') {
                    png.set_scanline_filter_all_rows(scanline_encoding);
                    png.filter_all_scanlines_cpp();
                }
                
            }
            
            if (optimize) {
                png.ensure_unfiltered_scanlines_buffer();
                png.optimize_filter_all_scanlines(function(err, res) {
                    if (err) {
                        throw err;
                    } else {
                        png.save_to_disk(dest_path, callback);
                    }
                })
            } else {
                png.save_to_disk(dest_path, callback);
            }
            
            // png.load_scanline_from_
            
        })
        
        var png = {
            'load_metadata_from_disk': load_metadata_from_disk,
            'PNG': PNG,
            'load_from_disk': load_from_disk,
            'load_pixel_buffer_from_disk': load_pixel_buffer_from_disk,
            'save_pixel_buffer_to_disk': save_pixel_buffer_to_disk
        }
        return png;
    }
);

