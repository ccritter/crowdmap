
class State {
  constructor () {
    // Updated since last output?
    this.didUpdate = false;
    this.mappings = {}
  }

  setAddress(address, aggregator, source) {
    this.mappings[address] = new Mapping(address, aggregator, source);
  }

  getAddress(address) {
    return this.mappings[address];
  }

  setActive(address, isActive) {
    this.getAddress(address).isActive = isActive;
  }

  getActive() {
    // TODO This is pretty inefficient, but it may be ok.
    return Object.values(this.mappings).filter(mapping => mapping.isActive);
  }

  /**
   *
   * @param address string address of data input
   * @param data list of OSC data
   * @param fromId UUID of the sender
   */
  update(address, data, fromId) {
    try {
      // TODO Account for msgs that might have more than one arg.
      if (address.isActive) {
        this.getAddress(address).input(data[0], fromId);
        this.didUpdate = true;
      }
    } catch (e) {
      // Likely a keyerror
      console.log(e);
    }
  }

  toOscData() {
    this.didUpdate = false;
    // return Object.keys(this.mappings).reduce((acc, address) => {
    return Object.values(this.mappings).reduce((acc, mapping) => {
      // let mapping = this.getAddress(address);
      if (mapping.isActive && mapping.didUpdate) {
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

    this.isActive = false;
    this.didUpdate = false;
  }

  input(data, fromId) {
    this.aggregator.insert(data, fromId);
    this.didUpdate = true;
  }

  toOscData() {
    this.didUpdate = false;
    return { address: '/' + this.address, args: this.aggregator.toOscData() }
  }

}


module.exports = State;