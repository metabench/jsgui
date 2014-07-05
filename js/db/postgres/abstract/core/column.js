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

    var Primary_Key_Column_Constraint = require('./primary-key-column-constraint');

    var Column = Data_Object.extend({
        // And the column has a reference to the table, its parent.
        'fields': {
            //'table': Object
        },

        'init': function (spec) {
            //this.name = spec.name;
            this._super(spec);
            var that = this;

            // The abstract column would refer to an abstract table which would refer to an abstract schema.
            //  It may be that it's best to generate an abstract schema / abstract database, and work within that.
            //  Even when just creating columns, they may be best within a database.
            //  The various objects will themselves be 'hackers', meaning that they change data elswehere.
            //   Create a column with a foreign key, add it to a table, and it automatically adds the foreign key constraint to the table
            //   Want to minimise the number of statements needed to create something.

            // This used to have the ability to create an Abstract Column out of information_schema
            //  That would be very useful to put back.


            var t_spec = tof(spec);
            var arr_spec;

            var table;

            var name, data_type, data_type_length;

            var pk_constraint;
            //console.log('init Column');
            //console.log('Abstract Column init spec.name', spec.name);

            //console.log('spec', spec);

            // I think break this down further into
            //  1) Getting / arranging the data as local variables
            //  2) Carrying out the initialization based on that local data.

            // Not so sure about setting things up in the tables when we make a PK column.
            //  Or at least not sure about doing it from this code here.


            // Depending on the type of the spec.
            //  The spec could be an array.

            // get the data from the spec as local variables here.
            //  the data type, and possibly its length
            //  other flags, such as autoincrement and pk

            // Parse out the values, some could be given as an array.
            //  not sure that arr_spec is the right way of doing this though.

            // pk_constraint, data_type, constraints, column_constraints, information_schema, is_unique

            if (t_spec == 'object') {

                if (spec.name) {
                    that.set('name', spec.name);
                }

                if (spec.information_schema) {
                    var information_schema = spec.information_schema;

                    //console.log('information_schema', information_schema);
                    //

                    name = information_schema.name;
                    that.set('name', name);
                    data_type = information_schema.data_type;

                    // But the information schema does not provide the info about if it is a primary key column.
                    //  There will be a constraint in the table, the reference will be set up
                    //   (maybe while loading constraints)

                    //throw 'stop';
                }

                // get properties from the object, look for the array arr_spec
                if (spec.arr_spec) arr_spec = spec.arr_spec;

                // some or all properties could be defined here.

                // data_type

                // table property

                //if (spec.table) table = spec.table;


                if (spec.table) {

                    // Throw an error if the spec abstract database already contains a schema with the same name
                    //  (and it is not this abstract schema?)


                    table = this.set('table', spec.table);

                    var table_columns = spec.table.get('columns');
                    //console.log('table_columns.length()', table_columns.length());

                    var pui = table_columns.index_system._primary_unique_index;
                    var kvs = pui.sorted_kvs;

                    var keys = kvs.keys();
                    //console.log('');
                    //console.log('keys', keys);
                    //console.log('');

                    var existing_column = table_columns.get(spec.name);
                    // need to look into the indexing of the table columns... it seems like there could be a problem here.


                    if (existing_column) {
                        //console.log('existing_schema', stringify(existing_schema));
                        console.trace();
                        throw 'Not expecting existing column';
                    } else {
                        var name = this.get('name');
                        //console.log('name', name);
                        //console.log('tof name', tof(name));
                        //throw 'stop';

                        //console.log('this', this);
                        table_columns.push(this);
                    }
                    // Can also check the database to see if it contains the abstract schema.

                    // if it does not have it, push

                }

            }
            if (t_spec == 'array') {
                arr_spec = spec;
            }

            //console.log('arr_spec', arr_spec);

            // then process the arr_spec into other variables.

            var has_fk, fk_referenced_table, fk_referenced_column;

            var process_arr_spec = function () {
                name = arr_spec[0];
                that.set('name', name);
                data_type = arr_spec[1];


                if (tof(arr_spec[2]) == 'number') {
                    data_type_length = arr_spec[2];
                }

                //console.log('arr_spec.length ' + arr_spec.length);

                // then treat the rest as words...

                if (arr_spec.length > 2) {
                    // look at the words, though the first [a2] could be a number

                    var i;

                    if (tof(arr_spec[2]) == 'number') {
                        if (arr_spec.length > 3) {
                            i = 3;

                        }

                    } else {
                        i = 2;
                    }


                }

                if (i) {
                    var column_words = arr_spec.slice(i);
                    //console.log('column_words', column_words);

                    // then process these column words.
                    // mapify?
                    var mcw = jsgui.get_truth_map_from_arr(column_words);
                    //console.log('mcw', mcw);

                    // then if certain words are found in the map, we assign those characteristics to the column.

                    //  If there is a PK we set up the Primart_Key constraint.

                    if (mcw.pk) {
                        // And reference the column

                        // Better to make it a table constraint?
                        //  Keep it CC for moment.

                        pk_constraint = new Primary_Key_Column_Constraint({
                            'column': that
                        });
                    }
                }

                each(arr_spec, function (spec_word) {
                    //console.log('spec_word', spec_word);

                    if (tof(spec_word) == 'string') {
                        if (spec_word.substr(0, 3) == 'fk-') {
                            //console.log('');
                            //console.log('we have a foreign key');

                            var s_fk = spec_word.split('-');
                            var referenced_table_name, referenced_table;
                            if (s_fk.length == 2) {
                                referenced_table_name = s_fk[1];
                                //console.log('referenced_table_name', referenced_table_name);

                                // need to look up that referenced table, by name, from the abstract database / schema system

                                // and the table references the db

                                var table2 = that.get('table');
                                //console.log('table2', table2);
                                var schema = table2.get('schema');

                            }

                        }
                    }


                })

            }

            // Go through column_words, looking for information about a foreign key
            //  fk-table_name
            //  fk-table_name-field_name

            if (arr_spec) process_arr_spec();


            this.set('data_type', data_type);
            this.set('data_type_length', data_type_length);

            // The constraints may not just be given as spec.constraints.


            if (pk_constraint) {

                //console.log('pk_constraint', pk_constraint);
                //throw 'stop';

                // Is it a table constraint?


                // Would get set on the table.

                //this.set('pk_constraint', pk_constraint);
                //this.get('column_constraints').push(pk_constraint);


                //this.set('column_constraints', [pk_constraint]);

                // ensure the constraint is represented in the table
                //  That's more than just adding it.
                //console.log('pk_constraint', pk_constraint);
                //throw 'stop';

                table.ensure_pk_constraint(pk_constraint);
            }


        },
        'toString': function () {

            //var name = this.

            var name, data_type_length;

            if (this.has('information_schema')) {
                name = this.get('information_schema').column_name;
            } else {
                name = this.get('name');
            }


            var data_type_length = this.get('data_type_length');

            var res = [];

            //var res = this.name + '    ' + this.data_type.toString();
            res.push(name);
            res.push('     ');

            // It should have a data_type.
            var data_type = this.get('data_type');

            if (data_type) {
                res.push(data_type.toString());
                if (data_type_length) {
                    res.push('(' + data_type_length + ')');
                }

            } else {
                throw 'Postgres Column expected to have data_type';
            }


            // not null?

            //console.log('this.constraints ' + stringify(this.get('constraints')));

            var constraints = this.get('constraints');


            if (constraints && constraints.length > 0) {
                //')

                each(this.get('constraints'), function (v) {

                    //console.log('column toString ' + name + ', column constraint  ' + stringify(v));

                    res.push(' ');
                    console.log('** ' + v.toString());
                    res.push(v.toString());
                });
            }

            //console.log('');
            //console.log(res.join(''));

            return res.join('');
        },
        'toFQN': function () {
            var name;
            var isc = this.get('information_schema');
            if (is_defined(isc)) {
                name = isc.table_schema + '.' + isc.table_name + '.' + isc.column_name;
            } else {
                name = this.get('name');
            }

            var res = [];
            // the schema name?

            res.push(name);
            return res.join('');
        },
        'toDataTypeString': function () {
            //console.log('this.data_type ' + stringify(this.get('data_type')));
            if (this.get('data_type')) {
                if (this.get('data_type').get('text')) {
                    return this.get('data_type').get('text');
                }
            }
        },
        'compare': function(target) {
            var existing = this;

            var existing_data_type = existing.get('data_type').value();
            var target_data_type = target.get('data_type').value();

            console.log('existing_data_type', existing_data_type);
            console.log('target_data_type', target_data_type);

            // skipped comparison status...
            //  can skip the comparison when the data type is tricky or the specific comparison has not been implemented.
            // partial test success status? for when we know there is more that could be tested but it passes some rudimentary tests?


            var data_type_res;
            if (existing_data_type == target_data_type) {
                data_type_res = 'same'
            } else {
                console.log('');
                console.log('target_data_type', target_data_type);

                if (target_data_type == 'serial') {
                    if (existing_data_type == 'integer') {
                        data_type_res = 'same';
                    } else {
                        data_type_res = 'change';
                    }
                } else {
                    data_type_res = 'change';
                }
            }


            var data_type_length_res;

            var d_existing_data_type_length = existing.get('data_type_length');
            var d_target_data_type_length = target.get('data_type_length');

            var existing_data_type_length, target_data_type_length;

            if (d_existing_data_type_length) existing_data_type_length = d_existing_data_type_length.value();
            if (d_target_data_type_length) target_data_type_length = d_target_data_type_length.value();

            if (existing_data_type_length && target_data_type_length) {


                if (existing_data_type_length == target_data_type_length) {
                    data_type_length_res = 'same'
                } else {

                    // There will be some exceptions.
                    //  We may have a serial field. Need to deal with that.
                    //  Perhaps there can be some preprocessing where the serial field changes into an integer and
                    //   makes the nessary sequence / constraint.





                    data_type_length_res = 'change'
                }
            }

            /*
             if (existing_data_type_length && )

             console.log('existing_data_type_length', existing_data_type_length);
             console.log('target_data_type_length', target_data_type_length);

             var data_type_length_res;
             if (existing_data_type_length == target_data_type) {
             data_type_length_res = 'same'
             } else {
             data_type_length_res = 'change'
             }
             */

            var res = {
                'data_type': data_type_res//,
                //'data_type_length': data_type_length_res
            }

            if (data_type_length_res) {
                res.data_type_length = data_type_length_res;
            }



            var all_are_true = true;

            for (i in res) {
                if (!res[i]) all_are_true = false;
            }

            if (all_are_true) return 'same';



            // Could just return true if they are the same?
            //  Or really 0 if they are the same?
            //  Or the string 'same'?
            //  And an object describing the differences.







            return res;
        }
    });


    return Column;
});



