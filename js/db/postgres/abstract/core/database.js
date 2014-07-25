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

    var Schema = require('./schema');

    var Database = Data_Object.extend({
        'init': function(spec) {
            this._super(spec);
            this.set('name', spec.name);

            this.set('schemas', new Collection({
                'index_by': 'name'
            }));

            if (spec.tables && !spec.schemas) {
                //console.log('!!!!!!!');
                spec.schemas = [{
                    'name': 'public',
                    'tables': spec.tables
                }];
            }



            if (tof(spec.schemas) == 'array') {
                var schemas = this.get('schemas');
                //this.get('schemas').load_array(spec.schemas);
                each(spec.schemas, function(spec_schema, i) {
                    var tss = tof(spec_schema);
                    if (tss == 'object') {
                        //schemas
                        var abstract_schema = new Schema(spec_schema);
                        schemas.push(abstract_schema);
                    } else {
                        console.log('tss', tss);
                        throw 'NYI';
                    }
                });

            }
        },

        'compare': function(target) {
            // A lot of abstract DB objects will have compare functions.
            //  Want to see if they are the same and if not describe the differences.

            // May need to use some more intelligence / extra rules to spot equivalents.
            //  Functionally identical things will not need to be changed.

            // same, added, removed, changed

            // Compare the tables to each other.
            //  See which tables there are...

            var existing = this;

            var map_existing_schemas = {};
            var map_target_schemas = {};

            var existing_schemas = existing.get('schemas');
            var target_schemas = target.get('schemas');

            // Think it did not load the existing schema's name.

            existing_schemas.each(function(i, v) {
                var name = v.get('name');
                console.log('name', name);
                //throw 'stop';
                // deoptimization here I think because it changes types.
                if (name && name.value) name = name.value();

                //.value();

                console.log('1) name', name);
                //throw 'stop';

                map_existing_schemas[name] = v;
            });

            target_schemas.each(function(i, v) {

                // v.val ...
                // unwrap(v.get('name'))


                var name = v.get('name').value();
                console.log('2) name', name);
                //throw 'stop';
                map_target_schemas[name] = v;
            });

            console.log('target_schemas.length() ' + target_schemas.length());
            //throw 'stop';

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

            var arr_missing = [], arr_removed = [], arr_common = [];

            each(map_existing_schemas, function(v, i) {
                console.log('1) i', i);

                if (map_target_schemas[i]) {
                    map_common[i] = true;
                    arr_common.push(i);
                } else {
                    map_removed[i] = v;
                    arr_removed.push(i);
                }
            });

            each(map_target_schemas, function(v, i) {
                console.log('2) i', i);

                if (map_existing_schemas[i]) {
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

            // then for every item in common, we do comparisons within them

            each(arr_common, function(name, i) {
                var existing_schema = map_existing_schemas[name];
                var target_schema = map_target_schemas[name];



                var schema_comparison_result = existing_schema.compare(target_schema);
                console.log('schema_comparison_result', schema_comparison_result);

            });




            throw 'stop';



        }

    })


    return Database;
});



