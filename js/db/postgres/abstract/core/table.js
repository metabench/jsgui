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

    var Table = Data_Object.extend({
        // There will be code to load this abstract table from a database, or a description of how it is in the db.

        'fields': {
            // Though it should be able to work as a string too.

            // Won't use automatic assignment right now.

            //'schema': Object
        },

        'init': function(spec) {

            //console.log('');
            //console.log('init Table Abstract');
            //console.log('spec', spec);
            //console.trace();
            //console.log('');

            // Polymorphism in how this gets specified to the constructor?

            var that = this;

            this._super(spec);

            //throw 'stop';
            // The spec may be a JSON object that's not so specifically following the Postgres format.
            //  Needs to respond to Postgres parameters, as well as the jsgui parameters which aims to be uniform accross different DB implementations.


            // set the columns from information_schema_column_rows?


            //  may want these the be indexed, with a string index.
            //   could use some kind of IndexedCollection for this.


            // Having a problem with the index by name.
            //  It could be related to the name being a Data_Value, and it not recognising that value and indexing it as such.




            this.set('columns', new Collection({
                'index_by': 'name'
            }));

            this.set('constraints', new Collection({
                'index_by': 'name'
            }));

            var columns = this.get('columns');



            this.load_from_spec(spec, ['name', 'schema_name', 'single_name']);

            if (spec.schema) {

                // Throw an error if the spec abstract database already contains a schema with the same name
                //  (and it is not this abstract schema?)


                this.set('schema', spec.schema);

                var schema_tables = spec.schema.get('tables');


                //console.log('schema_tables.length()', schema_tables.length());

                //console.log('spec.name', spec.name);
                //console.log('tof spec.name', tof(spec.name));

                var existing_table = schema_tables.get(spec.name);

                // It seems that the tables are not being indexed properly in their collection???

                //console.log('schema_tables.index_system', schema_tables.index_system);

                // It looks like the schemas' tables are not being indexed properly.



                var pui = schema_tables.index_system._primary_unique_index;
                var kvs = pui.sorted_kvs;

                var keys = kvs.keys();
                //console.log('keys', keys);




                if (existing_table) {
                    //console.log('existing_schema', stringify(existing_schema));
                    console.trace();
                    throw 'Not expecting existing table';
                } else {
                    schema_tables.push(this);


                    //throw 'stop';
                }
                // Can also check the database to see if it contains the abstract schema.

                // if it does not have it, push

            }

            //var c = this.get('constraints');
            //console.log('c', c);


            //console.log('spec.columns', spec.columns);
            if (tof(spec.columns) == 'array') {


                // Don't just load them all without processing them
                //  Each item should be given to the column constructor.

                var columns = this.get('columns');

                //throw 'stop';
                //console.log('');

                each(spec.columns, function(spec_column) {
                    //console.log('spec_column', spec_column);

                    // Adding another property to an array?
                    //  Questionable.

                    //spec_column.table = that;

                    // {table, array_spec};
                    //  It gets more complicated and convoluted, but it will allow columns to be specified more easily.

                    // However, need to set up the primary key or other constraints if it applies to the row.

                    //  A column may be created that has FK constraints as well as PK ones.


                    //console.log('spec', spec);

                    // Need the column name!



                    var column = new Abstract.Column({
                        'arr_spec': spec_column,
                        'table': that
                    });
                    console.log('column', column);
                    //throw 'stop';


                    // Pushing the column is a problem.

                    //console.log('tof columns', tof(columns));
                    //throw 'stop';
                    columns.push(column);

                })

                //this.get('columns').load_array(spec.columns);
            }


            //var columns = this.set('columns', spec.columns || []);


            // a problem with set not returning what I think it should.






            //throw 'stop';

            // why no constrints collection though?

            if (tof(spec.constraints) == 'array') {
                this.get('constraints').load_array(spec.constraints);
            }

            //this.set('constraints', spec.constraints || []);
            // constraints collection, indexed by name instead.



            //this.set('name', spec.name);

            // only want to set various properties if they have been defined.
            // d_set... sets if defined.

            // could use a local function.
            //  or preferably set multiple things if defined.

            // this.set_if_defined(map);
            //  or read them from the spec...
            // load_from_spec(spec, items)

            //this.set('schema_name', spec.schema_name);

            //this.set('single_name', spec.single_name);


            if (is_defined(spec.parent_table)) {
                this.set('parent_table', spec.parent_table);
            }
            var that = this;


            if (is_defined(spec.information_schema_column_rows)) {
                each(spec.information_schema_column_rows, function(information_schema_row) {

                    var column = new Abstract.Column({
                        // possibly just give the information schema row as the spec.

                        'information_schema': information_schema_row
                    });
                    columns.push(column);
                });

            }


            // update column_not_null.

            if (is_defined(spec.not_null)) {
                // will make columns have this constraint by default
                //  I think unless they are pks because they can't be null anyway.
                this.set('not_null', spec.not_null);


                // could go through the columns given, making them not null.

                // not very mvc.
                this.update_not_null();

            }


            // not working in stringify if there are 2 - way references.
            //this.update_column_parents();

            // when we have a foreign key, we need to know where it refers.


        },

        'ensure_pk_constraint': function(constraint) {



            // would need to create the constraint object I think.

            var constraints = this.get('constraints');
            //console.log('constraints', constraints);
            constraints.push(constraint);

        },

        'update_column_parents': function() {
            var that = this;
            each(this.get('columns'), function(i, column) {
                column.table = that;
            });
        },

        'update_not_null': function() {
            if (this.not_null) {
                each(this.get('columns'), function(i, column) {
                    // look at the constraints.

                    var has_not_null = false, has_unique = false, has_pk = false;
                    each(column.get('constraints'), function(constraint) {
                        //console.log('');
                        //console.log('constraint ' + stringify(constraint));

                        if (constraint.name == 'primary key') {
                            has_pk = true;
                        }
                        if (constraint.name == 'unique') {
                            has_unique = true;
                        }
                        if (constraint.name == 'not null') {
                            has_not_null = true;
                        }
                    });

                    if (!has_not_null && ! has_pk) {
                        var nn = new Abstract.Column_Constraint.Not_Null();

                        // It's still an array for the moment.
                        //  When it's another sort of collection
                        //   (probably an indexed collection, indexed by name)
                        //   it is also likely to have a push function.


                        column.get('constraints').push(nn);
                    }

                    //console.log('column.constraints ' + stringify(column.get('constraints')));

                });


            }
        },

        'get_column_dict': function() {
            var res = {};
            each(this.get('columns'), function(i, v) {
                res[v.name] = v;
            });
            return res;
        },

        'get_create_statement': function() {
            return 'CREATE TABLE ' + this.get_string_description();

        },
        'get_string_description': function() {
            var res = [];

            if (this.get('schema_name')) {
                res.push(this.get('schema_name') + '.');
            }

            res.push(this.get('name') + ' ');

            res.push('(\n');

            if (this.get('columns').length() > 0) {

                var first = true;



                each(this.get('columns'), function(v) {

                    // could apply the not null to each column here...


                    if (first) {
                        first = false;
                    } else {
                        res.push(',');
                        res.push('\n');
                    }
                    //console.log('v ' + stringify(v));
                    res.push(v.toString());

                });


            }

            var constraints = this.get('constraints');

            if (constraints && constraints.length() > 0) {
                //var first = true;
                each(this.get('constraints'), function(v) {
                    if (first) {
                        first = false;
                    } else {
                        res.push(',');
                        res.push('\n');
                    }
                    res.push(v.toString());
                });

            }

            res.push('\n');
            res.push(')');

            return res.join('');
        },
        'toString': function() {
            return this.get_string_description();
        },
        'toFQN': function() {

            // Fully qualified name...

            // could possibly use this.has functions.

            //if (is_defined(this.schema_name) && is_defined(this.name)) {
            if (this.has('schema_name') && this.has('name')) {
                return this.get('schema_name') + '.' + this.get('name');

            } else if (is_defined(this.get('name'))) {

                // could have a parent as the schema.

                return this.get('name');
            }
        }
    });


    return Table;
});



