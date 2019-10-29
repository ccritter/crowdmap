const Echoer = require('./Echoer');
const DataCollector = require('./DataCollector');
const RunningAverager = require('./RunningAverager');
const AudienceAverager = require('./AudienceAverager');

const aggTypes = Object.freeze({
  echo: 0,
  rawdata: 1,
  audavg: 2,
  runavg: 3,
});

const aggFactory = function(aggType) {
  switch (aggType) {
    case aggTypes.echo:
      return new Echoer();
    case aggTypes.rawdata:
      return new DataCollector(); // TODO Specify a type?
    case aggTypes.audavg:
      return new AudienceAverager();
    case aggTypes.runavg:
      return new RunningAverager();
    default:
      throw `Aggregator type ${aggType} not found.`
  }
}


module.exports = { aggFactory, aggTypes }