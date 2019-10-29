import React from 'react'
import RestView from './RestView'
import OrientationView from './OrientationView'
import TextView from './TextView'

// TODO Import this from the lib
const srcTypes = Object.freeze({
  rest: 0,
  text: 1,
  orient: 2,
  accel: 3,
});

export default function SourceFactory(data) {
  console.log(data);
  switch (data.srcType) {
    case srcTypes.rest:
      return <RestView socket={data.socket} destination={data.destination}/>
    case srcTypes.text:
      return <TextView socket={data.socket} destination={data.destination}/>
    case srcTypes.orient:
      return <OrientationView socket={data.socket} destination={data.destination}/>
    default:
      return <RestView socket={data.socket} destination={data.destination}/>
    // case srcTypes.accel:
    //   return <AccelerationView viewData={data}/>
  }
}