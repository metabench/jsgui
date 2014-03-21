
if (typeof define !== 'function') { var define = require('amdefine')(module) }

// May put this within the AMD system, so that jsgui-lang-essentials can be loaded more easily.

//var fs2 = require('fs2');
	var querystring = require('querystring');
	var fs = require('fs');
	var path = require('path');
	var libxmljs = require("libxmljs");
	var dir_separator = '/';
	
	

define(['module', 'path', "./jsgui-html", 'fs2' , 'querystring', './jsgui-file-manager'], function (module, path, jsgui, fs2, querystring, jsgui_File_Manager) {
	
	// Maybe make fs2 not need libsxmljs...
	//  Just having the JavaScript XML reading will increase compatability.
	
	
	var File_Manager = jsgui_File_Manager.File_Manager;
	var File = jsgui_File_Manager.File;
	var Directory = jsgui_File_Manager.Directory;
	
	
	var __dirname = path.dirname(module.uri);

	var stringify = jsgui.stringify;
	var each = jsgui.each;

	//if (process.platform === 'win32') dir_separator = '\\';


	var ensure_ends_with_dir_sep = function(path) {
		var l = path.length;
		var res = path;
		if (path.substring(l - 1) !== dir_separator) {
			res = res + dir_separator;
		}
		return res;
	}


	var call_multiple_callback_functions = function(arr_functions_params_pairs, callback) {
		var res = [];
		
		var l = arr_functions_params_pairs.length;
		var c = 0;
		var that = this;
		
		var process = function() {
			var pair = arr_functions_params_pairs[c];
			var fn = pair[0];
			var params = pair[1];
			var i = c;
			c++;
			
			var cb = function(err, res2) {
				console.log('cb');
				
				if (err) {
					
				} else {
					res[i] = res2;
					if (c < l) {
						process();
					} else {
						callback(null, res);
					}
				}
			}
			params.push(cb);
			fn.apply(that, params);
		}
		process();
	}
	
	
    // StiffArray: an array with pre-allocated items
    // it seems that this array is usually faster (excluding IE javascript engine)
    // probably there is a reason to provide IE implementation based on usual dynamic arrays
	var process_command = function(root_path, path_in_app, command_name, obj_params, callback) {
		console.log('root_path ' + root_path);
		console.log('path_in_app ' + path_in_app);
		console.log('command_name ' + command_name);
		console.log('obj_params ' + stringify(obj_params));	
		// then we check what the command name is.
		
		// maybe check what sort of object the path given is - file or directory?
		
		if (command_name == 'dir_resize') {
			// will go through the directory, resizing the files.
			
			// maybe make a file resize command.
			//  this will have a callback.
			
			// dir_resize will do simultaneous processing to resize the files.
			
			var dir_path = path_in_app;
			console.log('dir_path ' + dir_path);
			
			// path of target dir...
			
			var source_dir_path = __dirname + dir_separator + dir_path + dir_separator + obj_params.source;
			var dest_dir_path = __dirname + dir_separator + dir_path + dir_separator + obj_params.dest;
			
			console.log('source_dir_path ' + source_dir_path);
			console.log('dest_dir_path ' + dest_dir_path);
			
			fs2.resize_dir_images(source_dir_path, dest_dir_path, obj_params.size, function(err, res_resize_dir_images) {
				console.log('callback for resize images');
				
				if (err) {
					
				} else {
					callback();
				}
				
			})
		}
		
		
		if (command_name == 'resize_png_directory') {
			// from within a parent dir I think?
			
			// source dir name
			// source image density (overrides imageMagick not knowing because it has not been saved)
			// target dir name
			// target image density (not sure that this gets saved by imagemagick)
			
			// May use another program / process to edit and read the PNG metadata.
			
			var source_dir_name = obj_params.dir_source;
			var dest_dir_name = obj_params.dir_dest;
			
			var source_dir_path = __dirname + dir_separator + path_in_app + dir_separator + source_dir_name;
			var dest_dir_path = __dirname + dir_separator + path_in_app + dir_separator + dest_dir_name;
			
			var input_density = obj_params.source_density;
			var output_density = obj_params.dest_density;
			
			// 'convert_rescale_png_directory_to_png_directory': function(source_dir_path, source_image_density, target_dir_path, target_image_density, callback)
			fs2.convert_rescale_png_directory_to_png_directory(source_dir_path, input_density, dest_dir_path, output_density, function(err, res) {
				if (err) {
					throw err;
				} else {
					console.log('convert_rescale_png_directory_to_png_directory res ' + stringify(res));
					callback(null, res);
				}
			})
		}
		
		// convert an SVG composites directory to various output PNGs.
		//  different pixel densities in different folders.
		//  shrunk down from the large png outputs
		//  or different pixel densities composed individually from the SVGs could work better still.
		
		// some more general convert commands that work with directories could be useful as well.
		//  and then want to integrate the filter / edge detection and border finding and border image generation system.
		
		// compressed (maybe call min) directory contents
		//  may change to different ways of compressing things.
		//  can compress things with a limited number of colors in the pallets.
		//  will try various PNG compression tools.
		// may be worth doing more careful analysis of the colors used in various pngs so that they can be put on the same sprite sheet.
		//  could have a relatively small number of sprite sheets used, with different colors emphasised in each of them.
		
		
		
		
		
		
		// extract all the items from SVG files within a directory
		//  1) Extract single SVG items from SVG files containing multiple items. 
		//    to filename/extracted_svgs/
		//  2) Convert those SVGs to PNGs, putting them in a different directory.
		//    filename/result_pngs/
		
		
		if (command_name == 'png_directory_to_spritesheet') {
			var dir_path = path_in_app;
			console.log('dir_path ' + dir_path);
			
			var full_path = __dirname + dir_separator + dir_path;
			
			fs2.png_directory_to_spritesheet(full_path, function(err, res) {
				if (err) {
					
				} else {
					console.log('callback png_directory_to_spritesheet');
				}
			});
			
		}
		
		// png_extract_constituent_parts
		// for when there are different items in the PNG image that get extracted separately
		
		//Getting bitmaps of constiuent parts / blobs
		//  Identifying blobs, getting a bitmap with all of the constituent parts labelled.
		
		// Getting the SVG root groups from a document
		//  They are this way in 'buttons'
		//  Can then render these to png.
		
		
		// svg_process_composites for one single SVG file.
		
		
		
		// More likely to be removed - similar things will be part of a build procedure.
		if (command_name == 'dir_process_svg_composites') {
			// This is the main function to get the resultant images out of the provided SVGs.
			// THE FULL PROCESSING.
			// It will call plenty of other functions.
			
			// It will have various options that are a default for this project, and can be set as well.
			
			// Get the SVGs out of the composite images into their own directories.
			
			// Carry out the extract named items command...
			//  Need to maybe make the commands more OO, or use some functions for them.
			
			
			var dir_path = path_in_app;
			//console.log('dir_path ' + dir_path);
			
			var full_path = __dirname + dir_separator + dir_path;
			
			fs2.dir_extract_svg_composite_components(full_path, full_path, function(err, res) {
				if (err) {
					throw(err);
				} else {
					callback('dir_extract_svg_composite_components');
					
					// then process these svg components into pngs of the varying sizes.
					
					// something in fs 2 that processes the SVGS to a range of outputs.
					
					
					// Maybe a function that produces the sprite sheets only, for varied dpis.
					//fs2.dir_svg_dirs_to_png24_dirs(full_path, 144, function(err, res) {
						
					fs2.dir_svg_dirs_to_png32_dirs(full_path, [72], function(err, res) {
						if (err) {
							
						} else {
							console.log('dir_process_svg_composites dir_svg_dirs_to_png32_dirs res ' + res);
							
							// have it make compressed 32 color versions of those PNGs
							//  could make spritesheets with 8 images each.
							
							fs2.dir_png32_dirs_to_png8_quant_dirs(full_path, 32, function(err, png8_quant_dirs) {
								if (err) {
									throw(err);
								} else {
									console.log('quanted dirs png8_quant_dirs ' + stringify(png8_quant_dirs));
									//throw('stop');
									// then process the quanted dirs to spritesheets?
									
									fs2.dir_png_8_quant_dirs_to_spritesheet_dir(full_path, function(err, res) {
										// maybe will specify the location / full name of the spritesheets and css spriteheet info.
										
										if (err) {
											throw(err);
										} else {
											// need to get the paths of the created spritesheets.
											console.log('cb dir_png_8_quant_dirs_to_spritesheet_dir res ' + stringify(res));
											//throw('stop');
											// load the file list in the dirs?
											
											// png8_quant_dirs
											
											var sprite_file_paths = [];
											each(png8_quant_dirs, function(i, quant_dir_path) {
												var fp = quant_dir_path + dir_separator + 'sprite.png';
												sprite_file_paths.push(fp);
												
											});
											
											console.log('sprite_file_paths ' + sprite_file_paths);
											var fcs = [];
											each(sprite_file_paths, function(i, spritesheet_path) {
												console.log('spritesheet_path ' + spritesheet_path);
												var new_quant_path = spritesheet_path.substring(0, spritesheet_path.length - 4) + '_quant.png';
												
												fcs.push([fs2.png_quant, [spritesheet_path, new_quant_path, 256]]);
											});
											
											// then quant compress the spritesheet.
											call_multiple_callback_functions(fcs, function(err, res) {
												if (err) {
													throw(err);
												} else {
													callback(null, res);
													
												}
											});
											
											/*
											
											var spritesheet_paths = [];
											
											each(res, function(i, v) {
												console.log('');
												console.log('v ' + stringify(v));
												
												// then go through v, looking at the paths, see if any of the file names are sprite.png
												
												each(v, function(i2, v2) {
													console.log('v2 ' + stringify(v2));
													if (v2.filename == 'sprite.png') {
														spritesheet_paths.push(v2.path);
													}
												})
												
											});
											
											console.log('spritesheet_paths ' + stringify(spritesheet_paths));
											
											// create function calls for handling these spritesheet paths.
											
											var fcs = [];
											each(spritesheet_paths, function(i, spritesheet_path) {
												console.log('spritesheet_path ' + spritesheet_path);
												var new_quant_path = spritesheet_path.substring(0, spritesheet_path.length - 4) + '_quant.png';
												
												fcs.push([fs2.png_quant, [spritesheet_path, new_quant_path]]);
											});
											
											// then quant compress the spritesheet.
											call_multiple_callback_functions(fcs, function(err, res) {
												if (err) {
													throw(err);
												} else {
													callback(null, res);
													
												}
											});
											*/
											/*
											var sprite_info = res[0][0];
											console.log('sprite_info ' + stringify(sprite_info));
											//var sprite_path = sprite_info.path;
											
											// then make a quant 256 version of the sprite.
											
											var new_quant_path = sprite_path.substring(0, sprite_path.length - 4) + '_quant.png';
											
											fs2.png_quant(sprite_path, new_quant_path, 256, function(err, res) {
												if (err) {
													throw(err)
												} else {
													console.log('done png quant rename on spritesheet');
												}
											})
											*/
										}
									});
								}
							});
						}
					});
				}
			})
		}
		
		// dir_svg_dirs_to_png_dirs
		//  and can have different export options.
		//  could posibly carry out png quant / pngcrush
		//  output options would be a good things here. could include quant in this step.
		
		if (command_name == 'dir_svg_dirs_to_png_dirs') {
			var dir_path = path_in_app;
			//console.log('dir_path ' + dir_path);
			var full_path = __dirname + dir_separator + dir_path;
			
			fs2.dir_svg_dirs_to_png_dirs(full_path, function(err, res) {
				if (err) {
					throw(err);
				} else {
					callback('callback dir_svg_dirs_to_png_dirs res ' + stringify(res));
				}
			});
		}
		
		if (command_name == 'dir_extract_svg_components') {
			var dir_path = path_in_app;
			//console.log('dir_path ' + dir_path);
			var full_path = __dirname + dir_separator + dir_path;
			fs2.dir_extract_svg_composite_components(full_path, full_path, function(err, res) {
				if (err) {
					throw(err);
				} else {
					callback('dir_extract_svg_composite_components');
				}
			});
		}
		
		// So will be creating quite a few directories and files in the process.
		
		if (command_name == 'convert_svg_composites_directory_to_png32s') {
			
			// Process each of the files one at a time.
			//  Will be building up sub-commands, I think.
			
			//svg_extract_named_items
			
			// Will call something in fs2 probably.
			
			//console.log('convert_svg_composites_directory_to_png24s');
			
			var dir_path = path_in_app;
			//console.log('dir_path ' + dir_path);
			
			var dest_dpi = obj_params.dest_dpi || 288;
			//console.log('dest_dpi ' + dest_dpi);
			// keep them in the same directory.
			
			// get all file names of that type. (.svg)
			var full_path = __dirname + dir_separator + dir_path;
			
			fs2.convert_svg_composites_directory_to_png32s(full_path, dest_dpi, function(err, res) {
				if (err) {
					
				} else {
					//console.log('completed');
					callback(null, res);
				}
			});
		}
		
		// convert within that directory.
		if (command_name == 'dir_pngquant') {
			var dir_path = path_in_app;
			//console.log('dir_path ' + dir_path);
			// keep them in the same directory.
			// get all file names of that type. (.svg)
			var full_path = __dirname + dir_separator + dir_path;
			// also want to come up with a new destination path.
			var dest_path = full_path + '_pngquant_' + 64 + 'c';
			
			fs2.pngquant_directory(full_path, dest_path, function(err, res) {
				if (err) {
					throw err;
				} else {
					console.log('pngquant_directory res ' + res);
					
				}
			});
		}
		
		// Should create a new directory, should probably have that directory set as a parameter, perhaps optional parameter.
		// May be better using object separation to get some things out of the SVGs.
		
		// Split png to distinct objects sounds like the right approach to take.
		//  Just as long as it does not take all that long.
		
		// Create an image that is the outline, with non-transparent pixels
		//  Then use that one to label the contiguous objects
		
		// Splitting various objects from a PNG makes sense
		//  It will also make sense when removing dislocated specs from the tomato sauce jar png.
		
		// This image processing will be very effective.
		//  Will likely have a process for processing the kettlechips images - different things to do to various different SVG images.
		
		// then the means to generate the transparency vector
		
		// This will be refactored to allow for destination file names or paths to be specified.
		if (command_name == 'png_opacity_mask') {
			// generates and saves an opacity mask from the PNG file.
			// Then the opacity mask will be used to detect contiguous areas (separate objects on a transparent background).
			//  They will then be able to be exported separately from the original.
			
			// Also may look for contiguous objects, each bounded by a rectangle.
			//  Detect those rectangles.
			var dir_path = path_in_app;
			console.log('dir_path ' + dir_path);
			// keep them in the same directory.
			
			// get all file names of that type. (.svg)
			var full_path = __dirname + dir_separator + dir_path;
			// can get the dest_dpi or dpi from parameters / querystring.
			//  maybe look in request body as well, could be different ways of using this RESTful interface.
			
			fs2.png_opacity_mask(full_path, function(err, res) {
				if (err) {
					
				} else {
					console.log('completed');
					callback(null, res);
				}
			});
		}
		
		if (command_name == 'png_opacity_border') {
			// generates and saves an opacity mask from the PNG file.
			
			// Then the opacity mask will be used to detect contiguous areas (separate objects on a transparent background).
			//  They will then be able to be exported separately from the original.
			
			// Also may look for contiguous objects, each bounded by a rectangle.
			//  Detect those rectangles.
			var dir_path = path_in_app;
			//console.log('dir_path ' + dir_path);
			
			// keep them in the same directory.
			
			// get all file names of that type. (.svg)
			var full_path = __dirname + dir_separator + dir_path;
			// can get the dest_dpi or dpi from parameters / querystring.
			//  maybe look in request body as well, could be different ways of using this RESTful interface.
			
			fs2.png_opacity_border(full_path, function(err, res) {
				if (err) {
					
				} else {
					console.log('png_opacity_border completed');
					callback(null, res);
				}
			});
		}
		
		// png_opacity_border
		
		// png_to_contiguous components;
		//  for pngs with a transparent background.
		//  makes a map of where the different contiguous components are.
		
		// will keep some data in memory about those various pieces? Will be able to extract the various disconnected items from a PNG.
		//  can save that info as JSON, or return it from the function.
		//  could sort by the number of pixels in each area.
		
		if (command_name == 'svg_to_png32') {
			// can keep the same filename, change the extension, give it png_24 prefix.
			
			
			var dir_path = path_in_app;
			console.log('dir_path ' + dir_path);
			
			// keep them in the same directory.
			
			// get all file names of that type. (.svg)
			var full_path = __dirname + dir_separator + dir_path;
			// can get the dest_dpi or dpi from parameters / querystring.
			//  maybe look in request body as well, could be different ways of using this RESTful interface.
			
			fs2.svg_to_png32(full_path, 72, function(err, res) {
				if (err) {
					
				} else {
					console.log('completed');
					callback(null, res);
				}
			});
		}
		
		if (command_name == 'dir_rename_files_no_dollar_signs') {
			var full_path = __dirname + dir_separator + path_in_app;
			fs2.dir_rename_files_no_dollar_signs(full_path, function(err, res) {
				if (err) {
				} else {
					console.log('completed');
					callback(null, res);
				}
			});
		}
		
		// output density?
		//  want to really work out scaling.
		
		//  output density from 72 dpi assumed.
		
		if (command_name == 'dir_svg_to_png32') {
			// can use imagemagick convert.
			// can also convert them to a giant size to begin with for extra accuracy and ability to maybe present them a little larger than expected and also in 
			//  hi-res for the hi-res devices.
			
			console.log('dir_svg_to_bmp ');
			var dir_path = path_in_app;
			console.log('dir_path ' + dir_path);
			
			// keep them in the same directory.
			// get all file names of that type. (.svg)
			var full_path = __dirname + dir_separator + dir_path;
			
			// that means changing the last part of the full path.
			// function to convert the directory name based on content type.
			//  directory name
			
			// system of reading and changing directory prefixes?
			var pos1 = dir_path.lastIndexOf(dir_separator);
			
			// also, not sure if I should be using dir separator there.
			var beginning = dir_path.substring(0, pos1);
			console.log('beginning ' + beginning);
			var ending = dir_path.substring(pos1 + 1);
			console.log('ending ' + ending);
			
			//console.log('new_ending ' + new_ending);
			
			//throw ('9) stop');
			// want to actually convert svg directory... dealing with directories as having a bunch of items of the same format.
			
			// convert_svgs_directory_to_png24s_directory
			console.log('target_dir_path ' + target_dir_path);
			//throw('stop');
			
			var output_density = obj_params.output_density || 72;
			var target_dir_path;
			var new_ending = 'png32_' + ending;
			if (obj_params.output_density) {
				 new_ending = 'png32_' + output_density + 'dpi_ ' + ending;
				//target_dir_path = __dirname + dir_separator + beginning + dir_separator + new_ending;
			} else {
				 new_ending = 'png32_' + ending;
				//target_dir_path = __dirname + dir_separator + beginning + dir_separator + new_ending;
			}
			target_dir_path = __dirname + dir_separator + beginning + dir_separator + new_ending;
			
			fs2.convert_svgs_directory_to_png32s_directory(full_path, target_dir_path, output_density, function(err, res) {
				if (err) {
					
				} else {
					console.log('completed');
				}
			});
		}
		
		// Will move this to fs2, make it easier to call.
		//  SVG extraction is something that can be in fs2.
		//  fs2 will be expanded quite a bit to carry out operations involving files.
		//  Could maybe be provided with streams too.
		
		if (command_name == 'svg_extract_root_groups') {
			// Extracts them into a new directory
			
			var dir_path = path_in_app;
			console.log('dir_path ' + dir_path);
			
			// keep them in the same directory.
			
			// get all file names of that type. (.svg)
			var full_path = __dirname + dir_separator + dir_path;
			// will call extract_svg_composite_components
			
			fs2.svg_extract_root_groups(full_path, function(err, res) {
				if (err) {
					throw(err);
				} else {
					console.log('svg_extract_root_groups res ' + stringify(res));
					callback(null, res);
				}
			})
		}
		
		
		if (command_name == 'svg_extract_named_items') {
			// Extracts the items with ids to their own svg files.
			var dir_path = path_in_app;
			console.log('dir_path ' + dir_path);
			
			// keep them in the same directory.
			
			// get all file names of that type. (.svg)
			var full_path = __dirname + dir_separator + dir_path;
			// will call extract_svg_composite_components
			
			fs2.extract_svg_composite_components(full_path, function(err, res) {
				if (err) {
					throw(err);
				} else {
					console.log('extract_svg_composite_components res ' + stringify(res));
				}
			})
		}
		
		if (command_name == 'png8_palette') {
			// Return the PNG's palette
			//  Will use fs2 to do this for the moment.
			//  Not sure about loading it into node-rasters.
			var dir_path = path_in_app;
			console.log('dir_path ' + dir_path);
			var full_path = __dirname + dir_separator + dir_path;
			
			fs2.png8_palette(full_path, function(err, res) {
				if (err) {
					throw(err);
				} else {
					console.log('png8_palette res ' + stringify(res));
					// and a callback with the data.
					//  will set the mime-type too.
					
					var res = {
						'mime_type': 'application/json',
						'data': (res)
					};
					callback(null, res);
				}
			});
		}
		
		if (command_name == 'metadata') {
			// gets the metadata for the particular file, return it as JSON.
			var dir_path = path_in_app;
			
			var full_path = __dirname + dir_separator + dir_path;
			fs2.metadata(full_path, function(err, metadata) {
				if (err) {
					throw err;
				} else {
					// output the metadata....
					//res.writeHead(200, { 'Content-Type': 'application/json' });
					//res.write(stringify(metadata));
					//res.end();
					console.log('metadata ' + stringify(metadata));
					var res = {
						'mime_type': 'application/json',
						'data': (metadata)
					}
					callback(null, res);
				}
			})
			
		}
		/*
		if (command_name == 'biber_pixels_iterate'){
        
      		var dir_path = path_in_app;
			
			var full_path = __dirname + dir_separator + dir_path;
			
			fs2.biber_pixels_iterate(full_path, function(){
			
			});
		
		}
		*/
		if (command_name == 'png_largest_contiguous_object'){
			
			var dir_path = path_in_app;
			
			var full_path = __dirname + dir_separator + dir_path;
			
			fs2.png_largest_contiguous_object(full_path, function(){
			
			});
		}

		if (command_name == 'dir_png_opacity_border') {

			var dir_path = path_in_app;
			var full_path = __dirname + dir_separator + dir_path;

			fs2.dir_png_opacity_border(full_path);

		}

		if(command_name == 'png_opacity_border_components'){

			var dir_path = path_in_app;
			var full_path = __dirname + dir_separator + dir_path;

			fs2.png_opacity_border_components(full_path);
		}

		if(command_name == 'dir_png_opacity_border_components'){

			var dir_path = path_in_app;
			var full_path = __dirname + dir_separator + dir_path;

			fs2.dir_png_opacity_border_components(full_path);
		}

		if(command_name == 'dir_png_opacity_border_component_spritesheets'){

			var dir_path = path_in_app;
			var full_path = __dirname + dir_separator + dir_path;

			fs2.dir_png_opacity_border_component_spritesheets(full_path);
		}

		if(command_name == 'new_placeholder'){

			var dir_path = path_in_app;
			var full_path = __dirname + dir_separator + dir_path;

			var width 	= obj_params.width;
			var height	= obj_params.height;
			var color 	= obj_params.color;
			var text	= obj_params.text;


			fs2.new_placeholder(full_path, width, height, color, text, function(){


			});

		}
		
	}

	var parse_querystring = function(qs) {
		// needed because the normal (node?) one does not handle spaces properly. There could be spaces in file names, which have been escaped.
		
		var parts = qs.split('&');
		var res = {};
		console.log('parts ' + stringify(parts));
		if (parts.length == 1 && parts[0] == false) {
			
		} else {
			each(parts, function(i, part) {
				var s_part = part.split('=');
				//res[]
				var name = s_part[0];
				var value = s_part[1];
				res[querystring.unescape(name)] = querystring.unescape(value);
			});
		}
		return res;
	}
	
	
	var e_a_r = {
		'apply': function(app, root) {
			//console.log('applying express_admin_routines');
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
				
				'mp3': 'audio/mpeg3',
				'ogg': 'audio/ogg',
			}
			// and specific metadata routines for when we know the file types.
			
			function admin_files_route(req, res, next) {
				//res.end("Foo Route\n");
				//res.sendfile(__dirname + '/file_admin.html');
				// maybe will send the html if it is asked for that.
				// could otherwise be sending JSON of the files.
				// get the full URL
				
				var url = req.url;
				console.log('url ' + url);
				var that = this;
				// will return the JSON for the moment.
				//  can have a single admin page to start with.
				
				// let's return the json of the directory they are asking for.
				
				//var basic_path = '/za/admin/files';
				
				var basic_path;
				
				if (root == '') {
				    basic_path = '/' + root + '/admin/files';
				} else {
				    basic_path = '/admin/files';
				}
				
				if (url == basic_path) {
					//url = basic_path + '/';
				}
				//basic_path = basic_path + '/';
				
				var file_s_url = '';
				if (url.length > basic_path.length) {
					file_s_url = url.substring(basic_path.length);
				}
				//if (file_s_url == '') file_s_url = '/';
				if (file_s_url == '/') file_s_url = '';
				
				
				// return the JSON document.
				/*if (process.platform === 'win32') {
					file_s_url = file_s_url.replace(/(\\)/g, '\/');
				}*/
				
				console.log('file_s_url ' + file_s_url);
				
				// find the last part of the URL - filename or command.
				//  will also look at the querystring.
				
				var pos1 = file_s_url.lastIndexOf('/');
				console.log('pos1 ' + pos1);
				
				if (true || pos1 > -1) {
					var file_name_part = file_s_url.substring(pos1 + 1);
					
					//console.log('file_name_part ' + file_name_part);
					
					var s_fnp = file_name_part.split('?');
					console.log('s_fnp.length ' + s_fnp.length);
					
					// Just for a directory, it shows the metadata of the files by default.
					//  May change this, could make it optionally get the metadata.
					
					if (s_fnp.length == 2) {
						var str_command = s_fnp[0];
						var qs = s_fnp[1];
						
						//console.log('str_command ' + stringify(str_command));
						//console.log('qs ' + stringify(qs));
						
						// querystring is not working properly. Does not parse the querystring when there are spaces (escaped ones) within the values
						
						var uqs = querystring.unescape(qs);
						
						var pqs2 = parse_querystring(qs);
						
						//console.log('pqs2 ' + stringify(pqs2));
						//console.log('uqs ' + uqs);
						
						//var pqs = querystring.parse(querystring.unescape(qs));
						//console.log('pqs ' + stringify(pqs));
						
						var split_command = str_command.split('.');
						if (split_command.length == 2) {
							var command_name = split_command[0];
							//console.log('command_name ' + command_name);
							
							// then need to process the command, at that path, with those parameters
							var path_in_app = file_s_url.substring(0, pos1);
							//console.log('path_in_app ' + path_in_app);
							
							process_command(root, path_in_app, command_name, pqs2, function(err, result) {
								if (err) {
									
								} else {
									
									// the command may need to set the mime type.
									//console.log('result ' + stringify(result));
									
									if (result.mime_type) {
										res.writeHead(200, { 'Content-Type': result.mime_type });
										if (result.data) {
											res.write(stringify(result.data));
											res.end();
										}
									} else {
										res.writeHead(200, { 'Content-Type': 'text/plain' });
									}
								}
							});
						} else {
							// it can still be a command.
							var s_fnp_2 = file_name_part.split('.');
							var dir_path = ensure_ends_with_dir_sep(__dirname) + querystring.unescape(file_s_url);
							
							//console.log('** dir_path ' + dir_path);
							
							// ensure it ends with the dir_separator.
							
							fs2.dir_contents_with_metadata(dir_path, function(err, dir_contents) {
								if (err) {
									console.log('err ' + err);
								} else {
									//console.log('dir_contents ' + stringify(dir_contents));
									// return these as json.
									//console.log('result ' + stringify(result));
									
									res.writeHead(200, { 'Content-Type': 'application/json' });
									res.write(stringify(dir_contents));
									res.end();
								}
							});
						}
					} else {
						// could be a directory, with no command.
						
						var dir_path = ensure_ends_with_dir_sep(__dirname) + querystring.unescape(file_s_url);
						
						console.log('dir_path ' + dir_path);
						
						// if it ends with '.command'
						var command_ending = '.command';
						//console.log('dir_path.substring(dir_path.length - command_ending.length) ' + dir_path.substring(dir_path.length - command_ending.length));
						if (dir_path.substring(dir_path.length - command_ending.length) == command_ending) {
							// process this as a command for whatever was before the /
							var pos1 = dir_path.lastIndexOf(dir_separator);
							
							// need to get the path within the application.
							// the file_or_dir_name needs to be the name within the app.
							//console.log('file_s_url ' + file_s_url);
							
							var file_or_dir_name = querystring.unescape(file_s_url);
							var pos2 = file_or_dir_name.lastIndexOf(dir_separator);
							file_or_dir_name = file_or_dir_name.substring(0, pos2);
							
							//var file_or_dir_name = path.basename(dir_path.substring(0, pos1));
							//console.log('file_or_dir_name ' + file_or_dir_name);
							
							// then we execute that command on the file or dir.
							var command_name = dir_path.substring(pos1 + 1, dir_path.length - command_ending.length);
							//console.log('* command_name ' + command_name);
							
							process_command(root, file_or_dir_name, command_name, {}, function(err, result) {
								if (err) {
									throw(err);
								} else {
									//console.log('result ' + stringify(result));
									if (result.mime_type) {
										res.writeHead(200, { 'Content-Type': result.mime_type });
										if (result.data) {
											res.write(stringify(result.data));
											res.end();
										}
									} else {
										res.writeHead(200, { 'Content-Type': 'text/plain' });
									}
								}
							});
							
						} else {
							
							console.log('1) Accessing directory');
							
							// we can show the filemanager for this path...
							
							// will require rendering a complete document to send to the client.
							
							// Will use jsgui html document rendering, and get that doing the whole rendering.
							//  Then when it reaches the client, the control will be activated.
							
							// Should be able to build this incrementally... create, render and send an HTML document.
							//  May render blank document, then put a single control in it.
							//  Blank document would have references to the needed script and css files.
							
							// Will now be using jsgui html, quite a large requirement chain.
							//  May make it use jsgui-html-toolkit.
							//  That could include various things such as menus and selectable behaviour.
							//   Then can get back to this grid movement transition for files that are getting dragged.
							
							// Create the new HTML document from jsgui html.
							//  That document may make a few assumptions about files it can reference.
							
							// May also have the page context at this time, or be able to get it without too much difficulty.
							
							
							
							// Want to give it a directory structure.
							
							// Will tell it which directory we are in as well.
							//  Will give it the app directory structure up to this one.
							
							// The file and directory objects are part of the MVC system, so will be able to be updated dynamically.
							
							// However, to start with, we just want the file manager to render its initial view from the server.
							//  Then from the client, code will be run that activates the control.
							
							// The File_Manager may expect a relatively large amount of data to be provided to it.
							
							// Can feed it info to build up its knowledge of the file system.
							
							// I think giving the file manager the root directory of the app makes the most sense for the moment.
							
							// load the actual root directory files...
							
							// approot variable?
							
							// dir_path for the moment, or its equivalent withing require.js.
							
							// get the __dirname directory from disk.
							//  That is the root directory for the app.
							
							//console.log('2) dir_path ' + dir_path);
							
							/*
							var root_directory = new Directory({
								
							})
							*/
							//file_manager.set('root_directory', )
							
							
							// but get the root directory's info... build that up into the Directory we give to the control.
							//  Then the control should recursively add the content,
							//   and display the necessary directories as being open.
							// ensure_ends_with_dir_sep(__dirname)
							// dir_path
							//console.log('file_s_url ' + file_s_url);
							
							// we get the root directory, but need to get all directories between there and a destination directory.
							
							// fs2.dir_contents_with_metadata_to_path
							//  iterating to a path.
							//   from a path, and open every directory to that path.
							//   get the contents of directories along the way, including metadata.
							
							var source_root_dir_path = ensure_ends_with_dir_sep(__dirname);
							console.log('source_root_dir_path ' + source_root_dir_path);
							//throw 'stop';

							fs2.dir_contents_with_metadata_to_path(source_root_dir_path, dir_path, function(err, contents) {
								// that gets a directory tree structure, but only expanded to one path.
								
								if (err) {
								
									
									throw err;
								} else {
									
									//console.log('');
									console.log('contents ' + stringify(contents));
									//throw('stop');
									// now, with that larger directory JSON-obj tree we can create the programmatic one, maybe give it to the
									// UI control.
									
									// Loading it into some kind of a model could be best
									//  Perhaps a control can maintain its own model if it needs to.
									
									//console.log('that._context ' + that._context);
									//throw 'stop';
									
									var spc = new jsgui.Server.Page_Context({
                                        'request': req,
                                        'response': res,
                                        'rendering_mode': 'html5'
                                    });
									
									var root_dir = new Directory({'context': spc})
									//console.log('dir_contents ' + stringify(dir_contents));
									
									
									root_dir.set_contents(contents);
									console.log('root_dir._ ' + stringify(root_dir._));
									//throw 'stop';
									
									
									var html_doc = new jsgui.html({'context': spc});
									var head = new jsgui.head({'context': spc});
									
									// add css link to the head.
									
									// need to create objects with the right context...
									// need to create a new server page context for each request.
									
									
									
									
									//<link rel="stylesheet" type="text/css" href="theme.css" />
									var stylesheet = new jsgui.Control({'context': spc});
									stylesheet.get('dom').set('tagName', 'link');
									stylesheet.get('dom').get('attributes').set('rel', 'stylesheet');
									stylesheet.get('dom').get('attributes').set('type', 'text/css');
									
									stylesheet.get('dom').get('attributes').set('href', root + '/css/jsgui.css');
									
									head.get('content').add(stylesheet);
									
									html_doc.get('content').add(head);
									
									var body = new jsgui.body({'context': spc});
									html_doc.get('content').add(body);
									
									// then in the body we have a File_Manager control.
									
									// Can also ensure the necessary script references are in the head.
									
									// render a file manager.
									// could we do make(File_Manager({});
									
									
									
									//
									
									console.log('root_dir ' + stringify(root_dir));
									//throw 'stop';
									// it should be able to set that.
									/*
									
									
									
									
									
									
									
									*/
									/*
									var file_manager = new File_Manager({'context': spc});
									file_manager.set('root_directory', root_dir);
									
									body.get('content').add(file_manager);
									*/
									
									//file_manager.set_root_directory()
									var html = html_doc.all_html_render();
									//console.log('html ' + html);
									
									res.writeHead(200, {'Content-Type': 'text/html'});
									res.write(html);
									res.end();
								}
							});
							
							/*
							fs2.dir_contents_with_metadata(ensure_ends_with_dir_sep(__dirname), function(err, dir_contents) {
								if (err) {
									console.log('err ' + err);
								} else {
									
									
									//console.log('dir_contents ' + stringify(dir_contents));
									// return these as json.
									//res.writeHead(200, { 'Content-Type': 'application/json' });
									//res.write(stringify(dir_contents));
									//res.end();
									
									var root_dir = new Directory({})
									//console.log('dir_contents ' + stringify(dir_contents));
									
									
									
									root_dir.set_contents(dir_contents);
									//console.log('root_dir._ ' + stringify(root_dir._));
									// setting the contents... should probably make the correct Data_Objects.
									//throw('10) stop');
									
									var html_doc = new jsgui.html({});
									var head = new jsgui.head({});
									
									// add css link to the head.
									
									//<link rel="stylesheet" type="text/css" href="theme.css" />
									var stylesheet = new jsgui.Control({});
									stylesheet.get('dom').set('tagName', 'link');
									stylesheet.get('dom').get('attributes').set('rel', 'stylesheet');
									stylesheet.get('dom').get('attributes').set('type', 'text/css');
									
									
									stylesheet.get('dom').get('attributes').set('href', root + '/css/jsgui.css');
									
									head.get('content').add(stylesheet);
									
									html_doc.get('content').add(head);
									
									var body = new jsgui.body({});
									html_doc.get('content').add(body);
									
									// then in the body we have a File_Manager control.
									
									// Can also ensure the necessary script references are in the head.
									
									// render a file manager.
									
									
									
									
									
									var file_manager = new File_Manager({});
									
									
									// it should be able to set that.
									file_manager.set('root_directory', root_dir);
									
									body.get('content').add(file_manager);
									
									//file_manager.set_root_directory()
									
									
									
									var html = html_doc.all_html_render();
									//console.log('html ' + html);
									
									res.writeHead(200, { 'Content-Type': 'text/html' });
									res.write(html);
									res.end();
									
								}
							});
							*/
							
							
							
							
							
							
							
							/*
							
							
							fs2.dir_contents_with_metadata(dir_path, function(err, dir_contents) {
								if (err) {
									console.log('err ' + err);
								} else {
									//console.log('dir_contents ' + stringify(dir_contents));
									// return these as json.
									res.writeHead(200, { 'Content-Type': 'application/json' });
									res.write(stringify(dir_contents));
									res.end();
								}
							});
							*/
						}
					}
				} else {
					// show the root dir.
					var dir_path = ensure_ends_with_dir_sep(__dirname) + file_s_url;
					
					console.log('dir_path ' + dir_path);
					
					// ensure it ends with the dir_separator.
					
					fs2.dir_contents_with_metadata(dir_path, function(err, dir_contents) {
						if (err) {
							console.log('err ' + err);
						} else {
							//console.log('dir_contents ' + stringify(dir_contents));
							// return these as json.
							res.writeHead(200, { 'Content-Type': 'application/json' });
							res.write(stringify(dir_contents));
							res.end();
						}
					});
				}
			}
			
			app.get(root + "/admin/files*", admin_files_route);
			app.get(root + "/admin/files", admin_files_route);

			// ogg files to mp3
			// // http://localhost:3005/facebook/admin/files/img/dir_resize.command?target=x2_spices&dest=x1_spices&size=50%
			var isArray = function isArray(o) {
				return Object.prototype.toString.call(o) === '[object Array]';
			};
		}
	};
	
    return e_a_r;


});



// process_command(root_path, path_in_app, command_name, obj_params);

// Some of these can be moved to fs2.



//module.exports = 


