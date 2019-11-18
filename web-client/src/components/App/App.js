import React from 'react';
// import logo from '../../assets/images/logo.svg';
import './App.css';
import * as osc from 'osc/dist/osc-browser';
import { SourceFactory } from '../Sources/SourceFactory';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      destination: '/0',
      sourceType: 0,
      prompt: 'Please wait for the show to begin.',
      ready: false
    }
  }

  componentDidMount () {
    this.port = new osc.WebSocketPort({
      url: 'ws://localhost:3000/ws'
      // url: 'wss://crowdmap.fm/ws'
    });

    this.port.on('message', (oscMsg) => {
      // console.log('Got WS: ', oscMsg);
      let destination = oscMsg.address;
      let prompt = oscMsg.args[1];
      let sourceType;
      if (destination === '/0') {
        prompt = 'Please wait.'
        sourceType = 0;
      } else {
        sourceType = oscMsg.args[0];
      }
      this.setState({ destination, sourceType, prompt });
    });

    this.port.open();
    // TODO Use this.
    this.setState({ ready: true });

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    navigator.vibrate(200);
  }

  checkCompatibility() {
    if (window.DeviceOrientationEvent) {

    }

    if (window.DeviceMotionEvent) {

    }

    if ('vibrate' in navigator) {
      
    }
  }

  render() {
    return (
      <div className="App">
        <SourceFactory destination={this.state.destination}
                       srcType={this.state.sourceType}
                       prompt={this.state.prompt}
                       socket={this.port}
        />
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        {/*<p>*/}
        {/*  Edit <code>src/App.js</code> and save to reload.*/}
        {/*</p>*/}
        {/*<a*/}
        {/*  className="App-link"*/}
        {/*  href="https://reactjs.org"*/}
        {/*  target="_blank"*/}
        {/*  rel="noopener noreferrer"*/}
        {/*>*/}
        {/*  Learn React*/}
        {/*</a>*/}
      </div>
    );
  }
}

export default App;
