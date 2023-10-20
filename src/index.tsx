import React from 'react';
import ReactDOM from "react-dom";
// import ReactDOM from "react-dom/client";
import './index.css';
import App from './App';

// TODO: Change for createRoot, can't right now cause it depends on ReactiveSearch v4, which drops direct ES support,
// Requires ReactiveSearch API which depends on their services, even when hosted (credentials)

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
