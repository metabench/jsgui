
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['assert'], function (assert) {

	describe("z_core /test_array_jump.spec.js ", function() {
	
		// -----------------------------------------------------
		//	test_array_jump
		// -----------------------------------------------------
			
		it("test_array_jump", function() {
		
			function arrayJmp(A) {
				var map_been_to_before = {};
				var arr = A;
				var l = arr.length;
				
				// then do the jumping.
				
				var jump_count = 0;
				
				var pawn_location = 0;
				
				
				var do_jump = function() {
					jump_count++;
					// mark the current location
					map_been_to_before[pawn_location] = true;
					
					var jump_value = arr[pawn_location];
					var potential_new_location = pawn_location + jump_value;
					
					// return true if it leaves the array.??
					return potential_new_location;
				}
				
				var stop = false;
				
				while (!stop) {
					
					var potential_new_location = do_jump();
					
					// have we been to that location before?
					if (map_been_to_before[potential_new_location]) {
						return -1;
					}
					
					if (potential_new_location > l - 1) {
						return jump_count;
					}
					if (potential_new_location < 0) {
						return jump_count;
					}
					
					pawn_location = pawn_location + arr[pawn_location];
					
					
				}
				
				
			}

			var res = arrayJmp([2, 3, -1, 1, 3]);
			//console.log('res ' + res);
			assert.equal(res, 4);
		});
					
	});

});

