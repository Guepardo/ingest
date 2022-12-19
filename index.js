import net from "net"

// /*
// In the node.js intro tutorial (http://nodejs.org/), they show a basic tcp
// server, but for some reason omit a client connecting to it.  I added an
// example at the bottom.
// Save the following server in example.js:
// */

// var server = net.createServer(function(socket) {
// 	socket.write('Echo server\r\n');
// 	socket.pipe(socket);
//   setInterval(() => {
//     socket.write("asdfsdf")
//   }, 1000);
// });

// server.listen(1337, '127.0.0.1');

// function createServer(port) {
//   let server = net.createServer(function (socket) {
//     socket.write('Echo server\r\n');
//     socket.pipe(socket);
//     setInterval(() => {
//       socket.write(Buffer.alloc(375000))
//     }, 1000);
//   });

//   server.listen(port, '127.0.0.1');

//   return server
// }

// let startPort = 1337

// let servers = []

// for (let serverId = 0; serverId < 10; serverId++) {
//   servers.push(createServer(serverId + startPort))
// }

import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('new connection')
  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});