/*

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./jsgui-lang-util", "./data-object-fields-collection"], function(jsgui, Fields_Collection) {
    */

var jsgui = require('./jsgui-lang-util');
var Data_Value = require('./data-value');
var Data_Object = require('./data-object');
var Fields_Collection = require('./data-object-fields-collection');

var Data_Object = jsgui.Data_Object;
var Collection = jsgui.Collection;

var fp = jsgui.fp;
var stringify = jsgui.stringify;
// Using actual JavaScript objects like String should be quite good.
//  JavaScript Primitive Contructors.

var is_defined = jsgui.is_defined, ll_get = jsgui.ll_get, get_item_sig = jsgui.get_item_sig;

// Having a Collection of strings here...
//  May need to choose the right collection context.
//  Don't want to have to deal with these contexts all the time though.
//   Or make it very fast to do so.

// A function to ensure the latest data types?

// Module level functions to register / syncronise things...
//  That makes a lot of sense.

var register_data_type = function(data_type_name, def) {
    jsgui.data_types_info[data_type_name] = def;
}

var ensure_data_type_data_object_constructor = function(data_type_name) {
    //console.log('ENH ensure_data_type_data_object_constructor');
    //console.log('data_type_name ' + data_type_name);

    if (!jsgui.map_data_type_data_object_constructors[data_type_name]) {

        // Can we get it from the most up-to-date module?
        //  Or even make use of a global variable?
        //  JSGUI?




        var dto = jsgui.data_types_info[data_type_name];
        //console.log('dto ' + stringify(dto));

        // Do we need to be accessing the latest data here?
        //  Can we patch the required component backwards?



        var dtc = Enhanced_Data_Object.extend({
            'fields': dto
        })
        jsgui.map_data_type_data_object_constructors[data_type_name] = dtc;
    }
    return jsgui.map_data_type_data_object_constructors[data_type_name];
}
// Maybe the Enhanced_Data_Object will have access to Collection?
var dop = Data_Object.prototype;
var do_init = dop.init;
var do_get = dop.get;

