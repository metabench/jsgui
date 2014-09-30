/**
 * Created by James on 04/08/2014.
 */


/*
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html"],
function(jsgui) {
*/
var jsgui = require('../../jsgui-html');

    var stringify = jsgui.stringify, mapify = jsgui.mapify, each = jsgui.each, tof = jsgui.tof;
    var Control = jsgui.Control;
    var Collection = jsgui.Collection;
    var Data_Object = jsgui.Data_Object;

    var Item = Control.extend({

        // Items collection as a field?
        //  This would have control content items.
        //  It would / may also have a Collection of items.
        //  It would get given its items as JSON / a JS object / array, and then would create the content Controls.

        // Want it to be easy to create a list, give it the data or the data source.

        /*
         'fields': [
         //['text', String]
         ['toggle_button', Control],
         ['inner_control', Control],
         ['expander', Control]

         ],
         */


        // Also want it to be easy to include images, by key.
        //  Item could make use of an Image control.
        //  Image will enable the presentation at different sizes.
        //   Thumbnail will extend Image.

        // Both of them will refer to the Website Image Resource.
        //  Client side, they will act differently.
        //  Should be possible to download a different image, but maybe will require a client-side image index.
        // Will do more work on accessing server resources from the client in a convenient way.








        'init': function(spec, add, make) {
            this._super(spec);
            this.__type_name = 'item';
            this.set('dom.attributes.class', 'item');

            // Would have a Value.
            //  I think that should be a Data_Object.

            // I think one pattern of the Item will be as follows:
            //  Create Item, give JSON data.
            //  Listen for a change in the item.
            //   UI change, item event called, new data provided / available.
            // Item would create an automatic Model (I think).

            // -----
            // Item could be presented with a data source that has a change event.
            //  Item listens to the change event, and changes with it.

            // With a few fairly versitile classes:
            // Data_Object, Collection, Data_Value
            //  and
            // List, Item
            // We will be able to represent a wide variety of data, and have it editable within an MVC system.




            // Anyway, just want to display some data for the moment.
            // Or is spec.value a function

            console.log('spec.value', spec.value);
            console.log('t spec.value', tof(spec.value));


            //var value = new Data_Object({});

            // Defining a Data_Object, using another Data_Object as the paraneter...
            //  Need to do some more work on this.


            // A Data_Object with another Data_Object as its constructor.
            //  Clone makes the most sense. Construct by value.

            var value = new Data_Object(spec.value);

            this.set('value', value);

            // Set Data_Object using another Data_Object?
            //  I think it should copy that Data_Object's various values.
            //  Clone it's ._ if possible.
            //   Except there could be more Data_Objects and Collections there.
            //    Possibly need to add .clone code to Data_Object and Collection.






            //console.log('spec.items', spec.items);
            //throw 'stop';

            //if (spec.value) {
            //    value.set(spec.value);
            //}

            // And we need to render the value.

            console.log('value', value);

            var value_keys = value.keys();
            console.log('value_keys', value_keys);

            // id and key seem important.
            //  Then could show the others.
            //  could prioritise name


            var map_keys = mapify(value_keys);
            console.log('map_keys', map_keys);

            // Make the main part out of the name, the key, and the id.
            //  could then show some other items too, possibly type_name
            // This needs to make some sensible judgements about how to display an item.
            // I want it to have sensible defaults for displaying records, such as customer records
            //  Also want it to be easy to customise too.

            // The item will have a title row

            // I think just making the title row, then a small table of the rest would be best.

            // It's hard to make intelligent 1 size fits all rules that are also somewhat predictable.




            // Then secondary items
            // Then tertiary items
            //  Perhaps tertiary items will be hidden by default?

            // It could automatically recognise some as being of secondary importance
            //  Perhaps it would say the mime_type property is in that category.
            //   Maybe age, DOB, address/address lines.

            // Really, though, how things display depends on context.
            //  If there was a customer_id field, that would be of primary importance in the customer table.
            //   But in other tables? Maybe it would be of primary importance too.




            // id, key = primary title
            //

            // id, name or key
            //  other pieces of data

            // displaying things in a table could be OK

            // could have a simple way of saying what's displayed

            // also could choose how it's displayed.
            //  will have different, but relatively simple layouts.

            // Item Title Bar / Primary IDs

            // Supplementary item data

            var has_id = map_keys['id'];
            var has_name = map_keys['name'];
            var has_key = map_keys['key'];

            var id, name, key;

            var ctrl_primary = new Control({
                'context': this._context
            })

            this.add(ctrl_primary);

            if (has_id && has_key && !has_name) {
                id = value.get('id');
                key = value.get('key');

                console.log('id', id);
                console.log('key', key);

                var ctrl_id = new Control({
                    'context': this._context
                });
                ctrl_id.set('dom.attributes.class', 'id');
                var ctrl_key = new Control({
                    'context': this._context
                });
                ctrl_key.set('dom.attributes.class', 'key');

                // Will possibly have more code to do with rendering Data_Values as HTML, as Control content.

                ctrl_id.add(id.value());
                ctrl_key.add(key.value());

                ctrl_primary.add(ctrl_id);
                ctrl_primary.add(ctrl_key);

            }

            var ctrl_secondary = new Control({
                'context': this._context
            })






            /*

            if (map_keys.name && map_keys.key) {

            } else {
                if (map_keys.key) {


                } else if (map_keys.name) {

                } else {

                }
            }
            */






            //throw 'stop';


            //if (!this._abstract && !spec.el) {
            //}
        },

        'activate': function() {
            this._super();
        }
    });
    //return Item;
module.exports = Item;

    //return jsgui;


//});