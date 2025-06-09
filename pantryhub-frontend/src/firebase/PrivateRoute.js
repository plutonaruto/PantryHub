// restricts access based on roles
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getUserRole } from './auth';

const PrivateRoute = ({ component: Component, allowedRoles, ...rest }) => {
  const userRole = getUserRole();

  return (
    <Route
      {...rest}
      render={(props) =>
        allowedRoles.includes(userRole) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/unauthorized" />
        )
      }
    />
  );
};

export default PrivateRoute;
