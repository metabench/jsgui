/**
 * Created by James on 29/07/2014.
 */

// Want to get the core resources working and tested.
//  Want to run a clock website / service to start with.
//  The server could have a clock, while clients could connect to it and share the information.
//  Could also experiment with P2P distribution of the data.
//  A clock is also useful because it contains time signals so we can see how long it takes for data to reach various machines.


// A web resource in particular?
// Any need for an HTML resource?
//  Probably not - have web resource handle HTML and websockets.



if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// Resources could also have events which objects can listen to.
//  Programmatic objects can listen.
//  The resources may broadcast to whatever is listening.

// Also, maintaining one connection stream, communicating with multiple resources - could connect through a Resource Pool, or maybe there
//  could be a Multi Resource Publisher that publishes a bunch of resources.

// The Application router at the moment sending requests to resources.
//  I am thinking that rather than doing that, the requests should be handled by a resource publisher that interacts with the resource and publishes it over HTTP.

// Resources in general won't handle HTTP requests, though they will have the capability.
//  More likely that a resource, when it is served online, will be served using a Resource Publisher (which is itself a resource), which handles HTTP implementation details that would otherwise have
//  to be repeated between resources.




//define(["./jsgui-lang-util", './abstract-resource'], function(jsgui, AR) {

// Do this not with AMD?



define(["../../core/jsgui-lang-util", "./web", "./router", "./pool",
    "../web-admin", "./site-javascript", "./site-css",
    "../../db/resource/factory"], function(jsgui, Web_Resource, Router, Resource_Pool,
                                           Resource_Web_Admin, Site_JavaScript, Site_CSS,

                                           database_resource_factory) {

    var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Collection = jsgui.Collection;
    var is_defined = jsgui.is_defined, fp = jsgui.fp, stringify = jsgui.stringify, tof = jsgui.tof;
    var call_multiple_callback_functions = jsgui.call_multiple_callback_functions, call_multi = jsgui.call_multi;
    var each = jsgui.each;

    // Could maybe make a website resource as well?

    // It would publish a web db, I think.
    //  A website resource would contain a variety of requests.








    var Website_Resource = Web_Resource.extend({

        'init': function(spec) {

            console.log('Website_Resource spec', spec);

            // A website have a resource pool as well.

            var resource_pool = new Resource_Pool({});
            this.set('resource_pool', resource_pool);


            var database_spec = spec.database;

            var database_resource = database_resource_factory(database_spec);

            console.log('database_resource', database_resource);

            // use the Database Resource Factory.



            //

            // This needs to have a bunch of other resources inside it.

            // It will also need to handle requests based on the stored content.
            //  Need to be careful about how this is routed, so that the correct resources handle the responses.

            // The website db resource could have a specific entry for a given URL / path.
            //  In that case, we serve that page.

            // Then we check for other situations. Eg /admin, or image directories that get served from disk. Perhaps not images.
            //  Serve the jsgui CSS and JavaScript from disk... it could maybe check to serve particular JSGUI files first.

            // The whole routing will get more complicated, because we will still keep what was the Application_Router, but use it as a Server_Router, or Server_Process_Router perhaps.
            //  When it has routed to a particular application (perhaps the only application), that application's router has a chance to match pages.
            // Will check the DB, and may get info about dynamically generating a page.
            //  May also just get content to serve.

            // PUT, POST requests - also sent by the Server Router to the Application Router.
            // jsgui server could start with a single website resource?
            //  Or, the website resource is in the resource pool.
            //  I think giving each website resource its own resource pool makes the most sense.
            //  Also, encapsulating more in jsgui server would be good. Not needing much code at all in the app itself would be best.

            // Needs to have a router inside it.

            var router = new Router();
            this.set('router', router);

            var admin_web_resource = new Resource_Web_Admin({
                'meta': {
                    'name': 'Web Admin'
                }
            })

            var js_resource = new Site_JavaScript({
                'meta': {
                    'name': 'Site JavaScript'
                }
            });

            // has it set this?

            js_resource.meta.set('custom_paths.js/app☺js', './client/js/app.js');

            var css_resource = new Site_CSS({
                'meta': {
                    'name': 'Site CSS'
                }
            })

            resource_pool.push(admin_web_resource);



            // javascript and css resources.
            resource_pool.push(js_resource);

            resource_pool.push(css_resource);

            router.set_route('css/*', css_resource, css_resource.process);

            router.set_route('js/*', js_resource, js_resource.process);
            router.set_route('admin/*', admin_web_resource, admin_web_resource.process);

            /*
            resource_pool.push(new Site_Images({
                'meta': {
                    'name': 'Site Images'
                }
            }));
            */

            // set up the routes.







            if (!is_defined(spec)) spec = {};

            this._super(spec);

        },

        'start': function(callback) {

            // Need to wait until the database has started.

            console.log('pre call Website Resource start callback');
            callback(null, true);




            // needs various other resources to have started.

            // check the requirements

            //  check requirements recursive - checks the requirements of everything required, and if they have the check_requirements function, it uses that.
            //   I think using the system of names APIs will help here.

            // The web db resource needs to have been started.




            //throw 'no start function defined for web resource (subclass)'

        },

        'meets_requirements': function() {
            // Likely will be part of Status

            //return false;

            return true;
        },

        // Needs to be able to process HTTP requests. A bit like the Router in that way.
        'process': function(req, res) {
            console.log('website process request req.url', req.url);

            var remoteAddress = req.connection.remoteAddress;

            // Gets the website router...

            // use the router resource.

            //console.log('this', this);

            var router = this.get('router');

            // Not just have the router process it I think?
            //  Need to handle the 404 as well.

            // This needs to serve the basic jsgui js and css.



            //console.log('req', req);

            // Want to be able to look at the URL within the application.
            //  So we could have the application url path.
            //  Then subtract the existing URL from that app url path.


            //throw 'stop';

            // or do router.get?


            var res_process = router.process(req, res);

            //console.log('res_process', res_process);

            if (res_process === false) {
                // it's a 404, not found.

                // Perhaps call a 404 resource.

                // However, we may not have it in the router part...
                //  we can check the database file system to see if it's there.

                // Could get a JSON object from the DB, which will get published as a page.



            }





            /*
            var rt = this.get('routing_tree');


            var url_parts = url.parse(req.url, true);

            //var splitPath = url_parts.path.substr(1).split('/');

            var route_res = rt.get(req.url);

            var processor_values_pair;

            if (tof(route_res) == 'array') {
                processor_values_pair = route_res;
                var handler = processor_values_pair[0];
                var params = processor_values_pair[1];
                req.params = params;
                handler(req, res);

            } else if (tof(route_res) == 'function') {
                //

                route_res(req, res);

            }
            if (processor_values_pair) {

            }
            */


        }

    });

    return Website_Resource;
});



