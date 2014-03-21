var foo = require('../../image/png-iterate/build/Release/png_iterate.node');

var fs = require('fs');
var pngjs = require('pngjs');

fs.createReadStream('./barb.png')
	.pipe(new pngjs.PNG({
	    filterType: 4
	}))
	.on('parsed', function() {
	var self = this;

	foo.read(this.data, this.width, this.height, function(data){
		//console.log("test");
		//console.log("Quanted data: " + data.length);
		console.log("length: " + data.length);
		
		/*var png = new pngjs.PNG({
		                    width:self.width,
		                    height:self.height
		                });


		    var x = 0;
		    var y = 0;
		    var w = self.width;
		    var h = self.height;

		    var start = 0;//(y*480*4) + x*4;
		    var k = 0;

		    for (i = 0; i < h; i++) {
		        k = (start + i*w*4);
		        for ( j = 0; j < w; j++) {
		            var idx = (i * w + j) << 2;

		            png.data[k] = data[idx];
		            k++;
		            png.data[k] = data[idx + 1];
		            k++;
		            png.data[k] = data[idx + 2];
		            k++;
		            png.data[k] = data[idx + 3];
		            k++;

		        }
		    }

		    png.pack().pipe(fs.createWriteStream("quanted.png"));*/
		 });
});

