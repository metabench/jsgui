// jsgui-client

// require a whole bunch of things


// need to have the extra information to initialize the various objects.
//  part of the server-side rendering would be identifying objects and relevant properties to send to the client.
//  for example, that something is a particular control.

//  identify ids by control.
// then there is separate client-side code...
//  or controls (perhaps advanced ones) have got various events on them that respond to client-side io, but can get used on the server as well,
//   perhaps with these client-side events called for testing.
// Application code would likely build views both on the server and the client, and have the interacton done on the client, while also using the
//  for its API, dealing with larger amounts of data than in the initial view.

// Will use particular client files...
//  Maybe have all the logic in one component.
//  Will have different means of loading and activation as well.
//   May be easier when the whole jsgui is in one file, or at least a large core.

// Likely to include a client-side component.
//  Like load a particular file which will include some particular jsgui client code.

// Needs a Client_Page_Context

// Perhaps we need a Resource_Client as well.

// Want the html client to be able to access resources.
// Want the client to have the right resource pool on the client.

// Want to be able to code client apps relatively simply, using the client-side resource system to access resources on the server / on servers.

// Should maybe send over resource info from the server.
// Resource manifest or description.

// Resources could also share a description.

// However, don't want this to get too complicated.
//  With the page, can serve a set of resources for it to use.
//  That would be an inline script, but then maybe we need to serve the app's JS alongside it.

// Will need to have the resource client access the resource for its own URL.
//  (or tell it which URL to look for the resource(s) at)

// Sending a resource-client would enable the resource to be accessed.

// For the simple case of the clock resource, we want it to display the resource's data.

// Important to avoid boilerplate while coding, making it easy to serve some data.

// Though the client side resource system will be there as code, it would be good to have things automatically instantiated.

// Need a resource client control.

// jsgui-html-resource-client
//  That would also have resources, and would start up the resource pool and client page context.
//  Not sure how useful the client code would be without the resource pool, but it's better to keep things more modular.



// The normal chiend should have a page_context at least...

// jsgui-html-resource-client
//  That would be a page that connects back to the .json for the page it was served from.
//  Also would connect to the websocket connection.

// May have jsgui-html-pooled-resources-client as well at some point.
//  Want it so that the resources which are on the server can be subscribed to using a single websocket connection.

// The resource client would connect back with a websocket connection.
//  Need to make sure that resources are published that way.

// Will be possible to have a single connection per resource.
//  That's how it will start.

// When connecting to multiple resources over websockets, will do so through the server's resource pool.
//  The server will notify the client of resource events that it has subscribed to.

// Need to get the real-time transfer of info working soon on a basic level, sharing clock data.

// Will then have it sharing more complex and varied data at some point soon after.



// Some resources probably won't use websockets.

// Also will want something to automatically serve the resource client.






if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};


