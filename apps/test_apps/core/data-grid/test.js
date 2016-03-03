/**
 * Created by James on 24/01/2016.
 */

var jsgui = require('../../../../js/web/jsgui-server');
//var Window = require('../../../../js/web/controls/advanced/window');
var Radio_Button_Group = require('../../../../js/web/controls/advanced/radio-button-group');
var Tabs = require('../../../../js/web/controls/advanced/tabs');

var Server_Page_Context = require("../../../../js/web/server-page-context");

var Data_Grid = jsgui.Data_Grid;
var Data_Object = jsgui.Data_Object;
var Collection = jsgui.Collection;
//var Simple_Authentication_Provider = Resource_Authentication.Simple_Provider;

var j = jsgui;
var Class = j.Class;
var each = j.each;
var is_array = j.is_array;
var is_dom_node = j.is_dom_node;
var is_ctrl = j.is_ctrl;
var extend = j.extend;
var x_clones = j.x_clones;
var get_truth_map_from_arr = j.get_truth_map_from_arr;
var get_map_from_arr = j.get_map_from_arr;
var arr_like_to_arr = j.arr_like_to_arr;
var tof = j.tof;
var is_defined = j.is_defined;
var stringify = j.stringify;
var functional_polymorphism = j.functional_polymorphism;
var fp = j.fp;
var arrayify = j.arrayify;
var mapify = j.mapify;
var are_equal = j.are_equal;
var get_item_sig = j.get_item_sig;
var set_vals = j.set_vals;
var truth = j.truth;
var trim_sig_brackets = j.trim_sig_brackets;
var ll_set = j.ll_set;
var ll_get = j.ll_get;
var is_constructor_fn = j.is_constructor_fn;
var is_arr_of_arrs = j.is_arr_of_arrs;
var is_arr_of_strs = j.is_arr_of_strs;
var is_arr_of_t = j.is_arr_of_t;
var fromObject = j.fromObject;

var dg = new Data_Grid([
    [1, 1],
    [2, 4],
    [3, 9],
    [4, 16],
    [5, 25]
]);

console.log('dg.get(0, 0) ' + dg.get(0, 0));


// Get could get the data value.
//  Or we just have onchange for the whole thing.

// Want to be able to refer to the Data_Value in any cell?
//  Or skip that and just have a number / other data in each cell.

// Data_Value in each cell makes it easier to bind changes to any particular cell.

// Then the Grid UI component will use Data_Grid under the surface.





