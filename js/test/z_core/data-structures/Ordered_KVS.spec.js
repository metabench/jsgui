
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/jsgui-data-structures', 'assert', '../../test-utils/test-utils'],
function (Data_Structures, assert, test_utils) {

    describe("core/data-structures/Ordered_KVS.spec.js", function () {

        it("should perform basic operations", function () {

            var kvs = new Data_Structures.Ordered_KVS();

            assert.deepEqual(kvs.length(), 0);

            kvs.put('a', 3);
            kvs.put('b', 2);
            kvs.put('c', 1);
            kvs.push('b', 4);

            assert.deepEqual(kvs.length(), 4);

            assert.deepEqual(kvs.keys_and_values(), [['a', 3], ['b', 2], ['c', 1], ['b', 4]]);

            assert.deepEqual(kvs.keys(), ['a', 'b', 'c', 'b']);
            assert.deepEqual(kvs.values(), [3, 2, 1, 4]);

            assert.deepEqual(kvs.get('a'), 3);
            assert.deepEqual(kvs.get('b'), 4); // last added
            assert.deepEqual(kvs.get('d'), undefined);

            assert.throws(function () { kvs.out('d'); }, Error);

            kvs.out('b');
            assert.deepEqual(kvs.keys_and_values(), [['a', 3], ['b', 2], ['c', 1]]);

            assert.deepEqual(kvs.get('b'), undefined); // !!!

            assert.throws(function () { kvs.out('b'); }, Error); // !!!

            kvs.out('a');
            kvs.out('c');
            assert.deepEqual(kvs.keys_and_values(), [['b', 2]]); // there is no vay to remove this item

        });


        it("should perform each() operation", function () {

            var kvs = new Data_Structures.Ordered_KVS();

            kvs.put('a', 3);
            kvs.put('b', 2);
            kvs.put('c', 1);
            kvs.put('b', 4);

            var result = "";
            var callback = function (key, value) {
                result += key + "=" + value + "; ";
            };

            kvs.each(callback);

            assert.deepEqual(result, "a=3; b=2; c=1; b=4; ");
        });

        // -----------------------------------------------------
        //	test_ordered_kvs
        // -----------------------------------------------------

        it("test_ordered_kvs", function () {

            var test_ordered_kvs = function () {
                var okvs = new Data_Structures.Ordered_KVS();

                okvs.push('id', {
                    'name': 'id',
                    'str_def': 'pk guid',
                    'obj_def': {
                        'is_pk': true,
                        'data_type': 'guid'
                    }
                });

                okvs.push('username', {
                    'name': 'username',
                    'str_def': 'unique text(32)',
                    'obj_def': {
                        'is_unique': true,
                        'data_type': 'text',
                        'length': 32
                    }
                });

                var actual_keys = [];
                var actual_values = [];

                var expected_value_id = {"name": "id", "str_def": "pk guid", "obj_def": {"is_pk": true, "data_type": "guid"}};
                var expected_value_username = {"name": "username", "str_def": "unique text(32)", "obj_def": {"is_unique": true, "data_type": "text", "length": 32}};

                // =============================================================================

                actual_keys = [];
                actual_values = [];

                okvs.each(function (key, value, stop) {
                    //console.log('key ' + key);
                    //console.log('value ' + stringify(value));
                    actual_keys.push(key);
                    actual_values.push(value);
                });

                assert.equal(actual_keys.length, 2);
                assert.equal(actual_values.length, 2);
                assert.equal(actual_keys[0], "id");
                assert.equal(actual_keys[1], "username");
                assert.deepEqual(actual_values[0], expected_value_id);
                assert.deepEqual(actual_values[1], expected_value_username);

                // =============================================================================

                var actual_nodes = [];
                var actual_node_neighbours = [];

                okvs.dll.each_node(function (node, stop) {
                    //console.log('node ' + node);
                    //console.log('node.neighbours ' + node.neighbours);
                    //console.log('value ' + stringify(value));
                    actual_nodes.push(node);
                    actual_node_neighbours.push(node.neighbours);
                });

                assert.equal(actual_nodes.length, 2);
                assert.equal(actual_node_neighbours.length, 2);
                assert.equal(actual_nodes[0].toString(), "[object Object]");
                assert.equal(actual_nodes[1].toString(), "[object Object]");
                assert.equal(actual_node_neighbours[0].toString(), ",[object Object]");
                assert.equal(actual_node_neighbours[1].toString(), "[object Object],");

                // =============================================================================

                okvs.out('id');
                //okvs.out('username');

                //console.log('--------------------------------');

                actual_keys = [];
                actual_values = [];

                okvs.each(function (key, value, stop) {
                    //console.log('key ' + key);
                    //console.log('value ' + stringify(value));
                    actual_keys.push(key);
                    actual_values.push(value);
                });

                assert.equal(actual_keys.length, 1);
                assert.equal(actual_values.length, 1);
                assert.equal(actual_keys[0], "username");
                assert.deepEqual(actual_values[0], expected_value_username);

            }
            test_ordered_kvs();


            assert.equal(11111, 11111);
        });

    });

});


