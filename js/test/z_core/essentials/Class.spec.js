

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/jsgui-lang-essentials', 'assert', '../../test-utils/test-utils'],
function (jsgui, assert, test_utils) {

    var Class = jsgui.Class;

	describe("z_core/essentials/Class.spec.js", function() {
	
		// -----------------------------------------------------
		//	John Resig tests
		// -----------------------------------------------------
			
		it("should pass John Resig tests", function() {

            var Person = Class.extend({
              init: function(isDancing){
                this.dancing = isDancing;
              },
              dance: function(){
                return this.dancing;
              }
            });
 
            var Ninja = Person.extend({
              init: function(){
                this._super( false );
              },
              dance: function(){
                // Call the inherited version of dance()
                return this._super();
              },
              swingSword: function(){
                return true;
              }
            });
 
            var p = new Person(true);
            //p.dance(); // => true
			assert.equal(p.dance(), true);
 
            var n = new Ninja();
            //n.dance(); // => false
			assert.equal(n.dance(), false);
            //n.swingSword(); // => true
			assert.equal(n.swingSword(), true);
 
            // Should all be true
            //p instanceof Person && p instanceof Class &&
            //n instanceof Ninja && n instanceof Person && n instanceof Class
			assert.equal(p instanceof Person, true);
			assert.equal(p instanceof Class, true);
			assert.equal(n instanceof Ninja, true);
			assert.equal(n instanceof Person, true);
			assert.equal(n instanceof Class, true);
		});
					
		// -----------------------------------------------------
		//	(name.charAt(0) === '#') addition
		// -----------------------------------------------------
			
		it("should extend the original Class by the custom addition...", function() {

            var Person = Class.extend({
                'prop1': 111,
                'prop2': 222
            });
 
            var Ninja = Person.extend({
                'prop3': 333,
                '#prop4': 'prop2'
            });

            var p = new Person(true);
            var n = new Ninja();

			assert.equal(n['prop4'], 222);
			assert.equal(n.prop4, 222);

			assert.equal(p.prop1, 111);
			assert.equal(p.prop2, 222);
			assert.equal(p.prop3, undefined);
			assert.equal(p.prop4, undefined);
			assert.equal(p['#prop4'], undefined);

			assert.equal(n.prop1, 111);
			assert.equal(n.prop2, 222);
			assert.equal(n.prop3, 333);
			assert.equal(n.prop4, 222);
			assert.equal(n.prop5, undefined);
		});
					
					
	});

});


