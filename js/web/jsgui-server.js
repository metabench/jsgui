


var sockjs = require('sockjs'), jsgui = require('./jsgui-html'), os = require('os'), http = require('http'), libUrl = require('url'),
    Resource = require('../resource/core/resource'), JeSuisXML = require('./jsgui-je-suis-xml'), Cookies = require('cookies'),
    Local_Server_Information = require('../resource/local-server-info'), Local_File_System = require('../resource/local-file-system'),
    Server_Resource_Pool = require('../resource/core/server-pool'),
    Router = require('../resource/core/router'), Server_Sock_Router = require('../resource/core/server-sock-router'),
    Website_Resource = require('../resource/core/website'),
    Resource_File_System_Web_Admin = require('../resource/file-system-web-admin'), Resource_Web_Admin = require('../resource/web-admin'),
    Site_Static_HTML = require('../resource/core/site-static-html'), Site_JavaScript = require('../resource/core/site-javascript'),
    Site_CSS = require('../resource/core/site-css'), Site_Images = require('../resource/core/site-images'), Site_Audio = require('../resource/core/site-audio'), Info = require('../resource/info'),
    Login = require('../resource/login'), Server_Page_Context = require('./server-page-context');
var Server = {};

var Login_Html_Resource = Login.Html;
// Test if node features are supported?

// This should be running in node.js

var stringify = jsgui.stringify, each = jsgui.eac, arrayify = jsgui.arrayify, tof = jsgui.tof;
var filter_map_by_regex = jsgui.filter_map_by_regex;
var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
var fp = jsgui.fp, is_defined = jsgui.is_defined;
var Collection = jsgui.Collection;



var exec = require('child_process').exec;

// And automatically starts an Application within a Server process?

// Now we have the server process as code (making it distinct from the server abstraction), we have got to make the application code.
//  An application in it's default configuration, and then tell the app to do some things with certain pages.

// Could give the app a defailt path of '/'
//  Then perhaps the server can route some other things as instructed.
//  The Site_JavaScript resource will exist on a per-site basis.

// Need to make a Jsgui Application object, and there will be a Collection of them inside the Server.


