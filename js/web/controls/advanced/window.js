

// Also want to make an MDI window system (Multiple Document Interface)

var jsgui = require('../../jsgui-html');
var Horizontal_Menu = require('./horizontal-menu');


var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
var Control = jsgui.Control;

var group = jsgui.group;

var Window = Control.extend({

	'fields': {
		'title': String
	},


	// maybe add before make would be better. add will probably be used more.
	'init': function(spec, add, make) {
		this._super(spec);

		this.__type_name = 'window';

		this.set('dom.attributes.class', 'window');
		if (!spec.abstract && !spec.el) {

			var div_relative = add(Control({'class': 'relative'}))

			var title_bar = div_relative.add(make(Control({'class': 'title bar'})));


			var dv_title = this.get('title');

			var title_h2 = make(jsgui.h2());

			title_bar.add(title_h2);

			if (dv_title) {
				var title = dv_title.value();
				title_h2.add(title);
			}

			// So it having relative positioning would help that inner area to scroll.
			//  May have a listener for the inner control being set.

			// May also need to size the inner control so that the scrollbars also fit.
			//  Then inside that inner control, there is a larger logical area.
			//   A div that does not have any size or overflow set.
			//   That div can get moved around.

			// Not so sure about setting an inner size.
			//  Seems appropriate though.
			//  Could have a large control inside the inner control if necessary.

			// The scrollbar system should be baked into enhanced controls.

			// enhanced_control.scrollbars();

			// should be that easy to switch on the jsgui scrollbars.

			// It should not make use of the standard inner_control... or if it does, inner_control functionality needs to be written around scrollbar functionality.

			// So to start with, we need to make sure that a control makes use of an inner control area.
			//  Difficulty comes from a control that does not take scrollbars into account and has its own inner_control.


			// Possibly the Window control is not the best example to start with.
			// Or work on the Window control as well as some more generic examples.

























			var inner_control = div_relative.add(make(Control({'class': 'inner'})));



			//console.log('this._id() ' + this._id());
			//console.log('inner_control._id() ' + inner_control._id());
			this.set('inner_control', inner_control);
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

		if (!this.__active) {
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
			}
		}



		//

	},
	'menu': function(menu_spec) {

		// Should probably take a JS object that holds the menu structure.
		//  Possibly event handlers as well?


		console.log('window menu menu_spec', menu_spec);


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
