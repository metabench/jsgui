define(["jsgui-html"], function(jsgui) {
	
	// What's the platform
	//  What's the version number?
	
	// Test if node features are supported?
	
	
	
	
	
	// May need to load browser specific html processing as well.
	//  Would need the various rendering systems working side-by-side.
	
	jsgui.ServerPageContext = jsgui.PageContext.extend({
		'init': function(spec) {
			spec = spec || {};
    		if (spec.req) {
    			this.req = spec.req;
    			this.request = spec.req;
    		} else if (spec.request) {
    			this.req = spec.request;
    			this.request = spec.request;
    		};
    		if (spec.res) {
    			this.res = spec.res;
    			this.response = spec.res;
    		} else if (spec.response) {
    			this.res = spec.response;
    			this.response = spec.response;
    		};
    		this._super(spec);
		}
	});
	
	// And make a server class... What about using the Express server?
	
	// Static Server?
	
	// Have server functions that serve different types of files or requests?
	//  jssapi
	
	// Serving documents for the site by path...
	//  That's one common setup
	//  Or serving by routes / different regexes on the URL.
	
	// Specify things as Resources - like a document. That document could be given a URL like Drupal, or URL worked out from resource description.
	
	// Should probably treat URLs or URL prefixes as resources.
	//  We could make a basic resource class - could have a path (though path could be generated)
	//  The server contains resources (like directories)
	//  
	
	// FileServer could be a type of ResourceServer.
	
	var Class = jsgui.Class;
	
	// Extend DataObject?
	
	
	// But the server itself...
	//  Needs to start after being configured.
	
	// The server could work out its own network IP, hopefully.
	
	// The whole server.
	//  Wraps a more specific server.
	jsgui.Server = Class.extend({
		'init': function(spec) {
			// The basic server.
			//  Will handle JSGUI functionality, fairly standard configuration.
			
			// Will pass on the request and response objects. (maybe a response server???). Request_Processor
			
			// Creating this server should allow a site to function 'out-of-the-box'
			//  Will handle static web content.
			
			// Will use an Active Page Server or something similar.
			//  Page_Server
			//  RR_Server = Request_Response_Server / RRP for Processor
			
			// Set the root resource as a Page_Server.
			
			
			
			
		},
		'start': function () {
	        var that = this;

	        var net_ip = get_network_ip();

	        var start_server = function(ip) {
	            http.createServer(function (req, res) {
	                //res.writeHead(200, {'Content-Type': 'text/plain'});
	                // need to do some path comprehension.
	                i2 = libUrl.parse(req.url);
	                var url = i2.href;
	                console.log('url: ' + i2.href);
	                var ua = req.headers['user-agent'];
	                console.log('ua: ' + ua);
	               
	                
	                
	                // Don't know about just removing that? Or the first bit of the path specifies the app?
	                // remove it for now.
	                
	                
	                
	                var process_app_url = function (app_name, url_in_app, callback) {
	                    console.log('url_in_app ' + url_in_app);
	                    console.log('url_in_app.length ' + url_in_app.length);
	                    if (url_in_app == '' || url_in_app == '/') {
	                        var s_date = new Date().toUTCString();
	                        res.writeHead(200, {
	                            'Content-Type': 'text/html',
	                            //'Content-Encoding': 'gzip',
	                            'Cache-Control': 'max-age=3600000',
	                            'Expires': 'Thu, 30 Oct 2014 14:19:41 GMT',
	                            'Date': s_date,
	                            'Connection': 'close'//,
	                            //'ETag': ETag
	                        });
	                        res.end('<html><head></head><body><p>host_name: ' + host_name + '</p></body></html>');
	                    } else if (url == '/examples/printer') {
	                        res.statusCode = 301;
	                        res.setHeader("Location", "/examples/printer/");
	                        res.end();
	                    } else {
	                        splitPath = url_in_app.split('/');
	                        console.log('splitPath.length ' + splitPath.length);
	                        var st = '';
	                        //var stt = docTitle.all_html_render();
	                        //console.log('splitPath.length ' + splitPath.length);
	                        // what about gzip compressing the returned data?
	                        //  may want to load some things in advance, on the server loading.
	                        console.log('splitPath ' + splitPath);
	                        if (splitPath.length == 1) {
	                            filePath = splitPath[0];
	                        }
	                        console.log('filePath ' + filePath);
	                        var get_file_etag = function (filePath, callback) {
	                            fs.stat(filePath, function (err, stats) {
	                                var s_mod = stats.mtime;
	                                var ETag = fp + '@' + s_mod;
	                                if (callback) {
	                                    callback(ETag);
	                                }
	                            });
	                        };
	                        // Should re-arrange this.
	                        //  It will infer the mime types by the file names.
	                        //if (splitPath[0] && splitPath[0] == 'examples') {
	                        // then the printer example.
	                        //if (splitPath[1] && splitPath[1] == 'printer') {
	                        if (splitPath[0] && splitPath[0] == 'css') {
	                            // Let's use the ETag system with the CSS as well.
	                            // Include the ETag here too.
	                            var fileName = splitPath[1];
	                            var filePath = 'css/' + fileName;
	                            console.log('css filePath ' + filePath);
	                            get_file_etag(filePath, function (ETag) {
	                                var h_nm = req.headers['if-none-match'];
	                                if (use_etags && h_nm == ETag) {
	                                    res.writeHead(304, {
	                                        'Cache-Control': 'max-age=3600000',
	                                        'Expires': 'Thu, 30 Oct 2014 14:19:41 GMT',
	                                        'Date': s_date,
	                                        'Connection': 'close',
	                                        'ETag': ETag
	                                    });
	                                    res.end();
	                                } else {
	                                    get_gzipped_file(filePath, function (gzipped_cssFile) {
	                                        //st = st + gzipped_cssFile;
	                                        //res.writeHead(200, {'Content-Encoding': 'gzip'});
	                                        res.writeHead(200, {
	                                            'Content-Type': 'text/css',
	                                            'Cache-Control': 'max-age=3600000',
	                                            'Content-Encoding': 'gzip',
	                                            'Expires': 'Thu, 30 Oct 2014 14:19:41 GMT',
	                                            'Date': s_date,
	                                            'Connection': 'close',
	                                            'ETag': ETag
	                                        });
	                                        res.end(gzipped_cssFile);
	                                    });
	                                    //var fileStream = fs.createReadStream(fp);
	                                    //fileStream.pipe(res);
	                                }
	                            });
	                        } else if (splitPath[0] && splitPath[0] == 'js') {
	                            // Let's use the ETag system with the CSS as well.
	                            // Include the ETag here too.
	                            var fileName = splitPath[1];
	                            var filePath = 'js/' + fileName;
	                            console.log('js filePath ' + filePath);
	                            get_file_etag(filePath, function (ETag) {
	                                var h_nm = req.headers['if-none-match'];
	                                if (use_etags && h_nm == ETag) {
	                                    res.writeHead(304, {
	                                        'Cache-Control': 'max-age=3600000',
	                                        'Expires': 'Thu, 30 Oct 2014 14:19:41 GMT',
	                                        'Date': s_date,
	                                        'Connection': 'close',
	                                        'ETag': ETag
	                                    });
	                                    res.end();
	                                } else {
	                                    // load the file...
	                                    load_file(filePath, function (data) {
	                                        console.log('do_js_uglify ' + do_js_uglify);
	                                        if (do_js_uglify) {
	                                            get_ugly_js_str(data.toString(), function (ugly_js) {
	                                                get_gzipped_string(ugly_js, function (gzipped_ugly_js) {
	                                                    res.writeHead(200, {
	                                                        'Content-Type': 'application/javascript',
	                                                        'Cache-Control': 'max-age=3600000',
	                                                        'Content-Encoding': 'gzip',
	                                                        'Expires': 'Thu, 30 Oct 2014 14:19:41 GMT',
	                                                        'Date': s_date,
	                                                        'Connection': 'close',
	                                                        'ETag': ETag
	                                                    });
	                                                    res.end(gzipped_ugly_js);
	                                                });
	                                            });
	                                        } else {
	                                            get_gzipped_string(data, function (gzipped_ugly_js) {
	                                                res.writeHead(200, {
	                                                    'Content-Type': 'application/javascript',
	                                                    'Cache-Control': 'max-age=3600000',
	                                                    'Content-Encoding': 'gzip',
	                                                    'Expires': 'Thu, 30 Oct 2014 14:19:41 GMT',
	                                                    'Date': s_date,
	                                                    'Connection': 'close',
	                                                    'ETag': ETag
	                                                });
	                                                res.end(gzipped_ugly_js);
	                                            });
	                                        }
	                                    });
	                                }
	                            });
	                        } else if (splitPath[0] && splitPath[0] == 'images') {
	                            if (splitPath.length == 2) {
	                                var s_date = new Date().toUTCString();
	                                fileName = splitPath[1];
	                                // for the moment generate a unique ID from the filename.
	                                var fp = 'images/' + fileName;
	                                //console.log('fp ' + fp);
	                                // a funtion to get an etag from a file
	                                get_file_etag(fp, function (ETag) {
	                                    var h_nm = req.headers['if-none-match'];
	                                    if (use_etags && h_nm == ETag) {
	                                        res.writeHead(304, {
	                                            'Cache-Control': 'max-age=3600000',
	                                            'Expires': 'Thu, 30 Oct 2014 14:19:41 GMT',
	                                            'Date': s_date,
	                                            'Connection': 'close',
	                                            'ETag': ETag
	                                        });
	                                        res.end();
	                                    } else {
	                                        res.writeHead(200, { 'Content-Type': 'image/jpeg',
	                                            'Cache-Control': 'max-age=3600000',
	                                            'Expires': 'Thu, 30 Oct 2014 14:19:41 GMT',
	                                            'Date': s_date,
	                                            'Connection': 'close',
	                                            'ETag': ETag
	                                        });
	                                        var fileStream = fs.createReadStream(fp);
	                                        fileStream.pipe(res);
	                                    }
	                                });
	                            }
	                        }
	                        // will serve the particular html file.
	                        if (splitPath.length == 1) {
	                            // and if it ends in .htm
	                            var fn_e = splitPath[0].split('.');
	                            if (fn_e.length == 2) {
	                                var filename_main = fn_e[0];
	                                var ext = fn_e[1];
	                                if (ext == 'htm') {
	                                    var fp = filename_main + '.htm';
	                                    get_file_etag(fp, function (ETag) {
	                                        var h_nm = req.headers['if-none-match'];
	                                        if (use_etags && h_nm == ETag) {
	                                            res.writeHead(304, {
	                                                'Cache-Control': 'max-age=3600000',
	                                                'Expires': 'Thu, 30 Oct 2014 14:19:41 GMT',
	                                                'Date': s_date,
	                                                'Connection': 'close',
	                                                'ETag': ETag
	                                            });
	                                            res.end();
	                                        } else {
	                                            get_gzipped_file(fp, function (gzipped_htmlFile) {
	                                                //st = st + gzipped_htmlFile;
	                                                //res.writeHead(200, {'Content-Encoding': 'gzip'});
	                                                var s_date = new Date().toUTCString();
	                                                // and an ETag for the main HTML?
	                                                res.writeHead(200, {
	                                                    'Content-Type': 'text/html',
	                                                    'Content-Encoding': 'gzip',
	                                                    'Cache-Control': 'max-age=3600000',
	                                                    'Expires': 'Thu, 30 Oct 2014 14:19:41 GMT',
	                                                    'Date': s_date,
	                                                    'Connection': 'close',
	                                                    'ETag': ETag
	                                                });
	                                                res.end(gzipped_htmlFile);
	                                            });
	                                        }
	                                    });
	                                } else {
	                                    // return a 404?
	                                    res.writeHead(404, { 'Content-Type': 'text/html' });
	                                    res.write("&lt;h1&gt;404 Not Found&lt;/h1&gt;");
	                                    res.end("The page you were looking for: " + filename_main + " can not be found");
	                                }
	                            }
	                        }
	                        // do we still have a filename?
	                        if (!splitPath[0]) {
	                            console.log('url_in_app ' + url_in_app);
	                            var fp = url_in_app;
	                            load_file_for_sending(fp, function (data, file_info) {
	                                console.log('extension ' + file_info.extension);
	                                // and the content type...
	                                var s_date = new Date().toUTCString();
	                                res.writeHead(200, {
	                                    'Content-Type': file_info.mime_type,
	                                    //'Content-Encoding': 'gzip',
	                                    'Cache-Control': 'max-age=3600000',
	                                    'Expires': 'Thu, 30 Oct 2014 14:19:41 GMT',
	                                    'Date': s_date,
	                                    'Connection': 'close'//,
	                                    //'ETag': ETag
	                                });
	                                //res.end('<html><head></head><body><p>host_name: ' + host_name + '</p></body></html>');
	                                res.end(data);
	                            });
	                        }
	                        
	                    }
	                }
	                // what about calls outside of the application URL path?
	                //  I think monit does that. Could that be changed?
	                if (url.length >= app_root_url_path.length) {
	                    if (url.substring(0, app_root_url_path.length) == app_root_url_path) {
	                        // then I think we start considering the path within the app.
	                        var app_name = 'examples';
	                        var path_within_app = url.substring(app_root_url_path.length);
	                        console.log('path_within_app ' + path_within_app);
	                        // And maybe call a process_app_url function, perhaps with a callback.
	                        process_app_url(app_name, path_within_app, function () {
	                            // the result should have been set up etc.
	                        });
	                    }
	                }
	                //
	                // the port will depend on the server.
	            }).listen(that.port, ip);
	            if (that.port == 80) {
	                console.log('Server running at http://' + ip);
	            } else {
	                console.log('Server running at http://' + ip + ':' + that.port);
	            }
	        }

	        start_server(net_ip);

	    }
	});
	
	// different MIME types.
	//  Loads a handler for the MIME type.
	
	// Defining paths through a regular expression...
	
	// Or defining a resource heirachy.
	
	// Top level:
	//  Web server
	// Some particular paths can go to particular resources?
	
	// Could try for one server with a generally RESTful architecture.
	
	
	
	
	// (static) HTML Response
	// Run JavaScript function
	// Run a page like ASP.NET. Controls loaded, set declaratively through XML.
	//  That will be one of the main server-side technologies.
	//  It will be run through a Request_Processor
	
	
	
	
	
	// Serves static files from that location.
	//  Pays attention to filenames.
	//  Could load a JavaScript file to handle a page.
	
	
	
	jsgui.Resource_Server = Class.extend({
		'init': function(spec) {
			
		}
	});
	
	// Web_Server is a Resource_Server?
	
	
	
	// Something that behaves like the ASP.NET Server
	//  Files, following a path, some served, some processed.
	//  Sent with correct caching, mime types.
	//  A file may be a .jsgui file? or jssp like JavaScript Server Page.
	//   ..could be either really, will be set for both.
	
	// Type Handler - File resource is requested.
	
	// Various built-in handlers.
	//  Different options can be enabled.
	
	
	
	
	
	
	
	
	
	// Also want a File_Server.
	//  Want files to be served from a particular path, as a resource in the URL system.
	//  Will be able to post files there with the right permission.
	
	
	
	
	
	
	
	return jsgui;
	
	
});