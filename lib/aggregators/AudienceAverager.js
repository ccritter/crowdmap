const Aggregator = require('./Aggregator');

class AudienceAverager extends Aggregator {
  constructor () {
    super();
    this.data = {};
  }

  insert(item, fromId) {
    this.data[fromId] = item;
  }

  remove(item, fromId) {
    delete this.data[fromId];
  }

  toOscData(args) {
    let values = Object.values(this.data);
    let length = values.length;
    if (length > 0) {
      let sum = values.reduce((previous, current) => current += previous);
      return [sum / values.length];
    } else {
      return [0];
    }
  }
}

module.exports = AudienceAverager;