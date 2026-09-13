import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../services/api";


const TechnicianAuthContext =
  createContext(null);


export function TechnicianAuthProvider({
  children
}) {

  const [technician, setTechnician] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  const checkAuth = async () => {

    try {

      const res =
        await API.get(
          "/technicians/check-auth"
        );

      setTechnician(
        res.data.technician
      );

    } catch (error) {

      setTechnician(null);

    } finally {

      setLoading(false);

    }

  };


  const login = async (
    email,
    password
  ) => {

    const res =
      await API.post(
        "/technicians/login",
        {
          email,
          password,
        }
      );


    setTechnician(
      res.data.technician
    );


    return res.data.technician;

  };


  const logout = async () => {

    try {

      await API.post(
        "/technicians/logout"
      );

    } catch (error) {

      console.error(
        "Technician logout error:",
        error
      );

    } finally {

      setTechnician(null);

    }

  };


  useEffect(() => {

    checkAuth();

  }, []);


  return (

    <TechnicianAuthContext.Provider
      value={{

        technician,

        loading,

        login,

        logout,

        checkAuth,

      }}
    >

      {children}

    </TechnicianAuthContext.Provider>

  );

}


export function useTechnicianAuth() {

  return useContext(
    TechnicianAuthContext
  );

}