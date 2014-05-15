You can see the "test in browser" sample in the js/test-in-browser directory. Open the test.html file in the browser, and you will see the "constraint.spec.js" and "data-object-fields-collection.spec.js" testing results. 

The testing modules setup is inside the main.js file:

- the requirejs.config.baseUrl should be set to the directory containing the test module files
- the requirejs.config.paths should points to the "assert" and "chai" modules relative to the requirejs.config.baseUrl
- the requirejs() call should contains the test module names.