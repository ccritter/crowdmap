import Hammer from 'hammerjs';

import React from 'react';

export default class SwipeView extends React.Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    this.swipeArea = document.getElementById("SwipeView");
    this.hammer = new Hammer(this.swipeArea);
    // TODO Figure out how this could be improved to do swipes in 4 directions rather than 2.
    this.hammer.on('swipeleft swiperight', e => {
      let val = e.type === 'swiperight' ? 'T' : 'F';

      this.props.config.socket.send({ address: this.props.config.destination, args: [{type: val}] });
    });
  }

  componentWillUnmount() {
    // TODO?
  }

  render() {
    return (
      <div className="fullscreen" id="SwipeView">
        {this.props.config.prompt}
      </div>
    );
  }
}