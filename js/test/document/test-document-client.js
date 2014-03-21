//require('nodetime').profile()

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

define(["../../web/jsgui-html", "../../web/controls/jsgui-sample-controls", "../../web/controls/basic/radio-button"], function (jsgui, jsgui_sample_controls, Radio_Button) {
	var Control = jsgui.Control;
	// May wind up extending from a particular type of control
	//  Eg a full-screen control

	// The contruction and rendering of this will work on the server, but some code will be activated on the client.
	//  That code would be ignored on the server, but it would still exist.
	//   It would work when the code is given an actual DOM node, for example.
	//  Activation will link the controls with DOM nodes. Only when they are linked (and activated) will they have the events processed.

	// Want some kind way of event capturing like jquery's on or live so that it captures a whole bunch of events from the document
	//  without having to attach all the events.

	// Doing client-side events will will take a little while to do best, but there will be a basic API of attachEventHandler
	//  will follow the W3C API generally, but can add a few things if useful.

	// Should also load jsgui-client.
	//  That would have an activation function.
	//  And/or would have various other functions added to classes/controls.
	//  Like html document would have .activate()
	//  Activate method would scan the document, activating controls as they are found.
	//  It would do the matching by ID.
	//  The client will need to be given some kind of information about what it contains.
	//   Possibly something in the server code that puts some variables into a document.

	// Possibly it could put the variables in a place specified by a comment.
	//  Could maybe do some short term caching as well?

	// Need to tell it about the control.

	// The whole component will be a control to start with.





	// This could register controls within the context - controls would need to be activated.
	//  No need to register Data_Objects.

	// With the registered controls, the client-side code can be told which controls (with which parameters) correspond with which ids in the document.

	// Maybe only register some controls?

	//  Matching ids to controls within a page_context makes sense.
	//  May be more important on the client-side.

	// Could have controls always have an id?
	//  Always have an id when put / rendered in a document context?

	// If we register one component, it could register all subcomponents recursively.

	//  This is the kind of function name that will compress a lot with more of a build process, turning it into a local variable.


	// jsgui.get_control_with_subcontrols

	// control.get_with_subcontrols

	// Then these controls would be sent to the client as a JSON list.
	//  They could have various parameters given, these parameters would then be in place on the client.

	// Then when activating the controls, they will get initialized, but in a different way.
	//  Control activation should be relatively simple usually.
	//  There will be the linking between the HTML and the Control, and the creation of the Control with the parameters.
	//   The HTML would not get rendered to begin with, with re-rendering of sub-controls being something that could be done
	//    when the sub-controls change.

	// Then the control will respond to events successfully.
	//  But then interacting with other controls could be a little bit tricky...
	//   with subcontrols being at particular places?

	// Also would want to build up a client-side data model.
	//  That could be an important part of it.

	// Could have that operating like a database on the client.
	//  I think that makes the most sense.

	// A fairly small component for:
	//  Holding data
	//  Syncing data with the server
	//  Syncing data with controls

	// Then 2 way data binding will be done.

	// There will also be a way for server data to sync with other server data.

	// However, we want this on the client-side as well.
	//  Will use different technologies.
	//  XML HTTP request with long polling I think.
	//  Perhaps websockets.
	///  Could throttle the uploads so it only sends every 1/2s, also with the server accumulating changes/commands in a buffer so it
	//    sends them in that time.

	// One Data_Object holding the client-side model.
	//  And when things are changed in that, there will be an event raised.
	
	// Will also deal with these data models stored and represented on the server - not just in RAM.
	//  can get into greater granularity of Data_Objects and Data_Values.
	//   objects could have global keys, and keys within the document / user space.

	// Will take a fair bit of work to get this all co-ordinated
	//  But simpler download, edit, save would not be too hard.

	// Could make more storage services, and use them.
	//  I think a data intermediary makes the most sense.
	//   So a client-side control will get/set data through a persistance layer.

	// I think a few solid days work on the front-end data system will help a lot.
	//  But that would also require back-end data to work?
	//   Could make the front-end data (broker) system to deal with other online data sources, or just get started with
	//   a JSGUI one.

	// Real-time updates will be really helpful.
	//  Having the server send updates to the client?
	//   So far prefer to have well defined gap between them.
	//   Will have different levels of complexities for this.

	// Don't really need that much right now, but can have a client-side listener that listens for changes in controls,
	//  or the data model that controls expose or reference.

	// Then we'll have full MVC.
	//  Can sync various data models.

	// Interestred in having a data model running as a node.js service.
	//  With a web interface, or referenced by a server.

	// Just presenting content won't require much activation.
	//  Fetching further data would require it.

	// Could have an example component that makes a browser to browse information about countries (does not change it).
	//  Then would have it get more info from a client-side data service.
	//   That client-side data service would then be in sync with a data service on the server.
	//   The server component could open a data service on a different port.

	// Once the client has downloaded, and controls activated, it connects to the data service.
	//  That will deal with the data, rather than the controls.
	//  The lifecycle of the controls on the server will be short, just for page generation.
	//   Then on the client, the controls will interact with the server through (a) data broker(s).


	var Client_Side_Component = Control.extend({
		'init': function(spec) {
			this._super(spec);

			var context = this._context;
			//console.log('context ' + context);
			//throw 'stop';

			this.set('dom.attributes.id', this._id());

			var make = function(abstract_ctrl) {
				return context.make(abstract_ctrl);
			}

			

			var radioA1 = make(Radio_Button({
		    	// May want to set the date or a range of dates... selected dates.
		    	'group_name': 'groupA',
		    	'checked': true,
		    	'value': 'rdo_A1',
		    	'id': true
		    	//'checked': true
		    	// 'id': auto // with auto as a local variable. Maybe take 'auto' string.
		    }));

			/*
			var radioA1 = new Radio_Button({
		    	// May want to set the date or a range of dates... selected dates.
		    	'group_name': 'groupA',
		    	'checked': true,
		    	'value': 'rdo_A1',
		    	'id': true,
		    	'context': context
		    	//'checked': true
		    	// 'id': auto // with auto as a local variable. Maybe take 'auto' string.
		    });
			*/

			// It may be worth making a Date_Picker control.
			//  Would have various puttons for selecting the year and the month (Carousel buttons)
			//   And the day would be selected from a grid.




			// radioA1.make - Makes and adds it...

			// add function for the control... adds it to the content.



			//radioA1.content().add(make(jsgui.Label({
	    	radioA1.add(make(jsgui.Label({
	    		'for': radioA1,
	    		'content': 'Option A1'
	    	})));
			
			var radioA2 = make(Radio_Button({
		    	'id': true,
		    	'group_name': 'groupA',
		    	'value': 'rdo_A2'
		    }));
		    radioA2.content().add(make(jsgui.Label({
	    		'for': radioA2,
	    		'content': 'Option A2'
	    	})));

			var radioB1 = make(Radio_Button({
		    	// May want to set the date or a range of dates... selected dates.
		    	'group_name': 'groupB',
		    	'value': 'rdo_B1',
		    	'id': true
		    }));
		    radioB1.content().add(make(jsgui.Label({
	    		'for': radioB1,
	    		'content': 'Option B1'
	    	})));

			var radioB2 = make(Radio_Button({
		    	// May want to set the date or a range of dates... selected dates.
		    	'group_name': 'groupB',
		    	'checked': true,
		    	'value': 'rdo_B2',
		    	'id': true
		    }));
		    radioB2.content().add(make(jsgui.Label({
	    		'for': radioB2,
	    		'content': 'Option B2'
	    	})));

	    	content = this.content();

			content.add(radioA1);
			content.add(radioA2);
			content.add(radioB1);
			content.add(radioB2);



			// Can put in some response to client-side behaviour.

			// But will want to have it run on initialization.
		}


	});

	//var Component = 
	return Client_Side_Component;

});


