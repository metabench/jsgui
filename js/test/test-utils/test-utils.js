
var assert = require('assert');
//var toTextModule = require('./toText');


	
        function isInBrowser() {
            if (typeof (window) === 'undefined') return false;
            if (window.location) return true;
            return false;
        }

		function assertListedProps(objActual, objExpected){
			for (var prop in objExpected){
				assert.deepEqual(objActual[prop], objExpected[prop]);
			}
		}
	
		function assertArraysContentEqual(arrActual, arrExpected, keyCmpFunc, objCmpFunc){
			//
			if (keyCmpFunc === undefined) keyCmpFunc = function(v1, v2){ return (v1 == v2); };
			//
			function findIndex(arr, val){
				for(var i = 0, len = arr.length; i < len; i++){
					if (keyCmpFunc(arr[i], val)) return i;
				}
				return -1;
			}
			//
			if (arrExpected === undefined){
				assert.ok(arrActual === undefined);
				return;
			}
			//
			assert.equal(arrActual.length, arrExpected.length);
			//
			var len = arrExpected.length;
			var actualFound = [];
			//
			for(var i = 0; i < len; i++){
				var index = findIndex(arrActual, arrExpected[i]);
				assert.ok(index >= 0);
				actualFound[index] = true;
				//
				assert.deepEqual(arrActual[index], arrExpected[i]);
			}
			//
			for(var i = 0; i < len; i++){
				assert.ok(actualFound[i] === true);
			}
		}
		

        /*
		function assertFilesEqual(src1, src2){
			var buf1 = fs.readFileSync(src1);
			var buf2 = fs.readFileSync(src2);
			assert.equal(buf1.length, buf2.length, "files length differ: " + src1 + " (" + buf1.length + "), " + src2 + " (" + buf2.length + ")");
			//
			for (var i = 0, len = buf1.length; i < len; i++){
				assert.equal(buf1[i], buf2[i], "files content differ: " + src1 + ", " + src2);
			}
		}
        */

		function functionsToStrings(obj) {
		    var result = {};
		    for (prop in obj) {
		        if (typeof(obj[prop]) == 'function'){
		            result[prop] = obj[prop].toString();
		        }else{
		            result[prop] = obj[prop];
		        }
		    }
		    return result;
		}


    //#region assert.deepEqual


		function deepEqual(actual, expected, message) {
		    if (!_deepEqual(actual, expected, false)) {
		        assert.fail(actual, expected, message, 'deepEqual', assert.deepEqual);
		    }
		};

		function _deepEqual(actual, expected, strict, history) {
		    //console.log("typeof actual: " + typeof actual);
		    //console.log("typeof expected: " + typeof expected);
		    //console.log("==1==");
		    //var actual_text = toTextModule.toText(actual);
		    //var expected_text = toTextModule.toText(expected);
		    //console.log("_deepEqual(" + actual_text + ", " + expected_text + ", " + strict + ", " + toTextModule.toText(history));
		    //
		    if ((actual === undefined) || (expected === undefined)) {
		        return (actual === expected);
		    }
            //
		    //console.log("==2==");
		    var h = history;
		    while (h) {
		        if ((actual === h.actual) && (expected === h.expected)) return true;
		        h = h.prev;
		    }
            //
		    // 7.1. All identical values are equivalent, as determined by ===.
		    if (actual === expected) {
		        //console.log("==3==");
		        return true;

		        // 7.4. Other pairs that do not both pass typeof value == 'object',
		        // equivalence is determined by ==.
		    } else if ((actual === null || typeof actual !== 'object') && (expected === null || typeof expected !== 'object')) {
		        //return strict ? actual === expected : actual == expected;
		        //console.log("==4==");
		        //return actual === expected;
		        var result = (actual === expected);
		        if (!result && (typeof actual === 'function') && (typeof expected === 'function')) {
		            //console.log("==func==");
		            result = (actual.toString() === expected.toString());
		        }
		        //console.log("==not func==");
		        //return actual === expected;
		        return result;

		        // 7.5 For all other Object pairs, including Array objects, equivalence is
		        // determined by having the same number of owned properties (as verified
		        // with Object.prototype.hasOwnProperty.call), the same set of keys
		        // (although not necessarily the same order), equivalent values for every
		        // corresponding key, and an identical 'prototype' property. Note: this
		        // accounts for both named and indexed properties on Arrays.
		    } else {
		        //console.log("==5==");
		        return objEquiv(actual, expected, strict, history);
		    }
		    //console.log("==6==");
        }

		function isArguments(object) {
		    return Object.prototype.toString.call(object) == '[object Arguments]';
		}

		function isPrimitive(arg) {
		    return arg === null || typeof arg !== 'object' && typeof arg !== 'function';
		}

		const pSlice = Array.prototype.slice;

		const DEBUG = true;

		function objEquiv(a, b, strict, history) {
		    if (a === null || a === undefined || b === null || b === undefined)
		        return false;
		    // if one is a primitive, the other must be same
		    if (isPrimitive(a) || isPrimitive(b))
		        return a === b;
		    if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
		        return false;
		    var aIsArgs = isArguments(a),
                bIsArgs = isArguments(b);
		    if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
		        return false;
		    if (aIsArgs) {
		        a = pSlice.call(a);
		        b = pSlice.call(b);
		        console.log("==2==");
		        return _deepEqual(a, b, strict, { actual: a, expected: b, prev: history });
		    }
		    var ka = Object.keys(a),
                kb = Object.keys(b),
                key, i;
		    // having the same number of owned properties (keys incorporates
		    // hasOwnProperty)
		    if (ka.length !== kb.length) {
		        if (DEBUG) {
		            console.log("ka.length !== kb.length: ka.length=" + ka.length + " kb.length=" + kb.length);
		            //
		            console.log("==ka==");
		            console.log(ka);
		            console.log("==kb==");
		            console.log(kb);
		        }
                //
		        return false;
		    }
		    //the same set of keys (although not necessarily the same order),
		    ka.sort();
		    kb.sort();
		    //~~~cheap key test
		    for (i = ka.length - 1; i >= 0; i--) {
		        if (ka[i] !== kb[i]) {
		            if (DEBUG) {
		                console.log("ka[i] !== kb[i]: ka[i]=" + ka[i] + " kb[i]=" + kb[i]);
		                //
		                console.log("==ka==");
		                console.log(ka);
		                console.log("==kb==");
		                console.log(kb);
		            }
		            //
		            return false;
		        }
		    }
		    //equivalent values for every corresponding key, and
		    //~~~possibly expensive deep test
		    for (i = ka.length - 1; i >= 0; i--) {
		        key = ka[i];
		        //console.log("key=" + key);
		        if (!_deepEqual(a[key], b[key], strict, { actual: a, expected: b, prev: history })) {
		            if (DEBUG) console.log("!_deepEqual: key=" + key);
		            return false;
		        }
		        //console.log("key=" + key + " - done");
            }
		    return true;
		}

    //#endregion

		function toText(obj) {
		    return toTextModule.toText(obj);
		}


		module.exports = {
		    'isInBrowser': isInBrowser,
		    'assertListedProps': assertListedProps,
		    'assertArraysContentEqual': assertArraysContentEqual,
		    //'assertFilesEqual': assertFilesEqual,
		    'functionsToStrings': functionsToStrings,
		    'assertDeepEqual': deepEqual,
		    'toText': toText
		};



	