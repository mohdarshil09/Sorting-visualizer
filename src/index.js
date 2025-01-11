import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Import the Provider
import store from './store'; // Import your store
import App from './App'; // Your main component

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>  {/* Wrap your app with Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
