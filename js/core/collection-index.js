/*

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


define(["./jsgui-lang-essentials", "./jsgui-data-structures", "./data-object", "./constraint"], function(jsgui, Data_Structures, Data_Object, Constraint) {

*/

var jsgui = require('./jsgui-lang-essentials');
var Data_Structures = require('./jsgui-data-structures');
var Data_Object = require('./data-object');
var Constraint = require('./constraint');

	// Collection... use sligntly more than essentials?
	// Likely to use the Data_Object class here.
	
	// Don't want this stuff growing much more in size
	//  There will be more features, should add them sparingly
	//   Maybe a more advanced layer... really for the server side or the most in-depth applications.
	//   Will want some kind of later loading, the later loading system in the core layer.
	
	// Don't think this needs much more code at the moment.
	//  It's got fairly large.
	//  It should be a very useful part of the system.
	
	// Global collection reference...
	//  want it so that a collection can reference another collection, so that every item gets put into this collection
	//   also gets put into the global collection. Will check unique conflicts as well... but the global collection could have different things to index on
	
	// Restricting objects in collection by data type.
	
	// Collection can operate a lot like a normal object anyway now. It can hold objects indexed by name, just like a normal map.
	//  However, the name property is now intrinsic to that object as well as something that gets indexed.
	
	// Need to deal with attached fields, like this:
	// {'attached': {'meta': 'name'}}

	var j = jsgui;
	var Class = j.Class;
	var each = j.each;
	var is_array = j.is_array;
	var is_dom_node = j.is_dom_node;
	var is_ctrl = j.is_ctrl;
	var extend = j.extend;
	var clone = j.clone;
	var x_clones = j.x_clones;
	var get_truth_map_from_arr = j.get_truth_map_from_arr;
	var get_map_from_arr = j.get_map_from_arr;
	var arr_like_to_arr = j.arr_like_to_arr;
	var tof = j.tof;
	var is_defined = j.is_defined;
	var stringify = j.stringify;
	var functional_polymorphism = j.functional_polymorphism;
	var fp = j.fp;
	var arrayify = j.arrayify;
	var mapify = j.mapify;
	var are_equal = j.are_equal;
	var get_item_sig = j.get_item_sig;
	var set_vals = j.set_vals;
	var truth = j.truth;
	var trim_sig_brackets = j.trim_sig_brackets;
	var iterate_ancestor_classes = j.iterate_ancestor_classes;
	var is_constructor_fn = j.is_constructor_fn;
	
	var is_arr_of_strs = j.is_arr_of_strs;
	var is_arr_of_arrs = j.is_arr_of_arrs;
	 
	var Sorted_KVS = Data_Structures.Sorted_KVS;
	var dobj = Data_Object.dobj;
	
	var input_processors = j.input_processors;
	var Data_Value = Data_Object.Data_Value;
	
	
	var constraint_from_obj = Constraint.from_obj;
	var native_constructor_tof = jsgui.native_constructor_tof;
	// Definitiely will help the website to power quite a few things.
	//  Having a really nice website of my own will definitely help.
	
	// Will have examples in different categories, such as data tools
	//  May make some kind of database available and viewable in a read-only form, then this would be usable for queries that are done by the users of my system.
	//  This would be good for demonstrating some front-end visualization code.
	
	// Will be nice to allow users / subscribers to manage some of their own data.
	
	
	// Upgrade to the Data_Object set_field...
	//  Will be able to process array of constructor function, meaning a collection of that type.
	
	var Collection_Index = Class.extend({
		'init' : function(spec) {
			// Could do some initialization here?
			//console.log('init Collection_Index');
			//console.log('spec.fields ' + stringify(spec.fields));
			if (is_defined(spec.fields)) {
				this.fields = spec.fields;
				
				// and if it is an array, save an alphabetically ordered copy.
				
				if (tof(spec.fields) == 'array') {
					// Not sure we can sort object fields by name like this?
					//  It seems to work?

                    // Fields in alphabetic order...
                    //  However, there will be the capability for nested fields, and intrinsic property references.



					this.alphabetic_fields = clone(spec.fields).sort();
				}

				// the fields held by the Collection_Index.
				//  some fields may represent fields on attached items.
				//   looks like there won't be anything to do on this simple field assignment?



				// this index will be quicker for matching.
			}
			
			this.__type = 'collection_index';
			
		},
		'add_object' : function(obj) {
			var tobj = tof(obj);

			//console.log('add_object Collection_Index');
			//console.log('***** tobj ' + tobj);
			//console.log('obj', obj);

			if (tobj == 'array') {

				// check that all of the items can be added before adding any of
				// them???
				// or better to add them sequentially, because there could be
				// conflicts within the items themselves.
				// though, could check that first, but makes the code more
				// complex.
				// could do this by creating a parallel index with the same
				// properties, and have that load the data first.
				var that = this;
				each(obj, function(i, v) {
					that.add_object(v);
				});

			} else if (tobj == 'data_object') {
				//console.log('adding data_object');

				// chack if we can add it.

				//if (this.can_add_object(obj)) {
				// not doing uniqueness checking here.
				
					this.unsafe_add_object(obj);
				//}

				// then need to add the thing!

			}

		}

	// add_object
	// remove_object
	// iterate through objects...
	// default could be an array?
	// ?? get_object(key)

	// Index the whole collection... used when the index is created.

	// get_object(key, key)
	// get_object([keys])

	});

	// Ordered_Dict?

	var BPD_Collection_Index = Collection_Index.extend({
		'init' : function(spec) {
			// indexed with both the b+ tree and the dict.

		}
	})

	// Ordered collection index

	// Dict collection index

	// Ordered_Dict collection index - has both ordered and dict capabilities.
	// More space required, faster get operations through the dict.

	// Full_Text collection index?
	// This will be the most complicated to do. Would make data structures like
	// the Trie.
	// Could have that pluggable for more advanced data structures.

	// Dict, Ordered, and Full_Text seem like good index types.
	// Not saying how Ordered and Full_Text will be implemented.
	// Is it possible / easy for an index to be both full-text and ordered?

	// Could possibly even rate time complexity for each operation.
	// So program could even determine - we have 30,000 records, better download
	// a more efficient index.

	// Dict as the default index?

	// have dict_index(property_name) function?
	// sets up the index. di(pn, false) could remove it.

	// Seems good to separate these things out a lot.
	// Having it so that the index engines could get upgraded.

	// Would be worth approaching this in a very modular way, so that the data
	// structures could all be tested and optimized separately.
	// Swapped as well, as more advanced ones get written.

	//var index_key_separator = '*.oOo.*';
	
	var index_key_separator = ',';
	//  comma should work OK? Maybe not when reading out the values and knowing what they are from the key,
	//  but should be fine for comparisons and ordering
	
	// The trouble is, this could get written about!
	// Is there a way around using such a separator?
	// Not sure about more dict indexes at each level.
	// May not be a problem because we will be searching in the right indexes
	// anyway.

	// Attached fields... these will get indexed too.
	//  However, we won't have that much of an interface or abstraction for dealing with attached objects.
	//  They are simple object[attachmentName].

	// So in a collection, we want to be able to index attached fields.
	//  When querying them, we need to use a notation that indicated we are querying attached fields.
	//   It seems like they should be in the same index structure though.

	// Perhaps need to extend the indexes a bit to cover attached fields specifically in some places.

	// More thought about attached fields seems important.






	var Ordered_Collection_Index = Collection_Index.extend({
		'init': function(spec) {
			this._super(spec);
			// which field(s) get indexed?
			//this.fields = spec.fields;
			this.index_type = 'ordered';

		}

	// this will probably refer to the B+ implementation. need to wrap it
	// concisely.

	})

	// not so sure about this fn.
	var get_fields_key = function(fields) {
		var tf = tof(fields);
		if (tf == 'array') {
			return fields.join(index_key_separator);
		} else if (tf == 'string') {
			return fields;
		}
	}

    // We maybe need tests to do with adding Data_Objects to Collections, and seeing that they are automatically indexed.
    //  Currently having a problem accessing an Abstract Postgres Table through the Collection of tables.

    // Some unit tests to cover similar cases would help.

	var get_obj_fields_key = function(obj, fields) {
        //console.log('');
		//console.log('get_obj_fields_key');

		//var stack = new Error().stack
		//console.log( stack )

        //console.log('get_obj_fields_key obj', obj);
        //console.log('get_obj_fields_key stringify obj', stringify(obj));
        //console.log('tof obj', tof(obj));

		var tFields = tof(fields);

        //console.log('fields ' + stringify(fields));
		//console.log('tFields ' + tFields);

        // An attached field?
        //  So it's one object attached to another.

        //throw 'stop';
		if (tFields == 'string') {
			fields = [fields];
		}
		
		// var first = true;
		var arr_res = [];
		each(fields, function(i, field_definition) {

			// may check if it is a string or can be stringified.
			// maybe should call functions to get a string result too.

			// maybe will look at obj._ for the field value.
			// or use the get function.
			
			//console.log('field_name ' + stringify(field_name));


			var tFieldDef = tof(field_definition);
            //console.log('tFieldDef', tFieldDef);
			
			if (tFieldDef == 'array') {
				

				// gets more complicated with the array.
				//  commas will do fine for now.
				
				//var res = field_name.join(',');
				//console.log('res ' + res);
				//arr_res.push('[' + field_name.join(', ') + ']');
				//return res;
				arr_res.push(stringify(field_definition));
				
			} else if (tFieldDef == 'string') {

				// But for objects, we are getting potentially attached field values.




				//console.log('field_name ' + field_name);
                //console.log('field_definition', field_definition);
				var field_val = obj.get(field_definition);

                // Need to upgrade the object so it looks at intrinsic nested properties.

                //console.log('tof obj', tof(obj));
                //console.log('obj', stringify(obj));
                //console.log('obj', obj);

				//console.log('field_val ' + field_val);
                //console.log('tof field_val ' + tof(field_val));

               // throw 'stop';

                if (field_val) {
                    if (field_val.value) field_val = field_val.value();
                    arr_res.push(field_val);
                }




                //throw 'stop';

			} else if (tFieldDef == 'object') {
				//console.log('have an object fieldName, well its not really a simple field name it seems, could be an attached object\'s field.');

				// the key in the index is the value?
				//  is that what an index is in terms of key and value?

				// need a way of iterating through the attached fields?
				//  or deal with one level of attachment at this time?

                // 17/06/2014 - I'm needing this, and noticing that it's somewhat already been done.



				if (field_definition.attached) {
					// it will only be one attached item.
					var attachedObjName;
					var attachedObjFieldName;
					var c = 0;
					each(field_definition.attached, function(i, v) {
						attachedObjName = i;
						attachedObjFieldName = v;
						c++;
					})
					//console.log('c ' + c);
					if (c != 1) {
						throw 'unexpected number of items in attached definition';
					} else {
						var attachedObj = obj[attachedObjName];
						//console.log('attachedObj ' + stringify(attachedObj));
						var res = attachedObj.get(attachedObjFieldName);
						arr_res.push(res);
					}
				}


				//throw 'stop';

			}
			// object...


			// var field_val = obj[field_name];
		})

        var res = arr_res.join(index_key_separator);
        //console.log('get_obj_fields_key res', res);
		return res;
	}

	// Function to get the first or nth?

	
	
	var Sorted_Collection_Index = Collection_Index.extend({
		'init': function(spec) {
			this._super(spec);
			
			//this.fields = spec.fields;
			
			// the fields, sorted by name alphabetically
			//   could be done by Collection_Index
			this.index_type = 'sorted';
			
			// have something about its implementation?
			// could get that from the Sorted_KVS.
			//  Maybe as a function that applies to the type... getting more info about what underlying data structure it is using and the
			//   efficiency of various operations (high efficiency for sorted indexes)
			
			//this.unique_mode = true;
			
			// Can use the Sorted KVS. The fact it's using a tree is not very relevant here.
			
			this.sorted_kvs = new Sorted_KVS(12);
			
		},
		'each': function(callback) {
			return this.sorted_kvs.each(callback);
		},
		
		// this is not a constraint.
		
		/*
		'can_add_object': function(obj) {
			var fields_key = get_obj_fields_key(obj, this.fields);
			
			var count_with_fields_key = this.sorted_kvs.key_count(fields_key);
			
			// The collection index won't be operating unique mode.
			//  It will be a collection constraint, that makes reference to the index.
			
			// Have done a really large amount on this codebase.
			//  Need to do a fair bit more...
			//  Need to have it fully operating with constraints.
			
			// Then something relatively simple, set up with constraints and maybe some data, could be used to create the populated database
			
			// Quite a bit more to do on the general/back-end code.
			//  Then it won't be so hard to populate a few nice components with some text & images.
			
			
			
			
			
			//if (count_with_fields_key > 0) {
			//	if (this.unique_mode) return false;
				
			//}
			return true;
		},
		*/
		
		'unsafe_add_object': function(obj) {
			
			// if the object is just a string?
			//  object needs to be in a data_object though.
			//  that Data_Object can have a set type.
			//console.log('Sorted_Collection_Index unsafe_add_object');
			//console.log('Sorted_Collection_Index uao obj ' + stringify(obj));
			
			// but do we have the object's position/numerical index within the collection?
			
			// The fields key...
			//  The field's key?

			//console.log('this.fields ' + stringify(this.fields));


			// what is this function?
			//  gets a string
			//  gets the key for the object's values within this index's fields?

			// so that fields key would need to produce a string that allows the fields in the object
			//  to be indexed



			var fields_key = get_obj_fields_key(obj, this.fields);



			//console.log('this.fields ' + stringify(this.fields));
			//console.log('fields_key ' + stringify(fields_key));

			// so, we add it to the index.


			//throw ('5) stop');
			this.sorted_kvs.put(fields_key, obj);
			// so far, so good.

		},
		
		// get for one object?
		//  or find? Want flexibility where possible, so may provide arrays.
		
		'get': fp(function(a, sig) {
			//console.log('Sorted_Collection_Index get');
			// will be providing a key, or part of a key
			//  uses the prefix search.
			//console.log('sig ' + sig);
			
			if (sig == '[s]') {
				var search_term = a[0];
				//console.log('search_term ' + search_term);
				var kvps = this.sorted_kvs.get(search_term);
				//console.log('kvps ' + stringify(kvps));
				return kvps;
			}
			
			if (tof(a[0]) == 'array') {
				//throw ('stopping for array');
				var search_term = a[0].join(',');
				//console.log('search_term ' + search_term);
				//var keys = this.sorted_kvs.keys();
				//console.log('keys ' + stringify(keys));
				var kvps = this.sorted_kvs.get(search_term);
				//console.log('kvps ' + stringify(kvps));
				// should return keys and values
				return kvps;
			}
			
		}),
		'has': fp(function(a, sig) {
			if (sig == '[s]') {
				return (this.sorted_kvs.key_count() > 0);
			}
		}),
		'remove': function(obj) {
			// depends on what type of object the collection is holding too.
			//  When initialized as Collection(String).
			//   Has a collection data type constraint.
			//   The collection will still have items indexed.
			
			// So when a string item is added, it needs to get indexed. I'll trace that.
			
			var fields_key;
			if (tof(obj) == 'string') {
				fields_key = obj;
			} else {
				fields_key = get_obj_fields_key(obj, this.fields);
			}
			this.sorted_kvs.out(fields_key);
		}
		
		// when getting... do we have the fields?
	});
	
	// Map rather than dict?
	var Dict_Collection_Index = Collection_Index.extend({
		'init': function(spec) {
			this._super(spec);
			// which field(s) get indexed?
			//this.fields = spec.fields;
			this.index_type = 'dict';
			// also could do more than one field at once.
			// however, this one is no good for doing a search where the first
			// field in the multi-field index is specified but no others
			this.dict = {};
			// this should assume items are unique for the moment.
			// perhaps the Dict_Collection_Index could operate in unique_mode =
			// false as well.
			this.unique_mode = true;
		},

		'can_add_object' : function(obj) {
			// true / false?
			// won't have the error message.
			// perhaps another function could reveal the problem if asked.
			// this would be used for detecting if an object will be OK in a
			// number of different indexes before adding it to the collection.
			var fields_key = get_obj_fields_key(obj, this.fields);
			// is there already an object there? Different object?
			// same object?

			// Want to raise the right exception.
			var existing_obj = this.dict[fields_key];
			//console.log('existing_obj ' + existing_obj);
			if (is_defined(existing_obj)) {
				if (this.unique_mode === true) {

					// if (is_defined(existing_obj.__id) &&
					// is_defined(obj.__id)) {
					// if (existing_obj.__id === obj.__id) {
					// throw 'The same item (identified by ID) is already in the
					// collection, unique fields clash';
					//		
					// } else {
					// throw 'Unique fields clash';
					// }
					// }
					return false;
				}
			}
			return true;
		},

		'unsafe_add_object' : (function(obj) {

            //console.log('Dict_Collection_Index unsafe_add_object');
			//console.log('DICT unsafe_add_object');
			// it's currently unsafe to stringify some objects.
			//console.log('unsafe_add_object ' + stringify(obj));
			// should have a can_add_object function too,
			// possibly an unsafe_add function that does not do checking.
			// If something can't be added to one index, we don't want it added
			// to any of them.
			var fields_key = get_obj_fields_key(obj, this.fields);
			// won't be (directly) adding array objects to the collection.
			// will be adding collections to collections though.
			// console.log('tof(obj) ' + tof(obj));
			// console.log('Dict_Collection_Index add_object');
			// is this index doing multiple fields?
			// console.log('fields ' + stringify(this.fields));
			// for one field, no separator.
			this.dict[fields_key] = obj;
			// get the fields key from the field values.
			// this.dict[fields_key]

		}),
		'get': fp(function(a, sig) {
			// [s]
			// just one value, searching the index based on that value.
			
			// This one won't have the layer / wrapper for multiple values stored at one key (yet).
			
			// That would be a decent way of doing an index.
			//  The B+ tree would insert the multiple identical keys anyway.
			if (a.l == 1 && tof(a[0]) == 'string') {
				return this.dict[a[0]];
			}
			// array of values - will need to group them together and search the
			// index.
		})

	// some kind of search or retrieval function.
	// 'get' I think for this index.

	})

	// A whole system for collection indexes.
	// Maybe it should be in the collection class?
	// But maybe not if it encapsulates a fair bit of functionality and has a
	// simple enough API.

	// May make sense to keep the indexing system in one place.

	// Ensure there are various indexes...

	// May have both b+ and dict index at once?
	// Combined index? Like the KSVS?
	// Want the indexes to be fast and easy to set up primarily
	// Make it easy to use a b+ tree alongside a dict in indexing.

	// The the specific indexes...

	// Will add objects to them, and be able to do searches / get by key.

	// Want an index that is both b+ and dict.
	// Dict is used for the object retrieval from key
	// The b+ tree is used to ensure the correct order.

	// Collection always has items in an array...?
	// That array implementation could possibly change.
	// However, I think it will be OK for the moment.

	// Add and remove different types of index.
	// Possibly say what sort of index is needed...
	// Then the indexes could have different internal implementations
	//  

	// We may want to expand this in various ways.

	// Has a collection of indexes?
	// With them indexed?
	// In this situation, I think we need to do the indexing within the index
	// system on a lower level... a bit more code.
	// This indexing system will be used in a fair few places.
	// May wish to build on this (maybe separate module)
	// with a disconnected / async index system.
	// can make use of asyncronous data structures. These could be across a
	// network.

	// Collections will have different kinds of constraints to Data_Objects
	//  Though a collection constraint could be that field constraints are required.
	//  Data models defined using this system will then be more easily translated to DB and RDM formats.
	//   Could use these constraints here in JavaScript for checking before putting into an object database
	//   Can also use them in generating the SQL database and its CRUD functions.
	//    Likely to want to continue working on the parser. Being able to parse a variety of languages would prove very useful.
	//     It would also help for them to be integrated with the data model and JavaScript system I am using here.
	//     Being able to graphically illustrate what could go at any point in a document would be very useful...
	//      it would know what the objects are, and help / helpful windows could display information ready to be clicked on or tapped in order
	//      to add that text of function call. Would be nice to have an iPad next to the keyboard to tap things and view info interactively.
	//      Could easily be connected to an address over the LAN, I do think a Local_MB_Node system running in node.js could enhance people's
	//       experience as they use the website. 
	
	// For the moment, the single client is what matters.
	
	// As well as the index system, are the collection_constraints
	// These are different to field_constraints.
	// One collection_constrint will be applying field_constraints
	
	
	// When a collection is given a field constraint, it's a constraint that applies to the fields of all objects in the collection.
	
	// Not a Data_Object?
	//  It would probably be safe to make this a Data_Object.
	//  Making this Index_System use some lower level mechanisms for indexing. The index is not available here, this is used to implement indexing.
	
	// This kind of is the index index. Not so sure about a more complex index index inside this.
	//  Can put a few of the operations in functions to encapsulate index search.
	
	// Maybe don't create the index system if there is nothing to do.

	var Collection_Index_System = Class.extend({
		
		// I am now going to extend this so that it also can use B+ trees.
		//  B+ trees may be advantageous to use in many cases over dicts, but will likely be slower and use more memory, though will
		//  also provide prefix search and ordering functionality in addition to the dict index.
		
		
		'init' : function(spec) {

			// This could keep track of the primary_unique_index for get
			// operations.

			this.collection = spec.collection;

			// This should do a fair few things...
			// A new index can be added

			// New index created? Makes the index go and collect the
			// data by iterating through the array.

			// Will this System class make the CollectionIndexes all
			// work together smoothly in the Collection code?

			// The system will need to keep track of the indexes, kind
			// of provide an index to them.

			// Will this be tasked with carrying out the queries?
			// We have the indexes, we so we have access to the results.

			// The query planner or executer could go in this part.
			// Just need to make it so that collections do get indexed
			// OK, some separation of concerns may help.

			// This could really be in the Collection.

			// Could hook this up to listen for any item being added (or
			// removed) from the collection?
			// Or just have the collection notify it - not sure right
			// now.

			// This could expose an easier API.
			// Could also have a function that gets the index based on
			// which fields, and which index type.

			// Then with everything indexed within this system, it may
			// not be too hard to have this system carry out the
			// searches.

			// However, the searches could get a bit more complex...
			// searching non-indexed data.
			// Or sort, various functions.

			// Perhaps it will just be in the collection...
			// Or there could be an Index_System_Searcher object.
			// That would help encapsulate the functionality, have the
			// code express what it is doing at the same time.
			// So when a search query is given, it is the searcher that
			// queries the index system, finds out what indexes to use,
			// gets those indexes, then prepares the result.
			// It will know what final stages may be necessary to carry
			// out the query specified.

			// this.indexes = [];
			// just stored in an array?

			// or have them in some kind of object matrix?

			// a collection of indexes and then an index of them?

			// a reference to the primary index - the one that is used
			// when processing 'get' requests.

			// index types? dict, ordered_string, full_text?
			// 3 index types with defined capabilities...
			// could put in a full text index, with the full text index
			// API clearly defined.
			// then it would be a job to write some compressed dynamic
			// suffix tree JavaScript code.
			// that data structure would be interesting when run in a
			// distributed fashion, could have it as though very large
			// blocks of memory are available.

			// indexes by field...
			// indexes with multiple fields.

			// field object
			// single index
			// object containing indexes with nested indexes

			// index_map['last_name'].index_map['first_name'].indexes_by_type['dict']
			// one way of being able to get the indexes for a particular
			// field, of a particular type.
			// Think this is an OK way to store a map of the various
			// indexes that are used.
			// What about getting all indexes? Should we store them in
			// an array?
			// Not so sure for the moment, could iterate over these
			// indexes, and add and remove them without too much trouble
			// in this format.

			// get_indexes_by_type_by_fields(arr_field_names)
			// then those indexes are referred to by the type of index
			// (not the data structure used).
			// Though 'dict' works as a hash under the JS dict.

			// may be a little verbose specifying some indexes.
			// however, want a very functional index of indexes.
			// with the possibility of different types of indexes being
			// used.
			// being able to run relatively simple dict indexes on
			// collections for 'get' operations seems like a good plan.
			// have that within a flexible system that allows different
			// index types.

			// has a dict index (lookup / unique key) (could be set to
			// allow multiple items, so that all items at key get
			// returned)
			// or ordered_string? (allows multiple items more easily)
			// or full_text?

			// could get different implementations of these various
			// indexes.
			// for full text, could make a relatively simple tree index.
			// and could also experiment with some optimized full text
			// indexes. The unit testing would be useful for making
			// these indexes, and having a simple one could work
			// very well for testing and comparison.

			// Could have a data structures project where different ones
			// could be made.
			// Not so sure that the client in a web app would need this?
			// Searching would probably be done on the server.
			// However, these data structures could lead to server
			// implementations.

			// index_map['last_name'].indexes['dict']
			// and keeping track of the primary unique index.
			
			// There could be one index that is considered the primary_unique_index.
			//  Maybe determine the primary unique field?
			
			
			
			this.index_map = {};
			//  the indexes stored in the index map.
			//  may require searching at times.
			
			
		},

		// respond to events in the DataObjects / values stored within the collection.
		//  the normal system of propagating events up to the parents / ancestors?
		//  

		'notify_insertion': function(pos) {
			// need to code this.
			//  don't think its relevant for controls, which is what I'm working on right now.

			//console.log('TODO collection-index notify_insertion');
			return false;
		},
		
		
		'clear' : function() {
			this.index_map = {};
		},

		// re-index a whole collection / array...

		// add index by type by fields.

		// and set it as the primary index?
		// want to do that for quick retrieval with get operations.

		// Or set things as being a primary / unique field that will
		// work with get operations.
		// The indexing system is a little complex, but it won't take up
		// too much code when it's in place in the build.
		// Just a few hundred bytes I think.

		// Supporting get operations will make the Collection quite
		// useful.
		// Want it so that collections easily fit into place in code in
		// various situations.
		// Will often be defining which fields in an object are unique
		// Corresponding to unique columns / column constraints in a
		// database.

		// Want to make a nice IDE website, and use that to develop
		// version 2.
		// Saving database resources...
		// Likely to be storing classes and functions within the
		// database. Will be able to build them into modules.

		// Is a complicated way of going about things to have something
		// indexed with a dict...
		// But will save on code used in various objects. Some
		// complexity to be handled by the collection.
		// Will remove clutter from code that should be doing something
		// else apart from indexing a field.

		// Will get some examples with data working, then will get some
		// abstract postgres objects holding their objects using
		// Collection.
		// The Abstract Postgres code will be very clear, and easy
		// access to the objects will be provided.

		// Possibly will index a function matrix using multiple fields
		// in an index?
		// Will take time and effort to improve the collection, but then
		// it will be usable to store more things.
		// Ordering will not matter in many situations.
		// Will be able to sort a collection too, probably to keep it
		// sorted too.

		// Different implementation for get_by_position possible rather
		// than using array?
		// Perhaps these normal collections won't be so good for dealing
		// with large amounts of data, with the array operations.
		// Could maybe make a collection that does not use an array for
		// internal storage.
		// Right now, keeping track of the position in the array is
		// important.
		// Could perhaps make a B+ tree where items know their position.

		// search implies possibly returning multiple records.
		// we should know there won't be multiple records when searching
		// using a unique field / unique field combination.

		// could have 'get'?
		// a way of testing if things are stored in a unique index
		// system?

		// a non-unique dict system where new dicts get created at each
		// level?

		// get_by.
		//  will get by an indexed property.
		
		// get is fairly simple... need to have the index doing searches too.
		
		// also want to search the index system for indexes that are for various fields, but in any order.
		//  These indexes can be used to implement uniqueness constraints even if the order of keys does not match.
		//  Having this deal with some more complicated indexing patterns should make for a very powerful collection component.
		
		
		
		'search_for_index_with_fields': fp(function(a, sig) {
			// will be consulting the alphabetical list of fields.
			//  also, index could be indexed with its alphabetical list of fields.
			
			// scope for optimization through improved index index
			//  alphabetically sorted KVS of alphabetically sorted index fields.
			//  This is the kind of thing that will make this a good system!

			// Perhaps need different naming for attached fields?
			//  Need to be able to tell them apart from a list of fields.

			// an attached field:
			// ['attached', 'meta', 'name']
			//  could get confused with an array of three string field names.

			// '/.meta.name'
			//  /. could be convenient syntax for this, so we indicate that a field has been added that is
			//   an attached field.

			
			console.log('search_for_index_with_fields ' + sig);
			//console.log('a ' + stringify(a));
			
			if (sig == '[s]') {
				return this.search_for_index_with_fields([a[0]]);
			}
			if (sig == '[a]') {
				
				// check the index in alphabetical order - any index with the right fields will do.
				
				//  may have option to continue search for the index with them matching in the right order.
				
				// could check for that one first.

				// OK, but to identify this is one field?
				//  Perhaps the whole field name as a string is better?

				
				//console.log('a[0] ' + stringify(a[0]));
				
				//var sorted_
				var idx = this.get_index_starting(a[0]);
				//console.log('idx', idx);
				return idx;
				
			}
			// how about looking through the indexes in this function?

			if (sig == '[o]') {
				var res;
				var matching_count = 0;

				this.iterate_indexes(function(index, stop) {
				
					
					
					console.log('iterate_indexes index ' + index);
					//console.log('iterate_indexes index.fields ' + stringify(index.fields));
					//console.log('iterate_indexes index.fields ' + stringify(index.fields));
					//console.log('fields ' + stringify(fields));
					// compare the two arrays
					
					var i_fields = index.fields;
					if (tof(i_fields) == 'string') i_fields = [i_fields];
					
					//console.log('a[0] ' + stringify(a[0]));
					//console.log('i_fields ' + stringify(i_fields));

					var ae = are_equal([a[0]], i_fields);
					

					if (ae) {
						//matching_indexes.push(index);
						res = index;
						matching_count ++;
						//console.log('res ' + res);
						//return res;
					}
					
					//console.log('ae ' + ae);
					
					
					
					//throw ('iterate_indexes stop');
				});
				if (matching_count > 1) {
					throw 'unexpected matching_count > 1';
				} else {
					if (matching_count == 1) {
						return res;

					}
				}

			}
			
			
			
			
		}),
		
		
		// calling this find now.
		//  shorter, more positive sounding.
		'find': fp(function(a, sig) {
			
			// we can't really do search at the moment.
			//  21/06/2012, now we can. Good B+ implementation now in there.
			//  it looks like we can now... but maybe it's using 'get'.
			
			// however, do want full-text search.
			
			// will be doing searches with = or prefixes ok.
			
			//  (not all that well)
			// at a later stage we will have full-text search on indexes
			//  will search a lower case version of the text.
			
			// I think a trie will suffice for this functionality.
			//  Will do more experiments on this.
			//  May have an index of words and word occurrances within a collection.
			//   That would be a decent indexing system.
			//   Could also go for the full text index that could be more powerful and flexible.
			//   May want to be careful about setting word boundary search rules.
			
			// that could be done using a trie, prexix tree, suffix tree, suffix array, compressed dynamic suffix array, or other data structure.
			
			
			// can search one field for a name / value pair.
			//console.log('Collection_Index_System search sig: ' + sig);
			// searching multiple fields - multiple name value pairs.

			// nvp: [s,?]

			// do we have any indexes that cover all fields?
			// could do merging based on the results of more than one
			// index.

			// devising the search strategy becomes a bit more complex
			// when dealing with more than one index, being asked to
			// search by more than one field.

			// the indexing system does not hold all data anyway.
			// it won't be able to do all searches.

			// perhaps it should be queried to see what fields it does
			// index by before doing a search.
			// after doing a search with an index, may need to then
			// search through other fields without using the index.

			// searching by things in the order of the indexes
			// searching in other order, would be nice if it can consult
			// the right index.
			
			// var found = coll_presidents.find([['name', 'Franklin Pierce'], ['party', 'Republican']]);
			
			console.log('Collection_Index_System find sig ' + sig);
			//console.log('a.l ' + a.l);

			if (sig == '[o]') {
				var objQuery = a[0];
				//console.log('objQuery ' + stringify(objQuery));

				//console.log('this.index_map ' + stringify(this.index_map));
				// so maybe if there is no index map we return false.
				//  not sure about indexed sub-items.

				//  may leave that for the moment.
				//   I'm sure it will be useful though.
				//    Perhaps they could be found through indexes in their own collections, so it's not down
				//     to the indexing system to find them apart from point them to the right item where it can.

				// Object query
				// ------------

				// Are we looking for a field that is indexed?
				//  Are we specifying multiple fields?

				// Dealing with searching for a single item with a query seems like a good case to handle.
				//  Other logic can deal with other cases.

				// indexes

				var indexes = this.indexes();

				// can't stringify the indexes.



				//console.log('t indexes ' + tof(indexes));
				//console.log('indexes.length ' + indexes.length);

				// then for each index, we see which fields it is...
				var map_single_field_indexes_by_field = {};
				each(indexes, function(i, v) {
					if (v.fields.length == 1) {
						//console.log('tof v.fields[0] ' + tof(v.fields[0]));

						var field = v.fields[0];
						var tField = tof(field);

						if (tField == 'string') {
							map_single_field_indexes_by_field[field] = v;
						}

						
					}
					//console.log('v.fields ' + stringify(v.fields));
				});

				// OK, so we see what it's indexed by.
				//  We also need to use the index to find the items by the object key.

				// {key: value}

				// Will need to look through the properties of the object given to this.
				var c = 0;
				var keys = [];

				each(objQuery, function(key, value) {
					//console.log('key ' + key);
					//console.log('value ' + value);
					c++;
					keys.push(key);
				});
				//console.log('c ' + c);

				if (keys.length == 1) {
					var index = map_single_field_indexes_by_field[keys[0]];

					if (index) {
						var res = index.get(objQuery[keys[0]]);
						//console.log('res ' + stringify(res));
						return res;
					} else {
						//throw 'no index found';

						return false;
					}

					
				}
				// we see which 


				// Want to search any indexes that match. May need to look through different sets if we are searching
				//  for more than one thing?




				throw 'stop';


				//console.log('Collection_Index_System search does not handle object query.');
				//  not yet? that will be a field name type thing, can look for fields on an attached
				//   object.
				//throw 'stop';
				return false;
			}



			if (sig == '[a]') {
				
				// .find('Donald Tsang < name < Jamie Oliver')
				// .find('Jamie Oliver > name > Donald Tsang') // in reverse order - it could notice that a > b and do the DESC query.
				
				//.find()
				
				// We could do a bit of interpretation on what is being looked for.
				//  There could be a search expression here.
				//  At the moment the search expression is just the field value, without the field name
				
				// '[indexed_field_value] = Jamie Oliver'
				// '= Jamie Oliver'
				// 'Jamie Oliver'
				
				// Index parsing for the queries should be useful.
				//  Also want things able to be done not in strings...
				//   Don't want to fall into the 'SQL Trap' of creating a string representation dynamically only to have to parse it again.
				
				// .find(['Donald Tsang', '<', 'name', '<', 'Jamie Oliver'])
				
				// the default will be <=
				// .find(['Donald Tsang', '<=', 'name', '<=', 'Jamie Oliver'])
				//                           ==
				// .find(['Donald Tsang', 'name', 'Jamie Oliver'])
				
				// .find({
				//    'name': ['Donald Tsang', 'Jamie Oliver'] // not saying inclusive or exclusive, could be inclusive by default
				//    'name': [['Donald Tsang', false], ['Jamie Oliver', false]] // exclusive
				//     exclusive(str) -> [str, false]
				//  Will need to do more specifying and testing for non-string values in indexes.
				//   Getting numerical indexes right with the comparison function would be nice.
				//    stores the number as a string... but stores it in numerical order.
				//     Would probably be best to parse it to a number for the comparison.
				//      Could try with numeric keys directly - they could work with comparisons.
				// })
				
				//  slightly odd syntax, but it makes sense.
				//   having the 'name' field in the middle... does make sense.
				//  expresses the operands - as if it has been parsed, the next stage.
				// searching for this one value.
				// not all indexes... need to have a default index.
				// primary index?
				//  may be spacifying the name of the field in many cases.
				//  this will be most useful when only one index is set up.
				//console.log('Index System find a[0] ' + stringify(a[0]));
				// primary index?
				//  may be the case when there is only one index.
				//  may specify primary indexes at other times.
				
				var indexes = [];
				
				this.iterate_indexes(function(finding_index) {
					//console.log('finding_index ' + finding_index);
					indexes.push(finding_index);
				});
				//throw('stop');
				//console.log('indexes.length ' + indexes.length);
				//console.log('this.index_map ' + stringify(this.index_map));
				
				// So, asking each index for the answer?
				
				//console.log('indexes.length ' + indexes.length);
				//console.log('a[0] ' + stringify(a[0]));
				
				var search_fields = [];
				var search_values = [];
				
				
				
				each(a[0], function(i, v) {
					//console.log('v ' + stringify(v));
					
				
					search_fields.push(v[0]);
					search_values.push(v[1]);
				});
				
				//console.log('search_fields ' + stringify(search_fields));
				
				/*
				
				if (indexes.length > 0) {
					
					// search for the right index.
					
					
					
					// consult the first index.
					
					var res = indexes[0].get(a[0]);
					
					//if (res.length == 1) {
					//	return res;
					//}
					//console.log('item ' + stringify(item));
					
					return res;
					
				}
				*/
				var equal_indices = [];
				//console.log('indexes ' + stringify(indexes));
				
				each(indexes, function(i, idx) {
					var idx_fields = idx.fields;
					//console.log('idx_fields ' + stringify(idx_fields));
					
					if (idx_fields.length >= search_fields.length) {
						// get the first part of the idx_fields
						
						// if it is an array...
						var idx_fields_to_check;
						if (tof(idx_fields) == 'array') {
							idx_fields_to_check = idx_fields.slice(0, search_fields.length);
						} else {
							idx_fields_to_check = [idx_fields];
						}
						
						
						
						
						//console.log('idx_fields_to_check ' + stringify(idx_fields_to_check));
						
						if (are_equal(idx_fields_to_check, search_fields)) {
							//console.log('they are equal');
							
							equal_indices.push(idx);
							
						}
						
					}
					
					//if (is_equal(idx_fields, search_fields))
					
					
				});
				
				//console.log('equal_indices.length ' + equal_indices.length);
				//return equal_indices[0];
				
				if (equal_indices.length > 0) {
					// use that index
					
					// will give that index two values to look for, in an array
					
					// will also do some testing with non-string values, and indexing them at some point.
					//  may do some lower level work in the B+ tree to get this right.
					
					var idx = equal_indices[0];
					//console.log('idx ' + stringify(idx));
					
					var res_indices_get = equal_indices[0].get(search_values);
					
					//console.log('res_indices_get ' + stringify(res_indices_get));
					
					return res_indices_get;
					
					
					
				}
				
				
			}
			
			/*
			if (sig == '[s]') {
				// it's searching for an index with a single field. Easy if there is just one of them found.
				
				// then split that string, it could be separated by commas.
				//  what about split with ', '?
				//  could have a new split function that maybe uses regexes to split like that?
				//  split, removing whitespace after commas.
				//  would go in util / essentials.
				
				var field_str = a[0];
				
				if (field_str.indexOf(',') > -1) {
					throw ('Multiple fields search through a string not yet implemented.');
				}
				var res = [];
				
				this.iterate_indexes(function(index) {
					if (index.fields.length == 1) {
						//res.push()
						if (index.fields[0] == field_str) {
							res.push(index);
						}
					}
				})
				if (res.length <= 1) return res[0];
				return res;
			}
			*/
			if (sig == '[o,s]') {
				// an object which represents the field.
				//  May need to read / understand that object.
				//   however, it could have been put into the index as a JSON field.
				//    so it will get recorded in the index under that string name.
				var fieldDef = a[0];
				//var strField = stringify(fieldDef);
				//console.log('strField ' + strField);

				// will search through and retrieve from the index (system)

				// can put in the object to the search.
				//  will it get stringified later?
				//   this needs to be used as a key for a string field though.
				console.log('fieldDef', fieldDef);

				var index = this.search_for_index_with_fields(fieldDef);



				//var index = this.search_for_index_with_fields(strField);
				//  may consult different indexes / look for them in a specific order when doing a lookup operation.
				console.log('index ' + stringify(index));
				if (index) {
					//console.log('a[1] ' + stringify(a[1]));
					var res = index.get(a[1]);
				}
				//console.log('res ' + stringify(res));
				return res;
				//throw 'stop';


			}


			// That looks like multiple fields specified.
			if (a.l == 2 && tof(a[0]) == 'array') {
				//console.log('sig ' + sig);
				//console.log('4) a ' + stringify(a));
				//var index = this.search_for_index_with_fields(stringify(a[0]));
					
				// put them in an array to indicate they are one field?

				var index = this.search_for_index_with_fields([a[0]]);

				//  may consult different indexes / look for them in a specific order when doing a lookup operation.
				//console.log('index ' + stringify(index));
				if (index) {
					//console.log('a[1] ' + stringify(a[1]));
					var res = index.get(a[1]);
				}
				//console.log('res ' + stringify(res));
				return res;
			}

			if (a.l == 2 && tof(a[0]) == 'string') {
				// it's a single name-value pair.
				// is it?
				
				//console.log('sig ' + sig);
				//console.log('a ' + stringify(a));
				
				
				// search for the single index.
				// just use a dict index for the moment.
				// searching a dict is a 'get' operation.
				// maybe we need to search a full text index only?
				// the b+ index can do the prefix search, which is a
				// start.
				// more general searches, such as with a regex? becomes
				// more complex.

				
				//console.log('this.index_map ' + stringify(this.index_map));
				
				//var index = this.index_map[a[0]]['indexes_by_type']['dict'];
				
				// use a get_index function for this.
				var index = this.search_for_index_with_fields(a[0]);
				
				
				//  may consult different indexes / look for them in a specific order when doing a lookup operation.
				//console.log('index ' + index);
				//console.log('index ' + stringify(index));

				// then we search the index?
				// what API to lookup the value with the key?

				// return a search of the index.
				// a dict index... should maybe have 'get' rather than
				// search.
				//console.log('a[1] ' + a[1]);
				
				if (index) {
					var res = index.get(a[1]);
					//console.log('res ' + stringify(res));
					//console.log('a[1] ' + a[1]);
					//console.log('sig ' + sig);
				}
				
				//console.log('res ' + stringify(res));
				return res;
			}
		}),

		// This is going to be replaced with the system of constraints.
		//  There is the index
		//  Then there is the unique constraint
		//  Then it is the primary key, or similar to it, will be a field/column or a combination of them that gets used extensively in the
		//   database.
		
		// This will need to be tested fairly thoroughly, then it will be documented on the website.
		//  I think the website will have quite a lot of documentation, and I'll be able to modify it using a CMS.
		
		// Some documentation will be generated from the code.
		//  Will be able to edit API reference documents, they'll be viewable using a nice interface.
		// I think that could help take-up of this library quite considerably.
		//  That will be quite a big project.
		//  I think quite a lot of material about this, and JavaScript programming will go on my site.
		//  It would be good to have an active discussion forum as well.
		// The demos area, consultancy area, Web development work - getting back to people with a quote.
		//  It may be possible to put together good sites, quickly, for not all that much.
		// Could be recruiting contractors on that site. Would be a good interface with the programming community.
		//  Could possibly have a chat service, but answering people's questions quickly, or directing them to the forum, may be a useful thing to do.
		
		// I think this system would be a very solid technological basis for the site.
		//  Would be paticularly good for having other processes running that keep up-to-date backups.
		//  Also interested in connecting the web server with other MetaBench nodes that happen to be on and running.
		
		
		// There is no such thing as the primary unique index.
		//  There is the 'constraints' system.
		
		/*
		
		'primary_unique_index': fp(function(a, sig) {
			// just a string - the field name
			// dicts serve uniqueness checking well, though other data structures can do that too.
			
			//console.log('primary_unique_index sig ' + sig);
			
			if (sig == '[s]') {
				// ensuring there is that unique index, with that field
				// as the key.
				var field_name = a[0];
				// get the index for that field.
				// not sure it will already exist.

				// however, may want to first look to see if there are
				// any indexes for that field.
				// ensuring the dict index is the right way of doing
				// things for the moment.
				// will later do more development of the indexing system
				// so that other types of index can be used as a unique
				// index.
				// and so that the dict index can be used as a
				// non-unique index.
				//this._primary_unique_index = 
				this.ensure_index(field_name, 'dict');
			}
			if (sig = '[]') {
				//console.log('this._primary_unique_index ' + this._primary_unique_index);
				return this._primary_unique_index;
			}

		}),
		*/
		
		
		'get_index_starting': function(fields) {
			// will be starting with just one field?...
			//  get indexes starting...
			
			//console.log('get_index_starting ' + stringify(fields));
			
			if (tof(fields) == 'string') {
				fields = [fields];
			}
			//console.log('get_index_starting fields ' + stringify(fields));
			// go through all indexes, looking for the index which has got the right match.
			//  what about consulting an index of indexes?
			//  this could be done later, really won't be many indexes to search through.
			
			// look at the index map... get the fields as a string which will get used in the index lookup?
			//  want to be looking at all indexes at the moment.
			
			
			// want the stop function in iterate_indexes
			
			var matching_indexes = [];
			
			this.iterate_indexes(function(index, stop) {
				
				
				
				//console.log('iterate_indexes index ' + index);
				//console.log('iterate_indexes index.fields ' + stringify(index.fields));
				//console.log('fields ' + stringify(fields));
				// compare the two arrays
				
				var i_fields = index.fields;
				if (tof(i_fields) == 'string') i_fields = [i_fields];
				
				var ae = are_equal(fields, i_fields);
				
				if (ae) {
					matching_indexes.push(index);
				}
				
				//console.log('ae ' + ae);
				
				
				
				//throw ('iterate_indexes stop');
			});
			
			//console.log('matching_indexes.length ' + matching_indexes.length);
			
			if (matching_indexes.length > 1) {
				throw 'get_index_starting, more than 1 matching index found. Needs implementation';
				// May return the best match
				//  The best match could be found through an index.
				
				
			} else {
				return matching_indexes[0];
			}
			
			
		},
		
		
		'ensure_index': fp(function(a, sig) {
			// index may be given as the field(s)
			// single string field, or an array of fields.

			// index type as well...
			// we could have a default index type.

			// could try some benchmarks later on, judge difference
			// between b+ index and the dict index for retriveing
			// values.
			// dict will probably be much faster in JS because it uses
			// native code behind it, probably with a good string
			// hashing algorithm.

			// fields, index_type
			// field, index_type

			// and ensuring a unique index too?
			// perhaps the 'dict' index is unique.
			// could choose to operate the indexes on 'unique mode' or
			// not.

			// Want it easier to create a new index with the code.
			//  May have unsafe_add_index, or just be clearer about what code is used.
			
			// may ensure a single index.
			
			// may be given an array of strings.
			//   if so, it is a single index.
			
			
			console.log('Collection_Index_System ensure_index sig ' + sig);
			
			if (a.l == 1 && is_arr_of_strs(a[0])) {
				// not specifying the type of index here.
				//  it is assumed to be the sorted (B+) index.
				
				
				// want to see if there is an existing index.
				
				/// hmmmm not sure... 
				
				var new_index_spec = a[0];
				//console.log('new_index_spec ' + stringify(new_index_spec));
				
				//throw('stop');
				// then create the actual (sorted) index.
				
				// will manually put this into the index map.
				//  may keep the index map, it's detailed, but also have a field_index_index where it points to the relevant index.
				//  may make other more direct objects in the index_system to refer to indexes.
				
				var sci = new Sorted_Collection_Index({
					'fields': new_index_spec
				});
				// then populate the index.
				
				// can add_object with an array to the index.
				sci.add_object(this.collection._arr);
				
				// then add the index into the index_system.
				
				// perhaps the map could be done in a heirachy like in nested?
				//  will have some code that is a bit complex and single-purpose here.
				//   it will be supporting the collection and index system.
				
				// May create light collection and data_object components. May have been better earlier, but then would have made things more complex too, this has been
				//  OK for developing.
				
				
				
				// not so sure about having the single field name?
				//  but they could be indexed here by their string fields key
				
				// this.index_map[field_name]['indexes_by_type'][index_type] = idx;
				
				//  could have the field names in sequence in the index - a little like the nested system.
				//  that would allow searching the index when looking sequentially for an index for fields.
				
				// though the sorted KVS with prefix search could actually help retrieve the index here.
				//  That would possibly be a useful data structure
				
				
				// The index map is already pretty unwieldy, perhaps it can be imprved.
				//  I think a specialized index index will be what is needed in a bit. At least there won't need to be so much specialized indexing code.
				//  Some kind of specialised code to power the indexing engine makes a lot of sense.
				
				// Will use the map and the fields_key for the moment.
				
				var fields_key = get_fields_key(new_index_spec);
				//console.log('2) fields_key ' + fields_key);
				
				this.index_map[fields_key] = this.index_map[fields_key] || {};
				this.index_map[fields_key]['indexes_by_type'] = this.index_map[fields_key]['indexes_by_type'] || {};
				this.index_map[fields_key]['indexes_by_type']['sorted'] = sci;
				
				return sci;
				
				//throw('4) stop');
				
			}
			
			// maybe change this interface.
			if (a.l == 2) {
				if (tof(a[1]) == 'string') {
					var index_type = a[1];
					if (tof(a[0]) == 'array') {
						var fields = a[0];
						
						return this.ensure_index[a[0]];
						
					}
					
					// what about when there are multiple fields to index.
					//  could try indexing president's party affiliations too.
					
					
					if (tof(a[0]) == 'string') {
						var field_name = a[0];

						// ensure a dict index...
						// think we will have to run through the types
						// sequentially here.

						// if (index_type == 'dict') {
						// see if there is a dict index already for that
						// field.

						// }

						// see if there is an existing index for that
						// field.

						var e_idx = this.get_index_by_type_by_fields([ field_name ], index_type);
						if (!is_defined(e_idx)) {
							// need to create the index.

							// should probably start it up with the
							// existing dataset.

							var idx = new Dict_Collection_Index({
								'fields' : [ field_name ]
							});
							// then want to load all the data in the
							// collection into the index.

							// Need to put the index in the index map.
							// Will do some ll_set or ll_ensure code to
							// make this shorter.
							this.index_map[field_name] = this.index_map[field_name] || {};
							this.index_map[field_name]['indexes_by_type'] = this.index_map[field_name]['indexes_by_type'] || {};
							this.index_map[field_name]['indexes_by_type'][index_type] = idx;
							
							// a dict of indexes, ordered by the field names of the index (comma separated), with an array of indexes that
							//  satisfy that combination of fields.
							// would be fast to search that array for particular fields - search all with that combination,
							//  then search for the fields in the particular order.
							
							// Sorted_KVS
							// .indexes_by_alphabetic_fields
							//  a prefix search on this could quickly get the required index
							// It would indeed be a fast way to get the index.
							//  Collection is getting quite big... it will be nice to get it back down to only a few KB.
							//  I wonder if the framework will wind up being quite hefty?
							//   Seems like a LOT of comments here. I think the collection itself, with the index system and data types etc, could be
							//   fairly small, a few K when wrapped up with other things.
							
							// I do want to provide an impressively small library, perhaps it will be around 30-40K?
							//  Once I have got a decent system, I can do refactoring and building.
							
							// I think an automated compilation / build process will be very useful.
							//  This one will put more things as local variables.
							//  Some object-oriented functions may be re-written as non-oo so that they work in the local scope, getting called from the local scope.
							//  Will also build up string names for strings that get used - can compress things a fair bit that way.
							//   With various compression means, it should be possible to get this down to a very small size.
							
							// The automatic linking (var removal) will prove useful when building this.
							//  Having this on the server, with an interface for producing builds will be useful.
							
							
							// a sorted KVS for storing the indexes by alphabetical fields...
							//  that would be nice for retrieving all of the indexes with a given alphabetical fields key.
							
							// Will take some more testing and checking to get the various things that are needed working.
							//  Am looking forward to creating the abstract rdb model, then translating that to an abstract Postgres model,
							//   then persisting that abstract Postgres model to a Postgres database.
							// All this middleware will make for some very convenient interfaces eventually.
							//  Having the data structure infrastructure to support them will help a lot.
							
							// as well as mapping it by type, and just one field name...
							//  need to have it indexing by the alphabetically sorted list of fields.
							// I think these things will take some more examples and testing, will test things with multiple indices as well.
							
							// Ordered indexes
							//  May be able to get them ordered by one of the sorted indexes.
							
							// Iterate through it, or get records, or get keys
							//  Will want to index the indexes with their fields stored alphabetically.
							//  this will matter when there are multiple fields in the indexes.
							
							
							
							
							

							// have made add_object into
							// unsafe_add_object that does not do
							// checking.
							// perhaps that unsafe method could be a
							// private function???

							// console.log('this.collection._arr ' )

							idx.add_object(this.collection._arr);

							// need to access the collection's array.
						}
					}
				}
			}
		}),



		// seems like the best way to index the indexes.
		// by field, then by index type.
		//  Would be good to have a clearer name / description of this function.

		'set_index_by_type_by_fields': function(index, arr_fields, index_type) {
			// In the Collection_Index_System

			//console.log('set_index_by_type_by_fields');
			// the fields for the index... possibly restricted to named fields, and do that check.
			//  make disabling some checks optional. Could also remove them at the build stage.
			
			// needs to go through the indexed fields
			// will create the dict maps saying which fields are getting
			// indexed.

			// Automatically indexing by automatically generated IDs?
			// That seems uncertain.

			// arr_fields ["attached", "meta", "name"] - that looks like one field.
			//  want a way of specifying a field is attached in some way.
			//  

			//console.log('index ' + stringify(index));
			//console.log('arr_fields ' + stringify(arr_fields));
			//console.log('index_type ' + stringify(index_type));

			
			// hmmm indexing by multiple fields.
			//  making a multi-level index map object.

			var c = 0, l = arr_fields.length;
			var i = this;
			//console.log('l ' + l);
			
			while (c < l) {
				var field = arr_fields[c];

				var tField = tof(field);
				//console.log('tField ' + tField);
				//throw 'stop';
				if (tField == 'string') {
					if (!i.index_map[field]) {
						i.index_map[field] = {};
					};
					i = i.index_map[field];
				} else {
					//console.log('tField ' + tField);
					// The field could be given as an array.

					// if it's an attached field...
					//  probably best to index it as an attached field.

					// object fields...
					//  need to be careful about adding these indexes for attached objects' fields.
					//  it needs to register so that when objects are added, the relevant indexes are
					//  notified, and know to check the attached object field.

					if (tField == 'object') {
						//console.log('is object');
						//console.log('field ' + stringify(field));

						// processing attached fields here?

						var fieldStr = stringify(field);
						if (!i.index_map[fieldStr]) {
							i.index_map[fieldStr] = {};
						};
						i = i.index_map[fieldStr];


						// Then would need something for when the object is added.

						//throw 'stop';

					}



					if (tField == 'array') {
						// record it in the index as a stringified array.
						//  that would be an attached field.
						//   attached(fieldName) would look neater, but not be JSON.

						var fieldStr = stringify(field);
						if (!i.index_map[fieldStr]) {
							i.index_map[fieldStr] = {};
						};
						i = i.index_map[fieldStr];




					}


					// Could set it by the name of the field even if it's attached?
					//  Or the attachment becomes part of the name?
					//  I think fields referring to attachments could make sense.
					//   Need to keep this consistant however.
					//console.log('field ' + stringify(field));

					// if the field is an array, such as ['attached', attachedObjName, attachedObjField]
					// an attached field.







					//throw '3) stop';
				}


				
				c++;
			}
			i['indexes_by_type'] = i['indexes_by_type'] || {};
			i['indexes_by_type'][index_type] = index;
		},
		
		// may just be called index() in the collection, but more in-depth name here.
		'set_index' : function(index) {
			this.set_index_by_type_by_fields(index, index.fields, index.index_type);
		},

		'get_index_by_type_by_fields': function(arr_fields, index_type) {
			// needs to go through the fields, moving through the
			// indexes.
			var c = 0, l = arr_fields.length;
			var i = this;
			while (c < l) {
				i = i.index_map[arr_fields[c]];

				c++;
			}
			// perhaps the index has not been defined.
			if (i) {
				var index = i['indexes_by_type'][index_type];
			}

			// could there be multiple indexes of the same index type?
			// possibly could make it hold indexes with different
			// engines / data structures... but I don't think that's
			// necessary.
			// but not sure the index exists...

			return index;

		},
		
		'indexes': fp(function(a, sig) {
			if (a.l == 0) {
				var res = [];
				this.iterate_indexes(function(index) {
					res.push(index);
				});
				return res;
			} else {
				throw 'Setting indexes not supported here (yet)';
			}
		}),

		// with 'stop' function in callback
		'iterate_indexes': function(index_callback) {

			//console.log('ii');
			
			// recursive function inside to do the iteration.
			//console.log('beginning index iteration. this.index_map: ' + stringify(this.index_map));
			// the index map needs to be updated when indexes are added.

			// will be used when adding an object to the indexes.
			// also when removing object from indexes.

			// stop in this code... a bit more complex.
			
			var iterate_level = function(level) {
				each(level, function(i, v, stop1) {
					//console.log('i ' + i);
					//console.log('v ' + stringify(v));

					// i is the field name.

					var ibt = v['indexes_by_type'];
					if (ibt) {
						each(ibt, function(i2, v2, stop2) {
							// is an index, I think.
							
							var full_stop = function() {
								stop2();
								stop1();
							}
							index_callback(v2, full_stop);
						});
					}

				})

				// each(level['indexes_by_type'], function(i, v) {
				// console.log('v ' + stringify(v));
				// each(v, function(index_type, index) {
				// index_callback(index);
				// })

				// });

			}

			// So, fields have not been added to the indexes properly.
			//  This occurred when the resources were being added to the pool.
			//  This is since Data_Object has been restructured so that it uses Data_Value to hold its array and object fields internally.





			//console.log('this.index_map ' + stringify(this.index_map));
			iterate_level(this.index_map);

		},

		// this will be checking it against constraints instead.
		/// depricated... will be removed.
		'_____can_add_object': function(obj) {
			// think we just check for single objects right now

			var tobj = tof(obj);
			//console.log('can_add_object tobj ' + tobj);

			if (tobj == 'data_object') {
				// go through the indexes to see if all the indexes can
				// add it.
				
				// does it match the acceptance criteria?
				/*
				if (this._accepts) {
					// check whether the obj matches this._accepts
					
					// ._accepts as constraints / a Data_Object as constraints?
					//  a Data_Object with its fields set as constraints?
					//  or would the fields be fine by themselves?
					
					// want a function to test a Data_Object against fields
					
					// the indexing system does not do the acceptance test for data validation, only checking it's not conflicting.
					
					console.log('this._accepts ' + this._accepts);
					
					
				}
				*/
				
				var can_add = true;

				this.iterate_indexes(function(index) {
					// a problem iterating the indexes.

					//console.log('*ii index ' + stringify(index));

					// when adding an object to an index, it could raise
					// an error.
					// may be best to check all indexes first to see if
					// the object will be addable.

					// index.add_object(obj);

					var index_can_add = index.can_add_object(obj);

					//console.log('index_can_add ' + index_can_add);

					if (!index_can_add) {
						can_add = false;
						// break from iteration, like is possible in
						// jQuery?
					}

				});

				return can_add;

			} else {
				return false;
				
			}

		},

		'add_object': function(obj) {
			console.log('Index System add_object ' + stringify(obj));
			return this.unsafe_add_object(obj);
			/*
			
			if (this.can_add_object(obj)) {
				return this.unsafe_add_object(obj);
			} else {
				throw 'Can\'t add object. Check unique key collisions.';
			}
			*/
		},

		
		// The index no longer will have a problem with multiple items with the same key being added.
		//  It's the uniqueness constraints which may have something to say about it. They would consult the indexes.
		
		'unsafe_add_object': function(obj) {

            //console.log('Collection_Index_System unsafe_add_object');
			// NOT adds an index.
			// should add an object to all indexes.
			// a way to iterate through all indexes?
			// maybe they won't be stored in a normal array.
			//console.log('Collection_Index_System unsafe_add_object ' + stringify(obj));
			//console.log('obj.meta ' + jsgui.stringify(obj.meta));

			// The object may have attached objects.
			//  There could be attached metadata, but we want a general way for indexing (fields on)
			//   attached data.

			// It will still get put into the object index, but the index will have to be set up to
			//  deal with attached fields properly.

			// These are not subfields... there may not be any more than just metadata.
			//  meta seems most applicable to the Resource system, and get and set will be useful
			//  methods for interacting with the resource itself. The name could possibly be available
			//   through non-meta, but that could possibly have security / reliability issues.

			this.iterate_indexes(function(index) {
				// a problem iterating the indexes.
				// It seems like the indexes were not set up.
				//console.log('2) ii index ' + stringify(index));
				// when adding an object to an index, it could raise an
				// error.
				// may be best to check all indexes first to see if the
				// object will be addable.
				index.unsafe_add_object(obj);
			});

		},
		
		
		'remove': function(obj) {
			// was remove_object
			
			// need to locate the object.
			// it may be in all indexes.
			
			// tell all indexes to remove that object, if they have it.
			
			this.iterate_indexes(function(index) {
				index.remove(obj);
				
			});
			// remove it from the sorted_kvs.
		},
		// This is going to be changed to collection_constraints
		'accepts': fp(function(a, sig) {
			// may be expressed in terms of a Data_Object
			if (sig == '[D]') {
				// we set the acceptance criteria to the Data_Object. Every object that gets potentially added to this gets checked against
				//  the Data_Object's check acceptance criteria method (though this may call other, non-oo methods)
				this._accepts = a[0];
				// could check all existing items against acceptance criteria (first)?
				
			}
			// if it's an object, could save that object? test against that?
			
			if (sig == '[o]') {
				throw 'Map object as acceptance criteria not yet supported in Collection';
				
			}
		})
		
		/*
		'clear' : function() {

		}
		*/
		
		// a function to get the appropriate index for the given fields.
		//  check if it has such an index?

	// ensure index by type and rows.

	});

	var Collection_Index = {
		'System': Collection_Index_System,
		'Sorted': Sorted_Collection_Index
	}

	//return Collection_Index;
module.exports = Collection_Index;

//});
