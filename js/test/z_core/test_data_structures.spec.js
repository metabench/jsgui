// can see if define is defined or not.

// The data enhancements are getting on for fairly large.
//  But will definitely help the project scale.
//  Likely to be integrating b+ trees at a very core level.

/*
if (!(requirejs)) {
	var requirejs = require('requirejs');

	requirejs.config({
	    nodeRequire: require
	});
	
}

requirejs(['../../core/jsgui-lang-util', '../../core/jsgui-data-structures'],
*/

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../core/jsgui-lang-util', '../../core/jsgui-data-structures', 'assert'],
function (jsgui, Data_Structures, assert) {
    
	
	
	var stringify = jsgui.stringify, Collection = jsgui.Collection;
	var each = jsgui.each;
	// Should just serve the documents in place.
	
	// Why not create the MetaBench Site server?
	
	// It loads up the database connection, tests it?
	
	// The site resource server serves the site's resources.
	//  The server module itself would load up these site resources, ready to be served.
	
	// It should go to a MetaBench_Site_Data_Adapter
	//  Not directly to mongodb. May refine the API at some point in the future on the Data_Adapter,
	//  but i'm planning on it providing various capabilities such as validating a login,
	//  accessing a user's shared files using a validation token
	//  loading data relating to the public areas of the site
	//  access private data with validation token
	//  want some security built into this layer but not planning anything very tight here in particular.
	
	// There may be other data APIs that I make that can have multiple possible databases.
	
	// Want to be using
	//  Postgres
	//  Tokyo Cabinet
	//  MongoDB
	
	// Want to be able to administer databases through the admin interface.
	
	// Can do some quite simple tests with the available data structures.
	//  It may be worth using Jasmine.
	
	// ordered - different to a 'bundle'.
	//  perhaps do more about defining a 'bundle' object that does not guarantee the order will be preserved.
	//  probably less useful.
	
	
	
	describe("z_core /test_data_structures.spec.js ", function() {
	
		// -----------------------------------------------------
		//	test_ordered_kvs
		// -----------------------------------------------------
			
		it("test_ordered_kvs", function() {
		
			var test_ordered_kvs = function() {
				var okvs = new Data_Structures.Ordered_KVS();
				
				okvs.push('id', {
					'name': 'id',
					'str_def': 'pk guid',
					'obj_def': {
						'is_pk': true,
						'data_type': 'guid'
					}
				});
				
				okvs.push('username', {
					'name': 'username',
					'str_def': 'unique text(32)',
					'obj_def': {
						'is_unique': true,
						'data_type': 'text',
						'length': 32
					}
				});
				
				var actual_keys = [];
				var actual_values = [];

				var expected_value_id = '{"name": "id", "str_def": "pk guid", "obj_def": {"is_pk": true, "data_type": "guid"}}';
				var expected_value_username = '{"name": "username", "str_def": "unique text(32)", "obj_def": {"is_unique": true, "data_type": "text", "length": 32}}';

				// =============================================================================
				
				actual_keys = [];
				actual_values = [];
				
				okvs.each(function(key, value, stop) {
					//console.log('key ' + key);
					//console.log('value ' + stringify(value));
					actual_keys.push(key);
					actual_values.push(stringify(value));
				});
				
				assert.equal(actual_keys.length, 2);
				assert.equal(actual_values.length, 2);				
				assert.equal(actual_keys[0], "id");
				assert.equal(actual_keys[1], "username");
				assert.equal(actual_values[0], expected_value_id);
				assert.equal(actual_values[1], expected_value_username);
				
				// =============================================================================

				var actual_nodes = [];
				var actual_node_neighbours = [];
				
				okvs.dll.each_node(function(node, stop) {
					//console.log('node ' + node);
					//console.log('node.neighbours ' + node.neighbours);
					//console.log('value ' + stringify(value));
					actual_nodes.push(node);
					actual_node_neighbours.push(node.neighbours);
				});

				assert.equal(actual_nodes.length, 2);
				assert.equal(actual_node_neighbours.length, 2);				
				assert.equal(actual_nodes[0].toString(), "[object Object]");
				assert.equal(actual_nodes[1].toString(), "[object Object]");
				assert.equal(actual_node_neighbours[0].toString(), ",[object Object]");
				assert.equal(actual_node_neighbours[1].toString(), "[object Object],");
				
				// =============================================================================
				
				okvs.out('id');				
				//okvs.out('username');

				//console.log('--------------------------------');
				
				actual_keys = [];
				actual_values = [];

				okvs.each(function(key, value, stop) {
					//console.log('key ' + key);
					//console.log('value ' + stringify(value));
					actual_keys.push(key);
					actual_values.push(stringify(value));
				});
				
				assert.equal(actual_keys.length, 1);
				assert.equal(actual_values.length, 1);				
				assert.equal(actual_keys[0], "username");
				assert.equal(actual_values[0], expected_value_username);
				
			}
			test_ordered_kvs();
		
		
			assert.equal(11111, 11111);
		});
										
	});
	
	
});
	


	



