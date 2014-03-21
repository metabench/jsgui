
if (!(requirejs)) {
	var requirejs = require('requirejs');

	requirejs.config({
	    nodeRequire: require
	});
	
}

//requirejs(['../../jsgui-lang-essentials', '../../jsgui-html'],
//function (jsgui, ) {
    
requirejs(['../../../native_fib/build/Release/binding.node'],
	function (native_fib) {
		native_fib.fib(10,function(data){
	  		console.log(data);
		});
	}
);