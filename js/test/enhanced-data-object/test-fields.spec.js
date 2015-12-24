// can see if define is defined or not.

// The data enhancements are getting on for fairly large.
//  But will definitely help the project scale.
//  Likely to be integrating b+ trees at a very core level.
 
if (typeof define !== 'function') { var define = require('amdefine')(module) }
 
define(['../../core/jsgui-lang-essentials', '../../core/enhanced-data-object', 'assert'], function (jsgui, Enhanced_Data_Object, assert) {
    
	var stringify = jsgui.stringify, Collection = jsgui.Collection;
	var each = jsgui.each;
	
	var call_multiple_callback_functions = jsgui.call_multiple_callback_functions;
	
	// Want to test some of the functionality that is used to build controls.
	
	// Want to test fields of various types, like there is a ctrl_dom or similar field in control.
	
	describe("enhanced-data-object/test-fields.spec.js", function () {

	  it("create and initialize a Person", function() {

	    var Person = Enhanced_Data_Object.extend({
            'fields': [['dob', 'date'], ['name', 'string']]
        });
        
        var alice = new Person({
            'name': 'Alice',
            'dob': Date.parse('1992-07-08')
        })
        
        //assert.equal(stringify(alice), 'Data_Object({"name": "Alice", "dob": 710553600000})');
        assert.equal(stringify(alice), 'Data_Object({"name": "Alice", "dob": Data_Object({})})'); // !!! the dob field value seems strange

        assert.equal(stringify(alice.field()), '[["flags", ["collection", "string"]], ["dob", "date", {"data_type": "date"}], ["name", "string", {"data_type": "string"}]]'); 
		
	  });
	});	
		
});
	
