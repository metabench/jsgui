
var jsgui = require('../../../../../js/web/jsgui-html-client');
var Client_Page_Context = require('../../../../../js/web/client-page-context');
var Titled_Panel = require('../../../../../js/web/controls/advanced/titled-panel');
var List = require('../../../../../js/web/controls/advanced/list');

var Button = require('../../../../../js/web/controls/advanced/button');
var Toggle_Button = require('../../../../../js/web/controls/advanced/toggle-button');
var Start_Stop_Toggle_Button = require('../../../../../js/web/controls/advanced/start-stop-toggle-button');
var Multi_Layout_Mode = require('../../../../../js/web/controls/advanced/multi-layout-mode');

var each = jsgui.each, stringify = jsgui.stringify;

var pc = new Client_Page_Context({
    'document': document
});

pc.update_Controls('panel', Panel);
pc.update_Controls('titled_panel', Titled_Panel);
pc.update_Controls('list', List);
pc.update_Controls('button', Button);
pc.update_Controls('toggle_button', Toggle_Button);
pc.update_Controls('start_stop_toggle_button', Start_Stop_Toggle_Button);
pc.update_Controls('multi_layout_mode', Multi_Layout_Mode);
pc.update_Controls('object_kvp_editor', Object_KVP_Editor);
pc.update_Controls('string_editor', String_Editor);
pc.update_Controls('number_editor', Number_Editor);
pc.update_Controls('up_down_arrow_buttons', Up_Down_Arrow_Buttons);
pc.update_Controls('window', Window);
pc.update_Controls('horizontal_menu', Horizontal_Menu);
pc.update_Controls('menu_node', Menu_Node);


window.onload = function() {
    console.log('pre activate');

    jsgui.activate(pc);
}
