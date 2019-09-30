const osc = require('osc');
const Echoer = require('../aggregators/Echoer');

/*

Client flow:
Send UDP /hello, so the server can recognize an IP address to forward to.
Once server receives the /hello and registers the client, it sends an acknowledgement /hello.
When the UDP ack is received by the client, it sends WS /hello, along with a config.
 - This is not an OSC message, and will need to be caught .on('raw').
TODO: Come up with the spec of the config. For example {"name1":{"type":aggregator, "source":userinputsource}, "name2":...}

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

    /*
    Tracking state:
    each item is given a name (or maybe the address??) (the key) and an aggregator (the value).
    Or maybe just a list of aggregators who know their own names?
     */
    this.state = {} // TODO Create some state from the given config.

    this.isActive = false;
  }

  configure(socket, config) {
    this.socket = socket;

    for ([address, conf] of Object.entries(config)) {
      let agg;
      switch (conf.type) {
        case 'echo':
          agg = new Echoer(address);
          break;
        default:
          console.log('Aggregator type not found.');
          // TODO Send a message to the client that the config was bad.
      }

      // TODO Do something with the conf.source, eventually.
      this.state[address] = agg;
    }

    // TODO May want to use some other interval function. hrtime?
    this.interval = setInterval(() => {
      // TODO Check if app state has changed/Only send values that have changed?
      // TODO If a client disconnects in between intervals, it may try to still send it (and fail)
      this.udpPort.send({
        timeTag: osc.timeTag(0), // TODO Determine if there's any point in scheduling timeTags.
        packets: Object.keys(this.state).map(name => this.state[name].toOscData()) // TODO Abstract functionality into some sort of State class method like toOscBundle()
      });
    }, 1000); // TODO High rate for now to prevent unwanted flooding while testing

    // TODO Recreate the socket's on.('message') listener to accommodate the configuration.

    this.isActive = true;
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