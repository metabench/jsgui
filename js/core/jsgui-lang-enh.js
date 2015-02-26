// This is resulting in smaller code in other parts of the framework.
//  This section is getting quite big (again)
//  Still need to make use of the B+ free for ordered indexing.

// Moving some code to jsgui-lang-essentials
//  Will be publishing a 0.4 version of that before so long?
//   Maybe with more explanation?

// It may be worth publishing this, and a discussion forum about it on my own web forum.
//  Perhaps that could come later, but jsgui-lang-essentials may be a good step. Could call it version 0.35.
//   Could have a few examples
//   Would be a useful toolkit I could use while working elsewhere.

//  I think that web site would be lightening fast, and impress people with its speed compared to other web platforms that they are used to
//   (though Facebook is OK)

// This is going to be using data_types as well.
// Will also have a system of requirements.
//  That could mean they need to be both the right data type, as well as having some other specified properties.

/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["./jsgui-lang-util", "./enhanced-data-object"], function(jsgui, Enhanced_Data_Object) {

    */
var jsgui = require('./jsgui-lang-util');
var Enhanced_Data_Object = require('./enhanced-data-object');
	
	// Will use data structures.
	//  Not sure about using all of them here.
	
	// A mix-in system of enhancing the data structures may work best.
	//  It does not start with B+ tree, but that gets brought in?
	
	// However, having B+ as part of it could work quite nicely.
	var tof = jsgui.tof;
	var Collection = jsgui.Collection;
	var Data_Value = jsgui.Data_Value;

	jsgui.Enhanced_Data_Object = Enhanced_Data_Object;

	// Not sure about this for the moment.
	//  Quite a lot is going in lang-util.
	//jsgui.map_data_type_data_object_constructors = Enhanced_Data_Object.map_data_type_data_object_constructors;

	jsgui.Mini_Context = Enhanced_Data_Object.Mini_Context;

	// Maybe can give a context as well?

	var fromObject = function(value) {
		var tValue = tof(value);
		if (tValue == 'array') {
			var collRes = new Collection();

			for (var c = 0, l = value.length; c < l; c++) {
				collRes.push(fromObject(value[c]));
			}
			return collRes;

		}
		if (tValue == 'object') {
			var edoRes = new Enhanced_Data_Object();
			for (i in value) {
				edoRes.set(i, fromObject(value[i]));
			}
			return edoRes;
		}
		if (tValue == 'string') {
			var dvRes = new Data_Value({'value': value});
			return dvRes;
		}
		if (tValue == 'number') {
			var dvRes = new Data_Value({'value': value});
			return dvRes;
		}

	}

	jsgui.fromObject = fromObject;
	
    //Enhanced_Data_Object.prototype._get_input_processors = function() {
    //	return jsgui.input_processors;
    //}
    module.exports = jsgui;
	//return jsgui;

//});