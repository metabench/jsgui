	describe("z_core/integral/temp.spec.js ", function() {


	    var jsgui;
	    var Data_Structures;
	    var Data_Value;
	    var Collection_Index;
	    var assert;
	    var test_utils;
	    var toText;
	    var Data_Object;

	    before(function () {
	        var jsgui_module_name = require.resolve('../../../core/jsgui-lang-essentials');
	        delete require.cache[jsgui_module_name];

	        jsgui = require('../../../core/jsgui-lang-util');
	        Data_Structures = require('../../../core/jsgui-data-structures');
	        Data_Value = require('../../../core/data-value');
	        Collection_Index = require('../../../core/collection-index');
	        assert = require('assert');
	        test_utils = require('../../test-utils/test-utils');
	        toText = require('../../test-utils/toText');
	        Data_Object = require('../../../core/data-object');
	        html_core = require('../../../web/jsgui-html-core.js');
	    });


	    // -----------------------------------------------------
	    //	test...
	    // -----------------------------------------------------

	    it("test... ", function () {

	        var control = new html_core.Control();
	        console.log(control.dom_attributes);
	        //var Book = function (obj) { this.title = obj.bookTitle; this.objtype = "Book"; };

	        //var data_object = new Data_Object();
	        //data_object.set_field("field1", [Book]);
	        //
	        ////
	        //collection.constraint(Book);
	        ////
	        ////
	        //var value = collection.push({ bookTitle: "The Little Prince" });
	        ////
	        //// the value is converted into Book, but not added to the collection:
            ////
	        //test_utils.assertDeepEqual(value, new Book({ bookTitle: "The Little Prince" }));
	        //test_utils.assertDeepEqual(stringify(collection), 'Collection()');
	        //test_utils.assertDeepEqual(collection.length(), 0);
	    });


	});
	
