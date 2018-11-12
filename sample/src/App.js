import React, { Component } from 'react';

import { TestContainer } from './Test';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
            Movie DB
        </header>
        <TestContainer />
      </div>
    );
  }
}

export default App;
