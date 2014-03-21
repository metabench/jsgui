// Require rather than define... perhaps we call this one 'main'.

var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
	//paths: {
    //    "some": "some/v1.0"
    //},
    nodeRequire: require
});

requirejs(['jsgui-lang-essentials', 'jsgui-node-png', 'path', 'module'],
function (jsgui, jsgui_node_png, path, module) {

/*

require(['jsgui-lang-essentials', 'jsgui-node-png', 'path', 'module'], function(jsgui, jsgui_node_png, path, module) {

*/
    //This function is called when scripts/helper/util.js is loaded.
	var stringify = jsgui.stringify;
	//alert('jsgui-lang has loaded');
	//alert('mobile client jsgui ' + jsgui);
	//alert(jsgui.get_inline_css_dict_from_style);
	
	// Will require other code as well.
	
	// So, this is working so far.
	var __dirpath = path.dirname(module.uri);
	
	
	
	var _1bpp_test_path = __dirpath + '/source/72dpi_opacity_border/avocado.png';
	
	
	//var _1bpp_test_path = __dirpath + '/source/72dpi_opacity_border/1x1_green_1bpp.png';
	//1x1_green_1bpp.png
	/*
	jsgui_node_png.load_metadata_from_disk(_1bpp_test_path, function(metadata) {
	    console.log('metadata ' + stringify(metadata));
	});
	*/
	
	// Also want to be able to change the bit depth, color indexing mode as well.
	//  Will do this by iterating the pixels.
	
	// Will make it so that I can change the color mode of the image.
	
	var test_convert_1bpp_to_32bpp = function() {
	    
        jsgui_node_png.load_from_disk(_1bpp_test_path, function(png) {
            
            // the png object needs to be the object...
            
            //console.log('png ' + stringify(png));
            
            //throw 'stop';
            
            // then with the PNG, change its bit depth...
            
            // as well as changing the bit depth, save it.
            
            // want various PNG capabilities in there.
            
            var palette = png.palette;
            console.log('palette ' + stringify(palette));
            console.log('palette_with_alphas ' + stringify(png.palette_with_alphas));
            //palette_with_alphas
            /*
            console.log('pre iterate pixels');
            png.iterate_pixels(function(x, y, color) {
                // happens very quickly I think... not sure it will be the fastest way, however.
                
                //console.log('iterated pixel');
                
                //console.log('x, y, color ' + x + ', ' + y + ', ' + color);
            });
            console.log('** iterated pixels');
            */
            png.set_color_parameters(6, 8);
            
            /*
            png.iterate_pixels(function(x, y, color) {
                // happens very quickly I think... not sure it will be the fastest way, however.
                
                //console.log('iterated pixel');
                
                //console.log('x, y, color ' + x + ', ' + y + ', ' + color);
                
                // then save the PNG
                
                
                
                //png.save_to_disk(
                
                
            });
            */
            //var new_png_path = path.dirname(_1bpp_test_path) + '/' + path.basename(_1bpp_test_path, '.png') + '_32bpp.png';
            
            // can load the gradient24.png image which uses scanline filters.
            
            var new_png_path = path.dirname(_1bpp_test_path) + '/' + '_32bpp_' + path.basename(_1bpp_test_path, '.png') + '.png';
            console.log('new_png_path ' + new_png_path);
            
            png.save_to_disk(new_png_path, function() {
                console.log('png saved');
            });
            
            
        });
	}
	
	//test_convert_1bpp_to_32bpp();
	
	var test_load_png_with_scanline_filter_1 = function() {
	    // scanline filter 1 is the add filter.
	
	    //var source_path = __dirpath + '/source/gradient24.png';
	    var source_path = __dirpath + '/source/pngsuite/f01n2c08.png';
	    //f01n2c08.png
	    
	    jsgui_node_png.load_from_disk(source_path, function(png) {
	        console.log('image loaded');
	        var size = png.size;
	        var color_type = png.color_type;
	        var bit_depth = png.bit_depth;
	        
	        console.log('size ' + stringify(size));
	        console.log('scanline_length ' + stringify(png.scanline_length));
	        console.log('color_type ' + stringify(color_type));
	        console.log('bit_depth ' + stringify(bit_depth));
	        
	        var do_iterate = function() {
	            png.iterate_pixels(function(x, y, color) {
                    // happens very quickly I think... not sure it will be the fastest way, however.
                    //console.log('iterated pixel');
                    console.log('x, y, color ' + x + ', ' + y + ', ' + color);
                    // then save the PNG
                    //png.save_to_disk(
                });
	        }
	        //do_iterate();
            
            //var map_sf = png.get_map_scanline_filters();
            //console.log('map_sf ' + stringify(map_sf));
            
            //var unfiltered_scanline_0 = png.get_unfiltered_scanline_buffer(0);
	        //console.log('unfiltered_scanline_0 ' + unfiltered_scanline_0);
	        //console.log('unfiltered_scanline_0 ' + stringify(unfiltered_scanline_0));
	        //console.log('unfiltered_scanline_0.length ' + stringify(unfiltered_scanline_0.length));
	        
	        png.iterate_row(0, function(x, y, color) {
	            console.log('x, y, color ' + x + ', ' + y + ', ' + color);
	        })
	        
	    });
	    
	}
	//test_load_png_with_scanline_filter_1();
	
	//f02n2c08.png
	
	var test_load_png_with_scanline_filter_2 = function() {
	    // scanline filter 1 is the add filter.
	
	    //var source_path = __dirpath + '/source/gradient24.png';
	    var source_path = __dirpath + '/source/pngsuite/f02n2c08.png';
	    //f01n2c08.png
	    
	    jsgui_node_png.load_from_disk(source_path, function(png) {
	        console.log('image loaded');
	        var size = png.size;
	        var color_type = png.color_type;
	        var bit_depth = png.bit_depth;
	        
	        console.log('size ' + stringify(size));
	        console.log('scanline_length ' + stringify(png.scanline_length));
	        console.log('color_type ' + stringify(color_type));
	        console.log('bit_depth ' + stringify(bit_depth));
	        
	        var do_iterate = function() {
	            png.iterate_pixels(function(x, y, color) {
                    // happens very quickly I think... not sure it will be the fastest way, however.
                    //console.log('iterated pixel');
                    console.log('x, y, color ' + x + ', ' + y + ', ' + color);
                    // then save the PNG
                    //png.save_to_disk(
                });
	        }
	        //do_iterate();
            
            //var map_sf = png.get_map_scanline_filters();
            //console.log('map_sf ' + stringify(map_sf));
            
            //var unfiltered_scanline_0 = png.get_unfiltered_scanline_buffer(0);
	        //console.log('unfiltered_scanline_0 ' + unfiltered_scanline_0);
	        //console.log('unfiltered_scanline_0 ' + stringify(unfiltered_scanline_0));
	        //console.log('unfiltered_scanline_0.length ' + stringify(unfiltered_scanline_0.length));
	        
	        png.iterate_row(18, function(x, y, color) {
	            console.log('x, y, color ' + x + ', ' + y + ', ' + color);
	        })
	        
	    });
	    
	}
	//test_load_png_with_scanline_filter_2();
	
	
	var test_load_png_with_scanline_filter_3 = function() {
	    // scanline filter 1 is the add filter.
	
	    //var source_path = __dirpath + '/source/gradient24.png';
	    var source_path = __dirpath + '/source/pngsuite/f03n2c08.png';
	    
	    jsgui_node_png.load_from_disk(source_path, function(png) {
	        console.log('image loaded');
	        var size = png.size;
	        var color_type = png.color_type;
	        var bit_depth = png.bit_depth;
	        
	        console.log('size ' + stringify(size));
	        console.log('scanline_length ' + stringify(png.scanline_length));
	        console.log('color_type ' + stringify(color_type));
	        console.log('bit_depth ' + stringify(bit_depth));
	        
	        var do_iterate = function() {
	            png.iterate_pixels(function(x, y, color) {
                    // happens very quickly I think... not sure it will be the fastest way, however.
                    //console.log('iterated pixel');
                    console.log('x, y, color ' + x + ', ' + y + ', ' + color);
                    // then save the PNG
                    //png.save_to_disk(
                });
	        }
	        //do_iterate();
            
            //var map_sf = png.get_map_scanline_filters();
            //console.log('map_sf ' + stringify(map_sf));
            
            //var unfiltered_scanline_0 = png.get_unfiltered_scanline_buffer(0);
	        //console.log('unfiltered_scanline_0 ' + unfiltered_scanline_0);
	        //console.log('unfiltered_scanline_0 ' + stringify(unfiltered_scanline_0));
	        //console.log('unfiltered_scanline_0.length ' + stringify(unfiltered_scanline_0.length));
	        
	        png.iterate_row(1, function(x, y, color) {
	            console.log('x, y, color ' + x + ', ' + y + ', ' + color);
	        })
	    });
	    
	}
	//test_load_png_with_scanline_filter_3();
	
	var test_load_png_with_scanline_filter_4 = function() {
	    // scanline filter 1 is the add filter.
	
	    //var source_path = __dirpath + '/source/gradient24.png';
	    var source_path = __dirpath + '/source/pngsuite/f04n2c08.png';
	    
	    jsgui_node_png.load_from_disk(source_path, function(png) {
	        //console.log('image loaded');
	        var size = png.size;
	        var color_type = png.color_type;
	        var bit_depth = png.bit_depth;
	        
	        console.log('size ' + stringify(size));
	        console.log('scanline_length ' + stringify(png.scanline_length));
	        console.log('color_type ' + stringify(color_type));
	        console.log('bit_depth ' + stringify(bit_depth));
	        
	        var do_iterate = function() {
	            png.iterate_pixels(function(x, y, color) {
                    // happens very quickly I think... not sure it will be the fastest way, however.
                    //console.log('iterated pixel');
                    console.log('x, y, color ' + x + ', ' + y + ', ' + color);
                    // then save the PNG
                    //png.save_to_disk(
                });
	        }
	        //do_iterate();
            
            //var map_sf = png.get_map_scanline_filters();
            //console.log('map_sf ' + stringify(map_sf));
            
            //var unfiltered_scanline_0 = png.get_unfiltered_scanline_buffer(0);
	        //console.log('unfiltered_scanline_0 ' + unfiltered_scanline_0);
	        //console.log('unfiltered_scanline_0 ' + stringify(unfiltered_scanline_0));
	        //console.log('unfiltered_scanline_0.length ' + stringify(unfiltered_scanline_0.length));
	        
	        png.iterate_row(28, function(x, y, color) {
	            console.log('x, y, color ' + x + ', ' + y + ', ' + color);
	        })
	        
	    });
	    
	}
	//test_load_png_with_scanline_filter_4();
	
	// Want some tests to do with modifying the scanline filters used.
	
	// Load an image that uses the Paeth filter, change the filter to the 'add' filter, then save it.
	
	var test_change_scanline_filters = function() {
	    var test_change_scanline_filter_4_to_1 = function() {
            
            //var source_path = __dirpath + '/source/gradient24.png';
            var source_path = __dirpath + '/source/pngsuite/f04n2c08.png';
            
            jsgui_node_png.load_from_disk(source_path, function(png) {
                //console.log('image loaded');
                var size = png.size;
                var color_type = png.color_type;
                var bit_depth = png.bit_depth;
                
                console.log('size ' + stringify(size));
                console.log('scanline_length ' + stringify(png.scanline_length));
                console.log('color_type ' + stringify(color_type));
                console.log('bit_depth ' + stringify(bit_depth));
                
                var do_iterate = function() {
                    png.iterate_pixels(function(x, y, color) {
                        // happens very quickly I think... not sure it will be the fastest way, however.
                        //console.log('iterated pixel');
                        console.log('x, y, color ' + x + ', ' + y + ', ' + color);
                        // then save the PNG
                        //png.save_to_disk(
                    });
                }
                
                // when setting that scanline filter byte, need to first copy the scanline to the unfiltered scanline
                //  buffer.
                png.set_scanline_filter_all_rows(1);
                
                do_iterate();
                
                //var map_sf = png.get_map_scanline_filters();
                //console.log('map_sf ' + stringify(map_sf));
                
                //var unfiltered_scanline_0 = png.get_unfiltered_scanline_buffer(0);
                //console.log('unfiltered_scanline_0 ' + unfiltered_scanline_0);
                //console.log('unfiltered_scanline_0 ' + stringify(unfiltered_scanline_0));
                //console.log('unfiltered_scanline_0.length ' + stringify(unfiltered_scanline_0.length));
                /*
                png.iterate_row(31, function(x, y, color) {
                    console.log('x, y, color ' + x + ', ' + y + ', ' + color);
                })
                */
                // set the scanline filter on all rows.
                
                
                
                
                
                // then save it (encoded with the filter 1 on all scanlines)
                
                
                var new_png_path = path.dirname(source_path) + '/' + '_scanline_filter_1_' + path.basename(source_path, '.png') + '.png';
                console.log('new_png_path ' + new_png_path);
                
                png.save_to_disk(new_png_path, function() {
                    console.log('png saved');
                });
                
                
            });
        }
        test_change_scanline_filter_4_to_1();
        
        
        
        var test_change_scanline_filter_4_to_2 = function() {
            
            //var source_path = __dirpath + '/source/gradient24.png';
            var source_path = __dirpath + '/source/pngsuite/f04n2c08.png';
            
            jsgui_node_png.load_from_disk(source_path, function(png) {
                //console.log('image loaded');
                var size = png.size;
                var color_type = png.color_type;
                var bit_depth = png.bit_depth;
                
                console.log('size ' + stringify(size));
                console.log('scanline_length ' + stringify(png.scanline_length));
                console.log('color_type ' + stringify(color_type));
                console.log('bit_depth ' + stringify(bit_depth));
                
                var do_iterate = function() {
                    png.iterate_pixels(function(x, y, color) {
                        // happens very quickly I think... not sure it will be the fastest way, however.
                        //console.log('iterated pixel');
                        console.log('x, y, color ' + x + ', ' + y + ', ' + color);
                        // then save the PNG
                        //png.save_to_disk(
                    });
                }
                
                // when setting that scanline filter byte, need to first copy the scanline to the unfiltered scanline
                //  buffer.
                png.set_scanline_filter_all_rows(2);
                
                do_iterate();
                
                var new_png_path = path.dirname(source_path) + '/' + '_scanline_filter_2_' + path.basename(source_path, '.png') + '.png';
                console.log('new_png_path ' + new_png_path);
                
                png.save_to_disk(new_png_path, function() {
                    console.log('png saved');
                });
                
            });
        }
        test_change_scanline_filter_4_to_2();
        
        
        
        var test_change_scanline_filter_4_to_3 = function() {
            
            //var source_path = __dirpath + '/source/gradient24.png';
            var source_path = __dirpath + '/source/pngsuite/f04n2c08.png';
            
            jsgui_node_png.load_from_disk(source_path, function(png) {
                //console.log('image loaded');
                var size = png.size;
                var color_type = png.color_type;
                var bit_depth = png.bit_depth;
                
                console.log('size ' + stringify(size));
                console.log('scanline_length ' + stringify(png.scanline_length));
                console.log('color_type ' + stringify(color_type));
                console.log('bit_depth ' + stringify(bit_depth));
                
                var do_iterate = function() {
                    png.iterate_pixels(function(x, y, color) {
                        // happens very quickly I think... not sure it will be the fastest way, however.
                        //console.log('iterated pixel');
                        console.log('x, y, color ' + x + ', ' + y + ', ' + color);
                        // then save the PNG
                        //png.save_to_disk(
                    });
                }
                
                // when setting that scanline filter byte, need to first copy the scanline to the unfiltered scanline
                //  buffer.
                png.set_scanline_filter_all_rows(3);
                
                do_iterate();
                
                var new_png_path = path.dirname(source_path) + '/' + '_scanline_filter_3_' + path.basename(source_path, '.png') + '.png';
                console.log('new_png_path ' + new_png_path);
                
                png.save_to_disk(new_png_path, function() {
                    console.log('png saved');
                });
                
            });
        }
        test_change_scanline_filter_4_to_3();
        
        
        var test_change_scanline_filter_1_to_4 = function() {
            
            //var source_path = __dirpath + '/source/gradient24.png';
            var source_path = __dirpath + '/source/pngsuite/f01n2c08.png';
            
            jsgui_node_png.load_from_disk(source_path, function(png) {
                //console.log('image loaded');
                var size = png.size;
                var color_type = png.color_type;
                var bit_depth = png.bit_depth;
                
                console.log('size ' + stringify(size));
                console.log('scanline_length ' + stringify(png.scanline_length));
                console.log('color_type ' + stringify(color_type));
                console.log('bit_depth ' + stringify(bit_depth));
                
                var do_iterate = function() {
                    png.iterate_pixels(function(x, y, color) {
                        // happens very quickly I think... not sure it will be the fastest way, however.
                        //console.log('iterated pixel');
                        console.log('x, y, color ' + x + ', ' + y + ', ' + color);
                        // then save the PNG
                        //png.save_to_disk(
                    });
                }
                
                // when setting that scanline filter byte, need to first copy the scanline to the unfiltered scanline
                //  buffer.
                png.set_scanline_filter_all_rows(4);
                
                do_iterate();
                
                var new_png_path = path.dirname(source_path) + '/' + '_scanline_filter_4_' + path.basename(source_path, '.png') + '.png';
                console.log('new_png_path ' + new_png_path);
                
                png.save_to_disk(new_png_path, function() {
                    console.log('png saved');
                });
                
            });
        }
        test_change_scanline_filter_1_to_4();
        
        var test_change_scanline_filter_3_to_4 = function() {
            
            //var source_path = __dirpath + '/source/gradient24.png';
            var source_path = __dirpath + '/source/pngsuite/f03n2c08.png';
            
            jsgui_node_png.load_from_disk(source_path, function(png) {
                //console.log('image loaded');
                var size = png.size;
                var color_type = png.color_type;
                var bit_depth = png.bit_depth;
                
                console.log('size ' + stringify(size));
                console.log('scanline_length ' + stringify(png.scanline_length));
                console.log('color_type ' + stringify(color_type));
                console.log('bit_depth ' + stringify(bit_depth));
                
                var do_iterate = function() {
                    png.iterate_pixels(function(x, y, color) {
                        // happens very quickly I think... not sure it will be the fastest way, however.
                        //console.log('iterated pixel');
                        console.log('x, y, color ' + x + ', ' + y + ', ' + color);
                        // then save the PNG
                        //png.save_to_disk(
                    });
                }
                
                // when setting that scanline filter byte, need to first copy the scanline to the unfiltered scanline
                //  buffer.
                png.set_scanline_filter_all_rows(4);
                
                do_iterate();
                
                var new_png_path = path.dirname(source_path) + '/' + '_scanline_filter_4_' + path.basename(source_path, '.png') + '.png';
                console.log('new_png_path ' + new_png_path);
                
                png.save_to_disk(new_png_path, function() {
                    console.log('png saved');
                });
                
            });
        }
        test_change_scanline_filter_3_to_4();
        
        
        var test_change_scanline_filter_4_to_4 = function() {
            
            //var source_path = __dirpath + '/source/gradient24.png';
            var source_path = __dirpath + '/source/pngsuite/f04n2c08.png';
            
            jsgui_node_png.load_from_disk(source_path, function(png) {
                //console.log('image loaded');
                var size = png.size;
                var color_type = png.color_type;
                var bit_depth = png.bit_depth;
                
                //console.log('size ' + stringify(size));
                //console.log('scanline_length ' + stringify(png.scanline_length));
                //console.log('color_type ' + stringify(color_type));
                //console.log('bit_depth ' + stringify(bit_depth));
                
                var do_iterate = function() {
                    png.iterate_pixels(function(x, y, color) {
                        // happens very quickly I think... not sure it will be the fastest way, however.
                        //console.log('iterated pixel');
                        console.log('x, y, color ' + x + ', ' + y + ', ' + color);
                        // then save the PNG
                        //png.save_to_disk(
                    });
                }
                
                // when setting that scanline filter byte, need to first copy the scanline to the unfiltered scanline
                //  buffer.
                png.set_scanline_filter_all_rows(4);
                
                do_iterate();
                
                var new_png_path = path.dirname(source_path) + '/' + '_scanline_filter_4_' + path.basename(source_path, '.png') + '.png';
                console.log('new_png_path ' + new_png_path);
                
                png.save_to_disk(new_png_path, function() {
                    console.log('png saved');
                });
                
            });
        }
        test_change_scanline_filter_4_to_4();
        
	}
	//test_change_scanline_filters();
	// load_rgba_32_save_rgb_24
	
	var test_load_rgb_24_save_rgba_32 = function() {
	    // basn2c08 is the 24bpp image.
	    //  want to add an alpha channel to it.
	    //   when doing so, we give every value in the alpha channel the value of 255.
	    //   maybe should use a set_pixel interface?
	    
	    // should be able to save this image as indexed color too.
	    //  using filters should make it smaller too.
	    
	    var source_path = __dirpath + '/source/pngsuite/basn2c08.png';
            
        jsgui_node_png.load_from_disk(source_path, function(png) {
            //console.log('image loaded');
            var size = png.size;
            var color_type = png.color_type;
            var bit_depth = png.bit_depth;
            
            //console.log('size ' + stringify(size));
            //console.log('scanline_length ' + stringify(png.scanline_length));
            //console.log('color_type ' + stringify(color_type));
            //console.log('bit_depth ' + stringify(bit_depth));
            
            //png.set_color_mode
        
            var do_iterate = function() {
                png.iterate_pixels(function(x, y, color) {
                    // happens very quickly I think... not sure it will be the fastest way, however.
                    //console.log('iterated pixel');
                    console.log('x, y, color ' + x + ', ' + y + ', ' + color);
                    // then save the PNG
                    //png.save_to_disk(
                });
            }
            do_iterate();
            // 'set_color_parameters': function(color_type, bit_depth)
            
            
            
            png.set_color_parameters(6, 8);
            
            png.set_scanline_filter_all_rows(1);
            
            var new_png_path = path.dirname(source_path) + '/' + '_32bpp_' + path.basename(source_path, '.png') + '.png';
            console.log('new_png_path ' + new_png_path);
            
            png.save_to_disk(new_png_path, function() {
                console.log('png saved');
            });
            
        });
	    
	}
	test_load_rgb_24_save_rgba_32();
	
	
	var test_load_rgba_32_save_rgb_24 = function() {
	    // removes the alpha channel.
	    
	}
	//test_load_rgba_32_save_rgb_24();
	
	
	
	
});