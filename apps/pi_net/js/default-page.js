/**
 * Created by James on 05/06/2015.
 */


var jsgui = require('../../../js/web/jsgui-html-enh');
var Window = require('../../../js/web/controls/advanced/window');
var Button = require('../../../js/web/controls/advanced/button');
var Control = jsgui.Control;
var stringify = jsgui.stringify;

//var File_Manager = require('../../ws/js/web/controls/advanced/file-manager').File_Manager;
//var Server_Page_Context = require("../../../js/web/server-page-context");

var Default_Page = jsgui.Client_HTML_Document.extend({


    'init': function(spec) {
        this._super(spec);
        this.__type_name = 'default_page';
        var that = this;
        // spec will have a filesystem_resource property.



        var context = this._context;
        context.ctrl_document = this;

        if (!spec.el) {
            var body = this.get('body');

            //var body = hd.body();

            // Need to set various styles on the server.
            //  Maybe have a class called Demo_Block

            // Also, with jsgui style, could refer to .border.radius

            // Just make a window with a menu
            //  Want to get context menus working too.

            // Perhaps we could have a control called 'Desktop' that contains windows?
            //  Or it's a Multi-Window Container?
            //  Just a Window Container? Window Context?


            var window = new Window({
                'context': context
            });
            window.resizable();
            window.active();

            // style should at least set the CSS.
            //

            window.style('background-color', '#DDDDDD');
            window.style('width', '800px');
            window.style('height', '600px');





            // Want to get the USB data.
            // Would be nice to be able to set up a menu with some simple JSON like this.
            // A button that gets activated, when it clicks it sets one of the LED lights on or off.
            // More general Linux to start with.
            // Get the USB information

            //  Possible with websockets - but would need to make a request / response pattern system over the websockets.



            // Reset a USB device (with set task)

            // Get the USB devices' info sounds like one of the best ways of approaching it.


            // linux_system_resource.get('usb', cb);
            //  And the linux_system_resource will be a client-side proxy that uses websockets?

            // Maybe use a Websocket_Client_Resource?







            //ctrl_0.menu({
            //    'file': ['New', 'Open', 'Save', 'Exit'],
            //    'edit': ['Select All', 'Copy', 'Paste', 'Cut', 'Undo']
            //});


            // Want a control that shows the USB devices.
            //  Should probably listen to a USB_Hardware Resource.

            // And use websockets to serve that resource?

            // Want it so that events from the resource reach the client.
            // Some amount of resource wiring would be necessary
            //  Want it so that we connect the resources on the server, and then serve them to the client without extra wiring code within the UI code.

            // The Control will know which service it uses, and when it's on the client will ask for that service.
            //  The client-side resource_pool should have the client-side proxy to the required resource.

            // Need to sort out resource access over websockets.

            // From the client, want to be able to access various services on the server.
            //  Publishing events from resources through websockets looks important, and like it could be done relatively simply with the right code.

            // Should show a server status
            //  It would be nice if the client uses a websocket connection to stay connected to the server.


            // Want to possibly be getting frequent status info

            // Should get the server info on the server.
            //  Then most likely that server info is shared with websockets.

            // Want to get it broadcasting server status info to its clients.


            body.add(window);

            this.active();


        }
    },
    'activate': function() {
        if (!this.__active) {
            this._super();
            console.log('activate Default_Page control');

            // may as well get the USB devices at this stage.

            var rp = this._context.resource_pool;
            var linux_resource = rp.get_resource('Linux System');

            //linux_resource.get('usb' function(err, res_usb) {
            //    console.log('res_usb', res_usb);
            //});

            //linux_resource.on('usb', function(e_usb) {
            //    console.log('e_usb', e_usb);
            //});



        }

    }
});
module.exports = Default_Page;
/*
 return Default_Page;

 });

 */
