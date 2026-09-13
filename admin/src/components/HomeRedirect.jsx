import {
  Navigate
} from "react-router-dom";

import {
  useAuth
} from "./context/AuthContext";


export default function HomeRedirect() {

  const {
    user,
    loading
  } = useAuth();


  if (loading) {

    return (
      <div>
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
    ADMIN
  */

  if (
    user.role === "admin"
  ) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }


  /*
    TECHNICIAN
  */

  if (
    user.role === "technician"
  ) {

    return (
      <Navigate
        to="/technician/dashboard"
        replace
      />
    );

  }


  /*
    NORMAL USER
  */

  return (
    <Navigate
      to="/login"
      replace
    />
  );

}