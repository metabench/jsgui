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




/*

var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require
});
*/

if (!(requirejs)) {
	var requirejs = require('requirejs');

	requirejs.config({
	    nodeRequire: require
	});
	
}

requirejs(['./jsgui-lang-util', './database', './web-database', './database-norm'],
function (jsgui, Database, Web_Database, Database_Norm) {
    
	var j = jsgui;
	
	var stringify = jsgui.stringify, Collection = jsgui.Collection, Data_Object = jsgui.Data_Object;
	var mapify = jsgui.mapify, is_defined = jsgui.is_defined;
	
	var each = jsgui.each, tof = jsgui.tof;
	var iterate_ancestor_classes = j.iterate_ancestor_classes;
	//var Sorted_KVS = Data_Structures.Sorted_KVS;
	
	
	var web_db = new Web_Database({
		'name': 'MetaBench'
	})
	
	// constructing the new database ruins the old one.
	//  don't want to be setting the class's fields.
	//var db_2 = new Database({
		//'name': 'db_2'
	//});
	
	//db_2.set('name', 'hello');
	
	//var db_2 = new Database({
	//	'name': 'db_2'
	//});
	
	//console.log('web_db ' + stringify(web_db));
	
	var web_db_tables = web_db.get('tables');
	console.log('web_db_tables ' + stringify(web_db_tables));
	//var web_db_tables = web_db.get('tables');
	//console.log('web_db_tables ' + stringify(web_db_tables));
	console.log('');
	var norm_web_db = Database_Norm(web_db);
	
	console.log('norm_web_db ' + stringify(norm_web_db));
	// OK... this seems to work.
	//  Had an obsucre bug to do with the '_' property unexpectedly being copied over from the prototype.
	//  Interestingly, the prototype is an actual live object.
	
	
});
	
