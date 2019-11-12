const SourceType = require('./SourceFactory');

/**
 * Generic aggregator interface for defining expected functionality.
 */
class Aggregator {
  constructor (sourceType) {
    this.crowd = [];
    this.sourceType = sourceType;
    switch (this.sourceType) {
      // case SourceType.rest:
      //   break;
      case SourceType.tap:
        this.insert = this.insertTap;
        break;
      case SourceType.text:
        this.insert = this.insertText;
        break;
      case SourceType.orient:
      case SourceType.orienta:
      case SourceType.orientb:
      case SourceType.orientg:
        this.insert = this.insertOrient;
        break;
      case SourceType.accel:
        this.insert = this.insertAccel;
        break;
      // case SourceType.text:
      //   this.insert = this.insertText;
      //   break;
      default:
        break;
    }
  }

  // insert(data, fromId) {
  //   // Class method that puts an item into the Aggregator. fromId is optional in subclasses
  //   console.log('nope');
  // }

  insertTap(data, fromId) {

  }

  insertText(data, fromId) {

  }

  insertOrient(data, fromId) {

  }

  insertAccel(data, fromId) {

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

      if (sockIdx > 0) {
        this.crowd.splice(sockIdx, 1);
      } else {
        // TODO This can sometimes get hit. I believe this would be fixed by moving connected sockets back into waiting room when client disconnects
        /*
        1. Client connects
        2. Web connects
        3. Client disconnects
        4. Client reconnects
        4. Web disconnects
         */
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