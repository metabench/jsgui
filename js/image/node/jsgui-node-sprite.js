// Likely to change to using a Typed Array (or part of one) rather than a buffer.

// Using various procedures with Typed Arrays makes a lot of sense.
//  Having an OO wrapper would help in some cases but not all.





if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../../core/jsgui-lang-essentials', 'fs', 'path', 'module',
    './jsgui-sprite-arrange', './jsgui-node-png', './jsgui-node-image', './pixel-buffer'],
    function(jsgui, fs, path, module,
        jsgui_sprite_arrange, node_png, node_image, Pixel_Buffer) {
//define(['jsgui-lang-essentials', 'fs', 'path', 'module', 'jsgui-sprite-arrange', 'jsgui-node-png', 'jsgui-node-image'],

//define(['jsgui-lang-essentials', 'fs', 'path', 'module', 'jsgui-sprite-arrange', 'jsgui-node-png', 'jsgui-node-image', 'jsgui-node-pixel-buffer'],
//    function(jsgui, fs, path, module, jsgui_sprite_arrange, node_png, node_image, Pixel_Buffer) {


//define(['jsgui-lang-essentials', 'fs', 'path', 'module', 'jsgui-sprite-arrange', 'jsgui-node-png', 'jsgui-node-image'],
//    function(jsgui, fs, path, module, jsgui_sprite_arrange, node_png, node_image) {


        var tof = jsgui.tof, each = jsgui.each;
        var stringify = jsgui.stringify;

        // may want to create a PNG to output from files.



        var res = {

            // creating a sprite png out of pngs should be faster.
            //  will have direct png->png copying.
            //  maybe via unfiltered scanline buffers.

            // also want to (rapidly) save optimized PNGs.


            'rgba_buffer_from_files': function(sources_paths, callback) {
                // get the sprite arrangement

                // then compose the image.

                // should possibly make and test the PNG composition to start with.

                // create a new png image

                // write pixel data to it
                // can use a bitblt like function
                //  but would be simpler to use decoded pixel data.

                // a new PNG class?
                //  An image class for composing the image onto?
                //  Then use it to create a PNG?
                //   That would have the advantage of possibly saving to other formats.

                // Basically want to load the images to RGBA buffers
                //  And copy these buffers into place in the larger result RGBA buffer.

                // creating the sprite...

                //  and to save it as well?

                // Maybe write more code for some general image mapipulation.

                // as well as this, will need to name the sprite.
                //  for the moment, call it sprite.png?

                // or have the time and date in the filename?

                // console.log("module's path is: " + module.uri);
                // console.log("module's dir is: " + path.dirname(module.uri));

                //var dest_file_name =

                // can create a pixel buffer of the right size...
                //console.log('rgba_buffer_from_files ');
                jsgui_sprite_arrange.from_files(sources_paths, function(err, res_arranged_images) {
                    // go through the arranged images, putting them into place.

                    var sprite_dimensions = res_arranged_images[0];
                    var arranged_images = res_arranged_images[1];

                    // create the new RGBA buffer of the required size.

                    // load the various images, get them as rgba buffwers.
                    //console.log('arranged_images ' + stringify(arranged_images));
                    // maybe jsgui-node-images.
                    //  use that to load an image as an RGBA buffer.

                    // then use jsgui-node-images or jsgui-node png to save the image in the right format.

                    // do want to be able to stream an image while it's loading from disk or the net and decode it.

                    //jsgui_node_images.load_rgba32_from_disk(path, callback);

                    // a streaming decode would work better.


                    // we can load the various images as pixel buffers.

                    //  we create a new pixel buffer for the result.

                    // (then we save that pixel buffer to the chosen location)

                    // this module deals with creating the sprite pixel buffer.

                    // another module would save that buffer as a PNG.
                    //  but a function to create a sprite on disk would be useful here.
                    //  we'll call on that functionality, perhaps have flexibility on the save format.

                    var pb = new Pixel_Buffer({
                        'size': sprite_dimensions
                    })

                    // then need to sequentially load the various images into this.
                    //  can use call multiple here.
                    //  and each one has a callback where we copy the loaded pixel data?

                    var num_to_process = arranged_images.length;
                    var image_number = 0;

                    //console.log('pre process_image');

                    // png... place_image_from_pixel_png

                    var process_image = function() {
                        var image_info = arranged_images[image_number];

                        // then we load in that image.

                        var image_path = image_info[0];
                        var image_metadata = image_info[1];
                        var image_pos_in_sprite = image_metadata.pos;

                        // load that image up as an RGBA pixel buffer
                        //throw 'stop';
                        node_image.load_rgba_buffer_from_disk(image_path, function(err, img_rgba_buffer) {
                            //throw 'stop';
                            //console.log('img_rgba_buffer.buffer.length ' + img_rgba_buffer.buffer.length);

                            // then copy from this rgba buffer into the right position in the resultant rgba buffer.
                            //  can do this via the pixel iteration, or maybe a faster direct buffer copy, that copies lines from the source to
                            //  places in the target's buffer.

                            pb.place_image_from_pixel_buffer(img_rgba_buffer, image_metadata.pos);

                            //console.log('image_info ' + stringify(image_info));

                            image_number++;
                            if (image_number < num_to_process) {
                                process_image();
                            } else {
                                done_processing();
                            }
                        });
                    }

                    process_image();

                    var done_processing = function() {
                        //console.log('done_processing');
                        callback(null, pb);
                    }
                })
            }
        }

        //var res = {};

        return res;


    }
);
