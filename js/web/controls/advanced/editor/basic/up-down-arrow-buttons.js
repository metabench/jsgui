// object viewer
/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

define(["../../../../jsgui-html-enh"],
	function(jsgui) {
*/

var jsgui = require('../../../../jsgui-html-enh');
var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
var Control = jsgui.Control;

var group = jsgui.group;

var Button = require('../../button');


var Up_Down_Arrow_Buttons = Control.extend({

    // Maybe should put this into a form, so that it does a form post.
    //  That could possibly be disabled.


    'init': function(spec) {
        var make = this.make;


        this._super(spec);

        this.set('dom.attributes.class', 'up-down arrow buttons');
        this.__type_name = 'up_down_arrow_buttons';

        // Render up button and down button.

        var btn_up = new Button({
          'context': this._context,
          'text': 'up'
        });
        var btn_down = new Button({
          'context': this._context,
          'text': 'down'
        });

        this.add(btn_up);
        this.add(btn_down);

        this.set('btn_up', btn_up);
        this.set('btn_down', btn_down);


        var that = this;



    },
    'activate': function() {
        this._super();
        var that = this;
        //that.click(function(e) { that.action_select_only() })

        var btn_up = this.get('btn_up');
        var btn_down = this.get('btn_down');
        var that = this;

        btn_up.on('click', function(e_click) {
          console.log('btn_up click');
          that.raise('up');
        });

        btn_down.on('click', function(e_click) {
          console.log('btn_down click');
          that.raise('down');
        });


    }
});
module.exports = Up_Down_Arrow_Buttons;
