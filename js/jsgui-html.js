

// The HTML module needs to use the lang module. It will extend the jsgui object and return it.

// Perhaps it is best to split this one up.
//   Maybe if its clearer where to draw the line

// There is the 'ctrl'
//  Descriptions of ctrl data and html / css
// Extensions from core to handle more HTML (textNode), and other controls that have been made.

// Keeping this in one file for the moment would help keep track of the size of html-specific code.
//  It is nice to see that there is not so much right now. The extensive language section will keep this simple.

// This has become much more concise. Need it to do event handling.
//  Perhaps could use jQuery to do so. However want this to be swappable.
//  Different builds - when using jQuery could hold wrapped elements in the controls.
//  Won't make so much difference using the $ function again if they are not wrapped though.

// PageContext may specify which way of doing things.
//  Likely to load in separate code when using older browsers.

// It's mainly for handling events though... perhaps this could be in the library itself.

// This is no longer just for the mobile browser - need this to be in general (assume good HTML), but can load in other toolkits if needed
//  like for IE or different event models.

// Was using 'this.$.bind'.
//  Could even get the bind function out of jQuery - it works nicely, maybe put that into the library.
//  Could have mobile-client (modern)
//  jsgui-browser-support-ie
//   a few modules.
//   maybe other browser support modules like jsgui-vector-vml
//   they could get built together and sent to the client as a smaller file.

// Making it so it does not assume there is jQuery
//  But assumes that there are some jsgui functions, like _dom_bind that work with the w3c API, could use jQuery.
// These functions would be really simple in the standard W3C html version but would use jQuery or some specific / extracted bind code from jQuery.














