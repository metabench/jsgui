// Also will be best to move this away from using AMD.
//  Use the normal node module system, I will serve this if necessary using Browserify.

// Having things set up using this DB system would be very good indeed.
//  Want to set up the CRUD procedures for various things such as user roles.
//  Don't want to work with custom SQL queries, so I think I need to continue work on the DB system.






// This would greatly benefit from being split up, but the circular references could be a bit of a problem?
//  http://stackoverflow.com/questions/4881059/how-to-handle-circular-dependencies-with-requirejs-amd


// Have a core/all file, that returns all of the abstract classes.
//  Will also have individual abstract class files.


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// Used to represent a database.
//  Want a class for a domain model as well.

// Domain model gets created, then that gets used to create database models.
//  Possibly domain model -> Abstract RDB -> Abstract Postgres

// I think a user interface to specify the domain model would help a lot...
//  but then I'd want to use resources etc to save it.

// Perhaps making authentication without all the ORM.
//  The ORM project seems big, it may be best to put that on hold for the moment.

// Get the more basic service / platform set up, it can specifically use Postgres / Mongo / whatever.
//  Should be relatively simple components that can be swapped with more complex ones.

// Naming of them... they won't exactly be THE classes to do this, but maybe earlier versions.
//  Name them sensibly and then replace in the future.



