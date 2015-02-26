
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['module', 'path', 'fs', 'url', '../../web/jsgui-html', 'os', 'http', 'url', './resource',
        '../../web/jsgui-je-suis-xml', 'cookies', '../../fs/jsgui-node-fs2-core',
        //"jpeg-js",
        '../../image/node/jsgui-node-jpeg',
        '../../image/node/jsgui-node-png',
        'webworker-threads'],

    function(module, path, fs, url, jsgui, os, http, libUrl,
             Resource, JeSuisXML, Cookies, fs2,


             //jpeg_js,
             jsgui_jpeg,
             jsgui_png,
             Worker) {


        var stringify = jsgui.stringify, each = jsgui.eac, arrayify = jsgui.arrayify, tof = jsgui.tof;
        var call_multi = jsgui.call_multi;
        var filter_map_by_regex = jsgui.filter_map_by_regex;
        var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
        var fp = jsgui.fp, is_defined = jsgui.is_defined;
        var get_item_sig = jsgui.get_item_sig;
        var Collection = jsgui.Collection;

        // This resource may have quite a lot of functionality put in to deal with
        //  seriving images in an optimized way.
        // Want this so it also serves the developer in that images can be put in place
        //  and modified easily in an unoptimized way. Then they get put in place in an
        //  optimized way on request or automatically. Want to incorporate sprite sheet generation
        //  here. This should handle requests for individual images, but it's also possible sprites
        //  could be requested. If that's the case, maybe it should pass it onto a sprite resource.
        // It would be really good to have practically instant sprite generation, using C / C++
        //  and maybe OpenCL.
        // It could be requests to a sprite resource that returns a predefined selection of
        //  assets.
        // The image resource may also be called upon to return rescaled versions.
        //  That's something that OpenCL would also be very fast at.
        // The image / spritesheet resources may be connected to other database resources that provide
        //  caching and indexing of images.
        //   These would most likely be abstractions over data resources.

        // Want to make an image interface to a flexible db interface.
        //  Serving and caching optimized images would be cool.

        // Rather than relying on storing image versions in a DB (which would be cool, esp for distributed)
        //  we can store image versions + spritesheets on the local disk.
        // Cache them in RAM as well.
        //  Storing them in GPU RAM would be very cool, especially if from there we can get versions with
        //   different operations done, or the output of operations.


        // May need to change around a fair few references to make it workable.
        // May need some more complicated logic to change it to the path for service.



        // This is going to be extended so that it works with the Web_DB_Resource system.

        // Will have further handling on images, hopefully just deal with the DB side of things as file storage.
        //  Will keep image processing algorithms (and probably calls) out of the Web_DB_Postgres module, but use that interface
        //  to interact with images.

        // This module should also be comfortable dealing with images from the file system.

        // Also want to be able to quickly get thumbnails of images.

        // Will refer to images by a 'key', and also specify a size to get / display the image at
        //  The point will be to make it easy to program the appearance of the image, not having to keep track of the URL, having the image
        //   within a convenient admin system.

        // Serving a thumbnail, based on the image key, makes the most sense.

        // Want to be able to get the URL for an image from the key.
        //  Will also be able to get thumbnail URLs.

        // I think this Resource will also have more specialised functionality, possibly handlers too, that will be used by other modules.

        // Add an image to the database, along with it's metadata, and thumbnail versions.
        //  Thumbnail versions under key _400x300
        //   I think x will be an OK separator here.
        //   That size will refer to their maximum dimensions.




        // need to see what type of image it is.
        var mime_types = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'png': 'image/png',
            'svg': 'image/svg+xml'
        }

        var serve_image_file_from_buffer = function(buffer, filename, response) {
            var extname = path.extname(filename);
            console.log('extname ' + extname);

            var extension = extname.substr(1);
            console.log('extension ' + extension);

            response.writeHead(200, {'Content-Type': mime_types[extension] });
            response.end(buffer, 'binary');
        }


        var serve_image_file_from_disk = function(filePath, response) {
            var extname = path.extname(filePath);
            console.log('extname ' + extname);

            var extension = extname.substr(1);
            console.log('extension ' + extension);


            // then return the right MIME type for that extension.

            // No, don't load the image file as a string.

            // fs loadfile
            //  async, then serve it with the correct mime type, write to the response buffer.

            // can this be streamed to the response buffer?

            fs.readFile(filePath, function(err, data) {
                if (err) {
                    throw err;
                } else {
                    response.writeHead(200, {'Content-Type': mime_types[extension] });
                    response.end(data, 'binary');
                }
            });


            //fs2.load_file_as_string(filePath, function (err, data) {
            //	if (err) {
            //		throw err;
            //	} else {
            //		//var servableJs = updateReferencesForServing(data);
            //		response.writeHead(200, {'Content-Type': mime_types[extension]});
            //		response.end(data);
            //	}
            //});
        }


        var Site_Images = Resource.extend({


            'init': function(spec) {
                this._super(spec);

                this.meta.set('custom_paths', new Data_Object({}));
                // Those are custom file paths.

                // could have a collection of directories, indexed by name, that get served.

                // Index the collection by string value?
                this.meta.set('served_directories', new Collection({'index_by': 'name'}));
            },
            'start': function(callback) {
                callback(null, true);
            },
            'get_image_url': function(image_key) {

            },
            'get_icon_url': function(icon_key) {
                // May have different size icons
                //  For the moment will keep this simple.

                return '/img/icons/' + icon_key + '.png';


            },

            'get_metadata': fp(function(a, sig) {
                console.log('get_metadata sig', sig);

                var value, type_name, callback;
                if (sig == '[B,s,f]') {
                    value = a[0]; type_name = a[1]; callback = a[2];

                    if (type_name === 'jpeg') {

                        // do this in a web worker?
                        //console.log('pre run web worker')

                        /*
                         var worker = new Worker.Worker(function() {
                         console.log('running web worker')
                         //postMessage("I'm working before postMessage('ali').");
                         //this.onmessage = function(event) {
                         // But does the worker have access to jpeg_js?
                         console.log('pre decode');
                         var decoded = jpeg_js.decode(value);
                         console.log('post decode');
                         var width = decoded.width;
                         var height = decoded.height;
                         var res = {
                         'width': width,
                         'height': height,
                         'type_name': type_name
                         }
                         callback(null, res);
                         postMessage(res);
                         worker.close();
                         });
                         worker.onmessage = function(event) {
                         console.log("Worker said : " + event.data);
                         };
                         */


                        // It would be nice to improve the speed of the JPEG_JS module.

                        var jpeg = new jsgui_jpeg.JPEG({});

                        // load_size_from_buffer




                        jpeg.load_size_from_buffer(value, function(err, size) {
                            if (err) {
                                // But if there was an error loading the JPEG, it needs to raise an error.
                                //  I'm now going to use


                                throw err;

                            } else {


                                //console.log('jpeg loaded');

                                console.log('size', size);

                                //throw 'stop';

                                callback(null, {
                                    'size': size
                                });


                                /*
                                 jpeg.save_to_disk('c:\\users\\james\\test.jpeg', function(err, res_saved) {
                                 if (err) {
                                 throw err;
                                 } else {
                                 console.log('saved');
                                 throw 'stop';
                                 }
                                 });
                                 */

                                /*
                                 throw 'stop';
                                 //postMessage('done');
                                 //worker.close();
                                 var res = {
                                 'width': width,
                                 'height': height,
                                 'type_name': type_name
                                 };
                                 callback(null, res);
                                 */
                            }
                        })

                        /*
                         var decoded = jpeg_js.decode(value);
                         console.log('post decode');
                         console.log('decoded.data.length', decoded.data.length);
                         console.log('decoded', decoded);
                         throw 'stop';
                         var width = decoded.width;
                         var height = decoded.height;
                         */





                    }
                }
            }),

            '__get_resized_versions': fp(function(a, sig) {

                // No, this needs to get resized versions of itself!
                //  Also, it may make sense to work on this in Pixel_Buffer for the moment.




                var that = this, callback, arr_image_item, buffer_image, type_name;

                console.log('get_resized_versions sig', sig);

                // if it's an array, we see what type of array it is.
                //  it could be the buffer, then the type name

                // May be given an array of sizes to get.
                //  Would do the processing on Pixel Buffers.

                // Possibly asyncronous function to get this as a Pixel Buffer?
                //  Could we make a Pixel Buffer class operate directly on this class's Buffer? Should we?

                console.trace('');
                throw 'stop';

                if (sig == '[a,f]') {
                    var sig0 = get_item_sig(a[0], 1);

                    // Will be getting an array of sizes.

                    console.log('sig0', sig0);

                    if (sig0 == '[B,o]') {
                        arr_image_item = a[0];
                        buffer_image = arr_image_item[0];
                        metadata = arr_image_item[1];

                        type_name = metadata.type_name;



                        // Maybe it would be better to use a better JPEG loading library.
                        //  node-webkit could be overkill.

                        // Could even translate the existing JavaScript code to C++.
                        //  It may be more effective at loading JPEGs.

                        //var Worker = require('webworker-threads').Worker;
                        // var w = new Worker('worker.js'); // Standard API

                        // You may also pass in a function:

                        // Load the JPEG from a buffer, then generate resized versions from the RGBA pixel buffer.

                        var jpeg = new jsgui_jpeg.JPEG({});


                        jpeg.load_from_buffer(buffer_image, function(err, cb_jpeg_loaded) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('jpeg loaded');

                                // We then want to get an RGBA Pixel Buffer from it.



                                throw 'stop';
                                //postMessage('done');
                                worker.close();
                            }
                        })

                        /*
                         var worker = new Worker(function() {
                         // Probably no need to put it in a web worker.
                         //  Likely to optimize the JPEG code to use C / C++.
                         var jpeg = new jsgui_jpeg.JPEG({});
                         jpeg.load_from_buffer(buffer_image, function(err, cb_jpeg_loaded) {
                         if (err) {
                         throw err;
                         } else {
                         console.log('jpeg loaded');
                         throw 'stop';
                         //postMessage('done');
                         worker.close();
                         }
                         })
                         //postMessage("I'm working before postMessage('ali').");
                         //this.onmessage = function(event) {
                         //postMessage('Hi ' + event.data);
                         //    self.close();
                         //};
                         });
                         */
                        //worker.onmessage = function(event) {
                        //    console.log("Worker said : " + event.data);


                        //};

                        //worker.postMessage('ali');





                        //var pb = jsgui_jpeg.load_pixel_buffer_from_disk()


                        // need to do the actual resizing too.
                        //  seems best to call on code in other module.
                        //  This resource system is nice, bur we really want to be using it to expose other functionality.

                        // Could maybe use a jpeg library.









                    }

                    callback = a[1];

                }


                //throw 'stop';


            }),

            'get_document': function(key, callback) {
                // get the doc from the db.
                var that = this;
                var pool = that.meta.get('pool');
                var web_db = pool.get_resource('Web DB');


                // get document with type and metadata

                // get_document_full
                //  would return an object with a few properties, including 'document'.

                // {document, type, metadata}
                //  or value, type, metadata




                web_db.get_document_full(key, function(err, res_web_db_get_document) {
                    if (err) {
                        throw err;
                    } else {

                        // The web db could return more data.
                        //  That data could include the document type, and the metadata


                        // get_document_with_metadata
                        //  would also include the mime type



                        //console.log('res_web_db_get_document', res_web_db_get_document);

                        // callback with the document value, no metadata.

                        callback(null, res_web_db_get_document);

                    }
                });
            },

            'set_document': fp(function(a, sig) {
                // This needs to get metadata about the image document it is setting.
                //  Will also make the document in various thumbnail sizes.

                console.log('Image Resource set_document sig', sig);

                // Also want to make and save resized versions of it.
                //  Want to have a system of setting up different versions and automatic filters.
                //  When one image changes, it could / should then sequentially make all the various derived images.
                //   Don't want to implement that yet.
                //   Just want a system where it makes resized versions of the images that are set as documents.

                // I think we do want some things in the database about the id of the original image
                //  Possibly also transformation info?
                //   Maybe that should be in the metadata system?
                //   That would mean a less complicated database.
                //    I think queries for metadata should probably be really fast anyway.
                //    Get all images with an original image of ...
                //    Want to easily and quickly be able to get the resized versions of images.




                // Also needs to set the non-resized as well.

                var key, value, type_name, metadata, callback, that = this;

                var pool = that.meta.get('pool');
                //console.log('pool', pool);

                var web_db = pool.get_resource('Web DB');

                //console.log('web_db', web_db);

                //throw 'stop';


                if (sig == '[s,B,s,f]') {
                    // we work out the metadata and then use the web db resource's set_document.

                    key = a[0]; value = a[1]; type_name = a[2]; callback = a[3];

                    //console.log('callback', callback);
                    //throw 'stop';

                    // Best to get the image metadata.
                    // get_metadata
                    // value, type_name

                    // and the format is in the metadata.
                    //  maybe have type_name as fairly simple format info.
                    //  .format could be more complicated.
                    //  type_name should be fine.

                    if (type_name === 'jpeg') {
                        var jpeg = new jsgui_jpeg.JPEG({});


                        // I think load 24 bpp buffer by default when loading JPEGs.

                        jpeg.load_from_buffer(value, function(err, cb_jpeg_loaded) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('jpeg loaded');

                                //pb = jpeg.get_rgb_enhanced_pixel_buffer();

                                pb = jpeg.get_rgba_enhanced_pixel_buffer();

                                // then save a variety of smaller jpeg versions




                                // Want to save a few resized / thumbnail versions.
                                //  Want the various sizes to be configurable - part of the DB?




                                // get an rgba one.


                                // I think by default will keep the ARs.
                                // Same bits per pixel as well?

                                // would be good to save that enhanced pixel buffer as a JPEG now.

                                //  It would work out from the file name that it's a JPEG.


                                // pb.save('test.jpeg');


                                // Can save the various resized versions to the database.

                                // Could call a function to save the various resized objects.

                                console.log('jpeg.size', jpeg.size);

                                var md = {
                                    'width': jpeg.size[0],
                                    'height': jpeg.size[1]
                                }



                                // In some situations may want to load, encode before saving, maybe strip out dodgy metadata.
                                web_db.set_document(key, value, type_name, md, function(err, uploaded_image_document_id) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log('cb save_square_sized_version set_document uploaded_image_document_id: ' + uploaded_image_document_id);

                                        // When describing transformed documents, we can reference them by key rather than integer id.
                                        //  The different versions will still have different names, most likely given suffixes.


                                        // Then transform and save various versions of it.








                                        //throw 'stop';
                                        //callback2(null, res_saved);


                                        // need to look at the id of the item that was saved.
                                        //  could possibly use its key to save the resized versions.
                                        //  The resized versions will differ by name as well, but the transformations will be saved within the
                                        //  database as well. That way it will be possible to logically view the original images, being served the
                                        //  appropriate one for the device and required image size.

                                        var save_square_sized_version = function(square_size, callback2) {
                                            console.log('save_square_sized_version');
                                            //throw 'stop';

                                            var resized_128x128 = pb.get_resized([square_size, square_size]);
                                            var jpeg_128x128 = new jsgui_jpeg.JPEG({});
                                            jpeg_128x128.load_from_rgb_pixel_buffer(resized_128x128);
                                            var buffer_jpeg_128x128 = jpeg_128x128.save_to_buffer();
                                            var md = {
                                                'width': resized_128x128.size[0],
                                                'height': resized_128x128.size[1]
                                            }
                                            // Need to change the key, so insert the _128x128 before the extension.

                                            //var s_key = key.split('.');
                                            // need to replace the last full stop?
                                            var i = key.lastIndexOf('.');
                                            var key2 = key;
                                            if (i > -1) {
                                                key2 = key.substr(0, i) + '_' + square_size + 'x' + square_size + '.' + key.substr(i + 1);
                                            }

                                            console.log('key2', key2);

                                            web_db.set_document(key2, buffer_jpeg_128x128, type_name, md, function(err, res_saved) {
                                                if (err) {
                                                    throw err;
                                                } else {
                                                    console.log('cb save_square_sized_version set_document size: ' + square_size);
                                                    //throw 'stop';
                                                    callback2(null, res_saved);







                                                }
                                            });

                                            // Needs to set a document with a transformation reference.

                                            // Needs original document id.

                                            // set transformed document
                                            //  orig id uploaded_image_document_id
                                            //  transformation info
                                            //   (include the transformation type)
                                            //   possibly include the transformation parameters.
                                            //   we know it's resize from the type, but the transformation params can include the size it
                                            //    was transformed to. Could possibly use a normalized transformation parameters system.

                                            // .set_transformed_document(key2, transformed_buffer, type_name, metadata, transformation_type_name, transformation_params,
                                            //  Need to create the document, while also creating the transformation record.

                                            // Or a document itself could have a transformation source?
                                            //  Separate records would be more normalized.
                                            //  I think just a bit more sensible.

                                            // A bit like the metadata record system.
                                            //  Each transformation can have parameters which are similar in implementation to the metadata system.


                                            // Document transformations will be generally about reencoding a document.

                                            // Document_Transformations
                                            //  id
                                            //  source_document_id
                                            //  target_document_id
                                            //  transformation_verb_id

                                            // Document_Transformation_Parameters
                                            //  could have different types, like integer parameters, string parameters
                                            //   this system would help a lot with searching for documents of particular sizes.
                                            //   Would be a bit time consuming to make, but would be useful for the end system where transformed
                                            //   documents can better be searched for and retrieved very quickly.

                                            // dtrans_params
                                            //  id, transformation id, key


                                            // Document Transformation Parameter (Record)s
                                            //  id, transformation id, key
                                            // Document Transformation Integer Parameter (Record)s
                                            //  These will be some of the most useful searchable and sortable parameters

                                            // Possible transformation: encode so that it's 50KB or less. Parameter could be an integer size.

                                            // Document Transformation Integer Parameters
                                            //  id, transformation_param_id, value

                                            // Make the document transformation record + param records after the target document
                                            //  has been put into the database.


                                            // Then save the resized one, as before,



                                            // Then save the transformation that connects the two saved images.





                                        };

                                        // Looks like it needs to save the original version and get the id first.

                                        /*
                                         */

                                        save_square_sized_version(128, function(err, transformed_doc_id) {
                                            console.log('saved 128');
                                            //throw 'stop';

                                            if (err) {
                                                throw err;
                                            } else {

                                                console.log('transformed_doc_id', transformed_doc_id);

                                                web_db.ensure_transformation('resize', {'size': 128}, uploaded_image_document_id, transformed_doc_id, function(err, res_ensure_transformation) {
                                                    if (err) {
                                                        throw err;
                                                    } else {
                                                        console.log('res_ensure_transformation', res_ensure_transformation);

                                                        callback2(null, res_saved);


                                                    }
                                                })




                                                // need to save the resize transformation that connects them.



                                                //throw 'stop';

                                                //

                                                /*
                                                 save_square_sized_version(64, function(err, res) {
                                                 console.log('saved 64');
                                                 //console.log('callback', callback);
                                                 callback(null, true);
                                                 });
                                                 */



                                            }

                                        });


                                        /*
                                         save_square_sized_version(128, function(err, res) {
                                         console.log('saved 128');
                                         //throw 'stop';
                                         if (err) {
                                         throw err;
                                         } else {
                                         save_square_sized_version(64, function(err, res) {
                                         console.log('saved 64');
                                         //console.log('callback', callback);
                                         callback(null, true);
                                         });
                                         }
                                         });
                                         */







                                    }
                                });



                                // Should save the original file first, and then save the transformations based on it.






                                //  Could give an array of different sizes and filenames.

                                // Would be good to get an array of the different sizes to save as.
                                //  Could also be useful to have fields for a description of the size
                                //   eg iPhone 5 portrait full screen
                                //    also iPhone 5 portrait portrait safari iOS 6 full window
                                //     could potentially be different in iOS 7.

                                // Also different icon sizes.
                                //  For the moment, would be good to store it in a variety of different sizes.
                                //  A few thumbnail image sizes would be useful.

                                // Don't have this configurable in the DB at the moment...
                                //  However the DB needs to know which images are related.
                                //   Could have image_versions, with size restrictions and filters applied.

                                // Want to be able to handle icons in the DB.

                                // Will be storing a binary document value with modified name and size metadata
                                //  For thumbnail images, may want 256x256 max.
                                //  Or 512x512, possibly then scaled down in the browser.

                                // Then we may want 128x128 max or 64x64, scaled for viewing in a list or grid in the browser.

                                // [64, 64], [128, 128], [256, 256], [512, 512], [800, 600], [1024, 768]
                                //  [64, 64], [128, 128], [256, 256], [512, 512], [1024, 1024]
                                //   second option seems better.






                                // jpeg.save_resized()

                                // Want to make and save a max 64x64 version.
                                //  It needs to be saved in the database as a different size.

                                // put this in a function, so we can set a bunch of them quickly

                                // And the save square sized version will deal with the db document transformation system.
                                //  Needs to mark the result images as being resized transformations based on an original.








                                // Set a few resized versions....
                                // 128x128
                                // 258x256
                                // 512x512







                                // then save that JPEG to the database.

                                // want to get the encoded JPEG buffer.



                                // then create and save a JPEG with those max dimensions.




                                /*
                                 var resized = pb.get_resized([800, 600]);
                                 console.log('resized', resized);
                                 // Let's save the resized.
                                 // A JPEG save pixel buffer to disk?
                                 // Could try as PNG too for the moment.
                                 jsgui_png.save_pixel_buffer_to_disk(resized, 'resized.png', function(err, res_saved) {
                                 if (err) {
                                 throw err;
                                 } else {
                                 console.log('resized image saved');
                                 }
                                 })
                                 */






                                // We then want to get an RGBA Pixel Buffer from it.



                                //throw 'stop';
                                //postMessage('done');
                                //worker.close();
                            }
                        })
                    }


                    /*
                     that.get_metadata(value, type_name, function(err, metadata) {
                     if (err) {
                     throw err;
                     } else {
                     console.log('metadata', metadata);
                     //throw 'stop';
                     // also generate the various resized images.
                     //  will get them all in an array.
                     // want the images in a bunch of convenient sizes.
                     // Could do get resized versions through this resource, giving it the buffer to work from.
                     // It would load it up as a Pixel Buffer
                     //  Maybe something that inherits from Pixel Buffer.
                     //   Raster_Image
                     //    Or something else, Enhanced_Pixel_Buffer
                     //  Enh_Pixel_Buffer, E_Pixel_Buffer
                     // Would keep the Pixel_Buffer code simple that way, but the E or Enhanced version will be able to resize images as well.
                     // get_resized_versions could quickly get the image size itself.
                     // let's try getting one resized version.
                     //throw 'stop';
                     that.get_resized_versions([value, metadata], function(err, arr_resized_versions) {
                     if (err) {
                     throw err;
                     } else {
                     // then set all of those resized versions.
                     console.log('arr_resized_versions.length', arr_resized_versions.length);
                     }
                     });
                     throw 'stop';
                     // hmmmm... maybe if the DB does not recognise the type name it treats it as binary.
                     //  or it's fine telling the DB it's a JPEG, it will also remember mime types.
                     //  The DB won't be doing type-specific processing (or hardly any)
                     //   it makes more sense to have other resources or adapters build on the solid base functionality of the WEB_DB module.
                     web_db.set_document(key, value, type_name, metadata, callback);
                     }
                     })
                     */





                }

            }),

            // can have both a directory path and a URL path.
            //  don't want to necessarily serve them under /img/




            'serve_directory': function(path) {
                // Serves that directory, as any files given in that directory can be served from /js
                var served_directories = this.meta.get('served_directories');
                //console.log('served_directories ' + stringify(served_directories));
                //served_directories.push(path);
                served_directories.push({
                    'name': path
                });
                //console.log('served_directories ' + stringify(served_directories));
                //console.log('path ' + path);

                // We may be serving directories AS something.

                //throw 'stop';

            },

            // basically get requests, but can handle more than just get.
            'process': function(req, res) {
                console.log('Site_Images processing');
                var remoteAddress = req.connection.remoteAddress;

                var custom_paths = this.meta.get('custom_paths');

                var rurl = req.url;
                var pool = this.meta.get('pool');
                // should have a bunch of resources from the pool.

                //var pool_resources = pool.resources();
                //console.log('pool_resources ' + stringify(pool_resources));

                var url_parts = url.parse(req.url, true);
                //console.log('url_parts ' + stringify(url_parts));
                var splitPath = url_parts.path.substr(1).split('/');
                //console.log('resource site css splitPath ' + stringify(splitPath));

                if (rurl.substr(0, 1) == '/') rurl = rurl.substr(1);
                rurl = rurl.replace(/\./g, '☺');
                //console.log('rurl ' + rurl);

                var custom_response_entry = custom_paths.get(rurl);


                var that = this;
                //console.log('custom_response_entry ' + stringify(custom_response_entry));

                if (custom_response_entry) {
                    var tcr = tof(custom_response_entry);
                    //console.log('tcr ' + tcr);

                    if (tcr == 'data_value') {
                        val = custom_response_entry.value();
                        //console.log('val ' + val);

                        var tval = tof(val);

                        if (tval == 'string') {
                            // then it should be a local file path, serve it.
                            serve_image_file_from_disk(val, res);
                        }
                    }
                    //throw 'stop';
                } else {
                    console.log('splitPath', splitPath);
                    if (splitPath.length > 0) {

                        // Can check for /js folder.
                        //  There will be some fixed resources for the site.
                        //   They will be served by Resource objects.
                        //  There may be some overlap of resources, with there being some very fixed purpose
                        //   specific resources that could duplicate some features of the more general ones.
                        //   Eventually, some of the code from the more specific resources will be
                        //   replacable with code from the more general ones.

                        // Site_JavaScript resource
                        //  Will serve JavaScript files needed for the site.
                        //   Could become more advanced at some points, serving particular builds.


                        // img or images

                        if (splitPath[0] == 'img' || splitPath[0] == 'images') {
                            // Possibly could be something different?
                            //  May be best to look at the path within the image resource.



                            //var sjs = pool.get_resource('Site JavaScript');
                            //console.log('sjs ' + sjs);

                            //throw 'stop';

                            // determine the name of the file to serve, serve that file
                            //  Could use some more general kind of file server.

                            // We may want to serve from disk.
                            //  I think this could work differently to an interface to the disk resource.
                            //  The image resource, like some others, could directly access the disk.
                            //   They may have their own bit of caching.


                            console.log('splitPath', splitPath);






                            if (splitPath.length > 1) {

                                // At this point, can look for the file on disk within the app directory.

                                console.log('rurl', rurl);
                                console.log('req.url', req.url);


                                // replace /images/ with /img/



                                var project_disk_path = req.url.replace('images/', 'img/');
                                if (project_disk_path.substr(0, 1) == '/') project_disk_path = project_disk_path.substr(1);

                                // try to load it from disk.
                                //  try to load it as a buffer

                                fs2.load_file_as_buffer(project_disk_path, function(err, buffer) {
                                    if (err) {
                                        console.log('error loading ' + project_disk_path + ': ' + err);


                                        // Then try serving the file using the other methods, but will need to take care not to expect some resources to be there,
                                        //  such as the web_data resource.
                                        // Want top have a very versitile web_data resource that uses a DB, but also to have the means to interact with the files on disk
                                        //  in the project directory.




                                        throw 'stop';

                                        if (splitPath.length == 2) {




                                            // Could check options to see if to look in the database, or the file system.
                                            //  Perhaps could have a website document storage abstraction that will store in the file system or the
                                            //   database.




                                            var fileName = splitPath[1];

                                            // See if we can get the document with the key of the filename of the image.
                                            //  Perhaps it will be stored as a site image.

                                            that.get_document(fileName, function(err, res_get_document) {
                                                if (err) {
                                                    throw err;
                                                } else {


                                                    //console.log('res_get_document', res_get_document);

                                                    console.log('cb get document');

                                                    // Now we have it,

                                                    var doc_keys = Object.keys(res_get_document);
                                                    console.log('doc_keys', doc_keys);

                                                    // Need to know more information, such as the type_name
                                                    //  that extra info should probably get returned from the database.





                                                }

                                            });


                                            /*
                                             //console.log('url_parts.path ' + url_parts.path);
                                             var filePath = url_parts.path.substr(1);
                                             //console.log('module.uri ' + module.uri);
                                             var val2 =  path.dirname(module.uri);
                                             console.log('val2 ' + val2);
                                             //throw '9) stop';
                                             //var diskPath = val2 + '/../../images/' + fileName;
                                             var diskPath = '../../ws/img/' + fileName;
                                             // Also making use of custom paths...
                                             // First check if such an image is in a specifically served directory.
                                             var served_directories = this.meta.get('served_directories');
                                             //console.log('served_directories ' + stringify(served_directories));
                                             // see if the file exists in any of the served directories
                                             // search for the file in the served directories.
                                             //  will be an asyncronous search, and use an array of function calls with call_multi.
                                             var fns = [];
                                             var found_path;
                                             each(served_directories, function(served_directory) {
                                             //console.log('served_directory', served_directory);
                                             var dir_val = served_directory.value();
                                             //console.log('dir_val', dir_val);
                                             var dir_name = dir_val.name;
                                             //console.log('dir_name', dir_name);
                                             var search_path = dir_name + '/' + fileName;
                                             //console.log('search_path', search_path);
                                             fns.push(function(callback) {
                                             // check that directory
                                             fs.exists(search_path, function(exists) {
                                             //console.log('exists', exists);
                                             if (!found_path && exists) {
                                             found_path = search_path;
                                             }
                                             callback(null, exists);
                                             })
                                             })
                                             });
                                             call_multi(fns, function(err, res2) {
                                             if (err) {
                                             throw err;
                                             } else {
                                             //console.log('found_path', found_path);
                                             if (found_path) {
                                             diskPath = found_path;
                                             serve_image_file_from_disk(diskPath, res);
                                             }
                                             }
                                             });
                                             //throw 'stop';
                                             */


                                            /*
                                             fs2.load_file_as_string(diskPath, function (err, data) {
                                             if (err) {
                                             throw err;
                                             } else {
                                             //var servableJs = updateReferencesForServing(data);
                                             res.writeHead(200, {'Content-Type': 'text/css'});
                                             res.end(data);
                                             }
                                             });
                                             */
                                        } else {
                                            if (splitPath.length > 2) {

                                                // need to put the rest of it together...

                                                var fileName = splitPath.slice(1, splitPath.length).join('/');
                                                console.log('fileName', fileName);


                                                var filePath = url_parts.path.substr(1);
                                                //console.log('module.uri ' + module.uri);
                                                var val2 =  path.dirname(module.uri);
                                                console.log('val2 ' + val2);
                                                //throw '9) stop';

                                                //var diskPath = val2 + '/../../images/' + fileName;

                                                var diskPath = '../../ws/img/' + fileName;

                                                // Do the search in the various served directories for the file.



                                                var served_directories = this.meta.get('served_directories');
                                                //console.log('served_directories ' + stringify(served_directories));

                                                // see if the file exists in any of the served directories

                                                // search for the file in the served directories.
                                                //  will be an asyncronous search, and use an array of function calls with call_multi.

                                                var fns = [];
                                                var found_path;


                                                each(served_directories, function(served_directory) {
                                                    //console.log('served_directory', served_directory);
                                                    var dir_val = served_directory.value();
                                                    //console.log('dir_val', dir_val);
                                                    var dir_name = dir_val.name;
                                                    //console.log('dir_name', dir_name);

                                                    var search_path = dir_name + '/' + fileName;
                                                    //console.log('search_path', search_path);
                                                    fns.push(function(callback) {
                                                        // check that directory

                                                        fs.exists(search_path, function(exists) {
                                                            //console.log('exists', exists);

                                                            if (!found_path && exists) {
                                                                found_path = search_path;
                                                            }
                                                            callback(null, exists);
                                                        })


                                                    })
                                                });

                                                call_multi(fns, function(err, res2) {
                                                    if (err) {
                                                        throw err;
                                                    } else {
                                                        console.log('found_path', found_path);
                                                        if (found_path) {
                                                            diskPath = found_path;
                                                            //serve_image_file_from_disk(diskPath, res);
                                                        }
                                                        serve_image_file_from_disk(diskPath, res);
                                                    }

                                                });






                                                // /js/core/jsgui-lang-enh
                                                //console.log('!*!*!*! url_parts.path ' + url_parts.path);
                                                /*
                                                 if (splitPath[1] == 'core') {
                                                 var fileName = splitPath[2];
                                                 var val2 =  path.dirname(module.uri);
                                                 //console.log('val2 ' + val2);
                                                 var diskPath = val2 + '/../core/' + fileName;
                                                 fs2.load_file_as_string(diskPath, function (err, data) {
                                                 if (err) {
                                                 throw err;
                                                 } else {
                                                 //var servableJs = updateReferencesForServing(data);
                                                 res.writeHead(200, {'Content-Type': 'text/css'});
                                                 res.end(data);
                                                 }
                                                 });
                                                 }
                                                 */


                                            }

                                        }






                                    } else {
                                        console.log('loaded file, need to serve it');

                                        // need to set the mime type correctly.
                                        //  We can get this from the file name for the moment.

                                        // serve_image_file_from_buffer

                                        //serve_image_file_from_disk(diskPath, res);

                                        serve_image_file_from_buffer(buffer, diskPath, res);







                                        //throw 'stop';
                                    }
                                })



                                //fs2.load_file_as_string






                            }
                        }



                        // Perhaps will have /admin first in the path sent to an admin router?

                    }
                }


                //console.log('remoteAddress ' + remoteAddress);

                // Need to be able to get the resource pool from this resource.
                //  It routes http calls to particular resources, and resources in the same pool make use of each
                //   other.


                // /js/...js

                // the site's static file resources.
                //  a file server that serves the files with their mime types.
                //   nice to have encapsulation of this because it can do compression.


                //console.log('this.parent() ' + stringify(this.parent()));
                // then





                // This could send it to an authenticated service / resource.

                //  /admin
                //  /admin/files could go to a file manager application (html resource)
                //   There could be the HTML interface to the File_System resource there.

                //  /admin/resources could go to the resource pool admin, from where it would be possible to administer
                //   and view various resource.

                // split the path up, then do various initial tests, then maybe send it to the admin resource.
                //  And the admin resource may not be the resource pool interface, it could be more user friendly,
                //  a gateway to deeper administration.
            }
        });


        return Site_Images;


    });