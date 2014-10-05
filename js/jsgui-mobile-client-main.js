// Require rather than define... perhaps we call this one 'main'.

require(["jsgui-mobile-client"], function(jsgui) {
    //This function is called when scripts/helper/util.js is loaded.
	
	//alert('jsgui-lang has loaded');
	//alert('mobile client jsgui ' + jsgui);
	//alert(jsgui.get_inline_css_dict_from_style);
	
	// Will require other code as well.
	
	// So, this is working so far.
	
	
	
	var stringify = jsgui.stringify;
	
	var ctrl1 = new jsgui.Control({});
	//ctrl1.set('style.border', '1px solid #000000');
	
	//console.log('ctrl1._ ' + stringify(ctrl1._));
	
	
	//var got_border = ctrl1.get('style.border');
	//var out_border = ctrl1.out('style.border');
	
	//console.log('got_border ' + stringify(got_border));
	//console.log('out_border ' + stringify(out_border));
	console.log('pre get id 1');
	var id = ctrl1.get('id');
	console.log('id ' + id);
	
	// Nice... functionality is encapsulated in html and lang.
	
	console.log('ctrl1._ ' + stringify(ctrl1._));
	
	// Also want the control to hold a collection of controls.
	
	// It will be a type of data object, like others, could be created by the generator.
	
	//var ctrl_ctrls = ctrl1.get('controls');
	//console.log('ctrl_ctrls ' + stringify(ctrl_ctrls));
	//console.log();
	//console.log('ctrl1._ ' + stringify(ctrl1._));
	
	//var ctrl1_idx = ctrl1.get('index');
	//console.log('ctrl1_idx ' + stringify(ctrl1_idx));
	
	//ctrl1.index(12);
	var ctrl1_idx = ctrl1.get('index');
	console.log('*** ctrl1_idx ' + stringify(ctrl1_idx));
	
	
	// OK, so controls maybe will work in the collection now.
	
	var ctrl2 = new jsgui.Control({});
	//console.log('pre get id 2');
	
	
	var id2 = ctrl2.get('id');
	console.log('id2 ' + id2);
	
	
	//ctrl_ctrls.add(ctrl2);
	
	//ctrl_ctrls.hello = 'world';
	
	//console.log('ctrl1._ ' + stringify(ctrl1._));
	//  stringifying these controls won't work now.
	//  they have circular references. Need to change this so that control references are done by id (when stringifying).?????
	
	
	//var ctrl2_idx = ctrl2.get('index');
	//
	//console.log('ctrl2_idx ' + stringify(ctrl2_idx));
	console.log('jsgui.is_ctrl(ctrl2) ' + jsgui.is_ctrl(ctrl2));
	
	//console.log('ctrl_ctrls.length ' + ctrl_ctrls.length);
	
	// so far, so good, mostly.
	console.log('ctrl1 ' + stringify(ctrl1));
	console.log('ctrl2 ' + stringify(ctrl2));
	
	ctrl1.add_control(ctrl2);
	
	console.log('ctrl1._ ' + stringify(ctrl1._));
	console.log('ctrl2._ ' + stringify(ctrl2._));
	
	// Seems to be working somewhat.
	
	// Maybe should not have these problems with stringifying controls?
	//  But it's no longer identifying them as controls, I guess.
	
	
	
	// now dealing with css classes.
	
	
	
	var css_ctrl1 = ctrl1.get('dom.attributes.class');
	console.log('css_ctrl1 ' + stringify(css_ctrl1));
	
	css_ctrl1.put('hello');
	console.log('ctrl1._ ' + stringify(ctrl1._));
	// could request info about the dom from the controls.
	// could try setting it.
	console.log('css_ctrl1 ' + css_ctrl1);
	
	// Classes seem to be working too now.
	
	
	
	var html_ctrl1 = ctrl1.all_html_render();
	console.log('html_ctrl1 ' + stringify(html_ctrl1));
	//ctrl1.tagName('div');
	
	css_ctrl1.toggle('goodbye');
	css_ctrl1.toggle('hello');
	
	//var tn1 = ctrl1.tagName();
	//console.log('tn1 ' + tn1);
	var html_ctrl1 = ctrl1.all_html_render();
	console.log('html_ctrl1 ' + stringify(html_ctrl1));
	
	//var ctrl1_border = ctrl1.get('style.border');
	// they style object... perhaps it should be assumed to exist.
	// may want to set the border to some value.
	
	//console.log('ctrl1_border ' + stringify(ctrl1_border));
	
	//ctrl1.set('style.border', '1px solid #CCCCCC');
	//console.log('********** ctrl1._ ' + stringify(ctrl1._));
	
	// OK, still needs some work.
	
	// Setting the margin-right not working when margin is already set.
	
	ctrl1.set('style.margin', '-0.44');
	//ctrl1.set('style.margin.right', '12px');
	
	// Nice... looks like this is working now.
	
	var ctrl1_margin = ctrl1.get('style.margin');
	console.log('ctrl1_margin ' + stringify(ctrl1_margin));
	
	var html_ctrl1 = ctrl1.all_html_render();
	console.log('html_ctrl1 ' + stringify(html_ctrl1));
	//console.log('ctrl1._ ' + stringify(ctrl1._));
	
	// Need to test this making and keeping a reference with a dom node too.
	
	// I think delegated events will use the 'jsgui' id expando.
	//  Rendering controls... and then activating them.
	//  It seems like that needs to be done on the client (but not the server).
	//  It's adding up though.
	// Re-joining the references - once the controls have been made, need to get references to the DOM nodes (again).
	
	
	
	
	
	
	
});