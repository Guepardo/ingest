import net from "net"

// var server = net.createServer(function(socket) {
// 	socket.write('Echo server\r\n');
// 	socket.pipe(socket);
//   setInterval(() => {
//     socket.write("asdfsdf")
//   }, 1000);
// });

// server.listen(1337, '127.0.0.1');

// function createServer(port) {
let server = net.createServer(function (socket) {
  socket.write('Echo server\r\n');
  socket.pipe(socket);
  setInterval(() => {
    socket.write(Buffer.alloc(375000))
  }, 1000);
});

//   server.listen(port, '127.0.0.1');

//   return server
// }

// let startPort = 1337

export default class TcpServer {
  constructor(port) {
    this.port = port
    this.sockets = []
    this.server = null
  }

  create() {
    this.server = net.createServer(function (socket) {
      socket.pipe(socket);
      this.sockets.push(socket)
    });

    // TODO: add event handlers for error and disconnection
  }

  listen() {
    if (!this.server) {
      throw "TCP is not initialized"
    }

    this.server.listen(this.port, "127.0.0.1")
  }


  publish(payload) {
    for (let socket of this.sockets) {
      socket.write(payload)
    }
  }
}