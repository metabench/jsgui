// Maybe it has different requirements in node.
//  Could possibly load these ones seperately if it's a node environment.

// This seems a lot to do with the server-side resource pool.
//  However, it may be worth having a client-side resource pool operate fairly similarly.

// Having some specific JSON and HTML interfaces to some resources would be nice
//  as well as having the system be able to explain such resources.
//   maybe resource/meta

// This could possibly get published by a resource publisher.

/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


define(['../../web/jsgui-html', './resource'], 

	function(jsgui, Resource) {
*/
var jsgui = require('../../web/jsgui-html');
var Resource = require('./resource');
	
	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;

	// Should work to get this closer to the desired get/set resource interface.
	//  That would help with administering it.
	//  Also would make subresources available, these would have their own interfaces.

	// Not sure if the Resource_Pool should have an HTTP endpoint... maybe Server_Resource_Pool?



	// Keeps track of resources available within JavaScript process (browser or node.js).
	var Resource_Pool = Resource.extend({

		'init': function(spec) {
			this._super(spec);
			
			// Sorting them by a Data_Object's.meta name?
			//  need an easy way of expressing this.
			//  meta('name')?
			//  attached('meta', 'name')

			// I think indexing by attached Data_Object properties makes sense.
			//  That would mean defining an index as applying to an attached object.
			//   in this case 'meta'

			// sorted: [['attached', 'meta', 'name']]
			//  does not look nice, but it gets the point accross.
			//  hopefully would not be confused.
			//  One sorted index by its meta.name
			// I think the attached keyword makes sense here as meta is attached to the object rather
			//  than really a component of the object itself.

			// I think registering object attachments makes sense.
			//  That is more core-level work and I want to draw an end to that for the moment.
			// Object attachments being another interesting part which will be worthwhile.


			this._resources = new Collection({
				'index': {
					//'sorted': [['name']] // similar to above, but literally it's a single index in a list of indexes, that index just has one field, in a list of fields
					
					// The syntax for specifying a (sorted) index is for an attached field.
					//  It gets the data for the attached object.
					// {'attached': {'meta': 'name'}}
					'sorted': [[{'attached': {'meta': 'name'}}]]
					//sorted: [[['attached', 'meta', 'name']]]
				}
			});
			
		},

		'resources': fp(function(a, sig) {
			if (sig == '[]') {
				return this._resources;
			}
		}),
		
		'_get_resources_by_interface': function(i_name) {
			var res = [];
			
			this._resources.each(function(i, resource) {
				console.log('resource ' + resource);

				// Not so sure we should treat 'get' like that for the resource.
				//  The resource may be a list of items, one of which is called 'interface'

				// Need that one on a lower level.
				//  Like resource.interface



				var i = resource.get('interface');
				if (tof(i) == 'string') {
					if (i == i_name) res.push(resource);
				} else if (tof(i) == 'array') {
					var done = true;
					each(i, function(i2, v) {
						if (!done) {
							if (i == i_name) res.push(resource);
							done = true;
						}
					})
				}
				
			})
			
			if (res.length > 1) return res;
			return res[0];
			
		},
		
		'index_resource': function(obj) {
			// will get some metadata from the resource.
			
			// resource will be indexed by its location and its type.
			//  so will be able to find the local postgres dataabase that way
			
			// There will be different levels of locality
			//  May be a shorthand for the time and difficulty in communicating between two locations
			
			// in-process
			// same machine
			// lan (same data centre)
			// internet, same region
			// internet
			// stellar (could have more variations perhaps but will not be necessary for most applications)
			
			// to begin with, there will likely be some in-process resources.
			//  some of these resources could be resource connectors.
			
			
		},
		
		'receive_resource_event': fp(function(a, sig) {
			//console.log('receive_resource_event sig ' + sig);
			
			if (sig == '[D,s,[s,s]]') {
				var data_object = a[0];
				//console.log('data_object ' + stringify(data_object));
				
				//console.log('a[1] ' + a[1]);
				//console.log('a[2] ' + stringify(a[2]));
				
			}
			
			if (sig == '[D,s]') {
				var data_object = a[0];
				//console.log('data_object ' + stringify(data_object));
				//console.log('a[1] ' + a[1]);
				
				var event_name = a[1];
				//console.log('event_name ' + event_name);
				// could be that it has started?
				
				
				// then need to raise this event.
				
				
				
				
				// so if an resource has started, could have a particular handler for that.
				
				// There will be groups of resources that are needed for other ones to start.
				//  When one of these resources has loaded, it will check to see if others have also loaded.
				// This should be done with fairly fast algorithms, we don't want the system to slow down as it is getting going.
				
				
				
				
				
				
				
			}
			
		}),
		
		'add': function(obj) {
			// adds the resource obj to the pool.
			
			// Each resource will have its own individual name within the pool.
			//  There may be resources that get put into groups too.
			var that = this;
			
			//console.log('obj ' + stringify(obj));

			var obj_name = obj.meta.get('name');
			
			//console.log('** obj_name ' + obj_name);
			
			if (this.has_resource(obj_name)) {
				throw 'Resource pool already has resource with name ' + obj_name;
			} else {
				
				//this._dict_resources[obj_name] = obj;
				
				// raise an event saying that the resource was added.
				
				this._resources.add(obj);
				//obj.parent(this);

				// don't think we can do it like that.
				//  obj.set('pool', this);
				//  the resource could have a 'pool' object of its own, the resource could hold sports results
				//   for example.

				obj.meta.set('pool', this);
				


				this.raise_event('added', obj);
				// listen to events from that resource.

				// Do we want just a general listener for events?
				//  So we listen to any event from it?
				//obj.add_event_listener(that.receive_resource_event);
				
			}
			
			
		},
		'push': function(obj) {
			return this.add(obj);
		},
		'has_resource': fp(function(a, sig) {
			
			
			//return is_defined(this._dict_resources[resource_name]);
			
			//return 
			
			if (sig == '[s]') {
				// one string value, that will be the value of the unique primary index
				
				var obj_lookup_val = a[0];
				
				return this._resources.has(obj_lookup_val);
				
			}
			
			
			
		}),
		
		// Likely to just be 'get', with it returning resources inside.
		//  And perhaps going through an adapter.

		// Can not get the actual resource as a programming object if it is remote.
		//  In that case, we need to use a transport mechanism.

		// Need to be able to access the resources' data with a convenient interface, not having to write repeated HTTP plumbing.

		


		'get_resource': fp(function(a, sig) {
			//console.log('get_resource sig ' + sig);
			
			//return is_defined(this._dict_resources[resource_name]);
			//return 
			
			if (sig == '[s]') {
				// one string value, that will be the value of the unique primary index
				
				var obj_lookup_val = a[0];
				//console.log('this._resources ' + stringify(this._resources));
				//throw 'stop';
				//console.log('obj_lookup_val ' + obj_lookup_val);

				//console.log('this._resources ' + stringify(this._resources));

				// needs to check ['meta'].name
				//  meta is not accessed through the normal interface.
				//   perhaps we could have a .meta for dealing with properties like name
				//   the resource's get and set should be an unobstructed interface to the resource
				//   itself.

				// Indexing a Data_Object not by it's normal contents, but by metadata or 
				//  other attached objects.

				// I think Data_Object and Resource meta(data) indexing makes the most sense.

				// Data_Object.meta could make a lot of sense.
				//  We could possibly have the same name field in some cases.
				//  Meta makes the most sense for resources. Perhaps only use them there as they enable the
				//   direct object interface.

				// However, the collection of resources in a pool may need indexing by the name field
				//  which is within 'meta'.

				//var res = this._resources.find('name', obj_lookup_val)[0];
				//console.log('obj_lookup_val ' + obj_lookup_val);
				//var res = this._resources.find('["attached", "meta", "name"]', obj_lookup_val)[0];

				// Need to say it's finding a single attached field.
				//  don't want this to be misunderstood for three fields to look for.
				// Perhaps need to think about and formalise the API a bit more.
				//  But getting it to work will be a great help!

				// Collection.find syntax.

				// Find requests... perhaps they could take more work to make a fully flexible and 
				//  intuitive format.
				// ["attached", "meta", "name"] basically being one field in this context.

				// This could quite possibly do with more specification work done outside of the Resource_Pool.

				// .findInAttched('meta', 'name') would search the attached fields.

				// Indexing within the attached fields.

				// Treating the attached fields as just one field name within the index?
				//  But can we tell the difference between ["attached", "meta", "name"] and a collection / array
				//   of fields?

				// {'attached': 'meta.name'}
				//  That may be better for attached fields.
				//  The field is held by an object, which would not get confused with a plural.

				// {'attached': {'meta': 'name'}} - would work for multi-level attachments
				//  Multi-level attachments?

				// {'attached': {'meta': {'attached': {'secondAttachment': 'fieldName'}}}}
				//  That could work for multi-level attachments

				// Attached fields as object makes a lot of sense.



				// we can have a look at the index in the find function




				//var res = this._resources.find(["attached", "meta", "name"], obj_lookup_val)[0];
				//console.log('pre find resource');

				// Not sure it's being indexed properly by attached properties.



				var res = this._resources.find({'attached': {'meta': 'name'}}, obj_lookup_val)[0];
				//console.log('post find resource');

				//var res = this._resources.find(stringify(["attached", "meta", "name"]), obj_lookup_val)[0];
				//console.log('this._resources.length() ' + this._resources.length());
				//console.log('res ' + stringify(res));
				
				return res;
				
			}
			
			
			
		}),
		
		// have resources as a field?
		//  Means no need for the boilerplate code when it is linked.
		//'resources'
		
		
		// May be useful to have a callback parameter here rather than just publish / subscribe.
		
		'start': function(callback) {

			//console.log('resource pool start');

			// needs to look at the various resources in the pool.
			//  start each of them if they are supposed to start automatically.
			
			
			var arr_resources_meeting_requirements = [];
			
			//console.log('this._resources.length() ' + this._resources.length());
			
			this._resources.each(function(i, v) {
				//console.log('i ' + i);
				//console.log('v ' + stringify(v));
				
				// if it has all its requirements met, start it.
				
				// requirments - there may be conditional requirements in the future (like email address is not required when a Facebook profile URL is given), but for the moment each requirement is required
				//  could still be similar, with OR composite requirements.
				
				// check if the resource meets the requirements...
				//console.log('pre meets_requirements');
				var mr = v.meets_requirements();
				//console.log('post meets_requirements');
				
				// and need a callback for when they all have started.
				
				//  I think doing the requirements network planning before starting will be the best way.
				//   That could get things to start very efficiently.
				
				//console.log('meets_requirements ' + mr);
				if (mr) {
					//v.start();
					arr_resources_meeting_requirements.push(v);
				}
			});
			
			//console.log('arr_resources_meeting_requirements.length ' + arr_resources_meeting_requirements.length);
			var l_resources = this._resources.length();
			//console.log('l_resources ' + l_resources);


			
			if (arr_resources_meeting_requirements.length == l_resources) {
				
				var fns = [];
				
				// can do this without call_multi - though I would prefer to use call_multi and have it work by a long way.
				
				var num_to_start = arr_resources_meeting_requirements.length;
				
				//console.log('num_to_start ' + num_to_start);
				//throw 'stop';
				
				var num_starting = 0, num_started = 0;
				var cb = function(err, start_res) {
				    num_starting--;
				    num_started++;
				    //console.log('cb');
				    //console.log('num_started ' + num_started);
				    
				    if (num_started == num_to_start) {
				        callback(null, true);
				    }
				}
				
				each(arr_resources_meeting_requirements, function(i, resource_ready_to_start) {
				    //console.log('');
				    //console.log('');
				    //console.log('resource_ready_to_start ', resource_ready_to_start);
				    //throw 'stop';
				    // should give the context OK.
					//fns.push([resource_ready_to_start, resource_ready_to_start.start, []]);
					//console.log('pre resource start');

					// But starting with the wrong context???
					resource_ready_to_start.start(cb);
					//console.log('post resource start');
					
					num_starting++;
					// but the callback...
					
					//fns.push([function(callback) {
					//    resource_ready_to_start.start(callback);
					//}, []])
					
				});
			}
			
			
		}
	});
	
module.exports = Resource_Pool;
	//return Resource_Pool;
	
	
//});