const osc = require('osc');

module.exports = function(wss) {
  let udp = new osc.UDPPort({});

  udp.on('ready', () => {
    console.log('Listening for OSC over UDP.');
  });

  udp.on('message', (msg, timeTag, info) => {
    console.log('Got UDP:');
    console.log(msg);
    console.log(timeTag);
    console.log(info);
    console.log('\n');
    // udp.options.remoteAddress = info.address;
    // udp.options.remotePort = info.port;
  });

  udp.on('error', (e) => {
    console.log(e);
  });

  udp.open();


  wss.on('connection', (socket) => {
    console.log('Socket connected.');
    let socketPort = new osc.WebSocketPort({ socket });

    socketPort.on('message', (msg, timeTag, info) => {
      console.log('Got Socket:');
      console.log(msg);
      console.log(timeTag);
      console.log(info);
      console.log('\n');
    });

    // let relay = new osc.Relay(udp, socketPort, { raw: true });
  });
}