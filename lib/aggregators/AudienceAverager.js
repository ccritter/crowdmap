const Aggregator = require('./Aggregator');

class AudienceAverager extends Aggregator {
  constructor () {
    super();
    this.data = {};
  }

  insert(item, fromId) {
    this.data[fromId] = item;
  }

  push(socket) {
    super.push(socket);
    this.data[socket.id] = 0;
  }

  pop (socket) {
    delete this.data[socket.id];
    return super.pop(socket);
  }

  toOscData(args) {
    let values = Object.values(this.data);
    let length = values.length;
    if (length > 0) {
      let sum = values.reduce((previous, current) => current += previous);
      return [sum / values.length];
    } else {
      return [0];
    }
  }
}

module.exports = AudienceAverager;