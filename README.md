# CrowdMap

Description coming soon.

## Installation

Instructions coming soon.

```bash
nothing yet
```

## Usage

There are three components to this software: Server, web client, and Max for Live device.

### Data Sources

| Name | Description | Aggregate Mode | Data Mode |
| --- | --- | --- | --- |
| Text | Presents a textbox that can be typed into and send strings. | Undecided (Text length? Percent of audience that typed?) | Sends empty arguments when a key is pressed, and the word that is sent when sent. |
| Orientation | How the phone is oriented | Undecided (Average vector? Or divide this row into three, alpha beta gamma?) | (average, or all recent values?) Orientation alpha, beta, and gamma. |
| Acceleration | How fast the phone is moving. | Average absolute value acceleration in the direction of motion. | (average, or all recent values?) Acceleration in the X, Y, and Z directions. |
| Tap | Users simply tap their screen. | Percentage of audience that tapped in that timeframe. | Number of taps in that timeframe. |
| XYPad | Tap or drag around the screen. | Average distance from the top left corner. | X and Y coordinates of all ones that were sent in. |
| Audio (? could be too noisy during concert) | Send sounds into the phone's mic. | Average amplitude | The actual audio stream. https://github.com/scottstensland/websockets-streaming-audio https://github.com/Ivan-Feofanov/ws-audio-api |
| Exits | Audience members disconnect from the site. | Percent of audience still connected compared to when it became active. | Notifies every time a user disconnects. |
| SpeechRecognition | https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API https://whatwebcando.today/speech-recognition.html |  |  |
| Minigame ideas | Some other things that could be put in: drawing, pumping up a balloon, spinning a dial, flipping switches, pressing notes on a keyboard, etc |  |  |

## License

[MIT](https://choosealicense.com/licenses/mit/)