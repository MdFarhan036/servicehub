import {
  Navigate,
  Outlet
} from "react-router-dom";

import {
  useAuth
} from "./context/AuthContext";


export default function RoleRoute({
  allowedRoles
}) {

  const {
    user,
    loading
  } = useAuth();


  /*
  WAIT FOR AUTH CHECK
  */

  if (loading) {

    return (
      <div className="loader">
        Loading...
      </div>
    );

  }


  /*
  NOT LOGGED IN
  */

  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  /*
  ROLE NOT ALLOWED

  IMPORTANT:
  This is Admin Panel,
  so non-admin users should
  not be redirected into
  technician routes.
  */

  if (
    !allowedRoles.includes(
      user.role
    )
  ) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  /*
  ACCESS GRANTED
  */

  return <Outlet />;

}