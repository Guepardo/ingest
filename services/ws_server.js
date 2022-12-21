
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


    const ffmpeg = child_process.spawn('ffmpeg', [
      '-i','-',
      '-pix_fmt', 'yuvj420p',
      // video codec config: low latency, adaptive bitrate
      '-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'zerolatency',

      // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
      // '-c:a', 'aac', '-strict', '-2', '-ar', '44100', '-b:a', '64k',

      //force to overwrite
      '-y',

      // used for audio sync
      '-use_wallclock_as_timestamps', '1',
      '-async', '1',
      '-loglevel', 'quiet',
      // '-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
      // '-strict', 'experimental',
      '-bufsize', '1000',
      '-f', 'flv',
      'a.flv'
    ]);

    // Kill the WebSocket connection if ffmpeg dies.
    ffmpeg.on('close', (code, signal) => {
      console.log('FFmpeg child process closed, code ' + code + ', signal ' + signal);
    });

    // Handle STDIN pipe errors by logging to the console.
    // These errors most commonly occur when FFmpeg closes and there is still
    // data to write.f If left unhandled, the server will crash.
    ffmpeg.stdin.on('error', (e) => {
      console.log('FFmpeg STDIN Error', e);
    });

    // FFmpeg outputs all of its messages to STDERR. Let's log them to the console.
    ffmpeg.stderr.on('data', (data) => {
      console.log('FFmpeg STDERR:', data.toString());
    });

    socket.on('message', payload => { ffmpeg.stdin.write(payload) } )

    socket.on('message', payload => this.onSocketMessage(socket, payload))
    socket.on('close', () => this.onSocketDisconnection(socket))
  }

  onSocketMessage(socket, payload) {
    // if(Buffer.isBuffer(payload)) {
      this.tcpServersManager.publishServer(socket, payload)
    // }
  }

  onSocketDisconnection(socket) {
    this.tcpServersManager.removeServer(socket)
  }
}