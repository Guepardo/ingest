import zmq from "zeromq"
export default class TcpServer {
  constructor(port) {
    this.port = port
    this.server = null
  }

  create() {
    this.server = zmq.socket("pub");
    // TODO: add event handlers for error and disconnection
    // this.server = net.createServer(socket => this.onSocketConnection(socket));
  }

  listen() {
    if (!this.server) {
      throw "TCP is not initialized"
    }

    this.server.bindSync("tcp://127.0.0.1:" + this.port);
  }

  publish(payload) {
    console.log(payload)
    this.server.send(['data', payload])
  }
}