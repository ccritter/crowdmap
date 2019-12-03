class Mapping {
  constructor (address, aggregator, source, prompt) {
    this.address = address;
    this.aggregator = aggregator;
    this.source = source;
    this.prompt = prompt;

    this.isActive = false;
    this.didUpdate = false;
  }

  input(data, fromId) {
    this.aggregator.insert(data, fromId);
    this.didUpdate = true;
  }

  toOscData() {
    this.didUpdate = false;
    return { address: '/' + this.address, args: this.aggregator.toOscData() }
  }

  addToCrowd(socket) {
    socket.assignment = this.address;
    socket.send({ address: '/' + this.address, args: [
        {type: 'i', value: this.source },
        {type: 's', value: this.prompt }
      ]});
    this.aggregator.push(socket);
  }

  removeFromCrowd(socket) {
    socket = this.aggregator.pop(socket);
    socket.assignment = undefined;
    socket.send({ address: '/0' });
    return socket;
  }

  get crowd() {
    return this.aggregator.crowd;
  }

  get crowdSize() {
    return this.aggregator.size()
  }

  clearCrowd() {
    let crowd = this.crowd;
    this.aggregator.clearCrowd();
    return crowd;
  }

}

module.exports = Mapping;