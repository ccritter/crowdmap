const Aggregator = require('./Aggregator');

class DataCollector extends Aggregator {
  constructor () {
    super();
    this.data = [];
    this.didUpdate = false;
  }

  insert(data, fromId) {
    if (data.length > 0) {
      this.data.push(data[0]); // TODO Maybe concat whole array instead of just [0]?
    } else {
      this.didUpdate = true;
    }
  }

  toOscData() {
    if (this.didUpdate) {
      this.didUpdate = false;
      return []; // TODO Document somewhere that an empty list denotes a simple update
    } else {
      return this.data; // .map(e => { return {type: 's', value: e } }); // TODO Presumably more than just strings. need to test what happens if left unchecked
    }
  }
}

module.exports = DataCollector;