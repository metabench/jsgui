/**
 * Created by James on 25/07/2014.
 */

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

        var Web_DB_Resource_Postgres = Resource.extend({
            fields: {


                // It's a database resource.
                // It still connects to a DB resource, this time it needs to be Postgres though.

                'database': Object//,
                //'name': String
            },

            'init': function(spec) {
                this._super(spec);
                var that = this;

                // This serves as an adapter to a database resource.

                // Will have get and set properties.
                //  Not sure about nested subresources.
                //  The Resource is an object that provides an interface to information. How the Resource does that is an implementation detail, but when patterns emerge they could be
                //  made more convenient somehow.

            },
            'start': function(callback) {
                // This can only start when its prerequisite resource has started.
                console.log('Web_DB_Resource start');





                var db = this.get('database');

                // Why does this change from being a Data_Value to a string?
                //  No matter how it winds up working, if it's currently a Data_Value, and we call set, giving it a string, it stays a Data_Value


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
                        // We don't ensure the DB here like we do in web-db-resource.
                        //  We just need this to interact with an existing Postgres Web DB.

                    callback(null, true);



                }

            }
        });
        return Web_DB_Resource_Postgres;
});