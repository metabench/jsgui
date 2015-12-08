/**
 * Created by James on 04/08/2014.
 */

/*

 if (typeof define !== 'function') { var define = require('amdefine')(module) }


 // Also want to make an MDI window system (Multiple Document Interface)

 define(["../../jsgui-html", "./horizontal-menu"],
 function(jsgui, Horizontal_Menu) {
 */

var jsgui = require('../../jsgui-html');
var Radio_Button_Group = require('./radio-button-group');
var Panel = require('./panel');

var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof, is_defined = jsgui.is_defined;
var Control = jsgui.Control;
var fp = jsgui.fp;

var group = jsgui.group;

// And the tab buttons act as radio buttons.
//  Having a JSGUI radio button replacement would be nice.
//   Could choose whether to render as a radio button and progressively enhance on the client...
//    Client-side enhancement of semantic HTML.

//   Or render as it appears on the client?
//    Being able to handle both would be nicest.
//    Possibly radio buttons could have good styling on modern clients anyway?
//    May want them to look very different to normal radio buttons though, eg using them for tabs.


// RadioButtonGroup could be a useful Control as well.
//  May provide an easier interface that abstracts away from having to directly make some of the controls.


var Tabs = Control.extend({
    // panel name?

    // could have a title field.

    // Give the different tabs individual names and labels.



    'fields': {
        'name': String,
        'tabs': Array
    },

    // maybe add before make would be better. add will probably be used more.
    'init': function(spec, add, make) {
        console.log('init Tabs');
        this._super(spec);

        this.__type_name = 'tabs';

        this.set('dom.attributes.class', 'tabs');
        //console.log('spec.el', spec.el);

        //console.log('init Tabs');
        var context = this._context;
        var that = this;

        if (!spec.abstract && !spec.el) {

            // The tab bar
            //  (the main display area)
            //  separate panels to be hidden or shown.
            //  Needs to link the radio buttons to the panels somehow.
            //  Best to use the index of the button? Or buttons could be rearranged?
            //   Then reindex?

            // Each button has got corresponding panel.
            //  ???
            //  While using the RadioButtonGroup abstraction?

            // Make a Radio_Button_Group that

            // Each tab will have either a combined name and label, or two properties.
            //  Two properties would be much better for internationalization.
            //  label_text.


            var tabs = this.get('tabs').value();

            var rbg_items = [];

            // Then make the separate panels.
            var panels = [];
            var t_panel;

            each(tabs, function(tab) {
                console.log('tab', tab);

                var t_tab = tof(tab);
                console.log('t_tab', t_tab);

                if (t_tab === 'string') {
                    rbg_items.push(tab);
                    // Want to set a name property of the panel.
                    // That name property would need to be sent to the client as well.

                    // Make it so that name is a field of the panel that can be sent to the client.




                    t_panel = new Panel({
                        'context': context,
                        'name': tab
                    });
                    t_panel.add_class('hidden');
                    panels.push(t_panel);
                };

            })

            var rbg = new Radio_Button_Group({
                'context': context,
                'items': rbg_items
            });
            rbg.add_class('horizontal');
            this.set('rbg', rbg);

            this.add(rbg);

            // Would be worth having a collection / control collection of panels.
            //  Better built in referencing and preservation of references (probably)
            //   Will be possible to transfer such a collection to the client. Not so easy just with an array.

            // Having a Collection of Controls does make sense here.
            //  May raise new challenges to do with sending that Collection to the client.


            // Could assign jsgui-index values to the panels?

            each(panels, function(panel) {
                that.add(panel);
            });


            /*
             var ctrl_fields = {
             'ctrl_relative': div_relative._id(),
             'title_bar': title_bar._id()
             }


             this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));
             */


        }
    },

    'panel': fp(function(a, sig) {
        if (sig === '[n]') {
            var res = this.get('content').get(a[0] + 1);
            return res;
        }
    }),

    //'resizable': function() {
    //},
    'activate': function() {

        console.log('1) Activate Tabs');

        if (!this.__active) {

            console.log('2) Activate Tabs');


            var that = this;
            this._super();

            var prev_showing_panel, showing_panel;

            var rbg = this.get('rbg');
            rbg.on('change', false, function(e_change) {
                //console.log('e_change', e_change);

                var checked_index = e_change.checked._index;

                prev_showing_panel = showing_panel;
                showing_panel = that.panel(checked_index);
                if (prev_showing_panel) prev_showing_panel.hide();
                showing_panel.show();

                // and raise a change event here.

                // And want to have the panel name.

                var panel_name = showing_panel.get('name');
                e_change.tab_name = panel_name + '';
                that.raise('change', e_change);


            });
            // Listen to changes in the rbg.
        }
        //
    }
})

module.exports = Tabs;
/*
 return Panel;
 }
 );
 */
