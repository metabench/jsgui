if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../../core/jsgui-lang-essentials', 'fs', 'path', '../../image/jsgui-node-sprite', '../../image/jsgui-node-png', 'assert', '../test-utils/test-utils'], 
    function(jsgui, fs, path, jsgui_node_sprite, jsgui_node_png, assert, test_utils) {
        var tof = jsgui.tof, each = jsgui.each;
        var stringify = jsgui.stringify;
        
        
        // does not return anything. just makes a sprite.
        
        var stringify = jsgui.stringify;
        var source_images = ['./source/axe.png', './source/bike.png', './source/dice.png', './source/knife.png', './source/pliers.png'];
        
        // want to get the sprite rgba buffer.
        
        
        //var stringify = jsgui.stringify;
        //var source_images = ['./png/axe.png', './png/bike.png', './png/dice.png', './png/knife.png', './png/pliers.png'];
        
        // want to get the sprite rgba buffer.
        
		
		describe("jsgui-node-sprite /test-jsgui-node-sprite.js ", function() {
		
			beforeEach(function(){
				process.chdir(__dirname);  
			});
		
			// -----------------------------------------------------
			//	test_build_sprite
			// -----------------------------------------------------
				
			xit("test_build_sprite", function(done) {
			
				var test_build_sprite = function() {
					jsgui_node_sprite.rgba_buffer_from_files(source_images, function(err, res) {
						if (err) {
							throw err;
						} else {
							//console.log('res ' + stringify(res));
							// can't stringify a large image.
							//console.log('test callback');
							// save 
						
							var dest_path = './res/sprite.png';
						
							// use image to save it?
							//  can use PNG to save it.
						
							//console.log('pre save');
						
							// var save_rgba_pixel_buffer_to_disk = function(rbga_buffer, dest_path, callback)
						
							jsgui_node_png.save_pixel_buffer_to_disk(res, dest_path, function(err, res) {
								//console.log('done save');
								test_utils.assertFilesEqual(dest_path, dest_path.replace("/res/", "/res_estimated/"));
								done();
							})
						
						
						}
					});
				}
				test_build_sprite();
			});
						
			// -----------------------------------------------------
			//	test_build_sprite_slf4
			// -----------------------------------------------------
				
			it("test_build_sprite_slf4", function(done) {
			
				var test_build_sprite_slf4 = function() {
					jsgui_node_sprite.rgba_buffer_from_files(source_images, function(err, res) {
						if (err) {
							throw err;
						} else {
							//console.log('res ' + stringify(res));
							// can't stringify a large image.
							//console.log('test callback');
							// save 
						
							var dest_path = './res/sprite_slf4.png';
						
							// use image to save it?
							//  can use PNG to save it.
						
							//console.log('pre save');
						
							// var save_rgba_pixel_buffer_to_disk = function(rbga_buffer, dest_path, callback)
						
							jsgui_node_png.save_pixel_buffer_to_disk(res, dest_path, {'scanline_encoding': 4}, function(err, res) {
								//console.log('done save');
								test_utils.assertFilesEqual(dest_path, dest_path.replace("/res/", "/res_estimated/"));
								done();
							})
						
						
						}
					});
				}
				test_build_sprite_slf4();
			});
						
			// -----------------------------------------------------
			//	test_build_sprite_optimize
			// -----------------------------------------------------
				
			// produces an error: png.ensure_unfiltered_scanlines_buffer(): png has no method "ensure_unfiltered_scanlines_buffer"
				
			xit("test_build_sprite_optimize", function(done) {
			
				var test_build_sprite_optimize = function() {
					//console.log('test_build_sprite_optimize');
					jsgui_node_sprite.rgba_buffer_from_files(source_images, function(err, res) {
						if (err) {
							throw err;
						} else {
							//console.log('cb test_build_sprite_optimize');
							// can't stringify a large image.
							//console.log('test callback');
							// save 
						
							var dest_path = './res/sprite_opti.png';
						
							// use image to save it?
							//  can use PNG to save it.
						
							//console.log('pre save');
						
							// var save_rgba_pixel_buffer_to_disk = function(rbga_buffer, dest_path, callback)
							//png.ensure_unfiltered_scanlines_buffer();
							jsgui_node_png.save_pixel_buffer_to_disk(res, dest_path, {'optimize': 'best'}, function(err, res) {
								//console.log('done save');
								test_utils.assertFilesEqual(dest_path, dest_path.replace("/res/", "/res_estimated/"));
								done();
							})
						
						
						}
					});
				}
				test_build_sprite_optimize();
				
				// {'scanline_encoding': 4}
			
			});
						
		});
		
		
    }
);
