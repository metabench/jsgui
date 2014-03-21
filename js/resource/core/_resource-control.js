
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../../web/jsgui-html', './resource'], 
	function(jsgui, Resource) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control, Collection = jsgui.Collection;
		
		// The basic controls should not do too much on top of normal HTML, but make it easier to do a few things
		//  there.
		
		var Resource_Control = Control.extend({
			// is an Input element.
			//  type of either text or password.
			// could possibly specify some of the starting field values in this part.
			
			'fields': [
				//['sections', 'collection']
			
			],
			
			'init': function(spec) {
				this._super(spec);
				var that = this;

				// Should render initially showing the resource.
				//  Then on the client, it should subscribe to the resource's messages, through the resource pool.

				// May be best to open up just 1 websocket connection between client and server.

				// Nice to have the client side resource pool or another aggregator do that.

				


			}
		})

		return Resource_Control;
});