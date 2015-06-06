// First scan the network for any raspberry pis.

// Want to be able to remotely configure a Raspberry Pi.

// To start with, ensure that iojs is running on it, so it can start its service there and have commands sent using a web interface

// Needs to keep the codebase on the pi up to date as well.

/*

var Client = require('ssh2').Client;

var conn = new Client();
conn.on('ready', function() {
  console.log('Client :: ready');
  conn.exec('uptime', function(err, stream) {
    if (err) throw err;
    stream.on('close', function(code, signal) {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', function(data) {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', function(data) {
      console.log('STDERR: ' + data);
    });
  });
}).connect({
  host: '192.168.1.6',
  port: 22,
  username: 'pi',
  password: 'raspberry'
});
*/

var usb_scan = require('./usb_scan');
var jsgui_itself = require('../../fs/jsgui-itself')
var copy_zip_jsgui_itself = jsgui_itself.copy_zip_jsgui_itself;

var fs = require('fs');

var SSH = require('simple-ssh');

var jsgui = require('../../core/jsgui-lang-util');
var each = jsgui.eac;
var Fns = jsgui.Fns;

var ssh_params = {
    host: '192.168.1.6',
    port: 22,
    user: 'pi',
    pass: 'raspberry'
};
ssh_params.password = ssh_params.pass;

var ssh = new SSH(ssh_params);

var ssh2 = require('ssh2');

/*
var conn = new ssh2();

conn.on(
    'connect',
    function () {
        console.log( "- connected" );
    }
);
*/

var get_user_home = function() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

// Viewing the networks on the device.

// ifconfig

// also looking through the messages, and possibly device assignments to see which USB port is serving which network interface.

// Want to be able to reconfigure the network.

// Or load up different netowrk configuration information for it, and set it up on the machine, so the machine can adapt to serve
//  networks in different situations.


// Want to be able to edit, save, modify and replace various files.

// Want to be able to set up the server using npm to load jsgui onto the pi, run it there, and then use configuration within jsgui.
// Two jsgui servers talking to each other.
//  Will make some functionality that's local to the pi available elsewhere through the resource publishing system.

// However, more quickly copying files to the pi, rather than through npm may be a lot better while developing.

// Could select all of the JavaScript files, and put them into a ZIP file in their directory structures.
// Copy the ZIP over to the PI, then decompress it there.








//var command = 'ls';
//var command = 'sudo lsusb -v';


var ssh_exec = function(command, callback) {
  var text = '';
  //console.log('ssh exec command ' + command);
  ssh = new SSH(ssh_params);
  ssh.exec(command, {
      out: function(stdout) {
          //console.log('stdout ' + stdout);

          //var res_scan = usb_scan.parse_res_scan_devices(stdout);

          //console.log('res_scan', res_scan);
          text = text + stdout;


      },
      err: function(stderr) {
          console.log('stderr ' + stderr); // this-does-not-exist: command not found

      },
      exit: function(code) {
          //console.log('exit ' + code); // 69



          //console.log('res_scan', res_scan);
          callback(null, text);
      }
  }).start();
}

/*

ssh.exec(command, {
    out: function(stdout) {
        //console.log('stdout ' + stdout);

        //var res_scan = usb_scan.parse_res_scan_devices(stdout);

        //console.log('res_scan', res_scan);
        text = text + stdout;


    },
    err: function(stderr) {
        console.log('stderr ' + stderr); // this-does-not-exist: command not found
    },
    exit: function(code) {
        console.log('exit ' + code); // 69

        var res_scan = usb_scan.parse_res_scan_devices(text);

        console.log('res_scan', res_scan);
    }
}).start();


// May want to:

// Create new jsgui_admin user, root privilages.
//  Send jsgui over to /lib/jsgui
//   node modules are also in lib.

// Just having jsgui in lib/jsgui will be useful.
//  Perhaps could even be in the npm directory - but so far web have just copied the js files.

// For the moment will only deploy js.
//  That should be enough to run server-side code that will carry out more functions.

*/

