// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import { store } from './store';
// import { Provider } from 'react-redux';
// import './assets/styles/index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//   </React.StrictMode>,
// );


import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { store } from './store';
import { Provider } from 'react-redux';
import { SocketProvider } from '@/context/SocketContext';
import { Capacitor } from '@capacitor/core';
import './assets/styles/index.css';

if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android') {
  document.documentElement.classList.add('native-android-app');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </Provider>
  </React.StrictMode>
);
