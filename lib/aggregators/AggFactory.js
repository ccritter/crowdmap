const Echoer = require('./Echoer');
const RunningAverager = require('./RunningAverager');
const AudienceAverager = require('./AudienceAverager');

const aggTypes = Object.freeze({
  echo: 0,
  audavg: 1,
  runavg: 2,
});

const aggFactory = function(aggType) {
  switch (aggType) {
    case aggTypes.echo:
      return new Echoer();
    case aggTypes.audavg:
      return new AudienceAverager();
    case aggTypes.runavg:
      return new RunningAverager();
    default:
      throw `Aggregator type ${aggType} not found.`
  }
}


module.exports = { aggFactory, aggTypes }