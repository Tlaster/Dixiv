import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import store from "./stores";
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <IntlProvider locale={store.language.local} messages={store.language.message}>
    <App />
  </IntlProvider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
