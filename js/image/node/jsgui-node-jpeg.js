
/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

//var binding_path = __dirname + '/../build/Release/image_binding.node'

//var cpp_mod = require('../build/Release/image_binding');
//console.log('binding_path', binding_path);

// Will not use the jpeg cpp for the moment.
//  It can't handle the Mount Fuji image I have but jpeg-js can (it seems)



//var cpp_mod = require(binding_path);

//define(['../core/jsgui-lang-essentials', 'fs', 'zlib', '../misc/CrcStream', './jsgui-node-pixel-buffer', 'node-images'],
//    function(jsgui, fs, zlib, CrcStream, Pixel_Buffer, node_images) {


define(['../../core/jsgui-lang-essentials', 'fs', 'zlib',
        './pixel-buffer', './enhanced-pixel-buffer',
        './jpeg-js/jsgui_decoder', './jpeg-js/encoder'],
    function(jsgui, fs, zlib, Pixel_Buffer, Enhanced_Pixel_Buffer, jpeg_decoder, jpeg_encoder) {
        */

var jsgui = require('../../core/jsgui-lang-essentials'), fs = require('fs'), zlib = require('zlib'), Pixel_Buffer = require('./pixel-buffer'),
Enhanced_Pixel_Buffer = require('./enhanced-pixel-buffer'), jpeg_decoder = require('./jpeg-js/jsgui_decoder'), jpeg_encoder = require('./jpeg-js/encoder');


        var stringify = jsgui.stringify, each = jsgui.each, is_defined = jsgui.is_defined;
        var fp = jsgui.fp, tof = jsgui.tof;
        var Fns = jsgui.Fns;
        var arrayify = jsgui.arrayify;
        var clone = jsgui.clone;

        // extend Binary_File_Wrapper?

        // Need to be able to build this in place.
        //  Use the binding node file when it exists.

        // We may be able to use (existing) packages on NPM.
        //  Need to use gyp to build the right files to handle some C / C++ stuff.


        // This is not working right when calling that external code.
        //  It would be better to separate out the PNG handling code, keep the file of the JPEG code that only works on some images,
        //  and then port the JavaScript code (or bits of it) to node.js.

        // It's likely that the porting of that code to C++ could be done in parts, where some chunks are done in C / C++ with pieces replaced separately.
        //  Writing that JPEG code in C / C++ could be a bit tricky, though the JavaScript code reads a lot like C code anyway.
        //  Would then be interesting to compile that C code to ASM.









        var JPEG = jsgui.Class.extend({

            // Perhaps construct this with a buffer?
            //  But still, in many cases, we want to use an Image_Loader or similar.

            // Want to be able to set its pixel buffer.
            //



            'init': function(spec) {
                // size

                //  ?? no file size right now. could have a loaded_file_size.
                // file_size

                // size


                if (spec.size) {
                    this.size = spec.size;
                }

                //if (spec.color_type) {
                //    this.color_type = spec.color_type;
                //}

                //if (spec.bit_depth) {
                //    this.bit_depth = spec.bit_depth;
                //}

                //if (this.size && this.color_type && this.bit_depth) {
                //    this.init_scanlines_buffer(this.size, this.color_type, this.bit_depth);
                //}

            },

            // load_rgba_pixel_buffer
            //  copies the pixel buffer over to the JPEG's.
            //  then will go through the encoding when it gets saved.

            'load_from_rgba_pixel_buffer': function(rgba_pixel_buffer) {
                this.size = clone(rgba_pixel_buffer.size);
                this.bits_per_pixel = 32;

                throw 'stop';

            },

            'load_from_rgb_pixel_buffer': function(rgb_pixel_buffer) {
                this.size = clone(rgb_pixel_buffer.size);
                //this.bits_per_pixel = 24;

                this.rgb_buffer = new Buffer(rgb_pixel_buffer.buffer.length);
                this.size = rgb_pixel_buffer.size;

                rgb_pixel_buffer.buffer.copy(this.rgb_buffer);



                //throw 'stop';

            },



            // this one holds the actual data. A different one would hold the uncompressed data.
            //  Perhaps forget about this buffer once the data has been decompressed?

            // get_rgba_pixel_buffer...
            //  will iterate through the pixels, copying to that buffer.
            //  alternatively will copy from the unfiltered scanline buffer when in color mode 6.

            // Also should be able to get enhanced pixel buffers too.

            // Have RGB to RGBA conversion in the pixel buffer itself.

            'get_rgba_enhanced_pixel_buffer': function() {
                // could be optimized (maybe just for some cases).
                // can optimize this a lot.
                //  when in the right mode, can almost read this out of the unfiltered scanlines buffer.

                var res = new Enhanced_Pixel_Buffer({
                    'size': this.size,
                    'bits_per_pixel': 32
                });

                // But we have an RGBA buffer.
                //  It may be more convenient to get the results as an RGB buffer.
                //  With jsgui-node-pixel-buffer, we will be able to manipulate both RGB and RGBA pixel buffers.

                // Need to do rgb to rgba, maybe in cpp.

                var res_buffer = res.buffer;

                // go through the original buffer, adding an alpha value

                var my_buffer = this.rgb_buffer;

                var num_pixels = this.size[0] * this.size[1];

                // then a loop for each pixel...

                for (var c = 0; c < num_pixels; c++) {
                    //my_buffer.copy(res_buffer, c * 4, c * 3, (c * 3) + 3);
                    //res_buffer[c * 4 + ]

                    res_buffer[c * 4] = my_buffer[c * 3];
                    res_buffer[c * 4 + 1] = my_buffer[c * 3 + 1];
                    res_buffer[c * 4 + 2] = my_buffer[c * 3 + 2];
                    res_buffer[c * 4 + 3] = 255;
                }

                //res.buffer = this.rgb_buffer;

                //var color_type = this.color_type;

                // without iterating the pixels?
                //  having that inline would speed it up (a lot).

                //var dest_buffer = res.buffer;


                return res;
            },

            'get_rgb_enhanced_pixel_buffer': function() {
                // could be optimized (maybe just for some cases).
                // can optimize this a lot.
                //  when in the right mode, can almost read this out of the unfiltered scanlines buffer.

                var res = new Enhanced_Pixel_Buffer({
                    'size': this.size,
                    'bits_per_pixel': 24
                });

                // But we have an RGBA buffer.
                //  It may be more convenient to get the results as an RGB buffer.
                //  With jsgui-node-pixel-buffer, we will be able to manipulate both RGB and RGBA pixel buffers.

                res.buffer = this.rgb_buffer;

                //var color_type = this.color_type;

                // without iterating the pixels?
                //  having that inline would speed it up (a lot).

                //var dest_buffer = res.buffer;


                return res;
            },

            'get_rgb_pixel_buffer': function() {
                // could be optimized (maybe just for some cases).
                // can optimize this a lot.
                //  when in the right mode, can almost read this out of the unfiltered scanlines buffer.

                var res = new Pixel_Buffer({
                    'size': this.size,
                    'bits_per_pixel': 24
                });

                // But we have an RGBA buffer.
                //  It may be more convenient to get the results as an RGB buffer.
                //  With jsgui-node-pixel-buffer, we will be able to manipulate both RGB and RGBA pixel buffers.


                res.buffer = this.rgb_buffer;

                //var color_type = this.color_type;

                // without iterating the pixels?
                //  having that inline would speed it up (a lot).

                //var dest_buffer = res.buffer;


                return res;
            },


            'iterate_row': function(y, pixel_callback) {
                //var uf_slb = this.get_unfiltered_scanline_buffer(y);

                // uses positions on the unfiltered_scanlines_buffer.
                //console.log('iterate_row');


                //throw 'stop';
                //console.log('uf_slb ' + uf_slb);
                // then depending on bit rate, color depth... but at least we have isolated the unfiltered scanline row with this.
                //  will use this to keep the low level structure and provide a high level interface.


            },

            'iterate_pixels': function(pixel_callback) {
                var width = this.size[0];
                var height = this.size[1];
            },

            'set_color_parameters': function(color_type, bit_depth) {
                // could take a string such as 'rgba 32'. ???
                //  make more flexible with fp?
            },

            'save_to_stream': fp(function(a, sig) {
                console.log('JPEG save_to_stream sig', sig);
                var stream, options = {}, callback;


                if (sig == '[W,o]') {
                    stream = a[0];
                    options = a[1];
                }

                console.log('this.rgb_buffer.length', this.rgb_buffer.length);


                var encoded = jpeg_encoder({
                    'data': this.rgb_buffer,
                    'width': this.size[0],
                    'height': this.size[1]
                });

                console.log('encoded', encoded);

                console.log('encoded.data.length', encoded.data.length);
                //throw 'stop';

                stream.write(encoded.data);

                stream.end();
                stream.destroySoon();

                if (callback) callback(null, true);



                //

                //jpeg_encoder()

                // use the encode.



                // stream
                // stream, options

                //console.log('sig ' + sig);

            }),

            'save_to_buffer': function() {

                var encoded = jpeg_encoder({
                    'data': this.rgb_buffer,
                    'width': this.size[0],
                    'height': this.size[1]
                });

                return encoded.data;
            },



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

                var optimize = {} || options.optimize;

                // Write a stream to a buffer instead?

                var that = this;

                var do_save = function() {

                    var stream = fs.createWriteStream(dest_path, {flags: 'w'});
                    stream.on('close', function() {
                        callback(null, that);
                    });
                    that.save_to_stream(stream, options);
                }

                do_save();
            }),

            'load_size_from_buffer': function(buffer, callback) {
                //console.log('load_from_buffer ');
                //console.log('buffer.length ' + buffer.length);

                var that = this;

                var now = new Date();



                var res = jpeg_decoder.size(buffer);
                this.size = res;


                callback(null, res);

                //throw 'stop';

                // jpeg_decoder

                /*

                 var res = cpp_mod.read_jpeg_to_rgb(buffer);
                 //console.log('res.length ' + res.length);

                 var size = res[0];
                 var rgb_buffer = res[1];

                 //console.log('size ' + stringify(size));
                 this.size = size;

                 // and create a new pixel buffer object?
                 this.rgb_buffer = rgb_buffer;

                 callback(null, this);

                 */
                //throw 'stop';

                // node_images not working.
                //  may be better to hook into libjpeg directly.
                //  the code is somewhat complex.

                //var img = node_images(buffer);

                // Maybe will go into a bit of exploration of the JPEG file format...
                //  Would be nice to load the image of Mount Fuji.
                // Now that we have the buffer loaded, we could give that to C++
                //  Then if it's referencing libjpeg, then possibly I can get it to load the
                //  image.

                // Maybe should do a bit more PNG code to speed it up?



                //console.log('img ' + img);

            },

            'load_from_buffer': function(buffer, callback) {
                //console.log('load_from_buffer ');
                //console.log('buffer.length ' + buffer.length);

                var that = this;

                var now = new Date();



                var res = jpeg_decoder.decode(buffer, 24);
                //console.log('res', res);

                var later = new Date();

                var elapsed = later - now;

                console.log('elapsed', elapsed);



                // Will use an RGB buffer here, rather than RGBA.


                this.rgb_buffer = res.data;


                this.size = [res.width, res.height];


                //this.size = jpeg_decoder.size(buffer);

                //console.log('this.size', this.size);

                callback(null, this);

                //throw 'stop';

                // jpeg_decoder

                /*

                var res = cpp_mod.read_jpeg_to_rgb(buffer);
                //console.log('res.length ' + res.length);

                var size = res[0];
                var rgb_buffer = res[1];

                //console.log('size ' + stringify(size));
                this.size = size;

                // and create a new pixel buffer object?
                this.rgb_buffer = rgb_buffer;

                callback(null, this);

                */
                //throw 'stop';

                // node_images not working.
                //  may be better to hook into libjpeg directly.
                //  the code is somewhat complex.

                //var img = node_images(buffer);

                // Maybe will go into a bit of exploration of the JPEG file format...
                //  Would be nice to load the image of Mount Fuji.
                // Now that we have the buffer loaded, we could give that to C++
                //  Then if it's referencing libjpeg, then possibly I can get it to load the
                //  image.

                // Maybe should do a bit more PNG code to speed it up?



                //console.log('img ' + img);

            },

            // another function could deal with recieving / streaming in the PNG.
            //  could stream out an RGB or ARGB buffer.

            // for the moment it's not a problem to load the whole PNG.

            'load_from_stream': function(input_stream, callback) {
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
                //console.log('JPEG load_from_disk');
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
            var res = new JPEG({});
            res.load_from_disk(source_path, callback);
            //callback(null, res);
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


                            src.on('data', function(data) {
                                //data_num++;
                              //writeStream.write(textData);
                            });

                            // the reading is finished...
                            src.on('close', function () {
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
            //console.log('load_pixel_buffer_from_disk');
            load_from_disk(source_path, function(err, res_jpeg) {
                if (err) {
                    var stack = new Error().stack;
                    //console.log(stack);
                    throw err;
                } else {
                    //console.log('pre get pixel buffer from jpeg');
                    // I think this may be the slow part...
                    //  seems like loading the png itself is fairly fast. Getting the pixel buffer is the part that creates the new unfilteres scanline buffers,
                    //   would be faster just to have an unfiltered_scanlines_buffer.
                    var rgba32_buffer = res_jpeg.get_rgba_pixel_buffer();
                    //console.log('post get pixel buffer from jpeg');
                    callback(null, rgba32_buffer);
                }
            })
        };

        var save_pixel_buffer_to_disk = fp(function(a, sig) {
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

            var optimize = false;

            //if (options.scanline_encoding) {
            //    scanline_encoding = options.scanline_encoding;
            //
            //}
            //if (options.optimize) {
            //    optimize = options.optimize;
            //
            //}
            // rbga_buffer, dest_path, callback

            // open the png from the rgba_pixel_buffer
            //  save the png.
            // could do this quickly by copying into the scanline buffer, with the scanline filter set to 0

            // I think we will have some optional options.
            //  Options will include the scanline filtering to use, or the optimization.
            //  We want it so that a PNG can save itself using chosen scanline filters that are optimal.
            //  Could run deflate on each row to find out which is the best per row, but also want to be able to
            //   have the scanline filter set for the whole image.

            // basically need to encode the buffer to JPEG.



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

            //var png = new PNG({'size': rbga_buffer.size, 'color_type': color_type, 'bit_depth': bit_depth});
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



        })

        var jpeg = {
            'load_metadata_from_disk': load_metadata_from_disk,
            'JPEG': JPEG,
            'load_from_disk': load_from_disk,
            'load_pixel_buffer_from_disk': load_pixel_buffer_from_disk,
            'save_pixel_buffer_to_disk': save_pixel_buffer_to_disk
        }

/*
        return jpeg;
    }
);
*/

module.exports = jpeg;
