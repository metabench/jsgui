
describe("z_core/essentials/other.spec.js", function () {

    var assert = require('assert');

    // -----------------------------------------------------
    //	test...()
    // -----------------------------------------------------

    it("test...", function () {
        var jsgui_module_name = require.resolve('../../../core/jsgui-lang-essentials');
        delete require.cache[jsgui_module_name];
        //
        var jsgui = require('../../../core/jsgui-lang-essentials');
        jsgui.__test = 1;
    });

    it("test2...", function () {
        //
        var name = require.resolve('../../../core/jsgui-lang-essentials');
        delete require.cache[name];
        //
        var jsgui = require('../../../core/jsgui-lang-essentials');
        assert.equal(jsgui.__test, undefined);
    });

    it("test3...", function () {
        //
        var name = require.resolve('../../../core/jsgui-lang-essentials');
        delete require.cache[name];
        //
        var jsgui = require('../../../core/jsgui-lang-util');
        assert.equal(jsgui.__data_id_method, 'lazy');
    });

    it("test4...", function () {
        //
        var name = require.resolve('../../../core/jsgui-lang-essentials');
        delete require.cache[name];
        //
        var jsgui = require('../../../core/jsgui-lang-essentials');
        assert.equal(jsgui.__data_id_method, undefined);
    });

});

