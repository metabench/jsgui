if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../web/jsgui-html', 'os', 'http', 'url', './core/resource',
	'../web/jsgui-je-suis-xml', 'cookies',
	'fs', '../fs/jsgui-node-fs2-core'], 

	function(jsgui, os, http, libUrl, Resource,
		JeSuisXML, Cookies,
		fs, fs2) {

	
	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;
	
	var exec = require('child_process').exec;

	// File system admin will likely be a specialised resource, not using a generic resource admin interface.

	// Need to provide directory and file objects using get and set mechanism.

	// get, set, start, stop, describe, status, do

	// get could get a file or its metadata.
	//  could use RESTful interface for this.
	//  it will be nice if these resources are generally RESTful, but the commands make sense as well
	//  because some things are not so well represented as RESTful.

	// http requests could be directed to the local file system resource.
	//  Not sure about directly connecting the resource to the web, it may be that there is a
	//  Resource-Web-Connector that does this. There could be an HTML interface, but the JSON interface should
	//  probably be done first (and be used by client-side HTML).

	// Resource-JSON-Publisher
	//  Publishes a resource over the web.
	//   (is a resource itself?)
	//    accessed from the resource pool possibly?
	//  Would handle JSON get requests etc, and route them to the resourc.
	//   It could be part of the server.
	//    There could be just one of them that interfaces with all resources.
	//     There would be more flexibility in having them interchangable.

	// Resources could themselves take JSON?
	//  With some of them needing a connector?

	// It may make for less repetitive code if the resources don't handle JSON, but there is something
	//  general that serves JSON requests for the resources.



	var Local_File_System = Resource.extend({
		// Will be able to move files around etc.
		//  Each file will be available as its own entity.
		//  Not sure about indexing loads of filenames.
		
		// Basically, will make the local file system available as a resource.
		//  Can also have paths within this resource.
		//  Should not need to get loads of resources to get access to a nested one.
		
		// I think the file system will allow access to multiple paths - but will treat files and folders as resources.
		
		// Be able to get, and interact with nested resources.
		//  So there will be a root directory
		//  And resources within that.
		//   Directories will also be identifyable by their full paths.
		//    This may mean scanning through the directories, navigating as resources.
		//     Or the Local_File_System can reveal various things as resource.
		
		// Also not sure about givine each resource a unique ID to identify it, rather than in terms of other resources.
		//  it may make sense, but resources could still work through paths.
		// IDs would likely speed things up.
		//  Could also help with retieval / storage of resource data, or metadata.
		
		// The resource IDs apply for the moment within the server.
		//  However, each server will have its own id.
		//  Will have indexes of globally unique IDs. Will also have server IDs.
		// The same resource globally could be stored as different copies on different machines.
		
		
		// Navigating the whole file system...
		//  Resources will make subresources available.
		//   There could be a large number of them...
		// Making absolutely any file available through this interface... should be OK if you have the permission for it.
		
		// Could allow access to the whole file system on the server to anyone with the right permissions for it.
		
		// And could make the file system resource take a root path.
		//  This could be the part of the app.
		//  A server should not need to always give access to all files on the computer - but it will be 
		//   a useful tool for administering the server.
		
		
		'init': function(spec) {
			this._super(spec);
			
			// and has some parameters... can take a root path so that it only reveals some of the files on the server.
			//  However, want this tool to be providing low-level access. It could be set up so that there is a different
			//  'root' value here.
			
			// Will be possible to access a file through this file system resource.
			//  /admin/files
			
			// However much of the time this will be used to provide access to the site rather than to the whole server.
			
			// Being able to represent specific files with unique keys makes sense, but should be done carefully.
			
			// Making the access rights system seems quite important for this - viewing the whole server should be restricted to
			//  those with a 'server_admin' role.
			
			// So, making the server a resource may make sense. As a resource it will plug into the permissions system.
			
			// Enumerating all the sub-resources could be looking at every file on the server!
			
			
		},
		'start': function(callback) {
			//console.log('lfs start');
			callback(null, true);
		},

		// just callback as the last parameter I think.
		//  Perhaps we can have some more on fp that helps deal with callbacks, such as making them assumed
		//  to be the last parameter, fpc...
		//  not sure how useful it would be, but you could get the callback easily somehow?


		// 'get': fp(function(a, sig) {

		// using fp to get, make that fairly standard?
		//  also need to make it get the right thing...
		//  I think we'll be getting JSON representing the files at a given path.
		//  The empty get gets the files at the root path.
		// Want to make a general resource interface that allows the exploration of a variety of resources.
		//  The code to encapsulate something as an available resource should be made fairly compact.
		//  Want this to be a framework to provide an easy way to share data over networks.
		//   With security too.






		// Get the directory contents, get without any parameters returns the root directory.
		//  Exposing the file system as a resource should help keep the client concerns separate.
		//  Will hopefully have a file manager based on a quite generic system that's adaptable for lots of purposes.
		//  Will be extensible too, will be nice to edit code and image files, and make use of packaging tools.

		



		'get': function(params, callback) {
			//console.log('* lfs get');
			//var stack = new Error().stack;
			//console.log(stack);
			//throw 'stop';
			//console.log('callback ' + callback);
			//console.log('callback ' + tof(callback));
			var tp = tof(params);
			if (tp == 'string') {
				// it's a string path.
				//console.log('* params ' + params);
				// let's just return the root of the file system for the moment.
				//console.log('2) callback ' + callback);
				// It may make sense just to return simple objects.
				// dir_contents
				//fs2.dir_contents_with_metadata_to_path_full_tree('/', '/', function(err, resDirTree) {
				
				//var stack = new Error().stack;
				//console.log(stack);
				//throw 'stop';
				//fs2.dir_contents('/', {}, callback);
				var getPath = params;
				//console.log('getPath ' + getPath);
				if (getPath.length == '0') getPath = '/';
				if (getPath.substr(0, 1) != '/') getPath = '/' + getPath;

				fs2.dir_contents(getPath, {}, callback);
				/*
				fs2.dir_contents('/', {
					//'include_metadata': true
				}, function(err, resDir) {
					if (err) {
						throw err;
					} else {
						console.log('resDir ' + stringify(resDir));
						//var stack = new Error().stack;
						//console.log(stack);
						console.log('callback ' + callback);
						// This won't itself be a JSON service.
						//  it will return a JSON-ready object.
						callback(null, resDir);
					}
				});
				*/
			}


		}
	});
	
	
	return Local_File_System;
	
	
});