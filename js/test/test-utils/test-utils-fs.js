if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['assert', 'fs'], function (assert, fs) {

    /*
    function assertListedProps(objActual, objExpected) {
        for (var prop in objExpected) {
            assert.deepEqual(objActual[prop], objExpected[prop]);
        }
    }

    function assertArraysContentEqual(arrActual, arrExpected, keyCmpFunc, objCmpFunc) {
        //
        if (keyCmpFunc === undefined) keyCmpFunc = function (v1, v2) { return (v1 == v2); };
        //
        function findIndex(arr, val) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (keyCmpFunc(arr[i], val)) return i;
            }
            return -1;
        }
        //
        if (arrExpected === undefined) {
            assert.ok(arrActual === undefined);
            return;
        }
        //
        assert.equal(arrActual.length, arrExpected.length);
        //
        var len = arrExpected.length;
        var actualFound = [];
        //
        for (var i = 0; i < len; i++) {
            var index = findIndex(arrActual, arrExpected[i]);
            assert.ok(index >= 0);
            actualFound[index] = true;
            //
            assert.deepEqual(arrActual[index], arrExpected[i]);
        }
        //
        for (var i = 0; i < len; i++) {
            assert.ok(actualFound[i] === true);
        }
    }
    */

    function assertFilesEqual(src1, src2) {
        var buf1 = fs.readFileSync(src1);
        var buf2 = fs.readFileSync(src2);
        assert.equal(buf1.length, buf2.length, "files length differ: " + src1 + " (" + buf1.length + "), " + src2 + " (" + buf2.length + ")");
        //
        for (var i = 0, len = buf1.length; i < len; i++) {
            assert.equal(buf1[i], buf2[i], "files content differ: " + src1 + ", " + src2);
        }
    }

    /*
    function functionsToStrings(obj) {
        var result = {};
        for (prop in obj) {
            if (typeof (obj[prop]) == 'function') {
                result[prop] = obj[prop].toString();
            } else {
                result[prop] = obj[prop];
            }
        }
        return result;
    }
    */

    var test_utils_fs = {
        //'assertListedProps': assertListedProps,
        //'assertArraysContentEqual': assertArraysContentEqual,
        'assertFilesEqual': assertFilesEqual
        //'functionsToStrings': functionsToStrings,
    }

    return test_utils_fs;

});