// Want more functionality here.

// get_wpa_supplicants?

// Files seem available with SFPT.

// Will need to be looking into the wpa_supplicants file.


// Want to have Zipped_File_Copy functionality, where it zips up files before copying them.

// May want to unzip in a particular location, and copy to others.







var get_users_list = function(callback) {
  //console.log('get_users_list');
  var command = 'sudo cut -d: -f1 /etc/passwd';
  //if (err) { throw err; } else {
    ssh_exec(command, function(err, res_command) {
      if (err) { callback(err) } else {
        //console.log('res_command', res_command);
        var res = res_command.trim().split('\n');
        //console.log('res', res);
        callback(null, res);
        //throw 'stop';

      }
    })
  //}
}

var has_user = function(username, callback) {
  //console.log('has_user', username);
  get_users_list(function(err, users) {
    if (err) { callback(err) } else {
      console.log('users', users);
      var found = false;
      var c = 0, l = users.length;

      while (!found && c < l) {
        found = users[c] === username;
        c++;
      }
      //console.log('found', found);

      callback(null, found);
    }
  })
}

// Get the group names
// cut -d: -f1 /etc/group

var get_groups_list = function(callback) {
  var command = 'cut -d: -f1 /etc/group';
  //if (err) { throw err; } else {
  ssh_exec(command, function(err, res_command) {
    if (err) { throw err; } else {
      //console.log('res_command', res_command);
      var res = res_command.trim().split('\n');

      callback(null, res);
      //throw 'stop';

    }
  })
  //}
}


var ensure_root_user = function(username, password, callback) {


  has_user(username, function(err, has_jsgui_admin) {
    if (err) { throw err; } else {

      if (has_jsgui_admin) {
        set_user_password(username, password, function(err, res_set_password) {
          if (err) { throw err; } else {
            console.log('have set password');
            callback(null, true);
          }
        });

      } else {
        create_user(username, password, function(err, res_create_user) {
          if (err) { throw err; } else {
            console.log('res_create_user', res_create_user);

            callback(null, true);
          }
        })

      }



    }
  });



}

//adduser <username> <groupname>

var create_user = function(username, password, callback) {
  // make it a root user
  // useradd prometeo -d /home/prometeo -g test -m -p `mkpasswd pippo`
  console.log('creating user ' + username);
  //var command = 'sudo useradd ' + username + ' -d /home/' + username + ' -g root -m -p `mkpasswd ' + password + '`';
  var command = 'sudo useradd ' + username + ' -d /home/' + username + ' -g root -m -p ' + password;
  //if (err) { throw err; } else {
  ssh_exec(command, function(err, res_command) {
    if (err) { callback(err) } else {
      console.log('create_user res_command', res_command);
      callback(null, true);

    }
  })
}

// echo "newpass" | passwd --stdin user1

var set_user_password = function(username, password, callback) {
  //var command = 'echo "' + password + '" | passwd --stdin ' + username;

  //var command = 'sudo echo "current_password\nnew_password\n' + password + '" | passwd ' + username;
  var command = 'sudo echo "' + username + ':' + password + '" | sudo chpasswd';
  //if (err) { throw err; } else {
  ssh_exec(command, function(err, res_command) {
    if (err) { callback(err) } else {
      //console.log('create_user res_command', res_command);
      callback(null, true);

    }
  })
}

