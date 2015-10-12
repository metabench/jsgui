
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/jsgui-data-structures-doubly-linked-list', '../../../core/jsgui-data-structures', 'assert', '../../test-utils/test-utils'],
function (Doubly_Linked_List, Data_Structures, assert, test_utils) {

    describe("z_core/data-object /test.spec.js ", function () {

        it("test circular reference", function () {
            //
            var okvs1 = new Data_Structures.Ordered_KVS();
            var okvs2 = new Data_Structures.Ordered_KVS();
            //
            okvs1.put("flags", "f1");
            okvs2.put("flags", "f1");
            //
            //assert.deepEqual(okvs1, okvs2);
            test_utils.assertDeepEqual(okvs1, okvs2);
            //
            okvs1.node_map.flags.xxx = 1;
            //test_utils.assertDeepEqual(okvs1, okvs2);
            //assert.throws(function () { test_utils.assertDeepEqual(okvs1, okvs2); });
            assert.notDeepEqual(okvs1, okvs2);
        });



    });


});


