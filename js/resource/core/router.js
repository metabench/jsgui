
/*
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['url', '../../web/jsgui-html', 'os', 'http', 'url', './resource', '../../web/jsgui-je-suis-xml', 'cookies'],

	function(url, jsgui, os, http, libUrl, Resource, JeSuisXML, Cookies) {
*/
var url = require('url'), jsgui = require('../../web/jsgui-html'), os = require('os'),
http = require('http'), libUrl = require('url'), Resource = require('./resource'),
JeSuisXML = require('../../web/jsgui-je-suis-xml'), Cookies = require('cookies');

	var stringify = jsgui.stringify, each = jsgui.each, arrayify = jsgui.arrayify, tof = jsgui.tof;
	var filter_map_by_regex = jsgui.filter_map_by_regex;
	var Class = jsgui.Class, Data_Object = jsgui.Data_Object, Enhanced_Data_Object = jsgui.Enhanced_Data_Object;
	var fp = jsgui.fp, is_defined = jsgui.is_defined;
	var Collection = jsgui.Collection;
	var get_item_sig = jsgui.get_item_sig;

	// Extends AutoStart_Resource?

	// The routing tree could be a specific class of object.
	//  It will have its own (get and) set functions that interact with its internal structure.
	//   effectively replacing . with /
	//  Could try that string replacement for the object paths.
	//   Would be interesting as it would be ensuring multiple levels of Data_Object automatically.

	// Routing tree needs to be able to handle variables.
	//  It will see there is a variable word (item between / slashes)
	//   and if there is no handler for that particular word at that level, it will see if there is a variable
	//   handler.


	// At the 'users' level, there is an objects.
	//  needs to be one handler for variables at that level.

	// Can put them in place through something like 'ensure', so there can be levels of the tree even if there
	//  is not a handler at that level.

	// When handling requests, it goes through the tree level by level.

	// users/:name
	// users/all

	// Though if this were a resource and using Data_Object it could possibly be edited better.

	// Maybe a new routing tree would be better.
	//  Simpler node structure... could have an array at each node.
	//  Or specific classes.
	//   A PathNode class, there could be a VariablePathNode class that it goes through when it's a variable
	//   WildcardPathNode for when it's a wildcard and that covers all paths after that.
	//    It would quite probably be a lot clearer, using the particular class types, perhaps testing instanceOf
	//     but more likely having the mapChildPathNodes property, as well as a childVariableNode property, and childWildcard?

	// So at each level we can tell which, if any of the child paths it can go down.
	//  Could have much more explicit debugging of this rather than making sense out of arrays of different kinds

	// This needs to be able to both get and set routes
	// Get
	//  Given a URL, return the handler for the most suitable route
	// Set
	//  Given a route (as a string) it sets up the items in the routing table.
	//   Want a clear algorithm to do this level-by-level.
	//    Will likely make reference to a RoutePathNode class that will have various properties about it that mean
	//     it can refer to other such route path nodes in the right way and the algorithm is easy to understand.

	// Though it would be possible to just use native JS object types like objects and arrays for the tree, it's harder
	//  to read the code because it's less clear what the various objects are for or denote.

	// This can use a small number of fairly simple classes to traverse the tree, and it will be easier to follow what
	//  is going on in the debugger, and what routes exist at any point on the routing tree.

	// Will be able to get the routing tree object for any particular level/path, if there is one.

	// At the root node - there will be a handler path
	//  there will also be RoutePathNodes which are the normal children of another one
	//   and for a variable - if the next part takes a variable, then that gets used in that case
	//

	// The root node will be used for '/'


	//  Perhaps a Server_Page_Context should be Server_Request_Context, which may well hold info on the page
	//   Have authentication / authorization done at an earlier stage with the context
	//   At least checking they are who they say they are, looking up the session id against the username.
	//    That will be a part of the authentication resource.


	// May need some general purpose traversal functions?
	var Routing_Tree_Node = jsgui.Class.extend({
		'init': function(spec) {
			spec = spec || {};
			// and has a map of it's normal path nodes
			//  one possible variable route as a child
			//  one possible wildcard route as a child

			// a handler function here

			if (spec.handler) this.handler = spec.handler;



			this.mapNormalPathChildren = {};

			// variableChild
			// wildcardChild

		}
	});

	var Variable_Routing_Tree_Node = jsgui.Class.extend({
		'init': function(spec) {
			this.name = spec.name;
			if (spec.handler) this.handler = spec.handler;
			this.mapNormalPathChildren = {};
		}
	})

	var Wildcard_Routing_Tree_Node = jsgui.Class.extend({
		'init': function(spec) {

		}
	})

	// Wildcards having names?
	//  Or it just processes the wildcard info as one variable?

	// Want to be able to get the Routing_Tree_Node corresponding with a path

	var Routing_Tree = jsgui.Class.extend({
		'init': function(spec) {

			// and has a map of it's normal path nodes
			//  one possible variable route as a child
			//  one possible wildcard route as a child
			this.root = new Routing_Tree_Node();

		},
		'setRoot404': function(handler) {
			this.root404Handler = handler;
		},
		'set': function(strRoute, context, handler) {

            if (!handler) {
                handler = context;
                context = undefined;
            }





			// set the handler of the found route.
			//  need to ensure there is such a route
			//   need to parse the string route.

			// split the string by '/'

			// then for each level we interpret what it's about

			// and do some checks
			//  nothing allowed after a wilcard, it makes the string invalid.
			//console.log('strRoute ' + strRoute);


			//console.log('strRoute ' + strRoute);
			//throw 'stop';
			if (strRoute == '/') {
				//console.log('setting root handler');
				//throw 'stop';
                if( context) this.root.context = context;
				this.root.handler = handler;
			} else {
				if (strRoute.substr(0, 1) == '/') strRoute = strRoute.substr(1);
				// remove any beginning or trailing '/' from the route

				if (strRoute.substr(strRoute.length - 1) == '/') strRoute = strRoute.substr(0, strRoute.length - 1);
				//console.log('strRoute ' + strRoute);
				var splitRoute = strRoute.split('/');
				//console.log('splitRoute ' + stringify(splitRoute));

				// then we use a while loop to progress through the levels.
				//  it will be good to have / show awareness of what is at each level.

				// may need to create new levels while doing set.
				//  do not create new levels when doing get.

				// stage by stage... find the routing node.
				//console.log('this.root ' + stringify(this.root));
				var currentNode = this.root;

				// traverse through to find the place.
				//  need to deal with creating variable nodes too if needed.

				var c = 0;
				while (c < splitRoute.length) {
					var strLevel = splitRoute[c];
					//console.log('strLevel ' + strLevel);

					// does it start with :?

					var isVariable = strLevel.substr(0, 1) == ':';
					var isWildcard = strLevel == '*';

					if (isVariable) {

						var variableName = strLevel.substr(1);
						//console.log('variableName ' + variableName);

						// can do this alongside the normal next level child paths.
						//  however, may need to navigate an existing variable path.
						//  can't have variable paths with different names here.

						//var next_level_node = currentNode.variableChild;
						if (!currentNode.variableChild) {
							currentNode.variableChild = new Variable_Routing_Tree_Node({'name': variableName});

							if (c == splitRoute.length - 1) {
								currentNode.variableChild.handler = handler;
                                if (context) currentNode.variableChild.context = context;
							}

							currentNode = currentNode.variableChild;
						} else {

							// need to proceed through the variable.

							currentNode = currentNode.variableChild;

							//throw '9) stop';
						}




						//throw '8) stop';
					} else {

						if (isWildcard) {

							//throw '11) stop';
							// Wildcard node handler goes here?

							currentNode.wildcardChild = new Wildcard_Routing_Tree_Node();
							currentNode.wildcardChild.handler = handler;
                            if (context) currentNode.wildcardChild.context = context;
						} else {
							// ensure there is a child of that name.
							//console.log('c ' + c);
							//console.log('currentNode ' + stringify(currentNode));

							var next_level_node = currentNode.mapNormalPathChildren[strLevel];
							if (!next_level_node) {
								currentNode.mapNormalPathChildren[strLevel] = new Routing_Tree_Node();
								next_level_node = currentNode.mapNormalPathChildren[strLevel];
							}

							if (c == splitRoute.length - 1) {
								currentNode.mapNormalPathChildren[strLevel].handler = handler;
                                if (context) currentNode.mapNormalPathChildren[strLevel].context = context;
							}
							currentNode = next_level_node;
							//console.log('new currentNode ' + currentNode);

						}

					}

					c++;

				}

				//throw '5) stop';
			}




		},
		// this returning undefined is much like a 404.
		//  this could maybe have a 404 route attached to it.
        //  don't create a new function to call the function within a context.



		'get': function(url) {
			// routes the URL through the tree
            //  should maybe get the context and the function.
            //console.log('router get, context: ', this.root.context);
            //console.log('url', url);

			var params;

			if (url == '/') {
                var root = this.root;
                //console.log('root.context', root.context);
                if (root.context) {



                    // and empty params?



                    return [root.context, this.root.handler, {}];
                } else {

                    //console.log('this.root', this.root);

                    // but perhaps it's routed using wildcard routing.

                    var res;

                    if (this.root.handler) {
                        res = this.root.handler;
                    } else {
                        if (this.root.wildcardChild) {
                            if (this.root.wildcardChild.handler) {

                                //console.log('this.root.wildcardChild', this.root.wildcardChild);

                                if (this.root.wildcardChild.context) {
                                    return [this.root.wildcardChild.context, this.root.wildcardChild.handler, {}];
                                } else {
                                    return this.root.wildcardChild.handler;
                                }

                                throw 'stop';



                            }
                        }
                    }




                    return res;
                }




			} else {
				// remove any beginning or trailing '/' from the route

				if (url.substr(url.length - 1) == '/') url = url.substr(0, url.length - 1);
				if (url.substr(0, 1) == '/') url = url.substr(1);

				// process the url to remove the querystring.

				var posQM = url.indexOf('?');

				if (posQM > -1) {
					url = url.substr(0, posQM);
				}

				//console.log('url ' + url);
				var splitUrl = url.split('/');
				//console.log('splitUrl ' + stringify(splitUrl));
				//console.log('splitUrl.length ' + splitUrl.length);
				// then we use a while loop to progress through the levels.
				//  it will be good to have / show awareness of what is at each level.

				// may need to create new levels while doing set.
				//  do not create new levels when doing get.

				// stage by stage... find the routing node.

				var currentNode = this.root;

				// traverse through to find the place.
				//  need to deal with creating variable nodes too if needed.

				var c = 0;
				while (c < splitUrl.length) {
					var strLevel = splitUrl[c];
					//console.log('strLevel ' + strLevel);

					// does it start with :?

					//var isVariable = strLevel.substr(0, 1) == ':';
					//var isWildcard = strLevel == '*';
					//console.log('currentNode ' + stringify(currentNode));

					if (currentNode) {
						var next_level_node = currentNode.mapNormalPathChildren[strLevel];
						//console.log('next_level_node ' + stringify(next_level_node));
						if (next_level_node) {
							// then we will use that.
							//console.log('* next_level_node ' + next_level_node);
							//throw '7) stop';
							//currentNode.mapNormalPathChildren[strLevel] = new Routing_Tree_Node();

							// next level could be / have a wildcard?


						} else {
							//

							// look for a variableChild.
							//console.log('currentNode ' + stringify(currentNode));
							//throw '9)stop';

							if (currentNode.variableChild) {
								next_level_node = currentNode.variableChild;
								params = params || {};
								params[currentNode.variableChild.name] = strLevel;
								// need to deal with the variable's params.


							} else {
								if (currentNode.wildcardChild) {
									//throw '13) stop';
									// we use this one.

									//console.log('');
									//console.log('found wildcard');
									//console.log('splitUrl', splitUrl);
									//console.log('c', c);

									var arr_the_rest = splitUrl.slice(c);
									//console.log('arr_the_rest', arr_the_rest);
									var str_wildcard_value = arr_the_rest.join('/');
									//console.log('str_wildcard_value', str_wildcard_value);

                                    //console.log('will return wildcard handler');

                                    if (currentNode.wildcardChild.context) {
                                        return [currentNode.wildcardChild.context, currentNode.wildcardChild.handler, {'wildcard_value': str_wildcard_value}];
                                    } else {
                                        return [currentNode.wildcardChild.handler, {'wildcard_value': str_wildcard_value}];
                                    }




								}
							}



						}
					}

					//console.log('c ' + c);
					//console.log('splitUrl.length ' + splitUrl.length);
					//console.log('splitUrl ' + stringify(splitUrl));
					if (c == splitUrl.length - 1) {

						//currentNode.mapNormalPathChildren[strLevel].handler = handler;
						//console.log('next_level_node ' + next_level_node);
						if (next_level_node) {
							//console.log('next_level_node.handler ' + next_level_node.handler);

							if (next_level_node.handler) {
								if (params) {

                                    if (next_level_node.context) {
                                        return [next_level_node.context, next_level_node.handler, params];
                                    }


								} else {
                                    if (next_level_node.context) {
                                        return [next_level_node.context, next_level_node.handler];
                                    } else {
                                        return next_level_node.handler;
                                    }


								}
							} else {
								if (next_level_node.wildcardChild) {
									// Returning the wildcard value...

									// That would be the rest of the nodes that it's not looking at when there is a wildcard.

									//console.log('');
									//console.log('found wildcard');
									//console.log('splitUrl', splitUrl);
									//console.log('c', c);

									var arr_the_rest = splitUrl.slice(c);
									//console.log('arr_the_rest', arr_the_rest);
									var str_wildcard_value = arr_the_rest.join('/');
									//console.log('str_wildcard_value', str_wildcard_value);



									if (params) {
										params.wildcard_value = str_wildcard_value;

                                        if (next_level_node.wildcardChild.context) {
                                            return [next_level_node.wildcardChild.context, next_level_node.wildcardChild.handler, params];
                                        } else {
                                            return [next_level_node.wildcardChild.handler, params];
                                        }


									} else {
                                        if (next_level_node.wildcardChild.context) {

                                            return [next_level_node.wildcardChild.context, next_level_node.wildcardChild.handler, params];
                                        } else {
                                            return [next_level_node.wildcardChild.handler, {'wildcard_value': str_wildcard_value}];
                                        }


									}
								}

								// Could handle a variable handler here?
							}




						}

					}

					currentNode = next_level_node;

					c++;

				}

				return this.root404Handler;

				//throw '5) stop';
			}

		}
	});





    // Maybe just call this Router.
    //  There will be application-level and server-lever routers.
    //  The simplest config, though, either does not have a server-level router, or it passes all requests over to the application-level router.







	var Router = Resource.extend({
		'fields': {
			'routing_tree': Routing_Tree
		},

		'init': function(spec) {
			this._super(spec);

			// a type field for resource?
			//  and a subtype?
			//   or subtype levels?

			// such as
			// db, odb, mongo

			// I think a system of type levels will be useful.
			//  so type_levels as an array.
			// Maybe they will get indexed on the client.

			this.set('type_levels', ['router']);


			// And would carry out its process according to the routing tree

			//this.set('')

			// could possibly set up a few (default) routings?

			//  But the handlers may not have been set up on initialization.

			//   Perhaps this can be done somewhere within the resouce timeline.


		},
		'start': function(callback) {
			callback(null, true);
		},
        'set_route': function(str_route, context, fn_handler) {
            var rt = this.get('routing_tree');
            return rt.set(str_route, context, fn_handler);
        },
		'process': function(req, res) {

			// Perhaps it could detect /admin and send to an Application-Admin resource.

			//console.log('router processing');
			var remoteAddress = req.connection.remoteAddress;

			// better just to have .get
			//var rp = this.get('resource_pool');


			//console.log('remoteAddress ' + remoteAddress);
			//console.log('this ' + stringify(this));

			// Need to be able to get the resource pool from this resource.
			//  It routes http calls to particular resources, and resources in the same pool make use of each
			//   other.

			// Will follow this.routes
			//  I think using regexes on the URLs makes sense
			//  A router where it splits by path will be most effective.

			// May be able to parse routing strings to build these path structures.

			// So at any level, there could be more routers for different paths based on what the path is

			//  But we'll route this level by level.

			//  We'll maintain a tree of where things get routed to.

			// routing_tree
			//  could be a Data_Object, or normal object.

			var rt = this.get('routing_tree');

			// so we can add login into the routing tree.





			// /js/...js

			// the site's static file resources.
			//  a file server that serves the files with their mime types.
			//   nice to have encapsulation of this because it can do compression.


			//console.log('Router process req.url ' + req.url);

			// But just the general routing for the application...
			//  Should be able to access an Application Routes object to change it in some ways.

			// At the moment this just routes to a few resources.
			//  We need this to be much more configurable.

			// Need it to route to some specific code, a specific function that handles things.
			//  Could use a regular expression on the URL.

			// Perhaps similar to Backbone routing or express routing.

			// Want the application router to be quite flexible.
			//  I think encorporating express routing, or something very similar would be nice.

			//console.log('this.parent() ' + stringify(this.parent()));
			// then

            // Default routing to various things in the pool.

            // The resource for each site in a different pool makes sense.
            // I think it would also make sense for there to be a resource pool for the entire server?
            //  Maybe separate resource pools by app makes the most sense.
            //  It could depend on the apps themselves, whether they are separate and need their own environments (different customers etc).
            //  So being able to access shared resources from different apps would be useful at times.


			//var pool = this.meta.get('pool');
			// should have a bunch of resources from the pool.
			//console.log('post get pool');
			//var pool_resources = pool.resources();
			//console.log('pool_resources ' + stringify(pool_resources));

			//var pool_resource_names = [];


			//each(pool_resources, function(i, item) {pool_resource_names.push(item.meta.get('name'));});

			//console.log('pool_resource_names ' + stringify(pool_resource_names));


            // Perhaps the router should not have so much in its default configuration.


			//var fswa = pool.get_resource('File System Web Admin');
			//var lfs = pool.get_resource('Local File System');

			// Get the login resource from the pool...

			// 'Login HTML Resource'

			//var login = pool.get_resource('Login HTML Resource');

			// and the resource pool itself... can we use that to serve the resources over HTTP?

			//  I think resource_pool.process_request may work.

			// or resource_publisher.process_request
			//  request url includes information about the resource being requested.
			// the resource publisher may need tight integration with the pool, but it could make most sense
			//  for it not to be part of the pool itself.

			// Providing a convenient interface for editing resources over HTTP could prove useful, but
			//  it may make the most sense to not have it as part of the pool itself in interests of code maintainability.

			// The Server_Resource_Pool could automatically set up a resource publisher.
			//  Having some of the resources being published would be essential for web administration.
			//   With root access it should be possible to set resource permissions.
			//  Assuming you can do a lot with root access, and will be developing like that for a while.
			//   Will have the A&A layer to ensure it is only for root.


			//console.log('lfs ' + lfs);


			// More resources make sense, including resources that will publish / process web requests.

			// We will have the file system resource
			//  and the file system web admin resource.



			//throw 'stop'



			//var url = require('url');
			var url_parts = url.parse(req.url, true);
			//console.log('url_parts ' + stringify(url_parts));

            //console.log('req.url', req.url);

			// This can do a lot of determination about where in the app the logic needs to go.

			// We could also tell if it is requesting something using a REST interface.
			// It could be object.json

			var splitPath = url_parts.path.substr(1).split('/');
            //console.log('splitPath', splitPath);
            //console.log('splitPath.length', splitPath.length);


			// May also want to see what response type is wanted.
			//console.log('splitPath ' + stringify(splitPath));
			//console.log('splitPath.length ' + splitPath.length);

			// There could be a default application router that sets these paths up in the routing tree.
			//  With the route_res...
			//  Want to find out variuous parameters, such as the wildcard/



			var route_res = rt.get(req.url);
            //console.log('route_res', route_res);




            // it's a function.???
			//console.log('2) route_res', route_res);

            // And if we don't have a route res, we return false.



			//Want the route_res to tell us the path within the resource and the name of the resource.
			//  Some resources will be routed with wildcards.
			//  Could make sure it gets the wildcard value.


						// just the handler by itself when there is no array of params?
			var processor_values_pair;

			if (tof(route_res) == 'array') {
                processor_values_pair = route_res;
                //console.log('route_res', route_res);
                var context, handler, params;
                // the handler function context.

                //console.log('route_res.length', route_res.length);

                if (route_res.length == 2) {
                    // or could be context and handler.

                    var rr_sig = get_item_sig(route_res, 1);
                    //console.log('rr_sig', rr_sig);

                    //console.log('route_res', route_res);

                    // context is a Data_Object.

                    // two functions???


                    // f,o = handler, params.

                    if (rr_sig == '[D,f]') {
                        context = processor_values_pair[0];
                        handler = processor_values_pair[1];
                    }
                    if (rr_sig == '[f,o]') {
                        handler = processor_values_pair[0];
                        params = processor_values_pair[1];
                    }
                    // D,f
                    //

                }

                if (route_res.length == 3) {
                    context = processor_values_pair[0];
                    handler = processor_values_pair[1];
                    params = processor_values_pair[2];
                }
                // length 4?


                // perhaps 3 objects...
                // context, handler, params.

				if (params) req.params = params;

                if (context) {
                    handler.call(context, req, res);
                } else {
                    handler(req, res);
                }


			} else if (tof(route_res) == 'function') {
				//

				//route_res.call(this, req, res);

                // but it's become anonymous now :(

                //console.log('context', context);

                if (context) {
                    route_res.call(context, req, res);
                } else {
                    // call the function... but maybe it's best / necessary to include the context.
                    //  call using the context when it exists, within the wildcard handler.

                    route_res(req, res);
                }



			} else if (tof(route_res) == 'undefined') {
                console.log('no defined route result');

                // Or callback with an error, saying it was not routed?
                //  Maybe no need for async, can check result.


                return false;
            }


			//console.log('processor_values_pair ' + stringify(processor_values_pair));

			//console.log('tof processor ' + tof(processor));

			if (processor_values_pair) {

			}

            return true;

			/*

			if (splitPath.length > 0) {

				if (req.url == '/') {

					var rootTreeRoute = rt.get('/');
					//console.log('rootTreeRoute ' + rootTreeRoute);

					var tRoute = tof(rootTreeRoute);
					//console.log('tRoute ' + tRoute);
					if (tRoute == 'function') {
						rootTreeRoute(req, res);
					}
				} else {


					// I think the way this is set up with CSS is better - using
					//  the router's routing tree and flexibility, rather than hard-coding
					//  it in the logic.
					if (splitPath[0] == 'js') {
						var sjs = pool.get_resource('Site JavaScript');

						sjs.process(req, res);
						//throw 'stop';

						// This could be set outside of this router.
						//  The router is now configurable, makes sense to set it using that config system.


					} else if (splitPath[0] == 'login') {
						//var sjs = pool.get_resource('Site JavaScript');

						login.respond(req, res);
						//throw 'stop';

						// This could be set outside of this router.
						//  The router is now configurable, makes sense to set it using that config system.


					} else if (splitPath[0] == 'logout') {
						//var sjs = pool.get_resource('Site JavaScript');

						login.respond(req, res);
						//throw 'stop';

						// This could be set outside of this router.
						//  The router is now configurable, makes sense to set it using that config system.


					} else if (false && splitPath[0] == 'admin') {
						// direct it to the admin router?
						// to the admin resource?

						// perhaps there will be deeper routing in the application router.

						if (splitPath.length > 1) {
							if (splitPath[1] == 'json') {

								if (splitPath[2] == 'files') {
									// send it to the JSON file admin web interface.

									// Quite possibly use a JSON adapter.
									//  need to get the path after
									var arrRemainingPath = splitPath.slice(3, splitPath.length);
									//console.log('arrRemainingPath ' + stringify(arrRemainingPath));

									var remainingPath = arrRemainingPath.join('/');
									//console.log('remainingPath ' + remainingPath);

									// then we could use a JSON-Resource-Adapter
									//  but we don't have one!

									// get an item from the resource.
									//  That could be getting a file itself.
									//	In this case, it will be for download rather than for viewing in a
									//  web browser (mime type).

									lfs.get(remainingPath, function(err, lfs_res) {
										if (err) {
											throw err;
										} else {
											// Not quite sure what format the results will be given in.

											//console.log('lfs_res ' + lfs_res);
											//throw 'stop';

											// respond as JSON.

											res.writeHead(200, {'Content-Type': 'application/json'});
	  										res.end(JSON.stringify(lfs_res));

										}
									})


								}

							}


							if (splitPath[1] == 'files') {
								// We don't have the references exactly?
								//  Or this has access to the application?

								// And to file admin?
								//  Quite possibly...

								// So there is the local file system resource,
								//  we can get that from the resource pool.
								// There would also need to be a resource to administer that.
								//  View it / access it.
								//  Administer may be right because it needs admin access.

								fswa.process(req, res);
								// The file administrator should also split the paths and do that calculation I think.
								//  May well send processing metadata through in a little while as a further object.


							}

						} else {

						}


					} else {
						// we see what the routing tree has


						// The routing tree will need to deal with variables at various levels.
						//  Or maybe the router does, the routing tree just stores them.

						//  Could try a route function on the routing tree?

						// get being like getRoute

						var route_res = rt.get(req.url);
						// just the handler by itself when there is no array of params?
						var processor_values_pair;

						if (tof(route_res) == 'array') {
							processor_values_pair = route_res;
							var handler = processor_values_pair[0];
							var params = processor_values_pair[1];
							req.params = params;
							handler(req, res);

						} else if (tof(route_res) == 'function') {
							route_res(req, res);

						}


						//console.log('processor_values_pair ' + stringify(processor_values_pair));

						//console.log('tof processor ' + tof(processor));

						if (processor_values_pair) {

						}


						//throw '7) stop';

					}

				}




				// Can check for /js folder.
				//  There will be some fixed resources for the site.
				//   They will be served by Resource objects.
				//  There may be some overlap of resources, with there being some very fixed purpose
				//   specific resources that could duplicate some features of the more general ones.
				//   Eventually, some of the code from the more specific resources will be
				//   replacable with code from the more general ones.

				// Site_JavaScript resource
				//  Will serve JavaScript files needed for the site.
				//   Could become more advanced at some points, serving particular builds.




			}

			*/

			// This could send it to an authenticated service / resource.

			//  /admin
			//  /admin/files could go to a file manager application (html resource)
			//   There could be the HTML interface to the File_System resource there.

			//  /admin/resources could go to the resource pool admin, from where it would be possible to administer
			//   and view various resource.

			// split the path up, then do various initial tests, then maybe send it to the admin resource.
			//  And the admin resource may not be the resource pool interface, it could be more user friendly,
			//  a gateway to deeper administration.
		}
	});


	//return Router;


//});
module.exports = Router;
