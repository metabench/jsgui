define(['./jsgui-html'], 
    function(jsgui) {
        var Data_Object = jsgui.Data_Object, Collection = jsgui.Collection, Control = jsgui.Control;
        var stringify = jsgui.stringify, tof = jsgui.tof;


        var ImageDownloadInfo = Data_Object.extend({
            'fields': {
                'priority': 'number',
                'url': 'unique string'
            }
        })


        var ImageCache = Control.extend({
            'fields': {
                // but have the queue indexed by priority?
                //  I think that is where Collection could be really useful if it covers the various data structure bases.

                'queue': Collection(ImageDownloadInfo),
                'maxSimultaneous': 'number'
            },

            // We may want this in the root of the DOM.
            //  It could get set within the page context.

            // Could have fields...
            //  we will want to tell it to cache various images.

            // Want to be notified when a cached image has downloaded... but something could listen to this, this will
            //  raise events, either change, or imageDownloaded <- seems like a good event name.

            // Also, if an image has downloaded, we want to know various things about it if possible.

            // Need to be able to tell this to download an image by URL.
            //  Maybe also give it a name so it can be retrieved from an index easily without having to deal with URLs.

            // So, this will have a collection of ImageInfo data objects.
            //  It will have controls inside it for the actual images.
            //  It will be positioned off the document with CSS.

            // Can refer to an image by URL



            // .queueDownload(url, priority);



            // getImageStatus(url)
            // 



            'init': function(spec) {
                this._super(spec);

                // given an element when it starts?

                // Controls need to save their elements by default as they are rendered.
                //  Perhaps this will require a recursive traversal of the control once it has been rendered.
                //   Controls get their subcontrols to render.
                //    They don't currently get rendered with their IDs.
                // If they did get rendered with their IDs, it would be easier to activate them.

                // I think there can be different kinds of activation.
                //  Joining controls with elements, so the references are correct.

                // Activating HTML that's been recieved from the server
                // Activating recently rendered client-side HTML








                this.set('dom.attributes.class', 'imageCache');

                // collection of ImageDownloadInfo, indexed by priority
                this.get('queue').index_by('priority');

                this._numDownloading = 0;

            },
            'beginDownload': function(url, callback) {
                // create a new img control.
                //  it goes in this control's content.

                // need dynamic updating of content.
                //  in this case, we add / append the existing item to the DOM.

                // don't want to rerender too much HTML.

                // Give it an element on creation...?
                //  So it does have the actual element before being attached to the DOM?
                //   But then it needs to render into that element somehow.
                
                var img = new jsgui.img({'context': this._context});

                var img_das = img.get('dom.attributes');

                img_das.set('src', url);
                img_das.set('id', img._id());

                //img.set('dom.attributes.src', url);
                //img.set('dom.attributes.id', img._id());

                // really want a way around the DOM references to add it to the DOM efficiently.

                // want to make the new element for the image...

                var div = document.createElement('div');

                //document.body.appendChild(div);

                var html = img.all_html_render();
                //console.log('html ' + html);
                div.innerHTML = html;
                img._el = div.childNodes[0];

                //document.body.removeChild(div);

                // attach an event listener for when it has finished downloading.

                // use Zepto for this for the moment.

                var complete = img._el.complete;
                //console.log('complete ' + complete);

                if (!complete) {
                    Zepto(img._el).bind('load', function(e) {
                        // seems we do have the image element here.
                        //console.log('img._el.src ' + img._el.src);
                        callback(null, url);


                        //console.log('load cb');
                    })
                } else {
                    // we need the URL that the cached image is available from./

                    // in phonegap that won't be the normal URL.

                    if (!this._context.phonegap) {
                        callback(null, url);
                        return url;
                    } else {
                        throw 'stop';
                    }

                    //return 

                }

                

                div.removeChild(div.childNodes[0]);

                //console.log('this._el ' + this._el);

                this._el.appendChild(img._el);


                //throw 'stop';


            },

            'processQueue': function() {

                // also want to start the downloading of a particular image

                // need to get the top item in the queue.
                //  The queue should be indexed by priority.
                //   Should be able to get them in priority order
                //    may need to improve numerical indexing / comparisons?

                // Important to be dealing with the highest priority.

                // access the highest priority one.

                var that = this;
                //console.log('processQueue');

                var queue = this.get('queue');

                var indexes = queue.indexes();
                //console.log('indexes.length ' + stringify(indexes.length));

                var priority, dobj;

                indexes[0].each(function(i, v, stop) {
                    //console.log('i ' + i);
                    //console.log('v ' + v);
                    priority = i;
                    dobj = v;

                    stop();
                })

                //console.log('priority ' + priority);
                //console.log('dobj ' + stringify(dobj));

                var itemCallback = dobj._callback;

                //console.log('queue.length() ' + queue.length());

                var maxSimultaneous = this.get('maxSimultaneous');


                var qLength = queue.length();
                //console.log('qLength ' + qLength);
                if (qLength > 0) {
                    if (this._numDownloading < maxSimultaneous) {
                        var url = dobj.get('url');
                        //console.log('tof url ' + tof(url));
                        //throw 'stop';

                        // when it has downloaded, it's nice to raise a callback in the very image control that called for the
                        //  caching.

                        // Could also use event subscription as well as / instead of a callback
                        
                        /*
                        var res = this.beginDownload(url, function(err, res) {
                            //console.log('cb beginDownload');

                            if (err) {

                            } else {
                                if (itemCallback) {
                                    // and phonegap?

                                    if (!that._context.phonegap) {
                                        itemCallback(null, url);
                                        //return url;
                                    }

                                    
                                }
                            }

                        });
                        return res;
                        */

                        setTimeout(function() {
                            that.beginDownload(url, function(err, res) {
                            //console.log('cb beginDownload');

                            if (err) {

                            } else {
                                if (itemCallback) {
                                    // and phonegap?

                                    if (!that._context.phonegap) {
                                        itemCallback(null, url);
                                        //return url;
                                    }

                                    
                                }
                            }

                        })}, 0);



                    }

                }
            },

            // Have callbacks for the images...?
            'queueDownload': function(url, priority, callback) {
                var queue = this.get('queue');
                //
                //console.log('queueDownload ' + url);
                //console.log('queue ' + stringify(queue));
                var idi = new ImageDownloadInfo({
                    'url': url,
                    'priority': priority
                })
                idi._callback = callback;

                // but can we check to see if it's already available?
                //  probably not.

                queue.push(idi);

                var res = this.processQueue();

                return res;
                //console.log('queue ' + stringify(queue));

                // and we want this to make a quick attempt...


            },
            'getCacheState': function(url) {
                // returns an object
                //  could have status... downloaded
                //   could provide a URL
                //    that could be different in the case of Phonegap, so it's worth having.

                // search for the item with that URL in the queue

                var queue = this.get('queue');

                //var findRes = queue.find({
                //    'url': url
                //});

                var findRes = queue.find(['url', url]);

                //console.log('findRes ' + findRes);




            }
        })

        return ImageCache;
        
    }
);