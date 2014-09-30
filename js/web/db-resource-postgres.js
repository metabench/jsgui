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



//








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
        var Control = jsgui.Control;

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

                        if (t_document_metadata_integer_record_id == 'number') {
                            // update the integer record.
                            that.update_document_metadata_integer_record(document_metadata_integer_record_id, value, callback);

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

                    // we call it with these values.
                    //  could this be done using mapify instead?

                    var fns = jsgui.Fns();
                    each(obj_values, function(v, i) {
                        fns.push([that, that.set_document_metadata, [document_id, i, v]]);
                    });

                    fns.go(function(err, res_fns) {
                        if (err) {
                            throw err;
                        } else {
                            console.log('res_fns', res_fns);
                        }
                    });

                }

                if (tof(document_id) == 'number') {
                    var t_metadata_record_value = tof(metadata_record_value);

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

                        that.get_document_metadata_record_type_id_by_name('integer', function(err, document_metadata_record_type_id) {
                            if (err) {
                                callback(err);
                            } else {

                                // now we have the record type id, we can

                                that.ensure_document_metadata_record(document_id, metadata_record_key, document_metadata_record_type_id, function(err, document_metadata_record_id) {
                                    if (err) {
                                        callback(err);
                                    } else {
                                        console.log('document_metadata_record_id', document_metadata_record_id);

                                        //throw 'stop';

                                        // then need to ensure the document metadata record value (of the appropriate type).

                                        that.ensure_document_metadata_integer_record(document_metadata_record_id, metadata_record_value, function(err, res_ensure_metadata_integer_record_value) {
                                            if (err) {
                                                throw err;
                                            } else {
                                                console.log('res_ensure_metadata_integer_record_value', res_ensure_metadata_integer_record_value);

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


            // We should probably be calling _set_document_no_metadata, and then updating the metadata.



            // Will give the document, with all its metadata, they will be set in the database.
            //  The module that calls this, Image in the case of images, will



            // _set_document_no_metadata
            //  the new set_document function will set the document with _set_document_no_metadata and then ensure the metadata is correct.
            'set_document': fp(function(a, sig) {

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

                        // Need to find out what metadata to use.
                        //  would depend on the type_name first.

                        // Probably don't want to be getting the image metadata here.
                        //  Probably best not to decode the image either.

                        // May be best just to provide the web-db interface, and then another component will do the actual adding / saving of the image.
                        //  Can call the seit image resource, that will get the web db resource (from the pool?), and then it will
                        //  make the lower level calls to the web db system.

                        // Possibly a set_document or set_image document in the image resource.
                        //

                        if (metadata) {
                            that.set_document_metadata(document_id, metadata, function(err, res_set_document_metadata) {
                                if (err) {
                                    callback(err);
                                } else {
                                    console.log('res_set_document_metadata', res_set_document_metadata);
                                    callback(null, document_id);
                                }
                            })
                        } else {
                            // Perhaps we ensure the document has no metadata.
                            //  Maybe an empty metadata object will indicate that.

                            //  Also, will need to remove unwanted metadata items.
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

            'get_images': function(callback) {
                // Get documents by a particular document type
                //  get_documents_by_type_name

                /* SELECT * FROM documents LEFT OUTER JOIN document_types ON documents.document_type_id = document_types.id */

                // SELECT documents.id as id, key, document_types.name as type_name, document_types.id as type_id, mime_type FROM documents LEFT OUTER JOIN document_types ON documents.document_type_id = document_types.id

                // Will only get the JPEG images for the moment.

                this.get_documents_by_type_name('jpeg', function(err, res_jpeg_images) {
                    if (err) {
                        callback(err);
                    } else {
                        console.log('res_jpeg_images', res_jpeg_images);
                        callback(null, res_jpeg_images);

                        // Maybe there should be multiple images.


                    }
                })





            }





































        });
        return Web_DB_Resource_Postgres;
});