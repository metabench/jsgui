// object viewer


//if (typeof define !== 'function') { var define = require('amdefine')(module) }

// html-enh depending on Context_Menu?
	


//define(["../../jsgui-html", "./menu-node"],
	//function(jsgui, Menu_Node) {

        var jsgui = require('../../jsgui-html');
        var Menu_Node = require('./menu-node');
		
		var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var group = jsgui.group;

		var Context_Menu = Control.extend({

			// could have a title field.
			//'fields': {
			//	'title': String
			//},

            // Need to call the right events when the item gets chosen / clicked on.




			// maybe add before make would be better. add will probably be used more.
			'init': function(spec, add, make) {
				this._super(spec);

				this.__type_name = 'context_menu';

				this.set('dom.attributes.class', 'context menu');
				console.log('Context_Menu init spec.el', spec.el);

				// Then inside the menu we want a variety of menu nodes.



				// Need to deal with different construction stages better.
				//  Construct and render...
				//  For the moment will stick with whether there is an element given in the spec.

				// May be given the menu object, and need to create the menu nodes from that.

				//if (!spec.abstract && !spec.el) {
				if (!spec.abstract) {
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

					console.log('menu obj', obj);

					// Create the menu nodes from it.
					var that = this;

					var tobj = tof(obj);
					console.log('tobj', tobj);
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
					if (tobj == 'array') {
						each(obj, function(v, index) {

							var tv = tof(v);
							console.log('tv', tv);

							// then if it's string and function...

							var vsig = jsgui.get_item_sig(v, 1);
							console.log('vsig', vsig);

							if (vsig == '[s,f]') {
								var text = v[0];
								var item_callback = v[1];

								var menu_node = make(Menu_Node({
									'text': text,
									'value': text,
									'menu': that
								}))
								that.add(menu_node);
							}


							/*
							var menu_node = make(Menu_Node({
								'text': key,
								'value': v,
								'menu': that
							}))
							that.add(menu_node);
							*/
							console.log('v', v);
						})
						//throw 'stop';

					}

                    console.log('end init Context_Menu', this);

                    console.log('this._.content._arr.length ' + this._.content._arr.length);


                    //throw 'stop';

                    // If we stop here, the menu seems to have the right number of nodes.
                    // However, when it gets added into the active document, it seems as though content of the context_menu gets duplicated
                    //  There is a sequence of events when it gets added to the document.
                    //   It correctly seems to add it to the DOM and render the initial content.
                    //   However, it then seems to duplicate the internal content.
                    //    It has got the same items listed more than once.
                    //    May be able to help track this down by making an error if you try to add an item that's already there.
                    //     Possibly would require maintaining a map of what the child elements are called.
                    //      That would be possible with the Collection system, where it gets their IDs as they are added.

                    // Maybe track the adding of content better with console logging?












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

                console.log('pre super this._.content._arr.length ' + this._.content._arr.length);

                // So it seems the problem lies within the activate function.

				this._super();

                console.log('post super this._.content._arr.length ' + this._.content._arr.length);

                // If possible, this should be automatically activated when it's put into the document.
                //  But does that break something else?

				console.log('activate Context_Menu');

				// While it is open, clicking outside of the menu should close it.

				// Respond to clicking anywhere.
				//  If it's not a leaf node of the tree, will open further nested menu.

				//var ctrl_html_root = this._context.ctrl_document;
	        	var body = this._context.body();

	        	var that = this;

                // Listen for select events on the nodes.
                //  The menu has a publish/subscribe system for the menu nodes' events.

                // create event listeners on the nodes.
                //  need a way of getting all of the nodes.

                // heirichical iteration, like .ancestor
                // .find (like jquery)
                // .descendants
                // .desc

                var nodes = this.descendants('menu_node');

                console.log('nodes', nodes);










	        	// this.one_mousedown_anywhere

	        	






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



		//return Context_Menu;

        // but then it would need to be browserified in the client?

        module.exports = Context_Menu;
	//}
//);