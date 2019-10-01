const osc = require("osc");
const WebSocket = require('ws');

const url = 'crowdmap.fm';
// const url = 'localhost';
const port = 57121

let udp = openUdp();
let sock;

function openUdp() {
  let udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: 57122, // port,
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
    if (msg.address === '/hello') {
      console.log('Client registered successfully.');
      sock = openSocket();
    }

    console.log('Got UDP msg:', msg);
    // console.log(msg);
    // console.log(timeTag);
    // console.log(info);
    // console.log('');
  });

  udpPort.on('error', e => {
    console.log(e);
  });

  udpPort.open();

  return udpPort;
}

function openSocket() {
  let socketPort = new osc.WebSocketPort({
    url: 'wss://' + url, // TODO DELETE THIS PORT, and change back to WSS!!!
    metadata: true
  });

  socketPort.on('ready', () => {
    console.log('Socket connected. Sending Hello!');

    socketPort.send({
      address: '/hello',
      args: [{
        type: 's',
        value: JSON.stringify([
          {address: '/orientation/beta', type: 'echo', source:'test'},
          {address: '/orientation/gamma', type: 'echo', source:'test'}
        ])
      }]
    });
  });

  socketPort.on('message', (msg, timeTag, info) => {
    console.log('Got Socket msg:', msg);
    // console.log(msg);
    // console.log(timeTag);
    // console.log(info);
    // console.log('');
  });

  socketPort.on('error', e => {
    console.log(e);
  });

  socketPort.open();

  return socketPort;
}


process.on('SIGINT', function() {
  console.log('goodbye!');

  udp.close();

  if (sock) {
    sock.send({
      address: '/goodbye',
      args: []
    });

    sock.close();
  }
});