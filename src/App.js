import React, { useState } from 'react';
import { Title, Input } from './customElements';
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  let add = () => {
    setCount(count+1);
  }
  return (
    <div className="App Column">
        <Title text="IP Subnet Calc"/>
        <Input className="Input"/>
    </div>
  );
}

export default App;
