const Aggregator = require('./Aggregator');

/**
 * Generic aggregator. Echoes the last given value when accessed.
 */
class Echoer extends Aggregator {
  constructor (address) {
    super(address)
    this.val = 0;
  }

  add(item) {
    this.val = item;
  }

  toOscData() {
    return super.toOscData([this.val]);
  }
}

module.exports = Echoer;