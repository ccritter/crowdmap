import React from 'react';

export default class RestView extends React.Component {
  constructor(props) {
    super(props);
    this.handleKey = this.handleKey.bind(this)
  }

  handleKey(e) {
    let value;
    if (e.key === 'Enter') {
      e.preventDefault();
      value = e.target.value;
      e.target.value = '';
    } else if (e.key.length === 1) {
      // TODO I don't think this handles emojis
      value = e.key;
    }
    if (value) this.props.config.socket.send({ address: this.props.config.destination, args: [{ type: 's', value }] });
  }

  render() {
    // TODO Does this need action="#" in order to support a GO mobile keyboard button?
    return (
      <div className="fullscreen">
        {this.props.config.prompt}
        <input type="text" placeholder="Type here" onKeyDown={this.handleKey}/>
      </div>
    )
  }
}