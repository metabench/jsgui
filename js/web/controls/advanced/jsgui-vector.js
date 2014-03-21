if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}



define(["../../jsgui-html"], function(jsgui) {
	var Control = jsgui.Control;
	var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
	var is_defined = jsgui.is_defined;


	// define the polygon, but have different ways in which it gets rendered in various contexts.
	//  could even have it render by downloading an encoded image of some sort. Encode the JSON description of the polygon (maybe as compressed base64) in the URL, then it downloads that polygon.

	// Polygon composed of an array of points.
	//  Collection of points (so when it is changed it could be updated in the GUI)

	// What about having the collection be of the Point object?
	//  Also it will have easier ways of constructing those points.


	// filled, fill color, fill, stroke color, fill background?
	//  Could have a few properties here.
	// Not sure about declaring complex fields right now
	//  Stroke thickness

	// define the fill - of a type polygon fill.
	//  could have aliases for fill properties.

	// want to specify  these things fairly easily.
	//  like specify a filled polygon

	// fill and stroke.

	//  May want to do more to investigate and test objects containing fields.


	// Maybe this should be a control... it will be able to render.
	//  Perhaps this needs a bit more indirection to work properly.
	//  Fill and stroke... will be rendered as strings, but will be a bit more complicated with input processors.

	// Could hold fill and stroke objects.

	// Such as a block of color

	// Set the fill to '#ABCDEF' sets it to the color.
	//  Will have input processors for understanding vector fills.
	//  The fill object will be somewhat complicated.
	//  Some won't be able to be rendered to VML (at all easily).
	// There would be different options for the fill... it could just be a color.

	// What about declaring a Data_Object to hold the fill property?
	//  A Data_Object that is very flexible in what it holds... or there will be different types of fills that can all render themselves
	//  to the fill property.

	// The vector_stroke object
	//  And the vector_fill object.

	// These vector stroke and fill classes will get rendered to vml and svg elements.
	//  At the moment, I am still working on getting the definitions right.
	//  Could have a fair amount within the object-oriented type system.

	// Want to have this quickly represented so it doe not use much code - and have the hard work done by the object system.
	//  So the vector_stroke could be in a variety of different formats.
	//  It may be output as an element itself, or a string descriptions.

	// Want to have it so it gets set easily, and the rendering system uses the information available in a simple way.
	//  Need this vector system to be a very lightweight addition to the system. Not many KBs at all.

	// Should define a fill object.

	// And then we have that as the type for the fill field.
	var EDO = jsgui.Enhanced_Data_Object;

	// And can use a linear gradient as a fill...
	//  Or a radial gradient.

	// Can do solid fills too.

	// Linear gradients would be given an ID within the document.

	// Will have paint servers within SVG.

	// But want to be able to specify a fill as just being a color.


	// Fill can refer to (or perhaps be) a linear or radial gradient, perhaps a different image or pattern.

	var Linear_Gradient = EDO.extend({

		// Could refer to a paint-server type object.

		'fields': [
			//''
		]
	});
	var Radial_Gradient = EDO.extend({

		// Could refer to a paint-server type object.

		'fields': [
			//''
		]
	});

	// And when a 'fill' object gets set with a color value, it may use that to set the color property.
	//  There would be some kind of 'set' or input processor for these, that apply properties to the 'color' value.

	var Fill = EDO.extend({

		// Could refer to a paint-server type object.
		//  This could have a color
		//  It could have a reference to a paint-server type object.
		'fields': [
			['color', 'color']
		]
	});

	var Stroke = EDO.extend({

		// Could refer to a paint-server type object.

		'fields': [
			['width', 'number'],
			['color', 'color']
		]
	});


	// Maybe could specify it as a collection of points or Data_Values.
	//  [x,y]
	// And could have some more optimized way of storing these too.

	var Polygon = EDO.extend({
		'fields': [
			// Want a Collection of point objects? Point object just being [x, y] in an array.
			['points', 'collection'],
			['stroke', Stroke],
			['fill', Fill]
		]

		// Then will have methods to render this - both as SVG or VML.



	});

	// This may use some form of input processors.
	//  However, it should create Fill and Stroke objects, the correct constructors for the field.
	//  It should be able to get the constructors out of the field objects.



	// And will have ways to render the polygon to a few diferent contexts.
	//  And they will render as SVH or VML.

	var Vector = {
		'Linear_Gradient': Linear_Gradient,
		'Radial_Gradient': Radial_Gradient,
		'Fill': Fill,
		'Stroke': Stroke,
		'Polygon': Polygon
	}

	return Vector;



});