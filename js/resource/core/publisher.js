var jsgui = require('../../web/jsgui-html'),
    os = require('os'),
    http = require('http'),
    libUrl = require('url'),
    Web_Resource = require('./web'),
    JeSuisXML = require('../../web/jsgui-je-suis-xml'),
    Cookies = require('cookies'),
    Resource_Control = require('../../web/controls/advanced/resource-base')
var Server_Page_Context = require('../../web/server-page-context');



var stringify = jsgui.stringify,
    each = jsgui.each,
    arrayify = jsgui.arrayify,
    tof = jsgui.tof;
var filter_map_by_regex = jsgui.filter_map_by_regex;
var Class = jsgui.Class,
    Data_Object = jsgui.Data_Object,
    Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
var fp = jsgui.fp,
    is_defined = jsgui.is_defined;
var Collection = jsgui.Collection;


// Looks like this publishes an HTML interface for the moment.

// This one is for publishing a single resource

// A resource may get published in more than one way though:
//  HTML interface (provides an HTML client)
//  JSON interface (get, set)
//  Websockets (subscribe to events being the most important, but also set and update may be important)

// Will make it so that the publisher can do all these at once under an address, but adding bits to the path.
//  Make it take less boilerplate code to do all of these.


// May route the responses in elsewhere.
//  Want some kind of flexibility for websocket routing , but for it to work out-of-the-box as well.


