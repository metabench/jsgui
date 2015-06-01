/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


define(["../../../core/jsgui-lang-enh", './core/all'], function(jsgui, Abstract) {
	*/
var jsgui = require('../../../core/jsgui-lang-enh');
var Abstract = require('./core/all');

	var Data_Object = jsgui.DataObject;
	var Collection = jsgui.Collection;


	var Class = jsgui.Class, arrayify = jsgui.arrayify, fp = jsgui.fp;
	var tof = jsgui.tof, is_defined = jsgui.is_defined, each = jsgui.each, stringify = jsgui.stringify, arrayify = jsgui.arrayify, mapify = jsgui.mapify;
	var get_item_sig = jsgui.get_item_sig;

	// This will add parsing capabilities to Abstract Postgres.
	//  When code gets loaded into the functions, it parses it automatically.
	//  This will be very useful for having the web system use the functions when called to do so.
	//   The functions will be stored in a structure where the web system can use the information more intelligently.
	// Early on, will use it for logins.
	//  Will also make a permission system where users can do, and not do, things.
	//  User has access to various files.
	//  Want to avoid logical bugs to do with elevating permissions.

	// Parsing functions could be written here and put somewhere more general when needed.
	//  I like the idea of having my own JS parser and having it integrated more with the codebase and principles I am using.
	//  The Abstract JS objects would be useful, and I'd like to have things connected to the database layer and the GUI.
	//  Will enable the user to edit JavaScript using some tools that don't operate so much around files, working more on a conceptual level.
	//   For example, will be able to create a function for use in a GUI, or an event handler.

	// I think it gets quite advanced compared to what else is on the market if done right. Would be good to set up a framework and site to do with node.js middleware.
	//  The site could sell middleware, and work as an app store.

	// Analysing functions will be useful for using them within the application.

	// The application will be told to carry out an action.
	//  It may need to work out some of the details about how that action needs to be carried out.

	// Don't want to work on this now, want to get the system of 'resources' running.

	// 06/06/12 - Do want to work on this.
	//  Doing XML parsing at the moment, but want to write code that will work for general parsers.
	//  Interested in parsing some large documents, adhering to my own performance criteria and knowledge of how the parsing algorithm
	//  would work.

	// Stack based deterministic parsing, I think.
	//  Will be interested in tracking variable names and references through closures.
	//  May be using JavaScript closure to actually do that.

	// Some other code that responds to the parser events could build an object tree.
	// Code that responds to the events could also build an index of the items in the tree, which could be used to move through the
	//  tree structure but without having to create a tree in memory out of object instances.

	// This parser project should not require all that much code.

	// I think representing the language in BNF or similar (using nested JavaScript arrays) makes the most sense, because it will be easy to express.
	//  From this, it may be necessary for the parser to come up with parsing rules that get applied.

	// BNF and similar makes a lot of sense for expressing the grammar.
	//  Need to get from BNF to the rapid parsing.

	// The 'hand-written' parsers may exhibit more intelligence about parsing because they are written by people with experience in reading the code.

	// Do want some specific, speedy parsers. This now seems like an essential component to the work.
	//  It will be useful for working on an IDE - but could have different requirements like allowing rapid updates / insertions there.
	//  May be best to keep things actually structured in a document tree. Interested in making a new type of code editor where different GUI components
	//  represent structural blocks so the code is automatically kept in shape with the right formatting options.
	//   Will be very easy to move to the beginning of a block, select a whole block, go to variable declarations.
	//    That would be quite a complicated system to make programming a bit easier.
	//  Would be able to move around comment blocks, various things. Maybe put html formatting in comments and display them... various enhancements would
	//   be possible.


	// Grammar -> Parsing rules.

	// Some analysis of the grammar could produce the parsing rules.
	//  Perhaps as it is reading, it will be unaware of what kind of token it is reading, but it will know on finding some characters.
	//  Could have an array of acceptable_charaters that can be accepted in its given state. So </brick wall> would be noticed not to be valid when it finds a white space character where it is expecting a letter/number or '>' end tag signifier.

	// Noticing tokens / items that span multiple characters.
	//  Need to continue one character at a time.
	//  Returns the information as it is read, another mechanism could put it into a tree.

	// So it can be expecting various things, and can continue reading without knowing what it has identified.

	// Not so keen on using regular expressions for this. I think the algorithm will be based on how I read code sequentially.
	//  I doubt this will wind up faster than the existing state-of-the art, but I'm fairly sure I could make a fast, compact, generalized parser
	//  with different configurations for the different languages that the system parses.

	// To be effective, the system will need to parse a fair few different things, efficiently.
	//  HTML documents is a big one. Going to operate an HTML document feature detection system too. May have systems of pattern matching.
	// Integration of the parsing into the framework itself seems quite important. Going to be used for quite a lot of things to do with
	//  acquiring data.

	// Defining parsing rules - that makes a lot of sense.
	//  When it is in various situations, how does it treat things
	//   closures - is it initializing a new global variable or setting a local one?
	//    which local variables are available within that scope?
	//  A system where inner closure functions can be moved - and it raises an alert if they don't have the right variables available.
	// I think an algorithm based around sequentially reading files and following set rules based on what it finds is the best.

	// XML, and maybe JSON, maybe CSS would be simpler things to start with.

	// With closures, it won't just be a top level stack that gets consulted. It may go further up the stack to do the parsing and find the references.
	//  Each code level could have its declarations, and when there is a new declaration in a different block it supercedes the older one, with the older
	//  one being reverted to when the block closes.

	// XML should be relatively easy to parse.

	// Not a look-ahead parser... more of a look window parser.
	// It looks at the current character and determines the context where possible.



//	return Abstract;
//});
module.exports = Abstract;
