/**
 * Created by James on 28/06/2014.
 */



//if (typeof define !== 'function') {
//    var define = require('amdefine')(module);
//}


//define(["../../../../core/jsgui-lang-enh"], function(jsgui) {

var jsgui = require('../../../../core/jsgui-lang-enh');

    var Data_Object = jsgui.Data_Object;
    var Collection = jsgui.Collection;

    var Class = jsgui.Class, arrayify = jsgui.arrayify, fp = jsgui.fp, is_defined = jsgui.is_defined;
    var tof = jsgui.tof, is_defined = jsgui.is_defined, each = jsgui.eac, stringify = jsgui.stringify, arrayify = jsgui.arrayify, mapify = jsgui.mapify;
    var get_item_sig = jsgui.get_item_sig;

    //var Schema = require('./schema');

    var Data_Type = Data_Object.extend({
        'init': function(spec) {
            this._super(spec);
            // perhaps will give it INFORMATION_SCHEMA as the Data_Type.
            //  but this will be able to hold all the values from the INFORMATION_SCHEMA.

            /*
             if (is_defined(spec.table_catalog)) {
             this.table_catalog = spec.table_catalog;
             }
             */
            //var that = this;
            //var copy_from_spec = arrayify(function(item_name) {
            //	if (is_defined(spec[item_name])) {
            //		that[item_name] = spec[item_name];
            //	}
            //});
            //copy_from_spec('information_schema');

            this.set('information_schema', spec.information_schema);

            //console.log('spec ' + stringify(spec));

            /*
             copy_from_spec(['table_catalog', 'table_schema', 'table_name', 'column_name', 'ordinal_position', 'column_default', 'is_nullable', 'data_type', 'character_maximum_length', 'character_octet_length', 'numeric_precision', 'numeric_precision_radix', 'numeric_scale', 'datetime_preceision', 'interval_type', 'intervasl_precision']);
             copy_from_spec(['character_set_catalog', 'character_set_schema', 'character_set_name', 'collation_catalog', 'collation_schema', 'collation_name', 'domain_catalog']);
             copy_from_spec(['domain_schema', 'domain_name', 'udt_catalog', 'udt_schema', 'udt_name', 'scope_catalog', 'scope_schema', 'scope_name']);
             copy_from_spec(['maximum_cardinality', 'is_self_referencing', 'is_identity', 'identity_generation', 'identity_start', 'identity_increment', 'identity_maximum', 'idenetity_minimum'])
             copy_from_spec(['identity_cycle', 'is_generated', 'generation_expression', 'is_updatable']);
             */
            // may give the data type in a variety of ways, in a string.
            //  could have some generalization going on here for convenience if it's wanted.

            // lots of different ones used in postgres.

            // can be summarised as text though without other things set.
            //  that will be convenient for the moment

            // load this from information schema?

            // perhaps the data type should have all of the information schema info available?
            // The INFORMATION_SCHEMA system may be important for middleware.

            // It seems like an important system to have,
            //  but it gets complicated with the different representations.




            //if (is_defined(spec.text)) {
            //	this.text = spec.text;
            //}

            this.set('text', spec.text);


        },
        'toString': function() {
            //console.log('this.information_schema ' + this.information_schema);
            if (this.has('information_schema')) {
                //console.log('stringify(this.information_schema) ' + stringify(this.get(information_schema)));

                return stringify({'information_schema': this.get('information_schema')});
            } else {
                if (this.has('data_type')) {


                } else {
                    if (this.has('text')) {
                        return this.get('text');
                    }
                }
            }

        }
    });


    //return Data_Type;
//});
module.exports = Data_Type;
