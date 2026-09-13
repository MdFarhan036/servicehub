import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import TechnicianLayout
  from "../layouts/TechnicianLayout/TechnicianLayout";

import Login
  from "../pages/technician/Login/Login";

import Register
  from "../pages/technician/Register/Register";

import Dashboard
  from "../pages/technician/Dashboard/Dashboard";

import Jobs
  from "../pages/technician/Jobs/Jobs";

import JobDetails
  from "../pages/technician/JobDetails/JobDetails";

import Profile
  from "../pages/technician/Profile/Profile";

import Documents
  from "../pages/technician/Documents/Documents";

import Earnings
  from "../pages/technician/Earnings/Earnings";

import Notifications
  from "../pages/technician/Notifications/Notifications";

import Settings
  from "../pages/technician/Settings/Settings";

import TechnicianWallet
  from "../pages/technician/wallet/TechnicianWallet";

import {
  useTechnicianAuth,
} from "../context/TechnicianAuthContext";


function ProtectedRoute({ children }) {

  const {
    technician,
    loading,
  } = useTechnicianAuth();


  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }


  if (!technician) {

    return (
      <Navigate
        to="/technician/login"
        replace
      />
    );

  }


  return children;

}


export default function AppRoutes() {

  const {
    technician,
    loading,
  } = useTechnicianAuth();


  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }


  return (

    <Routes>


      {/* =====================================
          TECHNICIAN LOGIN
      ===================================== */}

      <Route
        path="/technician/login"
        element={
          technician ? (
            <Navigate
              to="/technician/dashboard"
              replace
            />
          ) : (
            <Login />
          )
        }
      />


      {/* =====================================
          TECHNICIAN REGISTER
      ===================================== */}

      <Route
        path="/technician/register"
        element={
          technician ? (
            <Navigate
              to="/technician/dashboard"
              replace
            />
          ) : (
            <Register />
          )
        }
      />


      {/* =====================================
          PROTECTED TECHNICIAN PANEL
      ===================================== */}

      <Route
        element={
          <ProtectedRoute>
            <TechnicianLayout />
          </ProtectedRoute>
        }
      >


        <Route
          path="/technician/dashboard"
          element={<Dashboard />}
        />


        <Route
          path="/technician/jobs"
          element={<Jobs />}
        />


        <Route
          path="/technician/jobs/:id"
          element={<JobDetails />}
        />


        <Route
          path="/technician/profile"
          element={<Profile />}
        />


        <Route
          path="/technician/documents"
          element={<Documents />}
        />


        <Route
          path="/technician/earnings"
          element={<Earnings />}
        />


        {/* TECHNICIAN WALLET */}

        <Route
          path="/technician/wallet"
          element={<TechnicianWallet />}
        />


        {/* NOTIFICATIONS */}

        <Route
          path="/technician/notifications"
          element={<Notifications />}
        />


        {/* SETTINGS */}

        <Route
          path="/technician/settings"
          element={<Settings />}
        />

      </Route>


      {/* =====================================
          ROOT REDIRECT
      ===================================== */}

      <Route
        path="/"
        element={
          <Navigate
            to={
              technician
                ? "/technician/dashboard"
                : "/technician/login"
            }
            replace
          />
        }
      />


      {/* =====================================
          UNKNOWN ROUTES
      ===================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to={
              technician
                ? "/technician/dashboard"
                : "/technician/login"
            }
            replace
          />
        }
      />

    </Routes>

  );

}