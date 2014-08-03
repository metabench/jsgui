// This could wind up having a lot of functionality in order to provide the application programmer with ease of use
// flexibility, and high performance.


if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../../core/jsgui-lang-enh", "../../resource/core/resource", "../mongo/resource/database", "../postgres/resource/database"], function(jsgui, Resource, Mongo, Postgres) {

    var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Collection = jsgui.Collection;
    var is_defined = jsgui.is_defined, tof = jsgui.tof, stringify = jsgui.stringify, each = jsgui.each;
    var fp = jsgui.fp;
    // The basic resource connector... not quite sure what it needs to do 27/02/2012.
    //  Fills in the gap conceptually.

    var Rsce = Resource;

    // Should be able to connect to pretty much any database with this (eventually).
    //  Also should have some of its own database capabilities.

    //  Should be able to set it so that it represents a specific DBMS and then it uses the appropriate resource to
    //   connect to that.

    // Should provide quite a general interface to a variety of databases.
    //  Will do Mongo, Postgres(, MariaDB)

    // If given server info, it will create a database server?
    //   May need to be given the reference to avoid a circular reference?

    // Circulate_References?

    // The Database-Server would also refer to the database I assume.

    // I think getting this working to a reasonable standard with both Mongo and Postgres would be good.

    // The base class. Will have a factory object as well.



    var Database_Resource_Factory = function(spec) {
        var type = spec.type;

        if (type == 'mongo') {
            return new Mongo(spec);

        }

        if (type == 'postgres') {
            return new Postgres(spec);

        }
    }

    return Database_Resource_Factory;

});