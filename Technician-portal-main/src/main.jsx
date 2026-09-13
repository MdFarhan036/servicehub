import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { TechnicianAuthProvider } from "./context/TechnicianAuthContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TechnicianAuthProvider>
        <App />
      </TechnicianAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);