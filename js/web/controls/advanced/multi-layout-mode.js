/**
 * Created by James on 03/08/2014.
 */
/*

if (typeof define !== 'function') { var define = require('amdefine')(module) }


// Also want to make an MDI window system (Multiple Document Interface)

define(["../../jsgui-html", "./panel"],
    function(jsgui, Panel) {
*/

var jsgui = require('../../jsgui-html');
var Panel = require('./panel');

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
    'init': function(spec) {
        this._super(spec);

        // Don't register controls on the server?


        // May be having probs with make
        var make = this._context.make;

        var context = this._context;

        this.__type_name = 'multi_layout_mode';

        this.set('dom.attributes.class', 'multi-layout-mode');
        //console.log('spec.el', spec.el);

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

            // Will have different ways of putting this together.
            //  Will be nice to have a title, but inside a header.
            var layout_mode = this.get('layout_mode').value();

            if (layout_mode) {
                this.add_class(layout_mode);
            }

            //console.log('layout_mode', layout_mode);
            //console.log('tof layout_mode', tof(layout_mode));
            //  And the main content in the fluid area...
            //   That could be a useful default of fluid-fixed.

            var panel_title = new Panel({
                'context': context,
                'name': 'title'
            })
            panel_title.add_class('title');

            var panel_navigation = new Panel({
                'context': context,
                'name': 'navigation'
            })
            panel_navigation.add_class('navigation');

            var panel_main = new Panel({
                'context': context,
                'name': 'main'
            })
            panel_main.add_class('main');

            var panel_misc = new Panel({
                'context': context,
                'name': 'misc'
            })
            panel_misc.add_class('misc');

            if (layout_mode == 'fluid-fixed') {
                // make the html like in
                //  http://www.dynamicdrive.com/style/layouts/item/css-liquid-layout-22-fluid-fixed/

                // top
                // left_wrapper
                //  left
                // right
                // bottom
                /*
                var panel_top = new Panel({
                    'context': context,
                    'name': 'top'
                })
                panel_top.add_class('top');
                */

                var panel_top = new Panel({
                    'context': context,
                    'name': 'top'
                })
                panel_top.add_class('top');

                var panel_left_wrapper = new Panel({
                    'context': context,
                    'name': 'left-wrapper'
                })
                panel_left_wrapper.add_class('left-wrapper');

                var panel_left = new Panel({
                    'context': context,
                    'name': 'left'
                })
                panel_left.add_class('left');

                var panel_right = new Panel({
                    'context': context,
                    'name': 'right'
                })
                panel_right.add_class('right');

                var panel_bottom = new Panel({
                    'context': context,
                    'name': 'bottom'
                })
                panel_bottom.add_class('bottom');
                // will expose, top, left, right, bottom


                this.add(panel_top);
                this.add(panel_left_wrapper);
                panel_left_wrapper.add(panel_left);
                this.add(panel_right);
                this.add(panel_bottom);

                panel_top.add(panel_title);
                panel_bottom.add(panel_navigation);
                panel_left.add(panel_main);
                panel_right.add(panel_misc);



            } else {


                this.add(panel_title);
                this.add(panel_navigation);
                this.add(panel_main);
                this.add(panel_misc);


            }

            this.set('title', panel_title);
            this.set('navigation', panel_navigation);
            this.set('main', panel_main);
            this.set('misc', panel_misc);


            // 2-col-left-main-right-misc
            //
            // 2-col-left-main
            //  misc on right
            //  (navigation)
            // fluid-fixed
            //  could have fixed-fluid as well
            // top, bottom, left, right
            //  and will position the various logic parts within those layout parts.

            // top     title
            // left    main
            // right   misc/tools
            // bottom  (nav) - don't think we will have nav in this view

            // So choose the layout view, then assign items in the logical view to the areas of the layout
            //  Automatic assignment of both the layout view and the logical view
            //  layout_mode fluid-fixed, {}
            /*
            // I think a string layout mode makes sense.
            not like: layout_mode: {
                'left': fluid
            }
            // The string layout mode will specify which construction code to use.
            //  May be nice with je suis xml.
            // After the string layout mode, the logical items get placed into the layout areas.

            // layout_mode: 'fluid-fixed'
            // layout_locations: {
                'left': 'main',
                'right':
            }
             */
            // layout_mode:
            //
            //   I think navigation may be built into the main part as well as the part on the right.
            // 2-col-right-main

            // Set this up so that there are different components / controls that can be positioned in different ways.
            // Changing the positioning layout will be done through the Multi_Layout_Control.

            // In general, there are 3 types of areas:
            //  navigation, content, misc
            //  can't call it content for the moment though.
            //   content is the collection.
            //   call it view? but then it's not edit
            //   main?
            //    main seems best.

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

            // Would like a way of disabling some of these?
            //  Or would navigation panel be useful in many cases, and just disable / hide the panel when it's not needed.


            // For the moment, just want 4 simple panels. (01/10/2014 adding a 'title' panel)


            // Having control fields here could be useful.
            /*
            var ctrl_fields = {
                'title': panel_title._id(),
                'navigation': panel_navigation._id(),
                'main': panel_main._id(),
                'misc': panel_misc._id()
            };
            */

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
module.exports = Multi_Layout_Mode;


/*
        return Multi_Layout_Mode;
    }
);
    */
