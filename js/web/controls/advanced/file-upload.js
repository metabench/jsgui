
/*

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html", "./text-field"],
function(jsgui, Text_Field) {
*/

var jsgui = require('../../jsgui-html');
var Text_Field = require('./text-field');

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

            // 0 icon / mini mode
            // 1 compact mode
            // 2 normal mode
            // 3 large mode

            var autosubmit = false;



            this._super(spec);

            var mode = 'medium';

            if (spec.mode) mode = spec.mode;

            if (mode == 'icon' || mode == 'mini' || mode == 'compact') autosubmit = true;

            //var url_path = spec.url_path;

            // but we want that property to go to the client and be activated there too.

            // will use ctrl fields too.






            this.set('dom.attributes.class', 'file-upload ' + mode);
            this.__type_name = 'file_upload';

            // and use a form control, set it's dom attributes.
            //  will use relative login url.

            // We can get the cookies from the context.

            var req = this._context.req;

            //var headers = req.headers;
            //console.log('headers ' + stringify(headers));

            var frm = new jsgui.form({
                'context': this._context
            })
            // action, method

            // Could have a default action, or the action could be a field of this.
            //  Then when it arrives on the server, need to handle its post request
            //  Could possibly respond with a long polled / stream that says how much of it has uploaded. Could keep writing the percentage, possibly estimated
            //  time remaining, speed.

            var action;

            if (spec.action) {
                action = spec.action;

            } else {
                action = '/upload/';
            }
            this.set('action', action);

            //var action = this.get('action') || '/upload/';
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

            if (mode == 'normal' || mode == 'large') {
                var btn = new jsgui.button({
                    'context': this._context

                })
                btn.set('dom.attributes.type', 'submit');
                btn.set('dom.attributes.value', 'submit');
                btn.set('dom.attributes.class', 'upload');
                btn.add('Upload');
                frm.add(btn);
            }

            var ctrl_fields = {
                'input_file': input_file._id(),
                'form': frm._id()
            }

            this.set('dom.attributes.data-jsgui-ctrl-fields', stringify(ctrl_fields).replace(/"/g, "'"));

            // and the fields...

            this.set('dom.attributes.data-jsgui-fields', stringify({
                'autosubmit': autosubmit,
                'mode': mode
            }).replace(/"/g, "'"));





            //throw 'stop';
        },
        'activate': function() {
            this._super();

            console.log('activate File_Upload');

            var mode = this.get('mode');

            // .val
            //  could get a control, but if it's a non-control Data_Object it would get its value.



            var autosubmit = this.get('autosubmit').value();
            var input_file = this.get('input_file');
            var form = this.get('form');

            console.log('autosubmit', autosubmit);
            console.log('form', form);

            if (autosubmit) {
                //console.log('autosubmit', autosubmit);
                //console.log('input_file', input_file);



                input_file.add_event_listener('change', function(e_change) {
                    console.log('e_change', e_change);

                    form.get('dom.el').submit();


                })


            }
        }
    });
module.exports = File_Upload;

    //return File_Upload;
//});