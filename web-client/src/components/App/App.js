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
      prompt: 'Connecting...',
      ready: false
    }
  }

  componentDidMount () {
    this.port = new osc.WebSocketPort({
      // url: 'ws://localhost:3000/ws',
      url: 'wss://crowdmap.fm/ws',
      metadata: true
    });

    this.port.on('message', (oscMsg) => {
      // console.log('Got WS: ', oscMsg);
      let destination = oscMsg.address;
      let sourceType;
      let prompt;
      if (destination === '/0') {
        sourceType = 0;
        prompt = 'Please wait.'
      } else {
        sourceType = oscMsg.args[0].value;
        prompt = oscMsg.args[1].value;
      }
      this.setState({ destination, sourceType, prompt });
    });

    this.port.on('ready', () => {
      this.setState({ prompt: 'Please wait for the show to begin.' });
    })

    this.port.open();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    navigator.vibrate(100);
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
    // let ready = this.state.ready;
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
