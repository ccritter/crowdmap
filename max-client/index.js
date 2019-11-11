const osc = require("osc");
const WebSocket = require('ws');

// const url = 'crowdmap.fm';
const url = 'localhost';
const port = 57121

let interval;

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
      console.log('Client registered successfully.');
      sock = openSocket();
    } else {
      console.log('Got UDP msg:', msg);
    }
  });

  udpPort.on('error', e => {
    console.log(e);
  });

  udpPort.open();

  return udpPort;
}

function openSocket() {
  let socketPort = new osc.WebSocketPort({
    url: 'ws://' + url + ':3000/ws',
    // url: 'wss://' + url + '/ws',
    metadata: true
  });

  socketPort.on('ready', () => {
    console.log('Socket connected. Sending Hello!');

    socketPort.send({
      address: '/hello',
      args: [{
        type: 's',
        value: JSON.stringify([
          {address: 1, aggType: 2, source: 1, prompt: 'Test'},
          // {address: 2, aggType: 2, source: 2, prompt: 'Helloooooo'},
          // {address: 3, aggType: 3, source: 3, prompt: '*'}
        ])
      }]
    });


    let bool = 0;
    interval = setInterval(() => {
      bool = bool ? 0 : 1;
      socketPort.send({
        address: '/1',
        args: [{ type: bool ? 'T' : 'F' }]
      });
    }, 1000);
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
  clearInterval(interval);
  udp.close();

  if (sock) {
    sock.send({address: '/goodbye'});

    sock.close();
  }
});