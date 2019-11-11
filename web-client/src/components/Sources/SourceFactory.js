import React from 'react'
import RestView from './RestView'
import OrientationView from './OrientationView'
import TextView from './TextView'
import TapView from './TapView'

// TODO Import this from the lib
const srcTypes = Object.freeze({
  rest: 0,
  tap: 1,
  text: 2,
  orient: 3,
  accel: 4,
});

export default function SourceFactory(data) {
  switch (data.srcType) {
    case srcTypes.rest:
      return <RestView config={data}/>;
    case srcTypes.tap:
      return <TapView config={data}/>;
    case srcTypes.text:
      return <TextView config={data}/>;
    case srcTypes.orient:
      return <OrientationView config={data}/>;
    default:
      return <RestView config={data}/>;
    // case srcTypes.accel:
    //   return <AccelerationView viewData={data}/>
  }
}