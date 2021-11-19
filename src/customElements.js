import React, { Component } from 'react';

export class Title extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <h1>{this.props.text}</h1>
    )
  }
}

export class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(event) {
    this.setState({value: event.target.value});
  }

  onSubmit(event) {
    alert(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <label>
          {this.props.label}
          <input type="text" value={this.state.value} onChange={this.onChange}/>
        </label>
        <input type="submit" value="Submit"/>
      </form>
    )
  }
}
