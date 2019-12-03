import React from 'react'
import RestView from './RestView'
import TapView from './TapView'
import TextView from './TextView'
import OrientationView from './OrientationView'
import MovementView from './MovementView'
import XYPadView from './XYPadView'
import SwipeView from './SwipeView'
import TapRateView from './TapRateView'

// This must be the same as found in lib/aggregators/SourceFactory
export const srcTypes = Object.freeze({
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

export function SourceFactory(data) {
  switch (data.srcType) {
    case srcTypes.rest:
      return <RestView config={data}/>;
    case srcTypes.tap:
      return <TapView config={data}/>;
    case srcTypes.taprate:
      return <TapRateView config={data}/>;
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
    case srcTypes.swipe:
      return <SwipeView config={data}/>
    default:
      return <RestView config={data}/>;
    // case srcTypes.accel:
    //   return <AccelerationView viewData={data}/>
  }
}
