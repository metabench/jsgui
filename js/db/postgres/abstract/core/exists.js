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

    var Exists = Data_Object.extend({
        'init': function(spec) {
            this._super(spec);
            this.set('subquery', spec.subquery);
        },
        'toString': function() {
            var res = [];
            res.push('EXISTS (');
            res.push(this.get('subquery').toString());
            res.push(')');
            return res.join('');
        }

    });


    //return Exists;
//});
return Exists;
