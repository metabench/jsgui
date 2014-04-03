if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(["../../jsgui-html", "./single-line", "./title-bar", "./viewer/object"], 
	function(jsgui, Single_Line, Title_Bar, Object_Viewer) {
		
		var stringify = jsgui.stringify, each = jsgui.each, tof = jsgui.tof;
		var Control = jsgui.Control;

		var Ctrl_Resource = Control.extend({
			fields: {
				'resource': Object//,
				//'name': String
			},

			'init': function(spec) {
				this._super(spec);
				var that = this;

				this.set('dom.attributes.class', 'resource');
				this.__type_name = 'ctrl_resource';


				var resource = this.get('resource');

				// The resource may be in the pool.

				if (!resource) {
					var resource_name = this.get('dom.el').getAttribute('data-jsgui-resource-name');
					console.log('resource_name', resource_name);

					//console.log('this._context', this._context);
					var rp = this._context.resource_pool;
					resource = rp.get_resource(resource_name);
				}
				if (typeof document == 'undefined' && resource) {

					var name = resource.meta.get('name');

					//var ctrl_title_bar = new Title_Bar({
					//	'context': this._context,
					//	'text': name
					//});
					//this.add(ctrl_title_bar);

					

					var type_levels = resource.meta.get('type_levels');


					// We probably load the resource in the subclass.
					//  Perhaps that can be streamlined, with it automatically loading the resource in some cases.

					/*
					this.__status = 'waiting';

					resource.get(function(err, data) {
						if (err) {
							throw err;
						} else {

							if (tof(data) == 'object') {

							}

							console.log('name', name);

							that.set('dom.attributes.data-jsgui-resource-name', name);
							that.active();

							that.__status = 'ready';
							that.trigger('ready');

						}
					});
					*/



				} else {

				}

			},
			'activate': function() {
				console.log('Ctrl_Resource activate');

				// Needs to connect up its internal fields?
				this._super();

				//var rp = this._context.resource_pool;
				//console.log('rp', rp);
				//var resource = rp.get_resource(resource_name);



				//console.log('resource', resource);

				//if (resource) {
				//	resource.on('change', function(property_name, property_value) {
						//ctrl_object_viewer.set('value', property_value);

				//	})
				//} else {
				//	throw 'resource not found';
				//}
			}
		});
		return Ctrl_Resource;
});