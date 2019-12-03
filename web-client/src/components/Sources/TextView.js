import React from 'react';

export default class RestView extends React.Component {
  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this)
    this.handleEnter = this.handleEnter.bind(this)
  }

  handleInput(e) {
    let value = e.target.value;
    // TODO For now we, just get the last character. For future iterations, we can get deltas
    if (value) {
      let key = value.charAt(value.length - 1);
      // console.log(key);
      this.props.config.socket.send({ address: this.props.config.destination, args: [{ type: 's', value: key }] });
    }
    // let value;
    // if (e.key === 'Enter') {
    //   e.preventDefault();
    //   value = e.target.value;
    //   e.target.value = '';
    // } else if (e.key.length === 1) {
    //   // TODO I don't think this handles emojis
    //   value = e.key;
    // }
    // if (value) this.props.config.socket.send({ address: this.props.config.destination, args: [{ type: 's', value }] });
  }

  handleEnter(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.props.config.socket.send({ address: this.props.config.destination, args: [{ type: 's', value: e.target.value }] });
      e.target.value = '';
    }
  }

  render() {
    // TODO Does this need action="#" in order to support a GO mobile keyboard button?
    return (
      <div className="fullscreen">
        {this.props.config.prompt}
        <input type="text" placeholder="Type here" onInput={this.handleInput} onKeyDown={this.handleEnter}/>
      </div>
    )
  }
}