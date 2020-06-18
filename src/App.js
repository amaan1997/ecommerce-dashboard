import React from 'react';
import { Route, Switch, Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { NotificationContainer } from 'react-notifications';
import configureStore from './redux/store';
import Base from './utils/Base';
import history from './utils/history';

import Login from './components/Login';
import NoPageFound from './components/NoPageFound';

import './App.css';
import 'antd/dist/antd.css';
import 'react-notifications/lib/notifications.css';
import './assets/styles/index.scss';
import './utils/firebase';
import AuthenticatedRoute from './utils/AuthenticatedRoute';
import Dashboard from './components/Dashboard';

const store = configureStore();

function App() {
  return (
    <div className='app'>
      <NotificationContainer />
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path='/login' component={Login} />
            <Base />
            <Route component={NoPageFound} />
          </Switch>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
