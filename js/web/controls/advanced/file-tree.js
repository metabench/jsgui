
//if (typeof define !== 'function') { var define = require('amdefine')(module) }

//define(["../../jsgui-html", "./plus-minus-toggle-button", "./vertical-expander", "./tree-node", './item-view'],
//	function(jsgui, Plus_Minus_Toggle_Button, Vertical_Expander, Tree_Node, Directory_Item_View) {

var jsgui = require('../../jsgui-html');
var Plus_Minus_Toggle_Button = require('./plus-minus-toggle-button');
var Vertical_Expander = require('./vertical-expander');
var Tree_Node = require('./tree-node');
var desc = jsgui.desc;
/*
var Directory_Item_View = require('./item-view').extend({
    'fields': {
        'path': String
    }
});
*/

var Directory_Item_View = require('./directory-item-view');

var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof;
var Control = jsgui.Control;

// A different control to consume the resource may be best.


// Client-side resource integration as well.


var File_Tree = Control.extend({

    // This can be expanded to support resources.

    // May be good to have a tree that has a relatively simple interface.
    //  Perhaps a heirachical resource tree.

    'fields': [['root_directory', 'data_object']],

    // Can also have a resource as a field.


    // and can listen for the root directory field changing.

    // However, can do asyncronous get on a resource, and deferred rendering.



    'init': function(spec) {
        this._super(spec);
        this.__type_name = 'file_tree';

        //this.get('dom').set('tagName', 'div');
        //this.get('dom').get('attributes').set('class', 'tree');
        this.add_class('tree');

        // I think that would be a Horizontal_Menu?


        /*

         var menu_bar = new Menu_Bar({
         'context': this._context
         });

         this.get('content').add(menu_bar);
         */




        var main = new Control({'context': this._context});


        //main.get('dom').set('tagName', 'div');
//main.get('dom').get('attributes').set('class', 'main');
        main.add_class('main');
        this.add(main);

        this.set('main', main);


        //  This will work both on the client and the server.
        //  There will be some branching during the init process.
        //   On the client it's going to be loading some info from the to_client JSON object.
        //    However,

        // and we show the directory in there too.

        // need to look at the actual files.
        var that = this;

    },
    'set_tree': function(tree) {
        var property_value = tree;

        var that = this;
        var main = this.get('main');

        var root_dir_view = new Directory_Item_View({
            'name': '/',
            'path': '/',
            'context': that._context
        });
        //root_dir_view.active();

        //main.get('content').add(root_dir_view);
        main.add(root_dir_view);

        // But inside that directory item view, there will be others.

        //console.log('property_value ' + stringify(property_value));
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

        //console.log('root_directory_contents ' + stringify(root_directory_contents));

        // directories, then files

        //var root_dir_view_subitems_content = root_dir_view.ctrl_subitems.get('content');



        each(root_directory_contents.directories, function(directoryName, i) {
            // OK, this loop seems to take a very long time.

            //console.log('directoryName ' + directoryName);
            var sub_dir_view = new Directory_Item_View({
                'name': directoryName,
                'path': '/' + directoryName,
                'context': that._context
            });
            sub_dir_view.add_class('directory');
            sub_dir_view.set('tree', that);
            //sub_dir_view.selectable();
            //sub_dir_view.active();

            // Probably best to give the item_views name properties here, that get sent to client...
            //  handle in item_view

            //console.log('pre add content ' + new Date().date);
            //root_dir_view_subitems_content.add(sub_dir_view);
            sub_dir_view.active();
            root_dir_view.get('ctrl_subitems').add(sub_dir_view);
            //console.log('post add content ' + new Date().date);
        });

        

        // go through the files.
        //  making new FileItemViews




    },
    'activate': function() {
      if (!this.__active) {
        this._super();


      }




        //});
    }





});
/*
 return File_Tree;
 });
 */

module.exports = File_Tree;
