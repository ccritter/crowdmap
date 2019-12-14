
const sourceTypes = Object.freeze({
  rest: 0,
  tap: 1,
  taprate: 2,
  text: 3,
  orient: 4,
  orienta: 5,
  orientb: 6,
  orientg: 7,
  accel: 8,
  accelx: 9,
  accely: 10,
  accelz: 11,
  accelr: 12,
  xypad: 13,
  swipe: 14
});

// Returns a normalizing function that scales the value to be in the range 0-100
function sourceFactory(srcType) {
  switch (srcType) {
    case sourceTypes.rest:
      return (data) => undefined; // No data should be sent during this source anyway.
    case sourceTypes.tap:
      return (data) => 100;
    case sourceTypes.taprate:
      return (data) => (data[0] > 300 ? 300 : data[0]) / 3;
    case sourceTypes.text:
      return (data) => data[0].length === 1 ? undefined : data[0].length > 100 ? 100 : data[0].length;
    case sourceTypes.orient:
      return (data) => ((data[0] / 3.6) + ((data[1] + 180) / 3.6) + ((data[2] + 90) / 1.8)) / 3;
    case sourceTypes.orienta:
      return (data) => data[0] / 3.6;
    case sourceTypes.orientb:
      return (data) => (data[0] + 180) / 3.6;
    case sourceTypes.orientg:
      return (data) => (data[0] + 90) / 1.8;
    case sourceTypes.accel:
      // return (data) => // ((data[0] / 3.6) + ((data[1] + 180) / 3.6) + ((data[2] + 90) / 1.8)) / 3;
    case sourceTypes.accelx:
    case sourceTypes.accely:
    case sourceTypes.accelz:
      return (data) => {
        let num = Math.abs(data[0]) * 10;
         return num > 100 ? 100 : num;
      }
    case sourceTypes.xypad:
      return (data) => (data[0] + data[1]) / 2;
    case sourceTypes.swipe:
      return (data) => data[0] ? 100 : 0;
  }
}

module.exports = { sourceTypes, sourceFactory };