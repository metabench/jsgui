/**
 * Created by James on 07/02/2015.
 */

var jsgui = require('./jsgui-html-core');
var each = jsgui.eac;

var Selection_Scope = jsgui.Data_Object.extend({
//var Selection_Scope = jsgui.Class.extend({
    'init': function(spec) {
        // A selection scope belongs to a context
        //  should do
        // has its control.
        // various controls point to it.
        // has various methods to do with selecting and selecting objects


        // Could probably do these as fields.

        // Selection scope should also keep track of its context and its id.
        if (spec.context) this.context = spec.context;
        if (typeof spec.id !== 'undefined') this.is = spec.id;


        if (spec.control) this.control = spec.control;
        // Needs to be a list / map of all controls that are selected.
        // map of selected controls by id?
        //  also need to be able to go through the list of controls.
        this.map_selected_controls = {};
        // set the items by their id to point to the control.
        //  the control will know its index within its parent, can look up more info there.
    },
    'select_only': function(ctrl) {
        //console.log('Selection_Scope select_only ' + ctrl._id());

        // remove the selected class from all that are currently selected (except the target ctrl).
        //console.log('this.map_selected_controls ', this.map_selected_controls);
        each(this.map_selected_controls, function(v, i) {

            if (v && v !== ctrl) {
                v.set('selected', false);
                v.remove_class('selected');

                //console.log('should have deselcted ' + v._id())
            }
        })

        this.map_selected_controls = {};

        this.map_selected_controls[ctrl._id()] = ctrl;

        // and then tell the control that it's selected.

        // could possibly set a CSS flag.
        ctrl.set('selected', true);
        ctrl.add_class('selected');

        this.trigger('change');



    },

    // deselect controls internal to a control.

    // When selecting a control, we want to make it so that controls inside it, in the same selection context are not selected.
    //  The Selection Scope does a fair bit of the management of the selections.

    'deselect_ctrl_content': function(ctrl) {
        var cs = ctrl.get('selection_scope');
        var msc = this.map_selected_controls;
        var that = this;
        ctrl.get('content').each(function(i, v) {
            var tv = tof(v);
            //console.log('tv ' + tv);

            if (tv == 'control') {
                v.remove_class('selected');
                v.set('selected', false);

                var id = v._id();
                if (msc[id]) msc[id] = false;

                that.deselect_ctrl_content(v);
            }
        })
        //console.log('msc ', msc);
        this.trigger('change');
        //throw 'stop';
    },



    'select_toggle': function(ctrl) {
        //console.log('');
        //console.log('select_toggle');
        var sel = ctrl.get('selected');
        //console.log('tof(sel) ' + tof(sel));

        var msc = this.map_selected_controls;
        var id = ctrl._id();
        if (!sel) {


            var sel_anc = ctrl.find_selected_ancestor_in_scope();

            if (sel_anc) {
                console.log('1) not selecting because a selected ancestor in the selection scope has been found.');
            } else {
                ctrl.set('selected', true);
                // Check for a selected ancestor control in the scope.

                this.deselect_ctrl_content(ctrl);

                //  can try an iterate_ancestors function.

                //  iterate_ancestors_in_selection_scope
                //   looking for selected ancestor.

                // find_selected_ancestor_in_scope

                ctrl.add_class('selected');
                msc[id] = ctrl;
            }


        } else {
            var tsel = tof(sel);
            //console.log('tsel ' + (tsel))
            if (tsel == 'data_value') {
                var val = sel.get();
                //console.log('val ' + val);
                if (val) {
                    ctrl.remove_class('selected');
                    ctrl.set('selected', false);
                    msc[id] = false;
                } else {
                    var sel_anc = ctrl.find_selected_ancestor_in_scope();

                    if (sel_anc) {
                        console.log('2) not selecting because a selected ancestor in the selection scope has been found.');
                    } else {
                        ctrl.set('selected', true);
                        // Check for a selected ancestor control in the scope.
                        this.deselect_ctrl_content(ctrl);
                        //  can try an iterate_ancestors function.

                        //  iterate_ancestors_in_selection_scope
                        //   looking for selected ancestor.

                        // find_selected_ancestor_in_scope

                        ctrl.add_class('selected');
                        msc[id] = ctrl;
                    }
                }
                //
            }
            if (tsel == 'boolean') {

                if (sel) {
                    ctrl.remove_class('selected');
                    ctrl.set('selected', false);
                    msc[id] = false;
                } else {
                    var sel_anc = ctrl.find_selected_ancestor_in_scope();

                    if (sel_anc) {
                        console.log('2) not selecting because a selected ancestor in the selection scope has been found.');
                    } else {
                        this.deselect_ctrl_content(ctrl);
                        ctrl.set('selected', true);

                        // Check for a selected ancestor control in the scope.

                        //  can try an iterate_ancestors function.

                        //  iterate_ancestors_in_selection_scope
                        //   looking for selected ancestor.

                        // find_selected_ancestor_in_scope

                        ctrl.add_class('selected');
                        msc[id] = ctrl;
                    }
                }

            }
        }
        this.trigger('change');
        //throw 'stop';

    }
});

module.exports = Selection_Scope;