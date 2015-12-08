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
//var Horizontal_Menu = require('./horizontal-menu');

var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
var Control = jsgui.Control;

var group = jsgui.group;

// Titled_Panel would be useful.
//  Would extend the panel, and also show it's name or title.

// Want to keep panel simple. Could have Titled_Panel, maybe Resizable_Panel.
//  If we want a panel with a lot of functionality, it would be the Flexi_Panel.






var Panel = Control.extend({
    // panel name?

    // could have a title field.
    'fields': {
        'name': String
    },

    // maybe add before make would be better. add will probably be used more.
    'init': function(spec, add, make) {
        this._super(spec);

        this.__type_name = 'panel';

        this.set('dom.attributes.class', 'panel');

        // With name as a field, that field should get sent to the client...



        //console.log('spec.el', spec.el);

        if (!spec.abstract && !spec.el) {



            var l = 0;


            var ctrl_fields = {
            }

            var name = this.get('name').value();


            //console.log('panel name', name);

            if (is_defined(name)) {
                this._fields = this._fields || {};
                this._fields['name'] = name;
            }
            //throw 'stop';


            //



        }

    },
    //'resizable': function() {
    //},
    'activate': function() {
        // May need to register Flexiboard in some way on the client.
        this._super();

        //

    }
})

module.exports = Panel;
