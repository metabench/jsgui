
requirejs.config({
    baseUrl: '../test/z_core/',
	paths: {
	    assert: '../../test-in-browser/lib/assert/assert'
    }
});

requirejs(
    [
        "data/constraint.spec",
        "data/data-object-fields-collection.spec",
        //
        "data-object/Data_Object.spec",
        "data-object/Data_Value.spec",
        "data-object/Evented_Class.spec",
        //
        "data-structures/B_Plus_Tree.spec",
        "data-structures/doubly-linked-list.spec",
        "data-structures/Ordered_KVS.spec",
        "data-structures/Ordered_String_List.spec",
        "data-structures/Sorted_KVS.spec",
        "data-structures/StiffArray.spec",
        //
        "essentials/arrayify.spec",
        "essentials/call_multiple_callback_functions.spec",
        "essentials/Class.spec",
        "essentials/each.spec",
        "essentials/mapify.spec",
        "essentials/other.spec"
    ],
    function () {
      //mocha.checkLeaks();
      //mocha.globals(['jQuery']);
      mocha.run();
    }
);