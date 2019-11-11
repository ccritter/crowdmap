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
    socket.assignment = undefined;
    socket.send({ address: '/0' }) // TODO In most cases, they'll just be immediately reassigned. Still necessary?
    return this.aggregator.pop(socket);
  }

  // set crowd(sockArray) {
  //   // TODO
  //   // this.aggregator.setCrowd(sockArray);
  //   // this.size = sockArray.length;
  // }
  //
  get crowd() {
    return this.aggregator.crowd;
  }

  crowdSize() {
    return this.aggregator.size()
  }

  clearCrowd() {
    this.aggregator.clearCrowd();
  }

}

module.exports = Mapping;