// can see if define is defined or not.

// The data enhancements are getting on for fairly large.
//  But will definitely help the project scale.
//  Likely to be integrating b+ trees at a very core level.

// Tests going well... quite a bit more advanced functionality going into and working in Collection and Data_Object.
//  Iterating through collections in different orders.
//  Iterating through them by their array order,
//   or the order of an index.

// collection.iterate(index)?
// each?

// Specifying the index to iterate using?

// collection.each('index_name')?
// collection.each(index);
// collection.each(['name'])?

// Also, collection could provide access to its indexes.
//  Each index could have a name.
//  Each index is actually anower object, so we may be able to get reference to that and use it, maybe as well as named ids.




if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../core/jsgui-lang-util', '../../core/jsgui-data-structures', 'assert', '../test-utils/test-utils'],
function (jsgui, Data_Structures, assert, test_utils) {
    
	var j = jsgui;
	
	var stringify = jsgui.stringify, Collection = jsgui.Collection, Data_Object = jsgui.Data_Object;
	var mapify = jsgui.mapify, is_defined = jsgui.is_defined;
	
	var each = jsgui.each, tof = jsgui.tof;
	var iterate_ancestor_classes = j.iterate_ancestor_classes;
	var Sorted_KVS = Data_Structures.Sorted_KVS;
	
	
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
	
	var get_arr_presidents = function() {
		return [{'name': 'George Washington', 'y1': 1789, 'y2': 1797},
                {'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist'},
                {'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican'},
                {'name': 'James Madison', 'y1': 1809, 'y2': 1817, 'party': 'Democratic-Republican'},
                {'name': 'James Monroe', 'y1': 1817, 'y2': 1825, 'party': 'Democratic-Republican'},
                {'name': 'John Quincy Adams', 'y1': 1825, 'y2': 1829, 'party': 'Democratic-Republican'},
                {'name': 'Andrew Jackson', 'y1': 1829, 'y2': 1837, 'party': 'Democratic'},
                {'name': 'Martin Van Buren', 'y1': 1837, 'y2': 1841, 'party': 'Democratic'},
                {'name': 'William Henry Harrison', 'y1': 1841, 'y2': 1841, 'party': 'Whig'},
                {'name': 'John Tyler', 'y1': 1841, 'y2': 1845, 'party': 'Whig'},
                {'name': 'James K. Polk', 'y1': 1845, 'y2': 1849, 'party': 'Democratic'},
                {'name': 'Zachary Taylor', 'y1': 1849, 'y2': 1850, 'party': 'Whig'},
                {'name': 'Millard Fillmore', 'y1': 1850, 'y2': 1853, 'party': 'Whig'},
                {'name': 'Franklin Pierce', 'y1': 1853, 'y2': 1857, 'party': 'Democratic'},
                //{'name': 'Franklin Pierce', 'y1': 1853, 'y2': 1857, 'party': 'Republican'},
                {'name': 'James Buchanan', 'y1': 1857, 'y2': 1861, 'party': 'Democratic'},
                {'name': 'Abraham Lincoln', 'y1': 1861, 'y2': 1865, 'party': 'Republican'},
                {'name': 'Andrew Johnson', 'y1': 1865, 'y2': 1869, 'party': 'Democratic'},
                {'name': 'Ulysses S. Grant', 'y1': 1869, 'y2': 1877, 'party': 'Republican'},
                {'name': 'Rutherford B. Hayes', 'y1': 1877, 'y2': 1881, 'party': 'Republican'},
                {'name': 'James A. Garfield', 'y1': 1881, 'y2': 1881, 'party': 'Republican'},
                {'name': 'Chester A. Arthur', 'y1': 1881, 'y2': 1885, 'party': 'Republican'},
                {'name': 'Grover Cleveland', 'y1': 1885, 'y2': 1889, 'party': 'Democratic'}];
	}
	
	var get_ksvs_presidents = function() {
		var arr_presidents = get_arr_presidents();
		
		// will need a new KSVS.
		//  keys and values store
		
		
		
		var ksvs = new Sorted_KVS();
		
		each(arr_presidents, function(i, v) {
			ksvs.put(v.name, v);
			
		})
		
		return ksvs;
	}
	
	// Will be able to define this in terms of the President data type.
	//  This should lead to considerably less boilerplate in various applications.
	//  I think I'll make it so that the whole system can work using Mongo... but I can keep some other database tools as services.
	//   Could offer it as paid-for software.
	//   I think a fairly cheap subscription would work well... but could charge more for licensing of the code.
	//    The code will make itself very clear in terms of what transformations it does (if it is to work best). Maybe I will open-source it.
	//     Better not to open-source it for someone else to make the $ from an iPad app.
	//   Will be good to get this working well on the iPad through the web interface. I think that will be 
	
	
	// Software-as-a-service looks like the best model for offering this.
	//  Will have quite a lot online quite suddely when this publishing system works.
	//  It will be fairly expandable too.
	
	// Possibly defining indexing and uniqueness in the Data_Type_Class...
	//  I think field suggestions would be a good way of looking at this.
	//   Field collection property suggestions?
	//   Field collection properties?
	
	// I like suggestions because it is mild, and the information can be used when available.
	//  It will be fairly invisibly connecting things up where possible.
	// It is kind-of a property of a vehicle registration number - but someone could possibly create records for copies of them, probably unlikely.
	
	// In normal usage, things will be able to be defined very clearly and quickly.
	//  I think setting up a web db, with auth, the whole interface, being able to get & store various objects associated with users,
	//   then publishing various objects with options will work very well. All the pieces will fit together to produce the desired effect.
	
	
	
	
	
	
	
	// jsgui.Collection([Data_Type_Class, ['index', ...], ['unique', ...]], arr_values)
	//  could have easier syntax.
	// jsgui.Collection(Data_Type_Class, {
	//     'index': ... [arr structure of field names]
	//     'unique': ... [arr structure of field names]
	// })
	
	
	//  That will be a way of specifying a data type constraint for all of them.
	//  However, it does not say which items it indexes.
	//   May be good if the Data_Type stores 'suggestions' about how it gets stored / indexed.
	//    Saying that fields should be indexed when they get put in a collection.
	//  Not so sure that is right here though.
	
	
	
	
	
	
	
	
	
	// specify as collection of type
	//  collection of type, specified by a Data_Object based constructor.
	
	// A control can be specified as a Data_Object with fields.
	
	// The indexes will need to be set up appropriately in the collections.
	
	var President = Data_Object.extend({
		'fields': [
			['name', 'indexed text(32)'],
			['party', 'indexed text(32)'],
			['y1', 'int'],
			['y2', 'int']
		],
		
		// connect_fields was connect
		'connect_fields': true
	});
	
	var get_coll_presidents = function() {
		var coll_presidents = new jsgui.Collection(President, get_arr_presidents());
		return coll_presidents;
	}
	
	var get_mini_coll_presidents = function() {
		var coll_presidents = new jsgui.Collection(President, get_arr_presidents().slice(0, 2));
		return coll_presidents;
	}
	
	
	var old_get_coll_presidents = function() {
		//console.log('pre c 1');
		var coll_presidents = new jsgui.Collection({
			
			// want to be able to give it a schema
			//  tell it what to accept.
			
			// want to tell it to only accept data types formatted in a certain way.
			//  may use a text name to represent this, or an actual Data_Object with a constraint.
			
			// string of a certain length
			
			// this acceptance test will be done on every item added if acceptance testing is enabled.
			//  it would also be used in translating this to a database schema
			
			// also need the 'fields' definition in Data_Object.
			//  if 'fields' is set, other fields can not be set.
			//   (though that would be changable). It may be necessary to restrict things to a rigid format.
			
			// these may be called constraints.
			//  field constraints, applying to the data it accepts.
			
			
			// Maybe this will set a constraint to use a data object
			
			// fields given as strings?
			//  but then this could just set the values of those fields to the text...
			//  dobj simply creates the Data_Object from the object.
			//   so there is room in the Data_Object constructor to set the fields.
			
			
			
			
			
			// would that work?
			
			// constraint that applies to the Data_Object?
			
			// specify it with 'field'
			//  and also have collection constraints in there.
			
			// The system / API for the collections / initializing them with constraints will take a bit of thought and work.
			
			// A collection constraint could be a constraint that applies to a whole bunch of fields.
			//  Collection_Fields_Constraint object
			//   will have a Data_Object inside it, and that Data_Object will be used to check the fields of the items that get put in there.
			
			// Making this work like a DB will be very useful for having the data model in the DB as well.
			
			// Will be useful for setting up data that follows business logic, such as an authentication provider.
			//  This way, that provider could be created, and plugged into different database resources via a general layer.
			
			// The Constraint API could take a few more tests and examples.
			
			// No unique constraint in this case
			
			// seems OK for the moment.
			
			// Collection add_field
			
			// Collection field function
			// fields function
			// field() returns the fields.
			
			// Fields and constraints...? Fields and constraints being very similar.
			//  Fields a bit easier to talk about with JavaScript, but get implemented by constrinats.
			
			// Required field constraint...
			//  
			
			// fields, constraints, requirements.
			//  They are all similar in some way, but may have difference.
			// indexes as well
			
			// Perhaps everything will get implemented as a constraint.
			//  That way, fields can get referenced.
			
			// Fields seem closer to the user level, constraints seem closer to the implementation level.
			//  Fields could refer to both a constraint on data type as well as an index.
			//  Unique constraint requires an index, but not a sorted one. A sorted index works fine.
			
			// Perhaps will do more on the dict index... but for the moment it does not seem important because the sorted index seems fine.
			//  Dict index would work better (faster) where there is a need only for the unique capability, not having it sorted as well.
			
			// It would be interesting to have this actually process SQL. May be very nice if it is able to read and interpret SQL in a number of dialects.
			//  Would be interesting if this was able to provide an SQL interface to other systems such as Mongo.
			
			// Various pieces of parsing and interpretation code for the indexes and fields.
			//  It should make it possible to express things with little boilerplate.
			
			// Perhaps bunches of objects could be created (a single Data_Object or Collection) just from a string (non-JSON) description.
			//  Perhaps from English or from notes, that would be useful.
			// Will need to limit quite how much goes into the main Data_Object and Collection - these will need to be large enough to allow some nice shorthands,
			//  but will not be trying to understand everything. It should be possible to rapidly set up the data model, and then allowing access to the input, editing
			//  and viewing components will be a matter of setting the right permissions.
			
			
			
			
			
			
			
						
			
			// Nice to have it specify something through fields.
			//  but then it would actually access the Data_Object constraint.
			
			// May also be able to specify constriaints here. That seems like it would be OK.
			
			// That makes sense as the way of expressing field constraints.
			//  My want to express they are unique as well.
			//  May want to say they are indexed.
			
			// 'name': 'indexed text(32)',
			
			// calling 'fields' on a Data_Object... will set the fields for it, not sure about it making sure it only has those fields.
			//  restricting it to only those fields, or saying it has those fields...
			
			// Could work in restricted mode by default?
			//  Requires some fields... and no more?
			
			
			
			
			
			/*
			'fields': {
				...
				
			}
			*/
			
			// Specifying fields in this section seems like the way to go about things.
			//  Will set the constraint, and the indexes.
			
			// Required fields... requirements.
			//  Like saying a field is not null. Field will have a not null constraint, that also treates JS undefined as null.
			//  Required fields means not null.
			
			// Fields will only accept valid data in the first place (of the right type)
			
			// Color fields will be interesting as they will have a more developed internal data type and have input and output transformations.
			
			//  Data type, input transformations, output transformations.
			
			// Still is quite a bit more for me to do here.
			
			
			
			// Indexed... for the moment it will just be the sequential text index.
			//  May have code that converts string to lower case for use in the index and the lookups, but not right now.
			
			// sets the fields on its Data_Object.
			
			// Specifying the index is 'sorted' here should work well.
			
			// Saying that the 'name' is an ID?
			
			// Quite a fast way to specify indexing here.
			
			// May also follow Mongo syntax, should be appropriate.
			
			// Seems easier when fields are indexed separately.
			//  To make a unique combination, they will need to be put in as its own unique index.
			//  Unique combination indexes will span multiple fields.
			//   They should be a fast way to look things up.
			
			// Will investigate Dict indexes as well.
			//  They won't be so good for range queries, but will be useful for many other things.
			
			
			
			
			/*
			'fields': {
				'name': 'indexed text(32)',
				'party': 'indexed text(32)',
				'y1': 'int',
				'y2': 'int'
			},
			*/
			
			// This is better as it preserves the order.
			
			'fields': [
				['name', 'indexed text(32)'],
				['party', 'indexed text(32)'],
				['y1', 'int'],
				['y2', 'int']
			],
			
			// ensureIndex?
			//  just call it index here.
			
			
			
			// joined index used to support unique constraint.
			//  but we could try to set up the joined index anyway.
			
			
			// need to show they are unique together.
			//'unique': [['name', 'party']],
			//'index': [['name', 'party']], // clearly one index with two fields. needs to be shown in the array like this.
			
			
			// would set up the index
			
			
			
			
			/*
			
			// the index can get specified in the fields section.
			'index': {
				'sorted': [['name']] // similar to above, but literally it's a single index in a list of indexes, that index just has one field, in a list of fields
			},
			*/
			
			
			// Will make it much faster to specify these indexes here... they will then be able to created in a variety of databases.
			
			
			
			
			/*
			'constraint': new Data_Object({
				'constraint': {
					'name': 'text(32)',
					'y1': 'int',
					'y2': 'int'
				}
				
				
			}),
			*/
			// This seems important to finish / do more work on.
			//  The Constraints system is a fairly major undertaking.
			// It would be good to do more work and testing on it until it is much more finished.
			//  The constraints will be the basis for some database things, these will be used to power websites.
			
			
			
			
			
			
			
			/*
			
			'constraint': new Data_Object({
				'name': 'text(32)',
				'y1': 'int',
				'y2': 'int'
			}),
			
			*/
			
			/*
			'accepts': new Data_Object({
				'fields': {
					'name': 'text(32)',
					'y1': 'int',
					'y2': 'int'
				}
			}),
			*/
			
			
			
			// 'index': 'name'
			// 'index': ['name'] ?
			// 'index': [['name', 'dict']] ?
			
			// setting the index_type in the spec...
			
			// 'index': {'name': 'b+'} ... I think that's the one. A map of the items that get indexed, with the indexing type
			
			// 'index_type': 'dict' ?
			
			//'index_by': 'name',
			
			// I think this is a simple enough format for specifying the index.
			
			// ordered index
			// (full-text) index
			// associative index (possibly dict or map, though dict implies it is sorted! Dictionary implies sorted order as well as lookup, but is not used that
			//  way in some IT circles, so best to avoid it... maybe call it a map though, that's short).
			
			// I think indexes will be specified by what the index does rather than the data structure.
			//  Will be using data objects like the KVS to do the indexing.
			
			// map, ordered, text
			//  the text index is the next thing to do.
			
			
			// sorted by name.
			//  not specifying a b+ index, not able to set up a full text index yet.
			
			// Specifying the primary index
			
			// 
			
			// indexes property
			// as an array, or can have individual index objects.
			//  For the moment may use the sorted B+ index
			
			// // index by name in a sorted index:
			
			
			// Assuming index is using the best indexing tech in there.
			//  Possibly full text indexes will give sorted functionality as well.
			
			//'indexes': ['name'],
			
			// specifying the index type
			//  then the field(s) for the indexes.
			/*
			 * 
			
			// 'index_by': 'name'
			//  nice if index_by is accepted as a way of indexing things too.
			// want it so that index can be specified with one string.
			//  that would be the simplest in many cases.
			
			
			
			
			
			
			
			// The index parameters could undergo normalization.
			
			'index': {
				'sorted': 'name' // way of expressing a single index on a single field
			},
			
			'index': {
				'sorted': ['name'] // similar to above, but literally it's a single index in a list of indexes, that index just has one field
			},
			'index': {
				'sorted': [['name']] // similar to above, but literally it's a single index in a list of indexes, that index just has one field, in a list of fields
			},
			
			'index': {
				'sorted': [['name'], ['age']] // two indexes
			},
			
			'index': {
				'sorted': ['name', 'age'] // one index, fields in that order
			},
			
			'index': {
				'sorted': [['name', 'age'], 'postcode'] // two indexes, first is multi-field
			},
			
			*/
			
			// There is an index, but it's not made to be a unique index.
			
			
			/*
			'index': {
				'name': 'sorted'
			},
			*/
			// this should set the primary unique index.
			
			
			
			'items': get_arr_presidents()
		});
		
		return coll_presidents;
	}
	//old_get_coll_presidents();
	
	
	
	describe("z_core /test_data_object_collections.spec.js ", function() {
	
		// -----------------------------------------------------
		//	test_presidents_ksvs
		// -----------------------------------------------------
			
		it("test_presidents_ksvs", function() {
		
			var test_presidents_ksvs = function() {
				//console.log('test_presidents_ksvs');
				
				var ksvs = get_ksvs_presidents();
							
				//console.log('ksvs.key_count ' + ksvs.key_count());
				assert.equal(ksvs.key_count(), 22);
				
				
				// then we want to do a prefix search / get on the KSVS. That should be possible because it wraps the B+ tree.
				// Keys and Values storage may be quite a useful JavaScript class to have because it keeps the tree focused on being a tree,
				//  while it provides the API that will be best in my JavaScript programs.
				
				// KSVS could do lower case indexing, or be maybe better be wrapped so that it makes the keys lower case?
				//  could have a keys_to_lower_case option / flag.
				
				
				// Will need to do some more adaptation of the tree.
				
				var tree = ksvs.tree;
				//console.log('tree ' + tree);
				assert.equal(tree.toString(), '[object Object]');
				
				//var tree_first = tree.firstLeaf;
				//console.log('tree_first ' + stringify(tree_first)); // - stringify() error
				
				var keys = ksvs.keys();
				//console.log('keys ' + stringify(keys));
				assert.equal(stringify(keys), '["Abraham Lincoln", "Andrew Jackson", "Andrew Johnson", "Chester A. Arthur", "Franklin Pierce", "George Washington", "Grover Cleveland", "James A. Garfield", "James Buchanan", "James K. Polk", "James Madison", "James Monroe", "John Adams", "John Quincy Adams", "John Tyler", "Martin Van Buren", "Millard Fillmore", "Rutherford B. Hayes", "Thomas Jefferson", "Ulysses S. Grant", "William Henry Harrison", "Zachary Taylor"]');

				//get_keys_by_prefix			
				//var arr_james = ksvs.get_by_prefix('James');
				var arr_james = ksvs.get_keys_by_prefix('James');
				//console.log('arr_james ' + stringify(arr_james));
				assert.equal(stringify(arr_james), '["James A. Garfield", "James Buchanan", "James K. Polk", "James Madison", "James Monroe"]');
			}
			test_presidents_ksvs();
		});
					
					
		//var test_get_by_ordinal = function() {
		//	
		//}
					
		// -----------------------------------------------------
		//	test_coll_presidents
		// -----------------------------------------------------
			
		it("test_coll_presidents", function() {
		
			var test_coll_presidents = function() {
				var coll_presidents = get_coll_presidents();
				//console.log('coll_presidents ' + stringify(coll_presidents));
				
				// ----------------------------------------------------------------
				
				// have a look at its Data_Object (constraint)
				
				//var cp_doc = coll_presidents._data_type_constraint;
				var cp_dtc = coll_presidents._data_type_constraint;				
				//console.log('cp_dtc ' + stringify(cp_dtc));
				assert.equal(stringify(cp_dtc), '{"_constraint_type": "data_type"}');			
				
				// ----------------------------------------------------------------
				
				// look at the fields
				
				//var dobj = cp_dtc.data_object;
				//var okvs = dobj.fc.okvs;
				//console.log('okvs ' + (okvs));
				//var okvs_keys_and_values = okvs.keys_and_values();
				//console.log('okvs_keys_and_values ' + stringify(okvs_keys_and_values));
				
				// within the field_collection's ordered kvs, there are the keys for the fields.
				//var doc_fields = cp_doc.data_object.fields();
				// should be OK getting the fields from the ordered KVS key and value store.
				//console.log('doc_fields ' + stringify(doc_fields));
				
				// let's have a look at the items in the collection.
				//var cp_vals = coll_presidents.values();
				//console.log('cp_vals ' + stringify(cp_vals));
				
				// ----------------------------------------------------------------
				
				// have a look at the indexes... see which fields are indexed.
				
				var estimated_cp_indexes_0 = {
					_super: undefined,
					fields: ["name"],
					alphabetic_fields: ["name"],
					__type: "collection_index",
					index_type: "sorted"
				};
				
				var estimated_cp_indexes_1 = {
					_super: undefined,
					fields: ["party"],
					alphabetic_fields: ["party"],
					__type: "collection_index",
					index_type: "sorted"
				};
				
				
				var cp_indexes = coll_presidents.indexes();
				//console.log('cp_indexes ' + stringify(cp_indexes));
				assert.equal(cp_indexes.length, 2);
				test_utils.assertListedProps(cp_indexes[0], estimated_cp_indexes_0);
				test_utils.assertListedProps(cp_indexes[1], estimated_cp_indexes_1);
	
				/*assert.equal(cp_indexes[0]._super, undefined);
				assert.equal(cp_indexes[0].fields, "name");
				assert.equal(cp_indexes[0].alphabetic_fields, "name");
				assert.equal(cp_indexes[0].__type, "collection_index");
				assert.equal(cp_indexes[0].index_type, "sorted");
				
				assert.equal(cp_indexes[1]._super, undefined);
				assert.equal(cp_indexes[1].fields, "party");
				assert.equal(cp_indexes[1].alphabetic_fields, "party");
				assert.equal(cp_indexes[1].__type, "collection_index");
				assert.equal(cp_indexes[1].index_type, "sorted");*/
				
				
				/*
				console.log(cp_indexes.length);
				
				for (var i=0, l=cp_indexes.length; i<l; i++){
					var ind = cp_indexes[i];
					console.log("=== " + i + " ===");
					for (var prop in ind){
						var val = ind[prop];
						if (typeof(val) != "function"){
						  console.log("  " + prop + "=" + val);
						}
					}
				}*/
				
			}
			test_coll_presidents();
		
			assert.equal(11111, 11111);
		});
					
		// -----------------------------------------------------
		//	test_mini_coll_presidents
		// -----------------------------------------------------
			
		it("test_mini_coll_presidents", function() {
		
			// get_mini_coll_presidents
			
			var test_mini_coll_presidents = function() {
				var mini_coll_presidents = get_mini_coll_presidents();
				//console.log('mini_coll_presidents ' + stringify(mini_coll_presidents));
				// have a look at its Data_Object (constraint)
				
				//var cp_doc = coll_presidents._data_type_constraint;
				
				//console.log('cp_dtc ' + stringify(cp_dtc));
				// look at the fields
				
				//var dobj = cp_dtc.data_object;
				//var okvs = dobj.fc.okvs;
				//console.log('okvs ' + (okvs));
				//var okvs_keys_and_values = okvs.keys_and_values();
				//console.log('okvs_keys_and_values ' + stringify(okvs_keys_and_values));
				
				// within the field_collection's ordered kvs, there are the keys for the fields.
				//var doc_fields = cp_doc.data_object.fields();
				// should be OK getting the fields from the ordered KVS key and value store.
				//console.log('doc_fields ' + stringify(doc_fields));
				
				// let's have a look at the items in the collection.
				//var cp_vals = coll_presidents.values();
				//console.log('cp_vals ' + stringify(cp_vals));
				
				// have a look at the indexes... see which fields are indexed.
				
				var cp_indexes = mini_coll_presidents.indexes();
				//console.log('cp_indexes ' + stringify(cp_indexes,undefined,["tree"]));
				var estimated_cp_indexes_0 = {
					_super: undefined,
					fields: ["name"],
					alphabetic_fields: ["name"],
					__type: "collection_index",
					index_type: "sorted"
				};			
				var estimated_cp_indexes_1 = {
					_super: undefined,
					fields: ["party"],
					alphabetic_fields: ["party"],
					__type: "collection_index",
					index_type: "sorted"
				};
				assert.equal(cp_indexes.length, 2);
				test_utils.assertListedProps(cp_indexes[0], estimated_cp_indexes_0);
				test_utils.assertListedProps(cp_indexes[1], estimated_cp_indexes_1);				
				
			}
			test_mini_coll_presidents();
		});
					
		// -----------------------------------------------------
		//	test_get_by_name
		// -----------------------------------------------------
			
		it("test_get_by_name", function() {
		
			var test_get_by_name = function() {
				
				
				// Now, integrating collection with a KSVS.
				// We still don't have full-text search capability.
				//  Other advanced indexing systems will lead to that.
				// For the moment, can make use of the ordered collection capability.
				// Do not choose the index type like that exactly.
				//  Will choose the index capabilities.
				
				// Map, Sorted, FullText
				// The full text index will take longer to make.
				
				
				// will be testing with name prefixes as well
				
				
				
				
				// index_by does not particularly specify a unique index.
				//  perhaps a non-unique dict index class should be made to deal with that situation
				//   not sure about it storing a collection of the items. could do, but with them not indexed at all.
				//  
				
				
				//coll_presidents.index_by('name');
				
				var coll_presidents = get_coll_presidents();
				// it's not a full text index.
				//  A full-text index would definitely be cool.
				
				// it makes an index of the presidents' names. Not defined as being unique here.
				//   So there would be more than one item at the position for repeated names.
				
				// With the index, how hard is it to get the position in the index?
				//  Does the index store that?
				
				// B+ tree storing the size of the node including all subnodes, and re-adjusting that when necessary?
				//  Would take some more work, but would speed up getting the position of the item in the index.
				//console.log('coll_presidents ' + stringify(coll_presidents));
				
				// perhaps we should not call it search here?
				//  maybe search will only apply to prefix search, full text search, or regex search.
				
				//var george_washington = coll1.search('name', 'George Washington');
				
				// We should be able to find out what fields the collection is indexed as
				//  Of course, there can be multiple indexes
				
				// Will be interesting to see again what size this becomes when it is all compressed and served to the client.
				//  Will be necessary to make some client distributions when the whole codebase is stable.
				//  Coming up with partial build solutions would be even better, could use JavaScript parsing and recompilation abilities within the
				//  software itself. I think I'll be able to do a lot of this over the next few days.
				
				// It will be possible to make client-side distributions without so much building, and won't be huge.
				//  That would be a task once there is something good running from the server.
				
				// Could store the JavaScript in the database, as a user's files, and then there could be systems that analyse that JavaScript
				//  and assist in recomposition. JavaScript builder could be a useful thing that is made using the system before the JavaScript is fully optimized.
				
				// Will have this system for storing things in the database before too long.
				//  The Postgres mapping lsyer should prove very useful, but not sure if Mongo would have been quicker to start with.
				//  Anyway, I think Postgres is a very good database of the relational variety. It will be very good to have this running so that it can use Postgres
				//   effectively through an ORM layer. Having it able to map out an RDB and export the data to something like Mongo could be very useful.
				//  This code could be very useful for moving data between various different sources, and even be a useful data source in its own right.
				
				
				
				//var george_washington = coll_presidents.get('George Washington');
				//  'name' is not set to be any kind of ID, or unique index.
				//  Find is a more appropriate word here than 'get'.
				
				// will prefer to search by a field or fields...
				//  perhaps this single parameter version will find out what the required / primary field is and use that.
				//  may remove that one, but could be really useful as a shorthand when people use it right.
				// could specify the 'default search', or it will automatically be the only index, or the first index specified.
				
				// will need to translate this a bit to get it working with PKs as well when new ID fields are introduced into the data model.
				
				
				
				
				
				
				var arr_george_washington = coll_presidents.find('name', 'George Washington');
				
				// Range searches are the next thing
				
				
				// .find('Donald Tsang < name < Jamie Oliver')
				// .find('Jamie Oliver > name > Donald Tsang') // in reverse order - it could notice that a > b and do the DESC query.
				
				
				//   Perhaps it could identify it as being a range search.
				
				
				//  I think this makes an easily readable, and writable, convenient syntax.
				
				//  would translate the range search.
				//  Possibly could make wrappers to access range searches relatively easily.
				
				// not doing a prefix search
				// carries out 'find', which may return more than one result.
				// B+ seems maybe easier for when there are multiple values with the same key.
				
				// array of Data_Objects.
				//  What about just getting the records that were put in, not as Data_Objects?
				//   could have a standardised interface to choose that,
				//   could have a function that extracts the value from the Data_Object, like dval
				// I think quite a lot of code will accept Data_Objects.
				//  There could be some automatic rearrangement like with fp.
				
				
				//console.log('george_washington ' + stringify(arr_george_washington));
				assert.equal(stringify(arr_george_washington), '[Data_Object({"name": "George Washington", "y1": 1789, "y2": 1797, "party": undefined})]');
								
				// This will get to the situation where a database can be specified with convenient syntax.
				//  Then there will be the ORM to create an abstract RDM. Then the abstract RDB will translate itself to an RDB in a particular language.
				
				// Much of the database processing (ORM) will be useful for connecting to other systems. This could be a very useful tool for data migration.
				// To begin with, I'll have this working as a tool to power my website.
				//  I'll have it generating a powerful database system, and then using that to serve content to my website.
				//  I don't think the website will need to be all that complicated. There are various objects that will get stored and retrieved,
				//   used for generating the website.
				
				
			}
			test_get_by_name();		
		});
					
		// -----------------------------------------------------
		//	test_2_field_index
		// -----------------------------------------------------
			
		it("test_2_field_index", function() {
		
			var test_2_field_index = function() {
				var coll_presidents = get_coll_presidents();
				
				
				// 1 index with 2 fields
				coll_presidents.index([['name', 'party']]);
				
				// can try to add another value...
				
				coll_presidents.push({'name': 'Franklin Pierce', 'y1': 1853, 'y2': 1857, 'party': 'Republican'});
				
				// can iterate through the index
				//  there should be three indexes in the system after this one has been made.
				
				var found = coll_presidents.find([['name', 'Franklin Pierce'], ['party', 'Republican']]);				
				//console.log('found ' + stringify(found));
				assert.equal(stringify(found), '[Data_Object({"name": "Franklin Pierce", "y1": 1853, "y2": 1857, "party": "Republican"})]');
				
				// should have found one record if it was erroneously there.
				
				// seems to run smoothly
				//  that is a simple enough query format.
				//  could possibly have a functional syntax, so we could give it find(['name', range('J', 'M')])
				
				// These various commands could be really useful in the browser.
				//  I think it's likely to have an SQL interpreter, could use SQL to select from online data sets, or data sets in the client.
				//  This should be very good for some front-end data needs.
				
				/*
				
				each(found, function(i, v) {
					console.log('i ' + i);
					console.log('v ' + v);
				})
				*/
				
				
				
				//var 
				
				
			}
			test_2_field_index();		
		});
					
		// -----------------------------------------------------
		//	test_2_field_unique_constraint
		// -----------------------------------------------------
			
		it("test_2_field_unique_constraint", function() {
		
			var test_2_field_unique_constraint = function() {
				var coll_presidents = get_coll_presidents();
				
				
				// 1 index with 2 fields
				//coll_presidents.index([['name', 'party']]);
				
				// a way of specifying that these two fields together form a unique index.
				//  possibly make a shortcut for this.
				coll_presidents.unique(['name', 'party']);
				// the field names in an array
				
				
				//throw('stop');
				// can try to add another value...
				
				var actual_err = "";
				var estimated_err = "Collection constraint(s) not satisfied";
				
				try {
					coll_presidents.push({'name': 'Franklin Pierce', 'y1': 1853, 'y2': 1857, 'party': 'Democratic'});
				}catch (err){
					actual_err = err;
					//console.log(stringify(err));
				}
				assert.equal(actual_err, estimated_err);
				
				// can iterate through the index
				//  there should be three indexes in the system after this one has been made.
				
				//var found = coll_presidents.find([['name', 'Franklin Pierce'], ['party', 'Republican']]);
				// search fields given in order - ordering not guaranteed in object.
				
				//console.log('found ' + stringify(found.length));
				//console.log('found ' + stringify(found));
				
				// should have found one record if it was erroneously there.
				
				// seems to run smoothly
				//  that is a simple enough query format.
				//  could possibly have a functional syntax, so we could give it find(['name', range('J', 'M')])
				
				// These various commands could be really useful in the browser.
				//  I think it's likely to have an SQL interpreter, could use SQL to select from online data sets, or data sets in the client.
				//  This should be very good for some front-end data needs.
				
				/*
				
				each(found, function(i, v) {
					console.log('i ' + i);
					console.log('v ' + v);
				})
				*/
				
				
				
				//var 
				
				
			}
			test_2_field_unique_constraint();
			// this causes an error, as it should.		
		});
					
		// -----------------------------------------------------
		//	test_unique_index_constraint
		// -----------------------------------------------------
			
		it("test_unique_index_constraint", function() {
		
			var test_unique_index_constraint = function() {
				//console.log('test_unique_index ');
				var coll_books = new jsgui.Collection([
				   {'name': 'JavaScript: The Good Parts', 'author': 'Douglas Crockford', 'isbn-13': '978-0596517748'}
			    ]);
				
				// other ISBN field, isbn-10 would also be unique, but maybe not the primary field used for get operations.
				
				// that will set it as the first unique constraint.
				//  this also means it is setting up a Field_Constraint on its constraint data_object
				//  If constraints are specified that apply to a Data_Object, it stores such constraints as an actual Data_Object.
				
				
				// How much of the constraint processing is on Data_Object?
				//  I think Collection should have its own constraint processing.
				
				// could set the field(s)
				
				//coll_books.constraint(['unique', 'isbn-13']);
				coll_books.unique('isbn-13');
				
				// gets specified more nicely than that...
				//  unique('isbn-13')
				
				
				// setting this constraint should also create the index if it is not already there.
				
				// Quite a lot of people could get using this system.
				//  I think it will be especially useful when it is applied to different things as well.
				//  Serving HTML from a web database using Resources seems like a good idea.
				//  It's going to take a while longer, some more programming to do.
				
				// Making the database system, where there is an abstract web db description that gets made,
				//  perhaps the authenitcation mechanism could be mirrored as well.
				
				//coll_books.primary_unique_index('isbn-13');
				// could have a primary sequential index as well.
				
				// also primary full-text index when such capabilities are made.
				
				
				// just pushing an Object.
				//  I think the collection will turn it into a DataObject.
				// this causes an error.
				
				// may want to check if such an item can be added or not, could have a safe_push that does not throw the error but returns the error information in the result
				//  or could move to the callback pattern anyway which has both error and result.
				

				var actual_err = "";
				var estimated_err = "Collection constraint(s) not satisfied";
				
				try {
					coll_books.push({'name': 'JavaScript: The Bad Parts', 'author': 'Buggy Crockford', 'isbn-13': '978-0596517748'});
					//  should not be allowed because of the the unique index.
				}catch (err){
					actual_err = err;
				}
				assert.equal(actual_err, estimated_err);
				
			}
			test_unique_index_constraint();
			// also throws an error
		});
					
		// -----------------------------------------------------
		//	test_president_class
		// -----------------------------------------------------
			
		xit("test_president_class", function() {
		
			// will index the presidents collection on more than one thing.
			//  will then carry out search / get requests based on that index, and also trying unindexed properties?
			
			
			// Now the indexes and constraints seem to be working, both in specification and in practise, we can get them working in the DB
			//  transformations.
			
			// What about events, such as for when an index gets added?
			
			
			var test_president_class = function() {
				
				// we are still saying / suggesting fields get indexed.
				//  when we have a collection of President objects, they get indexed by name
				//  indexed and unique get ignored here apart from fields suggestions, or suggested_collection_constraints?.
				//  collection_suggestions
				//  _collection_suggestions
				//  _suggestions
				
				// also, saying that a Data_Object should have suggested that multiple fields together are unique?
				//  This could be useful for the whole of the object definition being in that bit of the code.
				
				// There may be collections that break uniqueness rules. Eg a collection of tables in different databases.
				//  It may be possible to relax constraints.
				//  .relax(constraint)
				//  .unrelax() all, unrelax(constraint), unrelax(str constraint search rule)
				//  It will be useful that the index is not enforcing uniqueness any longer.
				//   All these things will be useful for defining the Database system clearly.
				
				// It may be worth getting DB operating through Mongo soon...
				//  But the ORM layer seems really good. I think it will make things work a lot smoother for building add-ons for existing systems,
				//  as well as importing the data from them.
				
				// May be possible to get all the information into the system, and mirror new information going in.
				//  That kind of upgrade could be done very quickly using such a system.
				//   The data integration tools will already have done much of the work.
				//    Would immediately be able to show existing data in a more user-frieldly way.
				// 'suggestions': {'unique': [], 'index': []}
				
				var President = Data_Object.extend({
					
					// some of this becomes suggestions for the fields.
					//  what gets suggested to the Collection about how it handles some indexes and constraints.
					
					// The Data_Object should keep track of some collection_suggestions.
					//  There may be some kind of indexing system for these...
					//   what fields the suggestion applies to, what type of suggestion it is.
					
					// could have a text index, may make something extended from Sorted_KVS, which takes specific fields.
					
					//  The whole internal database system will be useful when mapped to another system.
					//  Not much mapping will be needed with Mongo.
					//   Will interface with the Mongo schema system.
					//  The whole ORM system will take a while longer, but it will be nice to complete.
					//   Maybe releasing the ORM code does make sense, and I'd still use it as a web service.
					//    There will be more to the web service than components, there will still be a lot that gets declared in my system.
					//   Likely to sell subscription first?
					//   But the ORM code, if released, would be one of those things that would make this great software, with it setting some patterns.
					//    Other people could write other ORM code then, such as for Oracle and Microsoft.
					//  Website will come first.
					//  Will not release the whole stack to begin with.
					//  Will release some very interesting client pieces, and offer to license use of the whole web stack.
					//   Could offer the ORM code fairly cheaply... but that does interrupt the process of using it.
					//   Could release that as commerial & GPL?
					//    Don't like doing that.
					
					//  A cheap commerial license could be OK... maybe have a 'preview' license, but then it won't be open-source.
					//   Could definitely help with consultancy... but then having 'pro' components may prove very lucrative.
					//    I think selling this as a commercial license would be best... a small presentation on the website, saying what the various stages are
					//     then 'from $99 / developer'
					//    Would have good integration with the MetaBench online services too... provide code, but charge for it. Show it working in an online demo... allow them
					//     to subscribe to that system easily.
					//    Perhaps charge less, but then when doing consultancy & licensing souce code, charge more.
					//     Could charge quite a lot for integration services using specialised code.
					//  If the online publishing side of things is going really well, could open source it then.
					//   Make money through adverts when showing the work.
					
					// Once the web database system has been made, want to use that for the website.
					//  It will be nice to have the Postgres database being generated.
					// Will be fairly simple CRUD.
					//  Eg database collection of tables will have unique names.
					//   so will functions (perhaps unique from table names too)
					//  That is another constraint then...
					//   or the database has objects that are either tables or functions.
					//    it indexes by object type, also by name.
					
					// How to get two collections within an object sharing a unique_name_index?
					//  Perhaps the unique index is a property of the Data_Object,
					//   however, I think that having all objects in a collection does make sense there.
					//  They could be in a collection of tables, or functions as well as the global collection.
					
					// Having an item within multiple collections...
					//  I suppose database would be a good place to start.
					//   This would be doing many of the things that had got planned for the system.
					
					// General object collection
					//  Collections for particular object types
					//  Having the Database hold a collection of lots of object types
					//   Also enforcing a unique constraint on names accross object types.
					
					// A collection functioning like an index?
					//  Want to make this flexible enough so that more complicated systems can make use of this effectively.
					
					// Global collections?
					//  So the Database would have a global collection.
					//  Before putting anything in any of its other collections it would check if it could go in the global collection.
					//   If it can, we are fine to go ahead.
					//   could have pre_add_check event that gives the event handler the chance to reject something from going into the collection.
					
					// For the moment, can ignore the database's global collection.
					//  Can create the objects, then translate them to the different DB representations.
					
					// When deleting a table - able to delete the fields that refer to that table?
					//  Able to find out which fields refer to it and present the user with the option of cascading the delete?
					
					// Collection will be the parent, effectively. Want to have the item having multiple parents.
					//  This will help with the Database object where it has a collection of objects with unique names,
					//   but these objects are also in the Tables, Functions, and maybe other collections as well.
					
					// There is quite a bit of complexity in this system, but it should all work fine together.
					'fields': [
						['name', 'indexed text(32)'],
						['party', 'indexed text(32)'],
						['y1', 'int'],
						['y2', 'int']
					],
					// the fields should get saved on the prototype.
					//  then it will be possible to follow the prototype chain upwards to get different fields...
					//  will have this working for inheriting from something with fields, where new fields get specified as new fields there, and the old ones are still used.
					
					'connect': true
					// connect_fields
					
				});
				
				// then view the president object's fields (through the prototype)
				
				var pres = new President();
				
				var Country_President = President.extend({
					'fields': {
						'country': 'indexed text(32)'
					}
				})
				
				
				
				var Motorist_Country_President = Country_President.extend({
					'fields': {
						'car': 'indexed text(32)'
					}
				})
				
				// need to have it easy to get the fields from the spec.
				//  Think I'll do a spec key comparison... if it looks like a spec, treat it like one.
				
				
				
				var pres_jackson = new Motorist_Country_President({'name': 'Andrew Jackson', 'y1': 1829, 'y2': 1837, 'party': 'Democratic'});
				
				//pres_jackson.party('Dictatorial');
				
				
				//console.log('pres._fields ' + stringify(pres._fields));
				//console.log('pres_jackson._fields ' + stringify(pres_jackson._fields));
				
				// OK... can be done. Classes have a _superclass attribute.
				//  Called that to differentiate it from _super, this is the kind of thing that can have its name
				//   globally replaced in compilation.
				
				/*
				
				var fc = get_fields_chain(Motorist_Country_President);
				console.log('fc ' + stringify(fc));
				
				var cf = get_chained_fields(Motorist_Country_President);
				console.log('cf ' + stringify(cf));
				
				
				var cf_jackson = get_chained_fields(pres_jackson.constructor);
				console.log('cf_jackson ' + stringify(cf_jackson));
				*/
				
				// basically it reads the field constraints into an object, or sets the field constraints from that object.
				
				//each(pres_jackson, function(i, v) {
				//	console.log('i ' + i);
				//});
				
				var jackson_fields = pres_jackson.fields();
				
				
				
				
				console.log('jackson_fields ' + stringify(jackson_fields));
				
				var jackson_fields_map = mapify(jackson_fields);
				console.log('jackson_fields_map ' + stringify(jackson_fields_map));
				
				pres_jackson.party('Totalitarian');
				
				console.log('pres_jackson ' + stringify(pres_jackson.get()));
				
				// If it were connected to an index, it would need to update the value in that index.
				//  Would also raise the change event.
				
				// Collection(Table)
				// var president_collection = Collection(President)
				
				
				
				// nice if the fields are connected as well.
				
				//console.log('pres_jackson._connect ' + pres_jackson.constructor._superclass);
				
				// we can go up the ancestry chain to find the 'connect' value.
				/*
				var connect_value = false;
				
				iterate_ancestor_classes(pres_jackson.constructor, function(a_class, stop) {
					console.log('a_class._connect ' + a_class._connect);
					if (is_defined(a_class._connect)) {
						connect_value = a_class._connect;
						stop();
						
					}
					console.log('a_class ' + stringify(a_class));
				})
				*/
				//console.log('connect_value ' + connect_value);
				
				// I think some ancestry_iterator would be helpful.
				//  The ancestors may not have the right data types as properties, but that could be worked at.
				//  I'm likely to extend the current ancestry / class system a bit, extra info will be given
				//  Then to make an API where the classes get specified more easily.
				//   Interested in a compatibility layer with Crockford's Module Pattern.
				//   Module_Wrapper, it creates the new object and it has funtions that call the Module Pattern object's functions.
				//    Still created with the new constructor, will be useful for bringing things written in Module Pattern into the system.
				
				
				
				
				
				
				//console.log('pres_jackson.constructor prototype fields ' + stringify(pres_jackson.constructor.prototype._fields));
				//console.log('pres_jackson.constructor prototype fields ' + stringify(pres_jackson.constructor.prototype._fields));
				
				
				//var jcf = get_chained_fields(pres_jackson.constructor);
				//console.log('jcf ' + stringify(jcf));
				
				//var fc_jackson = pres_jackson.get_fields_chain();
				
				//console.log('fc_jackson ' + stringify(fc_jackson));
				
				
				//each(Country_President.prototype, function(i, v) {
				//	console.log('i ' + i);
				//})
				//console.log('');
				//var fc_cp = Country_President.prototype.get_fields_chain();
				
				//console.log('fc_cp ' + stringify(fc_cp));
				
				// means the fields are connected as objects.
				//  there will be functions that are connected to the functions though.
				//   this will mean making changes to something in a model will take 1/3 as much code as in Backbone in some cases.
				//    pushing an item into an array in a Data_Object compared to Model.
				
				// Having collections within a Data_Object will be a big improvement on Backbone, will lead to much greater flexibility.
				
				// A website with a comments section would be quite nice. It would be interesting to generate interaction on the website and monetize that.
				//  Will be good for seeing how many people are interested in this.
				
				
				// saying how fields are connected...
				// connect: [list of field names]
				//  they are wrapped in Data_Objects anyway, that could help with value replacement.
				//  executing function to get value seems like the way, so it can respond to object changes.
				//   even though the JS is now fairly old, we want full MVC working in older browsers.
				//  May have nicer syntax with compilation.
				
				
				// either when wiring / connecting the fields with values...
				//  collections should be fine as directly referenced objects.
				// otherwise, may be difficult replacing a DataObject, could make the property available rather than the object.
				// the collection will not need to change (generally), perhaps it could though.
				
				// so the object could be the getter/setter.
				//  want to generally have a convenient API.
				
				
				
				
			}	
			test_president_class();
		
			assert.equal(11111, 11111);
		});
					
		// -----------------------------------------------------
		//	test_collection_type_constraint
		// -----------------------------------------------------
			
		it("test_collection_type_constraint", function() {
		
			var test_collection_type_constraint = function() {
				var coll_presidents = get_coll_presidents();
				

				// 
				
				var President = Data_Object.extend({
					'fields': {
						'name': 'indexed text(32)',
						'party': 'indexed text(32)',
						'y1': 'int',
						'y2': 'int'
					},
					'connect': true
				});
				
				// ensure a constraint with that type?
				//  not so sure about it setting the fields...
				//   needs to ensure every item that goes into the collection has the required type.
				
				//console.log('tof(President) ' + tof(President));
				assert.equal(tof(President), 'function');
				// function
				//  use function to identify constructors?
				//   or a function with .prototype, .extend, identifying it as a class constructor.
				//   
				var is_constructor_fn = jsgui.is_constructor_fn;
				//console.log('is_constructor_fn(President) ' + is_constructor_fn(President));
				assert.equal(is_constructor_fn(President), true);
				
				// identifying constructors in the signature?
				//  will use is_constructor_fn in polymorphism for the moment.
				
				
				//coll_presidents.ensure_type_constraint(President);
				coll_presidents.constraint(President);
				
				var Tower = function() {
					//this.name = 'Elizabeth Tower';
				}
				
				var e_tower = new Tower();
				//coll_presidents.push(e_tower);
				// fails the collection constraint test.
				//  nice if the error message said which constraint it failed.
				
				
				
				
			}
			test_collection_type_constraint();		
		});
					
		// -----------------------------------------------------
		//	test_collection_with_name_property
		// -----------------------------------------------------
			
		xit("test_collection_with_name_property", function() {
		
			// setting Data_Object fields to be collections, then using those collections effectively.
			//  even when we have constrained collections, could make it so that adding an object will add it to the correct collection.
			// but could make the 'add' function specific to the Database.
			//  there are plenty of features that could be put in place for most convenient syntax.
			//   they make the library bigger though.
			
			// It will be nice if soon this ORM system can be made, and / or a mongo system used.
			// I think making the ORM first makes sense, because the mongo system will shortcut it.
			
			// However, could make a Mongo interface from the Database object.
			//  That is already an object database really.
			//  Wrapping that with a Mongo interface layer...
			// May be best done with resources. A mongo database resource is started up, it exposes a mongo-db layer.
			// Could make a mongo-web-db layer?
			// Have web-db, describes the web database
			// Then need Database -> Mongo Database (resource)
			// Not so sure it would need to translate the database, or do much with it really.
			
			// Will need to implement some things to do with authentication?
			//  But that could be done in the web-db layer.
			
			// It would seem more obvious how to do it after making the full ORM layer, and making it easy to call the functions from JavaScript.
			
			// Perhaps a similar CRUD layer could be made for Mongo.
			//  Will be able to put objects in the DB relatively easily.
			
			// Perhaps could have an Abstract-MongoDB object. This would be created from the object database.
			//  Then that abstract Mongo database would be persisted. It would be much simpler than the SQL database.
			//  Could use a MongoDB resource. This would require a fair bit more programming too.
			//  There is definitely quite a lot left in order to get this web system. Can be making progress with it though.
			
			// Postgres could be easier because I know Postgres better!
			//  Defining the abstract mongo database... may not be that simple.
			//  Would need to go towards a mongo database creation layer.
			
			// This abstract mongo db code would be like the Collection and Data_Object code, except they would not actually carry out the indexing or holding of data
			
			// Defining some relatively simple indexes using Collection, Data_Object, maybe Database. They are then turned into a relatively simple Abstract-MongoDB object.
			//  This is then persisted.
			// Abstract-MongoDB should also be capable of taking changes, and generating instructions on replicating those changes in a live Mongo database.
			//  This may be a bit complicated in terms of administering a Mongo cloud.
			
			// Would create the Abstract-MongoDB object from the Database, then would persist the abstract one.
			//  May not be so many things to get from there.
			
			// Also, want to be able to get an Abstract-MongoDB from an existing live Mongo database.
			//  Then would be able to do comparisons between them, come up with instructions that would change one to the other.
			//   These instructions would then be carried out. Not sure about translating them back to Abstract Database in order to determine the changes
			//    that would be the more powerful way if it worked, may be quite effective too.
			
			// Abstract-ODB?
			//  Could be simple, and get translated to other database implementations such as Mongo.
			
			// For the moment, need to get the relatively simple abstract mongo db generated from a jasui Database.
			//  Will do work on the ORM as well... get it generating an abstract RDB.
			
			// Will do testing of DB generation outside of the Resource mechanism for the moment.
			
			// The whole abstraction system should work neatly.
			//  Much of it will be encapsulated inside resources.
			
			
			
			
			
			
			var test_collection_with_name_property = function() {
				var coll_presidents = get_coll_presidents();
				coll_presidents.set('name', 'Presidents');
				
				var name = coll_presidents.get('name');
				console.log('name ' + name);
			}
			test_collection_with_name_property();
		
			assert.equal(11111, 11111);
		});
					
		// -----------------------------------------------------
		//	test_data_object_read_only_field
		// -----------------------------------------------------
			
		it("test_data_object_read_only_field", function() {
		
			// data object read only property.
			//  won't really be used much for database objects, but useful nonetheless.
			//  ._read_only_map
			//    a truth map by name of the property.
			//  will check before every set operation whether that property is read only or not.
			//   however, would still be able to change the map.
			//   more designed to prevent errors than to make it impossible to set the data.
			
			// .read_only(field_name) - makes it read only
			// .read_only(field_name, true)
			// .read_only(field_name, false)
			//  include the read_only flag in information about fields? read_only: true
			// would certainly be useful for identifying read-only fields for when they get presented to the user.
			
			
			
			// Test a read-only field that has been defined as part of the Data_Object.
			//  Would be another thing to handle with the field input processing, would have a read_only flag.
			
			
			
			var test_data_object_read_only_field = function() {

				var President = Data_Object.extend({
					
					'fields': {
						'name': 'indexed text(32)',
						'party': 'readonly indexed text(32)',
						'y1': 'int',
						'y2': 'int'
					},
					
					// the fields should get saved on the prototype.
					//  then it will be possible to follow the prototype chain upwards to get different fields...
					//  will have this working for inheriting from something with fields, where new fields get specified as new fields there, and the old ones are still used.
					
					
					
					'connect': true
					// connect_fields
					
				});
				
				// then view the president object's fields (through the prototype)
				
				//var pres = new President();
				
				// allowed to set something initially. Will not do read_only check then.
				var pres_jackson = new President({'name': 'Andrew Jackson', 'y1': 1829, 'y2': 1837, 'party': 'Democratic'});
				
				
				//pres_jackson.party('Totalitarian');
				
				//console.log('pres_jackson.fields ' + stringify(pres_jackson.fields()));
				// could return a read_only flag, or maybe other flags if necessary.
				assert.equal(stringify(pres_jackson.fields()), '[["name", "indexed text(32)", {"data_type": ["text", 32], "indexed": true}], ["party", "readonly indexed text(32)", {"data_type": ["text", 32], "read_only": true, "indexed": true}], ["y1", "int", {"data_type": "int"}], ["y2", "int", {"data_type": "int"}]]');
				
				//
				
			}
			test_data_object_read_only_field();
		
		});
					
		// -----------------------------------------------------
		//	test_collection_as_field
		// -----------------------------------------------------
			
		xit("test_collection_as_field", function() {
		
			var test_collection_as_field = function() {
				// May want to have a field in a data_object specified to be a collection.
				
				// That collection could have its constraint about what goes in there.
				//  what type of object, with data_type_constraint.
			}
		
			assert.equal(11111, 11111);
		});
					
		// -----------------------------------------------------
		//	test_collection_general_event_response_to_data_object_change
		// -----------------------------------------------------
			
		xit("test_collection_general_event_response_to_data_object_change", function() {
		
			// This may have been improved now.
			var test_collection_general_event_response_to_data_object_change = function() {
				var coll_presidents = get_coll_presidents();
				
				coll_presidents.add_event_listener(function(target, event_name, event_params) {
					//console.log('target ' + target);
					//console.log('event_name ' + event_name);
					//console.log('event_params ' + event_params);
					
					
				});
				
				// then we want to get the George Washington record
				//  Change his name to George Wellington
				
				var george_washington = coll_presidents.get('George Washington')[0][1];
				var pos_george = george_washington.position_within(coll_presidents);
				console.log('pos_george ' + pos_george);
				
				// Need to do some more work on these collections and the data structures.
				//  Will get it working for the execution path of my web server.
				//  Will serve some content from JSON data to start with.
				
				// Possibly will get the execution path working over the weekend.
				
				// Not so sure about using Postgres things for the moment.
				//  Having some kind of website being produced through node will be very good. It will also be a point where these front'end controls can
				//   be put into place and demonstrated.
				
				
				var franklin_pierce = coll_presidents.get('Franklin Pierce')[0][1];
				var pos_franklin = franklin_pierce.position_within(coll_presidents);
				console.log('pos_franklin ' + pos_franklin);
				
				
				
				
				// then when removing an item from the collection, will need to adjust other items in the collection.
				
				// Abraham Lincoln
				
				
				var abraham_lincoln = coll_presidents.get('Abraham Lincoln')[0][1];
				var pos_abraham = abraham_lincoln.position_within(coll_presidents);
				console.log('pos_abraham ' + pos_abraham);
				
				
				// maybe a different default stringify for data objects?
				//  will show object references through IDs
				//console.log('george_washington ' + stringify(george_washington));
				
				
				console.log('franklin_pierce ' + stringify(franklin_pierce));
				franklin_pierce.remove_from(coll_presidents);
				// needs to remove it from the indexes as well.
				
				// removing should raise an event too.
				
				
				//george_washington.set('name', 'George Wellington');
				
				// This should update everything properly, including the index.
				//  The items that are indexing this will need to get notified of the change.
				//   This change notification (the event firing) should be when the change is complete though, not before indexes have updated.
				//   Possibly??? Could have deferment mechanism.
				
				// then it should be raising the event, and doing the re-indexing
				
				
				var abraham_lincoln = coll_presidents.get('Abraham Lincoln')[0][1];
				var pos_abraham = abraham_lincoln.position_within(coll_presidents);
				console.log('pos_abraham ' + pos_abraham);
				
				
				
				
				var index_system = coll_presidents.index_system;
				
				/*
				index_system.iterate_indexes(function(index) {
					console.log('index ' + index);
					
					// it has a single index... what are its fields?
					
					//index_type
					
					console.log('index.index_type ' + index.index_type);
					console.log('index.fields ' + stringify(index.fields));
				})
				*/
				// can we search for an index?
				
				var idx_name = coll_presidents.get_index('name');
				// but index('name') should work when there is an existing index by name.
				//  otherwise it would create one.
				
				// Currently the sorted index is what it is doing. At a later stage I may have an efficient sorted, full-text self-index.
				
				console.log('idx_name ' + idx_name);
				
				// also want to iterate through the items.
				//coll_presidents.each(idx_name, function(i, v) {
				//	console.log('i ' + stringify(i));
				//	console.log('v ' + stringify(v));
				//	console.log('v ' + stringify(tof(v)));
				//}/)
				
				
				
			}
			test_collection_general_event_response_to_data_object_change();
		
			assert.equal(11111, 11111);
		});
					
		// -----------------------------------------------------
		//	test_parents_and_relationships
		// -----------------------------------------------------
			
		xit("test_parents_and_relationships", function() {
		
			// want to test parents and relationships.
			//  ease of use in syntax.
			//   when working with the simpler examples, it should also work with more complex objects that also are doing the same things regarding the collections.
			
			var test_parents_and_relationships = function() {
				
				// creating objects with names easily?
				//  use a 'name' property as a default in various cases?
				
				// a collection as a field?
				//  using the nested data object concepts?
				
				
				var coll_business_sectors = new Collection({});
				coll_business_sectors.push({
					'name': 'Agriculture'
				});
				coll_business_sectors.push({
					'name': 'Technology'
				});
				coll_business_sectors.push({
					'name': 'Energy'
				});
				
				// but maybe the data objects will hold collections.
				
				
				
				// then the various sectors??
				//  More work on the language foundation could get things working better on the periphary.
				//   But the work on the language foundation is quite boring. Still lots more of it can be done, with pluggable full-text indexing systems.
				
				
				
			}
			test_parents_and_relationships();
		
			assert.equal(11111, 11111);
		});
					
		// -----------------------------------------------------
		//	test_abstract_string_collection
		// -----------------------------------------------------
			
		it("test_abstract_string_collection", function() {
		
			var test_abstract_string_collection = function() {
				var abs_str_coll = Collection(String);
				//console.log('abs_str_coll ' + stringify(abs_str_coll));
				assert.equal(stringify(abs_str_coll), '~Collection(String)');
				
				
				//console.log('tof(String) ' + tof(String));
				
				
				// Collection(Unique(String))
				// Collection([String, Unique])
				// Collection(String, Unique)
				//  Different ways this could be expressed here.
				//  Collection('unique string') may be easiest / best for the moment.
				
				// Want to move this towards being a complete and fully functioning data system.
				//  Need quite a lot of flexibility in here. 
				
				
				
			}
			test_abstract_string_collection();
		
		});
										
	});
	
	
	
	
	
	
	
	// test a collection of unique strings - with and without throwing errors when adding another.
	// Collection('unique ignore-extra string');
	//  Would be quite a fast way of defining such a collection.
	
	
	
	
	
	//test_unique_index();
	
	
	// multiple unique indexes,
	// collections within collections.
	
	// The collection system is probably advanced enough for the abstract postgres system.
	
	// Can then make use of that to create a fairly advanced database that gets persisted.
	
	// Perhaps a web-db-postgres module would be very useful, with functions opening the database up to the web.
	//  Also could make use of a users, roles, permissions system.
	//  A bit of the application logic may wind up in the database, helped by functions that do things like check that a permission is granted to a user to do something.
	
	// Want such a permission and application structure defined, then have it operating on different database types when necessary.
	
	
	
	
	
	
	
	
	
	// want to create an index for the collection.
	//  then it will populate the index
	
	
	//  index_by should set the primary index.
	//   maybe we just want a dict index in most instances.
	
	// Set a primary unique (dict) index.
	//  When indexing with a trie or b+ tree (or more elaborate data structure) still could say the items are unique.
	
	// an index type called u_dict?
	// one caled nu_dict - where it does not force items to be unique.
	//  if they are not, it keeps a collection of them?
	//   that could make for multi-layer complications, but maybe multi-layer synergies too.
	
	
	
	// could try a 'get' operation too.
	
	// get may work when we have defined a single field to be the main unique identifier.
	
	
	
	
	// this looks like it works at this level... but how about getting it to work in other things, like Abstract Postgres?
	
	// specifying and enforcing unique constraints would be a useful thing.
	//  may want it to overwrite items if they have the same value.
	//  may want it to raise an error
	
	
	
	
	
	// OK, so at last this works :)
	
	
	
	//  could do direct key matching if there is a dict index.
	
	
	// getting the position within a different index...
	//  Get the order in terms of the position in an index...?
	//  With B tree?
	//  The items are ordered... could move back to see how many there are previously.
	//   May want better code to see how many previous items in a b tree index there are.
	//    It could probably be found quickly.
	//    Loooking at the size of branches? But does that get stored? Not sure we'll know it so easily.
	//  Iterating through items in a list in order won't be so hard though.
	
	// coll1.iterate_by('name', function(item) {})
	//   that could work. It would consult the index if it has one.
	//   otherwise, not sure exactly.
	//    would it created copy of it?
	//    or go through it 1 by 1, creating the b tree, then iterating through that, and discarding the tree?
	//    could copy the array, then sort that.
	//     iterate through that copy.
	
	
	
	
	
	
	
	
	
	// and look at the collection.
	
	// We may want to index them by name.
	//  Does that mean we can quickly get them in order of name?
	//  Different possibilities
	//   Just create the dict
	//    Get the name for each of them and put it in a dict 'index'
	//     can retrieve object by name
	//   Or a more elaborate index
	//    Get the name for each of them and put it in a b+ tree.
	//     We now can still quickly retrieve the object (like we could before though a bit slower in reality)
	//      we can iterate through the objects, ordered by name
	//      Perhaps this will be very similar to indexing by the position in another table
	//       Though that could have other dynamic complications.
	//   Could even have multiple indexes / indexes on different fields
	
	// So far, we don't exactly need to sort it.
	//  The index can just be something that gets specified.
	
	// So go from a name to the position in the array quickly.
	//  Possibly able to search by string prefix. Better search functions using the B+ tree.
	//  Probably don't want to build too many db mechanics into this myself...
	//   but do think some decent searching, sorting and ordering will help.
	
	// I think the B+ tree will be most useful when a collection needs to stay ordered by something.
	//  That is not the case at the moment, but it could be done.
	
	// However, certainly am writing more code, there will be some code amongst the comments.
	//  It may be worth making a system that tracks comments written in code.
	//  Could remove them from the source, and file them away through use of a tool with a GUI.
	
	
	
	//  wildcard / regex searches?
	//   they would be an interesting possibility.
	
	// coll1.search('name', 'James Madison') - would return the DataObject.
	
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