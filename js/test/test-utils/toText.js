
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([
    '../../core/jsgui-data-structures',
    '../../core/collection',
    '../../core/jsgui-data-structures-doubly-linked-list'
], function (
    jsguiDataStructures,
    Collection,
    Doubly_Linked_List
    ) {


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
        if (v instanceof Collection) text = "Collection:" + text;
        if (v instanceof Doubly_Linked_List) text = "Doubly_Linked_List:" + text;
        if (v instanceof Doubly_Linked_List.Node) text = "Doubly_Linked_List.Node:" + text;
        //
        return text;
    }

    var module = {
        'toText': toText
    }

    return module;

});