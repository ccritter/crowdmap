const osc = require('osc');

module.exports = function(wss) {
  let udpPort = new osc.UDPPort({
    // localAddress: '0.0.0.0',
    localPort: 57110
  });

  udpPort.on('ready', () => {
    console.log('Listening for OSC over UDP.');

    // udpPort.send({
    //   address: "/hello",
    //   args: ['world']
    // }, "www.crowdmap.fm", 57110);
  });

  udpPort.on('message', (msg, timeTag, info) => {
    console.log('Got UDP:');
    console.log(msg);
    console.log(timeTag);
    console.log(info);
    console.log('\n');
    // udp.options.remoteAddress = info.address;
    // udp.options.remotePort = info.port;
    udpPort.send({
      address: '/hello',
      args: 'received'
    }, info.address, info.port);
  });

  udpPort.on('error', (e) => {
    console.log(e);
  });

  udpPort.open();


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