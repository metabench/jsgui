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


var Site_Images = require('./site-images');


//console.log('1) Site_Images', Site_Images);

var jsgui = require('../../core/jsgui-lang-util');
var Web_Resource = require('./web');
var Router = require('./router');
var Resource_Pool = require('./pool');
var Resource_Web_Admin = require('../web-admin');


var Site_JavaScript = require('./site-javascript');
//console.log('1) Site_JavaScript', Site_JavaScript);
var Site_CSS = require('./site-css');
var Site_Static_HTML = require('./site-static-html');
var DB_Web_Resource = require('../../web/db-resource-postgres');
var database_resource_factory = require('../../db/resource/factory');


var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Collection = jsgui.Collection;
var is_defined = jsgui.is_defined, fp = jsgui.fp, stringify = jsgui.stringify, tof = jsgui.tof;
var call_multiple_callback_functions = jsgui.call_multiple_callback_functions, call_multi = jsgui.call_multi;
var each = jsgui.each;
/*
var fs2 = require('../../fs/jsgui-node-fs2-core');
var jsgui_jpeg = require('../../image/node/jsgui-node-jpeg');
var jsgui_png = require('../../image/node/jsgui-node-png');
var Worker = require('webworker-threads');
*/

    // Could maybe make a website resource as well?

//console.log('2) Site_Images', Site_Images);

    // It would publish a web db, I think.
    //  A website resource would contain a variety of requests.






    // Want to be able to run a website resource serving static files.
    //  Don't want too complicated configuration here.


