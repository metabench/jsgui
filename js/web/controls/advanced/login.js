
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./text-field"], 
	function(jsgui, Text_Field) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;

		// Another type of control? - composite or basic-composite?
		//  That would be an unenhanced Login control. Made up of basic controls, will render and
		//   be useful on very limited platforms.

		// Since this is now an advanced control...
		
		var Login = Control.extend({

			// Maybe should put this into a form, so that it does a form post.
			//  That could possibly be disabled.


			'init': function(spec) {
			    var make = this.make;
			    
			
				this._super(spec);

				this.set('dom.attributes.class', 'login-control');

				// and use a form control, set it's dom attributes.
				//  will use relative login url.

				// We can get the cookies from the context.

				var req = this._context.req;

				console.log('--- Within Login Control ---');

				var headers = req.headers;
				console.log('headers ' + stringify(headers));

				// If logged in, show a welcome message and logout button rather than the form.
				//  However, the application should have authenticated at an earlier stage.
				//   Perhaps it would also come up with the permissions for that user, but there could be many specific permissions
				//    for different objects.



				//console.log('this._context ' + stringify(this._context));
				var auth = this._context.auth;
				console.log('auth ' + stringify(auth));

				if (auth && auth.verified) {
					var div_logged_in = new jsgui.div({
						'context': this._context
					});
					//div_logged_in.add('Logged in as ' + )

					var span_logged_in = new jsgui.span({
						'context': this._context
					})

					span_logged_in.add('Logged in as: ' + auth.username);

					div_logged_in.add(span_logged_in);

					// And a button to log out.
					//  This will carry out an action, like the login, but without a form.
					var frm = new jsgui.form({
						'context': this._context
					})
					// action, method

					frm.set('dom.attributes.action', '/logout/?returnurl=%2F');
					//frm.set('dom.attributes.action', '/login');
					frm.set('dom.attributes.method', 'POST');

					div_logged_in.add(frm);

					var btn = new jsgui.button({
						'context': this._context

					})
					btn.set('dom.attributes.type', 'submit');
					btn.set('dom.attributes.value', 'submit');
					btn.set('dom.attributes.class', 'logout');

					btn.add('Logout');

					frm.add(btn);


					this.add(div_logged_in);




				} else {
					var frm = new jsgui.form({
						'context': this._context
					})
					// action, method

					frm.set('dom.attributes.action', '/login/?returnurl=%2F');
					//frm.set('dom.attributes.action', '/login');
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
					btn.set('dom.attributes.class', 'login');

					btn.add('Login');

					frm.add(btn);
				}

				//throw 'stop';

				
				
				
			}
		});
		
		
		return Login;
	
});