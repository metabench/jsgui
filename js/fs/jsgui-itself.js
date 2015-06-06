var ncp = require('ncp').ncp;

ncp.limit = 16;

var os = require('os');
var fs = require('fs');
var rimraf = require('rimraf');
// copy to a path outside of jsgui...?

//  Better would be to read any file into a zip file.
//var AdmZip = require('adm-zip');
easyzip = require('easy-zip');



var copy_zip_jsgui_itself = function(callback) {
  var dir = os.tmpdir();
  console.log('dir', dir);
  var temp_jsgui_dir = dir + '/jsgui2';
  var temp_jsgui_comp_dir = temp_jsgui_dir + '/jsgui';
  var temp_jsgui_comp_js_dir = temp_jsgui_comp_dir + '/js';

  var source_dir = __dirname + '/../../';

  console.log('temp_jsgui_dir', temp_jsgui_dir);
  console.log('source_dir', source_dir);

  var jsgui_js_zip_path = temp_jsgui_dir + '/jsgui_only_js.zip';

  rimraf(temp_jsgui_dir, function(err) {
    if (err) { callback(err) } else {
      fs.mkdir(temp_jsgui_dir, function(err) {
        if (err) { throw err; } else {

          fs.mkdir(temp_jsgui_comp_dir, function(err) {
            if (err) { throw err; } else {

            fs.mkdir(temp_jsgui_comp_js_dir, function(err) {
              if (err) { throw err; } else {

                // filter with ncp is not working.
                // Try to filter in the archive making.

                ncp(source_dir, temp_jsgui_comp_js_dir, {
                  //'filter': /\.(js|gif|jpg|jpeg|tiff|png)$/
                  //filter: function(file_name) {
                  //  console.log('file_name', file_name);
                  //  return file_name.indexOf('.js') > 0;
                  //}
                }, function (err) {
                 if (err) {
                   return console.error(err);
                 } else {
                  console.log('done!');

                  var zip5 = new easyzip.EasyZip();
                  zip5.zipFolder(temp_jsgui_comp_dir,function(){
                      zip5.writeToFile(jsgui_js_zip_path, function(err) {
                        if (err) { throw err; } else {
                          console.log('written zip file ' + jsgui_js_zip_path);
                          callback(null, jsgui_js_zip_path);
                        }
                      });
                  });

                 }

                });
              }
            })


            }
          })



        }
      })
    }
  })





}

module.exports = {
  'copy_zip_jsgui_itself': copy_zip_jsgui_itself
}


if (require.main === module) {
  copy_zip_jsgui_itself(function(err, res_copy_itself) {
    if (err) { throw err; } else {
      console.log('res_copy_itself', res_copy_itself);
    };
  })
}
