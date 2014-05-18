
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/jsgui-data-structures-doubly-linked-list', 'assert'],
function (Doubly_Linked_List, assert) {

    describe("z_core/data-structures/doubly-linked-list.spec.js", function () {

        function getValues(list) {
            var result = [];
            //
            list.each(function (value) { result.push(value); });
            //
            return result;
        }

        function getNodes(list) {
            var result = [];
            //
            list.each_node(function (node) { result.push(node); });
            //
            return result;
        }


        // -----------------------------------------------------
        //	Node
        // -----------------------------------------------------

        it("should be able to create a node", function () {

            var Node = Doubly_Linked_List.Node;

            var nodePrev = new Node({});
            var nodeNext = new Node({});

            var node = new Node({value: 1, neighbours: [nodePrev, nodeNext]});
            assert.equal(node.value, 1);
            assert.equal(node.previous(), nodePrev);
            assert.equal(node.next(), nodeNext);

        });

        // -----------------------------------------------------
        //	Doubly_Linked_List
        // -----------------------------------------------------

        it("should performs Doubly_Linked_List operations", function () {

            var Node = Doubly_Linked_List.Node;

            var list = new Doubly_Linked_List();

            var node101 = new Node({ value: 101 });
            var node102 = new Node({ value: 102 });
            var node103 = new Node({ value: 103 });
            var node104 = new Node({ value: 104 });
            var node105 = new Node({ value: 105 });

            list.push(node101);
            list.push(node102);
            list.push(node103);
            list.push(node104);

            assert.deepEqual(getValues(list), [101, 102, 103, 104]);

            list.remove(node102); assert.deepEqual(getValues(list), [101, 103, 104]);
            list.remove(node101); assert.deepEqual(getValues(list), [103, 104]);
            list.remove(node104); assert.deepEqual(getValues(list), [103]);
            list.remove(node103); assert.deepEqual(getValues(list), []);

            list.insert_beginning(node103); assert.deepEqual(getValues(list), [103]);
            list.insert_beginning(node101); assert.deepEqual(getValues(list), [101, 103]);

            list.insert_before(node102, node103); assert.deepEqual(getValues(list), [101, 102, 103]);

            list.insert_after(node105, node103); assert.deepEqual(getValues(list), [101, 102, 103, 105]);
            list.insert_after(node104, node103); assert.deepEqual(getValues(list), [101, 102, 103, 104, 105]);

            assert.deepEqual(getNodes(list), [node101, node102, node103, node104, node105]);

        });


        // -----------------------------------------------------
        //	test_doubly_linked_list
        // -----------------------------------------------------

        it("test_doubly_linked_list", function () {

            var test_doubly_linked_list = function () {
                //console.log('test_doubly_linked_list');
                //var dll = new Data_Structures.Doubly_Linked_List();
                var dll = new Doubly_Linked_List();

                dll.push('James');
                dll.push('Vickers');

                //console.log('dll ' + stringify(dll));

                //console.log('dll.length ' + dll.length);
                assert.equal(dll.length, 2);

                var expected = "";
                dll.each(function (value, stop) {
                    //console.log('value ' + value);
                    expected += value + "/";
                });
                assert.equal(expected, "James/Vickers/");
            }
            test_doubly_linked_list();

        });


    });

});


