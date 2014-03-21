// Je Suis XML.
// I am XML.

// Take an XML document
//  Maybe load it
//  Maybe obtain it from the DB.

// Create the various components.
//  This will be a templating engine, kind of.

// Go through the XML document, looking for what is not HTML, or what is the JSUI markup.
//  These objects will be defined according to a namespace that it listens to.

// Name -> JSGUI Control.

// Could use more templating replacement rather than getting everything back from the XML DOM...
//  however, it would scan the template for the named items?
//   but would the items necessarily be named?
//   they would occurr in the same order, so that's not a problem.
//  Make the list of such items, and go through them sequentially.
//   Having the XML DOM aware of what character in the document the item is...
//    that seems like the most effective way of doing it.

// Using a parser that is not standard... that gives the character positions of every item.
//  That way, all controls can be initialized there.

// Control gets initialized, and put within the document.
//  New instance of the control for each rendering.

// Will have a system of cached renderings as well.

// System of cached renderings of controls
//  Controls with specific specs or parameter sets.
//  This caching system may be distributed accross the network.
//   Will be caching of various rendered units.
//   The cache will be an abstraction more complicated than a dict.
//   I think this could wind up being a lot like ASP.NET but potentially with even better performance?
//    Likely to be faster because of the non-blocking way of node.js.
//   This would be a good benchmark to see, app could be similar in structure and complexity to an ASP.NET site.
//    Though 'website' is just one abstraction within the system really. Could be more flexible than ASP.NET. The wiring is there, but in a different form.
//     Not so much part of a closed, compiled framework, but is the app that gets run by node.js.

// I think the (network / resource) caching system will be very useful for the 'je suis' implementation.
//  Je suis should also work using JSON.
//  I think an XML variant is very suitable here because of the similarity to HTML and ASP.NET.

// There may be different optimization processes for this.

// Take XML document
//  Identify the active nodes, acrtive nodes get processed on the server.

// Parsing and returning whole document as XML makes the most sense.

