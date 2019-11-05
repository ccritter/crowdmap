const Aggregator = require('./Aggregator');

class AudienceAverager extends Aggregator {
  constructor () {
    super();
    this.data = {};
  }

  insert(data, fromId) {
    // TODO This coersion isn't necessary, many other ranges can be used. Delete it.
    let point = data[0]; // todo - always access array item 0? if there is data, that is
    if (point > 1) {
      point = 1;
    } else if (point < 0) {
      point = 0;
    }
    this.data[fromId] = point;
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
      let sum = values.reduce((previous, current) => current += previous);
      return [sum / values.length];
    } else {
      return [0];
    }
  }
}

module.exports = AudienceAverager;