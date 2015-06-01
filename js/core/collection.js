
/* * @module core/collection */

/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./jsgui-lang-essentials", "./jsgui-data-structures", "./data-object", "./data-object-fields-collection", "./constraint",
	"./collection-index"],
	*/

var jsgui = require('./jsgui-lang-essentials');
var Data_Structures = require('./jsgui-data-structures');
var Data_Value = require('./data-value');
var Data_Object = require('./data-object');
var Data_Object_Field_Collection = require('./data-object-fields-collection');
var Constraint = require('./constraint');
var Collection_Index = require('./collection-index');
//

//function(jsgui, Data_Structures, Data_Object, Data_Object_Field_Collection, Constraint, Collection_Index) {

// Collection... use sligntly more than essentials?
var Collection_Index_System = Collection_Index.System;
var Sorted_Collection_Index = Collection_Index.Sorted;

var j = jsgui;
var Class = j.Class;
var each = j.each;
var eac = j.eac;
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

var constraint_from_obj = Constraint.from_obj;
var native_constructor_tof = jsgui.native_constructor_tof;

var dop = Data_Object.prototype;

// wrap the old set_field function
var old_set_field = dop.set_field;

var new_set_field = fp(function(a, sig) {
    // some polymorphic cases which are not checked by the old one.
    if (sig == '[s,[f]]') {
        // It's a constraint / field that is a collection.
        //  The collection actually gets created, _.field_name set to be that collection.

        //console.log('new_set_field sig ' + sig);

        // then create the data type constraint...
        //  the data type for that field is a collection, and that collection has a given type that it accepts.
        var field_name = a[0];
        //console.log('field_name ' + field_name);
        var dt_constructor = a[1][0];

        //console.log('dt_constructor ' + dt_constructor);

        var coll = new Collection(dt_constructor);
        coll._data_type_constraint = new Constraint.Collection_Data_Type(dt_constructor);
        this.set(field_name, coll);

        //throw '12) new_set_field stop';
    } else {
        old_set_field.apply(this, a);
    }
});

dop.set_field = new_set_field;

/**
* @param obj
* @param query
*/
var obj_matches_query_obj = function(obj, query) {
    //console.log('obj_matches_query_obj');
    //console.log('obj ' + stringify(obj));
    //console.log('query ' + stringify(query));

    var matches = true;
    each(query, function(fieldName, fieldDef) {
        var tfd = tof(fieldDef);
        //console.log('fieldName ' + fieldName);
        //console.log('tfd ' + tfd);

        if (tfd == 'string' || tfd == 'boolean' || tfd == 'number') {
            matches = matches && obj[fieldName] === fieldDef;
            //if (!matches) stop();
        } else {
            throw 'need more work on more complex queries for collection find, iterative search'
        }
    })
    return matches;
}


// In the definition of a control's extension, we may include a 'data_type'.
//  That will translate to a _data_type_constraint being applied to all collections
//   of that defined type.
//  constraint(D);

// May need to make a new extend function to handle 'data_type' being specified at the top
//  level of the definition, similar to 'fields'.

// May add some parameters into extend, so that this will accept a function that processes
//  this value upon initialization.

// 28-Dec-2013
//  This lacks insert_at. That seems like an important part of a collection.
//  Maybe not important with various indexing systems, but important for basic usage.
//   Like inserting a control into another control's contents as the first.


/*
 * @constructor
 */

