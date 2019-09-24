const osc = require("osc");
const WebSocket = require('ws');

function openUdp(socketPort) {
  let udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: 57121
  });

  udpPort.on('ready', () => {
    console.log('Listening for OSC over UDP. Sending Hello!');

    socketPort.send({
      address: '/is_client',
      args: [{
        type: 'i',
        value: 1
      }]
    });
  });

  udpPort.on('message', (msg, timeTag, info) => {
    console.log('Got UDP:');
    console.log(msg);
    console.log(timeTag);
    console.log(info);
    console.log('\n');
    // udp.options.remoteAddress = info.address;
    // udp.options.remotePort = info.port;
    // udpPort.send({
    //   address: '/hello',
    //   args: 'received'
    // }, info.address, info.port);
  });

  udpPort.open();

  return udpPort;
}

function openSocket() {
  let socketPort = new osc.WebSocketPort({
    url: 'ws://www.crowdmap.fm',
    metadata: true
  });

  socketPort.on('ready', () => {
    console.log('Socket connected.');
    openUdp(socketPort);
  });

  socketPort.on('message', (msg, timeTag, info) => {
    console.log('Got Socket:');
    console.log(msg);
    console.log(timeTag);
    console.log(info);
    console.log('\n');
  });

  socketPort.open();
}


openSocket();