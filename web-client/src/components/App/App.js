import React from 'react';
import logo from '../../assets/images/logo.svg';
import './App.css';
import * as osc from 'osc/dist/osc-browser';
import SourceFactory from '../Sources/SourceFactory';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      destination: 0,
      sourceType: 0
    }
  }

  componentDidMount () {
    this.port = new osc.WebSocketPort({
      // url: 'ws://localhost:3000/ws'
      url: 'wss://crowdmap.fm/ws'
    });

    this.port.on('message', (oscMsg) => {
      console.log('Got WS: ', oscMsg);
      this.setState({
        destination: oscMsg.address.substring(1),
        // sourceType: oscMsg.args[0]
        sourceType: Number(oscMsg.address.substring(1))
      });
    });

    this.port.open();

    // TODO Determine all the things that are and aren't supported by this client.
    if (window.DeviceOrientationEvent) {
      console.log('Supported!');
      // window.addEventListener('deviceorientation', handleOrientation, false);
      // document.getElementById("doeSupported").innerText = "Supported!";
    } else {
      // document.getElementById("doeSupported").innerText = "Not supported :(";
      console.log('Supported!');
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <SourceFactory destination={this.state.destination} srcType={this.state.sourceType} socket={this.port}/>
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
        </header>
      </div>
    );
  }
}

export default App;
