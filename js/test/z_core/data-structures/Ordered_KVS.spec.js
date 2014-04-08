
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


    });

});