var Resource_Publisher = Web_Resource.extend({

    // should take the resource to publish as the field...?

    'init': function(spec) {


        this._super(spec);
        //console.log('spec.resource', spec.resource);
        if (spec.resource) this.meta.set('resource', spec.resource);



        //var resource = this.get('resource');
        //console.log('resource', resource);
        //throw 'stop';
        //var meta = this.meta;

        //console.log('Publisher this.meta', this.meta);

    },
    'start': function(callback) {
        //console.log('lfs start');
        callback(null, true);
    },
    'get': function(key, callback) {
        // All params as one object for the resource?

        // gets the table / collection
        var meta = this.meta;


    },
    'set': fp(function(a, sig) {
        // All params as one object for the resource?
        //console.log('Info Resource set sig ' + sig);
        // gets the table / collection
        var meta = this.meta;

    }),
    // Having some resources processing HTTP requests may not be too bad.
    //  However, we could have an automatic layer for this so that they do not have to be programmed
    //  individually.


    // The publisher could do more then just respond.
    //  May also need to serve some client script that gets downloaded by the client and serves the resource script.
    //  Need this to be automatic / neatly encapsulated.


    // publish(resource, ...)

    // need a way to get the resource to send its info through a websockets channel.

    // Also need to recieve information on the resource.
    //  We could change a property on the client, and that info will be transferred with sock.

    // Listening to updates through sock... would then call the resource's get or set.

    'sock_broadcast_changes': function(server) {

        // with sock, need to send to every connection.
        //console.log('sock_broadcast_changes');


        var resource = this.meta.get('resource');
        var resource_name = resource.meta.get('name');

        // We may not want to broadcast it to all clients.
        //  Should make it so that clients connect or disconnect to various resources.


        // resource.on(...)
        // resource.set(...)

        // Still would use 'set' to change things, though those changes would be sent over the websocket connection?
        //  The resource or the publisher would be listening to the resource's changes, and notify the server of the client-initiated changes
        //  Would notify the server of the client-initiated changes.

        // Should have a simple API for use on the client.
        //  Basically will provide asyncronous access to parts of a server, including lower latency communication.

        // The basic Clock resource worked with sending updates to the client.

        // Client ID, Resource, event_name

        // Need to have multiple clients listening to different resources.
        //  Publish / subscribe pattern accross the client/server boundary.

        // May need to write more event handling on the server.
        //  The abstraction I already have works nicely for what it does.
        // In this situation, it seems we need to channel a wider variety of requests through a single URL or connection, so we lose flexibility
        //  and addressibility there, but we gain extra speed of communication.


        // The services on the server may broadcast to all clients...
        //  But really they should be broadcasting to clients that have subscribed to particular events on the server.



















        resource.on('change', function(key_name, value) {
            console.log('resource change');
            // Perhaps need to put more into one parameter.
            //  Both name and value...

            //console.log('change_e', change_e);
            //var key_name = change_e[0];
            //var value = change_e[1];

            // May need to parse / encode the value.

            //console.log('value', value);

            var tval = tof(value);
            //console.log('tval ' + tval);

            if (tval == 'date') {
                value = {
                    '__type': 'date-iso-8601',
                    'value': value.toISOString()
                }
            }

            var e_res = [resource_name, 'change', key_name, value];

            //console.log('publisher resource change event ', e_res);
            //console.log('will broadcast change with sock');

            //

            server.sock_broadcast(e_res);

        })
    },


    // also needs to respond to resource-client.js.




    'respond': fp(function(a, sig) {

        var req, res, content_type, my_Resource_Control, resource_client_path, included_css;

        // length 2:

        console.log('respond sig', sig);



        if (a.l == 3) {
            req = a[0];
            res = a[1];
            content_type = a[2];
        }

        if (a.l == 4) {
            req = a[0];
            res = a[1];
            content_type = a[2];
            my_Resource_Control = a[3];
        }

        if (a.l == 5) {
            req = a[0];
            res = a[1];
            content_type = a[2];
            my_Resource_Control = a[3];
            resource_client_path = a[4];
        }

        if (a.l == 6) {
            req = a[0];
            res = a[1];
            content_type = a[2];
            my_Resource_Control = a[3];
            resource_client_path = a[4];
            included_css = a[5];
        }



        // May have some further data.
        // best not to hide it in the req I think

        // The other data being the control to use.
        //  Not using a standard Resource_Control perhaps.


        // Probably should not pay attention to the full URL path like this.
        //  It's root URL could be assigned in the application resource router.

        // Should carry out get on the resource.
        //  Will need to use params in some cases. In some cases the params will have been found by the Application Router.
        //  Params should be parsed prior to this I think - need to make it a well defined stage.

        // Maybe have different types of responses.
        //  JSON should probably be more of a focus...
        //  But publisher should publish as HTML as well.

        // Also want to deal with socket connection.
        //  But getting he right granularity of change event listening right may be worth doing first.
        //  Could have some nice way of coding which changes need to be broadcast immediately.

        // Have a means to listen to the resource through websockets.
        //  Then the HTML interface could keep updated using the websockets.

        // Not sure quite how much to include of a specialised client in the HTML inteface for a resource
        //  I think there should be a default basic client, and also enhanced clients that are specific to that resource.
        var resource = this.meta.get('resource');


        // We could read the content type from the end of the req...
        //console.log('req keys', Object.keys(req));

        var url = req.url;
        var method = req.method;
        var params = req.params;
        var wildcard_value;
        //console.log('url', url);
        //console.log('method', method);
        //console.log('params', params);

        if (params) {
            wildcard_value = decodeURI(params.wildcard_value);
        }

        //console.log('content_type', content_type);



        // Detect if we are looking for JSON

        var ends_dot_json = function(str) {
            //console.log('str', str);
            if (!str || (str.length < 5)) return false;
            return (str.substr(str.length - 5) == '.json');
        }



        var edj = ends_dot_json(wildcard_value) || ends_dot_json(url);
        //console.log('edj', edj);

        var is_json = edj || content_type === 'json';

        var json_path;

        if (edj) {
            var pre_dot_json_path = '';
            if (wildcard_value) pre_dot_json_path = wildcard_value.substr(0, wildcard_value.length - 5);

            var resource = this.meta.get('resource');
            json_path = pre_dot_json_path;
        } else {
            json_path = decodeURI('/' + wildcard_value);
        }

        if (is_json) {
            resource.get(json_path, function(err, res_resource) {
                if (err) {
                    throw err;
                } else {
                    // And include metadata.

                    var output = {
                        'resource': {
                            //'meta': {
                            //	'name': resource.meta.get('name') + ''
                            //'name': 'james'
                            //},
                            'data': res_resource
                        }
                    }

                    var resource_type_levels = resource.meta.get('type_levels');
                    //console.log('resource_type_levels', resource_type_levels);

                    if (resource_type_levels) {
                        output.resource.meta.types = resource_type_levels;
                    }

                    if (pre_dot_json_path) {
                        output.inner_path = pre_dot_json_path;
                    }

                    //console.log('output', output);

                    var json = JSON.stringify(output);
                    var mime_type = 'application/json';
                    res.writeHead(200, {
                        'Content-Type': mime_type
                    });
                    res.end(json, 'utf-8');
                }
            })

        } else {
            if (!wildcard_value) {


                //console.log('Resource_Publisher_HTTP html respond');

                // Put together a JSGUI page.
                //  It should be easy to generate a page and access the body.

                var server_page_context = new Server_Page_Context({
                    'req': req,
                    'res': res
                });

                var hd = new jsgui.Client_HTML_Document({
                    'context': server_page_context
                });




                hd.include_client_css();

                if (included_css) {
                    hd.include_css(included_css);
                }
                hd.include_jsgui_resource_client(resource_client_path);
                var body = hd.body();


                // and the resource control will then connect to that same resource on the client through the resource pool.


                var resource_control = new(my_Resource_Control || Resource_Control)({
                    'context': server_page_context,
                    'resource': this.meta.get('resource')
                });

                // Need to somehow defer the rendering of the control until it is ready.
                //  we could make an async render function that waits until they are ready before rendering.

                // Controls could have a 'status' field.
                //  Need to make controls async in this way if we are rendering them based on asyncronously obtained data.

                // When rendering check all controls to see if they are ready?

                resource_control.active();


                // The resource control will be activated on the client.
                //  It will be bound to the client-side resource.
                //  Updates to the client side resource will cause the resource_control to update.

                // Updates done by the user would also be sent to the server.
                //  Possibly validated at different stages too.

                body.add(resource_control);

                hd.all_html_render(function(err, deferred_html) {
                    if (err) {
                        throw err;
                    } else {
                        //console.log('deferred_html', deferred_html);

                        var mime_type = 'text/html';
                        //console.log('mime_type ' + mime_type);

                        res.writeHead(200, {
                            'Content-Type': mime_type
                        });
                        res.end(deferred_html, 'utf-8');
                    }
                });

            }
        }

    })
});

module.exports = Resource_Publisher;