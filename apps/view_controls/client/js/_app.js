// jsgui-client

// require a whole bunch of things


// need to have the extra information to initialize the various objects.
//  part of the server-side rendering would be identifying objects and relevant properties to send to the client.
//  for example, that something is a particular control.

//  identify ids by control.
// then there is separate client-side code...
//  or controls (perhaps advanced ones) have got various events on them that respond to client-side io, but can get used on the server as well,
//   perhaps with these client-side events called for testing.
// Application code would likely build views both on the server and the client, and have the interacton done on the client, while also using the
//  for its API, dealing with larger amounts of data than in the initial view.

// Will use particular client files...
//  Maybe have all the logic in one component.
//  Will have different means of loading and activation as well.
//   May be easier when the whole jsgui is in one file, or at least a large core.

// Likely to include a client-side component.
//  Like load a particular file which will include some particular jsgui client code.

// Loading a control set would be useful at times.

// Seems like quite a hassle to list a lot of controls on the client, and then pass them through to the activation
//  mechanism. However, it seems like code will work when following that path, and then some of it could maybe be
//  abstracted.

// Perhaps the documentation project should use an online documentation system.
//  Need to get this resources system more up and running and tested.

// Want to have it so that a node process can hold data in memory, and expose it as a resource.

// Having a reliable, easy to use back-end service would make a lot of sense.

// Being able to connect the system to a local postgres database would be nice.
//  Should do more work on postgres db generation.
//  Should also get office and visio.






