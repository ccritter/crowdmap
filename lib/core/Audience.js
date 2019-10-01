
// TODO This observer pattern is a test. It may be pretty space inefficient.
class Audience {
  constructor () {
    this.crowd = {};
    this.observers = [];
  }


  addMember(id) {
    // TODO
  }

  removeMember(id) {
    // Only need to notify if members are removed, because current aggregators handle their own data when it's received.
    // TODO
    this.observers.forEach(obs => obs.remove(undefined, id));
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    const removeIndex = this.observers.findIndex(obs => observer === obs);

    if (removeIndex !== -1) {
      this.observers = this.observers.slice(removeIndex, 1);
    }
  }

  notifyObservers() {
    // this.observers.forEach(obs => observer.update)
  }
}

module.exports = Audience;