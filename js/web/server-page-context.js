if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./jsgui-html"], 

	function(jsgui) {
	
	// This should be running in node.js
	
	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;
	// Need to find out what this one requires to put it in its own module.
	var Server_Page_Context = jsgui.Page_Context.extend({
		'init': function(spec) {
			spec = spec || {};
    		if (spec.req) {
    			this.req = spec.req;
    			this.request = spec.req;
    		} else if (spec.request) {
    			this.req = spec.request;
    			this.request = spec.request;
    		};

            if (this.req.auth) {
                this.auth = this.req.auth;
            }

    		if (spec.res) {
    			this.res = spec.res;
    			this.response = spec.res;
    		} else if (spec.response) {
    			this.res = spec.response;
    			this.response = spec.response;
    		};

            this.selection_scope_count = 0;

            // Perhaps things could be more sandboxed, so that controls don't get access to the resource pool by default.
            //  Maybe only a small number of controls should have access to this.
            
            

            if (spec.pool) {
                this.pool = spec.pool;
            }
    		
    		if (spec.rendering_mode) {
    			this.rendering_mode = spec.rendering_mode;
    		}
    		
    		this._super(spec);
    		
    		// The item IDs could be handled here... use the local variable closure here.


    		var map_new_ids = {};
    		// and have the objects registered within the context too.
    		
    		var map_objects = {};
    		
    		var _get_new_typed_object_id = function(type_name) {
    			if (!is_defined(map_new_ids[type_name])) {
    				map_new_ids[type_name] = 0;
    			}
    			//if (!is_defined(map_new_ids[type_name]) {
    			//	map_new_ids[type_name] = 0;
    			//}
    			var res = type_name + '_' + map_new_ids[type_name];
    			map_new_ids[type_name]++;
    			return res;
    		}
    		
    		this.new_id = _get_new_typed_object_id;
    		
		},
		'get_dtd': function() {
			if (this.rendering_mode == 'html5') {
				return '<!DOCTYPE html>';
			}
		},
        'new_selection_scope': function(ctrl) {

            // Will a selection scope be able to apply to more than 1 control?
            //  Perhaps it could be useful, but not right now.


            // Set the control's jsgui-data field of selection_scope to be the number

            var num = this.selection_scope_count++;
            ctrl.set('selection_scope', num);




            return num;
        }
        // selection scopes...
        //  I think selection scopes will just be numbers on the server
        //   It will render the selection scopes as jsgui fields that get transferred to the client.
        //    On the client, the selection scope will be obtained by id from the client_page_context.




		
		//get id's of particular types of items...
		
	});
	// Also want a File_Server.
	//  Want files to be served from a particular path, as a resource in the URL system.
	//  Will be able to post files there with the right permission.
	
	
	return Server_Page_Context;
	
	
});