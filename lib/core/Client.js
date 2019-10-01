const osc = require('osc');
const State = require('./State');
const Echoer = require('../aggregators/Echoer');

/*

Client flow:
Send UDP /hello, so the server can recognize an IP address to forward to.
Once server receives the /hello and registers the client, it sends an acknowledgement /hello.
When the UDP ack is received by the client, it sends WS /hello, along with a config.
 - This is an OSC-sring message, where the JSON config is encoded as the string.
 - This outlines all of the endpoints that the Client expects to be receiving on, and what Aggregator type and input source.
Currently, the expected config is: [{address: '/test', type: 'echo', source:'orientation'}] for example

 */
class Client {
  constructor(ip, port, udpPort) {
    this.ip = ip;
    this.port = port;

    // Mutates the given UDP Port instance.
    this.udpPort = udpPort;
    this.udpPort.options.remoteAddress = this.ip;
    this.udpPort.options.remotePort = this.port;
    this.udpPort.send({
      address: '/hello',
      args: 'received'
    });

    this.state = new State();

    this.isActive = false;
  }

  configure(socket, config) {
    this.socket = socket;

    for (let entry of config) {
      let agg;

      // TODO This is where the agg factory would be used.
      switch (entry.type) {
        case 'echo':
          agg = new Echoer(entry.address);
          break;
        default:
          // TODO Send a message to the client that the config was bad.
          console.log('Aggregator type not found.');
      }

      this.state.setAddress(entry.address, agg); // , source); TODO
    }

    // TODO May want to use some other interval function. hrtime?
    this.interval = setInterval(() => {
      if (this.state.didUpdate) {
        this.udpPort.send({
          timeTag: osc.timeTag(0), // TODO Determine if there's any point in scheduling timeTags.
          packets: this.state.toOscData()
        });
      }
    }, 10); // TODO High rate for now to prevent unwanted flooding while testing

    // TODO abstract out client routing (don't do it here, since there could potentially be a lot of lifecycle events/messages)
    this.socket.on('message', (msg, timeTag, info) => {
      if (msg.address === '/goodbye') {
        this.remove();
      } else {
        console.log('Got message from client:', msg);
      }
    });

    this.isActive = true;
  }


  update(message) {
    this.state.update(message.address, message.args);
  }


  remove() {
    console.log('Client disconnected.');
    this.isActive = false;
    clearInterval(this.interval); // TODO make sure an undefined interval doesn't throw any errors. And that a valid interval is actually cleared.
    this.udpPort.options.remoteAddress = undefined;
    this.udpPort.options.remotePort = undefined;
  }

}

module.exports = Client;