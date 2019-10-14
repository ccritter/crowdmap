
// TODO This observer pattern is a test. It may be pretty space inefficient.
/**
 * Represents the total section of people connected as the audience. At any given point in the composition, the
 * Audience will be divided up into sections.
 */
class Audience {
  constructor () {
    this.crowd = {};
    // Mapping of Address to array of Sockets TODO Do we need to store a list? Can it just be stored as a socket's attribute?
    this.assignments = {};
    this.observers = [];
  }

  addMember(socket) {
    this.crowd[socket.id] = socket;
  }

  removeMember(id) {
    delete this.crowd[id];

    // Only need to notify if members are removed, because current aggregators handle their own data when it's received.
    // TODO
    this.observers.forEach(obs => obs.remove(undefined, id));
  }

  reassignRoles(address, isActive) {
    let addresses = Object.keys(this.assignments);
    let updateSocket = (socket, address, srcType) => {
      socket.send({
        address: '/' + address,
        args: [`whatever the source at ${curAddress} is`]
      });
    }

    if (isActive) {
      // Create the assignment at an address,
      let newAssignments = [];
      for (let i = 0; i < Math.floor(this.size() / (addresses.length + 1)); i++) {
        let curAddress = addresses[i % addresses.length];
        let socket = this.assignments[curAddress].pop();
        newAssignments.push(); // TODO May break if the current address is empty already
        updateSocket(socket, curAddress, srcType);
      }

      this.assignments[address] = newAssignments;
    } else {
      // Delete the address, reassign all the sockets that were in it.
      let toReassign = this.assignments[address];
      delete this.assignments[address];

      toReassign.forEach((socket, i) => {
        let curAddress = addresses[i % addresses.length];
        this.assignments[curAddress].push(socket);
        // Client receives an address and a source type to send to it
        updateSocket(socket, curAddress, srcType);
      });
    }
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    const removeIndex = this.observers.findIndex(obs => observer === obs);

    if (removeIndex !== -1) {
      this.observers = this.observers.slice(removeIndex, 1);
    }
  }

  notifyObservers() {
    // this.observers.forEach(obs => observer.update)
  }

  size() {
    return Object.keys(this.crowd).length
  }
}

module.exports = Audience;