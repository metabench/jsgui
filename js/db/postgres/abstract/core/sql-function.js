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

    var SQL_Function = Data_Object.extend({
        'init': function(spec) {
            // Function Parameters
            // Function body

            this._super(spec);


            if (spec.specific_schema && spec.specific_name) {
                this.load_from_information_schema_row(spec);
            } else {


                this.set('name', spec.name);
                // will have a specific_name too, maybe won't be set by the user.


                //this.arguments = spec.arguments;
                //  sql function could have a collection of parameters.
                //  That could make indexing them easier, perhaps could have index of functions available by params.
                //  will do that before so long.


                //this.set('parameters', spec.parameters || spec.params || []);

                this.set('parameters', new Collection({
                    //'index_by': 'name'
                }));

                if (tof(spec.parameters) == 'array') {
                    this.get('parameters').load_array(spec.parameters);
                }

                var params = this.get('parameters');
                //console.log('init params ' + stringify(params));
                //console.log('init spec.parameters ' + stringify(spec.parameters));
                //this.parameters = spec.parameters || spec.params || [];
                //this.statements = spec.statements || [];

                //this.set('statements', spec.statements || []);

                this.set('statements', new Collection({
                    //'index_by': 'name'
                }));

                if (tof(spec.statements) == 'array') {
                    this.get('statements').load_array(spec.statements);
                }

                // the normal SQL language runs faster though.
                //  Should be fine for insert statements.

                //this.return_type = spec.return_type;

                this.set('return_type', spec.return_type);

                //this.language = spec.language || 'SQL';
                //this.language = 'SQL';

                this.set('language', 'SQL');
            }

            // Could be composed of statements that get put together, or just text.
            //this.name = spec.name;


            // think SQL does not do named parameters.
            //  just does them in an order I think.


            //this.ret = spec.ret || null;

            // could have a function body
            // maybe the function body could be a collection of statements.

            // We'll want functions for CRUD.


            // statement : could be pieces of Postgres SQL language, pieced together.
            //  won't be so hard to model these objects, but there may be quite a few of them for this interface.

            //this.body = spec.body;

        },

        'load_from_information_schema_row': function(information_schema_row) {
            //console.log('load_from_information_schema_row ' + stringify(information_schema_row));

            // set the values from spec.

            // perhaps only set the properties we need, and with the right names.

            //this.set(information_schema_row);
            this.set('schema', information_schema_row.specific_schema);
            this.set('specific_name', information_schema_row.specific_name);
            this.set('name', information_schema_row.routine_name);
            // can be updated with the actual schema, possibly could respond to event to do that.

            // quite a bit of metadata here from the INFORMATION_SCHEMA, will leave much of this for the moment.
            //  some of it covers the language that the procedure is written in.
            //  http://www.postgresql.org/docs/9.1/static/infoschema-routines.html

            var routine_definition = information_schema_row.routine_definition;


            //console.log('');
            console.log('');
            console.log('');
            console.log('routine_definition ' + routine_definition);

            // the definition could get parsed, and references to tables / other functions noted with their names.
            //  then the references could be updated to refer to the actual objects.

            if (Abstract.parsers && Abstract.parsers.sql) {
                // parsing the code into its various statements... would be nice.
                // Will first have it getting the parameters from the DB.


            }


        },


        // not sure about this function here???
        'get_signature': function() {
            var res = [];
            //var res = ['['];
            var first = true;
            var params = this.get('parameters');
            console.log('params ' + stringify(params));
            console.log('params.length() ' + params.length());
            each(params, function(i, param) {
                // look at the parameter data type.
                if (!first) {
                    res.push(',');
                } else {
                    first = false;
                }

                //console.log('param ' + stringify(param));

                // the param may not be a proper / full abstract sql parameter.
                console.log('tof(param) ' + tof(param));
                // each individual parameter may now

                var tp = tof(param);

                if (tp == 'collection') {

                    console.log('param ' + stringify(param));
                    //console.log('param._ ' + stringify(param._));

                    var dts = param.get(1).get();
                    console.log('dts ' + dts);
                    console.log('dts ' + stringify(dts));

                    if (dts.indexOf('char') > -1) {
                        res.push('s');
                    } else if (dts.indexOf('int') > -1) {
                        res.push('i');
                    }

                } else {
                    if (tp == 'array') {
                        var dts = param[1];
                        if (dts.indexOf('char') > -1) {
                            res.push('s');
                        } else if (dts.indexOf('int') > -1) {
                            res.push('i');
                        }

                    } else {
                        res.push(param.get_signature());
                    }
                }



            });

            //res.push(']');

            return res.join('');

        },
        //'toString': function() {
        // Puts the arguments together and the body.

        // fn name?


        //},
        'to_create_or_replace_str': function() {
            // could compose the create or replace function statement as an OO statement.

            var res = [];
            res.push('CREATE OR REPLACE FUNCTION ' + this.get('name'));

            res.push('(');

            var first = true;

            var params = this.get('parameters');
            console.log('params ' + stringify(params));
            //throw('stop');

            each(params, function(i, param) {
                if (!first) {
                    res.push(', ');
                } else {
                    first = false;
                }
                // the param will have both a name and a data type.

                // should be OK with varchar(n) as function parameters...
                //  we'll see if it works.

                // just the types given, not the parameter names.

                //console.log('tof(param) ' + tof(param));

                var tp = tof(param)

                if (tp == 'array' && param.length == 2) {
                    //res.push(param[0]);
                    //res.push(' ');
                    res.push(param[1]);
                }
                if (tp == 'collection' && param.length() == 2) {
                    //res.push(param[0]);
                    //res.push(' ');
                    console.log('param ' + stringify(param));
                    // Need to sort out where the parameters get their names from.

                    var p1 = param.get(1);
                    //console.log('p0 ' + p0);
                    //console.log('p0 ' + stringify(p0));
                    //console.log('tof p0 ' + tof(p0));

                    res.push(p1.get());
                }

            });

            res.push(') RETURNS ');

            var str_return_type = this.get('return_type') || 'VOID';

            res.push(str_return_type);
            res.push(' AS $$\n');
            //res.push('BEGIN\n');
            res.push('');
            // the main statement itself
            // or statements

            each(this.get('statements'), function(i, statement) {
                res.push('\t');
                res.push(statement.toString());
                res.push('\n');
            });
            //res.push('END;\n');
            res.push('$$ LANGUAGE SQL');

            return res.join('');


        },
        'arguments_str': function() {
            var res = [];
            // uncluse brackets?


            var first = true;
            each(this.get('parameters'), function(i, v) {
                //
                if (!first) {
                    res.push(', ');
                } else {
                    first = false;
                }
                res.push(v.toString());
            });


            return res.join('');


        }

        // to create function string.

    });


    //return SQL_Function;
//});
module.exports = SQL_Function;
