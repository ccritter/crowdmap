const Aggregator = require('./Aggregator');

/**
 * Generic aggregator. Echoes the last given value when accessed.
 */
class Echoer extends Aggregator {
  constructor (sourceType) {
    super(sourceType);
    this.val = 0;
  }

  insert(data, fromId) {
    let val = this.normalize(data);
    if (val !== undefined) {
      this.val = val;
    }
  }

  toOscData() {
    return [this.val];
  }
}

module.exports = Echoer;