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

    var Inner_Join = Data_Object.extend({
        'init': function(spec) {
            // left
            // right
            //  then on something
            //  match_left column
            //  match_right column
            this._super(spec);
            // perhaps could give two columns here...

            // Could allow different ways of expressing it in the code.

            // will process the spec into the correct internal format.

            if (spec.left_table && spec.right_table && spec.left_column && spec.right_column) {
                this.set('left_table', spec.left_table);
                this.set('right_table', spec.right_table);
                this.set('left_column', spec.left_column);
                this.set('right_column', spec.right_column);
            }


        },
        'toString': function() {
            var res = [];
            var str_lt, str_rt;

            //var tlt = tof(this.get('left_table'));
            //console.log('tlt', tlt);

            var lt = this.get('left_table');
            var rt = this.get('right_table');

            if (lt.value) {
                str_lt = lt.value();
            } else {
                str_lt = lt;
            }


            if (rt.value) {
                str_rt = rt.value();
            } else {
                str_rt = rt;
            }
            //if (tlt == 'string') {
            //	str_lt = this.get('left_table');
            //};
            //if (tof(this.get('right_table')) == 'string') {
            //	str_rt = this.get('right_table');
            //}

            res.push(str_lt);

            res.push(' INNER JOIN ');
            //res.push()
            res.push(str_rt);

            // the fully qualified names of the columns.


            res.push(' ON (');
            res.push(str_lt);
            res.push('.');
            res.push(this.get('left_column'));
            res.push(' = ');
            res.push(str_rt);
            res.push('.');
            res.push(this.get('right_column'));
            res.push(')');
            return res.join('');
        }
    });


    return Inner_Join;
});



