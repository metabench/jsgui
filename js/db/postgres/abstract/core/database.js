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
        }
    })


    return Database;
});



