// jsgui-node-pixel-buffer

// have pixel-buffer as its own module?
//  quite a simple one - will be used to hold image data as an intermediate format.
//   simpler than PNG.
//   will have a simple interface that will be used for editing images.

// not sure about having this hold indexed color.
//  by its name it seems as though it should be able to.
//  using indexed color mode.
//   rgba, rgb, indexed rgb, indexed rgba
//              irgb, irgba
//  and then there is bit_depth.
//              bits_per_pixel may make sense.

// Will just have this as a pixel value buffer.
//  Can have an image-buffer if its more advanced.


/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
*/
// Will be used to hold, and as the basis for basic processing on PNG images.

//  Also want to make some pixel buffer manipulation modules.
// jsgui-node-pixel-buffer-manipulate (maybe not manipulate - could imply it changes data when it does not always?)
//  filters
//  masks? feature detection?

// jsgui-node-pixel-buffer-filter
// jsgui-node-pixel-buffer-processing

// want to do convolutions on the pixel buffer





/*

define(["../../core/jsgui-lang-essentials", "../../build/Release/binding_png.node"],
    
    // can use bit depth constants.
    
    // bits_per_pixel
    
    // These will only operate as rgb24 or argb 32.
    
    function(jsgui, cpp_mod) {
    */

var jsgui = require('../../core/jsgui-lang-essentials');
//var cpp_mod = require('../../build/Release/binding_png.node');
var cpp_mod = {};

var Class = jsgui.Class, each = jsgui.each, stringify = jsgui.stringify, fp = jsgui.fp;
var tof = jsgui.tof;


