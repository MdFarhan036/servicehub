import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import API from "../../services/api";


const AuthContext =
  createContext();


export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  /*
  ==========================================
  CHECK CURRENT ADMIN SESSION
  ==========================================
  */

  const refreshUser =
    async () => {

      try {

        const res =
          await API.get(
            "/auth/me"
          );

        const currentUser =
          res.data.user;


        /*
        ==========================================
        IMPORTANT:
        THIS PANEL ONLY ACCEPTS ADMIN
        ==========================================
        */

        if (
          currentUser?.role ===
          "admin"
        ) {

          setUser(
            currentUser
          );

        } else {

          /*
          Technician or any other user
          must not become authenticated
          in the Admin Panel.
          */

          setUser(null);

        }

      } catch (error) {

        setUser(null);

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    refreshUser();

  }, []);


  /*
  ==========================================
  ADMIN LOGIN
  ==========================================
  */

  const login =
    async (
      email,
      password
    ) => {

      const res =
        await API.post(
          "/auth/login",
          {
            email,
            password
          }
        );


      const loggedInUser =
        res.data.user;


      /*
      ==========================================
      ONLY ADMIN CAN LOGIN
      ==========================================
      */

      if (
        loggedInUser?.role !==
        "admin"
      ) {

        setUser(null);

        throw new Error(
          "Access denied. This account is not an admin account."
        );

      }


      setUser(
        loggedInUser
      );


      return loggedInUser;

    };


  /*
  ==========================================
  LOGOUT
  ==========================================
  */

  const logout =
    async () => {

      try {

        await API.post(
          "/auth/logout"
        );

      } catch (error) {

        console.error(
          "Logout failed:",
          error
        );

      } finally {

        /*
        Remove admin state
        */

        setUser(null);

      }

    };


  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


export const useAuth =
  () =>
    useContext(
      AuthContext
    );