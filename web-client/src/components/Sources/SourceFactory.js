import React from 'react'
import RestView from './RestView'
import OrientationView from './OrientationView'

// TODO Import this from the lib
const srcTypes = Object.freeze({
  rest: 0,
  orient: 1,
  accel: 2,
});

export default function SourceFactory(data) {
  console.log(data);
  switch (data.srcType) {
    case srcTypes.rest:
      return <RestView viewData={data}/>
    case srcTypes.orient:
      return <OrientationView viewData={data}/>
    default:
      return <RestView viewData={data}/>
    // case srcTypes.accel:
    //   return <AccelerationView viewData={data}/>
  }
}