var Website_Resource = Web_Resource.extend({

    'init': function(spec) {

        //console.log('Init website resource');
        //console.log('Website_Resource spec', spec);

        // speck could be a string, such as 'static'

        var t_spec = tof(spec);
        //console.log('t_spec', t_spec);


        // A website have a resource pool as well.

        var resource_pool = new Resource_Pool({});


        //console.log('this._.resource_pool', this._.resource_pool);

        //throw 'stop';



        // maybe there is not a database.
        var database_spec = spec.database;

        var web_database_resource;

        if (database_spec) {
            database_spec.name = database_spec.name || database_spec.database_name;

            var database_resource = database_resource_factory(database_spec);

            database_resource.start();

            // should start automatically when in the pool?
            //  does the pool need to be told to start?

            // Though probably don't want to start the resource on initialization.


            resource_pool.add(database_resource);

            web_database_resource = new DB_Web_Resource({
                'database': database_resource,
                'meta': {
                    'name': 'Web DB'
                }

            })
        }






        // should set the name of meta when we set this up.
        //  That should be part of the general resource code.







        //console.log('web_database_resource', web_database_resource);
        //console.log('web_database_resource.meta._.name', web_database_resource.meta._.name);
        //console.log('web_database_resource.meta._.name.value()', web_database_resource.meta._.name);

        // So why is the resource pool not indexing it by name



        //throw 'stop';
        if (web_database_resource) {
            resource_pool.add(web_database_resource);
        }


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



        this._router = router;
        // termorary fix to get/set problem.




        //var router_2 = this.get('router');
        //console.log('router_2', router_2);
        //throw 'stop';


        // May start an admin web resource without a database connection.


        // Maybe there is no web database resource?

        var spec_web_admin = {
            //'web_database': web_database_resource,
            'meta': {
                'name': 'Web Admin'
            }
        };

        if (web_database_resource) {
            spec_web_admin.web_database = web_database_resource;
        }



        var admin_web_resource = new Resource_Web_Admin(spec_web_admin);

        // Site images resource as well.
        //  The site images will interact with the web db resource, providing an API that deals with image metadata, possibly serving them too.
        //   This is a way of keeping non-db functionality out of the web db module.


        // Images, JavaScript, CSS.
        // Need a Static_HTML resource.



        //console.log('Site_Images', Site_Images);

        var img_resource = new Site_Images({
            'meta': {
                'name': 'Site Images'
            }
        });


        var js_resource = new Site_JavaScript({
            'meta': {
                'name': 'Site JavaScript'
            }
        });

        // Also want a static HTML server.
        //  Would serve index.html by default I think???
        //   Probably with the static or simplest settings.

        var static_html_resource;




        if (spec == 'static') {
            // Will need to serve the JavaScript and CSS directories anyway.
            //  They will generally have static content on a dynamic-html website.

            // The static setting means we set up serving HTML from the app's directory.
            //  Only using JSGUI to serve what is there (for the moment)
            //  Potentially jsgui could be used to edit a static site.

            // Set up and use the static HTML resource.

            // Maybe should be set up anyway?
            //  Not always needed!

            static_html_resource = new Site_Static_HTML({
                'meta': {
                    'name': 'Static HTML'
                }
            });

            resource_pool.push(static_html_resource);

            // Perhaps set it up with the specific files (automatically)?
            //  Probably with the index.html










        }





        // Want to maybe set up the js_resource so that it serves static files from a directory.

        // has it set this?

        js_resource.meta.set('custom_paths.js/app☺js', './client/js/app.js');
        js_resource.meta.set('custom_paths.js/app_bundle☺js', './client/js/app_bundle.js');

        var css_resource = new Site_CSS({
            'meta': {
                'name': 'Site CSS'
            }
        })

        resource_pool.push(admin_web_resource);



        // javascript and css resources.
        resource_pool.push(img_resource);
        resource_pool.push(js_resource);

        resource_pool.push(css_resource);

        router.set_route('css/*', css_resource, css_resource.process);

        router.set_route('js/*', js_resource, js_resource.process);
        // As well as this, it could get the JavaScript resource to serve the JavaScript from the app's js directory.


        js_resource.serve_directory('js');


        router.set_route('img/*', img_resource, img_resource.process);
        router.set_route('images/*', img_resource, img_resource.process);


        // The website (admin) resource will make use of the images resource where necessary.

        // The website (admin) resource will be able to get the images resource from the resource pool.


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
        //console.log('pre super');
        Web_Resource.prototype.init.call(this, spec);

        this.set('router', router);
        this.set('resource_pool', resource_pool);

        // Super call was not working for some reason.





        //this._super(spec);

    },

    'get_resource': function(resource_name) {
        var resource_pool = this.get('resource_pool');
        //console.log('resource_pool', resource_pool);

        //console.log('this._.resource_pool', this._.resource_pool);

        //throw 'stop';
        return resource_pool.get_resource(resource_name);
    },

    'start': function(callback) {

        // Need to wait until the database has started.

        console.log('pre call Website Resource start callback');

        // start the db / web db resources?

        // start the resource pool?

        var resource_pool = this.get('resource_pool');
        resource_pool.start(callback);


        //callback(null, true);




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
        //console.log('website process request req.url', req.url);
        //throw 'stop';

        var remoteAddress = req.connection.remoteAddress;

        // Gets the website router...

        // use the router resource.

        //console.log('this', this);

        //console.log(new Error().stack);
        //throw 'stop';

        //console.log('this', this);
        //throw 'stop';

        var router = this._router;


        //var router = this.get('router');


        //console.log('router', router);

        // Not just have the router process it I think?
        //  Need to handle the 404 as well.

        // This needs to serve the basic jsgui js and css.



        //console.log('req', req);

        // Want to be able to look at the URL within the application.
        //  So we could have the application url path.
        //  Then subtract the existing URL from that app url path.


        //throw 'stop';

        // or do router.get?

        //console.log('pre router process');

        var res_process = router.process(req, res);

        // But then does anythin get returned?

        //console.log('website router res_process', res_process);

        if (res_process === false) {
            // Perhaps it's one of the static HTML files?
            //  Could try to process it using static HTML?
            //  Or an internal change / proxy from / to /index.html

            // These will possibly be base level page requests, just looking for the file on disk and serving it.

            // At this point we hand it off to the static HTML processor.
            //  Need some more root directory level handling, but the main processing system is about setting up paths and dealing with parameters.

            //
            // Special case of '/'

            if (req.url == '/') {
                // Send this to the static HTML processing system.

                var static_html_resource = this.get('resource_pool').get_resource('Static HTML');
                //console.log('static_html_resource', static_html_resource);

                // And lets get the static resource to process it

                if (static_html_resource) {
                    static_html_resource.process(req, res);
                }


            }






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

    //return Website_Resource;
//});



module.exports = Website_Resource;
