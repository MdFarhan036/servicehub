import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useAuth
} from "../components/context/AuthContext";


export default function Login() {

  const nav =
    useNavigate();

  const {
    login
  } =
    useAuth();


  const [form, setForm] =
    useState({
      email: "",
      password: ""
    });


  const [loading, setLoading] =
    useState(false);


  const [error, setError] =
    useState("");


  const handleLogin =
    async () => {

      /*
      BASIC VALIDATION
      */

      if (
        !form.email.trim() ||
        !form.password
      ) {

        setError(
          "Email and password are required."
        );

        return;

      }


      try {

        setLoading(true);

        setError("");


        /*
        LOGIN
        */

        const user =
          await login(
            form.email,
            form.password
          );


        /*
        EXTRA ADMIN CHECK
        */

        if (
          user?.role !==
          "admin"
        ) {

          setError(
            "Access denied. This panel is only for administrators."
          );

          return;

        }


        /*
        ADMIN SUCCESS
        */

        nav(
          "/dashboard",
          {
            replace: true
          }
        );


      } catch (err) {

        console.error(
          "Login error:",
          err
        );


        setError(

          err.response?.data?.msg ||

          err.response?.data?.message ||

          err.message ||

          "Login failed"

        );


      } finally {

        setLoading(false);

      }

    };


  const handleSubmit =
    (e) => {

      e.preventDefault();

      handleLogin();

    };


  return (

    <div className="h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded shadow w-80">

        <h2 className="mb-4 font-bold">

          Admin Login

        </h2>


        {error && (

          <p className="text-red-500 mb-3">

            {error}

          </p>

        )}


        <form
          onSubmit={
            handleSubmit
          }
        >


          {/* EMAIL */}

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 border p-2"
            value={
              form.email
            }
            onChange={(e) =>
              setForm({
                ...form,
                email:
                  e.target.value
              })
            }
          />


          {/* PASSWORD */}

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-3 border p-2"
            value={
              form.password
            }
            onChange={(e) =>
              setForm({
                ...form,
                password:
                  e.target.value
              })
            }
          />


          {/* LOGIN */}

          <button
            type="submit"
            disabled={
              loading
            }
            className="bg-blue-600 text-white w-full p-2"
          >

            {loading
              ? "Logging in..."
              : "Admin Login"}

          </button>


        </form>

      </div>

    </div>

  );

}