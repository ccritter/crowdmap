import React from 'react';

export default class TapRateView extends React.Component {
  constructor(props) {
    super(props);
    this.curRate = 0;
    this.MAX_TAPS = 5;
    this.lastTime = this.millis();
    this.handleTap = this.handleTap.bind(this);
  }

  handleTap() {
    let newTime = this.millis();
    let duration = newTime - this.lastTime;
    this.lastTime = newTime;
    this.curRate = this.curRate + ((duration - this.curRate) / this.MAX_TAPS);
    this.props.config.socket.send({ address: this.props.config.destination, args: [{type: 'f', value: 60000 / this.curRate}] });
  }

  millis() {
    return new Date().getTime();
  }

  render() {
    return (
      <div className="fullscreen" onClick={this.handleTap}>
        {this.props.config.prompt}
      </div>
    );
  }
}