import React, { useState } from 'react';
<<<<<<< HEAD
import { Title, Input } from './customElements';
import './App.css';
=======
import Title from './components/title';
import Input from './components/input';
import './App.css';
import 'w3-css';
>>>>>>> 4b3c2dafa8d9b9c2705194cb0f7899de55bf1c1a

function App() {
  const [count, setCount] = useState(0);
  let add = () => {
    setCount(count+1);
  }
  return (
<<<<<<< HEAD
    <div className="App Column">
        <Title text="IP Subnet Calc"/>
=======
    <div className="w3-container w3-center">
        <Title text="sIP Address"/>
>>>>>>> 4b3c2dafa8d9b9c2705194cb0f7899de55bf1c1a
        <Input className="Input"/>
    </div>
  );
}

export default App;
