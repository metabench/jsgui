You can see the "test in browser" sample in the js/test-in-browser directory. Open the test-core.html file in the browser, 
and you will see the present core testing results. 

The testing modules setup is inside the test-core.js file:

- the requirejs.config.baseUrl should be set to some base directory containing the test module files
- the requirejs.config.paths should points to the "assert" module relative to the requirejs.config.baseUrl
- the requirejs() call should contains the test module references relative to the requirejs.config.baseUrl