var send_file = function(host, username, password, source_path, dest_remote_path, callback) {
  var ssh2_params = {
      host: host,
      port: 22,
      user: username,
      password: password
  };

  var conn = new ssh2();

  conn.on(
      'connect',
      function () {
          console.log( "- connected" );
      }
  );

  conn.on(
      'ready',
      function () {
          console.log( "- ready" );

          conn.sftp(
              function (err, sftp) {
                  if ( err ) {
                      console.log( "Error, problem starting SFTP: %s", err );
                      process.exit( 2 );
                  }

                  console.log( "- SFTP started" );

                  // upload file
                  //console.log('res_copy_itself', res_copy_itself);


                  var readStream = fs.createReadStream(source_path);
                  var writeStream = sftp.createWriteStream(dest_remote_path);

                  // we can probably SFTP it there, then decompress it there, then sudo copy the files.
                  //  or sudo decompress.
                  //var writeStream = sftp.createWriteStream( "/lib/jsgui/jsgui.zip" );
                  // what to do when transfer finishes
                  writeStream.on(
                      'close',
                      function () {
                          console.log( "- file transferred" );
                          sftp.end();
                          //process.exit( 0 );

                          callback(null, true);
                      }
                  );

                  // initiate transfer of file
                  readStream.pipe(writeStream);
              }
          );
      }
  );

  conn.on(
      'error',
      function (err) {
          console.log( "- connection error: %s", err );
          process.exit( 1 );
      }
  );

  conn.on(
      'end',
      function () {
          //process.exit( 0 );
      }
  );
  conn.connect(ssh2_params);
}

var send_jsgui_js = function(host, username, password, callback) {
  //var res_scan = usb_scan.parse_res_scan_devices(res_command);
  //console.log('res_scan', res_scan);
  copy_zip_jsgui_itself(function(err, res_copy_itself) {
    if (err) { throw err; } else {
      console.log('res_copy_itself', res_copy_itself);

      // then we need to send that zip file over ssh.
      //var readStream = fs.createReadStream(res_copy_itself);
      //var writeStream = sftp.createWriteStream( "/home/pi/jsgui.zip" );
      send_file(host, username, password, res_copy_itself, '/home/pi/jsgui.zip', callback);
    };
  })
}

/*
get_users_list(function(err, res) {
  if (err) { throw err; } else {
    console.log('users list', res);
  }
});
*/

var start_ip4_forwarding_hostapd = function(host, username, password, callback) {
  var fns = Fns();


  fns.push([ssh_exec, [`sudo sysctl -w net.ipv4.ip_forward=1
    sudo iptables -t nat -A POSTROUTING -j MASQUERADE
    sudo service dnsmasq restart
    sudo hostapd /etc/hostapd/hostapd.conf
    `]]);

    fns.go(callback);
}

var install_hostapd = function(host, username, password, callback) {
  apt_get_install(host, username, password, 'hostapd', callback);
}
var install_dnsmasq = function(host, username, password, callback) {
  apt_get_install(host, username, password, 'dnsmasq', callback);
}

var apt_get_install = function(host, username, password, package_name, callback) {
  var fns = Fns();
  // apt-get install -q -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" apache2 mysql-server
  //fns.push([ssh_exec, [`sudo apt-get install hostapd`]]);
  fns.push([ssh_exec, [`sudo DEBIAN_FRONTEND=noninteractive apt-get install -q -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" ` + package_name]]);
  fns.go(callback);
}


var red_led_off = function(host, username, password, callback) {
  // echo 0 | sudo tee /sys/class/leds/led1/brightness
  var fns = Fns();

  // apt-get install -q -y -o Dpkg::Options::="--force-confdef" -o Dpkg::Options::="--force-confold" apache2 mysql-server

  //fns.push([ssh_exec, [`sudo apt-get install hostapd`]]);
  fns.push([ssh_exec, [`sudo echo 0 | sudo tee /sys/class/leds/led1/brightness`]]);
  fns.go(callback);
}



var send_file_adv = function(host, username, password, local_file_path, remote_file_path, callback) {


  var temp_remote_path = '/home/pi/jsgui_temp';

  // send it there, then copy it to the desited location, then delete it.
  var fns = Fns();
  fns.push([send_file, [host, username, password, local_file_path, temp_remote_path]]);
  fns.push([ssh_exec, ['sudo cp ' + temp_remote_path + ' ' + remote_file_path]]);

  // delete the temp file.
  fns.push([ssh_exec, ['rm ' + temp_remote_path]]);

  fns.go(callback);


}

