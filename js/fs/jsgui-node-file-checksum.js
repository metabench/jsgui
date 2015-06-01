// jsgui-node-file-checksum

// Simple module that gets the checksums of files.
/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['../core/jsgui-lang-essentials', 'crypto', 'fs'],
function (jsgui, crypto, fs) {
*/



var jsgui = require('../web/jsgui-html'), crypto = require('crypto'), fs = require('fs');

    var checksum = function(file_path, callback) {
        var algo = 'sha256';
        var shasum = crypto.createHash(algo);

        var file = file_path;
        var s = fs.ReadStream(file);
        s.on('data', function(d) { shasum.update(d); });
        s.on('end', function() {
            //var d = shasum.digest('hex');
            var digest = shasum.digest('base64');
            //console.log(d);
            // base64

            callback(null, digest);

        });
    }

    //return checksum;

//});

module.exports = checksum;
