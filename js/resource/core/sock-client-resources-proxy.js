var jsgui = require('../../web/jsgui-html-enh');
var Resource = require('./resource');

var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
var filter_map_by_regex = jsgui.filter_map_by_regex;
var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
var fp = jsgui.fp, is_defined = jsgui.is_defined;
var Collection = jsgui.Collection;


// get
// set
// on
// off



var ends_with = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// It looks like this one needs to act as a proxy for a bunch of different resources on the server.


var get_message_count = 0, on_message_count = 0;


var Sock_Client_Resources_Proxy = Resource.extend({
    //'fields': {
    //	'url': String
    //},

    // sock.send to send a message from the client.


    // need get and set on the client.

    // Probably want this to make use of a single sock connection.
    //  So make a Sock_Client_Resource_Proxy that connects to all socks resources made available on the server.
    //  Then individual sock resources make their connections through this resource proxy.

    // Sock_Client_Resources_Proxy
    //  So all sock client resources go through that.

    






    'init': function(spec) {
        this._super(spec);

        if (spec.meta) {
            var meta = spec.meta;
            //console.log('1) meta.url', meta.url);
            if (meta.url) this.meta.set('url', meta.url);
            if (meta.type_levels) this.meta.set('type_levels', meta.type_levels);


            //console.log('meta.name ' + meta.name);
        }

        var that = this;

        // Does not need to do much to initialise.
        //  Just needs to send some messages to the server.
        //  Needs to listen for events too.
        //   Such as USB change monitoring.

        // For the moment, will do a get request.
        //  On the client side, this will need to listen for the response that comes in.

        // OK, the Resources_Proxy is where the sock connection should be.

        // Sock resources will make use of the resources proxy, which will be in the resource pool.

        var get_handlers = this._get_handlers = {};
        var on_handlers = this._on_handlers = {};


        var sock = this._sock = new SockJS('/ws');

        sock.onopen = function() {
            console.log('open');

            // need to say that the resource is ready at this time...
            //  for the moment will just delay calls that mess up.


        };
        sock.onmessage = function(e) {
            console.log('message', e.data);

            // should be able to listen to the messages.

            var obj_message = JSON.parse(e.data);

            var type = obj_message.type;
            var request_response_id = obj_message.id;

            var body = obj_message.body;

            if (type === 'get_reply') {



                get_handlers[request_response_id](body);
                get_handlers[request_response_id] = null;

                // We need to notify the resource that asked for this.

            }

            if (type === 'event') {
                console.log('process event message', obj_message);

                on_handlers[request_response_id](body);
                //on_handlers[request_response_id] = null;

            }




            // We need to process the message data to see which resource it is for.

            // planning on using a RESTful addressing system, but really need to be addressing one resource and then presenting further path information within the data packet if necessary.

            // Have to see which client-side resource this is a message for.


            // This could either be an event message, or a reply message.


            // Need to correlate replay messages with the sent messages.
            //  Could keep an index of the callbacks too.



        };
        sock.onclose = function() {
            console.log('close');
        };


        // both in one parameter here?


        // Why not listen to the resource's data directly?
        //  Should not be a problem when doing it on the client?


    },

    'on': fp(function(a, sig) {
        var event_path, callback;
        var on_handlers = this._on_handlers;
        var sock = this._sock;
        if (sig === '[f]') {
            callback = a[0];
        }
        if (sig === '[s,f]') {
            event_path = a[0];
            callback = a[1];
        }

        // Remembering that the particular 'on' call has a specific callback.
        //  just deal with the paths as strings.


        var obj_message = {
            //'url': url,
            'type': 'on',
            'id': on_message_count++ + ''
        };

        if (event_path.length > 0) obj_message.url = event_path;

        on_handlers[obj_message.id] = callback;
        sock.send(JSON.stringify(obj_message));

    }),

    // on

    // need to listen for events on this...
    //  but some is automatic I think?




    // likely just to be getting a value by string.



    'get': fp(function(a, sig) {
        var get_handlers = this._get_handlers;
        var sock = this._sock;

        var url, callback;
        var url_path;
        if (a.l === 1) {
            url = this.meta.get('url').value();
            callback = a[0];
        }
        if (a.l === 2) {
            url = a[0];
            callback = a[1];

            //console.log('url_path', url_path);



            //url = this.meta.get('url').value() + url_path;


        }

        if (url) {
            //console.log('url', url);

            //console.log('this', this);

            //var rp = this.meta.get('pool');

            //console.log('rp', rp);

            // don't think we need the pool here.

            // send the get request in a simple envelope to the server.

            // Also need a unique (for the client) message ID so when we get the reply we know it's from this request.

            var obj_message = {
                'url': url,
                'type': 'get',
                'id': get_message_count++ + ''
            }

            get_handlers[obj_message.id] = callback;
            sock.send(JSON.stringify(obj_message));


        }



    })

    // We don't notify it this way.
    //  Thinking of making a serparate Resource that uses websockets or sockjs. Should continue to have the normal non-sock client-side resource as well.
    ///  Will not make its own HTTP connections.


});

module.exports = Sock_Client_Resources_Proxy;