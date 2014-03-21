// Test Web DB

// Create the abstract database representation of it

// And it will be quite normalized
//  Make an RDB
//   or norm-rdb

// Users table
// Roles table

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../../core/jsgui-lang-enh', '../../db/relational/abstract/db'], 
    function(jsgui, Abstract_DB) {
        var tof = jsgui.tof, each = jsgui.each;
        var stringify = jsgui.stringify;

        var test_build_sprite = function() {
            
        }
        //test_build_sprite();
        
        var test_build_sprite_slf4 = function() {
            
        }
        //test_build_sprite_slf4();
        
        var test_create_database = function() {
            //console.log('test_build_sprite_optimize');

            // Could declare things using an abstract form?
            //  So it would know not to try to connect to anything and only to act as a representation of a database
            //  However keeping abstract files here makes the most sense.

            // Create a new abstract database that holds the info for a website.
            //  

            var ADB = Abstract_DB.Database;

            // Possibly a class that represents a web db in abstract?
            //  Would be flexible so that some params can be changed but it will still be a web database.
            //  Used as the back-end of a website or web service.

            // Define tables, and define links between them,
            //  such as user_roles as a link between the users table and the roles table.
            console.log('pre create mbdb');
            var mbdb = new ADB({
            	'name': 'metabench',

            	// Tables is a field, defined using an Abstract Collection of type Table (given as the Table constructor)

            	'tables': {
            		'users': {
            			'columns': {
            				'id': 'sequential numeric primary key',
            				'username': 'string',
            				'passwordHash': 'string'
            			}
            		},
            		'roles': {
            			'columns': {
            				'id': 'sequential numeric primary key',
            				'name': 'string'
            			}
            		}
            	}
            });

            //

            var tables = mbdb.get('tables');
            console.log('tof(tables) ' + tof(tables));
            console.log('(tables) ', (tables));

            var tables_constraint = tables.constraint();
            console.log('tables_constraint', stringify(tables_constraint));

            console.log('tables.length() ' + tables.length());

            // Then with those two tables we should be able to create a link between them.

            //console.log('pre create mbdb');
            /*
            var db_fields = mbdb.fields();
            console.log('db_fields', db_fields);

            console.log('ADB.fields', stringify(ADB.fields));
            console.log('ADB._fields', stringify(ADB._fields));
            */
            // And could possibly generate a users and roles table, and have that encapsulated in a generation function.




            
        }
        test_create_database();
    }
);
