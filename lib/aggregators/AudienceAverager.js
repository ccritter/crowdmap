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
    let values = this.data.values();
    let sum = values.reduce((previous, current) => current += previous);
    return [sum / values.length];
  }
}

module.exports = AudienceAverager;