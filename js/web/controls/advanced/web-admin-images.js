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




if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./multi-layout-mode"],
    function(jsgui, Multi_Layout_Mode) {

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




        var Web_Admin_Images = Multi_Layout_Mode.extend({
            // Maybe should put this into a form, so that it does a form post.
            //  That could possibly be disabled.
            'init': function(spec) {
                var make = this.make;
                this._super(spec);

                this.set('dom.attributes.class', 'web-admin-images');
                this.__type_name = 'web_admin';


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









                }

            },
            'activate': function() {
                this._super();
                this.grid_9();
                this.make_full_height();
                this._context.full_window = this;
            }
        });


        return Web_Admin_Images;

    });