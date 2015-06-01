//if (typeof define !== 'function') {
//    var define = require('amdefine')(module);
//};
//define(["./server", "./database", "./table"], function(Server, Database, Table) {

var Server = require('./server'), Database = require('./database'), Table = require('./table');


	//console.log('Database', Database);
	//throw 'stop';
	module.exports = {
		'Server': Server,
		'Database': Database,
		'Table': Table
	}

//});


// Will also have a non-postgres specific Web DB Resource.
//  It will connect to the Postgres DB and provide a Web DB interface.
//  eg get, set user operations, as well as functionality that depends on logic of authentication.
//   maybe set up authentication stored functions?