var Pixel_Buffer = Class.extend({

    // want to be able to load the values into this rapidly?

    'init': function(spec) {
        // size [width, height]
        //var bytes_per_pixel;

        if (spec.size) {
            this.size = spec.size;
        } else {
            throw 'Expected: size [x, y] property in the Pixel_Buffer specification';
        }

        // bit-depth - could follow PNG.
        //  rgba color mode.
        spec.bits_per_pixel = spec.bits_per_pixel || 32;

        if (spec.bits_per_pixel) {
            if (spec.bits_per_pixel != 24 && spec.bits_per_pixel != 32) {
                throw 'Invalid bits_per_pixel value of ' + spec.bits_per_pixel + ', must be 24 or 32, default is 32.';
            } else {
                this.bits_per_pixel = spec.bits_per_pixel;
            }
        }

        // then initialize the buffer itself.

        var bytes_per_pixel = this.bits_per_pixel / 8;


        if (this.size) {
            this.buffer = new Buffer(bytes_per_pixel * this.size[0] * this.size[1]);
        }

    },
    'new_blank_same_size': function() {
        var res = new Pixel_Buffer({
            'size': this.size,
            'bits_per_pixel': this.bits_per_pixel
        });
        res.buffer.fill(0);
        return res;
    },
    'get_pixel': function(x, y) {
        var bytes_per_pixel = this.bits_per_pixel / 8;
        // will return [r, g, b] or [r, g, b, a];
        var pixel_buffer_pos = bytes_per_pixel * (x + y * this.size[0]);
        var buffer = this.buffer;
        var r, g, b, a;


        if (this.bits_per_pixel == 24) {
            r = buffer.readUInt8(pixel_buffer_pos);
            g = buffer.readUInt8(pixel_buffer_pos + 1);
            b = buffer.readUInt8(pixel_buffer_pos + 2);
            return [r, g, b];
        } else if (this.bits_per_pixel == 32) {
            r = buffer.readUInt8(pixel_buffer_pos);
            g = buffer.readUInt8(pixel_buffer_pos + 1);
            b = buffer.readUInt8(pixel_buffer_pos + 2);
            a = buffer.readUInt8(pixel_buffer_pos + 3);
            return [r, g, b, a];
        } else {
            var stack = new Error().stack;
            //console.log(stack);
            throw 'Must have bits_per_pixel set to 24 or 32';
        }
    },

    // Would be faster without fp.
    //  this could slow this down a lot in terms of V8 speed.
    // will take the r,g,b(,a) in params.
    'set_pixel': fp(function(a, sig) {
        // Could this whole thing be sped up with C++?



        var bytes_per_pixel = this.bits_per_pixel / 8;
        var l = a.l;
        // x, y, r, g, b, a  l = 6
        // x, y, r, g, b     l = 5

        // [x, y], r, g, b, a
        // [x, y], r, g, b
        //console.log('set_pixel sig ' + sig);
        //console.log('set_pixel a ' + stringify(a));


        var x, y, r, g, b, alpha;

        var w = this.size[0];

        // x, y, [r, g, b, a] l = 3
        // x, y, [r, g, b]    l = 3
        if (l == 3) {
            x = a[0];
            y = a[1];
            var arr_pixel = a[2];
            if (this.bits_per_pixel == 24) {
                if (arr_pixel.length != 3) {
                    var stack = new Error().stack;
                    //console.log(stack);
                    throw 'Expected pixel value in format [r, g, b] for 24 bits_per_pixel.';
                }
                r = arr_pixel[0];
                g = arr_pixel[1];
                b = arr_pixel[2];
            }
            if (this.bits_per_pixel == 32) {
                //console.log('arr_pixel ' + stringify(arr_pixel));
                if (arr_pixel.length != 4) {
                    //console.log('arr_pixel.length ' + arr_pixel.length);
                    var stack = new Error().stack;
                    //console.log(stack);
                    throw 'Expected pixel value in format [r, g, b, a] for 32 bits_per_pixel.';
                }
                r = arr_pixel[0];
                g = arr_pixel[1];
                b = arr_pixel[2];
                alpha = arr_pixel[3];
            }

        }

        if (l == 5) {
            if (this.bits_per_pixel != 24) {
                throw 'Must specify the pixel as r, g, b with bits_per_pixel of 24';
            }
            x = a[0];
            y = a[1];
            r = a[2];
            g = a[3];
            b = a[4];
        }

        if (l == 6) {
            if (this.bits_per_pixel != 32) {
                throw 'Must specify the pixel as r, g, b, a with bits_per_pixel of 32';
            }
            x = a[0];
            y = a[1];
            r = a[2];
            g = a[3];
            b = a[4];
            alpha = a[5];
        }

        var pixel_buffer_pos = bytes_per_pixel * (x + y * w);
        var buffer = this.buffer;

        if (this.bits_per_pixel == 24) {
            buffer.writeUInt8(r, pixel_buffer_pos);
            buffer.writeUInt8(g, pixel_buffer_pos + 1);
            buffer.writeUInt8(b, pixel_buffer_pos + 2);

        } else if (this.bits_per_pixel == 32) {
            buffer.writeUInt8(r, pixel_buffer_pos);
            buffer.writeUInt8(g, pixel_buffer_pos + 1);
            buffer.writeUInt8(b, pixel_buffer_pos + 2);
            buffer.writeUInt8(alpha, pixel_buffer_pos + 3);
        } else {
            var stack = new Error().stack;
            //console.log(stack);
            throw 'Must have bits_per_pixel set to 24 or 32';
        }
    }),

    'place_image_from_pixel_buffer': function(pixel_buffer, dest_pos) {
        // can do a fast copy.
        //  or can do pixel iteration.

        // function to get a line from a buffer?
        // will want to copy directly between them.

        // so for each line in the source, need to copy the line directly into the buffer.
        //  that's if they are the same bits_per_pixel.

        // copying rgba to rgba or rgb to rgb should be fast.
        //  direct copying is fastest.
        var dest_buffer = this.buffer;
        var source_buffer = pixel_buffer.buffer;

        //console.log('dest_pos ' + stringify(dest_pos));
        // It's also worth making RGB->RGBA and RGBA->RGB
        if (this.bits_per_pixel == 32 && pixel_buffer.bits_per_pixel == 32) {

            var dest_w = this.size[0];
            var dest_h = this.size[1];

            var dest_buffer_line_length = dest_w * 4;

            var source_w = pixel_buffer.size[0];
            var source_h = pixel_buffer.size[1];

            var source_buffer_line_length = source_w * 4;

            //console.log('source_w ' + source_w);
            //console.log('source_h ' + source_h);
            var source_buffer_line_start_pos, source_buffer_line_end_pos, dest_buffer_subline_start_pos, dest_buffer_start_offset;

            dest_buffer_start_offset = dest_pos[0] * 4;

            // This algorithm could be sped up with C.

            cpp_mod.copy_rgba_pixel_buffer_to_rgba_pixel_buffer_region(source_buffer, source_buffer_line_length, dest_buffer, dest_buffer_line_length, dest_pos[0], dest_pos[1]);

            //throw 'stop';
            /*
            for (var y = 0; y < source_h; y++) {
                source_buffer_line_start_pos = y * source_buffer_line_length;
                source_buffer_line_end_pos = source_buffer_line_start_pos + source_buffer_line_length;

                dest_buffer_subline_start_pos = (y + dest_pos[1]) * dest_buffer_line_length;
                //var dest_buffer_subline_end_pos = dest_buffer_subline_start_pos + source_buffer_line_length;


                // buf.copy(targetBuffer, [targetStart], [sourceStart], [sourceEnd])

                source_buffer.copy(dest_buffer, dest_buffer_subline_start_pos + dest_buffer_start_offset, source_buffer_line_start_pos, source_buffer_line_end_pos);

            }
            */

        } else {
            throw 'not currently supported';
        }



    },
    'set_bits_per_pixel': function(bits_per_pixel) {
        // Will need to change this between RGB and RGBA format.
        //  When going RGBA->RGB, we lose the alpha channel. RGB-RGBA, we set all alpha values to 255.

        if (bits_per_pixel == 24 || bits_per_pixel == 32) {
            var current = this.bits_per_pixel;

            if (current == 32 && bits_per_pixel == 32) {
                // Convert RGB to RGBA.



            }


        } else {
            throw 'unsupported color mode'
        }



    }


})

module.exports = Pixel_Buffer;

/*
        return Pixel_Buffer;
        
    }
);
    */