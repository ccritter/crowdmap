import React from 'react';

export default class MovementView extends React.Component {
  constructor(props) {
    super(props)

    // this.state = {
    //   x: 0,
    //   y: 0,
    //   z: 0
    // };

    this.handleMotion = this.handleMotion.bind(this);
  }

  componentDidMount() {
    // ADD LISTENERS
    window.addEventListener('devicemotion', this.handleMotion, false);
  }

  componentWillUnmount() {
    // REMOVE LISTENERS
    window.removeEventListener('devicemotion', this.handleMotion, false);
  }

  handleMotion(event) {
    // this.setState({
    //   x: event.devicemotion.x,
    //   y: event.devicemotion.y,
    //   z: event.devicemotion.z
    // });

    // this.x = event.devicemotion.x;
    // this.y = event.devicemotion.y;
    // this.z = event.devicemotion.z;
    // this.props.config.socket.send({ address: this.props.config.destination, args: [{ type: 'f', value: this.state.beta }] });

    port.send({
      address: this.props.config.destination,
      args: [
        { type: 'f', value: event.devicemotion.x },
        { type: 'f', value: event.devicemotion.y },
        { type: 'f', value: event.devicemotion.z }
      ]
    });
  }

  render() {
    return (
      <div className="fullscreen">
        {this.props.config.prompt}
      </div>
    )
  }
}