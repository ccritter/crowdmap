const Mapping = require('./Mapping');

class State {
  constructor () {
    // Updated since last output?
    this.didUpdate = false;
    this.mappings = {};
    this.activeAddresses = new Set();
    this.crowdSize = 0;
    this.unassignedSockets = [];
  }

  setAddress(address, aggregator, source, prompt) {
    this.mappings[address] = new Mapping(address, aggregator, source, prompt);
  }

  getAddress(address) {
    return this.mappings[address];
  }

  setActive(address, isActive) {
    let mapping = this.getAddress(address);
    if (mapping) {
      mapping.isActive = isActive;
      if (isActive) {
        this.reassignRoles(mapping, isActive);
        this.activeAddresses.add(address);
      } else {
        this.activeAddresses.delete(address);
        this.reassignRoles(mapping, isActive);
      }
    } else {
      console.log(`Address ${address} not found`); // TODO Notify user.
    }
  }

  /**
   *
   * @param address string address of data input
   * @param data list of OSC data
   * @param fromId UUID of the sender
   */
  update(address, data, fromId) {
    try {
      let mapping = this.getAddress(address);
      if (mapping.isActive) {
        mapping.input(data, fromId);
        this.didUpdate = true;
      }
    } catch (e) {
      // Likely a keyerror
      console.log(e);
    }
  }

  toOscData() {
    this.didUpdate = false;
    return Array.from(this.activeAddresses).reduce((acc, address) => {
      let mapping = this.getAddress(address);
      if (mapping.didUpdate) {
        acc.push(mapping.toOscData());
      }
      return acc;
    }, []);
  }

  addSocket(socket) {
    this.crowdSize++;

    // let addresses = Object.keys(this.assignments);
    if (this.activeAddresses.size > 0) {
      let smallestMapping;
      this.activeAddresses.forEach(a => {
        let thisMapping = this.getAddress(a);
        if (!smallestMapping || thisMapping.crowdSize() < smallestMapping.crowdSize()) {
          smallestMapping = thisMapping;
        }
      });
      smallestMapping.addToCrowd(socket);
    } else {
      this.unassignedSockets.push(socket);
      socket.assignment = undefined; // TODO Undefined, or 0? even necessary?
    }
  }

  removeSocket(socket) {
    this.crowdSize--;
    let location = socket.assignment;

    if (location) {
      this.getAddress(location).removeFromCrowd(socket);
    }
  }

  /**
   * TODO. Assumes the mapping has been removed from the activeAddresses prior to invocation if inactive, or added to
   * activeAddresses after invocation.
   *
   * @param mapping
   * @param isActive
   */
  reassignRoles(mapping, isActive) {
    let numActiveAddresses = this.activeAddresses.size;

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
        this.unassignedSockets.forEach(socket => mapping.addToCrowd(socket));
        this.unassignedSockets = [];
      }
    } else {
      // Reassign all the sockets that were in the deleted mapping.
      let toReassign = mapping.crowd;

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

module.exports = State;