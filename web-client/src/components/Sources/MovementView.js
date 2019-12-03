import React from 'react';
import { srcTypes } from './SourceFactory'

export default class MovementView extends React.Component {
  constructor(props) {
    super(props)

    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotationRate = 0;

    switch (this.props.config.srcType) {
      case srcTypes.accel:
        this.send = () => this.sendData(this.x, this.y, this.z, this.rotationRate);
        break;
      case srcTypes.accelx:
        this.send = () => this.sendData(this.x);
        break;
      case srcTypes.accely:
        this.send = () => this.sendData(this.y);
        break;
      case srcTypes.accelz:
        this.send = () => this.sendData(this.z);
        break;
      // case srcTypes.accelr:
      //   this.send = () => this.sendData(this.rotationRate);
      //   break;
      default:
        throw Error('Invalid source type for MovementView.');
    }

    this.handleMotion = this.handleMotion.bind(this);
  }

  sendData(...args) {
    this.props.config.socket.send({
      address: this.props.config.destination,
      args: args.map(e => {return { type: 'f', value: e }})
    });
  }

  componentDidMount() {
    window.addEventListener('devicemotion', this.handleMotion, false);
  }

  componentWillUnmount() {
    window.removeEventListener('devicemotion', this.handleMotion, false);
  }

  handleMotion(event) {
    console.log(event);
    this.x = event.acceleration.x;
    this.y = event.acceleration.y;
    this.z = event.acceleration.z;
    // this.rotationRate = event.rotationRate; // TODO No rotation rate at the moment.

    this.send();
  }

  render() {
    return (
      <div className="fullscreen">
        {this.props.config.prompt}
      </div>
    )
  }
}