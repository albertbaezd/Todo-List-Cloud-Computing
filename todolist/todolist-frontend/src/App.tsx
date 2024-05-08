import React from 'react';

import './App.css';
import Todolist from './Todolist.tsx'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        <Todolist />
        
      </header>
    </div>
  );
}

export default App;
