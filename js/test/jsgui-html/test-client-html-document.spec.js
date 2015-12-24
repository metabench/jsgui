
describe("jsgui-html/test-client-html-document.spec.js", function () {

    var jsgui;
    var assert;

    before(function () {
        jsgui = require('../../web/jsgui-html');
        assert = require('assert');
    });


    // The data enhancements are getting on for fairly large.
    //  But will definitely help the project scale.
    //  Likely to be integrating b+ trees at a very core level.


    //var stringify = jsgui.stringify, Collection = jsgui.Collection;
    //var each = jsgui.each;

    //var call_multi = jsgui.call_multi;

    describe("jsgui-html/test-client-html-document.spec.js", function () {

        it("!!! Client_HTML_Document", function () {

            var stringify = jsgui.stringify;

            // !!! throws error:
            assert.throws(function () { new jsgui.Client_HTML_Document({}); }, /stop, currently unsupported./); // !!!

            // !!! skipped:

            //var doc = new jsgui.Client_HTML_Document({});

            //assert.equal(stringify(doc), 'Control({"dom": Data_Object({"tagName": "html"}), "content": Collection(Control({"dom": Data_Object({"tagName": "head"}), "content": Collection(Control({"dom": Data_Object({"tagName": "title"})}))}), Control({"dom": Data_Object({"tagName": "body"})})), "head": Control({"dom": Data_Object({"tagName": "head"}), "content": Collection(Control({"dom": Data_Object({"tagName": "title"})}))}), "title": Control({"dom": Data_Object({"tagName": "title"})}), "body": Control({"dom": Data_Object({"tagName": "body"})})})');

            //doc.body().add('<p>Paragraph</p>')

            //var doc_html = doc.all_html_render();

            //assert.equal(doc_html, '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n<html><head><title></title></head><body><p>Paragraph</p></body></html>');

        });
    });



});