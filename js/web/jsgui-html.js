// object viewer

/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
*/


// Need to sort out how the dependencies link.


// Does html require resource?
// html-enh require resource?

// Resource should be a part of the html client, but not the html system in general.

//throw 'stop';

// May be a circular reference here.
//  Within one of the modules that gets loaded.


// not so sure this needs to incluse the page context.

var jsgui = require('./jsgui-html-enh');

//console.log('jsgui', jsgui);
//throw 'stop2';
var Page_Context = require('./jsgui-html-page-context');
var Page_Control = require('./controls/page/page-control');


//define(["./jsgui-html-enh", "./jsgui-html-page-context", "./controls/page/page-control"],
	//function(jsgui, Page_Context, Page_Control) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var fp = jsgui.fp;
		var group = jsgui.group;

		// Client-side resource pool...
		//  That would be very useful for accessing resources on the server.
		//   Would have the server's URL, and a map (maybe) of what resources are on the server.

		// This would be some kind of request broker.
		//  It may ask the server what resources are on it, but the server could send this info (maybe just basic info)
		//  along when the client-side resource pool is started up.

		// Deliver that to jsgui-html-client?
		

		//console.log('Page_Context', Page_Context);
		//throw 'stop';
		//throw 'stop';

		jsgui.Page_Context = Page_Context;
		jsgui.Page_Control = Page_Control;
		// this is the enhanced HTML module.


		//return jsgui;

        module.exports = jsgui;
	//}
//);