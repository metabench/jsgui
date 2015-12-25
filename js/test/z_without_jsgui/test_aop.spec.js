
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['assert'], function (assert) {

	describe("z_core /test_aop.spec.js ", function() {
	
		// -----------------------------------------------------
		//	isAnagramOfPalindrome
		// -----------------------------------------------------
			
		it("isAnagramOfPalindrome", function() {
		
			function isAnagramOfPalindrome(S) {
			  var s = S;
			  var arr_chars = [];
			  for (var c = 0, l = s.length; c < l; c++) {
				arr_chars.push(s.substr(c, 1));
			  }
			  arr_chars.sort();
			  //console.log('arr_chars ' + stringify(arr_chars));
			  //console.log('arr_chars ' + arr_chars);
			  
			  // put together the map of number of occurrances.
			  //  maybe array will be better?
			  //  map ! ! !
			  
			  var map_num_letter_occurrances = {};
			  for (var c = 0, l = arr_chars.length; c < l; c++) {
				var ch = arr_chars[c];
				if (map_num_letter_occurrances[ch]) {
					map_num_letter_occurrances[ch]++;
				} else {
					map_num_letter_occurrances[ch] = 1;
				}
			  }
			  
			  var count_even = 0;
			  var count_odd = 0;
			  
			  var isOdd = function(num) {
				return num % 2;
			  }
			  
			  for (var ch in map_num_letter_occurrances) {
				var num = map_num_letter_occurrances[ch];
				if (isOdd(num)) {
					count_odd++;
				} else {
					count_even++;
				}
				
				//console.log('ch ' + ch);
				//console.log('num ' + num);
			  }
			  
			  //console.log('count_even ' + count_even);
			  //console.log('count_odd ' + count_odd);
			  
			  if (count_odd < 2) {
				return 1;
			  } else {
				return 0;
			  }
			  
			}

			var res1 = isAnagramOfPalindrome('aoeoa');
			var res2 = isAnagramOfPalindrome('james');
			
			//console.log('res ' + res);
		    assert.equal(res1, 1);
		    assert.equal(res2, 0);
		});
					
	});

});
