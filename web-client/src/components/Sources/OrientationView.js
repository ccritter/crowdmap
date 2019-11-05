import React from 'react';

export default class RestView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      alpha: 0,
      beta: 0,
      gamma: 0
    };

    this.handleOrientation = this.handleOrientation.bind(this);
  }

  componentDidMount() {
    // ADD LISTENERS
    window.addEventListener('deviceorientation', this.handleOrientation, false);
  }

  componentWillUnmount() {
    // REMOVE LISTENERS
    window.removeEventListener('deviceorientation', this.handleOrientation, false);
  }

  handleOrientation(event) {
    // var absolute = event.absolute;
    this.setState({
      alpha: event.alpha / 360,
      beta: (event.beta + 180) / 360,
      gamma: (event.gamma + 90) / 180
    });

    // TODO: Currently just sends beta.
    this.props.socket.send({ address: this.props.destination, args: [{ type: 'f', value: this.state.beta }] });

    // port.send({
    //   timeTag: osc.timeTag(0),
    //   packets: [
    //     {
    //       address: '/orientation/alpha',
    //       args: [{type: 'f', value: alpha}]
    //     }, {
    //       address: '/orientation/beta',
    //       args: [{type: 'f', value: beta}]
    //     }, {
    //       address: '/orientation/gamma',
    //       args: [{type: 'f', value: gamma}]
    //     }
    //   ]
    // });
  }

  render() {
    return (
      <div>
        Spin Device
        <br/>
        {/*{this.state.alpha}*/}
        {this.state.beta}
        {/*{this.state.gamma}*/}
      </div>
    )
  }
}