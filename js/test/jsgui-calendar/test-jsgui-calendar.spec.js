
if (typeof define !== 'function') { var define = require('amdefine')(module) }
    
define(['../../web/jsgui-html', '../../web/controls/advanced/jsgui-calendar', 'assert'], function (jsgui, Calendar, assert) {
	
	var stringify = jsgui.stringify, Collection = jsgui.Collection;
	var each = jsgui.each, tof = jsgui.tof;
	
	var call_multi = jsgui.call_multi;
	
	describe("jsgui-calendar/test-jsgui-calendar.spec.js", function() {
	  it("contains spec with an expectation", function() {
	
	    var calendar = new Calendar({
	    	// May want to set the date or a range of dates... selected dates.
	    });
	    //console.log('calendar ' + stringify(calendar));
	    
	    
	    //var calendar_html = calendar.all_html_render();
	    //console.log('calendar_html ' + calendar_html);

        assert.equal(tof(calendar), 'control');	
		
	    var view_type = calendar.get('view_type');
		
        assert.equal(stringify(view_type), '"month"');	
        assert.equal(view_type.get(), 'month');	
		
	    
	  });
	});	
	
	
});
	
