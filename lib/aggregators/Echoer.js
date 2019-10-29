const Aggregator = require('./Aggregator');

/**
 * Generic aggregator. Echoes the last given value when accessed.
 */
class Echoer extends Aggregator {
  constructor () {
    super();
    this.val = 0;
  }

  insert(data, fromId) {
    this.val = item;
  }

  toOscData() {
    return [this.val];
  }
}

module.exports = Echoer;