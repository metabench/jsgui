/*
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./item"],
    function(jsgui, Item) {
*/

var jsgui = require('../../jsgui-html');
var Item = require('./item');

        var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
        var Control = jsgui.Control;
        var Collection = jsgui.Collection;

        // will have a context menu by default

        var List = Control.extend({

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

            'init': function(spec, add, make) {
                // Wont fields have been set?


                console.log('init list');

                this._super(spec);

                var that = this;

                // Can take an image
                // Can take some text.
                //  That's all I'll have in the tree node for now.
                this.__type_name = 'list';

                this.set('dom.attributes.class', 'list');

                // a Collection of items.

                // Collection not needing a Context?
                //  Having all Data_Objects and Collections require a context seems too much.
                //  Context seems important in the case of Controls.
                var coll_items = new Collection();
                this.set('items', coll_items);

                console.log('spec.items', spec.items);
                //throw 'stop';

                if (spec.items) {
                    coll_items.set(spec.items);
                }

                // The list spec could also take info about how to display the items.

                // And create a new item control for each item.
                //  I think an 'item' control could be quite useful. Shows some data.
                //   Won't be too big, but will be flexible in what it can do.

                // Will take some JSON, and render it using sensible defaults.
                //  Eg name first and in bold.
                //  Maybe key
                //

                // A general purpose item control will be quite useful.
                //  Item will be fairly general purpose, and much of the purpose of using it is to show intent rather than because of
                //  an 'item' doing particular things. It just is. It will be like a control, except it's generally used for rendering some particular data.
                // Want the Item and the List to be convenient UI components. They need to make it simple to represent some data.
                //  Items and Lists could potentially use templates to quickly render data.



                coll_items.each(function(i, item) {
                    console.log('item', item);

                    var ctrl_item = new Item({
                        'context': that._context,
                        'value': item
                    })

                    that.add(ctrl_item);


                })

                // Now that item has been made into a Data_Object.
                //  That means it has more MVC capabilities.
                //  Hopefully that automatic transformation will be useful.

                //throw 'stop';







                if (!this._abstract && !spec.el) {


                }
            },

            'activate': function() {
                this._super();

                // put the context menu in place.

                //throw 'stop';


                this.context_menu({
                    'Delete': function() {
                        console.log('context_menu Delete');

                        // need to actually delete it if possible?

                    },
                    'Edit': function() {
                        console.log('context_menu Edit');

                        // need to actually delete it if possible?


                    }
                })


            }
        });


module.exports = List;
        //return List;

        //return jsgui;


    //});