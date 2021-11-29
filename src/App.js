import React, { useState } from 'react';
import Title from './components/title';
import Input from './components/input';
import './App.css';
import 'w3-css';

function App() {
  const [text, setText] = useState('');
  return (
    <div className="w3-container w3-center">
        <Title text="IP Address"/>
        <Input className="Input"/>
        <button style={{margin: '10px'}} className="w3-button w3-blue">{text}</button>
        <button style={{margin: '10px'}} className="w3-button w3-blue">VLSM</button>
    </div>
  );
}

export default App;
