
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../core/data-object', 'assert'],
function (Data_Object, assert) {

    describe("z_core/data-object /Mini_Context.spec.js ", function () {

        // -----------------------------------------------------
        //	Mini_Context
        // -----------------------------------------------------

        // =========================================
        //                  the test:
        // =========================================

        it("new_id() should throw", function () {
            //
            var mini_context = new Data_Object.Mini_Context();
            //
            //mini_context.new_id();
            //
            assert.throws(function () { mini_context.new_id(); }, function (err) { return err === "stop Mini_Context typed id"; });
        });

        it("make() should not works", function () {
            //
            var mini_context = new Data_Object.Mini_Context();
            //
            assert.throws(function () { mini_context.make({}); }, function (err) { return err === "Object must be abstract, having ._abstract == true"; });
            //
            var data_object = new Data_Object({ abstract: true });
            //
            //mini_context.make(data_object);
            //
            assert.throws(function () { mini_context.make(data_object); }, function (err) { return err === "stop Mini_Context typed id"; });
        });


    });


});