define(["jsgui-lang"], function(jsgui) {
    //This function is called when scripts/helper/util.js is loaded.
	
	var stringify = jsgui.stringify, fp = jsgui.fp, tof = jsgui.tof, extend = jsgui.extend, is_defined = jsgui.is_defined, str_arr_mapify = jsgui.str_arr_mapify;
	var clone = jsgui.clone, each = jsgui.each, data_type_instance = jsgui.data_type_instance;
	var data_type_instance = jsgui.data_type_instance;
	
	var str_hex_to_int = jsgui.str_hex_to_int, hex_rgb_6_match = jsgui.hex_rgb_6_match, arr_rgb_to_css_hex_6 = jsgui.arr_rgb_to_css_hex_6;
	// needs to extend the core's data types.
	// may have function to do this that sets up the cached maps for those data types.
	
	// and extend some more native data types too?
	//  for handling dom nodes here?
	//  but can say it is an object with a few particular properties - can even define these. Could help with making a GUI or an IDE.
	
	extend(jsgui.data_types_info, {
		
		// color rgba?
		// 'number' may prove to be a native type.
			// color may be native - it breaks something down from a hash value code.
		'color': ['indexed_array', [['red', 'number'], ['green', 'number'], ['blue', 'number']]],
		//  have input processors here? or another section?
		
		// and , ['alpha', 'number']
		
		'oltrb': ['optional_array', ['left', 'top', 'right', 'bottom']],
			
		// and may fit custom ones in - maybe that pass regex
		'border_style': ['any', ['solid', 'dotted', 'dashed']],
		'distance': ['n_units', 'px'],
			
		// should maybe put a directive here.
		//  indexed_array
		'single_border': ['indexed_array', [['width', 'distance'], ['style', 'border_style'], ['color', 'color']]],
		
		'border': ['oltrb', 'single_border'],
		
		'margin': ['oltrb', 'distance'],
		
		// index auto-numbering so that each item has a unique integer.
		//  but auto-incrementing within container.
		/// maybe container_int_sequence?
		// int_seq_in_container
		// index_in_container.
		
		'control_collection': ['DataCollection', 'control'],
		
		'dom_attributes': {
			'class': 'Ordered_String_List'
		},
		
		// index may get automatically assigned?
		//  or here, say it is just an int.
		//  id is a string.
		//  may be easier that way.
		// code will be used that hooks into it.
		//  but an override?
		// do want automatic generation.
		//  generation of these items may be a bit tricky.
		//  but need to hook into it somewhere.
		
		// could have generation or get functions.
		
		// the new data types system is really changing the mechanics within this. More declarative definition in HTML, which is good.
		//  Needs quite a complex engine to support it.
		
		'control_dom': {
			'node': 'object',
			'attributes': 'dom_attributes',
			
			// though could say it is one of a bunch of valid tag names.
			//  That could also help with an IDE.
			
			'tagName': 'string'
				
			// and info about the dom atributes
			//  they all get handled as strings (though could be validated, connected to info about html, useful for IDE).
			// but the .class dom attribute is a special case. dealt with as a Ordered_String_List
			//  have the code already. need to make it a type within this system.
				
				
				
		},
		
		//  so lots of the Core functionality will be handled through the data types system.
		//  not in the Core prototype.
		
		'control': {
			'style': 'style',
			
			// int needs to be handled at a lower level in some places.
			//  Maybe it could have its own data_type instance. (a limited one?)
			
			
			'index': 'int',
			
			// id being something that can be automatically generated.
			//'id': 'string',
			//  The control may need to generate an id upon get if it does not have one already.
			// auto-gen string, using a function that is given the control.
			
			'id': 'context_id',
			
			// or something where there is a getter.
			//  I think it could look for the getter function for context_id, and use it where appropriate.
			
			'controls': 'control_collection',
			
			
			// and define its dom and dom attributes here.
			// still things get complex but the complexity is more generalised and moved to lang.
			
			'dom': 'control_dom', // TODO will change this, and test the change
			
			// control could check to see if there is a generator for this.
			
			// 'id': 'context_class_name_id'? 'context_id'
			// 'context_id' means that the Page Context gives it an id? it uses the class_name to get the id as well.
			//  It will do that when trying to get the id and it can't find it.
			
			
			
			'class_name': 'string'
			
			// have a way of managing a collection of controls through this.
			
		},
		
		'style': {
			// an object declaration, not array. can have various things inside
			//'border': ['oltrb', 'single_border'],
			'border': 'border',
			'margin': 'margin',
			// when dealing with 'any': there may need to be a map that says if a value is contained.
			//  could even store these maps in a tree. would use something like 'ensure'
			
			'cursor': ['any', ['auto', 'crosshair', 'default', 'e-resize', 'help', 'move', 'n-resize', 'ne-resize', 'nw-resize', 'pointer', 'progress', 's-resize', 'se-resize', 'sw-resize', 'text', 'w-resize', 'wait', 'inherit']]
		}
	});
	
	jsgui.populate_all_dt_maps();
	
	extend(jsgui.input_processors, {
		'color': function(value) {
			// test the value with a regex. then if it matches a pattern, change it, otherwise, leave it unchanged
			
			var rx_hex_rgb_6 = /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/;
			var hex_rgb_6_match = value.match(rx_hex_rgb_6);
			console.log('hex_rgb_6_match ' + jsgui.stringify(hex_rgb_6_match));
			
			if (hex_rgb_6_match.length == 4 && hex_rgb_6_match[0] && hex_rgb_6_match[1] && hex_rgb_6_match[2] && hex_rgb_6_match[3]) {
				var res = [str_hex_to_int(hex_rgb_6_match[1]), str_hex_to_int(hex_rgb_6_match[2]), str_hex_to_int(hex_rgb_6_match[3])];
				return res;
			}
			
		}
	});
	
	
	extend(jsgui.output_processors, {
		'color': function(value) {
			// test the value with a regex. then if it matches a pattern, change it, otherwise, leave it unchanged
			return arr_rgb_to_css_hex_6(value);
		}
	});
	// 'color': function(value) {
	//return arr_rgb_to_css_hex_6(value);
	
	
	//alert('jsgui-html, jsgui-lang has loaded');
	//alert('1 ' + jsgui);
	//alert(cb.message);
	
	// Will require other code as well.
	
	var get_inline_css_dict_from_style = function(style, page_context) {
		//console.log('get_inline_css_dict_from_style ' + stringify(style));
		
		var style_info = jsgui.data_types_info['style'];
		
		
		// should have the style data type info
		//  then for each property we get the data type info for that, and then use its output mechanism.
		
		var css_style_dict = {};
		each(style, function(i, v) {
			//console.log('style i ' + i);
			
			// TODO - May not just be a name but could directly be the info. Could use a loader function perhaps.
			var dt_info_style_item_name = style_info[i];
			//console.log('dt_info_style_item_name ' + stringify(dt_info_style_item_name));
			
			var dti_style_item = data_type_instance(dt_info_style_item_name);
			
			//console.log('*v ' + stringify(v));
			
			var style_rule = dti_style_item.output(v);
			
			//console.log('style_rule ' + stringify(style_rule));
			//console.log('tof(style_rule) ' + tof(style_rule));
			if (tof(style_rule) == 'string') {
				css_style_dict[i] = style_rule;
			} else {
				
				// could probably use extend here.
				
				each(style_rule, function(subrule_name, subrule_value) {
					css_style_dict[subrule_name] = subrule_value;
				});
				
			}
			
			//apply_jsgui_style_rule_to_css_style(css_style_dict, i, v);
		});
		return css_style_dict;
	};
	
	var apply_jsgui_style_rule_to_css_style = function(style, style_rule_name, style_rule_value) {
    	//console.log('apply_jsgui_style_rule_to_css_style style_rule_name ' + style_rule_name);
		
    	// it's probably going to use dti and output.
    	
    	// Will be changing the way that styles get calculated.
    	// Going to create some new functions that get used in the rendering.
    	//  Will get help from data_types_info.
    	
    	
    	
    	
    	
    	//console.log('fns_jsgui_style_item_to_inline_css_item[style_rule_name] ' + fns_jsgui_style_item_to_inline_css_item[style_rule_name]);
    	
		// this way of doing things will change.
		//  going to do some kind of get_style.
		
		// More of it will be computed through lang and the data_types system.
		
		
    	if (fns_jsgui_style_item_to_inline_css_item[style_rule_name]) {
			var inline_style_dict = fns_jsgui_style_item_to_inline_css_item[style_rule_name](style_rule_value);
			//  but could we get more than one style item in the dict?
			
			each(inline_style_dict, function(i2, v2) {
				
				style[i2] = v2;
			});
		}
    };
    
    var styles_dict_to_string = function(styles_dict) {
		
		// OK... some improvements will need to be made.
		//  will need to upgrade the styles / size / pos setting code.
		//console.log('styles_dict ' + jsgui.stringify(styles_dict));
		
		var res = '', first = true;
		each(styles_dict, function(i, v) {
			
			if (typeof v == 'number') {
				v = v + '';
			}
			
			if (typeof(v) != 'string') {
				//var stack = new Error().stack;
				//console.log('stack ' + stack);
				//console.log('i ' + i);
				//console.log('v ' + v);
				//console.log('typeof v ' + typeof v);
				throw 'jsgui: styles_dict_to_string: Only string css styles supported. Jsgui styles must be translated to css before use here.';
			} else {
				res = res + i + ': ' + v + ';';
			}
			
		});
		return res;
	};
	
	
	// JSGUI event binding functions.
	
	var _bind_dom_event = function(dom_node, event_name, fn) {
		
		// return unbind function. ???
		
		var unbind = _unbind_dom_event(dom_node, event_name, fn);
		return unbind;
	}
	
	var _unbind_dom_event = function(dom_node, event_name, fn) {
		
	}
	
	
	// And Core, of course
	//  Likely to rename this 'Control' or 'control' - probably 'Control'.
	
	// Now it is in this file it will be easier to modify by itself.
	
	var Control = jsgui.DataObject.extend({
		'init': function(spec) {
			
			// but process / normalize the spec here?
			
			spec = spec || {};
			spec.nodeType = spec.nodeType || 1;
			
			
			// The collection of controls needs to be made somewhere.
			
			//p._ = p._ || {};
			//p._.type_name = 'control';
			
			
			this._super(spec);
			
			this._.type_name = 'control';
			this.tagName(this._tag_name);
			delete this._tag_name;
			// the _ object should not be made in the prototype.
			//  that makes it shared for all members of that class / prototype chain.
			
			// may get some dom attributes from the spec.
			
			this.set('dom.attributes', {});
			
			// then make sure it has the list of css classes.
			
			// may automate that more.
			//  or have lazy loading of it, so it's assumed to have it and made available through the data types system.
			
			
			
			
			
			//this.dom = 
			
			//this.ensure('_.')
			
			// property ensure...
			
			// may change the 'ensure' function of the control.
			// likely to change them all to property_ensure.
			// many / most things are likely to be under properties.
			
			
			
			
			
			//this.ensure('_.controls', []);
			
			// could put these in a data type.
			
			// Quite definitely will make an indexed collection.
			
			//this._.controls = this._.controls || [];
			//this._.dict_ctrls = this._.dict_ctrls || {};
			//dict_ctrls
			
			//spec = spec || {};
			
			//this.property_ensure('dom.tagName', 'div');
			
			
			
			
			// dom could be a multi level property.
			
			// dom.attributes(...
			
			// or maybe use a .dom('attributes', 'attName', value)
			// or dom('attributes.attName', value)
			// these 2-level properties would bring some consistancy into things.
			
			// set('dom.attributes.attName', value)
			// set('dom.node')
			// dom('node)
			
			// multi-level properties. These could use a fair bit less boilerplate than what I already have.
			
			// will call a normalize spec function.
			
			//if (spec.domNode) {
			//	spec.dom = spec.dom || {};
			//	spec.dom.node = spec.dom.node || spec.domNode;
			//}
			
			
			// will have _.dom multi-level property.
			// will be able to respond to changes. When the dom part gets updates (it's still a model of the view) the view itself will then get
			// updated.
			
			
			//if(spec.dom && spec.dom.node) {
				
				//this.dom = this.dom || {};
				//this.dom.node = spec.dom.node;
			//	ensure(this, 'dom.node', spec.dom.node);
				
			//}
			
			// should also call the dom function / property.
        	
			//if(spec.style) {
			//	this.style(spec.style);
			//}
        	
        },
		
		// event bindings
		//  will use the webkit methods.
		
		// Both of these could be added with an add_tag_or_similar function.
        /*
        'addTag': function(tag) {
        	this._.tags = this._.tags || {};
        	this._.tags[tag] = true;
        },
        'hasTag': function(tag) {
        	return (typeof this._.tags != 'undefined' && this._.tags[tag] != 'undefined');
        },
        'removeTag': function(tag) {
        	if (this.hasTag(tag)) delete this._.tags[tag];
        },
        'getTags': function() {
        	var res = [];
        	if (this._.tags) {
        		each(this._.tags, function(i, v) {
	        		res.push(i);
	        	});
        	};
        	return res;
        },
        'addContext': function(context) {
        	this._.contexts = this._.contexts || {};
        	this._.contexts[context] = true;
        },
        'hasContext': function(context) {
        	return (typeof this._.contexts != 'undefined' && this._.contexts[context] != 'undefined');
        },
        'removeContext': function(context) {
        	if (this.hasContext(context)) delete this._.contexts[context];
        },
        'getContexts': function() {
        	var res = [];
        	if (this._.contexts) {
        		each(this._.contexts, function(i, v) {
	        		res.push(i);
	        	});
        	};
        	return res;
        },
        */
        
        // Maybe consider these part of rendering, move them.
        'get_amalgamated_style': function(arr_contexts) {
        	//console.log('this._.style ' + stringify(this._.style));
        	
        	var res = clone(this._.style), that = this;
        	//console.log('res ' + stringify(res));
        	// OK, needs the style object.
        	
        	// Likely to have the style() function.
        	
        	/*
        	 * not using contexts at the moment anyway
        	 * 
        	$.eac(arr_contexts, function(i, v) {
        		//var cs = that._.cs[v];
        		if (global.page_context && global.page_context.context_style[v]) {
        			//console.log('a) get_amalgamated_style res ' + jsgui.stringify(res));
        			apply_style_to_style(res, global.page_context.context_style[v]);
        			//console.log('b) get_amalgamated_style res ' + jsgui.stringify(res));
        		}
        	});
        	*/
        	return res;
        },
        
        'get_rendered_inline_css_dict': function() {
        	
        	// and does setting the style work right?
        	
        	// will refer to an object, will return this._.inline_css_dict.
        	//  will render that dict when necessary ---?
        	//  amalgamting the styles
        	
        	// when changing the style of something - may be overwritten by amalgamated styles?
        	//  have an amalgamated style override?
        	
        	//var contexts = this.getContexts(), 
        	
        	var ast = this.get_amalgamated_style()
        	
        	
        	//console.log('ast ' + stringify(ast));
        	var inline_css_dict = get_inline_css_dict_from_style(ast);
        	
        	//console.log('inline_css_dict ' + jsgui.stringify(inline_css_dict));
        	
        	return inline_css_dict;
        },
        
        
        'get_rendered_inline_css': function() {
        	var css_dict = this.get_rendered_inline_css_dict(), str_css = '';
        	
        	// renders the jsgui styles that have been set to the inline style
        	// then renders/copies the CSS inline styles to the inline style
        	
        	// will already have a style dict.
        	
        	/*
        	if (typeof this.dom.attributes != 'undefined' && typeof this.dom.attributes.style != 'undefined') {
        		var da_style_dict = str_get_styles_dict(this.dom.attributes.style);
	        	var nsd = {};
	        	$.extend(true, nsd, da_style_dict,  css_dict);
	        	str_css = styles_dict_to_string(nsd);
        	};
        	*/
        	
        	// will be a data type that supports ordering / reordering soon.
        	var h = this.has('this.dom.attributes._.dict_style');
        	// maybe does not have that attribute?
        	// they are inline styles (that have been set)
        	
        	//console.log('h ' + h);
        	
        	if (h) {
        		var da_style_dict = h;
	        	var nsd = {};
	        	extend(true, nsd, da_style_dict,  css_dict);
	        	
	        	//console.log('nsd ' + jsgui.stringify(nsd));
	        	
	        	str_css = styles_dict_to_string(nsd);
        	} else {
        		//console.log('css_dict ' + jsgui.stringify(css_dict));
        		str_css = styles_dict_to_string(css_dict);
        		
        	}
        	
        	//console.log('str_css ' + jsgui.stringify(str_css));
        	
        	//console.log('_.s ' + jsgui.stringify(this._.s));
        	
        	// Some things with surfaces that set the style should have this style info represented.
        	//  I think that is because it was not parsed / interpreted from the DOM upon activation.
        	//  However, the surface style should be sent too. Perhaps surface style could style things efficiently using CSS.
        	
        	
        	
        	return str_css;
        },
		
        // likely to be done with an alias
        //  And will be done using the data type system.
        
        'property_css_transition_duration': function(style_property_name) {
        	// this._.s
        	
        	// will refer to style properties differently
        	
        	if (this.has('_.s.transition')) {
        		// look up the css transition in the jsgui style
        		//if(this._.s.transition) {
        			var tr = this._.s.transition;
        			if (tr[style_property_name]) {
        				// anything about duration etc?
        				var dur = tr[style_property_name][0];
        				return dur;
        			}
        		//}
        	}
        },
        
		// 'ret' function - gets something if possible.
        'has': function(item_name) {
        	var arr = item_name.split('.');
        	//console.log('arr ' + arr);
        	var c = 0, l = arr.length;
        	var i = this;
        	while (c < l) {
        		var s = arr[c];
        		//console.log('s ' + s);
        		if (typeof i[s] == 'undefined') {
        			return false;
        		}
        		i = i[s];
        		c++;
        	};
        	return i;
        },
        
        
        'renderDomAttributes': function() {
        	//console.log('renderDomAttributes');
            var arr = [];
            var inline_css = this.get_rendered_inline_css();
            //console.log('inline_css ' + inline_css);
            
            // style currently goes first here... does it matter though?
            
            if (inline_css.length > 0) {
            	
            	// no, not quite like this.
            	//  
            	//this.domAttributes('style', inline_css);
            	
            	// don't set the style attribute there - render it as the style attribute
            	
            	arr.push(' ', 'style', '="', inline_css, '"');
            	//console.log('*_ ' + stringify(this._.dom));
            }
            var dom_attrs = this.get('dom.attributes');
            //console.log('dom_attrs ' + stringify(dom_attrs));
            if (dom_attrs) {
            	each(dom_attrs, function(i, v) {
            		
            		if (i != 'style') {
            			// check just in case

                		// when rendering the style... 
                		//  I think the DOM attributes style will already be rendered (so far)
                		// Probably render style like the others.
                		// May use a data type that allows the style / class to be done effectively.
                		//  could be a dict or an object that does this.
                		//console.log('dom attr i ' + i);
                		arr.push(' ', i, '="', v, '"');
            		}
            		
            	});
            }
            /*
            
            if (this._.dom.attributes) {
            	
                each(this._.dom.attributes, function(i, n) {
                	//console.log('i ' + i);
                	if (i === 'style' && typeof n != 'string') {
                		// won't be a style string
                		//  will interpret a style dict
                		
                		var arrStyle = [' style="'], pastFirst = false, c = 0;
                		each(n, function(j, k){
                			if (pastFirst) arrStyle.push(' ');
                			arrStyle.push(j + ': ' + k + ';');
                			pastFirst = true;
                			c++;
                		});
                		arrStyle.push('"');
                		var st = arrStyle.join('');
                		if (c > 0) arr.push(st);
                		
                	} else if (i !== '_' && i != 'style' && i != 'class') {
                		// also won't have 'class' as a dom attribute (directly).
                		
                		arr.push(' ', i, '="', n, '"');
                	} else if (i == '_') {
                		//console.log('has _');
                		// need to look at the items in here.
                		
                		each(n, function(i2, v2) {
                			//console.log('rda _.' + i2 + ', v ' + v2);
                			
                			if (i2 == 'class') {
                				arr.push(' ', i2, '="', v2.toString(), '"');
                			}
                			
                		});
                		
                		//arr.push(' class="' + n.)
                	}
                });
                // style always last?
                
                //console.log('this.dom.attributes._ ' + this.dom.attributes._);
                
                if (this._.dom && this._.dom.attributes._ && this._.dom.attributes._.dict_style || this._.style) {
                	//console.log('this.dom.attributes._.dict_style ' + this.dom.attributes._.dict_style);
                	
                	var inline_css_str = this.get_rendered_inline_css();
                	//console.log('renderDomAttributes inline_css_str ' + inline_css_str);
                	arr.push(' style="', inline_css_str, '"');
                }
                var _c = this.has('_.dom.attributes._.class');
                
                if (_c) {
                	arr.push(' class="' + _c.toString() + '"');
                }
            };
            */
            var res = arr.join('');
            return res;
        },
        'renderBeginTagToHtml': function() {
        	
        	// will be in _.dom.tagName
        	//  I think that's why we need the further level properties.
        	
        	// dom.style.transform3d.translate3d
        	//  these property levels could go quite deep. Want a convenient way of using them without having to manually code lots of 
        	//  iterations, nested existance checks. Could have shortcuts so it knows what dom.translate3d means.
        	
        	
        	//var res = ['<', this._.tagName, this.renderDomAttributes(), '>'].join('');
        	var res = ['<', this.tagName(), this.renderDomAttributes(), '>'].join('');
        	//console.log('renderBeginTagToHtml res ' + res);
            return res;
        },
        'renderEndTagToHtml': function() {
        	// may also have an alias system, so can do 
        	// this.get('tagName'), with it knowing what it refers to.
        	
            return ['</', this.tagName(), '>'].join('');
        },
        'renderHtmlAppendment': function() {
            return this.htmlAppendment || '';
        },
        
        // not rendering a jQuery object....
        
        'renderEmptyNodeJqo': function() {
            return [this.renderBeginTagToHtml(), this.renderEndTagToHtml(), this.renderHtmlAppendment()].join('');
        },
        'all_html_render': function() {
        	//if (this.pre_all_html_render) {
        	//	
        	//}
        	this.pre_all_html_render();
        	
        	if (this.dom && this.dom._ && this.dom._.innerHtml) {
        		res = [this.renderBeginTagToHtml(), this.dom._.innerHtml, this.renderEndTagToHtml(), this.renderHtmlAppendment()].join('');
        	} else {
        		res = [this.renderBeginTagToHtml(), this.all_html_render_internal_controls(), this.renderEndTagToHtml(), this.renderHtmlAppendment()].join('');
        	};
        	return res;
        },
        'all_html_render_internal_controls': function() {
        	//var controls = this.controls, res = [];
        	var res = [];
        	// it's controls() now, gets the collection of controls.
            //each(this._.controls, function(i, n) {
        	var controls = this.controls();
        	//console.log('controls ' + stringify(controls));
        	each(controls._arr, function(i, n) {
                htm = n.all_html_render();
                res.push(htm);
            });
            return res.join('');
        },
        'pre_all_html_render': function() {
        	
        },
        
        /*
        '_insertControl': function(control, index) {
        	if (isArray(this.controls)) {
        		if (this.controls.length == 0) {
        			if (!control.$) {
        				control.$render();
        			};
        			control.parentControl = this;
        			this.controls.push(control);
        			control._.index = index;
        			var id = control._.id;
        			if (typeof id != 'undefined') {
        				this._.dict_ctrls[id] = control;
        			}
        			var cip = this.getControlInsertion$();
	                if (cip) {
	                	if (control.$) {
	                		cip.append(control.$);
	                	} else {
	                		var $renc = control.$render();
	                        cip.append($renc);
	                        traverse_new_dom($renc[0]);
	                	};
	                };
	                this.trigger_ctrl_event('ctrl_added', control);
        		} else {
        			cti = this.controls[index];
        			this.controls.splice(index, 0, control);
        			control._.index = index;
        			this._.dict_ctrls[control.id()] = control;
        			
        			// not sure control needs to be rendered... is its construction enough at this stage.
        			
        			// and traversing the new DOM?
        			
        			var insertion_n = cti.domNode();
        			if (insertion_n) {
        				
        				// and does this have a DOM node? Will one need to be rendered?
        				
        				var ctrl_n = control.domNode();
        				if (ctrl_n) {
        					ctrl_n.insertBefore(insertion_n, index);
        				}
        				
        			}
        			
        			
        			
            		//if (cti.$) {
            		//	if (!control.$) {
            		//		control.$render();
            		//	};
            		//	control.parentControl = this;
            		//	control.$.insertBefore(cti.$);
            		//	traverse_new_dom(control.$[0]);
            		//	this.trigger_ctrl_event('ctrl_added', control);
            		//} else {
            		//	//throw Exception('no control.$');
            		//};
            		
            		
        		};
            };
        },
        */
        /*
        '_prependControl': function(ctrl) {
        	//console.log('prependControl');
        	//console.log('1) this.controls.length ' + this.controls.length);
        	var res = this.insertControl(ctrl, 0);
        	//console.log('2) this.controls.length ' + this.controls.length);
        	return res;
        },
        */
        /*
        'getIndexInParent': function() {
        	res = -1;
        	if (this.parentControl) {
        		var that = this;
        		
        		// but this may be stored & kept updated for quick reference INDEX in parent not LOOKUP in parent!
        		
        		if (this.parentControl.controls) {
        			each(this.parentControl.controls, function(i, v) {
            			if (that == v) res = i;
            		});
        		};
        	};
        	return res;
        },
        */
        
        /*
        '_insertBefore': function(target_ctrl) {
        	if (target_ctrl.parentControl) {
        		var iip = target_ctrl.getIndexInParent();
        		target_ctrl.parentControl.insertControl(this, iip);
        	};
        },
        */
        // but could be improved in performance, not arrayify_simple.
        //  when removing a whole bunch of ctrls do so with one scan.
        //  I think build up a new control array / placeholder.
        // £ Performance improvement.
        
        // could also use an new controls--collection--.remove.
        //  then the renderer gets changed about the change in controls, likely re-renders the whole thing.
        
        // could lead to providing more granular information about the changes for performance optimizations.
        /*
        '_remove': arrayify(function(ctrl) {
        	// can remove multiple ctrls at once too.
        	// the grid surface will override this so that animations are done.
        	
        	// remove multiple items
        	
        	//var t = tof(ctrl);
        	//if (t == 'array') {
        		
        	//} else {
        		
        	//}
        	
        	var idx = ctrl.index();
        	
        	// will use ctrl.n?
        	//  ctrl.dom.node
        	
        	//if (ctrl.$) ctrl.$.remove();
        	
        	if (idx > -1) {
        		if (this.controls[idx] === ctrl) {
        			this.controls.splice(idx, 1);
        			for (var c = idx, l = this.controls.length; c < l; c++) {
        				this.controls[c]._.index--;
        			}
        		} else {
        			throw 'ctrl.remove Index mismatch';
        		}
        		//this.controls.
        		
        	}
        	
        	// and adjust the indexes of the later ctrls.
        	
        	return ctrl;
        	
        	// remove one item
        }),
        */
        // will trigger ctrl event 'ctrl_added'
        
        // also storing the _.index of the ctrl, where it is put.
        //  Want to avoid jQuery's index function.
        
        // Will become another property.
        //  And the indexing will be done by the collection indexed_idd_ordered_collection
        
        /*
        'index': function() {
        	if (typeof this._.index != 'undefined') {
        		return this._.index;
        	} else {
        		res = -1;
            	if (this.parentControl) {
            		var that = this;
            		
            		// but this may be stored & kept updated for quick reference INDEX in parent not LOOKUP in parent!
            		var pcc = that.parentControl.controls;
            		if (pcc) {
            			each(pcc, function(i, v) {
                			if (that == v) res = i;
                		});
            		};
            	};
            	return res;
        	}
        	
        	// used to use $.index()
        },
        */
        // Could have an indexed_collection? 
        //  And maybe make use of that B+ tree.
        //  this function will be an alias to the controls property soon.
        
        /*
        '_addControl': arrayify(function(control) {
        	//console.log('addControl ' + control);
        	
        	// can use arrayify, saves a few lines here.
        	
        	var that = this;
    	
            control.parentControl = this;
            var key = control.key;
            if (key) {
                // but now the controls object itself may be this dictionary.
                //  it is only worth maintaining this dictionary if the controls are in an array.
                //this.controlsByKey[key] = control;
            };
            //console.log('tof this.controls ' + tof(this.controls));
            
            // should maybe use ._.controls.
            //  and so the actual controls array is hidden.
            
            // it is - or the collection will definitely support the operation
            if (isArray(this._.controls)) {
            	
            	
            	
            	var ctrl_id;
            	
            	// control always will have '_'
            	
            	// not sure a control should need a unique ID.
            	
            	if (control._) {
            		ctrl_id = control._.id;
            	};
            	 
            	// don't have a dict of controls???
            	//  or continue to have it.
            	
            	if (this._.dict_ctrls[ctrl_id]) {
            		throw 'Already has control';
            	} else {
            		var new_index = this._.controls.length;
            		this._.controls.push(control);
            		
            		control.ensure('_');
            		control._.index = new_index;
            		if (typeof ctrl_id != 'undefined') this._.dict_ctrls[ctrl_id] = control;
            	}
            } else if (key) {
            	throw 'this.controls must be an array';
            } else {
                // or automatically generate a key? a key should be unique within a container (and maybe a wider area could be defined).
                throw ('Controls without keys can only be added to control arrays.');
            };
            
            // place where new controls get inserted.
            //  May be a node and an integer?
            
            // is it in the dom? maybe call a .domNode function.
            
            //var cip = this.getControlInsertion$();
            //if (cip) {
            //	if (control.$) {
            //		cip.append(control.$);
            //	} else {
            		
            		// render to HTML?
            		
            //		var $renc = control.$render();
            //        cip.append($renc);
            //        traverse_new_dom($renc[0]);
            //	};
            //};
            
            this.trigger_ctrl_event('ctrl_added', control);
            //console.log('end single addControl');
            return control;
    	
        }),
        */
        // and want animation to be specified here.
        //  callback mechanism so when the function ends it returns this
        // DOM events too...
        //  need to be able to bind them. will use webkit specific binding, not jQuery as it was before.
        
        // Perhaps will use event binding more resembling backbone.js.
        
        // with capture or bubbling? Bubbling for the moment I think.
        'bind_dom_event': function(evt_name, evt_handler) {
        	
        	// but make this raise a jsgui event too
        	var n = this.domNode();
        	if (n) {
        		n.addEventListener(evt_name, evt_handler, false);
        	}
        },
        
        'unbind_dom_event': function(evt_name, evt_handler) {
        	
        	//jsgui._dom_removeEventListener(dom_node, evt_name, evt_handler, false);
        	// jsgui._dom_unbind_event(dom_node, evt_name, evt_handler) - phase assumed, no boolean here, different API.
        	// a (jsgui) api outside of the controls.
        	
        	
        	
        	
        	var n = this.domNode();
        	
        	
        	if (n) {
        		n.removeEventListener(evt_name, evt_handler, false);
        	}
        },
        
        // event handling - likely to be moved to DataObject. Controls will still handle events!
        
        'bind_ctrl_event': function(evt_name, evt_handler) {
        	
        	// could use a ll_ensure function...
        	//  clearer naming that it's simple.
        	//  will compress better.
        	
        	//var ceen = this.ensure('_.bound_ctrl_events.' + evt_name, []);
        	var ceen = ll_ensure(this, '_.bound_ctrl_events.' + evt_name, []);
        	
        	ceen.push(evt_handler);
        },
        
        'trigger_ctrl_event': function(evt_name) {
        	//console.log('trigger_ctrl_event ' + evt_name);
        	
        	var a = arr_like_to_arr(arguments), p = [];
        	if (a.length > 1) {
        		p = a.slice(1);
        	};
        	var ce = this._.bound_ctrl_events, that = this;
        	//console.log('ce ' + ce);
        	if (ce) {
        		//console.log('ce[evt_name] ' + ce[evt_name]);
        		if (ce[evt_name]) {
        			each(ce[evt_name], function(i, v) {
        				v.apply(that, p);
        			});
        		};
        	};
        },
        
        'compose': function() {
        	
        	// I think having this avoids a recursion problem with _super calling itself.
        },
        'wait': function(callback) {
        	//console.log('wait');
        	setTimeout(function() {
        		callback();
        	}, 0);
        },
        // could use aliases for style properties.
        
        'visible': function(callback) {
        	
        	//console.log('vis');
        	
        	//return this.style('display', 'block', callback);
        	this.style('display', 'block', callback);
        },
        
        // These kind of functions, that set a property to a value, could be made in a more efficient way.
        
        // have this in a function chain?
		'transparent': function(callback) {
			// make block or inline display, maybe depending on what it was before being made hidden
			//console.log('transp');
			// if display is none then display it.
			//  may have the previous display value stored.
			//return this.style({'opacity': 0}, callback);
			this.style('opacity', 0, callback);
			/*
			
			this.style({
				'display': 'block',
				'opacity': 0
			});
			
			if (callback) {
				setTimeout(function() {
					callback();
				}, 0);
			} else {
				return this;
			}
			*/
		},
		'opaque': function(callback) {
			return this.style({'opacity': 1}, callback);
			
		},
		'chain': function(arr_chain, callback) {
			// each item in the array is a function call (reference) that needs to be executed.
			
			// assuming the last param in each function is the callback.
			
			var pos_in_chain = 0;
			
			//setTimeout()
			var that = this;
			var process_chain = function() {
				//console.log('process_chain arr_chain.length ' + arr_chain.length + ', pos_in_chain ' + pos_in_chain);
				//console.log('arr_chain.length ' + arr_chain.length);
				if (pos_in_chain < arr_chain.length) {
					var item = arr_chain[pos_in_chain];
					
					// what types can item be
					
					// an array... that means more than one thing gets applied at this point in the chain.
					
					var t_item = tof(item);
					
					//console.log('t_item ' + t_item);
					if (t_item == 'array') {
						// do more than one item at once.
						
						// will wait for them all to be complete too.
						var count = item.length;
						var cb = function() {
							count--;
							if (count == 0) {
								//if (callback) {
								//	callback();
								//}
								pos_in_chain++;
								process_chain();
							}
						};
						each(item, function(i, v) {
							that.fn_call(v, function() {
								cb();
							});
						});
						//console.log('arr item ' + stringify(item));
					} else {
						// for a string I think.
						// could be a map, and need to call the item(s) in the map.
						that.fn_call(item, function() {
							//console.log('cb1');
							pos_in_chain++;
							process_chain();
						});
					}
				} else {
					if (callback) {
						callback.call(that);
					}
				}
			}
			process_chain();
		},
		'fn_call': function(call, callback) {
			// and callbacks within the right way?
			//console.log('fn_call ' + call);
			var t = tof(call);
			//console.log('t ' + t);
			// but call may be an object...
			var fn, params, that = this;
			if (t == 'string') {
				fn = this[call];
				params = [];
				//console.log('callback ' + callback);
				if (callback) {
					return fn.call(this, callback);
				} else {
					return fn.call(this);
				}
			};
			if (t == 'array') {
				// the 0th item in the arr should be the function name, the rest the params
				// but does the function have a 'callback' param that we know about here? not now.
				fn = this[call[0]];
				params = call.slice(1);
				if (callback) params.push(callback);
				return fn.apply(this, params);
			}
			if (t == 'object') {
				// how many?
				var count = 0;
				each(call, function(i, v) {
					count++;
				});
				
				each(call, function(i, v) {
					var cb = function() {
						count--;
						if (count == 0) {
							callback.call(that);
						}
					};
					that.fn_call([i, v], cb);
				});
			}
		},
		
		// This could probably be defined as an alias.
		
		// transition -> style.transition
		//  Integrating callbacks with these property changes?
		//  Maybe should not do so much more on compressing & generalizing yet.
		'transition': function(value, callback) {
			//var i = {};
			//i[]
			
			// may include multiple transitions in an array.
			return this.style({'transition': value}, callback);
		},
		
		
		'transit': fp(function(a, sig) {
			
			// arr_duration_and_timing_function, map_values, callback
			// transit, callback
			//console.log('transit sig ' + sig);
			// [[n,s],o]  a duration with timing function, then a transit map. no callback
			//  what about extracting from the most inner array, so also responding to [[[n,s],o]].
			// seeing that the required thing is inside an array shell.
			
			// extract_sig_from_array_shell
			var that = this;
			//  [[[n,s],o,],f] including callback function
			
			// [[[n,s],o]]
			var unshelled_sig = remove_sig_from_arr_shell(sig);
			//if (remove_sig_from_arr_shell(sig))
			//console.log('unshelled_sig ' + unshelled_sig);
			if (unshelled_sig == '[[n,s],o]') {
				return this.transit(a[0][0], a[0][1]);
				
			}
			
			if (sig == '[[[n,s],o],f]') {
				
				var transit = a[0];
				var callback = a[1];
				
				var duration_and_tf = transit[0];
				var map_values = transit[1];
				
				this.transit(duration_and_tf, map_values, callback);
				
			} else if (sig == '[[n,s],o,f]') {
				var duration_and_tf = a[0];
				var map_values = a[1];
				var callback = a[2];
				var transition = {};
				each(map_values, function(i, v) {
					// set the transition style
					transition[i] = duration_and_tf;
				});
				that.transition(transition);
				
				each(map_values, function(i, v) {
					// set the transition style
					//transition[i] = arr_duration_and_timing_function;
					
					// use the style function to set the value
					// and use a callback system here for when they are all done.
					
					that.style(i, v);
				});
				
				//this.transit(duration_and_tf, map_values, callback);
			} else if (a.length == 2) {
				var duration_and_tf = a[0];
				//console.log('a ' + stringify(a));
				
				// transit includes the map values
				
				var duration_and_tf = a[0];
				var map_values = a[1];
				//var transit_map = a[1];
				var transition = {};
				
				each(map_values, function(i, v) {
					// set the transition style
					transition[i] = duration_and_tf;
					
					
				});
				that.transition(transition);
				
				each(map_values, function(i, v) {
					// set the transition style
					//transition[i] = arr_duration_and_timing_function;
					
					// use the style function to set the value
					// and use a callback system here for when they are all done.
					
					that.style(i, v);
					
				});
				//console.log('transit_map ' + stringify(transit_map));
				//this.transit(duration_and_tf, transit_map);
				//that.transition()
			}// else if (a.length == 3) {
			//	var arr_duration_and_timing_function = a[0], map_values = a[1], callback = a[2];
			//	console.log('a ' + stringify(a));

				
			//}
			
		}),
		
		// and also want to be able to output the property.
		
		'out': function(property_name) {
			var dti_control = data_type_instance('control');
			
			//var prop_ref = get_property_reference(this, property_name, false);
			var prop_ref = dti_control.nested_get_property_reference([this, '_'], property_name, true);
			
			var item_type = prop_ref[2];
			var dti_item = data_type_instance(item_type);
			
			var out_val = dti_item.output(prop_ref[0][prop_ref[1]]);
			
			//console.log('out prop_ref ' + stringify(prop_ref));
			//console.log('out out_val ' + stringify(out_val));
			
			return out_val;
		},
		
		'page_context': function(val) {
        	if (typeof val == 'undefined') {
        		// _.page_context should not be a function.
        		
        		// how frequently does it need to be called?
        		//  is it being called too much?
        		//console.log('£ this._.page_context ' + this._.page_context);
        		if (is_defined(this._.page_context)) {
        			return this._.page_context;
        		} else {
        			if (jsgui.page_context) {
        				return jsgui.page_context;
        			}
        		}
        	} else {
        		this._.page_context = val;
        	}
        },
		
		// may change the controls access functions, but seems simple and OK for the moment to wrap them like this.
		
		'add_control': function(control) {
			var controls = this.get('controls');
			return controls.add(control);
		}
		
	});
	
	
	var p = Control.prototype;
	//p._ = p._ || {};
	//p._.type_name = 'control';
	
	p._data_generators = {
		'context_id': function() {
			// this is the control
			//  the control should have access to a page_context?
			
			// Controls on the server are likely to need this for rendering right (different contexts).
			
			// On the client could refer to jsgui.page_context
			
			// could refer to jsgui.page_context, if it is there.
			//  Otherwise it would have to be a property of the control.
			//console.log('this.set ' + this.set);
			var page_context = this.page_context();
			var id = page_context.ensure_ctrl_id(this);
			return id;
			
			
		},
		'control_collection': function() {
			var res = new jsgui.DataCollection();
			return res;
		}
	}
	
	// function to set up access functions on a prototype?
	//  aliases?
	//  access functions in particular here.
	
	// Need to do more about rebuilding the framework with the new property system.
	//  Will have encapsulated a lot into lang from html, making things easier here.
	
	// lang/prototype_access
	
	var prototype_access = function(p, variable_name, fn_name) {
		
		p[fn_name] = fp(function(a) {
			
			//console.log('this. ' + stringify(this._));
			
			if (a.l == 1) {
				var val = a[0];
				return this.set(variable_name, val);
			} else {
				return this.get(variable_name);
			}
		});
	}
	
	var p = Control.prototype;
	
	// This system works quite nicely now.
	//  Allows simple functional access to these properties.
	
	prototype_access(p, 'index', 'index');
	prototype_access(p, 'id', 'id');
	prototype_access(p, 'dom.tagName', 'tagName');
	prototype_access(p, 'dom.attributes', 'domAttributes');
	prototype_access(p, 'controls', 'controls');
	prototype_access(p, 'style', 'style');
	// access to the dom node as well.
	
	
	

	// domAttributes
	
	p._tag_name = 'div';
	
	
	
	var core_extension = str_arr_mapify(function(tagName) {
		jsgui[tagName] = Control.extend({
			'init': function(spec) {
				//spec.tagName = tagName;
				this._super(spec);
			}
		});
		jsgui[tagName].prototype._tag_name = tagName;
	});
	
	//jsgui = {};
	//jsgui.Core = Core;
	
	core_extension('div span h1 h2');
	// these should support text inside them.
	// the 'text' property could do something different for different things.
	
	// text_property('div span h1 h2')
	// a property that represents a textNode inside.
	
	// text property - will work as a property called text.
	//  however, when the text has been set/changed, it changes text in a textNode.
	// This text property should be a convenient interface to that text node.
	
	// I think that means we need a textNode.
	
	// Will have a dom.nodeType property.
	//  Most things will be 1 (element)
	//  Attribute node 2
	//  Text node 3
	
	// The properties indeed have greatly shortened this code.
	//  Likely to put the new property system into the full library when more fully defined.
	//  Or likely to put the full lib's capabilities into this, a new version of it?
	
	// The new property system looks set to save on a lot of code. So much of the code is currently dealing with the mechanics of property values.
	
	
	
	jsgui.textNode = Control.extend({
	    'init': function (spec) {
	    	spec = spec || {};
	    	if (tof(spec) == 'string') {
	    		//this._.text = spec;
				//this.innerHtml = spec;
	    		spec = {'text': spec};
	    	}
	    	
	    	spec.nodeType = 3;
	    	//this.ensure('_');
	    	
	    	/*
	    	if (spec.text) {
				this._.text = spec.text;
				//this.innerHtml = spec.text;
				spec = {};
			}
	    	*/
	    	//this.no_escape = spec.no_escape || false;
	    	// another property from the spec? I think this property could fit in with an MVC (or MMVC) pattern where changes lead to updates in the HTML without
	    	// needing much programming for each change. 2/3 of this class could be removed if using different OO.
	    	
	    	/*
	    	if (spec.no_escape) {
	    		this.ensure('_');
	    		this._.no_escape = spec.no_escape;
	    	}
	    	*/
	        this._super(spec);
			//this.typeName = pr.typeName;
			//this.tagName = 'p';
			
	    },
	    // will use a no-escape property.
	    /*
	    'no_escape': fp(function(a, sig) {
	    	if (a.l == 0) {
	    		return this.ret('_.no_escape');
	    	}
	    	if (a.l == 1) {
	    		this.ensure('_');
	    		this._.no_escape = a[0];
	    	}
	    }),
	    */
	    'all_html_render': function() {
	    	// need to escape the HTML it outputs.
	    	
	    	var escape_html = function(str) {
	    		
	    		console.log('str ' + str);
	    		
	    		// str.replace(/microsoft/gi, "W3Schools")
	    		/*
	    		var res = str.replace(/&/g, '&amp;');
	    		res = res.replace(/</g, '&lt;');
	    		res = res.replace(/>/g, '&gt;');
	    		res = res.replace(/"/g, '&quot;');
	    		res = res.replace(/'/g, '&#x27;');
	    		res = res.replace(/\//g, '&#x2F;');
	    		*/
	    		
	    		var replacements = [[/&/g, '&amp;'], [/</g, '&lt;'], [/>/g, '&gt;'], [/"/g, '&quot;'], [/'/g, '&#x27;'], [/\//g, '&#x2F;']];
	    		each (replacements, function(i, v) {
	    			str = str.replace(v[0], v[1]);
	    		});
	    		
	    		return str;
	    	};
	    	
	    	//var text = this._.text || '';
	    	var text = this.get('text');
	    	console.log('text ' + text);
	    	
	    	var nx = this.get('no_escape');
	    	console.log('nx ' + nx);
	    	
	    	if (nx) {
	    		res = text || '';
	    	} else {
	    		res = escape_html(text || '') || '';
	    	}
	    	
	    	
        	return res;
        }
	    /*,
        
        // will have a text property.
        
        'text': function(text) {
        	// need to update the text in the dom.
        	this._.text = text;
        	// use jQuery for this?
        	// or DOM?
        	// not sure jQuery handles text nodes directly so well.
        	
        	// is there this.$?
        	
        	// do these text nodes get recreated?
        	//  they can't have the jsgui expando like elements.
        	
        	// can not so easily get this text node activated on the client.
        	
        	//  what about the ability to get / identify text nodes from their parent?
        	//  so that a parent could be told what active text node it contains.
        	
        	// can tell a span control to change the text it contains.
        	
        	//.text_nodes(0).text...
        	//  having a ctrl keep track of any text nodes inside them
        	//   modelling them, having controls.
        	//   however, don't want lots of complications.
        	
        	
        	
        	// just innerHTML?
        	
        }
        */
	});
	
	
	var PageContext = jsgui.Class.extend({
    	'init': function(spec) {
    		if (spec.browser_info) {
    			this.browser_info = spec.browser_info;
    		};
    		
    		/*
    		this.itemIndex = function(obj, item) {
    		    var c = -1;
    		    $.each(obj, function(i, n) {
    		        if (n === obj) c = i;
    		    });
    		    return c;
    		};
    		*/
    		
    		this.get_vector_methodology = function() {
    			if (this.browser_info.ie) {
    				return 'vml';
    			} else {
    				return 'svg';
    			}
    		};
    		var qids = [], iQid = 1, qid = function() {
    		    var res = 'qid_' + iQid;
    		    iQid++;
    		    return res;
    		}, typedIds = {}, iTypedIds = {}, typed_id = function(str_type) {
    			if (typeof iTypedIds[str_type] === 'undefined') {
    				iTypedIds[str_type] = 1;
    			}
    			var res = iTypedIds[str_type];
    			iTypedIds[str_type] = iTypedIds[str_type] + 1;
    			return res;
    		}, teIds = {}, iteIds = {}, typed_enhancement_id = function(str_type) {
    			return str_type + '_' + typed_enhancement_int(str_type);
    		};
    		this.qid = qid;
    		this.teIds = teIds;
    		this.ctrls_by_id = {};
    		this.cl_abs = {}; // abstract controls for the client
    		// typed enhancements may be retired. Not actively using them late July 2011 but they could they be within the lower level workings?
    		var typed_enhancement_int = function(str_type) {
    			if (typeof iteIds[str_type] === 'undefined') {
    				iteIds[str_type] = 0;
    			};
    			//console.log('');
    			//console.log('** str_type ' + str_type);
    			
    			var res = iteIds[str_type];
    			iteIds[str_type] = iteIds[str_type] + 1;
    			return res;
    		};
    		this._advance_type_id = function(str_type, quantity) {
    			if (typeof quantity == 'undefined') quantity = 1;
    			iteIds[str_type] = iteIds[str_type] || 0;
    			iteIds[str_type] = iteIds[str_type] + quantity;
    		};
    		this.ensure_ctrl_id = function(ctrl) {
    			ctrl._ = ctrl._ || {};
    			
    			//console.log('ensure_ctrl_id ctrl._ ' + stringify(ctrl._));
    			
    			if (typeof ctrl._.id == 'undefined') {
    				// ctrl._.class_name
    				
    				
    				var id = typed_enhancement_id(ctrl._.type_name);
    				ctrl._.id = id;
    			}
    			return ctrl._.id;
    		};
    		// may be retired... could be behaviours / surfaces in specs.
    		this.apply_enhancement_id_spec = function(spec, ctrl) {
    			
    			// specifically what does this do?
    			
    			// The control will have another DOM attribute set
    			// This is only for when composing an enhanced control on the server?
    			// jsgui_e_id
    			
    			spec.dom = spec.dom || {};
    			spec.dom.attributes = spec.dom.attributes || {};
    			var tName = ctrl.typeName || 'misc';
    			var tei = typed_enhancement_int(tName);
    			spec.dom.attributes['jsgui_e_id'] = String(tei);
    			return [tName, tei];
    		};
    		this.get_spec = function(spec) {
    			spec = spec || {};
    			spec.page_context = this;
    			return spec;
    		};
    	}
    });
	
	// Maybe should not need to get browser info yet? Keep it general???
	
	
	// Perhaps there will be html-client.
	//  Will have the ctrls_by_id? The page_context.
	
	// Activating existing DOM nodes is easy enough without this activation system - just needs code to do it.
	//  But having the nodes created on the server, then sent to the client - requires the JSGUI IDs or other reconstruction code.
	
	// This does seem almost done for many uses - want to polish it though.
	
	// Want to make a blog site fairly soon.
	
	// Also a system for displaying content and programming snippets.
	// Much of it would be server side, not needing client side activation.
	//  Login could use it for enhancement.
	
	
	
	
	
	jsgui = jsgui.extend(jsgui, {
		'get_inline_css_dict_from_style': get_inline_css_dict_from_style,
		'apply_jsgui_style_rule_to_css_style': apply_jsgui_style_rule_to_css_style,
		'styles_dict_to_string': styles_dict_to_string,
		'Control': Control,
		'PageContext': PageContext
	});
	
	//alert('2 ' + jsgui);
	return jsgui;
	
});