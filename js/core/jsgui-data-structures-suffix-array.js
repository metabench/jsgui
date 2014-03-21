
// maybe not really a part of jsgui?

// This is abstract because it is not concened with the rendering details, more with the shapes.
//  Shapes likely to be rendered to SVG, but here it is more concerned with the shapes themselves. They could go in a 3d rendering engine.

// I doubt any compressed suffix array will be all that small.
//  It could work pretty well on the server.

// Will also work on getting data structures working as resources, but this will be a basis for doing so.



define(["./jsgui-lang-essentials"], function(jsgui) {
	
	// This will wind up getting quite deep into computer science.
	//  Suffix arrays themselves are fairly simple, but getting deep into them in order to acheive the entropy level compression, with rapid search and
	//  update will prove difficult.
	
	
	// Could make a working text search system without too many difficulties though.
	
	// Putting the suffixes into a B+ tree?
	//  That seems interesting.
	//   Every one of them... would take up more memory.
	
	// Or every suffix occurrance goes in a dict - far too much memory usage with any significant length of suffix.
	
	// Need something reasonably efficient here.
	//  Will take some time and effort.
	//   May have different implementations, but move towards efficiency.
	//   Do want efficient full-text search here.
	
	// Need the full-text search capabilities.
	//  Tries really seem the way to do this.
	
	// The Burrows-Wheeler Transform seems essential to getting these things to work right.
	// Distributed unsorted and sorted KVS may be more important soon, perhaps along with deployment to EC2 for testing.
	
	// Also, saving to disk makes a lot of sense. Being able to specify which storage medium gets used would be good
	//  This could be done through storage providers, or storage resources.
	
	// Could be able to set up and configure a file resource, and perform the file operations on it.
	//  Then could have something that treats it as a simple array (like Tokyo Cabinet).
	//  Not so sure about porting Tokyo Cabinet to Node, but that would be something that gets a fairly fast KVS working through the disk.
	//   Not sure if all the right interfaces are supported.
	
	// Being able to call on the RAM and SSD resources over a network will be good. With the non-blocking system, it may take some time for all operations to complete, could
	//  make updating some trees / indexes slower. Dynamically updating the indexes could limit the input speed with concurrency and locking problems.
	
	// May research a way to lock a part of a compressed suffix array during an update, but it may be that quite a lot needs to get changed.
	//  This may work through an update queue.
	//  Associating keys with the items - need to be able to find keys from the text value.
	//  Pieces of text will generally be identified with a key. They key could represent the document they are from.
	//   If self-indexing is done, that value could even be removed from the main document and loaded from the index.
	//  Idea of keys if to be able to identify the documents where the text is found.
	
	// Some of the storage structures themselves could be relatively efficient.
	//  Using Tokyo Cabinet on each particular node could make sense.
	
	// Need to be careful about file access conflict issues when working on a distributed system.
	
	// Need to be able to use single-access files.
	//  A single node process would be OK managing Tokyo Cabinet.
	//  Also RAM storage would actually be run from a single node process.
	//  GPU RAM storage would be particularly interesting.
	
	// May be worth having more things in C++
	// A C or C++ memory managed subsystem could be quite useful.
	//  A bunch of them could be provisioned over a network.
	
	// Multi-level systems with cached reads and writes.
	//  Writing to RAM first, before writing to disk.
	//  Could work with battery backup... could also have an 'emergency mode' for when the power has been cut and it needs to persist its updates
	//   and not take new requests.
	
	// For the moment, making some fairly simple data structures available as resources makes sense.
	
	// Some C++ data structures could be used.
	//  Running the C++ objects as a node.js extension?
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
});
