const Echoer = require('./Echoer');
const DataCollector = require('./DataCollector');
const RunningAverager = require('./RunningAverager');
const AudienceAverager = require('./AudienceAverager');

const aggTypes = Object.freeze({
  rawdata: 0,
  echo: 1,
  audavg: 2,
  runavg: 3,
});

const aggFactory = function(aggType, srcType) {
  switch (aggType) {
    case aggTypes.rawdata:
      return new DataCollector(srcType);
    case aggTypes.echo:
      return new Echoer(srcType);
    case aggTypes.audavg:
      return new AudienceAverager(srcType);
    case aggTypes.runavg:
      return new RunningAverager(srcType, 5); // Hardcoding 5 for now.
    default:
      throw `Aggregator type ${aggType} not found.`
  }
}


module.exports = { aggFactory, aggTypes }