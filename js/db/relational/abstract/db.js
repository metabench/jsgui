if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../../../core/jsgui-lang-enh"], function(jsgui) {
	
	// The abstract definition of a relational database
	
	// This may be used to create the structure for an RDB. It may be used to restrict what goes into, possibly process/format what comes out of a
	//  document database (DBD).
	
	// The Abstract Database could be object classes, such as DataObject and Collection in JavaScript.
	
	// There would be Collections, representing tables.
	// A DataObject would be much like a row, but more similar to a Domain Model object.
	
	// Schemas - Data_Objects and Collections with various restrictions.
	
	// Collection of Collections of Collections of DataObject
	// Database of Tables of Columns
	
	// Perhaps defining the database / table structure using Collection and DataObject would make the most sense.
	
	// But, there may be more flexibility that would help with Collection.
	
	// The Database is not just a collection of tables.
	//  It has got functions, constraints, triggers etc. Maybe it's a Data_Object with various collections inside.
	//   It seems like Data_Object and Collection will be quite flexible ways of describing things.
	
	// Object names and constraints / data types can be set up on Data_Objects and Collections, and more work will be done on this.
	//  It makes a lot of sense to use these models to translate into database models. Therefore I think more work on these constraints / data types
	//  on these more general objects will help.
	
	
	// As well as making them abstract, it may be worth making them as resources?
	//  Or is the fact they are abstract meaning they dont need async?
	
	
	var Data_Object = jsgui.Enhanced_Data_Object;
	var Collection = jsgui.Collection;
	var Class = jsgui.Class, arrayify = jsgui.arrayify, fp = jsgui.fp, is_defined = jsgui.is_defined;
	var tof = jsgui.tof, is_defined = jsgui.is_defined, each = jsgui.each, stringify = jsgui.stringify, arrayify = jsgui.arrayify, mapify = jsgui.mapify;
	var get_item_sig = jsgui.get_item_sig;
	
	// DB construct made out of data_objects?
	//  Keeping this as an abstract representation makes sense, however there may also be the capability to use abstract Data_Objects to represent a DB

	// Better to have an abstract DB representation itself, building on Data_Object where necessary.

	
	var Database = Data_Object.extend({
		// And the DB could have a field.


		//'fields': {
		//	'tables': Collection(Table)
		//},

		// With the fields being set as being a particular type in a collection, we need to make sure it initializes that collection properly.



		'fields': [
			// When defining a field, an abstract collection should be fine - because this is not an actual instance of an object.

			// Defines an abstract collection, of type Table

			['tables', Collection(Table)]
		],
		'init': function(spec) {
			this._super(spec);
			
			// may be given a name
			
			this.set('name', spec.name);
			
			// does not have schemas.
			//  This database has a collection of tables
			
			// Will translate from an abstract database to an abstract postgres schema, or an abstract postgres db containing one schema made from the database.
			
			// What about restricting the type in the collection to a specified type or category?
			//  Raises an error if you try to put the wrong type in there.
			//  Type checking could be disabled for speed.
			
			/*
			this.set('tables', new Collection({
				'index': 'name'
			}));
			*/
			
			
			
		}
		
		// adding tables? or that will just be done using the collection?
	
	
	})
	
	
	var Table = Data_Object.extend({
		'init': function(spec) {
			this._super(spec);
			
			// may be given a name
			
			this.set('name', spec.name);
			
			// does not have schemas.
			//  This database has a collection of tables
			
			// Will translate from an abstract database to an abstract postgres schema, or an abstract postgres db containing one schema made from the database.
			
			// What about restricting the type in the collection to a specified type or category?
			//  Raises an error if you try to put the wrong type in there.
			//  Type checking could be disabled for speed.
			
			// columns need to be indexed by order as well.
			//  there will be ordinal values for columns which may need to be referenced, modified and preserved.
			// not sure that the order by name matters so much, but it's very good having them in that order in the GUI at times.
			
			// Need to be careful about maintaining the correct column orders, perhaps that will lead to some expansion in collections.
			


			this.set('columns', new Collection({
				'index': 'name'
			}));
			
			
		}
		
		// adding tables? or that will just be done using the collection?
	
	
	})
	
	var Column = Data_Object.extend({
		'init': function(spec) {
			this._super(spec);

			
			// may be given a name
			
			this.set('name', spec.name);
			
			// does not have schemas.
			//  This database has a collection of tables
			
			// Will translate from an abstract database to an abstract postgres schema, or an abstract postgres db containing one schema made from the database.
			
			// What about restricting the type in the collection to a specified type or category?
			//  Raises an error if you try to put the wrong type in there.
			//  Type checking could be disabled for speed.
			
			// columns need to be indexed by order as well.
			//  there will be ordinal values for columns which may need to be referenced, modified and preserved.
			// not sure that the order by name matters so much, but it's very good having them in that order in the GUI at times.
			
			// Need to be careful about maintaining the correct column orders, perhaps that will lead to some expansion in collections.
			

			//this.set('columns', new Collection({
			//	'index': 'name'
			//}));

			// And this contains fields...

			// However, the jsgui data_object and Collection system may be enough to represent this anyway.

			// A column has a name and a type.
			//  Just keep the type as an object.
			
			
		}
		
		// adding tables? or that will just be done using the collection?
	
	
	})

	var res = {
		'Database': Database,
		'Table': Table,
		'Column': Column
	};

	return res;
	
	
	
});