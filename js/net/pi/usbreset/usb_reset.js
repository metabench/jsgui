var exec = require('child_process').exec;

exec('sudo ./usbreset /dev/bus/usb/001/008', function (error, stdout, stderr) {
	console.log('stdout', stdout);
	
});
