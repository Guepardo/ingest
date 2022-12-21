
import { WebSocketServer } from 'ws'
import TcpServersManager from './tcp_servers_manager.js'
import child_process from 'child_process'

export default class WsServer {
  TCP_SERVERS_POLL_SIZE = 10

  constructor() {
    this.server = new WebSocketServer({ port: 8080 })
    this.header = null
    this.tcpServersManager = new TcpServersManager(this.TCP_SERVERS_POLL_SIZE)
  }

  start() {
    this.server.on('connection', socket => this.onConnection(socket))
  }

  onConnection(socket) {
    // TODO: Create server only for uniq identifiers, not for sockets
    this.tcpServersManager.createServer(socket)

    socket.on('message', payload => this.onSocketMessage(socket, payload))
    socket.on('close', () => this.onSocketDisconnection(socket))
  }

  onSocketMessage(socket, payload) {
    this.tcpServersManager.publishServer(socket, payload)
  }

  onSocketDisconnection(socket) {
    this.tcpServersManager.removeServer(socket)
  }
}