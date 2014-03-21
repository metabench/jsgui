
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['module', 'path', "./jsgui-html", 'querystring', 'fs'], function (module, path, jsgui, querystring, fs) {
	
	var file_cache_by_path = {};
	
	var map_extension_mime_types = {
		'html': 'text/html',
		'htm': 'text/html',
		
		'ico': 'image/x-icon',
		'txt': 'text/plain',
		'xml': 'application/xml',
		
		'png': 'image/png',
		'gif': 'image/gif',
		'jpeg': 'image/jpeg',
		'jpg': 'image/jpeg',
		
		'mp3': 'audio/mpeg3',
		'ogg': 'audio/ogg',
		
		'js': 'application/javascript',
		'css': 'text/css'
		
	}
	
	var map_text_mime_types = {
		'text/html': true,
		'text/plain': true,
		'application/xml': true,
		'application/javascript': true,
		'text/css': true
	}
	
	// will consult a map of mime types
	
	var open_file = function(file_path, callback) {
		if (file_cache_by_path[file_path]) {
			callback(null, file_cache_by_path[file_path]);
		} else {
			
			fs.readFile(file_path, function(error, content) {
				if (error) {
					response.writeHead(500);
					response.end();
				}
				else {
					file_cache_by_path[file_path] = content;
					callback(null, content);
				
					//response.writeHead(200, { 'Content-Type': 'text/html' });
					//response.end(content, 'utf-8');
				}
			});
		}
	}
	
	var send_file = function(res, file_path) {
		// needs to get the file's contents, similar to readFile.
		
		open_file(file_path, function(err, content) {
			if (err) {
				throw err;
			} else {
				// need to serve that... 
				//res.
				
				var ext = path.extname(file_path).substr(1);
				//console.log('ext ' + ext);
				
				var mime_type = map_extension_mime_types[ext];
				console.log('mime_type ' + mime_type);
				
				res.writeHead(200, { 'Content-Type': mime_type });
				//
				
				if (map_text_mime_types[mime_type]) {
					res.end(content, 'utf-8');
				} else {
					res.end(content);
				}
				
				
				// utf-8 for text only I think.
			}
		
		})
		
	}
	
	var e_s_r = {
		'apply': function(app) {
			
			// send_file and serve_file?
			
			app.serve_file = function(url_path, file_path) {
				
			}
			
			
			app.serve_directory = function(url_path, file_path) {
				// like app.use, but will store the files in memory.
				//  Watching the dir for changes would make this more advanced still.
				
				var map_cached_files_by_file_path = {};
				
				// translate from url path to file path
				
				// also will be getting the URLs of the requests, we'll relate this to the base URLs
				
				
				// will use app.get with a wildcard for the path so that it processes all of these.
				
				app.get(url_path + '*', function(req, res, next) {
					// can get the full url out of the path.
					//  can get the difference from the url_path
					
					var url = req.url;
					console.log('url ' + url);
					
					var esr_url = url_path;
					console.log('esr_url ' + esr_url);
					
					// we may store the file info as completed buffers?
					//  could also have a bit more that deals with compression and headers here.
					
					// Nice to use the routing system from Expess, will be good to integrate other jsgui pieces of functionality in there too.
					
					// This part could possibly serve .jsgui files too.
					//  Also would want to integrate that into Express middleware.
					
					// load up the file or get it from the cache.
					//  find out the file's path on disk.
					
					// calculate the difference between the current request's url and the root url for the request.
					
					var path_after_directory = url.substr(esr_url.length);
					//var path_after_directory = url.substr(0, esr_url.length);
					console.log('path_after_directory ' + path_after_directory);
					
					console.log('file_path ' + file_path);
					
					var request_file_path = file_path + path_after_directory;
					
					console.log('request_file_path ' + request_file_path);
					
					send_file(res, request_file_path);
					// then we serve the file from that path.
					//  we may already have the file in memory.
					
					
				});
				
				
			}
			
			
			app.serve_file = function(url_path, file_path) {
				// This is simpler... only needs to serve a single file.
				
				
				
				
			}
			
		}
	
	}
	
	
	
	return e_s_r;
});