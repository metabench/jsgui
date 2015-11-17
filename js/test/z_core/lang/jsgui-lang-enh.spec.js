


describe("z_core/lang/jsgui-lang-enh.spec.js", function () {

    var Collection;
    var Enhanced_Data_Object;
    var Data_Object;
    var Data_Value;
    var jsgui_enh;
    var assert;
    var test_utils;

    before(function () {
        Collection = require('../../../core/collection');
        //
        var oldStringAbstract = String.abstract;
        Enhanced_Data_Object = require('../../../core/enhanced-data-object');
        if ((oldStringAbstract === undefined) && (String.abstract === true)) delete String.abstract;
        //
        Data_Object = require('../../../core/data-object');
        Data_Value = require('../../../core/data-value');
        //
        jsgui_enh = require('../../../core/jsgui-lang-enh');
        //jsgui_enh.__data_id_method = 'init';
        //
        assert = require('assert');
        test_utils = require('../../test-utils/test-utils');
    });


    // -----------------------------------------------------
    //	fromObject()
    // -----------------------------------------------------

    it("fromObject() should create Data_Value for numbers", function () {
        assert.deepEqual(jsgui_enh.fromObject(111), new Data_Value({ 'value': 111 }));
        assert.deepEqual(jsgui_enh.fromObject(1.5), new Data_Value({ 'value': 1.5 }));
    });

    it("fromObject() should create Data_Value for strings", function () {
        assert.deepEqual(jsgui_enh.fromObject("some string"), new Data_Value({ 'value': "some string" }));
        assert.deepEqual(jsgui_enh.fromObject(""), new Data_Value({ 'value': "" }));
    });

    it("fromObject() should create Enhanced_Data_Object for objects", function () {
        //
        var actial = jsgui_enh.fromObject({ Field1: 111, Field2: "22" });
        //
        var estimated = new Enhanced_Data_Object();
        estimated.set("Field1", new Data_Value({ 'value': 111 }));
        estimated.set("Field2", new Data_Value({ 'value': "22" }));
        //
        test_utils.assertDeepEqual(actial, estimated);
    });

    it("fromObject() should create Collection for arrays", function () {
        var actial = jsgui_enh.fromObject([111, "22"]);
        //
        var estimated = new Collection();
        estimated.push(new Data_Value({ 'value': 111 }));
        estimated.push(new Data_Value({ 'value': "22" }));
        //
        test_utils.assertDeepEqual(actial, estimated);
    });

    it("fromObject() should returns undefined for other", function () {
        test_utils.assertDeepEqual(jsgui_enh.fromObject(null), undefined);
        test_utils.assertDeepEqual(jsgui_enh.fromObject(undefined), undefined);
        test_utils.assertDeepEqual(jsgui_enh.fromObject(function () { }), undefined);
    });


});



