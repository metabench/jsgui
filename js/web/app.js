
var jsgui = require('../../../ws/js/web/jsgui-html-client');
var Client_Page_Context = require('../../../ws/js/web/client-page-context');
//var Web_Admin = require('../../../../ws/js/web/controls/advanced/web-admin');
//var Web_Admin_Images = require('../../../../ws/js/web/controls/advanced/web-admin-images');
//var Web_Admin_Flexidocs = require('../../../../ws/js/web/controls/advanced/web-admin-flexidocs');
//var Flexidoc_Editor = require('../../../../ws/js/web/controls/advanced/flexidoc-editor');
//var Flexidoc_Editor_Main = require('../../../../ws/js/web/controls/advanced/flexidoc-editor-main');
//var Flexidoc_Container = require('../../../../ws/js/web/controls/advanced/flexidoc-container');
//var Flexidoc_Component_Text = require('../../../../ws/js/web/controls/advanced/flexidoc-component-text');
//var Flexidoc_Component_Image = require('../../../../ws/js/web/controls/advanced/flexidoc-component-image');

var Panel = require('../../../ws/js/web/controls/advanced/panel');
var Titled_Panel = require('../../../ws/js/web/controls/advanced/titled-panel');
var List = require('../../../ws/js/web/controls/advanced/list');

var Button = require('../../../ws/js/web/controls/advanced/button');
var Multi_Layout_Mode = require('../../../ws/js/web/controls/advanced/multi-layout-mode');


//console.log('Bounds_Specifier', Bounds_Specifier);

//var File_Upload = require('../../../../ws/js/web/controls/advanced/file-upload');

var Object_KVP_Editor = require('../../../ws/js/web/controls/advanced/editor/object-kvp');
var String_Editor = require('../../../ws/js/web/controls/advanced/editor/basic/string');
var Number_Editor = require('../../../ws/js/web/controls/advanced/editor/basic/number');

Up_Down_Arrow_Buttons = require('../../../ws/js/web/controls/advanced/editor/basic/up-down-arrow-buttons');

var each = jsgui.each, stringify = jsgui.stringify;

var pc = new Client_Page_Context({
    'document': document
});

pc.update_Controls('panel', Panel);
pc.update_Controls('titled_panel', Titled_Panel);
pc.update_Controls('list', List);
pc.update_Controls('button', Button);
pc.update_Controls('multi_layout_mode', Multi_Layout_Mode);
pc.update_Controls('bounds_specifier', Main_Bounds_Specifier);
pc.update_Controls('page_bounds_specifier', Page_Bounds_Specifier);
pc.update_Controls('object_kvp_editor', Object_KVP_Editor);
pc.update_Controls('string_editor', String_Editor);
pc.update_Controls('number_editor', Number_Editor);
pc.update_Controls('up_down_arrow_buttons', Up_Down_Arrow_Buttons);




//pc.update_Controls('web_admin', Web_Admin);
//pc.update_Controls('web_admin_images', Web_Admin_Images);
//pc.update_Controls('web_admin_flexidocs', Web_Admin_Flexidocs);


// Maybe make this into a 3 layout zone page control.
//  Main area (graph)
//  Tools / controls
//   Tools for drawing specific bounds
//    Top and bottom, with a bounds gap.
//   Select the tool, then there will be a tool_details or tool parameters ares (like in Photoshop)
//   Run the GA
//    2 buttons
//     GA Express, runs the GA
//      shows the settings
//      possibly right click on GA Express to choose a GA / GA parameters
//     GA with settings
//      Maybe stop GA, pause?
//      Stop and start?
//   Hand tool will be useful for navigating / moving.




//  Result data / (navigation)
//   A way of showing a list of actual occurrances?
//   Probably better to show them on the graph.
//    Could show a breakdown of time and company for occurrances.



// Priorities
//  Tools menu
//   Will enable a control system for saving + viewing info





//pc.update_Controls('file_upload', File_Upload);
//pc.update_Controls('flexidoc_editor', Flexidoc_Editor);
//pc.update_Controls('flexidoc_editor_main', Flexidoc_Editor_Main);
//pc.update_Controls('flexidoc_container', Flexidoc_Container);
//pc.update_Controls('flexidoc_component_text', Flexidoc_Component_Text);
//pc.update_Controls('flexidoc_component_image', Flexidoc_Component_Image);


// only when the page has loaded....



window.onload = function() {
    // Let's show the omega Ω
    console.log('pre activate');

    jsgui.activate(pc);
}
