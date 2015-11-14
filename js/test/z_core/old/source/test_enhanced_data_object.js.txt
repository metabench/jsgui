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




// Could have this so it only does it when running in Node.

/*
var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
	//paths: {
    //    "some": "some/v1.0"
    //},
    nodeRequire: require
});

*/

// This will need to handle flags such as 'selected', 'selectable'.
//  They will be a bit like CSS classes, sometimes represented as CSS classes.

// Ability to add and remove these flags would be welcome.

if (typeof define !== 'function') { var define = require('amdefine')(module) }

//requirejs(['./jsgui-lang-enh'], function (jsgui) {
define(['../../core/jsgui-lang-enh', 'assert'], function (jsgui, assert) {
    
	var j = jsgui;
	
	var stringify = jsgui.stringify, Collection = jsgui.Collection, Data_Object = jsgui.Data_Object;
	var mapify = jsgui.mapify, is_defined = jsgui.is_defined, extend = jsgui.extend;
	
	var each = jsgui.each, tof = jsgui.tof;
	var iterate_ancestor_classes = j.iterate_ancestor_classes;
	var fp = jsgui.fp;
	
	var Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	
	describe("z_core /test_enhanced_data_object.spec.js ", function() {
	
		// -----------------------------------------------------
		//	test_1
		// -----------------------------------------------------
			
		xit("test_1", function() {
				
			var test_1 = function() {
				
				var edo = new Enhanced_Data_Object();
				//console.log('-----');
				var flags = edo.get('flags');
				//console.log('flags ' + stringify(flags));
				assert.equal(stringify(flags), "Collection()");
				
				flags.add('selectable');
				flags.add('resizable');
				
				//console.log('flags ' + stringify(flags));
				assert.equal(stringify(flags), 'Collection("selectable", "resizable")');
				
				//console.log('');
				flags.remove('selectable');
				//console.log('flags ' + stringify(flags));
				assert.equal(stringify(flags), 'Collection("resizable")');
				
				//console.log('flags.has(\'selectable\') ' + flags.has('selectable'));
				//console.log('flags.has(\'resizable\') ' + flags.has('resizable'));
				
				//edo.add_flag('hidden');
				
				//assert.equal(11111, 11111);
			}
			test_1();
				
		});
					
	});
	
	
	
	// Need to get this closer to having easily usable css flags.
	//  Quite a few things will be determined using boolean css flags and the general boolean flags.
	//   Should be quick to test if something has one of these values too.
	
	// So a control should have usable flags, as an Enhanced_Data_Object.
	
	// We also want css enabled flags.
	//  May be a good way of looking at it - we can enable various flags for css as well.
	//   May also want different css class names to the flags but not for the moment.
	
	// Also, we want to detect when flags get changed.
	
	
	
	
	
	
	
	
	
	//console.log(tof(Collection(String)));
	
	var test_2 = function() {
		
		// Abstract collections tested in other module.
		
		//var abs_str_coll = Collection(String);
		// perhaps not declaring things using the 'new' keyword will help with declaring things as abstract types.
		
		
		
		
		/*
		console.log('');
		console.log('');
		var coll = Collection();
		console.log('');
		console.log('');
		console.log('coll ' + stringify(coll));
		*/
		/*
		console.log('');
		console.log('');
		var coll2 = new Collection({});
		console.log('');
		console.log('');
		console.log('coll2 ' + stringify(coll2));
		*/
	}
	//test_2();
	// Would also need to be setting the size at some point...
	
});
	
