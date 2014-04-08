
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/jsgui-data-structures', 'assert', '../../test-utils/test-utils'],
function (Data_Structures, assert, test_utils) {

    describe("core/data-structures/Sorted_KVS.spec.js", function () {

        it("should perform basic operations", function () {

            var kvs = new Data_Structures.Sorted_KVS();

            kvs.put({ c: 1, b: 2, a: 3 });
            kvs.put({ b: 4 });

            // the keys are sorted, but the values are not
            assert.deepEqual(kvs.keys_and_values(), [['a', 3], ['b', 4], ['b', 2], ['c', 1]]);

            assert.deepEqual(kvs.keys(), ['a', 'b', 'b', 'c']);

            assert.deepEqual(kvs.get('a'), [3]);
            assert.deepEqual(kvs.get('b'), [4, 2]);
            assert.deepEqual(kvs.get('d'), []);

            assert.deepEqual(kvs.has('a'), true);
            assert.deepEqual(kvs.has('b'), true);
            assert.deepEqual(kvs.has('d'), false);

            assert.deepEqual(kvs.key_count('a'), 1);
            assert.deepEqual(kvs.key_count('b'), 2);
            assert.deepEqual(kvs.key_count('d'), 0);
            assert.deepEqual(kvs.key_count(), 4);

            kvs.out('d');
            assert.deepEqual(kvs.keys_and_values(), [['a', 3], ['b', 4], ['b', 2], ['c', 1]]);

            kvs.out('b');
            assert.deepEqual(kvs.keys_and_values(), [['a', 3], ['c', 1]]);

            kvs.clear();
            assert.deepEqual(kvs.keys_and_values(), []);

        });


        it("should perform each() operation", function () {

            var kvs = new Data_Structures.Sorted_KVS();

            kvs.put({ c: 1, b: 2, a: 3 });
            kvs.put({ b: 4 });

            var result = "";
            var callback = function (key, value) {
                result += key + "=" + value + "; ";
            };

            kvs.each(callback);

            assert.deepEqual(result, "a=3; b=4; b=2; c=1; ");
        });

        it("should perform prefix operation", function () {

            var kvs = new Data_Structures.Sorted_KVS();

            kvs.put({ key_111: 111 });
            kvs.put({ key_121: 121 });
            kvs.put({ key_122: 122 });
            kvs.put({ key_131: 131 });

            // ------- get_keys_by_prefix() -------

            assert.deepEqual(kvs.get_keys_by_prefix(""), ["key_111", "key_121", "key_122", "key_131"]);
            assert.deepEqual(kvs.get_keys_by_prefix("key_"), ["key_111", "key_121", "key_122", "key_131"]);

            assert.deepEqual(kvs.get_keys_by_prefix("key_0"), []);
            assert.deepEqual(kvs.get_keys_by_prefix("key_1"), ["key_111", "key_121", "key_122", "key_131"]);
            assert.deepEqual(kvs.get_keys_by_prefix("key_2"), []);

            assert.deepEqual(kvs.get_keys_by_prefix("key_10"), []);
            assert.deepEqual(kvs.get_keys_by_prefix("key_11"), ["key_111"]);
            assert.deepEqual(kvs.get_keys_by_prefix("key_12"), ["key_121", "key_122"]);
            assert.deepEqual(kvs.get_keys_by_prefix("key_13"), ["key_131"]);
            assert.deepEqual(kvs.get_keys_by_prefix("key_14"), []);

            assert.deepEqual(kvs.get_keys_by_prefix("key_111"), ["key_111"]);
            assert.deepEqual(kvs.get_keys_by_prefix("key_1111"), []);

            // ------- get_by_prefix() -------

            assert.deepEqual(kvs.get_by_prefix(""), [["key_111", 111], ["key_121", 121], ["key_122", 122], ["key_131", 131]]);
            assert.deepEqual(kvs.get_by_prefix("key_"), [["key_111", 111], ["key_121", 121], ["key_122", 122], ["key_131", 131]]);

            assert.deepEqual(kvs.get_by_prefix("key_0"), []);
            assert.deepEqual(kvs.get_by_prefix("key_1"), [["key_111", 111], ["key_121", 121], ["key_122", 122], ["key_131", 131]]);
            assert.deepEqual(kvs.get_by_prefix("key_2"), []);

            assert.deepEqual(kvs.get_by_prefix("key_10"), []);
            assert.deepEqual(kvs.get_by_prefix("key_11"), [["key_111", 111]]);
            assert.deepEqual(kvs.get_by_prefix("key_12"), [["key_121", 121], ["key_122", 122]]);
            assert.deepEqual(kvs.get_by_prefix("key_13"), [["key_131", 131]]);
            assert.deepEqual(kvs.get_by_prefix("key_14"), []);

            assert.deepEqual(kvs.get_by_prefix("key_111"), [["key_111", 111]]);
            assert.deepEqual(kvs.get_by_prefix("key_1111"), []);
        });



    });

});


