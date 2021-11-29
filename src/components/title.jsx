import React, { Component } from 'react';
import 'w3-css';

class Title extends Component {
  render() {
    return (
      <h1>{this.props.text}</h1>
    )
  }
}

export default Title;
