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

        var stringify = jsgui.stringify, each = jsgui.eac, tof = jsgui.tof, fp = jsgui.fp;
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

            'set_document': fp(function(a, sig) {
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

            // get_string_document_value_value_by_document_id

            // Could make this polymorphic, and call itself?



            'set_document': function(key, value, type_name, callback) {
                // text/plain

                // the type of the document as a string.
                //  will have that kind of type determine the mime type.
                //  will be easier that way, less typing too.

                // need to ensure there is that document type, get the dt id.


                var that = this;

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

                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
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

                                }
                            })
                        } else {
                            callback(null, undefined);
                        }
                    }
                })
            }

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

































        });
        return Web_DB_Resource_Postgres;
});