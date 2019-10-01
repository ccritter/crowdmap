const Aggregator = require('./Aggregator');

/*
Have this on both the client side and the server side.
Client side averages the last 5 (?) measurements
Server side averages the last 100 (?) measurements
 */
class RunningAverager extends Aggregator {
  constructor (avgSize) {
    super();
    this.size = avgSize
  }

  insert(item) {

  }

}

module.exports = RunningAverager;