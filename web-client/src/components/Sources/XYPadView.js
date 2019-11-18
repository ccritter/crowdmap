import React from 'react';

export default class XYPadView extends React.Component {
  constructor(props) {
    super(props);
    // this.handleTap = this.handleTap.bind(this);
    this.x = 0;
    this.y = 0;
  }

  componentDidMount() {
    this.dragArea = document.getElementById("XYView");

    // TODO This doesn't work in regular browsers, which may be ok.
    this.handleTouch = e => {
      e.preventDefault();
      let touch = e.changedTouches[0]; // TODO This can be modified to allow multitouch.
      this.setXY(touch.clientX, touch.clientY);
    };

    this.dragArea.addEventListener('touchstart', this.handleTouch);
    this.dragArea.addEventListener('touchmove', this.handleTouch);
    // this.dragArea.addEventListener('mousedown touchstart', (e) => {
    //   console.log('test')
    //   e.preventDefault();
    //   this.setXY(e.x, e.y);
    //
    //   let onMouseMove = (e) => {
    //     e.preventDefault();
    //     this.setXY(e.x, e.y);
    //   }
    //   let endDrag = (e) => {
    //     e.preventDefault();
    //     document.removeEventListener('mousemove touchmove', onMouseMove);
    //     this.dragArea.removeEventListener('mouseup touchend', endDrag);
    //   }
    //   document.addEventListener('mousemove touchmove', onMouseMove);
    //   this.dragArea.addEventListener('mouseup touchend', endDrag)
    // });
  }

  componentWillUnmount() {
    this.dragArea.removeEventListener('touchstart', this.handleTouch);
    this.dragArea.removeEventListener('touchmove', this.handleTouch);
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