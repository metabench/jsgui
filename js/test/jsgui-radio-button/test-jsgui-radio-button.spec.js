
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['../../web/jsgui-html', '../../web/controls/basic/radio-button', 'assert'],
function (jsgui, Radio_Button, assert) {
	
	var stringify = jsgui.stringify, Collection = jsgui.Collection;
	var each = jsgui.each, tof = jsgui.tof;
	
	var call_multi = jsgui.call_multi;
	
	var context = new jsgui.Mini_Context();


	xdescribe("jsgui-radio-button /test-jsgui-radio-button.spec.js ", function() {
	
		// -----------------------------------------------------
		//	test_radio_buttons
		// -----------------------------------------------------
			
		it("test_radio_buttons", function(done) {
		
		
			var test_radio_buttons = function() {

				// If the radio button is not given a context, it could possibly create its own and return that?

				// Could have the labelled radio button's content be some kind of internal content.

				var radio1 = new Radio_Button({
					// May want to set the date or a range of dates... selected dates.

					'group_name': 'group1',
					'checked': true,
					'value': 'rdo_1',//,
					'id': true,
					'context': context//,
					// Having trouble using a control as a field.

					/*
					'content': new jsgui.Label({
						'for': radio1,
						'content': 'hello',
						'context': context
					})
					*/
					//'checked': true
				});

				var label1 = new jsgui.Label({
					//'for': radio1
					'content': 'Option 1',
					'context': context,
					'for': radio1
				});
			   // console.log('');
				//console.log('pre set label');
				//label1.set('for', radio1);

				console.log('label1._ ' + stringify(label1._));

				console.log('radio1 ' + stringify(radio1));


				radio1.content().add(label1);
				// group_name should just be a Data_Value

				//radio1.set('group_name', 'group1');
				// checked would have a default value.
				//console.log('calendar ' + stringify(calendar));
				//var gn = radio1.
				//div.set('content', 'hello');
				//var gn = radio1.get('group_name');
				//console.log('gn ' + stringify(gn));
				//div.content('hello');
				//div.content().add('hello');
				//var calendar_html = calendar.all_html_render();
				//console.log('calendar_html ' + calendar_html);
				//console.log('');
				//console.log('tof(radio1) ' + tof(radio1));

				//var view_type = calendar.get('view_type');
				//console.log('view_type ' + stringify(view_type));
				//console.log('view_type ' + stringify(view_type.get()));
				
				
				var radio1_html = radio1.all_html_render();
				console.log('radio1_html ' + radio1_html);
				
				
				assert.equal(11111, 11111);
				done();
				
			}
			test_radio_buttons();
			
			// And want to test the radio buttons on a server, then enhanced on the client.
			//  Having the client document get jsgui-html and the various controls...
			//   But we can specify specifically which controls it needs, though the html controls are likely to be put in one file when stable.

			// Want a test document as well... that would be useful for HTML testing.

		
		});
					
	});



});
	
