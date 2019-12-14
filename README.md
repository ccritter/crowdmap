# CrowdMap

CrowdMap is a plugin for generalized smartphone control of musical performance, 
written for Max for Live using Max/MSP and JavaScript. It features a web app, server, 
and Max client that all communicate to modulate parameters of a Live set in real-time. 
It is still in active development.

## Installation

### Server

In whatever hosting environment you are working in, run `npm install` in the root project directory.
Configure your host to serve the static files that will be found in `/web-client/build` 
upon running `npm start:eb`, or if you would like to only run the server without rebuilding the 
static files just use `npm start`. Make sure the URL found in `/web-client/src/components/App/App.js` 
is reflective of your host URL. Ensure you have active SSL certificates available to make use of
the various device sensors. Make sure your server is accessible via WebSockets depending on how HTTP
upgrades are handled by your host, and that UDP traffic is allowed into and out of the server.

### Max Client

Run `npm install` from within `/max-client`. Ensure the version of Max that you are using is Max 8. Load the Max Client into a MIDI track in
Ableton, and make sure the URL in `/max-client/crowdmap.js` is reflective of the URL of your host. 
Configure your parameters, and then click connect.

## Usage

There are three components to this software: Server, web client, and Max for Live device.

### Data Sources

Current or planned data sources (note: in Map mode, all values are normalized from 0 to 100):

| Name | Description | Map Mode | Data Mode |
| --- | --- | --- | --- |
| Rest | No data is sent, but prompts can still specify meta interactions | N/A | N/A |
| Tap | Users simply tap their screen. | Percentage of audience that tapped in that timeframe. | Number of taps in that timeframe. |
| TapRate | Users tap their screen many times. | The average rate of tapping. | The exact average tap rate. |
| Text | Presents a textbox that can be typed into and send strings. | Text length | Sends letters when a key is pressed, and the word that is sent upon submit. |
| Orientation | How the phone is oriented | Average of the three out of 100. | Average orientation alpha, beta, and gamma each. |
| OrientationAlpha | How the phone is oriented around z-axis (out from screen) | Average angle. | Unnormalized angle. |
| OrientationBeta | How the phone is oriented around x-axis (out from side) | Average angle. | Unnormalized angle. |
| OrientationGamma | How the phone is oriented around y-axis (out from top) | Average angle. | Unnormalized angle. |
| Acceleration | How fast the phone is moving. | Average absolute value acceleration in the direction of motion. | Acceleration in the X, Y, and Z directions. |
| XYPad | Tap or drag around the screen. | Average distance from the top left corner. | X and Y coordinates of all ones that were sent in. |
| Audio (Could be too noisy during concert) | Send sounds into the phone's mic. | Average amplitude | The actual audio stream. https://github.com/scottstensland/websockets-streaming-audio https://github.com/Ivan-Feofanov/ws-audio-api |
| Exits | Audience members disconnect from the site. | Percent of audience still connected compared to when it became active. | Notifies every time a user disconnects. |
| SpeechRecognition | https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API https://whatwebcando.today/speech-recognition.html |  |  |
| Minigame ideas | Some other things that could be put in: drawing, pumping up a balloon, spinning a dial, flipping switches, pressing notes on a keyboard, etc |  |  |

## License

[MIT](https://choosealicense.com/licenses/mit/)