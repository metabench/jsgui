
if (typeof define !== 'function') { var define = require('amdefine')(module) }

// can see if define is defined or not.

// The data enhancements are getting on for fairly large.
//  But will definitely help the project scale.
//  Likely to be integrating b+ trees at a very core level.

define(['../../core/jsgui-lang-enh','assert' ],
function (jsgui, assert) {
    
	// Require a version of JSGUI that includes the input processors for color?
	
	var stringify = jsgui.stringify, Collection = jsgui.Collection;
	var each = jsgui.each;
	
	var call_multiple_callback_functions = jsgui.call_multiple_callback_functions;
	var EDO = jsgui.Enhanced_Data_Object;
	
	var extend = jsgui.extend;
	// Should just serve the documents in place.
	
	// Will use Jasmine testing framework.
	
	// But for the moment, just call some test functions.
	
	// Defining Color here.

	/*
	extend(jsgui.data_types_info, {

        'color': ['indexed_array', [
            ['red', 'number'],
            ['green', 'number'],
            ['blue', 'number']
        ]]
    });
	*/
    // And we need input processors.

    //console.log('* jsgui.input_processors ' + stringify(Object.keys(jsgui.input_processors)));
    




    // But EDO needs to have the most up-to-date input procesors.
    //  And data types info.

    
	describe("jsgui-lang/test-field-collection.spec.js", function() {
	  it("contains spec with an expectation", function() {
	
		var Color = jsgui.map_data_type_data_object_constructors['color'];

		// it looks like the fields are being set wrong.

		// The fields list does not seem to be working right here.

		// The class / constructor has no methods fields().
		//  Maybe it should have them, it could be useful.

		//console.log('Color.fields() ' + stringify(Color.fields()));

        assert.equal(stringify(Color.fields), 'undefined');	
        assert.equal(stringify(Color._fields), '["indexed_array", [["red", "number"], ["green", "number"], ["blue", "number"]]]');	
		
		
		//console.log('Color ' + stringify(Color));

		// Need to work on setting an indexed array.
		//  This could potentially use typed arrays.
		//console.log('--------- pre make red');
		//var red = new Color('#FF0000');
		//console.log('red ' + stringify(red));

		//console.log('');
		//console.log('Color._fields ' + stringify(Color._fields));
		// Those fields actually look OK.





		/*
		var Fill = EDO.extend({
			// And it has got some further input processors.
			//  They need to be in jsgui for this to work.


			// Could refer to a paint-server type object.
			//  This could have a color
			//  It could have a reference to a paint-server type object.
			'fields': [
				['color', 'color']
			],
			//'module_jsgui': this.jsgui;
		});
		Fill.prototype._module_jsgui = jsgui;
		*/
		/*
		var Polygon = EDO.extend({
			'fields': [
				// Want a Collection of point objects? Point object just being [x, y] in an array.
				['fill', Fill]
			]
		});
		*/
		// We should have 'color' in here perhaps?
		//  Though I think it gets put in place in HTML.

		// then test a new fill.
		// So this should set the color of the fill object.
		/*
		var fill_red = new Fill({
			'color': '#FF0000'
		})
		*/

		// This shoudl handle the input processors.



		//console.log('fill_red ' + stringify(fill_red));

		//var color = fill_red.get('color');
		//console.log('color ' + stringify(color));
		//console.log('color._ ' + stringify(color._));
	

		});
	});
	
});
	
