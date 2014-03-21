// can see if define is defined or not.

// The data enhancements are getting on for fairly large.
//  But will definitely help the project scale.
//  Likely to be integrating b+ trees at a very core level.

// Tests going well... quite a bit more advanced functionality going into and working in Collection and Data_Object.
//  Iterating through collections in different orders.
//  Iterating through them by their array order,
//   or the order of an index.

// collection.iterate(index)?
// each?

// Specifying the index to iterate using?

// collection.each('index_name')?
// collection.each(index);
// collection.each(['name'])?

// Also, collection could provide access to its indexes.
//  Each index could have a name.
//  Each index is actually an object, so we may be able to get reference to that and use it, maybe as well as named ids.




// Could have this so it only does it when running in Node.

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

requirejs(['./jsgui-html'],
function (jsgui) {
    
	var j = jsgui;
	
	var stringify = jsgui.stringify, Collection = jsgui.Collection, Data_Object = jsgui.Data_Object;
	var mapify = jsgui.mapify, is_defined = jsgui.is_defined, extend = jsgui.extend;
	var each = jsgui.each, tof = jsgui.tof;
	var iterate_ancestor_classes = j.iterate_ancestor_classes;
	var fp = jsgui.fp;
	//var Sorted_KVS = Data_Structures.Sorted_KVS;
	var Control = jsgui.Control;
	
	// Will make something using HTML that is interacting with the DOM nodes.
	//  Could go ahead and make the File_Tree control.
	//  It would contain other controls, and render to HTML, then activate it.
	
	// It's a good way of getting going using this.
	//  Will take some more effort to get these controls rendering, but it's somewhere that things could be built and would definitely look nice.
	//  Could make use of some CSS3 gradients, and have the controls potentially handle things for when those are not supported by the browser.
	
	
	var test_control = function() {
		// want to define it as having sub-controls?
		//  some properties that can be changed, and change the appearance of sub-controls?
		// Have a bit of content inside it, something saying 'Hello World'.
		// Content is a collection of renderable items.
		// Make it so that when there are fields, they can be given new default values with extend?
		/*
		var Simple_Control = Control.extend({
			//'fields': {
			//	
			//}
			
			// is this setting the default values of the fields?
			'css_class': 'simple_control',
			'tag_name': 'span'
		});
		// then get it as html.
		*/
		//var ctrl1 = new Simple_Control();
		
		// css_class needs to be in the fields.
		var ctrl1 = new Control({
			//'css_class': 'simple_control',
			//'tag_name': 'span'
		});
		
		var ctrl_fields = ctrl1.fields();
		console.log('ctrl_fields ' + stringify(ctrl_fields));
		console.log('ctrl1 ' + stringify(ctrl1));
		
		var dom = ctrl1.get('dom');
		//console.log('dom ' + stringify(dom));
		
		//var dom_fields = dom.fields();
		//console.log('dom_fields ' + stringify(dom_fields));
		// easy enough to understand right now, seems a little verbose, but there could be some more data_type info in there apart from just its string name.
		// dom.style?
		// dom['class']?
		//  dom attributes class - this could be a special case, where the rendered answer is the output of the ordered string list (collection?).
		
		// Still do need a convenient way of setting the CSS classes.
		
		dom.set('tagName', 'span');
		// but setting the element's style 
		
		var dom_attributes = dom.get('attributes');
		console.log('dom_attributes ' + stringify(dom_attributes));
		
		var da_class = dom_attributes.get('class');
		da_class.set('simple_control');
		
		//dom_attributes.set('class', 'simple_control');
		
		// and the dom's css classes...
		console.log('ctrl1 ' + stringify(ctrl1));
		
		var html = ctrl1.all_html_render();
		console.log('');
		console.log('ctrl1 html.length ' + stringify(html.length));
		console.log('ctrl1 html ' + stringify(html));
		
		// probably should not have any content yet.
		
		// I would like to use this to render a whole document.
		//  Perhaps render some dynamic pieces of HTML.
		// The .jsui extension would be very 
		
		// And it needs to handle CSS classes as well.
		
		// Want to deal with the multi-level set.
		
	}
	//test_control();
	
	var test_control_nested_set = function() {
		var ctrl1 = new Control({});
		
		ctrl1.set('dom.attributes.class', 'simple_control');
		ctrl1.set('dom.tagName', 'span');
		
		var html = ctrl1.all_html_render();
		console.log('');
		console.log('ctrl1 html.length ' + stringify(html.length));
		console.log('ctrl1 html ' + stringify(html));
		
	}
	//test_control_nested_set();
	
	var test_control_nested_set_2 = function() {
		var ctrl1 = new Control({});
		
		//ctrl1.set('dom.attributes.class', 'simple_control');
		//ctrl1.set('dom.tagName', 'span');
		
		// not setting the tagName right yet.
		
		ctrl1.set({
			'dom': {
				'tagName': 'span',
				'attributes': {
					'class': 'simple_control'
				}
			}
		});
		
		// isn't content a collection?
		var content = ctrl1.get('content');
		console.log('tof(content) ' + tof(content));
		content.add('Hello World');
		
		console.log('ctrl1 ' + stringify(ctrl1));
		
		var html = ctrl1.all_html_render();
		console.log('');
		console.log('ctrl1 html.length ' + stringify(html.length));
		console.log('ctrl1 html ' + stringify(html));
		
	}
	//test_control_nested_set_2();
	
	var test_control_css_flags = function() {
		var ctrl1 = new Control({});
		console.log('ctrl1 ' + stringify(ctrl1));
		
		var fields = ctrl1.fields();
		console.log('fields ' + stringify(fields));
		
		// flags should now be a field.
		
		
		//var flags = ctrl1.get('flags');
		//console.log('flags ' + stringify(flags));
		
		
		//
		
		var flags = ctrl1.get('flags');
		console.log('flags ' + stringify(flags));
		// the flag's parent?
		
		
		var css_flags = ctrl1.get('css_flags');
		console.log('css_flags ' + stringify(css_flags));
		
		ctrl1.add_css_flag('selected');
		
		flags = ctrl1.get('flags');
		console.log('flags ' + stringify(flags));
		
		
		// Need to make sure the events for item removal are working now.
		//  When an item gets removed, the parent does the removal.
		//   The parent then raises an event on itself.
		
		
		ctrl1.remove_css_flag('selected');
		//ctrl1.remove_flag('selected');
		
		flags = ctrl1.get('flags');
		console.log('flags ' + stringify(flags));
		
		// then when it is rendered as HTML, it needs to show these.
		//  need to have it able to add and remove css classes.
		//  done simply, only interacting with the DOM representation layer.
		
		
		
		
		
		//var css_flags_par = css_flags.parent();
		//console.log('css_flags_par ' + stringify(css_flags_par));
		
		// so, when fields are made, they need to be made as a child of the Data_Object (or subclass).
		
		
		// when a flag changes, the control should be able to pick it up.
		// can have a change event listener for the control.
		
		
		
		
		
		// but the normal flag should operate too.
		//  also bubbling...
		
		
		//var css_flags = ctrl1.get('css_flags');
		//console.log('css_flags ' + stringify(css_flags));
		
		/*
		ctrl1.add_css_flag('selected');
		ctrl1.add_css_flag('highlighted');
		
		ctrl1.add_flag('premium');
		
		
		
		
		var flags = ctrl1.get('flags');
		console.log('flags ' + stringify(flags));
		*/
		
	}
	//test_control_css_flags();
	// and have it contain some content.
	
	
	var test_control_css_class = function() {
	
	
		var ctrl1 = new Control({});
		
		console.log('ctrl1 ' + stringify(ctrl1));
		
		var dom = ctrl1.get('dom');
		console.log('dom ' + stringify(dom));
		
		var attrs = dom.get('attributes');
		console.log('attributes ' + stringify(attrs));
		
		var cls = attrs.get('class');
		console.log('cls ' + stringify(cls));
		
		// Want to get more reflection information about the class.
		//  It should be an ordered string list that computes to a string.
		//  May have both input and output processors for this.
		
		// Want to be able to view the class name, and perhaps programming information related to that class.
		//  Not really sure what type of object this is... 
		
		
		//console.log('typeof cls ' + typeof cls);
		//console.log('tof(cls) ' + tof(cls));
		
		cls.put('Jamaica');
		//cls.add('Mexico');
		//cls.add('Brazil');
		
		console.log('cls ' + stringify(cls));
		
		// I think the Ordered_String_List may be better as some lower-level code.
		//  It is quite precise and compact, and uses the 'put' keyword.
		
		// At the moment, it may be worth changing the css classes to be a collection (ordered string collection).
		//  They do not need to be sorted in a particular order, but having them indexed in order automatically could be 
		//  useful for comparison.
		
		// In that case, could define the data type as 'Collection(Unique(String))' but that would be a bit strange.
		//  Could have that syntax in code. A Unique abstract function that is there basically to indicate that something is wrapped
		//  in uniqueness, and is a fairly fast syntax to write, and can be used to wrap these existing Collection(String) formulations.
		
		// However, we may want a Collection('unique string');
		//  Easy syntax for defining a collection of unique strings will be useful - also the error mode, so it can
		//   ignore attempts to add another. Easy to program that using has(x) at least.
		
		// Then it should be rendered properly with that class.
		
		// Would like to get a few more xomplex examples set up.
		//  Something that sends data back to the server would be good - maybe using socket io.
		//  Sending and recieving. I think having callbacks between client and server will be useful in many places - but would need to be used
		//  carefully regarding having the correct application state.
		// A game / relay server would be very useful.
		
		var dom = ctrl1.get('dom');
		console.log('dom ' + stringify(dom));
		//throw 'stop';
		// This seems to cause an infinite loop.
		//  Maybe that has to do with updates...
		
		// this should work!!!
		//dom.set('tagName', 'div');
		
		var tagName = dom.get('tagName');
		
		console.log('tagName ' + stringify(tagName));
		
		var html = ctrl1.all_html_render();
		console.log('html ' + html);
		
		
	}
	//test_control_css_class();
	
	
	var test_control_css_class_2 = function() {
		var ctrl1 = new Control({});
		var cls = ctrl1.get('dom.attributes.class');
		cls.put('Jamaica');
		cls.put('Mexico');
		cls.put('Brazil');
		cls.out('Jamaica');
		
		console.log('cls ' + stringify(cls));
		// I think the Ordered_String_List may be better as some lower-level code.
		//  It is quite precise and compact, and uses the 'put' keyword.
		
		// At the moment, it may be worth changing the css classes to be a collection (ordered string collection).
		//  They do not need to be sorted in a particular order, but having them indexed in order automatically could be 
		//  useful for comparison.
		
		// In that case, could define the data type as 'Collection(Unique(String))' but that would be a bit strange.
		//  Could have that syntax in code. A Unique abstract function that is there basically to indicate that something is wrapped
		//  in uniqueness, and is a fairly fast syntax to write, and can be used to wrap these existing Collection(String) formulations.
		
		// However, we may want a Collection('unique string');
		//  Easy syntax for defining a collection of unique strings will be useful - also the error mode, so it can
		//   ignore attempts to add another. Easy to program that using has(x) at least.
		
		// Then it should be rendered properly with that class.
		
		// Would like to get a few more xomplex examples set up.
		//  Something that sends data back to the server would be good - maybe using socket io.
		//  Sending and recieving. I think having callbacks between client and server will be useful in many places - but would need to be used
		//  carefully regarding having the correct application state.
		// A game / relay server would be very useful.
		
		var tagName = ctrl1.get('dom.tagName');
		
		console.log('tagName ' + stringify(tagName));
		
		var html = ctrl1.all_html_render();
		console.log('html ' + html);
	}
	test_control_css_class_2();
	
	
	// want to have little demos... things with client side code so that something can be clicked on, a message reaches the server etc.
	//  however, there is more framework code that may be worth doing first.
	
	// Vector images will be very useful... but could have a split client for IE<9 and browsers that support SVG.
	//  Will be useful for arrows etc.
	
	// Would very much like a vector image studio application.
	
	// I think making a selectable control would be very good.
	//  Selectable with the user interface.
	//  The selectable control will get activated on the client.
	//  Some JSON will also be sent to the client with various properties for the control.
	
	
	
	
	
	
	
	
	
	// Another test... testing the ability to add and remove css classes.
	//  Will be able to do this through css-linked flags as well.
	
	// Let's have these working for a few samples fairly soon.
	
	// Want to incrementally build quite a few examples - not all set to impress, but examples of code use.
	//  Would fit in with a documentation section as well. Nice to have a website for this, and using controls to serve
	//   documentation about controls. Some menu interfaces will be useful, as will making a few controls.
	
	// A few things, including a datagrid, buttons of various sorts,
	//  a properties editor, a calendar, a color picker, a bank card number input,
	
	// The calendar would certainly be useful, and would take a bit of work on various APIs.
	//  Would want code that generally worked in the browser and in node.js.
	
	// Multi-language content editor.
	
	// Editing a JSON object with a schema
	//  GUI customizations for such an editor.
	
	// Making some controls... and getting the core layer more tested through its use and
	//  through specific unit testing.
	
	// Documenting the core layer and the controls.
	//  Using controls to display documentation.
	
	// This system will get a more polished core, and more that is external to the core.
	//  I think the basic component suite will be a very useful thing to have made.
	// A textbox would be a useful one.
	// And a text box with validation indicator?
	//  Or validation indicators that can easily get applied to textboxes?
	
	// Could make it so that the textbox has that extra item.
	//  But then maybe a textbox should just be a textbox.
	
	// Validating_Textbox
	
	
	// Basic html controls?
	
	
	// There will be more basic form controls.
	// I'll prefer the ones that have got full progressive enhancement.
	
	// There is quite a lot still to put in place.
	//  Want it so that various things get specified in jsgui and they work smoothly rendered to the dom.
	
	// Various things will work best when integrated on the client and the server, such as 
	//  a file manager.
	
	// Should make various demos and documentation samples.
	//  Also would like a nice way of organizing them.
	//  There could be quite a lot?
	
	// Beyond the most basic controls (which will be standard HTML controls) there could be
	//  quite a bit of variety in how things get done.
	
	// Some controls will be very much reskinned from the basic elements.
	//  These would be rendered on both the client and the server.
	
	// selectable items will be very useful.
	//  UIs to edit files of various types will be useful.
	
	
	
	
	
	
	// Also want means to make various application interfaces, perhaps a Kettle Chips admin
	//  interface where components can be changed, and it rebuilds the site.
	// Making the site dynamic as well...
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//  An image gallery
	//  A contacts browser (integrated with calendar)
	
	// A documentation browser. A documentation editing system.
	//  Quite a few things to do, but needs more work on the core.
	
	// Simpler examples:
	//  Sign up to newsletter (will need some validation, gui events in response to validation results).
	//   Want something that takes a very small amount of code to have instances working efficiently.
	//   Server side generation of original view, activation and further rendering on the client side.
	
	// 
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// Would also need to be setting the size at some point...
	
});
	
