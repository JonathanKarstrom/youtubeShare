const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('app'))

let roomData = [
  {
    id: '1',
    roomName: 'Roomilicious',
    playlist: ['https://www.youtube.com/watch?v=lbVdyPZiOLM', 'https://www.youtube.com/watch?v=Yk0CR1VaRHY'],
    playlistIndex: 0,
    timestamp: 0,
    playing: false
  }
]

app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/app/index.html');
});

io.on('connection', function (socket) {
  socket.on("joinroom", function (roomId) {

    console.log(roomId, "joined");
    socket.join(roomId);

    io.of('/').in(roomId).clients(function (error, clients) {
      let numClients = clients.length;

      if (numClients === 1) {
        socket.emit('master');
      }
      socket.emit('numClients', numClients);
      socket.to(roomId).emit('numClients', numClients);
      console.log(numClients);
    });

    for (room of roomData) {
      console.log(room.id === roomId);
      console.log(room);
      if (room.id === roomId) {
        socket.emit('roomData', room);
      }
    }
  });

  socket.on("play", function (roomId) {
    console.log(roomId, "play");
    socket.broadcast.to(roomId).emit("play");
  });

  socket.on("paus", function (roomId) {
    console.log(roomId, "paus");
    socket.broadcast.to(roomId).emit("paus");
  });

  socket.on('addtoPlaylist', function (obj) {
    console.log('adding to playlist', obj);
    for (room of roomData) {
      if (room.id === obj.id) {
        room.playlist.push(obj.url);
        socket.emit('roomData', room);
        socket.to(obj.id).emit('roomData', room);
      }
    }
  });

  socket.on('disconnect', function () {
    io.of('/').in('123').clients(function (error, clients) {
      let numClients = clients.length;
      console.log(numClients);
    });
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});