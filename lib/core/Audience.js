
// TODO This observer pattern is a test. It may be pretty space inefficient.
/**
 * Represents the total section of people connected as the audience. At any given point in the composition, the
 * Audience will be divided up into sections.
 */
class Audience {
  constructor () {
    // TODO: is the crowd necessary, or can I just store a count?
    // this.crowd = {};
    this.size = 0
    // Mapping of Address to array of Sockets TODO Do we need to store a list? Can it just be stored as a socket's attribute?
    this.assignments = {};
    this.unassigned = [];
    this.observers = [];
  }

  addMember(socket) {
    this.size++;
    // this.crowd[socket.id] = socket;
    let addresses = Object.keys(this.assignments);
    if (addresses.length > 0) {
      let smallestGroup;
      addresses.forEach(a => {
        if (!smallestGroup || this.assignments[a].length < this.assignments[smallestGroup].length) {
          smallestGroup = a;
        }
      });
      this.assignments[smallestGroup].push(socket);
      socket.assignment = smallestGroup;
    } else {
      this.unassigned.push(socket);
      socket.assignment = undefined; // TODO Undefined, or 0?
    }
  }

  removeMember(socket) {
    this.size--;
    // delete this.crowd[id];
    let location = socket.assignment;

    if (location) {
      let arr = this.assignments[location];
      let sockIdx = arr.findIndex(sock => sock.id === socket.id);

      if (sockIdx > 0) {
        arr.splice(sockIdx, 1);
      } else {
        throw 'Socket not found in assigned array.';
      }
    }

    // Only need to notify if members are removed, because current aggregators handle their own data when it's received.
    // TODO
    this.observers.forEach(obs => obs.remove(undefined, id));
  }

  reassignRoles(address, isActive) {
    let addresses = Object.keys(this.assignments);
    // console.log(this.assignments);
    let updateSocket = (socket, address, srcType) => {
      // console.log(address);
      socket.send({
        address: '/' + address,
        args: [`whatever the source at ${address} is`]
      });
    }

    if (isActive) {
      // Create the assignment at an address,
      if (addresses.length > 0) {
        let newAssignments = [];
        for (let i = 0; i < Math.floor(this.size / (addresses.length + 1)); i++) {
          let curAddress = addresses[i % addresses.length];
          // console.log(curAddress);
          let socket = this.assignments[curAddress].pop();
          newAssignments.push(); // TODO May break if the current address is empty already
          updateSocket(socket, curAddress, srcType);
        }

        this.assignments[address] = newAssignments;
      } else {
        this.assignments[address] = [...this.unassigned]
        this.unassigned.forEach(socket => {
          updateSocket(socket, address) //, srcType);
        });
        this.unassigned = [];
      }
    } else {
      // Delete the address, reassign all the sockets that were in it.
      let toReassign = this.assignments[address];
      delete this.assignments[address];
      // console.log(toReassign);

      if (addresses.length > 1) {
        toReassign.forEach((socket, i) => {
          let curAddress = addresses[i % addresses.length];
          // console.log(curAddress);

          this.assignments[curAddress].push(socket);
          // Client receives an address and a source type to send to it
          updateSocket(socket, curAddress) //, srcType);
        });
      } else {
        toReassign.forEach(socket => { updateSocket(socket, 0); });//, ''); }); // TODO Address 0 is unassigned
        this.unassigned = this.unassigned.concat(toReassign);
      }
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

  // size() {
  //   return Object.keys(this.crowd).length
  // }
}

module.exports = Audience;