import React from 'react';

export default class RestView extends React.Component {
  constructor(props) {
    super(props)
    console.log(props);
  }

  render() {
    return (
      <div>
        Take a break.
      </div>
    )
  }
}