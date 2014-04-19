if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


define(["./jsgui-lang-essentials"], function(jsgui) {
	
	// This will define some constraint items.
	//  Not so sure about adding more things to the jsgui namespace, perhaps best just to provide the Constraint object
	
	
	// Constraint won't be or use a Data_Object...
	//  There may be some code that will make use of Data_Object interfaces, not sure.
	//  Mainly, this will be for validating JavaScript values against each other for use in the Data_Object, Collection, and other things.
	
	// Having this so it does not use a lot of other references will be helpful in keeping things modular,
	//  and quickly being able to use some validation code without too much supporting it.
	


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
	var ll_set = j.ll_set;
	var ll_get = j.ll_get;
	var is_constructor_fn = j.is_constructor_fn;
	
	// Data Types are also similar to constraints.
	//  They are being used in the nested system with HTML.
	//  For the moment, I want to constinue to develop the Constraints system.
	//   They will be using something similar to Data_Type specifications for putting together the more compliacted constraints.
	
	// For the moment, these constraints will be used in preparation of mapping to a database (not nested, so far)
	//  At a later stage they will then be adapted further for the nested requirements of HTML correction and interpretation.
	
	// Perhaps the constraints, like for RGB, would be useful when putting things in a DB.
	//  Not sure how much of the translation would be done in the DB layer, but it could be done in JavaScript, with the database accepting
	//   less flexible data.
	
	// However, more flexibility and polymorphism in the database could be developed.
	//  We already have a bit, but it's not parsing RGB values. Not that keen on getting into the SQL coding, but there could
	//   be various functions that are made, library functions, that get put in.
	
	
	// I also think the whole system could run as a JavaScript file, but also have a huge declarative JSON section when a large application is running on the
	//  server.
	//  Not sure.
	
	// For the moment, this will be unifying what has been done on Data_Objects and nested objects, and serving as a general basis
	//  for RDB and other DB abstractions, and schemas.
	// Could be very useful for validating XML schemas, for example.
	
	// Some constraints that apply to collections may not apply to database tables.
	//  An example is if a collection needs to have 1 or more element. In a DB there can be an empty table, but some collections may specify it needs
	//   one or more object to be valid (but not to exist, necessarily?)
	
	// Getting these working, then mapping over to databases is quite a bit of code.
	//  Will be a useful basis for translating to abstract RBB
	
	// I think an abstract RDB set of classes would be quite useful.
	
	// Postgres RDB classes could inherit from many of them, for example.
	
	// There would also be a function to translate from generic RDB classes to Postgres ones.
	//  And to translate back too.
	
	// Then the Postgres classes are used to generate code, and functions that manipulate those tables / objects in the DB, which generate code
	
	// Advanced ORM is one of the things that this system really needs. It's going to be obtaining data and data models from other systems.
	//  Possibly would be run to quickly interoperate / import and export data to / from existing systems.
	// Could possibly have extra (very user friendly) modules operating over a legacy database application.
	//  Could do very specific things, as required for new functionality. Would then be in a position for the jsgui/metabench system
	//  to be fully activated and replace a legacy system, either keeping the existing database, or having exported and mirrored everything,
	//   could switch to Mongo or other DB designed by / using the application, or continue mirroring changes.
	
	// The whole middleware side of things will make integration tasks very quick.
	//  The Resource system and interface will be used for much of this.
	
	
	
	
	// Constraints could apply to various different things.
	//  Generally they will apply to a value.
	//  They will be testable against values to see where those values do or do not comply with the constraints.
	//  Not sure if it would be worth using this system to test against XML schemas. It could make sense. Perhaps the system for testing the XML
	//   schemas would be using this, perhaps it would even directly be this but with the correct options set.
	
	// This could get quite large, so this will really be a core constraint tester.
	//  It will be part of the core, but not the essentials. They will be useful for other programs in various places, and will be really small when
	//  compressed. In this case, I'll have a larger core. There will be builds / distributions available for clients.
	// Some will have client-side shims built in, like an IE6-7 build perhaps.
	
	
	var Constraint = Class.extend({
		'init': function(spec) {
			// if the spec is a string, then parse the string.
			
			// it may make reference to various data types.
			//  text, restricted or unrestricted length
			//  ints, numbers, etc
			//  various tests will be carried out, beyond tof.
			
			if (tof(spec) == 'string') {
				
			}
			
			// A constraint can be / contain multiple other constraints.
			//  Maybe it should have that logic inside it, and these other constraints can be particular ones.
			
			// Code execution path... may be important getting that working before long, but now it does seem that specifying and
			//  validating these various types in JavaScript seems like an important thing to do.
			
			// 
			
			
		}
	// 'matches'
		
	
	})


	var obj_matches_constraint = function(obj, constraint) {
		//console.log('obj_matches_constraint ');
		//throw('stop');
		
		if (tof(constraint) == 'string') {
			constraint = constraint_from_str(constraint);
			
			return constraint.match(obj);
		}
		
	}
	// Data_Object_Constraint
	var Data_Object_Constraint = Constraint.extend({
		'init': function(spec) {
			this.__data_type = 'data_object_constraint';
		}
	});

	var Data_Object_Def_Constraint = Constraint.extend({
		'init': function(spec) {
			this.__data_type = 'data_object_def_constraint';
		},
		'match': function(value) {
			// value must be an object?
			var that = this;

			var tv = tof(value);
			if (tv == 'object') {
				//console.log('value ' + stringify(value));

				// need to see if the value matches the items in the data_def.
				var allMatch = true;

				each(this.data_def, function(field_name, field_def, stop) {
					var match = object_matches_def(value[field_name], field_def);
					//console.log('match ' + match);

					allMatch = allMatch && match;
					if (!allMatch) stop();
				});
				return allMatch;
				//throw 'stop';
			}

		} 
	});



	// Data_Object_Def_Constraint
	//  Though putting them in as individual field constraints may make sense...
	//   But the field constraints sound more like constraints on individual fields. Useful to validate a particular field,
	//    but the object validation may work differently.

	
	var Field_Constraint = Constraint.extend({
		'init': function(spec) {
			// if the spec is a string, then parse the string.
			
			// it may make reference to various data types.
			//  text, restricted or unrestricted length
			//  ints, numbers, etc
			//  various tests will be carried out, beyond tof.
			
			this.__data_type = 'field_constraint';
			
			//if (tof(spec) == 'string') {
				
			//}
			
			// A constraint can be / contain multiple other constraints.
			//  Maybe it should have that logic inside it, and these other constraints can be particular ones.
			
			// Code execution path... may be important getting that working before long, but now it does seem that specifying and
			//  validating these various types in JavaScript seems like an important thing to do.
			
			// 
			
			
		}
	// 'matches'
		
	
	})
	



	// A Data_Object_Constraint could help

	// Data_Object_Def_Constraint
	//  A single constraint, with the definition of various fields given concisely.
	//   This could have better performance as it's not instatiating as many objects to carry out the constraints.
	//    But it may be a problem with having different ways of doing the same things.

	// Defining fields in more detail may make sense, using Field objects.
	//  They make sense for DBs

	// But for object definitions, it may be useful to just jave the simplest form of input - they could be translated to
	//  the field system. We may have two ways of modifying the same data, and have them working together well.
	
	
	// Field constraints,
	//  Will translate to data types, and possibly further checks / validation that is done in the DB layer on input
	
	// Will 
	
	
	// Collection constraints
	//  These will translate to table constraints
	
	
	// data_type_constraint
	// field_data_type_constraint
	
	//  not null is not (really) a data type constraint.
	//  same with some check constraints. Does not seem like a very definite boundary though.
	
	var Field_Data_Type_Constraint = Field_Constraint.extend({
		'init': function(spec) {
			
			// also hold the data type itself.
			
			
			
			this._super(spec);
		}
	});
	
	
	
	var Text_Constraint = Field_Data_Type_Constraint.extend({
		'init': function(spec) {
			// if the spec is a string, then parse the string.
			
			// it may make reference to various data types.
			//  text, restricted or unrestricted length
			//  ints, numbers, etc
			//  various tests will be carried out, beyond tof.
			
			//if (tof(spec) == 'string') {
			//	
			//}
			this._super(spec);
			if (is_defined(spec.length)) {
				this.length = spec.length;
			}
			
			// A constraint can be / contain multiple other constraints.
			//  Maybe it should have that logic inside it, and these other constraints can be particular ones.
			
			// Code execution path... may be important getting that working before long, but now it does seem that specifying and
			//  validating these various types in JavaScript seems like an important thing to do.
			
			// 
			
			
		},
		'match': function(v) {
			return (tof(v) == 'string' && v.length <= this.length);
		},
		'to_info_obj': function() {
			if (is_defined(this.length)) {
				return ['text', this.length];
			} else {
				return 'text';
			}
			
			
		}
	// 'matches'
		
	})
	
	var Not_Null_Constraint = Field_Constraint.extend({
		
		'init': function(spec) {
			// if the spec is a string, then parse the string.
			this._super(spec);
			
			
		},
		'match': function(v) {
			return is_defined(v) && v != null;
		}
	});
	
	// Objects that represent the data types themselves?
	//  Probably not going to use classes for that, just JS objects like arrays, maps.
	
	var Guid_Constraint =  Field_Data_Type_Constraint.extend({
		'init': function(spec) {
			// if the spec is a string, then parse the string.
			this._super(spec);
			
			
		},
		'match': function(v) {
			//return tof(v) == 'number';
			
			// string of a given length...
			
			//  this will really be for translating to Mongo or SQL Server or other DB GUID types.
			
			
		},
		'to_info_obj': function() {
			return 'guid';
		}
		
	})
	
	
	var Number_Constraint = Field_Data_Type_Constraint.extend({
		'init': function(spec) {
			// if the spec is a string, then parse the string.
			this._super(spec);
			
			
		},
		'match': function(v) {
			return tof(v) == 'number';
		},
		'to_info_obj': function() {
			return 'number';
		}
		
	})
	
	var Int_Constraint = Number_Constraint.extend({
		'init': function(spec) {
			// if the spec is a string, then parse the string.
			this._super(spec);
			
			
		},
		'match': function(v) {
			return tof(v) == 'number' && parseInt(v) === v;
		},
		'to_info_obj': function() {
			return 'int';
		}
		
	})
	
	
	// Type_Constraint
	
	
	// Collection constraints as well
	//  These may not necessirily apply to JSGUI collections, but could be for translating to Table Constraints in SQL.
	
	
	// Collections will have different types of constraints.
	
	// Could be that every item needs to follow a set of field constraints.
	// Could also be that there are unique keys.
	//  May have fields specified.
	
	// This will work very well indeed when this is done. Should be intuitive to create the models, then these models will be very useful for 
	//  translating to different things. Some of the indexing functionality of the DB gets replicated on the client in a relatively small amount of code,
	//  allowing for some things to run in a very optimized way even on IE6.
	
	// It will be nice to see the things working fine in IE6 as well as modern browsers.
	
	
	
	
	
	var Collection_Constraint = Constraint.extend({
		
		'init': function(spec) {
			// if the spec is a string, then parse the string.
			
			// it may make reference to various data types.
			//  text, restricted or unrestricted length
			//  ints, numbers, etc
			//  various tests will be carried out, beyond tof.
			this.__data_type = 'collection_constraint';
			//if (tof(spec) == 'string') {
				
			//}
			
			// A constraint can be / contain multiple other constraints.
			//  Maybe it should have that logic inside it, and these other constraints can be particular ones.
			
			// Code execution path... may be important getting that working before long, but now it does seem that specifying and
			//  validating these various types in JavaScript seems like an important thing to do.
			
			// 
			
			
		}
	// 'matches'
		
	
	});
	
	// Not so sure about this being the same Data_Type_Constraint for Data_Objects...
	
	
	// May also have 
	
	// This can force a collection to hold only a particular type of object, tested with instanceof
	
	//  And not using the field system?
	//   So we could restrict a collection to only holding a String this way.
	
	var object_matches_def = function(value, def) {
		//console.log('object_matches_def');
		//console.log('value ' + stringify(value));
		//console.log('def ' + stringify(def));

		var tv = tof(value);

		//if (def == 'string') {
		//	return tv == 'string'
		//}
		//console.log('tv ' + tv);

		if (tv == def) {
			return true;
		}

		return false;

	}

	
	var Collection_Data_Def_Constraint = Collection_Constraint.extend({
		'init': function(spec) {
			//if (tof(spec) == 'function' && is_constructor_fn(spec)) {
			//	this.data_type_constructor = spec;
			//}
			//console.log('tof(spec) ' + tof(spec));
			//console.log('tof(String) ' + tof(String));
			
			if (tof(spec) === 'object') {
				this.data_def = spec;
			}
			
			// Def is not the data_type in terms of a constructor
			this._constraint_type = 'data_def';
			
		},
		'match': function(value) {
			// value must be an object?
			var that = this;

			var tv = tof(value);
			if (tv == 'object') {
				//console.log('value ' + stringify(value));

				// need to see if the value matches the items in the data_def.
				var allMatch = true;

				each(this.data_def, function(field_name, field_def, stop) {
					var match = object_matches_def(value[field_name], field_def);
					//console.log('match ' + match);

					allMatch = allMatch && match;
					//console.log('allMatch ' + allMatch);
					if (!allMatch) stop();
				});
				return allMatch;
				//throw 'stop';
			}

		} 
	});
	
	// Perhaps rename to Collection_Data_Type_Constructor_Constraint
	var Collection_Data_Type_Constraint = Collection_Constraint.extend({
		'init': function(spec) {
			//if (tof(spec) == 'function' && is_constructor_fn(spec)) {
			//	this.data_type_constructor = spec;
			//}
			//console.log('tof(spec) ' + tof(spec));
			//console.log('tof(String) ' + tof(String));
			
			if (tof(spec) === 'function') {
				this.data_type_constructor = spec;
			}
			
			this._constraint_type = 'data_type';
			
		},
		'match': fp(function(a, sig) {
			//console.log('');
			//console.log('*  match sig ' + sig);
			//console.log('this.data_type_constructor ' + this.data_type_constructor);
			//console.log('a[0] ' + a[0]);
			//console.log('tof(a[0]) ' + tof(a[0]));
			//console.log('a[0] instanceof this.data_type_constructor ' + (a[0] instanceof this.data_type_constructor));
			
			var ta0 = tof(a[0]);
			//console.log('ta0 ' + ta0);
			if (ta0 == 'number') {
				//console.log(this.data_type_constructor === Number);
				if (this.data_type_constructor === Number) return true;
			}
			// But can perform casting / conversion.
			if (ta0 == 'string') {
				//console.log(this.data_type_constructor === Number);
				if (this.data_type_constructor === String) return true;
			}
			
			if (this.data_type_constructor && a[0] instanceof this.data_type_constructor) {
				return true;
			}
			
			if (sig == '[D]') {
				// matching a Data_Object against these constraints.
				
				//var c_res = this.data_object.obj_matches_field_constraints(a[0]);
				//return c_res;
				
				if (this.data_type_constructor) {
					return a[0] instanceof this.data_type_constructor;
				}
				
				//return 
				
			}
			
			// May be given a collection here.
			if (sig == '[C]') {
				// A collection may hold constraints for a type of collection.
				
				// Database holds Tables Collection, which is of the Table item.
				
				// let's have a look at that collection.
				var obj = a[0];
				//console.log('obj ' + stringify(obj));
				
				// eg collection of tables.
				///  probably should have its data type constraint?
				
				var obj_name = obj.get('name');
				//console.log('obj_name ' + obj_name);
				
				
				
				// we may be able to get the data_type_constraint of that collection.
				//  It may be a dtc that implies it can take a collection, maybe a collection of a particular type of object.
				
				//console.log('obj._data_type_constraint ' + stringify(obj._data_type_constraint));
				// so, a collection when given a typed collection as it's data_type will need to respond correctly.
				//  setting its _data_type_constraint
				
				//console.log('obj._data_type_constraint.data_type_constructor ' + stringify(obj._data_type_constraint.data_type_constructor));
				
				//data_type_constructor
				
				//console.log('this.data_type_constructor ' + stringify(this.data_type_constructor));
				//var stack = new Error().stack
				//console.log( stack )				
				//throw('13) stop');
				
				//var res = obj instanceof obj._data_type_constraint.data_type_constructor;
				var res = obj instanceof this.data_type_constructor;
				//console.log('res ' + res);
				// nice, seems to work.
				
				return res;
				// see if the collection's _data_type_constraint matches the constructor in this constraint.
				
				
				// this does get a bit complicated with the same code being used on different nested levels.
				//  I'll need to cut down on feature addition on this, and make sure the API is working and stable.
				//  Document it too.
				
				// Just need it to generate these relational, or semi-relational databases.
				//  Need to get the whole web platform running.
				
				// The system has got pretty big, still will need a bit more for the whole database support.
				//  Will likely make some database connected extensions... or maybe more sync code in the 'Database' class.
				
				
				//return 
				
				
				
			}
			
			
			
		})
	});
	
	// Will be used for checking every Table that gets put into a Database is a Table etc.
	//  Used to enforce ststic typing.
	
	// Something very similar could be used to enforce static typing on Data_Objects.
	//  That will restrict the objects that can get put into Data_Objects to being a particular class / subclass chain.
	
	// Collection_Data_Object_Constraint
	//  Used for making a Collection like a Table in a DB.
	//  This way the Collection is constrained to storing one type of object.
	
	// Could be a data type constraint... used for holding the required fields.
	//  Not just for checking the data_type... must check that the objects conform to the Data_Object's constraints.
	//  May be able to make a data_object that can't be constructed without the right fields...
	
	var Collection_Data_Object_Constraint = Collection_Constraint.extend({
		'init': function(spec) {
			if (tof(spec) == 'data_object') {
				this.data_object = spec;
			}

			// May also want to define a table data object constraint like:
			//  {"address": "string", "family": "string", "internal": "boolean"}
			//  (is it a constraint really? or just a collection of fields?)
			//   I think it's a constraint because it restricts their types.

			//console.log('Collection_Data_Object_Constraint tof(spec) ' + tof(spec));


			
			this._constraint_type = 'data_object';
			
		},
		'match': fp(function(a, sig) {
			//console.log('match sig ' + sig);
			//console.log('match a ' + stringify(a));
			if (sig == '[D]') {
				// matching a Data_Object against these constraints.
				
				var c_res = this.data_object.obj_matches_field_constraints(a[0]);
				return c_res;
			}
			
			// May be given a collection here.
			if (sig == '[C]') {
				// A collection may hold constraints for a type of collection.
				
				// Database holds Tables Collection, which is of the Table item.
				
				// let's have a look at that collection.
				var obj = a[0];
				//console.log('obj ' + stringify(obj));
				
				// get the constraint for that field...
				//  it should have been put in when the field gets specified.
				
				//each(obj, function(i, v) {
				//	console.log('i ' + i);
				//	console.log('v ' + v);
				//});
				
				// a lower level each?
				//  The Collection object has got fairly big and complicated.
				//  want to be able to view all its constraints easily.
				
				// it may have a data_type_constraint.
				/*
				var coll_dtc = obj._data_type_constraint;
				console.log('coll_dtc ' + coll_dtc);
				//console.log('coll_dtc ' + stringify(coll_dtc));
				
				
				
				
				var stack = new Error().stack
				console.log( stack )
				
				
				throw('14) stop');
				*/
				return true;
				
				
			}
			
		})
		
	});
	
	
	
	
	// One of these can be set to primary. The first one is by default.
	//  The order of the unique indexes matters.
	
	var Unique_Constraint = Collection_Constraint.extend({
		'init': function(spec) {
			this._super(spec);
			
			//this.set('constraint_type', 'unique');
			
			this._constraint_type = 'unique';
			
			// field (name) or actual field (reference to a field constraint).
			
			// but field could be plural too
			//  will be a convention that the singular here can sometimes refer to plural.
			//  maybe plural would be better?
			if (is_defined(spec.fields)) this.fields = spec.fields;
			
			if (tof(this.fields) == 'array') {
				this._sorted_fields = clone(this.fields).sort();
			}
			
			
		}
		// not really sure the constraint will do much here... it requires an index to be set up.
		//  perhaps tells the index not to accept duplicates?
	
		// test the constraint?
		//  do that outside for the moment
	
	
	});
	
	
	
	
	var Relationship_Constraint = Collection_Constraint.extend({
		'init': function(spec) {
			this._super(spec);
			
			// which other collection(s) and field(s) does it reference?
			
			// what form does the relationship take?
			
			// files in a folder
			//  aggregation
			//  has (composed of)
			//  many-to-one
			//   aggregation_to_item (but maybe we would be saying the folder 'has' files)
			
			
			// friends
			//  many-to-many
			//  association
			//  has (as friend) / is associated with
			//   use join table
			//   association_between_items
			
			// employees-projects
			//  many-to-many
			//  association
			//  is associated with 
			//   use join table
			//   association_between_items
			
			
			// user_roles
			//  aggregation? 
			//  maybe association
			//  one-to-many
			//  user is associated with roles
			
			// employee-pay_band
			//  association?
			//  one_to_one
			//  user has that pay band
			
			// Compositon for sub-items?
			
			// May be interested in mapping inheritance for this object system
			//  At the moment, need to just map the JavaScript structures into the database, then we'll get to work with
			//  building up the database and components of it that deal with website functionality.
			
			// Once things can quickly be declared and then created in the database, it should be relatively fast to implement programmatic
			//  components that work quickly with the DB and also can be created quickly.
			
			// There is some more to do with this work, but now it is at a really good stage where it is able to do a lot of things in the background.
			//  With some more coding, it will do a whole bunch more things.
			
			// Will do some more work on the XML / HTML transformation.
			//  That would be one of the really amazing things if I were to release it with that.
			
			// The declarative writing of these pages would be very interesting and get people interested with the JSGUI platform.
			//  That part is also something it would be interesting to get written in C++ or C.
			
			// Also, will be interesting to have bits and pieces about technology on the website.
			//  Presentations.
			
			// I think it could be very good advertising for my own services, and releasing the JSGUI open source framework will do a lot to help this.
			//  I'm likely to release the client-side framework, as well as a server distribution.
			//  I doubt it would be the full / development / internal distribution, but one that has various very useful features.
			
			// I would likely license commercial modules as well, such as a Postgres Connector.
			//  Also would have a marketplace for those who wish to sell their own components - and may well be selling advertising to those who
			//  want to sell their own components for it, possibly through Google.
			
			// May do deals with component makes, could have sponsored listings? 
			
			// The basic framework should probably be released as open-source, then I should be set for employing people and getting paid to develop this code
			//  further for clients in their systems.
			
			// I think this could make it easy to get a high performance web server running.
			//  That will be very nice indeed. I think both the ease of use and customizability will be high.
			
			// It will be very nice to have an advanced admin interface going alongside it.
			//  Won't require installing files, images etc, could be using a few vector images.
			//  It may surprise people when they see it, thinking, where did that come from, when they are doing simple, easily,
			//   but there is quite a complicated enabling system allowing it to work.
			
			// Am getting much closer to the software goals.
			//  Think I'll get a really nice system online. Don't know quite how long.
			//  I'll get a lot done over the next few days.
			
			// There may be a few more things to get really right along the execution path.
			//  There is quite a lot to do with the HTML that needs to work.
			//  Some of this will be expressed in terms of field corrections and constraints.
			
			// There is maybe another 3000 more lines that needs to be written for this?
			
			// The server side library will be big, but will be focused on producing efficient client-side output
			//  I'll do work on documenting it.
			
			// It would be interesting to see how big a build (sequentially ordered) of the JavaScript file is.
			//  Perhaps some things would need to be renamed so that lots of vars in the global namespace would work together.
			//  There would be a large amount of gain possible in the build process.
			
			// The size of the small client library is nudging upwards. Perhaps it will be a 24KB download? Even 32?
			//  It will definitely be impressive though, will enable lots of things, useful business interactions.
			
			// Could have a very useful system for conference attendees.
			//  However, need to do the constraints.
			
			
			
			
			// Likely to go into more detail on the relationship constraints when actually making them.
			//  Perhaps will be related to something in the same collection or Data_Object?
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			// Could talk to D about setting up the implementations of it.
			//  
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			// Also like the idea of having a donate for feature box.
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			/*
			 * “Each Order is associated with one or more OrderLines.”

				“Each OrderLine is associated with one and only one Order.”
				
				“Each OrderLine is associated with one and only one Product.”
				
				“Each Product is associated with zero or more OrderLines.”
			 * 
			 */
			
			
			
		}
		// not really sure the constraint will do much here... it requires an index to be set up.
		//  perhaps tells the index not to accept duplicates?
	});
	
	
	// Relationship
	
	// Foreign_Key constraint?
	//  Maybe call this a Reference or Relationship constraint.
	
	// Expressed in the data model, this could describe a many-to-many relationship that gets expressed using a links table in an RDB.
	//  Possibly using a links, or the general links / relationships table in an ODB.
	
	
	
	
	
	// Not so sure about specifying primary keys here...
	//  The things used as PKs in this system may not be PKs in the database. The PKs may all be incrementing numeric IDs in the database.
	//   That could make a lot more sense, but not in all situations.
	
	// Primary Unique Index in this situation... that will be a constraint that gets translated to unique index.
	
	
	
	
	
	// With collections, they will be saying that records are to have a property, and some uniqueness conditions should be satisfied.
	
	// NOT NULL - collection
	// UNIQUE - collection
	// PRIMARY KEY - collection
	// FOREIGN KEY - collection
	// CHECK - field but likely applied through the collection
	// DEFAULT - field but likely applied through the collection
	
	// There is quite a bit to do to get this data model working within JavaScript.
	//  Then it will be a question of getting it translating itself to other languages.
	//  Creating the RDB model, then the Postgres model, then the actual code used to create it, then running that code.
	//  These translation steps will result in a fairly substantially sized piece of software, quite powerful too.
	//   The functionality could still be fairly small in a download.
	
	// I think this could make a very nice app on the iPad, there would be quite a lot that could be made in terms of database design.
	//  Then emailing the setup code, maybe running the setup code from the iPad.
	// Being able to view all the code, a fairly focused IDE for making Postgres code.
	//  Could do quite a lot on the iPad without selling an app, and then sell an app as well.
	
	// They kind of all refer to fields, but it's to do with how these fields interact with other fields and fields in other tables/collections that
	//  make them either field or collection constraints
	
	// Text_Constraint
	// Number_Type_Constraint
	// Integer_Type_Constraint
	
	// These type constraints could also be able to parse data that does not match the constraint.
	//  Perhaps a regex could be run on a string if it's expecting something else.
	
	// Multiple_Constraint (different constraints get satisfied)
	
	
	// Indexed_Array_Constraint
	
	// All basically run tests on the object to see if it meets the constraint or not.
	
	// also get the constraint from an object.
	// some things will be expressed as (nested) JavaScript objects.
	
	// This, as well as sorting out this parsing system to be like ASP.NET, will take a while longer.
	//  On the server, it will be possible to use much more code to do what is needed.
	//  On the client, making use of existing DOM parsing would make more sense.
	
	
	
	// Different types of constraint.
	//  I think types like 
	/* from_obj instead
	var value_as_field_constraint = function(val) {
		// more flexible than getting it from a string.
		//  may be dealing with nested things too.
		
		
		
		
	}
	*/
	
	
	var from_obj = fp(function(a, sig) {
		// Should be able to interpret things as either Field or Collection constraints.
		//  Nice how Field constraints will be applyable to a Collection.
		//   This will be like setting columns in the database.
		
		// This sophisticated data model will be applicable to many database situations / scenarios.
		//  Should make it really fast to produce a database with CRUD SPs.
		//  Easy to translate from the requirements into the finished product.
		//   Convenient GUI tools for specifying the requirements.
		
		// Would be good to directly monetize this software pretty soon.
		//  I can get something impressive online soon that will get me customers and income from adverts.
		
		// Will definitely put together a good online presence.
		
		// Together with resources, ORM, and Je-Suis XML... will take some time.
		//  Also needing the web database interface.
		
		// It all has been coming on a lot very recently.
		//  Need to do more to turn it into a comprehensive web platform.
		
		// Will be a whole application including CMS.
		
		// For the moment, will continue with the single goal of getting the framework running, fully displaying my HTML website.
		
		//  I envisage my website will make use of some nice animations, and have some nice demos.
		//  A few animations in a portfolio section too.
		//   Section on work I have done (hype Brandon Generator a little bit).
		//  Technology demostrations.
		
		// Will get this whole website very polished, and will see how many people start using it.
		//  I think I could get some more widespread usage of the library, then get consultancy work regarding it.
		// Interact with the customers through the website.
		
		// OK... need to do more on this constraint system.
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		//console.log('constraint.js from_obj sig ' + stringify(sig));
		
		if (sig == '[s]') {
			return constraint_from_str(a[0]);
			
		}
		
		
		
		if (a.l == 1 && tof(a[0]) == 'array') {
			//console.log('constraint.js from_obj sig ' + stringify(sig));
			//console.log('constraint.js from_obj obj ' + stringify(a[0]));
			
			var obj = a[0];
			
			var obj_sig = get_item_sig(obj, 1);  // was get_item_sig(obj);
			//console.log('obj_sig ' + obj_sig);
			//console.log('obj ' + stringify(obj));
			
			// could be given [s,n]
			// eg ['text', 32]
			
			if (obj_sig == '[s,n]') {
				var data_type_name = obj[0];
				var length = obj[1];
				
				if (data_type_name == 'text') {
					var constraint = new Text_Constraint({'length': length});
					return constraint;
				}
				
			}
			
			
			if (obj_sig == '[s,s]') {
				var constraint_type = obj[0];
				//  then another parameter, if it's a unique constraint then the other param is the field_name
				//console.log('constraint_type ' + constraint_type);
				if (constraint_type == 'unique') {
					var field_name = obj[1];
					
					// we don't have the actual field, but got its name.
					//  the name would do for the moment.
					var constraint = new Unique_Constraint({
						'field': field_name
					});
					//console.log('constraint ' + constraint);
					return constraint;
					
					
					
				}
				
				if (constraint_type == 'text') {
					
					
				}
				
				// if it's a text constraint... that's a field type.
				
				
				
				
				
				
			}
			
			
			
		}
		
		if (sig == '[D]') {
			
			var constraint = new Collection_Data_Object_Constraint(a[0]);
			//console.log('constraint ' + constraint);
			return constraint;
		}
		
		
		
		
		// Need to really do a lot on the execution path of this.
		//  I think the whole database transformation system is necessary to get it to run, it's an integral part of the system.
		//  Getting access to relational databases is critical for the whole software to perform its intended functions.
		
		
		
		
		
		
		// an array, 2 strings...
		
		// may wind up using a variery of constraint definitions
		//  they will be interpreted here into constraint objects, which can be put in collections, and these used to test DataObjects.
		
		// Can be used for making abstract definitions of things, before data goes in.
		//  Then these abstract definitions are used in order to create the database and interact with it
		
		// Made loads of progress with the object system, constraints are going to be a very powerful feature.
		//  Requirements may also be there as a different API, perhaps requiring constraints to be matched,
		//  also some more advanced programmatic checks that would get expressed in JavaScript, whereas the constraints are 
		//  a system that will be translatable into different particular methodologies.
		
		
		
		
		
		
		
		
		
		
		
		//throw ('stop');
		
	})
	
	
	var constraint_from_str = function(str) {
		//console.log('constraint_from_str str ' + str);
		// will check the cache for it though.
		
		// will need to choose the type of the constraint.
		
		// if it's a string it won't be that complicated, I think.
		//  may be best to use regular expressions to detect what kind of constraint it is.
		
		// It may be a string with some parameters.
		// Not really wanting essentials to get bigger, but thing some extra string processing may be of use before this.
		//  Jsgui-util currently has the data types, so that one is fairly big.
		
		// Functionality will be brought over from Nested... except it will work differently
		//  In nested, there is a Data_Type_Instance.
		//  In this case, I think it will be Constraints, and more declarative descriptions of the data types.
		
		// It will be intended to mirror in some ways the data types and constraints that are in databases.
		//  Constraints could apply to collections, saying that key values must be unique, eg no one has the same NI number.
		
		
		// examples
		// 'string', 'int', 'text', 'text(32)', 
		
		// Perhaps these are like Data_Type_Instance objects, but they'll be called constraints here.
		//  They may not be limited to being data types, but they should do the same jobs.
		// The data types they reference... not so sure about making Data_Type_Instances or not.
		// Constraints as a concept makes more sense, especially when defining databases.
		
		// I think this system before too long could produce some really advanced functionality.
		//  With this abstraction made it will be possible to get development work uing it I hope.
		
		// Not quite sure how or if this will be competing with backbone.
		//  I think having the jsgui domain, having it there, with a demo and discussion, talking about it on twitter,
		//  showing the twitter feed on the website using nuce UI components...
		
		// Some simple downloadable pieces / builds
		// A system using node.js that will provide the right JavaScript client library to the clients
		// Make it easy to get running from downloads, easy-to-view examples and documentation within the downloads.
		
		// I think it could make a very sophisticated website system. Could have a graphical IDE where componets can be put in place, it generates the code for
		//  that.
		
		
		// Go through, looking for some patterns as regular expressions.
		//  If we have identified them, we have the values needed for the constraint.
		
		var rx_specified_length_text = /^text\((\d+)\)$/;
		// the data type could possibly be handled by input processors.
		//  I think that makes sense, moving input_processors out of nested and into essentials.
		//   It's an expandable system, the basis for it will not take much. The relevant input processors could be added by Data_Object, but 
		//   then be available throughout the system, such as for dealing with function calls, or data types which can have a length.
		
		
		
		
		
		var match_slt = str.match(rx_specified_length_text);
		
		//console.log('match_slt ' + match_slt);
		
		if (match_slt) {
			var length = parseInt(match_slt[1]);
			//console.log('length ' + tof(length));
			var constraint = new Text_Constraint({
				'length': length
			})
			return constraint;
		}
		
		if (str === 'int') {
			var constraint = new Int_Constraint({})
			return constraint;
		}
		
		if (str === 'number') {
			var constraint = new Number_Constraint({})
			return constraint;
		}
		
		if (str === 'guid') {
			var constraint = new Guid_Constraint({})
			return constraint;
		}
		
		
		
		
		//throw('stop');
		
		
		
		
	}
	
	Constraint.from_obj = from_obj;
	
	Constraint.from_str = constraint_from_str;
	Constraint.obj_matches_constraint = obj_matches_constraint;
	
	Constraint.Not_Null = Not_Null_Constraint;
	Constraint.Unique = Unique_Constraint;
	Constraint.Data_Object_Def_Constraint = Data_Object_Def_Constraint;
	Constraint.Collection_Data_Object = Collection_Data_Object_Constraint;
	Constraint.Collection_Data_Type = Collection_Data_Type_Constraint;
	Constraint.Collection_Data_Def = Collection_Data_Def_Constraint;
	Constraint.Field_Data_Type = Field_Data_Type_Constraint;
	Constraint.Guid = Guid_Constraint;

	return Constraint;
});

                                                   