define(["../../../../core/jsgui-lang-enh"], function(jsgui) {

    // This could be used on the client too.

    // Likely to shift to DataObject...
    //  May have possibilities with tracking changes better.
    //  If an object gets changed within the DataObject it may work well for MVC patterns.
    //  Maybe in an editing application on the client could track that change on the client, and send it as an update to the server.

    // Or would deal with the columns in a db as a collection better.
    //  And when a column gets added or removed in the abstract model, other programmatic items such as generators could be told.
    //  So that functions that refer to that column could get changed too.


    // OK... think Abstract would be much improved through the use of DataObject.
    //  Have a DB, want to set a schema.
    //  Could use an 'ensure' function.

    // 25/02/11 Probably does not need so much more code right now.
    //  Could perhaps benefit from different ways of storing collections of things.
    //  Like the list of tables, stored as a collection.
    //  These collections should provide more convenient indexing.
    //   Also, a generator system would be able to listen for events from these collections and objects within them.


    // Postgres could have a different abstract model to many databases?
    //  Schema being like a database but things can get shared between schemas within the same database.
    //  Don't really want to restrict it too much.

    // Could maybe translate an abstract DB to a Postgres schema.


    // And then an abstract database translating to an abstract relational database.
    //  The db is like the rdb except the link tables are not defined.
    //  The relationships, such as one-to-many etc do get defined.
    // Editing this with UML in the browser would be very good.

    // Edit UML in a nice GUI, get the SQL code that is used to set up that databases in a number of different languages.
    //  Possibly automatically deploy it to cloud services.


    // For the moment, need to write code! on the execution path as well.
    //  I do like how resources are turning out so far.

    // I think more should be done on the database / abstract database system first.

    // An abstract wrapper around Postgres?
    // Or deal just with an abstract (probably advanced) database, and have it then translated to Postgres?
    //  I prefer making the abstract db, then generating the abstract RDB, then abstract Postgres DB, then persisting that, while still being able to
    //   use the original abstractions (which could be quite simple).

    // Once this has been done, more functionality such as authentication providers should be made.
    //  These will make use of the database abstraction layers so that they will focus on the logic, but also definitions of the logic that get given
    //   to the database abstration layers for them to implement and provide.


    var Data_Object = jsgui.Data_Object;
    var Collection = jsgui.Collection;
    // The Data_Object may have a few more features added to it.
    // Receiving and sending on event bubbling
    // Other use of a heirachy.
    // Parent objects.
    // Structure.
    // Having this structure, and knowing the parent, would be useful for many things, including event bubbling.
    //  And there may be collections within it

    // This will not have parsing, though that is a part of abstract postgres.
    //  Maybe make this abstract-postgres-core
    //  abstract-postgres-parsing
    //  and abstract-postgres then loads them both together.


    var Class = jsgui.Class, arrayify = jsgui.arrayify, fp = jsgui.fp, is_defined = jsgui.is_defined;
    var tof = jsgui.tof, is_defined = jsgui.is_defined, each = jsgui.eac, stringify = jsgui.stringify, arrayify = jsgui.arrayify, mapify = jsgui.mapify;
    var get_item_sig = jsgui.get_item_sig;

    var Abstract = {

        'Database': require('./database'),
        'Schema': require('./schema'),
        'SQL_Function': require('./sql-function'),
        'SQL_Function_Call':  require('./sql-function-call'),
        'Parameter': require('./parameter'),
        'Table':  require('./table'),
        'Column': require('./column'),
        'Sequence': require('./sequence'),
        'Data_Type': require('./data-type'),
        'Select': require('./select'),
        'Exists': require('./exists'),
        'Insert': require('./insert'),
        'Inner_Join': require('./inner-join')

        //,
        //'TC_UNIQUE': Abstract.Table_Constraint.extend({

        //})
    }

    // Possibly make the names clearer

    Abstract.Column_Constraint = {};

    // make these things classes...
    //  initialize these things in the same way as each other using the information_schema rows.
    //  then would be possible to find various unique field constraints
    // his would make it easier to identify the unique fields, to enable get_id_by_unique_field functions to be created.
    // Will be able to create the empty website in a very small amount of time.
    //  Content will get added and uploaded
    //  Various tools will be available to present the content.
    //   Centralized management of resources, such as uploading a high-res image file.
    //   Cropping it and selecting a region, while keeping the original
    //    Creating resized versions of the cropped image, saving them, making them available
    //  Web publishing UI tools

    // Could have both

    // Abstract.Constraint.Table
    //  The root table constraint

    // Abstract.Constraints.Table
    //  The plurality of different table constraints

    Abstract.Table_Constraint = Data_Object.extend({
        'init': function(spec) {
            this._super(spec);

            this.set('column_usage', new Collection());

            var using_is_row = is_defined(spec.constraint_name) && is_defined(spec.table_name) && is_defined(spec.constraint_schema) && is_defined(spec.constraint_type);
            console.log('spec ' + stringify(spec));

            console.log('');
            console.log('');
            console.log('using_is_row ' + using_is_row);

            if (using_is_row) {
                this.load_from_information_schema_row(spec);
            }

        },

        // The row may not cover which column it is constraining.
        //  May need to do other queries to get that information.


        'load_from_information_schema_row': function(row) {
            // pertty good... nicely getting various objects as abstract now.
            // will also work on getting data faster and simultaneously later.

            this.set('name', row.constraint_name);
            this.set('table', row.table_name);
            this.set('table_schema', row.table_schema);
            this.set('constraint_schema', row.constraint_schema);
            this.set('constraint_type', row.constraint_type);



        }

        // also need to load data from constraint_column_usage.



    });

    // These other ones will have some information_schema properties already set.
    //  A nice database capability should be good for administering and displaying art and music.
    //  The middleware will be very useful for supporting a fair few things.
    //  The versitility at this stage will allow various things to be set up very quickly, with the repetitive writing of database functions done automatically.

    // Is the PK a Column Constraint or a Table Constraint?

    // Column constraints can also be written as table constraints, while the reverse is not necessarily possible, since a column constraint is supposed to refer to only the column it is attached to.
    //  Will have more than one way of doing things.
    //  But one main way of doing it to begin with.



    var acc = Abstract.Column_Constraint;
    acc.Primary_Key = Data_Object.extend({
        'init': function(spec) {
            this._super(spec);

            // and a referemce to the column too
            //console.log('spec', spec);
            //console.trace("Here I am!")
            //throw 'stop';


            //this.set('name', 'primary key');

            // maybe not capital letters?

            // And the constraint has column as a property?

            // Well, it can have a collection of columns.
            //  I think it's best implementing that, but also making it so it can work with a single column.
            //  Still, may be best to store it as an array / collection?

            if (spec.column) {
                //console.log('spec.column', spec.column);
                this.set('columns', spec.column);
            }

            // Not sure how primary key can both be a table constraint or colum constraint







            this.set('constraint_type', 'PRIMARY KEY');

        },
        'toString': function() {

            var columns = this.get('columns');
            //console.log('columns', columns);

            if (!columns) {
                throw 'Primary key constraint needs column(s) assigned';
            }

            var column_name = columns.get('name').value();
            //console.log('column_name', column_name);

            return 'PRIMARY KEY(' + column_name + ')';
        }
    })

    /*
     -- Table: "Users"

     -- DROP TABLE "Users";

     CREATE TABLE "Users"
     (
     id serial NOT NULL,
     username character(24) NOT NULL,
     CONSTRAINT "Users_pkey" PRIMARY KEY (id)
     )
     WITH (
     OIDS=FALSE
     );
     ALTER TABLE "Users"
     OWNER TO postgres;
     */

    // foreign key...
    //  says that it references something.

    // The constraint belongs to the table rather than the column (in Postgres terms)
    //  Will be able to define a key as being part of a column.

    acc.Foreign_Key = Data_Object.extend({
        'init': function(spec) {
            this._super(spec);

            // Not just the target, the...

            // The table containing the foreign key is called the referencing or child table, and the table containing the candidate key is called the referenced or parent table.[4]


            // table
            // referenced table = target

            // Can reference two columns?
            //  Column in one table references a column in another table.

            // references a target column in a target table

            this.set('target', spec.target);

            // and knowing which column its a constraint for?
            //  That will be in the relationships mechanism, when that's working. Made do for the moment without it.

            //this.set('name', 'foreign key');
            this.set('constraint_type', 'FOREIGN KEY');
        },
        'toString': function() {
            // depending on if the target is a column or a table...
            //  how can we tell easily?

            if (this.get('target').get('columns')) {
                // then it is a table.

                return 'REFERENCES ' + this.get('target').get('name');

            }



        }
    });

    acc.Unique = Data_Object.extend({
        'init': function(spec) {
            this._super(spec);
            //this.set('name', 'unique');

            this.set('constraint_type', 'UNIQUE');

        },
        'toString': function() {
            return 'UNIQUE';
        }
    });

    acc.Not_Null = Data_Object.extend({
        'init': function(spec) {
            this._super(spec);
            this.set('name', 'not null');
        },
        'toString': function() {
            return 'NOT NULL';
        }
    });

    var atc = Abstract.Table_Constraint;
    atc.Unique = atc.extend({
        'init': function(spec) {
            this._super(spec);
            this.set('columns', spec.columns);

            this.set('constraint_type', 'UNIQUE');
        },
        'toString': function() {
            var res = [];

            res.push('UNIQUE (');

            var first = true;
            each(this.get('columns'), function(column) {
                if (!first) {
                    res.push(', ');
                } else {
                    first = false;
                }
                if (tof(column) == 'string') {
                    res.push(column);
                } else {
                    res.push(column.get('name'));
                }
            });

            res.push(')');

            return res.join('');
        }
    });

    atc.Primary_Key = atc.extend({
        'init': function(spec) {
            this._super(spec);

            // can be more than one column.

            // but will probably take columns themselves fine.
            //  will do a little checking to see what type of object it is probably.

            // better to make this have a collection of columns, but able to hold a column name.
            //  will be a modification before long.

            // has a name as well...

            console.log('spec', spec);
            throw 'stop';

            this.load_from_spec(spec, ['column_name']);


            // will be able to apply to more than one column.

            //this.set('column_name', spec.column_name);
            //this.set('name', 'primary key');
            this.set('constraint_type', 'PRIMARY KEY');
        },
        'toString': function() {
            var cn = this.get('column_name');
            var res = ['PRIMARY KEY ('];

            if (tof(cn) == 'array') {
                var first = true;
                each(cn, function(v) {
                    if (!first) {
                        res.push(', ');
                    } else {
                        first = false;
                    }
                    res.push(v);
                })
            } else {
                res.push(cn);
            }
            res.push(')');

            // and USING INDEX TABLESPACE?

            return res.join('');
        }
    });

    // Just make a constrinant?
    //  Give it the definition and it creates the right constraint.




    Abstract.make_constraint = function(spec) {
        console.log('make_constraint spec', spec);

        if (spec.constraint_type == 'PRIMARY KEY') {
            return new acc.Primary_Key(spec);

        }

        //throw 'stop';
    }


    return Abstract;
});



