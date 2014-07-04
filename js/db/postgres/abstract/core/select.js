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

    var Select = Data_Object.extend({
        // different clauses

        // selection expression (columns / *)
        // called 'SELECT List' in postgres docs




        //  options such as distinct



        // from clause
        //  called from_item in postgres docs

        // ordered where conditions
        // group by
        // order by
        // limit
        // offset


        'init': function(spec) {
            this._super(spec);
            // what about 'SELECT 1'.
            //  Specify it through Select(1)?

            //  or selecting a function result.


            //this.select_list = spec.select_list || [];

            // don't want FROM in the case of functions.

            // could list columns or columns with aliases

            //this.from_item = spec.from_item;
            //this.where = spec.where || [];
            //this.group_by = spec.group_by;
            //this.order_by = spec.order_by;
            //this.limit = spec.limit;
            //this.offset = spec.offset;

            this.set('select_list', spec.select_list);
            //  should maybe be a collection.

            this.set('from_item', spec.from_item);
            this.set('where', spec.where || []);
            this.set('group_by', spec.group_by);
            this.set('order_by', spec.order_by);
            this.set('limit', spec.limit);
            this.set('offset', spec.offset);

            this.set('statement_type', 'SELECT');
        },
        'toString': function() {
            var res = [];
            res.push('SELECT ');
            var that = this;

            var get_select_list_str = function() {
                // all the columns.

                var sell = that.get('select_list');
                if (sell === '*')  return sell;

                // it may be an array of items, references to columns.
                //  they could have aliases too, could be alias references.
                var res = [];

                //console.log('tof(sell) ' + tof(sell));
                //console.log('(sell) ' + stringify(sell));

                if (tof(sell) == 'array') {
                    var first = true;
                    each(sell, function(v) {

                        //console.log('v ' + v);

                        if (!first) {
                            res.push(', ');
                        } else {
                            first = false;
                        }

                        if (tof(v) == 'array') {
                            if (v.length == 2) {
                                // and both are strings
                                //console.log('tof(v[0]) ' + tof(v[0]));
                                //console.log('tof(v[1]) ' + tof(v[1]));

                                res.push(v[0]);
                                res.push(' AS ');
                                res.push(v[1]);

                            }
                        } else {

                            if (tof(v) == 'string') {
                                res.push(v);
                            } else {
                                res.push(v.toString());
                            }


                        }
                    });
                }
                if (tof(sell) == 'data_value') {
                    res.push(sell.value());
                }

                return res.join('');

            }

            var get_from_item_str = function() {
                // similar to the select list.

                // will call toString???

                // May be calling it on abstract columns, or may be given the names.

                // table reference? could refer to a view too.

                // toFQN
                var from_item = that.get('from_item');
                //console.log('from_item ' + from_item);

                var res = [];
                //console.log('tof(from_item)', tof(from_item));
                if (from_item.toFQN) {
                    res.push(from_item.toFQN());
                } else {
                    if (tof(from_item) == 'string') {
                        res.push(from_item);
                    } else if (tof(from_item) == 'data_value') {
                        res.push(from_item.value());
                    } else {
                        res.push(from_item.toString());
                    }


                }


                return res.join('');


            }
            res.push(get_select_list_str());

            // won't always have 'from'.

            var t_select_list = tof(this.get('select_list'));
            //console.log('select_list', this.get('select_list'));
            //console.log('t_select_list', t_select_list);
            //console.log('tof t_select_list', tof(t_select_list));



            if (t_select_list == 'array' && this.get('select_list').length > 0 ||
                t_select_list == 'string' || t_select_list == 'data_value') {
                res.push(' FROM ');
            }

            var str_from_item = get_from_item_str();
            //console.log('str_from_item', str_from_item);
            res.push(str_from_item);

            // are there where clauses?
            var where = this.get('where');
            //console.log('* where ' + stringify(where));


            var where_get_str = function(where_item) {
                //console.log('tof(where_item) ' + tof(where_item));
                //console.log('stringify(where_item) ' + stringify(where_item));

                if (tof(where_item) == 'array') {
                    if (where_item.length == 2) {
                        //console.log('tof(where_item[1]) ' + tof(where_item[1]));
                        if (tof(where_item[1]) == 'string') {
                            var res = where_item[0] + ' = \'' + where_item[1] + '\'';
                            return res;
                        } else {
                            // ['param', val]

                            if (tof(where_item[1]) == 'array') {
                                if (where_item[1][0] === 'param' || where_item[1][0] === 'parameter') {
                                    var res = where_item[0] + ' = ' + where_item[1][1];
                                    return res;
                                }

                            }

                            // will probably be .get('name')

                            if (tof(where_item[1]) == 'object') {
                                //console.log('where_item[1] ' + stringify(where_item[1]));
                                if (is_defined(where_item[1].constraint_name)) {
                                    var res = where_item[0] + ' = \'' + where_item[1].constraint_name + '\'';
                                    return res;
                                }

                            }

                            if (tof(where_item[1]) == 'data_value') {

                                var v = where_item[1].value();

                                //throw 'stop';
                                //console.log('where_item[1] ' + stringify(where_item[1]));
                                //if (is_defined(where_item[1].constraint_name)) {
                                var res = where_item[0] + ' = \'' + v + '\'';
                                return res;
                                //}

                            }

                            // may have a tofqn

                            //console.log('where_item[1].toFQN ' + where_item[1].toFQN);

                        }
                    }
                }
            }

            var get_where_str = function() {
                var res = [];
                if (tof(where) == 'array') {
                    //console.log('where.length', where.length);
                    if (where.length > 0) {
                        var first = true;
                        res.push(' WHERE ');
                        each(where, function(where_item) {
                            if (!first) {
                                res.push(' AND ');
                            } else {
                                first = false;
                            }

                            // need to get the where item as string. It may not be in there as a where clause object, could be given just as two objects in an array, meaning they are equal.
                            //console.log('where_item ' + stringify(where_item));
                            res.push(where_get_str(where_item));

                            //res.push(where_item.to)
                        });
                    }



                } else {
                    if (tof(where) == 'string') {

                    }
                }

                //console.log('get_where_str ' + res);
                return res.join('');
            }

            res.push(get_where_str());

            var get_group_by_str = function() {

            }

            res.push(get_group_by_str());


            var get_order_by_str = function() {
                // how does order by get specified?
                //  this is where signature processing could be useful.
                //  identifying a single order by item, which is an array.

                var res = [];


                var ob = that.get('order_by');

                //console.log('');
                //console.log('ob', ob);
                //console.log('tof ob', tof(ob));
                // order_by seems naturally an array.

                if (tof(ob) == 'array') {
                    // order by array could be a few different fields in an array.

                    if (ob.length > 0) {
                        res.push(' ORDER BY ');

                        var ob_sig = get_item_sig(ob, 1);
                        //console.log('ob_sig', ob_sig);

                        if (ob_sig == '[s,s]') {
                            res.push(ob[0]);
                            res.push(' ');
                            res.push(ob[1]);
                        } else {
                            // each item in the order by array gets processed.

                            each(ob, function(v) {
                                // check the signature of the item, if so it's an order by item.
                                var ob_sig = get_item_sig(v);
                                if (ob_sig == '[s,s]') {
                                    res.push(v[0]);
                                    res.push(' ');
                                    res.push(v[1]);
                                }
                            });
                        }

                    }

                    // a single item??






                }


                return res.join('');
            }

            res.push(get_order_by_str());


            //res.push(';');

            // Perhaps a 'statement' could contain select and then be terminated with ';'.

            return res.join('');



        }


    });


    return Select;
});



