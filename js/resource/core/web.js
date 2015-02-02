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
define(["../../core/jsgui-lang-util", "./resource"], function(jsgui, Resource) {
	
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Collection = jsgui.Collection;
	var is_defined = jsgui.is_defined, fp = jsgui.fp, stringify = jsgui.stringify, tof = jsgui.tof;
	var call_multiple_callback_functions = jsgui.call_multiple_callback_functions, call_multi = jsgui.call_multi;
	var each = jsgui.each;

    // Could maybe make a website resource as well?

    // It would publish a web db, I think.
    //  A website resource would contain a variety of requests.

	var Web_Resource = Resource.extend({

		'init': function(spec) {
			//
			if (!is_defined(spec)) spec = {};
			
			this._super(spec);
			
		},
		
		'start': function(callback) {
			// check the requirements
			
			//  check requirements recursive - checks the requirements of everything required, and if they have the check_requirements function, it uses that.
			//   I think using the system of names APIs will help here.
			
			throw 'no start function defined for web resource (subclass)'
			
		},

		'meets_requirements': function() {
			// Likely will be part of Status

			//return false;

			return true;
		},
		
	});

	return Web_Resource;
});



