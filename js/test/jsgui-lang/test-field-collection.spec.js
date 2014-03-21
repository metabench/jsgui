
if (typeof define !== 'function') { var define = require('amdefine')(module) }

// can see if define is defined or not.

// The data enhancements are getting on for fairly large.
//  But will definitely help the project scale.
//  Likely to be integrating b+ trees at a very core level.


// This is testing a facility of the Data_Object.
//  It needs to be told which fields it is holding.
//   Not so sure it holds the actual field values.

// But we create a fields_collection with some fields, then test to see what fields it holds.


define(['../../core/jsgui-lang-enh', 'assert'],
function (jsgui, assert) {
    
	// Require a version of JSGUI that includes the input processors for color?
	//  This class will be useful for testing and documenting how the Fields_Collection works.
	//  It is internal to the Data_Object, and it makes sense to have a good understanding about it.
	//  Fields will allow code to be written in less time and more concisely.

	var stringify = jsgui.stringify, Collection = jsgui.Collection;
	var each = jsgui.each;
	
	var call_multiple_callback_functions = jsgui.call_multiple_callback_functions;
	var EDO = jsgui.Enhanced_Data_Object;
	
	var extend = jsgui.extend;
	// Should just serve the documents in place.
	
	// Will use Jasmine testing framework.
	
	// But for the moment, just call some test functions.
	
	// Defining Color here.

	describe("jsgui-lang/test-field-collection.spec.js", function() {
	
	
	  it("test_Fields_Collection", function() {
		var FC = jsgui.Data_Object.Fields_Collection;

		//console.log('FC ' + FC);

		// And can give it the fields immediately in initialization.
		var fc = new FC();


		fc.set(['my_item_name', 'string']);

		// then how many fields are there?
		//  Fields_Collection may need more work and definition.

		// fc.fields();
		//  should be fc.get();


		var got = fc.fields();
        assert.equal(got.length, 1);	

		//each(got, function(i, item) {
		//	console.log('item ' + stringify(item));
		//});
        assert.equal(stringify(got[0]), '["my_item_name", "string", {"data_type": "string"}]');	
		
	  });
	

	// Should fairly easily be able to look at the fields of an object.




	//console.log('fc ' + stringify(fc));
	//  Set is quite a complicated function.
	//   It would be getting chained fields, or something similar to that.

	//  We need to make sure we understand the chained fields format and field chaining.

	// fc.set


	// Should have some documentation about the Fields_Collection API.
	//  Do want some code that automatically generates the documentation.
	//  Would read source code written how I write it, and extract class names and various other things.
	//   I think some automated markdown that gets generated from the code would be good.
	//    And then there could be markdown -> html processing, that would not be so hard to do, there must be a node module already.
	//     A documentation server on the server could be very useful.
	//      And it may be possible to edit documentation in the markdown document as well.
	//       Using the standard format of markdown makes sense.
	//  Maybe doing that makes more sense once fields are working???
	//   Or a simple markdown editor could be made already with this?
	
	
	
	
	/*
	extend(jsgui.data_types_info, {

        'color': ['indexed_array', [
            ['red', 'number'],
            ['green', 'number'],
            ['blue', 'number']
        ]]
    });
	*/
	
	// ---------------------------------------------------------
	// the following test is skipped because the jsgui.input_processors value seems depending of some side effect
	// ---------------------------------------------------------
	
	  /*it("input_processors", function() {
		// And we need input processors.
        expect(stringify(Object.keys(jsgui.input_processors))).toEqual('["optional_array", "indexed_array", "n_units", "color"]');	
	  });*/
	

    // But EDO needs to have the most up-to-date input procesors.
    //  And data types info.

	});
    
});
	
