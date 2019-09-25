const osc = require("osc");
const WebSocket = require('ws');

const url = 'crowdmap.fm';
// const url = 'localhost';
const port = 57121

function openUdp() {
  let udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: port,
    remoteAddress: url,
    remotePort: port
  });

  udpPort.on('ready', () => {
    console.log('UDP Ready. Sending Hello!');

    udpPort.send({
        address: '/hello',
        args: []
      });
  });

  udpPort.on('message', (msg, timeTag, info) => {
    console.log('Got UDP msg:');
    console.log(msg);
    console.log(timeTag);
    // console.log(info);
    console.log('');
  });

  udpPort.on('error', e => {
    console.log(e);
  });

  udpPort.open();

  return udpPort;
}

function openSocket() {
  let socketPort = new osc.WebSocketPort({
    url: 'wss://' + url,
    metadata: true
  });

  socketPort.on('ready', () => {
    console.log('Socket connected. Sending Hello!');

    socketPort.send({
      address: '/hello',
      args: []
    })
  });

  socketPort.on('message', (msg, timeTag, info) => {
    console.log('Got Socket msg:');
    console.log(msg);
    console.log(timeTag);
    // console.log(info);
    console.log('');
  });

  socketPort.on('error', e => {
    console.log(e);
  });

  socketPort.open();

  return socketPort;
}

let udp = openUdp();
let sock = openSocket();

process.on('SIGINT', function() {
  console.log('goodbye!');
  udp.send({
    address: '/goodbye',
    args: []
  });

  sock.send({
    address: '/goodbye',
    args: []
  });
});