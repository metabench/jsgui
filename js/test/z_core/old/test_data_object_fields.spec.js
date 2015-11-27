
describe("z_core /test_data_object_fields.spec.js ", function () {
	
    var jsgui;
    var assert;
    var Data_Structures;
    var test_utils;

    var Collection;
    var stringify;
    var Data_Object;
    var tof;
    var mapify;
    var Sorted_KVS;
    var each;

    before(function () {
        jsgui = require('../../../core/jsgui-lang-util');
        assert = require('assert');
        Data_Structures = require('../../../core/jsgui-data-structures');
        test_utils = require('../../test-utils/test-utils');
        //
        Collection = jsgui.Collection;
        stringify = jsgui.stringify;
        Data_Object = jsgui.Data_Object;
        tof = jsgui.tof;
        mapify = jsgui.mapify;
        Sorted_KVS = Data_Structures.Sorted_KVS;
        each = jsgui.each;
    });


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
    //  Each index is actually an object, so we may be able to get reference to that and use it, maybe as well as named ids.

    // test enhanced data object.




    // this will test the capabilities of Data_Object to deal with 'Fields'.
    //  There is a fields collection for the Data_Object, and the Data_Object needs to provide a convenient interface for it.
    //  Fields will be referring to data type constraints.
    //   The constraints will exist separately from the fields, but there will be Fields object that holds the fields that are used.
    //    Really not sure about making a simpler collection object, having that used for the fields?

    // At the moment, will do this on a fairly low level, won't use many data structures in Collection and Data_Object, but they will provide quite a lot of capability.
    //  Perhaps could make Simple-Collection, or a simple Collection, then have the things that expand upon this still using the simple collection.

    // Fields seems like it could be a collection of fields within the Data_Object.
    //  For the moment will do them on a lower level. 



    // Field name
    //  string definition
    //  parsed_info

    // [name, [str_def, parsed_info]]
    //  The field stores pieces of info relavant to indexes and constraints.
    //   These indexes and constraints then need to be put in place.

    // Could possibly reference constraints from the field?
    //  Probably not necessary, because once we know what the field is, we can fairly quickly find the constraints associated.

    // ._arr_fields





    // Fields array...
    //  

    var get_arr_presidents = function () {
        return [{ 'name': 'George Washington', 'y1': 1789, 'y2': 1797 },
                { 'name': 'John Adams', 'y1': 1797, 'y2': 1801, 'party': 'Federalist' },
                { 'name': 'Thomas Jefferson', 'y1': 1801, 'y2': 1809, 'party': 'Democratic-Republican' },
                { 'name': 'James Madison', 'y1': 1809, 'y2': 1817, 'party': 'Democratic-Republican' },
                { 'name': 'James Monroe', 'y1': 1817, 'y2': 1825, 'party': 'Democratic-Republican' },
                { 'name': 'John Quincy Adams', 'y1': 1825, 'y2': 1829, 'party': 'Democratic-Republican' },
                { 'name': 'Andrew Jackson', 'y1': 1829, 'y2': 1837, 'party': 'Democratic' },
                { 'name': 'Martin Van Buren', 'y1': 1837, 'y2': 1841, 'party': 'Democratic' },
                { 'name': 'William Henry Harrison', 'y1': 1841, 'y2': 1841, 'party': 'Whig' },
                { 'name': 'John Tyler', 'y1': 1841, 'y2': 1845, 'party': 'Whig' },
                { 'name': 'James K. Polk', 'y1': 1845, 'y2': 1849, 'party': 'Democratic' },
                { 'name': 'Zachary Taylor', 'y1': 1849, 'y2': 1850, 'party': 'Whig' },
                { 'name': 'Millard Fillmore', 'y1': 1850, 'y2': 1853, 'party': 'Whig' },
                { 'name': 'Franklin Pierce', 'y1': 1853, 'y2': 1857, 'party': 'Democratic' },
                //{'name': 'Franklin Pierce', 'y1': 1853, 'y2': 1857, 'party': 'Republican'},
                { 'name': 'James Buchanan', 'y1': 1857, 'y2': 1861, 'party': 'Democratic' },
                { 'name': 'Abraham Lincoln', 'y1': 1861, 'y2': 1865, 'party': 'Republican' },
                { 'name': 'Andrew Johnson', 'y1': 1865, 'y2': 1869, 'party': 'Democratic' },
                { 'name': 'Ulysses S. Grant', 'y1': 1869, 'y2': 1877, 'party': 'Republican' },
                { 'name': 'Rutherford B. Hayes', 'y1': 1877, 'y2': 1881, 'party': 'Republican' },
                { 'name': 'James A. Garfield', 'y1': 1881, 'y2': 1881, 'party': 'Republican' },
                { 'name': 'Chester A. Arthur', 'y1': 1881, 'y2': 1885, 'party': 'Republican' },
                { 'name': 'Grover Cleveland', 'y1': 1885, 'y2': 1889, 'party': 'Democratic' }];
    }



    var get_coll_presidents = function () {
        //console.log('pre c 1');
        var coll_presidents = new jsgui.Collection({

            'fields': [
                ['name', 'indexed text(32)'],
                ['party', 'indexed text(32)'],
                ['y1', 'int'],
                ['y2', 'int']
            ],

            'items': get_arr_presidents()
        });

        return coll_presidents;
    }

    // -----------------------------------------------------
	//	test_president_class
	// -----------------------------------------------------
			
	it("test_president_class", function() {
		
		var test_president_class = function() {

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
				
			var pres = new President({'name': 'Chester A. Arthur', 'y1': 1881, 'y2': 1885, 'party': 'Republican'});
			//var pres = new President({'name': 'Chester A. Arthur'});
			// this should set up the fields.
				
			//console.log('pres ' + stringify(pres));
			assert.equal(stringify(pres), 'Data_Object({"name": "Chester A. Arthur", "y1": 1881, "y2": 1885, "party": "Republican"})');
				
				
			// should show the info for the president.
			/*
			var pres_fields = pres.fields();
			console.log('pres_fields ' + stringify(pres_fields));
			*/
				
			// let's have a look at the fields collection.
				
			var fields = pres.field();
			//console.log('fields ' + stringify(fields));
			assert.equal(stringify(fields), '[["name", "indexed text(32)", {"data_type": ["text", 32], "indexed": true}], ["party", "indexed text(32)", {"data_type": ["text", 32], "indexed": true}], ["y1", "int", {"data_type": "int"}], ["y2", "int", {"data_type": "int"}]]');
				
				
		}
		test_president_class();		
	});
					
	// -----------------------------------------------------
	//	test_control_class
	// -----------------------------------------------------
			
	it("test_control_class", function() {
		
		// More tests here on the Data_Objects with collections as fields.
		//  Can be typed collections.
		//  Likely to start a new definition of Control, based on using connected fields.
		//   Then will run through the output procedures.
			
		// Setting the class name...
		//  will be able to go map from name to object constructor, also constructor knows that class name as well.
			
		// Do want to get a file manager control working.
			
			
		var test_control_class = function() {
				
			// They would do a lot of other things, but this could be a basis for how they work.
			//  May need to make sure that the collection is indexed by control's ID, although the order could change from that.
				
			var Control = Data_Object.extend({
				'class_name': 'control',
				'fields': [
					// This may be a good way of expressing collections, works in JSON.
					//['content', ['collection', 'control']]
					['content', 'collection']
					// ['collection', 'control']] = [['control']] ? Maybe a little later.
						
					// the style field, the dom field.
					// dom field having node_type.
						
					// these fields will work using the general Data_Object system, and will be used to render things using separate code.
					//  like MVC for the DOM.
						
					// We can move this onto a new version of Control / html.
						
				],
				'connect_fields': true,
				'init': function(spec) {
						
						
					this._super(spec);
				},
				'add': function(content) {
					// maybe different for an array?
					this.get('content').add(content);
				}
			});
			// Then it has got to set up the fields properly.
			//  Should be in Data_Object, should be able to set up collection fields of type.
				
			var ctrl1 = new Control();
			//ctrl1.add('Hello World');
				
			var ctrl1_fields = ctrl1.field();
			//console.log('ctrl1_fields ' + stringify(ctrl1_fields));
			assert.equal(stringify(ctrl1_fields), '[["content", "collection", {"data_type": "collection"}]]');

			var content_field = ctrl1.field('content');
			//console.log('content_field ' + stringify(content_field));
			assert.equal(stringify(content_field), '["content", "collection", {"data_type": "collection"}]');

			var content = ctrl1.content();
			//console.log('content ' + stringify(content));
			assert.equal(stringify(content), 'Collection()');
			// Content should be a Collection object that accepts Data_Objects or Data_Values?
			//  Perhaps only use Data_Object, not Data_Value.
				
			content.add('Hello World');
				
				
			content = ctrl1.get('content');
			//console.log('content ' + stringify(content));
			assert.equal(stringify(content), 'Collection("Hello World")');
				
				
			// This is not a real control, with the render method
			//  I think a lot of Control will be removed as it will use Data_Object functionality instead.
				
			//var dtoc = jsgui.ensure_data_type_data_object_constructor();
				
				
				
			/*
			var content_field = ctrl1.get('content');
			console.log('content_field ' + content_field);
			*/
				
				
				
		}
		test_control_class();		
	});
					
	// -----------------------------------------------------
	//	test_coll_fields
	// -----------------------------------------------------
			
	xit("test_coll_fields", function() {
		
		var test_coll_fields = function() {
			var cp = get_coll_presidents();
				
		}
		test_coll_fields();
			
		// Want to test collections as fields too.
		
		assert.equal(11111, 11111);
	});
					
});

