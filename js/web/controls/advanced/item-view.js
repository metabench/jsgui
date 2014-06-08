
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./plus-minus-toggle-button", "./vertical-expander"], 
	function(jsgui, Plus_Minus_Toggle_Button, Vertical_Expander) {
		
		var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof;
		var Control = jsgui.Control;
		
		// Maybe reture this old code.

		var Item_View = Control.extend({
			'fields': [['name', 'string']],
			'class_name': 'item-view',
			
			'init': function(spec) {
				
				// Want it so that the name field can be written during the initialization.
				//  Will depend on the chained fields.
				
				
				this._super(spec);
				var dom = this.get('dom');
				
				//dom.set('tagName', 'div');
				dom.get('attributes').set('class', 'item');
				
				// The item's likely to have a name.
				var content = this.get('content');
				// get the name from the spec?
				
				// and respond to the name being set?
				
				//  More work on controls will help.
				//   Give them more convenient methods. Make them faster too.
				var ctrl_expand_contract = new Control({'context': this._context});
				var cec_dom = ctrl_expand_contract.get('dom');
				//cec_dom.set('tagName', 'div');
				cec_dom.get('attributes').set('class', 'expansion button');
				content.add(ctrl_expand_contract);
				
				// or the name has been set by now and the span with the name can be created.
				
				// an icon, and the name next to it.
				
				var ctrl_icon = new Control({'context': this._context});
				//ctrl_icon.get('dom').set('tagName', 'div');
				ctrl_icon.get('dom').get('attributes').set('class', 'icon');
				
				content.add(ctrl_icon);
				
				var ctrl_item_info = new Control({'context': this._context});
				//ctrl_item_info.get('dom').set('tagName', 'div');
				ctrl_item_info.get('dom').get('attributes').set('class', 'info');
				content.add(ctrl_item_info);
				
				// then add a name control. this will have a text node inside.
				
				var ctrl_name = new Control({'context': this._context});
				//ctrl_name.get('dom').set('tagName', 'div');
				ctrl_name.get('dom').get('attributes').set('class', 'name');
				
				//var name = this.get('name').get();
				var name = this.get('name');
				console.log('name ' + stringify(name));
				
				//throw('stop');

				// Should be able to set the name, with the name as a Data_Value.


				
				var ctrl_tn_name = new jsgui.textNode({'text': name, 'context': this._context});
				ctrl_name.get('content').add(ctrl_tn_name);
				
				var ctrl_clearall_0 = new Control({'context': this._context});
				//ctrl_clearall_0.get('dom').set('tagName', 'div');
				ctrl_clearall_0.get('dom').get('attributes').set('class', 'clearall');
				content.add(ctrl_clearall_0);
				
				var ctrl_subitems = new Control({'context': this._context});
				//ctrl_subitems.get('dom').set('tagName', 'div');
				ctrl_subitems.get('dom').get('attributes').set('class', 'subitems');
				content.add(ctrl_subitems);
				
				this.set('ctrl_subitems', ctrl_subitems);
				
				var ctrl_clearall = new Control({'context': this._context});
				//ctrl_clearall.get('dom').set('tagName', 'div');
				ctrl_clearall.get('dom').get('attributes').set('class', 'clearall');
				content.add(ctrl_clearall);
				this.ctrl_subitems = ctrl_subitems;
				
				ctrl_item_info.add(ctrl_name);
			}
		});
	return Item_View;
});