
var url = require('url'), jsgui = require('../../web/jsgui-html'), os = require('os'),
    http = require('http'), libUrl = require('url'), Resource = require('./resource'),
    JeSuisXML = require('../../web/jsgui-je-suis-xml'), Cookies = require('cookies');

var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
var filter_map_by_regex = jsgui.filter_map_by_regex;
var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
var fp = jsgui.fp, is_defined = jsgui.is_defined;
var Collection = jsgui.Collection;
var get_item_sig = jsgui.get_item_sig;


var Server_Sock_Router = Resource.extend({


    'init': function(spec) {
        this._super(spec);

        this._map = {};

        this.set('type_levels', ['router']);
    },
    'start': function(callback) {
        callback(null, true);
    },
    'set_route': function(str_route, fn_handler) {
        //var rt = this.get('routing_tree');
        //return rt.set(str_route, context, fn_handler);

        this._map[str_route] = fn_handler;

    },

    // Maybe needs a callback for an error?

    'process': function(message, sock_conn) {


        // So far it's only processing get messages.
        //  Need to tell it that it's a get message too.
        var message_type = message.type;

        var split_path = message.url.split('/');

        var requested_resource_name = split_path[0];
        //console.log('requested_resource_name', requested_resource_name);


        var rp = this.meta.get('pool');

        var requested_resource = rp.get_resource(requested_resource_name);

        //console.log('requested_resource', requested_resource);

        //requested_resource.get()

        var rest_of_path = '';

        var c, l = split_path.length;

        for (c = 1; c < l; c++) {
            if (c > 1) rest_of_path = rest_of_path + '/';
            rest_of_path = rest_of_path + split_path[c];
        }

        var message_id = message.id;

        if (message_type === 'get') {
            //var remoteAddress = req.connection.remoteAddress;
            //var rt = this.get('routing_tree');
            //var url_parts = url.parse(req.url, true);

            //console.log('Server_Sock_Router process message', message);



            //console.log('rest_of_path', rest_of_path);

            requested_resource.get(rest_of_path, function(err, res_get) {
                if (err) { throw err; } else {
                    //console.log('res_get', res_get);

                    // need to make a reply message.

                    var reply = {
                        'id': message_id,
                        'type': 'get_reply',
                        'body': res_get
                    }

                    sock_conn.write(JSON.stringify(reply));

                    // then need to send a message back to that client.

                }
            })
        }


        // Then it could be a 'set' call.

        // Want to listen, with 'on'.

        // When we have 'on', we need to listen out for events from that resource, and sent them to the client when they happen.

        // Some resources would have more obscure event names, such as usb_attach, usb_detach.

        // This will be useful for showing changes in the USB devices that are on the pi, or whatever device.



        if (message_type === 'on') {
            // need to know what it's listening for.
            //  Want a general 'on' as well that listens for all events.
            //   Hopefully that is still working.
            //   And the event handlers would also say what event type it is.
            //console.log('message_type', message_type);

            // Will call on for some path, probably / possibly.

            // There may be a URL inside this.

            //console.log('message', message);
            //console.log('rest_of_path', rest_of_path);


            requested_resource.on(rest_of_path, function(e, params) {
                //console.log('requested_resource.on resource e', e);
                //console.log('params', params);

                // send back the response here?

                //var reply = {
                //    'id': message.id,
                //    'type': 'get_reply',
                //    'body': res_get
                //}

                //e.type = 'event';
                //e.id = message_id;

                var reply = {
                    'type': 'event',
                    'id': message_id,
                    'body': e
                }
                sock_conn.write(JSON.stringify(reply));
            });
        }


        return true;

    }
});


//return Router;


//});
module.exports = Server_Sock_Router;
