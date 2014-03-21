//require('nodetime').profile()

var requirejs = require('requirejs');


requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
	//paths: {
    //    "some": "some/v1.0"
    //},
    nodeRequire: require
});

requirejs(['./jsgui-server', 'express', './jsgui-sample-controls'],
function (jsgui, express, jsgui_sample_controls) {
	
	var j = jsgui;
	var Class = j.Class;
	var each = j.each;
	var is_array = j.is_array;
	var is_dom_node = j.is_dom_node;
	var is_ctrl = j.is_ctrl;
	var extend = j.extend;
	var x_clones = j.x_clones;
	var get_truth_map_from_arr = j.get_truth_map_from_arr;
	var get_map_from_arr = j.get_map_from_arr;
	var arr_like_to_arr = j.arr_like_to_arr;
	var tof = j.tof;
	var is_defined = j.is_defined;
	var stringify = j.stringify;
	var functional_polymorphism = j.functional_polymorphism;
	var fp = j.fp;
	var arrayify = j.arrayify;
	var mapify = j.mapify;
	var are_equal = j.are_equal;
	var get_item_sig = j.get_item_sig;
	var set_vals = j.set_vals;
	var truth = j.truth;
	var trim_sig_brackets = j.trim_sig_brackets;
	var ll_set = j.ll_set;
	var ll_get = j.ll_get;
	var is_constructor_fn = j.is_constructor_fn;
	var is_arr_of_arrs = j.is_arr_of_arrs;
	var is_arr_of_strs = j.is_arr_of_strs;
	var is_arr_of_t = j.is_arr_of_t;
	
	var app = express();
	var port = 5009;
	
	// that jsgui object will have what is needed to serve HTML.
	
	// May integrate this with Connect or routes... or may call on jsgui functionality from a connect or express route.
	
	// May still be simple to talk about serving files to paths... but will want to serve other objects / have them exposed on a path.
	
	// Want an html document control that is an empty document.
	
	// creation of empty html document...
	
	// let's start up the server.
	
	var server = new jsgui.Server.JSGUI_Server({});
	//  A server can be for an express routes sub-path.
	//  Can be for the whole site.
	
	// Need to configure the server.
	//  Tell the server what document to serve?
	//  Want it to be serving an html document pretty soon.
	
	// This test server would need to be told to make the document...
	//  It's the component to serve the document...
	
	
	// And we can have this running in an expressless way too.
	
	
	
	server.start(port, function() {
		console.log('jsgui server started');
		
		app.listen(port, function() {
			// say what IP address...
			//  give the external ipv4 address?
			
			
			
			console.log("Listening on " + port);
			
			// Perhaps later we could expose resources to be served - with the resource doing some of the path processing.
			//  A resource could serve an interface for interacting with it - complete HTML interface, or JSON API that a more general
			//  HTML or other interface can interact with.
			
			app.get('*', function(req, res, next) {
				// can get the full url out of the path.
				//  can get the difference from the url_path
				
				var url = req.url;
				console.log('url ' + url);
				
				//server.process_request(req, res);
				
				// jsgui.JSGUI_HTML_Document();
				//  has the correct references to jsgui client side code and CSS.
				//  will get the jsgui-html-client running on the client.
				
				// There are some functions which are not needed in the server version of the code.
				//  Some code to do with binding dom events perhaps.
				//   But those functions could work well on the client too - or there could be server side code executed on DOM events?
				//    probably not worth it - have more separation.
				
				
				// Or the page context has already been made automatically during the request?
				
				var spc = new jsgui.Server.Page_Context({
                     'request': req,
                     'response': res,
                     'rendering_mode': 'html5'
                 });
				
				//server.create_page_context?
				
				console.log('pre create new jsgui.Client_HTML_Document()');
				
				// Give the document the context.
				//  Need a new page context I think. Page_Context
				//  Maybe a page_request_context.
				
				
				
				
				
				
				var doc = new jsgui.Client_HTML_Document({'context': spc});
				console.log('post create new jsgui.Client_HTML_Document()');
				// There will need to be HTML documents with things already set up for JSGUI.
				//  I think that would include a script block that initializes JavaScript functionality.
				//   Dynamically written JavaScript is the way to go here, but it can effectively be JSON.
				//    Stringify could produce code that gets initialized.
				
				// Effectively providing all the info that goes in init for every control.
				//  Or every control that has extra information.
				
				// So that could be info about the flags (but its likely to get some flags through css classes).
				//  The control will find out about the content of itself.
				//   And it will parse data from HTML where needed. Complete records can be given through the HTML, with extra data given through JSON.
				//    Most programming work, but it will be most efficient on the client.
				//     Another good option is to have all the rendering done on the client.
				
				
				
				
				
				
				
				
				
				
				//doc.get('body').
				console.log('pre show body content');
				
				console.log('doc.body().content() ' + doc.body().content());
				console.log('post show body content, pre change body content');
				
				//doc.body().content().add('Hello World');
				
				// Use a Basic_Page control.
				//  Header, content, menu.
				//  Could add another section relatively easily.
				
				
				// Need to put the content in there as JSON of sorts, it will have items like
				//  'article' and 'content_piece', maybe just called 'content'.
				// Gets rendered to HTML using relatively simple rules.
				//  Data could be extracted from the DB.
				
				// The content needs to be a Control.
				//  Could make it so that when it finds strings, it creates <p> controls?
				
				// Want a constructor system from the context...
				//  Maybe even extending objects in a context...
				
				// or a context is a function so we can do context(jsgui.p)?
				
				// have a contextualize function?
				
				
				
				
				
				var basic_page = new jsgui_sample_controls.Basic_Page({
				    'title': 'Example Basic Page',
				    //'content': [new jsgui.p('James says hello')],
				    //'content': [new jsgui.p({'content': ['James says hello'], 'context': spc})],
				    'context': spc
				});
				
				// Content should be initialized when setting something.
				//  If the content is a string, it could be escaped???
				//  textNode?
				
				//basic_page.content().add(new jsgui.p({'content': ['James says hello'], 'context': spc}));
				
				// Try this with creating a TextNode?
				//  Some of that should be automatic.
				
				//basic_page.content().add(new jsgui.p({'content': ['James says hello'], 'context': spc}));
				
				// Basic page could have various fields.
				//  These fields would interact with the content.
				
				
				var tn_jsh = new jsgui.textNode({'text': 'James says hello', 'context': spc});
				
				//basic_page.content().add(new jsgui.p({'content': [tn_jsh], 'context': spc}));
				var new_p = new jsgui.p({'context': spc});
				new_p.content().add(tn_jsh);
				
				//basic_page.content().add(new_p);
				
				console.log('');
				console.log('');
				console.log('Pre set basic page content');
				
				// Basic page could have an inner_content.
				//  However, changing the various fields could add content to various places.
				// inner_content
				
				//basic_page.content(new_p);
				basic_page.inner_content(new_p);
				
				// and set the header content.
				
				
				
				// Should call set content function
				
				
				
				// Want to be able to set content in initialization.
				//  Maybe that should happen automatically because it is a field.
				
				// Perhaps a set content method should be used, .content(value).
				//  Not having to add it to the content.
				
				//basic_page.set('content', 
				// doc.set(basic_page) would do, it puts it into the body and maybe sets the title.
				//  basic_page will be a Control.
				
				
				doc.body().content().add(basic_page);
				
				
				
				server.serve_document(req, res, doc);
				
				// all urls go to the jsgui server...
				//  but that server needs a document or something in order to do anything.
				
				// Could we just use express to do the serving?
				//  We need to specify the document somewhere?
				//  Don't need a full app for the server...
				
				
				
			});
			
		});
		
		
		
		
		
	});
	
	// and first have express / connect listening to requests and giving them to the server?
	//  that would play well with other projects.
	
	
	
	
	
	
	
	
	
	
});