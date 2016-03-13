var jsgui = require('../../../../js/web/jsgui-html');
var Control = jsgui.Control;

var Ctrl_Main = Control.extend({
    'init': function(spec) {
        this._super(spec);
        this.__type_name = 'ctrl_main';
    },
    'activate': function() {
        console.log('activate ctrl_main');

        if (!this.__active) {
            this._super();

            var context = this._context;

            var new_ctrl = new Control({
                'context': context
            })

            console.log('');
            console.log('Pre add Hello World text to new control');
            //console.log('new_ctrl', new_ctrl);
            console.log('content length ' + new_ctrl.get('content').length());

            new_ctrl.add('Hello World');
            console.log('Post add Hello World text to new control');

            //console.log('new_ctrl', new_ctrl);
            console.log('content length ' + new_ctrl.get('content').length());

            console.log('');
            console.log('Pre add new control to main control');
            this.add(new_ctrl);
        }


    }
})

module.exports = Ctrl_Main;