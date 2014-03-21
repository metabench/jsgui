
// Likely to use / try both chimera and phantom.

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}


//define(['./jsgui-lang-essentials', 'fs', './jsgui-node-fs2-core', 'temp', 'node-phantom', 'chimera'], 
//    function(jsgui, fs, fs2, temp, phantom, chimera) {
define(['./../core/jsgui-lang-essentials', 'fs', './../fs/jsgui-node-fs2-core', 'node-phantom', './jsgui-node-png'], 
    function(jsgui, fs, fs2, phantom, jsgui_png) {
        
        var stringify = jsgui.stringify, each = jsgui.each, is_defined = jsgui.is_defined;
        
        
        // perhaps return a function...
        //  but a bunch of functions may be better.
        
        var getSvgDimensions = function(page, next) {
          page.evaluate(function () {
            var el = document.documentElement;
            var bbox = el.getBoundingClientRect();

            var width = parseFloat(el.getAttribute("width"));
            var height = parseFloat(el.getAttribute("height"));
            var viewBoxWidth = el.viewBox && el.viewBox.animVal && el.viewBox.animVal.width;
            var viewBoxHeight = el.viewBox && el.viewBox.animVal && el.viewBox.animVal.height;
            var usesViewBox = viewBoxWidth && viewBoxHeight;

            if (usesViewBox) {
              if (width && !height) {
                height = width * viewBoxHeight / viewBoxWidth;
              }
              if (height && !width) {
                width = height * viewBoxWidth / viewBoxHeight;
              }
              if (!width && !height) {
                width = viewBoxWidth;
                height = viewBoxHeight;
              }
            }

            if (!width) {
                width = bbox.width;
            }
            if (!height) {
                height = bbox.height;
            }

            return {
              width: width,
              height: height,
              usesViewBox: usesViewBox
            };
          }, next);
        }
        
        
        // string_to_png_buffer
        
        // string_to_png_to_disk
        
        // save_svg_string_to_disk
        
        var __save_svg_string_to_disk_as_png = function(svg_string, dest_path, callback) {
            
            // this may as well use the PNG compression for proper saving.
            // Likely to use a temp file along the way though.
            
            // This function won't be writing to a temporaty file output.
            
            var c = new chimera.Chimera();
            
            
            
            
            
            
        }
        
        
        // svg_string_to_png_buffer
        //  and will (optionally) compress that PNG buffer.
        
        
        // And using a temp file...
        
        
        var save_svg_string_to_disk_as_png = function(svg_string, dest_path, callback) {
            
            // this may as well use the PNG compression for proper saving.
            // Likely to use a temp file along the way though.
            
            // This function won't be writing to a temporaty file output.
            
            var ext = 'png';
            
            // Having a headless browser that does not go via disk would make sense.
            phantom.create(function (err, ph) {
                if (err) { throw err; }
                ph.createPage(function (err, page) {
                    if (err) { ph.exit(); throw err; }
                    
                    page.onLoadFinished = function () {
                        //console.log('onLoadFinished ');
                        getSvgDimensions(page, function (err, dimensions) {
                            page.set('viewportSize', {
                                width: dimensions.width,
                                height: dimensions.height
                            }, function () {
                                
                                //console.log('cb getSvgDimensions');
                                
                                // But this saving as PNG does not have the scanline filter optimizations.
                                
                                //console.log('dest_path ' + dest_path);
                                // create the write stream to save to disk???
                                
                                page.render(dest_path, function (err) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        //console.log('rendered callback');
                                        ph.exit();
                                        callback(null, true);
                                        
                                    }
                                })
                                
                                //ph.exit();
                                
                                /*
                                temp.open({suffix: '.' + ext}, function (err, info) {
                                    page.render(info.path, function (err) {
                                        var in_stream = fs.createReadStream(info.path);
                                        
                                        
                                        in_stream.pipe(out);
                  
                          //console.log('page has rendered');
                  
                                        ph.exit();
                  
                          //if (callback) callback();
                                        in_stream.on('end', function() {
                                            if (callback) callback();
                                        });
                          // callback when the read stream is done.
                  
                  
                  
                                    });
                                });
                                */
                                
                                
                            });
                        });
                    };

                    page.set('content', svg_string, function (err) {
                        if (err) { ph.exit(); throw err; }
                    });
                });
            });
            
        }
        
        var res = {
            'save_svg_string_to_disk_as_png': save_svg_string_to_disk_as_png
        }
        
        return res;
        
        
        // 
        
        
    }
);



/*

var fs = require('fs');
var fs2 = require('fs2');
var path = require('path');

var phantom = require('node-phantom');

// load_file_as_string

// can try using chimera instead.

var temp = require('temp');

var jsgui = require('jsgui-lang-essentials');


var tof = jsgui.tof;
// or raise an event 'end' on the object.

// I think redoing the module makes sense.
//  Make AMD-like

module.exports = function (ins, out, ext, callback) {
    
  ext = ext || 'png';
  var buf = [];
  
  // maybe svg string to PNG stream or buffer.
  
  // Could use loadFile for this.
  //  Just want the SVG as a string before rendering it.
  
  // But using Chimera would make sense too.
  //  Having a difficulty using the buffer here...
  
  // Trying load_file makes sense.
  //  load_file_as_string
  
  
  
  
  
  ins.on('data', function (data) {
    buf.push(data);
  });
  ins.on('end', function (data) {
    if (arguments.length) {
      
      buf.push(data);
      
    }  
    
    console.log('buf.length ' + buf.length);
    
    //var xml = String(Buffer.concat(buf));
    var xml = (Buffer.concat(buf).toString());
    
    
    phantom.create(function (err, ph) {
      if (err) { throw err; }
      ph.createPage(function (err, page) {
        if (err) { ph.exit(); throw err; }

        page.onLoadFinished = function () {
          getSvgDimensions(page, function (err, dimensions) {
            page.set('viewportSize', {
              width: dimensions.width,
              height: dimensions.height
            }, function () {
              temp.open({suffix: '.' + ext}, function (err, info) {
                page.render(info.path, function (err) {
                  var in_stream = fs.createReadStream(info.path);
                  in_stream.pipe(out);
                  
                  //console.log('page has rendered');
                  
                  ph.exit();
                  
                  //if (callback) callback();
                  in_stream.on('end', function() {
                    if (callback) callback();
                  });
                  // callback when the read stream is done.
                  
                  
                  
                });
              });
            });
          });
        };

        page.set('content', xml, function (err) {
          if (err) { ph.exit(); throw err; }
        });
      });
      
      
    });
    
  })
}

function getSvgDimensions(page, next) {
  page.evaluate(function () {
    var el = document.documentElement;
    var bbox = el.getBoundingClientRect();

    var width = parseFloat(el.getAttribute("width"));
    var height = parseFloat(el.getAttribute("height"));
    var viewBoxWidth = el.viewBox && el.viewBox.animVal && el.viewBox.animVal.width;
    var viewBoxHeight = el.viewBox && el.viewBox.animVal && el.viewBox.animVal.height;
    var usesViewBox = viewBoxWidth && viewBoxHeight;

    if (usesViewBox) {
      if (width && !height) {
        height = width * viewBoxHeight / viewBoxWidth;
      }
      if (height && !width) {
        width = height * viewBoxWidth / viewBoxHeight;
      }
      if (!width && !height) {
        width = viewBoxWidth;
        height = viewBoxHeight;
      }
    }

    if (!width) {
        width = bbox.width;
    }
    if (!height) {
        height = bbox.height;
    }

    return {
      width: width,
      height: height,
      usesViewBox: usesViewBox
    };
  }, next);
}

*/