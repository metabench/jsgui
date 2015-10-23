//var PNG = require('pngjs').PNG;



define(['../core/jsgui-lang-essentials', 'pngjs', 'fs' , 'child_process'], function (jsgui, pngjs, fs , child_process) {

	// raster toolkit for Node.js
	var Class = jsgui.Class, stringify = jsgui.stringify, each = jsgui.each;
	var PNG = pngjs.PNG;
	var exec = child_process.exec;

	// This is also going to use Unit8Array data.

	// Likely to split out PNG handling.
	//  To handle a PNG...
	//  Code to load, code to save.
	//   Can be quite procedural... could use pipes/streams too.




	// May make something that would work both within node and on the client, however for image processing there are various things available on the
	//  server that are not immediately available on the client.

	// Things to do with loading and saving files as well.

	// This could possibly work with the jsgui object system as a workspace could have a collection of image editors

	// Image editors could possibly contain different layers.
	//  Thinking of making this a bit similar to image editing programs such as Photoshop and Paintshop Pro.

	// Layers could make things more complicated... but I think it's worth doing.

	// Workspace -> ImageDocument -> Layer

	// Want this to be fairly advanced, but running quite soon as well.
	//  Could have a default layer.

	// Layers will be useful for composing images. They could be stacked, and opacity would be done on the pixels in sequence.
	//  Want this to be a bit similar to Photoshop, but running on the server.

	// Possibly some algorithms will run using callbacks provided from either the client or server, this code could load those algorithms.

	var doc_counter = 0;

	// Layer...
	//  This could be a fairly generic means of processing things
	//  No need to open a document in some instances, maybe no need to open a workspace.
	//   Will be able to load data onto a layer, and manipulate layers in various ways.

	// Will be able to expand layers, resize them etc, apply transformations.
	//  Layers will be useful when composed into images.

	// This could also load some files such as PDFs from disk, via a program such as ImageMagick.

	// This image system should allow much of the image processing code in fs2 to be expressed much more clearly and concisely.
	//  There is a lot that can be processed on the server.

	// There could be a node-rasters-tools module perhaps that brings extended functionality?
	//  There will be things to do with tidying up images, such as filling in transparent anamalies.
	//  Also will have the means to add these borders to the images.

	var layer_counter = 0;

	var Layer = Class.extend({
		'init': function(spec) {
			this.width = spec.width || 64;
			this.height = spec.height || 64;
			if (spec.name) {
				this.name = spec.name;
			} else {
				this.name = 'layer_' + layer_counter;
				layer_counter++;
			}

			this.data = new Buffer(4 * this.width * this.height);

			// This will have a buffer.
			//  Just like the buffer in pngjs?


		},
		'clone': function() {
			var new_layer = new Layer({
				'width': this.width,
				'height': this.height,
				'name': this.name + '_clone'
			})
			this.data.copy(new_layer.data);
			return new_layer;
		},

		'fs_load_png': function(source_path, callback) {

			//var new_png = {}
			var that = this;

			// we need to know what filter type it is?

			fs.createReadStream(source_path).pipe(new PNG({
		        filterType: 4
		    }))
		    .on('parsed', function() {
		    	//console.log('parsed');
		    	// var that = this;

		    	//that.data =

		    	this.data.copy(that.data);

		    	callback.call(that);

		    });
		},

		// Analysis of png to determine how to save it - ie count unique colors.

		// save png, with output parameters

		'fs_save_png': function(dest_path, callback) {

	        var new_png = new PNG({
	            width: this.width,
	            height: this.height,
	            filterType: -1
	        });
	        this.data.copy(new_png.data);

	        console.log('saving png to ' + dest_path);
	        var ws = fs.createWriteStream(dest_path);

	        new_png.pack().pipe(ws);
	        ws.on('close', function() {
	        	callback(null, true);
	        });
		},

		// Want integrated encoding with this as well.

		'fs_save_png8_quant': function(dest_path, callback) {
			var that = this;
			this.fs_save_png(dest_path, function(err, res) {
				//var fs2 = require('fs2');
				//  can't do that, will need to get the code to quant something.

				if (err) {
					throw err;
				} else {
					var pq = {
						'png_quant': function(source_path, dest_path, num_colors, callback) {
							var command = 'pngquant -force -speed 1 -ext _' + num_colors + 'c_quant.png ' + num_colors + ' "' + source_path + '"';
							console.log('command ' + command);
							exec(command, function(err, stdout) {
								if (err) {
									throw(err)
								} else {
									// we know the destination file name.
									var quant_temp_file_name = source_path.substring(0, source_path.length - 4) + '_' + num_colors + 'c_quant.png';
									fs.rename(quant_temp_file_name, dest_path, function(err, res) {
										if (err) {
											throw err;
										} else {
											console.log('png_quant should have renamed file to ' + dest_path);
											callback(null, true);

										}
									});
								}
							});
						}
					}

					pq.png_quant(dest_path, dest_path, 255, function(err, res) {
						if (err) {
							throw err;
						} else {
							callback(null, res);
						}

						//console.log('quanted');


					});
				}

			});

		},

		// iterate over pixels
		//  single pixel read, single pixel write
		//  block pixel read, single pixel write

		// also, when specifying convolution masks.
		//  such as sharpen or blur.

		// write pixel
		'set_pixel': function(x, y, r, g, b, a) {
			var idx = (this.width * y + x) << 2;
			var data = this.data;

        	data[idx] = r;
        	data[idx + 1] = g;
        	data[idx + 2] = b;
        	data[idx + 3] = a;
		},

		'get_pixel': function(x, y) {
			var idx = (this.width * y + x) << 2;
			var data = this.data;
			var res = [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]];
			return res;
		},

		'each_pixel': function(callback) {
			var y, x, h = this.height, w = this.width;
			var data = this.data;

        	for (y = 0; y < h; y++) {
	            for (x = 0; x < w; x++) {
	                var idx = (w * y + x) << 2;

	                var r = data[idx];
	                var g = data[idx + 1];
	                var b = data[idx + 2];
	                var a = data[idx + 3];


	                //var fn_set =
	                var fn_set = function(r, g, b, a) {
	                	data[idx] = r;
	                	data[idx + 1] = g;
	                	data[idx + 2] = b;
	                	data[idx + 3] = a;
	                };

	                //set_px_grid(x, y);

	                // creation of a convolution mask - this will be a 3x3 array.
	                // a pixel grid rather than a single pixel...
	                callback(x, y, r, g, b, a, fn_set);
	                //callback(x, y, that.data[idx], that.data[idx + 1], that.data[idx + 2], that.data[idx + 3], fn_set);
	            }
	        }

		},

		'filter_single_color_in': function(r, g, b) {
			this.each_pixel(function(x, y, r2, g2, b2, a2, set) {
				if (r2 == r && g2 == g && b2 == b) {
					set(r, g, b, a2);
				} else {
					set(0, 0, 0, 0);
				}
			});
		},

		'to_opacity_mask': function() {
			// will need to create a new layer.

			var res = new Layer({
				'width': this.width,
				'height': this.height,
				'name': this.name + '_opacity_mask'
			})

			this.each_pixel(function(x, y, r, g, b, a) {
				if (a > 0) {
					res.set_pixel(x, y, 0, 0, 0, 255);
				} else {
					res.set_pixel(x, y, 0, 0, 0, 0);
				}
			});

			return res;

		},

		'pixel_is_enclosed': function(x, y) {
			if (x < 0) return false;
			if (x >= this.width) return false;
			if (y < 0) return false;
			if (y >= this.height) return false;
			return true;
		},

		'resize_canvas': function(w, h) {
			//this.data = new Buffer(4 * this.width * this.height);

			//var new_data = new Buffer(4 * w * h);

			// then copy this data.
			//  assuming in the central position.

			var x_diff = w - this.width;
			var y_diff = h - this.height;

			// for central position.
			var new_x_offset = Math.floor(x_diff / 2);
			var new_y_offset = Math.floor(x_diff / 2);

			// go through each pixel in the new layer...
			//  getting the data from the old (current) one, if appropriate.

			// Basically draws the current canvas onto the new one.

			var new_layer = new Layer({
				'width': w,
				'height': h,
				'name': 'temp_layer'
			})

			var that = this;

			new_layer.each_pixel(function(x, y, r, g, b, a, set) {
				// get the coords corresponding on the old image
				var corresponding_old_x = x - new_x_offset;
				var corresponding_old_y = y - new_y_offset;

				var pie = that.pixel_is_enclosed(corresponding_old_x, corresponding_old_y);

				//console.log(pie);

				// if the old pixel is outside of the space.
				if (pie) {
					var old_pixel = that.get_pixel(corresponding_old_x, corresponding_old_y);


					//console.log('old_pixel ' + old_pixel);
					set(old_pixel[0], old_pixel[1], old_pixel[2], old_pixel[3]);
				} else {
					set(0, 0, 0, 0);
				}
			});

			this.width = w;
			this.height = h;
			this.data = new_layer.data;

			//var t_layer = new Layer()

			//this.each_pixel(function(x, y, r, g, b, a) {
			//
			//	var new_idx = (w * y + x) << 2;
			//});
		},

		'each_pixel_around_pixel': function(x, y, callback) {
			var y2, x2, h = this.height, w = this.width;
			var data = this.data;

        	for (y2 = y - 1; y2 <= y + 1; y2++) {
	            for (x2 = x - 1; x2 <= x + 1; x2++) {

	            	if (this.pixel_is_enclosed(x2, y2)) {
	            		var idx = (w * y2 + x2) << 2;

		                var r = data[idx];
		                var g = data[idx + 1];
		                var b = data[idx + 2];
		                var a = data[idx + 3];

		                /*
		                //var fn_set =
		                var fn_set = function(r, g, b, a) {
		                	data[idx] = r;
		                	data[idx + 1] = g;
		                	data[idx + 2] = b;
		                	data[idx + 3] = a;
		                };
		                */

		                //set_px_grid(x, y);

		                // creation of a convolution mask - this will be a 3x3 array.
		                // a pixel grid rather than a single pixel...
		                callback(x2 - x, y2 - y, r, g, b, a);
	            	} else {
	            		callback(x2 - x, y2 - y, 0, 0, 0, 0);
	            	}
	                //callback(x, y, that.data[idx], that.data[idx + 1], that.data[idx + 2], that.data[idx + 3], fn_set);
	            }
	        }
		},

		'pixels_around_pixel': function(x, y) {

            res = [];

            this.each_pixel_around_pixel(x,y,function(x, y, r, g, b, a, set) {
                res.push([r, g, b, a]);
            });

            return res;
		},

		'convolution': function(grid_size, callback) {
			// gets a pixel grid for each pixel.
			//  could have it more optimized? could supply indexes? but it may not make much difference, likely to run fast for the moment anyway.

			// could have a callback for each pixel around the pixel?

			var source_grid = [];
			for (var c = 0, l = grid_size; c < l; c++) {
				source_grid[c] = [];
			}
			var that = this;

			this.each_pixel(function(x, y, r, g, b, a, set) {

				// get the source grid.
				//var source_grid = [];
				//for (var c = 0, l = grid_size; c < l; c++) {
					//source_grid[c] = [];
				//}// want to just return each pixel in the source grid

				that.each_pixel_around_pixel(x, y, function(x2, y2, r, g, b, a) {
					// + 1 for the moment.
					//console.log('x2 ' + x2 + ', y2 ' + y2);
					source_grid[x2 + 1][y2 + 1] = [r, g, b, a];
				});

				source_grid.iterate = function(callback) {
					var x, y, w = grid_size, h = grid_size;
					for (x = 0; x < w; x++) {
						for (y = 0; y < h; y++) {
							callback(x, y, source_grid[x][y]);
						}
					}
				};

				callback(x, y, source_grid, r, g, b, a, set);
			});
		},

		// Not working right now.

		// Will change this quite considerably.
		// apply_convolution_mask_with_alpha_composition

		// alpha channel blur
		//  gets the average from the pixels around, then uses that.


		'alpha_blur_out': function() {

			var conv_weights = [[0.025, 0.075, 0.025], [0.075, 0.6, 0.075], [0.025, 0.075, 0.025]];

			this.convolution(3, function(x, y, source_grid, r, g, b, a, set) {
				//console.log('source_grid ' + stringify(source_grid));

				// weighted colour totals - weight the colour additions by the transparancy?
				//  will wind up bluring / spreading the color outwards.

				// Think we need better alpha composition.
				// Having trouble with it at the moment.

				// get the total alpha for the surrounding area.
				// could use a different, circular mask. may have a better effect.
				var alpha_total = 0;

				// full weighting = 255
				// no weighting = 0;

				// proportion_weighting = alpha / 255;

				// calculate the new colour based on adding colours to the mix with various opacities.

				var new_color = [0, 0, 0, 0];

				// weighted convolution mask

				var arr_weighted_new_color_components = [];

				source_grid.iterate(function(gx, gy, px) {
					//console.log('gx ' + gx + ', gy ' + gy + ', px' + px);

					// need to add in based on the strength of the alpha channel of the pixel.

					var a_weight = px[3] / 255;
					console.log('a_weight ' + a_weight);

					var conv_point_weight = conv_weights[gx][gy] * a_weight;
					//console.log('conv_point_weight ' + conv_point_weight);


					// weight the color and alpha according to the convolution.



					if (px[3] > 0) {
						if (new_color[3] == 0) {
							new_color = px;
						} else {
							// alpha blend onto the new color.

						}
					}

					arr_weighted_new_color_components.push([px, conv_point_weight]);
					alpha_total = alpha_total + px[3];

				});
				//console.log('arr_weighted_new_color_components ' + stringify(arr_weighted_new_color_components));
				// but blurring with the right colour?

				// then get the average of those...
				var r_tot = 0;
				var g_tot = 0;
				var b_tot = 0;
				var a_tot = 0;
				var w_tot = 0;

				// go through the different component pixels
				//  blend.

				each(arr_weighted_new_color_components, function(i, v) {
					var px = v[0];
					var w = v[1];

					//console.log('w ' + w);

					// weighted contributions.

					r_tot = r_tot + px[0] * w;
					g_tot = g_tot + px[1] * w;
					b_tot = b_tot + px[2] * w;
					a_tot = a_tot + px[3] * w;

					w_tot = w_tot + w;


				});
				console.log('w_tot ' + w_tot);
				//console.log('')

				r_tot = Math.round(r_tot);
				g_tot = Math.round(g_tot);
				b_tot = Math.round(b_tot);
				a_tot = Math.round(a_tot);


				//r_tot = Math.round(r_tot * 1 / w_tot);
				//g_tot = Math.round(g_tot * 1 / w_tot);
				//b_tot = Math.round(b_tot * 1 / w_tot);
				//a_tot = Math.round(a_tot * 1 / w_tot);

				if (a_tot > 0.08) {
					set(r_tot, g_tot, b_tot, a_tot);
				}
				// go over the source grid.
				//  an interate function would be nice there.
				//var avg_alpha = Math.round(alpha_total / 9);



				//var new_alpha = avg_alpha;
				//if (a > new_alpha) new_alpha = a;

				//set(new_color[0], new_color[1], new_color[2], new_alpha);


				//set(new_color[0], new_color[1], new_color[2], new_alpha);



			});

		},

		'color_border_on_transparent_pixels': function(border_color) {
			// goes through the image, and runs the convolution system.

			// want a faster way for getting the source pixel grid.
			//  can use a function that does direct reference translation.
			//  won't be creating grid arrays each time.

			// will still do each_pixel, but then there will be each_pixel_around_pixel
			var that = this;

			// create a clone of the layer and read off that, copying to this one.

			// want to create a copy of the layer, and then use that to read the values off,
			//  while writing the border to this layer.

			var clone = this.clone();

			clone.each_pixel(function(x, y, r, g, b, a, fn_set) {
				var is_transparent = a == 0;
				if (is_transparent) {
					var has_filled_around = false;

					clone.each_pixel_around_pixel(x, y, function(x_offset, y_offset, r, g, b, a) {
						//console.log('epa x_offset ' + x_offset);
						//console.log('epa y_offset ' + y_offset);

						// then will be finding out if any of them are filled

						if (a > 0) {
							has_filled_around = true;
						}

					});
					if (has_filled_around) {
						//fn_set(0, 0, 255, 255);
						that.set_pixel(x, y, border_color[0], border_color[1], border_color[2], border_color[3]);

					} else {
						// not going to do anything in the other case.
						//  can apply this again.


					}
				}


			});




		},

		'biber_pixels_iterate': function(callback){

      /*var that = this;

      this.each_pixel(function(x, y, r, g, b, a, fn_set) {

        var res = that.pixels_around_pixel(x,y)



        res.push(['x',x,'y',y]);

        callback(res);

      });*/

      this.flood_fill_rgb(0,0,[0,0,0,255]);
        callback("test");

		},

		'flood_fill_rgb' : function(x, y, target_color){

        var that = this;

        var orig_color = this.get_pixel(x, y);

        var i = 0;
        var inner = function(x, y) {

        var color = that.get_pixel(x, y);
          if (color[3] != 0 ) {
              if (color[0] != target_color[0] || color[1] != target_color[1] || color[2] != target_color[2] ) {
	              	if (color[0] == orig_color[0] && color[1] == orig_color[1] && color[2] == orig_color[2] ){

	                  that.set_pixel(x, y, target_color[0], target_color[1], target_color[2], color[3]);
	                  i++;
	                  for (var y2 = y - 1; y2 <= y + 1; y2++) {
	                      for (var x2 = x - 1; x2 <= x + 1; x2++) {

	                          if(that.pixel_is_enclosed(x2, y2)) {
	                                inner(x2, y2);
	                          }
	                      }
	                  }
                 }
              }

          }

        }


        inner(x,y);
		return i;
		},

		'png_largest_contiguous_object_layer': function() {

			var that = this;
			var opacity_mask = this.to_opacity_mask();


			var r = 127, g = 255, b = 64;
			var arr_fills_info = [];

			var advance_color = function() {
				b++;
				if (b == 255) {
					b = 0;
					g++;
				}

				if (g == 255) {
					g = 0;
					b++;
				}


			}


			opacity_mask.each_pixel(function(x, y, r2, g2, b2, a, set){


				if(a > 0 && r2 == 0 && g2 == 0 && b2 == 0){

					var num_filled = opacity_mask.flood_fill_rgb(x,y,[r,g,b]);
					if (num_filled > 0){
						advance_color();
						arr_fills_info.push([num_filled,x,y,r,g,b]);
					}
				}

			});

			console.log(stringify(arr_fills_info.length));

			opacity_mask.fs_save_png8_quant("c:/t.png", function() {
												console.log('saved new biber png.');
									});
		}



		// border into transparent.
		//  where there are transparent pixels in the small convolution-like mask, it colors them in.

		// color_border_on_transparent_pixels







	});

	var Document = Class.extend({
		'init': function(spec) {
			// width, height
			this.width = spec.width;
			this.height = spec.height;
			if (spec_name) {
				this.name = spec.name;
			} else {
				this.name = 'document_' + doc_counter;
				doc_counter++;
			}

			// then can create layers in that document.

			// will also be able to change the size (resize canvas, image resize)

			// Also interested in the perspective transformation on the client.

			this.arr_layers = [];
			this.map_layers = {};
			this.layer_counter = 0;


		}

		// Load from PSD?
		//  Will need a way of composing those various layers in place.
		//  Document will probably do that, doing composition with alpha channels.
		// load image from disk into layer?

	})

	// And reading a psd file.





	var Workspace = Class.extend({
		'init': function(spec) {
			// properties...
			this.arr_documents = [];
			this.map_documents = {};

		},
		'new_document': function(spec) {
			var new_doc = new Document(spec);
			this.arr_documents.push(new_doc);
			this.map_documents[new_doc.name] = new_doc;
			// add it to the workspace;
			return new_doc;
		}
		// can load images from disk, provide from memory.

		// will also output images in different formats. I may do some experiments on compression here as well.
		//  Can try reencoding images with different PNG filters, for example, and that could get small image sizes.

	});


	var node_rasters = {
		'Layer': Layer,
		'Document': Document,
		'Workspace': Workspace
	}


	return node_rasters;



});
