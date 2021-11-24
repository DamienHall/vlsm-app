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
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange = event => {
    this.setState({value: event.target.value});
    console.log(this.state.value);
  }

  handleClick = event => {
    let prefix;
    let borrowedBits;
    if (this.state.value.split("/")[1].length > 2) {
      prefix = this.state.value.split("/")[1].split(".").map(a=>parseInt(a).toString(2)).join();
      prefix = (prefix.match(/1/g) || []).length;
      console.log(prefix);
    } else {
      prefix = parseInt(this.state.value.split("/")[1]);
    }
    borrowedBits = parseInt(this.state.value.split("/")[2]-this.state.value.split("/")[1]);
    let ip = new IPv4(this.state.value.split("/")[0], prefix);
    console.log(ip);
    let subnettedIPArray = ip.subnet(borrowedBits);
    console.log(subnettedIPArray);
    this.setState({ipInfo: subnettedIPArray});
    console.log(this.state.ipInfo);
  }

  render() {
    return (
      <div className="w3-container" style={styles.div}>
        <input type="text" value={this.state.value} onChange={this.handleChange} className="w3-input w3-border-light-green w3-pale-green w3-center" style={styles.input}/>
        <div>
          <button onClick={this.handleClick} className="w3-button w3-blue" style={styles.button}>Subnet</button>
          <button onClick={this.handleClick} className="w3-button w3-blue" style={styles.button}>VLSM</button>
        </div>
        <div className="w3-leftbar w3-border-green w3-pale-green">
          {
            this.state.ipInfo.map((a,b)=>{
              return <li style={styles.li} className="w3-border-green">Network Address: {a.getIP()}{` Broadcast Address: `+ a.getBroadcast()}</li>
            })
          }
        </div>
      </div>
    )
  }
}

export default Input;
