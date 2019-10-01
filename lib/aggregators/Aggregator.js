/**
 * Generic aggregator interface for defining expected functionality.
 */
class Aggregator {
  constructor () {

  }

  insert(item, fromId) {
    // Class method that puts an item into the Aggregator. fromId is optional in subclasses
  }

  remove(item, fromId) {
    // TODO for most classes, this will not be needed or used.
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