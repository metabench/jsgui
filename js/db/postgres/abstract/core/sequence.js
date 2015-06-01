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

    var Sequence = Data_Object.extend({
        'init': function(spec) {
            // sequences won't need to be very complicated.

            // will get various pieces of info from the spec.

            // the information about the functions will be more interesting really.
            //  perhaps I will parse the function bodies into statements.

            // likely to be able to get information from the function names and the parameters.

            // all the info about functions and parameters will be useful for determining how to carry out operations in the application.

            // Will set up some kind of mapping so that JavaScript functions will be able to carry out functions in the database easily.
            //  Will keep various concerns separated. Code will be longer but will have a more understandable structure.



            // Loading abstract functions will get more complicated.
            //  Being able to parse statements would be very interesting!!!

            // (Table)
            // Column that it refers to

            // Related table, related column, sequence name
            //  perhaps mor edata such as what it starts at, how much it increments, max value.

            console.log('Abstract Sequence init spec', spec);

            var schema = spec.schema;

            // Will need to get the abstract items out of the schema for this sequence,
            //  get given names as text but we use references to objects here.

            var sequence_name = spec.sequence_name;

            this.set('name', sequence_name);

            var related_table_name = spec.related_table;
            console.log('related_table_name', related_table_name);

            var related_column_name = spec.related_column;
            console.log('related_column_name', related_column_name);


            var schema_tables = schema.get('tables');

            console.log('schema_tables', schema_tables);

            // Tables have not been loaded yet?
            var related_table = schema_tables.get(related_table_name);

            var related_column = related_table.get('columns').get(related_column_name);

            console.log('related_table', related_table);

            console.log('related_column', related_column);

            // Only really need to store the column as the column has the reference to the table.
            //  Store as related_table or related_column?
            //  To show that these are not actually part of the sequence or held by the sequence?

            this.set('table', related_table);
            this.set('column', related_column);







            //throw 'stop';










        },

        toString: function() {
            return 'SEQUENCE';
        }
    });


    //return Sequence;
//});
module.exports = Sequence;
