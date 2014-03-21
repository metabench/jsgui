if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['module', 'path', '../../core/jsgui-lang-essentials', 'fs', '../../fs/jsgui-node-fs2-core', 'assert', '../test-utils/test-utils'], 
    function(module, path, jsgui, fs, fs2, assert, test_utils) {
        var stringify = jsgui.stringify, call_multi = jsgui.call_multi;
        //var source_file = './source/pliers2.png';
        var source_file = './source/f00n2c08.png';
        
        //var filename = module.uri;
        var filename = module.filename;
        //console.log('filename ' + filename);

        var dirname = path.dirname(filename);
        //console.log('dirname ' + dirname);

        var log = console.log;

        // f00n2c08
        // load up a PNG file.
        //  then iterate through its pixels.
        
        // tests could have callbacks for a test runner.
        //  can also compare to expected results where possible.
        //  maybe verify / validate disk writes, could use checksum.	
	
		// =======================================================
		//				tests:
		// =======================================================

		describe("jsgui-node-fs2-core/test-node-fs2-core.spec.js", function() {

			beforeEach(function(){
				process.chdir(__dirname);  
			});
		
			// -----------------------------------------------------
			//	  test_load_2_files
			// -----------------------------------------------------
			
			it("test_load_2_files", function(done) {        
			
				//==process.chdir(__dirname);
				fs2.load_file_as_string(['./source/text_file_1.txt', './source/text_file_2.txt'], function(err, res_load_files) {
					if (err) {
						throw err;
					} else {
						//console.log('res_load_files ' + stringify(res_load_files));
						assert.equal(stringify(res_load_files), '{"./source/text_file_1.txt": "Content: text_file1.txt", "./source/text_file_2.txt": "Content: text_file2.txt"}');
						done();
					}
				});			
			
			});
			
			// -----------------------------------------------------
			//	  test_save_2_files
			// -----------------------------------------------------
			
			it("test_save_2_files", function(done) {      

				//==process.chdir(__dirname);
				fs2.save_file_as_string({'./res/text_file_3.txt': 'text3', './res/text_file_4.txt': 'text4'}, function(err, res_save_files) {
					if (err) {
						throw err;
					} else {
						//console.log('res_save_files ' + stringify(res_save_files));
						assert.equal(stringify(res_save_files), '[true, true]');
						//						
						//==process.chdir(__dirname);
						fs2.load_file_as_string(['./res/text_file_3.txt', './res/text_file_4.txt'], function(err, res_load_files) {
							if (err) {
								throw err;
							} else {
								//console.log('res_load_files ' + stringify(res_load_files));
								assert.equal(stringify(res_load_files), '{"./res/text_file_3.txt": "text3", "./res/text_file_4.txt": "text4"}');
								done();
							}
						});									
						//
					}
				});
			
			});
			
			// -----------------------------------------------------
			//	  test_load_dir_names
			// -----------------------------------------------------
			
			it("test_load_dir_names", function(done) {   

				var expected_contents = ["dir1", "dir3", "dir2", "_dir1"];
			
				//==process.chdir(__dirname);
				fs2.dir_contents('./source', {'files_or_directories': 'directories'}, function(err, res_contents) {
					if (err) {
						throw err;
					} else {
						//console.log('res_contents ' + stringify(res_contents));
						//assert.ok(arraysAreSame(res_contents, expected_contents));
						test_utils.assertArraysContentEqual(res_contents, expected_contents);
						done();
					}
				})
			
			});
			
			// -----------------------------------------------------
			//	  test_load_filtered_dir_names
			// -----------------------------------------------------
			
			it("test_load_filtered_dir_names", function(done) {        
			
				var expected_contents = ["dir1", "dir3", "dir2"];
				
				//==process.chdir(__dirname);
				fs2.dir_contents('./source', {'files_or_directories': 'directories', 'filter': {
					'regex': /^(?!_).+/
				}}, function(err, res_contents) {
					if (err) {
						throw err;
					} else {
						//console.log('res_contents ' + stringify(res_contents));
						//assert.ok(arraysAreSame(res_contents, expected_contents));
						test_utils.assertArraysContentEqual(res_contents, expected_contents);
						done();
					}
				})
			
			});
			
			// -----------------------------------------------------
			//	  test_load_dir_txt_file_contents_with_metadata
			// -----------------------------------------------------
			
			it("test_load_dir_txt_file_contents_with_metadata", function(done) { 
			
				var expected_contents = [
					{"name": "test1.txt", "metadata": ["test1.txt", {"size": 12, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "dir_1_text_1"}, 
					{"name": "test2.txt", "metadata": ["test2.txt", {"size": 12, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "dir_1_text_2"}, 
					{"name": "test3.txt", "metadata": ["test3.txt", {"size": 12, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "dir_1_text_3"}
				];
					
				// res_fs_paths - could be an option.
				// include_fs_paths - could return an object with .name and .path.
				//==process.chdir(__dirname);
				fs2.dir_contents('./source/dir1', {'res_format': 'map', 'include_metadata': true, 'include_file_contents': true,
				'files_or_directories': 'files', 'filter': {'extension': '.txt'}}, function(err, res_contents) {
					if (err) {
						throw err;
					} else {
						//console.log('res_contents ' + stringify(res_contents));
						//
						test_utils.assertArraysContentEqual(res_contents, expected_contents,
							function(obj1, obj2){ 
								return (obj1.name == obj2.name); 
							}
						);
						
						/*
						var ok = arraysAreSame(res_contents, expected_contents,
							function(obj1, obj2){ 
								return (obj1.name == obj2.name); 
							},
							function(obj1, obj2){ 
								if (obj1.name !== obj2.name) return false;
								//								
								if (obj1.metadata[0] !== obj2.metadata[0]) return false;
								if (obj1.metadata[1].size !== obj2.metadata[1].size) return false;
								
								//if (!objectsAreSame(obj1.metadata[1].atime, obj2.metadata[1].atime)) return false;
								//if (!objectsAreSame(obj1.metadata[1].mtime, obj2.metadata[1].mtime)) return false;
								//if (!objectsAreSame(obj1.metadata[1].ctime, obj2.metadata[1].ctime)) return false;
								if (!objectsAreSame(obj1.metadata[1].atime, obj2.metadata[1].atime)) return false;
								if (!objectsAreSame(obj1.metadata[1].mtime, obj2.metadata[1].mtime)) return false;
								if (!objectsAreSame(obj1.metadata[1].ctime, obj2.metadata[1].ctime)) return false;
								
								
								if (obj1.metadata[1].isDirectory !== obj2.metadata[1].isDirectory) return false;
								//
								if (obj1.contents !== obj2.contents) return false;
								//
								return true;
							}
						);
						//
						assert.ok(ok);*/
						//
						done();
					}
				}) 
						
			});
				
			// res_item_format = map?
			
			// -----------------------------------------------------
			//	  test_load_dir_txt_files_list
			// -----------------------------------------------------

			it("test_load_dir_txt_files_list", function(done) { 
			
				var expected_contents = ["test1.txt", "test2.txt", "test3.txt"];
					
				//==process.chdir(__dirname);
				fs2.dir_contents('./source/dir1', {'res_format': 'map',
				'files_or_directories': 'files', 'filter': {'extension': '.txt'}}, function(err, res_contents) {
					if (err) {
						throw err;
					} else {
						//console.log('res_contents ' + stringify(res_contents));
						//expect(arraysAreSame(res_contents, expected_contents)).toBe(true);
						test_utils.assertArraysContentEqual(res_contents, expected_contents);
						done();
					}
				}) 
						
			});
			
			// -----------------------------------------------------
			//	  test_load_dir_txt_files_list_fs_paths
			// -----------------------------------------------------

			it("test_load_dir_txt_files_list_fs_paths", function(done) { 
			
				var expected_contents = ["./source/dir1\\test1.txt", "./source/dir1\\test2.txt", "./source/dir1\\test3.txt"];
			
				//==process.chdir(__dirname);
				fs2.dir_contents('./source/dir1', {'res_format': 'map', 'fs_paths': true,
				'files_or_directories': 'files', 'filter': {'extension': '.txt'}}, function(err, res_contents) {
					if (err) {
						throw err;
					} else {
						//console.log('res_contents ' + stringify(res_contents));
						//expect(arraysAreSame(res_contents, expected_contents)).toBe(true);
						test_utils.assertArraysContentEqual(res_contents, expected_contents);
						done();
					}
				}) 
						
			});
			
			// -----------------------------------------------------
			//	test_load_filtered_txt_files_from_multiple_dirs
			// -----------------------------------------------------

			it("test_load_filtered_txt_files_from_multiple_dirs", function(done) {    

				// not beginning with '_'
				
				// load the dir paths.
			
				var expected_contents = ["./source\\dir1", "./source\\dir3", "./source\\dir2", "./source\\_dir1"];
				
				var expected_active_txt_files = [
					{"name": "test2.txt", "metadata": ["test2.txt", {"size": 12, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "dir_1_text_2", "path": "./source\\dir1\\test2.txt"}, 
					{"name": "test1.txt", "metadata": ["test1.txt", {"size": 12, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "dir_1_text_1", "path": "./source\\dir1\\test1.txt"}, 
					{"name": "test3.txt", "metadata": ["test3.txt", {"size": 12, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "dir_1_text_3", "path": "./source\\dir1\\test3.txt"}, 
					{"name": "test7.txt", "metadata": ["test7.txt", {"size": 12, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "dir_3_text_7", "path": "./source\\dir3\\test7.txt"}, 
					{"name": "test8.txt", "metadata": ["test8.txt", {"size": 12, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "dir_3_text_8", "path": "./source\\dir3\\test8.txt"}, 
					{"name": "test9.txt", "metadata": ["test9.txt", {"size": 12, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "dir_3_text_9", "path": "./source\\dir3\\test9.txt"}, 
					{"name": "test4.txt", "metadata": ["test4.txt", {"size": 12, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "dir_2_text_4", "path": "./source\\dir2\\test4.txt"}, 
					{"name": "test5.txt", "metadata": ["test5.txt", {"size": 12, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "dir_2_text_5", "path": "./source\\dir2\\test5.txt"}, 
					{"name": "test6.txt", "metadata": ["test6.txt", {"size": 12, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "dir_2_text_6", "path": "./source\\dir2\\test6.txt"}, 
					{"name": "test1.txt", "metadata": ["test1.txt", {"size": 13, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "_dir_1_text_1", "path": "./source\\_dir1\\test1.txt"}, 
					{"name": "test2.txt", "metadata": ["test2.txt", {"size": 13, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "_dir_1_text_2", "path": "./source\\_dir1\\test2.txt"}, 
					{"name": "test3.txt", "metadata": ["test3.txt", {"size": 13, "atime": {}, "mtime": {}, "ctime": {}, "isDirectory": false}], "contents": "_dir_1_text_3", "path": "./source\\_dir1\\test3.txt"}
				];
				
				//==process.chdir(__dirname);
				fs2.dir_contents('./source', {'files_or_directories': 'directories', 'fs_paths': true}, function(err, res_contents) {
					if (err) {
						throw err;
					} else {
						//console.log('res_contents ' + stringify(res_contents));
						//expect(arraysAreSame(res_contents, expected_contents)).toBe(true); // ArraysContentEqual(res_contents, expected_contents);
						test_utils.assertArraysContentEqual(res_contents, expected_contents);
						// then for each of them we load the file with metadata.
						// we wnat to combine the results from the arrays...
						
						// so when the arrayify is used, it would be good to get back a joined array.
						
						//==process.chdir(__dirname);
						fs2.dir_contents(res_contents, {'res_format': 'map', 'files_or_directories': 'files', 'fs_paths': true,
						'include_metadata': true, 'include_file_contents': true,
						'filter': {'extension': '.txt', 'regex': /^(?!_).+/}}, function(err, res_active_txt_files) {
							if (err) throw err;
							//console.log('res_active_txt_files ' + stringify(res_active_txt_files));
							
							test_utils.assertArraysContentEqual(res_active_txt_files, expected_active_txt_files,
								function(obj1, obj2){ 
									return (obj1.path == obj2.path); 
								}
							);
							
							/*var ok = arraysAreSame(res_active_txt_files, expected_active_txt_files,
								function(obj1, obj2){ 
									return (obj1.path == obj2.path); 
								},
								function(obj1, obj2){ 
									if (obj1.name !== obj2.name) return false;
									//
									if (obj1.metadata[0] !== obj2.metadata[0]) return false;
									if (obj1.metadata[1].size !== obj2.metadata[1].size) return false;
									if (!objectsAreSame(obj1.metadata[1].atime, obj2.metadata[1].atime)) return false;
									if (!objectsAreSame(obj1.metadata[1].mtime, obj2.metadata[1].mtime)) return false;
									if (!objectsAreSame(obj1.metadata[1].ctime, obj2.metadata[1].ctime)) return false;
									if (obj1.metadata[1].isDirectory !== obj2.metadata[1].isDirectory) return false;
									//
									if (obj1.contents !== obj2.contents) return false;
									if (obj1.path !== obj2.path) return false;
									//
									return true;
								}
							);
							//
							expect(ok).toBe(true);*/
							//
							done();
						});
						
					}
				})
			
			});
			
			
			// -----------------------------------------------------
			//					test_walk
			// -----------------------------------------------------
					
			it("test_walk", function(done) {
			
				var expected = [
					{ dirPath: "./source", files: ["text_file_1.txt", "text_file_2.txt"], directories: ["dir1", "dir2", "dir3", "_dir1"] },
					{ dirPath: "./source/dir1", files: ["test1.txt", "test3.txt", "test2.txt"] },
					{ dirPath: "./source/dir2", files: ["test4.txt", "test6.txt", "test5.txt", "_test6 copy 2.txt", "_test6 copy.txt"] },
					{ dirPath: "./source/dir3", files: ["test7.txt", "test9.txt", "test8.txt"] },
					{ dirPath: "./source/_dir1", files: ["test1.txt", "test2.txt", "test3.txt"] },
				];
			
				function checkItem(dirPath, dirContents){
					//
					function find(dirPath){
						for(var i = 0, l = expected.length; i < l; i++){
							if (expected[i].dirPath === dirPath) return expected[i];
						}
						return null;
					}
					//
					var expectedItem = find(dirPath);
					assert.ok(expectedItem !== null);
					//
					if (expectedItem !== null){
						expectedItem.processed = true;
						//
						test_utils.assertArraysContentEqual(dirContents.files, expectedItem.files);
						test_utils.assertArraysContentEqual(dirContents.directories, expectedItem.directories);
					}
				}

				function checkAllProcessed(){
					for(var i = 0, l = expected.length; i < l; i++){
						assert.ok(expected[i].processed);
					}
				}
			
				// the test itself:
			
				// Walk from the current directory path.
				//==process.chdir(__dirname);
				fs2.walk('./source', function(dirPath, dirContents) {
					// Callback for when a directory has been read.
					checkItem(dirPath, dirContents);
					
				}, function(err, complete) {
					if (err) {
						throw err;
					} else {
						checkAllProcessed();
						done();
					}
				});
				
			});
			
			
		});
	
           
	}
);
