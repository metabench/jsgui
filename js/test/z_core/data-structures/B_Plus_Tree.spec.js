
describe("z_core/data-structures/B_Plus_Tree", function () {

    //var jsgui;
    var B_Plus_Tree;
    var assert;

    before(function () {
        //jsgui = require('../../../core/jsgui-lang-essentials');
        B_Plus_Tree = require('../../../core/jsgui-data-structures-b-plus-tree');
        assert = require('assert');
    });

    function expect(val) {
        return {
            toEqual: function (expected) {
                assert.deepEqual(val, expected);
            },
            toThrow: function (expected) {
                assert.throws(val, expected);
            }
        };
    }



    // -----------------------------------------
    //           seeding random:
    // -----------------------------------------

    var seed = 0;

    function random(range) {
        seed = (seed * 9301 + 49297) % 233280;
        var part = seed / (233280.0);
        return Math.floor(part * range);
    }


    // -----------------------------------------
    //           toText(), toString():
    // -----------------------------------------

    var treeToString = function (tree) {
        return nodeToString(tree.root);
    };

    var treeToText = function (tree) {
        return nodeToText(tree.root, "");
    };

    var nodeToString = function (node) {
        if (node.isLeaf) {
            return leafToString(node);
        } else {
            return indexNodeToString(node);
        }
    };

    var nodeToText = function (node, indent) {
        if (node.isLeaf) {
            return leafToText(node, indent);
        } else {
            return indexNodeToText(node, indent);
        }
    }

    var indexNodeToString = function (node) {
        var result = "{";
        for (var i = 0; i < node.keys.count; i++) {
            result += nodeToString(node.children.items[i]);
            result += node.keys.items[i].toString();
        }
        result += nodeToString(node.children.items[node.keys.count]);
        if (node.debugId !== undefined) {
            result += ":" + node.debugId;
        }
        result += "}";
        return result;
    };

    var indexNodeToText = function (node, indent) {
        var result = "";
        for (var i = 0; i < node.keys.count; i++) {
            result += nodeToText(node.children.items[i], indent + "  ");
            result += indent + node.keys.items[i].toString();
            if (node.debugId !== undefined) {
                result += ":" + node.debugId;
            }
            result += "\r\n";
        }
        result += nodeToText(node.children.items[node.keys.count], indent + "  ");
        return result;
    }

    var leafToString = function (leaf) {
        var result = "{";
        for (var i = 0; i < leaf.keys.count; i++) {
            var key = leaf.keys.items[i];
            var value = leaf.values.items[i];
            //
            if (i > 0) result += ",";
            result += key;
            if (key != value) result += ":" + value;
        }
        if (leaf.debugId !== undefined) {
            result += ":" + leaf.debugId;
        }
        result += "}";
        return result;
    };

    var leafToText = function (leaf, indent) {
        return indent + leafToString(leaf) + "\r\n";
    };

    // -----------------------------------------
    //           tree integrity check:
    // -----------------------------------------

    var checkTree = function (tree) {
        var countForward = countWalkLeafsForward(tree);
        var countBackward = countWalkLeafsBackward(tree);
        var countTree = countWalkTree(tree.root);
        //
        if (countForward != countBackward) throw "error: checkTree(): countForward != countBackward";
        if (countForward != countTree) throw "error: checkTree(): countForward != countTree";
        //
        if (tree.root.parent != null) throw "error: checkTree(): root.parent != null";
        //
        checkDepth(tree);
        //
        checkMinMax(tree.root);
        //
        var maxCount = tree.getCapacity();
        var minCount = Math.floor(maxCount / 2);
        checkNodeCapacity(tree.root, minCount, maxCount);
        //
        return countForward;
    };

    var countWalkLeafsForward = function (tree) {
        var count = 0;
        var prevKey = null;
        var leaf = tree.firstLeaf;
        while (leaf != null) {
            for (var i = 0; i < leaf.keys.count; i++) {
                var ok = (prevKey == null) || (leaf.keys.items[i] >= prevKey);
                if (!ok) {
                    throw "error: countWalkLeafsForward()";
                }
                prevKey = leaf.keys.items[i];
                count++;
            }
            leaf = leaf.nextLeaf;
        }
        return count;
    };

    var countWalkLeafsBackward = function (tree) {
        var count = 0;
        var nextKey = null;
        var leaf = tree.lastLeaf;
        while (leaf != null) {
            for (var i = leaf.keys.count - 1; i >= 0; i--) {
                var ok = (nextKey == null) || (leaf.keys.items[i] <= nextKey);
                if (!ok) throw "error: countWalkLeafsBackward()";
                nextKey = leaf.keys.items[i];
                count++;
            }
            leaf = leaf.prevLeaf;
        }
        return count;
    };

    var checkDepth = function (tree) {
        var leaf = tree.firstLeaf;
        var treeDepth = null;
        while (leaf != null) {
            var leafDepth = calcNodeDepth(leaf);
            if (treeDepth == null) treeDepth = leafDepth;
            if (leafDepth != treeDepth) throw "error: checkDepth()";
            leaf = leaf.nextLeaf;
        }
    };

    var calcNodeDepth = function (node) {
        if (node.parent == null) return 1;
        return 1 + calcNodeDepth(node.parent);
    };

    var checkKeysOrder = function (keys) {
        for (var i = 1; i < keys.count; i++) {
            if (keys.items[i - 1] > keys.items[i]) throw "checkKeysOrder()";
        }
    };

    var checkNodeChildrenOrder = function (node) {
        for (var i = 0; i < node.keys.count; i++) {
            var key = node.keys.items[i];
            var leftChild = node.children.items[i];
            var rightChild = node.children.items[i + 1];
            if (leftChild.keys.items[leftChild.keys.count - 1] > key) throw "checkNodeChildrenOrder(): leftChild";
            if (rightChild.keys.items[0] < key) {
                throw "checkNodeChildrenOrder(): rightChild";
            }
        }
    };

    var checkMinMax = function (node) {
        if (node.isLeaf) {
            if (node.keys.count == 0) return null;
            return { min: node.keys.first(), max: node.keys.last() };
        }
        //
        var childrenMinMax = [];
        for (var i = 0; i < node.children.count; i++) childrenMinMax.push(checkMinMax(node.children.items[i]));
        //
        for (var i = 0; i < node.keys.count; i++) {
            var key = node.keys.items[i];
            var maxBefo = childrenMinMax[i].max;
            var minAfte = childrenMinMax[i + 1].min;
            if (key < maxBefo) throw "checkMinMax(): maxBefo";
            if (key > minAfte) throw "checkMinMax(): minAfte";
        }
        //
        return { min: childrenMinMax[0].min, max: childrenMinMax[childrenMinMax.length - 1].max };
    };

    var countWalkTree = function (node) {
        if (node.isLeaf) return node.keys.count;
        //
        checkKeysOrder(node.keys);
        checkNodeChildrenOrder(node);
        //
        var count = 0;
        for (var i = 0; i < node.children.count; i++) {
            if (node.children.items[i].parent != node) throw "countWalkTree(): parent";
            count += countWalkTree(node.children.items[i]);
        }
        return count;
    };

    var checkNodeCapacity = function (node, minCount, maxCount) {
        if (node.keys.count > maxCount) throw "error: checkNodeCapacity(): maxCount";
        if (node.keys.count < minCount) {
            if (node.parent != null) throw "error: checkNodeCapacity(): minCount";
        }
        if (!node.isLeaf) {
            for (var i = 0; i < node.children.count; i++) {
                checkNodeCapacity(node.children.items[i], minCount, maxCount);
            }
        }
    };

    // -----------------------------------------
    //                sample tree:
    // -----------------------------------------

    var createSampleTree = function () {
        // {{{1,2}3{3,4}5{5,6,7}}7{{8,8,8}8{8,8}8{8,9}}}
        //
        var tree = new B_Plus_Tree(4);
        //
        tree.insert(1, 1);
        tree.insert(2, 2);
        tree.insert(2, 2);
        tree.insert(2, 2);
        //
        tree.insert(3, 3);
        tree.insert(4, 4);
        tree.insert(4, 4);
        tree.insert(4, 4);
        //
        tree.insert(5, 5);
        tree.insert(6, 6);
        tree.insert(7, 71);
        tree.insert(7, 72);
        //
        tree.insert(7, 7);
        //
        tree.insert(8, 8);
        tree.insert(8, 82);
        tree.insert(8, 83);
        //
        tree.insert(9, 9);
        tree.insert(9, 9);
        //
        tree.insert(8, 8);
        tree.insert(8, 8);
        tree.insert(8, 8);
        tree.insert(8, 8);
        //
        tree.insert(8, 8);
        //
        tree.remove(7, 71);
        tree.remove(7, 72);
        //
        tree.remove(8, 83);
        tree.remove(8, 82);
        //
        tree.remove(9, 9);
        //
        tree.remove(2, 2);
        tree.remove(2, 2);
        //
        tree.remove(4, 4);
        tree.remove(4, 4);
        //
        return tree;
    };

    // -----------------------------------------
    //                tests:
    // -----------------------------------------

    it("test createSampleTree()", function () {
        var tree = createSampleTree();
        checkTree(tree);
        expect(treeToString(tree)).toEqual("{{{1,2}3{3,4}5{5,6,7}}7{{8,8,8}8{8,8}8{8,9}}}");
    });

    it("test remove(key)", function () {
        var tree = createSampleTree();
        tree.remove(8);
        checkTree(tree);
        expect(treeToString(tree)).toEqual("{{1,2}3{3,4}5{5,6}7{7,9}}");
    });

    it("test findFirst/findNext", function () {
        var tree = createSampleTree();
        //
        var findInfo1 = tree.findFirst();
        expect(findInfo1.foundKey()).toEqual(1);
        findInfo1 = tree.findNext(findInfo1);
        expect(findInfo1.foundKey()).toEqual(2);
        findInfo1 = tree.findNext(findInfo1);
        expect(findInfo1.foundKey()).toEqual(3);
        findInfo1 = tree.findNext(findInfo1);
        expect(findInfo1.foundKey()).toEqual(4);
        findInfo1 = tree.findNext(findInfo1);
        expect(findInfo1.foundKey()).toEqual(5);
        findInfo1 = tree.findNext(findInfo1);
        expect(findInfo1.foundKey()).toEqual(6);
        findInfo1 = tree.findNext(findInfo1);
        expect(findInfo1.foundKey()).toEqual(7);
        findInfo1 = tree.findNext(findInfo1);
        expect(findInfo1.foundKey()).toEqual(8);
        findInfo1 = tree.findNext(findInfo1);
        expect(findInfo1.foundKey()).toEqual(8);
        findInfo1 = tree.findNext(findInfo1);
        expect(findInfo1.foundKey()).toEqual(8);
        findInfo1 = tree.findNext(findInfo1);
        expect(findInfo1.foundKey()).toEqual(8);
        findInfo1 = tree.findNext(findInfo1);
        expect(findInfo1.foundKey()).toEqual(8);
        findInfo1 = tree.findNext(findInfo1);
        expect(findInfo1.foundKey()).toEqual(8);
        findInfo1 = tree.findNext(findInfo1);
        expect(findInfo1.foundKey()).toEqual(9);
        findInfo1 = tree.findNext(findInfo1);
        expect(findInfo1).toEqual(null);
        //
        var findInfo2 = tree.findFirst(3);
        expect(findInfo2.foundKey()).toEqual(3);
        expect(findInfo2.foundValue()).toEqual(3);
        findInfo2 = tree.findNext(findInfo2);
        expect(findInfo2).toEqual(null);
        //
        var findInfo3 = tree.findFirst(8);
        expect(findInfo3.foundKey()).toEqual(8);
        expect(findInfo3.foundValue()).toEqual(8);
        findInfo3 = tree.findNext(findInfo3);
        expect(findInfo3.foundKey()).toEqual(8);
        expect(findInfo3.foundValue()).toEqual(8);
        findInfo3 = tree.findNext(findInfo3);
        expect(findInfo3.foundKey()).toEqual(8);
        expect(findInfo3.foundValue()).toEqual(8);
        findInfo3 = tree.findNext(findInfo3);
        expect(findInfo3.foundKey()).toEqual(8);
        expect(findInfo3.foundValue()).toEqual(8);
        findInfo3 = tree.findNext(findInfo3);
        expect(findInfo3.foundKey()).toEqual(8);
        expect(findInfo3.foundValue()).toEqual(8);
        findInfo3 = tree.findNext(findInfo3);
        expect(findInfo3.foundKey()).toEqual(8);
        expect(findInfo3.foundValue()).toEqual(8);
        findInfo3 = tree.findNext(findInfo3);
        expect(findInfo3).toEqual(null);
        //
        var findInfo4 = tree.findFirst(3, 3);
        expect(findInfo4.foundKey()).toEqual(3);
        expect(findInfo4.foundValue()).toEqual(3);
        findInfo4 = tree.findNext(findInfo4);
        expect(findInfo4).toEqual(null);
    });

    it("test findNext/findPrevious", function () {
        var tree = createSampleTree();
        //
        var findInfo3 = tree.findFirst(8);
        expect(findInfo3.foundKey()).toEqual(8);
        expect(findInfo3.foundValue()).toEqual(8);
        findInfo3 = tree.findNext(findInfo3);
        expect(findInfo3.foundKey()).toEqual(8);
        expect(findInfo3.foundValue()).toEqual(8);
        //
        findInfo3 = tree.findPrevious(findInfo3);
        expect(findInfo3.foundKey()).toEqual(8);
        expect(findInfo3.foundValue()).toEqual(8);
        findInfo3 = tree.findPrevious(findInfo3);
        expect(findInfo3).toEqual(null);
    });

    it("test getValue/setValue", function () {
        var tree = new B_Plus_Tree();
        expect(tree.getValue(1)).toEqual(null);
        tree.setValue(1, 10);
        expect(tree.getValue(1)).toEqual(10);
        tree.setValue(1, 1);
        expect(tree.getValue(1)).toEqual(1);
        checkTree(tree);
        expect(treeToString(tree)).toEqual("{1}");
    });

    it("test count", function () {
        // {{{1,2}3{3,4}5{5,6,7}}7{{8,8,8}8{8,8}8{8,9}}}
        var tree = createSampleTree();
        expect(tree.count()).toEqual(14);
        expect(tree.count(1)).toEqual(1);
        expect(tree.count(8)).toEqual(6);
    });

    it("test clear()", function () {
        var tree = createSampleTree();
        tree.clear();
        checkTree(tree);
        expect(treeToString(tree)).toEqual("{}");
    });

    it("test empty tree", function () {
        var tree = new B_Plus_Tree();
        checkTree(tree);
        expect(treeToString(tree)).toEqual("{}");
    });

    it("test inserts", function () {
        var tree = new B_Plus_Tree(4);
        checkTree(tree);
        expect(treeToString(tree)).toEqual("{}");
        //
        tree.insert([10, 10]);
        checkTree(tree);
        expect(treeToString(tree)).toEqual("{10}");
        //
        tree.insert(30, 30);
        checkTree(tree);
        expect(treeToString(tree)).toEqual("{10,30}");
        //
        tree.insert(20, 20);
        checkTree(tree);
        expect(treeToString(tree)).toEqual("{10,20,30}");
        //
        tree.insert(40, 40);
        checkTree(tree);
        expect(treeToString(tree)).toEqual("{10,20,30,40}");
        //
        tree.insert(50, 50);
        checkTree(tree);
        expect(treeToString(tree)).toEqual("{{10,20}30{30,40,50}}");
    });

    var LARGE_TEST_COUNT = 100;

    it("test insert/remove " + LARGE_TEST_COUNT, function () {
        var tree = new B_Plus_Tree(4);
        for (var i = 1; i <= LARGE_TEST_COUNT; i++) {
            try {
                tree.insert(i, i);
                checkTree(tree);
            } catch (ex) {
                throw ex;
            }
        }
        expect(checkTree(tree)).toEqual(LARGE_TEST_COUNT);
        for (var i = 1; i <= LARGE_TEST_COUNT; i++) {
            try {
                //var before = treeToText(tree);
                //if (i == 29) {
                //    before += "";
                //}
                tree.remove(i, i);
                //var after = treeToText(tree);
                checkTree(tree);
            } catch (ex) {
                throw ex;
            }
        }
        expect(checkTree(tree)).toEqual(0);
    });

    it("test strings insert/remove " + LARGE_TEST_COUNT, function () {
        var tree = new B_Plus_Tree(4);
        for (var i = 1; i <= LARGE_TEST_COUNT; i++) {
            try {
                tree.insert(i + "", i + "");
                checkTree(tree);
            } catch (ex) {
                throw ex;
            }
        }
        expect(checkTree(tree)).toEqual(LARGE_TEST_COUNT);
        for (var i = 1; i <= LARGE_TEST_COUNT; i++) {
            try {
                //var before = treeToText(tree);
                //if (i == 3) {
                //    before += "";
                //}
                tree.remove(i + "", i + "");
                //var after = treeToText(tree);
                checkTree(tree);
            } catch (ex) {
                throw ex;
            }
        }
        expect(checkTree(tree)).toEqual(0);
    });

    it("test insert/remove " + LARGE_TEST_COUNT + " backward", function () {
        var tree = new B_Plus_Tree(4);
        for (var i = LARGE_TEST_COUNT; i >= 1; i--) {
            try {
                //var before = tree.toString();
                //if (i == 992) {
                //    before += "";
                //}
                tree.insert(i, i);
                //var after = tree.toString();
                checkTree(tree);
            } catch (ex) {
                throw ex;
            }
        }
        expect(checkTree(tree)).toEqual(LARGE_TEST_COUNT);
        for (var i = LARGE_TEST_COUNT; i >= 1; i--) {
            try {
                //var before = tree.toString();
                //if (i == 992) {
                //    before += "";
                //}
                tree.remove(i, i);
                //var after = tree.toString();
                checkTree(tree);
            } catch (ex) {
                throw ex;
            }
        }
        expect(checkTree(tree)).toEqual(0);
    });

    it("test equals insert/remove " + LARGE_TEST_COUNT, function () {
        var tree = new B_Plus_Tree(4);
        for (var i = 1; i <= LARGE_TEST_COUNT; i++) {
            try {
                //var before = treeToText(tree);
                //if (i == 9) {
                //    before += "";
                //}
                tree.insert(1, 1);
                //var after = treeToText(tree);
                checkTree(tree);
            } catch (ex) {
                throw ex;
            }
        }
        expect(checkTree(tree)).toEqual(LARGE_TEST_COUNT);
        for (var i = 1; i <= LARGE_TEST_COUNT; i++) {
            try {
                //var before = treeToText(tree);
                //if (i == 5) {
                //    before += "";
                //}
                tree.remove(1, 1);
                //var after = treeToText(tree);
                checkTree(tree);
            } catch (ex) {
                throw ex;
            }
        }
        expect(checkTree(tree)).toEqual(0);
    });

    it("test random update", function () {
        var CAPACITIES_TO_TEST = [4, 5, 7, 10, 25];
        var INSERT_COUNT = 100;
        var UPDATE_COUNT = 1000;
        //
        for (var capacityIndex = 0; capacityIndex < CAPACITIES_TO_TEST.length; capacityIndex++) {
            //
            var tree = new B_Plus_Tree(CAPACITIES_TO_TEST[capacityIndex]);
            var usedKeys = [];
            try {
                // INSERT:
                for (var insertIndex = 0; insertIndex < INSERT_COUNT; insertIndex++) {
                    var keyToInsert = random(100);
                    usedKeys.push(keyToInsert);
                    tree.insert(keyToInsert, keyToInsert);
                    expect(checkTree(tree)).toEqual(usedKeys.length);
                }
                // UPDATE:
                for (var updateIndex = 0; updateIndex < UPDATE_COUNT; updateIndex++) {
                    var keyIndex = random(usedKeys.length);
                    var newKey = random(100);
                    var oldKey = usedKeys[keyIndex];
                    //if (updateIndex == 82) {
                    //    var treeText = treeToText(tree);
                    //}
                    usedKeys[keyIndex] = newKey;
                    if (!tree.remove(oldKey, oldKey)) {
                        //var treeText = treeToText(tree);
                        //tree.remove(oldKey, oldKey);
                    }
                    tree.insert(newKey, newKey);
                    expect(checkTree(tree)).toEqual(usedKeys.length);
                }
                // REMOVE:
                for (var removeIndex = 0; removeIndex < INSERT_COUNT; removeIndex++) {
                    var keyIndex = random(usedKeys.length);
                    var oldKey = usedKeys[keyIndex];
                    usedKeys.splice(keyIndex, 1);
                    if (!tree.remove(oldKey, oldKey)) {
                        //var treeText = treeToText(tree);
                        //tree.remove(oldKey, oldKey);
                    }
                    expect(checkTree(tree)).toEqual(usedKeys.length);
                }
            } catch (ex) {
                throw ex;
            }
        }
    });

    it("test find forward/backward", function () {
        var COPY_COUNT = 100;
        var KEY_COUNT = 10;
        var VALUE_COUNT = 3;
        //
        tree = new B_Plus_Tree();
        for (var copy = 0; copy < COPY_COUNT; copy++) {
            for (var key = 0; key < KEY_COUNT; key++) {
                for (var value = 0; value < VALUE_COUNT; value++) {
                    tree.insert(key, value);
                }
            }
        }
        //
        var checkKeyValueCount = function (key, value) {
            var count = 0;
            var findInfo = null;
            //
            findInfo = tree.findFirst(key, value);
            while (findInfo != null) {
                expect(findInfo.foundKey()).toEqual(key);
                expect(findInfo.foundValue()).toEqual(value);
                count++;
                findInfo = tree.findNext(findInfo);
            }
            expect(count).toEqual(COPY_COUNT);
            //
            count = 0;
            findInfo = tree.findFirst(key);
            while (findInfo != null) {
                expect(findInfo.foundKey()).toEqual(key);
                count++;
                findInfo = tree.findNext(findInfo);
            }
            expect(count).toEqual(COPY_COUNT * VALUE_COUNT);
            //
            count = 0;
            findInfo = tree.findLast(key, value);
            while (findInfo != null) {
                expect(findInfo.foundKey()).toEqual(key);
                expect(findInfo.foundValue()).toEqual(value);
                count++;
                findInfo = tree.findPrevious(findInfo);
            }
            expect(count).toEqual(COPY_COUNT);
            //
            count = 0;
            findInfo = tree.findLast(key);
            while (findInfo != null) {
                expect(findInfo.foundKey()).toEqual(key);
                count++;
                findInfo = tree.findPrevious(findInfo);
            }
            expect(count).toEqual(COPY_COUNT * VALUE_COUNT);
        };
        //
        for (var key = 0; key < KEY_COUNT; key++) {
            for (var value = 0; value < VALUE_COUNT; value++) {
                checkKeyValueCount(key, value);
            }
        }
        //

    });

    it("test find prefix", function () {
        tree = new B_Plus_Tree();
        //
        var COPY_COUNT = 10;
        var KEY_COUNT = 100;
        //
        tree = new B_Plus_Tree();
        for (var copy = 0; copy < COPY_COUNT; copy++) {
            for (var key = 0; key < KEY_COUNT; key++) {
                tree.insert(key.toString(), key.toString());
            }
        }
        //
        var arrKeys = [];
        findInfo = tree.findFirst();
        while (findInfo != null) {
            arrKeys.push(findInfo.foundKey());
            findInfo = tree.findNext(findInfo);
        }
        //
        var arrAreEqual = function (arr1, arr2) {
            if (arr1 == undefined) return false;
            if (arr2 == undefined) return false;
            if (arr1.length != arr2.length) return false;
            for (var i = 0; i < arr1.length; i++) {
                if (arr1[i] != arr2[i]) return false;
            }
            return true;
        };
        //
        var arrReverse = function (arr) {
            var result = [];
            for (var i = arr.length - 1; i >= 0; i--) {
                result.push(arr[i]);
            }
            return result;
        };
        //
        var checkFindPrefix = function (prefix) {
            var arrPrefixKeys = [];
            var prefixLength = prefix.length;
            for (var i = 0; i < arrKeys.length; i++) {
                if ((arrKeys[i].length >= prefixLength) && (arrKeys[i].substr(0, prefixLength) == prefix)) {
                    arrPrefixKeys.push(arrKeys[i]);
                }
            }
            //
            var arrFoundKeys = [];
            var findInfo = null;
            findInfo = tree.findFirstPrefix(prefix);
            while (findInfo != null) {
                arrFoundKeys.push(findInfo.foundKey());
                findInfo = tree.findNext(findInfo);
            }
            //
            expect(arrAreEqual(arrPrefixKeys, arrFoundKeys)).toEqual(true);
            //
            var arrPrefixKeysBackward = arrReverse(arrPrefixKeys);
            var arrFoundKeysBackward = [];
            var findInfo = null;
            findInfo = tree.findLastPrefix(prefix);
            while (findInfo != null) {
                arrFoundKeysBackward.push(findInfo.foundKey());
                findInfo = tree.findPrevious(findInfo);
            }
            //
            expect(arrAreEqual(arrPrefixKeysBackward, arrFoundKeysBackward)).toEqual(true);
        };
        //
        checkFindPrefix("");
        checkFindPrefix("0");
        checkFindPrefix("1");
        checkFindPrefix("2");
        checkFindPrefix("3");
        checkFindPrefix("4");
        checkFindPrefix("5");
        checkFindPrefix("6");
        checkFindPrefix("7");
        checkFindPrefix("8");
        checkFindPrefix("9");
    });

    it("test additional functions", function () {
        tree = new B_Plus_Tree();
        tree.insert("1", "v1");
        tree.insert("11", "v11");
        tree.insert("12", "v12");
        tree.insert("3", "v3");
        tree.insert("30", "v30.3");
        tree.insert("30", "v30.2");
        tree.insert("30", "v30.1");
        tree.insert("31", "v31.2");
        tree.insert("31", "v31.1");
        tree.insert("32", "v32");
        tree.insert("51", "v51");
        tree.insert("52", "v52");
        //
        expect(treeToString(tree)).toEqual("{{1:v1,11:v11,12:v12,3:v3,30:v30.1}30{30:v30.2,30:v30.3,31:v31.1,31:v31.2,32:v32,51:v51,52:v52}}");
        //
        var kvs = "";
        tree.each(function (key, value) {
            kvs += "(" + key + "," + value + ")";
        });
        expect(kvs).toEqual("(1,v1)(11,v11)(12,v12)(3,v3)(30,v30.1)(30,v30.2)(30,v30.3)(31,v31.1)(31,v31.2)(32,v32)(51,v51)(52,v52)");
        //
        expect(tree.keys()).toEqual(['1', '11', '12', '3', '30', '30', '30', '31', '31', '32', '51', '52']);
        expect(tree.keys_and_values()).toEqual([['1', 'v1'], ['11', 'v11'], ['12', 'v12'], ['3', 'v3'], ['30', 'v30.1'], ['30', 'v30.2'], ['30', 'v30.3'], ['31', 'v31.1'], ['31', 'v31.2'], ['32', 'v32'], ['51', 'v51'], ['52', 'v52']]);
        //
        expect(tree.get_by_prefix("0")).toEqual([]);
        expect(tree.get_by_prefix("1")).toEqual([["1", "v1"], ["11", "v11"], ["12", "v12"]]);
        expect(tree.get_by_prefix("2")).toEqual([]);
        expect(tree.get_by_prefix("3")).toEqual([["3", "v3"], ["30", "v30.1"], ["30", "v30.2"], ["30", "v30.3"], ["31", "v31.1"], ["31", "v31.2"], ["32", "v32"]]);
        expect(tree.get_by_prefix("4")).toEqual([]);
        expect(tree.get_by_prefix("5")).toEqual([["51", "v51"], ["52", "v52"]]);
        expect(tree.get_by_prefix("7")).toEqual([]);
        expect(tree.get_by_prefix("")).toEqual([['1', 'v1'], ['11', 'v11'], ['12', 'v12'], ['3', 'v3'], ['30', 'v30.1'], ['30', 'v30.2'], ['30', 'v30.3'], ['31', 'v31.1'], ['31', 'v31.2'], ['32', 'v32'], ['51', 'v51'], ['52', 'v52']]);
        //
        expect(tree.get_keys_by_prefix("0")).toEqual([]);
        expect(tree.get_keys_by_prefix("1")).toEqual(["1", "11", "12"]);
        expect(tree.get_keys_by_prefix("2")).toEqual([]);
        expect(tree.get_keys_by_prefix("3")).toEqual(["3", "30", "30", "30", "31", "31", "32"]);
        expect(tree.get_keys_by_prefix("4")).toEqual([]);
        expect(tree.get_keys_by_prefix("5")).toEqual(["51", "52"]);
        expect(tree.get_keys_by_prefix("7")).toEqual([]);
        expect(tree.get_keys_by_prefix("")).toEqual(['1', '11', '12', '3', '30', '30', '30', '31', '31', '32', '51', '52']);
        //
        expect(tree.get_values_by_key("")).toEqual([]);
        expect(tree.get_values_by_key("0")).toEqual([]);
        expect(tree.get_values_by_key("1")).toEqual(["v1"]);
        expect(tree.get_values_by_key("11")).toEqual(["v11"]);
        expect(tree.get_values_by_key("20")).toEqual([]);
        expect(tree.get_values_by_key("30")).toEqual(["v30.1", "v30.2", "v30.3"]);
        expect(tree.get_values_by_key("50")).toEqual([]);
        expect(tree.get_values_by_key("52")).toEqual(["v52"]);
        expect(tree.get_values_by_key("70")).toEqual([]);
    });

    it("test additional functions on empty tree", function () {
        tree = new B_Plus_Tree();
        //
        expect(treeToString(tree)).toEqual("{}");
        //
        var kvs = "";
        tree.each(function (key, value) {
            kvs += "(" + key + "," + value + ")";
        });
        expect(kvs).toEqual("");
        //
        expect(tree.keys()).toEqual([]);
        expect(tree.keys_and_values()).toEqual([]);
        //
        expect(tree.get_by_prefix("0")).toEqual([]);
        expect(tree.get_by_prefix("")).toEqual([]);
        //
        expect(tree.get_keys_by_prefix("0")).toEqual([]);
        expect(tree.get_keys_by_prefix("")).toEqual([]);
        //
        expect(tree.get_values_by_key("")).toEqual([]);
        expect(tree.get_values_by_key("0")).toEqual([]);
    });


});
