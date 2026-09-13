import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import API from "./services/api";

const AuthContext =
  createContext();

export const AuthProvider =
  ({ children }) => {
    const [user, setUser] =
      useState(null);

    const [loading,
      setLoading] =
      useState(true);

    const checkAuth =
      async () => {
        try {
          const res =
            await API.get(
              "/auth/me"
            );

          setUser(
            res.data.user
          );

        } catch {
          setUser(
            null
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    useEffect(() => {
      checkAuth();
    }, []);

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

        setUser(
          res.data.user
        );
      };

    const register =
      async (
        data
      ) => {
        await API.post(
          "/auth/register",
          data
        );
      };

    const logout =
      async () => {
        await API.post(
          "/auth/logout"
        );

        setUser(
          null
        );
      };

    return (
      <AuthContext.Provider
        value={{
          user,
          loading,
          login,
          register,
          logout
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

export const useAuth =
  () =>
    useContext(
      AuthContext
    );