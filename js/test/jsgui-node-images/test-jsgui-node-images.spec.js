if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../../core/jsgui-lang-essentials', 'fs', '../../image/node/jsgui-node-png', '../../image/node/pixel-buffer', '../../image/node/jsgui-node-jpeg', 'assert'],
    function(jsgui, fs, jsgui_png, Pixel_Bufferm, jsgui_jpeg, assert) {
        var stringify = jsgui.stringify, call_multi = jsgui.call_multi;
        //var source_file = './source/pliers2.png';
        
	
	describe("jsgui-node-images/test-jsgui-node-images.spec.js", function() {
	
		// -----------------------------------------------------
		//	test_load_fuju_jpeg
		// -----------------------------------------------------
		
		xit("test_load_fuju_jpeg", function(done) {
		
            var source_path = './source/pink-fuji.jpeg';

			process.chdir(__dirname);
            jsgui_jpeg.load_from_disk(source_path, function(err, jpeg) {
                if (err) {
                    //console.log('err ' + err);
					//expect(false).toBeTruthy();
					throw err;
                } else {
                    //console.log('image loaded');
                    var size = jpeg.size;
                    //console.log('size ' + stringify(size));
					//expect(stringify(size)).toEqual('[1600, 1033]');
					assert.equal(stringify(size), '[1600, 1033]');
					done();
                }
            });
		
		});
		
		// -----------------------------------------------------
		//	test_load_matterhorn_jpeg
		// -----------------------------------------------------

		it("test_load_matterhorn_jpeg", function(done) {
		
            //console.log('test_load_matterhorn_jpeg: ' + process.cwd());
            var source_path = './source/matterhorn.jpeg';
            var dest_path = './dest/matterhorn.png';

			process.chdir(__dirname);
            jsgui_jpeg.load_from_disk(source_path, function(err, jpeg) {
                if (err) {
                    //console.log('err ' + err);
					//expect(false).toBeTruthy();
					throw err;
                } else {
                    
                    //console.log('image loaded');
                    var size = jpeg.size;
                    //console.log('size ' + stringify(size));
					//expect(stringify(size)).toEqual('[1520, 994]');
					assert.equal(stringify(size), '[1520, 994]');

                    
                    var pb = jpeg.get_rgb_pixel_buffer();
                    //console.log('pre save_rgba_pixel_buffer_to_disk');
					process.chdir(__dirname);
                    jsgui_png.save_pixel_buffer_to_disk(pb, dest_path, function(err, res) {
                        if (err) {
                            throw err;
							//expect(false).toBeTruthy();
                        } else {
                            //console.log('saved');
							//expect(true).toBeTruthy();
							done();
                        }
                    });

                }
                
                
            });

		});
		
		
	});

        
    }
);
