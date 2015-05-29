
var jsgui = require('../../jsgui-html');
var Item_View = require('./item-view');

var j = jsgui;
var Class = j.Class;
var each = j.eac;
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
var Data_Object = jsgui.Data_Object;
var Control = jsgui.Control;
var Collection = jsgui.Collection;

var Directory_Item_View = Item_View.extend({
  'init': function(spec) {
    this._super(spec);
    this.__type_name = 'directory_item_view';

  },
  'activate': function() {
    if (!this.__active) {
      this._super();

      //console.log('activate directory_item_view');

      var that = this;

      var context = this._context;
      var rp = context.resource_pool;
      var fs = rp.get_resource('File System');

      that.on('expand', function(e_expand) {
          //console.log('item view expand e_expand', e_expand);

          var item_name = that.get('name');
          //console.log('item_name', item_name);

          var item_path = that.get('path').value();
          //console.log('item_path', item_path);

          // OK, maybe don't get it to work so recursively.

          fs.get(item_path, function(err, fs_res) {
              if (err) { throw err; } else {
                  //console.log('fs_res', fs_res);

                  // Now we have the results, we should add make a new items for them, and add them to the directory control.

                  // For the moment will only add directory items.

                  each(fs_res.resource.data.directories, function(directoryName) {
                      // OK, this loop seems to take a very long time.

                      //console.log('directoryName ' + directoryName);
                      var sub_dir_view = new Directory_Item_View({
                          'name': directoryName,
                          'path': item_path + '/' + directoryName,
                          'context': context
                      });
                      sub_dir_view.set('tree', that);

                      //sub_dir_view.active();


                      //console.log('pre add content ' + new Date().date);
                      //console.log('sub_dir_view', sub_dir_view);
                      //console.log('selected_ctrl', selected_ctrl);





                      var ctrl_subitems = that.get('ctrl_subitems');
                      //ctrl_subitems.active();
                      //console.log('ctrl_subitems', ctrl_subitems);
                      //ctrl_subitems.activate();

                      //console.log('ctrl_subitems', ctrl_subitems);
                      //console.log('sub_dir_view', sub_dir_view);



                      //var cached_control = context.map_controls[ctrl_subitems._id()]
                      sub_dir_view.active();
                      //console.log('');
                      //console.log('');
                      //console.log('');

                      ctrl_subitems.rec_desc_ensure_ctrl_el_refs();

                      ctrl_subitems.add(sub_dir_view);
                      //

                      //sub_dir_view.activate();
                      //sub_dir_view.activate();
                      //sub_dir_view.activate();


                      //sub_dir_view.activate_recursive();

                      // seems like the control has not been assigned its dom element.


                      //sub_dir_view.selectable();
                      // Need to work on

                      //console.log('sub_dir_view', sub_dir_view);
                      // should be activated in terms of jsgui by now.
                      sub_dir_view.activate();

                      //activate_item(sub_dir_view);



                      //console.log('post add content ' + new Date().date);
                  });


              }
          });
      });
      that.on('contract', function(e_contract) {
          //console.log('item view contract', e_contract);

          // We know which control it was, so we can then get it to load those files.
          //console.log('selected_ctrl.value()', selected_ctrl.value());
          var item_name = that.get('name');
          //console.log('item_name', item_name);

          // not sure why .value() for the moment
          var item_path = that.get('path').value();
          //console.log('item_path', item_path);

      });

    }
  }
})

module.exports = Directory_Item_View;
