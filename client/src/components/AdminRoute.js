import React from "react";
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const AdminRoute = (props) => {
    return props.isAdmin ? (
      <ProtectedRoute {...props} />
    ) : (
      <Navigate
        to={{
          pathname: "/",
        }}
      />
    );
}
export default AdminRoute;
