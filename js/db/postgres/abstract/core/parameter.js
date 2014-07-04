/**
 * Created by James on 28/06/2014.
 */



if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


define(["../../../../core/jsgui-lang-enh"], function(jsgui) {

    var Data_Object = jsgui.Data_Object;
    var Collection = jsgui.Collection;

    var Class = jsgui.Class, arrayify = jsgui.arrayify, fp = jsgui.fp, is_defined = jsgui.is_defined;
    var tof = jsgui.tof, is_defined = jsgui.is_defined, each = jsgui.eac, stringify = jsgui.stringify, arrayify = jsgui.arrayify, mapify = jsgui.mapify;
    var get_item_sig = jsgui.get_item_sig;

    //var Schema = require('./schema');

    var Parameter = Data_Object.extend({
        'init': function(spec) {
            this._super(spec);

            // will be able to create these from the INFORMATION_SCHEMA.parameter rows.
            // These parameters will likely get more properties to match the information_schema.
            //  Will provider a simpler API than information_schema though.

            //this.name = spec.name;

            //  This property will probably be made to follow the Postgres data type.
            //   Will have more about data correction in an automatic way with Data_Object.
            // These parameters will be looked at, perhaps indexed. Will be used in code analysis.

            // Also want to be able to call the functions found in the database quite soon,
            //  but a bit of analysis on the functions will help determine that the right ones are being called.
            // More code on the bridge, and then things will work very smoothly.

            // Also want to make permissions part of the DB from the abstract web db.
            //  Function analysis should also understand permissions.

            // This will be able to set up and use web databases very quickly.

            // Want it so that parameters are used correctly when creating rows.
            // Would also be able to use language to identify what functions do, functions called create_[item_name] being relatively obvious.
            //  After this, calling the functions won't be so difficult, should be quite easy to do from JavaScript and therefore the web.

            // Then dealing with permissions will be put into the database / database design.
            //  This won't be integral to abstract-postgres (or parsing)
            //  Will be a major part of the abstract-web-db-postgres system.
            // May get permissions / general objects to follow a specific pattern accross databases.

            // Object ownership - each documents object is owned by a user or group (owner)
            //  Users and Groups each have their OwnerID, as they are Owners.
            // May involve a few tables and functions to get working, but then will have a general system for assigning ownership.
            //  Superuser will have override.
            //  Ownership changes can be rejected too (but they are deemed to be acceptable if they were requested rather than given)
            // Group ownership - what that means in particular depends on the group's rules.
            //  Maybe only the group admins can make ownership changes.
            //  Group mechanics can be explored further once the individual users system is working.
            //  Keep track of which users are members of which groups. Also which roles they perform within the group.
            //   That is fairly important so that a normal user of the site could be an / the administrator of a group.
            // A new table of roles for each group?
            //  So that a group could have a 'Games Master' role that gets defined.
            //  Or 'Recycling Manager'
            // Group has some default roles anyway, 'administrator' and 'member'
            //  Could work with them, but also have
            //  Group_Additional_Roles  id, name

            // When all that is done, object ownership could be established for various pieces of content on the website.
            //  Will provide a useful basis for recording permissions
            //  The owner has almost full permissions
            //  The owner can assign permissions to other owners (users and groups)
            //   When an operation is attempted, the system checks to see if its done by the owner
            //    Or if they have any specific permissions
            //    Or if they are a member of a group that has permission
            //   Will be a few lookups of indexed records.

            // Then, a huge amount more could be done on the front-end, using a relatively simple but versitile API.
            //  A file manager, and all the management tools that are needed for content on a website.
            //  The XML editor tool could progress more rapidly when there are actually XML / HTML files to edit.
            //   It could also be very useful for editing small pieces of content.

            // These things will all work very well when they are using the right components.
            //  It will all work seemlessly and provide an interface for administering a server/servers
            // Services on the servers will be exposed through the Resource interface.
            // Things will be done within an abstraction, not all that much code will be needed.
            //  Won't be massively difficult.
            //  Want the website up before too long... need to get these various things working.

            // Loading parameters from information_schema is that thing.
            //  After that, a bit of function analysis
            //  Perhaps parsing of functions.
            //   Then more advanced function analysis
            //  Finding the functions that add rows seems important.
            //  Query the (abstract) DB to get, for each table, the function that adds a row
            //   All of the functions that add a row, including functions that have a shortcut using a lookup.
            //   Also want to get the shortcut / overloaded generated functions working using the lookup.
            //    Will make programming a bit more convenient to have these, and will be useful to have the option of creating them in the middleware.

            // Will be able to call Postgres functions from the web interface without too much difficulty.
            //  Will be very nice to have solid GUI tools built that make use of the back-end.
            //  More options for storing and modifying the presentation layer.
            // I think various (admin) tools will be able to be put in as components.
            //  Could maybe make tools that use the API like a music file mixing tool, and would use the permissions API like an admin tool.
            //   Would be able to save created files / sequences to the server.

            var is_info_schema_row = (is_defined(spec.specific_schema) && is_defined(spec.specific_schema) && is_defined(spec.parameter_mode) && is_defined(spec.as_locator));
            //console.log('');
            //console.log('');
            //console.log('is_info_schema_row ' + is_info_schema_row);
            //console.log('spec ' + stringify(spec));

            if (spec.specific_schema && spec.specific_schema && spec.parameter_mode && spec.as_locator) {
                this.load_from_information_schema_row(spec)
            } else {
                this.set('name', spec.name);
                // or could hold a full data_type object.
                //this.str_data_type = spec.str_data_type;
                this.set('str_data_type', spec.str_data_type);
            }


        },
        'load_from_information_schema_row': function(information_schema_row) {
            console.log('param information_schema_row ' + stringify(information_schema_row));
            // specific_schema, specific_name, ordinal_position, parameter_mode, is_result, as_locator, data_type,
            //  could maybe have a parameter name when its a differen language and the specific name is not used.
            this.set('specific_schema', information_schema_row.specific_schema);
            this.set('specific_name', information_schema_row.specific_name);
            this.set('ordinal_position', information_schema_row.ordinal_position);
            this.set('parameter_mode', information_schema_row.parameter_mode);
            this.set('is_result', information_schema_row.is_result);
            this.set('as_locator', information_schema_row.as_locator);
            this.set('udt_name', information_schema_row.udt_name);


            //console.log('information_schema_row ' + stringify(information_schema_row));
        },

        'toString': function() {
            // a function to get the data type as a string.
            //  data type could be held in a different waym including as the results of INFORMATION_SCHEMA.

            // will deal with the data type differently, maybe use the information_schema system if that data is there.

            return this.get('name') + ' ' + this.get('str_data_type');



        }

        // not sure about this.
        /*
         'get_signature': function() {
         console.log('this.str_data_type ' + this.str_data_type);


         if (this.str_data_type.indexOf('char') > 0) {
         return 's';
         } else if (this.str_data_type.indexOf('int') > 0) {
         return 'i';
         }

         }
         */
    });


    return Parameter;
});



