import React from 'react';
import Hammer from 'hammerjs';

export default class XYPadView extends React.Component {
  constructor(props) {
    super(props);
    // this.handleTap = this.handleTap.bind(this);
    this.x = 0;
    this.y = 0;
  }

  componentDidMount() {
    // TODO Make sure this doesn't continue to fire if the view changes while mouse is held down.
    this.dragArea = document.getElementById("XYView");

    this.dragArea.onmousedown = (e) => {
      this.setXY(e.x, e.y);

      let onMouseMove = (e) => {
        this.setXY(e.x, e.y);
      }
      document.addEventListener('mousemove', onMouseMove);
      this.dragArea.onmouseup = () => {
        document.removeEventListener('mousemove', onMouseMove);
        this.dragArea.onmouseup = null;
      }
    }
  }

  componentWillUnmount() {
    if (this.dragArea.onmouseup) {
      this.dragArea.onmouseup();
    }
  }

  setXY(x, y) {
    let shouldSend = false;
    x = (x / this.dragArea.clientWidth) * 100;
    if (Math.abs(this.x - x) > 2) {
      this.x = x;
      shouldSend = true;
    }

    y = (y / this.dragArea.clientHeight) * 100;
    if (Math.abs(this.y - y) > 2) {
      this.y = y;
      shouldSend = true;
    }

    if (shouldSend) {
      this.props.config.socket.send({ address: this.props.config.destination, args: [this.x, this.y] });
    }
  }

  render() {
    return (
      <div className="fullscreen" id="XYView">
        {this.props.config.prompt}
      </div>
    );
  }
}