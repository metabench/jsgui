
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./text-field"],
function(jsgui, Text_Field) {

    var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
    var Control = jsgui.Control;

    // Another type of control? - composite or basic-composite?
    //  That would be an unenhanced Login control. Made up of basic controls, will render and
    //   be useful on very limited platforms.

    // Since this is now an advanced control...

    var File_Upload = Control.extend({

        'fields': {
            'action': String
        },

        // Maybe should put this into a form, so that it does a form post.
        //  That could possibly be disabled.


        'init': function(spec) {
            var make = this.make;


            this._super(spec);

            this.set('dom.attributes.class', 'login-control');

            // and use a form control, set it's dom attributes.
            //  will use relative login url.

            // We can get the cookies from the context.

            var req = this._context.req;

            console.log('--- Within Login Control ---');

            var headers = req.headers;
            console.log('headers ' + stringify(headers));

            var frm = new jsgui.form({
                'context': this._context
            })
            // action, method

            // Could have a default action, or the action could be a field of this.
            //  Then when it arrives on the server, need to handle its post request
            //  Could possibly respond with a long polled / stream that says how much of it has uploaded. Could keep writing the percentage, possibly estimated
            //  time remaining, speed.

            var action = this.get('action') || '/upload/';
            if (action.value) action = action.value();



            frm.set('dom.attributes.action', action);


            //frm.set('dom.attributes.action', '/login');
            frm.set('dom.attributes.method', 'POST');
            frm.set('dom.attributes.enctype', 'multipart/form-data');

            this.add(frm);

            var input_file = new jsgui.input({
                //'type': 'file',
                'context': this._context

            });
            input_file.set('dom.attributes.type', 'file');
            input_file.set('dom.attributes.name', 'file');

            frm.add(input_file);
            var btn = new jsgui.button({
                'context': this._context

            })
            btn.set('dom.attributes.type', 'submit');
            btn.set('dom.attributes.value', 'submit');
            btn.set('dom.attributes.class', 'upload');
            btn.add('Upload');
            frm.add(btn);
        }
    });
    return File_Upload;
});