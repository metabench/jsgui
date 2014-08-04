/**
 * Created by James on 03/08/2014.
 */


if (typeof define !== 'function') { var define = require('amdefine')(module) }


// Also want to make an MDI window system (Multiple Document Interface)

define(["../../jsgui-html", "./horizontal-menu"],
    function(jsgui) {

        var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
        var Control = jsgui.Control;

        var group = jsgui.group;

        // Extensions of inner frames within inner frames...
        //  The relative frame container, which has an inner frame. Then if something extends that, it would be good for that
        //  to have an inner_control of its own and seamlessly expose that one while using the one above that.

        // Relate the inner_control more to that level of the control heirachy.
        //	Then make it so that they are navigable in sequence.
        //  Not for the moment though.
        //  I'll just have the Window control contain a relative div.


        //var Relative_Frame = Control.

        var Multi_Layout_Mode = Control.extend({

            // could have a title field.
            //'fields': {
            //	'title': String
            //},

            'fields': {
                'layout_mode': String
            },


            // maybe add before make would be better. add will probably be used more.
            'init': function(spec, add, make) {
                this._super(spec);

                this.__type_name = 'multi_layout_mode';

                this.set('dom.attributes.class', 'multi-layout-mode');
                console.log('spec.el', spec.el);

                // Basically, needs the:
                //  Navigation
                //  Content
                //  Metadata and Commands

                // Will make it easy to switch between and to use various different layout views.
                //  There will be controls built using this, that would have various different navigation, content, and metadata+commands controls inside them
                //   Will be nice to have encapsulation of these different things.

                // Will be making a Website Images Admin Control first.
                //  Will view list / tree of images on the left
                //  Will view the image itself on the right
                //  The metadata and commands will appear in a fairly small ribbon at the bottom.




                if (!spec.abstract && !spec.el) {
                    // Set this up so that there are different components / controls that can be positioned in different ways.

                    // Changing the positioning layout will be done through the Multi_Layout_Control.

                    // In general, there are 3 types of areas:
                    //  navigation, content, misc
                    // Some will get hidden / shown / shrunk / expanded at different times.

                    // Basically want this Control to have three subcontrols.
                    //  They will either get put within frames, or will have extensive functionality in this control to rearrange them

                    // These 3 controls could be a normal control or a Panel control.
                    //  Panel could have more docking functionality
                    //  Code to help with layout, splitting a panel and assigning some of it to another panel.

                    // Panels could also have resize capabilities
                    //  I think the Panel abstraction would be a useful one to make.
                    // Control is only really supposed to have HTML stuff and the foundation for more functionality.
                    // Panel would be implementing something more particular, so I think it's best to keep this functionality out of Control.

                    // Panel could wind up being quite useful and versitile.
                    //  Keeping Panel code in a Panel module would help to prevent the Control file becoming more complicated.


                    // Want to be able to use panels to specify layouts using numbers, outside of CSS.
                    //  Will do some maths.

                    









                    // Perhaps should make 3 different control classes.
                    //  Panel controls would be a bit limited in what they do / are for, and what UI components they include.
                    //  Navigation_Panel
                    //   Shows list of items, search, filter
                    //  Content_Panel
                    //   The content, should be nothing else
                    //  Misc_Panel
                    //   Metadata about the





                }

            },
            'activate': function() {
                // May need to register Flexiboard in some way on the client.
                this._super();

                // Will need to be able to rearrange the layout.




            }


            //,
            // Takes on the menu of the maximized window (for the moment).
            //  Could have its own menu possibly
            //'menu': function(menu_spec) {


            //}
        })

        return Multi_Layout_Mode;
    }
);