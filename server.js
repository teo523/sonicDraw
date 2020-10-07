var config = require(__dirname + '/config');
var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000);
var io = require('socket.io')(server);

var partners = {"grupo1u1": 1, "grupo1u2": 1, "grupo2u1": 2, "grupo2u2": 2, "grupo3u1": 3, "grupo3u2": 3, "grupo4u1": 4, "grupo4u2": 4, "grupo5u1": 5, "grupo5u2": 5, "grupo6u1": 6, "grupo6u2": 6, "grupo7u1": 7, "grupo7u2": 7, "grupo8u1": 8, "grupo8u2": 8, "grupo9u1": 9, "grupo9u2": 9, "grupo10u1": 10, "grupo10u2": 10, "grupo11u1": 11, "grupo11u2": 11, "grupo12u1": 12, "grupo12u2": 12, "grupo13u1": 13, "grupo13u2": 13, "grupo14u1": 14, "grupo14u2": 14, "grupo15u1": 15, "grupo15u2": 15};
var channels = {1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[],13:[],14:[],15:[]};

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
