//if (typeof define !== 'function') {
//    var define = require('amdefine')(module);
//}

// This Resouce should maybe be changed so it does not have an HTML or HTTP interface (to start with?)
//  The main focus of this resource should be to administer website data, and the resource could be connected to in the standard way that resources get connected to.
//  At least use a generalised resource admin HTTp interface, then extend that for this resource where necessary.
//   Much of the website would be nested information anyway.

// Flexidoc_Editor

/*

define(['../web/jsgui-html', 'os', 'http', 'url', './core/resource', '../web/server-page-context',
        'multiparty', 'util',
        'fs', '../fs/jsgui-node-fs2-core',
        '../web/jsgui-je-suis-xml', 'cookies',
        '../web/controls/advanced/web-admin',
        '../web/controls/advanced/web-admin-images',
        '../web/controls/advanced/file-upload'],

	// May make a Site-Info or just Info resource.
	//  That would be in the resource pool and deal with the various pieces or Info that will get displayed in the website.
	//   It's a way of accessing all the information in the website.

	//  Would be possible to set the website's info too.
	//   Other resources, such as Web-Admin would allow read-write access to the info.
	//   Other resources would access the info (may be a way of just requesting read-only access)
	//    Or having it so that setting the info requires some authentication and authorization.


	// This could expose both REST and HTML interfaces.



	function(jsgui, os, http, libUrl, Resource, Server_Page_Context,
             multiparty, util,
             fs, fs2,
             JeSuisXML, Cookies,
             Web_Admin_Control, Web_Admin_Images_Control, File_Upload) {
*/

