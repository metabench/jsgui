if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../../core/jsgui-lang-util", "../core/resource"], function(jsgui, Resource) {
	
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Collection = jsgui.Collection;
	var is_defined = jsgui.is_defined, fp = jsgui.fp, stringify = jsgui.stringify, tof = jsgui.tof;
	var call_multi = jsgui.call_multi;
	var each = jsgui.eac;
	
	var Clock = Resource.extend({
		'init': function(spec) {

			// Can't really call get time?
			//  And have it work syncronously?

			// Want to be able to do more normal get operations.

			// This could have a .data which is a Data_Object.
			//  The get is about returning information as JSON.

			// I think that calling 'get' on a resource should always be async.
			//  It should also be to do with the external interface.
			//  So likely/going to return its data as JSON, rather than programmatic objects.

			//console.log('Clock init');
			//this.__type_name2 = 'Clock';
			var that = this;

			if (!is_defined(spec)) spec = {};
			this._super(spec);
			
			var data = this.data = new Data_Object();

			var time = new Date();
			//console.log('tof time', tof(time));
			data.set('time', time);
			//throw 'stop';

			data.on('change', function(property_name, property_value) {
				//var property_name = e_change[0];
				//var value = e_change[1];

				//console.log('clock data property_name', property_name);
				//console.log('clock data value', value);

				that.trigger('change', property_name, property_value);
			});
			

			
			//console.log('this.data.get time', tof(this.data.get('time')));
			//throw 'stop';
		},
		
		'start': function(callback) {
			console.log('Clock start');

			//var stack = new Error().stack;
			//console.log( stack );


			// check the requirements
			
			//  check requirements recursive - checks the requirements of everything required, and if they have the check_requirements function, it uses that.
			//   I think using the system of names APIs will help here.

			// This could start it ticking every second.
			//  The tick event will broadcast its data.
			//   It could be plugged into different broadcasting mechanisms so that it could work P2P as well.
			var that = this;
			setInterval(function() {
				// At this point want to broadcast... but it will just be raising an event.
				//  Make it so that raising an event means that it gets broadcasted through websockets.
				var time = new Date();

				// raise a change event?
				that.data.set('time', time);

				// Would be interesting to have it so that all the change events get sent through websockets.

			}, 5000);


			// Could add a property change listener.

			// this.on('change', 'time', fn)


			//console.log('this.__type_name2', this.__type_name2);
			//this.add_event_listener('change', function(e_change) {

				// Nice if the change got broadcast automatically.
				//  At least if anything was listening to that change and authorised to do so.

				//console.log('e_change', e_change);
			//});
			
			//throw 'no start function defined for web resource (subclass)'
			// Then if we have a web resource that's bound to the clock resource, the web resource can keep clients / connected systems updated using websockets.
			// Would be publishing resources under addresses for with this mechanism.
			callback(null, true);
		},

		'get': fp(function(a, sig) {
			if (sig == '[f]') {
				var callback = a[0];

				var time = this.data.get('time');
				//console.log('time', time);
				//console.log('tof time', tof(time));
				//throw 'stop';

				var res = {
					'unix_time': time.getTime()
				}
				callback(null, res);
			}
		}),

		'meets_requirements': function() {
			// Likely will be part of Status

			//return false;

			return true;
		}
		
	});

	return Clock;
});



