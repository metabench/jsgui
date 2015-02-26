/**
 * Created by James on 25/07/2014.
 */

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

// As well as resource controls, we will have some other web related resources.
//  The web db resource (adapter) will adapt a DB resource to provide a Web DB interface.
//  The Web DB interface will be the basics for what is needed to run a website.
//   Web DB resource will not have DB implementation specific code.

// The aim of this is to use some quite general purpose code for making a website's DB, and then exposing it as a Resource.

// The abstractions for this are taking ages to program.
//  I would possibly prefer a simpler web db system???
//  However the abstractions are fundamental to getting some systems running.

// Web DB Postgres could just create a blank DB from a backup / dump.
//  It could be made in a few hours / days.

//  It would allow storage of the website's information.
//


// May be worth making Web_DB_Resource_Postgres.
//  A more specific adapter that will not rely so much on the abstract DB and generation system.
//  Really need to maintain a table of users, permissions, roles, and objects associated with users, as well as the site's content.

// The abstraction of this is nice, but it gets difficult and time-consuming to make the full ORM-type system.

// Probably should make a disk / fs version of this.
//  Want to be able to edit images.
//  Want to be able to refer to images / icons, and have the system load them quickly / automatically.

// A simple image admin system would be useful too.
//  Nice if it's got the same API as the database version.
//   Perhaps it's going to be better to work on a disk based system first.

//

// Want a simple interface to some icons, which will be served.
//  Also need to serve the right size image
//  Want a fairly quick image service that gets the file path / URL for an image from disk.
//   Also want to be able to get a higher resolution version, suitable for high-res displays.

// Could possibly specify button images as SVG.


// Perhaps some functonality should be in the image resource.




