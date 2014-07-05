
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// Used to represent a database.
//  Want a class for a domain model as well.

// Domain model gets created, then that gets used to create database models.
//  Possibly domain model -> Abstract RDB -> Abstract Postgres

// I think a user interface to specify the domain model would help a lot...
//  but then I'd want to use resources etc to save it.

// Perhaps making authentication without all the ORM.
//  The ORM project seems big, it may be best to put that on hold for the moment.

// Get the more basic service / platform set up, it can specifically use Postgres / Mongo / whatever.
//  Should be relatively simple components that can be swapped with more complex ones.

// Naming of them... they won't exactly be THE classes to do this, but maybe earlier versions.
//  Name them sensibly and then replace in the future.

// This is part of quite a lot of code that enables easier access to various systems such as databases.


// A transformation before the comparison?
//  Postgres has syntax such as 'serial' which is easy to specify but has got more complex internal representation.
//  I propose to transform the target abstract db object so that it corresponds with the internal Postgres representation.

// Another way is through the use of improved comparisons.
//  Both improved comparisons and target transformation would solve the problem.
//  Better to use imrpved comparisons for the moment.







define(["../../../core/jsgui-lang-enh", "./core/all"], function(jsgui, Abstract) {
    var Data_Object = jsgui.Data_Object;
    var Collection = jsgui.Collection;
    // The Data_Object may have a few more features added to it.
    // Receiving and sending on event bubbling
    // Other use of a heirachy.
    // Parent objects.
    // Structure.
    // Having this structure, and knowing the parent, would be useful for many things, including event bubbling.
    //  And there may be collections within it

    // This will not have parsing, though that is a part of abstract postgres.
    //  Maybe make this abstract-postgres-core
    //  abstract-postgres-parsing
    //  and abstract-postgres then loads them both together.


    var Class = jsgui.Class, arrayify = jsgui.arrayify, fp = jsgui.fp, is_defined = jsgui.is_defined;
    var tof = jsgui.tof, is_defined = jsgui.is_defined, each = jsgui.eac, stringify = jsgui.stringify, arrayify = jsgui.arrayify, mapify = jsgui.mapify;
    var get_item_sig = jsgui.get_item_sig;

    var cbcg = {};

    // Probably won't use most of the current code.
    //  Will make it use comparison functions that are within the Abstract DB classes.
    //  From those comparisons, will then




    //var process_databases = function()

    // I think this can/will be syncronous anyway.
    //  It deals in the abstract once the data has loaded.

    // In common, missing from existing, removed from target

    // common, missing, removed
    // same, changed, missing, removed

    // Once it has categorised changes within objects like this it will then act to make the change instructions.

    //  I think that we will hold the change description in a data structure at one point (JS object) and then the code for making the changes will
    //   be run, using that object model as a reference point.


    //  same, differences (expressed with different items probably)



    var gc_database = function(existing, target) {

        // Clone the existing?
        // Do that at which levels?

        // Will want to do a transformation on the existing (and target) db to make it deal with things in a way that's more internal to Postgres.


        // Want to make sure we have loaded the existing abstract db.




        var map_existing_schemas = {};
        var map_target_schemas = {};

        var existing_schemas = existing.get('schemas');
        var target_schemas = target.get('schemas');

        existing_schemas.each(function(i, v) {
            var name = v.get('name');
            map_existing_schemas[name] = v;
        });

        target_schemas.each(function(i, v) {
            var name = v.get('name');
            map_target_schemas[name] = v;
        });

        console.log('map_existing_schemas', map_existing_schemas);
        console.log('map_target_schemas', map_target_schemas);

        // And if they are both there (same name), will do deeper

        // added, removed, same, changed

        // may use temporary designation of 'common' when it's been observed that an item is shared, but it's not yet been deduced if the item is the same or has
        //  changed.

        //var arr_missing = [];
        //var arr_removed = [];
        //var arr_common = [];

        var map_missing = {};
        var map_removed = {};
        var map_common = {};

        each(map_existing_schemas, function(v, i) {
            console.log('1) i', i);

            if (map_target_schemas[i]) {
                map_common[i] = true;
            } else {
                map_removed[i] = v;
            }
        });

        each(map_target_schemas, function(v, i) {
            console.log('2) i', i);

            if (map_existing_schemas[i]) {
                //map_common[i] = v;
            } else {
                map_missing[i] = v;
            }
        });

        console.log('map_missing', map_missing);
        console.log('map_removed', map_removed);
        console.log('map_common', map_common);

        // Then it looks into map_common, to see which of the subitems have changed.

        each(map_common, function(v, schema_name_in_common) {
            console.log('schema_name_in_common', schema_name_in_common);

            var existing_schema = map_existing_schemas[schema_name_in_common];
            var target_schema = map_target_schemas[schema_name_in_common];

            var item_gc_res = gc_schema(existing_schema, target_schema);

            console.log('schema item_gc_res', item_gc_res);
            throw 'stop';

        });

        console.log('map_common', map_common);

        throw 'stop';






    }


    // May be having problems because input data about the target db has not been set up right.



    var gc_schema = function(existing, target) {
        var map_existing_tables = {};
        var map_target_tables = {};

        var existing_tables = existing.get('tables');
        var target_tables = target.get('tables');

        // And each of those tables should be an Abstract Table, a Data_Object.



        console.log('existing_tables.length()', existing_tables.length());

        each(existing_tables, function(v, i) {
            console.log('existing v', v);
            console.log('tof(v)', tof(v));

            var name = v.get('name');
            map_existing_tables[name] = v;
        });

        each(target_tables, function(v, i) {

            // An object nested within a Data_Object I think.
            //  That probably needs to be improved / made consistantly Data_Object.
            //  Main goal is flexibility and stability, rather than speed.




            console.log('* target v', v);
            console.log('* tof(v)', tof(v));

            // Should be .get with an Abstract Table (it's a Data_Object)

            var name = v.get('name');
            //var name = v.name;
            map_target_tables[name] = v;
        });

        console.log('map_existing_tables', map_existing_tables);
        console.log('map_target_tables', map_target_tables);


        var map_missing = {};
        var map_removed = {};
        var map_common = {};

        each(map_existing_tables, function(v, i) {
            console.log('1) i', i);

            if (map_target_tables[i]) {
                map_common[i] = true;
            } else {
                map_removed[i] = v;
            }
        });

        each(map_target_tables, function(v, i) {
            console.log('2) i', i);

            if (map_existing_tables[i]) {
                //map_common[i] = v;
            } else {
                map_missing[i] = v;
            }
        });

        console.log('map_missing', map_missing);
        console.log('map_removed', map_removed);
        console.log('map_common', map_common);

        each(map_common, function(v, table_name_in_common) {
            console.log('table_name_in_common', table_name_in_common);

            var existing_table = map_existing_tables[table_name_in_common];
            var target_table = map_target_tables[table_name_in_common];

            var item_gc_res = gc_table(existing_table, target_table);

            console.log('table item_gc_res', item_gc_res);
            throw 'stop';

        });

        // Then when we have the map of the common tables, we examine the items there.

        //  Use the table comparison system.



    }

    var gc_table = function(existing, target) {
        // Needs to compare the various features of tables
        //  Columns in particular
        //  But constraints too.
        //   Columns and constraints are tied in together, so we could say that columns A and B need to be used for an FK.

        // Basically need to come up with the detailed structure modelling the differences between the structures of the databases.


        var map_existing_columns = {};
        var map_target_columns = {};

        var existing_columns = existing.get('columns');

        // Why are the existing ones Data_Objects and the target ones plain objects?

        //console.log('target', target);
        var target_columns = target.get('columns');

        console.log('existing_columns.length()', existing_columns.length());

        each(existing_columns, function(v, i) {
            console.log('v', v);
            console.log('tof(v)', tof(v));

            var name = v.get('name');
            map_existing_columns[name] = v;
        });

        each(target_columns, function(v, i) {

            // An object nested within a Data_Object I think.
            //  That probably needs to be improved / made consistantly Data_Object.
            //  Main goal is flexibility and stability, rather than speed.




            //console.log('v', v);
            //console.log('tof(v)', tof(v));

            var name = v.get('name');
           // var name = v.name;
            map_target_columns[name] = v;
        });

        console.log('map_existing_columns', map_existing_columns);
        console.log('map_target_columns', map_target_columns);


        var map_missing_columns = {};
        var map_removed_columns = {};
        var map_common_columns = {};

        each(map_existing_columns, function(v, i) {
            console.log('1) i', i);

            if (map_target_columns[i]) {
                map_common_columns[i] = true;
            } else {
                map_removed_columns[i] = v;
            }
        });

        each(map_target_columns, function(v, i) {
            console.log('2) i', i);

            if (map_existing_columns[i]) {
                //map_common[i] = v;
            } else {
                map_missing_columns[i] = v;
            }
        });

        console.log('map_missing_columns', map_missing_columns);
        console.log('map_removed_columns', map_removed_columns);
        console.log('map_common_columns', map_common_columns);

        each(map_common_columns, function(v, column_name_in_common) {
            console.log('column_name_in_common', column_name_in_common);

            var existing_column = map_existing_columns[column_name_in_common];
            var target_column = map_target_columns[column_name_in_common];

            var item_gc_res = gc_column(existing_column, target_column);

            console.log('column item_gc_res', item_gc_res);
            throw 'stop';
        });

        // Also need to deal with the table's constraints.
        //  Compare them


        var existing_constraints = existing.get('constraints');
        var target_constraints = target.get('constraints');

        console.log('existing_constraints', existing_constraints);
        console.log('target_constraints', (target_constraints));

        console.log('existing_constraints.length()', existing_constraints.length());
        console.log('target_constraints.length()', target_constraints.length());

        // Returns the differences and the changes?
        //  Perhaps we need to modularise out the comparisons of the abstract objects.
        //  Have more of the processing capability within abstract objects themselves, so the comparisons get done elsewhere.

        // Once the comparisons are done, we generate the changes.






        throw 'stop';

        // Then once we have the columns in common, run the generating comparerer (gc) for the columns









    }

    // Will need to deal with constraints as well.
    //  I think they will get applied after columns?

    var gc_column = function(existing, target) {
        // Then when comparing the columns, need to compare a few things...
        //  When an item has changed, need to not the 'change' rather than it being 'missing [from target]' or 'removed'

        // Data types

        console.log('gc_column');
        console.log('existing', existing);
        console.log('target', target);

        // data type
        // data type lengths

        // PK? FK?
        //  Those could actually be listed under constraints, but it may be best to do the constraint changes in a coordinated way with the column changes.
        //  For the moment, this will be outputting described differences.
        //   A different part of the system will be generating the change instructions from the described differences.

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

        return res;


        // Data_Value comparison / equals?









    }

    cbcg.generate = fp(function(a, sig){


        var existing_abstract_database, target_abstract_database, callaback;
        if (sig == '[D,D]') {
            existing_abstract_database = a[0];
            target_abstract_database = a[1];
            //callaback = a[2];
        }


        if (existing_abstract_database && target_abstract_database) {
            // Maybe it does not get so complicated, but it will be quite longwinded.

            // Need to compare the different features

            // Table compare_ensure

            //  And can point to objects that have changed. eg New Table, New Column

            // Will make various maps of table and item names in the abstract objects.
            //  Will use those maps to compare item by item.

            // Needs to generate the changes that operate on  a DB, Schema, Table, Column

            // Comparison of schemas

            // To add
            // To remove
            // To modify

            // The comparisons of abstract objects should take place within the abstract objects themselves, using a 'compare' function.
            //  May need special logic for comparing some things like a serial column with an int column and a sequence.
            //  I think having that logic within the Abstract system makes sense.
            //  Best to move them to separate files though.


            var comparison_result = existing_abstract_database.compare(target_abstract_database);
            console.log('comparison_result', comparison_result);

            throw 'stop';

            //var res_db = gc_database(existing_abstract_database, target_abstract_database);
            //console.log('res_db', res_db);

            return res_db;



            /*

            var map_tables_in_source = {}, map_tables_in_target = {};


            var map_tables_not_in_source = {};
            var map_tables_not_in_target = {};

            // Need to have the first level for schema comparison.

            //

            var source_tables = existing_abstract_database.get('tables');
            var target_tables = target_abstract_database.get('tables');

            source_tables.each(function(i, v) {
                var name = v.get('name');
                map_tables_in_source[name] = v;
            });

            target_tables.each(function(i, v) {
                var name = v.get('name');
                map_tables_in_target[name] = v;
            });

            console.log('map_tables_in_source', map_tables_in_source);
            console.log('tables_not_in_target', tables_not_in_target);


            */




            // Column comparison

            // Constraint comparison

            // Need to see which are in the existing db, not in target db (need to be created)
            //  Not in existing db, in target db                          (need to be removed)


        }


        console.log('cbcg.generate sig', sig);
    });

    return cbcg;

});