// This needs to have more in the init section to support it serving (mostly) static sites.
var JSGUI_Server = Enhanced_Data_Object.extend({

    'init': function(spec) {


        // The spec may be quite different.
        //  It may be an object containing routes and applications.

        // object containing application routes...

        var resource_pool = new Server_Resource_Pool({
            // Other things can be made available through the server resource pool.
            'access': {
                'full': ['server_admin']
            }
        });


        // Having both a server router and a socks router.
        //  Need to recieve the socks connection(s) and send them on to the correct application within the server.
        //   Currently not dealing with more than one app within the server.





        // Use a different router for the socks connections?
        //  Probably makes the most design sense.




        var server_router = new Router({
            'meta': {
                'name': 'Server Router'
            }
        });
        resource_pool.push(server_router);


        // Probably better to have a specific Server_Websockets_Router, likely quite simple.

        var server_sock_router = new Server_Sock_Router({
            'meta': {
                'name': 'Server Sock Router'
            }
        });
        resource_pool.push(server_sock_router);



        //console.log('spec', spec);

        var t_spec = tof(spec);

        // Normally have an object in the spec?
        //  And then set some things up on the website resource...
        //   using the app spec.

        if (t_spec == 'object') {
            each(spec, function(app_spec, route) {
                // Create a new Application Resource.

                var app = new Website_Resource(app_spec);
                //console.log('made Website_Resource');

                // But the right context?
                //
                //console.log('');
                //console.log('route', route);
                //console.log('app', app);
                //console.log('app.process', app.process);
                //console.log('');
                server_router.set_route(route, app, app.process);
                // And set it to that route in the routing table.

            })
        }

        this._super({});

        // Resource_File_System_Web_Admin

        this.set('resource_pool', resource_pool);
        //console.log('resource_pool ' + stringify(resource_pool.start));

        //var rp = this.get('resource_pool');
        //console.log('this._.resource_pool ' + this._.resource_pool);
        //console.log('rp ' + stringify(rp.start));
        //throw 'stop';

    },


    'start': function(port, callback, fnProcessRequest) {
        //throw 'stop';
        // The resource_pool is not just a Data_Value. need to fix some get or create new field value code.
        //console.log('start');
        var resource_pool = this.get('resource_pool');
        //console.log('resource_pool ' + stringify(resource_pool));
        //throw 'stop';

        var that = this;
        //console.log('pre start resource pool');

        resource_pool.start(function(err) {
            if (err) {
                throw err;
            } else {
                //console.log('jsgui-server resource pool started');

                var rp = that.get('resource_pool');
                //console.log('rp ' + rp);


                // get_resource should do the query for the
                var lsi = rp.get_resource('Local Server Info');
                //console.log('lsi ' + stringify(lsi));
                var js = rp.get_resource('Site JavaScript');
                var css = rp.get_resource('Site CSS');
                var images = rp.get_resource('Site Images');
                var audio = rp.get_resource('Site Audio');


                var login = rp.get_resource('Login HTML Resource');
                // An HTML resource may be changed to a Resource Publisher + Resource Client.
                //  The Resource itself should be separate from the transport mechanism used to access it.

                var admin = rp.get_resource('Web Admin');
                var resource_publisher = rp.get_resource('HTTP Resource Publisher');

                var sock_router = rp.get_resource('Server Sock Router');


                // .get on a resource.
                //  could get a sub-resource.


                var nis = lsi.get('networkInterfaces');


                var matching = nis.find('entries', {
                    'family': 'IPv4',
                    'internal': false
                })

                // matching.extract


                //console.log('matching ' + stringify(matching));

                // Then extract the IP addresses themselves.

                var ipAddresses = [];

                each(matching, function(v, i) {
                    var ipAddress = v.get('address');
                    ipAddresses.push(ipAddress);
                });

                var application_router = resource_pool.get_resource('Server Router');
                var rt = application_router.get('routing_tree');

                var map_connections = {};

                var i_connections = 0;

                each(ipAddresses, function(ipAddress, i) {

                    // Different HTTP servers for the different network addresses.

                    // Not sure if to integrate websockets here.
                    //  It's likely that there won't need to be multiple websocket endpoints like there are with http.

                    // need to save a map of the http servers to the IP addersses.

                    // Or also setup the websocket servers too.

                    // Could perhaps set up websocket servers by default.

                    // However, need to pay attention to the HTTPS protocol for this as well.
                    //  For the moment will focus on HTTP.

                    // Running a websocket server could be optional.
                    // It may be worth having some socket abstraction here, so it handles all websocket servers at once.

                    var http_server = http.createServer(function(req, res) {

                        //console.log('process server request');

                        var authentication_resource = resource_pool.get_resource('Authentication');
                        // Why is the request being identified as a Readable Stream?

                        //console.log('authentication_resource', authentication_resource);

                        if (!authentication_resource) {

                            // However, a static app set to * should be routed here?






                            var server_routing_res = application_router.process(req, res);
                            //console.log('server_routing_res', server_routing_res);

                        } else {
                            authentication_resource.authenticate(req, function(err, auth_res) {
                                if (err) {
                                    throw err;
                                } else {
                                    //console.log('auth_res ' + stringify(auth_res));

                                    var tar = tof(auth_res);
                                    if (tar == 'object') {
                                        // it's a username

                                        // we can include authentication information with the req.

                                        req.auth = auth_res;

                                    }

                                    application_router.process(req, res);
                                }
                            });
                        }
                    });
                    http_server.timeout = 10800000;


                    // Single sock server for each server
                    //  The applications will make use of the server's sock facility.
                    var sock_server = sockjs.createServer();


                    sock_server.on('connection', function(conn) {

                        //console.log('sock_server on connection');

                        var connection_id = i_connections;
                        conn.id = connection_id;
                        i_connections++;

                        map_connections[connection_id] = conn;

                        //console.log('map_connections', map_connections);


                        // We can have it give an update message every 10s...

                        // Or more frequent updates maybe...

                        conn.on('data', function(message) {

                            // Not so sure about the acknowledgement just yet.
                            //conn.write('received', message);

                            // Broadcast the message?
                            //  Nothin to do here.

                            console.log('tof message', tof(message));

                            var obj_message = JSON.parse(message);
                            console.log('obj_message', obj_message);

                            sock_router.process(obj_message, conn);





                            // Perhaps we need a barrier between here and the resources.
                            //  Some mechanism of checking that it's available for the client to use, rather than just the system.

                            // Both in setting up routes to the resources, and having the resources themselves authenticate the request
                            //  Though having the resources doing the authentication would allow for an abstraction that does authentication while the resource code focuses on specific functionality.


                            // So having a router to these resources makes sense, but it could be really simple.
                            // Maybe just a routing system here?







                            // then send the message onto the websockets router.
                            //  though routing these will be a lot simpler (at this stage).
                            //  just use the first part of the URL as the name of the resource to route to.
                            //   resources could then process the rest of the path.





                            //console.log('socks connection on data: ', message);
                            //console.log('sock_server.recieved', sock_server.recieved);

                            //if (typeof _sock != 'undefined') {

                            // Need more advanced default socket reception.
                            //  The client will be sending some kind of specific message.
                            //  Possibly interacting with the resources as well.


                            // Looks like we need some kind of a sock connection url router.

                            // need to listen to different (extension) paths through the sock interface.
                            //  Possibly it could provide access to 'set' functionality.
                            //   Then confirmation in a response?

                            // Want to interact with server-side resources using sock.
                            // Particularly 'on' to listen for changes
                            // 'set' to change data
                            // possibly 'get' to get data.

                            // Should send some kind of interpreted packets over the connection.

                            // Could be a faster way to access a variety of resources.

                            // make received_sock standard?
                            //  have it check the sock_route
                            //  will have a sock_path as an early property within the sock message.
















                            //if (typeof that.recieved_sock != 'undefined') {
                            //	that.recieved_sock(JSON.parse(message));
                            //}

                            // So there would need to be a server function to specifically handle / read the sock message.





                            //}

                            //console.log('conn.id', conn.id);

                            // But it needs to be for the right connection.


                            //that.trigger('websocket_data', message);


                        });
                        conn.on('close', function() {
                            //console.log('connection ' + conn.id + ' closed');
                            map_connections[conn.id] = null;
                        });

                    });

                    var broadcast = function(message) {
                        if (!(tof(message) == 'string')) {
                            message = JSON.stringify(message);
                        }
                        //console.log('broadcast');
                        //console.log('map_connections', map_connections);
                        each(map_connections, function(conn, i) {


                            if (conn) {
                                //console.log('conn i', i);
                                //conn.write(message);
                                //console.log('message', message);
                                //console.log('t message', tof(message));
                                conn.write(message);
                            }
                            //conn.write(message);
                        })
                    }

                    that.sock_broadcast = broadcast;
                    that.broadcast = broadcast;


                    sock_server.installHandlers(http_server, {prefix:'/ws'});

                    console.log('port', port);

                    if (ipAddress.value) ipAddress = ipAddress.value();

                    console.log('ipAddress', ipAddress);


                    http_server.listen(port, ipAddress);
                    console.log('* Server running at http://' + ipAddress + ':' + port + '/');




                });
                if (callback) callback(null, true);
            }

        });
    },

    /*
     'recieved_sock': function(sock_message) {
     // Need to look at the message, and unpack the socks_path from the rest of the message
     //  Socks will be used to deliver a message to the relevant service.

     // perhaps sock messages could contain a URL.
     //  Just need to route them to the right place.

     // server_websockets_router

     var rp = this.get('resource_pool');
     var websocket_router = rp.get_resource('Server Websocket Router');

     // need to extract the sock path from the recieved_sock message.







     },
     */

    'process_request': function(req, res) {
        // check to see if the 1st word in the path is 'admin'.
        //  Then if it is, we'll be giving something to an admin route.
        // And if it is within the admin path, then
        var url = req.url;
        //console.log('*** server process_request url ' + url);
        var s_url = url.split('/');
        //console.log('s_url ' + stringify(s_url));

        var a_path = [];
        each(s_url, function(i, v) {
            if (v.length > 0) {
                a_path.push(v);
            }
        });

        //var spc = new Server_Page_Context(req, res);
        var spc = new Server_Page_Context({
            'req': req,
            'res': res
        });

        var router = this.get('router');

        // and will have a separate router for the websocket requests.

        // then that should be able to understand things about the browser from the user agent string.

        //console.log('a_path ' + stringify(a_path));

        if (a_path.length > 0) {
            var routing_res = router.process(req, res);
        } else {
            console.log('need to process short path');
        }

    },
    'serve_document': function(req, res, jsgui_html_document) {
        var html = jsgui_html_document.all_html_render();

        var mime_type = 'text/html';
        //console.log('mime_type ' + mime_type);

        res.writeHead(200, { 'Content-Type': mime_type });
        res.end(html, 'utf-8');


    },
    'status': function(callback) {

    }
});


Server.Page_Context = Server_Page_Context;

Server.JSGUI_Server = JSGUI_Server;
jsgui.Server = Server;

module.exports = jsgui;
