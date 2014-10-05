
/*
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "../basic/text-input"], 
	function(jsgui, Text_Input) {
*/
var jsgui = require('../../jsgui-html');
var Text_Input = require('../basic/text-input');


		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;
		
		var Text_Field = Control.extend({
			// fields... text, value, type?
			//  type could specify some kind of validation, or also 'password'.
			
			'fields': [
				['text', String],
				['name', String],
				['value', String],
				['type', String]
			],			
			//  and can have other fields possibly.
			
			
			'init': function(spec) {
				this._super(spec);
				
				// then render the various pieces.
				//  Want it so that they are connected to the fields through an MVC-like system.
				//   This one should be fairly simple.
				
				// But need to respond on 'change' as well as a button being pressed.
				//  In my event system the change may happen if a button is pressed and the text is different.
				//   Maybe could specify immediate mode changes.
				
				// Label... need that as one of the HTML controls.
				
				
				// The label will need its ID to be automatically generated (maybe upon rendering).
				
				// a div for the left, one for the right.

				// Want some basic jsgui css.
				//  That will go in the basic jsgui html page.
				
				// Having automatic setting / updating of context will make most sense.
				// A context getter/setter may work well because items lower down will need to know what context they are in quickly.
				
				this.set('dom.attributes.class', 'field');

				var left = new jsgui.div({
					'context': this._context
				});
				left.set('dom.attributes.class', 'left');
				
				var right = new jsgui.div({
					'context': this._context
				});
				right.set('dom.attributes.class', 'right');
				
				// adding should set the context properly.
				
				
				
				this.add(left);
				this.add(right);

				var clearall = new jsgui.div({
					'context': this._context
				});
				clearall.set('dom.attributes.class', 'clearall');
				this.add(clearall);
				
				var label = new jsgui.label({
					'context': this._context
				
				});
				var text = this.get('text');
				//console.log('text ' + text);
				//console.log('tof text ' + tof(text));



				label.add(text.value());
				
				var textInput = new Text_Input({
					'context': this._context
				});
				var tiid = textInput._id();
				textInput.set('dom.attributes.id', tiid);
				textInput.set('dom.attributes.name', this.get('name'));


				label.set('dom.attributes.for', tiid);

				// and the type... it could be a password.
				//  that's a DOM attribute.


				textInput.set('dom.attributes.type', spec.type);
				
				left.add(label);
				right.add(textInput);

				this.add_event_listener('change', function(e) {
					//console.log('Text_Field change event e ' + stringify(e));
					
					
				});
				
			}
		});
		//return Text_Field;
module.exports = Text_Field;
		
		//return jsgui;
		
	
//});