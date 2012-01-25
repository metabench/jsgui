// Require rather than define... perhaps we call this one 'main'.

define(["jsgui-touch"], function(jsgui) {
    //This function is called when scripts/helper/util.js is loaded.
	
	var stringify = jsgui.stringify;
	
	
	//alert('jsgui-lang has loaded');
	//alert('mobile client jsgui ' + jsgui);
	//alert(jsgui.get_inline_css_dict_from_style);
	
	// Will require other code as well.
	
	// will modify the jsgui object as a mobile client
	//  or just wrap it up.
	
	// Less modular in the current way, creating a modified jsgui object?
	
	// Maybe do things in a more modular way - don't necessarily extend things onto the jsgui object.
	
	// But to begin with we mainly want to separate concerns.
	
	// We still want many things through the jsgui object. 
	//  ??? Or embrace modules more?
	
	// May need to merge functionality into the jsgui object.
	
	// Not much is needed here right now.
	//  Maybe some browser detection?
	//  And rules for special cases for some browsers.

	var h_iPhone = function(ua) {
		var s = 'iPhone';
		
		var pos1 = ua.indexOf(s);
		
		if (pos1 > -1) {
			var s2 = 'OS';
			var pos2 = ua.indexOf(s2, pos1) + 3;
			var pos3 = ua.indexOf(' ', pos2);
			var res = ua.substring(pos2, pos3);
			return res;
		}
		
		
	}
	var h_android = function(ua) {
		var s = 'Android';
		
		var pos1 = ua.indexOf(s);
		
		if (pos1 > -1) {
			//var s2 = 'OS';
			//var pos2 = ua.indexOf(s2, pos1) + 3;
			var pos3 = ua.indexOf(';', pos1);
			var res = ua.substring(pos1 + 8, pos3);
			return res;
		}
	}

	var fn_hardware_detect_simple = function(search_term_before, search_term_after) {
		var res = function(ua) {
			var pos1 = ua.indexOf(search_term_before);
			if (pos1 > -1) {
				var pos2 = ua.indexOf(search_term_after, pos1);
				return ua.substring(pos1 + search_term_before.length, pos2);
			}
		}
		return res;
		
	};
	
	var h_ff = function(ua) {
		var s = 'Firefox/', res, pos1 = ua.indexOf(s);
		if (pos1 > -1) {
			//var pos2 = ua.indexOf(' ', pos1);
			//if (pos2 == -1) pos2 = ua.length;
			var pos3 = ua.indexOf('/', pos1);
			
			//res = ua.substring(pos1, pos2);
			res = ua.substring(pos3 + 1);
		}
		return res;
	}
	
	/*
	var h_AppleWebKit = function(ua) {
		var s = 'AppleWebKit/', res, pos1 = ua.indexOf(s);
		if (pos1 > -1) {
			var pos2 = ua.indexOf(' ', pos1);
			res = ua.substring(pos1 + s.length, pos2);
		}
		return res;
	}
	*/
	
	var h_AppleWebKit = fn_hardware_detect_simple('AppleWebKit/', ' '),
	h_chrome_version = fn_hardware_detect_simple('Chrome/', ' '),
	h_safari_version = fn_hardware_detect_simple('Version/', ' '),
	h_ie_version = fn_hardware_detect_simple('MSIE ', ';');
	
	/*
	var h_safari_version = function(ua) {
		var s = 'Version/', res, pos1 = ua.indexOf(s);
		if (pos1 > -1) {
			var pos2 = ua.indexOf(' ', pos1);
			res = ua.substring(pos1 + s.length, pos2);
		}
		return res;
	}
	*/	
	/*
	var h_ie_version = function(ua) {
		var s = 'MSIE ', res, pos1 = ua.indexOf(s);
		if (pos1 > -1) {
			var pos2 = ua.indexOf(';', pos1);
			res = ua.substring(pos1 + s.length, pos2);
		}
		return res;
	}
	*/
	
	// This has to do with the page context too.
	// oh no! more code.
	
	
	var client_get_browser_info = function() {
		return ua_header_to_browser_info(navigator.userAgent);
	}, ua_header_to_browser_info = function(ua) {
		var ff = h_ff(ua), awk = h_AppleWebKit(ua);
		
		var iPhone_version = h_iPhone(ua);
		var android_version = h_android(ua);
		
		if (awk) {
			var safari_version = h_safari_version(ua), chrome_version = h_chrome_version(ua);
			
			
		} else {
			// could be IE (or ff).
			var ie_ver = h_ie_version(ua);
		}
		var browser_info = {
			// maybe get info about the platform as well
			// android version
			// iOS version
				
			
			'iPhone': iPhone_version,
			'android': android_version,	
			'ua': ua,
			'ff': ff,
			'awk': awk,
			'safari': safari_version,
			'chrome': chrome_version,
			'ie': ie_ver,
			'name': (function() {
				var res;
				if (typeof ff != 'undefined') res = 'firefox';
				if (typeof safari_version != 'undefined') res = 'safari';
				if (typeof chrome_version != 'undefined') res = 'chrome';
				if (typeof ie_ver != 'undefined') res = 'ie';
				
				// also want info about the platform, eg android, iPhone.
				
				return res;
			})(),
			'toString': function() {
				var res = 'Browser: ' + browser_info.name + ' Version: ' + browser_info.version;
				return res;
			}
		};
		browser_info.version = (function(){
			var res;
			if (browser_info.ff) res = browser_info.ff;
			if (browser_info.safari) res = browser_info.safari;
			if (browser_info.chrome) res = browser_info.chrome;
			
			// platform_name, platform_version
			
			// detecting android - may even use canvas for 3d transformations.
			
			return res;
		})();
		return browser_info;
	};
	
	/*
	var get_platform_info = function() {
		var ua = navigator.userAgent;
		console.log('ua ' + ua);
		
	};
	
	var platform_info = get_platform_info();
	*/
	
	var browser_info = client_get_browser_info();
	console.log('browser_info ' + stringify(browser_info));
	
	jsgui.ClientPageContext = jsgui.PageContext.extend({
		'init': function(spec) {
			spec = spec || {};
			if (!spec.browser_info) {
				// get the browser info on the client.
				spec.browser_info = browser_info;
			}
    		this._super(spec);
		}
	});
	
	jsgui.page_context = new jsgui.ClientPageContext();
	jsgui.browser_info = browser_info;
	
	
	// Could even load in further code, maybe shims, or shim commands, for some browsers.
	//  Now we know the browser we could get further relevant code.
	
	
	return jsgui;
	
	
});