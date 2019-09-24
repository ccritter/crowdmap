const osc = require('osc');

module.exports = function(wss) {
  let udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: 57121
  });

  udpPort.on('ready', () => {
    console.log('Listening for OSC over UDP.');
  });

  udpPort.on('message', (msg, timeTag, info) => {
    try {
      if (msg.address === '/hello') {
        // TODO The last client is the only client that gets messages as of now
        udpPort.options.remoteAddress = info.address;
        udpPort.options.remotePort = info.port;

        udpPort.send({
          address: '/hello',
          args: 'received'
        });
      }
    } catch (e) {
      console.log(e);
    }
    console.log('Got UDP:');
    console.log(msg);
    console.log(timeTag);
    console.log('');
  });

  udpPort.on('error', (e) => {
    console.log(e);
  });

  udpPort.open();


  wss.on('connection', (socket, req) => {
    console.log('Socket connected.');
    let socketPort = new osc.WebSocketPort({ socket });

    socketPort.on('message', (msg, timeTag, info) => {
      try {
        if (msg.address === '/hello') {
          // let addr = req.headers['x-forwarded-for'] || socket._socket.remoteAddress
          // addr = addr.split(',')[0]
          // console.log(addr);

        } else {
          let relay = new osc.Relay(udpPort, socketPort, { raw: true }); // TODO Eventually pass in the socketport into some UDP class that can then handle the relay?
        }
      } catch (e) {
        console.log(e)
      }

      console.log('Got Socket:');
      console.log(msg);
      console.log(timeTag);
      console.log('');
    });
  });
}