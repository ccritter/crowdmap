const osc = require('osc');
// const oscRouter = require('lib/osc-routers');
const Client = require('./lib/core/Client');

module.exports = function(wss) {
  // Only one client per instance. If I were to add more, I need to establish a reliable way for clients to be removed from the list (or maybe a map?)
  let client;

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
        client = new Client(info.address, info.port, udpPort); // TODO Get some sort of state config from the client

        // If we haven't configured the Client within 5 seconds (change this time?) disconnect it.
        setTimeout(() => {
          if (!client.isActive) {
            // TODO Let client know that it needs the TCP hello as well.
            client.remove();
          }
        }, 5000);
      }
    } catch (e) {
      console.log(e);
    }
  });

  udpPort.on('error', e => {
    console.log('UDP Error', e);
  });

  udpPort.open();


  wss.on('connection', (socket, req) => {
    console.log('Socket connected.');
    let socketPort = new osc.WebSocketPort({ socket });
    // let relay = new osc.Relay(udpPort, socketPort, { raw: true }); // TODO Eventually pass in the socketport into some UDP class that can then handle the relay?

    // socketPort.on('bundle', (bundle, timeTag, info) => {
    //   console.log(bundle)
    // });

    socketPort.on('message', (msg, timeTag, info) => {
      console.log('Got Socket message.', msg);
      if (msg.address === '/hello') {
        let config = JSON.parse(msg.args[0]);
        client.configure(socketPort, config);
      } else if (msg.address === '/goodbye') {
        client.remove();
      } else {
        if (client && client.isActive) {
          client.update(msg); // TODO pass in timetag?
        }
      }
    });

    socketPort.on('error', e => {
      console.log('Socket Error', e)
    });

    socketPort.open();
  });
}

