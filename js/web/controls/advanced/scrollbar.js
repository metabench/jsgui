/**
 * Created by James on 28/02/2016.
 */


var jsgui = require('../../jsgui-html-enh');


var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof;
var Control = jsgui.Control;
var Button = require('./button');




// Scroll_View
//  Being a Control that has both scrollbars optionally
//   Also left for RTL languages?
//   Also possibility of scrollbar on top?
//    Never used that way.






var Scrollbar = Control.extend({

    // Though maybe tell it to be an array and it should be an array rather than a collection?
    //  Or a Data_Value that holds an array?

    //'fields': [
    //    ['text', String],
    //    ['state', String],
    //    ['states', Array]
    //],
    //  and can have other fields possibly.

    'init': function(spec, add, make) {

        this._super(spec);
        this.__type_name = 'scrollbar';



        // Always active?

        this.active();

        var that = this;


        var context = this._context;

        if (!spec.abstract && !spec.el) {
            this.set('dom.attributes.class', 'scrollbar');
            var btn_negitive = new Button({
                'context': context
            });

            var scroll_area = new Control({
                'context': context
            });

            var draggable_scroller = new Control({
                'context': context
            });

            var btn_positive = new Button({
                'context': context
            });

            this.add(btn_negitive);
            scroll_area.add(draggable_scroller);
            this.add(scroll_area);
            this.add(btn_positive);
        }

        // Will be horizontal or vertical.
        //  One scrollbar control will handle both.
        //  Then there will be convenience versions that are descended from them.

        // This may need to fit within a particular size.
        //  It may get applied to a control.

        // negitive_button, scroll_area, draggable_scroller, positive_button







        // And on activation the scrollbar can be calibrated with scrollHeight

        // As it downloads, it will be uncalibrated, but sized to fit within the designated area if possible.


        // .direction property




        // this.__direction




        //var is_horizontal = true;




        // assume this for the moment.

        // When horizontal, needs to be rendered according to a known width.
        //  However, the scrollbar height may be important in fitting both a scrollbar and some internal contents together.

        // May have a container-type of control that is a scrollbar container.
        //  That would have another control inside that gets moved.
        // That may or may not be a useful abstraction away from HTML.
        //  I guess that in some cases it would be.
        //  It seems like the best way in order to have a control that's the right size.
        //   However, perhaps a Control could operate as this type of scrollbar container as a kind of mode.
        //    It would put its normal contents inside a hidden control / its content area.

        // Having a robust and flexible scrollbar system looks very important.
        // Controls already have functionality that gives them a defined content area.

        // In this case, the abstraction will solve some scrolling issues in a way that avoids interaction with some particular browser functionality
        //  Would help lead to it working accross browsers consistantly.
        //   May matter less with the most up-to-date browsers.

        // So the Enhanced_Control should be able to render itself as scrollbar container.
        //  It's likely to be working with sizes being restricted in some places.
        //  It may know the size to start with, and then it allocates a suitable smaller inner area.

        // Could make an inner_height property useful.





    },
    'activate': function() {

        if (!this.__active) {
            this._super();
            var that = this;

        }
    }
});

var Horizontal_Scrollbar = Scrollbar.extend({
    'init': function(spec) {
        this.__direction = 'horizontal';
        this._super(spec);
    }
});

var Vertical_Scrollbar = Scrollbar.extend({
    'init': function(spec) {
        this.__direction = 'vertical';
        this._super(spec);
    }
});

Scrollbar.H = Scrollbar.Horizontal = Horizontal_Scrollbar;
Scrollbar.V = Scrollbar.Vertical = Vertical_Scrollbar;


module.exports = Scrollbar;
