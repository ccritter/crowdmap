const osc = require('osc');
const State = require('./State');
const aggFactory = require('../aggregators/AggFactory').aggFactory;

/*

Client flow:
Send UDP /hello, so the server can recognize an IP address to forward to.
Once server receives the /hello and registers the client, it sends an acknowledgement /hello.
When the UDP ack is received by the client, it sends WS /hello, along with a config.
 - This is an OSC-sring message, where the JSON config is encoded as the string.
 - This outlines all of the endpoints that the Client expects to be receiving on, and what Aggregator type and input source.
Currently, the expected config is: [{address: '/test', type: 'echo', source:'orientation'}] for example TODO maybe include a size component to determine how much of the audience is grouped into it? 0% wuold be a solo?

 */
class Client {
  constructor(ip, port, udpPort) {
    this.ip = ip;
    this.port = port;

    // Mutates the given UDP Port instance.
    this.udpPort = udpPort;
    this.udpPort.options.remoteAddress = this.ip;
    this.udpPort.options.remotePort = this.port;
    this.udpPort.send({ address: '/hello', args: 'received' });

    this.state = new State();

    this.isActive = false;
    this.isConfigured = false;
  }

  configure(socket, config) {
    this.socket = socket;
    let configError = false;

    for (let entry of config) {
      try {
        let address = entry.address;
        let aggType = entry.aggType;
        let source = entry.sourceType;
        let prompt = entry.prompt === '*' ? 'No prompt given' : entry.prompt; // TODO Change from 'No prompt given' to a way to indicate showing a "default prompt" on the client side (move your device, for example)

        if (!(Number.isInteger(address) && Number.isInteger(aggType) && Number.isInteger(source) && typeof prompt === 'string')) {
          console.log(entry);
          throw 'Unexpected config data type received.'
        } else {
          let agg = aggFactory(aggType, source);
          this.state.setAddress(address, agg, source, prompt);
        }
      } catch (e) {
        socket.send({ address: '/error', args: 'Error parsing config.' });
        configError = true;
        console.log(e);
        break;
      }
    }

    if (!configError) {
      this.socket.send({address: '/hello', args: 'received'});

      // TODO May want to use some other interval function. hrtime?
      this.interval = setInterval(() => {
        if (this.state.didUpdate) {
          this.udpPort.send({
            timeTag: osc.timeTag(0),
            packets: this.state.toOscData()
          });
        }
      }, 10);

      this.socket.on('message', (msg, timeTag, info) => {
        if (msg.address === '/goodbye') {
          // this.remove();
        } else {
          // All other messages from the client would be in the format { address: '/i', args: [bool] }
          console.log('Got message from client:', msg);

          let address = msg.address.substring(1);
          let isActive = msg.args[0];
          if (isNaN(address) || typeof isActive !== 'boolean') {
            this.socket.send({address: '/error', args: 'Invalid activation message received.'});
          } else {
            this.state.setActive(address, isActive);
            // this.audience.reassignRoles(this.state.getAddress(address), isActive);
          }
        }
      });

      this.isActive = true;
      this.isConfigured = true;
    }
  }

  update(message, fromId) {
    this.state.update(message.address.substring(1), message.args, fromId);
  }

  addAudienceMember(socket) {
    this.state.addSocket(socket);
  }

  removeAudienceMember(socket) {
    this.state.removeSocket(socket);
  }

  remove() {
    console.log('Client disconnected.');
    let crowd = this.state.crowd;
    crowd.forEach(socket => {
      socket.assignment = undefined;
      socket.send({ address: '/0' });
    });
    this.isActive = false;
    clearInterval(this.interval);
    this.udpPort.options.remoteAddress = undefined;
    this.udpPort.options.remotePort = undefined;
    return crowd;
  }

}

module.exports = Client;