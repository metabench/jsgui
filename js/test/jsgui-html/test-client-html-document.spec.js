
if (typeof define !== 'function') { var define = require('amdefine')(module) }
// can see if define is defined or not.

// The data enhancements are getting on for fairly large.
//  But will definitely help the project scale.
//  Likely to be integrating b+ trees at a very core level.

define(['../../web/jsgui-html', 'assert'],
function (jsgui, assert) {
	
	var stringify = jsgui.stringify, Collection = jsgui.Collection;
	var each = jsgui.each;
	
	var call_multi = jsgui.call_multi;
	
	describe("jsgui-html/test-client-html-document.spec.js", function() {
	  it("contains spec with an expectation", function() {
	
	    var doc = new jsgui.Client_HTML_Document({});

        assert.equal(stringify(doc), 'Control({"dom": Data_Object({"tagName": "html"}), "content": Collection(Control({"dom": Data_Object({"tagName": "head"}), "content": Collection(Control({"dom": Data_Object({"tagName": "title"})}))}), Control({"dom": Data_Object({"tagName": "body"})})), "head": Control({"dom": Data_Object({"tagName": "head"}), "content": Collection(Control({"dom": Data_Object({"tagName": "title"})}))}), "title": Control({"dom": Data_Object({"tagName": "title"})}), "body": Control({"dom": Data_Object({"tagName": "body"})})})');	
	        
	    doc.body().add('<p>Paragraph</p>')	    
	    
	    var doc_html = doc.all_html_render();
	    
        assert.equal(doc_html, '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n<html><head><title></title></head><body><p>Paragraph</p></body></html>');	
	    
	    
	  });
	});	
	
	
});
	