var jsgui = require('../web/jsgui-html');
var os = require('os');
var http = require('http');
var url = require('url');
var Resource = require('./core/resource');
var Server_Page_Context = require('../web/server-page-context');
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');
var fs2 = require('../fs/jsgui-node-fs2-core');
var JeSuisXML = require('../web/jsgui-je-suis-xml');
var Cookies = require('cookies');
var Web_Admin_Control = require('../web/controls/advanced/web-admin');
var Web_Admin_Images_Control = require('../web/controls/advanced/web-admin-images');
var File_Upload = require('../web/controls/advanced/file-upload');
var Flexidoc_Editor = require('../web/controls/advanced/flexidoc-editor');

	
	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;
	
	var exec = require('child_process').exec;

	// This resource may also provide a RESTful interface for administering the resources on the website.
	//  The client resource pool could then connect to this, and provide a system to make async js calls rather than
	//  having to deal with the transport mechanism.


	// File system admin will likely be a specialised resource, not using a generic resource admin interface.

	// This will also process requests.
	//  Would likely have a client-side web admin component too.
	// This could use a more general Resource protection system, so it authenticates automatically?

	var Resource_Web_Admin = Resource.extend({

        'fields': {
            'web_database': Object
        },

		
		'init': function(spec) {
			this._super(spec);
		},

        // Hmmmm... may be better to do some of these things through the website resource itself?
        //


		'start': function(callback) {
			callback(null, true);
		},

        // Also needs functionality that gets website data, likely calling / interfacing the web data db module.
        //  Don't want various controls talking to the web data db, communication needs to go through the web data resource.
        //  Will later work on serving functionality from this resource. Much of the functionality will be app-internal for the moment.

        // get images_original_size_tree

        // want the tree that has the original size images at the top, but information on the resized versions.
        //  we may be using the resized versions for various purposes to represent the original version in the GUI.







        'get_images_list': function(callback) {
            var web_db = this.get('web_database');
            web_db.get_images(function(err, res_images) {
                if (err) {
                    callback(err);
                } else {
                    console.log('res_images', res_images);
                    callback(null, res_images);
                }
            })
        },

        'get_images_tree': function(callback) {
            var web_db = this.get('web_database');
            web_db.get_images_tree(function(err, res_images) {
                if (err) {
                    callback(err);
                } else {
                    console.log('res_images', res_images);
                    callback(null, res_images);
                }
            })
        },


        'get_flexidocs_list': function(callback) {
            var web_db = this.get('web_database');
            web_db.get_flexidocs(function(err, res_images) {
                if (err) {
                    callback(err);
                } else {
                    console.log('res_images', res_images);
                    callback(null, res_images);
                }
            })

        },






        // And the web admin resource needs to be processed in the right context.

		// Currently this is all about processing requests - I think it should be about having a Resource that represents the website's admin functionality, but to actually
		//  administer the application would use both general purpose resource clients as well as a customised one for administering a website.

        // process with context

		'process': function(req, res) {

            console.log('arguments.length ' + arguments.length);
			
			console.log('Resource_Web_Admin process');

            var rmethod = req.method;





			var rurl = req.url;



			//if (rurl.substr(rurl.length - 1) == '/') rurl = rurl.substr(0, rurl.length - 1);

			console.log('rurl', rurl);

			// Then could do some internal routing based on the URL.
			//  Don't want to make this complicated to begin with.
			//   Not going for client-side routing either (right now).





			var pool = this.meta.get('pool');


            var web_db = this.get('web_database');


            var images_resource = pool.get_resource('Site Images');
            // could get the database from the pool
            // rather than direct linking.
            //  could then make more intelligent use of the pool, such as using a file system.

            //




			// should have a bunch of resources from the pool.
			//console.log('pool ' + pool);

			// At the root, this should show an admin page.

			// Then this control gives access to the info resource, from the pool.

			var info = pool.get_resource('Info');
			//console.log('info ' + info);

			// Thinking that the admin resource could publish / enable access to the Info resource.
			//  Resources don't always have web admin.

			// I think a Resource-Publisher would be good so that resources can be accessed with HTTP requests.
			//  So, create the Resource_Publisher, give it the resource, and then connect it to a URL route.

			// A content items table may be quite useful to have.
			//  Stores object types...
			//  So can get a group
			//   And a group will have a variety of items inside it.

			






			// An Info / Data resource should be possible to administer using a fairly generic tool.

			// We need a website info resource to administer.
			//  That info resource could be set to interface with other data sources.

			// I think there can be a DB-agnostic info resource.
			//  It will then connect to particular databases.

			// Such as an Info resource connecting to Resource_Mongo
			//  Not quite sure what place the info resource takes, it may provide a schema for the web db.
			//  May want some kind of interface/resource over the info one to make it into a website info resource.


			// Setting up the website's information resource seems like a priority.

			// All sites have a fairly generaic info resource.
			//  They then use resource-[specific-db] to persist the data.

			// Ensuring the database is set up could be a step in starting up the server
			//  Though this would be done through the resources system.

			// The specific server will set up the info resource to connect with a particular database resource.



			// Data for the site may also be exposed through the admin interface.
			//  In other cases, the site can have data interfaces.

			// Want one of the main components of the page to be a tree that shows the site's data.

			// Maybe I can make it show the whole expanded tree on the server... that could get very big for big sites.

			//  Want a simple way of navigating the site.
			//  Want access to the Data_Objects and Collections that represent the website.

			// I think an info resource would be a good thing to start with.
			//  It can load the info I have, and then could be editable through the admin interface.

			// Also, an Info-Persist system may be good.
			//  Then want interfaces from that to the various DBMSs.

			// I think more work on the flexible DB side of things is needed now.

			// The website info just needs an object interface.
			//  Need a fairly general purpose interface to DBs.


			// could connect to a resource-mongo.
			//  Then use get and set to access values in collections.
			//  Maybe some more resource verbs too, to match RESTful http.

			// POST is like JS push
			// PUT is like set


			// Could show the same admin control for all routes?
			//  There could be admin/files in particular.


			// Should show an admin page.

            // May not need to make a page.

            var spc, hd, body;

            if (rmethod == 'GET') {
                spc = new Server_Page_Context({
                    'req': req,
                    'res': res,
                    'pool': pool
                });
                hd = new jsgui.Client_HTML_Document({
                    'context': spc
                });
                hd.include_client_css();
                //hd.include_jsgui_client('/js/app.js');

                hd.include_jsgui_client('/js/app_bundle.js');

                body = hd.body();

                do_jsgui_render = true;
            }

			//this.respond(spc);

			// Not so sure about this responding exclusively with an HTML document.
			//  It may be required to act as a JSON or even XML service at some point.

			// Maybe something else will make the server's resource pool available?

            // Not necessarily....

			
			// need to have the login control.
			//  Should be fairly simple... but need to be collecting the login information.
			
			// Login control contains a form?
			//  That could be an option maybe.

			// Then show different controls depending on the specific route.
			//  The web admin (page) control could be fairly generic.

			// Thinking that a 'content' admin control may be good.
			//  Then content/structure
			//  content/pages
			//  content/pages/pageId or page url name

			// Structure could be used to define the site's menus.
			//  Maybe there is the root group
			//   Then there can either be a group or a page at each level
			//    Consultancy is the only page in the root group.

			// Think we need drag and drop interface, dragging both group items and page items.
			//  A toolbox.
			// Ability to create new items easily.
			//  + icons in places where they can be created.
			// So in the root group we just have a plus item
			//  Click it to create either a group or a page.
			//   Possibly drag existing pages into the structure.
			//    Have a pages viewer.

			// The content editor could allow editing of both pages and structure.
			//  Will be possible to view either the structure or a page by itself.


			// Having some kind of a control panel would be useful here.
			//  Panel on the left, likely for navigation.
			//  Main panel used for displaying and editing content.

			// A server admin interface is what we are after here.
			//  Want to be able to administer the resources on the server.
			//   Also access the resources that the server has access to.

			// Ideally want to be able to edit some JSON or other data in a remote database, with that
			//  controlling the web server.

			// Web_Admin allowing generic access to resources in the resource pool?
			//  That will be nice.

			// The resource pool would need its administration to be externally published though.

            console.log('rurl', rurl);


			if (rurl == '/admin/') {
                // Want to use the web admin control here.

                console.log('pre create web admin control');

				var ctrlAdmin = new Web_Admin_Control({
					'context': spc
				});

                // I think it will need to use asyncronous rendering.

                //console.log('post create web admin control');
				// oh... when the body is created, it does not have a context.
				//  need to be able to assign it, and sub-controls a context
				
				// Could use activate?
				ctrlAdmin.active();
				body.add(ctrlAdmin);

                console.log('post add wa control to body');
			}

            if (rurl == '/admin/images/') {
                // Want to use the web admin control here.

                console.log('pre create web admin images control');

                // Could show a particular control or page control for administering

                // Web_Admin_Images Control.
                //  It will:
                //    show a list of all images
                //    allow selecting an image (possibly multiple) from the list
                //    possibly have a thumbnail view (both navigation section and full)
                //    show the image in a main section
                //    allow viewing and editing of metadata

                // Use a Web Admin Images control

                //  Would have a list of images in the navigation panel.
                //   Then have image itself in content panel.





                // But then for other URLs, admin images then with any file name after...
                //  Need to serve the particular image.






                var ctrlAdmin = new Web_Admin_Images_Control({
                    'context': spc,
                    'web_admin': this
                });

                // I think it will need to use asyncronous rendering.

                //console.log('post create web admin control');
                // oh... when the body is created, it does not have a context.
                //  need to be able to assign it, and sub-controls a context

                // Could use activate?
                //  Can't generate a new ID for some things?
                //   I will make the core html code more flexible, but we should not be having some problems to begin with.
                //   Seems some contexts are not set right....



                //ctrlAdmin.active();


                body.add(ctrlAdmin);

                console.log('post add wa control to body');
            } else {
                if (rurl.indexOf('/admin/images/') > -1) {
                    // if it's GET, return the image

                    // Need to handle HTTP delete as well.




                    // return the image

                    do_jsgui_render = false;

                    var img_url = rurl.substr('/admin/images/'.length);
                    console.log('img_url', img_url);

                    // then get the image data from the image resource.

                    images_resource.get_document(img_url, function(err, res_got_image) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('res_got_image', res_got_image);

                            // then serve the image...

                            // perhaps that could be done within the image resource, have it respond to an HTTP request.

                            var mime_type;

                            if (res_got_image.type == 'jpeg') {
                                mime_type = 'image/jpeg;'



                            }

                            if (mime_type) {
                                res.writeHead(200, { 'Content-Type': mime_type });
                                //console.log('pre res end');
                                res.end(res_got_image.value);
                                //console.log('post res end');
                            }



                            //throw 'stop';
                        }
                    })



                }

            }

            //throw 'stop';

            if (rurl == '/admin/upload-image/') {

                // Different depending if a GET or POST.

                if (req.method == 'POST') {
                    console.log('posted upload image');

                    // May be better not to use formidable, and to parse the data myself.

                    var buf;
                    var buf_pos = 0;
                    var count = 0;
                    var l = 0;
                    var form = new multiparty.Form();
                    var filename;

                    form.on('part', function(part) {
                        // You *must* act on the part by reading it
                        // NOTE: if you want to ignore it, just call "part.resume()"
                        console.log('part', part);
                        buf = new Buffer(part.byteCount);
                        buf_pos = 0;
                        console.log('part.byteCount', part.byteCount);
                        if (part.filename === null) {
                            // filename is "null" when this is a field and not a file
                            console.log('got field named ' + part.name);
                            // ignore field's content
                            part.resume();
                        }

                        if (part.filename !== null) {
                            // filename is not "null" when this is a file
                            count++;
                            //console.log('got file named ' + part.name);

                            filename = part.filename;
                            // ignore file's content here
                            part.resume();
                        }

                        part.addListener('data', function(data) {
                            // ...
                            console.log('data', data);

                            l += data.length;

                            var len_data = data.length;
                            console.log('len_data', len_data);

                            data.copy(buf, buf_pos);
                            buf_pos += len_data;

                        });
                    });

// Close emitted after form parsed
                    form.on('close', function() {
                        console.log('Upload completed!');
                        console.log('l', l);


                        // And let's ave buf...

                        // Don't have to just write it like that.

                        // key, mime_type, value, callback

                        //throw 'stop';

                        // the web db resource, and the db resource, need to have started.


                        // 'image/jpeg'

                        // It really needs the file name
                        //  should be able to get that from multyparty.

                        //var filename = part.filename;
                        console.log('filename', filename);
                        //throw 'stop';


                        // Should have some logic to check if the filename is available, otherwise could keep trying adding a _number to it.


                        // Now we have the image in a buffer, we can use the Site_Images resource to set the document.
                        //  When we give that Resource an Image document, it acts accordingly.
                        //  This way the image particular stuff is encapsulated away from the database, thus making it easier to swap the db component
                        //   for a different one.

                        // web_db.set_document
                        // images_resource


                        // It could probably tell it's a jpeg, but tell it that anyway.

                        // This will also deal with the resized versions.
                        //  Possibly set_source_document, to show that it's supposed to make the other documents from it...?
                        //   Or just have that automaticlly apply to images (and other media)

                        images_resource.set_document(filename, buf, 'jpeg', function(err, res_set_document) {
                            if (err) {
                                throw err;
                            } else {
                                //throw 'stop';

                                console.log('res_set_document', res_set_document);

                                // Not sure any more needs to be done here.



                            }
                        });


                        /*
                         fs.writeFile("out.jpg", buf, function(err) {

                         if (err) {
                         //console.log(err);
                         throw err;
                         } else {
                         console.log('file saved to out.jpg');
                         }
                         });
                         */





                        res.setHeader('content-type', 'text/plain');
                        res.end('Received ' + count + ' files');
                    });

                    form.parse(req);

                    /*

                     form.parse(req, function(err, fields, files) {
                     res.writeHead(200, {'content-type': 'text/plain'});
                     res.write('received upload:\n\n');
                     res.end(util.inspect({fields: fields, files: files}));

                     // then look at the file object.

                     var file = files.file[0];

                     console.log('file.length ' , file.length);
                     console.log('file', file);

                     });
                     */



                    // Do it without saving files?

                    // going to use multiparty instead.


                    /*
                     var form = new formidable.IncomingForm();

                     form.on('progress', function(bytesReceived, bytesExpected) {
                     console.log('progress ' + bytesReceived + ' / ' + bytesExpected);
                     });
                     */

                    /*

                     form.on('end', function() {
                     console.log('form upload end');

                     // and then we should have the image in a buffer.

                     require("fs").writeFile("out.jpg", buf, function(err) {

                     if (err) {
                     //console.log(err);
                     throw err;
                     } else {
                     console.log('file saved to out.jpg');
                     }
                     });


                     });

                     form.onPart = function(part) {

                     console.log('on part');
                     console.log('1) this.multiples', this.multiples);

                     console.log('this.bytesExpected', this.bytesExpected);

                     buf = new Buffer(this.bytesExpected);


                     // Should not have to read the whole thing to get the file size.

                     console.log('part', part);

                     // Maybe hack into formidable to change what it's doing.

                     // We will know the part length.



                     part.addListener('data', function(e_data_part) {

                     console.log('2) this.multiples', this.multiples);
                     // ...

                     console.log('e_data_part', e_data_part);

                     var len_data = e_data_part.length;

                     e_data_part.copy(buf, buf_pos, len_data);
                     buf_pos += len_data;





                     // And it probably does not write that to disk?

                     // write this to a file stream?
                     //  or db stream?

                     // Variable size buffer???
                     //  Can we get the size first?


                     });
                     }

                     */


                    /*
                     form.on('file', function(name, file) {
                     console.log('has form file. name:', name);
                     console.log('this.multiples', this.multiples);

                     // Want to disable saving to the disk automatically.
                     //  Want the stream / data.

                     if (this.multiples) {
                     //if (files[name]) {
                     //    if (!Array.isArray(files[name])) {
                     //        files[name] = [files[name]];
                     //    }
                     //    files[name].push(file);
                     //} else {
                     //    files[name] = file;
                     //}
                     } else {
                     //files[name] = file;
                     }
                     })
                     */

                    // But does not parse it into files if we are doing the direct reading.
                    /*
                     form.parse(req, function(err, fields, files) {
                     // We really want to be saving this file / image to the database.

                     // This will have a reference to the web-database resource.
                     //  It will be possible to put files as values.
                     //  They will be stored with the right metadata and mime type.

                     //var ws_file = files.file._writeStream;

                     res.writeHead(200, {'content-type': 'text/plain'});
                     res.write('received upload:\n\n');
                     res.end(util.inspect({fields: fields, files: files}));

                     });

                     */

                }
                if (req.method == 'GET') {
                    var ctrl_file_upload = new File_Upload({
                        'context': spc,
                        'action': '/admin/upload-image/',
                        'autosubmit': true
                    });

                    ctrl_file_upload.active();

                    body.add(ctrl_file_upload);
                }

                // Want to use the web admin control here.

                console.log('pre create web admin upload image');

                // File_Upload



                // Will use a file upload control.
                // <input type="file" name="datafile" size="40">
                // <input type="submit" value="Send">



            }

            if (rurl == '/admin/new-flexidoc/') {

                // Different depending if a GET or POST.

                if (req.method == 'POST') {

                }
                if (req.method == 'GET') {
                    // Show a Flexidoc editor control
                    //  Is it a Page Control?
                    //   I think it will be a Flexidoc Editor in its maximum view mode.

                    var flexidoc_editor = new Flexidoc_Editor({
                        'context': spc
                    });

                    body.add(flexidoc_editor);

                }
            }

            // Want to be administering content.
            //  A list of pages would be good.
            //  I think a Page-List control?
            //   Though, a general list control / system and advanced data binding will work.
            //  Maybe the Page-List can be fairly minimial and make use of data binding.

            // I think managing images may be a better thing to start on.

            // Have something in the admin interface to upload an image.

            // admin/upload-image




            // Want the wen admin control to allow creation of pages
            // Uploading of images
            // Viewing and editing of website data.
            //

			// Content admin

			// Content structure admin
			if (rurl == '/admin/content/structure') {
				var ctrlAdmin = new Web_Content_Structure_Admin({
					'context': spc
				});
				// oh... when the body is created, it does not have a context.
				//  need to be able to assign it, and sub-controls a context
				
				// Could use activate?
				ctrlAdmin.active();
				body.add(ctrlAdmin);
			}


			// Content pages admin

			if (rurl == '/admin/content/pages') {
				var ctrlAdmin = new Web_Content_Pages_Admin({
					'context': spc
				});
				// oh... when the body is created, it does not have a context.
				//  need to be able to assign it, and sub-controls a context
				
				// Could use activate?
				ctrlAdmin.active();
				body.add(ctrlAdmin);
			}

			// Will be able to use a Page_Editor







			
			
			
			
			// When sending the client js...
			//  It will need to create the right object references.

			// I think we need to generate a page to send.
			//  It should not be all that complicated a page.

			// Maybe just generate the script.
			//hd.active();
			// making a document active...
			//  that means it creates a script to send.
			//  need to tell it what to do when the page starts, and make sure it has the right references.
			//   sounds tricky to do per individual page.

			// Perhaps for the moment I'll define this in the app.


			// and that will set the context of the login control.
			//  The body will already have its context set.
			
			// Is a lot going on here... will likely need to optimize some things.
			
			//  Then when the items are within their own context (._context has been set)
			//  they will not be a huge memory and slowdown leak.
			
			
			
			//var body_context = body._context;
			//console.log('body_context ' + body_context);
			
			
			// the dynamic reassignment of context for all nested controls...
			//  seems important to do.
			
			
			
			
			// Should not be getting slower on each request!
			
			
			// and serve that blank HTML document.
			console.log('pre all render');

            // Would asyncronous rendering work better?
			//var html = hd.all_html_render();

            // Only on (HTML) GET.



            if (rmethod == 'GET') {

                if (do_jsgui_render) {
                    hd.all_html_render(function(err, html) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('cb all render');

                            var mime_type = 'text/html';
                            //console.log('mime_type ' + mime_type);

                            res.writeHead(200, { 'Content-Type': mime_type });
                            console.log('pre res end');
                            res.end(html, 'utf-8');
                            console.log('post res end');
                        }
                    })
                }


            }










			
		}
	});
module.exports = Resource_Web_Admin;
	//return Resource_Web_Admin;
//});