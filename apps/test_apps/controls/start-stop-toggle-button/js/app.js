
var jsgui = require('../../../../../js/web/jsgui-html-client');
var Client_Page_Context = require('../../../../../js/web/client-page-context');
var Toggle_Button = require('../../../../../js/web/controls/advanced/toggle-button');
var Start_Stop_Toggle_Button = require('../../../../../js/web/controls/advanced/start-stop-toggle-button');

var each = jsgui.each, stringify = jsgui.stringify;

var pc = new Client_Page_Context({
    'document': document
});

pc.update_Controls('toggle_button', Toggle_Button);
pc.update_Controls('start_stop_toggle_button', Start_Stop_Toggle_Button);


window.onload = function() {
    console.log('pre activate');

    jsgui.activate(pc);

    // Want to be able to refer to the controls though.
    //  This may be why extending a page control may be better.
    //   The page control would have the chance to activate it at the normal spot.

    // Could get the reference to the button somehow though?
    //  Would like to be querying the controls to get matching ones, eg matching the specified type.
    //   Likely to be better to get them as a Collection rather than an array in terms of enabling nice syntax.


    console.log('page_context', pc);

    var start_stop_toggle_button = pc.first_ctrl_matching_type('start_stop_toggle_button');

    console.log('start_stop_toggle_button', start_stop_toggle_button);

    // 8/12/2015 Not being set up right.
    //  Looks like the 'start' span control has been initialised twice, and there are two versions of it in the content of start_stop_toggle_button.

    console.log('sstb content length:', start_stop_toggle_button.get('content').length());


    start_stop_toggle_button.on('start', function() {
      console.log('start');
    });
    start_stop_toggle_button.on('stop', function() {
      console.log('stop');
    });


};
