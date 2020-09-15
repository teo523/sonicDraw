var config = require(__dirname + '/config');
var express = require('express');

var app = express();
var server = app.listen(process.env.PORT || 3000);
var io = require('socket.io')(server);


app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});



client_setting = {};
io.sockets.on('connection', function (socket) {
    var clientIpAddress = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
    console.log(' new request from : '+clientIpAddress);
    console.log('[*] info: new connection ' + socket.id);
    client_setting[socket.id] = {
        thickness: 0,
        color: [255,255,255]
    }

    socket.on('trace', function (data) {
        all_data = data;
        socket.broadcast.emit('trace', all_data);
    });
    socket.on('changeSlider', function (data) {
        if (data.thickness <= 50) {
            client_setting[socket.id] = {
                thickness: data.thickness,
                color: data.color
            };
        }
    });
});
