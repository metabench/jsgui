
//if (typeof define !== 'function') {
//    var define = require('amdefine')(module);
//}

//define(["./jsgui-lang-util", './abstract-resource'], function(jsgui, AR) {
//define(["../../core/jsgui-lang-util"], function(jsgui) {
var jsgui = require('../../core/jsgui-lang-util');
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


	// Or Resource.extend?



	var Resource_Collection = Collection.extend({
		// The link between the abstract resource and the resource on the internet / network / computer.
		//'fields': {
		//	//'meta': Data_Object
		//	'meta': 'data_object'
		//},

		'init': function(spec) {
			//
			if (!is_defined(spec)) spec = {};

			this._super(spec);

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

			// Indexing would be available through meta.

			// Set the meta url in the client side resource.

			if (is_defined(spec.startup_type)) {
				this.set('startup_type', spec.startup_type);
			}

		},

		'start': function(callback) {
			// check the requirements

			//  check requirements recursive - checks the requirements of everything required, and if they have the check_requirements function, it uses that.
			//   I think using the system of names APIs will help here.

			throw 'no start function defined for resource collection (subclass)'

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

		// asyncify function...
		//  used to make a function that is not normally async async.
		//  could go into lang-essentials or a further lang module

		'get': fp(function(a, sig) {
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
		        console.log('resource-collection arr_params ' + stringify(arr_params));
                var res = this._super.apply(this, arr_params);

                console.log('res ' + stringify(res));
                callback(null, res);
		    } else {
		        //var stack = new Error().stack;
		        //var message = 'Resource.get requires a callback (err, result) as its last parameter';
		        //console.log(message);
                //console.log(stack);
		        //throw

		        var res = this._super.apply(this, a);
		        return res;
		    }

		}),
		'find': fp(function(a, sig) {
		    var callback;
		    var last_param = a[a.l - 1];
		    if (tof(last_param) == 'function') {
		        callback = last_param;
		    }
		    if (callback) {
		        var arr_params = a.slice(0, a.l - 1);
		        //console.log('arr_params.length ' + arr_params.length);
		        //console.log('arr_params ' + stringify(arr_params));
                var res = this._super.apply(this, arr_params);
                //console.log('res ' + stringify(res));
                callback(null, res);
		    } else {
		        var res = this._super.apply(this, a);
		        return res;
		    }
		})
	});
	//return Resource_Collection;

//});
module.exports = Resource_Collection;