define(["./jsgui-html", "../resource/core/resource"],

    function(jsgui, Resource) {

        var trim = function(obj) {
            var res = {};
            each(obj, function(v, i) {
                console.log('i', i);
                if (v.trim) {
                    res[i] = v.trim();
                } else {
                    res[i] = v;
                }

            });
            return res;
        };

        var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof, fp = jsgui.fp, sig_match = jsgui.sig_match;
        var extend = jsgui.extend;
        var Control = jsgui.Control, Fns = jsgui.Fns;

        var Web_DB_Resource_Postgres = Resource.extend({
            fields: {


                // It's a database resource.
                // It still connects to a DB resource, this time it needs to be Postgres though.

                'database': Object//,
                //'name': String
            },

            'init': function(spec) {
                this._super(spec);
                var that = this;

                // This serves as an adapter to a database resource.

                // Will have get and set properties.
                //  Not sure about nested subresources.
                //  The Resource is an object that provides an interface to information. How the Resource does that is an implementation detail, but when patterns emerge they could be
                //  made more convenient somehow.

            },
            'start': function(callback) {
                // This can only start when its prerequisite resource has started.
                console.log('Web_DB_Resource start');





                var db = this.get('database');

                // Why does this change from being a Data_Value to a string?
                //  No matter how it winds up working, if it's currently a Data_Value, and we call set, giving it a string, it stays a Data_Value


                var dbs = db.meta.get('status');
                console.log('dbs', dbs);



                var db_status;

                if (dbs.value) {
                    db_status = dbs.value();
                } else {
                    db_status = dbs;
                }


                console.log('db_status', db_status);
                console.log('tof db_status', tof(db_status));
                //throw 'stop';
                var that = this;
                // if it's not started, wait until it starts.

                db.on('start', function(e_start) {
                    //console.log('e_start', e_start);

                    that.start(callback);
                });

                if (db_status != 'on') {

                } else {
                        // We don't ensure the DB here like we do in web-db-resource.
                        //  We just need this to interact with an existing Postgres Web DB.

                    // execute_function on Postgres resource.

                    // however, we want that for specific things.






                    callback(null, true);


                }

            },
            'create_user': function(obj_user, callback) {

                var password_hash = obj_user.passwordhash || obj_user.password_hash;

                if (!password_hash) {
                    if (obj_user.password) {
                        var crypto = require('crypto')
                            , shasum = crypto.createHash('sha1');
                        shasum.update("foo");
                        //console.log(shasum.digest('hex'));
                        password_hash = shasum.digest(obj_user.password) + '';

                    }
                }

                var arr_params = [obj_user.username, password_hash, obj_user.email];

                // rahul_create_user

                this.get('database').execute_function_single_row('rahul_create_user', arr_params, function(err, res_create_user) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_create_user', res_create_user);



                        //callback(null, res_create_user['create_user']);
                        callback(null, res_create_user);
                    }
                });
            },
            'get_all_users': function(callback) {
                // We get multiple rows back as a single JSON object :)

                this.get('database').execute_function_single_row('get_all_users', [], function(err, res_all_users) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_all_users', res_all_users);


                        var res = [];

                        each(res_all_users, function(v) {
                            res.push(trim(v));
                        });

                        callback(null, res);


                    }

                })
            },
            'ensure_user': function(obj_user, callback) {
                var that = this;
                that.get_user_id_by_username(obj_user.username, function(err, uid) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log('uid', uid);
                        if (tof(uid) == 'number') {


                            // better if it returned the id.
                            callback(null, uid);
                        } else {
                            that.create_user(obj_user, callback);
                        }
                    }
                })
            },

            'get_user_id_by_username': function(username, callback) {
                // I think this requires its own SQL function.
                var db = this.get('database');
                db.execute_function_single_row('get_user_id_by_username', [username], function(err, res_exists_user_by_id) {
                    if (err) {
                        throw err;
                    } else {


                        //res_get_user_by_id = trim(res_get_user_by_id);

                        console.log('res_exists_user_by_id', res_exists_user_by_id);

                        callback(null, res_exists_user_by_id);



                        // That's using the JSON system from Postgres to output the row as JSON, interpreted as an object here.
                    }
                });
                
            },

            'exists_user_by_id': function(id, callback) {
                // Not such an exciting one, but may be used within the logic to prevent problems.

                // Exposing a per-user KVS, as well as a few site-wide tables would be useful.
                //  Will have a general structure for site content.
                //  Want the data model to be flexible.
                //  More could be done in the front or middle end.
                //   Being able to save some documents and data will be nice.
                //   Specifically want to allow documentation and forums.
                //   I think the sorted KVS will be capable of a lot. Indexing with the right choice of keys.
                //    Holding a heirachical structure. So that entries / documents in it could be web pages, or instructions to make them.
                //    Could be used to make something deeply browsable, could be useful for documentation.

                // Also want an easy way of getting the site data into the UI components.
                //  An easy UI component for editing this site data would be cool.

                // I think there could be breadcrumb like heirachies within the sorted kvs, with a cms allowing any page to be created there.
                //  Then active components could be put in place which will have their parameters set, they could bring data in from elsewhere too, or check the db, which would
                //   have other services / components keeping it up-to-date.

                var db = this.get('database');
                db.execute_function_single_row('exists_user_by_id', [id], function(err, res_exists_user_by_id) {
                    if (err) {
                        throw err;
                    } else {


                        //res_get_user_by_id = trim(res_get_user_by_id);

                        console.log('res_exists_user_by_id', res_exists_user_by_id);

                        callback(null, res_exists_user_by_id);



                        // That's using the JSON system from Postgres to output the row as JSON, interpreted as an object here.
                    }
                });

            },
            'exists_user_by_username': function(username, callback) {
                var db = this.get('database');
                db.execute_function_single_row('exists_user_by_username', [username], function(err, res_exists_user_by_username) {
                    if (err) {
                        throw err;
                    } else {
                        callback(null, res_exists_user_by_username);
                    }
                });
            },
            'delete_user_by_username': function(username, callback) {
                var db = this.get('database');
                db.execute_function_single_row('delete_user_by_username', [username], function(err, res_delete_user_by_username) {
                    if (err) {
                        throw err;
                    } else {
                        callback(null, res_delete_user_by_username);
                    }
                });
            },
            'get_user_by_id': function(id, callback) {
                var db = this.get('database');
                db.execute_function_single_row('get_user_by_id', [id], function(err, res_get_user_by_id) {
                    if (err) {
                        throw err;
                    } else {


                        res_get_user_by_id = trim(res_get_user_by_id);

                        console.log('res_get_user_by_id', res_get_user_by_id);

                        callback(null, res_get_user_by_id);



                        // That's using the JSON system from Postgres to output the row as JSON, interpreted as an object here.
                    }
                })
            },

            'create_role': function(role_name, callback) {
                var arr_params = [role_name];
                this.get('database').execute_function_single_row('create_role', arr_params, function(err, res_create_role) {
                    if (err) {
                        throw err;
                    } else {
                        callback(null, res_create_role);
                    }
                });
            },

            'exists_role_by_name': function(role_name, callback) {
                var db = this.get('database');
                db.execute_function_single_row('exists_role_by_name', [role_name], function(err, res_exists_role_by_name) {
                    if (err) {
                        throw err;
                    } else {
                        callback(null, res_exists_role_by_name);
                    }
                });
            },

            // get_user_role_id_by_username_role_name
            // get_user_role_id_by_user_id_role_id

            // Would be nicer to have more advanced versions in the DB that process this with strings and lookups.
            //  Perhaps should use joins.

            'get_user_role_id_by_user_id_role_id': function(user_id, role_id, callback) {
                // Can ve used for validation.

                var db = this.get('database');

                // Maybe execute -> single variable?

                db.execute_function_single_row('get_user_role_id_by_user_id_role_id', [user_id, role_id], function(err, res_get_user_role_id_by_user_id_role_id) {
                    if (err) {
                        throw err;
                    } else {


                        //res_get_user_by_id = trim(res_get_user_by_id);

                        console.log('res_get_user_role_id_by_user_id_role_id', res_get_user_role_id_by_user_id_role_id);

                        //throw 'stop';

                        callback(null, res_get_user_role_id_by_user_id_role_id);



                        // That's using the JSON system from Postgres to output the row as JSON, interpreted as an object here.
                    }
                });
            },

            'get_all_roles': function(callback) {
                // We get multiple rows back as a single JSON object :)
                this.get('database').execute_function_single_row('get_all_roles', [], function(err, res_all_roles) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_all_roles', res_all_roles);
                        var res = [];
                        each(res_all_roles, function(v) {
                            res.push(trim(v));
                        });
                        callback(null, res);
                    };
                })
            },


            'get_role_id_by_name': function(role_name, callback) {
                // I think this requires its own SQL function.
                var db = this.get('database');

                // Maybe execute -> single variable?

                db.execute_function_single_row('get_role_id_by_name', [role_name], function(err, res_get_role_id_by_name) {
                    if (err) {
                        throw err;
                    } else {


                        //res_get_user_by_id = trim(res_get_user_by_id);

                        console.log('res_get_role_id_by_name', res_get_role_id_by_name);
                        console.log('tof res_get_role_id_by_name', tof(res_get_role_id_by_name));

                        //throw 'stop';

                        callback(null, res_get_role_id_by_name);



                        // That's using the JSON system from Postgres to output the row as JSON, interpreted as an object here.
                    }
                });

            },

            'create_user_role': fp(function(a, sig) {
                // Though this does ensuring really.

                var user_id, role_id, username, role_name;
                var callback;
                var that = this;

                // but if we get strings, we need to find out what the ids are before calling the functions.
                //  Perhaps the plpgsql language would help with keeping that within the stored functions.
                console.log('create_user_role sig', sig);
                if (sig == '[s,s,f]') {
                    username = a[0];
                    role_name = a[1];
                    callback = a[2];

                    this.get_role_id_by_name(role_name, function(err, role_id) {
                        if (err) {
                            callback(err);
                        } else {
                            console.log('role_id', role_id);
                            that.get_user_id_by_username(username, function (err, user_id) {
                                if (err) {
                                    callback(err);
                                } else {
                                    console.log('user_id', user_id);

                                    that.get_user_role_id_by_user_id_role_id(user_id, role_id, function(err, user_role_id) {
                                        if (err) {
                                            throw err;
                                        } else {

                                            console.log('user_role_id', user_role_id);

                                            if (tof(user_role_id) == 'number') {
                                                callback(null, user_role_id);
                                            } else {
                                                // need to create it.
                                                that.create_user_role(user_id, role_id, callback);

                                            }


                                        }
                                    })

                                }
                            })
                        }
                    });
                }

                if (sig == '[n,n,f]') {
                    user_id = a[0];
                    role_id = a[1];
                    callback = a[2];

                    var db = this.get('database');
                    db.execute_function_single_row('create_user_role', [user_id, role_id], function(err, res_create_user_role) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('res_create_user_role', res_create_user_role);

                            callback(null, res_create_user_role);
                        }
                    });
                }
            }),

            'ensure_user_role': function(str_username, str_role, callback) {
                // See if it already exists there...

                // get_user_role_id_by_username_role

                this.create_user_role(str_username, str_role, function(err, res_create_user_role) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_create_user_role', res_create_user_role);
                    }
                })
            },

            'user_has_role': fp(function(a, sig) {
                var username, role_name, user_id, role_id, callback;

                if (sig == '[s,s,f]') {
                    username = a[0];
                    role_name = a[1];
                    callback = a[2];

                    this.get_role_id_by_name(role_name, function(err, role_id) {
                        if (err) {
                            callback(err);
                        } else {
                            console.log('role_id', role_id);
                            that.get_user_id_by_username(username, function (err, user_id) {
                                if (err) {
                                    callback(err);
                                } else {
                                    console.log('user_id', user_id);

                                    that.user_has_role(user_id, role_id, callback);

                                }
                            })
                        }

                    })

                }

                if (sig == '[n,n,f]') {

                    user_id = a[0];
                    role_id = a[1];
                    callback = a[2];

                    this.get_user_role_id_by_user_id_role_id(user_id, role_id, function(err, role_id) {
                        if (err) {
                            callback(err);
                        } else {
                            var tri = tof(role_id);

                            if (tri == 'number') {
                                callback(null, true);
                            } else {
                                callback(null, false);
                            }

                        }
                    })

                }
            }),

            '_set_document': fp(function(a, sig) {
                console.log('set_document sig', sig);
                throw 'stop';
                var key, mime_type, value, callback;
                if (sig == '[s,s,s,f]') {
                    key = a[0];
                    mime_type = a[1];
                    value = a[2];
                    callback = a[3];

                    var db = this.get('database');

                    // May need logic depending on the document...



                    db.execute_function_single_row('set_document', [key, mime_type, value], function(err, res_set_document) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('res_set_document', res_set_document);

                            callback(null, res_set_document);
                        }
                    });
                } else {
                    console.log('sig', sig);
                    throw 'unexpected signature';

                }


            }),

            // have lower level functions too, they will deal with the db objects.

            '_create_document': function(key, document_type_id, callback) {
                var db = this.get('database');
                db.execute_function_single_row('create_document', [key, document_type_id], function(err, res_create_document) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_create_document', res_create_document);
                        callback(null, res_create_document);
                    }
                });
            },

            // create document_type

            // and ensure_document_type

            // Want to have it so that it labels the document as having a particular type.
            //  Then it knows which table to find the indexed value associated.


            'get_document_type_id_by_name': function(name, callback) {
                // I think this requires its own SQL function.
                var db = this.get('database');
                db.execute_function_single_row('get_document_type_id_by_name', [name], function(err, res_get_document_type_id_by_name) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_get_document_type_id_by_name', res_get_document_type_id_by_name);
                        callback(null, res_get_document_type_id_by_name);
                    }
                });

            },

            'get_document_metadata_record_type_id_by_name': function(name, callback) {
                var db = this.get('database');
                db.execute_function_single_row('get_document_metadata_record_type_id_by_name', [name], function(err, res_get_document_metadata_record_type_id_by_name) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_get_document_metadata_record_type_id_by_name', res_get_document_metadata_record_type_id_by_name);
                        callback(null, res_get_document_metadata_record_type_id_by_name);
                    }
                });
            },

            //get_doc_meta_int_record_id_by_doc_meta_record_id

            'get_doc_meta_int_record_id_by_doc_meta_record_id': function(document_metadata_record_id, callback) {
                var db = this.get('database');
                db.execute_function_single_row('get_doc_meta_int_record_id_by_doc_meta_record_id', [document_metadata_record_id], function(err, res_get_doc_meta_int_record_id_by_doc_meta_record_id) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_get_doc_meta_int_record_id_by_doc_meta_record_id', res_get_doc_meta_int_record_id_by_doc_meta_record_id);
                        callback(null, res_get_doc_meta_int_record_id_by_doc_meta_record_id);
                    }
                });
            },

            'get_document_metadata_record_type_id_by_name': function(document_metadata_record_id, callback) {
                var db = this.get('database');
                db.execute_function_single_row('get_document_metadata_record_type_id_by_name', [document_metadata_record_id], callback);
            },



            'get_document_metadata_record_id_by_document_id_key': function(document_id, metadata_key, callback) {
                var db = this.get('database');

                // get_doc_meta_record_id_by_doc_id_key

                db.execute_function_single_row('get_doc_meta_record_id_by_doc_id_key', [document_id, metadata_key], function(err, res_get_document_metadata_record_id_by_document_id_key) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_get_document_metadata_record_id_by_document_id_key', res_get_document_metadata_record_id_by_document_id_key);
                        callback(null, res_get_document_metadata_record_id_by_document_id_key);
                    }
                });
            },

            'create_document_type': function(name, mime_type, callback) {
                var db = this.get('database');
                db.execute_function_single_row('create_document_type', [name, mime_type], function(err, res_create_document_type) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_create_document_type', res_create_document_type);
                        callback(null, res_create_document_type);
                    }
                });
            },

            'create_document_metadata_record_type': function(name, callback) {
                var db = this.get('database');
                db.execute_function_single_row('create_document_metadata_record_type', [name], function(err, res_create_document_metadata_record_type) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_create_document_metadata_record_type', res_create_document_metadata_record_type);
                        callback(null, res_create_document_metadata_record_type);
                    }
                });
            },

            'create_document_metadata_record': function(document_id, key, record_type_id, callback) {
                var db = this.get('database');
                db.execute_function_single_row('create_document_metadata_record', [document_id, key, record_type_id], function(err, res_create_document_metadata_record) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_create_document_metadata_record', res_create_document_metadata_record);
                        callback(null, res_create_document_metadata_record);
                    }
                });
            },

            // create_document_metadata_integer_record
            'create_document_metadata_integer_record': function(document_meatadat_record_id, value, callback) {
                var db = this.get('database');
                db.execute_function_single_row('create_document_metadata_integer_record', [document_meatadat_record_id, value], function(err, res_create_document_metadata_integer_record) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_create_document_metadata_integer_record', res_create_document_metadata_integer_record);
                        callback(null, res_create_document_metadata_integer_record);
                    }
                });
            },


            'update_document_type': function(id, name, mime_type, callback) {
                var db = this.get('database');
                db.execute_function_single_row('update_document_type', [id, name, mime_type], function(err, res_update_document_type) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_update_document_type', res_update_document_type);
                        callback(null, res_update_document_type);
                    }
                });
            },

            // ensure document type...

            'ensure_document_type': function(name, mime_type, callback) {
                console.log('ensure_document_type');
                var that = this;
                this.get_document_type_id_by_name(name, function(err, document_type_id) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log('document_type_id', document_type_id);
                        var t_document_type_id = tof(document_type_id);

                        if (t_document_type_id == 'number') {
                            console.log('already exists id', document_type_id);

                            // do an update on it to make sure it has the right information.

                            that.update_document_type(document_type_id, name, mime_type, callback);

                            //throw 'stop';

                        } else {
                            that.create_document_type(name, mime_type, callback);
                        }
                    }
                })
            },

            'ensure_document_metadata_record_type': function(name, callback) {
                // Can we call such an 'ensure' function in the DB?
                // I think it would have to use the Postgres SQL to get it to do multiple things and use variables.

                console.log('ensure_document_metadata_record_type');
                var that = this;
                this.get_document_metadata_record_type_id_by_name(name, function(err, document_metadata_record_type_id) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log('document_metadata_record_type_id', document_metadata_record_type_id);
                        var t_document_metadata_record_type_id = tof(document_metadata_record_type_id);

                        if (t_document_metadata_record_type_id == 'number') {
                            console.log('already exists id', document_metadata_record_type_id);

                            // do an update on it to make sure it has the right information.

                            that.update_document_metadata_record_type(document_type_id, name, callback);

                            //throw 'stop';

                        } else {
                            that.create_document_metadata_record_type(name, callback);
                        }
                    }
                })

            },

            'ensure_document_metadata_record': function(document_id, key, record_type_id, callback) {
                // Try getting the record.

                // get_document_metadata_record_id_by_key_record_type_id
                var that = this;

                this.get_document_metadata_record_id_by_document_id_key(document_id, key, function(err, document_metadata_record_id) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log('document_metadata_record_id', document_metadata_record_id);

                        var t_document_metadata_record_id = tof(document_metadata_record_id);
                        if (t_document_metadata_record_id == 'number') {
                            // it exists

                            // just ensuring the record exists, so nothing more to do

                            callback(null, document_metadata_record_id);

                        } else {
                            // create it.

                            that.create_document_metadata_record(document_id, key, record_type_id, callback);


                        }



                    }
                });

            },

            // update_document_metadata_integer_record

            // ensure_metadata_integer_record_value
            'ensure_document_metadata_integer_record': function(document_metadata_record_id, value, callback) {
                // try to get the integer record value by its document_metadata_record_id

                // get_doc_meta_int_record_id_by_doc_meta_record_id

                console.log('ensure_document_metadata_integer_record document_metadata_record_id', document_metadata_record_id);

                var that = this;

                // first off, we need the 'integer' record type id.




                that.get_doc_meta_int_record_id_by_doc_meta_record_id(document_metadata_record_id, function(err, document_metadata_integer_record_id) {
                    if (err) {
                        callback(err);
                    } else {
                        var t_document_metadata_integer_record_id = tof(document_metadata_integer_record_id);
                        console.log('t_document_metadata_integer_record_id', t_document_metadata_integer_record_id);
                        //throw 'stop 10';

                        if (t_document_metadata_integer_record_id == 'number') {
                            // update the integer record.

                            // id of the integer record, id of the metadata record, value, callback

                            that.update_document_metadata_integer_record(document_metadata_integer_record_id, document_metadata_record_id, value, callback);

                        } else {
                            that.create_document_metadata_integer_record(document_metadata_record_id, value, callback);
                        }
                    }
                });
            },




            'get_document_id_by_key': function(key, callback) {
                // I think this requires its own SQL function.
                var db = this.get('database');
                db.execute_function_single_row('get_document_id_by_key', [key], function(err, res_get_document_id_by_key) {
                    if (err) {
                        throw err;
                    } else {

                        //res_get_user_by_id = trim(res_get_user_by_id);

                        console.log('res_get_document_id_by_key', res_get_document_id_by_key);

                        callback(null, res_get_document_id_by_key);



                        // That's using the JSON system from Postgres to output the row as JSON, interpreted as an object here.
                    }
                });

            },
            // update_document_metadata_integer_record
            //  much simpler / neater like this.
            'update_document_metadata_integer_record': function(id, document_metadata_record_id, value, callback) {
                var db = this.get('database');
                console.log('[id, document_metadata_record_id, value]', [id, document_metadata_record_id, value]);
                //throw 'stop 11';

                db.execute_function_single_row('update_document_metadata_integer_record', [id, document_metadata_record_id, value], callback);
            },



            // update_binary_document_value

            '_update_binary_document_value': function(binary_document_value_id, document_id, value, callback) {
                var db = this.get('database');
                db.execute_function_single_row('update_binary_document_value', [binary_document_value_id, document_id, value], function(err, res_update_binary_document_value) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_update_binary_document_value', res_update_binary_document_value);
                        callback(null, res_update_binary_document_value);
                    }
                });
            },



            // The value will be a buffer. Hopefully node pg handles that fine.

            '_create_binary_document_value': function(document_id, value, callback) {
                var db = this.get('database');
                db.execute_function_single_row('create_binary_document_value', [document_id, value], function(err, res_create_binary_document_value) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_create_binary_document_value', res_create_binary_document_value);
                        callback(null, res_create_binary_document_value);
                    }
                });
            },

            '_create_string_document_value': function(document_id, value, callback) {
                var db = this.get('database');
                db.execute_function_single_row('create_string_document_value', [document_id, value], function(err, res_create_string_document_value) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_create_string_document_value', res_create_string_document_value);
                        callback(null, res_create_string_document_value);
                    }
                });
            },

            '_create_json_document_value': function(document_id, value, callback) {
                var db = this.get('database');
                db.execute_function_single_row('create_json_document_value', [document_id, value], function(err, res_create_json_document_value) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_create_json_document_value', res_create_json_document_value);
                        callback(null, res_create_json_document_value);
                    }
                });
            },

            'get_document_document_type_id_by_id': function(document_id, callback) {
                var db = this.get('database');
                db.execute_function_single_row('get_document_document_type_id_by_id', [document_id], function(err, res_get_document_document_type_id_by_id) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_get_document_document_type_id_by_id', res_get_document_document_type_id_by_id);
                        callback(null, res_get_document_document_type_id_by_id);
                    }
                });
            },

            'get_document_document_type_name_by_id': function(document_id, callback) {
                var db = this.get('database');
                db.execute_function_single_row('get_document_document_type_name_by_id', [document_id], function(err, res_get_document_document_type_name_by_id) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_get_document_document_type_name_by_id', res_get_document_document_type_name_by_id);
                        callback(null, res_get_document_document_type_name_by_id);
                    }
                });
            },

            'get_binary_document_value_id_by_document_id': function(document_id, callback) {
                var db = this.get('database');
                db.execute_function_single_row('get_binary_document_value_id_by_document_id', [document_id], function(err, res_get_binary_document_value_id_by_document_id) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_get_binary_document_value_id_by_document_id', res_get_binary_document_value_id_by_document_id);
                        callback(null, res_get_binary_document_value_id_by_document_id);
                    }
                });
            },

            'get_binary_document_value_value_by_document_id': function(document_id, callback) {
                var db = this.get('database');
                db.execute_function_single_row('get_binary_document_value_value_by_document_id', [document_id], function(err, res_get_binary_document_value_value_by_document_id) {
                    if (err) {
                        throw err;
                    } else {
                        //console.log('res_get_binary_document_value_value_by_document_id', res_get_binary_document_value_value_by_document_id);
                        callback(null, res_get_binary_document_value_value_by_document_id);
                    }
                });
            },

            'get_string_document_value_id_by_document_id': function(document_id, callback) {
                var db = this.get('database');
                db.execute_function_single_row('get_string_document_value_id_by_document_id', [document_id], function(err, res_get_string_document_value_id_by_document_id) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_get_string_document_value_id_by_document_id', res_get_string_document_value_id_by_document_id);
                        callback(null, res_get_string_document_value_id_by_document_id);
                    }
                });
            },

            'get_string_document_value_value_by_document_id': function(document_id, callback) {
                var db = this.get('database');
                db.execute_function_single_row('get_string_document_value_value_by_document_id', [document_id], function(err, res_get_string_document_value_value_by_document_id) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_get_string_document_value_value_by_document_id', res_get_string_document_value_value_by_document_id);
                        callback(null, res_get_string_document_value_value_by_document_id);
                    }
                });
            },
            
            'get_json_document_value_value_by_document_id': function(document_id, callback) {
                var db = this.get('database');
                db.execute_function_single_row('get_json_document_value_value_by_document_id', [document_id], function(err, res_get_json_document_value_value_by_document_id) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_get_json_document_value_value_by_document_id', res_get_json_document_value_value_by_document_id);
                        callback(null, res_get_json_document_value_value_by_document_id);
                    }
                });
            },

            // get_document_metadata_integer_records_by_document_id

            'get_document_metadata_integer_records_by_document_id': function(document_id, callback) {
                var db = this.get('database');

                // Want this to return the data in a friendlier format.

                // Not a single row function.
                //  Returning data from Postgres functions seems a bit tricky.

                db.execute_function('get_document_metadata_integer_records_by_document_id', [document_id], callback);
            },

            'get_document_metadata_record_ids_by_document_id': function(document_id, callback) {
                var db = this.get('database');

                // Not a single row dunction

                db.execute_function('get_document_metadata_record_ids_by_document_id', [document_id], callback);
            },

            'get_document_metadata': fp(function(a, sig) {
                var document_id, document_key, callback;
                var that = this;

                console.log('get_document_metadata sig', sig);

                if (sig == '[n,f]') {
                    document_id = a[0];
                    callback = a[1];

                    // get all the ids of the document metadata records.
                    //  (and types?)

                    // Getting a bunch of different metadata record IDs?


                    // get_doc_meta_int_recs_by_doc_id
                    //  would get the key and value of each item.



                    that.get_document_metadata_integer_records_by_document_id(document_id, function(err, integer_records) {
                        if (err) {
                            callback(err);
                        } else {
                            console.log('integer_records', integer_records);

                            var res = {};

                            each(integer_records, function(record) {
                                res[record.key] = record.value;
                            });

                            //throw 'stop';
                            callback(null, res);
                        }
                    });



                    /*
                    that.get_document_metadata_record_ids_by_document_id(document_id, function(err, document_metadata_record_ids) {
                        if (err) {
                            callback(err)
                        } else {
                            //  Possibly want a view of the document and metadata.
                            console.log('document_metadata_record_ids', document_metadata_record_ids);



                            throw 'stop';


                            // However, we can get the various metadata value records by type

                            // could get all of the document's integer metadata
                            // then the string metadata




                        }
                    });
                    */


                    // then get the

                    // want to get all of the document metadata records.
                    //  it may be possible to do joins with the values.

                    // possibly we could get the associated integer values later on.

                    // or get all integer values, all of the various linked values, relevant to that document metadata record.



                }
                if (sig == '[s,f]') {
                    document_key = a[0];
                    callback = a[1];

                    that.get_document_id_by_key(document_key, function(err, document_id) {
                        if (err) {
                            callback(err)
                        } else {
                            that.get_document_metadata(document_id, callback);
                        }
                    })



                    // want to get all of the document metadata records.
                    //  it may be possible to do joins with the values.

                    // possibly we could get the associated integer values later on.

                    // or get all integer values, all of the various linked values, relevant to that document metadata record.



                }
            }),

            // get_string_document_value_value_by_document_id

            // Could make this polymorphic, and call itself?

            // type name or mume type?

            'set_document_metadata': fp(function(a, sig) {

                console.log('set_document_metadata sig', sig);
                //throw 'stop 4';

                // Could possibly call this function with the document key.
                //  It would look up the document id, by key, and call the function again.

                var document_id, document_key, metadata_record_key, metadata_record_value, obj_values, callback;
                var that = this;

                if (sig == '[s,s,s,f]' || sig == '[s,s,n,f]') {
                    document_key = a[0];
                    metadata_record_key = a[1];
                    metadata_record_value = a[2];
                    callback = a[3];

                    // Then need to look up the document id, and call the function again.

                    that.get_document_id_by_key(document_key, function(err, document_id) {
                        if (err) {
                            callback(err);
                        } else {

                            console.log('cb get_document_id_by_key document_id', document_id);

                            that.set_document_metadata(document_id, metadata_record_key, metadata_record_value, callback);
                        }
                    })

                }


                if (sig == '[n,s,s,f]' || sig == '[n,s,n,f]') {
                    document_id = a[0];
                    metadata_record_key = a[1];
                    metadata_record_value = a[2];
                    callback = a[3];
                }

                if (sig == '[n,o,f]') {
                    // Putting things like this here in an immediate function could be a good optimization.
                    //  Some parts could wind up, as their own functions, running faster.



                    document_id = a[0];
                    obj_values = a[1];
                    callback = a[2];

                    // we call it with these values.
                    //  could this be done using mapify instead?

                    var fns = jsgui.Fns();
                    each(obj_values, function(v, i) {
                        // And a callback...

                        fns.push([that, that.set_document_metadata, [document_id, i, v]]);
                    });

                    fns.go(function(err, res_fns) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('res_fns', res_fns);

                            //throw 'stop 5';
                            callback(null, res_fns);

                        }
                    });

                }

                if (tof(document_id) == 'number') {
                    var t_metadata_record_value = tof(metadata_record_value);
                    console.log('metadata_record_key', metadata_record_key);
                    console.log('metadata_record_value', metadata_record_value);
                    //console.log('metadata_record_key', metadata_record_key);
                    //throw 'stop 6';

                    // create_document_metadata_record

                    // also need to know the record type.
                    //  we can look up the record type at an earlier stage.

                    // we need to judge what type we are making the field.
                    //  perhaps we should represent JSON numbers as high precision decimals?

                    if (t_metadata_record_value == 'string') {

                    }
                    if (t_metadata_record_value == 'number') {



                        // Could assume it's an integer type?
                        //  Will do that for the moment.

                        // save it as an integer record for the moment.
                        //  need to get the integer metadata record type.

                        // get_document_metadata_record_type_id_by_name

                        /*
                         DROP FUNCTION get_document_metadata_integer_records_by_document_id(integer);

                         CREATE OR REPLACE FUNCTION get_document_metadata_integer_records_by_document_id(document_id integer)
                         RETURNS table(key character varying, value integer) AS
                         $BODY$

                         SELECT document_metadata_records.key, document_metadata_integer_records.value FROM document_metadata_integer_records
                         LEFT OUTER JOIN document_metadata_records
                         ON document_metadata_integer_records.document_metadata_record_id = document_metadata_records.id
                         WHERE document_metadata_records.document_id = $1

                         $BODY$
                         LANGUAGE sql VOLATILE
                         COST 100;
                         ALTER FUNCTION get_document_metadata_integer_records_by_document_id(integer)
                         OWNER TO postgres;

                         */

                        // But not using these record type ids could work best?
                        //  As in get all of the different metadata record types?
                        //  Or there could be more depth where the record type indicates some interpretation.

                        // Anyway, leave as is for the moment.




                        that.get_document_metadata_record_type_id_by_name('integer', function(err, document_metadata_record_type_id) {
                            if (err) {
                                callback(err);
                            } else {

                                console.log('document_metadata_record_type_id', document_metadata_record_type_id);
                                //throw 'stop';

                                // now we have the record type id, we can
                                //throw 'stop 7';



                                that.ensure_document_metadata_record(document_id, metadata_record_key, document_metadata_record_type_id, function(err, document_metadata_record_id) {
                                    if (err) {
                                        //throw err;
                                        callback(err);
                                    } else {
                                        console.log('document_metadata_record_id', document_metadata_record_id);

                                        //throw 'stop';
                                        //throw 'stop 8';

                                        // then need to ensure the document metadata record value (of the appropriate type).

                                        that.ensure_document_metadata_integer_record(document_metadata_record_id, metadata_record_value, function(err, res_ensure_metadata_integer_record_value) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                console.log('res_ensure_metadata_integer_record_value', res_ensure_metadata_integer_record_value);
                                                //throw 'stop 9';
                                                // Then I think the function's done.
                                                // return the document metadata record id

                                                callback(null, document_metadata_record_id);


                                            }
                                        });





                                    }
                                })

                            }
                        })


                    }




                    // don't include the record value?

                };

                // then we see if there is such a metadata record already.
                //  could maybe use an ensure function.



            }),

            //'create_documentation_transformation': function()

            'get_transformation_verb_id_by_name': function(str_verb, callback) {

                var db = this.get('database');
                db.execute_function('get_transformation_verb_id_by_name', [str_verb], function(err, res) {
                    if (err) {
                        callback(err)
                    } else {
                        callback(null, res[0]);
                    }
                });

            },

            '_create_document_transformation': function(source_document_id, target_document_id, transformation_verb_id, callback) {
                var db = this.get('database');
                db.execute_function('create_document_transformation', [source_document_id, target_document_id, transformation_verb_id], function(err, res_create) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_create', res_create);
                        callback(null, res_create[0]);
                    }
                });
            },

            // This could get the whole param object.
            //  DB function returns a set of JSON records, this should be OK...

            'get_document_transformation_parameter_by_transformation_id_key': function(transformation_id, key, callback) {
                var db = this.get('database');
                db.execute_function('get_document_transformation_parameter_by_transformation_id_key', [transformation_id, key], function(err, res) {
                    if (err) {
                        callback(err)
                    } else {
                        callback(null, res[0]);
                    }
                });
            },

            // Can try to get the document transformation paramter.
            //  could use this to ensure.


            'ensure_document_transformation_parameter': function(transformation_id, key, type_id, callback) {
                // try to get it first.

                this.get_document_transformation_parameter_by_transformation_id_key(transformation_id, key, function(err, res_id) {
                    if (err) {
                        throw err;
                    } else {

                        console.log('res_id', res_id);

                        // it may be undefined.

                        var t_res_id = tof(res_id);
                        console.log('t_res_id', t_res_id);


                    }

                })
            },



            // create_document_transformation_parameter

            '_create_document_transformation_parameter': function(transformation_id, key, type_id, callback) {
                var db = this.get('database');
                db.execute_function('create_document_transformation_parameter', [transformation_id, key, type_id], function(err, res_create) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_create', res_create);
                        callback(null, res_create[0]);
                    }
                });
            },

            //

            'create_document_transformation_integer_parameter': function(parameter_id, value, callback) {
                var db = this.get('database');
                db.execute_function('create_document_transformation_integer_parameter', [parameter_id, value], function(err, res_create) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_create', res_create);
                        callback(null, res_create[0]);
                    }
                });
            },

            // get_document_transformation_id_by_source_id_target_id

            'get_document_transformation_id_by_source_id_target_id': function(source_id, target_id, callback) {
                var db = this.get('database');
                db.execute_function('get_document_transformation_id_by_source_id_target_id', [source_id, target_id], function(err, res) {
                    if (err) {
                        callback(err)
                    } else {
                        callback(null, res[0]);
                    }
                });
            },

            'get_document_transformation_by_source_id_target_id': function(source_id, target_id, callback) {
                var db = this.get('database');
                db.execute_function('get_document_transformation_by_source_id_target_id', [source_id, target_id], function(err, res) {
                    if (err) {
                        callback(err)
                    } else {
                        callback(null, res[0][0]);
                    }
                });
            },

            // simple function, gets the transformation if if it's already there.
            //  Then I think if it is, while ensuring, deleting may be easier.
            //  Because of the parameters.
            //   However, could get the parameters and compare them.
            // Delete with cascade seems the easiest for the moment.
            //  Could possible delete all the parameter records with one function, or update all the parameter records.

            'get_document_transformation_parameter_type_id_by_name': function(name, callback) {
                var db = this.get('database');
                db.execute_function('get_document_transformation_parameter_type_id_by_name', [name], function(err, res) {
                    if (err) {
                        callback(err)
                    } else {
                        callback(null, res[0]);
                    }
                });
            },

            'ensure_document_transformation_integer_parameter': function(transformation_id, key, value, callback) {
                // needs to find out the type id of the integer type.
                //  perhaps this could have been given / cached and known.
                //get_document_transformation_parameter_type_id_by_name
                var that = this;

                this.get_document_transformation_parameter_type_id_by_name('integer', function(err, integer_id) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('integer_id', integer_id);

                        //callback(null, integer_id)

                        // then we can ensure the parameter (key) record.
                        //that._create_document_transformation()

                        // ensure the parameter record

                        // ensure_document_transformation_parameter
                        // create_document_transformation_parameter

                        that.ensure_document_transformation_parameter(transformation_id, key, integer_id, function(err, res_ensure_parameter) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('res_ensure_parameter', res_ensure_parameter);
                            }
                        })




                    }
                })

            },

            'get_document_transformation_parameters_by_transformation_id': function(transformation_id, callback) {
                var db = this.get('database');
                db.execute_function('get_document_transformation_parameters_by_transformation_id', [transformation_id], function(err, res) {
                    if (err) {
                        callback(err)
                    } else {
                        console.log('res', res);
                        //throw 'stop';
                        callback(null, res[0]);
                    }
                });
            },

            'get_doc_trans_int_params_by_trans_id': function(transformation_id, callback) {
                var db = this.get('database');
                db.execute_function('get_doc_trans_int_params_by_trans_id', [transformation_id], function(err, res) {
                    if (err) {
                        callback(err)
                    } else {
                        console.log('get_doc_trans_int_params_by_trans_id res', res);
                        //throw 'stop';
                        callback(null, res[0]);
                    }
                });
            },


            // Get the params object.
            //  Would need to look up the specific values of the parameters.

            'get_document_transformation_obj_parameters': function(transformation_id, callback) {
                var that = this;
                that.get_document_transformation_parameters(transformation_id, function(err, res_params) {
                    if (err) {
                        throw err;
                    } else {
                        // Need to then look up the parameters with the specific object types.

                        console.log('res_params', res_params);

                        // need the map of parameter types.

                        that.get_map_transformation_parameter_types(function(err, map_transformation_parameter_types) {
                            if (err) {
                                throw err;
                            } else {

                                console.log('map_transformation_parameter_types', map_transformation_parameter_types);

                                var inv_map_tpts = {};

                                each(map_transformation_parameter_types, function(v, i) {
                                    inv_map_tpts[v] = i;
                                });

                                console.log('inv_map_tpts', inv_map_tpts);

                                // Make a list / map? of the various types of parameter that were used.

                                var arr_used_param_type_ids = [];
                                var map_used_param_type_ids = {};

                                var arr_used_param_data_types = [];
                                var map_used_param_data_types = [];

                                each(res_params, function(res_param) {
                                    var param_name = res_param.key;
                                    var type_id = res_param.type_id;

                                    if (!map_used_param_type_ids[type_id]) {
                                        map_used_param_type_ids[type_id] = true;
                                        map_used_param_data_types[inv_map_tpts[type_id]] = true;

                                        arr_used_param_type_ids.push(type_id);
                                        arr_used_param_data_types.push(inv_map_tpts[type_id]);

                                    }


                                })

                                console.log('arr_used_param_type_ids', arr_used_param_type_ids);
                                console.log('arr_used_param_data_types', arr_used_param_data_types);
                                console.log('map_used_param_data_types', map_used_param_data_types);

                                // then, checking which have been used, run the functions to get the specific applicable value results.

                                // will build up fns to execute.

                                var fns = jsgui.Fns();

                                if (map_used_param_data_types['integer']) {
                                    // get the integer value records.

                                    // want to get the integer values alongside the keys.
                                    //  though we do have the parameter objects anyway.
                                    //  would be nicer to get them with keys though.

                                    // get_doc_trans_int_params_by_trans_id
                                    //  could have another version that links to get the keys as well.

                                    // that function would get the int param keys and values

                                    fns.push([that, that.get_doc_trans_int_params_by_trans_id, [transformation_id]]);










                                }
                                var res = {};

                                fns.go(function(err, res_all) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log('2) res_all', res_all);

                                        each(res_all, function(type_res) {
                                            each(type_res, function(item_res) {
                                                res[item_res.key] = item_res.value
                                            })
                                        });

                                        console.log('res', res);

                                        callback(null, res);

                                    }
                                })




                                // so for every used type id, we call the procedure that gets all of the param values of that type.
                                //  then we build it up into the result object.

                                // then look up the data types that they correspond with.






                                //throw 'stop';
                            }
                        })





                    }

                })

            },


            // needs to get all to the trans params
            'get_document_transformation_parameters': function(transformation_id, callback) {
                // Needs to get the transformation param records.
                // SELECT * FROM document_transformation_parameters WHERE transformation_id = $1

                // Get the bunch of them without the values, then run the necessary procedures to get the values of the specific types.



                // get_document_transformation_parameters_by_transformation_id
                //  will get the params as JSON objects

                var that = this;

                that.get_document_transformation_parameters_by_transformation_id(transformation_id, function(err, res_param_records) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_param_records', res_param_records);

                        // should return them as a map (I think?)

                        var res = {};

                        each(res_param_records, function(v) {
                            res[v.key] = v;
                        });




                        //throw 'stop';

                        //return {};

                        callback(null, res);
                        // just for the moment.


                        //throw 'stop';
                    }
                })





            },

            // Leter on, may have this subdivided by users / permissions, assigned ownership.
            //  That would mean that a whole load of new functions would need to be written to do things in a secure way.



            'get_document_transformation_source_target_keys_by_verb_id': function(transformation_verb_id, callback) {
                var db = this.get('database');
                db.execute_function('get_document_transformation_source_target_keys_by_verb_id', [transformation_verb_id], function(err, res) {
                    if (err) {
                        callback(err)
                    } else {
                        console.log('res', res);
                        //throw 'stop';
                        callback(null, res[0]);
                    }
                });
            },

            'get_joined_int_trans_params_by_trans_verb_id': function(transformation_verb_id, callback) {
                var db = this.get('database');
                db.execute_function('get_joined_int_trans_params_by_trans_verb_id', [transformation_verb_id], function(err, res) {
                    if (err) {
                        callback(err)
                    } else {
                        console.log('res', res);
                        //throw 'stop';

                        // This provides extensive data about the parameters in the transformations.
                        //  Potentially some transformations won't have parameters.




                        callback(null, res[0]);
                    }
                });
            },



            // get_document_resize_transformations

            // Including parameters?

            // the basic function which gets the transformation records may be of use.



            'get_document_resize_transformations': function(callback) {
                // needs to run the basic function that gets the transformations (and between which documents' keys and values)
                //  and then we run the function that gets the records with parameters.
                // we include the parameter information within the resize transformation result object.
                var that = this;

                that.get_transformation_verb_id_by_name('resize', function(err, resize_verb_id) {
                    if (err) {
                        throw err;
                    } else {
                        that.get_document_transformation_source_target_keys_by_verb_id(resize_verb_id, function (err, res_transformations) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('res_transformations', res_transformations);
                                //throw 'stop';

                                callback(null, res_transformations);


                                // get the

                                /*
                                that.get_document_resize_transformations_with_keys_parameters(function (err, res_param_info) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log('res_param_info', res_param_info);

                                        throw 'stop';

                                    }


                                });
                                */


                            }
                        })
                    }
                });
            },



            // probably less useful than get_joined_int_trans_params_by_trans_verb_id???

            // We use this to get the tree?
            //  All resize transformations, doc keys, trans params
            //  That should be all that gets returned here



            'get_document_resize_transformations_with_keys_parameters': function(callback) {
                var that = this;
                var inline = false;

                that.get_transformation_verb_id_by_name('resize', function(err, resize_verb_id) {
                    if (err) {
                        throw err;
                    } else {


                        that.get_joined_int_trans_params_by_trans_verb_id(resize_verb_id, function(err, res_transformations) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('res_transformations', res_transformations);

                                // Just return the transformations?
                                //  Need to return the documents, linked by transformations.




                                // This would be getting multiple resords for each transformation (or no records).
                                //  It only gets the integer parameters.
                                //  We need to assemble the transformations.
                                //  Perhaps we also need to get all resize transformations from the db.


                                // Need to go through the transformation parameter records.

                                // However, we want to have the actual transformations that are not determined by parameters.

                                that.get_document_resize_transformations(function(err, res_resize_transformations) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log('res_resize_transformations', res_resize_transformations);

                                        // need to mix in the parameters.
                                        // Need to get the parameter records.

                                        that.get_joined_int_trans_params_by_trans_verb_id(resize_verb_id, function(err, res_joined_trans_params) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                console.log('res_joined_trans_params', res_joined_trans_params);

                                                // We need to return the transformations, with their parameters.
                                                //  Need the map of transformations by id.


                                                var map_transformations = {};


                                                // Create a map of which of the documents are used as a source.

                                                var map_used_as_source = {}, map_used_as_target = {};
                                                // array of documents used as a source

                                                var arr_used_as_source = [], arr_used_as_target = [];

                                                // find the ones that are used as source, not as target.


                                                var map_document_keys = {};




                                                // This fn just returns the trnasformations with their parameters.



                                                each(res_resize_transformations, function(transformation) {
                                                    map_transformations[transformation.id] = transformation;

                                                    if (!map_used_as_source[transformation.source_document_id]) {
                                                        arr_used_as_source.push(transformation.source_document_id);
                                                    }
                                                    if (!map_used_as_target[transformation.target_document_id]) {
                                                        arr_used_as_target.push(transformation.target_document_id);
                                                    }

                                                    map_used_as_source[transformation.source_document_id] = true;
                                                    map_used_as_target[transformation.target_document_id] = true;

                                                    map_document_keys[transformation.source_document_id] = transformation.source_document_key;
                                                    map_document_keys[transformation.target_document_id] = transformation.target_document_key;

                                                });

                                                console.log('arr_used_as_source', arr_used_as_source);
                                                console.log('arr_used_as_target', arr_used_as_target);


                                                // Go through the parameter objects, adding them to the relevant transformations.

                                                // Either inline or not...

                                                if (inline) {
                                                    each(res_joined_trans_params, function(int_trans_param) {
                                                        console.log('int_trans_param', int_trans_param);
                                                        var t_id = int_trans_param.transformation_id;

                                                        map_transformations[t_id][int_trans_param.key] = int_trans_param.value;
                                                    })
                                                } else {
                                                    // need to create child params object.
                                                   // var params = {};
                                                    // need to bundle the params in a single object

                                                    // a map by the transformation id.
                                                    //

                                                    var map_params_for_transformations = {};
                                                    //  for every transformation, have the params.




                                                    each(res_joined_trans_params, function(int_trans_param) {
                                                        console.log('int_trans_param', int_trans_param);
                                                        var t_id = int_trans_param.transformation_id;

                                                        //map_params_for_transformations[t_id] = map_params_for_transformations[t_id] || [];
                                                        //map_params_for_transformations[t_id].push(int_trans_param);
                                                        //map_params_for_transformations[t_id].push(int_trans_param);


                                                        map_params_for_transformations[t_id] = map_params_for_transformations[t_id] || {};
                                                        map_params_for_transformations[t_id][int_trans_param.key] = int_trans_param.value;
                                                        //params[int_trans_param.key] = int_trans_param.value;
                                                    });

                                                    console.log('map_params_for_transformations', map_params_for_transformations);

                                                    // then we add those from the map to the results.

                                                    each(res_resize_transformations, function(trans) {
                                                        var id = trans.id;
                                                        if (map_params_for_transformations[id]) {
                                                            trans.params = map_params_for_transformations[id]
                                                        }
                                                    })


                                                    //throw 'stop';

                                                    // then we go through the results, adding the param objects.


                                                    //map_transformations[t_id].params = params;




                                                    //throw 'nyi';
                                                }

                                                //console.log('res_joined_trans_params', res_joined_trans_params);

                                                // Need to apply the parameters to the transformations.





                                                // Don't need o get more info from the documents, we have that info.
                                                //  Need to identify the root document ids.

                                                // Root documents are documents that don't have a source, as used in a transformation.

                                                // Want all that are used as a source, but not as a target, these are the root documents.

                                                /*
                                                var arr_root_doc_ids = [];

                                                each(arr_used_as_source, function(doc_id) {
                                                    if (!map_used_as_target[doc_id]) {
                                                        arr_root_doc_ids.push(doc_id);
                                                    }
                                                });

                                                // Just needs to get the transformations with the parameters.




                                                console.log('arr_root_doc_ids', arr_root_doc_ids);
                                                */
                                                // Don't need the root doc ids here.




                                                // For each of the root nodes, we get the transformations as well.

                                                // Need each transformation that uses the source, this will be a tree of transformations.
                                                //  Could only work when a transformation has a single source.
                                                //   Maybe should plan on sticking to that rule for transformations, maybe compositions could use more.

                                                // need to go through the root nodes, including the key and value info
                                                //var res = [];

                                                //each(arr_root_doc_ids, function(root_id) {
                                                //    var obj_

                                                //});






                                                console.log('res_resize_transformations', res_resize_transformations);

                                                // We have the transformations, and the transformation params.

                                                //throw 'stop';











                                                /*


                                                // Make a map of the resize transformations by their source (a mapped array).

                                                var ma_param_sources = {};

                                                each(res_resize_transformations, function(transformation) {
                                                    var id_source = transformation.source_document_id;
                                                    if (!ma_param_sources[id_source]) ma_param_sources[id_source] = [];
                                                    ma_param_sources[id_source].push(transformation);

                                                });

                                                console.log('ma_param_sources', ma_param_sources);
                                                */

                                                // Then we need to look at / process the list of all images.
                                                //  Actually not with this... this is just to get the transformations.

                                                //throw 'stop';

                                                callback(null, res_resize_transformations);
                                            }
                                        })

                                    }
                                })

                                // then for every transformation, we need to get the metadata.
                                //  could maybe make postgres functions to get the parameter items for all resize transformations, would be
                                //  quicker putting it back together here (by a long way)

                                // Get all the integer transformation records by transformation verb
                                //  May need different typed of joins.

                                // get_joined_integer_transformation_params_by_transformation_verb_id
                                // get_joined_int_trans_params_by_trans_verb_id

                                // get_joined_int_trans_params_by_trans_verb_id - exists now
                                //  Will get all of the relevant joined records.







                                // doc_trans_int_params JOIN doc_trans_params JOIN doc_trans
                                //  returning JSON, of course.

                                // should not be so hard, through joins, to connect parameters to the document transformations, and therefore
                                //  be able to search by the transformation verb as well.











                            }
                        })

                    }
                });

            },

            'get_document_transformation_parameter_types': function(callback) {
                var db = this.get('database');
                db.execute_function('get_document_transformation_parameter_types', [], function(err, res) {
                    if (err) {
                        callback(err)
                    } else {
                        console.log('res', res);
                        //throw 'stop';
                        callback(null, res[0]);
                    }
                });
            },

            'get_map_transformation_parameter_types': function(callback) {
                // call the db function that gets the parameter types.
                //  however, we want to then make a map out of them.

                // get_document_transformation_parameter_types

                this.get_document_transformation_parameter_types(function(err, res_parameter_types) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('res_parameter_types', res_parameter_types);

                        var res = {};

                        each(res_parameter_types, function(record) {
                            res[record.name] = record.id;
                        })

                        //throw 'stop';

                        callback(null, res);

                    }
                });



            },

            'create_document_transformation_parameter_full': function(transformation_id, key, value, callback) {

                var that = this;

                that.get_map_transformation_parameter_types(function(err, map_transformation_parameter_types) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('map_transformation_parameter_types', map_transformation_parameter_types);

                        var t_value = tof(value);

                        var data_type;



                        if (t_value == 'number') data_type = 'integer';

                        var type_id = map_transformation_parameter_types[data_type];


                        // create the param obj itself, then create the value record.

                        that._create_document_transformation_parameter(transformation_id, key, type_id, function(err, transformation_parameter_id) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('transformation_parameter_id', transformation_parameter_id);

                                // then we create the specific record.

                                if (data_type == 'integer') {
                                    // create the integer value record.

                                    that.create_document_transformation_integer_parameter(transformation_parameter_id, value, function(err, int_param_id) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            console.log('int_param_id', int_param_id);

                                            callback(null, [transformation_parameter_id, int_param_id]);
                                        }
                                    })








                                } else {
                                    throw 'unsupported data type ' + data_type;
                                }
                            }
                        });





                    }
                });


            },


            'ensure_document_transformation_parameters': function(transformation_id, params, callback) {
                // Needs to go through each of the parameters, assembling the right instruction in fns to carry out.

                // Seems like a 'plan' pattern.
                var that = this;



                var fns = jsgui.Fns();

                // I think it's best to get the params back from the database.

                that.get_document_transformation_parameters(transformation_id, function(err, existing_params) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('existing_params', existing_params);

                        //throw 'stop';

                        // need to see which are the same, which have changed, which are new, which have been removed

                        // Perhaps some structure / pattern for this 4-part plan would make sense.
                        //  Maybe doing 4 part db update plans makes a lot of sense.

                        // What is the same
                        // What has changed
                        // What is new
                        // What has been removed

                        // This algorithm is a bit of a chore, but it seems to be useful in database updates.
                        //  May be a way to encapsulate it in some ways.
                        //  Quickly making the maps, doing the iterations, doing comparisons.

                        // The algorithm is really for the planning stage, it's making an update plan.

                        // could look at the map itself to see what's changed.



                        //fns.push([that, that.set_document_metadata, [document_id, i, v]]);

                        // go through the new params, making the create param instruction.
                        //  once we have any params we should change the code to deal with the param result properly.

                        // for every arr_new_params, we see what it's value and value type is, then we create the function call.

                        // Lets first get all parameter types as a map.

                        that.get_map_transformation_parameter_types(function(err, map_transformation_parameter_types) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('map_transformation_parameter_types', map_transformation_parameter_types);



                                var map_existing = {}, map_specified = {};

                                each(existing_params, function(v, i) {
                                    map_existing[i] = true;
                                });

                                each(params, function(v, i) {
                                    map_specified[i] = true;
                                });

                                console.log('map_existing', map_existing);
                                console.log('map_specified', map_specified);

                                // then identify the new params.

                                var arr_new_params = [];
                                var arr_deleted_params = [];
                                var arr_kept_params = [];
                                // kept may be same or changed

                                // maps of new, deleted and kept params.
                                //  they will be useful below.

                                var map_new_params = {};
                                var map_deleted_params = {};
                                var map_kept_params = {};



                                each(existing_params, function(v, i) {
                                    //map_existing[i] = true;
                                    if (map_specified[i]) {
                                        arr_kept_params.push(i);
                                        map_kept_params[i] = true;
                                    } else {
                                        arr_deleted_params.push(i);
                                        map_deleted_params[i] = true;
                                    }

                                });

                                each(params, function(v, i) {
                                    if (map_existing[i]) {
                                        //arr_kept_params.push(i);
                                    } else {
                                        arr_new_params.push(i);
                                        map_new_params[i] = true;
                                    };
                                });

                                console.log('arr_new_params', arr_new_params);
                                console.log('arr_deleted_params', arr_deleted_params);
                                console.log('arr_kept_params', arr_kept_params);

                                // will need to compare the values of the kept params.

                                // need to set up the sequence of tasks.

                                // will need to add transformation parameters as necessary.

                                var fns = jsgui.Fns();

                                // now we have the param types array.
                                //  however, maybe we don't need that here.
                                //  can go through, and individually add the parameters.

                                //then each key in the parameters.

                                each(params, function(value, key) {

                                    var t_value = tof(value);
                                    var data_type;

                                    if (t_value == 'number') data_type = 'integer';

                                    if (map_new_params[key]) {
                                        fns.push([that, that.create_document_transformation_parameter_full, [transformation_id, key, value]])

                                    }




                                    // then look it up...



                                    //var type_id = map_transformation_parameter_types[data_type];
                                    //console.log('type_id', type_id);

                                    // create_document_transformation_parameter_full
                                    //  That would make the parameter record as well as its value record.



                                    // could assign the result here?
                                    //  easiest to use a create_doc_trans_param_full fn
                                    //fns.push([that, that._create_document_transformation_parameter, [transformation_id, key, type_id]]);
                                    //  and will need to know the result.. create_document_transformation_parameter_full



                                    // Perhaps an ensure parameter function will be easier.
                                    //  or create parameter.



                                })

                                //throw 'stop';

                                fns.go(function(err, res_all) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        console.log('res_all', res_all);

                                        callback(null, res_all);
                                    }
                                })


                                //



                                //throw 'stop';
                            }
                        });

                        /*


                        each(arr_new_params, function(new_param) {
                            var v = params[new_param];
                            var tv = tof(v);

                            //if (tv == 'number') {
                                // use the create integer (for the moment) param field.

                                // create the integer parameter.
                                //  needs both the parameter record as well as the integer record.

                                //fns.push([that, that.create_, [document_id, i, v]]);

                            //}

                            fns.push([that, that._create_document_transformation_parameter), [transformation_id, ]])
                        });
                        */


















                        // make a map of the params in the existing ones
                        // map of params in provided params obj
                        // iterate existing params, see which are there and
                        //  not in provided param map    (deleted)
                        //  in provided param map        (kept - the same or updated)
                        // iterate through provided params
                        //  not in existing params       (new param)
                        //  (in existing)                (kept - the same or updated)

                        // Then with the kept params, we compare the old and the new values.
                        //  Make list of changed params, make list of unchanged params.











                    }
                })

                // Need to make a list of params to update, delete, or create.




                /*
                each(params, function(v, key) {
                    console.log('key', key);

                    var tv = tof(v);
                    console.log('tv', tv);
                    console.log('v', v);

                    if (tv == 'number') {
                        // treat it as an integer for the moment.
                        //  could be more explicit in specifying integers in some cases.

                        // push ensure a parameter with that name.



                        // ensure the parameter itself.
                        // ensure_document_transformation_integer_parameter
                        that.ensure_document_transformation_integer_parameter(transformation_id, key, v, function(err, res_ensure_trensformation_integer_parameter) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('res_ensure_trensformation_integer_parameter', res_ensure_trensformation_integer_parameter);
                            }
                        })


                    }

                })
                */

            },





            // Maybe make it work with source and tarket keys as well, using fp?
            'ensure_transformation': function(transformation_verb, params, source_id, target_id, callback) {

                var that = this;

                this.get_transformation_verb_id_by_name('resize', function(err, resize_verb_id) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('resize_verb_id', resize_verb_id);

                        // May need to check to see if there already is a transformation.
                        //  If it exists, I think we should delete it if it does not match.
                        //   Or if it's there, we could update it.

                        // So we try to get the transformation by source and target ids.




                        // Do ensure transformation instead.
                        //  It handles the case of the transformation already existing.
                        //  Though, this function is ensure transformation.
                        // Would be good to get the transformation by source and target.

                        //get_document_transformation_by_source_id_target_id
                        //  could check to see if it's a different type this way.

                        // want to get the transformation by the source id and target id.







                        //that.get_document_transformation_

                        // How about getting the document transformation itself?
                        // Would be a JSON function.

                        // get_document_transformation_by_source_id_target_id
                        //  that will get the transformation record itself (if it exists)


                        that.get_document_transformation_by_source_id_target_id(source_id, target_id, function(err, existing_transformation) {
                            if (err) {
                                throw err;
                            } else {
                                var t_existing = tof(existing_transformation);

                                console.log('existing_transformation_id', existing_transformation);
                                console.log('t_existing', t_existing);

                                // if the transformation already exists between those items, we can update it's value if necessary

                                if (t_existing == 'object') {
                                    // check to see if the verb needs to be changed.

                                    if (existing_transformation.transformation_verb_id == resize_verb_id) {

                                        // Need to ensure the parameters are correct.
                                        //  Maybe that is best done in one function...
                                        //   It gets the parameter values back, does the comparisons, and then decides which parameters need to be updated,
                                        //   deleted, or created.

                                        that.ensure_document_transformation_parameters(existing_transformation.id, params, function(err, res_ensure_parameters) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                console.log('res_ensure_parameters', res_ensure_parameters);


                                            }
                                        })






                                    } else {
                                        // we need to change the verb

                                        // probably delete all of the parameters.
                                        throw 'stop';

                                    }


                                } else {

                                    that._create_document_transformation(source_id, target_id, resize_verb_id, function(err, transformation_id) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            //

                                            console.log('created document transformation transformation_id', transformation_id);

                                            // And then we set the transformation parameters.
                                            //  This will be a bit like the metadata records.
                                            //  Should also include a record type with each parameter record.
                                            //  And need a parameter record type id as well

                                            // Makes use of parameter types in the db as well

                                            // then set the parameters using one function.

                                            that.ensure_document_transformation_parameters(transformation_id, params, function(err, res_ensure_params) {
                                                if (err) {
                                                    throw err;
                                                } else {
                                                    console.log('res_ensure_params', res_ensure_params);

                                                }
                                            })






                                            //throw 'stop';
                                        }
                                    })
                                }





                                //throw 'stop';




                            }

                        })







                        // Then we use that verb id to create the transformation record



                        // We then go through the params and create the transformation param records.





                    }
                })

                // Frist need to get the verb ID




                // Multiple stages here.
                //  Needs to ensure the transformation record that connects the two of them.
                //  Only one transformation can connect the two
                //   (Could make make a transformation chain some day)
                //   Source and target are unique constraints in the transformation definition.

                // I think we will do the create?
                //  May make more advanced 'Ensure' postgres functions.


                // First create the transformation record itself

                // will call create_documentation_transformation_parameter










            },

            // We should probably be calling _set_document_no_metadata, and then updating the metadata.



            // Will give the document, with all its metadata, they will be set in the database.
            //  The module that calls this, Image in the case of images, will



            // _set_document_no_metadata
            //  the new set_document function will set the document with _set_document_no_metadata and then ensure the metadata is correct.

            // Could this be made simpler, more basic?

            'set_document': fp(function(a, sig) {


                console.log('web db postgres set_document sig', sig);

                // [s,?,s,f]
                // [s,?,s,o,f]

                // Want to be able to have question mark in the signatures.
                //  Could possibly do sig.matches.
                //  With the sig being given another function, .matches, that checks for a match.
                //   Would mean it would not be a simple string, could be quite a deoptimization.
                //    I'm not sure.

                // could maybe do a sig_match function.

                // That would be a reasonable way of doing this polymorphic checking, and useful in cases where a 'value' or other parameter can be
                //  of any type.
                var key, value, type_name, metadata, callback;

                // sBsf?


                if (sig_match(sig, '[s,?,s,f]')) {
                    key = a[0]; value = a[1]; type_name = a[2]; callback = a[3];
                }

                if (sig_match(sig, '[s,?,s,o,f]')) {
                    key = a[0]; value = a[1]; type_name = a[2]; metadata = a[3]; callback = a[4];
                }







                // We don't discover the metadata here.
                //  We may have been given the metadata when we are setting the document.
                //  Possibly give the set_document or set_image, or set_image_document commend to Site_Images or Website.
                //  Want to keep the DB layer simple to allow for more interchangability.
                //  The graphics and file processing will be outside of this module.







                var that = this;

                this._set_document_no_metadata(key, value, type_name, function(err, document_id) {
                    if (err) {
                        callback(err)
                    } else {

                        console.log('cb _set_document_no_metadata');

                        console.log('type_name', type_name);

                        //throw 'stop';

                        // Need to find out what metadata to use.
                        //  would depend on the type_name first.

                        // Probably don't want to be getting the image metadata here.
                        //  Probably best not to decode the image either.

                        // May be best just to provide the web-db interface, and then another component will do the actual adding / saving of the image.
                        //  Can call the seit image resource, that will get the web db resource (from the pool?), and then it will
                        //  make the lower level calls to the web db system.

                        // Possibly a set_document or set_image document in the image resource.
                        //
                        //
                        console.log('metadata', metadata);
                        //throw 'stop 1';

                        if (metadata) {
                            that.set_document_metadata(document_id, metadata, function(err, res_set_document_metadata) {
                                if (err) {
                                    callback(err);
                                } else {
                                    console.log('res_set_document_metadata', res_set_document_metadata);
                                    //throw 'stop 2';
                                    callback(null, document_id);
                                }
                            })
                        } else {
                            // Perhaps we ensure the document has no metadata.
                            //  Maybe an empty metadata object will indicate that.

                            //  Also, will need to remove unwanted metadata items.
                            //throw 'stop 3';
                            callback(null, document_id);
                        }






                        /*

                        if (type_name == 'jpeg') {


                            // put the value, the jpeg image, into a fund metadata function.
                            //  jsgui-node-jpeg-metadata

                            // could just include the file size for the moment?

                            // use jpeg decode instead.
                            //  it may not be in the exif.





                            //var ExifImage = require('exif').ExifImage;

                            // Would really be best to use libjpeg (turbo) code.



                            //var exi = new ExifImage({'image': value}, function(err, exifData) {
                            //    if (err) {
                            //        throw err;
                            //    } else {
                            //        console.log('exifData ' , exifData);
                            //        console.log('exifData.image ' , exifData.image);
                            //    }
                            //})


                            var decoded = jpeg_js.decode(value);

                            var width = decoded.width;
                            var height = decoded.height;

                            console.log('decoded', decoded);

                            that.set_document_metadata(document_id, {
                                'width': width,
                                'height': height
                            }, function(err, res_set_document_metadata) {
                                if (err) {
                                    callback(err);
                                } else {
                                    console.log('res_set_document_metadata', res_set_document_metadata);
                                }
                            })

                            // then we have two metadata items.


                        }
                         */




                    }
                })
            }),


            '_set_document_no_metadata': function(key, value, type_name, callback) {
                // text/plain

                // the type of the document as a string.
                //  will have that kind of type determine the mime type.
                //  will be easier that way, less typing too.

                // need to ensure there is that document type, get the dt id.
                console.log('key', key);
                console.log('value', value);


                // This may automatically obtain the metadata...?

                //  Or better to make another function that does that too.
                //   Probably best to keep it simpler that way.
                //   Create the document object in the db, then make the metadata.
                //   However, want the set_document function to ensure the metadata is correctly there too.
                //   It will be very useful for images etc having the metadata as fields in the database.





                var that = this;


                // Except maybe the image part won't even tell the DB it's an image.
                //  It would just give it a binary type.



                console.log('type_name', type_name);

                // I think the image system should just use a binary API on the DB.
                //  That keeps the DB's requirements simpler, and this DB module is something which may get repeated for different DBMSs.




                //throw 'stop';

                that.get_document_type_id_by_name(type_name, function(err, document_type_id) {
                    if (err) {
                        callback(err);
                    } else {
                        var t_document_type_id = tof(document_type_id);
                        console.log('document_type_id', document_type_id);




                        if (t_document_type_id == 'number') {
                            // proceed...
                            //that.document_type_id
                            // look for the existing document.

                            that.get_document_id_by_key(key, function(err, document_id) {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log('1) document_id', document_id);
                                    var t_document_id = tof(document_id);

                                    if (t_document_id == 'number') {
                                        // Document already exists.
                                        //  would need to make sure it is of the right type.

                                        // though, update document seems fine.
                                        //  May need to make a new typed object record.

                                        // perhaps need to get the current document type id...
                                        //  and compare it with the one we have.

                                        that.get_document_document_type_id_by_id(document_id, function(err, existing_document_type_id) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                console.log('existing_document_type_id', existing_document_type_id);

                                                // and compare them...

                                                if (existing_document_type_id == document_type_id) {
                                                    // a simpler update.

                                                    //that.update_string_document_value()

                                                    // get the string document value by document id

                                                    // then depending on the document_type_id...
                                                    //  need to use different function for JSON.

                                                    if (type_name == 'string' || type_name == 'html') {
                                                        that.get_string_document_value_id_by_document_id(document_id, function(err, string_document_value_id) {
                                                            if (err) {
                                                                throw err;
                                                            } else {
                                                                console.log('string_document_value_id', string_document_value_id);

                                                                var t_string_document_value_id = tof(string_document_value_id);

                                                                if (t_string_document_value_id == 'number') {
                                                                    // update existing

                                                                } else {


                                                                    that._create_string_document_value(document_id, value, function(err, res_create_string_document_value) {
                                                                        if (err) {
                                                                            throw err;
                                                                        } else {
                                                                            console.log('res_create_string_document_value', res_create_string_document_value);

                                                                            callback(null, document_id);
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        })
                                                    }

                                                    if (type_name == 'json') {
                                                        that.get_json_document_value_id_by_document_id(document_id, function(err, json_document_value_id) {
                                                            if (err) {
                                                                throw err;
                                                            } else {
                                                                console.log('json_document_value_id', json_document_value_id);

                                                                var t_json_document_value_id = tof(json_document_value_id);

                                                                if (t_json_document_value_id == 'number') {
                                                                    // update existing



                                                                } else {

                                                                    that._create_json_document_value(document_id, value, function(err, res_create_json_document_value) {
                                                                        if (err) {
                                                                            throw err;
                                                                        } else {
                                                                            console.log('res_create_json_document_value', res_create_json_document_value);

                                                                            callback(null, document_id);
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        })
                                                    }

                                                    // There will be fewer document types in terms of the lower level db implementation.
                                                    //  Could even be integer document types... though it's not much of a document.
                                                    //   Maybe have some dynamic table / value system so that a variety of indexed data could be stored.

                                                    // _create_binary_document_value


                                                    // And binary document types.

                                                    if (type_name == 'jpeg') {
                                                        that.get_binary_document_value_id_by_document_id(document_id, function(err, binary_document_value_id) {
                                                            if (err) {
                                                                throw err;
                                                            } else {
                                                                console.log('binary_document_value_id', binary_document_value_id);

                                                                var t_binary_document_value_id = tof(binary_document_value_id);

                                                                if (t_binary_document_value_id == 'number') {
                                                                    // update existing

                                                                    that._update_binary_document_value(binary_document_value_id, document_id, value, function(err, res_update_binary_document_value) {
                                                                        if (err) {
                                                                            throw err;
                                                                        } else {
                                                                            callback(null, document_id);
                                                                        }
                                                                    })

                                                                } else {

                                                                    // Will also need to deal with the metadata.

                                                                    that._create_binary_document_value(document_id, value, function(err, res_create_binary_document_value) {
                                                                        if (err) {
                                                                            throw err;
                                                                        } else {
                                                                            console.log('res_create_binary_document_value', res_create_binary_document_value);

                                                                            // Also want to create the metadata records.

                                                                            // Will have this metadata fairly normalised within the Postgres system.
                                                                            //  eg integer metadata records
                                                                            //     string metadata records.

                                                                            // Document metadata records...
                                                                            //  basically a key-value store for the document metadata.
                                                                            //   so each documents has its own simple KVS to keep track of metadata











                                                                            callback(null, document_id);
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        })
                                                    }
                                                    



                                                }

                                                //throw 'stop';



                                            }
                                        })

                                    } else {
                                        that._create_document(key, document_type_id, function(err, document_id) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                console.log('created document, document_id', document_id);

                                                console.log('type_name', type_name);

                                                // then we need to create the document value object.

                                                // Could set it to have the string document value type.
                                                // Create the string document value.

                                                // and will need to create the right value record depending on the type.


                                                if (type_name == 'string' || type_name == 'html') {
                                                    // create a string document.

                                                    // we create the document, and associted string_document_value.
                                                    //  In the future we will be able to make metadata with particular values.
                                                    //   Perhaps could define metadata value types, and have it indexed quickly.

                                                    // it won't exist already.

                                                    that._create_string_document_value(document_id, value, function() {
                                                        if (err) {
                                                            callback(err);
                                                        } else {
                                                            callback(null, document_id);
                                                        }
                                                    })
                                                }

                                                if (type_name == 'json') {
                                                    that._create_json_document_value(document_id, value, function() {
                                                        if (err) {
                                                            callback(err);
                                                        } else {
                                                            callback(null, document_id);
                                                        }
                                                    })

                                                }

                                                // Need to create the binary document...

                                                if (type_name == 'jpeg') {
                                                    that._create_binary_document_value(document_id, value, function() {
                                                        if (err) {
                                                            callback(err);
                                                        } else {
                                                            callback(null, document_id);
                                                        }
                                                    })

                                                }



                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            },

            'get_document_full': function(key, callback) {
                // get the document id.

                var that = this;

                console.log('get_document_full key', key);

                that.get_document_id_by_key(key, function(err, document_id) {
                    if (err) {
                        callback(err);
                    } else {
                        // get the document type.
                        console.log('document_id', document_id);

                        that.get_document_document_type_name_by_id(document_id, function(err, document_type_name) {
                            if (err) {
                                callback(err);
                            } else {
                                // get the document value

                                console.log('document_type_name', document_type_name);

                                that.get_document(key, function(err, document_value) {
                                    if (err) {
                                        callback(err);
                                    } else {

                                        //throw 'stop';

                                        // Also want to get the mime type.
                                        //  Could perhaps have a function that gets a type, rather than just the type id.
                                        //  Not sure exactly how it would return the data.

                                        that.get_document_metadata(document_id, function(err, document_metadata) {
                                            if (err) {
                                                callback(err);
                                            } else {
                                                var res = {
                                                    'key': key,
                                                    'value': document_value,
                                                    'type': document_type_name,
                                                    'metadata': document_metadata
                                                };

                                                callback(null, res);
                                            }
                                        })
                                    }
                                });
                            }
                        });
                    }
                });
            },

            'get_document': function(key, callback) {
                // Get the document id.
                // Get the document type
                // Get the typed document value id
                //  Get the document type name (instead)

                // Get the value of the typed document

                var that = this;

                that.get_document_id_by_key(key, function(err, document_id) {
                    if (err) {
                        callback(err);
                    } else {
                        var t_document_id = tof(document_id);
                        if (t_document_id == 'number') {

                            // get_document_document_type_name_by_id - would require a join I think.
                            that.get_document_document_type_name_by_id(document_id, function(err, document_type_name) {
                                if (err) {
                                    callback(err);
                                } else {
                                    console.log('document_type_name', document_type_name);

                                    if (document_type_name == 'string') {
                                        // Get the string document value value by the document id
                                        that.get_string_document_value_value_by_document_id(document_id, callback);

                                    }
                                    if (document_type_name == 'html') {
                                        // Get the string document value value by the document id
                                        that.get_string_document_value_value_by_document_id(document_id, callback);

                                    }
                                    if (document_type_name == 'json') {
                                        that.get_json_document_value_value_by_document_id(document_id, callback);
                                    }

                                    if (document_type_name == 'jpeg') {
                                        // But maybe the metadata too???
                                        that.get_binary_document_value_value_by_document_id(document_id, callback);
                                    }

                                }
                            })
                        } else {
                            callback(null, undefined);
                        }
                    }
                })
            },

            'get_documents_by_type_name': function(type_name, callback) {
                var db = this.get('database');
                db.execute_function_single_row('get_documents_by_type_name', [type_name], callback);
            },

            /*

            'get_json_documents_by_tag': function(tag, callback) {
                // Will allow documents to be given tags, such as 'flexidoc'.
                //  Or could allow subtypes as well?

                // Make flexidoc a proper type, or subtype.
                // define flexidoc as a subtype in the database.
                //  could give it a parent type of json so it knows to treat it as a JSON object.




            },
            */

            'get_all_flexidocs': function(callback) {
                var db = this.get('database');
                // could be multiple rows? or it's all as JSON?

                //db.execute_function_single_row('get_all_flexidocs', callback);

                this.get_documents_by_type_name('flexidoc', callback);
            },

            // Could have various things with this system...
            //  Want the structure of pages to join with each other.

            // Want some overall view for the site.
            //  I think seeing a lot of pages zoomed out may be good.
            //  Arrows linking them.

            // A tree view makes sense for navigation.
            //  Could view that tree on each page as well.

            // Need to be able to create relatively simple objects (like JSON) containing data.
            //  Then that data gets rendered using a template system.
            //   I think a bit of AI to create templates based on data would be good.

            // Anyway, could have quite a bit of documentation using JSON format, possibly markdown.
            //  Could have markdown sections.
            //  Would need to encode new line character within JSON.

            // Would also like wisywig capabilities - though probably won't want much in terms of changing sizes, fonts etc.
            //  Want to be able to insert images.
            //  Ability to upload, store and use images.

            // An image uploader part of the system seems worthwhile and possible now.
            //  Would save the image to the database as a blob (bytea in postgres).
            // Being able to store images (and files) in user space makes sense.

            // Want to provide the browser with authenticated access to user space.
            //  Will then have enough to upload to that space and interact with it.
            //  The web db resource (postgres) will handle much of the interface.

            // Would be useful to have a website resource.
            //  That website resource would have its own routing tree.??

            // Website gets given / set a bunch of things.
            //  It can keep it all in the DB.
            //  It would then serve it all.

            // One of the main things to get right is a file system with image processing.
            //  Still, images would be in a list.
            //  They would have paths and file names.

            // I think setting up the userspace API is important.
            //  However, the website could have site images.
            //  These could be held within this KVS.

            // Want to create the right API for client-side access to the storage.
            //  Need to get the authentication to work automatically there.


            // Want some higher level functionality here too.
            //  Get all website images.
            //  Documents of the image type
            //   All metadata associated with them?


            // Could maybe put the metadata inline...

            'get_images_with_metadata': function(callback) {

                var inline = true;

                // get the images, then for each of them, get the metadata using fns.
                var that = this;


                that.get_images(function(err, res_images) {
                    if (err) {
                        throw err;
                    } else {


                        // get the meatdata for each image...


                        //var res = [];
                        var fns = Fns();

                        each(res_images, function(image) {
                            // and a function that adds it to the res here.
                            fns.push([that, that.get_document_metadata, [image.id], function(err, res_metadata) {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log('res_metadata', res_metadata);

                                    if (inline) {
                                        extend(image, res_metadata);
                                    } else {
                                        image.metadata = res_metadata;
                                    }



                                }
                            }]);

                        });

                        fns.go(function(err, res_all) {
                            if (err) {
                                throw err;
                            } else {
                                console.log('res_all', res_all);

                                console.log('res_images', res_images);
                                callback(null, res_images);
                            }
                        })






                    }
                });






            },

            'get_images_tree': function(callback) {
                // Want to get the original / non resized ones.

                // The source image in the resize transformations.

                // Use a Document Transformation system in the database.
                //  Transformations are like verbs.


                // Document Transformation Types?
                //  1. Image Resize
                //   Image | Resize
                //   Object | Verb
                //   Verb | Object

                // Transformations will have a transformation verb, eg resize
                //  They will also have an object, such as 'image'
                //   Possibly 'gif', 'jpeg'?
                //   Nice to have it understand both, but generally deal with images as a class to be resized, so could resize a JPEG into a
                //    compressed PNG.

                // Transformation_Verb
                //  No need for object such as image... we know the object types already

                // Transformation
                //  Object id
                //  Result id
                //  Transformation_Verb

                // Need to be able to get a transformation verb easily, eg get the 'resize' verb

                // Need to store the images as 'B is resized A'

                console.log('get_images_tree');

                // Need to get all root / source level images
                //  Then get the data about any transformations that reference them
                //  Then get the data about any that are referred to in those transformations.
                // It seems like that could all be done in a single linked SQL query.

                // Could get into some complex DB queries without needing to though.

                // get transformations referring to original image (using it as a source)


                // look at all resize transformations
                //  perhaps just image rezise transformations when the time comes

                // join those transformations with data about the source document (eg key)
                //  join them with key data on the target

                // Use code like this to get all the transformation data for the first pass.
                //  Could make it get by a specified transformation type.

                // get the resize transformation type id.


                var that = this;

                // It would be easier to divide this up into different functions.





                that.get_transformation_verb_id_by_name('resize', function(err, resize_verb_id) {
                    if (err) {
                        throw err;
                    } else {
                        console.log('resize_verb_id', resize_verb_id);

                        // get_document_transformation_info_by_verb_id
                        //  would also get the parameters for any transformation.

                        // could get the keys info, then get the parameter objects.



                        // Really want to get all image document metadata
                        //  then cross reference that with the transformations data.

                        // get_documents_by_type (image)

                        that.get_images_with_metadata(function(err, res_images) {
                            if (err) {
                                throw err;
                            } else {

                                // get_document_transformations_by_verb_id
                                // get_document_resize_transformations

                                // Having all of the resize transformations will be useful.
                                //  The transformations will include the source and target ids, so we still have that info and more
                                //  Will also want to include the transformation parameters with the transformations.




                                // get_document_transformation_source_target_keys_by_verb_id
                                // get_document_resize_transformations_with_keys_parameters




                                that.get_document_resize_transformations_with_keys_parameters(function(err, res_transformations_info) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        // Probably needs more processing between the db and here.
                                        //

                                        console.log('res_transformations_info', res_transformations_info);

                                        // We need to find out which are at the root.

                                        // we meed to map from the targets to the sources?
                                        //                         sources to the targets?

                                        // map from source to target in transformations?
                                        //  array of the transformations that use any doc as a source.

                                        var map_arr_transformations_with_source = {};
                                        var map_transformations = {};
                                        //  this will be used in constructing the result tree.







                                        var map_used_as_source = {}, map_used_as_target = {};

                                        each(res_transformations_info, function(trans) {
                                            map_transformations[trans.id] = trans;
                                            var s_id = trans.source_document_id;
                                            var t_id = trans.target_document_id;

                                            if (!map_arr_transformations_with_source[s_id]) {
                                                map_arr_transformations_with_source[s_id] = [];
                                            }
                                            map_arr_transformations_with_source[s_id].push(trans.id);

                                            map_used_as_source[s_id] = true;
                                            map_used_as_target[t_id] = true;
                                        });

                                        // find all which were used as a source, but not as a target.
                                        var root_ids = [];

                                        each(map_used_as_source, function(v, i) {
                                            console.log('i', i);
                                            if(!map_used_as_target[i]) {
                                                root_ids.push(i);
                                            }
                                        })








                                        // would be nice to get the images with the metadata as well.

                                        var map_images = {};

                                        each(res_images, function(image) {
                                            map_images[image.id] = image;
                                        });



                                        console.log('res_images', res_images);

                                        console.log('root_ids', root_ids);



                                        // then we use the root ids to put together the table of results.

                                        var res = [];

                                        each(root_ids, function(root_id) {
                                            // include the image, then the transformations that lead to other images
                                            //  call the next ones down 'children'


                                            var image = map_images[root_id];
                                            res.push(image);

                                            // then any children...
                                            //  create the child array.
                                            //   [trans, target]

                                            var children = [];
                                            // every transformation that uses the source.

                                            var used_as_source = map_arr_transformations_with_source[root_id];
                                            console.log('used_as_source', used_as_source);

                                            // then we look at each of the transformations that use that one as the source.

                                            // Likely to want to recursively do this too.

                                            each(used_as_source, function(trans_id) {
                                                //var child = []
                                                var trans = map_transformations[trans_id];

                                                // And we also need the target item.

                                                var target = map_images[trans.target_document_id];
                                                console.log('target', target);
                                                //throw 'stop';

                                                console.log('trans', trans);

                                                // maybe would be good if the params were not inline.

                                                //throw 'stop';

                                                // have some info about the transformation.
                                                //  do want to have the trans params as a separate object.

                                                var child = {
                                                    //'transformation': trans,
                                                    'params': trans.params,
                                                    'target': target
                                                }
                                                children.push(child);
                                            })

                                            if (children.length > 0) {
                                                image.trans = children;


                                            }

                                        });

                                        console.log('res', res);

                                        // Could have more work on the images tree result?
                                        //  Maybe there is just a problem with printing the results at the moment.





                                        callback(null, res);
                                        // The result can't be printed right because it contains a circular reference.
                                        //  The result does link to the children, will try using it in the UI now.

                                        //
                                        // Then go through the transformations, make a truth map of the documents which were used as targets
                                        //  (we are looking for NOT target documents, rather than source documents, because some may not have been used as a source)
                                        //  make a mapped array of the sources of transformations... so when we find a source, we add to its list of transformations
                                        // Go through the images document.
                                        //  (make a map of the images by id)
                                        //  Identify the images which are not used as targets in transformations
                                        //   They are the source images
                                        //    (make an array of their IDs / them)
                                        //   Make array of source images
                                        //    For each source image, consult the array of transformations that use them as a source
                                        //     Add the transformation info to the source result record

                                        //throw 'stop';

                                        // go through the transformation results building both source and destination link maps.
                                        // go through the images, finding any images that don't have a source link
                                        //  they are source images

                                        // go through the source (level 0 in tree images), creating the root items in the tree.
                                        //  for each of them, add children
                                        //   repeat for all children at progressing levels in tree until done
                                        // or depth-dirst adding of children, could complete the tree from the information we have.

                                        /*

                                        var res_tree = {};

                                        //var map_source_to_target_ids = {};
                                        // can't map source to target, because a transformed image will have just one source.

                                        // a source image can have multiple targetsw.

                                        var map_target_to_source_ids = {};

                                        each(res_info, function(transformation) {
                                            //map_source_to_tagert_ids[transformation]
                                            var source_id = transformation.source_document_id;
                                            var target_id = transformation.target_document_id;

                                            //map_source_to_target_ids[source_id] = target_id;
                                            map_target_to_source_ids[target_id] = source_id;
                                        });

                                        console.log('map_source_to_target_ids', map_source_to_target_ids);

                                        // though document could be used as a source more than once.
                                        //  maybe need an array here.

                                        // Want to see any that don't have a source.
                                        //

                                        console.log('map_target_to_source_ids', map_target_to_source_ids);
                                        */


                                        //var arr_root_

                                        // go through the original images
                                        //  mark the source documents - documents that have no source.

                                        /*

                                        each(res_images, function(image) {
                                            var source_id = image.source_document_id;
                                            // see where it's not used as a target.


                                            if (typeof map_target_to_source_ids[source_id])
                                        });
                                        */






                                        // Need to find the source documents
                                        //  documents which have no source transformation of their own

                                        // Create a map out of the records, so we know which links to which other.
                                        // map_docs_by_source_id
                                        // map_docs_by_target_id

                                        // and any documents without any transformations at all?

                                        // May be better to get the data from the db in a different form.
                                        //  First get all documents, and see if they are transformation root documents.
                                        /// Then consult a map to see which others use the root nodes as a source, and continue to do this for the
                                        //  branches from the root.





                                        //  Then we start with all of the identified roots, and


                                        //throw 'stop';


                                        // could go through them here to get the parameter objects.

                                        //var fns = jsgui.Fns();

                                        // Need to get call the function that gets the full parameters, not
                                        //  get_document_transformation_parameters_by_transformation_id

                                        // get_document_transformation_full_parameters
                                        // get_document_transformation_obj_parameters



                                        //

                                        // can build up some kind of result object here.

                                        // connections between one object and another, but it's not really a tree so far.
                                        // just a source document, and a target document.

                                        /*

                                         {
                                         'fuji.jpg': {
                                         'resize': {
                                         '128': 'fuji_128.jpg'
                                         }
                                         }
                                         }

                                         // Don't like that format so much.
                                         //  A list would look nicer
                                         //  Also harder to do the tree with multiple params.

                                         /*
                                         Probably looks neatest.
                                         Will have a list of the various different resized versions based on a source.


                                         'fuji.jpg': {
                                         'versions': {
                                         'source': 'fuji.jpg'
                                         'targets':
                                         [
                                         ['fuji_128.jpg', 'resize', {size: 128}]
                                         ]

                                         }
                                         }

                                         'fuji.jpg': [
                                         ['fuji_128.jpg', {'width': 128, 'height': 128}, 'resize', {size: 128}]
                                         ]

                                         */









                                        /*
                                        each(res_info, function(obj_resize) {
                                            fns.push([that, that.get_document_transformation_obj_parameters, [obj_resize.id], function(err, res) {
                                                if (err) {
                                                    throw err;
                                                } else {

                                                    // I think this is where we process / puth together the results from the individual items.

                                                    // the obj_resize has got the necessary information.
                                                    //  we need to put together a list of the target documents and the source documents.





                                                    console.log('* res', res);
                                                    console.log('obj_resize', obj_resize);
                                                }
                                            }]);
                                        });
                                        */
                                        /*



                                        fns.go(function(err, res_all) {
                                            console.log('res_all', res_all);



                                        });
                                        */





                                        //throw 'stop';

                                        //

                                    }
                                })



                            }
                        })







                    }
                })


                // get_document_transformation_keys_by_verb_id
                // get_document_transformation_source_target_keys_by_verb_id
                //

                // eg get all resize transformations.




                /*
                 SELECT document_transformations.*, docs1.key as source_key, docs2.key as target_key FROM document_transformations
                 LEFT OUTER JOIN documents as docs1 on document_transformations.source_document_id = docs1.id
                 LEFT OUTER JOIN documents as docs2 on document_transformations.target_document_id = docs2.id

                 */



















            },

            // Also want a get images with metadata function.
            //  May need to do a bunch of calls to the db to get the various metadata items.

            // Could possibly use a linked function in the db.

            // Get images with metadata.
            //  Would get the images, and then get the metadata for rach of them



            'get_images': function(callback) {
                // Get documents by a particular document type
                //  get_documents_by_type_name

                /* SELECT * FROM documents LEFT OUTER JOIN document_types ON documents.document_type_id = document_types.id */

                // SELECT documents.id as id, key, document_types.name as type_name, document_types.id as type_id, mime_type FROM documents LEFT OUTER JOIN document_types ON documents.document_type_id = document_types.id

                // Will only get the JPEG images for the moment.

                // Maybe want to get the images tree.
                //  The images are arranged as a tree, with some of them being resized / changed versions of others.

                // May be good to have image_relationships in the DB, so that we know that one is a resized version of another.
                //  That could also help if the original were to be changed.

                // document_relationships would indicate a relationship between two documents.
                //  maybe need a way to identify the root / original document in a relationship / relationship chain?

                // relationship - transformation
                //  A is the parent, B is the modified / resized version.

                // Express a document relationship in the database.
                //  Relationship type...
                //   resized version (b is resized version of a)

                // Relationships in the document system could also help when modifying a document will need to change another automatically.

                // So could do a search for all documents that are a in that relationship rather than b
                // Could search for all original size documents, and their descendants in a tree.

                // Could have an image overtype, and jpeg, png, svg, bmp etc subtypes.


                // Type subclasses would be useful in the db system, so it can query images, jpegs or whatever.




                this.get_documents_by_type_name('jpeg', function(err, res_jpeg_images) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log('res_jpeg_images', res_jpeg_images);
                        callback(null, res_jpeg_images);
                        // Maybe there should be multiple images.
                    }
                })
            },
            'get_flexidocs': function(callback) {
                // Get documents by a particular document type
                //  get_documents_by_type_name

                /* SELECT * FROM documents LEFT OUTER JOIN document_types ON documents.document_type_id = document_types.id */

                // SELECT documents.id as id, key, document_types.name as type_name, document_types.id as type_id, mime_type FROM documents LEFT OUTER JOIN document_types ON documents.document_type_id = document_types.id

                // Will only get the JPEG images for the moment.



                //this.get_json_documents_by_tag('flexidoc', function(err, res_flexidocs) {
                this.get_all_flexidocs(function(err, res_flexidocs) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log('res_flexidocs', res_flexidocs);
                        callback(null, res_flexidocs);
                        // Maybe there should be multiple images.
                    }
                });

                /*
                this.get_documents_by_type_name('jpeg', function(err, res_jpeg_images) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log('res_jpeg_images', res_jpeg_images);
                        callback(null, res_jpeg_images);
                        // Maybe there should be multiple images.
                    }
                })
                */
            }






        });
        return Web_DB_Resource_Postgres;
});