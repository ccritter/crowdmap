const osc = require("osc");
const WebSocket = require('ws');
const Max = require('max-api');

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

    udpPort.send({address: '/hello'});
  });

  udpPort.on('message', (msg, timeTag, info) => {
    if (msg.address === '/hello') {
      console.log('UDP registered successfully.');
      sock = openSocket();
    } else {
      Max.outlet(msg.address, ...msg.args);
    }
    // console.log('Got UDP msg:');
    // console.log(msg);
    // console.log(timeTag);
    // // console.log(info);
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
    url: 'wss://' + url + '/ws',
    metadata: true
  });

  socketPort.on('ready', () => {
    console.log('Socket connected. Sending Hello!');
    
    Max.getDict('config').then((dict, err) => {
      if (err) {
        console.log(err);
      } else {
        socketPort.send({
          address: '/hello',
          args: [{
            type: 's',
            value: JSON.stringify(dict.data)
          }]
        });
      }
      console.log(JSON.stringify(dict.data));
    });

    Max.addHandler('update', (address, isActive) => {
      socketPort.send({
        address: '/' + address,
        args: [{ type: isActive ? 'T' : 'F' }]
      });
    });
  });

  socketPort.on('message', (msg, timeTag, info) => {
    if (msg.address === '/hello') {
      console.log('Socket registered successfully');
      Max.outlet('status', true);
    } else {
        console.log('Got Socket msg:', msg);
    }
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
  process.exit();
});

process.on('exit', function(code) {
  cleanup();
});

function cleanUp() {
  console.log('goodbye!');

  udp.close();

  if (sock) {
    sock.send({
      address: '/goodbye'
    });

    sock.close();
  }
  Max.outlet('status', false);
}