// And making it a collection will give it good enough indexing anyway.
var Enhanced_Data_Object = Data_Object.extend({
    // Can we define a Collection like that?

    // the flags is a collection of strings... but we want to connect the flags.

    // But we can choose the context for the object.
    //  Will need to do that.

    // But maybe object could only have flags if they are used?
    //  Dormant fields?

    // Collection(String) being in the general context?
    //  It could be a special case, for abstract collections.
    //  Also, not using the 'new' keyword.

    'fields': [['flags', Collection(String)]],

    // Collection(String) may be hard to understand... Collection is a Class and is normally called with a constructor.
    //  It has not normally been declared with a native data type inside (or any data type) but it could be done and is convenient
    //   syntax. I think without the constructor, but with the object inside, it could be an abstract or representative object,
    //   and used so that we know Collection(String) is a collection of strings (probably implemented using Data_Value objects).

    // so will this flags field start up OK?
    //  that should be enough to get the flags field there.

    //'init': function(spec) {
    //	this._super(spec);
    //},

    /*

    'init': function(spec) {
        //this._super(spec);
        do_init.call(this, spec);
        // need to respond to flag fields being added and removed.
        //  when a flag gets added, there needs to be the flag's connected function.

        //.flags().selected?
        //.flags('selected');

        // .selected(true); .selected(1);

        // can leave the flags unconnected for the moment, and return to the flags connection so there is
        //  easier syntax and probably faster code.

        // but want it so we know when flags have changed (the collection of flags)?

        // also when any flags' value has changed.

        // can quite simply add and remove flags from an object.
        //  also may pay some attention to a restricted list of flags, where if the flags are not set then we know
        //  the values are false.

        // want to make it easy to deal with flags that correspond to css as well.

    },
    */
    // or an enhanced version of the set function that deals with more input processors?
    //  Or have the supercalssed set function send mack the input processors in parameters.
    //   I think that is the best option.

    '_get_input_processors': function() {
        //throw 'stop';
        return jsgui.input_processors;
    },
    'add_flag': function(flag_name) {
        var flags = this.get('flags');
        //console.log('flags ' + stringify(flags));
        var fields = this.fields();
        //console.log('fields ' + stringify(fields));
        // unfortunate that no fields are found???
        //  should probably be a few.
        if (!flags.has(flag_name)) {
            flags.add(flag_name);
        }
    },
    'remove_flag': function(flag_name) {
        var flags = this.get('flags');
        //console.log('flags ' + stringify(flags));
        //throw 'stop';
        var has_flag = flags.has(flag_name);
        //console.log('has_flag ' + has_flag);

        if (has_flag) {
            flags.remove(flag_name);
            console.log('flags ' + stringify(flags));

            flags = this.get('flags');
            console.log('flags ' + stringify(flags));
            //throw 'stop';
        }

    },
    'has_flag': function(flag_name) {
        var flags = this.get('flags');
        return flags.has(flag_name);
    },

    // copied from Data_Object because Data_Object was not able to deal with collections within itself.
    //  code works, but should make this call data_object code where possible.

    'get': fp(function(a, sig) {
        // More difficult to maintain with the separate get code.
        //  Handle specific cases here, otherwise use _super.

        // In some cases, an automatically constructed object, like a control_dom, should have fields.

        // but when nested is in place, is it still working right?
        // also will have to deal with particular output formats.
        //  many controls / data types for the moment will have default output as HTML formatted.
        //console.log('Data_Object get this.__data_type_name ' + this.__data_type_name);
        //console.log('Enhanced_Data_Object get a ' + stringify(a));
        //console.log('Enhanced_Data_Object get sig ' + sig);
        // will also be looking at the output processors.
        //console.log('this.__data_type_name ' + this.__data_type_name);
        if (is_defined(this.__data_type_name)) {
            // should possibly have this assigned for controls...
            //var raw_input = a;
            //console.log('this.__data_type_name is defined: ' + this.__data_type_name);

            //var parsed_input_obj = jsgui.input_processors[this.__data_type_name](raw_input);
            //this._super.apply(this, a);
            do_get.apply(this, a);

        } else {
            // check to see if there is a field defined.
            if (sig == '[s]') {
                //console.log('get param: ' + a[0]);

                if (!this.fc) this.fc = new Fields_Collection({
                    //
                    //'containing_object': this
                });

                var fc = this.fc;

                //console.log('fc ' + (fc));

                //console.log('fc.get() ' + stringify(fc.get()));
                var field_name = a[0];
                //console.log('field_name ' + field_name);
                //console.log('this.fields() ' + stringify(this.fields()));
                // could have .s in it, making it nested, and have removed nested from here.
                //console.log('pre fc get');
                var field = fc.get(field_name);
                //console.log('EDO field ' + stringify(field));

                if (field_name.indexOf('.') > -1) {

                    //console.log('EDO get has field ' + field_name);

                    // Then we are dealing with a request for a nested object.
                    // Split up the field_name into the various field names for the levels, then have a recursive function here
                    //  process through the levels. Will keep the recursive part small in size and located here.
                    // May not need to even be recursive.
                    var arr_field_names = field_name.split('.');

                    var level = 0, l = arr_field_names.length;
                    var current_obj = this, new_obj, fname;
                    while (level < l) {
                        fname = arr_field_names[level];
                        new_obj = current_obj.get(fname);
                        //console.log('fname ' + fname);

                        // So, when the dom object is obtained, it should have its own fields.
                        //  The 'get' function will need to be modified to return objects of the right type / class.

                        //console.log('new_obj ' + stringify(new_obj));
                        //console.log('current_obj ' + stringify(current_obj));

                        level++;
                        current_obj = new_obj;
                    }
                    return current_obj;
                }

                //console.log('field ' + stringify(field));

                // fields seem to stop having been set up properly.

                //console.log('field ' + (field));


                //console.log('* field_name ' + field_name);
                //console.log('* field ' + stringify(field));


                if (field) {
                    // May not be able to stringify the field object without making an infinite loop / call stack error.
                    //console.log('this._[field_name] ' + stringify(this._[field_name]));
                    //console.log('field_name ' + field_name);
                    // So the DOM attributes were not created properly.




                    if (!this._[field_name]) {
                        //console.log('does not have field already');

                        var sig_field = get_item_sig(field, 20);
                        //console.log('');
                        //console.log('---------------');
                        //console.log('');
                        //console.log('enhanced data_object sig_field ' + stringify(sig_field));
                        //console.log('field ' + stringify(field));

                        //console.log('sig_field ' + sig_field);


                        if (sig_field == '[s,[s,u]]') {
                            // it looks like it has gone wrong.
                            var stack = new Error().stack;
                            console.log(stack);
                        }

                        // ss?
                        // s,s,b
                        //  the last param is the default value???
                        //   not right now.

                        if (sig_field == '[s,s,o]') {
                            var field_name = field[0];
                            var field_type_name = field[1];

                            // default_value?

                            var field_info = field[2];

                            //console.log('field_type_name ' + field_type_name);



                            if (field_type_name == 'collection') {
                                //console.log('lazy loading - creating new collection');
                                this._[field_name] = new jsgui.Collection({
                                    'context': this._context
                                });
                                return this._[field_name];
                            } else {
                                // if it's just a string?
                                if (field_type_name == 'ordered_string_list') {
                                    var osl = new Ordered_String_List();
                                    this._[field_name] = osl;
                                    return this._[field_name];
                                } else if (field_type_name == 'string') {
                                    // use a Data_Value?
                                    // Data value with no context?

                                    //var dv = new Data_Value({
                                        //'context': this._context
                                    //});
                                    // Tell the Data_Value it's a string only?
                                    // context?
                                    var dv = new Data_Value({
                                        'context': this._context
                                    });

                                    if (field_info.default) {
                                        dv.set(field_info.default);
                                    }


                                    //dv.set()

                                    this._[field_name] = dv;
                                    dv.parent(this);
                                    return this._[field_name];
                                } else {
                                    //console.log('');
                                    //console.log('field_type_name ' + field_type_name);

                                    var default_value = field_info.default;
                                    //console.log('')



                                    //var dtoc = this.mod_link().ensure_data_type_data_object_constructor(field_type_name);
                                    var dtoc = ensure_data_type_data_object_constructor(field_type_name);

                                    var context = this.context;
                                    if (context) {
                                        var field_val = new dtoc({'context': this._context});
                                    } else {
                                        var field_val = new dtoc();
                                    }
                                    if (is_defined(default_value)) {
                                        field_val.set(default_value);
                                    }

                                    //throw 'stop';

                                    field_val.parent(this);
                                    this._[field_name] = field_val;
                                    return this._[field_name];
                                }
                            }

                        } else if (sig_field == '[s,s]') {
                            //console.log('!!!!!');
                            //console.log('field ' + stringify(field));
                            var field_name = field[0];
                            var field_type_name = field[1];

                            //console.log('field_name ' + field_name);
                            //console.log('field_type_name ' + field_type_name);

                            // perhaps getting collection fields should be moved to enhanced_data_object?
                            //  not keen on interdependencies here.

                            if (field_type_name == 'collection') {

                                // lazy creation of fields.

                                //throw 'not supported here. should use code in enhanced-data-object.

                                // So, Collection has been added to jsgui by now.
                                //console.log('pre make coll');

                                // Maybe Collection has not been added to jsgui.
                                //  Need to ensure it does get added when it's getting used.

                                // seems like the Collection object does not get put back on this...
                                //  or at least not always.

                                // looks like we use the module as it is.

                                var coll = new jsgui.Collection({
                                    'context': this._context
                                });

                                //console.log('pre set coll parent');
                                coll.parent(this);

                                this._[field_name] = coll;
                                return this._[field_name];

                            } else if (field_type_name == 'control') {
                                // want to put the control in place basically.
                                //  but it the control is not there, we can't get it.
                                // no lazy loading of controls like for other data items.
                                return undefined;


                            } else if (field_type_name == 'string') {
                                var dv = new Data_Value();
                                dv.parent(this);
                                this._[field_name] = dv;
                            } else {
                                    //

                                // a different function?
                                //  we could look for the input processors?
                                // Then use the input processor to create a Data Object or Data Value.
                                var input_processors;
                                var data_type_info;
                                var module_jsgui = this._module_jsgui;
                                //console.log('module_jsgui ' + module_jsgui);

                                // Need a way to get back to the common jsgui module.


                                if (module_jsgui) {
                                    input_processors = module_jsgui.input_processors;
                                    data_types_info = module_jsgui.data_types_info;

                                    //console.log('data_types_info ' + stringify(data_types_info));

                                    // so we may have the information needed to construct such a Data_Object.

                                    // This needs to be set in various objects.


                                    // Shoudl make be careful to ensure these exist...
                                    //  Need the constructor for the control_dom object.

                                    // Perhaps doing a sub-project on the data system is worth it?
                                    //  Or do that once the basis is working for HTML serving?


                                    // but will we have data object constructors for this yet?
                                    object_constructor = module_jsgui.map_data_type_data_object_constructors[field_type_name];

                                    //console.log('object_constructor ' + stringify(object_constructor));

                                    // ensure_data_type_data_object_constructor
                                    //  that is used where we have the data type definition for that data type.

                                    // and look at the data types object constructors?
                                    //  or data types constructos.
                                    if (object_constructor) {

                                        var obj = new object_constructor({'context': this._context});
                                        obj.parent(this);

                                        this._[field_name] = obj;
                                        return obj;
                                    }


                                    //throw 'stop';
                                };

                                //console.log('input_processors[field_type_name] ' + input_processors[field_type_name]);
                                // so we may have an input processor for the data.
                                //  However, we may also have information about how to construct a data object with the data.

                                // not just the input processors... we need the data type info.

                                // data_type_info



                                //if (input_processors[field_type_name]) {
                                //	var processed_value = input_processors[field_type_name]()

                                //}

                                // OK, but this will need to actually create a new constructor for an empty object, and set it in place.
                                //  We have some kind of a linking to the later modules.
                                // Need to do some kind of back-referencing because we don't have global variables.
                                //  _module_jsgui will be enough for now.
                                //   It should get overwritten before object construction, so should be at an advanced level with
                                //    instances of advanced objects.
                                //   May be removed when JS is put into one large code file.

                                // I think defining data type object constructors may make sense...
                                //  Like for an indexed array?




                                // dtoc = this.mod_link().ensure_data_type_data_object_constructor(field_type_name);
                                //console.log('dtoc ' + dtoc);

                                // then use this to construct the empty field.
                                //  without the new constructor it was trying to make an abstract version!!!
                                //var obj = new dtoc({'context': this._context});
                                //if (this._context) obj._context = this._context;
                                //obj.parent(this);

                                //this._[field_name] = obj;

                            }

                                //console.log('this._ ' + stringify(this._));

                            return this._[field_name];

                        } else if (sig_field == '[s,[s,s]]') {
                            var field_name = field[0];
                            var field_info = field[1];


                            //console.log('field_info ' + stringify(field_info));

                            if (field_info[0] == 'collection') {
                                var collection_type_name = field_info[1];
                                var ncoll = new jsgui.Collection({'context': this._context});
                                ncoll.parent(this);
                                this._[field_name] = ncoll;
                                return this._[field_name];
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
                                //throw 'not supported here. should use code in enhanced-data-object.';

                                // Need to do more than this.
                                //  Defining a collection with a specified data type.
                                var ncoll = new jsgui.Collection({'context': this._context});
                                // Specifying a collection constraint as well (perhaps these are fields for the obejcts)
                                //  I think calling it a collection constraint with specified fields for the objects makes
                                //  sense.
                                console.log('objDef ' + stringify(objDef));
                                // will be an object rather than array (for now at least)

                                // Not sure about setting through fields...
                                ncoll.fields(objDef);
                                // that should set the constraint as well.
                                //ncoll.

                                // Specifying fields on a collection.
                                //  Need to say itemFields, as a collection itself could have fields as well as
                                //   items contained? Or the collection's fields apply to each item.



                                //var ncoll = new jsgui.Collection(collection_type_name);
                                if (this._context) ncoll._context = this._context;

                                ncoll.parent(this);
                                this._[field_name] = ncoll;
                                return this._[field_name];
                            }

                        }

                    } else {
                        return this._[field_name];
                    }
                } else {
                    //console.log('this._ ' + stringify(this._));

                    var res = ll_get(this._, a[0]);

                    if (!res) {
                        if (field_name.indexOf('.') > -1) {
                            throw 'not yet handled';
                        } else {
                            res = this[a[0]];
                        }
                    }

                    //console.log('res ' + res);

                    //if (!is_defined(res)) {
                        // No, don't thin we just create a new one. It may need to get overwritten by some other code.



                        //res = new Enhanced_Data_Object({'context': this._context});
                    //}

                    //console.log('property_name ' + property_name);
                    //console.log('res ' + res);
                    return res;
                }
            } else if (a.l == 0) {
                return this._;
            }
        }
    })



    // oh but this is treated differently...
    //  may wish to set the flags property?

    // need a different name for this?
    // or just don't need that function with flags connected?

    /*

    'flags': fp(function(a, sig) {
        if (sig == '[s,b]') {
            var flags = this.get('flags');
            console.log('flags ' + stringify(flags));


        }

    })
    */

    // OK, but we may also want some of these fields to work with css as well.

    // When defining css flags in the Control... they are normal flags, but they also
    //  have a corresponding css class.

    // data_object.flag_item(true);
    // data_object.flag_item(false);
    // data_object.flag_item('toggle');
    //  data_object.flag_item(-1); ??? looks confusing. but could be ok.

});

