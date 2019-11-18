
const sourceTypes = Object.freeze({
  rest: 0,
  tap: 1,
  text: 2,
  orient: 3,
  orienta: 4,
  orientb: 5,
  orientg: 6,
  accel: 7,
  accelx: 8,
  accely: 9,
  accelz: 10,
  accelr: 11,
  xypad: 12,
  exits: 13
});

// Returns a normalizing function that scales the value to be in the range 0-100
function sourceFactory(srcType) {
  switch (srcType) {
    case sourceTypes.rest:
      return function (data) {
        return undefined; // No data should be sent during this source anyway.
      }
    case sourceTypes.tap:
      return function (data) {
        return 100;
      }
    case sourceTypes.text:
      return function (data) {
        if (data.length !== 0) {
          return data[0].length > 100 ? 100 : data[0].length;
        }
      }
    case sourceTypes.orient:
      return function (data) {
        return ((data[0] / 3.6) + ((data[1] + 180) / 3.6) + ((data[2] + 90) / 1.8)) / 3;
      }
    case sourceTypes.orienta:
      return function (data) {
        return data[0] / 3.6;
      }
    case sourceTypes.orientb:
      return function (data) {
        return (data[0] + 180) / 3.6;
      }
    case sourceTypes.orientg:
      return function (data) {
        return (data[0] + 90) / 1.8;
      }
    case sourceTypes.xypad:
      return function (data) {
        return (data[0] + data[1]) / 2 // TODO Or should this be pythagorean theorem?
      }
  }
}

module.exports = { sourceTypes, sourceFactory };