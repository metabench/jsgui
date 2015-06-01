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

    var SQL_Function_Call = Data_Object.extend({
        'init': function(spec) {
            this._super(spec);
            // a way to get the class name of an item?

            console.log('tof spec ' + tof(spec));



            // could have a reference to the function itself... but probably won't use that.
            this.set('function_name', spec.function_name);

            //var that = this;
            //if (spec.num_parameters)

            //console.log('tof(spec.parameters ' + tof(spec.parameters));

            if (is_defined(spec.parameters)) {

                if (tof(spec.parameters) == 'number') {

                    // should make a collection instead.

                    var params = this.set('parameters', []);
                    params = this.get('parameters');

                    for (var c = 1, l = spec.parameters + 1; c < l; c++) {
                        params.push('$' + c);
                    };
                } else if (tof(spec.parameters) == 'array') {
                    this.set('parameters', spec.parameters);
                }
            }

            //this.parameters = spec.parameters;
            // but maybe the params get specified in different ways.

            // could just call it with the params as $1, $2 etc, those are already in the query at a lower level using node-postgres query api.
            //console.log('this.parameters ' + stringify(this.parameters));

            // name value pairs?
            //  just the values?



        },
        'toString': function() {
            console.log('');
            console.log('');
            console.log('fc toString');


            var res = [this.get('function_name')];
            //console.log('params ' + stringify(this.parameters));

            res.push('(');
            // each param... add its value?

            //  but could be a parameterised function all.
            var first = true;

            var params = this.get('parameters');
            console.log('');
            console.log('')
            console.log('toString params ' + stringify(params));

            each(params, function(param) {
                if (!first) {
                    res.push(',');
                } else {
                    first = false;
                }
                if (tof(param) == 'string') {
                    //res.push('"' + param + '"');
                    res.push(param);
                } else {
                    if (param.toString) {
                        //res.push('"' + param.toString() + '"');
                        res.push(param.toString());
                    } else {
                        console.log('param: ' + stringify(param));

                        if (tof(param) == 'data_value') {

                        }

                    }
                }
            });

            /*
             * var insert = {
             //name: "insert",
             text: "INSERT INTO hours (count, view_period, countable_id, countable_type) VALUES ($1, date_trunc('hour', $2::timestamp), $3, $4);",
             values: [1, "2012-01-13T20:19:35.945Z", 1234, "foo"]
             };
             *
             */

            // could use a parameterized function call.


            // the text, and the values.
            //  is the name needed?


            res.push(')');

            return res.join('');


        }
    });


    //return SQL_Function_Call;
//});
module.exports = SQL_Function_Call;