// Data_Object.extend = function(prop, namespcExtension, propsToMerge) {

Enhanced_Data_Object.extend = function(prop, namespcExtension, propsToMerge) {
    //var res = Data_Object.extend(prop, namespcExtension, propsToMerge);
    var res = Data_Object.extend.call(this, prop, namespcExtension, propsToMerge);
    // but the fields are not going in properly.???
    // quite possibly need to set up the fields (_fields on the Enhanced_Data_Object object.
    // but need to merge the properties from this...
    // but also need to look out for the flags.
    // if in the prop or map_props there is something called 'flags' we need to pay attention.
    //  That will then get put in the prototype (or constructor?)
    /*
    for (var name in prop) {

    }
    */
    if (prop.flags) {
        //res[
        res._flags = prop.flags;
    }
    return res;
}


jsgui.ensure_data_type_data_object_constructor = ensure_data_type_data_object_constructor;

Enhanced_Data_Object.map_data_type_data_object_constructors = Data_Object.map_data_type_data_object_constructors;
Enhanced_Data_Object.Mini_Context = Data_Object.Mini_Context;

Data_Object.set_Enhanced_Data_Object(Enhanced_Data_Object);

Enhanced_Data_Object.register_data_type = register_data_type;

module.exports = Enhanced_Data_Object;

	//return Enhanced_Data_Object;
//});
	
	