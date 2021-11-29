import React, { useState } from 'react';
import Title from './components/title';
import Input from './components/input';
import './App.css';
import 'w3-css';

function App() {
  const [count, setCount] = useState(0);
  let add = () => {
    setCount(count+1);
  }
  return (
    <div className="w3-container w3-center">
        <Title text="IP Address"/>
        <Input className="Input"/>
    </div>
  );
}

export default App;
