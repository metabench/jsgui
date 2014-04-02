// jsgui-client

// The specific resource client .js file that runs first in the browser.


// the database resource client?
// May need different client apps for different resources.




if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};





define(["./jsgui-html-enh", "./client-page-context", "../resource/core/client-pool", "../resource/core/client-resource", 
    "../db/postgres/resource/database-control",
    //"../../../web/controls/advanced/viewer/object", "../../../web/controls/advanced/viewer/basic/number"
    ],
//define(["./jsgui-html"],


// And will use a Postgres DB Resource Control.
function (jsgui, Client_Page_Context, Client_Resource_Pool, Client_Resource, Postgres_Database_Resource_Control //,
    //Object_Viewer, Number_Viewer
    ) {

    var fp = jsgui.fp;

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

    client_page_context.update_Controls('postgres_database_resource', Postgres_Database_Resource_Control);

    var resource_pool = client_page_context.resource_pool = new Client_Resource_Pool();


    // want to load the resource initially, getting the resource's name.

    // Need to make the right client-side resource(s) in the pool.






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

                        'url': href,

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


                jsgui.activate(client_page_context);
                console.log('jsgui-html-client post activate');


            });



            


            /*

            var sock = new SockJS('/ws');
            sock.onopen = function() {
                console.log('sock open');

                sock.send('Client started');
            };
            sock.onmessage = function(e) {
                console.log('sock message', e.data);

                var o_data = JSON.parse(e.data);
                var resource_name = o_data[0];
                //console.log('resource_name', resource_name);

                var event_name = o_data[1];
                var property_name = o_data[2];
                var property_value = o_data[3];

                //console.log('1) property_value', property_value);

                if (property_value.__type == 'date-iso-8601') {
                    property_value = Date.fromString(property_value.value);
                }
                var resource = resource_pool.get_resource(resource_name);
                //console.log('resource', resource);

                if (resource) {
                    resource.notify_change_from_server(property_name, property_value);
                }
            };
            sock.onclose = function() {
                console.log('sock close');
            };
            */
        }
    });
    return jsgui;
});




/*
define(["./jsgui-html-enh"
    ],


// And will use a Postgres DB Resource Control.
function (jsgui) {

    var fp = jsgui.fp;

    
    //return jsgui;
});
*/