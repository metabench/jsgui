
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../web/jsgui-html', '../../web/controls/advanced/jsgui-vector', 'assert'], 
function (jsgui, Vector, assert) {
	
	var stringify = jsgui.stringify, Collection = jsgui.Collection;
	var each = jsgui.each, tof = jsgui.tof;
	var call_multi = jsgui.call_multi;
	
	var context = new jsgui.Mini_Context();

	var Polygon = Vector.Polygon;
	
	describe("jsgui-vector /test-jsgui-vector.spec.js ", function() {
	
		// -----------------------------------------------------
		//	test_vector
		// -----------------------------------------------------
			
		it("test_vector", function(done) {
				
			var test_vector = function() {

				// If the radio button is not given a context, it could possibly create its own and return that?

				// Could have the labelled radio button's content be some kind of internal content.
				var poly1 = new Polygon({
					'points': [[5, 0], [0, 5], [3, 15]],
					'stroke': '#FF0000',
					'fill': '#ABCDEF'
				});

				//console.log('poly1 ' + stringify(poly1));
				assert.equal(stringify(poly1), 'Data_Object({"points": [[5, 0], [0, 5], [3, 15]], "stroke": "#FF0000", "fill": "#ABCDEF"})');

				var points = poly1.get('points');
				//console.log('points ' + stringify(points));
				assert.equal(stringify(points), '[[5, 0], [0, 5], [3, 15]]');

				var stroke = poly1.get('stroke');
				// It should create an object of the right type when it retrieves it.
				//  Should be a Stroke Data_Object
				//console.log('stroke ' + stringify(stroke));
				assert.equal(stringify(stroke), '"#FF0000"');  // seems wrong!!!!!!!! (not a Data_Object)

				// but then when we want to render the Vector object...
				//  will render to SVG by default.

				done();			
			}
			test_vector();
			
			// And want to test the radio buttons on a server, then enhanced on the client.
			//  Having the client document get jsgui-html and the various controls...
			//   But we can specify specifically which controls it needs, though the html controls are likely to be put in one file when stable.

			// Want a test document as well... that would be useful for HTML testing.
		
		
		});
					
	});
	
	




	

});
	
