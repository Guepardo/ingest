import { v4 as uuidv4 } from 'uuid';
import net from "net"

export default class TcpServer {
  constructor(port) {
    this.port = port
    this.sockets = {}
    this.server = null
  }

  create() {
    // TODO: add event handlers for error and disconnection
    this.server = net.createServer(socket => this.onSocketConnection(socket));
  }

  listen() {
    if (!this.server) {
      throw "TCP is not initialized"
    }

    this.server.listen(this.port, "127.0.0.1")
  }


  publish(payload) {
    for (let socket of Object.values(this.sockets)) {
      socket.write(payload)
    }
  }

  onSocketConnection(socket) {
    let socketId = uuidv4()

    // socket.pipe(socket)

    this.sockets[socketId] = socket

    socket.on('error', () => this.onSocketDisconnection(socketId))
    socket.on('end', () => this.onSocketDisconnection(socketId))
  }

  onSocketDisconnection(socketId) {
    delete this.sockets[socketId]
  }
}