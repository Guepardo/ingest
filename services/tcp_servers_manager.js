import TcpServer from "./tcp_server.js"


export default class TcpServersManager {
  INITIAL_PORT_RANGE = 1337

  constructor(serversPollSize) {
    this.portsAvailable = {}
    this.servers = {}

    for (let index = 0; serversPollSize > index; index++) {
      this.portsAvailable[index + this.INITIAL_PORT_RANGE] = false
    }
  }

  createServer(id) {
    let port = this.requestPort()
    let server = new TcpServer(port)

    try {
      server.create()
      server.listen()

      // TODO: refactor this to use Map class??
      this.servers[id] = {
        server: server,
        port: port
      }

    } catch (e) {
      this.releasePort(port)

      throw e
    }
  }

  removeServer(id) {
    this.releasePort(this.servers[id].port)
    delete this.servers[id]
  }

  publishServer(id, payload) {
    let server = this.servers[id].server
    server.publish(payload)
  }

  requestPort() {
    for (let port of Object.keys(this.portsAvailable)) {
      let allocated = this.portsAvailable[port]

      if (allocated) {
        continue
      }

      // lock this port for a server
      this.portsAvailable[port] = true

      return port
    }

    throw "Servers poll size reached to limit"
  }

  releasePort(port) {
    this.portsAvailable[port] = false
  }
}