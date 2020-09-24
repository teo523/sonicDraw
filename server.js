var config = require(__dirname + '/config');
var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000);
var io = require('socket.io')(server);

var partners = {"teo123": 1, "alejandro123": 1, "claudia123": 2, "samuel123": 2};
var channels = {1:[],2:[]};

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

var names = [];

client_setting = {};
io.sockets.on('connection', function (socket) {
    var activeUsers;
    var id = socket.id;
    var aut = 0;
    var clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    
    var channel = 0;
    
    var name;
    console.log('[*] info: new connection ' + socket.id);


    client_setting[socket.id] = {
        thickness: 0,
        color: [255,255,255]
    }
    var num = io.engine.clientsCount
    socket.emit('numConnected', num );
    socket.emit('activeUsers', activeUsers);
    socket.emit('names', Object.keys(partners));
    socket.broadcast.emit('names', Object.keys(partners));


    socket.on('trace', function (data) {
        all_data = data;
        //socket.broadcast.emit('trace', all_data);
        socket.to(channel).emit('trace', all_data);
    });

    /*socket.on('names', function (name) {
       if(names.indexOf(name)==-1)
            names.push(name);
        console.log(names);
        socket.emit('names', names);
        socket.broadcast.emit('names', names);
    });*/

    socket.on('names', function (nm) {
        name = nm;
        socket.join(partners[name]);
        channel = partners[name];
        channels[channel].push(name);
        delete partners[name];
        
        console.log("channels: " + JSON.stringify(channels));
        console.log("partners: " + JSON.stringify(partners));
        socket.emit('names', Object.keys(partners));
        socket.broadcast.emit('names', Object.keys(partners));
        io.to(channel).emit('channelNames', channels[channel]);
        activeUsers=channels[channel].length;
        io.to(channel).emit('activeUsers', activeUsers);
        socket.emit('userId',channels[channel].length - 1);
        //io.to(channel).broadcast.emit('activeUsers', activeUsers);
    });

    /*socket.on('auth', function () {
        
            activeUsers=channels[]
            socket.emit('activeUsers', activeUsers);
            socket.broadcast.emit('activeUsers', activeUsers);
            aut = 1;
        
    });*/


    socket.on('sending', function(send) {
              socket.to(channel).emit('sending', send);
      

        });

    socket.on('sent', function(send) {
     
        socket.to(channel).emit('sent', send);
      

        });

    socket.on('mouse', function(mouse) {
        socket.to(channel).emit('mouse', mouse);
        });


    socket.on('disconnect', function() {
        console.log('Got disconnect!');
        if (name != undefined){
            var index = channels[channel].indexOf(name);
            if (index > -1)
                channels[channel].splice(index,1);
            partners[name]=channel;
          
            console.log("channels: " + JSON.stringify(channels));
            console.log("partners: " + JSON.stringify(partners)); 
            
            activeUsers=channels[channel].length;
            io.to(channel).emit('activeUsers', activeUsers);
            socket.to(channel).emit('userId',channels[channel].length - 1);
        }

        });

    
});
