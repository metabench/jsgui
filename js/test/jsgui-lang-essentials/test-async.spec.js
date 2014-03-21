
if (typeof define !== 'function') { var define = require('amdefine')(module) }

// can see if define is defined or not.

// The data enhancements are getting on for fairly large.
//  But will definitely help the project scale.
//  Likely to be integrating b+ trees at a very core level.


define(['../../core/jsgui-lang-essentials', 'assert'],
function (jsgui, assert) {
    
	var stringify = jsgui.stringify, Collection = jsgui.Collection;
	var each = jsgui.each;
	
	var call_multiple_callback_functions = jsgui.call_multiple_callback_functions;
	
	// Should just serve the documents in place.
	
	// Will use Jasmine testing framework.
	
	// But for the moment, just call some test functions.
	
	describe("jsgui-lang-essentials/test-async.spec.js", function() {
	
		// -----------------------------------------------------
		//	test_async_timeouts: skipped (not sure how it must work properly)
		// -----------------------------------------------------
			
		xit("test_async_timeouts", function(done) {
		
			var test_async_timeouts = function() {
				var fns = [];
				
				for (var c = 0; c < 32; c++) {
					var i = c;
					fns.push([function() {
						setTimeout(function() {
							console.log(i + ' complete');
						}, 10) //1000)
					}, []]);
				}
				
				call_multiple_callback_functions(fns, function(err, res) {
					if (err){
						throw err;
					} else {
						console.log('test_async_timeouts all done');
						done();
					}
				});
				
			}			
			test_async_timeouts();
			
		});
					
		// -----------------------------------------------------
		//	test_async_timeouts_multi_8
		// -----------------------------------------------------
			
		it("test_async_timeouts_multi_8", function(done) {		
			
			var test_async_timeouts_multi_8 = function() {
				var fns = [];
				
				var count1 = 0;
				var count2 = 0;
				var count3 = 0;
				
				for (var c = 0; c < 32; c++) {
					var i = c;
					fns.push([function(callback) {
						setTimeout(function() {
							//console.log(i + ' complete');
							count1++;
							//if (i !== 31) count3++;
							assert.equal(i, 31);
							//
							callback(null, true);
						}, 10) // , 1000)
					}, []]);
				}
				
				// arr, fn
				// arr, num, fn - number is the number of parallel to execute at once.
				call_multiple_callback_functions(fns, 8, function(err, res) {
					if (err){
						throw err;
					} else {
						//console.log('test_async_timeouts_multi_8 all done');
						count2++;
						if (count1 == 32){
							assert.equal(count2, 8);
							done();
						}
					}
				});
				
			}			
			test_async_timeouts_multi_8();
		});
					
	});

	
});
	
