const Aggregator = require('./Aggregator');

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
    // let alpha = event.alpha / 360;
    // let beta = (event.beta + 180) / 360;
    // let gamma = (event.gamma + 90) / 180;
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
      Object.keys(this.data).forEach(id => { this.data[id] = 0 }); // TODO We don't always want this to reset (particularly for percentage based ones). Maybe after several toOsc calls?
      return [sum / length];
    } else {
      return [0];
    }
  }
}

module.exports = AudienceAverager;