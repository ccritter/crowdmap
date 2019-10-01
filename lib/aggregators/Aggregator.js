
// TODO Create a factory pattern function that takes an Agg type and produces an appropriate Aggregator

/**
 * Generic aggregator interface for defining expected functionality.
 */
class Aggregator {
  constructor () {

  }

  insert(item) {
    // Class method that puts an item into the Aggregator
  }

  /**
   * Produces the list of data that would be supplied to the 'args' part of an OSC message
   *
   * @param args
   * @returns Array
   */
  toOscData(args) {
    return []
  }
}

module.exports = Aggregator;