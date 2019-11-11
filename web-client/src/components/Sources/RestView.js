import React from 'react';

export default class RestView extends React.Component {
  render() {
    return (
      <div className="fullscreen">
        {this.props.config.prompt}
      </div>
    )
  }
}