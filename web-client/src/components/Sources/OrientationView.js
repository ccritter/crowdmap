import React from 'react';
import { srcTypes } from './SourceFactory'

export default class RestView extends React.Component {
  constructor(props) {
    super(props)

    this.alpha = 0;
    this.beta = 0;
    this.gamma = 0;

    switch (this.props.config.srcType) {
      case srcTypes.orient:
        this.send = () => this.sendData(this.alpha, this.beta, this.gamma);
        break;
      case srcTypes.orienta:
        this.send = () => this.sendData(this.alpha);
        break;
      case srcTypes.orientb:
        this.send = () => this.sendData(this.beta);
        break;
      case srcTypes.orientg:
        this.send = () => this.sendData(this.gamma);
        break;
      default:
        throw Error('Invalid source type for OrientationView.');
    }

    this.handleOrientation = this.handleOrientation.bind(this);
  }

  sendData(...args) {
    this.props.config.socket.send({
      address: this.props.config.destination,
      args: args.map(e => {return { type: 'f', value: e }})
    });
  }

  componentDidMount() {
    window.addEventListener('deviceorientation', this.handleOrientation, false);
  }

  componentWillUnmount() {
    window.removeEventListener('deviceorientation', this.handleOrientation, false);
  }

  handleOrientation(event) {
    // var absolute = event.absolute;
    this.alpha = event.alpha || 0;
    this.beta = event.beta || 0;
    this.gamma = event.gamma || 0;

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