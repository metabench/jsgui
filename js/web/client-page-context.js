
// will also use the client-resource-pool.
//  This is going to be an interesting class that enables the client to connect to various resources on the server.
//  It may have an interface to browse / connect to the resources on the server that served it.

// Maybe it will do a get request, with its authentication, perhaps a key that was sent for that specific request.
//  We want to fins a way to expose resources on the server for the client to access.

// And this is going to include a client-side resource pool.

// Another problem with circular references here.

// I think the page context should be part of html-enh
//  html-enh including client-side enhancements.



var jsgui = require('./jsgui-html');

var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
var filter_map_by_regex = jsgui.filter_map_by_regex;
var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
var fp = jsgui.fp, is_defined = jsgui.is_defined;
var Collection = jsgui.Collection;

// The client page context should be able to generate selection scopes.
//  We ask the context for selection scopes, and the selection scopes have IDs that are individual to the context.

// Now thinking that the Client_Page_Context should also hold the Client_Resource_Pool.
//  That client-side resource pool would hold resources that are usable client-side. They would likely involve interacting with a server.
//  They would be client-side proxies of the server-side resource, which goes through a Resource_Publisher to get it out over the network.

var Client_Resource_Pool = require('../resource/core/client-pool');

// Also should have the means to send socks messages to the server.

// Want there to be a client socks resource, which proxies all socks connections???

// Or particularly set up a socks router.


// On the client, may want to set a task for the server resource.
//  Though task setting seems like a roundabout way of using constrained verbs here. Fits in with grammar OK.



// Let's write some code on the client that would set a task for a resource.
//  Need a Resource that can accept tasks too.

// Linux System resource for the moment.
//  Will have it capable of getting / setting Linux system information.
//  Will include the capability to set it tasks.

// Let's keep things (specific resources) within the 'Resource' directory, as it's an abstraction that makes use of other parts of the jsgui platform.











var Selection_Scope = require('./selection-scope');


//console.log('jsgui.Page_Context', jsgui.Page_Context);
var Client_Page_Context = jsgui.Page_Context.extend({
    'init': function(spec) {
        spec = spec || {};


        this._super(spec);
        //this.set('document', spec.document);
        this.document = spec.document || document;

        // Not so sure about creating the resource pool or requiring the resources.
        //  Could have problems with dependencies.


        // map_controls

        // map_els

        // The context will have a map of elements by their jsgui ids.
        //  This will be needed for activation in some places.
        //   It seems not to be needed (so far) on the server.







        //var resource_pool = new Client_Resource_Pool();
        //this.pool = resource_pool;

        //resource_pool.start();
        // so the pool probably won't have loaded when controls get activated.

        // Add the resource_pool into the page context at a later occasion.
        //  The basic html client will not need resource.
        //  Resource requires some html functionality though.
        this.resource_pool = new Client_Resource_Pool({});

        this.map_els = {};


        // The item IDs could be handled here... use the local variable closure here.
        this.selection_scopes = {};

        this.selection_scope_id_counter = 0;

    },
    'new_selection_scope': function() {
        // create the selection scope, with an assigned id

        var res = new Selection_Scope({
            'context': this,
            'id': this.selection_scope_id_counter++
        })

        return res;

    },

    'get_selection_scope_by_id': function(id) {
        if (!this.selection_scopes[id]) {
            this.selection_scopes[id] = new Selection_Scope({
                'context': this,
                'id': id
            });
        }
        return this.selection_scopes[id];
    },


    'body': function() {
        var doc = this.document;
        //console.log('doc', doc);
        var bod = doc.childNodes[0].childNodes[1];
        //var bod = doc.body;
        //console.log('bod', bod);

        var bod_id = bod.getAttribute('data-jsgui-id');
        //console.log('bod_id', bod_id);
        var res = this.map_controls[bod_id];
        //console.log('res', res);
        return res;
    }

    //get id's of particular types of items...

});
// Also want a File_Server.
//  Want files to be served from a particular path, as a resource in the URL system.
//  Will be able to post files there with the right permission.
module.exports = Client_Page_Context;
	/*
	return Client_Page_Context;


});

*/
