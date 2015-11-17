    
describe("z_core /test_enhanced_data_object.spec.js ", function() {
	

    var jsgui;
    var assert;

    var stringify;
    var Enhanced_Data_Object;

    before(function () {
        var oldStringAbstract = String.abstract;
        jsgui = require('../../../core/jsgui-lang-enh');
        if ((oldStringAbstract === undefined) && (String.abstract === true)) delete String.abstract;
        //
        assert = require('assert');
        //
        stringify = jsgui.stringify;
        Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
    });


    // -----------------------------------------------------
	//	test flags
	// -----------------------------------------------------
			
	it("test flags", function () {
	    var edo = new Enhanced_Data_Object();
	    var flags = edo.get('flags');
	    assert.equal(stringify(flags), "Collection()");
        //
	    flags.add('selectable');
	    flags.add('resizable');
	    assert.equal(stringify(flags), 'Collection("selectable", "resizable")');
	    //
	    // the Enhanced_Data_Object() constructor does not set data_type constraint
	    // for the "flags" collection. 
        // So, flags.has() result is always undefined:
	    assert.equal(flags._data_type_constraint, undefined);
	    assert.equal(flags.has('selectable'), undefined);
	    assert.equal(flags.has('resizable'), undefined);
	    //
        //
	    // the Enhanced_Data_Object() constructor does not set indexes
	    // for the "flags" collection. 
	    // So, flags.remove() throws an error:
	    assert.throws(function(){ flags.remove('selectable');});
	    // must be: assert.equal(stringify(flags), 'Collection("resizable")');
        //
	    assert.equal(flags.has('selectable'), undefined);
	    assert.equal(flags.has('resizable'), undefined);
        //
	    edo.add_flag('hidden');
	    assert.equal(stringify(flags), 'Collection("selectable", "resizable", "hidden")');
	});


});
	
	