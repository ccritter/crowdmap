
class State {
  constructor () {
    // Updated since last output?
    this.didUpdate = false;
    this.data = {}
    // When state updates, track what endpoints have changed
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
  update(address, data) {
    try {
      // TODO Account for msgs that might have more than one arg.
      this.getAddress(address).input(data[0]);
      this.didUpdate = true;
    } catch (e) {
      // Likely a keyerror
      console.log(e);
    }
  }

  toOscData() {
    this.didUpdate = false;
    return Object.keys(this.data).reduce((acc, address) => {
      let mapping = this.state.getAddress(address);
      if (mapping.didUpdate) {
        acc.push(mapping.toOscData());
      }
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

  input(data) {
    this.aggregator.insert(data);
    this.didUpdate = true;
  }

  toOscData() {
    this.didUpdate = false;
    return { address: this.address, args: this.aggregator.toOscData() }
  }

}


module.exports = State;