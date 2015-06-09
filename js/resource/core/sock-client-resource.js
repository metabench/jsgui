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



var Sock_Client_Resource = Resource.extend({
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
            //if (meta.url) this.meta.set('url', meta.url);
            if (meta.type_levels) this.meta.set('type_levels', meta.type_levels);


            //console.log('meta.name ' + meta.name);
        }

        this.data = new Data_Object();

        var that = this;

        // Does not need to do much to initialise.
        //  Just needs to send some messages to the server.
        //  Needs to listen for events too.
        //   Such as USB change monitoring.

        // For the moment, will do a get request.
        //  On the client side, this will need to listen for the response that comes in.







        // both in one parameter here?


        // Why not listen to the resource's data directly?
        //  Should not be a problem when doing it on the client?

        // Don't think it will have separate data (like this)


    },


    // likely just to be getting a value by string.

    // out needs to go throught the proxy as well.



    'on': fp(function(a, sig) {

        // Needs to pass the get request to the resource proxy.

        //console.log('this', this);

        var proxy = this._proxy || this.meta.get('pool').get_resource('Sock Resources Proxy');

        if (proxy) {
            //throw 'call socks proxy get'

            var url, callback;
            var url_path;
            if (a.l === 1) {
                url = this.meta.get('name').value();
                callback = a[0];
            }
            if (a.l === 2) {
                url_path = a[0];
                callback = a[1];

                //console.log('url_path', url_path);

                url = this.meta.get('name').value() + '/' + url_path;
            }

            //var name = this.meta.get('name');
            //console.log('name', name);

            //var full_path = name + '/' + url_path;

            console.log('url', url);

            //throw 'stop';

            // then call get through the proxy.
            proxy.on(url, callback);



        } else {
            throw 'Requires "Socks Proxy" resource in Resource Pool.';

        }

        // and needs to send it to the proxy
        //  with extended path?
        //   best to do it with a path or URL if practical.
        //  with extra resource_name field?



        /*

         */


    }),

    'get': fp(function(a, sig) {

        // Needs to pass the get request to the resource proxy.

        //console.log('this', this);

        var proxy = this._proxy || this.meta.get('pool').get_resource('Sock Resources Proxy');

        if (proxy) {
            //throw 'call socks proxy get'

            var url, callback;
            var url_path;
            if (a.l === 1) {
                url = this.meta.get('name').value();
                callback = a[0];
            }
            if (a.l === 2) {
                url_path = a[0];
                callback = a[1];

                //console.log('url_path', url_path);

                url = this.meta.get('name').value() + '/' + url_path;
            }

            //var name = this.meta.get('name');
            //console.log('name', name);

            //var full_path = name + '/' + url_path;

            console.log('url', url);

            //throw 'stop';

            // then call get through the proxy.
            proxy.get(url, callback);



        } else {
            throw 'Requires "Socks Proxy" resource in Resource Pool.';

        }

        // and needs to send it to the proxy
        //  with extended path?
        //   best to do it with a path or URL if practical.
        //  with extra resource_name field?



        /*

        */


    })

    // We don't notify it this way.
    //  Thinking of making a serparate Resource that uses websockets or sockjs. Should continue to have the normal non-sock client-side resource as well.
    ///  Will not make its own HTTP connections.


});

module.exports = Sock_Client_Resource;