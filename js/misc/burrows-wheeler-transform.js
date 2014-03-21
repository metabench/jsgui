
define(["./jsgui-lang-essentials", "./jsgui-data-structures-doubly-linked-list"], function(jsgui, Doubly_Linked_List) {
	
	// This is going to require some data types.
	//  Other, more complicated data types will rely on it.
	
	// There are likely to be different BWT implementations anyway.
	
	//  This will either contain one, or there will be different files with specific implementations.
	//   Some implementations will require somewhat advanced data structures.
	
	// This one is going to use a Sorted_KVS or something similar.
	//  Though the sorting will be done with B+, it's sorting we are after rather than B+ exactly.
	
	// The sorted order is what matters, not KVS capabilities.
	//  Perhaps to avoid confusion string lists should be made when that is all that is required.
	//  An algorithm will sort a string without it having a reference to what the keys represent?
	//   There won't be keys that represent anything, it will just be a sorted list.
	// Just like the B+ tree without the dict alongside it, or references for the value in the leaves.
	
	// Sorted_String_List
	//  API to walk through them... using a cursor I think.
	
	
	// A networked BWT would be interesting, perhaps the B+ tree will be networked.
	
	// Really need to do some more for making these general networked components.
	
	// They will publish an API
	//  Having security built-in seemd important.
	
	// Loading a set of credentials from a file seems less secure.
	//  Best to at lest keep them in a Sqlite database, or some sort of local database (Tokyo Cabinet even?)
	//  May require a bit of ORM for Sqlite.
	// Credentials file may make sense in the early stage though. It could also have protected access in its file system?
	//  It probably is not the best way to go ahead though.
	
	// Local Sqlite with the necessary ORM would take a little while but does seem like the sensibile solution for this data.
	//  The whole resources and providers model will be useful too.
	//  It may need to be given one set of credentials on startup anyway, these may be needed to access an initial data store that
	//   provide more credentials that are used to access other resources.
	
	// If various credentials are held in a text file, then the initial credentials are not required.
	//  However, secondary credentials could be encrypted in that text file, requiring a key to decrypt them which must be given to the application.
	//  Perhaps it could be in 'listen mode', listening for the right key to be provided so it can decrypt that file.
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

});