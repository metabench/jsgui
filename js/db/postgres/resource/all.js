if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};
define(["./server", "./database", "./table"], function(Server, Database, Table) {
	
	return {
		'Server': Server,
		'Database': Database,
		'Table': Table
	}

})