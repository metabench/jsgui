// Want to get the core resources working and tested.
//  Want to run a clock website / service to start with.
//  The server could have a clock, while clients could connect to it and share the information.
//  Could also experiment with P2P distribution of the data.
//  A clock is also useful because it contains time signals so we can see how long it takes for data to reach various machines.






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
define(["../../core/jsgui-lang-util"], function(jsgui) {
	
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Collection = jsgui.Collection;
	var is_defined = jsgui.is_defined, fp = jsgui.fp, stringify = jsgui.stringify, tof = jsgui.tof;
	var call_multiple_callback_functions = jsgui.call_multiple_callback_functions, call_multi = jsgui.call_multi;
	var each = jsgui.each;
	
	// Status to see if a resource has started or not?
	//  I think resource status is important.
	//  However status may entail more things.
	//   status.phase
	//   phase

	// meta.phase

	// A resource's context matters.
	//  It will be the server rather than a page context.





	var Resource = Data_Object.extend({
		// The link between the abstract resource and the resource on the internet / network / computer.
		//'fields': {
		//	//'meta': Data_Object
		//	'meta': 'data_object'
		//},

		'init': function(spec) {
			//
			if (!is_defined(spec)) spec = {};
			
			this._super(spec);
			
			if (is_defined(spec.name)) {
				// Need to deal with both resource properties and inner properties.
				//  Not sure about having resource.set('name') naming the resource.
				//   Sounds OK normally, but Resource needs to be flexible, eg a resource could provide
				//   translations of a work to a different language, so get('name') needs to just be calling
				//   the resource with that value.

				// Perhaps some kind of inner get and set?
				// Or inner is the normal.
				//  An object to represent a resource's external properties?

				// Could have .name for it's name
				//  or .self for a Data_Object that refers to itself.
				//  or .inner or .resource for the Data_Object that is the resource's inner data?
				//  .data

				// I like having .get and .set for dealing with the resource's data.
				//  and different ways for indexing the resource.

				// .metadata

				// and name is part of the metadata.

				// this.set('meta.name')

				// This way there is a .meta object which holds the name




				//this.set('meta.name', spec.name);
			}
			this.meta = new Data_Object({
				'fields': {
					name: 'string'
				}
			});

			if (spec.meta) {
				var meta = spec.meta;
				if (meta.name) this.meta.set('name', meta.name);
				//console.log('meta.name ' + meta.name);
			}
			// Set the meta url in the client side resource.

			if (is_defined(spec.startup_type)) {
				this.set('startup_type', spec.startup_type);
			}
			
		},
		
		'start': function(callback) {
			// check the requirements
			
			//  check requirements recursive - checks the requirements of everything required, and if they have the check_requirements function, it uses that.
			//   I think using the system of names APIs will help here.

			// I think the base class should raise the event.

			//this.trigger('start');

			//console.log(new Error().stack);
			//throw 'no start function defined for resource (subclass)'
			
		},
		
		// meets_requirements
		//  check if all the prerequisite resources are active
		//  maybe check for login status if applicable.
		
		'meets_requirements': function() {
			// Likely will be part of Status

			//return false;

			return true;
		},
		
		// 'get' will be the function to use.
		
		// may have toJson / to_json.
		'get_abstract': function() {
		
			// Abstract_Resource - would be a description of a resource?
			//  Perhaps we'll only need json and json schema.
			//  Making the data_object and collection conform to json schema would be nice.
			//  Would have something very nice to do with creating a gui for forms.
			/*
			
		
			var res = new AR.Abstract_Resource({
				
			})
			*/
		},
		
		// the last item in the signature is the callback
		
		'set': fp(function(a, sig) {
		
		    //console.log('Resource.set sig ' + sig);
		    //console.log('Resource.set a ' + stringify(a));
		    var last_param = a[a.l - 1];
		    var callback;
		    
		    if (tof(last_param) == 'function') {
		        callback = last_param;
		        var arr_params = a.slice(0, a.l - 1);
                var res = this._super.apply(this, arr_params);
                callback(null, res);
		        
		    } else {
		        // but why is a callback still needed?
		        //  because in super, it requires a callback when it calls 'get', which is the newer get.
		        
		        var res = this._super.apply(this, a);
		        return res;
		    }
		    
		    
		    
		    
		}),

		// Can we expect a Resource to return its data as a Resource?
		//  Maybe not always
		
		

		
		'get': fp(function(a, sig) {

            console.log('Resource get sig', sig);

            // if it does not have a function in the sig, it's syncronous

            var is_async = sig.indexOf('f') > 0;

            if (is_async) {
                var callback;
                var last_param = a[a.l - 1];
                if (tof(last_param) == 'function') {
                    callback = last_param;
                }
                if (callback) {
                    var arr_params = a.slice(0, a.l - 1);
                    console.log('arr_params.length ' + arr_params.length);
                    // _super with fp?

                    // context with fp?
                    // Need to sort out super with fp!
                    //  Though super may well use fp anyway.


                    //console.log('this._super ' + this._super);
                    console.log('resource arr_params ' + stringify(arr_params));
                    //var res = this._super.apply(this, arr_params);

                    // We can apply a collection resource's get asyncronously?
                    //  Possibly upgrade collection and data_object to handle async operations (though it's not async code)

                    // if it is a resource?
                    //  have an indicator on a function to see if it is async or not?
                    //  asyncify?

                    //



                    var res = this._super.apply(this, a);
                    return res;



                    //console.log('res ' + stringify(res));
                    //callback(null, res);
                }
            } else {
                //var stack = new Error().stack;
                //var message = 'Resource.get requires a callback (err, result) as its last parameter';
                //console.log(message);
                //console.log(stack);

                //throw

                var res = this._super.apply(this, a);
                return res;
            }



		    
		})
		
	});
	
	/*
	var Web_Resource = Resource.extend({
		'init': function(spec) {
			this._super(spec);
		},
		'respond': function(res, req) {
		
		}
		
	})
	
	var Html_Resource = Web_Resource.extend({
		'init': function(spec) {
			this._super(spec);
		}	
	})
	
	
	var Resource_Error = Data_Object.extend({
		'init': function(spec) {
			this._super(spec);
			
			if (spec.text) {
				this.set('text', spec.text);
			}
		}
	});
	
	var res = {
			'Resource_Error': Resource_Error,
			//'Resource_Connector': Resource_Connector,
			'Resource': Resource,
			'Web': Web_Resource,
			'Html': Html_Resource
	}
	
	return res;
	*/

	return Resource;
});



