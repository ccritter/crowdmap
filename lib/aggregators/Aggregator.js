const sourceFactory = require('./SourceFactory').sourceFactory;

/**
 * Generic aggregator interface for defining expected functionality.
 */
class Aggregator {
  constructor (sourceType) {
    this.crowd = [];
    this.normalize = sourceFactory(sourceType);
  }

  insert(data, fromId) {
    // Class method that puts an item into the Aggregator. fromId is optional in subclasses
    console.log('nope');
  }

  /**
   * For aggregators that rely on knowing who in the audience is sending data, this function is overridden in subclass.
   * @param socketArr array of sockets that are submitting to this aggregator.
   */
  setCrowd(socketArr) {

  }

  push(socket) {
    this.crowd.push(socket);
  }

  pop(socket) {
    if (socket) {
      let sockIdx = this.crowd.findIndex(sock => sock.id === socket.id);

      if (sockIdx >= 0) {
        this.crowd.splice(sockIdx, 1);
      } else {
        throw 'Socket not found in assigned array.';
      }

      return socket;
    } else {
      return this.crowd.pop()
    }
  }

  /**
   * Produces the list of data that would be supplied to the 'args' part of an OSC message
   *
   * @param args
   * @returns Array
   */
  toOscData() {
    return []
  }

  size() {
    return this.crowd.length;
  }

  clearCrowd() {
    this.crowd = [];
  }
}

module.exports = Aggregator;