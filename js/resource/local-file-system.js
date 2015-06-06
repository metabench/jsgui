/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../web/jsgui-html', 'os', 'http', 'url', './core/resource',
	'../web/jsgui-je-suis-xml', 'cookies',
	'fs', '../fs/jsgui-node-fs2-core'],

	function(jsgui, os, http, libUrl, Resource,
		JeSuisXML, Cookies,
		fs, fs2) {

*/

var jsgui = require('../web/jsgui-html'), os = require('os'), http = require('http'),
libUrl = require('url'), Resource = require('./core/resource'),
JeSuisXML = require('../web/jsgui-je-suis-xml'), Cookies = require('cookies'),
fs = require('fs'), fs2 = require('../fs/jsgui-node-fs2-core');


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

    'init': function(spec) {
        this._super(spec);

    },
    'start': function(callback) {
        //console.log('lfs start');
        callback(null, true);
    },

    // Get the directory contents, get without any parameters returns the root directory.

    'get': fp(function(a, sig) {

        var params, callback;
        if (a.l == 1) {
            callback = a[0];
        }
        if (a.l == 2) {
            params = a[0];
            callback = a[1];
        }

        var tp = tof(params);

        if (tp == 'string') {
            var getPath = params;
            //console.log('getPath ' + getPath);
            if (getPath.length == '0') getPath = '/';
            if (getPath.substr(0, 1) != '/') getPath = '/' + getPath;

            fs2.dir_contents(getPath, {}, callback);
        }

        if (tp == 'undefined') {
            this.get('/', callback);
        }


    })
});
module.exports = Local_File_System;
