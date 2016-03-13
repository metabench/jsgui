// object viewer

/*
 if (typeof define !== 'function') { var define = require('amdefine')(module) }

 // html-enh depending on Context_Menu?



 define(["../../jsgui-html", "./menu-node"],
 function(jsgui, Menu_Node) {

 */
var jsgui = require('../../jsgui-html');
var Menu_Node = require('./menu-node');

var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof, is_defined = jsgui.is_defined;
var Control = jsgui.Control;

var group = jsgui.group;

var Horizontal_Menu = Control.extend({

	// could have a title field.
	//'fields': {
	//	'title': String
	//},


	// maybe add before make would be better. add will probably be used more.
	'init': function(spec, add, make) {
		this._super(spec);

		this.__type_name = 'horizontal_menu';

		this.set('dom.attributes.class', 'horizontal menu');
		//console.log('spec.el', spec.el);

		// Then inside the menu we want a variety of menu nodes.



		// Need to deal with different construction stages better.
		//  Construct and render...
		//  For the moment will stick with whether there is an element given in the spec.

		// May be given the menu object, and need to create the menu nodes from that.

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

			//

			var obj = spec.value;

			//console.log('menu obj', obj);

			// Create the menu nodes from it.
			var that = this;

			var tobj = tof(obj);
			if (tobj == 'object') {
				each(obj, function(v, key) {
					var menu_node = make(Menu_Node({
						'text': key,
						'value': v,
						'menu': that
					}))
					that.add(menu_node);

				})

			}

			// then with the menu obj we construct the menu

			// Menu dealt with as objects or arrays?
			//  Possibly as it has more explicit ordering?
			//var exobj = [
			//	['File', ['Open', 'Close']]
			//]

			// Done with keys could be easier?
			//  Maybe arrays are clearer though.



			//throw 'stop';




		}

	},
	'activate': function() {
		// May need to register Flexiboard in some way on the client.

		if (!this.__active) {
			this._super();

			//console.log('activate Horizontal_Menu');

			// While it is open, clicking outside of the menu should close it.

			// Something for opening the menu.
			//  Need to respond to a click on a (root) node.

			// Want a quick way to get all controls of a certain type inside.
			//  eg this.find(':horizontal_menu')
			//  this.children(':horizontal_menu')

			// this.matches_selector(':horizontal_menu');

			// Needs to have various states
			//  Different parts of it can be open, closed.


			// On click, want to see if any of the nodes are open.
			//  I think being able to do some kind of selector / query that gets a group of controls would be very helpful here.

			// this.children(':menu_node[open]')
			//  Some kind of notation like that to find any open menu nodes.

			// The menu items should have 'state' properties

			var last_clicked;



			this.get('content').each(function(i, v) {
				//console.log('i', i);
				//console.log('v', v);

				//v.close_all();



				// Undefined state?


				// respond to a click on any of these.

				v.on('click', function(e_click) {
					//console.log('menu item clicked');


					// if it is already open?

					var v_state = v.get('state');
					//console.log('v_state', v_state);




					// Don't open if we are reclicking on the same menu item?
					//if (last_clicked !== v) {
						v.open();

						// And mousedown anywhere (else) to close.

						//console.log('pre setup one mousedown anywhere');

						// mousedown anywhere else?



						v.one_mousedown_anywhere(function(e_mousedown) {
							//console.log('e_mousedown.within_this ' + e_mousedown.within_this);

							if (!e_mousedown.within_this) {
								v.close();
								//
							} else {

							}

						});
					//}




					//last_clicked = v;

				})

				v.on('mouseup', function(e_mouseup) {
					//setTimeout(function() {
					//	last_clicked = null;
					//}, 0);
				});
			});
		}






		//  could find controls with classes and tag names using css queries.






		//

	},
	'close_all': function() {
		console.log('menu close_all');

		// need to do this recursively I think.
		//  could call this recursively on all nodes.

		this.get('content').each(function(i, v) {
			//console.log('i', i);
			//console.log('v', v);

			v.close_all();
		});


	}
})

module.exports = Horizontal_Menu;

/*
 return Horizontal_Menu;
 }
 );
 */
