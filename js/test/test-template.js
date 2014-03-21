
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../core/jsgui-lang-enh', 'assert', '../test-utils/test-utils'],
function (jsgui, assert, test_utils) {

	describe("aaaaaaaaa/bbbbbbbbbbbbbb", function() {
	
		beforeEach(function(){
			process.chdir(__dirname);  
		});
	
		// -----------------------------------------------------
		//	xxxxxx
		// -----------------------------------------------------
			
		it("xxxxxx", function(done) {
			assert.equal(11111, 11111);
			done();
		});
					
	});


	
	// ------------------------------------
	
		it("xxxxxx", function() {
		
		});
		
		
		it("yyyyyyyyy", function() {
			expect(foo).toEqual(1);
		});


		it("zzzzzzzzzzz", function(done) {
		
			setTimeout(function(){
			  expect('second').toEqual('second');
			  // If you call done() with an argument, it will fail the spec 
			  // so you can use it as a handler for many async node calls
			  done();
			}, 1);
			//
			expect('first').toEqual('first');
	
		});
		
	// ------------------------------------
	
	
	
	
	
});


