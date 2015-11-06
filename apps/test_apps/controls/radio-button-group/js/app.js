
var jsgui = require('../../../../../js/web/jsgui-html-client');
var Client_Page_Context = require('../../../../../js/web/client-page-context');
var Radio_Button_Group = require('../../../../../js/web/controls/advanced/radio-button-group');
var Radio_Button = require('../../../../../js/web/controls/advanced/radio-button');

//var Start_Stop_Toggle_Button = require('../../../../../js/web/controls/advanced/start-stop-toggle-button');

var each = jsgui.each, stringify = jsgui.stringify;

var pc = new Client_Page_Context({
    'document': document
});

//pc.update_Controls('toggle_button', Toggle_Button);
pc.update_Controls('radio_button_group', Radio_Button_Group);
pc.update_Controls('radio_button', Radio_Button);


window.onload = function() {
    console.log('pre activate');

    jsgui.activate(pc);

    var rbg = pc.first_ctrl_matching_type('radio_button_group');

    console.log('rbg', rbg);

    // change listens to the DOM onchange events.
    //  Has been automatically wired up to the DOM change events so far.

    // Will be necessary to override some event handling.
    //  So rather than have 'change' appy to the onchange from the DOM that has bubbled upwards, we want to
    //   1. Raise change once we have created an object that says which was selected, which was unselected.
    //       Now it has a different value.
    // Like listening to the change in value.

    // Need some of the advanced controls to stop bubbling DOM events as change.

    // A way of overriding this DOM event system.






    rbg.on('change', false, function(e_change, v2, v3) {
      console.log('e_change', e_change);
      //console.log('v2', v2);
      //console.log('v3', v3);

      var val = e_change.checked.get('value').value();
      console.log('val', val);
    });

    /*
    start_stop_toggle_button.on('start', function() {
      console.log('start');
    });
    start_stop_toggle_button.on('stop', function() {
      console.log('stop');
    });
    */

    // Then want to listen to events (change) from the Radio_Button_Group
    //  Should have a corresponding value from the radio buttons.
    //  May be the same as their text.


}
