/*
if (typeof define !== 'function') { var define = require('amdefine')(module) }

// object viewer

define(["../../jsgui-html-enh"], 
	function(jsgui) {
	    */
        var jsgui = require('../../jsgui-html-enh');
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof, is_defined = jsgui.is_defined;
		var Control = jsgui.Control;

		var fp = jsgui.fp;
		var group = jsgui.group;

		//jsgui.Page_Control = Page_Control;
		// this is the enhanced HTML module.

		var Page_Control = Control.extend({
			'init': function(spec) {
				this._super(spec);


			},
			'activate': function() {
				this._super();

				console.log('Page_Control activate');

				var pc = this._context;
				var zone;

				console.log('pc', pc);

				pc.listen('drag-ctrl-left', function(e) {
			        //console.log('drag-ctrl-left');

			        // if the zone is not already left, remove existing layout options.
			        //  replace with the left layout option.

			        //pc.show_dock_placeholder('left');
			        pc.ensure_dock_placeholder('left');

			        zone = 'left';
			    })

			    pc.listen('drag-ctrl-top', function(e) {
			        //console.log('drag-ctrl-top');

			        pc.ensure_dock_placeholder('top');
			        zone = 'top';
			    })

			    pc.listen('drag-ctrl-right', function(e) {
			        //console.log('drag-ctrl-right');

			        pc.ensure_dock_placeholder('right');
			        zone = 'right';
			    })

			    pc.listen('drag-ctrl-bottom', function(e) {
			        //console.log('drag-ctrl-bottom');

			        pc.ensure_dock_placeholder('bottom');
			        zone = 'bottom';
			    })

			    pc.listen('drag-ctrl-no-zone', function(e) {
			        //console.log('drag-ctrl-no-zone');
			        pc.ensure_dock_placeholder(false);
			        zone = null;
			    })

			    // also, the page context should be made aware when the control drag ends.

			    pc.listen('drag-ctrl-end', function(e, ctrl) {
			        //console.log('drag-ctrl-end');
			        //console.log('e ' + e);
			        //console.log('ctrl ' + ctrl);
			        //console.log('dropped in zone ' + zone);

			        pc.ensure_dock_placeholder(false);

			        pc.drop_ctrl(ctrl, zone);
			        // I think set a class to anchored.

			        //pc.anchor_ctrl(ctrl, zone);



			        //pc.raise('drop-ctrl', ctrl, zone);

			        // the pc can then get the control anchored in that zone.
			        //  the page context could do:
			        //  this.anchor(ctrl, zone);
			        //   then the page context consults its anchor zones.
			        //   if it has a grid 9, then it can choose the right one to use.

			        zone = null;

			        // but also notifying (the page_context) that the control has been dropped onto one of the drop zones.

			        // then with the page context notified that the control's been dropped, the page context can get the control to 
			        //  be anchored in that point.
			        

			    });



				

			    // A function in the page context to set this up...

			    // Want more work generally on drag and drop, and sortable / movable.
			    //  Want to make the environment where an app can go. Menus, various other things.

			    // May be better to move this out of the client app
			    //  Being able to set up the docking and drop zones within the main libraries makes sense.
			    // A Client_Page_Context could maybe handle it.

			}
		});


		//return Page_Control;
        module.exports = Page_Control;
	//}
//);