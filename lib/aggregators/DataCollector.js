const Aggregator = require('./Aggregator');
const sourceTypes = require('./SourceFactory').sourceTypes;

class DataCollector extends Aggregator {
  constructor (sourceType) {
    super(sourceType);
    this.count = 0;
    this.configureData(sourceType);
    this.reset();
  }

  configureData(sourceType) {
    switch (sourceType) {
      // case sourceTypes.rest:
      case sourceTypes.tap:
        this.data = [0];
        this.insert = () => this.data[0]++;
        this.reset = () => this.data[0] = 0;
        break;
      case sourceTypes.text:
      case sourceTypes.swipe:
        this.insert = data => this.data.push(data[0]);
        this.reset = () => this.data = [];
        break;
      case sourceTypes.taprate:
      case sourceTypes.orienta:
      case sourceTypes.orientb:
      case sourceTypes.orientg:
        this.data = [0];
        break;
      case sourceTypes.xypad:
        this.data = [0, 0];
        break;
      case sourceTypes.orient:
        this.data = [0, 0, 0];
        break;
    }
  }

  reset() {
    this.count = 0;
  }

  insert(data, fromId) {
    if (data.length > this.data.length) {
      console.log('Attempted to send more data than expected.');
      data = data.slice(0, this.data.length);
    }
    this.count++;
    data.forEach((newVal, idx) => {
      let oldAvg = this.data[idx];
      this.data[idx] = oldAvg + ((newVal - oldAvg) / this.count);
    });
  }

  toOscData() {
    let temp = this.data;
    this.reset();
    return temp; // TODO This may not work, especially if values are ambiguous
  }
}

module.exports = DataCollector;