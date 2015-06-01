/*

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../web/jsgui-html', 'os', 'http', 'url', './core/resource', '../web/jsgui-je-suis-xml', 'cookies',
	'../resource/web-admin', '../web/controls/advanced/file-manager'],

	function(jsgui, os, http, libUrl, Resource, JeSuisXML, Cookies,
		Resource_Web_Admin, File_Manager_Module) {
*/

var jsgui = require('../web/jsgui-html'), os = require('os'), http = require('http'), libUrl = require('url'), Resource = require('./core/resource'), JeSuisXML = require('../web/jsgui-je-suis-xml'), Cookies = require('cookies'),
  Resource_Web_Admin = require('../resource/web-admin'), File_Manager_Module = require('../web/controls/advanced/file-manager');

	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;

	var exec = require('child_process').exec;

	// File system admin will likely be a specialised resource, not using a generic resource admin interface.

	// This will also process requests.
	//  Would likely have a client-side web admin component too.

	var File_Manager = File_Manager_Module.File_Manager;



	var Resource_File_System_Web_Admin = Resource_Web_Admin.extend({

		'init': function(spec) {
			this._super(spec);


		},
		'start': function(callback) {

			// This is likely to be using an item from the resource pool.
			// Will be using the local file system resource.
			//  Possibly will be made to rely on it to start.

			callback(null, true);
		},
		'process': function(req, res) {
			// Need to look at subpaths too.
			//  Need to serve the correct JavaScript files.
			//   Will use a client-side JavaScript server (resource) for this.
			//   Resources help because they are available through the pool.
			//    In this case, a resource will be a Client Side JavaScript resource.
			//     It will process the requests when it is routed to that.
			//      It's not really a subresource - it exists within the pool.
			//       However

			// looking at the directory...
			//  it may be clear a JavaScript file needs to be returned.

			var url_parts = libUrl.parse(req.url, true);
			//console.log('url_parts ' + stringify(url_parts));

			// This can do a lot of determination about where in the app the logic needs to go.
			// We could also tell if it is requesting something using a REST interface.
			// It could be object.json

			var splitPath = url_parts.path.substr(1).split('/');

			// May also want to see what response type is wanted.
			//console.log('splitPath ' + stringify(splitPath));
			//console.log('Resource_File_System_Web_Admin process');
			// Here we put accross a whole document.
			//  It's a single page application (though it could change page with pushstate).

			// will need to find the path of what it's administering.
			var pool = this.meta.get('pool');
			var lfs = pool.get_resource('Local File System');

			//console.log('lfs ' + lfs);

			// Should probably use a Document control or similar.
			var spc = new jsgui.Server.Page_Context({
                 'request': req,
                 'response': res,
                 'rendering_mode': 'html5'
            });

			var doc = new jsgui.Client_HTML_Document({'context': spc});


			//doc.include_jsgui_client('/js/test-document-client');
			doc.include_jsgui_client('/js/jsgui-client');
			// that could just go to the /js directory, not a relative path from that location.



			var body = doc.body();

			var fm = new File_Manager({
				'context': spc
			})


			// And give the file manager the root directory info.
			//  We can get this from the file system resource.

			//var lfs_root = lfs.get('/', function());
			lfs.get('/', function(err, lfs_root) {
				if (err) {
					throw err;
				} else {
					console.log('lfs_root ' + stringify(lfs_root));

					fm.set('root_directory', lfs_root);

					var bodyContent = body.content();

					// want to add a control that deals with the file system.
					//  The initial rendering of the control will be on the server.
					//   On the client, it will connect to the resource system.
					//    Hopefully not much code will be needed for that connection, the code there will be abstracted
					//    and generalised.
					//console.log('bodyContent ' + tof(bodyContent));
					//console.log('bodyContent ' + stringify(bodyContent));
					//bodyContent.add('Hello World');
					doc.body().content().add(fm);
					//console.log('bodyContent ' + stringify(bodyContent));

					// create a File_System_Admin control.
					//  File_Manager?
					//   That was done without the Fields capability.
					//   Fields would make the control definitions shorter, but may need more work as well.


					res.writeHead(200, {'Content-Type': 'text/html'});
					var html = doc.all_html_render();
					//console.log('html ' + html);

		  			res.end(html);
				}
			});




			//


			// Let's add an instance of a file system admin control.

			//  In theory we could use a Resource_View control, that would be fairly general.

			// The file system web admin control would need to be able to access the file system.
			//  Making the file system available as a resource that can be addressed over the internet
			//   makes sense.

			// Get and set will be a lot of use for this.
			//  That means there is something for the client to talk to.
			//   It will still access it as a resource on the client, but in that context it will be a
			//   remote resource.

			// The first step is the initial render, where the control and the file system resource are
			//  both running on the (same? dist?) server.


			//console.log('body ' + body);


			//server.serve_document(req, res, doc);


		}
	});
	//return Resource_File_System_Web_Admin;
//});
module.exports = Resource_File_System_Web_Admin;
