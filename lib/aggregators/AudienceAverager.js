const Aggregator = require('./Aggregator');

class AudienceAverager extends Aggregator {
  constructor (sourceType) {
    super(sourceType);
    this.data = {};
  }

  insert (data, fromId) {
    // TODO Normalize here, or normalize in the toOscData section? here is a lot more calculations, but more control over what is stored in this.data.
    let val = this.normalize(data);
    if (val !== undefined) {
      this.data[fromId] = val;
    }
  }

  push(socket) {
    super.push(socket);
    this.data[socket.id] = 0;
  }

  pop(socket) {
    let s = super.pop(socket);
    delete this.data[s.id];
    return s;
  }

  toOscData() {
    let values = Object.values(this.data);
    let length = values.length;
    if (length > 0) {
      let sum = values.reduce((previous, current) => current + previous, 0);
      return [sum / length];
    } else {
      return [0];
    }
  }
}

module.exports = AudienceAverager;