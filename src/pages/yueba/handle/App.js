import './assets/style/xiaofan.css'
import React, { Component } from 'react';
import { BrowserRouter, Route, browserHistory } from 'react-router-dom';
import Home from './modules/home/Home'
class App extends Component {
  render() {
    return (
      <div className="wrapper">
        <BrowserRouter history={browserHistory}>
          <Route path='/' component={Home} ></Route>
        </BrowserRouter>
      </div>
    );
  }
}
export default App;
