if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../core/jsgui-lang-util', 'assert', '../test-utils/test-utils'],
function (jsgui, assert, test_utils) {

	describe("z_core /test_stringify.spec.js ", function() {
	
		// -----------------------------------------------------
		//	circular references
		// -----------------------------------------------------
			
		it("must skip circular references", function() {
		
			var myObj = { ref: null };
			myObj.ref = myObj;
			
			var s = jsgui.stringify(myObj);
			//console.log("s=" + s);		
			assert.equal(s, '{"ref": (CircularRef)}');
		});
					
	});
	
});	