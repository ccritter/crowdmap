const osc = require('osc');
const uuidv4 = require('uuid/v4');
const Client = require('../lib/core/Client');

module.exports = function(wss) {
  // Only one client per instance.
  let client;
  let clientTimeout;
  let waitingRoom = [];

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
   * so that the server knows where to send messages.
   *
   * @param msg JSON containing the OSC address and args
   * @param timeTag OSC Timetag of the message
   * @param info Protocol specific message/sender info
   */
  udpPort.on('message', (msg, timeTag, info) => {
    try {
      // if (client && !client.isActive) {
      //   clearTimeout(clientTimeout);
      //   client.remove();
      //   client = undefined;
      // }
      if (msg.address === '/hello' && (!client || !client.isActive)) {
        console.log('Client connected');
        clearTimeout(clientTimeout);
        client = new Client(info.address, info.port, udpPort);

        // If we haven't configured the Client within 5 seconds, disconnect it.
        clientTimeout = setTimeout(() => {
          if (client && !client.isActive) {
            udpPort.send({
              address: '/error',
              args: ['No TCP handshake received.']
            });
            client.remove();
            client = undefined;
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

  setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);


  wss.on('connection', (socket, req) => {
    console.log('Socket connected.');
    socket.isAlive = true;
    socket.on('pong', () => socket.isAlive = true);

    let socketPort = new osc.WebSocketPort({ socket });
    socketPort.id = uuidv4();

    if (client && client.isActive) {
      client.addAudienceMember(socketPort);
    }  else {
      waitingRoom.push(socketPort);
    }

    // socketPort.on('bundle', (bundle, timeTag, info) => {
    //   console.log(bundle)
    // });

    let msgHandler = (msg, timeTag, info) => {
      if (msg.address === '/hello') {
        // Remove the message listener, since the client creates its own message listening function.
        if (client && !client.isConfigured) {
          console.log('Configuring client...', socketPort.id);
          socketPort.removeListener('message', msgHandler);
          let config = JSON.parse(msg.args[0]);
          client.configure(socketPort, config);
          console.log(waitingRoom.map(s => s.id));
          waitingRoom.forEach(sock => {
            if (sock.id !== client.socket.id) {
              client.addAudienceMember(sock);
            }
          });
          waitingRoom = [];
        } else {
          console.log('Configuration attempt without active client or already configured client.');
        }
      } else {
        console.log(msg);
        if (client && client.isActive) {
          client.update(msg, socketPort.id);
        }
      }
    }

    socketPort.on('message', msgHandler);

    socketPort.on('error', e => {
      console.log('Socket Error', e)
    });

    socketPort.on('close', () => {
      if (client && client.isActive) {
        if (socketPort.id === client.socket.id) {
          let crowd = client.remove();
          waitingRoom = waitingRoom.concat(crowd);
          client = undefined;
        } else {
          client.removeAudienceMember(socketPort);
        }
      } else {
        waitingRoom.splice(waitingRoom.findIndex(s => s.id === socketPort.id), 1);
      }
    });

    socketPort.open();
  });
}

