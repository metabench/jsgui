
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['assert'], function (assert) {

	describe("z_core /test_equi.spec.js ", function() {
	
		// -----------------------------------------------------
		//	test_equi
		// -----------------------------------------------------
			
		it("test_equi", function() {
		
			function equi ( A ) {
			  var a = A;
			  var map_total_above = {};
			  var map_total_below = {};
			  
			  var total_below = 0;
			  var prev_below = 0;
			  for (var c = 0, l = a.length; c < l; c++) {
				total_below = total_below + prev_below;
				map_total_below[c] = total_below;
				prev_below = a[c];
			  }
			  
			  var total_above = 0;
			  var prev_above = 0;
			  for (var c = a.length - 1; c >= 0; c--) {
				total_above = total_above + prev_above;
				map_total_above[c] = total_above;
				prev_above = a[c];
			  }
			  
			  for (var c = 0, l = a.length; c < l; c++) {
				var is_equilibrium = (map_total_above[c] === map_total_below[c])
				if (is_equilibrium) return c;
					
			  }
			  return -1;
			  
			  
			}

			var res = equi([-7, 1, 5, 2, -4, 3, 0]);
			//console.log('res ' + res);		
			assert.equal(res, 3);
		});
					
	});

});
	
