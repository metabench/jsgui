/**
 * Created by James on 24/01/2016.
 */


var jsgui = require('../../jsgui-html');
var Data_Grid = jsgui.Data_Grid;

var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof, is_defined = jsgui.is_defined;
var Control = jsgui.Control;

var group = jsgui.group;

// This will need to be versatile as well as operating simply with little configuration.

// presentation
//  column_headers
//  row_headers
// data
//  columns
//  rows
// range
//  num_columns
//  num_rows

// grid.set('data', ...);


// Has an underlying Data_Grid.
//  Listens to and queries the Data_Grid.
//  Possibly will be showing just a view of particular cells on the grid.

// If the gris is initialised with a Data_Grid, it uses that.
//  If it's not a Data_Grid, it attempts to load that data into a Data_Grid.


// Also want to indicate row and column labels.




var Grid = Control.extend({
    'fields': {
        'range': Array
    },


    // maybe add before make would be better. add will probably be used more.
    'init': function(spec, add, make) {
        this._super(spec);
        this.__type_name = 'grid';
        this.set('dom.attributes.class', 'grid');
        var spec_data = spec.data;

        if (!spec.abstract && !spec.el) {
            var data;

            if (spec_data) {
                if (spec_data instanceof Data_Grid) {
                    this.set('data', spec_data);
                    data = spec_data;
                } else {
                    var dg = new Data_Grid(spec_data);
                    this.set('data', dg);
                    data = dg;
                }
            }

            var range = data.get('range');

            console.log('range', range);



            // Render all cells as table.
            // Render all cells as divs


            // Then we may want to do partial rendering
            //  Becomes more complicated when the heights/sizes of items vary.


            this.full_compose_as_table();



            // Needs to take the data from a grid-compatible source.

            // Could use a GridData object.
            //  Which would have an asyncronous interface (too?)

            // Automatically wrapping an Array in a GridData object makes sense.
            //  Could extend that GridData / use it for spreadsheets.


            // Then the initial rendering of the data grid.

            // We need to know its range.
            //  In some cases it would be too big to fit on the screen, or too big to be worth rendering as HTML all at once.
            //   In that case we need to decide on either fixed cell placement or cells that move with the scrollbars.
            //    Would need to determine how many get shown, and which, based on scrollbar positions.
            //     And would need to use a specific JSGUI scrollbar control.





            //var obj = spec.value;


        }

    },

    'full_compose_as_table': function() {
        // Will need to add a bunch of new controls.
        //  XML/HTML-like shortcut syntax would help a lot.

        console.log('full_compose_as_table');

        this.set('dom.tagName', 'table');



        var data = this.get('data');

        console.log('data', data);
        console.log('t data', tof(data));

        var range = this.get('data.range');

        var value;

        // The Data_Grid could even contain a Data_Value in each cell.
        //  I'm not doing it this way at the moment though.




        if (tof(data) === 'data_grid') {

            // Need to iterate the data_grid by column and row.

            // Retrieval of all values from all cells within the range.

            console.log('range', range);


            var x, y, max_x = range[0], max_y = range[1];

            for (x = 0; x <= max_x; x++) {

                var ctrl_row = new jsgui.tr({
                    'context': this.context
                });
                this.add(ctrl_row);

                for (y = 0; y <= max_y; y++) {
                    var ctrl_cell = new jsgui.td({
                        'context': this.context
                    });
                    ctrl_row.add(ctrl_cell);

                    // then we need to write the value within each cell.
                    //  would be good to have a .text function.

                    // or a .set('text', ...);

                    // a .text function would in some cases set the text property
                    // in other cases, would just replace all of the contents with that single piece of text.

                    // an add_text function would be simpler.
                    //  and that would be in html-enh Control
                    //   because it's not intrinsic to the Control's core operations.

                    value = data.get(x, y);

                    ctrl_cell.add_text(value);








                }
            }


        } else {
            throw 'Unexpected data type. Expected data_grid, got ' + tof(data);

        }


        // So it looks like a Data_Grid wrapped in a Data_Value.

        // Would like Data_Grid to be an intrinsic type to jsgui...
        //  meaning that when something is set with a Data_Grid, it does not wrap it in a Data_Value.






    },
    'activate': function() {
        // May need to register Flexiboard in some way on the client.

        if (!this.__active) {
            this._super();


        }

    }
})

module.exports = Grid;