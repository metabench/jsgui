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

    var Table = require('./table');

    var Schema = Data_Object.extend({
        'init': function(spec) {
            // schemas have collections of other things.
            this._super(spec);
            // right now will just use arrays.

            // Likely to have some other MVC database representation for the client.
            //  Responding to updates, actually handling data updates with the client
            //  with authentication and authorization done.

            // just an array of tables...
            //  may want them indexed as well
            //  and then may find that an indexed_collection is actually simpler.

            // could just have a dict of databases.

            //this.name = spec.name;
            this.set('name', spec.name);
            // could possibly handle the tables collection differently.
            //  not completely sure how data_item would solve that.

            //  even when not doing nested properties, could there be collection properties available?

            // or maybe just create the collection for the moment.
            //  tables could be uniquely named.
            //  functions are not. they are unique with the name and the signature.






            // table could be represented as a map without too much difficulty.
            //  could have an index of tables.

            // the nested data system could prove useful here... but it is a large system to use.


            // what about getting something so that properties can have types?
            //  perhaps nested could use that type system too?

            // nested could be used for setting things in greater depth, however.
            //  it would get more complicated.

            // DataObjects I think.

            // I think non-nested, or not very nested...
            //  But I also think being able to set something, giving it an array, but it buts it into a more advanced collection.






            // tables should also be a collection.
            //  tables will be unique by name.

            // Moving over to the Collections methodology should make it easier to use this module.
            //  The code may become more bulky, but will be more flexible to use.
            //  Will be able to do tables.get[name], and they still get held in the order in the array.
            //  The order of the tables is relevant when persisting things.




            // create a new collection for the tables.
            //  have them indexed by name.




            //this.tables = spec.tables || [];
            //this.set('tables', spec.tables || []);

            // may be best to have the tables be a collection so that it can be get or set when a new one is put in.

            this.set('tables', new Collection({
                'index_by': 'name'
            }));

            this.set('sequences', new Collection({
                'index_by': 'name'
            }));



            // Then when a table is added to that collection, it should index it properly.

            // Using load_array...
            //  Does that create them as Data_Objects?
            //  They may not be given in the JSON as

            // Need to load up the sequences from the spec too.



            if (tof(spec.tables) == 'array') {
                var tables = this.get('tables');
                // But the tables are of a specific type.
                //  We could make a new shorthand, but loading the tables one by one using the Abstract Table constructor is the way to do this.
                each(spec.tables, function(spec_table, i) {
                    var tst = tof(spec_table);

                    if (tst == 'object') {
                        var abstract_table = new Table(spec_table);
                        tables.push(abstract_table);
                    } else {
                        console.log('tst', tst);
                        throw 'Not yet implemented'
                    }
                });

                //this.get('tables').load_array(spec.tables);
            }

            if (spec.database) {

                // Throw an error if the spec abstract database already contains a schema with the same name
                //  (and it is not this abstract schema?)


                this.set('database', spec.database);

                var database_schemas = spec.database.get('schemas');
                //console.log('database_schemas.length()', database_schemas.length());

                var existing_schema = database_schemas.get(spec.name);
                if (existing_schema) {
                    //console.log('existing_schema', stringify(existing_schema));
                    console.trace();
                    throw 'Not expecting existing schema';
                } else {
                    database_schemas.push(this);
                }



                // Can also check the database to see if it contains the abstract schema.

                // if it does not have it, push

            }
            // So the abstract schema can link back to the database.



            // function collection - need to be able to keep track of functions of the same name but with different signatures.
            //  when there are functions of the same name but different sigs, a map could be put in place.



            // May want to index functions by their signatures.


            //this.functions = spec.functions || [];
            //this.set('functions', spec.functions || []);
            this.set('functions', new Collection({
                //'index_by': 'specific_name'
            }));

            if (tof(spec.functions) == 'array') {
                this.get('functions').load_array(spec.functions);
            }


            // The functions could be in a collection that indexes them by name and signature.
            //  Probably not right now though.

            // the function index could be more difficult.



        },

        'compare': function(target) {
            var existing = this;

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

            var arr_missing = [], arr_removed = [], arr_common = [];

            each(map_existing_tables, function(v, i) {
                console.log('1) i', i);

                if (map_target_tables[i]) {
                    map_common[i] = true;
                    arr_common.push(i);
                } else {
                    map_removed[i] = v;
                    arr_removed.push(i);
                }
            });

            each(map_target_tables, function(v, i) {
                console.log('2) i', i);

                if (map_existing_tables[i]) {
                    //map_common[i] = v;
                } else {
                    map_missing[i] = v;
                    arr_missing.push(i);
                }
            });

            console.log('map_missing', map_missing);
            console.log('map_removed', map_removed);
            console.log('map_common', map_common);

            console.log('arr_missing', arr_missing);
            console.log('arr_removed', arr_removed);
            console.log('arr_common', arr_common);

            // Then do the comparisons on the tables in common.

            each(arr_common, function(name, i) {
                var existing_table = map_existing_tables[name];
                var target_table = map_target_tables[name];



                var table_comparison_result = existing_table.compare(target_table);
                console.log('table_comparison_result', table_comparison_result);

            });

            // Build up the arrays of what is missing, removed, changed, same.
            //  Want to bring through information about what the table comparison says about the similarities and differences between them.








            throw 'stop';

            var res = {
                'tables': {
                    //'missing':
                }
            }
        }





        // Functions within schema?

        // Other functions will ensure that abstract things have been represented.



    })


    return Schema;
});



