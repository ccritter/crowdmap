const Audience = require('./Audience');

class State {
  constructor () {
    // Updated since last output?
    this.didUpdate = false;
    this.data = {}
    this.audience = new Audience();
  }

  setAddress(address, aggregator, source) {
    this.data[address] = new Mapping(address, aggregator, source);
  }

  getAddress(address) {
    return this.data[address];
  }

  /**
   *
   * @param address string address of data input
   * @param data list of OSC data
   */
  update(address, data, fromId) {
    try {
      // TODO Account for msgs that might have more than one arg.
      this.getAddress(address).input(data[0], fromId);
      this.didUpdate = true;
    } catch (e) {
      // Likely a keyerror
      console.log(e);
    }
  }

  toOscData() {
    this.didUpdate = false;
    return Object.keys(this.data).reduce((acc, address) => {
      let mapping = this.getAddress(address);
      if (mapping.didUpdate) {
        acc.push(mapping.toOscData());
      }
      return acc;
    }, []);
  }

}


class Mapping {
  constructor (address, aggregator, source) {
    this.address = address;
    this.aggregator = aggregator;
    this.source = source;

    this.didUpdate = false;
  }

  input(data, fromId) {
    this.aggregator.insert(data, fromId);
    this.didUpdate = true;
  }

  toOscData() {
    this.didUpdate = false;
    return { address: this.address, args: this.aggregator.toOscData() }
  }

}


module.exports = State;