var ensure_remote_jsgui = function(host, username, password, callback) {
  var user_home = get_user_home();
  console.log('user_home', user_home);

  var user_jsgui = user_home + '/jsgui';
  var user_jsgui_net_conf_path = user_jsgui + '/net.json';

  console.log('user_jsgui_net_conf_path', user_jsgui_net_conf_path);

  var fns = Fns();

  fns.push([send_jsgui_js, [host, username, password]]);
  fns.push([ssh_exec, ['unzip -o /home/pi/jsgui.zip']]);
  fns.push([ssh_exec, ['sudo mkdir /lib/jsgui']]);
  fns.push([ssh_exec, ['sudo mkdir /etc/jsgui']]);
  fns.push([ssh_exec, ['sudo cp -ar /home/pi/jsgui /lib']]);
  fns.push([ssh_exec, [`rm -rf /home/pi/jsgui.zip
    rm -rf /home/pi/jsgui`]]);
  // well possibly can't copy it there.
  //  do not have the authority to access that location.
  // maybe a send_file_adv
  //  advanced version that sends it to the location on the server the user has permission to copy it to.
  //  then uses sudo on the server to copy it to where it needs to be.
  fns.push([send_file_adv, [host, username, password, user_jsgui_net_conf_path, '/etc/jsgui/net.json']]);
  fns.go(function(err, res_all) {
    if (err) { throw err; } else {
      callback(null, true);
    }
  });

}




//var jsgui_admin_password = 'sdjkj3;cds';


// Will copy over info about which networks are usable.

// and a remote jsgui directory.

// function to copy a local file to remote.
//  when dealing with multiple files, it should compress them.

// Get the remote server to run a script on startup.

// will look at the lines of etc/rc.local


// Want this to run jsgui on start.


// For the moment, get these set up as signal extenders.

// Need to respond to USB changes
// Need to set things up properly using the starting USB.


// Want to set up the pi for internet connection sharing.


// want to view the current info about internet connection services and sharing

// also worth finding out about the regulatory domain.

// Being able to change that, install a new regulatory domain file.











ensure_remote_jsgui('192.168.1.6', 'pi', 'raspberry', function(err, res) {
  if (err) { throw err; } else {
    console.log('cb ensure_remote_jsgui');



  }
})



//

// start_ip4_forwarding_hostapd

//install_hostapd('192.168.1.6', 'pi', 'raspberry', function() { });
//install_dnsmasq('192.168.1.6', 'pi', 'raspberry', function(err, res) { console.log('res', res)});

// install_dnsmasq

// Would definitely be good to run a local jsgui app. /ws/apps
// Should have an app directory within ws - they would be the 'canonical' apps, and would also have some utility.



/*
start_ip4_forwarding_hostapd('192.168.1.6', 'pi', 'raspberry', function(err, res) { if (err) { throw err; } else {

  console.log('started hostapd forwarding');

  red_led_off('192.168.1.6', 'pi', 'raspberry', function() {});
} });
*/



/*
get_groups_list(function(err, groups) {
  if (err) { throw err; } else {
    console.log('groups', groups);





    ensure_root_user('jsgui_admin', jsgui_admin_password, function(err, res_ensure_user) {
      if (err) { throw err; } else {
        console.log('have ensured jsgui_admin');

        // then upload zip file over ftp.

        //send_jsgui_js('jsgui_admin', jsgui_admin_password, function(err, res_send_jsgui_js) {



      }
    });


  }
});
*/


// Want to copy the jsgui system to the remote system.

// usr/lib/jsgui?





/*** Using the `args` options instead ***/
/*
ssh.exec('echo', {
    args: ['$PATH'],
    out: function(stdout) {
        console.log(stdout);
    }
}).start();

*/
