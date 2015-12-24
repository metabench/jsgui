
if (typeof define !== 'function') { var define = require('amdefine')(module) }

// can see if define is defined or not.

// The data enhancements are getting on for fairly large.
//  But will definitely help the project scale.
//  Likely to be integrating b+ trees at a very core level.
   
define(['../../web/jsgui-html', '../../web/controls/advanced/file-manager', 'assert'],
function (jsgui, Module_File_Manager, assert) {

    var stringify = jsgui.stringify, Collection = jsgui.Collection;
    var each = jsgui.each, tof = jsgui.tof;

    var call_multi = jsgui.call_multi;
    var File_Manager = Module_File_Manager.File_Manager;

    describe("jsgui-html/test-control.spec.js", function () {

        it("test_div", function () {
            var div = new jsgui.div({});

            // Need to be able to change / test a few properties.
            //  It's likely to entail cleaning up the main jsgui codebase a bit more.

            //assert.equal(stringify(div), 'Control({"dom": Data_Object({"tagName": "div"})})');
            assert.equal(stringify(div), 'Control({"dom": Data_Object({"tagName": "div"}), "content": Collection(), "size": undefined})');

            //div.set('content', 'hello');
            //div.content('hello');
            div.content().add('hello');

            var div_html = div.all_html_render();

            assert.equal(div_html, '<div>hello</div>');

        });


        // Testing the construction of various pieces of HTML, with different settings.

        it("test_script", function () {
            //console.log('');
            //console.log('pre create script');
            var script = new jsgui.script({});
            // <script data-main="scripts/main" src="scripts/require.js"></script>
            //console.log('');
            //console.log('pre get dom');
            var dom = script.get('dom');

            //console.log('dom ' + stringify(dom));
            //console.log('dom.fields() ' + stringify(dom.fields()));

            var domAttributes = dom.get('attributes');

            assert.equal(stringify(domAttributes), 'Data_Object({})');

            domAttributes.set('type', 'text/javascript');
            domAttributes.set('src', 'js/require.js');
            //domAttributes.set('data-main', js_file_require_data_main);

            assert.equal(stringify(domAttributes), 'Data_Object({"type": "text/javascript", "src": "js/require.js"})');

            /*
            console.log('tof dom ' + tof(dom));
    
            //var domAttributes = script.get('dom.attributes');
            //
            //
    
            //
            console.log('dom.fields ' + stringify(dom.fields));
            console.log('dom._fields ' + stringify(dom._fields));
            */
            // This should be setting up the fields properly.
            //  It was doing so before, but it looks like the code to do with setting up these fields needs to be
            //   fixed / updated, when getting them from a nested object.

            //domAttributes.set('type', 'text/javascript');
            //domAttributes.set('src', 'js/require.js');
            //domAttributes.set('data-main', js_file_require_data_main);

        });



        // The file admin control was having difficulty rendering.
        //  But that could possibly be its own section?

        // Need to test some things with a few sub-controls.

        // Now that Resources are operational, I will do more work on the rendering of HTML.

        it("!!! test_file_manager", function () {

            // !!! throws error:
            assert.throws(function () { new File_Manager({}); }, /stop, currently unsupported./); // !!!

            // !!! skipped:
            //var fm = new File_Manager({});
            //var html = fm.all_html_render();
            //assert.equal(html, '<div><div class="tree"><div class="menu bar control"></div><div class="main"></div></div></div>');	
        });


    });

});
	
