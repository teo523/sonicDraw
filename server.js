var config = require(__dirname + '/config');
var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000);
var io = require('socket.io')(server);
var activeUsers = 0;


app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

var names = [];

client_setting = {};
io.sockets.on('connection', function (socket) {

    var aut = 0;
    var clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    console.log(' new request from : '+clientIpAddress);
    console.log('[*] info: new connection ' + socket.id);

    client_setting[socket.id] = {
        thickness: 0,
        color: [255,255,255]
    }
    var num = io.engine.clientsCount
    socket.emit('numConnected', num );
    socket.emit('activeUsers', activeUsers);


    socket.on('trace', function (data) {
        all_data = data;
        socket.broadcast.emit('trace', all_data);
    });

    socket.on('names', function (name) {
       if(names.indexOf(name)==-1)
            names.push(name);
        console.log(names);
        socket.emit('names', names);
        socket.broadcast.emit('names', names);
    });

    socket.on('auth', function () {
        if (activeUsers < 2) {
            activeUsers++;
            socket.emit('activeUsers', activeUsers);
            socket.broadcast.emit('activeUsers', activeUsers);
            aut = 1;
        }
    });


    socket.on('sending', function(send) {
      if (aut == 1){
        socket.broadcast.emit('sending', send);
      }

        });

    socket.on('sent', function(send) {
      if (aut == 1){
        socket.broadcast.emit('sent', send);
      }

        });

    socket.on('mouse', function(mouse) {
        socket.broadcast.emit('mouse', mouse);
        });


    socket.on('disconnect', function() {
      console.log('Got disconnect!');
      if (aut == 1){
        activeUsers--;
        socket.broadcast.emit('activeUsers', activeUsers);
      }

        });

    
});
