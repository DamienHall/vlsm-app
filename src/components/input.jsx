import React, { Component } from 'react';
import { IPv4, TYPE } from '../ipv4';
import 'w3-css';

const styles = {
  div:{},
  input:{
    width: '60%',
    marginLeft: '20%'
  },
  li:{
    listStyleType: 'none',
    width: '100%',
    textAlign: 'left',
    marginLeft: '3%',
    padding: '10px',
    border: '1px solid'
  },
  button:{
    margin: 10
  }
}

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      ipInfo: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = event => {
    this.setState({value: event.target.value});
    console.log(this.state.value);
  }

  render() {
    return (
      <div className="w3-container" style={styles.div}>
        <input type="text" value={this.state.value} onChange={this.handleChange} className="w3-input w3-border-light-green w3-pale-green w3-center" style={styles.input}/>
      </div>
    )
  }
}

export default Input;