// Then go through the tree, turning the active items into controls.
//  Equivalence of runat="server"?
//   I think I will allow runat="server" attributes on HTML elements too.
//   Want to make it compatible with ASP.NET where appropriate.
// The items that get run at the server will need an ID.
//  They will be able to be referred to within a block of server-side code.
//  Hopefully developers will find this system very useful indeed.
//   It will be interesting to see the performance comparison between this and ASP.NET
//   I may make this follow ASP.NET in other situations too, possibly I could make an ASP.NET compatibility layer.
// Mainly I want this to be using familiar development methodologies to ASP.NET.
//  Je Suis XML - Declarative front-end XML.

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../core/jsgui-lang-enh"], function(jsgui) {
	// OK, not using nested here any longer I think.

	var j = jsgui;
	var Class = j.Class;
	var each = j.each;
	var is_array = j.is_array;
	var is_dom_node = j.is_dom_node;
	var is_ctrl = j.is_ctrl;
	var extend = j.extend;
	var x_clones = j.x_clones;
	var get_truth_map_from_arr = j.get_truth_map_from_arr;
	var get_map_from_arr = j.get_map_from_arr;
	var arr_like_to_arr = j.arr_like_to_arr;
	var tof = j.tof;
	var is_defined = j.is_defined;
	var stringify = j.stringify;
	var functional_polymorphism = j.functional_polymorphism;
	var fp = j.fp;
	var arrayify = j.arrayify;
	var are_equal = j.are_equal;
	var get_item_sig = j.get_item_sig;
	var set_vals = j.set_vals;
	var truth = j.truth;
	var trim_sig_brackets = j.trim_sig_brackets;
	
	// Needs to turn an XML document into the rendered page, possibly including more JavaScript as well.
	//  There could be a fairly simple JavaScript page that runs on the server and is associated with the page.
	//  There is not the session state on the server, so there is much less to do.
	//  Not really sure where the server-side JavaScript for the page would fit in.
	//   The components are generated using JavaScript, and they take various parameters.
	//    Much of the interactions will take place on the client-side. This provides a means to use declaritive instanciation of 
	//    controls.
	
	// Need to transform the document to controls.
	//  Not sure about making loads of things as HTML controls.
	
	// Maybe putting controls in where appropriate.
	//  We'll still have an XML document, keeping some things just as the provided html text?
	//  I do quite like the idea of having this XML / text not processed, and just returned.
	//  Splitting up the XML text as a string processing task? Identifying which XML nodes are active?
	//   I think the performance will be much better if the whole page does not go through the Controls system.
	//   Only want those particular controls to be activated.
	//    May also be best not parsing the whole document into an XML DOM, but just searching for the controls that get activated.
	
	// The controls will be showing different things in different contexts.
	//  A main one is the user that is logged in. A file manager control would be for managing the files appropriate to that user.
	
	// This will be useful in developing pages quickly that use particular controls in the context of a page.
	//  The idea is that a simple HTML server can be running, using an existing HTML website.
	//  After that, some HTML is replaced with jsgui Controls. 
	
	// It then gets served.
	//  Tree containing both XML nodes and JSGUI controls.
	// Could possibly turn the whole HTML into an active document as well.
	//  That could be useful for some things, like editing the whole document on the client.
	
	// I think only activating pieces of it makes the most sense.
	//  Master pages in ASP.NET are very important and useful.
	//   Want there to be a similar system here.
	
	// Master pages are effectively controls.
	//  In this system, there is that further abstraction so that they don't necessarily get rendered as pages anyway, but that is really the main output of rendering
	//  here anyway.
	
	// Parsing whole XML document - does seem fairly important. Need to recognise things properly, looking for the correct attributes.
	// Will have various parts cached and returned from the cache rather than re-rendered.
	
	// The common elements could be put together very quickly.
	//  Again, will investigate using the graphics card for rendering in the right context. Could program this on a lower level and have it work very quickly.
	
	// Caching the rendered parts from inputs.
	//  Seems best with rendered controls.
	//  Want a system that discards things from the cache if they don't get used so often.
	//  Want it so it shows the measurable speed-up. Could have different types of cache.
	//  One such type is a network-memory type cache.
	//   Hash quickly created out of control and its parameters. It will attempt to retrieve the required output from the cache.
	
	// The actual rendering... XML/HTML will contain the important items.
	//  Inside them, however, are JSGUI controls / controls XML. These make the thing that contains them non-standard.
	
	// Shallow-mode controls
	// Only have different segments.
	// Can contain text (html) that gets output
	// Can contain other controls.
	// control.content?
	//  rather than control.controls.
	//  this makes sense, so that content can just be HTML.
	//  The inner controls... there could be inner controls in different places.
	//  Content may just be an array... this could make it run reasonably quickly.
	//   May investigate using gfx card ram for this, but likely to have integrated cache of most frequently used rendered items.
	//  For now, it makes sense to generalize controls.controls to controls.content.
	//   If it is just a piece of text, not in an array, then the control should render just as that text.
	//   But referring to the content... perhaps there could be inner_content. That could possibly be signified as another control, with a reference to that control.
	//    A silent control - one that does not render its own markup. It is not a div with anything inside.
	//    Tagless control is a less cool name (less ninja-like) but more descriptive so I'll go with it.
	
	
	// This may work within the rendering / transformation framework.
	
	// Have it as a single function?
	//  Also with a page context and other output options.
	
	// XML -> HTML and JavaScript properties.
	//  Taking in page context information
	//  Other information about objects in the XML could be given.
	
	// With the JavaScript included in modules, a few properties for the objects could be set.
	//  Also, data could be loaded through screen scraping facilities.
	
	// Doing parsing, while retaining string references, and the replacing the XML components would make the most sense in terms of speed optimization.
	//  Having this really fast from the beginning would be a big advantage.
	
	// Does not look like SAX parsers necessarily provide the position.
	
	// My own parser would do the trick - it does not have to be SAX exactly, but needs to return events about the locations of various items.
	//  From the information returned, navigation would be possible, may require a few algorithms though.
	
	// The main point will be in identifying the elements and items in the XML document, then these will be examined to see which of the items there are
	//  either normal HTML or are JSGUI.
	
	// Even normal HTML, with processing options and deployment targets set, may be rendered as shims and other things. It may refer to the CSS in order to do this,
	//  seeing where necessary. May analyse the document looking for occurrances of certain things and changing them, or could re-render the whole document.
	
	// Complete re-rendering mode... means all html elements will get recreated as controls. 
	
	
	// maybe should not need an instance of a class...
	
	// just being functions that carry out the transformation.
	
	
	// xml as string -> html as string, json object properties.
	
	// Really want to be using a parser that identifies each object as it has occured.
	//  I think it may be a SAX parser.
	//  Does not build the DOM tree, but provides references to the positions in the string for where the nodes occurr.
	// With the beginning and ending positions of all items noted, it will be possible to go through them (the nodes)
	//  identifying which are html and which are JSGUI.
	// The JSGUI nodes could be identified like <JSGUI:ColorPicker>, but would want <colorpicker> with the right API to work.
	
	// Would refer to some aliases, but would also be checking the full namespaced names.
	
	//  This would be as though HTML gets extended with other controls and components that raise JavaScript events in easy-to-handle ways.
	
	// Positional parser - maybe this will not do tokenizing in the same way.
	//  Perhaps I have a different parsing mechanism in mind to normal if obtaining references to the positions in the document is the goal.
	
	// This whole system should enable some very advanced interfaces that are very easy to program - as if companies can have and use their own HTML components
	//  in the websites they are making. It may wind up more developer-friendly than ASP.NET even.
	
	// Controls will go through a composition phase on the server - this will help in identifying which bits of code can just be copied verbatim
	//  and which get interpreted as jsgui controls.
	//  Controls could contain some plain HTML - I'm not sure about that.
	//   It may be best to fully parse the XML in controls into a DOM. They will only have a few parameters to begin with, but controls can contain HTML, and they can contain
	//   other controls. System will be able to handle both ways.
	
	// Jsgui / Je Suis XML needs to conform to the XML standard - XHTML with extensions basically.
	
	
	
	
	
	
	
	// SAX or similar does make the most sense here because we'll need the locations of the elements so that a new document can get spliced together.
	//  It is only with some of the parsers that they give the locations?
	// Not sure about using http://code.google.com/p/jssaxparser
	//  The code looks far too big. Looks like a parser could be far smaller and do as much.
	// I think we need a good JavaScript implementation of this parser...
	//  but using the existing parser may be the best approach (perhaps with a wrapper) and then its implementation can be swapped should I have an improved one.
	// My own parsing mechanism will probably be important for parsing (and modelling?) various coded documents that the user interacts with.
	
	// Efficient parsing / interpretation of XML seems important here, this probably won't be needed (soon) in the client-side library, and would be fine (but not ideal) running on the server
	//  as a large JavaScript file that does the job OK.
	
	// My own JavaScript XML parser may be more suitable soon, it would not be very much code either.
	
	// Index-based storage and retrieval in and XML document.
	//  I think this may be a bit different, in full, to SAX, but the SAX events or SAX event methodology may play a part in creating the index.
	
	
	// 13/06/2012
	//  Will use the simpler option of an existing XML parser.
	
	
	var DOMParser = require('xmldom').DOMParser;
	
	
	
	
	
	
	
	
	
	
	
	
	// Can really be a bunch of functions to do the reinterpretation.
	
	//  Will not just be creating the HTML (document or fragment) but will be outputting various other features that are needed as necessary.
	//   Perhaps it would create / make available rounded edge images.
	
	// It will produce HTML, possibly an HTML document, for a particular output.
	
	// Likely to use different output profiles.
	
	// Will be reading in the whole DOM, and outputting it as various items.
	
	// The references to other things... could rely on other subsystems being up and running.
	
	// Though the server code is very general and flexible, there is a definite execution pathway.
	//  Need to create that pathway, have it running, and then change / optimize components.
	
	// The client-side document will use a client library without access to loads of server side code.
	// Will not create images for the client - may make use of server side resources that provide such images.
	//  Could also use data URLs in CSS where appropriate.
	
	
	
	
	
	
	// returns an HTML document that will assumptions about server-side resources, but will will also be self-contained (for the moment) regarding the client-side code.
	
	
	var xml_to_html = function(xml, target_context) {
		var doc = new DOMParser().parseFromString(xml);
		
		// build up a new XML document, replacing the various elements while proceeding through it?
		
		// not sure about recursing furthest into it first... there could be controls holding other controls.
		//  order of control rendering could be dealt with elsewhere - these internal controls will be given to the external ones as contents.
		
		// May wind up using some server-side resources, but data URLS in CSS would also be very cool.
		
		// Will be various target profiles
		
		// Will most likely render controls using the outermost element.
		
		// Will be creating a new XML dom as this goes through.
		//  Will include the rendered controls.
		
		// function to recursively iterate through the xml dom
		
		var iterate_xml = function(xml, node_callback) {
			console.log('xml.nodeType ' + xml.nodeType);
			
		}
		
		iterate_xml(xml);
		
	}
	
	
	
	/*
	var Je_Suis_Xml = Class.extend({
		'init': function(spec) {
			
		}
		
	
	})
	*/
	
	
});














// Controls can have other controls inside.
//  These may be specified like XML, but it gets made into the 'controls' part of the spec.

// This will allow quite a lot of things to be put together quickly.
//  There will also be a code page (or two), much like ASP.NET.
// I think this will be a very good system for creating interactive web pages and sites.












