/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


define(["./jsgui-lang-essentials", "./jsgui-data-structures", "./constraint", "./data-object-fields-collection"],
	function(jsgui, Data_Structures, Constraint, Fields_Collection) {

	*/
var jsgui = require('./jsgui-lang-essentials');
var Data_Structures = require('./jsgui-data-structures');
var Data_Value = require('./data-value');

var Constraint = require('./constraint');
var Fields_Collection = require('./data-object-fields-collection');
var Evented_Class = require('./evented-class');

	// Creates the Constraints data type... so a constraint specified with a string can be tested against
	//  also a cache of the constraints that have been made through the string - quick to get them again for reuse when testing.

	// Constraint objects can be saved and used in various places.
	//  They may not always be referred to directly, that would save on the amount of code needed.

	// They will help in making a model of what gets put into a database.
	//  A few constraints put in place in the domain model or similar will help with its translation to a database model.

	// These wide-ranging things should help a lot with creating a wide range of performant databases quickly.
	// It will also be a good tool in itself.

	// Change events
	// -------------

	// Want to have different levels of responding to change events.
	//  It gets a bit complicated with the same data represented in different places and also in transmission between them.
	//  Data will have various different statuses.
	//  Need to be able to recieve data from the server, and update the client data models, and announce it within the client app,
	//   without then telling the server that the data has been changed on the client, unless it makes it clear to the server that the client was
	//   making the change as the server requested. That change acknowledgement could be a useful feature on the client.
	//    Don't want that to be more than an acknowledgement though.
	//   Also need to deal with change initiation properly.
	//    The change could be initiated on the client, needs to be updated on the server, and then sent to the various different clients.
	//     Could have different levels of receipt validation there too, so that the client knows once the change has been recieved (and processed?) by
	//      the other clients. This could be useful for amber and green lights in a chat system, for example.
	///    Receipt of message validation would also be useful for data structures and making them transactional if possible.

	// So, we need a type of set that is for updating the data from an updated external source.

	// notify_change_from_external
	//  and when that has processed it could send a receipt of update message notification back to the server.
	//  That should probably be optional.














var j = jsgui;
var Class = j.Class;
var each = j.each;
var is_array = j.is_array;
var is_dom_node = j.is_dom_node;
var is_ctrl = j.is_ctrl;
var extend = j.extend;
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
var input_processors = j.input_processors;
var iterate_ancestor_classes = j.iterate_ancestor_classes;
var is_arr_of_arrs = j.is_arr_of_arrs;
var is_arr_of_strs = j.is_arr_of_strs;
var is_arr_of_t = j.is_arr_of_t;
var clone = jsgui.clone;

var data_value_index = 0;
var data_value_abbreviation = 'val';

// do data objects get an ID when they are initialized.
jsgui.__data_id_method = 'init';

var obj_matches_constraint = Constraint.obj_matches_constraint;
var native_constructor_tof = jsgui.native_constructor_tof;

var value_as_field_constraint = Constraint.value_as_field_constraint;

var Ordered_String_List = Data_Structures.Ordered_String_List;


// gets a value as a field_constraint object.
//var ensure_data_type_data_object_constructor = j.ensure_data_type_data_object_constructor;


// So, Data_Objects may have a Page_Context, Application_Context, or just Context.
//  The Context would include info such as which browser is being used.
//   Controls will render differently depending on the context.

// jsgui.data_types_info and data_type will become much more closely integrated into this.
//  Perhaps there should be another module level for this.

// Not sure about introducing it here. Maybe in lang-essentials? Don't want that to get too big.

// Data_Object Flags is the next thing here...
//  But that requires a Collection.
// Can make Enhanced_Data_Object?
//  Or make Data_Object enhance itself once it has a Collection.
//  Or could do Flags on a lower level.

// Quite a complicated question.
//  Flags running as a collection of strings makes a lot of sense.
//   Will be ordered etc.

// Could make a basic Data_Object too?
//  Basic_Collection?

// Then have different levels?


var Mini_Context = Class.extend({

    // Need quite a simple mechansm to get IDs for objects.

    // They will be typed objects/

    'init': function(spec) {


        var map_typed_counts = {}
        var typed_id = function(str_type) {
            throw 'stop Mini_Context typed id';

            var res;
            if (!map_typed_counts[str_type]) {
                res = str_type + '_0';
                map_typed_counts[str_type] = 1;
            } else {
                res = str_type + '_' + map_typed_counts[str_type];
                map_typed_counts[str_type]++;
            }
            return res;
            /*
            var iTypedIds = {};
            if (typeof iTypedIds[str_type] === 'undefined') {
                    iTypedIds[str_type] = 1;
            }

            var typed_id = function(str_type) {
                if (typeof iTypedIds[str_type] === 'undefined') {
                    iTypedIds[str_type] = 1;
                }
                var res = iTypedIds[str_type];
                iTypedIds[str_type] = iTypedIds[str_type] + 1;
                return res;
            };
            this.qid = qid;
            */
        }
        this.new_id = typed_id;
        //new_id
    },

    'make': function(abstract_object) {
        if (abstract_object._abstract) {
            //var res = new
            // we need the constructor function.

            var constructor = abstract_object.constructor;
            console.log('constructor ' + constructor);


            //throw 'stop';

            var aos = abstract_object._spec;

            // could use 'delete?'
            aos.abstract = null;
            //aos._abstract = null;
            aos.context = this;

            //console.log('abstract_object._spec ' + stringify(abstract_object._spec));
            // Not sure it is creating the right constructor.


            var res = new constructor(aos);
            r
            return res;
        } else {
            throw 'Object must be abstract, having ._abstract == true'
        }
    }

});


// Enhanced_Data_Object with flags seems like one of the best options.
//  These flags can easily correspond to CSS classes in an MVC system too, CSS will be automatically updated when the object's properties change.

// And Control will inherit from Enhanced_Data_Object.
//  Flags is not a massive enhancement, but there could be more.
//  Could maintain a Collection of references to other Data_Objects and Enhanced_Data_Objects more conveniently.


// Want either express-like routing, or to lift the routing out of Express.
//  It may be worth integrating Express right into this, for the things that Express does.
//   There may be various things that Express does not do, but could be called upon to assist with.
//    JSGUI seems very much about building the HTML, and acting as MVC on client and server. It could use Express.
//     Or it could incorporate Express.
//      Perhaps JSGUI can be used by Express to render pages.
//       Will have it compatable, but there will be some overlapping features.
//       jsgui could use some Express routing by default.

// Having je suis XML running soon will be nice!
//  Could serve from a directory.
//   Want to get that working as that will really be the code path that is taken.
//   Could get a site up and running using that before so long...
//    But also want to have the discussion forum running. Doubt I want all the ORM for that, but will be able to get it running in a document database before too long.
//   Then the system will definitely be quite fast.
//    Would not be all that much user data, but would need to start to keep it backed up / consistent.

// Data_Object is not using 'nested' at the moment.

// Nested has got fairly complicated, it's fairly good though.
//  Perhaps it will wind up being refactored into Data_Object and uses of that.

// Currently Nested is dealing with data types.

// We need to ensure that data getting put into Data_Objects meets data type criteria.
// Nested also has the ability of transforming data.
// 1) Meets the criteria
// 2) Meets criteria for transformation into the correct data

// The data types can be dealing with nested information too.
//  I think dealing with nested information will wind up in the core.
//  The core may wind up being abit big, but it's all important stuff.
// With 4G and the use in various environments like conference halls, downloading 32KB onto an iPad would not be a problem.
//  I think the whole thing could load very quickly, then present the user with a powerful application.



// The schemas system is going to be namespaced, and will use a Namespaced_Dict object, which will use a B+ tree, for retrieval by prefix.

// Should possibly be called constrints.
// Having Constraints built right into Data_Object may be the most suitable thing to do.

// It is the same terminology as databases.
//  Field constraints makes sense too.

// Constraints that apply to whole collections - the same language used to talk about indexes.
//  Indexes will be used to power unique constraints, so it'll make use of the 'constraint' terminology.

// Bringing the focus to 'constraints' will help bridge the gap into the database world.
// Things will be expressable in a way that is more closely transferrable,
//  though some constraints in this system will be represented using types in other systems.

// This will possibly become quite a widely used MVC paradigm.

// I think having plenty of tests, API documentation, and well-written tutorial / reference documentation will help a lot.
//  Can have quite a few pages of this documentation with Google adverts.
// I would be interested to see how much a small amount of advertising on the documentation part of my site will make.
//  Also, advertising will not be shown to the paying customers.



// constraint function?
//  and can give it multiple constraints?

// be able to get information about the constraints that are applied to a Data_Object as well.
//  Remember, the constraints won't be stored in a collection.


// They will be called constraints.

// constraint?
// singular does make sense because we do keep giving them maps and arrays to process.

// The constraints in use on the Data_Object will be field constraints.

// Data_Object needs more work to do with setting, getting, and checking against its fields.
//  Have checking for collections, but need checking for changing a field's value.

//  The fields system here will have clear, logical results when testing.
//   Possibility of connection a fields check onto the object class, or having one for all objects of that class?
//   Don't want to be holding lots of repeated data about fields in memory, though it's not really a major problem to begin with.



// easy api with add_field etc...
// ensure_field.
// remove_field
//  would need to remove indexes


// perhaps just call them field_constraints for the moment.
//  saying a field is indexed... that has more to do with the collection.

// Will not use a 'Field' object.
//  Fields will be held in the form [name, [string_representation, obj_representation]]

// Fields_Collection?
//  This seems like a nice encapsulation of the fields functionality, stopping the Data_Object from becoming too complicated itself.
//   The fields may have some indexes added for faster lookup at a later stage, Data_Object can easily use the API.
//  set_field  (ensure_field) / set
//  remove_field / remove / out
//  get_field / get(field_name)
//  get_fields / get()
//  set_fields / set(map or array)
//   other lower level things, remove_field_index(field_name), remove_field_unique(field_name), remove_field_flag(field_name, flag_name), add_field_flag etc
//    also while suppressing raising of events (when an index has been deleted, this will be about updating the field so that it does not refer to that index.
//    these will be carried out when indexes or constraints (that refer to fields) are added/removed

// Will also raise events for when fields are added, removed, or changed.
//  This will enable other components, that refer to fields, such as Constraints and Indexes, to remain updated.
//   When adding / removing constraints, will need to have that update the field info, maybe modify fields while suppressing events.

// All lower level collection systems...
//  not arranged around Data_Objects

// The Index_System does the job with indexes on a collection.


// Fields referring to the field constraints.
//  Field constraints being their own classes... fields not being so?

// Fields referring to their actual indexes. Collection has the Index_System, but we need to be referring to indexes from the field?
//  or just hold the info in the field that it is to be indexed. Modifying this can alert the collection so that it removes the index from the field.

// Some constraints / indexes will only apply to fields of objects within a collection.


// Constraints_Collection
// Indexes_Collection?

// [field_name, [str_repr, obj_repr]]

// will coerce the types a little - ensure it is arr3_field format
//  [name, str_def, obj_def]


// This will hold a collection of fields that are used by an object.
//  They get maintained in a particular order.

// But what exactly are these fields?

// Stores an array of fields...?


//var map_jsgui_ids = {};

// Won't be a whole map of IDs for every object made by jsgui.
//  They will be stored within a Page_Context.
//  There had been a great slowdown for subsequent requests. Definitely don't want that.

/*

var new_data_value_id = function() {
    var res = data_value_abbreviation + '_' + data_value_index;
    data_value_index++;
    return res;
};
*/

// I think Data_Object will be made so that it can act as a Data_Value.
//  It will work in a very constrained mode, such as only holding one value, such as a string.
//  It may also hold a field name and a value.
// Data_Object(String);

// Collection using a Data_Value constraint?
//  Constrinat testing is already in Data_Object.

// Data_Value is likely to have a type. It could have type checking. Needs to be lightweight though.

// I think the Data_Value will also have events.
//  Change event being the main one of interest at the moment.








// This system will exist within the Page_Context
//  We don't want loads of these controls / Data_Objects to stay within the normal application memory all the time.


// Context will hold these indexes.
//  A context will be set up for each page request.
//  Request_Context?
//  Page_Context on the client?

// Lots of objects will have links to their contexts.
//  Will make it easy to get info about what browser / front-end capabilities there are.




/*

var data_object_index = 0;
var data_object_abbreviation = 'do';

var new_data_object_id = function() {
    var res = data_object_abbreviation + '_' + data_object_index;
    data_object_index++;
    return res;
};

*/

// What about turning a normal object into a DataObject?
//var t_id_num = 0;
// May be good for testing the collecton and data object.

// Don't want the Data_Object to always be betting IDs (after all).
//  Don't want to always have to have a context - though for many purposes a context will help when rendering HTML.
//   Has got in the way of other simpler things.

var is_js_native = function(obj) {
    var t = tof(obj);
    return t == 'number' || t == 'string' || t == 'boolean' || t == 'array';
}


// Should maybe make it extend Evented_Class
//  Data_Value would extend that as well.

// Control would have specific handling for DOM events.

// With EVented_Class in lang-essentials?



// Data_Objects have contexts.
//  Not sure about registering every Data_Object within the context.
//  It seems worthwhile having Controls registered within a Page_Context.
//  Perhaps data, registered within a Data_Context (which I am yet to make) could enable a spreadsheet to have components that get notified about changes to the data.

// I think that I will have controls register themselves within the context.
//  call context.register_control()


var Data_Object = Evented_Class.extend({
    'init': function(spec) {
        // but it could do a different initialization as an abstract object.
        //  Collection(String) seems more like an abstract collection, or even a newly defined type.
        //  because of its easy syntax, Collection(String) makes a lot of sense to use.
        // going without the new keyword when we are not particularly looking for an actual new collection,
        //  but something that signifies its type as a collection of strings.
        //   May be possible to have these running in abstract (or schema?) mode.
        //   I think abstract mode fits in well with names we already are using.

        //console.log('begin Data_Object init');

        // bound_events needs to be overhauled quite a lot.
        //  There is a major problem with it right now.

        //  It's not staying within the context.
        //   Don't really want to be storing the index of object ids?
        //    could be useful during the creation of the page.


        // can have 'abstract': true in the spec,
        //  we will get this if it was called without the 'new' keyword as well.
        if (!spec) spec = {};
        //if (!is_defined(spec)) {
        //	spec = {};
        //};

        // if it's abstract call the abstract_init.

        if (spec.abstract === true) {
            //throw 'stop abstract';
            // this may need to be more lightweight.

            this._abstract = true;

            // iinit = instance init?
            //  with it only needing to save the spec, not do further initialization?



            //console.log('tof(spec) ' + tof(spec));

            // And with the spec as a function, we'll be able to say that each item must match that constructor
            //  However, there are only a few native JavaScript functions to check this against.

            // As a function, it gives a type constructor.
            //(console.log('tof(spec) ' + tof(spec)));
            var tSpec = tof(spec);

            if (tSpec == 'function') {
                this._type_constructor = spec;
                // could possibly
                // but maybe want to keep this json-friendly.

                // the type constructor could be used in a collection.
                //  could be more leightweight than other things? specific constraint objects.
            }
            // Abstract controls won't be dealing with events for the moment.
            if (tSpec == 'object') {
                this._spec = spec;
                // could possibly
                // but maybe want to keep this json-friendly.

                // the type constructor could be used in a collection.
                //  could be more leightweight than other things? specific constraint objects.
            }

        } else {
            var that = this;
            this._initializing = true;

            var t_spec = tof(spec);
            //console.log('t_spec', t_spec);

            if (!this.__type) {
                this.__type = 'data_object';

            }

            if (!this.hasOwnProperty('_')) {
                this._ = {};
            }

            if (t_spec == 'object') {
                // Normal initialization

                if (spec.context) {
                    //console.log('spec has context');

                    this._context = spec.context;
                }

                if (spec._id) {
                    this.__id = spec._id;
                }

            }
            if (t_spec == 'data_object') {
                // Initialization by Data_Object value (for the moment)

                // Not so sure about copying the id of another object.

                if (spec._context) this._context = spec._context;

                // then copy the values over from spec.

                var spec_keys = spec.keys();
                console.log('spec_keys', spec_keys);

                each(spec_keys, function(i, key) {
                    that.set(key, spec.get(key));
                });


            }


            // Why would the spec be a function?








            //this._relationships = {};

            // when setting a value with another Data_Object,
            //  make the child one remember the parent relationship.
            //  may be possible to have multiple parents, could be that a data set is referred to in two places. When that data set changes it will get changed in
            //   all of its parents too.

            // not so quick.
            //  Don't want that item appearing unnecessarily.
            //  May ensure it at a later stage.

            //this._requirements = {};

            // then __type_name
            // __data_type_obj? (maybe not needed because of (quick) lookup from name, seems more memory efficient?)

            //var ctr = this.caller;
            //var dtn = ctr.data_type_name;
            //console.log('dtn ' + dtn);
            //console.log('this.__type_name ' + this.__type_name);
            //console.log('this.__data_type_info ' + stringify(this.__data_type_info));

            // and if a data type has been declared, we'll be parsing the input.
            // will essentially be setting the 'value' in the spec.

            // always the case with constructors when given a data_type?
            //console.log('do this.__type ' + this.__type);

            //console.log('jsgui.__data_id_method ' + jsgui.__data_id_method);
            //throw 'stop';

            if (!is_defined(this.__id) && jsgui.__data_id_method == 'init') {

                // It should have the context...
                //  But maybe there can be a default / application / initialization context (not serving a particular page).
                //   Things to do with processing jsgui would be in that context.

                if (this._context) {
                    //console.log('this._context ' + this._context);
                    //console.log('sfy this._context ' + stringify(this._context));
                    this.__id = this._context.new_id(this.__type_name || this.__type);
                    //console.log('DataObject new ID from context: ' + this.__id);

                    //this._context.map_objects[this.__id] = this;
                    // Not keeping a map of objects by id in the context.

                } else {

                    // Use the default context.
                    // possibly make a new_data_object_id function?

                    // Maybe don't need to give all data objects ids.

                    //var create_id = function()
                    /*
                    var new_data_object_id = function() {
                        var res = '_tid_' + t_id_num;
                        t_id_num++;
                        console.log('new temp id ' + res);
                        return res;
                    }

                    console.log('no context found - creating new temp id. should have context');

                    this.__id = new_data_object_id();

                    */
                    // don't think we keep a map of all IDs, or we will do within a Page_Context.
                    //map_jsgui_ids[this.__id] = this;
                    // and make sure it is within the index / map of jsgui objects with ids.
                }


            }

            // don't get it from the prototype
            // It was copying over from the prototype.
            //  01/07/2012, it took a while to track this down.
            //   Copying things over from a prototype could prove very useful.
            //   May do more work on a type system, and then rebuild the whole thing around a type / class system that is definitely more advanced.
            //

            // so, not getting it through the prototype chain.


            // is also going to have a _fields object.
            //  the _fields will have different things in them.

            // Not sure about this.

            if (is_defined(this.__type_name)) {
                spec = {
                    'set': spec
                }
            };

            /*
            if (is_defined(spec.data_def)) {
                //spec = {
                //	'set': spec
                //}

                this.

            };
            */

            // data_def

            //this._ = this._ || {};
            //var _ = this._;

            // ensure(this, '_');
            //var _ = this._ = this._ || {};


            // but the collection could be made in the prototype I
            // think???

            // console.log('that._collection_names ' +
            // that._collection_names);

            // The collection names... could be dealt with using the
            // data_type_instance methods.

            // Interesting... has collections inside.

            // ok, so it works so far.

            // but with the collection properties - can these be
            // initialized here?
            // maybe do that within the collection property....
            // but may need to check too much.

            // the chain of fields... not sure how the chain needs to work backwards.
            //  for person recorded: [[0, ["flags", ~Collection(String)]], [0, ["dob", "date"]], [1, ["name", "string"]]]
            //  maybe need to join them together better? into a fields list?
            //  so we start with the most recent ones?
            //  fields map so we know what they are by name, so ignoring the repeated ones going back, who's definition will have been overwritten.
            //  Then we use the chained fields in the right order... set the fields up?
            //   But I think we want lazy field loading anyway.

            // Need to have the dom field available to HTML.

            var chained_fields = get_chained_fields(this.constructor);
            var chained_fields_list = chained_fields_to_fields_list(chained_fields);

            //var chained_fields_list = chained_fields_to_fields_list(get_chained_fields(this.constructor));
            // need to look at how the chained fields are set up.
            //  I think various (chained) fileds will get set up during the normal initialization of the library.



            // It may not be setting up the fields right for Color.
            //  There is an indexed array of red, green, blue.




            //console.log('chained_fields ' + stringify(chained_fields));


            //console.log('* chained_fields ' + stringify(chained_fields));
            //console.log('* chained_fields_list ' + stringify(chained_fields_list));
            // the chained fields list seem OK.

            // But making just a list of fields out of the chained ones...
            //  is it working OK?

            //throw 'stop';

            //console.log('* chained_fields_list ' + stringify(chained_fields_list));
            //throw 'stop';
            // then process the chained fields to fields list...

            // Need to set the Context?

            // I think only make the fields collection if there are fields.

            if (chained_fields_list.length > 0) {
                this.fc = new Fields_Collection({

                    // Fields collection has a context?

                    //
                    //'containing_object': this
                });

                // but the field object itself may be created on get.
                //  need to make sure at that time it has its parent.

                // need to check how this is getting set now.
                //  This is only really dealing with setting up some info for the fields, the fields will likely be empty until they are needed,
                //   using lazy loading to save memory.
                //console.log('');
                //console.log('');
                //console.log('*** chained_fields_list ' + stringify(chained_fields_list));

                //this.fc.set(chained_fields);
                this.fc.set(chained_fields_list);

                // the fields collection... that needs to handle fields that are given
                //  as constructor functions.
                //   maybe assume a function is a constructor function?
                //    then a 'products' field that is given by a constructor function
                //     would then have a connected field that sets that value.


                var do_connect = this.using_fields_connection();
                if (do_connect) {

                    var arr_field_names = [], field_name;
                    each(chained_fields, function(i, field_info) {
                        //console.log('field_info ' + stringify(field_info));

                        field_name = field_info[1][0];
                        //console.log('field_name ' + field_name);
                        arr_field_names.push(field_name);
                    });

                    // just an array of fields.
                    //console.log('arr_field_names ' + stringify(arr_field_names));
                    this.connect_fields(arr_field_names);
                }
            }


            // does set work OK?



            // that should have done it...
            //  the field collection should now hold info about all of the fields.


            //this.fields(chained_fields);



            // also, if we have fields (obtained through the field chain in this case), we then need to check if the fields get connected.
            //  this is a nice way of doing things, making it easy to specify, but without too much going on automatically.

            //


            // have something in the prototype that says the collection
            // names?
            // order of bound events called not strictly set.


            // could possibly do this at a later stage of initialization, once the variables have been set for sure.
            //  could have already set the variables.
            //console.log('spec ' + stringify(spec));

            //console.log('chained_fields_list ' + stringify(chained_fields_list));


            //var chained_fields_map = mapify(chained_fields_list, 0);
            //console.log('chained_fields_map ' + stringify(chained_fields_map));
            //each(chained_fields_list, function(i, v) {
                //chained_fields_map[v[0]] = v[1];
            //});

            // go through chained_fields_map[i]), setting up fields.

            // maybe best to use the list.

            /*
            each(chained_fields, function(i, chained_field) {
                var field_name = chained_field[0];
                var field_def = chained_field[1];

                // The point is, I think, that I am not making field classes, but processing them using some more basic variable types.

                //console.log('field_name ' + field_name);
                //console.log('field_def ' + stringify(field_def));

                // at least it has those fields... I am not sure it needs to do anything until 'get', maybe even if there are default values.


            })
            */


            //console.log('tof(spec) ' + spec);
            var chained_field_name;

            // If the spec is an object.

            if (t_spec == 'object') {
                each(spec, function(i, v) {

                    // Just copy the functions for the moment?
                    // what about copying everything else?
                    // need to may more attention to adding things?
                    // push the other, non-function items one by one?

                    // Or copy the other things to '_'.

                    // var my_i = that[i];
                    // will save a bit in the Core rewrite. Will eventually
                    // put these techniques in the main lib.
                    // calling the functions???

                    // May be used for controls???
                    // Function calls in spec...
                    // Calling things like 'bind' through the spec.

                    //console.log('i ' + i + ' =v= ' + v + ' that[i] ' + that[i]);

                    // Other thing that we may want to do is just copy
                    // things.
                    // Really not sure about that in general though, with
                    // DataObject being so generally used as a basis for
                    // things like controls.

                    if (typeof that[i] == 'function') {
                        // connected by now!

                        // such as setting the fields...

                        that[i](v);
                    } else {
                        // _[i] = v;

                        // they could be values...
                        //  should set the values

                        // possibly only set them if they correspond to fields?

                        // set values from fields seems like a good idea here.
                        //  that seems like a good level of connectedness.
                        //  want a map of the fields to quickly test them.

                        // setting values from chained fields?
                        //  probably better to set them from the normal fields.

                        //console.log('2* chained_fields ' + stringify(chained_fields));
                        //console.log('2* chained_fields_list ' + stringify(chained_fields_list));

                        // it will be dom.nodeType.



                        // then it should be able to set some values.
                        //console.log('spec ' + stringify(spec));

                        // maybe a map of chained fields would work better.

                        // Could be done a lot more efficiently with a map.

                        if (chained_fields_list.length > 0) {
                            var tcf, chained_field;
                            for (var c = 0, l = chained_fields_list.length; c < l; c++) {
                                chained_field = chained_fields_list[c];
                                tcf = tof(chained_field);

                                if (tcf == 'string') {
                                    chained_field_name = chained_field;
                                } else if (tcf == 'array') {
                                    chained_field_name = chained_field[0];
                                }

                                //console.log('chained_field_name ' + chained_field_name);
                                // coming out as undefined.

                                // I think I need to redo the field chaining system somewhat.
                                //  It's algorithms can be made faster and neater.
                                // Basically, at any level we define fields.
                                // Need to be able to get the fields for this level.
                                //  Would help to get the names of the parents.
                                //   Field definitions of the subclasses overwrite those of the superclasses.

                                // Want to be able to get the field chain...
                                //  That is going backwards getting all of the fields.
                                //   Not overwriting them as older ones are found.




                                // Redoing the field chaining is probably one of the largest
                                //  changes to make in order to get a nicely working system.





                                //console.log('i ' + i);

                                // Need to make sure we a are properly holding the field types.

                                if (chained_field_name == i) {
                                    //console.log('*** chained_field_name ' + chained_field_name);
                                    //console.log('setting');
                                    //that.set([i, v]);

                                    // Need to check setting a collection with an array.
                                    that.set(i, v);

                                    //console.log('that._[i] ' + stringify(that._[i]));
                                }
                            }

                            /*
                             each(chained_fields_list, function(i2, chained_field) {
                             //console.log('chained_field ' + stringify(tof(chained_field)));



                             if (tof(chained_field) == 'string') {
                             chained_field_name = chained_field;
                             }
                             if (tof(chained_field) == 'array') {
                             chained_field_name = chained_field[0];
                             }

                             //console.log('chained_field_name ' + chained_field_name);
                             //console.log('i ' + i);

                             if (chained_field_name == i) {
                             //console.log('chained_field_name ' + chained_field_name);
                             //console.log('setting');
                             //that.set([i, v]);

                             // Need to check setting a collection with an array.
                             that.set(i, v);

                             //console.log('that._[i] ' + stringify(that._[i]));
                             }
                             });
                             */
                        }


                        //throw('stop');
                        /*
                         //chained_fields_list
                         if(chained_fields_map && is_defined(chained_fields_map[i])) {
                         console.log('chained_fields i ' + i);
                         console.log('chained_fields v ' + v);



                         that.set(i, v);
                         }
                         */
                    }
                });

                // events as a list?
                // or named anyway?

                // then there is a list for the events of each name.
                // also, will create the _bound_events object when needed.
                //this._bound_events = {};

                if (is_defined(spec.event_bindings)) {
                    throw '16) stop';
                    each(spec.event_bindings, function(event_name, v) {
                        if (tof(v) == 'array') {
                            each(v, function(event_name, fn_event) {
                                if (tof(fn_event) == 'function') {
                                    this.add_event_listener(event_name, fn_event);
                                }
                            });
                        } else if (tof(v) == 'function') {
                            this.add_event_listener(event_name, v);
                        }
                    });
                }

                var spec_reserved = ['parent', 'event_bindings', 'load_array'];
                var map_spec_reserved = get_truth_map_from_arr(spec_reserved);

                // Don't give the constraint as just the spec!
                //  It's not a good idea. Specify it separately.
                //  Spec can just be the data, it looks like?

                //var o_constraint = {};
                /*
                 each(spec, function(i, v) {
                 if (!map_spec_reserved[i]) {
                 //
                 o_constraint[i] = v;
                 }
                 })
                 */
                if (spec.constraint) that.constraint(spec.constraint);
                // then go through the spec, ignoring the reserved ones, and treat those items as field constraits / field constraint definitions.
                // and _parent?
                // but get(parent) could be really useful.
                // Could be very useful with controls, having this parent
                // structure.
                // Could be useful in bubbling events in controls too.

                // But not just one potential parent.
                // The data object can appear in more than one collection.
                //  Will use 'relationships', where there can be more than one 'parent'
                //  Will have things indexed for faster access.
                // what if the spec is a collection of string keys (representing fields) and string values representing the constraints?

                // parent could be reserved / ignored as a field.
                //  could check an object to see if it's a field definition type.
                //  could be a string. could be an array of the right form.
                //  Field definitions could be a bit tricky - it may actually create such a field definition object if it needs to do so.

                if (is_defined(spec.parent)) {
                    this.set('parent', spec.parent);
                }
            }



            //var that = this;

            // These events seem to get called far too much.
            //  Need to look into the add_event_listener code for dealing with serving multiple pages.


            // only add it if it has a context?

            if (this._context) {
                this.init_default_events();
            }

            //if (spec.fields) {
            //	this.fields(spec.fields);
            //}




            // Want to do this after all initialization.
            //  After the whole init sequence has finished.




            //delete this._initializing;
            this._initializing = false;
        }

        //console.log('end Data_Object init');
    },

    'init_default_events': function() {

        /*
        var that = this;
        this.add_event_listener('add', function(e) {

            if (tof(e) == 'collection') {
                var stack = new Error().stack;
                console.log(stack);
                throw 'The event object should not be a collection.';
            }

            var parent = that.parent();
            if (parent) {
                parent.raise_event('add', e);
                //throw 'stop';
            }

        });

        this.add_event_listener('remove', function(e) {
            var change_e = {};
            each(e, function(i, v) {
                change_e[i] = v;
            });
            change_e.event_name = 'remove';
            that.raise_event('change', change_e);

            var parent = that.parent();
            if (parent) {
                parent.raise_event('remove', e);
                //throw 'stop';
            }
        })
        */


    },

    'data_def': fp(function(a, sig) {
        if (sig == '[o]') {
            // create the new data_def constraint.


        }
    }),

    'keys': function() {
        if (Object.keys) {
            return Object.keys(this._);
        } else {
            var res = [];
            each(this._, function(i, v) {
                res.push(i);
            });
            return res;
        }
    },

    'stringify': function() {
        var res = [];
        res.push('Data_Object(' + stringify(this._) + ')');
        return res.join('');
    },

    'toObject': function() {
        // need to go through each of them...
        var res = {};

        //console.log('this._ ' + stringify(this._));

        each(this._, function(i, v) {
            if (v.toObject) {
                //console.log('tof v ' + tof(v));
                res[i] = v.toObject();
            } else {
                res[i] = v;
            }
        })

        return res;
        //return this._;
    },

    // using_fields_connection()
    //  will search up the object heirachy, to see if the Data_Objects fields need to be connected through the use of functions.
    //  that will make the fields easy to change by calling a function. Should make things much faster to access than when programming with Backbone.
    // then will connect the fields with connect_fields()

    'using_fields_connection': function() {
        var res = false;
        iterate_ancestor_classes(this.constructor, function(a_class, stop) {
            if (is_defined(a_class._connect_fields)) {
                res = a_class._connect_fields;
                stop();
            }
        })
        return res;

    },

    'connect_fields': fp(function(a, sig) {
        //console.log('');
        //console.log('connect_fields sig' + sig);
        //console.log('a ' + stringify(a));

        var that = this;
        //throw '8) stop';

        if (a.l == 1 && tof(a[0]) == 'array') {
            var arr_fields = a[0];
            each(a[0], function(i, v) {
                that.connect_fields(v);
            });
        }

        if (sig == '[s]') {
            // connect that field by name
            // create the function

            // connect a singular field.

            /*
            this[a[0]] = fp(function(a2, sig) {

                //console.log('sig ' + sig);
                if (a2.l == 1) {
                    return that.set(a[0], a2[0]);
                } else if (a2.l == 0) {
                    return that.get(a[0]);
                }
            });
            */

            this[a[0]] = function(a1) {

                if (typeof a1 == 'undefined') {
                    // 0 params
                    return that.get(a[0]);
                } else {
                    // 1 param

                    return that.set(a[0], a1);
                }

                //console.log('sig ' + sig);
                //if (a2.l == 1) {
                //	return that.set(a[0], a2[0]);
                //} else if (a2.l == 0) {
                //	return that.get(a[0]);
                //}
            };



        }

        if (sig == '[o]') {

            throw('16) stop');
        }

    }),

    // does this get overwritten?

    // Various items need to have their parents set properly when starting.

    // fp working?

    // Duck type collection detect -- __type == 'collection'

    // Don't have the array of parents.

    // One parent and one index for the moment. That's what DOM nodes need.

    'parent': fp(function(a, sig) {
        var obj, index;
        //console.log('parent sig', sig);

				// And _parent should be set automatically when the controls are put in place.

        if (a.l == 0) {
					//console.log('this._parent', this._parent);
            return this._parent;
        }
        if (a.l == 1) {
            obj = a[0];

            if (!this._context && obj._context) {
                this._context = obj._context;
            }

            // IDs will only work within the context.



            // Another way of expressing this?

            // Can have a single parent, or multiple parents.
            //  May want something to be the only parent. Could have a different mode for multiple parents.

            //  this._parent = obj?


            //console.log('parent obj_id ' + obj_id);
            //throw 'stop'
            //console.log('obj ' + stringify(obj));
            // should maybe rename or subdivide _relationships.
            //  it will also be useful for databases.
            //  however, would need to work with the constraint system.
            //   likely that they would be syncronised through code.

            var relate_by_id = function(that) {
                var obj_id = obj._id();
                that._relationships[obj_id] = true;
            }

            var relate_by_ref = function(that) {
                that._parent = obj;
            }
            relate_by_ref(this);
        }
        if (a.l == 2) {
            obj = a[0];
            index = a[1];

            if (!this._context && obj._context) {
                this._context = obj._context;
            }

            this._parent = obj;
            this._index = index;
        }

        if (is_defined(index)) {
            // I think we just set the __index property.
            //  I think a __parent property and a __index property would do the job here.
            //  Suits DOM heirachy.
            // A __relationships property could make sense for wider things, however, it would be easy (for the moment?)
            // to just have .__parent and .__index
            //


            // Not sure all Data_Objects will need contexts.
            //  It's mainly useful for Controls so far




        } else {
            // get the object's id...

            // setting the parent... the parent may have a context.





        }
    }),

    /*
    'parent': function(a1, a2) {
        var ta1 = typeof a1, ta2 = typeof a2, tri, info;
        if (ta1 == 'undefined') {
            // 0 params

            // could call the simple get function here, but maybe we can have it inline and fast.
            var arr_parents = [];
            for (i in this._relationships) {
                info = this._relationships[i];
                tri = typeof info;
                if (tri == 'number') {

                } else if (tri.__type === 'collection') {
                    arr_parents.push(info);
                } else if (tri.__type === 'data_object') {
                    arr_parents.push(info);
                }
            }
            if (arr_parents.length == 1) {
                return arr_parents[0];
            } else if (arr_parents.length > 1) {
                return arr_parents;
            }

        } else if (ta2 == 'undefined') {
            // 1 param
            if (a1.__type == 'data_object') {
                if (a1._context) this._context = a1._context;
            }

        } else {
            // 2 params
            if (a1.__type == 'data_object' && typeof a2 == 'number') {
                var parent = a1;
                var p_id = parent._id();
                var position_in_array = a2;

                if (parent._context) this._context = parent._context;

                // it's the child saying it's got the attribution to the parent here

                // child knows what poisition it is within parent.

                this._parents = this._parents || {};

                this._parents[p_id] = [parent, position_in_array];
            }
        }
    },
    */

    '_fp_parent': fp(function(a, sig) {

        // Maybe detect if it's a Data_Object or Control relatively quickly here.
        //  Then perhaps call ._parent_Data_Object
        //   there would likely be some more optimized functions.

        // ._parent_get



        //console.log('parent sig ' + sig);
        //throw 'stop';
        if (a.l == 0) {
            // there could be just a single parent...
            //  if there is more they will be returned as an array.

            var arr_parents = [];

            // look at the _relationships.

            // _relationships will be used instead of .parent or ._parent
            //console.log('this._relationships ' + stringify(this._relationships));
            //console.log('this._parents ' + stringify(this._parents));

            //console.log('this ' + stringify(this));

            //var stack = new Error().stack
            //console.log(stack);
            //throw 'stop';

            // and each relationship record may indicate a parent
            //  does so with an integer, which is the index within that parent.
            //   will make for more efficient algorithms than jQuery's .index().
            var tri;
            each(this._relationships, function(relative_id, relationship_info) {
                tri = tof(relationship_info);

                console.log('relative_id ' + relative_id);

                if (tri == 'number') {
                    // Relationships will be changed and tested.

                    // it indicates a parent.
                    // perhaps we should also return the position within the parent?

                    // This needs changing / fixing.

                    throw 'Relationships system needs more work here. Had been using the map of all many objects, which has been removed for web server performance reasons.';

                    /*
                    var id_map = map_jsgui_ids;

                    if (this._context) {
                        id_map = this._context.map_objects;
                    }

                    arr_parents.push(id_map[relative_id]);
                    */


                } else {
                    //console.log('tri ' + tri);

                    if (tri == 'data_object' || tri == 'collection') {
                        arr_parents.push(relationship_info);
                    }
                    //console.log('relative_id ' + relative_id);
                    //console.log('map_jsgui_ids[relative_id] ' + map_jsgui_ids[relative_id]);
                    //throw 'stop';
                }

            });

            /*


            each(this._parents, function(i, v) {
                arr_parents.push(v);
            });
            */
            if (arr_parents.length == 1) {
                return arr_parents[0];
            } else if (arr_parents.length > 1) {
                return arr_parents;
            }

        } else {
            //if (sig == '')
            //throw '2) stop';
            // otherwise, may have been given a parent control.
            //  May make a test suite to test types and signatures.

            // the parent should be a Data_Object (which includes Control), as well as other things.
            //  I think that there will be a lot of power and flexibility in controls when they get used again using the Data_Object underpinnings.
            // It will also be possible to make much more condensed versions of the framework.
            //

            // Parents needs a significant amount more work...
            //  But needs to store the positions within parents.

            // set the parent - but may also need to know the position of the child.

            if (sig == '[D]') {
                var parent = a[0];

                //console.log('[D] parent io Data_Object ' + (parent instanceof Data_Object));
                //console.log('[D] parent io Collection ' + (parent instanceof Collection));

                if (parent._context) this._context = parent._context;

                // maybe better to just use ._parent.

                var use_parent_id = function() {


                    var p_id = parent._id();

                    // This could return the position within that parent?

                    // It may not have its position set - because if the parent is a Data_Object, then it does not have positions as such.
                    var tp = tof(parent);

                    if (tp == 'data_object') {
                        //this._parents = this._parents || {};
                        // but it's position may effectively be the field name...
                        //  may be worth having that.


                        //this._parents[p_id] = parent;

                        this._relationships = this._relationships || {};

                        this._relationships[p_id] = parent;

                    }

                    if (tp == 'collection') {
                        throw 'Required: position in array of item';
                    }

                }

                // an array of parents?
                //  or just set the parent? Multiple parents would help (in theory).
                var use_parent_ref = function() {
                    // will work on parent later on.


                }





            }

            // could be a collection and a number...

            if (sig == '[D,n]') {
                var parent = a[0];
                var p_id = parent._id();
                var position_in_array = a[1];

                if (parent._context) this._context = parent._context;

                // it's the child saying it's got the attribution to the parent here

                // child knows what poisition it is within parent.

                this._parents = this._parents || {};

                this._parents[p_id] = [parent, position_in_array];

                // parent keeps a list of all children?
                // parent can have children in different places, in different other collections.

                //console.log('position_in_array ' + position_in_array);

                //parent.children.


            }

            /*

            if (a.l == 1) {

                //console.log('sig ' + sig);
                //throw 'stop';

                // the signature could be D, a Data_Object.




                console.log('p_id ' + p_id);

                // parents dict of objects... not sure about using an actual collection here.
                //  could get too complicated unnecessarily.
                // Could try it later when data structures are more finished.

                this._parents = this._parents || {};

                this._parents[p_id] = parent;


            }
            */

        }
    }),

    '_id': function() {
        // gets the id.
        //console.log('Data_Object _id this._context ' + this._context);

        // Should get the context at an early stage if possible.
        //  Need to have it as the item is added, I think.
        if (this.__id) return this.__id;

        if (this._context) {
            //console.log('this.__type ' + this.__type);

            // __type will be control?
            // __data_type as control.
            //  that's the overriding type, there are a few of them
            // __type could be the more specific type such as radio_button.

            //console.log('this._context.new_id ' + this._context.new_id);

            this.__id = this._context.new_id(this.__type_name || this.__type);

            //console.log('__id ' + this.__id);
            //throw '!stop';
        } else {
            if (this._abstract) {
                return undefined;
            } else if (!is_defined(this.__id)) {

                // What does not have the abstract?

                //var stack = new Error().stack;
                //console.log(stack);

                // no such function... but there should be something declared in many situations.
                console.trace("Here I am!")
                throw 'stop, currently unsupported.';
                this.__id = new_data_object_id();

                console.log('!!! no context __id ' + this.__id);
            }
        }
        return this.__id;
    },

    'fields': fp(function(a, sig) {

        //.fields() may be better suited to getting info about the fields, rather than all of the fields' info.
        //  Making the APIs return relatively simple data is a step to take.
        //  Keeping the functionality but simplifying the APIs.
        //   Sometimes more complicated API calles will be made, but they will take more parameters that shows the coder expects to get
        //   more complicated results back.




        // field names
        // field names and values
        // field names and types
        // field names, types and values

        // I think field names and types is a neat amount of data that will help with debugging.
        //  Can it return an object which has a .values() function?

        //  Check in the fields collection, for the fields' metadata, or could check the fields definition?
        //  Want to be able to tell what Control Fields a Control has, for example.
        // It would be good to have simply named functions return data that's not all that complicated and can be debugged easily, where possible.

        // Can have a different mechanism for getting all fields' values.

        // Also, getting the field objects themselves, they have associated constraints.








        // an easier interface to the fields than fields and constraints.
        //  this may be immutable when it is held in a collection - not sure.
        //  may not want to keep creating new copies of field sets and constraints for use in individual Data_Objects.

        // The individual Data_Objects will need to have their own constraints, to begin with.

        // we may have been given the chained fields here.
        //


        //console.log('***** fields sig ' + sig);

        // Should have had fields set already.
        //  The Data_Object constructor should find out what fields are part of it.
        //  Not sure how easy that is to do from that level... there needs to be a way.

        //

        var that = this;

        if (a.l == 0) {

            // Will be keeping track of the fields internally.
            //  They get stored in an array, so that the order gets maintained.

            /*

            //console.log('fields this._map_field_constraints ' + stringify(this._map_field_constraints));

            var res = [];

            each(this._map_field_constraints, function(field_name, v) {
                //console.log('field_name ' + field_name);
                //console.log('v ' + stringify(v));

                // then for each constraint, get an info object from it.
                // v.to_obj_info
                // v.to_info_obj

                each(v, function(i2, constraint_for_field) {

                    // May also be saying it's a primary key field
                    //  Need more work on setting fields


                    if (constraint_for_field instanceof Constraint.Field_Data_Type) {
                        var field_constraint_info_obj = constraint_for_field.to_info_obj();
                        //console.log('field_constraint_info_obj ' + stringify(field_constraint_info_obj));

                        // find out if the field is read-only.

                        var flags = [];
                        if (that._map_read_only && that._map_read_only[field_name]) {
                            flags.push('read_only');
                        }
                        if (flags.length == 0) {
                            res.push([field_name, field_constraint_info_obj]);
                        } else {
                            res.push([field_name, field_constraint_info_obj, flags]);
                        }
                    }
                });
            });

            return res;
            */

            // an index of the position of a field within the array? Would that be useful?
            //  means some encapsulation may be worthwhile here

            // have a look at the fc (fields_collection)

            var fields_collection = this.fc;
            //console.log('fields_collection ' + fields_collection);

            // not just the field values.
            var res;


            if (fields_collection) {
                res = fields_collection.okvs.values();
            } else {
                res = [];
            }

            return res;


            //return this._arr_fields || [];
            // can get a position map relatively quickly from the array of fields.
            //  can be done after any adjustment on the fields is done.
            // this._field_positions_by_name
            //  or a linked list of fields? That could work for preserving order, iterating, insertion, deletion,


        }

        if (sig == '[s]') {
            // get a single field.

            // get the field from the field_collection.

            var fc = this.fc;
            //console.log('** fc ' + fc);
            var res = fc.get(a[0]);
            //console.log('res ' + stringify(res));
            return res;

        }

        //var that = this;
        if (sig == '[o]') {
            // when giving it the chained fields, need to process them right.
            //  may be best to clone them.

            //console.log('a[0] ' + stringify(a[0]));

            // better to ensure the fields in order...

            //  can set each field individually.

            // Setting a field with a value...
            //  The field type could be a bit more complex.
            //  Need to be careful about using JSON or JS object input to set a field - it may need to be instantiated from that input.





            each(a[0], function(i, v) {
                //console.log('i ' + stringify(i));
                //console.log('v ' + stringify(v));

                // it's using the new set_field in Collection.
                that.set_field(i, v);
                // for setting an existing field...
                //  see if the field exists (search the fields object or other lookup)
                //   if it exists, modify the existing one - complicated when other things depend on this.
                //    the constraints and indexes will also depend on the fields, so a modification in a field can result in the removal of a constraint or index.
                //     removal of a field could necessitate the removal of a constraint or index.
                //      remove_constraints_for_field
                //      remove_indexes_for_field

                // Don't want to remove multi-field constraints when replacing one field - but do want that when properly removing a field.
                //  I guess this will just take a bit more coding and testing to get the desired behaviors.
                // Really want to be using fields as a convenitent interface for constraints.
                //  They will encompass a few things involving them.
            }, that);
        }

    }),

    'constraints': fp(function(a, sig) {
        // or constraints... if given multiple ones.
        //   I think constraints may be the better name here.
        //   Will accept the singular as well.





        //console.log('Data_Object constraint sig ' + sig);

        // was 'fields'

        // as constraints, a Data_Object can also be a Collection, so these will need to apply to collections as well.

        // collections won't have fields though, so Field_Constraints won't apply to them, and collections won't accept them as constraints.


        // field constraints...

        // may be given the field constraints

        if (a.l == 0) {

            // want to get all the constraints.


        }

        // Field rather than column.


        // Collections will have other sorts of constraints, such as table constraints.
        //  Nice to be able to have collections have constraints defined in terms of other collections.


        // Foreign_Key_Constraint is a table constraint
        // Unique is as well... it does not check individual fields, depends on the whole table.
        //  Fine to ingore the fact that SQL can recognise them as column constraints here, we are not dealing with columns,
        //  but fields. Fields won't say they are constrained to unique values... collections will say they constrain fields to unique values.
        //   Would be more memory efficient.


        // the signature... could be a field_constraint?
        // could be a collection_constraint?
        //  that may be worth putting into the signatures, with fc and cc
        //   or FC and CC
        // that's how they get brought into the system at quite a low level, with the flexibility making the code clearer here.


        // function wanted to get and set the fields as well...

        /// it looks like there are field constraints in use here.
        //  the fields will be an object / array with the fields.



        if (sig == '[o]') {
            // setting the field constraints.

            // May have a closer look at those objects.

            // overwrite existing ones.
            var field_constraints = a[0];
            this._field_constraints = field_constraints;


            // does it match the current field constraints?
            //  if not, throw an error.



        }


        // string, ?
        //  it would try to process the ? as a field_constraint for that field
        //  if it already is a field_constraint, then great
        //  if it is an array or a string (possibly other object) it will parse / interpret that as a field_constraint object

        // Making the system of specifying constraints easy, while still providing the full database-like model,
        //  is an interesting challenge. It should make for a nice tool on the front-end that can create code that gets transformed
        //  into the DB code and allows access to it without too much difficulty.

        // This system, in JavaScript, will be able to bind to databases relatively easily.
        //  Should provide the coder with easy access to data in various databases.
        //  This whole constraints and data types system will have wide application to a lot of data available on the internet,
        //   and will be useful for publishing data too.

        // Looking forward to making a resources system that makes it relatively easy to access data that is stored somewhere with an easy API.
        //  May be interesting to open-source some of this technology. May be best to open-source all of it?
        //  I think open sourcing a precise, fairly compact build of it would be nice.
        //   Worth thinking in terms of possible extensions.

        // The system to do with finding and defining metadata, and matching that with data scraped from websites or from web resources...
        //  Not sure about open sourcing some of the core indexing stuff quite yet. Possibly in the future.

        // But my website could make metadata available.
        //  There could be some open-sourced code to do with the core things, I'm sure.

        // Perhaps connecting to various resources.
        //  Hosting data perhaps, identifying it to the index.

        // Perhaps people running hosting software I have written will connect to the central system, also could use the Resources system
        //  to obtain data from elsewhere for their own use, while publishing it with MetaBench indexing systems, APIs and semantics.


        if (a.l == 2 && tof(a[0]) == 'string') {




        }



        // may be returning the field constraints



    }),

    'matches_field_constraint': fp(function(a, sig) {
        // there may be more than one constraint for that field.

        //console.log('matches_field_constraint sig ' + sig);
        //console.log('matches_field_constraint a ' + stringify(a));


        if (sig == '[s,s]') {
            var field_name = a[0];

            // the constraint as just one item.
            //  there could be multiple fields constraints for that item.

            if (tof(a[1]) == 'string') {
                var str_constraint = a[1];

                // then use the constraint module to test these.

                var field_val = this.get(field_name);
                return obj_matches_constraint(field_val, str_constraint);
            }

            if (tof(a[1]) == 'array') {
                throw 'Multiple constraints not yet implemented here';
            }



        }

        //throw('stop')

        // given as string


        //


    }),

    'obj_matches_field_constraints': function(obj) {
        //console.log('matches_field_constraints ');
        var that = this;
        // iterate through the field constraints
        var matches = true;

        // don't check it against the _field_constraints?
        //  get the_field_constraints?
        //  have the .fc (field collection) interacting with the field constraints?
        //   have the fields_collection system store the field constraints?
        //  possibly not, because some constraints will be outside of individual fields.

        // perhaps have _unique_constraints_collection / index that keeps track of the unique constraints.

        // they are different to the field constraints. for the moment they can just be an index.
        //  could maybe have them like flags.

        //  they can be added, removed, they will be indexed for sat retrieval and checking.

        // indexes... another index index? these indicate how things get indexed within the collection, rather than being the indexes themselves.

        // field_index_schema?
        //






        each(this._field_constraints, function(i, v) {
            // does it match?

            matches = matches && obj.matches_field_constraint(i, v)

        })
        return matches;
        //throw('stop');

    },

    // Maybe fields and field constraint heavy lifting should be done elsewhere?
    //  But Data_Object will be right in the core really.

    // I doubt the core will be all that large in terms of file size.
    //  A lot of size savings will be made, and it will be very small and efficient compared to many other systems.
    //  Combining different things into one file would be another days work.

    // I could also do some more work on building up the JavaScript code and evaluating it.
    //  That could save a lot of space with an efficient compression mechanism.


    // Setting a whole bunch of fields, or even a field, may be better done in a collection, because some of the field has to do with how a collection handles it...
    //  indexing it,


    /*
    'fields': fp(function(a, sig) {
        if (sig == '[o]') {
            // overwrite all fields.

            // will use the set_field to set the individual fields?

        }

        //console.log('Collection fields sig ' + sig);


    }),
    */
    // The field constraints, and data_type system is getting quite large and a bit fragmented.
    //  Hopefully it will be closer integrated into the core, and tested with some relatively simple examples to show that it works
    //  and what results to expect.

    // The constraints about what objects can be will go a long way towards the goal of specifiying things in JavaScript that
    //  will work on many systems eventually. These mechanisms will be useful in GUIs, so it will help that they are built into the core of the framework.

    // At the moment I am putting quite a lot in, having spent some time considering what will be needed next.
    //  A later stage will be refactoring things. That may come when it is running in a browser and I see how much it is using.
    //  It may be done after some more code analysys, perhaps enabled by JavaScript parsing and storing the code on the system ready for use
    //   and analysis

    // set_field for the Data_Object... the field is a constraint to do with the type, it could also be that an index is set up for that field.

    //  want read-only fields to operate on the class level as well.
    //  I think the map is useful, I'm not so sure that they are constraints anyway.
    //  Field properties... then can have a field property map or field property index.


    'read_only': arrayify(fp(function(a, sig) {
        var mro = this._map_read_only = this._map_read_only || {};

        var field_name = a[0];

        if (sig == '[s]') {
            // a field name to make read-only
            mro[field_name] = true;
        }
        if (sig == '[s,b]') {
            // a field name to make read-only, boolean value can be false

            var bool_is_read_only = a[1];
            if (bool_is_read_only) {
                return this.read_only(field_name);
            } else {
                //delete mro[field_name];
                mro[field_name] = null;
            }
        }
        // array... process them?
        //  could arrayify the whole function.
    })),

    'set_field': fp(function(a, sig) {

        // This will be overhauled...
        //   It will need to efficiently see if an existing field is there.

        // If it is there, it will update the field. That may then mean that constraints need to get updated as well..
        //  would mean removing some existing ones perhaps?
        // But it would check what constraints are then needed for that field and remove the extraneous ones.
        //  Same with single-field indexes.

        // When adding the field, would also need to update the constraints.
        //  Could have the constraint system respond to field changes, maybe be the first listener.
        //   using this.ensure_field_constraint(field_name, field_info);?


        this.fc = this.fc || new Fields_Collection();

        return this.fc.set.apply(this.fc, a);

        // although it has been added, we need to set the parent...
        //  maybe fc can do this?

        //console.log('set_field sig ' + sig);
        //console.log('set_field a ' + stringify(a));

        // [s,[f]]
        //  data type is defined by a constructor within an array
        //   means a collection of that type.

        // sets a data type constraint on that field
        /*
        if (sig == '[s,[f]]') {

            throw '10) Stop';
        }
        */
        // Collection has something that overrides this.
        /*
        if (sig == '[s,s]') {
            // will need to interpret the second part
            var field_name = a[0];
            var field_text = a[1];

            //console.log('field_text ' + field_text);
            // parse the fiex text. it may have some things to do with constraints that apply to the collection, if it is in a collection.
            //  not so sure about saving these here. They could be saved so that they get put into a collection fine with other unique fields...
            // but then we'll be taking more care specifying things in the collection if necessary.

            var field_info = input_processors['field_text'](field_text);

            //console.log('field_info ' + stringify(field_info));

            // then ensure the constraint(s) corresponding to the field, where possible.
            //  not able to put uniqueness constraint in place here, yet. It's really dealt with and enforced by the Collection class.

            // I think the library core is getting pretty big now, it could still do with more for HTML, CSS processing.
            //  The database side of things will be expanded, it will be good to have code using very nice syntax provided by the library.

            this.ensure_field_constraint(field_name, field_info);

            if (field_info.read_only) {
                this.read_only(field_name);
            }

            // Just need to do quite a lot more...
            //  Quite a bit more needed for the objects to work like they should, then I'll be using those objects for the HTML components, and also for the
            //  database layer.

            // Persisting to that DB layer seems like a really useful stage, not sure about open-sourcing that code.
            //  May be best to... may be better that my ORM is used. I'd still have the powerful web app too?
            //   Could have different licensing for that component... commercial deployments cost money?
            //    But then want to have things distributed nice and easily. Perhaps could have different options for this. With the website running out-of-the-box,
            //     could directly go to the Mongo layer.
            // Would be very nice to have open-source code producing everything that's needed. Could get quite a lot of interest.
            //  Maybe will keep that on my server for the moment, or in the client-side applications people use.
            // Will be fine without OSing all the ORM, but a relatively simple Mongo layer would work fine.
            //  It may be more what people want, and would get developer interest. The ORM would be useful for accessing legacy systems? SQL can be very useful in its
            //   own right, but could be harder to use effectively in this case.


            // does it have the not_null constraint?
            //  each field can have more than one constraint.
            //  not sure about a collection of constraints though.
            //   perhaps a simpler collection would be very useful in implementing some of the more advanced things.
            //  array of constraints for each field will do for the moment.

            // can be both a Not_Null constraint and a data type constrint.
            // easy then to create the field with this information.

            //  find out if there is an existing field (constraint).
            //  find out about existing indexes for that field, create one if needed
            //  find out about existing constraints, such as not_null
            //   perhaps not_null can be a value constraint - but it's something that translates readily into the database system.

            // this will be for setting single field indexes.

            // Other indexes could be defined with multiple fields.

            // Will be useful for iterating through a collection, getting the values that match two given values.

        }
        */

    }),


    // unique, not_null being the field constraints in action.

    //  unique could apply to multiple fields at once. Would need the index with those two fields looking for collisions.

    // constraints: {
    //	'unique': ['school_district', 'district_school_id']
    //}

    // will also try to get a field constraint, based on the field.
    //  but may also do it based on type, maybe get_field_data_type_constraint

    'set_field_data_type_constraint': function(field_name, data_type_constructor) {
        // these dtcs are separate to the fields themselves.

        // May be better using the Field_Collection here.

        var fmc = this._map_field_constraints = this._map_field_constraints || {};
        var fmfc = fmc[field_name];
        if (fmfc) {
            var deletion_index;
            each(fmfc, function(i, v) {
                // if it is a Field_Data_Type_Constraint
                if (v instanceof Constraint.Field_Data_Type) {
                    //return v;
                    //
                    if (v.data_type_constructor === data_type_constructor) {

                    } else {
                        // replace that one.
                        deletion_index = i;
                    }
                }
            })

            if (is_defined(deletion_index)) {
                fmfc.splice(deletion_index, 1);

                // create the new constraint object.
            }
        }
    },

    'get_field_data_type_constraint': function(field_name) {
        var fmc = this._map_field_constraints;
        // field_constraints - they are constraints that apply to the fields. They are not the list of fields.
        var result = undefined;
        //
        if (fmc) {
            var fmfc = fmc[field_name];
            if (fmfc) {
                each(fmfc, function (i, v) {
                    // if it is a Field_Data_Type_Constraint
                    if (v instanceof Constraint.Field_Data_Type) {
                        result = v;
                        return v;
                    }
                });
            }
        }
        return result;
    },


    //

    // ensure_constraint_from_field
    // ensure_constraints_from_field
    //  can have a not null constraint, can have a data type constraint.
    //  can be given the whole [field_name, [str_field, obj_field_info]]
    // possibly not_null constraint would be part of data type constraint?
    //  easier to have separate not null constraint.

    // once we have the field, there are some possible constraints.
    //  could have them indexed... an obj saying not_null, with link to constraint if it is there.
    //  _map_field_constraints...
    //  _map_field_constraints[field_name][constraint_type_name]
    //  _map_field_constraints[field_name]['multi_field']
    //   and then there is a list of all the constraints that have got the field mentioned...

    // some of these things could be done with a quick search.


    //   when we have the field name, we can refer to all its constraints from this.

    // and then there should be the (KVS) map of unique constraints ordered by alphabetic fields...
    //  also storing when a field is mentioned in a constraint, but it's not the only field?
    //   when deleting a field we'll need to get all constraints that a field is involved in.

    //



    //  can also be given [field_name, str_field], can calculate the constraint object.
    //   may at times be given the obj_field_info and need to make the text representation



    'ensure_field_constraint': fp(function(a, sig) {

        // this would also have to interact with the field object if necessary, keeping things in sync.

        // will have different field_constraint maps.
        // or a map of the fields to the constriaint types.
        //


        // (fc_map[field_name]['unique'])
        // fc_map[field_name]['data_type']
        // fc_map[field_name]['not_null']



        //  ensures a single constraint?
        // [s,s] can parse the field text

        if (sig == '[s,o]') {
            var field_name = a[0];
            var field_info = a[1];

            // Different constraints that can apply to the field... but likely to be a data_type constraint really.



            // can ensure not null and data type

            // OK... looks like the field_constraints will need to be organized somehow.
            //  They are another thing that perhaps a simple indexing system would help with.
            // Will be organizing them using the native JavaScript objects.

            // Having an array of field_constraints makes sense, so that the order is maintained.

            // array of field constraints.
            // map of field constraints.

            //this._arr_field_constraints = this._arr_field_constraints || [];

            //  not so sure about this array of constraints again.
            //  perhaps only keeping them in the map is enough.

            // field constraints_by_field
            // _map_field_constraints... this will hold the constraints by field.
            //  there may not be more than one constraint for a particular field, there may be a map of such constraints.

            // so it's organized by field here... easier to get the existing field constraints, overwrite them, or create a new one,
            //  or to look it up.

            //console.log('field_info ' + stringify(field_info));
            //console.log('a ' + stringify(a));

            // Will _map_field_constraints be in the Field_Collection?

            this._map_field_constraints = this._map_field_constraints || {};
            this._map_field_constraints[field_name] = this._map_field_constraints[field_name] || [];
            // don't want an array of constraints there...
            //  there are not many constraints that can be there, such as data_type, not_null

            // The constraints only apply to fields individually
            //  There can be collection constraints that apply, they can be specified, and they get applied to the relevant collection.




            var fc_item_arr = this._map_field_constraints[field_name];
            // Have the fields referencing their constraints.
            //  Also have a map / sorted KVS of constraints by the fields they are for, different ways they need to be looked up
            //   alhabetically sorted list of unique fields kept in a KVS
            //    no such thing as a unique index - only unique constraint.
            //   a single field can be unique (have a unique constraint)
            //   a unique constraint can apply to multiple fields.

            // map of fields objects by name
            //  as well as array of fields
            //   the Fields object - perhaps it should be defined as its own class.
            //    It would make sense.
            // A unique constraint does not really apply to the field, but more to the collection, with reference to the field.
            //  It's still information that should get stored alongside the field.


            // looking for an existing constraint already.
            //  the whole sytem can be improved.
            // I think having an actual ._fields object would help.
            //  It would be an array (or simpler collection?)
            //   A simple collection could be quite nice if it has B+ indexing capability.
            //    But the whole thing has got a bit complicated anyway with Data_Object.
            // Just an array would do fine for the moment.
            //  Want to be sure of maintaining the order.
            //   _map_fields goes to the field by name.

            // The field will reference both indexes and constraints.
            //  Indexes and constraints will refer to particular fields, often by name.

            // Don't want complicated data types to do with fields.
            //  There is a _fields object.
            //  _arr_fields
            //  kvs_fields? it stores the fields by name in a kvs. also for multi-field constraints and indexes?

            // Doing the individual fields, and also the multiple fields when they are applied together.





            // That is a fairly major change for the data_object.
            //  Will not have the constraint map just as it is.
            //  There will be the index for multi-field constraints, but just a simple array for the fields.
            //  _map_field_constraints[field1_name][field2_name][array of constraints applying to that field combination]

            // I think the B+ KVS will be better for storing the constraints by their fields.
            //



            var dt_info = field_info.data_type;

            var new_dt_constraint = Constraint.from_obj(dt_info);
            //console.log('new_dt_constraint ' + stringify(new_dt_constraint));

            if (!is_defined(new_dt_constraint)) {
                //throw '9) New constraint from_obj not profucing constraint';
            } else {



                var dt_constraint;
                //console.log('fc_item_arr ' + stringify(fc_item_arr));
                if (fc_item_arr.length > 0) {
                    // go through the array updating relevant constraints.
                    // really looking for the data_type constraint.

                    var dt_constraints = [];
                    //console.log('fc_item_arr ' + stringify(fc_item_arr));
                    // should only be one in there at maximum
                    each(fc_item_arr, function(i, constraint_item) {
                        //console.log('constraint_item ' + stringify(constraint_item));

                        if (constraint_item instanceof Constraint.Field_Data_Type) {
                            //console.log('constraint_item ' + stringify(constraint_item));

                            var constraint_info = constraint_item.to_info_obj();
                            //console.log('constraint_info ' + stringify(constraint_info));
                            //console.log('field_info ' + stringify(field_info));

                            var stack = new Error().stack
                            //console.log( stack )

                            throw ('6) it is! stop, check to see if it is a Field_Data_Type_Constraint, use instanceOf')


                        }



                        // I think delete any existing dt constraints?
                        //  Do nothing if the constraints match...
                        //  Will likely have events to do with adding and removing constraints.




                    })

                    // check existing constraint against values given. possibly change it, possibly replace it.




                } else {

                    fc_item_arr.push(new_dt_constraint);
                }



            }

            //throw('7) stop');



            // if there is nothing there, create it.

            // if it's there, overwrite any constraints with the relevant one from the field info we were given.



            //console.log('this._arr_field_constraints ' + stringify(this._arr_field_constraints));
            //throw('5 stop');
        }

    }),

    'matches_field_constraints': fp(function(a, sig) {
        if (a.l == 0) {
            return this.matches_field_constraints(this._field_constraints);
        }

        // comparing an object with its field constraints... that could be outside this.

        // check_field_constraints
        //  does the check and says where it fails

        // matches_field_constraints
        //  stops when it fails, returns false

        // does a Data_Object match constraints?

        // may want to check if a Data_Object that gets provided matches the field constraints stored in this Data_Object.
        //  One Data_Object can be used as reference for doing checks.
        //   The Data_Objects that get put in don't have the checks as part of them, but they may have checks done on them before they have
        //   completed updating. This could be used to indicate an error to the user in the GUI.

        // This really won't be so hard to do, and to get right.
        //  Hopefully all these things would be able to be used for various packages.
        // I think declarative writing of much of it, so that a LMS could be set up, or something for social services that
        //  deal with information about individuals, workflows, and reporting (helping produce the required documents and keep
        //  users of the system informed)

        //console.log('matches_field_constraints sig ' + sig);

        if (sig == '[D]') {
            // Does that Data_Object match the constraints of this one?

            var fcs = this._field_constraints;

            //console.log('fcs ' + stringify(fcs));

            var obj = a[0];

            var all_match = true, obj_field_value, matches;

            each(fcs, function(field_name, constraint) {
                // these constraints could potentially be something quite complicated and nested.

                // We would need to be careful about that.
                // Will use this for specifying HTML controls, being sure they are output in a standard format.

                obj_field_value = obj.get(field_name);
                //console.log('obj_field_value ' + obj_field_value);

                //console.log('constraint ' + constraint);

                matches = obj_matches_constraint(obj_field_value, constraint);

                all_match = all_match && matches;
                //if (!matches) return false;
                // returning false from the main loop?
                //  breaking out of my each loop... both these things will need to be looked into.

                // each could be used to build a result... but do want break conditions.

                //check_value_against_constraint

                // a function to check against the constraints.
                //  this is to do with things no longer to do with Data_Object, should be in lang-essentials
                //  possibly worth making an intermediate level.
                // It's going outside of the essentials, but it still is pretty important
                // Maybe have core, which includes essentials and validation, or valid_data
                //  Could have a constraints module.
                //   This would be working in a nested way, the constraints could be nested.

                // Constraints would be defined as objects.
                //  They would often be specified as text, such as 'int'.
                //  They could be specified to be an array, like [['red', 'int'], ['green', 'int'], ['blue', 'int']]
                //  Having a constraint object would help to store maps that are generated to help with that constraint.
                //  They would also act as indexes for some arrays, helping with the JavaScript implementation.

                //  valid_data may be a good name because it will potentially have some more data handling facilities, such as dealing with
                //  nested data. I may be moving functionality out of Nested and putting it somewhere simpler, maybe I'll be better able to express it
                //  with recursive functions.
                // Will be dealing with data types at different levels.
                //  Could be more systematic about maps that express positions of items in arrays.

                // I think that side of things, tidying it up a lot, will help with getting these things running correctly in a web server.


            });

            // Will be faster to break out of each loop.

            return all_match;
        }



        if (sig == '[o]') {

            // may want to test if an object matches the field constraints.

            // obejct representing the constraints...
            //  seeing if this Data_Object meets those constraints.

            // these constraints are given as a field.





            // an object representing those constraints.
            //  not using a Data_Object for this yet.

            // find out which are the current keys (get a truth map of them)

            // see if all of the current ones adhere to the given constraints

            // see if all of the given constraints have been met
            //  could have a map of the given constraints, and delete them from that map as they have been met
            //  then go through the map using each to see which ones have not been met.

            // May use some code to do with data types.
            //  With the HTML processing, will be taking in data with fewer constraints, and transforming it so it matches what is required.

            // I think there will be a fair bit more coding to get the HTML system fully running with the newer Data_Object abstraction,
            //  and data types and transformations specified in terms of the data type, meaning that the code will be more concise and declarative
            // Some quite complex things to do with indexing and data transformation get done elsewhere, for example.

            // I am expecting to get this to work fairly soon, I have made a lot of progress recently.
            // Having the code executing and producing a website will be very nice.
            //  Would be good to get a portfolio online, but very good indeed if it loads quickly, has a nice menu, and just generally is my
            //  professional / business website.

            // It does seem like a real business priority to get this site up online.
            //  It could be very useful for customers, maybe if I am doing front-end development work, can show something and get comments rapidly
            //   within my system.

            // Anyway, need to get this matching the field constraints here.

            /*
            var field_constraints = a[0];


            // check for matching a single constraint



            each(field_constraints, function(i, v) {
                console.log('field_constraints i ' + i);
                console.log('field_constraints v ' + stringify(v));

            });
            */

            return data_object_matches_field_constraints(this, a[0]);

        }


    }),


    // requires is different to accepts.

    // requirements may be needed to do something.
    // accepts is about setting data on it.
    //  could say (or assume) that the fields are required. They could be required in order to persist it to some location.
    // Perhaps only some fields are required, or their reuqirement is met when they are null or undefined.

    //  Saying a field is required is equivalent to saying it is 'not null'.
    //   Fields will possibly not meet this constraint just as the object has been created... but it may be that the object must get created with the necessary
    //   data. It will be possible, though, to have the Data_Object, not containing any data. Maybe it will be considered empty, or dataless
    //   dataless may be better as it does not imply the opposite of 'full'.




    '____requires': fp(function(a, spec) {

        // Leaving this for the moment, developing field constraints.


        // sets items in this object's schema
        //  this could set items in an item-level rather than class-level schema.
        //   there could be two schemas - the one it starts with, and those that override the default schema.
        //   That avoids copying lots of the default schema items, making controls start more quickly and will use less memory.
        //    Less reduntant information being stored.

        // base_schema (this could be set by a string name, referring to jsgui.schemas).
        // overrides_schema (object_schema may be a better name).

        // 'requires' would be setting something on the overrides_schema (or object_schema)

        // object_schema
        // object_type_schema
        // object_base_schema
        // object_schema_additions

        // base_schema
        // schema_additions
        // additional_schema
        // object_schema

        // base_schema
        // object_schema

        // types will be namespaced more
        //  there is the type system of the JavaScript code here
        //  there is an internal type system for arbitrary namespaced objects... they will follow the names of objects here.

        //



        // schemas applied to properties
        //  done so that the checking stage can see that requirments are met.

        // It may be worth putting this in a 'schema' for the object, rather than at this stage.

        // Setting schemas for sub-objects, and setting schemas for the objects themselves makes a lot of sense.
        //  Perhaps the schemas for the sub-objects should be set through the schema for the object itself.

        // this, I think, will be setting a particular item on the object_schema.
        // the object_schema could simple be a data_type_name.
        //  this will tie into jsgui.data_type_name
        // Likely to make the nested system clearer and more compact, and incorporate it into the main part.
        //  I think I'll get things running in a fairly compact way that would enable things to run really well on a mobile device.
        //   Could have significantly advanced programming around the 12KB mark, would have things really optimized, but it needs to get a bit complicated in
        //   order to implement such functionality. A lot can be done in that relatively small size, and more still can be done using that code for the mobile application.

        // Putting the requirement information into the object_schema makes sense
        //  May be similar to using a data_type_name?
        //   or schema_name?

        // schema_name may make more sense.
        // possibly also have a group / collection of schemas.
        //  not sure about collection because these schemas will be used for implementing things to do with the collection.
        //  could have an application-wide dictionary of schemas.
        //  some of these will have to do with HTML, for example.

        // It makes sense to use a schema system in various places where it is appropriate, and call it a schema.
        //  Should be compatable where possible with the object definitions and access, such as indexed_array
        //  Called the jsgui-schema standard I think.
        // I may make some separate components that work using this standard. They could be reference implementations of some things.
        //  Checking that an object's properties conform to the schema
        //   Should make it possible to easily get the schema tester to know how the object's properties are done, such as on Data_Object using get and set
        //   functions.

        // Will also be able to say something requires an object with a particular interface.
        //  Data_Objects will have an 'interfaces' property (private property)
        //   this will help them tell whether the object that is connected has the right interface(s)

        // Objects can have more than one interface.
        //  This is akin to c#. In this case, we don't care about how inheritance is done on the object (it can be done in different ways to c#), but we are saying that the object
        //  conforms to a particulat interface, ie has various properities.
        //   In some cases those properties must be set.

        // Will also be able to specify functions in interfaces (and object_schemas I think), so that it can be run through tests.

        // Interfaces: an interface is a named conformance to either a specified or named schema.

        // jsgui.data_types -> jsgui.schemas

        // These schemas will be usable in form validation, creating HTML forms, processing them, and dealing with objects in databases, perhaps with generated CRUD.
        //  They will be simple to specify.
        //  There will sometime be a GUI tool for specifying schemas.
        //   They won't be too complicated - but they could be used for describing some real-work objects.



        // tell it what to look for with that property.

        // There may be some more complicated cases.
        //  Could be referring to multiple required objects for one property name.
        //  They could be in a collection, or an array.

        // can add an object to the requirements.
        //  checks that the item is there?

        // checks that the item conforms.
        //  possibly to an object_schema.
        // the object_schema system could be used for data types elsewhere - not sure about this. It sounds OK though.

        // elsewhere, whe check if an object conforms to a set type.

        // maybe object_schema should be the same system, or the other system could change over to using an object_schema, to make things clearer.
        //  I think the object_schema abstraction would help a bit.

        // will be making use of jsgui.data_types_info

        // string and an object
        //  the string is the name of the property within this object
        //  the object is the schema for that property.



        // Requirements will be sealt with through the constraints system.
        //  Perhaps it is an assumption that it is required the constraints are satisfied.

        //  A requirements system may operate for resources... not so sure about having requirements in the Data_Object as that seems like it can be
        //   handled by fields and constraints.


        if (a.l == 0) {
            // return the requirements.

            return this._requirements;

        }



    }),


    // meets_requitements, was check_requirements?

    // meets returns a boolean, check returns a report saying where it failed.

    // A resource may require another resource to have started in order to start.
    //  Now working on the code execution path for the MetaBench hosting (expandable) server to be run.
    //  Will host the website as a Resource before long.
    //  Will also be interacting with DBs using a resource API.

    // There is quite a bit of general structure, and lots of scope for specifics to be built.
    //  Do want to get my website hosted.
    //  A few components could display things quite nicely.

    // Will have a demo section showing front-end components.
    //  May have an e-learning section

    // Mobile development
    //


    // Will use field constraints for the moment
    //  Requirements may make an appearance in resources, ie saying that a resource requires another resource (to have started) before it can start.
    '_____meets_requirements': fp(function(a, sig) {

        // Possibly check field constraints, but these would have probably been checked on input or on setting the constraints.

        var requirements = this._requirements;
        if (!requirements) {
            return true;
        } else {
            if (sig == '[s]') {
                var property_name = a[0];

                // does it meet that one requirement?

                // not sure exactly how requirements are expressed right now.
                //  I think many of those things should be written up in documentation on the system and published.

                // 'name': ['regex', rx]

                // could check for different data types as well
                //  could check that something has a particular status, either function result or its own object.


                // How much of this is in 'nested'?
                //  How much of nested should be brought to the core?

            }
        }

    }),


    // although this is not a collection, it is similar to a normal JS dict / object.
    //  would be good to iterate over all the items of data in this.

    'each': function(callback) {
        // could use for i in...


        /*
        each(this._, function(i, v) {
            callback(i, v);
        });
        */

        // Could have inline code here for speed?
        each(this._, callback);


    },


    // could make this polymorphic so that it
    'position_within': function(parent) {
        var p_id = parent._id();
        //console.log('p_id ' + p_id);
        //console.log('this._parents ' + stringify(this._parents));

        if (this._parents && is_defined(this._parents[p_id])) {
            var parent_rel_info = this._parents[p_id];
            //console.log('parent_rel_info ' + stringify(parent_rel_info));

            //var parents = this._parents;
            //if (parents) {
            //
            //}
            var pos_within = parent_rel_info[1];

            // It is indexed by position in parent through the parent.

            return pos_within;

        }


    },

    // Maybe just 'remove' function.
    //  This may be needed with multiple parents, which are not being used at the moment.

    'remove_from': function(parent) {
        var p_id = parent._id();

        if (this._parents && is_defined(this._parents[p_id])) {

            var parent = this._parents[p_id][0];
            var pos_within = this._parents[p_id][1];

            // is the position within accurate?
            var item = parent._arr[pos_within];
            //console.log('item ' + stringify(item));


            //console.log('');
            //console.log('pos_within ' + pos_within);
            // Then remove the item in the collection (or Data_Object?) ....
            // and the actual parent?

            // can get control / dataobject / collection by its ID of course.

            parent.remove(pos_within);

            // Remove it by index.

            delete this._parents[p_id];



        }

    },

    // Will just deal with constraints for the moment.
    //  I'll probably make it so that resources have requirements.



    // Requirements may be more general and flexible than field constraints.
    //  Requirements could be that another component has initialized.


    '_____check_requirements': fp(function(a, sig) {
        // tell it what to look for with that property.

        if (a.l == 0) {
            // then check all of the requirements
            // returns true if successful, otherwise details of where it fails.

            // could maybe lead to a truth(x) function that checks if x === true, rather than is an object that could be giving details of something being false.
        }

        if (sig == '[s]') {
            // then check that one property
            var property_name = a[0];
        }

        if (a.l == 1 && a[0] === true) {
            // that means it's recursive.
            //  we'll be checking the requirements of this, and of any required objects.



        }


    }),

    // will be able to use the DataObject's class_name for get and
    // set.
    // maybe just type_name?
    // Could have a type name heirachy. So that if it does not find
    // get/set methods for div, it uses the ones for control.

    /*
     * 'property_ensure': function(property_name, value) { // like
     * set, but does not overwrite it.
     *
     *
     * var al = this._alias[property_name]; //console.log('al ' +
     * al); if (al) { property_name = al; }
     *
     * //var s3_name = property_name.split('.'); var pos1 =
     * property_name.indexOf('.'); // or call set
     *
     * if (pos1 == -1) { // if (tof(this._[property_name]) ==
     * 'undefined') { this._[property_name] = value; }
     *  } else { // it separates them into sub-properties. // should
     * use the set procedure for the subproperties.
     *  // and the event will say which subproperty has changed.
     * set(this, property_name, value);
     *
     *  }
     *  }
     */

    // Removing events won't work well when there are vary many.
    // Perhaps multiple listeners could be removed relatively
    // quickly.
    // Also, what about event delegation to another object?
    // Something could have an event_parent.
    // Gets told about events.
    // And that will have the event handler
    // Saves attaching so many event handlers.
    // Event propagates / bubbles.
    // Could even have just a 'parent' data object that receives
    // this information about events?
    // May do other things though.
    // Could even have the parent eventl listeners listen for the
    // actual events?
    // Not then throw them in the same way.
    // HTML surfaces will be listening for the events of delegated
    // objects through the HTML event delegation mechanic.
    // So even with no listeners set up, it will tell a delegation
    // parent.
    // Or event parent.
    // Will leave defining the event bubbling here.

    // Backbone does not seem to have this event bubbling mechanism.
    // Seems to be about receiving all events for a page.
    // Quite possibly should have a Data_Object Event class.
    // This will know the target, maybe other things.
    // DO NEED TO keep track of the target when sending these events
    // through a chain.
    // Target is assumed to be this when calling it with 2
    // parameters

    // Events getting raised on too many items when there are objects within different page contexts.

    // Want objects in more independent contexts.



    'load_from_spec': function(spec, arr_item_names) {
        var that = this;
        each(arr_item_names, function(i, v) {
            var spec_item = spec[v];
            if (is_defined(spec_item)) {
                that['set'](v, spec_item);
            }
        });
    },

    'mod_link': function() {
        return jsgui;
    },

    // Could use less polymorphism and recursion here.
    //  Could maybe iterate structure with a while loop.

    'value': function() {
        var res = {};
        this.each(function(i, v) {
            if (typeof v.value == 'function') {
                res[i] = v.value();
            } else {
                res[i] = v;
            }

        });
        return res;
    },

    // Much of the time enhanced_data_object will be used.
    // get() returns the object - will make the object out of field values / just return _.

    // Asyncronous nested get gets tricky - especially when some of the calls to get objects
    //  are asyncronous and some are not. However, need to process the list of property names
    //  asyncronously where necessary.

    // Maybe will do that outside of data-object though.
    //  The non-async get is fairly complicated already.
    //  It may be possible to make a new get function for Resource that makes use of the get function
    //   of data-object.
    //  However, a data-object would need to be able to interact with this...
    //   So I think that data-object needs this capability too.
    //   I think that asyncronous nested get will be a really useful capability to have,
    //   but it won't be so easy to implement.
    //    Need to be methodical about it.
    //  Running through nested get examples and tests would make a lot of sense.
    //  I think making some smaller jsgui test cases would also be very useful.

    // Would it be possible to make some simple resources that take a while to return a simple result, (1s maybe)?
    //  Then they could be in a chain / sequence so that the async get can be tested to work.

    // Perhaps only Resources have an async get() at their own level, getting their own information.

    // get - a word used because JS did not have getters and setters, getting from a local variable
    //       a word used to signify getting from a more remote location, like from disk or over a network
    //                              calculation

    // Making a very flexible get function would be a very useful thing to do. It will cover the various meanings,
    //  dealing with locally stored data as well as remote.

    // Within a Data_Object, it will be getting Data_Object properties syncronously, but when it encounters a Resource,
    //  it may need to get that asyncronously.

    // How about:
    //  If Data_Object get was called asynchronously, it can call async get functions from resources, and continues
    //   through the chain calling asynchronously.
    //  It fails if it tries to make a syncronous call on a Resource.
    //   Integrating promises would be nice, but it's a new style of programming that makes that part
    //    more complicated when used in conjunction with other pieces of coding that I'm also working on.


    // I think the non asyncronous get can be simplified.
    //  It seems like it is definitely worth getting unit testing done.



    'get': fp(function(a, sig) {

        // 17/06/2014 - Nested intrinsic properties.
        //  Need to access object[propertyName], not just object._[propertyName]
        //   However, may want to say some names of properties are never intrinsic.


        // Could have more managable (for the compiler) functions.

        // but when nested is in place, is it still working right?
        // also will have to deal with particular output formats.
        //  many controls / data types for the moment will have default output as HTML formatted.
        //console.log('Data_Object get this.__type_name ' + this.__type_name);
        //console.log('Data_Object get sig ' + sig);
        //console.log('* get a ' + stringify(a));
        // will also be looking at the output processors.
        if (is_defined(this.__type_name)) {
            // should possibly have this assigned for controls...
            //var raw_input = a;
            //console.log('this.__type_name is defined: ' + this.__type_name);

            //var parsed_input_obj = jsgui.input_processors[this.__type_name](raw_input);
            if (a.l == 0) {
                var output_obj = jsgui.output_processors[this.__type_name](this._);
                return output_obj;
            } else {
                throw 'not yet implemented';
            }
        } else {

            if (sig == '[s,f]') {

                // however, it is more complicated than that.
                //  maybe put this in resource level?

                // Though, collections and data-objects handling async operations well would be an advantage.
                //  This may intersperse with the resources, could perhaps have the resource return a promise
                //  (function?) if it had to operate asyncronously.

                // Go through the system with async calls?
                //  May not be all that hard to do...

                // I think this may need more work...
                //  Keep continuing through the chain, using async chaining.
                throw 'Asyncronous access not allowed on Data_Object get.'


                var res = this.get(a[0]);
                var callback = a[1];

                if (typeof res == 'function') {
                    res(callback);
                } else {
                    return res;
                }



                // could check if we had a function returned.
                //  then we execute that function


                //callback(null, res);
            }

            // check to see if there is a field defined.
            if (sig == '[s]') {
                //console.log('get param: ' + a[0]);
                var fc = this.fc;

                // let's have a look at the fields

                // Don't try to stringify field collections (yet).

                //console.log('fc.get() ' + stringify(fc.get()));



                var field_name = a[0];
                // could have .s in it, making it nested, and have removed nested from here.
                //console.log('pre fc get');
                var field;
                if (fc) {
                    field = fc.get(a[0]);
                }


                //throw 'stop';

                // being told to get 'dom.attributes.class'.
                //console.log('field ' + field);
                // should be able to get 'dom' field first.

                // so if it is multi-level, we can have a function that processes this multi-level request.

                //console.log('field_name ' + field_name);

                if (field_name.indexOf('.') > -1) {
                    // Then we are dealing with a request for a nested object.
                    // Split up the field_name into the various field names for the levels, then have a recursive function here
                    //  process through the levels. Will keep the recursive part small in size and located here.
                    // May not need to even be recursive.

                    var arr_field_names = field_name.split('.');

                    var level = 0, l = arr_field_names.length;
                    var current_obj = this, new_obj, fname;
                    while(level < l) {
                        fname = arr_field_names[level];
                        if (!current_obj) {
                            return undefined;
                        }

                        // OK, but we may be dealing asyncronously now. If the current object is a function,
                        // it gets called and we use the callback to do its stuff.

                        // I think this branch should only handle synchronous chaining.
                        /*
                        if (typeof current_obj == 'function') {
                            // the gotten info is there I hope
                            // This totally would not work in a while loop I think.
                            //  Maybe would need to split up the getting, and ending the while loop.
                            // May be worth seeing what is next...

                            // if this was called without a callback, and needs to be async, can return
                            //  a function to call.

                            // let's have a look at the next levels field names...
                            console.log('level', level);
                            console.log('arr_field_names', arr_field_names);

                            // want to get the slice of arr_field_names until the next
                            //  maybe return a promise to get it here?
                            //   and set it up so that it proceeds to get it...

                            var next = arr_field_names.slice(level).join('.');

                            return function(callback) {
                                //return current_obj.get(next, callback);
                                return current_obj(function(err, res) {
                                    console.log('got res', res);
                                    console.log('got res', stringify(res));

                                    // That's assuming res is a resource or data_object?

                                    res.get(next, callback);
                                    //res(next, callback);
                                    //callback(null, res);
                                })
                            }


                            // want to call get on the item returned.


                            //throw 'stop';

                            //current_obj(function(err, gotten) {
                            //	//new_obj = current_obj.get(fname);
                            //	level++;
                            //	// too late by now. would need to break out of the while.
                            //	//  not really possibly (right now)?
                            //	//

                            //	current_obj = new_obj;
                            //})

                        } else {
                        */
                        new_obj = current_obj.get(fname);
                        //console.log('fname ' + fname);

                        // So, when the dom object is obtained, it should have its own fields.
                        //  The 'get' function will need to be modified to return objects of the right type / class.

                        //console.log('new_obj ' + stringify(new_obj));
                        //console.log('current_obj ' + stringify(current_obj));

                        level++;
                        current_obj = new_obj;
                        /*
                        }
                        */



                    }

                    // but could this return a function?
                    //  could that be handled?

                    return current_obj;
                }

                //console.log('field_name ' + field_name);
                //console.log('field ' + stringify(field));

                // fields seem to stop having been set up properly.

                //console.log('get: field ' + (field));
                //throw 'stop';
                if (field) {
                    //console.log('tof(field) ' + tof(field));
                    //console.log('field ' + stringify(field));

                    //throw 'stop';

                    //console.log('this._[field_name] ' + this._[field_name]);
                    // depending on the type, such as if it is a collection or some other kind of Data_Object, define it.
                    //if (!is_defined())

                    // do we know the field name yet?
                    // yes
                    //console.log('field_name ' + field_name);
                    //console.log('this._[field_name] ' + this._[field_name]);


                    if (!this._[field_name]) {

                        //console.log('did not find object for field. will make one if appropriate. field_name = ' + field_name);
                        //console.log('this._[field_name] ' + this._[field_name]);
                        // create the new item of that type.
                        //  just collections for the moment.

                        var sig_field = get_item_sig(field, 20);
                        //console.log('1) sig_field ' + stringify(sig_field));
                        //console.log('field ' + stringify(field));
                        // And a function here? The definition of a field? String consructor etc.
                        //  Harder to differentiate between that and callbacks now.

                        // A constructor function or a callback?
                        //  There would need to be a way to tell the difference, even if we assign a
                        //  _is_constructor property to the constructors.

                        // Perhaps stop using this?
                        //  We can get fields anyway, without specifying the types.
                        //  Also the constructor function there gets confused with callbacks potentially.

                        if (sig_field == '[s,s,f]') {
                            var field_name = field[0];
                            var fieldStrType = field[1];
                            var fieldDef = field[2];

                            // Maybe look out for String?
                            //  Dealing with String fields, given as a String class?


                            // But if it is a String, maybe we use a Data_Value

                            if (fieldDef == String) {
                                //console.log('is a String');
                                //throw 'stop';

                                var dval = new Data_Value({
                                    'context': this._context
                                })
                                this._[field_name] = dval;
                                return this._[field_name];


                            } else if (fieldDef == Number) {
                                //console.log('is a String');
                                //throw 'stop';

                                var dval = new Data_Value({
                                    'context': this._context
                                })
                                this._[field_name] = dval;
                                return this._[field_name];


                            } else if (fieldStrType == 'Class') {
                                // Can't create a new string like this...

                                var FieldConstructor = fieldDef;
                                var nObj = new FieldConstructor({
                                    'context': this._context
                                })
                                this._[field_name] = nObj;
                                return this._[field_name];

                            }



                        }

                        if (sig_field == '[s,[s,u]]') {
                            // it looks like it has gone wrong.
                            var stack = new Error().stack;
                            console.log(stack);
                        }

                        if (sig_field == '[s,s,o]') {
                            var field_name = field[0];
                            var field_type_name = field[1];
                            var field_info = field[2];

                            //field_name
                            //console.log('* field_name ' + field_name);
                            //console.log('* field_type_name ' + field_type_name);
                            //console.log('* field_info ' + stringify(field_info));
                            // need to cover cases where we have the field info.
                            //  it may need to create a new object matching that field, with the check
                            //   that the data fits into that field.
                            // Data_Value would likely be a good type for a variety of fields.





                            if (field_type_name == 'collection') {
                                //console.log('lazy loading - creating new collection');
                                this._[field_name] = new jsgui.Collection({
                                    'context': this._context
                                });
                                return this._[field_name];
                            } else {
                                // if it's just a string?

                                // 'data_object'
                                //  may get the data_type_object_constructor here.

                                if (field_type_name == 'data_object') {
                                    var dobj = new Data_Object({'context': this._context});
                                    this._[field_name] = dobj;
                                    dobj.parent(this);
                                    return this._[field_name];
                                }


                                if (field_type_name == 'ordered_string_list') {
                                    var osl = new Ordered_String_List();
                                    this._[field_name] = osl;
                                    return this._[field_name];
                                } else if (field_type_name == 'string') {
                                    // use a Data_Value?
                                    //throw 'stop';
                                    var dv = new Data_Value({
                                        'context': this._context
                                    });
                                    //dv.set()

                                    //console.log('dv.__id ' + dv.__id);
                                    //console.log('dv._id() ' + dv._id());
                                    //throw 'stop';
                                    this._[field_name] = dv;

                                    // not providing an index
                                    dv.parent(this);

                                    //console.log('dv ' + stringify(dv));

                                    return this._[field_name];
                                } else {

                                    // need to look into more info about the field.
                                    //
                                    //console.log('field_info ' + stringify(field_info));
                                    // ignore indexed here I think.

                                    // Can get data type object constructors for various types of field, such as
                                    //  {"data_type": ["text", 32], "indexed": true}
                                    //  indexed text(32)


                                    //if (field_info.data_type == )
                                    // need to see if it's a text field.
                                    //  data_type = [name, length]
                                    //  and look at the item_sig for the data_type.
                                    var dt = field_info.data_type;
                                    var dt_sig = get_item_sig(dt, 4);
                                    //console.log('dt_sig ' + dt_sig);

                                    if (dt_sig == '[s,n]') {
                                        var data_type_name = dt[0];
                                        var data_type_length = dt[1];

                                        // then for text, just make a Data_Value

                                        if (data_type_name == 'text') {
                                            var dVal = new Data_Value({
                                                'context': this._context
                                            });
                                            //dVal.parent(this);
                                            //value.set(field_val);
                                            this._[field_name] = dVal;
                                            return this._[field_name];
                                        }

                                        // If the data type is just a string, need to process some specific
                                        //  data types.
                                        // This may be possible using input processors?


                                    } else if (dt_sig == 's') {
                                        var data_type_name = dt;
                                        //console.log('*** data_type_name ' + data_type_name);

                                        if (data_type_name == 'int') {
                                            var dVal = new Data_Value({
                                                'context': this._context
                                            });
                                            //dVal.parent(this);
                                            //value.set(field_val);
                                            this._[field_name] = dVal;
                                            return this._[field_name];
                                        }
                                        //if (data_type_name == '')
                                    } else {
                                        var dtoc = this.mod_link().ensure_data_type_data_object_constructor(field_type_name);
                                        //console.log('dtoc ' + dtoc);
                                        // then use this to construct the empty field.

                                        //throw '!!stop';

                                        var field_val = new dtoc({'context': this._context});
                                        field_val.parent(this);
                                        this._[field_name] = field_val;
                                        return this._[field_name];
                                    }



                                    // throw 'stop';


                                }

                                // check if it is a defined data type.
                                //  if so, we can do something with it.
                                //   input with that data type, and output from it.

                                // This code is getting quite big. I think it won't be all that big when compressed, refactored a bit.
                                //  Once it has been tested it can be refactored down quite a lot, don't want to do that while it is still being built.

                                // if there is an input processor, we know how to deal with it for the moment.
                                //  same with output processor?

                                // so you get the dom data_object?
                                //  I think automatically created and nested Data_Objects are the way.

                                // a Data_Object of that type?
                                //  automatic Data_Object extensions?

                                //throw('5) stop');
                            }

                        } else if (sig_field == '[s,s]') {
                            var field_name = field[0];
                            var field_type_name = field[1];

                            //console.log('field_name ' + field_name);
                            //console.log('field_type_name ' + field_type_name);

                            // perhaps getting collection fields should be moved to enhanced_data_object?
                            //  not keen on interdependencies here.



                            if (field_type_name == 'collection') {

                                // lazy creation of fields.

                                throw 'not supported here. should use code in enhanced-data-object.';

                                // So, Collection has been added to jsgui by now.
                                console.log('pre make coll');

                                // Maybe Collection has not been added to jsgui.
                                //  Need to ensure it does get added when it's getting used.

                                // seems like the Collection object does not get put back on this...
                                //  or at least not always.

                                // looks like we use the module as it is.

                                var coll = new jsgui.Collection({
                                    'context': this._context
                                });

                                console.log('pre set coll parent');
                                coll.parent(this);

                                this._[field_name] = coll;
                                return this._[field_name];

                            } else if (field_type_name == 'data_object') {
                                var dobj = new jsgui.Data_Object({
                                    'context': this._context
                                })
                                dobj.parent(this);
                                this._[field_name] = dobj;
                                return this._[field_name];

                            } else {
                                var dtoc = jsgui.ensure_data_type_data_object_constructor(field_type_name);
                                //console.log('dtoc ' + dtoc);
                                //throw '!stop';
                                // then use this to construct the empty field.
                                //  without the new constructor it was trying to make an abstract version!!!
                                var obj = new dtoc({'context': this._context});
                                //if (this._context) obj._context = this._context;
                                obj.parent(this);

                                this._[field_name] = obj;
                                //console.log('this._ ' + stringify(this._));

                                return this._[field_name];
                            }
                        } else if (sig_field == '[s,[s,s]]') {
                            var field_name = field[0];
                            var field_info = field[1];

                            //console.log('field_info ' + stringify(field_info));

                            if (field_info[0] == 'collection') {
                                var collection_type_name = field_info[1];

                                // new Collection('string') should work.

                                // context needs to be set at the beginning though.
                                //  Can't make a collection from this module.

                                // Need a way to be able to!

                                //var ncoll = new jsgui.Collection({'context': this._context})

                                //var ncoll = new jsgui.Collection(collection_type_name);
                                //if (this._context) ncoll._context = this._context;

                                //ncoll.parent(this);
                                //this._[field_name] = ncoll;
                                //return this._[field_name];
                            }
                        } else if (sig_field == '[s,[s,o]]') {
                            // [fieldName,['collection', objDef]]

                            // eg field ["entries", ["collection", {"address": "string", "family": "string", "internal": "boolean"}]]
                            // it's a collection?? (check, with the particular data type)

                            var field_name = field[0];
                            var field_info = field[1];
                            var data_type_name = field_info[0];

                            if (data_type_name == 'collection') {
                                var objDef = field_info[1];
                                throw 'not supported here. should use code in enhanced-data-object.';

                                // Need to do more than this.
                                //var ncoll = new jsgui.Collection({'context': this._context})

                                //var ncoll = new jsgui.Collection(collection_type_name);
                                //if (this._context) ncoll._context = this._context;

                                //ncoll.parent(this);
                                //this._[field_name] = ncoll;
                                //return this._[field_name];
                            }

                        }


                    } else {
                        //console.log('did find field obj ' + field_name);

                        return this._[field_name];
                    }

                    //var tf = tof(this._[field_name]);
                    //console.log('tf ' + tf);
                    //if ()

                } else {
                    // Without a field... t

                    var res = ll_get(this._, a[0]);


                    if (!res) {
                        if (field_name.indexOf('.') > -1) {
                            throw 'not yet handled';
                        } else {
                            res = this[a[0]];
                        }
                    }
                    // Instrinsic get...



                    //console.log('property_name ' + property_name);

                    // Breaks it with stringify, is hard to track down.
                    //  Maybe worth keeping as an example gotcha.
                    //console.log('res ' + res);
                    return res;
                }



            } else if (a.l == 0) {
                // need to get the values of all fields.
                //  Think they are now being held in the field collection, fc.

                return this._;
            }
        }


    }),

    // trying a different way of doing things.

    '___get_fields_chain': function() {
        // is this the prototype / constructor.

        var my_fields = this._fields;

        // a bit difficult...


        console.log('my_fields ' + stringify(my_fields));

        var con = this.constructor;
        console.log('con ' + stringify(con));

        //this._super();

        /*

        var sc = this._superclass;
        console.log('sc ' + sc);



        console.log('this._fields ' + stringify(this._fields));

        if (con) {
            var con_fields = con._fields;
            console.log('con_fields ' + stringify(con_fields));

            var con_super = con._superclass;
            console.log('con_super ' + stringify(con_super));

            var con_pro = con.prototype;
            console.log('con_pro ' + stringify(con_pro));

            var con_pro_super = con.prototype._superclass;
            console.log('con_pro_super ' + stringify(con_pro_super));

            var con_pro_fields = con_pro._fields;
            console.log('con_pro_fields ' + stringify(con_pro_fields));


        }


        var pro = this.prototype;
        console.log('pro ' + pro);

        if (pro) {
            var pro_fields = pro._fields;
            //var con_pro = con.prototype;
            console.log('pro_fields ' + stringify(pro_fields));


            var pro_super = pro._super;
            console.log('pro_super ' + stringify(pro_super));


        }
        */
    },

    '_get_input_processors': function() {
        //throw 'stop';
        return jsgui.input_processors;
    },

    //


    'set': fp(function(a, sig) {
        // property_name, value

        // May override this with collections...
        //  Clear, then push first item, when given a Data_Object.

        //console.log('Data_Object set sig ' + stringify(sig));
        //console.log('this._abstract', this._abstract);
        if (this._abstract) return false;

        var that = this, res;

        //console.log('');


        // May want to add it to a collection in some cases.
        //  Or make it the only item in the collection.

        // The signature for set as well?

        //console.log('');
        //console.log('set');

        //console.log('this.__type_name ' + this.__type_name);
        //console.log('this._data_type_name ' + this._data_type_name);



        var input_processors;
        if (this._module_jsgui) {
            input_processors = this._module_jsgui.input_processors;
        } else {
            input_processors = this._get_input_processors();
        }

        //console.log('*** input_processors ' + stringify(Object.keys(input_processors)));

        // or some other value will be set?
        //console.log('jsgui.input_processors ' + stringify(jsgui.input_processors));
        // These input processors need to be available throughout.
        //  Not sure about where to retrieve them from when using AMD.
        //   Could pass forward a request fot input processors.
        // so would have _get_input_processors function.
        //  that would retrieve it from whichever module it is from.

        // so there may not be an input processor set up already for it.
        //  some classes won't need it.

        // Need to refactor this.


        // setUsingInputProcessor

        // setUsingThis




        // Less important a distinction now.
        //  The data types may have been set up so that they just apply fields, not that they have got
        //   input and output processors.

        if (is_defined(this._data_type_name) && input_processors[this._data_type_name]) {
            // use the input processor of the data_type.

            throw 'stop';

            console.log('is_defined _data_type_name and input_processors[this._data_type_name]');

            //console.log('this.__type_name ' + this.__type_name);
            //throw 'stop';
            var raw_input = a;

            // we may not have the means to parse that raw input...
            //console.log('input_processors)

            // OK, so when setting using the type that has come about through the type system...

            //console.log('raw_input ' + stringify(raw_input));


            // if there is no input processor, to set _, we process it directly.

            // ['name, value'];
            //  set our own fields.
            //if (input_processors[this._data_type_name]) {
                var parsed_input_obj = input_processors[this._data_type_name](raw_input);
                //console.log('parsed_input_obj ' + stringify(parsed_input_obj));
                //throw('2) stop');

                this._ = parsed_input_obj;

            this.trigger('change');
            //} else {

            //}





            // set, just with a value... just with the __type_name.
            //  Uses the data type parsing to do this.
            //  Should work for fields.





            // but then with get() - get according to an output format like HTML / CSS, or the internal JSGUI representation.
            //  could still make use of _ for the internal representation.


        } else {
            //console.log('no dtn defined');
            //console.log('a.l ' + a.l);
            //console.log('');


            if (a.l == 2 || a.l == 3) {


                var property_name = a[0], value = a[1];

                var ta2 = tof(a[2]);
                //console.log('ta2', ta2);

                var silent = false;
                var source;

                if (ta2 == 'string' || ta2 == 'boolean') {
                    silent = a[2]
                }

                if (ta2 == 'control') {
                    source = a[2];
                }

                //silent = false || a[2];


                //console.log('set property_name ' + property_name + ', value ' + value);
                //console.log('set value ' + value);
                //console.log('set value ' + stringify(value));

                // is the property read_only?

                if (!this._initializing && this._map_read_only && this._map_read_only[property_name]) {
                    throw 'Property "' + property_name + '" is read-only.';
                } else {

                    //console.log('***');

                    // not using ll_set any longer.

                    // need to use a routine that deals with the data_types.

                    // Think we need some kind of recursive get-set type of routine.
                    //  Get will get it to greate objects that are fields anyway.

                    var split_pn = property_name.split('.');
                    //console.log('split_pn.length ' + split_pn.length);

                    // When setting some types of Data_Object class
                    //  (like Server, a subclass of Data_Object, and a Resource)
                    // need to make sure it sets it with the item given.



                    if (split_pn.length > 1 && property_name != '.') {
                        //console.log('split_pn ' + stringify(split_pn));

                        var spn_first = split_pn[0];
                        var spn_arr_next = split_pn.slice(1);

                        // For dealing with a root item?
                        //  So can set its . property?

                        // I think we have a special '.' field.
                        //  Treat it as an object.



                        //console.log('spn_first ' + stringify(spn_first));
                        //console.log('spn_arr_next ' + stringify(spn_arr_next));

                        var data_object_next = this.get(spn_first);
                        //console.log('data_object_next', data_object_next);
                        if (data_object_next) {

                            var res = data_object_next.set(spn_arr_next.join('.'), value);

                            if (!silent) {

                                var e_change = {
                                    'name': property_name,
                                    'value': value,
                                    'bubbled': true
                                };

                                if (source) {
                                    e_change.source = source;
                                }

                                // I think this is bubbling.
                                //  Maybe mark it as bubbled.

                                this.raise_event('change', e_change);
                            }


                            return res;

                        } else {

                            // Could create a new Data_Object.

                            //var ndo = new Data_Object({
                            //	// with a context?
                            //	'context': this._context
                            //});

                            // but for the '.' property...









                            // Is this recursive?
                            //  Need to fix this.

                            // May need to specify a data model?
                            //  But we want this to be flexible?

                            // Maybe we need to declare that Script has got some deeper attributes.

                            //var data_object_next = new

                            // Not sure how this is recursing properly.
                            //  Maybe work on this at some other time, using an example that's more sandboxed,
                            //   such as the US presidents example.





                            //var stack = new Error().stack
                            //console.log(stack);
                            throw('No data object at this level.');
                        }
                        throw('10)stop');
                        // call a multi-level-set function?
                        //  could do it recursively here for the moment I think, without much code.
                        //   like it is now :)


                    } else {

                        //console.log('2) no split');

                        // not necessarily, it still may apply to a data_object.

                        //console.log('pre get ');
                        //  if there is nothing, get should return undefined / null.
                        //   perhaps make it if it is an expected object though.
                        //    it looks like it is expected? or we have it from the value anyway.
                        //    maybe it's only fine to set it to a data_object / data_value.

                        // if it is just a string we can make a Data_Value to hold it and then put it in place.
                        // can use the dobj function???

                        // can just set the value.
                        //  could just record the string in here.
                        //  putting it in a Data_Value would eventually help with automatic string indexing.
                        //   And it would potentially be an indexed field anyway.

                        // Potentially parsing object input?
                        //  Will have more of that working to do with some HTML properties to start with.





                        // get it???
                        //  that could work... could create the right constructor.

                        //  There maybe will only be a

                        // Maybe don't need to get this...
                        //console.log('---');
                        // We may be able to get it, using lazy loading in some cases.
                        //  This may look at the fields and create a new object.

                        //console.log('1) property_name ' + property_name);
                        // But we are setting it!!!



                        // May do away with data_object_next.
                        //

                        var data_object_next = this.get(property_name);

                        // Looking for these in resources, and doing more than needs to be done on init?



                        // So, the property has not been defined correctly.
                        //  Need to make it so that data_def sets up the fields so that they work.




                        //console.log('---');
                        //  gets it as a string?


                        // Stringifying this causes an endless loop (sometimes)
                        //console.log('data_object_next ' + stringify(data_object_next));

                        // failing to get tagName property - it's a string proper

                        // and when setting the tag_name object?

                        //console.log('property_name ' + property_name);
                        //console.log('value ', (value));
                        //console.log('***** data_object_next ' + data_object_next);
                        if (!is_defined(data_object_next)) {

                            // add it to the fields collection?
                            //this._[property_name] = new Data_Object({});
                            //return this.set(property_name, value);
                            //console.log('tof(value) ' + tof(value));


                            //var tv = tof(value);
                            var tv = typeof value;

                            /*
                            if (tv == 'data_object') {
                                // copy directly in more cases than this... maybe just for primitive types do we use the
                                //  data_value.

                            } else {

                            }
                            */
                            var dv;
                            //console.log('tv ' + tv);
                            if (tv == 'string' || tv == 'number' || tv == 'boolean' || tv == 'date') {
                                dv = new Data_Value({'value': value});
                            } else {
                                dv = value;
                            }


                            //console.log('dv ' + stringify(dv));
                            //this._[property_name] = value;
                            //throw 'Should make a new Data_Value';

                            this._[property_name] = dv;
                            // Not making a new Data_Value?

                            //console.log('this._[property_name] ' + this._[property_name])

                            //this.raise_event('change', [property_name, dv]);

                            if (!silent) {
                                var e_change = {
                                    'name': property_name,
                                    'value': dv
                                }

                                if (source) {
                                    e_change.source = source;
                                }

                                this.raise_event('change', e_change);
                            }




                            //throw 'stop!!!';

                            return value;

                        } else {
                            //console.log('this ' + stringify(this));
                            //console.log('2) property_name ' + property_name);
                            //console.log('data_object_next ' + stringify(data_object_next));
                            //console.log('tof data_object_next ' + tof(data_object_next));

                            // Just because we can get the server as a next data object, does not mean we need to.

                            //  If we have been given a value, use it.
                            //  However, need to clarify this code here.
                            //   At some times we will want it to produce the next level of data object, but not at others.

                            // Setting a field should be a fairly simple procedure if possible, maybe this code could
                            //  be refactored.

                            // So when we have been given a server property, we want to set ._.server to it

                            //


                            // REFACTOR?



                            // if it is a data object?
                            //  if it is a native type?



                            if (is_js_native(data_object_next)) {
                                //console.log('is_js_native');
                                //this.set
                                // but maybe that object should be wrapped in Data_Object?
                                this._[property_name] = value;
                                res = value;


                            } else {
                                //console.log('not is_js_native');
                                //var res = data_object_next.set(value);

                                this._[property_name] = value;
                                res = value;


                                //console.log('set data object next using value');
                            }




                            //var res = ll_set(this._, property_name, value);
                            // should raise an event here.

                            // this.raise_event('set', [property_name, value]);
                            // then the event tells everything that is listening to it.
                            //console.log('this', this);

                            //this.trigger('change', [property_name, value]);
                            //console.log('property_name', property_name);
                            //console.log('value', value);
                            //console.log('this', this);

                            if (!silent) {
                                var e_change = {
                                    'name': property_name,
                                    'value': value
                                };
                                if (source) {
                                    e_change.source = source;
                                }
                                this.trigger('change', e_change);
                            }


                            // want to listen to the set event for some things such as GUI components in particular.

                            return res;
                        }
                    }
                }
            } else {
                // But maybe it should be a data_value, not a data_object.

                //console.log('3) else sig ' + sig);

                // And for a Data_Object?
                //  Basically put it into place.

                if (sig == '[D]') {
                    //console.log('property_name ' + property_name);
                    this._[property_name] = value;

                    //this.raise_event('change', [property_name, value]);

                    // Raise a change event?
                    //  Or is set event OK?

                }

                if (sig == '[o]') {
                    //console.log('setting with a provided object');

                    var that = this;
                    // may need to be recursive.
                    var res = {};
                    each(a[0], function(i, v) {
                        //console.log('i ' + i);
                        //console.log('v ' + stringify(v));

                        res[i] = that.set(i, v);
                        //that.raise_event('change', [i, v]);

                    });
                    return res;
                }

                // C for collection?
                if (sig == '[c]') {
                    //this._[]
                    this._[property_name] = value;
                    //this.raise_event('change', [property_name, value]);
                    //throw 'unsupported';
                }
            }
        }
    }),
    'has' : function(property_name) {
        return is_defined(this.get(property_name));
    }
});

var initializing = false, fnTest = /xyz/.test(function() {
    xyz;
}) ? /\b_super\b/ : /.*/;


var get_fields_chain = function(data_object_class) {
    var res = [];
    var inner = function(data_object_class) {
        // _fields... fields will be given as an array by default, to preserve the order.

        var fields = data_object_class._fields;


        //console.log('get_fields_chain fields ' + stringify(fields));
        if (fields) {
            res.push(fields);
        }
        // Could be pushing an array containing an array that represents one field.

        var sc = data_object_class._superclass;
        //console.log('sc ' + sc);
        //if (sc) console.log('sc.constructor._fields ' + stringify(sc.constructor._fields));
        if (sc) {
            inner(sc);
        }
    };
    inner(data_object_class);
    //console.log('get_fields_chain res ' + stringify(res));
    return res;
}


// But the fields may have an order. It may be necessary to preserve that order.
//  The order of fields is not of great imporance usually. May be nice to have their order guaranteed to stay the same...
//   it may be that different JavaScript engines will do this anyway.

var get_chained_fields = function(data_object_class) {
    // would be nice to do this in a way that preserves the order.
    //  an array of fields may be better.

    // The fields chain... need to make sure that is getting the separate fields.
    var fc = get_fields_chain(data_object_class);



    var i = fc.length; //or 10

    //var res = {};
    var res = [];

    // Not so sure about doing this... is it breaking up a field into more than one field when it should not be?


    while(i--)
    {
      //...
        var item = fc[i];

        // the item can be an object... or an array. Array is better.

        //each(item, function(i2, v) {
        //	res[i2] = v;
        //});

        // [field_name, field_info]

        // Not so sure about including the number?
        //  Is it necessary?
        // Maybe it can be ignored at a later stage.
        //  However, do want it to properly interpret the fields at a later stage.

        var c = 0;

        each(item, function(i2, field_info) {

            //console.log('');
            //console.log('i2 ' + i2);

            if (tof(i2) == 'string') {
                c = c + 1;
                res.push([c, [i2, field_info]]);
            } else {
                res.push([i2, field_info]);
                c = i2;
            }

            //console.log('field_info ' + stringify(field_info));

            //res[i2] = v;
            // field_info could just be the field_name and some text. that should be fine.

        });

    }
    // not sure that all fields will have simple types.
    //  some will be constructors even.
    // Fields should have been set correctly, not like get_chained_fields res [[0, "indexed_array"], [1, [["red", "number"], ["green", "number"], ["blue", "number"]]]]
    //console.log('get_chained_fields res ' + stringify(res));
    return res;
}

var chained_fields_to_fields_list = function(chained_fields) {


    /*
    var res = [];
    each(chained_fields, function(i, v) {
        var field_number = v[0];
        var field = v[1];
        res.push(field);
    });
    */

    //console.log('chained_fields ' + stringify(chained_fields));

    var l = chained_fields.length;
    //console.log('l ' + l);
    var res = new Array(l);
    //var res_push = res.push;
    for (var c = 0; c < l; c++) {
        //res_push.call(res, chained_fields[c][1]);
        //res.push(chained_fields[c][1]);
        res[c] = chained_fields[c][1];
    };


    return res;
};

jsgui.map_classes = {};

/*
Object.prototype.begetObject = function () {
    function F() {}
    F.prototype = this;
    return new F();
};

newObject = oldObject.begetObject();
*/

// Also want to specify functions that execute upon initialization that call
//  a function, using a parameter that gets set in the definition.
// This will be used to enable a Collection subclass to be defined as
//  Collection.extend({'data_object': Data_Object_Subclass});
//   Like a collection of products holding the Product Data_Object type and having that
//   easily and clearly declared within the model code.
// Could this be done in the normal init?
//  or use propsToMerge?

Data_Object.extend = function(prop, post_init) {
    var _super = this.prototype;
    initializing = true;
    var prototype = new this();

    // copying accross some old things?
    //  keeping some things in the prototype chain?
    var for_class = {};

    initializing = false;

    //if (tof(prop) === 'string') {
    if (typeof prop === 'string') {
        // giving it a data_type from the jsgui.data_types_info
        var data_type_name = prop;
        var dtis = jsgui.data_types_info;
        //console.log('dtis ' + stringify(dtis));
        //return dtis;
        var data_type_info = dtis[data_type_name];
        //console.log('data_type_name ' + stringify(data_type_name));
        //console.log('data_type_info ' + stringify(data_type_info));
        for_class[data_type_name] = data_type_name;
        for_class[data_type_info] = data_type_info;
        // then it will be read from the class object itself.
        //  will be able to get the constructor object, I think.
        // maybe not best to do this through the prototype?
        //  having difficulty getting the constructor, within the constructor function.
        prototype['__type_name'] = data_type_name;
        prototype['__data_type_info'] = data_type_info;

        prop = {};

        // then this effectively sets its fields.
        //  create the fields, in order, and have a numeric index saying which field is which.
        //  will have an _operating_mode.
        //  the data_object will be able to operate as an indexed_array... but not sure about making a collection and giving it named items?
        //   collection already takes named items.

        // Will also need to deal with collections of objects here.
        //  Will be very nice when the HTML code is very declarative.

        // Data_Type_Instance? Or the constructor to the relevant Data_Object functions as its instance?
        //  It's not exactly an instance, it's a constructor, but constructors can have their own methods too.

        // Then this is the data_type_instance, effectively.

        // so it will hold the data type info within the constructor?
        //  or named reference to it is fine.

        //throw('*1 stop');
    }
    var prop_item, t_prop_item, tmp, name, res;
    for (name in prop) {

        prop_item = prop[name];
        if (name.charAt(0) === '#') {

            // direct copy with '#'... not been using that.

            prototype[name.substring(1)] = prototype[prop_item];
        } else {
            // if it's a function, then do the following.

            // if it's an object, then it may be something specific to the DataObject type.
            //  such as setting / extending fields of an object.

            // some specific non-object things will be set to the prototype.
            //  it will be possible to look at this info, the fields chain in the object, will take a bit of trial, error and design.

            t_prop_item = typeof prop_item;
            //console.log('prop_item' + prop_item);
            if (t_prop_item === 'function') {

                prototype[name] = typeof _super[name] === 'function' && fnTest.test(prop_item) ?
                // had some difficulty using fp() with 'init' functions. could
                // it have to do with function names?

                (function(name, fn) {
                    return function() {
                        tmp = this._super;
                        this._super = _super[name];
                        res = fn.apply(this, arguments);
                        this._super = tmp;
                        return res;
                    };
                })(name, prop[name]) : prop[name];

            } else if (t_prop_item === 'object' || t_prop_item === 'boolean') {

                // don't put these in the prototype.
                //  they are not for the object itself.
                //console.log('property name', name);
                if (name == 'class_name') {
                    for_class['_class_name'] = prop_item;
                } else if (name == 'fields') {
                    // maybe call it something else, fields is a function.
                    // fields could be a function, so call it _fields
                    // it sets the array of fields... could be an object representing fields but an array is better because the order gets preserved.
                    for_class['_fields'] = prop_item;
                    //this['_fields'] = prop_item;
                    // then the fields will be read upon initialization?
                    //  getting all the fields up the chain...
                } else if (name == 'connect_fields') {
                    // maybe call it something else, fields is a function.
                    // fields could be a function, so call it _fields

                    for_class['_connect_fields'] = prop_item;

                    // then the fields will be read upon initialization?
                    //  getting all the fields up the chain...

                } else {
                    prototype[name] = prop[name];
                }

            }  else {
                prototype[name] = prop[name];
            }
        };
    };

    // Looks like this needs to be changed just to be local...

    var Class = function() {

        //console.log('Data_Object initializing ' + initializing);
        //console.log('Data_Object !!this.init ' + !!this.init);

        if (!initializing) {
            if (this.init) {
                this.init.apply(this, arguments);
                if (this.post_init) {
                    //this.post_init();
                    this.post_init.apply(this, arguments);
                }

                if (post_init) {
                    post_init.call(this);
                }
                // Check to see if there are further functions to call...
                //  things that have got put into the extend function?



            } else {
                var spec = arguments[0] || {};
                spec.abstract = true;
                //var newClass = new Class(spec);

                //return newClass;
                return new Class(spec);
            }
        }

        /*
        if (!initializing && this.init) {
            //this.constructor =
            this.init.apply(this, arguments);
            if (this.post_init) {
                //this.post_init();
                this.post_init.apply(this, arguments);
            } else {
                //return return new Class(((arguments[0] || {}).abstract = true));

            }
        }
        */

        /*
        if (!initializing &! this.init) {
            //console.log('this looks like it has been called without a "new" keyword, as a constructor');

            // init_no_new
            //console.log('this.init_no_new ' + this.init_no_new);
            // so that does not help... yet.
            //console.log('tof(prop) ' + tof(prop));

            //var prop2 = clone(prop);
            //console.log('tof(prop2) ' + tof(prop2));
            //prop2.abstract = true;

            var spec = arguments[0] || {};

            spec.abstract = true;

            //var newClass = new Class(spec);

            //return newClass;
            return new Class(spec);


            //function object(o) {
            //	 function F() {}
            //	 F.prototype = o;
            //	 return new F();
            //}


            //function object(o) {
            //
            //}

            //if (this.init_no_new) {
            //	this.init_no_new.apply(this, arguments);
            //}
        }
        */

    };
    Class.prototype = prototype;
    //Class.constructor = Class;
    Class.prototype.constructor = Class;
    // but constructor loses info. not sure how to get back at the constructor from an object?
    //  what is the original constructor even?

    Class.extend = arguments.callee;

    /*
    if (for_class) {
        for (var c = 0, l = for_class.length; c < l; c++) {
            Class[i] = for_class[v];
        }
    }
    */
    //console.log('for_class', for_class);
    for (i in for_class) {
        Class[i] = for_class[i];
    }


    //each(for_class, function(i, v) {
    //	Class[i] = v;
    //});

    // jsgui.map_classes[]

    if (Class['class_name']) {
        jsgui.map_classes[Class['class_name']] = Class;
    }

    //console.log('_superprototype ' + _super.prototype);

    //Class.prototype._superclass = _super;

    Class._superclass = this;

    //Class._superprototype = _super;


    // * if (namespcExtension) { each(namespcExtension, function(i, n) {
    // * Class[i] = n; }); }; if (propsToMerge) { each(propsToMerge,
    // * function(i, n) { if (typeof Class.prototype[i] === 'undefined') {
    // * Class.prototype[i] = n; } else { $.extend(true, Class.prototype[i],
    /// * n); }; }); }


    return Class;
};


// Will have actual Constraint programming objects.
//  They may translate to the database level as well.
//  In many cases the constraints will be expressed as strings such as 'text(32)'.
//   Would then be translated to varchar(32) on a different level.



var data_object_matches_field_constraints = function(data_object, field_constraints) {
    // Field constraints given as a normal object.

    // returns true or false
    //  though could return failure information as well if asked for it.
    //  making it into another polymorphic function.

    each(field_constraints, function(fc_name, fc_value) {
        //console.log('fc_name ' + fc_name);
        //console.log('fc_value ' + fc_value);

    });
};
// That data object will be indexable.

var Enhanced_Data_Object = null;

var set_Enhanced_Data_Object = function (EDO) {
    Enhanced_Data_Object = EDO;
};

var get_Enhanced_Data_Object = function () {
    return Enhanced_Data_Object;
};


// seems like an overlap with the new jsgui.fromObject function.
//  That will initially go in the Enhanced_Data_Object module, or jsgui-enh

var dobj = function(obj, data_def) {
    // could take a data_def?
    // Could use the enhanced data object if we patch backwards?
    //  So Enhanced_Data_Object could hopefully patch backwards in the code?

    //var tdd = tof(data_def);

    var cstr = Data_Object;
    if (Enhanced_Data_Object) cstr = Enhanced_Data_Object;
    //console.log('Enhanced_Data_Object ' + Enhanced_Data_Object);

    var res;
    if (data_def) {
        res = new cstr({'data_def': data_def});
    } else {
        res = new cstr({});
    }

    var tobj = tof(obj);

    //console.log('obj ' + stringify(obj));
    if (tobj == 'object') {
        var res_set = res.set;
        each(obj, function(i, v) {
            //res.set(i, v);
            res_set.call(res, i, v);
        });
    }

    return res;
};


// This code could be done using other means in other parts of the system.
//  The framework code will provide more to do with data type definitions and interpreting input data.

// this seems like part of an input processor.
//  changes from text to the JavaScript objects that get understood.


// parsing a data type
// similar to parsing a JavaScript function call, but only one ting in the brackets, and there may not be brackets anyway


var parse_field_text = Fields_Collection.parse_field_text;
var parse_data_type = Fields_Collection.parse_data_type;
// We can't extend this further down while using requirejs
//  Not sure how to achieve this now, requirejs was meant to be for convenience.

// Can have some sort of function chaining.
//  And having a function within the right module called...
//  That could be a 'linking function.'
// mod_link.

// A new constructor for these?
//  Curried functions?
//  Or Boolean_DV... Would have tests possibly.

jsgui.map_data_type_data_object_constructors = jsgui.map_data_type_data_object_constructors || {};
jsgui.map_data_type_data_object_constructors['boolean'] = Data_Value;
//boolean': Data_Value



// Could do something like pass the ensure_data_type_data_object_constructor function around?
//  Or the HTML module will have its own way of making object constructors.

// I think only having object constructor functions going down the module loading heirachy will work.
//  May have a map of various loading functions that get made in each module.

// They are basically constructor functions.

// But this could have access or need access to more information about how to construct objects.
//  Want to get this working for 'color'.
var ensure_data_type_data_object_constructor = function(data_type_name) {

    //console.log('');
    //console.log('');
    //console.log('jsgui.map_data_type_data_object_constructors[data_type_name] ' + stringify(jsgui.map_data_type_data_object_constructors[data_type_name]));
    //console.log('');
    //console.log('');

    // Hardet to bring that map through all dependencies and back.
    //  However, need to have access to that map variable.

    //console.log('jsgui.map_data_type_data_object_constructors ' + jsgui.map_data_type_data_object_constructors);

    if (!jsgui.map_data_type_data_object_constructors[data_type_name]) {
        //console.log('creating new Data_Object constructor for data_type: ' + data_type_name)

        // Need to get the variable back through the modules...
        //  Missing global variables?
        //  Move this function somewhere else?
        //  Maybe we could have some storage available in jsgui-lang-essentials through a closure.
        //  That way the code could be sent back... but do we still have different instances running?

        // Could just be different execution contexts... co can't feed back this information about other objects.
        //  But can feed functionality forards.

        // May need to have things more independant.
        //

        //var dti = jsgui.get('dti');
        //console.log('dti ' + dti);
        //throw 'stop';

        var dto = jsgui.data_types_info[data_type_name];

        //console.log('dto ' + stringify(dto));

        var dtc = Data_Object.extend({
            'fields': dto
        })
        jsgui.map_data_type_data_object_constructors[data_type_name] = dtc;
    }
    return jsgui.map_data_type_data_object_constructors[data_type_name];
}
jsgui.ensure_data_type_data_object_constructor = ensure_data_type_data_object_constructor;

input_processors.field_text = parse_field_text;
input_processors.data_type = parse_data_type;

// Maybe do without the following.
//  Have different, simpler, flatter namespacing. Put lots of things in jsgui.
//  Then when the files get built together they get turned into local variables.

//Data_Object.Data_Value = Data_Value;



Data_Object.Fields_Collection = Fields_Collection;
Data_Object.dobj = dobj;
Data_Object.matches_field_constraints = data_object_matches_field_constraints;
Data_Object.parse_field_text = parse_field_text;
Data_Object.get_chained_fields = get_chained_fields;
Data_Object.chained_fields_to_fields_list = chained_fields_to_fields_list;
Data_Object.map_data_type_data_object_constructors = jsgui.map_data_type_data_object_constructors;
Data_Object.Mini_Context = Mini_Context;
Data_Object.set_Enhanced_Data_Object = set_Enhanced_Data_Object;
Data_Object.get_Enhanced_Data_Object = get_Enhanced_Data_Object;
Data_Object.ensure_data_type_data_object_constructor = ensure_data_type_data_object_constructor;

//return Data_Object;
module.exports = Data_Object;
//})
