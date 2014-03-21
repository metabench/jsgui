
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["../jsgui-html"], function(jsgui) {
    //This function is called when scripts/helper/util.js is loaded.
	
	var stringify = jsgui.stringify, fp = jsgui.fp, tof = jsgui.tof, extend = jsgui.extend, is_defined = jsgui.is_defined, str_arr_mapify = jsgui.str_arr_mapify;
	var clone = jsgui.clone, each = jsgui.each, data_type_instance = jsgui.data_type_instance;
	var data_type_instance = jsgui.data_type_instance;
	
	var str_hex_to_int = jsgui.str_hex_to_int, hex_rgb_6_match = jsgui.hex_rgb_6_match, arr_rgb_to_css_hex_6 = jsgui.arr_rgb_to_css_hex_6;
	
	var Data_Value = jsgui.Data_Value, Data_Object = jsgui.Data_Object, Collection = jsgui.Collection;
	var Control = jsgui.Control;
	
	var Sample_Click_Responder = Control.extend({
	
	});
	
	
	
	var Selectable_Control = jsgui.Control.extend({
		// This is not in the initialization part. This looks to be a more declarative way of programming.
		
		// I think these flags will go in the prototype chain. Like fields.
		//  need to express them as fields here?
		//  maybe that should not be necessary.
		
		// but these flags are not fields here... flags is a field.
		
		
		'flags': ['selectable']
		// so flags is a field?
		
		//'css_flags': ['selected', 'hidden']
	});
	
	// Simple_Controls as well? Maybe in the production version.
	
	// Could have different layouts...
	
	// Make it so that 'internal_content' refers to the body's content.
	//  That would be an internally linked field.
	
	
	var Basic_Page = jsgui.Control.extend({
	    'fields': [
	        ['title', String],
	        
	        // Want it so that the content gets added to the body.
	        //  So there is a content placeholder?
	        
	        // Something for modifying the content?
	        //  A set function for the content.
	        //  Override set, but for the content?
	        //   Or, create a 'content' setter.
	        //   Set will refer to the setters (or fns_setters) to set properties in some cases.
	        //    So it will set the content inside the body, rather than normally.
	        //    Perhaps nested property shortcuts?
	        //     So we can set the content using .set.
	        //     
	        
	        // and these items are fields that are set.
	        //  will need to create the actual subcontrols though.
	        
	        ['header', Control],
	        ['main', Control],
	        ['footer', Control],
	        
	        // It should have that content is a collection anyway.
	        ///  Want it so that when setting and getting content, it refers to the body's content.
	        //   Don't want that when rendering though.
	        
	        
	        
	        
	        //['content', Collection(Control)],
	        
	        
	        ['menu', Collection(Control)]
	    ],
	    'init': function(spec) {
	        this._super(spec);
	        
	        var context = this._context;
	        
	        var header = new jsgui.Control({'context': context});
	        var main = new jsgui.Control({'context': context});
	        var footer = new jsgui.Control({'context': context});
	        
	        this.content().add(header);
	        this.content().add(main);
	        this.content().add(footer);
	        
	        this.inner_content = main.content;
	        
	    }
	    
	});
	
	
	var res = {
		'Sample_Click_Responder': Sample_Click_Responder,
		'Selectable_Control': Selectable_Control,
		'Basic_Page': Basic_Page
	}
	
	return res;
	
});