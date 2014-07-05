/**
 * Created by James on 28/06/2014.
 */



if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


define(["../../../../core/jsgui-lang-enh"], function(jsgui) {

    var Data_Object = jsgui.Data_Object;
    var Collection = jsgui.Collection;

    var Class = jsgui.Class, arrayify = jsgui.arrayify, fp = jsgui.fp, is_defined = jsgui.is_defined;
    var tof = jsgui.tof, is_defined = jsgui.is_defined, each = jsgui.eac, stringify = jsgui.stringify, arrayify = jsgui.arrayify, mapify = jsgui.mapify;
    var get_item_sig = jsgui.get_item_sig;

    //var Schema = require('./schema');

    var Table_Constraint =Data_Object.extend({
        'init': function(spec) {
            this._super(spec);

            this.set('column_usage', new Collection());

            var using_is_row = is_defined(spec.constraint_name) && is_defined(spec.table_name) && is_defined(spec.constraint_schema) && is_defined(spec.constraint_type);
            console.log('spec ' + stringify(spec));

            console.log('');
            console.log('');
            console.log('using_is_row ' + using_is_row);

            this.load_from_spec(spec, ['name']);

            if (using_is_row) {
                this.load_from_information_schema_row(spec);
            }

        },

        // The row may not cover which column it is constraining.
        //  May need to do other queries to get that information.


        'load_from_information_schema_row': function(row) {
            // pertty good... nicely getting various objects as abstract now.
            // will also work on getting data faster and simultaneously later.

            this.set('name', row.constraint_name);
            this.set('table', row.table_name);
            this.set('table_schema', row.table_schema);
            this.set('constraint_schema', row.constraint_schema);
            this.set('constraint_type', row.constraint_type);



        }

        // also need to load data from constraint_column_usage.



    })


    return Table_Constraint;
});



