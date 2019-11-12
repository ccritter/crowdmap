const Aggregator = require('./Aggregator');
const SourceType = require('./SourceFactory');

class DataCollector extends Aggregator {
  constructor (sourceType) {
    super(sourceType);
    this.data;
  }

  insertTap(data, fromId) {
    if (this.data) {
      this.data++;
    } else {
      this.data = 1;
    }
  }

  insertText(data, fromId) {
    if (!this.data) {
      this.data = [];
    }

    if (data.length !== 0) {
      this.data.push(data[0]);
    }
  }

  insertOrient(data, fromId) {
    // TODO
  }

  toOscData() {
    let temp = this.data;
    this.data = undefined;
    return temp;
  }
}

module.exports = DataCollector;