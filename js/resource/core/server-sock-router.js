
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
        //var remoteAddress = req.connection.remoteAddress;
        //var rt = this.get('routing_tree');
        //var url_parts = url.parse(req.url, true);

        //console.log('Server_Sock_Router process message', message);

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

        //console.log('rest_of_path', rest_of_path);

        requested_resource.get(rest_of_path, function(err, res_get) {
            if (err) { throw err; } else {
                console.log('res_get', res_get);

                // need to make a reply message.

                var reply = {
                    'id': message.id,
                    'type': 'get_reply',
                    'body': res_get
                }

                sock_conn.write(JSON.stringify(reply));

                // then need to send a message back to that client.

            }
        })




        return true;

    }
});


//return Router;


//});
module.exports = Server_Sock_Router;
