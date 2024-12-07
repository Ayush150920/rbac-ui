import React from 'react';

const ProtectedRoute = ({ children, allowedRoles, currentRole }) => {
  if (!allowedRoles.includes(currentRole)) {
    return <div className="text-red-500 text-center">Unauthorized - You do not have access to this page</div>;
  }

  return children;
};

export default ProtectedRoute;
