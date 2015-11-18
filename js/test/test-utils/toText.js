
//if (typeof define !== 'function') {
//    var define = require('amdefine')(module);
//}

//define([
//    '../../core/jsgui-data-structures',
//    '../../core/collection',
//    '../../core/jsgui-data-structures-doubly-linked-list'
//], function (
//    jsguiDataStructures,
//    Collection,
//    Doubly_Linked_List
//    ) {


    var jsguiDataStructures = require('../../core/jsgui-data-structures');
    var Doubly_Linked_List = require('../../core/jsgui-data-structures-doubly-linked-list');

    var Data_Value = require('../../core/data-value');
    var Data_Object = require('../../core/data-object');
    var Enhanced_Data_Object = require('../../core/enhanced-data-object');
    var Collection = require('../../core/collection');

    function toText(v) {
        var text = "" + v; //if (v && v.stringify) text = v.stringify();
        //
        if (Array.isArray(v)) text = "[" + text + "]";
        //
        if (text == "[object Object]") {
            var t = "{";
            for (key in v) {
                var kv = v[key];
                if (typeof kv == 'function') kv = 'func';
                t += key + ":" + kv + ", ";
            }
            t += "}";
            text = t;
        }
        //
        if (v instanceof jsguiDataStructures.Ordered_KVS) text = "Ordered_KVS:" + text;
        if (v instanceof Doubly_Linked_List) text = "Doubly_Linked_List:" + text;
        if (v instanceof Doubly_Linked_List.Node) text = "Doubly_Linked_List.Node:" + text;
        //
        if (v instanceof Data_Value) text = "Data_Value:" + text;
        if (v instanceof Data_Object) text = "Data_Object:" + text;
        if (v instanceof Enhanced_Data_Object) text = "Enhanced_Data_Object:" + text;
        if (v instanceof Collection) text = "Collection:" + text;
        //
        return text;
    }


    module.exports = {
        'toText': toText
    };


    //var module = {
    //    'toText': toText
    //}

    //return module;

//});