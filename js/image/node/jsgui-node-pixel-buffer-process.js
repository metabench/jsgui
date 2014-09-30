
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



// Should make an Enhanced_Pixel_Buffer.





define(["../../core/jsgui-lang-essentials", "./pixel-buffer", "./build/Release/binding.node"],
	function(jsgui, pixel_buffer, cpp_mod) {
		var stringify = jsgui.stringify;
		// want to do a convolution.
		//  The convolution buffer may be better as a typed array.

		// The C or C++ compiler, when the code is in that language,
		//  could more easily inline the convolution code.



		// Could maybe do this on a higher level, at least to start with.

		var convolve_pixel = function(pixel_buffer, x, y, f32a_convolution_buffer) {
			// the pixels that form the convolution - iterate over their coords
			var convbuf_w = Math.sqrt(f32a_convolution_buffer.length);
			//console.log('convbuf_w ' + convbuf_w);
			var convSideWidth = (convbuf_w - 1) / 2;
			var pb_w = pixel_buffer.size[0];

			var pb_offset, val, buf = pixel_buffer.buffer;
			var wtd;

			var ci = 0, wval, r, g, b, a, wr, wg, wb, wa, tr, tg, tb, ta, resr, resg, resb, resa, x1, y1;
			tr = 0; tg = 0; tb = 0; ta = 0;
			for (x1 = x - convSideWidth; x1 <= x + convSideWidth; x1 ++) {
				for (y1 = y - convSideWidth; y1 <= y + convSideWidth; y1 ++) {
					pb_pos = x1 * 4 + y1 * pb_w * 4;
					//console.log('pb_pos ' + pb_pos);
					r = buf.readUInt8(pb_pos);
					g = buf.readUInt8(pb_pos + 1);
					b = buf.readUInt8(pb_pos + 2);
					a = buf.readUInt8(pb_pos + 3);

					wval = f32a_convolution_buffer[ci];
					wr = r * wval;
					wg = g * wval;
					wb = b * wval;
					wa = a * wval;

					tr = tr + wr;
					tg = tg + wg;
					tb = tb + wb;
					ta = ta + wa;

					ci++;
					if (ci == f32a_convolution_buffer.length) ci = 0;

				}
			}

			var conv_total = 0;
			for (var c = 0, l = f32a_convolution_buffer.length; c < l; c++) {
				conv_total = conv_total + f32a_convolution_buffer[c]//f32a_convolution_buffer.readUInt8(c);

			}
			//console.log('conv_total ' + conv_total);

			resr = Math.round(tr / conv_total);
			resg = Math.round(tg / conv_total);
			resb = Math.round(tb / conv_total);
			resa = Math.round(ta / conv_total);

			if (resr < 0) resr = 0;
			if (resg < 0) resg = 0;
			if (resb < 0) resb = 0;
			if (resa < 0) resa = 0;

			if (resr > 255) resr = 255;
			if (resg > 255) resg = 255;
			if (resb > 255) resb = 255;
			if (resa > 255) resa = 255;


			var res = [resr, resg, resb, resa];
			//console.log('convolve pixel res ' + stringify(res));

			return res;

		}

		var convolve = function(pixel_buffer, f32a_convolution_buffer) {
			var x, y, w, h;

			var pb_pos, conv_px, isBorder;

			var convbuf_w = Math.sqrt(f32a_convolution_buffer.length);
			//console.log('convbuf_w ' + convbuf_w);

			var convSideWidth = (convbuf_w - 1) / 2;

			var pb2 = pixel_buffer.new_blank_same_size();
			var pv2buf = pb2.buffer, buf = pixel_buffer.buffer;;

			var ci, wval, r, g, b, a, wr, wg, wb, wa, tr, tg, tb, ta, resr, resg, resb, resa, x1, y1;

			var conv_total = 0;
			for (var c = 0, l = f32a_convolution_buffer.length; c < l; c++) {
				conv_total = conv_total + f32a_convolution_buffer[c]//f32a_convolution_buffer.readUInt8(c);

			}
			var pb_w = pixel_buffer.size[0];

			for (x = 0, w = pixel_buffer.size[0]; x < w; x++) {
				for (y = 0, h = pixel_buffer.size[1]; y < h; y++) {
					isBorder = false;
					if (x < convSideWidth) isBorder = true;
					if (x >= w - convSideWidth - 1) isBorder = true;
					if (y < convSideWidth) isBorder = true;
					if (y >= h - convSideWidth - 1) isBorder = true;
					pb_pos = x * 4 + y * 4 * w;
					if (!isBorder) {
						//console.log('pb_pos ' + pb_pos);

						// would be a lot faster not to use convolve_pixel, but to have two inner loops for the
						//  pixel convolution.

						//conv_px = convolve_pixel(pixel_buffer, x, y, f32a_convolution_buffer);
						// let's have the convolution inline here.

						// We could have two further loops inside here...
						//  Keeping it in the same function.

						//pv2buf.writeUInt8(conv_px[0], pb_pos);
						//pv2buf.writeUInt8(conv_px[1], pb_pos + 1);
						//pv2buf.writeUInt8(conv_px[2], pb_pos + 2);
						//pv2buf.writeUInt8(conv_px[3], pb_pos + 3);

						ci = 0; tr = 0; tg = 0; tb = 0; ta = 0;

						for (x1 = x - convSideWidth; x1 <= x + convSideWidth; x1 ++) {
							for (y1 = y - convSideWidth; y1 <= y + convSideWidth; y1 ++) {
								pb_pos = x1 * 4 + y1 * pb_w * 4;
								//console.log('pb_pos ' + pb_pos);
								r = buf.readUInt8(pb_pos);
								g = buf.readUInt8(pb_pos + 1);
								b = buf.readUInt8(pb_pos + 2);
								a = buf.readUInt8(pb_pos + 3);

								wval = f32a_convolution_buffer[ci];
								wr = r * wval;
								wg = g * wval;
								wb = b * wval;
								wa = a * wval;

								tr = tr + wr;
								tg = tg + wg;
								tb = tb + wb;
								ta = ta + wa;

								ci++;
								if (ci == f32a_convolution_buffer.length) ci = 0;

							}
						}

						//console.log('conv_total ' + conv_total);

						resr = tr;
						resg = tg;
						resb = tb;
						resa = ta;

						//resr = Math.round(tr / conv_total);
						//resg = Math.round(tg / conv_total);
						//resb = Math.round(tb / conv_total);
						//resa = Math.round(ta / conv_total);

						// if the conv total is 0?

						if (resr < 0) resr = 0;
						if (resg < 0) resg = 0;
						if (resb < 0) resb = 0;
						if (resa < 0) resa = 0;

						if (resr > 255) resr = 255;
						if (resg > 255) resg = 255;
						if (resb > 255) resb = 255;
						if (resa > 255) resa = 255;

						//console.log('resr ' + resr);

						pv2buf.writeUInt8(resr, pb_pos);
						pv2buf.writeUInt8(resg, pb_pos + 1);
						pv2buf.writeUInt8(resb, pb_pos + 2);
						pv2buf.writeUInt8(resa, pb_pos + 3);


					} else {

						// Need to copy directly from the border... unconvolved.

						pv2buf.writeUInt8(buf.readUInt8(pb_pos), pb_pos);
						pv2buf.writeUInt8(buf.readUInt8(pb_pos + 1), pb_pos + 1);
						pv2buf.writeUInt8(buf.readUInt8(pb_pos + 2), pb_pos + 2);
						pv2buf.writeUInt8(buf.readUInt8(pb_pos + 3), pb_pos + 3);
					}

					
				}
			}
			return pb2;

		}

		var _convolve = function(pixel_buffer, f32a_convolution_buffer) {
			var x, y, w, h;

			var pb_pos, conv_px, isBorder;

			var convbuf_w = Math.sqrt(f32a_convolution_buffer.length);
			//console.log('convbuf_w ' + convbuf_w);

			var convSideWidth = (convbuf_w - 1) / 2;

			var pb2 = pixel_buffer.new_blank_same_size();
			var pv2buf = pb2.buffer;

			for (x = 0, w = pixel_buffer.size[0]; x < w; x++) {
				for (y = 0, h = pixel_buffer.size[1]; y < h; y++) {
					isBorder = false;
					if (x < convSideWidth) isBorder = true;
					if (x >= w - convSideWidth - 1) isBorder = true;
					if (y < convSideWidth) isBorder = true;
					if (y >= h - convSideWidth - 1) isBorder = true;

					if (!isBorder) {
						pb_pos = x * 4 + y * 4 * w;
						//console.log('pb_pos ' + pb_pos);
						// would be a lot faster not to use convolve_pixel, but to have two inner loops for the
						//  pixel convolution.


						conv_px = convolve_pixel(pixel_buffer, x, y, f32a_convolution_buffer);

						// We could have two further loops inside here...
						//  Keeping it in the same function.

						//console.log('conv_px ' + stringify(conv_px));
						pv2buf.writeUInt8(conv_px[0], pb_pos);
						pv2buf.writeUInt8(conv_px[1], pb_pos + 1);
						pv2buf.writeUInt8(conv_px[2], pb_pos + 2);
						pv2buf.writeUInt8(conv_px[3], pb_pos + 3);
					} else {

						// Need to copy directly from the border... unconvolved.

						//res.buffer.writeUInt8(pixel_buffer.buffer.readUInt8(c), c);
					}

					
				}
			}
			return pb2;

		}

		var count_colors = function(pixel_buffer) {
			// iterate the pixels, making strings with the colors, put into hash.
			var count_unique_colors = 0;
			var map_unique_colors = {};

			// Colors including the alpha value
			pixel_buffer.iterate_pixels(function(x, y, r, g, b, a) {

			});



		}


		var res = {
			'convolve': convolve,
			'convolve_pixel': convolve_pixel
		}

		return res;


	}
);