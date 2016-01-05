/**
 * Created by James on 03/01/2016.
 */


var jsgui = require('./jsgui-html')
//var Window = require('../../../../js/web/controls/advanced/window');
//var Start_Stop_Toggle_Button = require('../../../../js/web/controls/advanced/start-stop-toggle-button');
var Server_Page_Context = require("./server-page-context");

var Data_Object = jsgui.Data_Object;
var Collection = jsgui.Collection;


//var Simple_Authentication_Provider = Resource_Authentication.Simple_Provider;

var j = jsgui;
var Class = j.Class;



var Single_Page_App = Class.extend({
    'init': function(spec) {

        var name = spec.name;
        var port = spec.port;
        var ctrl_main = spec.ctrl_main;

        var server = new jsgui.Server.JSGUI_Server({
            '*': {
                'meta': {
                    'name': name
                }
            }
        });

        this.name = name;
        this.server = server;
        this.port = port;
        if (ctrl_main) this.ctrl_main = ctrl_main;

    },
    'start': function(callback) {
        var server = this.server;

        var rp = server.get('resource_pool');
        var ar = rp.get_resource('Server Router');
        var rt = ar.get('routing_tree');

        var name = this.name;

        var port = this.port;
        var ctrl_main = this.ctrl_main;

        //console.log('port', port);
        //throw 'stop';

        //console.log('callback', callback);
        //throw 'stop';

        var website_resource = rp.get_resource(name);
        var js = website_resource.get_resource('Site JavaScript');

        js.build_client(function(err, res_build_client) {
            if (err) { callback(err); } else {
                server.start(port, function(err, res_started) {

                    // Maybe it's best to use je-suis-xml for setting up the page.

                    // Set up jsgui-html-client-stylish within the js serving resource.
                    //  It gets served as if it's within /js/web


                    rt.set('/', function(req, res) {
                        // Better to make a proper JSGUI client document.

                        //console.log('main page request');

                        var server_page_context = new Server_Page_Context({
                            'req': req,
                            'res': res
                        });

                        var hd = new jsgui.Client_HTML_Document({
                            'context': server_page_context
                        });

                        hd.include_client_css();
                        hd.include_js('/js/app-bundle.js');

                        var body = hd.body();

                        // Will need to add the abstract control that has been given.


                        var ctrl_0 = server_page_context.make(ctrl_main);
                        body.add(ctrl_0);
                        ctrl_0.active();

                        //var ctrl_0 = new Control({
                        //    'context': server_page_context
                        //});
                        //ctrl_0.resizable();
                        //body.add(ctrl_0);
                        //ctrl_0.active();

                        // style should at least set the CSS.
                        //


                        hd.all_html_render(function(err, deferred_html) {
                            if (err) {
                                throw err;
                            } else {
                                //console.log('deferred_html', deferred_html);
                                var mime_type = 'text/html';
                                //console.log('mime_type ' + mime_type);

                                res.writeHead(200, { 'Content-Type': mime_type });
                                res.end(deferred_html, 'utf-8');
                            }
                        });
                    });

                    rt.setRoot404(function(req, res) {

                        res.writeHead(404, {"Content-Type": "text/html"});
                        res.write("<!DOCTYPE \"html\">");
                        res.write("<html>");
                        res.write("<head>");
                        res.write("<title>Page Not Found</title>");
                        res.write("</head>");
                        res.write("<body>");
                        res.write("<h1>Page Not Found</h1>");
                        res.write("</body>");
                        res.write("</html>");
                        res.end();

                    });

                    callback(null, true);

                    // We should be able to put info into the db.

                });
            }

        });


    }
})


module.exports = Single_Page_App;