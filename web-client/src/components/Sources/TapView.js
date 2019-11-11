import React from 'react';

export default class TapView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {};

    this.handleTap = this.handleTap.bind(this);
  }

  handleTap() {
    this.props.config.socket.send({ address: this.props.config.destination });
  }

  render() {
    return (
      <div className="fullscreen" onClick={this.handleTap}>
        {this.props.config.prompt}
      </div>
    )
  }
}