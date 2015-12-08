
var jsgui = require('../../../../../js/web/jsgui-html-client');
var Client_Page_Context = require('../../../../../js/web/client-page-context');
var Radio_Button_Group = require('../../../../../js/web/controls/advanced/radio-button-group');
var Radio_Button = require('../../../../../js/web/controls/advanced/radio-button');
var Tabs = require('../../../../../js/web/controls/advanced/tabs');
var Panel = require('../../../../../js/web/controls/advanced/panel');

//var Start_Stop_Toggle_Button = require('../../../../../js/web/controls/advanced/start-stop-toggle-button');

var each = jsgui.each, stringify = jsgui.stringify;

var pc = new Client_Page_Context({
    'document': document
});

//pc.update_Controls('toggle_button', Toggle_Button);
pc.update_Controls('radio_button_group', Radio_Button_Group);
pc.update_Controls('radio_button', Radio_Button);
pc.update_Controls('tabs', Tabs);
pc.update_Controls('panel', Panel);

window.onload = function() {
    //console.log('pre activate');

    jsgui.activate(pc);


}
