
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../../web/jsgui-html', '../../../web/controls/advanced/resource'], 
	function(jsgui, Resouce_Control) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;
		
		// The basic controls should not do too much on top of normal HTML, but make it easier to do a few things
		//  there.

		
		
		var Postgres_Database_Resource_Control = Resouce_Control.extend({
			// is an Input element.
			//  type of either text or password.
			// could possibly specify some of the starting field values in this part.
			
			//'fields': [
			//	['value', String],
			//	['type', String]
			//
			//],
			
			'init': function(spec) {
				

				// Specify that the basic resource does not render anything?
				//  Maybe still have the titlebar.


				//console.log('spec.resource', spec.resource);
				//throw 'stop';


				this._super(spec);
				this.__type_name = 'postgres_database_resource';
				this.set('dom.attributes.class', 'postgres database resource');



				// Will have a variety of controls inside it.
				//  This database resource control will act as an app in many ways.
				//  May use pushstate to change the URL, but the Database is a level where it's worth making an app.
				
				
				

				
			}
		});


		return Postgres_Database_Resource_Control;
		
		//return jsgui;
		
	
});