const Aggregator = require('./Aggregator');
const sourceTypes = require('./SourceFactory');

class AudienceAverager extends Aggregator {
  constructor (sourceType) {
    super(sourceType);
    this.data = {};
  }

  insertTap(data, fromId) {
    this.data[fromId] = 1;
  }

  insertText(data, fromId) {
    if (data.length !== 0) {
      this.data[fromId] = data[0].length
    }
  }

  insertOrient(data, fromId) {
    // TODO Switch case here is bad. We can assign functions in the super constructor, but this is just for testing.
    switch (this.sourceType) {
      case sourceTypes.orient:
        this.data[fromId] = (data[0] / 3.6) + ((data[1] + 180) / 3.6) + ((data[2] + 90) / 1.8);
        break;
      case sourceTypes.orienta:
        this.data[fromId] = data[0] / 3.6;
        break;
      case sourceTypes.orientb:
        this.data[fromId] = (data[0] + 180) / 3.6;
        break;
      case sourceTypes.orientg:
        this.data[fromId] = (data[0] + 90) / 1.8;
        break;
    }
  }

  push(socket) {
    super.push(socket);
    this.data[socket.id] = 0;
  }

  pop (socket) {
    delete this.data[socket.id];
    return super.pop(socket);
  }

  toOscData() {
    let values = Object.values(this.data);
    let length = values.length;
    if (length > 0) {
      let sum = values.reduce((previous, current) => current + previous, 0);
      // Object.keys(this.data).forEach(id => { this.data[id] = 0 }); // TODO We don't always want this to reset (particularly for percentage based ones). Maybe after several toOsc calls?
      return [sum / length];
    } else {
      return [0];
    }
  }
}

module.exports = AudienceAverager;