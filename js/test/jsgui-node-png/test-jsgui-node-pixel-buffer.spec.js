// Connect to the binding object in this module...



if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../../core/jsgui-lang-essentials', 'fs', '../../image/jsgui-node-png',
    '../../image/build/Release/binding.node', 'assert', '../test-utils/test-utils'], 
    function(jsgui, fs, jsgui_png, buffer_cpp, assert, test_utils) {
        var stringify = jsgui.stringify, call_multi = jsgui.call_multi;
        //var source_file = './source/pliers2.png';
        //var source_file = './source/f00n2c08.png';
        var source_file = './source/pngsuite/f00n2c08.png';
        		
		describe("jsgui-node-png/test-jsgui-node-pixel-buffer.spec.js", function() {
		
			// -----------------------------------------------------
			//	test_load_png_iterate
			// -----------------------------------------------------
				
			it("test_load_png_iterate", function(done) {
			
				// f00n2c08
				// load up a PNG file.
				//  then iterate through its pixels.
        
				var test_load_png_iterate = function() {
					process.chdir(__dirname);
					jsgui_png.load_from_disk(source_file, function(err, png) {
						if (err) {
							throw err;
						} else {
							//console.log('loaded png');
							
							// get the pixel at 0, 0.
							
							var estimated = [{x:0,y:0,px:255},{x:1,y:0,px:255},{x:2,y:0,px:255},{x:3,y:0,px:255},{x:4,y:0,px:255},{x:5,y:0,px:255},{x:6,y:0,px:255},{x:7,y:0,px:255},{x:8,y:0,px:255},{x:9,y:0,px:255},{x:10,y:0,px:255},{x:11,y:0,px:255},{x:12,y:0,px:255},{x:13,y:0,px:255},{x:14,y:0,px:255},{x:15,y:0,px:255},{x:16,y:0,px:255},{x:17,y:0,px:255},{x:18,y:0,px:255},{x:19,y:0,px:255},{x:20,y:0,px:255},{x:21,y:0,px:255},{x:22,y:0,px:255},{x:23,y:0,px:255},{x:24,y:0,px:255},{x:25,y:0,px:255},{x:26,y:0,px:255},{x:27,y:0,px:255},{x:28,y:0,px:255},{x:29,y:0,px:255},{x:30,y:0,px:255},{x:31,y:0,px:255},{x:0,y:1,px:238},{x:1,y:1,px:255},{x:2,y:1,px:255},{x:3,y:1,px:255},{x:4,y:1,px:255},{x:5,y:1,px:255},{x:6,y:1,px:255},{x:7,y:1,px:255},{x:8,y:1,px:255},{x:9,y:1,px:255},{x:10,y:1,px:255},{x:11,y:1,px:255},{x:12,y:1,px:255},{x:13,y:1,px:255},{x:14,y:1,px:255},{x:15,y:1,px:255},{x:16,y:1,px:255},{x:17,y:1,px:255},{x:18,y:1,px:255},{x:19,y:1,px:255},{x:20,y:1,px:255},{x:21,y:1,px:255},{x:22,y:1,px:255},{x:23,y:1,px:255},{x:24,y:1,px:255},{x:25,y:1,px:255},{x:26,y:1,px:255},{x:27,y:1,px:255},{x:28,y:1,px:255},{x:29,y:1,px:255},{x:30,y:1,px:255},{x:31,y:1,px:255},{x:0,y:2,px:223},{x:1,y:2,px:238},{x:2,y:2,px:255},{x:3,y:2,px:255},{x:4,y:2,px:255},{x:5,y:2,px:255},{x:6,y:2,px:255},{x:7,y:2,px:255},{x:8,y:2,px:255},{x:9,y:2,px:255},{x:10,y:2,px:255},{x:11,y:2,px:255},{x:12,y:2,px:255},{x:13,y:2,px:255},{x:14,y:2,px:255},{x:15,y:2,px:255},{x:16,y:2,px:255},{x:17,y:2,px:255},{x:18,y:2,px:255},{x:19,y:2,px:255},{x:20,y:2,px:255},{x:21,y:2,px:255},{x:22,y:2,px:255},{x:23,y:2,px:255},{x:24,y:2,px:255},{x:25,y:2,px:255},{x:26,y:2,px:255},{x:27,y:2,px:255},{x:28,y:2,px:255},{x:29,y:2,px:255},{x:30,y:2,px:255},{x:31,y:2,px:255},{x:0,y:3,px:208},{x:1,y:3,px:223},{x:2,y:3,px:238},{x:3,y:3,px:255},{x:4,y:3,px:255},{x:5,y:3,px:255},{x:6,y:3,px:255},{x:7,y:3,px:255},{x:8,y:3,px:255},{x:9,y:3,px:255},{x:10,y:3,px:255},{x:11,y:3,px:255},{x:12,y:3,px:255},{x:13,y:3,px:255},{x:14,y:3,px:255},{x:15,y:3,px:255},{x:16,y:3,px:255},{x:17,y:3,px:255},{x:18,y:3,px:255},{x:19,y:3,px:255},{x:20,y:3,px:255},{x:21,y:3,px:255},{x:22,y:3,px:255},{x:23,y:3,px:255},{x:24,y:3,px:255},{x:25,y:3,px:255},{x:26,y:3,px:255},{x:27,y:3,px:255},{x:28,y:3,px:255},{x:29,y:3,px:255},{x:30,y:3,px:255},{x:31,y:3,px:255},{x:0,y:4,px:193},{x:1,y:4,px:208},{x:2,y:4,px:223},{x:3,y:4,px:238},{x:4,y:4,px:255},{x:5,y:4,px:255},{x:6,y:4,px:255},{x:7,y:4,px:255},{x:8,y:4,px:255},{x:9,y:4,px:255},{x:10,y:4,px:255},{x:11,y:4,px:255},{x:12,y:4,px:255},{x:13,y:4,px:255},{x:14,y:4,px:255},{x:15,y:4,px:255},{x:16,y:4,px:255},{x:17,y:4,px:255},{x:18,y:4,px:255},{x:19,y:4,px:255},{x:20,y:4,px:255},{x:21,y:4,px:255},{x:22,y:4,px:255},{x:23,y:4,px:255},{x:24,y:4,px:255},{x:25,y:4,px:255},{x:26,y:4,px:255},{x:27,y:4,px:255},{x:28,y:4,px:255},{x:29,y:4,px:255},{x:30,y:4,px:255},{x:31,y:4,px:255},{x:0,y:5,px:179},{x:1,y:5,px:193},{x:2,y:5,px:208},{x:3,y:5,px:223},{x:4,y:5,px:238},{x:5,y:5,px:255},{x:6,y:5,px:255},{x:7,y:5,px:255},{x:8,y:5,px:255},{x:9,y:5,px:255},{x:10,y:5,px:255},{x:11,y:5,px:255},{x:12,y:5,px:255},{x:13,y:5,px:255},{x:14,y:5,px:255},{x:15,y:5,px:255},{x:16,y:5,px:255},{x:17,y:5,px:255},{x:18,y:5,px:255},{x:19,y:5,px:255},{x:20,y:5,px:255},{x:21,y:5,px:255},{x:22,y:5,px:255},{x:23,y:5,px:255},{x:24,y:5,px:255},{x:25,y:5,px:255},{x:26,y:5,px:255},{x:27,y:5,px:255},{x:28,y:5,px:255},{x:29,y:5,px:255},{x:30,y:5,px:255},{x:31,y:5,px:255},{x:0,y:6,px:165},{x:1,y:6,px:179},{x:2,y:6,px:193},{x:3,y:6,px:208},{x:4,y:6,px:223},{x:5,y:6,px:238},{x:6,y:6,px:255},{x:7,y:6,px:255},{x:8,y:6,px:255},{x:9,y:6,px:255},{x:10,y:6,px:255},{x:11,y:6,px:255},{x:12,y:6,px:255},{x:13,y:6,px:255},{x:14,y:6,px:255},{x:15,y:6,px:255},{x:16,y:6,px:255},{x:17,y:6,px:255},{x:18,y:6,px:255},{x:19,y:6,px:255},{x:20,y:6,px:255},{x:21,y:6,px:255},{x:22,y:6,px:255},{x:23,y:6,px:255},{x:24,y:6,px:255},{x:25,y:6,px:255},{x:26,y:6,px:255},{x:27,y:6,px:255},{x:28,y:6,px:255},{x:29,y:6,px:255},{x:30,y:6,px:255},{x:31,y:6,px:255},{x:0,y:7,px:152},{x:1,y:7,px:165},{x:2,y:7,px:179},{x:3,y:7,px:193},{x:4,y:7,px:208},{x:5,y:7,px:223},{x:6,y:7,px:238},{x:7,y:7,px:255},{x:8,y:7,px:255},{x:9,y:7,px:255},{x:10,y:7,px:255},{x:11,y:7,px:255},{x:12,y:7,px:255},{x:13,y:7,px:255},{x:14,y:7,px:255},{x:15,y:7,px:255},{x:16,y:7,px:255},{x:17,y:7,px:255},{x:18,y:7,px:255},{x:19,y:7,px:255},{x:20,y:7,px:255},{x:21,y:7,px:255},{x:22,y:7,px:255},{x:23,y:7,px:255},{x:24,y:7,px:255},{x:25,y:7,px:255},{x:26,y:7,px:255},{x:27,y:7,px:255},{x:28,y:7,px:255},{x:29,y:7,px:255},{x:30,y:7,px:255},{x:31,y:7,px:255},{x:0,y:8,px:140},{x:1,y:8,px:152},{x:2,y:8,px:165},{x:3,y:8,px:179},{x:4,y:8,px:193},{x:5,y:8,px:208},{x:6,y:8,px:223},{x:7,y:8,px:238},{x:8,y:8,px:255},{x:9,y:8,px:255},{x:10,y:8,px:255},{x:11,y:8,px:255},{x:12,y:8,px:255},{x:13,y:8,px:0},{x:14,y:8,px:0},{x:15,y:8,px:0},{x:16,y:8,px:0},{x:17,y:8,px:0},{x:18,y:8,px:0},{x:19,y:8,px:255},{x:20,y:8,px:255},{x:21,y:8,px:255},{x:22,y:8,px:255},{x:23,y:8,px:255},{x:24,y:8,px:255},{x:25,y:8,px:255},{x:26,y:8,px:255},{x:27,y:8,px:255},{x:28,y:8,px:255},{x:29,y:8,px:255},{x:30,y:8,px:255},{x:31,y:8,px:255},{x:0,y:9,px:112},{x:1,y:9,px:123},{x:2,y:9,px:134},{x:3,y:9,px:145},{x:4,y:9,px:157},{x:5,y:9,px:169},{x:6,y:9,px:182},{x:7,y:9,px:196},{x:8,y:9,px:209},{x:9,y:9,px:224},{x:10,y:9,px:225},{x:11,y:9,px:226},{x:12,y:9,px:0},{x:13,y:9,px:0},{x:14,y:9,px:0},{x:15,y:9,px:0},{x:16,y:9,px:0},{x:17,y:9,px:0},{x:18,y:9,px:0},{x:19,y:9,px:0},{x:20,y:9,px:235},{x:21,y:9,px:236},{x:22,y:9,px:236},{x:23,y:9,px:238},{x:24,y:9,px:239},{x:25,y:9,px:240},{x:26,y:9,px:240},{x:27,y:9,px:242},{x:28,y:9,px:243},{x:29,y:9,px:243},{x:30,y:9,px:244},{x:31,y:9,px:246},{x:0,y:10,px:88},{x:1,y:10,px:96},{x:2,y:10,px:105},{x:3,y:10,px:115},{x:4,y:10,px:124},{x:5,y:10,px:135},{x:6,y:10,px:145},{x:7,y:10,px:156},{x:8,y:10,px:168},{x:9,y:10,px:179},{x:10,y:10,px:192},{x:11,y:10,px:0},{x:12,y:10,px:0},{x:13,y:10,px:0},{x:14,y:10,px:200},{x:15,y:10,px:202},{x:16,y:10,px:204},{x:17,y:10,px:206},{x:18,y:10,px:0},{x:19,y:10,px:0},{x:20,y:10,px:0},{x:21,y:10,px:214},{x:22,y:10,px:216},{x:23,y:10,px:218},{x:24,y:10,px:220},{x:25,y:10,px:222},{x:26,y:10,px:224},{x:27,y:10,px:226},{x:28,y:10,px:228},{x:29,y:10,px:230},{x:30,y:10,px:232},{x:31,y:10,px:234},{x:0,y:11,px:66},{x:1,y:11,px:73},{x:2,y:11,px:80},{x:3,y:11,px:88},{x:4,y:11,px:95},{x:5,y:11,px:104},{x:6,y:11,px:112},{x:7,y:11,px:121},{x:8,y:11,px:130},{x:9,y:11,px:140},{x:10,y:11,px:149},{x:11,y:11,px:0},{x:12,y:11,px:0},{x:13,y:11,px:166},{x:14,y:11,px:169},{x:15,y:11,px:172},{x:16,y:11,px:175},{x:17,y:11,px:178},{x:18,y:11,px:181},{x:19,y:11,px:0},{x:20,y:11,px:0},{x:21,y:11,px:190},{x:22,y:11,px:193},{x:23,y:11,px:196},{x:24,y:11,px:199},{x:25,y:11,px:202},{x:26,y:11,px:205},{x:27,y:11,px:209},{x:28,y:11,px:212},{x:29,y:11,px:215},{x:30,y:11,px:218},{x:31,y:11,px:221},{x:0,y:12,px:48},{x:1,y:12,px:53},{x:2,y:12,px:58},{x:3,y:12,px:64},{x:4,y:12,px:70},{x:5,y:12,px:76},{x:6,y:12,px:83},{x:7,y:12,px:90},{x:8,y:12,px:97},{x:9,y:12,px:104},{x:10,y:12,px:112},{x:11,y:12,px:0},{x:12,y:12,px:0},{x:13,y:12,px:132},{x:14,y:12,px:136},{x:15,y:12,px:140},{x:16,y:12,px:144},{x:17,y:12,px:148},{x:18,y:12,px:0},{x:19,y:12,px:0},{x:20,y:12,px:0},{x:21,y:12,px:164},{x:22,y:12,px:168},{x:23,y:12,px:173},{x:24,y:12,px:177},{x:25,y:12,px:181},{x:26,y:12,px:185},{x:27,y:12,px:189},{x:28,y:12,px:193},{x:29,y:12,px:197},{x:30,y:12,px:201},{x:31,y:12,px:205},{x:0,y:13,px:32},{x:1,y:13,px:36},{x:2,y:13,px:39},{x:3,y:13,px:44},{x:4,y:13,px:48},{x:5,y:13,px:52},{x:6,y:13,px:57},{x:7,y:13,px:62},{x:8,y:13,px:67},{x:9,y:13,px:72},{x:10,y:13,px:78},{x:11,y:13,px:0},{x:12,y:13,px:0},{x:13,y:13,px:96},{x:14,y:13,px:101},{x:15,y:13,px:106},{x:16,y:13,px:111},{x:17,y:13,px:0},{x:18,y:13,px:0},{x:19,y:13,px:0},{x:20,y:13,px:0},{x:21,y:13,px:137},{x:22,y:13,px:142},{x:23,y:13,px:147},{x:24,y:13,px:152},{x:25,y:13,px:157},{x:26,y:13,px:162},{x:27,y:13,px:167},{x:28,y:13,px:172},{x:29,y:13,px:178},{x:30,y:13,px:183},{x:31,y:13,px:188},{x:0,y:14,px:19},{x:1,y:14,px:21},{x:2,y:14,px:24},{x:3,y:14,px:26},{x:4,y:14,px:29},{x:5,y:14,px:32},{x:6,y:14,px:35},{x:7,y:14,px:38},{x:8,y:14,px:41},{x:9,y:14,px:45},{x:10,y:14,px:48},{x:11,y:14,px:0},{x:12,y:14,px:0},{x:13,y:14,px:59},{x:14,y:14,px:64},{x:15,y:14,px:70},{x:16,y:14,px:0},{x:17,y:14,px:0},{x:18,y:14,px:0},{x:19,y:14,px:0},{x:20,y:14,px:0},{x:21,y:14,px:107},{x:22,y:14,px:113},{x:23,y:14,px:119},{x:24,y:14,px:125},{x:25,y:14,px:131},{x:26,y:14,px:137},{x:27,y:14,px:144},{x:28,y:14,px:150},{x:29,y:14,px:156},{x:30,y:14,px:162},{x:31,y:14,px:168},{x:0,y:15,px:8},{x:1,y:15,px:9},{x:2,y:15,px:10},{x:3,y:15,px:12},{x:4,y:15,px:13},{x:5,y:15,px:14},{x:6,y:15,px:16},{x:7,y:15,px:17},{x:8,y:15,px:19},{x:9,y:15,px:20},{x:10,y:15,px:22},{x:11,y:15,px:0},{x:12,y:15,px:0},{x:13,y:15,px:28},{x:14,y:15,px:29},{x:15,y:15,px:0},{x:16,y:15,px:0},{x:17,y:15,px:0},{x:18,y:15,px:53},{x:19,y:15,px:0},{x:20,y:15,px:0},{x:21,y:15,px:75},{x:22,y:15,px:82},{x:23,y:15,px:89},{x:24,y:15,px:96},{x:25,y:15,px:103},{x:26,y:15,px:111},{x:27,y:15,px:118},{x:28,y:15,px:125},{x:29,y:15,px:132},{x:30,y:15,px:139},{x:31,y:15,px:147},{x:0,y:16,px:0},{x:1,y:16,px:1},{x:2,y:16,px:1},{x:3,y:16,px:1},{x:4,y:16,px:1},{x:5,y:16,px:1},{x:6,y:16,px:1},{x:7,y:16,px:2},{x:8,y:16,px:2},{x:9,y:16,px:2},{x:10,y:16,px:2},{x:11,y:16,px:0},{x:12,y:16,px:0},{x:13,y:16,px:3},{x:14,y:16,px:0},{x:15,y:16,px:0},{x:16,y:16,px:0},{x:17,y:16,px:12},{x:18,y:16,px:20},{x:19,y:16,px:0},{x:20,y:16,px:0},{x:21,y:16,px:44},{x:22,y:16,px:52},{x:23,y:16,px:60},{x:24,y:16,px:68},{x:25,y:16,px:76},{x:26,y:16,px:84},{x:27,y:16,px:93},{x:28,y:16,px:101},{x:29,y:16,px:109},{x:30,y:16,px:117},{x:31,y:16,px:125},{x:0,y:17,px:0},{x:1,y:17,px:0},{x:2,y:17,px:1},{x:3,y:17,px:1},{x:4,y:17,px:1},{x:5,y:17,px:1},{x:6,y:17,px:1},{x:7,y:17,px:1},{x:8,y:17,px:2},{x:9,y:17,px:2},{x:10,y:17,px:2},{x:11,y:17,px:0},{x:12,y:17,px:0},{x:13,y:17,px:0},{x:14,y:17,px:0},{x:15,y:17,px:0},{x:16,y:17,px:3},{x:17,y:17,px:4},{x:18,y:17,px:12},{x:19,y:17,px:0},{x:20,y:17,px:0},{x:21,y:17,px:36},{x:22,y:17,px:44},{x:23,y:17,px:52},{x:24,y:17,px:60},{x:25,y:17,px:68},{x:26,y:17,px:76},{x:27,y:17,px:84},{x:28,y:17,px:93},{x:29,y:17,px:101},{x:30,y:17,px:109},{x:31,y:17,px:117},{x:0,y:18,px:0},{x:1,y:18,px:0},{x:2,y:18,px:0},{x:3,y:18,px:0},{x:4,y:18,px:0},{x:5,y:18,px:1},{x:6,y:18,px:1},{x:7,y:18,px:1},{x:8,y:18,px:1},{x:9,y:18,px:1},{x:10,y:18,px:1},{x:11,y:18,px:0},{x:12,y:18,px:0},{x:13,y:18,px:0},{x:14,y:18,px:0},{x:15,y:18,px:2},{x:16,y:18,px:2},{x:17,y:18,px:2},{x:18,y:18,px:3},{x:19,y:18,px:0},{x:20,y:18,px:0},{x:21,y:18,px:27},{x:22,y:18,px:35},{x:23,y:18,px:43},{x:24,y:18,px:51},{x:25,y:18,px:59},{x:26,y:18,px:68},{x:27,y:18,px:76},{x:28,y:18,px:84},{x:29,y:18,px:92},{x:30,y:18,px:100},{x:31,y:18,px:108},{x:0,y:19,px:0},{x:1,y:19,px:0},{x:2,y:19,px:0},{x:3,y:19,px:0},{x:4,y:19,px:0},{x:5,y:19,px:0},{x:6,y:19,px:1},{x:7,y:19,px:1},{x:8,y:19,px:1},{x:9,y:19,px:1},{x:10,y:19,px:1},{x:11,y:19,px:0},{x:12,y:19,px:0},{x:13,y:19,px:0},{x:14,y:19,px:2},{x:15,y:19,px:2},{x:16,y:19,px:2},{x:17,y:19,px:2},{x:18,y:19,px:2},{x:19,y:19,px:0},{x:20,y:19,px:0},{x:21,y:19,px:19},{x:22,y:19,px:27},{x:23,y:19,px:35},{x:24,y:19,px:43},{x:25,y:19,px:51},{x:26,y:19,px:59},{x:27,y:19,px:68},{x:28,y:19,px:76},{x:29,y:19,px:84},{x:30,y:19,px:92},{x:31,y:19,px:100},{x:0,y:20,px:0},{x:1,y:20,px:0},{x:2,y:20,px:0},{x:3,y:20,px:0},{x:4,y:20,px:0},{x:5,y:20,px:0},{x:6,y:20,px:0},{x:7,y:20,px:1},{x:8,y:20,px:1},{x:9,y:20,px:1},{x:10,y:20,px:1},{x:11,y:20,px:0},{x:12,y:20,px:0},{x:13,y:20,px:1},{x:14,y:20,px:1},{x:15,y:20,px:2},{x:16,y:20,px:2},{x:17,y:20,px:2},{x:18,y:20,px:2},{x:19,y:20,px:0},{x:20,y:20,px:0},{x:21,y:20,px:11},{x:22,y:20,px:19},{x:23,y:20,px:27},{x:24,y:20,px:35},{x:25,y:20,px:43},{x:26,y:20,px:51},{x:27,y:20,px:59},{x:28,y:20,px:68},{x:29,y:20,px:76},{x:30,y:20,px:84},{x:31,y:20,px:92},{x:0,y:21,px:0},{x:1,y:21,px:0},{x:2,y:21,px:0},{x:3,y:21,px:0},{x:4,y:21,px:0},{x:5,y:21,px:0},{x:6,y:21,px:0},{x:7,y:21,px:0},{x:8,y:21,px:1},{x:9,y:21,px:1},{x:10,y:21,px:1},{x:11,y:21,px:0},{x:12,y:21,px:0},{x:13,y:21,px:0},{x:14,y:21,px:1},{x:15,y:21,px:1},{x:16,y:21,px:2},{x:17,y:21,px:2},{x:18,y:21,px:0},{x:19,y:21,px:0},{x:20,y:21,px:0},{x:21,y:21,px:3},{x:22,y:21,px:11},{x:23,y:21,px:19},{x:24,y:21,px:27},{x:25,y:21,px:35},{x:26,y:21,px:43},{x:27,y:21,px:51},{x:28,y:21,px:59},{x:29,y:21,px:68},{x:30,y:21,px:76},{x:31,y:21,px:84},{x:0,y:22,px:0},{x:1,y:22,px:0},{x:2,y:22,px:0},{x:3,y:22,px:0},{x:4,y:22,px:0},{x:5,y:22,px:0},{x:6,y:22,px:0},{x:7,y:22,px:0},{x:8,y:22,px:0},{x:9,y:22,px:0},{x:10,y:22,px:0},{x:11,y:22,px:0},{x:12,y:22,px:0},{x:13,y:22,px:0},{x:14,y:22,px:0},{x:15,y:22,px:0},{x:16,y:22,px:0},{x:17,y:22,px:0},{x:18,y:22,px:0},{x:19,y:22,px:0},{x:20,y:22,px:1},{x:21,y:22,px:1},{x:22,y:22,px:2},{x:23,y:22,px:10},{x:24,y:22,px:18},{x:25,y:22,px:26},{x:26,y:22,px:34},{x:27,y:22,px:42},{x:28,y:22,px:50},{x:29,y:22,px:59},{x:30,y:22,px:67},{x:31,y:22,px:75},{x:0,y:23,px:0},{x:1,y:23,px:0},{x:2,y:23,px:0},{x:3,y:23,px:0},{x:4,y:23,px:0},{x:5,y:23,px:0},{x:6,y:23,px:0},{x:7,y:23,px:0},{x:8,y:23,px:0},{x:9,y:23,px:0},{x:10,y:23,px:0},{x:11,y:23,px:0},{x:12,y:23,px:0},{x:13,y:23,px:0},{x:14,y:23,px:0},{x:15,y:23,px:0},{x:16,y:23,px:0},{x:17,y:23,px:0},{x:18,y:23,px:0},{x:19,y:23,px:1},{x:20,y:23,px:1},{x:21,y:23,px:1},{x:22,y:23,px:1},{x:23,y:23,px:2},{x:24,y:23,px:10},{x:25,y:23,px:18},{x:26,y:23,px:26},{x:27,y:23,px:34},{x:28,y:23,px:42},{x:29,y:23,px:50},{x:30,y:23,px:59},{x:31,y:23,px:67},{x:0,y:24,px:0},{x:1,y:24,px:0},{x:2,y:24,px:0},{x:3,y:24,px:0},{x:4,y:24,px:0},{x:5,y:24,px:0},{x:6,y:24,px:0},{x:7,y:24,px:0},{x:8,y:24,px:0},{x:9,y:24,px:0},{x:10,y:24,px:0},{x:11,y:24,px:0},{x:12,y:24,px:0},{x:13,y:24,px:0},{x:14,y:24,px:0},{x:15,y:24,px:1},{x:16,y:24,px:1},{x:17,y:24,px:1},{x:18,y:24,px:1},{x:19,y:24,px:1},{x:20,y:24,px:1},{x:21,y:24,px:1},{x:22,y:24,px:1},{x:23,y:24,px:1},{x:24,y:24,px:2},{x:25,y:24,px:10},{x:26,y:24,px:18},{x:27,y:24,px:26},{x:28,y:24,px:34},{x:29,y:24,px:42},{x:30,y:24,px:50},{x:31,y:24,px:59},{x:0,y:25,px:0},{x:1,y:25,px:0},{x:2,y:25,px:0},{x:3,y:25,px:0},{x:4,y:25,px:0},{x:5,y:25,px:0},{x:6,y:25,px:0},{x:7,y:25,px:0},{x:8,y:25,px:0},{x:9,y:25,px:0},{x:10,y:25,px:0},{x:11,y:25,px:0},{x:12,y:25,px:0},{x:13,y:25,px:0},{x:14,y:25,px:0},{x:15,y:25,px:0},{x:16,y:25,px:0},{x:17,y:25,px:0},{x:18,y:25,px:0},{x:19,y:25,px:0},{x:20,y:25,px:0},{x:21,y:25,px:0},{x:22,y:25,px:0},{x:23,y:25,px:0},{x:24,y:25,px:0},{x:25,y:25,px:1},{x:26,y:25,px:9},{x:27,y:25,px:17},{x:28,y:25,px:25},{x:29,y:25,px:33},{x:30,y:25,px:41},{x:31,y:25,px:50},{x:0,y:26,px:0},{x:1,y:26,px:0},{x:2,y:26,px:0},{x:3,y:26,px:0},{x:4,y:26,px:0},{x:5,y:26,px:0},{x:6,y:26,px:0},{x:7,y:26,px:0},{x:8,y:26,px:0},{x:9,y:26,px:0},{x:10,y:26,px:0},{x:11,y:26,px:0},{x:12,y:26,px:0},{x:13,y:26,px:0},{x:14,y:26,px:0},{x:15,y:26,px:0},{x:16,y:26,px:0},{x:17,y:26,px:0},{x:18,y:26,px:0},{x:19,y:26,px:0},{x:20,y:26,px:0},{x:21,y:26,px:0},{x:22,y:26,px:0},{x:23,y:26,px:0},{x:24,y:26,px:0},{x:25,y:26,px:0},{x:26,y:26,px:1},{x:27,y:26,px:9},{x:28,y:26,px:17},{x:29,y:26,px:25},{x:30,y:26,px:33},{x:31,y:26,px:41},{x:0,y:27,px:0},{x:1,y:27,px:0},{x:2,y:27,px:0},{x:3,y:27,px:0},{x:4,y:27,px:0},{x:5,y:27,px:0},{x:6,y:27,px:0},{x:7,y:27,px:0},{x:8,y:27,px:0},{x:9,y:27,px:0},{x:10,y:27,px:0},{x:11,y:27,px:0},{x:12,y:27,px:0},{x:13,y:27,px:0},{x:14,y:27,px:0},{x:15,y:27,px:0},{x:16,y:27,px:0},{x:17,y:27,px:0},{x:18,y:27,px:0},{x:19,y:27,px:0},{x:20,y:27,px:0},{x:21,y:27,px:0},{x:22,y:27,px:0},{x:23,y:27,px:0},{x:24,y:27,px:0},{x:25,y:27,px:0},{x:26,y:27,px:0},{x:27,y:27,px:1},{x:28,y:27,px:9},{x:29,y:27,px:17},{x:30,y:27,px:25},{x:31,y:27,px:33},{x:0,y:28,px:0},{x:1,y:28,px:0},{x:2,y:28,px:0},{x:3,y:28,px:0},{x:4,y:28,px:0},{x:5,y:28,px:0},{x:6,y:28,px:0},{x:7,y:28,px:0},{x:8,y:28,px:0},{x:9,y:28,px:0},{x:10,y:28,px:0},{x:11,y:28,px:0},{x:12,y:28,px:0},{x:13,y:28,px:0},{x:14,y:28,px:0},{x:15,y:28,px:0},{x:16,y:28,px:0},{x:17,y:28,px:0},{x:18,y:28,px:0},{x:19,y:28,px:0},{x:20,y:28,px:0},{x:21,y:28,px:0},{x:22,y:28,px:0},{x:23,y:28,px:0},{x:24,y:28,px:0},{x:25,y:28,px:0},{x:26,y:28,px:0},{x:27,y:28,px:0},{x:28,y:28,px:1},{x:29,y:28,px:9},{x:30,y:28,px:17},{x:31,y:28,px:25},{x:0,y:29,px:0},{x:1,y:29,px:0},{x:2,y:29,px:0},{x:3,y:29,px:0},{x:4,y:29,px:0},{x:5,y:29,px:0},{x:6,y:29,px:0},{x:7,y:29,px:0},{x:8,y:29,px:0},{x:9,y:29,px:0},{x:10,y:29,px:0},{x:11,y:29,px:0},{x:12,y:29,px:0},{x:13,y:29,px:0},{x:14,y:29,px:0},{x:15,y:29,px:0},{x:16,y:29,px:0},{x:17,y:29,px:0},{x:18,y:29,px:0},{x:19,y:29,px:0},{x:20,y:29,px:0},{x:21,y:29,px:0},{x:22,y:29,px:0},{x:23,y:29,px:0},{x:24,y:29,px:0},{x:25,y:29,px:0},{x:26,y:29,px:0},{x:27,y:29,px:0},{x:28,y:29,px:0},{x:29,y:29,px:0},{x:30,y:29,px:8},{x:31,y:29,px:16},{x:0,y:30,px:0},{x:1,y:30,px:0},{x:2,y:30,px:0},{x:3,y:30,px:0},{x:4,y:30,px:0},{x:5,y:30,px:0},{x:6,y:30,px:0},{x:7,y:30,px:0},{x:8,y:30,px:0},{x:9,y:30,px:0},{x:10,y:30,px:0},{x:11,y:30,px:0},{x:12,y:30,px:0},{x:13,y:30,px:0},{x:14,y:30,px:0},{x:15,y:30,px:0},{x:16,y:30,px:0},{x:17,y:30,px:0},{x:18,y:30,px:0},{x:19,y:30,px:0},{x:20,y:30,px:0},{x:21,y:30,px:0},{x:22,y:30,px:0},{x:23,y:30,px:0},{x:24,y:30,px:0},{x:25,y:30,px:0},{x:26,y:30,px:0},{x:27,y:30,px:0},{x:28,y:30,px:0},{x:29,y:30,px:0},{x:30,y:30,px:0},{x:31,y:30,px:8},{x:0,y:31,px:0},{x:1,y:31,px:0},{x:2,y:31,px:0},{x:3,y:31,px:0},{x:4,y:31,px:0},{x:5,y:31,px:0},{x:6,y:31,px:0},{x:7,y:31,px:0},{x:8,y:31,px:0},{x:9,y:31,px:0},{x:10,y:31,px:0},{x:11,y:31,px:0},{x:12,y:31,px:0},{x:13,y:31,px:0},{x:14,y:31,px:0},{x:15,y:31,px:0},{x:16,y:31,px:0},{x:17,y:31,px:0},{x:18,y:31,px:0},{x:19,y:31,px:0},{x:20,y:31,px:0},{x:21,y:31,px:0},{x:22,y:31,px:0},{x:23,y:31,px:0},{x:24,y:31,px:0},{x:25,y:31,px:0},{x:26,y:31,px:0},{x:27,y:31,px:0},{x:28,y:31,px:0},{x:29,y:31,px:0},{x:30,y:31,px:0},{x:31,y:31,px:0}];
							var index = 0;
							
							png.iterate_pixels(function(x, y, px) {
								//console.log('x ' + x + ', y ' + y + ', px ' + px);
								assert.equal(x, estimated[index].x);
								assert.equal(y, estimated[index].y);
								assert.equal(px, estimated[index].px);
								index++;
							});
							assert.equal(index, estimated.length);
							
							done();
						}
						
					})
				}
				test_load_png_iterate();
				
				// want to execute the same test on a bunch of items.
				
			
			});
			
			
			// -----------------------------------------------------
			//	test_load_dice_png_to_rgba_buffer_save_as_png
			// -----------------------------------------------------
				
			it("test_load_dice_png_to_rgba_buffer_save_as_png", function(done) {

				var load_png_to_rgba_buffer_save_as_png = function(source_path, dest_path, dest_estimated_path, callback) {
					
					process.chdir(__dirname);
					jsgui_png.load_pixel_buffer_from_disk(source_path, function(err, pix_buf) {
						if (err) {
							throw err;
						} else {
							//console.log('loaded rgba pixel buffer');
							//console.log('buffer resolution: ' + stringify(pix_buf.size));
							assert.equal(stringify(pix_buf.size), '[935, 453]');
							
							//jsgui_png.save_rgba_pixel_buffer_to_disk(pix_buf, dest_path, function(err, res) {
							jsgui_png.save_pixel_buffer_to_disk(pix_buf, dest_path, function(err, res) {
								//console.log('save callback');
								if (err) {
									throw err;
								}else{
									test_utils.assertFilesEqual(dest_path, dest_estimated_path);
								}
								
								callback(null, true);
							});
						}
					
					});
					
				}
				
				var test_load_dice_png_to_rgba_buffer_save_as_png = function() {
					
					//var source_path = './source/pngsuite/f00n2c08.png';
					//var dest_path = './res/f00n2c08.png';
					
					//load_png_to_rgba_buffer_save_as_png(source_path, dest_path);
					
					var fns = [];
					
					
					//fns.push([load_png_to_rgba_buffer_save_as_png, ['./source/dice.png', './res/dice.png']]);
					fns.push([load_png_to_rgba_buffer_save_as_png, ['./source/dice.png', './res/dice.png', './res_estimated/dice.png']]);
					
					//console.log('pre call multi');
					
					call_multi(fns, function(err, res_multi) {
						done();
					});
				}
				test_load_dice_png_to_rgba_buffer_save_as_png();
			
			});
			
			
			// -----------------------------------------------------
			//	test_bleach_function
			// -----------------------------------------------------
				
			it("test_bleach_function", function(done) {
			
				// want to iterate through, setting the value of each pixel.
				//  will do some kind of bleach effect.

				// Could maybe try with bigger images?
				//  Smaller
				// Want to get a nice little library made involving C and C++.
				//  Could give that system a convolution for it to do.
				//   This could be very FAST.

				var test_bleach_function = function() {
					process.chdir(__dirname);
					jsgui_png.load_pixel_buffer_from_disk('./source/dice.png', function(err, pix_buf) {
						if (err) {
							throw err;
						} else {
							//console.log('loaded rgba pixel buffer');
							//console.log('buffer resolution: ' + stringify(pix_buf.size));
							assert.equal(stringify(pix_buf.size), '[935, 453]');
							
							// Don't iterate the pixels with this??

							// Or do?

							// But have some bleaching written in JS to start with at least.

							// Want to try the bleaching algorithm in C++ / C as well.
							//  In C, having a function call per pixel may be OK...
							//   but having loops is likely to be faster.
							//   Function call per pixel may be how OpenCL works.

							var w = pix_buf.size[0], h = pix_buf.size[1], l = w * h;
							var buffer = pix_buf.buffer, r, g, b, a, i;
							for (var c = 0; c < l; c++) {
								// read the four values.
								i = c * 4;
								r = buffer.readUInt8(i);
								g = buffer.readUInt8(i + 1);
								b = buffer.readUInt8(i + 2);
								a = buffer.readUInt8(i + 3);

								// then change the values...
								r = 255 - Math.round((255 - r) / 2);
								g = 255 - Math.round((255 - g) / 2);
								b = 255 - Math.round((255 - b) / 2);
								//a = a;

								buffer.writeUInt8(r, i);
								buffer.writeUInt8(g, i + 1);
								buffer.writeUInt8(b, i + 2);

							}


							process.chdir(__dirname);
							jsgui_png.save_pixel_buffer_to_disk(pix_buf, './res/bleached-dice.png', function(err, res) {
								//console.log('cb save');
								if (err) {
									throw err;
								}else{
									test_utils.assertFilesEqual('./res/bleached-dice.png', './res_estimated/bleached-dice.png');
									done();
								}
								
								//callback(null, true);
							});

							// want to deal with the buffer itself.

							/*
							jsgui_png.save_rgba_pixel_buffer_to_disk(pix_buf, dest_path, function(err, res) {
								//console.log('save callback');
								if (err) {
									throw err;
								}
								
								callback(null, true);
							});
							*/


						}
					
					});
				}
				test_bleach_function();

			});
			
			
			// -----------------------------------------------------
			//	xxxxxx
			// -----------------------------------------------------
				
			it("xxxxxx", function(done) {

				var test_bleach_c_function = function() {
					process.chdir(__dirname);
					jsgui_png.load_pixel_buffer_from_disk('./source/dice.png', function(err, pix_buf) {
						if (err) {
							throw err;
						} else {
							//console.log('loaded rgba pixel buffer');
							//console.log('buffer resolution: ' + stringify(pix_buf.size));
							assert.equal(stringify(pix_buf.size), '[935, 453]');
							
							// Don't iterate the pixels with this??
							// Or do?

							// But have some bleaching written in JS to start with at least.

							// Want to try the bleaching algorithm in C++ / C as well.
							//  In C, having a function call per pixel may be OK...
							//   but having loops is likely to be faster.
							//   Function call per pixel may be how OpenCL works.
							var w = pix_buf.size[0], h = pix_buf.size[1], l = w * h;
							var buffer = pix_buf.buffer, r, g, b, a, i;

							buffer_cpp.rgba_buffer_self_simple_fade(buffer, w, h);

							process.chdir(__dirname);
							jsgui_png.save_pixel_buffer_to_disk(pix_buf, './res/bleached-dice-cpp.png', function(err, res) {
								//console.log('cb save');
								if (err) {
									throw err;
								}else{
									test_utils.assertFilesEqual('./res/bleached-dice-cpp.png', './res_estimated/bleached-dice.png');
									done();
								}
								
								//callback(null, true);
							});
						}
					
					});
				}
				test_bleach_c_function();
			
			});
			
			// -----------------------------------------------------
			//	test_buffer_copy_c
			// -----------------------------------------------------
				
			it("test_buffer_copy_c", function(done) {
			
				var test_buffer_copy_c = function() {
					process.chdir(__dirname);
					jsgui_png.load_pixel_buffer_from_disk('./source/dice.png', function(err, pix_buf) {
						if (err) {
							throw err;
						} else {
							//console.log('loaded rgba pixel buffer');
							//console.log('buffer resolution: ' + stringify(pix_buf.size));
							assert.equal(stringify(pix_buf.size), '[935, 453]');
							
							// Don't iterate the pixels with this??
							// Or do?

							// But have some bleaching written in JS to start with at least.

							// Want to try the bleaching algorithm in C++ / C as well.
							//  In C, having a function call per pixel may be OK...
							//   but having loops is likely to be faster.
							//   Function call per pixel may be how OpenCL works.
						   // var w = pix_buf.size[0], h = pix_buf.size[1], l = w * h;
							var buffer = pix_buf.buffer, r, g, b, a, i;
							//console.log('buffer.length ' + buffer.length);
							var buffer2 = buffer_cpp.buffer_copy(buffer);
							//console.log('buffer2.length ' + buffer2.length);
							pix_buf.buffer = buffer2;
							
							process.chdir(__dirname);
							jsgui_png.save_pixel_buffer_to_disk(pix_buf, './res/copied-dice.png', function(err, res) {
								//console.log('cb save');
								if (err) {
									throw err;
								}else{
									test_utils.assertFilesEqual('./res/copied-dice.png', './res_estimated/dice.png');
									done();
								}
								
								//callback(null, true);
							});
							
						}
					
					});
				}
				test_buffer_copy_c();

				// want to test convolutions.
				//  This is something for rgba buffers that could be implemented as a buffer-process module, both
				//  in JavaScript and also in C.

				// Could try a hard-coded convolution?
				//  Also want to do image compression / encoding.
				//   Changing from png to rgba?

				// Could also do convolution in JavaScript, but call C functions for matrix maths.
				//  Not sure about the various matrices in JavaScript though - they may be 1d.
				//   We could put data into 1d buffers, and have a width variable.
				//    (idea) put them into buffers, then we work out what the possible dimensions are through
				//     factorization. Then we have an int that says which in the sequence of possible
				//     widths it is.

				// Buffers with width properties
				// =============================

				// Had height there but I don't think we need it much of the time.
		
			});
			
			
		});
	
        
    }
);
