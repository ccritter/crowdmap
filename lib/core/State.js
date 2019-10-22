
class State {
  constructor () {
    // Updated since last output?
    this.didUpdate = false;
    this.mappings = {};
    this.activeAddresses = new Set();
    this.crowdSize = 0;
    this.unassignedSockets = [];
  }

  setAddress(address, aggregator, source) {
    this.mappings[address] = new Mapping(address, aggregator, source);
  }

  getAddress(address) {
    return this.mappings[address];
  }

  setActive(address, isActive) {
    let mapping = this.getAddress(address);
    mapping.isActive = isActive;
    this.reassignRoles(mapping, isActive);
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

  reassignRoles(mapping, isActive) {
    let address = mapping.address;
    let numActiveAddresses = this.activeAddresses.size;
    // let activeAddresses = Object.keys(this.activeMappings);

    if (isActive) {
      // Create the assignment at an address, update newly assigned sockets to send to the given mapping.
      if (numActiveAddresses > 0) {
        // There are existing assignments, so we must pull sockets from other assignments.
        let activeAddressesArr = Array.from(this.activeAddresses);
        for (let i = 0; i < Math.floor(this.crowdSize / (numActiveAddresses + 1)); i++) {
          let curAddress = activeAddressesArr[i % numActiveAddresses];
          let curAddressMapping = this.getAddress(curAddress);
          if (curAddressMapping.size > 0) { // TODO Do we need an else case?
            mapping.addToCrowd(curAddressMapping.removeFromCrowd()); // TODO All instances where we addToCrowd, should we build up a list and use set crowd instead?
          }
        }
      } else {
        // There no assignments, so we make our first one.
        this.unassignedSockets(socket => mapping.addToCrowd(socket));
        this.unassignedSockets = [];
      }

      this.activeMappings.add(address);

    } else {
      // Delete the address, reassign all the sockets that were in it.
      let toReassign = mapping.crowd;
      this.activeAddresses.delete(address);
      numActiveAddresses--; // TODO This assumes that the address was successfully deleted.

      if (numActiveAddresses > 0) {
        let activeAddressesArr = Array.from(this.activeAddresses);
        toReassign.forEach((socket, i) => {
          this.getAddress(activeAddressesArr[i % numActiveAddresses]).addToCrowd(socket);
        });
      } else {
        this.unassignedSockets = this.unassignedSockets.concat(toReassign);
        toReassign.forEach(socket => { socket.send({ address: '/0' }) }); // TODO Address 0 is unassigned
      }

      mapping.clearCrowd();
    }
  }
}


class Mapping {
  constructor (address, aggregator, source) {
    this.address = address;
    this.aggregator = aggregator;
    this.source = source;
    this.size = 0; // TODO May need to rename variable if I ever make a percentage size variable for configuration

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

  addToCrowd(socket) {
    this.size++;

    socket.assignment = this.address;
    socket.send({ address: '/' + address, args: this.source });
  }

  removeFromCrowd(socket) {
    this.size--;

    // TODO If no socket is provided, remove a random (or pop) socket? Return the removed socket?
  }

  set crowd(sockArray) {
    // TODO
    // this.aggregator.setCrowd(sockArray);
    // this.size = sockArray.length;
  }

  get crowd() {
    // TODO
  }

  clearCrowd() {
    this.size = 0;
    // TODO Do something to the agg
  }

}

module.exports = State;