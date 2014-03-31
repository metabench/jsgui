if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};
define(["./server", "./database", "./collection"], function(Server, Database, Collection) {
	
	return {
		'Server': Server,
		'Database': Database,
		'Collection': Collection
	}

})