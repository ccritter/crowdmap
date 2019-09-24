const osc = require("osc");
const WebSocket = require('ws');

const url = 'www.crowdmap.fm';
const port = 57121

function openUdp(socketPort) {
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
    console.log('Got UDP:');
    console.log(msg);
    console.log(timeTag);
    console.log(info);
    console.log('\n');
  });

  udpPort.open();

  return udpPort;
}

function openSocket() {
  let socketPort = new osc.WebSocketPort({
    url: 'ws://' + url,
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
    console.log('Got Socket:');
    console.log(msg);
    console.log(timeTag);
    console.log(info);
    console.log('\n');
  });

  socketPort.open();

  return socketPort;
}

openUdp();
openSocket();
