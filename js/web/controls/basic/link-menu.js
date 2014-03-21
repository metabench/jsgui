
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../jsgui-html'], 
	function(jsgui) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control, Collection = jsgui.Collection;
		
		// The basic controls should not do too much on top of normal HTML, but make it easier to do a few things
		//  there.
		
		var Link_Menu = Control.extend({
			// is an Input element.
			//  type of either text or password.
			// could possibly specify some of the starting field values in this part.
			
			'fields': [
				['sections', 'collection']
			
			],
			
			'init': function(spec) {
				this._super(spec);

				// Basically this takes an array of strings and makes the links.
				//  It will need to deal with some more complex data too.

				var that = this;
				this.set('dom.attributes.class', 'link-menu');

				var sections = this.get('sections');
				console.log('Link_Menu sections ' + stringify(sections));

				var ul = new jsgui.ul({
					'context': this._context
				})
				that.add(ul);


				// then for each section, make the link
				sections.each(function(i, section) {

					var li = new jsgui.li({
						'context': that._context
					})

					var a = new jsgui.a({
						'context': that._context
					})
					var name = section.get('name').value();
					console.log('tof name ' + tof(name));

					a.set('dom.attributes.href', '/' + name.toLowerCase());
					a.add(name);
					li.add(a);

					ul.add(li);

				});



				// This should render as an input field.
				
			}
		})

		return Link_Menu;
});