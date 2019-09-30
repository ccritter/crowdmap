/**
 * Generic aggregator interface for defining expected functionality.
 */
class Aggregator {
  constructor (address) {
    this.address = address;
  }

  add(item) {
    // Class method that puts an item into the Aggregator
  }

  toOscData(args) {
    return {
      address: this.address, args
    }
  }
}

module.exports = Aggregator;