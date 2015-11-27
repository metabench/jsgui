	describe("z_core/integral/temp.spec.js ", function() {


	    var jsgui;
	    var Data_Structures;
	    var Data_Value;
	    var Collection_Index;
	    var assert;
	    var test_utils;
	    var toText;
	    var Data_Object;
	    var html_core;
	    var Enhanced_Data_Object;

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
	        Enhanced_Data_Object = require('../../../core/enhanced-data-object');
	    });


	    // -----------------------------------------------------
	    //	test...
	    // -----------------------------------------------------

	    it("test... ", function () {
	    });

	    describe("part1", function () {

	        it("test11", function () {
	        });
	        it("test12 ", function () {
	        });

	        describe("part12", function () {

	            it("test121", function () {
	            });
	            it("test122 ", function () {
	            });

	        });

	    });

	    describe("part2", function () {

	        it("test21", function () {
	        });
	        it("test22 ", function () {
	        });

	    });

	});
	
