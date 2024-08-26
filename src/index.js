import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import{ UserProvider} from './context/UserContext';
import { I18nextProvider } from 'react-i18next';
import i18n from "i18next";
import en from './translations/en/global.json';
import es from './translations/es/global.json';
const root = ReactDOM.createRoot(document.getElementById('root'));
i18n.init({
  interpolation: { escapeValue: false },  // React already does escaping
  lng: window.location.pathname.substring(1,2) === 'es' ? 'es' : 'en', // language to use
  resources: {
      en: {
          translation: en
      },
      es: {
          translation: es
      }
  },
});
root.render(
  <React.StrictMode>
    <UserProvider>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
