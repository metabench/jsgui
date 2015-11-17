

	describe("z_core/side-effects/collection_string.spec.js ", function () {

	    var jsgui;
	    var test_utils;

	    var stringify;
	    var Collection;
	    var Data_Object;

	    before(function () {
	        //var jsgui_module_name = require.resolve('../../../core/jsgui-lang-essentials');
	        //delete require.cache[jsgui_module_name];
	        //var util_module_name = require.resolve('../../../core/jsgui-lang-util');
	        //delete require.cache[util_module_name];
	        var edo_module_name = require.resolve('../../../core/enhanced-data-object');
	        delete require.cache[edo_module_name];
	        //var data_object_module_name = require.resolve('../../../core/data-object');
	        //delete require.cache[data_object_module_name];
            //
	        jsgui = require('../../../core/jsgui-lang-util');
	        test_utils = require('../../test-utils/test-utils');
            //
	        stringify = jsgui.stringify;
	        Collection = jsgui.Collection;
	        Data_Object = jsgui.Data_Object;
	    });

	    // -----------------------------------------------------
	    //	test Collection(String)
	    // -----------------------------------------------------

	    it("test Collection(String)", function () {
	        //
            // everything is ok:
	        test_utils.assertDeepEqual(String.abstract, undefined);
	        test_utils.assertDeepEqual(stringify(new Data_Object(String)), "Data_Object({})");
	        test_utils.assertDeepEqual(stringify(new Collection(String)), "Collection()");
	        //
	        // Collection(String) call sets String.abstract = true:
	        var abstract_collection = Collection(String);
	        //
            // now it's broken:
	        test_utils.assertDeepEqual(String.abstract, true);
	        test_utils.assertDeepEqual(stringify(new Data_Object(String)), "Data_Object(undefined)");
	        test_utils.assertDeepEqual(stringify(new Collection(String)), "~Collection(String)");
	        //
            // fix back:
	        delete String.abstract;
	        //
            // now it's fixed:
	        test_utils.assertDeepEqual(String.abstract, undefined);
	        test_utils.assertDeepEqual(stringify(new Data_Object(String)), "Data_Object({})");
	        test_utils.assertDeepEqual(stringify(new Collection(String)), "Collection()");
	    });

	    it("test require('../../../core/enhanced-data-object')", function () {
	        //
	        // everything is ok:
	        test_utils.assertDeepEqual(String.abstract, undefined);
	        test_utils.assertDeepEqual(stringify(new Data_Object(String)), "Data_Object({})");
	        test_utils.assertDeepEqual(stringify(new Collection(String)), "Collection()");
	        //
	        // require('enhanced-data-object') calls Collection(String) inside, and sets String.abstract = true:
	        var Enhanced_Data_Object = require('../../../core/enhanced-data-object');
	        //
	        // now it's broken:
	        test_utils.assertDeepEqual(String.abstract, true);
	        test_utils.assertDeepEqual(stringify(new Data_Object(String)), "Data_Object(undefined)");
	        test_utils.assertDeepEqual(stringify(new Collection(String)), "~Collection(String)");
	        //
	        // fix back:
	        delete String.abstract;
	        //
	        // now it's fixed:
	        test_utils.assertDeepEqual(String.abstract, undefined);
	        test_utils.assertDeepEqual(stringify(new Data_Object(String)), "Data_Object({})");
	        test_utils.assertDeepEqual(stringify(new Collection(String)), "Collection()");
	    });



	});
	
