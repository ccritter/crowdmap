const osc = require('osc');

module.exports = function(wss) {
  let udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: 57121
  });

  udpPort.on('ready', () => {
    console.log('Listening for OSC over UDP.');

    // udpPort.send({
    //   address: "/hello",
    //   args: ['world']
    // }, "www.crowdmap.fm", 57121);
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


  wss.on('connection', (socket, req) => {
    console.log('Socket connected.');
    let socketPort = new osc.WebSocketPort({ socket });

    socketPort.on('message', (msg, timeTag, info) => {
      try {
        if (msg.address === '/is_client' && msg.args[0]) {
          let addr = req.headers['x-forwarded-for'] || socket._socket.remoteAddress
          addr = addr.split(',')[0]
          console.log(addr);

          // let relay = new osc.Relay(udp, socketPort, { raw: true });
          udpPort.send({
            address: "/hello",
            args: ['world']
          }, addr, 57121);
        }
      } catch (e) {
        print(e)
      }


      console.log('Got Socket:');
      console.log(msg);
      console.log(timeTag);
      // console.log(info);
      console.log('\n');


    });
  });
}