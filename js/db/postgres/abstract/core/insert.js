/**
 * Created by James on 28/06/2014.
 */



//if (typeof define !== 'function') {
//    var define = require('amdefine')(module);
//}

var jsgui = require('../../../../core/jsgui-lang-enh');
//define(["../../../../core/jsgui-lang-enh"], function(jsgui) {

    var Data_Object = jsgui.Data_Object;
    var Collection = jsgui.Collection;

    var Class = jsgui.Class, arrayify = jsgui.arrayify, fp = jsgui.fp, is_defined = jsgui.is_defined;
    var tof = jsgui.tof, is_defined = jsgui.is_defined, each = jsgui.eac, stringify = jsgui.stringify, arrayify = jsgui.arrayify, mapify = jsgui.mapify;
    var get_item_sig = jsgui.get_item_sig;

    //var Schema = require('./schema');

    var Insert = Data_Object.extend({
        'init': function(spec) {
            this._super(spec);
            this.set('table', spec.table);
            this.set('values', spec.values);
            this.set('statement_type', 'INSERT');

        },
        'toString': function() {
            var res = ['INSERT INTO '];

            // table fully qualified name?

            var tn;

            var table = this.get('table');
            console.log('!!! table ' + table);
            if (is_defined(table.toFQN)) {
                // get the qualified name for the table.

                tn = table.toFQN();
            }

            if (is_defined(tn)) {
                res.push(tn);

                // then the list of columns.
                //  I think will be specified by default in these functions.
                res.push('(');

                var columns = this.get('table').get('columns');
                // no... the columns to be inserted.
                // column_name and value pairs.

                var values = this.get('values');

                console.log('')
                console.log('');
                console.log('values ' + stringify(values));

                // no, not every column.
                var first = true;
                each(values, function(v) {
                    if (!first) {
                        res.push(', ');
                    } else {
                        first = false;
                    }
                    res.push(v[0]);
                });
                res.push(') VALUES (');
                // string values quoted.
                first = true, p_num = 1;
                each(values, function(v) {
                    // possibly check if it is string data.
                    if (!first) {
                        res.push(', ');
                    } else {
                        first = false;
                    }

                    // no the values are not always automatically sequential parameters.
                    //  very often they will be though.
                    //  in the current case we want it to have abstract function calls.
                    //  will look into the parameter object.
                    console.log('v ' + stringify(v[1]));
                    if (v[1] instanceof Abstract.Function_Call) {
                        console.log('is abstract function call');
                        res.push(v[1].toString());
                    } else {
                        // TODO: Fix this, possibly run tests
                        res.push('$' + p_num);
                    }




                    //res.push(v[0]);
                    p_num++;

                });
                res.push(');');

            } else {
                var stack = new Error().stack;
                console.log( stack );

                throw 'Table name "' + tn + '" not found';
            }

            //res.push()

            return res.join('');
        }
    });


    //return Insert;
//});
module.exports = Insert;
