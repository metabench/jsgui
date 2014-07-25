/**
 * Created by James on 28/06/2014.
 *
 *
 *  From http://www.postgresql.org/docs/9.3/static/ddl-constraints.html
 *
 * Column constraints can also be written as table constraints, while the reverse is not necessarily possible, since a column constraint is supposed to refer to only the column it is attached to. (PostgreSQL doesn't enforce that rule, but you should follow it if you want your table definitions to work with other database systems.) The above example could also be written as:
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

    var Primary_Key_Column_Constraint = Data_Object.extend({
        'init': function(spec) {
            this._super(spec);

            // and a referemce to the column too
            //console.log('spec', spec);
            //console.trace("Here I am!")
            //throw 'stop';


            //this.set('name', 'primary key');

            // maybe not capital letters?

            // And the constraint has column as a property?

            // Well, it can have a collection of columns.
            //  I think it's best implementing that, but also making it so it can work with a single column.
            //  Still, may be best to store it as an array / collection?

            if (spec.column) {
                //console.log('spec.column', spec.column);
                this.set('columns', spec.column);
            }

            if (spec.name) {
                //console.log('spec.column', spec.column);
                this.set('name', spec.name);
            }

            // Not sure how primary key can both be a table constraint or colum constraint







            this.set('constraint_type', 'PRIMARY KEY');

        },
        'toString': function() {

            var columns = this.get('columns');
            //console.log('columns', columns);

            if (!columns) {
                throw 'Primary key constraint needs column(s) assigned';
            }

            var column_name = columns.get('name').value();
            //console.log('column_name', column_name);

            return 'PRIMARY KEY(' + column_name + ')';
        }
    })


    return Primary_Key_Column_Constraint;
});



