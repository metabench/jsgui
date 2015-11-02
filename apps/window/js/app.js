
var jsgui = require('../../../js/web/jsgui-html-client');
var Client_Page_Context = require('../../../js/web/client-page-context');
//var Web_Admin = require('../../../../ws/js/web/controls/advanced/web-admin');
//var Web_Admin_Images = require('../../../../ws/js/web/controls/advanced/web-admin-images');
//var Web_Admin_Flexidocs = require('../../../../ws/js/web/controls/advanced/web-admin-flexidocs');
//var Flexidoc_Editor = require('../../../../ws/js/web/controls/advanced/flexidoc-editor');
//var Flexidoc_Editor_Main = require('../../../../ws/js/web/controls/advanced/flexidoc-editor-main');
//var Flexidoc_Container = require('../../../../ws/js/web/controls/advanced/flexidoc-container');
//var Flexidoc_Component_Text = require('../../../../ws/js/web/controls/advanced/flexidoc-component-text');
//var Flexidoc_Component_Image = require('../../../../ws/js/web/controls/advanced/flexidoc-component-image');

var Panel = require('../../../js/web/controls/advanced/panel');
var Titled_Panel = require('../../../js/web/controls/advanced/titled-panel');
var List = require('../../../js/web/controls/advanced/list');
var Window = require('../../../js/web/controls/advanced/window');
var Horizontal_Menu = require('../../../js/web/controls/advanced/horizontal-menu');

var Button = require('../../../js/web/controls/advanced/button');
var Multi_Layout_Mode = require('../../../js/web/controls/advanced/multi-layout-mode');
var Menu_Node = require('../../../js/web/controls/advanced/menu-node');


var Object_KVP_Editor = require('../../../js/web/controls/advanced/editor/object-kvp');
var String_Editor = require('../../../js/web/controls/advanced/editor/basic/string');
var Number_Editor = require('../../../js/web/controls/advanced/editor/basic/number');

var Up_Down_Arrow_Buttons = require('../../../js/web/controls/advanced/editor/basic/up-down-arrow-buttons');

var each = jsgui.each, stringify = jsgui.stringify;

var pc = new Client_Page_Context({
    'document': document
});

pc.update_Controls('panel', Panel);
pc.update_Controls('titled_panel', Titled_Panel);
pc.update_Controls('list', List);
pc.update_Controls('button', Button);
pc.update_Controls('multi_layout_mode', Multi_Layout_Mode);
pc.update_Controls('object_kvp_editor', Object_KVP_Editor);
pc.update_Controls('string_editor', String_Editor);
pc.update_Controls('number_editor', Number_Editor);
pc.update_Controls('up_down_arrow_buttons', Up_Down_Arrow_Buttons);
pc.update_Controls('window', Window);
pc.update_Controls('horizontal_menu', Horizontal_Menu);
pc.update_Controls('menu_node', Menu_Node);




window.onload = function() {
    // Let's show the omega Ω
    console.log('pre activate');

    jsgui.activate(pc);
}
