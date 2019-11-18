import React from 'react'
import RestView from './RestView'
import TapView from './TapView'
import TextView from './TextView'
import OrientationView from './OrientationView'
import MovementView from './MovementView'
import XYPadView from './XYPadView'

// This must be the same as found in lib/aggregators/SourceFactory
export const srcTypes = Object.freeze({
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
  xypad: 12
});

export function SourceFactory(data) {
  switch (data.srcType) {
    case srcTypes.rest:
      return <RestView config={data}/>;
    case srcTypes.tap:
      return <TapView config={data}/>;
    case srcTypes.text:
      return <TextView config={data}/>;
    case srcTypes.orient:
    case srcTypes.orienta:
    case srcTypes.orientb:
    case srcTypes.orientg:
      return <OrientationView config={data}/>;
    case srcTypes.accel:
    case srcTypes.accelx:
    case srcTypes.accely:
    case srcTypes.accelz:
    case srcTypes.accelr:
      return <MovementView config={data}/>;
    case srcTypes.xypad:
      return <XYPadView config={data}/>
    default:
      return <RestView config={data}/>;
    // case srcTypes.accel:
    //   return <AccelerationView viewData={data}/>
  }
}
