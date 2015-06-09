
// Want it to deal with the USB info.


// This resource is going to have a few functions for controlling a Linux system.

// Needs to have a few paths within it.
//  They could be subresources, maybe I'll make a Linux USB resource.

// Will have a generally simplified way of accessing commands.
//  Eg by navigating paths can do a lsusb command, get results back in JSON format.

// Will be able to get, set and monitor (with on and off) various values on the server.
//  Showing USB devices being added and removed will be a useful thing.


// Making client-side resource proxies for events?

// // Would go through this sock resource publisher, without the code in Resource modules having to change.

// get /usb
//  returns data on the usb devices
// set /task/usb/4/reset
//  seems like a fairly simple way of doing it.

// We have a Task resource which we set.
//  The Task resource would be a subresource of these published server resources.
//   The Task resource would fit function calls into get, set, on, off.




// get /net
//  data on network devices


var jsgui = require('../../core/jsgui-lang-util');
var Resource = require('../core/resource');

var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Collection = jsgui.Collection;
var is_defined = jsgui.is_defined, fp = jsgui.fp, stringify = jsgui.stringify, tof = jsgui.tof;
var call_multi = jsgui.call_multi;
var each = jsgui.eac;


var usb_scan = require('../../net/pi/usb_scan');
var system_monitor = require('../../net/pi/system_monitor');

var USB_Connection_Change_Monitor = system_monitor.USB_Connection_Change_Monitor;




var Linux_System_Resource = Resource.extend({
    'init': function(spec) {
        var that = this;
        if (!is_defined(spec)) spec = {};
        this._super(spec);


        // Listening for events as well.
        //  This should listen for USB events.

        // In the future, maybe have a separate Linux USB Resource.

        // For the moment, want this to handle a variety of different situations.


        // This Resource will use its pub/sub for events.

        // Listen for the USB...
        console.log('creating usbcm');
        var usbcm = new USB_Connection_Change_Monitor();
        usbcm.on(function(event_name, params) {
            //console.log('* usbcm event_name', event_name);
            //console.log('event_name', event_name);
            //console.log('2) params', params);

            // Then raise an event on this?
            //  The resource publisher could be listening for events on this.

            // raise it as a 'subresource_event'?

            // raise a usb event?

            // just raise an event?

            // Have the client-side system just listen to all events from this?

            // Naming the event 'usb' seems logical if that's what we are giving in the 'on' path.

            // possibly raise a 'usb' event.
            //  easier than making a subresource for the moment.

            // Encapsulated events.

            that.raise('usb', {
                'event_name': event_name,
                'params': params
            });



        });



        //







    },

    // on may listen for a path as well.
    //  seems like the easiest way of coding it from here.
    //  but is that an event name or a sub-object.
    //   with some flexibility could support both.







    'start': function(callback) {
        console.log('Linux_System_Resource start');
        callback(null, true);
    },
    'get': fp(function(a, sig) {
        console.log('Linux_System_Resource .get sig', sig);

        var path, callback, res;

        if (sig == '[f]') {
            callback = a[0];

            //var time = this.data.get('time');
            res = {
                'hello': 'world'
            }
            callback(null, res);
        }
        if (sig === '[s,f]') {
            // have a path or URL within here.
            //  Depending on the path, return the result from here, or call upon another resource.

            // Want it so it's easy to make a specific resource that encapsulates some specific functionality, then allow it to be used through the path of another
            //  resource.

            // So resources may need their own single-level routers.
            //  Correctly assigning a subresource to answer a question.
            //  May make some resource name aliases as well.

            path = a[0];
            callback = a[1];

            console.log('path', path);

            if (path === 'usb') {
                usb_scan.scan_devices(callback);



            }
            // should really be calling on lsusb or something like that.
            //  may well use some functionality that's not wrapped in a Resource.


        }
    }),
    'meets_requirements': function() {
        return true;
    }
});

module.exports = Linux_System_Resource;




