// object editor

/*
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../../../jsgui-html-enh", "../../viewer/basic/number"],
	function(jsgui, Number_Viewer) {
		*/

// This number editor will be used in different contexts.
// Would be nice to use in a properties editor.

// The properties editor could modify a data_object's fields.



var jsgui = require('../../../../jsgui-html-enh');
var Number_Viewer = require('../../viewer/basic/number');
var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
var Control = jsgui.Control;


// Could have arrows to adjust the numbers
//  Could also listen to the scroll wheel on the mouse.

var Up_Down_Arrow_Buttons = require('./up-down-arrow-buttons');



var Number_Editor = Number_Viewer.extend({

    // Maybe should put this into a form, so that it does a form post.
    //  That could possibly be disabled.


    'init': function(spec) {
        var make = this.make;


        this._super(spec);

        this.set('dom.attributes.class', 'number-editor');
        this.__type_name = 'number_editor';

        var udab = new Up_Down_Arrow_Buttons({
          'context': this._context
        });
        this.add(udab);

        this.set('up_down_arrow_buttons', udab);



        // let's just try adding the up and down arrow buttons.






        // Need to show the number, like with number viewer.

        // Number editor - can have up and down arrows.


        // Should have some up/down arrows for adjustment.
        //  Will be fairly simple, and use a specific internal control.

        // Up_Down_Arrow_Buttons
        //  will raise events, this control will listen to those events and adjust its value, raising events appropriately itself.
        //  eg change

        // Separate tests of the up/down arrow buttons?














        // when the object changes, we re-render.
        //  Not sure about re-rendering the whole thing though.

        // Then when it is selected, have it listen for keyboard events?
        //  Or have some larger / wider keyboard event listener that sends the events to this?

        // I think having this listen to the doc's keyboard events when it is selected makes sense.

        // Could have some events that respond to it being selected (and deselected).


        //this.set('dom.attributes.contenteditable', 'true');
        // Not so fast... not sure contenteditable is the way.



        // I think it should also look out for keyboard events (when activated).
        //  Only when it has the focus will it need to pay attention to these keyboard events.
        //   It could have some real-time validation that prevents invalid values.





    },
    'activate': function() {
        this._super();

        var udab = this.get('up_down_arrow_buttons');
        var that = this;

        // And when the value gets changed, we need to update it in the DOM.
        //  How automatic should that data binding be?

        // Need to be able to listen for the value change???
        //  With value automatically set to be a Data_Value, because it was set as a field?

        




        // Should be able to adjust the value of the number.

        // Getting and setting the 'value' of this numbered control is proving difficult.

        udab.on('up', function() {
          console.log('arrow button up');
          var val = that.get('value');
          console.log('val', val);

          //var v = that.value();
          //console.log('v', v);

          that.set('value', val + 1);

        });

        udab.on('down', function() {
          console.log('arrow button down');
          var val = that.get('value');
          console.log('val', val);

          //var v = that.value();
          //console.log('v', v);

          that.set('value', val - 1);

        });



    }
});
module.exports = Number_Editor;

		//return Number_Editor;
	//}
//);
