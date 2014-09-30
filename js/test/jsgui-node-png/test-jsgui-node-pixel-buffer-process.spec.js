// Connect to the binding object in this module...



if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../../core/jsgui-lang-essentials', 'fs', '../../image/node/jsgui-node-png',
    '../../image/node/pixel-buffer', '../../image/node/jsgui-node-pixel-buffer-process',
    '../../image/build/Release/binding.node', 'assert', '../test-utils/test-utils'], 
    function(jsgui, fs, jsgui_png, 
        pixel_buffer, pixel_buffer_process,
        buffer_cpp, assert, test_utils) {
        var stringify = jsgui.stringify, call_multi = jsgui.call_multi;
       				
		describe("jsgui-node-png/test-jsgui-node-pixel-buffer-process.spec.js", function() {

			beforeEach(function(){
				process.chdir(__dirname);  
			});

		
			// -----------------------------------------------------
			//	test_load_dice_png_to_rgba_buffer_save_as_png
			// -----------------------------------------------------
				
			it("test_load_dice_png_to_rgba_buffer_save_as_png", function(done) {
			
				//var source_file = './source/pliers2.png';
				//var source_file = './source/f00n2c08.png';
				
				// f00n2c08
				// load up a PNG file.
				//  then iterate through its pixels.
				
				// want to execute the same test on a bunch of items.
				
				var load_png_to_rgba_buffer_save_as_png = function(source_path, dest_path, callback) {
					
					jsgui_png.load_pixel_buffer_from_disk(source_path, function(err, pix_buf) {
						if (err) {
							throw err;
						} else {
							//console.log('loaded rgba pixel buffer');
							//console.log('buffer resolution: ' + stringify(pix_buf.size));
							assert.equal(stringify(pix_buf.size), '[935, 453]');
							
							jsgui_png.save_pixel_buffer_to_disk(pix_buf, dest_path, function(err, res) {
								//console.log('save callback');
								if (err) {
									throw err;
								}
								
								callback(null, true);
							});
						}
					
					});
					
				}
				
				var test_load_dice_png_to_rgba_buffer_save_as_png = function() {
					
					//var source_path = './source/pngsuite/f00n2c08.png';
					//var dest_path = './res/f00n2c08.png';
					
					//load_png_to_rgba_buffer_save_as_png(source_path, dest_path);
					
					var fns = [];
					
					
					fns.push([load_png_to_rgba_buffer_save_as_png, ['./source/dice.png', './res/dice.png']]);
					
					//console.log('pre call multi');
					
					call_multi(fns, function(err, res_multi) {
						test_utils.assertFilesEqual('./res/dice.png', './res_estimated/dice.png');
						done();
					});
				}
				test_load_dice_png_to_rgba_buffer_save_as_png();
			
			});
						
			// -----------------------------------------------------
			//	test_convolve_edge
			// -----------------------------------------------------
				
			it("test_convolve_edge", function(done) {
			
				// want to iterate through, setting the value of each pixel.
				//  will do some kind of bleach effect.

				// Could maybe try with bigger images?
				//  Smaller
				// Want to get a nice little library made involving C and C++.
				//  Could give that system a convolution for it to do.
				//   This could be very FAST.

				var test_convolve_edge = function() {
					jsgui_png.load_pixel_buffer_from_disk('./source/dice.png', function(err, pix_buf) {
						if (err) {
							throw err;
						} else {
							//console.log('loaded rgba pixel buffer');
							//console.log('buffer resolution: ' + stringify(pix_buf.size));
							assert.equal(stringify(pix_buf.size), '[935, 453]');
							
							// Don't iterate the pixels with this??

							// Or do?

							// But have some bleaching written in JS to start with at least.

							// Want to try the bleaching algorithm in C++ / C as well.
							//  In C, having a function call per pixel may be OK...
							//   but having loops is likely to be faster.
							//   Function call per pixel may be how OpenCL works.

							var w = pix_buf.size[0], h = pix_buf.size[1], l = w * h;
							var buffer = pix_buf.buffer, r, g, b, a, i;
							
							//buffer_cpp.
							//var convbuf = new Buffer(9);
							/*
							var convbuf = new Float32Array([
								-1, 1, -1, 
								-1, 1, -1, 
								-1, 1, -1]);
							*/

							/*
							var convbuf = new Float32Array([
								-1, 0, -1, 
								0, 1, 0, 
								-1, 0, -1]);
							*/

							var convbuf = new Float32Array([
								1, 0, 1, 
								0, -4, 0, 
								1, 0, 1]);
							
							/*
							var convbuf = new Float32Array([
								1, 1, 1, 1, 1,
								1, 1, 1, 1, 1,
								1, 1, 1, 1, 1,
								1, 1, 1, 1, 1,
								1, 1, 1, 1, 1
								]);
							*/

							//convbuf.fill(1);

							// Convoluton could be quite a lot faster if done in a more optimized way in node.js.


							var pix_buf2 = pixel_buffer_process.convolve(pix_buf, convbuf);

							//console.log('pix_buf2.buffer.length ' + pix_buf2.buffer.length);
							assert.equal(pix_buf2.buffer.length, 1694220);

							//var px = pixel_buffer_process.convolve_pixel(pix_buf, 100, 100, convbuf);
							//console.log('px ' + stringify(px));
							//throw 'stop';
						
							jsgui_png.save_pixel_buffer_to_disk(pix_buf2, './res/edge-blur-dice.png', function(err, res) {
								//console.log('convolved cb save');
								if (err) {
									throw err;
								}else{
									test_utils.assertFilesEqual('./res/edge-blur-dice.png', './res_estimated/edge-blur-dice.png');
									done();
								}
								
								//callback(null, true);
							});

							// want to deal with the buffer itself.

							/*
							jsgui_png.save_pixel_buffer_to_disk(pix_buf, dest_path, function(err, res) {
								//console.log('save callback');
								if (err) {
									throw err;
								}
								
								callback(null, true);
							});
							*/


						}
					
					});
				}
				test_convolve_edge();
			
			});
						
			// -----------------------------------------------------
			//	test_bleach_c_function
			// -----------------------------------------------------
				
			it("test_bleach_c_function", function(done) {
			
				var test_bleach_c_function = function() {
					jsgui_png.load_pixel_buffer_from_disk('./source/dice.png', function(err, pix_buf) {
						if (err) {
							throw err;
						} else {
							//console.log('loaded rgba pixel buffer');
							//console.log('buffer resolution: ' + stringify(pix_buf.size));
							assert.equal(stringify(pix_buf.size), '[935, 453]');
							
							// Don't iterate the pixels with this??
							// Or do?

							// But have some bleaching written in JS to start with at least.

							// Want to try the bleaching algorithm in C++ / C as well.
							//  In C, having a function call per pixel may be OK...
							//   but having loops is likely to be faster.
							//   Function call per pixel may be how OpenCL works.
							var w = pix_buf.size[0], h = pix_buf.size[1], l = w * h;
							var buffer = pix_buf.buffer, r, g, b, a, i;

							buffer_cpp.rgba_buffer_self_simple_fade(buffer, w, h);


							jsgui_png.save_pixel_buffer_to_disk(pix_buf, './res/bleached-dice.png', function(err, res) {
								//console.log('cb save');
								if (err) {
									throw err;
								}else{
									test_utils.assertFilesEqual('./res/bleached-dice.png', './res_estimated/bleached-dice.png');
									done();
								}
								
								//callback(null, true);
							});
						}
					
					});
				}
				test_bleach_c_function();
			});
						
			// -----------------------------------------------------
			//	test_buffer_copy_c
			// -----------------------------------------------------
				
			it("test_buffer_copy_c", function(done) {
			
				var test_buffer_copy_c = function() {
					jsgui_png.load_pixel_buffer_from_disk('./source/dice.png', function(err, pix_buf) {
						if (err) {
							throw err;
						} else {
							//console.log('loaded rgba pixel buffer');
							//console.log('buffer resolution: ' + stringify(pix_buf.size));
							assert.equal(stringify(pix_buf.size), '[935, 453]');
							
							// Don't iterate the pixels with this??
							// Or do?

							// But have some bleaching written in JS to start with at least.

							// Want to try the bleaching algorithm in C++ / C as well.
							//  In C, having a function call per pixel may be OK...
							//   but having loops is likely to be faster.
							//   Function call per pixel may be how OpenCL works.
						   // var w = pix_buf.size[0], h = pix_buf.size[1], l = w * h;
							var buffer = pix_buf.buffer, r, g, b, a, i;
							//console.log('buffer.length ' + buffer.length);
							var buffer2 = buffer_cpp.buffer_copy(buffer);
							//console.log('buffer2.length ' + buffer2.length);
							pix_buf.buffer = buffer2;
							
							jsgui_png.save_pixel_buffer_to_disk(pix_buf, './res/copied-dice.png', function(err, res) {
								//console.log('cb save');
								if (err) {
									throw err;
								}else{
									test_utils.assertFilesEqual('./res/copied-dice.png', './res_estimated/copied-dice.png');
									done();
								}
								
								//callback(null, true);
							});
							
						}
					
					});
				}
				test_buffer_copy_c();

				// want to test convolutions.
				//  This is something for rgba buffers that could be implemented as a buffer-process module, both
				//  in JavaScript and also in C.

				// Could try a hard-coded convolution?
				//  Also want to do image compression / encoding.
				//   Changing from png to rgba?

				// Could also do convolution in JavaScript, but call C functions for matrix maths.
				//  Not sure about the various matrices in JavaScript though - they may be 1d.
				//   We could put data into 1d buffers, and have a width variable.
				//    (idea) put them into buffers, then we work out what the possible dimensions are through
				//     factorization. Then we have an int that says which in the sequence of possible
				//     widths it is.

				// Buffers with width properties
				// =============================

				// Had height there but I don't think we need it much of the time.
			
			});
												
		});

    }
);
