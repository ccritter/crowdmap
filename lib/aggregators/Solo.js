const Aggregator = require('./Aggregator');

class Solo extends Aggregator {
  /**
   * TODO Not yet implemented. Eventually will be a solo for one specific actor.
   * @param socketId The ID of the socket who is assigned the solo.
   */
  constructor (socketId) {
    super();
    this.id = socketId;
    this.data = 0;
  }

  insert(data, fromId) {
    if (this.id === fromId) {
      this.data = item;
    }
  }

  toOscData() {
    return [this.data];
  }
}

module.exports = Solo;