//require(["./jsgui-lang-util"], function(jsgui) {
	
	// The normal util part is being expanded so that collections become more usable.
	
	
	// Will have a collection that keeps things in order too.
	//  Knows what position they are in.
	//  So an index property is kept track of.
	
	
	// Later on...
	//  They could be kept indexed according to something???
	
	// For the moment, mimic / wrap an array.
	//  Generally it will take objects of the same type.
	//  It may be indexing these items, according to a string value.
	//  (Or) a value that is got.
	// So controls get put in place, they have necessarily got an index.
	//  That index would then become a property of the control.
	//  Perhaps could mark it as read-only so that it does not get changed?
	//   Maybe Data_Object could have a _property_metadata field.
	//   So that index gets marked as read-only, other code does not update it.
	//  And it's the index within a specific collection too...
	// Objects may get stored within multiple collections.
	//  So the index value gets maintained within the collection.
	//   I have already stored _.index values, but now I think its better having that value just within the collection,
	//    and available by using the lookup with the (other) index, the unique properties?
	//   But we may not have any...
	
	// Really unsure about keeping an index to a collection within the record itself.
	//  Except perhaps it will be the best way sometimes.
	//  No further lookup required.
	
	// In the Data_Objects... could have positions_in_collections.
	//  The collections could have names...
	// However they may be considered to have one 'parent'?
	//  Don't want it hard for an item to appear in more than one collection.
	// Though maybe do want to model items appearing in more than one collection.
	
	// Need to clarify how collections and data objects pass / bubble events, and which are considered parents.
	
	// Backbone may have a simpler and more performant system where all events are delegated quickly to one place.
	//  Is 'containers' a better word.
	//  Each Data_Object and Collection can generate a new id that is totally specific to them.
	//   They could be put in a large index, quickly found with that identity.
	//   The identities would make string keys too.
	//    So when we have all the parents in a map we could access them quickly.
	//    The container may not have any identifying features for a string key otherwise.
	//     An item is in multiple containers.
	//      Those containers are stored in an optimized collection. Have string keys.
	//      Can add, remove, etc those parent containers.
	//      Can quickly test if something is in that parent containers collection.
	
	// Ensuring every Data_Object and Collection has an _id makes a fair bit of sense.
	//   Call it _id for the moment, don't want it conflicting with other things.
	//   Perhaps id could be initialized lazily rather than on construction.
	//    That could be an option though. Lazy IDs result in fewer being created.
	
	// There will be different event bubbling methods.
	//  Sometimes things will be known to be parents or containers.
	
	// Good example with an abstract postgres database.
	
	// We have a table, which is an object in the schema.
	// However, it is also an object in a select statement.
	
	// Maybe will not be so hard to keep track of multiple parent items.
	//  Just need to know we are doing it and use the API correctly to modify the collections.
	
	
	// A Data_Object could contain properties too.
	//  These properties could be collections
	// Changing a property - gets logged.
	// Changing something within a property - maybe that change needs to be passed up a chain.
	
	// And tof with data_objects and collections?
	//  should return those values, I think.
	// They may have a __type property?
	// 
	
	
	//  Controls have been doing that anyway, it could be brought into controls.
	
	
	
//});