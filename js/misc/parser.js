// Need to get this to parse XML before long, but want to to be using a fairly general parsing / reading mechanism.
//  This is something that will lead to the best performance when processing the XML documents.

// However, using an external XML parser may speed things up when writing this system.
//  Will be able to have it interpret and activate XML documents quickly.

// The most specialised SAX parser would probably be better at doing this while using 
//  little memory and for simultaneous documents.

// A parser that is not certain of what it is reading until the item has been read.
//  Eliminates things that don't conform to descriptions
//  Identifies those that do conform for certain
//   Identifies when something is mismatched within the structure.

define(["./jsgui-lang-essentials"], function(jsgui) {
	
	
	// Move through the string, character by character.
	
	// State, Stack, CurrentSymbol, CurrentSymbolType
	
	// I think Crockford's module pattern would be better for this.
	
	// Deterministic? top-down parser
	//  This would become more complicated for languages such as JavaScript.
	
	// To deal with uncertainty, the parser will keep track of that the structure it is reading could be.
	
	// Array of potential candidates for what it is reading
	
	// with XML, there will be fewer items.
	// This will deal with phase transitions.
	
	//  Will raise an event when a new object has been started / when it has been concluded that an object has been 
	//   started. For instance, when parsing XML it may read a tag and raise an event saying that tag has been read.
	//   When it starts a tag it would say what has been read before it.
	
	// It should know which characters could come next within various situations.
	//  Some characters will be illegal after the approved ones.
	
	
	
	// starting with a null or 0 phase, it determines what the next object can be
	
	
	// what it is expecting...
	//  white space
	//  tag
	//  directive
	
	// then as it proceeds, it needs to see which of these items the character matches, and process phase transitions
	// appropriately. As it reads a character, it will check to see if that is what is expected in that place.
	
	// It may raise events for unicode encodings being found, and these could be useful when building the actual text strings
	//  represented in the XML. In some cases, they would just be copied accross to resulting documents that use the input
	//  of the positions of items found.
	
	// Using some kind of reasoning table to determine what it could be reading...
	
	// The speed may depend on the complexity of the grammar. 
	
	// This system will be reading onwards, and raising events when it has concluded what it has read.
	
	// The system will know what states it can transition into from the state it is in.
	
	// System is likely to have descriptions of various states... what they can contain.
	
	// eg transition from whitespace to other... non-whitespace character.
	
	// transition from tag to ready/ expecting content state.
	// while reading a tag, it won't immediately know if it is an opening or closing tag, or a single tag element.
	//  while reading the tag, it is aware of what the possibilities are. There is an error if it finds an illegal character
	//  such as '*' within a tag name.
	
	// May have the expectations based on production rules.
	
	// This parser may be quite different to existing styles. It's not looking ahead or behind (much) but may be 'indecisive'.
	//  It does not guess what it is reading, but keeps track of what it could be reading at that point.
	
	// What it reads should fit within expected structures.
	
	// When reading an XML element... it will know the element has begun because of the opening tag.
	//  It won't know it is reading an element (does not really need to) until it has finished reading the opening tag.
	
	// Should be a clear decision path whenever there is a character there.
	//  There may be a phase transition indicated by the character.
	
	// Mapping from the language / grammar to the phase transitions.
	//  Probably best for some phase transition info to be there either provided by hand (to start with)
	//   or generated.
	
	// Describing the phase transitions... some of them will have to do with closing tags.
	//  Some could indicate returning to the previous levels in the heirachy - these will be indicated by an event that gets raised.
	
	
	// Will be rerring to the language type. There will be information and functions within the relevant objects.
	
	// Will be using a single stack.
	//  With closures, will likely be making reference to further up the stack, but could keep an index of what closures apply where
	//   or have a closure stack?
	
	var Parser = Class.extend({
		'init': function(spec) {
			
			
			// the stack of items. [item_type, pos_beginning, pos_end]
			//  more information about the item?
			//  will need to be identifying them.
			
			this.stack = [];
			
			
			// what it is currently reading
			//  Holding more data about what it is reading or may be reading.
			
			// This parser is modeled more on my own process of reading something.
			//  Taking letters in one at a time and determining what each of them means in relation to the present context.
			
			// What can be expected in various cases.
			//  What state it leads to... is it creating a new level of depth?
			
			
			this.state = null;
			
			// current position of the starting item?
			this.stack_level = 0;
			this.pos = 0;
			
			// will have callbacks.
			
			
			
			
		},
		'receive_character': function(char) {
			// 
			
			// Will have parsing instruction sets. There will be different parsing systems for different content.
			
			// Finite state-machine like
			var state = this.state, stack_level = this.stack_level, stack = this.stack;
			
			// check for a state change.
			//  this could be using a function that does that check specifically.
			
			// see what action to take with the new character... perhaps it is a state change.
			//  not really necessary to put the character into a buffer, this parser provides events that show the locations of the various items.\
			
			// Having the whole thing parsed as a tree (rather than numerical index) may help with manipulation.
			
			if (state == null) {
				if (char == '<') {
					stack[stack_level] = ['tag', this.pos];
					
					// at the stage that it closes, will close the item on the stack.
					
					// recognising it's starting a tag/.
					
					this.state = 'tag';
					
				}
				
				// checking against a collection of characters.
				//  will do a numeric test on the character code.
				
				
			}
			
		},
		'parse': function(text) {
			// go through it character by character.
			
			
			
			
		}
	});
	
	// States depend on the production rules.
	
	// beginning
	//  would be expecting a document declaration or root element.
	
	// the shifts to other states will depend on what characters come next.
	//  When in any state, it should be possible to clearly define how it can transit to other states.
	
	// Levels of identification... it could be reading something, and not know if it is an opening or clising tag for the moment.
	//  Want it so that it will decuce which it is working on.
	//  Should follow some more general rules, applying the specific rules for parsing the appropriate language.
	
	// 'tag', 'opening_tag', 'closing_tag'
	// 'tag', ['tag', 1], ['tag', 0]
	//  these could be ways of representing either opening or closing tags.
	
	// Could have classes and subclasses - so it can get more specific for some particular items when it finds out more information.
	//  A way of expressing ambiguity between different states.
	
	// Could create classes for these types - but not keen on it now, prefer to have things working using the normal JavaScript data objects.
	
	// transition/change to more determinate state.
	//  changing from 'tag' state to 'opening_tag'...
	
	// want things to follow clear rules, so it will be easy to trace what it should do at any stage.
	//  will not be such a complicated parser as some others, but will be complicated in that it is based on how I read code based on introspection.
	
	// 
	
	
	
	
	
	var xml = {
		
		
		'beginning': {
			'transitions': {
				// how it transitions to other states
				
				// what characters will make it transition?
				
				// transition with '<'
				//  and then it transitions to an indeterminate state.
				//  could be indeterminate between various different states.
				//   not loads of them though.
				//   when it has proceeded, it will be able to make a successful determination about what it has been reading.
				
			}
		}
	}
	
	// Parsing XML...
	//  < state changes from null to 'tag'
	
	
	// Perhaps state transition table or map.
	// Need way of classifying characters
	//  General classes, such as letter, digit, symbol, whitespace
	//   then other details:
	//    symbol
	//     is it structural - also could say what it signifies?
	//  State of what is currently being parsed - it may know what it is reading.
	//  Maybe a variable so that it will know it is reading a particular thing at one time.
	
	// Needs to deal with uncertainty as it is being read.
	// This will really be a 'parser layer'. It won't be building up a full tree containing the data, but there may be a tree index to the data
	//  that is held elsewhere.
	
	// Can be some variety in XML documents to do with unicode and character encoding.
	//  Would need to notice the unicode encoded character... the document will stay in the same form for the moment,
	//   but it may need to understand that character.
	
	// Not sure if I should continue with this parser... not sure it would deal with all the complexities as well as an existing parser.
	// But then I do think the 'reading' method would be quite fast... not sure exactly as the human perception uses a fair bit
	//  of circuitry that computers don't have.
	
	// Do think this kind of parsing may be worth doing.... worth getting further in.
	
	// This parser would be making decisions whenever it gets a new character.
	//  It would raise events indicating the beginning or ending of various objects.
	
	// Will indicate phase transitions through events.
	
	// Going through character by character, to see if what we are reading matches a specified pattern.
	//  Putting the character within an object / mapping that a character of a certain type has been put into place.
	
	// Regular expressions being the way to understand the terms?
	//  It may make sense with more efficient character-by-character regex testing.
	
	// When eliminating classifications for what it is reading - add the given character (or nested item) to that classifier.
	
	// Will see for each character if it fits in the classifier.
	
	// Such as when classifying opening tag or closing tag.
	//  Could eliminate the existing possibilities one by one.
	//   That seems like the logical way. Perhaps not the most efficient way.
	//    The different possibilities will have different criteria, so may not be worth considering them all at once (with one piece of logic)
	
	// When reading any item, am going to be removing possibilities as they are read.
	//  This means that the time taken will depend on the complexity of the grammar.
	// I think this parsing algorithm will work quite quickly.
	
	// Could be reading into more than one production at once...
	//  Reading a word while reading a sentence.
	//  May have to do with stack levels.
	//   Sentence could have various different constructions.
	//    Could be too many to consider all word forms.
	
	// The idea of holding all possibilities to start with - they would have to be quite general, and then eliminated as the parser progresses.
	
	// I think not doing the (XML) parser for the moment makes the most sense.
	//  Likely to return to that.
	
	// Will do a simpler je suis xml... it will use a built-in XML parser.
	
	
	
	
	
	
	
	
	
	
	
	// 
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// 
	
});