const osc = require('osc');
const uuidv4 = require('uuid/v4');
// const oscRouter = require('lib/osc-routers');
const Client = require('./lib/core/Client');

module.exports = function(wss) {
  // Only one client per instance.
  let client;

  /**
   * Stateful UDPPort instance. Will be our primary interface for sending data to the Max client.
   * Stores remote Client info in its options.
   * @type {UDPPort}
   */
  let udpPort = new osc.UDPPort({
    localAddress: '0.0.0.0',
    localPort: 57121
  });

  /**
   * Not particularly necessary, just convenient to see when we're ready.
   */
  udpPort.on('ready', () => {
    console.log('Listening for OSC over UDP.');
  });

  /**
   * Handler for UDP messages. The only UDP messages the server receives is a /hello message from the client
   * so that the server knows where to send messages. TODO: Create a non UDP-mode as a failsafe (only WebSocket)
   *
   * @param msg JSON containing the OSC address and args
   * @param timeTag OSC Timetag of the message
   * @param info Protocol specific message/sender info
   */
  udpPort.on('message', (msg, timeTag, info) => {
    try {
      if (msg.address === '/hello') {
        client = new Client(info.address, info.port, udpPort);

        // If we haven't configured the Client within 5 seconds disconnect it.
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
    // TODO Do I need to check that it's unique?
    socket.id = uuidv4();
    let socketPort = new osc.WebSocketPort({ socket });
    // TODO If no client connected, put them in some sort of holding area?
    if (client) {
      client.addAudienceMember(socket);
    }

    // socketPort.on('bundle', (bundle, timeTag, info) => {
    //   console.log(bundle)
    // });

    let msgHandler = (msg, timeTag, info) => {
      // console.log('Got Socket message.', msg);
      if (msg.address === '/hello') {
        // Remove the message listener, since the client creates its own message listening function.
        // TODO Will error out if a /hello is sent with no client (maybe by some malicious audience)
        socketPort.removeListener('message', msgHandler);
        let config = JSON.parse(msg.args[0]);
        client.configure(socketPort, config);
        client.removeAudienceMember(socket); // Remove the client's own socket.
      } else {
        if (client && client.isActive) {
          client.update(msg, socket.id); // TODO pass in timetag?
        }
      }
    }

    socketPort.on('message', msgHandler);

    socketPort.on('error', e => {
      console.log('Socket Error', e)
    });

    socket.on('close', () => {
      // TODO Need to check heartbeat for terminated connections as well: https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
      // TODO Do this better. This is ugly and not encapsulated.
      if (client) {
        client.removeAudienceMember(socket);
      }
    });

    socketPort.open();
  });
}

