if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../../core/jsgui-lang-essentials', 'fs', '../../image/jsgui-node-render-svg', '../../fs/jsgui-node-fs2-core', 'assert', '../test-utils/test-utils'], 
    function(jsgui, fs, render_svg, fs2, assert, test_utils) {
        var stringify = jsgui.stringify, call_multi = jsgui.call_multi;
        
		describe("jsgui-node-render-svg /test-jsgui-node-render-svg.spec.js ", function() {
		
			beforeEach(function(){
				process.chdir(__dirname);  
			});
		
			// -----------------------------------------------------
			//	test_render_dice
			// -----------------------------------------------------
				
			it("test_render_dice", function(done) {
			
				//var source_file = './source/pliers2.png';			
				var source_dice = './source/dice.svg';
				var res_dice = './res/dice.png';
			
				var test_render_dice = function(callback) {
					// ins, out, ext, callback
					
					// get the load file stream
					
					// Load the file from disk with fs2
					
					fs2.load_file_as_string(source_dice, function(err, dice_svg) {
						if (err) {
							throw err;
						} else {
							// transform this dice SVG into a PNG (stream or buffer).
							//  A PNG buffer would be a fairly good format to use for images... but images will be fairly flexible in where/how they get used.
							
							if (err) {
								throw err;
							} else {
								//console.log('dice_svg ' + dice_svg);
								// Then convert that SVG to a PNG, probably saving it in the mean-time.
								//  But we may have better PNG compression within this app.
								
								// save_svg_string_to_disk_as_png
								//console.log('pre save_svg_string_to_disk_as_png');
								render_svg.save_svg_string_to_disk_as_png(dice_svg, res_dice, function(err, res) {
									if (err) {
										throw err;
									} else {
										//console.log('cb save');
										//console.log('save res ' + res);
										
										if (callback) {
											callback(null, true);
										}
										
										test_utils.assertFilesEqual(res_dice, res_dice.replace("/res/", "/res_estimated/"));
										done();
									}
								});
							};
						};
					});
					
					
					//var istream = fs.createReadStream(source_dice, {
					//    encoding: 'utf8'
					//});
					
					/*
					istream.on("data", function(data) {
						console.log(data);
					});
					istream.once("end", function() {
						console.log("Hit end of file");
					});
					*/
					// And an output stream... a file on disk perhaps.
					
					//var ostream = fs.createWriteStream(res_dice, {flags: 'w'});
					
					//render_svg(istream, ostream, 'png', function() {
					//    console.log('render_svg callback');
					//});
					
					
					//render_svg(
					
					
				}
				test_render_dice();
			});
						
		});
        
        
    }
);
