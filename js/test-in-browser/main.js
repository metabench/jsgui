
requirejs.config({
    //By default load any module IDs from js/lib
    //baseUrl: '../test/z_core/essentials/',
    baseUrl: '../test/z_core/',

    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    
	paths: {
	    //assert: '../../../test-in-browser/lib/assert/assert'
	    assert: '../../test-in-browser/lib/assert/assert'
}
	
});

//requirejs(["test.spec", "constraint.spec", "data-object-fields-collection.spec"], function() {
//requirejs(["data/test.spec", "essentials/other.spec"], function () {
requirejs(["essentials/other.spec"], function () {


    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".
	
	
    //mocha.checkLeaks();
    //mocha.globals(['jQuery']);
    mocha.run();
	
	
	
});