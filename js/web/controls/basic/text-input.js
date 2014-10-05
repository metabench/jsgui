/*
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html"], 
	function(jsgui) {
*/

var jsgui = require('../../jsgui-html');
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;
		
		// The basic controls should not do too much on top of normal HTML, but make it easier to do a few things
		//  there.
		
		var Text_Input = Control.extend({
			// is an Input element.
			//  type of either text or password.
			// could possibly specify some of the starting field values in this part.
			
			'fields': [
				['value', String],
				['type', String]
			
			],
			
			'init': function(spec) {
				this._super(spec);
				
				// listen for a change in the value of the text field, in the DOM.
				//  and when that changes, the value changes.
				
				this.set('dom.tagName', 'input');

				//console.log('dom.tagName ' + this.get('dom.tagName'));
				
				// maybe dom should be able to have a variety of attributes,
				//  or could actually specify what is valid in HTML.
				//  Would prefer to specify the HTML so that better html editors could be made... select the 
				//   input type from a drop-down menu. Smaller builds may not have these.
				
				this.set('dom.attributes.type', 'input');

				// This should render as an input field.
				
			}
		})
module.exports = Text_Input;

		//return Text_Input;
//});