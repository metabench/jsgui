// object editor

/*
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../../../jsgui-html-enh", "../../viewer/basic/string"], 
	function(jsgui, String_Viewer) {
		*/
var jsgui = require('../../../../jsgui-html-enh');
var String_Viewer = require('../../viewer/basic/string');

var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
var Control = jsgui.Control;

var String_Editor = String_Viewer.extend({

    // Bit of a problem with this...
    //  Input does not work when it keeps the same size as the text.
    //  Input needs to be at least slightly bigger than the text.
    //  So, I'm thinking that a new version could be made,
    //   where it displays the text in a span, but there is a hidden input, with focus, being edited.

    // Another possibility is to use contenteditable, but to restrict what gets allowed (maybe not so easy)
    //  Could use blur keyup paste events
    //   have it replace anything in the HTML that's a tag / formatting with plain text.
    //  That seems like a decent way of doing it. Would then be able to expand the size of the contenteditable
    //   to the size of its content? I think that happens anyway...


    // Maybe should put this into a form, so that it does a form post.
    //  That could possibly be disabled.

    // I think persisting the values in the editor, and having them actually do something, like run a CMS,
    // will be very helpful.




    'init': function(spec) {
        var make = this.make;
        var that = this;


        this._super(spec);

        this.set('dom.attributes.class', 'string-editor');
        this.__type_name = 'string_editor';

        // not the control itself having editable content.
        //  Its text content subcontrol will have contenteditable.
        //  I'd prefer to have that done in the construction rather than activation.



        //this.set('dom.attributes.contenteditable', 'true');
        // This could superimpose a textarea?
        // Don't want the various formatting options here...
        //  Or could a contenteditable do the job if restrictions are put in place?
        //  Or the lower level method of showing a cursor, animating it, and processing the user's keyboard actions?
        //   Would want to make interchangable components.

        // Editable text (with various restrictions) seems like an important encapsulation.
        //  For these things, perhaps just a textarea would be best, or single line text for properties.

        // Contenteditable probably is not the right tool for this.
        //  Just putting a textarea in place would do the job.

        // I think superimposing one control over another would work for this.
        //  Absolutely positioned textbox, positioned over where the existing control is in the document.

        // ctrl.superimpose_over(ctrl_target);

        // this.edit

        // Once it is selected, a single click makes it editable.

        // So, will respond to the click event.
        var that = this;



        // This needs to use contenteditable.






        // Needs to have the object that it's going to view...
        //  Flexi - fields?

        // Need to be able to respond to POJO changes.

        // Perhaps by putting the object in a Data_Object we can better respond to object changes.
        //  I think we can use a surrounding div, with display inline.
        //   Some content of the object would not be displayed inline though.
        //   Possibly will want the code to be quite aware of lines.

        //var doObj = this.get('')

        // Calling this a 'change' event now.

        // Want a blur event handler.

        // That's really part of the activated code.




    },
    'refresh_internal': function() {
        this._super();


    },
    '_edit': function() {
        var input = this.get('input');
        if (!input) {

            // we can position it absolutely over the existing element...
            // or hide the existing one?
            // I think it would be easier as a child of existing element.
            //  first child.

            var content = this.get('content');
            // superimpose it over the span.

            var span = this.get('span');
            // position of the span compared to this.

            var el = this.get('dom.el');

            var span_bcr = span.get('dom.el').getBoundingClientRect();
            var this_bcr = el.getBoundingClientRect();

            console.log('span_bcr', span_bcr);
            console.log('this_bcr', this_bcr);

            var span_x_offset = span_bcr.left - this_bcr.left;
            var w = span_bcr.width;

            var value = this.get('value');

            // new Resizing_Input
            //  That type of resizing input control will be a bit specialised.
            //  Will automatically keep in sync with the text inside it.
            //  In this case, there is a corresponding SPAN, so the text size could be easier to measure.
            // Perhaps we can set up a Resizing_Input with a corresponding span.
            //  If it does not have one, it uses a hidden span or div to do its calculations.







            input = new jsgui.input({
                'context': this._context
            });
            input.set('dom.attributes.value', value);
            console.log('value', value);

            // could respond to input keydown?





            // That would be a convenient interface to get the current font size.
            //  It would maybe get it from an abstraction, or from the dom (maybe get computed style)
            var font_size = span.style('font-size');
            var font = span.style('font');
            console.log('font_size', font_size);


            input.style({
                'position': 'absolute',
                'margin-left': span_x_offset + 'px',
                'width': w + 'px',
                'outline': '0',
                //'background-color': 'transparent',
                'border': '0px solid',
                //'font-size': font_size
                'font': font
            });


            content.insert(input, 0);
            var iel = input.get('dom.el');
            var spanel = span.get('dom.el');

            iel.focus();

            var sync_size = function(e) {
                //console.log('input keydown');

                // Perhaps need to see what the letter is, and add it to the span, then measure it
                //  Want there to be space when the item is put into the span.
                console.log('e', e);

                // Keeping a comfort margin within the object?
                //  It may be possible to work out the new width first, with a different means of updating
                //  the span.

                // Fairly sure we'll need a better way.
                //  Is better to make sure there is enough space in the input before putting the extra character
                //  in place.

                // It may be better to suppress adding the text to the input, put it into the span,
                //  measure the span, size the input, then put the text in.
                // Don't want the input getting to much text inside it.

                /*



                setTimeout(function() {
                    var value = iel.value;

                    // Keydown seems to happen before the key is added...
                    // set the content of the span...
                    //span.set('content', value);

                    spanel.innerHTML = value;
                    //setTimeout(function() {
                        var w = spanel.offsetWidth;
                        input.style({
                            'width': w + 'px'
                        });
                    //}, 0);
                }, 0);

                */

                setTimeout(function() {
                    var scrollWidth = iel.scrollWidth;
                    console.log('scrollWidth', scrollWidth);

                    input.style({
                        'width': scrollWidth + 'px'
                    });
                }, 0);




            }

            //input.on('keydown', function(e_keydown) {
            //	sync_size(e_keydown);
            //});
            /*
            input.on('keyup', function(e_keydown) {
                sync_size();
            });

            */
            input.on('keypress', function(e_keydown) {
                sync_size();
            });
            // Then want to focus on the input and select all of its content.


            // Need accurate measuring of text width.
            //  I think we need a ResizingTextInput control here, want to encapsulate that tricky programming.






            //content.superimpose_over(span);
            // means set some properties.
            //  does not have to be in the same place...???
            //  may depend on measurements.



            console.log('has inserted input.');

            this.set('editing', true);
        }

    },
    'activate': function() {

        this._super();
        var that = this;
        //this.on('blur')

        // it's for blurring the span.
        //  want to listen to the span's blur event.

        var span = this.get('span');
        span.on('blur', function(e_blur) {
            console.log('e_blur', e_blur);

            // Then it will be time to update the text value property?
            //  I think the text value would likely be a Data_Object, which could be connected in such
            //  a way that it gets persisted.


        });
        //span.

        //var span = this.get('span');
        //console.log('span', span);
        //console.log('this._', this._);
        //span.set('dom.attributes.contenteditable', 'true');


        var selected_on_mousedown;

        this.on('mousedown', function(e_down) {
            console.log('mousedown');
            var span_selected = this.get('span.selected');
            console.log('md span_selected', span_selected);

            selected_on_mousedown = span_selected;
        })

        this.on('click', function(e_click) {
            // Event before the click has been processed by other automatic processors?
            //  Want to know if it became selected in the click.
            //  If it was already selected.

            // Could use mousedown perhaps.
            //  May be better to find out what happened as the click took place?

            // Or on mousedown we see if its selected or not?





            console.log('string editor click event');

            // Then if it is selected, and not in edit mode, put it into edit mode.

            //var mode = this.get('mode');
            var selected = that.get('selected');
            var editing = that.get('editing');

            console.log('selected', selected);
            console.log('editing', editing);

            if (selected &! editing) {
                console.log('selected and not editing');
            }

            // what about the content text being selected?

            var span_selected = this.get('span.selected');
            console.log('span_selected', span_selected);

            span.get('dom.el').setAttribute('contenteditable', true);

            //if (selected_on_mousedown &! editing) {
            //	console.log('was selected on mousedown, not currently editing');

            //	that.edit();
            //}

        });

        // Also want some code that prevents the single line content editable from having extra lines or html
        //  put in.

        // Will remove all line breaks...
        var elSpan = span.get('dom.el');
        span.on('keyup', function(e_keyup) {
            console.log('span keyup');

            // Adjust the span content to remove all line breaks (or other tags...)

            // I think looking for br elements and removing them will work...
            var cns = elSpan.childNodes;
            console.log('cns.length ' + cns.length);

            if (cns.length > 1) {
                // I think it should only be 1.

                /*
                each(cns, function(i, cn) {
                    //console.log('cn.tagName ' + cn.tagName);
                    //if (i > 0) {
                    //	elSpan.removeChild(cn);
                    //};
                    console.log('cn', cn);
                    console.log('cn.nodeType ' + cn.nodeType);

                    if (cn.nodeType == 3) {
                        // keep it...
                    } else {
                        // mark it for removal.
                        //  harder to do this in a loop, messes up the each.
                        //elSpan.removeChild(cn);
                    }
                });
                */

                for (var i = 0; i < cns.length; i++) {
                    var cn = cns[i];
                    if (cn.nodeType == 3) {
                        // keep it...
                    } else {
                        // mark it for removal.
                        //  harder to do this in a loop, messes up the each.
                        elSpan.removeChild(cn);
                        i--;
                    }
                }

                // Joining together any remaining text nodes may make sense. Not sure it is so important though.






                // But could join them back together again, rather than just removing it?

            }



        });

        // on activation, we can give this a new textinput.



    }
});
module.exports = String_Editor;

		//return String_Editor;
	//}
//);