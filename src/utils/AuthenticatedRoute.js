import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { get } from 'lodash';
import configureStore from '../redux/store';

const store = configureStore();

export default ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      console.log('user', user);

      return user && user.data && Object.keys(user.data) ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location }
          }}
        />
      );
    }}
  />
);
