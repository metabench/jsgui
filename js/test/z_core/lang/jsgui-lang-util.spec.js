
describe("z_core/lang/jsgui-lang-util.spec.js", function () {

    var jsgui_util;
    var assert;
    var test_utils;

    before(function () {
        jsgui_util = require('../../../core/jsgui-lang-util');
        //jsgui_util.__data_id_method = 'init';
        //
        assert = require('assert');
        test_utils = require('../../test-utils/test-utils');
    });

    // -----------------------------------------------------
    //	vectorify()
    // -----------------------------------------------------

    it("vectorify() should create a vectorified function version", function () {
        var n_add = function (n1, n2) { return n1 + n2; };
        var v_add = jsgui_util.vectorify(n_add);
        //
        test_utils.assertDeepEqual(v_add(1, 2), 3);
        test_utils.assertDeepEqual(v_add(1, 2, 3), 6);
        test_utils.assertDeepEqual(v_add(1, 2, 3, 4), 10);
        //
        test_utils.assertDeepEqual(v_add([1, 2, 3, 4], 20), [21, 22, 23, 24]);
        //
        test_utils.assertDeepEqual(v_add([1, 2, 3, 4], [5, 6, 7, 8]), [6, 8, 10, 12]);
        //
        test_utils.assertDeepEqual(v_add([1], [2, 3]), [3]);
        test_utils.assertDeepEqual(v_add([1, 2], [3]), [4, undefined]);
        //
        test_utils.assertDeepEqual(v_add(1), undefined);
        test_utils.assertDeepEqual(v_add(), undefined);
    });

    // -----------------------------------------------------
    //	v_add()
    // -----------------------------------------------------

    it("v_add() should works with vectors", function () {
        var v_add = jsgui_util.v_add;
        //
        test_utils.assertDeepEqual(v_add(1, 2), 3);
        test_utils.assertDeepEqual(v_add(1, 2, 3), 6);
        test_utils.assertDeepEqual(v_add(1, 2, 3, 4), 10);
        //
        test_utils.assertDeepEqual(v_add([1, 2, 3, 4], 20), [21, 22, 23, 24]);
        //
        test_utils.assertDeepEqual(v_add([1, 2, 3, 4], [5, 6, 7, 8]), [6, 8, 10, 12]);
        //
        test_utils.assertDeepEqual(v_add([1], [2, 3]), [3]);
        test_utils.assertDeepEqual(v_add([1, 2], [3]), [4, undefined]);
        //
        test_utils.assertDeepEqual(v_add(1), undefined);
        test_utils.assertDeepEqual(v_add(), undefined);
    });

    // -----------------------------------------------------
    //	v_subtract()
    // -----------------------------------------------------

    it("v_subtract() should works with vectors", function () {
        test_utils.assertDeepEqual(jsgui_util.v_subtract(1, 2), -1);
        test_utils.assertDeepEqual(jsgui_util.v_subtract(1, 2, 3), -4);
        test_utils.assertDeepEqual(jsgui_util.v_subtract(1, 2, 3, 4), -8);
        //
        test_utils.assertDeepEqual(jsgui_util.v_subtract([1, 2, 3, 4], 20), [-19, -18, -17, -16]);
        //
        test_utils.assertDeepEqual(jsgui_util.v_subtract([10, 20, 30, 40], [5, 6, 7, 8]), [5, 14, 23, 32]);
        //
        test_utils.assertDeepEqual(jsgui_util.v_subtract([10], [2, 3]), [8]);
        test_utils.assertDeepEqual(jsgui_util.v_subtract([10, 20], [3]), [7, undefined]);
        //
        test_utils.assertDeepEqual(jsgui_util.v_subtract(1), undefined);
        test_utils.assertDeepEqual(jsgui_util.v_subtract(), undefined);
    });

    // -----------------------------------------------------
    //	v_multiply()
    // -----------------------------------------------------

    it("v_multiply() should works with vectors", function () {
        test_utils.assertDeepEqual(jsgui_util.v_multiply(1, 2), 2);
        test_utils.assertDeepEqual(jsgui_util.v_multiply(1, 2, 3), 6);
        test_utils.assertDeepEqual(jsgui_util.v_multiply(1, 2, 3, 4), 24);
        //
        test_utils.assertDeepEqual(jsgui_util.v_multiply([1, 2, 3, 4], 20), [20, 40, 60, 80]);
        //
        test_utils.assertDeepEqual(jsgui_util.v_multiply([10, 20, 30, 40], [5, 6, 7, 8]), [50, 120, 210, 320]);
        //
        test_utils.assertDeepEqual(jsgui_util.v_multiply([10], [2, 3]), [20]);
        test_utils.assertDeepEqual(jsgui_util.v_multiply([10, 20], [3]), [30, undefined]);
        //
        test_utils.assertDeepEqual(jsgui_util.v_multiply(1), undefined);
        test_utils.assertDeepEqual(jsgui_util.v_multiply(), undefined);
    });

    // -----------------------------------------------------
    //	v_divide()
    // -----------------------------------------------------

    it("v_divide() should works with vectors", function () {
        test_utils.assertDeepEqual(jsgui_util.v_divide(1, 2), 0.5);
        test_utils.assertDeepEqual(jsgui_util.v_divide(100, 2, 5), 10);
        test_utils.assertDeepEqual(jsgui_util.v_divide(300, 3, 2, 5), 10);
        //
        test_utils.assertDeepEqual(jsgui_util.v_divide([10, 20, 30, 40], 2), [5, 10, 15, 20]);
        //
        test_utils.assertDeepEqual(jsgui_util.v_divide([10, 20, 30, 40], [5, 5, 3, 8]), [2, 4, 10, 5]);
        //
        test_utils.assertDeepEqual(jsgui_util.v_divide([10], [2, 5]), [5]);
        test_utils.assertDeepEqual(jsgui_util.v_divide([10, 20], [2]), [5, undefined]);
        //
        test_utils.assertDeepEqual(jsgui_util.v_divide(1), undefined);
        test_utils.assertDeepEqual(jsgui_util.v_divide(), undefined);
    });

    // -----------------------------------------------------
    //	vector_magnitude()
    // -----------------------------------------------------

    it("vector_magnitude() should calculate a magnitude", function () {
        test_utils.assertDeepEqual(jsgui_util.vector_magnitude([3, 4]), 5);
        test_utils.assertDeepEqual(jsgui_util.vector_magnitude([7, 24]), 25);
        test_utils.assertDeepEqual(jsgui_util.vector_magnitude([35, 12]), 37);
    });

    // -----------------------------------------------------
    //	distance_between_points()
    // -----------------------------------------------------

    it("distance_between_points() should calculate a distance", function () {
        // [x1, y1], [x2, y2] -> [x2,y2] - [x1,y1] -> [x2-x1, y2-y1]
        test_utils.assertDeepEqual(jsgui_util.distance_between_points([[1, 1], [5, 4]]), 5);
    });

    // -----------------------------------------------------
    //	execute_on_each_simple()
    // -----------------------------------------------------

    it("execute_on_each_simple() should iterate over items", function () {
        var pow2 = function (item) { return item * item; }
        //
        test_utils.assertDeepEqual(jsgui_util.execute_on_each_simple([1, 2, 3], pow2), [1, 4, 9]);
        test_utils.assertDeepEqual(jsgui_util.execute_on_each_simple({ a: 1, b: 2, c: 3 }, pow2), [1, 4, 9]);
    });

    // -----------------------------------------------------
    //	filter_map_by_regex()
    // -----------------------------------------------------

    it("filter_map_by_regex() should remove object props not matching to a regex", function () {
        test_utils.assertDeepEqual(jsgui_util.filter_map_by_regex({ a1: 1, a2: 2, b: 3 }, /a./), { a1: 1, a2: 2 });
        test_utils.assertDeepEqual(jsgui_util.filter_map_by_regex({ a1: 1, a2: 2, b: 3 }, /xxx/), {});
    });

    // -----------------------------------------------------
    //	npx()
    // -----------------------------------------------------

    it("npx() should add 'px' to numbers", function () {
        test_utils.assertDeepEqual(jsgui_util.npx(0), "0px");
        test_utils.assertDeepEqual(jsgui_util.npx("0"), "0");
        test_utils.assertDeepEqual(jsgui_util.npx([0, 1, "0", "1"]), ["0px", "1px", "0", "1"]);
    });

    // -----------------------------------------------------
    //	no_px()
    // -----------------------------------------------------

    it("no_px() should remove 'px' from strings", function () {
        test_utils.assertDeepEqual(jsgui_util.no_px(0), 0);
        test_utils.assertDeepEqual(jsgui_util.no_px("0"), "0");
        test_utils.assertDeepEqual(jsgui_util.no_px("0px"), 0);
        test_utils.assertDeepEqual(jsgui_util.no_px([0, "0", "1px"]), [0, "0", 1]);
    });

    // -----------------------------------------------------
    //	str_arr_mapify()
    // -----------------------------------------------------

    it("str_arr_mapify() should mapify a function...", function () {
        var fn = function (tagName) { return tagName + "+" };
        var fn_mapified = jsgui_util.str_arr_mapify(fn);
        //
        test_utils.assertDeepEqual(fn_mapified("h1 div"), { h1: "h1+", div: "div+" });
        test_utils.assertDeepEqual(fn_mapified(["h1", "div"]), { h1: "h1+", div: "div+" });
        //
        test_utils.assertDeepEqual(fn_mapified("h1"), "h1+"); // !!!
        test_utils.assertDeepEqual(fn_mapified(""), "+"); // !!!
        //
        test_utils.assertDeepEqual(fn_mapified(["h1"]), { h1: "h1+" });
    });

    // -----------------------------------------------------
    //	true_vals()
    // -----------------------------------------------------

    it("true_vals() should return values evaluated to true", function () {
        test_utils.assertDeepEqual(jsgui_util.true_vals({ a: true, b: false, c: 0, d: "0" }), [true, "0"]);
    });

    // -----------------------------------------------------
    //	str_hex_to_int()
    // -----------------------------------------------------

    it("str_hex_to_int() should convert hex to int", function () {
        test_utils.assertDeepEqual(jsgui_util.str_hex_to_int("0"), 0);
        test_utils.assertDeepEqual(jsgui_util.str_hex_to_int("a"), 10);
        test_utils.assertDeepEqual(jsgui_util.str_hex_to_int("aaa"), 2730);
        test_utils.assertDeepEqual(jsgui_util.str_hex_to_int("ABCD"), 43981);
        test_utils.assertDeepEqual(jsgui_util.str_hex_to_int(""), 0);
    });

    // -----------------------------------------------------
    //	arr_rgb_to_css_hex_6()
    // -----------------------------------------------------

    it("arr_rgb_to_css_hex_6() should convert rgb to css", function () {
        test_utils.assertDeepEqual(jsgui_util.arr_rgb_to_css_hex_6([0, 0, 0]), "#000000");
        test_utils.assertDeepEqual(jsgui_util.arr_rgb_to_css_hex_6([255, 255, 255]), "#FFFFFF");
    });

    // -----------------------------------------------------
    //	group()
    // -----------------------------------------------------

    it("group() should create group methods", function () {
        var data_object1 = new jsgui_util.Data_Object(); data_object1.set("Field1", 111);
        var data_object2 = new jsgui_util.Data_Object(); data_object2.set("Field1", 222);
        var data_object3 = new jsgui_util.Data_Object(); data_object3.set("Field1", 333);
        //
        var _group = jsgui_util.group(data_object1, data_object2, data_object3);
        //
        _group.set("Field2", 2000);
        //
        test_utils.assertDeepEqual(jsgui_util.stringify(data_object1), 'Data_Object({"Field1": 111, "Field2": 2000})');
        test_utils.assertDeepEqual(jsgui_util.stringify(data_object2), 'Data_Object({"Field1": 222, "Field2": 2000})');
        test_utils.assertDeepEqual(jsgui_util.stringify(data_object3), 'Data_Object({"Field1": 333, "Field2": 2000})');
    });

    // -----------------------------------------------------
    //	arr_ltrb
    // -----------------------------------------------------

    it("arr_ltrb should contain side names", function () {
        test_utils.assertDeepEqual(jsgui_util.arr_ltrb, ['left', 'top', 'right', 'bottom']);
    });

    // -----------------------------------------------------
    //	validators
    // -----------------------------------------------------

    it("validators[] should contain validator functions", function () {
        test_utils.assertDeepEqual(jsgui_util.validators.number(0), true);
        test_utils.assertDeepEqual(jsgui_util.validators.number("0"), false);
        test_utils.assertDeepEqual(jsgui_util.validators["number"]("0"), false);
    });

    // -----------------------------------------------------
    //	_data_generators
    // -----------------------------------------------------

    it("_data_generators should contain nothing", function () {
        test_utils.assertDeepEqual(jsgui_util._data_generators, {});
        //
        jsgui_util._data_generators['Data_Value'] = function () { return new jsgui_util.Data_Value(); };
        test_utils.assertDeepEqual(jsgui_util._data_generators['Data_Value'](), new jsgui_util.Data_Value());
    });

    // -----------------------------------------------------
    //	input_processors: optional_array
    // -----------------------------------------------------

    it("optional_array input processor should ...", function () {
        var ip = jsgui_util.input_processors['optional_array'];
        //
        // 2 arguments:
        //
        // if the second argument is not array, then return it as is:
        test_utils.assertDeepEqual(ip(['left', 'top', 'right', 'bottom'], "10px"), "10px");
        //
        // if the second argument is array, then return it as is
        // but if (the array length) > (firs argument length) return undefined
        test_utils.assertDeepEqual(ip(['left', 'top', 'right', 'bottom'], ["10px"]), ["10px"]);
        test_utils.assertDeepEqual(ip(['left', 'top', 'right', 'bottom'], ["10px", "20px"]), ["10px", "20px"]);
        test_utils.assertDeepEqual(ip(['left', 'top', 'right', 'bottom'], ["10px", "20px", "30px"]), ["10px", "20px", "30px"]);
        test_utils.assertDeepEqual(ip(['left', 'top', 'right', 'bottom'], ["10px", "20px", "30px", "40px"]), ["10px", "20px", "30px", "40px"]);
        test_utils.assertDeepEqual(ip(['left', 'top', 'right', 'bottom'], ["10px", "20px", "30px", "40px", "50px"]), undefined);
        //
        // 3 arguments:
        //
        //
        var save_input_processors = jsgui_util.input_processors;
        jsgui_util.input_processors = [];
        //
        // input processor for items:
        // ('optional_array' input processor passes 1 argument only to the input processor for items)
        jsgui_util.input_processors["add_plus"] = function (v) { return v + "+"; };
        //
        // if the third argument is not array, then return it processed:
        test_utils.assertDeepEqual(ip(['left', 'top', 'right', 'bottom'], "add_plus", "10px"), "10px+");
        //
        // if the second argument is array, then return it as is
        // but if (the array length) > (firs argument length) return undefined
        test_utils.assertDeepEqual(ip(['left', 'top', 'right', 'bottom'], "add_plus", ["10px"]), ["10px+"]);
        test_utils.assertDeepEqual(ip(['left', 'top', 'right', 'bottom'], "add_plus", ["10px", "20px"]), ["10px+", "20px+"]);
        test_utils.assertDeepEqual(ip(['left', 'top', 'right', 'bottom'], "add_plus", ["10px", "20px", "30px"]), ["10px+", "20px+", "30px+"]);
        test_utils.assertDeepEqual(ip(['left', 'top', 'right', 'bottom'], "add_plus", ["10px", "20px", "30px", "40px"]), ["10px+", "20px+", "30px+", "40px+"]);
        test_utils.assertDeepEqual(ip(['left', 'top', 'right', 'bottom'], "add_plus", ["10px+", "20px+", "30px+", "40px+", "50px+"]), undefined);
        //
        jsgui_util.input_processors = save_input_processors;
    });

    // -----------------------------------------------------
    //	input_processors: indexed_array
    // -----------------------------------------------------

    it("indexed_array input processor should ...", function () {
        var ip = jsgui_util.input_processors['indexed_array'];
        var ip_info = [['red', 'number'], ['green', 'number'], ['blue', 'number']];
        //
        // 2 arguments:
        //
        // if the second argument is not array, then return undefined:
        test_utils.assertDeepEqual(ip(ip_info, 255), undefined);
        //
        // if the second argument is array, then return it as is
        // but if (the array length) > (firs argument length) return undefined
        test_utils.assertDeepEqual(ip(ip_info, [255]), [255]);
        test_utils.assertDeepEqual(ip(ip_info, [255, 254]), [255, 254]);
        test_utils.assertDeepEqual(ip(ip_info, [255, 254, 253]), [255, 254, 253]);
        test_utils.assertDeepEqual(ip(ip_info, [255, 254, 253, 252]), undefined);
        //
        // 3 arguments:
        //
        //
        var save_input_processors = jsgui_util.input_processors;
        jsgui_util.input_processors = [];
        //
        // input processor for items:
        // ('indexed_array' input processor passes 1 argument only to the input processor for items)
        jsgui_util.input_processors["minus_100"] = function (v) { return v - 100; };
        //
        // if the third argument is not array, then return undefuned:
        test_utils.assertDeepEqual(ip(ip_info, "minus_100", 255), undefined);
        //
        // if the second argument is array, then return it as is
        // but if (the array length) > (firs argument length) return undefined
        test_utils.assertDeepEqual(ip(ip_info, "minus_100", [255]), [155]);
        test_utils.assertDeepEqual(ip(ip_info, "minus_100", [255, 254]), [155, 154]);
        test_utils.assertDeepEqual(ip(ip_info, "minus_100", [255, 254, 253]), [155, 154, 153]);
        test_utils.assertDeepEqual(ip(ip_info, "minus_100", [255, 254, 253, 252]), undefined);
        //
        jsgui_util.input_processors = save_input_processors;
    });

    // -----------------------------------------------------
    //	input_processors: n_units
    // -----------------------------------------------------

    it("n_units input processor should parse value", function () {
        var ip = jsgui_util.input_processors['n_units'];
        //
        test_utils.assertDeepEqual(ip("px", 10), [10, "px"]);
        //
        test_utils.assertDeepEqual(ip("px", "10mm"), [10, "mm"]);
        test_utils.assertDeepEqual(ip("px", "10 mm"), undefined);
        test_utils.assertDeepEqual(ip("px", "10x20"), [10, "x20"]);
        //
        test_utils.assertDeepEqual(ip("px", ".5mm"), [0.5, "mm"]);
        test_utils.assertDeepEqual(ip("px", "1.5mm"), [1.5, "mm"]);
        test_utils.assertDeepEqual(ip("px", "1.50 mm"), undefined);
        test_utils.assertDeepEqual(ip("px", "1.5x25"), [1.5, "x25"]);
        test_utils.assertDeepEqual(ip("px", "1.5x2.5"), undefined);
        //
        test_utils.assertDeepEqual(ip("10mm"), undefined);
    });

    // -----------------------------------------------------
    //	input_processors: color
    // -----------------------------------------------------

    it("color input processor should throw '!!stop'", function () {
        var ip = jsgui_util.input_processors['color'];
        //
        test_utils.assertDeepEqual(ip(["#090A0B"]), [9, 10, 11]);
        test_utils.assertDeepEqual(ip(["white"]), undefined);
        test_utils.assertDeepEqual(ip([1, 2, 3]), [1, 2, 3]);
    });

    // -----------------------------------------------------
    //	output_processors: color
    // -----------------------------------------------------

    it("color output processor should ...", function () {
        var op = jsgui_util.output_processors['color'];
        //
        test_utils.assertDeepEqual(op([0, 0, 0]), "#000000");
        test_utils.assertDeepEqual(op([255, 255, 255]), "#FFFFFF");
    });

    // -----------------------------------------------------
    //	jsgui.ensure_data_type_data_object_constructor('color');
    // -----------------------------------------------------

    it("jsgui.ensure_data_type_data_object_constructor('color');", function () {
        var data_object = new (jsgui_util.map_data_type_data_object_constructors['color'])();
        //
        test_utils.assertDeepEqual(data_object.stringify(), "Data_Object({})");
        test_utils.assertDeepEqual(data_object.fields(), []);
        test_utils.assertDeepEqual(data_object._data_type_name, "color");
    });

});