/**
* A module representing a collection.
* @exports core/collection
*/
var Collection = Data_Object.extend({

    'init': function(spec, arr_values) {
        //console.log('Collection init');
        //console.log('spec ' + stringify(spec))
        spec = spec || {};
        // Probably should act differently for an abstract collection.
        this.__type = 'collection';
        if (spec.abstract === true) {
            //console.log('init abstract collection');

            // An abstract collection does no have an index system - though maybe has got abstract indexes?
            // We may initialise it using a constructor for another function.
            //  eg Collection(Table)

            // In this case hold the item type.
            //  It is a constraint.
            //  Any objects in the collection must be an instanceOf the type given.


            // Just meaning it is a collection of a certain type.
            //  Fields will get declared in the abstract, eg when defining a Database class, it has tables as a field.

            // Will do this as the collection having a data type constraint.

            var tspec = tof(spec);
            if (tspec === 'function') {
                this.constraint(spec);
            }



            // Abstract collection of type.

            // Will not have an actual index system in abstract mode.

        } else {
            this._relationships = this._relationships || {};
            this._arr_idx = 0;
            this._arr = [];

            // Maybe some collections don't need indexing?
            this.index_system = new Collection_Index_System({
                // The collection index system could have different default ways of indexing items.
                //  Each item that gets indexed could get indexed in a different way.
                'collection' : this
            });

            var spec = spec || {};

            if (tof(spec) == 'array') {
                spec = {
                    'load_array': spec
                };
            } else {
                if (tof(spec) == 'function') {
                    if (spec.abstract === true) {
                        //throw 'Collection with abstract spec function';

                        this._abstract = true;
                    } else {

                        if (is_constructor_fn(spec)) {

                            var chained_fields = Data_Object.get_chained_fields(spec);

                            var chained_fields_list = Data_Object.chained_fields_to_fields_list(chained_fields);

                            //console.log('***** chained_fields_list ' + stringify(chained_fields_list));

                            var index_field_names = [], field_name, field_text;
                            each(chained_fields_list, function(i, v) {
                                field_name = v[0];
                                field_text = v[1];

                                var isIndexed = field_text.indexOf('indexed') > -1;
                                var isUnique = field_text.indexOf('unique') > -1

                                if (isIndexed || isUnique) {
                                    index_field_names.push([field_name]);
                                }
                            });

                            // So, that does it :)
                            var old_spec = spec;
                            spec = {
                                'constraint': spec
                            };

                            if (old_spec == String) {
                                spec.index_by = 'value';
                            }

                            if (index_field_names.length > 0) {
                                spec.index_by = index_field_names;
                            }

                        }

                    }

                } else if (tof(spec) == 'string') {
                    // May be like with the constraint above.
                    // still need to set up the constructor function.

                    var map_native_constructors = {
                        'array': Array,
                        'boolean': Boolean,
                        'number': Number,
                        'string': String,
                        'object': Object
                    }

                    var nc = map_native_constructors[spec];

                    if (nc) {
                        spec = {
                            'constraint': nc
                        };
                        if (nc == String) {
                            spec.index_by = 'value';
                        }
                    }
                }
            }

            if (is_defined(spec.items)) {
                spec.load_array = spec.load_array || spec.items;
            }
            if (arr_values) {
                console.log('load arr_values ------------');
                spec.load_array = arr_values;
            }

            // keeping these things below the expected public interface.
            if (is_defined(spec.accepts)) {
                this._accepts = spec.accepts;
            }


            if (jsgui.__data_id_method == 'init') {
                // but maybe there will always be a context. May save download size on client too.
                if (this._context) {
                    this.__id = this._context.new_id(this.__type_name || this.__type);
                    this._context.map_objects[this.__id] = this;
                } else {
                    // don't think we want a whole bunch of objects mapped like this....
                    //  IDs will be very useful when they are controls... but maybe not always needed.

                    //this.__id = new_collection_id();
                    //map_jsgui_ids[this.__id] = this;
                }

            }

            if (!this.__type) {


            }
        }


        this._super(spec);
    },

    // maybe use fp, and otherwise apply with the same params and context.

   /**
    * @func
    * @param value
    */
    'set': function(value) {
        // get the tof(value)
        var tval = tof(value);

        //console.log('tval ' + tval);
        //throw('stop');
        var that = this;
        if (tval == 'data_object') {
            this.clear();
            return this.push(value);
        } else if (tval == 'array') {
            // for an array... clear, then add each.

            this.clear();
            // Not sure about making a new collection here... but maybe we could get it defined as a normal point.

            // But we could make a DataValue for the points.
            //  Could specify that points are stored as Data_Values.
            //   Maybe fixed length of 2.

            each(value, function(i, v) {
                that.push(v);
            });

        } else {
            if (tval == 'collection') {
                // need to reindex - though could have optimization that checks to see if the indexes are the same...
                throw 'stop';
                this.clear();
                value.each(function(i, v) {
                    that.push(v);
                })

            } else {
                return this._super(value);
            }


        }

    },

   /**
    * @func
    */
    'clear': function() {
        this._arr_idx = 0;
        this._arr = [];

        this.index_system = new Collection_Index_System({
            // The collection index system could have different default ways of indexing items.
            //  Each item that gets indexed could get indexed in a different way.
            'collection' : this
        });

        this.trigger('change', {
            'type': 'clear'
        })
    },

   /**
    * @func
    */
    'stringify': function() {
        var res = [];
        if (this._abstract) {
            // then we can hopefully get the datatype name

            // if it's abstract we detect it, otherwise it should be in there.
            var ncto = native_constructor_tof(this._type_constructor);

            res.push('~Collection(')
            if (ncto) {
                res.push(ncto);
            } else {

            }
            res.push(')');

        } else {
            res.push('Collection(');
            //console.log('obj._arr ' + stringify(obj._arr));

            var first = true;
            this.each(function(i, v) {
                if (!first) {
                    res.push(', ');
                } else {
                    first = false;
                }
                res.push(stringify(v));

            })

            res.push(')');
        }
        return res.join('');
    },

   /**
    * @func
    */
    'toString': function() {
        return stringify(this._arr);

    },

   /**
    * @func
    */
    'toObject': function() {
        var res = [];
        this.each(function(i, v) {
            res.push(v.toObject());
        });
        return res;
    },

   /**
    * @func
    * @param ...
    */
    'each' : fp(function(a, sig) {
        // was callback, context
        // ever given the context?

        if (sig == '[f]') {
            return each(this._arr, a[0]);
        } else {

            if (sig == '[X,f]') {
                // X for index

                // we use the order of the index.
                //  possibly we can iterate using the index itself, maybe with that same callback.

                var index = a[0];
                var callback = a[1];
                return index.each(callback);

            } else {
                if (a.l == 2) {
                    return each(this._arr, a[0], a[1]);
                }
            }
        }
    }),

    'eac' : fp(function(a, sig) {
        // was callback, context
        // ever given the context?

        if (sig == '[f]') {
            return eac(this._arr, a[0]);
        } else {

            if (sig == '[X,f]') {
                // X for index

                // we use the order of the index.
                //  possibly we can iterate using the index itself, maybe with that same callback.

                var index = a[0];
                var callback = a[1];
                return index.eac(callback);

            } else {
                if (a.l == 2) {
                    return eac(this._arr, a[0], a[1]);
                }
            }
        }
    }),


   /**
    * @func
    */
    '_id' : function() {
        // gets the id.


        if (this._context) {
            this.__id = this._context.new_id(this.__type_name || this.__type);
        } else {
            if (!is_defined(this.__id)) {

                // get a temporary id from somewhere?
                //  but the collection should really have a context...
                //  or without a context, the collection is its own context?

                // Won't go setting the ID for the moment.

                //this.__id = new_collection_id();
            }
        }
        return this.__id;

    },


   /**
    * @func
    */
    'length': function() {
        return this._arr.length;
    },


   /**
    * @func
    * @param ...
    */
    'find': fp(function(a, sig) {


        // var found = coll_presidents.find([['name', 'Franklin Pierce'], ['party', 'Republican']]);

        // it can be an array of fields.
        //console.log('collection find ' + sig);
        //console.log('a ' + stringify(a));
        if (a.l == 1) {

            // Make it so that index_system handles object queries...
            //  field: value

            var index_system_find_res = this.index_system.find(a[0]);
            //console.log('index_system_find_res ' + index_system_find_res);

            // How to know if these have been indexed or not.
            //  Perhaps the index system will only do certain queries.
            //  index_system.can_find would help.
            if (index_system_find_res === false) {
                // let's do the search ourself.
                // need to go through every object to see if it matches the search query.
                // Though the results may be better returned as a collection.
                var foundItems = [];
                each(this, function(index, item) {
                    //console.log('index ' + index);
                    //console.log('item ' + stringify(item));


                    // check each data item for the match.
                    throw 'stop';
                })
            } else {
                return index_system_find_res;
            }
            // if there is only one index in the system then the search will be simple.
        }

        // [o,s]
        //  finding a string value that's been specified using an object.
        //   It may indicate an attached field.
        //   We'll still be asking the index_system to find it.
        //   Need to be sure that [o,s] fields get indexed properly, and other indexes who's fields
        //    are specified by an object.
        //   {fieldName: {}} equivalent to 'fieldName'
        //    this will allow extended information to be added.
        //   We will be aware of what we are indexing, such as attached field names.
        //    Code when the index gets created
        //    Code when an item gets added to that index.
        //     Will need to check attached objects.

        if (sig == '[o,s]') {
            return this.index_system.find(a[0], a[1]);
        }

        //




        // and if looking for more than one thing...
        if (sig == '[s,s]') {
            return this.index_system.find(a[0], a[1]);
        }
        if (sig == '[a,s]') {
            return this.index_system.find(a[0], a[1]);
        }
        if (sig == '[s,o]') {
            var propertyName = a[0];
            var query = a[1];
            //console.log('propertyName ' + propertyName);
            //console.log('query ' + stringify(query));
            // Maybe return a Collection, not an array.
            // don't consult the index system.
            var foundItems = [];
            // for each object we need to go deeper into the fields.
            each(this, function(index, item) {
                //console.log('index ' + index);
                //console.log('item ' + stringify(item));

                //var matches = item.match(query);

                var itemProperty = item.get(propertyName);
                //console.log('itemProperty ' + stringify(itemProperty));

                //console.log('tof(itemProperty) ' + tof(itemProperty));
                var tip = tof(itemProperty);

                if (tip == 'array') {
                    // possibly should be a collection
                    each(itemProperty, function(i, v) {
                        //console.log('v ' + stringify(v));
                        var matches = obj_matches_query_obj(v, query);
                        //console.log('matches ' + matches);

                        if (matches) {
                            foundItems.push(v);
                        }
                    })
                }
                // check each data item for the match.
                //throw '!stop';
            })
            return new Collection(foundItems);
        }
    }),
    // get seems like the way to get unique values.


   /**
    * @func
    * @param ...
    */
    'get' : fp(function(a, sig, _super) {




        // integer... return the item from the collection.
        //console.log('collection get sig ' + sig);
        if (sig == '[n]' || sig == '[i]') {
            return this._arr[a[0]];
        }

        // getting by it's unique index?
        //  this may again refer to getting a property.

        if (sig == '[s]') {

            var ix_sys = this.index_system;
            var res;
            if (ix_sys) {
                //console.log('ix_sys', ix_sys);
                var pui = ix_sys._primary_unique_index;
                res = pui.get(a[0])[0];
            }

            if (res) {
                return res;
            }



            // Works differently when getting from an indexed collection.
            //  Need to look into the index_system
            //  there may be a primary_unique_index




            return Data_Object.prototype.get.apply(this, a);

        }
        // may take multiple params, specifying the fields in the
        // unique index.

    }),


    // insert_before could be useful.
    //  In some HTML controls want to insert one control before another one.


    // Will a control always know what position it's in?

   /**
    * @func
    * @param ...
    */
    'insert': function(item, pos) {
        // use array splice...
        //  then modify the index somehow.
        //  perhaps add 1 to each item's position past that point.
        //  may mean n operations on the index.
        //   some kind of offset tree could be useful for fast changes and keeping accurate lookups.

        this._arr.splice(pos, 0, item);

        // index system notify_insertion
        //  so the index system can make the adjustments to the other items.


        // then call the change event.
        //  and have event details saying an item i has been inserted at position p.
        //   for controls, that should be enough to render that control and put it onto the screen
        //   if the context is active.

        this.index_system.notify_insertion(pos);


        this.trigger('change', {
            'name': 'insert',
            'item': item,
            'pos': pos
        });




    },

    // may have efficiencies for adding and removing multiple items at once.
    //  can be sorted for insertion into index with more rapid algorithmic time.

   /**
    * @func
    * @param ...
    */
    'remove': fp(function(a, sig) {
        var that = this;

        //console.log('sig ' + sig);
        //throw 'stop';

        if (sig == '[n]') {

            var own_id = this._id();

            // remove the item at that position.

            var pos = a[0];
            var item = this._arr[pos];

            var o_item = item;
            //console.log('*');
            //console.log('item ' + stringify(item));

            var spliced_pos = pos;
            this._arr.splice(pos, 1);
            this._arr_idx--;
            var length = this._arr.length;
            while (pos < length) {

                // reassign the stored position of the item

                var item = this._arr[pos];

                item.relationships[own_id] = [that, pos];
                //console.log('');
                //console.log('item._parents[own_id] ' + stringify(item._parents[own_id]));
                pos++;
            }

            // need to remove that item from the index system as well.

            this.index_system.remove(o_item);
            // but is it no longer actually there?
            //  seems to be gone now.

            var e = {
                'target': this,
                'item': item,
                'position': spliced_pos
            }

            this.raise_event(that, 'remove', e);
        }

        // and if we are removing by a string key...

        if (sig == '[s]') {
            var key = a[0];

            // get the object...

            var obj = this.index_system.find([['value', key]]);

            //console.log('obj ' + stringify(obj));
            //console.log('tof(obj) ' + tof(obj));
            //throw 'stop'

            // and get the position within the parent.

            var my_id = this.__id;
            //console.log('my_id ' + my_id);
            //throw 'stop';

            var item_pos_within_this = obj[0]._relationships[my_id];
            //console.log('item_pos_within_this ' + item_pos_within_this);
            //throw 'stop';

            this.index_system.remove(key);
            this._arr.splice(item_pos_within_this, 1);

            // then adjust the positions downwards for each item afterwards.



            for (var c = item_pos_within_this, l = this._arr.length; c < l; c++) {
                //console.log('c ' + c);
                var item = this._arr[c];
                item._relationships[my_id]--;
            }

            var e = {
                'target': this,
                'item': obj[0],
                'position': item_pos_within_this
            }

            this.raise_event(that, 'remove', e);

        }

    }),

   /**
    * @func
    * @param obj_key
    */
    'has': function(obj_key) {
        // will operate differently depending on how the collection is being used.
        //console.log('this._data_type_constraint ' + stringify(this._data_type_constraint));
        if (this._data_type_constraint) {
            //console.log('this._data_type_constraint.data_type_constructor ' + stringify(this._data_type_constraint.data_type_constructor));
            if (this._data_type_constraint.data_type_constructor) {
                if(this._data_type_constraint.data_type_constructor === String) {
                    // collection of strings - does it have that string?
                    //console.log('this.index_system ' + stringify(this.index_system));
                    var found = this.index_system.find('value', obj_key);
                    //console.log('found ' + stringify(found));
                    //throw 'stop';
                    //return !!found;
                    return found.length > 0;
                }
            }
        }
    },

    // Set still operates as it does from the Data_Object.

    // Unique index being replaced with a constraint, and it also makes the index when the constraint is put in place if the index is not already there.


   /**
    * @func
    * @param ...
    */
    'get_index': fp(function(a, sig) {
        if (sig == '[s]') {
            return this.index_system.search(a[0]);
        }

    }),

    // has_index may be useful... perhaps this should be changed to index_by?
    //  other people may think this means it has an index (int) and returns that.

    // just need to be very clear about what this function does, could have an index_by function too.

    //

    // renamed index(), was index_by()

    // 'index' is actually going to be setting up constraints.
    //  // dealing with a layer of constraints may make sense, but it should probably be exposing the indexes.

    // Don't want to change the syntax, and make developers have to type 'Constraint' all the time, but I think that Constraints is the right
    //  way of expressing the underlying system, partly to aid transitions to databases, and its proven to be a flexible (inflexible) model.

   /**
    * @func
    * @param field
    */
    'find_unique_constraint': function(field) {
        // can be one field, or an array.

        // Perhaps the order of the fields here should be rearranged to alphabetical?
        //  In a constraint, the order of the fields should not matter - except it would set up an index using the order of the fields specified.
        //  the constraint could have the fields rearranged in alphabetical order.

        // There will be a bit of code bloat in some lower level components because they are not using Data_Object and Constraint classes themselves.
        //  Finding the right constraint out of the existing constraints is necessary when potentially adding a new constraint.
        //  Constraints having an alphabetically sorted list of fields?
        //  It is as though we can't use unique constraint code for this where otherwise it could have been used.

        // fields in alphabetical order...

        // want to be able to break out of each loops as well.
        //  posibly (i, v, break) and call the break function?

        var item = null;

        if (tof(field) == 'array') {

        } else if (tof(field) == 'string'){
            // it's just one string.
            each(this._unique_constraints, function(i, v, stop) {
                // does it match the field?
                if (v.fields === field) {
                    item = v;
                    stop();
                }
            })
        }
        //console.log('item ' + item);
        return item;
    },

    // The constraints will also be available, but they will likely make for a less user-friendly interface than fields.


   /**
    * @func
    * @param ...
    */
    'fields': fp(function(a, sig) {

        //console.log('Collection fields sig ' + sig);
        //console.log('Collection fields a ' + stringify(a));
        var that = this;
        // this will refer to the fields of the data_object_constraint.

        if (sig == '[o]') {
            // use a field definition constraint
            //  (a different way of doing the constraint, using json-like object, not using a Data_Object constructor.

            each(a[0], function(i, v) {
                that.set_field(i, v);
            });

            // set the constraints

            that.constraint(a[0]);

        } else {
            if (!this._data_object_constraint) {
                this._data_object_constraint = Constraint.from_obj(new Data_Object());
            }
            var doc = this._data_object_constraint;

            if (a.l == 0) {
                return doc.data_object.fc.get();
            }
            // if given an array, set the fields.

            //console.log('a.l ' + a.l);

            if (a.l == 1 && tof(a[0] == 'array')) {
                //console.log('array 1');
                return doc.data_object.fc.set(a[0]);
            }
        }


    }),

    // Getting quite in depth with generality and polymorphism here.
    //
    //  Perhaps there should be a _fields object.
    //  So far we have used constraints - there will be field constraints when fields are specified.
    //   Maybe it makes sense... a 'field' may correspond with indexes as well.

    // May be the fields from the prototype, as well as fields that have been added.

   /**
    * @func
    * @param ...
    */
    'set_field': fp(function(a, sig) {
        //console.log('set_field');
        // sets a field?
        //  maybe 'set' is a better word because it would overwrite existing fields.

        // will be able to add an individual field
        //  name and field type as string...
        var that = this;
        // we may have a data_def_constraint?
        //var that = this;

        // Fields get created using constraints.


        // Constraint from a new Data_Object?
        //  Not sure of the need of this.
        var doc = that._data_object_constraint = that._data_object_constraint || Constraint.from_obj(new Data_Object());


        //var doc = that._data_object_constraint ||
        //console.log('doc ' + stringify(doc));



        //console.log('set_field sig ' + sig);
        //console.log('set_field a ' + stringify(a));

        // Setting a field on a collection...
        //  Setting a constrinat?


        //if (doc) {
            if(a.l == 2 && tof(a[0]) == 'string') {
                doc.data_object.fc = doc.data_object.fc || new Data_Object_Field_Collection();

                // May need to set up indexing on the fields as well.


                return doc.data_object.fc.set(a[0], a[1]);
            }
        //}


    }),


   /**
    * @func
    * @param ...
    */
    'remove_field': fp(function(a, sig) {
        var doc = this._data_object_constraint;

        if (doc) {
            if (sig == '[s]') {
                return doc.data_object.fc.out(a[0]);
            }
        }


    }),
    // A constraint may reference an index.
    // It may need to create the index if it does not already exist.

    // Give a data type to give a type constraint.

   /**
    * @func
    */
    'get_data_type_constraint': function() {
        // there may just be one ._data_type_constraint.
        //  not having all the constraints listed together.

        return this._data_type_constraint;


    },

   /**
    * @func
    * @param ...
    */
    'constraint': fp(function(a, sig) {
        if (sig == '[]') {
            // Get all of the constraints.

            // if no constraints, return null.
            var res = null;

            if (this._data_type_constraint) {
                res = {
                    'data_type': this._data_type_constraint
                }
            }
            if (this._data_object_constraint) {
                res = res || {};
                res.data_object = this._data_object_constraint;
            }
            if (this._data_def_constraint) {
                res = res || {};
                res.data_def = this._data_def_constraint;
            }
            return res;
        }

        if (sig == '[o]') {
            this._data_def_constraint = new Constraint.Collection_Data_Def(a[0]);
        }

        if (sig == '[f]') {
            if (a[0] === Number) {
                //var cdtc = new Constraint.Collection_Data_Type(a[0]);
                this._data_type_constraint = new Constraint.Collection_Data_Type(a[0]);
                return this._data_type_constraint;
            }
            if (a[0] === String) {
                //var cdtc = new Constraint.Collection_Data_Type(String);
                this._data_type_constraint = new Constraint.Collection_Data_Type(a[0]);
                //console.log('this._data_type_constraint ' + this._data_type_constraint);
                return this._data_type_constraint;
            } else if (is_constructor_fn(a[0])) {

                //console.log('is_constructor_fn ');
                var data_type_constructor = a[0];
                // set up the data type constraint.
                //  can have a Type_Constraint on a collection... each object in the collection must satisfy that type.
                //   different to having it satisfy a particular data_object's constraints.
                var dtc = this._data_type_constraint;
                if (dtc) {
                    var cdtc = this._data_type_constraint.data_type_constructor;
                    if (cdtc && cdtc === data_type_constructor) {
                        //console.log('returning dtc');
                        return dtc;
                    }
                }
                this._data_type_constraint = new Constraint.Collection_Data_Type(data_type_constructor);
                //console.log('this._data_type_constraint ' + this._data_type_constraint);
                return this._data_type_constraint;
                // have a look at the existing data_type_constraint

            }
        }
        // ['unique', 'isbn-13']
        // ['unique', ['school_id', 'school_assigned_student_id']]

        // will need to ensure there is an index for that set of fields.

        // is it an array?
        //  could be an array of different constraints

        if (sig == '[D]') {
            var constraint = constraint_from_obj(a[0]);
            this._data_object_constraint = constraint;
        }
        if (sig == '[[s,s]]') {
            // A single constraint, with one string parameter (probably its field)

            var constraint_def = a[0];
            var constraint = constraint_from_obj(constraint_def);

            var c_type = constraint._constraint_type;
            //console.log('c_type ' + c_type);

            if (c_type == 'unique') {
                // ensure it has that unique constraint.
                //  this will mean going through all unique constraints, or checking its own index of them
                //  may have a bit of optimization here, but not using collections to implement this.
                //  collections will be used in many other things though. Will be useful for representing data models as well.

                // unique constraints,
                // NOT NULL,
                // Relationship
                // Check

                // The relationship constraints, when set up, will assist in creating the data models that accuratly model those relationships.
                // check if it already has that unique constraint.
                this._unique_constraints = this._unique_constraints || [];
                // get the index...
                // index_system.find_indexes_with_fields
                // get_unique_constraint?
                // find_unique_constraint(fields)
                //  that will be a function that does the specific search for an existing unique constraint with those fields.
                //  returns false if not found.
                // will use find_unique_constraint to see if there are already matching unique constraints.
                var field_name = constraint_def[1];
                //console.log('field_name ' + field_name);
                var existing_unique_constraint = this.find_unique_constraint(field_name);
                //console.log('existing_unique_constraint ' + existing_unique_constraint);

                if (existing_unique_constraint) {
                    return existing_unique_constraint;
                } else {

                    // look to see if there is an index that supports the constraint.
                    //  does not have to be a sorted index, necessarily.

                    // let's get an index, with those fields.

                    // it may be worth having the fields of various indexes sorted by name automatically.
                    //  would be useful for quick algorithmic comparison of which fields they are indexing.

                    // The optimal one would be the index in the same order, but failing that, an index with the fields in a different order can be used.
                    //  The order on the constraints does not matter so much, but it is nice to preserve whichever order the user specified initially.
                    // This will take more time and effort... but not a massive amount before the system is ready to be used.

                    // I think I should get my site running so it can host discussion about the system.
                    //  Having documentation on my site would be very good. It would be nice to measure the traffic and interest.

                    // There will be some features about doing some specific things.
                }
            }
        }
    }),

    // also could be expressed as a constraint and then the index is automatically put in place.
    // However, when an index is set, it's not setting a unique constraint automatically.

    // basically ensure_index for the moment.
    //  however, will also return the index, and with no params will get all indexes.
    //  will have nice syntax with ensuring multiple indexes at once.

    // Should possibly present nicer syntax to MongoDB with a wrapper.
    //  May have some different data wiring / connection options.
    // Likely to be best to do a lot in the abstract so changes can be viewed before being made.

   /**
    * @func
    * @param fields
    */
    'get_unique_constraint': function(fields) {
        if (tof(fields) == 'string') fields = [fields];
        each(this._unique_constraints, function(i, unique_constraint) {
            var uc_fields = unique_constraint.fields;
            //console.log('uc_fields ' + stringify(uc_fields));

            if (are_equal(uc_fields, fields)) return unique_constraint;
        });
    },

   /**
    * @func
    * @param ...
    */
    'unique': fp(function(a, sig) {
        var that = this;
        //console.log('a[0] ' + stringify(a[0]));

        if (sig == '[s]') {
            return this.unique([a[0]]);
        }
        if (tof(a[0]) == 'array') {
            if (is_arr_of_arrs(a[0])) {
                //console.log('is_arr_of_arrs');
            }
            if (is_arr_of_strs(a[0])) {
                var existing_uc = this.get_unique_constraint(a[0]);
                if (existing_uc) return existing_uc;
                var new_uc = new Constraint.Unique({
                    'fields': a[0]
                });
                this._unique_constraints = this._unique_constraints || [];
                this._unique_constraints.push(new_uc);
                var idx = this.index(a[0]);
                //console.log('');
                //console.log('idx ' + stringify(idx));
            }
        }
    }),

    // indexes
    //  will get all the indexes... may set a particular index? Or replace the indexes?

   /**
    * @func
    * @param ...
    */
    'indexes': fp(function(a, sig) {
        if (a.l == 0) {
            // get all indexes.
            // will look at the index system, and get the indexes from that.
            var index_system = this.index_system;
            //console.log('index_system ' + index_system);
            var indexes = index_system.indexes();
            return indexes;
        }
    }),
    // index_by - it sounds nice, reads well in code / samples.
    //  may just use the index() method, but that could call index_by to make things a bit clearer.


   /**
    * @func
    * @param ...
    */
    'index_by': fp(function(a, sig) {
        var that = this;
        //console.log('index_by a ' + stringify(a));
        //console.log('a.l ' + a.l);
        //console.log('index_by sig ' + sig);
        //console.log('a', a);
        //throw('stop');
        //console.log('tof(a[0]) ' + tof(a[0]));
        //if (a.l == 1 && tof(a[0]) == 'array') {
        if (sig == '[a]') {
            console.log('a[0] ' + stringify(a[0]));

            if (is_arr_of_strs(a[0])) {
                // then it's a single index.
                //console.log('is_arr_of_strs ' + stringify(a[0]));
                var relevant_index = this.index_system.get_index_starting(a[0]);
                //console.log('relevant_index ' + relevant_index);
                if (relevant_index) {
                    return relevant_index;

                } else {
                    var index_spec = a[0];
                    var new_index = this.index_system.ensure_index(index_spec);
                    return new_index;
                }
            }
            // If it's an array of arrays... it's an array of indexes.
            if (is_arr_of_arrs(a[0])) {
                // deal with each of them in turn.
                //console.log('it is_arr_of_arrs');
                each(a[0], function(i, specified_index) {
                    that.index(specified_index);
                });
            }
        }

        // otherwise, we'll be taking a map of what to index and what type of index to use there.

        // get the index, based on that name?
        if (sig == '[s]') {

            // Tell the index to sort itself based on that value.



            return that.index({
                'sorted': [[a[0]]]
            });
        }

        if (sig == '[o]') {
            //console.log('object sig');

            var index_map = a[0];
            //console.log('index_map ' + stringify(index_map));

            each(index_map, function(index_type, index_definition) {

                //console.log('index_definition', index_definition);
                //console.log('index_type ' + index_type);
                if (index_type == 'sorted') {
                    // set up the individual index of the specified type.

                    //if (index_type == 'sorted') {
                    //console.log('index_definition ' + stringify(index_definition));
                    if (tof(index_definition) == 'array') {
                        // is it an array of strings? then it is the fields?
                        // is it an array of arrays?
                        if (is_arr_of_arrs(index_definition)) {
                            // each index, each field in the index
                            var indexes = [];



                            each(index_definition, function(i, individual_index_fields) {
                                // then will have a bunch of fields
                                //console.log('individual_index_fields ' + stringify(individual_index_fields));

                                // Setting the fields of a Collection_Index...
                                //  need to be careful when the field is an attached object.
                                //   may use JSON notation for the attachement.
                                //   likely to disallow quotes and (square) brackets in field names.



                                // Make it so Sorted_Collection_Index can handle attached objects.
                                //  fields set like [{"attached": {"meta": "name"}}]
                                //  where a field is specified as an object,

                                // So the index gets created.
                                //  It has those fields...
                                //   where to they get made within the Sorted_Collection_Index constructor?

                                //console.log('individual_index_fields', individual_index_fields);


                                var index = new Sorted_Collection_Index({
                                    'fields' : individual_index_fields
                                });

                                // These collection indexes should have a 'get' function.

                                that.index_system.set_index(index);
                                indexes.push(index);

                            });

                            //console.log('indexes', indexes);

                            that.index_system._primary_unique_index = indexes[0];
                            return indexes[0];
                        }
                        if (is_arr_of_strs(index_definition)) {
                            // one index, with fields
                        }

                    }

                    //}
                }
            })
        }
    }),

   /**
    * @func
    * @param ...
    */
    'index': fp(function(a, sig) {

        if (a.l == 1) {
            return this.index_by(a[0]);
        }


    }),


   /**
    * @func
    * @param obj
    */
    'test_object_against_constraints': function(obj) {
        // will do the test for the various constraints
        //console.log('test_object_against_constraints');
        //var res_test_data_object_constraint =
        //console.log('this._type_constructor ' + this._type_constructor);
        //console.log('this._data_object_constraint ' + stringify(this._data_object_constraint));
        //console.log('this._data_type_constraint ' + stringify(this._data_type_constraint));

        //console.log('obj ' + stringify(obj));
        // Could also have a constructor type - can check instance of

        if (this._type_constructor) {
            if (!obj instanceof this._type_constructor) return false;
        }

        if (this._data_object_constraint) {
            // not sure why this will have a _data_object_constraint in various cases.
            //console.log('this._data_object_constraint', this._data_object_constraint);

            if (!this._data_object_constraint.match(obj)) return false;
        }

        if (this._data_type_constraint) {
            // test against that constraint
            if (!this._data_type_constraint.match(obj)) return false;
        }

        var that = this;

        var res = true;
        each(this._unique_constraints, function(i, unique_constraint) {
            //console.log('unique_constraint ' + stringify(unique_constraint));
            // then test against that unique constraint.

            // get the fields of the constraint, then try to get a record with those fields

            var uc_fields = unique_constraint.fields;
            //console.log('uc_fields ' + stringify(uc_fields));

            // then attempt to 'get', using these fields.
            //  performing a record count would be more efficient though.
            //  'has' search, returns boolean

            var find_params = [];
            each(uc_fields, function(i, field_name) {
                // get the value

                var field_value = obj.get(field_name);
                find_params.push([field_name, field_value]);

            });
            //console.log('find_params ' + stringify(find_params));

            var found = that.find(find_params);
            //console.log('found ' + stringify(found));

            if (found && found.length > 0) {
                res = false;
            }
        });
        return res;
    },


   /**
    * @func
    * @param value
    */

    // Sometimes wrap a normal JS obj as a Data_Value, Data_Object or Collection?



    'push': function(value) {

        var tv = tof(value);
        //console.log('1) collection push value: ' + stringify(value));
        //console.log('--------------------')
        //console.log('push tv ' + tv);

        if (tv == 'object') {

            var dtc = this._data_type_constraint;
            //  but we can have an object definition constraint?
            //  is that a type of data_type_constraint?
            //console.log('dtc ' + dtc);

            if (dtc) {
                var dtcon = dtc.data_type_constructor;
                //console.log('dtcon ' + dtcon);
                value = new dtcon(value);
            } else {
                var ddc = this._data_def_constraint;
                //console.log('ddc ' + stringify(ddc));

                // need to see if it matches the constraint.
                //console.log('value ' + stringify(value));
                // Will need something recursive to see if something matches a data_def.
                //  in the data_def_constrint code.
                var match = true;
                if (ddc) match = ddc.match(value);
                //console.log('match ' + match);

                if (!match) {
                    throw 'Does not match data_def constraint';
                } else {
                    // need to create a new data_object with that data_def?
                    //  or could set the fields?
                    //  Fields could respond to data_def.
                    //   But data_def could encompass more than just fields.

                    // And a Data_Object could have a data_def_constraint too.
                    //  That would also set its fields.

                    // Will just set the fields with the data_def for now???
                    //value = dobj(value);
                    // Would be better to make an enhanced_data_object here

                    //value = new
                    //console.log('* value ' + stringify(value));
                    if (ddc) {
                        value = dobj(value, ddc.data_def);
                    } else {
                        value = dobj(value);
                    }
                    //console.log('value ' + stringify(value));
                    // set its constraints...
                    value.constraints(ddc);
                    // Using the collection data definition constraint, should be able to set the inner constaint of the
                    //  data_object. May just use the same object rather than cloning it.
                }

                //value = dobj(value);
            }
            tv = tof(value);
            //console.log('tv ' + tv);
            //console.log('value ' + value);
        }

        //console.log('collection push tv: ' + tv);
        //console.log('2) collection push value: ' + stringify(value));
        // so, a data_item gets added at this._arr_idx

        // also need to be add a collection to the collection.
        //  that will be a lot like with Data_Object.
        //   There can't really be full automatic indexing here.

        if (tv == 'collection') {
            //console.log('1) pre test_object_against_constraints');
            var constraints_test_res = this.test_object_against_constraints(value);
            //console.log('constraints_test_res ' + constraints_test_res);
            if (constraints_test_res) {
                this.index_system.unsafe_add_object(value);
                var pos = this._arr.length;
                this._arr.push(value);

                // but does this have a context?
                //  A content collection should have the same context as the control it's in.
                value.parent(this, pos);

                var e = {
                    'target': this,
                    'item': value,
                    'position': pos,
                    'type': 'insert'
                }
                //console.log('adding collection to collection event being raised');
                // raise a change event.
                //  have a change type, like add or insert.

                //this.raise_event('add', e);
                this.raise_event('change', e);

                this._arr_idx++;
            } else {
                var stack = new Error().stack
                //console.log( stack );
                throw('Collection constraint(s) not satisfied');
            }
        }
        if (tv == 'data_object' || tv == 'control') {

            //console.log('pre constraints test');
            //console.log('2) pre test_object_against_constraints');
            var constraints_test_res = this.test_object_against_constraints(value);
            //console.log('post constraints test');
            // the uniqueness test is an important one too.
            //  when a unique constraint is set up, the index should be created.
            //console.log('constraints_test_res ' + constraints_test_res);
            // would be testing against a unique constraint.
            //  can test to see if a new object would violate a collection constraint?
            //console.log('constraints_test_res ' + constraints_test_res);
            if (constraints_test_res) {

                //console.log('pre unsafe_add_object value', stringify(value));

                //console.log('pre this.index_system.unsafe_add_object');

                this.index_system.unsafe_add_object(value);

                //console.log('post this.index_system.unsafe_add_object');
                // gets added to the index... but is its position within this collection stored too?
                //console.log('post unsafe_add_object');
                // Things do get a bit complicated with needing the positions within the collection to do various things.
                // Don't want to rely on it always being stored in the indexes though.

                var pos = this._arr.length;
                this._arr.push(value);
                // the position within the parent / the parent's array.
                //console.log('pos ' + pos);
                var e = {
                    'target': this,
                    'item': value,
                    'position': pos,
                    'type': 'insert'
                }
                //value._relationships[this._id()] = this._arr_idx;
                //console.log('adding data_object to collection event being raised');
                // this, and the position it's going to.


                // Should set the parent and the position within the parent.
                //  __index perhaps?

                value.parent(this, pos);

                // item can have multiple parents... that should be possible.
                //console.log('pre raise add event');

                // This bit is taking a while.
                //  Not sure why!!! Has to do with objects being put in a large collection probably.
                //  Too many things, in the wrong context, getting notified.
                //console.log('pre collection raise change event');

                this.raise_event('change', e);
                // raise event being called, but not fired as expected???

                //console.log('post raise change event');


                //console.log('post raise add event');
                // accessed using a 'parent' array / mini-collection?
                // mini-collection, handling collections without the bells and whistles?
                //  or collections with some things disabled?

                // value.parent(this)

                // location within parent...
                //  should probably / possibly make this clearer in code?
                //  not so sure that the position tracking will work all the times.
                //  may be best to separate the position, or give it some kind of variable name.
                // will do more work and testing on this later.
                this._arr_idx++;
            } else {
                var stack = new Error().stack
                //console.log( stack );
                throw('Collection constraint(s) not satisfied');
            }
            // check if the index system can add the object.
        }

        if (tv == 'array') {
            // wrap it or not? could put it in another collection.
            //  will that be useful for a function's parameters?
            //  that would maintain the whole system with the wrapper and relationships.
            // I think we do that... turn it into a new collection and put it in there.
            //  Will get for some more complex behaviours, but they could prove pretty useful.
            // Could make a copyleft licence wrapper - any code that runs it needs to be wrapped by that function.
            // for the moment, I think we create a new collection wrapper to hold the array.
            // need to basically add an array object to the collection, but have it wrapped.

            //var coll = new Collection(value);
            //return this.push(coll);
            return this.push(new Collection(value));
        }

        if (tv == 'string' || tv == 'number') {

            //console.log('tv ' + tv);
            // still need to check if it matched the collection constraint(s).
            //console.log('3) pre test_object_against_constraints');



            var constraints_test_res = this.test_object_against_constraints(value);
            //console.log('constraints_test_res ' + constraints_test_res);
            if (constraints_test_res) {
                var dv = new Data_Value({'value': value});
                //console.log('dv ' + stringify(dv));
                var pos = this._arr.length;
                // Should not need a context or ID just to be put in place.
                this._arr.push(dv);
                var e = {
                    'target': this,
                    'item': dv,
                    'position': pos,
                    'type': 'insert'
                }
                this.raise_event('change', e);

                if (tv == 'string') {
                    // indexing the value
                    this.index_system.unsafe_add_object(dv);
                }
            } else {
                console.trace();
                throw('wrong data type');
            }
        }
        this._arr_idx++;
        return value;
    },


   /**
    * @func
    * @param value
    */
    //'add': function(value) {
    //    return this.push(value);
    //},


   /**
    * @func
    * @param arr
    */
    'load_array': function(arr) {
        var that = this;
        //console.log('load_array arr ' + stringify(arr));
        // there could be a data type that this is expecting... a constraint?
        //  could have a data type constructor.
        // so, if the item given is not a Data_Object, we can try making the Data_Object, and putting it in place.
        var dtc = this._data_type_constraint;
        //console.log('dtc ' + dtc);

        // May also need to change ID values on the objects?
        //  Create clones of the objects with different ID values?

        // Be able to accept items being pushed that will have IDs changed?

        // Should have a data_type_constructor with typed collections.



        if (dtc) {
            // is a Collection_Data_Type_Constraint
            var data_type_constructor = dtc.data_type_constructor;
            //console.log('data_type_constructor ' + data_type_constructor);

            /*
            each(arr, function(i, v) {
                that.push(v);
            });
            */
            for (var c = 0, l = arr.length; c < l; c++) {
                that.push(arr[c]);
            }


        } else {
            /*
            each(arr, function(i, v) {

                that.push(v);
            });
            */
            for (var c = 0, l = arr.length; c < l; c++) {
                that.push(arr[c]);
            }
        }
        this.raise_event('load');
    },


   /**
    * polymorphic version
    * @name values
    * @func
    * @param {string} parm1 - param description
    * @memberof module:core/collection
    * @inner
    */

   /**
    * @func
    * @param ...
    * @variation 2
    */
    'values': fp(function(a, sig) {
        if (a.l == 0) {
            return this._arr;
        } else {
            var stack = new Error().stack;
            //console.log(stack);
            //console.log('');
            //console.log('sig ' + sig);
            // should be setting the values.
            throw 'not yet implemented';
        }
    }),


   /**
    * @func
    */
    'value': function() {
        var res = [];
        this.each(function(i, v) {
            if (typeof v.value == 'function') {
                //res[i] = v.value();
                res.push(v.value());
            } else {
                res.push(v);
            }

        });
        return res;
    }

    // insert_at seems very important.



    // all the collection's values
    // values() will get or set all the values.

// Could use a (new) extension of Data_Object.extend.
//  We want it so that we can specify a 'data_object' when defining a class, and this
//   sets up a ._data_object_constraint using .constraint(D)
//    though we are giving it a Data_Object subclass constructor.





});

var p = Collection.prototype;
p.add = p.push;


/**
 * @function
 * @static
 */
Collection.extend = function() {
    var a = arguments;
    var args = [a[0]];
    // call Data_Object.extend with another function for post-initialization?

    if (a[0].data_object) {
        //console.log('extending a Collection with .data_object');
        args.push(function() {
            // post-init function to get called after the init function.

            this.constraint(a[0].data_object);
        })
        //throw 'stop';
    }
    // execute a post-init function in order to set the constraint in some circumstances?
    //var args = [a[0]]


    var res = Data_Object.extend.apply(this, args);


    return res;

}

module.exports = Collection;

	//return Collection;
//});
