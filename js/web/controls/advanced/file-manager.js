
//if (typeof define !== 'function') { var define = require('amdefine')(module) }

//define(["../../jsgui-html", "./item-view", "./file-tree"], function(jsgui, Item_View, File_Tree) {

var jsgui = require('../../jsgui-html');
var Item_View = require('./item-view');
var File_Tree = require('./file-tree');

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
	var Data_Object = jsgui.Data_Object;
	var Control = jsgui.Control;
	var Collection = jsgui.Collection;

	// replace with File_System_Admin
	//  Would access the File_System as a resource.
	//   That would be a useful programmatic construct, so that the file system would work over
	//    http, but be available after callbacks, as an object, in the client app.
	//   Such interfaces would work for connecting to different file systems.

	// control-resource-file-system
	//  Makes sense as the GUI to a file system, implemented as a jsgui control.

	// Want this to work on the client as well.

	// Will be given a path.
	//  Will be given files info.
	//  Won't call upon node.js functionality.

	// This can simply be the user interface control, and other code is the actual interface to the file system.
	//  Could possibly take a file system resource.

	// Doing a bit more work on the server, revealing a file system (as a resource) would make sense.
	//  Having it go through that abstraction makes sense.



	// Data_Object classes for File and Directory?
	//  Lots of these getting stored, need a structure to keep them in.

	// give it a contents field, which is a collection.
	//  will index the collection by object type, so that all files or all directories can be retrieved from it relatively easily.

	// Directory has a path variable?
	//  A directory can be the root?

	// could be a File_System_Object in the contents.

	// Directory able to handle a path that is not the root - application relative.
	// app_rel_path.

	// These objects should be defined as part of the resources.

	var Directory = Data_Object.extend({
		//'fields': [['contents', 'collection'], ['name', 'string'], ['app_rel_path', 'string']],
		'fields': [['contents', 'collection'], ['name', 'string'], ['app_rel_path', 'string']],
		'set_contents': function(new_contents) {
			// The object could simply be a JSON object.
			//console.log('');
			//console.log('new_contents ' + stringify(new_contents));
			//console.log('tof new_contents ' + tof(new_contents));
			//throw 'stop';
			// go through the directories, and the files

			// Not sure about having to get the contents...
			//  What about just using get
			//  And .meta for metadata to do with the object?


			// create the various items, if this directory does not already have them (maybe replace them if they are different).
			var contents = this.get('contents');

			// does not get the collection, gets the contents of the collection.
			contents.clear();

			//this.set('contents')
			// actually want to deal with the collection object sometime.
			// Lazy loading for the fields.

			//this.get('contents')
			var path_name = new_contents[0];
			var path_contents = new_contents[1];

			//console.log('');
			//console.log('path_contents ' + stringify(path_contents));
			//console.log('path_contents ' + stringify(path_contents));

			//var coll_contents = this._.contents;
			//coll_contents.clear();

			var context = this._context;

			if (path_contents) {
				each(path_contents.directories, function(i, dir_info) {

					//console.log('dir_info ' + stringify(dir_info));
					//throw('stop');

					//console.log('dir_name ' + dir_name);
					//console.log('tof(dir_info) ' + tof(dir_info));
					if (tof(dir_info) == 'array') {
						// otherwise it has contents.
						//
						//console.log('');
						//console.log('dir_info ' + stringify(dir_info));
						var name = dir_info[0];
						var content = dir_info[1];

						var subdir = new Directory({
							'name': name,
							'context': context
						});
						subdir.set_contents(dir_info);

						//throw 'stop';
						contents.add(subdir);
					} else if (tof(dir_info) == 'string') {
						var subdir = new Directory({
							'name': dir_info,
							'context': context
						});
						//subdir.set('name', dir_name);
						//console.log('subdir._ ' + stringify(subdir._));
						contents.add(subdir);
					}

				});
				each(path_contents.files, function(i, file_info) {
					//console.log('tof(file_info) ' + tof(file_info));

					if (tof(file_info) == 'array') {
						var file_name = file_info[0];
						var file_info = file_info[1];

						var file = new File({
							'name': file_name,
							'context': context
						})

						contents.add(file);

						//console.log('(file_info) ' + stringify(file_info));

						// we can create the new file object here
					}
				});
			}
			//throw 'stop';
		}
	});

	// set contents... can give it contents from a JSON object.
	//



	// File metadata.
	var File = Data_Object.extend({
		//'fields': [['name', ['app_rel_path', 'string']]]
		'fields': {
			'app_rel_path': String
		}
	})



	// Will change this to a directory-tree-node.
	//  They will be put together as a tree in  a standard way.
	//  Should be able to load inner contents (from resource?)





	var Directory_Item_View = Item_View.extend({
		'class_name': 'Directory_Item_View',

		'init': function(spec) {
			this._super(spec);
			// also the name...
			//  will be constructing itself out of some properties given?

			// or when responding to properties being set?
			//  Think in response to properties being set, but could do that cleanly after a first run of properties.
			this.get('dom').get('attributes').set('class', 'directory item control');

			//this.add_event_listener('set', function(target, name, set_args) {


			this.add_event_listener('set', function(set_args) {
				//console.log('name ' + name);
				//console.log('value ' + value);
				//console.log('set_args ' + stringify(set_args));

				var property_name = set_args[0];
				var property_value = set_args[1];

				//console.log('property_name ' + property_name);

			});
		},
		'set_content_from_model': function(model_content) {
			var content = this.get('content');
			// then get the subitems from within the content.
			//var sub_items

			// should be controls (at this stage);

			// Default user interface controls for types of Data_Object.
			var ctrl_subitems = this.get('ctrl_subitems');
			//console.log('ctrl_subitems ' + ctrl_subitems);
			//throw('stop');
			var ctrl_subitems_content = ctrl_subitems.get('content');

			//console.log('model_content ' + stringify(model_content));
			var that = this;
			var context = that._context;
			if (model_content instanceof Collection) {

				// really want to get the directories and then the files separately.
				//  the Collection should be indexed by the type of object in there.
				// Luckily the collection already provides them in that order.

				model_content.each(function(i, v) {
					//console.log('v ' + stringify(v));

					var is_directory = v instanceof Directory;
					var is_file = v instanceof File;

					if (is_directory) {
						var ctrl_directory = new Directory_Item_View({
							'name': v.get('name'),
							'context': context
						});
						// and add all thge items to that directory control.

						var vc = v.get('contents');
						var vcl = vc.length();

						if (vcl > 0) {
							// set the content of the new ctrl.
							ctrl_directory.set_content_from_model(vc);
						}

						ctrl_subitems_content.add(ctrl_directory);

					}
					if (is_file) {
						var ctrl_file = new File_Item_View({
							'name': v.get('name'),
							'context': context
						});

						ctrl_subitems_content.add(ctrl_file);
					}


				})

			}

			//throw 'stop';
		}
	});
	var File_Item_View = Item_View.extend({
		'class_name': 'File_Item_View',
		'init': function(spec) {
			this._super(spec);

			// also the name...
			//  will be constructing itself out of some properties given?

			// or when responding to properties being set?
			//  Think in response to properties being set, but could do that cleanly after a first run of properties.
			this.get('dom').get('attributes').set('class', 'file item control');



		}
	});

	// File_System_Item_View
	//  For either a directory or a file.



	var Menu_Bar = Control.extend({
		'init': function(spec) {
			this._super(spec);
			this.get('dom').set('tagName', 'div');
			this.get('dom').get('attributes').set('class', 'menu bar control');
		}
	});

	// Tree_Item_View
	//  Can be used to represent a file or directory

	// Item_View
	// List_Item_View
	// Grid_Item_View
	// Item_View
	// Item_Editor_View
	// Item_Full_View

	// it's still a DIV.

	// File_Manager would have the tree on the left and item view on the right.



	var File_Manager = Control.extend({
		'fields': [['root_directory', 'data_object']],

		'init': function(spec) {
			// can be given a list of files to show.

			// The files it's given may be much more of an MVC-type object that alerts it to changes in the files.
			var that = this;

			// This is likely to hold a whole tree structure of files, and make use of some MVC.
			//  Won't need as much in the way of MVC when purely running on the server.
			//   On the client, it can subscribe to directory change events, perhaps using Socket.IO.

			// Has a collection of files?
			//  Has a collection of files within a path.

			// Just showing the files within a path...

			//  The file manager should have a tree / list on the left.

			//  There should be a data structure holding the tree contents.

			// Can give the root directory of the file manager.
			//  The root should really be the application root directory.

			// This won't handle node.js interaction though, won't read actual files.

			// will be given directory contents (maybe as JSON) to represent.

			// This could be given plenty of information for its file system.
			this._super(spec);
			this.__type_name = 'file_manager';
			that.add_class('file-manager');
			//throw 'stop';
			//this.get('dom').set('tagName', 'div');
			//this.get('dom').get('attributes').set('class', 'file_manager');

			// Will show a File_Tree
			//  And a File_System_Object_View
			//   Can view a file or a directory.
			//    Potentially this will automatically have files in edit mode.
			//     Or there will be a simple lock and unlock functionality.
			//      May make it easy to go back to previous versions as well - could keep track of them.

			// responding to when the files are set...
			//  we need some kind of file data input processor for this.

			// Would maybe be best using the fields system..

			// File_Manager.set_files...
			//  would be a temporary means to set the root directory's files?

			// will have a file_system_resource.

			var filesystem_resource = spec.filesystem_resource;


			// Should try getting the root directory listing, and render that in the first render.
			//  May have been given a path already, will need to deal with that.
			var file_tree = new File_Tree({'context': that._context});
			that.add(file_tree);
			that.active();

			this.set('file_tree', file_tree);

			if (typeof document === 'undefined') {
				this.__status = 'waiting';
				filesystem_resource.get('/', function(err, res_fs_get) {
					if (err) { throw err; } else {
						console.log('res_fs_get', res_fs_get);

						//console.log('filesystem_resource', filesystem_resource);
						var selection_scope = that._context.new_selection_scope(that);
            that.set('selection_scope', selection_scope);

						file_tree.set_tree(res_fs_get);



						//that.selection_scope();
						//file_tree.set()

						// wire up the file tree's root directory to this object's root directory.
						//  maybe so they are actually the same object.

						that.set('dom.attributes.data-jsgui-fields', stringify({
								'selection_scope': selection_scope
						}).replace(/"/g, "[DBL_QT]").replace(/'/g, "[SNG_QT]"));


						//throw 'stop';


						that.__status = 'ready';
						that.trigger('ready');
					}
				});

			}







			//throw 'stop';
			// something that listens for changes?
			//  will mean we can keep more code in init and use more local / private variables here.

			// just gets the target and the name of the event (ie set)?

			// Not sure that this gets called.

			// Does the 'set' event listener get called?

			//this.add_event_listener('set', function(target, name, set_args) {

			/*
			this.add_event_listener('set', function(event_params) {
				// Does not seem to be listening for the set event?


			    //throw 'stop';

			    // target = this;

			    // need to check the target?
			    //console.log('that == this ' + that == this);


			    if (that == this) {

                    console.log('event_params ' + stringify(event_params));


                    //console.log('target ' + target);
                    //console.log('name ' + name);
                    //console.log('value ' + value);
                    //console.log('set_args ' + stringify(set_args));

                    var property_name = event_params[0];
                    var property_value = event_params[1];
                    console.log('property_value ' + stringify(property_value));
                    //throw 'stop';

                    if (property_name == 'root_directory') {
                        //console.log('setting root directory');

                        //property_value.set('app_rel_path', '/');


                        console.log('property_value ' + stringify(property_value));
                        //throw('4) stop');
                        file_tree.set('root_directory', property_value);
                        // set the root directory in the file tree.
                        //  the same

                        //throw('stop');
                    }

			    }

			});
			*/
			// Let's have this show the root directory to start with.
		},
		'activate': function() {
			this._super();
			var file_tree = this.get('file_tree');



		}
		// set_root?

	})

	var res = {
		'Directory': Directory,
		'File': File,
		'File_Manager': File_Manager
	}

/*
	return res;
});
*/

module.exports = res;
