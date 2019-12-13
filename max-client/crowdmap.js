const osc = require("osc");
const Max = require('max-api');

const url = 'crowdmap.fm';
// const url = 'localhost';
const port = 57121

let udp;
let sock;
let dictName;

Max.addHandler('dictname', name => {
  console.log('test')
  dictName = name;
  udp = openUdp();
});

function openUdp() {
  let attempts = 0;
  let retry;

  let udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: 57122, // port,
    remoteAddress: url,
    remotePort: port
  });

  udpPort.on('ready', () => {
    console.log('UDP Ready. Sending Hello!');
    retry = setInterval(() => {
      attempts++;
      console.log('Login attempt ' + attempts)
      udpPort.send({address: '/hello'});
    }, 1000);
  });

  udpPort.on('message', (msg, timeTag, info) => {
    if (msg.address === '/hello') {
      console.log('UDP registered successfully.');
      clearInterval(retry);
      sock = openSocket();
    } else {
      Max.outlet(msg.address, ...msg.args);
      console.log(msg);
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
    // url: 'ws://' + url + ':3000/ws',
    url: 'wss://' + url + '/ws',
    metadata: true
  });

  socketPort.on('ready', () => {
    console.log('Socket connected. Sending Hello!');
    Max.getDict(dictName).then((dict, err) => {
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
      // TODO Eventually put errors into an outlet and display it on the Live device
      console.log('Got Socket msg:', msg);
    }
  });

  socketPort.on('error', e => {
    console.log(e);
  });

  socketPort.open();

  return socketPort;
}

['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'SIGTERM'].forEach(eventType => {
  process.on(eventType, cleanUp.bind(null, eventType));
});

function cleanUp(type) {
  console.log(type + 'goodbye!');

  udp.close();

  if (sock) {
    sock.send({
      address: '/goodbye'
    });

    sock.close();
  }
  Max.outlet('status', false);
}
