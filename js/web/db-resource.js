if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// As well as resource controls, we will have some other web related resources.
//  The web db resource (adapter) will adapt a DB resource to provide a Web DB interface.
//  The Web DB interface will be the basics for what is needed to run a website.
//   Web DB resource will not have DB implementation specific code.

// The aim of this is to use some quite general purpose code for making a website's DB, and then exposing it as a Resource.

// The abstractions for this are taking ages to program.
//  I would possibly prefer a simpler web db system???
//  However the abstractions are fundamental to getting some systems running.

// Web DB Postgres could just create a blank DB from a backup / dump.
//  It could be made in a few hours / days.

//  It would allow storage of the website's information.
//


// May be worth making Web_DB_Resource_Postgres.
//  A more specific adapter that will not rely so much on the abstract DB and generation system.
//  Really need to maintain a table of users, permissions, roles, and objects associated with users, as well as the site's content.

// The abstraction of this is nice, but it gets difficult and time-consuming to make the full ORM-type system.



//








define(["./jsgui-html", "../resource/core/resource"], 
function(jsgui, Resource) {

    var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
    var Control = jsgui.Control;

    var Web_DB_Resource = Resource.extend({
        fields: {


            // It's a database resource.
            'database': Object//,
            //'name': String
        },

        'init': function(spec) {
            this._super(spec);
            var that = this;

            // This will more directly interact with a Postgres database, and provide data for the yet to be finalised Web-DB interface.
            //  This interface will be used to power general purpose websites.
            //   It could have extensions like catalogue / commerce
            //  Basically, want the web db interface to be enough to power the documentation system.
            //   This can be done with relatively simple pages of information.
            //  Each user will have a sorted key-value-store.
            //   There may be a bit more flexibility in storing and retrieving different types of data from there. May not necessarily be string / JSON.
            //  There could be a general site KVS? Or it's the admin's KVS maybe.
            //  Anyway, a sorted KVS for each user will be fairly simple to implement using a variety of DB back-ends.
            //  As well as the user-based KVS, there will be the general fields and functionality for authentication and password reset by email.












        },
        'start': function(callback) {
            // This can only start when its prerequisite resource has started.
            console.log('Web_DB_Resource start');


            // Does not need to connect to a general database.
            //  It could connect directly to a Postgres DB resource, and use more Postgres specific functionality.




            var db = this.get('database');


            var dbs = db.meta.get('status');
            console.log('dbs', dbs);

            var db_status;

            if (dbs.value) {
                db_status = dbs.value();
            } else {
                db_status = dbs;
            }

            console.log('db_status', db_status);
            console.log('tof db_status', tof(db_status));
            //throw 'stop';
            var that = this;
            // if it's not started, wait until it starts.

            db.on('start', function(e_start) {
                //console.log('e_start', e_start);

                that.start(callback);
            });

            if (db_status != 'on') {

            } else {
                var fns = jsgui.Fns();

                fns.push(function(cb) {

                    var db_def = {
                        'name': 'docs',
                        'tables': [
                            {
                                'name': 'users',
                                'columns': [
                                    //['id', 'int', 'autoincrement', 'pk'],
                                    ['id', 'serial', 'pk'],
                                    ['username', 'character', 24],
                                    ['passwordhash', 'character', 128]
                                ]
                            },

                            {
                                'name': 'roles',
                                'columns': [
                                    //['id', 'int', 'autoincrement', 'pk'],
                                    ['id', 'serial', 'pk'],
                                    ['name', 'character', 24]
                                ]
                            },

                            {
                                'name': 'user_roles',
                                'columns': [
                                    //['id', 'int', 'autoincrement', 'pk'],
                                    ['id', 'serial', 'pk'],
                                    ['user_id', 'int', 'fk-users'],
                                    ['role_id', 'int', 'fk-roles']
                                ]
                            }
                        ],
                        'crud': true
                    };

                    db.ensure(db_def, function(err, res) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('res', res);
                        }
                    });

                    cb(null, true);

                });

                fns.go(function(err, res) {
                    if (err) {
                        throw err;
                    } else {
                        //console.log('cb web resource');
                        callback(null, true);
                    }
                });

            }


        }
    });
    return Web_DB_Resource;
});