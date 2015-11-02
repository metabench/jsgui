
var jsgui = require('../../../js/web/jsgui-html-client');
var Client_Page_Context = require('../../../js/web/client-page-context');
//var Web_Admin = require('../../../../js/web/controls/advanced/web-admin');
//var Web_Admin_Images = require('../../../../js/web/controls/advanced/web-admin-images');
//var Web_Admin_Flexidocs = require('../../../../js/web/controls/advanced/web-admin-flexidocs');
//var Flexidoc_Editor = require('../../../../js/web/controls/advanced/flexidoc-editor');
//var Flexidoc_Editor_Main = require('../../../../js/web/controls/advanced/flexidoc-editor-main');
//var Flexidoc_Container = require('../../../../js/web/controls/advanced/flexidoc-container');
//var Flexidoc_Component_Text = require('../../../../js/web/controls/advanced/flexidoc-component-text');
//var Flexidoc_Component_Image = require('../../../../js/web/controls/advanced/flexidoc-component-image');

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
var Default_Page = require('./default-page');
var each = jsgui.each, stringify = jsgui.stringify;
var Client_Sock_Resources_Proxy = require('../../../js/resource/core/sock-client-resources-proxy');
var Client_Sock_Resource = require('../../../js/resource/core/sock-client-resource');



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
pc.update_Controls('default_page', Default_Page);


// Need to set up a Linux_System resource that makes requests to the Linux system on the server.
// Could have more things automatically wired on the client.





// Could make a different type of client side resource that connects to the resource with the already open Socks connection rather than making new HTTP connections.



//var linux_system = new




window.onload = function() {
    // Let's show the omega Ω
    console.log('pre activate');

    // Don't have the client-side websockets set up automatically.

    // Should set it up from within the framework, or switch it on.
    //  The Sock_Resource_Connector would allow connection from the client to the resources that support sock connections.
    //   Then local client-side sock proxied resources would take that Sock_Resource_Connector in their constructor - or can get it from the context.
    //   It would be one of the resources that live within the resource pool.


    // start a sock_resource_connector, then various resource instances.

    // The user interface controls would then be able to access resource data with the same function call syntax both on the client and on the server.

    var rp = pc.resource_pool;

    var csrp = new Client_Sock_Resources_Proxy({'meta': {
        'name': 'Sock Resources Proxy'
    }});

// Then a client side resource that deals with the server's (linux) config.
//  However, we don't reference the resource itself.
//  The resource would have an address on the server. It will look at the first part of the path to find which resource it needs to route it to, and then gives that resource the
//   truncated URL for it to process. Likely to go via a Sock_Resource_Publisher on the server.

    var linux_resource = new Client_Sock_Resource({'meta': {
        'name': 'Linux System'
    }});


    rp.add(csrp);
    rp.add(linux_resource);

    setTimeout(function() {
        /*
        linux_resource.get('usb', function(err, res_usb) {
            if (err) { throw err; } else {
                console.log('res_usb', res_usb);
            }
        });
        */

        linux_resource.on('usb', function(e_usb) {
            console.log('e_usb', e_usb);
        })


    }, 1000);












    //sock.send('test');

    jsgui.activate(pc);
}
