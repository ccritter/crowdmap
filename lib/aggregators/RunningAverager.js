const Aggregator = require('./Aggregator');

/*
Have this on both the client side and the server side?
Client side averages the last n measurements
Server side averages the last m measurements
 */
class RunningAverager extends Aggregator {
  constructor (sourceType, avgSize) {
    super(sourceType);
    this.avgSize = avgSize;
  }

  insert(data, fromId) {
    // TODO Not yet implemented.
  }

  toOscData() {

  }
}

module.exports = RunningAverager;