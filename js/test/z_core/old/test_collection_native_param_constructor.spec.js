
describe("z_core /test_collection_native_param_constructor.js ", function() {

    var jsgui;
    var assert;

    var Collection;
    var stringify;
    var Data_Object;

    before(function () {
        jsgui = require('../../../core/jsgui-lang-util');
        assert = require('assert');
        //
        Collection = jsgui.Collection;
        stringify = jsgui.stringify;
        Data_Object = jsgui.Data_Object;
    });

    // -----------------------------------------------------
	//	Data_Object(String)
	// -----------------------------------------------------
			
	it("test Data_Object(String)", function () {

	    // A way of doing a type specification on the collection.
	    //  Gives it a type constraint (may be best not implemented with another Data_Object as the constraint).

	    // In the Data_Object init we will specifically check for the spec being a Data_Type.
	    //  In which case, we make a new spec with the constraint.

	    // When a Data_Object only can store one thing.
	    //  It does not have fields, it is a field.

	    var dobj_string = new Data_Object(String);
	    assert.equal(stringify(dobj_string), 'Data_Object({})');

	    // Will have a Type_Constraint.
	    //  Not field constraints.			

	    var docs = dobj_string.constraints();
	    assert.equal(stringify(docs), 'undefined'); // ??????

	});
		
	// -----------------------------------------------------
	//	test_String
	// -----------------------------------------------------
			
	it("test_String", function () {

	    var str_coll = new Collection(String);
	    //  This should also mean the collection gets indexed.

	    assert.equal(stringify(str_coll), 'Collection()');

	    str_coll.add('wizard');
	    str_coll.add('makes');
	    str_coll.add('working');
	    str_coll.add('magic');

	    var cix = str_coll.index_system;
	    //console.log('cix ' + stringify(cix));
	    assert.equal(stringify(cix), '{"collection": Collection("wizard", "makes", "working", "magic"), "index_map": {"value": {"indexes_by_type": {"sorted": {"_super": undefined, "fields": ["value"], "alphabetic_fields": ["value"], "__type": "collection_index", "index_type": "sorted", "sorted_kvs": {"tree": {"root": {"isLeaf": true, "parent": null, "keys": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "values": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "prevLeaf": null, "nextLeaf": null}, "firstLeaf": {"isLeaf": true, "parent": null, "keys": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "values": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "prevLeaf": null, "nextLeaf": null}, "lastLeaf": {"isLeaf": true, "parent": null, "keys": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "values": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "prevLeaf": null, "nextLeaf": null}}}}}}}, "_primary_unique_index": {"_super": undefined, "fields": ["value"], "alphabetic_fields": ["value"], "__type": "collection_index", "index_type": "sorted", "sorted_kvs": {"tree": {"root": {"isLeaf": true, "parent": null, "keys": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "values": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "prevLeaf": null, "nextLeaf": null}, "firstLeaf": {"isLeaf": true, "parent": null, "keys": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "values": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "prevLeaf": null, "nextLeaf": null}, "lastLeaf": {"isLeaf": true, "parent": null, "keys": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "values": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "prevLeaf": null, "nextLeaf": null}}}}}');
	    // not sure if this long stringify(cix) makes sence here..

	    var coll_indexes = cix.indexes();
	    //console.log('coll_indexes ' + stringify(coll_indexes));
	    assert.equal(stringify(coll_indexes), '[{"_super": undefined, "fields": ["value"], "alphabetic_fields": ["value"], "__type": "collection_index", "index_type": "sorted", "sorted_kvs": {"tree": {"root": {"isLeaf": true, "parent": null, "keys": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "values": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "prevLeaf": null, "nextLeaf": null}, "firstLeaf": {"isLeaf": true, "parent": null, "keys": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "values": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "prevLeaf": null, "nextLeaf": null}, "lastLeaf": {"isLeaf": true, "parent": null, "keys": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "values": {"items": ["magic", "makes", "wizard", "working", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined], "count": 4}, "prevLeaf": null, "nextLeaf": null}}}}]');
	    //console.log('coll_indexes.length ' + stringify(coll_indexes.length));
	    assert.equal(coll_indexes.length, 1);
	    var only_index = coll_indexes[0];
	    //console.log('only_index ' + stringify(only_index));
	    //console.log('only_index.index_type ' + stringify(only_index.index_type));
	    assert.equal(stringify(only_index.index_type), '"sorted"');

	    // Before being able to remove something quickly, the thing needs to be indexed.
	    //  This string collection gets indexed by value.

	    // want a look at the collection's index system

	    // Removal of items from the collection
	    //  Requires knowing where they are in the array (hopefully that is indexed / can be looked up quickly)
	    //  A linked list would make removal faster.
	    //  However, the items do know their position within the collection, at least.
	    //   That's something that this was originally designed to improve over jQuery, when there are document items and we want the index.
	    //   However, an improvement over jQuery's index() method still falls short of the best that can be done.


	    // can we check if it has an item?
	    // str_coll.had('wizard');

	    var has_wizard = str_coll.has('wizard');
	    assert.equal(has_wizard, true);

	    str_coll.remove('wizard');
	    assert.equal(str_coll.has('wizard'), false);

	    assert.equal(stringify(str_coll), 'Collection("makes", "working", "magic")');
	});
					
	// -----------------------------------------------------
	//	test_Number
	// -----------------------------------------------------
			
	it("test_Number", function () {

	    var num_coll = new Collection(Number);
	    //num_coll.add('wizard');
	    num_coll.add(1);
	    //console.log('num_coll ' + stringify(num_coll));				
	    assert.equal(stringify(num_coll), 'Collection(1)');

	    // Would also need to be setting the size at some point...
	});
					
});
	
	
