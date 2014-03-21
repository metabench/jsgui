
// test-abstract-controls



if (!(requirejs)) {
	var requirejs = require('requirejs');

	requirejs.config({
	    nodeRequire: require
	});
	
}

// make keyword as standard rather than nu
//  function provided by the context.


//requirejs(['../../jsgui-lang-essentials', '../../jsgui-html'],
//function (jsgui, ) {
    
requirejs(['../../web/jsgui-html', '../../web/controls/basic/radio-button'],
function (jsgui, Radio_Button) {
    var tof = jsgui.tof;
    //var abstract_div = jsgui.div({

    //})
	
	var test_Abstract_radio = function() {
		var abstract_radio = Radio_Button({
	    	// May want to set the date or a range of dates... selected dates.
	    	'group_name': 'groupB',
	    	'checked': true,
	    	'value': 'rdo',
	    	'id': true
	    });

	    console.log('abstract_radio ' + abstract_radio);
    	console.log('tof(abstract_radio) ' + tof(abstract_radio));

    	// then we should be able to make an instance of it.
    	//make(abstract_radio);
    	// Make will have the context as well.
    	//nu(abstract_radio) - would be able to choose the function's name when it is given as a param to a function.
    	// nu would be a shorthand.

    	// then context.make(abstract_radio) will construct it.

    	// Could define a mini-context.
    	//  That minicontext would have a make function.
    	
    	console.log(abstract_radio instanceof Radio_Button);
    	//console.log(new abstract_radio.constructor({}) instanceof Radio_Button);
    	//throw '!!stop';


    	var mc = new jsgui.Mini_Context();
    	var radio = mc.make(abstract_radio);
    	console.log('radio ' + radio);

    	// then render it...
    	var html = radio.all_html_render();
    	console.log('html ' + html);

	}
	test_Abstract_radio();
	

    





});