define(["./jsgui-html-enh", "./client-page-context", "../resource/core/client-pool", "../resource/core/client-resource", "./controls/advanced/resource-base",
    "./controls/advanced/viewer/object", "./controls/advanced/viewer/basic/number"],
//define(["./jsgui-html"],
function (jsgui, Client_Page_Context, Client_Resource_Pool, Client_Resource, Resource_Control,
    Object_Viewer, Number_Viewer) {

    var fp = jsgui.fp;



    // Date shim
    (function() {

        var d = window.Date,
            regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,3})(?:Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

        if (d.parse('2011-11-29T15:52:30.5') !== 1322581950500 ||
            d.parse('2011-11-29T15:52:30.52') !== 1322581950520 ||
            d.parse('2011-11-29T15:52:18.867') !== 1322581938867 ||
            d.parse('2011-11-29T15:52:18.867Z') !== 1322581938867 ||
            d.parse('2011-11-29T15:52:18.867-03:30') !== 1322594538867 ||
            d.parse('2011-11-29') !== 1322524800000 ||
            d.parse('2011-11') !== 1320105600000 ||
            d.parse('2011') !== 1293840000000) {

            d.__parse = d.parse;

            d.parse = function(v) {

                var m = regexIso8601.exec(v);

                if (m) {
                    return Date.UTC(
                        m[1],
                        (m[2] || 1) - 1,
                        m[3] || 1,
                        m[4] - (m[8] ? m[8] + m[9] : 0) || 0,
                        m[5] - (m[8] ? m[8] + m[10] : 0) || 0,
                        m[6] || 0,
                        ((m[7] || 0) + '00').substr(0, 3)
                    );
                }

                return d.__parse.apply(this, arguments);

            };
        }

        d.__fromString = d.fromString;

        d.fromString = function(v) {

            if (!d.__fromString || regexIso8601.test(v)) {
                return new d(d.parse(v));
            }

            return d.__fromString.apply(this, arguments);
        };

    })();



    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.

    //console.log('running client function.');

    // At this point could do various things to activate the document.

    // However, we could have a part of the file that gets replaced with local variables.
    //  They could be written here as JSON before the file gets served - with the file being given a special URL?

    // I think including the local variables in the page itself may be mest. No need for dealing with another JavaSvipt file.
    //  Could possibly compress them in a neat way, like base64.

    // Controls will do a fair bit with their client-side code...
    //  But it will be important to get properties over to the client.
    //  Data attributes would be a possibility too.

    // Client side resources too? Don't think so, client side resource needs this.

    //  Also capability for doing HTTP request easily.
    //  jsgui.http('post', url, callback);

    var makeHttpObject = function() {
        try {return new XMLHttpRequest();}
        catch (error) {}
        try {return new ActiveXObject("Msxml2.XMLHTTP");}
        catch (error) {}
        try {return new ActiveXObject("Microsoft.XMLHTTP");}
        catch (error) {}

        throw new Error("Could not create HTTP request object.");
    }

    var http_get = jsgui.http = fp(function(a, sig) {
        var method = 'GET';
        var url, callback;
        if (sig == '[s,f]') {
            url = a[0];
            callback = a[1];
        }
        if (sig == '[s,s,f]') {
            url = a[0];
            method = a[1].toUpperCase();
            callback = a[2];
        }
        var request = makeHttpObject();

        request.open(method, url, true);
        request.send(null);
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                // Perhaps parse that...
                console.log('request', request);

                var content_type = request.getResponseHeader('Content-Type');
                console.log('content_type', content_type);

                if (content_type == 'application/json') {
                    callback(null, JSON.parse(request.responseText));
                } else {
                    callback(null, request.responseText);
                }
                
            }
            
        };
    });

    // The page needs to get activated.

    console.log('Running jsgui-html-client');

    jsgui.Client_Page_Context = Client_Page_Context;

    var client_page_context = new Client_Page_Context();

    client_page_context.update_Controls('ctrl_resource', Resource_Control);
    client_page_context.update_Controls('object_viewer', Object_Viewer);
    client_page_context.update_Controls('number_viewer', Number_Viewer);



    // May need to load in other controls.
    //  Perhaps we need another client.js file for different situations.

    // When making a database resource, perhaps we need a database resource client page?
    //  Or to serve the normal client page, but with specified controls being loaded on the client.








    var resource_pool = client_page_context.resource_pool = new Client_Resource_Pool();


    // want to load the resource initially, getting the resource's name.

    var load_resource = function(callback) {
        console.log('load_resource');
        var href = window.location.href;
        console.log('href', href);

        var json_url = href + '.json';
        http_get(json_url, function(err, resource_data) {
            if (err) {
                throw err;
            } else {
                console.log('resource_data', resource_data);

                var resource_name = resource_data.resource.meta.name;
                console.log('resource_name', resource_name);


                var resource = new Client_Resource({
                    'meta': {
                        'name': resource_name
                    }
                });

                callback(null, resource);



            }
        })


    }

    load_resource(function(err, resource) {
        if (err) {
            throw err;
        } else {
            resource_pool.add(resource);

            resource_pool.start(function() {
                console.log('client-side resource pool started');
            });

            // Also need to load some controls into jsgui.
            //  This will be made easier somehow, but need to update a map within jsgui to include various controls which are used on the client.
            // While activating controls, jsgui looks at the data-jsgui-type attributes of controls.
            //  It tries to match the types it finds with the control types it has loaded.

            // In this case, some controls will need specific activation in order to operate properly.


            // 




            jsgui.activate(client_page_context);
            console.log('jsgui-html-client post activate');


            // This client could use websockets...

            //  Though we may well have socket communication routed through a central point, like the Resource_Pool.


            // Various components are going to communicate over websockets. They could go via a particular broker.
            //  Want to avoid multiple websocket connections per page at the moment.

            // However, a resource-client would likely not need more than one, or anythin that complicated.

            // And can connect to socks here.

            // Will probably pass an object to another function which handles the API.



            var sock = new SockJS('/ws');
            sock.onopen = function() {
                console.log('sock open');

                sock.send('Client started');
            };
            sock.onmessage = function(e) {
                console.log('sock message', e.data);

                var o_data = JSON.parse(e.data);

                // Need to reconstruct dates from the data recieved.




                // Want a way of parsing JSON data that also parses dates in ISO formats.
                // http://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime

                // Could have data about a resource property being changed.
                //  In which case, we change the value on the local resource.
                //  Event gets raised to listeners, (but does not tell the server? tells the server it has updated the value as instucted?)

                // So, we get the resource from the pool, and update the value within the resource.
                //  Not so sure this would need to do async set?

                // could be about a resource.

                // so, get the resource from the resource pool, and update its data.

                // Silent setting of resources...
                //  Set could mean different things.
                //  May want to set its value, and tell the client app about the new value.

                // .update()? 
                // .notify_change?
                //  not really setting it, but notifying it that it has changed?


                // Need to restore the data in the correct format, however the format may not be specified.
                //  If it is a string in the time format, it may be best to reconstitute it in that time format.
                //  In some cases we could tell by the field name.
                //  In some cases we could tell by carrying out a test on a string for the format.
                //   And then parse that string.

                // Also, data sent over websockets in JSON may need to be parsed somewhat.
                //  I think automatic parsing of dates will be a useful feature.






                // A type of set that is not initializing the set operation, and won't get it broadcast on the network, but updates the value.

                // Some resources would tell the server once they have been set on the client.

                // Would need client components to respond to it having been changed, but not telling the server that it's been set.
                // Different silence levels - silent to the server but not to the client side app?

                var resource_name = o_data[0];
                //console.log('resource_name', resource_name);

                var event_name = o_data[1];
                var property_name = o_data[2];
                var property_value = o_data[3];

                //console.log('1) property_value', property_value);

                if (property_value.__type == 'date-iso-8601') {
                    property_value = Date.fromString(property_value.value);
                }

                //console.log('2) property_value', property_value);


                var resource = resource_pool.get_resource(resource_name);
                //console.log('resource', resource);

                if (resource) {
                    // Need to be able to notify that it's changed from some kind of data authority?
                    // Central? Server?

                    // Internal Change to some extent?

                    resource.notify_change_from_server(property_name, property_value);
                    //  it may not really be the server though?

                    // or deal with other cases as they occurr.




                    //resource.
                }



                // .silent_set('time', value);



            };
            sock.onclose = function() {
                console.log('sock close');
            };

            // Also want it so that the client can listen to pings.

            // Will generally be sending JSON over websockets.

            // Will first make this so it can send and recieve clock pings.
            //  Want a resource on the client to be updated from the events on the server which get broadcast.







            // Also want this to access resources.

            // Think we will have a client side resource pool (by default?)
            


            // Possibly this should automatically activate on the client.

            

            //jsgui.Client_Page_Context = Client_Page_Context;

        }
    });



    // Add a single resource to the pool, pointing towards the resource's URL (it works that out somewhere?)

                

    return jsgui;




});


