import React, { FC, useEffect } from 'react';
import Route from 'types/Route';

type IProps = {
  route: Route
};

// This components validates the access of current user before entering the target routes
const ProtectedRoute: FC<IProps> = ({ route, children }) => {

  useEffect(() => {


  });
  
  return (
    <div>{children}</div>
  );
}

export default ProtectedRoute;