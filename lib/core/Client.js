const osc = require('osc');
const State = require('./State');
const Audience = require('./Audience');
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
    this.udpPort.send({
      address: '/hello',
      args: 'received'
    });

    this.state = new State();
    this.audience = new Audience();

    this.isActive = false;
    this.isConfigured = false;
  }

  configure(socket, config) {
    this.socket = socket;

    for (let entry of config) {
      try {
        let agg = aggFactory(entry.aggType);
        this.state.setAddress(entry.address.substring(1), agg, entry.source); TODO
        this.audience.addObserver(agg);
      } catch (e) {
        socket.send({
          address: '/error',
          args: 'Error parsing config.'
        });
        console.log(e);
      }
    }

    // TODO May want to use some other interval function. hrtime?
    this.interval = setInterval(() => {
      if (this.state.didUpdate) {
        this.udpPort.send({
          timeTag: osc.timeTag(0), // TODO Determine if there's any point in scheduling timeTags.
          packets: this.state.toOscData()
        });
      }
    }, 10);

    this.socket.on('message', (msg, timeTag, info) => {
      if (msg.address === '/goodbye') {
        this.remove();
      } else {
        // All other messages from the client would be in the format { address: '/i', args: [bool] }
        console.log('Got message from client:', msg);
        let address = msg.address.substring(1);
        let isActive = msg.args[0];
        this.state.setActive(address, isActive);
        this.audience.reassignRoles(address, isActive);
      }
    });

    this.isActive = true;
    this.isConfigured = true;
  }


  update(message, fromId) {
    this.state.update(message.address.substring(1), message.args, fromId);
  }

  addAudienceMember(socket) {
    // TODO also assign a current group, round robin style?
    this.audience.addMember(socket);
  }

  removeAudienceMember(socket) {
    this.audience.removeMember(socket);
  }

  remove() {
    console.log('Client disconnected.');
    this.isActive = false;
    clearInterval(this.interval);
    this.udpPort.options.remoteAddress = undefined;
    this.udpPort.options.remotePort = undefined;
    // TODO Unassign everyone in audience
  }

}

module.exports = Client;