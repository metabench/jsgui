
var jsgui = require('../../../../../js/web/jsgui-html-client');
var Client_Page_Context = require('../../../../../js/web/client-page-context');
//var Toggle_Button = require('../../../../../js/web/controls/advanced/toggle-button');
//var Start_Stop_Toggle_Button = require('../../../../../js/web/controls/advanced/start-stop-toggle-button');

var each = jsgui.each, stringify = jsgui.stringify;

var pc = new Client_Page_Context({
    'document': document
});

//pc.update_Controls('toggle_button', Toggle_Button);
//pc.update_Controls('start_stop_toggle_button', Start_Stop_Toggle_Button);


window.onload = function() {
    console.log('pre activate');

    jsgui.activate(pc);


}
