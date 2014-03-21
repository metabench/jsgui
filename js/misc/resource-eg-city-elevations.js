// An example resource that provides city elevations

// A connector resource could modify these elevations so that they are in a different unit.


define(["./jsgui-lang-util", './resource'], function(jsgui, Resource) {
	
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object;
	var Collection = jsgui.Collection;
	var is_defined = jsgui.is_defined;
	// The basic resource connector... not quite sure what it needs to do 27/02/2012.
	//  Fills in the gap conceptually.
	
	var Rsce = Resource;
	
	// And have a default property, the elevations.
	
	// Have a Resource wrapper for a Data_Object?
	//  Anyway, want to get closer to getting some wesbites done soon.
	//  Nice to have a very simple Resource example.
	
	// Could use this Resource for persisting to a Mongo DB.
	
	
	
	// Do Collections have contexts here?
	//  Do they need them when they are not running as a server app?
	
	var City_Elevations = Rsce.extend({
	    // elevations field could be set up here.
	    //  collection will carry out indexing of fields.
	    //  interested in doing a numeric index using the B+ tree.
	    
	    // we can define a city_elevation field.
	    
	    // or this is interacting with indexed data about cities?
	    // I think making a WorldInfo resource may make sense.
	    //  But then again, not just the world, space too.
	    // PhysicalDomain info?
	    
	    // But can extend this example for city elevations a bit more.
	    
	    'fields': {
	        'elevations': Collection(['city_name', 'elevation'])
	    },
	    //  That could be useful information for retrieving the elevations and the city name with an index.
	    //  Maybe define collection differently?
	    
	    // Need to make it so that get works asyncronously, or we can tell if it's asyncronous or not.
	    
	    
	    
	
		'init': function(spec) {
			this._super(spec);
			
			// Have a way of telling it that the elevations field is in metres?
			
			// we can set up the fields.
			
			
			// When setting, nice if it has awareness of the field names???
			
			// This should have a callback as a resource.
			
			
			this.set('elevations', [['Tirane', 104], ['Andorra la Vella', 1049]]);
			
			// does setting like this work?
			//  it needs the callback?
			
			
			
		}
		// Need to generally have resources work asyncronously.
		
		// asyncronize function?
		//  async function wrapper for sync functions?
		//   calls them, giving a callback as the result.
		//   for functions not prone to throwing errors!
		
		
		
		// async_get?
		
		
		
		// And basically query a Resource, get JSON back.
		
		// Basically get and set interface.
		
		
		
		
	
	});
	
	
	var res = {
		'City_Elevations': City_Elevations
	}
	
	return City_Elevations;
	
});