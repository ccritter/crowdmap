import React from 'react';

export default class RestView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.props.socket.send({ address: this.props.destination })
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    this.props.socket.send({ address: this.props.destination, args: [{ type: 's', value: this.state.value }] });
    this.setState({ value: '' });
    event.preventDefault();
  }

  render() {
    // TODO Does this need action="#" in order to support a GO mobile keyboard button?
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Prompt?" onChange={this.handleChange} value={this.state.value}/>
        </form>
      </div>
    )
  }
}