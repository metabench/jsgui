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










if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};


define(["./jsgui-html-enh", "./client-page-context", "../resource/core/client-pool",
    "./controls/advanced/window", "./controls/advanced/horizontal-menu", "./controls/advanced/menu-node"],
//define(["./jsgui-html"],
function (jsgui, Client_Page_Context, Client_Resource_Pool, Window, Horizontal_Menu, Menu_Node) {

    //console.log('jsgui', jsgui);
    var fp = jsgui.fp;
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



    jsgui.http = fp(function(a, sig) {
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

    client_page_context.update_Controls('window', Window);
    client_page_context.update_Controls('horizontal_menu', Horizontal_Menu);
    client_page_context.update_Controls('menu_node', Menu_Node);

    var resource_pool = client_page_context.resource_pool = new Client_Resource_Pool();

    resource_pool.start(function() {
        console.log('client-side resource pool started');
    })

    jsgui.activate(client_page_context);
    //console.log('stylish jsgui-html-client post activate');

    var mc = client_page_context.map_controls;
    console.log('mc', mc);

    var ctrl_0 = mc['control_0'];



    /*

    ctrl_0.style('background-color', '#ABCDEF');

    // Should change the inline CSS as seen on the screen.


    // Now we can work within the document, on the client-side.
    ctrl_0.on('click', function(e_click) {
        console.log('e_click', e_click);
        
        ctrl_0.style('background-color', '#ABEFCD');
    })

    */






    // Also want this to access resources.

    // Think we will have a client side resource pool (by default?)
    


    // Possibly this should automatically activate on the client.

    

    //jsgui.Client_Page_Context = Client_Page_Context;

    return jsgui;




});


