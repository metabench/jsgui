
//['jsgui-lang-essentials', 'node-rasters']

define(['../core/jsgui-lang-essentials', '../image/node-rasters', '../image/node-sprite',
	'xpath', '../web/jsgui-html', 'phantom', 'libxmljs', 'xmldom', 
	'ncp', 'imagemagick'], 
	function (jsgui, node_rasters, node_sprite, xpath, jsgui_html, 
		phantom, libxmljs, xmldom, ncp, im) {
//define(['jsgui-lang-essentials', 'node-rasters', 'node-spritesheet', 'xpath', 'jsgui-html', 'phantom', 'xmldom', 'ncp'], function (jsgui, node_rasters, node_spritesheet, xpath, jsgui_html, phantom, xmldom, ncp) {

	// removing libxmljs?
	
	
	var each = jsgui.each;
	var is_defined = jsgui.is_defined;
	var tof = jsgui.tof;
	
	var dir_separator = '/';
	if (process.platform === 'win32') dir_separator = '\\';
	
	var fs = require('fs');
	var path = require('path');
	var npath = require('path');
	//var im = require('imagemagick');
	//var libxmljs = require("libxmljs");
	ncp = ncp.ncp;

	var Control = jsgui_html.Control;

	var PNG = require('pngjs').PNG;
	var zlib = require('zlib');
	//var xmldom = require('xmldom');
	//var xpath = require('xpath');

	//var fluent_Metalib = require('fluent-ffmpeg').Metadata;
	//var ffmpeg = require('fluent-ffmpeg');

	var exec = require('child_process').exec;
	var fp = jsgui.fp;
	var call_multiple_callback_functions = jsgui.call_multiple_callback_functions;	
	
	var recursive_xml_traversal = function(xml, el_callback) {
		if (xml.root) {
			var root = xml.root();
			recursive_xml_traversal(root, el_callback);
		} else {
			if (xml.attrs) {
				el_callback(xml);
				var cns = xml.childNodes();
				each(cns, function(i, v) {
					recursive_xml_traversal(v, el_callback);
				});
			}
		}
	};
	
	var map_extension_mime_types = {
		'html': 'text/html',
		'htm': 'text/html',
		
		'ico': 'image/x-icon',
		'txt': 'text/plain',
		'xml': 'application/xml',
		
		'png': 'image/png',
		'gif': 'image/gif',
		'jpeg': 'image/jpeg',
		'jpg': 'image/jpeg',
		'bmp': 'image/bmp',
		
		'svg': 'image/svg+xml',
		
		'mp3': 'audio/mpeg3',
		'ogg': 'audio/ogg',
	}

	var sequential_execute_fs_child_processes = function(arr_fs_process_commands, callback) {
		
		// not sure about doing the unused simultaneous method of multithreading.
		
		// may do that version later.
		
		var l = arr_fs_process_commands.length;
		var c = 0;
		
		var process = function() {
			var command = arr_fs_process_commands[c];
			c++;
			
			console.log('pre exec command ' + command);
			exec(command, function(error, stdout, stderr) {
				if (error) {
					throw(error);
				} else {
					if (c < l) {
						process();
					} else {
						callback(null);
					}
					
				}
			})
			
		}
		
		if (c < l) process();
		
	}

	// function to call functions sequentially?
	//  something with a nice flexible interface, gets given an array of the function calls.

	// makes a functional callable sequentially
	// fseq?
	var sequential_call = function(fn) {
		// fn(data, callback) - callback with (err, res)
		var res = function(arr_input, callback) {
			// callback for when all are complete.
			var num_simultaneous = 4;
			var unused_simultaneous = num_simultaneous;
			var l = arr_input.length;
			var left = l;
			var c = 0;
			var res = [];
			var mini_cb = function(err, mini_res) {
				if (err) {
					console.log('err ' + err);
					throw(err);
				} else {
					//console.log('mini_cb');
					res.push(mini_res);
					unused_simultaneous++;
					left--;
					//console.log('* c ' + c);
					if (unused_simultaneous > 0 && left > 0 && c < l) {
						//console.log('should start new call');
						
						var item = arr_input[c];
						fn(item, mini_cb);
						c++;
						unused_simultaneous--;
					} else {
						// the number complete...
						//console.log('may be complete');
						//console.log('unused_simultaneous ' + unused_simultaneous);
						//console.log('left ' + left);
						//console.log('c ' + c);
						if (unused_simultaneous == num_simultaneous) {
							callback(null, res);
						}
					}
				}
			}
			
			while (unused_simultaneous > 0 && left > 0 && c < l) {
				var item = arr_input[c];
				// want the function to return it's original parameter along with the result.
				//  makes bunches of results easier to keep track of. - but it's not a normal return value anyway, it's from a callback.
				fn(item, mini_cb);
				c++;
				unused_simultaneous--;
			}
		};
		return res;
	};
	/*
	function mp3_to_ogg(filename){
	    var proc = new ffmpeg({ source: 'tracks/mp3/' + filename, priority: 10, timeout: 10*60 })
	              .withAudioCodec('libvorbis')
	              .toFormat('ogg')
	              .saveToFile( 'tracks/test/' + filename.slice(0,-4) + '.ogg' , function(retcode, error) {
	              
	              });
	}
	*/
	var specific_metadata = {
		'image/png': function(source_path, callback) {
			
			// I will have my own code to look inside a PNG file.
			// will replace this with my own metadata reading function that opens the file and uses buffers.
			console.log('specific metadata ' + path);
			var use_imagemagick_directly = function() {
				exec('identify "' + source_path + '"', function(err, stdout) {
					if (err) {
						throw(err);
					} else {
						//console.log('stdout ' + stdout);
						// now use regex to get the fileinfo.
						
						// the bit depth is also in the 
						
						var rx_identify_md = /(\w+) (\d+)x(\d+) \d+x\d+\+\d+\+\d+ (\d+)-bit/
						var match = stdout.toString().match(rx_identify_md);
						console.log('path ' + path);
						console.log('match ' + stringify(match));
						var format = match[1];
						var width = parseInt(match[2]);
						var height = parseInt(match[3]);
						// don't want the file size from this, get that more accurately anyway.
						
						var bit_depth = parseInt(match[4]);
						
						var res = {
							'format': format,
							'width': width,
							'height': height,
							'bit_depth': bit_depth
						}
						callback(null, res);
					}
				})
			}
			//use_imagemagick_directly();
			
			// Reading the PNG directly is more certain to work, requires less to be installed.
			//  Want to have JavaScript functions to do quite a lot of things.
			//  Will be faster to get running on various systems.
			//  Should perform reasonably well, but we'll see quite how well some algorithms run.
			
			// Could have options like including the palette in the colors.
			
			var open_png_directly = function() {
				// will open the file stream...
				//  maybe there will be an fs2 function to get a png metadata chunk from the file?
				console.log('');
				
				console.log('read png directly source_path ' + source_path);
				
				var found_metadata = function(obj_metadata) {
					// and can we close the read buffer?
				
					callback(null, obj_metadata);
				}
				
				fs.stat(source_path, function(err, stats) {
					if (err) {
						
					} else {
						var size = stats.size;
						
						console.log('size ' + size);
						
						// General PNG reading code.
						//  Perhaps I will have an event driven PNG reader, so that it calls a function when it
						//  has read more pixels from the PNG.
						
						// Being able to give or pipe it a buffer would be useful.
						//   Also, would be useful to only read the first part of the PNG rather than the whole thing.
						
						
						
						
						var png_input_buffer = new Buffer(size);
						
						// This could also be done in such a way that the whole file is not read.
						
						// Could make a version that is more careful to only read chunks out of the file.
						//  Some kind of file buffer?
						// 
						
						// Using fs.read may be better.
						
						
						fs.open(source_path, 'r', function(err, fd) {
							if (err) {
								
							} else {
								
								// want to keep reading chunks.
								//  thinking about having this read more normal sized blocks from the disk.
								//   and then the system analyses the chunks.
								
								// This one can get the palette information efficiently.
								//  Other tools can do other reading and interpretation of blocks.
								
								// If the file is quite big we don't want to read too much... but reading up to 8KB should be OK I think.
								
								// And that 8KB can be processed to look for the palette.
								
								// May want something that processes a PNG pipe.
								
								// We can do this from a file stream.
								
								/* Let's try reading a stream from the disk */
								/*
								 * readStream.on('data', function(textData) {
									  console.log("Found some text!");
									  writeStream.write(textData);
									});
									
									// the reading is finished...
									readStream.on('close', function () {
									  writeStream.end(); // ...close up the write, too!
									  console.log("I finished.");
									});
								 * 
								 */
								
								
								// see http://nodejs.org/api/stream.html
								var src = fs.createReadStream(source_path);
								
								// but we may want to close the stream after getting the metadata.
								//  that would make for a very fast metadata getter.
								
								
								var png_buffer = new Buffer(size);
								var png_pos = 0;
								
								// storing the previous data buffer as well...
								var data_num = 0;
								var chunk_positions_in_full_data = [];
								
								var color_type;
								var bit_depth;
	
								var colors = [];
								var trans;
								
								var colors_with_alpha = [];
								
								var found_IHDR_chunk = function(chunk_buffer) {
									var chunk_length = chunk_buffer.readUInt32BE(0);
									console.log('IHDR chunk_length ' + chunk_length);
									
									// extract various values from it.
									// could set them in an FSM.
									
									var img_width = chunk_buffer.readUInt32BE(8);
									var img_height = chunk_buffer.readUInt32BE(12);
									
									console.log('img_width ' + img_width);
									console.log('img_height ' + img_height);
									
									bit_depth = chunk_buffer.readUInt8(16);
									color_type = chunk_buffer.readUInt8(17);
									var compression_method = chunk_buffer.readUInt8(18);
									var filter_method = chunk_buffer.readUInt8(19);
									var interlace_method = chunk_buffer.readUInt8(20);
									
									console.log('bit_depth ' + bit_depth);
									console.log('color_type ' + color_type);
									console.log('compression_method ' + compression_method);
									console.log('filter_method ' + filter_method);
									console.log('interlace_method ' + interlace_method);
									//var chunk_crc = data.readUInt32BE(29);
									//console.log('chunk_crc ' + chunk_crc);
									
									var obj_metadata = {
										'width': img_width,
										'height': img_height,
										'bit_depth': bit_depth,
										'color_type': color_type,
										'compression_method': compression_method
									}
									
									found_metadata(obj_metadata);
									src.pause();
									src.destroy();
								}
								
								var found_gAMA_chunk = function(chunk_buffer) {
									var chunk_length = chunk_buffer.readUInt32BE(0);
									console.log('gAMA chunk_length ' + chunk_length);
									
									var value = chunk_buffer.readUInt32BE(8);
									
									console.log('value ' + value);
								}
								
								var found_PLTE_chunk = function(chunk_buffer) {
									var chunk_length = chunk_buffer.readUInt32BE(0);
									console.log('PLTE chunk_length ' + chunk_length);
									
									// then we get the chunk data... all the colors
									
									var num_colors = chunk_length / 3;
									console.log('num_colors ' + num_colors);
									
									// then parse the individual colors.
									
									var c = 0;
									var color_begin_pos = 8;
									while (c < num_colors) {
										// the color is stored as 4 1 byte values.
										//  but the info about color locations could be parsed out?
										//  in this situation, we want the colors from the pallet.
										
										//
										var color = [chunk_buffer.readUInt8(color_begin_pos), chunk_buffer.readUInt8(color_begin_pos + 1), chunk_buffer.readUInt8(color_begin_pos + 2)];
										colors.push(color);
										
										
										color_begin_pos = color_begin_pos + 3;
										
										c++;
									}
									
									console.log('colors ' + stringify(colors));
									console.log('colors.length ' + stringify(colors.length));
									
								}
								
								var found_tRNS_chunk = function(chunk_buffer) {
									var chunk_length = chunk_buffer.readUInt32BE(0);
									console.log('tRNS chunk_length ' + chunk_length);
									
									//var value = chunk_buffer.readUInt32BE(8);
									
									//console.log('value ' + value);
									if (color_type == 3) {
										// then we read in all the color values.
										trans = [];
										for (var c = 8; c < 8 + chunk_length; c++) {
											var alpha = chunk_buffer.readUInt8(c);
											console.log('alpha ' + alpha);
											trans.push(alpha);
										}
										
										// then create the colors with alpha values.
										
										each(colors, function(i, v) {
											if (is_defined(trans[i])) {
												var color_with_alpha = [v[0], v[1], v[2], trans[i]];
												colors_with_alpha.push(color_with_alpha);
											} else {
												var color_with_alpha = [v[0], v[1], v[2], 255];
												colors_with_alpha.push(color_with_alpha);
											};
											
											//var color_with_alpha = [v[0], v[1], v[2], ]
										});
										console.log('colors_with_alpha ' + stringify(colors_with_alpha));
									}
									
								}
								
								var found_IDAT_chunk = function(chunk_buffer) {
									var chunk_length = chunk_buffer.readUInt32BE(0);
									console.log('IDAT chunk_length ' + chunk_length);
									
									// Then has the data been compressed with deflate?
									
									/*
									 * 
									 * this._inflate = zlib.createInflate();
								
										this._inflate.on('error', this.emit.bind(this, 'error'));
										
										console.log('bind _reverseFiltered');
										this._filter.on('complete', this._reverseFiltered.bind(this));
								
										this._inflate.pipe(this._filter);
									 * 
									 */
									
									// Let's have it decompress the data.
									
									// Need to have it decompress the right data from the buffer
									
									var idx_data_start = 8;
									var idx_data_end = idx_data_start + chunk_length;
									
									//var inflate = zlib.createInflate();
									
									// inflate it to a stream or buffer?
									
									var buffer_deflated = new Buffer(chunk_length);
									chunk_buffer.copy(buffer_deflated, 0, idx_data_start, idx_data_end);
									
									zlib.inflate(buffer_deflated, function(err, buffer_inflated) {
										//console.log('err ' + err);
										//console.log('res ' + res);
										if (err) {
											
										} else {
											console.log('buffer_inflated.length ' + buffer_inflated.length);
											
											// then let's look through the inflated buffer.
											//  if the colormode is 3, that is indexed.
											
											// move through differently for different bpp values.
											
											if (color_type == 3) {
												// look at the bit depth.
												//  if it's less than 8, we need to deconstruct the various pixels into their components, and save those indexed values.
												
												// Can still save them as indexed values here...
												//  But at some stage we want to render these into the colors themselves (perhaps on a grid).
												
												if (bit_depth == 8) {
													// get the individual bit / palette index value.
													
													for (var c = 0, l = buffer_inflated.length; c < l; c++) {
														var px_value = buffer_inflated.readUInt8(c);
														//console.log('px_value ' + px_value);
													}
												}
											}
										}
									})
								}
								
								var found_IEND_chunk = function(chunk_buffer) {
									
									// then the image is finished.
									
									
									// let's do the callback, returning the palette data.
									
									callback(null, colors_with_alpha);
									
								}
								
								var found_chunk = function(chunk_buffer) {
									// the chunk data as a buffer too?
									// the chunk will be read in that way I think.
									console.log('found_chunk chunk_buffer.length ' + chunk_buffer.length);
									// then let's read this chunk.
									//  will raise various different events for different chunks that get read.
									
									// interpret the chunk, and raise an event for having found that kind of chunk.
									
									var chunk_length = chunk_buffer.readUInt32BE(0);
									//console.log('chunk_length ' + chunk_length);
									
									var chunk_type = chunk_buffer.toString('ascii', 4, 8);
									//console.log('* chunk_type ' + chunk_type + '  ');
									
									// beginning of the chunk data, end of chunk data
									//  From the chunk buffer.
									//  Not sure we really need a chunk buffer anyway, but maybe buffer is more suitable than string for various things.
									
									var idx_chunk_data_beginning = 8;
									var idx_chunk_data_ending = idx_chunk_data_beginning + chunk_length - 8;
									
									console.log('idx_chunk_data_ending ' + idx_chunk_data_ending);
									
									var chunk_crc = chunk_buffer.readUInt32BE(idx_chunk_data_ending);
									
									console.log('chunk_crc ' + chunk_crc);
									
									
									// can extract out the data itself.
									// that could be useful with a particular parser.
									
									// and the next position within the data...
									
									
									// OK, so it reads the chunks.
									
									// Want to raise events for particular types of chunks.
									//  That could actually parse the image info.
									//  We'll be able to get the transparency and the palette chunks, both are needed to find out what rgba colors are represented.
									
									if (chunk_type == 'IHDR') {
										found_IHDR_chunk(chunk_buffer);
									}
									
									/*
									
									if (chunk_type == 'gAMA') {
										found_gAMA_chunk(chunk_buffer);
									}
									if (chunk_type == 'PLTE') {
										found_PLTE_chunk(chunk_buffer);
									}
									if (chunk_type == 'tRNS') {
										found_tRNS_chunk(chunk_buffer);
									}
									if (chunk_type == 'IDAT') {
										found_IDAT_chunk(chunk_buffer);
									}
									if (chunk_type == 'IEND') {
										found_IEND_chunk(chunk_buffer);
									}
									*/
								}
								
								var incomplete_chunk_buffer = false;
								
								src.on('data', function(data) {
								
									// if we have an imcomplete chunk buffer, merge them.
									if (incomplete_chunk_buffer) {
										var new_data = new Buffer(incomplete_chunk_buffer.length + data.length);
										
										incomplete_chunk_buffer.copy(new_data, 0, 0, incomplete_chunk_buffer.length);
										data.copy(new_data, incomplete_chunk_buffer.length, 0, data.length);
										data = new_data;
										incomplete_chunk_buffer = false;
									}
									
								
									console.log("Found some data! data.length " + data.length);
									//  that is the amount in the buffer...
									
									// The amount given in the buffer here may not be the full chunk.
									//  If it is not the full chunk, we need to copy what we do have into a temporary buffer, and
									//   then use that as well as the next data for reading the PNG chunk.
									
									
									
									
									console.log('data_num ' + data_num);
									console.log('');
									//png_pos
									
									// move through the data... we'll keep in sync with the chunks.
									
									if (data_num == 0) {
										// we start by finding the PNG signature and the first chunk.
										chunk_beginning_pos = 8;
										var chunk_length = data.readUInt32BE(chunk_beginning_pos);
										console.log('chunk_length ' + chunk_length);
										
										// make a new chunk buffer and read that chunk into the buffer
										//  check there is enough space left in the current buffer.
										
										var buf_chunk = new Buffer(chunk_length + 12);
										var next_chunk_pos = chunk_beginning_pos + 12 + chunk_length;
										
										// check that it's within the bounds of the data... otherwise don't write it.
										//  otherwise will write an incomplete buffer.
										data.copy(buf_chunk, 0, chunk_beginning_pos, next_chunk_pos);
										
										found_chunk(buf_chunk);
										// then read everything from the chunk into chunk data.
									}
									
									// then read through all the chunks.
									
									
									// read the next chunk.
									var ctu = true;
									while (ctu && next_chunk_pos < data.length) {
										chunk_beginning_pos = next_chunk_pos;
										//console.log('chunk_beginning_pos ' + chunk_beginning_pos);
										// copy that chunk into a buffer and give it to the chunk comprehension.
										var chunk_length = data.readUInt32BE(chunk_beginning_pos);
										console.log('chunk_length ' + chunk_length);
										
										// chunk_end_position_in_read_buffer
										
										var chunk_end_position_in_read_buffer = chunk_beginning_pos + chunk_length + 12
										
										if (chunk_end_position_in_read_buffer > data.length) {
											// need to copy this into the temporary buffer
											//  buffer for incomplete chuncks that have been read.
											incomplete_chunk_buffer = new Buffer(data.length - chunk_end_position_in_read_buffer);
											data.copy(incomplete_chunk_buffer, 0, chunk_beginning_pos, data.length);
											ctu = false;
											
										} else {
											var buf_chunk = new Buffer(chunk_length + 12);
											var next_chunk_pos = chunk_end_position_in_read_buffer;
											//console.log('next_chunk_pos ' + next_chunk_pos);
											
											data.copy(buf_chunk, 0, chunk_beginning_pos, next_chunk_pos);
											found_chunk(buf_chunk);
										}
									}
									// for the moment, it looks like this is reading in the whole PNG.
									
									// want to add this to a buffer.
									//   may need to try with some larger images as well.
									
									// need to keep track of where we are in parsing the PNG.
									//  want to make some more generic stream parsing. Could raise various events like a SAX parser to say it has parsed various things.
									
									// This should help with fast processing of a lot of PNG images.
									
									// data is a buffer, I think.
									
									// do we keep track of the position?
									//  does this get copied into another buffer as well?
									
									// we may need to keep track of data that forms part of a chunk.
									
									// storing an incomplete chunk buffer?
									
									// Possibly read this to a buffer, but really want to process it as we get it.
									//  May need to try this with larger files.
									
									// No real harm in reading to another buffer here?
									//  Or can throw an error if a chunk is not completed.
									
									// Maybe we have all the data.
									
									// we can read through the data and report completed chunks, and add uncompleted chunks to a buffer.
									
									// we can have a look through the data received.
									
									// if it is at the start, we can have a look for the signature, and move past it.
									//data.copy(png_buffer, png_pos);
									
									// we are interested in getting the references of objects so they can be read from the buffer that lasts beyond these stream reads.
									//  At a later point it will make more point to read in only particular chunks.
									//  There will be some interesting processing to do regarding video frames at some point.
									// It seems as though node.js will be relatively efficient in various ways.
									//  More direct integration of streams will be very useful too.
									
									// find out if there is more to read from the stream?
									//  A ChunkStreamReader may work...
									data_num++;
								  //writeStream.write(textData);
								});
	
								// the reading is finished...
								src.on('close', function () {
									// It should have been processing the data recieved.
									
									//writeStream.end(); // ...close up the write, too!
									console.log("src finished.");
								});
								/*
								
								fs.read(fd, png_input_buffer, 0, 30, 0, function(err, num_bytes_read, buffer) {
									if (err) {
										
									} else {
										console.log('buffer === png_input_buffer ' + buffer === png_input_buffer);
										
										// the buffer of pixels that has been read in...
										
										// bytesread... a string I think.
										console.log('num_bytes_read ' + stringify(num_bytes_read));
										
										// and the data should be in the png input buffer.
										
										//  want to read a chunk from the buffer.
										
									}
									
								})
								*/
							}
						})
					}
				});
			}
			//open_png_directly();
			
			
			// I think this one works fairly quickly.
			//  Could maybe be quicker?
			var read_png_directly = function() {
				// read 1000 bytes from the file, process that.
				//  think the metadata has got to be there.
				
				// This is going to be seriously quick in comparison to Imagemagick's identify.
				
				//fs.read
				
				
				
				fs.open(source_path, 'r', function(err, fd) {
					if (err) {
								
					} else {
						// fs.read(fd, buffer, offset, length, position, [callback])
						
						var buf = new Buffer(1024);
						var data_num = 0;
						
						var found_metadata = function(obj_metadata) {
							// and can we close the read buffer?
						
							callback(null, obj_metadata);
						}
						
						fs.read(fd, buf, 0, 1024, 0, function(err, bytes_read) {
							if (err) {
								throw err
							} else {
								// process this buf.
								
								var found_IHDR_chunk = function(chunk_buffer) {
									var chunk_length = chunk_buffer.readUInt32BE(0);
									console.log('IHDR chunk_length ' + chunk_length);
									
									// extract various values from it.
									// could set them in an FSM.
									
									var img_width = chunk_buffer.readUInt32BE(8);
									var img_height = chunk_buffer.readUInt32BE(12);
									
									console.log('img_width ' + img_width);
									console.log('img_height ' + img_height);
									
									bit_depth = chunk_buffer.readUInt8(16);
									color_type = chunk_buffer.readUInt8(17);
									var compression_method = chunk_buffer.readUInt8(18);
									var filter_method = chunk_buffer.readUInt8(19);
									var interlace_method = chunk_buffer.readUInt8(20);
									
									console.log('bit_depth ' + bit_depth);
									console.log('color_type ' + color_type);
									console.log('compression_method ' + compression_method);
									console.log('filter_method ' + filter_method);
									console.log('interlace_method ' + interlace_method);
									//var chunk_crc = data.readUInt32BE(29);
									//console.log('chunk_crc ' + chunk_crc);
									
									var obj_metadata = {
										'width': img_width,
										'height': img_height,
										'bit_depth': bit_depth,
										'color_type': color_type,
										'compression_method': compression_method
									}
									
									found_metadata(obj_metadata);
									//src.pause();
									//src.destroy();
								}
								
								var found_chunk = function(chunk_buffer) {
									// the chunk data as a buffer too?
									// the chunk will be read in that way I think.
									console.log('found_chunk chunk_buffer.length ' + chunk_buffer.length);
									// then let's read this chunk.
									//  will raise various different events for different chunks that get read.
									
									// interpret the chunk, and raise an event for having found that kind of chunk.
									
									var chunk_length = chunk_buffer.readUInt32BE(0);
									//console.log('chunk_length ' + chunk_length);
									
									var chunk_type = chunk_buffer.toString('ascii', 4, 8);
									//console.log('* chunk_type ' + chunk_type + '  ');
									
									// beginning of the chunk data, end of chunk data
									//  From the chunk buffer.
									//  Not sure we really need a chunk buffer anyway, but maybe buffer is more suitable than string for various things.
									
									var idx_chunk_data_beginning = 8;
									var idx_chunk_data_ending = idx_chunk_data_beginning + chunk_length - 8;
									
									console.log('idx_chunk_data_ending ' + idx_chunk_data_ending);
									
									var chunk_crc = chunk_buffer.readUInt32BE(idx_chunk_data_ending);
									
									console.log('chunk_crc ' + chunk_crc);
									
									
									// can extract out the data itself.
									// that could be useful with a particular parser.
									
									// and the next position within the data...
									
									
									// OK, so it reads the chunks.
									
									// Want to raise events for particular types of chunks.
									//  That could actually parse the image info.
									//  We'll be able to get the transparency and the palette chunks, both are needed to find out what rgba colors are represented.
									
									if (chunk_type == 'IHDR') {
										found_IHDR_chunk(chunk_buffer);
									}
									
									/*
									
									if (chunk_type == 'gAMA') {
										found_gAMA_chunk(chunk_buffer);
									}
									if (chunk_type == 'PLTE') {
										found_PLTE_chunk(chunk_buffer);
									}
									if (chunk_type == 'tRNS') {
										found_tRNS_chunk(chunk_buffer);
									}
									if (chunk_type == 'IDAT') {
										found_IDAT_chunk(chunk_buffer);
									}
									if (chunk_type == 'IEND') {
										found_IEND_chunk(chunk_buffer);
									}
									*/
								}
								
								
								if (data_num == 0) {
									// we start by finding the PNG signature and the first chunk.
									chunk_beginning_pos = 8;
									var chunk_length = buf.readUInt32BE(chunk_beginning_pos);
									console.log('chunk_length ' + chunk_length);
									
									// make a new chunk buffer and read that chunk into the buffer
									//  check there is enough space left in the current buffer.
									
									var buf_chunk = new Buffer(chunk_length + 12);
									var next_chunk_pos = chunk_beginning_pos + 12 + chunk_length;
									
									// check that it's within the bounds of the data... otherwise don't write it.
									//  otherwise will write an incomplete buffer.
									buf.copy(buf_chunk, 0, chunk_beginning_pos, next_chunk_pos);
									
									found_chunk(buf_chunk);
									// then read everything from the chunk into chunk data.
								}
								
								
								
								
							}
						});
							
					}
							
				});
				
			}
			read_png_directly();
			
			
			var use_node_imagemagick = function() {
				im.identify(source_path, function(err, metadata){
					if (err) {
						throw err;
					} else {
						//console.log ('metadata ' + stringify(metadata));
						//console.log ('metadata ' + (metadata));
						// can verify the format here...
						var im_format = metadata.format;
						var dimensions = [parseInt(metadata.width), parseInt(metadata.height)];
						var color_depth = metadata.depth;
						
						var res = {
							'dimensions': dimensions,
							'color_depth': color_depth
						}
						callback(null, res);
						//console.log('Shot at '+metadata.exif.dateTimeOriginal)
					}
					//console.log('Shot at '+metadata.exif.dateTimeOriginal);
				})
			}
			//use_node_imagemagick();
		},
		
		// http://localhost:3005/facebook/admin/files/img/dir_resize.command?target=x2_spices&dest=x1_spices&size=50%
		
		// this seems slow in comparison to imagemagick for pngs.
		'audio/mpeg3': function(path, callback) {
			// Can put different methods in place here. May change data formatting a bit.
			var use_fluent_Metalib = function() {
				var metaObject = new fluent_Metalib(path);
				metaObject.get(function(metadata, err) {
					if(err) {
						//console.log('err ' + err);
						var stack = new Error().stack
						console.log( stack )
						throw('err ' + err);
					} else {
						//console.log('metadata ' + stringify(metadata));
						callback(null, metadata);
					}
				});
			}
			//use_fluent_Metalib();
			// this way is slow... perhaps more directly using FFMPEG will be faster.
			
			var parse_property_values = function(str_val) {
				var rx_kvp = /^(\w+):\s?([\w\./:\s]+\s?)+/;
				var match = str_val.match(rx_kvp);
				//console.log('match ' + stringify(match));
				
				var res = [];
				if (match) {
					// let's see if we can parse the value.
					//  if it's a duration, maybe other values, we can parse it to ms.
					//   and just keep it as an ms integer.
					
					// likely to be operating a metadata cache on the filesystem.
					//  will create metadata as a background task.
					
					// likely to store this metadata in its own database.
					//  I think that does make sense. Quick to update that, quick to access it, separate from file system.
					//   Tokyo Cabinet seems like a good possibility for that.
					//   Mongo may make more sense, faster to set up.
					
					var rx_ffmpeg_time = /^(\d\d):(\d\d):(\d\d)\.(\d\d)$/;
					
					var name = match[1];
					var value = match[2];
					
					var match_ft = value.match(rx_ffmpeg_time);
					//console.log('match_ft ' + stringify(match_ft));
					
					if (match_ft) {
						var h = parseInt(match_ft[1]);
						var m = parseInt(match_ft[2]);
						var s = parseInt(match_ft[3]);
						var ms = parseInt(match_ft[4]) * 10;
						
						//console.log('h ' + h);
						//console.log('m ' + m);
						//console.log('s ' + s);
						//console.log('ms ' + ms);
						
						var total_min = m + (h * 60);
						var total_s = s + (total_min * 60);
						var total_ms = ms + (total_s * 1000);
						
						//var t = ms + (s + (m + (h * 60) * 60) * 1000); 
						//console.log('total_ms ' + total_ms);
						
						res.push(['ms_' + name.toLowerCase(), total_ms]);
						
					} else {
						res.push([name, value]);
					}
				}
				return res;
			}
			
			var use_ffmpeg_directly = function() {
				// ffmpeg -analyzeduration 1000000000 -i 01.mp3
				exec("ffmpeg -analyzeduration 1000000000 -i " + path, function(err, stdout){
					if (err) {
						//console.log('err ' + err);
						// this fails anyway, it's not outputting anything like FFMPEG expects.
						// the error contains the needed info.
						var str_err = err.toString();
						var s1 = 'Input #';
						var pos1 = str_err.indexOf(s1) + s1.length;
						var s2 = 'At least';
						var pos2 = str_err.indexOf(s2);
						var extract = str_err.substring(pos1, pos2);
						//console.log('extract ' + extract);
						
						var s3 = 'Metadata:';parse_property_values
						var pos3 = extract.indexOf(s3) + s3.length;
						var str_md = extract.substring(pos3);
						var split = str_md.split('\n');
						//console.log('split ' + stringify(split));
						
						var lines2 = [];
						
						var res_properties = {};
						
						each(split, function(i, v) {
							//console.log('v ' + v);
							// run them through a regex that strips extra spaces / tabs
							var rx_extra_spc_detect = /\t/g;
							var v2 = v.replace(rx_extra_spc_detect, '');
							
							var rx2 = /^ +/g;
							v2 = v2.replace(rx2, '');
							
							var rx3 = / {2,}/g;
							v2 = v2.replace(rx3, ' ');
							
							var rx4 = / :/g;
							v2 = v2.replace(rx4, ':');
							
							var rx5 = /\n|\r$/g;
							v2 = v2.replace(rx5, '');
							
							//console.log('v2 ' + stringify(v2));
							// file_s_url = file_s_url.replace(/(\/)/g, '\\');
							
							var pv = parse_property_values(v2);
							each(pv, function(i, nvp) {
								var name = nvp[0];
								var value = nvp[1];
								
								//console.log('name ' + name);
								//console.log('value ' + value);
								res_properties[name] = value;
							})
						})
						//return res_properties;
						callback(null, res_properties);
					} else {
						//var output = stdout.toString();
						//console.log('output ' + output);
					}
					//socket.emit('Done', {'Image' : 'Video/' + Name + '.jpg'});
				});
			}
			
			use_ffmpeg_directly();
			// This seems the fastest so far.
			// sox seems to be quite slow, seems to do a full read of audio.
			//  would be useful for audio processing though.
			/*
			var use_sox_directly = function() {
				exec("sox " + path + ' -n stat', function(err, stdout){
					
					if (err) {
						console.log('err ' + err);
						// this fails anyway, it's not outputting anything like FFMPEG expects.
						// the error contains the needed info.
						var s1 = 'Input #';
						var pos1 = err.indexOf(s1) + s1.length;
						
						//var s2 = 
					} else {
						var output = stdout.toString();
						console.log('output ' + output);
					}
					//socket.emit('Done', {'Image' : 'Video/' + Name + '.jpg'});
				});
			}
			*/
			//use_sox_directly();
		}
	};

	// Can be various file processing functions as local variables.

	// Being able to rapidly get the separate items out of a bunch of SVG images.

	// So, could give it 

	var fs2 = {
		// dir_svg_dirs_to_png_dirs
		//  creates the png directories according to output format.
		//  could output to multiple formats as well.
		'dir_dirs_beginning': function(dir_path, beginning_text, callback) {
			fs2.dir_contents(dir_path, function(err, dir_contents) {
				if (err) {
					throw err;
				} else {
					var directories = dir_contents.directories;
					var target_directories = [];
					each(directories, function(i, v) {
						if (v.substr(0, beginning_text.length) == beginning_text) target_directories.push(v);
					});
					callback(null, target_directories);
				}
			})
		},
		
		// maybe include colour depth here?
		'dir_png_8_quant_dirs_to_spritesheet_dir': function(dir_path, callback) {
			// will get all of the directories that are png8 quant compressed (have those objects inside).
			console.log('');
			console.log('dir_png_8_quant_dirs_to_spritesheet_dir dir_path ' + dir_path);
			fs2.dir_dirs_beginning(dir_path, 'png8_', function(err, png8_dirs) {
				if (err) {
					throw(err);
				} else {
					// go through png8_dirs, finding the quant ones.
					
					// put together function calls...
					
					var quant_dirs_full_paths = [];
					
					each(png8_dirs, function(i, dir_name) {
						// png8_32c_quant_144dpi_
						console.log('dir_name ' + dir_name);
						// png8_32c_quant_144dpi_Condiments
						var rx = /_(\d+)c_quant_(\d+)dpi_/;
						var match = dir_name.match(rx);
						console.log('match ' + stringify(match));
						
						
						// could accept them based on colors or density.
						if (match) {
							var num_colors = parseInt(match[1]);
							var density = parseInt(match[2]);
						}
						
						var full_dir_name = dir_path + dir_separator + dir_name;
						
						// will be calling a function to make the spritesheet for that directory.
						quant_dirs_full_paths.push(full_dir_name);
						
						// png_directory_to_spritesheet
						
					});
					
					console.log('quant_dirs_full_paths ' + stringify(quant_dirs_full_paths));
					
					var fcs = [];
					
					each(quant_dirs_full_paths, function(i, quant_dir_full_path) {
						var fc = [fs2.png_directory_to_spritesheet, [quant_dir_full_path]];
						fcs.push(fc);
					});
					
					call_multiple_callback_functions(fcs, function(err, res) {
						if (err) {
							throw(err);
						} else {
							callback(null, res);
						}
					});
				}
			})
		},
		
		'png8_palette': function(source_path, callback) {
			// May change this to get a PNG's metadata.
			
			// load the file in, try to read it with the PNG processor.
			// now there is quite a lot of code here, useful for reading data from a PNG.
			//  reads more than just the palette.
			
			// Now there is enough back-end code to build a nice file manager.
			//  It will be an HTML file with front-end that is generated for each request.
			//  Considering using the full JSGUI that includes initial HTML rendering on the server.
			//   That could even allow it to work (though not as well) without JavaScript.
			
			// Could render a different file admin page for different places in the file tree.
			//  I think that would make a lot of sense, for testing the control construction on the server.
			//  It's the way I had intended anyway.
			//   Not so sure about the screen scraping side of it for getting the initial data?
			
			// Creating the control and then rendering it on the server...
			//  it also sends some extra info to the client about that jsgui control
			//  then it gets activated on the client.
			
			// It makes sense to both allow for and allow for the server-side rendering to be disabled.
			//  This would require quite a large build on the client.
			// Getting towards the pallet now, may be able to make something really nicely optimized that partially
			//  reads from a buffer, may need to close it when the palette has been retrieved.
			
			// Then maybe change the PNG processor so that it can read it (but it will keep a different buffer) possibly.
			
			var that = this;
		    
			// we need to know what filter type it is?
			
			// Can we read the filterType?
			
			// Maybe best to do the code entirely here, taking it out of pngjs?
			
			
			/*
			fs.createReadStream(source_path).pipe(new PNG({
		        filterType: 4
		    }))
		    .on('parsed', function() {
		    	//console.log('parsed');
		    	// var that = this;
		        
		    	var pal = this.palette;
		    	console.log('pal ' + stringify(pal));
		    	
		    	//that.data = 
		    	
		    	//this.data.copy(that.data);
		    	
		    	//callback.call(that);
		    	
		    });	
			
			*/
			
			// read everything from the source path.
			//  maybe into a buffer is best.
			
			// Then have a look at that buffer.
			
			/* Reads it into the buffer, then we'll have a look through that buffer.
			 */
			
			// It reads the whole buffer here.
			//  It would be interesting to have a parser that reads through the PNG, streaming from the buffer, raising a callback when various pieces have been
			//  read. It could then be stopped before the whole thing has been read in, to be more efficient.
			// It would not need to read much of a PNG in order to get the palette.
			// It's good to be getting closer to reading in a whole PNG in various different formats.
			
			// Maybe I should make this file manager very soon.
			//  It would be using quite a lot of GUI features.
			//  Selectables, dynamic menus for example.
			
			// May also be worth having a socket.io connection.
			//  Will be useful on mobile devices too for accessing files (hopefully).
			
			
			
			// I think a png_reader will be very useful.
			
			// It will raise callbacks for what it encounters in the data it recieves from a buffer.
			//  This should enable some services to run really quickly.
			// Could have a faster way of getting metadata from a PNG by quite a long way.
			//  Likely to look into MP3 files at some point as well.
			
			// Let's have something that just reads through the file input buffer.
			
			// maybe we should read in 1024 bytes at a time?
			//  or it could read some at the beginning, and keep reading chunks in.
			//  but then there may be better size amounts to read?
			// I think when just getting the metadata, only get the very beginning.
			//  Then read in more after that.
			
			// Do want to get onto the front-end platform as well.
			//  Getting close to automatic generation of rounded / replacement images.
			//  These could be very usable in systems that need to support some older browsers.
			
			// Something that keeps reading more of the file buffer...
			//  May want to do larger reads from disk?
			
			/*
			 * s.read(fd, buffer, offset, length, position, [callback])#
				Read data from the file specified by fd.
				
				buffer is the buffer that the data will be written to.
				
				offset is offset within the buffer where writing will start.
				
				length is an integer specifying the number of bytes to read.
				
				position is an integer specifying where to begin reading from in the file. If position is null, data will be read from the current file position.
				
				The callback is given the three arguments, (err, bytesRead, buffer).
			 */
			
			// don't yet have the size of the buffer.
			//  can we find out the size of the file quickly?
			
			// It may be best to read a few KB to start with? Too many small reads are bad for performance.
			//  But these precise reads may work out quite well, could maybe read them from a larger buffer though.
			
			fs.stat(source_path, function(err, stats) {
				if (err) {
					
				} else {
					var size = stats.size;
					
					console.log('size ' + size);
					
					// General PNG reading code.
					//  Perhaps I will have an event driven PNG reader, so that it calls a function when it
					//  has read more pixels from the PNG.
					
					// Being able to give or pipe it a buffer would be useful.
					//   Also, would be useful to only read the first part of the PNG rather than the whole thing.
					
					
					
					
					var png_input_buffer = new Buffer(size);
					
					fs.open(source_path, 'r', function(err, fd) {
						if (err) {
							
						} else {
							
							// want to keep reading chunks.
							//  thinking about having this read more normal sized blocks from the disk.
							//   and then the system analyses the chunks.
							
							// This one can get the palette information efficiently.
							//  Other tools can do other reading and interpretation of blocks.
							
							// If the file is quite big we don't want to read too much... but reading up to 8KB should be OK I think.
							
							// And that 8KB can be processed to look for the palette.
							
							// May want something that processes a PNG pipe.
							
							// We can do this from a file stream.
							
							/* Let's try reading a stream from the disk */
							/*
							 * readStream.on('data', function(textData) {
								  console.log("Found some text!");
								  writeStream.write(textData);
								});
								
								// the reading is finished...
								readStream.on('close', function () {
								  writeStream.end(); // ...close up the write, too!
								  console.log("I finished.");
								});
							 * 
							 */
							
							var src = fs.createReadStream(source_path);
							
							
							var png_buffer = new Buffer(size);
							var png_pos = 0;
							
							// storing the previous data buffer as well...
							var data_num = 0;
							var chunk_positions_in_full_data = [];
							
							
							var color_type;
							var bit_depth;

							var colors = [];
							var trans;
							
							var colors_with_alpha = [];
							
							var found_IHDR_chunk = function(chunk_buffer) {
								var chunk_length = chunk_buffer.readUInt32BE(0);
								console.log('IHDR chunk_length ' + chunk_length);
								
								// extract various values from it.
								// could set them in an FSM.
								
								var img_width = chunk_buffer.readUInt32BE(8);
								var img_height = chunk_buffer.readUInt32BE(12);
								
								console.log('img_width ' + img_width);
								console.log('img_height ' + img_height);
								
								bit_depth = chunk_buffer.readUInt8(16);
								color_type = chunk_buffer.readUInt8(17);
								var compression_method = chunk_buffer.readUInt8(18);
								var filter_method = chunk_buffer.readUInt8(19);
								var interlace_method = chunk_buffer.readUInt8(20);
								
								console.log('bit_depth ' + bit_depth);
								console.log('color_type ' + color_type);
								console.log('compression_method ' + compression_method);
								console.log('filter_method ' + filter_method);
								console.log('interlace_method ' + interlace_method);
								//var chunk_crc = data.readUInt32BE(29);
								//console.log('chunk_crc ' + chunk_crc);
							}
							
							var found_gAMA_chunk = function(chunk_buffer) {
								var chunk_length = chunk_buffer.readUInt32BE(0);
								console.log('gAMA chunk_length ' + chunk_length);
								
								var value = chunk_buffer.readUInt32BE(8);
								
								console.log('value ' + value);
							}
							
							var found_PLTE_chunk = function(chunk_buffer) {
								var chunk_length = chunk_buffer.readUInt32BE(0);
								console.log('PLTE chunk_length ' + chunk_length);
								
								// then we get the chunk data... all the colors
								
								var num_colors = chunk_length / 3;
								console.log('num_colors ' + num_colors);
								
								// then parse the individual colors.
								
								var c = 0;
								var color_begin_pos = 8;
								while (c < num_colors) {
									// the color is stored as 4 1 byte values.
									//  but the info about color locations could be parsed out?
									//  in this situation, we want the colors from the pallet.
									
									//
									var color = [chunk_buffer.readUInt8(color_begin_pos), chunk_buffer.readUInt8(color_begin_pos + 1), chunk_buffer.readUInt8(color_begin_pos + 2)];
									colors.push(color);
									
									
									color_begin_pos = color_begin_pos + 3;
									
									c++;
								}
								
								console.log('colors ' + stringify(colors));
								console.log('colors.length ' + stringify(colors.length));
								
							}
							
							var found_tRNS_chunk = function(chunk_buffer) {
								var chunk_length = chunk_buffer.readUInt32BE(0);
								console.log('tRNS chunk_length ' + chunk_length);
								
								//var value = chunk_buffer.readUInt32BE(8);
								
								//console.log('value ' + value);
								if (color_type == 3) {
									// then we read in all the color values.
									trans = [];
									for (var c = 8; c < 8 + chunk_length; c++) {
										var alpha = chunk_buffer.readUInt8(c);
										console.log('alpha ' + alpha);
										trans.push(alpha);
									}
									
									// then create the colors with alpha values.
									
									each(colors, function(i, v) {
										if (is_defined(trans[i])) {
											var color_with_alpha = [v[0], v[1], v[2], trans[i]];
											colors_with_alpha.push(color_with_alpha);
										} else {
											var color_with_alpha = [v[0], v[1], v[2], 255];
											colors_with_alpha.push(color_with_alpha);
										};
										
										//var color_with_alpha = [v[0], v[1], v[2], ]
									});
									console.log('colors_with_alpha ' + stringify(colors_with_alpha));
								}
								
							}
							
							var found_IDAT_chunk = function(chunk_buffer) {
								var chunk_length = chunk_buffer.readUInt32BE(0);
								console.log('IDAT chunk_length ' + chunk_length);
								
								// Then has the data been compressed with deflate?
								
								/*
								 * 
								 * this._inflate = zlib.createInflate();
							
							        this._inflate.on('error', this.emit.bind(this, 'error'));
							        
							        console.log('bind _reverseFiltered');
							        this._filter.on('complete', this._reverseFiltered.bind(this));
							
							        this._inflate.pipe(this._filter);
								 * 
								 */
								
								// Let's have it decompress the data.
								
								// Need to have it decompress the right data from the buffer
								
								var idx_data_start = 8;
								var idx_data_end = idx_data_start + chunk_length;
								
								//var inflate = zlib.createInflate();
								
								// inflate it to a stream or buffer?
								
								var buffer_deflated = new Buffer(chunk_length);
								chunk_buffer.copy(buffer_deflated, 0, idx_data_start, idx_data_end);
								
								zlib.inflate(buffer_deflated, function(err, buffer_inflated) {
									//console.log('err ' + err);
									//console.log('res ' + res);
									if (err) {
										
									} else {
										console.log('buffer_inflated.length ' + buffer_inflated.length);
										
										// then let's look through the inflated buffer.
										//  if the colormode is 3, that is indexed.
										
										// move through differently for different bpp values.
										
										if (color_type == 3) {
											// look at the bit depth.
											//  if it's less than 8, we need to deconstruct the various pixels into their components, and save those indexed values.
											
											// Can still save them as indexed values here...
											//  But at some stage we want to render these into the colors themselves (perhaps on a grid).
											
											if (bit_depth == 8) {
												// get the individual bit / palette index value.
												
												for (var c = 0, l = buffer_inflated.length; c < l; c++) {
													var px_value = buffer_inflated.readUInt8(c);
													//console.log('px_value ' + px_value);
												}
											}
										}
									}
								})
							}
							
							var found_IEND_chunk = function(chunk_buffer) {
								
								// then the image is finished.
								
								
								// let's do the callback, returning the palette data.
								
								callback(null, colors_with_alpha);
								
							}
							
							var found_chunk = function(chunk_buffer) {
								// the chunk data as a buffer too?
								// the chunk will be read in that way I think.
								console.log('found_chunk chunk_buffer.length ' + chunk_buffer.length);
								// then let's read this chunk.
								//  will raise various different events for different chunks that get read.
								
								// interpret the chunk, and raise an event for having found that kind of chunk.
								
								var chunk_length = chunk_buffer.readUInt32BE(0);
								//console.log('chunk_length ' + chunk_length);
								
								var chunk_type = chunk_buffer.toString('ascii', 4, 8);
								//console.log('* chunk_type ' + chunk_type + '  ');
								
								// beginning of the chunk data, end of chunk data
								//  From the chunk buffer.
								//  Not sure we really need a chunk buffer anyway, but maybe buffer is more suitable than string for various things.
								
								var idx_chunk_data_beginning = 8;
								var idx_chunk_data_ending = idx_chunk_data_beginning + chunk_length - 8;
								
								console.log('idx_chunk_data_ending ' + idx_chunk_data_ending);
								
								var chunk_crc = chunk_buffer.readUInt32BE(idx_chunk_data_ending);
								
								console.log('chunk_crc ' + chunk_crc);
								
								
								// can extract out the data itself.
								// that could be useful with a particular parser.
								
								// and the next position within the data...
								
								
								// OK, so it reads the chunks.
								
								// Want to raise events for particular types of chunks.
								//  That could actually parse the image info.
								//  We'll be able to get the transparency and the palette chunks, both are needed to find out what rgba colors are represented.
								
								if (chunk_type == 'IHDR') {
									found_IHDR_chunk(chunk_buffer);
								}
								if (chunk_type == 'gAMA') {
									found_gAMA_chunk(chunk_buffer);
								}
								if (chunk_type == 'PLTE') {
									found_PLTE_chunk(chunk_buffer);
								}
								if (chunk_type == 'tRNS') {
									found_tRNS_chunk(chunk_buffer);
								}
								if (chunk_type == 'IDAT') {
									found_IDAT_chunk(chunk_buffer);
								}
								if (chunk_type == 'IEND') {
									found_IEND_chunk(chunk_buffer);
								}
								
							}
							
							src.on('data', function(data) {
								console.log("Found some data! data.length " + data.length);
								console.log('data_num ' + data_num);
								console.log('');
								//png_pos
								
								// move through the data... we'll keep in sync with the chunks.
								
								if (data_num == 0) {
									// we start by finding the PNG signature and the first chunk.
									chunk_beginning_pos = 8;
									var chunk_length = data.readUInt32BE(chunk_beginning_pos);
									console.log('chunk_length ' + chunk_length);
									
									// make a new chunk buffer and read that chunk into the buffer
									//  check there is enough space left in the current buffer.
									
									var buf_chunk = new Buffer(chunk_length + 12);
									var next_chunk_pos = chunk_beginning_pos + 12 + chunk_length;
									
									// check that it's within the bounds of the data... otherwise don't write it.
									//  otherwise will write an incomplete buffer.
									data.copy(buf_chunk, 0, chunk_beginning_pos, next_chunk_pos);
									
									found_chunk(buf_chunk);
									// then read everything from the chunk into chunk data.
								}
								
								// then read through all the chunks.
								
								
								// read the next chunk.
								
								while (next_chunk_pos < data.length) {
									chunk_beginning_pos = next_chunk_pos;
									//console.log('chunk_beginning_pos ' + chunk_beginning_pos);
									// copy that chunk into a buffer and give it to the chunk comprehension.
									var chunk_length = data.readUInt32BE(chunk_beginning_pos);
									//console.log('chunk_length ' + chunk_length);
									var buf_chunk = new Buffer(chunk_length + 12);
									var next_chunk_pos = chunk_beginning_pos + chunk_length + 12;
									//console.log('next_chunk_pos ' + next_chunk_pos);
									
									data.copy(buf_chunk, 0, chunk_beginning_pos, next_chunk_pos);
									found_chunk(buf_chunk);
								}
								// for the moment, it looks like this is reading in the whole PNG.
								
								// want to add this to a buffer.
								//   may need to try with some larger images as well.
								
								// need to keep track of where we are in parsing the PNG.
								//  want to make some more generic stream parsing. Could raise various events like a SAX parser to say it has parsed various things.
								
								// This should help with fast processing of a lot of PNG images.
								
								// data is a buffer, I think.
								
								// do we keep track of the position?
								//  does this get copied into another buffer as well?
								
								// we may need to keep track of data that forms part of a chunk.
								
								// storing an incomplete chunk buffer?
								
								// Possibly read this to a buffer, but really want to process it as we get it.
								//  May need to try this with larger files.
								
								// No real harm in reading to another buffer here?
								//  Or can throw an error if a chunk is not completed.
								
								// Maybe we have all the data.
								
								// we can read through the data and report completed chunks, and add uncompleted chunks to a buffer.
								
								// we can have a look through the data received.
								
								// if it is at the start, we can have a look for the signature, and move past it.
								data.copy(png_buffer, png_pos);
								
								// we are interested in getting the references of objects so they can be read from the buffer that lasts beyond these stream reads.
								//  At a later point it will make more point to read in only particular chunks.
								//  There will be some interesting processing to do regarding video frames at some point.
								// It seems as though node.js will be relatively efficient in various ways.
								//  More direct integration of streams will be very useful too.
								
								// find out if there is more to read from the stream?
								//  A ChunkStreamReader may work...
								data_num++;
							  //writeStream.write(textData);
							});

							// the reading is finished...
							src.on('close', function () {
								// It should have been processing the data recieved.
								
								//writeStream.end(); // ...close up the write, too!
								console.log("src finished.");
							});
							/*
							
							fs.read(fd, png_input_buffer, 0, 30, 0, function(err, num_bytes_read, buffer) {
								if (err) {
									
								} else {
									console.log('buffer === png_input_buffer ' + buffer === png_input_buffer);
									
									// the buffer of pixels that has been read in...
									
									// bytesread... a string I think.
									console.log('num_bytes_read ' + stringify(num_bytes_read));
									
									// and the data should be in the png input buffer.
									
									//  want to read a chunk from the buffer.
									
								}
								
							})
							*/
						}
					})
				}
			});
			
			/*
			
			
			fs.readFile(source_path, function (err, data) {
				if (err) {
					throw err;
				} else {
					//console.log(data);
					
					// Not a very reliable function right now because it assumes gAMA, then PLTE chunk
					//  Want something that parses the stream as it is being read, and also will stop having the stream read when it has the required information.
					//  Stream will have .destroy() called once the palette has been read.
					
					
					// we have the data in the buffer.
					
					// we can read various things from it...
					
					var idx = 0;
					
					var sig_bytes = [];
					sig_bytes.push(data.readUInt8(0));
					sig_bytes.push(data.readUInt8(1));
					sig_bytes.push(data.readUInt8(2));
					sig_bytes.push(data.readUInt8(3));
					sig_bytes.push(data.readUInt8(4));
					sig_bytes.push(data.readUInt8(5));
					sig_bytes.push(data.readUInt8(6));
					sig_bytes.push(data.readUInt8(7));
					
					console.log('sig_bytes ' + stringify(sig_bytes));
					
					var idx_sig = 0;
					
					
					
					// Then byte by byte, it reads through the chunks.
					// get various indexes of the items that occurr within the buffer.
					var chunk_num = 0;
					var chunk_beginning_pos;
					
					var chunk_parts_info = [];
					
					chunk_beginning_pos = 8;
					var chunk_length = data.readUInt32BE(8);
					console.log('chunk_length ' + chunk_length);
					
					//var chunk_type = data.readUInt32BE(12);
					var chunk_type = data.toString('ascii', 12, 16);
					console.log('chunk_type ' + chunk_type);
					
					// IHDR
					
					//   Width:              4 bytes
					//   Height:             4 bytes
					//   Bit depth:          1 byte
					//   Color type:         1 byte
					//   Compression method: 1 byte
					//   Filter method:      1 byte
					//   Interlace method:   1 byte
					
					
					var img_width = data.readUInt32BE(16);
					var img_height = data.readUInt32BE(20);
					
					console.log('img_width ' + img_width);
					console.log('img_height ' + img_height);
					
					var bit_depth = data.readUInt8(24);
					var color_type = data.readUInt8(25);
					var compression_method = data.readUInt8(26);
					var filter_method = data.readUInt8(27);
					var interlace_method = data.readUInt8(28);
					
					console.log('bit_depth ' + bit_depth);
					console.log('color_type ' + color_type);
					console.log('compression_method ' + compression_method);
					console.log('filter_method ' + filter_method);
					console.log('interlace_method ' + interlace_method);
					
					
					var chunk_crc = data.readUInt32BE(29);
					
					console.log('chunk_crc ' + chunk_crc);
					
					// then after that is the next chunk
					//  this may be the first png chunk which we don't know what it is.
					
					// could have a callback that goes through, reading chunks.
					
					// next chunk...
					
					chunk_num++;
					
					// want to do this, going through with callbacks.
					
					// while there is still data in the buffer...
					
					chunk_beginning_pos = chunk_beginning_pos + chunk_length + 12;
					
					// and read on... how do we know when the buffer has finished reading?
					
					// IEND marks the end.
					
					// so can carry on reading until we reach that chunk.
					
					// a chunk reader using a callback system would work really nicely.
					//  At the moment I want to read through it unitil I get to the pallet at least.
					
					var read_chunk = function(beginning_pos) {
						var res = {};
						
						var chunk_length = data.readUInt32BE(beginning_pos);
						console.log('chunk_length ' + chunk_length);
						
						//var chunk_type = data.readUInt32BE(12);
						var chunk_type = data.toString('ascii', beginning_pos + 4, beginning_pos + 8);
						console.log('chunk_type ' + chunk_type);
						
						res.chunk_length = chunk_length;
						res.chunk_type = chunk_type;
						
						// the beginning and the end of the chunk indexes... not sure we need the data itself.
						
						res.idx_data_beginning = beginning_pos + 8;
						res.idx_data_ending = res.idx_data_beginning + chunk_length;
						
						var crc = data.readUInt32BE(res.idx_data_ending);
						
						res.crc = crc;
						
						res.idx_chunk_ending = res.idx_data_ending + 4;
						
						return res;
						
					}
					var next_chunk = read_chunk(chunk_beginning_pos);
					
					console.log('next_chunk ' + stringify(next_chunk));
					
					chunk_beginning_pos = next_chunk.idx_chunk_ending;
					console.log('chunk_beginning_pos ' + chunk_beginning_pos);
					
					next_chunk = read_chunk(chunk_beginning_pos);
					
					console.log('next_chunk ' + stringify(next_chunk));
					
					if (next_chunk.chunk_type == 'PLTE') {
						// it's the pallet.
						//  we'll have more of a look.
						
						var num_colors = next_chunk.chunk_length / 3;
						console.log('num_colors ' + num_colors);
						
						// then parse the individual colors.
						
						var colors = [];
						var c = 0;
						var color_begin_pos = next_chunk.idx_data_beginning;
						while (c < num_colors) {
							// the color is stored as 4 1 byte values.
							//  but the info about color locations could be parsed out?
							//  in this situation, we want the colors from the pallet.
							
							//
							var color = [data.readUInt8(color_begin_pos), data.readUInt8(color_begin_pos + 1), data.readUInt8(color_begin_pos + 2)];
							colors.push(color);
							
							
							color_begin_pos = color_begin_pos + 3;
							
							c++;
						}
						
						console.log('colors ' + stringify(colors));
						callback(null, colors);
					}
				}
			});
			*/
		},
		
		'png_quant': function(source_path, dest_path, num_colors, callback) {
			var command = 'pngquant -f --speed 1 --ext _' + num_colors + 'c_quant.png ' + num_colors + ' "' + source_path + '"';
			console.log('command ' + command);
			exec(command, function(err, stdout) {
				if (err) {
					throw(err)
				} else {
					// we know the destination file name.
					var quant_temp_file_name = source_path.substring(0, source_path.length - 4) + '_' + num_colors + 'c_quant.png';
					fs.rename(quant_temp_file_name, dest_path, function(err, res) {
						if (err) {
							throw err;
						} else {
							console.log('png_quant should have renamed file to ' + dest_path);
							callback(null, true);
						}
					})
				}
			});
		},
		
		'dir_png24_dirs_to_png8_quant_dirs': function(dir_path, num_colors_per_image, callback) {
			// get directories beginning
			fs2.dir_dirs_beginning(dir_path, 'png24_', function(err, png24_dirs) {
				if (err) {
					throw err;
				} else {
					console.log('png24_dirs ' + stringify(png24_dirs));
					// then come up with the function call for quanting each of these.
					
					var fcs = [];
					
					each(png24_dirs, function(i, png24_dir) {
						var full_png24_dir_path = dir_path + dir_separator + png24_dir;
						
						var png8_quant_dir_name = 'png8_' + num_colors_per_image + 'c_quant_' + png24_dir.substring(6);
						
						var full_png8_quant_dir_path = dir_path + dir_separator + png8_quant_dir_name;
						
						console.log('full_png24_dir_path ' + full_png24_dir_path);
						console.log('full_png8_quant_dir_path ' + full_png8_quant_dir_path);
						
						var fc = [fs2.pngquant_directory, [full_png24_dir_path, full_png8_quant_dir_path, num_colors_per_image]]
						fcs.push(fc);
						//var full_png8_quant_path = 
						
					});
					
					call_multiple_callback_functions(fcs, function(err, res) {
						if (err) {
							throw(err);
						} else {
							callback(null, res);
						}
					})
				}
			})
		},
			
		// specifically for png24?
		'dir_svg_dirs_to_png24_dirs': function(dir_path, target_dpi, callback) {
			// The source directories are found within one directory.
			if (isArray(target_dpi)) {
				var fns = [];
				each(target_dpi, function(i, v) {
					fns.push([fs2.dir_svg_dirs_to_png24_dirs, [dir_path, v]]);
				});
				call_multiple_callback_functions(fns, callback);
			} else {
				// get the directory names within this dir.
				
				fs2.dir_contents(dir_path, function(err, dir_contents) {
					if (err) {
						throw err;
					} else {
						console.log('dir_contents ' + stringify(dir_contents));
						var directories = dir_contents.directories;
						var svg_directories = [];
						each(directories, function(i, v) {
							if (v.substr(0, 4) == 'svg_') svg_directories.push(v);
						});
						console.log('svg_directories ' + stringify(svg_directories));
						
						// then with those directories, we sequentially do the png convert.
						
						var fcs = [];
						each(svg_directories, function(i, v) {
							// convert_svg_composites_directory_to_png24s
							// not converting the composites directory...
							//  converting the composites themselves
							//  converting svs to png24
							
							// dir_convert_svgs_to_png24s
							//  converts a directory, treating the directory as a container of the related items, naming directories according to a scheme.
							// convert_svgs_directory_to_png24s_directory
							//  sourcedir, destdir, target_dpi, callback
							
							// come up with the name for the png directory
							
							var svg_dir_name_without_prefix = v.substr(4);
							var png24_dir_name = 'png24_' + target_dpi + 'dpi_' + svg_dir_name_without_prefix;
							
							// come up with the full dir path
							
							var full_svg_dir_path = dir_path + dir_separator + v;
							var full_png24_dir_path = dir_path + dir_separator + png24_dir_name;
							
							console.log('full_svg_dir_path ' + full_svg_dir_path);
							console.log('full_png24_dir_path ' + full_png24_dir_path);
							
							// then these paths can be used to create the conversion function calls
							
							var fc = [fs2.convert_svgs_directory_to_png24s_directory, [full_svg_dir_path, full_png24_dir_path, target_dpi]];
							fcs.push(fc);
							//var fc = []
							
						})
						
						call_multiple_callback_functions(fcs, function(err, res) {
							if (err) {
								throw(err);
							} else {
								callback(null, res);
							}
						})
					}
				})
			}
		},
		
		// for a directory of svgs with composite components.
			
		'dir_extract_svg_composite_components': function(source_dir_path, dest_dir_path, callback) {
			// get all the svgs in the source dir
			// the dest dir will be created based on the source?
			// ensure the dest dir exists
			
			fs2.ensure_directory_exists(dest_dir_path, function(err, res) {
				if (err) {
					throw(err);
				} else {
					// it exists
					fs2.dir_files_by_extension(source_dir_path, '.svg', function(err, svg_files) {
						if (err) {
							
						} else {
							//console.log('svg_files ' + svg_files);
							// then with the svg files, we convert them.
							
							var full_file_paths = [];
							// likely to use some kind of multiple process spawning.
							//  may need to limit ongoing conversion processes somehow.
							//  Could have some kind of conversions broker, it's careful to only have 8 conversion processes going on at once maybe.
							
							each(svg_files, function(i, v) {
								var full_path = source_dir_path + dir_separator + v;
								full_file_paths.push(full_path);
							});
							
							// extract the data from the SVGs... 
							//console.log('full_file_paths ' + stringify(full_file_paths));
							
							// then with those full file paths we carry out multiple extractions of the individual SVG files.
							//  create a directory for each of them, in sequence.
							//  could make a command_tree that gets executed, some things simultaneously.
							// want to build up the sequential / parallel function calls
							
							var fn_calls = [];
							
							each(full_file_paths, function(i, full_file_path) {
								fn_calls.push([fs2.extract_svg_composite_components, [full_file_path]]);
								
							});
							//console.log('pre call_multiple_callback_functions');
							call_multiple_callback_functions(fn_calls, function(err, res) {
								if (err) {
									throw(err);
								} else {
									//console.log('call_multiple_callback_functions complete res ' + stringify(res));
									
									// then go through the newly created directories / the files,
									//  and create versions of them as png 24s all in their own new directories.
									
									// I suppose find out which directories the files have got output to.
									
									// Then create the new PNG output directories.
									
									var map_output_svgs_by_directory = {};
									
									var res2 = [];
									each(res, function(i, v) {
										each(v, function(i, v2) {
											res2.push(v2);
										})
									});
									
									each(res2, function(i, svg_output_path) {
										// find the directory it was output to.
										
										var directory_path = npath.dirname(svg_output_path);
										//console.log('');
										//console.log('directory_path ' + directory_path);
										map_output_svgs_by_directory[directory_path] = map_output_svgs_by_directory[directory_path] || [];
										map_output_svgs_by_directory[directory_path].push(svg_output_path);
										
									})
									//console.log('map_output_svgs_by_directory ' + stringify(map_output_svgs_by_directory));
									
									// then go through that directory map... we'll be creating new versions of the directory / files in the directory.
									
									// create the function calls that are to be executed.
									
									callback(null, map_output_svgs_by_directory);
								}
							});
						}
					})
				}
			})
		},
		
		
		'svg_extract_root_groups': function(source_path, callback) {
			// could have more convenient code for modifying XML.
			
			fs.readFile(source_path, function (err, data) {
				if (err) {
					throw err;
				} else {
					//console.log(data);
					var str_svg = data.toString();
					//console.log('str_svg ' + str_svg);
					
					// Parse the SVG as XML.
					
					var baseName = path.basename(source_path, '.svg');
					var xmlDoc = libxmljs.parseXml(str_svg);
					var orig_svg_attrs = xmlDoc.root().attrs();
					/*
					var recursive_traversal = function(xml, el_callback) {
						if (xml.root) {
							// it's an xml document
							
							//console.log('document ');
							var root = xml.root();
							recursive_traversal(root, el_callback);
							
						} else {
							if (xml.attrs) {
								// it's an element
								el_callback(xml);
								
								//var name = xml.name();
								//console.log('name ' + name);
								
								var cns = xml.childNodes();
								each(cns, function(i, v) {
									recursive_traversal(v, el_callback);
								});
							}
						}
					};
					
					var get_elements_with_ids = function(xml) {
						var res = [];
						
						recursive_traversal(xml, function(el) {
							var attr_id = el.attr('id');
							if (attr_id) {
								var id = attr_id.value();
								//console.log('id ' + id);
								res.push(el);
							}
							
						});
						return res;
					}
					
					var els_with_ids = get_elements_with_ids(xmlDoc);
					*/
					
					// Just go through the svg doc and get the groups (<g>...</g> elements) from the root SVG node.
					
					
					var root_groups = [];
					
					var cns = xmlDoc.root().childNodes();
					each(cns, function(i, v) {
						//recursive_traversal(v, el_callback);
						if (v.name() == 'g') {
							root_groups.push(v);
						}
					});
					
					// then for each of them, build and save a new XML document.
					// will create and save the resulting xml docs.
					
					var res_xml_docs = [];
					var ids = [];
					
					each(root_groups, function(i, el) {
						// don't get elements with IDs. 
						//  just look at the group elements that are within the document root.
						//   Perhaps run something that retrieves all the results of an XQuery or XPath query.
						//var id = el.attr('id').value();
							// adobe_illustrator_pgf.svg
						if (true) {
							var new_svg_doc = new libxmljs.Document('1.0', 'utf-8');
							new_svg_doc.node('svg', '');
							var root = new_svg_doc.root();
							
							each(orig_svg_attrs, function(i, orig_attr) {
								//root.attr(new libxmljs.Attribute(root, orig_attr.name(), orig_attr.value()));
								//root.attr(orig_attr);
								
								var h_attr = {};
								h_attr[orig_attr.name()] = orig_attr.value();
								root.attr(h_attr);
							});
							
							root.addChild(el);
							res_xml_docs.push(new_svg_doc);
							//ids.push(id);
						}
						//console.log('');
						//console.log('new_svg_doc.toString() ' + new_svg_doc.toString());
					});
					
					// Could go through the SVGs, adjusting co-ordinates so that they are moved back to the top left.
					//  However, could use a trim command on a bitmap for the moment.
					//  Moving the SVGs back will be more efficient, and I'll do it.
					
					// then sequentially save all the SVG files.
					
					var svg_count = res_xml_docs.length;
					var num_remaining = svg_count;
					var c = 0;
					
					// possibly create a new directory for all the saved objects.
					//  will possibly create a single ZIP file.
					
					// means getting the original filename without an extension and creating the new directory.
					
					//console.log('baseName ' + baseName);
					var dirname = path.dirname(source_path);
					var dir_path = dirname + dir_separator + 'svg_' + baseName;
					
					//console.log('dir_path ' + dir_path);
					// so check if there is a directory with that name there.
					
					// check if the directory exists...
					
					var save_to_dir = function() {
						var new_files = [];
						//var c = 0;
						var process_next = function() {
							var doc = res_xml_docs[c];
							//var id = ids[c];
							
							var fileName = c + '.svg';
							c++;
							// and the full file path.
							
							var full_file_path = dir_path + dir_separator + fileName;
							//console.log('full_file_path ' + full_file_path);
							
							// it does not do the document properly.
							
							var new_doc = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
							new_doc = new_doc + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1280px" height="800px" viewBox="0 0 1280 800" enable-background="new 0 0 1280 800" xml:space="preserve">';
							
							new_doc = new_doc + doc.root().toString();
							new_doc = new_doc + '</svg>';
							
							fs.writeFile(full_file_path, new_doc, function (err) {
								if (err) {
									throw err;
								} else {
									//console.log('It\'s saved!');
									num_remaining--;
									new_files.push(full_file_path);
									
									if (num_remaining > 0) {
										process_next();
									} else {
										// could do the callback with the names of new files.
										callback(null, new_files);
									}
								}
							});
						}
						process_next();
					}
					
					fs.exists(dir_path, function (exists) {
						if (exists) {
							save_to_dir();
						} else {
							fs.mkdir(dir_path, function(err) {
								if (err) {
									throw err;
								} else {
									save_to_dir();
								}
							})
						}
					})
				}
			});
		},
		
		
		'svg_component_names_and_colors': function(source_path, callback) {
			// This will be useful for grouping images with the same or similar colors on spritesheets.
			
			fs.readFile(source_path, function (err, data) {
				if (err) {
					throw err;
				} else {
					var str_svg = data.toString();
					var baseName = path.basename(source_path, '.svg')
					var xmlDoc = libxmljs.parseXml(str_svg);
					var orig_svg_attrs = xmlDoc.root().attrs();
					
					var get_elements_with_ids = function(xml) {
						var res = [];
						recursive_xml_traversal(xml, function(el) {
							var attr_id = el.attr('id');
							if (attr_id) {
								var id = attr_id.value();
								//console.log('id ' + id);
								res.push(el);
							}
							
						});
						return res;
					}
					
					var els_with_ids = get_elements_with_ids(xmlDoc);
					
					// then for each of the elements, we recursively traverse for colors.
					//  and collect the component colors.
					var res = [];
					
					each(els_with_ids, function(i, el_with_id) {
						// stroke, fill
						
						var attr_id = el_with_id.attr('id');
						var id = attr_id.value();
						
						if (id != 'adobe_illustrator_pgf') {
							

							var component_colors_map = {};
							var arr_component_colors = [];
							
							recursive_xml_traversal(el_with_id, function(el) {
								var attr_stroke = el.attr('stroke');
								var attr_fill = el.attr('fill');
								
								if (attr_stroke) {
									var stroke = attr_stroke.value();
									if (stroke !== 'none'){
										component_colors_map[stroke] = true;
									}
									
								}
								if (attr_fill) {
									var fill = attr_fill.value();
									if (fill !== 'none') {
										component_colors_map[fill] = true;
									}
									
								}
							});
							
							each(component_colors_map, function(color) {
								arr_component_colors.push(color);
							});
							
							if (arr_component_colors.length > 0) {
								res.push([id, arr_component_colors]);
							}
							
							
							
						}
						
						
						
						
						//res.colors = 
						
					});
					
					
					// probably should not be needed?
					//  The caller should be able to optionally give the params.
					
					callback(null, [source_path, res]);
				}
			});
			
		},
		
		// want to extract the border image from a file.
		// this currently just extracts items with IDs.
		
		'svg_component_names': function(source_path, callback) {
			// Best to use an XPath query.
			// Get all items in the root which have IDs.
			
			fs.readFile(source_path, function (err, data) {
				if (err) {
					throw err;
				} else {
					var str_svg = data.toString();
					var baseName = path.basename(source_path, '.svg')
					var xmlDoc = libxmljs.parseXml(str_svg);
					var orig_svg_attrs = xmlDoc.root().attrs();
					
					var get_element_ids = function(xml) {
						var res = [];
						recursive_xml_traversal(xml, function(el) {
							var attr_id = el.attr('id');
							if (attr_id) {
								var id = attr_id.value();
								//console.log('id ' + id);
								if (id != 'adobe_illustrator_pgf') {
									res.push(id);
								}
							}
						});
						return res;
					}
					// Could use XPath here instead.
					var ids = get_element_ids(xmlDoc);
					// probably should not be needed?
					//  The caller should be able to optionally give the params.
					
					callback(null, [source_path, ids]);
				}
			});
		},
			
		'extract_svg_composite_components': function(source_path, callback) {
			// automatically creates a directory named after the composite file.
			fs.readFile(source_path, function (err, data) {
				if (err) {
					throw err;
				} else {
					//console.log(data);
					var str_svg = data.toString();
					//console.log('str_svg ' + str_svg);
					// Parse the SVG as XML.
					var baseName = path.basename(source_path, '.svg')
					var xmlDoc = libxmljs.parseXml(str_svg);
					var orig_svg_attrs = xmlDoc.root().attrs();
					
					
					var get_elements_with_ids = function(xml) {
						var res = [];
						recursive_traversal(xml, function(el) {
							var attr_id = el.attr('id');
							if (attr_id) {
								var id = attr_id.value();
								//console.log('id ' + id);
								res.push(el);
							}
							
						});
						return res;
					}
					// look for the root elements with IDs.
					var els_with_ids = get_elements_with_ids(xmlDoc);
					
					// then for each of them, build and save a new XML document.
					// will create and save the resulting xml docs.
					
					var res_xml_docs = [];
					var ids = [];
					
					each(els_with_ids, function(i, el) {
						var id = el.attr('id').value();
							// adobe_illustrator_pgf.svg
						if (id != 'adobe_illustrator_pgf') {
							var new_svg_doc = new libxmljs.Document('1.0', 'utf-8');
							new_svg_doc.node('svg', '');
							var root = new_svg_doc.root();
							
							each(orig_svg_attrs, function(i, orig_attr) {
								//root.attr(new libxmljs.Attribute(root, orig_attr.name(), orig_attr.value()));
								//root.attr(orig_attr);
								var h_attr = {};
								h_attr[orig_attr.name()] = orig_attr.value();
								root.attr(h_attr);
							});
							
							root.addChild(el);
							res_xml_docs.push(new_svg_doc);
							ids.push(id);
						}
						//console.log('');
						//console.log('new_svg_doc.toString() ' + new_svg_doc.toString());
					});
					
					
					// Could go through the SVGs, adjusting co-ordinates so that they are moved back to the top left.
					//  However, could use a trim command on a bitmap for the moment.
					//  Moving the SVGs back will be more efficient, and I'll do it.
					
					// then sequentially save all the SVG files.
					
					var svg_count = res_xml_docs.length;
					var num_remaining = svg_count;
					var c = 0;
					
					// possibly create a new directory for all the saved objects.
					//  will possibly create a single ZIP file.
					// means getting the original filename without an extension and creating the new directory.
					//console.log('baseName ' + baseName);
					var dirname = path.dirname(source_path);
					var dir_path = dirname + dir_separator + 'svg_' + baseName;
					
					//console.log('dir_path ' + dir_path);
					// so check if there is a directory with that name there.
					
					// check if the directory exists...
					
					var save_to_dir = function() {
						
						var new_files = [];
						
						var process_next = function() {
							var doc = res_xml_docs[c];
							var id = ids[c];
							c++;
							var fileName = id + '.svg';
							
							// and the full file path.
							
							var full_file_path = dir_path + dir_separator + fileName;
							//console.log('full_file_path ' + full_file_path);
							
							// it does not do the document properly.
							
							var new_doc = '<?xml version="1.0" encoding="utf-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
							new_doc = new_doc + '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1280px" height="800px" viewBox="0 0 1280 800" enable-background="new 0 0 1280 800" xml:space="preserve">';
							
							new_doc = new_doc + doc.root().toString();
							new_doc = new_doc + '</svg>';
							
							fs.writeFile(full_file_path, new_doc, function (err) {
								if (err) {
									throw err;
								} else {
									//console.log('It\'s saved!');
									num_remaining--;
									new_files.push(full_file_path);
									
									if (num_remaining > 0) {
										process_next();
									} else {
										// could do the callback with the names of new files.
										callback(null, new_files);
									}
								}
							});
						}
						process_next();
					}
					
					fs.exists(dir_path, function (exists) {
						if (exists) {
							save_to_dir();
						} else {
							fs.mkdir(dir_path, function(err) {
								if (err) {
									throw err;
								} else {
									save_to_dir();
								}
							})
						}
					})
					
					// Another task will be to create bitmap renderings of SVG images.
					//  Better to save them as PNGs because of transparancy.
				}
				
			});
		},
			
		'convert_svg_composites_directory_to_png24s': function(path, dest_dpi, callback) {
			fs2.dir_files_by_extension(path, '.svg', function(err, svg_files) {
				if (err) {
					
				} else {
					console.log('svg_files ' + svg_files);
					
					// then with the svg files, we convert them.
					
					var full_file_paths = [];
					// likely to use some kind of multiple process spawning.
					//  may need to limit ongoing conversion processes somehow.
					//  Could have some kind of conversions broker, it's careful to only have 8 conversion processes going on at once maybe.
					
					
					
					
					each(svg_files, function(i, v) {
						var full_path = path + dir_separator + v;
						full_file_paths.push(full_path);
					});
					
					
					// extract the data from the SVGs... 
					console.log('full_file_paths ' + stringify(full_file_paths));
					
					
					// then with those full file paths we carry out multiple extractions of the individual SVG files.
					//  create a directory for each of them, in sequence.
					//  could make a command_tree that gets executed, some things simultaneously.
					
					
					// want to build up the sequential / parallel function calls
					
					var fn_calls = [];
					
					each(full_file_paths, function(i, full_file_path) {
						fn_calls.push([fs2.extract_svg_composite_components, [full_file_path]]);
						
					});
					//console.log('pre call_multiple_callback_functions');
					call_multiple_callback_functions(fn_calls, function(err, res) {
						if (err) {
							throw(err);
						} else {
							//console.log('call_multiple_callback_functions complete res ' + stringify(res));
							
							// then go through the newly created directories / the files,
							//  and create versions of them as png 24s all in their own new directories.
							
							// I suppose find out which directories the files have got output to.
							
							// Then create the new PNG output directories.
							
							var map_output_svgs_by_directory = {};
							
							var res2 = [];
							each(res, function(i, v) {
								each(v, function(i, v2) {
									res2.push(v2);
								})
								
								
							});
							
							each(res2, function(i, svg_output_path) {
								
								// find the directory it was output to.
								
								var directory_path = npath.dirname(svg_output_path);
								//console.log('');
								//console.log('directory_path ' + directory_path);
								map_output_svgs_by_directory[directory_path] = map_output_svgs_by_directory[directory_path] || [];
								map_output_svgs_by_directory[directory_path].push(svg_output_path);
								
								
								
							})
							//console.log('map_output_svgs_by_directory ' + stringify(map_output_svgs_by_directory));
							
							// then go through that directory map... we'll be creating new versions of the directory / files in the directory.
							
							// create the function calls that are to be executed.
							
							var fn_calls = [];
							
							each(map_output_svgs_by_directory, function(dir_path, files) {
								//console.log('dir_path ' + dir_path);
								
								// need to create a new version of the dir_path, with it saying png24_, not svg_
								var split_dir_path = dir_path.split(dir_separator);
								var new_dir_path = '';
								if (split_dir_path[split_dir_path.length - 1].substring(0, 4) == 'svg_') {
									var new_sdp = split_dir_path.slice(0);
									
									// dest_dpi
									
									//new_sdp[new_sdp.length - 1] = 'png24_288dpi_' + new_sdp[new_sdp.length - 1].substring(4);
									new_sdp[new_sdp.length - 1] = 'png24_' + dest_dpi + 'dpi_' + new_sdp[new_sdp.length - 1].substring(4);
									
									
									new_dir_path = new_sdp.join(dir_separator);
								}
								if (new_dir_path.length > 0) {
									// add the fn calls
									//console.log('new_dir_path ' + new_dir_path);
									
									var fn_call = [fs2.convert_svgs_directory_to_png24s_directory, [dir_path, new_dir_path, dest_dpi]];
									fn_calls.push(fn_call);
								} else {
									throw 'Need to specify the target directory, more needs to be coded';
								}
								
								
							});
							
							call_multiple_callback_functions(fn_calls, function(err, res) {
								if (err) {
									throw err;
								} else {
									//console.log('dir conversions callback res ' + stringify(res));
									callback(null, res);
								}
							});
						}
					});
					
					
					// carry out extract_svg_composite_components on each of them
					
					// another way of doing the sequential / parallel function calls would be nice.
					//  without modifying the function... calling a function that handles the calling of the simpler single callback function.
					
					/*
					// then assemble them into commands to call. That will be a good way of doing multiple calls to programs at once.
					var fs_commands = [];
					
					each(full_file_paths, function(i, v) {
						var pos1 = v.lastIndexOf('.');
						var without_ext = v.substr(0, pos1);
						console.log(without_ext);
						
						var new_full_file_path = without_ext + '.png';
						
						// -density 144
						
						//var command = 'convert -background none -resize 400% "' + v + '" "' + new_full_file_path + '"';
						var command = 'convert -background none -density 144 -trim "' + v + '" "' + new_full_file_path + '"';
						fs_commands.push(command);
					});
					
					console.log('fs_commands ' + stringify(fs_commands));
					
					// and then we will call a sequential_execute_fs_child_processes function
					//  can do it one at a time, may make a multithreaded version too.
					
					sequential_execute_fs_child_processes(fs_commands, function(err, res) {
						if (err) {
							
						} else {
							console.log('have run the convert commands.');
						}
					})
					*/
				}
				
			})
			
		},
		
		// may take the name of the spritesheet directory?
		'png_directory_to_spritesheet': function(dir_path, callback) {
			// will put the spritesheet in the parent directory.
			//  like when a directory is zipped. Directories will be dealt with as entities in their own right much of the time.
			console.log('');
			console.log('png_directory_to_spritesheet dir_path ' + dir_path);
			// get the paths of all the PNG files.

			
			fs2.dir_files_by_extension(dir_path, '.png', function(err, png_files) {
				if (err) {
					
				} else {
					console.log('png_files ' + png_files);
					
					// then with the svg files, we convert them.
					
					var full_file_paths = [];
					// likely to use some kind of multiple process spawning.
					//  may need to limit ongoing conversion processes somehow.
					//  Could have some kind of conversions broker, it's careful to only have 8 conversion processes going on at once maybe.
					
					var html = "";

					each(png_files, function(i, v) {
						var full_path = dir_path + dir_separator + v;
						full_file_paths.push(full_path);
						html += "<div class='.sprite " + v.substring(0,v.lastIndexOf('.')) + "' ></div>\r\n";
					});
					
					
					/*fs.writeFile(dir_path + dir_separator + "index.html", html, function(err) {
					    if (err) {
					        console.log(err);
					    } else {
					        console.log(dir_path + dir_separator + "index.html saved!");
					    }
					});*/ 

					// extract the data from the SVGs... 
					console.log('full_file_paths ' + stringify(full_file_paths));
					
					// and then assemble the commands that will be executed.
					
					//var fs_commands = [];
					
					// pngquant -f --speed 1 --ext _64c_quant.png 64 pepperdew_sweet_peppers.png
					
					// the output location...
					//var output_image_loc = dir_path + dir_separator + 'sprite.png';
					//var output_css_loc = dir_path + dir_separator + 'sprite.css';
					var output_image_loc = 'sprite.png';
					var output_css_loc = 'sprite.css';
					
					console.log('output_image_loc ' + output_image_loc);
					
					var Builder = node_spritesheet.Builder;
					
					var imageArr = [];
					var b = new Builder( full_file_paths, imageArr, {
						outputDirectory: dir_path,
					    outputImage: output_image_loc,
					    outputCss: output_css_loc,
					    selector: '.sprite'
					} );
					b.build( function() {
						console.log('builder callback');
						//console.log('imageArr ' + stringify(imageArr));
						callback(null, imageArr);
					} );
				}
			})
		},
		'pngs_spritesheet': function(sprite_name, file_paths, output_path, callback){

			//var output_image_loc = output_path + dir_separator + sprite_name + '.png';
			//var output_css_loc = output_path + dir_separator + sprite_name + '.css';
			var output_image_loc = sprite_name + '.png';
			var output_css_loc = sprite_name + '.css';
								
			var Builder = node_spritesheet.Builder;
			
			var imageArr = [];
			console.log('');
			//console.log('file_paths ' + stringify(file_paths));
			console.log('output_path ' + output_path);
			//console.log('output_image_loc ' + output_image_loc);
			//console.log('output_css_loc ' + output_css_loc);
			each(file_paths, function(i, v) {
				console.log('v ' + v);
			});
			//throw 'stop';
			
			var b = new Builder( file_paths, imageArr, {
				outputDirectory: output_path,
			    outputImage: output_image_loc,
			    outputCss: output_css_loc,
			    selector: '.' + sprite_name
			} );
			b.build( function() {
				console.log('spritesheet build callback');
				console.log('imageArr ' + stringify(imageArr));
				
				//throw 'stop';
				callback(null, imageArr);
			} );

		},		
		'ensure_directory_exists': function(dir_path, callback) {
			fs.exists(dir_path, function(exists) {
				if (exists) {
					callback(null, true);
				} else {
					// Maybe go backwards recursively and make sure parents exist.
					fs.mkdir(dir_path, function(err) {
						if (err) {
							throw(err);
						} else {
							callback(null, true);
						}
					})
				}
			})
		},
		
		'pngquant_directory': function(source_dir_path, target_dir_path, num_colors_per_image, callback) {
			// applies pngquant to each item in that directory, and saves it to 
			
			// builds up the list of fs commands which get executed.
			
			fs2.ensure_directory_exists(target_dir_path, function(err, exists) {
				if (err){
					throw err;
				} else {
					// assemble the list of convert commands.
					
					// get the list of svgs in the source directory.
					fs2.dir_files_by_extension(source_dir_path, '.png', function(err, png_files) {
						if (err) {
							throw err;
						} else {
							var fs_commands = [];
							var map_source_dest = {};
							
							each(png_files, function(i, png_file) {
								// create the fs command.
								//var command = 'convert '
								console.log('png_file ' + png_file);
								
								var png_file_path = source_dir_path + dir_separator + png_file;
								console.log('png_file_path ' + png_file_path);
								
								var basename = npath.basename(png_file_path, '.png');
								var dest_png_file_path = target_dir_path + dir_separator + basename + '.png';
								
								map_source_dest[png_file_path] = dest_png_file_path;
								console.log('');
								console.log('map_source_dest ' + stringify(map_source_dest));
								// hopefully we can find the input density of the image.
								//  may be tricky with imagemagick not understanding the input densities... may work with resize as well.
								
								//var scale = target_image_density / source_image_density;
								//var str_scale_pct = (scale * 100) + '%';
								
								// may need to move from the new location?
								
								var command = 'pngquant -f --speed 1 --ext _' + num_colors_per_image + 'c_quant.png ' + num_colors_per_image + ' "' + png_file_path + '"';
								
								//var command = 'convert -units PixelsPerInch -background none -density ' + source_image_density + ' -resize ' + str_scale_pct + ' "' + png_file_path + '" +profile "8bim" "' + dest_png_file_path + '"';
								fs_commands.push(command);
							});
							
							// sequentially / parallel execute of commands.
							
							console.log('fs_commands ' + stringify(fs_commands));
							sequential_execute_fs_child_processes(fs_commands, function(err, res) {
								if (err) {
									throw err;
								} else {
									console.log('convert_rescale_png_directory_to_png_directory conversion of files complete.');
									// could keep track of the files that have been converted.
									console.log('conversion res ' + stringify(res));
									console.log('map_source_dest ' + stringify(map_source_dest));
									
									// work out the names of the actual newly quantified files
									//  will be based on the source file name
									var fcs = [];
									each(map_source_dest, function(source_file_path, dest_file_path) {
										
										// need to do more work to calculate the temp quant file path (annoying that pngquant does not give the file location choice).
										console.log('source_file_path ' + source_file_path);
										var source_dir_name = npath.dirname(source_file_path);
										// then get the last part.
										var pos1 = source_dir_name.lastIndexOf(dir_separator);
										var source_top_dir_name = source_dir_name.substr(pos1 + 1);
										console.log('source_top_dir_name ' + source_top_dir_name);
										
										// then 
										
										
										var temp_quant_file_path = source_file_path.substr(0, source_file_path.length - 4) + '_' + num_colors_per_image + 'c_quant.png';
										console.log('temp_quant_file_path ' + temp_quant_file_path);
										var fc = [fs.rename, [temp_quant_file_path, dest_file_path]];
										fcs.push(fc);
									})
									call_multiple_callback_functions(fcs, function(err, res) {
										if (err) {
											
										} else {
											//console.log('res ' + stringify(res));
											// may as well return the result or the directory name.
											
											callback(null, target_dir_path);
										}
									});
									
									
									
									// then we need to move all of the new files which have that new suffix extension and have just been written.
									
									// then need to move the files sequentially.
									/*
									
									
									var arr_source_files = [];
									each(map_source_dest, function(i, v) {
										arr_source_files.push(i);
									});
									//each(arr_source_files, function(i, v) {
										
									//});
									
									
									each(arr_source_files, function(i, v) {
									
									
										var fc = [fs.rename, [v, map_source_dest[v]]];
										fcs.push(fc);
									});
									
									call_multiple_callback_functions(fcs, function(err, res) {
										if (err) {
											
										} else {
											console.log('res ' + stringify(res));
											callback(null, true);
										}
									});
									
									*/
									
								}
							})
						}
					})
				}
			})
			
			
		},
		
		// dir_png_to_resized_dir_pngs
		// dir_png_resize_to_multi_dpi_path
		
		// may be creating multiple directories at the destination at different DPIs.
		
		'dir_png_resize_to_multi_dpi_path': function(dir_source_path, source_dpi, target_dir_path, target_dpi, callback) {
			// Get the files at the source.
			fs2.dir_contents(dir_source_path, function(err, dir_contents) {
				// then for every PNG file.
				
				
				
				var png_files = [];
				each(dir_contents.files, function(i, file_name) {
					if (path.extname(file_name) == '.png') {
						png_files.push(file_name);
					}
					
				})
				console.log('png_files ' + stringify(png_files));
				
				// then compress them to the destination locations.
				//  will not use the child processes here, but will call fs2 functions to do the resize.
				
				// carry out the command resize on each of them - build up the array of functions to call to do the resize.
				
				// if it's just one target density, or multiple
				
				// create the target density paths.
				console.log('target_dpi ' + stringify(target_dpi));
				if (tof(target_dpi) == 'array') {
					// create a bunch of functions to call to create the directories.
					var fns = [];
					each(target_dpi, function(i, v) {
						var target_density_dir_name = target_dir_path + dir_separator + v + 'dpi';
						console.log('target_density_dir_name ' + target_density_dir_name);
						fns.push([fs.mkdir, [target_density_dir_name]])
					})
					call_multiple_callback_functions(fns, function(err, res) {
						if (err) {
							throw err;
						} else {
							console.log('dirs made');
							// create the various image resizing functions.
							
							var fns = [];
							each(target_dpi, function(i, v) {
								var target_density_dir_name = target_dir_path + dir_separator + v + 'dpi';
								
								// for each png file in the source directory, make the resize command.
								each(png_files, function(i, png_file) {
									var source_png = dir_source_path + dir_separator + png_file;
									var dest_png = target_density_dir_name + dir_separator + png_file;
									
									var fn = [fs2.png_resize, [source_png, source_dpi, dest_png, v]];
									fns.push(fn);
									
								});
								
								
								//fns.push([fs.mkdir, [target_density_dir_name]])
							})
							call_multiple_callback_functions(fns, function(err, resize_images_res) {
								if (err) {
									throw err;
								} else {
									console.log('resize_images_res ' + stringify(resize_images_res));
									callback(null, resize_images_res);
								}
							})
							
							
						}
					})
				};
				if (tof(target_dpi) == 'number') {
					// create the single target density directory.
					
					var target_density_dir_name = target_dir_path + dir_separator + target_dpi + 'dpi';
					fs.mkdir(target_density_dir_name, function(err, res) {
						if(err) {
							throw err;
						} else {
							var fns = [];
							//var target_density_dir_name = target_dir_path + dir_separator + v + 'dpi';
							
							// for each png file in the source directory, make the resize command.
							each(png_files, function(i, png_file) {
								var source_png = dir_source_path + dir_separator + png_file;
								var dest_png = target_density_dir_name + dir_separator + png_file;
								
								var fn = [fs2.png_resize, [source_png, source_dpi, dest_png, target_dpi]];
								fns.push(fn);
								
							});
							call_multiple_callback_functions(fns, function(err, resize_images_res) {
								if (err) {
									throw err;
								} else {
									console.log('resize_images_res ' + stringify(resize_images_res));
									callback(null, resize_images_res);
								}
							})
						}
					})
					
				};
			});
			
			
			// Ensure the destination directories at the target densities.
			
			
		},
		
		'png_resize': function(source_path, source_dpi, dest_path, dest_dpi, callback) {
			// needs the source dpi as input for the moment because we are not able to save / access this properly as metadata through ImageMagick.
			//  will do more programming on PNGs and their correct DPIs.
			
			var scale = 1;
			//console.log('dest_dpi ' + dest_dpi);
			//console.log('source_dpi ' + source_dpi);
			if (dest_dpi != source_dpi) {
				scale = dest_dpi / source_dpi;
			}
			
			//var 
			
			
			var str_scale_pct = (scale * 100) + '%';
			
			var command = 'convert -units PixelsPerInch -background none -density ' + source_dpi + ' -resize ' + str_scale_pct + ' "' + source_path + '" +profile "8bim" "' + dest_path + '"';
			
			exec(command, function(err, command_res) {
				if (err) {
					throw(err);
				} else {
					callback(null, true);
				}
			})
			
		},
		
		// resize individual PNG commands.
		
		// will also have commands to read and write PNG metadata.
		
		
		
		
		
		// convert_rescale_png_directory_to_png_directory
		'convert_rescale_png_directory_to_png_directory': function(source_dir_path, source_image_density, target_dir_path, target_image_density, callback) {
			// get the file list of every png in the source dir
			
			
			fs2.ensure_directory_exists(target_dir_path, function(err, exists) {
				if (err){
					throw err;
				} else {
					// assemble the list of convert commands.
					
					// get the list of svgs in the source directory.
					fs2.dir_files_by_extension(source_dir_path, '.png', function(err, png_files) {
						if (err) {
							throw err;
						} else {
							var fs_commands = [];
							each(png_files, function(i, png_file) {
								// create the fs command.
								//var command = 'convert '
								console.log('png_file ' + png_file);
								
								var png_file_path = source_dir_path + dir_separator + png_file;
								console.log('png_file_path ' + png_file_path);
								
								var basename = npath.basename(png_file_path, '.png');
								var dest_png_file_path = target_dir_path + dir_separator + basename + '.png';
								
								// hopefully we can find the input density of the image.
								//  may be tricky with imagemagick not understanding the input densities... may work with resize as well.
								
								var scale = target_image_density / source_image_density;
								var str_scale_pct = (scale * 100) + '%';
								
								var command = 'convert -units PixelsPerInch -background none -density ' + source_image_density + ' -resize ' + str_scale_pct + ' "' + png_file_path + '" +profile "8bim" "' + dest_png_file_path + '"';
								fs_commands.push(command);
								
								/*
								if (svg_file != 'adobe_illustrator_pgf.svg') {

									var svg_file_path = source_dir_path + dir_separator + svg_file;
									console.log('svg_file_path ' + svg_file_path);
									
									var basename = npath.basename(svg_file_path, '.svg');
									
									var png24_file_path = target_dir_path + dir_separator + basename + '.png';
									// var command = 'convert -background none -density 144 -trim "' + v + '" "' + new_full_file_path + '"';
									// -units PixelsPerInch
									// +profile "8bim"
									//var command = 'convert -background none -density 288 -trim "' + svg_file_path + '" "' + png24_file_path + '"';
									var command = 'convert -units PixelsPerInch -background none -density 288 -trim "' + svg_file_path + '" +profile "8bim" "' + png24_file_path + '"';
									fs_commands.push(command);
								}
								*/
							});
							
							// sequentially / parallel execute of commands.
							
							console.log('fs_commands ' + stringify(fs_commands));
							sequential_execute_fs_child_processes(fs_commands, function(err, res) {
								if (err) {
									throw err;
								} else {
									console.log('convert_rescale_png_directory_to_png_directory conversion of files complete.');
									// could keep track of the files that have been converted.
									console.log('conversion res ' + stringify(res));
									
									callback(null, true);
								}
							})
						}
					})
				}
			});
		},
		// could use an arrayify function for functions with callbacks.
		'dir_ensure': function(dir_path, callback) {
			if (tof(dir_path) == 'array') {
				var fns = [];
				each(dir_path, function(i, v) {
					fns.push([fs2.dir_ensure, [v]]);
				});
				call_multiple_callback_functions(fns, callback)
			} else {
				fs.exists(dir_path, function(exists) {
					if (exists) {
						callback(null, dir_path);
					} else {
						fs.mkdir(dir_path, function(err, res) {
							if (err) {
								throw err;
							} else {
								callback(null, dir_path);
							}
						})
					}
				});
			}
		},
		
		// xml load
		//  returns something that uses an XML API.
		
		'read_file_string': function(file_path, callback) {
			fs.readFile(file_path, function (err, data) {
				if (err) {
					var stack = new Error().stack;
					console.log(stack);
					
					console.log('error read_file_string file_path: ' + file_path);
					
					
				
					throw err;
				} else {
					//console.log(data);
					var res = data.toString();
					callback(null, res);
				}
			});
			
		},
		
		'xml_load_xmldom': function(xml_source_path, callback) {
			fs2.read_file_string(xml_source_path, function(err, str_xml) {
				if (err) {
					throw err;
				} else {
					var DOMParser = xmldom.DOMParser;
					var doc = new DOMParser().parseFromString(str_xml, 'text/xml');
					callback(null, doc);
					
					
				}
			});
		},
		
		'svg_extract_component': fp(function(a, sig) {
			// could also make this take a parameter for a destination (new) SVG document.
			
			// svg_source_path, component_name, svg_dest_path, callback
			if (sig == '[s,s,s,f]') {
				var svg_source_path = a[0];
				var component_name = a[1];
				var svg_dest_path = a[2];
				var callback = a[3];
				
				fs2.svg_extract_component(svg_source_path, component_name, function(err, svg_xmldom_el) {
					if (err) {
						throw err;
					} else {
						//console.log('svg_xmldom_el.toString ' + svg_xmldom_el.toString);
						
						// save that file to disk.
						//  version="1.1" xmlns:x="&ns_extend;" xmlns:i="&ns_ai;" xmlns:graph="&ns_graphs;"
						// xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
						
						// '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1280px" height="800px" viewBox="0 0 1280 800" enable-background="new 0 0 1280 800" xml:space="preserve">'
						
						//var ot_svg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink>';
						var ot_svg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="2000px" height="1600px" viewBox="0 0 2000 1600" enable-background="new 0 0 2000 1600" xml:space="preserve">'
						var res_svg = ot_svg + svg_xmldom_el.toString() + '</svg>';
						
						fs.writeFile(svg_dest_path, res_svg, function (err) {
							if (err) throw err;
							//console.log('It\'s saved!');
							
							callback(null, svg_dest_path);
							
						});
						
						//throw ('stop');
					}
				});
				
			}
			
			// svg_source_path, component_name, callback
			if (sig == '[s,s,f]') {
				var svg_source_path = a[0];
				var component_name = a[1];
				var callback = a[2];
				fs2.xml_load_xmldom(svg_source_path, function(err, xml_doc) {
					// and look through the xml_dom object?
					
					var first_child = xml_doc.firstChild;
					console.log('first_child.tagName ' + first_child.tagName);
					
					// and use xpath get by id.
					var select = xpath.SelectNodes;
					var selected = select(xml_doc, "//*[@id='" + component_name + "']");
					//console.log('selected ' + stringify(selected));
					
					// selected is a named node map.
					// sel[0] is?
					console.log('tof(selected) ' + tof(selected));
					console.log('tof(selected[0]) ' + tof(selected[0]));
					
					var selected_el = selected[0];
					//var nnm_item = named_node_map.item(0);
					//console.log('nnm_item ' + nnm_item);
					
					//throw 'stop';
					
					console.log('selected.length ' + selected.length);
					//throw('stop');
					var attrs = selected_el.attributes;
					//console.log('attrs ' + stringify(attrs));
					// and the attrs values.
					
					var id_value = attrs.getNamedItem('id').value;
					//console.log('id_value ' + id_value);
					
					// then let's create a new SVG document?
					
					// that happens if there is a dest_path.
					
					callback(null, selected_el);
					
					/*
					for (var c = 0; c < attrs.length; c++) {
						// attribute name...
						
						
					}
					*/
					//throw('stop');
				})
			}
			
			
			// also function to load the svg file... may find a way of doing it well x-platform.
			//  would like to be parsing XML using node.js with an efficiently written parser,
			//  and then use a more optimized version of that parser.
			
			// load the file from the source path as string.
			
		}),
		
		
		
		
		'svg_component_to_png32_multi_dpi_path': function(source_svg_path, component_name, target_root_dir, target_dpis, callback) {
			// need to ensure the directories for the target DPIs exist.
			
			// could make this operate with multiple source SVGs as well.
			
			// first, get the component out of the source.
			// extract to the build location, temporarily.
			
			var component_svg_dest = target_root_dir + dir_separator + component_name + '.svg';
			
			fs2.svg_extract_component(source_svg_path, component_name, component_svg_dest, function(err, svg_component) {
				if (err) {
					
				} else {
					
					//console.log('svg_component ' + svg_component);
					//throw 'stop';
					// then extract from that component file.
					
					var map_dpis_target_paths = {};
					var arr_dpis_target_paths = [];
					each(target_dpis, function(i, target_dpi) {
						var target_path = target_root_dir + dir_separator + target_dpi + 'dpi';
						map_dpis_target_paths[target_dpi] = target_path;
						arr_dpis_target_paths.push(target_path);
					});
					
					fs2.dir_ensure(arr_dpis_target_paths, function(err, res_dir_ensure) {
						if (err) {
							
						} else {
							console.log('res_dir_ensure');
							
							// so, has the directories.
							// need to make the image convert command.
							// or could use an existing fs2 command too.
							//var base_name = path.basename(source_svg_path);
							
							// svg_to_png24
							var fns = [];
							each(target_dpis, function(i, target_dpi) {
								// resize the image function
								// // source_path, dest_path, dest_dpi, callback
								var dest_path = map_dpis_target_paths[target_dpi] + dir_separator + component_name.toLowerCase().replace(/ /g, '_').replace(/_x5f_/g, '_') + '.png';
								console.log('dest_path ' + dest_path);
								//throw('stop');
								
								var fn = [fs2.svg_to_png32, [svg_component, dest_path, target_dpi]];
								fns.push(fn);
								
							});
							call_multiple_callback_functions(fns, function(err, res) {
								if (err) {
									throw err;
								} else {
									fs.unlink(component_svg_dest, function(err) {
										if (err) {
											throw err;
										}
										callback(null, res);
									})
								}
							})
							
							
						}
					});
					
					
				}
			})
			
			
		},
		
		// option about the pixel density.
		'convert_svgs_directory_to_png24s_directory': function(source_dir_path, target_dir_path, target_dpi, callback) {
			// ensure the target dir exists.
			
			fs2.ensure_directory_exists(target_dir_path, function(err, exists) {
				if (err){
					throw err;
				} else {
					// assemble the list of convert commands.
					
					// get the list of svgs in the source directory.
					fs2.dir_files_by_extension(source_dir_path, '.svg', function(err, svg_files) {
						if (err) {
							throw err;
						} else {
							var fs_commands = [];
							each(svg_files, function(i, svg_file) {
								// create the fs command.
								//var command = 'convert '
								//console.log('svg_file ' + svg_file);
								
								if (svg_file != 'adobe_illustrator_pgf.svg') {

									var svg_file_path = source_dir_path + dir_separator + svg_file;
									console.log('svg_file_path ' + svg_file_path);
									
									var basename = npath.basename(svg_file_path, '.svg');
									
									var png24_file_path = target_dir_path + dir_separator + basename + '.png';
									// var command = 'convert -background none -density 144 -trim "' + v + '" "' + new_full_file_path + '"';
									// -units PixelsPerInch
									// +profile "8bim"
									//var command = 'convert -background none -density 288 -trim "' + svg_file_path + '" "' + png24_file_path + '"';
									var command = 'convert -units PixelsPerInch -background none -density ' + target_dpi + ' -trim "' + svg_file_path + '" +profile "8bim" "' + png24_file_path + '"';
									fs_commands.push(command);
								}
								
							});
							
							// sequentially / parallel execute of commands.
							
							//console.log('fs_commands ' + stringify(fs_commands));
							sequential_execute_fs_child_processes(fs_commands, function(err, res) {
								if (err) {
									throw err;
								} else {
									//console.log('conversion of files complete.');
									// could keep track of the files that have been converted.
									//console.log('conversion res ' + stringify(res));
									
									callback(null, res);
								}
							})
						}
					})
				}
			})
			
		},
		
		// png_opacity_border_detect
		
		// will use a convolution mask, looking at the opacity values of nearby pixels.
		//  could make a version that creates a wider border based on the opacity border.
		
		// Then can do more work on polymorphism for default image paths.
		
		
		
		// OK, so the layers system works so far!
		//  We want it to do more things, such as adding a border around the image.
		//  More things will be possible without a callback now.
		
		'png_opacity_border': fp(function(a, sig) {
			var source_path = a[0];
			var dest_path, color, callback;
		
			// If the dest path is set, it's the destination for the files. Otherwise, the dest path gets choosen from the root dir.
			//  Just for a single PNG.
			
			
			if (sig == '[s,f]') {
				source_path = a[0];
				// 
				throw 'Not yet implemented';
				
			}
			
			if (sig == '[s,s,f]') {
				source_path = a[0];
				dest_path = a[1];
				color = [0, 0, 255, 255];
				callback = a[2];
				fs2.png_opacity_border(source_path, dest_path, color, callback);
			}
			if (sig == '[s,s,[n,n,n,n],f]') {
				source_path = a[0];
				dest_path = a[1];
				color = a[2];
				callback = a[3];
				
				// the dest path is the path for the destination image.
				
				var source_base_name = npath.basename(source_path, '.png');
				//var new_png_path = dest_path + dir_separator + source_base_name + '_border.png';
				var new_png_path = dest_path;
				
				var Layer = node_rasters.Layer;
				
				// load the image metadata to get width, height.
				console.log('new_png_path ' + new_png_path);
				fs2.metadata(source_path, function(err, metadata) {
					if (err) {
						var stack = new Error().stack
						console.log( stack );
						
						throw err;
					} else {
						console.log('metadata ' + stringify(metadata));
						var width = metadata[1].width;
						var height = metadata[1].height;
						
						var layer_0 = new Layer({
							'name': 'layer_0',
							'width': width,
							'height': height
						})
						
						layer_0.fs_load_png(source_path, function() {
							// 
							// should have access to the fs data of the layer.
							
							console.log('loaded layer source_path ' + source_path);
							//throw 'stop';
							
							
							// It should be possible to do various things with the layer, including creating other layer objects from it.
							//  Will create an opacity mask layer as well.
							
							
							var l_opacity_mask = layer_0.to_opacity_mask();
							

							// create a resized version of the opacity mask.
							// resize, keep in the centre.
							//  position 4 in a 3x3 grid, 0 indexed.
							
							l_opacity_mask.resize_canvas(width + 8, height + 8);
							
							// then run the procedure that adds the border, similar to a convolution mask.
							//  but it's for shading. maybe it is a convo mask but with extra output params?
							// or a convolution algorithm.
							
							var l_border = l_opacity_mask.clone();
							
							
							l_border.color_border_on_transparent_pixels(color);
							l_border.color_border_on_transparent_pixels(color);
							//l_border.color_border_on_transparent_pixels([0, 0, 255, 255]);
							
							//l_opacity_mask.color_border_on_transparent_pixels([0, 0, 255, 255]);
							//l_opacity_mask.color_border_on_transparent_pixels([0, 0, 255, 255]);
							
							l_border.filter_single_color_in(color[0], color[1], color[2]);
							
							l_border.color_border_on_transparent_pixels(color);
							//l_border.color_border_on_transparent_pixels([0, 0, 255, 255]);
							
							// alpha blur would work better with a weighted convolution mask.
							//l_border.alpha_blur_out();
							
							// and do an alpha_blur
							//  that will be nice smoothing for the border.
							
							// will need to do the convolution alg with a source grid
							// could have a convolution callback for every pixel - presents it with the grid.
							
							
							// May work on more internal compression for the PNG.
							//  Different ways of losslessly encoding the image using filters - choosing the right filter.
							//   Will look at the PNG packer.
							//   Maybe will make that choose a pallet and encode it as png 8.
							
							/*
							l_border.fs_save_png(new_png_path, function() {
								console.log('saved new opacity mask png.')
								
								
							});
							*/
							
							// don't save the border quanted?
							//  that could be an option or flag.
							
							// quanting the border when saving it does not seem like a problem.
							
							// we can build spritesheets of the directories too.
							//  could also optimize the spritesheets in various ways.
							console.log('new_png_path ' + new_png_path);
							//throw 'stop';
							
							l_border.fs_save_png8_quant(new_png_path, function(err, res) {
								if (err) {
									var stack = new Error().stack
									console.log( stack )
									throw (err);
								} else {
									console.log('saved new opacity mask png.')
									//throw 'stop';
									callback(null, res);
								}
							});
							
							// save a png8_quant from the layer....
							
							
							
							
							
							
							
							
							/*
							layer_0.fs_save_png(new_png_path, function() {
								console.log('saved new png.')
								
								
								
							})
							*/
							
							
							
						});
						
						
						
						
					}
				});
				
				
			}
			
			/*
			if(a.length > 2){
				dest_path = a[1];
				callback = a[2];
			} else {
				dest_path = npath.dirname(source_path) + dir_separator;
				callback = a[1];
			}
			*/
			
			
			
			
			
			
		}),
		
		'_png_opacity_border': function(source_path, callback) {
			
			// Will change this significantly so that it makes use of node-rasters.
			//  Needs to put in place an opacity border using some simple steps here.
			
			
			
			
			var source_base_name = npath.basename(source_path, '.png');
			var new_png_path = npath.dirname(source_path) + dir_separator + source_base_name + '_opacity_mask.png';
			fs2.metadata(source_path, function(err, metadata) {
				if (err) {
					throw err;
				} else {
					//console.log('metadata ' + stringify(metadata));
					var width = metadata.width;
					var height = metadata.height;
					//console.log('pre createReadStream');
					
					
					
					fs.createReadStream(source_path)
					    .pipe(new PNG({
					        filterType: 4
					    }))
					    .on('parsed', function() {
					    	//console.log('parsed');
					        var that = this;
					        
					        // a version of iterate pixels that has a convolution mask - 3x3 convo mask.
					        //  a version that creates new convo masks at every point will be slower.
					        //  something that gets the references to the convo mask where appropriate - works out if it is on or off the grid?
					        //   but the mask gets applied .. just getting the 3x3 grid for the pixel.
					        
					        var source_pixel_grid = [[], [], []];
					        
					        // don't copy the buffers.
					        
					        // will extract them to an array?
					        
					        // It looks like the node.js buffer may offer decent performance in some ways.
					        
					        //var source_buffer = this.data.slice();
					        
					        var source_buffer = new Buffer(4 * this.width * this.height);
					        
					        var data_buffer = this.data;
					        data_buffer.copy(source_buffer);
					        
					        
					        //console.log('source_buffer ' + source_buffer);
					        
					        // Also need to write to positions outside of the image.
					        //  That may involve unencoding it from PNG and then re-encoding it. Changing the width parameter may prove tricky.
					        
					        // Will put it into a grid that is larger than the original image.
					        //  Still likely to be placing it using a buffer, not sure. May need to be careful to write every pixel to the buffer.
					        
					        // A different tool could optimize the png, such as finding the filter type
					        //  and applying a filter in a way that compresses pixels.
					        
					        // From the pngjs example.
					        /*
					        var png = new PNG({
					            width: 10,
					            height: 10,
					            filterType: -1
					        });
							
					        for (var y = 0; y < png.height; y++) {
					            for (var x = 0; x < png.width; x++) {
					                var idx = (png.width * y + x) << 2;

					                var col = x < (png.width >> 1) ^ y < (png.height >> 1) ? 0xe5 : 0xff;

					                png.data[idx  ] = col;
					                png.data[idx+1] = col;
					                png.data[idx+2] = col;
					                png.data[idx+3] = 0xff;
					            }
					        }

					        png.pack().pipe(fs.createWriteStream(__dirname + '/bg.png'));
					        */
					        
					        var new_width = this.width + 2;
					        var new_height = this.height + 2;
					        
					        var new_png = new PNG({
					            width: new_width,
					            height: new_height,
					            filterType: -1
					        });
					        
					        for (var y = 0; y < new_png.height; y++) {
					            for (var x = 0; x < new_png.width; x++) {
					                var idx = (new_png.width * y + x) << 2;

					                //var col = x < (new_png.width >> 1) ^ y < (new_png.height >> 1) ? 0xe5 : 0xff;

					                new_png.data[idx] = 0;
					                new_png.data[idx + 1] = 0;
					                new_png.data[idx + 2] = 0;
					                new_png.data[idx + 3] = 0;
					            }
					        }
					        
					        var png_set_pixel = function(png, x, y, r, g, b, a) {
					        	var idx = (png.width * y + x) << 2;
					        	png.data[idx] = r;
					        	png.data[idx + 1] = g;
					        	png.data[idx + 2] = b;
					        	png.data[idx + 3] = a;
					        	
					        }
					        
					        var iterate_pixels = function(source_buffer, res_buffer, callback) {
					        	var x, w = that.width, y, h = that.height;
					        	//var 
					        	
					        	var set_px_grid = function(x, y) {
					        		
					        		var x_centre_offset = 1;
					        		var y_centre_offset = 1;
					        		
					        		// maybe do a simpler -1 to 1 pixel offset iterations.
					        		
					        		for (var x1 = -1; x1 < 2; x1++) {
					        			for (var y1 = - 1; y1 < 2; y1++) {
					        				//console.log('x1 ' + x1 + ', y1 ' + y1);

					        				source_pixel_grid[x1 + x_centre_offset][y1 + y_centre_offset] = get_pixel(x + x1, y + y1);
						        		}
					        		}
					        	}
					        	
					        	var get_pixel = function(x, y) {
					        		//console.log('get_pixel x ' + x + ', y ' + y);
					        		if (x < 0) return null;
					        		if (x >= w) return null;
					        		if (y < 0) return null;
					        		if (y >= h) return null;
					        		
					        		var idx = (that.width * y + x) << 2;
					        		
					        		// could choose to have it get the pixels from a different source_data.
					        		
					        		var res = [source_buffer[idx], source_buffer[idx + 1], source_buffer[idx + 2], source_buffer[idx + 3]];
					        		return res;
					        	}
					        	
					        	for (y = 0; y < h; y++) {
						            for (x = 0; x < w; x++) {
						                var idx = (that.width * y + x) << 2;
						                
						                
						                var fn_set = function(r, g, b, a) {
						                	res_buffer[idx] = r;
						                	res_buffer[idx + 1] = g;
						                	res_buffer[idx + 2] = b;
						                	res_buffer[idx + 3] = a;
						                };
						                
						                set_px_grid(x, y);
						                
						                // creation of a convolution mask - this will be a 3x3 array.
						                // a pixel grid rather than a single pixel...
						                callback(x, y, source_pixel_grid, fn_set);
						                //callback(x, y, that.data[idx], that.data[idx + 1], that.data[idx + 2], that.data[idx + 3], fn_set);
						            }
						        }
					        };
					        
					        var iterate_enlarged_pixel_grid = function(source_buffer, res_buffer, extra_border_size, callback) {
					        	// am iterating over the first image, returning transparent pixels outside it.
					        	
					        	var orig_width = that.width;
					        	var orig_height = that.height;
					        	
					        	var x, w = orig_width, y, h = orig_height;
					        	var set_px_grid = function(x, y) {
					        		
					        		var x_centre_offset = 1;
					        		var y_centre_offset = 1;
					        		
					        		// maybe do a simpler -1 to 1 pixel offset iterations.
					        		
					        		for (var x1 = -1; x1 < 2; x1++) {
					        			for (var y1 = - 1; y1 < 2; y1++) {
					        				//console.log('x1 ' + x1 + ', y1 ' + y1);

					        				source_pixel_grid[x1 + x_centre_offset][y1 + y_centre_offset] = get_pixel(x + x1, y + y1);
						        		}
					        		}
					        	}
					        	var default_px = [0, 0, 0, 0];
					        	var get_pixel = function(x, y) {
					        		//console.log('get_pixel x ' + x + ', y ' + y);
					        		if (x < 0) return default_px;
					        		if (x >= w) return default_px;
					        		if (y < 0) return default_px;
					        		if (y >= h) return default_px;
					        		
					        		// consult the source width here.
					        		
					        		var idx = (that.width * y + x) << 2;
					        		
					        		// could choose to have it get the pixels from a different source_data.
					        		
					        		var res = [source_buffer[idx], source_buffer[idx + 1], source_buffer[idx + 2], source_buffer[idx + 3]];
					        		return res;
					        	}
					        	
					        	for (y = 0 - extra_border_size; y < h + extra_border_size; y++) {
						            for (x = 0 - extra_border_size; x < w + extra_border_size; x++) {
						            	
						            	
						            	// buffer placement workin differently.
						                //var idx = (that.width + (2 * extra_border_size) * (y + extra_border_size) + x + extra_border_size) << 2;
						                
						            	var idx = (new_width * (y + 1) + x + 1) << 2;
						                
						                var fn_set = function(r, g, b, a) {
						                	
						                	// work out new index for set?
						                	
						                	res_buffer[idx] = r;
						                	res_buffer[idx + 1] = g;
						                	res_buffer[idx + 2] = b;
						                	res_buffer[idx + 3] = a;
						                };
						                
						                set_px_grid(x, y);
						                
						                // creation of a convolution mask - this will be a 3x3 array.
						                // a pixel grid rather than a single pixel...
						                callback(x, y, source_pixel_grid, fn_set);
						                //callback(x, y, that.data[idx], that.data[idx + 1], that.data[idx + 2], that.data[idx + 3], fn_set);
						            }
						        }
					        }
					        
					        iterate_pixels(data_buffer, data_buffer, function(x, y, source_pixel_grid, set_pixel) {
					        	//console.log('source_pixel_grid ' + stringify(source_pixel_grid));
					        	var centre_px = source_pixel_grid[1][1];
					        	var r = centre_px[0];
					        	var g = centre_px[1];
					        	var b = centre_px[2];
					        	var a = centre_px[3];
					        	
					        	if (a > 0) {
					        		set_pixel(0, 0, 0, 255);
					        	} else {
					        		set_pixel(0, 0, 0, 0);
					        	};
					        });
					        
					        // Then a second iteration that puts in place a blue border.
					        
					        // make a copy of the initial pixels.
					        
					        // Want to iterate over a larger grid.
					        //  Iterate over enlarged image.
					        //  Pixels external to the image will be transparent.
					        
					        iterate_enlarged_pixel_grid(source_buffer, new_png.data, 1, function(x, y, source_pixel_grid, set_pixel) {
					        	//console.log('source_pixel_grid ' + stringify(source_pixel_grid));
					        	//console.log('x ' + x  + ', y ' + y); 
					
					        	var centre_px = source_pixel_grid[1][1];
					        	var r = centre_px[0];
					        	var g = centre_px[1];
					        	var b = centre_px[2];
					        	var a = centre_px[3];
					        	
					        	// if the central pixel is filled, leave it, otherwise...
					        	
					        	if (a > 0) {
					        		//set_pixel(0, 0, 0, 255);
					        	} else {
					        		//set_pixel(0, 0, 0, 0);
					        		// may fill the pixel with a different color.
					        		
					        		// look at the source grid.
					        		
					        		var source_grid_has_filled_pixel = function() {
					        			var res = false;
					        			var w = 3, h = 3, x = 0, y = 0;
					        			while (!res && x < w) {
					        				y = 0;
					        				while (!res && y < h) {
					        					var px = source_pixel_grid[x][y];
					        					//console.log('px ' + stringify(px));
					        					//if (px)
					        					
					        					if (px && px[3] > 0) res = true;
					        					y++;
					        					
					        				}
					        				x++;
					        			}
					        			return res;
					        		}
					        		var has_filled_pixel = source_grid_has_filled_pixel();
					        		
					        		//console.log('has_filled_pixel ' + has_filled_pixel);
					        		
					        		// Should really be applying the process based on the dimensions of the new object.
					        		//  Or have a way to place the result pixels into a dynamically sized image space.
					        		
					        		
					        		if (has_filled_pixel) {
					        			set_pixel(0, 0, 255, 255);
					        			
					        			//png_set_pixel(new_png, x + 1, y + 1, 0, 0, 255, 255);
					        			
					        			// want to set the pixel on the destination png, the new one.
					        			
					        		} 
					        		
					        	};
					        });
					        
					        // what about second processes? Adding extra to the border?
					        //  we could apply a grow function, and use the opacity mask in order to only grow the outer items.
					        
					        var ws = fs.createWriteStream(new_png_path);
					        
					        new_png.pack().pipe(ws);
					        ws.on('close', function() {
					        	callback(null, true);
					        });
					        
					        //this.pack().pipe(ws);
					        //ws.on('close', function() {
					        //	callback(null, true);
					        //	
					        //});
					        
					        
					    });
				}
			});
		},
		
		
		'png_opacity_mask': function(source_path, callback) {
			// This should also be expanded to take a destination path.
			
			// should possibly parse the filename to find out the first part parameters, so it can build them up again.
			
			// will just add '_opacity_mask' to the end of the filename, before extension.
			//  The file will maybe be saved as a PNG8?
			
			
			
			var source_base_name = npath.basename(source_path, '.png');
			//console.log('source_base_name ' + source_base_name);
			
			
			var new_png_path = npath.dirname(source_path) + dir_separator + source_base_name + '_opacity_mask.png';
			
			// load the png... 
			
			// load the PNG metadata.
			
			fs2.metadata(source_path, function(err, metadata) {
				if (err) {
					throw err;
				} else {
					console.log('metadata ' + stringify(metadata));
					
					var width = metadata.width;
					var height = metadata.height;
					
					//var PNG = require('png-js');
					
					//var fs = require('fs'),
				    

					console.log('pre createReadStream');
					fs.createReadStream(source_path)
					    .pipe(new PNG({
					        filterType: 4
					    }))
					    
					    // Try a function that makes the opacity map, and then goes through it again, doing fills with different distinct colors in different areas
					    //  This would be output.
					    //  Possibly return some JSON with the distinct areas?
					    //  A function that scans the image, just getting the distinct areas that are to be output as their own PNG images.
					    //   Without outputting intermediate images. Get the bounding boxes of the areas that get filled.
					    //   That would be very useful for this task.
					    
					    // Then use it to output the various images.
					    
					    // index from x, y, and width.
					    
					    .on('parsed', function() {
					    	console.log('parsed');
					    	
					    	/*
					        for (var y = 0; y < this.height; y++) {
					            for (var x = 0; x < this.width; x++) {
					                var idx = (this.width * y + x) << 2;
					                
					                //this.data[idx+3]
					                this.data[idx] = 0;
					                this.data[idx+1] = 0;
					                this.data[idx+2] = 0;
					                if (this.data[idx+3] > 0) this.data[idx+3] = 255;
					                
					                /*
					                
					                // invert color
					                this.data[idx] = 255 - this.data[idx];
					                this.data[idx+1] = 255 - this.data[idx+1];
					                this.data[idx+2] = 255 - this.data[idx+2];
		
					                // and reduce opacity
					                this.data[idx+3] = this.data[idx+3] >> 1;
					                */
					    		/*
					            }
					        }
					        */
					        // function to iterate through the pixels, with callbacks for the location.
					        // x, y
					        //  maybe a function to set the x,y value.
					        var that = this;
					        var iterate_pixels = function(callback) {
					        	var x, w = that.width, y, h = that.height;
					        	
					        	for (y = 0; y < h; y++) {
						            for (x = 0; x < w; x++) {
						                var idx = (that.width * y + x) << 2;
						                
						                var fn_set = function(r, g, b, a) {
						                	//this.data[idx] = 0;
							                //this.data[idx+1] = 0;
							                //this.data[idx+2] = 0;
							                //if (this.data[idx+3] > 0) this.data[idx+3] = 255;
						                	that.data[idx] = r;
						                	that.data[idx + 1] = g;
						                	that.data[idx + 2] = b;
						                	that.data[idx + 3] = a;
						                	
						                };
						                
						                callback(x, y, that.data[idx], that.data[idx + 1], that.data[idx + 2], that.data[idx + 3], fn_set);
						                
						                //this.data[idx+3]
						                
						                
						                //this.data[idx] = 0;
						                //this.data[idx+1] = 0;
						                //this.data[idx+2] = 0;
						                //if (this.data[idx+3] > 0) this.data[idx+3] = 255;
						                
						            }
						        }
					        };
					        
					        // What about writing pixels to a separate array?
					        
					        // Also, maybe a version where it goes through getting convolution matrices may work.
					        //  Want to have it so that for each pixel iteration function it has the pixels next to it.
					        
					        iterate_pixels(function(x, y, r, g, b, a, set_pixel) {
					        	//set_pixel()
					        	
					        	if (a > 0) {
					        		set_pixel(0, 0, 0, 255);
					        	} else {
					        		set_pixel(0, 0, 0, 0);
					        	}
					        	
					        });
					        
					        var ws = fs.createWriteStream(new_png_path);
					        
					        // It's a PNG object we are interacting with with this.
					        
					        // this.data
					        
					        // will modify the this.data.
					        
					        // want a way of referring to each individual pixel - can do calculation.
					        
					        this.pack().pipe(ws);
					        ws.on('close', function() {
					        	callback(null, true);
					        	
					        });
					        
					        
					    });

					
					/*
					PNG.decode(source_path, function(pixel_parts) {
					    // pixels is a 1d array of decoded pixel data
						console.log('pixel_parts.length ' + pixel_parts.length);
						
						// then go through the pixels looking at the rgba values.
						
						// go through 4 at a time.
						
						
						var count_in_px = 0;
						//var res_buffer = [];
						
						var res_pixel_parts_buffer = [];
						// can we make an 8 bit buffer?
						
						// Reading and writing these 1D buffers could be helped along with some code.
						
						
						
						var px = [];
						each(pixel_parts, function(i, pixel_part) {
							px[count_in_px] = pixel_part;
							count_in_px++;
							if (count_in_px == 4) {
								//res_buffer.push(px);
								//console.log('px ' + stringify(px));
								// eg [255, 255, 255, 0]
								
								if (px[3] == 0) {
									res_pixel_parts_buffer.push(0, 0, 0, 0);
								} else {
									res_pixel_parts_buffer.push(255, 255, 255, 255);
								}
								
								px = [];
								count_in_px = 0;
							}
						});
						
						// can create a buffer in the same format.
						
						// use node-png to save / encode it.
						
						var node_png = require('node-png').Png;
						var png = new node_png(res_pixel_parts_buffer, width, height, 'rgba');
						
						
						png.encode(function (data, error) {
						    if (error) {
						        console.log('Error: ' + error.toString());
						        process.exit(1);
						    }
						    //fs.writeFileSync('./png-async.png', data.toString('binary'), 'binary');
						    console.log('new_png_path ' + new_png_path);
						    
						    fs.writeFileSync(new_png_path, data.toString('binary'), 'binary');
						   
						    
						});
						
						
						
						//console.log('res_buffer.length ' + res_buffer.length);
						
						// the buffer of all pixels...
						
						// adressing them like pixels[x][y]?
						
						// could have a get_pixel_value, set_pixel_value on the long array of pixel 8 bit components.
						
						
						
						
						
						// functionality for dealing with the pixel array as one long list...
						//  should maybe get used to it.
						
					});
					*/
				}
			});
			
		},
		
		
		'svg_to_png32': fp(function(a, sig) {
			// source_path, dest_dpi, callback
			// [s, n, f]
			
			// may start using fp.
			
			// need to make the destination file name.
			//  could possibly identify if the source file is in a directory that is named to only have a certain type of item...

			if (sig == '[s,s,n,f]') {
				var source_path = a[0];
				var dest_path = a[1];
				var dest_dpi = a[2];
				var callback = a[3];
				var source_base_name = npath.basename(source_path, '.svg');
				//console.log('source_base_name ' + source_base_name);
				
				// just need to exec one command.
				//var command = 'convert -units PixelsPerInch -background none -density ' + dest_dpi + ' -trim "' + source_path + '" +profile "8bim" "' + dest_path + '"';
				var command = 'convert -units PixelsPerInch -background none -density ' + dest_dpi + ' -trim "' + source_path + '" PNG32:"' + dest_path + '"';
				exec(command, function(err, res) {
					if (err) {
						var stack = new Error().stack
						console.log(stack);
						throw(err);
					} else {
						callback(null, res);
					}
				});
			}
			
			if (sig == '[s,n,f]') {
				var source_path = a[0];
				var dest_dpi = a[1];
				var callback = a[2];
				var new_png_path = npath.dirname(source_path) + dir_separator + 'png32_' + dest_dpi + 'dpi_' + source_base_name + '.png';
				fs2.svg_to_png32(source_path, new_png_path, dest_dpi, callback);
				
				/*
				var source_base_name = npath.basename(source_path, '.svg');
				//console.log('source_base_name ' + source_base_name);
				
				// just need to exec one command.
				var command = 'convert -units PixelsPerInch -background none -density ' + dest_dpi + ' -trim "' + source_path + '" +profile "8bim" "' + new_png_path + '"';
				exec(command, function(err, res) {
					if (err) {
						throw(err);
					} else {
						callback(null, res);
					}
				});
				*/
			}
			
			
		}),
		'transform_component': function(source_path, transfrom, callback){
			each(transfrom, function(action, v){
	
					im.convert([source_path, '-' + action, v, source_path], function(err, stdout){
						  callback(err, stdout);
					});
				
			});
		},			
		'convert_svgs_in_directory_to_png24': function(path, callback) {
			fs2.dir_files_by_extension(path, '.svg', function(err, svg_files) {
				if (err) {
					
				} else {
					console.log('svg_files ' + svg_files);
					
					// then with the svg files, we convert them.
					
					var full_file_paths = [];
					// likely to use some kind of multiple process spawning.
					//  may need to limit ongoing conversion processes somehow.
					//  Could have some kind of conversions broker, it's careful to only have 8 conversion processes going on at once maybe.
					
					
					
					
					each(svg_files, function(i, v) {
						var full_path = path + dir_separator + v;
						full_file_paths.push(full_path);
					});
					
					// then assemble them into commands to call. That will be a good way of doing multiple calls to programs at once.
					var fs_commands = [];
					
					each(full_file_paths, function(i, v) {
						var pos1 = v.lastIndexOf('.');
						var without_ext = v.substr(0, pos1);
						console.log(without_ext);
						
						var new_full_file_path = without_ext + '.png';
						
						// -density 144
						
						//var command = 'convert -background none -resize 400% "' + v + '" "' + new_full_file_path + '"';
						var command = 'convert -background none -density 144 -trim "' + v + '" "' + new_full_file_path + '"';
						fs_commands.push(command);
					});
					
					console.log('fs_commands ' + stringify(fs_commands));
					
					// and then we will call a sequential_execute_fs_child_processes function
					//  can do it one at a time, may make a multithreaded version too.
					
					sequential_execute_fs_child_processes(fs_commands, function(err, res) {
						if (err) {
							
						} else {
							console.log('have run the convert commands.');
						}
					})
					
					
					
				}
				
			});
			
		},
		'dir_files_by_extension': function(path, extension, callback) {
			fs2.dir_contents(path, function(err, dir_contents) {
				if (err) {
					
				} else {
					//console.log('dir_contents ' + stringify(dir_contents));
					
					var res = [];
					each(dir_contents.files, function(i, v) {
						//console.log('v ' + stringify(v));
						
						var file_extension = npath.extname(v);
						if (extension == file_extension) {
							res.push(v);
						}
						
					})
					//return res;
					console.log('res ' + res);
					callback(null, res);
				}
			})
			
			
		},
			
		'dir_contents': function(path, callback) {
			//path = path.replace(/\//g, '\\');
			console.log('dir_contents path ' + path);
			
			//console.log(fs.existsSync(path));
			fs.readdir(path, function(err, files) {
				if (err) {
					//console.log('err ' + err);
					var stack = new Error().stack;
					console.log(stack);
					throw('err ' + err);
				} else {
					//console.log('files ' + stringify(files));
					//console.log('typeof files ' + stringify(typeof files));
					//console.log('dir_contents path ' + path);
					var res = {};
					var res_files = [];
					var res_directories = [];
					var c = files.length;
					//console.log('c ' + c);
					
					var cb = function() {
						if (res_files.length > 0) {
							res.files = res_files;
						}
						if (res_directories.length > 0) {
							res.directories = res_directories;
						}
						//return res;
						//console.log('res ' + stringify(res));
						callback(null, res);
					}
					
					// maybe this could be done sequentially, perhaps doing n at once.
					//  limit the simultaneous lookups.
					
					// want to do sequential function calls, waiting for the callback on each.
					//  putting the result callback into the result, but calling it with different items.
					
					if (!files || files.length == 0) {
						cb();
					}
					
					each(files, function(i, v) {
						
						var file_or_dir_full_path = path + dir_separator + v;
						//console.log('file_or_dir_full_path ' + stringify(file_or_dir_full_path));
						
						//console.log('i ' + stringify(i));
						//console.log('v ' + stringify(v));
						// find out if it is a directory.
						
						fs.stat(file_or_dir_full_path, function(err, stats) {
							if (err) {
								
								throw(err);
								
							} else {
								//console.log('stats.isDirectory() ' + stringify(stats.isDirectory()));
								
								var is_dir = stats.isDirectory();
								
								if (is_dir) {
									res_directories.push(v);
								} else {
									res_files.push(v);
									
								}
								
								c--;
								if (c == 0) {
									cb();
								}
							}
						})
					})
				}
			})
		},
		// metadata... will make a (mime) type assumption based on the extension.
		//  may then read further metadata, possibly verify the file, metadata verification is one thing,
		//  has_metadata.
		// There could be further file validation.
		//
		
		// could possibly use arrayify, but arrayify that has been handled to work with callback functions.
		// maybe call file_metadata.
		
		'metadata': function(path, callback) {
			// mainly for file metadata.
			// check to see if it exists.
			
			//console.log('metadata path ' + path);
			
			
			
			fs.exists(path, function(exists) {
				if (!exists) {
					console.log('file does not exist ' + path);
					
					throw('file not found');
					
				} else {
					//var pos1 = path.lastIndexOf()
					
					// just get the node.js file stats first.
					
					fs.stat(path, function(err, stats) {
						var extname = npath.extname(path);
						var basename = npath.basename(path);
						//console.log('extname ' + extname);
						
						var extname2 = extname.substring(1);
						var res = {
							'size': stats.size
						};
						
						// mime type tables, then will have specific metadata finding for specific mime types.
						
						// metadata lookup for specific mime types - could be its own node.js library.
						
						var mime_type = map_extension_mime_types[extname2];
						//console.log('mime_type ' + mime_type);
						
						var fn_spec_md = specific_metadata[mime_type];
						
						if (fn_spec_md) {
							//console.log('has fn_spec_md');
							// then use that specific mime type to load the metadata.
							
							fn_spec_md(path, function(err, specific_metadata) {
								if (err) {
									console.log(err);
									throw(err);
								} else {
									each(specific_metadata, function(i, v) {
										res[i] = v;
									});
									//console.log('specific_metadata ' + stringify(specific_metadata));
									callback(null, [basename, res]);
									
								}
							});
							
						} else {
							
							//console.log('no metadata loading for type ' + mime_type);
							callback(null, [basename, res]);
						}
					});
				}
			});
		},
		
		'resize_image': function(source_path, dest_path, target_size, callback) {
			// 50% for the moment.
			
			// need to source image metadata
			
			console.log('resize_image ' + source_path);
			console.log('dest_path ' + dest_path);
			
			// need the metadata from original.
			
			//var orig_md = 
			/*
			fs2.metadata(source_path, function(err, res) {
				if (err) {
					
					
				} else {
					console.log('res ' + stringify(res));
					
				}
			})
			*/
			
			// resize it...
			
			// convert -size 320x85
			
			// check that the target directory exists.
			
			//var pos1 = dest_path.lastIndexOf
			
			var dest_dir_name = path.dirname(dest_path);
			//var dest_exists = 
			console.log('dest_dir_name ' + dest_dir_name);
			
			fs.exists(dest_dir_name, function(res) {
				console.log('dest dir exists ' + res);
				if (!res) {
					fs.mkdir(dest_dir_name, function(err) {
						if (!err) {
							do_resize();
							
						}
					})
					
				} else {
					do_resize();
				}
				
			});
			
			var do_resize = function() {
				var str_resize_command = 'convert ' + source_path + ' -size ' + target_size[0] + 'x' + target_size[1] + ' ' + dest_path;
				console.log('str_resize_command ' + str_resize_command);
				
				exec(str_resize_command, function(err, stdout) {
					if (err) {
						console.log('err ' + err);
					} else {
						//console.log('stdout ' + stdout);
						// may be no output.
						
						callback();
					}
					
					
				});
			}
			
			
			
			
		},
		
		
		'resize_dir_images': function(source_path, dest_path, target_size, callback) {
			// resize to 50% to start with.
			
			// will need to go through the original dir, creating the new images.
			
			fs2.dir_contents_with_metadata(source_path, function(err, md) {
				
				if (err) {
					
				} else {
					console.log('md ' + stringify(md));
					
					// Then go through the files, and make the resized versions.
					
					// possibly use sequential_call?
					//  can that be used when there are multiple parameters?
					//  That may need more work / investigation.
					
					
					// maybe resize 1-by-1 will be fine for now.
					//  a new sequential call function would be good, where it takes [[fn, arr_params], ...], executes in sequence.
					//   may be a nice node module.
					
					var files = md.files;
					
					each(files, function(i, v) {
						var file_name = v[0];
						var file_params = v[1];
						var width = file_params.width;
						var height = file_params.height;
						
						// do the single resize.
						
						// I think the function to call a whole bunch of functions makes sense... but would need to collate callback results.
						
						// let's do them one at a time for the moment.
						
					});
					
					var c_remaining = files.length;
					console.log('c_remaining ' + c_remaining);
					var l = files.length;
					var c = 0;
					
					
					var process_resize = function() {
						var img = files[c];
						c++;
						var file_name = img[0];
						var file_params = img[1];
						var width = file_params.width;
						var height = file_params.height;
						
						var img_source_path = source_path + dir_separator + file_name;
						var img_dest_path = dest_path + dir_separator + file_name;
						
						console.log('img_source_path ' + img_source_path);
						console.log('img_dest_path ' + img_dest_path);
						
						
						// calculate the target size.
						// at the moment taking the target size as x%.
						// regex for parsing percentage?
						
						var rx_pct = /^(\d+)%$/;
						
						var match = target_size.match(rx_pct);
						console.log('match ' + match);
						
						if (match) {
							var prop = parseInt(match[1]) / 100;
							// new size
							var new_size = [width * prop, height * prop];
							fs2.resize_image(img_source_path, img_dest_path, new_size, cb);
							
							
						}
					}
					
					var cb = function(err, res) {
						console.log('cb');
						if (err) {
							console.log('err ' + err);
						} else {
							console.log('c_remaining ' + c_remaining);
							c_remaining--;
							console.log('c_remaining ' + c_remaining);
							if (c_remaining > 0) {
								console.log('in callback going to do next');
								process_resize();
								
							} else {
								callback();
								
							}
							
						}
						
						
					}
					
					
					
					
					if (c_remaining > 0) {
						
						process_resize();
						
						
						//fs2.resize_image(img_source_path, img_dest_path, )
						
						//fs2.resize_image()
						
						
					}
				}
			})
			
			
		},
		
		// copy a file as well.
		
		'copy_file': function(source_path, dest_path, callback) {
			console.log('source_path ' + source_path);
			console.log('dest_path ' + dest_path);
			
			var r = fs.createReadStream(source_path).pipe(fs.createWriteStream(dest_path));
			
			r.on('close', function() {
				//if (err) throw err;
				//throw 'stop';
				callback(null, true);
			});
		},
		
		'copy': function(source_path, dest_path, callback) {
			// dest must be a directory
			
			
			ncp.limit = 16;
			console.log('source_path ' + source_path);
			console.log('dest_path ' + dest_path);
			
			ncp(source_path, dest_path, function (err) {
				if (err) {
					return console.error(err);
				}
				
				callback(null, true);
				//console.log('done!');
			});
			
			/*
			fs.stat(dest_path, function(err, stats) {
				if (err) {
					
				} else {
					
					if (stats.isDirectory()) {
						
						fs.stat(source_path, function(err, stats) {
							if (err) {
								
							} else {
								
								if (stats.isDirectory()) {
									
									// create the corresponding directory
									// copy every file and directory within that directory to the corresponding directory
									
									// This can be built up using fns.
									
									

							    } else {
							    	
							    }
								
							}
						});

				    }
					
				}
			});
			*/
			// source can be a file or directory.
			
			// when copying a directory, copy all directories inside it as well (recursively).
			
			
		},
		
		
		'dir_contents_with_metadata_full_tree': function(start_path, callback) {
			//  get this from za?
			
			// I think this will be recursive...
			console.log('');
			console.log('dir_contents_with_metadata_to_path');
			console.log('start_path ' + start_path);
			console.log('dest_path ' + dest_path);
			
			
			// Let's build this up...
			
			// get the contents and metadata for the path itself.
			
			// Also, this can act as a finite state machine.
			//  Can have simultaneous processes too.
			
			// recursive function within this one.
			
			var path_from_start = '';
			
			var res = {};
			
			
			// and look at the dest path...
			
			if (dest_path.length < start_path.length) {
				throw 'dest path length must be >= source path length';
			}
			
			if (dest_path.substr(0, start_path.length) != start_path) {
				throw 'the dest path must start with the start path - therefore being a subdirectory';
			}
			
			var process_path = function(path_from_start, arr_path, current_res_obj, callback) {
				console.log('process_path');
				console.log('arr_path ' + stringify(arr_path));
			
				var current_path = start_path + path_from_start;
				
				// will need to put the items into the res properly.
				console.log('current_path ' + current_path);
				//throw 'stop';
				fs2.dir_contents_with_metadata(current_path, function(err, dir_contents) {
					if (err) {
						throw (err);
					} else {
						// for every file...
						console.log('have contents for ' + current_path);
						
						
						if (dir_contents.files && dir_contents.files.length > 0) {
							current_res_obj.files = current_res_obj.files || [];
							each(dir_contents.files, function(i, file_info) {
								//console.log('file_info ' + stringify(file_info));
								var file_name = file_info[0];
								var file_md = file_info[1];
								//current_res_obj.files[file_name] = file_md;
								
								current_res_obj.files.push(file_info);
							});
							//console.log('dir_contents ' + stringify(dir_contents));
						}
						
						// for every directory... that gets more complicated.
						
						// won't do the callback yet...
						
						// will get the info from the directories, and put them in an object.
						// name, contents, metadata.
						
						if (dir_contents.directories) {
							// process those directories.
							current_res_obj.directories = current_res_obj.directories || [];
							//var next_path = 
							//var next_arr_path = arr_path.slice();
							//next_arr_path.push(
							
							var fns = [];
							
							each(dir_contents.directories, function(i, directory_info) {
								console.log('directory_info ' + stringify(directory_info));
								
								if (tof(directory_info == 'string')) {
									var directory_name = directory_info;
									var next_arr_path = arr_path.slice();
									next_arr_path.push(directory_name);
									
									var dir_obj = [directory_name, {}, {}];
									current_res_obj.directories.push(dir_obj);
									
									console.log('path_from_start.substr(path_from_start.length -1) ' + path_from_start.substr(path_from_start.length -1));
									
									console.log('path_from_start ' + path_from_start);
									
									
									/*
									if (path_from_start.substr(path_from_start.length -1) == dir_separator) {
										throw 'stop';
										var next_path_from_start = path_from_start + directory_name;
										fns.push([process_path, [next_path_from_start, next_arr_path, current_res_obj]]);
									} else {
										var next_path_from_start = path_from_start + directory_name + dir_separator;
										fns.push([process_path, [next_path_from_start, next_arr_path, current_res_obj]]);
									}
									*/
									
									var next_path_from_start = path_from_start + directory_name + dir_separator;
									fns.push([process_path, [next_path_from_start, next_arr_path, current_res_obj]]);
									
									
									
								} else {
									throw 'string expected';
								}
								
							});
							console.log('fns.length ' + fns.length);
							if (fns.length > 0) {
								call_multiple_callback_functions(fns, function(err, fns_res) {
									//console.log('fns_res ' + stringify(fns_res));
									callback(null, res);
								});
							} else {
								callback(null, res);
							}
							
							
							
						} else {
							console.log('no directories');
							callback(null, res);
						}
						
						
						// need to go through every directory there, processing the path.
						
						
						
						
					}
					
					
					
				});
				
			}
			
			process_path('', [], res, function(err, res_process_path) {
				//throw 'stop';
			
				callback(null, res_process_path);
				
			});
		},
		
		// this is unrestricted from that path.
		
		'dir_contents_with_metadata_to_path': function(start_path, dest_path, callback) {
			// find the sequence of paths to get
			
			// get them in sequence, then construct them into the object.
			
			// maybe difficult?
			//  get this from za?
			// I think this will be recursive...
			console.log('');
			console.log('dir_contents_with_metadata_to_path');
			console.log('start_path ' + start_path);
			console.log('dest_path ' + dest_path);
			
			
			// Let's build this up...
			
			// get the contents and metadata for the path itself.
			
			// Also, this can act as a finite state machine.
			//  Can have simultaneous processes too.
			
			// recursive function within this one.
			
			var path_from_start = '';
			
			var s_path_from_start = path_from_start.split(dir_separator);
			
			var res = {};
			
			
			// and look at the dest path...
			
			if (dest_path.length < start_path.length) {
				throw 'dest path length must be >= source path length';
			}
			
			if (dest_path.substr(0, start_path.length) != start_path) {
				throw 'the dest path must start with the start path - therefore being a subdirectory';
			}
			
			var navigation_path = dest_path.substr(start_path.length);
			console.log('navigation_path ' + navigation_path);
			
			if (navigation_path.substr(navigation_path.length - 1) == dir_separator) {
				navigation_path = navigation_path.substr(0, navigation_path.length - 1);
			}
			
			console.log('navigation_path ' + navigation_path);
			
			var s_np = navigation_path.split(dir_separator);
			console.log('s_np ' + stringify(s_np));
			
			//throw 'stop';
			
			var depth = 0;
			
			var process_path = function(path_from_start, arr_path, current_res_obj, depth, callback) {
				console.log('process_path');
				console.log('arr_path ' + stringify(arr_path));
			
				var current_path = start_path + path_from_start;
				
				// will need to put the items into the res properly.
				console.log('current_path ' + current_path);
				//throw 'stop';
				fs2.dir_contents_with_metadata(current_path, function(err, dir_contents) {
					if (err) {
						throw (err);
					} else {
						// for every file...
						console.log('have contents for ' + current_path);
						
						
						if (dir_contents.files && dir_contents.files.length > 0) {
							current_res_obj.files = current_res_obj.files || [];
							each(dir_contents.files, function(i, file_info) {
								//console.log('file_info ' + stringify(file_info));
								var file_name = file_info[0];
								var file_md = file_info[1];
								//current_res_obj.files[file_name] = file_md;
								
								current_res_obj.files.push(file_info);
							});
							//console.log('dir_contents ' + stringify(dir_contents));
						}
						
						// for every directory... that gets more complicated.
						
						// won't do the callback yet...
						
						// will get the info from the directories, and put them in an object.
						// name, contents, metadata.
						
						if (dir_contents.directories) {
							// process those directories.
							current_res_obj.directories = current_res_obj.directories || [];
							//var next_path = 
							//var next_arr_path = arr_path.slice();
							//next_arr_path.push(
							
							var fns = [];
							
							each(dir_contents.directories, function(i, directory_info) {
								console.log('directory_info ' + stringify(directory_info));
								
								if (tof(directory_info == 'string')) {
									var directory_name = directory_info;
									var next_arr_path = arr_path.slice();
									next_arr_path.push(directory_name);
									
									var dir_obj = [directory_name, {}, {}];
									current_res_obj.directories.push(dir_obj);
									
									console.log('path_from_start.substr(path_from_start.length -1) ' + path_from_start.substr(path_from_start.length -1));
									
									console.log('path_from_start ' + path_from_start);
									
									
									/*
									if (path_from_start.substr(path_from_start.length -1) == dir_separator) {
										throw 'stop';
										var next_path_from_start = path_from_start + directory_name;
										fns.push([process_path, [next_path_from_start, next_arr_path, current_res_obj]]);
									} else {
										var next_path_from_start = path_from_start + directory_name + dir_separator;
										fns.push([process_path, [next_path_from_start, next_arr_path, current_res_obj]]);
									}
									*/
									
									// check it's the next directory name.
									
									if (directory_name == s_np[depth]) {
										
										var next_path_from_start = path_from_start + directory_name + dir_separator;
										fns.push([process_path, [next_path_from_start, next_arr_path, current_res_obj, depth + 1]]);
										
									}
									
									
									
								} else {
									throw 'string expected';
								}
								
							});
							console.log('fns.length ' + fns.length);
							if (fns.length > 0) {
								call_multiple_callback_functions(fns, function(err, fns_res) {
									//console.log('fns_res ' + stringify(fns_res));
									callback(null, res);
								});
							} else {
								callback(null, res);
							}
							
							
							
						} else {
							console.log('no directories');
							callback(null, res);
						}
						// need to go through every directory there, processing the path.
					}
					
				});
				
			}
			
			process_path('', [], res, depth, function(err, res_process_path) {
				//throw 'stop';
			
				callback(null, res_process_path);
				
			});
			
		},
		
		
		// have this returning the object with files and directories.
		'dir_contents_with_metadata': function(path, callback) {
			console.log('dir_contents_with_metadata path ' + path);
			
			if (path.lastIndexOf(dir_separator) != path.length - 1) {
				path = path + dir_separator;
			}
			
			fs2.dir_contents(path, function(err, dir_contents) {
				if (err) {
					console.log('dir_contents_with_metadata err ' + err);
				} else {
					console.log('dir_contents_with_metadata path ' + path + ' has callback ');
					var res = {};
					
					if (dir_contents.directories && dir_contents.directories.length > 0) {
						res.directories = dir_contents.directories;
					}
					
					var cb = function() {
						callback(null, res);
					};
					
					if (dir_contents.files && dir_contents.files.length > 0) {
						// do a sequential_call
						
						//console.log('dir_contents.files ' + stringify(dir_contents.files));
						
						var seq_md = sequential_call(fs2.metadata);
						
						var files_with_paths = [];
						each(dir_contents.files, function(i, v) {
							var full_path = path + v;
							files_with_paths.push(full_path);
						});
						
						//console.log('files_with_paths ' + stringify(files_with_paths));
						
						seq_md(files_with_paths, function(err, res2) {
							if (err) {
								
							} else {
								//console.log('seq_md res ' + stringify(res));
								res.files = res2;
								callback(null, res);
							}
						});
						/*
						var res_files = [];
						res.files = res_files;
						var c = dir_contents.files.length;
						
						each(dir_contents.files, function(i, file_name) {
							var full_path = path + dir_separator + file_name;
							console.log('dir_contents_with_metadata full_path ' + full_path);
							
							fs2.metadata(full_path, function(err, file_metadata) {
								if (err) {
									console.log('err ' + err);
								} else {
									console.log('file_metadata ' + stringify(file_metadata));
									
									if (file_metadata !== false) {
										res_files.push([file_name, file_metadata]);
									} else {
										res_files.push(file_name);
									}
									
									c--;
									console.log('c ' + c);
									if (c == 0) cb();
								}
							});
							
						});
						*/
					} else {
						cb();
					}
				}
			})
		},
		
		
		'biber_pixels_iterate': function(source_path, callback) {
			var source_base_name = npath.basename(source_path, '.png');
			var new_png_path = npath.dirname(source_path) + dir_separator + source_base_name + '_biber.png';
			
			var Layer = node_rasters.Layer;
			
			// load the image metadata to get width, height.
			
			fs2.metadata(source_path, function(err, metadata) {
				if (err) {
					throw err;
				} else {
					//console.log('metadata ' + stringify(metadata));
					var width = metadata[1].width;
					var height = metadata[1].height;
					
					var layer_0 = new Layer({
						'name': 'layer_0',
						'width': width,
						'height': height
					})
					
					layer_0.fs_load_png(source_path, function() {
					
				            layer_0.biber_pixels_iterate(function(res){
				              console.log(res);

					                layer_0.fs_save_png8_quant(new_png_path, function() {
												console.log('saved new biber png.');											
									});
			           		});
					});
				}
			});
		},

		'png_opacity_border_components': fp(function(a, sig) {

			var source_path = a[0];
			var dest_path,callback, use_component_directories = false;

			if (sig[3] == 's'){
				dest_path = a[1];
				callback = a[2];
			} else 
			if (sig[3] == 'b'){
				use_component_directories = a[1];
				dest_path = npath.dirname(source_path) + dir_separator;
				callback = a[2];
			} 

			if (sig[5] == 'b'){
				use_component_directories = a[2];
				dest_path = a[1];
				callback = a[3];				

			}


			var source_base_name = npath.basename(source_path, '.png');

			var image_path, border_path;

			if(use_component_directories){
				image_path = dest_path + dir_separator + 'image';
				border_path = dest_path + dir_separator + 'border';

				fs.mkdir(image_path,function(err){
					image_path +=  dir_separator + source_base_name + '.png'
				});

				fs.mkdir(border_path, function(err){
					 border_path += dir_separator + source_base_name + '.png'
				});

			} else {
				image_path = dest_path + dir_separator + source_base_name + '_resized.png';
				border_path = dest_path + dir_separator + source_base_name + '_border.png';;
			}

				var Layer = node_rasters.Layer;
			
			// load the image metadata to get width, height.
			
			fs2.metadata(source_path, function(err, metadata) {
				if (err) {
					throw err;
				} else {
					//console.log('metadata ' + stringify(metadata));
					var width = metadata[1].width;
					var height = metadata[1].height;
					
					var layer_0 = new Layer({
						'name': 'layer_0',
						'width': width,
						'height': height
					})
					
					layer_0.fs_load_png(source_path, function() {
					
							layer_0.resize_canvas(width + 8, height + 8);

							var l_opacity_mask = layer_0.to_opacity_mask();
																
							var l_border = l_opacity_mask.clone();
							
							
							l_border.color_border_on_transparent_pixels([0, 0, 255, 255]);
							l_border.color_border_on_transparent_pixels([0, 0, 255, 255]);
							
							l_border.filter_single_color_in(0, 0, 255);
							
							l_border.color_border_on_transparent_pixels([0, 0, 255, 255]);

					
							layer_0.fs_save_png8_quant(image_path);
						

							l_border.fs_save_png8_quant(border_path);
						
							callback();
					});

					
				}

			});

		}),

		'dir_png_opacity_border_components': function(source_path, callback){
			fs2.dir_contents_with_metadata(source_path, function(err, md) {
				if (err) {
					
				} else {
					var dest_path = source_path + '';
					var files = md.files;
					var fcs = [];
					each(files, function(i, v) {
						
						var file_name = source_path + dir_separator + v[0];
						if(file_name.substring(file_name.lastIndexOf(".")) !== ".png" || v[0] == 'sprite.png') return;
						fcs.push([fs2.png_opacity_border_components,[file_name, dest_path, true]]);
							
					});
					call_multiple_callback_functions(fcs, function(err,res){
						if (err) {
							throw(err);
						} else {
							callback(null);
						}
					});
				}
			});
		},

		'dir_png_opacity_border_component_spritesheets': function(source_path, callback){

			var image_path = source_path + dir_separator + 'image';
			var border_path = source_path + dir_separator + 'border';

			if(fs.exists(image_path + dir_separator + 'sprite.png')){
				fs.unlink(image_path + dir_separator + 'sprite.png');
			}

			if(fs.exists(border_path + dir_separator + 'sprite.png')){
				fs.unlink(border_path + dir_separator + 'sprite.png');
			}

			fs2.dir_png_opacity_border_components(source_path, function() {
				console.log("Starting spritesheet");
				fs2.png_directory_to_spritesheet(source_path + dir_separator + 'image', function(err, res) {
					if (err) {
						console.log(err);
					} else {
						setTimeout(function() {
							fs2.dir_contents_with_metadata(image_path, function(err, md) {
								if(err) {
									console.log(err);
								} else {
									var files = md.files;
									each(files, function(i, v) {
										var file_name = image_path + dir_separator + v[0];
										if (v[0] == 'sprite.png' || v[0] == 'sprite.css') return;
										fs.unlink(file_name);
									});
								}
							});
						}, 1000);
					}
				});

				console.log("Starting spritesheet");
				
				fs2.png_directory_to_spritesheet(border_path, function(err, res){
					if(err){
						console.log(err);
					}else{
						setTimeout(function(){
							fs2.dir_contents_with_metadata(border_path, function(err, md) {
								if (err) {
									console.log(err);
								} else {
									var files = md.files;
									each(files, function(i, v) {
										var file_name = border_path + dir_separator + v[0];
										if (v[0] == 'sprite.png' || v[0] == 'sprite.css') return;
										fs.unlink(file_name);
									});
								}
							});
						}, 1000);
					}
				});
			});
		},

		'png_largest_contiguous_object': function(source_path, callback) {
			var source_base_name = npath.basename(source_path, '.png');
			var new_png_path = npath.dirname(source_path) + dir_separator + source_base_name + '_biber.png';
			
			var Layer = node_rasters.Layer;
			
			// load the image metadata to get width, height.
			
			fs2.metadata(source_path, function(err, metadata) {
				if (err) {
					throw err;
				} else {
					//console.log('metadata ' + stringify(metadata));
					var width = metadata[1].width;
					var height = metadata[1].height;
					
					var layer_0 = new Layer({
						'name': 'layer_0',
						'width': width,
						'height': height
					})
					
					layer_0.fs_load_png(source_path, function() {
			            layer_0.png_largest_contiguous_object_layer();
					});
				}
			});
		},
		'dir_png_opacity_border': fp(function(a, sig) {
			// no, need to make this properly polymorphic.
			//  It needs a callback anyway.
			
			// source_path, (dest_path, )callback
			if (sig == '[s,f]') {
				var source_path = a[0];
				var dest_path = source_path + '_opacity_border';
				var color = [0, 0, 255, 255];
				var callback = a[1];
				fs2.dir_png_opacity_border(source_path, dest_path, color, callback);
			}
			if (sig == '[s,s,f]') {
				var source_path = a[0];
				var dest_path = a[1];
				var color = [0, 0, 255, 255];
				var callback = a[2];
				fs2.dir_png_opacity_border(source_path, dest_path, color, callback);
			}
			if (sig == '[s,[n,n,n,n],f]') {
				var source_path = a[0];
				var dest_path = source_path + '_opacity_border';
				var color = a[1];
				var callback = a[2];
				fs2.dir_png_opacity_border(source_path, dest_path, color, callback);
			}
			if (sig == '[s,s,[n,n,n,n],f]') {
				var source_path = a[0];
				var dest_path = a[1];
				var color = a[2];
				var callback = a[3];
			
			
				fs2.dir_contents_with_metadata(source_path, function(err, md) {
					
					if (err) {
						throw err;
					} else {
						
						// maybe that path already exists?
						console.log('dest_path ' + dest_path);
						
						fs.mkdir(dest_path, function() {
							var files = md.files;
							var fns = [];
							
							
							
							each(files, function(i, v) {
								var file_name = source_path + dir_separator + v[0];
								if(file_name.substring(file_name.lastIndexOf(".")) !== ".png") return;
								
								// the dest path is the dest file path.
								//  the full path + name of the file.
								
								var file_dest_path = dest_path + dir_separator + v[0];
								console.log('file_dest_path ' + file_dest_path);
								//throw stop;png_opacity_border
								
								fns.push([fs2.png_opacity_border, [file_name, file_dest_path, color]]);
								/*
								fs2.png_opacity_border(file_name, dest_path, function(err, res) {
									if (err) {
										//console.log(err);
										throw err;
									} else {
										
									}
								});
								*/
							});
							
							call_multiple_callback_functions(fns, function(err, res) {
								if (err) {
									throw err;
								} else {
									callback(null, res);
								}
								
							});
							
						});
					}
				});
				
			}
			
			
			//if(!dest_path){

			//		dest_path = source_path + '_opacity_border';
			//}

			
		}),
		'new_placeholder': function(full_path, width, height, color, text, callback) {

			var html = new Control({
			});

			html.set('dom.tagName', 'html');

			var head = new Control({
			});
			head.set('dom.tagName', 'head');

			var body = new Control({
			});
			body.set('dom.tagName', 'body');
			body.get('dom').get('attributes').set('style', 'overflow:hidden');
			var style = new Control({
			});
			style.set('dom.tagName', 'style');
			var content = new jsgui_html.textNode('h1{ width:' + width + 'px; height:' + height + 'px; background-color:#' + color + ';}');
			
			style.get('content').add(content);

			html.get('content').add(head);
			head.get('content').add(style);
			html.get('content').add(body);


			content = new jsgui_html.textNode(text);

			var h1 = new Control({});
			h1.set('dom.tagName', 'h1');
			h1.get('content').add(content);

			body.get('content').add(h1);




			//throw stringify(html.all_html_render());

			var dir = full_path.substring(0,full_path.lastIndexOf('/'));
			
			var temp_html_file 	= "temp_html.html";
			var temp_ps_file   	= "temp_ps.ps";
			var out_file		= "new_placeholder.png";

			fs.writeFile(dir + dir_separator + temp_html_file, html.all_html_render(), function (err) {
					if (err) {
						throw err;
					} else {

						phantom.create(function(ph) {
							    return ph.createPage(function(page) {

							      return page.open(dir + dir_separator + temp_html_file, function(status) {
							    
							        page.render(out_file);

							        });

						     	});

				     	});
							

									

					}
			});


			


		}

	}


	var isArray = function isArray(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	};

	var each = function(collection, fn, context) {
		// each that puts the results in an array or dict.
		if (collection) {
			if (isArray(collection)) {
				var res = [];
				for (var c = 0, l = collection.length; c < l; c++) {
					var res_item;
					if (context) {
						res_item = fn(c, collection[c]);
					} else {
						res_item = fn.call(context, c, collection[c]);
					}
					res.push(res_item);
				}
				return res;
			} else {
				var name, res = {};
				for (name in collection ) {
					if (context) {
						res[name] = fn.call(context, name, collection[name]);
					} else {
						res[name] = fn(name, collection[name]);
					}
				}
				return res;
			}
		}
	};

	var stringify = function (obj, includeFunctions) {
	    // Designed for stringifying specs including functions in mind.
	    var t = typeof obj, res = '';
	    if (t == 'object') {
	        var ia = isArray(obj);
	        if (ia) {
	            res = res + '[';
	            var first = true;
	            for (var c = 0; c < obj.length; c++) {
	                if (!first) res = res + ', ';
	                res = res + stringify(obj[c]);
	                first = false;
	            };
	            res = res + ']';
	        } else if (obj == null) {
	            res = 'null';
	        } else if (obj.typeName) {
	            res = res + '{"ctrl": "' + obj.ensureId() + '"}';
	        } else {
	            //console.log('obj ' + obj);
	            var first = true;
	            res = res + '{';
	            each(obj, function (i, v) {
	                //console.log(tof(v));
	                if (includeFunctions !== false && typeof v !== 'function') {
	                    if (!first) res = res + ', ';
	                    res = res + '"' + i + '": ' + stringify(v);
	                    first = false;
	                }
	            });
	            res = res + '}';
	        };
	    } else if (t == 'string') {
	        // Escape characters in JSON string?
	        res = '"' + obj + '"';
	    } else if (t == 'undefined') {
	        res = 'undefined';
	    } else if (t == 'function') {
	        if (includeFunctions !== false) {
	            res = obj.toString();
	        }
	    } else {
	        res = obj.toString();
	    }
	    return res;
	};



	//module.exports = fs2;
	return fs2;
});

