
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../../jsgui-html"], function(jsgui) {
	
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
		'fields': [['name', ['app_rel_path', 'string']]]
	})
	
	
	var File_Tree = Control.extend({
		'fields': [['root_directory', 'data_object']],
		'init': function(spec) {
			this._super(spec);
			
			this.get('dom').set('tagName', 'div');
			this.get('dom').get('attributes').set('class', 'tree');
			
			
			
			var menu_bar = new Menu_Bar({
				'context': this._context
			});
			
			this.get('content').add(menu_bar);
			
			
			var main = new Control({'context': this._context});


			main.get('dom').set('tagName', 'div');
			main.get('dom').get('attributes').set('class', 'main');
			this.get('content').add(main);
			
			
			//  This will work both on the client and the server.
			//  There will be some branching during the init process.
			//   On the client it's going to be loading some info from the to_client JSON object.
			//    However, 
			
			// and we show the directory in there too.
			
			// need to look at the actual files.
			var that = this;
            
            
            
			//this.add_event_listener('set', function(target, name, set_args) {
			this.add_event_listener('set', function(event_params) {
				
				
				if (that == this) {
				    
				    console.log('event_params ' + stringify(event_params));
                    //throw 'stop';
                    
                    
                    
                    //console.log('sig ' + 
                    
                    //console.log('name ' + name);
                    //console.log('value ' + value);
                    //console.log('event_params ' + stringify(event_params));
                    
                    var property_name = event_params[0];
                    var property_value = event_params[1];
                    
                    if (property_name == 'root_directory') {
                        //console.log('File_Tree setting root directory');
                        
                        //property_value.set('app_rel_path', '/');
                        
                        // then add the root item display.
                        
                        // would be good to give it some properties at the beginning.
                        //  could use the 'set' command?
                        
                        
                        
                        var root_dir_view = new Directory_Item_View({
                            'name': '/',
                            'context': that._context
                        });

                        main.get('content').add(root_dir_view);
                        
                        // But inside that directory item view, there will be others.
                        
                        console.log('property_value ' + stringify(property_value));
                        //throw 'stop';
                        // don't get the contents of the property_value

                        //var root_directory_contents = property_value.get('contents');
                        var root_directory_contents = property_value;
                        // there should also be files in that directory's contents'
                        
                        //console.log('');
                        //console.log('property_value ' + stringify(property_value));
                        //console.log('root_directory_contents ' + stringify(root_directory_contents));
                        //throw('stop');
                        // then add the items that display the directory contents.
                        
                        // nope... we maybe don't take in these Directory objects.
                        //  Perhaps we don't need them, as extensions of Data_Object?
                        //  

                        console.log('root_directory_contents ' + stringify(root_directory_contents));

                        // directories, then files

                        var root_dir_view_subitems_content = root_dir_view.ctrl_subitems.get('content');

                        each(root_directory_contents.directories, function(i, directoryName) {
                        	// OK, this loop seems to take a very long time.

                        	console.log('directoryName ' + directoryName);
                        	var sub_dir_view = new Directory_Item_View({
                                'name': directoryName,
                                'context': that._context
                            });
                            console.log('pre add content ' + new Date().date);
                            root_dir_view_subitems_content.add(sub_dir_view);
                            console.log('post add content ' + new Date().date);
                        })

                        //throw 'stop';


                        /*
                        
                        each(root_directory_contents, function(i, v) {
                        //root_directory_contents.each(function(i, v) {
                            //console.log('i ' + i);
                            
                            //console.log('root_directory_contents ' + stringify(v));
                            
                            // with it as a Data_Object, we should be able to get it's class name.
                            //  __type_name;
                            
                            //for (var k in v) {
                            //	console.log('k ' + k);
                            //	
                            //}
                            
                            //console.log('v._class_name ' + v._class_name);
                            
                            // anyway, do instanceOf
                            

                            var is_directory = v instanceof Directory;
                            
                            //console.log('is_directory ' + is_directory);
                            
                            var is_file = v instanceof File;
                            
                            if (is_directory) {
    
                                var name = v.get('name');
                                //console.log('name ' + name);
                                
                                var sub_dir_view = new Directory_Item_View({
                                    'name': name,
                                    'context': that._context
                                });
                                // and set the content?
                                var v_contents = v.get('contents');
                                
                                //console.log('v_contents ' + stringify(v_contents));
                                
                                //console.log('v_contents.length() ' + stringify(v_contents.length()));
                                
                                // setting the model content?
                                //  the model would include the name of the object.
                                
                                // not setting the controls content I think.
                                //  If we are not adding to the controls...
                                //   If the content is not a control, it could do a content input filter.
                                //    So it can turn the model into something that interacts with the UI controls.
                                
                                // Polymorphism can check if something being added to the content is a user control or a model.
                                //  Will have ways to make the appropriate user control for a particular data_object.
                                //  map_data_object_ui_controls
                                //   and there will be different sorts of editors and viewers for different needs
                                //    admin
                                //    publish
                                
                                //sub_dir_view.set('content', )
                                if (v_contents.length() > 0) {
                                    //throw('stop');
                                    sub_dir_view.set_content_from_model(v_contents);
                                }
                                
                                
                                
                                
                                
                                //sub_dir_view.set()
                                //root_dir_view.get('content').add(sub_dir_view);
                                root_dir_view.ctrl_subitems.get('content').add(sub_dir_view);
                            }
                            
                            if (is_file) {
                                var name = v.get('name');
                                //console.log('name ' + name);
                                var file_view = new File_Item_View({
                                    'name': name,
                                    'context': that._context
                                });
                                
                                
                                
                                //root_dir_view.get('content').add(sub_dir_view);
                                root_dir_view.ctrl_subitems.get('content').add(file_view);
                                
                                
                            }
                            //ctrl_subitems
                            
                            //console.log('v ' + stringify(v));
                        })
                        */
                        
                        
                        //throw('3) stop');
                        
                        
                        
                        // create the 
                        
                        //file_tree.set('root_directory', property_value);
                        // set the root directory in the file tree.
                        //  the same 
                        //throw('stop');
                    }
				    
				    
				}
				
				
				
				
				
			});
			
			
			
			
		}
	}) ;
	
	var Item_View = Control.extend({
		'fields': [['name', 'string']],
		'class_name': 'Item_View',
		
		'init': function(spec) {
			
			// Want it so that the name field can be written during the initialization.
			//  Will depend on the chained fields.
			
			
			this._super(spec);
			var dom = this.get('dom');
			
			//dom.set('tagName', 'div');
			dom.get('attributes').set('class', 'item');
			
			// The item's likely to have a name.
			var content = this.get('content');
			// get the name from the spec?
			
			// and respond to the name being set?
			
			//  More work on controls will help.
			//   Give them more convenient methods. Make them faster too.
			var ctrl_expand_contract = new Control({'context': this._context});
			var cec_dom = ctrl_expand_contract.get('dom');
			//cec_dom.set('tagName', 'div');
			cec_dom.get('attributes').set('class', 'expansion button');
			content.add(ctrl_expand_contract);
			
			// or the name has been set by now and the span with the name can be created.
			
			// an icon, and the name next to it.
			
			var ctrl_icon = new Control({'context': this._context});
			//ctrl_icon.get('dom').set('tagName', 'div');
			ctrl_icon.get('dom').get('attributes').set('class', 'icon');
			
			content.add(ctrl_icon);
			
			var ctrl_item_info = new Control({'context': this._context});
			//ctrl_item_info.get('dom').set('tagName', 'div');
			ctrl_item_info.get('dom').get('attributes').set('class', 'info');
			content.add(ctrl_item_info);
			
			// then add a name control. this will have a text node inside.
			
			var ctrl_name = new Control({'context': this._context});
			//ctrl_name.get('dom').set('tagName', 'div');
			ctrl_name.get('dom').get('attributes').set('class', 'name');
			
			//var name = this.get('name').get();
			var name = this.get('name');
			console.log('name ' + stringify(name));
			
			//throw('stop');

			// Should be able to set the name, with the name as a Data_Value.


			
			var ctrl_tn_name = new jsgui.textNode({'text': name, 'context': this._context});
			ctrl_name.get('content').add(ctrl_tn_name);
			
			var ctrl_clearall_0 = new Control({'context': this._context});
			//ctrl_clearall_0.get('dom').set('tagName', 'div');
			ctrl_clearall_0.get('dom').get('attributes').set('class', 'clearall');
			content.add(ctrl_clearall_0);
			
			var ctrl_subitems = new Control({'context': this._context});
			//ctrl_subitems.get('dom').set('tagName', 'div');
			ctrl_subitems.get('dom').get('attributes').set('class', 'subitems');
			content.add(ctrl_subitems);
			
			this.set('ctrl_subitems', ctrl_subitems);
			
			var ctrl_clearall = new Control({'context': this._context});
			//ctrl_clearall.get('dom').set('tagName', 'div');
			ctrl_clearall.get('dom').get('attributes').set('class', 'clearall');
			content.add(ctrl_clearall);
			this.ctrl_subitems = ctrl_subitems;
			
			ctrl_item_info.add(ctrl_name);
		}
	});
	
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
	var File_Manager = Control.extend({
		'fields': [['root_directory', 'data_object']],
		
		'init': function(spec) {
			// can be given a list of files to show.
			
			// The files it's given may be much more of an MVC-type object that alerts it to changes in the files.
			
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
			
			var file_tree = new File_Tree({'context': this._context});
			//file_tree.set()
			
			// wire up the file tree's root directory to this object's root directory.
			//  maybe so they are actually the same object.
			
			this.get('content').add(file_tree);
			//throw 'stop';
			// something that listens for changes?
			//  will mean we can keep more code in init and use more local / private variables here.
			
			// just gets the target and the name of the event (ie set)?
			
			// Not sure that this gets called.
			var that = this;
			// Does the 'set' event listener get called?
			
			//this.add_event_listener('set', function(target, name, set_args) {
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
			// Let's have this show the root directory to start with.
		}
		// set_root?
	
	})
	
	var res = {
		'Directory': Directory,
		'File': File,
		'File_Manager': File_Manager
	}
	
	return res;
});