

// Also want to make an MDI window system (Multiple Document Interface)

var jsgui = require('../../jsgui-html');
var Horizontal_Menu = require('./horizontal-menu');


var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
var Control = jsgui.Control;

var group = jsgui.group;

// Extensions of inner frames within inner frames...
//  The relative frame container, which has an inner frame. Then if something extends that, it would be good for that
//  to have an inner_control of its own and seamlessly expose that one while using the one above that.

// Relate the inner_control more to that level of the control heirachy.
//	Then make it so that they are navigable in sequence.
//  Not for the moment though.
//  I'll just have the Window control contain a relative div.


//var Relative_Frame = Control.

var Window = Control.extend({



	// could have a title field.
	'fields': {
		'title': String
	},


	// maybe add before make would be better. add will probably be used more.
	'init': function(spec, add, make) {
		this._super(spec);

		this.__type_name = 'window';

		this.set('dom.attributes.class', 'window');
		console.log('spec.el', spec.el);

		// Window should have a relative frame inside it.
		//  However, a relative frame control could be useful.
		//  It's a control with a relative inner control inside.
		//  Would help with positioning absolutely positioned items within another absolutely positioned div / control.








		if (!spec.abstract && !spec.el) {
			// the bar at the top.

			// It's going to act as a drag handle for this.
			//  The drag system will integrate with various bands / window positions.

			// Maybe a property to say that it's dockable.
			

			//var top_bar = new Control({
			//	'context': this._context
			//})
			//top_bar.set('dom.attributes.class', 'title bar');


			//this.add(top_bar);

			var div_relative = add(Control({'class': 'relative'}))

			var title_bar = div_relative.add(make(Control({'class': 'title bar'})));


			var dv_title = this.get('title');

			var title_h2 = make(jsgui.h2());
			
			title_bar.add(title_h2);

			if (dv_title) {
				var title = dv_title.value();
				title_h2.add(title);
			}

			
			console.log('title', title);

			

			// Define this as having inner_content.

			// I think that would also be a control field that gets activated as such.
			// .add needs to work with inner_content.
			// .add also needs to work with abstract controls. It should make them into an instance in the right context and add them, then
			//  return them.


			var inner_control = div_relative.add(make(Control({'class': 'inner'})));
			console.log('this._id() ' + this._id());
			console.log('inner_control._id() ' + inner_control._id());
			this.set('inner_control', inner_control);




			// May want some code to set this up as a dockable dialog window.
			//  Dockable window?

			// Quite a lot of functionality for this should be applicable to general controls.

			// Not get the bhaviours set up as an abstraction yet.
			//  However, a few functions that set things up seems useful.

			// Perhaps put things in the enhanced html section?
			// in activate... 
			//  but need to get the top bar reference back.


			// would be nice if it could be set here and would automatically carry forward to the client.

			// and make the top bar act as a drag / window handle to this, the Flexiboard.

			// Will also work within the Page_Context.
			//  The Page_Context will have some handling for dragging windows.


			// Will need to be done on activation.
			//top_bar.drag_handle_to(this);

			// Maybe good to get linked controls through the JSGUI system.
			//  Although it makes clutter in the DOM at the moment, that could be done through a much more optimized system.

			// Should also have a map of its contents.

			// Need to give it a 'resizable' property / behaviour. Maybe use field.

			// Would be best activating resize (including with the handle) purely on the client.

			//var resizable = this.get('resizable')

			// It needs to carry accross info about which is its internal relative container.

			//var ctrl_fields = {
			//	'ctrl_relative': div_relative._id(),
			//	'title_bar': title_bar._id()
			//}


			this.set('title_bar', title_bar);
			this.set('ctrl_relative', div_relative);

			// use different quotes...

			//this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));

			
		}

	},
	'resizable': function() {
		this.set('resizable', 'right-bottom');

		// This needs to be a property that gets sent to the client.
		//  Call them active_fields?

		this.set('dom.attributes.data-jsgui-fields', "{'resizable': 'right-bottom'}");





		// Want the resizable field to go to the client as well.
		// Want a convenient way of specifying that something gets sent to the client as a field / property.


	},
	'activate': function() {
		// May need to register Flexiboard in some way on the client.
		this._super();
		var context = this._context;

		var ctrl_relative = this.get('ctrl_relative');

		console.log('activate Window');

		//var content = this.get('content');
		
		//console.log('content.length ' + content.length());
		var top_bar = this.get('title_bar');

		top_bar.drag_handle_to(this);


		// Need better get system, can either get as data_value or normal js value.
		var resizable = this.get('resizable');
		if (resizable && resizable.value) resizable = resizable.value();

		console.log('resizable', resizable);

		if (resizable == 'right-bottom') {
			// Use absolute position rather than css right and css bottom, more compatability with older browsers.
			//  However, older browesers are having problems using require.js
			//  Browserify may work a lot better.

			// Absolutely positioned element within the window.
			//  Act as resize handles to the window.

			// resize_handle_to will be in ctrl enh (I think)

			// create the resize handle (basic control), then use resize_handle_to.

			var resize_handle = new Control({
				'class': 'right-bottom resize-handle',
				'context': context
			});


			//resize_handle.resize_handle_to(this, 'right-bottom');

			// ANd inline style for where it is...
			//  need to know the size of the window.

			var size = this.size();
			console.log('size', size);

			// for the moment resize handle height is 16px...
			//  We maybe measure this from CSS.


			var resize_handle_width = 16;
			var resize_handle_height = 16;

			var x = size[0] - resize_handle_width;
			var y = size[1] - resize_handle_height;

			resize_handle.style({
				'left': x + 'px',
				'top': y + 'px'
			});

			// size is the computed size + borders?
			//  outer size?

			// this.size('inner')


			//throw 'stop';


			//ctrl_relative.add(resize_handle);
			//resize_handle.resize_handle_to(this, 'right-bottom');

		}

		// 

	},
	'menu': function(menu_spec) {

		// Should probably take a JS object that holds the menu structure.
		//  Possibly event handlers as well?


		console.log('window menu menu_spec', menu_spec);

		// Need to build up the menu out of menu nodes.
		//  Probably create a new Horizontal_Menu control?
		//   Fixed_Menu control may be better... css could make it either horizontal or vertical.

		// Make a Horizontal_Menu for the moment.

		// Create a horizontal menu with that menu spec.

		// insert_before and insert_after.


		var h_menu_spec = {
			'value': menu_spec,
			'context': this._context
		}

		//menu_spec.context = this._context;

		// the menu spec includes a menu value...
		//  it renders that into the necessary nested controls.


		var h_menu = new Horizontal_Menu(h_menu_spec);

		// thien it needs to get inserted before the inner content.

		// Need content collection insert before.

		var ic = this.get('inner_control');

		var ic_parent = ic.parent();
		//console.log('ic_parent', ic_parent);
		//throw 'stop';
		//console.log('ic', ic);

		h_menu.insert_before(ic);
		// So needs to be able to access parent controls.

		h_menu.active();

		//throw 'stop;'






	}
})


module.exports = Window;