requirejs(["./web/jsgui-html-client", "./web/client-page-context", "./web/controls/advanced/web-admin", "./web/controls/advanced/flexiboard",


"./web/controls/advanced/viewer/object", "./web/controls/advanced/viewer/array",
"./web/controls/advanced/viewer/object-kvp",
"./web/controls/advanced/viewer/basic/string", "./web/controls/advanced/viewer/basic/number",

"./web/controls/advanced/editor/object", "./web/controls/advanced/editor/array",
"./web/controls/advanced/editor/object-kvp",
"./web/controls/advanced/editor/basic/string", "./web/controls/advanced/editor/basic/number",
"./web/controls/advanced/resource-pool", "./web/controls/advanced/single-line"


],
//requirejs(["/js/web/jsgui-html.js"],
//requirejs(["/js/web/controls/advanced/web-admin.js"],
function (jsgui, Client_Page_Context, Web_Admin, Flexiboard, 
    Object_Viewer, Array_Viewer, Object_KVP_Viewer, String_Viewer, Number_Viewer,
    Object_Editor, Array_Editor, Object_KVP_Editor, String_Editor, Number_Editor,
    Ctrl_Resource_Pool, Single_Line) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    //var Data_Object = jsgui.Data_Object, Control = jsgui.Control, Collection = jsgui.Collection;
    //var stringify = jsgui.stringify, tof = jsgui.tof;
    console.log('running client function.');
    // However, to activate properly, in this context, we may need loads of references.
    //  That seems likely to be the best way to do it at this stage.

    // So far, there does not seem to be a large amount of controls brought into a group, ready to use.
    //  Some have been put into jsgui, from the html module.

    // I think that by combining references, we'll be able to make a lookup table.

    // Meaning use the keys from Web_Admin, and put them in jsgui.controls.
    // jsgui.map_controls
    var each = jsgui.each, stringify = jsgui.stringify;
    //jsgui.update_ctrl_lookup('web_admin', Web_Admin);
    //jsgui.update_ctrl_lookup(Object_Viewer);

    // Perhaps we could set up the Client_Page_Context here.
    //  Then links needed for activation could be stored there.
    // Client_Page_Context would likely have a Resource Pool.

    // And the client-side page context will also have a client-side resource pool.
    //  That pool is going to coordinate with the server-side one, or server side resource pools.
    //   The client side one needs to be flexible in a few ways, possibly connecting using different methods
    //   to different remote servers. It may be possible to include a variety of data resources in a client-side
    //   resource pool. It's goal is really to make it easier to access various (async) data resources from within the
    //   client.


    var pc = new Client_Page_Context({
        'document': document
    });

    // Page_Context could have become enhanced.
    //  The enhanced version would raise an 'edge' event when something is dragged to an edge.
    //  edge_drag
    //   could mean that an indicator then gets put in the DOM.

    // It may be better if much of the logic here was encapsulated inside the library.
    //  Making it so that the drag and drop and docking gts handled by the web admin,
    //   maybe a web admin page control.

    // then just access a map of controls.

    //cpc.map_controls[]

    // Ways of loading module collections or groups?
    
    /*

    pc.update_Controls('web_admin', Web_Admin);
    pc.update_Controls('flexiboard', Flexiboard);

    pc.update_Controls('object_viewer', Object_Viewer);
    pc.update_Controls('array_viewer', Array_Viewer);
    pc.update_Controls('object_kvp_viewer', Object_KVP_Viewer);
    pc.update_Controls('string_viewer', String_Viewer);
    pc.update_Controls('number_viewer', Number_Viewer);


    pc.update_Controls('object_editor', Object_Editor);
    pc.update_Controls('array_editor', Array_Editor);
    pc.update_Controls('object_kvp_editor', Object_KVP_Editor);
    pc.update_Controls('string_editor', String_Editor);
    pc.update_Controls('number_editor', Number_Editor);

    pc.update_Controls('ctrl_resource_pool', Ctrl_Resource_Pool);
    pc.update_Controls('single_line', Single_Line);

    //pc.update_Controls('object_viewer', Object_Viewer);

    */
    //throw 'stop';

    //cpc.update_ctrl_lookup('web_admin', Web_Admin);
    //cpc.update_ctrl_lookup(Object_Viewer);
    
    

    jsgui.activate(pc);


    // This is just activating...
    //  The controls have been put together on the server.
    //  An opportunity for purely client side JS.


    // then it would be good to have a map of the controls.
    //  Can we get that from the Page_Context?

    // We could have the controls get more explicit names....

    //console.log('page context', pc);

    // Maybe having a page control would be of use.
    //  Something that is supposed to take up the whole page.


    // from

    /*

    var mc = pc.map_controls;
    var map_type_arr_ctrls = {};
    var ctrl_types = [];
    var map_control_type_count = {};

    each(mc, function(name, ctrl) {
        var type = ctrl.__type_name;
        //console.log('type ' + type);

        if (!map_type_arr_ctrls[type]) {

            ctrl_types.push(type);
            map_type_arr_ctrls[type] = [];
            map_control_type_count[type] = 1;
        } else {
            map_control_type_count[type]++
        }

        //map_type_arr_ctrls[type] = map_type_arr_ctrls[type] || [];

        map_type_arr_ctrls[type].push(ctrl);
    });
    //console.log('ctrl_types', stringify(ctrl_types));
    //console.log('map_control_type_count', stringify(map_control_type_count));


    //var ctrl_web_admin = map_type_arr_ctrls['web_admin'][0];
    //console.log('ctrl_web_admin ' + ctrl_web_admin);
    // flexiboard
    if (map_type_arr_ctrls['flexiboard']) {
        var flexiboard = map_type_arr_ctrls['flexiboard'][0];
        flexiboard.set('dockable', true);
        
    }
    */
    

    // Running web admin as a page control...
    //  Not sure about running it differently?
    
    //ctrl_web_admin.make_full_height();

    //pc.set('full_window', ctrl_web_admin);
    //pc.full_window = ctrl_web_admin;

    // Make it so that the ctrl_web_admin has got docking regions.
    //  Configure them as page docking regions?

    // Not quite sure what the web admin control is going to do.
    //  It could operate in full page mode, possibly in mini mode where it gets represented as an icon and gets expanded.

    // Building another frame around a control.
    // Docking a control in some places without creating new elements.

    // I think for docking having some container controls makes sense.
    //  Though could make it so that controls can have their own internal or external docking regions.

    // There are quite a few ways to do this.
    //  Want to define that something can be docked to the corners of the window.
    //  That may imply it floats on top of the UI.
    //  Possibly there is less space for internal UI.

    // This could work under some normal drag and drop principles.
    //  So we drag a control (have that at the moment) and can drop it in specific areas.
    //   Tell the Page Context for it to listen out for dragging to the corners of the page.
    //    Possibly other areas.
    //   The page context could then raise events, or there are controls that subscribe to it.

    // Not a control, but a control controller?
    //  Docking_System
    //   Listens to Page_Context events, and indicates docking that can be done.
    //   Much needs to happen in the background to allow easy configuration.

    // In this case, it may be told that ctrl_web_admin is a full window control.
    //  Can stick with that assumption for the moment.
    //  Web-Admin-Control already has a top bar.
    //   Maybe need to say this is different to a title bar like in the floating window.

    // Can have a variery of dock / undock commands.
    //  And we then say that the control docks to a specific place.

    // 


    // That would be a useful bit of functionality.
    //  Once the drag and drop events are done, the actual docking can take place.

    // The control itself could be responsible for setting up dock locations.
    //  Top, bottom, left, right.
    // Don't want really complicated CSS or too many DIVs.

    // setting up dock zones

    // Perhaps a Multi_Dock control would be useful.
    //  A Grid_9
    //   If the web admin control had that to start with, or was configured with it on activation, then it would be easier to dock
    //   controls into position in that control.


    //ctrl_web_admin.grid_9();



});


