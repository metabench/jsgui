// object viewer
/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
};

define(["../../../jsgui-html-enh", "./factory", "./basic/string"],
	function(jsgui, factory, String_Viewer) {
		*/
var jsgui = require('../../../jsgui-html-enh');
var factory = require('./factory');
var String_Viewer = require('./basic/string');
var Number_Viewer = require('./basic/number');


var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
var Control = jsgui.Control;

var group = jsgui.group;
var extend = jsgui.extend;

// Could this be made to swap a different factory in place?
//  Object_KVP_Editor would then use the 'Editor' factory

// In init, this.factory = factory.
//  Then we can substitute the factory.



var Object_KVP_Viewer = Control.extend({
    'init': function(spec) {

        // Will have different modes.
        //  Default mode is JSON
        //  Can also show (tabular)?
        //  Would make sense to use an HTML table for this?
        //  Maybe when there are more rows.
        //   Could have it render as a tr perhaps.
        //  Tabular mode would be like a table, but using DIVs.
        //   Easier for a single row.
        //  Table means actually a table.



        this._super(spec);
        if (!this.factory) this.factory = factory;
        if (!this.String) this.String = String_Viewer;
        if (!this.Number) this.Number = Number_Viewer;

        this.set('dom.attributes.class', 'object-kvp-viewer');
        this.__type_name = 'object_kvp_viewer';
        var that = this;

        // only create the new controls if the spec does not have an el.
        //  Though may change that check... could check to see if it's an empty el or if there are already elements as content.
        //   to be activated or overwritten.

        if (is_defined(spec.key)) {
            this.set('key', spec.key);
        };

        var val;

        if (is_defined(spec.value)) {
            val = spec.value;
            this.set('value', spec.value);
        };

        //if (is_defined(spec.value)) {
        //    val = spec.value;
        //    this.set('value', spec.value);
        //};


        // No, maybe the mode has already been set as a field.

        // client-side
        // possibly should not set the mode at this stage, before it gets activated.
        //  It may be better for it to see the fields and apply them to the spec.
        //  Or if it has the element, it could read values from that element
        //   Earlier activation
        //   Pre-activation activation?
        //   Value loading.
        //   Making what is currently activate_jsgui_fields, activate_jsgui_control_fields, may be better as a part of initialization.
        //    It would prevent set values being overwritten with default ones.

        // Could have it activate the values before anything else.



        var mode = this.get('mode');

        if (!spec.mode) {
            spec.mode = 'json';
        }

        if (!mode) {
          mode = spec.mode;
          this.set('mode', mode);
        }
        //mode = mode || spec.mode;

        // could ensure the mode with saying it's JSON.





        this.add_class(mode);

        //this.String =

        if (!spec.el) {

            /*
            var ctrlKey = new Control({
                'context': this._context
            })
            ctrlKey.set('dom.attributes.class', 'object-kvp-key-viewer');
            */

            // May be better to use a string Viewer, Editor here, rather than having 3 different controls
            //  for the different parts of it. I think that will make for better encapsulation.

            // A single string control does seem better here.
            //  (editor or viewer)

            // The inner text?


            // Different rendering for different modes.
            //  Don't just want it to render as JSON.
            //  Want it to be able to render in a tabular way, using DIVs.

            // probably give the mode to the rendering components.

            if (mode == 'json') {

            }


            // We need to be able to get the key's span_content



            var ctrl_string_key = new that.String({
                'context': this._context,
                'text': spec.key,
                'mode': mode
            });

            /*


            var span_key_open_quote = new jsgui.span({
                'context': this._context
            });
            span_key_open_quote.add('"');
            ctrlKey.add(span_key_open_quote);

            var span_key_inner = new jsgui.span({
                'context': this._context
            });
            //span_key_close_quote.add('"');
            ctrlKey.add(span_key_inner);

            var span_key_close_quote = new jsgui.span({
                'context': this._context
            });
            span_key_close_quote.add('"');
            ctrlKey.add(span_key_close_quote);
            */

            // Why isnt this rendering?


            // only add the ': ' in JSON mode.

            //ctrlKey.add(span_key_colon_space);

            //  But setting up the ctrlKey so it has got other controls inside it, which will activate...

            var ctrl_value_container = new Control({
                'context': this._context
            })
            ctrl_value_container.set('dom.attributes.class', 'object-kvp-value-viewer');

            // Should be able to set the value container with a value control.
            //  Depends on the type of the value I think.

            var ctrl_value;

            if (is_defined(val)) {
                var t_val = tof(val);

                console.log('t_val', t_val);

                if (t_val == 'string') {
                    ctrl_value = new that.String({
                        'context': this._context,
                        'value': val
                    })
                }
                if (t_val == 'number') {
                    ctrl_value = new that.Number({
                        'context': this._context,
                        'value': val
                    })
                }

                if (ctrl_value) {
                    ctrl_value_container.add(ctrl_value);
                }
            }





            var ctrlClose = new Control({
                'context': this._context
            })
            ctrlClose.set('dom.attributes.class', 'object-close');
            ctrlClose.get('content').add('}');

            //this.add(ctrlOpen);

            // Should set it as a field that persists to the client.
            this.set('ctrl_key', ctrl_string_key);
            // ctrl_value
            this.set('ctrl_value', ctrl_value);



            this.add(ctrl_string_key);


            // The colon space...

            if (mode == 'json') {


                var span_key_colon_space = new jsgui.span({
                    'context': this._context
                });
                span_key_colon_space.get('content').add(': ');
                this.add(span_key_colon_space);
            }





            this.add(ctrl_value_container);

            if (typeof document === 'undefined') {
              extend(this._fields = this._fields || {}, {
                'mode': mode
              })
            }



            // Less confusing if we don't call refresh as part of the render.
            //this.refresh_internal();
        }

        // Generally, event listeners need some more work.
        //  Maybe a specific way to define them so that they bubble up through a heirachy.
        //  May be best for performance reasons to swith that off by default.





        /*

        this.add_event_listener('change', function(e) {
            // It looks like the e value is not working ok for stringifying it.
            //  Could maybe make a Class that stringifies well for events.

            //console.log('Object_Viewer change e ' + stringify(e));

            // Need to update the UI.

            // Rendering all controls again seems like a way to do it to start with.
            //  Seems easier than matching up the existing ones with what they have changed too.
            //   Maybe the matching will be more efficient though.
            var fieldName = e[0];
            var fieldValue = e[1];

            if (fieldName == 'key') {

            }
            if (fieldName == 'value') {

            }

            that.refresh_internal();


        })
        */
    },


    // Maybe don't use this?
    //  Maybe don't need it.
    'refresh_internal': function() {
        // When values are set in the constructor, using fields, do they get set using data values, like they would otherwise?

        var key = this.get('key');

        var value = this.get('value');

        // May be better to have a String control for the key.
        //  That way it will be easier to make it editable (using the control overrides).


        var content = this.get('content');
        //console.log('content ' + stringify(content));

        //var

        // May not be in the same place.
        //  Controls need to be remembered.



        //var ctrl_key = content.get(0);
        //var ctrl_value = content.get(2);

        var key_content = ctrl_key.get('span');

        //this.set('ctrl_string_key', ctrl_string_key);

        //var key_content = ctrl_key.get('content').get(1);

        if (key) {

            console.log('key ' + key);

            //var key_value = key.value();
            //console.log('key_value ' + key_value);

            key_content.add(key);

            var vcon = ctrl_value.get('content');
            //vcon.set(1, 'hello');
            vcon.clear();

            var ctrl_viewer = this.factory(value, this._context);
            //console.log('ctrl_viewer', ctrl_viewer);
            //console.log('tof ctrl_viewer', tof(ctrl_viewer));

            vcon.push(ctrl_viewer);
        }

    },
    'activate': function(el) {

        console.log('activate Object_KVP_Viewer');

        var mode = this.get('mode');
        console.log('mode', mode);
        console.log('mode ' + mode);


        // It may be in a different mode, could have different internal layouts.




        // could maybe not that the control is active at some stage to prevent reactivation.

        var hover_class = 'bg-light-yellow';

        // not sure why this should get activated again.

        this._super(el);

        //console.log('activate Object_KVP_Viewer ' + this._id());

        var el = el || this.get('dom.el');
        //console.log('el.innerHTML ' + el.innerHTML);

        var cns = el.childNodes;
        //console.log('cns.length ' + cns.length);

        var content = this.get('content');
        //console.log('content.length() ' + content.length());

        var clength = content.length();

        // No, don't get the control based on the content length.
        //  The structure may change.
        //  Need to keep the correct references.



        var ctrl_key, ctrl_value, ctrl_comma;
        var ctrl_key, ctrl_value, ctrl_comma;

        // Now using a string control for the key.
        //  Need less event handling here I think.

        // The ctrl_value should be saved and loaded automatically.

        // The placement of the content will depend on the mode.
        //  Maybe want better labelling / name transferrence of the internal controls.




        if (mode == 'json') {
          if (clength == 3 || clength == 4) {
              var content_key = content.get(0);
              //console.log('content_key ' + stringify(content_key));
              //console.log('content_key ' + tof(content_key));
              ctrl_key = this.set('ctrl_key', content_key);
              //console.log('ctrl_key ' + tof(ctrl_key));
              ctrl_value = this.set('ctrl_value', content.get(2));
          }
          if (clength == 4) {
              ctrl_comma = this.set('ctrl_comma', content.get(4));
          }
        } else {

          ctrl_key = this.get('ctrl_key');
          ctrl_value = this.get('ctrl_value');

        }




        // 4...



        if (clength > 4) {
            //console.log('content', content);
            throw 'stop';
        }


        // I think with the grid_9 the content still is not being dealt with properly.


        // then the open for the key.

        console.log('ctrl_key', ctrl_key);
        var key_content = ctrl_key.get('content');



        // And we want the value itself.
        // The value will really be a reference to the value of the value viewer.

        // Need to have the internal value linked with the value of the viewer control.

        var value_value = ctrl_value.get('value');
        console.log('value_value', value_value);


        //console.log('ctrl_key._id() ' + ctrl_key._id())
        //console.log('key_content.length() ' + key_content.length());

        // open, content, close, colon_space

        var ctrl_key_open_quote, ctrl_key_content, ctrl_key_close_quote, ctrl_key_colon_space;


        if (key_content.length() == 4) {
            ctrl_key_open_quote = key_content.get(0);
            ctrl_key_content = key_content.get(1);
            ctrl_key_close_quote = key_content.get(2);
            ctrl_key_colon_space = key_content.get(3);

            var group_key_quotes = jsgui.group_hover_class([ctrl_key_open_quote, ctrl_key_close_quote], hover_class);
            var that = this;
            //group_key_quotes.click(function(e) {
            //	that.action_select_only();
            //});

            group_key_quotes.click_to_select(this);
            // I think click_to_select works nicely as an API.
            jsgui.hover_class(ctrl_key_content, hover_class);


            // an easy way to specify the select action would be good.
            //  there is the normal select which will allow for the ctrl and shift modifiers.

            /*

            ctrl_key_content.click(function(e) {
                // is control held down?
                //console.log('e', e);
                var ctrl_key = e.ctrlKey;
                if (ctrl_key) {
                    ctrl_key_content.action_select_toggle();
                } else {
                    ctrl_key_content.action_select_only();
                }
            });
            */

            ctrl_key_content.click_to_select();



            //ctrl_key_content.click(function(e) { ctrl_key_content.action_select_only() });


            // ctrl_key_colon_space
            ctrl_key_colon_space.click_to_select(this);
            /*
            ctrl_key_colon_space.click(function(e) {
                // is control held down?
                //console.log('e', e);
                var ctrl_key = e.ctrlKey;
                if (ctrl_key) {
                    that.action_select_toggle();
                } else {
                    that.action_select_only();
                }
            });
            */

            //ctrl_key_colon_space.click(function(e) { that.action_select_only() });

        }
    }
});
module.exports = Object_KVP_Viewer;

		//return Object_KVP_Viewer;
//	}
//);
