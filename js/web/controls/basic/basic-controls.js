
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['./jsgui-html'], 
	function(jsgui) {
		
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
		// TextField
		//  (includes password)
		
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

				//textInput.set('dom.attributes.type', this.get('type'));

				
				left.add(label);
				right.add(textInput);

				// The inputs should have IDs so that the for system works.

				// .ensureClientId();




				//right.add(
				
				
				// some MVC here.
				// Want it so that when the label changes there is an event.
				//  This may only be needed if there actually are events on the client - which there most likely will be.
				
				// event responders... bind to the change event.
				
				// But this will automatically notify the container.
				
				//this.add(label);
				
				
				
				this.add_event_listener('change', function(e) {
					//console.log('Text_Field change event e ' + stringify(e));
					
					
				});
				
			}
		});
		
		// Want an input button as well.
		//  Just to submit the form but its behaviour will be overridable.





		
		// It looks like serving basic HTML pages needs to be sped up a lot.
		//  Something's slowing it down a lot after multiple requests.
		//   It could probably be a lot faster on the first requests too.



		// A multi-language version... loading the right content in in the right language...
		//  Likely to be its own control. Could wind up more complicated in various ways...?

		//  However, this is just the basic login control.

		var Login = Control.extend({

			// Maybe should put this into a form, so that it does a form post.
			//  That could possibly be disabled.


			'init': function(spec) {
			    var make = this.make;
			    
			
				this._super(spec);

				this.set('dom.attributes.class', 'login');

				// and use a form control, set it's dom attributes.
				//  will use relative login url.

				var frm = new jsgui.form({
					'context': this._context
				})
				// action, method

				frm.set('dom.attributes.action', '/login/');
				frm.set('dom.attributes.method', 'POST');

				this.add(frm);
				// and composed of two text fields...
				
				var tf_username = new Text_Field({
					'text': 'Username',
					'name': 'username',
					'value': '',
					'type': 'text',
					'context': this._context
					
				})
				
				frm.add(tf_username);
				
				// This is a factory function that calls the constructor,
				//  with this context as the context.
				//make(Text_Field({}));
				
				var tf_password = new Text_Field({
					// a name field as well?
					//  a name for the form

					'text': 'Password',
					'name': 'password',
					'value': '',
					'type': 'password',
					'context': this._context
					
				})
				
				frm.add(tf_password);


				// <BUTTON name="submit" value="submit" type="submit">
				var btn = new jsgui.button({
					'context': this._context

				})
				btn.set('dom.attributes.type', 'submit');
				btn.set('dom.attributes.value', 'submit');
				//btn.set('dom.attributes.class', 'login');

				btn.add('Login');

				frm.add(btn);
				
				
			}
		});
		
		// Uses a Text input and a span / lable.
		//  Not tabular (though that could be an option for their rendering).
		
		// Will wrap controls relatively easily to show them as a document.
		
		
		
		
		
		
		// Should have fairly concise definitions here.
		
		
		
		var Basic_Controls = {
			'Text_Input': Text_Input,
			'Text_Field': Text_Field,
			'Login': Login
		}
		
		
		return Basic_Controls;
		
		//return jsgui;
		
	
});