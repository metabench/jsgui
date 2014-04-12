

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/jsgui-data-structures', 'assert', '../../test-utils/test-utils'],
function (Data_Structures, assert, test_utils) {

    describe("core/data-structures/Ordered_String_List.spec.js", function () {

        it("should perform the class operations", function () {

            var sl = new Data_Structures.Ordered_String_List();
            assert.deepEqual(sl.toString(), "");

            sl = new Data_Structures.Ordered_String_List("v5 v4 v3");
            assert.deepEqual(sl.toString(), "v5 v4 v3");

            assert.deepEqual(sl.has("v5"), true);
            assert.deepEqual(sl.has("v9"), false);

            sl.put("v4");
            assert.deepEqual(sl.toString(), "v5 v4 v3");

            sl.put("v9");
            assert.deepEqual(sl.toString(), "v5 v4 v3 v9");
            sl.put("v1");
            assert.deepEqual(sl.toString(), "v5 v4 v3 v9 v1");

            sl.out("v5");
            assert.deepEqual(sl.toString(), "v4 v3 v9 v1");
            sl.out("v1");
            assert.deepEqual(sl.toString(), "v4 v3 v9");
            sl.out("v3");
            assert.deepEqual(sl.toString(), "v4 v9");
            sl.out("v3");
            assert.deepEqual(sl.toString(), "v4 v9");

            sl.toggle("v4");
            assert.deepEqual(sl.toString(), "v9");
            sl.toggle("v4");
            assert.deepEqual(sl.toString(), "v9 v4");

            sl.set("");
            assert.deepEqual(sl.toString(), "");
            sl.set("v0 v1 v2 v3 v4 v5");
            assert.deepEqual(sl.toString(), "v0 v1 v2 v3 v4 v5");

            sl.move_value("v0", 0);
            assert.deepEqual(sl.toString(), "v0 v1 v2 v3 v4 v5");
            sl.move_value("v0", 1);
            assert.deepEqual(sl.toString(), "v1 v0 v2 v3 v4 v5");
            sl.move_value("v0", 5);
            assert.deepEqual(sl.toString(), "v1 v2 v3 v4 v5 v0");
            sl.move_value("v0", 2);
            assert.deepEqual(sl.toString(), "v1 v2 v0 v3 v4 v5");
            sl.move_value("v0", 0);
            assert.deepEqual(sl.toString(), "v0 v1 v2 v3 v4 v5");

            sl.move_value("v2", 1);
            assert.deepEqual(sl.toString(), "v0 v2 v1 v3 v4 v5");
            sl.move_value("v2", 2);
            assert.deepEqual(sl.toString(), "v0 v1 v2 v3 v4 v5");
            sl.move_value("v2", 3);
            assert.deepEqual(sl.toString(), "v0 v1 v3 v2 v4 v5");


        });



    });

});


