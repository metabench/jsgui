/**
 * Created by James on 09/08/2014.
 */

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

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// Will be used to hold, and as the basis for basic processing on PNG images.

//  Also want to make some pixel buffer manipulation modules.
// jsgui-node-pixel-buffer-manipulate (maybe not manipulate - could imply it changes data when it does not always?)
//  filters
//  masks? feature detection?

// jsgui-node-pixel-buffer-filter
// jsgui-node-pixel-buffer-processing

// want to do convolutions on the pixel buffer







define(["../../core/jsgui-lang-essentials", "../../build/Release/binding_png.node", './pixel-buffer'],

    // can use bit depth constants.

    // bits_per_pixel

    // These will only operate as rgb24 or argb 32.

    function(jsgui, cpp_mod, Pixel_Buffer) {
        var Class = jsgui.Class, each = jsgui.each, stringify = jsgui.stringify, fp = jsgui.fp;
        var tof = jsgui.tof;


        var Enhanced_Pixel_Buffer = Pixel_Buffer.extend({

            // want to be able to load the values into this rapidly?

            'init': function(spec) {

                this._super(spec);

            },

            // get_resized
            //  that may be better than actually resizing the original, and clearer in what it does.
            'get_resized': fp(function(a, sig) {
                // Could have an option to check the ARs given? Lock Aspect Ratio?

                var target_size;

                console.log('Enhanced_Pixel_Buffer get_resized');

                if (sig == '[a]') {
                    // Probably the size
                    target_size = a[0];
                }

                console.log('target_size', target_size);
                // This bilinear function operates on RGBA arrays.
                //  It would be nice to make it more flexible, or make a version for RGB arrays.



                var res = new Enhanced_Pixel_Buffer({
                    'size': target_size
                })

                // change to 3 for RGB array?

                var ivect = function(ix, iy, w) {
                    // byte array, r,g,b,a
                    return((ix + w * iy) * 4);
                }

                // This seems to be looking at an RGBA array.

                var bilinear = function(srcImg, destImg, scale) {
                    // c.f.: wikipedia english article on bilinear interpolation
                    // taking the unit square, the inner loop looks like this
                    // note: there's a function call inside the double loop to this one
                    // maybe a performance killer, optimize this whole code as you need
                    function inner(f00, f10, f01, f11, x, y) {
                        var un_x = 1.0 - x; var un_y = 1.0 - y;
                        return (f00 * un_x * un_y + f10 * x * un_y + f01 * un_x * y + f11 * x * y);
                    }
                    var i, j;
                    var iyv, iy0, iy1, ixv, ix0, ix1;
                    var idxD, idxS00, idxS10, idxS01, idxS11;
                    var dx, dy;
                    var r, g, b, a;
                    for (i = 0; i < destImg.height; ++i) {
                        iyv = i / scale;
                        iy0 = Math.floor(iyv);
                        // Math.ceil can go over bounds
                        iy1 = ( Math.ceil(iyv) > (srcImg.height-1) ? (srcImg.height-1) : Math.ceil(iyv) );
                        for (j = 0; j < destImg.width; ++j) {
                            ixv = j / scale;
                            ix0 = Math.floor(ixv);

                            // Math.ceil can go over bounds
                            ix1 = ( Math.ceil(ixv) > (srcImg.width-1) ? (srcImg.width-1) : Math.ceil(ixv) );
                            idxD = ivect(j, i, destImg.width);

                            // matrix to vector indices
                            idxS00 = ivect(ix0, iy0, srcImg.width);
                            idxS10 = ivect(ix1, iy0, srcImg.width);
                            idxS01 = ivect(ix0, iy1, srcImg.width);
                            idxS11 = ivect(ix1, iy1, srcImg.width);

                            // overall coordinates to unit square
                            dx = ixv - ix0; dy = iyv - iy0;

                            // I let the r, g, b, a on purpose for debugging
                            r = inner(srcImg.data[idxS00], srcImg.data[idxS10],
                                srcImg.data[idxS01], srcImg.data[idxS11], dx, dy);
                            destImg.data[idxD] = r;

                            g = inner(srcImg.data[idxS00+1], srcImg.data[idxS10+1],
                                srcImg.data[idxS01+1], srcImg.data[idxS11+1], dx, dy);
                            destImg.data[idxD+1] = g;

                            b = inner(srcImg.data[idxS00+2], srcImg.data[idxS10+2],
                                srcImg.data[idxS01+2], srcImg.data[idxS11+2], dx, dy);
                            destImg.data[idxD+2] = b;

                            a = inner(srcImg.data[idxS00+3], srcImg.data[idxS10+3],
                                srcImg.data[idxS01+3], srcImg.data[idxS11+3], dx, dy);
                            destImg.data[idxD+3] = a;
                        }
                    }
                }

                var bpp = this.bits_per_pixel;
                console.log('bpp', bpp);

                bilinear({
                    width: this.size[0],
                    height: this.size[1],
                    data: this.buffer
                }, {
                    width: target_size[0],
                    height: target_size[1],
                    data: res.buffer
                }, target_size[0] / this.size[0]);
                return res;
                // read through this one / read through a transformation map.
                //  Precise mapping would be a good method for resizing an image

                //  Needs to go through the source grid, calculating the destinations of each of the pixels on the dest grid.
                //   Would do multiplication by a scaling ratio.

                // Working with a smaller sample image would make sense though.

                // An 8x8 to 5x5 pixel resizing would be fine.









                // Get a new Enhanced_Pixel_Buffer, of the target size

            })





        })

        return Enhanced_Pixel_Buffer;

    }
);