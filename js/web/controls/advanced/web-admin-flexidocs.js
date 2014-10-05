/**
 * Created by James on 30/09/2014.
 */

/**
 * Created by James on 04/08/2014.
 */
// Maybe make this into a page control.
//  That means it will always take up the whole page or be full screen in a window if suitable.

// Likely to be done with some more general purpose administration of resources.

// Will probably replace this with something using the flexible layout system.
//  Different internal controls / systems for navigation and viewing, all within a fairly standard and powerful control that
//   handles things this control will have in common with other browse + view/edit controls.
//   navigation area, content area, data and command area
//   left panel       right panel   ribbon on bottom of right panel
//   hidden on left   full          hidden on bottom
// That system will allow controls to work neatly on different screen sizes, allowing for any one of them to be like a simple mobile app.


/*

 if (typeof define !== 'function') { var define = require('amdefine')(module) }

 define(["../../jsgui-html", "./multi-layout-mode", "./list"],
 function(jsgui, Multi_Layout_Mode, List) {
 */

var jsgui = require('../../jsgui-html');
var Multi_Layout_Mode = require('./multi-layout-mode');
var List = require('./list');
var Button = require('./button');


var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
var Control = jsgui.Control, Page_Control = jsgui.Page_Control;

// Another type of control? - composite or basic-composite?
//  That would be an unenhanced Login control. Made up of basic controls, will render and
//   be useful on very limited platforms.

// Since this is now an advanced control...

// Not sure how much this will need to use a web content / web content structure resource.
//  The resource may simplify making the DB calls, providing a structure so that web content can be
//  got and set,

// Multi_Layout_Mode will make responsive design easier.
//  It will increase the separation between the workings of components and the modes they are presented in.

// By default the multi layout mode will appear as:
// Left nav column
// Center and right main area for content, with ribbon at the bottom for the misc area.


//

// jsgui.button - a control for the button HTML element
// jsgui.Button - a more advanced button that can render in different ways.



var Web_Admin_Flexidocs = Multi_Layout_Mode.extend({



    'fields': {
        'web_admin': Object
    },

    // Maybe should put this into a form, so that it does a form post.
    //  That could possibly be disabled.
    'init': function(spec) {

        this._super(spec);

        // The make function has been having problems there.
        //  Looks like I need further testing on the make function.

        //var make = this._context.make;


        var that = this;

        this.set('dom.attributes.class', 'web-admin-flexidocs');
        this.__type_name = 'web_admin_flexidocs';

        if (!spec.el) {

            // we address various parts of the multi layout system.
            // navigation
            // content
            // data & command
            //  may want a better name for the data & command area
            //   misc

            // navigation, content, misc

            // will do get to get the various parts of the control.
            //  component controls

            // For the moment, just want to be showing the list of the images in the navigation section.

            // navigation.set('data', arr_images);
            // content.set(arr_images[0]);

            var navigation = this.get('navigation');
            var main = this.get('main');
            var misc = this.get('misc');


            // We put a list of images in the navigation panel.

            // I think a List control would be useful for this.
            //  Nice to have something that represents a list. Probably not going to use LI's?
            //  Control_List?
            // Just call it List?
            //  And it could possibly render UL, OL, LI
            // But it's a List rather than a Tree, it could be relatively easy to use common comonents,
            //  could possibly use tree nodes in a list.

            // list.set(json_data), and it displays that JSON properly and has the right UI events and responses.

            // This should probably hook into the website admin resource.
            //  When on the client, it will either have to use a REST interface, or a data binding abstraction that
            //   allows it to communicate with the resource.

            //throw 'stop';

            //var web_admin = this.get('web_admin');
            // Needs the web admin resource?
            //  Can it be got from the pool?
            //  Can this access the pool itself to get the web_admin Resource?

            console.log('this._context', this._context);
            //throw 'stop';
            var pool = this._context.pool;
            var web_admin = pool.get_resource('Web Admin');



            console.log('web_admin', web_admin);

            this.__status = 'waiting';

            web_admin.get_flexidocs_list(function(err, res_flexidocs) {
                if (err) {
                    throw err;
                } else {

                    // This is asyncronous...
                    //  need to delay the rendering.



                    console.log('res_flexidocs', res_flexidocs);


                    // Only active when it's loaded?

                    // Really do want this to be active....
                    // navigation
                    //  show the list in the navigation section.

                    // I think we create a new List component, set its data, add it to the navigation.

                    // List will be expecting a bunch of items.
                    //  .items in the spec.
                    // Perhaps could receive an array as the spec, except it still needs the context.

                    // Want to add an actual thumbnail image here.
                    //  Want to refer to an image, get its thumbnail.
                    //   Could be a thumbnail already.




                    // Quite simple, a list of images.
                    //  Displays the info within a List.

                    // Each item is rendered as a list, as it contains multiple properties.

                    var ctrl_list = new List({
                        'context': that._context,
                        'items': res_flexidocs
                    });

                    navigation.add(ctrl_list);

                    // want the images to be deletable.
                    //  could have the list joined to a data model, and listen for changes in that.
                    //  the item would get deleted in the list (or deleteAttempt event occurs)
                    //   and then outside of the list UI there can be confirmation that the delete can be done, or is pending
                    //   then when the delete is done outside of the list, we get confirmation to delete it in the list.

                    // have a context menu with delete, for a list, by default.

                    // button for new flexidoc.

                    var btn_new = new Button({
                        'context': that._context,
                        'text': 'New'
                    });
                    misc.add(btn_new);

                    // But only when the button is activated, does it do something.

                    // need to use the ctrl_fields system for this.

                    var ctrl_fields = {
                        'btn_new': btn_new._id()
                    };
                    that.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));


                    // then when it's clicked, create a new one, and open it in a new tab.
                    //  find the URL for the new flexidoc.
                    //  or it will just be /admin/new-flexidoc/

                    // Will have a user interface for the flexidoc.


















                    //throw 'stop';







                    that.active();

                    that.__status = 'ready';
                    that.trigger('ready');

                    //throw 'stop';
                }
            })

            /*
             resource.get(function(err, data) {
             if (err) {
             throw err;
             } else {

             if (tof(data) == 'object') {

             }

             console.log('name', name);

             that.set('dom.attributes.data-jsgui-resource-name', name);
             that.active();

             that.__status = 'ready';
             that.trigger('ready');

             }
             });
             */






            //var images_list =










        }

    },
    'activate': function() {
        this._super();
        this.grid_9();
        this.make_full_height();
        this._context.full_window = this;


        var btn_new = this.get('btn_new');
        console.log('btn_new', btn_new);
        //throw 'stop';

        var open_in_new_tab = function(url) {
            var win = window.open(url, '_blank');
            win.focus();
        }

        btn_new.on('click', function(e_click) {
            console.log('button click');
            // open /admin/new-flexidoc/ in a new tab
            open_in_new_tab('/admin/new-flexidoc/');
        });

    }
});
module.exports = Web_Admin_Flexidocs;


//return Web_Admin_Images;

//});