
// TODO This observer pattern is a test. It may be pretty space inefficient.
/**
 * Represents the total section of people connected as the audience. At any given point in the composition, the
 * Audience will be divided up into sections.
 */
class Audience {
  constructor () {
    this.size = 0
    // Mapping of Address to array of Sockets
    this.assignments = {};
    this.unassigned = [];
    this.observers = [];
  }

  addMember(socket) {
    this.size++;

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

  reassignRoles(mapping, isActive) {
    // TODO The logic with pushing to an array that's given to the mapping may be flawed. Since the mapping agg does various things with the given sockets, adding a new one after initialization may not work as expected
    let address = mapping.address;
    let addresses = Object.keys(this.assignments);

    // console.log(this.assignments);
    let updateSocket = (socket, address) => {
      socket.assignment = address;
      socket.send({ address: '/' + address, args: mapping.source }); // TODO MAPPING SOURCE DOESN'T WORK IN THIS WAY. BROKEN!!!!! since for the isactive=false case, we need to know other sources.
    }

    if (isActive) {
      // Create the assignment at an address, update newly assigned sockets to send to the given mapping.
      let newAssignments;

      if (addresses.length > 0) {
        // There are existing assignments, so we must pull sockets from other assignments.
        newAssignments = [];

        for (let i = 0; i < Math.floor(this.size / (addresses.length + 1)); i++) {
          let curAddress = addresses[i % addresses.length];
          let curAddressAssignments = this.assignments[curAddress];
          if (curAddressAssignments.length > 0) { // TODO Do we need an else case?
            newAssignments.push(curAddressAssignments.pop());
          }
        }
      } else {
        // There no assignments, so we make our first one.
        newAssignments = [...this.unassigned];
        this.unassigned = [];
      }

      this.assignments[address] = newAssignments;
      mapping.crowd = newAssignments;
      newAssignments.forEach(socket => updateSocket(socket, address));

    } else {
      // Delete the address, reassign all the sockets that were in it.
      let toReassign = this.assignments[address];

      if (addresses.length > 1) {
        toReassign.forEach((socket, i) => {
          let curAddress = addresses[i % addresses.length];
          this.assignments[curAddress].push(socket);
          updateSocket(socket, curAddress) //, srcType);
        });
      } else {
        this.unassigned = this.unassigned.concat(toReassign);
        toReassign.forEach(socket => { updateSocket(socket, 0); });//, ''); }); // TODO Address 0 is unassigned
      }

      delete this.assignments[address];
      mapping.crowd = undefined;
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
}

module.exports = Audience;