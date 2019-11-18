const Aggregator = require('./Aggregator');

/*
Have this on both the client side and the server side.
Client side averages the last 5 (?) measurements
Server side averages the last 100 (?) measurements
 */
class RunningAverager extends Aggregator {
  constructor (sourceType, avgSize) {
    super(sourceType);
    this.avgSize = avgSize
  }

  insert(data, fromId) {

  }

  toOscData() {

  }
}

module.exports = RunningAverager;