
//if (typeof define !== 'function') { var define = require('amdefine')(module) }

//define(["../../jsgui-html", "./plus-minus-toggle-button", "./vertical-expander"],

var jsgui = require('../../jsgui-html');
var Plus_Minus_Toggle_Button = require('./plus-minus-toggle-button');
var vertical_expander = require('./vertical-expander');

	//function(jsgui, Plus_Minus_Toggle_Button, Vertical_Expander) {

		var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof;
		var Control = jsgui.Control;

		// Maybe reture this old code.

		var Item_View = Control.extend({
			'fields': [['name', 'string']],
			'class_name': 'item-view',

			'init': function(spec) {

				// Want it so that the name field can be written during the initialization.
				//  Will depend on the chained fields.
				var that = this;


				this._super(spec);
				this.__type_name = 'item_view';
				//var dom = this.get('dom');

				//dom.set('tagName', 'div');
				//dom.get('attributes').set('class', 'item');
				this.add_class('item');

				// The item's likely to have a name.
				//var content = this.get('content');
				// get the name from the spec?

				// and respond to the name being set?

				//  More work on controls will help.
				//   Give them more convenient methods. Make them faster too.
				var ctrl_expand_contract = new Plus_Minus_Toggle_Button({'context': this._context, 'state': '+'});
				ctrl_expand_contract.active();
				//var cec_dom = ctrl_expand_contract.get('dom');
				this.set('expand_contract', ctrl_expand_contract);
				//cec_dom.set('tagName', 'div');
				//cec_dom.get('attributes').set('class', 'expansion button');
				this.add(ctrl_expand_contract);

				// or the name has been set by now and the span with the name can be created.

				// an icon, and the name next to it.

				var ctrl_icon = new Control({'context': this._context});
				//ctrl_icon.get('dom').set('tagName', 'div');
				//ctrl_icon.get('dom').get('attributes').set('class', 'icon');
				ctrl_icon.add_class('icon');

				this.add(ctrl_icon);

				var ctrl_item_info = new Control({'context': this._context});
				//ctrl_item_info.get('dom').set('tagName', 'div');
				//ctrl_item_info.get('dom').get('attributes').set('class', 'info');
				ctrl_item_info.add_class('info');
				this.add(ctrl_item_info);

				// then add a name control. this will have a text node inside.

				var ctrl_name = new Control({'context': this._context});
				//ctrl_name.get('dom').set('tagName', 'div');
				//ctrl_name.get('dom').get('attributes').set('class', 'name');
				ctrl_name.add_class('name');

				//var name = this.get('name').get();
				var name = this.get('name');
				//console.log('name ' + stringify(name));

				//throw('stop');

				// Should be able to set the name, with the name as a Data_Value.



				var ctrl_tn_name = new jsgui.textNode({'text': name, 'context': this._context});
				//ctrl_name.get('content').add(ctrl_tn_name);
				ctrl_name.add(ctrl_tn_name);

				var ctrl_clearall_0 = new Control({'context': this._context});
				//ctrl_clearall_0.get('dom').set('tagName', 'div');
				//ctrl_clearall_0.get('dom').get('attributes').set('class', 'clearall');
				ctrl_clearall_0.add_class('clearall');
				this.add(ctrl_clearall_0);

				var ctrl_subitems = new Control({'context': this._context});
				//ctrl_subitems.get('dom').set('tagName', 'div');
				//ctrl_subitems.get('dom').get('attributes').set('class', 'subitems');
				ctrl_subitems.add_class('subitems');

				this.add(ctrl_subitems);
				ctrl_subitems.active();

				this.set('ctrl_subitems', ctrl_subitems);

				var ctrl_clearall = new Control({'context': this._context});
				//ctrl_clearall.get('dom').set('tagName', 'div');
				//ctrl_clearall.get('dom').get('attributes').set('class', 'clearall');
				ctrl_clearall.add_class('clearall');
				this.add(ctrl_clearall);
				this.ctrl_subitems = ctrl_subitems;

				ctrl_item_info.add(ctrl_name);

				if (typeof document === 'undefined') {
					that._fields = that._fields || {};
					that._fields['name'] = name;

					if (spec.path) that._fields['path'] = spec.path;

				}

				//this.active();



				//that.set('dom.attributes.data-jsgui-fields', stringify({
				//		'name': name
				//}).replace(/"/g, "[DBL_QT]").replace(/'/g, "[SNG_QT]"));

			},
			'activate': function() {
				if (!this.__active) {
					this._super();
					var that = this;

					var expand_contract = this.get('expand_contract');


					//console.log('expand_contract', expand_contract);

					// When a control is added to the DOM, it as well as its subcontrols should be automatically activated, with the various controls
					//  registered with the jsgui.map_controls.


					//expand_contract.activate();

					expand_contract.on('change', function(e_change) {
	          //console.log('e_change', e_change);

	          if (e_change.name === 'state') {
	            //e_change.value;

							//console.log('e_change.value', e_change.value);

							if (e_change.value === '-') {
								that.trigger('expand');
							}
							if (e_change.value === '+') {
								that.trigger('contract');
							}

	            //span_state.clear();
	            //span_state.add(e_change.value);

	          }
	        });
				}



			}
		});
//	return Item_View;
//});

module.exports = Item_View;
