
describe("jsgui-html/test-abstract-controlst.spec.js", function () {

    var jsgui;
    var Radio_Button;
    var assert;

    before(function () {
        jsgui = require('../../web/jsgui-html');
        Radio_Button = require('../../web/controls/basic/radio-button');
        assert = require('assert');
    });

    it("!!! test_Abstract_radio", function () {

        var tof = jsgui.tof;
        //var abstract_div = jsgui.div({

        //})

        var abstract_radio = Radio_Button({
            // May want to set the date or a range of dates... selected dates.
            'group_name': 'groupB',
            'checked': true,
            'value': 'rdo',
            'id': true
        });

        //console.log('abstract_radio ' + abstract_radio);
        assert.deepEqual(jsgui.stringify(abstract_radio), 'Control({"dom": Data_Object({"tagName": "div"}), "content": Collection(), "size": undefined})');

        //console.log('tof(abstract_radio) ' + tof(abstract_radio));
        assert.deepEqual(tof(abstract_radio), 'control');

        // then we should be able to make an instance of it.
        //make(abstract_radio);
        // Make will have the context as well.
        //nu(abstract_radio) - would be able to choose the function's name when it is given as a param to a function.
        // nu would be a shorthand.

        // then context.make(abstract_radio) will construct it.

        // Could define a mini-context.
        //  That minicontext would have a make function.

        //console.log(abstract_radio instanceof Radio_Button);
        assert.deepEqual(abstract_radio instanceof Radio_Button, true);

        //console.log(new abstract_radio.constructor({}) instanceof Radio_Button);
        //throw '!!stop';


        var mc = new jsgui.Mini_Context();

        // !!! throws error
        assert.throws(function () { mc.make(abstract_radio); }, /stop Mini_Context typed id/);

        // !!! skipped:
        //var radio = mc.make(abstract_radio);
        //console.log('radio ' + radio);
        //
        // then render it...
        //var html = radio.all_html_render();
        //console.log('html ' + html);


    });

});