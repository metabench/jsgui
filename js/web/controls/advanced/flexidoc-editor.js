/**
 * Created by James on 01/10/2014.
 */
/**
 * Created by James on 30/09/2014.
 */

/**
 * Created by James on 04/08/2014.
 */


var jsgui = require('../../jsgui-html');
var Multi_Layout_Mode = require('./multi-layout-mode');
var List = require('./list');
var Button = require('./button');

var Flexidoc_Editor_Main = require('./flexidoc-editor-main');

var Flexidoc_Component_Text = require('./flexidoc-component-text');
var Flexidoc_Component_Image = require('./flexidoc-component-image');


var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
var Control = jsgui.Control, Page_Control = jsgui.Page_Control;

// Much of this will be client-side, but will do a decent rendering server-side.

// May be worth making Flexidoc_Editor_Main
//  That would have the various containers.
//  It would start with one container
//   The user would then drag something (such as a text box) from the tools / misc area, into the container.







var Flexidoc_Editor = Multi_Layout_Mode.extend({
    //'fields': {
    //    'web_admin': Object
    //},

    // Maybe should put this into a form, so that it does a form post.
    //  That could possibly be disabled.
    'init': function(spec) {

        this._super(spec);

        var that = this;

        this.set('dom.attributes.class', 'flexidoc-editor');
        this.__type_name = 'flexidoc_editor';

        if (!spec.el) {


            var navigation = this.get('navigation');
            var main = this.get('main');
            var misc = this.get('misc');


            //console.log('this._context', this._context);
            //throw 'stop';
            var pool = this._context.pool;
            var web_admin = pool.get_resource('Web Admin');

            // and if it's on the server only?

            this.active();

            var editor_main = new Flexidoc_Editor_Main({
                'context': this._context
            });

            main.add(editor_main);

            // in the misc area, add the components list
            //  we drag components over from that area to the container.

            // have text, image components for the moment
            //  will have some others, such as video and audio
            //  could have a flexidoc component?

            // though this is a flexidoc editor, it's really for editing a page at the moment.
            //  could make it so it stores different types of data in the flexidoc

            var ctrl_blank_components = new Control({
                'context': this._context
            });
            ctrl_blank_components.add_class('blank-components');

            misc.add(ctrl_blank_components);

            var blank_fc_text = new Flexidoc_Component_Text({
                'context': this._context,
                'mode': 'icon'
            });

            ctrl_blank_components.add(blank_fc_text);


            var blank_fc_image = new Flexidoc_Component_Image({
                'context': this._context,
                'mode': 'icon'
            });

            ctrl_blank_components.add(blank_fc_image);

            var ctrl_fields = {
                'blank_fc_text': blank_fc_text._id(),
                'blank_fc_image': blank_fc_image._id(),
                'editor_main': editor_main._id()
            };
            that.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));

            // And the blank components need to be draggable.






            // add a text component and image component.

            // they would be actual blank components, and in an 'icon' or 'micro' display mode.



            // flexidoc-component-text
            // flexidoc-component-image







            //console.log('web_admin', web_admin);

            /*


            this.__status = 'waiting';

            web_admin.get_flexidocs_list(function(err, res_flexidocs) {
                if (err) {
                    throw err;
                } else {

                    console.log('res_flexidocs', res_flexidocs);
                    var ctrl_list = new List({
                        'context': that._context,
                        'items': res_flexidocs
                    });

                    navigation.add(ctrl_list);

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
                    that.active();

                    that.__status = 'ready';
                    that.trigger('ready');

                    //throw 'stop';
                }
            })

            */

        }

    },
    'activate': function() {

        this._super();

        var blank_fc_text = this.get('blank_fc_text');
        var blank_fc_image = this.get('blank_fc_image');
        var editor_main = this.get('editor_main');


        // Really that's on activation though.

        // Need to get the ghost-copy system
        //  Requires Control cloning functionality
        //   requires a temporary id?
        //    could use an id like control_8_clone_0
        //     would allow multiple clones of a control set with default names.
        //     then the clones could have lower opacity / have a cover that is translucent white.

        var measured_client_offsets;

        var y_is_above_first = false;
        var y_is_below_last = false;
        var y_is_between_containers;
        var y_between_containers; // [1,2]
        var y_is_within_container;
        var y_within_container;

        var found = false;

        var ghost_clone;




        var blank_fc_options = {
            'mode': 'ghost-copy',

            'start': function(e_move) {


                console.log('flexidoc-editor dragstart blank flexidoc component from toolbox', e_move);

                // e_move says which control was moved?

                var move_start_control = e_move.control;
                console.log('move_start_control', move_start_control);



                // And code for displaying it on the grid

                // Should have a dragstart event to cache the location of containers / components.
                // We can do that here.

                // Go through the existing containers, get their positions in the client view.

                // Could use getClientBoundingRect
                //  Possibly also look into the padding.

                measured_client_offsets = editor_main.measure_client_offsets();
                console.log('measured_client_offsets', measured_client_offsets);

                // The create ghost clone functionality will be a little complex, but simple to call from here.

                // .absolute_ghost_clone

                ghost_clone = move_start_control.absolute_ghost_clone();





                // see if we are dragging it over the grid / editor



            },
            'move': function(e_move) {
                console.log('flexidoc-editor dragmove blank flexidoc component from toolbox', e_move);

                // see if it's within any of the measured client offsets.

                // And code for displaying it on the grid

                // Should have a dragstart event to cache the location of containers / components.

                // Will have other features, such as setting background images of containers.

                found = false;

                console.log('measured_client_offsets[0]', measured_client_offsets[0]);

                if (e_move.clientY < measured_client_offsets[0].bounding_client_rect.top) {
                    y_is_above_first = true;
                    y_is_below_last = false;
                    y_is_between_containers = false;
                    y_between_containers = null;
                    y_is_within_container = false;
                    y_within_container = null;


                    found = true;

                } else {
                    y_is_above_first = false;

                    // go through the measured positions, seeing which container it's within.

                    var prev_offset_info;

                    each(measured_client_offsets, function(i_container, container_offset_info) {
                        console.log('container_offset_info', container_offset_info);

                        // is it above the start of this, but not above the start of the previous?

                        //if (prev_offset_info) {

                        //}

                        // is it within?

                        if (e_move.clientY >= container_offset_info.top && e_move.clientY <= container_offset_info.bottom) {
                            // it's within.
                            y_is_below_last = false;
                            y_is_between_containers = false;
                            y_between_containers = null;
                            y_is_within_container = true;
                            y_within_container = i_container;

                            found = true;
                        }


                        prev_offset_info = container_offset_info;



                    });



                    // see if it's vertically within any of them

                    // or between any of them.

                    // will also want to know if it's within certain margins of the top or bottom.

                    // (also need to get the clone control / ghost working)
                    //   then show empty controls within the area they will be placed
                    //

                    
                }

                console.log('found', found);


                if (found) {
                    console.log('found', found);
                    console.log('y_is_above_first', y_is_above_first);
                    console.log('y_is_below_last', y_is_below_last);
                    console.log('y_is_between_containers', y_is_between_containers);
                    console.log('y_between_containers', y_between_containers);
                    console.log('y_is_within_container', y_is_within_container);
                    console.log('y_within_container', y_within_container);

                    //var y_is_above_first = false;
                    //var y_is_below_last = false;
                    //var y_is_between_containers;
                    //var y_between_containers; // [1,2]
                    //var y_is_within_container;
                    //var y_within_container;
                }

                /*

                each(measured_client_offsets, function(container_offsets) {
                    console.log('container_offsets.bcr', container_offsets.bcr);

                    // compare the clientY

                    //if (e_move.clientY < )


                })
                */



                // see if we are dragging it over the grid / editor



            }
        }

        blank_fc_text.draggable(blank_fc_options);
        blank_fc_image.draggable(blank_fc_options);

        // And define events for when they pass over certain areas
        //  Or have something that does calculations whenever they move



        /*

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
        */

    }
});
module.exports = Flexidoc_Editor;