const express = require('express');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 80;
const socketIO = require('socket.io');
const sqlite = require('sqlite-sync');
const os = require('os');

sqlite.connect(path.join(__dirname, 'database.db'));

console.clear();
console.log('______TheGame_SERVER________');
console.log('OS Platform', os.platform());
console.log('OS Release', os.release());
console.log('NODE_ENV', process.env.NODE_ENV || 'Debug-Local');

var app = express()
    .use(express.static(path.join(__dirname, 'public')))
    // .use(fileUpload())
    .get('/', (req, res) => {
        res.send({
            message:'TheGame Server Online', 
            serverStatus: 'Online', 
            serverVersion: '1.0.1',
            clientVersion: '1.0.1'
        });
    })
    .get('/client', (req, res)=>{
        res.sendFile(path.join(__dirname, '/public/client.html'));
    })
    .listen(PORT, ()=> console.log(`Web Server Listening on ${PORT}`));

// SOCKET.IO SETTINGS
var io = socketIO(app, {
    pingInterval: 1000,
});

var rooms = [];
var players = [];

io.on('connection', function(socket){
    console.log('New Client', socket.id);
    socket.on('disconnect', ()=>{
        console.log('Client Disconnected');
    });
    socket.emit('server-msg', {content: 'Connection Success'});
    socket.on('show-rooms', function(){
        console.log(rooms);
    });
    socket.on('create-room', function(config){
        if(typeof rooms[config.name] == "undefined"){
            rooms[config.name] = config;
            console.log('Room', config.name, 'created');
        }else{
            let msg = `Room ${config.name} already exists`;
            console.log(msg);
            socket.emit('server-msg', {content: msg});
        }
        // socket.join(config.name);
        // rooms[config.name].players.push(socket.id);
    });
    socket.on('join-room', function(name){
        if(typeof rooms[name] != 'undefined'){
            socket.join(name);
            rooms[name].players.push(socket.id);
            console.log('Client joined Room', name);
        }else{
            console.log('Room', name,'not exist');
        }
    });
});

setInterval(function(){
    // trate arrays of rooms and clients
    //  io.sockets.emit('server-msg', {content: 'Frame Rate'});
    for(name in rooms){
        let room = rooms[name];
        // console.log(room);
        for(player_id in room.players){
            io.sockets.in(room.name).emit('game-state', {});
        }
    }
}, 1000 / 60); // frame rate 60 vezes por segundo... 60Hz