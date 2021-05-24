import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';

require('dotenv').config()



ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
);